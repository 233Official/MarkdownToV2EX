# 📝 Markdown to V2EX Converter

[![Deploy to GitHub Pages](https://github.com/233Official/MarkdownToV2EX/actions/workflows/deploy.yml/badge.svg)](https://github.com/233Official/MarkdownToV2EX/actions/workflows/deploy.yml)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

Markdown 转 V2EX 评论语法工具 - 将标准 Markdown 转换为 V2EX 论坛兼容的格式

## 🌟 项目简介

V2EX 是一个知名的技术社区，但其 Markdown 支持相比标准 Markdown 或 GitHub Flavored Markdown (GFM) 有一些限制。本工具可以帮助你：

- ✅ 自动转换标准 Markdown 为 V2EX 兼容格式
- ✅ 处理不支持的语法（图片、表格、任务列表等）
- ✅ 实时预览转换效果
- ✅ 一键复制转换结果
- ✅ 提供详细的语法参考文档

## 🚀 在线使用

访问：**[https://233official.github.io/MarkdownToV2EX/](https://233official.github.io/MarkdownToV2EX/)**

## 💻 命令行工具 (CLI)

### 安装

```bash
# 克隆仓库
git clone https://github.com/233Official/MarkdownToV2EX.git
cd MarkdownToV2EX

# 安装依赖
npm install

# 构建
npm run build
```

### 使用方法

```bash
# 基本用法
node dist/cli.js input.md

# 输出到文件
node dist/cli.js input.md -o output.txt

# 原始直通模式（不转换）
node dist/cli.js input.md --raw

# 禁用粗体转换
node dist/cli.js input.md --no-bold

# 设置链接模式
node dist/cli.js input.md --links=url     # 仅显示 URL
node dist/cli.js input.md --links=label   # 仅显示文本
node dist/cli.js input.md --links=both    # [文本](URL)（默认）

# 设置表格处理模式
node dist/cli.js input.md --table=strip   # 删除表格
node dist/cli.js input.md --table=space   # 转为纯文本（默认）
node dist/cli.js input.md --table=keep    # 保持原样

# 从标准输入读取
cat input.md | node dist/cli.js
echo "# 标题\n\n**粗体**" | node dist/cli.js

# 查看帮助
node dist/cli.js --help
```

### 转换规则

CLI 工具使用以下规则将 Markdown 转换为 V2EX Default 语法：

| Markdown 语法 | V2EX 输出 | 说明 |
|--------------|-----------|------|
| `# 标题` | 标题文本 + `======` | 1-2级标题用 `======` |
| `### 标题` | 标题文本 + `------` | 3级及以上用 `------` |
| `**粗体**` | `[b]粗体[/b]` | 可用 `--no-bold` 禁用 |
| `*斜体*` | 斜体 | 移除斜体标记 |
| `~~删除线~~` | 删除线 | 移除删除线标记 |
| `` `代码` `` | `[code]代码[/code]` | 行内代码 |
| ` ```code``` ` | `[code]code[/code]` | 代码块，语言标识被忽略 |
| `> 引用` | `[blockquote]引用[/blockquote]` | 连续引用行合并 |
| `- 列表项` | 列表项 | 移除无序列表标记 |
| `1. 列表项` | `1. 列表项` | 保留有序列表编号 |
| `- [x] 任务` | `[x] 任务` | 任务列表保留复选框 |
| `[文本](url)` | 根据 `--links` 选项 | label/url/both |
| `![图片](url)` | `url` | 图片转为 URL |
| `---` | `------` | 水平分隔线 |
| 表格 | 根据 `--table` 选项 | strip/space/keep |
| HTML 标签 | （删除） | 移除所有 HTML |
| 脚注 `[^1]` | （删除） | 移除脚注及定义 |

### API 使用

也可以在 Node.js 项目中作为库使用：

```typescript
import { convertMarkdownToV2exDefault, ConvertOptions } from 'markdown-to-v2ex';

const markdown = '# 标题\n\n**粗体** *斜体*';
const options: ConvertOptions = {
  noBold: false,
  linkMode: 'both',
  tableMode: 'space',
  raw: false
};

const result = convertMarkdownToV2exDefault(markdown, options);
console.log(result);
```

## 📋 功能特性

### 支持的转换

| 原始语法 | V2EX 处理 |
|---------|----------|
| ✅ 标题 | 完全支持 (# ## ###) |
| ✅ 粗体/斜体 | 完全支持 (**粗体** *斜体*) |
| ✅ 删除线 | 完全支持 (~~删除~~) |
| ✅ 代码块 | 完全支持 (``` 代码块 ```) |
| ✅ 列表 | 完全支持 (无序列表、有序列表) |
| ✅ 链接 | 完全支持 ([文本](URL)) |
| ✅ 引用 | 完全支持 (> 引用) |
| ✅ 分隔线 | 完全支持 (---) |
| 🔄 图片 | 转换为链接格式 |
| 🔄 表格 | 转换为文本表示 |
| 🔄 任务列表 | 转换为普通列表 (带符号) |
| ❌ 脚注 | 自动移除 |
| ❌ HTML 标签 | 过滤不支持的标签 |

### 核心功能

- 🎯 **实时转换**：输入即转换，无需等待
- 👁️ **实时预览**：查看转换后的显示效果
- ⚠️ **智能提示**：自动检测不兼容语法并提示
- 📋 **一键复制**：快速复制转换结果
- 💾 **自动保存**：内容自动保存，防止丢失
- ⌨️ **快捷键支持**：
  - `Ctrl/Cmd + K`：清空输入
  - `Ctrl/Cmd + Enter`：复制输出

## 🛠️ 本地开发

### 克隆项目

```bash
git clone https://github.com/233Official/MarkdownToV2EX.git
cd MarkdownToV2EX
```

### 运行项目

直接在浏览器中打开 `index.html` 即可使用，无需构建步骤。

如果需要本地服务器：

```bash
# 使用 Python 3
python -m http.server 8000

# 使用 Node.js (需要安装 http-server)
npx http-server

# 使用 PHP
php -S localhost:8000
```

然后访问 `http://localhost:8000`

## 📁 项目结构

```
MarkdownToV2EX/
├── index.html              # 主页面
├── src/
│   ├── converter.js        # Web 版转换核心逻辑
│   ├── app.js             # Web 应用交互逻辑
│   ├── style.css          # 样式文件
│   ├── convert.ts         # CLI 转换核心逻辑 (TypeScript)
│   ├── cli.ts             # 命令行接口 (TypeScript)
│   └── index.ts           # 公共 API 导出 (TypeScript)
├── dist/                   # TypeScript 编译输出
│   ├── convert.js
│   ├── cli.js
│   └── index.js
├── examples/
│   └── sample.md          # 示例 Markdown 文件
├── docs/
│   └── syntax-reference.html  # 语法参考文档
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions 部署配置
├── package.json           # Node.js 项目配置
├── tsconfig.json          # TypeScript 配置
├── README.md              # 项目说明
└── LICENSE               # 开源协议
```

## 💡 使用示例

### 基本转换

**输入 Markdown：**

```markdown
# 标题示例

这是一个 **粗体** 和 *斜体* 的示例。

## 代码示例

```python
def hello():
    print("Hello, V2EX!")
```

- 列表项 1
- 列表项 2

> 这是一段引用

[访问 V2EX](https://v2ex.com)
```

**V2EX 输出：**

转换后的内容可以直接粘贴到 V2EX 使用，保持原有格式。

### 处理不支持的语法

**输入带图片的 Markdown：**

```markdown
![示例图片](https://example.com/image.jpg)
```

**V2EX 输出：**

```markdown
[🖼️ 图片: 示例图片](https://example.com/image.jpg)
```

## 📖 V2EX 语法参考

详细的 V2EX Markdown 语法说明，请查看：

- 📄 [在线语法参考文档](https://233official.github.io/MarkdownToV2EX/docs/syntax-reference.html)
- 🔗 [V2EX 官方 Markdown 帮助](https://www.v2ex.com/help/markdown)

### V2EX 支持的语法

- ✅ **标题**：`# ## ###`
- ✅ **粗体**：`**text**` 或 `__text__`
- ✅ **斜体**：`*text*` 或 `_text_`
- ✅ **删除线**：`~~text~~`
- ✅ **行内代码**：`` `code` ``
- ✅ **代码块**：``````` 代码 ```````
- ✅ **列表**：`-` `*` `+` 或 `1.`
- ✅ **链接**：`[text](url)`
- ✅ **引用**：`> quote`
- ✅ **分隔线**：`---` 或 `***`

### V2EX 不支持的语法

- ❌ **图片**：`![alt](url)` - 会被过滤
- ❌ **表格**：不支持 Markdown 表格
- ❌ **任务列表**：`- [ ]` 和 `- [x]`
- ❌ **脚注**：`[^1]`
- ❌ **HTML 标签**：大部分会被过滤
- ❌ **数学公式**：不支持 LaTeX

## 🔧 技术栈

- **前端**：纯原生 JavaScript (无框架依赖)
- **样式**：原生 CSS3
- **部署**：GitHub Pages
- **CI/CD**：GitHub Actions

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📝 开发计划

- [ ] 支持更多转换选项
- [ ] 添加转换历史记录
- [ ] 支持批量转换
- [ ] 添加浏览器扩展
- [ ] 支持更多主题样式

## 📄 许可证

本项目采用 [AGPL-3.0 License](LICENSE) 开源协议。

## 🙏 致谢

- 灵感来源：[NgaCodeConverter](https://github.com/sjn4048/NgaCodeConverter)
- 感谢 V2EX 社区的支持

## 📞 联系方式

- GitHub Issues: [提交问题](https://github.com/233Official/MarkdownToV2EX/issues)
- 项目主页: [MarkdownToV2EX](https://github.com/233Official/MarkdownToV2EX)

---

# English Documentation

## 📝 Markdown to V2EX Converter

A tool to convert standard Markdown to V2EX forum-compatible format, available both as a web application and command-line interface.

## 🚀 Online Usage

Visit: **[https://233official.github.io/MarkdownToV2EX/](https://233official.github.io/MarkdownToV2EX/)**

## 💻 Command Line Interface (CLI)

### Installation

```bash
# Clone the repository
git clone https://github.com/233Official/MarkdownToV2EX.git
cd MarkdownToV2EX

# Install dependencies
npm install

# Build
npm run build
```

### Usage

```bash
# Basic usage
node dist/cli.js input.md

# Output to file
node dist/cli.js input.md -o output.txt

# Raw passthrough mode (no conversion)
node dist/cli.js input.md --raw

# Disable bold conversion
node dist/cli.js input.md --no-bold

# Set link mode
node dist/cli.js input.md --links=url     # URL only
node dist/cli.js input.md --links=label   # Text only
node dist/cli.js input.md --links=both    # [text](url) (default)

# Set table handling mode
node dist/cli.js input.md --table=strip   # Remove tables
node dist/cli.js input.md --table=space   # Plain text (default)
node dist/cli.js input.md --table=keep    # Keep as-is

# Read from stdin
cat input.md | node dist/cli.js
echo "# Title\n\n**bold**" | node dist/cli.js

# Show help
node dist/cli.js --help
```

### Conversion Rules

The CLI tool converts Markdown to V2EX Default syntax using these rules:

| Markdown Syntax | V2EX Output | Notes |
|----------------|-------------|-------|
| `# Heading` | Heading text + `======` | Levels 1-2 use `======` |
| `### Heading` | Heading text + `------` | Levels 3+ use `------` |
| `**bold**` | `[b]bold[/b]` | Can disable with `--no-bold` |
| `*italic*` | italic | Removes italic markers |
| `~~strike~~` | strike | Removes strikethrough markers |
| `` `code` `` | `[code]code[/code]` | Inline code |
| ` ```code``` ` | `[code]code[/code]` | Code blocks, language ignored |
| `> quote` | `[blockquote]quote[/blockquote]` | Consecutive lines merged |
| `- item` | item | Removes unordered list markers |
| `1. item` | `1. item` | Keeps ordered list numbers |
| `- [x] task` | `[x] task` | Task lists keep checkboxes |
| `[text](url)` | Based on `--links` option | label/url/both |
| `![img](url)` | `url` | Images become URLs |
| `---` | `------` | Horizontal rules |
| Tables | Based on `--table` option | strip/space/keep |
| HTML tags | (removed) | All HTML removed |
| Footnotes `[^1]` | (removed) | Footnotes and definitions removed |

### API Usage

You can also use it as a library in your Node.js projects:

```typescript
import { convertMarkdownToV2exDefault, ConvertOptions } from 'markdown-to-v2ex';

const markdown = '# Title\n\n**bold** *italic*';
const options: ConvertOptions = {
  noBold: false,
  linkMode: 'both',
  tableMode: 'space',
  raw: false
};

const result = convertMarkdownToV2exDefault(markdown, options);
console.log(result);
```

### Example

**Input Markdown:**

```markdown
# Sample Document

This is **bold** and *italic* text.

## Code Example

```javascript
console.log('Hello, V2EX!');
```

- List item 1
- List item 2

> This is a quote

[Visit V2EX](https://v2ex.com)
```

**V2EX Output:**

```
Sample Document
======

This is [b]bold[/b] and italic text.

Code Example
------
[code]console.log('Hello, V2EX!');[/code]

List item 1
List item 2

[blockquote]
This is a quote
[/blockquote]

[Visit V2EX](https://v2ex.com)
```

## 🌟 Features

### Web Application
- 🎯 **Real-time conversion**: Convert as you type
- 👁️ **Live preview**: See how it will look
- ⚠️ **Smart warnings**: Detects incompatible syntax
- 📋 **One-click copy**: Quick copy to clipboard
- 💾 **Auto-save**: Never lose your content
- ⌨️ **Keyboard shortcuts**:
  - `Ctrl/Cmd + K`: Clear input
  - `Ctrl/Cmd + Enter`: Copy output

### Command Line Interface
- ✅ File and stdin input support
- ✅ Customizable conversion options
- ✅ Raw passthrough mode
- ✅ Flexible output options
- ✅ TypeScript support

## 🛠️ Technology Stack

- **Frontend**: Vanilla JavaScript
- **CLI**: TypeScript, Node.js
- **Deployment**: GitHub Pages
- **CI/CD**: GitHub Actions

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the [AGPL-3.0 License](LICENSE).

## 🙏 Acknowledgments

- Inspired by: [NgaCodeConverter](https://github.com/sjn4048/NgaCodeConverter)
- Thanks to the V2EX community

---

**如果觉得这个项目有帮助，请给个 ⭐ Star 支持一下！**
**If you find this project helpful, please give it a ⭐ Star!**
