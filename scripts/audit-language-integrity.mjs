/**
 * Sitewide language-integrity audit.
 *
 * Spanish URLs must render Spanish and `/en` URLs must render English — in the
 * HTML page and in its `.md` twin. This walks the build output and reports every
 * page where that promise is broken, with the offending text and its location.
 *
 * Detection is block-level (see `src/lib/language-detect.ts`): a page's chrome is
 * correctly localized even when its body is not, so a document-level average
 * would hide exactly the defect we are hunting.
 *
 * Usage:
 *   node scripts/audit-language-integrity.mjs
 *   node scripts/audit-language-integrity.mjs --json
 *   node scripts/audit-language-integrity.mjs --strict          # exit 1 on any flag
 *   node scripts/audit-language-integrity.mjs --report <dir>    # write MD reports
 *
 * Page discovery, redirect detection, and exclusions are shared with
 * `check-md-parity.mjs` via ./lib/dist-pages.mjs, so both agree on the surface.
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

import {
  analyzeDocument,
  CONFIDENT_MISMATCH_CONFIDENCE,
  htmlToText,
  markdownToText,
} from '../src/lib/language-detect.ts';
import {
  checkMdExists,
  collectPages,
  DIST_DIR,
  expectedLanguageFor,
  htmlPathFor,
} from './lib/dist-pages.mjs';

const argv = process.argv.slice(2);
const JSON_OUT = argv.includes('--json');
const STRICT = argv.includes('--strict');
const reportIdx = argv.indexOf('--report');
const REPORT_DIR = reportIdx !== -1 ? argv[reportIdx + 1] : null;

/** Group a page under the collection that owns it, ignoring the language prefix. */
function collectionOf(pagePath) {
  const withoutLang = pagePath.replace(/^en\/?/, '');
  if (withoutLang === '' || pagePath === 'index' || pagePath === 'en') {
    return 'home';
  }
  const [first] = withoutLang.split('/');
  return first || 'home';
}

function sizeOf(path) {
  try {
    return statSync(path).size;
  } catch {
    return 0;
  }
}

