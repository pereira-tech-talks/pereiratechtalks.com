---
title: 'WebVR con A-Frame'
description: 'Creando experiencias VR con HTML — charla en Pereira Tech Talks sobre A-Frame, el framework de Mozilla que lleva la realidad virtual a la web sin configuración.'
pubDate: '2018-02-16'
heroImage: '/images/blog/posts/webvr-aframe/webvr-aframe-talk-hero.webp'
heroLayout: 'banner'
tags: ["talks", "tech", "javascript", "web-development"]
keywords: ["realidad virtual con HTML", "A-Frame WebVR tutorial", "crear experiencias VR en el navegador", "A-Frame para principiantes", "WebVR con JavaScript", "realidad virtual sin Unity", "framework VR de Mozilla A-Frame"]
---

Realidad virtual en la web sin herramientas especializadas ni configuración compleja — esa era la promesa que quería compartir en Pereira Tech Talks. A-Frame es un framework que te permite crear experiencias 3D y VR usando solo HTML y JavaScript, sin pasos de construcción. Si sabés HTML, podés hacer VR.

---

## Por qué la web para VR

Empecé hablando del hardware. Los visores de gama alta — HTC Vive, Oculus Rift, Sony VR — cuestan cientos de dólares. Pero la barrera de entrada baja mucho con opciones como Cardboard (unos 7 USD) o VR Box (unos 15 USD). La web es la plataforma de distribución masiva más importante: no necesitas instalar nada, solo un navegador.

[WebVR](https://immersive-web.github.io/webvr/spec/1.1/) es el estándar que define las APIs que un navegador debe exponer para que los desarrolladores creen experiencias de realidad virtual. La mayoría de experiencias WebVR pesan menos de 2 MB. Y si ya conoces WebGL o Three.js, añadir un poco de código te da WebVR.

---

## A-Frame: VR con HTML

[A-Frame](https://aframe.io/) es un framework open-source de Mozilla construido sobre Three.js. No tienes que lidiar con WebGL directamente. Usa una arquitectura de **Entity-Component System**:

- **Entities** — Objetos contenedores a los que se les pueden adjuntar componentes. Son la base de todo en la escena.
- **Components** — Módulos reutilizables que dan apariencia, comportamiento o funcionalidad a las entidades.
- **Systems** — Proporcionan alcance global, gestión y servicios para clases de componentes.

El inspector web de A-Frame da la sensación de trabajar con Unity — puedes inspeccionar y modificar la escena en tiempo real.

---

## Lo que mostré en la charla

Hice varias demos en vivo, desde lo más básico hasta proyectos más elaborados:

- **Primitivos** — Cubos, esferas, cilindros con HTML ([demo en CodePen](https://codepen.io/xergioalex/pen/jZxbdo))
- **Sky e imágenes equirectangulares** — Escenas 360° con fotos
- **Texturas y animaciones** — Atributos, stats, animación de cámara
- **Modelos 3D** — Collada, SketchUp 3D Warehouse, Blender
- **Vídeo y audio** — Contenido multimedia en VR
- **Eventos de cursor** — Interacción con el puntero
- **Física** — Con Cannon.js
- **Colisiones y laberintos** — Proyectos como [webvr-maze](https://github.com/xergioalex/webvr-maze)
- **Reconocimiento de voz** — Comandos por voz en VR

También mostré proyectos de inspiración: A-Painter de Mozilla, A-Frame City Builder, y la integración con React.

---

## Recursos

- [Ver slides](https://slides.com/xergioalex/webvr-aframe)
- [A-Frame docs](https://aframe.io/docs/0.6.0/introduction/)
- [A-Frame Registry](https://aframe.io/aframe-registry/) — Componentes de la comunidad
- **Demos en CodePen:** [Primitivos](https://codepen.io/xergioalex/pen/jZxbdo), [Sky e inspector](https://codepen.io/xergioalex/pen/PQeZYy), [Texturas](https://codepen.io/xergioalex/pen/VQxepd), [Modelos 3D](https://codepen.io/xergioalex/pen/JpvXrz), [Física](https://codepen.io/xergioalex/pen/wyjowM), [Laberinto](https://github.com/xergioalex/webvr-maze)
- [Post del blog de Pereira Tech Talks](https://www.pereiratechtalks.org/realidad-virtual-para-la-web-con-a-frame-y-point-free-javascript-con-ramdajs) — resumen del evento

<figure>
  <img src="/images/blog/posts/webvr-aframe/webvr-aframe-event-memories.webp" alt="Memorias del evento" loading="lazy" />
  <figcaption>La audiencia de Pereira Tech Talks explorando demos en vivo de A-Frame WebVR en sus teléfonos durante la charla.</figcaption>
</figure>

---

La web sigue siendo la plataforma más accesible para experimentar con nuevas tecnologías. WebVR abrió puertas que todavía vale la pena explorar — incluso mientras el estándar evoluciona hacia WebXR, la idea central permanece: hacer las experiencias inmersivas universalmente accesibles.

A seguir construyendo.
