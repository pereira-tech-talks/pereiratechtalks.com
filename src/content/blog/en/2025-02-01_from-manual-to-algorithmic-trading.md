---
title: "From Manual Trading to Algorithmic Trading"
description: "How I moved from manual MetaTrader 4 trading to migrating scripts, indicators, and expert advisors into MetaTrader 5 for stronger automation."
pubDate: "2025-02-01"
heroImage: "/images/blog/posts/from-manual-to-algorithmic-trading/hero.webp"
series: "trading-journey"
seriesOrder: 3
heroLayout: "banner"
tags: ["trading", "tech", "personal"]
keywords: ["algorithmic trading MQL5", "MetaTrader 4 to MetaTrader 5 migration", "Expert Advisor trading robot", "MQL5 automated trading", "trading automation discipline", "Profit Shield trading tool", "position sizing calculator MQL5"]
---

After spending a lot of time doing manual trading — reading structure, tracking Market Profile zones, and making execution decisions in real time — I realized something obvious:

My process was highly repetitive.

And repetitive processes are automation candidates.

If a rule can be defined clearly, a machine can execute it more consistently than I can when I am tired, stressed, or emotionally triggered.

---

## The Moment It Clicked

At the beginning, I was operating in **MetaTrader 4 (MT4)**.  
Then I discovered that MT4 has its own programming language: **MQL4**.

That opened a completely new path for me.

I was no longer thinking only as a trader, but also as a builder:

- What can I automate?
- What can be measured?
- What can be enforced as a rule?

---

## From MQL4 to MQL5: The Next Step

After building significant momentum in MQL4, I discovered **MetaTrader 5 (MT5)** and realized its automation ecosystem is much richer.

MT5 has its own language, **MQL5**. It is very similar to MQL4, but more advanced and capable when it comes to building robots, execution logic, and analysis tooling.

At this point, most serious algorithmic trading development is happening in MT5.

---

## My Migration Process: MT4 to MT5

The transition was not a reset. It was a migration of what I had already built:

- Scripts
- Indicators
- Expert Advisors

I have been porting those pieces from MQL4 into MQL5 to preserve the logic that works for me while building on a more modern and flexible base.

Today, I operate mainly in **MQL5**, while still maintaining compatibility with both versions because I continue to run parts of my process in MT4 and MT5.

My end direction is clear: eventually operate only in MT5 because it is the more complete environment for automation.

---

## The 3 Building Blocks of Automation (MT4 and MT5)

When you want to automate seriously, there are three core tool types (valid in both MT4 and MT5):

### 1) Scripts

Scripts are one-time execution programs.

They are great for repetitive actions like:

- Sending one or multiple orders quickly
- Monitoring specific conditions once
- Applying break-even logic to current positions
- Closing selected positions based on pre-defined criteria

They run once and finish.

### 2) Indicators

Indicators are visual tools that organize market data for analysis.

They do not place trades by default. They help you read context better:

- Structure
- Momentum
- Volatility behavior
- Zones and conditions for technical analysis

### 3) Expert Advisors (EAs)

Expert Advisors are persistent systems running in a loop.

They can monitor and execute logic continuously (24/7 if infrastructure supports it), making them ideal for:

- Rule enforcement
- Risk controls
- Semi-automated or fully automated execution frameworks

---

## The Tools I Have Built So Far

As part of my process, I have built different tools to improve my execution quality.

One of my favorite concepts is what I call the **Profit Shield**:

- Automatically moves positions to break-even under defined conditions
- Blocks new trades when predefined risk thresholds are already reached
- Reduces discretionary "just one more trade" behavior

I also built a **position sizing calculator** to compute lot size from risk constraints:

- Account risk %
- Stop loss distance
- Target structure

This helps me avoid random sizing and keep risk coherent across trades.

---

## Why This Matters More Than Speed

Algorithmic trading is often sold as "faster money."

That is not my perspective.

For me, automation is about:

- Execution discipline
- Risk consistency
- Emotional damage reduction
- Operational quality over time

A machine has no fear, no revenge impulse, no ego after a win, and no panic after a loss.  
That does not mean every automated strategy wins. But it means rule execution can be cleaner and more repeatable.

---

## Where I Am Heading

My direction is clear: keep evolving from manual discretionary execution toward a more systemized and eventually highly automated operation, with MT5 as my primary environment.

I do not see this as replacing human thinking completely. I see it as combining:

- Human strategic judgment
- Machine-level operational consistency

That combination is what I want to keep building, with increasing algorithmic depth in MQL5.

---

This closes the first trilogy of my trading journey:

1. Personal process and mindset  
2. Market Profile as structured context  
3. Automation as discipline and risk infrastructure

If you are walking a similar path, my biggest advice is simple: build your process first, then automate what is truly rule-based.
