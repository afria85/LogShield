// src/rules/creditCard.ts
import type { Rule } from "./types";
import { isValidLuhn } from "../utils/luhn";

export const creditCardRules: Rule[] = [
  {
    name: "CREDIT_CARD",
    pattern: /\b(?:\d[ -]*?){13,19}\b/g,
    replace: (match, { strict }) => {
      if (!strict) return match;
      return isValidLuhn(match) ? "<REDACTED_CC>" : match;
    },
  },
];
