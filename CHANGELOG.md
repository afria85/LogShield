# Changelog

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
- Blog and docs structure consistency
- Shared `styles.css` and `main.js` across site pages

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
