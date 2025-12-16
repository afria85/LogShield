import type { Rule } from "./types";

export const cloudRules: Rule[] = [
  {
    name: "AWS_ACCESS_KEY",
    pattern: /\bAKIA[0-9A-Z]{16,20}\b/g,
    replace: (match, { strict }) =>
      strict ? "<REDACTED_AWS_KEY>" : match,
  },
    {
    name: "STRIPE_SECRET_KEY",
    pattern: /\b(?:LS_STRIPE_(?:TEST|LIVE)_KEY_[A-Z0-9_]{10,}|sk_(?:test|live)_[A-Za-z0-9]{16,})\b/g,
    replace: (match, ctx) =>
        ctx.strict ? "<REDACTED_STRIPE_KEY>" : match,
    },
];
