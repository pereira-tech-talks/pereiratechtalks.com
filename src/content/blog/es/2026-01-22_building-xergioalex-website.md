---
title: "Construyendo XergioAleX.com: Cómo construí mi sitio web personal con Astro, Svelte e IA"
description: "La historia de XergioAleX.com: de una landing a una plataforma bilingüe pensada para IA y rendimiento, con Astro + Svelte y arquitectura clara."
pubDate: "2026-01-22"
heroImage: "/images/blog/posts/building-xergioalex-website/hero.webp"
heroLayout: "banner"
tags: ["tech", "web-development", "astro", "svelte", "cloudflare"]
keywords: ["construir sitio web personal con Astro", "Astro y Svelte para sitio estático", "arquitectura sitio personal bilingüe", "Astro islands arquitectura", "sitio web personal con blog integrado", "cómo construí mi web personal con Astro", "Astro Svelte TypeScript Tailwind"]
series: "building-xergioalex"
seriesOrder: 1
---

Durante años, mi sitio web personal fue una sola página. Una foto de perfil, mi nombre, "Full Stack Developer" y una fila de iconos de redes sociales. Eso era todo. Dirigía a la gente a mi GitHub, Twitter, Instagram y LinkedIn. Funcionaba — de la misma forma en que una nota adhesiva en una puerta "funciona" como cartel de bienvenida.

