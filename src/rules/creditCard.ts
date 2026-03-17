// src/rules/creditCard.ts
import type { Rule } from "./types";
import { isValidLuhn } from "../utils/luhn";

export const creditCardRules: Rule[] = [
  {
    name: "CREDIT_CARD",
    // Keep separators simple and bounded between digits to avoid ambiguous
    // repetition on long near-miss inputs.
    pattern: /\b\d(?:[ -]?\d){12,18}\b/g,
    replace: (match, { strict }) => {
      if (!strict) return match;
      return isValidLuhn(match) ? "<REDACTED_CC>" : match;
    },
  },
];
