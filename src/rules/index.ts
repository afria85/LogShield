import type { Rule } from "./types";

import { tokenRules } from "./tokens";
import { credentialRules } from "./credentials";
import { cloudRules } from "./cloud";
import { creditCardRules } from "./creditCard";
import { urlRules } from "./urls";
import { customRules } from "./custom";

function normalize(rules: Rule[]): Rule[] {
  return rules.map((rule) => {
    if (typeof rule.replace === "function") {
      return rule;
    }

    const value = rule.replace;
    return {
      ...rule,
      replace: () => value,
    };
  });
}

/**
 * ORDER IS CONTRACT:
 * 1. tokenRules   ? JWT first
 * 2. credential   ? password, api key
 * 3. cloud
 * 4. credit card
 * 5. urls
 * 6. custom
 */
export const allRules: Rule[] = normalize([
  ...tokenRules,
  ...credentialRules,
  ...cloudRules,
  ...creditCardRules,
  ...urlRules,
  ...customRules,
]);
