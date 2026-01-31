# Contributing

Thanks for considering contributing to LogShield.

LogShield is intentionally conservative: it prefers **not** to redact when unsure. Changes must be deterministic, regression-tested, and stable over time.

## Quick workflow

1. Fork the repo and create a branch.
2. Install dependencies:

```bash
npm ci
```

3. Run tests:

```bash
npm test
```

4. Run typecheck:

```bash
npm run typecheck
```

5. Build the CLI:

```bash
npm run build
```

## What makes a good PR

- Adds or updates tests for the change (Vitest)
- Preserves determinism (no randomness, no env-dependent behavior)
- Avoids new false positives
- Keeps output formats backward compatible unless explicitly discussed

## Rule changes

If you add or modify detection rules:

- Prefer precision over recall
- Add regression tests for both true positives and nearby false positives
- Include at least one negative example (should NOT redact)

## Style

- Keep code explicit and readable
- Avoid clever one-liners in critical parsing/matching logic
- Prefer small functions with clear names

## Security

If you believe you found a vulnerability, please follow `SECURITY.md`.
