import { SanitizeRule } from "./types";

export const urlRules: SanitizeRule[] = [
  {
    name: "EMAIL",
    regex: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
    replace: "<REDACTED_EMAIL>",
  },
];
