import type { Rule } from "./types";

export const urlRules: Rule[] = [
  {
    name: "URL",
    pattern: /\bhttps?:\/\/[^\s/$.?#].[^\s]*\b/gi,
    replace: () => "<REDACTED_URL>",
  },
];
