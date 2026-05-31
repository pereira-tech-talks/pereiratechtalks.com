---
title: 'Introducción a Blockchain y Ethereum'
description: 'Del blockchain de Bitcoin a los smart contracts de Ethereum — desmitificando crypto para la comunidad de Pereira JS con un demo en vivo de Solidity.'
pubDate: '2017-10-18'
heroImage: '/images/blog/posts/blockchain-ethereum/pereira-js-meetup-hero.webp'
heroLayout: 'banner'
tags: ["talks", "tech", "blockchain"]
keywords: ["introducción a Ethereum", "qué son los smart contracts", "Solidity desde cero", "blockchain vs Ethereum diferencias", "cómo funcionan los smart contracts", "demo Solidity en vivo", "Ethereum para desarrolladores"]
---

Las criptomonedas estaban en todas partes en 2017. Bitcoin alcanzó máximos históricos, Ethereum estaba en los titulares, y todo el mundo hablaba de blockchain. Pero cuando le preguntaba a la gente *cómo* funcionaba, recibía respuestas vagas. "Es descentralizado." "Es un ledger." "Es el futuro." Cierto, pero vago.

Quise profundizar. Pasé semanas leyendo whitepapers, corriendo nodos, escribiendo smart contracts. Luego di esta charla en PereiraJs para compartir lo que aprendí: **¿Cómo funciona realmente Bitcoin?** ¿Qué es blockchain más allá de las palabras de moda? Y qué hace diferente a Ethereum — ¿por qué puedes correr código en un blockchain?

El objetivo fue simple: hacer la tecnología accesible. Sin hype, sin especulación sobre precios — solo los fundamentos técnicos, explicados claramente, con un demo en vivo.

---

## Lo que cubrí

La charla tuvo cuatro partes:

1. **Bitcoin** — Qué es, cómo funcionan las transacciones, proof-of-work, y el protocolo que inició todo
2. **Blockchain** — La estructura de datos subyacente y el mecanismo de consenso
3. **Ethereum** — Un blockchain programable para smart contracts y apps descentralizadas
4. **Solidity** — Una intro breve y demo en vivo escribiendo y desplegando un smart contract

Empecé con Bitcoin porque ahí es donde empieza la curiosidad de la mayoría. Una vez entiendes cómo funciona Bitcoin, blockchain tiene sentido. Y una vez entiendes blockchain, la propuesta de valor de Ethereum — "¿Y si el blockchain pudiera correr programas?" — hace perfecto sentido.

<figure>
  <img src="/images/blog/posts/blockchain-ethereum/pereira-js-meetup-audience.webp" alt="Meetup de PereiraJs — blockchain y criptomonedas" loading="lazy" />
  <figcaption>La audiencia de PereiraJs reunida para la sesión de blockchain y Ethereum en octubre de 2017.</figcaption>
</figure>

---

## Bitcoin: Efectivo Digital, Sin Autoridad Central

Bitcoin es **efectivo electrónico peer-to-peer**. Sin bancos, sin intermediarios. Eres dueño de tus monedas si controlas las llaves privadas.

Ideas clave que cubrí:

- **Transacciones** — Firmadas con tu llave privada, verificadas con tu llave pública
- **Bloques** — Lotes de transacciones, enlazados en una cadena
- **Proof-of-work** — Los mineros compiten por resolver un puzzle difícil; el ganador agrega el siguiente bloque
- **Consenso** — La cadena más larga es la válida (la que tiene más trabajo)

La elegancia está en los incentivos. Los mineros reciben recompensas (block reward + fees), así que están motivados a seguir las reglas. Atacar la red requiere más poder computacional que el resto de la red combinado — económicamente irracional.

Expliqué esto sin código, solo diagramas y analogías. La audiencia lo captó: Bitcoin es un ledger distribuido donde la confianza viene de las matemáticas y los incentivos, no de instituciones.

---

## Blockchain: La Estructura de Datos

Un blockchain es solo una **lista enlazada de bloques**, donde cada bloque contiene:

- Una lista de transacciones
- Una marca de tiempo
- Una referencia (hash) al bloque anterior

Esa referencia es lo que lo hace una "cadena." Si cambias cualquier cosa en un bloque viejo, su hash cambia, rompiendo el enlace. Tendrías que recalcular todos los bloques subsiguientes — proof-of-work hace eso prohibitivamente caro.

Blockchain no es magia. Es una estructura de datos optimizada para inmutabilidad y consenso descentralizado. Bitcoin la popularizó, pero el concepto aplica en cualquier lugar donde necesites un log a prueba de manipulación.

---

## Ethereum: Dinero Programable

El lenguaje de scripting de Bitcoin es intencionalmente limitado. Puedes hacer condiciones básicas (multisig, timelocks), pero no puedes construir lógica compleja.

Ethereum tomó un enfoque diferente: **¿Y si el blockchain fuera una computadora?**

- **Smart contracts** — Programas que corren en el blockchain, ejecutados por cada nodo
- **Turing-completo** — Puedes escribir cualquier lógica (loops, condicionales, storage)
- **Gas** — Pagas por computación para prevenir spam y loops infinitos

Expliqué Ethereum como "Bitcoin, pero con una máquina virtual." En lugar de solo mover dinero, despliegas código. Ese código puede guardar fondos, hacer cumplir reglas, interactuar con otros contratos — todo sin confianza, con las mismas garantías que las transacciones de Bitcoin.

Casos de uso: finanzas descentralizadas (lending, trading), NFTs, DAOs (organizaciones autónomas descentralizadas), sistemas de identidad. Ethereum abrió la puerta a la confianza programable.

---

## Solidity: Escribiendo Smart Contracts

Para el demo, escribí un smart contract simple en **Solidity** — el lenguaje de contratos de Ethereum, inspirado en JavaScript y C++.

El contrato fue un ejemplo básico de "greeting":

```solidity
pragma solidity ^0.4.18;

contract Greeter {
    string public greeting;

    function Greeter(string _greeting) public {
        greeting = _greeting;
    }

    function setGreeting(string _greeting) public {
        greeting = _greeting;
    }

    function greet() public view returns (string) {
        return greeting;
    }
}
```

Lo desplegué en una red de prueba (Ropsten, creo) y llamé las funciones desde la consola. La audiencia vio la transacción ser minada, el cambio de estado, y el nuevo greeting retornado.

Es un ejemplo de juguete, pero demuestra la idea central: código corriendo en una red descentralizada, con la misma inmutabilidad y transparencia que las transacciones de Bitcoin.

---

## Por qué esto importa

Blockchain no es solo sobre dinero. Es sobre **coordinación sin control central**. Los smart contracts son **programas que no pueden ser detenidos o censurados** (mientras la red sea descentralizada).

Soy cauteloso con el hype — la mayoría de proyectos "blockchain" no necesitan un blockchain. Pero para problemas específicos (gobernanza transparente, escrow sin confianza, resistencia a la censura), la tecnología es genuinamente poderosa.

Esta charla fue mi forma de cortar el ruido y enfocarme en los fundamentos. Si tienes curiosidad, lee el whitepaper de Bitcoin (9 páginas, totalmente legible). Si quieres experimentar, corre un nodo local de Ethereum y escribe un contrato. La mejor forma de aprender es construir.

---

## Slides y Referencia

- [Ver slides](https://slides.com/xergioalex/blockchain-ethereum)
- [Post del blog de Pereira Tech Talks](https://www.pereiratechtalks.org/ionic-angular-blockchain-bitcoin-ethereum-y-solidity-3) — resumen del evento
