---
title: "Construyendo Realidad Virtual para la Web: A-Frame, Laberintos y Galerías 360°"
description: "WebVR con HTML y JavaScript: laberinto, galería 360° y más de 20 demos que prueban que la RV en el navegador no exige hardware costoso."
pubDate: "2019-10-15"
heroImage: "/images/blog/posts/webvr-projects/hero.webp"
heroLayout: "side-by-side"
tags: ["portfolio", "tech", "javascript", "web-development"]
keywords: ["proyectos WebVR con A-Frame", "galería 360 grados en el navegador", "laberinto en realidad virtual con HTML", "A-Frame demos prácticos", "experiencias VR con JavaScript", "fotos 360 VR web", "portfolio WebVR A-Frame"]
---

Recuerdo el momento exacto en que hizo clic. Estaba mirando un archivo HTML simple — no un proyecto de Unity, no un engine en C++, no un Blueprint de Unreal — solo un archivo HTML. Agregué un `<script>`, escribí unos cuantos elementos personalizados, lo abrí en el navegador, y de repente estaba dentro de una habitación 3D. Incliné el teléfono, lo metí en un visor Cardboard de $7, y la habitación se movía conmigo. Realidad virtual. En un navegador. Desde un archivo HTML.

La tecnología se llama **WebVR**. El framework es **A-Frame**, creado por Mozilla. Y está a punto de convertirse en una de las madrigueras más divertidas en las que me he metido.

---

## La promesa: VR con solo HTML

El panorama actual de la VR tiene un problema. Los visores de gama alta como el HTC Vive y Oculus Rift costaban entre $400 y $500. El desarrollo requería Unity o Unreal Engine — potentes pero complejos. La barrera de entrada era alta, tanto para creadores como para usuarios.

Entonces apareció **A-Frame**. El framework open-source de Mozilla construido sobre Three.js que te permitía crear escenas de VR con sintaxis tipo HTML. Sin paso de compilación. Sin configuración compleja. Si sabías HTML, podías construir VR.

```html
<a-scene>
  <a-box position="-1 0.5 -3" rotation="0 45 0" color="#4CC3D9"></a-box>
  <a-sphere position="0 1.25 -5" radius="1.25" color="#EF2D5E"></a-sphere>
  <a-sky color="#ECECEC"></a-sky>
</a-scene>
```

<div class="not-prose my-6">
  <div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-(--box-shadow)">
    <iframe height="350" style="width:100%;" scrolling="no" title="A-Frame Primitivas" src="https://codepen.io/xergioalex/embed/jZxbdo?default-tab=result" frameborder="no" loading="lazy" allowfullscreen="true" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
    <p class="px-4 py-2 text-sm"><a href="https://codepen.io/xergioalex/pen/jZxbdo" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Ver demo en CodePen →</a></p>
  </div>
</div>

Eso es una escena 3D completa. Una caja azul, una esfera rosa y un cielo gris. Ábrelo en cualquier navegador y estás viendo un mundo 3D. Dale clic al botón de VR, y lo renderiza en estéreo para un visor. La simplicidad era revolucionaria.

Por debajo, A-Frame usa una arquitectura **Entity-Component System** tomada de los motores de videojuegos. Las entidades son contenedores. Los componentes les dan comportamiento — geometría, material, posición, física. Los sistemas manejan la lógica global. Es el mismo patrón que impulsa los juegos AAA, envuelto en HTML.

---

## Los demos: explorando A-Frame

No me limité a leer sobre A-Frame — construí cosas. En unas pocas semanas, creé **más de 20 demos en vivo** en CodePen, cada uno explorando una capacidad diferente:

<div class="grid grid-cols-1 gap-8 md:grid-cols-2 not-prose">

<div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-(--box-shadow)">
  <p class="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Primitivas</p>
  <p class="px-4 pb-2 text-sm text-gray-600 dark:text-gray-400">Cajas, esferas, cilindros en espacio 3D.</p>
  <iframe height="350" style="width:100%;" scrolling="no" title="A-Frame Primitivas" src="https://codepen.io/xergioalex/embed/jZxbdo?default-tab=result" frameborder="no" loading="lazy" allowfullscreen="true" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
  <p class="px-4 py-2 text-sm"><a href="https://codepen.io/xergioalex/pen/jZxbdo" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Ver demo en CodePen →</a></p>
