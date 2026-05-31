---
title: "Declaring the Solution: Logic and Constraint Programming with Prolog and Mozart"
description: "Prolog and Mozart/Oz: logic puzzles, constraint solving, and four-coloring Colombia's map—university projects where you describe solutions, not steps."
pubDate: "2018-05-28"
heroImage: "/images/blog/posts/logic-programming-university/hero.webp"
heroLayout: "side-by-side"
tags: ["portfolio", "tech", "university"]
keywords: ["Prolog logic programming university", "Mozart Oz constraint programming", "Four Color Theorem Prolog", "declarative programming Prolog", "constraint satisfaction programming", "logic programming university course", "Prolog map coloring problem"]
---

By the time I reached Logic and Constraint Programming, I'd been through four paradigm shifts already. Scheme taught me to think in pure functions and recursion. C taught me what the machine was actually doing with every byte. Java and data structures taught me to organize and engineer. And [my OOP course with Java Swing](/blog/oop-java-swing-university-projects/) taught me to think in patterns — to design before coding, to separate concerns, to ask "what are the pieces and how do they talk to each other?"

Each of those courses gave me a new lens. But this one was different. Logic and Constraint Programming wasn't adding a new tool to the same mental model. It was proposing a fundamentally different relationship between programmer and machine. The others all said: here is a problem, now *tell* the computer how to solve it. This course said: here is a problem, now *describe* what the solution looks like, and let the computer figure out the rest.

That sounds like a subtle distinction. It isn't.

---

## The course

The professor opened with a challenge. He described the Eight Queens problem — place eight chess queens on an 8x8 board so none of them can attack each other. Then he asked us how we'd solve it.

We gave the obvious answer: try every combination, check if it's valid, keep the ones that work. A brute-force search. Maybe with some pruning to cut down the space.

He nodded. Then he showed us five lines of Prolog code that solved it.

Not five lines of a search algorithm. Five lines that *declared* what a solution was. The constraints — each queen in a different row, different column, different diagonal — stated as logical facts. Prolog's inference engine handled the search entirely on its own. We wrote the description of the answer. The language figured out how to find it.

The course covered two languages: **Prolog** for logic programming, and **Mozart/Oz** for constraint programming. They're related ideas — both declarative, both about stating what you want rather than how to get it — but they're distinct enough to teach you different things. Prolog works through unification and backtracking. Mozart/Oz introduces finite domain constraint variables and a specialized solver. Together, they cover a territory that most programmers never explore.

---

## Prolog — writing what is true

Prolog is built on a simple idea: you declare facts and rules, and then you ask questions. The engine tries to prove your question by finding assignments to variables that satisfy all the stated relationships.

```prolog
% Facts about who likes what
likes(maria, chocolate).
likes(juan, coffee).
likes(juan, chocolate).

% A rule: two people have something in common if both like it
common_interest(X, Y, Thing) :-
    likes(X, Thing),
    likes(Y, Thing),
    X \= Y.
```

Ask `?- common_interest(maria, juan, What).` and Prolog returns `What = chocolate`. It didn't execute a search you wrote. It explored the space of possible answers until it found one that satisfied every clause.

The first real exercises were logic puzzles — the kind you find in puzzle books. Classic setups like the Smith-Baker-Carpenter-Tailor puzzle: four people with surnames that happen to match four trades, but none of them practice the trade matching their name. The constraint is written almost as naturally as you'd describe it in English:

```prolog
resolver(Smith, Baker, Carpenter, Tailor) :-
    member(Smith,     [carpintero, sastre, panadero, herrero]),
    member(Baker,     [carpintero, sastre, panadero, herrero]),
    member(Carpenter, [carpintero, sastre, panadero, herrero]),
    member(Tailor,    [carpintero, sastre, panadero, herrero]),
    Smith     \= herrero,
    Baker     \= panadero,
    Carpenter \= carpintero,
    Tailor    \= sastre,
    diferente(Smith, Baker, Carpenter, Tailor).
```

