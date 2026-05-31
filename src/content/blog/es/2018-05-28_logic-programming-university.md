---
title: "Declarando la Solución: Programación Lógica y con Restricciones con Prolog y Mozart"
description: "Prolog y Mozart/Oz: puzzles, restricciones y cuatro colores en el mapa de Colombia—programación lógica y con restricciones en la universidad."
pubDate: "2018-05-28"
heroImage: "/images/blog/posts/logic-programming-university/hero.webp"
heroLayout: "side-by-side"
tags: ["portfolio", "tech", "university"]
keywords: ["programación lógica con Prolog", "Mozart Oz restricciones", "programación con restricciones ejemplos", "Prolog para principiantes", "teorema de cuatro colores Prolog", "paradigmas de programación universidad", "programación declarativa vs imperativa"]
---

Cuando llegué a Programación Lógica y con Restricciones, ya había pasado por cuatro cambios de paradigma. Scheme me enseñó a pensar en funciones puras y recursividad. C me enseñó lo que el computador realmente hacía con cada byte. Java y las estructuras de datos me enseñaron a organizar y a diseñar con ingeniería. Y [mi curso de POO con Java Swing](/es/blog/oop-java-swing-university-projects/) me enseñó a pensar en patrones — a diseñar antes de codificar, a separar responsabilidades, a preguntar "¿cuáles son las piezas y cómo se comunican entre sí?"

Cada uno de esos cursos me dio una lente nueva. Pero este era diferente. La Programación Lógica y con Restricciones no estaba añadiendo una herramienta más al mismo modelo mental. Estaba proponiendo una relación fundamentalmente distinta entre el programador y la máquina. Los demás decían: aquí tienes un problema, ahora *dile* al computador cómo resolverlo. Este curso decía: aquí tienes un problema, ahora *describe* cómo luce la solución, y deja que el computador encuentre el camino.

Suena como una distinción sutil. No lo es.

---

## El curso

El profesor abrió con un reto. Describió el problema de las Ocho Reinas — colocar ocho reinas de ajedrez en un tablero 8x8 de modo que ninguna pueda atacar a las demás. Luego nos preguntó cómo lo resolveríamos.

Dimos la respuesta obvia: probar todas las combinaciones posibles, verificar si son válidas, quedarnos con las que funcionen. Una búsqueda por fuerza bruta. Quizás con alguna poda para reducir el espacio de búsqueda.

El profesor asintió. Luego nos mostró cinco líneas de código Prolog que lo resolvían.

No cinco líneas de un algoritmo de búsqueda. Cinco líneas que *declaraban* qué era una solución. Las restricciones — cada reina en una fila distinta, columna distinta, diagonal distinta — expresadas como hechos lógicos. El motor de inferencia de Prolog se encargó por completo de la búsqueda. Nosotros escribimos la descripción de la respuesta. El lenguaje descubrió cómo encontrarla.

El curso cubría dos lenguajes: **Prolog** para programación lógica, y **Mozart/Oz** para programación con restricciones. Son ideas relacionadas — ambas declarativas, ambas sobre expresar qué queremos en vez de cómo obtenerlo — pero lo suficientemente distintas para enseñar cosas diferentes. Prolog trabaja mediante unificación y backtracking. Mozart/Oz introduce variables de dominio finito y un motor solver especializado. Juntos, cubren un territorio que la mayoría de los programadores nunca exploran.

---

## Prolog — escribir lo que es verdad

Prolog está construido sobre una idea simple: declaras hechos y reglas, y luego haces preguntas. El motor intenta probar tu pregunta encontrando asignaciones a las variables que satisfagan todas las relaciones declaradas.

```prolog
% Hechos sobre quién le gusta qué
likes(maria, chocolate).
likes(juan, coffee).
likes(juan, chocolate).

% Una regla: dos personas tienen algo en común si a ambas les gusta
common_interest(X, Y, Thing) :-
    likes(X, Thing),
    likes(Y, Thing),
    X \= Y.
```

Pregunta `?- common_interest(maria, juan, What).` y Prolog devuelve `What = chocolate`. No ejecutó una búsqueda que tú escribiste. Exploró el espacio de posibles respuestas hasta encontrar una que satisficiera cada cláusula.

