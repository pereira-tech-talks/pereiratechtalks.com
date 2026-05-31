---
title: 'Vue Vixens Talk: estilos en Vue'
description: 'Por qué los estilos importan en frameworks basados en componentes y cómo Vue hace que CSS sea scoped, modular y poderoso. De preprocesadores a arquitectura de componentes.'
pubDate: '2019-10-25'
heroImage: '/images/blog/posts/vue-vixens-styles/hero.webp'
heroLayout: 'side-by-side'
tags: ["talks", "tech", "javascript", "web-development", "design"]
keywords: ["estilos en Vue.js", "CSS scoped en Vue componentes", "preprocesadores CSS con Vue", "Vue Vixens charla estilos", "CSS modular con Vue.js", "diseño basado en componentes Vue", "Vue.js estilos para principiantes"]
---

Los estilos son la mitad de la historia del desarrollo front-end, pero a menudo se tratan como una ocurrencia tardía. Vue.js recibe mucha atención por su modelo de datos reactivo y arquitectura de componentes, pero una de sus mejores características es cómo maneja **CSS**. Esta charla en **Vue Vixens Day Pereira** fue sobre hacer que los estilos sean accesibles, modulares y poderosos.

Vue Vixens es una comunidad global que crea talleres y eventos para enseñar Vue.js en un entorno acogedor e inclusivo. Su enfoque en **diversidad en tecnología** hace que el aprendizaje sea accesible para personas que quizás no se ven representadas en espacios tech tradicionales. Ser parte de este evento significó contribuir a esa misión — ayudar a la gente a ver que el desarrollo front-end, y Vue específicamente, es para todos.

