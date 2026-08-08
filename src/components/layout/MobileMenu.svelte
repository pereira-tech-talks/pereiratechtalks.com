<script lang="ts">
/**
 * Full-viewport mobile navigation.
 * Portaled to document.body so `position: fixed` is NOT trapped by the
 * header's `backdrop-filter` containing block (see PLAN_responsive_mobile_menu_fullscreen).
 */
import { onDestroy, onMount, tick } from 'svelte';
import { fade } from 'svelte/transition';
import { EVENTS, trackEvent } from '@/lib/analytics';
import {
  getLanguageConfig,
  getSupportedLanguages,
  getUrlPrefix,
  stripLangPrefix,
} from '@/lib/i18n';
import { LANGUAGE_STORAGE_KEY } from '@/lib/language-preference';
import { getTranslations } from '@/lib/translations';
import ThemeToggle from './ThemeToggle.svelte';

export let lang: string = 'es';
export let open: boolean;
export let toggleMenu: () => void;

/** Move the dialog node under document.body (escapes header backdrop-filter). */
function portal(node: HTMLElement) {
  document.body.appendChild(node);
  return {
    destroy() {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    },
  };
}

let communityOpen = true;
let languageOpen = false;
let lockedScrollY = 0;
let isScrollLocked = false;
let menuRoot: HTMLElement | undefined;
let closeButtonRef: HTMLButtonElement | undefined;
let previouslyFocused: HTMLElement | null = null;

function rememberLanguage(target: string) {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, target);
  } catch {
    // Storage disabled — navigation still works.
  }
}

function getFocusableElements(): HTMLElement[] {
  if (!menuRoot) return [];
  const nodes = menuRoot.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );
  return Array.from(nodes).filter(
    (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
  );
}

