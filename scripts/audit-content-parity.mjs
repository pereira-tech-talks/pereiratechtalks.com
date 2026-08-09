/**
 * Bilingual Content-Parity Audit
 *
 * Asks the one question the other three gates do not: do the Spanish and English
 * versions of the same entry carry the **same content**?
 *
 * `lang:check` proves each page is in the right language and `md:check` proves
 * each `.md` twin matches its own HTML page — so a Spanish body can gain a
 * paragraph its English sibling never gets, and every check stays green. That is
 * how 88 of 94 pairs drifted.
 *
 * Reads **source content**, not `dist/`: parity is a property of the authored
 * files, and catching it there means catching it before a build.
 *
 * Usage:
 *   node scripts/audit-content-parity.mjs                  # summary
 *   node scripts/audit-content-parity.mjs --strict         # exit 1 on defects
 *   node scripts/audit-content-parity.mjs --report <dir>   # write reports
 *
 * WHAT BLOCKS, AND WHY — each class earns its verdict separately, because a gate
 * that fails on judgement calls gets switched off:
 *
 *   content-loss    FAILS. A URL in one language and not the other is never
 *                   ambiguous: one set of readers loses a real source.
 *   structural      FAILS. Task 3 brought this to zero with no justified
 *                   survivors, so any new one is a regression, not a backlog.
 *   field-missing   FAILS. A bilingual field empty on one side is a blank page
 *                   for those readers.
 *   field-pointer   FAILS. A field saying "see the Spanish abstract" is not a
 *                   translation. 18 talk abstracts shipped this way.
 *   thin-both       NEVER FAILS. Both languages are equally short — an archive
 *                   gap, not a parity defect, and 18 pairs have no repo source
 *                   to fix it from. Reported so the count stays visible.
 *   field-skew      NEVER FAILS. Above 1.5x a faithful translation and a
 *                   summary are indistinguishable; 13 of the 36 found were
 *                   correct Spanish expansion. It nominates, a human decides.
 *
 * Part of PLAN_bilingual_content_parity Task 1.
 */

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';

import YAML from 'yaml';

import {
  bilingualFields,
  blockingFindings,
  compareField,
  comparePair,
  FIELD_MIN_WORDS,
  FIELD_RATIO,
  summarize,
  THIN_WORD_FLOOR,
} from './lib/content-parity.mjs';

const argv = process.argv.slice(2);
const STRICT = argv.includes('--strict');
const reportIdx = argv.indexOf('--report');
const REPORT_DIR = reportIdx !== -1 ? argv[reportIdx + 1] : null;

/** Collections whose prose lives in a `{slug}.md` + `{slug}.en.md` pair. */
const PAIRED_COLLECTIONS = ['meetups', 'verticals'];

const CONTENT = join(process.cwd(), 'src', 'content');

function pairsIn(collection) {
  const dir = join(CONTENT, collection);
  if (!existsSync(dir)) return [];
  const files = readdirSync(dir).filter(
    (f) => f.endsWith('.md') && !f.startsWith('.')
  );
  return files
    .filter((f) => !f.endsWith('.en.md'))
    .map((f) => {
      const enName = f.replace(/\.md$/, '.en.md');
      return {
        id: `${collection}/${f}`,
        es: readFileSync(join(dir, f), 'utf-8'),
        en: files.includes(enName)
          ? readFileSync(join(dir, enName), 'utf-8')
          : null,
      };
    });
}

if (!existsSync(CONTENT)) {
  console.error('❌ src/content not found. Run from the repo root.');
  process.exit(1);
}

console.log('⚖️  Bilingual Content-Parity Audit\n');

const results = [];
for (const collection of PAIRED_COLLECTIONS) {
  for (const pair of pairsIn(collection)) {
    results.push(comparePair(pair));
  }
}

const s = summarize(results);

/**
 * Bodies are only half the surface. `talks.abstract`, `speakers.bio`,
 * `sponsors.description` and the rest are `{ en, es }` fields, and one of them
 * can be a summary of the other with every body still at parity — which is
 * exactly what 18 talk abstracts were.
 */
function scanFields() {
  const findings = [];
  const walk = (dir, collection) => {
    for (const name of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, name.name);
      if (name.isDirectory()) {
        walk(full, collection);
        continue;
      }
      if (!/\.(md|mdx|ya?ml|json)$/.test(name.name)) continue;
      const raw = readFileSync(full, 'utf-8');
      let data;
      try {
        if (/\.ya?ml$/.test(name.name)) data = YAML.parse(raw);
        else if (name.name.endsWith('.json')) data = JSON.parse(raw);
        else {
          const parts = raw.split(/^---[ \t]*$/m);
          if (parts.length < 3) continue;
          data = YAML.parse(parts[1]);
        }
      } catch {
        continue; // a parse failure is astro:check's job to report, not this gate's
      }
      const id = `${collection}/${name.name}`;
      for (const field of bilingualFields(data)) {
        const f = compareField({ id, ...field });
        if (f) findings.push(f);
      }
    }
  };
  for (const c of readdirSync(CONTENT, { withFileTypes: true })) {
    if (c.isDirectory()) walk(join(CONTENT, c.name), c.name);
  }
  return findings;
}

const fieldFindings = scanFields();
const fieldBy = (cls) => fieldFindings.filter((f) => f.class === cls);

