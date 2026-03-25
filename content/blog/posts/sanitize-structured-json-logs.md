---
title: "Structured JSON Logs: Sanitization Without Breaking Parsers"
description: "How to redact secrets in JSON logs while preserving valid JSON, key names, and downstream tooling."
date: "2026-03-16"
---

Structured logs are great until your redaction pipeline turns them into invalid JSON.

When logs are JSON, you need two things at the same time:

- remove sensitive values
- keep the log parseable

If you fail the second, your tooling breaks — search, correlation, dashboards all depend on valid structure. If you fail the first, you leak. Both failures are silent unless you test for them explicitly.

## Why JSON sanitization is harder than plain-text sanitization

Plain-text redaction is pattern matching on a flat string. JSON adds quoting, escaping, delimiters, and nesting. A sanitizer that is careless about those details will corrupt it.

The common failure modes:

### 1) Redacting by removing quotes

Bad example:

```json
{"token": <REDACTED>}
```

Now it is not JSON. Any downstream parser — Elasticsearch, Loki, your own tooling — will drop or reject the log line.

Correct example:

```json
{"token": "<REDACTED_TOKEN>"}
```

The replacement must be a valid JSON string. The key stays. The value is replaced, not removed.

### 2) Corrupting escape sequences

Tokens and secrets often include characters that require escaping in JSON: quotes, backslashes, control characters. A sanitizer that does naive string replacement can break valid escaping.

Concretely: if a token contains a `"` and your replacement logic patches text carelessly, you get an unbalanced string.

The practical requirement is simpler: replacements must preserve valid JSON string boundaries and escaping. Do not splice text in ways that leave the line syntactically broken.

### 3) Redacting keys

Keys are not usually secrets. Keys are context.

If you remove the key `authorization` entirely, you lose the signal that an authorization header was present. That information is useful for debugging and incident analysis — even when the value must not be logged.

The right contract: **keep keys, redact values**.

### 4) Flattening nested objects

JSON logs often carry nested structure:

```json
{
  "http": {
    "request": {
      "headers": {
        "authorization": "Bearer eyJhbGci..."
      }
    }
  }
}
```

A sanitizer that only handles obvious top-level cases will miss nested secrets entirely. Nested values still need to be covered without breaking the surrounding structure.

### 5) Treating arrays inconsistently

Arrays of strings and arrays of objects can both contain secrets. If your test fixtures only cover flat objects, you will miss realistic cases.

## Preserve "shape" for analytics

Structured logs power dashboards and alerting. The fields that matter are rarely the ones that contain secrets:

- `service`
- `env`
- `level`
- `error_code`
- `request_id`
- `trace_id`

Sanitization should not touch these unless there is a specific reason. The goal is targeted redaction — remove what must not be logged, keep everything else intact.

A sanitizer that removes too much is nearly as bad as one that removes too little. You lose the ability to debug, correlate, and alert.

## JSONL vs JSON arrays

Most log pipelines emit JSONL (newline-delimited JSON), not JSON arrays. Each line is an independent JSON object. This matters for how you apply sanitization:

- JSONL: process line by line, validate each line independently
- JSON array: parse the full structure, walk it once

A sanitizer that loads the entire file before processing is not suitable for streaming log pipelines. Line-by-line processing keeps memory bounded and latency low.

## A simple correctness test

After sanitization, validate that output is still parseable:

```bash
cat raw.jsonl | logshield scan > sanitized.jsonl
node -e "
  const fs = require('fs');
  const lines = fs.readFileSync('sanitized.jsonl', 'utf8').trim().split('\n');
  lines.forEach((line, i) => {
    try { JSON.parse(line); }
    catch (e) { console.error('Invalid JSON on line', i + 1, e.message); process.exit(1); }
  });
  console.log('All lines valid JSON');
"
```

Parseability is a hard requirement, not a nice-to-have. Treat it the same way you treat redaction coverage — test for it explicitly, fail the pipeline if it breaks.

## A note on testing coverage

Correctness testing has two axes:

1. **Redaction coverage**: are all secrets removed?
2. **Structural validity**: is the output still valid JSON?

Most teams test one or the other. Testing both, consistently, is what separates a tool from a control. Golden fixtures help here — commit known inputs and expected outputs, and run them on every change.

For the broader contract around predictable automation behavior, see [Design Guarantees: Dry-Run, Exit Codes, and CI-Friendly Behavior](design-guarantees-exit-codes-and-dry-run.html).
