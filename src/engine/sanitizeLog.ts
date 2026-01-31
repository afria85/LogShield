import { applyRules } from "./applyRules";
import { guardInput } from "./guard";
import { allRules } from "../rules";
import type { RuleContext } from "../rules/types";

export type SanitizeMatch = {
  rule: string;
};

export function sanitizeLog(
  input: string,
  options?: { strict?: boolean; dryRun?: boolean }
) {
  guardInput(input);

  if (!input) {
    return { output: "", matches: [] as SanitizeMatch[] };
  }

  const ctx: RuleContext = {
    strict: Boolean(options?.strict),
    dryRun: Boolean(options?.dryRun),
  };

  const matches: SanitizeMatch[] = [];

  // IMPORTANT:
  // If dry-run, we still apply rules for detection,
  // but we must NOT mutate output.
  //
  // SECURITY:
  // Do NOT return the raw input in the result shape when dryRun is enabled.
  // Consumers may serialize the result (JSON logs, telemetry, etc.).
  // Returning the raw input here would re-introduce a secret leakage path.
  if (ctx.dryRun) {
    applyRules(input, allRules, ctx, matches);
    return { output: "", matches };
  }

  const output = applyRules(input, allRules, ctx, matches);
  return { output, matches };
}
