<script>
import { onMount } from 'svelte';
import { trackSearch } from '@/lib/analytics';
import { BLOG_PAGE_SIZE } from '@/lib/constances';
import { createSearchIndex, searchPosts } from '@/lib/search';
import { getTranslations } from '@/lib/translations';
import BlogGrid from './BlogGrid.svelte';
import BlogHeader from './BlogHeader.svelte';
import BlogPagination from './BlogPagination.svelte';
import BlogSearchInput from './BlogSearchInput.svelte';
import SearchResults from './SearchResults.svelte';

export let postsResult;
export let currentTag;
export let totalPages;
export let currentPage;
export let tagsResult = [];
export let totalPostsAvailable = 0;
export let lang = 'en';
export let subtopicAccentByName = {};

// Performance: Debounce timing (reduced for snappier feel)
const DEBOUNCE_MS = 200;

// Get translations based on language
$: t = getTranslations(lang);

// Group tags by tier for BlogHeader
$: primaryTags = tagsResult
  .filter((tag) => tag.data.tier === 'primary')
  .map((tag) => tag.data.name);
$: topicTags = tagsResult
  .filter(
    (tag) => tag.data.tier === 'secondary' || tag.data.tier === 'subtopic'
  )
  .sort((a, b) => (a.data.order || 0) - (b.data.order || 0))
  .map((tag) => tag.data.name);
$: subtopicTags = tagsResult
  .filter((tag) => tag.data.tier === 'subtopic')
  .sort((a, b) => (a.data.order || 0) - (b.data.order || 0))
  .map((tag) => tag.data.name);

let searchQuery = '';
let searchResults = [];
let searchResultsWithMatches = [];
let isSearching = false;
let isLoading = false;
let isLoadingIndex = false;
let loadError = false;
let searchIndex = [];
let searchEngine = null;
let indexLoaded = false;
let searchPagination = {
  currentPage: 1,
  totalPages: 1,
  totalPosts: 0,
};

// Performance: Search result cache (bounded to prevent memory leaks)
let searchCache = new Map();
const MAX_CACHE_SIZE = 50;

function getCacheKey(query, tag) {
  return `${query || ''}-${tag || ''}`;
}

function clearCache() {
  searchCache.clear();
}

// Debounce timer
let searchTimeout;

// Load search index
async function loadSearchIndex() {
  if (isLoadingIndex || indexLoaded) return;

  isLoadingIndex = true;
  loadError = false;
  try {
    // Prefer language shards to reduce payload and parsing cost.
    let response = await fetch(`/api/posts-${lang}.json`);
    if (!response.ok) {
      // Compatibility fallback for environments that only expose /api/posts.json.
      response = await fetch('/api/posts.json');
    }

    if (response.ok) {
      const allPosts = await response.json();
      const isShardedPayload =
        allPosts.length > 0 && allPosts.every((post) => post.lang === lang);
      searchIndex = isShardedPayload
        ? allPosts
        : allPosts.filter((post) => post.lang === lang);
      searchEngine = createSearchIndex(searchIndex);
      indexLoaded = true;
      clearCache();
    } else {
      loadError = true;
    }
  } catch (error) {
    loadError = true;
  } finally {
    isLoadingIndex = false;
  }
}

// Retry loading search index
function retryLoadIndex() {
  indexLoaded = false;
  loadSearchIndex();
}

// Ensure index is loaded (lazy loading)
async function ensureIndexLoaded() {
  if (indexLoaded) return;
  await loadSearchIndex();
}

