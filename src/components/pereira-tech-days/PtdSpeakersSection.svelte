<script lang="ts">
/**
 * PtdSpeakersSection — upcoming-edition line-up grid.
 *
 * Fed by the agenda's session slots so the grid and the timeline can never
 * drift: a revealed speaker gets a clickable card that opens the shared
 * modal, and every unannounced slot keeps its numbered placeholder so the
 * audience can see how many talks are still coming.
 */
import PtdSocialIcon from '@/components/pereira-tech-days/PtdSocialIcon.svelte';
import PtdSpeakerModal from '@/components/pereira-tech-days/PtdSpeakerModal.svelte';
import type { PtdScheduleSlotView } from '@/lib/ptdSchedule';

interface Props {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  slots: PtdScheduleSlotView[];
  labels: {
    toBeRevealed: string;
    viewDetail: string;
    close: string;
    about: string;
    session: string;
    profile: string;
    abstractPending: string;
    revealSoon: string;
  };
}

let { title, eyebrow, subtitle, slots, labels }: Props = $props();

let selected = $state<PtdScheduleSlotView | null>(null);

const revealedCount = $derived(slots.filter((slot) => !slot.pending).length);
</script>

<section id="speakers" class="ptd-speakers" aria-labelledby="ptd-speakers-title">
  <div class="main-container">
    <header class="ptd-speakers__header">
      {#if eyebrow}
        <p class="ptd-speakers__eyebrow">{eyebrow}</p>
      {/if}
      <h2 id="ptd-speakers-title" class="ptd-speakers__title">{title}</h2>
      <span class="ptd-speakers__rule" aria-hidden="true"></span>
      {#if subtitle}
        <p class="ptd-speakers__subtitle">{subtitle}</p>
      {/if}
      {#if revealedCount < slots.length}
        <p class="ptd-speakers__note">{labels.revealSoon}</p>
      {/if}
    </header>

    <ul class="ptd-speakers__grid" role="list">
      {#each slots as slot (slot.key)}
        <li class="min-w-0">
          {#if slot.speaker}
            <article class="ptd-speaker-card">
              <img
                class="ptd-speaker-card__photo"
                src={slot.speaker.photo}
                alt={slot.speaker.photoAlt}
                width="160"
                height="160"
                loading="lazy"
                decoding="async"
              />
              <p class="ptd-speaker-card__name">{slot.speaker.name}</p>
              <p class="ptd-speaker-card__role">{slot.speaker.role}</p>
              <span class="ptd-speaker-card__divider" aria-hidden="true"></span>
              <p class="ptd-speaker-card__talk">{slot.title}</p>
              <p class="ptd-speaker-card__time">
                {slot.timeLabel}{slot.endTimeLabel ? ` – ${slot.endTimeLabel}` : ''}
              </p>

              {#if slot.speaker.social.length > 0}
                <ul class="ptd-speaker-card__social" role="list">
                  {#each slot.speaker.social as link (link.key)}
                    <li>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={link.label}
                      >
                        <PtdSocialIcon name={link.key} size={22} />
                      </a>
                    </li>
                  {/each}
                </ul>
              {/if}

              <button
                type="button"
                class="ptd-speaker-card__cta"
                onclick={() => (selected = slot)}
                aria-label={`${slot.title} — ${slot.speaker.name}. ${labels.viewDetail}`}
              >
                {labels.viewDetail}
                <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </article>
          {:else}
            <article class="ptd-speaker-card ptd-speaker-card--pending">
              <span class="ptd-speaker-card__photo ptd-speaker-card__photo--ghost" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="46" height="46" aria-hidden="true">
                  <path
                    d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 8a7 7 0 0 0-14 0"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
              </span>
              <p class="ptd-speaker-card__name">{slot.title}</p>
              <p class="ptd-speaker-card__role">{labels.toBeRevealed}</p>
              <span class="ptd-speaker-card__divider" aria-hidden="true"></span>
              <p class="ptd-speaker-card__time">
                {slot.timeLabel}{slot.endTimeLabel ? ` – ${slot.endTimeLabel}` : ''}
              </p>
            </article>
          {/if}
        </li>
      {/each}
    </ul>
  </div>
</section>

<PtdSpeakerModal
  entry={selected}
  labels={{
    close: labels.close,
    about: labels.about,
    session: labels.session,
    profile: labels.profile,
    abstractPending: labels.abstractPending,
  }}
  onclose={() => (selected = null)}
/>

<style>
  .ptd-speakers {
    padding-block: var(--ptd-section-pad, 3rem);
    background: var(--ptt-bg);
    scroll-margin-top: 4.5rem;
  }

  .ptd-speakers__header {
    margin-bottom: clamp(1.75rem, 4vw, 2.75rem);
  }

  .ptd-speakers__eyebrow {
    margin: 0;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--ptt-text-muted);
  }

  .ptd-speakers__title {
    margin: 0.25rem 0 0;
    font-size: clamp(2rem, 5.5vw, 3.15rem);
    font-weight: 400;
    line-height: 1.05;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--ptt-text);
    font-family: 'Bebas Neue', 'Arial Black', sans-serif;
  }

  .ptd-speakers__rule {
    display: block;
    width: min(100%, 14rem);
    height: 3px;
    margin-top: 0.65rem;
    border-radius: 999px;
    background: var(--ptt-accent);
  }

  .ptd-speakers__subtitle {
    margin: 1rem 0 0;
    max-width: 46rem;
    font-size: 1rem;
    line-height: 1.6;
    color: var(--ptt-text);
  }

  .ptd-speakers__note {
    margin: 0.5rem 0 0;
    max-width: 46rem;
    font-size: 0.9rem;
    font-style: italic;
    color: var(--ptt-text-muted);
  }

  .ptd-speakers__grid {
    display: grid;
    gap: 1.25rem;
    margin: 0;
    padding: 0;
    list-style: none;
    grid-template-columns: 1fr;
  }

  @media (min-width: 640px) {
    .ptd-speakers__grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  @media (min-width: 1024px) {
    .ptd-speakers__grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  .ptd-speaker-card {
    display: flex;
    height: 100%;
    flex-direction: column;
    align-items: center;
    padding: 1.75rem 1.35rem 1.5rem;
    border-radius: 1.35rem;
    text-align: center;
    background: var(--ptt-bg-elevated);
    border: 1px solid color-mix(in srgb, var(--ptt-text) 9%, transparent);
    box-shadow: 0 14px 36px color-mix(in srgb, var(--ptt-text) 7%, transparent);
  }

  .ptd-speaker-card--pending {
    background: color-mix(in srgb, var(--ptt-bg-elevated) 55%, transparent);
    border: 1px dashed color-mix(in srgb, var(--ptt-text) 26%, transparent);
    box-shadow: none;
  }

  .ptd-speaker-card__photo {
    width: 7.5rem;
    height: 7.5rem;
    border-radius: 999px;
    object-fit: cover;
    box-shadow: 0 0 0 3px var(--ptt-bg-elevated), 0 0 0 5px var(--ptt-accent);
  }

  .ptd-speaker-card__photo--ghost {
    display: grid;
    place-items: center;
    color: color-mix(in srgb, var(--ptt-text) 38%, transparent);
    background: color-mix(in srgb, var(--ptt-text) 7%, transparent);
    border: 1px dashed color-mix(in srgb, var(--ptt-text) 26%, transparent);
    box-shadow: none;
  }

  .ptd-speaker-card__name {
    margin: 1rem 0 0;
    font-size: 1.2rem;
    font-weight: 800;
    line-height: 1.25;
    color: var(--ptt-text);
  }

  .ptd-speaker-card__role {
    margin: 0.25rem 0 0;
    font-size: 0.85rem;
    line-height: 1.45;
    color: var(--ptt-text-muted);
  }

  .ptd-speaker-card__divider {
    display: block;
    width: 2.5rem;
    height: 3px;
    margin: 1rem 0;
    border-radius: 999px;
    background: var(--ptt-accent);
  }

  .ptd-speaker-card__talk {
    margin: 0;
    flex: 1;
    font-size: 1.02rem;
    font-weight: 700;
    line-height: 1.35;
    color: var(--ptt-text);
    text-wrap: balance;
  }

  /* Placeholder cards have no talk title to absorb the free space, so the
     time slot itself is what anchors to the bottom of the card. */
  .ptd-speaker-card--pending .ptd-speaker-card__time {
    margin-top: auto;
  }

  .ptd-speaker-card__time {
    margin: 0.6rem 0 0;
    font-size: 0.8rem;
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    color: var(--ptt-primary);
  }

  .ptd-speaker-card__social {
    display: flex;
    gap: 0.45rem;
    margin: 0.75rem 0 0;
    padding: 0;
    list-style: none;
  }

  .ptd-speaker-card__social a {
    display: inline-flex;
    color: var(--ptt-text-muted);
    transition: color 0.15s ease;
  }

  .ptd-speaker-card__social a:hover {
    color: var(--ptt-primary);
  }

  .ptd-speaker-card__social a:focus-visible {
    outline: 2px solid var(--ptt-primary);
    outline-offset: 2px;
    border-radius: 4px;
  }

  .ptd-speaker-card__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    margin-top: 1rem;
    padding: 0.55rem 1.1rem;
    border-radius: var(--ptd-button-radius, 9999px);
    font-size: 0.8rem;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    cursor: pointer;
    color: var(--ptt-text);
    background: transparent;
    border: 1px solid color-mix(in srgb, var(--ptt-text) 22%, transparent);
    transition:
      color 0.15s ease,
      border-color 0.15s ease,
      background 0.15s ease;
  }

  .ptd-speaker-card__cta:hover {
    color: #ffffff;
    background: var(--ptt-primary);
    border-color: var(--ptt-primary);
  }

  .ptd-speaker-card__cta:focus-visible {
    outline: 2px solid var(--ptt-primary);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .ptd-speaker-card__cta,
    .ptd-speaker-card__social a {
      transition: none;
    }
  }
</style>
