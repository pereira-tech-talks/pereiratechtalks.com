/**
 * Completeness assertions for the agent-Markdown twins.
 *
 * Enforces the contract in `docs/aeo/MARKDOWN_FOR_AGENTS.md` — written as
 * `MD_COMPLETENESS_SPEC.md` in Task 6, implemented in Task 7, gated here in
 * Task 9 of PLAN_sitewide_language_seo_aeo_audit.
 *
 * Two layers, deliberately in this order:
 *
 *   1. REQUIRED SECTIONS (binding). Each page type must carry the sections its
 *      HTML renders. This is what actually prevents a summary — a ratio can be
 *      padded, and it cannot say "the talk abstracts are missing".
 *   2. CONTENT-WORD COVERAGE (regression detector). A secondary signal, only
 *      meaningful above a page-size floor. See THRESHOLDS below.
 *
 * Kept separate from `check-md-parity.mjs` so the logic is unit-testable
 * without a build.
 */

// ── Text extraction ───────────────────────────────────────

/** Visible text of an HTML document, chrome and machinery removed. */
export function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ');
}

/**
 * The `<main>` landmark when present, else the whole document.
 * Comparing against the whole document would make every page fail on nav and
 * footer chrome, which the contract explicitly excludes from the `.md`.
 */
export function mainOf(html) {
  const match = html.match(/<main[^>]*>([\s\S]*)<\/main>/i);
  return match ? match[1] : html;
}

/**
 * Comparable content words: lowercased, diacritics folded, 3+ characters,
 * deduplicated. A set, not a sequence — the contract lets a `.md` reorder
 * sections relative to the page.
 */
export function contentWords(text) {
  return new Set(
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .split(' ')
      .filter((word) => word.length > 2)
  );
}

/**
 * The `.md` side, with the front-block machinery and link targets removed so a
 * URL cannot inflate the score.
 */
