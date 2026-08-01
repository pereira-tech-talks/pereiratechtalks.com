# AI Diff Reviewer — repo extension for `pereiratechtalks.org` v3

> Layered on top of the shipped default review prompt. Anchors severity to this
> repo's real conventions (Astro 7 SSG + Svelte 5 islands + TS 6 + Tailwind 4
> `@theme` PTT tokens + Biome 2, pnpm, bilingual ES-primary/EN static site on
> Cloudflare Pages). Adapt as conventions evolve — see `AGENTS.md`.

## Severity overrides for this codebase

- **Always `critical`:**
  - **Per-edition palette leak.** Setting `--ptt-*` tokens outside `src/styles/global.css`
    or a `[data-edition-theme="{year}"]` scope — including inline
    `style="--ptt-primary: …"` on a component. Chrome (Header/footer/lang switch/theme
    toggle) must keep the global PTT brand on every PTD edition page.
  - **New top-level route not in the middleware allowlist.** A new page under
    `src/pages/` (or `src/pages/en/`) without a matching entry in
    `src/middleware.ts` (`KNOWN_ROOT_PATHS` / `KNOWN_EN_PATHS`) — the route 404s in
    production until allowlisted.
  - **Reveal.js CSS/JS imported outside `SlideLayout.astro`** (e.g. into `MainLayout`
    or a shared component) — leaks deck assets onto every route.
  - **remark/rehype reintroduced into the Markdown pipeline.** Adding
    `markdown.remarkPlugins` / `rehypePlugins` / `remarkRehype` to `astro.config.mjs`,
    switching `markdown.processor` back to `unified()`, or adding a `rehype-*` /
    `remark-*` / `unist-*` dependency. This repo compiles Markdown with **Sätteri**
    (`markdown.processor: satteri({ hastPlugins: [...] })`), which does not run
    remark/rehype plugins — the transform silently never runs. Port it to a HAST
    plugin in `src/lib/satteri-plugins.ts` instead.
  - **Placeholder content shipped.** `[AUTHOR:`, `[AUTOR:`, `[TODO:`, `[TBD]`,
    `[FIXME]` or any bracketed "fill-in-later" text in `src/content/**`.
  - **Secret committed.** Any API key / token / `PUBLIC_GOOGLE_SITE_VERIFICATION`
    (banned per the analytics policy), or a `google-site-verification` meta tag in a
    template/component.
  - **i18n content added in only one language.** A blog post / meetup / slide deck /
    page added under `en/` (or `es/`) without its counterpart, or a new UI string added
    to `src/lib/translations/en.ts` but not `es.ts` (or vice versa).

- **Escalate to `warning`:**
  - **Failing WCAG AA text color** for body/secondary text: `text-gray-400`,
    `text-gray-500`, `dark:text-gray-400`, `dark:text-gray-500`, or `--ptt-accent`
    (`#E8A33D`) used for body text. Approved secondary text is
    `text-gray-600 dark:text-gray-300` / `text-ptt-secondary`.
  - **`<img>` without `width` and `height`** (causes layout shift; also an a11y rule here).
  - **Hardcoded user-visible string** in a template/component instead of
    `getTranslations(lang)` — or a hardcoded URL instead of `getUrlPrefix(lang)`.
  - **Interactive logic in a `.astro` file** that should be a Svelte island, or a
    Svelte component used without a `client:*` directive, or `client:load` where
    `client:visible` / `client:idle` would suffice.
  - **Page wrapper importing `MainLayout`** directly (layout belongs inside the
    `*Page.astro` component), or `lang` passed as a variable instead of a string literal.
  - **Non-English slug** for a blog post / meetup / series / PTD edition
    (`YYYY-MM-DD_slug.md` must use an English slug in both languages).
  - **Spanish content missing diacritics** — e.g. `codigo`, `version`, `pagina`,
    `analisis`, `manana`, `espanol`, `diseno` in `src/content/**` or `es.ts`.
  - **`MainLayout` used for an `/internal/**` page** (must use `InternalLayout` /
    `ShowcaseLayout`), or a public page referencing an `/internal/` route.

- **De-escalate to `info` (or omit):**
  - Anything Biome already enforces — formatting, import ordering, quote style.
    Biome is the CI gate (`pnpm run biome:check`); the reviewer should not duplicate it.
  - Pure TypeScript type errors — `pnpm run astro:check` gates these in CI.

## Don't comment on

- Generated/optimized image binaries under `public/images/**`.
- Demo blog content under `_demo/` folders (never shipped in listings/search).
- ESLint/Prettier suggestions — this project uses **Biome exclusively**; do not
  recommend ESLint or Prettier.
- Vendored agent tooling under `.agents/skills/**` and `.dwp/**` — not application code.

## Repo-specific conventions

- **Pages** = 1 shared `*Page.astro` in `src/components/pages/` + thin 3-line wrappers
  in `src/pages/` (ES, served at `/`) and `src/pages/en/` (EN, served at `/en`). Flag deviations as `warning`.
- **Content** lives in Astro Content Collections with Zod schemas in
  `src/content.config.ts`; new fields must be added to the schema.
- **Markdown-for-Agents twins:** when page/translation content changes, the matching
  `src/content/pages/{en,es}/*.md` must be updated in the same change (`pnpm run md:check`).
- **PTT tokens** (`text-ptt`, `bg-ptt-bg`, `border-ptt-border`, `text-ptt-secondary`)
  on new components — not raw non-PTT design tokens.
- **Real validation gate** the diff should pass:
  `pnpm run biome:check && pnpm run astro:check && pnpm run test && pnpm run build`
  (plus `pnpm run md:check`). Cite it when a change plausibly breaks it.
- **Commits** follow Conventional Commits with this repo's scopes
  (`brand`, `blog`, `meetups`, `ptd`, `i18n`, `a11y`, `slides`, …).
