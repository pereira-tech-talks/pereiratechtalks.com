# Authors

Multi-author support for blog posts. Authors are defined in a dedicated content collection so a single post can attribute authorship to any registered contributor without hardcoding bios anywhere in the codebase.

## Overview

Each author is a YAML file in `src/content/authors/`. Blog posts reference an author by `slug`. At build time, `BlogPostFooter.astro` resolves the slug against the `authors` collection and renders an `AuthorCard` with the author's localized role and bio. The resolved author also drives the JSON-LD `author` field on blog posts.

The site currently has a single author (Sergio Alexander Florez Galeano, slug `sergio-florez`), but the system is designed to scale to multiple contributors. The default author for any post without an explicit `author:` field is `sergio-florez`.

## Directory Structure

```
src/content/authors/
└── sergio-florez.yaml          # One YAML file per author

public/images/authors/
└── sergio-florez.webp          # Avatar matching the YAML slug (80x80+ recommended)

src/components/blog/
├── AuthorCard.astro            # Renders avatar + name + role + bio + social
└── BlogPostFooter.astro        # Resolves author from collection + renders AuthorCard + ShareButtons

src/pages/internal/
└── authors.astro               # Internal directory listing all authors (dev only)
```

## YAML Schema

Defined in `src/content.config.ts`:

```typescript
const authors = defineCollection({
  loader: glob({ base: './src/content/authors', pattern: '**/*.yaml' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    avatar: z.string(),
    role: z.object({
      en: z.string(),
      es: z.string(),
    }),
    bio: z.object({
      en: z.string(),
      es: z.string(),
    }),
    social: z
      .object({
        x: z.string().optional(),
        linkedin: z.string().optional(),
        github: z.string().optional(),
        instagram: z.string().optional(),
        website: z.string().optional(),
      })
      .optional(),
  }),
});
```

### Field Details

