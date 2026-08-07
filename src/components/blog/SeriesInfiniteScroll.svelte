<script lang="ts">
import { onDestroy, onMount, tick } from 'svelte';
import CopyLinkButton from '@/components/blog/CopyLinkButton.svelte';
import { EVENTS, trackEvent } from '@/lib/analytics';
import type { TimelineCardEntry } from '@/lib/blog';
import { formatCalendarDateLocale, isFutureCalendarDate } from '@/lib/dates';
import { getUrlPrefix, type Language } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';

export let initialPosts: TimelineCardEntry[] = [];
export let totalCount: number = 0;
export let apiEndpoint: string;
export let lang: Language = 'en';
export let seriesTitle: string = '';
export let seriesDescription: string = '';
export let seriesHeroImage: string | undefined = undefined;
export let pageSize: number = 30;
export let emptyStateMessage: string = '';
export let topicTagNames: string[] = [];
export let subtopicTagNames: string[] = [];
export let subtopicAccentByName: Record<string, string> = {};
export let shareUrl: string = '';

let heroDialog: HTMLDialogElement;

function openHeroLightbox(): void {
  heroDialog?.showModal();
  trackEvent(EVENTS.LIGHTBOX_OPEN);
}

function closeHeroLightbox(): void {
  heroDialog?.close();
}

function handleHeroBackdropClick(e: MouseEvent): void {
  if (e.target === e.currentTarget) closeHeroLightbox();
}

function handleHeroKeydown(e: KeyboardEvent): void {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    openHeroLightbox();
  }
}

