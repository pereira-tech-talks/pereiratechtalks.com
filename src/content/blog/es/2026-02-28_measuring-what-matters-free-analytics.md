---
title: "Midiendo lo que Importa: Cómo Configuré Analytics Gratis Sin Sacrificar el Rendimiento"
description: "Capítulo cuatro sobre XergioAleX.com: analíticas gratis con herramientas privacy-first, puntajes Lighthouse 100 y sin banners de cookies."
pubDate: "2026-02-28"
heroImage: "/images/blog/posts/measuring-what-matters-free-analytics/hero.webp"
heroLayout: "side-by-side"
tags: ["tech", "web-development"]
keywords: ["analytics gratis sin cookies", "Umami Analytics alternativa a Google Analytics", "Cloudflare Web Analytics", "analíticas privadas sitio estático", "cómo medir visitas sin perder rendimiento Lighthouse", "analytics sin banners de cookies", "stack de analíticas gratuito para sitios web"]
series: "building-xergioalex"
seriesOrder: 4
---

El sitio estaba construido. Los [puntajes de Lighthouse](/es/blog/lighthouse-perfect-scores/) eran 100 en todas las categorías — Performance, Accessibility, Best Practices, SEO. Todo lo que podía medir sobre el sitio en sí se veía perfecto.

Pero no tenía idea si alguien lo estaba leyendo.

---

## Volando a Ciegas

Publicas un post al vacío. El sitio se sirve, pero no tienes idea si alguien lo está leyendo o si rebota en dos segundos. Quería arreglar eso sin deshacer todo lo que había pasado semanas perfeccionando.

Las restricciones eran claras:

1. **Todas las herramientas deben ser gratuitas.** Este es un sitio personal, no un producto SaaS. No voy a pagar $30/mes por heatmaps.
2. **Los puntajes de Lighthouse deben mantenerse en 100.** No pasé semanas optimizando rendimiento y accesibilidad para tirarlo a la basura con un script de tracking pesado.
3. **Sin banners de consentimiento de cookies.** Quiero que los visitantes lean mi contenido, no que cierren popups. La privacidad debería ser el estándar, no una opción.

---

## La Pregunta de Google Analytics

Déjame abordar esto directamente, porque es lo primero que todos preguntan: "¿Por qué no simplemente usar Google Analytics?"

Google Analytics 4 es gratis — en el sentido monetario. Pero el costo real se mide en kilobytes, cookies y complejidad.

**El script pesa ~70KB.** Para contexto, la fuente Atkinson Hyperlegible que usa este sitio pesa alrededor de 15KB. El script de tracking de GA4 es casi cinco veces más pesado que una fuente personalizada. En un sitio que apunta a Lighthouse 100, eso no es un error de redondeo — es una amenaza directa a tu puntaje de Performance. El script agrega 50-150ms de Total Blocking Time en el hilo principal.

**Establece cookies.** GA4 coloca cookies de primera parte `_ga` y `_ga_*` en el navegador de cada visitante. Bajo GDPR, estas constituyen datos personales. Lo que significa que necesitas un banner de consentimiento de cookies. Lo que significa más JavaScript, un elemento de UI que causa layout shifts, y una experiencia degradada para cada visitante nuevo.

**Los workarounds agregan complejidad.** Puedes usar Partytown para mover GA4 a un web worker y mantener el hilo principal limpio. Pero Partytown tiene problemas de compatibilidad con las View Transitions de Astro, agrega complejidad al build, y no resuelve el problema de las cookies.

Esta es la evaluación honesta: todo lo que GA4 proporciona — pageviews, sesiones, referrers, demografía, datos en tiempo real — puede cubrirse con alternativas más ligeras y sin cookies. Lo único que GA4 ofrece de forma exclusiva son segmentación de audiencia avanzada y funnels de conversión, que un blog personal no necesita.

Así que tomé la decisión: sin GA4. No porque sea malo — es una plataforma increíblemente poderosa — sino porque los trade-offs no tienen sentido para este sitio en particular.

