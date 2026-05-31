---
title: "Análisis comparativo de algoritmos de ordenamiento"
description: "Un análisis académico sobre complejidad y tiempos de ejecución de algoritmos de ordenamiento, comparando resultados reales en dos servidores."
pubDate: "2018-01-12"
heroImage: "/images/blog/posts/analysis-of-sorting-algorithms/hero.webp"
heroLayout: "banner"
tags: ["tech", "university"]
keywords: ["análisis de algoritmos de ordenamiento", "comparación de algoritmos de sorting en Java", "complejidad algorítmica Big O", "algoritmos de ordenamiento más populares", "rendimiento algoritmos sorting Java", "proyecto universitario algoritmia", "quicksort mergesort comparación"]
---

Como parte de un ejercicio típico de algoritmia en la universidad, hice un pequeño análisis comparativo de los algoritmos de ordenamiento más populares, buscando estudiar la complejidad de cada uno y cómo las diferentes formas de resolver un mismo problema pueden afectar los tiempos de ejecución.

Quiero aclarar que este es solo un análisis académico muy simple que quise documentar, y que tal vez sirva a futuro para otros estudiantes de ciencias de la computación.

Comencé desarrollando un pequeño script en Java que genera números aleatorios de cinco dígitos y los almacena en un archivo de texto, para poder analizar el mismo conjunto de datos entre diferentes algoritmos. El script lo puedes encontrar en este [repositorio](https://github.com/xergioalex/analysisOfSortAlgorithms) y ejecutar de la siguiente forma:

```bash
# Ruta del archivo
> algorithms/java/RandomNumbers.java

# Ejecutar script en Java
$ javac RandomNumbers.java && java RandomNumbers
```

Lo anterior genera el archivo [numbers/numbers.txt](https://github.com/xergioalex/analysisOfSortAlgorithms/blob/master/numbers/numbers.txt) con `n` números aleatorios definidos dentro del script. En mis experimentos llegué a generar un archivo de 1.000.000.000 de datos (cerca de 5 GB), por eso no lo adjunté en el repositorio.

---

## Algoritmos evaluados

En un paso siguiente procedí a implementar algoritmos de ordenamiento populares:

- [Burbuja (Bubble Sort)](https://es.wikipedia.org/wiki/Ordenamiento_de_burbuja): `O(n^2)`
- [Conteo (Counting Sort)](https://es.wikipedia.org/wiki/Ordenamiento_por_cuentas): `O(n+k)`
- [Montones (Heapsort)](https://es.wikipedia.org/wiki/Heapsort): `O(n log n)`
- [Inserción (Insertion Sort)](https://es.wikipedia.org/wiki/Ordenamiento_por_inserci%C3%B3n): `O(n^2)`
- [Mezcla (Merge Sort)](https://es.wikipedia.org/wiki/Ordenamiento_por_mezcla): `O(n log n)`
- [Rápido (Quicksort)](https://es.wikipedia.org/wiki/Quicksort): `O(n log n)`
- [Selección (Selection Sort)](https://es.wikipedia.org/wiki/Ordenamiento_por_selecci%C3%B3n): `O(n^2)`

Para esta tarea seleccioné C y los scripts se encuentran en [`algorithms/c/sortAlgorithms`](https://github.com/xergioalex/analysisOfSortAlgorithms/tree/master/algorithms/c/sortAlgorithms).

---

## Automatización de pruebas

Dado que para hacer un buen análisis se deben correr muchas pruebas, creé un par de scripts para automatizarlas:

```bash
# Script base para ejecutar cualquier algoritmo y generar logs de tiempos
> algorithms/c/benchmark.c

# Correr prueba
# arg1, arg2 => nombre del algoritmo y cantidad de elementos
$ gcc benchmark.c -o benchmark.out && ./benchmark.out arg1 arg2

# Script para correr múltiples pruebas
> algorithms/c/runTest.c

# Correr pruebas
$ gcc runTest.c -o runTest.out && ./runTest.out
```

Con esto ya estaba todo listo. Solo faltaba dejar corriendo `runTest.c` en una máquina. Aunque era un ejercicio académico sin gran rigor científico, procuré usar un pequeño ambiente controlado para evitar ruido por otros procesos.

Para eso creé dos droplets en Digital Ocean:

<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/digital-ocean-droplets.webp" alt="Digital Ocean droplets" loading="lazy" />
  <figcaption>Los dos droplets de DigitalOcean usados como máquinas de benchmark — M1 (1 núcleo, 1 GB RAM) y M2 (2 núcleos, 2 GB RAM).</figcaption>
</figure>

El segundo servidor tenía el doble de recursos, así que en teoría debía rendir mejor.

También configuré Java y C en ambos servidores con este script de aprovisionamiento: [ServerConfig/provision.sh](https://github.com/xergioalex/analysisOfSortAlgorithms/blob/master/severConfig/provision.sh)

```bash
# Base installation
sudo apt-get update -y
sudo apt-get upgrade -y
sudo apt-get install -y build-essential gcc python-dev python-pip python-setuptools

# Git
sudo apt-get install -y git

# Install Java
sudo apt-get install default-jre -y
sudo apt-get install default-jdk -y
sudo apt-get install openjdk-7-jre -y
sudo apt-get install openjdk-7-jdk -y
```

---

## Resultados

En cada máquina se corrieron pruebas con el mismo archivo de números aleatorios, aumentando el tamaño en diferentes intervalos (10, 100, 1.000, 10.000, etc.). Los resultados detallados están en [`results/analysis.ods`](https://github.com/xergioalex/analysisOfSortAlgorithms/blob/master/results/analysis.ods).

Como pausa útil, este fue el truco para dejar el proceso en background sin depender de la sesión:

```bash
$ gcc runTest.c -o runTest.out && ./runTest.out
# Ctrl + z
disown -h %1
bg 1
```

Después de varios días, los experimentos apenas iban por 1.600.000 de datos en los algoritmos `O(n^2)`, así que detuve la ejecución en ambos servidores y empecé el análisis.

M1 = Máquina 1 (1 núcleo, 1GB RAM)  
M2 = Máquina 2 (2 núcleos, 2GB RAM)

### Burbuja (Bubble Sort): O(n^2)

<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/bubble-sort-m1.webp" alt="Bubble Sort M1" loading="lazy" />
  <figcaption>Bubble Sort en Máquina 1 — el tiempo de ejecución crece rápidamente al superar el millón de elementos.</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/bubble-sort-m2.webp" alt="Bubble Sort M2" loading="lazy" />
  <figcaption>Bubble Sort en Máquina 2 — la frecuencia por núcleo más baja (1,8 GHz vs 2,4 GHz) resulta en peor rendimiento a pesar de tener más RAM.</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/bubble-sort-m1-m2.webp" alt="Bubble Sort M1 vs M2" loading="lazy" />
  <figcaption>Bubble Sort M1 vs M2 — el crecimiento cuadrático O(n²) es claramente visible; M1 supera a M2 gracias a su mayor frecuencia de CPU.</figcaption>
</figure>

### Conteo (Counting Sort): O(n+k)

<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/counting-sort-m1.webp" alt="Counting Sort M1" loading="lazy" />
  <figcaption>Counting Sort en Máquina 1 — curva casi plana O(n+k), terminando en milisegundos incluso con 1,6 M de elementos.</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/counting-sort-m2.webp" alt="Counting Sort M2" loading="lazy" />
  <figcaption>Counting Sort en Máquina 2 — crecimiento igualmente plano; la ventaja O(n+k) se mantiene sin importar el nivel de hardware.</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/counting-sort-m1-m2.webp" alt="Counting Sort M1 vs M2" loading="lazy" />
  <figcaption>Counting Sort M1 vs M2 — ambas máquinas muestran tiempos casi idénticos por debajo del milisegundo, confirmando la cota O(n+k).</figcaption>
</figure>

### Montones (Heapsort): O(n log n)

<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/heap-sort-m1.webp" alt="Heap Sort M1" loading="lazy" />
  <figcaption>Heap Sort en Máquina 1 — crecimiento O(n log n), manteniéndose bien por debajo de 2 segundos con 1,6 M de elementos.</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/heap-sort-m2.webp" alt="Heap Sort M2" loading="lazy" />
  <figcaption>Heap Sort en Máquina 2 — rendimiento O(n log n) consistente; ligeramente más lento que M1 por la menor frecuencia de reloj.</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/heap-sort-m1-m2.webp" alt="Heap Sort M1 vs M2" loading="lazy" />
  <figcaption>Heap Sort M1 vs M2 — las curvas superpuestas confirman que en tareas de un solo hilo la frecuencia de CPU es la variable decisiva.</figcaption>
</figure>

### Inserción (Insertion Sort): O(n^2)

<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/insertion-sort-m1.webp" alt="Insertion Sort M1" loading="lazy" />
  <figcaption>Insertion Sort en Máquina 1 — curva O(n²) más pronunciada que Selection Sort, pero muy por debajo de Bubble Sort.</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/insertion-sort-m2.webp" alt="Insertion Sort M2" loading="lazy" />
  <figcaption>Insertion Sort en Máquina 2 — la menor velocidad por núcleo hace más evidente la penalización O(n²) con entradas grandes.</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/insertion-sort-m1-m2.webp" alt="Insertion Sort M1 vs M2" loading="lazy" />
  <figcaption>Insertion Sort M1 vs M2 — M1 lidera en todo momento, reforzando que la frecuencia de reloj domina en algoritmos secuenciales.</figcaption>
</figure>

### Mezcla (Merge Sort): O(n log n)

<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/merge-sort-m1.webp" alt="Merge Sort M1" loading="lazy" />
  <figcaption>Merge Sort en Máquina 1 — curva O(n log n) estable, competitiva con Heap Sort y Quicksort.</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/merge-sort-m2.webp" alt="Merge Sort M2" loading="lazy" />
  <figcaption>Merge Sort en Máquina 2 — rendimiento consistente; la RAM adicional puede ayudar con las asignaciones de memoria que requiere este algoritmo.</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/merge-sort-m1-m2.webp" alt="Merge Sort M1 vs M2" loading="lazy" />
  <figcaption>Merge Sort M1 vs M2 — los resultados son cercanos, mostrando que el uso de memoria del algoritmo puede compensar parcialmente la diferencia de frecuencia de CPU.</figcaption>
</figure>

### Rápido (Quicksort): O(n log n)

<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/quick-sort-m1.webp" alt="Quick Sort M1" loading="lazy" />
  <figcaption>Quicksort en Máquina 1 — segundo más rápido en general, manteniéndose consistentemente por debajo de 0,5 segundos hasta 1,6 M de elementos.</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/quick-sort-m2.webp" alt="Quick Sort M2" loading="lazy" />
  <figcaption>Quicksort en Máquina 2 — ligeramente más lento que M1, pero sigue dentro del grupo rápido O(n log n).</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/quick-sort-m1-m2.webp" alt="Quick Sort M1 vs M2" loading="lazy" />
  <figcaption>Quicksort M1 vs M2 — ambas máquinas se comportan de forma similar, confirmando la eficiencia práctica de Quicksort con datos aleatorios.</figcaption>
</figure>

### Selección (Selection Sort): O(n^2)

<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/selection-sort-m1.webp" alt="Selection Sort M1" loading="lazy" />
  <figcaption>Selection Sort en Máquina 1 — crecimiento O(n²), más rápido que Bubble Sort pero muy por detrás del grupo O(n log n).</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/selection-sort-m2.webp" alt="Selection Sort M2" loading="lazy" />
  <figcaption>Selection Sort en Máquina 2 — escalado cuadrático similar; menos intercambios que Bubble Sort pero la misma cota asintótica.</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/selection-sort-m1-m2.webp" alt="Selection Sort M1 vs M2" loading="lazy" />
  <figcaption>Selection Sort M1 vs M2 — M1 consistentemente más rápido; la ventaja de frecuencia de reloj es el factor decisivo en trabajo O(n²) de un solo hilo.</figcaption>
</figure>

### Gráfica comparativa de todos los algoritmos

<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/all-algorithms-m1.webp" alt="All algorithms M1" loading="lazy" />
  <figcaption>Los siete algoritmos en Máquina 1 — el grupo O(n²) domina la escala; el grupo rápido se agrupa cerca del eje x.</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/all-algorithms-m2.webp" alt="All algorithms M2" loading="lazy" />
  <figcaption>Los siete algoritmos en Máquina 2 — el mismo patrón que M1; la curva de Bubble Sort eclipsa a todo lo demás.</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/all-algorithms-m1-m2.webp" alt="All algorithms M1 vs M2" loading="lazy" />
  <figcaption>Todos los algoritmos en ambas máquinas — la mayor frecuencia de reloj de M1 la mantiene más rápida a pesar del mayor número de núcleos y RAM de M2.</figcaption>
</figure>

En esa comparativa, los cuatro algoritmos rápidos (`quickSort`, `mergeSort`, `heapSort`, `countingSort`) se solapan por escala. El perdedor claro fue `bubbleSort`, seguido por `insertionSort` y `selectionSort`.

Esto refleja un reto clásico en computación: para un mismo problema hay muchas soluciones, pero cada una funciona mejor bajo condiciones concretas.

---

## Tiempos de respuesta (últimos 7 puntos)

### Máquina 1 (M1)

| Size | BubbleSort | CountingSort | HeapSort | InsertionSort | MergeSort | QuickSort | SelectionSort |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1,000,000 | 5584.254499 | 0.016609 | 0.747395 | 2592.498977 | 0.704281 | 0.291499 | 1935.487457 |
| 1,100,000 | 6637.222252 | 0.019187 | 0.925764 | 3171.445715 | 0.653455 | 0.471039 | 2269.966268 |
| 1,200,000 | 8045.953682 | 0.023652 | 0.913537 | 3722.638885 | 0.513099 | 0.239454 | 2783.279525 |
| 1,300,000 | 10169.383378 | 0.045208 | 0.713308 | 4824.250285 | 0.575149 | 0.261289 | 3514.914589 |
| 1,400,000 | 12053.658798 | 0.034613 | 1.489084 | 5658.739951 | 0.676112 | 0.279478 | 4066.729922 |
| 1,500,000 | 13798.854123 | 0.027525 | 1.094257 | 6555.365499 | 0.743651 | 0.315602 | 4839.340426 |
| 1,600,000 | 15205.680544 | 0.028478 | 0.996648 | 6794.512119 | 0.725347 | 0.325990 | 5056.213092 |

### Máquina 2 (M2)

| Size | BubbleSort | CountingSort | HeapSort | InsertionSort | MergeSort | QuickSort | SelectionSort |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1,000,000 | 7069.317038 | 0.032415 | 0.752168 | 3178.694237 | 0.558200 | 0.315689 | 2454.531144 |
| 1,100,000 | 8458.150387 | 0.024157 | 0.842038 | 3666.359787 | 0.557481 | 0.284579 | 2804.449695 |
| 1,200,000 | 9495.898708 | 0.026530 | 0.882819 | 4084.581924 | 0.616636 | 0.358502 | 3081.748250 |
| 1,300,000 | 10626.023771 | 0.027309 | 0.913814 | 4933.201883 | 0.753890 | 0.401456 | 3912.714921 |
| 1,400,000 | 13439.250082 | 0.030009 | 1.061221 | 5790.797804 | 0.633180 | 0.442449 | 4066.729922 |
| 1,500,000 | 15102.736592 | 0.031826 | 1.064744 | 6565.630358 | 0.788551 | 0.400238 | 5114.565289 |
| 1,600,000 | 16483.694808 | 0.039298 | 1.365129 | 7311.347004 | 0.760618 | 0.449284 | 5676.768371 |

---

## Algoritmos rápidos

Al graficar solo los algoritmos eficientes (`quickSort`, `mergeSort`, `heapSort`, `countingSort`), casi ninguno superó 1 segundo con 1.600.000 datos.

<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/fastest-algorithms-m1.webp" alt="Comparación de algoritmos de ordenamiento más rápidos — resultados de benchmark Máquina 1" loading="lazy" />
  <figcaption>Algoritmos rápidos en Máquina 1 — Counting Sort lidera con tiempo casi nulo; Quicksort y Heap Sort le siguen de cerca.</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/fastest-algorithms-m2.webp" alt="Comparación de algoritmos de ordenamiento más rápidos — resultados de benchmark Máquina 2" loading="lazy" />
  <figcaption>Algoritmos rápidos en Máquina 2 — Counting Sort sigue dominando; se nota un ligero incremento en Heap Sort con tamaños grandes.</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/fastest-algorithms-m1-m2.webp" alt="Comparación de algoritmos de ordenamiento más rápidos — Máquina 1 vs Máquina 2 lado a lado" loading="lazy" />
  <figcaption>Algoritmos rápidos lado a lado en ambas máquinas — la diferencia de rendimiento entre algoritmos supera la diferencia de hardware.</figcaption>
</figure>

El ganador fue `countingSort` (`O(n+k)`), pero no es una bala de plata:

- Solo funciona con enteros.
- Puede consumir mucha memoria si `máximo - mínimo` es grande.

En segundo lugar quedó `quickSort`, muy usado en práctica, aunque puede degradar a `O(n^2)` con mala selección de pivote y distribuciones adversas.

---

## Máquina 1 vs Máquina 2

Surgió una pregunta importante: ¿cómo puede M1 vencer a M2 en tiempos si M2 tiene el doble de recursos?

La clave es que los algoritmos no estaban paralelizados. Aunque M2 tiene dos núcleos, el código no usaba hilos para explotarlos realmente.

Eso deja la comparación más ligada a frecuencia de CPU por núcleo:

- M1: `2399.998 MHz`
- M2: `1799.998 MHz`

### Información del sistema

<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/architecture-m1.webp" alt="Arquitectura del sistema de la Máquina 1 de benchmark — especificaciones del droplet de DigitalOcean" loading="lazy" />
  <figcaption>Especificaciones de Máquina 1 con <code>lscpu</code>: 1 núcleo a 2399.998 MHz — la mayor frecuencia de reloj compensó el menor número de recursos.</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/architecture-m2.webp" alt="Arquitectura del sistema de la Máquina 2 de benchmark — especificaciones del droplet de DigitalOcean" loading="lazy" />
  <figcaption>Especificaciones de Máquina 2 con <code>lscpu</code>: 2 núcleos a 1799.998 MHz — más núcleos y RAM, pero menor frecuencia por núcleo.</figcaption>
</figure>

Las unidades de frecuencia:

- 1 Hertz (Hz) = un ciclo/segundo
- 1 Kilohertz (KHz) = 1024 Hz
- 1 Megahertz (MHz) = 1024 KHz
- 1 Gigahertz (GHz) = 1024 MHz
- 1 Terahertz (THz) = 1024 GHz

Comando usado para inspeccionar CPU:

```bash
$ lscpu
```

---

## Prueba extendida (máxima capacidad por memoria)

Luego extendí el experimento enfocándome en algoritmos eficientes para ver cuánto soportaban las máquinas por memoria disponible:

<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/fastest-algorithms-memory-test-m1.webp" alt="Algoritmos rápidos a máxima capacidad de memoria — resultados de benchmark Máquina 1" loading="lazy" />
  <figcaption>Algoritmos rápidos llevados al límite de memoria de M1 — las curvas se separan a medida que el tamaño del dataset se acerca a la RAM disponible.</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/fastest-algorithms-memory-test-m2.webp" alt="Algoritmos rápidos a máxima capacidad de memoria — resultados de benchmark Máquina 2" loading="lazy" />
  <figcaption>Algoritmos rápidos en el techo de memoria de M2 — la RAM adicional extiende el rango viable del dataset antes de que aparezca la degradación.</figcaption>
</figure>

Aquí M2 (2GB RAM) sí logró procesar más volumen en varios casos.

### Counting Sort hasta máximo volumen

<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/counting-sort-max-memory-m1.webp" alt="Counting Sort a máxima escala de memoria — resultados de benchmark Máquina 1" loading="lazy" />
  <figcaption>Counting Sort a máxima escala en M1 — sigue siendo casi lineal, pero las restricciones de memoria limitan el techo práctico.</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/counting-sort-max-memory-m2.webp" alt="Counting Sort a máxima escala de memoria — resultados de benchmark Máquina 2" loading="lazy" />
  <figcaption>Counting Sort a máxima escala en M2 — la RAM adicional le permite manejar rangos de enteros más grandes antes de alcanzar su cota de memoria.</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/counting-sort-max-memory-m1-m2.webp" alt="Counting Sort a máxima escala de memoria — comparación Máquina 1 vs Máquina 2" loading="lazy" />
  <figcaption>Counting Sort M1 vs M2 a máxima escala — la RAM adicional de M2 proporciona una ventaja clara con datasets de enteros grandes.</figcaption>
</figure>

### Heap Sort hasta máximo volumen

<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/heap-sort-max-memory-m1.webp" alt="Heap Sort a máxima escala de memoria — resultados de benchmark Máquina 1" loading="lazy" />
  <figcaption>Heap Sort a máxima escala en M1 — la curva O(n log n) se mantiene bien comportada incluso con datasets muy grandes.</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/heap-sort-max-memory-m2.webp" alt="Heap Sort a máxima escala de memoria — resultados de benchmark Máquina 2" loading="lazy" />
  <figcaption>Heap Sort a máxima escala en M2 — ligeramente más lento que M1 pero estable; el ordenamiento in-place mantiene el uso de memoria bajo.</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/heap-sort-max-memory-m1-m2.webp" alt="Heap Sort a máxima escala de memoria — comparación Máquina 1 vs Máquina 2" loading="lazy" />
  <figcaption>Heap Sort M1 vs M2 a máxima escala — la brecha por frecuencia de CPU se amplía ligeramente con entradas más grandes.</figcaption>
</figure>

### Merge Sort hasta máximo volumen

<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/merge-sort-max-memory-m1.webp" alt="Merge Sort a máxima escala de memoria — resultados de benchmark Máquina 1" loading="lazy" />
  <figcaption>Merge Sort a máxima escala en M1 — las asignaciones de memoria auxiliar se hacen perceptibles con entradas muy grandes.</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/merge-sort-max-memory-m2.webp" alt="Merge Sort a máxima escala de memoria — resultados de benchmark Máquina 2" loading="lazy" />
  <figcaption>Merge Sort a máxima escala en M2 — la RAM adicional reduce la presión de memoria, manteniendo la curva comparativamente suave.</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/merge-sort-max-memory-m1-m2.webp" alt="Merge Sort a máxima escala de memoria — comparación Máquina 1 vs Máquina 2" loading="lazy" />
  <figcaption>Merge Sort M1 vs M2 a máxima escala — la RAM extra de M2 ayuda a compensar la menor frecuencia de reloj en este algoritmo intensivo en memoria.</figcaption>
</figure>

### Quick Sort hasta máximo volumen

<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/quick-sort-max-memory-m1.webp" alt="Quick Sort a máxima escala de memoria — resultados de benchmark Máquina 1" loading="lazy" />
  <figcaption>Quicksort a máxima escala en M1 — sigue entre los más rápidos; su diseño in-place mantiene la sobrecarga de memoria al mínimo.</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/quick-sort-max-memory-m2.webp" alt="Quick Sort a máxima escala de memoria — resultados de benchmark Máquina 2" loading="lazy" />
  <figcaption>Quicksort a máxima escala en M2 — comparable a M1; la entrada aleatoria evita la degradación al caso peor O(n²).</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/quick-sort-max-memory-m1-m2.webp" alt="Quick Sort a máxima escala de memoria — comparación Máquina 1 vs Máquina 2" loading="lazy" />
  <figcaption>Quicksort M1 vs M2 a máxima escala — las curvas casi se superponen; ninguna máquina obtiene una ventaja decisiva.</figcaption>
</figure>

### Comparativa final de algoritmos eficientes

<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/all-algorithms-max-memory-m1.webp" alt="Todos los algoritmos rápidos a máxima escala de memoria — resultados de benchmark Máquina 1" loading="lazy" />
  <figcaption>Todos los algoritmos rápidos en el techo de memoria de M1 — las curvas se separan claramente, revelando el orden práctico: Counting, Quick, Merge, Heap.</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/all-algorithms-max-memory-m2.webp" alt="Todos los algoritmos rápidos a máxima escala de memoria — resultados de benchmark Máquina 2" loading="lazy" />
  <figcaption>Todos los algoritmos rápidos en el techo de memoria de M2 — la RAM adicional permite extender la comparación antes de que los resultados pierdan fiabilidad.</figcaption>
</figure>
<figure>
  <img src="/images/blog/posts/analysis-of-sorting-algorithms/all-algorithms-max-memory-m1-m2.webp" alt="Todos los algoritmos rápidos a máxima escala de memoria — comparación Máquina 1 vs Máquina 2" loading="lazy" />
  <figcaption>Comparativa final a máxima escala en ambas máquinas — el comportamiento se alinea con la complejidad teórica para valores grandes de n.</figcaption>
</figure>

Al extender el experimento con mayor volumen de datos, las curvas se volvieron más uniformes y comparables con sus funciones de complejidad teórica.

---

## Conclusiones

Este ejercicio me ayudó a reforzar varias ideas:

- Complejidad algorítmica importa, pero no cuenta toda la historia.
- El hardware influye según el tipo de algoritmo y su uso real de recursos.
- Más RAM no siempre acelera, pero puede ampliar el límite de datos procesables.
- Paralelismo real requiere diseño explícito (hilos, partición de trabajo, etc.).

Espero que este análisis le sirva a quien está empezando en ciencias de la computación o quiere repasar fundamentos.

Recursos: [Repositorio con código en GitHub](https://github.com/xergioalex/analysisOfSortAlgorithms)

---

> "La inteligencia consiste no solo en el conocimiento, sino también en la destreza de aplicar los conocimientos en la práctica."  
> **Aristóteles**
