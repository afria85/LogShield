# &#x1F512; LogShield

Deterministic log sanitization for developers.

LogShield is a CLI tool that scans logs and redacts **real secrets** (API keys, tokens, credentials) before logs are shared with others, AI tools, CI systems, or public channels.

It is designed to be **predictable, conservative, and safe for production pipelines**.

---

## &#x1F4CC; Why LogShield exists

Logs are frequently copied into:

- CI/CD logs
- Error reports
- Issue trackers
- Chat tools
- AI assistants

Once a secret appears there, it is already leaked.

Most existing tools fail because they:

- Redact too aggressively (false positives)
- Behave differently across runs
- Hide what was redacted and why

LogShield intentionally avoids those failures.

---

## &#x1F512; Core principles (non-negotiable)

### 1. Deterministic output

The same input always produces the same output.

- No randomness
- No environment-dependent behavior
- Safe for CI, audits, and reproducibility

---

### 2. Zero false-positive fatal

LogShield must **not** redact non-secrets.

- IDs, hashes, order numbers, references must survive
- Losing debugging context is worse than missing a secret

When in doubt, LogShield prefers **not** to redact.

---

### 3. Predictable redaction flags

Every redaction is explicit and consistent.

Examples:

```
<REDACTED_PASSWORD>
<REDACTED_API_KEY>
<REDACTED_JWT>
<REDACTED_STRIPE_KEY>
<REDACTED_CC>
```

No generic `[REDACTED]` placeholders.

---

## &#x1F50D; What LogShield does

- Scans plain text logs
- Applies a fixed, deterministic rule set
- Replaces matched secrets with explicit markers

It does **not** learn, guess, or infer intent.

---

## &#x1F6AB; What LogShield deliberately does NOT do

- No AI / LLM inference
- No entropy or probabilistic guessing
- No silent behavior changes
- No telemetry
- No network calls

These are intentional design decisions.

---

## &#x1F4E6; Installation

```bash
npm install -g logshield-cli
```

---

## &#x1F5A5; CLI Usage

Scan a log file:

```bash
logshield scan app.log
```

Read from stdin:

```bash
cat app.log | logshield scan
```

Strict mode (more aggressive):

```bash
logshield scan app.log --strict
```

JSON output (machine-readable):

```bash
logshield scan app.log --json
```

Print redaction summary to stderr:

```bash
logshield scan app.log --summary
```

---

## &#x2699; CLI Flags

- `--strict`  
  Aggressive, security-first redaction

- `--stdin`  
  Explicitly read from STDIN

- `--fail-on-detect`  
  Exit with code `1` if any secret is detected (CI-friendly)

- `--json`  
  JSON output instead of plain text

- `--summary`  
  Print redaction summary to stderr

- `--version`  
  Print CLI version

- `--help`  
  Show help

---

## &#x1F527; CI / Pipeline Example

Fail the build if any secret appears in logs:

```bash
cat app.log | logshield scan --strict --fail-on-detect
```

Exit codes:

- `0` ? no secrets detected
- `1` ? secrets detected
- `2` ? runtime error

---

## &#x1F4DD; What gets redacted

- Passwords
- API keys
- JWT tokens
- `Authorization: Bearer <TOKEN>`
- Stripe secret keys
- Cloud credentials (AWS, etc.)
- Credit card numbers (Luhn-validated)
- Emails
- URLs

---

## &#x1F4CA; Modes

### Default mode (recommended)

- Conservative
- Low false positives
- Safe for sharing logs publicly

### Strict mode

- Aggressive
- Security-first
- May redact more than necessary

---

## &#x1F6E1; Guarantees

LogShield guarantees:

- Deterministic output
- Stable behavior within v0.3.x
- No runtime dependencies
- Snapshot-tested and contract-tested
- No telemetry
- No network access

---

## &#x26A0; Non-goals

LogShield is **not**:

- A DLP system
- A runtime security monitor
- A secret rotation solution

It is a **last-line safety net**, not a primary defense.

---

## &#x1F4E3; Status

- Engine behavior locked
- Rule set evolving conservatively
- Open and free by design

---

## &#x1F4DC; License

ISC
