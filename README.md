---
# LogShield

LogShield is a CLI tool to **redact sensitive data from logs** before sharing them with others, AI tools, or public channels.

Designed to be safe by default, deterministic, and free of runtime dependencies.
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

Scan from stdin:

```bash
cat app.log | logshield scan
```

Strict mode (more aggressive):

```bash
logshield scan app.log --strict
```

JSON output:

```bash
logshield scan app.log --json
```

Summary only (printed to stderr):

```bash
logshield scan app.log --summary
```

---

## What Gets Redacted

- API keys
- Passwords
- JWT tokens
- `Bearer <TOKEN>` (always redacted)
- Stripe keys
- Cloud credentials (AWS, etc.)
- Credit cards (Luhn-validated)

---

## Modes

### Default (recommended)

- Conservative
- Low false positives
- Safe for sharing logs publicly

### Strict

- Aggressive
- Security-first
- May redact more than necessary

---

## Design Guarantees

- Deterministic output
- Zero runtime dependencies
- Snapshot-tested & contract-tested
- No network calls
- No telemetry

---

## Example

```bash
cat server.log | logshield scan --strict --summary
```

---

## License

ISC

---
