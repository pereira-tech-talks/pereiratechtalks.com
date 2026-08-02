<script>
import { getUrlPrefix } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';
import BlogCard from './BlogCard.svelte';

export let filteredPosts = [];
export let searchQuery;
export let lang = 'es';
export let searchResultsWithMatches = [];
export let topicTagNames = [];
export let subtopicTagNames = [];
export let subtopicAccentByName = {};

$: t = getTranslations(lang);
$: basePrefix = getUrlPrefix(lang);
</script>

{#if filteredPosts && filteredPosts.length > 0}
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    {#each filteredPosts as post, index (post.id || post.slug || post.title)}
      <BlogCard {post} {lang} {searchQuery} searchResult={searchResultsWithMatches[index]} {topicTagNames} {subtopicTagNames} {subtopicAccentByName} />
    {/each}
  </div>
{:else}
  <div class="text-center py-12">
    <p class="text-ptt-secondary text-lg">
      {t.noResults(searchQuery)}
    </p>
    <p class="mt-2 text-sm text-ptt-secondary">
      {t.noResultsSuggestion}
    </p>
    <a
      href={`${basePrefix}/blog/`}
      class="mt-4 inline-flex rounded-full bg-ptt-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-ptt-primary-strong"
    >
      {t.allPosts}
    </a>
  </div>
{/if} 