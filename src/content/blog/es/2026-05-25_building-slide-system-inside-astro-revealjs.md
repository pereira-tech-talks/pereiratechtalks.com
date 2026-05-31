---
title: "Construyendo un sistema de diapositivas multilingüe dentro de Astro con Reveal.js"
description: "Cómo construí un catálogo de presentaciones de dos tipos dentro de mi sitio Astro — uniones discriminadas, gemelos AEO, aislamiento de assets y más."
pubDate: 2026-05-25T11:00:00Z
tags: ["web-development", "talks", "astro", "svelte", "portfolio"]
series: "slides-as-code"
seriesOrder: 2
heroImage: "/images/blog/posts/building-slide-system-inside-astro-revealjs/hero-es.webp"
heroLayout: side-by-side
relatedSlide: "demo-revealjs-features"
draft: false
keywords: [astro diapositivas, integración reveal.js astro, slides como contenido, esquema unión discriminada, gemelos AEO markdown, sistema de presentaciones]
---

Después de [investigar las herramientas slides-as-code que hoy existen para desarrolladores](/es/blog/best-slides-as-code-presentation-tools) —Reveal.js, Slidev, Marp, Spectacle y un puñado más— elegí [Reveal.js](https://revealjs.com) para construir el sistema de presentaciones de mi sitio.

La meta era concreta: quería que mis charlas vivieran en el mismo lugar que mi blog. No repartidas entre Google Slides, un PDF colgado en algún lado y un dominio externo, sino dentro de mi sitio y tratadas como contenido de primera clase: misma Content Collection, mismo i18n, mismo SEO que cualquier post.

Y había una segunda condición: que el sistema se pudiera pilotar con agentes de IA. Si las slides son texto plano —archivos `.md` en el repo— un agente puede generar una, reordenar una sección o traducir un deck entero igual que edita cualquier otro archivo, y yo me quedo con lo que de verdad importa: la narrativa.

Este post es el caso de estudio de cómo lo construí: las decisiones de arquitectura y los dos tipos de presentaciones que el sistema soporta.

## ¿Por qué Reveal.js?

La comparación completa, herramienta por herramienta, vive en [un análisis aparte de las opciones slides-as-code](/es/blog/best-slides-as-code-presentation-tools). Aquí me interesa la otra mitad: por qué Reveal encajó en mi sitio donde las demás no. Y casi todo se reduce a una distinción: **Reveal.js es una librería; las alternativas más fuertes son aplicaciones.** Una librería la importo dentro de mi propio build; una aplicación me obliga a mantener la suya en paralelo.

Reveal es JavaScript vanilla, sin dependencia de framework. Lo importo en un componente Svelte, lo inicializo al montar, y el resto de la página sigue siendo Astro estándar: mismo build, mismas Content Collections, mismo i18n, mismo SEO. La frontera de integración cabe en unas pocas decenas de líneas. Encima trae lo que necesito para charlas técnicas —Markdown nativo, fragments, auto-animate, resaltado de código por pasos— como plugins componibles, sin atarme a ningún runtime.

Las demás opciones que evalué eran buenas, pero cada una chocaba con esa misma frontera. **Marp** es el más fácil de aprender, pero su interactividad es limitada —sin fragments, sin demos de código en vivo— y sus valores por defecto apuntan a un PDF de grado presentación, no a una experiencia web dentro de mi sitio. **Spectacle** es elegante si tu proyecto ya corre sobre React; el mío no, así que adoptarlo significaba meter un segundo runtime de framework solo para las diapositivas.

El caso más difícil de descartar fue **Slidev**, porque tiene la mejor experiencia de autoría del grupo. Pero Slidev no es una librería, es una aplicación. Para usarlo dentro de un sitio Astro tendría que mantener dos universos en paralelo: el `package.json` de Astro y el de Slidev, con Vue, Vite y todo su árbol de dependencias. Dos pipelines de build. Dos sistemas de tema que no se hablan entre sí —el de UnoCSS de Slidev y el mío de Tailwind v4.

Y, sobre todo, perdería las Content Collections de Astro: sin validación Zod, sin filtrado de borradores, sin `getCollection()`. La salida de Slidev es una SPA con routing basado en hash, invisible para `@astrojs/sitemap`. Reveal evita todo eso por una razón de fondo: es algo que incrusto, no algo que tengo que hospedar aparte.

Hay algo curioso en haber aterrizado en Reveal.js: ya venía usándolo, sin darme cuenta, desde hacía años. Las charlas que tenía publicadas fuera de mi sitio vivían en [slides.com](https://slides.com), que no es más que un editor visual encima de Reveal. Elegir la librería en lugar del editor fue, en el fondo, bajar una capa para tener el control que el editor no me daba.

## Markdown as Slides

Lo que más cambió al elegir Reveal no fue el runtime, fue el formato. Mis charlas dejaron de ser un proyecto aparte en una herramienta visual y pasaron a ser archivos `.md` dentro del repo: lo mismo que un post del blog, la misma forma de versionar, los mismos imports.

Viven en una sola Content Collection (`slides` en [`src/content.config.ts`](https://github.com/xergioalex/xergioalex.com/blob/main/src/content.config.ts)), con su propio schema Zod y su propio glob —exactamente como `blog`—. Reveal recibe el cuerpo del archivo en crudo y se encarga de convertirlo en slides; el tema, la transición y el resaltado de sintaxis se declaran en el frontmatter, junto al título y a la fecha del evento.

El mismo frontmatter define cómo se sirve cada deck con un campo `type`: `native` para las charlas que escribo dentro del repo y se renderizan con Reveal, y `external` para las que viven en otro sitio —Google Slides, slides.com, todas las que di antes de tener este sistema— y se muestran como una página con título, descripción, hero y un botón que abre el deck original. Dos situaciones, un solo schema. Migrar un deck de un tipo a otro es cambiar ese campo y nada más, sin mover archivos.

## El renderizado: Reveal lee Markdown nativo

Los decks nativos no necesitan un parser propio. La ruta toma `deck.body` —el Markdown crudo del archivo `.md`— y lo incrusta dentro de un `<textarea>` que Reveal sabe interpretar:

```html
<section data-markdown
  data-separator="^---$"
  data-separator-vertical="^--$">
  <textarea data-template>{deck.body}</textarea>
</section>
```

El plugin de Markdown de Reveal parsea ese contenido al hidratar y lo convierte en elementos `<section>` reales, con fragmentos, auto-animate y resaltado de código intactos.

El trade-off es claro y conviene nombrarlo: el HTML inicial no contiene las slides, así que antes de que el JavaScript corra el deck está vacío. Para evitar el parpadeo, el contenedor arranca en `opacity-0` y solo se hace visible cuando Reveal dispara su evento `ready`. A cambio de ese pequeño costo, gano una flexibilidad de autoría que las alternativas no ofrecían.

## Aislamiento de assets: cero bytes fuera de las slides

Una condición era innegociable: visitar `/`, `/blog`, `/about` o incluso el catálogo en [`/es/slides`](/es/slides) no debe cargar **ni un byte de Reveal.js**. No es purismo de performance. Reveal y su CSS son intrusivos —controlan el tamaño del viewport, el comportamiento del scroll, los atajos de teclado— y si esos estilos se filtran al resto del sitio, las páginas normales se rompen de formas difíciles de diagnosticar.

El grafo de assets por ruta de Astro resuelve esto sin esfuerzo extra. El CSS de Reveal se importa únicamente en [`SlideLayout.astro`](https://github.com/xergioalex/xergioalex.com/blob/main/src/layouts/SlideLayout.astro), y ese layout solo lo usan las rutas de decks nativos. Por lo tanto, los chunks de Reveal aparecen exclusivamente en el HTML de esas páginas. Lo confirmé tras el build buscando referencias a esos chunks en `dist/`: solo las páginas de decks nativos las incluyen; el resto del sitio queda limpio.

## Gemelos AEO: una `.md` por cada `.html`

El sitio tiene una política explícita: cada página HTML debe tener un endpoint `.md` paralelo que sirva `text/markdown`, para que los agentes de IA lean el contenido sin renderizar JavaScript ni parsear HTML. Está documentada en [`docs/aeo/MARKDOWN_FOR_AGENTS.md`](https://github.com/xergioalex/xergioalex.com/blob/main/docs/aeo/MARKDOWN_FOR_AGENTS.md) y se valida con `npm run md:check:strict` durante el build. La razón completa la cuento en mi serie [*AEO: De Invisible a Citado*](/es/blog/series/aeo-from-invisible-to-cited/): cómo construir un sitio que los motores de respuesta de IA puedan encontrar, entender y citar, desde datos estructurados y endpoints markdown hasta scoring de agent-readiness.

Las diapositivas cumplen esa política mediante endpoints `[slug].md.ts`:

- En decks nativos, el gemelo sirve el cuerpo Markdown en crudo. Un agente que lea [`/es/slides/demo-revealjs-features.md`](/es/slides/demo-revealjs-features.md) obtiene el contenido completo en texto legible.
- En decks `external`, sirve un stub estructurado con título, descripción, metadatos del evento y la URL externa.

El resultado es que un agente puede responder *"¿qué charlas ha publicado Sergio sobre DevOps?"* sin abrir un navegador.

## El catálogo

Las charlas tienen su propia página en [`/es/slides`](/es/slides), separada del blog. Es un timeline con scroll infinito: el primer lote llega de entrada y el resto se carga a medida que el visitante baja, así que un catálogo con cien decks no envía cien tarjetas al cargar.

Cada deck aparece con su imagen hero, una etiqueta con el tipo (nativo o externo) y los metadatos del evento. El mismo componente se reutiliza en cualquier superficie del sitio que muestre decks recientes —previews en el homepage, paneles de relacionados.

## Personalización, modos y multilenguaje

Lo que más se nota de haber elegido la librería en lugar de una herramienta cerrada es la maleabilidad. Toda la apariencia de cada deck se controla desde una capa de custom properties en [`src/styles/slides.css`](https://github.com/xergioalex/xergioalex.com/blob/main/src/styles/slides.css): tokens como `--slide-bg`, `--slide-surface` o `--slide-accent`, junto con las variables `--r-*` propias de Reveal. Cambiar un token actualiza al instante cada deck, y adaptar cualquier estilo nuevo —tipografía, paleta de marca, espaciado— se reduce a editar variables, sin tocar la librería.

Esos tokens responden al modo del sitio. Cuando el visitante alterna light y dark, las variables se redefinen y los decks cambian a la par del resto del sitio. No hay un tema "de slides" distinto al del blog ni un toggle aparte; la presentación hereda el modo igual que cualquier post.

Y como los decks viven en una Content Collection con una carpeta por idioma (`src/content/slides/{en,es}/`), tienen gemelos EN/ES igual que un post. El slug se comparte, el frontmatter se traduce, la página individual respeta el idioma del visitante, y los catálogos en [`/slides`](/slides) y [`/es/slides`](/es/slides) muestran cada uno solo los decks de su idioma. Si presento la misma charla en dos eventos —uno en inglés, otro en español— el segundo deck es solo un archivo `.md` más en `es/`.

## Volvemos a la narrativa

Lo que más me convence del resultado no es la arquitectura, es lo que la arquitectura habilita. Si las slides son archivos `.md`, puedo pedirle a un agente que esboce un deck a partir de un outline, que adapte una charla existente para un evento nuevo, que reordene una sección o que la traduzca a otro idioma. Cosas que con un editor visual eran una hora de copy-paste pasan ahora en segundos, sobre archivos versionados y revisables.

Ese es el corazón de slides-as-code: el formato deja de ser un cuello de botella. La librería se encarga de la presentación, el agente acelera la mecánica, y yo paso la mayor parte del tiempo pensando qué quiero contar. No hay un dominio aparte, ni un build aparte, ni un sistema de temas paralelo —y cuando todo eso se quita del camino, queda la única parte que ninguna herramienta puede hacer en mi lugar: decidir qué merece el tiempo de alguien dispuesto a escucharme. Esa sigue siendo la pregunta más difícil del oficio, y por fin puedo dedicarle el tiempo que merece.

## Recursos

- [Notas de la versión de Reveal.js v6](https://github.com/hakimel/reveal.js/releases/tag/6.0.0)
- [Guía de la función de diapositivas](https://github.com/xergioalex/xergioalex.com/blob/main/docs/features/SLIDES.md) — documentación completa de autoría en el repositorio
- [Demo deck en vivo](/es/slides/demo-revealjs-features) — todas las características, layouts y modos de fondo en acción
- [Catálogo de slides](/es/slides) — la página índice dedicada con scroll infinito
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/) — cómo funcionan las collections y los esquemas Zod
