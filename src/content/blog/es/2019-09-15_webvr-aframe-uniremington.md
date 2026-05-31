---
title: 'WebVR con A-Frame (Charla UniRemington)'
description: 'Llevando realidad virtual a la web y por qué democratizar VR importa. De fotos 360° a mundos 3D interactivos, todo con HTML y JavaScript.'
pubDate: '2019-09-15'
heroImage: '/images/blog/posts/webvr-aframe-uniremington/hero.webp'
heroLayout: 'side-by-side'
tags: ["talks", "tech", "javascript", "web-development"]
keywords: ["WebVR con A-Frame charla universitaria", "realidad virtual accesible con el navegador", "VR con smartphone y Google Cardboard", "A-Frame HTML para realidad virtual", "WebVR para estudiantes", "realidad virtual sin hardware costoso", "comunidades tech en Pereira"]
---

La realidad virtual se sentía como un lujo cuando empecé a explorarla. Headsets de alta gama como el HTC Vive u Oculus Rift costaban cientos de dólares. La barrera de entrada era alta — hardware costoso, desarrollo específico de plataforma, motores 3D complejos. Luego descubrí **WebVR** y **A-Frame**, y todo cambió.

Esta charla en Universidad Remington fue sobre llevar VR a una audiencia universitaria — estudiantes, desarrolladores y mentes curiosas que quizás no tienen una PC gamer o un headset de $500. La web es la plataforma de distribución más accesible que tenemos. Si podés hacer que VR funcione en un navegador, podés llegar a cualquiera con un smartphone y un visor Cardboard de $15.