</div>

<div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-(--box-shadow)">
  <p class="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Cielos 360°</p>
  <p class="px-4 pb-2 text-sm text-gray-600 dark:text-gray-400">Fotos panorámicas equirectangulares como fondos inmersivos.</p>
  <iframe height="350" style="width:100%;" scrolling="no" title="A-Frame Cielos 360°" src="https://codepen.io/xergioalex/embed/PQeZYy?default-tab=result" frameborder="no" loading="lazy" allowfullscreen="true" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
  <p class="px-4 py-2 text-sm"><a href="https://codepen.io/xergioalex/pen/PQeZYy" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Ver demo en CodePen →</a></p>
</div>

<div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-(--box-shadow)">
  <p class="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Texturas y animaciones</p>
  <p class="px-4 pb-2 text-sm text-gray-600 dark:text-gray-400">Imágenes a superficies con transiciones encadenadas.</p>
  <iframe height="350" style="width:100%;" scrolling="no" title="A-Frame Texturas y animaciones" src="https://codepen.io/xergioalex/embed/VQxepd?default-tab=result" frameborder="no" loading="lazy" allowfullscreen="true" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
  <p class="px-4 py-2 text-sm"><a href="https://codepen.io/xergioalex/pen/VQxepd" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Ver demo en CodePen →</a></p>
</div>

<div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-(--box-shadow)">
  <p class="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Modelos 3D</p>
  <p class="px-4 pb-2 text-sm text-gray-600 dark:text-gray-400">Importando Collada desde Blender y SketchUp.</p>
  <iframe height="350" style="width:100%;" scrolling="no" title="A-Frame Modelos 3D" src="https://codepen.io/xergioalex/embed/JpvXrz?default-tab=result" frameborder="no" loading="lazy" allowfullscreen="true" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
  <p class="px-4 py-2 text-sm"><a href="https://codepen.io/xergioalex/pen/JpvXrz" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Ver demo en CodePen →</a></p>
</div>

<div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-(--box-shadow)">
  <p class="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Física</p>
  <p class="px-4 pb-2 text-sm text-gray-600 dark:text-gray-400">Gravedad, masa y colisiones con Cannon.js.</p>
  <iframe height="350" style="width:100%;" scrolling="no" title="A-Frame Física" src="https://codepen.io/xergioalex/embed/wyjowM?default-tab=result" frameborder="no" loading="lazy" allowfullscreen="true" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
  <p class="px-4 py-2 text-sm"><a href="https://codepen.io/xergioalex/pen/wyjowM" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Ver demo en CodePen →</a></p>
</div>

<div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-(--box-shadow)">
  <p class="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Eventos de cursor</p>
  <p class="px-4 pb-2 text-sm text-gray-600 dark:text-gray-400">Interacción por mirada donde ver un objeto dispara acciones.</p>
  <iframe height="350" style="width:100%;" scrolling="no" title="A-Frame Eventos de cursor" src="https://codepen.io/xergioalex/embed/rJvLab?default-tab=result" frameborder="no" loading="lazy" allowfullscreen="true" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
  <p class="px-4 py-2 text-sm"><a href="https://codepen.io/xergioalex/pen/rJvLab" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Ver demo en CodePen →</a></p>
</div>

<div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-(--box-shadow)">
  <p class="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Componente Sun</p>
  <p class="px-4 pb-2 text-sm text-gray-600 dark:text-gray-400">Iluminación dinámica con un sol en movimiento.</p>
  <iframe height="350" style="width:100%;" scrolling="no" title="A-Frame Componente Sun" src="https://codepen.io/xergioalex/embed/BYxLPB?default-tab=result" frameborder="no" loading="lazy" allowfullscreen="true" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
  <p class="px-4 py-2 text-sm"><a href="https://codepen.io/xergioalex/pen/BYxLPB" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Ver demo en CodePen →</a></p>
</div>

