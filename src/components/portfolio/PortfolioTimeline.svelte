<script lang="ts">
import { EVENTS, trackEvent } from '@/lib/analytics';
import { SITE_TIMEZONE } from '@/lib/constances';
import { getUrlPrefix, type Language } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';

interface PostData {
  id: string;
  data: {
    title: string;
    description: string;
    pubDate: Date;
    updatedDate?: Date;
    heroImage?: string;
    tags?: string[];
    series?: string;
    seriesOrder?: number;
    draft?: boolean;
  };
}

interface SeriesPosition {
  current: number;
  total: number;
}

export let posts: PostData[] = [];
export let lang: Language = 'en';
export let topicTagNames: string[] = [];
export let subtopicTagNames: string[] = [];
export let subtopicAccentByName: Record<string, string> = {};

$: t = getTranslations(lang);
$: prefix = getUrlPrefix(lang);

function isPostScheduled(pubDate: Date): boolean {
  const d = typeof pubDate === 'string' ? new Date(pubDate) : pubDate;
  if (Number.isNaN(d.getTime())) return false;
  const todayInTz = new Date().toLocaleDateString('en-CA', {
    timeZone: SITE_TIMEZONE,
  });
  const pubDateStr = d.toISOString().slice(0, 10);
  return pubDateStr > todayInTz;
}

