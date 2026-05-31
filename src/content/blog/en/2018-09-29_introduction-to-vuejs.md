---
title: "Introduction to Vue.js"
description: "Why Vue became my favorite framework after years of Angular and React — a deep dive into progressive design, reactivity, and what makes Vue special."
pubDate: "2018-09-29"
heroImage: "/images/blog/posts/introduction-to-vuejs/hero.webp"
heroLayout: "side-by-side"
tags: ["talks", "tech", "javascript", "web-development"]
keywords: ["Vue.js introduction tutorial", "Vue vs React vs Angular", "Vue.js reactivity system", "Vue Router Vuex tutorial", "Vue single file components", "why choose Vue.js", "Vue.js Options API explained"]
---

I've been building web apps for a while now — long enough to have opinions about JavaScript frameworks. I started with Angular back when it was still AngularJS, moved to React when everyone was talking about virtual DOM, and then something interesting happened: I discovered Vue.js.

And honestly? It felt like coming home.

This article is based on what I shared at Pereira Tech Talks in 2018, where I walked through why Vue resonated so strongly with me. If you've been curious about Vue, or if you're choosing between frameworks for a project, let me tell you why I think it's worth your time.

---

## The Progressive Framework Philosophy

Here's the thing that made Vue click for me: **it's progressive**. That's not marketing speak — it's genuinely how the framework is designed.

What does "progressive" mean? Simple things stay simple. Complex things are possible.

You can drop Vue into an existing project with a single `<script>` tag and start using it right away. No build tools, no CLI, no webpack configuration. Just include the library and you're off. That's how I first tried it — took an old jQuery project, added Vue to one section, and watched it come alive.

But when you need more — routing, state management, server-side rendering — Vue scales up beautifully. The CLI, Vue Router, Vuex, Nuxt... they're all there when you need them. But you're never forced to adopt everything at once.

Coming from Angular (where you adopt the entire framework or nothing) and React (where you immediately need to make routing, state management, and build tool decisions), this felt refreshing. Vue trusts you to know what you need.

---

## What Makes Vue Different: Reactivity and Components

At its core, Vue is built around **reactivity** — the idea that when your data changes, the DOM updates automatically. No manual manipulation. No `setState()` calls that feel like ceremony.

Here's what I mean. Let's say you want a simple counter:

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
  <p>Count: {{ count }}</p>
  <button @click="increment">+1</button>
</div>
```

That's it. Change `this.count`, and the UI updates. No diffing algorithm you have to think about, no render functions to write. The reactivity system just works.

Vue uses a **Virtual DOM** under the hood (similar to React), but you rarely think about it. The framework handles the efficient updates. You focus on what your app does, not how the rendering engine works.

And then there's **components**. Everything in Vue is a component — reusable, composable, self-contained pieces of UI. A component has its template, logic, and styles in one place:

```vue
<template>
  <button @click="increment" class="counter-btn">
    Clicked {{ count }} times
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

Single-file components (`.vue` files) felt natural to me. Everything related to a component lives together. No hunting through directories for the CSS or template.

---

## Why Vue Became My Go-To

After working with Vue on a few projects, here's what kept me coming back:

**It's easy and fun to learn.** The documentation is fantastic — clear, practical, and full of examples. I've introduced junior devs to Vue and watched them build real features in days, not weeks. The learning curve is gentle.

**The syntax feels intuitive.** Directives like `v-if`, `v-for`, `v-model`, `@click` — they read like natural language. You don't need a PhD in functional programming to understand what's happening.

**Building SPAs is straightforward.** Vue Router and Vuex form what I call the "holy trinity" of Vue: the core, the router, and state management. They work together seamlessly. Setting up client-side routing or a global store doesn't feel like assembling IKEA furniture.

**Performance is competitive.** Vue consistently ranks well in framework benchmarks. It's fast out of the box, and when you need to optimize, the tools are there (async components, lazy loading, keep-alive).

**The ecosystem is thriving.** Nuxt for server-side rendering, Vuetify for Material Design components, Quasar for building desktop/mobile apps... the community has built great tools on top of Vue.

---

## My Experience with Vue

Since that first experiment adding Vue to a jQuery project, I've used it for everything from internal dashboards to customer-facing apps. I've taught it at local meetups (like Pereira Tech Talks). I've debugged Vuex state trees at 2 AM and celebrated when reactive data flows just worked.

What I love most is that Vue doesn't get in my way. I can focus on the problem I'm solving — the features users need — instead of fighting the framework.

If you're considering Vue, my advice: just try it. Spin up a CodePen, drop in the CDN, and build a simple to-do app. Feel how the reactivity works. See how quickly you can build something real.

You might find, like I did, that it just feels right.

---

## Resources

- [View my talk slides](https://slides.com/xergioalex/introduction-to-vue)
- [Event recap on Pereira Tech Talks](https://pereiratechtalks.org/vuejs-intro-and-js-community)
- [Vue.js Official Documentation](https://vuejs.org/guide/introduction.html)
- [Vue.js GitHub Repository](https://github.com/vuejs/core)

Let's keep building.
