---
title: 'NoSQL y MongoDB'
description: 'Cuando las tablas SQL no son suficientes — mi introducción a las bases de datos NoSQL, el modelo de documentos de MongoDB, y cuándo elegir flexibilidad sobre schemas rígidos.'
pubDate: '2016-12-13'
heroImage: '/images/blog/posts/nosql-and-mongodb/hero.webp'
heroLayout: 'banner'
tags: ["talks", "tech", "database"]
keywords: ["qué es NoSQL", "introducción a MongoDB", "NoSQL vs SQL cuándo usar cada uno", "bases de datos de documentos", "MongoDB para desarrolladores", "cuándo elegir NoSQL sobre SQL", "bases de datos flexibles sin schema"]
---

Pasé años trabajando con bases de datos relacionales — MySQL, PostgreSQL, las sospechosas de siempre. Tablas, foreign keys, JOINs. Es una base sólida, y para muchos problemas, es exactamente lo que necesitas. Pero cuando empecé a construir APIs que consumían JSON de servicios externos, o backends móviles donde el schema evolucionaba en cada sprint, SQL empezó a sentirse rígido. Me la pasaba escribiendo migraciones para agregar columnas, reestructurar tablas, normalizar datos que no querían ser normalizados.

Ahí fue cuando empecé a explorar NoSQL — específicamente MongoDB. Esta charla fue mi forma de compartir lo que aprendí: qué significa realmente NoSQL, cómo difiere de SQL, y cuándo tiene sentido cada enfoque. Quería responder las preguntas que yo tuve cuando arranqué: *¿Por qué abandonaría las tablas? ¿Qué gano? ¿Qué pierdo?*

---

## ¿Qué es NoSQL?

**NoSQL** significa "Not Only SQL" — un término amplio para bases de datos que no siguen el modelo relacional rígido. En lugar de tablas, filas y columnas, las bases de datos NoSQL usan estructuras diferentes: documentos (MongoDB, CouchDB), pares clave-valor (Redis, DynamoDB), grafos (Neo4j), o almacenes de columnas anchas (Cassandra).

El auge de NoSQL vino de la necesidad de manejar:

- **Escala** — Escalado horizontal, sharding y sistemas distribuidos
- **Flexibilidad** — Schemas que evolucionan rápido sin migraciones
- **Rendimiento** — Optimizado para patrones de acceso específicos (lecturas, escrituras, agregaciones)
- **Variedad** — Datos no estructurados o semi-estructurados (logs, eventos, JSON de APIs)

En mi experiencia, la flexibilidad del schema fue la característica matadora. Podía iterar en un producto, agregar campos a documentos, anidar datos relacionados — todo sin escribir scripts de `ALTER TABLE` ni coordinar migraciones entre ambientes.

---

## SQL vs NoSQL: Diferencias Clave

| Aspecto | SQL (Relacional) | NoSQL |
|---------|------------------|-------|
| **Modelo** | Tablas, filas, columnas | Documentos, clave-valor, grafos, etc. |
| **Schema** | Fijo, definido de antemano | Flexible, sin schema o schema opcional |
| **Escalabilidad** | Vertical (máquina más grande) | Horizontal (más máquinas) |
| **Transacciones** | ACID, consistencia fuerte | Varía (consistencia eventual es común) |
| **Lenguaje de consulta** | SQL (estandarizado) | Específico de la API (MongoDB usa consultas tipo JSON) |
| **Joins** | Nativos (JOIN) | A menudo a nivel de aplicación o documentos embebidos |

SQL brilla cuando tienes relaciones claras, necesitas consistencia fuerte, y tus datos encajan bien en tablas. Aún lo uso para datos financieros, permisos de usuario, cualquier cosa donde la integridad referencial importa.

NoSQL destaca cuando necesitas flexibilidad, escala horizontal, o cuando tus datos tienen forma de documento — anidados, estructura variable, más cercano a cómo realmente los usas en tu código de aplicación.

---

## MongoDB: NoSQL Orientado a Documentos

