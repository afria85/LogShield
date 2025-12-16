import type { Rule } from "../types/rule";

export const urlRules: Rule[] = [
  {
    name: "EMAIL",
    pattern: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
    replace: () => "<REDACTED_EMAIL>",
  },
];
