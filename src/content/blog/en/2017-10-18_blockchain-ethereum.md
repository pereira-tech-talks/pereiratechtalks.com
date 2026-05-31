---
title: "Introduction to Blockchain and Ethereum"
description: "From Bitcoin's blockchain to Ethereum's smart contracts — demystifying crypto for the Pereira JS community with a live Solidity demo."
pubDate: "2017-10-18"
heroImage: "/images/blog/posts/blockchain-ethereum/pereira-js-meetup-hero.webp"
heroLayout: "banner"
tags: ["talks", "tech", "blockchain"]
keywords: ["Ethereum smart contracts introduction", "blockchain vs Bitcoin", "Solidity smart contract demo", "how Ethereum works", "blockchain explained developers", "Bitcoin blockchain comparison", "decentralized applications Ethereum"]
---

Cryptocurrencies were everywhere in 2017. Bitcoin hit all-time highs, Ethereum was making headlines, and everyone was talking about blockchain. But when I asked people *how* it worked, I got hand-waving. "It's decentralized." "It's a ledger." "It's the future." True, but vague.

I wanted to dig deeper. I spent weeks reading whitepapers, running nodes, writing smart contracts. Then I gave this talk at PereiraJs to share what I learned: **How does Bitcoin actually work?** What is blockchain beyond the buzzwords? And what makes Ethereum different — why can you run code on a blockchain?

The goal was simple: make the technology accessible. No hype, no speculation on prices — just the technical foundations, explained clearly, with a live demo.

---

## What I Covered

The talk had four parts:

1. **Bitcoin** — What it is, how transactions work, proof-of-work, and the protocol that started it all
2. **Blockchain** — The underlying data structure and consensus mechanism
3. **Ethereum** — A programmable blockchain for smart contracts and decentralized apps
4. **Solidity** — A brief intro and live demo of writing and deploying a smart contract

I started with Bitcoin because that's where most people's curiosity begins. Once you understand how Bitcoin works, blockchain clicks. And once you understand blockchain, Ethereum's value proposition — "What if the blockchain could run programs?" — makes perfect sense.

<figure>
  <img src="/images/blog/posts/blockchain-ethereum/pereira-js-meetup-audience.webp" alt="PereiraJs meetup — blockchain and cryptocurrencies" loading="lazy" />
  <figcaption>The PereiraJs audience packed in for the blockchain and Ethereum session in October 2017.</figcaption>
</figure>

---

## Bitcoin: Digital Cash, No Central Authority

Bitcoin is **peer-to-peer electronic cash**. No banks, no intermediaries. You own your coins if you control the private keys.

Key ideas I covered:

- **Transactions** — Signed with your private key, verified with your public key
- **Blocks** — Batches of transactions, linked together in a chain
- **Proof-of-work** — Miners compete to solve a hard puzzle; the winner adds the next block
- **Consensus** — The longest chain is the valid one (the one with the most work)

The elegance is in the incentives. Miners get rewarded (block reward + fees), so they're motivated to follow the rules. Attacking the network requires more computing power than the rest of the network combined — economically irrational.

I explained this without code, just diagrams and analogies. The audience got it: Bitcoin is a distributed ledger where trust comes from math and incentives, not institutions.

---

## Blockchain: The Data Structure

A blockchain is just a **linked list of blocks**, where each block contains:

- A list of transactions
- A timestamp
- A reference (hash) to the previous block

That reference is what makes it a "chain." If you change anything in an old block, its hash changes, breaking the link. You'd have to recalculate every subsequent block — proof-of-work makes that prohibitively expensive.

Blockchain isn't magic. It's a data structure optimized for immutability and decentralized consensus. Bitcoin popularized it, but the concept applies anywhere you need a tamper-evident log.

---

## Ethereum: Programmable Money

Bitcoin's scripting language is intentionally limited. You can do basic conditions (multisig, timelocks), but you can't build complex logic.

Ethereum took a different approach: **What if the blockchain was a computer?**

- **Smart contracts** — Programs that run on the blockchain, executed by every node
- **Turing-complete** — You can write any logic (loops, conditionals, storage)
- **Gas** — You pay for computation to prevent spam and infinite loops

I explained Ethereum as "Bitcoin, but with a virtual machine." Instead of just moving money around, you deploy code. That code can hold funds, enforce rules, interact with other contracts — all trustlessly, with the same guarantees as Bitcoin transactions.

Use cases: decentralized finance (lending, trading), NFTs, DAOs (decentralized autonomous organizations), identity systems. Ethereum opened the door to programmable trust.

---

## Solidity: Writing Smart Contracts

For the demo, I wrote a simple smart contract in **Solidity** — Ethereum's contract language, inspired by JavaScript and C++.

The contract was a basic "greeting" example:

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

I deployed it to a test network (Ropsten, I think) and called the functions from the console. The audience saw the transaction get mined, the state change, and the new greeting returned.

It's a toy example, but it demonstrates the core idea: code running on a decentralized network, with the same immutability and transparency as Bitcoin transactions.

---

## Why This Matters

Blockchain isn't just about money. It's about **coordination without central control**. Smart contracts are **programs that can't be stopped or censored** (as long as the network is decentralized).

I'm cautious about the hype — most "blockchain" projects don't need a blockchain. But for specific problems (transparent governance, trustless escrow, censorship resistance), the technology is genuinely powerful.

This talk was my way of cutting through the noise and focusing on the fundamentals. If you're curious, read the Bitcoin whitepaper (9 pages, totally readable). If you want to experiment, spin up a local Ethereum node and write a contract. The best way to learn is to build.

---

## Slides & Reference

- [View slides](https://slides.com/xergioalex/blockchain-ethereum)
- [Pereira Tech Talks blog post](https://www.pereiratechtalks.org/ionic-angular-blockchain-bitcoin-ethereum-y-solidity-3) — event recap
