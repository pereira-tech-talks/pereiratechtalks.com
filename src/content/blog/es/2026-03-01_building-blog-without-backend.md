---
title: 'Arquitectura de un Blog Escalable Sin Backend'
description: 'Cómo escala el blog sin backend: Content Collections, taxonomía de tags, búsqueda en el cliente, series y builds bilingües en Astro.'
pubDate: '2026-03-01'
heroImage: '/images/blog/posts/building-blog-without-backend/hero.webp'
heroLayout: 'side-by-side'
tags: ["tech", "web-development", "astro", "svelte"]
keywords: ["blog estático sin backend", "arquitectura de blog con Astro Content Collections", "búsqueda de blog del lado del cliente", "sistema de tags para blog Astro", "blog bilingüe con Astro", "series de posts en Astro", "blog escalable sin servidor"]
series: "building-xergioalex"
seriesOrder: 5
---

Tener un sitio no es lo mismo que tener un blog. Un sitio es un conjunto de páginas. Un blog es un sistema — posts que necesitan ser descubiertos, filtrados, buscados, agrupados, relacionados entre sí, y servidos a lectores en múltiples idiomas. Con un puñado de posts, eso es trivial. A medida que la biblioteca crece, empiezas a sentir la estructura. Con cientos de posts, la arquitectura aguanta o no aguanta.

El sitio estaba [construido](/es/blog/building-xergioalex-website/), [rápido](/es/blog/lighthouse-perfect-scores/) y [medido](/es/blog/measuring-what-matters-free-analytics/). Ahora necesitaba un motor de blog que pudiera escalar sin un servidor.

Así es como lo construí.

---

## Content Collections: La Capa de Datos del Blog

Content Collections es la columna vertebral. Concepto simple: en lugar de archivos Markdown que parseas manualmente, los posts son entradas en una colección tipada y validada con esquema que Astro consulta en tiempo de build.

Así se ve el esquema:

```typescript
// src/content.config.ts
const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    heroLayout: z.enum(['banner', 'side-by-side', 'minimal', 'none'])
      .default('banner')
      .optional(),
    tags: z.array(z.string()).optional(),
    series: z.string().optional(),
    seriesOrder: z.number().optional(),
  }),
});
```

