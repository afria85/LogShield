export type RuleContext = {
  strict: boolean;
};

export type RuleReplace =
  | string
  | ((match: string, ctx: RuleContext, groups: string[]) => string);

export type Rule = {
  name: string;
  pattern: RegExp;
  replace: RuleReplace;
};
