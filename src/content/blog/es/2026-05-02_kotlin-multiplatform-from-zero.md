---
title: 'Kotlin Multiplatform desde cero: compartir código sin renunciar a lo nativo'
description: 'Una introducción a Kotlin Multiplatform: su historia, por qué gana fuerza y qué lo diferencia de otras formas de construir apps para Android e iOS.'
draft: true
pubDate: '2026-05-02'
heroLayout: 'side-by-side'
tags: ["tech", "mobile", "kotlin", "flutter"]
keywords: ['Kotlin Multiplatform', 'KMP', 'desarrollo mobile', 'Android iOS', 'Compose Multiplatform', 'apps multiplataforma']
series: 'learning-mobile-development'
seriesOrder: 2
---

# Kotlin Multiplatform desde cero: compartir código sin renunciar a lo nativo

Este año decidí que por fin iba a aprender desarrollo mobile en serio.

No soy un experto mobile. Mi mundo ha sido el backend, la web, la infraestructura. Pero en 2026 me comprometí a cambiar eso, y la primera parada fue mapear el territorio: ¿qué opciones existen hoy para construir apps que funcionen en Android e iOS? En el capítulo anterior recorrí ese paisaje y señalé dos caminos que me llamaron la atención — Flutter y Kotlin Multiplatform. Flutter por su comunidad y su velocidad de desarrollo. KMP por algo diferente: porque no te aleja de lo nativo, porque te da control, porque puedes empezar pequeño.

Y fue KMP el que me enganchó más.

No porque sea la opción más popular ni la más fácil. Sino porque propone algo que me parece más honesto sobre cómo funciona realmente el desarrollo mobile. Por eso este capítulo es mi primera inmersión en esa propuesta.

---

Durante años, el desarrollo mobile ha vivido atrapado en un dilema incómodo.

Por un lado, está el camino nativo: construir una app para Android y otra para iOS, cada una con sus propias herramientas, equipos, patrones y decisiones técnicas. Es el camino más natural para aprovechar bien cada plataforma, pero también trae una consecuencia muy familiar — duplicar lógica, duplicar bugs, duplicar esfuerzo y, muchas veces, duplicar frustración.

Por otro lado, están los enfoques cross-platform (multiplataforma) más tradicionales: escribir una sola app para varias plataformas. Esa idea suena hermosa en teoría. Una sola base de código, un solo equipo, una sola forma de construir. Pero en la práctica muchas veces viene con una pregunta difícil: ¿cuánto de la experiencia nativa estás dispuesto a sacrificar?

Y justo en medio de esa tensión aparece Kotlin Multiplatform.

No como una promesa mágica de "escribe una vez y olvídate del resto". No como otro framework que quiere reemplazar todo lo que ya existe. Y quizá por eso se está volviendo tan interesante.

Kotlin Multiplatform propone algo más pragmático: compartir código donde aporta valor, sin alejarse de las herramientas y la experiencia del desarrollo nativo.

Esa frase resume bien por qué vale la pena tomarlo en serio.

## No es solo otra tecnología cross-platform

Cuando uno escucha "multiplataforma", es fácil meter todo en la misma bolsa: Flutter, React Native, .NET MAUI, Ionic, webviews, wrappers, frameworks con promesas de productividad infinita.

Pero Kotlin Multiplatform tiene una personalidad distinta. Y la diferencia no es de superficie.

Su idea principal no es necesariamente que compartas el 100% de la app. Es que puedas compartir las partes que tiene sentido compartir: lógica de negocio, modelos, validaciones, networking, persistencia, reglas de dominio, casos de uso, procesamiento de datos y, si quieres, también parte de la UI.

Pero no te obliga a abandonar el mundo nativo.

Puedes tener una app Android con su experiencia Android. Puedes tener una app iOS con su experiencia iOS. Y en el medio, una capa común en Kotlin que evita que escribas dos veces la misma lógica.

Eso cambia la conversación.

Porque el problema real en mobile no siempre es dibujar botones dos veces. Muchas veces el dolor está en otra parte: reglas de negocio duplicadas, respuestas distintas ante el mismo caso, bugs que se corrigen en Android pero se olvidan en iOS, integraciones repetidas, lógica de validación que se va desalineando con el tiempo.

Kotlin Multiplatform intenta atacar justo ahí. No promete eliminar toda la complejidad. Promete ayudarte a compartir mejor la complejidad que no debería estar duplicada.

## La historia empieza mucho antes del hype

Kotlin Multiplatform no apareció de la nada.

La historia viene de varios años atrás, cuando JetBrains empezó a pensar en Kotlin no solo como un lenguaje para la JVM o para Android, sino como un lenguaje capaz de vivir en varias plataformas.

