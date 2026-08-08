// Pereira Tech Talks v3.0.0 — Task 17 content migration: shared seed data.
// Pure data; consumed by run-migration.mjs and per-collection scripts.

export const TAGS = [
  {
    slug: 'community',
    name: 'community',
    description: 'Community-building, organizing, and meetup operations.',
    tier: 'primary',
    order: 50,
  },
  {
    slug: 'keynote',
    name: 'keynote',
    description: 'Keynote-format talks at PTT events.',
    tier: 'subtopic',
    parent: 'tech',
    order: 60,
  },
  {
    slug: 'workshop',
    name: 'workshop',
    description: 'Hands-on technical workshops.',
    tier: 'subtopic',
    parent: 'tech',
    order: 61,
  },
  {
    slug: 'lightning-talk',
    name: 'lightning-talk',
    description: 'Short-form lightning talks (5–10 min).',
    tier: 'subtopic',
    parent: 'tech',
    order: 62,
  },
];

export const CHANNELS = [
  {
    slug: 'meetup-com',
    name: 'Meetup.com — Pereira Tech Talks',
    platform: 'meetup-com',
    url: 'https://www.meetup.com/pereira-tech-talks/',
    description: {
      en: 'Primary RSVP channel for in-person and hybrid Pereira Tech Talks meetups.',
      es: 'Canal principal de RSVP para los meetups presenciales e híbridos de Pereira Tech Talks.',
    },
    audience: {
      en: 'Anyone who wants to attend a meetup.',
      es: 'Cualquiera que quiera asistir a un meetup.',
    },
    isPrimary: true,
    order: 1,
  },
  {
    slug: 'linktree',
    name: 'Linktree — Pereira Tech Talks',
    platform: 'linktree',
    url: 'https://linktr.ee/pertechtalks',
    description: {
      en: 'One link with all our active channels and current events.',
      es: 'Un único enlace con todos nuestros canales activos y eventos del momento.',
    },
    audience: {
      en: 'New community members looking for an entry point.',
      es: 'Personas nuevas en la comunidad que buscan un punto de entrada.',
    },
    isPrimary: false,
    order: 2,
  },
  {
    slug: 'github',
    name: 'GitHub — Pereira Tech Talks',
    platform: 'github',
    url: 'https://github.com/pereira-tech-talks',
    description: {
      en: 'Open-source projects, this website, and community tooling.',
      es: 'Proyectos open source, este sitio web y herramientas de la comunidad.',
    },
    audience: {
      en: 'Builders and contributors.',
      es: 'Constructores y contribuyentes.',
    },
    isPrimary: false,
    order: 3,
  },
  {
    slug: 'linkedin',
    name: 'LinkedIn — Pereira Tech Talks',
    platform: 'linkedin',
    url: 'https://www.linkedin.com/company/pereira-tech-talks/',
    description: {
      en: 'Professional updates, event announcements, and speaker callouts.',
      es: 'Actualizaciones profesionales, anuncios de eventos y convocatorias para ponentes.',
    },
    audience: {
      en: 'Professionals tracking the local tech scene.',
      es: 'Profesionales que siguen la escena tecnológica local.',
    },
    isPrimary: false,
    order: 4,
  },
  {
    slug: 'instagram',
    name: 'Instagram — Pereira Tech Talks',
    platform: 'instagram',
    url: 'https://www.instagram.com/pertechtalks',
    description: {
      en: 'Behind-the-scenes photos, event highlights, and speaker spotlights.',
      es: 'Fotos de detrás de cámara, resúmenes de eventos y reflectores sobre los ponentes.',
    },
    audience: {
      en: 'Visual followers of the community.',
      es: 'Seguidores visuales de la comunidad.',
    },
    isPrimary: false,
    order: 5,
  },
];

