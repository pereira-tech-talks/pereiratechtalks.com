---
title: "From Parentheses to Pointers: Learning C and Imperative Programming at University"
description: "Programming 2 brought C, pointers, memory management, and Allegro games—the semester I learned what the computer actually does under the hood."
pubDate: "2018-05-01"
heroImage: "/images/blog/posts/c-projects-university/hero.webp"
heroLayout: "side-by-side"
tags: ["portfolio", "tech", "university"]
keywords: ["C programming pointers university", "Allegro graphics library games", "C imperative programming tutorial", "memory management C language", "learn C programming beginners", "Allegro 2D game development C", "university C programming projects"]
---

If you read about [my first steps with DrScheme and functional programming](/blog/racket-projects-university/), you know that my introduction to code was a sea of parentheses, recursion, and the stubborn absence of `for` loops. Programming 1 taught me to think about *what* I wanted to compute. Programming 2 was about to teach me *how* the computer actually does it.

It was 2010. Second semester. The professor walked in, opened a terminal, and typed something that looked shockingly normal after a semester of Scheme:

```c
#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}
```

Curly braces. Semicolons. A `main` function that *returns* something. After months of prefix notation and nested parentheses, C felt like switching from reading right-to-left back to left-to-right. Everything was where you expected it to be. The plus sign went *between* the numbers. Variables had *types*. And you could actually write a `for` loop.

Welcome to imperative programming.

---

## When variables started changing

The biggest mental shift wasn't the syntax — it was the *philosophy*. In Scheme, data was immutable. You didn't change a variable; you created a new one. In C, mutation was the whole point. You declared a variable, and then you *changed* it. Over and over.

```c
int sum = 0;
for (int i = 1; i <= 100; i++) {
    sum += i;
}
printf("Sum: %d\n", sum);  // 5050
```

That `sum += i` line would have been heresy in Scheme. Here, it was just Tuesday. And the `for` loop — three expressions packed into one line, controlling initialization, condition, and increment — felt like a superpower after a semester of writing recursive functions to do the same thing.

But C wasn't just giving us loops. It was giving us *control*. Control over memory. Control over the machine. And with that control came responsibility — the kind that crashes your program at 2 AM with a cryptic "Segmentation fault" and no stack trace to help you.

---

## Pointers: the rite of passage

Every C programmer has a moment when pointers either click or break their spirit. Mine came during a lecture on memory addresses.

```c
int x = 42;
int *p = &x;    // p holds the ADDRESS of x
*p = 100;       // change x through its address
printf("%d\n", x);  // 100
```

The asterisk. The ampersand. The same symbol meaning "pointer to" in a declaration and "value at" in an expression. The professor drew boxes on the board — memory cells with addresses and values — and suddenly I could *see* it. Variables weren't abstract labels anymore. They were locations in memory. Real addresses. Numbers you could print and inspect.

And with that understanding came the rituals of C programming: `malloc` to request memory, `free` to give it back, and the constant awareness that forgetting to do either would either leak memory or crash everything. There were no garbage collectors here. No safety nets. Just you and the machine, negotiating over bytes.

One exercise I remember vividly was writing a program that converts any number between 0 and 2,000,000,000 into its written form in Spanish. The `monto_escrito.c` file used recursion — yes, my old friend from Scheme — combined with a chain of ternary operators that would make any modern code reviewer weep. But it worked. And building it taught me that recursion wasn't exclusive to functional programming — it was a universal tool that C embraced just as well.

---

## From patterns to Sudoku: building everything

The course moved through exercises like a training montage. Each project taught a new concept, and each concept unlocked new possibilities:

**Pattern exercises** — nested `for` loops to print triangles, diamonds, and pyramids of asterisks on the console. Simple? Yes. But they taught you to *think* in loops, to visualize iteration, to understand that two nested loops give you a grid.

**Prime numbers** — the classic algorithm exercise. Iterate, divide, check remainders. After Scheme's recursive elegance, doing it with `for` loops felt almost blunt. But it was fast, and it was clear.

