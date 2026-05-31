---
title: "La Mejor Forma de Desplegar tu Sitio Astro Gratis"
description: "Tras años en GitHub Pages, evalué opciones gratuitas y elegí Cloudflare Pages: lecciones y sorpresas al desplegar este sitio Astro."
pubDate: "2026-03-04T10:00:00"
heroImage: "/images/blog/posts/best-way-deploy-astro-site-free/hero.webp"
heroLayout: "side-by-side"
tags: ["tech", "web-development", "astro"]
keywords: ["cómo desplegar sitio Astro gratis", "Cloudflare Pages vs GitHub Pages Astro", "mejor plataforma para desplegar Astro", "despliegue gratuito de sitio estático", "Cloudflare Pages para sitios Astro", "GitHub Pages vs Cloudflare Pages comparación", "hosting gratuito para sitio web"]
series: "building-xergioalex"
seriesOrder: 7
---

Todo sitio tiene que vivir en algún lugar. Por un tiempo no pensé mucho en dónde — tenía GitHub Pages, funcionaba, y con eso bastaba. Pero cuando este sitio creció — más páginas, dos idiomas, procesamiento de imágenes, un blog con búsqueda — me di cuenta de que la plataforma de despliegue merecía la misma elección deliberada que el framework.

---

## Los Años de GitHub Pages

Llevo mucho tiempo desplegando sitios estáticos en GitHub Pages. Sitios de comunidades, proyectos paralelos, documentación. Conectar el repositorio, escribir un workflow de GitHub Actions, empujar a `gh-pages`. Siempre funcionó.

Cuando empecé a construir este sitio en Astro, GitHub Pages fue el primer instinto. Ya tenía las plantillas del workflow. Ya conocía los problemas comunes. El camino de menor resistencia.

Pero me detuve. No porque GitHub Pages me hubiera fallado — no lo hizo. Sino porque este sitio tenía más partes móviles que cualquier cosa que hubiera desplegado ahí antes. Quería elegir en lugar de caer por defecto.

---

## Evaluando las Alternativas

Tenía un requisito innegociable: **gratis**. Este es un sitio personal. No voy a pagar hosting mensual por un blog estático.

**GitHub Pages** era lo que conocía. Funciona bien para lo básico, pero los puntos de fricción se acumulan. No hay previews por rama — cada PR requería hacer merge para ver el resultado. El DNS con dominio propio implicaba configurar CNAMEs con un proveedor externo y esperar a que propagara. El pipeline de build depende completamente de ti — tú escribes el YAML, tú depuras las fallas. Y tiene un sesgo heredado hacia Jekyll que se nota en detalles como el archivo `.nojekyll` o el modelo de deploy basado en ramas.

Nada de eso era fatal por sí solo. Pero junto, era fricción que aceptaba por costumbre.

**Netlify** me gustaba, pero los límites de minutos de build en el plan gratis me hicieron querer ver todo el panorama antes de comprometerme.

**Vercel** lo conocía bien — había desplegado apps ahí, incluyendo proyectos Astro con modo servidor. Pero para un blog estático puro no necesitaba infraestructura optimizada para Next.js. Quería algo más simple.

Entonces miré **Cloudflare Pages**. Ancho de banda ilimitado, 500 builds al mes, previews ilimitados, y ya estás en la red de Cloudflare con todo lo que eso implica. Dejé de buscar.

---

## El Primer Despliegue

El proceso fue ridículamente corto. En el panel de Cloudflare, **+ Add** > **Pages**:

<figure>
<img src="/images/blog/posts/best-way-deploy-astro-site-free/step-1-add-pages.webp" alt="Menú de Cloudflare con la opción Pages seleccionada" class="prose-img-narrow" width="800" height="450" loading="lazy" />
<figcaption>El menú "+ Add" de Cloudflare — Pages aparece junto a Workers, R2 y herramientas de dominio como una opción de primera clase.</figcaption>
</figure>

