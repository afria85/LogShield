export interface SanitizeRule {
  name: string;
  regex: RegExp;
  replace: string | ((match: string, ...groups: any[]) => string);
  strictOnly?: boolean;
}

export interface SanitizeMatch {
  rule: string;
  value: string;
}