console.log(`   Pairs audited:           ${s.pairs}`);
console.log(`   At parity:               ${s.identical}`);
console.log('');
console.log(
  `   ❌ content-loss:         ${s.byClass['content-loss']} finding(s) in ${s.files['content-loss']} file(s)`
);
console.log(
  `   ⚠️  structural:           ${s.byClass.structural} finding(s) in ${s.files.structural} file(s)`
);
console.log(
  `   👀 thin-both:            ${s.files['thin-both']} pair(s) under ${THIN_WORD_FLOOR} words on both sides`
);
console.log('');
console.log('   Bilingual fields across every collection:');
console.log(
  `   ❌ field-missing:        ${fieldBy('field-missing').length} field(s) empty in one language`
);
console.log(
  `   ❌ field-pointer:        ${fieldBy('field-pointer').length} field(s) referring the reader to the other language`
);
console.log(
  `   ⚠️  field-skew:           ${fieldBy('field-skew').length} field(s) beyond ${FIELD_RATIO}x (min ${FIELD_MIN_WORDS} words)`
);
console.log('');
for (const f of [
  ...fieldBy('field-missing'),
  ...fieldBy('field-pointer'),
].slice(0, 10)) {
  console.log(`     ✗ ${f.id} → ${f.path}: ${f.detail}`);
}
for (const f of fieldBy('field-skew').slice(0, 10)) {
  console.log(`     · ${f.id} → ${f.path}: ${f.detail}`);
}
if (fieldFindings.length > 0) console.log('');

const withLoss = results.filter((r) =>
  r.findings.some((f) => f.class === 'content-loss')
);
if (withLoss.length > 0) {
  console.log('   Content lost in one language:\n');
  for (const r of withLoss.slice(0, 12)) {
    console.log(`     ${r.id}`);
    for (const f of r.findings.filter((x) => x.class === 'content-loss')) {
      console.log(`        ✗ ${f.detail}`);
    }
  }
  if (withLoss.length > 12) {
    console.log(
      `     … and ${withLoss.length - 12} more file(s) — use --report`
    );
  }
  console.log('');
}

if (REPORT_DIR) {
  mkdirSync(REPORT_DIR, { recursive: true });

  const section = (cls, title, note) => {
    const rows = results.filter((r) => r.findings.some((f) => f.class === cls));
    const lines = [
      `## ${title}`,
      '',
      note,
      '',
      `**${rows.length} file(s).**`,
      '',
    ];
    for (const r of rows) {
      lines.push(`### \`${r.id}\``, '');
      for (const f of r.findings.filter((x) => x.class === cls)) {
        lines.push(`- ${f.detail}`);
      }
      lines.push('');
    }
    if (rows.length === 0) lines.push('None.', '');
    return lines.join('\n');
  };

  const report = [
    '# Bilingual Content-Parity Audit',
    '',
    'Generated by `scripts/audit-content-parity.mjs` from `src/content/`.',
    '',
    'A pair is **at parity** when neither language carries content the other',
    'lacks and the two share the same structure. `thin-both` does not count',
    'against parity — it is an archive-completeness gap present on both sides.',
    '',
    '| Metric | Count |',
    '|---|---|',
    `| Pairs audited | ${s.pairs} |`,
    `| At parity | ${s.identical} |`,
    `| Files with content loss | ${s.files['content-loss']} |`,
    `| Files with structural drift | ${s.files.structural} |`,
    `| Pairs thin on both sides | ${s.files['thin-both']} |`,
    '',
    section(
      'content-loss',
      'Content loss',
      'A URL present in one language and absent from the other. Always a defect — the reader of one language loses a real source the other gets.'
    ),
    section(
      'structural',
      'Structural drift',
      'Shape differs without content being lost. Cosmetic alone, but it makes the two languages render differently and it adds noise that hides real loss.'
    ),
    section(
      'thin-both',
      'Thin on both sides',
      `Under ${THIN_WORD_FLOOR} words in Spanish **and** English. Not a parity defect: these are archive stubs equally short in both languages. Enrichable only from material the repository already holds.`
    ),
  ].join('\n');

  writeFileSync(join(REPORT_DIR, 'PARITY_AUDIT.md'), `${report}\n`, 'utf-8');
  console.log(`   Report written to ${REPORT_DIR}\n`);
}

if (STRICT) {
  const blocking = blockingFindings({
    'content-loss': s.byClass['content-loss'],
    structural: s.byClass.structural,
    'field-missing': fieldBy('field-missing').length,
    'field-pointer': fieldBy('field-pointer').length,
  });

  if (blocking.length > 0) {
    console.log('❌ Content parity gate failed:');
    for (const [cls, n] of blocking) console.log(`     ${cls}: ${n}`);
    console.log('');
    console.log('💡 Content parity is documented in docs/I18N_GUIDE.md.');
    console.log('   Whatever one language carries, the other carries too.');
    console.log(
      `   thin-both (${s.files['thin-both']}) and field-skew (${fieldBy('field-skew').length}) are reported, not blocking.\n`
    );
    process.exit(1);
  }
}

if (
  s.byClass['content-loss'] === 0 &&
  s.byClass.structural === 0 &&
  fieldFindings.length === 0
) {
  console.log('✅ Every pair carries the same content in both languages.\n');
}
