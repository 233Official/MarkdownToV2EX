# 📝 Markdown to V2EX Converter

[![Deploy to GitHub Pages](https://github.com/233Official/MarkdownToV2EX/actions/workflows/deploy.yml/badge.svg)](https://github.com/233Official/MarkdownToV2EX/actions/workflows/deploy.yml)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

Markdown 转 V2EX Default 语法工具 - 将标准 Markdown 转换为 V2EX 论坛的 Default（BBCode 风格）语法

## 🌟 项目简介

V2EX 是一个知名的技术社区，其 Default 语法使用 BBCode 风格的标签（如 `[b]`、`[code]`、`[blockquote]`）。本工具提供：

- ✅ **库 API**：可在 Node.js 项目中使用的转换函数
- ✅ **CLI 工具**：命令行转换工具，支持批量处理
- ✅ **Web 界面**：在线转换和预览（原有功能保留）
- ✅ **TypeScript**：完整的类型定义支持
- ✅ **全面测试**：47+ 单元测试覆盖各种场景

## 🚀 快速开始

### 在线使用

访问：**[https://233official.github.io/MarkdownToV2EX/](https://233official.github.io/MarkdownToV2EX/)**

### 作为库使用

```bash
npm install markdown-to-v2ex
```

```typescript
import { convertMarkdownToV2exDefault } from 'markdown-to-v2ex';

const markdown = `
# 标题
**粗体** 和 *斜体*
`;

const v2exText = convertMarkdownToV2exDefault(markdown);
console.log(v2exText);
// 输出:
// 标题
// ======
// [b]粗体[/b] 和 斜体
```

### 作为 CLI 使用

```bash
npm install -g markdown-to-v2ex

# 基本用法
md2v2ex input.md

# 输出到文件
md2v2ex input.md -o output.txt

# 使用选项
md2v2ex input.md --no-bold --links=label
```

## 📋 转换规则

### 支持的转换

| Markdown 语法 | V2EX Default 输出 | 说明 |
|--------------|------------------|------|
| `# 标题` | `标题`<br>`======` | H1/H2 用 `=`, H3+ 用 `-` |
| `**粗体**` | `[b]粗体[/b]` | 可用 `--no-bold` 禁用 |
| `*斜体*` | `斜体` | 移除标记（V2EX Default 不支持） |
| `~~删除~~` | `删除` | 移除标记 |
| `` `代码` `` | `[code]代码[/code]` | 行内代码 |
| ` ```代码块``` ` | `[code]代码块[/code]` | 代码块 |
| `> 引用` | `[blockquote]引用[/blockquote]` | 引用块 |
| `- 列表` | `列表` | 移除列表标记 |
| `1. 列表` | `1. 列表` | 保留序号 |
| `- [x] 任务` | `[x] 任务` | 任务列表 |
| `[文本](url)` | `文本`<br>`url` | 可配置为 `label`/`url`/`both` |
| `![图片](url)` | `url` | 仅保留图片 URL |
| `---` | `------` | 分隔线 |
| `表格` | 空格分隔文本 | 可配置为 `strip`/`space`/`keep` |

### CLI 选项

```bash
md2v2ex <input-file> [options]

选项:
  -o, --output <file>    输出文件（默认：标准输出）
  --no-bold              不转换粗体为 [b]...[/b]，仅移除标记
  --links=<mode>         链接转换模式（label|url|both，默认：both）
                         label: 仅输出链接文本
                         url: 仅输出 URL
                         both: 文本和 URL 分两行输出
  --table=<mode>         表格转换模式（strip|space|keep，默认：space）
                         strip: 完全移除表格
                         space: 转换为空格分隔文本
                         keep: 保留原始行，移除对齐行
  -h, --help             显示帮助信息
  -v, --version          显示版本号
```

### API 选项

```typescript
interface ConvertOptions {
  bold?: boolean;              // 默认: true
  links?: 'label' | 'url' | 'both';  // 默认: 'both'
  table?: 'strip' | 'space' | 'keep';  // 默认: 'space'
  headingSeparator?: 'equals' | 'dashes';  // 默认: 'equals'
}

convertMarkdownToV2exDefault(markdown: string, options?: ConvertOptions): string
```
## 💡 使用示例

### 库使用示例

```typescript
import { convertMarkdownToV2exDefault } from 'markdown-to-v2ex';

// 示例 1: 基本转换
const markdown = `
# 我的文章

这是 **粗体** 和 *斜体* 文本。

> 这是一段引用

\`\`\`javascript
console.log('Hello V2EX');
\`\`\`
`;

const result = convertMarkdownToV2exDefault(markdown);
console.log(result);

// 示例 2: 自定义选项
const result2 = convertMarkdownToV2exDefault(markdown, {
  bold: false,           // 不转换粗体
  links: 'url',          // 链接只保留 URL
  table: 'strip',        // 移除表格
});

// 示例 3: 处理链接
const withLinks = '[V2EX](https://v2ex.com)';
console.log(convertMarkdownToV2exDefault(withLinks, { links: 'both' }));
// 输出:
// V2EX
// https://v2ex.com

console.log(convertMarkdownToV2exDefault(withLinks, { links: 'label' }));
// 输出: V2EX

console.log(convertMarkdownToV2exDefault(withLinks, { links: 'url' }));
// 输出: https://v2ex.com
```

### CLI 使用示例

```bash
# 基本转换
md2v2ex article.md

# 保存到文件
md2v2ex article.md -o article-v2ex.txt

# 不转换粗体，只保留链接文本
md2v2ex article.md --no-bold --links=label

# 移除所有表格
md2v2ex article.md --table=strip

# 组合多个选项
md2v2ex article.md -o output.txt --no-bold --links=url --table=keep
```

### 完整转换示例

**输入 Markdown:**

```markdown
# 标题

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

[链接标题](https://example.com)
```

**V2EX Default 输出:**

```
标题
======

[b]加粗[/b] 和 斜体 以及 删除。

[blockquote]引用一
引用二[/blockquote]

1. 第一项
2. 第二项

[x] 已完成
[ ] 未完成

[code]行内代码[/code] 和 [code]多行
代码[/code] 结束

https://example.com/a.png

链接标题
https://example.com
```

## 🛠️ 本地开发

### 库和 CLI 开发

```bash
# 克隆项目
git clone https://github.com/233Official/MarkdownToV2EX.git
cd MarkdownToV2EX

# 安装依赖
npm install

# 构建 TypeScript
npm run build

# 运行测试
npm test

# 开发模式（自动编译）
npm run dev
```

### Web 界面开发

Web 界面是纯静态页面，直接在浏览器中打开 `index.html` 即可使用。

如果需要本地服务器：

```bash
# 使用 Python 3
python -m http.server 8000

# 使用 Node.js
npx http-server

# 使用 PHP
php -S localhost:8000
```

然后访问 `http://localhost:8000`

## 📁 项目结构

```
MarkdownToV2EX/
├── src/
│   ├── core/                    # 核心转换逻辑
│   │   ├── types.ts            # TypeScript 类型定义
│   │   ├── converter.ts        # 主转换器
│   │   ├── block-transforms.ts # 块级元素转换
│   │   ├── inline-transforms.ts # 行内元素转换
│   │   └── converter.test.ts   # 单元测试
│   ├── index.ts                # 库主入口
│   ├── cli.ts                  # CLI 工具
│   ├── converter.js            # Web 版本（旧）
│   ├── app.js                  # Web 应用逻辑
│   └── style.css               # 样式文件
├── tests/
│   └── fixtures/               # 测试用例文件
├── dist/                       # 编译输出（npm publish）
├── docs/                       # 文档
├── index.html                  # Web 界面
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## 🧪 测试

项目包含 47+ 单元测试，覆盖所有主要功能：

```bash
npm test
```

测试覆盖：
- ✅ 标题转换（各级别、不同分隔符风格）
- ✅ 粗体/斜体/删除线处理
- ✅ 代码块和行内代码（保护机制）
- ✅ 引用块（单行/多行/分离）
- ✅ 列表（有序/无序/任务列表/缩进）
- ✅ 链接和图片（各种模式）
- ✅ 表格（多种处理模式）
- ✅ HTML 和脚注移除
- ✅ 边界情况和复杂组合

## 📖 技术栈与架构

### 库/CLI
- **语言**：TypeScript 5.3+
- **测试**：Jest with ts-jest
- **运行时**：Node.js 14+
- **构建**：TypeScript Compiler

### Web 界面
- **前端**：纯原生 JavaScript（无框架依赖）
- **样式**：原生 CSS3
- **部署**：GitHub Pages
- **CI/CD**：GitHub Actions

### 转换算法

采用多遍处理策略，确保转换的准确性和稳定性：

1. **预处理**：提取代码块，用占位符保护
2. **块级转换**：处理标题、引用、列表、表格等
3. **行内保护**：提取行内代码，用占位符保护
4. **行内转换**：处理粗体、斜体、链接、图片等
5. **恢复内容**：还原所有占位符
6. **后处理**：清理多余空行，修剪空白

> 关键设计：使用不可见字符（`\x00`）作为占位符，避免与 Markdown 语法冲突

## 🔍 V2EX Default 语法说明

V2EX Default 语法是 V2EX 论坛的基础格式，使用 BBCode 风格的标签：

### 支持的标签

- `[b]粗体[/b]` - 粗体文本
- `[code]代码[/code]` - 代码（行内或块级）
- `[blockquote]引用[/blockquote]` - 引用块

### 不支持的功能

- ❌ 斜体（本工具会移除标记）
- ❌ 删除线（本工具会移除标记）
- ❌ 图片内嵌（本工具转为 URL）
- ❌ 表格（本工具可配置处理方式）
- ❌ 任务列表（本工具转为文本）
- ❌ 脚注（本工具会移除）
- ❌ HTML 标签（本工具会移除）

详细语法参考：
- 📄 [在线语法参考文档](https://233official.github.io/MarkdownToV2EX/docs/syntax-reference.html)

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

### 开发流程

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/AmazingFeature`
3. 编写代码和测试
4. 运行测试：`npm test`
5. 提交更改：`git commit -m 'Add some AmazingFeature'`
6. 推送到分支：`git push origin feature/AmazingFeature`
7. 开启 Pull Request

### 代码规范

- 遵循 TypeScript 最佳实践
- 为新功能添加单元测试
- 保持测试覆盖率 > 90%
- 更新相关文档

## 📝 开发计划

### 已完成 ✅

- [x] TypeScript 核心库实现
- [x] CLI 命令行工具
- [x] 完整的单元测试套件
- [x] 多种转换选项支持
- [x] Web 在线转换界面

### 计划中 🚀

- [ ] NPM 包发布
- [ ] 浏览器扩展版本
- [ ] 支持更多 V2EX 语法变体
- [ ] 转换历史记录（Web 版）
- [ ] 批量文件转换（CLI）
- [ ] VSCode 扩展
- [ ] 性能优化（大文件处理）

## 📄 许可证

本项目采用 [AGPL-3.0 License](LICENSE) 开源协议。

## 🙏 致谢

- 灵感来源：[NgaCodeConverter](https://github.com/sjn4048/NgaCodeConverter)
- 感谢 V2EX 社区的支持
- 所有贡献者的付出

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
