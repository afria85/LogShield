export function printSummary(
  matches: { rule: string }[]
) {
  const counter: Record<string, number> = {};

  for (const m of matches) {
    counter[m.rule] = (counter[m.rule] || 0) + 1;
  }

  process.stderr.write("LogShield Summary\n");
  for (const [rule, count] of Object.entries(counter)) {
    process.stderr.write(`${rule}: ${count}\n`);
  }
}
