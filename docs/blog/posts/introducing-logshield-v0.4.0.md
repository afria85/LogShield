---
title: "Introducing LogShield v0.4.0"
date: "2026-01-07"
description: "A foundation release focused on licensing clarity and documentation consistency, without changing engine or CLI behavior."
---

# Introducing LogShield v0.4.0

v0.4.0 is a foundation release.  
There are no engine changes, no new features, and no behavior differences compared to previous versions.

This release focuses on clarity, consistency, and long-term maintainability of the project itself.

## Why LogShield exists

LogShield was created to solve a simple but recurring problem:  
logs often contain sensitive data, and once logs leave your machine or CI system, you lose control over them.

The goal of LogShield is intentionally narrow:

- **Deterministic** - sanitize logs predictably every time
- **Lightweight** - stay small with no complex runtime dependencies
- **Predictable** - avoid hidden behavior or implicit logic

It is designed to be boring, reliable, and easy to reason about.

## What changed in v0.4.0

Although there are no runtime changes, several important project-level improvements were made:

### License clarity

LogShield is now licensed under **Apache License 2.0**, which provides clearer reuse and contribution terms, especially in professional and organizational settings.

### Documentation consistency

The README, website, and blog content are now aligned in terminology, examples, and license references.

## What did not change

To keep existing workflows stable:

- No engine changes
- No rule changes
- No CLI output or flag changes
- No breaking changes

Upgrading to v0.4.0 is safe and does not affect existing usage.

## Looking forward

For now, the focus remains on keeping LogShield simple, predictable, and well-documented before expanding its scope further.

**Clarity first. Stability first.**

---

For usage details and source code, see the project README on GitHub.
