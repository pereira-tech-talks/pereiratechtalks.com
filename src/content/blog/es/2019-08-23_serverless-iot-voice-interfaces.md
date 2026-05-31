---
title: 'Serverless, IoT e interfaces conversacionales'
description: 'Por qué el diseño voice-first importa y cómo serverless impulsa el futuro de las interfaces conversacionales. De skills de Alexa a integración IoT.'
pubDate: '2019-08-23'
heroImage: '/images/blog/posts/serverless-iot-voice-interfaces/hero.webp'
heroLayout: 'side-by-side'
tags: ["talks", "tech", "devops", "iot"]
keywords: ["interfaces conversacionales serverless", "voz como nueva interfaz de usuario", "Alexa skills con serverless", "diseño voice-first", "IoT y interfaces de voz", "Google Assistant y serverless", "Manizales Tech Talks serverless IoT"]
---

Ya había dado charlas sobre serverless antes, pero esta en Manizales Tech Talks tuvo un ángulo diferente: **la voz como nueva interfaz**. No solo funciones serverless o dispositivos IoT en aislamiento, sino la convergencia de las tres — voz, eventos e infraestructura que escala a cero.

La web está evolucionando. Gartner predijo que para 2020 el 30% de las sesiones de navegación web se harían sin pantalla. **Voice First Browsing**. Todavía no llegamos del todo, pero la dirección es clara. Alexa, Google Assistant, Siri — ya no son novedades. Son interfaces que la gente usa a diario. Y son fundamentalmente diferentes de hacer clic en botones o tocar pantallas.

## La voz es la nueva interfaz

Las interfaces conversacionales cambian el modelo de interacción. En lugar de navegar menús, los usuarios hablan su intención. En lugar de formularios, tienen diálogos. La fricción es menor — sin escribir, sin hacer clic, solo hablar. Pero el desafío de diseño es mayor. No podés mostrar un menú visual. No podés asumir que el usuario recuerda dónde quedó. Tenés que diseñar para **conversación**, no para navegación.

