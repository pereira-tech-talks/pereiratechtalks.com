// Pereira Tech Talks v3.0.0 — Task 17 talks extraction.
//
// For each of the 15 recent meetups (Meetup.com era 2025-2026), parses the
// source .mdx body and emits:
//
//   - One file per talk in src/content/talks/{meetup-slug}--{n}-{talk-slug}.md
//   - A speaker stub in src/content/speakers/{speaker-slug}.yaml (created
//     only if it does not already exist; existing speakers are left intact).
//
// The talk pattern in source bodies is one of:
//
//   <emoji> Speaker Name - Role at Company
//   Tema: Talk title
//   Description ...
//
//   <emoji> Title-as-line
//   Ponente: Speaker Name - Role at Company
//   Description ...
//
// We tolerate variants and dashes (—, –, -). Anything we cannot confidently
// parse is dropped (logged on stderr) — content-writer can refine in a
// follow-up commit.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

const MEETUPS_DIR = path.join(ROOT, 'src/content/meetups');
const SPEAKERS_DIR = path.join(ROOT, 'src/content/speakers');
const TALKS_DIR = path.join(ROOT, 'src/content/talks');
const SOURCE_DIR = path.join(ROOT, 'tmp/pereiratechtalks.com/src/content/post');

// Map: meetup slug → source mdx file (15 recent meetups).
const RECENT_MEETUPS = {
  'inauguracion-gdg-pereira': '306256947-inauguracin-gdg-pere.mdx',
  'conoce-a-la-cloud-native-computing-foundation':
    '306731274-conoce-a-la-cloud-native-computing-foundation.mdx',
  'noche-de-ai-generativa-2025':
    '307304023-Noche-de-AI-Generativa-Generación-Procedural-y-Descubrimiento-de-Farmacos.mdx',
  'continuous-testing-paralelizacion-y-observabilidad':
    '307796521-Continuous-Testing-Paralelización-de-Pruebas-y-Observabilidad.mdx',
  'aprendiendo-con-vibe-coding': '249625568-aprendiendo-con-vibe-coding.mdx',
  'noche-de-rust-2025': '249625568-Noche-de-Rust.mdx',
  'noche-de-python-2025': '249625568-Noche-de-Python.mdx',
};

const EMOJI_RE =
  /^([\p{Emoji_Presentation}\p{Extended_Pictographic}])\s+(.+)$/u;
const DASH_RE = /\s+[-–—]\s+/;

