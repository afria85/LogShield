import type { Rule } from "./types";

export const tokenRules: Rule[] = [
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
