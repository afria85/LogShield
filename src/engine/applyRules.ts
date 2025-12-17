import type { Rule, RuleContext } from "../rules/types";

export type ApplyMatch = {
  rule: string;
  value: string;
};

export function applyRules(
  input: string,
  rules: Rule[],
  ctx: RuleContext,
  matches: ApplyMatch[]
): string {
  let output = input;

  for (const rule of rules) {
    output = output.replace(rule.pattern, (...args) => {
      const match = args[0];
      const groups = args.slice(1, -2) as string[];

      const replaced = rule.replace(match, ctx, groups);

      if (replaced !== match) {
        matches.push({
          rule: rule.name,
          value: match,
        });
      }

      return replaced;
    });
  }

  return output;
}
