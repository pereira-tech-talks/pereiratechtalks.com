---
title: 'How I Built a Multilingual Website with Astro'
description: 'Designing multilingual Astro from scratch: typed translations, the Page Wrapper pattern, and scaling to more languages without rewiring components.'
pubDate: '2026-03-03'
heroImage: '/images/blog/posts/building-multilingual-website/hero.webp'
heroLayout: 'side-by-side'
tags: ['tech', 'web-development']
keywords: ["multilingual website Astro i18n", "Astro bilingual architecture English Spanish", "TypeScript translation system website", "page wrapper pattern Astro", "i18n static site Astro", "hreflang multilingual Astro", "960 translation keys typed system"]
series: "building-xergioalex"
seriesOrder: 6
---

One thread has been woven through every chapter of this series, mentioned often but never given its own story: this site speaks two languages.

Every page, every blog post, every button label, every navigation link — all of it exists in both English and Spanish. Not as an afterthought bolted on at the end, but as a first-class architectural decision that shaped the entire codebase from day one.

This is that story.

---

## Why Two Languages

Most personal websites are monolingual. And honestly, that makes sense — building a personal site is already a significant investment of time. Why double the work?

For me, the answer was immediate and personal. English is the language of the global tech community. It is the language of documentation, open source, conference talks, and the audience that cares about the same things I care about: building products, scaling teams, and shipping code. If I was going to write about these topics, English was non-negotiable.

But Spanish is the language I grew up with. It is the language of my family, my friends, and the Latin American tech community that has been a part of my career since the beginning — from organizing Pereira Tech Talks to building DailyBot with a team spread across Colombia and beyond. When I think about who I am building for, the answer is not just the English-speaking world. It is also the people I have shared stages with, the developers who attended my talks in Spanish, and the friends who would read my blog if it spoke their language.

So the question was never _whether_ to support both languages. It was _how_ — and how to do it without making the codebase a nightmare to maintain.

---

## Language as Configuration

The foundation of the entire multilingual system is a single TypeScript file: `src/lib/i18n.ts`. It is 160 lines long, and it contains every piece of language configuration the site needs.

I went with a TypeScript union type instead of an enum:

```typescript
// src/lib/i18n.ts
export type Language = 'en' | 'es';
```

Why a union? Because it is lighter, more composable, and extending it is a one-character change. Adding Portuguese in the future is literally:

```typescript
export type Language = 'en' | 'es' | 'pt';
```

TypeScript enforces this at compile time across the entire codebase. Every function that accepts a `Language` parameter will immediately require handling the new value. The compiler becomes the migration checklist.

All the language metadata lives in a single registry:

```typescript
export interface LanguageConfig {
  code: Language;
  name: string;           // English name
  nativeName: string;     // Native name (for language selector)
  dateLocale: string;     // BCP 47 locale for date formatting
  ogLocale: string;       // OpenGraph locale for social sharing
  flag: string;           // Flag emoji for UI
  urlPrefix: string;      // URL path prefix
}

export const LANGUAGES: Record<Language, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dateLocale: 'en-US',
    ogLocale: 'en_US',
    flag: '🇬🇧',
    urlPrefix: '',
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    dateLocale: 'es-ES',
    ogLocale: 'es_ES',
    flag: '🇪🇸',
    urlPrefix: '/es',
  },
};
```

Eight fields per language. Date formatting, Open Graph tags, URL routing, the language selector — it all comes from this one object. I did not want constants scattered across files or magic strings hiding in templates.

The URL prefix strategy is worth calling out explicitly. The default language (`en`) gets an empty prefix, which means English URLs are clean: `/about`, `/blog/my-post`, `/contact`. Spanish gets `/es` as a prefix: `/es/about`, `/es/blog/my-post`, `/es/contact`. This is a common pattern for multilingual sites, and Astro's file-based routing makes it natural.

The same file also exports a handful of utility functions that the rest of the codebase uses everywhere:

```typescript
getUrlPrefix(lang)      // '' or '/es'
getLocalizedUrl(path, lang)   // Combines prefix + path
getAlternateUrls(currentPath) // All language variants of a URL
getLangFromUrl(pathname)       // Detect language from URL
stripLangPrefix(path)          // Remove prefix to get base path
getDateLocale(lang)            // 'en-US' or 'es-ES'
getOGLocale(lang)              // 'en_US' or 'es_ES'
```

