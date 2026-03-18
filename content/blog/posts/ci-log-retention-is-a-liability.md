---
title: "CI Log Retention Is a Liability"
description: "Why build logs are a common leak surface and how to sanitize output safely in CI pipelines."
date: "2026-02-23"
---

CI providers make it easy to forget a key fact: build logs are stored artifacts. They are retained, searchable, and frequently accessible to more people than production systems.

If you have ever printed an environment variable to debug a failing build, you already know how this becomes a leak.

## Why CI logs are uniquely risky

Build jobs run with powerful credentials — deploy keys, registry tokens, cloud access. They aggregate output from many tools, some of which print sensitive values by accident. Logs are retained by default. And when something breaks, logs get shared widely.

That combination makes CI one of the most common "whoops" surfaces.

## A minimal control that works

The pattern is simple: run the job, pipe sensitive output through sanitization, store only the sanitized artifact.

```bash
some_command_that_logs > raw.log
cat raw.log | logshield scan > sanitized.log
```

Upload `sanitized.log`. Not `raw.log`.

## Failing builds when secrets appear

For higher assurance, fail the build when a redaction would have happened:

```bash
cat raw.log | logshield scan --dry-run --fail-on-detect
```

This turns "secret in logs" into a visible failure instead of an invisible risk.

## The "just mask it" trap

Most CI systems include built-in secret masking. It helps, but it is not sufficient. Masking only covers secrets that were explicitly registered. It does not handle connection strings or tokens outside that list, and it does not protect logs that get copied out of the CI system for sharing.

Use masking as an extra layer. Do not rely on it as the primary control.

## A control engineers will actually use

The most effective controls are the easiest ones. If sanitization requires a platform change, it will not ship quickly. A single CLI command in the pipeline is usually the fastest path to meaningful risk reduction.

---

Next: a safe workflow for GitHub issues and public pastebins, where the risk profile changes when everything is indexed.
