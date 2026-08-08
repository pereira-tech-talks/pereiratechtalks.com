<script lang="ts">
import type { Language } from '@/lib/i18n';
import { tr } from '@/lib/i18n';

interface FaqItem {
  question: string | { en?: string; es?: string };
  answer: string | { en?: string; es?: string };
  linkUrl?: string;
  linkLabel?: string | { en?: string; es?: string };
}

interface Props {
  lang: Language;
  title: string;
  subtitle?: string;
  items: FaqItem[];
  sectionBg?: string;
  /** `accordion` keeps collapse UX; `open-grid` matches legacy 2026 always-open Q&A. */
  layout?: 'accordion' | 'open-grid';
}

let {
  lang,
  title,
  subtitle,
  items,
  sectionBg,
  layout = 'open-grid',
}: Props = $props();

let openIndex = $state<number | null>(0);
const isOpenGrid = $derived(layout === 'open-grid');

function toggle(index: number) {
  if (isOpenGrid) return;
  openIndex = openIndex === index ? null : index;
}
</script>

<section
  id="faqs"
  class="ptd-faq relative isolate overflow-hidden"
  class:ptd-faq--brochure={isOpenGrid && !!sectionBg}
  class:py-[var(--ptd-section-pad)]={!isOpenGrid || !sectionBg}
  style={isOpenGrid && sectionBg
    ? `--ptd-faq-bg: url('${sectionBg}'); background: var(--ptt-bg, #fef7f3);`
    : sectionBg
      ? `background-image: url('${sectionBg}'); background-size: cover; background-position: center;`
      : undefined}
  aria-labelledby="ptd-faq-title"
