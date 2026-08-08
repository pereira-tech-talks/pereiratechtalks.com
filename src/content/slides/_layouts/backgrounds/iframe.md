<!--
BACKGROUND: iframe
USE WHEN: embedding an interactive demo (CodePen, Observable, Map) as the slide background.
DON'T USE WHEN: an image or video would communicate the same idea — iframes are heavy.
TEXT CONTRACT: text floats above the iframe via .reveal stacking; add slide-bg-overlay--dark for contrast.
RESPONSIVE: iframe scales but the embedded site may not respond well below 768px.
CAVEATS:
- Interactive content; audience may interact accidentally — disable pointer events with CSS if needed.
- Some sites block being iframed (X-Frame-Options).
- Performance cost: external scripts run on slide enter.
COPY-PASTE:
-->

<!-- .slide: data-background-iframe="https://example.com/" data-background-interactive class="slide-bg-overlay--dark" -->

## Iframe Background

<small>Note: live, interactive — use sparingly.</small>
