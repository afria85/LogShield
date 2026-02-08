---
title: "LogShield v0.6.0: Modern Token Coverage (GitHub, Slack, npm, PyPI, SendGrid)"
description: "v0.6.0 adds the tokens that actually leak in real logs—GitHub PATs, Slack tokens, npm credentials—without changing how the tool behaves."
date: "2026-02-08"
---

I've been tracking GitHub issues and incident reports where secrets leaked through logs, and there's a clear pattern: modern platform tokens show up constantly. Not AWS keys. Not database passwords (though those leak too). It's `ghp_...` tokens, `xoxb-...` Slack credentials, and npm access tokens that people paste into tickets without realizing what they're sharing.

v0.6.0 closes that gap. LogShield now catches these modern token formats in default mode, without requiring configuration or changing the CLI behavior you're used to.

## What changed

The core guarantee hasn't changed: same input, same output, every time. No AI. No guessing. Just explicit pattern matching that you can test and trust.

What's new is coverage:

**GitHub tokens** — Both classic prefixes (`ghp_`, `gho_`, `ghu_`, `ghs_`, `ghr_`) and fine-grained tokens (`github_pat_...`). These are everywhere in CI logs and stack traces.

**Slack tokens** — The common formats: `xoxb-`, `xoxp-`, `xoxa-`, `xoxs-`, `xoxr-`, and app tokens (`xapp-1-...`). If you've ever debugged a Slack integration, you know how easy it is to log these by accident.

**npm tokens** — Modern npm access tokens (`npm_...`) and the `.npmrc` format (`:_authToken=...`). I've seen these leak when people share build logs for debugging.

**PyPI tokens** — The current PyPI API token format (`pypi-...`). Less common than npm, but just as sensitive.

**SendGrid keys** — The three-part format (`SG.<...>.<...>`). Email service credentials leak surprisingly often in integration test output.

**Private key blocks** — Multi-line PEM and OpenSSH private keys, including encrypted variants. These show up when someone copies terminal output that includes key generation or when misconfigured logging dumps environment setup.

All of these rules are prefix-anchored and length-bounded. The goal is precision: catch real secrets, avoid false positives. No entropy scoring, no probabilistic guessing.

## A concrete example

Before v0.6.0, this would pass through unchanged:

```txt
token=ghp_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
slack_token=xoxb-1234567890-123456789012-abcdefABCDEFabcdefABCDEF
npm_token=npm_abcdefghijklmnopqrstuvwxyz0123456789
```

Now you get:

```txt
token=<REDACTED_GITHUB_TOKEN>
slack_token=<REDACTED_SLACK_TOKEN>
npm_token=<REDACTED_NPM_TOKEN>
```

The markers are explicit. You know what was redacted and why.

## Why this matters for dry-run and JSON output

One failure mode I keep seeing in other tools: they detect secrets, then leak them again in their own output. The detection result includes the raw matched value, which gets logged to a dashboard or aggregated somewhere, and now you've just moved the problem.

LogShield avoids this:

- Dry-run mode doesn't echo log content.
- JSON output doesn't include raw match values.
- When you use `--dry-run` programmatically, the output field is intentionally empty.

This makes it safe to pipe JSON results into monitoring systems or CI artifacts without creating a new leak vector.

## Default mode vs strict mode (quick reminder)

Default mode is designed to stay low-noise. It catches the obvious stuff without destroying debugging context.

Strict mode adds more aggressive patterns—credit card validation via Luhn, certain cloud vendor keys, things that have higher false positive risk. If you're working with highly variable logs or debugging unfamiliar systems, start with default mode. Only enable strict where the trade-off makes sense.

## Upgrading

No CLI flag changes. No new required configuration. Just install v0.6.0 and you get broader coverage.

If you have snapshot tests that assert exact redacted output, you'll need to update them—this release intentionally redacts more in default mode.

Quick smoke test to validate the upgrade:

```bash
echo "ghp_AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" | logshield scan --dry-run
```

You should see `GITHUB_TOKEN` in the detection summary.

## What's next

v0.6.0 focuses on coverage—catching the tokens that actually leak in real workflows. The next step is robustness.

v0.7.x will add regex safety hardening for adversarial inputs, plus boundary tests near the 200KB safety cap. The goal is to make worst-case behavior predictable and bounded, not just best-case.

After that, operator ergonomics: quiet mode, safe statistics, better handling of edge cases like mixed encodings.

LogShield will continue to prioritize predictability over "catch everything" heuristics. In incident response and CI workflows, stability beats surprises.

## One more thing

If you're using LogShield in production, I'd love to hear about it. What works? What doesn't? What leak patterns are you seeing that I'm missing?

The goal is to make LogShield boring and reliable—the kind of tool you wire into your workflow and then forget about because it just works.
