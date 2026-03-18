---
title: "Redact Secrets Without Destroying Debug Value"
description: "How to keep structure, labels, and context so your logs remain useful after sanitization."
date: "2026-02-16"
---

There is a reason teams keep sharing raw logs: sanitized logs are often useless.

This happens when redaction takes a "delete the line" approach, or when scripts corrupt structure in the process. If sanitization removes the clues needed to debug, people will bypass it. The goal is not maximum deletion. It is maximum safety with preserved signal.

## What makes a sanitized log still useful

Useful logs have three properties: structure (the log stays parseable, especially JSON), labels (you can see what kind of value was present — token vs password vs URL), and context (surrounding text stays intact so the error story still makes sense).

This is why redacting values is almost always better than dropping fields.

## Common mistakes that destroy debug value

**Dropping entire sections.** Removing every line that contains "Authorization" also removes the most important part of an auth failure. Better to keep the header name and redact the token value:

```txt
Authorization: Bearer <REDACTED_TOKEN>
```

**Corrupting JSON.** If your sanitizer breaks quoting or escapes, your parsing pipeline breaks with it. Replace only the value, keep valid JSON:

```json
{"password":"<REDACTED_PASSWORD>"}
```

**Redacting keys instead of values.** Removing the key name removes meaning. This:

```json
{"x-api-key":"<REDACTED_API_KEY>"}
```

is useful. This is not:

```json
{"<REDACTED>":"<REDACTED>"}
```

## Preserve the shape, not the payload

When people debug, they look for shapes: which header was present, which environment variable was set, which URL was used. Redaction should preserve those shapes while removing the sensitive payload.

## Validate before you send

Before sharing sanitized logs, ask three questions: Can you still identify the failing request? Can you still see which subsystem failed — db, cache, auth? Do you still have timestamps and correlation IDs?

If the answer is no, the problem is usually scope, not sanitization. Share a smaller slice.

Preview makes this easy to check before committing:

```bash
cat logs.txt | logshield scan --dry-run
```

If the preview shows critical context will be lost, adjust what you are sharing. Do not abandon sanitization.

---

Next: CI log retention. If support tickets are the human leak path, CI logs are the automated one.
