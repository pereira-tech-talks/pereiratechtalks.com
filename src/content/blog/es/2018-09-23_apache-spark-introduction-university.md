---
title: "Domando el Big Data: Introducción a Apache Spark"
description: "De RDDs a streaming: notebooks, clúster Docker y presentación para enseñar Apache Spark en mi proyecto final universitario de Big Data."
pubDate: "2018-09-23"
heroImage: "/images/blog/posts/apache-spark-introduction-university/hero.webp"
heroLayout: "side-by-side"
tags: ["tech", "talks", "python", "university", "docker"]
keywords: ["introducción a Apache Spark", "qué es Apache Spark", "Big Data con Apache Spark", "RDDs y DataFrames en Spark", "clúster Docker con Apache Spark", "streaming en tiempo real con Spark", "Apache Spark con Python"]
---

Para cuando llegué al curso de Big Data en mi maestría, ya tenía una base sólida en múltiples paradigmas de programación. Cada uno me dio una lente diferente para pensar sobre la computación.

Pero ninguno me preparó para el problema de escala. ¿Qué pasa cuando tus datos no caben en la memoria de una sola máquina? ¿Cuando una sola CPU no puede procesar tu dataset antes de que llegue el siguiente? ¿Cuando necesitas coordinar cientos de máquinas para responder una sola consulta?

Ese es el territorio que Apache Spark ocupa. Y para mi proyecto final de Big Data, no solo lo estudié — construí un recurso completo de enseñanza: una presentación con slides, Jupyter notebooks interactivos cubriendo todo el ecosistema de Spark, y un clúster basado en Docker para que cualquiera pudiera ejecutar los ejemplos en su propia máquina. El objetivo era hacer lo abstracto concreto — tomar un framework diseñado para clústeres de cientos de máquinas y hacerlo accesible desde un portátil.

---

## La charla

