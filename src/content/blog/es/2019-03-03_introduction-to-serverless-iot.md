---
title: "Introducción a Serverless con énfasis en IoT"
description: "Mi viaje a las arquitecturas serverless y por qué cambiaron cómo pienso en construir aplicaciones IoT. Desde apps de meditación hasta bombillos inteligentes."
pubDate: "2019-03-03"
heroImage: "/images/blog/posts/introduction-to-serverless-iot/hero.webp"
heroLayout: "banner"
tags: ["talks", "tech", "devops", "iot"]
keywords: ["introducción a serverless", "qué es serverless computing", "arquitectura serverless para IoT", "AWS Lambda con IoT", "funciones serverless para dispositivos conectados", "serverless sin administrar servidores", "IoT con arquitectura serverless"]
---

Recuerdo la primera vez que desplegué una función Lambda. Se sintió como magia — escribes una función, la subes, y de repente está corriendo en respuesta a eventos sin que te preocupes por servidores, escalado o infraestructura. Ese cambio de mentalidad es lo que quise compartir en esta charla sobre arquitecturas serverless con enfoque en IoT.

El término **serverless** es hermoso y engañoso al mismo tiempo. *Server-less* literalmente significa "sin servidor" — pero spoiler: aún hay servidores 😄. Simplemente no los administras. Alguien más se encarga de la infraestructura mientras vos te enfocas en código y lógica. Para aplicaciones IoT, donde los dispositivos disparan eventos constantemente y de forma impredecible, este modelo tiene un sentido increíble.

<figure>
  <img src="/images/blog/posts/introduction-to-serverless-iot/demo.webp" alt="Demos de la charla: Bambú, IoT Light Bulb, DailyBot, Twitter Bot" loading="lazy" />
  <figcaption>Cuatro demos en vivo mostradas en la charla: la skill de meditación Bambú, un bombillo controlado de forma serverless, DailyBot y un bot de Twitter.</figcaption>
</figure>

## Backend as a Service vs Functions as a Service

Serverless no es nuevo, y no es una sola cosa. Viene en dos sabores principales que resuelven problemas diferentes:

**BaaS (Backend as a Service)** lleva más de 10 años. AWS S3, lanzado en 2006, fue uno de los primeros — un servicio simple de almacenamiento en la nube que podías integrar vía API sin construir tu propia infraestructura de archivos. La idea detrás de BaaS es simple: ¿para qué construir y mantener servicios genéricos (bases de datos, autenticación, búsqueda) cuando ya existen como componentes confiables y probados? Te conectas a ellos de forma transparente mediante APIs y seguís adelante con tu vida.

Ejemplos: AWS DynamoDB para bases de datos NoSQL, Auth0 para autenticación, Algolia para búsqueda, Skygear para servicios backend. Estas herramientas te permiten evitar reinventar la rueda cada vez que necesitas un servicio común.

**FaaS (Functions as a Service)** es el niño nuevo, nacido en 2014 con AWS Lambda. Esta es la siguiente evolución de la computación en la nube — una forma fundamentalmente diferente de ejecutar y diseñar aplicaciones. En lugar de desplegar un servidor que corre constantemente, despliegas **funciones** que se ejecutan en respuesta a eventos: una petición HTTP, un cambio en base de datos, una carga de archivo, un registro de usuario. La plataforma asigna recursos dinámicamente, escala automáticamente y te cobra solo por el tiempo de ejecución.

Principales actores: AWS Lambda, Google Cloud Functions, Azure Functions. Cada uno tiene sus peculiaridades, pero el modelo es el mismo: cómputo orientado a eventos, stateless y efímero.

## Beneficios de Serverless

¿Por qué serverless me entusiasmó tanto? Por varias razones:

- **No hay que administrar servidores** — No quiero conectarme por SSH a servidores a las 2 AM para reiniciar un proceso. Quiero escribir código.
- **Escala automáticamente** — Si un usuario dispara una función o un millón lo hacen, la plataforma lo maneja. No provisiono capacidad.
- **Pagas por lo que usas** — Sin costos iniciales. Si la función no corre, no pago. Si corre mil millones de veces, pago por esas ejecuciones. Límites suaves, no costos fijos.
- **Arquitectura orientada a eventos** — Peticiones HTTP, cambios en base de datos, modificaciones de archivos, acciones de usuarios — todo se convierte en un evento. Tu código reacciona.
- **Sin costos de contratación ni provisión** — No se necesita un equipo DevOps solo para mantener servidores vivos. Podés construir y lanzar más rápido.

