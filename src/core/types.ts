/**
 * Options for converting Markdown to V2EX Default syntax
 */
export interface ConvertOptions {
  /**
   * Whether to convert bold syntax to [b]...[/b]
   * @default true
   */
  bold?: boolean;

  /**
   * How to handle links
   * - 'label': output only the link label
   * - 'url': output only the URL
   * - 'both': output label on one line, URL on next line
   * @default 'both'
   */
  links?: 'label' | 'url' | 'both';

  /**
   * How to handle tables
   * - 'strip': remove tables entirely
   * - 'space': convert to space-separated text
   * - 'keep': keep raw lines but remove alignment separators
   * @default 'space'
   */
  table?: 'strip' | 'space' | 'keep';

  /**
   * Heading separator style
   * - 'equals': use ===== for h1/h2, ----- for h3+
   * - 'dashes': use ----- for all headings
   * @default 'equals'
   */
  headingSeparator?: 'equals' | 'dashes';
}

/**
 * Internal placeholder for protected content
 */
export interface Placeholder {
  token: string;
  content: string;
}
