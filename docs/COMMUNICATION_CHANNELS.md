# Communication Channels

This document is the **canonical inventory** of every official Pereira Tech Talks channel: where to find us, what each channel is for, who runs it, and how content flows between them.

> **One-line summary:** the website is the source of truth, social channels are amplifiers, and chat channels are where the community lives day-to-day.

## Public-facing channels

| Channel | URL / Handle | Purpose | Frequency |
|---|---|---|---|
| **Website** | <https://pereiratechtalks.org> | Source of truth: meetups, events, Pereira Tech Days, blog, slides, speakers, contributors, sponsors. | Real-time |
| **Newsletter** | `pereiratechtalks.org/newsletter` | Monthly digest: upcoming meetups, latest talks, blog highlights, vertical news. | Monthly |
| **Luma** | <https://luma.com/pertechtalks> | RSVPs and event listing for monthly meetups. | Per meetup |
| **YouTube** | `@pereiratechtalks` | Recorded talks, livestream archives, Pereira Tech Day editions, special features. | Per event + on-demand uploads |
| **X (Twitter)** | `@pertechtalks` | Real-time updates, threaded recaps, speaker spotlights, community amplification. | Daily |
| **LinkedIn** | `company/pereira-tech-talks` | Long-form professional updates, sponsor announcements, jobs, speaker spotlights. | Weekly |
| **Instagram** | `@pereiratechtalks` | Visual recaps, behind-the-scenes, speaker portraits, PTD branding. | Per event |
| **GitHub** | `github.com/pereira-tech-talks` | Open-source projects, the website itself, community tooling. | As needed |
| **Linktree** | `linktr.ee/pereiratechtalks` | One-link bio for socials linking back to website + key channels. | Static |

## Community / chat channels

| Channel | Where | Purpose | Who runs it |
|---|---|---|---|
| **Discord** | `discord.gg/pereiratechtalks` | Primary community chat. Topical channels (`#general`, `#help`, `#meetups`, `#speaker-school`, `#la-biblioteca`, `#ai-channel`, `#jobs`, `#showcase`). | Mod team (3 organizers + Conduct team) |
| **WhatsApp** | <https://chat.whatsapp.com/GI5ZismAsqA4a4EPHnJ6RG> | Real-time meetup logistics, low-noise community group. | Meetups vertical lead |
| **Telegram** | `t.me/pereiratechtalks` | Optional broadcast channel mirroring WhatsApp announcements. | Meetups vertical lead |

## Internal / organizer-only channels

These are not public; listed here so AI agents working on the codebase know they exist:

| Channel | Where | Purpose |
|---|---|---|
| Organizers' meeting | Monthly Google Meet | Strategic decisions, financials, sponsor pipeline. |
| Organizers' Slack/Discord | Private | Day-to-day operational chat. |
| Sponsors' shared inbox | <sponsors@pereiratechtalks.org> | All sponsorship inquiries. |
| Speakers' shared inbox | <speakers@pereiratechtalks.org> | All speaker inquiries / Call for Speakers. |
| Press inbox | <press@pereiratechtalks.org> | Press inquiries, interview requests. |
| Conduct inbox | <conduct@pereiratechtalks.org> | Code of Conduct reports — Conduct team only. |
| General inbox | <pereiratechtalks@gmail.com> | Catch-all for anything that doesn't fit above. |

## Content flow

The website is the **source of truth**. All other channels amplify and link back:

```
website (canonical)
   │
   ├─→ newsletter (monthly digest of website updates)
   │
   ├─→ X · LinkedIn · Instagram (per-event amplification + recaps)
   │
   ├─→ YouTube (talks recorded, slides linked)
   │
   ├─→ Luma (RSVPs synced from /events)
   │
   └─→ Discord · WhatsApp · Telegram (community discussion of website content)
```

When publishing a meetup, blog post, or PTD edition, the rule is:

1. Land it on the website first (with EN + ES content + AEO Markdown).
2. Newsletter pulls from the website weekly.
3. Social amplifiers (X, LinkedIn, IG) get a thread/post within 24 hours, all linking back.
4. Discord / WhatsApp announce with a 1-line teaser + link.

## Contact addresses

| Address | What it's for | Owner |
|---|---|---|
| <pereiratechtalks@gmail.com> | General questions, partnership, anything | Organizer rotation |
| <speakers@pereiratechtalks.org> | Call for Speakers, speaker logistics | Speakers vertical lead |
| <sponsors@pereiratechtalks.org> | Sponsorship inquiries, contracts | Sponsorship lead |
| <press@pereiratechtalks.org> | Press, interviews, media kit requests | Communications lead |
| <conduct@pereiratechtalks.org> | Code of Conduct reports | Conduct Team only |

All addresses route to a small group; expect a reply within 5 working days. Confidential matters (conduct, sponsor contracts) are handled with restricted access.

## Pending operational items

> Some addresses and accounts are still being provisioned for the v3.0.0 launch. The list above represents the **target state**. Until each item ships, the website footer points to the catch-all <pereiratechtalks@gmail.com>.

- DNS records for all role addresses (`speakers`, `sponsors`, `press`, `conduct`).
- Newsletter platform decision (likely Resend contact list or Buttondown).
- Discord category and bot setup for the new vertical channels.
- Linktree refresh with the new brand.

## Anti-spam

We do **not** sell, share, or rent any contact data. We do not run paid promotion through the newsletter or chat channels. We do not allow third-party recruiting outside `#jobs`. See [Community Guidelines](./COMMUNITY_GUIDELINES.md).

---

**Last reviewed:** 2026.
**Owner:** Communications lead (rotating among organizers).

A user-facing public version lives at `/channels` (EN) and `/es/canales` (ES).