| Field | Required | Description |
|-------|----------|-------------|
| `name` | Yes | Full display name. Rendered as the card heading. Same string in all languages (proper names don't translate). |
| `slug` | Yes | URL-safe identifier. **Must match the YAML filename** (without extension) and be referenced by blog posts via `author: 'slug'`. |
| `avatar` | Yes | Absolute path from `public/`. Convention: `/images/authors/{slug}.webp`. WebP only. |
| `role.en` | Yes | English job title / role. Rendered under the name. |
| `role.es` | Yes | Spanish job title / role. Must use proper diacritics (e.g., "Cofundador"). |
| `bio.en` | Yes | English short bio. 1-2 sentences. Rendered below the role. |
| `bio.es` | Yes | Spanish short bio. Use tuteo (no voseo). Proper diacritics required. |
| `social.x` | No | Full URL to X / Twitter profile. |
| `social.linkedin` | No | Full URL to LinkedIn profile. |
| `social.github` | No | Full URL to GitHub profile. |
| `social.instagram` | No | Full URL to Instagram profile. |
| `social.website` | No | Full URL to personal website. |

Only social links present in the YAML are rendered. The render order in `AuthorCard.astro` is: website → linkedin → x → github → instagram.

### Example

`src/content/authors/sergio-florez.yaml`:

```yaml
name: Sergio Alexander Florez Galeano
slug: sergio-florez
avatar: /images/authors/sergio-florez.webp
role:
  en: Community lead at Pereira Tech Talks
  es: L\u00EDder comunitario en Pereira Tech Talks
bio:
  en: Co-founder of Pereira Tech Talks. I write about building products, AI agents, and the craft of software engineering.
  es: Cofundador de Pereira Tech Talks. Escribo sobre construcci\u00F3n de productos, agentes de IA y el oficio de la ingenier\u00EDa de software.
social:
  x: https://x.com/pertechtalks
  linkedin: https://www.linkedin.com/company/pereira-tech-talks/
  github: https://github.com/pereira-tech-talks
  instagram: https://www.instagram.com/pertechtalks
  website: https://pereiratechtalks.org/
```

## Blog Post Integration

### Frontmatter Field

The blog schema (`src/content.config.ts`) declares:

```typescript
author: z.string().default('sergio-florez'),
```

Usage in a post:

```markdown
---
title: 'My post'
description: '...'
pubDate: '2026-05-10'
author: 'sergio-florez'   # Optional — defaults to 'sergio-florez'
---
```

The `author` value must match an existing author slug. Astro's content schema validation runs at build time, but the slug lookup is performed inline in `BlogPostFooter.astro` and `BlogPostPage.astro`. If the slug doesn't resolve, the author card is silently omitted (no error) and the JSON-LD falls back to a hardcoded author.

### Translation Rules

- The `author` field **must be identical** in both `en/` and `es/` versions of a post — authorship doesn't translate.
- The `role` and `bio` localization happens at the author level (in the YAML), not at the post level.
- When adding a new author, **both `role.en` and `role.es`** (and both `bio.en` and `bio.es`) are required by the schema.

### JSON-LD Impact

`BlogPostPage.astro` resolves the author and uses the data in the `BlogPosting` schema:

```jsonc
{
  "@type": "BlogPosting",
  "author": {
    "@type": "Person",
    "name": "Sergio Alexander Florez Galeano",
    "url": "https://pereiratechtalks.org/about/",
    "image": "https://pereiratechtalks.org/images/authors/sergio-florez.webp"
  }
}
```

When the slug doesn't resolve, `name` falls back to `'Sergio Alexander Florez Galeano'` and `image` to `/images/og-default.jpg`.

## Components

### `AuthorCard.astro`

Pure presentational component. Receives `author` (resolved YAML data) and `lang`. Renders:

- 80x80 round avatar with WebP `loading="lazy"`
- Author name (h3)
- Localized role
- Localized bio
- Social icons (only the links present in `social`)
- A `<slot />` for extra content (used by `/internal/authors` to show the slug + avatar path)

Marked `data-lightbox-ignore` so the avatar doesn't open the blog image lightbox.

### `BlogPostFooter.astro`

Resolves the author from the collection by slug and renders `<AuthorCard>` + `<ShareButtons>` inside a `<section>` with `aria-label={t.blogEngagement.aboutAuthor}`. The footer is rendered once per blog post by `BlogPostPage.astro`.

```astro
<BlogPostFooter
  authorSlug={authorSlug}
  lang={lang}
  title={title}
  url={canonicalURL.href}
/>
```

The `NewsletterForm` is rendered separately by `BlogPostPage.astro` — it is **not** part of `BlogPostFooter` to keep that component focused on author + sharing.

## How to Add a New Author

1. **Create the YAML file** at `src/content/authors/{slug}.yaml`. Use kebab-case for the slug; it must match the filename (without `.yaml`).
2. **Add the avatar** at `public/images/authors/{slug}.webp`. Recommended: 160x160 px (rendered at 80x80 + 2x retina). Use `pnpm run images:optimize` to convert from staged sources.
3. **Fill out all required fields:** `name`, `slug`, `avatar`, `role.en`, `role.es`, `bio.en`, `bio.es`. Spanish must use proper diacritics and tuteo register.
4. **(Optional) Add social links** — only include the platforms the author actually uses; omit the rest.
5. **Reference in blog posts** by setting `author: '{slug}'` in the post frontmatter (both EN and ES versions must use the same slug).
6. **Verify in the internal directory:** Run `pnpm run dev` and open `/internal/authors` to confirm the new card renders correctly in both languages.

## Translation Strings

Author-related UI strings live under `blogEngagement` in `src/lib/translations/{en,es}.ts`:

| Key | EN | ES |
|-----|------|------|
| `blogEngagement.aboutAuthor` | About the author | Sobre el autor |
| `blogEngagement.writtenBy` | Written by | Escrito por |

`aboutAuthor` is used as the `aria-label` of the footer section. `writtenBy` is currently reserved for future inline byline use.

## Validation Checklist

Before merging a new author or modifying an existing one:

- [ ] YAML filename matches the `slug` field exactly
- [ ] Avatar file exists at the path declared in `avatar`
- [ ] Both `role.en` and `role.es` are present and non-empty
- [ ] Both `bio.en` and `bio.es` are present, non-empty, and use natural prose (no machine-translated artifacts)
- [ ] Spanish role and bio use proper diacritics (`Cofundador`, `años`, `diseño`, etc.) and tuteo (no voseo)
- [ ] Social URLs are full URLs (with `https://`)
- [ ] `pnpm run astro:check` passes (validates the Zod schema)
- [ ] `pnpm run build` succeeds and the post listing renders the new author card
- [ ] `/internal/authors` lists the new author with the correct preview in both languages

## Key Files

| File | Purpose |
|------|---------|
| `src/content.config.ts` | Defines the `authors` collection schema + the `author` field on `blog` |
| `src/content/authors/*.yaml` | Author definitions (one file per author) |
| `public/images/authors/*.webp` | Author avatars |
| `src/components/blog/AuthorCard.astro` | Presentational card |
| `src/components/blog/BlogPostFooter.astro` | Footer that resolves and renders the author |
| `src/components/pages/blog/BlogPostPage.astro` | Resolves `authorData` for JSON-LD |
| `src/pages/internal/authors.astro` | Internal directory of all authors |
| `src/lib/translations/{en,es}.ts` | `blogEngagement.aboutAuthor` / `writtenBy` strings |

## Related Docs

- [Blog Posts](./BLOG_POSTS.md) — Frontmatter schema and post conventions
- [I18N Guide](../I18N_GUIDE.md) — Multilingual content rules
- [Architecture](../ARCHITECTURE.md) — Content Collections overview
- [SEO](../SEO.md) — JSON-LD structured data