export const VERTICALS = [
  {
    slug: 'speaker-school',
    title: { en: 'Speaker School', es: 'Speaker School' },
    shortName: { en: 'Speakers', es: 'Ponentes' },
    mission: {
      en: 'Train new technical speakers and help them deliver their first talk.',
      es: 'Formamos a nuevas voces técnicas y las acompañamos hasta su primera charla.',
    },
    description: {
      en: 'Speaker School is the path that turns curious community members into confident technical speakers. We coach storytelling, slide design, demo discipline, and stage presence so anyone with something to share can get on stage.',
      es: 'Speaker School es la ruta que convierte a curiosos de la comunidad en ponentes técnicos seguros. Acompañamos la narración, el diseño de slides, la disciplina de demos y la presencia en escenario para que cualquiera con algo que compartir llegue al stage.',
    },
    leaders: ['sergio-florez'],
    channels: ['meetup-com'],
    schedule: {
      en: 'Monthly cohort kickoffs, biweekly mentorship sessions.',
      es: 'Inicios de cohorte mensuales, sesiones de mentoría quincenales.',
    },
    status: 'active',
    order: 1,
  },
  {
    slug: 'library-of-tomorrow',
    title: { en: 'La Biblioteca del Mañana', es: 'La Biblioteca del Mañana' },
    shortName: { en: 'Library', es: 'Biblioteca' },
    mission: {
      en: 'A living archive of the talks, slides, and recordings the community has produced.',
      es: 'Un archivo vivo de las charlas, slides y grabaciones que la comunidad ha producido.',
    },
    description: {
      en: 'La Biblioteca del Mañana indexes every talk, slide deck, and write-up the community has produced — bilingual, searchable, and citable. The goal: any newcomer can stand on the shoulders of every meetup that came before.',
      es: 'La Biblioteca del Mañana indexa cada charla, slide y artículo que ha producido la comunidad — bilingüe, buscable y citable. El objetivo: que cualquier persona nueva pueda apoyarse en cada meetup que vino antes.',
    },
    leaders: ['sergio-florez'],
    channels: ['github'],
    schedule: {
      en: 'Updated continuously after every meetup.',
      es: 'Se actualiza continuamente después de cada meetup.',
    },
    status: 'active',
    order: 2,
  },
  {
    slug: 'ai-channel',
    title: { en: 'AI Channel', es: 'Canal de IA' },
    shortName: { en: 'AI', es: 'IA' },
    mission: {
      en: 'Track the practical use of AI engineering across the community.',
      es: 'Rastrear el uso práctico de AI engineering en toda la comunidad.',
    },
    description: {
      en: 'The AI Channel curates talks, demos, and threads about applied AI engineering — agents, RAG, evals, fine-tuning — with a strong bias toward what works in production.',
      es: 'El Canal de IA cura charlas, demos e hilos sobre AI engineering aplicado — agentes, RAG, evals, fine-tuning — con un fuerte sesgo hacia lo que funciona en producción.',
    },
    leaders: ['sergio-florez'],
    channels: ['linkedin'],
    schedule: {
      en: 'Quarterly AI deep-dive meetups, ongoing async threads.',
      es: 'Meetups de IA en profundidad cada trimestre y conversaciones asíncronas continuas.',
    },
    status: 'active',
    order: 3,
  },
  {
    slug: 'monthly-meetups',
    title: { en: 'Monthly Meetups', es: 'Meetups Mensuales' },
    shortName: { en: 'Meetups', es: 'Meetups' },
    mission: {
      en: 'Run consistent, high-quality monthly meetups in Pereira.',
      es: 'Hacer meetups mensuales consistentes y de alta calidad en Pereira.',
    },
    description: {
      en: 'The flagship of the community: a monthly meetup in Pereira, on the third week of the month, with two technical talks and an open mic for lightning talks.',
      es: 'El programa insignia de la comunidad: un meetup mensual en Pereira, en la tercera semana del mes, con dos charlas técnicas y un micrófono abierto para lightning talks.',
    },
    leaders: ['sergio-florez'],
    channels: ['meetup-com', 'linktree'],
    schedule: {
      en: 'Third week of every month, 6:30 PM Pereira time.',
      es: 'Tercera semana de cada mes, 6:30 PM hora Pereira.',
    },
    status: 'active',
    order: 4,
  },
];

