# Talks

Talk entries power speaker history (`/speakers/{slug}`), meetup detail talk lists, and Pereira Tech Day “Charlas” sections.

## Collection

- **Path:** `src/content/talks/`
- **Naming:** `{meetup-slug}--{n}-{talk-slug}.md` or `ptd-{year}--{n}-{talk-slug}.md`
- **Schema:** bilingual `title` / `abstract`, `speakers[]` (≥1), optional `event.{collection,slug}`, `type` (`talk` \| `keynote` \| `lightning` \| `panel` \| `workshop`), `status` (`scheduled` \| `live` \| `recorded` \| `cancelled`)

## Source of truth

Runtime linkage is **one-way from talks → speakers** via `talk.data.speakers` (`getTalksBySpeaker`). The optional `speaker.talks[]` array is **not** dual-written; leave it empty unless a future migration opts in.

Meetup frontmatter should list talk ids in `talks: []` after create. Speaker pages do not read meetup `speakers[]` for talk history.

## New talk workflow

Use the `/add-talk` skill (`.agents/skills/add-talk/`). Do not invent speakers or titles without meetup body / flyer / PTD YAML evidence.

## Related

- [Meetups](./MEETUPS.md) — flyer → speakers mapping
- [Community Stats](./COMMUNITY_STATS.md) — hybrid talk counters until the collection is complete
