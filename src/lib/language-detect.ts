/**
 * Language detection for the sitewide language-integrity audit.
 *
 * Spanish is the primary language (served at `/`) and English is first-class
 * (`/en`), so a page leaking the wrong language is a content defect. This module
 * is the classifier behind `scripts/audit-language-integrity.mjs`.
 *
 * The approach is a transparent stopword + diacritic score rather than a
 * dependency: the corpus is small, the two languages are far apart lexically,
 * and a heuristic we can read and tune beats a black box we cannot explain when
 * it flags a page.
 *
 * Detection runs **per block**, not per document. A page's chrome (header, nav,
 * footer) is correctly localized even when its body is not, so a document-level
 * verdict would average the defect away. Blocks give both a verdict and a
 * location to point at.
 *
 * Pure module — no imports, so `node` can strip its types and load it directly
 * from the audit script while Vitest tests the same code path.
 */

export type DetectedLanguage = 'en' | 'es' | 'unknown';

/**
 * High-frequency Spanish function words. Chosen to be *discriminative*: tokens
 * that also occur in English (`no`, `a`, `son`, `o`, `me`) are deliberately
 * excluded, because scoring them would penalize correct English pages.
 */
const ES_STOPWORDS = new Set([
  'el',
  'la',
  'los',
  'las',
  'un',
  'una',
  'unos',
  'unas',
  'de',
  'del',
  'al',
  'en',
  'con',
  'por',
  'para',
  'sin',
  'sobre',
  'entre',
  'hasta',
  'desde',
  'durante',
  'según',
  'tras',
  'que',
  'qué',
  'quien',
  'quién',
  'cual',
  'cuál',
  'cuando',
  'cuándo',
  'donde',
  'dónde',
  'como',
  'cómo',
  'porque',
  'aunque',
  'pero',
  'sino',
  'es',
  'son',
  'era',
  'eran',
  'fue',
  'fueron',
  'ser',
  'está',
  'están',
  'estaba',
  'estamos',
  'somos',
  'hay',
  'haber',
  'tiene',
  'tienen',
  'tener',
  'hacer',
  'hace',
  'puede',
  'pueden',
  'debe',
  'deben',
  'su',
  'sus',
  'nuestro',
  'nuestra',
  'nuestros',
  'nuestras',
  'ellos',
  'ellas',
  'nos',
  'les',
  'lo',
  'se',
  'te',
  'ti',
  'más',
  'menos',
  'muy',
  'también',
  'tampoco',
  'ya',
  'aún',
  'todavía',
  'este',
  'esta',
  'estos',
  'estas',
  'ese',
  'esa',
  'esos',
  'esas',
  'todo',
  'toda',
  'todos',
  'todas',
  'otro',
  'otra',
  'otros',
  'otras',
  'mismo',
  'misma',
  'cada',
  'cualquier',
  'algunos',
  'algunas',
  'antes',
  'después',
  'siempre',
  'nunca',
  'aquí',
  'allí',
  'ahora',
  'entonces',
]);

/**
 * High-frequency English function words, filtered the same way: tokens that are
 * also common Spanish words are excluded.
 */
const EN_STOPWORDS = new Set([
  'the',
  'and',
  'or',
  'but',
  'if',
  'then',
  'than',
  'that',
  'this',
  'these',
  'those',
  'which',
  'while',
  'with',
  'without',
  'within',
  'about',
  'above',
  'below',
  'between',
  'through',
  'during',
  'before',
  'after',
  'again',
  'further',
  'here',
  'there',
  'where',
  'when',
  'what',
  'who',
  'whom',
  'whose',
  'why',
  'how',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'am',
  'have',
  'has',
  'had',
  'having',
  'do',
  'does',
  'did',
  'doing',
  'will',
  'would',
  'can',
  'could',
  'shall',
  'should',
  'may',
  'might',
  'must',
  'of',
  'to',
  'in',
  'into',
  'on',
  'onto',
  'at',
  'by',
  'from',
  'for',
  'as',
  'it',
  'its',
  'they',
  'them',
  'their',
  'we',
  'our',
  'ours',
  'you',
  'your',
  'yours',
  'he',
  'him',
  'his',
  'she',
  'her',
  'hers',
  'not',
  'only',
  'own',
  'same',
  'both',
  'each',
  'few',
  'more',
  'most',
  'other',
  'others',
  'some',
  'such',
  'any',
  'all',
  'every',
  'also',
  'just',
  'very',
  'too',
  'still',
  'always',
  'never',
  'get',
  'got',
  'make',
  'made',
  'take',
  'come',
  'go',
]);

/** Characters that occur in Spanish orthography and effectively never in English. */
const ES_DIACRITICS = /[ñáéíóúü¿¡]/i;

/** A block shorter than this cannot be classified responsibly. */
const MIN_BLOCK_TOKENS = 8;

/**
 * Minimum share of scored tokens before a verdict is trusted. Guards against
 * blocks that are mostly proper nouns, code, or numbers — the dominant
 * false-positive source.
 */