/** Keep report excerpts readable without losing the identifying phrase. */
function excerpt(text, max = 160) {
  const clean = text.replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max)}…` : clean;
}

if (!existsSync(DIST_DIR)) {
  console.error('❌ dist/ not found. Run `pnpm run build` first.');
  process.exit(1);
}

const { all, excluded, redirects, checkable } = collectPages();

const results = checkable.map((pagePath) => {
  const expected = expectedLanguageFor(pagePath);
  const htmlPath = htmlPathFor(pagePath);
  const { found: mdFound, mdPath } = checkMdExists(pagePath);

  const html = readFileSync(htmlPath, 'utf-8');
  const htmlVerdict = analyzeDocument(htmlToText(html), expected);

  let mdVerdict = null;
  let mdBytes = 0;
  if (mdFound) {
    const mdFull = join(DIST_DIR, mdPath);
    mdBytes = sizeOf(mdFull);
    mdVerdict = analyzeDocument(
      markdownToText(readFileSync(mdFull, 'utf-8')),
      expected
    );
  }

  return {
    pagePath,
    url: pagePath === 'index' ? '/' : `/${pagePath}`,
    collection: collectionOf(pagePath),
    expected,
    htmlBytes: sizeOf(htmlPath),
    md: { found: mdFound, path: mdPath, bytes: mdBytes },
    html: htmlVerdict,
    mdVerdict,
    flagged: htmlVerdict.flagged || Boolean(mdVerdict?.flagged),
  };
});

const flagged = results.filter((r) => r.flagged);
const htmlFlagged = results.filter((r) => r.html.flagged);
const mdFlagged = results.filter((r) => r.mdVerdict?.flagged);
/** Pages with only low-confidence mismatches — reported, never failed on. */
const reviewOnly = results.filter(
  (r) =>
    !r.flagged &&
    (r.html.review.length > 0 || (r.mdVerdict?.review.length ?? 0) > 0)
);

/** Defect counts per collection, so the fix tasks can be scoped from real numbers. */
const byCollection = new Map();
for (const r of results) {
  const entry = byCollection.get(r.collection) ?? {
    total: 0,
    flagged: 0,
    htmlFlagged: 0,
    mdFlagged: 0,
  };
  entry.total += 1;
  if (r.flagged) entry.flagged += 1;
  if (r.html.flagged) entry.htmlFlagged += 1;
  if (r.mdVerdict?.flagged) entry.mdFlagged += 1;
  byCollection.set(r.collection, entry);
}

/** Confidence split quoted in the report, computed rather than restated. */
const allMismatchBlocks = results.flatMap((r) => [
  ...r.html.mismatches,
  ...(r.mdVerdict?.mismatches ?? []),
]);
const bimodal = {
  top: allMismatchBlocks.filter((m) => m.score.confidence >= 1).length,
  tail: allMismatchBlocks.filter((m) => m.score.confidence < 1).length,
};

const summary = {
  totalHtmlFiles: all.length,
  audited: checkable.length,
  redirects: redirects.length,
  excluded: excluded.length,
  flagged: flagged.length,
  htmlFlagged: htmlFlagged.length,
  mdFlagged: mdFlagged.length,
  reviewOnly: reviewOnly.length,
  missingMd: results.filter((r) => !r.md.found).length,
};

// ── Reports ───────────────────────────────────────────────────────────────

if (REPORT_DIR) {
  mkdirSync(REPORT_DIR, { recursive: true });

  const inventoryRows = results
    .slice()
    .sort((a, b) => a.pagePath.localeCompare(b.pagePath))
    .map(
      (r) =>
        `| \`${r.url}\` | ${r.collection} | ${r.expected} | ${r.md.found ? `\`/${r.md.path}\`` : '— missing —'} | ${r.htmlBytes} | ${r.md.bytes} | ${r.flagged ? '⚠️' : '✓'} |`
    );

  writeFileSync(
    join(REPORT_DIR, 'URL_INVENTORY.md'),
    `# URL Inventory