Pero con el tiempo las cosas fueron cambiando. Empecé a construir [DailyBot](https://www.dailybot.com), a dar charlas sobre [Astro](/es/blog/astro-in-action/), [arquitecturas serverless](/es/blog/introduction-to-serverless-iot/) e [IA](/es/blog/rebirth-of-artificial-intelligence/), a contribuir en comunidades como [Pereira Tech Talks](https://www.pereiratechtalks.org/), a escribir, a experimentar con trading y hardware. Y esa página con una foto y cinco enlaces ya no representaba nada de eso.

Así que decidí construir uno de verdad.

---

## El sitio anterior

Esto es lo que tuve durante mucho tiempo:

<figure>
<img src="/images/blog/posts/building-xergioalex-website/old-site.webp" alt="Mi antiguo sitio web personal — una landing simple con foto de perfil, nombre y enlaces sociales" loading="lazy" />
<figcaption>El sitio anterior — una foto, un título y seis links de iconos. Funcional, pero sin nada sobre DailyBot, charlas, proyectos open source ni una década de trabajo.</figcaption>
</figure>

Súper simple. Solo una foto y enlaces a mis redes. Cumplía su función, pero no reflejaba el alcance de todo lo que había estado construyendo — DailyBot (un producto respaldado por Y Combinator), Pereira Tech Talks, proyectos open source, docenas de charlas técnicas, artículos, experimentos de trading, proyectos de hardware. Quería un lugar que pudiera contener todo eso y aun así sentirse rápido, limpio y fácil de mantener.

No quería un template. Quería algo construido desde cero — algo que representara tanto mi enfoque técnico como mi marca personal.

---

## La marca se encuentra con el código

Antes de construir el sitio, ya había invertido en algo importante: [mi marca personal](/es/blog/personal-branding-xergioalex/). Trabajando con el diseñador **Koru** (Daniel Vasquez Correa), desarrollé la identidad del **Ninja Coder** — una marca con un sistema visual completo, desde el personaje ninja con `<>` en la frente hasta las X shuriken en el logotipo, además de una paleta de colores cuidadosamente definida.

Esa marca estaba guardada en un repositorio, esperando un hogar real. Construir este sitio web fue la oportunidad de darle vida. El azul profundo del ninja se convirtió en la base del tema oscuro. El rojo intenso de la marca se convirtió en el color de acento que ves en los botones, los enlaces y los detalles interactivos. La cara del ninja se convirtió en el favicon. El logo horizontal se convirtió en lo que ves arriba en el header.

Básicamente, toda la identidad visual del sitio nació de esa marca. No fue "inspirado en" — fue construido directamente sobre ella. Los colores, la tipografía, el tono general, hasta las variantes de modo oscuro y claro. Todo viene de ahí.

---

## Por qué Astro

Revisé Next.js, Gatsby, Hugo, Eleventy — todos son capaces. Pero [Astro](https://astro.build) ganó porque se ajustaba a lo que realmente necesitaba: un sitio personal centrado en contenido que debería ser mayormente estático, rápido y fácil de extender.

### Cero JavaScript por defecto

Esta es la feature estrella de Astro. A diferencia de frameworks basados en React que envían un runtime completo al navegador, Astro genera **HTML estático puro** en tiempo de build. No se envía JavaScript al cliente a menos que lo pidas explícitamente. Para un sitio personal y blog, la mayoría de las páginas son solo contenido — no necesitan un runtime de JavaScript. El resultado: páginas que cargan en milisegundos, no en segundos.

### Arquitectura de islas

Cuando *sí* necesitas interactividad — una barra de búsqueda, un menú de navegación, un toggle de tema — Astro usa una **arquitectura de islas**. Cada componente interactivo es una isla autónoma que se hidrata independientemente. El resto de la página permanece como HTML estático. Tú controlas exactamente cuándo y cómo se carga cada isla:

- `client:load` — Hidratar inmediatamente (para UI crítica como la navegación)
- `client:visible` — Hidratar solo cuando el componente aparece en pantalla
- `client:idle` — Hidratar cuando el navegador está inactivo

Esto significa que puedo tener una página con 95% de contenido estático y un componente de búsqueda interactivo, y solo ese componente envía JavaScript. Todo lo demás es HTML con costo cero.

### Content Collections

Astro tiene un sistema de primera clase para gestionar contenido estructurado. Los posts del blog se definen con **esquemas Zod** que validan el frontmatter en tiempo de build — título, descripción, fecha de publicación, imagen hero, variante de layout, tags. Si a un post le falta un campo requerido o tiene el tipo incorrecto, el build falla inmediatamente. Sin sorpresas en runtime.

```typescript
const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    heroImage: z.string().optional(),
    heroLayout: z.enum(['banner', 'side-by-side', 'minimal', 'none']).default('banner'),
    tags: z.array(z.string()).optional(),
  }),
});
```

Esto da type safety a lo largo de todo el pipeline de contenido — desde archivos Markdown hasta props de componentes y páginas renderizadas.

### Todo incluido

Routing, layouts, soporte MDX, optimización de imágenes, generación de sitemap, feeds RSS — Astro maneja todo esto directamente o a través de integraciones oficiales. No necesité conectar una docena de paquetes independientes. Un framework, una configuración, un comando de build.

---

## Por qué Svelte (y por qué es el complemento perfecto para Astro)

Astro es **agnóstico de UI** — puedes usar React, Vue, Svelte, Solid o HTML plano para tus componentes interactivos. Elegí [Svelte](https://svelte.dev) y resultó ser el complemento perfecto.

### Compilado, no runtime

La filosofía central de Svelte es un espejo de la de Astro: **hacer el trabajo en tiempo de build, no en runtime**. Mientras React envía un motor de diffing de DOM virtual al navegador de cada usuario, Svelte compila tus componentes en operaciones DOM mínimas y quirúrgicas durante el build. La salida es JavaScript vanilla — sin overhead de framework, sin DOM virtual, sin librería de runtime.

Para un sitio Astro que ya envía cero JavaScript por defecto, esto importa enormemente. Cuando *sí* necesito una isla interactiva, Svelte asegura que esa isla sea lo más pequeña posible. El componente de búsqueda del blog, el header de navegación, el lightbox de imágenes — todos compilan a bundles diminutos.

### Verdaderamente reactivo con menos código

Svelte 5 (que este sitio usa en la versión `5.50`) introdujo **runes** — un sistema de reactividad dirigido por el compilador que es más potente e intuitivo que versiones anteriores. El manejo de estado es directo:

```svelte
<script>
  let searchQuery = $state('');
  let results = $derived(posts.filter(p => p.title.includes(searchQuery)));
</script>
```

Sin `useState`, sin `useEffect`, sin arrays de dependencias. El compilador descubre qué depende de qué y genera el código de actualización mínimo. Para componentes interactivos en un sitio de contenido, esta simplicidad es una ventaja real — menos código significa menos bugs y mantenimiento más fácil.

### Bundle pequeño, gran impacto

Los componentes Svelte compilan a un promedio de **30-40% menos JavaScript** que componentes React equivalentes. En un sitio donde cada kilobyte de JavaScript es intencional (gracias al zero-JS por defecto de Astro), esta diferencia es significativa. Toda la capa interactiva de XergioAleX.com — 15 componentes Svelte cubriendo búsqueda, navegación, lightbox, timelines y más — compila a una fracción de lo que pesaría un solo runtime de React.

### Qué alimenta Svelte en este sitio

Esto es exactamente donde Svelte trae interactividad a un sitio que de otra forma sería estático:

- **`Header.svelte`** — Navegación sticky con menús dropdown, selector de idioma y comportamiento responsive. Usa el patrón de disclosure para accesibilidad (no `role="menu"`).
- **`MobileMenu.svelte`** — Drawer de navegación móvil animado con transiciones suaves de apertura/cierre.
- **`StaticBlogSearch.svelte`** — El orquestador del listado del blog. Carga lazy un índice de búsqueda Fuse.js vía `requestIdleCallback`, implementa búsqueda con debounce y cache de resultados, y gestiona paginación en modos de navegación y búsqueda.
- **`BlogCard.svelte`** — Tarjetas de posts con switching de fuente WebP, renderizado de highlights de búsqueda y carga lazy de imágenes.
- **`BlogImageLightbox.svelte`** — Visor de imágenes completo usando el elemento nativo `<dialog>` para accesibilidad (captura de foco, tecla Escape), navegación prev/next y soporte para swipe táctil. Hidratado con `client:idle` para que no cueste nada en la carga inicial.
- **`PortfolioTimeline.svelte`**, **`TechTalksTimeline.svelte`**, **`TradingTimeline.svelte`**, **`DailyBotTimeline.svelte`** — Timelines interactivos para diferentes secciones del portafolio.

Cada uno de estos usa la directiva de hidratación más ligera que funcione. El lightbox usa `client:idle`. El header usa `client:load` porque la navegación necesita ser interactiva inmediatamente. Este control granular es lo que hace que la combinación Astro + Svelte sea tan potente.

---

## El conjunto completo de funcionalidades

Lo que empezó como "necesito una landing mejor" evolucionó a una plataforma personal completa. Esto es lo que XergioAleX.com hace hoy:

### Bilingüe (inglés y español)

Cada página existe en ambos idiomas con paridad completa de rutas. Inglés vive en `/` y español en `/es/`. El sistema i18n está arquitecturado para escalar — agregar un tercer idioma requiere cero cambios en componentes existentes:

1. Agregar el código de idioma a un tipo union de TypeScript
2. Crear un archivo de traducciones (~950 líneas de cadenas UI)
3. Crear thin page wrappers (archivos de 3 líneas que pasan `lang="pt"`)
4. Crear un directorio de contenido para el blog

El sistema de traducciones cubre **todo** — navegación, footer, las 12 páginas especializadas, UI del blog (búsqueda, paginación, tiempo de lectura, tags), páginas de error. Incluso cadenas dinámicas como "3 resultados encontrados" y "Página 2 de 5" se traducen mediante funciones que reciben parámetros.

### Modo oscuro

Detección de tema según el sistema con toggle manual y persistencia en localStorage. La implementación previene el temido "flash del tema equivocado" al cargar, inlineando el script de tema en el `<head>` del HTML. Tanto el tema claro como el oscuro están diseñados alrededor de la paleta de la marca Ninja Coder.

### Sistema de blog

El blog es el corazón del sitio, construido sobre Content Collections de Astro con Markdown y MDX:

- **36+ posts** en cada idioma, abarcando una década de escritura técnica (2016-2026)
- **Cuatro layouts hero** — `banner` (ancho completo), `side-by-side` (columnas imagen + título), `minimal` (miniatura), `none` (solo texto) — elegidos según la proporción de la imagen
- **Filtrado por tags** con páginas dedicadas por tag
- **Búsqueda en cliente** impulsada por Fuse.js con matching difuso, input con debounce, cache de resultados (hasta 50 entradas) y renderizado de highlights de búsqueda
- **Paginación** a 30 posts por página, funcionando en modos de navegación y búsqueda
- **Posts relacionados** puntuados por cantidad de tags compartidos con fallback a posts más recientes
- **Estimación de tiempo de lectura** que elimina bloques de código y sintaxis markdown antes de contar palabras (200 palabras/minuto)
- **Feeds RSS** en ambos idiomas, excluyendo automáticamente posts demo
- **Lightbox de imágenes** para imágenes inline con navegación por teclado y swipe táctil

### Secciones especializadas del portafolio

Más allá del blog, el sitio tiene secciones dedicadas con timelines interactivos:

- **DailyBot** — La historia de construir una plataforma de colaboración asincrónica impulsada por IA
- **Tech Talks** — Historial de presentaciones y eventos comunitarios
- **Portafolio** — Proyectos y trabajo técnico
- **Trading** — Diario de trading y experimentos
- **Emprendedor**, **Maker**, **Hobbies**, **Foodie** — Otras facetas de la vida

Cada sección usa un patrón compartido de componente timeline en Svelte, manteniendo el codebase DRY mientras permite personalización por sección.

### SEO y datos estructurados

Cada página incluye:

- URLs canónicas con tags `hreflang` para todas las variantes de idioma (más `x-default`)
- Meta tags Open Graph con imágenes de 1200x630
- Markup de Twitter Card (`summary_large_image`)
- **Tres esquemas JSON-LD por página**: `WebSite`, `Person` (con links `sameAs` a GitHub, LinkedIn, X, Instagram) y `Organization` (DailyBot)
- XML sitemap (auto-generado, filtrado para excluir páginas internas)
- SEO de paginación (`rel="prev"` / `rel="next"`)
- `robots.txt` y `llms.txt` para descubrimiento por máquinas

### Accesibilidad

El sitio apunta a **cumplimiento WCAG 2.1 AA** y una **puntuación de Accesibilidad Lighthouse de 100**:

- Todo el texto cumple ratio de contraste 4.5:1 (pares de colores aprobados y documentados)
- Cada imagen tiene atributos explícitos `width` y `height` para prevenir layout shifts
- HTML semántico con jerarquía de encabezados correcta
- Elementos interactivos navegables por teclado
- Patrones ARIA: disclosure para dropdowns, `role="progressbar"` para barras de habilidades
- `font-display: swap` para fuentes personalizadas (Atkinson Hyperlegible)

---

## Deep dive en la arquitectura

### El patrón Page Wrapper

Una de las decisiones arquitectónicas clave: **cada página es un thin wrapper de 3 líneas**. La lógica real, layout, metadatos SEO y contenido viven dentro de componentes `*Page.astro` compartidos en `src/components/pages/`. Los wrappers en `src/pages/` solo manejan el routing y pasan un string literal `lang`:

```astro
---
// src/pages/about.astro (Inglés)
import AboutPage from '@/components/pages/AboutPage.astro';
---
<AboutPage lang="en" />
```

```astro
---
// src/pages/es/about.astro (Español)
import AboutPage from '@/components/pages/AboutPage.astro';
---
<AboutPage lang="es" />
```

Esto significa que el contenido, las traducciones y el layout de cada página existen en **un solo lugar**. Agregar un nuevo idioma significa agregar un nuevo wrapper de 3 líneas — sin cambios en componentes, sin duplicación de lógica. El sitio actualmente tiene 52 archivos de página pero solo 13 componentes de página distintos.

### Arquitectura de rendimiento

El rendimiento no es una feature — es un valor arquitectónico central:

- **`build.inlineStylesheets: 'always'`** — Todo el CSS se inlinea directamente en el HTML, eliminando por completo las peticiones de hojas de estilo que bloquean el renderizado
- **Cache agresivo vía Cloudflare** — Assets hasheados obtienen cache inmutable de 1 año, fuentes 1 año, imágenes 30 días, HTML siempre revalida
- **Pipeline de generación WebP** — Un paso de prebuild genera automáticamente variantes WebP para todas las imágenes (homepage, blog compartidas y por post) usando Sharp
- **Precarga de fuentes** — Los archivos woff de Atkinson Hyperlegible se precargan en el `<head>` con `font-display: swap`
- **Lazy loading en todos lados** — Las imágenes below-fold usan `loading="lazy"`, las islas Svelte usan `client:visible` o `client:idle`
- **Cero JS bloqueante** — La detección de tema es el único script inlineado, y es diminuto

### Pipeline de optimización de imágenes

Las imágenes pasan por un flujo de staging dedicado construido con **Sharp**:

1. Soltar imágenes crudas en `public/images/blog/_staging/` con la convención `{slug}--{nombre}.{ext}`
2. Ejecutar `npm run images:optimize`
3. El script auto-detecta presets por proporción: heroes se redimensionan a 1400x700, imágenes cuadradas a 800x800, imágenes inline a 1200px de ancho
4. Calidad JPEG 80, conversión PNG-a-JPEG a calidad 85, WebP opcional a calidad 80
5. Los outputs se mueven a `public/images/blog/posts/{slug}/`

El paso de prebuild (`npm run prebuild`) luego genera variantes WebP para todas las imágenes del blog automáticamente antes de cada build de producción.

### Testing

El proyecto usa **Vitest** con **@testing-library/svelte** para testing:

- Tests unitarios para utilidades del blog (slugs de posts, paginación, filtrado, tiempo de lectura)
- Tests unitarios para el sistema i18n (detección de idioma, generación de URLs, manejo de locales)
- Tests unitarios para el sistema de traducciones (completitud, paridad de keys entre idiomas)
- Tests unitarios para la API de búsqueda (serialización de posts, filtrado de demos)
- Tests de componentes para componentes Svelte (renderizado de BlogCard, comportamiento de BlogPagination)
- Objetivo de cobertura: 80%+ en `src/lib/`

---

## Una web generativa: construida para humanos e IA

Uno de los objetivos de diseño que hace único a este proyecto: el sitio es **generativo** — estructurado para ser descubierto, leído y extendido tanto por humanos como por sistemas de IA.

### Descubrimiento legible por máquinas

- **`llms.txt`** — Un resumen legible por máquinas del sitio en la raíz, siguiendo el estándar emergente para sitios web amigables con LLMs. Incluye estructura del sitio, información del autor y un enlace a `llms-full.txt` para la versión completa.
- **JSON-LD en cada página** — Tres esquemas de datos estructurados (Person, WebSite, Organization) para que motores de búsqueda y sistemas de IA puedan extraer información estructurada.
- **HTML semántico en todo el sitio** — Jerarquía correcta de encabezados, elementos landmark y tags semánticos que hacen el contenido parseable.

### El sistema AGENTS.md

Todo el repositorio está documentado a través de **`AGENTS.md`** — una fuente única de verdad para todos los asistentes de código IA (Claude Code, Cursor AI, GitHub Copilot, Codex, Gemini). Contiene:

- Patrones de arquitectura con ejemplos de código
- Estándares de código obligatorios y convenciones de importación
- Reglas de sincronización multilingüe
- Requisitos de rendimiento y accesibilidad
- Errores comunes a evitar (28 "no hacer", 28 "hacer")
- Una checklist de pre-commit

Esto significa que cualquier agente de IA puede tomar el proyecto y contribuir siguiendo los mismos estándares. La documentación está diseñada para escalar con el proyecto.

### Sistema de skills y agents

Más allá de la documentación, el repositorio incluye un sistema completo de **Skills y Agents** — procedimientos reutilizables y personas especializadas que los asistentes de IA pueden invocar:

**14 Skills** (slash commands): `quick-fix`, `add-blog-post`, `translate-sync`, `write-tests`, `fix-lint`, `type-fix`, `refactor-safe`, `security-check`, `add-page`, `add-component`, `update-styles`, `doc-edit`, `git-commit-push`, `pr-review-lite`

**6 Agents** (trabajadores especializados): `architect` (diseño de sistemas), `content-writer` (posts de blog), `executor` (implementación de tareas), `reviewer` (revisión de código), `i18n-guardian` (calidad de traducciones), `security-auditor` (auditoría de seguridad)

Cada skill y agente tiene un tier de modelo definido (barato/estándar/frontier) para optimizar costo y latencia. El resultado: los asistentes de IA pueden crear posts de blog, sincronizar traducciones, ejecutar auditorías de seguridad y revisar código — todo siguiendo los estándares del proyecto automáticamente.

### Hub interno de desarrollo

El sitio incluye un **Hub Interno solo para desarrollo** en `/internal/` con 17 páginas a través de tres pilares:

- **Design System UI** (11 páginas) — Referencia visual para colores, tipografía, espaciado, radio, botones, badges, tarjetas, formularios, layouts y tokens de marca
- **Guía del Staff** (4 páginas) — Documentación del tech stack, estructura de archivos, convenciones de nombres y guías de rendimiento
- **Sitemap auto-generado** — Descubrimiento en tiempo de build de todas las páginas del sitio

El hub se excluye automáticamente de los builds de producción mediante un sistema de tres capas: un hook de eliminación post-build, filtrado del XML del sitemap y meta tags `noindex`. Existe puramente como referencia para desarrolladores y agentes de IA que trabajan en el proyecto.

---

## El stack tecnológico

| Capa | Tecnología | Versión | Rol |
|------|-----------|---------|-----|
| Framework | [Astro](https://astro.build) | 5.17 | Generación de sitio estático, routing, content collections |
| UI interactiva | [Svelte](https://svelte.dev) | 5.50 | 15 componentes de islas interactivas |
| Estilos | [Tailwind CSS](https://tailwindcss.com) | 4.1 | Estilos utility-first con modo oscuro vía plugin Vite |
| Contenido | Markdown + MDX | — | Posts de blog con formato enriquecido |
| Type safety | [TypeScript](https://www.typescriptlang.org) | 5.9 | Verificación de tipos de punta a punta |
| Linting | [Biome](https://biomejs.dev) | 2.3 | Linter y formateador rápido (reemplazó ESLint + Prettier) |
| Búsqueda | [Fuse.js](https://www.fusejs.io) | 7.1 | Búsqueda difusa en cliente |
| Imágenes | [Sharp](https://sharp.pixelplumbing.com) | 0.34 | Optimización de imágenes en build y generación WebP |
| Testing | [Vitest](https://vitest.dev) | 4.0 | Tests unitarios y de componentes |
| Hosting | [Cloudflare Pages](https://pages.cloudflare.com) | — | CDN global con despliegues automáticos |

El despliegue está completamente automatizado: cada push a `main` dispara un build de Cloudflare Pages. El pipeline ejecuta `astro check` (validación TypeScript), genera imágenes WebP y construye HTML estático. Cloudflare sirve la carpeta `dist/` desde su red edge global. El sitio está en vivo en [xergioalex.com](https://xergioalex.com) en minutos después de un push.

---

## De una página a una plataforma

Pasar de una landing con una foto y cinco enlaces sociales a una plataforma personal completa, bilingüe y preparada para IA fue una decisión deliberada. Quería un lugar que pudiera crecer con mi trabajo — más proyectos, más posts, más idiomas, más ideas — sin convertirse en una carga de mantenimiento.

Astro hizo posible la base. Svelte hizo que las partes interactivas fueran livianas. Juntos son difíciles de superar para sitios centrados en contenido — HTML estático con la riqueza de componentes modernos, y solo pagas por la interactividad donde la necesitas.

La marca le dio un alma. La arquitectura preparada para IA le dio un futuro. El código es abierto.

**Repositorio:** [xergioalex/xergioalex.com](https://github.com/xergioalex/xergioalex.com)
**Sitio en vivo:** [xergioalex.com](https://xergioalex.com)
**Assets de marca:** [xergioalex/personal-branding](https://github.com/xergioalex/personal-branding)

A seguir construyendo.
