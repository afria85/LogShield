import { SanitizeRule } from "./types";

export const credentialRules: SanitizeRule[] = [
  {
    name: "PASSWORD",
    regex: /\b(password)\s*=\s*[^\s]+/gi,
    replace: (_m, key) => `${key}=<REDACTED_PASSWORD>`,
  },
  {
    name: "API_KEY",
    regex: /\bapiKey\s*=\s*[a-zA-Z0-9]{16,}\b/,
    replace: "<REDACTED_API_KEY>",
  },
  {
    name: "AWS_ACCESS_KEY",
    strictOnly: true,
    regex: /\bAKIA[0-9A-Z]{16,}\b/g,
    replace: "<REDACTED_AWS_KEY>",
  },
];
