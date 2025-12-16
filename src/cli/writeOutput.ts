export function writeOutput(
  result: { output: string; matches: any[] },
  opts: { json: boolean }
) {
  if (opts.json) {
    process.stdout.write(JSON.stringify(result));
  } else {
    process.stdout.write(result.output);
  }
}
