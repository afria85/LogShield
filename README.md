# LogShield

[![npm version](https://img.shields.io/npm/v/logshield-cli)](https://www.npmjs.com/package/logshield-cli)
[![npm downloads](https://img.shields.io/npm/dm/logshield-cli)](https://www.npmjs.com/package/logshield-cli)
[![CI](https://github.com/afria85/LogShield/actions/workflows/ci.yml/badge.svg)](https://github.com/afria85/LogShield/actions/workflows/ci.yml)

Your logs already contain secrets. You just don't see them.

LogShield is a small CLI that automatically redacts secrets from logs **before**
you paste them into CI, GitHub issues, Slack, or send them to third-party support.

No configuration. No cloud. Deterministic output.

---

## Quick start (30 seconds)

```bash
# Sanitize logs before sharing them
cat app.log | logshield scan
```

**Example input**

```txt
POSTGRES_URL=postgres://user:supersecret@db.internal
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

These are typical raw logs -- with secrets -- before you share them.

**Output**

```txt
POSTGRES_URL=postgres://user:<REDACTED_PASSWORD>@db.internal
Authorization: Bearer <REDACTED_TOKEN>
```

After LogShield, the same logs are safe to share.

---

## When should I use LogShield?

Use LogShield whenever logs leave your system:

- Before pasting logs into CI
- Before attaching logs to GitHub issues
- Before sending logs to third-party support
- Before sharing logs in Slack or email

---

## Preview before enforcing (dry-run)

```bash
# Preview what would be redacted (does not modify output)
echo "email=test@example.com Authorization: Bearer abcdefghijklmnop" | logshield scan --dry-run
```

```
logshield (dry-run)
Detected 2 redactions:
  AUTH_BEARER          x1
  EMAIL                x1

No output was modified.
Use without --dry-run to apply.
```

Notes:

- The report is printed to stdout
- No log content is echoed
- Output is deterministic and CI-safe

```bash
# Enforce redaction (sanitized output)
echo "email=test@example.com Authorization: Bearer abcdefghijklmnop" | logshield scan
```

- Prefer `--dry-run` first in CI to verify you are not over-redacting.
- Then switch to enforced mode once you are satisfied with the preview.

LogShield is a CLI tool that scans logs and redacts **real secrets**
(API keys, tokens, credentials) before logs are shared with others,
AI tools, CI systems, or public channels.

It is designed to be **predictable, conservative, and safe for production pipelines**.

---

## Website & Documentation

The website and documentation live in the `/docs` directory.
They are deployed to **https://logshield.dev** via Vercel.

---

## Why LogShield exists

Logs are frequently copied into:

- CI/CD logs
- Error reports
- Issue trackers
- Chat tools
- AI assistants

Once a secret appears there, it is already leaked.

Most existing tools fail because they:

- Redact too aggressively (false positives)
- Behave differently across runs
- Hide what was redacted and why

LogShield intentionally avoids those failures.

---

## Core principles (non-negotiable)

### 1. Deterministic output

The same input always produces the same output.

- No randomness
- No environment-dependent behavior
- Safe for CI, audits, and reproducibility

### 2. Zero false-positive fatality

LogShield must **not** redact non-secrets.

- IDs, hashes, order numbers, references must survive
- Losing debugging context is worse than missing a secret

When in doubt, LogShield prefers **not** to redact.

### 3. Explicit redaction markers

Every redaction is explicit and consistent.

Examples:

```
<REDACTED_PASSWORD>
<REDACTED_API_KEY>
<REDACTED_TOKEN>
<REDACTED_EMAIL>
```

No generic `[REDACTED]` placeholders.

---

## What LogShield does

- Scans plain-text logs
- Applies a fixed, deterministic rule set
- Replaces matched secrets with explicit markers

It does **not** learn, guess, or infer intent.

---

## What LogShield deliberately does NOT do

- No AI / LLM inference
- No entropy or probabilistic guessing
- No silent behavior changes
- No telemetry
- No network calls

These are intentional design decisions.

---

## Installation

```bash
npm install -g logshield-cli
```

---

## CLI Usage

```bash
logshield scan [file]
```

If a file is not provided and input is piped, LogShield automatically reads from **STDIN**.

---

## CLI Flags

- `--strict`  
  Aggressive, security-first redaction

- `--stdin`  
  Explicitly force reading from STDIN

- `--dry-run`  
  Detect sensitive data without modifying output

- `--fail-on-detect`  
  Exit with code `1` if any redaction is detected (CI-friendly)

- `--summary`  
  Print a compact redaction summary

- `--json`  
  JSON output (cannot be combined with `--dry-run`)

- `--version`  
  Print CLI version

- `--help`  
  Show help

---

## Basic usage

### Scan a file

```bash
logshield scan app.log
```

### Scan from STDIN (recommended for CI)

```bash
cat app.log | logshield scan
```

`--stdin` is optional; piped input is auto-detected.

---

## Dry-run (REPORT MODE, CI-safe)

Use `--dry-run` to **detect** sensitive data without modifying output.

```bash
cat app.log | logshield scan --dry-run
```

### Output

```
logshield (dry-run)
Detected 4 redactions:
  AUTH_BEARER          x1
  EMAIL                x1
  OAUTH_ACCESS_TOKEN   x1
  PASSWORD             x1

No output was modified.
Use without --dry-run to apply.
```

### Properties

- No log content is echoed
- Deterministic and snapshot-friendly
- Safe for CI pipelines

---

## Fail CI on detection

Use `--fail-on-detect` to exit with code `1` when secrets are found.

```bash
cat app.log | logshield scan --dry-run --fail-on-detect
```

Typical CI pattern:

```bash
logshield scan --dry-run --fail-on-detect < logs.txt
```

---

## GitHub Actions (example)

Minimal CI integration example:

```yaml
name: LogShield

on:
  push:
  pull_request:

jobs:
  logshield:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 18

      - run: npm install -g logshield-cli

      - name: Scan logs
        run: |
          cat logs.txt | logshield scan --dry-run --fail-on-detect
```

This will **fail the pipeline** if any secret is detected.

---

## Apply redaction

To actually sanitize logs, run **without** `--dry-run`:

```bash
cat app.log | logshield scan > sanitized.log
```

---

## Strict mode

Enable more aggressive detection rules:

```bash
logshield scan --strict < logs.txt
```

---

## Summary output

Print a compact rule-based summary:

```bash
logshield scan --summary < logs.txt
```

Example:

```
LogShield Summary
  API_KEY_HEADER: 1
  PASSWORD:       2
```

Notes:

- Sanitized log output is written to stdout
- The summary is written to stderr
- Rules are sorted alphabetically

---

## JSON output

Structured output for tooling and automation:

```bash
logshield scan --json < logs.txt
```

Notes:

- `--json` **cannot** be combined with `--dry-run`
- Usage errors exit with code `2`
- Output is always newline-terminated

---

## Exit codes

| Code | Meaning                              |
| ---: | ------------------------------------ |
|    0 | Success / no detection               |
|    1 | Detection found (`--fail-on-detect`) |
|    2 | Runtime or input error               |

---

## What gets redacted

Depending on rules and mode:

- Passwords
- API key headers
- Authorization bearer tokens
- JWTs
- Emails
- URLs with embedded credentials
- Database credentials
- Cloud provider credentials
- Credit card numbers (Luhn-validated)

---

## Modes

### Default mode (recommended)

- Conservative
- Low false positives
- Safe for sharing logs publicly

### Strict mode

- Aggressive
- Security-first
- May redact more than necessary

---

## Guarantees

LogShield guarantees:

- Deterministic output
- Stable behavior within **v0.4.x**
- No runtime dependencies
- Snapshot-tested and contract-tested
- No telemetry
- No network access

---

## Non-goals

LogShield is **not**:

- A DLP system
- A runtime security monitor
- A secret rotation solution

It is a **last-line safety net**, not a primary defense.

---

## Status

- Engine behavior locked
- Rule set evolving conservatively
- Open and free by design

---

## License

Apache-2.0
