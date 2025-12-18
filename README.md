# ?? LogShield

LogShield is a CLI tool to **redact real sensitive data from logs** before sharing them with others, AI tools, CI systems, or public channels.

It is designed to be **deterministic**, **safe by default**, and free of runtime dependencies.

---

## Install

```bash
npm install -g logshield-cli
```

---

## Usage

Scan a log file:

```bash
logshield scan app.log
```

Scan from stdin (auto-detected):

```bash
cat app.log | logshield scan
```

Explicit stdin mode:

```bash
cat app.log | logshield scan --stdin
```

Strict mode (more aggressive redaction):

```bash
logshield scan app.log --strict
```

JSON output (machine-readable):

```bash
logshield scan app.log --json
```

Print summary to stderr:

```bash
logshield scan app.log --summary
```

Fail CI if any secret is detected:

```bash
logshield scan app.log --strict --fail-on-detect
```

---

## What Gets Redacted

- Passwords (`password=...`, DB URLs)
- API keys (query params, headers)
- JWT tokens
- `Authorization: Bearer <TOKEN>`
- Stripe secret keys
- Cloud credentials (AWS access & secret keys)
- OAuth access & refresh tokens
- Credit cards (Luhn-validated, strict mode)
- URLs (sanitized to avoid leaking endpoints)

---

## Modes

### Default (recommended)

- Conservative
- Very low false positives
- Preserves debugging context

### Strict

- Security-first
- Redacts more aggressively
- Suitable for CI, support bundles, and AI sharing

---

## Design Guarantees

These guarantees are **locked for v0.3.x**:

- Deterministic output (same input ? same output)
- Zero runtime dependencies
- No network calls
- No telemetry or tracking
- Snapshot-tested & contract-tested
- Fixed rule order (token ? credential ? cloud ? CC ? URL ? custom)

When in doubt, LogShield prefers **not** to redact.

---

## Example

```bash
cat server.log | logshield scan --strict --summary
```

---

## Non-goals

LogShield is **not**:

- A DLP system
- A runtime security monitor
- A replacement for secret rotation

It is a **last-line safety net**, not a primary defense.

---

## License

ISC
