/**
 * Per-URL SEO and structured-data audit.
 *
 * `MainLayout.astro` emits canonical, hreflang, OG, Twitter and JSON-LD, and
 * inspecting the template says nothing about whether all 480 URLs end up right.
 * During this plan a dev-server 404 fallback served the 404 page's title and
 * description under a real URL — exactly the class of defect template review
 * cannot see. So this reads the built HTML, one URL at a time.
 *
 * Usage:
 *   node scripts/audit-seo.mjs                  # summary
 *   node scripts/audit-seo.mjs --strict         # exit 1 on any defect
 *   node scripts/audit-seo.mjs --report <dir>   # write SEO_AUDIT.md
 *
 * Page discovery is shared with the language audit and the parity gate
 * (./lib/dist-pages.mjs) so the three cannot disagree about which pages exist.
 *
 * Part of PLAN_sitewide_language_seo_aeo_audit Task 10.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import {
  collectPages,
  DIST_DIR,
  expectedLanguageFor,
  htmlPathFor,
} from './lib/dist-pages.mjs';

const argv = process.argv.slice(2);
const STRICT = argv.includes('--strict');
const reportIdx = argv.indexOf('--report');
const REPORT_DIR = reportIdx !== -1 ? argv[reportIdx + 1] : null;

/** CLAUDE.md pre-commit checklist: meta descriptions live in this band. */
export const DESCRIPTION_MIN = 130;
export const DESCRIPTION_MAX = 160;

/** Surfaces that are intentionally `noindex`. */
const INTENTIONAL_NOINDEX = [
  /^certificates(\/|$)/,
  /^verify(\/|$)/,
  /^en\/certificates(\/|$)/,
  /^en\/verify(\/|$)/,
];

/** JSON-LD `@type` expected for a page, by path shape. */
function expectedJsonLdTypes(pagePath) {
  const path = pagePath.replace(/^en\/?/, '');
  if (/^meetups\/.+/.test(path)) return ['Event'];
  if (/^pereira-tech-days\/.+/.test(path)) return ['Event'];
  if (/^speakers\/.+/.test(path)) return ['Person'];
  if (/^blog\/(?!series$)(?!series\/).+/.test(path)) return ['BlogPosting'];
  return [];
}

// ── Extraction ────────────────────────────────────────────

/**
 * Read an attribute, honouring which quote character opened it.
 *
 * A naive `["']([^"']*)["']` truncates at the first apostrophe inside a
 * double-quoted value: `content="Let's talk about infrastructure"` was read as
 * `Let`, which reported a 145-character description as 34 and would have sent
 * this task off rewriting copy that was already fine.
 */
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`${name}=(["'])([\\s\\S]*?)\\1`, 'i'));
  return m ? m[2] : null;
};

/** Decode the entities Astro emits inside attribute values. */
const decodeEntities = (value) =>
  value === null
    ? null
    : value
        .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
        .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
          String.fromCharCode(Number.parseInt(code, 16))
        )
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');

/**
 * Reads either attribute. The Twitter card spec uses `name`, Open Graph uses
 * `property`, and pages in the wild mix them — the audit should report what a
 * consumer would find, not which attribute the author picked.
 */
const metaByName = (html, name) => {
  const re = new RegExp(
    `<meta[^>]*(?:name|property)=["']${name}["'][^>]*>`,
    'i'
  );
  const m = html.match(re);
  return m ? decodeEntities(attr(m[0], 'content')) : null;
};

const metaByProperty = (html, property) => {
  const re = new RegExp(`<meta[^>]*property=["']${property}["'][^>]*>`, 'i');
  const m = html.match(re);
  return m ? decodeEntities(attr(m[0], 'content')) : null;
};

