// Pereira Tech Talks v3.0.0 — Task 17 bulk meetups migration.
//
// Walks tmp/pereiratechtalks.com/src/content/post/ and emits a meetup .md
// file per source post, except those that:
//   - are duplicates (Meetup.com numeric variants of slug-based posts already migrated)
//   - are PTD 2024 (folded into pereiraTechDays/2024.yaml)
//   - are pure long-form blog posts (deferred to community-blog pass)
//   - are community announcements (intentional drop)
//   - have already been written by run-migration.mjs (the 15 recent meetups)
//
// The mapping table below mirrors MIGRATION_CLASSIFICATION.md.
//
// Bodies: we keep it short — Spanish description block synthesized from the
// source title + venue, with an EN-callout. Full body content is a
// content-writer follow-up pass.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

const SOURCE_DIR = path.join(ROOT, 'tmp/pereiratechtalks.com/src/content/post');

// Drop list — never migrate.
const DROP = new Set([
  'feliz-ano-2018-pereira-tech-talks.mdx',
  'comunidad-en-telegram.mdx',
  'nos-mudamos-a-luma.mdx',
  'increible-como-un-chatbot-nos-ayuda-a-gestionar-nuestro-equipo.mdx',
  'reflexiones-de-lo-aprendido-en-2016-sobre-javascript.mdx',
  'eventos-en-2019.mdx',
  'eventos-en-2021.mdx',
  'eventos-en-2022.mdx',
  '302603058-pereira-tech-day.mdx', // folded into pereiraTechDays/2024.yaml
]);

// Long-form blog candidates — deferred to a content-writer pass.
const BLOG_CANDIDATES = new Set([
  'pereira-tech-talks-charlas-con-un-lenguaje-universal.mdx',
  'como-aplicar-para-trabajar-en-google.mdx',
  'mi-experiencia-en-dps.mdx',
  'por-que-las-competencias-de-programacion-son-importantes-en-la-vida-laboral.mdx',
  'pereirajs-presente-en-la-jsconf-2017.mdx',
  'pereirajs-se-une-a-pereira-tech-talks.mdx',
  'nodeschool-international-day.mdx',
  'nodeschool-international-day-2016.mdx',
]);

// Already migrated by run-migration.mjs (15 recent meetups).
const ALREADY = new Set([
  '8uige1ke-ia-como-motor-de-crecimiento.mdx',
  'q087gp2d-abril-mobile.mdx',
  '4a8c1ypc-mujeres-en-tecnologia.mdx',
  'xjga6v67-de-vuetify-a-edge-computing.mdx',
  'e0qp2vux-el-futuro-de-la-ia.mdx',
  'yxlmeio5-lightning-talks.mdx',
  '0xil6wus-conversatorio.mdx',
  'ttd1exr8-conociendo-la-nube.mdx',
  '249625568-Noche-de-Python.mdx',
  '249625568-Noche-de-Rust.mdx',
  '249625568-aprendiendo-con-vibe-coding.mdx',
  '307796521-Continuous-Testing-Paralelización-de-Pruebas-y-Observabilidad.mdx',
  '307304023-Noche-de-AI-Generativa-Generación-Procedural-y-Descubrimiento-de-Farmacos.mdx',
  '306731274-conoce-a-la-cloud-native-computing-foundation.mdx',
  '306256947-inauguracin-gdg-pere.mdx',
]);

// Slug-based duplicates of Meetup.com numeric posts — drop the slug-based
// version (the Meetup.com numeric one is the canonical record).
const DEDUP_DROPS = new Set([
  'control-de-flujos-de-trabajo-en-airflow-inteligencia-artificial-con-tensorflow.mdx',
  'vision-artificial-con-opencv-programacion-funcional-en-haskell.mdx',
  'como-empezar-en-seguridad-informatica-proteccion-legal-de-la-innovacion.mdx',
  'servidores-web-nginx-motores-de-busqueda-con-elasticsearch.mdx',
  'noche-de-devops-intro-a-la-automatizacion-en-ansible-ci-con-gitlab-y-docker.mdx',
  'introduccion-a-bitcoin-y-blockchain-conoce-la-nueva-revolucion-tecnologica.mdx',
  'noche-de-testing-pruebas-unitarias-en-python-y-javascript.mdx',
  'noche-de-diseno-tendencias-y-buenas-practicas-de-ui-ux-para-desarrolladores.mdx',
  'noche-de-ia-y-chatgpt-tendencias-y-posibilidades.mdx',
]);

