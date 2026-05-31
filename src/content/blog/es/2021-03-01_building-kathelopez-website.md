---
title: "Construyendo kathelopez.com: la web que le construí a mi esposa"
description: "Sitio estático sin framework para mi esposa, terapeuta ABA y neuropsicóloga: Bootstrap, GitHub Pages y cero backend para su presencia profesional."
pubDate: "2021-03-01"
heroImage: "/images/blog/posts/building-kathelopez-website/hero.webp"
heroLayout: "side-by-side"
tags: ["portfolio", "tech", "personal", "web-development"]
keywords: ["construir sitio web profesional con Bootstrap", "GitHub Pages sitio web gratuito", "sitio web para psicólogo o terapeuta", "landing page estática sin backend", "Bootstrap para sitio web personal", "presencia en línea para profesionales de la salud", "sitio web terapeuta ABA"]
---

Mi esposa necesitaba un sitio web.

No una landing page de startup. No un producto SaaS. Un sitio profesional simple para una psicóloga construyendo su carrera en Pereira, Colombia. Kathe — Astrid Katherine López Vanegas — es terapeuta ABA y trabaja con niños con trastornos del neurodesarrollo. Había ido creciendo su práctica a través de referidos y el voz a voz, pero no tenía un solo lugar en internet donde un padre pudiera buscarla, ver sus credenciales y contactarla.

Ese es el tipo de problema que puedo resolver en un fin de semana. Y eso hice.

---

## Por Qué lo Necesitaba

La terapia ABA — Análisis de Comportamiento Aplicado — es un campo especializado. La mayoría de los pacientes de Katherine llegan por referidos de otros profesionales o clínicas. Pero pasa algo: cuando un padre recibe un referido, lo primero que hace es buscar el nombre en Google. Y si no aparece nada — ni sitio web, ni perfil profesional, ni forma de verificar credenciales — ese referido pierde peso.

Katherine tenía más de cuatro años de experiencia trabajando con niños con necesidades especiales. Había trabajado en Centro APAES, CGI Colombia, y estaba en Creer IPS Neurorehabilitación Integral. Tenía certificaciones en terapia ABA de Fono Genius, un diplomado en neuropsicopedagogía, un título de psicología de la Universidad Católica de Pereira. Después completaría una maestría en neuropsicología clínica en la Universidad Internacional de Valencia. Todo eso — y sin presencia web.

Quería arreglar eso. No como un desarrollador buscando un proyecto, sino como alguien que quería ayudar a la carrera de su esposa.

---

## El Enfoque: Por Qué Elegí No Usar Framework

Sé lo que estás pensando. Soy desarrollador full-stack. Trabajo con Astro, React, arquitecturas serverless, contenedores, pipelines de CI/CD. Podría haber construido esto en Next.js. Podría haber montado un CMS headless con un design system personalizado y despliegues automatizados.

No lo hice.

La razón: el sitio de Katherine es una sola página. Tiene una sección de "sobre mí", su experiencia, sus servicios, un formulario de contacto y sus credenciales. El contenido cambia quizás dos veces al año — cuando termina una certificación o actualiza su foto de perfil. No hay blog ni contenido dinámico, no hay cuentas de usuario. Nada que justifique un paso de build, un runtime de framework o una cuenta de hosting.

Así que fui con el stack más simple que hiciera el trabajo: **HTML, SCSS, Bootstrap 4, jQuery y GitHub Pages**. Costo total de hosting: cero. Overhead de framework: cero. Tiempo de despliegue: push a `master`.

Honestamente, lo más difícil no fue la tecnología. Fue resistir la tentación de sobreingeniería. Me sorprendí, más de una vez, pensando en agregar un CMS "por si acaso" o montar un pipeline de build con Webpack. Tuve que recordarme: esto no es para mí. Es para Kathe. Necesita que funcione, que se vea profesional y que esté arriba. Eso es todo.

---

## Qué Hace el Sitio

El sitio es un solo `index.html` con varias secciones, todo en una página con scroll.

### El Hero

Arriba, un banner de ancho completo con su nombre y una animación de texto rotativo — de esas donde las palabras van cambiando una por una:

*Soy Psicóloga. / Terapeuta. / Terapeuta ABA. / Neuropsicóloga.*

Animación CSS simple. Le da a los visitantes una idea inmediata de lo que hace sin leer un párrafo.

### Sobre Mí

Su biografía profesional — quién es, su filosofía, su enfoque terapéutico. El tono es cálido y directo: se describe como empática, organizada y comprometida con mejorar el bienestar psicológico de sus pacientes. Hay una foto profesional al lado del texto.

<figure>
<img src="/images/blog/posts/building-kathelopez-website/about-section.webp" alt="Sección &quot;Sobre Mí&quot; de kathelopez.com con foto profesional y biografía" loading="lazy" />
<figcaption>La sección Sobre Mí definitiva — tono cálido, credenciales claras y una foto que se lee como profesional sin verse corporativa.</figcaption>
</figure>

