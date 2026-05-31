---
title: "NoSQL and MongoDB"
description: "When SQL tables aren't enough — my introduction to NoSQL databases, MongoDB's document model, and when to choose flexibility over rigid schemas."
pubDate: "2016-12-13"
heroImage: "/images/blog/posts/nosql-and-mongodb/hero.webp"
heroLayout: "banner"
tags: ["talks", "tech", "database"]
keywords: ["NoSQL vs SQL comparison", "MongoDB introduction", "document database MongoDB", "when to use NoSQL", "MongoDB document model", "NoSQL vs relational database", "MongoDB for developers"]
---

I spent years working with relational databases — MySQL, PostgreSQL, the usual suspects. Tables, foreign keys, JOINs. It's a solid foundation, and for many problems, it's exactly what you need. But when I started building APIs that consumed JSON from third-party services, or mobile backends where the schema evolved every sprint, SQL started to feel rigid. I kept writing migrations to add columns, restructure tables, normalize data that didn't want to be normalized.

That's when I started exploring NoSQL — specifically MongoDB. This talk was my way of sharing what I learned: what NoSQL actually means, how it differs from SQL, and when each approach makes sense. I wanted to answer the questions I had when I started: *Why would I abandon tables? What do I gain? What do I lose?*

---

## What is NoSQL?

**NoSQL** stands for "Not Only SQL" — a broad term for databases that don't follow the rigid relational model. Instead of tables, rows, and columns, NoSQL databases use different structures: documents (MongoDB, CouchDB), key-value pairs (Redis, DynamoDB), graphs (Neo4j), or wide-column stores (Cassandra).

The rise of NoSQL came from a need to handle:

- **Scale** — Horizontal scaling, sharding, and distributed systems
- **Flexibility** — Schemas that evolve quickly without migrations
- **Performance** — Optimized for specific access patterns (reads, writes, aggregations)
- **Variety** — Unstructured or semi-structured data (logs, events, JSON from APIs)

In my experience, the schema flexibility was the killer feature. I could iterate on a product, add fields to documents, nest related data — all without writing `ALTER TABLE` scripts or coordinating migrations across environments.

---

## SQL vs NoSQL: Key Differences

| Aspect | SQL (Relational) | NoSQL |
|--------|------------------|-------|
| **Model** | Tables, rows, columns | Documents, key-value, graph, etc. |
| **Schema** | Fixed, defined upfront | Flexible, schema-less or schema-optional |
| **Scaling** | Vertical (bigger machine) | Horizontal (more machines) |
| **Transactions** | ACID, strong consistency | Varies (eventual consistency common) |
| **Query language** | SQL (standardized) | API-specific (MongoDB uses JSON-like queries) |
| **Joins** | Native (JOIN) | Often application-level or embedded documents |

SQL excels when you have clear relationships, need strong consistency, and your data fits neatly into tables. I still use it for financial data, user permissions, anything where referential integrity matters.

NoSQL shines when you need flexibility, horizontal scale, or when your data is document-shaped — nested, variable structure, closer to how you actually use it in your application code.

---

## MongoDB: Document-Oriented NoSQL

[MongoDB](https://www.mongodb.com/) is a **document database**. Data is stored as **BSON** (Binary JSON) documents inside **collections**. Instead of normalizing data across tables, you store related data together in a single document.

I like this model because it mirrors how I think about data in code. If I'm building a blog, a post isn't just a row in a `posts` table — it's an object with a title, content, author info, comments nested inside. MongoDB lets me store it that way.

### Example: A User with Posts

**SQL approach** — Multiple tables, joins:

```
users (id, name, email)
posts (id, user_id, title, content, created_at)
```

**MongoDB approach** — Embedded or referenced documents:

```javascript
{
  "_id": ObjectId("..."),
  "name": "Sergio",
  "email": "sergio@example.com",
  "posts": [
    { "title": "First post", "content": "...", "createdAt": ISODate("...") },
    { "title": "Second post", "content": "...", "createdAt": ISODate("...") }
  ]
}
```

You can embed when the relationship is one-to-few and you always read together. You reference (store `ObjectId`) when you have one-to-many or many-to-many and need to query independently.

---

## Practical Examples from the Talk

### 1. Inserting Documents

```javascript
db.users.insertOne({
  name: "Alice",
  email: "alice@example.com",
  createdAt: new Date()
});
```

No schema required. Just insert a document. If you later decide users should have a `lastLogin` field, add it to new documents. Old documents don't break — you handle it in your application logic.

### 2. Finding Documents

```javascript
// Find all
db.users.find();

// Find with filter
db.users.find({ name: "Alice" });

// Find one
db.users.findOne({ email: "alice@example.com" });
```

Queries feel like JavaScript. Coming from SQL's `SELECT * FROM users WHERE name = 'Alice'`, it's refreshing.

### 3. Updating Documents

```javascript
db.users.updateOne(
  { name: "Alice" },
  { $set: { lastLogin: new Date() } }
);
```

The `$set` operator updates specific fields without replacing the whole document. There are operators for incrementing, pushing to arrays, renaming fields — all the things you'd do in application logic.

### 4. Aggregation Pipeline

MongoDB's aggregation framework lets you transform and analyze data in stages. I use this for analytics, reporting, anything where a simple `find()` isn't enough:

```javascript
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$customerId", total: { $sum: "$amount" } } },
  { $sort: { total: -1 } }
]);
```

It's like SQL's `GROUP BY` and `ORDER BY`, but more composable. You build a pipeline of transformations.

---

## When to Use MongoDB (and When Not To)

**Good fit:**

- Content management, blogs, catalogs — anything document-shaped
- Real-time analytics, event logs — write-heavy, flexible schema
- Prototyping and rapid iteration — no migrations, just code
- Data with variable or nested structure — JSON from APIs, user-generated content

I've used MongoDB for API backends, CMS systems, and mobile app data stores. It feels natural when the domain is fluid.

**Less ideal:**

- Heavy relational reporting — lots of JOINs across normalized tables
- Strong multi-document transactions — MongoDB has them now, but they're newer and SQL is still better here
- Data that fits perfectly in normalized tables with strict integrity — why fight the model?

If I'm building a financial ledger or an ERP system, I still reach for PostgreSQL. Use the right tool for the job.

---

## Slides & Resources

- [View slides](https://slides.com/xergioalex/nosql-y-mongodb)
- [Source code (GitHub)](https://github.com/RockaLabs/mongoNodeExamples) — Node.js examples connecting to MongoDB
