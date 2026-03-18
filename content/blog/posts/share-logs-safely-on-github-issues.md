---
title: "GitHub Issues and Pastebins: Share Logs Safely"
description: "A workflow for safe debugging collaboration: sanitize first, then share, with examples and gotchas."
date: "2026-03-02"
---

Public collaboration is powerful. It is also a different risk class.

When you open a GitHub issue on a public repo, you are not just sharing with maintainers. You are sharing with everyone, and the content is indexed by default.

Here is a workflow that keeps collaboration fast without normalizing accidental leaks.

## The workflow

Collect the minimal log slice that explains the problem. Run sanitization locally. Paste only sanitized output. If you need to attach a file, attach the sanitized version.

```bash
cat error.log | logshield scan > error.sanitized.log
```

Then paste the relevant excerpt from `error.sanitized.log`.

## Why minimal slice matters

Even sanitized logs can contain sensitive operational information: internal hostnames, customer identifiers in URLs, file paths that reveal internal structure. A smaller slice reduces both leakage risk and reader fatigue.

This is not about being unhelpful. It is about sharing the right signal, not all the signal.

## Pastebins are not private

Temporary sharing links and public pastebins carry the same risk as a public issue. The link can leak, the content can be scraped, and many services retain content indefinitely. If you would not put it in a public issue, do not put it in a pastebin either.

## A note on screenshots

Screenshots are sometimes used to avoid accidentally pasting credentials, but they are not a reliable substitute. They can still capture secrets. They are hard to search and audit. And the sanitization problem does not go away — it just becomes harder to verify.

Sanitized text logs are the safer, more reviewable choice.

---

Next: containerized systems. Docker and Kubernetes logs have their own secret shapes and common failure points.