En 2017, con Kotlin 1.2 Beta, JetBrains introdujo los proyectos multiplataforma como una funcionalidad experimental. La idea inicial era permitir que una parte del código viviera en un módulo común y que cada plataforma tuviera sus propias implementaciones cuando fuera necesario. En ese momento, el foco estaba más en compartir código entre JVM y JavaScript, pero ahí ya estaba sembrada la semilla de lo que después conoceríamos como Kotlin Multiplatform. [^kotlin12]

La idea era poderosa, pero todavía temprana.

Durante esos primeros años, KMP sonaba interesante para quienes estaban muy metidos en Kotlin, pero no era una opción obvia para equipos mobile. Había potencial, sí, pero también muchas preguntas sin respuesta: tooling, interoperabilidad con iOS, memoria, librerías, configuración, experiencia de desarrollo.

Era una promesa en construcción.

## El momento mobile: Kotlin Multiplatform Mobile

El punto donde la historia se vuelve mucho más relevante para mobile llega en 2020.

Ese año JetBrains anunció Kotlin Multiplatform Mobile, o KMM, en estado Alpha. La propuesta era directa: usar la misma lógica de negocio en aplicaciones Android e iOS. [^kmm-alpha]

Ese detalle importa: el foco no era "hagamos una app universal que se vea igual en todas partes". Era más específico — y para muchos equipos, más realista: compartamos la lógica que no debería duplicarse.

KMM llegó con una narrativa atractiva para equipos mobile: seguir usando desarrollo nativo, pero compartir una parte crítica del código.

Para Android, tenía mucho sentido. Kotlin ya era un lenguaje oficial y ampliamente adoptado en el ecosistema Android. Para iOS, el reto era mayor — había que lograr que el código Kotlin conviviera bien con Swift, Xcode y las expectativas del mundo Apple.

Ahí comenzó una etapa de maduración lenta, pero importante. KMM no era perfecto. Había fricción. Había partes del ecosistema que todavía estaban verdes. Pero la idea era lo suficientemente buena como para que muchos equipos empezaran a probarla en serio.

## De experimento a opción seria

En 2022, Kotlin Multiplatform Mobile pasó a Beta. JetBrains lo presentó como una forma de mantener una base compartida para networking, almacenamiento, analítica y otras capas de lógica de apps Android e iOS. [^kmm-beta]

Ese paso marcó un cambio de tono. Ya no era "esto puede ser interesante". Era: "esto está madurando, ya hay una dirección clara, ya vale la pena tomarlo más en serio". Empresas como Netflix, Philips y Baidu ya estaban probándolo en producción.

Y luego llegó el punto de inflexión.

En noviembre de 2023, JetBrains declaró Kotlin Multiplatform estable y listo para producción. [^kmp-stable]

Ese momento cambió la percepción. KMP dejó de sentirse como una apuesta experimental y empezó a verse como una estrategia real. Además, alrededor de ese momento también se consolidó de nuevo el nombre Kotlin Multiplatform — dejando atrás la idea de que esto era únicamente "Kotlin Multiplatform Mobile".

Y eso tiene sentido.

Porque KMP no es solo mobile. Puede apuntar a Android, iOS, desktop, web y server. Pero mobile sigue siendo, probablemente, el caso de uso que más llama la atención — porque es donde el dolor de duplicar código entre plataformas se siente con más fuerza.

## El giro grande: compartir UI también empieza a ser real

Durante mucho tiempo, la forma más sensata de hablar de Kotlin Multiplatform era esta:

> Comparte la lógica, deja la UI nativa.

Y esa sigue siendo una estrategia muy válida.

De hecho, para muchos equipos probablemente sigue siendo la mejor forma de empezar. Puedes mantener SwiftUI o UIKit en iOS, Jetpack Compose o views nativas en Android, y compartir la lógica de negocio en Kotlin.

Pero la historia cambió bastante con Compose Multiplatform.

Compose Multiplatform es un framework de UI construido sobre Kotlin Multiplatform. Permite crear interfaces compartidas usando un enfoque declarativo similar a Jetpack Compose en Android. Y la gran pregunta durante mucho tiempo fue si realmente podía ser una opción seria para iOS.

En mayo de 2025, con la versión 1.8.0, JetBrains anunció que Compose Multiplatform para iOS era estable y listo para producción. [^compose-ios-stable] El anuncio no fue solo declarativo: la startup de rendimiento mostraba paridad con apps nativas, y más del 96% de los equipos encuestados reportó que no encontró problemas de rendimiento significativos.

