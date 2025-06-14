(async () => {
  const { vitePreprocess } = await import('@astrojs/svelte');

  module.exports = {
    preprocess: vitePreprocess(),
  };
})();
