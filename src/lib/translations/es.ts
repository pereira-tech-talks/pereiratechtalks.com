/**
 * Spanish translations
 */

import type { SiteTranslations } from './types';

export const es: SiteTranslations = {
  // Site metadata
  siteTitle: 'Pereira Tech Talks',
  siteTitleFull:
    'Pereira Tech Talks — Comunidad de tecnología de Pereira, Colombia',
  siteDescription:
    'Pereira Tech Talks — comunidad tech de Pereira, Colombia desde 2014. 90+ meetups mensuales, Pereira Tech Day y Escuela de Speakers.',

  // Navigation
  nav: {
    home: 'Inicio',
    blog: 'Blog',
    about: 'Sobre nosotros',
    contact: 'Contacto',
    slides: 'Slides',
    meetups: 'Meetups',
    pereiraTechDays: 'Pereira Tech Day',
    speakers: 'Ponentes',
    talks: 'Charlas',
    calendar: 'Calendario',
    communities: 'Comunidades aliadas',
    sponsors: 'Patrocinadores',
    contributors: 'Equipo',
    verticals: 'Programas',
    channels: 'Canales',
    press: 'Prensa',
    community: 'Comunidad',
    menu: 'Menú',
    closeMenu: 'Cerrar menú',
    openMenu: 'Abrir menú',
  },

  // Footer
  footer: {
    copyright: 'Pereira Tech Talks',
    allRightsReserved: 'Todos los derechos reservados.',
  },

  // Homepage hero
  hero: {
    tagline: 'Pereira, Risaralda · Desde 2014',
    description:
      'Comunidad abierta para aprender en público, compartir lo que sabes y crecer en compañía. Aquí caben quienes empiezan, quienes ya llevan camino y quienes quieren mentorear. Buscamos curiosidad, voces nuevas y gente con ganas de construir — talento local con mirada global y propósito compartido.',
    ctaMeetups: 'Ver meetups',
    ctaPtd: 'Pereira Tech Day 2026',
    ctaContact: 'Escríbenos',
    scrollLabel: 'Bajar',
    typewriterWords: [
      'Meetups mensuales',
      'Pereira Tech Day',
      'Escuela de Speakers',
      'La Biblioteca del Mañana',
      'Canal de IA y Agentes',
    ],
  },

  // Homepage sections
  homeSections: {
    about: {
      title:
        "Somos <span class='text-ptt-primary dark:text-ptt-primary-dark'>Pereira Tech Talks</span>",
      description: `Somos una comunidad interdisciplinar que conecta el talento local y regional — quienes programan, diseñan, emprenden, estudian o simplemente tienen curiosidad — alrededor de la tecnología que estamos construyendo juntos.<br /><br />
Nos reunimos para compartir lo que aprendemos, abrir escenarios a nuevas voces y tejer redes que cruzan Pereira, Risaralda y el resto de LATAM. Meetups, <strong>Pereira Tech Day</strong>, la <strong>Escuela de Speakers</strong> y más: espacios voluntarios, abiertos y hechos para que cualquiera pueda sumarse.<br /><br />
Si buscas gente con quien crecer, un escenario para tu primera charla o una comunidad que te reciba de verdad — aquí hay un lugar para ti. Explora, ven al próximo encuentro o escríbenos.`,
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
    meetups: {
      eyebrow: 'Calendario',
      upcomingTitle: 'Próximos meetups',
      latestTitle: 'Últimos meetups',
      cta: 'Ver todos los meetups',
    },
    verticals: {
      eyebrow: 'Programas',
      title: 'Programas de la comunidad',
      subtitle:
        'Cuatro frentes que sostienen lo que hacemos: meetups mensuales, Escuela de Speakers, La Biblioteca del Mañana y el Canal IA.',
      cta: 'Conocer los programas',
    },
    ptd: {
      eyebrow: 'Evento anual',
      title: 'Pereira Tech Day',
      subtitle:
        'Una jornada al año donde la comunidad se reúne con speakers internacionales para celebrar lo que construimos.',
      cta: 'Explorar todas las ediciones',
    },
    ptdStrip: {
      eyebrow: 'Agosto 22, 2026 — 08:00 AM',
      title: 'Pereira Tech Day 2026',
      subtitle: 'Donde el talento, la tecnología y las marcas se encuentran.',
      cta: 'Explorar Pereira Tech Day 2026',
      date: 'sábado, 22 de agosto de 2026',
      venue: 'UTP: Auditorio Jorge Roa Martínez, Pereira',
      attendance: '300+ asistentes esperados',
      postponedEyebrow: 'Comunicado de la organización',
      postponedCta: 'Leer el comunicado',
    },
    sponsors: {
      eyebrow: 'Patrocinadores Actuales',
      title: 'La comunidad existe gracias a',
      subtitle:
        'Empresas y aliados comunitarios que aportan venues, catering, becas y mentoría.',
      cta: 'Ver todos los patrocinadores',
      ctaJoin: 'Quiero patrocinar',
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

  meetupsPage: {
    title: 'Meetups de Pereira Tech Talks',
    description:
      '{meetups} meetups, {talks} charlas y {speakers} ponentes desde {sinceYear}. El archivo mensual completo de la comunidad tech del Eje Cafetero en Pereira, Risaralda.',
    intro:
      'Cada mes nos reunimos para compartir charlas, romper el hielo entre comunidades y mantener viva la curiosidad técnica. Aquí está el archivo completo.',
    upcoming: 'Próximos meetups',
    past: 'Meetups pasados',
    allMeetups: 'Todos los meetups',
    emptyUpcomingTitle: 'No hay meetups anunciados todavía',
    emptyUpcomingDescription:
      'Estamos coordinando las próximas fechas con speakers y venues. Síguenos en redes para saber primero.',
    ctaLuma: 'Síguenos en Luma',
    eyebrow: 'Archivo de la comunidad',
    statMeetups: 'Meetups',
    statTalks: 'Charlas',
    statSpeakers: 'Ponentes',
    statSince: 'Desde',
    nextUpLabel: 'Próximo encuentro',
    nextUpCta: 'Mira lo que sigue',
    yearLabel: '{year} — Meetups del año',
    yearNav: 'Saltar al año',
    calendarEyebrow: 'Calendario',
    archiveEyebrow: 'Archivo',
    breadcrumbHome: 'Inicio',
  },

  meetupDetail: {
    talks: 'Charlas',
    untranslatedBody:
      'Esta reseña aún no está traducida — mostramos el texto original en español.',
    speakers: 'Ponentes',
    sponsors: 'Patrocinadores',
    sponsorsSubtitle: 'Empresas que apoyaron este meetup.',
    venue: 'Sede',
    originalEvent: 'Evento original',
    recording: 'Grabación',
    watchRecording: 'Ver grabación',
    photosExternal: 'Álbum de fotos',
    galleryMemories: 'Memorias del evento',
    statusAnnounced: 'Próximamente',
    statusRsvpOpen: 'RSVP abierto',
    statusCompleted: 'Meetup pasado',
    statusCancelled: 'Cancelado',
    breadcrumbHome: 'Inicio',
    breadcrumbMeetups: 'Meetups',
  },

  speakerDetail: {
    talkHistory: 'Historial de charlas',
    talkHistorySubtitle: 'De la más reciente a la más antigua.',
    relatedEvents: 'Eventos relacionados',
    relatedEventsSubtitle:
      'Meetups y Pereira Tech Days vinculados a estas charlas.',
    breadcrumbHome: 'Inicio',
    breadcrumbSpeakers: 'Ponentes',
    website: 'Sitio web',
  },

  aboutPage: {
    title: 'Sobre Pereira Tech Talks',
    subtitle: 'Una comunidad de tecnología desde Pereira al mundo',
    description:
      'Conoce Pereira Tech Talks — comunidad tech en Pereira, Risaralda, desde 2014. Meetups, Pereira Tech Day, Escuela de Speakers y La Biblioteca del Mañana.',
    heroDescription:
      'La comunidad tecnológica de Pereira (Risaralda, Colombia). Fundada en 2014. Meetups mensuales, Pereira Tech Day, una Escuela de Speakers activa y una biblioteca de contenido en español e inglés. Voluntaria. Abierta para todas y todos.',
    bioTitle: 'Quiénes somos',
    bioText:
      'Pereira Tech Talks (PTT) es la comunidad tecnológica de Pereira, Risaralda, Colombia. La historia empieza en febrero de 2014: ocho desarrolladores en un salón de la UTP para el primer meetup de PereiraJS. Doce años después, ese círculo pequeño es una comunidad de cuatro programas — meetups mensuales (84 y contando), la conferencia anual <strong>Pereira Tech Day</strong> (archivo 2024, próxima 2026), la <strong>Escuela de Speakers</strong> y el club de lectura <strong>La Biblioteca del Mañana</strong>. Todo construido por voluntariado. Todo abierto.<br /><br />El trabajo se sostiene gracias a patrocinadores (DailyBot, GitHub, ASE-UTP, Gorilla Logic, Made for Germany, Source Meridian, y más) y es abierto por defecto. El sitio que estás leyendo es un catálogo de meetups, charlas, slides, ponentes, contribuyentes y patrocinadores — disponible en español e inglés — estructurado para ser tan útil a agentes de IA como a personas.<br /><br />Creemos que la tecnología crece más rápido cuando compartimos lo que aprendemos — por eso cada recapitulación de meetup se publica esa misma semana. Creemos que Pereira tiene talento de talla mundial que merece escenarios de talla mundial — por eso existe la Escuela de Speakers y por eso egresadas y egresados de la comunidad hoy dan keynotes en Bogotá, Medellín, Ciudad de México y en startups respaldadas por YC. Y creemos que una comunidad de tecnología debería parecerse a la ciudad en la que vive — abierta, cálida, mixta y sin pretensiones. Por eso nuestros eventos son gratuitos, nuestros canales son públicos y nuestro contenido se publica en español e inglés.',
    passionsTitle: 'Lo que hacemos',
    passions: [
      {
        title: 'Meetups mensuales',
        description:
          'Sesiones presenciales e híbridas cada mes — charlas, talleres y rondas lightning sobre IA, plataformas web, devops, móvil, seguridad y el oficio de publicar software.',
        icon: '\u{1F465}',
        link: '/verticals/monthly-meetups',
      },
      {
        title: 'Pereira Tech Day',
        description:
          'Nuestra conferencia anual insignia — 2024 en archivo, 2026 a continuación. Un día completo de keynotes, talleres y networking con ponentes internacionales y aliados locales.',
        icon: '\u{1F389}',
        link: '/pereira-tech-day',
      },
      {
        title: 'Escuela de Speakers',
        description:
          'Un programa para hacer crecer nuevas voces técnicas — desde la idea hasta el escenario — con mentoría y ensayos. Sus egresadas y egresados hoy dan keynotes en Bogotá, Medellín y Ciudad de México.',
        icon: '\u{1F3A4}',
        link: '/verticals/speaker-school',
      },
      {
        title: 'La Biblioteca del Mañana',
        description:
          'Un club de lectura que conecta ciencia ficción, filosofía y tecnología — explorando el futuro a través de los libros que lo moldean.',
        icon: '\u{1F4DA}',
        link: '/verticals/library-of-tomorrow',
      },
      {
        title: 'Canal de IA y Agentes',
        description:
          'Un track dedicado a IA, LLMs, agentes y la web agéntica — donde la comunidad se encuentra con la tecnología más disruptiva de la década.',
        icon: '\u{1F916}',
        link: '/verticals/ai-channel',
      },
      {
        title: 'Biblioteca de contenidos',
        description:
          'Artículos, slides y recapitulaciones publicadas en español e inglés — accesibles tanto para el talento local como para la comunidad tecnológica internacional.',
        icon: '\u{1F30D}',
        link: '/blog',
      },
    ],
    quickFactsTitle: 'Datos rápidos',
    quickFacts: [
      'Fundada en Pereira, Risaralda, Colombia (febrero de 2014)',
      'Sitio disponible en español (principal) e inglés',
      '90+ meetups mensuales desde 2014',
      'Ediciones de Pereira Tech Day en 2024 y 2026',
      'Voluntaria, sostenida por patrocinadores y gratuita',
      'Contenido completamente legible por agentes de IA (AEO 100, Markdown-for-Agents en cada página)',
      'Open source: el sitio, el contenido y el brand kit en GitHub',
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
      'Explora decks de slides de meetups, Pereira Tech Day y la Escuela de Speakers — presentaciones de ponentes de la comunidad Pereira Tech Talks.',
    heroDescription:
      'Una biblioteca de presentaciones de los eventos de Pereira Tech Talks — meetups, Pereira Tech Day, Escuela de Speakers y talleres. Construidas internamente con Reveal.js o alojadas en plataformas externas.',
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
      { value: 'general', label: 'General / Solo saludar' },
      {
        value: 'collaboration',
        label: 'Colaboración comunitaria / Alianza',
      },
      {
        value: 'the-library-of-tomorrow',
        label: 'Unirme a La Biblioteca del Mañana',
      },
      { value: 'press', label: 'Prensa / Medios' },
      { value: 'other', label: 'Otro' },
    ],
    successNextSteps: {
      general:
        'Te responderemos tan pronto como podamos — normalmente en pocos días hábiles.',
      'tech-talk':
        'Revisamos propuestas todo el año y respondemos en máximo 7 días hábiles.',
      sponsorship:
        'Un organizador te contactará en máximo 5 días hábiles sobre niveles y siguientes pasos.',
      collaboration:
        'Te conectaremos con el organizador adecuado en pocos días hábiles.',
      'the-library-of-tomorrow':
        'Un anfitrión de La Biblioteca del Mañana te escribirá con la próxima sesión.',
      press: 'El equipo de prensa responderá lo antes posible.',
      conduct:
        'Tu mensaje se trata con confidencialidad por el equipo de conducta.',
      other: 'Te responderemos tan pronto como podamos.',
    },
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
    submitError:
      'No pudimos entregar tu mensaje en este momento. Inténtalo nuevamente en unos minutos o escríbenos a pereiratechtalks@gmail.com.',
    fallbackMessage:
      'El formulario de contacto no está disponible. Puedes escribirnos directamente por correo.',
    fallbackEmailText: 'Escríbenos a',
    formNote: 'Te responderemos lo antes posible.',
    socialTitle: 'Conéctate con nosotros',
    locationTitle: 'Ubicación',
    locationText:
      'Basados en Pereira, Risaralda, Colombia. Sitio disponible en español e inglés. Abiertos a aliados remotos y a ponentes internacionales en cualquier parte del mundo.',
    quickLinksTitle: 'Enlaces rápidos',
    quickLinks: [
      {
        label: 'Call for Speakers',
        href: '/call-for-speakers',
        description: 'Postula una charla para meetups o Pereira Tech Day.',
      },
      {
        label: 'Patrocínanos',
        href: '/sponsor-us',
        description:
          'Aliá tu marca con la comunidad tech más activa del Eje Cafetero.',
      },
      {
        label: 'Canales',
        href: '/channels',
        description: 'Luma, GitHub, LinkedIn y más.',
      },
      {
        label: 'Calendario comunitario',
        href: '/calendar',
        description: 'Próximos meetups y eventos de comunidades aliadas.',
      },
    ],
    meetInPersonTitle: 'Encuéntranos en persona',
    meetInPersonText:
      'La mayoría de meetups mensuales son en Pereira — Universidad Tecnológica de Pereira, coworkings y venues aliados en Risaralda. Revisa la página de meetups para la próxima fecha y lugar.',
    prefillSubjects: {
      generalInquiry: 'Consulta general',
      collaboration: 'Colaboración con la comunidad',
      projectInquiry: 'Consulta de patrocinio',
      projectCollaboration: 'Propuesta de alianza',
      startupCollaboration: 'Colaboración con startup',
      techTalkInvitation: 'Propuesta de ponencia',
    },
  },

  communitiesPage: {
    title: 'Comunidades aliadas',
    description:
      'Comunidades tech aliadas en Pereira: PereiraJS, Python Pereira, JointDev, QA Conf, Backbone UTP y más. Ecosistema colaborativo del Eje Cafetero.',
    eyebrow: 'Ecosistema',
    heroLead:
      'Pereira Tech Talks no existe en el vacío. Crecemos junto a otras comunidades de la ciudad que comparten venues, calendarios y escenarios.',
    narrativeTitle: 'Un ecosistema, muchas comunidades',
    narrativeText:
      'Pereira Tech Talks es el paraguas de meetups mensuales y Pereira Tech Day. Las comunidades aliadas son grupos especializados — JavaScript, Python, QA, emprendimiento universitario — que co-producen eventos, hacen cross-promo en canales y amplían el alcance del tech en Risaralda.',
    alliesTitle: 'Comunidades aliadas',
    allianceTitle: 'Cómo colaboramos',
    allianceSteps: [
      'Escenarios compartidos en Pereira Tech Day y eventos insignia',
      'Cross-post en Luma, LinkedIn y canales comunitarios',
      'Meetups temáticos y talleres co-organizados',
      'Invitación cruzada de ponentes entre programas',
      'Calendario público en /calendar con eventos de comunidades aliadas',
    ],
    ctaTitle: '¿Tu comunidad quiere sumarse?',
    ctaDescription:
      'Si lideras un grupo tech en Pereira o Risaralda y quieres explorar una alianza formal, escríbenos. Siempre estamos abiertos a nuevas colaboraciones.',
    ctaPrimary: 'Proponer alianza',
    ctaSecondary: 'Ver nuestros canales',
    visitLabel: 'Visitar comunidad',
  },

  cfsForm: {
    formTitle: 'Postula tu charla',
    talkTitleLabel: 'Título de la charla',
    talkTitlePlaceholder: 'Un título claro y específico',
    formatLabel: 'Formato',
    formatOptions: [
      { value: '', label: '— Selecciona un formato —' },
      { value: 'regular', label: 'Charla regular (25 min)' },
      { value: 'lightning', label: 'Lightning (5–10 min)' },
      { value: 'panel', label: 'Panel (40 min)' },
      { value: 'workshop', label: 'Workshop (90 min)' },
    ],
    abstractLabel: 'Abstract',
    abstractPlaceholder: '3–5 oraciones sobre lo que vas a cubrir…',
    takeawaysLabel: 'Aprendizajes clave',
    takeawaysPlaceholder: '¿Con qué se debería ir la audiencia?',
    socialLabel: 'LinkedIn, blog o GitHub',
    socialPlaceholder: 'https://…',
    firstTimeLabel: 'Sería mi primera charla en Pereira Tech Talks',
    speakerSchoolLabel: 'Me interesa la mentoría de Speaker School',
    notesLabel: '¿Algo más que debamos saber?',
    notesPlaceholder: 'Fechas preferidas, co-ponentes, necesidades AV…',
    submitButton: 'Enviar postulación',
    successTitle: '¡Propuesta recibida!',
    successMessage:
      'Gracias — te responderemos en máximo 7 días hábiles para alinear fecha y formato.',
    defaultSubject: 'Postulación a Call for Speakers',
  },
  sponsorForm: {
    formTitle: 'Consulta de patrocinio',
    companyLabel: 'Empresa / marca',
    companyPlaceholder: 'Nombre de la empresa',
    roleLabel: 'Tu rol',
    rolePlaceholder: 'p. ej. Marketing, Founder',
    tierLabel: 'Nivel de interés',
    tierOptions: [
      { value: '', label: '— Selecciona un nivel —' },
      { value: 'diamond', label: 'Diamante' },
      { value: 'gold', label: 'Oro' },
      { value: 'silver', label: 'Plata' },
      { value: 'bronze', label: 'Bronce' },
      { value: 'community', label: 'Comunidad' },
      { value: 'unsure', label: 'Aún no estoy seguro/a' },
    ],
    contributionLabel: 'Tipo de aporte',
    contributionOptions: [
      { value: '', label: '— Selecciona —' },
      { value: 'cash', label: 'Monetario' },
      { value: 'in-kind', label: 'En especie (venue, comida, swag…)' },
      { value: 'both', label: 'Ambos' },
      { value: 'unsure', label: 'Aún no estoy seguro/a' },
    ],
    messageLabel: 'Cuéntanos tus objetivos',
    messagePlaceholder: 'Hiring, marca, edición PTD, serie de meetups…',
    submitButton: 'Enviar consulta de patrocinio',
    successTitle: '¡Consulta recibida!',
    successMessage:
      'Gracias — un organizador te contactará en máximo 5 días hábiles.',
    defaultSubject: 'Consulta de patrocinio',
  },
  speakerSchoolForm: {
    formTitle: 'Aplicación a Speaker School',
    formEyebrow: 'Aplicar',
    formSectionTitle: 'Únete a la próxima cohorte de Speaker School',
    experienceLabel: 'Nivel de experiencia',
    experienceOptions: [
      { value: '', label: '— Selecciona un nivel —' },
      { value: 'beginner', label: 'Principiante' },
      { value: 'intermediate', label: 'Intermedio' },
      { value: 'advanced', label: 'Avanzado' },
    ],
    goalsLabel: 'Objetivos para Speaker School',
    goalsPlaceholder: '¿Qué quieres lograr con la mentoría?',
    topicsLabel: 'Temas de interés',
    topicsPlaceholder: 'p. ej. plataformas web, IA, devops, producto…',
    availabilityLabel: 'Disponibilidad',
    availabilityPlaceholder: 'Noches, fines de semana, meses preferidos…',
    priorSpeakingLabel: 'Experiencia previa hablando (opcional)',
    priorSpeakingPlaceholder: 'Meetups, clases, charlas internas…',
    socialLabel: 'LinkedIn, blog o GitHub (opcional)',
    socialPlaceholder: 'https://…',
    messageLabel: '¿Algo más? (opcional)',
    messagePlaceholder: 'Restricciones, co-mentees, idioma preferido…',
    submitButton: 'Enviar aplicación',
    successTitle: '¡Aplicación recibida!',
    successMessage:
      'Gracias — te responderemos en un máximo de 7 días hábiles con los siguientes pasos de Speaker School.',
    applyCta: 'Aplicar a Speaker School',
  },
  cfsPage: {
    title: 'Call for Speakers',
    description:
      '¿Quieres compartir lo que sabes en Pereira Tech Talks? Postula tu charla, panel, workshop o lightning a los meetups mensuales o a Pereira Tech Day.',
    intro:
      'Buscamos voces nuevas y experimentadas, locales e internacionales. Si tienes algo que aporte a la comunidad —una charla técnica, un panel, un workshop, una lightning— queremos escucharte.',
    eyebrow: 'Comparte lo que sabes',
    whatWeLookForTitle: '¿Qué buscamos?',
    whatWeLookFor: [
      'Contenido técnico real: experiencia de producción, arquitectura, postmortems, ingeniería honesta.',
      'Charlas accesibles: no necesitas ser senior para postular. La Speaker School está pensada para acompañarte.',
      'Diversidad de perspectivas: género, ciudad, nivel, lenguaje (EN/ES), industria.',
      'Temas relevantes: AI/ML, web platforms, devops, mobile, security, data, product engineering, leadership.',
    ],
    formatsTitle: 'Formatos disponibles',
    formats: [
      {
        name: 'Charla regular (25 min)',
        description:
          'El formato estándar de meetup. Tema técnico con espacio para preguntas.',
      },
      {
        name: 'Lightning (5–10 min)',
        description:
          'Idea precisa, ejemplo, demo o reflexión. Ideal para primera charla.',
      },
      {
        name: 'Panel (40 min)',
        description:
          'Conversación moderada con 2–3 voces sobre un tema. Aplican grupos.',
      },
      {
        name: 'Workshop (90 min)',
        description:
          'Sesión práctica con asistentes que llevan laptop. Para audiencia técnica activa.',
      },
    ],
    processTitle: 'Cómo postular',
    process: [
      'Completa el formulario con título, formato, abstract, aprendizajes y un enlace sobre ti.',
      'Te respondemos en máximo 7 días para alinear fecha y formato.',
      'Si es tu primera vez, podemos conectarte con la mentoría de Speaker School.',
    ],
    criteriaEyebrow: 'Criterios',
    formatsEyebrow: 'Formatos',
    processEyebrow: 'Proceso',
    formEyebrow: 'Postulación',
  },
  sponsorUsPage: {
    title: 'Patrocínanos',
    description:
      'Conecta tu marca con la comunidad técnica más activa del Eje Cafetero. Desde 2014 hemos llevado a cabo más de 90 meetups y 7 ediciones de Pereira Tech Day.',
    intro:
      'Patrocinar a Pereira Tech Talks no es publicidad: es construir comunidad. Cada peso aportado se traduce en venues accesibles, comida para asistentes, becas para Speaker School, transporte para ponentes invitados y eventos abiertos a toda la región.',
    formEyebrow: 'Consulta',
    formSectionTitle: 'Cuéntanos tu interés en patrocinar',
  },
  sponsorsPage: {
    title: 'Patrocinadores',
    description:
      'Patrocinadores actuales y anteriores de Pereira Tech Talks — empresas y organizaciones que sostienen meetups, Pereira Tech Day y los programas de la comunidad en Pereira.',
    eyebrow: 'Patrocinadores Actuales',
    intro: (count) =>
      `${count} patrocinadores activos sostienen venues, logística y escenario. Las categorías de patrocinio por edición viven en cada Pereira Tech Day.`,
    currentTitle: 'Patrocinadores actuales',
    currentIntro:
      'Quienes acompañan a Pereira Tech Talks hoy — meetups mensuales y la conferencia anual.',
    pastTitle: 'Patrocinadores anteriores',
    pastIntro:
      'Organizaciones que apoyaron capítulos previos. Cada alianza dejó huella en la comunidad.',
    sponsorUsLabel: 'Quiero patrocinar',
    contactLabel: 'Escríbenos',
    emptyTitle: 'Aún no hay patrocinadores registrados',
    emptyDesc: '¿Te interesa apoyar la comunidad? Escríbenos.',
    breadcrumbHome: 'Inicio',
    why: {
      title: 'Por qué patrocinar',
      intro:
        'No vendemos un logo en una web. Construimos escenarios donde el talento local se encuentra con empresas que quieren contratar, enseñar y aprender en Pereira.',
      items: {
        meetups: {
          title: 'Meetups reales',
          body: 'Venue, snacks y continuidad mensual — la comunidad necesita patrocinadores que hagan posible cada noche de charlas.',
        },
        ptd: {
          title: 'Pereira Tech Day',
          body: 'La conferencia anual con paquetes por edición (oro, plata, etc.). Ese menú de categorías vive en la página de cada año, no aquí.',
        },
        talent: {
          title: 'Talento local',
          body: 'Acceso a ingenieras e ingenieros, speakers y estudiantes de Risaralda que ya están construyendo en público.',
        },
      },
    },
    tiers: {
      diamond: 'Patrocinadores diamante',
      gold: 'Patrocinadores oro',
      silver: 'Patrocinadores plata',
      bronze: 'Patrocinadores bronce',
      community: 'Patrocinadores comunitarios',
    },
    card: {
      meetupsCount: (count) =>
        count === 1 ? '1 meetup patrocinado' : `${count} meetups patrocinados`,
      viewSponsoredMeetups: 'Ver meetups patrocinados',
      website: 'Sitio web',
    },
  },

  sponsorDetail: {
    breadcrumbHome: 'Inicio',
    breadcrumbSponsors: 'Patrocinadores',
    metaDescription: (name, meetups) =>
      meetups > 0
        ? `${name} ha patrocinado ${meetups} ${meetups === 1 ? 'meetup' : 'meetups'} de Pereira Tech Talks. Revisa el historial completo de encuentros y ediciones que hizo posibles.`
        : `${name} es patrocinador de Pereira Tech Talks. Conoce su rol en la comunidad tecnológica de Pereira y los encuentros que acompaña.`,
    statusActive: 'Patrocinador actual',
    statusPast: 'Patrocinador anterior',
    sinceLabel: (year) => `Acompañando a la comunidad desde ${year}`,
    websiteLabel: 'Visitar sitio web',
    allSponsorsLabel: 'Todos los patrocinadores',
    sponsorUsLabel: 'Quiero patrocinar',
    stats: {
      meetups: 'Meetups patrocinados',
      editions: 'Ediciones de PTD',
      talks: 'Charlas impulsadas',
      speakers: 'Ponentes en escena',
    },
    upcomingTitle: 'Próximos meetups patrocinados',
    upcomingSubtitle:
      'Encuentros ya agendados que cuentan con este patrocinador. Te esperamos.',
    meetupsTitle: 'Meetups patrocinados',
    meetupsSubtitle: (name) =>
      `Cada noche de charlas que ${name} ayudó a sostener, del más reciente al primero.`,
    editionsTitle: 'Ediciones de Pereira Tech Day',
    editionsSubtitle:
      'La conferencia anual de la comunidad y la categoría de patrocinio en cada edición.',
    editionUpcomingLabel: 'Próxima edición',
    editionTierLabel: (tier) => `Patrocinador ${tier}`,
    emptyTitle: 'Aún no hay encuentros enlazados',
    emptyDesc:
      'Este patrocinador todavía no tiene meetups ni ediciones registradas en el archivo. Estamos completando la historia de la comunidad poco a poco.',
    ctaTitle: '¿Quieres aparecer aquí?',
    ctaBody:
      'Patrocinar Pereira Tech Talks es sostener venue, logística y escenario para la comunidad tech de Risaralda. Cuéntanos qué tienes en mente.',
  },

  contributorsPage: {
    title: 'Equipo y comunidad',
    description:
      'Conoce al equipo organizador de Pereira Tech Talks y a quienes acompañaron capítulos anteriores — personas reales detrás de los meetups y Pereira Tech Day.',
    eyebrow: 'Personas',
    intro: (count) =>
      `${count} organizadoras y organizadores activos sostienen la comunidad día a día. Si quieres sumarte, escríbenos o revisa cómo contribuir.`,
    sinceLabel: (year) => `Construyendo comunidad en Pereira desde ${year}.`,
    currentTitle: 'Equipo organizador',
    currentIntro:
      'Quienes coordinan meetups, Pereira Tech Day, programas y la operación diaria de Pereira Tech Talks.',
    pastTitle: 'Alumni y organizadores anteriores',
    pastIntro:
      'Organizadoras, organizadores y colaboradoras de capítulos anteriores. Siguen siendo parte de la red extendida de la comunidad.',
    joinLabel: 'Únete al equipo',
    contributeLabel: 'Cómo contribuir',
    emptyTitle: 'Aún no hay miembros registrados',
    emptyDesc: 'Estamos consolidando el directorio. Vuelve pronto.',
  },

  calendarPage: {
    title: 'Calendario comunitario',
    subtitle: 'Eventos tech de Pereira en un solo lugar',
    description:
      'Calendario compartido de la comunidad tech de Pereira: meetups de Pereira Tech Talks y eventos de comunidades aliadas en Risaralda, Colombia.',
    heroDescription:
      'Explora próximos meetups, talleres y conferencias de Pereira Tech Talks y comunidades aliadas. Filtra por grupo, alterna entre vista mensual y agenda, y suscríbete con tu app de calendario favorita.',
    eyebrow: 'Comunidad',
    hubEyebrow: 'Agenda en vivo',
    filterLabel: 'Mostrar calendarios',
    filterAll: 'Todas las comunidades',
    viewMonth: 'Mes',
    viewAgenda: 'Agenda',
    legendLabel: 'Calendarios comunitarios seleccionados',
    embedTitle: 'Calendario de eventos comunitarios',
    embedFallback:
      'Si el embed no carga, abre el calendario directamente en Google Calendar:',
    openExternal: 'Abrir en Google Calendar',
    subscribeIcs: 'Suscribirse (ICS)',
    lumaRsvp: 'RSVP en Luma',
    websiteLink: 'Sitio web',
    noActiveCalendars:
      'Aún no hay calendarios públicos activos. Revisa nuestro archivo de meetups o escríbenos para sumar tu comunidad.',
    comingSoon: 'Más comunidades muy pronto',
    inactiveNote:
      'Estos grupos aliados se están sumando al hub. Las organizaciones pueden compartir un ID público de Google Calendar con el formulario de abajo.',
    quickLinksEyebrow: 'Enlaces rápidos',
    quickLinksTitle: 'RSVP y archivos',
    meetupsLink: 'Archivo de meetups',
    lumaLink: 'Eventos PTT en Luma',
    contributeEyebrow: 'Contribuir',
    contributeTitle: 'Publica el calendario de tu comunidad',
    contributeDescription:
      'Si organizas un meetup o grupo de usuarios tech en Pereira, haz público tu Google Calendar y envía el ID en el formulario. Añadiremos un feed con color propio después de una revisión rápida.',
    contributeCta: 'Proponer tu calendario',
    breadcrumbHome: 'Inicio',
  },

  calendarForm: {
    formTitle: 'Propuesta de calendario comunitario',
    communityLabel: 'Nombre de la comunidad / meetup',
    communityPlaceholder: 'p. ej. Pereira JS, Women Who Code Pereira',
    calendarIdLabel: 'ID de Google Calendar',
    calendarIdPlaceholder: 'tu-calendario@group.calendar.google.com',
    calendarIdHint:
      'En Google Calendar → Configuración → Integrar calendario → ID del calendario (debe ser público).',
    publicUrlLabel: 'URL pública del calendario (opcional)',
    publicUrlPlaceholder: 'https://calendar.google.com/calendar/…',
    websiteLabel: 'Sitio web de la comunidad (opcional)',
    websitePlaceholder: 'https://…',
    descriptionLabel: 'Descripción corta',
    descriptionPlaceholder:
      'Quiénes son, cadencia y tipos de eventos que organizan…',
    submitButton: 'Enviar propuesta de calendario',
    successTitle: '¡Propuesta recibida!',
    successMessage:
      'Gracias — revisaremos el feed público y te contactaremos en un máximo de 7 días hábiles.',
  },

  conductForm: {
    formEyebrow: 'Reporte confidencial',
    formSectionTitle: 'Reportar una preocupación del Código de Conducta',
    privacyNote:
      'Los reportes llegan solo a organizadores. No se listan en público ni se publican en canales de Slack de la comunidad. Puedes enviar de forma anónima.',
    incidentLabel: '¿Qué ocurrió?',
    incidentPlaceholder:
      'Describe el incidente con el contexto que te sientas cómoda o cómodo compartiendo…',
    whenLabel: '¿Cuándo ocurrió? (opcional)',
    whenPlaceholder: 'Fecha, hora o nombre del evento…',
    peopleLabel: 'Personas involucradas (opcional)',
    peoplePlaceholder: 'Nombres o roles, si los conoces…',
    anonymousLabel: 'Enviar de forma anónima',
    anonymousHint:
      'Si eliges anonimato, no guardaremos nombre ni correo de quien reporta con este envío.',
    nameLabel: 'Tu nombre (opcional si es anónimo)',
    emailLabel: 'Tu correo (obligatorio salvo anonimato)',
    followupLabel: 'Seguimiento preferido (opcional)',
    followupPlaceholder: 'Correo, llamada o “no necesito seguimiento”…',
    submitButton: 'Enviar reporte confidencial',
    successTitle: 'Reporte recibido',
    successMessage:
      'Gracias. Los organizadores lo revisarán de forma confidencial y actuarán con prontitud y justicia.',
  },

  contactSection: {
    title: 'Conectemos',
    description:
      'Estamos siempre abiertas y abiertos a nuevas conversaciones — ponentes, patrocinadores, aliados y miembros curiosos de la comunidad. Escríbenos y construyamos juntas y juntos el próximo capítulo.',
    ctaText: 'Escríbenos',
    ctaLink: '/contact?topic=general&subject=Consulta%20General',
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
    'Artículos, recapitulaciones de meetups y tutoriales de Pereira Tech Talks — escritura de la comunidad tech de Risaralda desde 2014.',
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
      'Colecciones curadas de artículos en varios capítulos de Pereira Tech Talks — análisis sobre tecnología, ingeniería de software y el oficio de construir.',
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
    heading: 'Esta página se salió del mapa',
    message:
      'La URL puede estar desactualizada o escrita con un error. Elige un destino — meetups, Pereira Tech Day o el blog — y sigue explorando la comunidad.',
    eyebrow: '404 · Señal perdida',
    backHome: 'Volver al inicio',
    searchBlog: 'Explorar el blog',
    meetupsCta: 'Ver meetups',
    ptdCta: 'Pereira Tech Day',
  },

  verticalsPage: {
    title: 'Programas',
    description:
      'Cuatro programas de Pereira Tech Talks: Escuela de Speakers, La Biblioteca del Mañana, Canal IA y meetups mensuales — cada uno con ritmo, público y objetivos.',
    intro:
      'Estos son los espacios donde la comunidad construye en el largo plazo. Si quieres participar, escríbenos.',
    eyebrow: 'Estructura',
    sectionEyebrow: 'Programas',
    sectionTitle: 'Cuatro frentes activos',
    programLabel: 'Programa',
    learnMore: 'Conoce más',
    relatedMeetups: 'Meetups asociados',
    contactCta: 'Escríbenos',
    joinCta: 'Cómo participar',
    applyCta: 'Aplicar a Speaker School',
    emptyTitle: 'Aún no hay programas registrados',
    emptyDesc: 'Estamos consolidando los programas. Vuelve pronto.',
    statusActive: 'Activo',
    statusPaused: 'En pausa',
    statusArchived: 'Archivado',
  },

  ptdPage: {
    recordingCta: 'Ver grabación del evento',
    schedule: 'Programa',
    talks: 'Charlas',
    speakers: 'Ponentes',
    gallery: 'Galería',
    galleryMemories: 'Memorias del evento',
    sponsors: 'Patrocinadores',
    sponsorsSubtitle: 'Empresas que **apoyarán** esta edición del evento.',
    sponsorsFooter:
      'Gracias por impulsar el ecosistema tech de Pereira y la región.',
    communities: 'Comunidades aliadas',
    communitiesOrganizes: 'Organiza',
    communitiesOrganizesSubtitle:
      'Junto a estas comunidades fortalecemos el ecosistema tech de Pereira y la región.',
    communitiesOrganizesFooter:
      'Una red de comunidades que conecta talento, aprendizaje y colaboración.',
    organizers: 'Organizadores',
    organizersSubtitle: 'Quienes lideran y hacen posible Pereira Tech Day.',
    collaborators: 'Colaboradores',
    collaboratorsSubtitle:
      'Personas y aliados que fortalecen la ejecución del evento.',
    about: 'Sobre Pereira Tech Day',
    pricing: 'Planes de Patrocinio',
    faq: 'Preguntas Frecuentes (FAQ)',
    faqSubtitle:
      'Algunas pequeñas preguntas que te pueden sacar algunas dudas. De cualquier forma, si hay algo que no quede claro aquí, por favor escríbenos un email y nos pondremos en contacto contigo.',
    joinTitle: 'Únete al futuro tech de la región.',
    joinSubtitle: 'Sé parte del crecimiento del ecosistema.',
    joinCta: 'Explorar Pereira Tech Talks',
    lightningTitle: 'Lightning talks',
    lightningTagline: 'Charlas cortas',
    scheduleEyebrow: 'Agenda del día',
    scheduleTentativeBadge: 'Tentativo',
    scheduleTentativeNote:
      'Los horarios y los ponentes pueden cambiar. Iremos revelando el line-up completo en los próximos días.',
    scheduleToBeRevealed: 'Por revelar',
    scheduleViewDetail: 'Ver detalle',
    scheduleModalClose: 'Cerrar',
    scheduleModalAbout: 'Sobre el ponente',
    scheduleModalSession: 'Charla',
    scheduleModalProfile: 'Ver perfil completo',
    scheduleAbstractPending:
      'Pronto compartiremos la descripción de esta charla.',
    schedulePendingSpeaker: 'Ponente {n}',
    scheduleAnchor: 'Cronograma',
    scheduleAnchorCta: 'Ver cronograma',
    languageSwitcher: 'Cambiar idioma',
    speakersEyebrow: 'Line-up',
    speakersUpcomingSubtitle:
      'Un día completo de charlas para inspirarte, con ponentes del ecosistema tech de la región y de fuera.',
    speakersRevealSoon:
      'Seguimos confirmando ponentes. Anunciaremos los que faltan durante esta semana.',
    lightningPendingMessage: 'Se anunciarán pronto.',
    lightningPendingCard: 'Lightning talk',
    lightningPendingCta: 'Ver planes de patrocinio',
    registerCta: 'Inscribirse',
    postponedBadge: 'Evento pospuesto',
    postponedHeroBadge: 'Pospuesto indefinidamente',
    postponedSince: 'Comunicado publicado el {date}.',
    postponedReadCta: 'Leer el comunicado',
    subscribe: {
      copy: 'Entérate cuando se habiliten las inscripciones para el evento. ¡No te lo pierdas!',
      emailLabel: 'Correo electrónico',
      emailPlaceholder: 'Ingresa tu correo electrónico',
      button: 'Suscribirse',
      submitting: 'Enviando…',
      success: '¡Registrado!',
      error: 'No se pudo suscribir. Intenta de nuevo.',
    },
    indexFeatured: 'Edición destacada',
    indexUpcoming: 'Próxima edición',
    indexPast: 'Ediciones pasadas',
    indexIntro:
      'La conferencia insignia de la comunidad — un día completo de charlas, paneles y networking en Pereira. Explora el archivo y la próxima edición.',
    indexEyebrow: 'Conferencia anual',
    indexCfsCta: 'Call for Speakers',
    indexSponsorCta: 'Patrocinar el evento',
    indexStatEditions: 'Ediciones',
    indexStatYears: 'Años',
    indexStatSince: 'Desde',
    indexCalendarEyebrow: 'Calendario',
    indexHistoryEyebrow: 'Historia',
    indexPastSubtitle:
      'Cada año deja su propia marca — vuelve a las ediciones que ya marcaron a Pereira.',
    editionNavLabel: 'Navegación de Pereira Tech Day',
    previousEditions: 'Otras ediciones',
    allEditions: 'Todas las ediciones',
    indexStagePrimaryCta: 'Ver esta edición',
    indexPastRowEyebrow: 'Edición anterior',
    indexPastRowCta: 'Ver resumen de la edición',
    indexNoUpcomingTitle: 'Un año de charlas memorables',
    indexNoUpcomingIntro:
      'El próximo Pereira Tech Day está en camino. Síguenos para enterarte primero.',
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

  certificates: {
    pageTitle: 'Certificado de asistencia',
    pageDescription:
      'Diploma digital para {name} — {event}. Imprime, guarda como PDF o comparte tu enlace personal.',
    diplomaTitle: 'Certificado de Asistencia',
    preamble: 'Se certifica que',
    attendedPrefix: 'asistió a',
    sealLabel: 'Documento\nVerificable',
    issuedBy: 'Emitido por',
    verifyLabel: 'Verificar',
    qrAlt: 'Código QR para verificar este certificado',
    demoBanner:
      'Diploma de demostración — destinatario ficticio. Los certificados de producción usarán el mismo patrón de URL personal.',
    backToEvent: 'Volver a Pereira Tech Day',
    watermarkRevoked: 'Revocado',
    roles: {
      attendee: 'Asistente',
      speaker: 'Ponente',
      volunteer: 'Voluntario',
    },
    actions: {
      print: 'Imprimir / Guardar PDF',
      downloadJson: 'Descargar JSON',
      copyLink: 'Copiar enlace',
      share: 'Compartir',
      copied: 'Enlace copiado',
      shared: 'Compartido',
      shareFailed: 'No se pudo copiar o compartir. Inténtalo de nuevo.',
    },
    verify: {
      title: 'Verificar un certificado',
      description:
        'Consulta el estado de un diploma de asistencia de Pereira Tech Talks con su identificador opaco.',
      intro:
        'Ingresa el ID del certificado que aparece en el diploma o escanea el código QR para confirmar su autenticidad.',
      idLabel: 'ID del certificado',
      idPlaceholder: 'ej. ptd26_demo_a7k3m9qx',
      submit: 'Verificar',
      statusLabel: 'Estado',
      subject: 'Destinatario',
      event: 'Evento',
      certId: 'ID del certificado',
      viewDiploma: 'Ver diploma',
      emptyHint:
        'Pega un ID de certificado para ver su estado de verificación.',
      cryptoLabel: 'Prueba criptográfica',
      cryptoSigned:
        'Firma Ed25519 verificada contra did:web:pereiratechtalks.org.',
      cryptoDemo:
        'Firma de demostración verificada (clave de desarrollo — no es emisión de producción).',
      cryptoUnsigned:
        'No hay artefacto JSON-LD firmado (solo fixture del registro).',
      cryptoFailed: 'La verificación de firma falló o falta la prueba.',
      cryptoRevokedSigned:
        'La firma es válida, pero el estado del ciclo de vida no es válido.',
      statuses: {
        valid: 'Válido',
        revoked: 'Revocado',
        replaced: 'Reemplazado',
        expired: 'Expirado',
        unknown: 'Desconocido',
      },
      reasons: {
        missing_id: 'No se proporcionó un ID de certificado.',
        not_found: 'Ningún certificado coincide con este ID.',
        revoked: 'Este certificado fue revocado por el emisor.',
        replaced:
          'Este certificado fue reemplazado por un documento más reciente.',
        expired: 'Este certificado está fuera de su ventana de validez.',
      },
    },
  },

  // Errors
  searchError: 'Ocurrió un error al buscar. Por favor, inténtalo de nuevo.',
  loadError:
    'No se pudo cargar el índice de búsqueda. Por favor, recarga la página.',
  retry: 'Reintentar',
};
