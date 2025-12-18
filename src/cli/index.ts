#!/usr/bin/env node
"use strict";

/**
 * NOTE:
 * Versi CLI DI-INJECT saat build via esbuild:
 * define: { __LOGSHIELD_VERSION__: JSON.stringify(pkg.version) }
 */
declare const __LOGSHIELD_VERSION__: string;

const { readInput } = require("./readInput");
const { writeOutput } = require("./writeOutput");
const { printSummary } = require("./summary");
const { sanitizeLog } = require("../engine/sanitizeLog");

const rawArgs = process.argv.slice(2);

function getVersion(): string {
  return typeof __LOGSHIELD_VERSION__ === "string"
    ? __LOGSHIELD_VERSION__
    : "unknown";
}

function printHelp() {
  process.stdout.write(`Usage: logshield scan [file]

Options:
  --strict     Aggressive redaction
  --json       JSON output
  --summary    Print summary
  --version    Print version
  --help       Show help
`);
}

function parseArgs(args: string[]) {
  const flags = new Set<string>();
  const positionals: string[] = [];

  for (const arg of args) {
    if (arg.startsWith("--")) {
      flags.add(arg);
    } else {
      positionals.push(arg);
    }
  }

  return { flags, positionals };
}

async function main() {
  if (rawArgs.length === 0 || rawArgs.includes("--help")) {
    printHelp();
    process.exit(0);
  }

  if (rawArgs.includes("--version")) {
    console.log(`logshield v${getVersion()}`);
    process.exit(0);
  }

  const { flags, positionals } = parseArgs(rawArgs);

  const command = positionals[0];
  if (command !== "scan") {
    process.stderr.write("Unknown command\n");
    process.exit(1);
  }

  const file = positionals[1]; // optional
  const strict = flags.has("--strict");
  const json = flags.has("--json");
  const summary = flags.has("--summary");

  try {
    const input = await readInput(file);
    const result = sanitizeLog(input, { strict });

    writeOutput(result, { json });

    if (summary) {
      printSummary(result.matches);
    }

    process.exit(0);
  } catch (err: any) {
    process.stderr.write(err?.message || "Unexpected error");
    process.stderr.write("\n");
    process.exit(2);
  }
}

main();
