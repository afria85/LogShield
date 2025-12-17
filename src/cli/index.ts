#!/usr/bin/env node
import { readInput } from "./readInput";
import { writeOutput } from "./writeOutput";
import { printSummary } from "./summary";
import { sanitizeLog } from "../engine/sanitizeLog";

const args = process.argv.slice(2);

function hasFlag(flag: string) {
  return args.includes(flag);
}

function getFileArg() {
  return args.find((a: string) => !a.startsWith("--"));
}

async function main() {
  if (hasFlag("--help")) {
    console.log(`Usage: logshield scan [file]

Options:
  --strict
  --json
  --summary
  --version
  --help
`);
    process.exit(0);
  }

  if (hasFlag("--version")) {
    console.log("logshield v0.1.0");
    process.exit(0);
  }

  const command = args[0];
  if (command !== "scan") {
    console.error("Unknown command");
    process.exit(1);
  }

  const strict = hasFlag("--strict");
  const json = hasFlag("--json");
  const summary = hasFlag("--summary");
  const file = getFileArg();

  try {
    const input = await readInput(file);
    const result = sanitizeLog(input, { strict });

    writeOutput(result, { json });

    if (summary) {
      printSummary(result.matches);
    }
  } catch (err: any) {
    console.error(err.message || "Unexpected error");
    process.exit(2);
  }
}

main();