function slugify(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

function parseSource(text) {
  const fm = text.match(/^---\n([\s\S]*?)\n---\n/);
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

function chunkByEmoji(body) {
  // Split body into blocks where a new block starts at a line beginning with
  // an emoji. The first chunk (before the first emoji) is the lead-in /
  // intro and is dropped.
  const lines = body.split('\n');
  const chunks = [];
  let current = null;
  for (const line of lines) {
    const t = line.trim();
    if (EMOJI_RE.test(t)) {
      if (current) chunks.push(current);
      current = [t];
    } else if (current) {
      current.push(t);
    }
  }
  if (current) chunks.push(current);
  // Trim each chunk's trailing empty lines.
  return chunks.map((c) => {
    while (c.length > 0 && c[c.length - 1] === '') c.pop();
    return c;
  });
}

function parseChunk(chunk) {
  // chunk is [emojiLine, ...rest]
  const head = chunk[0];
  const headMatch = head.match(EMOJI_RE);
  if (!headMatch) return null;
  const headText = headMatch[2].trim();
  const rest = chunk.slice(1).filter((l) => l.trim() !== '');

  // Variant A: head contains "Speaker - Role" or "Speaker – Role".
  // Look for "Tema:" or "Topic:" or "Title:" in rest.
  let speakerName = '';
  let role = '';
  let title = '';
  let abstract = '';

  const temaIdx = rest.findIndex((l) => /^(Tema|Topic|Title|Charla):/i.test(l));
  const ponenteIdx = rest.findIndex((l) =>
    /^(Ponente|Speaker|Expositor):/i.test(l)
  );

  if (temaIdx >= 0) {
    // head = speaker info
    const parts = headText.split(DASH_RE);
    speakerName = parts[0].trim();
    role = parts.slice(1).join(' - ').trim();
    // If head only has the name (no dash), the role may live on the lines
    // between head and the "Tema:" marker.
    if (!role && temaIdx > 0) {
      role = rest.slice(0, temaIdx).join(' ').trim();
    }
    title = rest[temaIdx].replace(/^(Tema|Topic|Title|Charla):\s*/i, '').trim();
    abstract = rest
      .slice(temaIdx + 1)
      .join(' ')
      .trim();
  } else if (ponenteIdx >= 0) {
    // head = title
    title = headText;
    const ponenteLine = rest[ponenteIdx]
      .replace(/^(Ponente|Speaker|Expositor):\s*/i, '')
      .trim();
    const parts = ponenteLine.split(DASH_RE);
    speakerName = parts[0].trim();
    role = parts.slice(1).join(' - ').trim();
    abstract = rest
      .slice(0, ponenteIdx)
      .concat(rest.slice(ponenteIdx + 1))
      .join(' ')
      .trim();
  } else {
    // Cannot reliably split — treat head as title, no speaker.
    return null;
  }

  // Sanity checks
  if (!title || !speakerName) return null;
  // Drop trailing punctuation
  speakerName = speakerName.replace(/[.,;:]+$/, '').trim();
  role = role.replace(/[.,;:]+$/, '').trim();
  title = title.replace(/[.,;:]+$/, '').trim();

  return { speakerName, role, title, abstract };
}

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}
function ensureSpeaker(speakerName, role) {
  const slug = slugify(speakerName);
  const filePath = path.join(SPEAKERS_DIR, `${slug}.yaml`);
  if (fs.existsSync(filePath)) return slug;

  // Translate common Spanish role tokens to English (best-effort).
  const roleEn = role
    .replace(/\bCo-fundador\b/gi, 'Co-founder')
    .replace(/\bCo-fundadora\b/gi, 'Co-founder')
    .replace(/\bFundador\b/gi, 'Founder')
    .replace(/\bFundadora\b/gi, 'Founder')
    .replace(/\bIngeniero\b/gi, 'Engineer')
    .replace(/\bIngeniera\b/gi, 'Engineer')
    .replace(/\bGerente\b/gi, 'Manager')
    .replace(/\bDirector\b/gi, 'Director')
    .replace(/\bDirectora\b/gi, 'Director')
    .replace(/\bDocente\b/gi, 'Lecturer')
    .replace(/\bProfesor\b/gi, 'Professor')
    .replace(/\bProfesora\b/gi, 'Professor')
    // " en X" / " en X." → " at X"  (only when followed by a capital — i.e.
    // preceding a company name).
    .replace(/\s+en\s+([A-ZÁÉÍÓÚÑ])/g, ' at $1')
    .replace(/\s+y\s+/g, ' & ');

  const yaml = [
    `name: ${JSON.stringify(speakerName)}`,
    `role:`,
    `  en: ${JSON.stringify(roleEn || 'Speaker at Pereira Tech Talks')}`,
    `  es: ${JSON.stringify(role || 'Ponente en Pereira Tech Talks')}`,
    `bio:`,
    `  en: ${JSON.stringify(`${speakerName} spoke at a Pereira Tech Talks meetup. Speaker bio pending — pull requests welcome.`)}`,
    `  es: ${JSON.stringify(`${speakerName} dio una charla en un meetup de Pereira Tech Talks. Bio del ponente pendiente — pull requests bienvenidos.`)}`,
    `photo:`,
    `  src: "/images/speakers/_placeholder.svg"`,
    `  alt:`,
    `    en: ${JSON.stringify(`Portrait of ${speakerName}`)}`,
    `    es: ${JSON.stringify(`Retrato de ${speakerName}`)}`,
    `talks: []`,
    `location:`,
    `  city: "Pereira"`,
    `  country: "Colombia"`,
    `languages:`,
    `  - es`,
    '',
  ].join('\n');
  ensureDir(SPEAKERS_DIR);
  fs.writeFileSync(filePath, yaml, 'utf8');
  return slug;
}

function writeTalk({
  meetupSlug,
  meetupDate,
  index,
  title,
  abstract,
  speakerSlug,
  language = 'es',
}) {
  const talkSlug = `${meetupSlug}--${index}-${slugify(title)}`;
  const fname = `${talkSlug}.md`;
  const filePath = path.join(TALKS_DIR, fname);

  const md = [
    '---',
    'title:',
    `  en: ${JSON.stringify(title)}`,
    `  es: ${JSON.stringify(title)}`,
    'abstract:',
    `  en: ${JSON.stringify(abstract || `Talk delivered at a Pereira Tech Talks meetup.`)}`,
    `  es: ${JSON.stringify(abstract || `Charla presentada en un meetup de Pereira Tech Talks.`)}`,
    'speakers:',
    `  - ${speakerSlug}`,
    `date: ${meetupDate}`,
    'event:',
    '  collection: meetups',
    `  slug: ${JSON.stringify(meetupSlug)}`,
    `language: ${language}`,
    'duration: 25',
    'type: talk',
    'tags: []',
    'status: recorded',
    '---',
    '',
    `## ${title}`,
    '',
    abstract || `Charla presentada en un meetup de Pereira Tech Talks.`,
    '',
  ].join('\n');

  ensureDir(TALKS_DIR);
  fs.writeFileSync(filePath, md, 'utf8');
  return talkSlug;
}

function updateMeetupFrontmatter(meetupSlug, talkSlugs, speakerSlugs) {
  // Find the meetup file (has YYYY-MM-DD_ prefix).
  const files = fs.readdirSync(MEETUPS_DIR);
  const target = files.find(
    (f) => f.endsWith(`_${meetupSlug}.md`) || f === `${meetupSlug}.md`
  );
  if (!target) {
    console.warn(`Could not find meetup file for slug: ${meetupSlug}`);
    return;
  }
  const fullPath = path.join(MEETUPS_DIR, target);
  let text = fs.readFileSync(fullPath, 'utf8');

  // Replace `talks: []` and `speakers: []` lines.
  const talksBlock = ['talks:', ...talkSlugs.map((s) => `  - ${s}`)].join('\n');
  const speakersBlock = [
    'speakers:',
    ...[...new Set(speakerSlugs)].map((s) => `  - ${s}`),
  ].join('\n');

  text = text.replace(/^talks:\s*\[\]\s*$/m, talksBlock);
  text = text.replace(/^speakers:\s*\[\]\s*$/m, speakersBlock);

  fs.writeFileSync(fullPath, text, 'utf8');
}

ensureDir(SPEAKERS_DIR);
ensureDir(TALKS_DIR);

let talksWritten = 0;
let chunksDropped = 0;

for (const [meetupSlug, sourceFile] of Object.entries(RECENT_MEETUPS)) {
  const sourcePath = path.join(SOURCE_DIR, sourceFile);
  if (!fs.existsSync(sourcePath)) {
    console.warn(`Source missing: ${sourceFile}`);
    continue;
  }
  const sourceText = fs.readFileSync(sourcePath, 'utf8');
  const parsed = parseSource(sourceText);
  if (!parsed) continue;
  const meetupDate = (parsed.meta.publishDate || '').slice(0, 10);
  const chunks = chunkByEmoji(parsed.body);

  let n = 0;
  const meetupTalkSlugs = [];
  const meetupSpeakerSlugs = [];
  for (const chunk of chunks) {
    const t = parseChunk(chunk);
    if (!t) {
      chunksDropped++;
      continue;
    }
    n++;
    const speakerSlug = ensureSpeaker(t.speakerName, t.role);
    const talkSlug = writeTalk({
      meetupSlug,
      meetupDate,
      index: n,
      title: t.title,
      abstract: t.abstract,
      speakerSlug,
    });
    meetupTalkSlugs.push(talkSlug);
    meetupSpeakerSlugs.push(speakerSlug);
    talksWritten++;
  }
  if (meetupTalkSlugs.length > 0) {
    updateMeetupFrontmatter(meetupSlug, meetupTalkSlugs, meetupSpeakerSlugs);
  }
}

// Recount speakers by listing the speakers dir.
const speakerCount = fs
  .readdirSync(SPEAKERS_DIR)
  .filter((f) => f.endsWith('.yaml')).length;

console.log(
  `\n✓ Talks extraction: ${talksWritten} talks written, ${chunksDropped} chunks dropped (low-confidence parse), ${speakerCount} speakers in collection.`
);
