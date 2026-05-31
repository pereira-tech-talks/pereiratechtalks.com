<script lang="ts">
import { onMount } from 'svelte';
import { EVENTS, trackEvent } from '@/lib/analytics';
import {
  getLanguageConfig,
  getSupportedLanguages,
  getUrlPrefix,
  stripLangPrefix,
} from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';
import MobileMenu from './MobileMenu.svelte';

export let lang: string = 'en';
let open: boolean = false;
let workOpen = false;
let aboutOpen = false;
let languageOpen = false;

$: t = getTranslations(lang);
$: prefix = getUrlPrefix(lang);
$: currentLangConfig = getLanguageConfig(lang);
$: otherLanguages = getSupportedLanguages().filter((l) => l !== lang);

// Alternate language URLs - computed on mount from current page path
let alternateLanguageUrls: {
  lang: string;
  url: string;
  flag: string;
  nativeName: string;
}[] = [];

onMount(() => {
  const path = window.location.pathname;
  const basePath = stripLangPrefix(path);

  alternateLanguageUrls = otherLanguages.map((l) => {
    const config = getLanguageConfig(l);
    const url =
      basePath === '/'
        ? config.urlPrefix || '/'
        : `${config.urlPrefix}${basePath}`;
    return { lang: l, url, flag: config.flag, nativeName: config.nativeName };
  });
});

function toggleMenu() {
  open = !open;
  trackEvent(EVENTS.MOBILE_MENU_TOGGLE, { action: open ? 'open' : 'close' });
}

function openDropdown(which: string) {
  workOpen = which === 'work';
  aboutOpen = which === 'about';
  languageOpen = which === 'language';
}

function closeAllDropdowns() {
  workOpen = false;
  aboutOpen = false;
  languageOpen = false;
}
</script>

<svelte:window on:click={closeAllDropdowns} />

