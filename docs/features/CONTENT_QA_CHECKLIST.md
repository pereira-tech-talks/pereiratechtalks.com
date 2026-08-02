# Content QA Checklist

Agent-facing gates before shipping content or closing a content DWP.

## Bilingual parity

- [ ] Blog/slides/pages: EN and ES twins exist with the same English slug
- [ ] Meetups: single file under `src/content/meetups/` with `title`/`description`/`hero.alt` in both `en` and `es`
- [ ] YAML entities (`speakers`, `sponsors`, …): `en`/`es` fields filled — no Spanish pasted into `en`

## Orthography

- [ ] Spanish user-facing text uses ñ and accented vowels
- [ ] Run Standards greps from [STANDARDS](../STANDARDS.md) (ignore English **slugs**)

## Voice & completeness

- [ ] No placeholders: `[TODO]`, `[TBD]`, `[AUTHOR]`, “Historical Pereira Tech Talks meetup” boilerplate
- [ ] Follow [Writing Voice Guide](../WRITING_VOICE_GUIDE.md)
- [ ] Meetup EN summaries are real English (or an honest archive note), not Spanish paste

## SEO / AEO

- [ ] Meta descriptions roughly 130–160 characters where practical
- [ ] Agent MD twins updated under `src/content/pages/{en,es}/` when page copy changes
- [ ] `pnpm run md:check` passes

## Automated

```bash
pnpm run test -- tests/unit/lib/content-date-parity.test.ts
pnpm run biome:check
pnpm run astro:check
pnpm run md:check
```
