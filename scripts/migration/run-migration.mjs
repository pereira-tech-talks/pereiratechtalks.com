// Pereira Tech Talks v3.0.0 — Task 17 content migration runner.
//
// Reads the seed-data.mjs and seed-events.mjs modules and emits:
//   - src/content/tags/{slug}.md             (community tag taxonomy seed)
//   - src/content/channels/{slug}.yaml
//   - src/content/verticals/{slug}.yaml
//   - src/content/sponsors/{slug}.yaml
//   - src/content/speakers/{slug}.yaml
//   - src/content/contributors/{slug}.yaml
//   - src/content/pereiraTechDays/{year}.yaml      (full 2024 + stubs)
//   - src/content/meetups/{date}_{slug}.md         (recent meetups with bodies)
//
// And, when source files exist, copies hero images from tmp/.../ to public/images/...
//
// Usage:
//   node scripts/migration/run-migration.mjs

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  CHANNELS,
  CONTRIBUTORS,
  SPEAKERS,
  SPONSORS,
  TAGS,
  VERTICALS,
} from './seed-data.mjs';
import { PTD_2024, PTD_STUBS, RECENT_MEETUPS } from './seed-events.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..', '..');

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
  if (!fs.existsSync(src)) {
    console.warn(`  ⚠ source missing: ${srcRel}`);
    return false;
  }
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  return true;
}

// Emit YAML — tiny serializer for our needs (objects, arrays, strings, numbers, booleans).
function yaml(value, indent = 0) {
  const pad = '  '.repeat(indent);
  if (value === null || value === undefined) return 'null';
  if (typeof value === 'string') {
    if (
      /[\n:#&*!|>'"%@`]/.test(value) ||
      value.startsWith('-') ||
      value.includes('  ')
    ) {
      return JSON.stringify(value);
    }
    return value === '' ? '""' : value;
  }
  if (typeof value === 'number' || typeof value === 'boolean')
    return String(value);
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    return value
      .map((v) => {
        if (v && typeof v === 'object' && !Array.isArray(v)) {
          const lines = Object.entries(v).map(([k, vv], i) => {
            const prefix = i === 0 ? '- ' : '  ';
            if (vv && typeof vv === 'object') {
              return `${pad}${prefix}${k}:\n${yaml(vv, indent + 2)}`;
            }
            return `${pad}${prefix}${k}: ${yaml(vv, indent + 2)}`;
          });
          return lines.join('\n');
        }
        return `${pad}- ${yaml(v, indent + 1)}`;
      })
      .join('\n');
  }
  if (typeof value === 'object') {
    return Object.entries(value)
      .map(([k, v]) => {
        if (v && typeof v === 'object' && !Array.isArray(v)) {
          return `${pad}${k}:\n${yaml(v, indent + 1)}`;
        }
        if (Array.isArray(v) && v.length > 0) {
          return `${pad}${k}:\n${yaml(v, indent + 1)}`;
        }
        return `${pad}${k}: ${yaml(v, indent + 1)}`;
      })
      .join('\n');
  }
  return String(value);
}

function summary(prefix, count) {
  console.log(`  ${prefix}: ${count}`);
}

// --- 1. Tags (community taxonomy seed) ---
console.log('Tags:');
for (const t of TAGS) {
  const fm = [
    '---',
    `name: "${t.name}"`,
    `description: "${t.description}"`,
    `tier: ${t.tier}`,
  ];
  if (t.parent) fm.push(`parent: "${t.parent}"`);
  fm.push(`order: ${t.order}`, '---', '');
  writeFile(path.join(ROOT, 'src/content/tags', `${t.slug}.md`), fm.join('\n'));
}
summary('tags written', TAGS.length);

// --- 2. Channels ---
console.log('Channels:');
for (const c of CHANNELS) {
  const obj = {
    name: c.name,
    platform: c.platform,
    url: c.url,
    description: c.description,
    audience: c.audience,
    isPrimary: c.isPrimary,
    order: c.order,
  };
  writeFile(
    path.join(ROOT, 'src/content/channels', `${c.slug}.yaml`),
    `${yaml(obj)}\n`
  );
}
summary('channels written', CHANNELS.length);