The `member/2` predicate assigns each variable a value from the domain. The inequality constraints rule out forbidden assignments. `diferente` ensures all four values are distinct. Prolog's backtracking engine does the rest — trying assignments, backing up when a constraint fails, trying another path.

What struck me was how closely the code matched the problem statement. The gap between "what you want" and "what you write" was almost zero. There's no search loop to implement. No stack to manage. No visited set to maintain. You just write down the rules of the problem and the system finds the answer.

---

## Escalating the puzzles

Once you understand the basic mechanics, the puzzles escalate quickly. After the family and profession puzzles came scheduling problems — four couples arriving at a party in some order, with constraints about who can't arrive directly after whom. Then sports competitions: ranking athletes in a swimming and cycling event, given clues about relative placements.

Each puzzle taught a new Prolog technique. The Eight Queens problem introduced diagonal checking with arithmetic:

```prolog
queens(Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8) :-
    member(Q1, [1,2,3,4,5,6,7,8]),
    member(Q2, [1,2,3,4,5,6,7,8]),
    member(Q3, [1,2,3,4,5,6,7,8]),
    member(Q4, [1,2,3,4,5,6,7,8]),
    member(Q5, [1,2,3,4,5,6,7,8]),
    member(Q6, [1,2,3,4,5,6,7,8]),
    member(Q7, [1,2,3,4,5,6,7,8]),
    member(Q8, [1,2,3,4,5,6,7,8]),
    alldiferents(Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8),
    abs(Q1 - Q2) =\= 1,
    abs(Q1 - Q3) =\= 2,
    abs(Q1 - Q4) =\= 3,
    % ... diagonal constraints for every pair
    abs(Q7 - Q8) =\= 1.
```

Then came SEND+MORE=MONEY — the famous cryptarithmetic puzzle where each letter represents a unique digit, and the arithmetic must hold. In Prolog, you write the digit assignment constraints and the arithmetic equation, and the engine finds the mapping.

And then there was the South America map coloring problem — a preview of what was coming. Four colors, dozens of countries, the constraint that no two adjacent countries share a color. Even in Prolog, the declarative approach made the solution remarkably compact.

---

## Mozart/Oz — constraint programming

If Prolog is declarative, Mozart/Oz is declarative with a more powerful constraint engine underneath.

In Mozart/Oz, you work with **finite domain (FD) variables** — variables with a defined range of possible values. You add constraints between them. Then you call a distribution strategy, and the solver propagates constraints and searches the solution space until it finds a valid assignment.

The language itself is a beautiful hybrid. It has functional programming features — we implemented Pascal's Triangle and Fibonacci sequences with pattern matching that felt almost like Haskell. But its real power comes out in constraint solving.

The Magic Square problem showed the FD approach clearly:

```plaintext
proc {MagicSquare Root}
   S1 S2 S3 S4 S5 S6 S7 S8 S9
in
   Root = sol(s1:S1 s2:S2 s3:S3 s4:S4 s5:S5 s6:S6 s7:S7 s8:S8 s9:S9)
   Root ::: 1#9
   {FD.distinct Root}
   S1 + S2 + S3 =: 15
   S4 + S5 + S6 =: 15
   S7 + S8 + S9 =: 15
   S1 + S4 + S7 =: 15
   S2 + S5 + S8 =: 15
   S3 + S6 + S9 =: 15
   S1 + S5 + S9 =: 15
   S3 + S5 + S7 =: 15
   {FD.distribute ff Root}
end
```

`Root ::: 1#9` says every variable in the record has domain 1 to 9. `{FD.distinct Root}` says all nine values must be different. The eight sum constraints say each row, column, and diagonal must add to 15. `{FD.distribute ff Root}` triggers the search using the "fail first" heuristic — tackle the most constrained variable first.

That's the entire Magic Square solver. No search algorithm. No backtracking logic you wrote. You stated the problem; the engine searched.

The contrast with SEND+MORE=MONEY was instructive. In Prolog, you'd assign digits through `member/2` and backtracking, checking constraints as you go. In Mozart/Oz, you create FD variables with domain 0-9, state that all must be distinct, write the arithmetic equation as an FD constraint, and distribute. Two different ways of being declarative. The Oz version tends to be faster because FD propagation prunes the search space before committing to any assignment — it reasons globally about the constraints rather than checking them one at a time during backtracking.

