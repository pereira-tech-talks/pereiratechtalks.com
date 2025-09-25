// Meetup functionality disabled - migrated to Luma

/**
 * Fetch events from Meetup (DEPRECATED - Migrated to Luma)
 * @param status - upcoming, past
 * @returns an array of events
 * @deprecated We have migrated from Meetup to Luma. Visit https://luma.com/pertechtalks for current events
 */
export const fetchEventsMeetup = async (status: string, _page: string = '1', _order: string = 'desc') => {
  //console.warn('⚠️  Meetup API integration is deprecated. We have migrated to Luma: https://luma.com/pertechtalks');
  
  // Return mock data to prevent breaking the application
  const mockEvents = [
    {
      id: 'luma-migration-notice',
      name: 'Migración a Luma - Pereira Tech Talks',
      link: 'https://luma.com/pertechtalks',
      venue: { name: 'Eventos ahora en Luma' },
      description: 'Hemos migrado nuestros eventos de Meetup a Luma. Visita https://luma.com/pertechtalks para ver todos nuestros próximos eventos y talleres.',
      time: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week from now
      featured_photo: null
    }
  ];

  return status === 'upcoming' ? mockEvents : [];
};

/**
 * Get the most recent event
 * @returns the most recent event
 */
export const getMostRecentEvent = async () => {
  const events = await fetchEventsMeetup('upcoming', '5', 'asc');
  const eventData = events.length ? events[0] : {};

  return eventData;
};
