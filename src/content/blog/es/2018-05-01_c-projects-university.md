---
title: "De los Paréntesis a los Punteros: Aprendiendo C y Programación Imperativa en la Universidad"
description: "Programación 2: C, punteros, memoria y juegos con Allegro—el semestre en que entendí qué hace de verdad el computador bajo el capó."
pubDate: "2018-05-01"
heroImage: "/images/blog/posts/c-projects-university/hero.webp"
heroLayout: "side-by-side"
tags: ["portfolio", "tech", "university"]
keywords: ["aprender C en la universidad", "punteros en C para principiantes", "manejo de memoria en C", "programación imperativa con C", "juegos con Allegro en C", "estructuras de datos en C", "proyecto universitario programación C"]
---

Si leyeron sobre [mis primeros pasos con DrScheme y la programación funcional](/es/blog/racket-projects-university/), saben que mi introducción al código fue un mar de paréntesis, recursividad y la terca ausencia de ciclos `for`. Programación 1 me enseñó a pensar en *qué* quería computar. Programación 2 estaba a punto de enseñarme *cómo* el computador realmente lo hace.

Era 2010. Segundo semestre. El profesor entró, abrió una terminal y escribió algo que se veía sorprendentemente normal después de un semestre de Scheme:

```c
#include <stdio.h>

int main() {
    printf("Hello, World!\n");
    return 0;
}
```

Llaves. Punto y coma. Una función `main` que *retorna* algo. Después de meses de notación prefija y paréntesis anidados, C se sentía como pasar de leer de derecha a izquierda de vuelta a izquierda a derecha. Todo estaba donde uno lo esperaba. El signo más iba *entre* los números. Las variables tenían *tipos*. Y podías escribir un ciclo `for` de verdad.

Bienvenido a la programación imperativa.

---

## Cuando las variables empezaron a cambiar

El cambio mental más grande no fue la sintaxis — fue la *filosofía*. En Scheme, los datos eran inmutables. No cambiabas una variable; creabas una nueva. En C, la mutación era todo el punto. Declarabas una variable, y después la *cambiabas*. Una y otra vez.

```c
int sum = 0;
for (int i = 1; i <= 100; i++) {
    sum += i;
}
printf("Sum: %d\n", sum);  // 5050
```

Esa línea `sum += i` hubiera sido herejía en Scheme. Acá, era simplemente un martes cualquiera. Y el ciclo `for` — tres expresiones empacadas en una línea, controlando inicialización, condición e incremento — se sentía como un superpoder después de un semestre escribiendo funciones recursivas para hacer lo mismo.

Pero C no solo nos estaba dando ciclos. Nos estaba dando *control*. Control sobre la memoria. Control sobre la máquina. Y con ese control venía responsabilidad — del tipo que te tumba el programa a las 2 de la mañana con un críptico "Segmentation fault" y sin stack trace para ayudarte.

---

## Punteros: el rito de iniciación

Todo programador de C tiene un momento donde los punteros le hacen clic o le quiebran el espíritu. El mío llegó durante una clase sobre direcciones de memoria.

```c
int x = 42;
int *p = &x;    // p guarda la DIRECCIÓN de x
*p = 100;       // cambia x a través de su dirección
printf("%d\n", x);  // 100
```

El asterisco. El ampersand. El mismo símbolo significando "puntero a" en una declaración y "valor en" en una expresión. El profesor dibujó cajitas en el tablero — celdas de memoria con direcciones y valores — y de repente podía *verlo*. Las variables ya no eran etiquetas abstractas. Eran ubicaciones en memoria. Direcciones reales. Números que podías imprimir e inspeccionar.

Y con ese entendimiento vinieron los rituales de la programación en C: `malloc` para pedir memoria, `free` para devolverla, y la conciencia constante de que olvidarse de hacer cualquiera de las dos o te fugaba memoria o te reventaba todo. Acá no había recolector de basura. No había red de seguridad. Solo vos y la máquina, negociando byte por byte.

Un ejercicio que recuerdo vivamente fue escribir un programa que convierte cualquier número entre 0 y 2.000.000.000 a su forma escrita en español. El archivo `monto_escrito.c` usaba recursión — sí, mi vieja amiga de Scheme — combinada con una cadena de operadores ternarios que haría llorar a cualquier code reviewer moderno. Pero funcionaba. Y construirlo me enseñó que la recursión no era exclusiva de la programación funcional — era una herramienta universal que C abrazaba igual de bien.

---

## De patrones a Sudoku: construyendo de todo

La materia avanzaba a través de ejercicios como un montaje de entrenamiento. Cada proyecto enseñaba un concepto nuevo, y cada concepto desbloqueaba nuevas posibilidades:

**Ejercicios de patrones** — ciclos `for` anidados para imprimir triángulos, diamantes y pirámides de asteriscos en la consola. ¿Simple? Sí. Pero te enseñaban a *pensar* en ciclos, a visualizar la iteración, a entender que dos ciclos anidados te dan una cuadrícula.

**Números primos** — el ejercicio algorítmico clásico. Iterar, dividir, revisar residuos. Después de la elegancia recursiva de Scheme, hacerlo con ciclos `for` se sentía casi brusco. Pero era rápido, y era claro.

