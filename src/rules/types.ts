export type RuleContext = {
  strict: boolean;
};

export type RuleReplace = (
  match: string,
  ctx: RuleContext,
  groups: string[]
) => string;

export type Rule = {
  name: string;
  pattern: RegExp;
  replace: RuleReplace;
};
