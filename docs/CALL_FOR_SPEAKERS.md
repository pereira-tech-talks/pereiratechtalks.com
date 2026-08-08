# Call for Speakers

Pereira Tech Talks runs an **always-open** Call for Speakers. We accept proposals year-round for monthly meetups, special events, and the annual Pereira Tech Day.

> **Apply now:** [`/call-for-speakers`](https://pereiratechtalks.org/call-for-speakers) (Spanish primary) · [`/en/call-for-speakers`](https://pereiratechtalks.org/en/call-for-speakers) (English).

## What we look for

We program a balanced mix every month. Topics that consistently land:

- **Software engineering** — any stack, any seniority. We particularly welcome talks on trade-offs, refactors, and lessons-from-prod.
- **Data, AI, and agents** — practical applications, evaluations, post-mortems.
- **Product, design, and developer experience** — narratives that connect engineering to outcomes.
- **Career, leadership, mentoring, craft** — talks about how we work, not only what we build.
- **Open-source projects, side-projects, internships** — the smaller the project, often the better the talk.
- **Future of work, ethics, sustainability of tech** — long-form perspectives that stay with the audience.

We give priority to:

- **First-time speakers.** Nervous? We have Speaker School for that.
- **Speakers from outside the dominant Pereira tech bubble.** Different stacks, industries, regions, identities.
- **Talks paired with a working repo, demo, or recap post.** Practice + theory > theory alone.

## Formats

| Format | Length | Audience prep | Notes |
|---|---|---|---|
| Lightning talk | 5–10 min | None — drop in, drop out | Great for first timers. Often paired in groups of 3. |
| Regular talk | 20–30 min + Q&A | A spec sheet sent 7 days prior | Default format. Most monthly meetups have 1–2 of these. |
| Workshop | 60–90 min | Hands-on prerequisites communicated 7 days prior | Limited seats. Higher coordination cost — we plan workshops 6+ weeks in advance. |
| Panel | 45 min | Internal prep call | We curate 3–4 panelists. Submit yourself or nominate someone. |
| Pereira Tech Day keynote | 30–40 min | Multi-week prep with PTT speakers vertical | Annual flagship. We open a separate explicit CFS for this. |

## Timeline

For monthly meetups:

| Week | What happens |
|---|---|
| W-6 | Programming reviewers triage proposals received that month. |
| W-5 | Selected speakers receive an offer with a target meetup date. |
| W-4 | Speakers confirm. Logistics call scheduled. |
| W-3 | Speaker drafts an abstract + bio for the website. |
| W-2 | Hero image agreed; abstract finalized; meetup announced publicly. |
| W-1 | Slides reviewed (if requested by the speaker). Dry-run optional. |
| W-0 | Meetup happens. |
| W+1 | Recording uploaded; recap post drafted; thanks sent. |
| W+2 | Recap post published; social amplification round complete. |

For Pereira Tech Day, the CFS opens 6 months before the event.

## What you get

As a confirmed speaker:

- A dedicated reviewer who supports your prep
- Optional Speaker School session if you want help with structure / slides / delivery
- Slides reviewed by an organizer if you want feedback
- Hero image, abstract, and speaker bio professionally produced for the website
- A recording uploaded to YouTube (if you consent)
- A speaker spotlight post on the blog, with social amplification
- A free physical copy of any PTT swag of the year
- An entry in the public [Speakers directory](https://pereiratechtalks.org/speakers)
- An entry in the [Contributors directory](https://pereiratechtalks.org/contributors)

For Pereira Tech Day specifically, we cover:

- Travel from anywhere in Colombia (economy)
- Two nights of accommodation in Pereira during the event
- Speaker dinner the night before
- A stipend covered by sponsors when budget allows (clearly disclosed in the CFS that year)

## Recording rights

You retain full rights to your talk. By accepting our recording offer, you grant PTT a non-exclusive license to:

- Publish the recording on the official PTT YouTube channel
- Embed the recording on `pereiratechtalks.org`
- Use short clips (under 30 seconds) for social amplification, with attribution
- Provide it to event sponsors as part of the post-event deliverables, **without** sublicensing rights to those sponsors

You can request the recording be unlisted, taken down, or replaced at any time by emailing <speakers@pereiratechtalks.org>.

## Confidentiality

If your talk references confidential employer data, sensitive client work, or pending publications, please coordinate with us **before** submitting. We will not publish anything you ask us to keep confidential. We can also remove specific Q&A segments from the recording on request.

## What we don't accept

- **Marketing-only talks** (your product, with no broader engineering or design lessons)
- **Recruitment talks** (use the `#jobs` channel on Discord)
- **Re-runs of an exact talk you've given recently in Pereira** unless meaningfully revised
- **Talks that violate our [Code of Conduct](./CODE_OF_CONDUCT.md)** (e.g., disparaging entire communities, selective truth in benchmarks)

## How to submit

Use the form at [`/call-for-speakers`](https://pereiratechtalks.org/call-for-speakers) (English: `/en/call-for-speakers`). Submissions go to Dailybot via `POST /api/contact` (`_form: "cfs"`) — see [FORMS.md](./features/FORMS.md). The form asks for:

- Your name and email
- Talk title and format (regular / lightning / panel / workshop)
- Abstract and key takeaways
- Social / portfolio URL
- Whether this is your first talk with us and whether you want Speaker School mentorship
- Optional notes (dates, co-speakers, AV)

You'll see an on-page confirmation immediately; organizers reply within about 7 business days.

## Re-applying

If your proposal is declined for a given month, we keep it on file and re-evaluate it for the next two months automatically. After that, we close the loop and invite you to re-submit. **Most accepted proposals were re-submissions** — we say no to many great talks just because of calendar fit.

---

**Last reviewed:** 2026.
**Owner:** Speakers vertical lead.
**Contact:** <speakers@pereiratechtalks.org>.

A user-facing public form lives at `/call-for-speakers` (Spanish primary) and `/en/call-for-speakers`. Backend: Cloudflare Pages Function → Dailybot **PTT Call for Speakers** (optional Resend ack). You can still email <speakers@pereiratechtalks.org> directly.
