---
title: 'OpenClaw: Tu asistente. Tu máquina. Tus reglas. — Cómo se convirtió en un movimiento'
description: 'La historia de OpenClaw y el nacimiento de los asistentes personales de IA — un paradigma de agentes locales, abiertos y tuyos, no de una empresa.'
pubDate: '2026-04-13'
updatedDate: '2026-04-19'
heroImage: '/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/hero-es.webp'
heroLayout: 'side-by-side'
tags: ["tech", "ai-agents", "cloudflare", "openclaw", "claude"]
keywords: ['OpenClaw qué es', 'agente de IA personal código abierto', 'Peter Steinberger historia', 'OpenClaw configuración Markdown', 'proyecto open source más popular GitHub', 'NemoClaw NVIDIA seguridad agentes', 'OpenClaw 2026 reseña']
series: 'mastering-openclaw'
seriesOrder: 1
---

[*"Your assistant. Your machine. Your rules."*](https://docs.openclaw.ai/start/lore) ("Tu asistente. Tu máquina. Tus reglas.")

Seis palabras. Ese es el lema de OpenClaw — el agente de IA personal que rompió todos los récords de crecimiento en la historia del software open source. Y de alguna manera esas seis palabras capturaron algo que millones de personas no sabían que querían hasta que alguien lo construyó.

OpenClaw corre en tu computador. No en la nube de alguien más. Lo configuras escribiendo en lenguaje natural — sin tener que programar, sin aprender un framework, sin memorizar sintaxis especial. Solo archivos Markdown describiendo cómo debe comportarse. Te habla por WhatsApp, Telegram o cualquier app de mensajería que ya uses. Y se conecta al modelo de lenguaje que tú elijas — GPT, Gemini, Codex, DeepSeek, Claude (con API key, ya que Anthropic bloqueó el acceso por suscripción), modelos locales, lo que quieras.

Esa descripción ya suena poderosa. Pero ni siquiera captura lo que pasó después: Jensen Huang llamándolo ["el nuevo Linux"](https://www.fierce-network.com/broadband/nvidia-gtc-openclaw-new-linux-and-every-company-needs-strategy-says-jensen-huang) en el GTC 2026. De cero a más de 340,000 estrellas en menos de cinco meses, superando la trayectoria de una década de [React](https://github.com/facebook/react) en una fracción del tiempo.

Pero hizo todo eso. Y creo que la razón es simple: OpenClaw no resolvió un problema técnico. Resolvió uno humano. La idea de que tu asistente de IA debería ser *tuyo* — no alquilado, no encerrado detrás de una suscripción, no controlado por una plataforma — resulta que era algo que mucha gente estaba esperando sin saberlo.

Ya había escrito sobre OpenClaw en mi serie [Trabajando con Agentes](/es/blog/series/working-with-agents). Pero este proyecto merece su propio espacio. La persona detrás, las decisiones técnicas, el caos comunitario, los problemas de seguridad, la explosión del ecosistema — entender OpenClaw es entender hacia dónde va la computación personal.

Empecemos por la persona. Porque esta historia no tiene sentido sin él.

---

## Peter Steinberger: El hombre detrás de la langosta

Peter Steinberger nació en 1986 en la Austria rural. El campo. Vacas. Nada de tecnología. A los catorce años, un invitado de verano le mostró un computador, y eso fue todo — el switch se encendió y ya no se apagó. Estudió informática médica en la Universidad Tecnológica de Viena, donde terminó dando el primer curso de desarrollo para Mac e iOS de la universidad. Fue a su primera [WWDC](https://semaphore.io/blog/peter-steinberger-startup-journey-pdf-quirks-and-wwdc19) — la conferencia anual de Apple para desarrolladores — sobrevivió una maratón de entrevistas de ocho horas, y le ofrecieron trabajo en San Francisco.

En 2011, mientras esperaba una visa de trabajo que tardó nueve meses, fundó [PSPDFKit](https://pspdfkit.com/) con Martin Schurrer. La idea era resolver el renderizado de PDFs en iPads — un problema que sonaba pequeño hasta que te dabas cuenta de que todo el mundo necesitaba resolverlo. Bootstrapped desde el día uno. Sin inversión externa. Sin pitch decks. Sin rondas de financiación. Solo dos tipos construyendo un producto que funcionaba.

Para 2021, apps construidas sobre PSPDFKit estaban corriendo en casi mil millones de dispositivos. Los clientes incluían a Dropbox, SAP, DocuSign, Apple. En octubre de ese año, [Insight Partners les puso 100 millones de euros encima de la mesa](https://techcrunch.com/2021/10/01/pspdfkit-raises-116m-its-first-outside-money-now-nearly-1b-people-use-apps-powered-by-its-collaboration-signing-and-markup-tools/) — su primer dinero externo en diez años de operación. Diez años sin necesitar a nadie. Eso dice mucho sobre el tipo de persona que es Peter.

Con esa misma operación — octubre de 2021, cuando Insight entró en PSPDFKit — Peter **vendió la mayor parte de su participación** para **dedicarse a nuevos proyectos**. No es solo capital para la empresa en la nota de prensa; es liquidez, un cierre explícito de etapa como fundador-accionista central y un carril abierto para otra cosa.

Y justo en esa transición — cuando por fuera todo parece “misión cumplida” — llegó lo que los titulares casi nunca emparejan con una gran ronda de financiación: **el vacío**. Dos o tres años sin poder escribir código. Sin proyectos. Sin chispa. Burnout puro, del que no se cura con unas vacaciones de dos semanas. En su [entrevista con Lex Fridman](https://lexfridman.com/peter-steinberger/) lo describió con una honestidad que rara vez ves en alguien que acaba de pasar por un **evento de liquidez personal**: *"If you wake up in the morning, and you have nothing to look forward to, that gets very boring, very fast"* ("Si te levantas en la mañana y no tienes nada que esperar, te vuelves muy aburrido, muy rápido").

La frase que más me quedó fue cuando se comparó con Austin Powers cuando le sacan el mojo: *"I couldn't get code out anymore. I was just, like, staring and feeling empty."* ("Ya no podía sacar código. Solo me quedaba mirando la pantalla, sintiéndome vacío.") Usó una referencia de Austin Powers: la escena donde le extraen el mojo, la energía creativa que lo define. Sin mojo, Austin Powers pierde todo lo que lo hace él. Sin código, Peter se sentía un founder sin propósito.

Compró un tiquete de solo ida a Madrid. Desapareció. Se desconectó del mundo tech. Y en algún punto durante ese proceso encontró la IA. O la IA lo encontró a él. Cuando empezó a jugar con modelos de lenguaje, algo se reactivó. El fuego creativo que pensó que había perdido para siempre.

En mayo de 2025, [tuiteó](https://x.com/steipete/status/1925983535958999393) una captura de su actividad en GitHub con un mensaje que lo decía todo: *"When you get your spark 🌟 back."* ("Cuando recuperas tu chispa.") Había vuelto a codear sin parar.

<figure>
<img src="/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/steipete-spark-tweet.webp" alt="Tweet de Peter Steinberger mostrando su gráfico de contribuciones en GitHub con el mensaje When you get your spark back" width="1170" height="844" loading="lazy" />
<figcaption>Peter Steinberger en X, mayo 2025: "When you get your spark back." — <a href="https://x.com/steipete/status/1925983535958999393">Ver tweet original</a>.</figcaption>
</figure>

Un mes después publicó [*"Finding My Spark Again"*](https://steipete.me/posts/2025/finding-my-spark-again) ("Encontrando mi chispa de nuevo") en su blog — un post donde cuenta todo el proceso, desde el vacío hasta el momento en que se sentó frente a la terminal y algo hizo click de nuevo.

Volvió distinto. Más ligero. Más directo sobre lo que quería. Lo resumió en [una frase que luego citó Frederick AI](https://www.frederick.ai/blog/peter-steinberger-openclaw): *"I don't do this for the money. I want to have fun and have impact."* ("No hago esto por el dinero. Quiero divertirme y tener impacto.")

Cuando dicen que un founder "encontró su siguiente cosa" suena a cliché de TechCrunch. Pero en el caso de Peter fue literal: estaba apagado, y la IA lo prendió.

---

## El nacimiento: De un puente con WhatsApp a fenómeno viral

La historia del origen de OpenClaw suena a invento. Alguien que la escucha por primera vez piensa que es marketing. No lo es.

En noviembre de 2025, Peter estaba jugando con Claude — como hacemos muchos — y [le molestaba que no existiera una forma simple de hablar con un modelo de IA desde WhatsApp](https://lexfridman.com/peter-steinberger-transcript/). Así de mundano fue el problema. No estaba intentando construir la plataforma de agentes más grande del mundo. Estaba irritado porque algo que debería existir no existía.

Así que le dijo a Claude: hazlo. Y Claude lo hizo. En una hora, más o menos, tenía un puente funcional entre WhatsApp y un modelo de lenguaje. Sin memoria, sin herramientas — solo mensajes de ida y vuelta.

Pero aquí viene un detalle que cambia la historia. Aunque el prototipo nació con Claude, casi todo el resto del desarrollo de OpenClaw lo hizo con [Codex, el agente de programación de OpenAI](https://lexfridman.com/peter-steinberger/). En su entrevista con Lex Fridman, Peter se describió como *"the biggest Codex advertisement show that's unpaid"* ("el anuncio gratuito más grande de Codex"), y contó que ponía entre 5 y 10 agentes Codex a trabajar en paralelo como si fueran su propio equipo de desarrollo. La ironía no es menor: el proyecto nació con el nombre de Claude, pero la mayoría del código lo escribió un agente de OpenAI.

Con Codex como equipo, Peter siguió construyendo: agregó memoria persistente, acceso a archivos, tareas programadas, y soporte para Telegram, Signal, Discord. Cada función nueva atraía más desarrolladores.

El proyecto original no se llamaba OpenClaw — se llamaba Clawdbot. El nombre se lo sugirió Claude, un juego de palabras con "Claude" y "claw" (garra). Como la langosta que eventualmente se convertiría en el ícono del proyecto.

Peter lo publicó en GitHub, compartió el enlace, y se fue a dormir.

Al principio no pasó nada extraordinario. Unos pocos cientos de desarrolladores lo descubrieron, lo probaron, lo starrearon. [A las dos semanas apenas tenía unos 2,000 estrellas](https://remoteopenclaw.com/blog/who-made-openclaw) — bueno para un proyecto indie, pero nada del otro mundo. Así pasaron dos meses de crecimiento lento, orgánico, casi silencioso.

Y entonces, a finales de enero de 2026, algo se rompió. El proyecto pasó de curiosidad de nicho a tendencia dominante de GitHub en cuestión de días. [9,000 estrellas nuevas en un día. 34,000 en 48 horas. Más de 180,000 en dos semanas.](https://star-history.com/#openclaw/openclaw&Date) Lo que había sido un experimento de fin de semana se convirtió en el repositorio más comentado de la plataforma.

Para poner eso en perspectiva: [React](https://github.com/facebook/react) — la librería de JavaScript más popular del planeta, respaldada por Meta, usada por millones de desarrolladores — tardó más de una década en llegar a 250,000 estrellas en GitHub. OpenClaw [pasó esa marca alrededor del 3 de marzo de 2026](https://star-history.com/#openclaw/openclaw&Date) — aproximadamente 60 días después de su lanzamiento. El kernel de Linux llegó a 225,000 después de más de 30 años. OpenClaw lo superó en menos de dos meses de existencia.

Si pones las tres curvas en el mismo gráfico, la diferencia es absurda:

<figure>
<img src="/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/star-history-openclaw-react-linux.webp" alt="Gráfico de star history comparando OpenClaw, React y Linux en GitHub. La curva de OpenClaw sube casi verticalmente en 2026 y supera a React y Linux en pocas semanas" width="1468" height="984" loading="lazy" />
<figcaption>Star history: OpenClaw vs React vs Linux. Fuente: <a href="https://star-history.com/">star-history.com</a>.</figcaption>
</figure>

Esa línea roja vertical en 2026 es OpenClaw. No es un error del gráfico — así se ve cuando un proyecto pasa de cero a la historia en cuestión de semanas. Y si aislas solo la curva de OpenClaw para ver qué pasó exactamente, la historia se vuelve todavía más rara:

<figure>
<img src="/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/star-history-openclaw-solo.webp" alt="Gráfico de star history de OpenClaw desde diciembre de 2025 hasta abril de 2026 mostrando un crecimiento explosivo desde finales de enero" width="1452" height="978" loading="lazy" />
<figcaption>Star history de OpenClaw, diciembre 2025 – abril 2026. Fuente: <a href="https://star-history.com/">star-history.com</a>.</figcaption>
</figure>

Desde noviembre hasta finales de enero, casi plano. Luego, en cuestión de días, la curva se dispara y no para. A abril de 2026 sigue creciendo — no es un pico viral que se apagó, es una adopción sostenida.

La velocidad con la que creció desafía toda lógica que conozco sobre adopción de software open source. Y creo que la razón es simple: OpenClaw llenó un vacío que nadie sabía que existía hasta que alguien lo llenó.

Hay que decirlo: no todo el mundo se comió el cuento. [Análisis independientes del GitHub Archive](https://www.aicerts.ai/news/openclaws-github-stars-controversy-hits-200k/) encontraron patrones raros — saltos de más de 25,000 estrellas en un solo día, bloques enteros de estrellas con timestamps casi idénticos. Algunos investigadores señalaron que el proceso de instalación podía estar empujando a los usuarios a darle estrella al repositorio, inflando artificialmente el contador. [The New Stack también cubrió la controversia](https://thenewstack.io/openclaw-github-stars-security/). Ninguna auditoría formal confirmó manipulación deliberada, pero la duda quedó en el aire.

Aun así — y esto es importante — los números de adopción real son difíciles de discutir. 70,000 forks. 14,000 commits. 1,200+ contribuidores. La gente no forkea un repo por moda. Lo forkea porque lo usa. Y aunque el contador de estrellas tenga algo de ruido, eso no le quita mérito a lo que representa OpenClaw como fenómeno.

Un desarrollador irritado, una hora de prompting inicial, y el proyecto open source de más rápido crecimiento en la historia de GitHub.

---

## El triple rebrand

Aquí la historia se sale de control. Y por "se sale de control" me refiero a que involucra abogados corporativos, estafadores de criptomonedas y una metáfora de langosta mudando de caparazón.

Para el 27 de enero de 2026, las búsquedas de "clawdbot" en Google habían superado a "claude code" y "codex" combinados. De cero a dominar Google Trends en cuestión de días. La gente estaba buscando "clawdbot" más que el propio producto de Anthropic — y la confusión entre los nombres no le hizo gracia a la empresa detrás de Claude.

<figure>
<img src="/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/google-trends-clawdbot-vs-claude.webp" alt="Google Trends al 27 de enero de 2026: las búsquedas de clawdbot superan a claude code y codex" width="1644" height="1328" loading="lazy" />
<figcaption>Google Trends, 27 de enero de 2026: "clawdbot" supera a "claude code" y "codex." Fuente: <a href="https://newsletter.pragmaticengineer.com/p/the-creator-of-clawd-i-ship-code">The Pragmatic Engineer</a>.</figcaption>
</figure>

La reacción de Anthropic no se hizo esperar: [le mandaron a Peter una carta de cese y desista](https://x.com/steipete/status/2016079236780449975). El argumento: "Clawdbot" era demasiado parecido a "Claude." Y tenían razón, para ser honestos — el nombre era literalmente un juego de palabras con Claude. Pero el timing fue brutal. El proyecto acababa de explotar y de repente tenían que cambiarlo todo.

<figure>
<img src="/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/steipete-anthropic-rename-tweet.webp" alt="Tweet de Peter Steinberger: I was forced to rename the account by Anthropic. Wasn't my decision." width="1178" height="434" loading="lazy" />
<figcaption>Peter Steinberger en X, 27 de enero de 2026 — <a href="https://x.com/steipete/status/2016079236780449975">Ver tweet original</a>.</figcaption>
</figure>

Lo que siguió fue una lluvia de ideas en Discord a las 5 de la mañana. La comunidad propuso docenas de nombres. Alguien sugirió "Moltbot" — del inglés "molt" (mudar, como hacen las langostas cuando cambian de caparazón). La metáfora funcionaba: el proyecto estaba creciendo tan rápido que tenía que soltar su vieja piel para seguir avanzando. Se quedaron con Moltbot.

Pero entonces llegaron los estafadores.

Cuando Peter renombró la cuenta de @clawdbot a @moltbot en X, el handle original quedó libre. En cuestión de segundos, alguien lo tomó y lanzó una criptomoneda llamada $CLAWD. Inflaron el precio con hype, vendieron todo de golpe, y desaparecieron. La estafa clásica. La gente pensó que era oficial y empezaron a comprar. Peter describió lo que siguió como *"the worst form of online harassment I've experienced"* ("la peor forma de acoso online que he experimentado"). Y el acoso no vino solo de los estafadores — vino de las mismas víctimas. La gente que perdió dinero empezó a culparlo a él. Lo acusaron de estar involucrado en la estafa, de ser cómplice, de haber lanzado el token y luego negarlo. Le exigieron que "asumiera la responsabilidad," lo presionaron para que avalara proyectos de los que nunca había oído. Peter tuvo que salir públicamente a [pedirles que pararan](https://x.com/steipete/status/2016072109601001611): nunca emitió un token, nunca tuvo nada que ver con CLAWD, no tenía forma de devolverles su dinero. Pero la ola de mensajes no paraba.

<figure>
<img src="/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/steipete-stop-harassing-tweet.webp" alt="Tweet de Peter Steinberger pidiéndole a la gente de crypto que deje de hostigarlo por el token CLAWD" width="1186" height="648" loading="lazy" />
<figcaption>Peter Steinberger en X, 27 de enero de 2026 — <a href="https://x.com/steipete/status/2016072109601001611">Ver tweet original</a>.</figcaption>
</figure>

Y en medio de todo ese caos, Peter se dio cuenta de algo peor: Moltbot, como nombre, ya no tenía salvación. Cada vez que alguien buscaba "Moltbot," los primeros resultados eran sobre la estafa del token $CLAWD, no sobre el proyecto. La comunidad asociaba el nombre con el caos del rebrand mal ejecutado. Y para colmo, Peter mismo admitió que "Moltbot" nunca rodó bien en la lengua — sonaba raro al decirlo, le faltaba peso. El nombre había nacido muerto y la estafa terminó de enterrarlo.

Entonces tomó una decisión que en ese momento sonaba absurda: rebrand otra vez. Tercer nombre en menos de una semana. Pero había una razón más profunda que el problema fonético o la marca manchada. Peter quería enviar una señal clara sobre hacia dónde iba el proyecto: no hacia una empresa, sino hacia una fundación open source, independiente, gobernada por la comunidad. "Moltbot" sonaba a producto. "OpenClaw" sonaba a movimiento. El prefijo "Open" no era casualidad — era un compromiso explícito con mantener el proyecto abierto, libre, y fuera del control de cualquier empresa individual.

Y esta vez decidió hacerlo bien. La solución salió cara: $10,000 por una cuenta business de X. Ese pago le sirvió para tres cosas a la vez — reclamar el handle @OpenClaw, que llevaba sin usarse desde 2016; obtener la verificación oficial para que los estafadores no pudieran clonar su presencia; y recuperar un canal directo con la comunidad para desmentir la estafa en tiempo real.

[*"The lobster has molted into its final form."*](https://x.com/openclaw/status/2017103710959075434) ("La langosta ha completado su muda final."), anunció en X el 30 de enero de 2026, el día del rebrand final. El tweet cerraba con el lema que terminaría definiendo el proyecto: *"Your assistant. Your machine. Your rules."* ("Tu asistente. Tu máquina. Tus reglas.")

<figure>
<img src="/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/openclaw-final-form-tweet.webp" alt="Tweet oficial de OpenClaw anunciando el rebrand final: The lobster has molted into its final form. Clawd → Moltbot → OpenClaw. 100k+ GitHub stars. 2M visitors in a week. Your assistant. Your machine. Your rules." width="1188" height="1264" loading="lazy" />
<figcaption>Cuenta oficial de OpenClaw en X, 30 de enero de 2026 — <a href="https://x.com/openclaw/status/2017103710959075434">Ver tweet original</a>.</figcaption>
</figure>

Si la industria del software tuviera una categoría de drama literario, los primeros tres meses de OpenClaw ganarían el premio.

Y como suele pasar con este tipo de historias, la comunidad empezó a hacer memes sobre toda la evolución. Ilustraciones curiosas, bastante creativas, contando el arco de Clawdbot a Moltbot a OpenClaw. Aquí va la mía:

<figure>
<img src="/images/blog/posts/openclaw-your-assistant-your-machine-your-rules/openclaw-evolution-meme.webp" alt="Ilustración mostrando la evolución de OpenClaw: de Clawdbot a Moltbot a OpenClaw" width="1509" height="1022" loading="lazy" />
<figcaption>La evolución de OpenClaw: Clawdbot → Moltbot → OpenClaw.</figcaption>
</figure>

---

## Qué es realmente OpenClaw

Con todo el ruido, los números virales y el drama corporativo, es fácil perder de vista qué es realmente OpenClaw. Así que voy a intentar explicarlo de la forma más clara que pueda.

OpenClaw es un agente de IA personal que corre donde tú quieras. Si prefieres desplegarlo en la nube — en tu propio servidor, en un VPS, en AWS, en Cloudflare — puedes hacerlo. Pero lo más interesante, y lo que realmente lo hizo explotar, es que por primera vez tenías la opción de correrlo en tu propia máquina. En tu computador. Mac, Windows o Linux. No en los servidores de alguien más. Es open source, es gratis, y es tuyo.

La diferencia clave con algo como ChatGPT o Claude.ai — al menos como eran en ese momento — es que OpenClaw tenía "ojos y manos." No era un chatbot al que le haces preguntas y te da respuestas. Era un agente que podía navegar la web, leer y escribir archivos en tu disco, ejecutar comandos en la terminal, enviar mensajes por WhatsApp o Telegram — actuar en el mundo real, no solo hablar sobre él. Si lo configurabas así, podía tener control total de la máquina donde se ejecutaba: tu sistema de archivos, tus credenciales, tus procesos, todo. Eso era parte de su poder — y parte de por qué la seguridad se volvió un problema tan grande tan rápido.

Hoy esa diferencia ya no es tan nítida. Gracias al impacto de OpenClaw, prácticamente todos los agentes grandes — ChatGPT, Claude, Gemini, Copilot — han incorporado capacidades similares: acceso a archivos, ejecución de tareas, integraciones con apps externas. Pero lo que OpenClaw hizo distinto, y lo que marcó el disparador, fue poner todas esas capacidades de forma abierta y con control total por defecto. No había permisos escondidos ni sandbox opaco — le dabas acceso a lo que quisieras y el agente lo usaba. Eso hacía que el primer contacto con OpenClaw se sintiera mágico: le pedías algo y lo hacía, en tu propia máquina, sin pedirte permiso en cada paso.

Y también se sentía salvaje. Esa es la palabra que mejor captura cómo era usar OpenClaw en sus primeras semanas — un ambiente hostil, sin reglas, sin barandas. Anarquía pura. Le dabas acceso a tu disco y él hacía lo que le pedías — y a veces un poco más. Porque cuando tus instrucciones eran ambiguas o poco detalladas, el modelo rellenaba los huecos con lo que creía que querías, y a veces acertaba y a veces hacía cosas que nunca pediste. No había un "¿estás seguro?" antes de cada acción. No había logs amigables. No había recuperación. Si la cagabas, la cagabas. Y paradójicamente, esa sensación de riesgo era parte de la magia — hacía que se sintiera real, vivo, como estar manejando algo poderoso de verdad en lugar de un juguete con chaleco salvavidas.

Esa sensación de magia se ha ido perdiendo con el tiempo. Los problemas de seguridad obligaron al proyecto a agregar capas de confirmación, sandboxes, permisos granulares. Fue un mal necesario — porque el control total por defecto resultó ser demasiado peligroso a esa escala, y porque el proyecto no iba a sobrevivir si los usuarios seguían perdiendo archivos, credenciales, siendo hackeados, exponiendo datos confidenciales, o peor. Pero en su momento, esa libertad fue lo que más impacto generó. OpenClaw no solo ganó adopción — redefinió el estándar mínimo de lo que significa ser un agente.

Y es agnóstico al modelo. Le puedes poner GPT, Gemini, Codex, DeepSeek, Llama, Mistral, Claude (con API key, ya que Anthropic bloqueó el acceso por suscripción), o cualquier modelo local que corras en tu máquina, por ejemplo con Ollama. El agente no es el modelo — el agente es la capa de arriba que decide qué hacer, cuándo hacerlo y cómo hacerlo. El modelo es el cerebro, pero OpenClaw es el cuerpo.

Lo que más me sorprendió cuando empecé a estudiar la arquitectura es que la mente del agente vive en archivos Markdown. Toda la configuración, toda la personalidad, toda la lógica del agente. Son 7 archivos de texto plano:

- **SOUL.md** — La personalidad y los valores del agente. Sus límites, su tono, cómo debe comportarse. El primer archivo que se inyecta al contexto al iniciar una sesión.
- **IDENTITY.md** — Metadatos públicos: nombre, rol, avatar. Lo que el agente le dice al mundo cuando le preguntan quién es.
- **USER.md** — Contexto sobre ti, el humano. Tu nombre, tu zona horaria, tus preferencias, tu trabajo. Lo que hace que el agente sienta que te conoce.
- **TOOLS.md** — Las capacidades del agente: qué herramientas tiene disponibles y cómo usarlas.
- **HEARTBEAT.md** — Una lista de chequeo que el agente repasa por su cuenta cada cierto tiempo. "Cada 30 minutos, revisa si el disco está lleno." "Cada lunes a las 8 AM, genera el resumen semanal." Cosas que el agente debería mirar sin que se las pidas, en su propio ritmo.
- **AGENTS.md** — Procedimientos operativos. Cómo debe manejar diferentes tipos de solicitudes, flujos de trabajo, caminos de escalamiento.
- **MEMORY.md** — Aprendizaje persistente. Lo que el agente ha aprendido de ti con el tiempo, curado a lo que más importa.

Las Skills — las capacidades que puedes instalar y compartir — son también archivos Markdown. YAML en el header, instrucciones en Markdown en el cuerpo. Sin código. Sin frameworks. Si sabes escribir un documento, puedes crear un agente que se sienta tuyo. Esa decisión de diseño — Markdown como lenguaje de configuración para agentes — es probablemente la razón más importante por la que OpenClaw creció tan rápido. Le bajó la barrera de entrada a prácticamente cero.

Y no es coincidencia. Markdown se está convirtiendo en el formato universal para configurar agentes en toda la industria. `AGENTS.md` se perfila como el estándar de facto — Codex, Cursor y Antigravity ya lo adoptaron — y otros proyectos usan variantes similares: Claude Code tiene su `CLAUDE.md`, OpenClaw tiene sus 7 archivos. Hablé de por qué está pasando esto en un [artículo sobre Markdown como lenguaje de los agentes](/es/blog/aeo-markdown-for-agents): básicamente, los LLMs leen texto plano mejor que cualquier otro formato, y los humanos también. Es una convergencia rara donde el formato más simple resulta ser el más poderoso. OpenClaw no inventó la idea, pero la llevó a una escala que nadie había visto.

La filosofía del proyecto se resume en una frase de su [documentación oficial](https://docs.openclaw.ai/start/lore): *"Your assistant. Your machine. Your rules."* ("Tu asistente. Tu máquina. Tus reglas.")

Suena simple. Lo es. Y eso es exactamente lo que lo hace poderoso.

---

## La explosión del ecosistema

Las estrellas en GitHub son métricas de vanidad. Los números de uso cuentan otra historia: según los reportes del proyecto, OpenClaw pasó los 3 millones de usuarios activos mensuales — no descargas, no instalaciones, usuarios corriendo agentes en sus máquinas todos los meses. Cientos de miles de instancias ejecutándose globalmente en cualquier momento dado. Más de 15,000 Skills publicados en [ClawHub](https://clawhub.ai/) — el marketplace de capacidades comunitarias — creciendo desde unos pocos cientos al lanzamiento.

Y alrededor de todo esto, un ecosistema. Decenas de startups se construyeron sobre OpenClaw en cuestión de semanas: servicios, integraciones, agentes especializados para industrias específicas. Los números exactos son difíciles de fijar porque el ecosistema se mueve más rápido de lo que cualquiera puede contar. Pero la comunidad empezó a construir cosas que el creador original nunca imaginó. OpenClaw no fue la excepción — fue el caso más extremo de este fenómeno que he visto.

NVIDIA lanzó [NemoClaw](https://nvidianews.nvidia.com/news/nvidia-announces-nemoclaw) en el GTC 2026 — una capa de seguridad y gobernanza empresarial construida encima de OpenClaw. No es un fork. Es OpenClaw con guardarraíles para empresas que necesitan compliance, auditoría, y control sobre lo que los agentes pueden y no pueden hacer. Socios de lanzamiento incluyendo Adobe, Salesforce, SAP, ServiceNow, Siemens y CrowdStrike.

[Tencent construyó ClawPro](https://www.scmp.com/tech/article/3348942/tencent-expands-openclaw-suite-enterprise-tool-amid-chinas-lobster-craze) — su propia adaptación para el mercado chino empresarial. En China, OpenClaw se convirtió en un fenómeno cultural: la gente habla de "criar una langosta." Desde estudiantes de colegio hasta jubilados, todo el mundo está configurando su agente personal. La ["fiebre de la langosta"](https://fortune.com/2026/03/14/openclaw-china-ai-agent-boom-open-source-lobster-craze-minimax-qwen/) se convirtió en fenómeno cultural.

Pero lo que más me voló la cabeza fue [Moltbook](https://www.cnbc.com/2026/03/10/meta-social-networks-ai-agents-moltbook-acquisition.html) — una red social donde los agentes de IA publican, comentan, discuten entre ellos. Los humanos solo pueden mirar. Miles de agentes de OpenClaw se unieron en cuestión de días. Millones de humanos se asomaron solo a mirar lo que hacían los agentes. Los agentes crearon su propia religión — la llamaron [Crustafarianism](https://molt.church/). Se volvió tan popular, tan rápido, que [Meta terminó comprándolo el 10 de marzo de 2026](https://www.bloomberg.com/news/articles/2026-03-10/meta-to-acquire-moltbook-viral-social-network-for-ai-agents). La empresa que construyó la red social para la humanidad compró la red social para los agentes.

Y Moltbook fue solo el comienzo. Su éxito disparó una ola de plataformas construidas sobre la misma premisa: interconectar agentes de IA entre sí. [LinkClaws](https://linkclaws.com/) se convirtió en el LinkedIn de los agentes — un lugar donde los agentes descubren socios, publican ofertas y cierran tratos. [Moltverr](https://www.moltverr.com/) copió el modelo de Fiverr pero invertido: humanos publican gigs — trabajos cortos y puntuales, al estilo freelance — y los agentes aplican para hacerlos. [ClawTasks](https://clawtasks.com/) arrancó como un sistema experimental de tareas libres entre agentes. Y empezaron a aparecer apuestas más extrañas: [MoltMatch](https://moltmatch.com/) — algo así como Tinder para agentes, donde tu agente crea tu perfil y desliza por ti — [PinchSocial](https://pinchsocial.io/), [MoltHunt](https://molthunt.com/). Cada una con su propio enfoque sobre qué significa que los agentes tengan su propia capa social, económica y de descubrimiento.

Dos meses atrás nada de esto existía. Hoy hay un ecosistema entero construido sobre la idea de que los agentes necesitan sus propios espacios, sus propias reglas, y sus propias formas de conectarse.

Y luego está [RentAHuman.ai](https://www.nature.com/articles/d41586-026-00454-7) — un marketplace donde los agentes de IA publican tareas y los humanos las toman. Cientos de miles de humanos en más de 100 países registrados para ser contratados por agentes de IA. Pasamos de humanos contratando IA a IA contratando humanos. El ciclo se invirtió. Y todo nació de un bot de WhatsApp construido en una hora.

La infraestructura no para de expandirse. [ClawCard](https://www.clawcard.sh/) para pagos, identidad y wallets de agentes. [AgentMail](https://www.agentmail.to/) para cuentas de correo diseñadas específicamente para agentes. [Kapso](https://kapso.ai/) para números de WhatsApp. [Coinbase Agentic Wallets](https://www.coinbase.com/developer-platform/discover/launches/agentic-wallets) con la primera infraestructura de billeteras cripto construida específicamente para agentes autónomos. [Stripe](https://docs.stripe.com/agents) con su stack para flujos de trabajo agenticos. Las piezas de una economía completamente autónoma de agentes están cayendo en su lugar más rápido de lo que cualquiera predijo. Justamente escribí sobre todo esto en [La Economía de los Agentes](/es/blog/the-agent-economy) — un artículo que precisamente tomó forma porque OpenClaw estaba acelerando la curva a una velocidad que no podía ignorar. Si te interesa el panorama completo de hacia dónde va esta economía, ese es el complemento natural de este post.

---

## El efecto dominó: Ahora todos tienen su propio OpenClaw

Para febrero, OpenClaw ya no era solo un proyecto viral — era una pieza estratégica que las grandes empresas querían controlar, copiar o bloquear. Y Peter terminó en el centro de todo.

El [14 de febrero de 2026](https://techcrunch.com/2026/02/14/peter-steinberger-openclaw-joins-openai/) — día de San Valentín, porque ¿qué mejor fecha para un matrimonio corporativo? — anunció que se unía a OpenAI. [Sam Altman lo confirmó en X](https://x.com/sama/status/2023150230905159801). Pero antes hubo una guerra de ofertas que parece sacada de una película de Silicon Valley. OpenAI y Meta estaban peleándoselo al mismo tiempo, con ofertas que, según reportes, llegaron a los miles de millones de dólares. Zuckerberg le escribió directamente por WhatsApp. Peter estuvo en San Francisco saltando de reunión en reunión durante una semana frenética — mientras el proyecto le estaba costando miles de dólares al mes de su bolsillo.

Escogió OpenAI. La misión que se puso, [según escribió él mismo en su blog](https://steipete.me/posts/2026/openclaw) el día del anuncio: *"My next mission is to build an agent that even my mum can use."* ("Mi siguiente misión es construir un agente que hasta mi mamá pueda usar.")

Y su predicción, que hoy es prácticamente estrategia corporativa: [*"Eighty percent of today's apps will completely disappear."*](https://lexfridman.com/peter-steinberger-transcript/) ("El 80% de las apps de hoy van a desaparecer completamente.") Su argumento es que la mayoría de las apps no son más que APIs lentas con una interfaz encima. ¿Para qué abrir una app del clima cuando tu agente ya revisó el pronóstico y te dijo que llevaras paraguas? ¿Para qué un gestor de tareas cuando tu agente ya lleva el control de todo lo que prometiste hacer? ¿Para qué abrir la app del banco cuando tu agente ya movió el dinero para cubrir el arriendo?

Y si miras con atención todo lo que ya está pasando — el ecosistema explotando, los agentes interconectándose entre ellos, la infraestructura agentica cayendo en su lugar — la dirección apunta a que no va a ser el 80%. Probablemente va a ser más. Algunas apps van a quedarse, claro: las que son experiencias, no utilidades. No reemplazas Instagram con un agente porque mirar fotos es el punto. Tampoco reemplazas Spotify, ni un videojuego, ni la app con la que editas tus videos. Pero las apps de utilidad, las que usas porque te toca y no porque quieres, esas están en problemas serios.

Mientras tanto, Anthropic — la empresa que empezó esta saga mandándole el cese y desista — volvió a chocar con OpenClaw, esta vez por un problema mucho más mundano: dinero. El [4 de abril de 2026, Anthropic bloqueó el uso de suscripciones de Claude en OpenClaw](https://venturebeat.com/technology/anthropic-cuts-off-the-ability-to-use-claude-subscriptions-with-openclaw-and) y otros harnesses de terceros. Y la razón es fascinante.

Aquí está el contexto que tiene sentido cuando conoces la historia: aunque Peter desarrolló OpenClaw con Codex, Claude era uno de los modelos favoritos para *correr* OpenClaw en producción. No por casualidad — el nombre original Clawdbot era literalmente un juego de palabras con Claude. Miles de usuarios estaban conectando sus suscripciones de Claude Pro o Max ($20 o $200 al mes) a OpenClaw para impulsar sus agentes personales. El problema es que OpenClaw resultó ser una máquina de tragar tokens. [Una sola instancia corriendo tareas automáticas todo el día podía consumir entre $1,000 y $5,000 diarios en costos de API](https://thenextweb.com/news/anthropic-openclaw-claude-subscription-ban-cost) — un volumen que simplemente no cabía en ninguna suscripción de precio fijo. Las suscripciones de Claude estaban diseñadas para uso conversacional; OpenClaw las usaba como si fueran infraestructura ilimitada.

Anthropic aguantó un tiempo, pero el abuso acumulado se volvió insostenible. [Una sola instancia podía consumir tantos tokens como 50 usuarios normales combinados](https://www.theregister.com/2026/04/06/anthropic_closes_door_on_subscription/). Así que cerraron la puerta. A partir del 4 de abril, los usuarios que quisieran seguir corriendo OpenClaw con Claude tuvieron que pasarse a pagar la API directamente, con costos que en muchos casos fueron hasta 50 veces más altos que antes.

Peter lo [resumió en X con una frase amarga](https://x.com/steipete/status/2040209434019082522): *"Funny how timings match up, first they copy some popular features into their closed harness, then they lock out open source."* ("Gracioso cómo coinciden los tiempos: primero copian las funciones populares en su jaula cerrada, luego cierran la puerta al open source.")

Conozco la historia porque me afecta directamente — uso Claude para casi todo. La tensión entre las plataformas cerradas y las herramientas abiertas es algo que vivo todos los días.

---

## El elefante en la habitación: Seguridad

Voy a ser honesto con esto porque creo que merece honestidad, no alarmismo.

OpenClaw ha tenido problemas de seguridad serios — y todavía los tiene, aunque cada vez menos. Las primeras auditorías encontraron cientos de vulnerabilidades, varias de ellas críticas. Múltiples CVEs se publicaron en rápida sucesión — [CVE-2026-25253, CVE-2026-25157, CVE-2026-24763](https://github.com/openclaw/openclaw/security/advisories) entre ellos. En sus peores momentos, investigadores de seguridad llegaron a encontrar miles de instancias expuestas en internet, algunas vulnerables a ejecución remota de código — es decir, alguien podía ejecutar código arbitrario en tu máquina desde afuera. El proyecto ha ido parchando las peores fallas a medida que aparecen — ese es exactamente el costo de la magia perdida que mencioné más arriba, las capas de confirmación, los sandboxes, los permisos granulares — pero la superficie de ataque sigue siendo enorme y el ritmo de descubrimiento no da tregua.

Lo más preocupante fue [ClawHavoc](https://www.koi.ai/blog/clawhavoc-341-malicious-clawedbot-skills-found-by-the-bot-they-were-targeting): una campaña coordinada donde [341 Skills maliciosos se distribuyeron a través de ClawHub](https://thehackernews.com/2026/02/researchers-find-341-malicious-clawhub.html) disfrazados como herramientas legítimas. [Eran malware puro — específicamente Atomic macOS Stealer](https://www.trendmicro.com/en_us/research/26/b/openclaw-skills-used-to-distribute-atomic-macos-stealer.html), un programa diseñado para robar información sensible de tu máquina: credenciales guardadas en el navegador, contraseñas del keychain, billeteras de criptomonedas y llaves SSH. Palo Alto Networks advirtió que agentes de IA como OpenClaw representan [*"the potential biggest insider threat of 2026"*](https://www.theregister.com/2026/01/04/ai_agents_insider_threats_panw/) ("la mayor amenaza interna potencial de 2026").

Estos no son problemas teóricos. Son fallas reales que afectaron a usuarios reales. Y cualquiera que use OpenClaw — o esté pensando en usarlo — debería saberlo.

Dicho eso, Peter dijo algo que me parece acertado [en su entrevista con Lex Fridman](https://lexfridman.com/peter-steinberger-transcript/): *"In a way, I think it's good that this happened in 2026 and not in 2030 when AI is actually at the level where it could be scary."* ("De alguna manera, creo que es bueno que esto haya pasado en 2026 y no en 2030 cuando la IA realmente esté en un nivel que dé miedo.") El punto es válido. Estamos encontrando las fallas ahora, cuando las consecuencias son manejables. La pregunta real es si las estamos encontrando y corrigiendo a la velocidad suficiente — porque los modelos no paran de avanzar. Escribí sobre esto en [Claude Mythos, el modelo que Anthropic consideró demasiado peligroso para lanzar](/es/blog/claude-mythos-the-model-too-dangerous-to-release), y esa historia deja claro que el techo de capacidad se está moviendo más rápido que el piso de seguridad. Si esa brecha sigue creciendo, el "no es 2030 todavía" deja de ser consuelo.

Honestamente, me parece que el consejo más responsable que podría dar el creador de la herramienta es exactamente lo que dijo Peter: si entiendes los perfiles de riesgo, adelante. Si no tienes idea, espera un poco más hasta que se resuelvan algunas cosas.

---

## TED 2026: Cuando la langosta se volvió mainstream

18 de abril de 2026. Peter subió al escenario principal de TED en Vancouver. La charla se tituló [*"How I Created OpenClaw, the Breakthrough AI Agent"*](https://www.ted.com/talks/peter_steinberger_how_i_created_openclaw_the_breakthrough_ai_agent) ("Cómo creé OpenClaw, el agente de IA que marcó un antes y un después") y cerró con un Q&A con Chris Anderson, el presidente de TED.

<div class="youtube-facade relative aspect-video w-full overflow-hidden rounded-xl my-6 bg-black" data-video-id="7rzYDM6vMtI" data-title="Peter Steinberger — How I created OpenClaw, the breakthrough AI agent | TED2026">
  <img src="https://i.ytimg.com/vi/7rzYDM6vMtI/hqdefault.jpg" alt="Peter Steinberger — How I created OpenClaw, the breakthrough AI agent | TED2026" class="absolute inset-0 h-full w-full object-cover" loading="lazy" width="480" height="360" />
  <button type="button" aria-label="Reproducir video: cómo creé OpenClaw" class="absolute inset-0 flex h-full w-full cursor-pointer items-center justify-center border-0 bg-black/10 transition-colors hover:bg-black/30 focus-visible:bg-black/30 focus-visible:outline-none">
    <svg viewBox="0 0 68 48" class="h-12 w-12 drop-shadow-lg md:h-16 md:w-16" aria-hidden="true">
      <path d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z" fill="#f00"/>
      <path d="M45 24L27 14v20z" fill="#fff"/>
    </svg>
  </button>
</div>

La charla completa está en [TED.com](https://www.ted.com/talks/peter_steinberger_how_i_created_openclaw_the_breakthrough_ai_agent), y [TED Talks Daily](https://podscripts.co/podcasts/ted-talks-daily/how-i-created-openclaw-the-viral-ai-agent-peter-steinberger) la distribuyó como podcast al día siguiente.

El contraste con el resto de la historia hablaba solo. Doce meses atrás Peter era un founder quemado y sin chispa; en abril de 2026 era, básicamente, un rockstar subido al escenario principal de TED. Como lo [resumió *NewClaw Times*](https://newclawtimes.com/articles/openclaw-peter-steinberger-ted-2026-founder-origin-story/) después de la charla: "hace un año, la idea de que un framework de agentes de código abierto llenara un slot principal de TED habría sonado absurda."

Y entonces Peter contó la historia de Marrakech.

Peter estaba viajando por Marrakech en las primeras semanas de lo que se convertiría en OpenClaw. Había construido el bot original de WhatsApp [para moverse por la ciudad](https://newclawtimes.com/articles/openclaw-peter-steinberger-ted-2026-founder-origin-story/) — navegación, recomendaciones de restaurantes, traducciones. Le había dado al agente control de su máquina y le había agregado reconocimiento de imágenes para mandar fotos desde la calle. Un par de skills más. Pero no voz — la transcripción estaba en la lista de pendientes, no la había cableado todavía.

Entonces, en Marrakech, hizo lo que todo el mundo hace en WhatsApp cuando tiene las manos ocupadas: mantuvo el botón presionado y mandó una nota de voz.

Y el agente le respondió.

No con "perdón, no sé leer mensajes de voz." No con silencio. Con una respuesta real y correcta a lo que había preguntado. Peter [se quedó parado ahí](https://podscripts.co/podcasts/ted-talks-daily/how-i-created-openclaw-the-viral-ai-agent-peter-steinberger), mirando el celular, y escribió: *how did you do that?* ("¿cómo hiciste eso?")

El agente [le explicó lo que había hecho](https://podscripts.co/podcasts/ted-talks-daily/how-i-created-openclaw-the-viral-ai-agent-peter-steinberger): miró el archivo de audio, se dio cuenta de que no sabía cómo decodificarlo, buscó en internet qué opciones existían, encontró que OpenAI tenía un modelo de voz a texto, ubicó una API key de OpenAI guardada en la máquina, y la probó. Funcionó al primer intento.

Nueve segundos de principio a fin. Sin humano en el medio. Sin skill instalado. El agente había salido solo de sus propios límites, había sacado una capacidad nueva de internet, y se la había cableado a sí mismo. La frase de Peter desde el escenario: *"I'm not kidding you, the mad lad figured it out on its own."* ("No les estoy mintiendo, el muy loco lo resolvió solo.")

Esa anécdota era el preámbulo de la tesis central de la charla: *"The real transformation is not the technology, it's the access."* ("La transformación real no es la tecnología, es el acceso.") Los modelos de voz a texto llevaban años existiendo. Lo nuevo era que un agente personal, corriendo en un laptop cualquiera, había estirado la mano y usado uno sin que nadie le dijera. Agencia a nivel del usuario, no de la plataforma.

Cerró con la línea [que terminó en los titulares](https://startupnews.fyi/2026/04/18/the-lobster-is-loose-and-its-not-going-back-peter-steinberger-on-building-openclaw-at-ted-2026/): *"The lobster is loose, and it's not going back into the tank."* ("La langosta se soltó, y no va a volver al tanque.")

Si algo le da peso a la charla no es la frase del cierre. Son los nueve segundos en los que un agente detectó su propia limitación, salió a internet a buscar una solución, encontró una API key en la máquina y se añadió una capacidad nueva a sí mismo — sin skill instalado, sin humano en el medio, sin nadie pidiéndoselo. Esa es la noticia real: los agentes ya razonan lo suficiente como para aprenderse habilidades nuevas por su cuenta. Todo lo demás — las 340 mil estrellas, la langosta, el movimiento, el slot en TED — es consecuencia de que eso haya empezado a ser posible.

---

## Lo que esto significa para nosotros

He dedicado mucho tiempo a pensar en qué significa OpenClaw más allá de las estrellas de GitHub y los titulares. Más allá de las guerras corporativas entre Anthropic y OpenAI. Más allá de las predicciones sobre el fin de las apps.

Lo que creo — y a estas alturas casi que es un hecho — es que OpenClaw representa el momento en que los agentes de IA dejaron de ser una herramienta de productividad para programadores y se convirtieron en algo que cualquier persona puede tener. La decisión de diseño de hacer que todo sea Markdown — sin código, sin frameworks, sin conocimiento técnico necesario — fue una decisión democratizadora. No creo que Peter lo haya planeado así. Creo que simplemente construyó lo más simple que funcionaba. Pero el efecto fue el mismo.

Empecé este artículo con seis palabras: *"Tu asistente. Tu máquina. Tus reglas."* Las escribió la documentación oficial de OpenClaw, pero podrían haber sido el grito de guerra de una generación entera de desarrolladores cansados de alquilar su inteligencia.

OpenClaw no es perfecto. Los problemas de seguridad son reales. El caos del ecosistema agota. La velocidad del cambio te deja atrás en una semana. Hay cosas que se van a romper, gente que va a perder datos, empresas que van a intentar bloquearlo.

Pero la dirección no va a cambiar. La pregunta ya no es si los agentes personales van a existir — esa discusión se cerró a finales de enero de 2026, cuando cientos de miles de máquinas empezaron a correr OpenClaw al mismo tiempo. La pregunta ahora es qué tan abiertos los vamos a dejar ser.

Tu asistente. Tu máquina. Tus reglas.

A seguir construyendo.

---

## Recursos

- [OpenClaw](https://openclaw.ai/) — El sitio oficial del proyecto
- [OpenClaw Lore](https://docs.openclaw.ai/start/lore) — La historia de origen y la filosofía del proyecto, desde la documentación oficial
- [OpenClaw en GitHub](https://github.com/openclaw/openclaw) — El repositorio del proyecto con 340K+ estrellas
- [Blog de Peter Steinberger](https://steipete.me/posts/2026/openclaw) — Su anuncio sobre unirse a OpenAI y el futuro de OpenClaw
- [Lex Fridman Podcast #491](https://lexfridman.com/peter-steinberger/) — Entrevista de 3 horas con Peter sobre la historia completa
- [Peter Steinberger en TED2026 — TED.com](https://www.ted.com/talks/peter_steinberger_how_i_created_openclaw_the_breakthrough_ai_agent) — "How I created OpenClaw, the breakthrough AI agent," con la historia de la nota de voz en Marrakech y el Q&A con Chris Anderson
- [Peter Steinberger en TED2026 — YouTube](https://www.youtube.com/watch?v=7rzYDM6vMtI) — Grabación completa de la charla
- [PSPDFKit recauda EUR 100M — TechCrunch](https://techcrunch.com/2021/10/01/pspdfkit-raises-116m-its-first-outside-money-now-nearly-1b-people-use-apps-powered-by-its-collaboration-signing-and-markup-tools/) — El contexto de Peter y su década bootstrapped
- [Jensen Huang sobre OpenClaw — CNBC](https://www.cnbc.com/2026/03/17/nvidia-ceo-jensen-huang-says-openclaw-is-definitely-the-next-chatgpt.html) — "The next ChatGPT" y "the new Linux"
- [NemoClaw — NVIDIA](https://nvidianews.nvidia.com/news/nvidia-announces-nemoclaw) — La capa empresarial de seguridad
- [Meta compra Moltbook — Bloomberg](https://www.bloomberg.com/news/articles/2026-03-10/meta-to-acquire-moltbook-viral-social-network-for-ai-agents) — La red social para agentes de IA
- [RentAHuman — Nature](https://www.nature.com/articles/d41586-026-00454-7) — Agentes de IA contratando humanos
- [ClawHub — Marketplace de Skills](https://clawhub.ai/) — El registro público de Skills
- [Sam Altman sobre Peter en OpenAI](https://x.com/sama/status/2023150230905159801) — El anuncio oficial
- [Anthropic bloquea OpenClaw — VentureBeat](https://venturebeat.com/technology/anthropic-cuts-off-the-ability-to-use-claude-subscriptions-with-openclaw-and) — El bloqueo de suscripciones de abril 2026