Para aplicaciones IoT, donde los dispositivos pueden enviar datos en ráfagas o permanecer inactivos por horas, este modelo es perfecto. Un bombillo inteligente no necesita un servidor corriendo 24/7 esperando un comando de encendido. Necesita una función que corra cuando el evento de encendido suceda.

## Desventajas de Serverless

No todo es color de rosa. Serverless tiene trade-offs reales:

- **Vendor lock-in** — Quedas fuertemente acoplado a las APIs y el ecosistema de tu proveedor. Migrar de AWS Lambda a Google Cloud Functions no es trivial.
- **Cold starts** — Si una función no ha corrido recientemente, la primera ejecución tiene latencia mientras la plataforma activa el runtime. Para aplicaciones en tiempo real, esto puede notarse.
- **Restricciones del proveedor** — Cada proveedor tiene límites. AWS Lambda, por ejemplo, tiene una duración mínima de facturación de 1 segundo y un tiempo máximo de ejecución de 15 minutos (eran 5 minutos en 2019). Si tu tarea toma más tiempo, no hay opción.
- **No hay buenas herramientas para debugging** — Depurar funciones distribuidas y efímeras es más difícil que depurar un monolito corriendo localmente. Las herramientas están mejorando, pero sigue siendo un desafío.
- **Es complicado estimar costos** — "Pagas por lo que usas" suena genial hasta que te das cuenta de que no sabés qué vas a usar. Estimar costos para cargas impredecibles requiere matemáticas y monitoreo.

Estos no son dealbreakers, pero son reales. Tenés que decidir si los trade-offs valen la pena para tu caso de uso.

## Cuándo sí usar Serverless

Serverless brilla en estos escenarios:

- **Tareas cortas y periódicas** — Trabajos programados, procesamiento de datos, generación de reportes
- **Largos periodos de inactividad** — Aplicaciones que permanecen quietas la mayor parte del tiempo, luego tienen picos de actividad
- **Procesamiento de datos** — Pipelines ETL, redimensionamiento de imágenes, análisis de logs
- **Apps web, móviles o workers que respondan a eventos disparados por usuarios** — Backends de API, webhooks, notificaciones
- **Apps stateless** — Aplicaciones que no dependen de estado en memoria entre peticiones
- **Chatbots e interfaces de voz** — Orientados a eventos por naturaleza, frecuentemente inactivos, luego reactivos

Para IoT, serverless es un ajuste natural. Los dispositivos envían datos cuando algo sucede. Un sensor de temperatura reporta cada 5 minutos. Un detector de movimiento se dispara cuando detecta movimiento. Un bombillo inteligente espera un comando. Todo son eventos. Todo es serverless.

## Cuándo no usar Serverless

Serverless no es universal. Evitalo cuando:

- **No quieres depender de un proveedor** — Si el lock-in es un dealbreaker, considera self-hosting (más sobre eso abajo)
- **Necesitas ejecuciones largas** — AWS Lambda tiene un máximo de 15 minutos. Si tu tarea toma horas, necesitas un modelo diferente (batch jobs, ECS, EC2)
- **Tienes ejecuciones complejas y stateful** — Las funciones serverless son efímeras y stateless. Si tu app necesita estado persistente, vas a necesitar almacenamiento externo (bases de datos, caches) y diseño cuidadoso

## Demo Time

Mostré cuatro demos en vivo para ilustrar serverless en acción:

