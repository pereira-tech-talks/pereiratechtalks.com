/**
 * English translations
 */

import type { SiteTranslations } from './types';

export const en: SiteTranslations = {
  // Site metadata
  siteTitle: 'Pereira Tech Talks',
  siteTitleFull:
    'Pereira Tech Talks — Bilingual technology community of Pereira, Colombia',
  siteDescription:
    'Pereira Tech Talks — Colombia’s bilingual tech community since 2014. 80+ monthly meetups, 10 Pereira Tech Day editions, Speaker School, La Biblioteca del Mañana.',

  // Navigation
  nav: {
    home: 'Home',
    blog: 'Blog',
    about: 'About',
    contact: 'Contact',
    slides: 'Slides',
    meetups: 'Meetups',
    pereiraTechDays: 'Pereira Tech Days',
    speakers: 'Speakers',
    talks: 'Talks',
    sponsors: 'Sponsors',
    contributors: 'Team',
    verticals: 'Programs',
    channels: 'Channels',
    press: 'Press',
    community: 'Community',
  },

  // Footer
  footer: {
    copyright: 'Pereira Tech Talks',
    allRightsReserved: 'All rights reserved.',
  },

  // Homepage hero
  hero: {
    tagline: 'Bilingual tech community · Pereira, Risaralda · Since 2014',
    description:
      'We are <strong class="text-white">Pereira Tech Talks</strong> — 80+ monthly meetups since 2014, 10 <em>Pereira Tech Day</em> editions, an active Speaker School, and a bilingual library. Where Pereira’s tech community ships to YC startups, conference stages across Latin America, and global engineering roles.',
    typewriterWords: [
      'Monthly meetups since 2014',
      'Pereira Tech Day, every year',
      'Speaker School',
      'La Biblioteca del Mañana',
      'AI & Agents Channel',
    ],
  },

  // Homepage sections
  homeSections: {
    about: {
      title: "We are <span class='text-secondary'>Pereira Tech Talks</span>",
      description: `On a February evening in 2014, eight developers crowded into a UTP classroom for the first PereiraJS meetup. Twelve years and 80+ meetups later, that small circle became Pereira Tech Talks — four flagship programs running in parallel: monthly meetups, the annual <strong>Pereira Tech Day</strong> conference, the <strong>Speaker School</strong>, and the <strong>La Biblioteca del Mañana</strong> reading club. All volunteer-built. All bilingual. All open.<br /><br />
Every recap, slide deck, and blog post is published in English and Spanish, structured to be just as useful to AI agents as to humans. Speakers who started in this room now keynote in Bogotá, Medellín, and Mexico City; alumni work at YC startups, GitHub-sponsored projects, and international engineering teams.<br /><br />
Browse the catalog, attend the next meetup, or get in touch if you want to speak, sponsor, or join us.`,
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
  aboutPage: {
    title: 'About Pereira Tech Talks',
    subtitle: 'A bilingual technology community from Pereira to the world',
    description:
      'Get to know Pereira Tech Talks — a bilingual technology community in Pereira, Risaralda, hosting meetups, the Pereira Tech Day conference, the Speaker School, and the La Biblioteca del Mañana reading club since 2014.',
    heroDescription:
      'The technology community of Pereira (Risaralda, Colombia). Founded 2014. 80+ monthly meetups, 10 Pereira Tech Day editions, an active Speaker School and bilingual library. Volunteer-run. Open to everyone.',
    bioTitle: 'Who we are',
    bioText:
      'Pereira Tech Talks (PTT) is the technology community of Pereira, Risaralda, Colombia. We were born in 2014 as a small group of engineers and designers wanting a space to share what we were learning. A decade later, the community has grown into a multi-program organization that hosts monthly meetups, the annual <strong>Pereira Tech Day</strong> conference, the <strong>Speaker School</strong>, the <strong>La Biblioteca del Mañana</strong> reading club, and a dedicated AI channel — all with a bilingual EN/ES voice and an international outlook.<br /><br />Our work is volunteer-run, sponsor-supported, and open. The website you are reading is the operational backbone: a bilingual catalog of meetups, talks, slides, speakers, contributors, and sponsors, designed to be just as readable for AI agents as it is for humans.<br /><br />We believe technology grows faster when we share what we learn. We believe Pereira has world-class talent that deserves world-class stages. We believe a tech community should look like the city it lives in — open, warm, mixed, and unpretentious.',
    passionsTitle: 'What we do',
    passions: [
      {
        title: 'Monthly Meetups',
        description:
          'In-person and hybrid sessions every month — talks, workshops, and lightning rounds on the topics shaping the industry.',
        icon: '\u{1F465}',
        link: '/blog',
      },
      {
        title: 'Pereira Tech Day',
        description:
          'Our flagship annual conference — a full day of keynotes, workshops, and networking with international speakers and local partners.',
        icon: '\u{1F389}',
        link: '/blog',
      },
      {
        title: 'Speaker School',
        description:
          'A program to grow new technical speakers — from idea to stage — with mentorship, practice runs, and rehearsals.',
        icon: '\u{1F3A4}',
        link: '/blog',
      },
      {
        title: 'La Biblioteca del Mañana',
        description:
          'A reading club connecting science fiction, philosophy, and technology — exploring the future through the books that shape it.',
        icon: '\u{1F4DA}',
        link: '/blog',
      },
      {
        title: 'AI Channel',
        description:
          'A dedicated track on AI, LLMs, agents, and the agentic web — where the community meets the most disruptive technology of the decade.',
        icon: '\u{1F916}',
        link: '/blog',
      },
      {
        title: 'Bilingual Library',
        description:
          'Articles, slides, and recaps published in English and Spanish — accessible to local talent and the international tech community alike.',
        icon: '\u{1F30D}',
        link: '/blog',
      },
    ],
    quickFactsTitle: 'Quick facts',
    quickFacts: [
      'Founded in Pereira, Risaralda, Colombia (2014)',
      'Bilingual community: English and Spanish',
      '90+ monthly meetups since 2014',
      'Multiple Pereira Tech Day editions hosted',
      'Volunteer-run, sponsor-supported, free to attend',
      'Fully AI-agent-readable content (AEO 100)',
      'Philosophy: share what you learn, grow the local ecosystem',
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
      'Browse all slide decks from Pereira Tech Talks meetups, Pereira Tech Day editions, and Speaker School sessions — bilingual presentations from our community speakers.',
    heroDescription:
      'A bilingual library of presentation decks from Pereira Tech Talks events — meetups, Pereira Tech Day, Speaker School, and workshops. Built in-house with Reveal.js or hosted on external platforms.',
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
      'Get in touch with Pereira Tech Talks — open to speakers, sponsors, partners, and members of the community who want to participate, propose ideas, or collaborate.',
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
      { value: 'tech-talk', label: 'Speaker proposal / Talk submission' },
      {
        value: 'collaboration',
        label: 'Community collaboration / Partnership',
      },
      { value: 'project', label: 'Sponsor / Sponsorship inquiry' },
      {
        value: 'the-library-of-tomorrow',
        label: 'Join La Biblioteca del Mañana',
      },
      { value: 'other', label: 'Other' },
    ],
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
      "We couldn't deliver your message right now. Please try again in a few minutes or email hello@pereiratechtalks.org.",
    fallbackMessage:
      'The contact form is currently unavailable. You can reach us directly by email.',
    fallbackEmailText: 'Send us an email at',
    formNote: "We'll get back to you as soon as possible.",
    socialTitle: 'Connect with us',
    locationTitle: 'Location',
    locationText:
      'Based in Pereira, Risaralda, Colombia. Bilingual EN/ES. Open to remote partners and international speakers worldwide.',
    prefillSubjects: {
      generalInquiry: 'General Inquiry',
      collaboration: 'Community Collaboration',
      projectInquiry: 'Sponsorship Inquiry',
      projectCollaboration: 'Partnership Proposal',
      startupCollaboration: 'Startup Collaboration',
      techTalkInvitation: 'Speaker Proposal',
    },
  },

  contactSection: {
    title: "Let's connect",
    description:
      'We are always open to new conversations — speakers, sponsors, partners, and curious community members. Reach out and let’s build the next chapter together.',
    ctaText: 'Get in touch',
    ctaLink: '/contact?topic=general&subject=General%20Inquiry',
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
    'Articles, recaps, and tutorials from the Pereira Tech Talks community',
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
    heading: 'Page Not Found',
    message:
      "Sorry, the page you are looking for doesn't exist or may have been moved. Try navigating back to the homepage or searching the blog.",
    backHome: 'Go back home',
    searchBlog: 'Search the blog',
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

  // Errors
  searchError: 'An error occurred while searching. Please try again.',
  loadError: 'Failed to load search index. Please refresh the page.',
  retry: 'Try again',
};
