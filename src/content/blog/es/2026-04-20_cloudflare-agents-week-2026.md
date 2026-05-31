---
title: "La Web Agéntica: Todo lo que Cloudflare lanzó en la Semana de Agentes 2026"
description: "Alrededor de 30 anuncios en una semana. Todo lo que Cloudflare lanzó en la Semana de Agentes 2026, organizado por capa: runtime, MCP, estándares, medición."
pubDate: "2026-04-20T14:00:00"
heroImage: "/images/blog/posts/cloudflare-agents-week-2026/hero-es.webp"
heroLayout: "side-by-side"
tags: ["tech", "web-development", "ai-agents", "cloudflare", "mcp"]
keywords: ["cloudflare agents week 2026", "web agéntica", "infraestructura agentes IA", "web lista para agentes", "MCP", "Project Think Cloudflare", "Sandboxes GA", "isitagentready.com"]
---

Hace unas semanas, en mi serie [AEO: De Invisible a Citado](/es/blog/series/aeo-from-invisible-to-cited/), escribía sobre cómo la optimización para motores de respuesta iba años por delante de nuestra capacidad de medirla. Era mitad diagnóstico, mitad queja: ya teníamos `llms.txt`, datos estructurados, endpoints markdown para agentes — pero ningún tablero objetivo que nos dijera si todo eso estaba funcionando.

