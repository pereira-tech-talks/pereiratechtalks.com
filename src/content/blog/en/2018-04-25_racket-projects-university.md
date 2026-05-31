---
title: "My First Steps in Programming: DrScheme, Recursion, and a Function Plotter"
description: "Learning to code with DrScheme (now DrRacket): prefix notation, recursion, and a function plotter with derivatives in my first university course."
pubDate: "2018-04-25"
heroImage: "/images/blog/posts/racket-projects-university/hero.webp"
heroLayout: "side-by-side"
tags: ["portfolio", "tech", "university"]
keywords: ["DrRacket Scheme university programming", "functional programming beginner", "recursion Racket tutorial", "DrScheme function plotter", "learn programming Scheme", "functional programming university course", "Racket derivatives function plotter"]
---

Some people learn to program by printing "Hello World" in Python or dragging blocks in Scratch. I learned by staring at a sea of parentheses in a language I'd never heard of, wondering if my professor was playing an elaborate prank on the entire class.

It was 2009. I had just started my first semester of Systems Engineering at the university. Programming 1. The course that would either hook me on this whole software thing or send me running to business school. I walked into that classroom expecting to learn Java, or maybe C — something that looked like what "real programmers" used on TV. Instead, the professor opened something called **DrScheme** and typed this on the projector:

```scheme
(+ 1 2)
```

That was it. That was programming. Three characters, two parentheses, and a plus sign that — for reasons I couldn't understand — was *before* the numbers instead of between them. Welcome to functional programming.

---

## The parentheses that changed everything