Every component uses these functions instead of building URLs or detecting languages manually. If the URL strategy changes, or if a new language is added, only this file changes. Everything downstream adapts automatically.

---

## The Page Wrapper Pattern

Here is the problem with multilingual sites using file-based routing: if you have 12 pages and 2 languages, you need 24 files. With 3 languages, 36 files. Each file contains the full page logic — layout, translations, data fetching, template markup. Change how the About page works, and you update it in 2 places. Or 3. Or 5. This scales poorly and breaks easily.

The solution I built is what I call the **Page Wrapper pattern**. The idea is simple: separate routing from logic.

Routing wrappers live in `src/pages/` and are ultra-thin — three lines of code:

```astro
---
// src/pages/about.astro (English)
import AboutPage from '@/components/pages/AboutPage.astro';
---
<AboutPage lang="en" />
```

```astro
---
// src/pages/es/about.astro (Spanish)
import AboutPage from '@/components/pages/AboutPage.astro';
---
<AboutPage lang="es" />
```

That is it. The wrapper's only job is to exist at the right URL path and pass the `lang` string literal to the shared component.

The actual page logic lives in `src/components/pages/AboutPage.astro`, and it handles everything:

```astro
---
// src/components/pages/AboutPage.astro
import MainLayout from '@/layouts/MainLayout.astro';
import type { Language } from '@/lib/i18n';
import { getUrlPrefix } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';

interface Props {
  lang: Language;
}

const { lang } = Astro.props;
const t = getTranslations(lang);
const prefix = getUrlPrefix(lang);
---

<MainLayout lang={lang} title={t.aboutPage.title} description={t.aboutPage.description}>
  <h1>{t.aboutPage.title}</h1>
  <p>{t.aboutPage.bioText}</p>
  <a href={`${prefix}/cv`}>{t.aboutPage.ctaCv}</a>
</MainLayout>
```

The shared component imports the layout, gets the translations for the current language, builds localized URLs, and renders the full page. One file, all logic. The wrappers are just routing stubs.

I have 17 shared page components and 23 routing wrappers. Add Portuguese? 11 new three-line files, zero component changes. A bug fix happens in one file. A new feature shows up in all languages automatically.

---

## The Translation System

Behind `getTranslations(lang)` is a structured, typed translation system that covers every piece of user-visible text on the site.

The architecture is four files:

```
src/lib/translations/
├── types.ts     # SiteTranslations interface (480 lines)
├── en.ts        # English translations (956 lines)
├── es.ts        # Spanish translations (967 lines)
└── index.ts     # Barrel: getTranslations() function (52 lines)
```

`types.ts` defines the shape — a 480-line interface covering every piece of user-visible text:

```typescript
// src/lib/translations/types.ts (simplified)
export interface SiteTranslations {
  siteTitle: string;
  siteTitleFull: string;
  siteDescription: string;

  nav: {
    home: string;
    blog: string;
    about: string;
    contact: string;
    // ... 12 navigation keys
  };

  aboutPage: {
    title: string;
    subtitle: string;
    bioTitle: string;
    bioText: string;
    passions: PagePassion[];
    // ... 12 keys for the About page
  };

  // Dynamic strings — functions that accept parameters
  readingTime: (minutes: number) => string;
  seriesChapter: (n: number) => string;
  resultsFound: (count: number) => string;
  pageOf: (current: number, total: number) => string;

  // ... hundreds more keys covering every page and component
}
```

Each locale file (`en.ts`, `es.ts`) implements this interface. The TypeScript compiler enforces **complete parity**. If I add a new key to `types.ts` and only implement it in `en.ts`, the build fails with a clear error telling me that `es.ts` is missing the key. No key falls through the cracks. No page renders with a missing translation.

Here's the trick: **functions instead of template strings** for dynamic content:

```typescript
// en.ts
readingTime: (minutes: number) => `${minutes} min read`,
resultsFound: (count: number) => `${count} results found`,
seriesChapterOf: (current: number, total: number) =>
  `Chapter ${current} of ${total}`,

// es.ts
readingTime: (minutes: number) => `${minutes} min de lectura`,
resultsFound: (count: number) => `${count} resultados encontrados`,
seriesChapterOf: (current: number, total: number) =>
  `Capítulo ${current} de ${total}`,
```

These are not template strings with placeholders that need a separate formatting step. They are regular TypeScript functions. The compiler type-checks the parameters. Autocomplete works. No runtime formatting library needed. The translation _is_ the formatter.

