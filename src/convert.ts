/**
 * Markdown to V2EX Default Syntax Converter
 * Converts standard Markdown to V2EX forum-compatible format
 */

export interface ConvertOptions {
  /** Disable bold mapping (skip bold conversion) */
  noBold?: boolean;
  /** Link conversion mode: 'label' = text only, 'url' = URL only, 'both' = [text](url) */
  linkMode?: 'label' | 'url' | 'both';
  /** Table handling mode: 'strip' = remove, 'space' = plain text, 'keep' = as-is */
  tableMode?: 'strip' | 'space' | 'keep';
  /** Raw passthrough mode - output original unchanged */
  raw?: boolean;
}

interface CodeBlock {
  placeholder: string;
  content: string;
}

/**
 * Convert Markdown to V2EX Default syntax format
 */
export function convertMarkdownToV2exDefault(
  markdown: string,
  options: ConvertOptions = {}
): string {
  // Raw passthrough mode
  if (options.raw) {
    return markdown;
  }

  let result = markdown;
  const codeBlocks: CodeBlock[] = [];
  const inlineCodeBlocks: CodeBlock[] = [];

  // Step 1: Protect code blocks and inline code from processing
  result = protectCodeBlocks(result, codeBlocks);
  result = protectInlineCode(result, inlineCodeBlocks);

  // Step 2: Remove HTML tags and footnotes
  result = removeHtmlTags(result);
  result = removeFootnotes(result);

  // Step 3: Convert headings
  result = convertHeadings(result);

  // Step 4: Convert formatting (bold, italic, strikethrough)
  if (!options.noBold) {
    result = convertBold(result);
  }
  result = removeItalic(result);
  result = removeStrikethrough(result);

  // Step 5: Convert blockquotes
  result = convertBlockquotes(result);

  // Step 6: Convert lists (unordered, ordered, task lists)
  result = convertTaskLists(result);
  result = convertUnorderedLists(result);
  // Ordered lists: keep numbers as-is (no processing needed)

  // Step 7: Convert links and images
  result = convertImages(result);
  result = convertLinks(result, options.linkMode || 'both');

  // Step 8: Convert horizontal rules
  result = convertHorizontalRules(result);

  // Step 9: Convert tables
  result = convertTables(result, options.tableMode || 'space');

  // Step 10: Restore inline code and code blocks
  result = restoreInlineCode(result, inlineCodeBlocks);
  result = restoreCodeBlocks(result, codeBlocks);

  // Step 11: Clean up excessive blank lines (>2 → 2)
  result = collapseBlankLines(result);

  return result.trim();
}

/**
 * Protect fenced code blocks from processing
 */
function protectCodeBlocks(text: string, storage: CodeBlock[]): string {
  const pattern = /```[\s\S]*?```/g;
  let index = 0;

  return text.replace(pattern, (match) => {
    // Extract language and code
    const lines = match.split('\n');
    const firstLine = lines[0];
    const codeContent = lines.slice(1, -1).join('\n');
    
    // V2EX format: [code]content[/code] (language is ignored)
    const v2exCode = `[code]${codeContent}[/code]`;
    
    const placeholder = `\x00CODEBLOCK${index}\x00`;
    storage.push({ placeholder, content: v2exCode });
    index++;
    return placeholder;
  });
}

/**
 * Protect inline code from processing
 */
