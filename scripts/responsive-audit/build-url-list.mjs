#!/usr/bin/env node
/**
 * Crawl `dist/` (after a production build) to enumerate every generated route
 * and classify it by template. Writes:
 *   - analysis_results/00_baseline/route_inventory.md (human-readable)
 *   - analysis_results/00_baseline/route_inventory.json (machine-readable)
 */
import { mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..', '..');
const DIST = join(ROOT, 'dist');
const OUT_DIR = join(
  ROOT,
  '.agent_commands',
  'agent_deep_work_plans',
  'results',
  'plans',
  'PLAN_full_responsive_audit',
  'analysis_results',
  '00_baseline'
);

function walk(dir, base = '') {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = base ? `${base}/${entry}` : entry;
    if (statSync(full).isDirectory()) {
      out.push(...walk(full, rel));
    } else if (entry === 'index.html' || entry.endsWith('.html')) {
      out.push(rel);
    }
  }
  return out;
}

function classify(route) {
  const r =
    '/' +
    route
      .replace(/index\.html$/, '')
      .replace(/\.html$/, '')
      .replace(/\/$/, '');
  const lang = r.startsWith('/en/') || r === '/en' ? 'en' : 'es';
  const path = r === '' ? '/' : r;

  // Internal hub
  if (path.startsWith('/internal/'))
    return { path, lang, template: 'internal' };

  // Markdown twins
  if (path.endsWith('.md')) return { path, lang, template: 'md-twin' };

  // Root
  if (path === '/' || path === '/en') return { path, lang, template: 'home' };

  // Strip lang prefix
  const p = path.replace(/^\/en/, '') || '/';

  // Blog
  if (p === '/blog' || p.match(/^\/blog\/page\/\d+$/))
    return { path, lang, template: 'blog-listing' };
  if (p.startsWith('/blog/tag/') && p.match(/page\/\d+$/))
    return { path, lang, template: 'blog-tag-pagination' };
  if (p.startsWith('/blog/tag/')) return { path, lang, template: 'blog-tag' };
  if (p === '/blog/series')
    return { path, lang, template: 'blog-series-listing' };
  if (p.startsWith('/blog/series/'))
    return { path, lang, template: 'blog-series' };
  if (p.startsWith('/blog/')) return { path, lang, template: 'blog-post' };

  // Meetups
  if (p === '/meetups') return { path, lang, template: 'meetups-list' };
  if (p.startsWith('/meetups/'))
    return { path, lang, template: 'meetups-detail' };

  // Events
  if (p === '/events') return { path, lang, template: 'events-list' };
  if (p.startsWith('/events/'))
    return { path, lang, template: 'events-detail' };

  // PTD
  if (p === '/pereira-tech-day') return { path, lang, template: 'ptd-landing' };
  if (p === '/pereira-tech-days')
    return { path, lang, template: 'ptd-landing-redirect' };
  if (p.match(/^\/pereira-tech-days\/\d+$/))
    return { path, lang, template: 'ptd-edition' };
  if (p.startsWith('/pereira-tech-days/'))
    return { path, lang, template: 'ptd-edition-sub' };

  // Verticals
  if (p === '/verticals') return { path, lang, template: 'verticals-list' };
  if (p.startsWith('/verticals/'))
    return { path, lang, template: 'verticals-detail' };

  // Speakers
  if (p === '/speakers') return { path, lang, template: 'speakers-list' };
  if (p.startsWith('/speakers/'))
    return { path, lang, template: 'speakers-detail' };

  // Talks
  if (p === '/talks') return { path, lang, template: 'talks-list' };
  if (p.startsWith('/talks/')) return { path, lang, template: 'talks-detail' };

  // Slides
  if (p === '/slides') return { path, lang, template: 'slides-catalog' };
  if (p.startsWith('/slides/')) return { path, lang, template: 'slides-deck' };

  // Authors
  if (p === '/authors' || p.startsWith('/authors/'))
    return { path, lang, template: 'authors' };

  // Contributors
  if (p === '/contributors' || p.startsWith('/contributors/'))
    return { path, lang, template: 'contributors' };

  // Sponsors / channels / press
  if (p === '/sponsors') return { path, lang, template: 'sponsors' };
  if (p === '/channels') return { path, lang, template: 'channels' };
  if (p === '/press') return { path, lang, template: 'press' };

  // Narrative + forms
  if (p === '/about-us' || p === '/about' || p === '/sobre-nosotros')
    return { path, lang, template: 'narrative-about' };
  if (p === '/community' || p === '/comunidad')
    return { path, lang, template: 'narrative-community' };
  if (p === '/conduct') return { path, lang, template: 'narrative-conduct' };
  if (p === '/contributing')
    return { path, lang, template: 'narrative-contributing' };
  if (p === '/governance')
    return { path, lang, template: 'narrative-governance' };
  if (p === '/contact' || p === '/contacto')
    return { path, lang, template: 'form-contact' };
  if (p === '/call-for-speakers')
    return { path, lang, template: 'form-call-for-speakers' };
  if (p === '/sponsor-us') return { path, lang, template: 'form-sponsor-us' };
  if (p === '/404') return { path, lang, template: '404' };

  return { path, lang, template: 'unclassified' };
}

console.log(`📂 Walking ${DIST}…`);
const files = walk(DIST);
console.log(`   Found ${files.length} HTML files.`);

const inventory = files.map(classify);

// Aggregate by template
const byTemplate = {};
for (const item of inventory) {
  byTemplate[item.template] ??= { en: 0, es: 0 };
  byTemplate[item.template][item.lang]++;
}

const sortedTemplates = Object.entries(byTemplate).sort(
  (a, b) => b[1].en + b[1].es - (a[1].en + a[1].es)
);

mkdirSync(OUT_DIR, { recursive: true });

let md = '# Route Inventory — Baseline\n\n';
md += `**Date:** ${new Date().toISOString().slice(0, 10)}\n`;
md += `**Branch:** pertechtalks_v3\n`;
md += `**Total HTML files in dist/:** ${files.length}\n\n`;
md += '## Templates × language\n\n';
md += '| Template | EN | ES | Total |\n|---|---:|---:|---:|\n';
for (const [t, counts] of sortedTemplates) {
  md += `| \`${t}\` | ${counts.en} | ${counts.es} | ${counts.en + counts.es} |\n`;
}
md += `\n**Distinct templates:** ${sortedTemplates.length}\n\n`;
md += '## Representative subset used for `urls.json`\n\n';
md +=
  'See `scripts/responsive-audit/urls.json` — a curated subset covering every template × at least one language, plus all 4 blog hero layouts, plus 1 cancelled PTD edition.\n';

writeFileSync(join(OUT_DIR, 'route_inventory.md'), md);
writeFileSync(
  join(OUT_DIR, 'route_inventory.json'),
  JSON.stringify({ totalFiles: files.length, byTemplate, inventory }, null, 2)
);

console.log(`✓ Inventory written to ${OUT_DIR}`);
console.log(`   Templates: ${sortedTemplates.length}`);
console.log(`   Routes: ${files.length}`);
