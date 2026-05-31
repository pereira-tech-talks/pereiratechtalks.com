---
title: 'Introducción a APIs con GraphQL'
description: 'GraphQL cambió cómo construyo APIs: tipado fuerte, consultas del cliente, un endpoint y una experiencia de desarrollo que deja atrás a REST.'
pubDate: '2018-10-20'
heroImage: '/images/blog/posts/apis-with-graphql/hero.webp'
heroLayout: 'banner'
tags: ["talks", "tech", "web-development", "devops", "graphql"]
keywords: ["introducción a GraphQL", "qué es GraphQL y cómo funciona", "GraphQL vs REST APIs", "consultas con GraphQL", "lenguaje de consulta para APIs", "GraphQL tipado fuerte", "cómo implementar GraphQL"]
---

Voy a ser honesto: la primera vez que usé GraphQL, pensé que estaba sobre-ingeniado. "¿Por qué necesito todo un lenguaje de consulta cuando REST funciona bien?" Luego construí una app móvil que hacía 12 llamadas API diferentes solo para renderizar una pantalla. Ahí fue cuando GraphQL hizo clic.

GraphQL es un **lenguaje de consulta** diseñado para la comunicación entre clientes y servidores. Facebook lo creó en 2012 para resolver un problema muy real: sus apps móviles eran lentas, infladas, y hacían demasiadas peticiones de red. Necesitaban una mejor forma.

Lo que más amo de GraphQL: **el cliente define qué recibe**. No más over-fetching. No más under-fetching. No más encadenamiento de requests. Solo pedís exactamente lo que necesitás, y eso es lo que obtenés.

Y no, GraphQL no es nada como SQL — el nombre es engañoso. Es un lenguaje de consulta para APIs, no para bases de datos.

---

## REST vs GraphQL: Por Qué Cambié

Déjame mostrarte las diferencias prácticas que me convencieron:

| REST | GraphQL |
|------|---------|
| Es una convención (no una especificación) | Es un lenguaje tipado con una spec |
| El servidor decide qué datos enviar | El cliente define exactamente qué recibe |
| Suele enviar más datos de los necesarios | Solo se envían los campos solicitados |
| Múltiples requests por vista | Un request por vista |
| La documentación es manual y suele estar desactualizada | Auto-documentado por definición |
| Múltiples endpoints (`/users`, `/users/:id`, `/posts`, etc.) | Un solo endpoint: `/graphql` |
| Versionado requerido para cambios breaking | Evolución del schema sin versiones |

Acá va un ejemplo del mundo real. Digamos que estás construyendo un blog y necesitás mostrar el perfil de un usuario con sus posts más recientes.

**Con REST:**

```javascript
// Request 1: Obtener usuario
GET /api/users/123
// Retorna: { id, name, email, bio, avatar, createdAt, updatedAt, ... }

// Request 2: Obtener posts del usuario
GET /api/users/123/posts
// Retorna: [{ id, title, content, createdAt, ... }, ...]
```

Hiciste dos requests. El primero te envió campos que no necesitás (`createdAt`, `updatedAt`). El segundo puede haber enviado el contenido completo de los posts cuando solo necesitabas títulos y fechas.

**Con GraphQL:**

```graphql
query {
  user(id: "123") {
    name
    avatar
    posts(limit: 5) {
      title
      publishedAt
    }
  }
}
```

Un request. Solo los campos que necesitás. Sin over-fetching. Sin under-fetching. Ese es el poder.

---

## Conceptos clave que importan

### Schema: El Contrato

El schema define la estructura de tu API. Es el contrato entre cliente y servidor — escrito en el sistema de tipos de GraphQL.

```graphql
type User {
  id: ID!
  name: String!
  email: String!
  posts: [Post!]!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
  publishedAt: String
}
```

El `!` significa que el campo no puede ser null. `[Post!]!` significa "un array de objetos Post, y tanto el array como sus items no pueden ser null." El sistema de tipos atrapa errores en tiempo de consulta, no en runtime.

### Types: Tipado Fuerte en Todos Lados

GraphQL tiene tipos escalares integrados:

- `Int` — Entero de 32 bits
- `Float` — Número de punto flotante
- `String` — Texto UTF-8
- `Boolean` — true/false
- `ID` — Identificador único (serializado como string)

También podés definir tipos personalizados, enums e interfaces. El sistema de tipos hace que tu API se auto-valide.

### Queries: Leyendo Datos

Las queries son cómo leés datos. Se ven como JSON, pero no lo son — es sintaxis GraphQL.

```graphql
query GetUserProfile {
  user(id: "123") {
    name
    avatar
    posts(limit: 3, orderBy: PUBLISHED_DESC) {
      title
      publishedAt
      comments {
        count
      }
    }
  }
}
```

La respuesta coincide exactamente con la estructura de la query:

