---
title: '¿Qué es el blockchain y cómo transformará radicalmente la economía?'
description: 'Di esta charla en la Universidad de Caldas — trazando blockchain desde la historia del dinero hasta construir aplicaciones descentralizadas con JavaScript.'
pubDate: '2017-10-18'
heroImage: '/images/blog/posts/what-is-blockchain/hero.webp'
heroLayout: 'banner'
tags: ["talks", "tech", "blockchain"]
keywords: ["qué es blockchain", "cómo funciona blockchain", "blockchain y aplicaciones descentralizadas", "historia del dinero y blockchain", "blockchain para desarrolladores JavaScript", "tecnología blockchain explicada", "introducción a blockchain y criptomonedas"]
---

Blockchain estaba en todas partes en 2017. Bitcoin había explotado, Ethereum estaba impulsando una ola de ICOs, y cada conferencia tech tenía al menos una charla sobre "descentralizar todo". El hype era real, pero también lo era la confusión. La mayoría de la gente había escuchado de blockchain, pero pocos entendían cómo funcionaba realmente o por qué importaba más allá de la especulación con criptomonedas.

Quería cortar a través del ruido. Así que cuando la Universidad de Caldas me invitó a dar una charla, decidí ir profundo: no solo "qué es blockchain," sino "¿por qué existe blockchain en primer lugar?" Para responder eso, empecé con la historia del dinero — cómo las sociedades crearon sistemas de confianza, por qué emergieron instituciones centralizadas, y qué problemas blockchain fue diseñado para resolver.

La audiencia era una mezcla de estudiantes, profesores y desarrolladores locales. Muchos eran escépticos (con razón — la locura de los ICOs estaba fuera de control). No quería venderles blockchain. Quería ayudarles a entenderlo lo suficientemente bien como para formar sus propias opiniones.

<figure>
  <img src="/images/blog/posts/what-is-blockchain/blockchain-1.webp" alt="Charla de blockchain en la Universidad de Caldas" loading="lazy" />
  <figcaption>Abriendo la charla de blockchain en la Universidad de Caldas en octubre de 2017, trazando la historia del dinero hasta Bitcoin.</figcaption>
</figure>

---

## La historia del dinero y la confianza

Empecé la charla con una pregunta: **¿Qué es el dinero?** La mayoría de la gente piensa en el dinero como monedas o billetes, pero eso es solo una forma. El dinero es fundamentalmente un **constructo social** — un acuerdo compartido de que algo tiene valor.

Por miles de años, los humanos usaron el trueque, pero eso solo funciona a pequeña escala. Necesitas un medio de intercambio — algo con lo que todos acuerdan que tiene valor. Conchas, sal, oro, plata — todos sirvieron como dinero en diferentes momentos.

Luego vinieron las instituciones centralizadas: bancos, gobiernos, bancos centrales. Emitieron moneda, mantuvieron libros contables, y actuaron como intermediarios de confianza. Si querías transferir dinero a alguien, ibas a través de un banco. El banco verificaba que tenías los fondos, actualizaba el libro contable, y acreditaba al receptor. Este sistema funcionaba, pero requería confiar en un tercero.

Blockchain es un intento de resolver el mismo problema sin intermediarios de confianza. En lugar de confiar en un banco para mantener el libro contable, confías en una red de computadoras ejecutando un protocolo compartido. El libro contable es público, transparente y resistente a la manipulación. Ninguna entidad única lo controla.

Esa es la idea revolucionaria: **confianza a través del código, no instituciones**.

---

## ¿Qué es Blockchain?

En su núcleo, blockchain es un libro contable distribuido — una base de datos que se replica a través de muchos nodos. Cada nodo tiene una copia completa del libro contable, y todos acuerdan el estado actual a través de un mecanismo de consenso.

Así es como funciona:

1. **Las transacciones** se transmiten a la red (ej., "Alice envía 1 BTC a Bob").
2. **Los mineros** (o validadores) recolectan transacciones en un bloque.
3. **Se alcanza consenso** a través de prueba de trabajo (Bitcoin) o prueba de participación (Ethereum 2.0).
4. **El bloque se agrega** a la cadena, y todos los nodos actualizan su copia del libro contable.

La parte inteligente es que una vez que se agrega un bloque, es extremadamente difícil cambiarlo. Cada bloque contiene un hash criptográfico del bloque anterior, creando una cadena. Si intentas alterar un bloque viejo, el hash cambia, y la cadena se rompe. Necesitarías re-minar cada bloque después de él, lo cual es computacionalmente inviable para un blockchain bien establecido.

Por eso se dice que blockchain es "inmutable" — no porque no puedas cambiarlo, sino porque cambiarlo requiere control abrumador de la red.

---

## Más allá de las criptomonedas: casos de uso reales

Bitcoin fue la primera aplicación de blockchain, pero no es la única. Mostré varios casos de uso que iban más allá del dinero digital:

### Contratos inteligentes (Ethereum)

Ethereum introdujo la idea de blockchain programable. Puedes escribir código (contratos inteligentes) que corre en el blockchain, habilitando aplicaciones descentralizadas (dApps). Estos contratos se ejecutan automáticamente cuando se cumplen condiciones — no se necesita intermediario.

Ejemplo: préstamos descentralizados (MakerDAO), intercambios descentralizados (Uniswap), NFTs (propiedad digital).

### Transparencia en la Cadena de Suministro

Blockchain puede rastrear productos desde la producción hasta la entrega. Walmart e IBM experimentaron con blockchain para la trazabilidad de alimentos — rastreando un mango desde la finca hasta la tienda en segundos en lugar de días.

