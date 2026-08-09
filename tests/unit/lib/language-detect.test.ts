import { describe, expect, it } from 'vitest';
import {
  analyzeDocument,
  CONFIDENT_MISMATCH_CONFIDENCE,
  capitalizedShare,
  detectLanguage,
  htmlToText,
  markdownToText,
  splitIntoBlocks,
  tokenize,
} from '@/lib/language-detect';

const SPANISH_PARAGRAPH =
  'En este meetup exploramos dos perspectivas complementarias de la calidad: una oportunidad para aprender de la historia y reflexionar sobre el presente.';

const ENGLISH_PARAGRAPH =
  'In this meetup we explore two complementary perspectives on quality: a chance to learn from the history of the craft and to reflect on where it stands now.';

describe('tokenize', () => {
  it('lowercases and drops punctuation', () => {
    expect(tokenize('¡Hola, mundo!')).toEqual(['hola', 'mundo']);
  });

  it('keeps intra-word hyphens and apostrophes', () => {
    expect(tokenize("pair-programming don't")).toEqual([
      'pair-programming',
      "don't",
    ]);
  });

  it('returns an empty list for whitespace', () => {
    expect(tokenize('   \n  ')).toEqual([]);
  });
});

describe('detectLanguage', () => {
  it('identifies Spanish prose', () => {
    const score = detectLanguage(SPANISH_PARAGRAPH);
    expect(score.lang).toBe('es');
    expect(score.esScore).toBeGreaterThan(score.enScore);
  });

  it('identifies English prose', () => {
    const score = detectLanguage(ENGLISH_PARAGRAPH);
    expect(score.lang).toBe('en');
    expect(score.enScore).toBeGreaterThan(score.esScore);
  });

  it('treats Spanish-only orthography as evidence', () => {
    // No Spanish stopwords at all — the diacritics alone must carry it.
    const score = detectLanguage(
      'Diseño pequeño mañana compañero análisis versión código página niño'
    );
    expect(score.lang).toBe('es');
  });

  it('returns unknown for a block too short to judge', () => {
    expect(detectLanguage('QA: Pilar del software').lang).toBe('unknown');
  });

  it('returns unknown for a block that is mostly proper nouns', () => {
    // The dominant false-positive source: names, venues, and tech terms.
    expect(
      detectLanguage(
        'Kubernetes PostgreSQL Linux Docker GitLab Grafana TensorFlow AirFlow Astro Vitest'
      ).lang
    ).toBe('unknown');
  });

  it('returns unknown for a block of code-like tokens', () => {
    expect(
      detectLanguage(
        'const foo = 42 let bar = 7 return foo + bar function baz done'
      ).lang
    ).not.toBe('es');
  });

  it('treats a venue or institution name as a name, not a language leak', () => {
    // Found while verifying Task 3: every English meetup page rendered its
    // venue as a standalone block and scored a confident Spanish mismatch.
    expect(
      detectLanguage(
        'Universidad Tecnológica de Pereira, Bloque 13, Sala Magistral 1, Pereira, Colombia'
      ).lang
    ).toBe('unknown');
  });

  it('still classifies prose that merely mentions a proper noun', () => {
    expect(
      detectLanguage(
        'El meetup se realizó en la Universidad Tecnológica de Pereira y reunió a la comunidad durante toda la tarde.'
      ).lang
    ).toBe('es');
  });

  it('reports low confidence for genuinely mixed text', () => {
    const score = detectLanguage(
      'Talk by Diana at the Pereira Tech Talks meetup Librerías para manipulación del DOM'
    );
    expect(score.confidence).toBeLessThan(CONFIDENT_MISMATCH_CONFIDENCE);
  });

  it('reports maximum confidence for single-language text', () => {
    expect(detectLanguage(SPANISH_PARAGRAPH).confidence).toBe(1);
  });
});

describe('capitalizedShare', () => {
  it('scores prose near zero, ignoring the sentence-initial capital', () => {
    expect(capitalizedShare('En este meetup exploramos la calidad')).toBe(0);
  });

  it('scores a name string high', () => {
    expect(
      capitalizedShare('Universidad Tecnológica de Pereira, Sala Magistral')
    ).toBeGreaterThan(0.6);
  });

  it('returns 0 for a single word', () => {
    expect(capitalizedShare('Pereira')).toBe(0);
  });
});

describe('htmlToText', () => {
  it('drops script, style, and svg content', () => {
    const text = htmlToText(
      '<p>Hola mundo</p><script>const secreto = 1;</script><style>.a{color:red}</style><svg><path d="M0 0"/></svg>'
    );
    expect(text).toContain('Hola mundo');
    expect(text).not.toContain('secreto');
    expect(text).not.toContain('color:red');
  });

  it('preserves block boundaries so a stray block stays separable', () => {
    const blocks = splitIntoBlocks(
      htmlToText('<p>First block</p><p>Segundo bloque</p>')
    );
    expect(blocks).toHaveLength(2);
  });

  it('decodes common entities', () => {
    expect(htmlToText('<p>caf&#233; &amp; t&#233;</p>')).toContain('café & té');
  });
});

