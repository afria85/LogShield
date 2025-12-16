import type { Rule } from "./types";

export const customRules: Rule[] = [
  {
    name: "GENERIC_SECRET_KV",
    pattern: /"(\w+)":"([^"]{12,})"/g,
    replace: (match, value, ctx) => {
      if (!ctx.strict) return match;
      return `"${value ? value : "token"}":"<REDACTED_SECRET>"`;
    },
  },
];
