# Security Policy

LogShield is a deterministic CLI for sanitizing logs. Security issues can include:

- False negatives that miss common secret formats
- False positives that destroy important debugging context
- Leak paths where raw secrets could be emitted (especially in machine-readable output)

## Reporting a vulnerability

Please do **not** file a public GitHub issue if your report contains sensitive information (real secrets, tokens, credentials, customer data, or internal URLs).

Preferred: open a **private report** using GitHub Security Advisories:

1. Go to the repository "Security" tab
2. Select "Advisories"
3. Click "New draft security advisory"

If your report is **not** sensitive (no real secrets), you can open a normal issue.

## Supported versions

Only the latest release line is supported. Please reproduce with the latest version of `logshield-cli` before reporting.

## Guidance for reproduction

When possible, provide:

- the exact command you ran
- a minimal, fully redacted example input
- the expected output and the actual output
- your OS and Node.js version
