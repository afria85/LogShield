---
title: "Common Redaction Mistakes: Over-Redaction, Under-Redaction, and Corrupted Semantics"
description: "Failure modes you can spot early, and how to design rules that do not create new problems."
date: "2026-04-20"
---

Most sanitization failures come from good intentions and rushed implementation. The pattern is consistent: someone builds a quick script under pressure, ships it, and the edge cases surface weeks later when they matter most.

Here are the failure modes that appear again and again.

## Over-redaction

The sanitized log no longer explains the problem. Engineers look at it and cannot tell what failed, which service was involved, or what the request contained. The instinct to sanitize aggressively — "when in doubt, remove it" — produces output that is technically safe and operationally useless.

The most common cause is deleting entire lines rather than replacing sensitive values. A line that contains a bearer token also contains the endpoint path, the response code, and the timestamp. All of that context is useful. Only the token value needs to go.

The second cause is redacting keys alongside values. Removing `authorization` from `{"authorization": "<REDACTED_TOKEN>"}` turns useful, auditable output into a mystery. You know something was redacted. You do not know what kind of thing it was. The key is not sensitive — it is context.

The third cause is overly broad regex patterns. A pattern designed to catch API keys that also matches UUID v4 values, request identifiers, or transaction hashes will destroy debugging context at scale. Scope patterns precisely. Use fixtures to validate that non-secret values pass through unchanged.

## Under-redaction

Obvious secrets still appear in shared logs. The most common version of this is a team that masks known environment variable names but does not account for how those same secrets appear in other contexts.

A database password registered as `DB_PASS` in a secrets masking system will get masked when it appears as `DB_PASS=...`. It will not get masked when it appears as part of a connection string: `postgres://user:s3cr3tpass@db.internal:5432/prod`. The value is the same. The format is different. The masking misses it.

The same applies to tokens. A GitHub PAT might appear as a bare string in one log line, embedded in a JSON field in another, and as a URL parameter in a third. Coverage that handles one shape but not the others is incomplete.

The fix is to build fixtures from real incident patterns, not from what you expect to see. When a new leak shape surfaces — whether from a bug report, a post-mortem, or a security review — add it to the fixture suite and write a rule that catches it. Coverage grows incrementally, and the fixture suite proves it works.

## Corrupted semantics

The sanitized log breaks something downstream. Parsers fail. Dashboards drop lines. Search indexes reject documents. This is the failure mode that is hardest to notice because it is silent — the log appears to have been processed, but the output is malformed.

The most frequent cause is JSON corruption. A sanitizer that operates on raw bytes without understanding JSON structure can break string escaping, remove closing braces, or produce unbalanced quotes. The result is a string that looks like JSON and is not.

For example, a token that contains a backslash requires `\\` in JSON encoding. A byte-level sanitizer that replaces the token value but does not re-encode the replacement can produce:

```json
{"token": "<REDACTED_TOKEN}
```

The closing quote is missing because the sanitizer consumed it as part of the match boundary. The log line is now invalid JSON. Elasticsearch rejects it. Your dashboard drops the line. The failure is silent until someone notices a gap in coverage metrics.

A subtler version is changing header names instead of values. Replacing `Authorization` with `<REDACTED>` breaks any downstream system that parses headers by name. The header name is not sensitive. Only the value is.

The fix is to treat structural validity as a hard requirement, not a property to check after the fact. If the input is JSON, validate that the output is valid JSON. Include structure tests in the fixture suite alongside redaction tests.

## No preview, no adoption

Engineers will not use a tool they cannot verify. If sanitization is a black box — input goes in, something comes out, no way to check what changed — the tool will be bypassed whenever stakes are high.

Dry-run mode addresses this directly. It shows what would be redacted without modifying output. Engineers can review the list before committing to the sanitized version. That review step is the difference between a tool people trust and a tool people use once and then work around.

Dry-run is not optional if you want consistent usage. It is the mechanism that turns "I think this is safe to share" into "I can see exactly what was removed and I know this is safe to share."

## No drift detection

Rules change. Detection patterns get updated, coverage gets extended, bugs get fixed. Without a way to verify that changes do not introduce regressions, you are flying blind.

The specific risk is silent regression: a rule change that was intended to improve coverage accidentally stops redacting a pattern that was previously caught. There is no error. The tool runs successfully. The output just contains something it should not.

Golden fixtures prevent this. A fixture is a known input with a known expected output. When rules change, you rerun the suite and compare. If anything changes unexpectedly, you catch it before it ships.

The fixture suite also makes coverage visible. You can look at the inputs and see exactly what the tool is tested against. When someone asks "does this catch Slack tokens?", you can point to a fixture that proves it does — or identify that one is missing and add it.

The five mistakes above are not exotic edge cases. They show up in the first iteration of most homegrown sanitization scripts. The fastest way to check whether your current tooling has them: run your sanitizer in dry-run against a log you know contains secrets, then read the preview output and ask whether a new engineer could understand what was removed and why. If the answer is no, you have at least one of these problems.

Next: a different angle on the same problem. Treating logs as documents rather than debug output changes how you think about sanitization — and makes the workflow easier to reason about.