Los primeros ejercicios reales fueron puzzles lógicos — del tipo que encuentras en libros de acertijos. Casos clásicos como el de Smith-Baker-Carpenter-Tailor: cuatro personas cuyos apellidos coinciden con cuatro oficios, pero ninguna ejerce el oficio que corresponde a su apellido. La restricción se escribe casi tan naturalmente como la describirías en español:

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

El predicado `member/2` asigna a cada variable un valor del dominio. Las restricciones de desigualdad descartan asignaciones prohibidas. `diferente` garantiza que los cuatro valores sean distintos. El motor de backtracking de Prolog hace el resto — probando asignaciones, retrocediendo cuando falla una restricción, intentando otro camino.

Lo que me llamó la atención fue lo cerca que estaba el código del enunciado del problema. La distancia entre "lo que quieres" y "lo que escribes" era casi cero. No hay un ciclo de búsqueda que implementar. No hay una pila que manejar. No hay un conjunto de visitados que mantener. Solo escribes las reglas del problema y el sistema encuentra la respuesta.

---

## Escalando los puzzles

Una vez que entiendes la mecánica básica, los puzzles escalan rápidamente. Después de los puzzles de familias y oficios vinieron los problemas de programación de eventos — cuatro parejas llegando a una fiesta en cierto orden, con restricciones sobre quién no puede llegar justo después de quién. Luego competencias deportivas: clasificar atletas en un evento de natación y ciclismo, dados indicios sobre las posiciones relativas.

Cada puzzle enseñaba una nueva técnica de Prolog. El problema de las Ocho Reinas introdujo la verificación de diagonales con aritmética:

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
    % ... restricciones de diagonal para cada par
    abs(Q7 - Q8) =\= 1.
```

Luego vino SEND+MORE=MONEY — el famoso puzzle criptoaritmético donde cada letra representa un dígito único, y la suma debe ser correcta. En Prolog, escribes las restricciones de asignación de dígitos y la ecuación aritmética, y el motor encuentra el mapeo.

Y después estaba el problema de colorear el mapa de América del Sur — un anticipo de lo que vendría. Cuatro colores, docenas de países, la restricción de que dos países adyacentes no pueden compartir el mismo color. Incluso en Prolog, el enfoque declarativo hacía la solución sorprendentemente compacta.

---

## Mozart/Oz — programación con restricciones

Si Prolog es declarativo, Mozart/Oz es declarativo con un motor de restricciones más poderoso por debajo.

En Mozart/Oz, trabajas con **variables de dominio finito (FD)** — variables con un rango definido de valores posibles. Agregas restricciones entre ellas. Luego llamas una estrategia de distribución, y el solver propaga restricciones y explora el espacio de soluciones hasta encontrar una asignación válida.

El lenguaje en sí es un híbrido hermoso. Tiene características de programación funcional — implementamos el Triángulo de Pascal y la secuencia de Fibonacci con pattern matching que se sentía casi como Haskell. Pero su poder real sale a relucir en la resolución de restricciones.

El problema del Cuadrado Mágico mostró el enfoque FD con claridad:

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

`Root ::: 1#9` dice que cada variable en el registro tiene dominio de 1 a 9. `{FD.distinct Root}` dice que los nueve valores deben ser distintos. Las ocho restricciones de suma dicen que cada fila, columna y diagonal debe sumar 15. `{FD.distribute ff Root}` dispara la búsqueda usando la heurística "fail first" — atacar primero la variable más restringida.

Ese es el solver completo del Cuadrado Mágico. No hay algoritmo de búsqueda. No hay lógica de backtracking que tú hayas escrito. Describiste el problema; el motor buscó.

El contraste con SEND+MORE=MONEY fue instructivo. En Prolog, asignas dígitos mediante `member/2` y backtracking, verificando restricciones sobre la marcha. En Mozart/Oz, creas variables FD con dominio 0-9, declaras que todas deben ser distintas, escribes la ecuación aritmética como restricción FD, y distribuyes. Dos maneras diferentes de ser declarativo. La versión en Oz tiende a ser más rápida porque la propagación FD poda el espacio de búsqueda antes de comprometerse con cualquier asignación — razona globalmente sobre las restricciones en lugar de verificarlas una a una durante el backtracking.

