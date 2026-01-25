import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

const load = async () => {
  const eventCollection = await getCollection('event');

  return eventCollection;
};

let _events: Awaited<ReturnType<typeof load>> | undefined;

export const fetchEvents = async () => {
  if (!_events) {
    _events = await load();
  }

  return _events;
};

export const getEventByName = async (name: string) => {
  const eventList = await fetchEvents();
  const eventFiltered = eventList.find((event) => event.slug === name);
  const eventData = eventFiltered?.data ?? {};

  return eventData;
};
