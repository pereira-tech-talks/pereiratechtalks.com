/**
 * Fetch events from Meetup
 * @param status - upcoming, past
 * @returns an array of events
 */
export const fetchEventsMeetup = async (status: string) => {
  const payload = {
    page: 1,
    status: [status],
    group_urlname: 'pereira-tech-talks',
    'photo-host': 'secure',
    fields: 'featured_photo',
    desc: 'true',
  };
  const meetUpURL = 'https://api.meetup.com/pereira-tech-talks/events';
  const response = await fetch(`${meetUpURL}?${new URLSearchParams(payload).toString()}`);
  const data = await response.json();

  return data;
};

/**
 * Get the most recent event
 * @returns the most recent event
 */
export const getMostRecentEvent = async () => {
  const events = await fetchEventsMeetup('upcoming');
  const eventData = events ? events[0] : {};

  return eventData;
};
