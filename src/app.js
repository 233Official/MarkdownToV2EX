/**
 * Application logic for Markdown to V2EX Converter
 */

// Initialize converter
const converter = new MarkdownToV2EX();

// DOM elements
const markdownInput = document.getElementById('markdown-input');
const v2exOutput = document.getElementById('v2ex-output');
const previewElement = document.getElementById('preview');
const copyButton = document.getElementById('copy-output');
const clearButton = document.getElementById('clear-input');
const copyMessage = document.getElementById('copy-success');

// Marked.js configuration for preview
// We'll use a simple parser for preview
const simpleMarkdownParser = {
    parse: function(markdown) {
        if (!markdown) return '';
        
        let html = markdown;
        
        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
        
        // Bold
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
        
        // Italic
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
        html = html.replace(/_(.+?)_/g, '<em>$1</em>');
        
        // Strikethrough
        html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');
        
        // Code blocks
        html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>');
        
        // Inline code
        html = html.replace(/`(.+?)`/g, '<code>$1</code>');
        
        // Links
        html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        // Blockquotes
        html = html.replace(/^> (.+$)/gim, '<blockquote>$1</blockquote>');
        
        // Horizontal rule
        html = html.replace(/^---$/gim, '<hr>');
        html = html.replace(/^\*\*\*$/gim, '<hr>');
        
        // Unordered lists
        html = html.replace(/^\* (.+$)/gim, '<li>$1</li>');
        html = html.replace(/^- (.+$)/gim, '<li>$1</li>');
        html = html.replace(/^\+ (.+$)/gim, '<li>$1</li>');
        
        // Wrap consecutive list items
        html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
        
        // Ordered lists
        html = html.replace(/^\d+\. (.+$)/gim, '<li>$1</li>');
        
        // Line breaks
        html = html.replace(/\n\n/g, '</p><p>');
        html = html.replace(/\n/g, '<br>');
        
        // Wrap in paragraphs if not already wrapped
        if (!html.startsWith('<')) {
            html = '<p>' + html + '</p>';
        }
        
        return html;
    }
};

// Event listeners
markdownInput.addEventListener('input', handleInputChange);
copyButton.addEventListener('click', copyToClipboard);
clearButton.addEventListener('click', clearInput);

// Handle input change
function handleInputChange() {
    const markdown = markdownInput.value;
    
    // Convert to V2EX format
    const v2exMarkdown = converter.convert(markdown);
    v2exOutput.value = v2exMarkdown;
    
    // Update preview
    updatePreview(v2exMarkdown);
    
    // Get and display warnings
    const warnings = converter.getWarnings(markdown);
    displayWarnings(warnings);
}

// Update preview
function updatePreview(markdown) {
    if (!markdown) {
        previewElement.innerHTML = '<p style="color: #999;">预览将显示在这里...</p>';
        return;
    }
    
    // Parse markdown to HTML for preview
    const html = simpleMarkdownParser.parse(markdown);
    previewElement.innerHTML = html;
}

// Display warnings
function displayWarnings(warnings) {
    // Remove existing warning elements
    const existingWarnings = document.querySelectorAll('.warning-message');
    existingWarnings.forEach(w => w.remove());
    
    if (warnings.length === 0) return;
    
    // Create warning element
    const warningDiv = document.createElement('div');
    warningDiv.className = 'warning-message';
    warningDiv.style.cssText = `
        margin-top: 10px;
        padding: 10px 15px;
        background-color: #fff3cd;
        border: 1px solid #ffc107;
        border-radius: 6px;
        color: #856404;
    `;
    
    const warningTitle = document.createElement('strong');
    warningTitle.textContent = '⚠️ 转换提示：';
    warningDiv.appendChild(warningTitle);
    
    const warningList = document.createElement('ul');
    warningList.style.cssText = 'margin: 5px 0 0 20px; padding: 0;';
    
    warnings.forEach(warning => {
        const li = document.createElement('li');
        li.textContent = warning;
        li.style.marginBottom = '3px';
        warningList.appendChild(li);
    });
    
    warningDiv.appendChild(warningList);
    
    // Insert after output textarea
    v2exOutput.parentNode.insertBefore(warningDiv, v2exOutput.nextSibling);
}

// Copy to clipboard
async function copyToClipboard() {
    const text = v2exOutput.value;
    
    if (!text) {
        alert('没有内容可复制！');
        return;
    }
    
    try {
        // Modern clipboard API
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }
        
        // Show success message
        copyMessage.classList.add('show');
        setTimeout(() => {
            copyMessage.classList.remove('show');
        }, 2000);
    } catch (err) {
        console.error('复制失败:', err);
        alert('复制失败，请手动复制内容');
    }
}

// Clear input
function clearInput() {
    if (markdownInput.value && !confirm('确定要清空输入内容吗？')) {
        return;
    }
    
    markdownInput.value = '';
    v2exOutput.value = '';
    previewElement.innerHTML = '<p style="color: #999;">预览将显示在这里...</p>';
    
    // Remove warnings
    const existingWarnings = document.querySelectorAll('.warning-message');
    existingWarnings.forEach(w => w.remove());
}

// Load example on first visit
window.addEventListener('DOMContentLoaded', () => {
    // Check if there's saved content
    const savedContent = localStorage.getItem('markdown-content');
    if (savedContent) {
        markdownInput.value = savedContent;
        handleInputChange();
    }
    
    // Save content periodically
    setInterval(() => {
        if (markdownInput.value) {
            localStorage.setItem('markdown-content', markdownInput.value);
        }
    }, 5000);
});

// Clean up on unload
window.addEventListener('beforeunload', () => {
    if (markdownInput.value) {
        localStorage.setItem('markdown-content', markdownInput.value);
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to clear
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        clearInput();
    }
    
    // Ctrl/Cmd + Enter to copy
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        copyToClipboard();
    }
});
