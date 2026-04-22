# Changelog

## v0.7.1

### Fixed

- File input now takes precedence over auto-detected non-TTY stdin, while explicit `--stdin` plus a file remains a usage error
- Enforced the `200KB` total input cap and `64KB` per-line cap by UTF-8 byte length instead of JavaScript character count
- Corrected the README stability line from `v0.6.x` to `v0.7.x`

## v0.7.0

### Security

- Added a per-line safety cap (`64KB`) alongside the existing `200KB` total input cap
- Overlong single-line input now fails with a deterministic bounded error instead of flowing into rule evaluation
- Hardened the strict-mode credit card detector to reduce ambiguous separator-heavy matching on pathological near-miss input

### Improved

- Added adversarial regression coverage for line-length boundaries, multiline line reporting, and regex near-miss cases
- Added bounded-failure contract coverage for CLI and detection-only code paths

### Docs

- Synced README limits documentation with the final bounded input behavior and error contract

### Notes

- No new CLI flags
- No breaking changes to normal successful scan output
- Input/usage bounded failures continue to exit with code `2`

## v0.6.0

### Added

- Redact modern platform tokens (GitHub, Slack, npm, PyPI, SendGrid)
- Redact npmrc auth tokens (`:_authToken=...`)
- Redact private key blocks (PEM/OpenSSH, including ENCRYPTED PRIVATE KEY)

### Docs

- Clarified redaction coverage by mode (Default vs Strict) in README and docs
- Documented the 200KB input safety cap

### Notes

- No CLI flag changes
- This release may redact more secrets in default mode (intended)

## v0.5.0

### Security

- Hardened dry-run result shape: dry-run no longer returns the raw input in `output` (safe to serialize and avoids re-leakage in programmatic contexts)
- `--dry-run` can be combined with `--json` for machine-readable detection without leaking log content (`output` is intentionally empty)

### Added

- Added detection-only helper `scanLog(input)` (internal only; safe to serialize)

### Compatibility

- CLI behavior is unchanged: dry-run still prints a human report and never echoes log content
- Programmatic consumers: `dryRun` now returns `output: ""` (intentional)
- npm package ships CLI only; no supported JS API surface is published

## v0.4.4

### Fixed

- Expanded PASSWORD redaction to cover quoted values (including spaces) and JSON forms (`"password": "..."`)
- Expanded DB URL credential redaction to cover additional common schemes (`redis://`, `mssql://`, and variants)

### Notes

- No breaking changes
- Behavior is still deterministic; this release reduces false negatives in common log formats

## v0.4.3

### Fixed

- Prevented API key redaction from corrupting header names (`x-api-key`)
- Preserved key labels when redacting `api_key=...` values
- Corrected CLI exit code for invalid flag combinations (e.g., `--summary --json` exits with code 2)

### Improved

- Deterministic and aligned `--summary` output (alphabetical, indented)
- Hardened CLI behavior with end-to-end golden tests
- Strengthened regression coverage for rule overlap and precedence

### Notes

- No breaking changes
- No new features
- Hardening and correctness release

## v0.4.2

### Fixed

- CLI errors are now written to stderr (CI-safe piping)
- JSON output is newline-terminated
- URL redaction is no longer overly aggressive; only credentials and sensitive parameters are redacted
- PASSWORD redaction preserves original delimiter and spacing
- Improved dry-run reporting consistency
- Added contract tests for CLI output and URL behavior

## v0.4.1

### Fixed

- Prevented secret leakage in `--json` output by removing raw match values from the public result shape
- Forwarded `--dry-run` into the engine to ensure consistent, future-proof behavior

### Improved

- Expanded credential detection for common API key variants (`api_key`, `api-key`, `apikey`) and `Authorization: Bearer ...`
- Hardened AWS secret key strict detection to reduce false positives while keeping strict mode safe

### Notes

- No breaking changes
- No new features
- Stability and safety hardening release

## v0.4.0

### Changed

- License updated to Apache-2.0
- README, website, and blog content aligned to reflect the new license and current project state

### Notes

- No engine or CLI behavior changes
- No breaking changes

## v0.3.6

### Fixed

- `--summary` output now correctly written to stderr (safe for piping & redirects)

### Improved

- CLI documentation clarity

### Notes

- No breaking changes

## v0.3.5

### Fixed

- Corrected CLI version injection in built CJS output
- Ensured published npm package reflects actual CLI version

### Improved

- Deterministic `--dry-run` report formatting (aligned, CI-safe)
- Dry-run output now strictly non-contextual and stdout-only

### Notes

- No engine or rule behavior changes
- Pure CLI/build correctness release

---

## v0.3.4

### Fixed

- README CI badge link on npmjs.com

---

## v0.3.3

### Added

- `--dry-run` mode to detect secrets without modifying output
- CI-friendly detection workflow (`--dry-run --fail-on-detect`)

### Improved

- CLI UX consistency
- README documentation clarity

### Notes

- No breaking changes
- Engine behavior unchanged