También implementamos Cuadrados Latinos NxN — la versión generalizada del Cuadrado Mágico donde cada fila y columna contiene cada valor exactamente una vez — usando el mismo enfoque FD. El salto de 3x3 a NxN requirió casi ningún cambio en la estructura de la solución. Eso es una de las cosas que me sorprendió de la programación con restricciones: el enfoque escala de una manera que la búsqueda imperativa no escala.

---

## La pieza maestra: Teorema de los Cuatro Colores

Los matemáticos probaron en 1976 — con ayuda computacional — que cualquier mapa dibujado en un plano puede colorearse con a lo sumo cuatro colores de modo que dos regiones adyacentes no compartan el mismo color. El Teorema de los Cuatro Colores. Tardó más de un siglo en probarse y requirió verificar miles de casos por computador.

Para la tarea final, lo aplicamos a algo que conocíamos: los 31 departamentos de Colombia.

<figure>
  <img src="/images/blog/posts/logic-programming-university/blank-map.webp" alt="Mapa en blanco de los departamentos de Colombia antes de colorear" loading="lazy" />
  <figcaption>Los 31 departamentos de Colombia sin colorear — el punto de partida para la implementación del Teorema de los Cuatro Colores en tres paradigmas.</figcaption>
</figure>

El reto no era solo implementar la coloración de mapas — eso es un problema de libro de texto. El reto era implementarlo en tres lenguajes diferentes, con tres paradigmas de programación distintos, y entender por qué cada enfoque lucía como lucía.

**Java** — el enfoque orientado a objetos. Una clase `Departamento` con un campo `color` y una lista de departamentos vecinos. Una clase `Pais` que contiene la lista completa. El backtracking implementado como un método recursivo explícito:

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

Intenta el color 1. Verifica si algún vecino ya tiene el color 1. Si no, avanza al siguiente departamento. Si sí, prueba el color 2. Si el color 4 falla, retrocede. La lógica es completamente explícita — cada decisión, cada rollback, cada iteración es código que tú escribiste. Funciona, y puedes rastrear cada paso. Pero son unas 100 líneas de código para expresar lo que es fundamentalmente una búsqueda en un espacio restringido.

**Racket** — el enfoque funcional. Ya conocía DrRacket de [mi primer curso de programación](/es/blog/racket-projects-university/), así que fue un reencuentro. El mismo algoritmo de backtracking que en Java, pero expresado con structs inmutables y llamadas recursivas en lugar de objetos mutables y ciclos. El algoritmo es idéntico por debajo, pero el estilo funcional hace la estructura recursiva más explícita. Sigue siendo completamente procedimental en cuanto a cómo se especifica la búsqueda — le estás diciendo al computador exactamente cómo buscar.

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

Prueba el color 1. Si ningún vecino lo tiene, avanza al siguiente departamento. Si hay conflicto, despinta y prueba el color 2. La misma lógica que en Java — backtracking explícito, recursión en lugar de ciclos.

**Mozart/Oz** — el enfoque con restricciones. Aquí es donde el cambio de paradigma se vuelve visceral:

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

Eso es esencialmente el solver completo. `{FD.record color Deptos 1#NroColores Color}` crea una variable FD para cada departamento con dominio de 1 a NroColores. El ciclo `ForAll` itera sobre la lista de adyacencias y declara una sola restricción para cada par: `Color.A \=: Color.D` — el departamento A debe tener un color diferente al departamento D. Luego `{FD.distribute ff Color}` dispara la búsqueda.

No hay backtracking explícito. No hay un ciclo de prueba y error. No hay código de rollback. Declaraste la restricción de que las regiones adyacentes no pueden compartir color, y el solver encontró una asignación que satisface todas las restricciones de los 31 departamentos simultáneamente.

<figure>
  <img src="/images/blog/posts/logic-programming-university/hero.webp" alt="Los 31 departamentos de Colombia coloreados con cuatro colores — ningún departamento adyacente comparte el mismo color" loading="lazy" />
  <figcaption>El resultado del solver de restricciones de Mozart/Oz: los 31 departamentos coloreados con cuatro colores, sin que dos adyacentes compartan el mismo.</figcaption>
</figure>

