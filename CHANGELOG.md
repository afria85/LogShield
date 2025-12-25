# Changelog

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