We also implemented NxN Latin Squares — the generalized version of Magic Square where each row and column contains each value exactly once — using the same FD approach. The jump from 3x3 to NxN required almost no change to the solution structure. That's one of the things that surprised me about constraint programming: the approach scales in a way that imperative search doesn't.

---

## The crown jewel: Four Color Theorem

Mathematicians proved in 1976 — with computer assistance — that any map drawn on a flat plane can be colored with at most four colors such that no two adjacent regions share the same color. The Four Color Theorem. It took over a century to prove and required checking thousands of cases by computer.

For our final assignment, we applied it to something we knew: Colombia's 31 departments.

<figure>
  <img src="/images/blog/posts/logic-programming-university/blank-map.webp" alt="Blank map of Colombia's departments before coloring" loading="lazy" />
  <figcaption>Colombia's 31 departments uncolored — the starting point for the Four Color Theorem implementation in three paradigms.</figcaption>
</figure>

The challenge wasn't just implementing map coloring — that's a textbook problem. The challenge was implementing it in three different languages, with three different programming paradigms, and understanding why each approach looked the way it did.

**Java** — the OOP approach. A `Departamento` class with a `color` field and a list of neighboring departments. A `Pais` class holding the full list. Backtracking implemented as an explicit recursive method:

```java
public void asignarColores(Departamento dpto, int n) {
    for (int color = 1; color < 5; color++) {
        dpto.setColor(color);
        if (!dpto.compararVecinos(color)) {
            if (n == (dptos.size() - 1))
                break;
            asignarColores(dptos.get(n + 1), n + 1);
        } else {
            dpto.deshacerColor();
        }
    }
}
```

Try color 1. Check if any neighbor already has color 1. If not, move on to the next department. If yes, try color 2. If color 4 fails, backtrack. The logic is completely explicit — every decision, every rollback, every iteration is code you wrote. It works, and you can trace every step. But it's around 100 lines of boilerplate to express what is fundamentally a search through a constrained space.

**Racket** — the functional approach. I already knew DrRacket from [my first programming course](/blog/racket-projects-university/), so this was a homecoming of sorts. Same backtracking algorithm as Java, but expressed with immutable structs and recursive calls instead of mutable objects and loops. The algorithm is identical under the hood, but the functional style makes the recursive structure more explicit. Still fully procedural in terms of how the search is specified — you're telling the computer exactly how to search.

```racket
(define (pintar-dpto dpto color)
  (set-Departamento-Color! dpto color))

(define (despintar-dpto dpto)
  (set-Departamento-Color! dpto 0))

(define (asignar-colores dpto n)
  (for ([color (in-range 1 5)])
    (pintar-dpto dpto color)
    (if (not (comparar-vecinos dpto color))
        (if (= n (sub1 (length Colombia)))
            (void)
            (asignar-colores (list-ref Colombia (add1 n)) (add1 n)))
        (despintar-dpto dpto))))
```

Try color 1. If no neighbor has it, move to the next department. If there's a conflict, unpaint and try color 2. Same logic as Java — explicit backtracking, recursion instead of loops.

**Mozart/Oz** — the constraint approach. This is where the paradigm shift becomes visceral:

```plaintext
fun {ColorMapa Dato}
    Deptos = {Map Dato fun {$ D#_} D end}
in
    proc {$ Color}
       NroColores = {FD.decl}
    in
       {FD.distribute naive [NroColores]}
       {FD.record color Deptos 1#NroColores Color}
       {ForAll Dato
        proc {$ A#Ds}
           {ForAll Ds proc {$ D} Color.A \=: Color.D end}
        end}
       {FD.distribute ff Color}
    end
end
```

That's essentially the entire solver. `{FD.record color Deptos 1#NroColores Color}` creates an FD variable for each department with domain 1 to NroColores. The `ForAll` loop iterates over the adjacency list and states a single constraint for each pair: `Color.A \=: Color.D` — department A must have a different color than department D. Then `{FD.distribute ff Color}` triggers the search.

