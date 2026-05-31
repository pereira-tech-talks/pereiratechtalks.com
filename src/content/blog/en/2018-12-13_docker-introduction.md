---
title: "Docker Introduction"
description: "What I shared in a talk on Docker and microservice-oriented architectures — containers, microservice characteristics, and practical demos."
pubDate: "2018-12-13"
heroImage: "/images/blog/posts/docker-introduction/hero.webp"
heroLayout: "side-by-side"
tags: ["talks", "tech", "devops", "docker"]
keywords: ["Docker introduction containers", "Docker microservices architecture", "Docker Compose tutorial", "containers vs virtual machines", "Docker for developers", "microservice oriented architecture Docker", "Docker containers explained"]
---

Docker with a focus on **microservice-oriented architectures**. The goal: connect both worlds — on one side, what defines a microservice and why it matters; on the other, how Docker and containers fit into that picture for building autonomous, isolated, and scalable systems.

---

## What is a Microservice?

A microservice does **one thing and does it very well**. It's a self-contained unit of functionality. In the talk I broke down the characteristics that typically define this architectural style:

- **Autonomous** — Identified by a unique location (URL). It's a self-contained unit.
- **Isolated** — You can modify, test, and deploy it without impacting other areas of the system.
- **Elastic** — Scales independently: vertically (more resources) or horizontally (more instances).
- **Resilient** — Fault tolerant and highly available.
- **Responsive** — Responds in a reasonable amount of time.
- **Message-oriented** — Relies on asynchronous message-passing to establish boundaries between components.
- **Programmable** — Exposes APIs for developers, administrators, and applications composed from multiple services.
- **Automated** — Its lifecycle is managed through automation: dev, build, test, staging, production, and distribution.

---

## Are Microservices the Silver Bullet?

**No.** They're a tool, not a religion. The talk covered when they help and when they add complexity. The key is understanding the trade-offs: more services mean more network latency, more operational complexity, and challenges with distributed transactions. Not every project needs microservices from day one.

---

## Docker Concepts

I moved on to Docker basics: **containers**, **images**, **Docker Compose** for orchestrating multiple services, and how they fit into a development and deployment flow. I also mentioned **Docker Machine** and **Docker Swarm** for more advanced setups.

---

## Demos

I showed live demos during the talk, including a load balancer with Docker. The code is available in the repos I shared.

---

## Resources

### Demos and articles

- [Docker Load Balancer Demo](https://github.com/xergioalex/docker-load-balancer)
- [Divide and Conquer — Microservice Approach](https://www.art2link.com/divide-conquer-microservice-approach/)
- [Ghost Docker](https://github.com/xergioalex/ghostDocker)
- [Django Multiple Databases](https://github.com/xergioalex/django-multiple-databases-engines)

### Official documentation

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Docker Machine](https://docs.docker.com/machine/)
- [Docker Swarm](https://docs.docker.com/engine/swarm/)
- [GitHub GraphQL API](https://developer.github.com/v4/) — useful for integrating with modern APIs from your containers

---

If you want a hands-on deep dive into Docker itself — from Dockerfiles and volumes to networks and Docker Compose — check out the [Docker Introductory Workshop](/blog/docker-introductory-workshop/) I conducted at Rocka Labs.

---

[View slides](https://slides.com/xergioalex/docker-introduction)

Let's keep building.
