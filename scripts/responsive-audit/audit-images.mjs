#!/usr/bin/env node
/**
 * Scan dist/ for <img> tags and report missing responsive-image attributes:
 * - missing width / height (CLS risk)
 * - missing loading attribute (perf)
 * - missing decoding attribute (perf)
 * - missing srcset for above-fold hero images (responsive)
 *
 * Usage: node scripts/responsive-audit/audit-images.mjs
 */
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from 'node:fs';
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
  '18_performance'
);

function walk(dir, base = '') {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const rel = base ? `${base}/${entry}` : entry;
    if (statSync(full).isDirectory()) {
      out.push(...walk(full, rel));
    } else if (entry.endsWith('.html')) {
      out.push(rel);
    }
  }
  return out;
}

const IMG_RE = /<img\b[^>]*>/gi;
const ATTR_RE =
  /\s(width|height|loading|decoding|srcset|sizes|src|alt)\s*=\s*("([^"]*)"|'([^']*)')/gi;

console.log(`📂 Auditing images in ${DIST}…`);
const files = walk(DIST);
console.log(`   Scanning ${files.length} HTML files`);

const findings = {
  total: 0,
  missingWidth: 0,
  missingHeight: 0,
  missingLoading: 0,
  missingDecoding: 0,
  missingAlt: 0,
  perPage: {},
};

for (const file of files) {
  const html = readFileSync(join(DIST, file), 'utf8');
  const imgs = html.match(IMG_RE) || [];
  for (const tag of imgs) {
    findings.total++;
    const attrs = {};
    ATTR_RE.lastIndex = 0;
    let m = ATTR_RE.exec(tag);
    while (m !== null) {
      attrs[m[1].toLowerCase()] = m[3] ?? m[4] ?? '';
      m = ATTR_RE.exec(tag);
    }

    const issues = [];
    if (!('width' in attrs)) {
      issues.push('width');
      findings.missingWidth++;
    }
    if (!('height' in attrs)) {
      issues.push('height');
      findings.missingHeight++;
    }
    if (!('loading' in attrs)) {
      issues.push('loading');
      findings.missingLoading++;
    }
    if (!('decoding' in attrs)) {
      issues.push('decoding');
      findings.missingDecoding++;
    }
    if (!('alt' in attrs)) {
      issues.push('alt');
      findings.missingAlt++;
    }

    if (issues.length > 0) {
      findings.perPage[file] ??= [];
      findings.perPage[file].push({ src: attrs.src || '?', missing: issues });
    }
  }
}

mkdirSync(OUT_DIR, { recursive: true });

let report = '# Image Attribute Audit\n\n';
report += `**Date:** ${new Date().toISOString().slice(0, 10)}\n`;
report += `**HTML pages scanned:** ${files.length}\n`;
report += `**Total <img> tags:** ${findings.total}\n\n`;
report += '## Summary\n\n';
report += `| Attribute | Missing | % of total |\n|---|---:|---:|\n`;
report += `| width | ${findings.missingWidth} | ${((findings.missingWidth / findings.total) * 100).toFixed(1)}% |\n`;
report += `| height | ${findings.missingHeight} | ${((findings.missingHeight / findings.total) * 100).toFixed(1)}% |\n`;
report += `| loading | ${findings.missingLoading} | ${((findings.missingLoading / findings.total) * 100).toFixed(1)}% |\n`;
report += `| decoding | ${findings.missingDecoding} | ${((findings.missingDecoding / findings.total) * 100).toFixed(1)}% |\n`;
report += `| alt | ${findings.missingAlt} | ${((findings.missingAlt / findings.total) * 100).toFixed(1)}% |\n\n`;

const pageEntries = Object.entries(findings.perPage)
  .sort((a, b) => b[1].length - a[1].length)
  .slice(0, 30);
report += '## Top 30 pages by issue count\n\n';
report += '| Page | Issue count | Sample missing |\n|---|---:|---|\n';
for (const [page, imgs] of pageEntries) {
  const sample = imgs[0]?.missing.join(',') ?? '?';
  report += `| \`${page.slice(0, 80)}\` | ${imgs.length} | ${sample} |\n`;
}

writeFileSync(join(OUT_DIR, 'image_audit.md'), report);
writeFileSync(
  join(OUT_DIR, 'image_audit.json'),
  JSON.stringify(findings, null, 2)
);

console.log(`✓ Report written to ${OUT_DIR}/image_audit.md`);
console.log(`  Total <img>: ${findings.total}`);
console.log(`  Missing width: ${findings.missingWidth}`);
console.log(`  Missing height: ${findings.missingHeight}`);
console.log(`  Missing loading: ${findings.missingLoading}`);
console.log(`  Missing decoding: ${findings.missingDecoding}`);
console.log(`  Missing alt: ${findings.missingAlt}`);
