/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  safelist: ['md:pr-12', 'md:pl-12', 'md:ml-auto'],
  theme: {
    extend: {
      fontFamily: {},

      typography: {
        DEFAULT: {
          css: {
            h1: {
              color: 'var(--tw-prose-headings)',
              fontWeight: '700',
            },
            // más personalizaciones...
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