Un buen ejemplo es [Bambú Meditación](https://appbambu.com/alexa/), una skill de Alexa para meditación guiada. La interfaz de usuario de voz combina **frontend** (la experiencia de hablar con el asistente) y **backend** (la lógica que procesa la petición). Así funciona:

1. **Wake word** — "Alexa" (o "Hey Google", "Siri", etc.)
2. **Invocation name** — "Abre Bambú" o "Lanza Bambú"
3. **Utterances** — Lo que el usuario dice en contexto. "Quiero una meditación para descansar." "Reproduce una sesión matutina." "Ayúdame a concentrarme."
4. **Slots** — Datos variables extraídos de las utterances. "descansar", "matutina", "concentrarme".
5. **Intent** — La acción que la app debe ejecutar. Reproducir una meditación específica. Reanudar sesión. Proveer ayuda.

<figure>
  <img src="/images/blog/posts/serverless-iot-voice-interfaces/voice-interface.webp" alt="Flujo de una interfaz de voz: wake word, invocation, utterances, slots, intent" loading="lazy" />
  <figcaption>El pipeline de interacción de Alexa: wake word → nombre de invocación → parseo de utterances → extracción de slots → intent enviado a Lambda.</figcaption>
</figure>

El backend — en este caso, una función AWS Lambda — recibe el intent y los slots, obtiene el audio o datos apropiados y devuelve una respuesta. El usuario escucha una pista de meditación o una confirmación. La interacción completa está orientada a eventos. Sin servidor corriendo constantemente. Sin recursos inactivos. Solo una función que se despierta cuando se le habla.

## Diseñando para voz

Las interfaces de voz son más difíciles de diseñar que las visuales porque:

- **No hay feedback visual.** No podés mostrar un spinner de carga. No podés mostrar una lista de opciones. Todo es hablado.
- **La memoria es limitada.** Los usuarios no recordarán un menú de 10 ítems leído en voz alta. Mantén las interacciones cortas y contextuales.
- **El manejo de errores es crítico.** Si el usuario dice algo inesperado, no podés mostrar una página de error. Tenés que responder con gracia en voz.
- **El contexto importa.** Una skill debe recordar dónde está el usuario en un flujo. "Sí" significa cosas diferentes dependiendo de lo que acabás de preguntar.

Las mejores interfaces de voz se sienten como hablar con un humano útil, no como navegar un árbol telefónico. El procesamiento de lenguaje natural (NLP) ayuda, pero el **diseño de interacción** es lo que hace o rompe la experiencia.

## Serverless impulsa las interfaces conversacionales

Las interfaces de voz son naturalmente orientadas a eventos. Un usuario habla, el asistente procesa la entrada y el backend responde. No hay necesidad de un servidor corriendo 24/7 esperando peticiones. Acá es donde serverless brilla.

Con **AWS Lambda**, **Google Cloud Functions** o **Azure Functions**, desplegás una función que:

- Recibe el intent y slots parseados de Alexa, Google u otra plataforma
- Ejecuta lógica de negocio (obtener datos, procesar entrada, actualizar estado)
- Devuelve una respuesta (text-to-speech, audio o datos estructurados)

La función solo corre cuando es invocada. Si nadie usa la skill por horas, no pagás nada. Si un millón de personas la usan simultáneamente, la plataforma escala automáticamente. Sin planificación de capacidad, sin load balancers, sin grupos de autoscaling. Solo código.

Para **integración IoT**, el mismo modelo aplica. Un comando de voz puede disparar una función Lambda que envía una señal a un dispositivo IoT. "Alexa, enciende la luz." La función recibe el intent, llama a un endpoint IoT (MQTT, HTTP, WebSocket) y la luz se enciende. Todo orientado a eventos, todo serverless.

## La base serverless

Como ya cubrí serverless en detalle en una charla anterior, acá va el repaso rápido:

**BaaS (Backend as a Service)** — Servicios pre-construidos que conectás vía APIs. AWS DynamoDB (base de datos), Auth0 (autenticación), Algolia (búsqueda). No los construís ni mantenés; los consumís.

**FaaS (Functions as a Service)** — Funciones que corren en respuesta a eventos. AWS Lambda, Google Cloud Functions, Azure Functions. Desplegás código, la plataforma maneja la ejecución.

**Beneficios:**

- Sin administración de servidores
- Escalado automático
- Precio por ejecución
- Orientado a eventos por naturaleza

**Desventajas:**

- Vendor lock-in
- Latencia de cold start (retraso en primera ejecución)
- Límites de tiempo de ejecución (AWS Lambda: máx 15 minutos en 2024, eran 5 en 2019)
- Desafíos de debugging

**Casos de uso:**

- APIs y webhooks
- Procesamiento de datos y ETL
- Chatbots e interfaces de voz
- Backends IoT
- Trabajos programados

**Evitar cuando:**

- Necesitas procesos de larga duración (horas)
- Querés control total sin dependencia de proveedor
- Tenés flujos stateful complejos

## IoT y voz: una combinación perfecta

Los dispositivos IoT generan eventos. Un sensor lee temperatura. Un detector de movimiento se dispara. Un bombillo inteligente recibe un comando. Todo eventos. Las interfaces de voz también generan eventos. Un usuario habla. Un intent se parsea. Se solicita una acción.

Serverless se sienta en el medio, reaccionando a ambos. Un comando de voz se convierte en un evento IoT. Una lectura de sensor IoT se convierte en una notificación de voz. La arquitectura es simétrica:

```
Usuario habla -> Alexa/Google -> Lambda -> Dispositivo IoT
Dispositivo IoT se dispara -> Lambda -> Alexa/Google -> Usuario escucha
```

Por ejemplo, podrías decir "Alexa, ¿cuál es la temperatura en la sala?" y el flujo sería:

1. Alexa parsea el intent y lo envía a Lambda
2. Lambda consulta el dispositivo IoT (vía MQTT o HTTP)
3. El dispositivo responde con la temperatura
4. Lambda formatea la respuesta ("Son 22 grados Celsius")
5. Alexa habla la respuesta

Todo esto pasa en segundos, sin infraestructura persistente.

## Resumen de los demos

Demostré los mismos proyectos de mi charla anterior sobre serverless, pero esta vez con énfasis en los aspectos de voz y orientación a eventos:

- **[Bambú Meditación](https://appbambu.com/alexa/)** — Skill de Alexa impulsada por Lambda. Guía de meditación voice-first.
- **[IoT Light Bulb](https://github.com/xergioalex/serverless-ligth-bulb)** — Bombillo controlado por serverless. API HTTP dispara Lambda, que señaliza el dispositivo.
- **[DailyBot](https://www.dailybot.com/)** — Bot asistente de equipos. Eventos programados y mensajes de usuarios disparan funciones Lambda.
- **[Twitter Bot](https://x.com/XergioAleXBot)** — Tuiteo automatizado vía Lambda y eventos CloudWatch.

Cada demo mostró el mismo patrón: evento entra, función corre, acción sale. Sin servidores, sin recursos inactivos.

## Por dónde empezar con interfaces de voz

Si querés construir skills de voz:

**Para Alexa:**
- [Amazon Alexa Skills Kit](https://developer.amazon.com/alexa/alexa-skills-kit) — SDK y documentación
- Usa Lambda para el backend (integración más simple)
- Diseña utterances e intents en la Consola de Desarrolladores de Alexa

**Para Google Assistant:**
- [Actions on Google](https://developers.google.com/assistant) — Construye acciones conversacionales
- Integra con Dialogflow para NLP
- Despliega lógica backend en Cloud Functions

**Recursos generales:**

- Enfocate en **diseño de conversación** antes de escribir código. Mapea flujos de usuario como diálogos, no como pantallas.
- Prueba con usuarios reales. Las interacciones de voz se sienten diferentes de lo que esperás.
- Mantén las respuestas cortas y naturales. Leelas en voz alta para probar cadencia.

---

Las interfaces de voz están todavía en etapa temprana, pero llegaron para quedarse. A medida que IoT crece y el procesamiento de lenguaje natural mejora, la voz se convertirá en un modo de interacción primario para más aplicaciones. Serverless hace que construir estos sistemas sea práctico y rentable.

El futuro no es solo apps que tocás. Son apps con las que hablás, y dispositivos que responden. Construir para ese futuro significa pensar en eventos, conversaciones y funciones — no servidores.

[Ver slides](https://slides.com/xergioalex/serverless-iot-and-voice-interfaces)

A seguir construyendo.