**Triqui** — mi primer juego en C. Un arreglo de enteros de `3x3`, `printf` para dibujar el tablero, `scanf` para leer jugadas, y aritmética modular para mapear posiciones. La detección de victoria era un muro de `if` revisando cada posible tres en línea. ¿Feo? Totalmente. ¿Satisfactorio? Increíblemente.

**Manejo de archivos** — leer y escribir archivos con `fopen`, `fprintf`, `fclose`. El momento en que te das cuenta de que tu programa puede persistir datos más allá de su propia ejecución — eso se sentía como cruzar un umbral.

**Sudoku** — un proyecto colaborativo con mi compañero Gonzalo. Una cuadrícula de 9x9 con validación en tres capas: revisar la fila, revisar la columna, revisar la región 3x3. 211 líneas de C que me enseñaron más sobre indexación de arreglos y condiciones de frontera que cualquier libro de texto.

Cada proyecto era un paso más lejos de "aprender sintaxis" y más cerca de "construir cosas."

---

## Allegro: cuando C se vuelve visual

A mitad del semestre, el profesor nos presentó **Allegro** — una librería de gráficos para C. Hasta ese punto, todo lo que habíamos construido vivía en una ventana de terminal negra. Allegro cambió eso. De repente, C podía dibujar bitmaps, manejar clicks del mouse y reproducir sonidos.

El primer proyecto gráfico de verdad fue **Sokoban** — el clásico juego de empujar cajas. 331 líneas de C que unieron todo lo que habíamos aprendido:

```c
BITMAP *caja, *muneco, *pared, *piso;
char nivel[20][20];
FILE *mapas;
```

*Punteros* a bitmap para los gráficos. Un arreglo 2D de caracteres para el mapa del nivel. Un *puntero a archivo* para cargar niveles desde un archivo de texto. Cada concepto del semestre — punteros, arreglos, E/S de archivos, flujo de control — convergiendo en un solo proyecto.

Cargar imágenes BMP, blitearlas a un buffer trasero, detectar entrada del teclado, rastrear la posición del jugador, revisar colisiones con paredes y cajas — todo en un lenguaje donde vos manejás cada byte. Cuando el personaje se movió en la pantalla por primera vez, empujó una caja hacia el objetivo, y el juego reconoció la condición de victoria — ese fue el momento en que C dejó de ser un ejercicio de clase y se convirtió en una herramienta para construir cosas de verdad.

---

## La joya de la corona: un Manejador de Proyectos con interfaz gráfica

Para el proyecto final, construí un **sistema de gestión de contactos con interfaz gráfica completa** usando Allegro. 707 líneas de C. Una aplicación real con botones, campos de texto e interacción con el mouse.

```c
typedef struct {
    char cedula[15];
    char nombre[30];
    char telefono[15];
} CONTACTO;
```

Un `struct` para organizar los datos del contacto. E/S de archivos para almacenamiento persistente — los contactos se guardaban en disco y se cargaban al iniciar. Operaciones CRUD completas: crear, leer, actualizar, eliminar y buscar por cédula. Doble buffer para evitar el parpadeo de la pantalla. Detección de clicks del mouse sobre botones gráficos. Entrada de teclado con validación separada para números y texto.

Lo construimos en **Dev-C++** — el IDE de la época — con Allegro enlazado como librería. La interfaz tenía imágenes para los botones cargadas desde una carpeta, un cursor que respondía al movimiento del mouse, y texto renderizado directamente sobre bitmaps.

¿Estaba listo para producción? Ni de cerca. ¿Era una aplicación de escritorio real y funcional, construida desde cero por un estudiante de segundo semestre? Sí. Y eso importaba más que cualquier nota.

---

## Mirando hacia atrás

Años después, habiendo trabajado con Python, JavaScript, Go, TypeScript y una docena de lenguajes más, puedo decir esto con certeza: **C me enseñó lo que ningún otro lenguaje me hubiera podido enseñar de la misma manera.**

Me enseñó que la memoria tiene direcciones y tamaños. Que un string es solo un arreglo de caracteres con un terminador nulo. Que un puntero no es magia — es un número que apunta a algún lugar. Que cada abstracción en cada lenguaje de alto nivel está construida encima de las cosas que C te obliga a entender.

Los segmentation faults, los punteros sin inicializar, los `free()` olvidados — cada error me hizo mejor programador. No porque los errores fueran divertidos, sino porque me obligaban a entender qué estaba haciendo la máquina realmente. En C no hay manoteo. No hay "simplemente funciona." O entendés el layout de la memoria, o tu programa se revienta.

Si Programación 1 con Scheme me enseñó a pensar, Programación 2 con C me enseñó a construir. A manejar recursos. A respetar la máquina. A entender que el software no es magia — es ingeniería.

La colección completa de ejercicios, juegos y ese ambicioso proyecto final está en GitHub: [pregrado_ejercicios_en_c](https://github.com/xergioalex/pregrado_ejercicios_en_c).

Cada archivo `.c` en ese repositorio es una foto de un semestre donde las llaves reemplazaron los paréntesis, los punteros reemplazaron a la recursividad como el concepto difícil, y un estudiante de segundo semestre empezó a entender qué significa programar de verdad al nivel más bajo.
