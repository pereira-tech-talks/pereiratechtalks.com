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
    calendar: string;
    communities: string;
    sponsors: string;
    contributors: string;
    verticals: string;
    channels: string;
    press: string;
    community: string;
    menu: string;
    closeMenu: string;
    openMenu: string;
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
    ctaMeetups: string;
    ctaPtd: string;
    ctaContact: string;
    scrollLabel: string;
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
    meetups: {
      eyebrow: string;
      upcomingTitle: string;
      latestTitle: string;
      cta: string;
    };
    verticals: {
      eyebrow: string;
      title: string;
      subtitle: string;
      cta: string;
    };
    ptd: {
      eyebrow: string;
      title: string;
      subtitle: string;
      cta: string;
    };
    ptdStrip: {
      eyebrow: string;
      title: string;
      subtitle: string;
      cta: string;
      date: string;
      venue: string;
      attendance: string;
      /**
       * Used instead of `eyebrow` / `cta` while the edition is postponed; the
       * headline and body copy come from the edition's `postponement` block,
       * not from here. Unused in every other status.
       */
      postponedEyebrow: string;
      postponedCta: string;
    };
    sponsors: {
      eyebrow: string;
      title: string;
      subtitle: string;
      cta: string;
      ctaJoin: string;
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

  // Meetups listing page
  meetupsPage: {
    title: string;
    /** SEO description — placeholders: {meetups}, {talks}, {speakers}, {sinceYear} */
    description: string;
    intro: string;
    upcoming: string;
    past: string;
    /** Unified timeline heading — upcoming + archive in one list. */
    allMeetups: string;
    emptyUpcomingTitle: string;
    emptyUpcomingDescription: string;
    ctaLuma: string;
    /** Hero eyebrow above the H1 (not the numeric stats). */
    eyebrow: string;
    statMeetups: string;
    statTalks: string;
    statSpeakers: string;
    statSince: string;
    /** Bridge label above the upcoming strip (PTD / next gathering). */
    nextUpLabel: string;
    nextUpCta: string;
    yearLabel: string; // use {year} placeholder
    yearNav: string;
    calendarEyebrow: string;
    archiveEyebrow: string;
    breadcrumbHome: string;
  };

  meetupDetail: {
    talks: string;
    /** Shown above a Spanish body on an English page that has no translation yet. */
    untranslatedBody: string;
    speakers: string;
    sponsors: string;
    sponsorsSubtitle: string;
    venue: string;
    originalEvent: string;
    recording: string;
    watchRecording: string;
    photosExternal: string;
    galleryMemories: string;
    statusAnnounced: string;
    statusRsvpOpen: string;
    statusCompleted: string;
    statusCancelled: string;
    breadcrumbHome: string;
    breadcrumbMeetups: string;
  };

  speakerDetail: {
    talkHistory: string;
    talkHistorySubtitle: string;
    relatedEvents: string;
    relatedEventsSubtitle: string;
    breadcrumbHome: string;
    breadcrumbSpeakers: string;
    website: string;
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
    successNextSteps: Record<string, string>;
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
    quickLinksTitle: string;
    quickLinks: { label: string; href: string; description: string }[];
    meetInPersonTitle: string;
    meetInPersonText: string;
    prefillSubjects: {
      generalInquiry: string;
      collaboration: string;
      projectInquiry: string;
      projectCollaboration: string;
      startupCollaboration: string;
      techTalkInvitation: string;
    };
  };

  cfsForm: {
    formTitle: string;
    talkTitleLabel: string;
    talkTitlePlaceholder: string;
    formatLabel: string;
    formatOptions: { value: string; label: string }[];
    abstractLabel: string;
    abstractPlaceholder: string;
    takeawaysLabel: string;
    takeawaysPlaceholder: string;
    socialLabel: string;
    socialPlaceholder: string;
    firstTimeLabel: string;
    speakerSchoolLabel: string;
    notesLabel: string;
    notesPlaceholder: string;
    submitButton: string;
    successTitle: string;
    successMessage: string;
    defaultSubject: string;
  };

  sponsorForm: {
    formTitle: string;
    companyLabel: string;
    companyPlaceholder: string;
    roleLabel: string;
    rolePlaceholder: string;
    tierLabel: string;
    tierOptions: { value: string; label: string }[];
    contributionLabel: string;
    contributionOptions: { value: string; label: string }[];
    messageLabel: string;
    messagePlaceholder: string;
    submitButton: string;
    successTitle: string;
    successMessage: string;
    defaultSubject: string;
  };

  speakerSchoolForm: {
    formTitle: string;
    formEyebrow: string;
    formSectionTitle: string;
    experienceLabel: string;
    experienceOptions: { value: string; label: string }[];
    goalsLabel: string;
    goalsPlaceholder: string;
    topicsLabel: string;
    topicsPlaceholder: string;
    availabilityLabel: string;
    availabilityPlaceholder: string;
    priorSpeakingLabel: string;
    priorSpeakingPlaceholder: string;
    socialLabel: string;
    socialPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    submitButton: string;
    successTitle: string;
    successMessage: string;
    applyCta: string;
  };

  cfsPage: {
    title: string;
    description: string;
    intro: string;
    eyebrow: string;
    whatWeLookForTitle: string;
    whatWeLookFor: string[];
    formatsTitle: string;
    formats: { name: string; description: string }[];
    processTitle: string;
    process: string[];
    criteriaEyebrow: string;
    formatsEyebrow: string;
    processEyebrow: string;
    formEyebrow: string;
  };

  sponsorUsPage: {
    title: string;
    description: string;
    intro: string;
    formEyebrow: string;
    formSectionTitle: string;
  };

  calendarPage: {
    title: string;
    subtitle: string;
    description: string;
    heroDescription: string;
    eyebrow: string;
    hubEyebrow: string;
    filterLabel: string;
    filterAll: string;
    viewMonth: string;
    viewAgenda: string;
    legendLabel: string;
    embedTitle: string;
    embedFallback: string;
    openExternal: string;
    subscribeIcs: string;
    lumaRsvp: string;
    websiteLink: string;
    noActiveCalendars: string;
    comingSoon: string;
    inactiveNote: string;
    quickLinksEyebrow: string;
    quickLinksTitle: string;
    meetupsLink: string;
    lumaLink: string;
    contributeEyebrow: string;
    contributeTitle: string;
    contributeDescription: string;
    contributeCta: string;
    breadcrumbHome: string;
  };

  calendarForm: {
    formTitle: string;
    communityLabel: string;
    communityPlaceholder: string;
    calendarIdLabel: string;
    calendarIdPlaceholder: string;
    calendarIdHint: string;
    publicUrlLabel: string;
    publicUrlPlaceholder: string;
    websiteLabel: string;
    websitePlaceholder: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    submitButton: string;
    successTitle: string;
    successMessage: string;
  };

  conductForm: {
    formEyebrow: string;
    formSectionTitle: string;
    privacyNote: string;
    incidentLabel: string;
    incidentPlaceholder: string;
    whenLabel: string;
    whenPlaceholder: string;
    peopleLabel: string;
    peoplePlaceholder: string;
    anonymousLabel: string;
    anonymousHint: string;
    nameLabel: string;
    emailLabel: string;
    followupLabel: string;
    followupPlaceholder: string;
    submitButton: string;
    successTitle: string;
    successMessage: string;
  };

  communitiesPage: {
    title: string;
    description: string;
    eyebrow: string;
    heroLead: string;
    narrativeTitle: string;
    narrativeText: string;
    alliesTitle: string;
    allianceTitle: string;
    allianceSteps: string[];
    ctaTitle: string;
    ctaDescription: string;
    ctaPrimary: string;
    ctaSecondary: string;
    visitLabel: string;
  };

  sponsorsPage: {
    title: string;
    description: string;
    eyebrow: string;
    intro: (count: number) => string;
    currentTitle: string;
    currentIntro: string;
    pastTitle: string;
    pastIntro: string;
    sponsorUsLabel: string;
    contactLabel: string;
    emptyTitle: string;
    emptyDesc: string;
    breadcrumbHome: string;
    why: {
      title: string;
      intro: string;
      items: {
        meetups: { title: string; body: string };
        ptd: { title: string; body: string };
        talent: { title: string; body: string };
      };
    };
    /** Kept for PTD / legacy copy; community `/sponsors` page does not render these. */
    tiers: {
      diamond: string;
      gold: string;
      silver: string;
      bronze: string;
      community: string;
    };
    /** Sponsor card affordances. */
    card: {
      /** Also used as the per-year counter on the sponsor profile timeline. */
      meetupsCount: (count: number) => string;
      viewSponsoredMeetups: string;
      website: string;
    };
  };

  // Sponsor detail page (/sponsors/{slug})
  sponsorDetail: {
    breadcrumbHome: string;
    breadcrumbSponsors: string;
    metaDescription: (name: string, meetups: number) => string;
    statusActive: string;
    statusPast: string;
    sinceLabel: (year: number) => string;
    websiteLabel: string;
    allSponsorsLabel: string;
    sponsorUsLabel: string;
    stats: {
      meetups: string;
      editions: string;
      talks: string;
      speakers: string;
    };
    upcomingTitle: string;
    upcomingSubtitle: string;
    meetupsTitle: string;
    meetupsSubtitle: (name: string) => string;
    editionsTitle: string;
    editionsSubtitle: string;
    editionUpcomingLabel: string;
    editionTierLabel: (tier: string) => string;
    emptyTitle: string;
    emptyDesc: string;
    ctaTitle: string;
    ctaBody: string;
  };

  contributorsPage: {
    title: string;
    description: string;
    eyebrow: string;
    intro: (count: number) => string;
    sinceLabel: (year: number) => string;
    currentTitle: string;
    currentIntro: string;
    pastTitle: string;
    pastIntro: string;
    joinLabel: string;
    contributeLabel: string;
    emptyTitle: string;
    emptyDesc: string;
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
    eyebrow: string;
    backHome: string;
    searchBlog: string;
    meetupsCta: string;
    ptdCta: string;
  };

  // Verticals / programs pages
  verticalsPage: {
    title: string;
    description: string;
    intro: string;
    eyebrow: string;
    sectionEyebrow: string;
    sectionTitle: string;
    programLabel: string;
    learnMore: string;
    relatedMeetups: string;
    contactCta: string;
    joinCta: string;
    /** Speaker School vertical — scroll to dedicated application form */
    applyCta: string;
    emptyTitle: string;
    emptyDesc: string;
    statusActive: string;
    statusPaused: string;
    statusArchived: string;
  };

  // Pereira Tech Day edition pages
  ptdPage: {
    recordingCta: string;
    schedule: string;
    talks: string;
    speakers: string;
    gallery: string;
    galleryMemories: string;
    sponsors: string;
    sponsorsSubtitle: string;
    sponsorsFooter: string;
    communities: string;
    communitiesOrganizes: string;
    communitiesOrganizesSubtitle: string;
    communitiesOrganizesFooter: string;
    organizers: string;
    organizersSubtitle: string;
    collaborators: string;
    collaboratorsSubtitle: string;
    about: string;
    pricing: string;
    faq: string;
    faqSubtitle: string;
    joinTitle: string;
    joinSubtitle: string;
    joinCta: string;
    lightningTitle: string;
    lightningTagline: string;
    /** Agenda timeline (upcoming editions) — see `PtdScheduleSection.svelte`. */
    scheduleEyebrow: string;
    scheduleTentativeBadge: string;
    scheduleTentativeNote: string;
    scheduleToBeRevealed: string;
    scheduleViewDetail: string;
    scheduleModalClose: string;
    scheduleModalAbout: string;
    scheduleModalSession: string;
    scheduleModalProfile: string;
    scheduleAbstractPending: string;
    /** `{n}` is replaced with the session number, e.g. `Ponente 3`. */
    schedulePendingSpeaker: string;
    scheduleAnchor: string;
    scheduleAnchorCta: string;
    languageSwitcher: string;
    speakersEyebrow: string;
    speakersUpcomingSubtitle: string;
    speakersRevealSoon: string;
    lightningPendingMessage: string;
    lightningPendingCard: string;
    lightningPendingCta: string;
    /** Primary hero CTA when registration is open (e.g. Luma). */
    registerCta: string;
    /** Shown wherever an edition carries `status: postponed`. */
    postponedBadge: string;
    /** Hero pill replacing the countdown while postponed. */
    postponedHeroBadge: string;
    /** Notice byline. Contains a `{date}` placeholder. */
    postponedSince: string;
    /** CTA pointing at the postponement notice on the edition landing. */
    postponedReadCta: string;
    subscribe: {
      copy: string;
      emailLabel: string;
      emailPlaceholder: string;
      button: string;
      submitting: string;
      success: string;
      error: string;
    };
    indexFeatured: string;
    indexUpcoming: string;
    indexPast: string;
    indexIntro: string;
    indexEyebrow: string;
    indexCfsCta: string;
    indexSponsorCta: string;
    indexStatEditions: string;
    indexStatYears: string;
    indexStatSince: string;
    indexCalendarEyebrow: string;
    indexHistoryEyebrow: string;
    indexPastSubtitle: string;
    editionNavLabel: string;
    previousEditions: string;
    allEditions: string;
    indexStagePrimaryCta: string;
    indexPastRowEyebrow: string;
    indexPastRowCta: string;
    indexNoUpcomingTitle: string;
    indexNoUpcomingIntro: string;
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

  // Certificates / diplomas
  certificates: {
    pageTitle: string;
    pageDescription: string;
    diplomaTitle: string;
    preamble: string;
    attendedPrefix: string;
    sealLabel: string;
    issuedBy: string;
    verifyLabel: string;
    qrAlt: string;
    demoBanner: string;
    backToEvent: string;
    watermarkRevoked: string;
    roles: {
      attendee: string;
      speaker: string;
      volunteer: string;
    };
    actions: {
      print: string;
      downloadJson: string;
      copyLink: string;
      share: string;
      copied: string;
      shared: string;
      shareFailed: string;
    };
    verify: {
      title: string;
      description: string;
      intro: string;
      idLabel: string;
      idPlaceholder: string;
      submit: string;
      statusLabel: string;
      subject: string;
      event: string;
      certId: string;
      viewDiploma: string;
      emptyHint: string;
      cryptoLabel: string;
      cryptoSigned: string;
      cryptoDemo: string;
      cryptoUnsigned: string;
      cryptoFailed: string;
      cryptoRevokedSigned: string;
      statuses: {
        valid: string;
        revoked: string;
        replaced: string;
        expired: string;
        unknown: string;
      };
      reasons: Record<string, string>;
    };
  };

  // Errors
  searchError: string;
  loadError: string;
  retry: string;
}
