/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite/client" />
/// <reference types="../integration/types.d.ts" />

declare module '*.json' {
  const value: any;
  export default value;
}
