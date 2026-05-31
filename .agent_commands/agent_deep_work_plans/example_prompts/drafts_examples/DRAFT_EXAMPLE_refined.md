# DRAFT: Add Reading Time to Blog Posts (Refined)

**Status:** Refined draft (ready for plan creation)

---

Create a deep work plan following `.agent_commands/agent_deep_work_plans/GUIDE_TO_CREATE_AGENT_DEEP_WORK_PLANS.md`

## Objective

Add an estimated reading time indicator to all blog posts, displayed both on individual post pages and on blog listing cards. The feature should calculate reading time based on word count (average ~200 words per minute), work in both English and Spanish with proper translations, and support dark mode styling. This improves the reader experience by helping visitors decide which posts to read based on time commitment.

## Context

**Location:**

- Blog utility functions: `src/lib/blog.ts`
- Blog post page (EN): `src/pages/blog/[...slug].astro`
- Blog post page (ES): `src/pages/es/blog/[...slug].astro`
- Blog card component: `src/components/blog/BlogCard.svelte`
- Content schema: `src/content.config.ts`
- Translations: `src/lib/translations.ts`
- Components directory: `src/components/blog/`

**Current State:**

- Blog posts display title, date, hero image, tags, and description
- No reading time is shown anywhere (neither on post pages nor listing cards)
- The `BlogCard.svelte` component shows post preview with title, date, and description
- Content Collections use Markdown/MDX with a Zod schema for frontmatter
- The site is fully bilingual (English/Spanish) with translation support via `getTranslations()`

**Technical Stack:**

- Astro 5.16.15 with Content Collections
- Svelte 5.48.0 for interactive components
- TypeScript 5.9.3
- Tailwind CSS 4.1.18 with dark mode support
- Biome 2.3.11 for linting/formatting
- MDX for enhanced blog posts

**Constraints:**

- Must work in both English and Spanish (bilingual synchronization is mandatory)
- Must support dark mode via Tailwind's `dark:` variant
- Must follow existing component patterns (Astro for static, Svelte for interactive)
- Must use `getTranslations()` for all user-visible text
- All code and comments in English
- Must pass `pnpm run biome:check` and `pnpm run astro:check`
- Must use `@` path alias for imports

**Related Documentation:**

- Architecture patterns: `docs/ARCHITECTURE.md`
- Coding standards: `docs/STANDARDS.md`
- Product specification: `docs/PRODUCT_SPEC.md`

## Tasks

1. **Create Reading Time Utility Function**
   - Add `calculateReadingTime(content: string): number` function to `src/lib/blog.ts`
   - Use average reading speed of ~200 words per minute
   - Handle both Markdown and MDX content (strip markup before counting)
   - Return time in minutes (minimum 1 minute)
   - Add proper TypeScript types

2. **Create ReadingTime Component**
   - Create `src/components/blog/ReadingTime.astro` component
   - Accept `minutes: number` and `lang: Language` props
   - Display reading time with a clock icon (e.g., "5 min read" / "5 min de lectura")
   - Style with Tailwind CSS, support dark mode
   - Use `getTranslations()` for bilingual text

3. **Add Translation Strings**
   - Add reading time translation keys to `src/lib/translations.ts`
   - English: "min read", Spanish: "min de lectura"
   - Both languages must be added simultaneously (mandatory)

4. **Integrate into Blog Post Pages**
   - Add `ReadingTime` component to `src/pages/blog/[...slug].astro` (English)
   - Add `ReadingTime` component to `src/pages/es/blog/[...slug].astro` (Spanish)
   - Position below the post date, above the content
   - Calculate reading time from the post's raw content body
   - Ensure consistent layout in both language versions

5. **Add Reading Time to Blog Cards**
   - Pass reading time data to `BlogCard.svelte` component
   - Display reading time as a subtle badge on each card
   - Update all pages that render BlogCard to include the reading time prop
   - Ensure it works on blog listing, tag filtering, and pagination pages

6. **Update Documentation**
   - Document the new ReadingTime component in component docs
   - Update `docs/ARCHITECTURE.md` if new patterns were introduced
   - Add reading time to component inventory

## Plan Name

`PLAN_add_blog_reading_time`

## Global Guidelines

- **Branch:** Work on `dev` branch
- **Commits:** Use conventional commit format: `feat(blog): description`
- **Validation:** Run `pnpm run biome:check` and `pnpm run astro:check` after each task
- **Standards:** Follow `docs/STANDARDS.md` and `AGENTS.md`
- **Bilingual:** All content changes must exist in both English and Spanish
- **Dark mode:** All new UI elements must support dark mode
- **Testing:** Manual testing via `pnpm run dev` (no automated tests configured yet)
- **Skill usage:** Use `/add-component` skill for component creation, `/translate-sync` for bilingual content

---

**This refined draft is ready for plan creation. Use:**

```
/dwp-create from-draft DRAFT_EXAMPLE_refined.md
```

Or copy the content above and create the plan with `/dwp-create`.
