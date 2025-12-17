import { applyRules } from "./applyRules";
import { guardInput } from "./guard";
import { allRules } from "../rules";
import type { RuleContext } from "../rules/types";

export type SanitizeMatch = {
  rule: string;
  value: string;
};

export function sanitizeLog(
  input: string,
  options?: { strict?: boolean }
) {
  guardInput(input);

  if (!input) {
    return { output: "", matches: [] as SanitizeMatch[] };
  }

  const ctx: RuleContext = {
    strict: Boolean(options?.strict),
  };

  const matches: SanitizeMatch[] = [];

  const output = applyRules(input, allRules, ctx, matches);

  return { output, matches };
}
