<script lang="ts">
/**
 * PTD edition chrome — minimal header for `/pereira-tech-days/{year}/`.
 * Matches legacy AstroWind PTD nav: brand mark + current edition + previous editions.
 */
import { onMount } from 'svelte';
import { EVENTS, trackEvent } from '@/lib/analytics';
import {
  getLanguageConfig,
  getSupportedLanguages,
  getUrlPrefix,
  stripLangPrefix,
} from '@/lib/i18n';
import { LANGUAGE_STORAGE_KEY } from '@/lib/language-preference';
import { getTranslations } from '@/lib/translations';

export interface PtdEditionNavItem {
  year: number;
  href: string;
  label: string;
}

/** In-page anchors (e.g. the agenda) rendered left of the edition links. */
export interface PtdEditionAnchor {
  href: string;
  label: string;
}

export let lang: string = 'es';
export let year: number;
export let editions: PtdEditionNavItem[] = [];
export let anchors: PtdEditionAnchor[] = [];
/** `dark` for past navy editions (2024); `light` for peach upcoming (2026). */
export let variant: 'dark' | 'light' = 'dark';

let editionsOpen = false;
let languageOpen = false;

$: otherLanguages = getSupportedLanguages().filter((l) => l !== lang);

/** Same-page alternates, resolved on the client so the switcher stays static-safe. */
let alternateLanguageUrls: { lang: string; url: string }[] = [];

onMount(() => {
  const basePath = stripLangPrefix(window.location.pathname);
  alternateLanguageUrls = otherLanguages.map((l) => {
    const config = getLanguageConfig(l);
    return {
      lang: l,
      url:
        basePath === '/'
          ? config.urlPrefix || '/'
          : `${config.urlPrefix}${basePath}`,
    };
  });
});

/** Soft preference only — the URL stays the source of truth. */
function rememberLanguage(target: string) {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, target);
  } catch {
    // Storage disabled (private mode) — the switch still navigates.
  }
}

function toggleLanguage(event: MouseEvent) {
  event.stopPropagation();
  languageOpen = !languageOpen;
}

function closeLanguage() {
  languageOpen = false;
}

$: t = getTranslations(lang);
$: prefix = getUrlPrefix(lang);
$: homeHref = prefix === '' ? '/' : `${prefix}/`;
$: currentHref =
  editions.find((e) => e.year === year)?.href ??
  `${prefix}/pereira-tech-days/${year}/`;
$: otherEditions = editions.filter((e) => e.year !== year);
$: currentLabel = `PTD ${year}`;
$: isDark = variant === 'dark';

function toggleEditions(event: MouseEvent) {
  event.stopPropagation();
  editionsOpen = !editionsOpen;
}

function closeEditions() {
  editionsOpen = false;
}
</script>

<svelte:window
  on:click={() => {
    closeEditions();
    closeLanguage();
  }}
/>

<header
  class="ptd-edition-header relative {isDark
    ? 'border-b border-white/10 bg-[#030620]/65 text-white backdrop-blur-xl supports-[backdrop-filter]:bg-[#030620]/55'
    : 'overflow-visible border-b border-transparent bg-transparent text-[#1f3f59]'}"
  style="padding-top: env(safe-area-inset-top); padding-left: env(safe-area-inset-left); padding-right: env(safe-area-inset-right);"
