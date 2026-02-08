# LogShield Roadmap (v0.6.0 → v1.0.0)

This roadmap is intentionally conservative. LogShield prioritizes deterministic behavior, low false positives, and stable CLI contracts.

## v0.6.0 — Modern token coverage + docs accuracy

**Goal:** close high-signal real-world leak gaps without introducing noisy heuristics.

- Add modern platform tokens:
  - GitHub classic tokens (`ghp_`, `gho_`, `ghu_`, `ghs_`, `ghr_`)
  - GitHub fine-grained tokens (`github_pat_...`)
  - Slack tokens (`xox*`, `xapp-...`)
  - npm access tokens (`npm_...`)
  - PyPI API tokens (`pypi-...`)
  - SendGrid API keys (`SG.<...>.<...`)
- Add private key block redaction (PEM/OpenSSH)
- Docs: clarify coverage by mode (Default vs Strict), document the 200KB safety cap

**Compatibility:** no CLI flag changes. Default mode may redact more secrets (intended).

## v0.7.0 — Regex safety hardening (ReDoS posture)

**Goal:** make worst-case inputs predictable and bounded.

- Engine guardrails:
  - Add `MAX_LINE_LENGTH` cap (e.g. 10KB) to limit pathological single-line regex behavior
  - Keep total input size cap (200KB) as the primary global safety bound
- Tests:
  - Add adversarial-regex regression tests (long runs, nested patterns)
  - Add boundary tests (near 200KB, near MAX_LINE_LENGTH)

**Compatibility:** new failure mode for extreme single-line inputs (explicit error + exit code 2).

## v0.8.0 — Operator ergonomics (without losing determinism)

**Goal:** improve usability in pipelines while keeping output contracts tight.

- CLI:
  - `--quiet` (suppress human report / summary; still exit codes behave)
  - Optional rule statistics in summary (lines processed, processing ms)
- Testing:
  - Add edge-case suite (unicode, mixed encodings best-effort, multi-line blocks)

**Compatibility:** output changes only when new flags are used.

## v0.9.0 — Packaging modernization

**Goal:** prepare for v1.0 API stability and ecosystem compatibility.

- Consider dual packaging (CJS + ESM) with explicit `exports`
- Tighten distribution guarantees:
  - `npm pack` verification stays mandatory
  - CI matrix remains

**Compatibility:** keep CLI entrypoint stable (`logshield` bin remains unchanged).

## v1.0.0 — Stability line

**Goal:** lock contracts and make upgrade expectations explicit.

- Freeze CLI output contracts and exit codes as “stable”
- Explicit policy for rule evolution (semver rules on false positives)
- Optional: publish a supported JS API **only if** it can match CLI guarantees

---

## Principles for all versions

- Deterministic output and explicit redaction markers
- Default mode must stay low-noise
- Any new redaction rule should ship with tests that prove:
  - no raw-secret leakage (including JSON/dry-run surfaces)
  - precedence/overlap does not corrupt structure
  - false positives are bounded
