<script>
import { onMount } from 'svelte';

export let headings = [];
export let label = 'On this page';

let activeId = headings[0]?.id ?? '';

function handleClick(event, id) {
  event.preventDefault();
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
    activeId = id;
  }
}

onMount(() => {
  if (headings.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId = entry.target.id;
        }
      }
    },
    { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
  );

  for (const { id } of headings) {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  }

  return () => observer.disconnect();
});
</script>

<nav aria-label={label} class="sticky top-24">
  <p class="text-xs font-semibold uppercase tracking-widest text-ptt-primary dark:text-ptt-primary-dark">
    {label}
  </p>
  <ul class="mt-4 space-y-2 border-l border-ptt-border pl-4">
    {#each headings as heading (heading.id)}
      <li>
        <a
          href={`#${heading.id}`}
          class="block text-sm leading-snug transition-colors {activeId === heading.id
            ? 'font-semibold text-ptt-primary dark:text-ptt-primary-dark'
            : 'text-ptt-secondary hover:text-ptt'}"
          on:click={(e) => handleClick(e, heading.id)}
        >
          {heading.text}
        </a>
      </li>
    {/each}
  </ul>
</nav>
