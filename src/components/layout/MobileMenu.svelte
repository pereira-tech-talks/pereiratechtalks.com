<script lang="ts">
import { onDestroy, onMount } from 'svelte';
import { fade } from 'svelte/transition';
import { EVENTS, trackEvent } from '@/lib/analytics';
import {
  getLanguageConfig,
  getSupportedLanguages,
  getUrlPrefix,
  stripLangPrefix,
} from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';

export let lang: string = 'en';
export let open: boolean;
export let toggleMenu: () => void;
let communityOpen = false;
let languageOpen = false;
let lockedScrollY = 0;
let isScrollLocked = false;

$: t = getTranslations(lang);
$: prefix = getUrlPrefix(lang);
$: otherLanguages = getSupportedLanguages().filter((l) => l !== lang);

function lockBodyScroll() {
  if (isScrollLocked) return;
  lockedScrollY = window.scrollY;
  isScrollLocked = true;
  requestAnimationFrame(() => {
    document.body.style.position = 'fixed';
    document.body.style.top = `-${lockedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  });
}

function unlockBodyScroll() {
  if (!isScrollLocked) return;
  const y = lockedScrollY;
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.width = '';
  isScrollLocked = false;
  requestAnimationFrame(() => window.scrollTo(0, y));
}

$: if (typeof document !== 'undefined') {
  if (open) {
    lockBodyScroll();
  } else {
    unlockBodyScroll();
  }
}

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

onDestroy(() => {
  if (typeof document !== 'undefined') {
    unlockBodyScroll();
  }
});
</script>

{#if open}
  <div class="fixed inset-0 z-50 bg-main/95 flex flex-col items-center justify-start pt-20 gap-4 overflow-y-auto overscroll-contain transition-all duration-300 lg:hidden">
    <button
      class="absolute top-6 right-6 p-2"
      aria-label="Close menu"
      on:click={toggleMenu}
      type="button"
    >
      <svg class="w-7 h-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>

    <a href={prefix || '/'} class="nav-link text-xl text-center" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'home', source: 'mobile' })}>{t.nav.home}</a>
    <a href="{prefix}/meetups" class="nav-link text-xl text-center" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'meetups', source: 'mobile' })}>{t.nav.meetups}</a>
    <a href="{prefix}/pereira-tech-days" class="nav-link text-xl text-center" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'pereira_tech_days', source: 'mobile' })}>{t.nav.pereiraTechDays}</a>
    <a href="{prefix}/verticals" class="nav-link text-xl text-center" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'verticals', source: 'mobile' })}>{t.nav.verticals}</a>
    <a href="{prefix}/speakers" class="nav-link text-xl text-center" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'speakers', source: 'mobile' })}>{t.nav.speakers}</a>
    <a href="{prefix}/blog" class="nav-link text-xl text-center" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'blog', source: 'mobile' })}>{t.nav.blog}</a>

    <button
      class="nav-link text-xl text-center flex items-center justify-center gap-2 focus:outline-none cursor-pointer"
      on:click={() => communityOpen = !communityOpen}
      aria-expanded={communityOpen}
      aria-controls="community-dropdown"
      type="button"
    >
      {t.nav.community}
      <svg
        class="w-5 h-5 transition-transform duration-200"
        class:rotate-180={communityOpen}
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
      </svg>
    </button>
    {#if communityOpen}
      <div
        id="community-dropdown"
        class="flex flex-col items-center gap-2 mt-1"
        transition:fade={{ duration: 150 }}
      >
        <a href="{prefix}/about" class="nav-link text-base sm:text-lg text-gray-300 text-center py-1 hover:text-ptt-accent transition" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'about', source: 'mobile' })}>{t.nav.about}</a>
        <a href="{prefix}/contributors" class="nav-link text-base sm:text-lg text-gray-300 text-center py-1 hover:text-ptt-accent transition" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'contributors', source: 'mobile' })}>{t.nav.contributors}</a>
        <a href="{prefix}/sponsors" class="nav-link text-base sm:text-lg text-gray-300 text-center py-1 hover:text-ptt-accent transition" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'sponsors', source: 'mobile' })}>{t.nav.sponsors}</a>
        <a href="{prefix}/talks" class="nav-link text-base sm:text-lg text-gray-300 text-center py-1 hover:text-ptt-accent transition" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'talks', source: 'mobile' })}>{t.nav.talks}</a>
        <a href="{prefix}/slides" class="nav-link text-base sm:text-lg text-gray-300 text-center py-1 hover:text-ptt-accent transition" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'slides', source: 'mobile' })}>{t.nav.slides}</a>
        <a href="{prefix}/channels" class="nav-link text-base sm:text-lg text-gray-300 text-center py-1 hover:text-ptt-accent transition" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'channels', source: 'mobile' })}>{t.nav.channels}</a>
        <a href="{prefix}/press" class="nav-link text-base sm:text-lg text-gray-300 text-center py-1 hover:text-ptt-accent transition" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'press', source: 'mobile' })}>{t.nav.press}</a>
      </div>
    {/if}

    <a href="{prefix}/contact" class="nav-link text-xl text-center" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'contact', source: 'mobile' })}>{t.nav.contact}</a>

    <button
      class="nav-link text-xl text-center flex items-center justify-center gap-2 focus:outline-none cursor-pointer"
      on:click={() => languageOpen = !languageOpen}
      aria-expanded={languageOpen}
      aria-controls="language-dropdown"
      type="button"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
      {lang.toUpperCase()}
      <svg
        class="w-5 h-5 transition-transform duration-200"
        class:rotate-180={languageOpen}
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
      </svg>
    </button>
    {#if languageOpen}
      <div
        id="language-dropdown"
        class="flex flex-col items-center gap-2 mt-1"
        transition:fade={{ duration: 150 }}
      >
        {#each alternateLanguageUrls as alt}
          <a href={alt.url} class="nav-link text-base sm:text-lg text-gray-300 text-center py-1 hover:text-ptt-accent transition flex items-center gap-2" on:click={() => { trackEvent(EVENTS.LANGUAGE_SWITCH, { from: lang, to: alt.lang }); toggleMenu(); }}>
            {alt.nativeName}
          </a>
        {/each}
      </div>
    {/if}
  </div>
{/if}
