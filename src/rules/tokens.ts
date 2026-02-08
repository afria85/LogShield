import type { Rule } from "./types";

export const tokenRules: Rule[] = [
  // Multi-line private key blocks (PEM/OpenSSH). Run early to avoid leaking
  // partial material through other rules.
  {
    name: "PRIVATE_KEY_BLOCK",
    pattern:
      /-----BEGIN\s+(?:(?:RSA|EC|DSA)\s+)?(?:ENCRYPTED\s+)?PRIVATE\s+KEY-----[\s\S]*?-----END\s+(?:(?:RSA|EC|DSA)\s+)?(?:ENCRYPTED\s+)?PRIVATE\s+KEY-----/gi,
    replace: () => "<REDACTED_PRIVATE_KEY_BLOCK>",
  },
  {
    name: "OPENSSH_PRIVATE_KEY_BLOCK",
    pattern:
      /-----BEGIN OPENSSH PRIVATE KEY-----[\s\S]*?-----END OPENSSH PRIVATE KEY-----/g,
    replace: () => "<REDACTED_PRIVATE_KEY_BLOCK>",
  },
  {
    name: "PRIVATE_KEY_HEADER",
    pattern:
      /-----BEGIN\s+(?:(?:RSA|EC|DSA)\s+)?(?:ENCRYPTED\s+)?PRIVATE\s+KEY-----|-----BEGIN OPENSSH PRIVATE KEY-----/gi,
    replace: () => "<REDACTED_PRIVATE_KEY_HEADER>",
  },

  // Modern platform tokens (prefix-anchored, low false-positive).
  {
    name: "GITHUB_TOKEN",
    pattern: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36,255}\b/g,
    replace: () => "<REDACTED_GITHUB_TOKEN>",
  },
  {
    name: "GITHUB_FINE_GRAINED_TOKEN",
    pattern: /\bgithub_pat_[A-Za-z0-9]{22}_[A-Za-z0-9]{59}\b/g,
    replace: () => "<REDACTED_GITHUB_TOKEN>",
  },

  {
    name: "SLACK_TOKEN",
    pattern: /\bxox(?:b|p|a|s|r)-[A-Za-z0-9-]{10,250}\b/g,
    replace: () => "<REDACTED_SLACK_TOKEN>",
  },
  {
    name: "SLACK_APP_TOKEN",
    pattern: /\bxapp-\d-[A-Za-z0-9-]{10,250}\b/g,
    replace: () => "<REDACTED_SLACK_TOKEN>",
  },

  {
    name: "NPM_TOKEN",
    pattern: /\bnpm_[A-Za-z0-9]{36}\b/g,
    replace: () => "<REDACTED_NPM_TOKEN>",
  },


  {
    name: "NPMRC_AUTH_TOKEN",
    // .npmrc-style auth token, commonly seen as:
    //   //registry.npmjs.org/:_authToken=...
    pattern: /(:_authToken\s*=\s*)([^\s\r\n]+)/gi,
    replace: (_match, _ctx, groups) => `${groups[0]}<REDACTED_NPM_TOKEN>`,
  },

  {
    name: "PYPI_TOKEN",
    pattern: /\bpypi-[A-Za-z0-9_-]{85,200}\b/g,
    replace: () => "<REDACTED_PYPI_TOKEN>",
  },

  {
    name: "SENDGRID_API_KEY",
    pattern: /\bSG\.[A-Za-z0-9_-]{22}\.[A-Za-z0-9_-]{43}\b/g,
    replace: () => "<REDACTED_SENDGRID_KEY>",
  },

  {
    name: "JWT",
    pattern: /\beyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\b/g,
    replace: () => "<REDACTED_JWT>",
  },

  {
    name: "OAUTH_ACCESS_TOKEN",
    pattern: /\bya29\.[A-Za-z0-9._-]+\b/g,
    replace: () => "<REDACTED_OAUTH_TOKEN>",
  },

  {
    name: "OAUTH_REFRESH_TOKEN",
    pattern: /\b1\/\/[A-Za-z0-9._-]+\b/g,
    replace: () => "<REDACTED_OAUTH_REFRESH>",
  },

  {
    name: "AUTH_BEARER",
    pattern: /\bBearer\s+[A-Za-z0-9._-]+\b/g,
    replace: () => "Bearer <REDACTED_TOKEN>",
  },

  {
    name: "EMAIL",
    // Avoid corrupting URLs with embedded credentials like:
    //   https://user:pass@host
    // In those cases, `pass@host` can look like an email.
    // We therefore require a safe delimiter (whitespace/quotes/brackets/`=` or `: `) before the email.
    pattern:
      /(^|[\s"'\(\[\{<>,;]|=|:\s)([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gim,
    replace: (_match, _ctx, groups) => `${groups[0]}<REDACTED_EMAIL>`,
  },
];