La presentación cubrió Apache Spark desde cero. Quería que mis compañeros salieran no solo entendiendo qué hace Spark, sino siendo capaces de escribir y ejecutar programas Spark por sí mismos. Los [slides de la presentación](https://docs.google.com/presentation/d/189cQ15l-3ZmmDfHcgc69W_qZONEIb44zJXTlwwe_R-c/edit) proporcionaron el marco teórico, pero el aprendizaje real ocurrió en los notebooks.

Estructuré el material como un recorrido progresivo a través de Jupyter notebooks, cada uno construyendo sobre el anterior. El [repositorio complementario](https://github.com/xergioalex/apache-spark-introduction) contiene todo: los notebooks, los archivos de datos y una configuración Docker para levantar un clúster Spark local. La idea era que cualquiera pudiera clonar el repositorio y empezar a experimentar inmediatamente.

El libro de referencia del curso fue "Learning Spark" de Karau, Konwinski, Wendell y Zaharia (O'Reilly, 2015) — todavía una de las mejores introducciones al framework.

---

## ¿Qué es Apache Spark?

Apache Spark comenzó en 2009 en el AMPLab de UC Berkeley como proyecto de investigación. Se liberó como código abierto en 2010, se transfirió a la Apache Software Foundation en 2013 y se convirtió en Proyecto de Nivel Superior en febrero de 2014. La versión 1.0 salió en mayo de 2014. Para cuando yo lo estaba estudiando, Spark ya se había convertido en el estándar de facto para procesamiento de datos a gran escala.

La promesa central es simple: tomar el modelo de computación distribuida de MapReduce y hacerlo más rápido. Spark logra aceleraciones de 10-20x sobre Hadoop MapReduce para aplicaciones complejas, principalmente manteniendo los datos en memoria entre operaciones en lugar de escribir a disco después de cada paso.

La arquitectura sigue un patrón maestro-trabajador. Un programa **driver** crea un **SparkContext** — la conexión al clúster. El SparkContext se comunica con un **cluster manager** (YARN, Mesos o el gestor standalone de Spark), que asigna recursos entre procesos **executor** en los nodos trabajadores. Cada executor ejecuta tareas y almacena datos en memoria.

Lo que hace a Spark particularmente poderoso es su stack unificado. Sobre el motor central se ubican cuatro librerías: **Spark SQL** para datos estructurados, **Spark Streaming** para procesamiento en tiempo real, **MLlib** para machine learning y **GraphX** para computación sobre grafos. Un motor, cuatro casos de uso, y todos comparten la misma abstracción subyacente.

---

## Los RDDs — la base

Todo en Spark comienza con el **Resilient Distributed Dataset (RDD)**. Un RDD es una colección inmutable y distribuida de elementos que puede operarse en paralelo. No escribes ciclos para procesar datos — declaras transformaciones, y Spark se encarga de distribuir el trabajo a través del clúster.

Dos cosas hacen especiales a los RDDs. Primero, tienen **evaluación perezosa**: las transformaciones no se ejecutan inmediatamente. En su lugar, Spark construye un grafo acíclico dirigido (DAG) de operaciones y solo ejecuta cuando llamas una acción que necesita un resultado. Segundo, son **resilientes**: si una partición se pierde por fallo de un nodo, Spark puede reconstruirla reproduciendo las transformaciones desde los datos originales.

Usé el Quijote como dataset para los primeros notebooks — una elección divertida para una audiencia hispanohablante. Así luce trabajar con RDDs:

```python
# Crear un RDD desde un archivo de texto
rdd = sc.textFile("data/quijote.txt")

# Contar palabras usando transformaciones y acciones
words = rdd.flatMap(lambda line: line.split(" "))
word_counts = words.map(lambda word: (word, 1)).reduceByKey(lambda a, b: a + b)
top_words = word_counts.takeOrdered(5, key=lambda x: -x[1])
```

Ese es el patrón MapReduce destilado: `flatMap` divide líneas en palabras, `map` crea pares clave-valor, y `reduceByKey` agrega por clave — todo distribuido automáticamente a través del clúster.

Los notebooks profundizaron en transformaciones — `map`, `filter`, `flatMap`, `union`, `intersection`, `subtract`, `cartesian` — y acciones — `reduce`, `fold`, `aggregate`, `collect`, `count`, `take`, `top`. Luego vinieron los RDDs de pares clave-valor con sus operaciones especializadas: `reduceByKey`, `groupByKey`, `combineByKey` para calcular promedios, y los cuatro tipos de join — inner, left outer, right outer y full outer.

---

## Más allá de lo básico

Una vez que los fundamentos estaban sólidos, los notebooks avanzaron a territorio más complejo.

**Los RDDs numéricos** mostraron cómo Spark tiene funciones estadísticas incorporadas. Generé valores aleatorios de una distribución normal y calculé estadísticas — media, desviación estándar, varianza — en una sola llamada. Luego usé la regla de las 3 sigmas para detectar outliers y visualicé la distribución con histogramas de matplotlib.

El ejemplo más interesante fue analizar datos de patentes de Estados Unidos de 1963 a 1999. Usando `reduceByKey` para contar patentes por año se reveló una clara tendencia ascendente visualizada como gráfico de barras.

```python
# Análisis de patentes de EE.UU.
patents = sc.textFile("data/apat63_99.txt")
us_patents = patents.filter(lambda line: '"US"' in line)
by_year = us_patents.map(lambda line: (line.split(",")[1], 1))
counts = by_year.reduceByKey(lambda a, b: a + b)
```

**Persistencia y particionado** abordaron una preocupación crítica de rendimiento: por defecto, Spark recalcula toda la cadena de transformaciones cada vez que llamas una acción. Para algoritmos iterativos — machine learning, procesamiento de grafos — eso es prohibitivamente costoso. La solución es `cache()` o `persist()` con seis niveles de almacenamiento que van desde `MEMORY_ONLY` hasta `DISK_ONLY` pasando por `OFF_HEAP`, cada uno intercambiando velocidad por uso de memoria y tolerancia a fallos.

**La lectura y escritura de archivos** demostró la flexibilidad de Spark con fuentes de datos. Lo más destacado fue leer libros comprimidos del Proyecto Gutenberg usando `wholeTextFiles`, que devuelve cada archivo como un solo par clave-valor (nombre → contenido), y luego contar las palabras por libro — con conteos variables dependiendo del libro.

---

## Montando un clúster real

La teoría es una cosa. Ejecutar Spark en un clúster real es otra.

Construí un clúster basado en Docker usando las imágenes de la comunidad Big Data Europe, lo que hizo posible que cualquiera levantara un entorno Spark multinodo sin instalación manual. La configuración era directa con docker-compose:

```yaml
version: "2"
services:
  spark-master:
    image: bde2020/spark-master:2.3.1-hadoop2.7
    ports:
      - "8090:8080"
      - "7077:7077"
  spark-worker-1:
    image: bde2020/spark-worker:2.3.1-hadoop2.7
    environment:
      - SPARK_MASTER=spark://spark-master:7077
  spark-worker-2:
    image: bde2020/spark-worker:2.3.1-hadoop2.7
    environment:
      - SPARK_MASTER=spark://spark-master:7077
  spark-worker-3:
    image: bde2020/spark-worker:2.3.1-hadoop2.7
    environment:
      - SPARK_MASTER=spark://spark-master:7077
```

Un nodo maestro coordinando tres trabajadores, todos conectados a través del protocolo nativo de Spark en el puerto 7077. La interfaz web del maestro en el puerto 8090 permitía monitorear jobs, stages y executors en tiempo real.

Para desplegar aplicaciones, `spark-submit` es la herramienta estándar:

```bash
spark-submit --master spark://spark-master:7077 \
  --executor-memory 512m \
  --num-executors 3 \
  myscript.py
```

El notebook también cubrió la integración con YARN — tanto en modo cliente (driver ejecuta localmente) como en modo clúster (driver ejecuta en el clúster) — y tres formas de configurar Spark: programáticamente con objetos SparkConf, mediante flags de línea de comandos, o a través de archivos de propiedades externos.

---

## Las librerías del ecosistema

Los notebooks finales cubrieron las librerías que hacen de Spark algo más que un reemplazo de MapReduce.

### Spark SQL

Spark SQL introdujo los **DataFrames** — colecciones distribuidas de columnas con nombre, conceptualmente similares a tablas de base de datos o DataFrames de Pandas. La clave es que los DataFrames llevan información de esquema, lo que permite al optimizador de consultas **Catalyst** y al motor de ejecución **Tungsten** producir planes de ejecución dramáticamente más rápidos que las operaciones sobre RDDs puros.

```python
from pyspark.sql import SQLContext

sqlContext = SQLContext(sc)
df = sqlContext.read.json("data/gente.json")
df.show()
# +----+-------+
# |edad| nombre|
# +----+-------+
# |  17|  Celia|
# |  53|   Juan|
# |  39|Manuela|
# |  17|    Ana|
# +----+-------+
```

Cargar JSON, ejecutar consultas SQL y hacer joins de datasets — todo con el optimizador trabajando detrás de escena. Los DataFrames se posicionaron como el eventual reemplazo de los RDDs puros, y la historia les dio la razón.

### GraphX

GraphX maneja computación paralela sobre grafos. La abstracción principal es un multigrafo dirigido con propiedades en vértices y aristas. Lo demostré con un grafo de la familia Simpson — Homer, Marge, Bart y Milhouse conectados por relaciones como "padre", "madre", "casado con" y "amigo".

Una limitación importante en ese momento: GraphX solo estaba disponible en Scala, no en PySpark. Así que este fue el único notebook donde cambiamos de lenguaje — una buena excusa para mostrar también la sintaxis de Scala.

### Spark ML

La librería de machine learning de Spark viene en dos sabores: `spark.mllib` (la API original basada en RDDs) y `spark.ml` (la API más nueva basada en DataFrames). El ejemplo de clustering con KMeans hizo tangible el concepto:

```python
from pyspark.mllib.clustering import KMeans
from pyspark.mllib.linalg import SparseVector

data = sc.parallelize([
    SparseVector(3, {1: 1.2}),
    SparseVector(3, {1: 1.1}),
    SparseVector(3, {0: 0.9, 2: 1.0}),
    SparseVector(3, {0: 1.0, 2: 1.1})
])

model = KMeans.train(data, k=2, initializationMode="k-means||")
print(model.clusterCenters)
# [array([0.0, 1.15, 0.0]), array([0.95, 0.0, 1.05])]
```

Los vectores dispersos se separaron limpiamente en dos clústeres. El modelo podía luego predecir nuevos puntos y guardarse en disco para uso posterior — el pipeline completo de ML desde entrenamiento hasta despliegue.

### Spark Streaming

El último notebook abordó el procesamiento de datos en tiempo real con **DStreams** (streams discretizados). Spark Streaming usa una arquitectura de micro-lotes: los datos entrantes se agrupan en lotes a intervalos regulares, cada lote se convierte en un RDD, y todo el poder del motor de Spark los procesa.

Construí dos versiones de un contador de palabras por red leyendo desde un socket TCP:

- **Sin estado:** Cada lote contaba palabras independientemente usando `reduceByKey` — sin memoria entre lotes.
- **Con estado:** Usando `updateStateByKey` con checkpointing, los conteos de palabras se acumulaban entre lotes, construyendo un total acumulativo a lo largo del tiempo.

La diferencia entre esos dos enfoques captura algo fundamental del procesamiento de streams: ¿necesitas recordar lo que pasó antes, o cada ventana es autosuficiente?

---

## Lo que aprendí

Preparar esta charla me enseñó tanto como cualquier clase magistral. Cuando tienes que explicar algo a otros — y hacerlo funcionar en vivo en notebooks — no puedes esconderte detrás de un entendimiento vago. Cada concepto tenía que ser lo suficientemente concreto para demostrarlo.

Algunas cosas destacaron:

**La abstracción es el logro.** La genialidad de Spark no está en ningún algoritmo particular — está en esconder la complejidad de los sistemas distribuidos detrás de una interfaz de programación familiar. Escribes `rdd.map(f).filter(g).reduce(h)` y Spark se encarga del particionado, el shuffling, la tolerancia a fallos y la planificación a través del clúster. La distancia entre escribir un programa local y uno distribuido se reduce drásticamente.

**La evaluación perezosa cambia tu forma de pensar.** Cuando las transformaciones no se ejecutan inmediatamente, empiezas a pensar en la computación como un grafo de dependencias en vez de una secuencia de pasos. El optimizador del DAG puede reordenar, combinar y eliminar operaciones de maneras que nunca harías manualmente. Describes lo que quieres; el motor decide cómo obtenerlo.

**El stack unificado importa.** Antes de Spark, hacer consultas SQL, machine learning, procesamiento de grafos y procesamiento de streams significaba ejecutar cuatro sistemas diferentes. Spark los pone todos en el mismo motor, con las mismas abstracciones de datos. Eso no es solo conveniencia — elimina el movimiento de datos y la conversión de formatos que dominaban las arquitecturas de big data antes de Spark.

**Lo práctico gana a los slides.** Los notebooks fueron la parte más valiosa del proyecto. Los slides explican conceptos; los notebooks te dejan experimentar. Cambiar un parámetro, agregar una transformación, observar cómo cambia la salida — ahí es donde se forma la comprensión. Cada charla futura que di llevó esta lección.

---

## Mirando atrás

Este proyecto llegó en un buen momento de mi camino de aprendizaje. Había construido suficiente base en paradigmas de programación para apreciar lo que Spark estaba haciendo diferente. Los conceptos funcionales — map, filter, reduce — eran literalmente los bloques de construcción de las operaciones sobre RDDs. Los conceptos de sistemas distribuidos eran nuevos, pero los patrones de programación eran familiares.

Apache Spark me mostró que las ideas de la programación en una sola máquina no desaparecen a escala — se transforman. Map sigue siendo map. Reduce sigue siendo reduce. La diferencia es que están ejecutándose a través de un clúster, y hay un motor entre tu código y el hardware que maneja toda la complejidad en la que preferirías no pensar.

El framework seguirá evolucionando, pero los conceptos fundamentales siguen siendo los mismos. RDDs, evaluación perezosa, el scheduler DAG, el stack unificado. Entender esas bases hará que cada nueva versión sea más fácil de comprender.

A seguir construyendo.

---

## Recursos

- [Introducción a Apache Spark — Jupyter notebooks, clúster Docker y archivos de datos (GitHub)](https://github.com/xergioalex/apache-spark-introduction)
- [Slides de la presentación — Introducción a Apache Spark](https://docs.google.com/presentation/d/189cQ15l-3ZmmDfHcgc69W_qZONEIb44zJXTlwwe_R-c/edit)
- "Learning Spark" de Karau, Konwinski, Wendell & Zaharia (O'Reilly, 2015)
