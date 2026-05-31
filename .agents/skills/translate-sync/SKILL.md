---
name: translate-sync
description: Synchronize content between English and Spanish versions. Use proactively when content needs multilingual synchronization.
# === Universal (Claude Code + Cursor + Codex) ===
disable-model-invocation: false
# === Claude Code specific ===
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
model: haiku
# === Documentation (ignored by tools, useful for humans) ===
tier: 1
intent: execute
max-files: 10
max-loc: 500
---

# Skill: Translate Sync

## Objective

Synchronize content between English (en) and Spanish (es) versions of pages, blog posts, and translation strings. Ensures multilingual parity across the entire site.

## Non-Goals

- Does NOT create new pages or posts from scratch (use `add-page` or `add-blog-post`)
- Does NOT modify the translation system architecture
- Does NOT add new languages to `src/lib/i18n.ts` (only syncs existing active languages)
- Does NOT change Content Collection schemas or `content.config.ts`

## Tier Classification

**Tier: 1** - Light/Cheap

**Reasoning:** Translation follows established patterns, is content-focused, and has low risk. The source content already exists; this skill produces the counterpart.

## Inputs

### Required Parameters

- `$SOURCE_FILE`: The file that was recently created or modified (en or es version)

### Optional Parameters

- `$TARGET_LANG`: Target language to sync to (default: auto-detect the opposite language from source path)
- `$CONTENT_TYPE`: Type of content: `page`, `blog`, `translation-strings` (default: auto-detect from file path)

## Prerequisites

- [ ] Source file exists and is valid
- [ ] For blog posts: understand Content Collection schema in `content.config.ts`
- [ ] For translation strings: understand `src/lib/translations/` modular structure

## Steps

### Step 1: Detect Source Language and Content Type

Determine the source language and content type from the file path:

| Path Pattern | Language | Content Type |
|---|---|---|
| `src/pages/es/**` | Spanish | page |
| `src/pages/**` (not es/) | English | page |
| `src/content/blog/es/**` | Spanish | blog |
| `src/content/blog/en/**` | English | blog |
| `src/lib/translations/en.ts` | English | translation-strings |
| `src/lib/translations/es.ts` | Spanish | translation-strings |

Set target language to the opposite of source.

### Step 2: Find or Create Target File

Map source to target path:

| Source | Target |
|---|---|
| `src/pages/{path}.astro` | `src/pages/es/{path}.astro` |
| `src/pages/es/{path}.astro` | `src/pages/{path}.astro` |
| `src/content/blog/en/{slug}.md` | `src/content/blog/es/{slug}.md` |
| `src/content/blog/es/{slug}.md` | `src/content/blog/en/{slug}.md` |

If the target file does not exist, create it using the source as a template. If it exists, update it to match the source structure.

### Step 3: Translate Content

Translate the content following these rules:

**For blog posts:**
- Translate: `title`, `description`, and body content
- Preserve exactly: `pubDate`, `updatedDate`, `heroImage`, `tags`, code blocks, frontmatter structure
- Use natural, idiomatic translations (not literal word-for-word)
- Preserve all markdown formatting, headings, lists, links
- Do NOT translate code blocks, terminal commands, or technical identifiers
- **Direct quotes in English:** When translating to Spanish and the content includes a direct quote originally in English, keep the original English text in italics and add a Spanish translation in parentheses immediately after. Example: *"Express my will to my agents."* ("Expresar mi voluntad a mis agentes.")

**For page wrappers (.astro in `src/pages/`):**
- Pages use the Page wrapper pattern: thin 3-line wrappers that import a shared `*Page.astro` component
- Set the correct `lang` string literal: `lang="en"` or `lang="es"`
- The shared component in `src/components/pages/` handles `MainLayout`, translations, and content internally
- When syncing a page, verify both the wrapper and the shared component exist

**For translation strings (en.ts/es.ts):**
- Find keys that exist in one locale file but not the other
- Add the missing translations maintaining the same nested structure
- Ensure both `en.ts` and `es.ts` export objects with identical key structures
- Update `src/lib/translations/types.ts` if new interface fields are needed

### Step 4: Validate Synchronization

