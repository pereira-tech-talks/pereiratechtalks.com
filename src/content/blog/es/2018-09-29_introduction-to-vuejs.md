---
title: 'Introducción a Vue.js'
description: 'Por qué Vue se convirtió en mi framework favorito después de años con Angular y React — filosofía progresiva, reactividad y qué hace especial a Vue.'
pubDate: '2018-09-29'
heroImage: '/images/blog/posts/introduction-to-vuejs/hero.webp'
heroLayout: 'side-by-side'
tags: ["talks", "tech", "javascript", "web-development"]
keywords: ["introducción a Vue.js", "qué es Vue.js", "Vue.js vs React vs Angular", "reactividad en Vue.js", "framework progresivo JavaScript", "Vue.js para principiantes", "por qué elegir Vue.js"]
---

Llevo un buen tiempo construyendo aplicaciones web — suficiente como para tener opiniones formadas sobre frameworks de JavaScript. Empecé con Angular cuando todavía era AngularJS, pasé a React cuando todos hablaban del virtual DOM, y luego pasó algo interesante: descubrí Vue.js.

¿Y sabes qué? Se sintió como llegar a casa.

Este artículo está basado en lo que compartí en Pereira Tech Talks en 2018, donde expliqué por qué Vue resonó tan fuertemente conmigo. Si has tenido curiosidad por Vue, o si estás eligiendo entre frameworks para un proyecto, déjame contarte por qué creo que vale la pena.

---

## La filosofía del framework progresivo

Aquí está lo que hizo que Vue me hiciera click: **es progresivo**. Y no es marketing — es genuinamente cómo está diseñado el framework.

¿Qué significa "progresivo"? Lo simple sigue siendo simple. Lo complejo es posible.

Puedes agregar Vue a un proyecto existente con una sola etiqueta `<script>` y empezar a usarlo inmediatamente. Sin build tools, sin CLI, sin configuración de webpack. Solo incluyes la librería y listo. Así fue como lo probé por primera vez — tomé un viejo proyecto con jQuery, agregué Vue a una sección, y lo vi cobrar vida.

Pero cuando necesitas más — enrutamiento, manejo de estado, server-side rendering — Vue escala hermosamente. El CLI, Vue Router, Vuex, Nuxt... todo está ahí cuando lo necesitas. Pero nunca te obligan a adoptar todo de golpe.

Viniendo de Angular (donde adoptas el framework completo o nada) y React (donde inmediatamente necesitas tomar decisiones sobre routing, state management y build tools), esto se sintió refrescante. Vue confía en que sabes lo que necesitas.

---

## Qué hace diferente a Vue: reactividad y componentes

En su núcleo, Vue está construido alrededor de la **reactividad** — la idea de que cuando tus datos cambian, el DOM se actualiza automáticamente. Sin manipulación manual. Sin llamadas a `setState()` que se sienten como ceremonias.

Te muestro a qué me refiero. Digamos que quieres un contador simple:

```javascript
new Vue({
  el: '#app',
  data: {
    count: 0
  },
  methods: {
    increment() {
      this.count++
    }
  }
})
```

```html
<div id="app">
  <p>Contador: {{ count }}</p>
  <button @click="increment">+1</button>
</div>
```

Eso es todo. Cambias `this.count`, y la UI se actualiza. Sin algoritmos de diffing en los que tengas que pensar, sin render functions que escribir. El sistema de reactividad simplemente funciona.

Vue usa un **Virtual DOM** internamente (similar a React), pero rara vez piensas en ello. El framework maneja las actualizaciones eficientes. Tú te enfocas en qué hace tu app, no en cómo funciona el motor de rendering.

Y luego están los **componentes**. Todo en Vue es un componente — piezas de UI reutilizables, componibles y autocontenidas. Un componente tiene su template, lógica y estilos en un solo lugar:

```vue
<template>
  <button @click="increment" class="counter-btn">
    Clics: {{ count }}
  </button>
</template>

<script>
export default {
  data() {
    return { count: 0 }
  },
  methods: {
    increment() {
      this.count++
    }
  }
}
</script>

<style scoped>
.counter-btn {
  padding: 10px 20px;
  background: #42b983;
}
</style>
```

Los componentes de un solo archivo (archivos `.vue`) me parecieron naturales. Todo lo relacionado con un componente vive junto. No hay que andar cazando por directorios buscando el CSS o el template.

---

## Por qué Vue se convirtió en mi opción principal

Después de trabajar con Vue en varios proyectos, esto es lo que me hizo volver una y otra vez:

**Es fácil y divertido de aprender.** La documentación es fantástica — clara, práctica y llena de ejemplos. He introducido desarrolladores junior a Vue y los he visto construir features reales en días, no semanas. La curva de aprendizaje es suave.

**La sintaxis se siente intuitiva.** Directivas como `v-if`, `v-for`, `v-model`, `@click` — se leen como lenguaje natural. No necesitas un doctorado en programación funcional para entender qué está pasando.

**Construir SPAs es directo.** Vue Router y Vuex forman lo que yo llamo la "santísima trinidad" de Vue: el core, el router y el state management. Funcionan juntos sin fricción. Configurar enrutamiento del lado del cliente o un store global no se siente como armar muebles de IKEA.

**El rendimiento es competitivo.** Vue consistentemente rankea bien en benchmarks de frameworks. Es rápido de entrada, y cuando necesitas optimizar, las herramientas están ahí (componentes async, lazy loading, keep-alive).

**El ecosistema está floreciendo.** Nuxt para server-side rendering, Vuetify para componentes Material Design, Quasar para construir apps desktop/mobile... la comunidad ha construido grandes herramientas sobre Vue.

---

## Mi experiencia con Vue

Desde ese primer experimento agregando Vue a un proyecto jQuery, lo he usado para todo — desde dashboards internos hasta apps de cara al cliente. Lo he enseñado en meetups locales (como Pereira Tech Talks). He debuggeado state trees de Vuex a las 2 AM y celebrado cuando los flujos de datos reactivos simplemente funcionaron.

Lo que más amo es que Vue no se interpone en mi camino. Puedo enfocarme en el problema que estoy resolviendo — las features que los usuarios necesitan — en vez de pelear con el framework.

Si estás considerando Vue, mi consejo: solo pruébalo. Abre un CodePen, agrega el CDN, y construye una app simple de to-dos. Siente cómo funciona la reactividad. Ve qué tan rápido puedes construir algo real.

Puede que descubras, como yo, que simplemente se siente bien.

---

## Recursos

- [Ver las slides de mi charla](https://slides.com/xergioalex/introduction-to-vue)
- [Resumen del evento en Pereira Tech Talks](https://pereiratechtalks.org/vuejs-intro-and-js-community)
- [Documentación Oficial de Vue.js](https://vuejs.org/guide/introduction.html)
- [Repositorio de Vue.js en GitHub](https://github.com/vuejs/core)

A seguir construyendo.
