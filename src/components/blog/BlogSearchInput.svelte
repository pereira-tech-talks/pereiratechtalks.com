<script>
import { getTranslations } from '@/lib/translations';

export let searchQuery;
export let isSearching;
export let resultsCount;
export let lang = 'es';
/** @type {(value: string) => void} */
export let onSearch;
/** @type {() => void} */
export let onFocus;

$: t = getTranslations(lang);

function handleInput(e) {
  const value = e.target.value;
  searchQuery = value;
  onSearch?.(value);
}

function handleFocus() {
  onFocus?.();
}

function handleKeyDown(e) {
  // Escape clears search
  if (e.key === 'Escape') {
    searchQuery = '';
    onSearch?.('');
  }
}
</script>

<div class="mb-10">
  <div class="flex w-full max-w-2xl items-center gap-2">
    <input
      bind:value={searchQuery}
      type="search"
      placeholder={t.searchPlaceholder}
      aria-label={t.searchPlaceholder}
      aria-describedby={isSearching ? 'search-results-count' : undefined}
      class="w-full rounded-lg border border-ptt-border bg-ptt-bg-elevated px-4 py-2.5 text-ptt transition focus:outline-none focus:ring-2 focus:ring-ptt-primary"
      on:input={handleInput}
      on:focus={handleFocus}
      on:keydown={handleKeyDown}
    />
    {#if searchQuery}
      <button
        type="button"
        class="rounded-lg border border-ptt-border px-3 py-2.5 text-sm text-ptt-secondary transition-colors hover:bg-ptt-primary-soft"
        on:click={() => {
          searchQuery = '';
          onSearch?.('');
        }}
      >
        {t.clearSearch}
      </button>
    {/if}
  </div>
  <p class="mt-2 text-xs text-ptt-secondary">{t.searchHint}</p>
  
  {#if isSearching}
    <div id="search-results-count" class="mt-2 text-sm text-ptt-secondary" aria-live="polite">
      {t.resultsFound(resultsCount)}
    </div>
  {/if}
</div> 