const MIN_SIGNAL_DENSITY = 0.06;

/** Minimum score separation before a verdict is trusted at all. */
const MIN_CONFIDENCE = 0.34;

/**
 * Separation required to call a mismatch a **defect** rather than something to
 * eyeball. Measured, not guessed: on the 2026-08-09 build the 713 mismatched
 * blocks are sharply bimodal — 579 sit at confidence 1.00 (the whole block is in
 * the other language) and the rest spread across 0.3–0.9 (an English sentence
 * carrying a Spanish event name, e.g. `Session at Noche de DevOps`).
 *
 * Hand-labeling 24 flagged pages put precision at 11/12 above this line and
 * 1/12 below it, so blocks under it are reported for review instead of failing
 * a build. See `analysis_results/LANGUAGE_AUDIT.md`.
 */
export const CONFIDENT_MISMATCH_CONFIDENCE = 0.9;

/**
 * Minimum *evidence* — not just one-sidedness — before a mismatch is a defect.
 *
 * `confidence` measures how lopsided the score is, so a block with a single
 * marker and nothing opposing it scores 1.00. That is how
 * `“Cracking the Coding Interview”: http://goo.gl/nBUkl` — an English book
 * title cited in a Spanish post — became a "confident" English mismatch on
 * `/blog/applying-for-software-engineering-at-google` off one stopword ("the")
 * in eight tokens.
 *
 * A paragraph genuinely written in the other language carries many markers. One
 * marker is a citation, a product name, or a borrowed term; it belongs in the
 * review tier, which is exactly what that tier is for.
 */
export const MIN_CONFIDENT_EVIDENCE = 2;

/** Weight for a word carrying Spanish-only orthography. */
const DIACRITIC_WEIGHT = 1.5;

/**
 * Share of capitalized words above which a block is treated as a name rather
 * than prose.
 *
 * Found while verifying Task 3: an English meetup page rendered its venue,
 * `Universidad Tecnológica de Pereira, Bloque 13, Sala Magistral 1`, as its own
 * block and scored a confident Spanish mismatch. Institution and room names are
 * proper nouns that must not be translated, and every venue on the site would
 * have produced the same false positive — enough to make Task 9's gate
 * unusable. Prose runs mostly lowercase; a name string runs mostly capitalized.
 */
const PROPER_NOUN_CAPITALIZATION_SHARE = 0.6;

export interface LanguageScore {
  lang: DetectedLanguage;
  /** Weighted Spanish evidence. */
  esScore: number;
  /** Weighted English evidence. */
  enScore: number;
  /** `|es - en| / (es + en)` — 0 when tied, 1 when one-sided. */
  confidence: number;
  /** Share of tokens that produced evidence either way. */
  density: number;
  tokenCount: number;
}

/**
 * Share of words after the first that begin with an uppercase letter.
 * Sentence-initial capitalization is excluded so ordinary prose scores ~0.
 */
