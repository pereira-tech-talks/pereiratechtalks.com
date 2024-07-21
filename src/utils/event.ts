import { getCollection } from 'astro:content';

const load = async function () {
  const events = await getCollection('event');

  return events;
};

let _events;

export const fetchEvents = async () => {
  if (!_events) {
    _events = await load();
  }

  return _events;
};

export const getEventByName = async (name: string) => {
  const events = await fetchEvents();
  const eventFiltered = events.find((event) => event.slug === name);
  const eventData = eventFiltered?.data ?? {};

  return eventData;
};