La versión en Java y la de Racket exploran el mismo espacio, solo descritos de manera diferente. La versión en Mozart/Oz describe el espacio de soluciones válidas y delega toda la búsqueda al motor de restricciones. Unas 50 líneas frente a unas 100. Y lo que es más importante, la versión en Oz es más fácil de razonar — no hay lógica de búsqueda que pueda tener bugs sutiles, no hay condición de retroceso que se haya omitido, no hay caso borde en el rollback.

---

## Lo que realmente aprendí

Hay algo que nadie te cuenta cuando empiezas a programar: el estilo imperativo — "haz esto, luego esto, luego verifica aquello, luego esto otro" — es solo una manera de expresar computación. Es natural porque refleja cómo le damos instrucciones a otras personas. Pero no todo problema se resuelve mejor con instrucciones.

Algunos problemas se resuelven mejor con *descripción*.

SQL lo sabe desde hace décadas. No le dices a una base de datos cómo encontrar las filas que quieres — describes las filas que quieres, y el optimizador de consultas se encarga de traerlas. CSS describe cómo debe lucir una página, no la secuencia de operaciones de dibujo. React y Svelte describen la UI como una función del estado, no como una serie de mutaciones al DOM. Prolog describe relaciones entre hechos. Mozart/Oz describe asignaciones válidas.

La idea declarativa sigue reapareciendo porque tiene una ventaja real: cuando describes *qué* en lugar de *cómo*, estás separando el problema de la estrategia de búsqueda. El solver de restricciones puede mejorar independientemente de la descripción de tu problema. El backtracking de Prolog, la propagación FD de Mozart — son estrategias que recibes gratis, que pueden optimizarse, que pueden reemplazarse. Tu trabajo es solo enunciar el problema correctamente.

Dicho esto, la programación lógica tiene costos reales también. Depurar un sistema de restricciones es diferente a depurar código imperativo — cuando el solver falla, no tienes un stack trace de decisiones, tienes un sistema de restricciones insatisfecho. El rendimiento es más difícil de razonar. Y no todo problema se mapea naturalmente al estilo declarativo. La habilidad no está en usar Prolog para todo — está en reconocer qué problemas son en realidad satisfacción de restricciones disfrazada.

---

## Mirando atrás

Llevo varios años acumulando paradigmas de programación como lenguajes distintos para pensar.

Scheme me dio la recursividad y la idea de que un programa es una descripción de una computación, no una secuencia de pasos. C me dio la máquina — direcciones de memoria, punteros, la realidad física detrás de cada abstracción. Las estructuras de datos me dieron organización — cómo la forma de tus datos determina la forma de tus soluciones. La POO me dio arquitectura — patrones, separación de responsabilidades, diseñar sistemas antes de escribir una línea. Y ahora la programación lógica y con restricciones me dio la declaración — la idea de que a veces simplemente puedes enunciar lo que quieres, y un motor suficientemente inteligente lo encontrará.

Cada paradigma fue una lente nueva. Ninguno es completo por sí solo. El programador que solo piensa imperativamente se pierde la elegancia de la propagación de restricciones. El que solo piensa declarativamente batalla con sistemas donde el rendimiento y el control importan. La habilidad real está en saber qué lente usar y cuándo.

Hay algo apropiado en terminar la secuencia universitaria de programación aquí. Empezó con Scheme pidiéndome que dejara de pensar proceduralmente y empezara a pensar funcionalmente. Terminó con Prolog y Mozart/Oz pidiéndome que dejara de pensar en algoritmos por completo y empezara a pensar en qué es verdad. Los paréntesis de [mi primer curso de programación con DrRacket](/es/blog/racket-projects-university/) conectaron directamente con la implementación en Racket del Teorema de los Cuatro Colores — dos semestres, edificios distintos, la misma idea de fondo: la computación como transformación de significado.

A seguir construyendo.

---

## Recursos

- [Programación Lógica y con Restricciones — proyectos en Prolog y Mozart/Oz (GitHub)](https://github.com/xergioalex/logic_and_restricted_programming)
- [Teorema de los Cuatro Colores — implementaciones en Java, Racket y Mozart/Oz (GitHub)](https://github.com/xergioalex/4ColorsTheorem)
- [Mi primer curso de programación — Racket, recursividad y un graficador de funciones](/es/blog/racket-projects-university/)
- [Mi curso de POO — Sudoku y agenda de contactos con Java Swing](/es/blog/oop-java-swing-university-projects/)
