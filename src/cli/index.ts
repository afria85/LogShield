"use strict";

/**
 * NOTE:
 * CLI version is injected at build time via esbuild:
 * define: { __LOGSHIELD_VERSION__: JSON.stringify(pkg.version) }
 */
declare const __LOGSHIELD_VERSION__: string;

const { readInput } = require("./readInput");
const { writeOutput } = require("./writeOutput");
const { printSummary } = require("./summary");
const { sanitizeLog } = require("../engine/sanitizeLog");

/**
 * Normalize args:
 * - treat `-h` as `--help`
 */
const rawArgs = process.argv
  .slice(2)
  .map((arg) => (arg === "-h" ? "--help" : arg));

function getVersion(): string {
  return typeof __LOGSHIELD_VERSION__ === "string"
    ? __LOGSHIELD_VERSION__
    : "unknown";
}

function printHelp() {
  process.stdout.write(`Usage: logshield scan [file]

Behavior:
  - If a file is provided, LogShield reads from that file
  - If input is piped, LogShield reads from STDIN automatically
  - --stdin is optional and only needed for explicitness

Options:
  --strict            Aggressive redaction
  --dry-run           Report detected redactions only
  --stdin             Force read from STDIN
  --fail-on-detect    Exit with code 1 if any redaction occurs
  --json              JSON output
  --summary           Print summary
  --version           Print version
  --help              Show help
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

function isStdinPiped(): boolean {
  return !process.stdin.isTTY;
}

function renderDryRunReport(
  matches: { rule: string }[]
) {
  if (matches.length === 0) {
    process.stdout.write("logshield (dry-run)\n");
    process.stdout.write("Detected 0 redactions.\n");
    process.stdout.write("No output was modified.\n");
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

  process.stdout.write("logshield (dry-run)\n");
  process.stdout.write(`Detected ${total} ${label}:\n`);

  for (const { rule, count } of entries) {
    process.stdout.write(
      `  ${rule.padEnd(maxLen)}  x${count}\n`
    );
  }

  process.stdout.write("\n");
  process.stdout.write("No output was modified.\n");
  process.stdout.write("Use without --dry-run to apply.\n");
}

async function main() {
  if (rawArgs.length === 0 || rawArgs.includes("--help")) {
    printHelp();
    process.exit(0);
  }

  if (rawArgs.includes("--version")) {
    process.stdout.write(`logshield v${getVersion()}\n`);
    process.exit(0);
  }

  const { flags, positionals } = parseArgs(rawArgs);

  const command = positionals[0];
  if (command !== "scan") {
    process.stdout.write("Unknown command\n");
    process.exit(1);
  }

  const file = positionals[1];
  const strict = flags.has("--strict");
  const json = flags.has("--json");
  const summary = flags.has("--summary");
  const stdinFlag = flags.has("--stdin");
  const failOnDetect = flags.has("--fail-on-detect");
  const dryRun = flags.has("--dry-run");

  const stdinAuto = isStdinPiped();
  const useStdin = stdinFlag || stdinAuto;

  if (useStdin && file) {
    process.stdout.write("Cannot read from both STDIN and file\n");
    process.exit(1);
  }

  if (dryRun && json) {
    process.stdout.write("--dry-run cannot be used with --json\n");
    process.exit(1);
  }

  if (json && summary) {
    process.stdout.write("--summary cannot be used with --json\n");
    process.exit(1);
  }


  try {
    const input = await readInput(useStdin ? undefined : file);
    const result = sanitizeLog(input, { strict });

    if (dryRun) {
      renderDryRunReport(result.matches);

      if (failOnDetect && result.matches.length > 0) {
        process.exit(1);
      }

      process.exit(0);
    }

    writeOutput(result, { json });

    if (summary) {
      printSummary(result.matches);
    }

    if (failOnDetect && result.matches.length > 0) {
      process.exit(1);
    }

    process.exit(0);
  } catch (err: any) {
    process.stdout.write(err?.message || "Unexpected error");
    process.stdout.write("\n");
    process.exit(2);
  }
}

main();
