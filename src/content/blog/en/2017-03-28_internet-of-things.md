---
title: "Introduction to the Internet of Things"
description: "I teamed up with Alejandro Rendon to explore IoT — from sensors and controllers to programming robots with JavaScript and Johnny-five."
pubDate: "2017-03-28"
heroImage: "/images/blog/posts/internet-of-things/hero.webp"
heroLayout: "banner"
tags: ["talks", "tech", "iot"]
keywords: ["IoT introduction JavaScript", "Arduino Johnny-five tutorial", "Internet of Things JavaScript", "Node.js robotics programming", "Johnny-five Arduino framework", "JavaScript IoT development", "hardware programming JavaScript"]
---

Hardware has always fascinated me. As a software developer who spends most of my time in the cloud, there's something deeply satisfying about making physical things move, blink, and respond to the world. So when [Alejandro Rendon](https://www.linkedin.com/in/alejorendon/) and I started planning a talk for [Pereira Tech Talks](https://www.pereiratechtalks.org/introduccion-al-internet-de-las-cosas-y-clustering-con-nodejs/), I knew I wanted to dive into the Internet of Things — the technology that bridges software and the physical world.

The timing felt right. IoT was exploding in 2017 — smart homes, wearables, industrial sensors — and the barrier to entry was lower than ever. You could buy an Arduino for a few dollars and start controlling LEDs, motors, and sensors with just a few lines of code. For a JavaScript developer like me, the fact that you could do all of this with Node.js made it even more compelling.

Alejandro covered distributed computing with Node.js clusters, and I focused on IoT fundamentals. The goal was simple: demystify the hardware layer and show that you don't need to be an electrical engineer to build connected devices.

---

## What is the Internet of Things?

The **Internet of Things** refers to the network of physical devices — sensors, actuators, and controllers — that connect to the internet and exchange data. It's often called a second industrial revolution because it bridges the physical and digital worlds: machines talk to each other, to the cloud, and to us.

Think about it: your thermostat adjusts the temperature based on your location, your fitness tracker sends heart rate data to your phone, your car alerts you when tire pressure is low. These aren't just gadgets — they're part of a massive network of devices that sense, decide, and act without human intervention.

What excites me most about IoT is that it extends software into the real world. Instead of just manipulating data on screens, you're controlling motors, reading temperature sensors, and automating physical processes. It's programming with consequences you can see and touch.

<figure>
  <img src="/images/blog/posts/internet-of-things/iot-1.webp" alt="IoT talk at Pereira Tech Talks" loading="lazy" />
  <figcaption>Presenting the IoT fundamentals session at Pereira Tech Talks in March 2017.</figcaption>
</figure>

---

## The Three Essential Components

Every IoT system is built from three core elements. Understanding these helps you see how even the most complex smart devices work:

1. **Sensors** — Capture data from the environment (temperature, light, motion, humidity, pressure, etc.). Sensors are the "eyes and ears" of an IoT system. They observe the physical world and convert it into data.

2. **Actuators** — Perform actions in the physical world (motors, LEDs, relays, speakers, servos). Actuators are the "hands" of the system. They take digital commands and turn them into movement, light, sound, or heat.

3. **Controllers** — Process data and decide what to do (microcontrollers like Arduino, Raspberry Pi, ESP8266). Controllers are the "brain." They read sensor data, run your code, and tell actuators what to do.

Together they form feedback loops: sense → decide → act. A motion sensor detects movement, the controller decides to turn on a light, and an LED actuator illuminates the room. Simple, but powerful.

In the talk, I walked through examples of each component and showed how they work together. The audience was curious — many had heard of Arduino but hadn't realized how accessible it was to get started.

<figure>
  <img src="/images/blog/posts/internet-of-things/iot-2.webp" alt="IoT components and robotics" loading="lazy" />
  <figcaption>Demonstrating sensors, actuators, and controllers — the three essential building blocks of any IoT system.</figcaption>
</figure>

---

## Programming Hardware with Node.js: Johnny-five

Here's where things get fun. Most people assume you need to write C or C++ to program microcontrollers. That's true for low-level embedded systems, but for prototyping and learning, there's a better way: JavaScript.

[Johnny-five](https://johnny-five.io/) is a JavaScript robotics and IoT platform. It lets you control Arduino, Raspberry Pi, and other boards from Node.js — no need to write C or C++. You write JavaScript, and Johnny-five handles the low-level communication with the hardware.

Why does this matter? Because JavaScript is familiar to millions of developers. If you know how to build a web app, you already have the skills to build a robot. That's a huge unlock.

### Your First Robot

In the talk, I showed how to get started: connect an Arduino via USB, install Johnny-five with npm, and blink an LED in about ten lines of code. The audience loved it — there's something magical about writing `led.blink(500)` and watching a physical LED turn on and off.

From there, the possibilities explode. You can read temperature sensors, control servos, build robots that follow lines, create smart home devices, or build data loggers that send sensor readings to a database. All with JavaScript.

I walked through a few examples: reading a button press, controlling an LED, and using a servo motor to move a robotic arm. The demo wasn't perfect — live hardware demos never are — but it worked well enough to show the potential.

What struck me most during the Q&A was how many people had ideas they wanted to try. Someone asked about building a plant watering system. Another person wanted to automate their garage door. IoT doesn't have to be abstract — it's most interesting when it solves real problems in your own life.

---

## Event Memories

<figure>
  <img src="/images/blog/posts/internet-of-things/iot-3.webp" alt="Pereira Tech Talks meetup — Jonathan Alvarez inviting to JsConf" loading="lazy" />
  <figcaption>Jonathan Alvarez taking the mic to invite the Pereira community to JsConf Colombia in Medellin.</figcaption>
</figure>

<figure>
  <img src="/images/blog/posts/internet-of-things/iot-4.webp" alt="Pereira Tech Talks meetup" loading="lazy" />
  <figcaption>The Pereira Tech Talks audience — a growing local tech community connecting to the national JavaScript scene.</figcaption>
</figure>

One of the best parts of the event was seeing [Jonathan Alvarez](https://twitter.com/jonalvarezz) invite the community to attend [JsConf Colombia](https://jsconf.co/) in Medellin. JsConf was a big deal — a chance to connect with the broader JavaScript community and see what people were building across Latin America.

For me, that invitation represented something larger: Pereira's tech community was growing. We were no longer isolated. We were part of a national and international network of developers sharing ideas and learning together.

---

## Reflections

Looking back, this talk was a turning point for me. It confirmed that I love teaching and that I wanted to keep contributing to the local tech community. It also deepened my appreciation for hardware — something I'd always been curious about but never fully explored.

IoT is still evolving. The tooling has improved, the hardware is cheaper and more powerful, and the use cases are expanding into industrial IoT, smart cities, and healthcare. But the fundamentals remain the same: sensors, actuators, controllers, and the magic of connecting software to the physical world.

If you're interested in IoT, start small. Grab an Arduino kit, install Johnny-five, and make an LED blink. Then build from there. The barrier to entry has never been lower.

---

## Slides & Event Reference

- [View slides](https://slides.com/xergioalex/internet-of-things)
- [Pereira Tech Talks blog post](https://www.pereiratechtalks.org/introduccion-al-internet-de-las-cosas-y-clustering-con-nodejs/) — event recap (IoT + Node.js clustering)
