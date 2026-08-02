<script lang="ts">
import type { Language } from '@/lib/i18n';
import { tr } from '@/lib/i18n';

interface GalleryImage {
  src: string;
  alt?: string | { en?: string; es?: string };
  caption?: string | { en?: string; es?: string };
}

interface Props {
  lang: Language;
  title: string;
  images: GalleryImage[];
}

let { lang, title, images }: Props = $props();

let activeIndex = $state(0);
let lightboxOpen = $state(false);
let prefersReducedMotion = $state(false);

$effect(() => {
  prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  if (prefersReducedMotion || images.length <= 1) return;
  const id = setInterval(() => {
    activeIndex = (activeIndex + 1) % images.length;
  }, 8000);
  return () => clearInterval(id);
});

function openLightbox(index: number) {
  activeIndex = index;
  lightboxOpen = true;
}

function closeLightbox() {
  lightboxOpen = false;
}

function altFor(img: GalleryImage): string {
  return tr(img.alt, lang) || title;
}
</script>

<section class="py-[var(--ptd-section-pad)]" aria-labelledby="ptd-gallery-title">
  <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
    <h2 id="ptd-gallery-title" class="text-3xl font-bold tracking-tight text-[var(--ptt-text)]">
      {title}
    </h2>
    <div class="mt-8 overflow-hidden rounded-2xl ring-1 ring-[var(--ptt-border)]">
      <button
        type="button"
        class="block w-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ptt-primary)]"
        onclick={() => openLightbox(activeIndex)}
        aria-label={lang === 'es' ? 'Abrir imagen ampliada' : 'Open enlarged image'}
      >
        <img
          src={images[activeIndex]?.src}
          alt={altFor(images[activeIndex])}
          width="1280"
          height="720"
          class="aspect-video w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </button>
      <div class="flex gap-2 overflow-x-auto p-3 bg-[var(--ptt-bg-elevated)]">
        {#each images as img, i}
          <button
            type="button"
            class="shrink-0 overflow-hidden rounded-lg ring-2 transition {i === activeIndex ? 'ring-[var(--ptt-primary)]' : 'ring-transparent opacity-70 hover:opacity-100'}"
            onclick={() => { activeIndex = i; }}
            aria-label={altFor(img)}
            aria-current={i === activeIndex ? 'true' : undefined}
          >
            <img
              src={img.src}
              alt=""
              width="96"
              height="64"
              class="h-16 w-24 object-cover"
              loading="lazy"
              decoding="async"
            />
          </button>
        {/each}
      </div>
    </div>
  </div>
</section>

{#if lightboxOpen}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
    role="dialog"
    aria-modal="true"
    aria-label={lang === 'es' ? 'Galería ampliada' : 'Expanded gallery'}
    onclick={(e) => { if (e.target === e.currentTarget) closeLightbox(); }}
  >
    <button
      type="button"
      class="absolute right-4 top-4 rounded-full bg-white/10 px-3 py-2 text-white hover:bg-white/20"
      onclick={closeLightbox}
      aria-label={lang === 'es' ? 'Cerrar' : 'Close'}
    >
      ✕
    </button>
    <img
      src={images[activeIndex]?.src}
      alt={altFor(images[activeIndex])}
      width="1280"
      height="720"
      class="max-h-[90vh] max-w-full object-contain"
    />
  </div>
{/if}