// --- 3. Verticals ---
console.log('Verticals:');
for (const v of VERTICALS) {
  const obj = {
    title: v.title,
    shortName: v.shortName,
    mission: v.mission,
    description: v.description,
    leaders: v.leaders,
    channels: v.channels,
    schedule: v.schedule,
    status: v.status,
    order: v.order,
  };
  writeFile(
    path.join(ROOT, 'src/content/verticals', `${v.slug}.yaml`),
    `${yaml(obj)}\n`
  );
}
summary('verticals written', VERTICALS.length);

// --- 4. Sponsors ---
console.log('Sponsors:');
for (const s of SPONSORS) {
  const obj = {
    name: s.name,
    logo: { light: s.logoLight, dark: s.logoDark, alt: s.logoAlt },
    url: s.url,
    description: s.description,
    tier: s.tier,
    sponsoredEditions: s.sponsoredEditions,
    status: s.status,
    order: s.order,
  };
  writeFile(
    path.join(ROOT, 'src/content/sponsors', `${s.slug}.yaml`),
    `${yaml(obj)}\n`
  );
}
summary('sponsors written', SPONSORS.length);

// --- 5. Speakers ---
console.log('Speakers:');
for (const sp of SPEAKERS) {
  const obj = {
    name: sp.name,
    pronouns: sp.pronouns,
    role: sp.role,
    bio: sp.bio,
    photo: { src: sp.photoSrc, alt: sp.photoAlt },
    social: sp.social,
    talks: [],
    location: sp.location,
    languages: sp.languages,
  };
  writeFile(
    path.join(ROOT, 'src/content/speakers', `${sp.slug}.yaml`),
    `${yaml(obj)}\n`
  );
}
summary('speakers written', SPEAKERS.length);

// --- 6. Contributors ---
console.log('Contributors:');
for (const c of CONTRIBUTORS) {
  const obj = {
    name: c.name,
    pronouns: c.pronouns,
    avatar: c.avatar,
    roles: c.roles,
    role: c.role,
    bio: c.bio,
    social: c.social,
    activeSince: c.activeSince,
    order: c.order,
  };
  writeFile(
    path.join(ROOT, 'src/content/contributors', `${c.slug}.yaml`),
    `${yaml(obj)}\n`
  );
}
summary('contributors written', CONTRIBUTORS.length);

// --- 7. PTD 2024 full + stubs ---
console.log('Pereira Tech Days:');
writeFile(
  path.join(ROOT, 'src/content/pereiraTechDays', '2024.yaml'),
  `year: 2024\n${yaml(PTD_2024).split('\n').slice(1).join('\n')}\n`
);

for (const s of PTD_STUBS) {
  const stub = {
    year: s.year,
    title: {
      en: `Pereira Tech Day ${s.year}`,
      es: `Pereira Tech Day ${s.year}`,
    },
    tagline: { en: s.tagline, es: s.tagline },
    description: {
      en: `A historical Pereira Tech Day edition (${s.year}). Detailed program, photos, and speaker lineup are pending recovery from community archives.`,
      es: `Edición histórica de Pereira Tech Day (${s.year}). El programa detallado, las fotos y la lista de ponentes están pendientes de recuperación desde los archivos de la comunidad.`,
    },
    date: s.date,
    venue: { name: 'Pereira, Colombia', city: 'Pereira', country: 'Colombia' },
    mode: 'in-person',
    hero: {
      src: '/images/pereira-tech-days/_placeholder/hero.png',
      alt: {
        en: `Pereira Tech Day ${s.year} placeholder cover`,
        es: `Cubierta de Pereira Tech Day ${s.year}`,
      },
      layout: 'banner',
    },
    brandKit: {
      paletteLight: {
        primary: '#1f6f73',
        accent: '#e3a648',
        bg: '#f4f9f9',
        bgElevated: '#ffffff',
        text: '#0f2a2c',
        textMuted: '#6e8589',
        border: '#e2e8e8',
      },
    },
    schedule: [],
    keynotes: [],
    lightningTalks: [],
    sponsors: [],
    organizers: [],
    communities: [],
    gallery: [],
    status: s.status,
    draft: false,
  };
  writeFile(
    path.join(ROOT, 'src/content/pereiraTechDays', `${s.year}.yaml`),
    `${yaml(stub)}\n`
  );
}
summary('PTD editions written', 1 + PTD_STUBS.length);

