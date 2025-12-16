import { tokenRules } from "./tokens";
import { credentialRules } from "./credentials";
import { urlRules } from "./urls";
import { customRules } from "./custom";

/**
 * ?? ORDER IS CONTRACTUAL
 * Do NOT change without updating tests
 */
export const allRules = [
  ...tokenRules,        // JWT FIRST
  ...credentialRules,
  ...urlRules,
  ...customRules,
];
