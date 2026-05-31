---
title: "Markdown for Agents: Cómo Hacer que tu Contenido Hable el Idioma de la IA"
description: "La negociación de contenido existe desde HTTP/1.1. Ahora tiene un trabajo nuevo. Qué significa 'Markdown for Agents' como patrón web — y una implementación funcional con Astro y Cloudflare Pages."
pubDate: "2026-03-09T14:00:00"
heroImage: "/images/blog/posts/aeo-markdown-for-agents/hero.webp"
heroLayout: "side-by-side"
tags: ["tech", "web-development", "ai"]
keywords: ["implementación markdown for agents", "negociación de contenido bots IA", "header Accept text/markdown", "Cloudflare markdown for agents", "contenido web legible por IA", "servir markdown a agentes IA"]
series: "aeo-from-invisible-to-cited"
seriesOrder: 3
---

Cuando un agente de IA visita una página web, recibe la respuesta HTTP completa — lo mismo que recibe un navegador. Markup de navegación, footer, scripts de cambio de tema, avisos de cookies, clases de utilidad de Tailwind, definiciones de íconos SVG, schemas JSON-LD embebidos como etiquetas script. Y en algún lugar dentro de todo eso, el contenido real.

Los agentes son buenos extrayendo señal del ruido. Pero cada token — cada fragmento de texto que el modelo procesa — gastado en `class="text-gray-600 dark:text-gray-300"` o `<nav aria-label="Main navigation">` es un token que no se gasta entendiendo lo que la página realmente dice. Para un artículo corto, la proporción está bien. Para un post largo con una barra lateral compleja, estás quemando una parte significativa de la ventana de contexto — la cantidad de texto que un modelo puede mantener en memoria a la vez — antes de llegar al primer párrafo.

Este es un problema estructural con la entrega HTML primero. Y está adquiriendo un nombre: **Markdown for Agents**.

---

## Negociación de Contenido: Una Idea Vieja, un Trabajo Nuevo

La negociación de contenido ha sido parte de HTTP desde la versión 1.1. El cliente envía un header `Accept` describiendo el formato que quiere. El servidor responde con el formato que mejor coincide. Un navegador solicita `Accept: text/html`. Un cliente que puede trabajar con texto plano podría solicitar `Accept: text/plain`. El servidor decide qué enviar.

Durante la mayor parte de la historia de la web, este mecanismo se usó principalmente para la selección de idioma (`Accept-Language`) y compresión (`Accept-Encoding`). La negociación de formato entre HTML y otros tipos rara vez surgía en la práctica — los navegadores querían HTML y los servidores entregaban HTML.

Los agentes de IA cambian ese cálculo. Un agente que puede leer Markdown no tiene razón para preferir HTML. El Markdown es más limpio, eficiente en tokens, y lleva todo el contenido semántico sin la capa de presentación. Si un servidor puede detectar que el cliente es un agente de IA — o más precisamente, si el cliente anuncia que puede manejar `text/markdown` — el servidor puede saltarse el HTML por completo.

Esa es la idea detrás de Markdown for Agents. Enviar Markdown cuando el cliente quiere Markdown.

---

## La Propuesta de Cloudflare

