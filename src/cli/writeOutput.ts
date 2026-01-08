export function writeOutput(
  result: { output: string; matches: any[] },
  opts: { json: boolean }
) {
  if (opts.json) {
    // Contract: JSON output must be newline-terminated for CI/tooling friendliness.
    process.stdout.write(`${JSON.stringify(result)}\n`);
  } else {
    process.stdout.write(result.output);
  }
}
