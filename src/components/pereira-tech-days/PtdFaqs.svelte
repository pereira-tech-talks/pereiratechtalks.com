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
  items: FaqItem[];
  sectionBg?: string;
}

let { lang, title, items, sectionBg }: Props = $props();
let openIndex = $state<number | null>(0);

function toggle(index: number) {
  openIndex = openIndex === index ? null : index;
}
</script>

<section
  class="relative py-[var(--ptd-section-pad)]"
  style={sectionBg ? `background-image: url('${sectionBg}'); background-size: cover; background-position: center;` : undefined}
  aria-labelledby="ptd-faq-title"
>
  {#if sectionBg}
    <div class="absolute inset-0 bg-[var(--ptt-bg)]/50" aria-hidden="true"></div>
  {/if}
  <div class="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
    <h2 id="ptd-faq-title" class="text-3xl font-bold tracking-tight text-[var(--ptt-text)]">
      {title}
    </h2>
    <ul class="mt-8 divide-y divide-[var(--ptt-border)] rounded-2xl bg-[var(--ptt-bg-elevated)] shadow-sm ring-1 ring-[var(--ptt-border)]">
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
  </div>
</section>
