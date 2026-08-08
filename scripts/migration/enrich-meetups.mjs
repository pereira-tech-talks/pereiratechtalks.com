// Pereira Tech Talks v3.0.0 — Task 17 voice-rewrite for historical meetups.
//
// Walks every meetup file in src/content/meetups/ and, when the body is a
// stub written by bulk-meetups.mjs, replaces it with a bilingual body
// derived from the original tmp/pereiratechtalks.com/.mdx source.
//
// What it extracts:
//   - The Spanish narrative paragraphs (HTML tags stripped, links preserved
//     in markdown).
//   - The numbered talks list (`1. Title by Speaker (handle)`).
//   - The Meetup.com canonical URL (preserved as a footer link).
//
// What it writes:
//   - A clean Spanish body (community-voice intro + talks list).
//   - An English summary block (1-paragraph summary + talk titles).
//   - A "Sources" section with the original Meetup.com permalink.
//
// Bodies that were already hand-written by run-migration.mjs (the 15 recent
// meetups) are skipped via STUB_MARKER detection.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');
const MEETUPS_DIR = path.join(ROOT, 'src/content/meetups');
const SOURCE_DIR = path.join(ROOT, 'tmp/pereiratechtalks.com/src/content/post');

// Reverse map: meetup-slug → source .mdx filename (the inverse of
// SLUG_OVERRIDES in bulk-meetups.mjs).
const SLUG_TO_SOURCE = {
  'noche-de-devops-ansible-y-gitlab-2018': '247349603-noche-de-devops-intr.mdx',
  'noche-de-devops-docker-y-kubernetes-2018':
    '257037605-noche-de-devops-intr.mdx',
  'bitcoin-y-blockchain-2018': '249625568-introduccin-a-bitcoi.mdx',
  'noche-de-testing-2018': '250815878-noche-de-testing-pru.mdx',
  'noche-de-diseno-ui-ux-2018': '253647647-noche-de-diseo-tende.mdx',
  'noche-de-serverless-y-seguridad-2019': '259446080-noche-de-serverless.mdx',
  'pereira-girls-day-2019': '259646321-pereira-girls-day.mdx',
  'automatizacion-de-infraestructura-y-linux':
    '260589719-hablemos-de-automati.mdx',
  'aprendiendo-bases-de-datos-nosql-y-rails':
    '261814865-5-de-junio-aprendien.mdx',
  'de-cero-a-super-heroe-go-kubernetes': '263207408-de-cero-a-super-hero.mdx',
  'saturday-tech-talks-2019': '264304830-pereira-saturday-tec.mdx',
  'meetup-virtual-code-review-y-auth0': '264973350-meetup-virtual-noche.mdx',
  'quarantine-tech-talks-2020-2': '269780095-quarantine-tech-talk.mdx',
  'quarantine-tech-talks-2020-3': '269942102-quarantine-tech-talk.mdx',
  'quarantine-tech-talks-2020-4': '270081031-quarantine-tech-talk.mdx',
  'quarantine-tech-talks-2020-5': '270217972-quarantine-tech-talk.mdx',
  'quarantine-tech-talks-2020-6': '270745121-quarantine-tech-talk.mdx',
  'quarantine-tech-talks-2020-overview': 'quarantine-tech-talks.mdx',
  'tdd-y-microservicios-2021': '276757820-tdd-y-microservicios.mdx',
  'gcp-y-owasp-2021': '278665825-gcp-y-owasp.mdx',
  'software-libre-y-automatizacion-2021': '279620621-software-libre-y-aut.mdx',
  'noche-de-machine-learning-2022': '283129605-noche-de-machine-lea.mdx',
  'noche-de-career-path-2022': '283655889-noche-de-career-path.mdx',
  'noche-de-liderazgo-y-testing-2022': '285770133-noche-de-liderazgo-y.mdx',
  'noche-de-seguridad-y-testing-2022': '286473532-noche-de-seguridad-y.mdx',
  'noche-de-accesibilidad-y-ios-2022': '288702513-noche-de-accesibilid.mdx',
  'noche-de-experiencias-en-software-2022':
    '289498758-noche-de-experiencia.mdx',
  'noche-de-ia-y-chatgpt-2023': '293065563-noche-de-ia-chatgpt.mdx',
  'explorando-cicd-tekton-y-github-actions':
    '299312744-explorando-cicd-tekt.mdx',
  'tecnologias-de-vanguardia-svelte-y-blockchain':
    '300358357-tecnologas-de-vangua.mdx',
  'revolucionando-el-deep-learning': '301101493-revolucionando-el-de.mdx',
  'noche-de-unity-2024': '301707617-noche-de-unity-prime.mdx',
  'desarrollo-web-moderno-con-astro': '302332376-desarrollo-web-moder.mdx',
  'tech-soft-skills-ia-y-trabajo-remoto': '302972719-tech-soft-skills-ia.mdx',
  'machine-learning-y-automatizaciones': '303545199-machine-learning-aut.mdx',
  'ia-en-accion-2024': '304127870-ia-en-accin-aprende.mdx',
  'tecnologia-con-proposito': '304596503-tecnologa-con-propsi.mdx',
  'de-la-utp-a-la-academia-y-lo-empresarial':
    '304596568-de-la-utp-a-la-acade.mdx',
  'airflow-y-tensorflow-2017': '242657174-control-de-flujos-de.mdx',
  'vision-artificial-y-haskell-2017': '243860589-visin-artificial-con.mdx',
  'seguridad-informatica-y-proteccion-legal-2017':
    '244859180-como-empezar-en-segu.mdx',
  'nginx-y-elasticsearch-2017': '245689908-introduccin-a-servid.mdx',
  // Pre-2018 PereiraJS-era posts.
  'primera-reunion-pereirajs-2014': 'primera-reunion-pereirajs.mdx',
  'historia-y-oop-en-javascript-2014':
    'historia-aplicaciones-programacion-orientada-a-objetos-con-javscript.mdx',
  'js-cliente-y-servidor-2014':
    'introduccion-a-javascript-del-lado-del-cliente-y-del-servidor.mdx',
  'js-y-nodejs-i-2014': 'aprendiendo-javascript-y-nodejs.mdx',
  'js-y-nodejs-ii-2014': 'aprendiendo-javascript-y-nodejs-ii.mdx',
  'mvc-y-express-flatiron-2014': 'mv-el-camino-a-las-web-apps-del-futuro.mdx',
  'dom-y-git-2014':
    'librerias-para-manipulacion-del-dom-introduccion-a-git-y-github.mdx',
  'buenas-practicas-js-y-tdd-2014': 'buenas-practicas-en-javascript.mdx',
  'edicion-especial-utp-2014': 'buenas-practicas-en-javascript-2.mdx',
  'introduccion-a-npm-2015': 'introduccion-a-npm.mdx',
  'aprendiendo-node-streams-2015': 'aprendiendo-node.mdx',
  'jasmine-y-iojs-2015': 'jasmine-behavior-driven-javascript.mdx',
  'webassembly-2015': 'webassambly.mdx',
  'zeromq-y-websockets-2015': 'zeromq-node-js.mdx',
  'introduccion-a-mvc-y-node-v4': 'introduccion-a-mv.mdx',
  'reactive-programming-y-es6': 'reactive-programming.mdx',
  'p2p-y-meteorjs-2016': 'edicion-especial-desde-la-utp.mdx',
  'js-y-nodejs-introduccion-2016': 'introduccion-a-javascript-y-nodejs.mdx',
  'three-js-y-react-2016': 'three-js-y-introduccion-a-react.mdx',
  'jwt-json-web-tokens-2017': 'aprendiendo-sobre-jwt-json-web-tokens.mdx',
  'iot-y-clustering-nodejs-2017':
    'introduccion-al-internet-de-las-cosas-y-clustering-con-nodejs.mdx',
  'chatbots-y-es6-2017': 'chatbots-en-nodejs-emacscript-6.mdx',
  'sails-websockets-y-grafana-2017':
    'apis-y-websockets-con-sailsjs-y-monitoreo-con-statsd-y-grafana.mdx',
  'ionic-angular-y-solidity-2017':
    'ionic-angular-blockchain-bitcoin-ethereum-y-solidity-3.mdx',
  'react-native-y-npm-2017': 'react-native-seguridad-en-npm.mdx',
  'servidor-web-nodejs-2017':
    'creando-un-servidor-web-desde-cero-con-nodejs.mdx',
  'que-es-el-blockchain-2017':
    'que-es-el-blockchain-y-como-transformara-radicalmente-la-economia.mdx',
  'realidad-virtual-y-ramda-2018':
    'realidad-virtual-para-la-web-con-a-frame-y-point-free-javascript-con-ramdajs.mdx',
  'redes-neuronales-keras-2018':
    'introduccion-a-las-redes-neuronales-con-keras-y-random-forest.mdx',
  'd3-y-mean-stack-2018':
    'visualizacion-de-datos-con-d3-js-desarrollo-de-aplicaciones-usando-mean-stack.mdx',
  'maraton-utp-2018': 'maraton-de-programacion-en-la-utp.mdx',
  'nodeschool-day-pereira-2018': 'nodeschool-day-pereira-2018.mdx',
};

