<!--
LAYOUT: code-with-callout
USE WHEN: explaining what a code block does or means, side-by-side.
DON'T USE WHEN: code is too long for a slide — use stepped highlight `[1-2|4-6|8]` on a single block instead.
RESPONSIVE: stacks vertically below 768px (code first, explanation second).
THEMES: code block uses --slide-surface; explanation uses --slide-text.
COPY-PASTE:
-->

## Code With Callout

<div class="slide-grid-2 slide-grid--align-center">
  <div>

```typescript
async function fetchUser(id: string) {
  const res = await fetch(`/api/users/${id}`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
}
```

  </div>
  <div>
    <h3>What's happening</h3>
    <ul>
      <li>Plain <code>fetch</code> — no library</li>
      <li>Throws on non-2xx so callers can <code>try/catch</code></li>
      <li>Returns parsed JSON, not the Response</li>
    </ul>
  </div>
</div>
