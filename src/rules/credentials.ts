import type { Rule } from "./types";

export const credentialRules: Rule[] = [
  // password=... or password: ...
  {
    name: "PASSWORD",
    // Preserve delimiter and spacing so logs remain readable and diff-friendly.
    // Examples:
    //   password=secret  -> password=<REDACTED_PASSWORD>
    //   Password : 123   -> Password : <REDACTED_PASSWORD>
    pattern: /\b(password)(\s*[:=]\s*)([^\s]+)/gi,
    replace: (_match, _ctx, groups) => `${groups[0]}${groups[1]}<REDACTED_PASSWORD>`,
  },

  // DB URL credential: postgres://user:pass@host
  {
    name: "DB_URL_CREDENTIAL",
    pattern: /\b(postgres|mysql|mongodb):\/\/([^:\s]+):([^@\s]+)@/gi,
    replace: (_match, _ctx, groups) =>
      `${groups[0]}://${groups[1]}:<REDACTED_PASSWORD>@`,
  },

  /**
   * API key (common variants):
   * - apiKey=...
   * - api_key=...
   * - api-key: ...
   * - apikey=...
   * Supports '=' or ':' and optional quotes/spaces.
   */
  {
    name: "API_KEY",
    pattern:
      /\bapi(?:[_-]?key)\s*[:=]\s*["']?([A-Za-z0-9_\-]{16,})["']?\b/gi,
    replace: () => "<REDACTED_API_KEY>",
  },

  // x-api-key: ....
  {
    name: "API_KEY_HEADER",
    pattern: /\bx-api-key\s*:\s*["']?[A-Za-z0-9_\-]{16,}["']?\b/gi,
    replace: () => "x-api-key: <REDACTED_API_KEY>",
  },

  // authorization: Bearer ...
  {
    name: "AUTHORIZATION_BEARER",
    pattern: /\bauthorization\s*:\s*bearer\s+([A-Za-z0-9._\-]{16,})\b/gi,
    replace: () => "authorization: Bearer <REDACTED_TOKEN>",
  },
];