En febrero de 2026, [Cloudflare publicó "Markdown for Agents"](https://blog.cloudflare.com/markdown-for-agents/) — un post que planteó el problema con claridad y propuso una implementación: conversión de HTML a Markdown en el edge. Cuando una solicitud incluye `Accept: text/markdown`, Cloudflare Workers la intercepta, obtiene el HTML, lo convierte al vuelo y devuelve Markdown limpio al agente. Sin cambios requeridos en el servidor de origen. También lanzaron [`markdown.new`](https://markdown.new) — una herramienta pública donde puedes pegar cualquier URL y obtener su versión Markdown al instante, útil para probar cómo se vería cualquier sitio a través de los ojos de un agente.

El post aterrizó en los círculos de desarrolladores e inició una conversación que todavía continúa. Posicionó el header `Accept: text/markdown` como el estándar emergente para esta clase de solicitud — lo que probablemente será, si el patrón se consolida.

Markdown for Agents está junto a dos otras convenciones en el conjunto de herramientas AEO: `robots.txt` (política de acceso), `llms.txt` (índice del sitio para modelos de lenguaje), y ahora negociación de contenido para entrega limpia bajo demanda. Resuelven cosas distintas. `robots.txt` dice si los bots pueden visitar. `llms.txt` les da un mapa. Markdown for Agents les da el contenido en un formato que no desperdicia su atención.

Si esto se convierte en un estándar web formal es una pregunta abierta. El [IETF](https://www.ietf.org/) (Internet Engineering Task Force — el organismo que define los estándares fundamentales de Internet como HTTP, TLS y DNS) no lo ha estandarizado. Ningún navegador importante se preocupa por él. Pero Cloudflare es una de las redes edge más grandes del planeta, y cuando publican un post de "así es como los agentes deberían hablar con los servidores web", la industria presta atención. Creo que esta convención tiene futuro — no porque sea técnicamente novedosa, sino porque resuelve un problema real con mínima ceremonia.

---

## Cómo Funciona

El patrón tiene dos caminos de entrega:

**Negociación de contenido vía header `Accept`:**
```
Agente → GET /about
         Accept: text/markdown
Servidor → 200 OK
           Content-Type: text/markdown; charset=utf-8
           Vary: Accept
           [Contenido Markdown]
```

**Fallback por URL directa:**
```
Agente → GET /about.md
Servidor → 200 OK
           Content-Type: text/markdown; charset=utf-8
           [Contenido Markdown]
```

El enfoque de header es más limpio — el agente usa la misma URL que usaría para HTML y anuncia su preferencia. El enfoque de URL directa es más simple de implementar y funciona incluso sin middleware — es solo un archivo estático en una ruta predecible.

De cualquier forma, lo que el agente recibe es Markdown: el contenido sin el decorado. Una respuesta Markdown bien formateada para un post de blog se ve así:

```markdown
# Título del Post

> Texto de descripción

Published: 2026-03-09
Language: en
Canonical: https://example.com/blog/post-slug

---

[cuerpo del post tal como fue escrito]
```

Título, metadatos, cuerpo. Eso es todo. Sin `<head>`, sin navegación, sin anuncios, sin píxeles de analíticas. Para un post de 2.000 palabras, esto podría ser 8KB de Markdown versus 80KB de HTML con todo lo que viene junto a un sitio moderno.

### ¿Y las Imágenes?

El servicio `markdown.new` mencionado antes excluye imágenes por defecto (`retain_images=false`) — y ofrece un flag opcional para incluirlas. La lógica es directa: el objetivo de Markdown for Agents es la eficiencia de tokens. Una referencia a imagen como `![hero](/images/hero.png)` es texto que el agente no puede procesar directamente — necesitaría hacer un fetch adicional y tener capacidades multimodales para interpretarla. La mayoría de los agentes hoy son text-first.

La convención de la industria refuerza esto: nunca pongas información crítica dentro de imágenes. Si un dato importa, tiene que estar en texto — tablas Markdown, listas, datos estructurados. Las imágenes son suplementarias, no primarias.

Mi enfoque es un punto medio. Para los blog posts, la URL de la imagen de portada se incluye en el header de metadatos — una sola línea como `Hero Image: https://xergioalex.com/images/blog/posts/.../hero.png` que le da a un agente con capacidades multimodales la opción de obtenerla, sin inflar el cuerpo. Y como los blog posts están escritos en Markdown desde el origen, cualquier imagen ya referenciada en el cuerpo (capturas de pantalla, diagramas) se pasa tal cual — sin procesamiento adicional. Para las páginas estáticas (About, Portfolio, Contact), las imágenes se excluyen por completo — esos endpoints son texto puro.

Si los agentes empiezan a procesar imágenes inline de forma rutinaria, expandir la cobertura es trivial. Por ahora, referencia en metadatos para la portada más lo que el autor ya incluyó en el cuerpo se siente como el balance correcto.

El header de respuesta `Vary: Accept` es importante — le dice a los cachés de CDN que la misma URL puede devolver contenido diferente dependiendo del header `Accept`, para que un caché no sirva accidentalmente Markdown a un navegador o HTML a un agente.

---

## Una Implementación Funcional

Cloudflare tomó el camino de conversión de HTML a Markdown en el edge. Yo opté por un enfoque híbrido: servir ambos formatos — HTML y Markdown — desde archivos estáticos, con un middleware que decide cuál entregar según lo que pida el cliente.

Este sitio está construido con Astro — cada post de blog ya es un archivo `.md`. El Markdown fuente existe desde el origen. Para los blog posts no tuve que hacer nada extra: ya estaban escritos en Markdown. Para las páginas estáticas (About, Portfolio, Contact, etc.) sí generé una versión `.md` de cada una como parte del build. El resultado: cada URL del sitio tiene una versión HTML y una versión Markdown lista para servir.

```
                       ┌─→ Página HTML (navegadores)
Fuente .md → [Astro build]
                       └─→ Archivo .md  (agentes)
```

Dos salidas de una misma fuente. Por ejemplo, un post del blog y una página estática:

| URL | Formato |
|-----|---------|
| [/es/blog/astro-and-svelte-the-future-of-web-development](https://xergioalex.com/es/blog/astro-and-svelte-the-future-of-web-development/) | HTML (navegadores) |
| [/es/blog/astro-and-svelte-the-future-of-web-development.md](https://xergioalex.com/es/blog/astro-and-svelte-the-future-of-web-development.md) | Markdown (agentes) |
| [/es/about](https://xergioalex.com/es/about/) | HTML (navegadores) |
| [/es/about.md](https://xergioalex.com/es/about.md) | Markdown (agentes) |

Sin conversión en tiempo real, sin artefactos de transformación HTML→Markdown. Lo que el agente lee es lo que escribí. Y como este es un sitio estático, quería mantener todo estático — nada necesita computarse en runtime, todo se construye una vez y se sirve desde el CDN. La única pieza que requirió implementación fue el middleware, y como el sitio corre en Cloudflare Pages, fue muy fácil de integrar.

Cada página del sitio obtiene un endpoint `.md` generado en cada build — posts del blog en ambos idiomas, páginas estáticas y páginas índice:

Cada archivo tiene un header de metadatos — título, descripción, autor, URL canónica — seguido del cuerpo tal como fue escrito. Cero procesamiento en runtime. Los archivos `.md` están en el CDN de Cloudflare como cualquier otro asset estático.

### El Middleware

La negociación de contenido — la parte de "devolver Markdown cuando se pide" — corre en un middleware de Cloudflare Pages en [`functions/_middleware.ts`](https://github.com/xergioalex/xergioalex.com/blob/main/functions/_middleware.ts). La lógica de resolución de rutas maneja slashes finales, rutas index y los distintos patrones de URL:

```typescript
function resolveMarkdownPath(pathname: string): string {
  let clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (clean === '/') return '/index.md';
  if (clean.endsWith('/index')) return `${clean}.md`;
  return `${clean}.md`;
}
```

Cuando llega una solicitud con `Accept: text/markdown`, el middleware verifica que no sea una ruta excluida (`/api/`, `/internal/`, assets estáticos), resuelve la ruta `.md`, y la obtiene vía `context.env.ASSETS.fetch()` — una API de Cloudflare Pages que accede a assets estáticos sin hacer una solicitud HTTP externa:

```typescript
async function tryServeMarkdown(context: EventContext): Promise<Response | null> {
  const accept = context.request.headers.get('accept') || '';
  if (!accept.includes('text/markdown')) return null;

  // ... verificaciones de exclusión ...

  const mdPath = resolveMarkdownPath(pathname);
  let assetResponse = await context.env.ASSETS.fetch(new Request(mdUrl.toString()));

  // Fallback: /path.md → /path/index.md
  if (!assetResponse.ok && !mdPath.endsWith('/index.md')) {
    const indexMdPath = `${mdPath.replace(/\.md$/, '')}/index.md`;
    assetResponse = await context.env.ASSETS.fetch(new Request(indexMdUrl.toString()));
  }

  if (!assetResponse.ok) return null;

  return new Response(assetResponse.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
      'Vary': 'Accept',
      'X-Content-Negotiation': 'markdown',
    },
  });
}
```

El fallback — intentar `/path/index.md` si `/path.md` no existe — importa porque rutas como `/es/` y `/blog/` resuelven a archivos `index.md`, no `es.md` y `blog.md`. Sin él, las páginas más útiles para un agente navegando el sitio devolverían 404s.

El [middleware completo](https://github.com/xergioalex/xergioalex.com/blob/main/functions/_middleware.ts) también incluye una capa de analíticas de bots de IA — rastreo server-side de crawlers conocidos como GPTBot, ClaudeBot, PerplexityBot, y otros. Los agentes no corren JavaScript, por lo que las analíticas del lado del cliente no los ven.

Puedes probar todo con un solo curl:

```bash
# Negociación de contenido
curl -H "Accept: text/markdown" https://xergioalex.com/es/about

# URL .md directa — sin headers necesarios
curl https://xergioalex.com/es/about.md
```

---

## La Apuesta

El middleware también dispara eventos de analíticas por cada solicitud de Markdown — rastreando qué bots piden Markdown, si usan negociación de contenido o URLs `.md` directas, y con qué frecuencia. La arquitectura completa de medición se cubre en el [siguiente capítulo](/es/blog/aeo-the-scorecard), donde encaja junto con el resto de la historia de medición AEO.

¿Alguien está leyendo estos endpoints hoy? Probablemente no de forma sistemática. Ningún sistema de IA importante ha dicho públicamente que envía headers `Accept: text/markdown` o que lee preferentemente URLs `.md`. Cloudflare propuso el patrón en febrero de 2026; todavía no se ha convertido en un estándar.

Pero así es como empiezan estas cosas. `robots.txt` era informal antes de ser estándar. `sitemap.xml` era una propuesta de Google antes de ser una convención de la industria.

El patrón de Markdown for Agents no cuesta casi nada mantener en un sitio estático. Los archivos `.md` agregan quizás unos pocos cientos de kilobytes a la salida del build. El middleware corre en cada solicitud pero no agrega carga adicional a las respuestas HTML. Y si la convención se consolida — si los agentes empiezan a enviar `Accept: text/markdown` como los navegadores envían `Accept: text/html` — la infraestructura ya está en su lugar.

Creo que la pregunta más importante no es si Markdown for Agents funciona hoy, sino qué pasa si se convierte en un estándar web. Si el W3C o el IETF formalizan la negociación de contenido para agentes de IA, los sitios sin endpoints `.md` se vuelven ciudadanos de segunda clase en la web de agentes. Los que los tienen obtienen entrega limpia desde el primer día. El costo de ser temprano es despreciable. El costo de ser tarde, si esto despega, es un proyecto de migración.

Estoy dispuesto a hacer esa apuesta.

De hecho, este mismo post que estás leyendo tiene su versión Markdown lista para agentes. Puedes verla directamente en <a href="/es/blog/aeo-markdown-for-agents.md" target="_blank">/es/blog/aeo-markdown-for-agents.md</a>, o pedirla vía content negotiation:

```bash
# Negociación de contenido — misma URL, diferente formato
curl -H "Accept: text/markdown" https://xergioalex.com/es/blog/aeo-markdown-for-agents

# URL directa — sin headers necesarios
curl https://xergioalex.com/es/blog/aeo-markdown-for-agents.md
```

Sigamos construyendo.

---

## Recursos

**Markdown for Agents**
- [Cloudflare: Markdown for Agents](https://blog.cloudflare.com/markdown-for-agents/) — el post que inició la conversación
- [markdown.new](https://markdown.new) — herramienta de Cloudflare para convertir cualquier URL a Markdown al instante
- [xergioalex.com/es/about.md](https://xergioalex.com/es/about.md) — ejemplo de endpoint Markdown (URL directa)

**Estándares**
- [Negociación de Contenido HTTP — RFC 7231](https://www.rfc-editor.org/rfc/rfc7231#section-5.3.2)
- [Especificación llms.txt](https://llmstxt.org/)

**Implementación**
- [Código fuente: `functions/_middleware.ts`](https://github.com/xergioalex/xergioalex.com/blob/main/functions/_middleware.ts) — el middleware completo (negociación de contenido + analíticas de bots IA)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Cloudflare Pages Functions](https://developers.cloudflare.com/pages/functions/)
