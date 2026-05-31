---
title: "WebVR with A-Frame"
description: "Building VR experiences with HTML — my talk at Pereira Tech Talks on A-Frame, Mozilla's framework bringing virtual reality to the web with zero configuration."
pubDate: "2018-02-16"
heroImage: "/images/blog/posts/webvr-aframe/webvr-aframe-talk-hero.webp"
heroLayout: "banner"
tags: ["talks", "tech", "javascript", "web-development"]
keywords: ["A-Frame WebVR tutorial", "VR web browser JavaScript", "A-Frame HTML virtual reality", "WebVR without specialized tools", "Mozilla A-Frame framework", "VR HTML JavaScript", "browser-based virtual reality"]
---

Virtual reality on the web without specialized tools or complex setup — that was the promise I wanted to share at Pereira Tech Talks. A-Frame is a framework that lets you create 3D and VR experiences using just HTML and JavaScript, with no build step. If you know HTML, you can build VR.

---

## Why the Web for VR

I started by talking about hardware. High-end headsets — HTC Vive, Oculus Rift, Sony VR — cost hundreds of dollars. But the barrier to entry drops a lot with options like Cardboard (around $7) or VR Box (around $15). The web is the most important mass-distribution platform: you don't need to install anything, just a browser.

[WebVR](https://immersive-web.github.io/webvr/spec/1.1/) is the standard that defines the APIs a browser must expose for developers to create virtual reality experiences. Most WebVR experiences weigh less than 2 MB. And if you already know WebGL or Three.js, adding a bit of code gives you WebVR.

---

## A-Frame: VR with HTML

[A-Frame](https://aframe.io/) is an open-source framework by Mozilla built on Three.js. You don't have to deal with WebGL directly. It uses an **Entity-Component System** architecture:

- **Entities** — Container objects that components can be attached to. They're the base of everything in the scene.
- **Components** — Reusable modules that give entities appearance, behavior, or functionality.
- **Systems** — Provide global scope, management, and services for classes of components.

A-Frame's web inspector feels like working with Unity — you can inspect and modify the scene in real time.

---

## What I Showed in the Talk

I ran several live demos, from the basics to more elaborate projects:

- **Primitives** — Cubes, spheres, cylinders with HTML ([CodePen demo](https://codepen.io/xergioalex/pen/jZxbdo))
- **Sky and equirectangular images** — 360° scenes with photos
- **Textures and animations** — Attributes, stats, camera animation
- **3D models** — Collada, SketchUp 3D Warehouse, Blender
- **Video and audio** — Multimedia content in VR
- **Cursor events** — Interaction with the pointer
- **Physics** — With Cannon.js
- **Collisions and mazes** — Projects like [webvr-maze](https://github.com/xergioalex/webvr-maze)
- **Speech recognition** — Voice commands in VR

I also showed inspiration projects: Mozilla's A-Painter, A-Frame City Builder, and the React integration.

---

## Resources

- [View slides](https://slides.com/xergioalex/webvr-aframe)
- [A-Frame docs](https://aframe.io/docs/0.6.0/introduction/)
- [A-Frame Registry](https://aframe.io/aframe-registry/) — Community components
- **CodePen demos:** [Primitives](https://codepen.io/xergioalex/pen/jZxbdo), [Sky and inspector](https://codepen.io/xergioalex/pen/PQeZYy), [Textures](https://codepen.io/xergioalex/pen/VQxepd), [3D models](https://codepen.io/xergioalex/pen/JpvXrz), [Physics](https://codepen.io/xergioalex/pen/wyjowM), [Maze](https://github.com/xergioalex/webvr-maze)
- [Pereira Tech Talks blog post](https://www.pereiratechtalks.org/realidad-virtual-para-la-web-con-a-frame-y-point-free-javascript-con-ramdajs) — event recap

<figure>
  <img src="/images/blog/posts/webvr-aframe/webvr-aframe-event-memories.webp" alt="Event memories" loading="lazy" />
  <figcaption>Pereira Tech Talks audience exploring live A-Frame WebVR demos on their phones during the talk.</figcaption>
</figure>

---

The web continues to be the most accessible platform for experimenting with new technologies. WebVR opened doors that are still worth exploring — even as the standard evolves into WebXR, the core idea remains: making immersive experiences universally accessible.

Let's keep building.
