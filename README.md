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
│   ├── converter.js        # 转换核心逻辑
│   ├── app.js             # 应用交互逻辑
│   └── style.css          # 样式文件
├── docs/
│   └── syntax-reference.html  # 语法参考文档
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Actions 部署配置
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

**如果觉得这个项目有帮助，请给个 ⭐ Star 支持一下！**
