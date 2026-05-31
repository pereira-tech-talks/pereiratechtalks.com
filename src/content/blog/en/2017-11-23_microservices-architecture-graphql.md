---
title: "Microservices Architecture and APIs with GraphQL"
description: "Why I moved from REST to GraphQL for microservices — divide and conquer, client-defined queries, and the trade-offs you need to know."
pubDate: "2017-11-23"
heroImage: "/images/blog/posts/microservices-architecture-graphql/hero.webp"
heroLayout: "banner"
tags: ["talks", "tech", "web-development", "docker", "graphql"]
keywords: ["microservices architecture GraphQL", "REST vs GraphQL APIs", "microservices distributed systems", "GraphQL API design", "divide and conquer microservices", "client-controlled queries GraphQL", "microservices vs monolith"]
---

Microservices and GraphQL — a topic I'm excited about. I've been building distributed systems and REST is falling short for what I need on the mobile side. GraphQL is gaining traction and I wanted to share what I've learned.

Here are the concepts I covered. If you prefer to see the slides directly, [here they are](https://slides.com/xergioalex/microservices-architecture-and-apis-with-graphql).

<figure>
  <img src="/images/blog/posts/microservices-architecture-graphql/audience.webp" alt="Audience during the talk at Pereira Tech Talks" loading="lazy" />
  <figcaption>Attendees at the Pereira Tech Talks microservices and GraphQL session in November 2017.</figcaption>
</figure>

---

## Divide and Conquer

The core principle behind microservices is simple: **divide and conquer**. Instead of building a monolithic application that does everything, we break the system into smaller, focused services. Each microservice does one thing and does it well — a philosophy I inherited from the Unix tradition and that has served me well for scalable, maintainable architectures.

<figure>
  <img src="/images/blog/posts/microservices-architecture-graphql/divide-and-conquer.webp" alt="Divide and conquer — the strategic principle behind microservices" loading="lazy" />
  <figcaption>The classic "divide and conquer" principle visualized — the core philosophy behind splitting a monolith into services.</figcaption>
</figure>

---

## What Is a Microservice?

To me, a microservice is a self-contained unit of functionality that meets several characteristics I value:

- **Does one thing well** — focused on a single business capability
- **Is autonomous** — identified by a unique URL, operates independently
- **Is isolated** — I can modify, test, and deploy it without impacting other parts of the solution
- **Is elastic** — can be scaled independently (vertically or horizontally)
- **Is resilient** — fault tolerant and highly available
- **Is responsive** — responds to requests in a reasonable amount of time
- **Is message oriented** — relies on asynchronous message-passing to establish boundaries between components
- **Is programmable** — exposes APIs; applications are composed from multiple microservices
- **Is automated** — its lifecycle (dev, build, test, staging, production) is managed through automation

---

## Are They the Silver Bullet? No.

Whenever I talk about microservices, someone asks if they're the solution for everything. **No.** They're a powerful pattern, but they come with trade-offs. I showed this table in the talk:

| Pros | Cons |
|------|------|
| **Scalable** | Network latency increases with message interchange |
| **Reduce deployment costs** | Deployment and testing complexity grows with the number of service interactions |
| **Can be developed by a small team** | Too fine-grained services may create more overhead than utility |
| **Team only needs to know the service's business logic** | Message formats, restrictions, and interaction knowledge are required |
| **Continuous deployment** | Versioning is critical due to interactions with older service versions |
| **Use the technology you prefer** | Transactional operations across many services increase logic complexity |

---

## GraphQL: Why It Won Me Over

GraphQL was created by Facebook in 2012, driven by the mobile team. It's a **query language** for communication between clients and servers — a complete alternative to REST. (Note: it's not like SQL; it's a typed API language, not a database query language.)

What I liked most from the start: the client defines what it receives. No more over-fetching or multiple requests per view.

### REST vs GraphQL

| REST | GraphQL |
|------|---------|
| It's a convention | It's a typed language |
| Server exposes resources | Client defines what it receives |
| Often sends more data than needed | Only necessary data is sent |
| Multiple requests per view | One request per view |
| Documentation separate from development | Documented by definition |
| Multiple endpoints | Single endpoint: `/graphql` |

### Core Concepts

- **Schema** — Defines the structure of your API
- **Types** — Strong typing for queries and responses
- **Queries** — Read operations
- **Mutations** — Write operations
- **Resolvers** — Functions that resolve each field in the schema

If you want to play with a real example, the [Star Wars API (SWAPI)](https://graphql.org/swapi-graphql/) is great to explore.

---

## Resources I Use

### GraphQL

- [GraphQL Specification](https://facebook.github.io/graphql/October2016/)
- [GraphQL.js](https://github.com/graphql/graphql-js)
- [GraphQL SWAPI](https://graphql.org/swapi-graphql/)
- [GraphQL Documentation](https://graphql.org/) — Apollo Launchpad has been shut down
- [Graphene (Python)](https://graphene-python.org/)
- [Apollo Client](https://www.apollographql.com/client)
- [Awesome GraphQL](https://github.com/chentsulin/awesome-graphql)

### Microservices & Docker

- [Divide and Conquer – The Microservice Approach](https://www.art2link.com/divide-conquer-microservice-approach/)
- [Docker Load Balancer Demo](https://github.com/xergioalex/docker-load-balancer) — a project of mine I used in the demo
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Recommended Talk

- [Por qué API REST está muerto y debemos usar APIs GraphQL](https://www.youtube.com/watch?v=cUIhcgtMvGc) — José María Rodríguez Hurtado (Spanish)

---

[View full presentation](https://slides.com/xergioalex/microservices-architecture-and-apis-with-graphql)

Let's keep building.
