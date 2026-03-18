---
title: "LogShield v0.7.0: Regex Safety Hardening and Bounded Input Behavior"
description: "v0.7.0 adds per-line guardrails, bounded failure behavior for pathological input, and adversarial regression coverage without changing normal successful scan output."
date: "2026-03-18"
tags:
  - release
  - logshield
  - security
  - regex
  - hardening
---

v0.7.0 is a hardening release. It does not add new CLI flags or broaden detection coverage for normal logs. The focus is narrower: make pathological input handling explicit, bounded, and test-backed.

## What changed

The existing global input cap remains:

- **Maximum input size:** 200KB

v0.7.0 adds a second bound:

- **Maximum line length:** 64KB per line

If a single line exceeds the per-line cap, LogShield now fails with a deterministic error:

```txt
Log line <n> exceeds 64KB limit
```

This failure uses **exit code 2**, the same contract already in place for usage and runtime errors.

## Why add a line cap?

The total input cap already bounded memory and overall processing cost. The remaining gap was pathological single-line input, where regex-heavy scans can still do more work than expected even within a moderate total size.

The line cap closes that gap without touching successful output for normal logs.

## Regex safety hardening

This release also tightens the strict-mode credit card matcher. The previous pattern was more permissive on separator-heavy near-miss inputs - long runs of digits and separators that could cause weaker posture on adversarial input.

The change is targeted. The goal was to improve safety posture on that one rule while preserving existing detection semantics broadly.

## Regression coverage

v0.7.0 adds tests for line length boundary behavior, total input boundary behavior, multiline line-number reporting, near-miss regex cases, and adversarial inputs for strict-mode and detection-only paths.

That coverage is there to prove the bounds, not just describe them.

## Compatibility

- No new CLI flags
- No breaking change to normal successful scan or sanitize output
- Exit code 2 remains the bounded failure contract for usage, input, and runtime errors

## Upgrade notes

Most users will not notice any difference.

If your workflow intentionally feeds very large single-line blobs into LogShield, split them before scanning. The standard pipe pattern is unaffected:

```bash
cat app.log | logshield scan
```

To upgrade:

```bash
npm install -g logshield-cli@0.7.0
```

LogShield is built on deterministic local sanitization. That promise is not only about what gets redacted - it is about how the tool behaves when input is bad or malformed. v0.7.0 improves that posture in three ways: clearer bounded behavior, a tighter matcher on one important rule, and stronger adversarial coverage to prevent regressions. Smaller than a feature release, but exactly the kind of change that builds trust in a tool used on sensitive logs.
