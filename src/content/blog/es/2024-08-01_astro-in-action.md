---
title: "Astro en acción"
description: "Por qué Astro me convenció: casos de Microsoft y Firebase, rendimiento medible y migración en vivo de Pereira Tech Talks, sin hype."
pubDate: "2024-08-01"
heroImage: "/images/blog/posts/astro-in-action/hero.webp"
heroLayout: "side-by-side"
tags: ["talks", "tech", "web-development", "javascript"]
keywords: ["Astro en acción charla", "por qué usar Astro para sitios web", "Astro rendimiento vs otros frameworks", "migrar sitio web a Astro", "Astro para desarrolladores JavaScript", "Pereira Tech Talks Astro 2024", "Astro static site generator ventajas"]
---

**Astro en Acción** responde una pregunta que escuchaba seguido: *¿Vale la pena?* Es nuevo. Es solo otro framework web. Quería mostrar por qué Astro destaca — con casos reales, números reales y un proyecto real: migrar [Pereira Tech Talks](https://www.pereiratechtalks.org/) a Astro como la demo de la charla.

---

## ¿Vale la Pena?

Empecé con el escepticismo. Astro es relativamente nuevo. El ecosistema de JavaScript está lleno de frameworks. ¿Por qué agregar otro? Recorrí dos casos de estudio que me convencieron — y que esperaba convencieran a la audiencia.

---

## Microsoft: Fluent Design System

Microsoft había probado varias herramientas para construir sus [docs de Fluent](https://fluent2.microsoft.design/). Otros frameworks y CMS eran demasiado rígidos, difíciles de mantener o dolorosos de migrar. No se integraban bien con su flujo de Figma y las historias de diseño que querían contar.

Sus requisitos: **ligero**, soporte para su librería de design system, fácil de mantener desde DevOps, extensibilidad para DocSearch o Algolia, y soporte para la última versión de React. Astro encajaba: envía **cero JavaScript por defecto**, es fácil de desplegar, agnóstico de herramientas, ligero y soporta React.

El resultado: el equipo de Fluent construyó páginas nuevas en **la mitad del tiempo** comparado con su stack anterior. Desarrolladores y diseñadores se mantuvieron alineados. Ahí supe que Astro no era solo hype.

---

## Firebase: De Blogger a Astro

La historia del [blog de Firebase](https://firebase.blog/) pegó más cerca. Un equipo de 10 desarrolladores hospedaba su blog en Blogger. Tenían que escribir posts en Google Docs y luego convertir borradores a Blogger. Un post corto podía tomar una hora antes de publicar. Imágenes y componentes interactivos requerían HTML hecho a mano. Blogger ni siquiera tenía imágenes de perfil — había que insertar HTML y CSS directamente en cada post.

Necesitaban: una experiencia de desarrollador moderna, publicar más rápido, un blog más performante y menos fricción para un equipo de 10. Reconstruyeron con Astro.

**Resultados:** Publicar pasó de **horas a minutos**. El tiempo de build con GitHub Actions pasó de 6 minutos a **1.5 minutos** — una **reducción del 75%**. Eso es ingeniería como marketing: la herramienta misma hace al equipo más productivo.

---

## Comunidad y Rising Stars

También mostré dónde está Astro en el ecosistema. [JavaScript Rising Stars](https://risingstars.js.org/) mide uso, awareness, interés, retención y positividad. Astro ha ido subiendo. La comunidad crece. Eso importa cuando apuestas por un stack.

---

## Características que Importan

Recorrí lo que hace a Astro diferente:

- **Islands** — Envía solo el JavaScript que necesitas, donde lo necesitas
- **UI-agnóstico** — Usa React, Svelte, Vue o vanilla. Cero lock-in
- **Server-first** — HTML por defecto, JS como mejora
- **Content-driven** — Pensado para blogs, docs y sitios de contenido
- **Deploy everywhere** — Vercel, Netlify, Cloudflare, hosting estático

Dicho esto, **Astro no es para todo proyecto**. Si estás construyendo una app altamente interactiva como Figma o un dashboard en tiempo real, React o Svelte solos pueden ser mejores opciones. Astro sobresale en sitios con mucho contenido donde la mayor parte de la página es estática y la interactividad es la excepción, no la regla. Saber cuándo *no* usar una herramienta es tan importante como saber cuándo usarla.

---

## Pereira Tech Talks: la demo

El resultado principal de la charla fue la migración misma. [Pereira Tech Talks](https://www.pereiratechtalks.org/) lleva años funcionando — desde septiembre de 2017. Un blog comunitario: estático, landing page, fácil de mantener, gratis de hospedar. El stack original usaba Ghost en Docker. Mantenimiento alrededor de $5–8/mes.

Lo reconstruimos con Astro. [v2.pereiratechtalks.org](https://v2.pereiratechtalks.org/) se convirtió en la demo en vivo — estático y dinámico, blog, landing page, fácil de mantener, conectado a storage simple, soporte en tiempo real donde hacía falta. Un desarrollador. Dos semanas. El sitio ahora es más ligero, más rápido y más fácil de contribuir.

<figure>
<img src="/images/blog/posts/astro-in-action/poster.webp" alt="Póster promocional de la charla Astro en Acción en Camellando Coworking" loading="lazy" />
<figcaption>El póster del evento — 1 de agosto, Camellando Coworking, Pereira. La charla usó la migración de Pereira Tech Talks en vivo como demo principal.</figcaption>
</figure>

---

## Memorias del Evento

<figure>
<div class="grid grid-cols-2 gap-4 not-prose">
  <img src="/images/blog/posts/astro-in-action/sergio-presenting-astro-talk.webp" alt="Sergio durante la charla Astro en Acción" width="600" height="400" class="rounded-xl object-cover w-full aspect-[4/3]" loading="lazy" />
  <img src="/images/blog/posts/astro-in-action/audience-at-meetup.webp" alt="Audiencia en el meetup Astro en Acción" width="600" height="400" class="rounded-xl object-cover w-full aspect-[4/3]" loading="lazy" />
  <img src="/images/blog/posts/astro-in-action/group-photo-attendees.webp" alt="Foto grupal de asistentes al meetup Astro en Acción" width="600" height="400" class="col-span-2 rounded-xl object-cover w-full aspect-[4/3]" loading="lazy" />
</div>
<figcaption>La asistencia al meetup de Astro en Acción — desarrolladores que vinieron a ver si el framework podía cumplir su promesa en una demo en vivo.</figcaption>
</figure>

---

## Construyamos algo

Terminé con una invitación: contribuir. El [repositorio de Pereira Tech Talks](https://github.com/pereira-tech-talks/pereiratechtalks.org) está abierto. Astro 4 acababa de llegar. El ecosistema madura. Si estás construyendo un blog, una landing page o un sitio de contenido — Astro vale la pena mirar.

[Ver slides](https://slides.com/xergioalex/astro-in-action)

Sigamos construyendo.
