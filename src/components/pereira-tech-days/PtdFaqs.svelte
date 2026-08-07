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
  class="relative py-[var(--ptd-section-pad)]"
  style={sectionBg
    ? `background-image: url('${sectionBg}'); background-size: cover; background-position: center;`
    : undefined}
  aria-labelledby="ptd-faq-title"
>
  {#if sectionBg}
    <div class="absolute inset-0 bg-[var(--ptt-bg)]/55" aria-hidden="true"></div>
  {/if}
  <div class="relative mx-auto max-w-4xl min-w-0 px-4 sm:px-6 lg:px-8">
    <header class="text-center">
      <h2 id="ptd-faq-title" class="text-3xl font-bold tracking-tight text-[var(--ptt-text)]">
        {title}
      </h2>
      {#if subtitle}
        <p class="mx-auto mt-3 max-w-2xl text-sm text-[var(--ptt-text-muted)] md:text-base">
          {subtitle}
        </p>
      {/if}
    </header>

    {#if isOpenGrid}
      <ul class="mt-10 grid gap-4 sm:grid-cols-2">
        {#each items as item}
          <li
            class="min-w-0 break-words rounded-2xl bg-[var(--ptt-bg-elevated)] p-5 text-left shadow-sm ring-1 ring-[var(--ptt-border)]"
          >
            <h3 class="flex min-w-0 items-start gap-2 text-base font-semibold text-[var(--ptt-text)]">
              <span class="mt-1 shrink-0 text-[var(--ptt-accent)]" aria-hidden="true">›</span>
              <span class="min-w-0">{tr(item.question, lang)}</span>
            </h3>
            <div class="mt-3 min-w-0 pl-4 text-sm leading-relaxed break-words text-[var(--ptt-text-muted)]">
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
