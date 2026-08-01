---
type: native
title: "Slides v2 — Demo Kitchen Sink"
description: "Showcase completo de cada layout, fondo y feature de Reveal.js en el sistema de slides v2 — splits, imágenes full-bleed, citas, stats, tablas, math."
pubDate: 2026-04-25
updatedDate: 2026-05-14
heroImage: "/images/slides/demo-revealjs-features/hero-es.webp"
relatedPost: "building-slide-system-inside-astro-revealjs"
draft: false
theme: dark
transition: slide
syntaxHighlight: true
math: true
eventName: "Demo de Pereira Tech Talks"
eventDate: 2026-04-25
---

<!-- ==================== Portada ==================== -->

<!-- .slide: data-background-gradient="linear-gradient(135deg, #08191A 0%, #0F2A2C 100%)" -->

# Slides v2 — Kitchen Sink

### Cada layout, fondo y feature en una sola presentación

<small>Pereira Tech Talks · 2026</small>

Note: La portada. Usa un patrón title-hero con un gradiente fuerte para fijar el tono visual del deck completo.

---

<!-- ==================== Sección: Layouts ==================== -->

<!-- .slide: data-background-gradient="linear-gradient(135deg, #152e45 0%, #0f1124 100%)" -->

<div class="slide-section-divider">
  <span class="eyebrow">Parte 01</span>
  <h2>Layouts</h2>
</div>

---

## Split de Dos Columnas

<div class="slide-grid-2">
  <div>
    <h3>Lado izquierdo</h3>
    <p>Compara dos ideas lado a lado. Busca estructura paralela para que el contraste sea obvio.</p>
  </div>
  <div>
    <h3>Lado derecho</h3>
    <p>Se apila vertical debajo de 768px para mantener la legibilidad en celulares desde la última fila.</p>
  </div>
</div>

---

## Tres Pilares

<div class="slide-grid-3">
  <div class="slide-card">
    <span class="slide-card__icon">🚀</span>
    <h3>Velocidad</h3>
    <p>Lanza primero la versión más pequeña que tenga valor.</p>
  </div>
  <div class="slide-card">
    <span class="slide-card__icon">🧭</span>
    <h3>Claridad</h3>
    <p>Si no puedes explicarlo en una frase, el diseño no está terminado.</p>
  </div>
  <div class="slide-card">
    <span class="slide-card__icon">🤝</span>
    <h3>Confianza</h3>
    <p>Se gana en gotas, se pierde en baldes.</p>
  </div>
</div>

---

## Imagen a la Izquierda

<div class="slide-grid-2 slide-grid--align-center">
  <div>
    <img src="https://picsum.photos/seed/demo-left/640/480" alt="Imagen de muestra que ilustra la columna izquierda" width="640" height="480" class="slide-image-full" />
  </div>
  <div>
    <h3>Ancla el visual</h3>
    <p>Lleva a la audiencia a través de lo que están viendo y luego entrega un único takeaway.</p>
  </div>
</div>

---

## Imagen a la Derecha

<div class="slide-grid-2 slide-grid--align-center">
  <div>
    <h3>Empieza con la idea</h3>
    <p>Útil para momentos narrativos — dilo primero, luego ánclalo visualmente.</p>
  </div>
  <div>
    <img src="https://picsum.photos/seed/demo-right/640/480" alt="Imagen de muestra que ilustra la columna derecha" width="640" height="480" class="slide-image-full" />
  </div>
</div>

---

<!-- .slide: data-background-image="https://picsum.photos/seed/fullbleed/1920/1080" data-background-size="cover" data-background-position="center" data-background-opacity="0.85" class="slide-bg-overlay--dark" -->

## Imagen, Full-Bleed

<small>La imagen ES el mensaje. El overlay mantiene el texto legible.</small>

---

<blockquote class="slide-quote">
  "La mejor manera de predecir el futuro es construirlo — pequeño, amable y a propósito."
</blockquote>
<cite class="slide-quote-cite">— Layout Pull-Quote · 2026</cite>

---

## Código con Anotación

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
    <h3>Qué hace</h3>
    <ul>
      <li><code>fetch</code> nativo</li>
      <li>Lanza error en respuestas no 2xx</li>
      <li>Retorna JSON parseado</li>
    </ul>
  </div>
</div>

---

<div class="slide-stat">
  <span class="slide-stat__number">87%</span>
  <span class="slide-stat__label">de los equipos que hicieron standups asíncronos durante 60 días siguieron haciéndolos</span>
  <p class="slide-stat__context">Cohorte interna de DailyBot, 2017–2018</p>