export function capitalizedShare(text: string): number {
  const words = text
    .replace(/[^\p{L}\p{N}\s'-]+/gu, ' ')
    .split(/\s+/)
    .filter((word) => /\p{L}/u.test(word));
  if (words.length < 2) return 0;
  const rest = words.slice(1);
  const capitalized = rest.filter((word) => /^\p{Lu}/u.test(word)).length;
  return capitalized / rest.length;
}

/** Split text into comparable lowercase word tokens. */
/**
 * Uppercase language-code parentheticals — `(EN/ES)`, `(ES)`, `(EN, PT)`.
 *
 * These are metadata about language, not prose in one. Left in, `EN` and `ES`
 * lowercase into two of the strongest Spanish stopwords ("en", "es"), which is
 * enough to score a short English sentence as confidently Spanish: the
 * sentence "Diverse perspectives: gender, city, level, language (EN/ES),
 * industry." on `/en/call-for-speakers` scored es=2, en=0, confidence 1.00.
 */
const LANGUAGE_CODE_PARENTHETICAL =
  /\(\s*[A-Z]{2}(?:\s*[/,]\s*[A-Z]{2})*\s*\)/g;

export function tokenize(text: string): string[] {
  return text
    .replace(LANGUAGE_CODE_PARENTHETICAL, ' ')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s'-]+/gu, ' ')
    .split(/\s+/)
    .filter((token) => token.length > 0);
}

/**
 * Score a single text block. Returns `unknown` when the block is too short, too
 * sparse in function words, or too evenly balanced to call.
 */
export function detectLanguage(text: string): LanguageScore {
  const tokens = tokenize(text);
  let esScore = 0;
  let enScore = 0;
  let scored = 0;

  for (const token of tokens) {
    if (ES_STOPWORDS.has(token)) {
      esScore += 1;
      scored += 1;
    } else if (EN_STOPWORDS.has(token)) {
      enScore += 1;
      scored += 1;
    }
    // Spanish-only orthography is evidence on its own, and stacks with a
    // stopword hit (e.g. `también` is both).
    if (ES_DIACRITICS.test(token)) {
      esScore += DIACRITIC_WEIGHT;
      scored += 1;
    }
  }

  const tokenCount = tokens.length;
  const total = esScore + enScore;
  const density = tokenCount > 0 ? scored / tokenCount : 0;
  const confidence = total > 0 ? Math.abs(esScore - enScore) / total : 0;

  const undecidable =
    tokenCount < MIN_BLOCK_TOKENS ||
    total === 0 ||
    density < MIN_SIGNAL_DENSITY ||
    confidence < MIN_CONFIDENCE ||
    // A venue, an institution, or a person's name is not text in the wrong
    // language — it is a name, and names are not translated.
    capitalizedShare(text) >= PROPER_NOUN_CAPITALIZATION_SHARE;

  return {
    lang: undecidable ? 'unknown' : esScore > enScore ? 'es' : 'en',
    esScore,
    enScore,
    confidence,
    density,
    tokenCount,
  };
}

/**
 * Strip HTML to visible text while preserving block boundaries as newlines, so
 * a Spanish paragraph inside an English page stays its own analyzable unit.
 */
export function htmlToText(html: string): string {
  return (
    html
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<(script|style|svg|noscript|template)[\s\S]*?<\/\1>/gi, ' ')
      // Block-level boundaries become newlines before tags are dropped.
      .replace(
        /<\/(p|div|li|h[1-6]|section|article|header|footer|nav|td|th|tr|blockquote|figcaption|dd|dt)>/gi,
        '\n'
      )
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
      .replace(/[ \t]+/g, ' ')
  );
}

/**
 * Strip Markdown to prose. Code fences, inline code, URLs, and image targets are
 * removed because they are language-neutral and skew the token counts.
 */
export function markdownToText(markdown: string): string {
  return (
    markdown
      .replace(/```[\s\S]*?```/g, '\n')
      .replace(/~~~[\s\S]*?~~~/g, '\n')
      .replace(/`[^`\n]*`/g, ' ')
      // Markdown may embed raw HTML — Reveal decks do so heavily, including
      // `<!-- .slide: ... -->` directives. Markup is not prose: classifying a
      // `<figcaption>` or a CSS gradient as a language block produced a confident
      // mismatch on `/slides/demo-revealjs-features`. Inner text is kept.
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<\/?[a-z][^>]*>/gi, ' ')
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/^\s{0,3}(?:#{1,6}|[>*+-])\s+/gm, '')
      .replace(/https?:\/\/\S+/g, ' ')
      .replace(/[*_~]/g, '')
      .replace(/[ \t]+/g, ' ')
  );
}

/** Split extracted text into blocks worth classifying independently. */
export function splitIntoBlocks(text: string): string[] {
  return text
    .split(/\n+/)
    .map((block) => block.trim())
    .filter((block) => block.length > 0);
}

export interface BlockVerdict {
  text: string;
  score: LanguageScore;
}

export interface DocumentVerdict {
  expected: 'en' | 'es';
  /** Every block in a language other than `expected`, both tiers. */
  mismatches: BlockVerdict[];
  /**
   * Mismatches at or above `CONFIDENT_MISMATCH_CONFIDENCE` — whole blocks in the
   * wrong language. These are the defects.
   */
  confident: BlockVerdict[];
  /**
   * Mismatches below that line — usually correct prose carrying an untranslated
   * proper noun. Reported, never failed on.
   */
  review: BlockVerdict[];
  /** Blocks confidently in `expected`. */
  matched: number;
  /** Blocks that could not be classified (short, sparse, or balanced). */
  undecided: number;
  /** True when at least one block is a confident mismatch. */
  flagged: boolean;
}

/**
 * Classify a document block by block against the language its URL promises.
 *
 * `minMismatchTokens` raises the bar for what counts as a defect: a stray
 * Spanish institution name in an English sentence should not fail a page, but a
 * Spanish paragraph should.
 */
export function analyzeDocument(
  text: string,
  expected: 'en' | 'es',
  options: { minMismatchTokens?: number } = {}
): DocumentVerdict {
  const minMismatchTokens = options.minMismatchTokens ?? MIN_BLOCK_TOKENS;
  const mismatches: BlockVerdict[] = [];
  let matched = 0;
  let undecided = 0;

  for (const block of splitIntoBlocks(text)) {
    const score = detectLanguage(block);
    if (score.lang === 'unknown') {
      undecided += 1;
    } else if (score.lang === expected) {
      matched += 1;
    } else if (score.tokenCount >= minMismatchTokens) {
      mismatches.push({ text: block, score });
    } else {
      undecided += 1;
    }
  }

  const isConfident = (m: BlockVerdict): boolean =>
    m.score.confidence >= CONFIDENT_MISMATCH_CONFIDENCE &&
    Math.max(m.score.esScore, m.score.enScore) >= MIN_CONFIDENT_EVIDENCE;

  const confident = mismatches.filter(isConfident);
  const review = mismatches.filter((m) => !isConfident(m));

  return {
    expected,
    mismatches,
    confident,
    review,
    matched,
    undecided,
    flagged: confident.length > 0,
  };
}
