import { ConvertOptions, Placeholder } from './types';

/**
 * Extract and protect inline code segments
 */
export function extractInlineCode(text: string): { text: string; placeholders: Placeholder[] } {
  const placeholders: Placeholder[] = [];
  let counter = 0;

  const result = text.replace(/`([^`]+)`/g, (match, code) => {
    const token = `\x00INLINECODE${counter}\x00`;
    placeholders.push({
      token,
      content: `[code]${code}[/code]`,
    });
    counter++;
    return token;
  });

  return { text: result, placeholders };
}

/**
 * Process bold: **text** or __text__ to [b]text[/b]
 */
export function processBold(text: string, enabled: boolean): string {
  if (!enabled) {
    // Strip bold markers
    return text.replace(/(\*\*|__)(.*?)\1/g, '$2');
  }

  // Convert to [b]...[/b]
  let result = text.replace(/\*\*(.+?)\*\*/g, '[b]$1[/b]');
  result = result.replace(/__(.+?)__/g, '[b]$1[/b]');
  return result;
}

/**
 * Process italic: *text* or _text_ - strip markers
 */
export function processItalic(text: string): string {
  // Remove italic markers (avoiding conflicts with bold)
  let result = text;
  
  // Match *text* but not **text**
  result = result.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '$1');
  
  // Match _text_ but not __text__
  result = result.replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, '$1');
  
  return result;
}

/**
 * Process strikethrough: ~~text~~ - strip markers
 */
export function processStrikethrough(text: string): string {
  return text.replace(/~~(.+?)~~/g, '$1');
}

/**
 * Process links based on mode
 */
export function processLinks(text: string, mode: 'label' | 'url' | 'both'): string {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, url) => {
    switch (mode) {
      case 'label':
        return label;
      case 'url':
        return url;
      case 'both':
      default:
        return `${label}\n${url}`;
    }
  });
}

/**
 * Process images: ![alt](src) to src on its own line
 */
export function processImages(text: string): string {
  return text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    return src;
  });
}

/**
 * Remove HTML tags
 */
export function removeHtmlTags(text: string): string {
  // Remove HTML comments
  let result = text.replace(/<!--[\s\S]*?-->/g, '');
  
  // Remove HTML tags
  result = result.replace(/<[^>]+>/g, '');
  
  return result;
}

/**
 * Remove footnotes
 */
export function removeFootnotes(text: string): string {
  // Remove footnote definitions first
  let result = text.replace(/^\[\^[^\]]+\]:\s+.+$/gm, '');
  
  // Then remove footnote references [^1]
  result = result.replace(/\[\^[^\]]+\]/g, '');
  
  return result;
}

/**
 * Restore placeholders with their content
 */
export function restorePlaceholders(text: string, placeholders: Placeholder[]): string {
  let result = text;
  for (const { token, content } of placeholders) {
    result = result.replace(new RegExp(token, 'g'), content);
  }
  return result;
}
