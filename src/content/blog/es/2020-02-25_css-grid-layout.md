---
title: "CSS Grid Layout"
description: "Cómo CSS Grid cambió mi forma de pensar los layouts: de Flexbox a la bidimensionalidad real, con ejercicios prácticos y accesibilidad."
pubDate: "2020-02-25"
heroImage: "/images/blog/posts/css-grid-layout/hero.webp"
heroLayout: "side-by-side"
tags: ["talks", "tech", "web-development", "design"]
keywords: ["CSS Grid Layout tutorial", "cómo usar CSS Grid", "CSS Grid vs Flexbox", "layouts bidimensionales con CSS", "CSS Grid para principiantes", "diseño web con CSS Grid", "accesibilidad con CSS Grid"]
---

Di una charla sobre **CSS Grid Layout** a principios de 2020, y honestamente, fue tanto para mí como para la audiencia. Llevaba años usando Flexbox — resolvía muchos problemas — pero seguía topándome con situaciones donde se sentía raro. Contenedores flex anidados, hacks raros con márgenes, peleando con el alineamiento en ambos ejes a la vez. Sabía que Grid existía, pero no me había sentado realmente a aprenderlo bien.

Así que lo hice. Y cambió completamente cómo abordo los layouts.

---

## Por qué grid me importó

Por mucho tiempo, Flexbox fue mi herramienta de cabecera. Es brillante para layouts unidimensionales — filas o columnas, no ambas. Pero en el momento en que necesitas controlar la posición en dos dimensiones simultáneamente, Flexbox empieza a sentirse como la herramienta incorrecta. Puedes hacerlo funcionar, pero estás trabajando *en contra* de él, no *con* él.

CSS Grid me dio ese control bidimensional de forma nativa. Filas y columnas al mismo tiempo. Colocación explícita. Áreas de grid con nombre. Se sintió como desbloquear un nuevo nivel de precisión.

La charla no buscaba decir "dejen de usar Flexbox". Era sobre entender cuándo cada herramienta tiene sentido y cómo combinarlas. Flexbox para componentes, Grid para estructura de página. Ese es el patrón al que llegué.

---

## Display: Flex vs Grid

Ambas propiedades modifican cómo se maquetan los elementos hijos, pero son fundamentalmente distintas:

**Display Flex** — Layout unidimensional. Defines un eje principal (fila o columna) y los elementos fluyen a lo largo de él. Perfecto para barras de navegación, grupos de botones, alineamiento de contenido de cards. Flexbox lleva más tiempo en los navegadores, así que hay toneladas de recursos — cheatsheets, tutoriales interactivos, patrones probados en batalla.

**Display Grid** — Layout bidimensional. Defines filas y columnas explícitamente, y los elementos pueden abarcar ambas. Tiene soporte amplio en navegadores desde 2017. La compatibilidad actual es excelente — todos los navegadores modernos, incluso IE11 con algunos fallbacks.

La diferencia clave: Flexbox se trata de *distribuir espacio a lo largo de una línea*. Grid se trata de *colocar elementos en una cuadrícula*.

---

## Flexbox vs Grid: Cuándo Usar Qué

Este fue el núcleo de la charla. La gente seguía preguntándome: "¿Debería usar Flexbox o Grid?" Y la respuesta es siempre: **depende del problema de layout que estés resolviendo.**

**Usa Flexbox cuando:**
- Tienes una sola fila o columna de elementos
- Quieres que los elementos se envuelvan y refluyan dinámicamente
- Te importa más el alineamiento y la distribución que la colocación precisa
- Estás construyendo un componente (grupo de botones, footer de card, barra de nav)

**Usa Grid cuando:**
- Necesitas controlar filas y columnas
- Quieres colocación explícita (ej: "esto va en la fila 2, columna 3")
- Estás construyendo layouts a nivel de página (header, sidebar, main, footer)
- Necesitas que los elementos se superpongan o abarquen múltiples áreas

**Usa ambos cuando:**
- Grid define la estructura general de la página
- Flexbox maneja el alineamiento dentro de cada celda del grid
- Este es el patrón que más uso ahora

La charla incluía comparaciones lado a lado del mismo layout construido con Flexbox (contenedores anidados, muchos wrappers) vs Grid (limpio, explícito, menos elementos). Grid ganaba cada vez en legibilidad.

---

## Demo time: aprender construyendo

