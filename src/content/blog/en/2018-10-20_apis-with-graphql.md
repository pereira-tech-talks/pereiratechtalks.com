---
title: "Introduction to APIs with GraphQL"
description: "Why GraphQL changed how I build APIs: strong typing, client-driven queries, one endpoint, and an experience that makes REST feel outdated."
pubDate: "2018-10-20"
heroImage: "/images/blog/posts/apis-with-graphql/hero.webp"
heroLayout: "banner"
tags: ["talks", "tech", "web-development", "devops", "graphql"]
keywords: ["GraphQL API tutorial", "GraphQL vs REST comparison", "GraphQL schemas queries mutations", "GraphQL resolvers explained", "single endpoint API GraphQL", "client-defined queries GraphQL", "GraphQL strong typing benefits"]
---

I'll be honest: the first time I used GraphQL, I thought it was over-engineered. "Why do I need a whole query language when REST works fine?" Then I built a mobile app that made 12 different API calls just to render one screen. That's when GraphQL clicked.

GraphQL is a **query language** designed for communication between clients and servers. Facebook created it in 2012 to solve a very real problem: their mobile apps were slow, bloated, and making way too many network requests. They needed a better way.

What I love most about GraphQL: **the client defines what it receives**. No more over-fetching. No more under-fetching. No more chaining requests. Just ask for exactly what you need, and that's what you get.

And no, GraphQL is nothing like SQL — the name is misleading. It's a query language for APIs, not databases.

---

## REST vs GraphQL: Why I Switched

Let me walk you through the practical differences that convinced me:

| REST | GraphQL |
|------|---------|
| It's a convention (not a spec) | It's a typed language with a spec |
| Server decides what data to send | Client defines exactly what it receives |
| Often sends more data than needed | Only requested fields are sent |
| Multiple requests per view | One request per view |
| Documentation is manual and often outdated | Self-documenting by definition |
| Multiple endpoints (`/users`, `/users/:id`, `/posts`, etc.) | Single endpoint: `/graphql` |
| Versioning required for breaking changes | Schema evolution without versions |

Here's a real-world example. Say you're building a blog and need to show a user's profile with their latest posts.

**With REST:**

```javascript
// Request 1: Get user
GET /api/users/123
// Returns: { id, name, email, bio, avatar, createdAt, updatedAt, ... }

// Request 2: Get user's posts
GET /api/users/123/posts
// Returns: [{ id, title, content, createdAt, ... }, ...]
```

You made two requests. The first one sent you fields you don't need (`createdAt`, `updatedAt`). The second one might have sent full post content when you only needed titles and dates.

**With GraphQL:**

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

One request. Only the fields you need. No over-fetching. No under-fetching. That's the power.

---

## Core Concepts That Matter

### Schema: The Contract

The schema defines your API's structure. It's the contract between client and server — written in GraphQL's type system.

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

The `!` means the field is non-nullable. `[Post!]!` means "an array of Post objects, and both the array and its items are non-nullable." The type system catches errors at query time, not runtime.

### Types: Strong Typing Everywhere

GraphQL has built-in scalar types:

- `Int` — 32-bit integer
- `Float` — Floating-point number
- `String` — UTF-8 text
- `Boolean` — true/false
- `ID` — Unique identifier (serialized as string)

You can also define custom types, enums, and interfaces. The type system makes your API self-validating.

### Queries: Reading Data

Queries are how you read data. They look like JSON, but they're not — they're GraphQL syntax.

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

The response matches the query structure exactly:

```json
{
  "data": {
    "user": {
      "name": "Sergio Alexander",
      "avatar": "/images/profile.jpg",
      "posts": [
        {
          "title": "Introduction to APIs with GraphQL",
          "publishedAt": "2018-10-20",
          "comments": { "count": 12 }
        }
      ]
    }
  }
}
```

### Mutations: Writing Data

Mutations change data. They're like POST/PUT/DELETE in REST, but with the same predictable structure as queries.

```graphql
mutation CreatePost {
  createPost(input: {
    title: "My New Post"
    content: "GraphQL is amazing."
    tags: ["tech", "graphql"]
  }) {
    id
    title
    publishedAt
  }
}
```

Notice you can request specific fields back after the mutation. Want to know the newly created post's ID? Just ask for it.

### Resolvers: The Magic Behind the Scenes

Resolvers are functions that return data for each field in your schema. This is where your business logic lives.

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

Each resolver gets:
- `parent` — The result from the parent field
- `args` — The arguments passed to the field
- `context` — Shared data (like database connections, auth info)

GraphQL's execution engine calls these resolvers in the right order, builds the response tree, and returns exactly what was requested.

---

## Why GraphQL Matters to Me

After building APIs with both REST and GraphQL, here's what changed for me:

**1. Developer Experience**

The introspection and tooling are incredible. Tools like GraphiQL and Apollo Studio give you autocomplete, inline docs, and query validation as you type. You don't need Postman or separate documentation — the API documents itself.

**2. Frontend Speed**

Reducing network requests means faster apps. Mobile users on slow connections notice the difference immediately. One GraphQL request replaces 5-10 REST calls.

**3. Backend Flexibility**

I can add fields to the schema without breaking existing queries. Clients only request what they need, so adding new data doesn't affect them. No versioning headaches.

**4. Type Safety**

The type system catches errors early. Invalid queries fail before they hit the server. TypeScript codegen creates type-safe clients automatically from your schema.

**Platform Agnostic**

GraphQL has implementations in over 20 languages. I've used it with Node.js, Python, Go, and Rust. The concepts stay the same.

---

## Real Example: Star Wars API

If you want to play with GraphQL, try the [Star Wars API (SWAPI)](https://graphql.org/swapi-graphql/). It's a public GraphQL endpoint with data about films, characters, planets, and starships.

Try this query:

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

Notice how you traverse relationships (`films -> characters -> homeworld`) in one query. With REST, that would be multiple requests with complex joins.

---

## Resources I Shared

### GraphQL

- [GraphQL Specification](https://facebook.github.io/graphql/October2016/) — Official spec
- [GraphQL.js](https://github.com/graphql/graphql-js) — Reference implementation
- [GraphQL SWAPI](https://graphql.org/swapi-graphql/) — Star Wars API playground
- [GraphQL Documentation](https://graphql.org/) — Apollo Launchpad has been shut down
- [GraphQL Voyager](https://github.com/APIs-guru/graphql-voyager) — Visualize schemas as graphs
- [Graphene (Python)](https://graphene-python.org/) — Python GraphQL framework
- [Apollo Client](https://www.apollographql.com/client) — Client-side GraphQL library
- [Awesome GraphQL](https://github.com/chentsulin/awesome-graphql) — Curated list of resources

### Recommended Talk

- [Por qué API REST está muerto y debemos usar APIs GraphQL](https://www.youtube.com/watch?v=cUIhcgtMvGc) — José María Rodríguez Hurtado

---

[View slides](https://slides.com/xergioalex/apis-with-graphql)

Let's keep building.
