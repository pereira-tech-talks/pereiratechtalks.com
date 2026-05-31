# Documentation Guide

Standards and best practices for writing and maintaining documentation for Pereira Tech Talks v3.0.0.

## Documentation Philosophy

### Goals

1. **Enable autonomous AI development** - Agents can work without constant guidance
2. **Reduce onboarding time** - New contributors understand quickly
3. **Maintain consistency** - Same patterns across the codebase
4. **Stay current** - Documentation reflects actual code

### Principles

- **English only** - All documentation in English
- **Concise** - Say what's needed, no more
- **Practical** - Include examples and commands
- **Maintainable** - Easy to update

## Documentation Types

### 1. Root-Level Documentation

| File | Purpose | Audience |
|------|---------|----------|
| `README.md` | Project overview | Everyone |
| `AGENTS.md` | AI agent guidance | AI assistants |
| `CLAUDE.md` | Claude Code config | Claude Code |

### 2. docs/ Folder

Detailed documentation for specific topics:

```
docs/
├── README.md              # Documentation index
├── ARCHITECTURE.md        # Technical design
├── STANDARDS.md           # Coding conventions
├── DEVELOPMENT_COMMANDS.md
├── TESTING_GUIDE.md
├── ...
```

### 3. Component Documentation

For complex components, add README:

```
src/components/blog/
├── README.md              # Component overview
├── BlogCard.svelte
├── BlogGrid.svelte
└── ...
```

### 4. Inline Documentation

Code comments for non-obvious logic:

```typescript
// Calculate reading time: ~200 words per minute
const readingTime = Math.ceil(wordCount / 200);

/**
 * Filters posts by tag and sorts by date
 * @param tag - Tag to filter by, or undefined for all
 * @returns Sorted array of posts
 */
export async function getPostsByTag(tag?: string) {
  // ...
}
```

## Writing Standards

### Markdown Format

```markdown
# Document Title

Brief introduction paragraph.

## Section

### Subsection

Content here.

## Code Examples

\`\`\`typescript
// Always include language for syntax highlighting
const example = 'code';
\`\`\`

## Tables

| Column 1 | Column 2 |
|----------|----------|
| Value 1  | Value 2  |

## Lists

- Use bullet points for unordered lists
- Keep items concise

1. Use numbers for ordered steps
2. One action per step
```

### Language

- **Use active voice**: "Run the command" not "The command should be run"
- **Be direct**: "Do X" not "You might want to do X"
- **Use present tense**: "This function returns" not "This function will return"

### Code Examples

Always include:

1. **Language tag** for syntax highlighting
2. **Context** for when to use
3. **Complete examples** that work

```markdown
### Creating a Blog Post

Create a new file in `src/content/blog/`:

\`\`\`markdown
---
title: "My Post Title"
description: "Brief description"
pubDate: 2024-01-15
tags: ["tech"]
---

Post content here...
\`\`\`
```

## When to Document

### Must Document

- ✅ New features or patterns
- ✅ Configuration changes
- ✅ Breaking changes
- ✅ Complex logic
- ✅ Non-obvious decisions

### Agent-Friendly Content (AEO)

- When adding new pages, create corresponding `.md` files in `src/content/pages/{en,es}/`
- When updating page content or translations, update corresponding `.md` files
- When content structure changes, update `public/llms.txt` and `public/llms-full.txt`

### Don't Over-Document

- ❌ Obvious code
- ❌ Standard patterns
- ❌ Temporary implementations
- ❌ Implementation details that change often

## File Naming Conventions

All documentation files in `docs/` follow **UPPER_SNAKE_CASE** naming:

```
docs/
├── README.md                  # Index (exception: always README.md)
├── BRAND_GUIDE.md             # ✅ UPPER_SNAKE_CASE
├── PRODUCT_SPEC.md            # ✅ UPPER_SNAKE_CASE
├── ARCHITECTURE.md            # ✅ UPPER_SNAKE_CASE
├── STANDARDS.md               # ✅ UPPER_SNAKE_CASE
└── features/
    ├── README.md              # Index (exception: always README.md)
    ├── BLOG_SEARCH.md         # ✅ UPPER_SNAKE_CASE
    ├── DARK_MODE.md           # ✅ UPPER_SNAKE_CASE
    └── PUBLIC_ASSETS.md       # ✅ UPPER_SNAKE_CASE
```

**Rules:**
- All caps with underscores: `BRAND_GUIDE.md`, `DARK_MODE.md`
- Exception: `README.md` files keep their standard name
- This applies to `docs/` and `docs/features/` only
- Source code READMEs (`src/**/README.md`) are unaffected

## Documentation Structure

### Standard Document Template

```markdown
# Document Title

Brief description of what this document covers.

## Overview

High-level explanation.

## Quick Start

Essential commands or steps to get started.

## Details

### Section 1

Detailed content...

### Section 2

More content...

## Examples

Practical examples.

## Troubleshooting

Common issues and solutions.

## Related

- [Link to related doc](./related.md)
```

### README.md Template

For component/module documentation:

```markdown
# Component/Module Name

## Purpose

What this does and why it exists.

## Usage

\`\`\`typescript
import { Thing } from './thing';

const result = Thing.doSomething();
\`\`\`

## API

### `functionName(param: Type): ReturnType`

Description of what it does.

**Parameters:**
- `param` - Description

**Returns:** Description

## Examples

Practical usage examples.

## Notes

Any important considerations.
```

## Maintenance

### When to Update

Update documentation when:

- Adding new features
- Changing existing behavior
- Fixing bugs that affect usage
- Changing commands or configuration

### Review Process

1. **Read your changes** - Does it make sense?
2. **Test commands** - Do they work?
3. **Check links** - Are they valid?
4. **Verify code examples** - Do they run?

### Keeping Current

- Update docs in same PR as code changes
- Review quarterly for accuracy
- Remove outdated content

## Documentation Checklist

### For New Features

- [ ] Feature documented in relevant guide
- [ ] Examples provided
- [ ] Related docs updated
- [ ] DOCUMENTATION_INVENTORY.md updated if new file

### For Documentation PRs

- [ ] Spelling and grammar checked
- [ ] Links verified
- [ ] Code examples tested
- [ ] Consistent with existing style

## Tools

### Markdown Preview

- VS Code: Built-in markdown preview
- Online: [StackEdit](https://stackedit.io/)

### Link Checking

```bash
# Check for broken links (if tool installed)
pnpm exec markdown-link-check docs/*.md
```

### Formatting

Use consistent formatting:
- 2 spaces for indentation in code blocks
- Single blank line between sections
- No trailing whitespace

## Common Patterns

### Command Documentation

```markdown
### Command Name

\`\`\`bash
pnpm run command
\`\`\`

**What it does:** Brief description.

**Options:**
- `--flag` - Description
```

### Configuration Documentation

```markdown
### Option Name

**Type:** `string`
**Default:** `"default"`
**Required:** No

Description of what this configures.

\`\`\`javascript
{
  optionName: "value"
}
\`\`\`
```

### API Documentation

```markdown
### `functionName()`

Description of the function.

**Signature:**
\`\`\`typescript
function functionName(param: string): Promise<Result>
\`\`\`

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| param | string | What this param does |

**Returns:** `Promise<Result>` - Description

**Example:**
\`\`\`typescript
const result = await functionName("value");
\`\`\`
```

## Resources

- [Markdown Guide](https://www.markdownguide.org/)
- [Write the Docs](https://www.writethedocs.org/guide/)
- [Google Developer Documentation Style Guide](https://developers.google.com/style)
