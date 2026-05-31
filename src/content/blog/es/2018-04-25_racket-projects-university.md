---
title: "Mis Primeros Pasos en Programación: DrScheme, Recursividad y un Graficador de Funciones"
description: "Aprendí a programar con DrScheme (hoy DrRacket): notación prefija, recursividad y un graficador de funciones con derivadas en mi primer curso universitario."
pubDate: "2018-04-25"
heroImage: "/images/blog/posts/racket-projects-university/hero.webp"
heroLayout: "side-by-side"
tags: ["portfolio", "tech", "university"]
keywords: ["aprender a programar con Racket", "programación funcional para principiantes", "DrScheme DrRacket universidad", "recursividad en programación funcional", "graficador de funciones matemáticas", "primer lenguaje de programación Scheme", "programación funcional vs imperativa"]
---

Hay gente que aprende a programar imprimiendo "Hello World" en Python o arrastrando bloques en Scratch. Yo aprendí mirando fijamente un mar de paréntesis en un lenguaje del que jamás había escuchado hablar, preguntándome si el profesor nos estaba haciendo una broma elaborada a toda la clase.

Era 2009. Acababa de empezar mi primer semestre de Ingeniería de Sistemas en la universidad. Programación 1. La materia que me iba a enganchar con todo este cuento del software o me iba a mandar corriendo a estudiar administración de empresas. Entré a ese salón esperando aprender Java, o tal vez C — algo que se pareciera a lo que los "programadores de verdad" usaban en la televisión. En cambio, el profesor abrió algo llamado **DrScheme** y escribió esto en el proyector:

```scheme
(+ 1 2)
```

Eso era. Eso era programar. Tres caracteres, dos paréntesis y un signo más que — por razones que yo no podía entender — estaba *antes* de los números en lugar de estar entre ellos. Bienvenido a la programación funcional.

---

## Los paréntesis que lo cambiaron todo

