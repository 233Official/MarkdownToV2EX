#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { convertMarkdownToV2exDefault, ConvertOptions } from './index';

interface CliOptions extends ConvertOptions {
  input?: string;
  output?: string;
}

/**
 * Parse command line arguments
 */
function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--help' || arg === '-h') {
      printHelp();
      process.exit(0);
    }
    
    if (arg === '--version' || arg === '-v') {
      printVersion();
      process.exit(0);
    }
    
    if (arg === '--no-bold') {
      options.bold = false;
      continue;
    }
    
    if (arg.startsWith('--links=')) {
      const value = arg.split('=')[1] as 'label' | 'url' | 'both';
      if (['label', 'url', 'both'].includes(value)) {
        options.links = value;
      } else {
        console.error(`Invalid value for --links: ${value}`);
        process.exit(1);
      }
      continue;
    }
    
    if (arg.startsWith('--table=')) {
      const value = arg.split('=')[1] as 'strip' | 'space' | 'keep';
      if (['strip', 'space', 'keep'].includes(value)) {
        options.table = value;
      } else {
        console.error(`Invalid value for --table: ${value}`);
        process.exit(1);
      }
      continue;
    }
    
    if (arg === '--output' || arg === '-o') {
      options.output = args[++i];
      continue;
    }
    
    // Input file (positional argument)
    if (!arg.startsWith('-')) {
      options.input = arg;
    }
  }
  
  return options;
}

/**
 * Print help message
 */
function printHelp(): void {
  console.log(`
Usage: md2v2ex <input-file> [options]

Convert Markdown to V2EX Default (BBCode-style) syntax

Options:
  -o, --output <file>     Output file (default: stdout)
  --no-bold               Don't convert bold to [b]...[/b], strip markers instead
  --links=<mode>          Link conversion mode: label|url|both (default: both)
                          - label: output only link label
                          - url: output only URL
                          - both: output label and URL on separate lines
  --table=<mode>          Table conversion mode: strip|space|keep (default: space)
                          - strip: remove tables entirely
                          - space: convert to space-separated text
                          - keep: keep raw lines, remove alignment rows
  -h, --help              Show this help message
  -v, --version           Show version number

Examples:
  md2v2ex input.md
  md2v2ex input.md -o output.txt
  md2v2ex input.md --no-bold --links=label
  md2v2ex input.md --table=strip --links=url
`);
}

/**
 * Print version
 */
function printVersion(): void {
  const packageJson = require('../package.json');
  console.log(`md2v2ex v${packageJson.version}`);
}

/**
 * Main CLI function
 */
function main(): void {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('Error: No input file specified');
    printHelp();
    process.exit(1);
  }
  
  const options = parseArgs(args);
  
  if (!options.input) {
    console.error('Error: No input file specified');
    process.exit(1);
  }
  
  // Read input file
  const inputPath = path.resolve(options.input);
  
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Input file not found: ${inputPath}`);
    process.exit(1);
  }
  
  let markdown: string;
  try {
    markdown = fs.readFileSync(inputPath, 'utf-8');
  } catch (error) {
    console.error(`Error reading input file: ${error}`);
    process.exit(1);
  }
  
  // Convert
  const result = convertMarkdownToV2exDefault(markdown, options);
  
  // Output
  if (options.output) {
    const outputPath = path.resolve(options.output);
    try {
      fs.writeFileSync(outputPath, result, 'utf-8');
      console.error(`✓ Converted successfully. Output written to: ${outputPath}`);
    } catch (error) {
      console.error(`Error writing output file: ${error}`);
      process.exit(1);
    }
  } else {
    // Write to stdout
    console.log(result);
  }
}

// Run CLI
main();
