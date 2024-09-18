import fs from 'fs';
import path from 'path';

/**
 * Fetch events from Meetup
 * @param status - upcoming, past
 * @returns an array of events
 */
export const fetchEventsMeetup = async (status: string, page: number = 1, order: string = 'desc') => {
  const payload = {
    page: page,
    status: [status],
    group_urlname: 'pereira-tech-talks',
    'photo-host': 'secure',
    fields: 'featured_photo',
    desc: order === 'desc' ? 'true' : 'false',
  };

  const meetUpURL = 'https://api.meetup.com/pereira-tech-talks/events';
  const response = await fetch(`${meetUpURL}?${new URLSearchParams(payload).toString()}`);
  const data = await response.json();

  if ('errors' in data) {
    console.error(data.errors);
    return [];
  }

  data.map((event) => {
    const name = event?.name || '';
    const url = event?.link || '';
    const venue = event?.venue?.name || '';
    const description = event?.description || '';
    const eventId = stringToSlug(`${event.id} - ${name}`);

    let eventTemplateWithId = eventTemplate;
    const publishDate = new Date(event.time).toISOString();
    const title = name;
    const image = event?.featured_photo?.highres_link;
    const imageBasePath = '~/assets/images/posts/banners';
    let imageStoragePath = '';

    if (image) {
      const imageFilename = path.basename(image);
      const downloadFolder = 'src/assets/images/posts/banners';

      // Ensure the folder exists, if not, create it
      if (!fs.existsSync(downloadFolder)) {
        fs.mkdirSync(downloadFolder);
      }

      const imagePath = path.join(downloadFolder, imageFilename);
      imageStoragePath = `${imageBasePath}/${imageFilename}`;

      if (!fs.existsSync(imagePath)) {
        downloadImage(image, imagePath);
      }
    }

    const dataMapped = {
      publishDate,
      title,
      image: imageStoragePath,
      eventId,
      name,
      venue,
      description,
      url,
    };

    Object.keys(dataMapped).forEach((key) => {
      eventTemplateWithId = eventTemplateWithId.replace(`$${key}`, dataMapped[key]);
    });

    fs.writeFileSync(`src/content/post/${eventId}.mdx`, eventTemplateWithId);
  });

  return data;
};

async function downloadImage(url, filePath) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);
    console.log(`Image downloaded and saved to ${filePath}`);
  } catch (error) {
    console.error('Error downloading image:', error.message);
  }
}

const eventTemplate = `---
publishDate: $publishDate
author: Meetup.com
title: '$title'
image: '$image'
venue: '$venue'
category: Eventos
tags:
  - Meetup.com
metadata:
  canonical: https://pereiratechtalks.com/$eventId
---

> Publicación original en [Meetup.com]($url)

$description
`;

const stringToSlug = (str) => {
  return str
    .toLowerCase() // Convert to lower case
    .trim() // Trim leading/trailing whitespace
    .replace(/[^a-z0-9 -]/g, '') // Remove invalid characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with a single hyphen
    .slice(0, 30) // Limit to 30 characters
    .replace(/-+$/, ''); // Remove trailing hyphen if any
};

/**
 * Get the most recent event
 * @returns the most recent event
 */
export const getMostRecentEvent = async () => {
  const events = await fetchEventsMeetup('upcoming', 5, 'asc');
  const eventData = events.length ? events[0] : {};

  return eventData;
};
