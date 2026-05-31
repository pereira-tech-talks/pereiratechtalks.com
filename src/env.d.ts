/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string;
  /** Injected at build time: 'true' on Cloudflare Pages preview branches */
  readonly PREVIEW_FEATURES?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