>
  {#if isOpenGrid && sectionBg}
    <div class="ptd-faq__bg pointer-events-none absolute inset-0 z-0" aria-hidden="true"></div>
    <div class="ptd-faq__fade pointer-events-none absolute inset-0 z-0" aria-hidden="true"></div>
  {:else if sectionBg}
    <div class="absolute inset-0 bg-[var(--ptt-bg)]/55" aria-hidden="true"></div>
  {/if}

  <div
    class="relative z-10"
    class:main-container={isOpenGrid}
    class:mx-auto={!isOpenGrid}
    class:max-w-4xl={!isOpenGrid}
    class:min-w-0={!isOpenGrid}
    class:px-4={!isOpenGrid}
    class:sm:px-6={!isOpenGrid}
    class:lg:px-8={!isOpenGrid}
  >
    <header class="ptd-faq__header" class:text-center={!isOpenGrid}>
      <h2
        id="ptd-faq-title"
        class="ptd-faq__title m-0 font-bold uppercase leading-[1.05]"
        class:text-[clamp(2rem,5.5vw,3.15rem)]={isOpenGrid}
        class:tracking-[0.01em]={isOpenGrid}
        class:text-[#3a7f7c]={isOpenGrid}
        class:text-3xl={!isOpenGrid}
        class:tracking-tight={!isOpenGrid}
        class:text-[var(--ptt-text)]={!isOpenGrid}
      >
        {title}
      </h2>
      {#if subtitle}
        <p
          class="m-0"
          class:mt-2={isOpenGrid}
          class:max-w-[44rem]={isOpenGrid}
          class:text-[clamp(0.95rem,2.2vw,1.1rem)]={isOpenGrid}
          class:leading-[1.55]={isOpenGrid}
          class:text-[color-mix(in_srgb,var(--ptt-text)_82%,transparent)]={isOpenGrid}
          class:mx-auto={!isOpenGrid}
          class:mt-3={!isOpenGrid}
          class:max-w-2xl={!isOpenGrid}
          class:text-sm={!isOpenGrid}
          class:text-[var(--ptt-text-muted)]={!isOpenGrid}
          class:md:text-base={!isOpenGrid}
        >
          {subtitle}
        </p>
      {/if}
    </header>

    {#if isOpenGrid}
      <ul class="ptd-faq__grid m-0 grid list-none grid-cols-1 gap-[clamp(0.9rem,2.8vw,1.25rem)] p-0 md:grid-cols-2">
        {#each items as item}
          <li
            class="ptd-faq__item min-w-0 break-words rounded-2xl border border-[color-mix(in_srgb,var(--ptt-text)_10%,white_90%)] bg-white/95 shadow-[0_10px_24px_rgba(31,63,89,0.08)]"
          >
            <div class="flex items-start gap-2.5 p-[clamp(1.05rem,2.4vw,1.35rem)]">
              <span
                class="mt-[0.15rem] shrink-0 text-[1.15rem] leading-none text-[var(--ptt-accent,#f06d6d)]"
                aria-hidden="true"
              >›</span>
              <div class="min-w-0">
                <h3
                  class="m-0 text-[clamp(1rem,2.1vw,1.15rem)] font-bold leading-[1.3] tracking-[0.02em] text-[#3a7f7c]"
                >
                  {tr(item.question, lang)}
                </h3>
                <div
                  class="mt-[0.55rem] text-[clamp(0.92rem,1.9vw,0.98rem)] font-normal leading-[1.55] tracking-normal text-[color-mix(in_srgb,var(--ptt-text)_86%,transparent)] normal-case"
                  style="font-family: Roboto, system-ui, sans-serif;"
                >
                  <p class="m-0">{tr(item.answer, lang)}</p>
                  {#if item.linkUrl && item.linkLabel}
                    <a
                      href={item.linkUrl}
                      class="mt-2 inline-block font-semibold text-[var(--ptt-primary,#3a7f7c)] underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ptt-primary)]"
                    >
                      {tr(item.linkLabel, lang)}
                    </a>
                  {/if}
                </div>
              </div>
            </div>
          </li>
        {/each}
      </ul>
    {:else}
      <ul
        class="mt-8 divide-y divide-[var(--ptt-border)] rounded-2xl bg-[var(--ptt-bg-elevated)] shadow-sm ring-1 ring-[var(--ptt-border)]"
      >
        {#each items as item, i}
          <li>
            <button
              type="button"
              class="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-[var(--ptt-text)] transition-colors hover:bg-[var(--ptt-bg)]/50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--ptt-primary)]"
              aria-expanded={openIndex === i}
              onclick={() => toggle(i)}
            >
              <span>{tr(item.question, lang)}</span>
              <span
                class="text-lg text-[var(--ptt-accent)] transition-transform duration-200"
                class:rotate-45={openIndex === i}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            {#if openIndex === i}
              <div class="px-5 pb-4 text-sm leading-relaxed text-[var(--ptt-text-muted)]">
                <p>{tr(item.answer, lang)}</p>
                {#if item.linkUrl && item.linkLabel}
                  <a
                    href={item.linkUrl}
                    class="mt-2 inline-block font-semibold text-[var(--ptt-primary)] underline underline-offset-2"
                  >
                    {tr(item.linkLabel, lang)}
                  </a>
                {/if}
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</section>

<style>
  .ptd-faq__title {
    font-family: Bebas Neue, 'Arial Black', sans-serif;
    letter-spacing: 0.01em;
  }

  .ptd-faq--brochure {
    min-height: calc(100vw * 576 / 1024);
    padding: clamp(2.25rem, 7vw, 4rem) 0;
  }

  .ptd-faq__header {
    margin-bottom: clamp(1.25rem, 3vw, 2rem);
  }

  .ptd-faq__bg {
    background-color: var(--ptt-bg, #fef7f3);
    background-image: var(--ptd-faq-bg);
    background-repeat: no-repeat;
    background-size: 100% auto;
    background-position: center top;
  }

  .ptd-faq__fade {
    background:
      linear-gradient(
        to bottom,
        var(--ptt-bg, #fef7f3) 0%,
        color-mix(in srgb, var(--ptt-bg, #fef7f3) 98%, transparent) 9%,
        color-mix(in srgb, var(--ptt-bg, #fef7f3) 78%, transparent) 16%,
        color-mix(in srgb, var(--ptt-bg, #fef7f3) 42%, transparent) 24%,
        transparent 35%
      ),
      linear-gradient(
        to top,
        var(--ptt-bg, #fef7f3) 0%,
        color-mix(in srgb, var(--ptt-bg, #fef7f3) 98%, transparent) 9%,
        color-mix(in srgb, var(--ptt-bg, #fef7f3) 78%, transparent) 16%,
        color-mix(in srgb, var(--ptt-bg, #fef7f3) 42%, transparent) 24%,
        transparent 35%
      );
  }
</style>
