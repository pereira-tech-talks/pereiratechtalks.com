---
title: "Construye algo que los agentes quieran"
description: "YC reescribió su lema con una palabra. Cloudflare dijo que los agentes ya pueden ser clientes. Dos posts, 48 horas, y el público del software cambió."
pubDate: "2026-05-27"
heroImage: "/images/blog/posts/make-something-agents-want/hero-es.webp"
heroLayout: "side-by-side"
tags: ["tech", "personal", "ai-agents", "cloudflare"]
keywords: ["construye algo que los agentes quieran", "agentes como clientes Cloudflare", "Y Combinator software para agentes", "agentes IA ciudadanos primera clase", "cómo construir software para agentes", "Cloudflare Stripe protocolo agentes", "economía de agentes 2026"]
series: "working-with-agents"
seriesOrder: 6
draft: true
---

Algo cambió en cómo la industria tech habla sobre los agentes de IA, y se puede ver concentrado en dos afirmaciones hechas con días de diferencia.

**27 de abril de 2026.** La cuenta de Y Combinator publica en su [Request for Startups](https://www.ycombinator.com/rfs) una nueva categoría enfocada en *Software for Agents,* firmada por [Aaron Epstein](https://www.ycombinator.com/people/aaron-epstein), General Partner del fondo. El cierre del post dice: *"So if you're Making Something Agents Want, we'd love to hear from you."* ("Así que si estás Construyendo Algo Que los Agentes Quieren, nos encantaría escucharte"). Como [alumni de YC](/es/blog/how-we-got-into-y-combinator/), la frase original — *Make something people want* ("Construye algo que la gente quiera") — lleva años en mi cabeza. Ver una sola palabra cambiada en esa misma oración es el tipo de cosa que notas en la segunda lectura. Del tipo de errores que son intencionales.

<figure>
  <img src="/images/blog/posts/make-something-agents-want/figure-yc-tweet.webp"
       alt="Captura del post de Y Combinator del 27 de abril de 2026 firmado por Aaron Epstein, titulado 'Software for Agents', argumentando que el próximo billón de usuarios de internet serán agentes de IA."
       width="960"
       height="1058"
       loading="lazy" />
  <figcaption>Y Combinator, 27 de abril de 2026 — Aaron Epstein abre el RFS "Software for Agents". — <a href="https://x.com/ycombinator/status/2048834309994565832">Post original</a>.</figcaption>
</figure>

**28 de abril de 2026.** La cuenta de Cloudflare suelta una afirmación que para muchos sonó bastante salvaje: *"Starting today, agents can now be Cloudflare customers."* ("A partir de hoy, los agentes ya pueden ser clientes de Cloudflare.") No "los agentes ya pueden usar Cloudflare." Clientes. La palabra que carga la frase es el sustantivo. Y la afirmación, cuando aterriza así de directa, mueve algo distinto a cuando se dice con pinzas.

<figure>
  <img src="/images/blog/posts/make-something-agents-want/figure-cloudflare-tweet.webp"
       alt="Captura del tweet de Cloudflare del 28 de abril de 2026 anunciando que los agentes ya pueden crear cuentas de Cloudflare, iniciar suscripciones, registrar dominios y recibir tokens de API para desplegar código."
       width="960"
       height="908"
       loading="lazy" />
  <figcaption>Cloudflare, 28 de abril de 2026 — el primer gran proveedor de infraestructura en decirlo en voz alta. — <a href="https://x.com/Cloudflare/status/2049545195914498139">Post original</a>.</figcaption>
</figure>

Dos afirmaciones. Cuarenta y ocho horas de diferencia. Cualquiera de las dos habría sido la noticia principal de su semana. Juntas marcaron una bisagra. YC, la institución que ha moldeado la metodología de startups por dos décadas, le dice a los founders que diseñen para un público que no hace clic. Cloudflare, uno de los mayores proveedores de CDN y edge de la web abierta, declara que ese público ya puede sostener el contrato.

Internet lo notó. Y, siendo internet, también se confundió en dos cosas.

---

## Antes de seguir, una aclaración

Hubo dos lecturas de estos eventos que se propagaron rápido y conviene corregir antes de que el resto del post tenga sentido.

**Lectura uno: "YC cambió su lema."** No lo cambió. [yc.com](https://www.ycombinator.com/) sigue diciendo "Make something people want" al pie de la página. La línea nueva — *"Making Something Agents Want"* — es el cierre de un RFS. Un eco de campaña. Aaron Epstein la escribió como remate de una lista de deseos de startups que quiere ver, invirtiendo a propósito el lema canónico para señalar algo. Eso sigue siendo una señal de tesis, no un rebrand. Es YC diciendo *la metodología sigue aplicando — pero el público acaba de expandirse.*

**Lectura dos: "Cloudflare lo hizo solo."** No. El [post del blog de Cloudflare](https://blog.cloudflare.com/agents-stripe-projects/) lo deja claro en los primeros tres párrafos: la arquitectura es un co-lanzamiento con Stripe. La pieza primitiva debajo es el Machine Payments Protocol — MPP — montado sobre Stripe Projects y los Shared Payment Tokens. En ese mismo post mencionan a PlanetScale como el primer proveedor de infraestructura fuera de Cloudflare en integrarse al mismo carril. El lado de Stripe se lanzó el 29 de abril en [Sessions 2026](https://stripe.com/blog/everything-we-announced-at-sessions-2026).

Entonces el encuadre más preciso es: Cloudflare y Stripe co-lanzaron un protocolo que permite al agente probar quién es su humano, ser facturado sin nunca tocar el número de la tarjeta del humano, y terminar sosteniendo una cuenta cloud propia en su sesión. Cloudflare lideró el anuncio. Stripe construyó la mitad de los rieles. PlanetScale fue el primero en seguir.

Las dos aclaraciones importan para el resto del post, porque la versión más pequeña y precisa de la historia es, en realidad, la más interesante.

---

## Lo que pasa cuando el cliente no eres tú

En [La economía de los agentes](/es/blog/the-agent-economy/), el post que escribí en marzo, rastreé cómo los agentes consiguieron dinero: Stripe SPTs, Visa Intelligent Commerce, Mastercard, Ramp Agent Cards, billeteras agénticas de Coinbase, x402. El encuadre era *agentes como actores económicos.* Esa historia era sobre si los agentes podían pagar.

Esta es otra historia. Esta es sobre si los agentes pueden ser la **contraparte.** No el consumidor en la caja, sino el nombre en el contrato. No la billetera que se carga, sino la cuenta que se factura.

Mira lo que Cloudflare acaba de desempacar. Cinco cosas que tiene cualquier cliente legítimo, descompuestas y reconstruidas para una parte no humana:

| Primitivo | Lo que solía significar | Lo que significa ahora |
|-----------|------------------------|----------------------|
| Cuenta | Una persona llena un formulario | Un agente se provisiona vía flujo OAuth, con Stripe atestiguando al humano detrás |
| Identidad | Un login, un correo, un MFA | Una cadena firmada de delegación — *por cuenta de quién* estás actuando, y con qué límites |
| Cobro | Una tarjeta que se carga | Un Shared Payment Token con tope de USD 100/mes por defecto, atado a un solo comercio, que expira al usarse |
| Contrato | Términos de Servicio que un humano acepta | Un acuerdo de scope on-protocol que firma la parte que despliega al agente |
| Soporte | Documentación, chat, escalamiento | Respuestas de error legibles por máquina, endpoints `.well-known/`, contratos de API que el agente parsea |

Ninguno de esos primitivos es nuevo por sí solo. OAuth es de 2010. Las tarjetas virtuales existen hace años. Lo interesante es que se están **componiendo para una contraparte que no es humana** — y la composición es lo nuevo.

Hay una línea del post de Cloudflare a la que vuelvo: *"Similar to how the OAuth standard made it possible to delegate access to your account to other platforms, the protocol uses OAuth and extends further into payments and account creation, doing so in a way that treats agents as a first-class concern."* ("Similar a cómo el estándar OAuth hizo posible delegar acceso a tu cuenta a otras plataformas, el protocolo usa OAuth y se extiende hasta pagos y creación de cuentas, haciéndolo de una forma que trata a los agentes como una preocupación de primera clase.")

*First-class concern* — preocupación de primera clase. Es la frase con la que hay que sentarse. Durante 20 años, los agentes — bots, scripts, crawlers — fueron de segunda clase. Los aplicaba el rate-limit. Les ponían CAPTCHA. Los baneaban en Ticketmaster. El formulario de signup era un foso, no una feature. Ahora el formulario de signup se está reconstruyendo para que el bot lo use a propósito.

---

## Lo que Paul Graham realmente dijo

La frase "Make something people want" viene de un ensayo que Paul Graham publicó en abril de 2008 llamado ["Be Good"](https://paulgraham.com/good.html). La línea relevante está en el segundo párrafo:

> *"About a month after we started Y Combinator we came up with the phrase that became our motto: 'Make something people want.' We've learned a lot since then, but if I were choosing now that's still the one I'd pick."* ("Cerca de un mes después de que arrancamos Y Combinator se nos ocurrió la frase que se convirtió en nuestro lema: 'Make something people want.' Hemos aprendido mucho desde entonces, pero si tuviera que elegir ahora, seguiría escogiendo esa.")

YC tenía tres años cuando PG escribió eso. La frase ha sobrevivido tres ciclos económicos. Ha sobrevivido la primera década del iPhone, el auge y caída del cripto dos veces, toda la era del SaaS. La razón por la que sobrevivió todo es que es casi imposible discutirla. *Want* — querer — es algo medible. Que alguien quiera algo es lo único que el mercado realmente premia.

Honestamente, pienso en esa frase cada vez que miro una idea de producto. Incluyendo este sitio que estás leyendo. Incluyendo DailyBot.

Cambiarle el sustantivo no es trivial. Los agentes no *quieren* como quieren los humanos. No tienen aburrimiento, ansiedad por el estatus, un círculo de amigos al que impresionar. Lo que tienen son metas, dadas por un humano, y una ventana de contexto, y la paciencia de un proceso. Si la línea de YC significa algo, significa: construye la cosa que hace ese loop más rápido. Construye la cosa que el agente elige porque elegirla acerca la meta del humano.

Es una definición más estrecha de *want* que la original de PG. También es falsable. O el agente elige tu API o no.

---

## Quién paga los errores

No quiero escribir un post de hype. El encuadre tiene problemas, y los escépticos tienen razón al empujar.

La crítica más limpia que encontré es de [Cooley LLP](https://www.cooley.com/news/insight/2026/2026-03-26-ai-agents-and-consumer-law-what-businesses-need-to-know), un despacho de abogados cuyo equipo de IA y derecho del consumidor publicó en marzo un artículo que aterriza un solo punto con una claridad poco común: *"The fact that it is an AI agent, rather than a human, performing these functions does not diminish the business's obligations under consumer protection law."* ("El hecho de que sea un agente de IA, y no un humano, quien realice estas funciones no disminuye las obligaciones del negocio bajo la ley de protección al consumidor.") Traducción — llamar al agente "cliente" no mueve la responsabilidad legal a ninguna parte nueva. Si tu agente compra el dominio equivocado, contrata el plan equivocado, o viola normas de consumidor a escala, la empresa que desplegó al agente sigue siendo la responsable.

Y los agentes sí fallan a escala. No cometen un error. Cometen diez mil. El equipo de Cooley señala una guía de la CMA del Reino Unido del 9 de marzo de 2026 que ya codifica esto: la escala no excusa, agrava.

Después está el vector de abuso. El [comentario más votado](https://news.ycombinator.com/item?id=48031684) en el hilo de Hacker News sobre el lanzamiento de Cloudflare es una sola oración: *"Perfect for spammers, scammers and domain squatters, who can now automate their activities even more."* ("Perfecto para spammers, estafadores y domain squatters, que ahora pueden automatizar aún más sus actividades.") Una línea y aterriza, porque la misma plomería que le permite a un agente legítimo levantar un deploy en segundos le permite a uno hostil levantar miles en la misma ventana. Cloudflare gana plata vendiendo los rieles *y* vendiendo las defensas contra el abuso encima de esos rieles. Eso no es nuevo. Pero sí escala.

No tengo una respuesta limpia a ninguna de las dos críticas. Creo que el encuadre de Cooley es correcto: la responsabilidad legal se queda con quien despliega, y la nueva infraestructura hace más barato ser responsable de muchas cosas al mismo tiempo. La respuesta correcta probablemente es: scopes más estrechos por agente, topes duros de gasto, audit trails que todos en el loop puedan leer, y una postura mucho más estricta sobre lo que un agente sin supervisión humana tiene permitido hacer.

Que, por cierto, es básicamente lo que el tope por defecto de USD 100/mes de Stripe ya implica. Ellos vieron lo mismo.

---

## Por qué no vendrá de los incumbentes

El tweet de Aaron Epstein cierra con una frase que sigo subrayando: *"...that won't come from incumbents."* ("...y eso no va a venir de los incumbentes.")

Llevo pensando en por qué probablemente tiene razón.

Los incumbentes — Salesforce, SAP, Workday, Oracle, todo el stack empresarial cobrado por silla — tienen tres lastres que se acumulan. Su interfaz está construida alrededor de dropdowns y dashboards optimizados para humanos que hacen clic. Su precio es por silla, que se rompe en el momento en que la silla es un agente que ejecuta 10.000 acciones al día por un solo humano. Su capital de marca está construido sobre entrenamientos, certificaciones, conferencias llenas de humanos con cordón de marca al cuello. Reconstruir cualquiera de los tres para un público agent-first es un cambio arquitectónico. Reconstruir los tres es otra empresa.

No es imposible. Microsoft viene incorporando Copilot dentro de Office a buena velocidad. Stripe acaba de demostrar que una empresa de pagos veterana puede publicar un protocolo nuevo en cuestión de meses. Pero la fricción es real, y la fricción es asimétrica. Un recién llegado no tiene UI legacy que deprecar. Un recién llegado no tiene que migrar decenas de miles de contratos empresariales fuera del per-seat. Un recién llegado puede simplemente despachar la versión API-first y llamarla el producto.

[La lectura de The Next Web](https://thenextweb.com/news/yc-summer-2026-rfs-hard-tech-pivot) sobre el RFS de YC apuntó al mismo punto en una frase a la que vuelvo: *"Software is now the substrate, not the moat. The models are commoditising. The infrastructure is scaling."* ("El software ahora es el sustrato, no el foso. Los modelos se están commoditizando. La infraestructura está escalando.") Si el software es el sustrato, el foso se mueve hacia arriba — a la interfaz con forma de agente y a quien aterrice el protocolo primero. Ahí aparecen las empresas nuevas.

El post que escribí en abril sobre [la Semana de Agentes de Cloudflare](/es/blog/cloudflare-agents-week-2026/) rastreó el push completo de infraestructura — sandboxes, navegadores, correo, identidad. Lo que cambió ahora no es la *infraestructura.* La infraestructura ya estaba. Lo que cambió es la *relación.* La infraestructura ahora viene respaldada por la propuesta de que el agente sostiene la cuenta, no solo la usa.

---

## Lo que estoy cambiando en mi propio trabajo

Específicos, no abstracciones. Esto es lo que cambié desde que se publicaron esos dos posts.

**En este sitio.** Hace unas semanas lancé [Markdown for Agents](/es/blog/aeo-markdown-for-agents/) — cada página HTML de xergioalex.com tiene un endpoint `.md` espejo. Esa misma semana corrí [isitagentready.com](https://isitagentready.com/) contra el sitio. Saqué 33/100. Contenido era la única categoría al máximo; todo lo demás — descubribilidad, control de acceso de bots, la familia `.well-known/` — quedó como trabajo pendiente. Estoy trabajando en el resto de ese scorecard ahora, y voy a escribirlo cuando cruce 80.

**En el stack de agentes que uso para trabajo de clientes.** Mantengo un set pequeño de servidores MCP privados — para búsqueda en repos, para recuperación de documentos de cliente, para un par de pipelines internos de datos. Después del anuncio de Cloudflare volví a revisarlos y agregué dos cosas que había estado posponiendo: scopes más estrechos por consumidor (para que un agente de código literalmente no pueda llamar a la herramienta de facturación) y topes duros de gasto diario atados a la identidad del agente. Ambas tomaron una tarde. Ambas tenían que haber estado desde el inicio. El artículo de Cooley me empujó.

**En DailyBot.** No voy a escribir la versión larga acá — es un post aparte, y no me toca solo a mí escribirlo — pero la conversación dentro del equipo sobre interfaces agent-first cambió de forma desde estos dos anuncios. Ya éramos una compañía de YC S21 construyendo para la colaboración humano + agente. La pregunta ahora es más estrecha: ¿cómo se siente la experiencia del *agente* dentro de nuestro producto, y qué superficies deberían exponer esa experiencia por defecto?

Creo que muchos equipos están teniendo una versión de esta conversación ahora mismo. Creo que la mayoría todavía la está calibrando como una pregunta de roadmap de features cuando es más cercano a una pregunta de posicionamiento.

La forma más simple de plantearlo: hace un año, la pregunta era *si mi producto funciona con agentes.* Este año es *si un agente que funciona elegiría mi producto.*

---

## Cierre

*Make something people want* no se retiró. Se generalizó. La frase de PG se escribió cuando "usuarios" significaba humanos haciendo clic. Veinte años después significa algo más borroso — en parte humanos, en parte los agentes actuando por ellos, y cada vez más los agentes actuando por sus propias metas dentro de los scopes que los humanos definen. La metodología aplica. El público se expandió.

Si estás construyendo ahora, la pregunta que Aaron Epstein metió en el RFS es la que toca sostener. No como slogan. Como función forzante. *¿Un agente que funciona elegiría esto?* Si la respuesta es "sí, eventualmente, después de que rediseñemos la UI," la respuesta es no. El agente ya está decidiendo. El rediseño es el trabajo.

A seguir construyendo.

---

## Recursos

- [Cloudflare — los agentes ya pueden crear cuentas, comprar dominios y desplegar](https://blog.cloudflare.com/agents-stripe-projects/) — el post del lanzamiento, firmado por Sid Chatterjee y Brendan Irvine-Broque, con la arquitectura completa del Machine Payments Protocol y la integración con Stripe Projects.
- [Tweet de Cloudflare anunciando el lanzamiento](https://x.com/Cloudflare/status/2049545195914498139) — la línea que llegó a 1,6M de vistas.
- [Stripe — Todo lo que anunciamos en Sessions 2026](https://stripe.com/blog/everything-we-announced-at-sessions-2026) — Stripe Projects, Shared Payment Tokens, y el Machine Payments Protocol desde el lado de Stripe.
- [Y Combinator — Software for Agents (RFS)](https://www.ycombinator.com/rfs#software-for-agents) — la categoría del RFS de YC para el verano de 2026 firmada por Aaron Epstein, fuente del cierre "Making Something Agents Want".
- [Tweet de Y Combinator — Aaron Epstein](https://x.com/ycombinator/status/2048834309994565832) — el post que abrió el encuadre.
- [Aaron Epstein en Y Combinator](https://www.ycombinator.com/people/aaron-epstein) — perfil del autor.
- [Paul Graham — "Be Good"](https://paulgraham.com/good.html) — la fuente escrita canónica de "Make something people want".
- [Cooley LLP — AI Agents y derecho del consumidor](https://www.cooley.com/news/insight/2026/2026-03-26-ai-agents-and-consumer-law-what-businesses-need-to-know) — la crítica de protección al consumidor al encuadre de agentes-como-clientes.
- [InfoQ — Cloudflare y Stripe envían comercio agéntico](https://www.infoq.com/news/2026/05/cloudflare-stripe-agent-commerce/) — Steef-Jan Wiggers sobre la implementación a nivel de producción y sus riesgos abiertos.
- [TechCrunch — Stripe Link para agentes de IA](https://techcrunch.com/2026/04/30/stripe-link-digital-wallet-ai-agents-shopping/) — Sarah Perez sobre el lado consumidor de la misma arquitectura.
- [The Next Web — el giro hard-tech del RFS de YC](https://thenextweb.com/news/yc-summer-2026-rfs-hard-tech-pivot) — Cristian Dina sobre lo que el RFS señala sobre defensibilidad.
- [Hilo de Hacker News sobre el anuncio de Cloudflare](https://news.ycombinator.com/item?id=48031684) — incluyendo la crítica sobre spam y automatización.
