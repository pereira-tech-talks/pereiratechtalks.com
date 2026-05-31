---
title: "Estructuras de Datos en Java: De Listas Enlazadas a un Triqui Invencible con IA"
description: "Estructuras de datos en Java: pilas, colas, árboles, grafos, Dijkstra y un triqui invencible con Minimax—de teoría a un tablero imbatible."
pubDate: "2018-05-15"
heroImage: "/images/blog/posts/data-structures-java-university/hero.webp"
heroLayout: "side-by-side"
tags: ["portfolio", "tech", "university"]
keywords: ["estructuras de datos en Java", "listas enlazadas colas y pilas Java", "algoritmo Minimax en Java", "Dijkstra en Java", "árboles y grafos en Java", "triqui con inteligencia artificial Java", "complejidad algorítmica universidad"]
---

Si [Programación 1 con DrScheme](/es/blog/racket-projects-university/) me enseñó a pensar, [Programación 2 con C](/es/blog/c-projects-university/) me enseñó lo que la máquina realmente hacía, y [POO](/es/blog/oop-java-swing-university-projects/) me enseñó a diseñar sistemas bien arquitectados — entonces Estructuras de Datos fue la materia donde todo eso convergió en una sola pregunta: **¿cómo organizas tus datos para que tu programa sea eficiente?**

Estructuras de Datos. La materia que separa a la gente que sabe escribir código de la gente que sabe escribir código *eficiente*. La materia que te hace darte cuenta de que una simple lista no siempre es la respuesta, que la forma en que almacenas tus datos cambia todo sobre qué tan rápido puedes encontrarlos, ordenarlos o recorrerlos.

---

## De patrones de diseño a patrones algorítmicos

