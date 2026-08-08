---
title: 'Complete Markdown Reference for Technical Writers'
description: 'A comprehensive showcase of all Markdown formatting features available for blog posts'
pubDate: '2025-01-06'
heroImage: '/images/blog/shared/blog-placeholder-5.webp'
heroLayout: 'banner'
tags: ['tech', 'demo']
keywords: ['markdown formatting guide', 'technical writing markdown', 'markdown syntax reference', 'blog post formatting', 'markdown for developers']
---

This post demonstrates every Markdown formatting feature supported in our blog system. Use it as a reference when writing your own posts.

## Text Formatting

Regular paragraph text flows naturally across lines. Markdown handles line breaks and paragraph spacing automatically.

**Bold text** is created with double asterisks. *Italic text* uses single asterisks. ***Bold and italic*** combines both. ~~Strikethrough~~ uses double tildes.

You can also use `inline code` with backticks for technical terms, file names like `package.json`, or commands like `npm install`.

## Headings

Headings are created with hash symbols. This document uses H2 for main sections and H3-H4 for subsections:

### Third Level Heading

#### Fourth Level Heading

##### Fifth Level Heading

###### Sixth Level Heading

## Lists

### Unordered Lists

- First item
- Second item
  - Nested item A
  - Nested item B
    - Deeply nested item
- Third item

### Ordered Lists

1. First step
2. Second step
   1. Sub-step A
   2. Sub-step B
3. Third step

### Task Lists

- [x] Write the blog post
- [x] Add code examples
- [x] Include images
- [ ] Review and publish
- [ ] Share on social media

## Blockquotes

> "Any fool can write code that a computer can understand. Good programmers write code that humans can understand." — Martin Fowler

Nested blockquotes are also supported:

> This is the outer quote.
>
> > This is a nested quote inside the outer quote. It can contain its own formatting like **bold** and `code`.
>
> Back to the outer level.

## Links

- [External link to Astro docs](https://docs.astro.build)
- [Link with title](https://docs.astro.build "Astro Documentation")
- Autolinked URL: https://example.com

## Images

Images can be embedded with alt text:

![A placeholder image demonstrating inline image support](/images/blog/shared/blog-placeholder-3.webp)

## Tables

### Basic Table

| Feature | Status | Priority |
|---------|--------|----------|
| Dark mode | Complete | High |
| Search | Complete | High |
| RSS feed | Complete | Medium |
| Comments | Planned | Low |

### Aligned Table

| Left Aligned | Center Aligned | Right Aligned |
|:-------------|:--------------:|--------------:|
| Text | Text | Text |
| Longer text | Longer text | Longer text |
| 100 | 200 | 300 |

## Code Blocks

### Inline Code

Use `const x = 42` for inline code within paragraphs.

### Fenced Code Blocks

```javascript
// JavaScript example
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10)); // 55
```

```python
# Python example
def fibonacci(n: int) -> int:
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

print(fibonacci(10))  # 55
```

### Code Block Without Language

```
This is a plain code block
without syntax highlighting.
Useful for generic output or logs.
```

## Horizontal Rules

Content above the rule.

---

Content below the rule.

## Special Characters and Escaping

You can escape Markdown characters with a backslash: \*not italic\*, \`not code\`, \# not a heading.

HTML entities also work: &copy; 2025, 5 &gt; 3, A &amp; B.

## Emphasis Combinations

- **Bold text** for strong emphasis
- *Italic text* for mild emphasis
- ***Bold italic*** for maximum emphasis
- ~~Strikethrough~~ for deprecated content
- **Bold with `code` inside**
- *Italic with `code` inside*

## Long Content for Scroll Testing

This section contains enough content to test how longer articles render and scroll. Technical writing often involves detailed explanations that span multiple paragraphs.

When building a static site, the content pipeline typically involves several stages: writing in Markdown, processing through a build tool (like Astro), applying layouts and styles, and generating the final HTML output. Each stage adds value — the Markdown is easy to write and version control, the build tool handles optimization and component integration, and the output is fast, accessible HTML.

The beauty of this approach is that writers focus on content while the build system handles presentation. A well-designed blog system makes this separation clean and maintainable, allowing content to be updated independently of design changes.

## Summary

This post covered all the major Markdown formatting features:

1. Text formatting (bold, italic, strikethrough, code)
2. Headings (H1 through H6)
3. Lists (ordered, unordered, task lists)
4. Blockquotes (including nested)
5. Links and images
6. Tables (with alignment)
7. Code blocks (inline and fenced)
8. Horizontal rules
9. Special characters and escaping

Use these features to create rich, well-structured technical content that's easy to read and maintain.
