"use strict";

type Match = { rule: string };

export function printSummary(matches: Match[]) {
  if (!matches || matches.length === 0) {
    process.stderr.write("logshield: no redactions detected\n");
    return;
  }

  const counter: Record<string, number> = {};

  for (const m of matches) {
    counter[m.rule] = (counter[m.rule] || 0) + 1;
  }

  const entries = Object.entries(counter)
    .map(([rule, count]) => ({ rule, count }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.rule.localeCompare(b.rule);
    });

  const maxLen = Math.max(...entries.map(e => e.rule.length));
  const total = matches.length;
  const label = total === 1 ? "redaction" : "redactions";

  process.stderr.write(`logshield summary: ${total} ${label}\n`);

  for (const { rule, count } of entries) {
    process.stderr.write(
      `  ${rule.padEnd(maxLen)}  x${count}\n`
    );
  }
}