Eso no significa que todo el mundo deba compartir el 100% de la UI. Pero sí significa algo importante: KMP dejó de ser únicamente una historia de lógica compartida. Ahora también puede ser una historia de UI compartida — al menos para ciertos productos, equipos y casos de uso.

Hoy puedes pensar en KMP en tres niveles:

1. Compartir solo lógica.
2. Compartir lógica y arquitectura.
3. Compartir lógica, arquitectura y UI con Compose Multiplatform.

Esa flexibilidad es una de sus mayores fortalezas.

## Entonces, ¿qué lo hace especial?

Lo especial de Kotlin Multiplatform no es simplemente "reutilizar código".

Lo especial es que no te obliga a una respuesta extrema.

No te dice: "duplica todo porque lo nativo es sagrado". Tampoco te dice: "abandona lo nativo porque una sola base de código siempre es mejor". KMP te dice algo más interesante:

> Comparte lo que tiene sentido compartir. Mantén nativo lo que tiene sentido mantener nativo.

Esa idea es menos espectacular en marketing, pero más poderosa en la práctica.

Porque las apps reales no son demos. Las apps reales tienen deuda técnica, integraciones, edge cases, decisiones de producto, cambios de diseño, dependencias, APIs específicas de plataforma, performance, accesibilidad, analítica, offline, notificaciones, permisos, publicación en stores y equipos con conocimientos distintos.

En ese contexto, una solución que no pretende borrar las diferencias entre plataformas — sino convivir mejor con ellas — empieza a sonar muy atractiva.

## La diferencia frente a Flutter o React Native

Esta comparación hay que hacerla con cuidado. No se trata de decir que una tecnología es buena y las demás son malas.

Flutter es excelente si quieres construir una app con una UI compartida, consistente y controlada desde una sola base de código. React Native también ha sido una opción fuerte para equipos que vienen del mundo JavaScript y quieren moverse rápido en mobile.

Pero Kotlin Multiplatform parte de otra filosofía.

Flutter y React Native responden a la pregunta: "¿Cómo construyo una app multiplataforma desde una sola experiencia de desarrollo?" KMP responde otra pregunta: "¿Cómo comparto código entre plataformas sin dejar de construir cerca de lo nativo?"

Esa diferencia parece sutil. No lo es. Imagina un equipo Android que ya tiene dos años de lógica de negocio en Kotlin: con KMP puede empezar a compartir esa lógica con iOS sin reescribir una sola pantalla, sin cambiar su pipeline de CI, sin que el equipo iOS toque Kotlin si no quiere. Con Flutter o React Native, esa adopción incremental no existe — o existe de una forma mucho más costosa.

Con KMP puedes adoptar la tecnología de forma gradual. Puedes empezar compartiendo una capa pequeña, aprender, medir el valor y luego decidir si tiene sentido compartir más.

Ese enfoque incremental lo hace muy interesante para equipos con apps existentes, equipos con experiencia Android, o productos que no quieren renunciar a una experiencia nativa cuidada.

## El estado actual: ya no es promesa, pero tampoco magia

Hoy Kotlin Multiplatform está en una etapa mucho más madura.

JetBrains lo presenta como production-ready (listo para producción) para sus plataformas soportadas. La página oficial describe KMP como una tecnología para reutilizar código en Android, iOS, desktop, web y server, conservando los beneficios de la programación nativa. Y aclara que Compose Multiplatform es estable para Android, iOS y desktop, mientras que el target web sigue en Beta. [^kmp-overview]

Eso es importante decirlo con honestidad.

KMP ya no es una simple promesa experimental. Pero tampoco es una varita mágica. Todavía hay complejidad. Hay Gradle. Hay configuración. Hay decisiones de arquitectura. Hay que pensar mejor cómo estructurar la interoperabilidad con iOS.

Y quizá por eso me parece tan interesante.

Porque en vez de vendernos la fantasía de que el desarrollo mobile puede ser completamente uniforme, reconoce una verdad más incómoda: Android e iOS son distintos, y a veces esa diferencia importa. La pregunta no es cómo esconder esa diferencia. La pregunta es cómo evitar duplicar lo que no debería estar duplicado.

## Por qué está ganando tanta fuerza ahora

Creo que Kotlin Multiplatform está ganando fuerza por una mezcla de razones.

Primero, porque el problema que resuelve es real. La duplicación entre Android e iOS sigue siendo costosa, especialmente cuando la lógica de negocio empieza a crecer.

Segundo, porque Kotlin ya tiene una posición muy fuerte en Android. Para muchos equipos, KMP no se siente como aprender un universo totalmente nuevo — sino como extender algo que ya conocen.

