/**
 * Bilingual content-parity comparison.
 *
 * The three existing gates each answer a different question, and none of them
 * answers this one:
 *
 *   `lang:check`   — is this page in the language its URL promises?
 *   `md:check`     — is this `.md` twin complete against its own HTML page?
 *   `seo:check`    — is this URL's metadata correct?
 *   **this**       — do the Spanish and English versions of the same entry
 *                    carry the same content?
 *
 * That gap is how 88 of 94 body pairs drifted while every check stayed green.
 *
 * Split from the runner so the comparison is unit-testable without walking the
 * content tree. Part of PLAN_bilingual_content_parity Task 1.
 */

// ── Extraction ────────────────────────────────────────────

/** A content file's body — everything after the frontmatter fence. */
export function bodyOf(raw) {
  if (!raw.trimStart().startsWith('---')) return raw;
  const parts = raw.split(/^---\s*$/m);
  return parts.length >= 3 ? parts.slice(2).join('---') : raw;
}

/** Code fences are copied verbatim between languages; never compare inside them. */
const withoutCode = (md) =>
  md.replace(/```[\s\S]*?```/g, '').replace(/~~~[\s\S]*?~~~/g, '');

/**
 * Every URL a body links or mentions.
 *
 * Trailing punctuation is stripped because archive bodies wrote things like
 * `…/git_github.html**` — the asterisks are stray markdown, not part of the URL,
 * and leaving them in makes the same link look different across languages.
 */
export function urlsOf(md) {
  const found = withoutCode(md).match(/https?:\/\/[^\s)\]<>"']+/g) ?? [];
  return new Set(found.map((u) => u.replace(/[*_.,;:]+$/, '')));
}

/** Structural shape, for comparing two bodies without reading them. */
export function shapeOf(md) {
  const text = withoutCode(md);
  return {
    words: text.split(/\s+/).filter(Boolean).length,
    h2: (text.match(/^## /gm) ?? []).length,
    h3: (text.match(/^### /gm) ?? []).length,
    listItems: (text.match(/^\s*(?:[-*+]|\d+\.)\s+/gm) ?? []).length,
    links: (text.match(/\]\([^)]+\)/g) ?? []).length,
    images: (text.match(/!\[[^\]]*\]\(/g) ?? []).length,
    blockquotes: (text.match(/^>\s/gm) ?? []).length,
    rules: (text.match(/^---\s*$/gm) ?? []).length,
    paragraphs: text
      .trim()
      .split(/\n\s*\n/)
      .filter((b) => b.trim()).length,
  };
}

// ── Thresholds ────────────────────────────────────────────

/**
 * Below this many words, a pair is "thin" — short on **both** sides, which is an
 * archive-completeness problem rather than a parity one. Set at 80 from the
 * measured distribution: the 52 pairs under it are 37–93 words and their Spanish
 * originals are equally short (`webassembly-2015` is 37 words in both), while
 * everything above it carries a real recap.
 */
export const THIN_WORD_FLOOR = 80;

/**
 * Section labels are **deliberately** different per language — a previous plan
 * made them so, and reporting them as drift would train readers to ignore this
 * scanner. `### Fuentes` is the correct Spanish counterpart of `### Sources`.
 */
const EQUIVALENT_LABELS = [
  ['fuentes', 'sources'],
  ['charlas', 'talks'],
  ['ponente', 'speaker'],
  ['ponentes', 'speakers'],
  ['rol', 'role'],
  ['lugar', 'venue'],
  ['galería', 'gallery'],
];

/** True when two headings are the same section in the two languages. */
export function isEquivalentLabel(es, en) {
  const norm = (s) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]/g, '');
  const a = norm(es);
  const b = norm(en);
  if (a === b) return true;
  return EQUIVALENT_LABELS.some(([x, y]) => {
    const nx = norm(x);
    const ny = norm(y);
    return (a === nx && b === ny) || (a === ny && b === nx);
  });
}

// ── Comparison ────────────────────────────────────────────

/**
 * Compare one ES/EN body pair.
 *
 * Returns findings in three classes, deliberately separated because they call
 * for different responses and, in Task 7, different gate behaviour:
 *
 *   `content-loss` — a URL exists in one language and not the other. Never
 *                    ambiguous, always a defect.
 *   `structural`   — shape differs without losing content.
 *   `thin-both`    — both sides under the floor. Not a parity defect.
 */
export function comparePair({ id, es, en }) {
  const findings = [];
  const push = (cls, detail) => findings.push({ id, class: cls, detail });

  if (en === null || en === undefined) {
    push('content-loss', 'no English body sibling exists');
    return { id, findings, shape: null };
  }

  const esBody = bodyOf(es);
  const enBody = bodyOf(en);
  const esUrls = urlsOf(esBody);
  const enUrls = urlsOf(enBody);

  for (const url of esUrls) {
    if (!enUrls.has(url)) push('content-loss', `only in ES: ${url}`);
  }
  for (const url of enUrls) {
    if (!esUrls.has(url)) push('content-loss', `only in EN: ${url}`);
  }

  const a = shapeOf(esBody);
  const b = shapeOf(enBody);
  for (const key of [
    'h2',
    'h3',
    'listItems',
    'links',
    'images',
    'blockquotes',
    'rules',
    'paragraphs',
  ]) {
    if (a[key] !== b[key]) {
      push('structural', `${key}: ES ${a[key]} vs EN ${b[key]}`);
    }
  }

  if (a.words < THIN_WORD_FLOOR && b.words < THIN_WORD_FLOOR) {
    push('thin-both', `ES ${a.words} words, EN ${b.words} words`);
  }

  return { id, findings, shape: { es: a, en: b } };
}

/** Roll findings up by class. */
export function summarize(results) {
  const byClass = { 'content-loss': 0, structural: 0, 'thin-both': 0 };
  let identical = 0;
  for (const r of results) {
    const real = r.findings.filter((f) => f.class !== 'thin-both');
    if (real.length === 0) identical += 1;
    for (const f of r.findings) byClass[f.class] = (byClass[f.class] ?? 0) + 1;
  }
  const files = {};
  for (const cls of Object.keys(byClass)) {
    files[cls] = results.filter((r) =>
      r.findings.some((f) => f.class === cls)
    ).length;
  }
  return { pairs: results.length, identical, byClass, files };
}