The barrel file is minimal:

```typescript
// src/lib/translations/index.ts
const translations: Record<Language, SiteTranslations> = { en, es };

export function getTranslations(lang: Language): SiteTranslations {
  return translations[lang] || translations.en;
}
```

One function. Full typed access. English fallback if something unexpected happens. In practice, the entire site uses it the same way:

```typescript
const t = getTranslations(lang);
// Then: t.nav.blog, t.aboutPage.title, t.readingTime(5)
```

The system currently holds approximately 960 translation keys organized into structured sections: site metadata, navigation, footer, hero, 11 homepage sections, 10 page-specific sections (About, CV, DailyBot, Entrepreneur, Tech Talks, Portfolio, Trading, Foodie, Hobbies, Contact), search, blog, series navigation, tags, and utility strings.

---

## Blog Content in Two Languages

The blog uses Astro Content Collections with a simple but effective language strategy: **directory-based language separation**.

```
src/content/blog/
├── en/
│   ├── 2026-01-22_building-xergioalex-website.md
│   ├── 2026-02-26_lighthouse-perfect-scores.mdx
│   ├── 2026-02-28_measuring-what-matters-free-analytics.md
│   ├── 2026-03-01_building-blog-without-backend.md
│   └── ... (57 posts total)
└── es/
    ├── 2026-01-22_building-xergioalex-website.md
    ├── 2026-02-26_lighthouse-perfect-scores.mdx
    ├── 2026-02-28_measuring-what-matters-free-analytics.md
    ├── 2026-03-01_building-blog-without-backend.md
    └── ... (57 posts, 1:1 parity with English)
```

The Content Collection loader scans all files in both directories and generates IDs that naturally encode the language:

```
en/2026-03-01_building-blog-without-backend
es/2026-03-01_building-blog-without-backend
```

Extracting the language from a post is a single function:

```typescript
// src/lib/blog.ts
export function getPostLanguage(postId: string): string {
  const parts = postId.split('/');
  return parts.length > 1 ? parts[0] : 'en';
}
```

No database lookup. No runtime detection. No URL parsing. The language is encoded in the file path, and the function just reads it.

The slug extraction strips the language prefix and the date prefix, so both the English and Spanish versions share the same clean URL slug:

```
EN: /blog/building-blog-without-backend/
ES: /es/blog/building-blog-without-backend/
```

There is a mandatory rule: **every post in `en/` must have a corresponding post in `es/`** with the same filename, same date prefix, and the same slug. The `title`, `description`, and body content are translated. The `pubDate`, `heroImage`, `tags`, and code blocks are preserved identically.

Tags are language-agnostic. Both English and Spanish posts reference the same tag identifiers (`tech`, `web-development`, `portfolio`). The display names are localized through the translation system — `t.tagNames['tech']` returns "Tech" in English and the appropriate translation in Spanish. The tag collection (`src/content/tags/`) is a single set of files shared across all languages.

This design means adding a post is always a two-file operation: write the English version, translate it to Spanish. The structure guarantees parity. The build validates the schema. The tags work everywhere without duplication.

---

## The SEO Layer

Google needs to know these are two different pages. The SEO layer handles that automatically.

Every page on the site generates hreflang tags through `BaseHead.astro`:

```astro
{alternateUrls.map((alt) => (
  <link rel="alternate" hreflang={alt.lang} href={alt.href} />
))}
<link rel="alternate" hreflang="x-default" href={defaultHref} />
```

These tags tell Google and other search engines: "This page exists in English at this URL, and in Spanish at that URL." The `x-default` tag points to the English version as the fallback for unmatched languages.

The data comes from `getAlternateUrls()`, which strips the language prefix from the current URL and rebuilds it for each supported language:

```typescript
export function getAlternateUrls(currentPath: string): { lang: Language; url: string }[] {
  const basePath = stripLangPrefix(currentPath);
  return getSupportedLanguages().map((lang) => ({
    lang,
    url: getLocalizedUrl(basePath, lang),
  }));
}
```

Open Graph tags are also language-aware. Each page sets `og:locale` to the current language's locale and adds `og:locale:alternate` for every other language. The search system uses language-sharded static endpoints — `/api/posts-en.json` and `/api/posts-es.json` — so the client-side search only loads the relevant language's index. No wasted bandwidth on posts the reader cannot read.