### Identidad digital

En países sin sistemas de identidad robustos, blockchain podría proporcionar identidad verificable y auto-soberana. Tú controlas tus datos, y los compartes selectivamente con servicios que los necesitan.

### Finanzas descentralizadas (DeFi)

Para 2017, DeFi todavía estaba en su infancia, pero la visión era clara: reconstruir el sistema financiero en blockchains públicos. Sin bancos, sin corredores — solo código y criptografía.

Fui honesto sobre las limitaciones: blockchain es lento, costoso, y consume mucha energía (prueba de trabajo). No es una solución para todos los problemas. Pero para ciertos casos de uso — especialmente donde la confianza es costosa o no está disponible — es transformador.

<figure>
  <img src="/images/blog/posts/what-is-blockchain/blockchain-2.webp" alt="Taller de blockchain en la Universidad de Caldas — audiencia durante la sesión práctica" loading="lazy" />
  <figcaption>Estudiantes y desarrolladores atentos durante el segmento práctico de Web3.js en el taller.</figcaption>
</figure>

---

## Construyendo con Blockchain: JavaScript y Web3

La segunda mitad de la charla fue práctica. Mostré cómo construir aplicaciones que interactúan con redes blockchain usando JavaScript.

La biblioteca clave en ese momento era **Web3.js**, que te permite conectarte a nodos de Ethereum, leer datos del blockchain, y enviar transacciones. Con Web3.js, podías construir un frontend que lee datos de contratos inteligentes y los muestra en una aplicación web.

Mostré un ejemplo simple: desplegar un contrato inteligente a una red de prueba, leer datos de él, y llamar una función para actualizar el estado. La audiencia se sorprendió de lo sencillo que era — no necesitabas ser un experto en criptografía para empezar.

También enfaticé la importancia de entender los trade-offs. Escribir datos al blockchain cuesta gas (tarifas de transacción), así que no puedes simplemente arrojar datos a él como una base de datos tradicional. Necesitas diseñar con cuidado.

<figure>
  <img src="/images/blog/posts/what-is-blockchain/blockchain-3.webp" alt="Charla de blockchain en la Universidad de Caldas" loading="lazy" />
  <figcaption>La segunda mitad práctica de la sesión — conectándonos a Ethereum y desplegando smart contracts con Web3.js.</figcaption>
</figure>

<figure>
  <img src="/images/blog/posts/what-is-blockchain/blockchain-4.webp" alt="Taller de blockchain" loading="lazy" />
  <figcaption>Asistentes siguiendo el demo en vivo del contrato inteligente en una red de prueba.</figcaption>
</figure>

---

## Las grandes preguntas

El Q&A fue intenso. La gente quería saber:

**¿Blockchain está sobrevalorado?** Sí y no. La tecnología es real, pero el ciclo de hype estaba fuera de control en 2017. Muchos ICOs eran estafas, y la mayoría de proyectos no necesitaban blockchain. Pero debajo del hype, había innovaciones reales.

**¿Blockchain reemplazará a los bancos?** No completamente. Los bancos proveen servicios más allá de pagos (préstamos, custodia, asesoría financiera). Pero blockchain podría desintermediar ciertas funciones, especialmente pagos transfronterizos y remesas.

**¿Blockchain es seguro?** El blockchain en sí es seguro (asumiendo que la red está descentralizada y el mecanismo de consenso es robusto). Pero las aplicaciones construidas encima pueden tener bugs. Las vulnerabilidades en contratos inteligentes han llevado a millones en pérdidas.

**¿Debería invertir en criptomonedas?** No soy asesor financiero, pero animé a la gente a aprender la tecnología primero. Entiende en qué estás invirtiendo. No compres algo solo porque el precio está subiendo.

---

## Reflexiones

Siete años después, blockchain ha madurado. Bitcoin todavía está aquí. Ethereum hizo la transición a prueba de participación. DeFi creció a un ecosistema de miles de millones de dólares. Los NFTs explotaron (y luego colapsaron). Los gobiernos están explorando monedas digitales de bancos centrales (CBDCs).

Pero la pregunta fundamental permanece: **¿Dónde agrega blockchain valor real?** La respuesta no es "en todas partes". Es específica: finanzas descentralizadas, publicación resistente a la censura, pagos globales, propiedad digital, y coordinación sin intermediarios de confianza.

Para mí, blockchain es interesante no porque sea un esquema para hacerse rico rápido, sino porque es una nueva forma de organizar sistemas. Pregunta: ¿qué tal si no necesitáramos confiar en instituciones? ¿Qué tal si pudiéramos construir sistemas que fueran transparentes, verificables y resilientes?

Esas preguntas todavía importan.

Si tienes curiosidad sobre blockchain, empieza entendiendo los fundamentos: cómo funciona el hashing criptográfico, cómo funcionan los mecanismos de consenso, y por qué la descentralización es tanto poderosa como limitante. Luego construye algo pequeño. Despliega un contrato inteligente, interactúa con un blockchain, y ve cómo se siente.

La mejor forma de entender blockchain es usarlo.

---

## Slides y Referencia

- [Ver slides](https://slides.com/xergioalex/what-is-blockchain)
- [Post del blog Pereira Tech Talks](https://www.pereiratechtalks.org/que-es-el-blockchain-y-como-transformara-radicalmente-la-economia) — recap del evento (Universidad de Caldas)
- [Artículo: ¿Qué es el Blockchain y Cómo Está Transformando Radicalmente la Economía y la Industria?](/es/blog/blockchain-economy-industry/) — artículo en profundidad que escribí después de esta charla
