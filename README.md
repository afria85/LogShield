# ?? LogShield

Deterministic log sanitization for developers.

LogShield is a CLI tool that scans logs and redacts **real secrets** (API keys, tokens, credentials) without breaking log usefulness. It is designed to be predictable, conservative, and safe for production pipelines.

---

## ? Why LogShield exists

Logs are often copied into:

- CI logs
- Error reports
- Issue trackers
- Chat tools

Once a secret leaks there, it is already too late.

Most existing tools try to be "smart" and end up being dangerous:

- They redact too much (false positives)
- They behave differently across runs
- They hide _what_ was redacted and _why_

LogShield intentionally avoids those failures.

---

## ?? Core principles

These principles are **non-negotiable** and define all behavior.

### 1. Deterministic output

The same input will always produce the same output.

- No randomness
- No environment-dependent behavior
- Safe for CI/CD and audits

### 2. Zero false-positive fatal

LogShield must **not** redact data that is not a real secret.

- IDs, hashes, order numbers, and references must survive
- Losing debugging context is worse than missing a secret

When in doubt, LogShield prefers **not** to redact.

### 3. Predictable flags

Every redaction is explicit and consistent.

Example:

```
[REDACTED:STRIPE_SECRET]
[REDACTED:JWT]
[REDACTED:EMAIL]
```

No generic `[REDACTED]` placeholders.

---

## ? What LogShield does

- Scans plain text logs
- Applies a fixed set of deterministic rules
- Replaces matched secrets with explicit flags

It does **not** learn, guess, or infer intent.

---

## ?? What LogShield deliberately does NOT do

- ? No AI / LLM inference
- ? No probabilistic entropy guessing
- ? No automatic "smart" detection
- ? No silent behavior changes

These are intentional design decisions.

---

## ??? CLI usage

Basic usage:

```
logshield sanitize app.log
```

From stdin:

```
cat app.log | logshield sanitize
```

Strict mode (more aggressive rules, still conservative):

```
logshield sanitize app.log --strict
```

---

## ?? Example

Input:

```
POST /charge
Authorization: Bearer sk_test_51Nxxxx
userId=usr_839201
```

Output:

```
POST /charge
Authorization: Bearer [REDACTED:STRIPE_SECRET]
userId=usr_839201
```

Note that `userId` is preserved.

---

## ?? Guarantees

LogShield guarantees:

- Stable behavior across versions (unless explicitly documented)
- No hidden network calls
- No telemetry

---

## ?? Non-goals

LogShield is **not**:

- A DLP system
- A runtime security monitor
- A replacement for secret rotation

It is a **last-line safety net**, not a primary defense.

---

## ?? Status

- Engine behavior locked
- Rule set evolving conservatively
- Open and free by design

---

## ?? License

MIT
