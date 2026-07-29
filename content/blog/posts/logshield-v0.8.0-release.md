---
title: "LogShield v0.8.0: Quiet Mode, Summary Stats, and Operator Edge Cases"
description: "v0.8.0 improves CI and pipeline ergonomics with quiet mode, optional summary stats, and edge-case coverage without changing redaction rules."
date: "2026-07-29"
tags:
  - release
  - logshield
  - cli
  - ci
  - automation
---

v0.8.0 is an operator ergonomics release.

It does not add new redaction rules. It does not change default sanitized output. The focus is narrower: make LogShield easier to run in CI and scripted workflows without weakening the contracts that make it safe to automate.

This release adds two CLI flags: `--quiet` and `--stats`.

It also adds regression coverage for edge cases that show up around real log boundaries: Unicode text, malformed UTF-8 input, and multi-line private key blocks.

## Why quiet mode exists

CI gates often want an exit code, not a human report.

Before v0.8.0, `--dry-run --fail-on-detect` already worked as a policy gate:

```bash
cat logs.txt | logshield scan --dry-run --fail-on-detect
```

If LogShield detected a secret, it exited with code `1`. That contract has not changed.

The problem was output noise. In some pipelines, the dry-run report is useful. In others, the build system already records the failure and the only thing the caller needs is the exit code. `--quiet` covers that case:

```bash
cat logs.txt | logshield scan --dry-run --fail-on-detect --quiet
```

If secrets are detected, the command still exits with code `1`. It just does not print the human dry-run report.

That distinction matters. `--quiet` suppresses human reporting. It does not turn off detection, alter redaction, or change exit code behavior.

## Summary stats

`--summary` prints a compact rule-based summary to stderr while keeping sanitized log output on stdout:

```bash
cat logs.txt | logshield scan --summary
```

v0.8.0 adds optional processing stats:

```bash
cat logs.txt | logshield scan --summary --stats
```

Example:

```txt
LogShield Summary
  PASSWORD  x1

Stats
  lines_processed  2
  processing_ms    3
```

The stats are intentionally small: `lines_processed` and `processing_ms`.

They are there for pipeline observability, not for profiling. You can record whether LogShield actually processed the expected amount of input and whether runtime changed dramatically after a workflow change.

`--stats` requires `--summary`. It is not supported with `--dry-run`, because dry-run has its own reporting contract and must stay focused on detection without emitting log content.

## What did not change

The important compatibility point: normal usage is unchanged.

These commands keep their existing behavior:

```bash
cat logs.txt | logshield scan
cat logs.txt | logshield scan --dry-run
cat logs.txt | logshield scan --json
cat logs.txt | logshield scan --json --dry-run
```

There are no new default redactions in v0.8.0. If you do not use the new flags, successful output should remain the same.

Exit codes also remain stable: `0` for success, `1` when detections are found with `--fail-on-detect`, and `2` for usage, bounded input, or runtime errors.

`--quiet` preserves that contract. A quiet failure is still a failure.

## Edge-case coverage

v0.8.0 also adds tests around cases that are easy to under-specify:

**Unicode log text** - Sanitization should preserve non-ASCII context while still redacting sensitive values.

**Malformed UTF-8 stdin** - CLI input is decoded best-effort, and later detections must still happen. A malformed byte sequence should not cause the rest of the stream to be ignored.

**Multi-line private key blocks** - Complete private key blocks should be redacted as a block before nested rules run, so sensitive material inside the block does not leak through partial matching.

These are not new user-facing rules. They are regression coverage for behavior LogShield already needs in real workflows.

## Upgrading

Install the new version:

```bash
npm install -g logshield-cli@0.8.0
```

Smoke test quiet mode:

```bash
printf "password=secret123\n" | logshield scan --dry-run --fail-on-detect --quiet
echo $?
```

You should see exit code `1` and no dry-run report.

Smoke test stats:

```bash
printf "password=secret123\nnormal\n" | logshield scan --summary --stats
```

You should see sanitized output on stdout and the summary plus stats on stderr.

## What's next

v0.8.0 closes the operator ergonomics item on the roadmap.

The next planned work is packaging modernization: preparing for v1.0 by tightening distribution guarantees and evaluating dual CJS/ESM packaging without changing the `logshield` CLI entrypoint.

The theme stays the same: improve the tool around the edges without making the core behavior surprising.
