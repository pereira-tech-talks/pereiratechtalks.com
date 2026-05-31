---
title: 'Introducción a Meteor.js'
description: 'Mi primera charla tech — construir una app de chat en tiempo real con Meteor.js desde cero hasta un prototipo funcionando en minutos, con datos reactivos y sin configurar WebSockets.'
pubDate: '2016-11-25'
heroImage: '/images/blog/posts/introduction-to-meteorjs/hero.webp'
heroLayout: 'banner'
tags: ["talks", "tech", "javascript", "web-development"]
keywords: ["introducción a Meteor.js", "qué es Meteor.js", "framework JavaScript full-stack", "datos reactivos en tiempo real", "aplicación web con Meteor", "publicaciones y suscripciones Meteor", "charla PereiraJS Meteor"]
---

Esta fue mi **primera charla** en una comunidad tech. La di en [Pereira JS](https://www.pereiratechtalks.org/edicion-especial-desde-la-utp/) durante una edición especial en la Universidad Tecnológica de Pereira (UTP), junto con la charla de Manuel Pineda sobre P2P y WebTorrent. Fue una gran experiencia — y el tema que elegí fue Meteor.js.

---

## ¿Qué es Meteor.js?

[Meteor](https://www.meteor.com/) es una plataforma JavaScript full-stack que te permite construir apps web y móviles con un solo código. Lo que lo hace destacar es lo **reactivo** que todo se siente de forma nativa. Escribes código una vez y los cambios se propagan automáticamente entre cliente y servidor. Sin llamadas AJAX manuales, sin gestión compleja de estado — solo una capa de datos limpia y reactiva.

Ideas clave:

- **JavaScript full-stack** — El mismo lenguaje en cliente y servidor. Sin cambiar de contexto.
- **Tiempo real por defecto** — Los datos se sincronizan automáticamente. Ideal para chat, dashboards, herramientas colaborativas.
- **Publicaciones y suscripciones** — Declaras qué datos necesita cada cliente; Meteor hace el resto.
- **Hot reload** — Ves tus cambios al instante durante el desarrollo.
- **Paquetes Atmosphere** — Un ecosistema rico de paquetes para auth, UI, APIs y más.

---

## La demo: construir un chat en vivo en minutos

El corazón de mi charla fue una demo en vivo. Quería mostrar qué tan rápido se podía construir un **chat en tiempo real** con Meteor — algo que normalmente requeriría WebSockets, una base de datos y mucho código de pegamento. Con Meteor, se sentía casi trivial.

### El Setup

```bash
meteor create chat-app
cd chat-app
meteor
```

Eso es todo. Obtienes una app corriendo con un stack reactivo ya conectado.

### El modelo

Usamos una colección simple `Messages`. En Meteor, las colecciones son **reactivas** — cuando insertas un documento en el servidor, cada cliente suscrito recibe la actualización automáticamente. Sin polling, sin refresh manual.

### La magia: publicar y suscribir

En el servidor, **publicas** los datos que quieres exponer:

```javascript
Meteor.publish('messages', function () {
  return Messages.find({}, { sort: { createdAt: -1 }, limit: 50 });
});
```

En el cliente, te **suscribes** a ellos:

```javascript
Meteor.subscribe('messages');
```

Una vez suscrito, `Messages.find()` en el cliente devuelve datos reactivos. ¿Agregas un mensaje nuevo? Aparece en todos lados, al instante.

### Insertar mensajes

Usamos un **Meteor Method** para insertar mensajes de forma segura (validación en el servidor):

```javascript
Meteor.methods({
  'messages.insert'(text) {
    if (!this.userId) throw new Meteor.Error('not-authorized');
    return Messages.insert({
      text,
      createdAt: new Date(),
      userId: this.userId,
    });
  },
});
```

### La UI

Con Blaze (el templating por defecto de Meteor), renderizamos la lista con `{{#each}}`. Cuando la colección cambiaba, el DOM se actualizaba automáticamente. Un formulario simple llamaba al method, y los mensajes nuevos aparecían para todos en tiempo real.

Todo el proceso — de cero a un chat multi-usuario funcionando — tomó solo unos minutos.

---

## Por qué Meteor se siente especial

Construir apps en tiempo real usualmente significa:

- Configurar WebSockets o Socket.io
- Gestionar estado de conexión, reconexión y fallbacks
- Sincronizar datos entre cliente y servidor manualmente
- Manejar conflictos y escenarios offline

Meteor abstrae la mayor parte de eso. Te enfocas en la lógica de tu app; el framework maneja la plomería del tiempo real. Viniendo del desarrollo web tradicional request-response, se siente como un salto al futuro.

---

## Slides y Referencia del Evento

- [Ver slides](https://slides.com/xergioalex/meteorjs)
- [Código fuente (GitHub)](https://github.com/rockalabs/rocka-chat-tutorial)
- [Post del blog de Pereira Tech Talks](https://www.pereiratechtalks.org/edicion-especial-desde-la-utp/) — contexto del evento (edición especial en la UTP)
