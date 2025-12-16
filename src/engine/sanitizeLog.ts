import { applyRules } from "./applyRules";
import { guardInput } from "./guard";
import { allRules } from "../rules";
import type { RuleContext } from "../rules/types";

export function sanitizeLog(
  input: string,
  options?: { strict?: boolean }
) {
  guardInput(input);

  if (!input) {
    return { output: "", matches: [] };
  }

  const ctx: RuleContext = {
    strict: Boolean(options?.strict),
  };

  const matches: { rule: string; match: string }[] = [];

  const output = applyRules(input, allRules, ctx, matches);

  return { output, matches };
}