DrScheme — que después sería renombrado a [DrRacket](https://racket-lang.org/) — es un IDE para el lenguaje de programación Scheme, de la familia Lisp. Si nunca te has encontrado con un dialecto de Lisp, imagínate un mundo donde cada operación va envuelta en paréntesis y el operador siempre va de primero. Eso es la **notación prefija**.

En vez de escribir `2 + 3`, escribes `(+ 2 3)`. En vez de `(2 + 3) * 4`, escribes `(* (+ 2 3) 4)`. Suena sencillo, pero cuando eres un estudiante de primer semestre que nunca ha escrito una línea de código, se siente como leer texto al revés.

```scheme
;; Matemáticas "normales": ((5 + 3) * 2) - 1
;; En Scheme:
(- (* (+ 5 3) 2) 1)
;; Resultado: 15
```

Las primeras semanas fueron pura confusión. Cada instinto me gritaba que pusiera el operador entre los operandos. Cada ejercicio me volvía con paréntesis descuadrados o argumentos en el orden equivocado. Mis compañeros y yo nos quedábamos mirando la pantalla, tratando de parsear mentalmente expresiones anidadas que parecían ir cinco niveles de profundidad.

Pero algo curioso pasa cuando te obligan a pensar diferente desde el principio. No formas malos hábitos. No traes suposiciones de otros lenguajes. Tu cerebro simplemente... se adapta. Y poco a poco, los paréntesis empezaron a tener sentido. Había una elegancia en ello — todo era una función, todo era consistente, y los paréntesis te decían *exactamente* dónde empezaba y terminaba cada expresión.

---

## Cuando la recursividad me voló la cabeza

La cosa con Scheme es esta: no hay ciclos `for`. No hay ciclos `while`. No hay `do...until`. Si quieres repetir algo, usas **recursividad** — una función que se llama a sí misma.

```scheme
;; Factorial usando recursividad
(define (factorial n)
  (if (<= n 1)
      1
      (* n (factorial (- n 1)))))

(factorial 5) ;; → 120
```

El concepto era lo suficientemente sencillo de explicar: una función que sigue llamándose a sí misma con un problema más pequeño hasta que llega a un caso base. Entenderlo intelectualmente era una cosa. *Sentirlo* — recorrer la ejecución paso a paso — era otra cosa completamente diferente.

Nuestro profesor nos ponía a hacer **pruebas de escritorio en papel**. Tomabas una función recursiva, escribías cada llamada, rastreabas los parámetros, veías cómo el stack crecía mientras la función se llamaba a sí misma una y otra vez, y después veías cómo se desenrollaba cuando cada llamada finalmente retornaba su resultado. Era como ver fichas de dominó caer en reversa.

```
factorial(5)
  → 5 * factorial(4)
    → 4 * factorial(3)
      → 3 * factorial(2)
        → 2 * factorial(1)
          → 1           ← ¡caso base!
        ← 2 * 1 = 2
      ← 3 * 2 = 6
    ← 4 * 6 = 24
  ← 5 * 24 = 120
```

Me acuerdo sentado en mi escritorio en la casa, con el cuaderno lleno de flechas y números, rastreando programas que involucraban **backtracking** — funciones que exploraban múltiples caminos, retrocedían cuando llegaban a callejones sin salida, y lo intentaban de nuevo. Ver un programa esencialmente "pensar" a través de un problema llamándose a sí mismo me volaba la cabeza. Mi cuaderno parecía el trabajo de un detective de conspiración conectando hilos rojos en una pared. Pero funcionaba, y en algún lugar de ese desorden de flechas, el concepto hizo clic.

Ese fue el momento en que me di cuenta de que programar no se trataba solo de decirle a un computador qué hacer. Se trataba de pensar. De romper un problema en pedazos tan pequeños que la solución se volvía obvia.

---

## De cadenas a ajedrez: construyendo de todo

La materia avanzaba rápido. Una vez que teníamos la recursividad dominada, empezamos a construir cosas de verdad. El [repositorio](https://github.com/xergioalex/RacketProjects) que armé captura todo el arco — desde ejercicios simples hasta proyectos sorprendentemente ambiciosos:

**Operaciones con cadenas y vectores** — detección de palíndromos, conteo de vocales, inversión de cadenas. El tipo de trabajo fundamental que te enseña a pensar sobre los datos carácter por carácter.

**Teoría de números** — generadores de números primos, secuencias de Fibonacci, calculadoras de factoriales. Todo recursivo, por supuesto. Todo es recursivo en Scheme.

**Sistemas de calendario** — implementamos conversiones de calendario Gregoriano, Juliano y hasta *Romano*. Archivos gigantes (60K+ caracteres de código Scheme para un solo sistema de calendario) que nos enseñaron sobre lógica compleja y casos borde.

**Series matemáticas** — Fibonacci, progresiones aritméticas. Más recursividad, más reconocimiento de patrones.

**Estructuras de datos** — un sistema de agenda de contactos, manejando datos estructurados con listas y vectores en un lenguaje que te hace ganarte cada manipulación de datos.

Y después vinieron los proyectos que nos hicieron sentir como verdaderos desarrolladores de software:

**Un juego de Ajedrez** (`ajedrez.scm`). Un **juego de la Culebrita** (`culebrita.scm`). Un **Ahorcado**. Una **aplicación de Paint**. Un **generador de fractales**. Un **editor de texto**.

Cada proyecto nos empujaba más lejos. Cada uno nos hacía más cómodos con la idea de que la programación funcional no era una limitación — era un lente. Una manera diferente de ver los problemas.

---

## La joya de la corona: un graficador de funciones con derivadas

Para el proyecto final, mi compañero Alejandro Pinto y yo decidimos apuntar alto. Queríamos construir algo que combinara todo lo que habíamos aprendido — parsing, matemáticas, gráficos, recursividad — en una sola aplicación.

Construimos un **graficador de funciones matemáticas con diferenciación simbólica**.

Podías escribir una función matemática, y el programa:
1. **Parseaba** la cadena de entrada a una representación polinomial
2. **Validaba** la estructura del polinomio
3. **Graficaba** la función en un plano de coordenadas X-Y
4. **Calculaba la derivada** simbólicamente — no numéricamente, sino realmente aplicando las reglas de derivación
5. **Graficaba la derivada** junto a la función original

<figure>
  <img src="/images/blog/posts/racket-projects-university/hero.gif" alt="Graficador de Funciones e Integrador" loading="lazy" />
  <figcaption>El graficador de funciones en acción — parseando un polinomio, dibujándolo en un plano de coordenadas y calculando su derivada simbólica.</figcaption>
</figure>

El archivo principal — `integrador y derivador.scm` — tenía una cantidad enorme de código Scheme para un lenguaje tan conciso. Construimos una arquitectura modular antes de siquiera saber qué significaba "arquitectura modular": un motor gráfico (`graficador.scm`), un integrador (`integrador_final.scm`), un parser de números (`convertir_a_numero.scm`), un validador de polinomios (`verificar polinomio.scm`), y un manejador de coeficientes y exponentes.

Construir un motor gráfico desde cero en DrScheme significaba calcular posiciones de píxeles manualmente, mapear coordenadas matemáticas a coordenadas de pantalla, dibujar ejes, escalar la vista — todo en un lenguaje sin estado mutable por defecto. Cada píxel era el resultado de una función pura.

La parte de las derivadas fue lo que más orgullo me dio. Implementamos las reglas básicas de diferenciación — regla de la potencia, regla de la constante, regla de la suma — como pattern matching recursivo sobre la estructura del polinomio. Le metías `3x² + 2x + 1`, te devolvía `6x + 2`. Todo desde los principios fundamentales, en un lenguaje funcional, siendo estudiantes de primer semestre.

¿El código era elegante? Definitivamente no. ¿Estaba bien estructurado según estándares profesionales? Ni de cerca. ¿Funcionaba? **Sí.** Y hay algo bonito en eso — aprender a programar hace menos de un año y construir algo que hace cálculo diferencial.

---

## Mirando hacia atrás

Han pasado años desde que escribí mi última línea de Scheme. Desde entonces he trabajado con Python, JavaScript, TypeScript, Go, y más lenguajes de los que puedo contar. He construido sistemas en producción, diseñado arquitecturas y debuggeado aplicaciones distribuidas.

Pero DrScheme me enseñó cosas que ningún otro lenguaje me hubiera podido enseñar de la misma manera. Me enseñó a pensar recursivamente — a ver cada problema como una versión más pequeña de sí mismo. Me enseñó que la sintaxis es solo ropa; las ideas debajo son lo que importa. Me enseñó que las restricciones generan creatividad — cuando no puedes usar un ciclo `for`, encuentras otras maneras, y esas otras maneras muchas veces resultan ser más poderosas.

Empezar con un lenguaje "raro" fue lo mejor que me pudo haber pasado. Cuando todo es desconocido, no puedes confiar en la intuición — tienes que realmente *entender*. Y ese entendimiento se convierte en la base de todo lo que viene después.

Si te da curiosidad ver cómo se ve el recorrido de un estudiante de primer semestre a través de la programación funcional — paréntesis, recursividad, juegos, generadores de fractales y un graficador de funciones incluidos — la colección completa está en GitHub: [RacketProjects](https://github.com/xergioalex/RacketProjects).

Cada archivo `.scm` en ese repositorio es una foto de un momento donde algo hizo clic. Donde los paréntesis dejaron de ser confusos y empezaron a ser elegantes. Donde la recursividad dejó de dar miedo y empezó a ser poderosa. Donde programar dejó de ser una materia y empezó a ser un oficio.
