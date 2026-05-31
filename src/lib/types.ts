import type { CollectionEntry } from 'astro:content';

export type TagTier = 'primary' | 'secondary' | 'subtopic';

export interface SeriesPost {
  post: CollectionEntry<'blog'>;
  seriesOrder: number;
}

export interface SeriesInfo {
  name: string;
  title: string;
  description?: string;
  posts: SeriesPost[];
  currentIndex: number;
  previousPost: CollectionEntry<'blog'> | null;
  nextPost: CollectionEntry<'blog'> | null;
}

export type BlogParamsType = {
  lang?: string;
  tag?: string;
  page?: number;
  pageSize?: number;
};

export type BlogPostsResultType = {
  tagsResult: CollectionEntry<'tags'>[];
  postsResult: CollectionEntry<'blog'>[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
  totalPostsAvailable: number;
};
