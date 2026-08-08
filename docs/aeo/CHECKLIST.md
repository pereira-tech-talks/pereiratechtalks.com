# AEO Monthly Maintenance Checklist

**Purpose:** Repeatable checklist to maintain and improve Pereira Tech Talks v3.0.0 AEO (Answer Engine Optimization) health over time.

## 1. Content Freshness

- [ ] Check if `public/llms.txt` includes all recent blog posts, meetups, and Pereira Tech Day editions
- [ ] Check if `public/llms-full.txt` has accurate descriptions and URLs
- [ ] Verify blog post count in llms files matches actual content (`ls src/content/blog/en/ | grep -v _demo | wc -l`)
- [ ] Verify meetup count (`ls src/content/meetups/*.md | wc -l`) and event count match the public catalogs
- [ ] If new blog posts were added, verify they have complete frontmatter (`title`, `description`, `pubDate`, `tags`, `heroImage`, `author`)
- [ ] If a new Pereira Tech Day edition was published, verify its `brandKit` is complete and the `[data-edition-theme="{year}"]` scope renders correctly

## 2. Indexation Health

- [ ] Check Google Search Console for crawl errors: https://search.google.com/search-console
- [ ] Check Bing Webmaster Tools: https://www.bing.com/webmasters
- [ ] Verify indexed page count matches expected (pages + blog posts + meetups + slides + Tech Day editions in both languages)
- [ ] Check for any pages showing "Excluded" or "Not indexed" status

## 3. Sitemap & Robots

- [ ] Verify sitemap is accessible: `curl -s https://pereiratechtalks.org/sitemap-index.xml | head -5`
- [ ] Verify robots.txt is accessible: `curl -s https://pereiratechtalks.org/robots.txt | head -10`
- [ ] Confirm no accidental blocks in robots.txt for content pages
- [ ] Verify sitemap includes `<lastmod>` entries (automatically set at build time)
- [ ] Verify `/internal/*` pages are excluded from the sitemap

## 4. Schema Validation

- [ ] Run Rich Results Test on 2-3 pages:
  - Homepage: https://search.google.com/test/rich-results?url=https://pereiratechtalks.org/
  - A blog post: https://search.google.com/test/rich-results?url=https://pereiratechtalks.org/blog/march-2026-meetup-recap/
  - A Pereira Tech Day edition: https://search.google.com/test/rich-results?url=https://pereiratechtalks.org/pereira-tech-days/2026/
  - About page: https://search.google.com/test/rich-results?url=https://pereiratechtalks.org/about/
- [ ] Verify JSON-LD is valid (no warnings or errors)
- [ ] Check that BlogPosting schema has: headline, description, datePublished, dateModified, author (with image), publisher
- [ ] Check that Event schema is present on Pereira Tech Day pages

## 5. LLM Testing

Test 5 target queries from `docs/aeo/QUERIES.md` across AI engines:

- [ ] **ChatGPT**: Ask 5 queries. Note: Does it mention pereiratechtalks.org? Does it cite a specific URL?
- [ ] **Claude**: Same 5 queries. Note results.
- [ ] **Perplexity**: Same 5 queries. Note results (Perplexity shows sources explicitly).
- [ ] **Google AI Overview**: Search 3 queries on Google. Check if AI Overview cites the site.

Record results:

| Query | ChatGPT | Claude | Perplexity | Google AI |
|-------|---------|--------|------------|-----------|
| (query 1) | Cited? Y/N | Cited? Y/N | Cited? Y/N | Cited? Y/N |

## 6. Performance

- [ ] Run Lighthouse on homepage: `pnpm run lighthouse` (or Chrome DevTools)
- [ ] Confirm all scores remain at 100 (or 95+ minimum)
- [ ] Check Core Web Vitals in Google Search Console
- [ ] Verify no new JS was accidentally added (check bundle size with `pnpm run search:budgets`)

## 7. RSS & Feeds

- [ ] Verify Spanish RSS: `curl -s https://pereiratechtalks.org/rss.xml | head -20`
- [ ] Verify English RSS: `curl -s https://pereiratechtalks.org/en/rss.xml | head -20`
- [ ] Confirm latest posts appear in feeds

## 8. Markdown for Agents

- [ ] Verify `.md` endpoints are generated: `find dist -name "*.md" | wc -l` (should be 100+)
- [ ] Spot-check a blog post `.md` endpoint: `cat dist/blog/march-2026-meetup-recap.md | head -15`
- [ ] Verify content-type is set in endpoint source: `grep "text/markdown" src/pages/blog/\[slug\].md.ts`
- [ ] Check page endpoints exist: `ls dist/about.md dist/contact.md dist/en/about.md`
- [ ] Verify blog index: `cat dist/blog/index.md | head -20`
- [ ] Ensure `llms.txt` references Markdown endpoints: `grep "\.md" public/llms.txt`
- [ ] Verify content negotiation middleware: `grep "text/markdown" functions/_middleware.ts`
- [ ] **Sync check:** Compare page `.md` files against HTML content — no major sections missing
- [ ] **Bilingual sync:** EN and ES `.md` files cover the same sections (`ls src/content/pages/en/ src/content/pages/es/`)
- [ ] **Analytics:** Verify `markdown_request` events appear in Umami (Events tab → filter `markdown_request`)
- [ ] **Analytics sources:** Check both `content_negotiation` and `direct_url` sources are being captured
- [ ] Full docs: [Markdown for Agents](MARKDOWN_FOR_AGENTS.md)

## 8b. Agent-readiness (isitagentready.com)

- [ ] `/auth.md` returns `200` with `Content-Type: text/markdown` and an H1 containing `auth.md`
- [ ] `/.well-known/oauth-protected-resource` — `resource` origin matches the scanned host; `bearer_methods_supported` includes `header`
- [ ] `/.well-known/oauth-authorization-server` includes `agent_auth` with `register_uri` + anonymous method
- [ ] WebMCP tools register on page load via `navigator.modelContext.registerTool()` (`WebMCPBridge` uses `client:load`)
- [ ] DNS-AID: HTTPS records for `_index._agents` and `_index._agents.v3` — see [DNS_AID.md](DNS_AID.md)
- [ ] Re-scan: `curl -s https://isitagentready.com/api/scan -H 'content-type: application/json' -d '{"url":"https://pereiratechtalks.org"}'`

## 9. Quick Local Validation

Run these commands before deploying:

```bash
# Full validation suite
pnpm run biome:check && pnpm run astro:check && pnpm run build && pnpm run test

# Check llms.txt files are in build output
ls -la dist/llms.txt dist/llms-full.txt

# Verify sitemap has lastmod
grep "lastmod" dist/sitemap-0.xml | head -3

# Check schema in a built blog post
grep "BlogPosting" dist/blog/march-2026-meetup-recap/index.html | head -1

# Verify Markdown endpoints generated
find dist -name "*.md" | wc -l

# Verify per-edition theme on the latest Tech Day page
grep 'data-edition-theme' dist/pereira-tech-days/2026/index.html
```

## Schedule

| Frequency | Tasks |
|-----------|-------|
| Every deploy | Section 9 (local validation) |
| Monthly | Sections 1-8 (full checklist) |
| Quarterly | Full audit refresh — re-run a fresh AEO audit (see `docs/aeo/AUDIT.md` template) |