La hoja de vida usa un layout con pestañas — Experiencia, Educación, Certificaciones, Habilidades — para que los visitantes vayan directo a lo que buscan. Servicios está centrado en terapia ABA domiciliaria: Kathe va a la casa del niño, no al revés. Ese es el diferenciador real. Para el acabado, [AOS](https://michalsnik.github.io/aos/) para animaciones sutiles al hacer scroll, Bootstrap manejando el responsive sin un solo media query escrito a mano, y un efecto parallax decorativo en algunas secciones.

### Formulario de Contacto

Para el formulario, la solución obvia era un backend — Node.js, una función serverless, algo así. En cambio, usé **Google Forms**.

Hice ingeniería inversa del endpoint de envío y conecté un formulario HTML personalizado que hace POST directo a Google. Los datos van a un Spreadsheet, Kathe recibe un email. Sin servidor, sin claves API, sin nada que mantener. Tomó menos de lo que esperaba. Una vez funcionó, siguió funcionando.

La técnica completa está en [Cómo responder formularios de Google via Postman y Ajax](/es/blog/google-forms-postman-ajax).

### Hosting: GitHub Pages

Todo el sitio está alojado en **GitHub Pages** con un dominio personalizado — `kathelopez.com`. HTTPS gratis, despliegues automáticos al hacer push, cero configuración más allá de un archivo CNAME. No necesité Vercel ni Netlify ni un VPS. Push a `master` y está en línea. Para un sitio que se actualiza dos veces al año, es exactamente lo que necesita.

---

## La Marca

La versión inicial usaba una paleta genérica y no tenía logo propio. En febrero de 2021 lo rediseñamos, con ayuda de Julián Andrés — primo de Kathe y artista ([@nailuj.art](https://www.instagram.com/nailuj.art/)) — que nos echó una mano con el diseño.

El logo es una fusión entre la letra **K** de Katherine y el símbolo de la psicología — la letra griega psi (Ψ) — con un degradado de azul a rosa. El resultado mezcla las dos formas en un monograma que se lee como **AK** — sus iniciales, Astrid Katherine — pero que cualquier psicólogo reconoce de inmediato.

<figure>
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center; margin: 1.5rem 0;">
  <img src="/images/blog/posts/building-kathelopez-website/psychology-symbol.webp" alt="El símbolo de la psicología (Ψ), la letra griega psi" width="400" height="400" loading="lazy" />
  <img src="/images/blog/posts/building-kathelopez-website/logo.webp" alt="Logo final de kathelopez.com — monograma AK con degradado de azul a rosa" width="400" height="400" loading="lazy" />
</div>
<figcaption>El símbolo psi (izquierda) fusionado con la letra K para crear el monograma AK (derecha) — cualquier psicólogo reconoce ambas formas de inmediato.</figcaption>
</figure>

El color principal es **#c82c75** — un rosa/magenta que ella eligió. No era mi primera opción, honestamente. Yo habría ido con algo más sobrio. Pero es su sitio, su marca, su personalidad. Y viéndolo ahora, funciona. Poppins de Google Fonts para la tipografía, y listo.

El logo aparece en la tarjeta SEO cuando alguien comparte el enlace — su monograma, sus servicios, su información de contacto. Limpia, reconocible.

<figure>
<img src="/images/blog/posts/building-kathelopez-website/seo-card.webp" alt="Tarjeta SEO de kathelopez.com con el monograma AK, servicios e información de contacto" loading="lazy" />
<figcaption>La tarjeta de Open Graph — lo primero que ve alguien cuando comparten el enlace del sitio por WhatsApp o redes sociales.</figcaption>
</figure>

---

## Lo Que Aprendí

Construir para alguien que amas es diferente de construir para un cliente. No hay documento de alcance ni sprint planning. Solo hay: qué necesita ella, y cómo lo hago bien.

Y la respuesta, en este caso, fue: mantenlo simple.

Podría haber usado este proyecto como playground para tecnología nueva. Podría haber probado un generador de sitios estáticos, configurado despliegues automatizados, agregado un backend de formulario con funciones serverless. Pero nada de eso habría servido mejor a Katherine. Ella no necesita un pipeline de CI/CD. Necesita una página que cargue rápido, se vea profesional y tenga una forma de que la gente la contacte.

La herramienta correcta para el trabajo no siempre es la más nueva. A veces es Bootstrap 4, jQuery y un solo archivo HTML desplegado en GitHub Pages gratis. Y eso está bien.

También aprendí algo sobre el mantenimiento. Cuando construyes algo simple, el mantenimiento es simple también. No me da pereza actualizar su sitio. No hay un `npm audit` escupiendo 47 vulnerabilidades. No hay breaking changes de framework ni un config de Webpack que debuggear. Abro `index.html`, cambio lo que haga falta, push, y listo. Esa simplicidad no es una limitación — es una decisión deliberada.

El sitio de Katherine la ha ayudado a conectar con familias, mostrar sus credenciales y presentarse profesionalmente. No necesitó React para eso ni una base de datos. Necesitaba existir, verse bien y ser fácil de encontrar.

El sitio sigue arriba. Kathe sigue recibiendo pacientes. Eso es suficiente.

---

## Recursos

- **Repositorio en GitHub:** [xergioalex/kathelopez.com](https://github.com/xergioalex/kathelopez.com)
- **Sitio web en vivo:** [kathelopez.com](https://www.kathelopez.com/)

