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
  /** `marquee` reproduces the legacy infinite multi-photo strip (past editions); `carousel` is the default single-frame + thumbnails view. */
  mode?: 'carousel' | 'marquee';
}

let { lang, title, images, mode = 'carousel' }: Props = $props();

let activeIndex = $state(0);
let lightboxOpen = $state(false);
let prefersReducedMotion = $state(false);

$effect(() => {
  prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  if (mode === 'marquee' || prefersReducedMotion || images.length <= 1) return;
  const id = setInterval(() => {
    activeIndex = (activeIndex + 1) % images.length;
  }, 8000);
  return () => clearInterval(id);
});

const marqueeDurationS = $derived(Math.max(images.length * 3, 20));

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

<section class="bg-[var(--ptt-bg)] py-[var(--ptd-section-pad)]" aria-labelledby="ptd-gallery-title">
  <div class="main-container">
    <h2
      id="ptd-gallery-title"
      class="ptd-gallery-title text-center text-3xl font-bold tracking-tight text-[var(--ptt-text)] md:text-4xl"
    >
      {title}
    </h2>

    {#if mode === 'marquee'}
      {#if prefersReducedMotion}
        <ul class="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-3 lg:grid-cols-4">
          {#each images as img, i}
            <li>
              <button
                type="button"
                class="block w-full overflow-hidden rounded-lg shadow-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ptt-primary)]"
                onclick={() => openLightbox(i)}
                aria-label={altFor(img)}
              >
                <img
                  src={img.src}
                  alt={altFor(img)}
                  width="480"
                  height="320"
                  class="aspect-[3/2] w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
              </button>
            </li>
          {/each}
        </ul>
      {:else}
        <!-- Legacy-style infinite strip: large photos, no frame, side fades -->
        <div
          class="ptd-marquee group relative mt-8 overflow-hidden sm:mt-10"
          role="group"
          aria-label={title}
        >
          <div class="ptd-marquee__fade ptd-marquee__fade--left" aria-hidden="true"></div>
          <div class="ptd-marquee__fade ptd-marquee__fade--right" aria-hidden="true"></div>
          <div
            class="ptd-marquee__track flex w-max py-4 sm:py-6 lg:py-8"
            style={`--ptd-marquee-duration: ${marqueeDurationS}s`}
          >
            {#each [...images, ...images] as img, i (i)}
              {@const isDuplicate = i >= images.length}
              <button
                type="button"
                class="ptd-marquee__slide shrink-0 px-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ptt-primary)] sm:px-2.5 lg:px-3"
                onclick={() => openLightbox(i % images.length)}
                aria-label={altFor(img)}
                tabindex={isDuplicate ? -1 : 0}
                aria-hidden={isDuplicate ? 'true' : undefined}
              >
                <img
                  src={img.src}
                  alt={isDuplicate ? '' : altFor(img)}
                  width="600"
                  height="320"
                  class="h-48 w-full rounded-lg object-cover shadow-xl sm:h-56 md:h-64 lg:h-72 xl:h-80"
                  loading="lazy"
                  decoding="async"
                />
              </button>
            {/each}
          </div>
        </div>
      {/if}
    {:else}
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
    {/if}
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

<style>
  @keyframes ptd-marquee-scroll {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(-50%);
    }
  }

  .ptd-gallery-title {
    font-family: Bebas Neue, 'Arial Black', sans-serif;
    letter-spacing: 0.04em;
  }

  .ptd-marquee__track {
    animation: ptd-marquee-scroll var(--ptd-marquee-duration, 30s) linear infinite;
    will-change: transform;
  }

  .ptd-marquee:hover .ptd-marquee__track,
  .ptd-marquee:focus-within .ptd-marquee__track {
    animation-play-state: paused;
  }

  /* Legacy slide widths — large photos, not thumbnails */
  .ptd-marquee__slide {
    width: 85vw;
    max-width: 350px;
  }

  @media (min-width: 480px) {
    .ptd-marquee__slide {
      width: 70vw;
      max-width: 400px;
    }
  }

  @media (min-width: 640px) {
    .ptd-marquee__slide {
      width: 55vw;
      max-width: 450px;
    }
  }

  @media (min-width: 768px) {
    .ptd-marquee__slide {
      width: 45vw;
      max-width: 500px;
    }
  }

  @media (min-width: 1024px) {
    .ptd-marquee__slide {
      width: 33.333vw;
      max-width: 550px;
    }
  }

  @media (min-width: 1280px) {
    .ptd-marquee__slide {
      max-width: 600px;
    }
  }

  /* Soft edge fade into edition background (legacy fade-left / fade-right) */
  .ptd-marquee__fade {
    position: absolute;
    top: 0;
    bottom: 0;
    z-index: 10;
    width: 80px;
    pointer-events: none;
  }

  .ptd-marquee__fade--left {
    left: 0;
    background: linear-gradient(
      to right,
      var(--ptt-bg) 0%,
      color-mix(in srgb, var(--ptt-bg) 98%, transparent) 8%,
      color-mix(in srgb, var(--ptt-bg) 82%, transparent) 30%,
      color-mix(in srgb, var(--ptt-bg) 45%, transparent) 55%,
      color-mix(in srgb, var(--ptt-bg) 10%, transparent) 90%,
      transparent 100%
    );
  }

  .ptd-marquee__fade--right {
    right: 0;
    background: linear-gradient(
      to left,
      var(--ptt-bg) 0%,
      color-mix(in srgb, var(--ptt-bg) 98%, transparent) 8%,
      color-mix(in srgb, var(--ptt-bg) 82%, transparent) 30%,
      color-mix(in srgb, var(--ptt-bg) 45%, transparent) 55%,
      color-mix(in srgb, var(--ptt-bg) 10%, transparent) 90%,
      transparent 100%
    );
  }

  @media (min-width: 640px) {
    .ptd-marquee__fade {
      width: 150px;
    }
  }

  @media (min-width: 1024px) {
    .ptd-marquee__fade {
      width: 200px;
    }
  }

  @media (min-width: 1280px) {
    .ptd-marquee__fade {
      width: 250px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ptd-marquee__track {
      animation: none;
    }
  }
</style>
