---
title: "Introducción a Webpack"
description: "Cómo Webpack transformó el front-end: entry points, loaders, plugins y por qué la experiencia de desarrollo importa más que la configuración."
pubDate: "2018-12-26"
heroImage: "/images/blog/posts/introduction-to-webpack/hero.webp"
heroLayout: "side-by-side"
tags: ["talks", "tech", "javascript", "web-development"]
keywords: ["introducción a Webpack", "qué es Webpack y cómo funciona", "module bundler JavaScript", "entry points y loaders Webpack", "developer experience con Webpack", "Webpack para front-end", "bundling de módulos JavaScript"]
---

Webpack cambió cómo pensamos sobre los builds de front-end. Para esta charla, quería desmitificar la herramienta que muchos desarrolladores encuentran abrumadora al principio. Webpack no es solo un empaquetador de módulos — es un cambio de mentalidad. Toma módulos con dependencias (`.js`, `.css`, `.coffee`, `.less`, `.jade`, imágenes) y los transforma en assets estáticos optimizados. Divide y vencerás.

---

## Formas de utilizar módulos en JavaScript

**AMD** (Asynchronous Module Definition) — Se usa con RequireJS. Carga módulos de forma asíncrona. Genial para navegadores, pero verboso.

**CommonJS** — Sistema de módulos de Node.js. Permite hacer una sola petición con todas las librerías que vas a necesitar. Sintaxis familiar, pero síncrono.

Webpack trae lo mejor de ambos mundos en un solo lugar. **AMD + CommonJS**. Y sobre todo: **Webpack === Developer experience**. Esa ecuación importa más de lo que la gente se da cuenta.

---

## ¿Qué otras herramientas hay?

- **Gulp y Grunt** — Automatizadores de tareas. Configuras la herramienta y hace varias cosas por ti: minificar, transpilar, compilar código, etc. Grunt salió primero; Gulp mejoró varias cosas, como la velocidad.
- **Browserify** — Solo permite usar `require` en el navegador, agrupando todas las dependencias.
- **Parcel** — A menudo descrito como "Webpack fancy" — menos configuración, más convención.

---

## Lo que necesitas conocer para configurar Webpack

### Entry Points

El módulo principal, de donde se parte a importar los demás módulos. Es el archivo que Webpack lee para generar el bundle. Se pueden tener múltiples entry points.

### Output

Configuraciones sobre el archivo resultante: dónde estará, cómo se llamará.

### Loaders

Ayudan a cargar todo tipo de formatos: imágenes (jpg, png, gif), fuentes personalizadas, íconos, y "dialectos" como CoffeeScript, Stylus, Sass o JSX.

### Plugins

Extienden las características de Webpack: comprimir archivos con Uglify, dividir módulos en chunks más pequeños para que la aplicación cargue más rápido.

---

## Instalación

```bash
npm i webpack webpack-cli --save-dev
# o
yarn add webpack webpack-cli --dev
```

---

## Código y ejemplos

Compartí ejemplos de proyectos reales:

- [Jopmi Landing](https://github.com/RockaLabs/jopmi-landing)
- [Bambú Alexa](https://github.com/xergioalex/bambu-alexa)
- [Beyond Campus Landing](https://github.com/xergioalex/beyond-campus-landing)
- [Beyond Campus Webapp](https://github.com/xergioalex/beyond-campus-webapp)
- [Webpack Backend Example](https://github.com/xergioalex/webpack_backend_example)
- [Webpack Frontend Examples](https://github.com/xergioalex/webpack_examples)

---

---

[Ver slides](https://slides.com/xergioalex/introduction-to-webpack)

---

Webpack me enseñó que el tooling no se trata solo de automatización — se trata de habilitar mejores flujos de trabajo. Sí, la configuración puede volverse compleja, pero el retorno en developer experience y optimización vale la pena. Entender tu herramienta de build te da control sobre cómo tu código llega a producción.

A seguir construyendo.
