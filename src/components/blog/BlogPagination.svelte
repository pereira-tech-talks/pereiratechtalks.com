<script>
import { EVENTS, trackEvent } from '@/lib/analytics';
import { getUrlPrefix } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';

export let currentPage = 1;
export let totalPages = 1;
export let isSearchMode = false;
export let onPageChange = null;
export let currentTag = null;
export let lang = 'en';

$: t = getTranslations(lang);
$: basePrefix = getUrlPrefix(lang);
$: visiblePages = getVisiblePages();

function handlePageChange(page) {
  trackEvent(EVENTS.PAGINATION_CLICK, { page });
  if (isSearchMode && onPageChange) {
    onPageChange(page);
  }
}

function getPageUrl(page) {
  let url;
  if (currentTag) {
    // Tag view
    if (page === 1) {
      url = `${basePrefix}/blog/tag/${currentTag}/`;
    } else {
      url = `${basePrefix}/blog/tag/${currentTag}/page/${page}/`;
    }
  } else {
    // General blog view
    if (page === 1) {
      url = `${basePrefix}/blog/`;
    } else {
      url = `${basePrefix}/blog/page/${page}/`;
    }
  }
  return url;
}

function getVisiblePages() {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis-right', totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      'ellipsis-left',
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    'ellipsis-left',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    'ellipsis-right',
    totalPages,
  ];
}
</script>

{#if totalPages > 1}
  <div class="mt-12 flex justify-center">
    <nav class="flex items-center space-x-2" aria-label="Blog pagination">
      {#if currentPage > 1}
        {#if isSearchMode}
          <button
            on:click={() => handlePageChange(currentPage - 1)}
            aria-label={t.previous}
            class="px-3 py-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {t.previous}
          </button>
        {:else}
          <a
            href={getPageUrl(currentPage - 1)}
            on:click={() => trackEvent(EVENTS.PAGINATION_CLICK, { page: currentPage - 1 })}
            aria-label={t.previous}
            class="px-3 py-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {t.previous}
          </a>
        {/if}
      {/if}

      {#each visiblePages as page}
        {#if typeof page === 'string'}
          <span class="px-2 text-gray-600 dark:text-gray-300" aria-hidden="true">...</span>
        {:else if isSearchMode}
          <button
            on:click={() => handlePageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            class={`px-3 py-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-sm font-medium rounded-md ${
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {page}
          </button>
        {:else}
          <a
            href={getPageUrl(page)}
            on:click={() => trackEvent(EVENTS.PAGINATION_CLICK, { page })}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            class={`px-3 py-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-sm font-medium rounded-md ${
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700'
            }`}
          >
            {page}
          </a>
        {/if}
      {/each}

      {#if currentPage < totalPages}
        {#if isSearchMode}
          <button
            on:click={() => handlePageChange(currentPage + 1)}
            aria-label={t.next}
            class="px-3 py-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {t.next}
          </button>
        {:else}
          <a
            href={getPageUrl(currentPage + 1)}
            on:click={() => trackEvent(EVENTS.PAGINATION_CLICK, { page: currentPage + 1 })}
            aria-label={t.next}
            class="px-3 py-2 min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            {t.next}
          </a>
        {/if}
      {/if}
    </nav>
  </div>
{/if} 