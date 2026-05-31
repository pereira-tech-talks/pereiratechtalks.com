---
title: 'Deep Learning: de la academia a la práctica'
description: 'Lo que compartí en PyCon Colombia 2018: matemática aplicada para IA—álgebra lineal, redes neuronales, descenso del gradiente y visión por computadora.'
pubDate: '2018-02-09'
heroImage: '/images/blog/posts/pycon-deep-learning/hero.webp'
heroLayout: 'banner'
tags: ["talks", "tech", "ai", "python"]
keywords: ["deep learning desde la academia a la práctica", "redes neuronales con Python", "álgebra lineal para machine learning", "descenso del gradiente explicado", "visión por computadora con Python", "PyCon Colombia 2018", "matemáticas para inteligencia artificial"]
---

PyCon Colombia 2018 fue una experiencia muy especial para mí. Di la charla *Deep Learning: De la Academia a la Práctica* en Medellín y fue una de esas presentaciones donde pude conectar algo que me apasiona — la matemática aplicada — con una audiencia de desarrolladores Python.

Lo que más quería transmitir era que detrás de los modelos de inteligencia artificial no hay magia: hay álgebra lineal, cálculo, estadística y grafos. Conceptos que muchos vimos en la universidad y que, aplicados de la forma correcta, nos permiten construir sistemas que aprenden. Eso me parece fascinante.

<figure>
  <img src="/images/blog/posts/pycon-deep-learning/audience.webp" alt="Audiencia en PyCon Colombia 2018 durante la charla" loading="lazy" />
  <figcaption>Auditorio lleno en PyCon Colombia 2018 en Medellín para la sesión "Deep Learning: De la Academia a la Práctica".</figcaption>
</figure>

---

## De la IA al Machine Learning

Empecé ubicando el deep learning dentro del panorama más amplio. La **inteligencia artificial** se suele clasificar en niveles: IA débil (tareas específicas), IA fuerte (general), super IA, singularidad. También hablé de los algoritmos sesgados — un tema que no podemos ignorar cuando construimos estos sistemas.

Andrew Ng dijo que *"la IA es la nueva electricidad"*. Y en ese contexto, el **machine learning** es el campo de la IA enfocado en sistemas que aprenden de forma autónoma. Aprender, aquí, significa encontrar patrones complejos en millones de datos.

Hay dos paradigmas principales:

- **Aprendizaje supervisado** — Hacer predicciones futuras basadas en comportamientos o características ya vistos en los datos. Ejemplo clásico: clasificar imágenes (1 = gato, 0 = no gato).
- **Aprendizaje no supervisado** — Usar datos históricos sin etiquetas para explorar su estructura y organización.

---

## Redes neuronales y el perceptrón

Las **redes neuronales** son la base de gran parte de la IA actual. Funcionan, al menos conceptualmente, como las neuronas de nuestro cerebro. El **perceptrón** es el bloque fundamental — una unidad que recibe entradas, las pondera y produce una salida.

De ahí pasamos a **predicciones** con cadenas de Markov y otros modelos, pero el salto importante es cuando apilamos capas: eso es deep learning.

---

## Deep Learning: aprendizaje en múltiples niveles

**Deep learning** es aprendizaje en múltiples niveles. Cada capa oculta es responsable de reconocer diferentes características y entregarlas como entrada a la siguiente. Las primeras capas capturan patrones simples (bordes, texturas); las más profundas, conceptos abstractos.

Y aquí viene la parte que más me emocionaba compartir: **la matemática detrás**.

---

## La matemática que hace posible el Deep Learning

Para construir estos modelos necesitamos:

- **Álgebra lineal** — Operaciones con vectores y matrices
- **Cálculo** — Derivadas, gradientes, optimización
- **Estadística** — Distribuciones, inferencia
- **Grafos** — Representación de redes y flujos de datos

Uno de los conceptos clave que expliqué fue la **vectorización**: el arte de eliminar los `for` loops en el código. Las operaciones vectorizadas aprovechan **SIMD** (Single Instruction, Multiple Data) para paralelismo a nivel de datos. Por eso las **GPU** son tan importantes en deep learning — están diseñadas para este tipo de cómputo masivo.

---

## Cómo funciona: forward, backward y el descenso del gradiente

El flujo de un modelo de deep learning se puede resumir así:

1. **Entrada X** → pasa por capas de transformación (operaciones lineales + no lineales) → **Predicción Y**
2. Una **función de pérdida** compara la predicción con el objetivo real
3. Un **optimizador** (como el descenso del gradiente) ajusta los pesos para minimizar esa pérdida

La fórmula básica de regresión logística: **Z = Wx + b**, seguida de una función de activación, nos da la predicción. La **función de costo** mide qué tan mal lo estamos haciendo. El **descenso del gradiente** es el algoritmo que busca el mínimo — donde la derivada se anula (f'(x) = 0).

Hay dos fases fundamentales:

- **Forward propagation** — Los datos fluyen hacia adelante, capa por capa
- **Backward propagation** — El gradiente fluye hacia atrás, permitiendo actualizar los pesos

---

## Visión por Computadora y Redes Convolucionales

Cerramos con **computer vision**. Hablé de **espectrogramas** — representaciones de señales en el dominio de la frecuencia — y de **redes neuronales convolucionales (CNN)**, que son la base de la visión por computadora moderna.

<figure>
  <img src="/images/blog/posts/pycon-deep-learning/computer-vision.webp" alt="Presentando la sección de Computer Vision en Universidad EAFIT" loading="lazy" />
  <figcaption>Cerrando con redes neuronales convolucionales y espectrogramas en la Universidad EAFIT durante PyCon Colombia 2018.</figcaption>
</figure>

Las CNN aprenden filtros que detectan bordes, texturas y formas. Apilando capas convolucionales, el modelo puede reconocer objetos complejos. Mencioné [deeplearning.ai](https://www.deeplearning.ai/) como recurso para profundizar.

---

## Recursos

- [Ver slides](https://slides.com/xergioalex/pycon-deep-learning)
- [Ver charla en YouTube](https://www.youtube.com/watch?v=_jxpZr803vI)
- [Mi perfil de speaker en PyCon Colombia 2018](https://2018.pycon.co/speakers/sergio-alexander-florez-galeano/)
- [Deep Learning Specialization (deeplearning.ai)](https://www.deeplearning.ai/)
- [PyCon Colombia](https://www.pycon.co/)

---

Fue un honor compartir el escenario en PyCon Colombia 2018. La matemática aplicada sigue siendo para mí una de las puertas más fascinantes hacia la inteligencia artificial.

A seguir construyendo.
