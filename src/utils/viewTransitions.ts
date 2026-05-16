import { fade } from 'astro:transitions';

/** Main content fade on client-side navigation (View Transitions). */
export const mainContentTransition = fade({ duration: '350ms' });
