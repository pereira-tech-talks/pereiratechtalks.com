<script>
import { getUrlPrefix } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';
import BlogCard from './BlogCard.svelte';

export let filteredPosts = [];
export let searchQuery;
export let lang = 'en';
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
    <p class="text-gray-600 dark:text-gray-300 text-lg">
      {t.noResults(searchQuery)}
    </p>
    <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">
      {t.noResultsSuggestion}
    </p>
    <a
      href={`${basePrefix}/blog/`}
      class="mt-4 inline-flex rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
    >
      {t.allPosts}
    </a>
  </div>
{/if} 