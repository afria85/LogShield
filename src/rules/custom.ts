import type { Rule } from "./types";

export const customRules: Rule[] = [
  {
    name: "GENERIC_SECRET_KV",
    pattern: /"(\w+)":"([^"]{12,})"/g,
    replace: (match, ctx, groups) => {
      if (!ctx.strict) return match;

      const key = groups[0] ?? "token";

      return `"${key}":"<REDACTED_SECRET>"`;
    },
  },
];
