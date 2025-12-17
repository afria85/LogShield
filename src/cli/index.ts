#!/usr/bin/env node
"use strict";

const { readInput } = require("./readInput");
const { writeOutput } = require("./writeOutput");
const { printSummary } = require("./summary");
const { sanitizeLog } = require("../engine/sanitizeLog");

const args = process.argv.slice(2);

function hasFlag(flag) {
  return args.includes(flag);
}

function getFileArg() {
  const file = args[1];
  if (!file || file.startsWith("--")) return undefined;
  return file;
}

async function main() {
  if (hasFlag("--help") || args.length === 0) {
    process.stdout.write(`Usage: logshield scan [file]

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
    process.stdout.write("logshield v0.2.0\n");
    process.exit(0);
  }

  const command = args[0];
  if (command !== "scan") {
    process.stderr.write("Unknown command\n");
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
  } catch (err) {
    process.stderr.write((err && err.message) || "Unexpected error");
    process.stderr.write("\n");
    process.exit(2);
  }
}

main();
