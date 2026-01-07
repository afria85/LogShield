import type { Rule } from "./types";

export const cloudRules: Rule[] = [
  {
    name: "AWS_ACCESS_KEY",
    pattern: /\bAKIA[0-9A-Z]{16,20}\b/g,
    replace: (match, { strict }) => (strict ? "<REDACTED_AWS_KEY>" : match),
  },

  /**
   * Prefer contextual AWS secret key detection first:
   * - AWS_SECRET_ACCESS_KEY=...
   * - aws_secret_access_key: ...
   * - secretAccessKey=...
   */
  {
    name: "AWS_SECRET_ACCESS_KEY",
    pattern:
      /\b(?:AWS_SECRET_ACCESS_KEY|aws_secret_access_key|secretAccessKey|awsSecretAccessKey)\s*[:=]\s*["']?([A-Za-z0-9\/+=]{40})["']?\b/g,
    replace: (_match, { strict }, groups) =>
      strict
        ? "<REDACTED_AWS_SECRET>"
        : _match.replace(groups[0], "<REDACTED_AWS_SECRET>"),
  },

  /**
   * Strict-only broad fallback, but require at least one of / + = inside the 40 chars
   * to reduce false positives on purely alphanumeric 40-char strings.
   */
  {
    name: "AWS_SECRET_KEY",
    pattern: /\b(?=[A-Za-z0-9\/+=]{40}\b)(?=[A-Za-z0-9\/+=]*[\/+=])[A-Za-z0-9\/+=]{40}\b/g,
    replace: (match, { strict }) => (strict ? "<REDACTED_AWS_SECRET>" : match),
  },

  {
    name: "STRIPE_SECRET_KEY",
    pattern:
      /\b(?:LS_STRIPE_(?:TEST|LIVE)_KEY_[A-Z0-9_]{10,}|sk_(?:test|live)_[A-Za-z0-9]{16,})\b/g,
    replace: (match, { strict }) => (strict ? "<REDACTED_STRIPE_KEY>" : match),
  },
];