export const SPONSORS = [
  {
    slug: 'github',
    name: 'GitHub',
    logoLight: '/images/sponsors/github-light.png',
    logoDark: '/images/sponsors/github-dark.png',
    logoAlt: 'GitHub logo',
    url: 'https://github.com/',
    description: {
      en: 'The home for software collaboration. Sponsor of Pereira Tech Day 2024 (gold tier).',
      es: 'El hogar de la colaboración en software. Patrocinador de Pereira Tech Day 2024 (oro).',
    },
    tier: 'gold',
    sponsoredEditions: [{ year: 2024, tier: 'gold' }],
    status: 'active',
    order: 1,
  },
  {
    slug: 'source-meridian',
    name: 'Source Meridian',
    logoLight: '/images/sponsors/source-meridian.png',
    logoDark: '/images/sponsors/source-meridian.png',
    logoAlt: 'Source Meridian logo',
    url: 'https://sourcemeridian.com/',
    description: {
      en: 'Software product partner. Sponsor of Pereira Tech Day 2024 (gold tier).',
      es: 'Aliado de productos de software. Patrocinador de Pereira Tech Day 2024 (oro).',
    },
    tier: 'gold',
    sponsoredEditions: [{ year: 2024, tier: 'gold' }],
    status: 'active',
    order: 2,
  },
  {
    slug: 'ase-utp',
    name: 'ASE-UTP',
    logoLight: '/images/sponsors/ase-utp.png',
    logoDark: '/images/sponsors/ase-utp.png',
    logoAlt: 'Asociación Egresados Sistemas UTP logo',
    url: 'https://egresados.utp.edu.co/',
    description: {
      en: 'Asociación de Egresados de Sistemas, Universidad Tecnológica de Pereira. Sponsor of Pereira Tech Day 2024 (gold tier).',
      es: 'Asociación de Egresados de Sistemas de la Universidad Tecnológica de Pereira. Patrocinador de Pereira Tech Day 2024 (oro).',
    },
    tier: 'gold',
    sponsoredEditions: [{ year: 2024, tier: 'gold' }],
    status: 'active',
    order: 3,
  },
  {
    slug: 'dailybot',
    name: 'DailyBot',
    logoLight: '/images/sponsors/dailybot.png',
    logoDark: '/images/sponsors/dailybot.png',
    logoAlt: 'DailyBot logo',
    url: 'https://www.dailybot.com/',
    description: {
      en: 'AI assistants for high-performing teams. Sponsor of Pereira Tech Day 2024 (silver tier).',
      es: 'Asistentes de IA para equipos de alto desempeño. Patrocinador de Pereira Tech Day 2024 (plata).',
    },
    tier: 'silver',
    sponsoredEditions: [{ year: 2024, tier: 'silver' }],
    status: 'active',
    order: 4,
  },
  {
    slug: 'gorilla-logic',
    name: 'Gorilla Logic',
    logoLight: '/images/sponsors/gorilla-logic.png',
    logoDark: '/images/sponsors/gorilla-logic.png',
    logoAlt: 'Gorilla Logic logo',
    url: 'https://gorillalogic.com/',
    description: {
      en: 'Custom software development for ambitious products. Sponsor of Pereira Tech Day 2024 (silver tier).',
      es: 'Desarrollo de software a la medida para productos ambiciosos. Patrocinador de Pereira Tech Day 2024 (plata).',
    },
    tier: 'silver',
    sponsoredEditions: [{ year: 2024, tier: 'silver' }],
    status: 'active',
    order: 5,
  },
  {
    slug: 'made-for-germany',
    name: 'Made for Germany',
    logoLight: '/images/sponsors/made-for-germany.png',
    logoDark: '/images/sponsors/made-for-germany.png',
    logoAlt: 'Made for Germany logo',
    url: 'https://www.made-for-germany.eu/apply/',
    description: {
      en: 'Tech career bridge to Germany. Community sponsor of Pereira Tech Day 2024.',
      es: 'Puente para carreras tech hacia Alemania. Patrocinador comunidad de Pereira Tech Day 2024.',
    },
    tier: 'community',
    sponsoredEditions: [{ year: 2024, tier: 'community' }],
    status: 'active',
    order: 6,
  },
];

