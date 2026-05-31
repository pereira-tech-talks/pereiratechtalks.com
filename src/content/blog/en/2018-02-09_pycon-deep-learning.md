---
title: "Deep Learning: From Academia to Practice"
description: "What I shared at PyCon Colombia 2018 on how applied mathematics lets us build AI models — linear algebra, neural networks, gradient descent, computer vision."
pubDate: "2018-02-09"
heroImage: "/images/blog/posts/pycon-deep-learning/hero.webp"
heroLayout: "banner"
tags: ["talks", "tech", "ai", "python"]
keywords: ["PyCon Colombia 2018 deep learning", "neural networks math explained", "deep learning applied mathematics", "linear algebra machine learning", "gradient descent explained", "deep learning Python PyCon", "computer vision neural networks"]
---

PyCon Colombia 2018 was a very special experience for me. I gave the talk *Deep Learning: From Academia to Practice* in Medellín and it was one of those presentations where I could connect something I'm passionate about — applied mathematics — with an audience of Python developers.

What I most wanted to convey was that behind AI models there's no magic: there's linear algebra, calculus, statistics, and graphs. Concepts many of us saw in university that, applied the right way, let us build systems that learn. I find that fascinating.

<figure>
  <img src="/images/blog/posts/pycon-deep-learning/audience.webp" alt="Audience at PyCon Colombia 2018 during the talk" loading="lazy" />
  <figcaption>Packed auditorium at PyCon Colombia 2018 in Medellín for the "Deep Learning: From Academia to Practice" session.</figcaption>
</figure>

---

## From AI to Machine Learning

I started by placing deep learning within the broader landscape. **Artificial intelligence** is often classified into levels: weak AI (specific tasks), strong AI (general), super AI, singularity. I also talked about biased algorithms — a topic we can't ignore when building these systems.

Andrew Ng said that *"AI is the new electricity."* In that context, **machine learning** is the field of AI focused on systems that learn autonomously. Learning, here, means finding complex patterns in millions of data points.

There are two main paradigms:

- **Supervised learning** — Making future predictions based on behaviors or characteristics already seen in the data. Classic example: classifying images (1 = cat, 0 = non-cat).
- **Unsupervised learning** — Using unlabeled historical data to explore its structure and organization.

---

## Neural Networks and the Perceptron

**Neural networks** are the foundation of much of today's AI. They work, at least conceptually, like the neurons in our brain. The **perceptron** is the fundamental building block — a unit that receives inputs, weights them, and produces an output.

From there we moved to **predictions** with Markov chains and other models, but the important leap is when we stack layers: that's deep learning.

---

## Deep Learning: Learning at Multiple Levels

**Deep learning** is learning at multiple levels. Each hidden layer is responsible for recognizing different characteristics and passing them as input to the next. Early layers capture simple patterns (edges, textures); deeper layers capture abstract concepts.

And here comes the part I was most excited to share: **the math behind it**.

---

## The Mathematics That Makes Deep Learning Possible

To build these models we need:

- **Linear algebra** — Operations with vectors and matrices
- **Calculus** — Derivatives, gradients, optimization
- **Statistics** — Distributions, inference
- **Graphs** — Representation of networks and data flows

One of the key concepts I explained was **vectorization**: the art of getting rid of `for` loops in the code. Vectorized operations leverage **SIMD** (Single Instruction, Multiple Data) for data-level parallelism. That's why **GPUs** are so important in deep learning — they're designed for this kind of massive computation.

---

## How It Works: Forward, Backward, and Gradient Descent

The flow of a deep learning model can be summarized as:

1. **Input X** → passes through transformation layers (linear + non-linear operations) → **Prediction Y**
2. A **loss function** compares the prediction with the real target
3. An **optimizer** (like gradient descent) adjusts the weights to minimize that loss

The basic logistic regression formula: **Z = Wx + b**, followed by an activation function, gives us the prediction. The **cost function** measures how wrong we are. **Gradient descent** is the algorithm that searches for the minimum — where the derivative vanishes (f'(x) = 0).

There are two fundamental phases:

- **Forward propagation** — Data flows forward, layer by layer
- **Backward propagation** — The gradient flows backward, allowing us to update the weights

---

## Computer Vision and Convolutional Networks

We closed with **computer vision**. I talked about **spectrograms** — representations of signals in the frequency domain — and **convolutional neural networks (CNNs)**, which are the foundation of modern computer vision.

<figure>
  <img src="/images/blog/posts/pycon-deep-learning/computer-vision.webp" alt="Presenting the Computer Vision section at Universidad EAFIT" loading="lazy" />
  <figcaption>Wrapping up with convolutional neural networks and spectrograms at Universidad EAFIT during PyCon Colombia 2018.</figcaption>
</figure>

CNNs learn filters that detect edges, textures, and shapes. By stacking convolutional layers, the model can recognize complex objects. I mentioned [deeplearning.ai](https://www.deeplearning.ai/) as a resource to go deeper.

---

## Resources

- [View slides](https://slides.com/xergioalex/pycon-deep-learning)
- [Watch the talk on YouTube](https://www.youtube.com/watch?v=_jxpZr803vI)
- [My speaker profile at PyCon Colombia 2018](https://2018.pycon.co/speakers/sergio-alexander-florez-galeano/)
- [Deep Learning Specialization (deeplearning.ai)](https://www.deeplearning.ai/)
- [PyCon Colombia](https://www.pycon.co/)

---

It was an honor to share the stage at PyCon Colombia 2018. Applied mathematics remains for me one of the most fascinating gateways to artificial intelligence.

Let's keep building.
