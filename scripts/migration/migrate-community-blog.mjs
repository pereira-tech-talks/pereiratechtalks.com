// Pereira Tech Talks v3.0.0 — Task 17 community blog post migration.
//
// Migrates the 8 long-form community blog posts identified in
// MIGRATION_CLASSIFICATION.md from tmp/pereiratechtalks.com/src/content/post/
// to src/content/blog/{en,es}/.
//
// For each post:
//   - Spanish version: full original body, only image paths rewritten to
//     /images/blog/posts/{slug}/.
//   - English version: translated title + description + a "translation in
//     progress" callout pointing to the Spanish original. We preserve the
//     hero image and the call-to-translate tone — community contributors
//     can complete the translation in a follow-up PR.
//   - Hero image and content images: copied to public/images/blog/posts/{slug}/
//     and renamed to lowercase, hero kept as `hero.{ext}`.
//
// Schema (src/content.config.ts → blog):
//   title, description, pubDate, heroImage, tags, author, draft

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

const SOURCE_DIR = path.join(ROOT, 'tmp/pereiratechtalks.com/src/content/post');
const SOURCE_ASSETS = path.join(
  ROOT,
  'tmp/pereiratechtalks.com/src/assets/images/posts'
);
const BLOG_EN_DIR = path.join(ROOT, 'src/content/blog/en');
const BLOG_ES_DIR = path.join(ROOT, 'src/content/blog/es');
const PUBLIC_BLOG_DIR = path.join(ROOT, 'public/images/blog/posts');

