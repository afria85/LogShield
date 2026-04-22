---
title: "Logs Are Documents: Treat Sanitization as Publishing, Not Filtering"
description: "A mental model that helps teams ship safer debugging artifacts without turning sanitization into a guessing game."
date: "2026-04-27"
---

Here is a mental model that reframes how teams should think about log sanitization:

Logs are documents.

Not internal scribbles. Not temporary debug output that disappears when the session ends. Documents — things that get copied into tickets, forwarded to vendors, archived in CI systems, pasted into GitHub issues, and read months later by people who were not in the room when they were written.

Once you accept that framing, a lot of behaviors that feel optional become obviously necessary.

## Sanitization is a publishing step

Publishing means you do a review pass before something leaves your boundary. A technical writer does not ship a document and then check if sensitive content is in it. The review is part of the workflow, not an afterthought.

Log sharing works the same way. Sanitization is the review pass. It happens before the log leaves — not after you notice something was in it.

The alternative is what most teams currently do: share first, realize the problem later, rotate credentials, and add a note to the post-mortem about being more careful next time. The mental model of "logs as internal scribbles" enables that pattern. The mental model of "logs as documents" prevents it.

## Documents preserve structure

When a document contains sensitive content, you redact the sensitive part. You do not destroy the paragraph it was in. A redacted legal document still has its headings, its clause structure, its surrounding context. The reader knows what type of information was present even if they cannot see the value.

Log sanitization should work the same way. Keep the key name. Keep the surrounding context. Keep the JSON structure. Replace only the sensitive value, and replace it with a label that tells the reader what was there.

`{"authorization": "<REDACTED_BEARER_TOKEN>"}` is a redacted document. The reader can see that an authorization header was present, that it was a bearer token, and that it was removed intentionally.

`{"<REDACTED>": "<REDACTED>"}` is a corrupted document. The reader cannot tell what was there, what type of thing it was, or whether the redaction was correct. It is not auditable and not useful for debugging.

## Documents have style guides

If logs are documents, sanitization rules are the publishing style guide. Style guides define what gets removed, how redaction labels are formatted, what structure is preserved, and what counts as a sensitive value.

Like any style guide, sanitization rules need change control. Additive changes are normal — new token formats get added as coverage grows. Breaking changes require a deliberate decision and clear communication. Regressions get caught by tests.

Golden fixtures are the test suite for the style guide. They define exactly what the current rules do to known inputs. When rules change, the fixture suite tells you what changed — and makes the change reviewable, not invisible.

## Documents have an audit trail

When a document is published, there is a record: what was published, when, who approved it, and what version of the style guide applied.

Log sharing at enterprise maturity looks the same. When a sanitized log goes to a vendor or gets attached to an external ticket, there is a record of what was sent, when it was sent, and what the sanitized file contained. A hash of the sanitized artifact provides cryptographic proof of exactly what left the boundary.

This is not bureaucracy. It is the difference between "we think we only shared the sanitized version" and "we can prove it."

## The end state

The goal of treating logs as documents is not to make sharing harder. It is the opposite: to make safe sharing routine.

When sanitization is a publishing step — a normal part of how logs leave the system, with predictable tooling and a reviewable output — engineers stop treating it as an obstacle. The workflow becomes: collect the relevant slice, run the sanitizer, check the preview, share the result. Fast, auditable, and repeatable.

That is what "logs are documents" buys you. Safe collaboration becomes the default, not the exception.
