<script lang="ts">
interface Props {
  href: string;
  label: string;
  src?: string;
}

let {
  href,
  label,
  src = '/images/pereira-tech-days/2026/mascot/peek.webp',
}: Props = $props();

let visible = $state(false);
let root: HTMLElement | undefined = $state();

$effect(() => {
  if (!root || typeof IntersectionObserver === 'undefined') {
    visible = true;
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        visible = true;
        observer.disconnect();
      }
    },
    { threshold: 0.2 }
  );
  observer.observe(root);
  return () => observer.disconnect();
});
</script>

<aside
  bind:this={root}
  class="pointer-events-none absolute bottom-0 right-0 z-10 hidden sm:block"
  aria-hidden="true"
>
  <a
    {href}
    class={`pointer-events-auto group block transition-all duration-700 ease-out motion-reduce:translate-x-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
      visible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
    }`}
    aria-label={label}
  >
    <img
      {src}
      alt=""
      width="180"
      height="200"
      loading="lazy"
      decoding="async"
      class="h-40 w-auto drop-shadow-xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105 motion-reduce:transition-none"
      draggable="false"
    />
  </a>
</aside>
