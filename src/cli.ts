#!/usr/bin/env node

/**
 * CLI for Markdown to V2EX Converter
 * Usage: md2v2ex <input-file> [options]
 */

import * as fs from 'fs';
import * as path from 'path';
import { convertMarkdownToV2exDefault, ConvertOptions } from './convert';

interface CliOptions extends ConvertOptions {
  inputFile?: string;
  outputFile?: string;
  help?: boolean;
}

/**
 * Parse command-line arguments
 */
function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--raw') {
      options.raw = true;
    } else if (arg === '--no-bold') {
      options.noBold = true;
    } else if (arg === '--output' || arg === '-o') {
      options.outputFile = args[++i];
    } else if (arg.startsWith('--links=')) {
      const mode = arg.split('=')[1] as 'label' | 'url' | 'both';
      if (['label', 'url', 'both'].includes(mode)) {
        options.linkMode = mode;
      }
    } else if (arg.startsWith('--table=')) {
      const mode = arg.split('=')[1] as 'strip' | 'space' | 'keep';
      if (['strip', 'space', 'keep'].includes(mode)) {
        options.tableMode = mode;
      }
    } else if (!arg.startsWith('-')) {
      // Input file
      options.inputFile = arg;
    }
  }
  
  return options;
}

/**
 * Show help message
 */
function showHelp(): void {
  console.log(`
Markdown to V2EX Converter

Usage:
  md2v2ex <input-file> [options]
  md2v2ex [options]  (reads from stdin)

Options:
  -o, --output <file>    Output file (default: stdout)
  --raw                  Raw passthrough mode (output original unchanged)
  --no-bold              Disable bold mapping
  --links=<mode>         Link conversion mode:
                         - label: text only
                         - url: URL only
                         - both: [text](url) (default)
  --table=<mode>         Table handling mode:
                         - strip: remove tables
                         - space: plain text with spaces (default)
                         - keep: keep as-is
  -h, --help             Show this help message

Examples:
  md2v2ex input.md
  md2v2ex input.md -o output.txt
  md2v2ex input.md --no-bold --links=url
  md2v2ex input.md --raw
  cat input.md | md2v2ex
  cat input.md | md2v2ex --table=strip -o output.txt

中文说明:
  md2v2ex <输入文件> [选项]

选项说明:
  -o, --output <文件>    输出文件 (默认: 标准输出)
  --raw                  原始直通模式 (不做任何转换)
  --no-bold              禁用粗体映射
  --links=<模式>         链接转换模式:
                         - label: 仅文本
                         - url: 仅URL
                         - both: [文本](URL) (默认)
  --table=<模式>         表格处理模式:
                         - strip: 删除表格
                         - space: 纯文本带空格 (默认)
                         - keep: 保持原样
  -h, --help             显示帮助信息
`);
}

/**
 * Read input from file or stdin
 */
async function readInput(inputFile?: string): Promise<string> {
  if (inputFile) {
    // Read from file
    const filePath = path.resolve(inputFile);
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      console.error(`Error reading file: ${filePath}`);
      if (error instanceof Error) {
        console.error(error.message);
      }
      process.exit(1);
    }
  } else {
    // Read from stdin
    return new Promise((resolve, reject) => {
      let data = '';
      
      process.stdin.setEncoding('utf-8');
      
      process.stdin.on('data', (chunk) => {
        data += chunk;
      });
      
      process.stdin.on('end', () => {
        resolve(data);
      });
      
      process.stdin.on('error', (error) => {
        reject(error);
      });
    });
  }
}

/**
 * Write output to file or stdout
 */
function writeOutput(content: string, outputFile?: string): void {
  if (outputFile) {
    // Write to file
    const filePath = path.resolve(outputFile);
    try {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.error(`Output written to: ${filePath}`);
    } catch (error) {
      console.error(`Error writing file: ${filePath}`);
      if (error instanceof Error) {
        console.error(error.message);
      }
      process.exit(1);
    }
  } else {
    // Write to stdout
    console.log(content);
  }
}

/**
 * Main CLI function
 */
async function main() {
  const args = process.argv.slice(2);
  const options = parseArgs(args);
  
  if (options.help || (args.length === 0 && process.stdin.isTTY)) {
    showHelp();
    process.exit(0);
  }
  
  try {
    // Read input
    const input = await readInput(options.inputFile);
    
    // Convert
    const output = convertMarkdownToV2exDefault(input, options);
    
    // Write output
    writeOutput(output, options.outputFile);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// Run CLI
main();
