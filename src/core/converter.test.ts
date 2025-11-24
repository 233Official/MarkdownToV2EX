import { convertMarkdownToV2exDefault } from '../core/converter';

describe('convertMarkdownToV2exDefault', () => {
  describe('headings', () => {
    it('should convert h1 with equals separator', () => {
      const input = '# Heading 1';
      const expected = 'Heading 1\n======';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });

    it('should convert h2 with equals separator', () => {
      const input = '## Heading 2';
      const expected = 'Heading 2\n======';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });

    it('should convert h3 with dashes separator', () => {
      const input = '### Heading 3';
      const expected = 'Heading 3\n------';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });

    it('should use dashes for all levels when configured', () => {
      const input = '# Heading 1';
      const expected = 'Heading 1\n------';
      expect(convertMarkdownToV2exDefault(input, { headingSeparator: 'dashes' })).toBe(expected);
    });
  });

  describe('bold', () => {
    it('should convert **text** to [b]text[/b]', () => {
      const input = '**bold text**';
      const expected = '[b]bold text[/b]';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });

    it('should convert __text__ to [b]text[/b]', () => {
      const input = '__bold text__';
      const expected = '[b]bold text[/b]';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });

    it('should strip bold markers when bold=false', () => {
      const input = '**bold text**';
      const expected = 'bold text';
      expect(convertMarkdownToV2exDefault(input, { bold: false })).toBe(expected);
    });
  });

  describe('italic', () => {
    it('should strip *text* markers', () => {
      const input = '*italic text*';
      const expected = 'italic text';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });

    it('should strip _text_ markers', () => {
      const input = '_italic text_';
      const expected = 'italic text';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });
  });

  describe('strikethrough', () => {
    it('should strip ~~text~~ markers', () => {
      const input = '~~strikethrough~~';
      const expected = 'strikethrough';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });
  });

  describe('inline code', () => {
    it('should convert `code` to [code]code[/code]', () => {
      const input = 'This is `inline code` here';
      const expected = 'This is [code]inline code[/code] here';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });

    it('should protect code from other transformations', () => {
      const input = '`**bold** code`';
      const expected = '[code]**bold** code[/code]';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });
  });

  describe('code blocks', () => {
    it('should convert fenced code block to [code]...[/code]', () => {
      const input = '```\nconst x = 1;\n```';
      const expected = '[code]const x = 1;[/code]';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });

    it('should ignore language label', () => {
      const input = '```javascript\nconst x = 1;\n```';
      const expected = '[code]const x = 1;[/code]';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });

    it('should preserve code block content unchanged', () => {
      const input = '```\n**bold**\n*italic*\n```';
      const expected = '[code]**bold**\n*italic*[/code]';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });
  });

  describe('blockquotes', () => {
    it('should convert single line blockquote', () => {
      const input = '> Quote';
      const expected = '[blockquote]Quote[/blockquote]';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });

    it('should merge consecutive blockquote lines', () => {
      const input = '> Line 1\n> Line 2';
      const expected = '[blockquote]Line 1\nLine 2[/blockquote]';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });

    it('should handle multiple separate blockquotes', () => {
      const input = '> Quote 1\n\nNormal text\n\n> Quote 2';
      const expected = '[blockquote]Quote 1[/blockquote]\n\nNormal text\n\n[blockquote]Quote 2[/blockquote]';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });
  });

  describe('lists', () => {
    it('should remove unordered list markers', () => {
      const input = '- Item 1\n- Item 2';
      const expected = 'Item 1\nItem 2';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });

    it('should keep ordered list numbering', () => {
      const input = '1. Item 1\n2. Item 2';
      const expected = '1. Item 1\n2. Item 2';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });

    it('should preserve indentation up to 4 spaces', () => {
      const input = 'Normal line\n  - Indented item';
      const expected = 'Normal line\n  Indented item';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });
  });

  describe('task lists', () => {
    it('should convert checked task', () => {
      const input = '- [x] Completed task';
      const expected = '[x] Completed task';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });

    it('should convert unchecked task', () => {
      const input = '- [ ] Incomplete task';
      const expected = '[ ] Incomplete task';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });

    it('should handle uppercase X', () => {
      const input = '- [X] Completed task';
      const expected = '[x] Completed task';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });
  });

  describe('links', () => {
    it('should output both label and URL by default', () => {
      const input = '[Label](https://example.com)';
      const expected = 'Label\nhttps://example.com';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });

    it('should output only label when links=label', () => {
      const input = '[Label](https://example.com)';
      const expected = 'Label';
      expect(convertMarkdownToV2exDefault(input, { links: 'label' })).toBe(expected);
    });

    it('should output only URL when links=url', () => {
      const input = '[Label](https://example.com)';
      const expected = 'https://example.com';
      expect(convertMarkdownToV2exDefault(input, { links: 'url' })).toBe(expected);
    });

    it('should handle links with parentheses in URL', () => {
      const input = '[Link](https://example.com/path(1))';
      const expected = 'Link\nhttps://example.com/path(1)';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });
  });

  describe('images', () => {
    it('should convert image to URL only', () => {
      const input = '![Alt text](https://example.com/image.png)';
      const expected = 'https://example.com/image.png';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });

    it('should handle image without alt text', () => {
      const input = '![](https://example.com/image.png)';
      const expected = 'https://example.com/image.png';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });
  });

  describe('horizontal rules', () => {
    it('should convert --- to ------', () => {
      const input = '---';
      const expected = '------';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });

    it('should convert *** to ------', () => {
      const input = '***';
      const expected = '------';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });

    it('should convert ___ to ------', () => {
      const input = '___';
      const expected = '------';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });
  });

  describe('tables', () => {
    const simpleTable = '| A | B |\n|---|---|\n| 1 | 2 |';

    it('should convert table to space-separated by default', () => {
      const result = convertMarkdownToV2exDefault(simpleTable);
      expect(result).toContain('A B');
      expect(result).toContain('1 2');
      expect(result).not.toContain('|');
    });

    it('should strip table when table=strip', () => {
      const result = convertMarkdownToV2exDefault(simpleTable, { table: 'strip' });
      expect(result).toBe('');
    });

    it('should keep raw lines when table=keep', () => {
      const result = convertMarkdownToV2exDefault(simpleTable, { table: 'keep' });
      expect(result).toContain('| A | B |');
      expect(result).toContain('| 1 | 2 |');
      expect(result).not.toContain('|---|---|');
    });
  });

  describe('HTML', () => {
    it('should remove HTML comments', () => {
      const input = 'Text <!-- comment --> more text';
      const expected = 'Text  more text';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });

    it('should remove HTML tags', () => {
      const input = '<div>Text</div>';
      const expected = 'Text';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });
  });

  describe('footnotes', () => {
    it('should remove footnote references', () => {
      const input = 'Text[^1] more text';
      const expected = 'Text more text';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });

    it('should remove footnote definitions', () => {
      const input = '[^1]: Footnote text';
      const expected = '';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });
  });

  describe('cleanup', () => {
    it('should collapse more than 2 consecutive blank lines', () => {
      const input = 'Line 1\n\n\n\n\nLine 2';
      const expected = 'Line 1\n\nLine 2';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });

    it('should trim leading and trailing whitespace', () => {
      const input = '\n\n  Text  \n\n';
      const expected = 'Text';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });
  });

  describe('complex examples', () => {
    it('should handle the example from problem statement', () => {
      const input = `# 标题

**加粗** 和 *斜体* 以及 ~~删除~~。

> 引用一
> 引用二

1. 第一项
2. 第二项

- [x] 已完成
- [ ] 未完成

\`行内代码\` 和 \`\`\`
多行
代码
\`\`\` 结束

![Alt](https://example.com/a.png)

[链接标题](https://example.com)`;

      const result = convertMarkdownToV2exDefault(input);
      
      expect(result).toContain('标题\n======');
      expect(result).toContain('[b]加粗[/b]');
      expect(result).toContain('斜体');
      expect(result).not.toContain('*斜体*');
      expect(result).toContain('删除');
      expect(result).not.toContain('~~删除~~');
      expect(result).toContain('[blockquote]引用一\n引用二[/blockquote]');
      expect(result).toContain('[x] 已完成');
      expect(result).toContain('[ ] 未完成');
      expect(result).toContain('[code]行内代码[/code]');
      expect(result).toContain('[code]多行\n代码[/code]');
      expect(result).toContain('https://example.com/a.png');
      expect(result).toContain('链接标题\nhttps://example.com');
    });
  });

  describe('edge cases', () => {
    it('should handle empty input', () => {
      expect(convertMarkdownToV2exDefault('')).toBe('');
    });

    it('should handle whitespace only', () => {
      expect(convertMarkdownToV2exDefault('   \n  \n  ')).toBe('');
    });

    it('should not transform bold inside code', () => {
      const input = '`**not bold**`';
      const expected = '[code]**not bold**[/code]';
      expect(convertMarkdownToV2exDefault(input)).toBe(expected);
    });

    it('should handle nested emphasis in links', () => {
      const input = '[**Bold** link](https://example.com)';
      const result = convertMarkdownToV2exDefault(input);
      expect(result).toContain('[b]Bold[/b] link');
    });
  });
});
