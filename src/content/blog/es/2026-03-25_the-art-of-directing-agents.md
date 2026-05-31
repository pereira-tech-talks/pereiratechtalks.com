---
title: "El trabajo oculto de la era IA: el arte de dirigir agentes"
description: "Los agentes de IA no son multiplicadores de productividad — son multiplicadores de criterio. Por qué la dirección importa más que el modelo."
pubDate: "2026-03-25"
heroImage: "/images/blog/posts/the-art-of-directing-agents/hero-es.webp"
heroLayout: "side-by-side"
tags: ["tech", "ai-agents", "personal"]
keywords: ["arte de dirigir agentes IA", "mejores instrucciones agentes IA", "delegar en agentes de código", "cómo trabajar con agentes IA", "dirigir vs prompting agentes IA", "mismo modelo resultados diferentes IA", "enmarcar trabajo para agentes IA"]
series: "working-with-agents"
seriesOrder: 2
---

En los últimos meses he notado algo que creo que es una de las verdades más importantes sobre trabajar con agentes de IA: dale a dos personas el mismo modelo, el mismo agente, el mismo codebase y la misma configuración, y los resultados pueden seguir siendo abismalmente diferentes. No ligeramente diferentes — abismalmente diferentes. Una persona obtiene algo limpio, coherente, sorprendentemente sólido y casi listo para producción. La otra obtiene algo vago, frágil, demasiado complicado o simplemente enfocado en otra dirección. El modelo no cambió. El agente no cambió. La configuración no cambió. Lo que cambió fue la persona que dirigía el trabajo.

Y creo que esa es la parte que muchas personas todavía no ven. Pasamos tanto tiempo hablando de modelos — cuál es más inteligente, cuál es mejor para programar, cuál tiene mejores benchmarks, cuál tiene ventana de contexto más larga, cuál vale la pena pagar. Y sí, todo eso importa. Pero los modelos de frontera han llegado a un punto donde ya son tremendamente capaces. Cada salto de modelo a modelo se siente a veces casi imperceptible, no porque no haya mejoras reales, sino porque el nivel base ya es altísimo. Seguro vendrán modelos mejores — siempre vienen — pero los actuales ya hacen un trabajo extraordinario. Probablemente llegaremos a un punto donde cada vez notaremos menos la diferencia entre un modelo y otro, donde esa conversación de "¿cuál es el mejor modelo?" se vuelva casi irrelevante. Y en la práctica ya lo estoy viendo: la calidad del resultado suele depender menos del modelo que de la calidad de la dirección detrás de él.

Por eso he estado repensando cuál es realmente el trabajo oculto de la era IA. Al principio pensé que una gran parte era revisar el trabajo realizado por los agentes. Y sí, la revisión sigue importando. Mucho. Pero cuanto más trabajo con agentes cada día, más convencido estoy de que el trabajo oculto empieza antes que la revisión. Mucho antes. Empieza antes de que exista el resultado.

Empieza cuando encuadras el problema. Cuando defines la tarea. Cuando decides qué importa. Cuando estableces los límites. Cuando proporcionas el contexto correcto. Cuando haces el trabajo suficientemente claro para que el agente pueda hacerlo bien. El trabajo oculto no es solo revisar el trabajo del agente — es dirigirlo. Y cuanto mejor me vuelvo en esto, más siento que este es uno de los verdaderos artes de la ingeniería moderna.

---

## El resultado empieza antes de lo que la mayoría piensa

Cuando las personas evalúan el trabajo realizado por la IA, normalmente miran la parte visible — el código, la interfaz, el diff, los tests, la respuesta final — y entonces pregunta: ¿fue bueno o malo? Tiene sentido. Es la parte que podemos ver. Pero la calidad del resultado suele empezar mucho antes que eso. Empieza en cómo se encuadró el trabajo.

