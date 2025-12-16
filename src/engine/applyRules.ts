import type { Rule, RuleContext } from "../rules/types";

export function applyRules(
  input: string,
  rules: Rule[],
  ctx: RuleContext,
  matches: { rule: string; value: string }[]
): string {
  let output = input;

  for (const rule of rules) {
    output = output.replace(rule.pattern, (...args) => {
      const match = args[0];
      const groups = args.slice(1, -2);

      let replaced: string;

      if (rule.replace.length === 1) {
        replaced = rule.replace(match);
      } else if (rule.replace.length === 2) {
        replaced = rule.replace(match, ctx);
      } else {
        replaced = rule.replace(match, groups[0], ctx);
      }

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