Luego Cloudflare respondió con alrededor de 30 anuncios en una sola semana — su [Agents Week 2026](https://www.cloudflare.com/agents-week/) — tratando de cerrar esa brecha. Y lo que se puede decir de la forma en que lo hizo es más interesante que cualquier producto individual: no fue una colección de features sueltos, fue infraestructura, estándares y medición apilados uno sobre otro.

Lo que sigue es mi lista de todo lo que se anunció, organizada por capa — no por orden cronológico. Algunos ítems dan para posts propios; iré profundizando más adelante en los que tengan sentido. Por ahora, corto y al grano.

## 1. El sustrato: los agentes obtienen un computador

El primer post de la semana abrió con un titular literal: *"Agents have their own computers with Sandboxes GA"* (los agentes tienen su propio computador con Sandboxes GA). No es exageración.

1. **[Sandboxes GA](https://blog.cloudflare.com/sandbox-ga/).** Un computador real y dedicado para cada agente — no un contenedor efímero que muere después de una sola respuesta, sino un espacio de trabajo que persiste entre sesiones. El agente puede instalar paquetes, correr un shell, clonar un repo de Git, escribir archivos, exponer un puerto al internet. El SDK `@cloudflare/sandbox` expone cada una de esas acciones como método — `exec`, `gitClone`, `writeFile`, `terminal`, `exposePort`. El cobro corre sobre CPU activa: pagas por los segundos en que el agente está trabajando, no por el tiempo que está idle. Y puedes tener hasta 15.000 sandboxes *lite* en paralelo en el plan Standard (6.000 del tier básico, 1.000+ de tiers mayores). Esta es la pieza donde "cada agente con su propio computador" deja de ser metáfora.

2. **[Sandbox auth](https://blog.cloudflare.com/sandbox-auth/).** Una capa de seguridad entre el sandbox del agente y el resto del mundo. Todo el tráfico de red que sale del sandbox pasa por un proxy zero-trust: las credenciales del usuario nunca tocan el código que el agente está ejecutando. Si el agente necesita llamar a una API interna, el proxy inyecta las credenciales correctas en el momento justo; si intenta hablar con un dominio que no debería, el proxy lo bloquea. Tú defines las reglas con un handler dinámico. El agente corre libre sin nunca ver tus secretos.

3. **[Durable Object Facets en Dynamic Workers](https://blog.cloudflare.com/durable-object-facets-dynamic-workers/).** Cada app que un agente genera — un microservicio, una API pequeña, un bot — obtiene su propia base de datos SQLite, aislada del resto. Si una app rompe su propia base, solo rompe la suya; ninguna otra app se entera. Open beta en el plan pago de Workers.

4. **[Artifacts](https://blog.cloudflare.com/artifacts-git-for-agents-beta/) (beta).** Almacenamiento versionado que habla Git de forma nativa. Cada agente puede crear su propio repositorio, y cualquier cliente Git estándar — incluso un `git clone` desde tu propio terminal — puede trabajar con él. La implementación es ingeniosa: el servidor de Git corre compilado a WebAssembly en apenas ~100 KB, la persistencia en vivo usa Durable Objects con SQLite, y los snapshots se guardan en R2. Los precios son públicos: 0.15 USD por cada 1.000 operaciones y 0.50 USD por GB al mes. Está diseñado para que los agentes creen millones de repos sin tener que pensar en infraestructura.

5. **[cf CLI + Local Explorer](https://blog.cloudflare.com/cf-cli-local-explorer/).** Una nueva herramienta de línea de comandos (`npx cf`) que reemplaza a Wrangler, más un "Local Explorer" — una versión simulada de toda la plataforma de Cloudflare corriendo en tu máquina. Puedes probar KV, R2, D1, Durable Objects y Workflows localmente sin tocar producción, y sin tener que inventar tus propios mocks.

## 2. Inferencia y memoria: el modelo importa, pero la plomería también

6. **[AI Platform](https://blog.cloudflare.com/ai-platform/) (AI Gateway + Workers AI unificados).** Un solo punto de entrada a más de 70 modelos de IA de más de 12 proveedores — Alibaba Cloud, AssemblyAI, Bytedance, Google, InWorld, MiniMax, OpenAI, Pixverse, Recraft, Runway, Vidu. Escribes una sola línea (`AI.run("modelo", ...)`) y puedes cambiar entre ellos sin reescribir nada más. Si un proveedor se cae, la plataforma hace failover automático al siguiente; todo el gasto va a un solo pool de créditos centralizado — una factura en vez de doce. Y si tienes un modelo propio entrenado, lo puedes traer empacado como contenedor estándar (usando Replicate Cog). Es la respuesta directa a OpenRouter y Portkey, pero integrada al stack de Cloudflare.

7. **[Infire](https://blog.cloudflare.com/high-performance-llms/).** Cloudflare construyó su propio motor para correr LLMs, desde cero, en Rust. En vez de usar vLLM o TGI (los motores open source típicos), tienen algo propio con tres optimizaciones: separan las dos fases internas de un LLM (la que entiende la pregunta y la que genera la respuesta) para que corran en máquinas distintas; cachean los prompts repetidos de forma más agresiva (tasa de aciertos subió de 60% a 80%); y usan RDMA — transferencias de memoria directas entre GPUs sobre red — para mover el contexto del modelo sin copiarlo por CPU. El resultado titular: **3× de aceleración corriendo Kimi K2.5** frente a su stack anterior.

8. **[Unweight](https://blog.cloudflare.com/unweight-tensor-compression/).** Comprimen modelos LLM entre 15 y 22% sin perder nada — cada byte que sale es idéntico al original, como si no hubieras comprimido. La técnica es codificación Huffman — el mismo truco de compresión sin pérdida que usa un `.zip` — aplicada a la representación interna de los pesos del modelo (el formato BF16, que es el que usan la mayoría de LLMs actuales). En Llama 3.1 8B eso significa ~3 GB menos de VRAM por modelo — suficiente para correr un modelo más grande en la misma GPU o meter dos instancias donde antes solo cabía una. Los kernels GPU están open source en `github.com/cloudflareresearch/unweight-kernels`. (No lo confundas con el 97-99.5%: ese es el número de Shared Dictionaries, más abajo.)

9. **[AI Search](https://blog.cloudflare.com/ai-search-agent-primitive/) (beta abierto, antes AutoRAG).** Un motor de búsqueda que cada agente puede indexar a su antojo. Mezcla dos técnicas clásicas — búsqueda semántica (por significado, usando embeddings vectoriales) y búsqueda por palabras clave (BM25, con tokenización Porter y trigramas) — y las combina con boosting de relevancia para que las consultas complejas funcionen bien. Antes se llamaba AutoRAG; ahora es API de producto con sus propios bindings (`ai_search_namespaces`). El almacenamiento va en R2, los vectores en Vectorize, y el crawling lo hace Browser Run. Gratis durante el beta.

10. **[Agent Memory](https://blog.cloudflare.com/introducing-agent-memory/) (beta privado).** Memoria persistente manejada para agentes — la capa que le falta al agente típico para dejar de ser amnésico entre conversaciones. La API es deliberadamente simple: cinco operaciones (guardar, recordar, recuperar, olvidar, listar) sobre cuatro tipos de memoria distintos (hechos, eventos, instrucciones, tareas). Detrás, cinco canales paralelos buscan lo relevante desde ángulos distintos y un algoritmo llamado Reciprocal Rank Fusion combina los resultados para que siempre salga lo mejor primero. La extracción de información usa Llama 4 Scout; la síntesis final usa Nemotron 3.

## 3. Orquestación: del workflow al SDK

11. **[Project Think](https://blog.cloudflare.com/project-think/) (preview).** El SDK de próxima generación de Cloudflare para construir agentes. Resuelve cuatro problemas clásicos de arquitectura con cuatro piezas:

    - **Durable Execution con Fibers** — los pasos de un agente sobreviven reinicios del servidor. Una llamada a `stash()` guarda el progreso, y el agente puede pausarse por minutos, horas o días sin perder su estado.
    - **Subagentes vía facetas** — cada subagente corre aislado, con su propia base de datos y su propio dominio de falla. Si uno se cae, no arrastra al padre.
    - **Sesiones persistentes** — las conversaciones se guardan como árboles que puedes bifurcar (para explorar caminos alternativos), compactar (para no llenar la ventana de contexto) y buscar con texto completo.
    - **Código sandboxeado** — una escalera de cinco niveles desde "solo sistema de archivos" hasta "sandbox completo de OS" (el mismo Sandboxes GA del punto 1).

    Si funciona como patrón, se vuelve el default para construir agentes en Cloudflare. Los previews se mueren seguido — pero este junta todas las piezas de la semana en un solo lugar.

12. **[Workflows v2](https://blog.cloudflare.com/workflows-v2/).** El motor de flujos de trabajo de Cloudflare tuvo un rediseño completo. Los números hablan solos: de 4.500 a **50.000 instancias concurrentes**, de 100 a **300 creaciones por segundo**, de 1 millón a **2 millones encoladas por workflow**. Dos componentes nuevos — *SousChef* (coordina la ejecución) y *Gatekeeper* (controla el acceso) — manejan la orquestación. La migración para los workflows existentes es sin downtime. El 10× no es matemática de marketing: es rediseño real.

13. **[Agent Lee](https://blog.cloudflare.com/introducing-agent-lee/) (beta).** Un asistente de IA metido directamente dentro del dashboard de Cloudflare. Un botón "Ask AI" en la esquina que hace diagnósticos, debugging, configuración y visualización en tiempo real — sin que tengas que salir de la interfaz para preguntarle a ChatGPT. Durante el beta: ~18.000 usuarios diarios y 250.000 llamadas a herramientas por día. Accesible incluso desde el plan gratis.

14. **[Registrar API](https://blog.cloudflare.com/registrar-api-beta/) (beta).** Por primera vez, los agentes pueden comprar dominios programáticamente desde Cloudflare Registrar. La API tiene tres operaciones básicas — buscar disponibilidad, verificar, registrar — a precios al costo (sin markup), con WHOIS privacy por defecto, y acceso directo por MCP. El registro es asíncrono: respondes con un 202 y el cliente pregunta periódicamente hasta que termine. Y como los dominios no son reembolsables, el flujo del agente necesita confirmación humana explícita antes de pulsar "comprar".

## 4. Las interfaces con el mundo

15. **[Browser Run](https://blog.cloudflare.com/browser-run-for-ai-agents/) (GA).** El rebranding de Browser Rendering, con muchas más capacidades. **Live View** te permite mirar a un agente trabajar en tiempo real. **Human in the Loop** inyecta un humano en la sesión cuando el agente se atora (útil para captchas, confirmaciones, decisiones). Compatible con cualquier cliente Puppeteer o Playwright estándar — hablan Chrome DevTools Protocol sobre WebSocket, así que tu código actual funciona sin cambios. Grabaciones de sesión vía `rrweb` (una librería open-source que captura cada interacción para replay). Un endpoint **Crawl** que devuelve la página en HTML, Markdown o JSON ya procesado. **Quick Actions** sobre REST para tareas puntuales. La concurrencia pasó de 30 a **120**. Habla MCP nativo con Claude Desktop, Cursor y OpenCode. Y trae **soporte experimental de WebMCP** — el navegador mismo se convierte en una superficie de herramientas para agentes.

16. **[Voice SDK](https://blog.cloudflare.com/voice-agents/) (experimental).** Un SDK (`@cloudflare/voice`) para darle voz a tu agente. El audio viaja como PCM mono a 16 kHz sobre WebSocket (formato ligero, fácil de procesar). Para convertir voz a texto (STT) usa Deepgram Flux + Nova 3; para convertir texto a voz (TTS) usa Deepgram Aura. Envuelves tu agente con `withVoice(Agent)` o `withVoiceInput(Agent)` y en el cliente tienes hooks de React listos para usar. En unas 30 líneas de código del servidor, tu agente empieza a hablar.

17. **[Email Service](https://blog.cloudflare.com/email-for-agents/) (beta público).** Envío y recepción de correos electrónicos para agentes. Los registros SPF, DKIM y DMARC (los que autorizan a tu dominio a enviar correos sin caer en spam) se configuran automáticamente — uno de los problemas más tediosos de operar email propio resuelto de entrada. Tienes un binding directo desde Workers, una REST API con SDKs en TypeScript, Python y Go, un servidor MCP incluido, y los headers de ruteo vienen firmados con HMAC-SHA256 para evitar callbacks suplantados (algo importante cuando un agente recibe correos automáticamente). Porque es 2026 y todo habla MCP.

## 5. Identidad y red privada

18. **[Managed OAuth for Access](https://blog.cloudflare.com/managed-oauth-for-access/) (beta abierto).** Un servidor de autorización OAuth — el componente que emite los tokens que un agente usa para acceder a tu app — que se enciende con un solo click en cualquier app protegida por Cloudflare Access. Implementa desde el día uno tres estándares clave: **RFC 7591** (para que los clientes se registren automáticamente sin configuración manual), **RFC 7636** (PKCE, que previene que alguien intercepte el código de autorización en el camino), y **RFC 9728** (metadata que le dice a los agentes exactamente cómo autenticarse). Sirve el metadata en `/.well-known/oauth-authorization-server`, envía los headers `www-authenticate` correctos en los requests sin auth, y — crítico — preserva la atribución por usuario (cada acción del agente sigue siendo rastreable a la persona real detrás). La respuesta al problema de identidad para agentes deja de ser teatro y se vuelve compatible con los estándares.

19. **[Cloudflare Mesh](https://blog.cloudflare.com/mesh/).** Una red privada unificada para todo lo que Cloudflare ofrece — usuarios, servidores (nodos), agentes y Workers, todos hablando dentro de la misma mesh. Los productos anteriores tuvieron rebranding: WARP Connector se vuelve "Mesh node"; WARP Client se vuelve "Cloudflare One Client". El tier gratis es generoso — 50 nodos + 50 usuarios — y los bindings VPC de Workers pueden alcanzar bases de datos privadas directamente, sin necesidad de un servidor intermedio ("jump host") como antes.

20. **[Identidades no-humanas](https://blog.cloudflare.com/improved-developer-security/).** Cloudflare cambió sus formatos de credenciales para que se puedan detectar y revocar automáticamente. Los nuevos tokens tienen prefijos distintos según para qué sirven (`cfk_` para API keys de usuario, `cfut_` para API tokens de usuario, `cfat_` para API tokens de cuenta), y cada uno incluye un checksum — una firma corta que permite identificarlos sin ambigüedad. Si por error subes un token a un repo público de GitHub, el Secret Scanning de GitHub lo detecta y Cloudflare lo revoca automáticamente, antes de que alguien pueda usarlo. La integración con Cloudflare One DLP extiende esta detección a Gateway, Email, CASB y AI Gateway. Además, Resource-Scoped RBAC pasó a GA: por fin puedes emitir llaves con scope de una sola zona en una sola cuenta (antes eran globales o por cuenta entera).

21. **[Enterprise MCP + Code Mode](https://blog.cloudflare.com/enterprise-mcp/).** Una arquitectura de referencia para empresas que quieren desplegar MCP a escala, con seguridad y observabilidad. Une seis productos en un solo stack: Remote MCP Servers + Access (autenticación) + MCP Server Portals (gestión) + AI Gateway (observabilidad) + Gateway (control de tráfico) + WAF (protección contra ataques). La pieza más interesante es **Code Mode**: en vez de registrar cada herramienta MCP individualmente en el prompt del agente (lo que puede inflarlo con decenas de definiciones y desperdiciar contexto), el portal expone solo dos herramientas — `portal_codemode_search` para descubrir qué herramientas existen y `portal_codemode_execute` para ejecutarlas. Un ejemplo real cortó un prompt de **9.400 tokens a 600** — una reducción del 94%. También incluye detección de "MCP sombra" — servidores MCP desplegados sin autorización dentro de la red — mediante escaneo de hostnames, patrones en rutas URI, y regex sobre los cuerpos JSON-RPC que pasan por el Gateway.

## 6. Los estándares: aquí la semana da el giro más interesante

Si las capas anteriores fueron producto, esto es protocolo. Cada uno de estos estándares da para su propia sección; aquí va solo lo esencial.

22. **[Content Signals](https://contentsignals.org/) en robots.txt.** Una directiva nueva dentro de `robots.txt` que te deja declarar tus preferencias para tres categorías distintas: `ai-train` (¿pueden los modelos entrenarse con tu contenido?), `search` (¿puede tu contenido aparecer en búsquedas?) y `ai-input` (¿pueden las respuestas de IA citar o resumir tu contenido?). Hasta ahora, la única opción era `allow` o `disallow` — que no distingue entre "indéxame" y "no me entrenes". Ahora esa diferencia por fin tiene sintaxis.

23. **Link response headers ([RFC 8288](https://www.rfc-editor.org/rfc/rfc8288)).** Headers HTTP `Link:` que colocas en la respuesta de tu homepage apuntando a recursos legibles por máquina — típicamente a tu `/.well-known/api-catalog` o a otros archivos que describen tus APIs. La idea es elegante: un agente que visite tu sitio puede hacer un simple `HEAD /` (pedir solo los headers, no el cuerpo HTML) y desde ahí descubrir toda la superficie programática del sitio, sin tener que renderizar ni parsear nada.

24. **[La familia `.well-known/` completa](https://blog.cloudflare.com/agent-readiness/).** Seis documentos JSON en rutas canónicas de tu sitio, cada uno atado a un estándar real. Funcionan como un sistema de "tarjetas de presentación" que cualquier agente sabe dónde buscar:

    - `/.well-known/api-catalog` — catálogo de las APIs del sitio (RFC 9727, servido como `application/linkset+json`, un JSON que lista tus endpoints con metadata).
    - `/.well-known/openid-configuration` o `/.well-known/oauth-authorization-server` — metadata del servidor de autorización OAuth (OIDC Discovery 1.0 / RFC 8414).
    - `/.well-known/oauth-protected-resource` — qué recursos del sitio están protegidos y qué servidor los autoriza (RFC 9728).
    - `/.well-known/mcp/server-card.json` — la "tarjeta" MCP del sitio — qué capacidades y herramientas soporta (MCP SEP-1649 / PR #2127).
    - `/.well-known/agent-skills/index.json` — índice de las skills que el sitio publica, cada una con un digest SHA-256 sobre los bytes servidos para verificar integridad (Agent Skills Discovery RFC v0.2.0 de Cloudflare).

    No hace falta leer cada RFC de principio a fin para implementarlos, pero sí vale la pena entender por qué existen.

25. **[WebMCP](https://webmachinelearning.github.io/webmcp/).** Una API nueva del navegador — `navigator.modelContext.registerTool()` — que le permite a una página publicar las herramientas que expone para que un agente corriendo *dentro* del mismo navegador pueda llamarlas. Es literalmente MCP pero viviendo en el tab: el agente tiene acceso completo a la sesión del usuario con el sitio (cookies, estado OAuth, localStorage, lo que sea). Útil para extensiones tipo Claude en el browser, o asistentes integrados al navegador que necesitan interactuar con la web como si fueran el usuario. El SDK de Browser Run ya lo soporta en modo experimental.

26. **[Agent Skills Discovery RFC](https://github.com/cloudflare/agent-skills-discovery-rfc) (Apache 2.0).** Cloudflare publicó su propio RFC — una de las contribuciones más abiertas de la semana, con licencia Apache 2.0. Define dos cosas: el formato del índice de skills (un JSON con un campo `$schema` y un array `skills[]` donde cada entrada tiene `name`, `type`, `description`, `url` y un `digest` SHA-256) y el formato SKILL.md (un Markdown simple con frontmatter YAML para los metadatos `name` y `description`). La idea: que cualquier sitio pueda publicar sus skills de forma estandarizada, descubrible y verificable — no solo Cloudflare. Versión v0.2.0 al momento de escribir esto; el repositorio está abierto para contribuciones.

## 7. Velocidad, red, feature flags

27. **[Shared Dictionaries](https://blog.cloudflare.com/shared-dictionaries/) (RFC 9842).** Cloudflare implementa Compression Dictionary Transport — una técnica que usa versiones anteriores de un asset como "diccionario" para comprimir la versión nueva mucho más allá de lo que logra gzip o brotli solos. Dos formatos: DCB (Brotli) y DCZ (Zstd). El navegador le dice al servidor qué diccionarios ya tiene cacheados (header `Available-Dictionary`), el servidor marca qué recursos sirven como diccionario (`Use-As-Dictionary`), y la negociación se completa en `Accept-Encoding`. Soportado nativamente en Chrome y Edge 130+; Firefox lo está implementando. Las pruebas internas reportan **97-99.5% de reducción** de peso al redesplegar un sitio (porque los clientes ya tienen la versión anterior cacheada como diccionario). Phase 1 beta arranca el 30 de abril. (Y sí — este es el número 97-99.5% que circuló esta semana, no el 22% de Unweight.)

28. **[Redirects for AI Training](https://blog.cloudflare.com/ai-redirects/).** Cloudflare convierte automáticamente las tags `<link rel="canonical">` de tu HTML en redirecciones HTTP 301 — pero *únicamente* cuando la request viene de un crawler de IA verificado (GPTBot, ClaudeBot, Bytespider). La implementación usa `cf.verified_bot_category`, una categoría distinta de las de AI Assistant y AI Search. ¿Por qué importa? Porque le da al autor una forma elegante de decir "esta URL es la canónica; entrena desde allí" sin los efectos raros de `noindex` ni las acrobacias que a veces hay que hacer en `robots.txt`. Canonicalización AEO con la semántica correcta, aplicada solo donde importa.

29. **[Actualización de rendimiento de red](https://blog.cloudflare.com/network-performance-agents-week/).** Según la medición más reciente de Cloudflare (diciembre 2025), ahora son la red más rápida en el 60% de las top-1.000 redes del mundo, arriba del 40% en septiembre del mismo año. Tres factores detrás del cambio: un rewrite completo de FL2 (el sistema interno de forwarding) a Rust, ganancias en el soporte de HTTP/3, y 261 nuevas redes agregadas entre septiembre y diciembre.

30. **[Flagship](https://blog.cloudflare.com/flagship) (beta privado).** Feature flags nativos dentro de la plataforma de Cloudflare. Los Workers corren la evaluación (sub-milisegundo gracias al edge), los Durable Objects sirven como plano de control (donde defines las reglas), y KV cachea la config global. El SDK es compatible con OpenFeature — el estándar abierto para feature flags — así que puedes migrar desde LaunchDarkly o similar sin reescribir tu código de aplicación. Soporta hasta 5 niveles anidados de lógica AND/OR y rollouts por porcentaje con hashing consistente (el mismo usuario siempre cae en el mismo bucket, aunque el flag cambie).

31. **[Agent Readiness score](https://blog.cloudflare.com/agent-readiness/) + [isitagentready.com](https://isitagentready.com/).** La herramienta que cierra la semana y que por fin convierte "¿tu sitio está listo para agentes?" de pregunta vaga en un número de 0 a 100. Evalúa cuatro dimensiones — Contenido, Descubribilidad, Control de Acceso de Bots, y APIs/Auth/MCP/Skills — chequeando por debajo todo lo que ya listamos: documentos `.well-known/`, Link headers, Content Signals, WebMCP en el navegador. Es el tablero externo que le faltaba a la conversación: *"aquí están las reglas; califica al resto de nosotros"*.

Para no dejarlo solo en teoría, corrí el scan contra mi sitio.

<figure>
<img src="/images/blog/posts/cloudflare-agents-week-2026/figure-scorecard-33.webp"
     alt="Captura de isitagentready.com para xergioalex.com el 19 de abril de 2026: puntuación total 33, Level 1 Basic Web Presence. Las cuatro categorías marcan Discoverability 67 (2/3), Content 100 (1/1), Bot Access Control 50 (1/2), y API, Auth, MCP & Skill Discovery 0 (0/6)."
     width="1020"
     height="758"
     loading="lazy" />
<figcaption>isitagentready.com, 19 de abril de 2026: punto de partida en 33/100. Contenido al máximo gracias al trabajo previo sobre Markdown for Agents; el resto de categorías son plan de trabajo concreto. — <a href="https://isitagentready.com/">Califica tu sitio</a>.</figcaption>
</figure>

Contenido ya está al 100. Los otros tres — Descubribilidad, Control de Acceso de Bots, y todo el bloque de APIs/Auth/MCP/Skills — son el trabajo que queda por hacer. Y eso da para un post aparte: cómo llegar al 100 en cada uno, paso por paso.

## Qué significa todo esto

Si miras la semana en conjunto, no son 31 productos sueltos. Son tres movimientos encadenados.

**Capa uno — infraestructura.** Ahora el agente tiene casi todo lo que tendría un humano frente a un computador: un espacio donde instalar cosas y ejecutarlas (Sandboxes), un motor que coordina sus tareas (Workflows v2, Project Think), una capa para pensar (AI Platform + Infire + Unweight), memoria que persiste entre conversaciones (Agent Memory), almacenamiento con versiones (Artifacts), búsqueda (AI Search), un navegador (Browser Run), una voz (Voice SDK), correo electrónico (Email Service) y un asistente dentro del dashboard (Agent Lee). Es un stack entero, no un feature suelto.

**Capa dos — identidad e interfaces.** Ahora el agente puede tener credenciales reales y revocables, del mismo tipo que usa un humano (Managed OAuth for Access + los nuevos formatos de tokens). Puede entrar a redes privadas sin necesitar un servidor puente (Cloudflare Mesh). Y donde antes cargaba con 52 herramientas distintas en su prompt, ahora basta con apuntarlo a 2 portales (Enterprise MCP + Code Mode). Traducción: el agente ya puede entrar como un usuario más, con permisos auditables.

**Capa tres — estándares y medición.** Esta es la capa más interesante. Aquí Cloudflare deja de venderte productos y empieza a empujar convenciones para la web entera: Content Signals en robots.txt, Link headers, la familia `.well-known/*`, WebMCP, el RFC de Agent Skills Discovery. Más una herramienta que convierte "¿tu sitio está listo para agentes?" de pregunta vaga en un número concreto. Si estos estándares funcionan, dejan de ser producto de Cloudflare y pasan a ser plomería pública de la web — como el HTTPS, como el DNS.

Todo esto viene de un solo vendedor empujando una serie de propuestas. Algunas van a funcionar; otras no. Pero la mayoría apuntan a estándares reales que pertenecen a los organismos oficiales de la web (IETF y WHATWG) — los mismos que en su día definieron HTTP y HTML. Los RFC en cuestión (8288, 9727, 9728, 8414) existen por su cuenta, independientes del producto de Cloudflare. Si mañana Cloudflare cambia de rumbo, las piezas base siguen siendo válidas.

La queja con la que abrí este post — que la medición del AEO iba años atrás de la optimización — me duró menos de lo que esperaba. Al menos para una definición de "listo".

Si Cloudflare gana esta jugada, se vuelven el carril central de la web agéntica. Si no, las piezas base siguen su camino sin ellos. Para un vendedor es una apuesta rara: gane o pierda, los que construimos en la web salimos ganando.

Sigo construyendo.

## Recursos

- [Agents Week 2026 — página de Cloudflare](https://www.cloudflare.com/agents-week/)
- [Archivo del tag Agents Week](https://blog.cloudflare.com/tag/agents-week/)
- [Introducing the Agent Readiness score](https://blog.cloudflare.com/agent-readiness/)
- [isitagentready.com](https://isitagentready.com/)
- [Agent Skills Discovery RFC (Cloudflare, Apache 2.0)](https://github.com/cloudflare/agent-skills-discovery-rfc)
- [Discusión MCP Server Card — SEP-1649 / PR #2127](https://github.com/modelcontextprotocol/modelcontextprotocol)
- [RFC 8288 — Link headers](https://www.rfc-editor.org/rfc/rfc8288)
- [RFC 9727 — API Catalog](https://www.rfc-editor.org/rfc/rfc9727)
- [RFC 9842 — Compression Dictionary Transport](https://www.rfc-editor.org/rfc/rfc9842)
- [Content Signals](https://contentsignals.org/)
- [WebMCP](https://webmachinelearning.github.io/webmcp/)
- [Kernels de Unweight (OSS)](https://github.com/cloudflareresearch/unweight-kernels)