// Slug overrides — keyed by source filename (sans dir).
// Where missing, falls back to a normalized slug from the source filename.
const SLUG_OVERRIDES = {
  '247349603-noche-de-devops-intr.mdx': 'noche-de-devops-ansible-y-gitlab-2018',
  '257037605-noche-de-devops-intr.mdx':
    'noche-de-devops-docker-y-kubernetes-2018',
  '249625568-introduccin-a-bitcoi.mdx': 'bitcoin-y-blockchain-2018',
  '250815878-noche-de-testing-pru.mdx': 'noche-de-testing-2018',
  '253647647-noche-de-diseo-tende.mdx': 'noche-de-diseno-ui-ux-2018',
  '259446080-noche-de-serverless.mdx': 'noche-de-serverless-y-seguridad-2019',
  '259646321-pereira-girls-day.mdx': 'pereira-girls-day-2019',
  '260589719-hablemos-de-automati.mdx':
    'automatizacion-de-infraestructura-y-linux',
  '261814865-5-de-junio-aprendien.mdx':
    'aprendiendo-bases-de-datos-nosql-y-rails',
  '263207408-de-cero-a-super-hero.mdx': 'de-cero-a-super-heroe-go-kubernetes',
  '264304830-pereira-saturday-tec.mdx': 'saturday-tech-talks-2019',
  '264973350-meetup-virtual-noche.mdx': 'meetup-virtual-code-review-y-auth0',
  '269780095-quarantine-tech-talk.mdx': 'quarantine-tech-talks-2020-2',
  '269942102-quarantine-tech-talk.mdx': 'quarantine-tech-talks-2020-3',
  '270081031-quarantine-tech-talk.mdx': 'quarantine-tech-talks-2020-4',
  '270217972-quarantine-tech-talk.mdx': 'quarantine-tech-talks-2020-5',
  '270745121-quarantine-tech-talk.mdx': 'quarantine-tech-talks-2020-6',
  'quarantine-tech-talks.mdx': 'quarantine-tech-talks-2020-overview',
  '276757820-tdd-y-microservicios.mdx': 'tdd-y-microservicios-2021',
  '278665825-gcp-y-owasp.mdx': 'gcp-y-owasp-2021',
  '279620621-software-libre-y-aut.mdx': 'software-libre-y-automatizacion-2021',
  '283129605-noche-de-machine-lea.mdx': 'noche-de-machine-learning-2022',
  '283655889-noche-de-career-path.mdx': 'noche-de-career-path-2022',
  '285770133-noche-de-liderazgo-y.mdx': 'noche-de-liderazgo-y-testing-2022',
  '286473532-noche-de-seguridad-y.mdx': 'noche-de-seguridad-y-testing-2022',
  '288702513-noche-de-accesibilid.mdx': 'noche-de-accesibilidad-y-ios-2022',
  '289498758-noche-de-experiencia.mdx':
    'noche-de-experiencias-en-software-2022',
  '293065563-noche-de-ia-chatgpt.mdx': 'noche-de-ia-y-chatgpt-2023',
  '299312744-explorando-cicd-tekt.mdx':
    'explorando-cicd-tekton-y-github-actions',
  '300358357-tecnologas-de-vangua.mdx':
    'tecnologias-de-vanguardia-svelte-y-blockchain',
  '301101493-revolucionando-el-de.mdx': 'revolucionando-el-deep-learning',
  '301707617-noche-de-unity-prime.mdx': 'noche-de-unity-2024',
  '302332376-desarrollo-web-moder.mdx': 'desarrollo-web-moderno-con-astro',
  '302972719-tech-soft-skills-ia.mdx': 'tech-soft-skills-ia-y-trabajo-remoto',
  '303545199-machine-learning-aut.mdx': 'machine-learning-y-automatizaciones',
  '304127870-ia-en-accin-aprende.mdx': 'ia-en-accion-2024',
  '304596503-tecnologa-con-propsi.mdx': 'tecnologia-con-proposito',
  '304596568-de-la-utp-a-la-acade.mdx':
    'de-la-utp-a-la-academia-y-lo-empresarial',
  '0xil6wus-conversatorio.mdx': 'conversatorio-hackathon',
  '242657174-control-de-flujos-de.mdx': 'airflow-y-tensorflow-2017',
  '243860589-visin-artificial-con.mdx': 'vision-artificial-y-haskell-2017',
  '244859180-como-empezar-en-segu.mdx':
    'seguridad-informatica-y-proteccion-legal-2017',
  '245689908-introduccin-a-servid.mdx': 'nginx-y-elasticsearch-2017',
  // Pre-2018 PereiraJS-era posts.
  'primera-reunion-pereirajs.mdx': 'primera-reunion-pereirajs-2014',
  'historia-aplicaciones-programacion-orientada-a-objetos-con-javscript.mdx':
    'historia-y-oop-en-javascript-2014',
  'introduccion-a-javascript-del-lado-del-cliente-y-del-servidor.mdx':
    'js-cliente-y-servidor-2014',
  'aprendiendo-javascript-y-nodejs.mdx': 'js-y-nodejs-i-2014',
  'aprendiendo-javascript-y-nodejs-ii.mdx': 'js-y-nodejs-ii-2014',
  'mv-el-camino-a-las-web-apps-del-futuro.mdx': 'mvc-y-express-flatiron-2014',
  'librerias-para-manipulacion-del-dom-introduccion-a-git-y-github.mdx':
    'dom-y-git-2014',
  'buenas-practicas-en-javascript.mdx': 'buenas-practicas-js-y-tdd-2014',
  'buenas-practicas-en-javascript-2.mdx': 'edicion-especial-utp-2014',
  'introduccion-a-npm.mdx': 'introduccion-a-npm-2015',
  'aprendiendo-node.mdx': 'aprendiendo-node-streams-2015',
  'jasmine-behavior-driven-javascript.mdx': 'jasmine-y-iojs-2015',
  'webassambly.mdx': 'webassembly-2015',
  'zeromq-node-js.mdx': 'zeromq-y-websockets-2015',
  'introduccion-a-mv.mdx': 'introduccion-a-mvc-y-node-v4',
  'reactive-programming.mdx': 'reactive-programming-y-es6',
  'edicion-especial-desde-la-utp.mdx': 'p2p-y-meteorjs-2016',
  'introduccion-a-javascript-y-nodejs.mdx': 'js-y-nodejs-introduccion-2016',
  'three-js-y-introduccion-a-react.mdx': 'three-js-y-react-2016',
  'aprendiendo-sobre-jwt-json-web-tokens.mdx': 'jwt-json-web-tokens-2017',
  'introduccion-al-internet-de-las-cosas-y-clustering-con-nodejs.mdx':
    'iot-y-clustering-nodejs-2017',
  'chatbots-en-nodejs-emacscript-6.mdx': 'chatbots-y-es6-2017',
  'apis-y-websockets-con-sailsjs-y-monitoreo-con-statsd-y-grafana.mdx':
    'sails-websockets-y-grafana-2017',
  'ionic-angular-blockchain-bitcoin-ethereum-y-solidity-3.mdx':
    'ionic-angular-y-solidity-2017',
  'react-native-seguridad-en-npm.mdx': 'react-native-y-npm-2017',
  'creando-un-servidor-web-desde-cero-con-nodejs.mdx':
    'servidor-web-nodejs-2017',
  'que-es-el-blockchain-y-como-transformara-radicalmente-la-economia.mdx':
    'que-es-el-blockchain-2017',
  'realidad-virtual-para-la-web-con-a-frame-y-point-free-javascript-con-ramdajs.mdx':
    'realidad-virtual-y-ramda-2018',
  'introduccion-a-las-redes-neuronales-con-keras-y-random-forest.mdx':
    'redes-neuronales-keras-2018',
  'visualizacion-de-datos-con-d3-js-desarrollo-de-aplicaciones-usando-mean-stack.mdx':
    'd3-y-mean-stack-2018',
  'maraton-de-programacion-en-la-utp.mdx': 'maraton-utp-2018',
  'nodeschool-day-pereira-2018.mdx': 'nodeschool-day-pereira-2018',
};

