export function printDryRun(
  original: string,
  sanitized: string
) {
  const origLines = original.split("\n");
  const outLines = sanitized.split("\n");

  const len = Math.max(origLines.length, outLines.length);

  for (let i = 0; i < len; i++) {
    const before = origLines[i] ?? "";
    const after = outLines[i] ?? "";

    if (before !== after) {
      process.stdout.write(before + "\n");
      process.stdout.write("? " + after + "\n");
    }
  }
}
