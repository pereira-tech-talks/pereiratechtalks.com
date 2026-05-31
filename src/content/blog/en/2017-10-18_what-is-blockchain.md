---
title: "What is Blockchain and How Will It Radically Transform the Economy?"
description: "I gave this talk at Universidad de Caldas — tracing blockchain from the history of money to building decentralized apps with JavaScript."
pubDate: "2017-10-18"
heroImage: "/images/blog/posts/what-is-blockchain/hero.webp"
heroLayout: "banner"
tags: ["talks", "tech", "blockchain"]
keywords: ["blockchain explained history of money", "how blockchain transforms economy", "Web3.js blockchain apps", "decentralized trust explained", "blockchain Universidad de Caldas", "blockchain ICO 2017", "Bitcoin origin story blockchain"]
---

Blockchain was everywhere in 2017. Bitcoin had exploded, Ethereum was powering a wave of ICOs, and every tech conference had at least one talk about "decentralizing everything." The hype was real, but so was the confusion. Most people had heard of blockchain, but few understood how it actually worked or why it mattered beyond cryptocurrency speculation.

I wanted to cut through the noise. So when Universidad de Caldas invited me to give a talk, I decided to go deep: not just "what is blockchain," but "why does blockchain exist in the first place?" To answer that, I started with the history of money — how societies created systems of trust, why centralized institutions emerged, and what problems blockchain was designed to solve.

The audience was a mix of students, professors, and local developers. Many were skeptical (rightfully so — the ICO craze was out of control). I didn't want to sell them on blockchain. I wanted to help them understand it well enough to form their own opinions.

<figure>
  <img src="/images/blog/posts/what-is-blockchain/blockchain-1.webp" alt="Blockchain talk at Universidad de Caldas" loading="lazy" />
  <figcaption>Opening the blockchain talk at Universidad de Caldas in October 2017, tracing the history of money to Bitcoin.</figcaption>
</figure>

---

## The History of Money and Trust

I started the talk with a question: **What is money?** Most people think of money as coins or bills, but that's just one form. Money is fundamentally a **social construct** — a shared agreement that something has value.

For thousands of years, humans used barter, but that only works at small scales. You need a medium of exchange — something everyone agrees is valuable. Shells, salt, gold, silver — all served as money at different times.

Then came centralized institutions: banks, governments, central banks. They issued currency, maintained ledgers, and acted as trusted intermediaries. If you wanted to transfer money to someone, you went through a bank. The bank verified that you had the funds, updated the ledger, and credited the recipient. This system worked, but it required trust in a third party.

Blockchain is an attempt to solve the same problem without trusted intermediaries. Instead of trusting a bank to maintain the ledger, you trust a network of computers running a shared protocol. The ledger is public, transparent, and tamper-resistant. No single entity controls it.

That's the revolutionary idea: **trust through code, not institutions**.

---

## What is Blockchain?

At its core, blockchain is a distributed ledger — a database that's replicated across many nodes. Each node has a full copy of the ledger, and they all agree on the current state through a consensus mechanism.

Here's how it works:

1. **Transactions** are broadcast to the network (e.g., "Alice sends 1 BTC to Bob").
2. **Miners** (or validators) collect transactions into a block.
3. **Consensus** is reached through proof-of-work (Bitcoin) or proof-of-stake (Ethereum 2.0).
4. **The block is added** to the chain, and all nodes update their copy of the ledger.

The clever part is that once a block is added, it's extremely hard to change. Each block contains a cryptographic hash of the previous block, creating a chain. If you try to alter an old block, the hash changes, and the chain breaks. You'd need to re-mine every block after it, which is computationally infeasible for a well-established blockchain.

That's why blockchain is called "immutable" — not because you can't change it, but because changing it requires overwhelming control of the network.

---

## Beyond Cryptocurrency: Real Use Cases

Bitcoin was the first application of blockchain, but it's not the only one. I walked through several use cases that went beyond digital money:

### Smart Contracts (Ethereum)

Ethereum introduced the idea of programmable blockchain. You can write code (smart contracts) that runs on the blockchain, enabling decentralized applications (dApps). These contracts execute automatically when conditions are met — no middleman needed.

Example: decentralized lending (MakerDAO), decentralized exchanges (Uniswap), NFTs (digital ownership).

### Supply Chain Transparency

Blockchain can track goods from production to delivery. Walmart and IBM experimented with blockchain for food traceability — tracking a mango from farm to store in seconds instead of days.

