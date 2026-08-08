// PTD edition data (full 2024 + stubs) and recent meetups.

export const PTD_2024 = {
  year: 2024,
  title: { en: 'Pereira Tech Day 2024', es: 'Pereira Tech Day 2024' },
  tagline: {
    en: 'A day of technology, growth, and community in Pereira.',
    es: 'Un día de tecnología, crecimiento y comunidad en Pereira.',
  },
  description: {
    en: 'Pereira Tech Day 2024 brought together hundreds of builders, students, and community members at the Universidad Tecnológica de Pereira for a free full-day program of keynotes, lightning talks, and networking. Four keynotes covered frontend engineering, product management and Python community, applied research, and AI-driven entrepreneurship; the lightning talks gave first-time speakers a stage to share what they are building.',
    es: 'Pereira Tech Day 2024 reunió a cientos de personas constructoras, estudiantes y miembros de la comunidad en la Universidad Tecnológica de Pereira para una jornada gratuita de keynotes, lightning talks y networking. Cuatro keynotes cubrieron ingeniería frontend, product management y comunidad Python, investigación aplicada y emprendimiento con IA; las lightning talks dieron escenario a ponentes debutantes para compartir lo que están construyendo.',
  },
  date: '2024-09-21',
  venue: {
    name: 'Auditorio Jorge Roa Martínez, Universidad Tecnológica de Pereira',
    city: 'Pereira',
    country: 'Colombia',
  },
  mode: 'in-person',
  hero: {
    src: '/images/pereira-tech-days/2024/hero.jpeg',
    alt: {
      en: 'Pereira Tech Day 2024 attendees gathered in the Auditorio Jorge Roa Martínez',
      es: 'Asistentes de Pereira Tech Day 2024 reunidos en el Auditorio Jorge Roa Martínez',
    },
    layout: 'banner',
  },
  brandKit: {
    paletteLight: {
      primary: '#1f3f59',
      accent: '#f06d6d',
      bg: '#fef7f3',
      bgElevated: '#ffffff',
      text: '#1f3f59',
      textMuted: '#b66844',
      border: '#e8e2d9',
    },
    typography: {
      headingFamily: 'Bebas Neue, "Arial Black", sans-serif',
      headingTransform: 'uppercase',
      headingTracking: '0.18em',
      fontSources: [
        { family: 'Bebas Neue', npmPackage: '@fontsource/bebas-neue' },
      ],
    },
  },
  schedule: [
    { time: '08:00', type: 'open-doors' },
    {
      time: '08:30',
      type: 'keynote',
      title: {
        en: 'Opening keynote — Vanessa Aristizabal',
        es: 'Keynote de apertura — Vanessa Aristizabal',
      },
    },
    {
      time: '09:30',
      type: 'panel',
      title: {
        en: 'Product, Python, and community',
        es: 'Producto, Python y comunidad',
      },
    },
    { time: '10:30', type: 'break' },
    {
      time: '11:00',
      type: 'keynote',
      title: {
        en: 'Applied research keynote — Dr. Jose Jaramillo',
        es: 'Keynote de investigación aplicada — Dr. Jose Jaramillo',
      },
    },
    {
      time: '12:00',
      type: 'keynote',
      title: {
        en: 'AI-driven entrepreneurship — César Camacho',
        es: 'Emprendimiento con IA — César Camacho',
      },
    },
    {
      time: '13:00',
      type: 'lightning',
      title: { en: 'Lightning talks block', es: 'Bloque de lightning talks' },
    },
    { time: '14:00', type: 'closing' },
  ],
  keynotes: [
    'vanessa-aristizabal',
    'karolina-ladino',
    'jose-jaramillo',
    'cesar-camacho',
  ],
  lightningTalks: ['jonathan-alvarez', 'sebastian-franco'],
  sponsors: [
    { slug: 'github', tier: 'gold' },
    { slug: 'source-meridian', tier: 'gold' },
    { slug: 'ase-utp', tier: 'gold' },
    { slug: 'dailybot', tier: 'silver' },
    { slug: 'gorilla-logic', tier: 'silver' },
    { slug: 'made-for-germany', tier: 'community' },
  ],
  organizers: [
    'carolina-gomez-trejos',
    'jose-felipe-duarte',
    'stiven-cardona-monsalve',
    'sergio-florez',
    'alejandro-rendon',
    'angelica-aguirre',
    'melisa-escobar',
  ],
  communities: [
    {
      name: 'Python Pereira',
      logo: '/images/communities/pypereira.png',
      url: 'https://pypereira.co/',
    },
    {
      name: 'JointDev',
      logo: '/images/communities/jointdev.png',
      url: 'https://jointdevweb.firebaseapp.com/',
    },
    {
      name: 'PereiraJS',
      logo: '/images/communities/perjs.jpeg',
      url: 'https://perjs.org/',
    },
    {
      name: 'Pereira Tech Talks',
      logo: '/images/communities/ptt.png',
      url: 'https://pereiratechtalks.org/',
    },
  ],
  gallery: [],
  linkMeetupCom: 'https://www.meetup.com/pereira-tech-talks/events/302603058/',
  status: 'completed',
  draft: false,
};

