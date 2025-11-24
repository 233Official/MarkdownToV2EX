import { ConvertOptions, Placeholder } from './types';

/**
 * Extract and protect code blocks from further processing
 */
export function extractCodeBlocks(text: string): { text: string; placeholders: Placeholder[] } {
  const placeholders: Placeholder[] = [];
  let counter = 0;

  // Extract fenced code blocks (```...```)
  const result = text.replace(/```[\w]*\n([\s\S]*?)```/g, (match, code) => {
    const token = `\x00CODEBLOCK${counter}\x00`;
    placeholders.push({
      token,
      content: `[code]${code.trimEnd()}[/code]`,
    });
    counter++;
    return token;
  });

  return { text: result, placeholders };
}

/**
 * Process blockquotes: merge consecutive > lines into [blockquote]...[/blockquote]
 */
export function processBlockquotes(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];
  let blockquoteBuffer: string[] = [];

  for (const line of lines) {
    if (line.trimStart().startsWith('>')) {
      // Remove leading > and optional space
      const content = line.replace(/^\s*>\s?/, '');
      blockquoteBuffer.push(content);
    } else {
      if (blockquoteBuffer.length > 0) {
        // Flush blockquote
        result.push(`[blockquote]${blockquoteBuffer.join('\n')}[/blockquote]`);
        blockquoteBuffer = [];
      }
      result.push(line);
    }
  }

  // Flush remaining blockquote
  if (blockquoteBuffer.length > 0) {
    result.push(`[blockquote]${blockquoteBuffer.join('\n')}[/blockquote]`);
  }

  return result.join('\n');
}

/**
 * Process headings: convert # ... to plain text with separator line
 */
export function processHeadings(text: string, options: ConvertOptions): string {
  const lines = text.split('\n');
  const result: string[] = [];

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = headingMatch[2];
      result.push(content);

      // Add separator line
      const separator = getSeparator(level, options.headingSeparator || 'equals');
      result.push(separator);
    } else {
      result.push(line);
    }
  }

  return result.join('\n');
}

function getSeparator(level: number, style: 'equals' | 'dashes'): string {
  if (style === 'dashes') {
    return '------';
  }
  // equals style: use ===== for h1/h2, ----- for h3+
  return level <= 2 ? '======' : '------';
}

/**
 * Process tables based on mode
 */
export function processTables(text: string, mode: 'strip' | 'space' | 'keep'): string {
  const lines = text.split('\n');
  const result: string[] = [];
  let inTable = false;
  let tableBuffer: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isTableLine = /^\s*\|.*\|\s*$/.test(line);

    if (isTableLine) {
      if (!inTable) {
        inTable = true;
        tableBuffer = [];
      }
      tableBuffer.push(line);
    } else {
      if (inTable) {
        // Process accumulated table
        result.push(formatTable(tableBuffer, mode));
        inTable = false;
        tableBuffer = [];
      }
      result.push(line);
    }
  }

  // Handle table at the end
  if (inTable && tableBuffer.length > 0) {
    result.push(formatTable(tableBuffer, mode));
  }

  return result.join('\n');
}

function formatTable(tableLines: string[], mode: 'strip' | 'space' | 'keep'): string {
  if (mode === 'strip') {
    return '';
  }

  // Filter out alignment separator rows (e.g., |---|:--:|)
  const contentLines = tableLines.filter(line => {
    const cells = line.split('|').filter(c => c.trim());
    return !cells.every(cell => /^:?-+:?$/.test(cell.trim()));
  });

  if (contentLines.length === 0) {
    return '';
  }

  if (mode === 'keep') {
    return contentLines.join('\n');
  }

  // mode === 'space': convert to space-separated
  const processed = contentLines.map(line => {
    const cells = line.split('|')
      .map(c => c.trim())
      .filter(c => c.length > 0);
    return cells.join(' ');
  });

  return processed.join('\n');
}

/**
 * Process lists: remove markers, keep content
 */
export function processLists(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];

  for (const line of lines) {
    // Unordered list: remove markers (-, *, +)
    const unorderedMatch = line.match(/^(\s*)[-*+]\s+(.+)$/);
    if (unorderedMatch) {
      const indent = unorderedMatch[1].slice(0, 4); // Max 4 spaces indent
      result.push(indent + unorderedMatch[2]);
      continue;
    }

    // Ordered list: keep as is (numbering becomes literal text)
    result.push(line);
  }

  return result.join('\n');
}

/**
 * Process task lists: convert - [x]/[ ] to [x]/[ ] (strip bullet)
 */
export function processTaskLists(text: string): string {
  return text.replace(/^(\s*)[-*+]\s+\[([ xX])\]\s+(.+)$/gm, (match, indent, checked, content) => {
    const checkbox = checked.toLowerCase() === 'x' ? '[x]' : '[ ]';
    return `${indent}${checkbox} ${content}`;
  });
}

/**
 * Process horizontal rules
 */
export function processHorizontalRules(text: string): string {
  // Replace ---, ***, ___ with ------
  return text.replace(/^(?:[-*_]){3,}\s*$/gm, '------');
}
