---
title: How to Sanitize Logs in GitHub Actions
description: Step-by-step guide to automatically remove secrets from CI logs before they get stored or shipped.
date: 2025-12-25
---

CI logs are one of the most common places secrets accidentally end up. A failed API call prints the full request including the auth header. An environment variable gets echoed during debugging. A stack trace includes a database connection string.

GitHub Actions stores these logs for 90 days by default. Anyone with repo access can download them. If you ship logs to Datadog, Splunk, or any external service, those secrets now live there too.

I learned this the hard way after finding an AWS key in exported CI logs that had been sitting in our logging dashboard for weeks. Now I sanitize by default.

This guide shows how to add LogShield to your GitHub Actions workflow.

## The Basic Setup

Install LogShield and pipe your command output through it:

```yaml
name: Build and Test

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"

      - name: Install LogShield
        run: npm install -g logshield-cli

      - name: Run tests (sanitized output)
        run: npm test 2>&1 | logshield scan
```

The `2>&1` redirects stderr to stdout so both streams get sanitized. This is now my default setup for new repos.

## Saving Sanitized Logs as Artifacts

If you need to keep logs for debugging but want them clean:

```yaml
- name: Run application
  run: |
    npm start > raw.log 2>&1 &
    sleep 10
    kill $! || true

- name: Sanitize logs
  run: logshield scan < raw.log > sanitized.log

- name: Upload sanitized logs
  uses: actions/upload-artifact@v4
  with:
    name: logs
    path: sanitized.log
```

The raw log never leaves the runner. Only the sanitized version gets stored as an artifact.

## CI Gate: Fail if Secrets Detected

For stricter workflows, you can fail the build if LogShield detects secrets:

```yaml
- name: Check for secrets in logs
  run: |
    npm test > test.log 2>&1
    logshield scan --dry-run --fail-on-detect < test.log
```

This runs in dry-run mode (no modification) but exits with code 1 if any secrets are found. The build fails, alerting you to fix the leak at the source.

I use this on main branch builds where I want to catch leaks before they hit production logs.

## Sanitizing Docker Build Logs

Docker builds are notorious for leaking secrets through build args and multi-stage output:

```yaml
- name: Build Docker image
  run: |
    docker build -t myapp:latest . 2>&1 | logshield scan
```

Or save the full build log for later analysis:

```yaml
- name: Build and analyze
  run: |
    docker build -t myapp:latest . > docker-build.log 2>&1
    logshield scan < docker-build.log
    logshield scan --dry-run --summary < docker-build.log
```

The `--summary` flag gives you a count of what was redacted without printing the full log again.

## Strict Mode for Production

Default mode catches obvious secrets like passwords, bearer tokens, and API keys. For production deployments, use strict mode:

```yaml
- name: Deploy (strict sanitization)
  run: |
    ./deploy.sh 2>&1 | logshield scan --strict
```

Strict mode additionally catches AWS access keys, private key headers, and vendor-specific tokens like Stripe or Slack keys.

## Reusable Workflow

If you have many repos, create a reusable workflow:

```yaml
# .github/workflows/sanitized-run.yml
name: Run with sanitized output

on:
  workflow_call:
    inputs:
      command:
        required: true
        type: string
      strict:
        required: false
        type: boolean
        default: false

jobs:
  run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install LogShield
        run: npm install -g logshield-cli

      - name: Run command
        run: |
          if [ "${{ inputs.strict }}" = "true" ]; then
            ${{ inputs.command }} 2>&1 | logshield scan --strict
          else
            ${{ inputs.command }} 2>&1 | logshield scan
          fi
```

Then call it from other workflows:

```yaml
jobs:
  build:
    uses: ./.github/workflows/sanitized-run.yml
    with:
      command: npm test
      strict: false
```

This way you don't have to repeat the LogShield setup in every workflow.

## Advanced Patterns

A few patterns I've found useful:

**Sanitize and tee** - see output live while saving clean version:

```bash
npm test 2>&1 | tee raw.log | logshield scan
```

**Multiple commands** - wrap in a block:

```yaml
- name: Run integration tests
  run: |
    {
      echo "=== Database setup ==="
      ./scripts/setup-db.sh
      echo "=== Running tests ==="
      npm run test:integration
      echo "=== Cleanup ==="
      ./scripts/cleanup.sh
    } 2>&1 | logshield scan
```

**Conditional strict mode** - stricter on main branch:

```yaml
- name: Run with appropriate strictness
  run: |
    if [ "${{ github.ref }}" = "refs/heads/main" ]; then
      npm test 2>&1 | logshield scan --strict
    else
      npm test 2>&1 | logshield scan
    fi
```

## What This Does Not Solve

LogShield sanitizes log output. It does not:

- Prevent secrets from being used in the first place
- Replace GitHub's built-in secret masking
- Protect against secrets in source code

Use it as one layer in your security setup, not the only layer.

## Next Steps

Once you have LogShield in your CI:

- Add `--fail-on-detect` to critical workflows
- Review what gets caught with `--dry-run --summary`
- Consider `--strict` for production pipelines

The goal is to make sanitized logs the default, not an afterthought.