</div>

---

## Tabla Comparativa

<table class="slide-table">
  <thead>
    <tr><th>Feature</th><th>Reveal.js</th><th>Slidev</th><th>Google Slides</th></tr>
  </thead>
  <tbody>
    <tr><td>Markdown-first</td><td>Sí</td><td>Sí</td><td>No</td></tr>
    <tr><td>Self-host</td><td>Sí</td><td>Sí</td><td>No</td></tr>
    <tr><td>Gratis</td><td>Sí</td><td>Sí</td><td>Sí</td></tr>
    <tr><td>Edición en tiempo real</td><td>No</td><td>No</td><td>Sí</td></tr>
  </tbody>
</table>

---

## Proceso — Cómo Funciona

<ol class="slide-steps">
  <li><strong>Define</strong><br/>Arquitectura, esquemas, restricciones.</li>
  <li><strong>Scaffold</strong><br/>Deja que los agentes redacten el boilerplate.</li>
  <li><strong>Revisa</strong><br/>Lee el diff como lo haría un revisor.</li>
  <li><strong>Lanza</strong><br/>Commit, push, valida vía CI.</li>
</ol>

---

## Línea de Tiempo

<ul class="slide-timeline">
  <li><time>2017</time><span>Bot interno de Slack para standups</span></li>
  <li><time>2018</time><span>Lanzamiento público, primeros clientes pagos</span></li>
  <li><time>2019</time><span>1.000 equipos, ramen profitable</span></li>
  <li><time>2020</time><span>5.000 equipos durante el boom de trabajo remoto por COVID</span></li>
  <li><time>2021</time><span>Y Combinator S21</span></li>
</ul>

---

## Equipo

<div class="slide-team">
  <figure>
    <img src="https://i.pravatar.cc/120?img=1" alt="Avatar de co-presentador" width="100" height="100" />
    <figcaption><strong>Jane Doe</strong><br/><span>Fundadora · CEO</span></figcaption>
  </figure>
  <figure>
    <img src="https://i.pravatar.cc/120?img=2" alt="Avatar de co-presentador" width="100" height="100" />
    <figcaption><strong>John Doe</strong><br/><span>Cofundador · CTO</span></figcaption>
  </figure>
  <figure>
    <img src="https://i.pravatar.cc/120?img=3" alt="Avatar de co-presentador" width="100" height="100" />
    <figcaption><strong>Alex Doe</strong><br/><span>Head of Product</span></figcaption>
  </figure>
</div>

---

<!-- ==================== Sección: Fondos ==================== -->

<!-- .slide: data-background-gradient="linear-gradient(135deg, #152e45 0%, #0f1124 100%)" -->

<div class="slide-section-divider">
  <span class="eyebrow">Parte 02</span>
  <h2>Fondos</h2>
</div>

---

<!-- .slide: data-background-color="#1e3a5f" -->

## Color Sólido

Texto blanco automático vía has-dark-background.

---

<!-- .slide: data-background-gradient="radial-gradient(circle at top, #d81540 0%, #0f1124 80%)" -->

## Gradiente

Texto blanco forzado vía la cascada [data-background-gradient].

---

<!-- .slide: data-background-image="https://picsum.photos/seed/bgimg2/1920/1080" data-background-size="cover" data-background-position="center" data-background-opacity="0.8" class="slide-bg-overlay--dark" -->

## Imagen con Overlay

Overlay negro al 55% garantiza la legibilidad del texto.

---

<!-- .slide: class="slide-bg-pattern--dots" -->

## Patrón — Puntos

Patrón CSS-only de puntos repetidos.

---

<!-- .slide: class="slide-bg-pattern--grid" -->

## Patrón — Grid

CSS-only con sensación de blueprint.

---

<!-- ==================== Sección: Features de Reveal ==================== -->

<!-- .slide: data-background-gradient="linear-gradient(135deg, #152e45 0%, #0f1124 100%)" -->

<div class="slide-section-divider">
  <span class="eyebrow">Parte 03</span>
  <h2>Features de Reveal</h2>
</div>

---

## Fragments

Haz clic para revelar cada ítem:

- Primer punto <!-- .element: class="fragment fade-up" -->
- Segundo punto <!-- .element: class="fragment fade-up" -->
- Tercer punto <!-- .element: class="fragment fade-up" -->

---

<!-- .slide: data-auto-animate -->

## Auto-Animate