All of this is automatic. Adding a third language does not require touching the SEO layer at all. The functions iterate over `getSupportedLanguages()`, which reads from the same `LANGUAGES` registry. Add a language there, and the hreflang tags, Open Graph locales, and search endpoints adapt.

---

## Why Only English and Spanish

I want to be explicit about this, because the architecture I just described could support five languages, or ten, or twenty. But I chose two. And I chose them for reasons that go beyond technical capability.

English and Spanish are the languages I speak, think, and write in. They are not just languages I can translate into — they are languages I can _hear_. When I read a paragraph in English, I know if it sounds natural or if it reads like it was translated by a machine. When I read a paragraph in Spanish, I notice a missing accent mark, an awkward phrase, a cultural reference that does not quite land.

This matters to me more than coverage.

I know the temptation. Today's AI can translate text into dozens of languages with impressive quality. I could add Portuguese, French, German, Japanese, and have a globally accessible site by next week. The architecture would support it — the code literally does not care. A new language is a config entry, a translation file, and some wrapper files. No component changes.

But publishing in a language I cannot verify feels like giving up control over my own voice. A personal site is _personal_. Every word on it represents me. If someone reads the Portuguese version and finds an awkward phrase, a cultural mismatch, or a sentence that just does not sound right — that is my name on it, and I have no way to catch it.

English is the language of my professional world. Spanish is the language of my roots. These are the audiences I know, the communities I have built in, and the people I am writing for. Two languages, fully audited, fully mine.

The code doesn't care. It's ready either way. But right now, quality matters more than quantity.

---

## Adding a New Language: The Scalability Story

Despite choosing two languages, here's what adding Portuguese would actually take: update the type union (`'en' | 'es' | 'pt'`), add a `LANGUAGES` entry, create a translation file (~960 keys), add 11 three-line page wrappers, create a blog content directory, and add a search endpoint. Six steps, zero component changes. Everything adapts because the language boundary lives in the data layer, not the code.

That's what makes this architecture worth the upfront work — every feature I add just works in all languages.

---

## Everything Happens at Build Time

One pattern you might have noticed throughout this chapter: there is no runtime language detection. No cookies storing language preferences. No JavaScript switching the page content based on the browser's `Accept-Language` header.

Every language variant is a separate, pre-rendered HTML file. The English About page is one file. The Spanish About page is another file. They share the same component source, but they produce independent static HTML at build time.

This has three consequences:

1. **Zero JavaScript cost for language.** There is no runtime library loading translations, no hydration penalty, no client-side route resolution. The page loads as static HTML in the correct language.

2. **Perfect SEO.** Each language variant has its own URL, its own canonical tag, and its own hreflang tags. Google sees two distinct, well-structured pages linked by language metadata.

3. **Instant page loads.** There is no flash of the wrong language. No redirect from `/about` to `/es/about` based on detection. If you visit `/es/about`, you get the Spanish page. Immediately. Because it was built that way.

Astro made this natural. Its file-based routing produces one HTML file per route. Its Content Collections validate everything at build time. Its islands architecture means Svelte components only hydrate when they need interactivity — the language logic stays entirely on the server side (which, for a static site, means "at build time").

---

## Reflecting on This Chapter

Looking back at this series, each chapter has been about the same thing: spending time now so things are simpler later. The Astro architecture, the Lighthouse work, the analytics setup, the blog system — they were all upfront investments that kept paying off as the site grew.

This chapter was no different. Building multilingual support into a personal site from day one sounds like overkill, and honestly, some days it felt like it. Every component had to be language-aware from the start. Every string had to go through the translation system. Every URL needed a prefix strategy. Every blog post needed its twin in another language. It was a lot of extra work, especially early on when I just wanted to ship pages.

But today the site has 57 blog posts in two languages, 12 types of pages, and over 960 translation keys — and none of the components know or care how many languages exist. They take a `lang` parameter and do their thing. That trade-off was worth it.

I chose English and Spanish because those are my people — the communities I have built in, the audiences I actually know. The architecture could handle more whenever I am ready, but that is a decision about who I am writing for, not about what the code can do.

Let's keep building.

---

## Resources

- **[Astro i18n Recipes](https://docs.astro.build/en/recipes/i18n/)** — Official Astro documentation for internationalization patterns.
- **[xergioalex.com source code](https://github.com/xergioalex/xergioalex.com)** — The full repository where all of the code described in this series lives.
