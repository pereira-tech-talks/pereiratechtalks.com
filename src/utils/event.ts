/**
 * Fetch events from Meetup
 * @param status - upcoming, past
 * @returns an array of events
 */
export const fetchEventsMeetup = async (status: string, page: number = 1) => {
  const payload = {
    page: page,
    status: [status],
    group_urlname: 'pereira-tech-talks',
    'photo-host': 'secure',
    fields: 'featured_photo',
    desc: 'true',
  };

  const meetUpURL = 'https://api.meetup.com/pereira-tech-talks/events';
  const response = await fetch(`${meetUpURL}?${new URLSearchParams(payload).toString()}`);
  const data = await response.json();

  if ('errors' in data) {
    console.error(data.errors);
    return [];
  }

  return data;
};

/**
 * Get the most recent event
 * @returns the most recent event
 */
export const getMostRecentEvent = async () => {
  const events = await fetchEventsMeetup('upcoming');
  const eventData = events.length ? events[0] : {};

  return eventData;
};
