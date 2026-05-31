---
title: "Buscando el product market fit"
description: "Productos en Rocka.co: qué enseñó cada experimento fallido, cómo leer señales reales de PMF y por qué DailyBot finalmente funcionó."
pubDate: "2021-03-28"
heroImage: "/images/blog/posts/looking-for-product-market-fit/hero.webp"
heroLayout: "banner"
tags: ["talks", "tech", "dailybot", "entrepreneur"]
keywords: ["cómo encontrar product market fit", "qué es product market fit", "señales de PMF en startups", "fracasar y aprender en startups", "DailyBot product market fit historia", "emprendimiento lecciones reales", "construir productos que funcionan"]
---

Di una charla en una clase de emprendimiento en 2021 sobre encontrar Product Market Fit. No la teoría de un libro — mi experiencia real construyendo productos en [Rocka.co](https://rocka.co), fallando la mayoría del tiempo y eventualmente llegando a algo que funcionó.

La charla no buscaba ser motivacional. Buscaba ser honesta. Construir productos es difícil. La mayoría no funcionan. Los que sí funcionan a menudo toman más tiempo del que esperas. Pero si sigues iterando y prestando atención a las señales, eventualmente aprendes a reconocer cuándo estás sobre algo real.

---

## Qué significa para mí el product market fit

Para mí, **Product Market Fit** es ese momento en que el mercado empieza a darte señales claras de que hay una conexión real entre lo que estás construyendo y lo que la gente realmente necesita. No es algo que puedas medir con una sola métrica. Es una sensación — respaldada por retención, crecimiento, gente que le cuenta a sus amigos, clientes que piden más features en vez de preguntar "¿qué es esto?"

Lo pienso como un diagrama de Venn: tu **Producto** se superpone con el **Mercado** y obtienes el **Fit**. Cuando esa superposición es pequeña, estás empujando una roca cuesta arriba. Cuando es grande, las cosas empiezan a sentirse más fáciles. No *fácil* — pero más fácil.

La parte difícil es llegar ahí.

---

## Cómo aprendí a iterar (y fallar)

La única forma en que he logrado acercarme al PMF es **iterar incansablemente**. Construir, lanzar, aprender, repetir. No te enamores de tu primera idea. Pruébala, observa qué pasa y está dispuesto a matarla si no funciona.

En Rocka, construimos muchos productos a lo largo de los años. En algunos creí profundamente. La mayoría no llegaron a ningún lado. Estos son algunos:

### Bootstrup.com
Una plataforma para ayudar a emprendedores a validar ideas y encontrar co-fundadores. La visión era hermosa — democratizar el acceso al emprendimiento. La realidad: lograr que ambos lados de un marketplace (gente con ideas + co-fundadores calificados) aparezcan al mismo tiempo es brutalmente difícil. Teníamos tráfico, pero ningún engagement sostenido. **Lección:** Los marketplaces necesitan masa crítica en ambos lados simultáneamente. El cold start es todo.

### Club Kechef
Una suscripción de cocina con recetas diseñadas por chefs e ingredientes pre-porcionados. Pensamos que estábamos resolviendo la fatiga de planear comidas. Resultó que la logística (sourcing, empaque, entrega) en Colombia era mucho más difícil de lo que esperábamos. Los unit economics nunca funcionaron. **Lección:** Una gran idea de producto no importa si las operaciones te matan. Conoce tu estructura de costos antes de escalar.

### Lanzador
Una plataforma de lanzamiento para productos digitales. Queríamos ser Product Hunt para Latinoamérica. Problema: no teníamos la comunidad que hace valioso a Product Hunt. Construimos la herramienta, pero no construimos la audiencia primero. **Lección:** Las plataformas son tan valiosas como sus efectos de red. Construye comunidad antes que features.

### Neurocicla
Entrenamiento neurofeedback gamificado para foco y rendimiento mental. Súper ambicioso. Necesitaba hardware personalizado, integraciones de data neuro, validación clínica. Construimos un prototipo, pero el camino al mercado era demasiado largo y costoso para un equipo pequeño. **Lección:** El deep tech es emocionante, pero cuidado con productos que requieren años de I+D y aprobación regulatoria a menos que tengas el financiamiento y la paciencia.

### Moli Market
E-commerce para artesanos y productores locales. Gestión de inventario, pagos, logística — estábamos intentando resolver demasiados problemas a la vez. El producto funcionaba, pero la retención era terrible. Los vendedores no se quedaban porque conseguir ventas era muy difícil. **Lección:** No construyas infraestructura a menos que el comportamiento central (compradores encontrando vendedores) ya esté funcionando orgánicamente.

### KidTrix
Juegos educativos para niños. A los padres les gustaba el concepto, pero no pudimos descifrar la distribución. Las app stores están saturadas, los padres son escépticos, las escuelas se mueven lento. Buen producto, go-to-market equivocado. **Lección:** Un gran producto que nadie descubre es lo mismo que ningún producto.

### Bambú meditación
App de meditación con contenido guiado en español. Calm y Headspace ya dominaban. Pensamos que la localización sería suficiente diferenciación. No lo fue. Las apps de meditación son un mercado winner-take-most, y llegamos muy tarde. **Lección:** Competir con gigantes en su terreno requiere más que un feature (como idioma). Necesitas un wedge fundamentalmente diferente.

Cada uno de estos productos me enseñó algo. Ninguno encontró PMF. Pero cada fracaso afiló mi capacidad para reconocer qué *no* estaba funcionando y por qué.

---

## El rol de la comunidad

Mientras construía todos estos productos, también me involucré profundamente en comunidades tech locales: **PereiraJS**, **Pereira Tech Talks** y **Python Pereira**. Estos no eran solo proyectos paralelos — moldearon cómo pienso en construir productos.

Las comunidades te enseñan a escuchar. Oyes qué le importa a la gente, qué los frustra, por qué están dispuestos a pagar. Ves patrones. Empiezas a notar cuándo la queja de alguien es un problema real vs. solo un reclamo aislado.

Correr estas comunidades también me enseñó el valor de **construir en público**. Compartir progreso, obtener feedback temprano, iterar basándote en lo que la gente realmente dice en vez de lo que *crees* que quieren. Esa mentalidad se trasladó directamente a cómo eventualmente construimos DailyBot.

---

## DailyBot: el que Finalmente Encajó

DailyBot no nació de una gran visión. Nació en una **Hackathon interna** en Rocka en 2017. La idea: un asistente de IA para automatización del trabajo — específicamente, **automatización en el chat**. Automatizar standups, check-ins, encuestas, recordatorios — todo dentro de Slack y Microsoft Teams, donde los equipos ya viven.

Construimos un prototipo en un fin de semana. Lo usamos nosotros mismos. Y por primera vez en años, sentí las señales que había estado buscando:

**La gente realmente lo usaba.** No solo una vez. Todos los días. Nuestro propio equipo empezó a depender de él. Esa es una señal fuerte.

**La gente lo compartía.** Compañeros de equipo les contaban a amigos en otras empresas. Empezamos a recibir solicitudes inbound. Crecimiento orgánico. Eso casi nunca pasó con los otros productos.

**La gente pedía más features.** No "¿qué es esto?" o "¿cómo funciona?" — lo entendían inmediatamente y querían que hiciera más. Esa es la diferencia entre un analgésico y una vitamina.

**La retención era fuerte.** Los equipos que probaban DailyBot seguían usándolo. El uso activo semanal era alto. El churn era bajo. No estábamos empujando a la gente a quedarse — querían quedarse.

**Estábamos resolviendo nuestro propio problema.** Esto fue clave. Todos los otros productos que construimos, estábamos adivinando el problema. Con DailyBot, *vivíamos* el problema todos los días. Equipos ahogándose en el chat, cambio de contexto, tareas manuales repetitivas. Conocíamos el dolor porque lo sentíamos.

Ahí supe que teníamos algo.

---

## El camino a Y Combinator

Aplicamos a **Y Combinator tres veces** antes de entrar.

**Primera aplicación (2018):** Rechazados. El producto estaba muy temprano. No teníamos suficiente tracción. El pitch no era nítido. Todavía estábamos descubriendo qué era realmente DailyBot.

**Segunda aplicación (2019):** Rechazados de nuevo. Esta vez teníamos más usuarios, pero no habíamos clavado el go-to-market. Feedback de YC (inferido del rechazo): no están creciendo lo suficientemente rápido.

**Tercera aplicación (2020):** Aceptados. Para este punto, teníamos revenue real, retención fuerte, posicionamiento claro ("automatización de trabajo asíncrono para equipos remotos"), y podíamos mostrar crecimiento. También habíamos aprendido a contar mejor la historia. El producto era el mismo — nuestra claridad sobre él había cambiado.

Entrar a YC no validó el producto. El mercado ya lo había validado. YC validó que estábamos listos para escalar.

En 2022, DailyBot fue reconocido como una de las [Top Companies de Y Combinator](https://www.ycombinator.com/companies/dailybot). Eso se sintió como un hito que valía la pena celebrar — no por la insignia, sino porque representaba años de iteración, aprendizaje y negarse a rendirse.

---

## Qué le Diría a Alguien Buscando PMF Hoy

Si estás construyendo un producto y no estás seguro de si tienes PMF todavía, esto es lo que sugeriría:

**1. Habla con usuarios constantemente.** No para hacer pitch. Para escuchar. Pregúntales qué es difícil. Pregúntales por qué pagarían. Pregúntales qué intentaron antes de tu producto.

**2. Observa retención, no solo adquisición.** Es fácil lograr que la gente pruebe algo una vez. Es difícil lograr que vuelvan. Si la retención es débil, no tienes PMF todavía.

**3. Resuelve un problema que tienes.** Los productos que construí para usuarios hipotéticos mayormente fallaron. El producto que construí para mí (y gente como yo) tuvo éxito. Hay una razón para eso.

**4. Está dispuesto a matar tus preferidos.** Pasé meses en productos que nunca iban a funcionar. Entre más rápido reconozcas un callejón sin salida, más rápido puedes pivotar a algo mejor.

**5. Itera más rápido de lo que crees que deberías.** No esperes la perfección. Shipea, aprende, arregla, repite. La velocidad de aprendizaje es todo.

**6. No confundas tracción con PMF.** Puedes tener usuarios, revenue, incluso algo de crecimiento — y aún no tener PMF. La prueba real: ¿tus usuarios estarían molestos si tu producto desapareciera mañana? Si la respuesta es "meh," sigue iterando.

**7. Sé paciente pero no terco.** Encontrar PMF toma tiempo. Pero si algo no está funcionando después de un esfuerzo real, no te aferres por ego. Sigue adelante.

---

## Reflexiones finales

Buscar Product Market Fit es frustrante. Vas a construir cosas que nadie quiere. Vas a ilusionarte y ver cómo se colapsan tus esperanzas. Vas a cuestionar si estás perdiendo tu tiempo.

Pero si sigues iterando, sigues escuchando y sigues shipeando, empezarás a notar patrones. Te vas a volver mejor reconociendo señales débiles vs. fuertes. Aprenderás cómo se siente la demanda real.

Y un día, construirás algo que pega. No porque seas más inteligente o más suertudo que antes — porque aprendiste de todas las cosas que no funcionaron.

Eso fue lo que pasó con DailyBot. Después de años de experimentos fallidos, finalmente encontramos el fit. Y valió la pena cada intento fallido que vino antes.

A seguir construyendo.

---

## Recursos

- [Ver slides](https://slides.com/xergioalex/how-we-got-into-y-combinator-276b79)
- [DailyBot](https://www.dailybot.com)
- [Rocka.co](https://rocka.co)
- [Y Combinator: DailyBot](https://www.ycombinator.com/companies/dailybot)
