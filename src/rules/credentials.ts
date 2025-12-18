import type { Rule } from "./types";

export const credentialRules: Rule[] = [
  {
    name: "PASSWORD",
    pattern: /\bpassword=([^\s]+)/gi,
    replace: () => "password=<REDACTED_PASSWORD>",
  },

  // DB URL credential: postgres://user:pass@host
  {
    name: "DB_URL_CREDENTIAL",
    pattern: /\b(postgres|mysql|mongodb):\/\/([^:\s]+):([^@\s]+)@/gi,
    replace: (_match, _ctx, groups) =>
      `${groups[0]}://${groups[1]}:<REDACTED_PASSWORD>@`,
  },

  // apiKey=...
  {
    name: "API_KEY",
    pattern: /\bapiKey=([A-Za-z0-9_\-]{16,})\b/g,
    replace: () => "<REDACTED_API_KEY>",
  },

  // x-api-key: ....
  {
    name: "API_KEY_HEADER",
    pattern: /\bx-api-key:\s*[A-Za-z0-9_\-]{16,}\b/gi,
    replace: () => "x-api-key: <REDACTED_API_KEY>",
  },
];
