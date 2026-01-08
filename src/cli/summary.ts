/**
 * Minimal match shape needed by the CLI summary printer.
 * Keep this decoupled from engine types to avoid cross-layer import drift.
 */
export type SummaryMatch = { rule: string };

/**
 * Print a compact, deterministic summary.
 *
 * Contract:
 * - Output goes to STDERR (CI-safe, does not pollute stdout).
 * - Header is stable.
 * - Rules are sorted alphabetically.
 * - Format is aligned and stable for snapshot/diff.
 */
export function printSummary(matches: SummaryMatch[]): void {
  if (!matches.length) {
    process.stderr.write("LogShield Summary\n(no redactions detected)\n");
    return;
  }

  // Aggregate counts by rule name
  const counts: Record<string, number> = {};
  for (const m of matches) {
    counts[m.rule] = (counts[m.rule] ?? 0) + 1;
  }

  // Sort rule names alphabetically (deterministic contract)
  const rules = Object.keys(counts).sort((a, b) => a.localeCompare(b));

  // Compute alignment width
  const maxNameLen = Math.max(...rules.map((r) => r.length));

  // Header
  process.stderr.write("LogShield Summary\n");

  // Body
  for (const rule of rules) {
    const padded = rule.padEnd(maxNameLen, " ");
    process.stderr.write(`  ${padded}  x${counts[rule]}\n`);
  }
}