// PTD 2024 keynote speakers (4) + 2 lightning-talk speakers
export const SPEAKERS = [
  {
    slug: 'vanessa-aristizabal',
    name: 'Vanessa Aristizabal',
    pronouns: 'she/her',
    role: {
      en: 'Frontend Developer · Google Developer Expert · GitHub Star',
      es: 'Frontend Developer · Google Developer Expert · GitHub Star',
    },
    bio: {
      en: 'Vanessa is a Systems Engineer with deep web-development experience. She is a Google Developer Expert in Angular and web technologies and a GitHub Star recognized for her contributions to the community. As a content creator she shares her passion for tech, books, design, illustration, and especially code with a JavaScript focus, championing personal and professional growth through technology.',
      es: 'Vanessa es Ingeniera de Sistemas con experiencia profunda en desarrollo web. Es Google Developer Expert en Angular y tecnologías web y GitHub Star, reconocida por sus contribuciones a la comunidad. Como creadora de contenido, comparte su pasión por la tecnología, los libros, el diseño, la ilustración y, especialmente, el código con un enfoque en JavaScript, impulsando el crecimiento personal y profesional a través de la tecnología.',
    },
    photoSrc: '/images/speakers/vanessa-aristizabal.jpg',
    photoAlt: {
      en: 'Portrait of Vanessa Aristizabal',
      es: 'Retrato de Vanessa Aristizabal',
    },
    social: {
      linkedin: 'https://www.linkedin.com/in/vanessa-marely-aristizabal-angel/',
      twitter: 'https://twitter.com/vanessamarely',
    },
    location: { city: 'Bogotá', country: 'Colombia' },
    languages: ['es', 'en'],
  },
  {
    slug: 'karolina-ladino',
    name: 'Karolina Ladino',
    pronouns: 'she/her',
    role: {
      en: 'Product Manager · PyLadies Bogotá · PyConCo co-organizer',
      es: 'Product Manager · PyLadies Bogotá · co-organizadora de PyConCo',
    },
    bio: {
      en: 'Karo is a Product Manager, robotics engineer, maker, and jeweler. She leads PyLadies Bogotá and Colombia, is part of Python Colombia, and co-organizes PyConCo. With more than ten years building hardware and software across industries, she is passionate about creating opportunities and spaces for the personal and professional growth of others.',
      es: 'Karo es Product Manager, ingeniera en robótica, maker y joyera. Lidera PyLadies Bogotá y Colombia, forma parte de Python Colombia y es co-organizadora de PyConCo. Con más de diez años creando hardware y software para diversas industrias, le apasiona generar oportunidades y espacios para el crecimiento personal y profesional de las personas.',
    },
    photoSrc: '/images/speakers/karolina-ladino.jpeg',
    photoAlt: {
      en: 'Portrait of Karolina Ladino',
      es: 'Retrato de Karolina Ladino',
    },
    social: { linkedin: 'https://www.linkedin.com/in/karobotco/' },
    location: { city: 'Bogotá', country: 'Colombia' },
    languages: ['es'],
  },
  {
    slug: 'jose-jaramillo',
    name: 'Jose Alfredo Jaramillo',
    pronouns: 'he/him',
    role: {
      en: 'Researcher · Scientific Director at LRC Systems',
      es: 'Investigador · Director Científico en LRC Systems',
    },
    bio: {
      en: "Dr. Jaramillo is an Electronic Engineer (Pontificia Universidad Javeriana), holds a Master's in Physics Instrumentation (UTP), and a PhD from Purdue University. He has been a professor and director of the Sirius research group at UTP and is the Scientific Director of the Laboratory for Research in Complex Systems in California, USA.",
      es: 'El Dr. Jaramillo es Ingeniero Electrónico de la Pontificia Universidad Javeriana, magíster en Instrumentación Física de la UTP y doctor por Purdue University. Fue profesor y director del Grupo de Investigación Sirius de la UTP y es el Director Científico del Laboratory for Research in Complex Systems en California, EE. UU.',
    },
    photoSrc: '/images/speakers/jose-jaramillo.jpg',
    photoAlt: {
      en: 'Portrait of Jose Alfredo Jaramillo',
      es: 'Retrato de Jose Alfredo Jaramillo',
    },
    social: { linkedin: 'https://www.linkedin.com/in/josejaramillov/' },
    location: { city: 'California', country: 'United States' },
    languages: ['es', 'en'],
  },
  {
    slug: 'cesar-camacho',
    name: 'César Camacho',
    pronouns: 'he/him',
    role: { en: 'Co-founder at Hubu', es: 'Cofundador en Hubu' },
    bio: {
      en: 'César has a background in Finance from Universidad Sergio Arboleda. He started in mass-transit, then helped a Spanish software factory expand into Colombia, opening doors into tech and innovation. He founded Osyva, a B2B veterinary marketplace selected by 500 Startups, and now co-founded Hubu, a company offering AI-driven data analytics for businesses.',
      es: 'César es financista de la Universidad Sergio Arboleda. Comenzó en la industria del transporte masivo, luego trajo a Colombia una fábrica de software española y abrió las puertas al mundo tech e innovación. Fundó Osyva, marketplace B2B en la industria veterinaria seleccionado por 500 Startups, y actualmente cofundó Hubu, empresa que ofrece analítica de datos con IA para negocios.',
    },
    photoSrc: '/images/speakers/cesar-camacho.jpg',
    photoAlt: {
      en: 'Portrait of César Camacho',
      es: 'Retrato de César Camacho',
    },
    social: {
      linkedin: 'https://www.linkedin.com/in/c%C3%A9sar-camacho-92bb5a21a/',
    },
    location: { city: 'Bogotá', country: 'Colombia' },
    languages: ['es'],
  },
  {
    slug: 'jonathan-alvarez',
    name: 'Jonathan Alvarez',
    pronouns: 'he/him',
    role: {
      en: 'Tech Lead · Sr. Software Engineer at Litentry',
      es: 'Tech Lead · Sr. Software Engineer en Litentry',
    },
    bio: {
      en: 'Tech lead and senior software engineer focused on Web3 infrastructure. Lightning-talk presenter at Pereira Tech Day 2024 on the topic of giving your first talk.',
      es: 'Tech lead y senior software engineer enfocado en infraestructura Web3. Ponente lightning de Pereira Tech Day 2024 sobre dar tu primera charla.',
    },
    photoSrc: '/images/speakers/jonathan-alvarez.jpeg',
    photoAlt: {
      en: 'Portrait of Jonathan Alvarez',
      es: 'Retrato de Jonathan Alvarez',
    },
    social: { github: 'http://github.com/jonalvarezz' },
    location: { city: 'Pereira', country: 'Colombia' },
    languages: ['es'],
  },
  {
    slug: 'sebastian-franco',
    name: 'Sebastian Franco Gomez',
    pronouns: 'he/him',
    role: {
      en: 'ML Engineer at Expert Intelligence',
      es: 'ML Engineer en Expert Intelligence',
    },
    bio: {
      en: 'Machine-learning engineer turned AI engineer. Lightning-talk presenter at Pereira Tech Day 2024 on understanding modern ML architectures and styles.',
      es: 'Ingeniero de machine learning, ahora AI engineer. Ponente lightning de Pereira Tech Day 2024 sobre comprender las arquitecturas y estilos del ML moderno.',
    },
    photoSrc: '/images/speakers/sebastian-franco.jpeg',
    photoAlt: {
      en: 'Portrait of Sebastian Franco',
      es: 'Retrato de Sebastian Franco',
    },
    social: { github: 'https://github.com/thefrancho' },
    location: { city: 'Pereira', country: 'Colombia' },
    languages: ['es'],
  },
];

