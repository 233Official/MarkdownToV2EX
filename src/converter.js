/**
 * Markdown to V2EX Converter
 * 
 * Converts standard Markdown to V2EX-compatible Markdown.
 * V2EX supports a subset of Markdown with some limitations.
 */

class MarkdownToV2EX {
    constructor() {
        // V2EX supported features and their patterns
        this.patterns = {
            // Images are not supported in V2EX, convert to links
            image: /!\[([^\]]*)\]\(([^)]+)\)/g,
            
            // Tables are not supported, needs to be converted to plain text
            table: /^\|(.+)\|$/gm,
            
            // Task lists are not supported
            taskList: /^(\s*)-\s+\[([ xX])\]\s+(.+)$/gm,
            
            // Footnotes are not supported
            footnote: /\[\^([^\]]+)\]/g,
            footnoteDefinition: /^\[\^([^\]]+)\]:\s+(.+)$/gm,
            
            // HTML comments
            htmlComment: /<!--[\s\S]*?-->/g,
            
            // Some HTML tags that should be removed
            htmlTags: /<(?!\/?(?:code|pre|b|i|strong|em)\b)[^>]+>/g,
        };
    }

    /**
     * Convert Markdown to V2EX format
     * @param {string} markdown - Input Markdown text
     * @returns {string} - V2EX compatible Markdown
     */
    convert(markdown) {
        if (!markdown || typeof markdown !== 'string') {
            return '';
        }

        let result = markdown;

        // Remove HTML comments
        result = this.removeHtmlComments(result);

        // Convert images to links (V2EX doesn't support inline images)
        result = this.convertImagesToLinks(result);

        // Convert tables to plain text representation
        result = this.convertTables(result);

        // Convert task lists to regular lists
        result = this.convertTaskLists(result);

        // Remove footnotes
        result = this.removeFootnotes(result);

        // Remove unsupported HTML tags
        result = this.removeUnsupportedHtml(result);

        // Clean up excessive blank lines
        result = this.cleanupBlankLines(result);

        return result.trim();
    }

    /**
     * Remove HTML comments
     */
    removeHtmlComments(text) {
        return text.replace(this.patterns.htmlComment, '');
    }

    /**
     * Convert images to links
     * V2EX doesn't support inline images, so we convert them to regular links
     */
    convertImagesToLinks(text) {
        return text.replace(this.patterns.image, (match, alt, url) => {
            // Convert image to a link with indication
            return `[🖼️ 图片: ${alt || 'image'}](${url})`;
        });
    }

    /**
     * Convert tables to plain text
     * V2EX doesn't support Markdown tables
     */
    convertTables(text) {
        const lines = text.split('\n');
        const result = [];
        let inTable = false;
        let tableBuffer = [];

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            
            // Check if this is a table row
            if (line.trim().match(/^\|(.+)\|$/)) {
                if (!inTable) {
                    inTable = true;
                    tableBuffer = [];
                }
                tableBuffer.push(line);
            } else {
                // If we were in a table, convert it
                if (inTable) {
                    result.push(this.formatTableAsText(tableBuffer));
                    inTable = false;
                    tableBuffer = [];
                }
                result.push(line);
            }
        }

        // Handle table at the end
        if (inTable && tableBuffer.length > 0) {
            result.push(this.formatTableAsText(tableBuffer));
        }

        return result.join('\n');
    }

    /**
     * Format table as plain text
     */
    formatTableAsText(tableLines) {
        if (tableLines.length === 0) return '';

        const rows = tableLines.map(line => {
            return line.split('|')
                .filter(cell => cell.trim())
                .map(cell => cell.trim());
        });

        // Skip separator line if exists
        const contentRows = rows.filter(row => 
            !row.every(cell => /^[-:]+$/.test(cell))
        );

        if (contentRows.length === 0) return '';

        // Format as a simple text representation
        let result = '\n```\n';
        result += '⚠️ V2EX 不支持表格，以下是表格内容的文本表示：\n\n';
        
        contentRows.forEach((row, idx) => {
            if (idx === 0) {
                // Header
                result += row.join(' | ') + '\n';
                result += '-'.repeat(row.join(' | ').length) + '\n';
            } else {
                result += row.join(' | ') + '\n';
            }
        });
        
        result += '```\n';
        return result;
    }

    /**
     * Convert task lists to regular lists
     */
    convertTaskLists(text) {
        return text.replace(this.patterns.taskList, (match, indent, checked, content) => {
            const status = checked.toLowerCase() === 'x' ? '✓' : '○';
            return `${indent}- ${status} ${content}`;
        });
    }

    /**
     * Remove footnotes
     */
    removeFootnotes(text) {
        // Remove footnote references
        let result = text.replace(this.patterns.footnote, '');
        
        // Remove footnote definitions
        result = result.replace(this.patterns.footnoteDefinition, '');
        
        return result;
    }

    /**
     * Remove unsupported HTML tags
     */
    removeUnsupportedHtml(text) {
        // Keep basic formatting tags (code, pre, b, i, strong, em)
        // Remove other HTML tags
        return text.replace(this.patterns.htmlTags, '');
    }

    /**
     * Clean up excessive blank lines
     */
    cleanupBlankLines(text) {
        // Replace 3+ consecutive newlines with just 2
        return text.replace(/\n{3,}/g, '\n\n');
    }

    /**
     * Get warnings about unsupported features
     */
    getWarnings(markdown) {
        const warnings = [];

        if (this.patterns.image.test(markdown)) {
            warnings.push('检测到图片：V2EX 不支持内联图片，已转换为链接');
        }

        if (this.patterns.table.test(markdown)) {
            warnings.push('检测到表格：V2EX 不支持 Markdown 表格，已转换为文本表示');
        }

        if (this.patterns.taskList.test(markdown)) {
            warnings.push('检测到任务列表：V2EX 不支持任务列表，已转换为普通列表');
        }

        if (this.patterns.footnote.test(markdown) || this.patterns.footnoteDefinition.test(markdown)) {
            warnings.push('检测到脚注：V2EX 不支持脚注，已移除');
        }

        if (this.patterns.htmlTags.test(markdown)) {
            warnings.push('检测到 HTML 标签：部分标签可能不被 V2EX 支持，已清理');
        }

        return warnings;
    }

    /**
     * Check if the markdown is V2EX compatible
     */
    isV2EXCompatible(markdown) {
        return this.getWarnings(markdown).length === 0;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarkdownToV2EX;
}
