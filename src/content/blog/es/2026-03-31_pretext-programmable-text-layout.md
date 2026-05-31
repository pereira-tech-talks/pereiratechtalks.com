---
title: "PreTeXt: La Librería Que Hace el Texto Programable"
description: "No entendía el hype de una librería de medición de texto. Construí un lab con decenas de demos para descubrirlo — una esfera que reorganiza texto a 60fps."
pubDate: "2026-03-31"
heroImage: "/images/blog/posts/pretext-programmable-text-layout/hero.webp"
heroLayout: "side-by-side"
tags: ["portfolio", "tech", "javascript", "web-development", "design"]
keywords: ["pretext librería javascript layout texto", "alternativa medición texto DOM reflow", "animación texto 60fps javascript pretext", "pretext cheng lou texto programable", "layoutNextLine ancho variable texto", "medir texto sin DOM reflow javascript", "pretext prepare layout API demo"]
---

Vi [el post de Cheng Lou](https://x.com/_chenglou/status/2037713766205608234) sobre PreTeXt en tendencia y mi primera reacción fue: ¿en serio? ¿Una librería de medición de texto? ¿Eso es lo que tiene a la gente emocionada?

Entré al [repositorio](https://github.com/chenglou/pretext). Leí el README. Vi los GIFs de demo. Y siendo honesto — no lo entendí. El API se veía limpio, sí. `prepare()` y `layout()`. Dos funciones. Pero mi cerebro seguía preguntando: ¿por qué me debería importar medir la altura del texto? CSS ya hace eso. El navegador se encarga. ¿Qué problema está resolviendo esto realmente?

Leí la documentación dos veces. Seguía sin entenderlo.

Así que hice lo que siempre hago cuando no entiendo algo — construí cosas con ello. No un demo. No cinco. Treinta y nueve. Un [laboratorio interactivo](https://pretext.xergioalex.com/) completo con demos que van desde medición básica de texto hasta una esfera que persigue tu cursor mientras el texto se reorganiza a su alrededor a 60 cuadros por segundo.

Decenas de demos después, lo entiendo. Y creo que tú también lo vas a entender.

---

## Cómo Funciona Realmente la Medición de Texto en la Web

La mayoría de los desarrolladores nunca piensan en la medición de texto. Pones texto en un contenedor, CSS lo ajusta, y el navegador calcula la altura. Listo.

Pero en el momento en que necesitas *saber* esa altura antes de renderizar — ¿qué tan alto será este párrafo a 320px de ancho? — estás en problemas.

Esto es lo que el navegador realmente hace cuando le preguntas:

```javascript
// La forma tradicional: preguntarle al navegador
function measureTextHeight(text, width, font) {
  const el = document.createElement('div');
  el.style.cssText = `position:absolute;visibility:hidden;width:${width}px;font:${font}`;
  el.textContent = text;
  document.body.appendChild(el);    // ¡reflow!
  const height = el.offsetHeight;   // ¡reflow!
  document.body.removeChild(el);
  return height;
}
// Cada llamada = 2 reflows. Para 500 tarjetas = 1,000 reflows.
```

Creas un elemento oculto. Le pones el texto y el ancho. Lo agregas al DOM — lo que puede forzar al navegador a recalcular el layout. Lees la altura — otra lectura que fuerza layout. Lo eliminas. Repites.

Ese tipo de medición [puede forzar al navegador a recalcular el layout](https://developer.chrome.com/docs/performance/insights/forced-reflow). Suena manejable hasta que necesitas hacerlo 500 veces para un grid de tarjetas. O en cada cambio de tamaño de ventana. O — y aquí es donde se pone doloroso — 60 veces por segundo para una animación.

Si alguna vez has construido un layout masonry y has visto las tarjetas saltar al cargar — es exactamente esto. El navegador no sabía qué tan alto sería el texto hasta que lo renderizó. Entonces renderiza, mide, reposiciona, y tú ves el salto. La mayoría de las librerías de masonry terminan rodeando este problema en vez de eliminarlo limpiamente.

Y no puedes cachear los resultados, porque la altura cambia cada vez que cambia el ancho del contenedor. ¿Cambias el tamaño de la ventana? Mide todo de nuevo. ¿Cambias a un layout móvil? Mide todo de nuevo. ¿Animas el ancho de un contenedor? Mide todo 60 veces por segundo.

---

## Dos Fases. Esa Es Toda la Idea.

[PreTeXt](https://github.com/chenglou/pretext) es de [Cheng Lou](https://github.com/chenglou) — si has estado en el mundo de React el tiempo suficiente, conoces ese nombre. Es un colaborador de larga data de React, el creador de [react-motion](https://github.com/chenglou/react-motion), y alguien muy asociado al mundo de Reason/ReScript. Actualmente está en [Midjourney](https://venturebeat.com/technology/midjourney-engineer-debuts-new-vibe-coded-open-source-standard-pretext-to). Tiende a gravitar hacia problemas fundacionales.

Su idea con PreTeXt es casi desconcertantemente simple: separar el trabajo costoso del trabajo repetido. Hasta el mismo Cheng Lou [se lo toma con humor](https://x.com/_chenglou/status/2038486958708851074): *"supposedly 'innovative' text layout library / looks inside / just a parser and a cache."* ("librería de layout de texto supuestamente 'innovadora' / miras adentro / solo un parser y un caché.") Y honestamente, eso es lo que lo hace interesante — el poder no está en la complejidad, está en lo que ese parser y ese caché hacen posible.

**Fase 1 — `prepare(text, font)`:** Haces todo el trabajo pesado una sola vez. Segmentación de texto Unicode vía [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter), detección de límites de palabras, medición de fuente vía [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/measureText). Esta fase determina dónde podría ir cada posible salto de línea y qué tan ancho es cada segmento de texto. En el benchmark actual del repo, este paso tarda unos 19ms para un lote compartido de 500 textos.

**Fase 2 — `layout(prepared, width, lineHeight)`:** Aritmética pura. Sin acceso al DOM. Sin Canvas. Sin manipulación de strings. Solo matemáticas sobre las mediciones cacheadas de la fase 1. En ese mismo benchmark, `layout()` tarda unos 0.09ms para ese mismo lote de 500 textos. Aproximadamente 200x más rápido ahí.

```typescript
import { prepare, layout } from '@chenglou/pretext';

// Fase 1: análisis único (~0.04ms)
const prepared = prepare(text, '16px Inter');

// Fase 2: altura instantánea a CUALQUIER ancho (~0.0002ms cada una)
const narrow = layout(prepared, 300, 24);  // { height: 144, lineCount: 6 }
const wide = layout(prepared, 600, 24);    // { height: 72, lineCount: 3 }
const mobile = layout(prepared, 200, 24);  // { height: 216, lineCount: 9 }

// Mismos datos preparados, tres anchos diferentes, costo casi nulo.
```

La idea que por fin me hizo click — y que tardé demasiado en ver — es que `prepare()` es la cuenta que pagas una sola vez. Después de eso, `layout()` es casi gratis en comparación con la fase inicial.

Es como pre-compilar un regex. La primera llamada cuesta algo. Cada match después de eso es casi instantáneo.

Los números lo hacen concreto. En el benchmark incluido en el repo, un lote compartido de 500 bloques de texto se ve así:

- **PreTeXt `prepare()`:** ~19ms para el lote
- **PreTeXt `layout()`:** ~0.09ms para ese mismo lote

Si estás redimensionando, recalculando layout o probando varios anchos, ahí es donde la ventaja empieza a importar.

Pero la cosa va más allá de medir alturas. Con `layoutNextLine()`, puedes procesar el texto línea por línea — y cada línea puede tener un ancho diferente:

```typescript
import { prepareWithSegments, layoutNextLine } from '@chenglou/pretext';

const prepared = prepareWithSegments(text, '16px Inter');
let cursor = 0;
let lineNumber = 0;

while (true) {
  const availableWidth = getAvailableWidth(lineNumber, obstaclePosition);
  const line = layoutNextLine(prepared, cursor, availableWidth);
  if (!line) break;

  renderLine(line, lineNumber);
  cursor = line.endOffset;
  lineNumber++;
}
```

Esto es lo que el `float` de CSS desearía poder hacer. Excepto que esto se recalcula 60 veces por segundo mientras arrastras un obstáculo por la página. CSS floats son rectángulos estáticos decididos al renderizar. Esto es dinámico, formas arbitrarias, recalculado cada cuadro.

---

## Así Que Construí un Laboratorio

Aprendo construyendo. Leer solo documentación no me funciona — necesito empujar los límites, encontrar las fronteras, romper cosas hasta que entiendo por qué funcionan.

Así que construí un [laboratorio completo](https://pretext.xergioalex.com/). [Astro](https://astro.build/) 6 para el shell estático, [Svelte](https://svelte.dev/) 5 para las islas interactivas — el mismo stack que uso para este sitio web y que vengo defendiendo como [el futuro del desarrollo web](/es/blog/astro-and-svelte-the-future-of-web-development/). 39 demos interactivos organizados de lo fundamental a lo que solo puedo describir como espectacular. El laboratorio sigue el patrón de [arquitectura de islas](https://docs.astro.build/en/concepts/islands/) — cada página carga como HTML estático en milisegundos, y solo los demos envían JavaScript vía `client:only="svelte"`. Predicando con el ejemplo.

Algo que importa aquí: **PreTeXt es completamente agnóstico al framework.** Es JavaScript puro — sin dependencia de React, sin plugin de Vue, sin binding de Svelte. Solo un algoritmo. Construí el laboratorio con Astro y Svelte porque es mi stack y son muy aptos para este tipo de cosas — los [runes](https://svelte.dev/docs/svelte/what-are-runes) de Svelte 5 (`$state`, `$effect`) hicieron que conectar los demos reactivos fuera casi trivial, y la generación estática de Astro significó que el laboratorio carga rápido incluso con decenas de componentes interactivos pesados. Pero puedes usar PreTeXt con React, Vue, JavaScript vanilla, Canvas, WebGL, o cualquier cosa que corra en un navegador. Al final del día, lo que tienes es un gran algoritmo que toma texto y una fuente, y te devuelve matemáticas de layout. Lo que hagas con esos números depende completamente de ti.

Creo que la mejor forma de entender una librería es encontrar dónde deja de ser útil. Así que eso intenté hacer. Seguí construyendo demos cada vez más absurdos — [texto fluyendo alrededor de obstáculos](https://pretext.xergioalex.com/demos/flow-around-obstacle/), [texto moldeado en siluetas](https://pretext.xergioalex.com/demos/text-silhouette/), [texto como cuerpos físicos](https://pretext.xergioalex.com/demos/text-collision/), [texto como mecánicas de juego](https://pretext.xergioalex.com/demos/text-breakout/), [texto devorado por un agujero negro](https://pretext.xergioalex.com/demos/text-black-hole/), [un océano entero simulado con partículas-letra](https://pretext.xergioalex.com/demos/text-ocean-sph/) — esperando que PreTeXt se rompiera. No lo hizo.

Honestamente, pasé más tiempo del que me gustaría admitir en el demo del [Editorial Engine](https://pretext.xergioalex.com/demos/editorial-engine/). Lograr que la física de los orbes se sintiera bien mientras el texto se reorganizaba a su alrededor fue complicado — incluso con PreTeXt haciendo la parte difícil de la medición, la coordinación entre la simulación de física y el layout por línea requirió mucha iteración.

El [repositorio es público](https://github.com/xergioalex/pretext-lab) si quieres explorar el código. Pero te recomiendo probar los [demos en vivo](https://pretext.xergioalex.com/) primero — algunos de estos realmente necesitan ser experimentados, no leídos.

Esto es lo que organicé:

- **Fundamental** (4 demos) — lo básico: medir texto, comportamiento al redimensionar, benchmarks DOM vs PreTeXt
- **Práctico** (5 demos) — patrones reales de UI: tarjetas masonry, burbujas de chat, texto en canvas, soporte multilingüe
- **Avanzado** (13 demos) — control por línea: texto fluyendo alrededor de obstáculos, layouts editoriales, columnas de revista, reflow de PDF entre dispositivos, globos de diálogo de cómic, composición de subtítulos, reconstrucción OCR
- **Espectacular** (17 demos) — cosas difíciles de imaginar en la web: una esfera persiguiendo tu cursor a través del texto, breakout de texto, tipografía reactiva al audio, colisiones de texto basadas en física, origami de texto, un agujero negro que devora palabras, un océano de partículas-letra con física de fluidos SPH

---

## Por Qué Esto Cambia las Cosas

PreTeXt no es simplemente "medición DOM más rápida". Habilita patrones que antes eran imprácticos, incómodos o demasiado costosos para poner en el hot path.

**Animaciones de texto a 60fps.** [Wave distortion](https://pretext.xergioalex.com/demos/wave-distortion/) corriendo una onda sinusoidal por los anchos de línea en cada cuadro. [Text vortex](https://pretext.xergioalex.com/demos/text-vortex/) girando caracteres y reensamblándolos. [Gravity letters](https://pretext.xergioalex.com/demos/gravity-letters/) cayendo y rebotando con física. En el [Dragon Chase](https://pretext.xergioalex.com/demos/dragon-chase/), una esfera sigue tu cursor y el texto se reorganiza a su alrededor — eso son 30-50 llamadas a `layoutNextLine()` por cuadro, todo en menos de 16ms. Todo esto deja de ser práctico si cada cuadro depende de mediciones frescas del DOM.

**Texto en Canvas con saltos de línea correctos.** El [Canvas API no tiene concepto de text wrapping](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillText). Llamas a `fillText()` y dibuja una sola línea. Si quieres texto multilínea con ajuste de palabras, estás por tu cuenta. PreTeXt proporciona el cerebro que falta — calcula dónde debería ir cada salto de línea, y tú renderizas el resultado en Canvas.

**Texto como medio interactivo.** Juegos. Simulaciones de física. [Tipografía reactiva al audio](https://pretext.xergioalex.com/demos/audio-reactive/) donde el layout del texto responde al sonido en tiempo real. [Celdas Voronoi](https://pretext.xergioalex.com/demos/voronoi-text/) llenas de texto que se reorganiza. [Mundos de colisión de texto](https://pretext.xergioalex.com/demos/text-collision/) donde los párrafos son cuerpos rígidos que rebotan entre sí. Y mis favoritos del último lote: un [pool de partículas](https://pretext.xergioalex.com/demos/text-particle-pool/) donde 4,000 partículas-carácter llueven y se acumulan con física real — dispersalas con tu cursor y mira cómo se reacomodan — y una [simulación de océano](https://pretext.xergioalex.com/demos/text-ocean-sph/) usando Smoothed Particle Hydrodynamics donde las letras se comportan como agua, con un barco flotando sobre olas hechas de caracteres. Ese me rompió un poco el cerebro.

**Layouts para streaming con LLMs.** Dimensionar una burbuja de chat mientras el texto va llegando sin depender de mediciones repetidas del DOM. Menos saltos, menos scroll errático. Prueba el [demo de streaming text](https://pretext.xergioalex.com/demos/streaming-text/).

También se toma Unicode en serio — gracias a [`Intl.Segmenter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter), el texto CJK puede partir entre caracteres, árabe y hebreo corren de derecha a izquierda, tailandés usa partición de palabras basada en diccionario, y los clusters de emoji se mantienen juntos. Prueba el [test de estrés multilingüe](https://pretext.xergioalex.com/demos/i18n-stress/) — el demo cubre 9 muestras y casos límite de distintos sistemas de escritura. Muchas utilidades ligeras de texto en JavaScript empiezan a mostrar grietas apenas sales del texto latino simple. PreTeXt claramente está apuntando a ese problema más difícil. Cero dependencias externas — solo APIs del navegador que ya existen.

Creo que veremos este tipo de separación — análisis costoso una vez, computación barata para siempre — aparecer en más áreas más allá del texto. PreTeXt simplemente lo encontró primero.

---

## Cuándo Tiene Sentido — y Cuándo No

Después de tantos demos es fácil salir pensando que PreTeXt debería estar en todos lados. No es así.

PreTeXt resuelve un problema concreto: necesitas saber las dimensiones del texto **antes** de renderizarlo, o necesitas recalcularlas **muchas veces** sin pagar el costo de un reflow del DOM cada vez. Si tu proyecto no tiene ese problema, la librería no te aporta nada que el navegador no haga ya solo.

**Cuándo sí vale la pena:**

- Layouts masonry o grids virtualizados donde necesitas alturas exactas antes del primer render
- Animaciones o interacciones donde el texto se recalcula en cada frame (60fps)
- Renderizado de texto en Canvas, SVG o WebGL — donde el navegador no te da line wrapping
- Interfaces de streaming (chat con LLMs) donde quieres dimensionar el contenedor antes de que termine el texto
- Herramientas editoriales con texto fluyendo alrededor de objetos dinámicos

**Cuándo no lo necesitas:**

- Sitios estáticos o blogs donde el texto se renderiza una vez y CSS se encarga del layout. Este mismo sitio, por ejemplo — no usa PreTeXt. No lo necesita.
- Páginas donde el texto vive dentro de contenedores fijos y no cambia dinámicamente
- Aplicaciones donde un solo reflow al cargar la página es aceptable y no hay animaciones de texto
- Cualquier caso donde `getBoundingClientRect()` llamado una o dos veces resuelve tu problema sin overhead perceptible

La librería es potente, pero no es una bala de plata. Es una herramienta de infraestructura para casos donde la medición de texto está en el hot path — cuando medir es el cuello de botella, no algo que pasa una vez al cargar. La mayoría de las webs nunca llegan a ese punto. Las que sí — feeds con miles de tarjetas, editores visuales, experiencias interactivas pesadas — son las que más se benefician.

## Abrí la Caja Negra

Empecé este proyecto sin entender el hype. Una librería de medición de texto, pensé. ¿Qué tan emocionante puede ser eso?

Decenas de demos después, no solo lo entiendo — estoy emocionado con esto. Es rápido y el API es limpio, sí. Pero no es por eso. Es porque cambia lo que es posible. El texto en la web ha sido una caja negra controlada por CSS desde que empecé a construir sitios web. PreTeXt abre esa caja y te entrega los controles.

Construir el laboratorio también reforzó algo que vengo diciendo hace rato: [Astro y Svelte son una combinación tremendamente potente](/es/blog/astro-and-svelte-the-future-of-web-development/). Astro me dio un shell estático rápido con enrutamiento basado en archivos y cero JS por defecto. Svelte me dio islas reactivas y performantes donde toda la magia de PreTeXt sucede. Y PreTeXt — al ser completamente agnóstico al framework — encajó directamente sin un solo adaptador o wrapper. Así es como deberían funcionar las buenas herramientas: se componen con cualquier cosa.

Prueba el [laboratorio](https://pretext.xergioalex.com/). Rompe cosas. Construye algo que yo no pensé. El [código está todo abierto](https://github.com/xergioalex/pretext-lab), y la [librería original](https://github.com/chenglou/pretext) de Cheng Lou es MIT y sin dependencias.

A seguir construyendo.

---

## Recursos

- [Librería PreTeXt](https://github.com/chenglou/pretext) — La librería original de Cheng Lou (MIT, cero dependencias)
- [PreTeXt Lab](https://pretext.xergioalex.com/) — Todos los 39 demos interactivos
- [Código Fuente del PreTeXt Lab](https://github.com/xergioalex/pretext-lab) — Código completo de todos los demos (Astro + Svelte)
- [VentureBeat: Ingeniero de Midjourney presenta PreTeXt](https://venturebeat.com/technology/midjourney-engineer-debuts-new-vibe-coded-open-source-standard-pretext-to) — Cobertura de prensa del lanzamiento
- [Forced reflow](https://developer.chrome.com/docs/performance/insights/forced-reflow) — Documentación de Chrome DevTools sobre por qué los reflows forzados son costosos
- [Qué fuerza layout/reflow](https://gist.github.com/paulirish/5d52fb081b3570c81e3a) — Lista detallada de Paul Irish sobre qué dispara reflows
- [Intl.Segmenter (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter) — El API del navegador que PreTeXt usa para segmentación de texto Unicode
- [Arquitectura de Islas](https://jasonformat.com/islands-architecture/) — Artículo original de Jason Miller sobre el patrón usado por Astro
