---
title: "Claude Mythos: El modelo demasiado peligroso para ser liberado"
description: "Anthropic creó un modelo que encontró miles de zero-days en todos los sistemas operativos. No lo van a liberar — armaron una coalición de $100M."
pubDate: "2026-04-07"
heroImage: "/images/blog/posts/claude-mythos-the-model-too-dangerous-to-release/hero-es.webp"
heroLayout: "side-by-side"
tags: ["tech", "ai-agents", "personal", "claude"]
keywords: ["Claude Mythos Preview vulnerabilidades zero-day", "Project Glasswing Anthropic ciberseguridad", "IA descubre vulnerabilidades 2026", "Claude Mythos benchmarks rendimiento", "revolución IA ciberseguridad zero-day", "Anthropic coalición seguridad $100M", "IA encuentra bug de 28 años OpenBSD"]
series: "working-with-agents"
seriesOrder: 5
---

Parecía un día normal hasta que me puse a revisar mis redes y vi en tendencia que Anthropic había construido un modelo tan poderoso que se niegan a liberarlo al público. No pude parar de leer. Estuve un par de horas saltando de hilo en hilo, de artículo en artículo, tratando de entender la magnitud de lo que estaba pasando.

Y es que no estamos hablando de "un modelo que rinde bien en benchmarks." Ni de "una mejora incremental sobre la generación anterior." Estamos hablando de un modelo que la empresa que lo construyó considera demasiado peligroso para ponerlo en manos de cualquiera. Claude Mythos Preview encontró miles de fallas de seguridad desconocidas — lo que en la industria llaman "zero-days" — en todos los sistemas operativos principales y todos los navegadores web principales. Fallas que llevaban escondidas 28 años. Algunas permiten tomar el control total de un servidor desde cualquier parte del mundo, sin contraseña, sin permiso. El costo de encontrar algunas de ellas? Menos de cincuenta dólares.

