---
title: "Introducción a Docker"
description: "Lo que compartí en una charla sobre Docker y arquitecturas orientadas a microservicios — contenedores, características de microservicios y demos prácticas."
pubDate: "2018-12-13"
heroImage: "/images/blog/posts/docker-introduction/hero.webp"
heroLayout: "side-by-side"
tags: ["talks", "tech", "devops", "docker"]
keywords: ["introducción a Docker", "qué es Docker y para qué sirve", "contenedores Docker para principiantes", "Docker y microservicios", "cómo usar Docker", "imágenes y contenedores Docker", "Docker en arquitecturas modernas"]
---

Docker con enfoque en **arquitecturas orientadas a microservicios**. La idea: conectar ambos mundos — por un lado, qué define un microservicio y por qué importa; por otro, cómo Docker y los contenedores encajan en ese panorama para construir sistemas autónomos, aislados y escalables.

---

## ¿Qué es un microservicio?

Un microservicio hace **una cosa y la hace muy bien**. Es una unidad autocontenida de funcionalidad. En la charla desglosé las características que suelen definir este estilo de arquitectura:

- **Autónomo** — Se identifica por una ubicación única (URL). Es una unidad autocontenida.
- **Aislado** — Puedes modificarlo, probarlo y desplegarlo sin impactar otras áreas del sistema.
- **Elástico** — Se escala de forma independiente: vertical (más recursos) u horizontal (más instancias).
- **Resiliente** — Tolera fallos y mantiene alta disponibilidad.
- **Responsivo** — Responde en un tiempo razonable.
- **Orientado a mensajes** — Usa paso de mensajes asíncronos para establecer límites entre componentes.
- **Programable** — Expone APIs para desarrolladores, administradores y aplicaciones que se componen de múltiples servicios.
- **Automatizado** — Su ciclo de vida se gestiona con automatización: dev, build, test, staging, producción y distribución.

---

## ¿Son los microservicios la bala de plata?

**No.** Son una herramienta, no una religión. La charla cubrió cuándo ayudan y cuándo añaden complejidad. La clave es entender las contraprestaciones: más servicios implican más latencia de red, más complejidad operativa y desafíos con transacciones distribuidas. No todo proyecto necesita microservicios desde el día uno.

---

## Conceptos de Docker

Pasé a los conceptos básicos de Docker: **contenedores**, **imágenes**, **Docker Compose** para orquestar múltiples servicios, y cómo encajan en un flujo de desarrollo y despliegue. También mencioné **Docker Machine** y **Docker Swarm** para entornos más avanzados.

---

## Demos

En la charla mostré demos en vivo, incluyendo un load balancer con Docker. El código está disponible en los repos que compartí.

---

## Recursos

### Demos y artículos

- [Docker Load Balancer Demo](https://github.com/xergioalex/docker-load-balancer)
- [Divide and Conquer — Microservice Approach](https://www.art2link.com/divide-conquer-microservice-approach/)
- [Ghost Docker](https://github.com/xergioalex/ghostDocker)
- [Django Multiple Databases](https://github.com/xergioalex/django-multiple-databases-engines)

### Documentación oficial

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Docker Machine](https://docs.docker.com/machine/)
- [Docker Swarm](https://docs.docker.com/engine/swarm/)
- [GitHub GraphQL API](https://developer.github.com/v4/) — útil para integrar con APIs modernas desde tus contenedores

---

Si querés un deep dive práctico en Docker — desde Dockerfiles y volúmenes hasta redes y Docker Compose — mirá el [Workshop Introductorio a Docker](/es/blog/docker-introductory-workshop/) que realicé en Rocka Labs.

---

[Ver slides](https://slides.com/xergioalex/docker-introduction)

A seguir construyendo.