**Tic-tac-toe** — my first game in C. A `3x3` integer array, `printf` to draw the board, `scanf` to read moves, and modular arithmetic to map positions. Win detection was a wall of `if` statements checking every possible three-in-a-row. Ugly? Absolutely. Satisfying? Incredibly.

**File handling** — reading and writing files with `fopen`, `fprintf`, `fclose`. The moment you realize your program can persist data beyond its own execution — that felt like crossing a threshold.

**Sudoku** — a collaborative project with my classmate Gonzalo. A 9x9 grid with three-layer validation: check the row, check the column, check the 3x3 region. 211 lines of C that taught me more about array indexing and boundary conditions than any textbook could.

Each project was a step further from "learning syntax" and closer to "building things."

---

## Allegro: when C gets visual

Halfway through the semester, the professor introduced us to **Allegro** — a graphics library for C. Until that point, everything we'd built lived in a black terminal window. Allegro changed that. Suddenly, C could draw bitmaps, handle mouse clicks, and play sounds.

The first real graphics project was **Sokoban** — the classic box-pushing puzzle game. 331 lines of C that brought together everything we'd learned:

```c
BITMAP *caja, *muneco, *pared, *piso;
char nivel[20][20];
FILE *mapas;
```

Bitmap *pointers* for the graphics. A 2D character array for the level map. A *file pointer* to load levels from a text file. Every concept from the semester — pointers, arrays, file I/O, control flow — converging in one project.

Loading BMP images, blitting them to a back buffer, detecting keyboard input, tracking the player's position, checking collision with walls and boxes — all in a language where you manage every byte yourself. When the character moved on screen for the first time, pushed a box onto a target, and the game recognized the win condition — that was the moment C stopped being a classroom exercise and became a tool for building real things.

---

## The crown jewel: a Project Manager with GUI

For the final project, I built a **contact management system with a full graphical interface** using Allegro. 707 lines of C. A real application with buttons, text fields, and mouse interaction.

```c
typedef struct {
    char cedula[15];
    char nombre[30];
    char telefono[15];
} CONTACTO;
```

A `struct` to organize contact data. File I/O for persistent storage — contacts saved to disk and loaded on startup. Full CRUD operations: create, read, update, delete, and search by ID. Double-buffering to prevent screen flicker. Mouse click detection on graphical buttons. Keyboard input with separate validation for numbers and text.

We built it in **Dev-C++** — the IDE of the era — with Allegro linked as a library. The interface had images for buttons loaded from a folder, a cursor that responded to mouse movement, and text rendered directly onto bitmaps.

Was it production-ready? Not even close. Was it a real, functioning desktop application built from scratch by a second-semester student? Yes. And that mattered more than any grade.

---

## Looking back

Years later, having worked with Python, JavaScript, Go, TypeScript, and a dozen other languages, I can say this with certainty: **C taught me what no other language could have taught in the same way.**

It taught me that memory has addresses and sizes. That a string is just an array of characters with a null terminator. That a pointer isn't magic — it's a number that happens to point somewhere. That every abstraction in every high-level language is built on top of the things C forces you to understand.

The segmentation faults, the uninitialized pointers, the forgotten `free()` calls — every mistake made me a better programmer. Not because the mistakes were fun, but because they forced me to understand what the machine was actually doing. There's no hand-waving in C. No "it just works." Either you understand the memory layout, or your program crashes.

If Programming 1 with Scheme taught me to think, Programming 2 with C taught me to build. To manage resources. To respect the machine. To understand that software isn't magic — it's engineering.

The full collection of exercises, games, and that ambitious final project is on GitHub: [pregrado_ejercicios_en_c](https://github.com/xergioalex/pregrado_ejercicios_en_c).

Every `.c` file in that repository is a snapshot of a semester where curly braces replaced parentheses, pointers replaced recursion as the hard concept, and a second-semester student started to understand what programming really means at the lowest level.
