/**
 * Markdown-for-Agents Parity Check
 *
 * Verifies that every HTML page in the build has a `.md` twin, that the twin is
 * a complete equivalent of the page rather than a summary, and that it is in the
 * language its URL promises.
 *
 * Before Task 9 of PLAN_sitewide_language_seo_aeo_audit this reported
 * "480/480 pages (100%)" while the sampled `.md` was missing talk titles,
 * speaker names, sponsor names, hero, venue and CTAs. The number was true and
 * meaningless: it counted files, not content. That is why the defect survived.
 *
 * Usage:
 *   node scripts/check-md-parity.mjs           # advisory
 *   node scripts/check-md-parity.mjs --strict  # exit 1 on failures (CI)
 *   node scripts/check-md-parity.mjs --existence-only
 *
 * How it works:
 *   1. Scans dist/ for all index.html files (= rendered HTML pages)
 *   2. EXISTENCE   — a `.md` twin exists at the expected path
 *   3. COMPLETENESS — required sections per page type, no bare slug rows, a
 *      well-formed front block, exactly one Site Navigation block, and content
 *      coverage above the page type's floor (./lib/md-completeness.mjs)
 *   4. LANGUAGE    — the `.md` body classifies as the language its URL promises,
 *      using the same classifier as scripts/audit-language-integrity.mjs
 *
 * Page discovery, redirect detection, and the exclusion list live in
 * ./lib/dist-pages.mjs, shared with scripts/audit-language-integrity.mjs.
 *
 * Excluded paths (intentionally have no .md counterpart):
 *   - /internal/*    — dev-only pages, already excluded from prod build
 *   - /404           — error page
 *   - /api/*         — JSON/text API endpoints
 *   - /rss.xml       — RSS feed
 *   - /.well-known/* — agent-readiness endpoints (api-catalog, mcp/*, etc.)
 *   - /blog/page/*   — pagination pages
 *   - /blog/tag/*    — tag listing pages
 *   - /_astro/*      — Astro asset bundle directory
 *   - /images/*      — static image assets
 */

import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { analyzeDocument, markdownToText } from '../src/lib/language-detect.ts';
import {
  checkMdExists,
  collectPages,
  DIST_DIR,
  expectedLanguageFor,
  htmlPathFor,
} from './lib/dist-pages.mjs';
import { CONTRACT_TARGET, evaluatePage } from './lib/md-completeness.mjs';

const STRICT = process.argv.includes('--strict');
const EXISTENCE_ONLY = process.argv.includes('--existence-only');

// ── Main ──────────────────────────────────────────────────

if (!existsSync(DIST_DIR)) {
  console.error('❌ dist/ directory not found. Run `pnpm run build` first.');
  process.exit(1);
}

console.log('🔍 Markdown-for-Agents Parity Check\n');

const {
  all: allPages,
  excluded: excludedPages,
  redirects: redirectPages,
  checkable: checkablePages,
} = collectPages();

const results = checkablePages.map((pagePath) => ({
  pagePath,
  ...checkMdExists(pagePath),
}));

const covered = results.filter((r) => r.found);
const missing = results.filter((r) => !r.found);

// Split missing by language for a readable report
const missingEn = missing.filter((m) => !m.pagePath.startsWith('es/'));
const missingEs = missing.filter((m) => m.pagePath.startsWith('es/'));

if (missing.length > 0) {
  console.log(`❌ Missing .md files (${missing.length}):\n`);

  if (missingEn.length > 0) {
    console.log(`  EN (${missingEn.length}):`);
    for (const m of missingEn.sort((a, b) =>
      a.pagePath.localeCompare(b.pagePath)
    )) {
      console.log(`    ${m.pagePath} → expected: ${m.mdPath}`);
    }
    console.log('');
  }

  if (missingEs.length > 0) {
    console.log(`  ES (${missingEs.length}):`);
    for (const m of missingEs.sort((a, b) =>
      a.pagePath.localeCompare(b.pagePath)
    )) {
      console.log(`    ${m.pagePath} → expected: ${m.mdPath}`);
    }
    console.log('');
  }
}

// ── Completeness + language ───────────────────────────────