// Stub editions — minimal data; fill in when historical photos/programs surface.
// We use placeholder hero images that point to a generic PTT brand cover.
export const PTD_STUBS = [
  {
    year: 2017,
    status: 'completed',
    date: '2017-12-01',
    tagline: 'A founding chapter of the Pereira tech scene.',
  },
  {
    year: 2018,
    status: 'completed',
    date: '2018-12-01',
    tagline: 'Workshops, NodeSchool, and a growing speaker bench.',
  },
  {
    year: 2019,
    status: 'completed',
    date: '2019-12-01',
    tagline: 'Saturday Tech Talks, IDaaS, Code Review, and Girls Day.',
  },
  {
    year: 2020,
    status: 'completed',
    date: '2020-12-01',
    tagline: 'Quarantine Tech Talks — the all-virtual edition.',
  },
  {
    year: 2021,
    status: 'completed',
    date: '2021-12-01',
    tagline: 'TDD, GCP, OWASP — the meetups that bridged us back in person.',
  },
  {
    year: 2022,
    status: 'completed',
    date: '2022-12-01',
    tagline:
      'Career path, leadership, security, accessibility — Pereira returns to stages.',
  },
  {
    year: 2023,
    status: 'completed',
    date: '2023-12-01',
    tagline: 'AI & ChatGPT — the year the community pivoted into the LLM era.',
  },
  {
    year: 2026,
    status: 'announced',
    date: '2026-09-26',
    tagline: 'The next chapter — registration opens soon.',
  },
];