```json
{
  "data": {
    "user": {
      "name": "Sergio Alexander",
      "avatar": "/images/profile.jpg",
      "posts": [
        {
          "title": "Introducción a APIs con GraphQL",
          "publishedAt": "2018-10-20",
          "comments": { "count": 12 }
        }
      ]
    }
  }
}
```

### Mutations: Escribiendo Datos

Las mutations cambian datos. Son como POST/PUT/DELETE en REST, pero con la misma estructura predecible que las queries.

```graphql
mutation CreatePost {
  createPost(input: {
    title: "Mi Nuevo Post"
    content: "GraphQL es increíble."
    tags: ["tech", "graphql"]
  }) {
    id
    title
    publishedAt
  }
}
```

Notá que podés solicitar campos específicos de vuelta después de la mutation. ¿Querés saber el ID del post recién creado? Solo pedilo.

### Resolvers: La Magia Detrás de Escena

Los resolvers son funciones que retornan datos para cada campo en tu schema. Acá es donde vive tu lógica de negocio.

```javascript
const resolvers = {
  Query: {
    user: (parent, { id }, context) => {
      return context.db.getUserById(id);
    },
  },
  User: {
    posts: (user, { limit }, context) => {
      return context.db.getPostsByAuthor(user.id, limit);
    },
  },
  Mutation: {
    createPost: (parent, { input }, context) => {
      return context.db.createPost(input);
    },
  },
};
```

Cada resolver recibe:
- `parent` — El resultado del campo padre
- `args` — Los argumentos pasados al campo
- `context` — Datos compartidos (como conexiones a DB, info de auth)

El motor de ejecución de GraphQL llama a estos resolvers en el orden correcto, construye el árbol de respuesta, y retorna exactamente lo que se solicitó.

---

## Por qué GraphQL me importa

Después de construir APIs con REST y GraphQL, esto es lo que cambió para mí:

**1. Experiencia de Desarrollo**

La introspección y el tooling son increíbles. Herramientas como GraphiQL y Apollo Studio te dan autocompletado, docs inline, y validación de queries mientras escribís. No necesitás Postman ni documentación separada — la API se auto-documenta.

**2. Velocidad del Frontend**

Reducir los network requests significa apps más rápidas. Los usuarios móviles en conexiones lentas notan la diferencia inmediatamente. Un request GraphQL reemplaza 5-10 llamadas REST.

**3. Flexibilidad del Backend**

Puedo agregar campos al schema sin romper queries existentes. Los clientes solo piden lo que necesitan, así que agregar nuevos datos no los afecta. Sin dolores de cabeza de versionado.

**4. Type Safety**

El sistema de tipos atrapa errores temprano. Las queries inválidas fallan antes de llegar al servidor. La generación de código TypeScript crea clientes type-safe automáticamente desde tu schema.

**Agnóstico de Plataforma**

GraphQL tiene implementaciones en más de 20 lenguajes. Lo he usado con Node.js, Python, Go y Rust. Los conceptos siguen siendo los mismos.

---

## Ejemplo real: API de Star Wars

Si querés jugar con GraphQL, probá la [API de Star Wars (SWAPI)](https://graphql.org/swapi-graphql/). Es un endpoint GraphQL público con datos sobre películas, personajes, planetas y naves.

Probá esta query:

```graphql
query {
  allFilms {
    films {
      title
      director
      releaseDate
      characterConnection {
        characters {
          name
          homeworld {
            name
          }
        }
      }
    }
  }
}
```

Notá cómo atravesás relaciones (`films -> characters -> homeworld`) en una sola query. Con REST, eso serían múltiples requests con joins complejos.

---

## Recursos que Compartí

### GraphQL

- [Especificación GraphQL](https://facebook.github.io/graphql/October2016/) — Spec oficial
- [GraphQL.js](https://github.com/graphql/graphql-js) — Implementación de referencia
- [GraphQL SWAPI](https://graphql.org/swapi-graphql/) — Playground de la API de Star Wars
- [Documentación GraphQL](https://graphql.org/) — Apollo Launchpad fue discontinuado
- [GraphQL Voyager](https://github.com/APIs-guru/graphql-voyager) — Visualiza schemas como grafos
- [Graphene (Python)](https://graphene-python.org/) — Framework GraphQL para Python
- [Apollo Client](https://www.apollographql.com/client) — Librería GraphQL del lado del cliente
- [Awesome GraphQL](https://github.com/chentsulin/awesome-graphql) — Lista curada de recursos

### Charla recomendada

- [Por qué API REST está muerto y debemos usar APIs GraphQL](https://www.youtube.com/watch?v=cUIhcgtMvGc) — José María Rodríguez Hurtado

---

[Ver slides](https://slides.com/xergioalex/apis-with-graphql)

A seguir construyendo.
