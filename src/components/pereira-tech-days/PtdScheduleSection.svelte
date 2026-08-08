<script lang="ts">
/**
 * PtdScheduleSection — the Pereira Tech Day agenda as a vertical timeline.
 *
 * Session rows (talk / keynote / panel) are buttons that open the shared
 * speaker modal; logistics rows (breaks, registration, closing…) are static.
 * Sessions whose speaker has not been announced render as numbered
 * "to be revealed" placeholders so the whole day is visible from day one.
 */
import PtdScheduleIcon from '@/components/pereira-tech-days/PtdScheduleIcon.svelte';
import PtdSpeakerModal from '@/components/pereira-tech-days/PtdSpeakerModal.svelte';
import type { PtdScheduleSlotView } from '@/lib/ptdSchedule';

interface Props {
  title: string;
  eyebrow: string;
  slots: PtdScheduleSlotView[];
  tentative?: boolean;
  labels: {
    tentative: string;
    tentativeNote: string;
    toBeRevealed: string;
    viewDetail: string;
    close: string;
    about: string;
    session: string;
    profile: string;
    abstractPending: string;
  };
}

let { title, eyebrow, slots, tentative = false, labels }: Props = $props();

let selected = $state<PtdScheduleSlotView | null>(null);

const openSlot = (slot: PtdScheduleSlotView) => {
  selected = slot;
};

const closeModal = () => {
  selected = null;
};
</script>

