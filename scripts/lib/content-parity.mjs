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

/**
 * A content file's body — everything after the frontmatter fence.
 *
 * The fence pattern matches only spaces and tabs after the dashes, never `\s`:
 * `\s` matches newlines too, so `/^---\s*$/m` swallowed the blank line that
 * follows a horizontal rule inside the body. That fused `---` and the heading
 * after it into one block, so a Spanish body carrying a rule counted one
 * paragraph fewer than the identically-shaped English one — the scanner
 * inventing the drift it was built to find.
 */
export function bodyOf(raw) {
  if (!raw.trimStart().startsWith('---')) return raw;
  const parts = raw.split(/^---[ \t]*$/m);
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

// ── Bilingual fields ──────────────────────────────────────

/**
 * Spanish runs longer than English for the same content — articles, prepositions
 * and compound verbs add roughly 15–25%. A symmetric 1.5x ratio therefore sits
 * above normal translation expansion in either direction, so what it catches is
 * a summary standing in for a translation rather than ordinary language drift.
 */
export const FIELD_RATIO = 1.5;

/**
 * Short strings make ratios meaningless: a four-word title against a seven-word
 * one is 1.75x and perfectly translated. Only compare once the longer side
 * carries enough words for the ratio to mean something.
 */
export const FIELD_MIN_WORDS = 12;

/**
 * An English field that tells the reader to go and read the Spanish one is not a
 * translation, however long it is. This shape shipped in 18 talk abstracts.
 */
const POINTER =
  /\b(?:see|consulta|ver)\b[^.]{0,40}\b(?:spanish|english|español|inglés)\b[^.]{0,40}\b(?:abstract|description|resumen|descripción)/i;

const words = (s) =>
  typeof s === 'string' ? s.trim().split(/\s+/).filter(Boolean).length : 0;

/**
 * Walk a parsed entry and yield every `{ en, es }` string pair with its path.
 * Bilingual fields are shaped this way throughout `src/content.config.ts`.
 */
export function* bilingualFields(node, path = []) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const [i, v] of node.entries())
      yield* bilingualFields(v, [...path, i]);
    return;
  }
  const hasPair =
    ('en' in node || 'es' in node) &&
    [node.en, node.es].every((v) => v === undefined || typeof v === 'string');
  if (hasPair && (node.en !== undefined || node.es !== undefined)) {
    yield { path: path.join('.') || '(root)', en: node.en, es: node.es };
  }
  for (const [k, v] of Object.entries(node)) {
    if (k === 'en' || k === 'es') continue;
    yield* bilingualFields(v, [...path, k]);
  }
}

/** Compare one bilingual field. Returns a finding, or null when it is sound. */
export function compareField({ id, path, en, es }) {
  const at = { id, path };
  const missing = (v) => v === undefined || v === null || v.trim() === '';
  if (missing(en) && missing(es)) return null;
  if (missing(en))
    return { ...at, class: 'field-missing', detail: 'English is empty' };
  if (missing(es))
    return { ...at, class: 'field-missing', detail: 'Spanish is empty' };
  if (POINTER.test(en))
    return {
      ...at,
      class: 'field-pointer',
      detail:
        'English refers the reader to the Spanish text instead of translating it',
    };
  if (POINTER.test(es))
    return {
      ...at,
      class: 'field-pointer',
      detail:
        'Spanish refers the reader to the English text instead of translating it',
    };
  const we = words(en);
  const ws = words(es);
  if (Math.max(we, ws) < FIELD_MIN_WORDS) return null;
  const ratio = we > ws ? we / ws : ws / we;
  if (ratio >= FIELD_RATIO)
    return {
      ...at,
      class: 'field-skew',
      detail: `ES ${ws}w vs EN ${we}w (${ratio.toFixed(2)}x)`,
    };
  return null;
}

// ── Gate policy ───────────────────────────────────────────

/**
 * Which finding classes fail a build.
 *
 * Kept here rather than inline in the runner so the policy is unit-testable and
 * so there is one place to read it. A gate that fails on judgement calls gets
 * switched off, so only the unambiguous classes block:
 *
 *   blocking     — one language is missing something the other has, with no
 *                  interpretation required.
 *   reporting    — real information, but acting on it needs a person.
 */
export const BLOCKING_CLASSES = Object.freeze([
  'content-loss',
  'structural',
  'field-missing',
  'field-pointer',
]);

export const REPORTING_CLASSES = Object.freeze(['thin-both', 'field-skew']);

/** The classes, with counts, that should fail the build. `[]` means pass. */
export function blockingFindings(counts) {
  return BLOCKING_CLASSES.map((cls) => [cls, counts[cls] ?? 0]).filter(
    ([, n]) => n > 0
  );
}