const failures = [];
const warnings = [];
let measuredPages = 0;
let coverageSum = 0;

if (!EXISTENCE_ONLY) {
  for (const result of covered) {
    const html = readFileSync(htmlPathFor(result.pagePath, DIST_DIR), 'utf-8');
    const markdown = readFileSync(join(DIST_DIR, result.mdPath), 'utf-8');
    const expected = expectedLanguageFor(result.pagePath);

    const verdict = evaluatePage({
      pagePath: result.pagePath,
      html,
      markdown,
      expectedLanguage: expected,
    });

    // Language: the same block-level classifier the audit script uses, so the
    // two cannot disagree about what counts as a mismatch.
    // `confident` is the defect tier; `review` is prose carrying an
    // untranslated proper noun and is never failed on — the same split the
    // audit script reports.
    const language = analyzeDocument(markdownToText(markdown), expected);
    if (language.flagged) {
      const worst = language.confident[0];
      verdict.errors.push(
        `body classifies as "${worst.score.lang}" on a "${expected}" page: ` +
          `"${worst.text.slice(0, 120)}"`
      );
    }

    if (verdict.measured) {
      measuredPages += 1;
      coverageSum += verdict.ratio;
    }
    if (verdict.errors.length > 0) failures.push(verdict);
    if (verdict.warnings.length > 0) warnings.push(verdict);
  }

  if (failures.length > 0) {
    console.log(
      `❌ Incomplete or wrong-language .md files (${failures.length}):\n`
    );
    for (const verdict of failures.sort((a, b) =>
      a.pagePath.localeCompare(b.pagePath)
    )) {
      console.log(`  /${verdict.pagePath}  [${verdict.type}]`);
      for (const error of verdict.errors) console.log(`      ✗ ${error}`);
    }
    console.log('');
  }

  if (warnings.length > 0) {
    console.log(
      `⚠️  Under the ${CONTRACT_TARGET} contract target but above their floor (${warnings.length}):\n`
    );
    for (const verdict of warnings.sort((a, b) => a.ratio - b.ratio)) {
      console.log(`  ${verdict.ratio.toFixed(3)}  /${verdict.pagePath}`);
    }
    console.log('');
  }
}

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(
  `📊 Coverage: ${covered.length}/${checkablePages.length} pages (${Math.round((covered.length / checkablePages.length) * 100)}%)`
);
console.log(`   ✅ Covered:   ${covered.length}`);
console.log(`   ❌ Missing:   ${missing.length}`);
console.log(`   🔀 Redirects: ${redirectPages.length}`);
console.log(`   ⏭️  Excluded:  ${excludedPages.length}`);
console.log(`   📄 Total:     ${allPages.length} HTML pages`);
if (!EXISTENCE_ONLY) {
  const mean = measuredPages > 0 ? coverageSum / measuredPages : 1;
  console.log(
    `   🧩 Complete:  ${covered.length - failures.length}/${covered.length}`
  );
  console.log(
    `   📈 Mean coverage: ${mean.toFixed(3)} over ${measuredPages} measured pages`
  );
  console.log(`   ⚠️  Warnings:  ${warnings.length}`);
}
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

if (failures.length > 0 && STRICT) {
  console.log(
    '\n💡 The contract is docs/aeo/MARKDOWN_FOR_AGENTS.md. Required sections and'
  );
  console.log('   coverage floors live in scripts/lib/md-completeness.mjs.\n');
  process.exit(1);
}

if (missing.length > 0 && STRICT) {
  console.log(
    '\n💡 To fix: add .md endpoints in src/pages/ or src/content/pages/{en,es}/'
  );
  console.log('   Blog posts auto-generate via src/pages/blog/[slug].md.ts');
  console.log(
    '   Static pages use src/content/pages/{en,es}/*.md + src/pages/*.md.ts\n'
  );
  process.exit(1);
}

if (missing.length === 0 && failures.length === 0) {
  console.log(
    EXISTENCE_ONLY
      ? '\n✅ All HTML pages have corresponding .md files!\n'
      : '\n✅ Every page has a complete .md twin in the right language.\n'
  );
}