// Translate a few common Spanish meetup-title patterns into a passable English
// counterpart. Anything we don't match falls back to the Spanish title (we
// don't ship machine-translation slop in EN). The `content-writer` agent
// owns final-pass English titles in a follow-up commit.
function translateTitle(es) {
  const map = [
    [/^Noche de DevOps/i, 'DevOps Night'],
    [/^Noche de Testing/i, 'Testing Night'],
    [/^Noche de Diseño/i, 'Design Night'],
    [/^Noche de Serverless/i, 'Serverless Night'],
    [/^Noche de Machine Learning/i, 'Machine Learning Night'],
    [/^Noche de Career Path/i, 'Career Path Night'],
    [/^Noche de Liderazgo/i, 'Leadership Night'],
    [/^Noche de Seguridad/i, 'Security Night'],
    [/^Noche de Accesibilidad/i, 'Accessibility Night'],
    [/^Noche de Experiencias/i, 'Industry Experiences Night'],
    [/^Noche de Unity/i, 'Unity Night'],
    [/^Noche de IA/i, 'AI Night'],
    [/^Quarantine Tech Talk/i, 'Quarantine Tech Talk'],
    [/^Pereira Tech Talks/i, 'Pereira Tech Talks'],
    [/^Pereira/i, 'Pereira'],
    [/^TDD/i, 'TDD'],
    [/^GCP/i, 'GCP'],
    [/^Software libre/i, 'Open Source'],
    [/^Hackaton de planificación/i, 'Planning Hackathon'],
    [/^Maratón/i, 'Programming Marathon'],
    [/^NodeSchool/i, 'NodeSchool'],
    [/^Hablemos de/i, 'Talking about'],
    [/^Aprendiendo/i, 'Learning'],
    [/^Introducción/i, 'Introduction'],
    [/^Historia/i, 'History'],
    [/^De Cero a Super/i, 'From Zero to Super'],
    [/^Saturday Tech/i, 'Saturday Tech'],
    [/^Meetup Virtual/i, 'Virtual Meetup'],
    [/^Pereirajs/i, 'PereiraJS'],
    [/^Reflexiones/i, 'Reflections'],
    [/^Reactive Programming/i, 'Reactive Programming'],
    [/^Three JS/i, 'Three.js'],
    [/^P2P/i, 'P2P'],
    [/^Edición Especial/i, 'Special Edition'],
    [/^Buenas Prácticas/i, 'Best Practices'],
    [/^MV\*/i, 'MV*'],
    [/^Librerías/i, 'Libraries'],
    [/^Servidores web/i, 'Web Servers'],
    [/^Visión artificial/i, 'Computer Vision'],
    [/^Vision artificial/i, 'Computer Vision'],
    [/^Como empezar/i, 'Getting Started'],
    [/^¿Qué es el blockchain/i, 'What is Blockchain?'],
    [/^Realidad Virtual/i, 'Virtual Reality'],
    [/^Continuous Testing/i, 'Continuous Testing'],
    [/^Tecnologías/i, 'Technologies'],
    [/^Tecnología/i, 'Technology'],
    [/^Tech & Soft Skills/i, 'Tech & Soft Skills'],
    [/^Desarrollo Web/i, 'Web Development'],
    [/^Machine Learning/i, 'Machine Learning'],
    [/^IA en acción/i, 'AI in Action'],
    [/^Tecnología con/i, 'Technology with'],
    [/^De la UTP/i, 'From UTP'],
    [/^Inauguración/i, 'Launch of'],
    [/^Conoce/i, 'Meet'],
    [/^Explorando/i, 'Exploring'],
    [/^Revolucionando/i, 'Revolutionizing'],
    [/^Control de flujos/i, 'Workflow Control'],
    [/^APIs y WebSockets/i, 'APIs and WebSockets'],
    [/^Ionic/i, 'Ionic'],
    [/^React Native/i, 'React Native'],
    [/^Chat[Bb]ots/i, 'Chatbots'],
    [/^ChatBots/i, 'Chatbots'],
    [/^Creando un servidor/i, 'Building a web server'],
    [/^Aprendiendo sobre JWT/i, 'Learning JWT'],
    [/^WebAssambly/i, 'WebAssembly'],
    [/^WebAssembly/i, 'WebAssembly'],
    [/^Jasmine/i, 'Jasmine'],
    [/^ZeroMQ/i, 'ZeroMQ'],
    [/^Primera reunión/i, 'First meeting of'],
  ];
  for (const [re, en] of map) {
    if (re.test(es)) {
      return es.replace(re, en);
    }
  }
  return es; // fall back to Spanish (no slop)
}

