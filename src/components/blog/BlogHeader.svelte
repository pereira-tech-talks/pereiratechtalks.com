<script>
import { EVENTS, trackEvent } from '@/lib/analytics';
import { getUrlPrefix } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';

export let currentTag;
export let tagsResult;
export let topicTags = [];
export let subtopicTags = [];
export let subtopicAccentByName = {};
export let totalPosts = 0;
export let currentPagePosts = 0;
export let currentPage = 1;
export let totalPages = 1;
export let lang = 'es';

$: t = getTranslations(lang);
$: basePrefix = getUrlPrefix(lang);

// Check if currentTag is a topic (secondary) tag
$: isTopicActive = topicTags.includes(currentTag);

// Secondary-only list (excludes subtopics for the dedicated subtopic row).
$: secondaryOnly = topicTags.filter((t) => !subtopicTags.includes(t));

// Translations for header content
$: headerTitle = currentTag
  ? t.postsTagged(t.tagNames[currentTag] || currentTag)
  : t.blogHeading;
$: headerSubtitle = currentTag
  ? t.tagDescriptions[currentTag] || t.blogDescription
  : t.blogDescription;
$: showingText = t.showingArticles(currentPagePosts, totalPosts);
$: availableText = t.articlesAvailable(totalPosts);
</script>

<h1 class="mb-2 text-3xl font-extrabold text-ptt sm:text-4xl md:text-5xl">
  {headerTitle}
</h1>
<p class="mb-5 max-w-3xl text-base text-ptt-secondary sm:text-lg">
  {headerSubtitle}
</p>

<!-- Post counter -->
<div class="mb-4 text-ptt-secondary">
  {#if totalPages > 1}
    <p class="text-sm">
      {showingText}
      <span class="text-ptt-secondary">({t.pageOf(currentPage, totalPages)})</span>
    </p>
  {:else}
    <p class="text-sm">
      {availableText}
    </p>
  {/if}
</div>

<!-- Series link — separate from tag filters (navigation, not a filter) -->
<div class="mb-4">
  <a
    href={`${basePrefix}/blog/series/`}
    class="inline-flex items-center gap-1.5 text-sm text-ptt-primary transition-colors hover:text-ptt-primary-strong"
    on:click={() => trackEvent(EVENTS.TAG_FILTER, { tag: 'series' })}
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="h-4 w-4" aria-hidden="true">
      <path d="M10.75 16.82A7.462 7.462 0 0115 15.5c.71 0 1.396.098 2.046.282A.75.75 0 0018 15.06v-11a.75.75 0 00-.546-.721A9.006 9.006 0 0015 3a8.999 8.999 0 00-4.25 1.065V16.82zM9.25 4.065A8.999 8.999 0 005 3c-.85 0-1.673.118-2.454.34A.75.75 0 002 4.06v11a.75.75 0 00.954.721A7.506 7.506 0 015 15.5c1.579 0 3.042.487 4.25 1.32V4.065z" />
    </svg>
    {t.seriesListingPage.exploreSeries}
    <span aria-hidden="true">&rarr;</span>
  </a>
</div>

<!-- Primary tag pills -->
<div class="mb-4 flex flex-wrap gap-2">
  <!-- Link to all articles -->
  <a
    href={`${basePrefix}/blog/`}
    class={`inline-flex items-center rounded px-3 py-1 text-xs font-semibold transition-colors ${
      !currentTag
        ? "bg-ptt-primary text-white shadow-sm"
        : "bg-ptt-primary-soft text-ptt-primary hover:bg-ptt-primary/15"
    }`}
  >
    {t.allPosts}
  </a>

  <!-- Primary tags -->
  {#each tagsResult as tag}
    <a
      href={`${basePrefix}/blog/tag/${tag}/`}
      class={`inline-flex items-center rounded px-3 py-1 text-xs font-semibold transition-colors ${
        currentTag === tag
          ? "bg-ptt-primary text-white shadow-sm"
          : "bg-ptt-primary-soft text-ptt-primary hover:bg-ptt-primary/15"
      }`}
      on:click={() => trackEvent(EVENTS.TAG_FILTER, { tag })}
    >
      #{t.tagNames[tag] || tag}
    </a>
  {/each}
</div>

<!-- Topic tag pills (secondary tier) -->
{#if secondaryOnly.length > 0}
  <div class="mb-3 flex flex-wrap gap-1.5">
    {#each secondaryOnly as topic}
      <a
        href={`${basePrefix}/blog/tag/${topic}/`}
        class={`rounded px-2.5 py-0.5 text-xs transition-colors ${
          currentTag === topic
            ? "border border-ptt-text bg-ptt-text text-ptt-bg"
            : "border border-ptt-border bg-ptt-bg-elevated text-ptt-secondary hover:border-ptt-border-strong hover:text-ptt"
        }`}
        on:click={() => trackEvent(EVENTS.TAG_FILTER, { tag: topic })}
      >
        {t.tagNames[topic] || topic}
      </a>
    {/each}
  </div>
{/if}

<!-- Subtopic tag pills (tier 3) — code-identifier style: monospace + faint fill + parent-domain chevron. -->
{#if subtopicTags && subtopicTags.length > 0}
  <div class="mb-10 flex flex-wrap gap-1.5">
    {#each subtopicTags as sub}
      <a
        href={`${basePrefix}/blog/tag/${sub}/`}
        class={`inline-flex items-center rounded px-2 py-0.5 text-xs transition-colors ${
          currentTag === sub
            ? "border border-ptt-text bg-ptt-text text-ptt-bg"
            : "bg-ptt-bg-elevated text-ptt-secondary border border-dashed border-ptt-border hover:bg-ptt-primary-soft hover:border-ptt-border-strong hover:text-ptt"
        }`}
        on:click={() => trackEvent(EVENTS.TAG_FILTER, { tag: sub })}
      >
        <span class={`mr-1 ${currentTag === sub ? 'opacity-70' : (subtopicAccentByName[sub] || 'text-ptt-secondary')}`} aria-hidden="true">›</span>{t.tagNames[sub] || sub}
      </a>
    {/each}
  </div>
{/if}