$: encodedTitle = encodeURIComponent(seriesTitle);
$: encodedUrl = encodeURIComponent(shareUrl);
$: shareLinks = [
  {
    href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&via=pertechtalks`,
    label: t.engagement.shareOnTwitter,
    platform: 'twitter',
    icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  {
    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    label: t.engagement.shareOnLinkedIn,
    platform: 'linkedin',
    icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  {
    href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    label: t.engagement.shareOnWhatsApp,
    platform: 'whatsapp',
    icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
  },
];

$: t = getTranslations(lang);
$: prefix = getUrlPrefix(lang);

let renderedPosts: TimelineCardEntry[] = [...initialPosts];
let allPosts: TimelineCardEntry[] | null = null;
let loading = false;
let fetchError = false;
$: allLoaded = renderedPosts.length >= totalCount;

let sentinel: HTMLElement;
let observer: IntersectionObserver | null = null;

onMount(() => {
  if (allLoaded) return;
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !loading && !allLoaded) {
        loadMore();
      }
    },
    { rootMargin: '200px' }
  );
  if (sentinel) observer.observe(sentinel);
});

onDestroy(() => {
  observer?.disconnect();
});

async function loadMore() {
  if (loading || allLoaded) return;
  loading = true;
  fetchError = false;
  try {
    if (!allPosts) {
      const res = await fetch(apiEndpoint);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      allPosts = data.posts as TimelineCardEntry[];
    }
    const nextBatch = allPosts.slice(
      renderedPosts.length,
      renderedPosts.length + pageSize
    );
    renderedPosts = [...renderedPosts, ...nextBatch];
  } catch {
    fetchError = true;
  } finally {
    loading = false;
    await tick();
    reobserveSentinel();
  }
}

function reobserveSentinel(): void {
  if (!observer || !sentinel || allLoaded) return;
  observer.unobserve(sentinel);
  observer.observe(sentinel);
}

function isPostScheduled(pubDate: string): boolean {
  return isFutureCalendarDate(pubDate);
}

function formatDate(pubDate: string): string {
  return formatCalendarDateLocale(pubDate, t.dateLocale);
}
</script>

{#if renderedPosts.length === 0 && !loading}
  <div class="text-center py-16">
    <p class="text-ptt-secondary text-lg">
      {emptyStateMessage || t.seriesPage.emptyState}
    </p>
  </div>
{:else}
  <!-- Series header -->
  <div class="mb-10">
    <div class="grid grid-cols-1 items-center gap-8 {seriesHeroImage ? 'md:grid-cols-2' : ''}">
      <!-- Text column -->
      <div class="{seriesHeroImage ? '' : 'text-center mx-auto max-w-2xl'}">
        <h1 class="text-3xl md:text-4xl font-bold text-ptt mb-3">
          {seriesTitle}
        </h1>
        {#if seriesDescription}
          <p class="text-lg text-ptt-secondary mb-4">
            {seriesDescription}
          </p>
        {/if}
        <div class="flex flex-wrap items-center gap-3">
          <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ptt-primary-soft text-ptt-primary text-sm font-medium">
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {totalCount} {t.seriesPage.chapters}
          </span>
        </div>

        <!-- Share buttons -->
        {#if shareUrl}
          <div class="flex flex-wrap items-center gap-2 mt-4 border-l-2 border-ptt-border pl-3">
            <span class="text-sm font-medium text-ptt-secondary mr-0.5">
              {t.engagement.shareSeriesTitle}:
            </span>
            {#each shareLinks as link}
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 rounded-lg border border-ptt-border px-2.5 py-1.5 text-sm font-medium text-ptt-secondary transition-colors hover:bg-ptt-primary-soft hover:text-ptt"
                aria-label={link.label}
                data-umami-event="share_click"
                data-umami-event-platform={link.platform}
              >
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d={link.icon} />
                </svg>
                <span class="hidden sm:inline">{link.label}</span>
              </a>
            {/each}
            <CopyLinkButton
              url={shareUrl}
              label={t.engagement.copyLink}
              copiedLabel={t.engagement.linkCopied}
            />
          </div>
        {/if}
      </div>

      <!-- Image column -->
      {#if seriesHeroImage}
        <div class="overflow-hidden rounded-xl">
          <button
            type="button"
            class="hero-image-button"
            aria-label="{seriesTitle} — View full size"
            on:click={openHeroLightbox}
          >
            <img
              src={seriesHeroImage}
              alt={seriesTitle}
              class="block w-full h-auto md:h-96 rounded-xl object-cover shadow-lg ring-1 ring-ptt-border"
              loading="eager"
              width="600"
              height="400"
            />
          </button>
        </div>
      {/if}
    </div>
    <div class="mt-6 border-b border-ptt-border"></div>
  </div>

  <!-- Chapters list -->
  <div class="max-w-3xl mx-auto space-y-5">
    {#each renderedPosts as post, index}
      {@const chapterNum = post.seriesCurrent ?? index + 1}

      <article class="group relative flex gap-4 md:gap-6 bg-ptt-bg-elevated rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-ptt-border hover:border-ptt-primary/30 hover:-translate-y-0.5">
        <!-- Full-card clickable link (background layer) -->
        <!-- svelte-ignore a11y-click-events-have-key-events a11y-interactive-supports-focus -->
        <a
          href={`${prefix}/blog/${post.slug}/`}
          class="absolute inset-0 z-0"
          aria-label={post.title}
          on:click={() => trackEvent(EVENTS.TIMELINE_CLICK, { page: 'series', slug: post.slug })}
        ></a>

        <!-- Chapter number -->
        <div class="flex-shrink-0 w-16 md:w-20 flex flex-col items-center justify-center bg-ptt-primary-soft border-r border-ptt-border">
          <span class="text-xs font-medium text-ptt-primary uppercase tracking-wider">
            {t.seriesPage.chapter}
          </span>
          <span class="text-2xl md:text-3xl font-bold text-ptt-primary mt-0.5">
            {chapterNum}
          </span>
        </div>

        <!-- Content -->
        <div class="flex-1 py-4 pr-4 md:py-5 md:pr-6 min-w-0">
          <div class="flex items-start gap-4">
            <div class="flex-1 min-w-0">
              <h2 class="text-base md:text-lg font-bold text-ptt mb-1.5 group-hover:text-ptt-primary transition-colors">
                {post.title}
              </h2>

              <p class="text-sm text-ptt-secondary mb-3 line-clamp-2">
                {post.description}
              </p>

              <div class="relative z-10 flex flex-wrap items-center gap-2">
                <time class="text-xs text-ptt-secondary">
                  {formatDate(post.pubDate)}
                </time>

                {#if isPostScheduled(post.pubDate)}
                  <span class="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                    {t.scheduledBadge}
                  </span>
                {/if}

                {#if post.isDraft}
                  <span class="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-medium text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    {t.draftBadge}
                  </span>
                {/if}

                {#if post.tags && post.tags.length > 0}
                  {#each post.tags.filter((tag) => !topicTagNames.includes(tag)) as tag}
                    <a
                      href={`${prefix}/blog/tag/${tag}/`}
                      class="text-xs px-2 py-0.5 rounded bg-ptt-primary-soft text-ptt-primary hover:bg-ptt-primary/15 transition-colors"
                    >
                      #{t.tagNames[tag] || tag}
                    </a>
                  {/each}
                  {#each post.tags.filter((tag) => topicTagNames.includes(tag) && !subtopicTagNames.includes(tag)) as topic}
                    <a
                      href={`${prefix}/blog/tag/${topic}/`}
                      class="text-xs px-2 py-0.5 rounded border border-ptt-border bg-ptt-bg-elevated text-ptt-secondary hover:border-ptt-border-strong hover:text-ptt transition-colors"
                    >
                      {t.tagNames[topic] || topic}
                    </a>
                  {/each}
                  {#each post.tags.filter((tag) => subtopicTagNames.includes(tag)) as sub}
                    <a
                      href={`${prefix}/blog/tag/${sub}/`}
                      class="inline-flex items-center text-xs px-2 py-1 rounded bg-ptt-bg-elevated text-ptt-secondary border border-dashed border-ptt-border hover:bg-ptt-primary-soft hover:border-ptt-border-strong hover:text-ptt transition-colors"
                    >
                      <span class={`mr-1 ${subtopicAccentByName[sub] || 'text-ptt-secondary'}`} aria-hidden="true">›</span>{t.tagNames[sub] || sub}
                    </a>
                  {/each}
                {/if}
              </div>
            </div>

            <!-- Hero thumbnail (desktop only) -->
            {#if post.heroImage}
              <div class="hidden md:block flex-shrink-0">
                <img
                  src={post.heroImage}
                  alt={post.title}
                  class="w-28 h-20 object-cover rounded-lg"
                  loading="lazy"
                  width="112"
                  height="80"
                />
              </div>
            {/if}
          </div>
        </div>
      </article>
    {/each}
  </div>

  <!-- Sentinel for IntersectionObserver -->
  {#if !allLoaded}
    <div bind:this={sentinel} aria-hidden="true" class="h-1 w-full"></div>
  {/if}

  <!-- Loading spinner -->
  {#if loading}
    <div role="status" class="flex justify-center py-8">
      <span class="sr-only">
        {lang === 'es' ? 'Cargando más capítulos…' : 'Loading more chapters…'}
      </span>
      <div
        aria-hidden="true"
        class="w-8 h-8 border-4 border-ptt-primary border-t-transparent rounded-full animate-spin"
      ></div>
    </div>
  {/if}

  <!-- Error state -->
  {#if fetchError}
    <div role="alert" class="text-center py-8">
      <p class="text-ptt-secondary mb-3">
        {lang === 'es' ? 'Error al cargar más capítulos.' : 'Failed to load more chapters.'}
      </p>
      <button
        on:click={loadMore}
        class="px-4 py-2 text-sm bg-ptt-primary text-white rounded-lg hover:bg-ptt-primary-strong transition-colors"
      >
        {t.retry}
      </button>
    </div>
  {/if}

  <!-- Series complete end cap -->
  {#if allLoaded && renderedPosts.length > 0}
    <div class="flex flex-col items-center gap-4 pt-8 pb-6">
      <div class="w-12 h-12 rounded-full bg-ptt-success shadow-lg shadow-ptt-success/25 flex items-center justify-center ring-4 ring-ptt-success/15">
        <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div class="bg-ptt-bg-elevated px-8 py-4 rounded-2xl shadow-md border border-ptt-border text-center">
        <p class="text-sm font-semibold text-ptt-secondary">
          {lang === 'es' ? 'Serie completa' : 'Series complete'}
        </p>
        <p class="text-sm text-ptt-secondary mt-1">
          {totalCount} {t.seriesPage.chapters}
        </p>
      </div>
    </div>
  {/if}

  <!-- Hero image lightbox -->
  {#if seriesHeroImage}
    <dialog
      bind:this={heroDialog}
      class="hero-lightbox-dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      <!-- svelte-ignore a11y-click-events-have-key-events a11y-interactive-supports-focus -->
      <div
        class="hero-lightbox-overlay"
        role="button"
        aria-label="Close"
        on:click={handleHeroBackdropClick}
      >
        <div class="hero-lightbox-figure">
          <img
            src={seriesHeroImage}
            alt={seriesTitle}
            class="hero-lightbox-image"
            loading="eager"
            decoding="async"
            width="600"
            height="400"
          />
          <p class="hero-lightbox-caption">{seriesTitle}</p>
        </div>
      </div>
      <button
        type="button"
        class="hero-lightbox-close"
        aria-label="Close"
        on:click={closeHeroLightbox}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </dialog>
  {/if}
{/if}

<style>
	.hero-image-button {
		display: block;
		width: 100%;
		padding: 0;
		border: none;
		background: none;
		cursor: zoom-in;
	}

	.hero-lightbox-dialog {
		margin: 0;
		padding: 0;
		border: none;
		inset: 0;
		width: 100%;
		height: 100%;
		max-width: 100vw;
		max-width: 100dvw;
		max-height: 100vh;
		max-height: 100dvh;
		background: transparent;
	}

	.hero-lightbox-dialog::backdrop {
		background: rgba(0, 0, 0, 0.5);
		backdrop-filter: blur(6px);
		-webkit-backdrop-filter: blur(6px);
	}

	.hero-lightbox-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.45);
		cursor: pointer;
		padding: max(1rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right))
			max(1rem, env(safe-area-inset-bottom)) max(1rem, env(safe-area-inset-left));
		box-sizing: border-box;
	}

	.hero-lightbox-figure {
		display: flex;
		flex-direction: column;
		align-items: center;
		max-width: min(90vw, 1200px);
		max-height: min(85vh, 85dvh);
	}

	.hero-lightbox-image {
		max-width: 100%;
		max-height: min(78vh, 78dvh);
		width: auto;
		height: auto;
		object-fit: contain;
		cursor: default;
	}

	.hero-lightbox-caption {
		margin: 0.75rem 0 0;
		padding: 0 1rem;
		color: rgba(255, 255, 255, 0.9);
		font-size: 0.875rem;
		line-height: 1.4;
		text-align: center;
		max-width: 48rem;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.6);
	}

	.hero-lightbox-close {
		position: absolute;
		z-index: 2;
		top: max(1rem, env(safe-area-inset-top));
		right: max(1rem, env(safe-area-inset-right));
		width: 2.5rem;
		height: 2.5rem;
		min-width: 44px;
		min-height: 44px;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(255, 255, 255, 0.1);
		border: none;
		border-radius: 50%;
		color: white;
		cursor: pointer;
		transition: background 0.15s ease;
		touch-action: manipulation;
	}

	.hero-lightbox-close:hover {
		background: rgba(255, 255, 255, 0.2);
	}

	.hero-lightbox-close:focus-visible {
		outline: 2px solid white;
		outline-offset: 2px;
	}

	@media (max-width: 640px) {
		.hero-lightbox-overlay {
			padding: max(0.5rem, env(safe-area-inset-top)) max(0.5rem, env(safe-area-inset-right))
				max(0.5rem, env(safe-area-inset-bottom)) max(0.5rem, env(safe-area-inset-left));
		}

		.hero-lightbox-figure {
			max-width: 95vw;
			max-height: min(80vh, 80dvh);
		}

		.hero-lightbox-image {
			max-height: min(72vh, 72dvh);
		}

		.hero-lightbox-caption {
			font-size: 0.8125rem;
			margin-top: 0.5rem;
		}

		.hero-lightbox-close {
			top: max(0.5rem, env(safe-area-inset-top));
			right: max(0.5rem, env(safe-area-inset-right));
		}
	}
</style>