<div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-(--box-shadow)">
  <p class="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Texto y múltiples animaciones</p>
  <p class="px-4 pb-2 text-sm text-gray-600 dark:text-gray-400">Texto 3D con animaciones encadenadas.</p>
  <iframe height="350" style="width:100%;" scrolling="no" title="A-Frame Texto y animaciones" src="https://codepen.io/xergioalex/embed/qxYbwM?default-tab=result" frameborder="no" loading="lazy" allowfullscreen="true" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
  <p class="px-4 py-2 text-sm"><a href="https://codepen.io/xergioalex/pen/qxYbwM" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Ver demo en CodePen →</a></p>
</div>

<div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-(--box-shadow)">
  <p class="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300">Animación de cámara</p>
  <p class="px-4 pb-2 text-sm text-gray-600 dark:text-gray-400">Moviendo el punto de vista programáticamente.</p>
  <iframe height="350" style="width:100%;" scrolling="no" title="A-Frame Animación de cámara" src="https://codepen.io/xergioalex/embed/eVrJPR?default-tab=result" frameborder="no" loading="lazy" allowfullscreen="true" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"></iframe>
  <p class="px-4 py-2 text-sm"><a href="https://codepen.io/xergioalex/pen/eVrJPR" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Ver demo en CodePen →</a></p>
</div>

</div>