// PTD 2024 organizers (7) — also serve as the contributors seed.
export const CONTRIBUTORS = [
  {
    slug: 'carolina-gomez-trejos',
    name: 'Carolina Gómez Trejos',
    pronouns: 'she/her',
    avatar: '/images/contributors/carolina-gomez-trejos.jpg',
    roles: ['organizer'],
    role: {
      en: 'Pereira Tech Day Lead Organizer',
      es: 'Organizadora líder de Pereira Tech Day',
    },
    bio: {
      en: 'Carolina co-leads Pereira Tech Day production end to end — venue, schedule, speakers, sponsors, and on-site experience.',
      es: 'Carolina lidera la producción de Pereira Tech Day de punta a punta: venue, agenda, ponentes, patrocinadores y experiencia en sitio.',
    },
    social: { linkedin: 'https://www.linkedin.com/in/carolinagomezt/' },
    activeSince: '2023-01-01',
    order: 1,
  },
  {
    slug: 'jose-felipe-duarte',
    name: 'Jose Felipe Duarte',
    pronouns: 'he/him',
    avatar: '/images/contributors/jose-felipe-duarte.png',
    roles: ['organizer'],
    role: {
      en: 'Pereira Tech Day Co-organizer',
      es: 'Co-organizador de Pereira Tech Day',
    },
    bio: {
      en: 'Jose Felipe co-organizes Pereira Tech Day with a focus on speaker curation and sponsor relationships.',
      es: 'Jose Felipe co-organiza Pereira Tech Day con un foco en curar ponentes y gestionar relaciones con patrocinadores.',
    },
    social: { linkedin: 'https://www.linkedin.com/in/josefeldc/' },
    activeSince: '2023-01-01',
    order: 2,
  },
  {
    slug: 'stiven-cardona-monsalve',
    name: 'Stiven Cardona Monsalve',
    pronouns: 'he/him',
    avatar: '/images/contributors/stiven-cardona-monsalve.jpeg',
    roles: ['organizer'],
    role: {
      en: 'Pereira Tech Day Co-organizer',
      es: 'Co-organizador de Pereira Tech Day',
    },
    bio: {
      en: 'Stiven co-organizes Pereira Tech Day operations and community partnerships.',
      es: 'Stiven co-organiza la operación de Pereira Tech Day y las alianzas con la comunidad.',
    },
    social: { linkedin: 'https://www.linkedin.com/in/stiven-cardona-monsalve' },
    activeSince: '2023-01-01',
    order: 3,
  },
  {
    slug: 'alejandro-rendon',
    name: 'Alejandro E. Rendon',
    pronouns: 'he/him',
    avatar: '/images/contributors/alejandro-rendon.jpg',
    roles: ['organizer'],
    role: {
      en: 'Pereira Tech Day Co-organizer',
      es: 'Co-organizador de Pereira Tech Day',
    },
    bio: {
      en: 'Alejandro contributes to Pereira Tech Day production from the diaspora, bringing perspective from international tech ecosystems.',
      es: 'Alejandro contribuye a la producción de Pereira Tech Day desde la diáspora, aportando perspectiva de ecosistemas tech internacionales.',
    },
    social: { linkedin: 'https://www.linkedin.com/in/arendondiosa/' },
    activeSince: '2023-01-01',
    order: 4,
  },
  {
    slug: 'angelica-aguirre',
    name: 'Angelica Aguirre',
    pronouns: 'she/her',
    avatar: '/images/contributors/angelica-aguirre.png',
    roles: ['organizer'],
    role: {
      en: 'Pereira Tech Day Co-organizer',
      es: 'Co-organizadora de Pereira Tech Day',
    },
    bio: {
      en: 'Angelica supports Pereira Tech Day organization, attendee experience, and community outreach.',
      es: 'Angelica apoya la organización de Pereira Tech Day, la experiencia del asistente y la divulgación a la comunidad.',
    },
    social: {
      linkedin:
        'https://www.linkedin.com/in/angelica-aguirre-castro-50abb5110/',
    },
    activeSince: '2023-01-01',
    order: 5,
  },
  {
    slug: 'melisa-escobar',
    name: 'Melisa Escobar Gutierrez',
    pronouns: 'she/her',
    avatar: '/images/contributors/melisa-escobar.png',
    roles: ['organizer'],
    role: {
      en: 'Pereira Tech Day Co-organizer',
      es: 'Co-organizadora de Pereira Tech Day',
    },
    bio: {
      en: 'Melisa contributes to Pereira Tech Day organization with attention to inclusion and accessibility.',
      es: 'Melisa contribuye a la organización de Pereira Tech Day con foco en inclusión y accesibilidad.',
    },
    social: { linkedin: 'https://www.linkedin.com/in/m3lissaeg/' },
    activeSince: '2023-01-01',
    order: 6,
  },
  {
    slug: 'sergio-florez',
    name: 'Sergio Alexander Florez Galeano',
    pronouns: 'he/him',
    avatar: '/images/contributors/sergio-florez.png',
    roles: ['founding-organizer'],
    role: {
      en: 'Co-founder · Pereira Tech Talks',
      es: 'Cofundador · Pereira Tech Talks',
    },
    bio: {
      en: 'Co-founder of Pereira Tech Talks. Builds the community website, leads the Speaker School, and obsesses over the craft of community-building.',
      es: 'Cofundador de Pereira Tech Talks. Construye el sitio web de la comunidad, lidera la Speaker School y se obsesiona con el oficio de construir comunidad.',
    },
    social: {
      linkedin: 'https://www.linkedin.com/in/xergioalex/',
      github: 'https://github.com/xergioalex',
      x: 'https://x.com/pertechtalks',
    },
    activeSince: '2014-02-27',
    order: 0,
  },
];