>
  {#if !isDark}
    <!-- Frosted wash fades out at the bottom so hero art continues under the chrome. -->
    <div class="ptd-edition-header__glass" aria-hidden="true"></div>
  {/if}
  <nav
    class="relative z-10 main-container flex items-center justify-between gap-2 md:gap-4"
    aria-label={t.ptdPage.editionNavLabel}
  >
    <a
      href={homeHref}
      class="flex min-w-0 shrink items-center select-none focus-visible:outline-2 focus-visible:outline-offset-2 {isDark
        ? 'focus-visible:outline-white'
        : 'focus-visible:outline-ptt-primary'}"
      aria-label="Pereira Tech Talks"
    >
      {#if isDark}
        <img
          class="h-8 w-auto md:h-9"
          src="/images/pereira-tech-talks/topbar-logo.webp"
          alt=""
          width={120}
          height={48}
          loading="eager"
          decoding="async"
        />
      {:else}
        <img
          class="h-8 w-auto md:h-9 dark:hidden"
          src="/images/pereira-tech-talks/topbar-logo-primary.webp"
          alt=""
          width={120}
          height={48}
          loading="eager"
          decoding="async"
        />
        <img
          class="hidden h-8 w-auto md:h-9 dark:block"
          src="/images/pereira-tech-talks/topbar-logo.webp"
          alt=""
          width={120}
          height={48}
          loading="eager"
          decoding="async"
        />
      {/if}
    </a>

    <div class="flex items-center gap-1 sm:gap-3">
      <a
        href={currentHref}
        class="hidden rounded px-2 py-1.5 text-sm font-semibold uppercase tracking-wide underline underline-offset-4 sm:inline-flex {isDark
          ? 'text-white decoration-white/80'
          : 'text-[#3ab9c9] decoration-[#3ab9c9]'}"
        aria-current="page"
      >
        {currentLabel}
      </a>

      {#each anchors as anchor (anchor.href)}
        <a
          href={anchor.href}
          aria-label={anchor.label}
          class="inline-flex shrink-0 items-center gap-1 rounded px-1.5 py-1.5 text-xs sm:px-2 font-semibold uppercase tracking-wide transition focus-visible:outline-2 focus-visible:outline-offset-2 sm:text-sm {isDark
            ? 'text-white/90 hover:text-white focus-visible:outline-white'
            : 'text-[#b66844] hover:text-[#1f3f59] focus-visible:outline-[#3a7f7c]'}"
        >
          <svg
            class="h-3.5 w-3.5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <path d="M8 2v4M16 2v4M3 10h18M5 6h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
          </svg>
          <span class="sr-only sm:not-sr-only">{anchor.label}</span>
        </a>
      {/each}

      {#if otherEditions.length > 0}
        <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
        <div
          role="group"
          class="relative"
          on:mouseenter={() => (editionsOpen = true)}
          on:mouseleave={closeEditions}
          on:click|stopPropagation={() => {}}
        >
          <button
            type="button"
            class="inline-flex max-w-[11rem] cursor-pointer items-center gap-1 truncate rounded px-2 py-1.5 text-xs font-semibold uppercase tracking-wide focus-visible:outline-2 focus-visible:outline-offset-2 sm:max-w-none sm:text-sm {isDark
              ? 'text-white/90 hover:text-white focus-visible:outline-white'
              : 'text-[#b66844] hover:text-[#1f3f59] focus-visible:outline-[#3a7f7c]'}"
            aria-expanded={editionsOpen}
            aria-haspopup="true"
            aria-controls="ptd-editions-menu"
            id="ptd-editions-trigger"
            on:click={toggleEditions}
          >
            {t.ptdPage.previousEditions}
            <svg
              class="h-4 w-4 shrink-0 transition-transform motion-reduce:transition-none"
              class:rotate-180={editionsOpen}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
          {#if editionsOpen}
            <!-- Hover bridge so the menu stays open while moving from trigger → list -->
            <div class="absolute right-0 top-full z-[60] min-w-[14rem] pt-2">
              <ul
                id="ptd-editions-menu"
                role="list"
                class="rounded-lg border py-1 shadow-xl {isDark
                  ? 'border-white/10 bg-[#1a3355]'
                  : 'border-ptt-border bg-ptt-bg-elevated'}"
                aria-labelledby="ptd-editions-trigger"
              >
                {#each otherEditions as edition}
                  <li>
                    <a
                      href={edition.href}
                      class="block px-4 py-2.5 text-sm focus-visible:outline-none {isDark
                        ? 'text-white/90 hover:bg-white/10 hover:text-white focus-visible:bg-white/10'
                        : 'text-ptt hover:bg-ptt-bg focus-visible:bg-ptt-bg'}"
                      on:click={closeEditions}
                    >
                      {edition.label}
                    </a>
                  </li>
                {/each}
              </ul>
            </div>
          {/if}
        </div>
      {/if}

      <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
      <div
        role="group"
        class="relative"
        on:mouseenter={() => (languageOpen = true)}
        on:mouseleave={closeLanguage}
        on:click|stopPropagation={() => {}}
      >
        <button
          type="button"
          class="inline-flex cursor-pointer items-center gap-1 rounded px-2 py-1.5 text-xs font-semibold uppercase tracking-wide focus-visible:outline-2 focus-visible:outline-offset-2 sm:text-sm {isDark
            ? 'text-white/90 hover:text-white focus-visible:outline-white'
            : 'text-[#b66844] hover:text-[#1f3f59] focus-visible:outline-[#3a7f7c]'}"
          aria-expanded={languageOpen}
          aria-haspopup="true"
          aria-controls="ptd-language-menu"
          id="ptd-language-trigger"
          on:click={toggleLanguage}
        >
          <span class="sr-only">{t.ptdPage.languageSwitcher}</span>
          <svg
            class="hidden h-4 w-4 shrink-0 sm:block"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          {lang.toUpperCase()}
          <svg
            class="h-4 w-4 shrink-0 transition-transform motion-reduce:transition-none"
            class:rotate-180={languageOpen}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        {#if languageOpen}
          <!-- Hover bridge so the menu stays open while moving from trigger -> list -->
          <div class="absolute right-0 top-full z-[60] min-w-[5rem] pt-2">
            <ul
              id="ptd-language-menu"
              role="list"
              class="overflow-hidden rounded-lg border py-1 shadow-xl {isDark
                ? 'border-white/10 bg-[#1a3355]'
                : 'border-ptt-border bg-ptt-bg-elevated'}"
              aria-labelledby="ptd-language-trigger"
            >
              {#each alternateLanguageUrls as alt (alt.lang)}
                <li>
                  <a
                    href={alt.url}
                    class="block px-4 py-2 text-center text-sm font-semibold focus-visible:outline-none {isDark
                      ? 'text-white/90 hover:bg-white/10 hover:text-white focus-visible:bg-white/10'
                      : 'text-ptt hover:bg-ptt-bg focus-visible:bg-ptt-bg'}"
                    on:click={() => {
                      rememberLanguage(alt.lang);
                      trackEvent(EVENTS.LANGUAGE_SWITCH, {
                        from: lang,
                        to: alt.lang,
                      });
                    }}
                  >
                    {alt.lang.toUpperCase()}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      </div>

    </div>
  </nav>
</header>

<style>
  /*
   * Light PTD glass: frosted cream wash that dissolves downward past the
   * nav so the illustration continues under the chrome without a hard cut.
   */
  .ptd-edition-header__glass {
    position: absolute;
    inset: 0 0 -2.75rem 0;
    z-index: 0;
    pointer-events: none;
    background: linear-gradient(
      to bottom,
      color-mix(in srgb, #fef7f3 55%, transparent) 0%,
      color-mix(in srgb, #fef7f3 28%, transparent) 42%,
      color-mix(in srgb, #fef7f3 10%, transparent) 68%,
      transparent 100%
    );
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    -webkit-mask-image: linear-gradient(
      to bottom,
      #000 0%,
      #000 38%,
      rgba(0, 0, 0, 0.45) 62%,
      transparent 100%
    );
    mask-image: linear-gradient(
      to bottom,
      #000 0%,
      #000 38%,
      rgba(0, 0, 0, 0.45) 62%,
      transparent 100%
    );
  }
</style>