[Zod](https://zod.dev/) valida cada post en tiempo de build. Si un post no tiene `title`, o si `pubDate` está mal formado, o si `heroLayout` recibe un valor que no está en el enum, el build falla inmediatamente con un mensaje de error claro. Sin sorpresas en runtime. Sin posts con fechas rotas llegando a producción porque nadie se dio cuenta.

Consultar posts se ve así:

```typescript
import { getCollection } from 'astro:content';

const posts = await getCollection('blog', ({ id }) => !id.includes('/_demo/'));
```

El resultado es un array tipado. Cada elemento tiene `post.data.title`, `post.data.pubDate`, `post.data.tags` — todos correctamente tipados basándose en el esquema Zod. TypeScript captura un typo como `post.data.titel` en tiempo de compilación, no en runtime en una página en vivo.

Y por eso funciona a escala — la estructura no te deja cometer errores sin que el build te avise.

### Naming de archivos como metadato

Los posts usan una convención de naming con prefijo de fecha: `YYYY-MM-DD_slug.md`. El archivo `2026-03-01_building-blog-without-backend.md` que estás leyendo ahora mismo es un ejemplo directo.

Esto no fue una decisión al azar. Necesitaba que los archivos tuvieran un orden natural en el sistema de archivos — cuando abro el directorio `en/`, quiero ver los posts en orden cronológico sin tener que pensarlo. Pero más importante aún, necesitaba un esquema de nombres que no se rompiera a medida que el blog creciera.

La alternativa obvia eran prefijos numéricos: `001_primer-post.md`, `002_segundo-post.md`, y así sucesivamente. Eso funciona con diez posts. Con cincuenta, todavía funciona. Pero ¿qué pasa cuando quiero agregar un post de 2015 entre dos entradas existentes? Tendría que renumerar cada archivo posterior. Con cien posts, eso es molesto. Con mil, es una locura. Y cada rename significa actualizar referencias, romper el historial de git, y potencialmente introducir errores.

Las fechas resuelven esto completamente. Un post de noviembre de 2015 es `2015-11-27_music-library-php-my-first-website.md`. Un post de marzo de 2026 es `2026-03-01_building-blog-without-backend.md`. Se ordenan solos. Si publico tres posts el mismo día, solo elijo la fecha correcta y el slug hace el resto. Si agrego un post antiguo, se ubica en la posición correcta automáticamente. Sin renombrar, sin cambios en cascada, sin coordinación.

Una función utilitaria llamada `getPostSlug()` elimina el prefijo de fecha para generar URLs limpias — así que `/blog/building-blog-without-backend/` es lo que ven los lectores, no `/blog/2026-03-01_building-blog-without-backend/`. La fecha es metadato para el sistema de archivos, no para el lector.

La estructura de directorios bilingüe replica esto exactamente:

```
src/content/blog/
├── en/
│   └── 2026-03-01_building-blog-without-backend.md
└── es/
    └── 2026-03-01_building-blog-without-backend.md
```

Mismo slug, misma fecha, dos idiomas. Vuelvo a cómo funciona el lado bilingüe más adelante.

---

## El Sistema de Blog: Qué Se Computa en Tiempo de Build

El sistema de blog está compuesto de varias piezas interconectadas. Todas tienen algo en común: cada cómputo ocurre en tiempo de build, y el navegador recibe HTML pre-renderizado.

### Listado, paginación y filtrado

La página de listado del blog muestra posts ordenados por fecha de publicación, más reciente primero. La paginación los divide en grupos de nueve. El filtrado por tag permite a los lectores ver todos los posts bajo un tag dado — `/es/blog/tag/python/` muestra solo los posts de Python. Los artículos relacionados al final de cada post muestra los tres más temáticamente similares basándose en tags compartidos.

Nada de esto involucra una consulta a un servidor. Cuando llegas a `/es/blog/page/2/`, Astro pre-generó esa página en tiempo de build. Cuando llegas a `/es/blog/tag/python/`, Astro ya ejecutó el filtro y generó esa página. Las rutas dinámicas en Astro son un concepto de build-time — el `[page]` y `[tag]` en los nombres de archivos le dicen a Astro que genere una página estática por cada valor, computado por `getStaticPaths()`.

```typescript
// src/pages/blog/tag/[tag].astro
export async function getStaticPaths() {
  const posts = await getPublishedBlogPosts();
  const allTags = [...new Set(posts.flatMap((p) => p.data.tags ?? []))];
  return allTags.map((tag) => ({ params: { tag } }));
}
```

Cada tag que existe en cualquier post obtiene una página. Si publico un post mañana con un tag nuevo, el próximo deploy genera la página de ese tag. Cero configuración necesaria.

### Tiempo de lectura

El encabezado de cada post muestra un tiempo de lectura estimado. Esto se computa en tiempo de build contando las palabras del cuerpo del post y dividiendo por una velocidad de lectura promedio. Para cuando el HTML llega al navegador, es solo un string: "8 min de lectura." Sin cómputo del lado del cliente, sin JavaScript requerido.

### Layouts de imagen hero

Los posts soportan cuatro layouts hero: `banner` (imagen de ancho completo sobre el título), `side-by-side` (imagen a la derecha, título a la izquierda, apilamiento responsive), `minimal` (miniatura pequeña), y `none` (solo texto, como este post). El layout es un campo de frontmatter que los componentes leen en tiempo de build. Elegir el layout correcto para el aspect ratio de la imagen hero — las imágenes paisaje obtienen `banner`, las cuadradas obtienen `side-by-side` — hace que cada post se vea intencional en lugar de torpe.

### Posts relacionados

Al final de cada post, aparecen tres artículos relacionados. La selección no es aleatoria y no son "los más recientes" — usa un algoritmo de puntuación ponderada que entiende la taxonomía de tags:

```typescript
for (const tag of postTags) {
  if (tags.includes(tag)) {
    const tier = tierMap.get(tag) || 'primary';
    // Match de tag primario = 2 puntos, secundario/subtopic = 1 punto
    score += tier === 'primary' ? 2 : 1;
  }
}
```

Un match de tag primario (como `tech`) vale el doble que un match de tag secundario (como `python`). Dos posts que comparten `tech` y `python` puntúan más alto que dos posts que solo comparten `python` — la similitud a nivel de sección pesa más que la coincidencia a nivel de tema. Los tres con mayor puntaje, con desempate por más reciente, aparecen como posts relacionados.

Como todo lo demás en este sistema, la puntuación se calcula en tiempo de build. El navegador recibe tres tarjetas HTML pre-seleccionadas. Sin llamada a API, sin motor de recomendación, sin cookies de tracking.

### Posts demo

Una pieza más del sistema de contenido que vale la pena mencionar: los posts demo. Son posts de referencia estructural almacenados en directorios `_demo/` (`src/content/blog/en/_demo/`, `src/content/blog/es/_demo/`) que muestran las features del blog — variaciones de layouts hero, capacidades MDX, formato enriquecido, resaltado de código en múltiples lenguajes.

Los posts demo nunca se muestran en los listados del blog, páginas de tags, feeds RSS ni resultados de búsqueda. Se filtran a nivel de consulta con un simple check `!id.includes('/_demo/')`. En producción, son completamente invisibles. En dev local, solo son accesibles por URL directa. Existen para que yo — y cualquier agente de IA que contribuya a este sitio — pueda verificar cómo se renderiza una feature específica sin contaminar el blog real con contenido de prueba.

---

## Organizando el Contenido: La Taxonomía de Tags

Aquí es donde las cosas se ponen interesantes. Cuando lancé el blog, empecé con un puñado de tags de nivel superior: `tech`, `personal`, `portfolio`, `talks`, `trading`, `dailybot`. Seis cajones. Suficientemente claro.

A medida que el contenido creció, cada post técnico terminó etiquetado como `tech`. Eso incluía Django, MongoDB, Webpack, WebVR, GraphQL, Golang, Meteor.js, Docker, blockchain, TensorFlow, Spark y el propio sitio de Astro. Hacer clic en `tech` devolvía todo lo que había escrito sobre cualquier tema técnico. Lo que es tan útil como una biblioteca que pone todos los libros bajo "No Ficción."

Con cientos de posts, esa estructura plana se vuelve genuinamente inutilizable.

### Primer intento: un campo `topics` separado

La solución obvia era la obvia: agregar un segundo campo en el frontmatter.

```yaml
# Enfoque inicial — campos separados
tags: ["tech"]
topics: ["python", "database"]
```

Actualicé el esquema con un enum validado para los valores de topics, migré todos los posts existentes, y actualicé los componentes para renderizar los badges de topics de manera diferente a los de tags primarios. Funcionó. Un post etiquetado `python` ahora era descubrible por cualquiera que buscara contenido de Python, aunque la palabra "python" no apareciera en el título.

Para un blog pequeño, esto está perfectamente bien. Pero seguí pensando hacia dónde iba.

A medida que el blog evolucionó, empecé a ver las grietas.

El primer problema era la extensibilidad. Con el enfoque de enum, agregar un nuevo topic significaba editar `content.config.ts` — un cambio de código, no un cambio de contenido. Para un sistema construido alrededor de contenido-como-datos, eso se sentía mal.

El segundo problema era la pobreza de metadatos. Cada topic era solo un string en un enum. No había donde guardar una descripción, un orden de visualización, o una relación padre. Si quería construir una página `/es/blog/tag/python/` con una descripción curada y una lista de topics relacionados, no tenía donde poner esa información.

El tercer problema era el arquitectónico de fondo: la información de nivel vivía en el lugar equivocado. Si `python` era primario o secundario estaba codificado en qué array aparecía en cada post individual. ¿Entender la estructura de la taxonomía? Hay que leer miles de archivos frontmatter. Ese tipo de definición distribuida diverge silenciosamente con el tiempo.

Y luego la pregunta que me hago sobre cada decisión de arquitectura: ¿qué pasa si tengo 1000 posts?

Con 1000 posts, una migración porque agregué un valor nuevo al enum es un costo real. Con 1000 posts, definiciones de nivel dispersas en miles de archivos es un problema de mantenimiento. Volví a la mesa de diseño.

### La arquitectura de colección unificada

El insight clave: **el nivel del tag es una propiedad del tag, no una propiedad del post.**

`python` es un topic secundario no por cómo cualquier post individual lo usa, sino porque eso es lo que `python` *es* en esta taxonomía. La definición de nivel debería vivir con la definición propia del tag, no distribuida en cada post que lo usa.

Esta es la arquitectura que tengo ahora. Cada blog post usa un solo array `tags`:

```yaml
# src/content/blog/en/2018-12-01_django-multiple-databases-university.md
---
tags: ["tech", "portfolio", "python", "database", "university"]
---
```

El post no sabe ni le importa a qué nivel pertenece cada tag. Solo lista las etiquetas que lo describen.

La información de nivel vive en una Content Collection `tags` separada — un archivo markdown por tag:

```yaml
# src/content/tags/python.md
---
name: "python"
description: "Python ecosystem — Django, TensorFlow, MyPy, Spark."
tier: secondary
order: 6
parent: "tech"
---
```

```yaml
# src/content/tags/tech.md
---
name: "tech"
description: "Tutorials, guides, and technical articles."
tier: primary
order: 1
---
```

El esquema de la colección valida la estructura:

```typescript
const tags = defineCollection({
  schema: z.object({
    name: z.string(),
    description: z.string().optional(),
    tier: z.enum(['primary', 'secondary', 'subtopic']).default('primary'),
    parent: z.string().optional(),
    order: z.number().default(0),
  }),
});
```

Tres niveles: `primary` para secciones (tech, personal, portfolio), `secondary` para temas (python, database, web-development, devops), `subtopic` para granularidad futura (django, tensorflow, mongodb — ya en el esquema pero sin poblar todavía). Agregar un tag nuevo significa crear un archivo. Sin migraciones. Sin cambios de enum. Sin revisión de código por una decisión de contenido.

### Dividiendo tags en tiempo de build

Los componentes necesitan distinguir tags primarios de secundarios para renderizarlos diferente. Esa división ocurre en tiempo de build mediante `groupPostTags()` en `src/lib/blog.ts`:

```typescript
export async function groupPostTags(
  tags: string[]
): Promise<{ primaryTags: string[]; topicTags: string[] }> {
  const tierMap = await getTagTierMap();
  const primaryTags: string[] = [];
  const topicTags: string[] = [];
  for (const tag of tags) {
    const tier = tierMap.get(tag) || 'primary';
    if (tier === 'secondary' || tier === 'subtopic') {
      topicTags.push(tag);
    } else {
      primaryTags.push(tag);
    }
  }
  return { primaryTags, topicTags };
}
```

El mapa de niveles se construye una vez por build y queda cacheado en memoria — `getCollection('tags')` corre una sola vez al arrancar, y cada llamada posterior devuelve el mapa en memoria. Búsqueda O(1). Los componentes reciben `primaryTags` y `topicTags` como arrays ya ordenados.

### Validación de jerarquía en tiempo de build

Lo que no quería era drift silencioso — que el padre de un tag se renombrara y los posts terminaran con relaciones huérfanas sin que nadie lo notara. `validateTagHierarchy()` captura estos casos en tiempo de build:

```typescript
async function validateTagHierarchy(): Promise<void> {
  if (_hierarchyValidated) return;
  _hierarchyValidated = true;

  const allTags = await getCollection('tags');
  const tagNames = new Set(allTags.map((t) => t.data.name));

  for (const tag of allTags) {
    if (tag.data.parent && !tagNames.has(tag.data.parent)) {
      console.warn(
        `[tag-validation] Tag "${tag.data.name}" has parent "${tag.data.parent}" which does not exist`
      );
    }
    if (tag.data.tier === 'primary' && tag.data.parent) {
      console.warn(
        `[tag-validation] Primary tag "${tag.data.name}" should not have a parent`
      );
    }
    if (tag.data.parent) {
      const parentTag = allTags.find((t) => t.data.name === tag.data.parent);
      if (parentTag && parentTag.data.tier !== 'primary') {
        console.warn(
          `[tag-validation] Tag "${tag.data.name}" has parent "${tag.data.parent}" which is not a primary tag`
        );
      }
    }
  }
}
```

Tres verificaciones: un tag no puede referenciar un padre que no existe, los tags primarios no deben tener padres, y los tags padres deben ser primarios ellos mismos. Son llamadas `console.warn`, no errores que se lanzan — una inconsistencia de taxonomía no debería fallar un deploy a producción, debería ser visible y corregible, pero nunca silenciosa.

### Jerarquía visual

La distinción visual entre tags primarios y secundarios necesita comunicar jerarquía sin requerir leyenda. La convención que establecí:

**Tags primarios** — badges azules rellenos con prefijo `#`:

```html
<a class="rounded bg-blue-100 px-3 py-1 text-sm text-blue-800
          hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200
          dark:hover:bg-blue-800">
  #tech
</a>
```

**Tags secundarios (topics)** — badges más pequeños, con borde gris, sin prefijo:

```html
<a class="rounded border border-gray-200 px-2 py-0.5 text-xs text-gray-600
          hover:border-gray-400 hover:text-gray-800 dark:border-gray-600
          dark:text-gray-300 dark:hover:border-gray-400 dark:hover:text-gray-100">
  python
</a>
```

Tamaño, peso, color y tratamiento de borde trabajan juntos para hacer la jerarquía escaneable. Sin tooltip. Sin etiqueta "Tags vs Topics". La diferencia visual es autoevidente, y es consistente en las tarjetas del blog, los encabezados de posts y los artículos relacionados.

---

## Búsqueda Sin Servidor

El sistema de búsqueda necesitaba tratar los topics como objetivos reales, no como metadatos. Un lector buscando "python" debería encontrar posts de Python aunque "python" no aparezca en el título. Y todo tenía que funcionar sin backend.

El enfoque: un índice JSON estático de búsqueda generado en tiempo de build, consultado del lado del cliente.

El índice de búsqueda se genera en build time y se expone en shards estáticos por idioma (`/api/posts-en.json`, `/api/posts-es.json`). Aquí es donde se llama `groupPostTags()` para que el índice ya tenga los tags pre-divididos:

```typescript
const { primaryTags, topicTags } = await groupPostTags(allTags);
return {
  id: post.id,
  slug: getPostSlug(post.id),
  lang: getPostLanguage(post.id),
  title: post.data.title,
  description: post.data.description,
  pubDate: post.data.pubDate.toISOString(),
  tags: primaryTags,
  topics: topicTags,
  heroImage: post.data.heroImage,
  heroWebpExists: heroWebpExists(post.data.heroImage),
};
```

El modelo de puntuación de búsqueda refleja la jerarquía de la taxonomía:

```typescript
// Score: menor es mejor (título > tags primarios > topics > descripción)
const score = titleMatch
  ? 0.0
  : tagsMatch
    ? 0.1
    : topicsMatch
      ? 0.15
      : 0.2;
```

Un match de título es la señal más fuerte. Un match de tag primario es el siguiente. Un match de topic es ligeramente más débil — `python` podría aparecer en una descripción por contexto sin ser el enfoque principal del post. Un match de descripción es la señal más débil.

Todo esto corre del lado del cliente desde shards JSON estáticos. El usuario escribe, JavaScript filtra un índice en memoria, y los resultados aparecen al instante. No hay backend ni consulta a base de datos en tiempo de request — solo fetch de assets estáticos desde CDN. El UI de búsqueda es un island Svelte hidratado con `client:load`.

---

## Arquitectura de Contenido Bilingüe

El blog es completamente bilingüe en inglés y español. Cada post que escribo existe en ambos idiomas. Esto crea algunas restricciones arquitectónicas que vale la pena explicar.

El modelo de enrutamiento es de prefijo por idioma. Los posts en inglés están en `/blog/{slug}/`, los posts en español en `/es/blog/{slug}/`. Ambos usan el mismo slug. El selector de idioma en el header navega entre las dos versiones del mismo post.

La decisión arquitectónica clave es que las páginas en `src/pages/` son wrappers de enrutamiento ultra-delgados — unas tres líneas cada uno — y la lógica real vive en componentes compartidos `*Page.astro`:

```astro
---
// src/pages/blog/[...slug].astro — wrapper en inglés
import BlogPostPage from '@/components/pages/blog/BlogPostPage.astro';
---
<BlogPostPage lang="en" />
```

```astro
---
// src/pages/es/blog/[...slug].astro — wrapper en español
import BlogPostPage from '@/components/pages/blog/BlogPostPage.astro';
---
<BlogPostPage lang="es" />
```

Un solo componente maneja ambos idiomas. La prop `lang` determina qué subdirectorio de la colección de contenido consultar, qué strings de traducción usar, y qué prefijo de URL aplicar a los enlaces internos.

Los nombres de tags son identificadores agnósticos al idioma. Un post en `en/` y su contraparte en `es/` usan el mismo array de tags. La colección de tags no se duplica por idioma — `python.md` es un solo archivo, y tanto los posts en inglés como en español lo referencian por el mismo identificador. Esto significa que las definiciones de tags nunca se desincronizarán entre idiomas.

Los strings de traducción para la UI (etiquetas de paginación, "publicado el", "posts relacionados", placeholder de búsqueda) viven en `src/lib/translations/en.ts` y `src/lib/translations/es.ts`. Cuando un componente necesita texto visible para el usuario, llama `getTranslations(lang)` y obtiene el objeto correcto. Sin strings hardcodeados.

---

## Series: Conectando Posts en una Narrativa

Algunos posts son independientes. Otros son capítulos de una historia. Los posts en esta serie "Building XergioAleX.com" son un ejemplo claro — cada uno se construye sobre el anterior, y leerlos en orden te da el panorama completo. El sistema de blog necesita entender esa relación.

La arquitectura sigue el mismo patrón que los tags: una Content Collection para metadatos, campos de frontmatter en los posts, y resolución en tiempo de build.

### La colección de series

Cada serie es un archivo markdown en `src/content/series/`:

```yaml
# src/content/series/building-xergioalex.md
---
name: "building-xergioalex"
title: "Building XergioAleX.com"
description: "The complete story of building a modern personal website."
order: 1
---
```

Los posts se unen a una serie con dos campos de frontmatter:

```yaml
series: "building-xergioalex"
seriesOrder: 5
```

Eso es todo — un identificador y un número de posición. El sistema hace el resto.

### Navegación de series en tiempo de build

En tiempo de build, `getSeriesNavigation()` en `src/lib/blog.ts` recopila todos los posts de la misma serie para el mismo idioma, los ordena por `seriesOrder`, y devuelve un objeto tipado `SeriesInfo` con la tabla de contenidos, la posición actual, y las referencias anterior/siguiente.

El componente `SeriesNavigation` renderiza esto como un panel con borde azul al final de cada post: el título de la serie, una tabla de contenidos numerada con el capítulo actual resaltado, y enlaces anterior/siguiente. Al igual que la taxonomía de tags, todo esto es HTML pre-renderizado. Sin consultas del lado del cliente, sin JavaScript requerido.

### El problema de visibilidad

Pero acá está la cosa — el panel de navegación de series está al final del post, después de todo el contenido. En un artículo largo como este, un lector podría pasar veinte minutos leyendo sin nunca hacer scroll más allá del contenido y descubrir que hay otros tres capítulos. La información está ahí, pero el UX la oculta.

Me encontré con este mismo patrón en las páginas de portfolio y tech-talks, donde el contenido del timeline vive debajo del fold. La solución allí fue un botón flotante de scroll-to-timeline — una pastilla roja que se queda en la esquina inferior derecha y dice "baja al timeline."

Para los posts de series, construí `SeriesIndicator` — un botón flotante que aparece en la esquina inferior derecha cuando la navegación de series está debajo del viewport. Muestra un anillo de progreso circular con la posición del capítulo actual (por ejemplo, "2/4"), el texto "Capítulo 2 de 4," y un call-to-action "Todos los capítulos." Al hacer clic, la página hace smooth-scroll hasta el panel de navegación de series.

El indicador usa un `IntersectionObserver` para rastrear si la navegación de series es visible. Cuando el lector hace scroll y la navegación entra en la vista, el indicador desaparece — cumplió su trabajo. El estilo usa glassmorphism (`backdrop-blur`, borde sutil) para sentirse presente pero no intrusivo, y entra deslizándose desde la derecha con una animación CSS.

Este es el tipo de detalle que separa "la feature funciona" de "la feature es descubrible." Un lector que llega al capítulo tres de una serie inmediatamente ve el indicador flotante y sabe que hay otros capítulos. Sin él, podría terminar el post sin darse cuenta de que la serie existe.

---

## Performance: Todo en Tiempo de Build

El hilo en común: todo esto corre en tiempo de build. Para cuando cualquier HTML llega a un navegador, el trabajo ya está hecho.

El navegador no recibe una aplicación JavaScript que obtiene posts de una API, resuelve niveles de tags y renderiza todo dinámicamente. Recibe páginas HTML estáticas, cada una completamente pre-renderizada con el contenido correcto, los tags correctos divididos en sus niveles correctos, la paginación correcta, los posts relacionados correctos. El único JavaScript que corre en el navegador es para los islands interactivos: el componente de búsqueda, el menú móvil, el toggle de tema.

El flujo de arquitectura:

```
Tiempo de build:
  Archivos Markdown + colección de tags + colección de series
    → Validación Zod (el build falla con errores de esquema)
    → Consultas getCollection()
    → groupPostTags() (cacheado, O(1) después de la primera llamada)
    → getSeriesNavigation() (TOC de series, anterior/siguiente)
    → Cómputo de tiempo de lectura
    → Generación del índice de búsqueda
    → HTML estático para cada página, tag, paso de paginación
    → Shards estáticos de búsqueda (posts-en.json, posts-es.json)

Runtime (navegador):
  Recibe HTML pre-renderizado
  Carga shard de búsqueda por idioma bajo demanda
  Islands Svelte se hidratan: búsqueda, menú, toggle de tema, indicador de serie
  Cero consultas de colección
  Cero lógica de resolución de niveles
```

El resultado es lo que ves en los puntajes de Lighthouse: Performance, Accessibility, Best Practices y SEO todos en 100 en móvil y escritorio. Agregar un sistema completo de taxonomía de tags — archivos de colección, resolución de niveles, validación de jerarquía, integración de búsqueda — tuvo cero impacto en esos puntajes. La complejidad vive en el build. El navegador recibe HTML limpio.

Esta es la promesa del modelo de build-time de Astro, y el sistema de blog es una demostración clara de ello. Puedes construir arquitecturas de contenido arbitrariamente ricas — taxonomías de múltiples niveles, sistemas de referencias cruzadas, tiempos de lectura, índices de búsqueda — y nada de eso le cuesta nada al usuario en runtime. El trabajo ocurre una vez, en tiempo de deploy, y el resultado llega a todos lados, rápido.

---

## Agregar un Tag Nuevo: Cómo Funciona Ahora

Quiero mostrar concretamente lo que el sistema actual cuesta a nivel de autor de contenido, porque la arquitectura suena más compleja de lo que es en la práctica.

Agregar un tag secundario nuevo — digamos, `golang` — toma exactamente esto:

```yaml
# src/content/tags/golang.md
---
name: "golang"
description: "Go language — services, CLIs, and backend projects."
tier: secondary
order: 12
parent: "tech"
---
```

Un solo archivo. El próximo build automáticamente:
- Hace de `golang` un tag válido para cualquier post
- Lo enruta a `topicTags` en lugar de `primaryTags` en cada componente
- Genera una página `/es/blog/tag/golang/`
- Lo incluye en el índice de búsqueda con el nivel correcto
- Valida que `tech` (su padre) existe y es un tag primario

Sin cambios de esquema. Sin migraciones de posts. Sin actualizaciones de componentes. Un archivo, y la taxonomía queda extendida.

Con 1000 posts, esto importa enormemente. No quieres migrar mil archivos porque decidiste que `golang` merece su propio tag. Creas un archivo y sigues adelante.

---

## Reflexionando Sobre Este Capítulo

Cada capítulo de esta serie ha sido sobre tomar una decisión que cuesta algo ahora a cambio de un camino más simple después. Capítulo uno: construir con las restricciones de Astro y obtener performance gratis. Capítulo dos: invertir en identidad visual y darle alma al sitio. Capítulo tres: invertir en accesibilidad y obtener calificación perfecta de cada herramienta de auditoría. Capítulo cuatro: elegir herramientas de analytics livianas y mantener los puntajes por los que trabajaste. Capítulo cinco: diseñar la arquitectura de contenido correctamente antes de que el contenido supere al contenedor.

El sistema de taxonomía que construí maneja cientos o miles de posts sin ningún cambio estructural — solo nuevos archivos de contenido. El sistema de series conecta posts relacionados en una narrativa navegable con un indicador flotante que hace la conexión descubrible. La búsqueda corre del lado del cliente desde un índice JSON estático sin infraestructura de backend que mantener. El sistema bilingüe escala a cualquier post nuevo como un flujo de trabajo natural, no como una tarea pesada. Cada página es HTML estático pre-renderizado con cero costo en runtime para el usuario.

El mejor momento para construir un sistema de blog escalable es antes de que el contenido lo haga difícil. El segundo mejor momento es cuando puedes sentir la estructura empezando a tensionarse. Lo capté lo suficientemente temprano para que la migración fuera unos días de trabajo cuidadoso y un diff satisfactorio — no una reescritura de un mes.

A seguir construyendo.

---

## Recursos

- **[Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)** — Documentación oficial del sistema de colecciones y esquemas usado a lo largo de este post.
- **[Zod Schema Validation](https://zod.dev/)** — La librería de esquemas usada en `content.config.ts` para validar frontmatter de tags y blog posts.
- **[Código fuente de xergioalex.com](https://github.com/xergioalex/pereiratechtalks)** — El repositorio completo donde vive todo el código descrito aquí.