// --- 8. Meetups (recent, with bodies) ---
console.log('Meetups:');
let copiedImages = 0;
for (const m of RECENT_MEETUPS) {
  // Image copy.
  const heroDestPath = `public${m.image}`;
  if (m.sourceImage && copyFile(m.sourceImage, heroDestPath)) copiedImages++;

  const fm = [
    '---',
    `title:`,
    `  en: ${JSON.stringify(m.title.en)}`,
    `  es: ${JSON.stringify(m.title.es)}`,
    `description:`,
    `  en: ${JSON.stringify(m.description.en)}`,
    `  es: ${JSON.stringify(m.description.es)}`,
    `pubDate: ${m.date}`,
    `date: ${m.date}`,
    `venue:`,
    `  name: ${JSON.stringify(m.venue.name)}`,
    `  city: ${JSON.stringify(m.venue.city)}`,
    `  country: ${JSON.stringify(m.venue.country)}`,
    `mode: ${m.mode}`,
    `hero:`,
    `  src: ${JSON.stringify(m.image)}`,
    `  alt:`,
    `    en: ${JSON.stringify(m.title.en)}`,
    `    es: ${JSON.stringify(m.title.es)}`,
    `  layout: banner`,
    `heroImage: ${JSON.stringify(m.image)}`,
    `verticals:${m.verticals.length ? `\n${m.verticals.map((v) => `  - ${v}`).join('\n')}` : ' []'}`,
    `talks: []`,
    `speakers:${m.speakers.length ? `\n${m.speakers.map((s) => `  - ${s}`).join('\n')}` : ' []'}`,
    `sponsors: []`,
    ...(m.linkMeetupCom ? [`linkMeetupCom: ${m.linkMeetupCom}`] : []),
    `status: ${m.status}`,
    `draft: false`,
    '---',
    '',
    `## ${m.title.es}`,
    '',
    m.description.es,
    '',
    `> **EN:** ${m.description.en}`,
    '',
    `Originally published on Meetup.com / Luma — see the link in the frontmatter for full details.`,
    '',
  ].join('\n');
  const fname = `${m.date}_${m.slug}.md`;
  writeFile(path.join(ROOT, 'src/content/meetups', fname), fm);
}
summary('meetups written', RECENT_MEETUPS.length);
summary('hero images copied', copiedImages);

