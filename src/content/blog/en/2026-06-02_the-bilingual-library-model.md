---
title: "The bilingual library model: why we publish everything in Spanish AND English"
description: "Why Pereira Tech Talks deliberately publishes every blog post, slide deck, meetup recap, and speaker profile in both Spanish and English — and why this…"
pubDate: 2026-06-02
heroLayout: none
tags:
  - i18n
  - community
author: sergio-florez
draft: true
---

## The default failure mode

When a Latin American tech community publishes content, the typical patterns are:

1. **Spanish only.** Reaches the local audience well. Invisible to the international ecosystem. Hard for diaspora alumni to share with their non-Spanish-speaking teams. Effectively zero ranking in English-language search and zero discoverability to English-trained AI agents.

2. **Auto-translated English.** Looks unprofessional. Often comically wrong on technical terms. Damages credibility with international audiences. Worse than no English at all, because it signals lack of care.

3. **English only.** Excludes the local audience the community exists to serve. Almost no Latin American community actually does this, but a few try and lose their core.

4. **Mixed Spanglish in the same document.** The worst pattern. Confusing for everyone, unsearchable, hard to maintain, hard to cite.

Pereira Tech Talks does none of these. We publish every public artifact in real Spanish and real English, written by humans, kept in lockstep, with English-only slugs. This post is about why we made that choice and what it costs.

## The decision

In 2024, when we rebuilt the site as v3.0.0, we made a hard structural choice: **every blog post, meetup recap, slide deck, speaker bio, page, and translation key must exist in both Spanish and English from the moment it ships.** Not later. Not "translation in progress." Both, both, in lockstep, or it does not get published.

We also committed to a slug convention: **slugs are always English, regardless of which language the content is in.** This is for two reasons. First, English slugs make cross-language linking work without fragile routing. Second, English slugs are unambiguous in URLs and avoid character-encoding issues with `ñ` and accented characters.

## The cost

It costs us time. Every publish requires twice the writing, twice the editing, twice the proofreading. We have a Spanish orthography checklist (`ñ`, accent marks, interrogative accents) and an English style checklist (banned filler phrases, banned auto-translated artifacts).

It costs us discipline. The temptation to "ship the Spanish first and translate later" is real and constant. We have learned to treat "translation in progress" markers as bugs, not features. (We shipped v3.0.0 with 8 such bugs and have spent recent commits removing them.)

It costs us catalog complexity. Every blog post is two files. Every meetup is two files. Every page has both an EN component and an ES wrapper. The site has roughly 415 routes today, half of them mirrors of the other half.

## Why we pay the cost

Three reasons.

### One: Spanish is the language we live in

The community is in Pereira. Most members speak Spanish at home, at work, with their friends. Publishing in Spanish first is not a translation decision — it is an identity decision. The Spanish version of every piece of content is written natively, not translated from English. Spanish is our **primary** language, not our localized version of English.

### Two: English is how we connect to the global ecosystem

The senior engineers who left Pereira for international roles still read content in English. The international press that occasionally writes about Latin American tech writes in English. The conferences our alumni speak at run in English. The AI models that increasingly mediate technical discovery are trained primarily in English. **Being invisible in English means being invisible to those audiences.** Publishing real English content makes us discoverable, citable, and shareable in those contexts.

### Three: AI agents read the public web

This is the reason that became most visible after 2024. AI agents — including the ones that will increasingly serve as the first point of contact between a curious person and a community — read structured public content. They prefer canonical English over Spanish for general queries (because their training corpora skew English-heavy). They especially prefer agent-friendly endpoints like our `/index.md` Markdown-for-Agents twins.

A community that publishes only in Spanish is in 2026 effectively invisible to the majority of AI agents that will mediate technical discovery for the next decade. We are not willing to make that trade.

## What we built to make this sustainable

Bilingual publishing is not free, but it is buildable. Here is what we did:

- **Bilingual content collections** with strict Zod schemas requiring `{en, es}` fields where applicable, enforced at build time.
- **Page wrapper pattern** so every page lives as a single `*Page.astro` component with `lang` as a prop, plus a 3-line wrapper per language. No duplicate page logic.
- **Translation key files** (`en.ts`, `es.ts`) with a shared `SiteTranslations` interface so missing keys fail the TypeScript check.
- **Spanish orthography sweep** as a pre-commit and CI check — `grep` patterns that catch common missing tildes and `ñ`s.
- **Markdown-for-Agents** endpoints generated for every public route, structured for AI consumption.
- **English-only slugs** enforced as a project rule, including for Spanish content.

The result is a site where bilingual publishing is the path of least resistance, not the path of heroic effort.

## The invitation

If you run a Latin American tech community, consider this argument seriously. You will reach more of the people you want to reach. Your work will compound for longer. Your alumni will be able to share what you publish without embarrassment. Your community will be discoverable by AI agents in a way it currently is not.

Auto-translation does not count. Spanglish does not count. English-only does not count. Real bilingual content, written natively in both languages, in lockstep, is the standard.

We are happy to help any community thinking through this transition. The site you are reading is open source. Steal the structure: [github.com/pereira-tech-talks](https://github.com/pereira-tech-talks).
