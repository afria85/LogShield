import { allRules } from "../rules";
import { SanitizeRule, SanitizeMatch } from "../rules/types";

const MAX_SIZE = 200 * 1024;

export function sanitizeLog(
  input: string,
  options: { strict?: boolean } = {}
): { output: string; matches: SanitizeMatch[] } {
  if (!input) return { output: "", matches: [] };

  if (input.length > MAX_SIZE) {
    throw new Error("Log size exceeds 200KB limit");
  }

  let output = input;
  const matches: SanitizeMatch[] = [];

  for (const rule of allRules as SanitizeRule[]) {
    if (rule.strictOnly && !options.strict) continue;

    output = output.replace(rule.regex, (...args: any[]) => {
      const match = args[0];
      const groups = args.slice(1);

      const replaced =
        typeof rule.replace === "function"
          ? rule.replace(match, ...groups)
          : rule.replace;

      // ?? RECORD MATCH ONLY IF ACTUALLY REDACTED
      if (replaced !== match) {
        matches.push({
          rule: rule.name,
          value: match,
        });
      }

      return replaced;
    });
  }

  return { output, matches };
}