Venía de un semestre donde el foco era la *arquitectura*: MVC, Observer, separación de responsabilidades, diseñar antes de codear. En [POO](/es/blog/oop-java-swing-university-projects/) había construido un [solucionador de Sudoku completo con Java Swing](https://github.com/xergioalex/SudokuMVCJavaSwing) — con propagación de restricciones vía el patrón Observer, backtracking con clonación de estado, y una interfaz gráfica con deshacer/rehacer. Ya sabía Java. Ya sabía pensar en clases, encapsulamiento, herencia, interfaces.

Pero Estructuras de Datos cambiaba la pregunta. En POO, la pregunta era: *¿cómo estructuro mi código para que sea mantenible?* Acá la pregunta era: *¿cómo estructuro mis datos para que las operaciones sean rápidas?* Ya no era suficiente que el programa estuviera bien organizado — tenía que ser *eficiente*.

Y la base de POO ayudaba más de lo que imaginaba. Saber pensar en clases significaba que implementar un `NodoLista` con encapsulamiento y getters/setters era natural. Entender interfaces significaba que podía diseñar estructuras con contratos claros. La disciplina de separar responsabilidades que había practicado con MVC se traducía directamente en implementaciones limpias de cada estructura.

```java
public class NodoLista {
    private Object dato;
    private NodoLista siguiente;

    public NodoLista(Object dato) {
        this.dato = dato;
        this.siguiente = null;
    }
}
```

Lo que me sorprendió fue que el pensamiento recursivo que había entrenado en Scheme se transfería perfecto también a este nuevo contexto. Los árboles son recursivos. Los grafos son recursivos. La mayoría de las soluciones elegantes en estructuras de datos son recursivas. Scheme me había preparado para los algoritmos, y POO me había preparado para la implementación. Estructuras de Datos unía ambos mundos.

---

## Los ladrillos fundamentales: pilas y colas

Todo curso de estructuras de datos empieza en el mismo lugar: **listas enlazadas**. Y a partir de las listas enlazadas, construyes todo lo demás.

Una lista enlazada es engañosamente simple — cada nodo guarda un dato y un puntero al siguiente nodo. Eso es todo. Pero de esa idea tan simple, salen dos estructuras fundamentales:

**Pilas** — Last In, First Out. Piensa en una pila de platos. Solo puedes agregar arriba y sacar de arriba. Implementamos `push()`, `pop()` y `peek()`, y de repente entiendes cómo funciona el botón de atrás del navegador, cómo funciona deshacer/rehacer, cómo funcionan las pilas de llamadas de funciones. El concepto que había sido abstracto en Scheme — el call stack creciendo y desenrollándose durante la recursividad — ahora tenía una implementación concreta que podía tocar. Y lo más satisfactorio: ya había *usado* pilas sin saber que las estaba usando — el deshacer/rehacer del Sudoku en POO era literalmente dos `Stack<Model>`. Ahora estaba construyendo la estructura que lo hacía posible, desde cero.

**Colas** — First In, First Out. Una fila en el supermercado. La primera persona en la fila es la primera en ser atendida. Implementamos `enqueue()`, `dequeue()`, y recuerdo la satisfacción de construir la cola sobre la misma clase de lista enlazada que ya habíamos escrito para las pilas. Misma base, diferentes reglas, comportamiento completamente diferente.

```java
public void enqueue(Object dato) {
    NodoLista nuevoNodo = new NodoLista(dato);
    if (isEmpty()) {
        cabeza.setSiguiente(nuevoNodo);
    } else {
        NodoLista actual = cabeza.getSiguiente();
        while (actual.getSiguiente() != null) {
            actual = actual.getSiguiente();
        }
        actual.setSiguiente(nuevoNodo);
    }
}
```

¿Simple? Sí. Pero construir estas estructuras desde cero — sin usar `java.util.Stack` ni `java.util.Queue`, sino implementando cada manipulación de punteros tú mismo — ahí es donde está el verdadero aprendizaje. En POO habíamos usado `LinkedList` de la librería estándar para la agenda de contactos sin pensarlo dos veces. Ahora entendía exactamente qué pasaba dentro de esa clase.

---

## Árboles: donde la cosa se pone interesante

Si las pilas y colas son la entrada, los **árboles binarios** son donde empieza el plato fuerte.

Un árbol binario es un nodo con máximo dos hijos: izquierdo y derecho. Definición simple, complejidad infinita. Nuestra implementación cubría de todo:

- **Recorridos** — preorden, inorden, postorden, por niveles. Cuatro maneras diferentes de visitar cada nodo, cada una útil para diferentes propósitos. Me acuerdo del momento en que entendí que el recorrido inorden de un árbol binario de búsqueda te da la salida ordenada — se sintió como descubrir un secreto.

- **Evaluación de árboles de expresiones** — este fue el proyecto que conectó varios semestres. Construimos un árbol que podía representar expresiones matemáticas como `((5 + 3) * 2)` en una estructura de árbol, y después evaluarlas recorriéndolas de abajo hacia arriba. El mismo concepto que había implementado en Scheme con notación prefija, ahora implementado en Java con objetos y punteros — y con la disciplina de encapsulamiento que había aprendido en POO.

- **Verificación de balance AVL** — verificar si un árbol cumple la propiedad de balance. No implementar rotaciones AVL completas (eso vendría después), pero entender *por qué* importa el balance y *cómo* detectar el desbalance.

- **Comparación de árboles** — algoritmos para verificar si dos árboles son idénticos, si uno es subárbol de otro. Soluciones recursivas elegantes que me hicieron apreciar lo naturalmente que los árboles se mapean al pensamiento recursivo.

Después vinieron los **árboles N-arios** — árboles donde cada nodo puede tener cualquier cantidad de hijos, no solo dos. Los implementamos usando una estructura de punteros padre-hermano-hijo y construimos algoritmos para:

- **Verificación de isomorfismo** — ¿dos árboles son estructuralmente idénticos, sin importar los datos que contienen?
- **Ancestro común más bajo** — dados dos nodos, encontrar su padre compartido más cercano
- **Verificación de estabilidad** — verificar si los valores de los padres siempre son mayores que los de sus hijos

Cada algoritmo era un ejercicio de pensar recursivamente sobre datos jerárquicos. Y cada uno reforzaba algo que había aprendido en Scheme: si puedes resolverlo para un nivel, la recursividad se encarga del resto.

---

## Grafos y la belleza de Dijkstra

Después vinieron los **grafos**, y con ellos, una manera completamente nueva de modelar el mundo.

Un grafo es nodos conectados por aristas. Carreteras entre ciudades. Amistades en una red social. Dependencias entre paquetes de software. Implementamos grafos dirigidos con pesos usando listas de adyacencia — cada vértice mantiene una lista de sus aristas salientes, cada arista lleva un costo.

```java
public class Grafo {
    private ListaVertice listaVertices;

    public void insertarVertice(Object dato) { ... }
    public void insertarArco(Object origen, Object destino, int costo) { ... }
    public boolean existeCamino(Object origen, Object destino) { ... }
}
```

Pero la verdadera estrella del módulo de grafos fue el **algoritmo de Dijkstra para caminos más cortos**. La idea es elegante: empezando desde un nodo origen, progresivamente explorar el camino más barato no explorado hasta haber encontrado la ruta más corta a cada nodo alcanzable.

Me acuerdo implementándolo paso a paso — la tabla de distancias, el conjunto de visitados, la selección greedy del vértice no visitado con costo mínimo — y corriéndolo por primera vez en un grafo pequeño. Viendo al algoritmo encontrar caminos que yo mismo no había visto. Esa fue la primera vez que sentí que había construido algo genuinamente *inteligente*. No solo código que seguía instrucciones, sino código que *descubría* respuestas.

---

## La joya de la corona: un Triqui invencible

Para el proyecto final, construimos algo que unía todas las estructuras de datos: un **juego de Triqui con un oponente de IA que nunca pierde**.

¿El secreto? El **algoritmo Minimax** — un algoritmo de toma de decisiones de la teoría de juegos que considera cada posible estado futuro del juego y elige la jugada óptima.

Así funciona: el programa construye un **árbol N-ario de juego** donde cada nodo es un estado del tablero y cada hijo es un posible siguiente movimiento. Desde cualquier posición, el algoritmo evalúa recursivamente todas las posibles continuaciones:

- Si la computadora gana → puntuación +9
- Si es empate → puntuación 0
- Si el jugador gana → puntuación -9

La computadora elige el movimiento que lleva a la puntuación garantizada más alta. El jugador, siendo el adversario, se asume que elige el movimiento que lleva a la puntuación más baja. Máximo y mínimo, alternando — de ahí, "Minimax."

```java
// Detección de victoria - 8 combinaciones ganadoras posibles
// 3 filas, 3 columnas, 2 diagonales
if ((tablero[0] == jugador && tablero[1] == jugador && tablero[2] == jugador) ||
    (tablero[3] == jugador && tablero[4] == jugador && tablero[5] == jugador) ||
    (tablero[6] == jugador && tablero[7] == jugador && tablero[8] == jugador) ||
    // ... columnas y diagonales
    ) {
    return true;
}
```

¿El resultado? Una IA que **nunca pierde**. No por movimientos preprogramados ni por reconocimiento de patrones, sino porque literalmente considera cada posible futuro y escoge el mejor. No puedes ganarle — lo mejor que puedes lograr es un empate.

Construir esto conectó todo: árboles N-arios para el árbol de juego, recorrido recursivo para evaluar posiciones, la comprensión conceptual de pilas (el call stack de la recursión) y colas (exploración BFS potencial). Cada estructura de datos que habíamos aprendido encontró su lugar.

Lo que lo hacía especial no era solo que funcionara — es que podía entender *por qué* funcionaba. El algoritmo Minimax no es magia. Son solo árboles, recursividad y una función de puntuación. Los mismos bloques fundamentales que habíamos estado estudiando todo el semestre, ensamblados en algo que se sentía como inteligencia.

---

## Mirando hacia atrás

Estructuras de Datos fue la materia que completó una transformación que había empezado semestres atrás. Si Scheme me enseñó a pensar, C me enseñó lo que la máquina hacía de verdad, y [POO me enseñó a diseñar sistemas con arquitectura limpia](/es/blog/oop-java-swing-university-projects/) — entonces Estructuras de Datos me enseñó a *elegir bien*. Elegir la estructura correcta — un árbol en vez de una lista, un grafo en vez de una matriz — cambia todo sobre la elegancia, rendimiento y mantenibilidad de tu solución.

La combinación de POO y Estructuras de Datos fue especialmente poderosa. En POO había aprendido a organizar el *código* — separar responsabilidades, usar patrones, diseñar interfaces limpias. En Estructuras de Datos aprendí a organizar los *datos*. Resulta que las dos cosas son igual de importantes, y la segunda sin la primera produce código eficiente pero imposible de mantener, mientras que la primera sin la segunda produce código bonito pero lento.

Las pilas me enseñaron sobre orden. Los árboles me enseñaron sobre jerarquía. Los grafos me enseñaron sobre conexiones. Y Minimax me enseñó que con la estructura correcta, un programa puede explorar posibilidades mucho más allá de lo que cualquier humano podría trazar en papel — aunque todo esté construido con piezas simples y comprensibles.

Cada clase, interfaz y algoritmo en ese [repositorio](https://github.com/xergioalex/pregrado_estructura_de_datos_java) representa un paso en entender que la computación no se trata solo de instrucciones — se trata de *organización*. Cómo organizas tus datos determina qué preguntas puedes responder. Y la organización correcta puede hacer que lo imposible se sienta trivial.