There's no explicit backtracking. No trial-and-error loop. No rollback code. You stated the constraint that adjacent regions can't share a color, and the solver found an assignment satisfying all constraints across all 31 departments simultaneously.

<figure>
  <img src="/images/blog/posts/logic-programming-university/hero.webp" alt="Colombia's 31 departments colored with four colors — no adjacent departments share the same color" loading="lazy" />
  <figcaption>The Mozart/Oz constraint solver's output: all 31 departments colored with four colors, no two adjacent sharing the same one.</figcaption>
</figure>

The Java version and the Racket version both search the same space, just described differently. The Mozart/Oz version describes the space of valid solutions and delegates the entire search to the constraint engine. About 50 lines versus about 100. And crucially, the Oz version is easier to reason about — there's no search logic that could have subtle bugs, no missed backtrack condition, no edge case in the rollback.

---

## What I actually learned

Here's the thing nobody tells you when you start programming: the imperative style — "do this, then do this, then check that, then do this" — is only one way to express computation. It's natural because it mirrors how we give instructions to other people. But not every problem is best solved by instructions.

Some problems are better solved by *description*.

SQL has known this for decades. You don't tell a database how to find the rows you want — you describe the rows you want, and the query optimizer figures out how to fetch them. CSS describes how a page should look, not the sequence of drawing operations. React and Svelte describe the UI as a function of state, not as a series of DOM mutations. Prolog describes relationships between facts. Mozart/Oz describes valid assignments.

The declarative idea keeps recurring because it has a real advantage: when you describe *what* rather than *how*, you're separating the problem from the search strategy. The constraint solver can improve independently of your problem description. Prolog's backtracking, Mozart's FD propagation — these are strategies you get for free, that can be optimized, that can be replaced. Your job is just to state the problem correctly.

That said, logic programming has real costs too. Debugging a constraint system is different from debugging imperative code — when the solver fails, you don't have a stack trace of decisions, you have an unsatisfied constraint system. Performance is harder to reason about. And not every problem maps naturally to the declarative style. The skill isn't in using Prolog for everything — it's in recognizing which problems are actually constraint satisfaction in disguise.

---

## Looking back

I've now spent several years collecting programming paradigms like different languages for thinking.

Scheme gave me recursion and the idea that a program is a description of a computation, not a sequence of steps. C gave me the machine — memory addresses, pointers, the physical reality underneath every abstraction. Data structures gave me organization — how the shape of your data determines the shape of your solutions. OOP gave me architecture — patterns, separation of concerns, designing systems before writing a line. And now logic and constraint programming gave me declaration — the idea that you can sometimes just state what you want, and a sufficiently smart engine will find it.

Each paradigm was a new lens. None of them are complete on their own. The programmer who only thinks imperatively misses the elegance of constraint propagation. The programmer who only thinks declaratively struggles with systems where performance and control matter. The real skill is knowing which lens to reach for and when.

There's something fitting about ending the university programming sequence here. It started with Scheme asking me to stop thinking procedurally and start thinking functionally. It ended with Prolog and Mozart/Oz asking me to stop thinking about algorithms altogether and start thinking about what's true. The parentheses from [my first programming course with DrRacket](/blog/racket-projects-university/) connected directly to the Racket implementation of the Four Color Theorem — both semesters, different buildings, same underlying idea: computation as transformation of meaning.

Let's keep building.

---

## Resources

- [Logic and Constraint Programming — Prolog and Mozart/Oz projects (GitHub)](https://github.com/xergioalex/logic_and_restricted_programming)
- [Four Color Theorem — Java, Racket, and Mozart/Oz implementations (GitHub)](https://github.com/xergioalex/4ColorsTheorem)
- [My first programming course — Racket, recursion, and a function plotter](/blog/racket-projects-university/)
- [My OOP course — Sudoku solver and contact agenda with Java Swing](/blog/oop-java-swing-university-projects/)