¿Cuál es el problema real? ¿Qué estamos intentando resolver? ¿Qué parte del sistema importa aquí? ¿Qué restricciones no son negociables? ¿Qué no se debe tocar bajo ningún concepto? ¿Estamos optimizando por velocidad, mantenibilidad, simplicidad, bajo riesgo o solo por momentum? Estas no son detalles secundarios alrededor de la tarea. Son la tarea.

Ese es uno de los cambios más grandes que he sentido en esta nueva forma de trabajar. Antes, mucho de ese pensamiento ocurría durante la implementación. Empezabas a programar, te encontrabas con ambigüedad, ibas resolviendo las cosas sobre la marcha, hacías compromisos en movimiento, ajustabas a medida que avanzabas. Ahora mucho de eso se ha desplazado hacia arriba en el proceso. Porque cuando la ejecución se vuelve tan rápida, la ambigüedad se vuelve cara. Es parecido a lo que pasa con TDD — en test-driven development primero defines qué debe pasar, qué comportamiento esperas, qué condiciones debe cumplir el código, y solo después escribes la implementación que satisface esos criterios. Dirigir agentes se siente igual: defines las restricciones, el resultado esperado y los límites antes de que el agente escriba una sola línea. La diferencia es que en TDD lo hacías para tu propio código. Ahora lo haces para el trabajo de otro — uno que ejecuta mucho más rápido que tú.

Un desarrollador humano suele frenar naturalmente cuando una solicitud está mal especificada. Un agente generalmente no lo hace. Seguirá avanzando, llenará los espacios en blanco, hará suposiciones, elegirá una dirección. Y a veces hará todo eso con suficiente confianza como para que el resultado parezca bueno hasta que te das cuenta de que resolvió el problema equivocado. Lo aprendí a las malas cuando todavía era inexperto dando instrucciones. Le daba indicaciones vagas al agente sobre algo que quería desarrollar — el qué, pero no el cómo. No le especificaba qué patrones seguir, qué servicios existentes reutilizar, qué convenciones respetar. Y el agente hacía lo que cualquiera haría con información incompleta: buscaba la mejor manera de resolverlo por su cuenta. El resultado muchas veces era código que funcionaba, bien estructurado incluso, pero que no encajaba con el resto del sistema. Creaba sus propias abstracciones donde ya existían otras, elegía enfoques diferentes a los que usábamos, tomaba decisiones arquitectónicas que yo nunca habría tomado. Esto pasa sobre todo cuando el proyecto no está bien documentado y el agente no tiene forma de responderse preguntas básicas sobre la arquitectura, la estructura de carpetas, los servicios disponibles o las convenciones del equipo. El código era objetivamente bueno. La dirección no. Y yo terminaba deshaciendo trabajo que nunca debió haber pasado — no porque el agente fallara, sino porque yo no le di el contexto suficiente para acertar.

Por eso sigo volviendo a la misma idea: **el resultado empieza mucho antes del output.** Empieza en la dirección.

---

## Esto no se trata realmente de prompting

Muchas personas todavía llaman a esto prompting. Lo entiendo — era la palabra que teníamos. Pero honestamente, cuanto más trabajo de esta forma, menos útil me resulta esa palabra. Porque lo que hago la mayor parte del tiempo no se siente como solo "prompting." Se siente como diseñar trabajo. Se siente como tomar algo difuso y convertirlo en algo delegable. Se siente como decidir qué contexto importa, qué restricciones importan, qué debe permanecer estable, qué nivel de calidad buscamos, y dónde es probable que el agente se equivoque si dejo demasiado abierto.

