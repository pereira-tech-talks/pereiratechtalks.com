# Meetups

See `AGENTS.md` and `/add-meetup` for the full workflow.

## Speakers on flyers (mandatory mapping)

Meetup cover/hero images almost always print the speaker roster. Empty `speakers: []` is a defect when the flyer names people.

1. Open `public/images/meetups/{slug}/hero.*` and read every printed name + role.
2. Resolve or create `src/content/speakers/{slug}.yaml` (English slug, bilingual `role`/`bio`).
3. Fill meetup frontmatter `speakers: [slug, …]` left-to-right as on the flyer when known.
4. Prefer aliasing short flyer names to an existing profile (e.g. “Juan Perez” → `mega-barto`) over duplicates.
5. Illegible/candid archive photos → leave empty and note `needs-human`; do not invent names.

Census / remap work for the full archive lives under `.dwp/plans/PLAN_exhaustive_speakers_from_flyers/`.

## Memories gallery

Optional on-site gallery via meetup frontmatter `gallery: [{ src, alt?, caption? }]`.

Convention: `public/images/meetups/{slug}/memories/{n}.webp` (+ matching `gallery` entries). Empty `gallery` hides the section. External albums remain on `linkPhotos`. Photo ingest is a follow-up plan; schema/UI are ready.
