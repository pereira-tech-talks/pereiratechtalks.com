---
title: "Migrando Pereira Tech Talks: de Ghost a Astro"
description: "pereiratechtalks.org: de Ghost dockerizado con costos mensuales a Astro estático en GitHub Pages. Diez años de lecciones en dos semanas."
pubDate: "2024-08-03"
heroImage: "/images/blog/posts/pereira-tech-talks-migration/hero.webp"
heroLayout: "banner"
tags: ["portfolio", "tech", "web-development", "devops", "astro"]
keywords: ["migrar de Ghost a Astro", "Astro vs Ghost CMS", "sitio estático gratis con Astro", "GitHub Pages con Astro", "migración de blog a sitio estático", "Pereira Tech Talks historia y rediseño", "cómo migrar un blog a Astro"]
---

Hace dos días di la charla [Astro en Acción](/es/blog/astro-in-action/) en Pereira. El proyecto estrella de esa noche — la demo en vivo que mostré frente a la audiencia — fue la migración completa de [pereiratechtalks.org](https://www.pereiratechtalks.org/) a Astro. Pero una charla de 45 minutos no alcanza para contar la historia completa. Esto es el deep dive.

---

## El comienzo: Ghost en 2014

[Pereira Tech Talks](https://www.pereiratechtalks.org/) nació en 2014 — una comunidad local de tecnología en Pereira, Colombia. Desde el primer día necesitaba un sitio web. Y la elección natural en ese momento fue **Ghost**.

Ghost era una buena opción. Open source, construido en Node.js, editor limpio, pensado específicamente para blogging. Era el antídoto a WordPress — sin plugins infinitos, sin base de código inflada. Solo escribir, publicar, compartir.

<figure>
<img src="/images/blog/posts/pereira-tech-talks-migration/ghost-cms.webp" alt="Ghost CMS — independent technology for modern publishing" width="1200" height="675" loading="lazy" />
<figcaption>La página de Ghost en 2014 — el "antídoto a WordPress" que impulsó pereiratechtalks.org durante una década antes de la migración.</figcaption>
</figure>

Lo montamos y funcionó bien durante años. La comunidad creció. Los eventos se llenaron. Los posts del blog llegaban. Todo corría en Digital Ocean — inicialmente $5/mes, después $8.43 con backups activados. Pequeño, manejable, nuestro.

---

## La arquitectura Docker

Para mantener todo ordenado, construimos una arquitectura Docker con cuatro contenedores: **MySQL** como base de datos, **Ghost** como CMS, **Nginx** como proxy reverso y **Certbot** para los certificados SSL. Cada pieza en su lugar, orquestada con Docker Compose.

<figure>
<img src="/images/blog/posts/pereira-tech-talks-migration/docker-architecture.webp" alt="Arquitectura Docker para pereiratechtalks.org — contenedores MySQL, Ghost, Nginx y Certbot" width="1200" height="675" loading="lazy" />
<figcaption>La configuración Docker de cuatro contenedores que mantuvo el sitio funcionando durante años — y que requería migraciones manuales de MySQL cada vez que Ghost se actualizaba.</figcaption>
</figure>

El repositorio está en [github.com/pereira-tech-talks/ghostDocker](https://github.com/pereira-tech-talks/ghostDocker). Funcionaba. Era estable. Era lo que necesitábamos en ese momento.

Pero con el tiempo, el costo dejó de ser solo dinero.

---

## El dolor real: mantenimiento

Ghost actualiza constantemente. Una versión nueva cada pocas semanas. Y cada actualización mayor traía consigo migraciones de MySQL que — cuando salían bien — eran automáticas. Cuando salían mal, eran una tarde entera revisando logs, ejecutando scripts de migración a mano y rezando para que los datos llegaran intactos al otro lado.

Hubo épocas donde el sitio estuvo meses sin actualizar porque nadie tenía tiempo para el ritual. Los meses se acumulaban. Las versiones también. Y mientras más tiempo pasaba sin actualizar, más difícil se volvía el proceso cuando finalmente había que hacerlo.

El problema no era Ghost. Ghost es una buena herramienta. El problema era el modelo: un servidor con estado, con base de datos, con dependencias que evolucionaban. Para un sitio comunitario que nadie atiende de tiempo completo, ese modelo tiene un costo oculto que se cobra en tiempo y estrés.

Los $8.43/mes no eran el problema. El mantenimiento era el problema.

---

## Los requisitos para el reemplazo

Antes de evaluar cualquier alternativa, escribí la lista. No negociable:

- **Ligero** — Nada de servidores con estado
- **Estático** — HTML puro, sin base de datos
- **Soporte para blog comunitario** — Contribuciones vía pull requests
- **Landing page** — Presentación de la comunidad
- **Fácil de mantener** — Que cualquier miembro de la comunidad pueda contribuir
- **Fácil de desplegar** — Sin rituales de migración
- **Gratis** — O tan cerca de gratis como sea posible

La última era la que más importaba a largo plazo: si el sitio dependía de un presupuesto, dependía de que alguien pagara. Una comunidad open source no debería tener ese punto de falla.

---

## Evaluando opciones: primero Hugo

La primera alternativa que consideré fue [Hugo](https://gohugo.io/). Ya lo conocía bien — había construido [rocka.co](https://rocka.co) con Hugo y me había dado buenos resultados. Rápido, estático, sin dependencias de runtime.

Encontré el tema [Hinode](https://gethinode.com/) — limpio, bien documentado, pensado para proyectos de comunidad. Monté una base en el repositorio de [pereiratechtalks.org](https://github.com/pereira-tech-talks/pereiratechtalks.org), ajusté algunos colores, empecé a estructurar el contenido.

Y ahí se quedó. Por meses.

Hugo tenía las bases correctas pero algo no fluía. El ciclo de contribución para posts de comunidad se sentía más tedioso de lo que debía. También miré **Medium** como alternativa — plataforma lista, cero mantenimiento. Pero Medium es de pago para publicaciones privadas y no es suficientemente open source para un proyecto comunitario donde la gente quiere ser dueña del contenido. Descartado.

La carpeta de Hugo siguió esperando.

---

## Descubriendo Astro

Empecé a escuchar sobre Astro y Svelte. Al principio con escepticismo — el ecosistema JavaScript tiene un historial de "el nuevo framework que lo va a cambiar todo". Pero seguí viendo menciones, casos de estudio reales, equipos serios que lo adoptaban.

Decidí probarlo. Leí la documentación. Construí sitios de demo pequeños. Experimenté con la arquitectura de islas, con Content Collections, con el enfoque de cero JavaScript por defecto.

Me convencí rápido. Astro no era otro framework más — era una filosofía diferente sobre cómo construir para la web. Svelte encajaba perfectamente como capa interactiva: compilado, ligero, sin runtime.

Cuando empecé a planear la charla **Astro en Acción**, la decisión fue natural: la demo sería la migración real de Pereira Tech Talks. No un proyecto de juguete, sino el sitio de la comunidad — en producción.

---

## La migración: dos semanas, un desarrollador

Me puse el objetivo de tener el sitio listo antes de la charla. Dos semanas. Un solo desarrollador — yo.

El resultado: [v2.pereiratechtalks.org](https://v2.pereiratechtalks.org/) — sitio estático completo, blog con Content Collections, landing page de la comunidad, desplegado en **GitHub Pages** con **GitHub Actions**. Cada push a `main` dispara el build y el despliegue. Sin servidor. Sin base de datos. Sin rituales de migración.

Los posts del blog se escriben en Markdown y se publican vía pull request — el flujo natural para una comunidad open source. Cualquier miembro puede contribuir con el mismo flujo que usaría para contribuir a cualquier otro proyecto de código abierto.

---

## Los números: Lighthouse antes y después

Una de las cosas que me sorprendió fue que Ghost no tenía malos números. Una instalación bien configurada de Ghost con Nginx y caché tiene rendimiento decente:

<figure>
<img src="/images/blog/posts/pereira-tech-talks-migration/lighthouse-ghost.webp" alt="Puntuaciones Lighthouse para la versión Ghost — Rendimiento 90, Accesibilidad 91, Mejores Prácticas 100, SEO 100" width="1200" height="400" loading="lazy" />
<figcaption>Puntajes Lighthouse de Ghost antes de la migración — un rendimiento de 90 es sólido para un CMS con base de datos, pero requería una configuración de servidor bien afinada.</figcaption>
</figure>

Rendimiento 90, Accesibilidad 91, Mejores Prácticas 100, SEO 100. Nada de qué avergonzarse.

Pero Astro llegó a otros números casi sin esfuerzo:

<figure>
<img src="/images/blog/posts/pereira-tech-talks-migration/lighthouse-astro.webp" alt="Puntuaciones Lighthouse para la versión Astro — Rendimiento 99, Accesibilidad 96, Mejores Prácticas 100, SEO 100" width="1200" height="400" loading="lazy" />
<figcaption>Puntajes Lighthouse de Astro después de la migración — rendimiento de 99 con HTML estático en un CDN, sin optimización manual.</figcaption>
</figure>

Rendimiento 99, Accesibilidad 96, Mejores Prácticas 100, SEO 100. La diferencia entre 90 y 99 en rendimiento puede sonar pequeña en papel — pero en velocidad de carga real, en Core Web Vitals, en experiencia de usuario en conexiones lentas, esos 9 puntos son significativos.

Y lo más importante: esos números vienen de HTML estático en un CDN. No de un servidor bien afinado. No de horas de optimización. Vienen del modelo por defecto de Astro.

---

## El resultado: de $8.43 a $0

| Antes | Después |
|-------|---------|
| Ghost + Docker + Digital Ocean | Astro + GitHub Pages |
| $8.43/mes | $0/mes |
| Actualizaciones manuales de MySQL | `git push` |
| Un solo maintainer | Contribuciones open source |
| Servidor con estado | HTML estático en CDN |
| Proceso de despliegue manual | GitHub Actions automatizado |

Diez años de historia de Pereira Tech Talks — charlas, eventos, posts de la comunidad — ahora viven en archivos Markdown en un repositorio público. Cualquiera puede hacer un fork. Cualquiera puede contribuir. Nadie depende de que alguien recuerde pagar la factura del servidor.

Si tienes posts que quieres agregar al blog de la comunidad, el flujo es simple: fork, escribe tu post en Markdown, abre un pull request. El repositorio está en [github.com/pereira-tech-talks/pereiratechtalks.org](https://github.com/pereira-tech-talks/pereiratechtalks.org).

---

## ¿Recomiendo Astro?

Sin reservas. Se convirtió en mi framework por defecto para cualquier proyecto web estático o centrado en contenido. No es solo una herramienta mejor — cambió cómo pienso sobre construir para la web.

La pregunta que me hago ahora antes de cualquier proyecto nuevo no es "¿qué framework uso?" sino "¿cuánto de esto realmente necesita ser dinámico?" Casi siempre la respuesta es: menos de lo que creía. Y para esa parte estática, Astro es imbatible.

El sitio está en vivo. La comunidad sigue activa. Y por primera vez en diez años, no hay una factura mensual esperando.

A seguir construyendo.

---

## Recursos

- [v2.pereiratechtalks.org](https://v2.pereiratechtalks.org/) — El sitio migrado
- [github.com/pereira-tech-talks/pereiratechtalks.org](https://github.com/pereira-tech-talks/pereiratechtalks.org) — Repositorio del sitio Astro
- [github.com/pereira-tech-talks/ghostDocker](https://github.com/pereira-tech-talks/ghostDocker) — La arquitectura Docker original
- [Slides de Astro en Acción](https://slides.com/xergioalex/astro-in-action) — La charla donde presenté esta migración
- [Astro Documentation](https://docs.astro.build/) — Para empezar con Astro