**[Bambú Meditación](https://appbambu.com/alexa/)** — Una skill de Alexa para meditación guiada impulsada por AWS Lambda. Los usuarios dicen "Alexa, abre Bambú" y Lambda maneja la lógica de conversación, obtiene el audio de meditación y administra el estado de la sesión. Sin servidores. Solo funciones respondiendo a eventos de voz.

<figure>
  <img src="/images/blog/posts/introduction-to-serverless-iot/alexa-demo.webp" alt="Demo de Bambú Meditación con Alexa y AWS Lambda" loading="lazy" />
  <figcaption>Arquitectura de Bambú Meditación: una skill de Alexa que activa AWS Lambda para servir audio de meditación guiada bajo demanda.</figcaption>
</figure>

**[IoT Light Bulb](https://github.com/xergioalex/serverless-ligth-bulb)** — Un bombillo controlado por serverless usando ESP8266, módulos wireless NRF24L01+ y Lambda. El bombillo escucha comandos enviados vía una API HTTP. Lambda recibe la petición, la procesa y envía una señal al bombillo. Todo el flujo de control es orientado a eventos.

<figure>
  <img src="/images/blog/posts/introduction-to-serverless-iot/iot-circuit.webp" alt="Circuito del demo IoT: ESP8266, NRF24L01+, LEDs en breadboard" loading="lazy" />
  <figcaption>El hardware del bombillo IoT: módulos ESP8266 y NRF24L01+ conectados en una breadboard, controlados mediante Lambda.</figcaption>
</figure>

<figure>
  <img src="/images/blog/posts/introduction-to-serverless-iot/iot-bulb.webp" alt="Bombillo real funcionando — controlado por Lambda" loading="lazy" />
  <figcaption>El bombillo real encendiéndose en respuesta a una llamada HTTP a AWS Lambda — control IoT serverless hecho físico.</figcaption>
</figure>

**[DailyBot](https://www.dailybot.com/)** — Un bot asistente de equipos para Slack y otras plataformas. DailyBot usa funciones serverless para enviar recordatorios diarios de standup, recolectar respuestas y generar reportes. Todo disparado por eventos programados o mensajes de usuarios.

<figure>
  <img src="/images/blog/posts/introduction-to-serverless-iot/dailybot-demo.webp" alt="Diagrama de la demo DailyBot con serverless" loading="lazy" />
  <figcaption>La arquitectura serverless de DailyBot — funciones Lambda programadas que recolectan respuestas de standup y generan reportes de equipo.</figcaption>
</figure>

**[Twitter Bot](https://x.com/XergioAleXBot)** — Un bot automatizado que tuitea según una programación usando Lambda. Un evento de CloudWatch dispara la función cada pocas horas, la función genera un tweet (o retuitea contenido) y publica vía la API de Twitter. Simple, económico y requiere cero infraestructura.

<figure>
  <img src="/images/blog/posts/introduction-to-serverless-iot/twitter-bot-demo.webp" alt="Bot de Twitter funcionando — @XergioAleXBot" loading="lazy" />
  <figcaption>@XergioAleXBot en X — un bot de publicación automática activado por eventos de CloudWatch, sin infraestructura de servidor dedicada.</figcaption>
</figure>

Estos demos mostraron la misma idea desde diferentes ángulos: pequeñas funciones orientadas a eventos impulsando aplicaciones reales sin administrar servidores.

## ¿Por dónde empiezo?

Si esto te suena interesante, acá va por dónde empezar:

**Lenguajes de programación?** — La mayoría de proveedores soportan Node.js, Python, Go, Java, C# y más. Elegí lo que ya conocés.

**¿Querés self-hosting?** — Herramientas como [OpenFaaS](https://www.openfaas.com/) y [Knative](https://knative.dev/) te permiten correr FaaS en tu propia infraestructura (Kubernetes, Docker Swarm). Perdés algo de la conveniencia "serverless", pero evitas vendor lock-in.

**Recursos que recomiendo:**

- [Foo Bar](https://www.youtube.com/watch?v=YPc5ulMR6VI) en YouTube — Excelente contenido serverless en español
- Curso Udemy: *Serverless en Español con AWS y Serverless Framework* — Práctico, hands-on, en español

---

Serverless cambió cómo pienso en construir aplicaciones. No es perfecto y no es para todo, pero para IoT, sistemas orientados a eventos y aplicaciones con patrones de uso impredecibles, es un modelo poderoso. Cuanto menos tiempo paso administrando infraestructura, más tiempo paso resolviendo problemas reales.

[Ver slides](https://slides.com/xergioalex/introduction-to-serverless-with-emphasis-on-iot)

A seguir construyendo.