function handleKeydown(event: KeyboardEvent) {
  if (!open) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    toggleMenu();
    return;
  }
  if (event.key !== 'Tab') return;
  const focusables = getFocusableElements();
  if (focusables.length === 0) return;
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const active = document.activeElement as HTMLElement | null;
  if (event.shiftKey) {
    if (active === first || !menuRoot?.contains(active)) {
      event.preventDefault();
      last.focus();
    }
  } else if (active === last) {
    event.preventDefault();
    first.focus();
  }
}

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
    previouslyFocused = document.activeElement as HTMLElement | null;
    lockBodyScroll();
    tick().then(() => closeButtonRef?.focus());
  } else {
    unlockBodyScroll();
    previouslyFocused?.focus();
    previouslyFocused = null;
    languageOpen = false;
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

function navClick(item: string) {
  trackEvent(EVENTS.NAV_CLICK, { item, source: 'mobile' });
  toggleMenu();
}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if open}
  <div
    use:portal
    bind:this={menuRoot}
    id="mobile-menu"
    role="dialog"
    aria-modal="true"
    aria-label={t.nav.menu}
    class="fixed inset-0 z-[100] flex h-[100dvh] max-h-[100dvh] flex-col bg-ptt-bg text-ptt dark:bg-ptt-bg-dark dark:text-white lg:hidden"
    style="padding-top: env(safe-area-inset-top); padding-bottom: env(safe-area-inset-bottom); padding-left: env(safe-area-inset-left); padding-right: env(safe-area-inset-right);"
  >
    <!-- Top bar: brand + close (single visible X — header burger is covered by this sheet) -->
    <div class="flex shrink-0 items-center justify-between gap-3 border-b border-ptt-border px-4 py-3 dark:border-white/10">
      <a
        href={prefix || '/'}
        class="flex min-w-0 items-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ptt-primary"
        aria-label="Pereira Tech Talks"
        on:click={() => navClick('home')}
      >
        <img
          class="h-8 w-auto dark:hidden"
          src="/images/pereira-tech-talks/topbar-logo-primary.webp"
          alt=""
          width={120}
          height={48}
        />
        <img
          class="hidden h-8 w-auto dark:block"
          src="/images/pereira-tech-talks/topbar-logo.webp"
          alt=""
          width={120}
          height={48}
        />
      </a>
      <button
        bind:this={closeButtonRef}
        class="inline-flex min-h-[44px] min-w-[44px] cursor-pointer items-center justify-center rounded-lg p-2 text-ptt hover:bg-ptt-primary-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ptt-primary dark:text-white dark:hover:bg-white/10"
        aria-label={t.nav.closeMenu}
        on:click={toggleMenu}
        type="button"
      >
        <svg class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Scrollable nav -->
    <nav
      class="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto overscroll-contain px-4 py-4"
      aria-label={t.nav.menu}
    >
      <a
        href={prefix || '/'}
        class="nav-link rounded-lg px-3 py-3 text-lg font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ptt-primary"
        on:click={() => navClick('home')}
      >{t.nav.home}</a>
      <a
        href="{prefix}/meetups"
        class="nav-link rounded-lg px-3 py-3 text-lg font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ptt-primary"
        on:click={() => navClick('meetups')}
      >{t.nav.meetups}</a>
      <a
        href="{prefix}/pereira-tech-day"
        class="nav-link rounded-lg px-3 py-3 text-lg font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ptt-primary"
        on:click={() => navClick('pereira_tech_day')}
      >{t.nav.pereiraTechDays}</a>
      <!-- Calendar nav link hidden temporarily — page still at /calendar -->
      <a
        href="{prefix}/blog"
        class="nav-link rounded-lg px-3 py-3 text-lg font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ptt-primary"
        on:click={() => navClick('blog')}
      >{t.nav.blog}</a>

      <div class="mt-2 border-t border-ptt-border pt-2 dark:border-white/10">
        <button
          class="nav-link flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-3 text-left text-lg font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ptt-primary"
          on:click={() => (communityOpen = !communityOpen)}
          aria-expanded={communityOpen}
          aria-controls="mobile-community-links"
          type="button"
        >
          <span>{t.nav.community}</span>
          <svg
            class="h-5 w-5 shrink-0 transition-transform duration-200 motion-reduce:transition-none"
            class:rotate-180={communityOpen}
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {#if communityOpen}
          <div
            id="mobile-community-links"
            class="mb-1 flex flex-col gap-0.5 border-l-2 border-ptt-primary/30 pl-3 ml-3"
            transition:fade={{ duration: 120 }}
          >
            <a href="{prefix}/about" class="nav-link rounded-lg px-3 py-2.5 text-base text-ptt-secondary dark:text-white/80" on:click={() => navClick('about')}>{t.nav.about}</a>
            <a href="{prefix}/speakers" class="nav-link rounded-lg px-3 py-2.5 text-base text-ptt-secondary dark:text-white/80" on:click={() => navClick('speakers')}>{t.nav.speakers}</a>
            <a href="{prefix}/communities" class="nav-link rounded-lg px-3 py-2.5 text-base text-ptt-secondary dark:text-white/80" on:click={() => navClick('communities')}>{t.nav.communities}</a>
            <a href="{prefix}/contributors" class="nav-link rounded-lg px-3 py-2.5 text-base text-ptt-secondary dark:text-white/80" on:click={() => navClick('contributors')}>{t.nav.contributors}</a>
            <a href="{prefix}/sponsors" class="nav-link rounded-lg px-3 py-2.5 text-base text-ptt-secondary dark:text-white/80" on:click={() => navClick('sponsors')}>{t.nav.sponsors}</a>
            <a href="{prefix}/verticals" class="nav-link rounded-lg px-3 py-2.5 text-base text-ptt-secondary dark:text-white/80" on:click={() => navClick('verticals')}>{t.nav.verticals}</a>
            <a href="{prefix}/channels" class="nav-link rounded-lg px-3 py-2.5 text-base text-ptt-secondary dark:text-white/80" on:click={() => navClick('channels')}>{t.nav.channels}</a>
            <a href="{prefix}/press" class="nav-link rounded-lg px-3 py-2.5 text-base text-ptt-secondary dark:text-white/80" on:click={() => navClick('press')}>{t.nav.press}</a>
          </div>
        {/if}
      </div>

      <a
        href="{prefix}/contact"
        class="nav-link rounded-lg px-3 py-3 text-lg font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ptt-primary"
        on:click={() => navClick('contact')}
      >{t.nav.contact}</a>
    </nav>

    <!-- Utilities footer -->
    <div class="shrink-0 space-y-3 border-t border-ptt-border px-4 py-4 dark:border-white/10">
      <div class="flex items-center justify-end">
        <ThemeToggle {lang} placement="menu" />
      </div>

      <button
        class="nav-link flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-3 text-left text-base font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ptt-primary"
        on:click={() => (languageOpen = !languageOpen)}
        aria-expanded={languageOpen}
        aria-controls="mobile-language-links"
        type="button"
      >
        <span class="inline-flex items-center gap-2">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          {lang.toUpperCase()}
        </span>
        <svg
          class="h-5 w-5 transition-transform duration-200 motion-reduce:transition-none"
          class:rotate-180={languageOpen}
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {#if languageOpen}
        <div
          id="mobile-language-links"
          class="flex flex-col gap-1 pl-3"
          transition:fade={{ duration: 120 }}
        >
          {#each alternateLanguageUrls as alt}
            <a
              href={alt.url}
              class="nav-link rounded-lg px-3 py-2.5 text-base"
              on:click={() => {
                rememberLanguage(alt.lang);
                trackEvent(EVENTS.LANGUAGE_SWITCH, { from: lang, to: alt.lang });
                toggleMenu();
              }}
            >
              {alt.nativeName}
            </a>
          {/each}
        </div>
      {/if}
    </div>
  </div>
{/if}
