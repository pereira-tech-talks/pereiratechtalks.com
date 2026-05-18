/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite/client" />
/// <reference types="../integration/types.d.ts" />

declare module '@fontsource/*';

interface Window {
  luma?: {
    initCheckout: () => void;
  };
  __lumaCheckoutListeners?: boolean;
  __scheduleLumaCheckout?: () => void;
  __openLumaCheckoutModal?: (eventId: string, button: HTMLElement) => void;
}
