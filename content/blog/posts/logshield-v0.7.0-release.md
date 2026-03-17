---
title: "LogShield v0.7.0: Regex Safety Hardening and Bounded Input Behavior"
description: "v0.7.0 adds per-line guardrails, bounded failure behavior for pathological input, and adversarial regression coverage without changing normal successful scan output."
date: "2026-03-17"
---

v0.7.0 is a hardening release. It does not add new CLI flags or broaden detection coverage for normal day-to-day logs. The focus is worst-case behavior: make pathological input handling explicit, bounded, and test-backed.

## What changed

The existing global input cap remains in place:

- **Maximum input size:** `200KB`

v0.7.0 adds a second bound:

- **Maximum line length:** `64KB` per line

If a single line exceeds that cap, LogShield now fails with a deterministic error:

```txt
Log line <n> exceeds 64KB limit
```

This failure continues to use **exit code `2`**, the same contract already used for usage and input/runtime errors.

## Why add a line cap?

The total input cap already bounded memory and overall processing cost. The remaining gap was pathological single-line input, where regex-heavy scans can still do more work than intended even inside a moderate total size.

The line cap closes that gap without changing successful output for normal logs.

## Regex safety hardening

This release also tightens one strict-mode matcher that had the weakest worst-case posture:

- **`CREDIT_CARD`** remains Luhn-validated
- the matcher was hardened to reduce separator-heavy ambiguous near-miss matching

This is deliberately narrow. The goal was not to refactor the rule engine or change detection semantics broadly. The goal was to improve safety posture while preserving existing behavior.

## Regression coverage

v0.7.0 adds targeted regression tests for:

- line length boundary behavior
- total input boundary behavior
- multiline line-number reporting
- regex near-miss cases
- adversarial inputs for strict-mode and detection-only paths

That coverage is there to prove the bounds, not just describe them.

## Compatibility

- **No new CLI flags**
- **No breaking change to normal successful scan/sanitize output**
- **Exit code `2` remains the bounded failure contract** for usage/input/runtime errors

## Upgrade notes

Most users do not need to change anything.

The only new behavior you may notice is on extreme single-line input. If your workflow intentionally feeds very large single-line blobs into LogShield, split them before scanning.

Typical shell pattern:

```bash
cat app.log | logshield scan
```

If the source can emit giant single-line payloads, pre-splitting or slicing is safer than relying on a single pass over an oversized line.

## Summary

v0.7.0 is a bounded-behavior release:

- same normal successful output
- tighter worst-case posture
- explicit failure for extreme single-line input
- stronger regression coverage around pathological cases

That is the entire point of this version.