Te da dos opciones — importar un repositorio de Git o subir archivos. La primera:

<figure>
<img src="/images/blog/posts/best-way-deploy-astro-site-free/step-2-get-started.webp" alt="Pantalla de inicio de Cloudflare Pages con la opción de importar repositorio Git" width="800" height="450" loading="lazy" />
<figcaption>Paso dos — conectar un repositorio Git o subir archivos directamente. La opción Git dispara despliegues automáticos con cada push.</figcaption>
</figure>

Seleccionas tu cuenta de GitHub y el repositorio:

<figure>
<img src="/images/blog/posts/best-way-deploy-astro-site-free/step-3-select-repo.webp" alt="Selección de cuenta GitHub y repositorio xergioalex.com" width="800" height="450" loading="lazy" />
<figcaption>Selector de repositorio — autoriza la app de GitHub de Cloudflare y selecciona el repo. Configuración única por cuenta.</figcaption>
</figure>

Y acá Cloudflare detectó Astro automáticamente. Completó el comando de build, el directorio de salida, la rama de producción — todo:

<figure>
<img src="/images/blog/posts/best-way-deploy-astro-site-free/step-4-build-settings.webp" alt="Configuración del build con Astro detectado, comando npm run build y directorio dist" width="800" height="450" loading="lazy" />
<figcaption>Configuración del build detectada automáticamente desde el repo — Astro reconocido, comando de build y directorio de salida completados sin configuración manual.</figcaption>
</figure>

Clic en **Save and Deploy**. Cuarenta segundos después el sitio estaba en un subdominio `pages.dev`. Eso fue todo.

No tuve que escribir un workflow nuevo para desplegar. Sigo usando GitHub Actions para el versionado, y también para correr los tests y linters en CI — siempre creo pull requests contra `main` y solo mezclo si pasan todas las validaciones. Pero el deploy en sí lo maneja Cloudflare. Hago push y el sitio se actualiza. En proyectos anteriores necesitaba workflows de 40 líneas solo para eso.

El DNS fue igual de directo. Apunté los nameservers a Cloudflare, agregué `xergioalex.com` como dominio personalizado, y el SSL se generó solo. Todo listo en menos de una hora — más rápido de lo esperado.

Honestamente, se sentía como lo que GitHub Pages debería haber evolucionado a ser.

### Lo que realmente cambió

Lo que más impactó mi día a día fueron los previews por rama. Cada pull request genera una URL de preview única. Antes, mi proceso era: correr `npm run dev`, verificar localmente, hacer merge, y esperar que todo estuviera bien. Ahora abro la vista previa del PR, verifico en el entorno desplegado real, y hago merge. El paso de "merge y rezar" desapareció.

Otro descubrimiento que no esperaba: el directorio `functions/` se detecta automáticamente y se despliega como middleware en el edge. Es decir, la plataforma que elegí solo porque era gratis resultó tener un runtime programable integrado.

---

## Lo Que Viene Incluido

Algo que no esperaba: Cloudflare te da un montón de cosas por defecto sin que tengas que hacer nada. Analíticas web se inyectan automáticamente en el edge — no hay que agregar scripts ni configurar nada en el código. SSL se genera solo. Protección DDoS está activa desde el primer momento. El sitio se sirve desde la red global de Cloudflare sin configuración adicional.

Y las variables de entorno se manejan desde el panel con valores distintos para preview y producción. Sin archivos `.env` en CI, sin secretos en el repositorio.

No busqué todo esto. Solo quería hosting gratis. Pero está ahí, y se nota.

A seguir construyendo.

---

## Recursos

- [Documentación de Cloudflare Pages](https://developers.cloudflare.com/pages/)
- [Desplegar un sitio Astro en Cloudflare Pages](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/)
- [Nivel Gratuito de Cloudflare Pages](https://www.cloudflare.com/developer-platform/products/pages/)
- [Cloudflare adquiere Astro](https://blog.cloudflare.com/cloudflare-acquires-astro/)