export function mdText(markdown) {
  return markdown
    .replace(/^(Language|Canonical):.*$/gm, '')
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/[#>*_`\-|[\]]/g, ' ');
}

/** Coverage of a page's content by its `.md`, plus what is missing. */
export function coverageOf(html, markdown) {
  const htmlWords = contentWords(stripHtml(mainOf(html)));
  const mdWords = contentWords(mdText(markdown));
  const missing = [...htmlWords].filter((word) => !mdWords.has(word));
  const ratio =
    htmlWords.size === 0
      ? 1
      : (htmlWords.size - missing.length) / htmlWords.size;
  return { ratio, missing, htmlWordCount: htmlWords.size };
}

// ── Page types ────────────────────────────────────────────

/** The page type that owns a build path, ignoring the language prefix. */
export function pageTypeOf(pagePath) {
  const path = pagePath.replace(/^en\/?/, '');
  // The Spanish root is emitted as `index`; `/en` comes through empty.
  if (path === '' || path === 'index') return 'home';

  const [head, ...rest] = path.split('/');
  const isDetail = rest.length > 0;

  if (head === 'meetups') return isDetail ? 'meetup-detail' : 'meetup-index';
  if (head === 'speakers') return isDetail ? 'speaker-detail' : 'speaker-index';
  if (head === 'sponsors') return isDetail ? 'sponsor-detail' : 'sponsor-index';
  if (head === 'verticals')
    return isDetail ? 'vertical-detail' : 'vertical-index';
  if (head === 'slides') return isDetail ? 'slide-detail' : 'slide-index';
  if (head === 'pereira-tech-days') return 'ptd-edition';
  if (head === 'pereira-tech-day') return 'ptd-landing';
  if (head === 'blog') {
    if (rest[0] === 'series')
      return rest.length > 1 ? 'blog-series' : 'blog-series-index';
    return isDetail ? 'blog-post' : 'blog-index';
  }
  return head;
}

/**
 * Sections a page type must carry, as the headings the serializers emit in
 * both languages. A type absent from this map is checked for the universal
 * rules only — its content is a verbatim body (the policy/prose pages).
 *
 * `whenHtmlHas` marks a **conditional** section, matching the spec's C rows: a
 * meetup with no programmed talks legitimately has no Talks section, and
 * demanding one would make the gate lie. The condition is a probe against the
 * page's own HTML, so "the page shows it, the twin does not" is the failure —
 * not "the section is absent from both".
 */
/**
 * Schedule and Speakers are conditional: a past edition renders no agenda, and
 * an edition may deliberately withhold both (see `postponement.hideSections` in
 * docs/features/PEREIRA_TECH_DAYS.md). The probes match the section ids emitted
 * by `PtdScheduleSection` / `PtdSpeakersSection` and the past-edition Ponentes
 * block, so the gate still fails when the page shows one and the twin does not.
 */
const PTD_SECTIONS = [
  { names: ['Hero image', 'Imagen destacada'] },
  { names: ['Schedule', 'Agenda'], whenHtmlHas: /id="schedule"/ },
  {
    names: ['Speakers', 'Ponentes'],
    whenHtmlHas: /id="speakers"|id="ptd-speakers-title"/,
  },
  { names: ['Venue', 'Lugar'] },
];

export const REQUIRED_SECTIONS = {
  'meetup-detail': [
    {
      names: ['Talks', 'Charlas'],
      whenHtmlHas: /id="talks"|>\s*(Talks|Charlas)\s*</,
    },
    { names: ['Venue', 'Lugar'] },
  ],
  'speaker-detail': [
    { names: ['Photo', 'Foto'] },
    {
      names: ['Talk history', 'Historial de charlas'],
      whenHtmlHas: /(Talk history|Historial de charlas)/,
    },
  ],
  'sponsor-detail': [{ names: ['Logo', 'Logo'] }],
  'vertical-detail': [
    {
      names: ['Related meetups', 'Meetups relacionados'],
      whenHtmlHas: /(Related meetups|Meetups relacionados|Meetups asociados)/,
    },
  ],
  'ptd-edition': PTD_SECTIONS,
  'ptd-landing': PTD_SECTIONS,
  contributors: [{ names: ['Organizing team', 'Equipo organizador'] }],
  communities: [{ names: ['Allied communities', 'Comunidades aliadas'] }],
};

/** Headings the `.md` actually carries. */
export function headingsOf(markdown) {
  return [...markdown.matchAll(/^#{2,3} (.+)$/gm)].map((m) => m[1].trim());
}

/**
 * Required sections a `.md` is missing, by their English name.
 * `html` is needed to evaluate conditional sections; omitting it treats every
 * section as unconditional.
 */
export function missingSections(markdown, type, html = null) {
  const required = REQUIRED_SECTIONS[type];
  if (!required) return [];
  const headings = headingsOf(markdown);
  return required
    .filter((section) => {
      if (section.whenHtmlHas && html !== null) {
        if (!section.whenHtmlHas.test(html)) return false;
      }
      return !headings.some((h) => section.names.includes(h));
    })
    .map((section) => section.names[0]);
}

// ── Universal rules ───────────────────────────────────────

/**
 * A list row that is only a slug — `- qa-pilar-del-software--1-open-source`.
 * The contract forbids it: every entity reference carries a name and a link.
 *
 * Real ids use a double dash to separate the event from the talk
 * (`{meetup}--1-{talk}`), so the separator class allows runs of dashes. Three
 * or more segments keeps ordinary hyphenated prose ("open-source") out.
 */
const BARE_SLUG_ROW = /^- [a-z0-9]+(?:-+[a-z0-9]+){2,}[ \t]*$/gm;

export function bareSlugRows(markdown) {
  return [...markdown.matchAll(BARE_SLUG_ROW)].map((m) => m[0].trim());
}

/** The front block must locate the page before anything else. */
export function missingFrontBlock(markdown) {
  const missing = [];
  if (!/^# .+/m.test(markdown)) missing.push('H1 title');
  if (!/^Language: (en|es)\s*$/m.test(markdown)) missing.push('Language:');
  if (!/^Canonical: https?:\/\/\S+/m.test(markdown)) missing.push('Canonical:');
  return missing;
}

/** Site Navigation must appear exactly once, and last. */
export function navigationProblem(markdown) {
  const matches = markdown.match(
    /^## (Site Navigation|Navegación del Sitio)$/gm
  );
  if (!matches) return 'missing Site Navigation block';
  if (matches.length > 1)
    return `Site Navigation appears ${matches.length} times`;
  return null;
}

// ── Thresholds ────────────────────────────────────────────

/**
 * Below this many content words in `<main>`, the ratio measures page size
 * rather than completeness: every page carries a fixed amount of text with no
 * Markdown equivalent (button labels, date formatting, timeline affordances),
 * and on a 29-word profile that fixed cost is 27% of the page. Measured in
 * Task 7 — see `MD_COMPLETENESS_AUDIT.md`.
 */
export const MIN_CONTENT_WORDS = 60;

/** The contract's target, from `docs/aeo/MARKDOWN_FOR_AGENTS.md`. */
export const CONTRACT_TARGET = 0.85;

/**
 * Enforced floors, per page type.
 *
 * These are **regression floors, not the contract**. Each is the coverage
 * Task 7 actually measured for that type (at >= MIN_CONTENT_WORDS) minus a
 * 0.03 margin, capped at CONTRACT_TARGET. A page that drops more than three
 * points below what this repo already achieves fails immediately; a page
 * between its floor and 0.85 is reported as a warning so the remaining gap
 * stays visible instead of being quietly accepted.
 *
 * The types listed below sit under 0.85 because their residual is interface
 * text with no document equivalent — verified word by word in Task 7's audit,
 * not assumed. Every other type is held to the contract.
 */
export const COVERAGE_FLOORS = {
  'vertical-index': 0.7, // measured 0.734 — mission repeated as a hover affordance
  'sponsor-us': 0.75, // measured 0.787 — multi-step inquiry form controls
  'speaker-detail': 0.76, // measured 0.795 — talk-timeline chrome, date fragments
  calendar: 0.77, // measured 0.809 — Google Calendar island + intake form labels
  press: 0.78, // measured 0.813 — press-kit download labels and filenames
  home: 0.79, // measured 0.823 (`/`) and 0.862 (`/en`) — countdown digits,
  //             typewriter words, scroll cue
};

export function floorFor(type) {
  return COVERAGE_FLOORS[type] ?? CONTRACT_TARGET;
}

// ── Evaluation ────────────────────────────────────────────

/**
 * Evaluate one page. Returns `errors` (gate failures) and `warnings`
 * (reported, non-blocking), each already phrased so a developer can act on it
 * without opening the file.
 */
export function evaluatePage({ pagePath, html, markdown, expectedLanguage }) {
  const type = pageTypeOf(pagePath);
  const errors = [];
  const warnings = [];

  for (const field of missingFrontBlock(markdown)) {
    errors.push(`front block is missing ${field}`);
  }

  const navProblem = navigationProblem(markdown);
  if (navProblem) errors.push(navProblem);

  if (
    expectedLanguage &&
    !new RegExp(`^Language: ${expectedLanguage}\\s*$`, 'm').test(markdown)
  ) {
    errors.push(`declares a language other than "${expectedLanguage}"`);
  }

  const sections = missingSections(markdown, type, html);
  if (sections.length > 0) {
    errors.push(`missing required section(s): ${sections.join(', ')}`);
  }

  const slugs = bareSlugRows(markdown);
  if (slugs.length > 0) {
    errors.push(
      `${slugs.length} bare slug row(s) where a name is required, e.g. "${slugs[0]}"`
    );
  }

  const { ratio, missing, htmlWordCount } = coverageOf(html, markdown);
  const floor = floorFor(type);
  const measured = htmlWordCount >= MIN_CONTENT_WORDS;

  if (measured && ratio < floor) {
    errors.push(
      `coverage ${ratio.toFixed(3)} below the ${floor.toFixed(2)} floor for "${type}" — ` +
        `absent from the .md: ${missing.slice(0, 10).join(', ')}`
    );
  } else if (measured && ratio < CONTRACT_TARGET) {
    warnings.push(
      `coverage ${ratio.toFixed(3)} under the ${CONTRACT_TARGET} contract target ` +
        `(floor for "${type}" is ${floor.toFixed(2)})`
    );
  }

  return { pagePath, type, ratio, htmlWordCount, measured, errors, warnings };
}
