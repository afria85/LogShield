---
title: "GitHub Issues and Pastebins: Share Logs Safely"
description: "A workflow for safe debugging collaboration: sanitize first, then share, with examples and gotchas."
date: "2026-03-02"
---

Public collaboration is powerful. It is also a different risk class.

When you open a GitHub issue on a public repo, you are not just sharing with maintainers. You are sharing with everyone, and the content is indexed by default. That changes the calculus considerably compared to sharing in a private Slack channel or internal ticket.

Here is a workflow that keeps collaboration fast without normalizing accidental leaks.

## The workflow

Collect the minimal log slice that explains the problem. Run sanitization locally. Paste only sanitized output. If you need to attach a file, attach the sanitized version.

```bash
cat error.log | logshield scan > error.sanitized.log
```

Then paste the relevant excerpt from `error.sanitized.log`.

## Why minimal slice matters

Even sanitized logs can contain sensitive operational information: internal hostnames, customer identifiers in URLs, file paths that reveal internal structure, service names that should not be public.

Sanitization handles credentials and tokens. It does not handle everything. A smaller slice reduces the surface area that sanitization has to cover, and it reduces reader fatigue for the maintainer trying to help you.

This is not about being unhelpful. It is about sharing the right signal, not all the signal. A well-scoped log excerpt with a clear description of the problem is almost always more useful than a full log dump anyway.

## Pastebins are not private

"Temporary" links and public pastebins are a common workaround people use when they think something is too long for a GitHub issue. The assumption is that the link is obscure enough to be effectively private.

That assumption is wrong in a few ways.

Many pastebin services are indexed by search engines. Some aggregate and surface popular or recent pastes. Link-shortening services log destinations. If you share a pastebin link in a public forum — a GitHub issue, a Discord channel, a mailing list — the link itself becomes public, and search bots will eventually find it.

The more practical risk is retention. Pastebin services have no obligation to delete content when you stop using the service, close the account, or let the "expiry" date pass. Treating a pastebin as temporary storage for sensitive content is wishful thinking.

The rule is simple: if you would not paste it directly into the public GitHub issue, do not paste it into a pastebin that you then link from the public GitHub issue. The risk profile is the same.

## A note on screenshots

Screenshots are a common workaround when people want to share terminal output without risking a copy-paste accident. The logic is that a screenshot cannot be programmatically scraped for secrets the way plain text can.

That logic is weaker than it sounds.

Screenshots can and do contain secrets. If your terminal shows a bearer token or a connection string, a screenshot of that terminal shows the same thing. OCR tools can extract text from screenshots, and several security scanners already do this. The assumption that a screenshot is "safer" than text is not reliable.

Screenshots also create a different kind of problem: they are nearly impossible to audit. You cannot grep a screenshot. You cannot run it through a sanitizer. You cannot diff two versions. If you later realize a screenshot contained something sensitive, your options are limited to asking the platform to remove it and hoping it was not cached.

There is also the metadata issue. Screenshots taken on mobile devices often embed GPS coordinates. Screenshots from certain tools embed application version, OS version, and other system information in the file metadata.

Sanitized text logs are the safer, more auditable choice. They can be reviewed, diffed, run through tooling, and reproduced. A screenshot cannot.

## When you have already shared something unsanitized

It happens. Someone pastes raw logs into a public issue before realizing what was in them.

The steps are: edit or delete the comment immediately, rotate any credentials that appeared in the logs, check if the issue was indexed (GitHub issues are indexed very quickly — assume yes), and if the repo is public, check whether the content was scraped by any archiving services.

Rotating credentials is the critical step. Editing the comment removes the visible content but does not guarantee the content was never captured. Treat the credential as compromised and rotate it regardless.

---

Next: containerized systems. Docker and Kubernetes logs have their own secret shapes and common failure points.
