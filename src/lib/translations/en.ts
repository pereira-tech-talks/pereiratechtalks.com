/**
 * English translations
 */

import type { SiteTranslations } from './types';

export const en: SiteTranslations = {
  // Site metadata
  siteTitle: 'Pereira Tech Talks',
  siteTitleFull:
    'Pereira Tech Talks — Technology community of Pereira, Colombia',
  siteDescription:
    'Pereira Tech Talks — tech community of Pereira, Colombia since 2014. 90+ monthly meetups, Pereira Tech Day, and an active Speaker School.',

  // Navigation
  nav: {
    home: 'Home',
    blog: 'Blog',
    about: 'About',
    contact: 'Contact',
    slides: 'Slides',
    meetups: 'Meetups',
    pereiraTechDays: 'Pereira Tech Day',
    speakers: 'Speakers',
    talks: 'Talks',
    calendar: 'Calendar',
    communities: 'Allied communities',
    sponsors: 'Sponsors',
    contributors: 'Team',
    verticals: 'Programs',
    channels: 'Channels',
    press: 'Press',
    community: 'Community',
    menu: 'Menu',
    closeMenu: 'Close menu',
    openMenu: 'Open menu',
  },

  // Footer
  footer: {
    copyright: 'Pereira Tech Talks',
    allRightsReserved: 'All rights reserved.',
  },

  // Homepage hero
  hero: {
    tagline: 'Pereira, Risaralda · Since 2014',
    description:
      'An open community to learn in public, share what you know, and grow alongside others. There is room for beginners, for those further along, and for anyone ready to mentor. We look for curiosity, new voices, and people ready to build — local talent with a global outlook and a shared purpose.',
    ctaMeetups: 'See meetups',
    ctaPtd: 'Pereira Tech Day 2026',
    ctaContact: 'Get in touch',
    scrollLabel: 'Scroll',
    typewriterWords: [
      'Monthly meetups',
      'Pereira Tech Day',
      'Speaker School',
      'La Biblioteca del Mañana',
      'AI & Agents Channel',
    ],
  },

  // Homepage sections
  homeSections: {
    about: {
      title:
        "We are <span class='text-ptt-primary dark:text-ptt-primary-dark'>Pereira Tech Talks</span>",
      description: `We are an interdisciplinary community that connects local and regional talent — people who code, design, build companies, study, or are simply curious — around the technology we are building together.<br /><br />
We gather to share what we learn, open stages to new voices, and weave networks across Pereira, Risaralda, and the rest of LATAM. Meetups, <strong>Pereira Tech Day</strong>, the <strong>Speaker School</strong>, and more: volunteer-run, open spaces anyone can join.<br /><br />
If you are looking for people to grow with, a stage for your first talk, or a community that actually welcomes you — there is a place for you here. Explore, come to the next meetup, or write to us.`,
      cta: 'About the community',
      cta2: 'Get in touch',
    },
    community: {
      title: 'What we do',
      subtitle: 'Meetups, conferences, schools & libraries',
      description:
        'Every month we gather to share talks, workshops, and lightning sessions on the topics shaping the industry: AI and agents, web platforms, devops, mobile, security, and the craft of building software at scale. Once a year we celebrate the <strong>Pereira Tech Day</strong>, our flagship conference where the community comes together with international speakers and partners. Throughout the year we run the <strong>Speaker School</strong> to grow new voices and the <strong>La Biblioteca del Mañana</strong> book club to connect technology with the broader human story. Everyone is welcome — beginners, seniors, students, founders, the curious.',
      cta: 'Learn more about us',
    },
    meetups: {
      eyebrow: 'Calendar',
      upcomingTitle: 'Upcoming meetups',
      latestTitle: 'Latest meetups',
      cta: 'See all meetups',
    },
    verticals: {
      eyebrow: 'Programs',
      title: 'Community programs',
      subtitle:
        'Four fronts that sustain what we do: monthly meetups, Speaker School, The Library of Tomorrow, and the AI Channel.',
      cta: 'Explore the programs',
    },
    ptd: {
      eyebrow: 'Annual event',
      title: 'Pereira Tech Day',
      subtitle:
        'One day a year when the community comes together with international speakers to celebrate what we build.',
      cta: 'Explore all editions',
    },
    ptdStrip: {
      eyebrow: 'August 22, 2026 — 08:00 AM',
      title: 'Pereira Tech Day 2026',
      subtitle: 'Where talent, technology, and brands meet.',
      cta: 'Explore Pereira Tech Day 2026',
      date: 'Saturday, August 22, 2026',
      venue: 'UTP: Auditorio Jorge Roa Martínez, Pereira',
      attendance: '300+ expected attendees',
      postponedEyebrow: 'A note from the organizers',
      postponedCta: 'Read the announcement',
    },
    sponsors: {
      eyebrow: 'Current sponsors',
      title: 'The community is powered by',
      subtitle:
        'Companies and community partners providing venues, catering, scholarships, and mentorship.',
      cta: 'See all sponsors',
      ctaJoin: 'Become a sponsor',
    },
    latestArticles: 'Latest Articles',
    viewAllPosts: 'View all posts',
  },

  // Contact section (homepage)
  contact: {
    title: 'Contact',
    nameLabel: 'Name',
    namePlaceholder: 'Your name',
    emailLabel: 'Email',
    emailPlaceholder: 'your@email.com',
    messageLabel: 'Message',
    messagePlaceholder: 'Write your message...',
    sendButton: 'Send message',
  },

  // About page

  meetupsPage: {
    title: 'Pereira Tech Talks Meetups',
    description:
      '{meetups} meetups, {talks} talks, and {speakers} speakers since {sinceYear}. The complete monthly archive of the Eje Cafetero tech community in Pereira, Risaralda.',
    intro:
      'Every month the community comes together to share talks, connect across communities, and keep technical curiosity alive. Here is the full archive.',
    upcoming: 'Upcoming meetups',
    past: 'Past meetups',
    allMeetups: 'All meetups',
    emptyUpcomingTitle: 'No upcoming meetups announced yet',
    emptyUpcomingDescription:
      "We're coordinating dates with speakers and venues. Follow us to be the first to know.",
    ctaLuma: 'Follow us on Luma',
    eyebrow: 'Community archive',
    statMeetups: 'Meetups',
    statTalks: 'Talks',
    statSpeakers: 'Speakers',
    statSince: 'Since',
    nextUpLabel: 'Up next',
    nextUpCta: "See what's coming",
    yearLabel: '{year} — Meetups',
    yearNav: 'Jump to year',
    calendarEyebrow: 'Calendar',
    archiveEyebrow: 'Archive',
    breadcrumbHome: 'Home',
  },

  meetupDetail: {
    talks: 'Talks',
    untranslatedBody:
      'This recap has not been translated yet — showing the Spanish original.',
    speakers: 'Speakers',
    sponsors: 'Sponsors',
    sponsorsSubtitle: 'Companies that supported this meetup.',
    venue: 'Venue',
    originalEvent: 'Original event',
    recording: 'Recording',
    watchRecording: 'Watch recording',
    photosExternal: 'Photo album',
    galleryMemories: 'Event memories',
    statusAnnounced: 'Upcoming',
    statusRsvpOpen: 'RSVP open',
    statusCompleted: 'Past meetup',
    statusCancelled: 'Cancelled',
    breadcrumbHome: 'Home',
    breadcrumbMeetups: 'Meetups',
  },

  speakerDetail: {
    talkHistory: 'Talk history',
    talkHistorySubtitle: 'Most recent first.',
    relatedEvents: 'Related events',
    relatedEventsSubtitle:
      'Meetups and Pereira Tech Days linked to these talks.',
    breadcrumbHome: 'Home',
    breadcrumbSpeakers: 'Speakers',
    website: 'Website',
  },

  aboutPage: {
    title: 'About Pereira Tech Talks',
    subtitle: 'A technology community from Pereira to the world',
    description:
      'Meet Pereira Tech Talks — tech community in Pereira, Risaralda since 2014. Monthly meetups, Pereira Tech Day, Speaker School, and La Biblioteca del Mañana.',
    heroDescription:
      'The technology community of Pereira (Risaralda, Colombia). Founded 2014. Monthly meetups, Pereira Tech Day, an active Speaker School and a content library in Spanish and English. Volunteer-run. Open to everyone.',
    bioTitle: 'Who we are',
    bioText:
      'Pereira Tech Talks (PTT) is the technology community of Pereira, Risaralda, Colombia. The story starts in February 2014: eight developers in a UTP classroom for the first PereiraJS meetup. Twelve years on, that small circle is a four-program community — monthly meetups (84 and counting), the annual <strong>Pereira Tech Day</strong> conference (2024 archive, 2026 upcoming), the <strong>Speaker School</strong>, and the <strong>La Biblioteca del Mañana</strong> reading club. All volunteer-built. All open.<br /><br />The work is sponsor-supported (DailyBot, GitHub, ASE-UTP, Gorilla Logic, Made for Germany, Source Meridian, and more) and open by default. The site you are reading is a catalog of meetups, talks, slides, speakers, contributors, and sponsors — available in Spanish and English — structured to be just as useful to AI agents as it is to humans.<br /><br />We believe technology grows faster when we share what we learn — that is why every meetup recap is published the same week. We believe Pereira has world-class talent that deserves world-class stages — that is why the Speaker School exists and why community alumni now keynote in Bogotá, Medellín, Mexico City, and at YC-backed startups. And we believe a tech community should look like the city it lives in — open, warm, mixed, and unpretentious. That is why our events are free, our channels are public, and our content is published in Spanish and English.',
    passionsTitle: 'What we do',
    passions: [
      {
        title: 'Monthly Meetups',
        description:
          'In-person and hybrid sessions every month — talks, workshops, and lightning rounds on AI, web platforms, devops, mobile, security, and the craft of shipping software.',
        icon: '\u{1F465}',
        link: '/en/verticals/monthly-meetups',
      },
      {
        title: 'Pereira Tech Day',
        description:
          'Our flagship annual conference — 2024 archived, 2026 next. A full day of keynotes, workshops, and networking with international speakers and local partners.',
        icon: '\u{1F389}',
        link: '/en/pereira-tech-day',
      },
      {
        title: 'Speaker School',
        description:
          'A program to grow new technical speakers — from idea to stage — with mentorship, practice runs, and rehearsals. Alumni keynote in Bogotá, Medellín, and Mexico City.',
        icon: '\u{1F3A4}',
        link: '/en/verticals/speaker-school',
      },
      {
        title: 'La Biblioteca del Mañana',
        description:
          'A reading club connecting science fiction, philosophy, and technology — exploring the future through the books that shape it.',
        icon: '\u{1F4DA}',
        link: '/en/verticals/library-of-tomorrow',
      },
      {
        title: 'AI & Agents Channel',
        description:
          'A dedicated track on AI, LLMs, agents, and the agentic web — where the community meets the most disruptive technology of the decade.',
        icon: '\u{1F916}',
        link: '/en/verticals/ai-channel',
      },
      {
        title: 'Content library',
        description:
          'Articles, slides, and recaps published in Spanish and English — accessible to local talent and the international tech community alike.',
        icon: '\u{1F30D}',
        link: '/en/blog',
      },
    ],
    quickFactsTitle: 'Quick facts',
    quickFacts: [
      'Founded in Pereira, Risaralda, Colombia (February 2014)',
      'Website available in Spanish (primary) and English',
      '90+ monthly meetups since 2014',
      'Pereira Tech Day editions in 2024 and 2026',
      'Volunteer-run, sponsor-supported, free to attend',
      'Fully AI-agent-readable content (AEO 100, Markdown-for-Agents on every page)',
      'Open source: site, content, and brand kit on GitHub',
    ],
    ctaTitle: 'Want to be part of it?',
    ctaDescription:
      "Whether you want to speak, sponsor, partner, or just attend — there's a place for you. Get in touch and let's build the next chapter of the community together.",
    ctaCv: 'Read the blog',
    ctaContact: 'Get in touch',
  },

  // Slides listing page
  slidesPage: {
    title: 'Slides',
    subtitle: 'Decks from our meetups, conferences & workshops',
    description:
      'Browse slide decks from Pereira Tech Talks meetups, Pereira Tech Day editions, and Speaker School — presentations from community speakers.',
    heroDescription:
      'A library of presentation decks from Pereira Tech Talks events — meetups, Pereira Tech Day, Speaker School, and workshops. Built in-house with Reveal.js or hosted on external platforms.',
    timelineTitle: 'All Slides',
    emptyState: 'No slides published yet. Check back soon!',
    viewAll: 'View all slides',
  },

  // Slides / deck pages
  slides: {
    exitToCatalog: 'Back to Slides',
    printPdf: 'Print to PDF',
    languageSwitch: 'Ver en español',
    external: {
      openCta: 'Open on {provider}',
      backToCatalog: 'Back to catalog',
    },
    languageNotice: 'Original deck is in {lang}',
    typeBadge: {
      native: 'Native',
      external: 'External',
    },
    toolbar: {
      backToCatalog: 'Back to catalog',
      switchLang: 'Switch to {lang}',
      themeToLight: 'Switch to light mode',
      themeToDark: 'Switch to dark mode',
      enterFullscreen: 'Enter fullscreen',
      exitFullscreen: 'Exit fullscreen',
    },
  },

  // Contact page
  contactPage: {
    title: 'Contact',
    subtitle: 'Speak, sponsor, partner — or just say hi',
    description:
      'Contact Pereira Tech Talks — speakers, sponsors, partners, and community members welcome to propose ideas, collaborate, or ask how to get involved.',
    heroDescription:
      "We are always open to new speakers, sponsors, partners, and community members. Whether you have a talk to propose, want to sponsor a meetup, or just want to say hi — we'd love to hear from you.",
    formTitle: 'Send us a message',
    nameLabel: 'Name',
    namePlaceholder: 'Your name',
    emailLabel: 'Email',
    emailPlaceholder: 'your@email.com',
    reasonLabel: 'I want to contact you about',
    reasonOptions: [
      { value: '', label: '— Select a topic —' },
      { value: 'general', label: 'General / Just saying hello' },
      {
        value: 'collaboration',
        label: 'Community collaboration / Partnership',
      },
      {
        value: 'the-library-of-tomorrow',
        label: 'Join La Biblioteca del Mañana',
      },
      { value: 'press', label: 'Press / Media inquiry' },
      { value: 'other', label: 'Other' },
    ],
    successNextSteps: {
      general:
        "We'll reply as soon as we can — usually within a few business days.",
      'tech-talk':
        'We review talk proposals year-round and reply within 7 business days.',
      sponsorship:
        'An organizer will follow up within 5 business days about tiers and next steps.',
      collaboration:
        "We'll connect you with the right organizer within a few business days.",
      'the-library-of-tomorrow':
        'A Biblioteca del Mañana host will reply with the next reading session details.',
      press: 'Our press contacts will reply as soon as possible.',
      conduct: 'Your message is handled confidentially by the conduct team.',
      other: "We'll get back to you as soon as possible.",
    },
    subjectLabel: 'Subject',
    subjectPlaceholder: 'What is this about?',
    messageLabel: 'Message',
    messagePlaceholder: 'Write your message...',
    sendButton: 'Send Message',
    sendingButton: 'Sending...',
    successTitle: 'Message sent!',
    successMessage:
      "Thank you for reaching out. We'll get back to you as soon as possible.",
    sendAnotherButton: 'Send another message',
    requiredField: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    submitError:
      "We couldn't deliver your message right now. Please try again in a few minutes or email pereiratechtalks@gmail.com.",
    fallbackMessage:
      'The contact form is currently unavailable. You can reach us directly by email.',
    fallbackEmailText: 'Send us an email at',
    formNote: "We'll get back to you as soon as possible.",
    socialTitle: 'Connect with us',
    locationTitle: 'Location',
    locationText:
      'Based in Pereira, Risaralda, Colombia. Site available in Spanish and English. Open to remote partners and international speakers worldwide.',
    quickLinksTitle: 'Quick links',
    quickLinks: [
      {
        label: 'Call for Speakers',
        href: '/en/call-for-speakers',
        description: 'Submit a talk for meetups or Pereira Tech Day.',
      },
      {
        label: 'Sponsor us',
        href: '/en/sponsor-us',
        description:
          'Partner with the most active tech community in the Coffee Region.',
      },
      {
        label: 'Channels',
        href: '/en/channels',
        description: 'Luma, GitHub, LinkedIn, and more.',
      },
      {
        label: 'Community calendar',
        href: '/en/calendar',
        description: 'Upcoming meetups and allied community events.',
      },
    ],
    meetInPersonTitle: 'Meet us in person',
    meetInPersonText:
      'Most monthly meetups happen in Pereira — Universidad Tecnológica de Pereira, coworking spaces, and partner venues across Risaralda. Check the meetups page for the next date and venue.',
    prefillSubjects: {
      generalInquiry: 'General Inquiry',
      collaboration: 'Community Collaboration',
      projectInquiry: 'Sponsorship Inquiry',
      projectCollaboration: 'Partnership Proposal',
      startupCollaboration: 'Startup Collaboration',
      techTalkInvitation: 'Speaker Proposal',
    },
  },

  communitiesPage: {
    title: 'Allied communities',
    description:
      'Allied tech communities in Pereira: PereiraJS, Python Pereira, JointDev, QA Conf, Backbone UTP, and more. A collaborative Coffee Region ecosystem.',
    eyebrow: 'Ecosystem',
    heroLead:
      'Pereira Tech Talks does not exist in a vacuum. We grow alongside other city communities that share venues, calendars, and stages.',
    narrativeTitle: 'One ecosystem, many communities',
    narrativeText:
      'Pereira Tech Talks is the umbrella for monthly meetups and Pereira Tech Day. Allied communities are specialized groups — JavaScript, Python, QA, university entrepreneurship — that co-produce events, cross-promote on channels, and extend the reach of tech in Risaralda.',
    alliesTitle: 'Allied communities',
    allianceTitle: 'How we collaborate',
    allianceSteps: [
      'Shared stages at Pereira Tech Day and flagship events',
      'Cross-posts on Luma, LinkedIn, and community channels',
      'Co-organized thematic meetups and workshops',
      'Cross-inviting speakers across programs',
      'Public calendar at /calendar with allied community events',
    ],
    ctaTitle: 'Want your community to join?',
    ctaDescription:
      'If you lead a tech group in Pereira or Risaralda and want to explore a formal alliance, reach out. We are always open to new collaborations.',
    ctaPrimary: 'Propose an alliance',
    ctaSecondary: 'See our channels',
    visitLabel: 'Visit community',
  },

  cfsForm: {
    formTitle: 'Submit your talk',
    talkTitleLabel: 'Talk title',
    talkTitlePlaceholder: 'A clear, specific title',
    formatLabel: 'Format',
    formatOptions: [
      { value: '', label: '— Select a format —' },
      { value: 'regular', label: 'Regular talk (25 min)' },
      { value: 'lightning', label: 'Lightning (5–10 min)' },
      { value: 'panel', label: 'Panel (40 min)' },
      { value: 'workshop', label: 'Workshop (90 min)' },
    ],
    abstractLabel: 'Abstract',
    abstractPlaceholder: '3–5 sentences about what you will cover…',
    takeawaysLabel: 'Key takeaways',
    takeawaysPlaceholder: 'What should attendees leave with?',
    socialLabel: 'LinkedIn, blog, or GitHub',
    socialPlaceholder: 'https://…',
    firstTimeLabel: 'This would be my first talk at Pereira Tech Talks',
    speakerSchoolLabel: 'I am interested in Speaker School mentorship',
    notesLabel: 'Anything else we should know?',
    notesPlaceholder: 'Preferred dates, co-speakers, AV needs…',
    submitButton: 'Submit proposal',
    successTitle: 'Proposal received!',
    successMessage:
      'Thanks — we will reply within 7 business days to align on date and format.',
    defaultSubject: 'Call for Speakers submission',
  },
  sponsorForm: {
    formTitle: 'Sponsorship inquiry',
    companyLabel: 'Company / brand',
    companyPlaceholder: 'Company name',
    roleLabel: 'Your role',
    rolePlaceholder: 'e.g. Marketing lead, Founder',
    tierLabel: 'Tier interest',
    tierOptions: [
      { value: '', label: '— Select a tier —' },
      { value: 'diamond', label: 'Diamond' },
      { value: 'gold', label: 'Gold' },
      { value: 'silver', label: 'Silver' },
      { value: 'bronze', label: 'Bronze' },
      { value: 'community', label: 'Community' },
      { value: 'unsure', label: 'Not sure yet' },
    ],
    contributionLabel: 'Contribution type',
    contributionOptions: [
      { value: '', label: '— Select —' },
      { value: 'cash', label: 'Monetary' },
      { value: 'in-kind', label: 'In-kind (venue, food, swag…)' },
      { value: 'both', label: 'Both' },
      { value: 'unsure', label: 'Not sure yet' },
    ],
    messageLabel: 'Tell us about your goals',
    messagePlaceholder: 'Hiring, brand presence, PTD edition, meetup series…',
    submitButton: 'Send sponsorship inquiry',
    successTitle: 'Inquiry received!',
    successMessage:
      'Thanks — an organizer will follow up within 5 business days.',
    defaultSubject: 'Sponsorship inquiry',
  },
  speakerSchoolForm: {
    formTitle: 'Speaker School application',
    formEyebrow: 'Apply',
    formSectionTitle: 'Join the next Speaker School cohort',
    experienceLabel: 'Experience level',
    experienceOptions: [
      { value: '', label: '— Select a level —' },
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' },
    ],
    goalsLabel: 'Goals for Speaker School',
    goalsPlaceholder: 'What do you want to achieve with mentorship?',
    topicsLabel: 'Topics of interest',
    topicsPlaceholder: 'e.g. web platforms, AI, devops, product…',
    availabilityLabel: 'Availability',
    availabilityPlaceholder: 'Evenings, weekends, preferred months…',
    priorSpeakingLabel: 'Prior speaking experience (optional)',
    priorSpeakingPlaceholder: 'Meetups, classrooms, internal talks…',
    socialLabel: 'LinkedIn, blog, or GitHub (optional)',
    socialPlaceholder: 'https://…',
    messageLabel: 'Anything else? (optional)',
    messagePlaceholder: 'Constraints, co-mentees, preferred language…',
    submitButton: 'Submit application',
    successTitle: 'Application received!',
    successMessage:
      'Thanks — we will reply within 7 business days with next steps for Speaker School.',
    applyCta: 'Apply to Speaker School',
  },
  cfsPage: {
    title: 'Call for Speakers',
    description:
      'Want to share what you know at Pereira Tech Talks? Submit a talk, panel, workshop or lightning for the monthly meetups or for Pereira Tech Day.',
    intro:
      'We look for new and seasoned voices, local and international. If you have something to bring to the community — a technical talk, a panel, a workshop, a lightning — we want to hear from you.',
    eyebrow: 'Share what you know',
    whatWeLookForTitle: 'What we look for',
    whatWeLookFor: [
      'Real technical content: production experience, architecture, postmortems, honest engineering.',
      "Accessible talks: you don't need to be senior to apply. The Speaker School is designed to support you.",
      'Diverse perspectives: gender, city, level, language (EN/ES), industry.',
      'Relevant topics: AI/ML, web platforms, devops, mobile, security, data, product engineering, leadership.',
    ],
    formatsTitle: 'Available formats',
    formats: [
      {
        name: 'Regular talk (25 min)',
        description:
          'The standard meetup format. Technical topic with space for questions.',
      },
      {
        name: 'Lightning (5–10 min)',
        description:
          'Sharp idea, example, demo or reflection. Ideal for a first talk.',
      },
      {
        name: 'Panel (40 min)',
        description:
          'Moderated conversation with 2–3 voices on a topic. Groups can apply.',
      },
      {
        name: 'Workshop (90 min)',
        description:
          'Hands-on session where attendees bring laptops. For active technical audiences.',
      },
    ],
    processTitle: 'How to apply',
    process: [
      'Fill the form below with title, format, abstract, takeaways, and a link about you.',
      'We reply within 7 days to align on date and format.',
      "If it's your first time, we can connect you with Speaker School mentorship.",
    ],
    criteriaEyebrow: 'Criteria',
    formatsEyebrow: 'Formats',
    processEyebrow: 'Process',
    formEyebrow: 'Application',
  },
  sponsorUsPage: {
    title: 'Sponsor us',
    description:
      'Connect your brand with the most active technical community in the Eje Cafetero. Since 2014 we have run 90+ meetups and 7 Pereira Tech Day editions.',
    intro:
      "Sponsoring Pereira Tech Talks is not advertising — it's building community. Every dollar translates into accessible venues, food for attendees, Speaker School scholarships, travel for invited speakers, and events open to the whole region.",
    formEyebrow: 'Inquiry',
    formSectionTitle: 'Tell us about your sponsorship interest',
  },
  sponsorsPage: {
    title: 'Sponsors',
    description:
      'Current and past sponsors of Pereira Tech Talks — companies and organizations that sustain meetups, Pereira Tech Day, and community programs in Pereira.',
    eyebrow: 'Current sponsors',
    intro: (count) =>
      `${count} active sponsors help with venues, logistics, and the stage. Per-edition sponsorship tiers live on each Pereira Tech Day page — not here.`,
    currentTitle: 'Current sponsors',
    currentIntro:
      'Who stands with Pereira Tech Talks today — monthly meetups and the annual conference.',
    pastTitle: 'Past sponsors',
    pastIntro:
      'Organizations that supported earlier chapters. Every partnership left a mark on the community.',
    sponsorUsLabel: 'Become a sponsor',
    contactLabel: 'Contact us',
    emptyTitle: 'No sponsors yet',
    emptyDesc: 'Want to support the community? Reach out.',
    breadcrumbHome: 'Home',
    why: {
      title: 'Why sponsor',
      intro:
        'We are not selling a logo on a website. We build stages where local talent meets companies that want to hire, teach, and learn in Pereira.',
      items: {
        meetups: {
          title: 'Real meetups',
          body: 'Venue, snacks, and monthly continuity — the community needs sponsors who make each talk night possible.',
        },
        ptd: {
          title: 'Pereira Tech Day',
          body: 'The annual conference with per-edition packages (gold, silver, and more). Those tier menus live on each year’s page, not here.',
        },
        talent: {
          title: 'Local talent',
          body: 'Access to engineers, speakers, and students across Risaralda who already build in public.',
        },
      },
    },
    tiers: {
      diamond: 'Diamond sponsors',
      gold: 'Gold sponsors',
      silver: 'Silver sponsors',
      bronze: 'Bronze sponsors',
      community: 'Community sponsors',
    },
    card: {
      meetupsCount: (count) =>
        count === 1 ? '1 sponsored meetup' : `${count} sponsored meetups`,
      viewSponsoredMeetups: 'View sponsored meetups',
      website: 'Website',
    },
  },

  sponsorDetail: {
    breadcrumbHome: 'Home',
    breadcrumbSponsors: 'Sponsors',
    metaDescription: (name, meetups) =>
      meetups > 0
        ? `${name} has sponsored ${meetups} Pereira Tech Talks ${meetups === 1 ? 'meetup' : 'meetups'}. Browse the full history of gatherings and editions they made possible.`
        : `${name} is a Pereira Tech Talks sponsor. See their role in the Pereira tech community and the gatherings they support.`,
    statusActive: 'Current sponsor',
    statusPast: 'Past sponsor',
    sinceLabel: (year) => `Backing the community since ${year}`,
    websiteLabel: 'Visit website',
    allSponsorsLabel: 'All sponsors',
    sponsorUsLabel: 'Become a sponsor',
    stats: {
      meetups: 'Sponsored meetups',
      editions: 'PTD editions',
      talks: 'Talks enabled',
      speakers: 'Speakers on stage',
    },
    upcomingTitle: 'Upcoming sponsored meetups',
    upcomingSubtitle:
      'Already-scheduled gatherings backed by this sponsor. Come join us.',
    meetupsTitle: 'Sponsored meetups',
    meetupsSubtitle: (name) =>
      `Every talk night ${name} helped sustain, from the most recent to the first.`,
    editionsTitle: 'Pereira Tech Day editions',
    editionsSubtitle:
      'The annual community conference and each sponsor’s tier in that edition.',
    editionUpcomingLabel: 'Upcoming edition',
    editionTierLabel: (tier) => `${tier} sponsor`,
    emptyTitle: 'No linked gatherings yet',
    emptyDesc:
      'This sponsor has no meetups or editions on record yet. We are still filling in the community archive, one chapter at a time.',
    ctaTitle: 'Want to show up here?',
    ctaBody:
      'Sponsoring Pereira Tech Talks means funding venue, logistics, and stage for the Risaralda tech community. Tell us what you have in mind.',
  },

  contributorsPage: {
    title: 'Team and community',
    description:
      'Meet the organizing team behind Pereira Tech Talks and the people who shaped earlier chapters — the humans behind the meetups and Pereira Tech Day.',
    eyebrow: 'People',
    intro: (count) =>
      `${count} active organizers keep the community running day to day. Want to join? Write to us or see how to contribute.`,
    sinceLabel: (year) => `Building community in Pereira since ${year}.`,
    currentTitle: 'Organizing team',
    currentIntro:
      'The people who coordinate meetups, Pereira Tech Day, programs, and the day-to-day operations of Pereira Tech Talks.',
    pastTitle: 'Alumni and past organizers',
    pastIntro:
      'Former organizers and collaborators from earlier chapters. They remain part of the extended community network.',
    joinLabel: 'Join the team',
    contributeLabel: 'How to contribute',
    emptyTitle: 'No team members yet',
    emptyDesc: "We're consolidating the directory. Check back soon.",
  },

  calendarPage: {
    title: 'Community calendar',
    subtitle: 'Pereira tech events in one place',
    description:
      'Shared calendar for Pereira’s tech community — Pereira Tech Talks meetups plus allied community events across Risaralda, Colombia.',
    heroDescription:
      'Browse upcoming meetups, workshops, and conferences from Pereira Tech Talks and allied communities. Filter by group, switch between month and agenda views, and subscribe with your favorite calendar app.',
    eyebrow: 'Community',
    hubEyebrow: 'Live schedule',
    filterLabel: 'Show calendars',
    filterAll: 'All communities',
    viewMonth: 'Month',
    viewAgenda: 'Agenda',
    legendLabel: 'Selected community calendars',
    embedTitle: 'Community events calendar',
    embedFallback:
      'If the embed does not load, open the calendar directly in Google Calendar:',
    openExternal: 'Open in Google Calendar',
    subscribeIcs: 'Subscribe (ICS)',
    lumaRsvp: 'RSVP on Luma',
    websiteLink: 'Website',
    noActiveCalendars:
      'No public calendars are active yet. Browse our meetup archive or contact us to add your community.',
    comingSoon: 'More communities coming soon',
    inactiveNote:
      'These allied groups are joining the hub. Organizers can share a public Google Calendar ID with the form below.',
    quickLinksEyebrow: 'Quick links',
    quickLinksTitle: 'RSVP and archives',
    meetupsLink: 'Meetup archive',
    lumaLink: 'PTT events on Luma',
    contributeEyebrow: 'Contribute',
    contributeTitle: 'List your community calendar',
    contributeDescription:
      'If you run a Pereira tech meetup or user group, make your Google Calendar public and submit the ID below. We will add a color-coded feed to this hub after a quick review.',
    contributeCta: 'Propose your calendar',
    breadcrumbHome: 'Home',
  },

  calendarForm: {
    formTitle: 'Community calendar proposal',
    communityLabel: 'Community / meetup name',
    communityPlaceholder: 'e.g. Pereira JS, Women Who Code Pereira',
    calendarIdLabel: 'Google Calendar ID',
    calendarIdPlaceholder: 'your-calendar@group.calendar.google.com',
    calendarIdHint:
      'In Google Calendar → Settings → Integrate calendar → Calendar ID (must be public).',
    publicUrlLabel: 'Public calendar URL (optional)',
    publicUrlPlaceholder: 'https://calendar.google.com/calendar/…',
    websiteLabel: 'Community website (optional)',
    websitePlaceholder: 'https://…',
    descriptionLabel: 'Short description',
    descriptionPlaceholder:
      'Who you are, cadence, and the kinds of events you host…',
    submitButton: 'Submit calendar proposal',
    successTitle: 'Proposal received!',
    successMessage:
      'Thanks — we will review the public feed and follow up within 7 business days.',
  },

  conductForm: {
    formEyebrow: 'Confidential report',
    formSectionTitle: 'Report a Code of Conduct concern',
    privacyNote:
      'Reports go to organizers only. They are not listed publicly and are not posted to community Slack channels. You may submit anonymously.',
    incidentLabel: 'What happened?',
    incidentPlaceholder:
      'Describe the incident with as much context as you are comfortable sharing…',
    whenLabel: 'When did it happen? (optional)',
    whenPlaceholder: 'Date, time, or event name…',
    peopleLabel: 'People involved (optional)',
    peoplePlaceholder: 'Names or roles, if known…',
    anonymousLabel: 'Submit anonymously',
    anonymousHint:
      'If you choose anonymity, we will not store a reporter name or email with this report.',
    nameLabel: 'Your name (optional if anonymous)',
    emailLabel: 'Your email (required unless anonymous)',
    followupLabel: 'Preferred follow-up (optional)',
    followupPlaceholder: 'Email, call, or “no follow-up needed”…',
    submitButton: 'Submit confidential report',
    successTitle: 'Report received',
    successMessage:
      'Thank you. Organizers will review this confidentially and act as quickly and fairly as possible.',
  },

  contactSection: {
    title: "Let's connect",
    description:
      'We are always open to new conversations — speakers, sponsors, partners, and curious community members. Reach out and let’s build the next chapter together.',
    ctaText: 'Get in touch',
    ctaLink: '/en/contact?topic=general&subject=General%20Inquiry',
  },

  // Search input
  searchPlaceholder: 'Search articles...',
  searchHint: 'Tip: press Esc to clear the search.',
  clearSearch: 'Clear',
  resultsFound: (count) => `${count} result${count !== 1 ? 's' : ''} found`,

  // Loading states
  loadingIndex: 'Loading search index...',
  searching: 'Searching articles...',

  // Results
  noResults: (query) => `No articles found matching "${query}"`,
  noResultsSuggestion: 'Try a broader keyword or browse all posts.',
  noPostsAvailable: 'No posts available yet.',

  // Pagination
  previous: 'Previous',
  next: 'Next',
  pageOf: (current, total) => `Page ${current} of ${total}`,

  // Blog header
  blogTitle: 'Blog',
  blogHeading: 'Articles & Stories',
  blogDescription:
    'Articles, meetup recaps, and tutorials from Pereira Tech Talks — community writing from the Risaralda tech scene in Pereira, Colombia, since 2014.',
  allPosts: 'All Posts',
  showingArticles: (showing, total) =>
    `Showing ${showing} of ${total} articles`,
  articlesAvailable: (total) =>
    `${total} article${total !== 1 ? 's' : ''} available`,
  lastUpdatedOn: 'Updated',
  readingTime: (minutes) => `${minutes} min read`,
  relatedArticles: 'Related Articles',
  relatedArticlesDescription: 'You might also enjoy these posts',

  // Series navigation
  seriesPartOf: 'Part of the series',
  seriesChapter: (n) => `Chapter ${n}`,
  seriesPrevious: 'Previous chapter',
  seriesNext: 'Next chapter',
  seriesToC: 'All chapters',
  seriesChapterOf: (current, total) => `Chapter ${current} of ${total}`,

  // Floating indicators that link a blog post to its companion slide deck (and back).
  slideIndicator: {
    label: 'Slides',
    subtitle: 'Open deck →',
    ariaLabel: 'Open companion slide deck',
  },
  postIndicator: {
    label: 'Article',
    subtitle: 'Read post →',
    ariaLabel: 'Read companion blog post',
  },

  // Series pages
  seriesPage: {
    title: 'Series',
    breadcrumb: 'Series',
    chapters: 'chapters',
    chapter: 'Chapter',
    progress: (current, total) => `${current} of ${total} chapters`,
    readChapter: 'Read chapter',
    emptyState: 'No posts in this series yet.',
    backToSeries: 'All Series',
    backToBlog: 'Back to Blog',
    startReading: 'Start reading',
    continueReading: 'Continue reading',
  },
  seriesListingPage: {
    title: 'Blog Series',
    description:
      'Curated multi-chapter article collections from the Pereira Tech Talks community — deep dives into technology, software engineering, and the craft of building.',
    heading: 'Series',
    postsCount: (count) => `${count} ${count === 1 ? 'chapter' : 'chapters'}`,
    exploreSeries: 'Explore series',
    emptyState: 'No series published yet.',
  },

  // Scheduled posts (dev-only indicators)
  scheduledBadge: 'Scheduled',
  scheduledBannerTitle: 'Scheduled post',
  scheduledBannerMessage: (date) =>
    `This post will be published on ${date}. It is only visible in development mode.`,

  // Draft posts (dev + preview indicators)
  draftBadge: 'Draft',
  draftBannerTitle: 'Draft post',
  draftBannerMessage:
    'This post is a work in progress. It is visible here because you are on the dev server or a preview branch — it will not ship to production until the draft flag is removed.',

  // Tags
  postsTagged: (tag) => `Posts tagged "${tag}"`,
  allTags: 'All Tags',
  tagNames: {
    // Primary tags
    tech: 'Tech',
    talks: 'Talks',
    community: 'Community',
    keynote: 'Keynote',
    workshop: 'Workshop',
    'lightning-talk': 'Lightning Talk',
    // Secondary tags (topics)
    'web-development': 'Web Development',
    javascript: 'JavaScript',
    ai: 'AI & ML',
    blockchain: 'Blockchain',
    devops: 'DevOps',
    python: 'Python',
    university: 'University',
    database: 'Databases',
    iot: 'IoT',
    design: 'Design',
    mobile: 'Mobile',
    'ai-agents': 'AI Agents',
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
    tech: 'Tutorials, guides, and technical articles from the community.',
    talks: 'Tech talks, slides, videos, and events.',
    community:
      'Community-focused articles — meetup recaps, governance, organizing the local ecosystem.',
    keynote:
      'Keynote talks — flagship presentations from Pereira Tech Day and major events.',
    workshop:
      'Hands-on workshops — practical, multi-hour sessions with code, exercises, and step-by-step guidance.',
    'lightning-talk':
      'Lightning talks — short 5–10 minute presentations that pack a single sharp idea.',
    // Secondary tags (topics)
    'web-development':
      'Frameworks, frontend, fullstack — Astro, Svelte, Vue, Meteor, CSS, Webpack.',
    javascript:
      'JavaScript ecosystem — Vue.js, Webpack, Meteor, A-Frame, Node.',
    ai: 'Artificial intelligence, machine learning, deep learning, and LLMs.',
    blockchain:
      'Blockchain, cryptocurrency, Bitcoin, Ethereum, and smart contracts.',
    devops: 'Docker, containers, serverless, microservices, and deployment.',
    python: 'Python ecosystem — Django, TensorFlow, MyPy, Spark.',
    university: 'Academic coursework, research, and student projects.',
    database: 'SQL, NoSQL, MongoDB, and multi-database architecture.',
    iot: 'Internet of Things, sensors, hardware, and voice interfaces.',
    design: 'Visual design, branding, web design, and UX.',
    mobile:
      'Mobile development — Android, iOS, cross-platform frameworks, and the journey of learning to ship for handhelds.',
    'ai-agents':
      'AI agents and the agentic web — autonomous systems, tool use, orchestration patterns, MCP, and the .well-known agent standards.',
    // Subtopic tags
    astro:
      'Astro framework — islands architecture, Content Collections, MDX, and static-site builds.',
    svelte:
      'Svelte and SvelteKit — reactive components, runes, and hydration patterns.',
    cloudflare: 'Cloudflare Pages, Workers, R2, and the agentic-web platform.',
    docker:
      'Docker containers, Dockerfile authoring, and multi-service orchestration.',
    graphql:
      'GraphQL APIs — schemas, resolvers, federation, and client patterns.',
    django:
      'Django framework — ORM, multi-database setups, admin, and deployment.',
    kotlin:
      'Kotlin language and ecosystem — Kotlin Multiplatform, Compose Multiplatform, Android, JVM tooling.',
    claude:
      "Claude — Anthropic's model family and the agent runtimes built on top (Claude Code, Skills, Files API).",
    mcp: 'Model Context Protocol — standardized agent↔tool communication, server cards, and the agentic-web standards layer.',
    flutter:
      'Flutter — Dart-based cross-platform mobile framework, widgets, and the trade-offs versus native and Kotlin Multiplatform.',
  },

  // Series names and descriptions (keyed by series slug). Empty during the v3.0.0 transition.
  seriesNames: {},
  seriesDescriptions: {},

  // Date formatting
  dateLocale: 'en-US',

  // Read more
  readMore: 'Read more',

  // Scroll to timeline
  scrollToTimeline: 'View Timeline',
  viewLabel: (label: string) => `View ${label}`,

  // 404 page
  notFoundPage: {
    title: 'Page Not Found',
    description:
      'The page you are looking for does not exist or has been moved. Explore the blog or head back to the homepage to keep browsing the Pereira Tech Talks community.',
    heading: 'This page wandered off the map',
    message:
      'The URL may be outdated or mistyped. Pick a destination below — meetups, Pereira Tech Day, or the blog — and keep exploring the community.',
    eyebrow: '404 · Lost signal',
    backHome: 'Go back home',
    searchBlog: 'Browse the blog',
    meetupsCta: 'See meetups',
    ptdCta: 'Pereira Tech Day',
  },

  verticalsPage: {
    title: 'Programs',
    description:
      'Four Pereira Tech Talks programs: Speaker School, La Biblioteca del Mañana, AI Channel, and monthly meetups — each with its own rhythm, audience, and goals.',
    intro:
      'These are the spaces where the community builds for the long run. Want to participate? Reach out.',
    eyebrow: 'Structure',
    sectionEyebrow: 'Programs',
    sectionTitle: 'Four active fronts',
    programLabel: 'Program',
    learnMore: 'Learn more',
    relatedMeetups: 'Related meetups',
    contactCta: 'Contact us',
    joinCta: 'How to join',
    applyCta: 'Apply to Speaker School',
    emptyTitle: 'No programs yet',
    emptyDesc: "We're consolidating the programs. Check back soon.",
    statusActive: 'Active',
    statusPaused: 'Paused',
    statusArchived: 'Archived',
  },

  ptdPage: {
    recordingCta: 'Watch event recording',
    schedule: 'Schedule',
    talks: 'Talks',
    speakers: 'Speakers',
    gallery: 'Gallery',
    galleryMemories: 'Event memories',
    sponsors: 'Sponsors',
    sponsorsSubtitle: 'Companies **supporting** this edition of the event.',
    sponsorsFooter:
      'Thank you for powering the Pereira and regional tech ecosystem.',
    communities: 'Allied communities',
    communitiesOrganizes: 'Organizes',
    communitiesOrganizesSubtitle:
      'Together with these communities we strengthen the Pereira and regional tech ecosystem.',
    communitiesOrganizesFooter:
      'A network of communities connecting talent, learning, and collaboration.',
    organizers: 'Organizers',
    organizersSubtitle:
      'The people who lead and make Pereira Tech Day possible.',
    collaborators: 'Collaborators',
    collaboratorsSubtitle:
      'People and allies who strengthen the event’s delivery.',
    about: 'About Pereira Tech Day',
    pricing: 'Sponsorship plans',
    faq: 'Frequently asked questions (FAQ)',
    faqSubtitle:
      'A few short questions that may clear up common doubts. If anything is still unclear, email us and we will get back to you.',
    joinTitle: "Join the region's tech future.",
    joinSubtitle: "Be part of the ecosystem's growth.",
    joinCta: 'Explore Pereira Tech Talks',
    lightningTitle: 'Lightning talks',
    lightningTagline: 'Short talks',
    scheduleEyebrow: 'Agenda',
    scheduleTentativeBadge: 'Tentative',
    scheduleTentativeNote:
      'Times and speakers may still change. We will reveal the full line-up over the coming days.',
    scheduleToBeRevealed: 'To be revealed',
    scheduleViewDetail: 'View details',
    scheduleModalClose: 'Close',
    scheduleModalAbout: 'About the speaker',
    scheduleModalSession: 'Talk',
    scheduleModalProfile: 'View full profile',
    scheduleAbstractPending: 'We will share the abstract for this talk soon.',
    schedulePendingSpeaker: 'Speaker {n}',
    scheduleAnchor: 'Schedule',
    scheduleAnchorCta: 'View schedule',
    languageSwitcher: 'Change language',
    speakersEyebrow: 'Line-up',
    speakersUpcomingSubtitle:
      'A full day of talks to get you inspired, with speakers from the regional tech ecosystem and beyond.',
    speakersRevealSoon:
      'We are still confirming speakers. The remaining names will be announced this week.',
    lightningPendingMessage: 'To be announced soon.',
    lightningPendingCard: 'Lightning talk',
    lightningPendingCta: 'See sponsorship plans',
    registerCta: 'Register',
    postponedBadge: 'Event postponed',
    postponedHeroBadge: 'Postponed indefinitely',
    postponedSince: 'Announcement published on {date}.',
    postponedReadCta: 'Read the announcement',
    subscribe: {
      copy: 'Get notified when registration opens for the event. Do not miss it!',
      emailLabel: 'Email',
      emailPlaceholder: 'Enter your email address',
      button: 'Subscribe',
      submitting: 'Sending…',
      success: 'Registered!',
      error: 'Could not subscribe. Try again.',
    },
    indexFeatured: 'Featured edition',
    indexUpcoming: 'Upcoming edition',
    indexPast: 'Past editions',
    indexIntro:
      'The community flagship conference — one full day of talks, panels, and networking in Pereira. Browse the archive and the next edition.',
    indexEyebrow: 'Annual conference',
    indexCfsCta: 'Call for Speakers',
    indexSponsorCta: 'Sponsor the event',
    indexStatEditions: 'Editions',
    indexStatYears: 'Years',
    indexStatSince: 'Since',
    indexCalendarEyebrow: 'Calendar',
    indexHistoryEyebrow: 'History',
    indexPastSubtitle:
      'Every year leaves its own mark — revisit the editions that shaped Pereira.',
    editionNavLabel: 'Pereira Tech Day navigation',
    previousEditions: 'Other editions',
    allEditions: 'All editions',
    indexStagePrimaryCta: 'View this edition',
    indexPastRowEyebrow: 'Past edition',
    indexPastRowCta: 'View edition recap',
    indexNoUpcomingTitle: 'A year of bold talks',
    indexNoUpcomingIntro:
      'The next Pereira Tech Day is in the making. Follow the community to be the first to know.',
  },

  // Blog post engagement
  engagement: {
    // Share buttons
    shareTitle: 'Share this post',
    shareSeriesTitle: 'Share this series',
    shareOnTwitter: 'Share on X',
    shareOnLinkedIn: 'Share on LinkedIn',
    shareOnWhatsApp: 'Share on WhatsApp',
    copyLink: 'Copy link',
    linkCopied: 'Link copied!',

    // Newsletter
    newsletterTitle: 'Stay in the loop',
    newsletterDescription:
      'Get notified when the community publishes new articles, recaps, and event announcements. No spam, unsubscribe anytime.',
    newsletterPlaceholder: 'your@email.com',
    newsletterButton: 'Subscribe',
    newsletterSubmitting: 'Subscribing...',
    newsletterSuccessTitle: 'You\u2019re subscribed!',
    newsletterSuccessMessage:
      'Thanks for subscribing. You\u2019ll hear from us when something new is published.',
    newsletterInvalidEmail: 'Please enter a valid email address.',
    newsletterAlreadySubscribed:
      'You\u2019re already subscribed. Thanks for being here!',
    newsletterResubscribe: 'Subscribe with a different email',
    newsletterPrivacy: 'No spam. Unsubscribe anytime.',

    // End-of-post CTA
    ctaTitle: 'Enjoyed this post?',
    ctaDescription:
      'Share it with your network or subscribe to get the latest community articles in your inbox.',
  },

  // Blog engagement (author + share)
  blogEngagement: {
    aboutAuthor: 'About the author',
    writtenBy: 'Written by',
  },

  certificates: {
    pageTitle: 'Certificate of attendance',
    pageDescription:
      'Digital diploma for {name} — {event}. Print, save as PDF, or share your personal link.',
    diplomaTitle: 'Certificate of Attendance',
    preamble: 'This certifies that',
    attendedPrefix: 'attended',
    sealLabel: 'Verifiable\nDocument',
    issuedBy: 'Issued by',
    verifyLabel: 'Verify',
    qrAlt: 'QR code to verify this certificate',
    demoBanner:
      'Demo diploma — fictional recipient. Production certificates will use the same personal URL pattern.',
    backToEvent: 'Back to Pereira Tech Day',
    watermarkRevoked: 'Revoked',
    roles: {
      attendee: 'Attendee',
      speaker: 'Speaker',
      volunteer: 'Volunteer',
    },
    actions: {
      print: 'Print / Save PDF',
      downloadJson: 'Download JSON',
      copyLink: 'Copy link',
      share: 'Share',
      copied: 'Link copied',
      shared: 'Shared',
      shareFailed: 'Could not copy or share. Try again.',
    },
    verify: {
      title: 'Verify a certificate',
      description:
        'Check the status of a Pereira Tech Talks attendance diploma using its opaque identifier.',
      intro:
        'Enter the certificate ID from the diploma or scan the QR code to confirm authenticity.',
      idLabel: 'Certificate ID',
      idPlaceholder: 'e.g. ptd26_demo_a7k3m9qx',
      submit: 'Verify',
      statusLabel: 'Status',
      subject: 'Recipient',
      event: 'Event',
      certId: 'Certificate ID',
      viewDiploma: 'View diploma',
      emptyHint: 'Paste a certificate ID to see its verification status.',
      cryptoLabel: 'Cryptographic proof',
      cryptoSigned:
        'Ed25519 signature verified against did:web:pereiratechtalks.org.',
      cryptoDemo:
        'Demo signature verified (development key — not production issuance).',
      cryptoUnsigned:
        'No signed JSON-LD artifact on file (registry fixture only).',
      cryptoFailed: 'Signature verification failed or proof is missing.',
      cryptoRevokedSigned:
        'Signature is valid, but the credential lifecycle status is not valid.',
      statuses: {
        valid: 'Valid',
        revoked: 'Revoked',
        replaced: 'Replaced',
        expired: 'Expired',
        unknown: 'Unknown',
      },
      reasons: {
        missing_id: 'No certificate ID was provided.',
        not_found: 'No certificate matches this ID.',
        revoked: 'This certificate was revoked by the issuer.',
        replaced: 'This certificate was replaced by a newer document.',
        expired: 'This certificate is past its validity window.',
      },
    },
  },

  // Errors
  searchError: 'An error occurred while searching. Please try again.',
  loadError: 'Failed to load search index. Please refresh the page.',
  retry: 'Try again',
};
