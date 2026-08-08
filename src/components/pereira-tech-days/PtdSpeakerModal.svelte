<script lang="ts">
/**
 * PtdSpeakerModal — shared session detail dialog for the PTD agenda and the
 * speakers grid. Uses the native `<dialog>` element so focus trapping, ESC,
 * and inert-background come from the platform instead of hand-rolled JS.
 */

import PtdSocialIcon from '@/components/pereira-tech-days/PtdSocialIcon.svelte';
import type { PtdScheduleSlotView } from '@/lib/ptdSchedule';

interface Props {
  /** Slot to display; `null` keeps the dialog closed. */
  entry: PtdScheduleSlotView | null;
  labels: {
    close: string;
    about: string;
    session: string;
    profile: string;
    abstractPending: string;
  };
  onclose: () => void;
}

let { entry, labels, onclose }: Props = $props();

let dialog = $state<HTMLDialogElement | null>(null);

$effect(() => {
  if (!dialog) return;
  if (entry && !dialog.open) {
    dialog.showModal();
  } else if (!entry && dialog.open) {
    dialog.close();
  }
});

/** Click on the backdrop (the dialog element itself) closes the dialog. */
function handleBackdrop(event: MouseEvent) {
  if (event.target === dialog) onclose();
}
</script>

<dialog
  bind:this={dialog}
  class="ptd-modal"
  aria-labelledby="ptd-modal-title"
  onclose={onclose}
  onclick={handleBackdrop}
