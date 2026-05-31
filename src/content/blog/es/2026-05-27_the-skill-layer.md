---
title: "La capa de las skills: cuando los agentes dejan de reinventar la rueda"
description: "Un archivo de markdown se está volviendo el estándar en que los agentes de IA comparten conocimiento. Publiqué uno en abierto y aprendí en el camino."
pubDate: "2026-05-27"
heroImage: "/images/blog/posts/the-skill-layer/hero.webp"
heroLayout: "side-by-side"
tags: ["tech", "dailybot", "ai-agents", "claude"]
keywords: ["qué son las agent skills", "estándar open agent skills", "instalar skill desde URL en agente IA", "skill pack oficial de Dailybot", "registro skills.sh Vercel", "agentes IA reutilizar capacidades", "divulgación progresiva en agent skills"]
series: "working-with-agents"
seriesOrder: 7
draft: true
---

Hace unas semanas le dije a un agente: *"install this skill from `https://api.dailybot.com/skill.md`, please."* ("instala esta skill desde `https://api.dailybot.com/skill.md`, por favor.") Funcionó. El agente fetcheó el markdown, lo leyó como una receta, y un minuto después yo tenía una integración funcionando con mi propio producto. Sin gestor de paquetes, sin `npm install`, sin instalador firmado. Una URL y una solicitud cortés.

No existe un comando *"install skill from URL"* en Claude Code. No hay un registry compartido detrás de `api.dailybot.com`. El agente hizo un `WebFetch`, parseó instrucciones escritas en inglés plano, y decidió ejecutarlas. La "skill" no era software — era un contrato, escrito en markdown, que cualquier agente lo suficientemente capaz acordaba honrar.

Llevo semanas pensando en ese momento. Cuatro, para ser exacto. En ese tiempo reescribí la skill tres veces, sobreviví una auditoría de seguridad que me bajó los humos, descubrí que un tercero había publicado una versión de "mi" skill antes que yo, y saqué cuatro releases públicos. En el camino me formé opiniones fuertes sobre una capa de infraestructura para agentes de la que casi nadie habla todavía — pero que todos están a punto de empezar a usar.

Esto es un reporte de campo sobre qué son las skills realmente, cómo se rompen, y por qué el ecosistema ya importa más de lo que su nivel de ruido sugiere.

---

## Entonces, ¿qué *es* una Skill, técnicamente?

La respuesta más simple posible: una Skill es un directorio que contiene un archivo de markdown llamado `SKILL.md`, y ese archivo tiene una cabecera YAML frontmatter con al menos un `name` y una `description`. Esa es toda la especificación.

