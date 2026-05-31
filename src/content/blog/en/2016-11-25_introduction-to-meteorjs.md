---
title: "Introduction to Meteor.js"
description: "My first tech talk ever — building a real-time chat app with Meteor.js from zero to working prototype in minutes, with reactive data and no WebSockets setup."
pubDate: "2016-11-25"
heroImage: "/images/blog/posts/introduction-to-meteorjs/hero.webp"
heroLayout: "banner"
tags: ["talks", "tech", "javascript", "web-development"]
keywords: ["Meteor.js introduction", "first tech talk Meteor", "PereiraJS meetup", "reactive JavaScript framework", "Meteor.js real-time apps", "building chat app Meteor", "Node.js full-stack framework"]
---

This was my **first talk ever** in a tech community. I gave it at [Pereira JS](https://www.pereiratechtalks.org/edicion-especial-desde-la-utp/) during a special edition held at the Universidad Tecnológica de Pereira (UTP), alongside Manuel Pineda's talk on P2P and WebTorrent. It was a great experience — and the topic I chose was Meteor.js.

---

## What is Meteor.js?

[Meteor](https://www.meteor.com/) is a full-stack JavaScript platform that lets you build web and mobile apps with a single codebase. What makes it stand out is how **reactive** everything feels out of the box. You write code once, and changes propagate automatically between the client and the server. No manual AJAX calls, no complex state management — just a clean, reactive data layer.

Key ideas:

- **Full-stack JavaScript** — Same language on the client and server. No context switching.
- **Real-time by default** — Data syncs automatically. Perfect for chat, dashboards, collaborative tools.
- **Publications and subscriptions** — You declare what data each client needs; Meteor handles the rest.
- **Hot reload** — See your changes instantly during development.
- **Atmosphere packages** — A rich ecosystem of packages for auth, UI, APIs, and more.

---

## The Demo: Building a Live Chat in Minutes

The core of my talk was a live demo. I wanted to show how quickly you could build a **real-time chat** with Meteor — something that would normally require WebSockets, a database, and a lot of glue code. With Meteor, it felt almost trivial.

### The Setup

```bash
meteor create chat-app
cd chat-app
meteor
```

That's it. You get a running app with a reactive stack already wired up.

### The Model

We used a simple `Messages` collection. In Meteor, collections are **reactive** — when you insert a document on the server, every subscribed client gets the update automatically. No polling, no manual refresh.

### The Magic: Publish & Subscribe

On the server, you **publish** the data you want to expose:

```javascript
Meteor.publish('messages', function () {
  return Messages.find({}, { sort: { createdAt: -1 }, limit: 50 });
});
```

On the client, you **subscribe** to it:

```javascript
Meteor.subscribe('messages');
```

Once subscribed, `Messages.find()` on the client returns reactive data. Add a new message? It appears everywhere, instantly.

### Inserting Messages

We used a **Meteor Method** to insert messages securely (validation on the server):

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

### The UI

With Blaze (Meteor's default templating), we rendered the list with `{{#each}}`. When the collection changed, the DOM updated automatically. A simple form called the method, and new messages showed up for everyone in real time.

The whole thing — from zero to a working multi-user chat — took just a few minutes.

---

## Why Meteor Feels Special

Building real-time apps usually means:

- Setting up WebSockets or Socket.io
- Managing connection state, reconnection, and fallbacks
- Syncing data between client and server manually
- Handling conflicts and offline scenarios

Meteor abstracts most of that. You focus on your app logic; the framework handles the real-time plumbing. Coming from traditional request-response web development, it feels like a leap into the future.

---

## Slides & Event Reference

- [View slides](https://slides.com/xergioalex/meteorjs)
- [Source code (GitHub)](https://github.com/rockalabs/rocka-chat-tutorial)
- [Pereira Tech Talks blog post](https://www.pereiratechtalks.org/edicion-especial-desde-la-utp/) — event context (special edition at UTP)