Si eso es real — y la [evidencia](https://red.anthropic.com/2026/mythos-preview/) dice que sí — estamos viendo uno de esos momentos que dividen la línea del tiempo en antes y después.

He estado llamando a lo que estamos viviendo una ["revolución silenciosa"](/es/blog/from-programmer-to-orchestrator/). Pensé que estaba siendo atrevido.

Estaba siendo conservador.

Anthropic estaba tranquilamente ensamblando a Apple, Google, Microsoft, Amazon, NVIDIA y otras siete organizaciones en una [coalición defensiva de $100 millones](https://www.anthropic.com/glasswing) llamada Project Glasswing. No para vender el modelo. Para parchar la infraestructura del mundo antes de que modelos como este proliferen. Miraron lo que Mythos puede hacer y decidieron que lo responsable era tratarlo como un arma que necesitaba ser controlada.

La revolución silenciosa dejó de ser silenciosa.

---

## El ritmo que nadie esperaba

El [anuncio de Mythos](https://www.anthropic.com/glasswing) no es un evento aislado. Es el último de una secuencia que se ha venido construyendo a un ritmo difícil de procesar incluso para los que estamos prestando atención.

En cuestión de semanas, Anthropic, OpenAI y Google lanzaron nuevos modelos de IA al mismo tiempo — una carrera donde cada empresa intenta superar a las otras con capacidades cada vez más avanzadas. Luego se filtró Mythos, y días después llegó el anuncio oficial junto con Project Glasswing.

Cada semana hay algo que habría sido un titular hace seis meses y ahora apenas se registra como noticia. Como mencioné [antes en esta serie](/es/blog/from-programmer-to-orchestrator/), las capacidades de los agentes de IA se vienen duplicando cada 4.3 meses. Pero Mythos sugiere que el ritmo podría ser incluso más acelerado de lo que muestran los datos.

Y en algún lugar de un laboratorio de Anthropic, mientras todo eso pasaba, un modelo estaba construyendo autónomamente un ataque funcional contra un servidor. Ya habían salido rumores tempranos sobre Mythos — [documentos internos](https://fortune.com/2026/04/07/anthropic-claude-mythos-model-project-glasswing-cybersecurity/) lo describían como *"by far the most powerful AI model we have ever developed"* ("con diferencia, el modelo de IA más poderoso que hemos desarrollado jamás").

---

## Lo que Anthropic realmente construyó

Esto es lo que anunciaron.

Claude Mythos Preview es, según la [propia evaluación de Anthropic](https://www.anthropic.com/glasswing), *"currently far ahead of any other AI model in cyber capabilities"* ("actualmente muy por delante de cualquier otro modelo de IA en capacidades de ciberseguridad"). No es una herramienta diseñada para hackear — es un modelo de inteligencia general que simplemente resulta ser extraordinariamente bueno encontrando fallas en el software. Nadie lo entrenó específicamente para eso. Esa capacidad apareció sola, como consecuencia de hacerlo mejor razonando y trabajando de forma autónoma.

No construyeron un modelo de hacking. Construyeron un modelo de pensamiento que resultó ser terroríficamente bueno haciendo hacking.

Los números del [reporte del equipo de seguridad](https://red.anthropic.com/2026/mythos-preview/) son difíciles de exagerar. Mythos identificó miles de fallas de seguridad graves y críticas en software que usan miles de millones de personas. Más del 99% no habían sido corregidas al momento de la publicación. Windows, macOS, Linux, Chrome, Firefox, Safari — todos afectados.

Y estos no eran hallazgos fáciles — eran del tipo que anteriormente requería investigadores de seguridad de élite trabajando durante semanas o meses.

---

## Lo que Mythos encontró

Las fallas específicas que encontró cuentan la historia mejor que cualquier resumen.

**El bug de OpenBSD — 28 años, encontrado por $50.**

[OpenBSD](https://www.openbsd.org/) es uno de los sistemas operativos más endurecidos en seguridad jamás construidos. Toda su identidad es la seguridad — es lo que usan bancos y gobiernos cuando necesitan software que no falle. Mythos encontró una falla en cómo maneja las conexiones de red, enterrada en el código desde 1998. El tipo de bug que pasa todas las pruebas automatizadas y todas las revisiones de código porque solo se activa bajo condiciones muy específicas. La ejecución específica que la encontró costó unos $50. Mil ejecuciones para escanear esa área a fondo costaron menos de $20,000 en total.

$50. Para encontrar algo que los mejores investigadores de seguridad del mundo pasaron por alto durante 28 años.

**El control total de FreeBSD — completamente autónomo, menos de $2,000.**

Este es el que más asusta. [FreeBSD](https://www.freebsd.org/) es otro sistema operativo usado ampliamente en servidores, infraestructura de red y servicios como Netflix y WhatsApp. Mythos encontró una falla en su sistema de archivos compartidos — un lugar donde el software no verifica correctamente cuántos datos está recibiendo. Y luego, sin ninguna ayuda humana, construyó un ataque completo desde cero.

Descubrió cómo comunicarse con el servidor, encontró la forma de engañarlo, y terminó otorgándose acceso total de administrador — el tipo que te permite hacer cualquier cosa con la máquina. Leer cualquier archivo. Instalar cualquier programa. Tomar el control completo.

Control total del servidor, sin contraseña, desde cualquier lugar del mundo. "Varias horas" de trabajo autónomo. Costo: menos de $2,000.

Un consultor de seguridad de primer nivel cobra alrededor de $200/hora. Este modelo hizo en unas horas lo que un equipo de ellos tardaría semanas en lograr, por menos del costo de un solo día de consultoría.

**El fantasma de FFmpeg — 16 años, invisible para la automatización.**

Un bug en cómo [FFmpeg](https://ffmpeg.org/) — el software de procesamiento de video que usan YouTube, Spotify, VLC y prácticamente cualquier aplicación que reproduzca audio o video — procesa video. Este había sobrevivido cinco millones de intentos de pruebas automatizadas — programas diseñados específicamente para romper software lanzándole datos aleatorios. Cinco millones de intentos, y ninguno lo detectó. Mythos lo encontró al entender realmente qué estaba haciendo el código, no solo bombardeándolo con datos aleatorios. Varios cientos de escaneos a un costo total de unos $10,000.

**Firefox bajo la lupa de Mythos.**

Esta comparación me dejó frío. El equipo de seguridad de Anthropic le pidió a dos modelos la misma tarea: encontrar formas de hackear Firefox, uno de los navegadores más usados del mundo.

Claude Opus 4.6 — uno de los modelos de razonamiento frontera más potentes de la actualidad — lo logró 2 veces de varios cientos de intentos.

Mythos: **181 exploits exitosos de varios cientos de intentos.** Más 29 adicionales donde logró control parcial.

2 contra 181. Las mismas fallas. La misma prueba. Eso no es una mejora incremental. Es una categoría completamente diferente de capacidad.

**Ni siquiera Rust se salvó.**

Rust es un lenguaje de programación que toda la industria ha estado promoviendo como la opción segura — está diseñado específicamente para prevenir el tipo de errores de memoria que los hackers explotan. Mythos encontró uno de todas formas. En un sistema de producción ejecutando máquinas virtuales, descubrió una forma para que un programa aislado escapara de su espacio protegido y accediera a partes del sistema que no debería tocar. Exactamente el tipo de bug que Rust fue construido para hacer imposible, escondido en las pequeñas esquinas donde los desarrolladores tuvieron que desactivar manualmente las protecciones de Rust.

---

## Más cerebro, menos combustible

Los benchmarks cuentan dos historias a la vez, y ambas importan.

La primera es capacidad bruta. Los benchmarks son básicamente exámenes estandarizados para modelos de IA — se les dan cientos de problemas reales y se mide cuántos resuelven correctamente. Piensa en ellos como las pruebas ICFES pero para inteligencia artificial:

| Benchmark | Qué mide | Mythos Preview | Opus 4.6 |
|-----------|----------|---------------|----------|
| SWE-bench Verified | Resolver bugs reales de programación | 93.9% | 80.8% |
| SWE-bench Pro | Lo mismo, pero problemas más difíciles | 77.8% | 53.4% |
| CyberGym | Encontrar y explotar vulnerabilidades | 83.1% | 66.6% |
| Terminal-Bench 2.0 | Tareas complejas en terminal | 82.0% | 65.4% |
| BrowseComp | Investigación web compleja | 86.9% | 83.7% |
| GPQA Diamond | Preguntas de nivel doctorado | 94.6% | 91.3% |

Para ponerlo en perspectiva: 93.9% en SWE-bench Verified significa que de cada 100 bugs reales de software — sacados de proyectos reales en GitHub — Mythos resuelve 94. El modelo anterior resolvía 81. En la versión más difícil del examen (SWE-bench Pro), el salto es aún más dramático: de aprobar la mitad de las preguntas a aprobar casi cuatro de cada cinco.

Pero la segunda historia es la que realmente cambia las cosas: **eficiencia**.

<figure>
<img src="/images/blog/posts/claude-mythos-the-model-too-dangerous-to-release/browsecomp-benchmark.webp" alt="Gráfico de escalamiento de cómputo de BrowseComp mostrando que Claude Mythos Preview alcanza 86.9% de precisión con solo 300K tokens mientras Claude Opus 4.6 necesita más de 1M de tokens para alcanzar 83.7%" width="1138" height="826" loading="lazy" />
<figcaption>Precisión vs. recursos computacionales usados — Mythos obtiene mejor puntuación que Opus 4.6 usando una fracción de los recursos.</figcaption>
</figure>

Mira ese gráfico. Los "tokens" son la unidad de trabajo de un modelo de IA — piensa en ellos como las calorías que quema para pensar. Más tokens = más esfuerzo computacional. Lo que muestra el gráfico es que Mythos con poco esfuerzo (1M de tokens, 84.9%) ya supera a Opus 4.6 con diez veces más esfuerzo (10M de tokens, 83.7%). Más preciso, usando una fracción de los recursos.

La parte sorprendente: Mythos es unas 5X más costoso por unidad de trabajo que Opus 4.6 — pero como necesita mucho menos trabajo para llegar a la misma respuesta, el costo total puede ser incluso menor. En algunas tareas, logra puntuaciones más altas usando aproximadamente 50X menos recursos.

No solo más inteligente — más inteligente *gastando menos*. Si la tendencia de los últimos años era "dale más poder de cómputo," Mythos sugiere un camino diferente: pensar mejor, no con más fuerza.

Y en una prueba masiva donde se le lanzaron ~7,000 programas distintos para ver cuántas fallas encontraba, la diferencia es aún más pronunciada:

| Lo que encontró | Modelos anteriores | Mythos Preview |
|-----------------|-------------------|----------------|
| Fallas básicas (el programa se cae) | 150-175 | 595 |
| Fallas críticas (toma de control total del programa) | 0 | **10** |

Los modelos anteriores nunca lograron encontrar una falla del tipo más grave — ni una sola vez. Mythos encontró diez. Eso no es una mejora en puntuación. Es una capacidad que antes no existía.

---

## El escudo: La defensa antes del ataque

Lo que Anthropic hizo después es — honestamente — lo que creo que fue la respuesta correcta.

No liberaron el modelo. No lo pusieron disponible con lista de espera. Armaron [Project Glasswing](https://www.anthropic.com/glasswing): doce socios fundadores incluyendo AWS, Apple, Broadcom, Cisco, CrowdStrike, Google, JPMorganChase, la Linux Foundation, Microsoft, NVIDIA y Palo Alto Networks. Más de 40 organizaciones adicionales responsables de construir o mantener infraestructura de software crítica.

$100 millones en créditos de uso de Mythos Preview para estos socios. $4 millones en donaciones directas a organizaciones que mantienen software de código abierto — el tipo de software gratuito que sirve de base para la mayoría de los sistemas del mundo. Estas son las personas que mantienen el código sobre el que todo lo demás corre, y lo han hecho históricamente en gran medida solos.

El marco es cuidadoso. Están usando compromisos criptográficos — prueba matemática de que encontraron vulnerabilidades específicas, sin revelar cuáles son, para poder demostrar sus hallazgos después cuando los parches estén en su lugar. Una línea de tiempo de divulgación coordinada de 90+45 días. 89% de coincidencia exacta en severidad entre las evaluaciones del modelo y los validadores humanos expertos. Un programa de verificación para profesionales de seguridad legítimos que quieran acceso.

El precio, cuando entre en funcionamiento para participantes aprobados: $25 por cada millón de palabras que le das, $125 por cada millón que te responde. No es barato. Pero dado lo que puede encontrar, potencialmente la mejor inversión en seguridad que cualquiera puede hacer.

Como [lo expresó CrowdStrike](https://www.crowdstrike.com/en-us/blog/crowdstrike-founding-member-anthropic-mythos-frontier-model-to-secure-ai/): *"This is not a reason to slow down; it's a reason to move together, faster."* ("Esto no es razón para ir más despacio; es razón para movernos juntos, más rápido.")

---

## Lo que dice el mundo de la seguridad

Las reacciones de personas que realmente trabajan en seguridad te dicen que esto es real — no hype.

[Simon Willison](https://simonwillison.net/2026/Apr/7/project-glasswing/) — una de las voces más respetadas de la comunidad de desarrolladores — llamó a la liberación restringida *"necessary"* ("necesaria") y dijo que los riesgos de seguridad son *"credible"* ("creíbles"). Apoya el enfoque a pesar de la desventaja obvia: los desarrolladores fuera de las alianzas de confianza no pueden acceder al modelo. Considera que el trade-off es razonable.

Greg Kroah-Hartman, uno de los responsables de mantener el corazón del sistema operativo Linux, [notó el cambio](https://www.theregister.com/2026/03/26/greg_kroahhartman_ai_kernel/) antes del anuncio: *"Something happened a month ago... Now we have real reports... good, and real."* ("Algo pasó hace un mes... Ahora tenemos reportes reales... buenos, y reales.") Los reportes de vulnerabilidad generados por IA pasaron de ser ruido — lo que Daniel Stenberg, creador de una de las herramientas más usadas de internet (curl), [llamó](https://mastodon.social/@bagder/116336957584445742) un *"AI slop tsunami"* ("tsunami de basura de IA") — a ser un *"plain security report tsunami"* ("tsunami de reportes de seguridad legítimos"). Hallazgos reales. Fallas reales. Ataques funcionales reales.

El mercado también lo sintió. Cuando [se conoció la noticia sobre Mythos](https://fortune.com/2026/04/07/anthropic-claude-mythos-model-project-glasswing-cybersecurity/), las acciones de ciberseguridad cayeron 5-11%. CrowdStrike, Palo Alto Networks, Zscaler, SentinelOne, Okta — todas afectadas. Los inversionistas temían que el descubrimiento de vulnerabilidades potenciado por IA pudiera socavar la demanda de productos de seguridad tradicionales.

Elia Zaitsev, CTO de CrowdStrike, [lo enmarcó](https://www.anthropic.com/glasswing) en términos que deberían hacer que todos presten atención: *"The window between vulnerability discovery and exploitation has collapsed — now minutes with AI."* ("La ventana entre el descubrimiento de vulnerabilidades y la explotación se ha colapsado — ahora minutos con IA.")

Minutos. No semanas. No días. Minutos.

Y esto no es teórico. [Fortune reportó](https://fortune.com/2026/04/07/anthropic-claude-mythos-model-project-glasswing-cybersecurity/) que Anthropic advirtió privadamente a funcionarios del gobierno que Mythos hace que los ciberataques a gran escala sean significativamente más probables en 2026. Un grupo patrocinado por el estado chino ya había [usado agentes de IA para infiltrar autónomamente](https://fortune.com/2026/04/07/anthropic-claude-mythos-model-project-glasswing-cybersecurity/) aproximadamente 30 objetivos globales — el primer ciberataque documentado ejecutado en gran parte por IA.

---

## Lo que esto me hace pensar

Uso Claude todos los días. He dedicado [una serie entera](/es/blog/series/working-with-agents/) a explorar cómo trabajar con agentes de IA. He invitado a la gente a sumarse a esta revolución. Y entonces Anthropic anuncia que la siguiente generación del modelo que uso puede encontrar fallas de seguridad desconocidas en todos los sistemas operativos principales por cincuenta dólares. Creo que Glasswing fue el enfoque correcto — pero el hecho de que hayamos llegado a un punto donde un modelo de IA tiene que ser restringido porque es *demasiado bueno haciendo hacking* dice mucho sobre el momento que estamos viviendo.

Piensa en la cifra de $50. No porque sea impactante aisladamente — sino por lo que representa. El costo de encontrar una vulnerabilidad crítica en uno de los sistemas operativos más seguros del mundo ahora es menor que un par de suscripciones mensuales de streaming. La asimetría entre el esfuerzo de construir sistemas seguros y el esfuerzo de encontrar fallas en ellos ha cambiado dramáticamente. Décadas de trabajo cuidadoso de seguridad, millones de pruebas automatizadas, auditorías de expertos humanos — y un modelo encuentra la brecha en una ejecución por cincuenta dólares.

Y hay algo más: durante años, el mundo de la seguridad nos advirtió sobre los computadores cuánticos — máquinas tan poderosas que podrían romper la encriptación y encontrar vulnerabilidades que los computadores clásicos jamás podrían. Imaginábamos esa amenaza a décadas de distancia, encerrada detrás de hardware exótico que solo gobiernos y laboratorios de investigación podrían costear. Pero el tipo de descubrimiento de vulnerabilidades que temíamos de la computación cuántica? Está pasando ahora. No con máquinas cuánticas — con modelos de IA corriendo en hardware que cualquier empresa puede acceder. La amenaza futura llegó desde una dirección que nadie esperaba, y corre en GPUs, no en qubits.

No sé cómo se ve un mundo donde esa capacidad se vuelve ampliamente disponible. Nadie lo sabe. El enfoque de Glasswing — restringir, parchar, preparar — compra tiempo. Pero la curva de capacidad no se ha desacelerado. Si acaso, Mythos muestra que es más pronunciada de lo que sugieren las gráficas.

---

## Qué significa esto para nosotros

El mismo modelo que encuentra zero-days podría ser el que revise tu código en busca de bugs. La capacidad de razonamiento que le permite encadenar cuatro fallas distintas hasta tomar el control total de un sistema es la misma que le permite entender un proyecto complejo y reorganizarlo correctamente. Las capacidades de seguridad no están separadas de las generales — son lo mismo: razonamiento profundo y autónomo.

Eso corta en ambas direcciones. Hoy los agentes de IA envían features, escriben documentación, construyen interfaces. Y están impulsados por el mismo tipo de inteligencia que acaba de encontrar miles de zero-days. Cualquiera que trabaje con estos modelos debería estar revisando sus propias configuraciones de seguridad después de este anuncio.

Jim Zemlin, Director Ejecutivo de la Linux Foundation, [capturó la urgencia](https://www.linuxfoundation.org/blog/project-glasswing-gives-maintainers-advanced-ai-to-secure-open-source): los mantenedores de código abierto — cuyo software sustenta la mayor parte de la infraestructura crítica del mundo — han tenido que resolver la seguridad por su cuenta. Han estado en desventaja durante años. Ahora obtienen acceso al mismo nivel de capacidad que ha estado encontrando sus bugs.

La metáfora de la carrera armamentista es tentadora pero incompleta. Esto no es solo ataque vs. defensa. Se trata de la velocidad a la que ambos lados pueden operar. Y ahora mismo, la velocidad está aumentando más rápido de lo que los procesos institucionales de cualquiera pueden seguir.

---

## La revolución ya no es silenciosa

Cuando empecé [esta serie](/es/blog/from-programmer-to-orchestrator/), quería capturar cómo se siente vivir este momento. Las [ganancias de productividad](/es/blog/from-programmer-to-orchestrator/), los [loops de dopamina](/es/blog/the-permanent-hackathon/), la [nueva infraestructura económica](/es/blog/the-agent-economy/), el [arte de dirigir agentes](/es/blog/the-art-of-directing-agents/). Todo real, todo sucediendo rápido, todo mayormente invisible para el 99% del mundo.

Mythos cambia la conversación. No porque la revolución sea diferente — es la misma curva exponencial. Sino porque ahora las implicaciones se extienden más allá de la productividad y la economía. Cuando la IA puede encontrar y explotar vulnerabilidades a esta escala y costo, lo que está en juego ya no es solo quién programa más rápido o quién entrega más features. Es infraestructura. Seguridad nacional. Los sistemas de los que todo depende.

Sigo siendo optimista. Y precisamente por eso creo que vale la pena prestar atención: la misma tecnología que nos ayuda a construir acaba de encontrar un bug de 28 años en uno de los sistemas operativos más seguros del planeta. Por cincuenta dólares. El futuro es prometedor — pero solo si lo tomamos en serio.

La revolución nunca iba a quedarse en silencio. Y esto es solo el comienzo.

A seguir construyendo. Con cuidado.

---

## Recursos

- [Project Glasswing — Anthropic](https://www.anthropic.com/glasswing) — Anuncio oficial de la coalición defensiva de $100M con 12 socios fundadores
- [Claude Mythos Preview — Anthropic Red Team](https://red.anthropic.com/2026/mythos-preview/) — Reporte completo de investigación de seguridad: descubrimientos de vulnerabilidades, detalles de exploits, datos de benchmarks
- [Simon Willison sobre Project Glasswing](https://simonwillison.net/2026/Apr/7/project-glasswing/) — Análisis independiente de una de las voces más respetadas en el desarrollo open source
- [Anthropic limita el lanzamiento de Mythos — CNBC](https://www.cnbc.com/2026/04/07/anthropic-claude-mythos-ai-hackers-cyberattacks.html) — Cobertura sobre la estrategia de liberación restringida
- [Anthropic Claude Mythos — Fortune](https://fortune.com/2026/04/07/anthropic-claude-mythos-model-project-glasswing-cybersecurity/) — Análisis de la industria incluyendo impacto en el mercado bursátil y reuniones con el gobierno
- [CrowdStrike sobre Project Glasswing](https://www.crowdstrike.com/en-us/blog/crowdstrike-founding-member-anthropic-mythos-frontier-model-to-secure-ai/) — Perspectiva del CTO sobre por qué moverse juntos más rápido es la respuesta correcta
- [Linux Foundation sobre Project Glasswing](https://www.linuxfoundation.org/blog/project-glasswing-gives-maintainers-advanced-ai-to-secure-open-source) — Cómo los mantenedores de código abierto se beneficiarán de IA frontera para seguridad
- [Análisis de benchmarks de Claude Mythos](https://kingy.ai/ai/claude-mythos-preview-benchmarks-the-ai-that-scored-93-9-on-swe-bench-and-still-wont-be-released/) — Desglose detallado de SWE-bench, BrowseComp y otros resultados de benchmarks
