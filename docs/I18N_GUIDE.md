# Internationalization (i18n) Guide

Guide for implementing and maintaining multilingual support in Pereira Tech Talks v3.0.0.

## Overview

Pereira Tech Talks is a fully bilingual site supporting English and Spanish. The i18n system is built on three pillars:

1. **Centralized translations** via `src/lib/translations.ts`
2. **Route-based language routing** (English at `/`, Spanish at `/es/`)
3. **Language-split content collections** for blog posts (`en/` and `es/` folders)

| Language | Code | Route Prefix | Status |
|----------|------|-------------|--------|
| English  | `en` | `/` (root)  | Default |
| Spanish  | `es` | `/es/`      | Secondary |

## Translation System

### translations.ts Structure

The central translation file at `src/lib/translations.ts` contains all UI strings for both languages. It exports:

- **`Language` type** — `'en' | 'es'`
- **`SiteTranslations` interface** — Full type definition for all translation keys
- **`getTranslations(lang)` function** — Returns the translation object for a given language
- **`isValidLanguage(lang)` function** — Type guard to validate language strings
- **`getDefaultLanguage()` function** — Returns `'en'`

The file is organized into logical sections:

```typescript
export interface SiteTranslations {
  // Site metadata: siteTitle, siteDescription
  // Navigation: nav.home, nav.blog, nav.about, ...
  // Footer: footer.copyright, footer.allRightsReserved
  // Homepage: hero, homeSections, contact
  // Content pages: aboutPage, cvPage, dailybotPage, ...
  // Blog: blogTitle, blogDescription, allPosts, postsTagged(), ...
  // Tags: tagNames, tagDescriptions
  // Dates: dateLocale
}
```

Each language has its own object (`en` and `es`) implementing this interface with complete key parity.

### Using Translations in Components

**Astro components (.astro):**

```astro
---
import { getTranslations } from '@/lib/translations';

const lang: string = 'en'; // or from props/URL
const t = getTranslations(lang);
---

<h1>{t.blogTitle}</h1>
<p>{t.blogDescription}</p>
```

**Svelte components (.svelte):**

```svelte
<script>
import { getTranslations } from '@/lib/translations';

export let lang = 'en';
$: t = getTranslations(lang);
</script>

<h1>{t.blogTitle}</h1>
```

### Adding New Translation Keys

When adding a new user-visible string:

1. **Add the type** to `SiteTranslations` interface
2. **Add the English value** to the `en` object
3. **Add the Spanish value** to the `es` object — MUST be added simultaneously
4. **Use it in components** via `getTranslations(lang)`

```typescript
// 1. In the interface
export interface SiteTranslations {
  // ...
  myNewKey: string;
}

// 2. In the English translations
const en: SiteTranslations = {
  // ...
  myNewKey: 'My new text',
};

// 3. In the Spanish translations
const es: SiteTranslations = {
  // ...
  myNewKey: 'Mi nuevo texto',
};
```

For function-based translations (with parameters):

```typescript
// Interface
postsTagged: (tag: string) => string;

// English
postsTagged: (tag) => `Posts tagged "${tag}"`,

// Spanish
postsTagged: (tag) => `Posts etiquetados con "${tag}"`,
```

## Tag Localization

### Architecture Decision

Tags use **centralized translations** (not bilingual frontmatter). This means:

- Tag **slugs** are language-neutral identifiers (`tech`, `personal`, `talks`, `trading`, `portfolio`)
- Tag **display names** come from `t.tagNames[slug]` in `translations.ts`
- Tag **descriptions** come from `t.tagDescriptions[slug]` in `translations.ts`
- Tag **URLs** always use the slug: `/blog/tag/tech/`, `/es/blog/tag/tech/`

This approach was chosen because:
- Consistent with the existing centralized translation system
- Tags are metadata, not content — they belong in the translation system
- Minimal code changes across components
- Single source of truth for all tag translations

### Tag Content Collection

Tags are defined as a content collection in `src/content/tags/*.md`:

```
src/content/tags/
├── tech.md
├── personal.md
├── talks.md
├── trading.md
└── portfolio.md
```

Each file has a simple schema:

```markdown
---
name: "tech"
description: "Tutorials, guides, and technical articles."
---
```

The `name` field is the slug identifier. The `description` field serves as a default/reference but is **not used for display** — localized descriptions come from `translations.ts`.

### Tag Display Pattern

All components display tags using this pattern:

```svelte
#{t.tagNames[tag] || tag}
```

The fallback `|| tag` ensures raw slug display if a translation is missing.

For tag page titles:

```astro
title={t.postsTagged(t.tagNames[tag] || tag)}
```

For tag descriptions (e.g., in SEO metadata):

```astro
description={t.tagDescriptions[tag] || `Articles tagged as ${t.tagNames[tag] || tag}.`}
```

### Current Tag Translations

| Slug | English Name | Spanish Name |
|------|-------------|-------------|
| `tech` | Tech | Tecnologia |
| `personal` | Personal | Personal |
| `talks` | Talks | Charlas |
| `trading` | Trading | Trading |
| `portfolio` | Portfolio | Portafolio |

### Adding a New Tag

To add a new tag (e.g., `tutorials`):

1. **Create the content file** `src/content/tags/tutorials.md`:
   ```markdown
   ---
   name: "tutorials"
   description: "Step-by-step tutorials and how-to guides."
   ---
   ```

2. **Add translations** to `src/lib/translations.ts`:
   ```typescript
   // In EN tagNames:
   tagNames: { ..., tutorials: 'Tutorials' },
   // In EN tagDescriptions:
   tagDescriptions: { ..., tutorials: 'Step-by-step tutorials and how-to guides.' },
   // In ES tagNames:
   tagNames: { ..., tutorials: 'Tutoriales' },
   // In ES tagDescriptions:
   tagDescriptions: { ..., tutorials: 'Tutoriales paso a paso y guias practicas.' },
   ```

3. **Use in blog posts** by adding to the `tags` array in frontmatter:
   ```markdown
   ---
   tags: ["tutorials", "tech"]
   ---
   ```

No component changes are needed — the tag will automatically appear with its localized name wherever tags are displayed.

## Bilingual Content

### Blog Posts

Blog posts are organized in language-specific folders:

```
src/content/blog/
├── en/
│   ├── first-post.md
│   ├── second-post.md
│   └── ...
└── es/
    ├── first-post.md
    ├── second-post.md
    └── ...
```

Language filtering works by post ID prefix in `src/lib/blog.ts`:

```typescript
// English posts
const posts = allPosts.filter((post) => post.id.startsWith('en/'));

// Spanish posts
const posts = allPosts.filter((post) => post.id.startsWith('es/'));
```

**Frontmatter requirements:**

- `title` and `description` must be translated
- `pubDate`, `updatedDate`, `heroImage`, `tags`, and `author` must be identical between language pairs
- Post filenames must match between `en/` and `es/` folders

**Spanish content voice:**

- Use **tuteo** (tú/tienes/puedes), NOT **voseo** (vos/tenés/podés) — the register is informal-professional with Colombian Spanish phrasing
- Proper diacritical marks are mandatory (see [Standards](STANDARDS.md))

### Authors

Authors are defined in `src/content/authors/{slug}.yaml`. The localization happens **inside the YAML** (not at the post level): each author has `role.en` / `role.es` and `bio.en` / `bio.es`. Blog posts reference an author by slug, so the same `author:` value applies to both EN and ES versions of a post.

**Translation requirements:**

