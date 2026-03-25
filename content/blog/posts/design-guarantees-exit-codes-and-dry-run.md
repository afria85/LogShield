---
title: "Design Guarantees: Dry-Run, Exit Codes, and CI-Friendly Behavior"
description: "How predictable behavior and boring exit codes make sanitization automatable and trustworthy."
date: "2026-03-23"
---

Security controls live or die by behavior under automation.

If you want log sanitization to be more than a one-off manual step, the tool must behave predictably in scripts and CI. That means defining contracts upfront — and sticking to them. Dry-run mode and stable exit codes are two of the most important.

## Dry-run is not a gimmick

A real dry-run must satisfy a strict contract:

- it does not emit sanitized log content
- it reports what would be redacted
- it is safe to run on sensitive input — no accidental echoing of raw values

Dry-run is how you build internal trust. Engineers can preview and verify behavior before wiring the tool into pipelines. Without it, the only way to know what gets redacted is to run sanitization for real — which is not always reversible.

```bash
cat logs.txt | logshield scan --dry-run
```

The output tells you what would be redacted. No sanitized log stream is emitted. No raw log content is echoed back.

This sounds simple. It has nontrivial implications for implementation: dry-run needs an explicit, testable contract. If the same flow can accidentally fall through and write output, you have built a leak path into the feature that is supposed to prevent one.

## Exit codes are part of the API

In CI, exit codes are the decision point. Scripts do not read prose. They check return values.

A reasonable contract:

Exit code `0` means the command succeeded.

Exit code `1` means secrets were detected with `--fail-on-detect`.

Exit code `2` means invalid usage or a runtime/input failure.

This is boring. It is also exactly what you want. Boring exit codes are stable, documentable, and scriptable.

To enforce "no secrets in artifacts" as a CI gate:

```bash
cat logs.txt | logshield scan --dry-run --fail-on-detect
echo "Exit: $?"
```

If exit code is 1, the pipeline fails. No manual review step. No output-text parsing. The tool makes the decision; the script enforces it.

The alternative — relying on output text parsing to determine success — is fragile. Output formats change. Log levels change. Exit codes, if you commit to them, are stable across versions.

## Stdout vs stderr: define them deliberately

Output routing matters for piped usage:

- **stdout**: sanitized content (the actual output you pipe downstream)
- **stderr**: diagnostics or summaries that should not pollute the sanitized stream

If diagnostic output bleeds into stdout, every downstream consumer — file writers, log shippers, parsers — has to deal with mixed content. That is a correctness problem and a security problem.

LogShield's current contract is intentionally explicit:

In default sanitize mode, LogShield writes sanitized output to stdout.

With `--summary`, the summary is written to stderr.

In default `--dry-run`, the detection report is printed to stdout and no log content is echoed.

With `--json --dry-run`, LogShield produces machine-readable detection output with an intentionally empty `output` field.

The important thing is not that every tool chooses the same routing. The important thing is that the routing is stable, documented, and safe for automation.

## Error handling should be strict

A security control should fail closed.

If someone passes conflicting flags, the tool should error with exit code 2 and a clear message — not silently pick one behavior. Silent fallback creates risk because the caller does not know what actually ran.

Examples of inputs that should hard-fail:

- Unknown flag names (typos that disable intended behavior)
- Conflicting input sources (for example, trying to read both STDIN and a file at once)
- Bounded input failures and other runtime errors that make the result unsafe to trust

Strict error handling is not user-hostile. It is the opposite: it catches misconfiguration before it causes a real incident.

## Machine-friendly output requires deliberate design

There is a tension between human-readable and machine-readable output:

- humans want readable summaries with context
- machines want stable formats they can parse reliably

The safe approach is to treat them as separate modes with separate flags. Do not try to make a single output format serve both — it ends up serving neither well.

For machine-readable output, JSON is a reasonable choice. Define a schema, version it, and document it. If you change the schema in a minor version, you break scripts. Treat the output format as part of the public API.

One thing to be especially cautious about: machine-readable dry-run output. It is easy to accidentally include raw input values in a "what would be redacted" report. If that output ends up in CI logs, you have leaked exactly what you were trying to protect.

## The "control" mindset

When you design these behaviors, you are not just building a CLI. You are defining a control — something that will be embedded in:

- CI policies
- support workflows
- incident runbooks
- compliance evidence

Controls have different requirements than tools. A tool can behave slightly differently across versions and still be useful. A control cannot — it must be auditable, deterministic, and stable. When behavior changes, it must be documented and versioned.

That mindset naturally pushes you toward strict contracts: defined exit codes, stable output formats, explicit error modes, no silent fallbacks.

The test for whether something is a control: could you point an auditor at its behavior spec and say "it always does this"? If not, it is still a tool.

For the broader guarantee checklist behind that mindset, see [What a Log Sanitizer Must Guarantee](what-a-log-sanitizer-must-guarantee.html).
