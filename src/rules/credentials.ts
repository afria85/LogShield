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
    replace: (_match, _ctx, groups) =>
      `${groups[0]}${groups[1]}<REDACTED_PASSWORD>`,
  },

  // DB URL credential: postgres://user:pass@host
  {
    name: "DB_URL_CREDENTIAL",
    pattern: /\b(postgres|mysql|mongodb):\/\/([^:\s]+):([^@\s]+)@/gi,
    replace: (_match, _ctx, groups) =>
      `${groups[0]}://${groups[1]}:<REDACTED_PASSWORD>@`,
  },

  // x-api-key: ....
  // IMPORTANT: this must run BEFORE the generic API_KEY rule. Otherwise the
  // generic API_KEY rule can match the "api-key: <value>" substring first and
  // corrupt the header name (e.g. "x-api-key" -> "x-").
  {
    name: "API_KEY_HEADER",
    pattern: /\bx-api-key\s*:\s*["']?[A-Za-z0-9_\-]{16,}["']?\b/gi,
    replace: () => "x-api-key: <REDACTED_API_KEY>",
  },

  /**
   * API key (common variants):
   * - apiKey=...
   * - api_key=...
   * - api-key: ...
   * - apikey=...
   * Supports '=' or ':' and optional quotes/spaces.
   *
   * NOTE:
   * Do NOT try to handle "Authorization: Bearer ..." here; that causes overlap
   * with token rules. Token redaction is handled in tokens.ts.
   */
  {
    name: "API_KEY",
    // Preserve the key label + delimiter, redact only the value.
    // Examples:
    //   api_key=abcdef... -> api_key=<REDACTED_API_KEY>
    //   api-key: "abcdef..." -> api-key: "<REDACTED_API_KEY>"
    pattern:
      /\b(api(?:[_-]?key)\s*[:=]\s*["']?)([A-Za-z0-9_\-]{16,})(["']?)\b/gi,
    replace: (_match, _ctx, groups) => `${groups[0]}<REDACTED_API_KEY>${groups[2]}`,
  },
];