Compartí dos ejercicios prácticos que construí para realmente interiorizar cómo funciona Grid. Leer la documentación es útil, pero construir layouts reales es donde todo hace clic.

### Ejercicio 1: Movies Page

Crear una página de navegación de películas con una grilla de cards. Cada card tiene un póster, título, calificación y descripción. La grilla debe adaptarse al tamaño de pantalla — más columnas en pantallas anchas, menos en móvil.

Este ejercicio enseña:
- `grid-template-columns` con `repeat()` y `auto-fit`
- `minmax()` para tamaño de columnas responsive sin media queries
- `gap` para espaciado consistente (mucho más limpio que hacks con margin)

Mi solución: [movies-page-css-grid](https://github.com/xergioalex/movies-page-css-grid)

<figure>
  <img src="/images/blog/posts/css-grid-layout/movies-demo.webp" alt="Ejercicio Movies Page con CSS Grid" loading="lazy" />
  <figcaption>El ejercicio Movies Page: una grilla de cards responsive usando <code>auto-fit</code>, <code>minmax()</code> y <code>gap</code> — sin media queries.</figcaption>
</figure>

### Ejercicio 2: Videos Player

Construir una interfaz de reproductor de video con:
- Una barra lateral con una playlist (izquierda)
- Un reproductor de video principal (centro, ocupa la mayor parte del espacio)
- Controles de video y metadata (abajo)

Este ejercicio enseña:
- Áreas de grid con nombre (`grid-template-areas`)
- Unidades fraccionales (`fr`) para tamaño proporcional
- Cómo hacer un layout que se siente como una app real

Repo: [videos-player-css-grid](https://github.com/xergioalex/videos-player-css-grid)
Demo en vivo: [videos-player-css-grid.xergioalex.com](https://videos-player-css-grid.xergioalex.com/)

<figure>
  <img src="/images/blog/posts/css-grid-layout/videos-demo.webp" alt="Ejercicio Videos Player con CSS Grid" loading="lazy" />
  <figcaption>El ejercicio Videos Player: barra lateral, reproductor principal y controles maquetados con <code>grid-template-areas</code> y unidades <code>fr</code>.</figcaption>
</figure>

También armé un curso completo con más ejemplos y demos interactivas:

- [CSS Grid Layout Course](https://css-grid-layout-course.xergioalex.com/)

---

## Trucos bonus del State of CSS 2020

Al final de la charla, cubrí dos features más nuevas de CSS que estaban ganando tracción en 2020:

### line-clamp

Trunca texto a un número específico de líneas con ellipsis. Súper útil para descripciones de cards, texto de preview, o donde sea que necesites prevenir overflow sin cortar a mitad de palabra.

```css
.card-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

Esto fue un salvavidas para las cards de la página de películas.

### prefers-reduced-motion

Una media query que respeta la preferencia a nivel de sistema del usuario para reducir el movimiento. Si alguien ha activado "reducir movimiento" en la configuración de accesibilidad de su sistema operativo, puedes deshabilitar o simplificar las animaciones.

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Esta es una característica de accesibilidad que importa. Algunas personas experimentan incomodidad o problemas vestibulares por movimiento excesivo. Respetar esta preferencia es parte de construir para todos.

Puedes probarlo en Firefox DevTools configurando `ui.prefersReducedMotion: 1` en `about:config`.

---

## Lo que aprendí

Grid no reemplazó a Flexbox para mí — lo complementó. Ahora uso Grid cuando pienso en estructura de página y Flexbox cuando pienso en alineamiento de componentes. Funcionan hermosamente juntos.

Los ejercicios fueron clave. Puedes leer sobre `grid-template-areas` todo el día, pero hasta que realmente construyas un layout de reproductor de video con áreas nombradas, no termina de asentarse.

Si todavía dudas sobre Grid, construye algo. No un ejemplo de juguete — un layout real. Vas a ver por qué vale la pena aprenderlo.

A seguir construyendo.

---

## Recursos

- [Slides de la charla](https://slides.com/xergioalex/css-grid-layout)
- [CSS Grid Layout Course](https://css-grid-layout-course.xergioalex.com/)
- [Ejercicio Movies Page (GitHub)](https://github.com/xergioalex/movies-page-css-grid)
- [Ejercicio Videos Player (GitHub)](https://github.com/xergioalex/videos-player-css-grid) — [Demo en vivo](https://videos-player-css-grid.xergioalex.com/)
