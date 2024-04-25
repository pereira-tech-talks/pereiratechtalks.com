// eslint-disable-next-line no-extra-semi
(async () => {
  const { vitePreprocess } = await import('@astrojs/svelte');

  module.exports = {
    preprocess: vitePreprocess(),
  };
})();
