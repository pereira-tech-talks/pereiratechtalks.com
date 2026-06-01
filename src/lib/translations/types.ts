/**
 * Translation type definitions
 *
 * Defines the shape of all translation objects.
 * Each locale file (en.ts, es.ts) must satisfy the SiteTranslations interface.
 */

export interface PagePassion {
  title: string;
  description: string;
  icon: string;
  link: string;
}

export interface SiteTranslations {
  // Site metadata
  siteTitle: string;
  siteTitleFull: string;
  siteDescription: string;

  // Navigation
  nav: {
    home: string;
    blog: string;
    about: string;
    contact: string;
    slides: string;
    meetups: string;
    pereiraTechDays: string;
    speakers: string;
    talks: string;
    sponsors: string;
    contributors: string;
    verticals: string;
    channels: string;
    press: string;
    community: string;
  };

  // Footer
  footer: {
    copyright: string;
    allRightsReserved: string;
  };

  // Homepage hero
  hero: {
    tagline: string;
    description: string;
    typewriterWords: string[];
  };

  // Homepage sections
  homeSections: {
    about: {
      title: string;
      description: string;
      cta: string;
      cta2: string;
    };
    community: {
      title: string;
      subtitle: string;
      description: string;
      cta: string;
    };
    latestArticles: string;
    viewAllPosts: string;
  };

  // Contact section (homepage)
  contact: {
    title: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    sendButton: string;
  };

  // About page
  aboutPage: {
    title: string;
    subtitle: string;
    description: string;
    heroDescription: string;
    bioTitle: string;
    bioText: string;
    passionsTitle: string;
    passions: PagePassion[];
    quickFactsTitle: string;
    quickFacts: string[];
    ctaTitle: string;
    ctaDescription: string;
    ctaCv: string;
    ctaContact: string;
  };

  // Contact page
  contactPage: {
    title: string;
    subtitle: string;
    description: string;
    heroDescription: string;
    formTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    reasonLabel: string;
    reasonOptions: { value: string; label: string }[];
    subjectLabel: string;
    subjectPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    sendButton: string;
    sendingButton: string;
    successTitle: string;
    successMessage: string;
    sendAnotherButton: string;
    requiredField: string;
    invalidEmail: string;
    submitError: string;
    fallbackMessage: string;
    fallbackEmailText: string;
    formNote: string;
    socialTitle: string;
    locationTitle: string;
    locationText: string;
    prefillSubjects: {
      generalInquiry: string;
      collaboration: string;
      projectInquiry: string;
      projectCollaboration: string;
      startupCollaboration: string;
      techTalkInvitation: string;
    };
  };

  // Homepage Let's Connect section
  contactSection: {
    title: string;
    description: string;
    ctaText: string;
    ctaLink: string;
  };

  // Search input
  searchPlaceholder: string;
  searchHint: string;
  clearSearch: string;
  resultsFound: (count: number) => string;

  // Loading states
  loadingIndex: string;
  searching: string;

  // Results
  noResults: (query: string) => string;
  noResultsSuggestion: string;
  noPostsAvailable: string;

  // Pagination
  previous: string;
  next: string;
  pageOf: (current: number, total: number) => string;

  // Blog header
  blogTitle: string;
  blogHeading: string;
  blogDescription: string;
  allPosts: string;
  showingArticles: (showing: number, total: number) => string;
  articlesAvailable: (total: number) => string;
  lastUpdatedOn: string;
  readingTime: (minutes: number) => string;
  relatedArticles: string;
  relatedArticlesDescription: string;

  // Series navigation
  seriesPartOf: string;
  seriesChapter: (n: number) => string;
  seriesPrevious: string;
  seriesNext: string;
  seriesToC: string;
  seriesChapterOf: (current: number, total: number) => string;

  // Cross-content floating indicators (blog ↔ slide)
  slideIndicator: {
    label: string;
    subtitle: string;
    ariaLabel: string;
  };
  postIndicator: {
    label: string;
    subtitle: string;
    ariaLabel: string;
  };

  // Series pages
  seriesPage: {
    title: string;
    breadcrumb: string;
    chapters: string;
    chapter: string;
    progress: (current: number, total: number) => string;
    readChapter: string;
    emptyState: string;
    backToSeries: string;
    backToBlog: string;
    startReading: string;
    continueReading: string;
  };
  seriesListingPage: {
    title: string;
    description: string;
    heading: string;
    postsCount: (count: number) => string;
    exploreSeries: string;
    emptyState: string;
  };

  // Scheduled posts (dev-only indicators)
  scheduledBadge: string;
  scheduledBannerTitle: string;
  scheduledBannerMessage: (date: string) => string;

  // Draft posts (dev + preview indicators)
  draftBadge: string;
  draftBannerTitle: string;
  draftBannerMessage: string;

  // Tags (unified — covers primary, secondary, and subtopic tiers)
  postsTagged: (tag: string) => string;
  allTags: string;
  tagNames: Record<string, string>;
  tagDescriptions: Record<string, string>;

  // Series names and descriptions (keyed by series slug)
  seriesNames: Record<string, string>;
  seriesDescriptions: Record<string, string>;

  // Date formatting
  dateLocale: string;

  // Read more
  readMore: string;

  // Scroll to timeline
  scrollToTimeline: string;
  viewLabel: (label: string) => string;

  // 404 page
  notFoundPage: {
    title: string;
    description: string;
    heading: string;
    message: string;
    backHome: string;
    searchBlog: string;
  };

  // Blog post engagement
  engagement: {
    // Share buttons
    shareTitle: string;
    shareSeriesTitle: string;
    shareOnTwitter: string;
    shareOnLinkedIn: string;
    shareOnWhatsApp: string;
    copyLink: string;
    linkCopied: string;

    // Newsletter
    newsletterTitle: string;
    newsletterDescription: string;
    newsletterPlaceholder: string;
    newsletterButton: string;
    newsletterSubmitting: string;
    newsletterSuccessTitle: string;
    newsletterSuccessMessage: string;
    newsletterInvalidEmail: string;
    newsletterAlreadySubscribed: string;
    newsletterResubscribe: string;
    newsletterPrivacy: string;

    // End-of-post CTA
    ctaTitle: string;
    ctaDescription: string;
  };

  // Slides listing page
  slidesPage: {
    title: string;
    subtitle: string;
    description: string;
    heroDescription: string;
    timelineTitle: string;
    emptyState: string;
    viewAll: string;
  };

  // Slides / deck pages
  slides: {
    exitToCatalog: string;
    printPdf: string;
    languageSwitch: string;
    external: {
      openCta: string;
      backToCatalog: string;
    };
    languageNotice: string;
    typeBadge: {
      native: string;
      external: string;
    };
    toolbar: {
      backToCatalog: string;
      switchLang: string;
      themeToLight: string;
      themeToDark: string;
      enterFullscreen: string;
      exitFullscreen: string;
    };
  };

  // Blog engagement (author + share)
  blogEngagement: {
    aboutAuthor: string;
    writtenBy: string;
  };

  // Errors
  searchError: string;
  loadError: string;
  retry: string;
}