<section id="schedule" class="ptd-schedule" aria-labelledby="ptd-schedule-title">
  <div class="main-container">
    <header class="ptd-schedule__header">
      <p class="ptd-schedule__eyebrow">{eyebrow}</p>
      <h2 id="ptd-schedule-title" class="ptd-schedule__title">{title}</h2>
      <span class="ptd-schedule__rule" aria-hidden="true"></span>
      {#if tentative}
        <p class="ptd-schedule__notice">
          <span class="ptd-schedule__pill">{labels.tentative}</span>
          <span>{labels.tentativeNote}</span>
        </p>
      {/if}
    </header>

    <ol class="ptd-agenda" role="list">
      {#each slots as slot (slot.key)}
        <li
          class="ptd-agenda__row"
          class:ptd-agenda__row--session={slot.session}
          class:ptd-agenda__row--pending={slot.pending}
        >
          <div class="ptd-agenda__time">
            <span class="ptd-agenda__start">{slot.timeLabel}</span>
            {#if slot.endTimeLabel}
              <span class="ptd-agenda__end">{slot.endTimeLabel}</span>
            {/if}
          </div>

          <div class="ptd-agenda__rail" aria-hidden="true">
            <span class="ptd-agenda__dot">
              {#if slot.session && !slot.pending}
                <PtdScheduleIcon name={slot.icon} size={13} />
              {/if}
            </span>
          </div>

          {#if slot.session && slot.speaker}
            <button
              type="button"
              class="ptd-agenda__card ptd-agenda__card--speaker"
              onclick={() => openSlot(slot)}
            >
              <img
                class="ptd-agenda__photo"
                src={slot.speaker.photo}
                alt={slot.speaker.photoAlt}
                width="88"
                height="88"
                loading="lazy"
                decoding="async"
              />
              <span class="ptd-agenda__body">
                <span class="ptd-agenda__badges">
                  <span class="ptd-agenda__badge">{slot.typeLabel}</span>
                  {#if slot.durationLabel}
                    <span class="ptd-agenda__duration">{slot.durationLabel}</span>
                  {/if}
                </span>
                <span class="ptd-agenda__headline">{slot.title}</span>
                <span class="ptd-agenda__speaker">{slot.speaker.name}</span>
                <span class="ptd-agenda__role">{slot.speaker.role}</span>
                <span class="ptd-agenda__more">
                  {labels.viewDetail}
                  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </span>
              </span>
            </button>
          {:else if slot.pending}
            <div class="ptd-agenda__card ptd-agenda__card--pending">
              <span class="ptd-agenda__photo ptd-agenda__photo--ghost" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true">
                  <path
                    d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm7 8a7 7 0 0 0-14 0"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.6"
                    stroke-linecap="round"
                  />
                </svg>
              </span>
              <span class="ptd-agenda__body">
                <span class="ptd-agenda__badges">
                  <span class="ptd-agenda__badge ptd-agenda__badge--ghost">{slot.typeLabel}</span>
                  {#if slot.durationLabel}
                    <span class="ptd-agenda__duration">{slot.durationLabel}</span>
                  {/if}
                </span>
                <span class="ptd-agenda__headline">{slot.title}</span>
                <span class="ptd-agenda__reveal">{labels.toBeRevealed}</span>
              </span>
            </div>
          {:else}
            <div class="ptd-agenda__card ptd-agenda__card--logistics">
              <span class="ptd-agenda__icon" aria-hidden="true">
                <PtdScheduleIcon name={slot.icon} />
              </span>
              <span class="ptd-agenda__body">
                <span class="ptd-agenda__logistics-title">{slot.title || slot.typeLabel}</span>
                {#if slot.description}
                  <span class="ptd-agenda__role">{slot.description}</span>
                {/if}
              </span>
              {#if slot.durationLabel}
                <span class="ptd-agenda__duration ptd-agenda__duration--end">
                  {slot.durationLabel}
                </span>
              {/if}
            </div>
          {/if}
        </li>
      {/each}
    </ol>
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
  onclose={closeModal}
/>

<style>
  .ptd-schedule {
    --ptd-agenda-gap: 0.85rem;
    --ptd-agenda-rail: 1.75rem;
    position: relative;
    padding-block: var(--ptd-section-pad, 3rem);
    background: var(--ptt-bg);
    scroll-margin-top: 4.5rem;
  }

  .ptd-schedule__header {
    margin-bottom: clamp(1.75rem, 4vw, 2.75rem);
  }

  .ptd-schedule__eyebrow {
    margin: 0;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--ptt-text-muted);
  }

  .ptd-schedule__title {
    margin: 0.25rem 0 0;
    font-size: clamp(2rem, 5.5vw, 3.15rem);
    font-weight: 400;
    line-height: 1.05;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--ptt-text);
    font-family: 'Bebas Neue', 'Arial Black', sans-serif;
  }

  .ptd-schedule__rule {
    display: block;
    width: min(100%, 14rem);
    height: 3px;
    margin-top: 0.65rem;
    border-radius: 999px;
    background: var(--ptt-accent);
  }

  .ptd-schedule__notice {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.6rem;
    margin: 1.1rem 0 0;
    font-size: 0.92rem;
    line-height: 1.5;
    color: var(--ptt-text);
  }

  .ptd-schedule__pill {
    padding: 0.2rem 0.7rem;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #ffffff;
    background: var(--ptt-primary);
  }

  .ptd-agenda {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .ptd-agenda__row {
    display: grid;
    grid-template-columns: var(--ptd-agenda-rail) 1fr;
    grid-template-areas:
      'rail time'
      'rail card';
    column-gap: 0.5rem;
    row-gap: 0.35rem;
    margin-bottom: var(--ptd-agenda-gap);
  }

  @media (min-width: 768px) {
    .ptd-agenda__row {
      grid-template-columns: 7.5rem var(--ptd-agenda-rail) 1fr;
      grid-template-areas: 'time rail card';
      column-gap: 0.75rem;
      row-gap: 0;
      align-items: stretch;
    }
  }

  /* Time column */
  .ptd-agenda__time {
    grid-area: time;
    display: flex;
    align-items: baseline;
    gap: 0.4rem;
    padding-top: 0.15rem;
    font-variant-numeric: tabular-nums;
  }

  @media (min-width: 768px) {
    .ptd-agenda__time {
      flex-direction: column;
      align-items: flex-end;
      gap: 0.1rem;
      padding-top: 0.9rem;
      text-align: right;
    }
  }

  .ptd-agenda__start {
    font-size: 0.95rem;
    font-weight: 800;
    color: var(--ptt-text);
  }

  .ptd-agenda__end {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--ptt-text-muted);
  }

  .ptd-agenda__end::before {
    content: '– ';
  }

  @media (min-width: 768px) {
    .ptd-agenda__end::before {
      content: none;
    }
  }

  /* Rail */
  .ptd-agenda__rail {
    grid-area: rail;
    position: relative;
    display: flex;
    justify-content: center;
    padding-top: 0.3rem;
  }

  @media (min-width: 768px) {
    .ptd-agenda__rail {
      padding-top: 1rem;
    }
  }

  .ptd-agenda__rail::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: calc(-1 * var(--ptd-agenda-gap));
    left: 50%;
    width: 2px;
    transform: translateX(-50%);
    background: color-mix(in srgb, var(--ptt-text) 14%, transparent);
  }

  .ptd-agenda__row:last-child .ptd-agenda__rail::before {
    bottom: auto;
    height: 1.4rem;
  }

  .ptd-agenda__dot {
    position: relative;
    z-index: 1;
    display: grid;
    place-items: center;
    width: 0.85rem;
    height: 0.85rem;
    border-radius: 999px;
    color: #ffffff;
    background: color-mix(in srgb, var(--ptt-text) 26%, transparent);
    box-shadow: 0 0 0 4px var(--ptt-bg);
    transition: transform 0.18s ease;
  }

  .ptd-agenda__row--session .ptd-agenda__dot {
    width: 1.6rem;
    height: 1.6rem;
    background: var(--ptt-primary);
  }

  .ptd-agenda__row--pending .ptd-agenda__dot {
    background: var(--ptt-bg);
    border: 2px dashed color-mix(in srgb, var(--ptt-text) 32%, transparent);
  }

  /* Cards */
  .ptd-agenda__card {
    grid-area: card;
    display: flex;
    align-items: center;
    gap: 0.9rem;
    width: 100%;
    padding: 0.85rem 1rem;
    border-radius: var(--ptd-card-radius, 1rem);
    text-align: left;
    background: var(--ptt-bg-elevated);
    border: 1px solid color-mix(in srgb, var(--ptt-text) 9%, transparent);
  }

  .ptd-agenda__card--logistics {
    background: color-mix(in srgb, var(--ptt-bg-elevated) 62%, transparent);
    border-style: solid;
    border-color: color-mix(in srgb, var(--ptt-text) 7%, transparent);
    padding-block: 0.7rem;
  }

  .ptd-agenda__card--speaker {
    cursor: pointer;
    padding: 1rem;
    box-shadow: 0 10px 28px color-mix(in srgb, var(--ptt-text) 8%, transparent);
    border-color: color-mix(in srgb, var(--ptt-primary) 22%, transparent);
    transition:
      transform 0.18s ease,
      box-shadow 0.18s ease,
      border-color 0.18s ease;
  }

  .ptd-agenda__card--speaker:hover {
    transform: translateY(-2px);
    border-color: var(--ptt-accent);
    box-shadow: 0 16px 36px color-mix(in srgb, var(--ptt-text) 14%, transparent);
  }

  .ptd-agenda__card--speaker:focus-visible {
    outline: 2px solid var(--ptt-primary);
    outline-offset: 3px;
  }

  .ptd-agenda__card--pending {
    background: color-mix(in srgb, var(--ptt-bg-elevated) 55%, transparent);
    border: 1px dashed color-mix(in srgb, var(--ptt-text) 26%, transparent);
    padding: 1rem;
  }

  .ptd-agenda__photo {
    width: 3.5rem;
    height: 3.5rem;
    flex-shrink: 0;
    border-radius: 999px;
    object-fit: cover;
    box-shadow: 0 0 0 2px var(--ptt-bg-elevated), 0 0 0 4px var(--ptt-accent);
  }

  @media (min-width: 640px) {
    .ptd-agenda__photo {
      width: 4.25rem;
      height: 4.25rem;
    }
  }

  .ptd-agenda__photo--ghost {
    display: grid;
    place-items: center;
    color: color-mix(in srgb, var(--ptt-text) 40%, transparent);
    background: color-mix(in srgb, var(--ptt-text) 7%, transparent);
    box-shadow: none;
    border: 1px dashed color-mix(in srgb, var(--ptt-text) 26%, transparent);
  }

  .ptd-agenda__icon {
    display: grid;
    place-items: center;
    width: 2.25rem;
    height: 2.25rem;
    flex-shrink: 0;
    border-radius: 999px;
    color: var(--ptt-primary);
    background: color-mix(in srgb, var(--ptt-primary) 12%, transparent);
  }

  .ptd-agenda__body {
    display: flex;
    min-width: 0;
    flex: 1;
    flex-direction: column;
    gap: 0.15rem;
  }

  .ptd-agenda__badges {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.45rem;
    margin-bottom: 0.15rem;
  }

  .ptd-agenda__badge {
    padding: 0.1rem 0.55rem;
    border-radius: 999px;
    font-size: 0.65rem;
    font-weight: 800;
    letter-spacing: 0.09em;
    text-transform: uppercase;
    color: var(--ptt-text);
    background: color-mix(in srgb, var(--ptt-accent) 20%, transparent);
  }

  .ptd-agenda__badge--ghost {
    color: var(--ptt-text-muted);
    background: color-mix(in srgb, var(--ptt-text) 9%, transparent);
  }

  .ptd-agenda__duration {
    font-size: 0.72rem;
    font-weight: 600;
    color: var(--ptt-text-muted);
  }

  .ptd-agenda__duration--end {
    flex-shrink: 0;
    margin-left: auto;
  }

  .ptd-agenda__headline {
    font-size: clamp(1rem, 2.4vw, 1.2rem);
    font-weight: 800;
    line-height: 1.25;
    color: var(--ptt-text);
    text-wrap: balance;
  }

  .ptd-agenda__logistics-title {
    font-size: 0.98rem;
    font-weight: 700;
    line-height: 1.3;
    color: var(--ptt-text);
  }

  .ptd-agenda__speaker {
    margin-top: 0.2rem;
    font-size: 0.92rem;
    font-weight: 700;
    color: var(--ptt-primary);
  }

  .ptd-agenda__role {
    font-size: 0.82rem;
    line-height: 1.4;
    color: var(--ptt-text-muted);
  }

  .ptd-agenda__reveal {
    margin-top: 0.15rem;
    font-size: 0.85rem;
    font-style: italic;
    color: var(--ptt-text-muted);
  }

  .ptd-agenda__more {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    margin-top: 0.5rem;
    font-size: 0.8rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--ptt-accent);
  }

  .ptd-agenda__card--speaker:hover .ptd-agenda__more svg {
    transform: translateX(3px);
  }

  .ptd-agenda__more svg {
    transition: transform 0.18s ease;
  }

  @media (prefers-reduced-motion: reduce) {
    .ptd-agenda__card--speaker,
    .ptd-agenda__more svg,
    .ptd-agenda__dot {
      transition: none;
    }

    .ptd-agenda__card--speaker:hover {
      transform: none;
    }

    .ptd-agenda__card--speaker:hover .ptd-agenda__more svg {
      transform: none;
    }
  }
</style>
