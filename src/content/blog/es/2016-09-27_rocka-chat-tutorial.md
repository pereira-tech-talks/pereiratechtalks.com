---
title: "Una tarde, una app de chat, un framework que cambió mi forma de pensar"
description: "La historia de construir un chat en tiempo real completamente funcional con Meteor.js en una sola tarde — para demostrarle a una sala de desarrolladores que sí se podía."
pubDate: "2016-09-27"
heroImage: "/images/blog/posts/rocka-chat-tutorial/hero.webp"
heroLayout: "side-by-side"
tags: ["portfolio", "tech", "javascript", "web-development"]
keywords: ["chat en tiempo real con Meteor.js", "tutorial Meteor.js desde cero", "aplicación de chat JavaScript", "WebSocket con Meteor", "datos reactivos en tiempo real", "Meteor.js para principiantes", "construir chat multiusuario"]
---

Hay una sensación muy particular que te da un framework cuando simplemente *hace clic*. No cuando por fin lo haces funcionar después de horas peleando con la documentación — sino cuando hace clic al primer intento. Cuando hace exactamente lo que esperabas, y después un poco más. Esa fue mi primera experiencia con [Meteor.js](https://www.meteor.com/).

Recuerdo el momento exacto. Corrí `meteor create`, abrí el navegador, y ahí estaba: un contador reactivo actualizándose en tiempo real, sin configurar ningún servidor, sin base de datos, sin una sola línea de boilerplate de WebSocket. Abrí una segunda pestaña. Cambié algo. Vi cómo las dos pestañas reaccionaban al mismo tiempo. Quedé convencido antes de entender siquiera cómo funcionaba.

Esa sensación lleva un tiempo dando vueltas en mi cabeza. Y hoy finalmente tengo una razón concreta para ponerla a prueba.

---

## El contexto: una charla en PereiraJS

Voy a dar una charla en [PereiraJS](https://www.pereiratechtalks.org/edicion-especial-desde-la-utp/) — un evento de la comunidad tech local en la Universidad Tecnológica de Pereira. El tema: Meteor.js. Y llevo días pensando en qué hace grande a una charla técnica, y siempre llego a la misma respuesta: la demo.

Puedes explicar un framework todo el día. Slides, diagramas, listas de features — nada de eso golpea igual que ver algo real construirse frente a tus ojos. Así que no voy a solo *hablar* de Meteor. Voy a construir una aplicación de chat multiusuario en tiempo real, completa y funcional, en vivo, desde cero.

Pero primero tengo que construirla yo. Para conocerla por dentro. Para encontrarme con las paredes antes de pararme frente a un salón y pretender que no existen.

Así que esta tarde me siento con una terminal en blanco y un reto muy concreto: construir esto bien. No un juguete. No un prototipo de tres archivos. Una app de verdad — autenticación, múltiples salas de chat, historial de mensajes, arquitectura limpia. Todo en una sola tarde.

Vamos a ver cuánto se demora esto realmente.

---

## ¿Por qué Meteor? ¿Por qué ahora?

Para entender por qué estoy tan emocionado con esto, hay que sentir cómo se veía construir una app en tiempo real antes de Meteor.

Si quieres una aplicación de chat hoy, te enfrentas a algo así: Node.js con Express en el backend, Socket.io para gestionar WebSockets, MongoDB para persistencia, Mongoose para modelar datos, Passport para autenticación — y después tu elección entre React, Angular o Backbone en el frontend, cada uno con su propio pipeline. Webpack. Babel. Quizás Gulp. Un `package.json` con treinta dependencias antes de haber escrito una sola línea de código del producto.

Para cuando tienes todo conectado y funcionando, ya se fue media tarde. Eso es el JavaScript fatigue en su forma más concentrada.

Meteor es el contraargumento a todo eso. Un comando, y tienes una app full-stack corriendo: backend, frontend, base de datos, sistema de build, hot reload, todo sincronizado y comunicándose desde el primer minuto. El pitch es: llegas de cero a un prototipo funcionando en el tiempo que normalmente te tomaría configurar webpack.

Lo he usado suficiente para saber que el pitch es real. Hoy lo voy a demostrar.

---

## El build: tres horas en tiempo real

Arranco con lo obvio:

```bash
meteor create rocka-chat-tutorial
cd rocka-chat-tutorial
meteor
```

Abro `localhost:3000`. Hay una app corriendo. No un archivo estático de "hola mundo" — una aplicación full-stack real con una instancia de MongoDB, un servidor Node, un bundle del cliente compilado y hot reload, todo activo. Eso solo me hubiera tomado una hora en cualquier otro stack.

Lo primero que hago antes de escribir cualquier feature es planear la arquitectura. Es la parte que la mayoría de tutoriales se saltan, y yo creo que es la más importante. Voy a presentar esto en una charla, así que tiene que ser limpio.

```
imports/
  api/
    chats/
      chats.collection.js
      chats.methods.js
      chats.publications.js
    messages/
      messages.collection.js
      messages.methods.js
      messages.publications.js
    users/
      users.methods.js
      users.publications.js
  client/
    layouts/
    routes/
    templates/
```

La capa `imports/api/` separa el modelado de datos (collections), el flujo del servidor al cliente (publications) y las operaciones del cliente al servidor (methods). Separación limpia antes de que exista cualquier funcionalidad. Quiero poder señalar esta estructura en la charla y explicarla sin tener que disculparme por ninguna parte.

Con eso en su lugar, instalo paquetes. El sistema de paquetes de Meteor es una de sus ideas genuinamente buenas — unos cuantos comandos y tengo autenticación de usuarios, routing, layouts reactivos y gestión de estado. En otro stack, aquí es donde la tarde empieza a escaparse. Acá, toma minutos.

---

## Routing y templates

El router que escojo es [kadira:flow-router](https://github.com/kadirahq/flow-router) junto con Blaze Layout. Tres rutas: `/` para el home/lista de chats, `/login` y `/register` para la autenticación, y `/chat/:chatId` para las salas individuales.

```javascript
FlowRouter.route('/', {
  name: 'home',
  action() {
    BlazeLayout.render('mainLayout', { content: 'home' });
  },
});

FlowRouter.route('/chat/:chatId', {
  name: 'chat',
  action() {
    BlazeLayout.render('mainLayout', { content: 'chat' });
  },
});
```

El template `mainLayout` sostiene el sidebar y la navegación persistente. Los templates de `content` se intercambian reactivamente cuando cambian las rutas. Limpio, y no vuelvo a pensar en esto.

Ahora traigo la UI del chat. El sistema de templates Blaze de Meteor usa una sintaxis tipo Handlebars que compila a actualizaciones reactivas del DOM. Este es el template que muestra los mensajes:

```html
<template name="chat">
  <div class="chat-messages">
    {{#each messages}}
      {{> chatMessage}}
    {{/each}}
  </div>
  <form class="chat-input">
    <input type="text" name="message" placeholder="Escribe un mensaje..." />
    <button type="submit">Enviar</button>
  </form>
</template>
```

Ese `{{#each messages}}` no es decorativo. Es reactivo. En el momento que el cursor `messages` se actualiza — push del servidor, nuevo insert, lo que sea — el DOM se actualiza. Sin refresh manual, sin gestión explícita de estado, sin event listeners sobre los datos. Blaze se encarga de todo. Escribo el template una vez y me olvido del rendering.

---

## Autenticación en veinte minutos

Aquí es donde la magia de Meteor se hace realmente visible. La autenticación es lo siguiente. Agrego `accounts-password` al proyecto y de inmediato tengo: creación de usuarios, hashing de contraseñas, gestión de sesiones, login por token, todo el stack. Todo.

Solo necesito conectar la UI:

```javascript
Template.register.events({
  'submit .register-form'(event) {
    event.preventDefault();
    const { email, password, username } = event.target;

    Accounts.createUser({ email: email.value, password: password.value, username: username.value }, (error) => {
      if (error) return; // mostrar error
      FlowRouter.go('home');
    });
  },
});
```

Sin configurar JWT. Sin tocar bcrypt. Sin decidir cómo manejar el session storage. `Accounts.createUser` resuelve todo. Y el login es igual de simple — `Meteor.loginWithPassword`, un callback, listo.

Lo último son los guards de ruta. Los usuarios sin sesión no deberían ver el chat. Los que ya están autenticados no deberían ver el login:

```javascript
FlowRouter.triggers.enter([checkLoggedIn]);

function checkLoggedIn(context, redirect) {
  const publicRoutes = ['login', 'register'];
  if (!Meteor.userId() && !publicRoutes.includes(context.route.name)) {
    redirect('login');
  }
}
```

La autenticación está lista. Llevo menos de una hora.

---

## La parte que me enamoró

Ahora llegamos al corazón de todo. Collections, Publications y Methods. Esto es lo que Meteor *realmente es* por debajo de todo lo demás.

Una Collection de Meteor es una colección de MongoDB que existe en dos lugares al mismo tiempo: en el servidor (la base de datos real) y en el cliente (Minimongo, una réplica en memoria). Se mantienen sincronizadas automáticamente a través de DDP — el protocolo en tiempo real de Meteor, construido sobre WebSockets.

Defino `Chats` y `Messages`, y de inmediato bloqueo las escrituras directas desde el cliente:

```javascript
export const Chats = new Mongo.Collection('chats');

Chats.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});
```

Nada se escribe directo desde el cliente. Todo pasa por el servidor. Esa es la disciplina. Ahora controlo qué datos ve exactamente cada cliente:

```javascript
Meteor.publish('chats', function() {
  if (!this.userId) return this.ready();
  return Chats.find({ usersIds: this.userId });
});
```

Eso es todo. "Publica los chats donde este usuario es miembro." El servidor decide qué datos enviar, filtrados por usuario, con el scope exacto de lo relevante. El cliente se suscribe y recibe actualizaciones automáticamente cuando esos datos cambian. Sin polling. Sin fetch manual. Sin dolores de cabeza con la caché.

Y para las mutaciones — enviar un mensaje, crear un chat — todo pasa por Meteor Methods:

```javascript
Meteor.methods({
  'messages.insert'(chatId, text) {
    if (!this.userId) throw new Meteor.Error('not-authorized');

    const chat = Chats.findOne({ _id: chatId, usersIds: this.userId });
    if (!chat) throw new Meteor.Error('not-authorized', 'No eres parte de este chat.');

    Messages.insert({
      chatId,
      ownerId: this.userId,
      text: text.trim(),
      createdAt: new Date(),
    });
  },
});
```

Y en el cliente, llamarlo:

```javascript
Meteor.call('messages.insert', chatId, messageText);
```

Una línea. Lo que pasa detrás de esa línea es lo bonito: Meteor ejecuta el Method en el servidor. El servidor inserta el documento. MongoDB notifica al observador del oplog. DDP empuja el cambio a todos los clientes suscritos. Minimongo se actualiza. Blaze re-renderiza la lista de mensajes.

Dos usuarios. Dos ventanas del navegador. Un mensaje escrito. Aparece en las dos pantallas en menos de cien milisegundos.

Sin polling. Sin gestión manual de sockets. Sin sincronización explícita de estado.

Abro dos pestañas. Escribo. Me quedo mirando la pantalla un segundo. Y me río, porque funciona exactamente así.

---

## Final de la tarde

Tres horas después, tengo una aplicación de chat en tiempo real completamente funcional:

- Registro e inicio de sesión con contraseñas hasheadas
- Lista de amigos con todos los usuarios registrados
- Crear un chat nuevo con cualquier amigo
- Enviar y recibir mensajes en tiempo real en múltiples ventanas
- Historial completo al volver a una sala
- Eliminar un chat, con limpieza de mensajes
- Guards de ruta que mantienen fuera a los usuarios sin sesión
- Todas las escrituras validadas en el servidor a través de Methods

Nueve commits de trabajo real. Planeación de arquitectura, schemas de collections, routing, autenticación, funcionalidad completa del chat con historial y eliminación. El trabajo pesado — sincronización en tiempo real, autenticación, reactividad, rendering — todo manejado por Meteor, todo coordinado automáticamente.

Cierro el computador. La demo está lista. No porque haya atajos, sino porque Meteor no me obligó a pelear por las cosas básicas. Gasté mis tres horas pensando en el producto, no en la infraestructura.

---

## Reflexión final

El tiempo real no tiene que ser complicado. Esa es la lección de esta tarde. No fue un hack ni un atajo — fue simplemente usar una herramienta que me dejó pensar en lo que quería construir en vez de pelear con la infraestructura para llegar ahí.

Hay algo poderoso en sentarte con una idea y tenerla funcionando antes de que se enfríe el café. No porque seas rápido, sino porque nada se interpuso en el camino. Esa es la sensación que quiero perseguir en cada proyecto que arranque de aquí en adelante.

---

## Recursos

- **Código fuente:** [github.com/rockalabs/rocka-chat-tutorial](https://github.com/rockalabs/rocka-chat-tutorial)
- **Slides:** [slides.com/xergioalex/meteorjs-live-chat](https://slides.com/xergioalex/meteorjs-live-chat)
- **Meteor.js:** [meteor.com](https://www.meteor.com/)
- **PereiraJS:** [pereiratechtalks.org](https://www.pereiratechtalks.org/)
