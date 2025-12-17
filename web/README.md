# LogShield

**Safe log sanitization for developers.**

LogShield is a lightweight, developer-focused utility to automatically redact secrets, tokens, credentials, and sensitive data from logs before they are stored, shared, or shipped.

It is designed to be:
- **Deterministic** – predictable behavior, no AI, no guesswork
- **Safe by default** – minimal false positives in default mode
- **Strict when needed** – aggressive redaction via `strict` mode
- **Composable** – rule-based engine, easy to extend

---

## Why LogShield?

Logs are copied everywhere: CI output, bug reports, Slack, tickets, LLM prompts.

One leaked key is enough to:
- Compromise production systems
- Invalidate compliance (GDPR, SOC2)
- Burn trust instantly

LogShield exists to solve one problem extremely well:

> **Make logs safe to share.**

---

## Features

- Redacts common secrets:
  - API keys
  - Passwords
  - JWT tokens
  - Bearer tokens
  - Stripe keys
  - Cloud credentials (AWS, etc.)
  - Credit cards (Luhn-validated)
- Two modes:
  - **Default**: conservative, low false positives
  - **Strict**: aggressive, security-first
- Snapshot-tested, contract-tested
- Zero runtime dependencies

---

## Installation

```bash
npm install logshield
```

---

## Usage

### Basic

```ts
import { sanitizeLog } from "logshield";

const result = sanitizeLog("password=supersecret");
console.log(result.output);
// password=<REDACTED_PASSWORD>
```

### Strict mode

```ts
sanitizeLog(input, { strict: true });
```

---

## API

### `sanitizeLog(input: string, options?)`

Returns:

```ts
{
  output: string;
  matches: {
    rule: string;
    match: string;
  }[];
}
```

- `output` – sanitized log string
- `matches` – what was redacted and why (for auditing/debugging)

---

## Design Principles

- **No heuristics** – explicit rules only
- **No mutation magic** – transparent replacements
- **Locked behavior** – breaking changes require intent

This is a boring utility by design.

---

## Roadmap

- CLI (`logshield scan file.log`)
- GitHub Action
- Pre-commit hook
- Pro ruleset (enterprise patterns)

---

## License

MIT