describe('markdownToText', () => {
  it('removes fenced code blocks', () => {
    const text = markdownToText(
      'Intro\n\n```js\nconst hola = 1;\n```\n\nOutro'
    );
    expect(text).not.toContain('const hola');
    expect(text).toContain('Intro');
  });

  it('keeps link text but drops the URL', () => {
    const text = markdownToText('See [the guide](https://example.com/guide).');
    expect(text).toContain('the guide');
    expect(text).not.toContain('example.com');
  });

  it('strips heading and list markers', () => {
    expect(markdownToText('## Título\n- uno\n- dos')).not.toContain('##');
  });
});

describe('analyzeDocument', () => {
  it('flags a Spanish paragraph inside an English document', () => {
    const verdict = analyzeDocument(
      `${ENGLISH_PARAGRAPH}\n${SPANISH_PARAGRAPH}`,
      'en'
    );
    expect(verdict.flagged).toBe(true);
    expect(verdict.confident).toHaveLength(1);
    expect(verdict.confident[0].text).toContain('perspectivas');
    expect(verdict.matched).toBe(1);
  });

  it('flags a hardcoded English string inside a Spanish document', () => {
    const verdict = analyzeDocument(
      `${SPANISH_PARAGRAPH}\nPhotos, slide links, and recordings are still being recovered from the community archives.`,
      'es'
    );
    expect(verdict.flagged).toBe(true);
  });

  it('does not flag a document that is entirely in its expected language', () => {
    const verdict = analyzeDocument(ENGLISH_PARAGRAPH, 'en');
    expect(verdict.flagged).toBe(false);
    expect(verdict.confident).toHaveLength(0);
  });

  it('routes an embedded Spanish event name to review, not to a defect', () => {
    // Correct English prose carrying an untranslated proper noun — measured at
    // 1/12 precision as a defect, so it must never fail a build.
    const verdict = analyzeDocument(
      'Talk by Carlos Álvaro at the Pereira Tech Talks meetup Visión artificial con OpenCV and functional programming.',
      'en'
    );
    expect(verdict.flagged).toBe(false);
    expect(verdict.confident).toHaveLength(0);
  });

  it('counts unclassifiable blocks as undecided rather than guessing', () => {
    const verdict = analyzeDocument('QA\nKubernetes Docker\n2026', 'en');
    expect(verdict.flagged).toBe(false);
    expect(verdict.undecided).toBeGreaterThan(0);
    expect(verdict.matched).toBe(0);
  });

  it('partitions mismatches into confident and review tiers', () => {
    const verdict = analyzeDocument(
      `${SPANISH_PARAGRAPH}\nSession at Noche de DevOps with Docker and Kubernetes for beginners.`,
      'en'
    );
    expect(verdict.confident.length + verdict.review.length).toBe(
      verdict.mismatches.length
    );
    expect(verdict.confident.length).toBeGreaterThan(0);
  });
});

/**
 * Three false positives the Task 9 gate surfaced. Each was a classifier bug,
 * fixed rather than allowlisted — an allowlist would have hidden the next one.
 */
describe('false positives found while gating the build (Task 9)', () => {
  it('does not read a language-code parenthetical as Spanish', () => {
    // `(EN/ES)` lowercases into "en" and "es" — two of the strongest Spanish
    // stopwords — which scored this English sentence es=2/en=0, confidence 1.00
    // on /en/call-for-speakers.
    const sentence =
      'Diverse perspectives: gender, city, level, language (EN/ES), industry.';
    expect(tokenize(sentence)).not.toContain('es');
    expect(detectLanguage(sentence).lang).not.toBe('es');
  });

  it.each([
    ['(ES)', 'Sessions are delivered in Spanish (ES) for the local community.'],
    [
      '(EN, PT)',
      'Slides are published in both languages (EN, PT) after the event.',
    ],
  ])('strips the %s form too', (_form, sentence) => {
    expect(detectLanguage(sentence).lang).not.toBe('es');
  });

  it('treats embedded HTML in Markdown as markup, not prose', () => {
    // Reveal decks embed raw HTML and `<!-- .slide: -->` directives; a
    // `<figcaption>` scored a confident English mismatch on a Spanish deck.
    const markdown =
      '<!-- .slide: data-background-gradient="radial-gradient(circle at top, #d81540 0%)" -->\n' +
      '<figcaption><strong>Alex Doe</strong><br/><span>Head of Product</span></figcaption>';
    const text = markdownToText(markdown);
    expect(text).not.toContain('<figcaption>');
    expect(text).not.toContain('data-background-gradient');
    expect(analyzeDocument(text, 'es').flagged).toBe(false);
  });

  it('needs more than one marker to call a block a defect', () => {
    // `confidence` measures one-sidedness, so a single stopword with nothing
    // opposing it scores 1.00. An English book title cited in a Spanish post
    // is not a Spanish page leaking English.
    const citation = '“Cracking the Coding Interview”: http://goo.gl/nBUkl';
    const verdict = analyzeDocument(citation, 'es');
    expect(verdict.flagged).toBe(false);
    expect(verdict.confident).toHaveLength(0);
  });

  it('still flags a paragraph that carries real evidence', () => {
    // The evidence floor must not blunt the detector it protects.
    const verdict = analyzeDocument(SPANISH_PARAGRAPH, 'en');
    expect(verdict.flagged).toBe(true);
    expect(verdict.confident.length).toBeGreaterThan(0);
  });
});
