---
title: "Regression Testing Redaction Rules with Golden Fixtures"
description: "A practical approach to preventing rule drift: fixture suites, contracts, and reviewable diffs."
date: "2026-03-30"
---

Redaction rules have a drift problem.

When you update rules — to improve coverage, fix a false positive, or add a new token format — you can accidentally stop redacting something you used to catch, start redacting something you should not, or corrupt output structure in a way that breaks downstream tooling. Any of those regressions will be silent unless you test for them explicitly.

The fix is to treat redaction rules like code: test them against known inputs, and fail when output changes unexpectedly.

## What a golden fixture is

A golden fixture is a pair of files: a known input and the expected sanitized output. When you run the sanitizer against the input, the result should match the expected output exactly. If anything changes, the test fails and you review the diff before deciding whether the change was intentional.

This turns rule changes from invisible surprises into reviewable artifacts. The diff tells you what changed, where, and whether it was expected. If you added a rule to catch Slack tokens, the diff should show exactly those values being redacted — nothing more, nothing less.

In practice, a fixture pair might look like this:

`fixtures/slack-token.input.txt`:
```txt
[INFO] Connected to Slack workspace
  token=xoxb-1234567890-123456789012-abcdefABCDEFabcdefABCDEF
  channel=#incidents
```

`fixtures/slack-token.expected.txt`:
```txt
[INFO] Connected to Slack workspace
  token=<REDACTED_SLACK_TOKEN>
  channel=#incidents
```

The surrounding lines are unchanged. The channel name is preserved. Only the token value is replaced. If a rule change accidentally starts redacting `#incidents` or drops the `[INFO]` line, the diff catches it immediately.

## What to include in fixtures

Fixtures should cover the shapes that actually appear in real logs, not idealized inputs.

Bearer tokens in plain text, connection strings with embedded credentials, JSON payloads with nested secrets, HTTP headers, multi-line output with secrets on one of many lines — all of these are distinct shapes that a sanitizer handles differently. Each one deserves its own fixture.

Tricky overlaps are especially important to capture: a token embedded inside a URL, a password inside a JSON value that is itself inside an array, a connection string on the same line as a stack trace frame. These are the cases most likely to break when rules change.

Do not use real secrets in fixtures. Use dummy values that match the format — correct prefix, correct length, correct character set — but are not real credentials. The goal is to test pattern matching, not to commit real secrets to a test suite.

Also include negative cases: inputs that should pass through unchanged. Transaction hashes, UUIDs, long hex strings, base64-encoded image fragments — these are values that look like they might match secret patterns but should not be redacted. If a rule change causes false positives on these inputs, the fixture suite will catch it.

A negative fixture for UUID might look like:

`fixtures/uuid-passthrough.input.txt`:
```txt
[INFO] Request processed request_id=550e8400-e29b-41d4-a716-446655440000 status=200
```

Expected output is identical to input. The UUID must pass through unchanged. If a regex change starts matching it — because UUID v4 shares character set with some token formats — this fixture fails and forces a review.

## The review loop

Adding a new fixture when you see a new secret shape in the wild is the primary way the suite grows. When a new token format surfaces — whether from an incident report, a user bug report, or a new platform integration — the workflow is: save a safe example that matches the shape, write a rule that catches it, add the fixture and expected output, and run the suite to confirm.

When rules change, rerun the full suite and diff the outputs. Any line that changed is a potential regression or an intentional improvement. Reviewing the diff is the same process as reviewing any other code change — it forces an explicit decision about whether what changed was expected.

Fixtures that cover structure — valid JSON in, valid JSON out; JSONL line count preserved; no extra whitespace introduced — prevent semantic breakage from going undetected.

## Why this matters for trust

Enterprise adoption of any security tool depends on boring promises that keep holding. The promise a sanitizer makes is simple: it redacts what it says it redacts, and it does not break what it touches.

Fixtures are how you prove that promise, not just assert it. They make behavior visible and auditable. When someone asks whether a specific token format is covered, you can point to the fixture. When a rule ships, you can show the diff that validated it. When a regression would have occurred, you can show the test that caught it.

That proof matters more than the implementation details. Teams adopt tools they can verify. If you are evaluating a log sanitizer for use in production pipelines, checking whether it ships with a fixture suite is a reasonable first question. It tells you whether the maintainers treat behavioral stability as a commitment or as a best-effort.

Next: versioning strategy. How do you ship better coverage without breaking users who rely on stable output?