### Digital Identity

In countries without robust identity systems, blockchain could provide verifiable, self-sovereign identity. You control your data, and you share it selectively with services that need it.

### Decentralized Finance (DeFi)

By 2017, DeFi was still in its infancy, but the vision was clear: rebuild the financial system on public blockchains. No banks, no brokers — just code and cryptography.

I was honest about the limitations: blockchain is slow, expensive, and energy-intensive (proof-of-work). It's not a solution to every problem. But for certain use cases — especially where trust is expensive or unavailable — it's transformative.

<figure>
  <img src="/images/blog/posts/what-is-blockchain/blockchain-2.webp" alt="Blockchain workshop at Universidad de Caldas — audience during the hands-on session" loading="lazy" />
  <figcaption>Students and developers engaged during the hands-on Web3.js segment of the workshop.</figcaption>
</figure>

---

## Building with Blockchain: JavaScript and Web3

The second half of the talk was practical. I showed how to build applications that interact with blockchain networks using JavaScript.

The key library at the time was **Web3.js**, which lets you connect to Ethereum nodes, read blockchain data, and send transactions. With Web3.js, you could build a frontend that reads smart contract data and displays it in a web app.

I walked through a simple example: deploying a smart contract to a test network, reading data from it, and calling a function to update the state. The audience was surprised at how straightforward it was — you didn't need to be a cryptography expert to get started.

I also emphasized the importance of understanding the trade-offs. Writing data to the blockchain costs gas (transaction fees), so you can't just throw data at it like a traditional database. You need to design carefully.

<figure>
  <img src="/images/blog/posts/what-is-blockchain/blockchain-3.webp" alt="Blockchain talk at Universidad de Caldas" loading="lazy" />
  <figcaption>The practical second half of the session — connecting to Ethereum and deploying smart contracts with Web3.js.</figcaption>
</figure>

<figure>
  <img src="/images/blog/posts/what-is-blockchain/blockchain-4.webp" alt="Blockchain workshop" loading="lazy" />
  <figcaption>Attendees following along during the live smart contract demo on a test network.</figcaption>
</figure>

---

## The Big Questions

The Q&A was intense. People wanted to know:

**Is blockchain overhyped?** Yes and no. The technology is real, but the hype cycle was out of control in 2017. Many ICOs were scams, and most projects didn't need blockchain. But underneath the hype, there were real innovations.

**Will blockchain replace banks?** Not entirely. Banks provide services beyond payments (lending, custody, financial advice). But blockchain could disintermediate certain functions, especially cross-border payments and remittances.

**Is blockchain secure?** The blockchain itself is secure (assuming the network is decentralized and the consensus mechanism is robust). But the applications built on top can have bugs. Smart contract vulnerabilities have led to millions in losses.

**Should I invest in cryptocurrency?** I'm not a financial advisor, but I encouraged people to learn the technology first. Understand what you're investing in. Don't buy something just because the price is going up.

---

## Reflections

Seven years later, blockchain has matured. Bitcoin is still here. Ethereum transitioned to proof-of-stake. DeFi grew into a multi-billion-dollar ecosystem. NFTs exploded (and then crashed). Governments are exploring central bank digital currencies (CBDCs).

But the fundamental question remains: **Where does blockchain add real value?** The answer isn't "everywhere." It's specific: decentralized finance, censorship-resistant publishing, global payments, digital ownership, and coordination without trusted intermediaries.

For me, blockchain is interesting not because it's a get-rich-quick scheme, but because it's a new way to organize systems. It asks: what if we didn't need to trust institutions? What if we could build systems that were transparent, verifiable, and resilient?

Those questions still matter.

If you're curious about blockchain, start by understanding the fundamentals: how cryptographic hashing works, how consensus mechanisms work, and why decentralization is both powerful and limiting. Then build something small. Deploy a smart contract, interact with a blockchain, and see how it feels.

The best way to understand blockchain is to use it.

---

## Slides & Reference

- [View slides](https://slides.com/xergioalex/what-is-blockchain)
- [Pereira Tech Talks blog post](https://www.pereiratechtalks.org/que-es-el-blockchain-y-como-transformara-radicalmente-la-economia) — event recap (Universidad de Caldas)
- [Article: What is Blockchain and How Is It Radically Transforming the Economy and Industry?](/blog/blockchain-economy-industry/) — in-depth article I wrote after this talk