// Each entry: source file → { slug (English), titleEn, descEn, descEs,
//                              tags, author, descriptionEs }
const POSTS = [
  {
    source: 'pereirajs-se-une-a-pereira-tech-talks.mdx',
    slug: 'pereirajs-joins-pereira-tech-talks',
    titleEn: 'PereiraJS joins Pereira Tech Talks',
    descEn:
      'In 2024, the JavaScript-focused PereiraJS community merged into Pereira Tech Talks. PereiraJS organizer Santiago Bernal explains what changes — and what stays.',
    descEs:
      'En 2024, la comunidad PereiraJS, enfocada en JavaScript, se fusionó con Pereira Tech Talks. Santiago Bernal, organizador de PereiraJS, explica qué cambia — y qué se mantiene.',
    tags: ['community'],
    author: 'santiago-bernal',
  },
  {
    source: 'como-aplicar-para-trabajar-en-google.mdx',
    slug: 'applying-for-software-engineering-at-google',
    titleEn: 'How to apply for software engineering roles at Google',
    descEn:
      'A community guide derived from Google materials shared at PereiraJS: tips for your résumé, transcript, online application, and interview preparation.',
    descEs:
      'Guía comunitaria derivada de materiales de Google compartidos en PereiraJS: tips para tu hoja de vida, certificado de notas, aplicación en línea y preparación para la entrevista.',
    tags: ['community', 'career'],
    author: 'sergio-florez',
  },
  {
    source: 'mi-experiencia-en-dps.mdx',
    slug: 'my-experience-at-digital-product-school',
    titleEn: 'My experience at Digital Product School (Munich)',
    descEn:
      'A first-person account of Batch #5 at Digital Product School in Munich — applying, traveling, building a product in a multidisciplinary team, and surviving Alpine hikes.',
    descEs:
      'Crónica en primera persona de Batch #5 en Digital Product School en Múnich — aplicar, viajar, construir un producto en equipo multidisciplinar y sobrevivir a las caminatas en los Alpes.',
    tags: ['community', 'career'],
    author: 'sergio-florez',
  },
  {
    source:
      'por-que-las-competencias-de-programacion-son-importantes-en-la-vida-laboral.mdx',
    slug: 'why-competitive-programming-matters',
    titleEn:
      'Why competitive programming matters in your software engineering career',
    descEn:
      'A community essay arguing that competitive programming sharpens problem-solving, code review, debugging, and interview skills that translate directly to software engineering work.',
    descEs:
      'Ensayo comunitario que defiende cómo las competencias de programación afilan habilidades de resolución de problemas, revisión de código, depuración y entrevistas que se trasladan directo al trabajo de ingeniería de software.',
    tags: ['community', 'career'],
    author: 'sergio-florez',
  },
  {
    source: 'pereira-tech-talks-charlas-con-un-lenguaje-universal.mdx',
    slug: 'pereira-tech-talks-recognized-by-aseutp-2018',
    titleEn: 'Pereira Tech Talks recognized at the 2018 ASE-UTP Convention',
    descEn:
      'Pereira Tech Talks was named one of the standout collectives shaping innovation in the region during the XX ASE-UTP Convention in 2018.',
    descEs:
      'Pereira Tech Talks fue reconocida como uno de los colectivos destacados en innovación de la región durante la XX Convención de la Asociación Nacional de Egresados UTP en 2018.',
    tags: ['community'],
    author: 'sergio-florez',
  },
  {
    source: 'pereirajs-presente-en-la-jsconf-2017.mdx',
    slug: 'pereirajs-at-jsconf-colombia-2017',
    titleEn: 'PereiraJS at JSConf Colombia 2017',
    descEn:
      'A photo recap from JSConf Colombia 2017 — PereiraJS attended and brought back energy, ideas, and connections for the local JavaScript community.',
    descEs:
      'Recap fotográfico de JSConf Colombia 2017 — PereiraJS asistió y trajo de vuelta energía, ideas y conexiones para la comunidad JavaScript local.',
    tags: ['community'],
    author: 'sergio-florez',
  },
  {
    source: 'nodeschool-international-day.mdx',
    slug: 'nodeschool-international-day-2015',
    titleEn: 'NodeSchool International Day 2015 — Pereira',
    descEn:
      'A day of workshops and talks learning JavaScript and Node.js, led by Daniel Aristizabal and Manuel Pineda. Includes the original event recording.',
    descEs:
      'Un día de workshops y charlas aprendiendo JavaScript y Node.js, liderado por Daniel Aristizabal y Manuel Pineda. Incluye la grabación original del evento.',
    tags: ['community'],
    author: 'sergio-florez',
  },
  {
    source: 'nodeschool-international-day-2016.mdx',
    slug: 'nodeschool-international-day-2016',
    titleEn: 'NodeSchool International Day 2016 — Pereira',
    descEn:
      'PereiraJS partnered with the JointDeveloper community at UTP to host the 2016 NodeSchool International Day. A short photo recap of the event.',
    descEs:
      'PereiraJS se unió a la comunidad JointDeveloper de la UTP para organizar el NodeSchool International Day 2016. Un recap fotográfico corto del evento.',
    tags: ['community'],
    author: 'sergio-florez',
  },
];

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function parseFm(text) {
  const fm = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!fm) return null;
  const body = text.slice(fm[0].length);
  const meta = {};
  for (const line of fm[1].split('\n')) {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (m) {
      let v = m[2].trim();
      if (
        (v.startsWith("'") && v.endsWith("'")) ||
        (v.startsWith('"') && v.endsWith('"'))
      ) {
        v = v.slice(1, -1);
      }
      meta[m[1]] = v;
    }
  }
  return { meta, body };
}

function copyImage(srcRelative, destAbsolute) {
  // srcRelative is like ~/assets/images/posts/banners/google.png
  const cleaned = srcRelative.replace(/^~\/assets\/images\/posts\//, '');
  const sourceFull = path.join(SOURCE_ASSETS, cleaned);
  if (!fs.existsSync(sourceFull)) {
    console.warn(`Image not found: ${sourceFull}`);
    return false;
  }
  ensureDir(path.dirname(destAbsolute));
  fs.copyFileSync(sourceFull, destAbsolute);
  return true;
}

function rewriteBodyImages(
  body,
  slug,
  originalTagPath = '~/assets/images/posts/'
) {
  // Replace any ~/assets/images/posts/{type}/{name}.{ext} references with
  // /images/blog/posts/{slug}/{name}.{ext} and copy the file.
  const imageRefs = [];
  const replaced = body.replace(
    /!\[([^\]]*)\]\(~\/assets\/images\/posts\/([^)]+)\)/g,
    (_, alt, relPath) => {
      const fileName = path.basename(relPath);
      imageRefs.push({ relPath, fileName });
      return `![${alt}](/images/blog/posts/${slug}/${fileName})`;
    }
  );
  // Copy each referenced image.
  for (const { relPath, fileName } of imageRefs) {
    const dest = path.join(PUBLIC_BLOG_DIR, slug, fileName);
    copyImage(`${originalTagPath}${relPath}`, dest);
  }
  return replaced;
}