function parseFrontmatter(text) {
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

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}
function writeFile(p, contents) {
  ensureDir(path.dirname(p));
  fs.writeFileSync(p, contents, 'utf8');
}
function copyFile(srcRel, destRel) {
  const src = path.join(ROOT, srcRel);
  const dest = path.join(ROOT, destRel);
  if (!fs.existsSync(src)) return false;
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  return true;
}

const files = fs.readdirSync(SOURCE_DIR).sort();
let written = 0;
let imagesCopied = 0;
for (const f of files) {
  if (
    DROP.has(f) ||
    BLOG_CANDIDATES.has(f) ||
    ALREADY.has(f) ||
    DEDUP_DROPS.has(f)
  )
    continue;
  const text = fs.readFileSync(path.join(SOURCE_DIR, f), 'utf8');
  const parsed = parseFrontmatter(text);
  if (!parsed) {
    console.warn(`skip (no frontmatter): ${f}`);
    continue;
  }
  const { meta } = parsed;
  const date = meta.publishDate ? meta.publishDate.slice(0, 10) : '';
  if (!date) {
    console.warn(`skip (no date): ${f}`);
    continue;
  }
  const slug = SLUG_OVERRIDES[f] || f.replace(/\.mdx?$/, '');
  const titleEs = meta.title || slug;
  const titleEn = translateTitle(titleEs);
  const venueName = meta.venue || 'Pereira, Colombia';
  const sourceImage = (meta.image || '').replace(
    '~/',
    'tmp/pereiratechtalks.com/src/'
  );
  const ext = sourceImage ? path.extname(sourceImage) || '.jpeg' : '.jpeg';
  const destImg = `/images/meetups/${slug}/hero${ext}`;
  if (sourceImage && copyFile(sourceImage, `public${destImg}`)) imagesCopied++;

  const status =
    new Date(date) < new Date('2026-05-31') ? 'completed' : 'announced';
  const lines = [
    '---',
    'title:',
    `  en: ${JSON.stringify(titleEn)}`,
    `  es: ${JSON.stringify(titleEs)}`,
    'description:',
    `  en: ${JSON.stringify(`Historical Pereira Tech Talks meetup (${date}). Original program: ${titleEs}.`)}`,
    `  es: ${JSON.stringify(`Meetup histórico de Pereira Tech Talks (${date}). Programa original: ${titleEs}.`)}`,
    `pubDate: ${date}`,
    `date: ${date}`,
    'venue:',
    `  name: ${JSON.stringify(venueName)}`,
    '  city: "Pereira"',
    '  country: "Colombia"',
    'mode: in-person',
    ...(sourceImage
      ? [
          'hero:',
          `  src: ${JSON.stringify(destImg)}`,
          '  alt:',
          `    en: ${JSON.stringify(titleEn)}`,
          `    es: ${JSON.stringify(titleEs)}`,
          '  layout: banner',
          `heroImage: ${JSON.stringify(destImg)}`,
        ]
      : []),
    'verticals:',
    '  - monthly-meetups',
    'talks: []',
    'speakers: []',
    'sponsors: []',
    `status: ${status}`,
    'draft: false',
    '---',
    '',
    `## ${titleEs}`,
    '',
    `Meetup histórico de Pereira Tech Talks. Programa original: **${titleEs}**${venueName !== 'Pereira, Colombia' ? `. Sede: ${venueName}.` : '.'}`,
    '',
    `> **EN:** Historical Pereira Tech Talks meetup. Original program: **${titleEn}**${venueName !== 'Pereira, Colombia' ? `. Venue: ${venueName}.` : '.'}`,
    '',
    'Detailed program notes, speakers, and recordings are pending recovery from the community archives. Help us complete the historical record by sending pull requests with photos, slide links, or speaker bios.',
    '',
  ];
  const fname = `${date}_${slug}.md`;
  const outPath = path.join(ROOT, 'src/content/meetups', fname);
  // Don't overwrite existing files written by run-migration.mjs.
  if (fs.existsSync(outPath)) continue;
  writeFile(outPath, lines.join('\n'));
  written++;
}

console.log(
  `\n✓ Bulk meetups migration: ${written} new meetups written, ${imagesCopied} hero images copied.`
);
