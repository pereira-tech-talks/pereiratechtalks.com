---
title: 'Introducción al internet de las cosas'
description: 'Me uní con Alejandro Rendón para explorar IoT — desde sensores y controladores hasta programar robots con JavaScript y Johnny-five.'
pubDate: '2017-03-28'
heroImage: '/images/blog/posts/internet-of-things/hero.webp'
heroLayout: 'banner'
tags: ["talks", "tech", "iot"]
keywords: ["introducción al internet de las cosas", "qué es IoT", "Arduino con JavaScript", "Johnny-five programación de robots", "sensores y actuadores IoT", "IoT para desarrolladores web", "programar hardware con Node.js"]
---

El hardware siempre me ha fascinado. Como desarrollador de software que pasa la mayor parte del tiempo en la nube, hay algo profundamente satisfactorio en hacer que cosas físicas se muevan, parpadeen y respondan al mundo. Así que cuando [Alejandro Rendón](https://www.linkedin.com/in/alejorendon/) y yo empezamos a planear una charla para [Pereira Tech Talks](https://www.pereiratechtalks.org/introduccion-al-internet-de-las-cosas-y-clustering-con-nodejs/), supe que quería sumergirme en el Internet de las Cosas — la tecnología que conecta el software con el mundo físico.

El momento se sentía perfecto. IoT estaba explotando en 2017 — casas inteligentes, wearables, sensores industriales — y la barrera de entrada era más baja que nunca. Podías comprar un Arduino por unos pocos dólares y empezar a controlar LEDs, motores y sensores con solo unas pocas líneas de código. Para un desarrollador JavaScript como yo, el hecho de que pudieras hacer todo esto con Node.js lo hacía aún más atractivo.

Alejandro cubrió computación distribuida con clusters de Node.js, y yo me enfoqué en los fundamentos de IoT. El objetivo era simple: desmitificar la capa de hardware y mostrar que no necesitas ser ingeniero eléctrico para construir dispositivos conectados.

---

## ¿Qué es el Internet de las Cosas?

El **Internet de las Cosas** se refiere a la red de dispositivos físicos — sensores, actuadores y controladores — que se conectan a internet e intercambian datos. A menudo se le llama una segunda revolución industrial porque conecta los mundos físico y digital: las máquinas se comunican entre sí, con la nube y con nosotros.

Piénsalo: tu termostato ajusta la temperatura según tu ubicación, tu rastreador de ejercicio envía datos de frecuencia cardíaca a tu teléfono, tu carro te avisa cuando la presión de las llantas está baja. No son solo gadgets — son parte de una red masiva de dispositivos que detectan, deciden y actúan sin intervención humana.

Lo que más me emociona del IoT es que extiende el software al mundo real. En lugar de solo manipular datos en pantallas, estás controlando motores, leyendo sensores de temperatura y automatizando procesos físicos. Es programación con consecuencias que puedes ver y tocar.

<figure>
  <img src="/images/blog/posts/internet-of-things/iot-1.webp" alt="Charla de IoT en Pereira Tech Talks" loading="lazy" />
  <figcaption>Presentando la sesión de fundamentos de IoT en Pereira Tech Talks en marzo de 2017.</figcaption>
</figure>

---

## Los tres componentes esenciales

Todo sistema IoT se construye a partir de tres elementos fundamentales. Entender estos te ayuda a ver cómo funcionan incluso los dispositivos inteligentes más complejos:

1. **Sensores** — Capturan datos del entorno (temperatura, luz, movimiento, humedad, presión, etc.). Los sensores son los "ojos y oídos" de un sistema IoT. Observan el mundo físico y lo convierten en datos.

2. **Actuadores** — Realizan acciones en el mundo físico (motores, LEDs, relés, parlantes, servos). Los actuadores son las "manos" del sistema. Toman comandos digitales y los convierten en movimiento, luz, sonido o calor.

3. **Controladores** — Procesan datos y deciden qué hacer (microcontroladores como Arduino, Raspberry Pi, ESP8266). Los controladores son el "cerebro". Leen datos de sensores, ejecutan tu código y le dicen a los actuadores qué hacer.

Juntos forman ciclos de retroalimentación: detectar → decidir → actuar. Un sensor de movimiento detecta movimiento, el controlador decide encender una luz, y un actuador LED ilumina la habitación. Simple, pero poderoso.

En la charla, mostré ejemplos de cada componente y cómo trabajan juntos. La audiencia estaba curiosa — muchos habían escuchado de Arduino pero no se habían dado cuenta de lo accesible que era empezar.

<figure>
  <img src="/images/blog/posts/internet-of-things/iot-2.webp" alt="Componentes IoT y robótica" loading="lazy" />
  <figcaption>Demostrando sensores, actuadores y controladores — los tres componentes esenciales de cualquier sistema IoT.</figcaption>
</figure>

---

## Programando hardware con Node.js: Johnny-five

Aquí es donde las cosas se ponen divertidas. La mayoría de la gente asume que necesitas escribir C o C++ para programar microcontroladores. Eso es cierto para sistemas embebidos de bajo nivel, pero para prototipar y aprender, hay una mejor manera: JavaScript.

[Johnny-five](https://johnny-five.io/) es una plataforma de robótica e IoT en JavaScript. Te permite controlar Arduino, Raspberry Pi y otras tarjetas desde Node.js — sin necesidad de escribir C o C++. Escribes JavaScript, y Johnny-five maneja la comunicación de bajo nivel con el hardware.

¿Por qué importa esto? Porque JavaScript es familiar para millones de desarrolladores. Si sabes cómo construir una aplicación web, ya tienes las habilidades para construir un robot. Eso es un gran avance.

### Tu primer robot

En la charla, mostré cómo empezar: conectar un Arduino por USB, instalar Johnny-five con npm, y hacer parpadear un LED en unas diez líneas de código. A la audiencia le encantó — hay algo mágico en escribir `led.blink(500)` y ver un LED físico prenderse y apagarse.

Desde ahí, las posibilidades explotan. Puedes leer sensores de temperatura, controlar servos, construir robots que siguen líneas, crear dispositivos de casa inteligente, o construir registradores de datos que envían lecturas de sensores a una base de datos. Todo con JavaScript.

Mostré algunos ejemplos: leer la presión de un botón, controlar un LED, y usar un motor servo para mover un brazo robótico. La demo no fue perfecta — las demos de hardware en vivo nunca lo son — pero funcionó lo suficientemente bien para mostrar el potencial.

Lo que más me impactó durante el Q&A fue cuántas personas tenían ideas que querían probar. Alguien preguntó sobre construir un sistema de riego automático para plantas. Otra persona quería automatizar la puerta de su garaje. IoT no tiene que ser abstracto — es más interesante cuando resuelve problemas reales en tu propia vida.

---

## Memorias del Evento

<figure>
  <img src="/images/blog/posts/internet-of-things/iot-3.webp" alt="Pereira Tech Talks meetup — Jonathan Alvarez invitando a JsConf" loading="lazy" />
  <figcaption>Jonathan Alvarez tomando el micrófono para invitar a la comunidad de Pereira a JsConf Colombia en Medellín.</figcaption>
</figure>

<figure>
  <img src="/images/blog/posts/internet-of-things/iot-4.webp" alt="Pereira Tech Talks meetup" loading="lazy" />
  <figcaption>La audiencia de Pereira Tech Talks — una comunidad tech local en crecimiento que se conectaba con la escena nacional de JavaScript.</figcaption>
</figure>

Una de las mejores partes del evento fue ver a [Jonathan Alvarez](https://twitter.com/jonalvarezz) invitar a la comunidad a asistir a [JsConf Colombia](https://jsconf.co/) en Medellín. JsConf era un gran evento — una oportunidad de conectar con la comunidad JavaScript más amplia y ver qué estaban construyendo en toda Latinoamérica.

Para mí, esa invitación representaba algo más grande: la comunidad tech de Pereira estaba creciendo. Ya no estábamos aislados. Éramos parte de una red nacional e internacional de desarrolladores compartiendo ideas y aprendiendo juntos.

---

## Reflexiones

Mirando atrás, esta charla fue un punto de inflexión para mí. Confirmó que me encanta enseñar y que quería seguir contribuyendo a la comunidad tech local. También profundizó mi aprecio por el hardware — algo que siempre me había dado curiosidad pero nunca había explorado completamente.

IoT sigue evolucionando. Las herramientas han mejorado, el hardware es más barato y más potente, y los casos de uso se están expandiendo hacia IoT industrial, ciudades inteligentes y salud. Pero los fundamentos siguen siendo los mismos: sensores, actuadores, controladores, y la magia de conectar software con el mundo físico.

Si te interesa IoT, empieza pequeño. Consigue un kit de Arduino, instala Johnny-five, y haz parpadear un LED. Luego construye desde ahí. La barrera de entrada nunca ha sido más baja.

---

## Slides y Referencia

- [Ver slides](https://slides.com/xergioalex/internet-of-things)
- [Post del blog Pereira Tech Talks](https://www.pereiratechtalks.org/introduccion-al-internet-de-las-cosas-y-clustering-con-nodejs/) — recap del evento (IoT + clustering con Node.js)
