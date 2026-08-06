# AEO Audit — Pereira Tech Talks v3.0.0

**Date:** 2026-08-06  
**Auditor:** PLAN_sitewide_pro_audit_design_typography_aeo (Task 5)  
**Site:** https://pereiratechtalks.org  
**Routing:** Spanish primary at `/`; English at `/en/`

## Executive Summary

AEO foundations are strong (Markdown twins, JSON-LD, llms.txt, hreflang, sitemap). This pass fixed **route drift** in discovery docs (`/events/`, `/speaker-school/`, obsolete `/es/` RSS guidance) and documented real grades. PTD listing JSON-LD (`ItemList` + `EventSeries`) lands with Task 6.

## Dimension Grades

| Dimension | Grade | Score | Key Strength | Status |
|-----------|-------|-------|--------------|--------|
| Crawlability | A | 5/5 | robots + AI crawler allow; `/internal` excluded | Verified in prior plans |
| Indexability | A- | 4.5/5 | sitemap + hreflang; Spanish primary x-default | Docs corrected this plan |
| Structured data | B+ | 4/5 | Org/Event/BlogPosting; listing ItemList added | PTD listing fixed |
| Content quality | A- | 4.5/5 | Bilingual collections, orthography gates | Ongoing |
| Discovery files | A | 5/5 | llms.txt / llms-full align to live routes | Fixed this plan |
| Markdown for agents | A- | 4.5/5 | `md:check` harness; agent MD docs updated | Fixed `/es/` drift |
| Performance | A | 5/5 | Home LHCI ~1.0 target retained | Do not regress |
| E-E-A-T signals | A- | 4.5/5 | Authors, contributors, governance pages | Solid |

## Fixes in this plan

- `public/llms.txt` + `llms-full.txt`: calendar, verticals, certificates; removed dead `/events/`, `/speaker-school/`
- `docs/SEO.md`: Spanish primary, x-default → es, RSS paths
- AEO docs: retire `/es/` public URL guidance
- Note: JSON-LD on PTD catalog via Task 6 redesign

## Related

- [CHECKLIST.md](CHECKLIST.md) · [QUERIES.md](QUERIES.md) · [MARKDOWN_FOR_AGENTS.md](MARKDOWN_FOR_AGENTS.md) · [SEO Guide](../SEO.md)