Cada demo era un bloque de construcción. Cada uno me enseñó algo nuevo sobre cómo funcionan los entornos 3D en el navegador. Y cada uno demostraba lo mismo: la web es lo suficientemente poderosa para experiencias inmersivas. Hay más demos en mi [colección de CodePen](https://codepen.io/xergioalex).

---

## La galería: caminando entre fotos 360°

El primer proyecto más grande fue una **galería de fotos 360°** — un cuarto virtual donde podías acercarte a miniaturas panorámicas y hacer clic en ellas para ser transportado dentro de la escena.

El concepto era simple: cargar 18 imágenes panorámicas equirectangulares, organizarlas como miniaturas clickeables en una pared, y cuando alguien hiciera clic en una, cambiar todo el cielo a esa panorámica. De repente estabas parado dentro de una fotografía 360°, mirando en todas las direcciones.

```html
<a-image src="#p1" position="-1.5 1.8 -4" onclick="show('p1')"></a-image>
<a-sky src="#p1" id="sky"></a-sky>
```

Una línea para la miniatura. Una línea para el cielo. Una función de JavaScript de tres líneas para intercambiarlos. La galería entera — 18 panorámicas, navegación interactiva, lista para VR — era un solo archivo HTML.

<figure>
  <img src="/images/blog/posts/webvr-projects/gallery-panorama.webp" alt="Panorámica 360° de la galería" loading="lazy" />
  <figcaption>Una de las 18 fotografías equirectangulares renderizadas como cielo 360° completo — navegable con ratón, toque o un visor Cardboard.</figcaption>
</figure>

Le agregué un cubo flotante y giratorio con el logo de PereiraJS como easter egg, un cursor de mirada para interacción en VR (mirá una miniatura por 800ms y se activa), y controles de cámara para escritorio y móvil.

<div class="not-prose my-6">
  <div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-(--box-shadow)">
    <iframe height="450" style="width:100%;" scrolling="no" title="Galería VR 360°" src="https://xergioalex.github.io/webvr-gallery/" frameborder="no" loading="lazy" allowfullscreen="true" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking"></iframe>
    <p class="px-4 py-2 text-sm"><a href="https://xergioalex.github.io/webvr-gallery/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Abrir galería en nueva pestaña →</a></p>
  </div>
</div>

La galería sigue en línea: [webvr-gallery](https://xergioalex.github.io/webvr-gallery/). Ábrela en tu teléfono, mételo en un visor Cardboard, y recorré las panorámicas.

---

## El laberinto: juego VR con detección de colisiones

El segundo proyecto fue más ambicioso — un **laberinto VR navegable** con física, detección de colisiones, coleccionables y sistema de puntaje.

El laberinto se generaba a partir de un arreglo 2D — la misma técnica usada en el desarrollo clásico de videojuegos:

```javascript
var map = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
  [0, 0, 1, 0, 3, 0, 0, 0, 0, 0],
  [0, 0, 1, 0, 0, 1, 1, 0, 1, 0],
  // 0=vacío, 1=pared, 2=jugador, 3=coleccionable
];
```

El script iteraba sobre esta cuadrícula, creaba entidades de pared con textura donde encontraba `1`s, ubicaba la cámara del jugador en el `2`, y generaba cubos coleccionables flotantes en cada `3`. Las paredes tenían imágenes de textura y cuerpos físicos. El jugador tenía un cuerpo cinemático que colisionaba con las paredes — no podías atravesarlas. Los coleccionables desaparecían cuando los mirabas, actualizando un marcador flotante frente a la cámara.

El stack tecnológico era mínimo pero efectivo:
- **A-Frame** para la escena y las entidades
- **aframe-extras** para controles universales y física
- **Cannon.js** (vía aframe-extras) para detección de colisiones
- Un componente **sun-sky** para iluminación exterior realista
- **Piso y paredes con textura** para profundidad visual

<div class="not-prose my-6">
  <div class="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-(--box-shadow)">
    <iframe height="450" style="width:100%;" scrolling="no" title="Laberinto VR" src="https://xergioalex.github.io/webvr-maze/" frameborder="no" loading="lazy" allowfullscreen="true" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking"></iframe>
    <p class="px-4 py-2 text-sm"><a href="https://xergioalex.github.io/webvr-maze/" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">Abrir laberinto en nueva pestaña →</a></p>
  </div>
</div>

Todo el asunto eran unas 100 líneas de JavaScript y un archivo HTML. Podías jugarlo en escritorio con las teclas WASD o en VR con un visor. El laberinto sigue siendo jugable: [webvr-maze](https://xergioalex.github.io/webvr-maze/).

---

## De proyectos a charlas

Estos proyectos no se quedaron en GitHub. Se convirtieron en la columna vertebral de dos charlas que di sobre WebVR:

La primera fue en [PereiraJs](/es/blog/webvr-aframe/), donde mostré toda la progresión — desde formas primitivas hasta el juego del laberinto — a un salón lleno de desarrolladores. La audiencia sacó los teléfonos y cargó los demos en vivo durante la presentación.

La segunda fue en la [Universidad Remington](/es/blog/webvr-aframe-uniremington/), para públicos universitarios, donde expandí el contenido para cubrir VR vs. AR vs. Realidad Mixta, la economía del hardware de VR, y por qué la web es la mejor plataforma de distribución.

Ambas charlas demostraron lo mismo: cuando la VR corre en un navegador, la audiencia puede experimentar lo que estás construyendo en tiempo real. Sin descargas. Sin instalaciones. Solo una URL.

---

## Conclusión

La idea central es clara: **la web es la plataforma de distribución más poderosa que tenemos.** Si podés construir una experiencia que corra en un navegador, podés llegar a cualquier persona con un dispositivo y conexión a internet. Sin tiendas de apps. Sin gatekeeping de plataformas. Solo una URL.

Construir esos demos me enseñó a pensar sobre la tecnología de manera diferente. No "¿cuál es la herramienta más poderosa?" sino "¿cuál es la más accesible?" No "¿cómo hago la mejor experiencia de VR?" sino "¿cómo hago que la VR esté disponible para todos?"

Los proyectos siguen en línea y se pueden explorar:

- **Galería VR:** [xergioalex.github.io/webvr-gallery](https://xergioalex.github.io/webvr-gallery/)
- **Laberinto VR:** [xergioalex.github.io/webvr-maze](https://xergioalex.github.io/webvr-maze/)
- **Código fuente:** [webvr-gallery](https://github.com/xergioalex/webvr-gallery), [webvr-maze](https://github.com/xergioalex/webvr-maze)
- **Slides de las charlas:** [PereiraJs](https://slides.com/xergioalex/webvr-aframe), [UniRemington](https://slides.com/xergioalex/webvr-aframe-uniremington-talk)

Cada demo en esos repos es prueba de que la VR no tiene que ser exclusiva. Solo necesita un navegador.
