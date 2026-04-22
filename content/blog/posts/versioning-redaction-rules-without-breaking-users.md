---
title: "Versioning Redaction Rules Without Breaking Users"
description: "A versioning strategy for sanitization tools that respects stability while still improving coverage."
date: "2026-04-06"
---

Rule updates are inevitable. Breaking users is optional.

The challenge with sanitization tools is that "breaking" can look like improvement. Adding coverage for a new token format is a good change — but it also means output changes for any log that contains that format. If someone has a CI test that asserts exact sanitized output, or a downstream parser that expects specific redaction labels, a coverage improvement is a breaking change from their perspective.

A versioning strategy is how you make improvements safe to ship.

## Define what stability means

You do not need to freeze everything. You need to freeze the parts users depend on.

Flag semantics are the most critical. If `--dry-run` means "preview only, no writes" in v0.6.0, it must mean the same thing in v0.7.0. If `--fail-on-detect` exits with code 1 on detection, that contract must hold across versions. Users build CI gates around these behaviors. A silent change breaks pipelines without any visible signal.

Exit codes are equally important. Code 0, 1, and 2 each carry meaning to any script that calls the tool. Changing what they mean — or adding a new case that used to return 0 and now returns 1 — breaks automation.

Output format stability matters for the same reason. If redaction labels change from `<REDACTED_BEARER_TOKEN>` to `<REDACTED_TOKEN_BEARER>`, anything that greps, parses, or counts on those labels breaks silently.

A concrete example: a team builds a post-incident report script that counts how many bearer tokens appeared in CI logs over the past month by grepping sanitized artifacts for `<REDACTED_BEARER_TOKEN>`. A label rename in a patch release silently drops their count to zero. The script keeps running, the reports keep generating, and the metric looks like an improvement. Nobody notices until someone audits the methodology.

Coverage itself does not need to be frozen — it is expected to grow. But changes to coverage should be documented so users can anticipate output changes.

## Prefer additive changes

Adding a new rule that catches a token format previously uncovered is additive. Nothing that used to be redacted stops being redacted. The only change is that some inputs now produce different output because more is caught.

Additive changes are the safest category, but they still change output. That is why golden fixtures matter: you can see the blast radius of an additive change before you ship it. The diff shows exactly which fixture inputs produced different output and exactly how they changed.

If the diff looks like expected coverage improvements — new token types being redacted, previously-missed shapes now caught — the change is safe. If the diff shows something unexpected — a value being redacted that should not be — the rule needs refinement before shipping.

## Treat format changes as breaking

If output format changes — redaction label wording, JSON field names, whitespace, or ordering — treat it as a breaking change regardless of whether the semantic coverage changed.

Format stability is what enables users to rely on the tool in automated pipelines. A pipeline that extracts redaction counts from JSON output will break if the field name changes from `detections` to `redactions`, even if the behavior is otherwise identical. That break is silent and can go undetected until someone investigates an anomaly weeks later.

Format changes should come with a major version bump and explicit migration guidance. The release notes should state clearly what changed, what the new format looks like, and what users need to update to maintain existing behavior.

## Write release notes that read like a contract

Trust in a security tool is built slowly and lost quickly. Release notes are a primary trust surface — they tell users whether it is safe to upgrade and what they need to verify after doing so.

Useful release notes for a sanitization tool answer four questions: what changed in behavior or coverage, what did not change and can be relied on, what risk the update introduces or reduces, and how the change was tested and validated.

For coverage updates, this means naming the new token formats, explaining the pattern rules, and pointing to the fixture coverage. For behavior changes, it means being explicit about which flags, exit codes, or output formats are affected. For breaking changes, it means providing a concrete migration path.

This is not marketing. It is operational documentation. Teams that run security controls in production need to make decisions about when to upgrade, and they need accurate information to make those decisions.

A practical habit when upgrading any sanitization tool: run the new version against your existing fixture suite before deploying to CI. If the diff is empty, the upgrade is safe. If the diff shows new redactions, review them and decide whether they are expected. If the diff shows fewer redactions than before, do not upgrade until you understand why.

That workflow only works if the tool ships with deterministic output and you maintain your own fixture baseline. Both are worth the setup cost.

Next: CLI sanitization versus centralized log pipelines — when each approach makes sense, and how to combine them without gaps.
