import type { Rule } from "./types";

export const credentialRules: Rule[] = [
  {
    name: "PASSWORD",
    pattern: /\bpassword=([^\s]+)/gi,
    replace: (_match, _value, _ctx) => "password=<REDACTED_PASSWORD>",
  },
  {
    name: "API_KEY",
    pattern: /\bapiKey=([A-Za-z0-9_\-]{16,})\b/g,
    replace: () => "<REDACTED_API_KEY>",
  },
];