<header class="bg-main text-white sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
  <nav class="main-container flex items-center justify-between">
    <a
      href={prefix || '/'}
      class="font-extrabold text-2xl md:text-3xl tracking-tight text-blue-600 select-none"
      aria-label="Pereira Tech Talks"
    >
      <img
        class="h-7 w-auto md:h-8"
        src="/images/logo_small_version_white.svg"
        alt=""
        width={952}
        height={168}
        loading="eager"
        fetchpriority="high"
      />
    </a>
    <!-- Desktop menu -->
    <div class="hidden md:flex items-center gap-8">
      <div class="flex gap-6">
        <a href={prefix || '/'} class="nav-link" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'home' })}>{t.nav.home}</a>
        <a href="{prefix}/blog" class="nav-link" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'blog' })}>{t.nav.blog}</a>
        <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
        <div
          role="group"
          class="relative group"
          on:mouseenter={() => openDropdown('work')}
          on:mouseleave={() => workOpen = false}
          on:click|stopPropagation={() => {}}
        >
          <button
            class="nav-link flex items-center gap-1 cursor-pointer select-none"
            aria-expanded={workOpen}
            aria-haspopup="true"
            aria-controls="work-dropdown"
            type="button"
            on:click={() => workOpen ? closeAllDropdowns() : openDropdown('work')}
          >
            {t.nav.work}
            <svg
              class="w-4 h-4 transition-transform duration-200"
              style="transform: rotate({workOpen ? '180deg' : '0deg'});"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          {#if workOpen}
            <div
              class="absolute left-1/2 -translate-x-1/2 top-full w-56"
              style="height: 12px; pointer-events: auto;"
            ></div>
            <div
              id="work-dropdown"
              class="absolute left-1/2 -translate-x-1/2 top-full w-56 bg-white dark:bg-gray-800 text-black dark:text-gray-200 rounded shadow-lg z-50 overflow-hidden transition-all duration-200"
              style="pointer-events: auto; opacity: 1; transform: translateY(12px);"
            >
              <a href="{prefix}/portfolio" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'portfolio' })}>{t.nav.portfolio}</a>
              <a href="{prefix}/dailybot" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'dailybot' })}>{t.nav.dailybot}</a>
              <a href="{prefix}/tech-talks" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'tech_talks' })}>{t.nav.techTalks}</a>
              <a href="{prefix}/trading" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'trading' })}>{t.nav.trading}</a>
            </div>
          {/if}
        </div>
        <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
        <div
          role="group"
          class="relative group"
          on:mouseenter={() => openDropdown('about')}
          on:mouseleave={() => aboutOpen = false}
          on:click|stopPropagation={() => {}}
        >
          <button
            class="nav-link flex items-center gap-1 cursor-pointer select-none"
            aria-expanded={aboutOpen}
            aria-haspopup="true"
            aria-controls="about-dropdown"
            type="button"
            on:click={() => aboutOpen ? closeAllDropdowns() : openDropdown('about')}
          >
            {t.nav.about}
            <svg
              class="w-4 h-4 transition-transform duration-200"
              style="transform: rotate({aboutOpen ? '180deg' : '0deg'});"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          {#if aboutOpen}
            <div
              class="absolute left-1/2 -translate-x-1/2 top-full w-56"
              style="height: 12px; pointer-events: auto;"
            ></div>
            <div
              id="about-dropdown"
              class="absolute left-1/2 -translate-x-1/2 top-full w-56 bg-white dark:bg-gray-800 text-black dark:text-gray-200 rounded shadow-lg z-50 overflow-hidden transition-all duration-200"
              style="pointer-events: auto; opacity: 1; transform: translateY(12px);"
            >
              <a href="{prefix}/about" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'about_me' })}>{t.nav.aboutMe}</a>
              <a href="{prefix}/cv" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'cv' })}>{t.nav.cv}</a>
              <a href="{prefix}/entrepreneur" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'entrepreneur' })}>{t.nav.entrepreneur}</a>
              <a href="{prefix}/foodie" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'foodie' })}>{t.nav.foodie}</a>
              <a href="{prefix}/hobbies" class="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'hobbies' })}>{t.nav.hobbies}</a>
            </div>
          {/if}
        </div>
        <a href="{prefix}/contact" class="nav-link" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'contact' })}>{t.nav.contact}</a>
        <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
        <div
          role="group"
          class="relative group"
          on:mouseenter={() => openDropdown('language')}
          on:mouseleave={() => languageOpen = false}
          on:click|stopPropagation={() => {}}
        >
          <button
            class="nav-link flex items-center gap-1 cursor-pointer select-none"
            aria-expanded={languageOpen}
            aria-haspopup="true"
            aria-controls="language-dropdown"
            type="button"
            on:click={() => languageOpen ? closeAllDropdowns() : openDropdown('language')}
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
            </svg>
            {lang.toUpperCase()}
            <svg
              class="w-4 h-4 transition-transform duration-200"
              style="transform: rotate({languageOpen ? '180deg' : '0deg'});"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
          {#if languageOpen}
            <div
              class="absolute left-1/2 -translate-x-1/2 top-full w-20"
              style="height: 12px; pointer-events: auto;"
            ></div>
            <div
              id="language-dropdown"
              class="absolute left-1/2 -translate-x-1/2 top-full w-20 bg-white dark:bg-gray-800 text-black dark:text-gray-200 rounded shadow-lg z-50 overflow-hidden transition-all duration-200"
              style="pointer-events: auto; opacity: 1; transform: translateY(12px);"
            >
              {#each alternateLanguageUrls as alt}
                <a href={alt.url} class="block w-full text-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition" on:click={() => trackEvent(EVENTS.LANGUAGE_SWITCH, { from: lang, to: alt.lang })}>
                  {alt.lang.toUpperCase()}
                </a>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    </div>
    <!-- Mobile menu button -->
    <button
      class="block md:hidden p-2"
      aria-label="Open menu"
      on:click={toggleMenu}
      type="button"
    >
      <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>
  </nav>
  <MobileMenu {lang} {open} {toggleMenu} />
</header>