// --- 9. Optional: copy contributor / speaker / community / sponsor images ---
console.log('Asset copies:');
const ASSET_COPIES = [
  // Contributors / organizers
  [
    'tmp/pereiratechtalks.com/src/assets/images/people/carolina-gomez-trejos.jpg',
    'public/images/contributors/carolina-gomez-trejos.jpg',
  ],
  [
    'tmp/pereiratechtalks.com/src/assets/images/people/jose-felipe-duarte.png',
    'public/images/contributors/jose-felipe-duarte.png',
  ],
  [
    'tmp/pereiratechtalks.com/src/assets/images/people/stiven-cardona-monsalve.jpeg',
    'public/images/contributors/stiven-cardona-monsalve.jpeg',
  ],
  [
    'tmp/pereiratechtalks.com/src/assets/images/people/sergio-florez.png',
    'public/images/contributors/sergio-florez.png',
  ],
  [
    'tmp/pereiratechtalks.com/src/assets/images/people/alejo-rendon.jpg',
    'public/images/contributors/alejandro-rendon.jpg',
  ],
  [
    'tmp/pereiratechtalks.com/src/assets/images/people/angelica-aguirre.png',
    'public/images/contributors/angelica-aguirre.png',
  ],
  [
    'tmp/pereiratechtalks.com/src/assets/images/people/melisa-escobar.png',
    'public/images/contributors/melisa-escobar.png',
  ],
  // Keynote speakers
  [
    'tmp/pereiratechtalks.com/src/assets/images/people/vanessa-aristizabal.jpg',
    'public/images/speakers/vanessa-aristizabal.jpg',
  ],
  [
    'tmp/pereiratechtalks.com/src/assets/images/people/karolina-landino.jpeg',
    'public/images/speakers/karolina-ladino.jpeg',
  ],
  [
    'tmp/pereiratechtalks.com/src/assets/images/people/jose-alfredo-jaramillo.jpg',
    'public/images/speakers/jose-jaramillo.jpg',
  ],
  [
    'tmp/pereiratechtalks.com/src/assets/images/people/cesar-camacho.jpg',
    'public/images/speakers/cesar-camacho.jpg',
  ],
  [
    'tmp/pereiratechtalks.com/src/assets/images/people/jonathan-alvarez.jpeg',
    'public/images/speakers/jonathan-alvarez.jpeg',
  ],
  [
    'tmp/pereiratechtalks.com/src/assets/images/people/sebastian-franco.jpeg',
    'public/images/speakers/sebastian-franco.jpeg',
  ],
  // PTD 2024 hero (use the announcement banner)
  [
    'tmp/pereiratechtalks.com/src/assets/images/posts/banners/highres_522682359.jpeg',
    'public/images/pereira-tech-days/2024/hero.jpeg',
  ],
  // Communities
  [
    'tmp/pereiratechtalks.com/src/assets/images/pereira-tech-day/community/pypereira.png',
    'public/images/communities/pypereira.png',
  ],
  [
    'tmp/pereiratechtalks.com/src/assets/images/pereira-tech-day/community/jointdev.png',
    'public/images/communities/jointdev.png',
  ],
  [
    'tmp/pereiratechtalks.com/src/assets/images/pereira-tech-day/community/perjs.jpeg',
    'public/images/communities/perjs.jpeg',
  ],
  [
    'tmp/pereiratechtalks.com/src/assets/images/pereira-tech-day/community/ptt.png',
    'public/images/communities/ptt.png',
  ],
  // Sponsors
  [
    'tmp/pereiratechtalks.com/src/assets/images/pereira-tech-day/sponsors/github.png',
    'public/images/sponsors/github-light.png',
  ],
  [
    'tmp/pereiratechtalks.com/src/assets/images/pereira-tech-day/sponsors/github.png',
    'public/images/sponsors/github-dark.png',
  ],
  [
    'tmp/pereiratechtalks.com/src/assets/images/pereira-tech-day/sponsors/source-meridian.png',
    'public/images/sponsors/source-meridian.png',
  ],
  [
    'tmp/pereiratechtalks.com/src/assets/images/pereira-tech-day/sponsors/ase-utp.png',
    'public/images/sponsors/ase-utp.png',
  ],
  [
    'tmp/pereiratechtalks.com/src/assets/images/pereira-tech-day/sponsors/dailybot.png',
    'public/images/sponsors/dailybot.png',
  ],
  [
    'tmp/pereiratechtalks.com/src/assets/images/pereira-tech-day/sponsors/gorilla.png',
    'public/images/sponsors/gorilla-logic.png',
  ],
  [
    'tmp/pereiratechtalks.com/src/assets/images/pereira-tech-day/sponsors/made-for-germany.png',
    'public/images/sponsors/made-for-germany.png',
  ],
];
let copiedAssets = 0;
for (const [src, dest] of ASSET_COPIES) {
  if (copyFile(src, dest)) copiedAssets++;
}
summary('asset files copied', copiedAssets);

// --- 10. PTD placeholder cover (use the 2024 hero as fallback for stubs) ---
copyFile(
  'tmp/pereiratechtalks.com/src/assets/images/pereira-tech-day/about.jpg',
  'public/images/pereira-tech-days/_placeholder/hero.png'
);

console.log('\n✓ Migration script done.');