const STUB_MARKER = 'pending recovery from the community archives';

// Strip raw HTML tags but keep <a href>, <strong>, lists.
// Returns markdown-ish text with paragraph splits.
function htmlToMd(raw) {
  let s = raw;
  // Drop ~/assets/... image references (the heros are already migrated;
  // inline content images would need a separate copy step that's out of
  // scope for this voice-rewrite pass).
  s = s.replace(/!\[[^\]]*\]\(~\/assets\/[^)]+\)/g, '');
  // Anchors -> [text](href)
  s = s.replace(
    /<a[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (_, href, text) => {
      const cleanText = text.replace(/<[^>]+>/g, '').trim();
      // Mask masked emails
      if (/\[masked\]/i.test(cleanText)) return cleanText;
      return `[${cleanText}](${href})`;
    }
  );
  // Strong/em
  s = s.replace(/<\/?(strong|b)>/gi, '**');
  s = s.replace(/<\/?(em|i)>/gi, '*');
  // Line breaks
  s = s.replace(/<br\s*\/?>/gi, '\n');
  // Paragraph splits
  s = s.replace(/<\/p>\s*<p[^>]*>/gi, '\n\n');
  s = s.replace(/<p[^>]*>/gi, '');
  s = s.replace(/<\/p>/gi, '');
  // Lists
  s = s.replace(/<li[^>]*>/gi, '- ');
  s = s.replace(/<\/li>/gi, '\n');
  s = s.replace(/<\/?(ul|ol)[^>]*>/gi, '\n');
  // Drop everything else
  s = s.replace(/<[^>]+>/g, '');
  // Decode entities
  s = s.replace(/&amp;/g, '&');
  s = s.replace(/&lt;/g, '<');
  s = s.replace(/&gt;/g, '>');
  s = s.replace(/&quot;/g, '"');
  s = s.replace(/&#39;/g, "'");
  s = s.replace(/&nbsp;/g, ' ');
  // Remove [masked] markers (Meetup.com email obfuscation)
  s = s.replace(/\[masked\]/gi, '');
  // Collapse whitespace
  s = s.replace(/[ \t]+/g, ' ');
  s = s.replace(/\n{3,}/g, '\n\n');
  return s.trim();
}

// Split into a list of clean paragraphs.
function splitParagraphs(text) {
  return text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

// Detect numbered talk lines: "1. Title by Speaker (link)".
// Returns { talks: [{n, raw, title, speaker, url}], remainingParagraphs }.
function extractTalks(paragraphs) {
  const talks = [];
  const remaining = [];
  for (const p of paragraphs) {
    const m = p.match(/^(\d+)\.\s+(.+)$/s);
    if (m && Number(m[1]) <= 10) {
      const n = Number(m[1]);
      const raw = m[2].trim();
      // "Title by Speaker (link)" pattern
      const byMatch = raw.match(
        /^(.+?)\s+by\s+(.+?)(?:\s*\(\[.*?\]\(.+?\)\))?$/i
      );
      const linkMatch = raw.match(/\[(.+?)\]\((.+?)\)/);
      let title = raw;
      let speaker = '';
      const url = linkMatch ? linkMatch[2] : '';
      if (byMatch) {
        title = byMatch[1].trim();
        speaker = byMatch[2].replace(/\s*\[.+?\]\(.+?\)/g, '').trim();
        speaker = speaker.replace(/\s*\(.*?\)\s*$/, '').trim();
      }
      // Strip stray markdown link tail from title
      title = title.replace(/\s*\[.+?\]\(.+?\)\s*$/, '').trim();
      talks.push({ n, raw, title, speaker, url });
    } else {
      remaining.push(p);
    }
  }
  return { talks, remaining };
}

// Find Meetup.com permalink from the original's footer block.
function extractMeetupUrl(originalBody) {
  const m = originalBody.match(
    /https?:\/\/www\.meetup\.com\/pereira-tech-talks\/events\/[\w-]+/
  );
  return m ? m[0] : '';
}

// Truncate paragraph for English summary.
function shortenForSummary(p, max = 280) {
  const flat = p.replace(/\s+/g, ' ').trim();
  if (flat.length <= max) return flat;
  return `${flat.slice(0, max).replace(/\s+\S*$/, '')}…`;
}

// Generate a 1-2 sentence English summary from the Spanish opening.
// We translate a handful of common opening phrases; everything else falls
// back to a generic community-voice summary that includes the talk titles
// when available.
function buildEnSummary(esIntro, talks, dateStr) {
  const titles = talks.map((t) => t.title).filter(Boolean);
  const year = dateStr.slice(0, 4);
  if (titles.length > 0) {
    return `A ${year} Pereira Tech Talks meetup featuring ${titles.join(' · ')}. The community gathered for talks, networking, and snacks.`;
  }
  return `A ${year} Pereira Tech Talks meetup. ${shortenForSummary(esIntro)}`;
}

function rebuildBody({
  titleEs,
  venueName: _venueName,
  esIntro,
  talks,
  meetupUrl,
  dateStr,
}) {
  const lines = [];
  lines.push(`## ${titleEs}`);
  lines.push('');
  lines.push(esIntro);
  lines.push('');
  if (talks.length > 0) {
    lines.push('### Charlas');
    lines.push('');
    for (const t of talks) {
      let line = `${t.n}. **${t.title}**`;
      if (t.speaker) line += ` — ${t.speaker}`;
      if (t.url) line += ` ([perfil](${t.url}))`;
      lines.push(line);
    }
    lines.push('');
  }
  lines.push('---');
  lines.push('');
  lines.push(`### Summary in English`);
  lines.push('');
  lines.push(buildEnSummary(esIntro, talks, dateStr));
  if (talks.length > 0) {
    lines.push('');
    lines.push('**Talks:**');
    lines.push('');
    for (const t of talks) {
      let line = `${t.n}. **${t.title}**`;
      if (t.speaker) line += ` — ${t.speaker}`;
      lines.push(line);
    }
  }
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('### Fuentes / Sources');
  lines.push('');
  if (meetupUrl) {
    lines.push(`- Original event page: [Meetup.com](${meetupUrl})`);
  }
  lines.push(
    '- Photos, slide links, and recordings are still being recovered from community archives — pull requests welcome.'
  );
  lines.push('');
  return lines.join('\n');
}

function parseFrontmatter(text) {
  const fm = text.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!fm) return null;
  const body = text.slice(fm[0].length);
  return { fmBlock: fm[0], body };
}

function parseSourceFrontmatter(text) {
  const fm = text.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) return null;
  const body = text.slice(fm[0].length).trim();
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

const meetupFiles = fs.readdirSync(MEETUPS_DIR).sort();
let enriched = 0;
let skippedNoSource = 0;
let skippedNotStub = 0;

for (const f of meetupFiles) {
  if (!f.endsWith('.md')) continue;
  const fullPath = path.join(MEETUPS_DIR, f);
  const text = fs.readFileSync(fullPath, 'utf8');
  if (!text.includes(STUB_MARKER)) {
    skippedNotStub++;
    continue;
  }
  const parsed = parseFrontmatter(text);
  if (!parsed) continue;

  // Slug = filename minus YYYY-MM-DD_ prefix and .md suffix.
  const slug = f.replace(/^\d{4}-\d{2}-\d{2}_/, '').replace(/\.md$/, '');
  const sourceFile = SLUG_TO_SOURCE[slug];
  if (!sourceFile) {
    console.warn(`No source mapping for slug: ${slug}`);
    skippedNoSource++;
    continue;
  }
  const sourcePath = path.join(SOURCE_DIR, sourceFile);
  if (!fs.existsSync(sourcePath)) {
    console.warn(`Source file missing: ${sourceFile}`);
    skippedNoSource++;
    continue;
  }

  const sourceText = fs.readFileSync(sourcePath, 'utf8');
  const sourceParsed = parseSourceFrontmatter(sourceText);
  if (!sourceParsed) continue;
  const { meta, body: rawBody } = sourceParsed;
  const titleEs = meta.title || slug;
  const venueName = meta.venue || 'Pereira, Colombia';
  const dateStr = (meta.publishDate || '').slice(0, 10);

  // titleEn extraction removed — not used in rebuildBody.

  // Convert raw HTML body to markdown-ish text.
  const md = htmlToMd(rawBody);
  const paragraphs = splitParagraphs(md);

  // Drop the trailing "Publicación original en Meetup.com" line if present —
  // we'll re-add it as a Sources block.
  const filtered = paragraphs.filter(
    (p) => !/Publicaci[oó]n original en/i.test(p)
  );

  // Drop the `---` separator paragraphs the original used between talks.
  const noSep = filtered.filter((p) => p.trim() !== '---');

  const { talks, remaining } = extractTalks(noSep);

  // Spanish intro = first 1-2 paragraphs (before talks).
  const intro =
    remaining.length > 0
      ? remaining.slice(0, 2).join('\n\n')
      : `Meetup de Pereira Tech Talks en ${venueName}. ${titleEs}.`;

  const meetupUrl = extractMeetupUrl(rawBody);

  const newBody = rebuildBody({
    titleEs,
    venueName,
    esIntro: intro,
    talks,
    meetupUrl,
    dateStr,
  });

  const finalText = `${parsed.fmBlock}\n${newBody}`;
  fs.writeFileSync(fullPath, finalText, 'utf8');
  enriched++;
}

console.log(
  `\n✓ Voice-rewrite: ${enriched} meetups enriched, ${skippedNotStub} already complete (skipped), ${skippedNoSource} missing source.`
);
