import { ConvertOptions } from './types';
import {
  extractCodeBlocks,
  processBlockquotes,
  processHeadings,
  processTables,
  processLists,
  processTaskLists,
  processHorizontalRules,
} from './block-transforms';
import {
  extractInlineCode,
  processBold,
  processItalic,
  processStrikethrough,
  processLinks,
  processImages,
  removeHtmlTags,
  removeFootnotes,
  restorePlaceholders,
} from './inline-transforms';

/**
 * Convert Markdown to V2EX Default (BBCode-style) syntax
 * @param markdown - Input Markdown text
 * @param options - Conversion options
 * @returns V2EX Default formatted text
 */
export function convertMarkdownToV2exDefault(
  markdown: string,
  options: ConvertOptions = {}
): string {
  if (!markdown || typeof markdown !== 'string') {
    return '';
  }

  // Set default options
  const opts: Required<ConvertOptions> = {
    bold: options.bold !== false,
    links: options.links || 'both',
    table: options.table || 'space',
    headingSeparator: options.headingSeparator || 'equals',
  };

  let text = markdown;

  // Step 1: Extract and protect code blocks
  const { text: textWithoutCodeBlocks, placeholders: codeBlockPlaceholders } = extractCodeBlocks(text);
  text = textWithoutCodeBlocks;

  // Step 2: Process block-level elements
  text = processBlockquotes(text);
  text = processHeadings(text, opts);
  text = processTables(text, opts.table);
  text = processTaskLists(text);
  text = processLists(text);
  text = processHorizontalRules(text);

  // Step 3: Extract and protect inline code
  const { text: textWithoutInlineCode, placeholders: inlineCodePlaceholders } = extractInlineCode(text);
  text = textWithoutInlineCode;

  // Step 4: Process inline elements
  text = removeHtmlTags(text);
  text = removeFootnotes(text);
  text = processImages(text);
  text = processLinks(text, opts.links);
  text = processBold(text, opts.bold);
  text = processItalic(text);
  text = processStrikethrough(text);

  // Step 5: Restore protected content
  text = restorePlaceholders(text, inlineCodePlaceholders);
  text = restorePlaceholders(text, codeBlockPlaceholders);

  // Step 6: Final cleanup
  text = cleanupBlankLines(text);
  text = text.trim();

  return text;
}

/**
 * Collapse more than 2 consecutive blank lines to 2
 */
function cleanupBlankLines(text: string): string {
  return text.replace(/\n{3,}/g, '\n\n');
}