Hay un momento en la [entrevista reciente de Andrej Karpathy en No Priors](https://www.youtube.com/watch?v=kwSVtQ7dziU) que se me quedó grabado. Sarah Guo, la entrevistadora, describe cómo se siente su día a día: *"Code's not even the right verb anymore, right? But I have to express my will to my agents for 16 hours a day."* ("Programar ya ni siquiera es el verbo correcto, ¿no? Pero tengo que expresar mi voluntad a mis agentes 16 horas al día.") Y Karpathy la interrumpe con una sola palabra: *"Manifest."* ("Manifestar.") Me encanta esa forma de verlo — no programar, no hacer prompts, sino expresar tu voluntad a los agentes. Manifestar. Creo que ambos tienen razón. Eso se acerca más a lo que realmente se siente que cualquier otra palabra que haya escuchado. Otros lo llaman vibe coding — el propio Karpathy [acuñó el término en febrero de 2025](https://x.com/karpathy/status/1886192184808149383). Pero incluso eso se queda corto. Vibe coding suena a algo casual, improvisado, como dejarte llevar. Lo que yo hago todos los días no tiene nada de casual. Es deliberado, estructurado, y requiere entender profundamente lo que estás pidiendo.

<iframe width="100%" style="aspect-ratio:16/9" loading="lazy" srcdoc="<style>*{padding:0;margin:0;overflow:hidden}html,body{height:100%}img,span{position:absolute;width:100%;top:0;bottom:0;margin:auto}span{height:1.5em;text-align:center;font:48px/1.5 sans-serif;color:white;text-shadow:0 0 0.5em black}</style><a href=https://www.youtube.com/embed/kwSVtQ7dziU?autoplay=1><img src=/images/blog/posts/the-art-of-directing-agents/karpathy-no-priors.webp alt='Andrej Karpathy sobre Code Agents, AutoResearch y la era Loopy de la IA — Entrevista en No Priors'><span>&#x25BA;</span></a>" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen title="Andrej Karpathy sobre Code Agents, AutoResearch y la era Loopy de la IA — Entrevista en No Priors"></iframe>

Una buena instrucción no es solo mejor redacción. No es un truco ni una fórmula. Una buena instrucción suele ser una forma comprimida de pensamiento estructurado — qué problema necesita resolverse, qué contexto importa, qué restricciones deben preservarse, qué no debe cambiarse, qué nivel de calidad se espera, y cuándo el agente debe detenerse y preguntar en lugar de adivinar. La propia [guía de prompt engineering de Anthropic](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) cubre la mayoría de estas dimensiones — especificar contexto, restricciones y criterios de éxito. Pero la etiqueta "prompting" todavía hace que suene como un ejercicio de escritura, cuando en la práctica se parece más a un ejercicio de diseño de sistemas.

Esa distinción importa, porque cuando las personas lo reducen a prompting, hace que el trabajo parezca mucho más ligero de lo que realmente es. El apalancamiento no está en escribir una solicitud más bonita. El apalancamiento está en entender el trabajo lo suficientemente bien como para definirlo bien. Una buena delegación no es pedir trabajo — es definir el trabajo con suficiente claridad para que pueda ejecutarse correctamente.

---

## El campo no se niveló — se movió

Hay una historia muy seductora circulando ahora mismo. Va más o menos así: ahora que la IA puede programar, todos están más cerca de operar al mismo nivel. Las herramientas se están volviendo tan potentes que la experiencia importa menos. El acceso está nivelando el campo de juego.

Hay algo real en eso. El piso definitivamente subió. Personas que antes no podían construir ahora pueden hacerlo. Personas que antes estaban bloqueadas por la implementación ahora pueden avanzar. Diseñadores, PMs, fundadores, marketers, operadores — he visto a todos ellos acercarse mucho más a la ejecución porque los agentes cierran parte de la distancia. Esa parte es real, y honestamente, es una de las cosas más emocionantes que están pasando ahora mismo.

Pero no creo que eso signifique que la diferencia entre personas desapareció. Creo que se movió. Se desplazó hacia arriba en el proceso, hacia la calidad de la dirección.

Un junior y un experto pueden sentarse frente exactamente al mismo setup y aun así obtener resultados radicalmente diferentes, porque no están haciendo realmente lo mismo. No solo están "usando IA." Están encuadrando, acotando, restringiendo y dirigiendo el trabajo a niveles muy distintos. El acceso a la herramienta por sí solo no produce las ganancias de productividad. La habilidad para dirigirla importa tanto como la herramienta.

Karpathy dijo algo en la misma entrevista que me terminó de encajar esto: *"Everything feels like it's a skill issue. It's not that the capability is not there."* ("Todo se siente como un problema de habilidad. No es que la capacidad no esté ahí.") Cuando el agente entrega algo malo, el reflejo es culpar al modelo. A veces esa culpa es justa. Pero más seguido de lo que me gustaría admitir, el problema era mío — la tarea era vaga, las restricciones eran débiles, o dejé demasiado abierto para que el agente adivinara. La persona con más experiencia suele ser mejor en ver el problema real detrás de la tarea, anticipar la ambigüedad antes de que el agente la encuentre, preservar la intención arquitectónica, y saber cuándo una tarea está lista para delegar y cuándo todavía no lo está.

He visto tareas donde la distancia entre una instrucción débil y una fuerte no era un 10% mejor o peor — era la diferencia entre "esto más o menos funciona" y "esto es lo suficientemente sólido como para construir sobre ello." El mismo modelo puede parecer mediocre en las manos de una persona y notable en las de otra. No porque el modelo haya cambiado. Sino porque la dirección cambió.

---

## Multiplicadores de criterio

Una de las razones por las que esto importa tanto es que los agentes son amplificadores reales. Un agente bien dirigido puede sentirse casi injusto. Se mueve rápido. Se mantiene coherente. Maneja la complejidad mejor de lo que esperabas. Te da un apalancamiento que, honestamente, algunos días todavía parece irreal.

Pero un agente mal dirigido también puede moverse rápido — y ese es el problema. Puede moverse rápido en la dirección equivocada. Puede sobreingenierizar con confianza. Puede resolver limpiamente el problema equivocado. Puede generar algo pulido sobre una comprensión incorrecta de la tarea. Gran parte del mal output es simplemente trabajo mal encuadrado que llega rápido.

Por eso he empezado a pensar en los agentes menos como multiplicadores de productividad y más como **multiplicadores de criterio**. Multiplican el beneficio de la claridad. Y multiplican el costo de la confusión en igual medida. Una tarea bien dirigida conduce a resultados más nítidos, revisiones más enfocadas, trabajo de mayor valor. Una tarea mal dirigida conduce a trabajo de rescate — limpiar ambigüedad que debería haberse resuelto antes, corregir suposiciones que el agente no debería haber tenido que hacer, arrastrar el trabajo de vuelta hacia el objetivo real después de que se desvió.

La diferencia entre estas dos experiencias es una de las señales más claras de que el apalancamiento real empieza antes de lo que la mayoría piensa. Empieza en la dirección.

---

## Spec-driven development: el TDD de la era agéntica

Antes en este artículo comparé dirigir agentes con TDD — primero defines qué debe pasar, qué comportamiento esperas, qué restricciones debe cumplir el código, y solo después escribes la implementación. Resulta que hay un nombre para esta idea llevada al extremo: **spec-driven development** (SDD).

El concepto no es nuevo — [se formalizó académicamente en 2004](https://en.wikipedia.org/wiki/Spec-driven_development) como una sinergia entre TDD y diseño por contrato. Pero ha vivido un renacimiento enorme con la llegada de los agentes de IA. La idea central es simple: la especificación deja de ser documentación pasiva y se convierte en el artefacto principal del desarrollo. No escribes código y luego documentas. Escribes la spec primero — qué problema se resuelve, qué restricciones existen, qué comportamiento se espera, qué arquitectura se respeta — y el agente genera el código a partir de eso.

[ThoughtWorks lo describe](https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices) como un punto medio entre el vibe coding puro y la rigidez del waterfall: specs estructuradas que alimentan a los agentes, pero con ciclos de feedback cortos e iterativos. No es escribir un documento de 50 páginas antes de tocar código. Es definir con suficiente claridad para que el agente pueda ejecutar bien — exactamente lo que he estado describiendo en todo este artículo.

[GitHub formalizó esto con spec-kit](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/), un toolkit open-source que estructura el flujo en cuatro fases: especificar, planificar, descomponer en tareas, e implementar. Cada tarea queda lo suficientemente acotada como para que el agente pueda implementarla y validarla de forma aislada — casi como un test individual en TDD. La spec se convierte en la fuente de verdad compartida entre tú y el agente.

[Birgitta Böckeler en el sitio de Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html) analiza tres niveles de adopción: **spec-first** (escribes la spec, la usas y la descartas), **spec-anchored** (la mantienes como referencia viva), y **spec-as-source** (la spec es el artefacto primario, el código es generado y no se toca). También señala riesgos reales — los agentes a veces ignoran partes de la spec, el overhead de revisión puede crecer, y llevar el concepto al extremo puede combinar lo peor de la inflexibilidad con la no-determinismo de los LLMs. Es una mirada equilibrada y vale la pena leerla.

Lo que me parece más interesante es que spec-driven development le pone nombre a algo que muchos ya estábamos haciendo de forma intuitiva. Cuando documento la arquitectura de mi proyecto en un `AGENTS.md`, cuando defino las convenciones, las restricciones y los patrones antes de pedirle al agente que escriba código — eso es spec-driven development. Es TDD elevado al nivel de dirección: en vez de definir tests que validan comportamiento del código, defines specs que validan el comportamiento del agente.

---

## El trabajo oculto

Si hay un hilo que conecta todo lo que describí en este artículo — desde el encuadre, pasando por un campo de juego que no se niveló sino que se movió, los multiplicadores de criterio, hasta el spec-driven development — es este: el valor humano ya no está en la ejecución. Está en la dirección. En saber qué pedirle al agente, cómo pedírselo, y cuándo lo que te devolvió es realmente lo que necesitabas.

Ese es el trabajo oculto de la era IA. No es glamuroso. No aparece en los benchmarks. No se mide en líneas de código ni en velocidad de respuesta. Pero es lo que separa un resultado que funciona de uno que realmente sirve. Y cuanto mejores se vuelven los agentes, más se convierte tu criterio en el cuello de botella — no tu velocidad tecleando.

Lo interesante es que esto no es algo que se aprende una vez y ya. Es una habilidad viva que se refina con cada tarea, cada error, cada vez que deshaces algo que no debiste haber delegado así. Y creo que las personas que más lejos van a llegar con estas herramientas no serán las que tengan acceso a los mejores modelos, sino las que aprendan a dirigirlos mejor que nadie.

Sigamos construyendo.

---

## Recursos

- [Andrej Karpathy on Code Agents, AutoResearch, and the Loopy Era of AI](https://www.youtube.com/watch?v=kwSVtQ7dziU) — La entrevista en No Priors donde Sarah Guo describe "expresar su voluntad" a los agentes, Karpathy lo resume como "Manifest", y por qué todo se siente como un problema de habilidad
- [Anthropic Prompt Engineering Guide](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview) — Cubre diseño de contexto, restricciones y criterios de éxito para trabajar con Claude
- [METR: AI Task Time Horizons](https://metr.org/time-horizons/) — La "nueva Ley de Moore" que rastrea cómo las capacidades de los agentes de IA se duplican cada pocos meses
- [Spec-Driven Development — ThoughtWorks](https://www.thoughtworks.com/en-us/insights/blog/agile-engineering-practices/spec-driven-development-unpacking-2025-new-engineering-practices) — Por qué SDD es el punto medio entre vibe coding y waterfall, y cómo las specs estructuradas alimentan a los agentes
- [Spec-Driven Development with AI — GitHub Blog](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/) — El toolkit open-source spec-kit de GitHub y el flujo de cuatro fases: especificar, planificar, descomponer, implementar
- [Understanding Spec-Driven Development: Kiro, spec-kit, and Tessl — Martin Fowler](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html) — Análisis equilibrado de tres herramientas SDD: niveles de adopción, riesgos reales y lecciones del Model-Driven Development
