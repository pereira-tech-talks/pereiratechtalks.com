import { type CollectionEntry, getCollection } from 'astro:content';

export type Channel = CollectionEntry<'channels'>;

const sortByOrder = (a: Channel, b: Channel): number =>
  (a.data.order ?? 0) - (b.data.order ?? 0);

export const getChannels = async (): Promise<Channel[]> => {
  const all = await getCollection('channels');
  return [...all].sort(sortByOrder);
};

export const getPrimaryChannels = async (): Promise<Channel[]> => {
  const all = await getChannels();
  return all.filter((c) => c.data.isPrimary);
};

export const getChannelsByPlatform = async (
  platform: Channel['data']['platform']
): Promise<Channel[]> => {
  const all = await getChannels();
  return all.filter((c) => c.data.platform === platform);
};
