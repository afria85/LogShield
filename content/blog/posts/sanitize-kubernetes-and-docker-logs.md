---
title: "Docker and Kubernetes Logs: Sanitization Patterns That Matter"
description: "Common secret shapes in containerized systems and what to redact without breaking readability."
date: "2026-03-09"
---

Containerized systems concentrate a lot of secrets in a few places: environment variables, mounted config, sidecar logs, and service-to-service traffic. The logs reflect that.

If you operate Docker or Kubernetes workloads, you will see the same secret shapes repeatedly.

## The usual suspects

Connection strings are the most common: `postgres://user:pass@host/db`, Redis URLs, JDBC strings. Then cloud credentials in known formats, signed URLs, and tokens in headers — `Authorization: Bearer ...`, `X-API-Key: ...`. Apps that log request bodies or config fragments will also expose inline JSON payloads.

None of these are exotic. They show up in normal debug output.

## What makes Kubernetes logs tricky

Stdout and stderr are aggregated and shipped. Multiple workloads share the same log pipeline. Debug logging gets enabled under pressure when something breaks.

The common failure mode is sanitizing too late — after logs already left the cluster. The safer posture is to sanitize before sharing logs externally, which keeps raw material inside your boundary.

## A practical operator workflow

When you need to share logs outside the cluster:

```bash
# Extract the relevant slice
kubectl logs deploy/myapp --since=15m > raw.log

# Sanitize locally
cat raw.log | logshield scan > sanitized.log

# Share sanitized.log
```

The raw log stays internal. Only the sanitized version leaves.

## Keep structure intact

Most Kubernetes logs are structured JSON. If your sanitizer corrupts JSON, you lose the ability to query and filter — which is most of the value. Redact values. Leave formatting alone.

---

Next: structured JSON logs in more detail, including the classic pitfall of breaking parsers mid-pipeline.