<div data-id="box" style="background: #2563eb; width: 100px; height: 100px; border-radius: 8px; margin: 0 auto;"></div>

---

<!-- .slide: data-auto-animate -->

## Auto-Animate

<div data-id="box" style="background: #7c3aed; width: 300px; height: 200px; border-radius: 32px; margin: 0 auto;"></div>

---

## Resaltado de Código (por Pasos)

```typescript [1-2|4-6|8-10]
import Reveal from 'reveal.js';
import Markdown from 'reveal.js/plugin/markdown';

const deck = new Reveal({
  plugins: [Markdown],
});

deck.initialize().then(() => {
  console.log('Reveal.js is ready!');
});
```

---

## Math (KaTeX)

La fórmula cuadrática:

$$x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

La identidad de Euler:

$$e^{i\pi} + 1 = 0$$

---

<!-- ==================== Layouts de medios ==================== -->

<!-- .slide: data-background-gradient="linear-gradient(135deg, #0f1124 0%, #152e45 50%, #1a3a5a 100%)" -->

<div class="slide-section-divider">
  <span class="eyebrow">Parte 04</span>

## Layouts de Medios

</div>

---

## Video Centrado

<video data-autoplay loop muted class="slide-video" width="960" height="540">
  <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
</video>

---

## Video a la Izquierda

<div class="slide-grid-2 slide-grid--align-center">
  <div>
    <video data-autoplay loop muted class="slide-video" width="640" height="360">
      <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
    </video>
  </div>
  <div>
    <h3>Ancla lo visual</h3>
    <p>Guía a la audiencia por lo que están viendo y cierra con una conclusión clave.</p>
  </div>
</div>

---

## Video a la Derecha

<div class="slide-grid-2 slide-grid--align-center">
  <div>
    <h3>Lidera con la idea</h3>
    <p>Dilo primero y ancla visualmente con el clip. Útil para momentos narrativos.</p>
  </div>
  <div>
    <video data-autoplay loop muted class="slide-video" width="640" height="360">
      <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
    </video>
  </div>
</div>

---

## Imagen Centrada

<img src="https://picsum.photos/seed/centered/960/540" alt="Foto de paisaje" width="960" height="540" class="slide-image-full" />

<small>Una sola imagen con título y pie de foto opcional</small>

---

## Video Contenido

<video data-autoplay loop muted class="slide-media-contained" width="960" height="540">
  <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
</video>

<small>Centrado con espacio alrededor</small>

---

## Imagen Contenida

<img src="https://picsum.photos/seed/contained/960/540" alt="Foto de paisaje" width="960" height="540" class="slide-media-contained" />

<small>Centrada con espacio alrededor</small>

---

<!-- .slide: data-background-video="https://www.w3schools.com/html/mov_bbb.mp4" data-background-video-loop data-background-video-muted data-background-size="cover" -->

&nbsp;

Note: Video pantalla completa — sin texto, puro impacto visual. El clip llena todo el slide.

---

<!-- .slide: data-background-image="https://picsum.photos/seed/fullscreen/1920/1080" data-background-size="cover" data-background-position="center" -->

&nbsp;

Note: Imagen pantalla completa — sin texto, puro impacto visual. La foto llena todo el slide.

---

<!-- .slide: data-background-video="https://www.w3schools.com/html/mov_bbb.mp4" data-background-video-loop data-background-video-muted data-background-size="cover" class="slide-bg-overlay--dark" -->

## Video de Fondo con Texto

Un clip en loop detrás del contenido — el overlay garantiza la legibilidad del texto.

---

## Slides Verticales

Presiona **flecha abajo** para navegar verticalmente.

--

### Sub-Slide Vertical 1

Contenido anidado usando el separador `--`.

--

### Sub-Slide Vertical 2

Puedes ir tan profundo como necesites.

---

## Notas del Presentador

Presiona **S** para abrir la vista del presentador.

Note: Las notas del presentador son visibles solo en la vista del presentador. Úsalas para puntos de discusión, recordatorios o referencias de tiempo.

---

<!-- ==================== Cierre ==================== -->

<!-- .slide: data-background-gradient="linear-gradient(135deg, #0f1124 0%, #152e45 100%)" -->

## Gracias

<p>Todos los snippets y helpers viven en <strong>src/styles/slides.css</strong> y <strong>src/content/slides/_layouts/</strong></p>

<a href="https://pereiratechtalks.org/slides" class="slide-cta">Ver todas las presentaciones →</a>

<small>Hecho con Reveal.js dentro de Astro · pereiratechtalks.org</small>