```bash
# Check both files exist
ls -la {source_file} {target_file}

# Run code quality checks
pnpm run biome:check
pnpm run astro:check
pnpm run build
```

## Output Format

### Success Output

```
## Translation Sync Complete

### Source
- File: {source_file}
- Language: {en|es}
- Type: {page|blog|translation-strings}

### Target
- File: {target_file}
- Language: {en|es}
- Action: {created|updated}

### Changes
- {list of specific changes made}

### Validation
- Biome check: {pass/fail}
- Astro check: {pass/fail}
- Build: {pass/fail}

### Commit Message
content: sync {content_type} translation for "{identifier}" ({source_lang} -> {target_lang})
```

## Guardrails

### Scope Limits

- Maximum files: 10 per invocation
- Maximum LOC: 500

### Translation Quality Rules

- Use natural, idiomatic translations (not literal)
- Preserve technical terminology without translation (code terms, product names, URLs)
- Use informal-professional register for Spanish (Colombian Spanish phrasing, consistent with site voice)
- Maintain the same markdown structure and formatting
- **CRITICAL — Spanish orthography:** ALL Spanish text MUST use correct diacritical marks (ñ, á, é, í, ó, ú). Never write `pequeno` (→ pequeño), `tamano` (→ tamaño), `analisis` (→ análisis), `numero` (→ número), `codigo` (→ código), `pagina` (→ página), `ejecucion` (→ ejecución), `version` (→ versión), etc. Run a quick grep check before committing.

### Stop Conditions

Stop and ask if:

- Translation quality is uncertain for domain-specific or technical content
- Source file has validation errors or malformed frontmatter
- Content type cannot be determined from the file path
- More than 10 files need synchronization (break into batches)
- Source file contains content that seems incomplete or draft-quality

## Definition of Done

- [ ] Target file exists with translated content
- [ ] Frontmatter structure matches source (for blog posts)
- [ ] All user-visible text is translated
- [ ] Code blocks, commands, and technical content are preserved untranslated
- [ ] `lang` value is correct in target page files
- [ ] Spanish text has correct diacritical marks (ñ, accents — no `pequeno`, `tamano`, `numero`, `codigo`)
- [ ] `pnpm run biome:check` passes
- [ ] `pnpm run astro:check` passes
- [ ] `pnpm run build` passes

## Escalation Conditions

Escalate to higher tier if:

- Content requires domain-specific terminology review -> use `i18n-guardian` agent
- More than 10 files need synchronization -> break into multiple invocations
- Structural changes are needed (new components, new routes) -> escalate to Tier 2
- Translation system architecture needs modification -> escalate to `architect` agent

## Examples

### Example 1: Sync a New English Blog Post to Spanish

**Input:**
```
$SOURCE_FILE: src/content/blog/en/getting-started-with-astro.md
```

**Actions:**
1. Detect: English blog post
2. Target: `src/content/blog/es/getting-started-with-astro.md`
3. Translate title, description, and body to Spanish
4. Preserve frontmatter dates, tags, hero image
5. Validate and report

**Creates:** `src/content/blog/es/getting-started-with-astro.md`

### Example 2: Sync a Modified Spanish Page to English

**Input:**
```
$SOURCE_FILE: src/pages/es/about.astro
```

**Actions:**
1. Detect: Spanish page
2. Target: `src/pages/about.astro`
3. Update English page content to match Spanish changes
4. Ensure `lang = 'en'` in target
5. Validate and report

**Updates:** `src/pages/about.astro`

### Example 3: Add Missing Translation Strings

**Input:**
```
$SOURCE_FILE: src/lib/translations/en.ts
$CONTENT_TYPE: translation-strings
```

**Actions:**
1. Detect: English translation file
2. Compare with `src/lib/translations/es.ts`
3. Find keys present in `en.ts` but missing in `es.ts`
4. Add missing translations to `es.ts`
5. Validate and report

**Updates:** `src/lib/translations/es.ts`

## Related

- [add-blog-post](../add-blog-post/SKILL.md) - Create multilingual blog posts
- [add-page](../add-page/SKILL.md) - Create multilingual pages
- [add-component](../add-component/SKILL.md) - Create components with i18n support
- `i18n-guardian` agent - Translation quality specialist