function protectInlineCode(text: string, storage: CodeBlock[]): string {
  const pattern = /`([^`]+)`/g;
  let index = 0;

  return text.replace(pattern, (match, code) => {
    // V2EX inline code format: [code]content[/code]
    const v2exInlineCode = `[code]${code}[/code]`;
    
    const placeholder = `\x00INLINECODE${index}\x00`;
    storage.push({ placeholder, content: v2exInlineCode });
    index++;
    return placeholder;
  });
}

/**
 * Restore code blocks
 */
function restoreCodeBlocks(text: string, storage: CodeBlock[]): string {
  let result = text;
  // Build a single regex pattern for all placeholders if there are many
  if (storage.length > 10) {
    const placeholders = storage.map(b => b.placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const pattern = new RegExp(placeholders, 'g');
    const map = new Map(storage.map(b => [b.placeholder, b.content]));
    result = result.replace(pattern, match => map.get(match) || match);
  } else {
    // For small numbers, simple iteration is fine
    for (const block of storage) {
      result = result.replace(block.placeholder, block.content);
    }
  }
  return result;
}

/**
 * Restore inline code
 */
function restoreInlineCode(text: string, storage: CodeBlock[]): string {
  let result = text;
  // Build a single regex pattern for all placeholders if there are many
  if (storage.length > 10) {
    const placeholders = storage.map(b => b.placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const pattern = new RegExp(placeholders, 'g');
    const map = new Map(storage.map(b => [b.placeholder, b.content]));
    result = result.replace(pattern, match => map.get(match) || match);
  } else {
    // For small numbers, simple iteration is fine
    for (const block of storage) {
      result = result.replace(block.placeholder, block.content);
    }
  }
  return result;
}

/**
 * Remove HTML tags
 */
function removeHtmlTags(text: string): string {
  let result = text;
  
  // Remove HTML comments (multiple passes to handle nested/broken patterns)
  let prevLength;
  do {
    prevLength = result.length;
    result = result.replace(/<!--[\s\S]*?-->/g, '');
  } while (result.length !== prevLength);
  
  // Remove HTML tags (multiple passes to handle nested/broken patterns)
  do {
    prevLength = result.length;
    result = result.replace(/<[^>]*>/g, '');
  } while (result.length !== prevLength);
  
  return result;
}

/**
 * Remove footnotes
 */
function removeFootnotes(text: string): string {
  // Remove footnote definitions [^1]: ... (entire line) - do this first
  text = text.replace(/^\[\^[^\]]+\]:.*$/gm, '');
  
  // Remove footnote references [^1]
  text = text.replace(/\[\^[^\]]+\]/g, '');
  
  return text;
}

/**
 * Convert headings: # ... → text + separator line
 * Level 1-2: ====== separator
 * Level 3+: ------ separator
 */
function convertHeadings(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];

  for (const line of lines) {
    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const content = match[2].trim();
      
      result.push(content);
      
      // Level 1-2: ======, others: ------
      if (level <= 2) {
        result.push('======');
      } else {
        result.push('------');
      }
    } else {
      result.push(line);
    }
  }

  return result.join('\n');
}

/**
 * Convert bold: **text** or __text__ → [b]text[/b]
 */
function convertBold(text: string): string {
  // Convert **text** to [b]text[/b]
  text = text.replace(/\*\*([^*]+)\*\*/g, '[b]$1[/b]');
  
  // Convert __text__ to [b]text[/b] (must be word-boundary aware)
  text = text.replace(/\b__([^_]+)__\b/g, '[b]$1[/b]');
  
  return text;
}

/**
 * Remove italic markers: *text* or _text_ → text
 * Should be called after bold conversion
 */
function removeItalic(text: string): string {
  // Remove *text* (single asterisk, not part of **)
  // First, temporarily protect any remaining ** patterns
  text = text.replace(/\*\*/g, '\x01DOUBLESTAR\x01');
  
  // Now remove single asterisks
  text = text.replace(/\*([^*\n]+?)\*/g, '$1');
  
  // Restore ** patterns
  text = text.replace(/\x01DOUBLESTAR\x01/g, '**');
  
  // Remove _text_ (single underscore, not part of __)
  text = text.replace(/(^|[^_])_([^_\n]+?)_($|[^_])/g, '$1$2$3');
  
  return text;
}

/**
 * Remove strikethrough markers: ~~text~~ → text
 */
function removeStrikethrough(text: string): string {
  return text.replace(/~~([^~\n]+?)~~/g, '$1');
}

/**
 * Convert blockquotes: merge consecutive > lines into [blockquote]...[/blockquote]
 */
function convertBlockquotes(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];
  let inBlockquote = false;
  let blockquoteContent: string[] = [];

  for (const line of lines) {
    if (line.trim().startsWith('>')) {
      // Extract content after >
      const content = line.replace(/^>\s?/, '');
      blockquoteContent.push(content);
      inBlockquote = true;
    } else {
      // End of blockquote
      if (inBlockquote) {
        result.push('[blockquote]');
        result.push(blockquoteContent.join('\n'));
        result.push('[/blockquote]');
        blockquoteContent = [];
        inBlockquote = false;
      }
      result.push(line);
    }
  }

  // Handle trailing blockquote
  if (inBlockquote && blockquoteContent.length > 0) {
    result.push('[blockquote]');
    result.push(blockquoteContent.join('\n'));
    result.push('[/blockquote]');
  }

  return result.join('\n');
}

/**
 * Convert unordered lists: remove markers (-, *, +)
 */
function convertUnorderedLists(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];

  for (const line of lines) {
    // Match unordered list items (-, *, +)
    const match = line.match(/^(\s*)[-*+]\s+(.+)$/);
    if (match) {
      const indent = match[1];
      const content = match[2];
      result.push(`${indent}${content}`);
    } else {
      result.push(line);
    }
  }

  return result.join('\n');
}

/**
 * Convert task lists: - [x] item → [x] item (no bullet)
 */
function convertTaskLists(text: string): string {
  const lines = text.split('\n');
  const result: string[] = [];

  for (const line of lines) {
    // Match task list items
    const match = line.match(/^(\s*)[-*+]\s+\[([ xX])\]\s+(.+)$/);
    if (match) {
      const indent = match[1];
      const checked = match[2];
      const content = match[3];
      result.push(`${indent}[${checked}] ${content}`);
    } else {
      result.push(line);
    }
  }

  return result.join('\n');
}

/**
 * Convert links based on linkMode
 */
function convertLinks(text: string, mode: 'label' | 'url' | 'both'): string {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, url) => {
    switch (mode) {
      case 'label':
        return label;
      case 'url':
        return url;
      case 'both':
      default:
        return `[${label}](${url})`;
    }
  });
}

/**
 * Convert images: ![alt](src) → src line
 */
function convertImages(text: string): string {
  return text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    return src;
  });
}

/**
 * Convert horizontal rules: ---, ***, ___ → ------
 */
function convertHorizontalRules(text: string): string {
  return text.replace(/^(\s*)([-*_])\2{2,}\s*$/gm, '------');
}

/**
 * Convert tables based on tableMode
 */
function convertTables(text: string, mode: 'strip' | 'space' | 'keep'): string {
  if (mode === 'keep') {
    return text;
  }

  const lines = text.split('\n');
  const result: string[] = [];
  let inTable = false;
  let tableLines: string[] = [];

  for (const line of lines) {
    // Check if this is a table row (starts with |)
    if (line.trim().match(/^\|(.+)\|$/)) {
      if (!inTable) {
        inTable = true;
        tableLines = [];
      }
      tableLines.push(line);
    } else {
      // Not a table row
      if (inTable) {
        // Process accumulated table
        if (mode === 'strip') {
          // Skip table entirely
        } else if (mode === 'space') {
          // Convert to plain text
          result.push(...formatTableAsPlainText(tableLines));
        }
        inTable = false;
        tableLines = [];
      }
      result.push(line);
    }
  }

  // Handle trailing table
  if (inTable && tableLines.length > 0) {
    if (mode === 'space') {
      result.push(...formatTableAsPlainText(tableLines));
    }
  }

  return result.join('\n');
}

/**
 * Format table as plain text with spaces
 */
function formatTableAsPlainText(tableLines: string[]): string[] {
  const rows = tableLines.map(line => {
    return line.split('|')
      .filter(cell => cell.trim())
      .map(cell => cell.trim());
  });

  // Filter out separator lines (lines with only dashes and colons)
  const contentRows = rows.filter(row => 
    !row.every(cell => /^[-:]+$/.test(cell))
  );

  if (contentRows.length === 0) {
    return [];
  }

  // Format rows with proper spacing
  const result: string[] = [];
  contentRows.forEach((row) => {
    result.push(row.join(' | '));
  });

  return result;
}

/**
 * Collapse excessive blank lines (>2 → 2)
 */
function collapseBlankLines(text: string): string {
  return text.replace(/\n{3,}/g, '\n\n');
}
