---
title: 'Introducción a TensorFlow'
description: 'Mi charla en el primer meetup de Pereira Tech Talks — explorando TensorFlow de Google, fundamentos de machine learning, y por qué la IA estaba a punto de cambiarlo todo.'
pubDate: '2017-10-18'
heroImage: '/images/blog/posts/tensorflow/pereira-tech-talks-first-meetup.webp'
heroLayout: 'banner'
tags: ["talks", "tech", "ai", "python"]
keywords: ["introducción a TensorFlow", "machine learning con Python", "redes neuronales para principiantes", "TensorFlow desde cero", "deep learning fundamentos", "Pereira Tech Talks IA", "inteligencia artificial con TensorFlow"]
---

Octubre de 2017 fue un hito para la comunidad tech de Pereira. Después de meses de planeación, lanzamos el **primer meetup oficial de Pereira Tech Talks**. El lugar estaba lleno — desarrolladores, estudiantes, emprendedores, todos curiosos sobre el futuro de la tecnología. Dos charlas esa noche: Manuel Pineda sobre AirFlow (orquestación de flujos de trabajo para pipelines de datos), y yo sobre TensorFlow.

Elegí TensorFlow porque estaba obsesionado con él. Google había liberado la biblioteca como código abierto un par de años antes, y estaba empezando a impulsar todo — reconocimiento de imágenes, traducción de idiomas, motores de recomendación. Había estado experimentando con ella por unos meses, leyendo papers, corriendo tutoriales, y tratando de entender cómo funcionaban realmente las redes neuronales.

Pero aquí está la cosa: no me consideraba un experto en IA. Era un ingeniero de software tratando de entender un campo que se sentía tanto intimidante como emocionante. Eso es exactamente por qué quería dar la charla. Si podía descomponerlo en algo comprensible para mí, tal vez podría ayudar a otros a empezar también.

El objetivo era simple: explicar qué es TensorFlow, por qué importa, y mostrarle a la gente cómo dar el primer paso.

---

## ¿Por Qué TensorFlow?

[TensorFlow](https://www.tensorflow.org/) es la biblioteca de machine learning de código abierto de Google. Google la usa a través de su infraestructura — en búsqueda, en Google Photos, en traducción de idiomas. Está diseñada para construir modelos con redes neuronales usando un modelo de programación de flujo de datos.

En ese momento, TensorFlow era el framework de ML más popular del mundo. No era el más fácil (PyTorch estaba ganando tracción para investigación), pero era el más listo para producción. Si querías construir algo que escalara a millones de usuarios, TensorFlow era la respuesta.

Lo que me fascinaba era el modelo de programación. En lugar de escribir código procedural que se ejecuta línea por línea, defines un grafo computacional: los nodos representan operaciones (sumar, multiplicar, operaciones matriciales), y las aristas representan el flujo de datos (tensores). Luego TensorFlow optimiza y ejecuta ese grafo.

Es declarativo, no imperativo. Describes qué quieres computar, y TensorFlow descubre cómo hacerlo eficientemente — distribuyendo a través de GPUs, paralelizando operaciones, y optimizando el uso de memoria. Ese cambio de pensamiento fue difícil al principio, pero una vez que hizo clic, se sintió poderoso.

---

## Lo que cubrí

La charla estaba estructurada como una introducción — sin conocimiento previo de machine learning asumido. Empecé con la historia detrás de TensorFlow: por qué Google lo hizo código abierto, cómo evolucionó de un sistema interno llamado DistBelief, y qué problemas estaba diseñado para resolver.

Luego me sumergí en los conceptos centrales:

### Grafos de Flujo de Datos

Todo programa de TensorFlow es un grafo. Los nodos son operaciones (como multiplicación de matrices o funciones de activación), y las aristas son tensores (arrays multidimensionales) que fluyen entre ellos. Defines el grafo primero, luego lo corres en una sesión.

En ese momento, TensorFlow 1.x usaba un modelo de definir-y-correr. Construías el grafo, luego lo ejecutabas por separado. (TensorFlow 2.x más tarde introdujo ejecución eager, haciéndolo más Pythónico e intuitivo.)

### Tensores

Los tensores son la estructura de datos fundamental. Son generalizaciones de escalares (0D), vectores (1D), matrices (2D), y arrays de dimensiones superiores. Las imágenes son tensores 3D (alto, ancho, canales de color). Lotes de imágenes son tensores 4D.

Entender los tensores es clave para entender cómo las redes neuronales procesan datos.

### Redes neuronales

Expliqué lo básico: capas de neuronas, funciones de activación, propagación hacia adelante (cómo fluye la data a través de la red), y retropropagación (cómo la red aprende ajustando pesos).

Usé un ejemplo simple: reconocer dígitos escritos a mano con el dataset MNIST. Es el "Hola Mundo" del machine learning, pero es un gran punto de partida porque puedes ver la red aprender en tiempo real.

### Empezando

Finalmente, mostré la instalación, cómo definir un modelo simple, entrenarlo y evaluarlo. El objetivo no era hacer a nadie un experto — era desmitificar el proceso y mostrar que podías empezar con unas pocas horas de aprendizaje.

---

## La reacción de la audiencia

El Q&A fue la mejor parte. La gente tenía tantas preguntas: ¿Cuánta matemática necesitas? ¿Puedes usar TensorFlow para problemas de negocio? ¿Cuál es la diferencia entre TensorFlow y scikit-learn? ¿Cómo sabes cuándo usar deep learning vs. machine learning tradicional?

Traté de ser honesto: no necesitas un PhD para empezar, pero sí necesitas ser paciente. Machine learning es diferente del desarrollo de software tradicional. Hay más experimentación, más prueba y error, y más tiempo gastado depurando por qué un modelo no está aprendiendo.

Pero la recompensa vale la pena. Cuando entrenas un modelo y lo ves hacer predicciones precisas en datos que nunca ha visto antes, se siente como magia. Eso es lo que me enganchó, y quería que otros experimentaran eso también.

Una persona preguntó si yo pensaba que la IA reemplazaría a los desarrolladores. Dije que no — cambiaría lo que construimos, pero no la necesidad de personas que puedan pensar críticamente, resolver problemas, y diseñar sistemas. Eso sigue siendo cierto hoy.

---

## Reflexiones

Mirando atrás, 2017 se siente como un punto de inflexión para la IA. TensorFlow estaba madurando, PyTorch estaba emergiendo, y deep learning estaba moviéndose de laboratorios de investigación a sistemas de producción. El hype era real, pero también lo era el progreso.

Para mí, esta charla fue el inicio de un interés más profundo en IA. Seguí aprendiendo — leyendo papers, tomando cursos, construyendo proyectos. No me convertí en un ingeniero de ML, pero gané suficiente conocimiento para tener conversaciones informadas, evaluar productos de IA, y entender los trade-offs.

Si tienes curiosidad sobre machine learning, empieza con TensorFlow (o PyTorch, si prefieres). La barrera de entrada ha caído dramáticamente. Hay cursos gratuitos, modelos preentrenados, y plataformas en la nube que te permiten experimentar sin hardware costoso.

Lo más importante es empezar. Construye algo pequeño, haz que funcione, luego itera. Así fue como aprendí, y sigue siendo la mejor manera.

---

## Slides y Referencia

- [Ver slides](https://slides.com/xergioalex/tensorflow)
- [Post del blog Pereira Tech Talks](https://www.pereiratechtalks.org/control-de-flujos-de-trabajo-en-airflow-inteligencia-artificial-con-tensorflow) — primer meetup (AirFlow + TensorFlow)