export function extractSeo(html) {
  const htmlTag = html.match(/<html[^>]*>/i);
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const canonicalTag = html.match(/<link[^>]*rel=["']canonical["'][^>]*>/i);

  const alternates = [
    ...html.matchAll(/<link[^>]*rel=["']alternate["'][^>]*>/gi),
  ]
    .map((m) => ({
      hreflang: attr(m[0], 'hreflang'),
      href: attr(m[0], 'href'),
    }))
    .filter((a) => a.hreflang);

  const jsonLd = [
    ...html.matchAll(
      /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
    ),
  ].map((m) => m[1]);

  return {
    lang: htmlTag ? attr(htmlTag[0], 'lang') : null,
    title: titleMatch ? decodeEntities(titleMatch[1].trim()) : null,
    description: metaByName(html, 'description'),
    robots: metaByName(html, 'robots'),
    canonical: canonicalTag ? attr(canonicalTag[0], 'href') : null,
    alternates,
    og: {
      title: metaByProperty(html, 'og:title'),
      description: metaByProperty(html, 'og:description'),
      image: metaByProperty(html, 'og:image'),
      url: metaByProperty(html, 'og:url'),
    },
    twitter: {
      card: metaByName(html, 'twitter:card'),
      title: metaByName(html, 'twitter:title'),
      description: metaByName(html, 'twitter:description'),
      image: metaByName(html, 'twitter:image'),
    },
    jsonLdRaw: jsonLd,
    hasGoogleVerification: /name=["']google-site-verification["']/i.test(html),
  };
}

/** Every `@type` in a JSON-LD payload, including `@graph` members. */
export function jsonLdTypes(parsed) {
  const types = [];
  const walk = (node) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== 'object') return;
    if (node['@type']) {
      types.push(...[node['@type']].flat());
    }
    if (node['@graph']) walk(node['@graph']);
  };
  walk(parsed);
  return types;
}

/** The other language's URL for a page path. */
export function siblingPath(pagePath) {
  if (pagePath === 'index') return 'en';
  if (pagePath === 'en') return 'index';
  return pagePath.startsWith('en/') ? pagePath.slice(3) : `en/${pagePath}`;
}

// ── Assertions ────────────────────────────────────────────

export function auditPage({ pagePath, seo, siblingExists }) {
  const defects = [];
  const expectedLang = expectedLanguageFor(pagePath);
  const push = (cls, detail) => defects.push({ class: cls, detail });

  if (seo.lang !== expectedLang) {
    push(
      'html-lang',
      `<html lang="${seo.lang}"> but the URL promises "${expectedLang}"`
    );
  }

  if (!seo.title) push('title-missing', 'no <title>');
  else if (/^404|Page not found|Página no encontrada/i.test(seo.title)) {
    push('title-404', `serves the 404 title: "${seo.title}"`);
  }

  if (!seo.description) {
    push('description-missing', 'no meta description');
  } else {
    const len = seo.description.length;
    if (len < DESCRIPTION_MIN || len > DESCRIPTION_MAX) {
      push(
        'description-length',
        `${len} chars, outside ${DESCRIPTION_MIN}-${DESCRIPTION_MAX}`
      );
    }
  }

  if (!seo.canonical) push('canonical-missing', 'no canonical link');
  else if (!/^https?:\/\//.test(seo.canonical)) {
    push('canonical-relative', `canonical is not absolute: ${seo.canonical}`);
  }

  const langs = seo.alternates.map((a) => a.hreflang);
  if (!langs.includes('x-default')) push('hreflang-x-default', 'no x-default');
  for (const expected of ['es', 'en']) {
    if (!langs.includes(expected)) {
      push('hreflang-missing', `no hreflang="${expected}"`);
    }
  }
  if (siblingExists === false) {
    push(
      'hreflang-dead',
      'the alternate-language page does not exist in the build'
    );
  }

  for (const [key, value] of Object.entries(seo.og)) {
    if (!value) push('og-missing', `og:${key} is empty`);
  }
  for (const [key, value] of Object.entries(seo.twitter)) {
    if (!value) push('twitter-missing', `twitter:${key} is empty`);
  }

  if (seo.jsonLdRaw.length === 0) {
    push('jsonld-missing', 'no JSON-LD block');
  }
  const types = [];
  for (const raw of seo.jsonLdRaw) {
    try {
      types.push(...jsonLdTypes(JSON.parse(raw)));
    } catch (error) {
      push('jsonld-invalid', `JSON-LD does not parse: ${error.message}`);
    }
  }
  for (const expected of expectedJsonLdTypes(pagePath)) {
    if (!types.includes(expected)) {
      push(
        'jsonld-type',
        `expected a "${expected}" block, found: ${types.join(', ') || 'none'}`
      );
    }
  }

  const shouldNoindex = INTENTIONAL_NOINDEX.some((re) => re.test(pagePath));
  const isNoindex = /noindex/i.test(seo.robots ?? '');
  if (isNoindex && !shouldNoindex) {
    push('noindex-unexpected', `robots="${seo.robots}"`);
  }
  if (!isNoindex && shouldNoindex) {
    push('noindex-missing', 'expected noindex on this surface');
  }

  if (seo.hasGoogleVerification) {
    // CLAUDE.md §11: GSC verification is DNS-only.
    push(
      'google-verification',
      'a google-site-verification meta tag is present'
    );
  }

  return { pagePath, seo, defects };
}

// ── Main ──────────────────────────────────────────────────

if (!existsSync(DIST_DIR)) {
  console.error('❌ dist/ not found. Run `pnpm run build` first.');
  process.exit(1);
}

console.log('🔎 Per-URL SEO Audit\n');

const { checkable } = collectPages();
const known = new Set(checkable);

const results = checkable.map((pagePath) => {
  const html = readFileSync(htmlPathFor(pagePath, DIST_DIR), 'utf-8');
  const seo = extractSeo(html);
  return auditPage({
    pagePath,
    seo,
    siblingExists: known.has(siblingPath(pagePath)),
  });
});

/**
 * Uniqueness is a cross-page property, so it is checked after extraction — and
 * only **within a language**. An English page and its Spanish twin sharing a
 * title is correct whenever the title is a proper noun ("Quarantine Tech
 * Talks", "Pereira Girls Day"); `hreflang` already tells a crawler they are
 * alternates of one another, not competing pages.
 */
const byTitle = new Map();
const byDescription = new Map();
const scoped = (r, value) => `${expectedLanguageFor(r.pagePath)}\u0000${value}`;
for (const r of results) {
  if (r.seo.title) {
    const key = scoped(r, r.seo.title);
    byTitle.set(key, [...(byTitle.get(key) ?? []), r.pagePath]);
  }
  if (r.seo.description) {
    const key = scoped(r, r.seo.description);
    byDescription.set(key, [...(byDescription.get(key) ?? []), r.pagePath]);
  }
}
/**
 * Two URLs sharing a title is only a defect when both are indexable in their
 * own right. `/pereira-tech-days/{currentYear}` canonicalizes to
 * `/pereira-tech-day`, so they are one page with two addresses.
 */
const canonicalOf = (r) => r.seo.canonical?.replace(/\/$/, '') ?? r.pagePath;

for (const r of results) {
  const titleMates = byTitle.get(scoped(r, r.seo.title)) ?? [];
  const competingTitles = titleMates.filter(
    (p) =>
      p !== r.pagePath &&
      canonicalOf(results.find((x) => x.pagePath === p)) !== canonicalOf(r)
  );
  if (competingTitles.length > 0) {
    r.defects.push({
      class: 'title-duplicate',
      detail: `shared with ${titleMates
        .filter((p) => p !== r.pagePath)
        .slice(0, 3)
        .join(', ')}`,
    });
  }
  const descMates = byDescription.get(scoped(r, r.seo.description)) ?? [];
  const competingDescriptions = descMates.filter(
    (p) =>
      p !== r.pagePath &&
      canonicalOf(results.find((x) => x.pagePath === p)) !== canonicalOf(r)
  );
  if (competingDescriptions.length > 0) {
    r.defects.push({
      class: 'description-duplicate',
      detail: `shared with ${descMates
        .filter((p) => p !== r.pagePath)
        .slice(0, 3)
        .join(', ')}`,
    });
  }
}

const failing = results.filter((r) => r.defects.length > 0);
const byClass = new Map();
for (const r of failing) {
  for (const d of r.defects) {
    byClass.set(d.class, (byClass.get(d.class) ?? 0) + 1);
  }
}

const ranked = [...byClass.entries()].sort((a, b) => b[1] - a[1]);

console.log(`   Audited:  ${results.length} URLs`);
console.log(`   Clean:    ${results.length - failing.length}`);
console.log(`   Flagged:  ${failing.length}\n`);
if (ranked.length > 0) {
  console.log('   Defects by class:');
  for (const [cls, count] of ranked) {
    console.log(`      ${cls.padEnd(24)} ${count}`);
  }
  console.log('');
}

if (REPORT_DIR) {
  const lines = [
    '# Per-URL SEO Audit',
    '',
    'Generated by `scripts/audit-seo.mjs` from the build output.',
    '',
    '| Metric | Count |',
    '|---|---|',
    `| URLs audited | ${results.length} |`,
    `| Clean | ${results.length - failing.length} |`,
    `| With at least one defect | ${failing.length} |`,
    '',
    '## Defects by class',
    '',
    '| Class | Count |',
    '|---|---|',
    ...ranked.map(([cls, count]) => `| \`${cls}\` | ${count} |`),
    '',
    '## Flagged URLs',
    '',
  ];
  for (const r of failing.sort((a, b) =>
    a.pagePath.localeCompare(b.pagePath)
  )) {
    lines.push(`### \`/${r.pagePath}\``);
    lines.push('');
    for (const d of r.defects) lines.push(`- **${d.class}** — ${d.detail}`);
    lines.push('');
  }
  if (failing.length === 0) {
    lines.push('None. Every audited URL passes every assertion.', '');
  }
  writeFileSync(
    join(REPORT_DIR, 'SEO_AUDIT.md'),
    `${lines.join('\n')}\n`,
    'utf-8'
  );
  console.log(`   Report written to ${REPORT_DIR}\n`);
}

if (failing.length > 0 && STRICT) process.exit(1);