function getPostSlug(postId: string): string {
  const parts = postId.split('/');
  const filename = parts.length > 1 ? parts.slice(1).join('/') : postId;
  // Strip date prefix (YYYY-MM-DD.) if present
  return filename.replace(/^\d{4}-\d{2}-\d{2}_/, '');
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString(t.dateLocale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function formatYear(date: Date): string {
  return new Date(date).getFullYear().toString();
}

function formatYearMonth(date: Date): string {
  const d = new Date(date);
  return `${d.getFullYear()}-${d.getMonth()}`;
}

function getMonthName(date: Date): string {
  return new Date(date).toLocaleDateString(t.dateLocale, { month: 'long' });
}

function getSeriesPositionById(items: PostData[]): Map<string, SeriesPosition> {
  const seriesGroups = new Map<string, PostData[]>();

  for (const item of items) {
    if (!item.data.series) continue;
    const group = seriesGroups.get(item.data.series);
    if (group) {
      group.push(item);
    } else {
      seriesGroups.set(item.data.series, [item]);
    }
  }

  const positions = new Map<string, SeriesPosition>();
  for (const [, groupItems] of seriesGroups) {
    const ordered = [...groupItems].sort((a, b) => {
      const orderA = a.data.seriesOrder ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.data.seriesOrder ?? Number.MAX_SAFE_INTEGER;
      if (orderA !== orderB) return orderA - orderB;
      return a.data.pubDate.valueOf() - b.data.pubDate.valueOf();
    });
    const total = ordered.length;
    for (const [index, item] of ordered.entries()) {
      positions.set(item.id, { current: index + 1, total });
    }
  }

  return positions;
}

$: seriesPositionById = getSeriesPositionById(posts);
</script>

{#if posts.length === 0}
  <div class="text-center py-16">
    <p class="text-gray-600 dark:text-gray-300 text-lg">{t.portfolioPage.emptyState}</p>
  </div>
{:else}
  <div class="relative py-8">
    <!-- Center line (desktop) / Left line (mobile) -->
    <div class="absolute left-6 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>

    {#each posts as post, index}
      {@const slug = getPostSlug(post.id)}
      {@const isLeft = index % 2 === 0}
      {@const year = formatYear(post.data.pubDate)}
      {@const showYear = index === 0 || formatYear(posts[index - 1].data.pubDate) !== year}
      {@const yearMonth = formatYearMonth(post.data.pubDate)}
      {@const showMonth = index === 0 || formatYearMonth(posts[index - 1].data.pubDate) !== yearMonth}
      {@const seriesPosition = seriesPositionById.get(post.id)}
      {@const seriesTitle = (post as { seriesTitle?: string }).seriesTitle}
      {@const seriesBadgeLabel =
        seriesPosition
          ? seriesTitle
            ? `${seriesTitle} · ${t.seriesChapterOf(seriesPosition.current, seriesPosition.total)}`
            : t.seriesChapterOf(seriesPosition.current, seriesPosition.total)
          : ''}

      <!-- Year marker -->
      {#if showYear}
        <div class="relative flex items-center h-8 mb-6 mt-4">
          <div class="absolute left-10 md:left-1/2 md:-translate-x-1/2 z-10">
            <span class="inline-block px-4 py-1.5 bg-secondary text-white text-sm font-bold rounded-full shadow-md">
              {year}
            </span>
          </div>
        </div>
      {/if}

      <!-- Month marker -->
      {#if showMonth}
        <div class="relative flex items-center h-6 mb-6 mt-4">
          <div class="absolute left-10 md:left-1/2 md:-translate-x-1/2 z-10">
            <span class="inline-block px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded-full capitalize translate-y-1">
              {getMonthName(post.data.pubDate)}
            </span>
          </div>
        </div>
      {/if}

      <!-- Timeline item -->
      <div class="relative flex items-start mb-12 group">
        <!-- Date node on the line -->
        <div class="absolute left-6 md:left-1/2 -translate-x-1/2 z-10 mt-6">
          <div class="w-4 h-4 bg-secondary rounded-full border-4 border-white dark:border-gray-900 shadow-sm group-hover:scale-125 transition-transform duration-200"></div>
        </div>

        <!-- Mobile: always right of the line -->
        <!-- Desktop: alternating left/right -->
        <div class={`ml-14 md:ml-0 md:w-1/2 ${isLeft ? 'md:pr-12' : 'md:pl-12 md:ml-auto'}`}>
          <article
            class="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-secondary/30 dark:hover:border-secondary/30 hover:-translate-y-1"
          >
            {#if post.data.heroImage}
              <a href={`${prefix}/blog/${slug}/`} class="block">
                {#if post.data.heroImage.match(/\.(png|jpe?g)$/i)}
                  <picture>
                    <source srcset={post.data.heroImage.replace(/\.(png|jpe?g)$/i, '.webp')} type="image/webp" />
                    <img
                      src={post.data.heroImage}
                      alt={post.data.title}
                      class="w-full h-44 object-cover"
                      loading="lazy"
                    />
                  </picture>
                {:else}
                  <img
                    src={post.data.heroImage}
                    alt={post.data.title}
                    class="w-full h-44 object-cover"
                    loading="lazy"
                  />
                {/if}
              </a>
            {/if}
            <div class="p-5">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-secondary transition-colors">
                <a href={`${prefix}/blog/${slug}/`} class="hover:text-secondary transition-colors" on:click={() => trackEvent(EVENTS.TIMELINE_CLICK, { page: 'portfolio', slug })}>
                  {post.data.title}
                </a>
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-3">
                {post.data.description}
              </p>
              <div class="flex flex-wrap items-center gap-2">
                <time class="text-xs text-gray-600 dark:text-gray-300">
                  {formatDate(post.data.pubDate)}
                </time>
                {#if isPostScheduled(post.data.pubDate)}
                  <span class="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                    {t.scheduledBadge}
                  </span>
                {/if}
                {#if post.data.draft}
                  <span class="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    {t.draftBadge}
                  </span>
                {/if}
                {#if seriesPosition}
                  {#if post.data.series}
                    <a
                      href={`${prefix}/blog/series/${post.data.series}/`}
                      class="inline-flex items-center rounded-full border-2 border-blue-300 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 transition-colors hover:bg-blue-100 hover:border-blue-400 dark:border-blue-700 dark:bg-blue-900/40 dark:text-blue-200 dark:hover:bg-blue-900/60 dark:hover:border-blue-600"
                      title={seriesBadgeLabel}
                    >
                      {seriesPosition.current}/{seriesPosition.total}
                    </a>
                  {:else}
                    <span
                      class="inline-flex items-center rounded-full border-2 border-blue-300 bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700 dark:border-blue-700 dark:bg-blue-900/40 dark:text-blue-200"
                      title={seriesBadgeLabel}
                    >
                      {seriesPosition.current}/{seriesPosition.total}
                    </span>
                  {/if}
                {/if}
                {#if post.data.tags && post.data.tags.length > 0}
                  {#each post.data.tags.filter((tag) => !topicTagNames.includes(tag)) as tag}
                    <a
                      href={`${prefix}/blog/tag/${tag}/`}
                      class="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:hover:bg-blue-800 transition-colors"
                    >
                      #{t.tagNames[tag] || tag}
                    </a>
                  {/each}
                  {#each post.data.tags.filter((tag) => topicTagNames.includes(tag) && !subtopicTagNames.includes(tag)) as topic}
                    <a
                      href={`${prefix}/blog/tag/${topic}/`}
                      class="text-xs px-2 py-0.5 rounded border border-gray-200 bg-white text-gray-600 hover:border-gray-400 hover:text-gray-800 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-400 dark:hover:text-gray-100 transition-colors"
                    >
                      {t.tagNames[topic] || topic}
                    </a>
                  {/each}
                  {#each post.data.tags.filter((tag) => subtopicTagNames.includes(tag)) as sub}
                    <a
                      href={`${prefix}/blog/tag/${sub}/`}
                      class="inline-flex items-center text-xs px-2 py-1 rounded bg-gray-50 text-gray-700 border border-dashed border-gray-300 hover:bg-gray-100 hover:border-gray-500 hover:text-gray-900 dark:bg-gray-800/60 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-800 dark:hover:border-gray-400 dark:hover:text-gray-100 transition-colors"
                    >
                      <span class={`mr-1 ${subtopicAccentByName[sub] || 'text-gray-600 dark:text-gray-300'}`} aria-hidden="true">›</span>{t.tagNames[sub] || sub}
                    </a>
                  {/each}
                {/if}
              </div>
            </div>
          </article>
        </div>
      </div>
    {/each}
  </div>
{/if}

