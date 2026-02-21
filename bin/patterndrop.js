#!/usr/bin/env node

/**
 * bin/patterndrop.js
 *
 * CLI entry point for patterndrop.
 * Picks a random ASCII pattern from the gallery and prints it to the terminal
 * with a colored header and footer using chalk.
 *
 * Usage:
 *   npx patterndrop          — print a random pattern
 *   npx patterndrop --list   — list all available pattern names
 *   npx patterndrop --name "Honeycomb"  — print a specific pattern by name
 */

const patterns = require('../patterns');

/**
 * ANSI color codes (no external deps needed for simple coloring).
 * Using raw ANSI to keep the package dependency-free.
 */
const colors = {
  reset:   '\x1b[0m',
  bold:    '\x1b[1m',
  cyan:    '\x1b[36m',
  magenta: '\x1b[35m',
  yellow:  '\x1b[33m',
  green:   '\x1b[32m',
  dim:     '\x1b[2m',
};

/** Palette of colors to cycle through for the pattern body. */
const palette = [
  colors.cyan,
  colors.magenta,
  colors.yellow,
  colors.green,
];

/**
 * Returns a random element from an array.
 * @param {Array} arr
 * @returns {*}
 */
function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Prints a pattern entry to stdout with colored header/footer.
 * @param {{ name: string, art: string }} pattern
 */
function printPattern(pattern) {
  const color = randomFrom(palette);
  const width = 50;
  const line  = '─'.repeat(width);

  console.log('');
  console.log(`${colors.bold}${colors.cyan}  ✦ ${pattern.name}${colors.reset}`);
  console.log(`${colors.dim}  ${line}${colors.reset}`);
  console.log('');
  // Print each line of the art with the selected color
  pattern.art.split('\n').forEach(l => {
    console.log(`  ${color}${l}${colors.reset}`);
  });
  console.log('');
  console.log(`${colors.dim}  ${line}${colors.reset}`);
  console.log(`${colors.dim}  patterndrop — ascii-patterns/gallery${colors.reset}`);
  console.log('');
}

/**
 * Prints all available pattern names.
 */
function listPatterns() {
  console.log(`\n${colors.bold}${colors.cyan}Available patterns:${colors.reset}\n`);
  patterns.forEach((p, i) => {
    console.log(`  ${colors.dim}${String(i + 1).padStart(2, '0')}.${colors.reset} ${p.name}`);
  });
  console.log('');
}

// ── Argument parsing ──────────────────────────────────────────────────────────

const args = process.argv.slice(2);

if (args.includes('--list') || args.includes('-l')) {
  listPatterns();
  process.exit(0);
}

const nameIdx = args.findIndex(a => a === '--name' || a === '-n');
if (nameIdx !== -1) {
  const targetName = args[nameIdx + 1];
  if (!targetName) {
    console.error(`${colors.bold}Error:${colors.reset} --name requires a value. Run with --list to see available names.`);
    process.exit(1);
  }
  const match = patterns.find(p => p.name.toLowerCase() === targetName.toLowerCase());
  if (!match) {
    console.error(`${colors.bold}Pattern not found:${colors.reset} "${targetName}". Run with --list to see available names.`);
    process.exit(1);
  }
  printPattern(match);
  process.exit(0);
}

// Default: random pattern
printPattern(randomFrom(patterns));