[MongoDB](https://www.mongodb.com/) es una **base de datos de documentos**. Los datos se almacenan como documentos **BSON** (Binary JSON) dentro de **colecciones**. En lugar de normalizar datos entre tablas, guardas datos relacionados juntos en un solo documento.

Me gusta este modelo porque refleja cómo pienso sobre los datos en código. Si estoy construyendo un blog, un post no es solo una fila en una tabla `posts` — es un objeto con un título, contenido, info del autor, comentarios anidados adentro. MongoDB me deja almacenarlo así.

### Ejemplo: Un Usuario con Posts

**Enfoque SQL** — Múltiples tablas, joins:

```
users (id, name, email)
posts (id, user_id, title, content, created_at)
```

**Enfoque MongoDB** — Documentos embebidos o referenciados:

```javascript
{
  "_id": ObjectId("..."),
  "name": "Sergio",
  "email": "sergio@example.com",
  "posts": [
    { "title": "Primer post", "content": "...", "createdAt": ISODate("...") },
    { "title": "Segundo post", "content": "...", "createdAt": ISODate("...") }
  ]
}
```

Puedes embeber cuando la relación es uno-a-pocos y siempre lees todo junto. Referencias (guardas `ObjectId`) cuando tienes uno-a-muchos o muchos-a-muchos y necesitas consultar de forma independiente.

---

## Ejemplos prácticos de la charla

### 1. Insertar Documentos

```javascript
db.users.insertOne({
  name: "Alice",
  email: "alice@example.com",
  createdAt: new Date()
});
```

No se requiere schema. Solo insertas un documento. Si luego decides que los usuarios deben tener un campo `lastLogin`, agrégalo a los nuevos documentos. Los documentos viejos no se rompen — lo manejas en tu lógica de aplicación.

### 2. Buscar Documentos

```javascript
// Buscar todos
db.users.find();

// Buscar con filtro
db.users.find({ name: "Alice" });

// Buscar uno
db.users.findOne({ email: "alice@example.com" });
```

Las consultas se sienten como JavaScript. Viniendo del `SELECT * FROM users WHERE name = 'Alice'` de SQL, es refrescante.

### 3. Actualizar Documentos

```javascript
db.users.updateOne(
  { name: "Alice" },
  { $set: { lastLogin: new Date() } }
);
```

El operador `$set` actualiza campos específicos sin reemplazar todo el documento. Hay operadores para incrementar, hacer push a arrays, renombrar campos — todas las cosas que harías en lógica de aplicación.

### 4. Pipeline de Agregación

El framework de agregación de MongoDB te permite transformar y analizar datos en etapas. Lo uso para analytics, reportes, cualquier cosa donde un simple `find()` no es suficiente:

```javascript
db.orders.aggregate([
  { $match: { status: "completed" } },
  { $group: { _id: "$customerId", total: { $sum: "$amount" } } },
  { $sort: { total: -1 } }
]);
```

Es como el `GROUP BY` y `ORDER BY` de SQL, pero más componible. Construyes un pipeline de transformaciones.

---

## Cuándo usar MongoDB (y cuándo no)

**Buen fit:**

- Gestión de contenido, blogs, catálogos — cualquier cosa con forma de documento
- Analytics en tiempo real, logs de eventos — mucha escritura, schema flexible
- Prototipado e iteración rápida — sin migraciones, solo código
- Datos con estructura variable o anidada — JSON de APIs, contenido generado por usuarios

He usado MongoDB para backends de APIs, sistemas CMS, y data stores de apps móviles. Se siente natural cuando el dominio es fluido.

**Menos ideal:**

- Reportería relacional pesada — muchos JOINs entre tablas normalizadas
- Transacciones multi-documento fuertes — MongoDB las tiene ahora, pero son más nuevas y SQL sigue siendo mejor aquí
- Datos que encajan perfectamente en tablas normalizadas con integridad estricta — ¿para qué luchar contra el modelo?

Si estoy construyendo un ledger financiero o un sistema ERP, aún agarro PostgreSQL. Usa la herramienta correcta para el trabajo.

---

## Slides y Referencia

- [Ver slides](https://slides.com/xergioalex/nosql-y-mongodb)
- [Código fuente (GitHub)](https://github.com/RockaLabs/mongoNodeExamples) — Ejemplos en Node.js conectándose a MongoDB