>
  {#if entry}
    <article class="ptd-modal__panel">
      <button type="button" class="ptd-modal__close" onclick={onclose} aria-label={labels.close}>
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            d="M6 6l12 12M18 6L6 18"
            fill="none"
            stroke="currentColor"
            stroke-width="2.2"
            stroke-linecap="round"
          />
        </svg>
      </button>

      <div class="ptd-modal__meta">
        <span class="ptd-modal__time">
          {entry.timeLabel}{entry.endTimeLabel ? ` – ${entry.endTimeLabel}` : ''}
        </span>
        <span class="ptd-modal__badge">{entry.typeLabel}</span>
        {#if entry.durationLabel}
          <span class="ptd-modal__duration">{entry.durationLabel}</span>
        {/if}
      </div>

      {#if entry.speaker}
        <div class="ptd-modal__speaker">
          <img
            class="ptd-modal__photo"
            src={entry.speaker.photo}
            alt={entry.speaker.photoAlt}
            width="112"
            height="112"
            loading="lazy"
            decoding="async"
          />
          <div class="min-w-0">
            <p class="ptd-modal__name">{entry.speaker.name}</p>
            <p class="ptd-modal__role">{entry.speaker.role}</p>
            {#if entry.speaker.social.length > 0}
              <ul class="ptd-modal__social" role="list">
                {#each entry.speaker.social as link (link.key)}
                  <li>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                    >
                      <PtdSocialIcon name={link.key} />
                    </a>
                  </li>
                {/each}
              </ul>
            {/if}
          </div>
        </div>
      {/if}

      <p class="ptd-modal__eyebrow">{labels.session}</p>
      <h2 id="ptd-modal-title" class="ptd-modal__title">{entry.title}</h2>
      <span class="ptd-modal__rule" aria-hidden="true"></span>

      <p class="ptd-modal__body">
        {entry.description || labels.abstractPending}
      </p>

      {#if entry.speaker?.bio}
        <h3 class="ptd-modal__subtitle">{labels.about}</h3>
        <p class="ptd-modal__body">{entry.speaker.bio}</p>
      {/if}

      {#if entry.speaker}
        <a class="ptd-modal__cta" href={entry.speaker.profileHref}>
          {labels.profile}
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path
              d="M5 12h14M13 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </a>
      {/if}
    </article>
  {/if}
</dialog>

<style>
  .ptd-modal {
    /* Tailwind preflight zeroes the UA `margin: auto`, which is what centers
       a top-layer dialog — restore it explicitly. */
    inset: 0;
    margin: auto;
    width: min(42rem, calc(100vw - 1.5rem));
    max-height: min(88dvh, 52rem);
    padding: 0;
    border: 0;
    border-radius: 1.35rem;
    background: transparent;
    overflow: visible;
  }

  .ptd-modal::backdrop {
    background: color-mix(in srgb, #0b1b2a 72%, transparent);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }

  .ptd-modal[open] {
    animation: ptd-modal-in 0.22s ease-out;
  }

  @keyframes ptd-modal-in {
    from {
      opacity: 0;
      transform: translateY(12px) scale(0.98);
    }
  }

  .ptd-modal__panel {
    position: relative;
    max-height: min(88dvh, 52rem);
    overflow-y: auto;
    padding: clamp(1.5rem, 4vw, 2.25rem);
    border-radius: 1.35rem;
    background: var(--ptt-bg-elevated, #ffffff);
    color: var(--ptt-text, #1f3f59);
    box-shadow: 0 24px 60px rgb(0 0 0 / 28%);
    overscroll-behavior: contain;
  }

  .ptd-modal__close {
    position: absolute;
    top: 0.85rem;
    right: 0.85rem;
    display: grid;
    place-items: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 999px;
    color: var(--ptt-text);
    background: color-mix(in srgb, var(--ptt-text) 8%, transparent);
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .ptd-modal__close:hover {
    background: color-mix(in srgb, var(--ptt-text) 16%, transparent);
  }

  .ptd-modal__close:focus-visible {
    outline: 2px solid var(--ptt-primary);
    outline-offset: 2px;
  }

  .ptd-modal__meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    padding-right: 2.5rem;
    margin-bottom: 1.25rem;
  }

  .ptd-modal__time {
    font-size: 0.95rem;
    font-weight: 700;
    color: var(--ptt-primary);
  }

  .ptd-modal__badge {
    padding: 0.15rem 0.6rem;
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ptt-text);
    background: color-mix(in srgb, var(--ptt-accent) 18%, transparent);
  }

  .ptd-modal__duration {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--ptt-text-muted);
  }

  .ptd-modal__speaker {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding-bottom: 1.25rem;
    margin-bottom: 1.25rem;
    border-bottom: 1px solid color-mix(in srgb, var(--ptt-text) 10%, transparent);
  }

  .ptd-modal__photo {
    width: 5.5rem;
    height: 5.5rem;
    flex-shrink: 0;
    border-radius: 999px;
    object-fit: cover;
    box-shadow: 0 0 0 3px var(--ptt-bg-elevated), 0 0 0 5px var(--ptt-accent);
  }

  @media (min-width: 640px) {
    .ptd-modal__photo {
      width: 7rem;
      height: 7rem;
    }
  }

  .ptd-modal__name {
    margin: 0;
    font-size: 1.3rem;
    font-weight: 800;
    line-height: 1.2;
  }

  .ptd-modal__role {
    margin: 0.15rem 0 0;
    font-size: 0.92rem;
    color: var(--ptt-text-muted);
  }

  .ptd-modal__social {
    display: flex;
    gap: 0.4rem;
    margin: 0.5rem 0 0;
    padding: 0;
    list-style: none;
  }

  .ptd-modal__social a {
    display: inline-flex;
    color: var(--ptt-text-muted);
    transition: color 0.15s ease;
  }

  .ptd-modal__social a:hover {
    color: var(--ptt-primary);
  }

  .ptd-modal__social a:focus-visible {
    outline: 2px solid var(--ptt-primary);
    outline-offset: 2px;
    border-radius: 4px;
  }

  .ptd-modal__eyebrow {
    margin: 0;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ptt-text-muted);
  }

  .ptd-modal__title {
    margin: 0.3rem 0 0;
    font-size: clamp(1.5rem, 4vw, 2.15rem);
    font-weight: 400;
    line-height: 1.1;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    font-family: 'Bebas Neue', 'Arial Black', sans-serif;
  }

  .ptd-modal__rule {
    display: block;
    width: 3rem;
    height: 3px;
    margin: 0.85rem 0 1rem;
    border-radius: 999px;
    background: var(--ptt-accent);
  }

  .ptd-modal__subtitle {
    margin: 1.5rem 0 0.5rem;
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ptt-text-muted);
  }

  .ptd-modal__body {
    margin: 0;
    font-size: 1rem;
    line-height: 1.65;
    color: var(--ptt-text);
  }

  .ptd-modal__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: 1.5rem;
    padding: 0.6rem 1.2rem;
    border-radius: var(--ptd-button-radius, 9999px);
    font-size: 0.92rem;
    font-weight: 700;
    color: #ffffff;
    background: var(--ptt-primary);
    transition: opacity 0.15s ease;
  }

  .ptd-modal__cta:hover {
    opacity: 0.9;
  }

  .ptd-modal__cta:focus-visible {
    outline: 2px solid var(--ptt-primary);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .ptd-modal[open] {
      animation: none;
    }
  }
</style>