---

## El Stack que Elegí

En lugar de una herramienta monolítica de analytics, armé un stack de herramientas gratuitas especializadas. Cada una es la mejor en lo que hace, y juntas cubren cada ángulo de medición que necesito.

### Cloudflare Web Analytics — El Regalo

Esta fue casi demasiado fácil. Como el sitio está desplegado en [Cloudflare Pages](https://pages.cloudflare.com), ya tenía acceso a Cloudflare Web Analytics. Viene incluido gratis con cada cuenta de Cloudflare.

Lo que lo hace especial es que requiere **cero cambios de código**. Cloudflare inyecta un beacon diminuto (~1KB) en el edge — nunca toca tu código fuente, tu pipeline de build, ni tu HTML. Lo habilitas en el dashboard con un solo clic.

Proporciona:
- Page views, visitas y visitantes únicos
- Páginas principales por tráfico
- Fuentes de referencia
- Países, navegadores y tipos de dispositivo
- **Real User Monitoring (RUM)** con Core Web Vitals: LCP, INP, CLS, FCP, TTFB

Ese último punto es crucial. Lighthouse te da puntajes de laboratorio — mediciones tomadas bajo condiciones controladas. Cloudflare te da **datos de campo** — lo que los usuarios reales experimentan. Puedes sacar 100 en Lighthouse pero tener un LCP lento para usuarios en Sudamérica en móvil. Solo los datos RUM revelan eso.

Sin cookies. Sin banner de consentimiento. Sin impacto en rendimiento. Estaba activado antes de que escribiera una sola línea de código de analytics.

### Umami — El Reemplazo de GA4

[Umami](https://umami.is) es una herramienta de analytics open-source enfocada en privacidad. La versión cloud tiene un tier gratuito que soporta hasta 1 millón de eventos por mes — más que suficiente para cualquier sitio personal.

Lo que me atrajo de Umami fue la combinación de funcionalidades y filosofía:

- **Sin cookies por diseño.** Sin cookies, sin fingerprinting, sin recolección de datos personales. Compatible con GDPR de fábrica.
- **Script de ~2KB.** Compara eso con los ~70KB de GA4. El script carga con `defer` y tiene cero impacto en el renderizado de la página.
- **Dashboard limpio.** Páginas principales, referrers, tracking de campañas UTM, eventos personalizados, bounce rate, tiempo en página — presentado en una interfaz rápida y sin distracciones.
- **Eventos personalizados.** Puedo trackear interacciones específicas — clics en enlaces externos, cambios de idioma, engagement con posts — llamando una simple función `trackEvent()`.

La integración fue directa. Un tag `<script>` en `BaseHead.astro`, renderizado condicionalmente solo cuando la variable de entorno `PUBLIC_UMAMI_WEBSITE_ID` está configurada:

```astro
{ANALYTICS.umami.websiteId && (
  <script
    defer
    src={ANALYTICS.umami.scriptUrl}
    data-website-id={ANALYTICS.umami.websiteId}
  />
)}
```

Si la variable de entorno no está configurada — como en desarrollo local — el script simplemente no se renderiza. Cero overhead.

Así se ve el dashboard de Umami un día después de ponerlo en producción — visitantes, vistas, bounce rate, duración de visita, todo en un solo lugar:

<figure>
<img src="/images/blog/posts/measuring-what-matters-free-analytics/umami-dashboard-overview.webp" alt="Dashboard de Umami mostrando 305 visitantes, 333 visitas, 473 vistas, 85% bounce rate y 1m 8s de duración de visita con gráfico de tráfico de 24 horas" loading="lazy" />
<figcaption>Datos del primer día — 305 visitantes, 85% bounce rate, 1m 8s de sesión promedio. Una historia de tráfico real desde un script de 2KB sin cookies.</figcaption>
</figure>

### Eventos Personalizados de Umami — Clics Sin Peso Extra

Umami no es solo page views. También soporta eventos personalizados, lo que me permite medir clics relevantes sin agregar un segundo script de comportamiento.

Para un blog, esto da señales accionables con payload mínimo:
- **¿Los lectores hacen clic en posts relacionados?** Medir clics en el bloque de "artículos relacionados".
- **¿Hacen clic en CTAs clave?** Medir newsletter, contacto y enlaces externos.
- **¿Usan el cambio de idioma o los tags?** Medir interacciones de navegación y filtros.

La instrumentación es explícita y privacy-first: solo se envían los eventos que yo decido rastrear.

Así se ve la sección de eventos — cada tipo de evento con su color en el gráfico, con los conteos abajo:

<figure>
<img src="/images/blog/posts/measuring-what-matters-free-analytics/umami-events-chart.webp" alt="Dashboard de eventos de Umami mostrando 243 eventos en 8 tipos incluyendo scroll_depth, nav_click, blog_card_click y ai_bot_visit" loading="lazy" />
<figcaption>Eventos personalizados rastreados el primer día — cada tipo de evento elegido deliberadamente, solo las interacciones que vale la pena medir explícitamente.</figcaption>
</figure>

### Google Search Console + Bing Webmaster Tools — La Capa SEO

Estas dos no son scripts de analytics — son herramientas solo de dashboard. En Google Search Console, la propiedad de dominio se puede verificar por DNS TXT. Cero impacto en rendimiento.

**Google Search Console** responde la pregunta que todo creador de contenido necesita saber: "¿Qué está buscando la gente para encontrar mi sitio?" Muestra qué queries generan impresiones, cuáles obtienen clics, y la posición promedio para cada una. Para un blog, esto es oro. Puedes ver qué posts rankean para qué términos, cuáles están en tendencia, y cuáles tienen muchas impresiones pero bajo click-through (lo que significa que el título y la descripción necesitan trabajo).

**Bing Webmaster Tools** proporciona datos de búsqueda similares, pero con una adición única: el **reporte AI Performance**. Lanzado en 2026, muestra qué tan seguido tu contenido es citado en Microsoft Copilot y en resúmenes generados por IA en Bing. A medida que la búsqueda impulsada por IA se vuelve más prevalente, esta es una de las únicas herramientas que da visibilidad sobre cómo los motores generativos usan tu contenido.

La etiqueta de verificación de Bing se renderiza condicionalmente:

```astro
{ANALYTICS.verification.bing && (
  <meta name="msvalidate.01" content={ANALYTICS.verification.bing} />
)}
```

### Lighthouse CI — El Guardián Automatizado

La pieza final no se trata de medir visitantes — se trata de proteger todo lo que construí. [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) es un workflow de GitHub Actions que ejecuta auditorías de Lighthouse automáticamente en cada pull request.

Construye el sitio, prueba páginas clave contra presupuestos de rendimiento, y falla el PR si algún puntaje cae por debajo del umbral. Los presupuestos están configurados para coincidir con los estándares actuales del sitio:

- Performance: >= 95
- Accessibility: = 100
- Best Practices: >= 95
- SEO: >= 95

Los umbrales están ligeramente por debajo de 100 para tener en cuenta la variación del entorno de CI (los puntajes de Lighthouse pueden fluctuar 2-3 puntos entre ejecuciones), mientras aún detectan cualquier regresión real. Si accidentalmente agrego un script que bloquea el render, una imagen sin dimensiones, o rompo un patrón ARIA, Lighthouse CI lo señalará antes de que el código llegue a producción.

---

## La Prueba de Rendimiento

La pregunta que me hacía constantemente durante este proceso: **¿agregar todos estos analytics rompió mis puntajes perfectos de Lighthouse?**

El overhead total de todos los scripts de analytics es aproximadamente **2KB cargados asincrónicamente**:
- Umami: ~2KB (defer)
- Meta tags de verificación: despreciable

Para comparar, una sola imagen hero de blog pesa 50-200KB. Los scripts de analytics pesan menos que un JPEG pequeño.

Más importante aún, todos los scripts usan carga `defer` o `async`, lo que significa que no bloquean el renderizado de la página. No afectan el Largest Contentful Paint (LCP), el Cumulative Layout Shift (CLS), ni el Total Blocking Time (TBT) — las tres métricas que determinan el puntaje de Performance de Lighthouse.

La respuesta: **no, los puntajes se mantuvieron en 100.** El sitio se despliega con los mismos puntajes perfectos que tenía antes de agregar analytics. La clave fue elegir las herramientas correctas desde el inicio — scripts ligeros y asíncronos en lugar de un solo tracker pesado.

---

## Lo que Puedo Medir Ahora

Con este stack implementado, tengo respuestas a preguntas que antes no podía responder:

| Pregunta | Herramienta |
|----------|-------------|
| ¿Cuántas personas visitan el sitio? | Cloudflare + Umami |
| ¿Qué posts del blog tienen más tráfico? | Umami (Top Pages) |
| ¿De dónde vienen los visitantes? | Umami (Referrers) |
| ¿Qué busca la gente para encontrar el sitio? | Google Search Console |
| ¿Los lectores interactúan con elementos clave del post? | Eventos personalizados de Umami |
| ¿Dónde hacen clic los visitantes? | Eventos de clic en Umami |
| ¿El sitio es rápido para usuarios reales? | Cloudflare (Core Web Vitals) |
| ¿Un cambio de código romperá el rendimiento? | Lighthouse CI (automático en PRs) |
| ¿El contenido es citado en herramientas de IA? | Bing Webmaster (AI Performance) |

Eso es cobertura completa — tráfico, comportamiento, búsqueda, rendimiento y visibilidad en IA — con cero dólares gastados y cero deuda de privacidad incurrida.

---

## La Decisión Arquitectónica: Todo Condicional

Una decisión de diseño que vale la pena destacar: cada integración de analytics es **condicional**. Los scripts y meta tags solo se renderizan cuando sus variables de entorno correspondientes están configuradas.

En la práctica, esto significa:
- **Desarrollo local** tiene cero overhead de analytics. Sin scripts de tracking, sin requests externos.
- **Producción** carga solo las herramientas que hayas configurado. Configura una variable, obtienes una herramienta. Configura todas, obtienes el stack completo.
- **Nuevos entornos** funcionan inmediatamente sin analytics — nada se rompe si las variables no están configuradas.

Esto se implementó a través de un objeto de configuración `ANALYTICS` centralizado en `src/lib/constances.ts` que lee de `import.meta.env`:

```typescript
export const ANALYTICS = {
  umami: {
    websiteId: import.meta.env.PUBLIC_UMAMI_WEBSITE_ID || '',
    scriptUrl: 'https://cloud.umami.is/script.js',
  },
  verification: {
    bing: import.meta.env.PUBLIC_BING_SITE_VERIFICATION || '',
  },
} as const;
```

Todas las variables usan la convención de prefijo `PUBLIC_` de Astro, que las hace disponibles en tiempo de build para renderizado del lado del cliente. La aserción `as const` le da a TypeScript inferencia de tipos completa sobre la configuración.

---

## El Primer Día de Datos

Un día después de configurar todo, el dashboard ya estaba contando una historia. Esto es lo que apareció.

Qué páginas reciben más visitas — el primer post de la serie dominó con el 82% del tráfico:

<figure>
<img src="/images/blog/posts/measuring-what-matters-free-analytics/umami-top-pages.webp" alt="Reporte de páginas en Umami mostrando las páginas más visitadas, lideradas por el post de Astro y Svelte con 82%" loading="lazy" />
<figcaption>Páginas más visitadas después del primer día — el primer post de la serie dominó el tráfico con un 82%, confirmando de dónde venía la audiencia inicial.</figcaption>
</figure>

Sesiones individuales de visitantes — país, ciudad, navegador, dispositivo, todo sin cookies:

<figure>
<img src="/images/blog/posts/measuring-what-matters-free-analytics/umami-sessions-activity.webp" alt="Tabla de actividad en Umami mostrando sesiones individuales de Colombia, Estados Unidos, Canadá, Alemania, Portugal con detalles de navegador y dispositivo" loading="lazy" />
<figcaption>Sesiones individuales — país, ciudad, navegador y dispositivo visibles sin una sola cookie ni banner de consentimiento.</figcaption>
</figure>

El desglose de navegadores — Chrome lidera con 39%, seguido por iOS y Safari:

<figure>
<img src="/images/blog/posts/measuring-what-matters-free-analytics/umami-browsers.webp" alt="Panel de entorno en Umami mostrando distribución de navegadores: Chrome 39%, iOS 25%, Safari 13%, Firefox 9%" loading="lazy" />
<figcaption>Distribución de navegadores después de 24 horas — Chrome lidera, pero iOS y Safari juntos representan el 38%, una señal móvil importante.</figcaption>
</figure>

De dónde vienen los visitantes — 11 países en las primeras 24 horas, con Estados Unidos al 55% y Colombia al 7%:

<figure>
<img src="/images/blog/posts/measuring-what-matters-free-analytics/umami-countries.webp" alt="Panel de ubicación en Umami mostrando países de visitantes: Estados Unidos 55%, Canadá 9%, Colombia 7%, Alemania 7%, Reino Unido 5%" loading="lazy" />
<figcaption>Países de visitantes en las primeras 24 horas — 11 países, Estados Unidos liderando con 55%, un alcance geográfico más amplio de lo esperado para un sitio nuevo.</figcaption>
</figure>

Y la vista geográfica con el mapa de calor de tráfico — cuándo llegan los visitantes durante la semana:

<figure>
<img src="/images/blog/posts/measuring-what-matters-free-analytics/umami-world-map-traffic.webp" alt="Mapa mundial mostrando ubicación de visitantes y mapa de calor de tráfico por día y hora" loading="lazy" />
<figcaption>Vista geográfica y mapa de calor de tráfico — el patrón semanal que muestra cuándo llegan los visitantes por día y hora.</figcaption>
</figure>

Todo esto con un script de 2KB, sin cookies, y cero impacto en los puntajes de Lighthouse.

---

## Mirando Atrás

Este fue el cuarto capítulo de construir XergioAleX.com:

1. **Construyendo la plataforma** — arquitectura, decisiones de tecnología, el camino de una página a un sitio completo.
2. **La marca** — la identidad visual del Ninja Coder que le dio alma al sitio.
3. **Perfeccionando los puntajes** — el trabajo meticuloso de lograr Lighthouse 100 en todas las categorías.
4. **Midiendo el impacto** — agregar un stack completo de analytics sin deshacer nada de ese trabajo.

Cada capítulo se construyó sobre el anterior. Las decisiones arquitectónicas del capítulo uno (Astro, generación estática, islands) y la identidad de marca del capítulo dos le dieron al sitio su base. El trabajo de rendimiento del capítulo tres estableció la restricción para el capítulo cuatro: cualquier analytics que agregara no podía comprometer lo que ya había logrado.

Rápido, accesible, medible y privado. Todo gratis. No tienes que elegir entre entender a tus usuarios y respetarlos.

---

## Recursos

- [Cloudflare Web Analytics](https://developers.cloudflare.com/web-analytics/) — RUM inyectado en el edge con Core Web Vitals
- [Umami Analytics](https://umami.is) — Analytics de tráfico open-source y sin cookies
- [Google Search Console](https://search.google.com/search-console) — Rendimiento de búsqueda e indexación
- [Bing Webmaster Tools](https://www.bing.com/webmasters) — Búsqueda + tracking de citaciones IA
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) — Auditorías de rendimiento automatizadas en CI