[Ver charla en YouTube](https://www.youtube.com/watch?v=HAWL6wzzyxQ)

## Front-end es HTML + CSS + JavaScript

En su núcleo, el desarrollo front-end combina tres tecnologías:

- **HTML** — Estructura y contenido
- **CSS** — Presentación y diseño visual
- **JavaScript** — Comportamiento e interactividad

Muchos frameworks front-end se enfocan en JavaScript. Manejan reactividad, gestión de estado, routing y lógica. Pero los **estilos** son igualmente importantes. Una app perfectamente reactiva con layout roto o diseño inconsistente sigue siendo una mala experiencia de usuario.

**UX vs UI** sale mucho en estas discusiones. **Experiencia de usuario (UX)** es cómo el producto se siente y funciona — el flujo, la usabilidad, el recorrido. **Interfaz de usuario (UI)** es lo que el usuario ve e interactúa — los colores, tipografía, espaciado, componentes. Ambos importan. Vue ayuda con ambos, pero esta charla se enfocó en el lado **UI**: cómo Vue maneja estilos.

## La etiqueta `<style>`

En Vue, los estilos viven dentro de bloques `<style>` en Componentes de Archivo Único (archivos `.vue`). Esto co-localiza HTML, JavaScript y CSS en un archivo, haciendo que los componentes sean auto-contenidos y más fáciles de razonar.

Acá va un ejemplo simple:

```html
<template>
  <div>
    <p>Hola Mundo</p>
    <p class="text-green">Hola Vue Vixens</p>
  </div>
</template>

<style>
  p {
    color: red;
  }
  p.text-green {
    color: green;
  }
</style>
```

El bloque `<style>` usa CSS regular. Podés usar selectores, clases, IDs, pseudo-clases — cualquier cosa que usarías en una hoja de estilos independiente. La diferencia es que estos estilos están atados al componente. Cuando importas este componente, los estilos vienen con él.

Por defecto, `<style>` sin atributos aplica **globalmente**. Los estilos se filtran a toda la app. Esto puede ser útil para estilos base, resets o utilidades globales, pero es riesgoso para estilos específicos de componentes.

## Estilos scoped

La característica estrella de Vue para estilos es **`<style scoped>`**. Agrega el atributo `scoped` y Vue asegura que los estilos solo apliquen al componente actual:

```html
<template>
  <div>
    <p>Esto es rojo solo en este componente.</p>
  </div>
</template>

<style scoped>
  p {
    color: red;
  }
</style>
```

Bajo el capó, Vue agrega un atributo único a todos los elementos en el template del componente (algo como `data-v-f3f3eg9`) y reescribe tus selectores CSS para incluir ese atributo:

```css
p[data-v-f3f3eg9] {
  color: red;
}
```

Esto significa:

- Los estilos no se filtran a otros componentes
- Podés usar selectores simples (como `p` o `.button`) sin preocuparte por conflictos
- Los estilos de componentes son verdaderamente **modulares**

**Por qué esto importa:**

En una app grande con muchos componentes, el CSS global se convierte en una pesadilla. Terminas con colisiones de nombres, conflictos en cascada y batallas de especificidad. Los estilos scoped resuelven esto. Cada componente es una unidad auto-contenida con sus propios estilos.

## Preprocesadores: SCSS, Stylus, Less

Vue soporta **preprocesadores CSS** de fábrica. ¿Querés usar SCSS? Solo agrega `lang="scss"`:

```html
<style lang="scss" scoped>
  $primary-color: #42b983;

  p {
    color: $primary-color;

    &.highlighted {
      font-weight: bold;
      background: lighten($primary-color, 40%);
    }
  }
</style>
```

El `&` en SCSS es poderoso. Referencia el selector padre, permitiéndote anidar estilos sin repetirte. `&.highlighted` se convierte en `p.highlighted`. Es más limpio y más fácil de mantener.

**Preprocesadores soportados:**

- **SCSS/Sass** — Más popular. Variables, mixins, anidamiento, funciones.
- **Stylus** — Sintaxis limpia, sin llaves ni puntos y comas requeridos.
- **Less** — Similar a SCSS, sintaxis ligeramente diferente.

Para usar un preprocesador, instala el loader:

```bash
npm install -D sass-loader sass
```

Luego usa `lang="scss"` en tus bloques `<style>`. El sistema de build de Vue maneja el resto.

**¿Por qué preprocesadores?**

1. **Variables** — Define colores, espaciado, fuentes una vez y reutilizalos.
2. **Anidamiento** — Organiza estilos jerárquicamente, coincidiendo con la estructura HTML.
3. **Mixins** — Pedazos reutilizables de estilos (como una función para CSS).
4. **Funciones** — Calcula valores dinámicamente (ej. `lighten()`, `darken()`).

Los preprocesadores hacen que CSS sea más mantenible, especialmente en proyectos grandes.

## Importando frameworks CSS

Los componentes Vue funcionan bien con **frameworks CSS** como Bootstrap o Semantic UI. Podés importarlos globalmente o por componente.

**Importación global (en `main.js`):**

```javascript
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import BootstrapVue from 'bootstrap-vue';

Vue.use(BootstrapVue);
```

Ahora los estilos y componentes Bootstrap están disponibles en todos lados.

**Importación por componente:**

```html
<template>
  <div>
    <b-button variant="primary">Hacé clic</b-button>
  </div>
</template>

<script>
import { BButton } from 'bootstrap-vue';

export default {
  components: { BButton },
};
</script>
```

**Frameworks populares para Vue:**

- **[Bootstrap Vue](https://bootstrap-vue.js.org/)** — Componentes Bootstrap reconstruidos para Vue con reactividad completa
- **[Semantic UI Vue](https://semantic-ui-vue.github.io)** — Semantic UI adaptado para Vue

Estos frameworks te dan componentes pre-construidos (botones, modales, formularios) con estilos y comportamiento consistentes. Aún controlas el layout y personalizas según sea necesario.

## Selectores y especificidad

Un repaso rápido de CSS, porque esto confunde a la gente:

**`p.text-green`** (sin espacio) — Selecciona un elemento `<p>` **con** la clase `text-green`. El elemento y la clase están en el mismo tag.

```html
<p class="text-green">Esto coincide</p>
<p><span class="text-green">Esto NO coincide</span></p>
```

**`p .text-green`** (con espacio) — Selecciona cualquier elemento con la clase `text-green` **dentro de** un `<p>`. La clase puede estar en un elemento hijo.

```html
<p><span class="text-green">Esto coincide</span></p>
<p class="text-green">Esto NO coincide (sin descendiente)</p>
```

Entender esto importa cuando estás estilando componentes anidados o layouts complejos.

## Estilos locales vs globales

Un patrón común en apps Vue:

```html
<style>
  /* Estilos globales: reset, tipografía base, utilidades */
  body {
    margin: 0;
    font-family: 'Arial', sans-serif;
  }
</style>

<style scoped>
  /* Estilos específicos del componente */
  .card {
    border: 1px solid #ccc;
    padding: 1rem;
  }
</style>
```

Podés tener **ambos** en el mismo componente. Los estilos globales aplican en todos lados. Los estilos scoped aplican solo a este componente.

**Mejor práctica:**

- Usa **estilos globales** con moderación — resets base, tipografía, variables de tema
- Usa **estilos scoped** para todo lo demás — layout específico del componente, colores, espaciado

Esto mantiene tus estilos predecibles y evita conflictos.

## Por qué esto importa

Los estilos a menudo se ven como menos importantes que la lógica, pero son lo que los usuarios ven e interactúan. Una app bien estilada se siente pulida, profesional y confiable. Una app mal estilada se siente rota, incluso si la lógica es perfecta.

Vue hace que los estilos sean accesibles al:

1. **Co-localizar estilos con componentes** — Sin buscar en hojas de estilo globales
2. **Proveer estilos scoped por defecto** — Sin conflictos de nombres, sin problemas de cascada
3. **Soportar preprocesadores** — Usa las herramientas que ya conocés
4. **Funcionar bien con frameworks CSS** — Integra Bootstrap, Tailwind o sistemas de diseño personalizados fácilmente

El objetivo es hacer que **escribir buen CSS sea tan fácil como escribir buen JavaScript**.

## La misión de Vue Vixens

Lo que me encantó de este evento fue el enfoque en **inclusión**. Vue Vixens crea espacio para personas que quizás no se sienten bienvenidas en meetups tech tradicionales — especialmente mujeres y personas no binarias. Proveen mentoría, talleres prácticos y una comunidad de apoyo.

Esta charla sobre estilos fue parte de una serie más grande de talleres. Algunos asistentes nunca habían tocado Vue antes. Otros eran desarrolladores experimentados curiosos sobre el modelo de componentes de Vue. La mezcla resultó en grandes preguntas y aprendizaje colaborativo.

Si te interesa Vue y querés un entorno acogedor para aprender, revisá **[Vue Vixens](https://www.vuevixens.org/)**. Tienen capítulos en todo el mundo y realizan talleres regularmente.

---

Los estilos no son una ocurrencia tardía. Son la mitad de la ecuación front-end. Vue te da las herramientas para escribir CSS modular, scoped y mantenible sin pelear con el framework. Ya sea que uses CSS plano, SCSS o un sistema de diseño completo, Vue se quita del camino y te deja enfocarte en construir grandes interfaces.

[Ver slides](https://slides.com/xergioalex/vue-vixenx-talk-styles)

A seguir construyendo.