- Both `role.en` and `role.es` are mandatory by the schema — a missing language fails the Zod validation at build time
- Both `bio.en` and `bio.es` are mandatory by the schema
- Spanish role / bio must use proper diacritics (`Cofundador`, `años`, `diseño`, etc.) and tuteo register
- The `name` field is the same in all languages (proper names don't translate)
- Social URLs are language-agnostic

See [features/AUTHORS.md](./features/AUTHORS.md) for the full schema and validation checklist.

### Pages

Pages follow a route-based approach:

```
src/pages/
├── index.astro          # English (lang="en")
├── about.astro          # English
├── contact.astro        # English
├── blog/                # English blog routes
│   ├── index.astro
│   ├── [...slug].astro
│   ├── page/[page].astro
│   └── tag/
│       ├── [tag].astro
│       └── [tag]/page/[page].astro
└── es/
    ├── index.astro      # Spanish (lang="es")
    ├── about.astro      # Spanish
    ├── contact.astro    # Spanish
    └── blog/            # Spanish blog routes (mirrors EN structure)
        ├── index.astro
        ├── [...slug].astro
        ├── page/[page].astro
        └── tag/
            ├── [tag].astro
            └── [tag]/page/[page].astro
```

Every English page must have a Spanish equivalent under `es/`, and vice versa.

### Page Wrapper Pattern

All content pages use the **Page wrapper pattern**. Pages in `src/pages/` are ultra-minimal 3-line routing wrappers. The real logic (`MainLayout`, translations, SEO metadata, content) lives inside `*Page.astro` components in `src/components/pages/`.

**Shared page component** (`src/components/pages/AboutPage.astro`):

```astro
---
import MainLayout from '@/layouts/MainLayout.astro';
import { getTranslations } from '@/lib/translations';
import { getUrlPrefix } from '@/lib/i18n';
import type { Language } from '@/lib/i18n';

interface Props { lang: Language; }
const { lang } = Astro.props;
const t = getTranslations(lang);
const prefix = getUrlPrefix(lang);
---

<MainLayout lang={lang} title={t.aboutPage.title} description={t.aboutPage.description}>
  <section>
    <h1>{t.aboutPage.title}</h1>
    <!-- Content using t.* for text and prefix for URLs -->
  </section>
</MainLayout>
```

**Thin page wrapper** (`src/pages/about.astro`):

```astro
---
import AboutPage from '@/components/pages/AboutPage.astro';
---
<AboutPage lang="en" />
```

**Key rules:**
- Page components handle `MainLayout` internally — wrappers never import `MainLayout`
- The `lang` prop is passed as a **string literal** (`"en"`, `"es"`), not a variable
- For a new page: create 1 `*Page.astro` component + N thin wrappers (one per language)

### Component i18n Pattern

Components receive the `lang` prop and use `getTranslations()`:

```svelte
<script>
import { getTranslations } from '@/lib/translations';

export let lang = 'en';
$: t = getTranslations(lang);
</script>

<p>{t.someKey}</p>
```

The `lang` prop flows through the component hierarchy:

```
Page wrapper (src/pages/about.astro)
  → *Page.astro component (lang="en"|"es")
    → MainLayout (lang)
      → Header (lang)
      → Footer (lang)
    → Child components (lang)
      → uses getTranslations(lang)
```

**Rules:**
- Never hardcode user-visible text in component templates
- Always use `getTranslations(lang)` for translatable strings
- Always pass `lang` to child components that display text
- Never import `MainLayout` in page wrappers — it belongs inside `*Page.astro` components

## Date Formatting

Dates use locale-specific formatting via the `dateLocale` translation key:

```typescript
// translations.ts
en: { dateLocale: 'en-US' },
es: { dateLocale: 'es-ES' },
```

The `FormattedDate.astro` component handles locale-aware formatting:

```astro
---
interface Props {
  date: Date;
  lang?: string;
}

const { date, lang = 'en' } = Astro.props;
const locale = lang === 'es' ? 'es-ES' : 'en-US';
---

<time datetime={date.toISOString()}>
  {date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })}
</time>
```

## Language Switcher

The header includes a language switcher that toggles between English and Spanish. It maps current route paths between language versions:

- `/about/` ↔ `/es/about/`
- `/blog/` ↔ `/es/blog/`
- `/blog/tag/tech/` ↔ `/es/blog/tag/tech/`

## Bilingual Compliance Checklist

Before committing any content change, verify:

- [ ] All new/modified pages exist in both `src/pages/` and `src/pages/es/`
- [ ] All new/modified blog posts exist in both `src/content/blog/en/` and `src/content/blog/es/`
- [ ] When introducing or updating an author, both `role.en`/`role.es` and `bio.en`/`bio.es` are populated in `src/content/authors/{slug}.yaml`
- [ ] Same `author` slug used in EN and ES versions of a post
- [ ] All new UI strings in `translations.ts` have both English and Spanish values
- [ ] No hardcoded user-visible text in components (use `getTranslations()`)
- [ ] Tag names use `t.tagNames[slug] || slug` pattern for display
- [ ] Date formatting uses locale-aware formatting with `lang` prop
- [ ] Page titles and SEO descriptions use translation keys
- [ ] The `lang` prop is passed through the full component hierarchy
- [ ] Page Markdown files exist in both `src/content/pages/en/` and `src/content/pages/es/`
- [ ] When page content or translations change, corresponding `.md` files updated (both languages)

## Known Limitations

1. **Homepage sections** — Education, Experience, Projects, and Skills sections have content that needs dedicated bilingual translation work (large structured content blocks)
2. **Portfolio translations** — `portfolioPage` translations are referenced in code but not yet defined in `translations.ts` (pre-existing from portfolio feature branch)
3. **Minor aria-labels** — Some accessibility attributes (ThemeToggle, BlogPagination) have hardcoded English text

## Resources

- [Astro i18n Recipes](https://docs.astro.build/en/recipes/i18n/)
- [W3C Internationalization](https://www.w3.org/International/)
- [Google Hreflang Guide](https://developers.google.com/search/docs/specialty/international/localized-versions)
