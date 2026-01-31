---
title: "What a Log Sanitizer Must Guarantee"
description: "A checklist of guarantees (determinism, reviewability, local-first) that make log redaction safe for real workflows."
date: "2026-01-31"
---

Most advice about log sanitization boils down to "run a regex" or "don't share logs." Neither survives contact with real workflows. People will share logs under pressure, and ad-hoc scripts break the moment log formats change.

I've found it more useful to think in terms of guarantees. If a sanitizer can't guarantee the basics, it's not safe to automate and it's hard to trust.

## Guarantee 1: Deterministic output

Same input in, same output out. Every time.

This matters because it's the difference between a tool you can wire into CI and a tool you only dare to use manually. If a sanitizer is probabilistic or time-dependent, you can't build reliable workflows around it.

I've written about this before, but it's worth repeating: determinism is not a nice-to-have. It's what makes a tool trustable in production.

## Guarantee 2: Local-first processing

Logs are sensitive by default. If sanitization requires sending raw logs to a remote service, you've created a new leak surface.

Local-first doesn't mean "never use cloud services." It means the default, safest path is to process logs locally, and you can prove that nothing is transmitted.

## Guarantee 3: Reviewability

A sanitizer shouldn't be a black box. At minimum, you need to be able to answer:

- What types of secrets were detected?
- How many redactions happened?
- Where did they occur (roughly), without leaking the secret itself?

In LogShield, this is why `--dry-run` exists:

```bash
# Human review
cat app.log | logshield scan --dry-run

# Machine-readable review (safe to archive in v0.5.0+ because output is empty)
cat app.log | logshield scan --dry-run --json
```

The point is to let people verify behavior before they trust automation.

## Guarantee 4: Structure preservation

Sanitized logs need to remain useful. In practice that means:

- don't corrupt JSON
- don't destroy key names
- don't remove entire lines unless you have to
- keep enough context to debug

If you redact a JSON value, keep keys and delimiters intact so parsers and dashboards keep working.

This is where most ad-hoc scripts fail. They "solve" leakage by deleting content, and the result isn't actionable.

## Guarantee 5: Bounded behavior (no surprises)

In enterprise workflows, predictability matters more than cleverness. A sanitizer needs:

- stable exit codes (so CI can make decisions)
- stable flag semantics (`--dry-run` must never modify output)
- clear failure modes (invalid flags should error, not silently continue)

A practical contract looks like:

- exit code 0: command succeeded
- exit code 1: detections found and `--fail-on-detect` was enabled
- exit code 2: usage or runtime error (invalid flags, missing file, etc.)

If you can't write tests for the tool's behavior, you won't be able to operate it safely.

## Guarantee 6: Safe by default

The default invocation needs to be the safest one that still works.

That usually means:

- no network calls
- no configuration required to get meaningful redaction
- no output formats that accidentally include raw secrets

That last point is subtle. In versions before v0.5.0, LogShield's `--dry-run --json` output included the raw input in the result object. If you serialized that to a log aggregator, you'd re-leak the secrets you were trying to detect. v0.5.0 fixes this by returning an empty output field in dry-run mode.

## Guarantee 7: Auditability (without retention)

You need to be able to prove what happened without storing the raw logs.

That means:

- machine-readable summaries that are safe to archive
- counts and classifications (what types were detected)
- no raw input echoed back in result objects

This is the difference between "it probably worked" and "we can show what happened" during incident response.

## Guarantee 8: Maintainable rule set

Secrets evolve. Detection rules need to keep up. But rule updates have to be governable:

- additive changes should be safe
- breaking changes should be rare and explicit
- regressions should be caught by fixtures

If a tool can't change without surprises, teams stop updating it. That's a different kind of risk.

## A quick evaluation checklist

When you evaluate any log sanitizer &mdash; including your own scripts &mdash; ask:

- Is output deterministic?
- Is processing local-first?
- Can I preview and review redactions?
- Does it preserve structure and labels?
- Are exit codes and errors stable?
- Are results safe to serialize and store?
- Is the rule set tested against real fixtures?

If you can answer "yes" to most of these, you're in reasonable shape.
