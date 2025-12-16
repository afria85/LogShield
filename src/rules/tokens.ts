import { SanitizeRule } from "./types";

export const tokenRules: SanitizeRule[] = [
  {
    name: "JWT",
    regex: /\beyJ[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\b/g,
    replace: "<REDACTED_JWT>",
  },
  {
    name: "AUTH_BEARER",
    regex: /Authorization:\s*Bearer\s+([A-Za-z0-9\-_\.]+)/gi,
    replace: (_m, token) =>
      token.startsWith("<REDACTED_JWT>")
        ? "Authorization: Bearer <REDACTED_JWT>"
        : "Authorization: Bearer <REDACTED_TOKEN>",
  },
];