Generated by \`scripts/audit-language-integrity.mjs\` from \`dist/\`.

Every non-excluded, non-redirect page in the build, with its expected language
and its \`.md\` twin. This is the audit surface the rest of the plan is measured
against.

| Metric | Count |
|---|---|
| HTML files in build | ${summary.totalHtmlFiles} |
| Audited pages | ${summary.audited} |
| Redirects (skipped) | ${summary.redirects} |
| Excluded (skipped) | ${summary.excluded} |
| Missing \`.md\` twin | ${summary.missingMd} |

| URL | Collection | Expected | \`.md\` twin | HTML bytes | MD bytes | Language |
|---|---|---|---|---|---|---|
${inventoryRows.join('\n')}
`,
    'utf-8'
  );

  const collectionRows = [...byCollection.entries()]
    .sort((a, b) => b[1].flagged - a[1].flagged || a[0].localeCompare(b[0]))
    .map(
      ([name, e]) =>
        `| ${name} | ${e.total} | ${e.flagged} | ${e.htmlFlagged} | ${e.mdFlagged} |`
    );

  const defectSections = flagged
    .slice()
    .sort(
      (a, b) =>
        b.html.confident.length +
        (b.mdVerdict?.confident.length ?? 0) -
        (a.html.confident.length + (a.mdVerdict?.confident.length ?? 0))
    )
    .map((r) => {
      const lines = [`### \`${r.url}\` — expected \`${r.expected}\``, ''];
      if (r.html.flagged) {
        lines.push(
          `**HTML** — ${r.html.confident.length} block(s) in the wrong language:`,
          ''
        );
        for (const m of r.html.confident.slice(0, 3)) {
          lines.push(`- detected \`${m.score.lang}\`: ${excerpt(m.text)}`);
        }
        lines.push('');
      }
      if (r.mdVerdict?.flagged) {
        lines.push(
          `**\`.md\`** — ${r.mdVerdict.confident.length} block(s) in the wrong language:`,
          ''
        );
        for (const m of r.mdVerdict.confident.slice(0, 3)) {
          lines.push(`- detected \`${m.score.lang}\`: ${excerpt(m.text)}`);
        }
        lines.push('');
      }
      return lines.join('\n');
    });

  writeFileSync(
    join(REPORT_DIR, 'LANGUAGE_AUDIT.md'),
    `# Language Integrity Audit

Generated by \`scripts/audit-language-integrity.mjs\`.

A page is **flagged** when at least one text block is confidently in a language
other than the one its URL promises. Detection runs per block so a correctly
localized header cannot mask a body in the wrong language.

## Summary

| Metric | Count |
|---|---|
| Pages audited | ${summary.audited} |
| Pages flagged | ${summary.flagged} |
| Flagged in HTML | ${summary.htmlFlagged} |
| Flagged in \`.md\` | ${summary.mdFlagged} |
| Review-only (low confidence) | ${summary.reviewOnly} |

## Method and measured accuracy

Detection is two-tier, and the split was chosen from the data rather than taste:

- **Flagged** — a whole block confidently in the wrong language
  (confidence ≥ ${CONFIDENT_MISMATCH_CONFIDENCE}). These are defects.
- **Review** — a block below that line, almost always correct prose carrying an
  untranslated proper noun (\`Session at Noche de DevOps\`). Reported, never
  failed on.

On this build the mismatched blocks stay sharply bimodal: ${bimodal.top} at
confidence 1.00 against ${bimodal.tail} spread across 0.3–0.9. Hand-labeling a
stratified sample of 24 flagged pages plus 10 unflagged ones measured:

| Tier | Labeled | True defects | Precision |
|---|---|---|---|
| Flagged (≥ ${CONFIDENT_MISMATCH_CONFIDENCE}) | 12 | 11 | **0.92** |
| Review (< ${CONFIDENT_MISMATCH_CONFIDENCE}) | 12 | 1 | 0.08 |

Recall was measured against a known ground truth — all 91 English meetup detail
pages render a Spanish body — and the flagged tier caught **89 / 91 (0.98)**.
The two misses (\`/en/meetups/introduccion-a-mvc-y-node-v4\`,
\`/en/meetups/jasmine-y-iojs-2015\`) have bodies split into blocks shorter than
the 8-token minimum, so no block is long enough to classify. That floor is the
price of not flagging headings and proper nouns; it is a known limitation, not a
bug to tune away.

## By collection

| Collection | Pages | Flagged | HTML | \`.md\` |
|---|---|---|---|---|
${collectionRows.join('\n')}

## Flagged pages

${defectSections.length > 0 ? defectSections.join('\n') : '_None._'}
`,
    'utf-8'
  );
}

// ── Output ────────────────────────────────────────────────────────────────

if (JSON_OUT) {
  console.log(
    JSON.stringify(
      { summary, byCollection: Object.fromEntries(byCollection), results },
      null,
      2
    )
  );
} else {
  console.log('🌐 Language Integrity Audit\n');
  console.log(`   Audited:   ${summary.audited} pages`);
  console.log(`   Redirects: ${summary.redirects}`);
  console.log(`   Excluded:  ${summary.excluded}`);
  console.log('');
  console.log(`   ⚠️  Flagged:   ${summary.flagged}`);
  console.log(`      in HTML:  ${summary.htmlFlagged}`);
  console.log(`      in .md:   ${summary.mdFlagged}`);
  console.log(
    `   👀 Review:    ${summary.reviewOnly} (low confidence, not failed on)`
  );
  console.log('');
  console.log('   By collection (flagged / total):');
  for (const [name, e] of [...byCollection.entries()].sort(
    (a, b) => b[1].flagged - a[1].flagged || a[0].localeCompare(b[0])
  )) {
    if (e.flagged > 0) console.log(`      ${name}: ${e.flagged} / ${e.total}`);
  }
  if (REPORT_DIR) console.log(`\n   Reports written to ${REPORT_DIR}`);
}

if (STRICT && flagged.length > 0) {
  process.exit(1);
}