DrScheme — which would later be renamed [DrRacket](https://racket-lang.org/) — is an IDE for the Scheme programming language, part of the Lisp family. If you've never encountered a Lisp dialect, imagine a world where every operation is wrapped in parentheses and the operator always comes first. That's **prefix notation**.

Instead of writing `2 + 3`, you write `(+ 2 3)`. Instead of `(2 + 3) * 4`, you write `(* (+ 2 3) 4)`. It sounds simple enough, but when you're a first-semester student who has never written a line of code, it feels like reading text backwards.

```scheme
;; "Normal" math: ((5 + 3) * 2) - 1
;; In Scheme:
(- (* (+ 5 3) 2) 1)
;; Result: 15
```

The first few weeks were pure confusion. Every instinct screamed to put the operator between the operands. Every exercise came back with mismatched parentheses or arguments in the wrong order. My classmates and I would stare at our screens, trying to mentally parse nested expressions that seemed to go five levels deep.

But something funny happens when you're forced to think differently from the start. You don't form bad habits. You don't bring assumptions from other languages. Your brain just... adapts. And slowly, the parentheses started making sense. There was an elegance to it — everything was a function, everything was consistent, and the parentheses told you *exactly* where each expression began and ended.

---

## When recursion blew my mind

Here's the thing about Scheme: there are no `for` loops. No `while` loops. No `do...until`. If you want to repeat something, you use **recursion** — a function that calls itself.

```scheme
;; Factorial using recursion
(define (factorial n)
  (if (<= n 1)
      1
      (* n (factorial (- n 1)))))

(factorial 5) ;; → 120
```

The concept was simple enough to explain: a function that keeps calling itself with a smaller problem until it hits a base case. Understanding it intellectually was one thing. *Feeling* it — tracing through the execution step by step — was something else entirely.

Our professor made us do **desk testing on paper**. You'd take a recursive function, write out each call, track the parameters, watch the stack grow as the function called itself again and again, and then watch it unwind as each call finally returned its result. It was like watching dominoes fall in reverse.

```
factorial(5)
  → 5 * factorial(4)
    → 4 * factorial(3)
      → 3 * factorial(2)
        → 2 * factorial(1)
          → 1           ← base case!
        ← 2 * 1 = 2
      ← 3 * 2 = 6
    ← 4 * 6 = 24
  ← 5 * 24 = 120
```

I remember sitting at my desk at home, notebook full of arrows and numbers, tracing through programs that involved **backtracking** — functions that explored multiple paths, backed up when they hit dead ends, and tried again. Watching a program essentially "think" through a problem by calling itself was mind-blowing. My notebook looked like the work of a conspiracy theorist connecting red strings on a wall. But it worked, and somewhere in that mess of arrows, the concept clicked.

That was the moment I realized programming wasn't just about telling a computer what to do. It was about thinking. About breaking a problem into pieces so small that the solution becomes obvious.

---

## From strings to chess: building everything

The course moved fast. Once we had recursion down, we started building real things. The [repository](https://github.com/xergioalex/RacketProjects) I put together captures the full arc — from simple exercises to surprisingly ambitious projects:

**String and vector operations** — palindrome detection, vowel counting, string reversal. The kind of fundamental work that teaches you to think about data character by character.

**Number theory** — prime number generators, Fibonacci sequences, factorial calculators. All recursive, of course. Everything is recursive in Scheme.

**Calendar systems** — we implemented Gregorian, Julian, and even *Roman* calendar conversions. Massive files (60K+ characters of Scheme code for a single calendar system) that taught us about complex logic and edge cases.

**Mathematical series** — Fibonacci, arithmetic progressions. More recursion, more pattern recognition.

**Data structures** — a contact agenda system, managing structured data with lists and vectors in a language that makes you earn every data manipulation.

And then came the projects that made us feel like actual software developers:

**A Chess game** (`ajedrez.scm`). A **Snake game** (`culebrita.scm`). A **Hangman game**. A **Paint application**. A **fractal generator**. A **text editor**.

Each project pushed us further. Each one made us more comfortable with the idea that functional programming wasn't a limitation — it was a lens. A different way of seeing problems.

---

## The crown jewel: a function plotter with derivatives

For the final project, my classmate Alejandro Pinto and I decided to aim high. We wanted to build something that combined everything we'd learned — parsing, mathematics, graphics, recursion — into a single application.

We built a **mathematical function plotter with symbolic differentiation**.

You could type a mathematical function, and the program would:
1. **Parse** the input string into a polynomial representation
2. **Validate** the polynomial structure
3. **Graph** the function on an X-Y coordinate plane
4. **Compute the derivative** symbolically — not numerically, but actually applying differentiation rules
5. **Graph the derivative** alongside the original function

<figure>
  <img src="/images/blog/posts/racket-projects-university/hero.gif" alt="Function Plotter and Integrator" loading="lazy" />
  <figcaption>The function plotter in action — parsing a polynomial, drawing it on a coordinate plane, and computing its symbolic derivative.</figcaption>
</figure>

The main file — `integrador y derivador.scm` — was a massive amount of Scheme code for such a concise language. We built a modular architecture before we even knew what "modular architecture" meant: a graphing engine (`graficador.scm`), an integrator (`integrador_final.scm`), a number parser (`convertir_a_numero.scm`), a polynomial validator (`verificar polinomio.scm`), and a coefficient/exponent handler.

Building a graphing engine from scratch in DrScheme meant calculating pixel positions manually, mapping mathematical coordinates to screen coordinates, drawing axes, scaling the view — all in a language with no mutable state by default. Every pixel was the result of a pure function.

The derivative computation was the part that made me proudest. We implemented the basic differentiation rules — power rule, constant rule, sum rule — as recursive pattern matching on the polynomial structure. Feed in `3x² + 2x + 1`, get back `6x + 2`. All from first principles, in a functional language, as first-semester students.

Was the code elegant? Absolutely not. Was it well-structured by professional standards? Not even close. Did it work? **Yes.** And there's something beautiful about that — learning to program less than a year ago and building something that does calculus.

---

## Looking back

It's been years since I wrote my last line of Scheme. I've since worked with Python, JavaScript, TypeScript, Go, and more languages than I can count. I've built production systems, designed architectures, and debugged distributed applications.

But DrScheme taught me things that no other language could have taught in the same way. It taught me to think recursively — to see every problem as a smaller version of itself. It taught me that syntax is just clothing; the ideas underneath are what matter. It taught me that constraints breed creativity — when you can't use a `for` loop, you find other ways, and those other ways often turn out to be more powerful.

Starting with a "weird" language was the best thing that could have happened to me. When everything is unfamiliar, you can't rely on intuition — you have to actually *understand*. And that understanding becomes the foundation for everything that comes after.

If you're curious about what a first-semester student's journey through functional programming looks like — parentheses, recursion, games, fractal generators, and a function plotter included — the full collection is on GitHub: [RacketProjects](https://github.com/xergioalex/RacketProjects).

Every `.scm` file in that repository is a snapshot of a moment when something clicked. When the parentheses stopped being confusing and started being elegant. When recursion stopped being scary and started being powerful. When programming stopped being a subject and started being a craft.