function performSearch(query, page = 1) {
  if (!query.trim()) {
    isSearching = false;
    searchResults = [];
    searchResultsWithMatches = [];
    return;
  }

  if (!searchEngine || !searchIndex || searchIndex.length === 0) {
    isLoading = false;
    return;
  }

  isLoading = true;
  isSearching = true;

  // Check cache first (for pagination)
  const cacheKey = getCacheKey(query, currentTag);
  const cached = searchCache.get(cacheKey);

  // Use cached full results if available
  let filteredResults;
  if (cached) {
    filteredResults = cached;
  } else {
    // Use Fuse.js for fuzzy search
    const fuseResults = searchPosts(searchEngine, query);

    // Filter by tag if specified (handles both primary and secondary tags)
    filteredResults = fuseResults;
    if (currentTag) {
      filteredResults = filteredResults.filter(
        (result) =>
          result.item.tags.includes(currentTag) ||
          result.item.topics?.includes(currentTag)
      );
    }

    // Cache results (with size limit)
    if (searchCache.size >= MAX_CACHE_SIZE) {
      const firstKey = searchCache.keys().next().value;
      searchCache.delete(firstKey);
    }
    searchCache.set(cacheKey, filteredResults);
  }

  // Calculate pagination
  const limit = BLOG_PAGE_SIZE;
  const totalPosts = filteredResults.length;
  const pagesCount = Math.ceil(totalPosts / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedResults = filteredResults.slice(startIndex, endIndex);

  // Extract post items and store matches for highlighting
  searchResults = paginatedResults.map((r) => r.item);
  searchResultsWithMatches = paginatedResults;

  searchPagination = {
    currentPage: page,
    totalPages: pagesCount,
    totalPosts,
    hasNextPage: page < pagesCount,
    hasPrevPage: page > 1,
  };

  isLoading = false;
  trackSearch(query, totalPosts);
}

// Sync search query to URL without polluting browser history
function syncQueryToUrl(query) {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (query) {
    url.searchParams.set('q', query);
  } else {
    url.searchParams.delete('q');
  }
  history.replaceState(null, '', url.toString());
}

function handleSearch(query) {
  searchQuery = query;
  syncQueryToUrl(query);

  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  // Show searching state immediately for better UX
  if (query.length >= 2) {
    isSearching = true;
  }

  searchTimeout = setTimeout(async () => {
    if (!indexLoaded) {
      await ensureIndexLoaded();
    }
    performSearch(query, 1);
  }, DEBOUNCE_MS);
}

// Handle search input focus - preload index
function handleSearchFocus() {
  ensureIndexLoaded();
}

// Restore search from URL and lazy load index on mount
onMount(() => {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const urlQuery = params.get('q') || '';

  if (urlQuery) {
    // Restore search from URL: load index if needed, then search
    searchQuery = urlQuery;
    isSearching = true;
    ensureIndexLoaded().then(() => performSearch(urlQuery, 1));
  } else {
    // No URL query: lazy load search index in background
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => ensureIndexLoaded());
    } else {
      setTimeout(() => ensureIndexLoaded(), 1000);
    }
  }
});
</script>

<div class="main-container py-10 sm:py-12 lg:py-16">
  <BlogHeader
    {currentTag}
    tagsResult={primaryTags}
    topicTags={topicTags}
    subtopicTags={subtopicTags}
    {subtopicAccentByName}
    totalPosts={isSearching ? searchPagination.totalPosts : (currentTag ? postsResult.length : totalPostsAvailable)}
    currentPagePosts={isSearching ? searchResults.length : postsResult.length}
    currentPage={isSearching ? searchPagination.currentPage : currentPage}
    totalPages={isSearching ? searchPagination.totalPages : totalPages}
    {lang}
  />

  <BlogSearchInput
    bind:searchQuery
    {isSearching}
    resultsCount={searchPagination.totalPosts}
    onSearch={handleSearch}
    onFocus={handleSearchFocus}
    {lang}
  />

  {#if loadError}
    <!-- Error state -->
    <div
      class="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded mb-4"
      role="alert"
    >
      <p>{t.loadError}</p>
      <button
        class="underline mt-2 hover:no-underline"
        on:click={retryLoadIndex}
      >
        {t.retry}
      </button>
    </div>
  {:else if isLoadingIndex}
    <!-- Skeleton loading state -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {#each Array(6) as _}
        <div class="animate-pulse bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
          <div class="bg-gray-200 dark:bg-gray-700 h-48"></div>
          <div class="p-6">
            <div class="bg-gray-200 dark:bg-gray-700 h-6 rounded w-3/4 mb-3"></div>
            <div class="bg-gray-200 dark:bg-gray-700 h-4 rounded w-full mb-2"></div>
            <div class="bg-gray-200 dark:bg-gray-700 h-4 rounded w-2/3"></div>
          </div>
        </div>
      {/each}
    </div>
  {:else if isLoading}
    <div class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      <p class="mt-2 text-gray-600 dark:text-gray-300">{t.searching}</p>
    </div>
  {:else if isSearching}
    <SearchResults filteredPosts={searchResults} {searchQuery} {lang} searchResultsWithMatches={searchResultsWithMatches} topicTagNames={topicTags} subtopicTagNames={subtopicTags} {subtopicAccentByName} />
    {#if searchPagination.totalPages > 1}
      <BlogPagination
        currentPage={searchPagination.currentPage}
        totalPages={searchPagination.totalPages}
        isSearchMode={true}
        onPageChange={(page) => performSearch(searchQuery, page)}
        {currentTag}
        {lang}
      />
    {/if}
  {:else}
    <BlogGrid
      posts={postsResult}
      showPagination={totalPages > 1}
      {currentPage}
      {totalPages}
      {currentTag}
      {lang}
      topicTagNames={topicTags}
      subtopicTagNames={subtopicTags}
      {subtopicAccentByName}
    />

    {#if totalPages > 1}
      <BlogPagination
        {currentPage}
        {totalPages}
        {currentTag}
        {lang}
      />
    {/if}
  {/if}
</div>