Tercero, porque la tecnología maduró. El salto a estable en 2023 y la llegada de Compose Multiplatform para iOS estable en mayo de 2025 cambiaron la conversación. Ya no hablamos solo de experimentos o demos.

Cuarto, porque ofrece un punto medio atractivo. En un mundo donde muchas herramientas prometen reemplazarlo todo, KMP destaca por ser más flexible: puedes compartir poco, compartir mucho o compartir casi todo, dependiendo del contexto.

Y quinto, porque encaja con una tendencia más amplia en software: cada vez valoramos más las arquitecturas que nos permiten movernos rápido sin encadenarnos a una abstracción demasiado rígida.

Kotlin Multiplatform no te obliga a casarte con una sola forma de construir. Te da una estrategia.

## Cómo me gusta pensarlo

Para mí, Kotlin Multiplatform se entiende mejor con esta frase:

> No se trata de compartir más código. Se trata de duplicar menos dolor.

Porque ese es el punto.

Compartir código por compartir código no siempre es una buena idea. A veces compartir demasiado puede volverse una carga — una abstracción común que termina siendo más difícil de mantener que dos implementaciones separadas. Eso también pasa.

Pero hay partes de una app donde duplicar sí duele: reglas de negocio, validaciones, modelos, casos de uso, lógica de sincronización, clientes de red, almacenamiento, cálculos, transformaciones de datos.

Ahí KMP puede brillar. Y si el equipo, el producto y el nivel de madurez lo permiten, también puede empezar a compartir UI con Compose Multiplatform.

Lo valioso es que no tienes que empezar por ahí. Puedes empezar pequeño. Puedes compartir una capa, aprender, medir, decidir.

Ese enfoque progresivo es una de las razones por las que Kotlin Multiplatform se siente tan concreto para equipos reales.

## Lo que quiero aprender ahora

Honestamente, esta es una de esas tecnologías que prefiero aprender construyendo.

No quiero quedarme en la comparación eterna de "Flutter vs React Native vs Kotlin Multiplatform". Esa comparación puede ser útil, pero también se vuelve superficial rápido. La pregunta que más me interesa es otra:

> ¿Qué tipo de apps se vuelven más fáciles de construir cuando podemos compartir la lógica sin renunciar a lo nativo?

Esa pregunta abre posibilidades más concretas. Apps pequeñas. Experimentos. MVPs. Productos internos. Apps para comunidades. Herramientas que necesitan Android e iOS pero que no justifican duplicar toda la lógica desde cero.

KMP no tiene que empezar como una gran apuesta corporativa. También puede empezar como una forma de aprender mobile moderno desde una perspectiva más amplia. Y eso es justo lo que me parece emocionante.

## Cierre

Kotlin Multiplatform pasó de ser una idea experimental a convertirse en una estrategia seria para construir software entre plataformas.

Su historia no es la de una tecnología que intenta destruir lo nativo. Es casi lo contrario: una tecnología que reconoce que lo nativo importa, pero que también reconoce que duplicar todo no siempre tiene sentido.

Por eso creo que vale la pena aprenderlo. No porque sea la respuesta universal. No porque vaya a reemplazar todas las demás opciones. Sino porque propone una forma más adulta de pensar el desarrollo mobile: compartir donde aporta valor, mantener nativo donde importa, construir con más intención.

Y si el futuro del desarrollo mobile se parece un poco a eso, yo quiero entenderlo.

A seguir construyendo.

---

## Referencias

[^kotlin12]: JetBrains presentó los proyectos multiplataforma como una funcionalidad experimental en Kotlin 1.2 Beta en 2017: https://blog.jetbrains.com/kotlin/2017/09/kotlin-1-2-beta-is-out/
[^kmm-alpha]: JetBrains anunció Kotlin Multiplatform Mobile Alpha en agosto de 2020: https://blog.jetbrains.com/kotlin/2020/08/kotlin-multiplatform-mobile-goes-alpha/
[^kmm-beta]: JetBrains anunció Kotlin Multiplatform Mobile Beta en octubre de 2022: https://blog.jetbrains.com/kotlin/2022/10/kmm-beta/
[^kmp-stable]: JetBrains declaró Kotlin Multiplatform estable y listo para producción en noviembre de 2023: https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/
[^compose-ios-stable]: JetBrains anunció Compose Multiplatform 1.8.0 con soporte estable y listo para producción en iOS en mayo de 2025: https://blog.jetbrains.com/kotlin/2025/05/compose-multiplatform-1-8-0-released-compose-multiplatform-for-ios-is-stable-and-production-ready/
[^kmp-overview]: Página oficial de Kotlin Multiplatform: https://kotlinlang.org/multiplatform/