Antes de entrar en la tecnología, empecé invitando a la audiencia a unirse a las comunidades locales de tech en Pereira: [Sirius](https://sirius.utp.edu.co/jointdeveloper/), [PyPereira](https://pypereira.co/), [Pereira Tech Talks](https://pereiratechtalks.org/), [PereiraJs](https://pereirajs.org/). Estas comunidades son donde el aprendizaje real sucede — a través de meetups, talleres y proyectos compartidos.

## VR, AR y Mixed Reality

Primero, las definiciones:

**Realidad virtual (VR)** — Un entorno digital completamente inmersivo. Te ponés un headset y estás en otro lugar. El mundo real desaparece. Ejemplos: explorar un museo virtual, caminar por un modelo arquitectónico, jugar un juego en un mundo 3D.

**Realidad aumentada (AR)** — Elementos digitales superpuestos sobre el mundo real. Ves tu entorno, pero con información u objetos añadidos. Ejemplos: Pokémon GO, apps de vista previa de muebles, overlays de navegación.

**Realidad mixta (MR)** — Una mezcla de VR y AR donde objetos digitales y físicos interactúan. Los objetos digitales pueden ocluir los reales, y viceversa. Ejemplos: experiencias Microsoft HoloLens, apps AR avanzadas con conciencia espacial.

El panorama de hardware en 2019 iba desde costoso hasta accesible:

- **Alta gama:** HTC Vive (~$500+), Oculus Rift (~$400), Sony PlayStation VR (~$300)
- **Rango medio:** Oculus Go (~$200), Samsung Gear VR (~$130), Google Daydream (~$79)
- **Accesible:** Google Cardboard (~$7), visores VR Box genéricos (~$15)

Esa brecha de precio es enorme. Si el desarrollo VR requiriera un headset de $500, se quedaría en nicho. Pero con Cardboard, cualquiera con un smartphone puede probarlo. **La distribución masiva cambia el juego.** Ahí es donde entra la web.

## ¿Por qué WebVR?

La web es la plataforma de distribución masiva más importante. Sin app stores, sin instalación, sin gatekeeping de plataforma. Solo una URL. Si VR puede correr en un navegador, se vuelve accesible a miles de millones de dispositivos.

**WebVR** (ahora evolucionado a **WebXR**) es el estándar W3C que define las APIs que un navegador debe exponer para crear experiencias VR. Maneja:

- Detección de dispositivos (headsets, controles)
- Tracking de pose (posición de cabeza, rotación)
- Renderizado estereoscópico (vistas ojo izquierdo/derecho)
- Manejo de entrada (mirada, controles, voz)

La mayoría de experiencias WebVR pesan **menos de 2 MB**. Compará eso con una app VR nativa, que puede ser cientos de megabytes. Cargás una URL y estás en VR. Sin descarga, sin espera.

No necesitas aprender tecnologías nuevas. Si conocés **HTML** y **JavaScript**, podés construir VR. **A-Frame** lo hace aún más fácil al permitirte definir escenas 3D con sintaxis tipo HTML. Bajo el capó, A-Frame usa **Three.js**, una biblioteca 3D popular construida sobre **WebGL**. Si ya conocés Three.js o WebGL, agregar soporte WebVR es solo un poco de código. Si no, A-Frame abstrae la complejidad.

## A-Frame: Entity-Component System

[A-Frame](https://aframe.io/) es un framework para construir experiencias VR con tecnologías web. Usa una arquitectura **Entity-Component System (ECS)**, tomada de motores de juegos:

**Entities** — Objetos contenedores a los que se adjuntan componentes. Pensá en una entity como una "cosa" en la escena: una caja, una luz, una cámara, un sonido. Las entities definen **qué** existe.

**Components** — Módulos reutilizables que proveen apariencia, comportamiento o funcionalidad. Los componentes definen **cómo** las entities se ven y actúan. Ejemplos: `geometry`, `material`, `position`, `rotation`, `light`, `sound`.

**Systems** — Gestores globales que manejan lógica para todas las instancias de un componente. Los systems son menos comunes en escenas simples pero útiles para optimización y estado compartido.

Acá va una escena A-Frame simple:

```html
<html>
  <head>
    <script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
  </head>
  <body>
    <a-scene>
      <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
      <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere>
      <a-cylinder position="1 0.75 -3" radius="0.5" height="1.5" color="#FFC65D"></a-cylinder>
      <a-plane position="0 0 -4" rotation="-90 0 0" width="4" height="4" color="#7BC8A4"></a-plane>
      <a-sky color="#ECECEC"></a-sky>
    </a-scene>
  </body>
</html>
```

Eso es todo. Abrilo en un navegador y estás en una escena 3D. Hace clic en el botón VR y cambia a modo estéreo para Cardboard o un headset. Sin paso de build, sin configuración compleja.

A-Frame también tiene un **inspector** (presiona `Ctrl+Alt+I` mientras ves una escena) que te permite inspeccionar y ajustar entities en tiempo real. Es como las DevTools del navegador para VR.

## Sistema de coordenadas

A-Frame usa un **sistema de coordenadas de mano derecha**:

- **Eje X:** Izquierda (-) a derecha (+)
- **Eje Y:** Abajo (-) a arriba (+)
- **Eje Z:** Adelante (-) a atrás (+)

La posición está en metros. `position="0 1.6 -2"` significa: en el origen horizontalmente, 1.6 metros arriba (aproximadamente altura de ojos) y 2 metros adelante en la escena.

Entender esto importa para ubicar objetos naturalmente y diseñar experiencias VR cómodas.

## Los demos

Mostré más de 20 demos en vivo para ilustrar las capacidades de A-Frame, desde primitivos hasta proyectos completos:

**Primitivos** — Formas básicas: cajas, esferas, cilindros, planos. [Demo CodePen](https://codepen.io/xergioalex/pen/jZxbdo)

**Sky e imágenes equirectangulares** — Fotos 360° como fondos. [Demo CodePen](https://codepen.io/xergioalex/pen/PQeZYy). Podés conseguir imágenes 360° gratis en [A-Frame Registry](https://aframe.io/aframe-registry/).

**Texturas** — Aplicando imágenes a superficies. [Demo CodePen](https://codepen.io/xergioalex/pen/VQxepd)

**Stats y atributos** — Ajustando posición, rotación, escala dinámicamente. [Demo CodePen](https://codepen.io/xergioalex/pen/LQmGdr)

**Animación de cámara** — Moviendo el punto de vista programáticamente. [Demo CodePen](https://codepen.io/xergioalex/pen/ddeGKq)

**Torus** — Una forma de dona. [Demo CodePen](https://codepen.io/xergioalex/pen/wyjMQB)

**Texto y múltiples animaciones** — Texto 3D con animaciones encadenadas. [Demo CodePen](https://codepen.io/xergioalex/pen/qxYbwM)

**Assets** — Cargando y reutilizando recursos eficientemente. [Demo CodePen](https://codepen.io/xergioalex/pen/eVrZpV)

**Modelos 3D (Collada)** — Importando archivos `.dae` de herramientas como Blender, SketchUp o Clara.io. [Demo CodePen](https://codepen.io/xergioalex/pen/JpvXrz). Modelos gratis: [3D Warehouse](https://3dwarehouse.sketchup.com/), [Clara.io](https://clara.io), [Blender](https://www.blender.org/).

**Videos** — Reproducción de video 360°. [Demo CodePen](https://codepen.io/xergioalex/pen/eVrZQQ)

**Audio** — Sonido espacial que cambia según tu posición. [Demo CodePen](https://codepen.io/xergioalex/pen/BYxzBw)

**Eventos de cursor** — Interacción basada en mirada (mirar algo para dispararlo). [Demo CodePen](https://codepen.io/xergioalex/pen/rJvLab)

**Formas del cursor** — Visuales personalizados del cursor. [Demo CodePen](https://codepen.io/xergioalex/pen/qxYNNO)

**Eventos A-Frame** — Escuchando y despachando eventos personalizados. [Demo CodePen](https://codepen.io/xergioalex/pen/MQQrwJ)

**Galería** — Una galería de fotos 360° caminable. [Repo GitHub](https://github.com/xergioalex/webvr-gallery)

**Física (Cannon.js)** — Añadiendo gravedad y colisiones. [Demo CodePen](https://codepen.io/xergioalex/pen/wyjowM)

**Componente Sun** — Iluminación dinámica con un sol en movimiento. [Demo CodePen](https://codepen.io/xergioalex/pen/BYxLPB)

**Colisiones** — Detectando cuando los objetos se tocan. [Demo CodePen](https://codepen.io/xergioalex/pen/QQrGBO)

**Laberinto** — Un laberinto navegable con detección de colisiones. [Repo GitHub](https://github.com/xergioalex/webvr-maze)

**Reconocimiento de voz** — Comandos de voz en VR usando la Web Speech API. [Demo CodePen](https://codepen.io/xergioalex/pen/rJKxbm). Inspiración: [Storyteller de Pablo Zajdband](https://zajdband.com/storyteller/vr.html)

## Lo que resonó con la audiencia

La energía en el salón cambió cuando la gente se dio cuenta de que no necesitaban hardware costoso para probar VR. Algunos estudiantes tenían visores Cardboard. Uno sacó un teléfono y cargó uno de los demos. Ver a alguien **en el salón** experimentando VR que ellos mismos podían construir fue el momento aha.

La combinación de accesibilidad (web + Cardboard) y simplicidad (sintaxis basada en HTML) hizo que VR se sintiera alcanzable, no aspiracional. Eso es lo que quería — bajar la barrera e invitar a la gente a experimentar.

## Inspiración y créditos

Estos proyectos influyeron en mis demos y enfoque:

- [A-Painter](https://blog.mozvr.com/a-painter/) — App de pintura VR de Mozilla. Simple, hermosa, basada en navegador.
- [A-Frame City Builder](https://github.com/kfarr/aframe-city-builder) — Construye ciudades en VR.
- [Mini Mike's Metro Minis](https://github.com/mikelovesrobots/mmmm) — Una divertida simulación de tren de juguete VR.
- [Platzi — Curso Web VR](https://platzi.com/clases/web-vr/) — Excelente curso en español sobre WebVR.
- [A-Frame React](https://github.com/ngokevin/aframe-react) — Integrando A-Frame con React para VR dirigido por componentes.

---

La realidad virtual no tiene que ser costosa ni exclusiva. La web democratiza el acceso. A-Frame hace que la creación sea accesible. Cualquiera con un navegador puede experimentar VR. Cualquiera con habilidades web básicas puede construirlo.

Ese es el poder de WebVR — no solo experiencias inmersivas, sino experiencias inmersivas **accesibles**. VR para todos, construido con las herramientas que ya conocemos.

[Ver slides](https://slides.com/xergioalex/webvr-aframe-uniremington-talk)

A seguir construyendo.