// Top recent meetups with body content and image references.
// 'sourceImage' refers to the absolute path under tmp/.../public/<file> that we copy in.
// 'speakers' are speaker slugs already in SPEAKERS or 'unknown' (skip slug list when no match).
export const RECENT_MEETUPS = [
  {
    slug: 'ia-como-motor-de-crecimiento',
    sourceFile: '8uige1ke-ia-como-motor-de-crecimiento.mdx',
    title: { en: 'AI as a growth engine', es: 'IA como motor de crecimiento' },
    description: {
      en: 'A meetup on AI Engineering, AI as infrastructure, and how to scale AI systems in enterprise environments. Talks by Sebastián Franco Gomez and Henry Bravo.',
      es: 'Meetup sobre AI Engineering, IA como infraestructura y cómo escalar sistemas de IA en entornos empresariales. Charlas con Sebastián Franco Gomez y Henry Bravo.',
    },
    date: '2026-05-27',
    venue: {
      name: 'Universidad Tecnológica de Pereira, Sala Magistral 2',
      city: 'Pereira',
      country: 'Colombia',
    },
    mode: 'in-person',
    sourceImage:
      'tmp/pereiratechtalks.com/src/assets/images/posts/banners/8uige1ke.png',
    image: '/images/meetups/ia-como-motor-de-crecimiento/hero.png',
    speakers: ['sebastian-franco'],
    sponsors: [],
    verticals: ['monthly-meetups', 'ai-channel'],
    linkMeetupCom: 'https://luma.com/8uige1ke',
    status: 'announced',
  },
  {
    slug: 'abril-mobile-2026',
    sourceFile: 'q087gp2d-abril-mobile.mdx',
    title: { en: 'April Mobile', es: 'Abril Mobile' },
    description: {
      en: 'Mobile development month: Kotlin Multiplatform, native vs. cross-platform trade-offs, and the future of mobile in 2026.',
      es: 'Mes del desarrollo mobile: Kotlin Multiplatform, native vs. cross-platform y el futuro del mobile en 2026.',
    },
    date: '2026-04-17',
    venue: {
      name: 'Universidad Tecnológica de Pereira',
      city: 'Pereira',
      country: 'Colombia',
    },
    mode: 'in-person',
    sourceImage:
      'tmp/pereiratechtalks.com/src/assets/images/posts/banners/q087gp2d.jpeg',
    image: '/images/meetups/abril-mobile-2026/hero.jpeg',
    speakers: [],
    sponsors: [],
    verticals: ['monthly-meetups'],
    linkMeetupCom: 'https://luma.com/q087gp2d',
    status: 'announced',
  },
  {
    slug: 'mujeres-en-tecnologia-2026',
    sourceFile: '4a8c1ypc-mujeres-en-tecnologia.mdx',
    title: { en: 'Women in Tech', es: 'Mujeres en Tecnología' },
    description: {
      en: 'Women in Tech month meetup — celebrating the impact of women in technology with conversations on creativity, AI, and community.',
      es: 'Meetup del mes de la mujer en tecnología — celebramos el impacto de las mujeres en tech con conversaciones sobre creatividad, IA y comunidad.',
    },
    date: '2026-03-08',
    venue: {
      name: 'Universidad Tecnológica de Pereira',
      city: 'Pereira',
      country: 'Colombia',
    },
    mode: 'in-person',
    sourceImage:
      'tmp/pereiratechtalks.com/src/assets/images/posts/banners/4a8c1ypc.png',
    image: '/images/meetups/mujeres-en-tecnologia-2026/hero.png',
    speakers: [],
    sponsors: [],
    verticals: ['monthly-meetups'],
    linkMeetupCom: 'https://luma.com/4a8c1ypc',
    status: 'announced',
  },
  {
    slug: 'de-vuetify-a-edge-computing',
    sourceFile: 'xjga6v67-de-vuetify-a-edge-computing.mdx',
    title: {
      en: 'From Vuetify to Edge Computing — 2026 Opening Meetup',
      es: 'Desde Vuetify hasta el Edge Computing — Meetup de Apertura 2026',
    },
    description: {
      en: 'Opening meetup of 2026 — Vuetify ecosystem reflections plus an edge-computing deep dive. Talks, snacks, and networking.',
      es: 'Meetup de apertura de 2026 — reflexiones sobre el ecosistema Vuetify más una inmersión en edge computing. Charlas, snacks y networking.',
    },
    date: '2026-02-17',
    venue: {
      name: 'Universidad Católica de Pereira',
      city: 'Pereira',
      country: 'Colombia',
    },
    mode: 'in-person',
    sourceImage:
      'tmp/pereiratechtalks.com/src/assets/images/posts/banners/xjga6v67.png',
    image: '/images/meetups/de-vuetify-a-edge-computing/hero.png',
    speakers: [],
    sponsors: [],
    verticals: ['monthly-meetups'],
    linkMeetupCom: 'https://luma.com/xjga6v67',
    status: 'completed',
  },
  {
    slug: 'el-futuro-de-la-ia',
    sourceFile: 'e0qp2vux-el-futuro-de-la-ia.mdx',
    title: {
      en: 'The future of AI: code, hardware, and agents',
      es: 'El Futuro de la IA: Código, Hardware y Agentes',
    },
    description: {
      en: 'Year-end meetup on how AI is transforming software engineering — agents, LLMs, RAG, and AI talking to real-world hardware.',
      es: 'Meetup de cierre de año sobre cómo la IA está transformando la ingeniería de software — agentes, LLMs, RAG y la IA conversando con hardware real.',
    },
    date: '2025-12-10',
    venue: {
      name: 'Universidad Tecnológica de Pereira',
      city: 'Pereira',
      country: 'Colombia',
    },
    mode: 'in-person',
    sourceImage:
      'tmp/pereiratechtalks.com/src/assets/images/posts/banners/e0qp2vux.png',
    image: '/images/meetups/el-futuro-de-la-ia/hero.png',
    speakers: ['sergio-florez'],
    sponsors: [],
    verticals: ['monthly-meetups', 'ai-channel'],
    linkMeetupCom: 'https://luma.com/e0qp2vux',
    status: 'completed',
  },
  {
    slug: 'lightning-talks-2025-11',
    sourceFile: 'yxlmeio5-lightning-talks.mdx',
    title: {
      en: 'Pereira Tech Lightning Talks — November 2025',
      es: 'Pereira Tech Lightning Talks — Noviembre 2025',
    },
    description: {
      en: 'A meetup of express talks on soft skills, GenAI, self-hosting, UI, UX, and more — first-stage opportunities for new speakers.',
      es: 'Un meetup de charlas exprés sobre soft skills, GenAI, self-hosting, UI, UX y más — primeras oportunidades de escenario para ponentes nuevos.',
    },
    date: '2025-11-19',
    venue: {
      name: 'Universidad Tecnológica de Pereira',
      city: 'Pereira',
      country: 'Colombia',
    },
    mode: 'in-person',
    sourceImage:
      'tmp/pereiratechtalks.com/src/assets/images/posts/banners/yxlmeio5.png',
    image: '/images/meetups/lightning-talks-2025-11/hero.png',
    speakers: [],
    sponsors: [],
    verticals: ['monthly-meetups', 'speaker-school'],
    linkMeetupCom: 'https://luma.com/yxlmeio5',
    status: 'completed',
  },
  {
    slug: 'conversatorio-hackathon',
    sourceFile: '0xil6wus-conversatorio.mdx',
    title: {
      en: 'PerTT Conversation: What is a Hackathon?',
      es: 'Conversatorio PerTT: ¿Qué es una Hackathon?',
    },
    description: {
      en: 'A panel-style conversation about hackathon culture, what to expect, and how to organize your first one in Pereira.',
      es: 'Conversatorio sobre la cultura de hackathons, qué esperar y cómo organizar la primera en Pereira.',
    },
    date: '2025-10-29',
    venue: {
      name: 'Universidad Tecnológica de Pereira',
      city: 'Pereira',
      country: 'Colombia',
    },
    mode: 'in-person',
    sourceImage:
      'tmp/pereiratechtalks.com/src/assets/images/posts/banners/0xil6wus.png',
    image: '/images/meetups/conversatorio-hackathon/hero.png',
    speakers: [],
    sponsors: [],
    verticals: ['monthly-meetups'],
    linkMeetupCom: 'https://luma.com/0xil6wus',
    status: 'completed',
  },
  {
    slug: 'conociendo-la-nube',
    sourceFile: 'ttd1exr8-conociendo-la-nube.mdx',
    title: { en: 'Knowing the cloud', es: 'Conociendo la nube' },
    description: {
      en: 'A day of Rust and cloud-native talks — modern, safe, high-performance development for the next decade.',
      es: 'Una jornada de charlas sobre Rust y cloud-native — desarrollo moderno, seguro y de alto rendimiento para la próxima década.',
    },
    date: '2025-09-24',
    venue: {
      name: 'Universidad Tecnológica de Pereira',
      city: 'Pereira',
      country: 'Colombia',
    },
    mode: 'in-person',
    sourceImage:
      'tmp/pereiratechtalks.com/src/assets/images/posts/banners/ttd1exr8.jpg',
    image: '/images/meetups/conociendo-la-nube/hero.jpg',
    speakers: [],
    sponsors: [],
    verticals: ['monthly-meetups'],
    linkMeetupCom: 'https://luma.com/ttd1exr8',
    status: 'completed',
  },
  {
    slug: 'noche-de-python-2025',
    sourceFile: '249625568-Noche-de-Python.mdx',
    title: { en: 'Python Night 2025', es: 'Noche de Python 2025' },
    description: {
      en: 'Python deep-dives — from data engineering to web frameworks to AI tooling. The Python community in Pereira shows up.',
      es: 'Inmersión en Python — desde ingeniería de datos hasta frameworks web y herramientas de IA. La comunidad Python de Pereira dice presente.',
    },
    date: '2025-08-13',
    venue: {
      name: 'Universidad Tecnológica de Pereira',
      city: 'Pereira',
      country: 'Colombia',
    },
    mode: 'in-person',
    sourceImage:
      'tmp/pereiratechtalks.com/src/assets/images/posts/banners/highres_529351165.jpg',
    image: '/images/meetups/noche-de-python-2025/hero.jpg',
    speakers: [],
    sponsors: [],
    verticals: ['monthly-meetups'],
    linkMeetupCom:
      'https://www.meetup.com/pereira-tech-talks/events/308000000/',
    status: 'completed',
  },
  {
    slug: 'noche-de-rust-2025',
    sourceFile: '249625568-Noche-de-Rust.mdx',
    title: { en: 'Rust Night 2025', es: 'Noche de Rust 2025' },
    description: {
      en: 'A meetup on Rust — fundamentals, why companies are betting on it, and a live look at what production Rust feels like.',
      es: 'Meetup sobre Rust — fundamentos, por qué las empresas están apostando por él y un vistazo en vivo a cómo se siente Rust en producción.',
    },
    date: '2025-07-23',
    venue: {
      name: 'Universidad Tecnológica de Pereira',
      city: 'Pereira',
      country: 'Colombia',
    },
    mode: 'in-person',
    sourceImage:
      'tmp/pereiratechtalks.com/src/assets/images/posts/banners/highres_529012667.jpg',
    image: '/images/meetups/noche-de-rust-2025/hero.jpg',
    speakers: [],
    sponsors: [],
    verticals: ['monthly-meetups'],
    linkMeetupCom:
      'https://www.meetup.com/pereira-tech-talks/events/307900000/',
    status: 'completed',
  },
  {
    slug: 'aprendiendo-con-vibe-coding',
    sourceFile: '249625568-aprendiendo-con-vibe-coding.mdx',
    title: {
      en: 'Learning with Vibe Coding',
      es: 'Aprendiendo con Vibe Coding',
    },
    description: {
      en: 'A meetup on vibe coding — pair-programming with AI agents to ship real software faster while staying in flow.',
      es: 'Meetup sobre vibe coding — pair-programming con agentes de IA para entregar software real más rápido sin salir del flow.',
    },
    date: '2025-06-18',
    venue: {
      name: 'Universidad Tecnológica de Pereira',
      city: 'Pereira',
      country: 'Colombia',
    },
    mode: 'in-person',
    sourceImage:
      'tmp/pereiratechtalks.com/src/assets/images/posts/banners/highres_528389589.jpg',
    image: '/images/meetups/aprendiendo-con-vibe-coding/hero.jpg',
    speakers: [],
    sponsors: [],
    verticals: ['monthly-meetups', 'ai-channel'],
    linkMeetupCom:
      'https://www.meetup.com/pereira-tech-talks/events/307800000/',
    status: 'completed',
  },
  {
    slug: 'continuous-testing-paralelizacion-y-observabilidad',
    sourceFile:
      '307796521-Continuous-Testing-Paralelización-de-Pruebas-y-Observabilidad.mdx',
    title: {
      en: 'Continuous Testing: Parallelization and Observability',
      es: 'Continuous Testing: Paralelización de Pruebas y Observabilidad',
    },
    description: {
      en: 'A meetup on continuous testing — scaling automated test suites without scaling headcount, and turning your tests into a real-time observability tool.',
      es: 'Meetup sobre continuous testing — escalar la automatización de pruebas sin escalar el equipo y convertir la suite en una herramienta de observabilidad en tiempo real.',
    },
    date: '2025-05-21',
    venue: {
      name: 'Universidad Tecnológica de Pereira',
      city: 'Pereira',
      country: 'Colombia',
    },
    mode: 'in-person',
    sourceImage:
      'tmp/pereiratechtalks.com/src/assets/images/posts/banners/highres_527929509.jpg',
    image:
      '/images/meetups/continuous-testing-paralelizacion-y-observabilidad/hero.jpg',
    speakers: [],
    sponsors: [],
    verticals: ['monthly-meetups'],
    linkMeetupCom:
      'https://www.meetup.com/pereira-tech-talks/events/307796521/',
    status: 'completed',
  },
  {
    slug: 'noche-de-ai-generativa-2025',
    sourceFile:
      '307304023-Noche-de-AI-Generativa-Generación-Procedural-y-Descubrimiento-de-Farmacos.mdx',
    title: {
      en: 'Generative AI Night: procedural generation and drug discovery',
      es: 'Noche de AI Generativa: generación procedural y descubrimiento de fármacos',
    },
    description: {
      en: 'Two talks on generative AI — procedural generation in games (Minecraft-style worlds) and applied LLMs in biotech research.',
      es: 'Dos charlas sobre IA generativa — generación procedural en videojuegos (mundos al estilo Minecraft) y LLMs aplicados a la investigación en biotecnología.',
    },
    date: '2025-04-24',
    venue: {
      name: 'Universidad Tecnológica de Pereira',
      city: 'Pereira',
      country: 'Colombia',
    },
    mode: 'in-person',
    sourceImage:
      'tmp/pereiratechtalks.com/src/assets/images/posts/banners/highres_527391836.jpg',
    image: '/images/meetups/noche-de-ai-generativa-2025/hero.jpg',
    speakers: [],
    sponsors: [],
    verticals: ['monthly-meetups', 'ai-channel'],
    linkMeetupCom:
      'https://www.meetup.com/pereira-tech-talks/events/307304023/',
    status: 'completed',
  },
  {
    slug: 'conoce-a-la-cloud-native-computing-foundation',
    sourceFile: '306731274-conoce-a-la-cloud-native-computing-foundation.mdx',
    title: {
      en: 'Meet the Cloud Native Computing Foundation',
      es: 'Conoce a la Cloud Native Computing Foundation',
    },
    description: {
      en: 'An introduction to the CNCF, its flagship projects (Kubernetes, Prometheus), and the right moment to migrate your workloads to Kubernetes.',
      es: 'Introducción a la CNCF, sus proyectos insignia (Kubernetes, Prometheus) y el momento adecuado para migrar tus cargas de trabajo a Kubernetes.',
    },
    date: '2025-03-26',
    venue: {
      name: 'Universidad Tecnológica de Pereira',
      city: 'Pereira',
      country: 'Colombia',
    },
    mode: 'in-person',
    sourceImage:
      'tmp/pereiratechtalks.com/src/assets/images/posts/banners/highres_526775455.jpg',
    image:
      '/images/meetups/conoce-a-la-cloud-native-computing-foundation/hero.jpg',
    speakers: [],
    sponsors: [],
    verticals: ['monthly-meetups'],
    linkMeetupCom:
      'https://www.meetup.com/pereira-tech-talks/events/306731274/',
    status: 'completed',
  },
  {
    slug: 'inauguracion-gdg-pereira',
    sourceFile: '306256947-inauguracin-gdg-pere.mdx',
    title: { en: 'GDG Pereira launch', es: 'Inauguración GDG Pereira' },
    description: {
      en: 'Pereira tech communities — Pereira Tech Talks, CINCO, Pereira JS, JointDeveloper, and Python Pereira — joined forces to launch the local Google Developer Groups chapter.',
      es: 'Las comunidades tech de Pereira — Pereira Tech Talks, CINCO, Pereira JS, JointDeveloper y Python Pereira — se unieron para inaugurar el capítulo local de Google Developer Groups.',
    },
    date: '2025-02-22',
    venue: {
      name: 'Universidad Tecnológica de Pereira',
      city: 'Pereira',
      country: 'Colombia',
    },
    mode: 'in-person',
    sourceImage:
      'tmp/pereiratechtalks.com/src/assets/images/posts/banners/highres_526346495.jpeg',
    image: '/images/meetups/inauguracion-gdg-pereira/hero.jpeg',
    speakers: [],
    sponsors: [],
    verticals: ['monthly-meetups'],
    linkMeetupCom:
      'https://www.meetup.com/pereira-tech-talks/events/306256947/',
    status: 'completed',
  },
];
