<script lang="ts">
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
import MobileMenu from './MobileMenu.svelte';
import ThemeToggle from './ThemeToggle.svelte';

export let lang: string = 'es';
let open: boolean = false;
let communityOpen = false;
let languageOpen = false;

$: t = getTranslations(lang);
$: prefix = getUrlPrefix(lang);
$: otherLanguages = getSupportedLanguages().filter((l) => l !== lang);

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

/** Soft preference only — does not force redirects (URL is source of truth). */
function rememberLanguage(target: string) {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, target);
  } catch {
    // Storage disabled (private mode) — the switch still navigates.
  }
}

function toggleMenu() {
  open = !open;
  trackEvent(EVENTS.MOBILE_MENU_TOGGLE, { action: open ? 'open' : 'close' });
}

function openDropdown(which: string) {
  communityOpen = which === 'community';
  languageOpen = which === 'language';
}

function closeAllDropdowns() {
  communityOpen = false;
  languageOpen = false;
}
</script>

<svelte:window on:click={closeAllDropdowns} />

<header
  class="border-b transition-colors duration-300 bg-ptt-bg-elevated/95 text-ptt border-ptt-border shadow-sm shadow-ptt-primary/5 backdrop-blur-md dark:bg-ptt-bg-dark/95 dark:text-white dark:border-white/10 dark:shadow-black/30"
  style="padding-top: env(safe-area-inset-top); padding-left: env(safe-area-inset-left); padding-right: env(safe-area-inset-right);"
>
  <nav class="main-container flex items-center justify-between">
    <a
      href={prefix || '/'}
      class="flex items-center select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ptt-primary"
      aria-label="Pereira Tech Talks"
    >
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
    </a>

    <div class="hidden lg:flex items-center gap-6">
      <a href="{prefix}/meetups" class="nav-link" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'meetups' })}>{t.nav.meetups}</a>
      <a href="{prefix}/pereira-tech-day" class="nav-link" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'pereira_tech_day' })}>{t.nav.pereiraTechDays}</a>
      <!-- Calendar nav link hidden temporarily — page still at /calendar -->
      <a href="{prefix}/blog" class="nav-link" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'blog' })}>{t.nav.blog}</a>

      <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_noninteractive_element_interactions -->
      <div
        role="group"
        class="relative group"
        on:mouseenter={() => openDropdown('community')}
        on:mouseleave={() => communityOpen = false}
        on:click|stopPropagation={() => {}}
      >
        <button
          class="nav-link flex items-center gap-1 cursor-pointer select-none"
          aria-expanded={communityOpen}
          aria-haspopup="true"
          aria-controls="community-dropdown"
          type="button"
          on:click={() => communityOpen ? closeAllDropdowns() : openDropdown('community')}
        >
          {t.nav.community}
          <svg
            class="w-4 h-4 transition-transform duration-200"
            style="transform: rotate({communityOpen ? '180deg' : '0deg'});"
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
            class="absolute left-1/2 -translate-x-1/2 top-full w-56"
            style="height: 12px; pointer-events: auto;"
          ></div>
          <div
            id="community-dropdown"
            class="absolute left-1/2 -translate-x-1/2 top-full w-56 bg-ptt-bg-elevated text-ptt rounded shadow-lg z-50 overflow-hidden transition-all duration-200"
            style="pointer-events: auto; opacity: 1; transform: translateY(12px);"
          >
            <a href="{prefix}/about" class="block px-4 py-2 hover:bg-ptt-primary-soft text-ptt-secondary transition" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'about' })}>{t.nav.about}</a>
            <a href="{prefix}/speakers" class="block px-4 py-2 hover:bg-ptt-primary-soft text-ptt-secondary transition" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'speakers' })}>{t.nav.speakers}</a>
            <a href="{prefix}/communities" class="block px-4 py-2 hover:bg-ptt-primary-soft text-ptt-secondary transition" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'communities' })}>{t.nav.communities}</a>
            <a href="{prefix}/contributors" class="block px-4 py-2 hover:bg-ptt-primary-soft text-ptt-secondary transition" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'contributors' })}>{t.nav.contributors}</a>
            <a href="{prefix}/sponsors" class="block px-4 py-2 hover:bg-ptt-primary-soft text-ptt-secondary transition" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'sponsors' })}>{t.nav.sponsors}</a>
            <a href="{prefix}/verticals" class="block px-4 py-2 hover:bg-ptt-primary-soft text-ptt-secondary transition" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'verticals' })}>{t.nav.verticals}</a>
            <a href="{prefix}/channels" class="block px-4 py-2 hover:bg-ptt-primary-soft text-ptt-secondary transition" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'channels' })}>{t.nav.channels}</a>
            <a href="{prefix}/press" class="block px-4 py-2 hover:bg-ptt-primary-soft text-ptt-secondary transition" on:click={() => trackEvent(EVENTS.NAV_CLICK, { item: 'press' })}>{t.nav.press}</a>
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
            aria-hidden="true"
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
            class="absolute left-1/2 -translate-x-1/2 top-full w-20 bg-ptt-bg-elevated text-ptt rounded shadow-lg z-50 overflow-hidden transition-all duration-200"
            style="pointer-events: auto; opacity: 1; transform: translateY(12px);"
          >
            {#each alternateLanguageUrls as alt}
              <a href={alt.url} class="block w-full text-center px-3 py-2 hover:bg-ptt-primary-soft text-ptt-secondary transition" on:click={() => {
                rememberLanguage(alt.lang);
                trackEvent(EVENTS.LANGUAGE_SWITCH, { from: lang, to: alt.lang });
              }}>
                {alt.lang.toUpperCase()}
              </a>
            {/each}
          </div>
        {/if}
      </div>

      <ThemeToggle {lang} placement="header" />
    </div>

    <button
      class="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center p-2 lg:hidden {open
        ? 'pointer-events-none invisible'
        : 'block'}"
      aria-label={t.nav.openMenu}
      aria-expanded={open}
      aria-controls="mobile-menu"
      on:click={toggleMenu}
      type="button"
    >
      <svg class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </nav>
  <MobileMenu {lang} {open} {toggleMenu} />
</header>