Aquí va una real — el router del [skill pack de Dailybot](https://github.com/DailybotHQ/agent-skill) que publiqué:

```yaml
---
name: dailybot
description: Official Dailybot agent skill pack — report progress, check messages, send emails, announce agent status, complete check-ins, give kudos, resolve teams, and run the full forms lifecycle. Routes to the right sub-skill based on intent.
version: "1.4.0"
documentation_url: https://api.dailybot.com/skill.md
user-invocable: true
allowed-tools: Bash, Read, Grep, Glob
---
```

El cuerpo del archivo es lo que sea que la skill necesite enseñarle al agente — cuándo activarse, qué comandos correr, cómo autenticar, cómo manejar errores. Hay un bloque `metadata` pequeño y opcional para configuración específica del harness, y puedes dejar archivos de soporte al lado del `SKILL.md` — scripts, docs de referencia, ejemplos. El agente los lee cuando los necesita.

El formato es el [estándar Open Agent Skills](https://agentskills.io) — publicado por Anthropic y adoptado ya por decenas de agentes: Claude Code, Cursor, OpenAI Codex, Gemini CLI, GitHub Copilot, Windsurf, Cline, y una larga cola de otros más pequeños. No lo implementan idénticamente, pero todos leen el mismo `SKILL.md`. Que el estándar viva en `agentskills.io` y no en `claude.com/skills` es parte del punto — Anthropic lo donó.

El detalle que hace que funcione a escala es la **divulgación progresiva**. Cuando lanzas un agente, carga solo el campo `description` de cada skill que conoce — un párrafo o dos, costo de contexto total: pequeño. El cuerpo completo del `SKILL.md` se lee solo cuando la descripción matchea con la intención del usuario y la skill se invoca de verdad. Puedes tener cien skills disponibles en una sesión y el costo de contexto es despreciable hasta que una de ellas se dispara.

Eso no es un detalle arquitectónico menor. Es la razón por la que las skills pueden escalar a cientos de capacidades sin ahogar al modelo. Un system prompt monolítico con cada comportamiento posible cocinado adentro habría chocado contra una pared hace años. La divulgación progresiva significa que sigues sumando sin pagar por lo que no usas.

---

## El frontmatter es la interfaz de usuario

La parte que más me sorprendió cuando empecé a escribir skills: el matching es **descriptivo**, no declarativo. No hay regla `if-then`. El agente lee tu campo `description` — el `description` de cada skill — y decide si lo que el usuario dijo suena lo suficientemente parecido a alguna de ellas como para dispararla.

Lo cual quiere decir que la `description` es toda la UX de tu skill. La aciertas y la skill se activa cuando debe. La equivocas y o nunca se activa, o se dispara sobre cosas en las que no debería.

El patrón que funciona:

> *Send progress updates after completing meaningful work. Use after a task is done or 3+ files have been edited. Reports read like standup updates. Do NOT use for bug reports or status questions.* ("Envía actualizaciones de progreso después de completar trabajo significativo. Úsala después de que una tarea esté hecha o 3+ archivos hayan sido editados. Los reportes leen como updates de standup. NO la uses para reportes de bugs o preguntas de estado.")

Tres cosas cocinadas adentro: qué hace, cuándo usarla, cuándo *no* usarla. La línea del "no" está haciendo mucho trabajo — le dice al agente que se quede fuera de territorio que se traslapa con otra skill.

El patrón que no funciona:

> *Talk to Dailybot.* ("Habla con Dailybot.")

Demasiado vago. El agente no tiene señal de si *"quiero escribir un correo de seguimiento"* debería activar esto. Así que se activa sobre todo, o sobre nada, dependiendo del día.

**Una `SKILL.md` es un contrato.** El frontmatter es la página de firma. La `description` es la única parte que el agente vuelve a leer en cada sesión, y la única parte con la que no te puedes dar el lujo de ser perezoso.

---

## Un estándar, muchas casas, ningún marketplace único

Asumí que como las skills son un estándar real, tendría que haber un lugar canónico para publicarlas. No lo hay. Hay un ecosistema fragmentándose de maneras interesantes.

| Capa | Ejemplos | Qué es |
|------|----------|--------|
| El estándar | [agentskills.io](https://agentskills.io) | La spec de `SKILL.md`. Sin registry. |
| Registries cross-agent | [skills.sh](https://www.skills.sh) (respaldada por Vercel), [autoskills.sh](https://www.autoskills.sh) (de midudev), agensi.io, lobehub.com | Indexan skills alojadas en GitHub. Estilos de curación distintos. |
| Plugins por agente | Plugins de Claude Code, registry nativo de OpenClaw | Cada agente tiene su propia distribución nativa. |
| Configuración universal | Estándar [AGENTS.md](https://agents.md) | Una convención separada (Linux Foundation ahora) para instrucciones a nivel de proyecto. Complementaria a las skills, no compite. |
| Distribución directa | Git clone + script de setup | A la vieja escuela, sigue funcionando. |

[skills.sh](https://www.skills.sh) — el registry más visible — es una capa delgada sobre GitHub. El patrón de URL es `skills.sh/{owner}/{repo}/{skill-name}` y detrás el "registry" es un indexador que escanea repos públicos de GitHub y registra hashes SHA-256 para verificación. No hay paso de upload. Tú publicas en GitHub, los usuarios instalan con `npx skills add <owner>/<repo>`, [Vercel](https://github.com/vercel-labs/skills) corre el índice.

Lo que no caí en cuenta hasta que intenté publicar: skills.sh ofrece de verdad *dos* cosas, con perfiles de fricción muy distintos. La **CLI** (`npx skills add`) funciona contra cualquier repo público de GitHub desde el día uno — no requiere listing. El **leaderboard y el índice de búsqueda**, sin embargo, están gateados por un issue manual *"Listing: Request indexing"* que tú abres en `vercel-labs/skills`. Así que una skill puede ser totalmente instalable antes de ser descubrible. Ambas cosas son reales; ninguna es automática.

[autoskills.sh](https://www.autoskills.sh) es más opinionada. La CLI de midudev escanea tu proyecto (`package.json`, `pyproject.toml`, etc.), descubre tu stack, e instala skills curadas relevantes. Por debajo jala de skills.sh. Corre `npx autoskills` en un proyecto Next.js e instala skills con sabor a Next.js.

No hay una "tienda oficial de Anthropic" estilo App Store. Los [plugins de Claude Code](https://code.claude.com/docs/en/skills) se distribuyen a través de archivos `marketplace.json` alojados en git — cualquiera puede publicar un marketplace, los usuarios lo añaden manualmente con `/plugin marketplace add <owner>/<repo>`. El repo oficial de skills de Anthropic vive en la misma capa que el de todos los demás.

Y luego está la parte aburrida. Una skill es portable en el sentido de que el formato del archivo es idéntico entre agentes. *No* es portable en el sentido de que cada agente la busca en un lugar distinto del disco:

| Agente | Dónde busca las skills |
|--------|-------------------------|
| Claude Code | `~/.claude/skills/<name>/SKILL.md` |
| Cursor | `~/.cursor/skills/<name>/SKILL.md` |
| OpenAI Codex CLI | `~/.codex/skills/<name>/SKILL.md` |
| Windsurf | `~/.codeium/windsurf/skills/<name>/SKILL.md` |
| GitHub Copilot | `~/.copilot/skills/<name>/SKILL.md` |
| Cline | `~/.cline/skills/<name>/SKILL.md` |
| Gemini CLI | `~/.gemini/skills/<name>/SKILL.md` |
| OpenClaw | `<workspace>/skills/<name>/` o `~/.openclaw/skills/` |

Así que la historia de instalación para cualquier skill cross-agent es: clona el repo una vez, luego haz symlink de la carpeta de la skill dondequiera que el agente de cada usuario la espere. La CLI de skills.sh hace esto con flags `--symlink`/`--copy`. Para usuarios que no la tienen, escribes un `setup.sh` que detecta qué agentes están presentes en la máquina y crea los symlinks por agente.

**El estándar es universal.** La realidad del filesystem no. Si estás acostumbrado a npm, esto se ve caótico. Si estás acostumbrado a los días tempranos de cualquier estándar, se ve normal — una spec, varias capas de descubrimiento, y el tiempo ordena la consolidación. Por ahora el consejo práctico es publicar en un repo público de GitHub siguiendo el estándar y dejar que aparezca en los registries que auto-indexan. Tú no eliges; ellos eligen.

---

## La auditoría que me bajó los humos

Saqué la primera versión de la skill de Dailybot por instinto. Funcionaba en mi máquina. El flujo de instalación era mágico — *"instala esta skill desde la URL"* y un minuto después estaba todo cableado. Estaba orgulloso.

Luego le pedí a un agente enfocado en seguridad que hiciera una revisión hostil. Volvió con diez hallazgos, cuatro marcados como serios. El primero me dijo que el flujo de instalación del que estaba tan orgulloso era, estructuralmente, el mismo patrón que un ataque de cadena de suministro:

> *The skill instructs the agent to run `curl … install.sh | bash` without integrity verification, and tells the agent not to ask the user for permission. This is one of the patterns security people flag first when reviewing install flows — bypassing the human's confirmation step.* ("La skill le dice al agente que corra `curl … install.sh | bash` sin verificación de integridad, y le dice que no le pida permiso al usuario. Este es uno de los patrones que la gente de seguridad marca primero cuando revisa flujos de instalación — saltarse el paso de confirmación humana.")

Me quedé un rato sentado con eso.

El segundo hallazgo era sobre modificación silenciosa de archivos de configuración del agente. La skill, en su primera ejecución, estaba escribiendo a `~/.claude/CLAUDE.md`, `~/.codex/AGENTS.md`, y `~/.gemini/GEMINI.md` — los archivos de instrucciones persistentes de cada agente — para habilitar auto-activación en sesiones futuras. Lo hacía sin mostrarle al usuario el archivo, el contenido, ni preguntar. La auditoría señaló que esos archivos son el equivalente al autostart de Windows para agentes de IA. Modificarlos globalmente sin consentimiento es el tipo de movida que haces una vez y luego nunca vuelves a confiar en la herramienta que la hizo.

El tercer hallazgo era sobre correo. La skill exponía una capacidad `email send` que tomaba un destinatario arbitrario y un cuerpo HTML. Tenía rate limits pero no allowlist de destinatarios, no confirmación del destinatario, no escaneo de patrones tipo credencial en el cuerpo. Una prompt injection en un README, en el cuerpo de un issue, o en un archivo de dependencias podría instruir al agente a enviar el contenido de un `.env` a un atacante. La instrucción *"never include secrets"* ("nunca incluyas secretos") en la skill era una directiva al modelo, no enforcement. Los modelos siguen instrucciones inyectadas. De verdad.

No pensé en nada de esto cuando publiqué. Pensé: *la skill funciona, el usuario quiere reportes de progreso, claro que los quiere sin fricción*. Lo cual era cierto. Y lo cual era también, en el encuadre que la auditoría me dio, exactamente el default equivocado. Honestamente, la parte que dolió fue que acababa de pasarme semanas escribiendo sobre cómo dirigir agentes con cuidado — y luego saqué una skill que le pasó un martillo al agente y no le pidió nada a cambio.

**La magia sin consentimiento no es un feature.** Es un olor a problema de seguridad disfrazado con ropa bonita.

---

## Consentimiento vs magia — el problema de UX que a nadie le gusta

Arreglar los hallazgos de la auditoría significó añadir tres prompts de consentimiento:

1. **La primera vez que la skill instala la CLI en una sesión** — muestra el comando, pregunta una vez, no vuelve a preguntar en la misma sesión.
2. **La primera vez que la skill escribe a un archivo global de configuración del agente** — muestra la ruta del archivo, muestra el contenido exacto que se va a añadir, pregunta una vez. Envuelve el bloque en marcadores `<!-- dailybot-auto-activation: BEGIN/END -->` para que los usuarios puedan grep-and-delete para desinstalar.
3. **Cada vez que la skill envía un correo** — muestra destinatario y un resumen de una línea del cuerpo, pregunta antes de enviar. Cachea destinatarios aprobados. Escanea el cuerpo buscando patrones de credencial antes de cada envío.

La queja que llegó inmediatamente: *"now it's not magical anymore."* ("ya no es mágico.")

Es una queja real. La primera versión se sentía como hacer trampa. Escribes una oración, ves al agente instalar software, modificar config, integrarse con un servicio externo. Reemplazar eso con dos prompts de confirmación en la primera instalación es, visceralmente, un downgrade.

Lo que la queja se pierde es que los prompts solo se disparan en la primera sesión. Después de que el usuario confirma una vez — consentimiento de instalación y de auto-activación — cada sesión subsiguiente es exactamente tan silenciosa como la versión "mágica" original. Fricción marginal total a lo largo de la vida de la skill: tres clics en la primera instalación, cero después. El correo mantiene su confirmación por acción porque el correo es la acción de mayor riesgo en el pack y un consentimiento de una sola vez no tiene sentido ahí.

Para gente que de verdad no puede pagar prompts — pipelines de CI, imágenes Docker, corridas de tests automatizados — hay una válvula de escape: `DAILYBOT_AUTO_YES=1`. Lo seteas en el environment y los prompts de instalación y auto-activación se saltan. La verificación SHA-256 sigue corriendo. Los chequeos de correo deliberadamente no se saltan, porque el threat model para exfiltración por correo no cambia solo porque estés en CI.

El encuadre que me ayudó a reconciliar el trade-off fue mirar cómo manejan el mismo problema las herramientas maduras:

| Herramienta | ¿Pregunta antes de instalar? | ¿Pregunta antes de modificar config global? |
|-------------|------------------------------|---------------------------------------------|
| Homebrew | Sí | Sí |
| `npm install -g` | No (pero requiere sudo) | No |
| `gh auth login` | N/A | Sí — muestra qué escribe a `~/.config/gh/` |
| Mi skill, v1.0 | No | No |
| Mi skill, hoy | Sí (una vez por sesión) | Sí (una vez por sesión) |

La primera versión era la rareza. La versión actual está más cerca de lo que las herramientas maduras hacen. La "magia" que perdí era la magia de los instaladores que no te dicen lo que están haciendo — y una vez que la nombré así, dejé de extrañarla.

---

## El plot twist: alguien más ya había publicado mi skill

Como tres semanas dentro de la reescritura, un compañero de equipo me mandó un mensaje por Slack. Habían visto un listing en skills.sh bajo [`membranedev/application-skills/dailybot`](https://www.skills.sh/membranedev/application-skills/dailybot). Nosotros no habíamos publicado. Alguien más lo había hecho. Bajo nuestro nombre.

Durante unos cuatro minutos pensé que nos habían hecho squatting. Después leí el listing.

No era squatting. Era [Membrane](https://github.com/membranedev/application-skills) — una empresa real construyendo una "API de integraciones para agentes de IA" — y su repo `application-skills` contenía, según el conteo de GitHub, más de tres mil integraciones de terceros: Gmail, Slack, HubSpot, Salesforce, GitHub, Stripe, Pipedrive, etc. La skill de Dailybot era una de esas. La habían construido de la misma forma que Zapier o Pipedream construyen conectores: escanean una API pública, generan un cliente, lo exponen a través de su proxy. Su skill llamaba a nuestra API pública a través de la capa de auth de Membrane. Usaba nuestro nombre para describir con qué integra — *uso nominativo* en términos de marca registrada — pero nunca decía ser nosotros.

Membrane había sido indexada semanas antes de que yo empezara la versión pública de la mía. Si me hubiera tomado otro mes puliendo en privado, la versión de terceros habría sido la única versión pública de "la skill de Dailybot." Los usuarios instalándola habrían recibido un wrapper CRUD genérico en vez de la skill opinionada, consciente del consentimiento y con forma de standup que de verdad queremos que tengan.

Así que publicamos de todas formas. No contra Membrane — al lado. Su skill expone una superficie CRUD genérica (list users, list teams, give kudos). La nuestra expone opiniones (cómo escribir un reporte tipo standup, cuándo enviarlo, cuándo quedarse callada). Las dos no son sustitutos. Están en diferentes capas de abstracción, y que sean descubribles lado a lado está bien para todos — incluyéndonos.

La lección fue más nítida que el pánico. En un ecosistema público de agentes, una integración de tu producto hecha por terceros no es una amenaza. Es lo mismo que tener un conector de Zapier — es alcance. **Otros van a publicar antes que tú.** Eso deja de dar miedo en el momento que lo aceptas como evidencia de que el estándar funciona.

---

## Cuatro semanas, cuatro releases — la respuesta operativa

Esta es la parte de la historia que no esperaba escribir cuando empecé. El primer release público de la skill salió como **v1.0.0 el 2 de mayo**. Mientras escribo esto, el 27 de mayo, la versión actual es **v1.4.0**. Cuatro releases menores en cuatro semanas, con todo el version bumping, la generación del changelog, y la creación de tags hechos por un workflow en vez de por mí.

La skill que salió en v1.0.0 tenía cuatro sub-skills: report, messages, email, health. La versión actual tiene ocho — las cuatro originales más check-in completion, kudos (ahora consciente de equipos, no solo por persona), team resolution como primitiva reutilizable, y un ciclo de vida completo de forms cubriendo submission, continuación de drafts, y transiciones de workflow-state. Cada una de esas aterrizó como PR, el workflow de auto-release leyó el prefijo del conventional commit (`feat:` → MINOR, `feat!:` → MAJOR, cualquier otra cosa → PATCH), bumpeó la versión en todos los archivos `SKILL.md`, prependió una sección a `CHANGELOG.md`, tageó el release, y creó un GitHub Release. Ningún archivo de versión tocado a mano.

Ese mecanismo es la respuesta operativa a una pregunta que tenía al principio de todo este ejercicio: *¿cómo mantienes una skill pública sin que los releases se vuelvan una carga?* Cada merge a `main` es un release. El bot maneja la mecánica. Los contribuidores solo escriben mensajes de commit con sentido.

Y luego está la **lección de echar para atrás** — la que no vi venir. Después de que el auto-release salió, intenté añadir encima markdown linting, codespell, y un workflow de cron-monitor que abriría issues en GitHub si la CDN se desviaba. Cada uno era defendible en aislamiento. Juntos añadían más ruido que señal: ajuste de configuración durante refactors, falsos positivos durante ediciones de prosa, un tracker de issues llenándose de *"the CDN responded with a transient 502 at 3am"* ("la CDN respondió con un 502 transitorio a las 3am") que se resolvían solos antes de que yo los leyera. Quitamos los tres. La lección generaliza — para una skill pública, el CI mínimo correcto son seis jobs (shellcheck, bats, validación de frontmatter, smoke tests de contenido, compatibilidad con bash 3.2, chequeo de links de markdown). Cada uno atrapa una clase real de error. Más allá de eso estás pagando por soluciones a problemas que todavía no tienes.

Quiero ser claro sobre qué demuestra realmente la trayectoria v1.0 → v1.4. No es *"publicamos mucho."* Es que el ecosistema absorbió todo eso. skills.sh siguió indexando. Cada usuario que corrió `npx skills update DailybotHQ/agent-skill` entre releases recibió la versión correcta. El formato `SKILL.md` nunca rompió compatibilidad con ninguno de los agentes contra los que lo probé. Los flujos de consentimiento aguantaron a través de los cuatro releases sin un solo hallazgo de auditoría reapareciendo. Nada de eso era inevitable. Pasó porque el estándar Open Agent Skills es real y los registries lo tratan como infraestructura que carga peso.

---

## Hacia dónde va todo esto

Creo que las skills son infraestructura temprana de algo más grande. La forma del asunto: los agentes se vuelven commodity, los agentes individuales se diferencian menos, y el moat se mueve hacia la capa que codifica *qué sabe hacer un agente*. Esa capa actualmente se llama Skills. Probablemente se llame de otra forma para cuando más importe — pero los artefactos van a verse como archivos `SKILL.md`, los registries van a verse como skills.sh, y las preguntas de seguridad van a verse exactamente como las que acabo de pasar cuatro semanas trabajando.

Si construyes herramientas, esta es la capa que hay que mirar. Si eres developer, esta es la capa donde tus agentes están a punto de empezar a tomar prestadas capacidades que tú no escribiste. Si eres un equipo de producto, esta es la capa donde alguien está a punto de publicar una integración de terceros de tu producto, contigo o sin ti.

Esto también es donde [el cambio de orquestación del que vengo escribiendo en esta serie](/es/blog/from-programmer-to-orchestrator/) se vuelve concreto: dirigir agentes es el trabajo escondido, pero las skills son cómo el agente recoge las herramientas con las que se dirige *a sí mismo*. El leverage se compone. Una persona, orquestando agentes, que a su vez instalan capacidades opinionadas que no tuvieron que escribir — ese es un stack que no existía hace dieciocho meses.

El estándar es real. El ecosistema es desordenado. Los trade-offs de seguridad son no-negociables. La fricción de hacerlo bien resultó ser acotada — tres prompts de confirmación en la primera instalación, cien líneas de UX de consentimiento, seis jobs de CI, un workflow de auto-release. Ese es todo el impuesto.

La skill que empecé a escribir hace cuatro semanas está en su cuarto release. Probablemente esté en el sexto o séptimo para cuando alguien lea esto. Esa cadencia — pequeña, frecuente, auditable — es la parte de la experiencia que más me sorprendió. Las skills no necesitan ceremonias de negociación de versión. No necesitan un mantenedor sosteniendo la palanca del release. Solo necesitan una spec, un registry que indexa desde GitHub, y la disciplina de escribir prefijos de conventional commit.

Tranquilamente se está volviendo una de las piezas de infraestructura mejor diseñadas con las que he trabajado este año. Vale la pena prestarle atención, vale la pena contribuir, vale la pena tenerle cuidado.

Sigo construyendo.

---

## Recursos

- [Estándar Open Agent Skills](https://agentskills.io) — la spec de `SKILL.md`
- [skills.sh](https://www.skills.sh) — registry cross-agent respaldada por Vercel
- [autoskills.sh](https://www.autoskills.sh) — instalador de skills consciente del stack por midudev
- [DailybotHQ/agent-skill](https://github.com/DailybotHQ/agent-skill) — la skill discutida en este post, como está hoy (v1.4.0, MIT)
- [Documentación de skills de Claude Code](https://code.claude.com/docs/en/skills) — los docs de Anthropic para autoría de skills dentro de Claude Code
- [Estándar AGENTS.md](https://agents.md) — la convención universal de instrucciones a nivel de proyecto que se empareja con las Skills
- [vercel-labs/skills](https://github.com/vercel-labs/skills) — la CLI open-source detrás de skills.sh
