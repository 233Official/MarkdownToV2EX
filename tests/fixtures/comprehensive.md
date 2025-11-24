# Markdown to V2EX Default 转换测试

这是一个全面的测试文档，展示各种 Markdown 语法如何转换为 V2EX Default 格式。

## 文本格式化

这段文本包含 **粗体文本**、*斜体文本* 和 ~~删除线文本~~。

你也可以组合使用：**_粗体斜体_** 和 ~~**删除粗体**~~。

## 代码

行内代码示例：`const x = 42;` 在句子中。

代码块示例：

```javascript
function convertToV2EX(markdown) {
  return convertMarkdownToV2exDefault(markdown);
}
```

```python
def hello_world():
    print("Hello, V2EX!")
```

## 引用

> 这是一段单行引用。

> 这是一段多行引用。
> 它可以包含多个段落。
> 每行都以 > 开头。

普通文本分隔引用。

> 这是另一段引用。

## 列表

### 无序列表

- 第一项
- 第二项
- 第三项
  - 嵌套项 1
  - 嵌套项 2

### 有序列表

1. 第一步
2. 第二步
3. 第三步
   1. 子步骤 A
   2. 子步骤 B

### 任务列表

- [x] 已完成的任务
- [ ] 未完成的任务
- [x] 另一个已完成的任务

## 链接和图片

访问 [V2EX 官网](https://v2ex.com) 了解更多信息。

查看 [GitHub 仓库](https://github.com/233Official/MarkdownToV2EX) 获取源代码。

![示例图片](https://via.placeholder.com/150)

## 表格

| 功能 | Markdown | V2EX Default |
|------|----------|--------------|
| 粗体 | `**text**` | `[b]text[/b]` |
| 代码 | `` `code` `` | `[code]code[/code]` |
| 引用 | `> quote` | `[blockquote]quote[/blockquote]` |

## 分隔线

下面是一条分隔线：

---

上面是一条分隔线。

***

另一种风格的分隔线。

## 特殊情况

### HTML 标签

这段文本包含 <strong>HTML 标签</strong> 和 <!-- 注释 --> 应该被移除。

### 脚注

这是一段带脚注的文本[^1]。

[^1]: 这是脚注内容，应该被移除。

### 复杂嵌套

- 列表项包含 **粗体** 和 `代码`
- 另一个列表项有 [链接](https://example.com)

> 引用块中有 **粗体** 和 *斜体*
> 还有 `行内代码`

## 结论

这个文档展示了 Markdown 到 V2EX Default 语法的各种转换。
