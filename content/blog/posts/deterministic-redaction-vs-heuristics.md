---
title: "Deterministic Redaction vs Heuristics: Why Predictability Wins in Incident Response"
description: "I tried entropy-based detection once. It found secrets the regex missed—and also flagged half my stack traces. Here's why I went back to boring, predictable rules."
date: "2026-02-02"
---

There's a seductive idea in security tooling: if we just make the detection smarter, we'll catch more secrets. Entropy analysis. Machine learning. Contextual scoring. These sound great in demos.

Then you try to use them during an incident at 2 AM, and everything falls apart.

I learned this the hard way when I experimented with an entropy-based secret scanner. It caught a leaked API key that my regex-based tool missed. Great, right? Except it also flagged random UUIDs, base64-encoded images in JSON responses, and a bunch of hex strings that turned out to be request IDs. The false positive rate made it unusable in automated workflows.

The tool was smarter. But it wasn't more helpful.

## The incident response test

Here's the scenario that matters: it's late, something broke, and you need to share logs with your team (or worse, with a vendor's support team). You have minutes, not hours.

In that moment, you need to answer one question: "If I sanitize this log right now, will the output be safe to share?"

With deterministic redaction, the answer is yes or no based on explicit rules. You can review them. You can test them. You can diff two runs and understand what changed.

With heuristic detection, the answer is "probably, unless the model updated or the context shifted or the entropy threshold behaves differently on your log format."

That uncertainty kills adoption.

## What actually breaks during incidents

I've been through enough post-mortems to see the pattern. Logs leak not because the detection failed, but because the workflow broke:

- Someone bypasses the sanitizer because they're not sure what it will do.
- A CI pipeline produces different outputs on consecutive runs, and nobody trusts it anymore.
- The sanitized log gets diff-checked, but the diff is full of noise from probabilistic changes, so actual secrets slip through unnoticed.

The problem isn't technical capability. It's operational trust.

## Audit trails need boring answers

Compliance and audit workflows have a simple requirement: you need to explain what you did and prove it's repeatable.

That conversation looks like this:

> **Auditor:** "How do you ensure logs don't contain credentials before they're shared?"<br>
> **You:** "We run LogShield with these rules, which are tested against these fixtures, and produce deterministic output."

That's an answer you can defend.

Compare that to:

> **You:** "We use an ML-based classifier that scores entropy and context, and it gets updated monthly."<br>
> **Auditor:** "How do you validate the updates?"<br>
> **You:** "..."

The second approach isn't wrong. It's just harder to audit. And in regulated environments, "harder to audit" often means "not approved."

## The practical middle ground

I'm not saying heuristic detection is useless. I'm saying it belongs in a different layer.

The workflow I've settled on:

1. **At the boundary (human sharing, CI artifacts):** deterministic redaction. Boring, predictable, reviewable.
2. **In centralized storage (log aggregators, SIEM):** add DLP with smarter detection if you want.
3. **For policy enforcement:** use the deterministic layer to fail builds or block uploads.

This way, the riskiest path (logs leaving your control) is protected by the most reliable control.

## When deterministic rules miss something

This will happen. You'll find a secret format that your rules don't cover yet.

The correct response isn't to throw out determinism. It's to tighten the loop:

- Save the missed example (in a safe fixture, obviously).
- Write a rule that catches it.
- Add a test that proves the rule works.
- Ship an update.

That's how you grow coverage without losing predictability. The rule set evolves, but it evolves explicitly.

I maintain a growing test suite for LogShield that captures real leak patterns I've seen. When someone reports a false negative, I add it to the suite and update the rules. The next version catches it, and I can prove it with a test.

## A small example that matters

Here's what dry-run mode looks like with deterministic redaction:

```bash
$ cat incident-logs.txt | logshield scan --dry-run

logshield (dry-run)
Detected 3 redactions:
  AUTH_BEARER     x1
  PASSWORD        x2

No output was modified.
Use without --dry-run to apply.
```

That's it. No surprises. You know exactly what will be redacted before you commit to it.

Now imagine the same workflow with a probabilistic tool where the output might change between runs. You'd have to sanitize, inspect, re-sanitize, and hope nothing shifted. That adds friction, and friction kills adoption.

## The CI use case

If you want to enforce "no secrets in CI artifacts," you need a workflow that's stable enough to trust:

```bash
cat logs.txt | logshield scan --dry-run --fail-on-detect
```

This exits with code 1 if any redaction is detected. The build fails. You fix the source of the leak.

That only works if the detection is deterministic. If it's probabilistic, you get flaky builds and teams start bypassing the check.

## What I'd recommend

If you're building log sanitization into your workflow:

- Start with deterministic rules for the sharing boundary.
- Use dry-run mode to validate behavior before automating.
- Add heuristic layers later, if you need them, in less critical paths.
- Prioritize reviewability over cleverness.

The goal isn't to catch every possible secret. The goal is to catch the ones that actually leak, in a way that teams will actually use.

Boring wins.