function ensureHero(srcImage, slug) {
  if (!srcImage) return null;
  const ext = path.extname(srcImage) || '.jpg';
  const dest = path.join(PUBLIC_BLOG_DIR, slug, `hero${ext}`);
  const ok = copyImage(srcImage, dest);
  if (!ok) return null;
  return `/images/blog/posts/${slug}/hero${ext}`;
}

function emitEs({ slug, post, fmSource, body, heroPath }) {
  const date = (fmSource.meta.publishDate || '').slice(0, 10);
  const fileName = `${date}_${slug}.md`;
  const fullPath = path.join(BLOG_ES_DIR, fileName);

  const cleanedBody = rewriteBodyImages(body, slug);

  const lines = [
    '---',
    `title: ${JSON.stringify(fmSource.meta.title || post.titleEn)}`,
    `description: ${JSON.stringify(post.descEs)}`,
    `pubDate: ${date}`,
    ...(heroPath ? [`heroImage: ${JSON.stringify(heroPath)}`] : []),
    'heroLayout: banner',
    `tags:`,
    ...post.tags.map((t) => `  - ${t}`),
    `author: ${post.author}`,
    'draft: false',
    '---',
    '',
    cleanedBody.trimEnd(),
    '',
  ];
  ensureDir(BLOG_ES_DIR);
  fs.writeFileSync(fullPath, lines.join('\n'), 'utf8');
}

function emitEn({ slug, post, fmSource, heroPath }) {
  const date = (fmSource.meta.publishDate || '').slice(0, 10);
  const fileName = `${date}_${slug}.md`;
  const fullPath = path.join(BLOG_EN_DIR, fileName);

  const lines = [
    '---',
    `title: ${JSON.stringify(post.titleEn)}`,
    `description: ${JSON.stringify(post.descEn)}`,
    `pubDate: ${date}`,
    ...(heroPath ? [`heroImage: ${JSON.stringify(heroPath)}`] : []),
    'heroLayout: banner',
    `tags:`,
    ...post.tags.map((t) => `  - ${t}`),
    `author: ${post.author}`,
    'draft: false',
    '---',
    '',
    `## ${post.titleEn}`,
    '',
    post.descEn,
    '',
    '> **Translation in progress.** This community post was originally written in Spanish during the early years of Pereira Tech Talks. The full English translation is being completed by community contributors. In the meantime, read the [Spanish version](/es/blog/' +
      slug +
      '/) for the full content.',
    '',
    '## Summary',
    '',
    post.descEn,
    '',
    '---',
    '',
    '_Help us translate this post by sending a pull request to the [pereiratechtalks.org repository](https://github.com/pereira-tech-talks/pereiratechtalks.org)._',
    '',
  ];
  ensureDir(BLOG_EN_DIR);
  fs.writeFileSync(fullPath, lines.join('\n'), 'utf8');
}

let written = 0;
let errors = 0;
for (const post of POSTS) {
  const sourceFile = path.join(SOURCE_DIR, post.source);
  if (!fs.existsSync(sourceFile)) {
    console.warn(`Source missing: ${post.source}`);
    errors++;
    continue;
  }
  const text = fs.readFileSync(sourceFile, 'utf8');
  const fmSource = parseFm(text);
  if (!fmSource) {
    console.warn(`No frontmatter: ${post.source}`);
    errors++;
    continue;
  }
  const heroPath = ensureHero(fmSource.meta.image, post.slug);
  emitEs({ slug: post.slug, post, fmSource, body: fmSource.body, heroPath });
  emitEn({ slug: post.slug, post, fmSource, heroPath });
  written++;
}

console.log(
  `\n✓ Community blog migration: ${written} posts written (en+es), ${errors} errors.`
);
