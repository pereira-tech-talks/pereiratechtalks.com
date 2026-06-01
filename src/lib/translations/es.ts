/**
 * Spanish translations
 */

import type { SiteTranslations } from './types';

export const es: SiteTranslations = {
  // Site metadata
  siteTitle: 'Pereira Tech Talks',
  siteTitleFull:
    'Pereira Tech Talks — Comunidad bilingüe de tecnología de Pereira, Colombia',
  siteDescription:
    'Comunidad bilingüe de constructores, conferencistas y aprendices que dan forma al futuro de la tecnología desde Pereira, Colombia, hacia el mundo.',

  // Navigation
  nav: {
    home: 'Inicio',
    blog: 'Blog',
    about: 'Sobre nosotros',
    contact: 'Contacto',
    slides: 'Slides',
    meetups: 'Meetups',
    pereiraTechDays: 'Pereira Tech Days',
    speakers: 'Ponentes',
    talks: 'Charlas',
    sponsors: 'Patrocinadores',
    contributors: 'Equipo',
    verticals: 'Programas',
    channels: 'Canales',
    press: 'Prensa',
    community: 'Comunidad',
  },

  // Footer
  footer: {
    copyright: 'Pereira Tech Talks',
    allRightsReserved: 'Todos los derechos reservados.',
  },

  // Homepage hero
  hero: {
    tagline: 'Comunidad tecnológica bilingüe · Pereira, Risaralda · Desde 2014',
    description:
      'Somos <strong class="text-white">Pereira Tech Talks</strong> — una comunidad de constructores, conferencistas y aprendices que da forma al futuro de la tecnología. Hacemos meetups mensuales, organizamos el <em>Pereira Tech Day</em>, dirigimos una Escuela de Speakers y curamos una biblioteca de conocimiento bilingüe que conecta el talento local con el ecosistema tecnológico global.',
    typewriterWords: [
      'Meetups mensuales de tecnología',
      'Pereira Tech Day',
      'Escuela de Speakers',
      'La Biblioteca del Mañana',
      'Biblioteca de conocimiento bilingüe',
    ],
  },

  // Homepage sections
  homeSections: {
    about: {
      title: "Somos <span class='text-secondary'>Pereira Tech Talks</span>",
      description: `Una comunidad nacida en Pereira, Risaralda, que organiza meetups, talleres y conferencias de tecnología desde 2014. Reunimos a ingenieras e ingenieros, diseñadoras y diseñadores, fundadoras y fundadores, estudiantes y entusiastas alrededor de una creencia compartida: la tecnología crece más rápido cuando compartimos lo que aprendemos.<br /><br />
Hoy operamos varios programas — meetups mensuales, la conferencia anual <strong>Pereira Tech Day</strong>, la <strong>Escuela de Speakers</strong> para nuevas voces y el club de lectura <strong>La Biblioteca del Mañana</strong> — todo con una voz bilingüe EN/ES que conecta el talento local con el ecosistema global.<br /><br />
Todo lo que publicamos aquí — artículos, recapitulaciones, slides — es gratuito, construido por la comunidad y compatible con agentes de IA. Explora el blog, conoce los meetups o escríbenos si quieres ser ponente, patrocinador o sumarte.`,
      cta: 'Sobre la comunidad',
      cta2: 'Escríbenos',
    },
    community: {
      title: 'Lo que hacemos',
      subtitle: 'Meetups, conferencias, escuelas y bibliotecas',
      description:
        'Cada mes nos reunimos para compartir charlas, talleres y sesiones lightning sobre los temas que están dando forma a la industria: IA y agentes, plataformas web, devops, móvil, seguridad y el oficio de construir software a escala. Una vez al año celebramos el <strong>Pereira Tech Day</strong>, nuestra conferencia insignia donde la comunidad se encuentra con ponentes internacionales y aliados. Durante el año dirigimos la <strong>Escuela de Speakers</strong> para hacer crecer nuevas voces y el club de lectura <strong>La Biblioteca del Mañana</strong> para conectar la tecnología con la historia humana en sentido amplio. Todas y todos son bienvenidos: quienes están comenzando, las personas con mayor experiencia, estudiantes, fundadores, curiosas y curiosos.',
      cta: 'Conócenos más',
    },
    latestArticles: 'Últimos artículos',
    viewAllPosts: 'Ver todos los artículos',
  },

  // Contact section (homepage)
  contact: {
    title: 'Contacto',
    nameLabel: 'Nombre',
    namePlaceholder: 'Tu nombre',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'tu@correo.com',
    messageLabel: 'Mensaje',
    messagePlaceholder: 'Escribe tu mensaje...',
    sendButton: 'Enviar mensaje',
  },

  // About page
  aboutPage: {
    title: 'Sobre Pereira Tech Talks',
    subtitle: 'Una comunidad bilingüe de tecnología desde Pereira al mundo',
    description:
      'Conoce a Pereira Tech Talks — una comunidad bilingüe de tecnología en Pereira, Risaralda, que desde 2014 organiza meetups, la conferencia Pereira Tech Day, la Escuela de Speakers y el club de lectura La Biblioteca del Mañana.',
    heroDescription:
      'Una comunidad de constructoras y constructores, conferencistas y aprendices que da forma al futuro de la tecnología desde Pereira, Risaralda, Colombia. Fundada en 2014. Bilingüe EN/ES. Siempre abierta.',
    bioTitle: 'Quiénes somos',
    bioText:
      'Pereira Tech Talks (PTT) es la comunidad de tecnología de Pereira, Risaralda, Colombia. Nacimos en 2014 como un pequeño grupo de ingenieras, ingenieros y diseñadoras que querían un espacio para compartir lo que estaban aprendiendo. Una década después, la comunidad creció hasta convertirse en una organización con múltiples programas: meetups mensuales, la conferencia anual <strong>Pereira Tech Day</strong>, la <strong>Escuela de Speakers</strong>, el club de lectura <strong>La Biblioteca del Mañana</strong> y un canal dedicado de IA — todo con una voz bilingüe EN/ES y una mirada internacional.<br /><br />Nuestro trabajo es voluntario, sostenido por patrocinadores y abierto. El sitio web que estás leyendo es la columna operativa: un catálogo bilingüe de meetups, charlas, slides, ponentes, contribuyentes y patrocinadores, diseñado para ser tan legible para agentes de IA como para personas.<br /><br />Creemos que la tecnología crece más rápido cuando compartimos lo que aprendemos. Creemos que Pereira tiene talento de talla mundial que merece escenarios de talla mundial. Creemos que una comunidad de tecnología debería parecerse a la ciudad en la que vive — abierta, cálida, mixta y sin pretensiones.',
    passionsTitle: 'Lo que hacemos',
    passions: [
      {
        title: 'Meetups mensuales',
        description:
          'Sesiones presenciales e híbridas cada mes — charlas, talleres y rondas lightning sobre los temas que dan forma a la industria.',
        icon: '\u{1F465}',
        link: '/es/blog',
      },
      {
        title: 'Pereira Tech Day',
        description:
          'Nuestra conferencia anual insignia — un día completo de keynotes, talleres y networking con ponentes internacionales y aliados locales.',
        icon: '\u{1F389}',
        link: '/es/blog',
      },
      {
        title: 'Escuela de Speakers',
        description:
          'Un programa para hacer crecer nuevas voces técnicas — desde la idea hasta el escenario — con mentoría, ensayos y rehearsals.',
        icon: '\u{1F3A4}',
        link: '/es/blog',
      },
      {
        title: 'La Biblioteca del Mañana',
        description:
          'Un club de lectura que conecta ciencia ficción, filosofía y tecnología — explorando el futuro a través de los libros que lo moldean.',
        icon: '\u{1F4DA}',
        link: '/es/blog',
      },
      {
        title: 'Canal de IA',
        description:
          'Un track dedicado a IA, LLMs, agentes y la web agéntica — donde la comunidad se encuentra con la tecnología más disruptiva de la década.',
        icon: '\u{1F916}',
        link: '/es/blog',
      },
      {
        title: 'Biblioteca bilingüe',
        description:
          'Artículos, slides y recapitulaciones publicadas en inglés y español — accesibles tanto para el talento local como para la comunidad tecnológica internacional.',
        icon: '\u{1F30D}',
        link: '/es/blog',
      },
    ],
    quickFactsTitle: 'Datos rápidos',
    quickFacts: [
      'Fundada en Pereira, Risaralda, Colombia (2014)',
      'Comunidad bilingüe: español e inglés',
      'Más de 90 meetups mensuales desde 2014',
      'Múltiples ediciones de Pereira Tech Day organizadas',
      'Voluntaria, sostenida por patrocinadores y gratuita',
      'Contenido completamente legible por agentes de IA (AEO 100)',
      'Filosofía: comparte lo que aprendes, haz crecer el ecosistema local',
    ],
    ctaTitle: '¿Quieres ser parte?',
    ctaDescription:
      'Si quieres ser ponente, patrocinador, aliado o simplemente asistir — hay un lugar para ti. Escríbenos y construyamos juntas y juntos el próximo capítulo de la comunidad.',
    ctaCv: 'Leer el blog',
    ctaContact: 'Escríbenos',
  },

  // Slides listing page
  slidesPage: {
    title: 'Slides',
    subtitle: 'Decks de nuestros meetups, conferencias y talleres',
    description:
      'Explora todos los decks de slides de los meetups de Pereira Tech Talks, las ediciones de Pereira Tech Day y las sesiones de la Escuela de Speakers — presentaciones bilingües de las y los ponentes de la comunidad.',
    heroDescription:
      'Una biblioteca bilingüe de presentaciones de los eventos de Pereira Tech Talks — meetups, Pereira Tech Day, Escuela de Speakers y talleres. Construidas internamente con Reveal.js o alojadas en plataformas externas.',
    timelineTitle: 'Todos los slides',
    emptyState: '¡Aún no hay slides publicados! Vuelve pronto.',
    viewAll: 'Ver todos los slides',
  },

  // Slides / deck pages
  slides: {
    exitToCatalog: 'Volver a Slides',
    printPdf: 'Imprimir como PDF',
    languageSwitch: 'View in English',
    external: {
      openCta: 'Abrir en {provider}',
      backToCatalog: 'Volver al catálogo',
    },
    languageNotice: 'El deck original está en {lang}',
    typeBadge: {
      native: 'Nativo',
      external: 'Externo',
    },
    toolbar: {
      backToCatalog: 'Volver al catálogo',
      switchLang: 'Cambiar a {lang}',
      themeToLight: 'Cambiar a modo claro',
      themeToDark: 'Cambiar a modo oscuro',
      enterFullscreen: 'Entrar en pantalla completa',
      exitFullscreen: 'Salir de pantalla completa',
    },
  },

  // Contact page
  contactPage: {
    title: 'Contacto',
    subtitle: 'Sé ponente, patrocinador, aliado — o simplemente saluda',
    description:
      'Escríbele a Pereira Tech Talks — abierta a ponentes, patrocinadores, aliados y miembros de la comunidad que quieran participar, proponer ideas o colaborar.',
    heroDescription:
      'Estamos siempre abiertas y abiertos a nuevas y nuevos ponentes, patrocinadores, aliados y miembros de la comunidad. Ya sea que tengas una charla por proponer, quieras patrocinar un meetup o solo decir hola — nos encantaría saber de ti.',
    formTitle: 'Envíanos un mensaje',
    nameLabel: 'Nombre',
    namePlaceholder: 'Tu nombre',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'tu@correo.com',
    reasonLabel: 'Quiero contactarlos por',
    reasonOptions: [
      { value: '', label: '— Selecciona un tema —' },
      { value: 'general', label: 'General / Solo decir hola' },
      { value: 'tech-talk', label: 'Propuesta de ponencia / Charla' },
      {
        value: 'collaboration',
        label: 'Colaboración con la comunidad / Alianza',
      },
      { value: 'project', label: 'Patrocinio / Sponsorship' },
      {
        value: 'the-library-of-tomorrow',
        label: 'Sumarme a La Biblioteca del Mañana',
      },
      { value: 'other', label: 'Otro' },
    ],
    subjectLabel: 'Asunto',
    subjectPlaceholder: '¿De qué se trata?',
    messageLabel: 'Mensaje',
    messagePlaceholder: 'Escribe tu mensaje...',
    sendButton: 'Enviar mensaje',
    sendingButton: 'Enviando...',
    successTitle: '¡Mensaje enviado!',
    successMessage:
      'Gracias por escribirnos. Te responderemos lo antes posible.',
    sendAnotherButton: 'Enviar otro mensaje',
    requiredField: 'Este campo es obligatorio',
    invalidEmail: 'Por favor ingresa un correo electrónico válido',
    fallbackMessage:
      'El formulario de contacto no está disponible. Puedes escribirnos directamente por correo.',
    fallbackEmailText: 'Escríbenos a',
    formNote: 'Te responderemos lo antes posible.',
    socialTitle: 'Conéctate con nosotros',
    locationTitle: 'Ubicación',
    locationText:
      'Basados en Pereira, Risaralda, Colombia. Bilingües EN/ES. Abiertos a aliados remotos y a ponentes internacionales en cualquier parte del mundo.',
    prefillSubjects: {
      generalInquiry: 'Consulta general',
      collaboration: 'Colaboración con la comunidad',
      projectInquiry: 'Consulta de patrocinio',
      projectCollaboration: 'Propuesta de alianza',
      startupCollaboration: 'Colaboración con startup',
      techTalkInvitation: 'Propuesta de ponencia',
    },
  },

  contactSection: {
    title: 'Conectemos',
    description:
      'Estamos siempre abiertas y abiertos a nuevas conversaciones — ponentes, patrocinadores, aliados y miembros curiosos de la comunidad. Escríbenos y construyamos juntas y juntos el próximo capítulo.',
    ctaText: 'Escríbenos',
    ctaLink: '/es/contact?topic=general&subject=Consulta%20General',
  },

  // Search input
  searchPlaceholder: 'Buscar artículos...',
  searchHint: 'Tip: presiona Esc para limpiar la búsqueda.',
  clearSearch: 'Limpiar',
  resultsFound: (count) =>
    `${count} resultado${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`,

  // Loading states
  loadingIndex: 'Cargando índice de búsqueda...',
  searching: 'Buscando artículos...',

  // Results
  noResults: (query) =>
    `No se encontraron artículos que coincidan con "${query}"`,
  noResultsSuggestion:
    'Prueba con una palabra clave más amplia o explora todos los artículos.',
  noPostsAvailable: 'Aún no hay artículos disponibles.',

  // Pagination
  previous: 'Anterior',
  next: 'Siguiente',
  pageOf: (current, total) => `Página ${current} de ${total}`,

  // Blog header
  blogTitle: 'Blog',
  blogHeading: 'Artículos e historias',
  blogDescription:
    'Artículos, recapitulaciones y tutoriales de la comunidad Pereira Tech Talks',
  allPosts: 'Todos los artículos',
  showingArticles: (showing, total) =>
    `Mostrando ${showing} de ${total} artículos`,
  articlesAvailable: (total) =>
    `${total} artículo${total !== 1 ? 's' : ''} disponible${total !== 1 ? 's' : ''}`,
  lastUpdatedOn: 'Actualizado',
  readingTime: (minutes) => `${minutes} min de lectura`,
  relatedArticles: 'Artículos relacionados',
  relatedArticlesDescription: 'Estos artículos también podrían interesarte',

  // Series navigation
  seriesPartOf: 'Parte de la serie',
  seriesChapter: (n) => `Capítulo ${n}`,
  seriesPrevious: 'Capítulo anterior',
  seriesNext: 'Siguiente capítulo',
  seriesToC: 'Todos los capítulos',
  seriesChapterOf: (current, total) => `Capítulo ${current} de ${total}`,

  // Floating indicators that link a blog post to its companion slide deck (and back).
  slideIndicator: {
    label: 'Slides',
    subtitle: 'Abrir deck →',
    ariaLabel: 'Abrir deck de slides complementario',
  },
  postIndicator: {
    label: 'Artículo',
    subtitle: 'Leer artículo →',
    ariaLabel: 'Leer el artículo de blog complementario',
  },

  // Series pages
  seriesPage: {
    title: 'Series',
    breadcrumb: 'Series',
    chapters: 'capítulos',
    chapter: 'Capítulo',
    progress: (current, total) => `${current} de ${total} capítulos`,
    readChapter: 'Leer capítulo',
    emptyState: 'Aún no hay artículos en esta serie.',
    backToSeries: 'Todas las series',
    backToBlog: 'Volver al blog',
    startReading: 'Comenzar a leer',
    continueReading: 'Continuar leyendo',
  },
  seriesListingPage: {
    title: 'Series del blog',
    description:
      'Colecciones curadas de artículos en varios capítulos de la comunidad Pereira Tech Talks — análisis profundos sobre tecnología, ingeniería de software y el oficio de construir.',
    heading: 'Series',
    postsCount: (count) => `${count} ${count === 1 ? 'capítulo' : 'capítulos'}`,
    exploreSeries: 'Explorar series',
    emptyState: 'Aún no hay series publicadas.',
  },

  // Scheduled posts (dev-only indicators)
  scheduledBadge: 'Programado',
  scheduledBannerTitle: 'Artículo programado',
  scheduledBannerMessage: (date) =>
    `Este artículo se publicará el ${date}. Solo es visible en modo de desarrollo.`,

  // Draft posts (dev + preview indicators)
  draftBadge: 'Borrador',
  draftBannerTitle: 'Artículo en borrador',
  draftBannerMessage:
    'Este artículo está en construcción. Es visible aquí porque estás en el servidor de desarrollo o en una rama de previsualización; no se publicará hasta que se elimine la marca de borrador.',

  // Tags
  postsTagged: (tag) => `Artículos etiquetados con "${tag}"`,
  allTags: 'Todas las etiquetas',
  tagNames: {
    // Primary tags
    tech: 'Tecnología',
    talks: 'Charlas',
    community: 'Comunidad',
    keynote: 'Keynote',
    workshop: 'Taller',
    'lightning-talk': 'Lightning Talk',
    // Secondary tags (topics)
    'web-development': 'Desarrollo Web',
    javascript: 'JavaScript',
    ai: 'IA y ML',
    blockchain: 'Blockchain',
    devops: 'DevOps',
    python: 'Python',
    university: 'Universidad',
    database: 'Bases de Datos',
    iot: 'IoT',
    design: 'Diseño',
    mobile: 'Móvil',
    'ai-agents': 'Agentes de IA',
    // Subtopic tags
    astro: 'Astro',
    svelte: 'Svelte',
    cloudflare: 'Cloudflare',
    docker: 'Docker',
    graphql: 'GraphQL',
    django: 'Django',
    kotlin: 'Kotlin',
    claude: 'Claude',
    mcp: 'MCP',
    flutter: 'Flutter',
  },
  tagDescriptions: {
    // Primary tags
    tech: 'Tutoriales, guías y artículos técnicos de la comunidad.',
    talks: 'Charlas, slides, videos y eventos.',
    community:
      'Artículos centrados en la comunidad — recapitulaciones de meetups, gobernanza, organización del ecosistema local.',
    keynote:
      'Keynotes — presentaciones insignia de Pereira Tech Day y eventos principales.',
    workshop:
      'Talleres prácticos — sesiones de varias horas con código, ejercicios y guía paso a paso.',
    'lightning-talk':
      'Lightning talks — presentaciones cortas de 5 a 10 minutos con una idea contundente.',
    // Secondary tags (topics)
    'web-development':
      'Frameworks, frontend, fullstack — Astro, Svelte, Vue, Meteor, CSS, Webpack.',
    javascript:
      'Ecosistema JavaScript — Vue.js, Webpack, Meteor, A-Frame, Node.',
    ai: 'Inteligencia artificial, machine learning, deep learning y LLMs.',
    blockchain:
      'Blockchain, criptomonedas, Bitcoin, Ethereum y contratos inteligentes.',
    devops: 'Docker, contenedores, serverless, microservicios y despliegue.',
    python: 'Ecosistema Python — Django, TensorFlow, MyPy, Spark.',
    university: 'Trabajos académicos, investigación y proyectos estudiantiles.',
    database: 'SQL, NoSQL, MongoDB y arquitectura multi-base de datos.',
    iot: 'Internet de las cosas, sensores, hardware e interfaces de voz.',
    design: 'Diseño visual, branding, diseño web y UX.',
    mobile:
      'Desarrollo móvil — Android, iOS, frameworks multiplataforma y el camino de aprender a publicar para dispositivos móviles.',
    'ai-agents':
      'Agentes de IA y la web agéntica — sistemas autónomos, uso de herramientas, patrones de orquestación, MCP y los estándares .well-known para agentes.',
    // Subtopic tags
    astro:
      'Framework Astro — arquitectura de islas, Content Collections, MDX y builds estáticos.',
    svelte:
      'Svelte y SvelteKit — componentes reactivos, runes y patrones de hidratación.',
    cloudflare:
      'Cloudflare Pages, Workers, R2 y la plataforma de la web agéntica.',
    docker:
      'Contenedores Docker, autoría de Dockerfiles y orquestación de múltiples servicios.',
    graphql:
      'APIs GraphQL — esquemas, resolvers, federación y patrones de cliente.',
    django:
      'Framework Django — ORM, configuraciones multi-base, admin y despliegue.',
    kotlin:
      'Lenguaje y ecosistema Kotlin — Kotlin Multiplatform, Compose Multiplatform, Android, herramientas para JVM.',
    claude:
      'Claude — la familia de modelos de Anthropic y los runtimes de agentes construidos sobre ellos (Claude Code, Skills, Files API).',
    mcp: 'Model Context Protocol — comunicación estandarizada agente↔herramienta, tarjetas de servidor y la capa de estándares de la web agéntica.',
    flutter:
      'Flutter — framework móvil multiplataforma basado en Dart, widgets y los trade-offs frente a nativo y Kotlin Multiplatform.',
  },

  // Series names and descriptions (keyed by series slug). Vacío durante la transición a v3.0.0.
  seriesNames: {},
  seriesDescriptions: {},

  // Date formatting
  dateLocale: 'es-ES',

  // Read more
  readMore: 'Leer más',

  // Scroll to timeline
  scrollToTimeline: 'Ver línea de tiempo',
  viewLabel: (label: string) => `Ver ${label}`,

  // 404 page
  notFoundPage: {
    title: 'Página no encontrada',
    description:
      'La página que buscas no existe o fue movida. Explora el blog o vuelve al inicio para seguir navegando por la comunidad de Pereira Tech Talks.',
    heading: 'Página no encontrada',
    message:
      'Lo sentimos, la página que buscas no existe o pudo haber sido movida. Intenta volver a la página de inicio o buscar en el blog.',
    backHome: 'Volver al inicio',
    searchBlog: 'Buscar en el blog',
  },

  // Blog post engagement
  engagement: {
    // Share buttons
    shareTitle: 'Compartir este artículo',
    shareSeriesTitle: 'Compartir esta serie',
    shareOnTwitter: 'Compartir en X',
    shareOnLinkedIn: 'Compartir en LinkedIn',
    shareOnWhatsApp: 'Compartir en WhatsApp',
    copyLink: 'Copiar enlace',
    linkCopied: '¡Enlace copiado!',

    // Newsletter
    newsletterTitle: 'Mantente al tanto',
    newsletterDescription:
      'Te avisaremos cuando la comunidad publique nuevos artículos, recapitulaciones o anuncios de eventos. Sin spam, puedes cancelar tu suscripción cuando quieras.',
    newsletterPlaceholder: 'tu@correo.com',
    newsletterButton: 'Suscribirme',
    newsletterSubmitting: 'Suscribiendo...',
    newsletterSuccessTitle: '¡Estás suscrito!',
    newsletterSuccessMessage:
      'Gracias por suscribirte. Sabrás de nosotros cuando publiquemos algo nuevo.',
    newsletterInvalidEmail: 'Por favor ingresa un correo electrónico válido.',
    newsletterAlreadySubscribed: 'Ya estás suscrito. ¡Gracias por estar aquí!',
    newsletterResubscribe: 'Suscribirme con otro correo',
    newsletterPrivacy: 'Sin spam. Puedes darte de baja en cualquier momento.',

    // End-of-post CTA
    ctaTitle: '¿Te gustó este artículo?',
    ctaDescription:
      'Compártelo con tu red o suscríbete para recibir los últimos artículos de la comunidad en tu correo.',
  },

  // Blog engagement (author + share)
  blogEngagement: {
    aboutAuthor: 'Sobre el autor',
    writtenBy: 'Escrito por',
  },

  // Errors
  searchError: 'Ocurrió un error al buscar. Por favor, inténtalo de nuevo.',
  loadError:
    'No se pudo cargar el índice de búsqueda. Por favor, recarga la página.',
  retry: 'Reintentar',
};
