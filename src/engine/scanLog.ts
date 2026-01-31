import { applyRules } from "./applyRules";
import { guardInput } from "./guard";
import { allRules } from "../rules";
import type { RuleContext } from "../rules/types";
import type { SanitizeMatch } from "./sanitizeLog";

/**
 * Detection-only API.
 *
 * - Never returns sanitized output.
 * - Never returns raw matched values.
 * - Safe to serialize.
 */
export function scanLog(input: string, options?: { strict?: boolean }) {
  guardInput(input);

  if (!input) {
    return { matches: [] as SanitizeMatch[] };
  }

  const ctx: RuleContext = {
    strict: Boolean(options?.strict),
    dryRun: true,
  };

  const matches: SanitizeMatch[] = [];
  applyRules(input, allRules, ctx, matches);
  return { matches };
}
