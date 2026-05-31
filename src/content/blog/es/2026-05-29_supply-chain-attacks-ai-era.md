---
title: "Ataques a la cadena de suministro en la era de la IA: el estado del open source en 2026"
description: "Los registros públicos de paquetes distribuyeron malware una y otra vez el último año. Qué pasa, por qué la IA cambió el juego, y cómo blindar el install."
pubDate: 2026-05-29T10:00:00Z
tags: ["tech", "devops", "ai", "javascript"]
keywords: ["ataque cadena de suministro 2026", "qué es minimumReleaseAge pnpm", "gusano Shai-Hulud npm", "CVE-2025-30066 tj-actions", "slopsquatting paquetes alucinados", "compromiso axios npm 2026", "Bitwarden CLI malicioso", "postmortem TanStack npm", "PyPI Trusted Publishing", "seguridad open source 2026"]
heroImage: "/images/blog/posts/supply-chain-attacks-ai-era/hero-es.webp"
heroLayout: banner
draft: false
---

El software moderno se construye sobre dependencias de terceros. Cada vez que un desarrollador construye o publica una aplicación, su gestor de paquetes resuelve automáticamente decenas — a veces cientos — de dependencias desde repositorios públicos; y ese paso cada vez lo ejecuta más un agente de IA actuando en su nombre. Hay millones de paquetes circulando en esos repositorios. Y en el último año, varios de los más populares han sido secuestrados para distribuir código malicioso.

El registro del último año habla solo. En septiembre de 2025, npm vivió [su primer gusano informático auto-replicante](https://www.stepsecurity.io/blog/ctrl-tinycolor-and-40-npm-packages-compromised): código que al instalarse en la máquina de un desarrollador le robaba credenciales y se publicaba solo en otros paquetes del mismo dueño, infectando cientos en cuestión de días. En marzo, [axios](https://socket.dev/blog/axios-npm-package-compromised) — una librería usada por miles de empresas, con más de 100 millones de descargas semanales — publicó dos versiones maliciosas en una ventana de 39 minutos. En abril, [la herramienta de línea de comandos de Bitwarden](https://www.paloaltonetworks.com/blog/cloud-security/bitwardencli-supply-chain-attack/) estuvo bajo control de un atacante durante noventa minutos, y lo primero que hacía el malware al aterrizar en una máquina era escanear en busca de asistentes de IA para programar instalados. Y luego, en mayo: [42 paquetes de la organización `@tanstack/*`](https://tanstack.com/blog/npm-supply-chain-compromise-postmortem) comprometidos en una ventana de seis minutos, ocho días después [cientos más bajo `@antv/*`](https://www.microsoft.com/en-us/security/blog/2026/05/20/mini-shai-hulud-compromised-antv-npm-packages-enable-ci-cd-credential-theft/) en una de veintidós, y justo mientras escribía este post, Microsoft detectó [14 typosquats de `@opensearch-project`](https://www.microsoft.com/en-us/security/blog/2026/05/28/typosquatted-npm-packages-used-steal-cloud-ci-cd-secrets/) que ya no buscaban credenciales del developer — apuntaban directamente a secretos de AWS y de los pipelines de CI/CD.

Si construyes software en 2026, los repositorios de los que dependes están bajo ataque coordinado. Los paquetes maliciosos siempre han existido — lo nuevo es la velocidad, la escala, y la irrupción de los asistentes de IA en ambos extremos del juego. Del lado del atacante, la IA inventa nombres de paquetes plausibles, reescribe el código malicioso entre víctima y víctima, y empieza a apuntar contra los propios agentes de IA del desarrollador. Del lado de la víctima, esos mismos agentes corren `npm install` por nosotros con cada vez menos supervisión humana. Un agente envenenado escribe código envenenado durante meses.

Lo que sigue es un mapa de lo que está pasando, a quién están golpeando, y cómo la IA está reescribiendo el libreto — con una línea base defensiva concreta al final, la misma que acabo de aterrizar en este sitio, para developers que quieran cerrar el portillo. Casi todas las citas enlazan a fuente primaria: postmortems de los proveedores, investigación de firmas de seguridad, alertas de CISA. Nada acá es especulación.

---

## La ola no es solo de npm

Los titulares se concentran en npm porque es el registro con el mayor radio de impacto — un solo paquete popular puede tener cientos de millones de descargas semanales. Pero el mismo libreto viene corriendo en todos los registros públicos importantes.

<figure class="fig-narrow fig-narrow-70">
<img src="/images/blog/posts/supply-chain-attacks-ai-era/diagram-attack-anatomy-es.webp" alt="Diagrama horizontal de seis etapas que muestra la anatomía típica de un ataque a la cadena de suministro npm: (1) compromiso del mantenedor o del pipeline de publicación, (2) publicación de una versión maliciosa en una ventana corta de 6 a 90 minutos, (3) descarga automática vía npm install rutinario o el siguiente build del CI, (4) ejecución del script postinstall declarado en package.json, (5) robo de credenciales — AWS, GitHub, token de publicación de npm, accesos a 1Password — y (6) exfiltración a un repositorio público acompañada de propagación a otros paquetes del mismo dueño, formando el bucle auto-replicante que caracterizó a Shai-Hulud." width="1200" height="1200" loading="lazy" />
<figcaption>Anatomía típica de un ataque a la cadena de suministro: del compromiso del mantenedor a la exfiltración. El bucle de la etapa 6 a la etapa 2 es lo que convierte a Shai-Hulud en gusano.</figcaption>
</figure>

En su [State of the Software Supply Chain 2026](https://www.sonatype.com/state-of-the-software-supply-chain/introduction), Sonatype contó más de 454.000 paquetes maliciosos nuevos solo en 2025 — un 75% más que el año anterior. En el mismo reporte: los desarrolladores aceptan el 39% del código sugerido por IA sin revisar. Esos dos números, leídos juntos, explican por qué los ataques de hoy se sienten distintos a los de hace cinco años.

### npm — los incidentes que hicieron ruido

**Shai-Hulud (septiembre de 2025).** El primer gusano auto-replicante en la historia de npm — y el evento que marcó el resto del año. Un *gusano* informático es código que se copia solo de una víctima a otra; en este caso, una vez que un desarrollador instalaba la versión comprometida del paquete `@ctrl/tinycolor`, el código escaneaba su máquina buscando credenciales — claves de Amazon Web Services, accesos a GitHub, el token con el que el dueño publica versiones nuevas en npm — y usaba ese último token para infectar hasta veinte paquetes más del mismo dueño. [CISA emitió una alerta](https://www.cisa.gov/news-events/alerts/2025/09/23/widespread-supply-chain-compromise-impacting-npm-ecosystem) el 23 de septiembre. Para finales de mes, el conteo de paquetes infectados había pasado de unos 180 a más de 500. [Una segunda ola llegó dos meses después](https://unit42.paloaltonetworks.com/npm-supply-chain-attack/), esta vez con una bomba de respaldo: si el código no lograba robar credenciales limpiamente, borraba el directorio personal del usuario. [StepSecurity tiene el análisis técnico más completo](https://www.stepsecurity.io/blog/ctrl-tinycolor-and-40-npm-packages-compromised).

**Axios (marzo de 2026).** Lo importante: no fue un paquete falso con nombre parecido. Fue el paquete real `axios`, una de las librerías más usadas del ecosistema Node.js (más de 100 millones de descargas semanales, 174.000 proyectos dependientes). El 31 de marzo, alguien con acceso a la cuenta del mantenedor publicó dos versiones maliciosas con 39 minutos de diferencia. Cualquier proyecto configurado para actualizarse automáticamente a la última versión menor de axios — que es el comportamiento por defecto en npm — descargó el malware en su siguiente instalación. El código bajaba y ejecutaba un programa de control remoto en la máquina, dándole al atacante acceso al equipo de cualquier desarrollador desprevenido. [El postmortem de Socket](https://socket.dev/blog/axios-npm-package-compromised) lo desmenuza bien. La causa raíz: una credencial vieja del mantenedor que seguía activa al lado de la nueva autenticación segura. Un solo dato olvidado en una configuración.

**Bitwarden CLI (abril de 2026).** Bitwarden es un gestor de contraseñas; su herramienta de línea de comandos se distribuye vía npm. Estuvo comprometida unos noventa minutos el 22 de abril. Lo interesante no fue cómo entraron — el acceso inicial vino [a través de una pieza del pipeline automatizado de empaquetado de Bitwarden](https://www.endorlabs.com/learn/shai-hulud-the-third-coming----inside-the-bitwarden-cli-2026-4-0-supply-chain-attack), no de la cuenta del mantenedor — sino qué hacía el código una vez instalado. [El análisis de Palo Alto](https://www.paloaltonetworks.com/blog/cloud-security/bitwardencli-supply-chain-attack/) describe la parte que sigue dándome vueltas: lo primero que buscaba en la máquina del desarrollador eran instalaciones de Claude Code y Cursor — dos de los asistentes de IA para programar más usados — e intentaba modificar su configuración para inyectarles instrucciones persistentes. Las contraseñas de los usuarios finales de Bitwarden no fueron tocadas ([comunicado oficial](https://community.bitwarden.com/t/bitwarden-statement-on-checkmarx-supply-chain-incident/96127)). Pero el objetivo del ataque te dice exactamente dónde creen los atacantes que está el próximo gran punto de apalancamiento.

**TanStack (11 de mayo de 2026).** TanStack es una colección de librerías muy populares en el mundo de React. El [postmortem oficial](https://tanstack.com/blog/npm-supply-chain-compromise-postmortem) recorre tres vulnerabilidades encadenadas en el sistema automatizado que el equipo usa para publicar versiones nuevas: alguien aprovechó esa cadena para extraer la credencial con la que el pipeline publica en npm, y la usó para subir 84 versiones maliciosas en 42 paquetes. La detección tomó entre 20 y 26 minutos; todas fueron deprecadas en una hora y 43 minutos. Respuesta rápida. Y aun así, muy grave. [OpenAI publicó su propio postmortem](https://openai.com/index/our-response-to-the-tanstack-npm-supply-chain-attack/) confirmando que dos dispositivos corporativos fueron impactados durante la ventana, y respondió adoptando una defensa específica (`minimumReleaseAge`, de la que hablo más abajo) en todos sus pipelines internos. Es la primera adopción documentada por una organización de ese tamaño.

**AntV (19 de mayo de 2026).** Ocho días después de TanStack, otra ola masiva. La cuenta de un mantenedor de paquetes de visualización de datos publicó [637 versiones maliciosas distribuidas en 317 paquetes en una ventana de 22 minutos](https://www.microsoft.com/en-us/security/blog/2026/05/20/mini-shai-hulud-compromised-antv-npm-packages-enable-ci-cd-credential-theft/), incluyendo algunos con tráfico real (`size-sensor`, `echarts-for-react`, `timeago.js` — varios millones de descargas semanales cada uno). [Microsoft Security lo atribuyó al grupo TeamPCP](https://threats.wiz.io/all-actors/teampcp), el mismo detrás de variantes recientes de Shai-Hulud. El código robaba credenciales de gestores de contraseñas, accesos a la nube y permisos de infraestructura. Pero lo importante acá es la escala: 637 versiones en 22 minutos no se publican a mano. Los atacantes automatizaron el lado de la oferta. Los defensores — revisar, alertar, deprecar — siguen siendo humanos.

**vpmdhaj typosquats (28 de mayo de 2026).** Microsoft Security destapó [14 paquetes maliciosos](https://www.microsoft.com/en-us/security/blog/2026/05/28/typosquatted-npm-packages-used-steal-cloud-ci-cd-secrets/) publicados en cuatro horas por una cuenta recién creada con alias `vpmdhaj`. Todos imitaban nombres de la organización oficial `opensearch-project` (`opensearch-setup`, `opensearch-security-scanner`, `elastic-opensearch-helper`, entre otros) — typosquatting clásico contra developers que buscan herramientas legítimas de OpenSearch o ElasticSearch. Lo nuevo es el objetivo. El `preinstall` descarga el runtime de Bun directamente desde GitHub Releases — un binario firmado y legítimo — y lo usa para ejecutar un harvester de 195 KB. Ese harvester consulta los servicios internos de metadata de AWS — EC2 y ECS, los endpoints desde donde se exponen las credenciales temporales de instancias y contenedores —, enumera secretos de AWS Secrets Manager a lo largo de 16+ regiones, lee tokens de HashiCorp Vault, valida tokens de publicación en npm, y captura el contexto de runners de GitHub Actions. No es robo de credenciales personales: es robo dirigido a infraestructura de CI/CD y nube. Y a diferencia de los demás incidentes de esta lista, Microsoft no atribuyó la campaña a Shai-Hulud ni a TeamPCP — actor nuevo, target nuevo.

### PyPI — el mismo libreto, menos titulares

**Microsoft `durabletask` (mayo de 2026).** Sí: un paquete oficial de Microsoft en el repositorio público de Python. Cerca de 417.000 descargas mensuales. [Dos versiones publicadas con minutos de diferencia](https://www.wiz.io/blog/durabletask-teampcp-supply-chain-attack) incluían un módulo llamado `roulette.py` con dos modos destructivos: uno revisaba la configuración regional del computador y se activaba solo en máquinas con idioma iraní o israelí; el otro, una "ruleta rusa" con una probabilidad de 1 en 6 de borrar el contenido del disco. Es el primer caso documentado de un paquete oficial de Microsoft en el ecosistema Python distribuyendo código destructivo. El cambio importante: el daño ya no se limita a robar credenciales. Ya incluye sabotaje.

**Lazarus Group (2025).** Sonatype [bloqueó 234 paquetes maliciosos](https://thehackernews.com/2026/02/lazarus-campaign-plants-malicious.html) atribuidos al grupo norcoreano Lazarus en la primera mitad de 2025, distribuidos a través de una campaña en LinkedIn en la que un supuesto reclutador pedía a desarrolladores de criptomonedas "ojear este código". No es un actor único, es una operación coordinada por un Estado, sostenida en el tiempo, y cruza ecosistemas (npm y PyPI a la vez).

### Más allá de npm y PyPI

El mismo patrón se ha replicado en los demás ecosistemas (Ruby, Rust, Java, Docker), aunque con menos volumen y menos titulares. El hito que sí vale la pena destacar es de mayo de 2026: [Ruby Central — el equipo que mantiene el repositorio de paquetes de Ruby — suspendió temporalmente el registro de nuevas cuentas](https://thehackernews.com/2026/05/rubygems-suspends-new-signups-after.html) después de que cientos de paquetes maliciosos fueran subidos en una ventana corta. Reabrieron los registros pocos días después, ya con un WAF (un firewall que filtra tráfico web sospechoso) y límites más estrictos sobre la creación de cuentas. Es la primera vez que un repositorio mayor cierra temporalmente su puerta de entrada para frenar un ataque en curso. Algo que hace dos años habría sido impensable.

El patrón es claro en todo lo anterior: el ataque al repositorio y el ataque al sistema automatizado de publicación están convergiendo. Roban credenciales de desarrolladores, aprovechan sus pipelines, y el código malicioso corre tanto en máquinas personales como dentro de los sistemas internos de las empresas — y el botín, irónicamente, son más credenciales para seguir expandiéndose.

---

## Dónde la IA realmente está acelerando esto

Quiero ser cuidadoso acá porque la mitad de lo que se escribe sobre *"IA en ataques de supply chain"* es exagerado y sin fuentes. Lo que sigue está verificado y respaldado por evidencia concreta.

### Slopsquatting

Antes que nada, dos términos. **Typosquatting** es cuando un atacante registra un paquete con un nombre casi idéntico al de uno legítimo (`requets` en vez de `requests`, `loadsh` en vez de `lodash`) esperando que alguien lo instale por error de tipeo. Existe desde siempre.

**Slopsquatting** es lo mismo, pero apoyado en una observación nueva: los modelos de IA se inventan nombres de paquetes que no existen. En un [estudio académico](https://www.usenix.org/system/files/conference/usenixsecurity25/sec25cycle1-prepub-742-spracklen.pdf) sobre 576.000 fragmentos de código generados por 16 modelos distintos, los comerciales se inventaron paquetes inexistentes en alrededor del 5% de las sugerencias; los modelos open source, en un 22%. Esos nombres no son aleatorios — son plausibles, suenan reales, y los modelos tienden a *repetir los mismos nombres inventados* entre conversaciones distintas. Lo que es predecible se puede explotar.

[Seth Larson, de la Python Software Foundation, acuñó el término **slopsquatting**](https://en.wikipedia.org/wiki/Slopsquatting) en abril de 2025 para describir el siguiente paso: un atacante observa qué paquetes alucinan los modelos de IA, registra esos nombres falsos en el repositorio real, y espera. Cuando un desarrollador (o cada vez más, un agente de IA actuando por él) pega la sugerencia y corre el comando de instalación, el malware llega solito a la máquina. Ya en 2023, un investigador de Lasso Security [demostró que funcionaba](https://www.aikido.dev/blog/slopsquatting-ai-package-hallucination-attacks): registró un paquete de Python con un nombre que los modelos no paraban de inventar y le cayeron 30.000+ descargas en tres meses. El README oficial de Alibaba terminó copiando el comando de instalación.

El atacante ya no necesita adivinar qué nombre va a tipear mal alguien. El modelo se lo dice.

### Cuando el ataque va dirigido contra el asistente de IA

El segundo eje es del lado del código malicioso mismo. El compromiso de Bitwarden CLI es uno de los ejemplos más limpios: [el código apuntaba específicamente a las instalaciones de Claude y Cursor](https://www.paloaltonetworks.com/blog/cloud-security/bitwardencli-supply-chain-attack/) e intentaba modificar su configuración para inyectarles instrucciones permanentes. La lógica es obvia: si puedes envenenar el copiloto de IA de un desarrollador, cada línea de código que esa persona escriba durante los próximos meses queda bajo sospecha. El bug no está en lo que escribió el dev; está en lo que el modelo le dictó.

El mismo patrón se repitió con [el secuestro de la extensión Nx Console para VS Code en mayo de 2026](https://thehackernews.com/2026/05/compromised-nx-console-18950-targeted.html) — alrededor de 2,2 millones de instalaciones. El código malicioso buscaba específicamente la carpeta donde Claude Code guarda su configuración y sus claves de acceso a Anthropic. Junto con eso: contraseñas de 1Password, accesos a GitHub, tokens de publicación de npm, credenciales de AWS. La extensión estuvo activa entre 11 y 18 minutos. Como daño colateral del mismo incidente, [GitHub confirmó acceso no autorizado a sus propios repositorios internos](https://thehackernews.com/2026/05/github-internal-repositories-breached.html) durante la misma ventana — los atacantes afirmaron haber extraído alrededor de 4.000.

En abril de 2026, Socket destapó [SANDWORM_MODE](https://socket.dev/blog/sandworm-mode-npm-worm-ai-toolchain-poisoning) — otro gusano de la familia Shai-Hulud que hace algo nuevo. Cada vez que infecta una máquina, usa un modelo de IA corriendo localmente (Ollama, una herramienta que permite ejecutar modelos sin enviar nada a la nube) para *reescribir su propio código* — renombrar variables, cambiar estructura, agregar relleno — antes de propagarse a la siguiente víctima. Cada copia se ve diferente. Las defensas que buscan "este pedazo de código exacto es malo" pierden cuando el código cambia en cada salto. Y el mismo gusano roba las claves de acceso a nueve proveedores de modelos de IA — OpenAI, Anthropic, Google y otros — porque en 2026, una clave de IA en el mercado negro vale tanto como una clave de AWS.

Y en mayo de 2026, Socket destapó la campaña [TrapDoor](https://socket.dev/blog/trapdoor-crypto-stealer-npm-pypi-crates) — más de 380 versiones maliciosas distribuidas simultáneamente en los repositorios de Node.js, Python y Rust. La segunda etapa del ataque hace algo que no había visto antes: deja en el computador archivos llamados `.cursorrules` y `CLAUDE.md` — los archivos donde los desarrolladores guardan las reglas y el contexto que sus asistentes de IA deben usar. Pero esos archivos usan caracteres invisibles del estándar Unicode: el desarrollador los abre y solo ve sus propias reglas, mientras el asistente de IA lee instrucciones hostiles ocultas. La siguiente función que el copiloto genere puede traer un backdoor que el dueño del computador nunca pidió. Es la evolución natural del slopsquatting: si la primera generación contaminaba el nombre del paquete, esta contamina el prompt que tu agente está leyendo.

### Cuando la IA encuentra las vulnerabilidades antes que tú

Todo lo anterior actúa *después* de que la vulnerabilidad existe. El eje que se viene abriendo en paralelo — y el más incómodo — es el del descubrimiento.

En abril de 2026, Anthropic anunció [Claude Mythos Preview](https://red.anthropic.com/2026/mythos-preview/), un modelo que encontró miles de zero-days en los principales sistemas operativos y navegadores. Lo nuevo es la economía: encontrar un bug crítico en OpenBSD costó unos $50, y encadenar descubrimiento, exploit y escalada de privilegios contra un servidor FreeBSD — sin intervención humana — bajó a menos de $2,000. [Anthropic decidió no liberarlo](https://www.anthropic.com/glasswing) y armó una coalición defensiva de $100M para parchar la infraestructura crítica antes de que un equivalente sin contención termine en manos de un atacante. Desarmé el lanzamiento completo en *[Claude Mythos: el modelo demasiado peligroso para ser liberado](/es/blog/claude-mythos-the-model-too-dangerous-to-release/)*.

Lo importante para este post: la defensa de la cadena de suministro descansa sobre una asimetría temporal — los mantenedores tardan meses en encontrar bugs, y los atacantes también. Cuando un atacante con dos mil dólares y una semana puede descubrir un fallo crítico y un exploit funcional dentro de un paquete del que dependen miles de proyectos, "vamos a confiar en que esta versión es segura porque lleva publicada un tiempo" se queda corta. Como [lo enmarcó el CTO de CrowdStrike](https://www.anthropic.com/glasswing): *"The window between vulnerability discovery and exploitation has collapsed — now minutes with AI."* ("La ventana entre el descubrimiento de la vulnerabilidad y su explotación se ha colapsado — ahora, con IA, son minutos.")

Eso no invalida la línea base defensiva que viene a continuación. Lo que hace es marcarle un techo: una demora de siete días te protege de un mantenedor secuestrado durante 90 minutos; no te protege de una vulnerabilidad que un modelo encontró ayer dentro de una versión que llevas tres meses corriendo en producción. Son dos clases distintas de ataque. Este post cubre la primera; la segunda probablemente merezca su propio recuento cuando aparezca en estado salvaje.

---

## La línea base defensiva

A partir de aquí el post se vuelve más técnico — entra en configuración específica de herramientas. Si no eres desarrollador, la idea importante para llevarte es que **estos ataques son prevenibles** con cambios pequeños y bien documentados. Si tienes equipo técnico, pásales este link.

Para los developers que sigan leyendo: la mayoría de los arreglos del lado del repositorio — autenticación segura, doble factor obligatorio, firmas criptográficas en cada paquete publicado — pasan del lado de quien publica, y no afectan lo que termina en tu `node_modules` el próximo martes. La línea base del lado del install nos toca a nosotros. Nada de lo que sigue es heroico, y casi todo son cambios de una línea. Lo difícil es hacerlos todos, no solo uno. Acabo de aterrizar este stack en este mismo sitio en el [PR #131](https://github.com/xergioalex/xergioalex.com/pull/131); los snippets de abajo están tomados de ese diff tal cual.

<figure class="fig-narrow fig-narrow-60">
<img src="/images/blog/posts/supply-chain-attacks-ai-era/diagram-defense-layers-es.webp" alt="Diagrama vertical de cinco capas que muestra cómo la línea base defensiva del post filtra un paquete recién publicado antes de que llegue a node_modules. De arriba a abajo: (0) Corepack pin uniformiza la versión de pnpm en todas las máquinas, (1) minimumReleaseAge de 7 días rechaza versiones recién publicadas, (2) --frozen-lockfile enforce concordancia entre package.json y el lockfile, (3) allowBuilds bloquea postinstall no autorizados por defecto, (4) el redirect de npm a pnpm en el dev container captura los comandos por memoria muscular. Lo que atraviesa las cinco capas llega a node_modules." width="1086" height="1448" loading="lazy" />
<figcaption>La línea base defensiva como filtro en capas. Cada capa corresponde a una subsección abajo; cada una bloquea un punto distinto de la cadena de ataque del Diagrama 1.</figcaption>
</figure>

### Por qué pnpm, no npm

Antes que cualquier configuración: la herramienta misma importa. En npm por defecto, cada dependencia puede ejecutar código arbitrario en tu máquina apenas terminas de tipear `npm install` — a través de los hooks `preinstall`, `install` y `postinstall` que cualquier paquete puede declarar en su `package.json`. Todos los incidentes de la sección anterior — Shai-Hulud, axios, Bitwarden CLI, TanStack — dependieron exactamente de esa ejecución automática para hacer su trabajo. Un solo `npm install` durante la ventana de cualquiera de esos ataques era suficiente para quedar infectado.

Desde [pnpm 10](https://github.com/orgs/pnpm/discussions/8945), esos scripts están bloqueados por defecto. pnpm asume que ninguna dependencia tiene derecho a correr código en tu máquina, y tú declaras explícitamente cuáles sí — esa es la subsección de `allowBuilds` más abajo. A eso le suma `minimumReleaseAge` (también más abajo), que rechaza versiones recién publicadas. Y desde pnpm 11, ese cooldown viene encendido por defecto.

npm tiene piezas que cubren el mismo terreno, pero todas son opt-in y más toscas. `ignore-scripts=true` en `.npmrc` apaga los lifecycle scripts en bloque — sin allow-list nativa por paquete; para eso hace falta un plugin tercero como [`@lavamoat/allow-scripts`](https://github.com/LavaMoat/LavaMoat). Y `min-release-age` [aterrizó en npm CLI 11.10](https://socket.dev/blog/npm-introduces-minimumreleaseage-and-bulk-oidc-configuration), pero apagado por defecto y sin exclusiones por paquete.

La diferencia es de ergonomía y defaults, no de capacidades absolutas. Por eso este sitio se movió de npm a pnpm: no por preferencia personal, por modelo de amenaza. El resto de subsecciones asume que ya estás en pnpm. Si vienes de npm, este es el cambio individual con mayor reducción de superficie de ataque por la inversión más pequeña.

### Pinear el package manager vía Corepack

```json
{
  "packageManager": "pnpm@11.1.2"
}
```

[Corepack](https://nodejs.org/api/corepack.html) es el shim manager que viene con Node. Lee `"packageManager"` desde `package.json` y provisiona exactamente esa versión. Cada máquina — laptop, runner de CI, imagen de Docker — recibe el mismo pnpm. Nada de `npm install -g pnpm` en ninguna parte, porque instalar globalmente la herramienta que intentas pinear le quita el sentido al pin.

### Forzar una demora entre publicación e instalación

Esta fue la que arrancó toda la migración. [pnpm 10.16](https://pnpm.io/blog/releases/10.16) (lanzado en septiembre de 2025) agregó una configuración llamada `minimumReleaseAge`:

```yaml
# pnpm-workspace.yaml
minimumReleaseAge: 10080  # 7 días, en minutos
```

Rechaza instalar versiones de paquetes más jóvenes que la edad especificada. La mayoría de los paquetes comprometidos arriba estuvieron vivos menos de dos horas antes de ser retirados. Una demora de siete días significa que *la única forma de que yo instale una versión comprometida es que sobreviva siete días sin que nadie la note*. Es una barra mucho más alta que cero días. Desde [pnpm 11](https://pnpm.io/blog/releases/11.0), el default ya es de 24 horas; yo lo subí a una semana porque no estoy en un producto sensible a hotfixes.

Hay una válvula de escape — `minimumReleaseAgeExclude` te deja saltarte la demora para paquetes donde sí quieres hotfixes (los paquetes de tu propia organización, por ejemplo). Yo no tengo exclusiones por ahora. npm en sí no tiene una funcionalidad equivalente hoy.

### Allow-list de scripts de build

Desde pnpm 10, los scripts `postinstall` están bloqueados por defecto. Tú declaras explícitamente los paquetes que sí los necesitan legítimamente:

```yaml
# pnpm-workspace.yaml
allowBuilds:
  esbuild: true
  sharp: true
  "@biomejs/biome": true
  "@parcel/watcher": true
  unrs-resolver: true
```

Esa es la allow-list corta que este sitio necesita. Cinco entradas, todas conocidas y auditadas. Todo lo demás — y *"todo lo demás"* incluye cualquier paquete recién comprometido que traiga un `postinstall` malicioso — queda silenciosamente denegado. Shai-Hulud, axios, Bitwarden CLI y TanStack todos dependieron de ejecución vía `postinstall` o `preinstall`. Solo esta configuración neutraliza a la mayoría de ellos.

### Reemplazar `npm` dentro del dev container

Esta es con la que más paranoico estoy. Los asistentes de IA y los scripts viejos van a correr `npm install` por memoria muscular sin importar lo que diga `package.json`. Así que dentro de mi dev container el binario `npm` ya no es npm:

```dockerfile
RUN rm -f /usr/local/bin/npm && \
    printf '#!/bin/bash\necho "[npm→pnpm] Redirecting \"npm $*\" to pnpm." >&2\nexec corepack pnpm "$@"\n' \
    > /usr/local/bin/npm && \
    chmod +x /usr/local/bin/npm
```

Si cualquier cosa dentro del contenedor corre `npm install`, imprime una advertencia de redirección y enruta por pnpm — lo que significa que pasa por el filtro de `minimumReleaseAge`, por el lockfile, y por las reglas de `allowBuilds`. No me confío de mí mismo, de mis asistentes de IA, ni de ningún tutorial que vaya a pegar en esta terminal — ninguno se va a acordar siempre de tipear `pnpm`.

### Hacer que el CI sea hostil a los atajos legacy de npm

En GitHub Actions, el workflow viejo usaba `npm install` más un install con `--no-save` de binarios nativos específicos de plataforma para esquivar la resolución de optional-deps rota de npm. Ese paso `--no-save` se saltaba el lockfile por completo — exactamente el tipo de *"ya lo arreglamos en CI"* que deja que binarios nativos comprometidos lleguen a producción sin aparecer en code review. El workflow nuevo es una línea:

```yaml
- run: corepack pnpm install --frozen-lockfile
```

`--frozen-lockfile` falla el build si `package.json` y `pnpm-lock.yaml` no concuerdan. La caché del CI usa como clave la ruta del store de pnpm (`corepack pnpm store path`) y `pnpm-lock.yaml`, no `node_modules`.

### Desacoplar el bump de versión de los efectos colaterales de git

`npm version patch -m "..."` acopla tres cosas — bump, commit, tag — y las corre en un orden que no se lleva bien con proyectos en workspace ni con scripts de release en CI. El reemplazo las separa:

```bash
corepack pnpm version patch --no-git-tag-version
git add package.json pnpm-lock.yaml
git commit -m "release v${VERSION}"
git tag -a "v${VERSION}" -m "v${VERSION}"
```

Cosita pequeña, pero los commits implícitos de `npm version` eran el tipo de magia de fondo que hace difícil depurar un script de release después de una falla parcial. Mejor hacer cada paso explícito.

### Si trabajas en otros ecosistemas

Casi todo lo anterior está escrito en torno a Node.js, donde más se han concentrado los ataques activos del último año. El modelo de amenaza es muy parecido en pip, RubyGems, Cargo y Go — y cada uno tiene su propia colección de gachas.

**Python (pip).** El equivalente al postinstall malicioso de npm es la **distribución de código fuente** (sdist). Cuando un paquete se publica como sdist en vez de wheel binario precompilado, pip lo construye localmente — y "construirlo" significa ejecutar `setup.py`, que puede hacer cualquier cosa que el atacante quiera. El paquete `roulette.py` que distribuyó Microsoft `durabletask` arriba llegó por esta vía. La defensa más directa es esta:

```bash
pip install --only-binary=:all: --require-hashes -r requirements.lock
```

`--only-binary=:all:` rechaza cualquier paquete que tenga que ejecutarse para construirse; `--require-hashes` falla el install si algún paquete no concuerda con el hash del lockfile. Genera ese lockfile con [pip-tools](https://pip-tools.readthedocs.io/) o, mejor para proyectos nuevos, con [uv](https://docs.astral.sh/uv/) — más rápido, mejor resolución, y trae lockfile + hashes nativos.

**Ruby (Bundler).** Las gemas con extensiones nativas ejecutan `extconf.rb` en el momento del install — mismo patrón que postinstall. `bundle install --frozen` (o `--deployment` en CI) falla si `Gemfile.lock` y `Gemfile` no concuerdan. Y como Ruby Central [agregó un WAF y endureció el registro tras el evento de mayo](https://thehackernews.com/2026/05/rubygems-suspends-new-signups-after.html), el lado de la oferta también subió la barrera.

**Rust (Cargo).** `build.rs` puede ejecutar código arbitrario en `cargo build` — equivalente directo del postinstall. `Cargo.lock` pinea versiones por defecto, y `cargo build --frozen --offline` en CI fuerza que no se descargue nada nuevo durante el build. [`cargo-audit`](https://github.com/rustsec/rustsec) (paquete separado) reporta CVEs conocidas contra el lockfile.

**Go (modules).** El mejor caso del grupo: los módulos no tienen scripts de install que corran al `go get`. Las dependencias solo ejecutan código si las llamas explícitamente. Sumado a eso, `go.sum` enforce hashes criptográficos por defecto, y la [base de datos de transparencia (GOSUMDB)](https://sum.golang.org/) detecta reescrituras silenciosas en el registro. No es inmune — un `init()` en una dependencia importada todavía corre cuando ejecutas el binario — pero el momento del install es seguro por diseño.

**Lo que ninguno tiene resuelto**, igual que pip: el equivalente a `minimumReleaseAge`. Hoy no existe un flag estándar en ningún registro mayor que rechace versiones recién publicadas. Es la diferencia más sensible frente al lado de pnpm. Mientras tanto, del lado del publicador, [Trusted Publishing en PyPI](https://docs.pypi.org/trusted-publishers/) y las firmas de Sigstore (en RubyGems y crates.io) están en GA, y deberían ser el camino por defecto para cualquier paquete que publiques.

---

## Lo que esta línea base *no* arregla

Algunas brechas que vale la pena nombrar, en términos claros:

- **Attestations de Sigstore en mis propias publicaciones.** [Sigstore](https://www.sigstore.dev/) es un servicio gratuito (mantenido por la Linux Foundation) que firma artefactos de software usando identidades OIDC de corta vida y deja constancia de cada firma en un log público auditable. Una *attestation* o "provenance" es la declaración firmada que dice "este paquete salió de tal commit, construido por tal workflow" — cualquiera que lo descargue puede verificar criptográficamente que llegó de donde dice. Este sitio no publica a npm, así que no aplica. Pero para cualquier paquete que sí publique, [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers/) más [provenance attestations](https://docs.npmjs.com/generating-provenance-statements/) es la respuesta — sin llaves, respaldado por OIDC, consultable. El maintainer de axios tenía Trusted Publishing configurado al lado de un token legacy de larga duración; el token legacy fue lo que se comprometió. Migra completo o no migres.
- **Generación de SBOM en CI.** Un *Software Bill of Materials* es la lista completa, legible por máquina, de cada componente que termina en tu binario o paquete final: dependencias directas, transitivas, versiones exactas, hashes, licencias. Los formatos estándar son [SPDX](https://spdx.dev/) y [CycloneDX](https://cyclonedx.org/). El punto: cuando aparece un CVE en una dependencia profunda, en lugar de adivinar si te afecta, le preguntas al SBOM. No lo he conectado. Para un sitio personal es marginal; para cualquier cosa que envíes a otras personas no.
- **[OpenSSF Scorecard](https://scorecard.dev/) en CI.** Es una herramienta automatizada (de la Open Source Security Foundation) que evalúa un repositorio contra una lista de buenas prácticas — si tiene 2FA obligatorio en cuentas de maintainer, branch protection, firmas en releases, herramientas automáticas de actualización de dependencias, entre otras — y devuelve un puntaje de 0 a 10. Sirve para dos cosas: medir la higiene de seguridad de tu propio proyecto, y evaluar la de una dependencia que estés considerando antes de meterla. Útil para librerías, marginal para un repo de sitio estático.
- **Pinear cada GitHub Action a un SHA, no a un tag.** Todavía estoy usando `actions/checkout@v4` en lugar de `actions/checkout@<sha>`. Un tag como `@v4` es solo una etiqueta que apunta a un commit, y el owner de la action (o un atacante que comprometa su cuenta) puede moverla a otro commit en cualquier momento. Eso es exactamente lo que pasó con [tj-actions/changed-files (CVE-2025-30066)](https://www.wiz.io/blog/github-action-tj-actions-changed-files-supply-chain-attack-cve-2025-30066) — un atacante reescribió varios tags para que apuntaran a un commit malicioso, y todos los workflows que usaban `@v35` o `@v36` empezaron a correr código nuevo en su próximo run. Pinear directamente al hash inmutable del commit lo previene. Lo voy a hacer en el siguiente paso.

También quiero marcar lo que *no* va a ayudar. Auditar tu `node_modules` después del install no es defensa — para ese momento, el postinstall ya corrió. Correr `npm audit` no es defensa contra esta clase de ataque — reporta CVEs conocidos en versiones publicadas, no *"esta versión salió hace 14 minutos y todavía no sabemos."* La defensa está en el momento del install, no después del install.

---

## Lo que puedes hacer ahora mismo

Si solo tienes una tarde, los movimientos de mayor palanca son:

1. Si estás en npm, considera migrar a pnpm y pinea la versión vía Corepack (`"packageManager"` en `package.json`). pnpm bloquea install scripts con allow-list por paquete y el cooldown viene encendido desde v11 — los equivalentes en npm (`ignore-scripts`, `min-release-age` desde 11.10) existen pero son opt-in y menos granulares.
2. Si estás en pnpm 10.16 o más reciente, agrega `minimumReleaseAge` a `pnpm-workspace.yaml`. Incluso 24 horas es dramáticamente mejor que cero.
3. Si tu stack es Python, fuerza `pip install --only-binary=:all: --require-hashes` contra un lockfile compilado con [uv](https://docs.astral.sh/uv/) o [pip-tools](https://pip-tools.readthedocs.io/). Bloquea la ejecución de sdist en el momento del install.
4. Audita tus pipelines automatizados. Cualquier paso que ejecute código que venga desde un fork antes del review humano es un riesgo — esa clase de configuración fue la base del incidente de TanStack. Si tienes uno, quítalo o limita sus permisos a solo-lectura.
5. Migra cualquier paquete que publiques desde tokens de registro de larga duración a Trusted Publishing con OIDC — en [npm](https://docs.npmjs.com/trusted-publishers/), [PyPI](https://blog.pypi.org/posts/2024-11-14-pypi-now-supports-digital-attestations/) o [RubyGems](https://rubycentral.org/news/ruby-centrals-oss-changelog-march-2025/). Todos lo soportan ya.
6. Pinea las GitHub Actions de terceros a un SHA de commit, no a un tag. Sí, es más feo. La versión más fea no te la re-apuntan por debajo.

Nada de esto te protege de un adversario determinado que te conoce a ti específicamente. Lo que sí hacen es subir lo suficiente el costo de que un gusano oportunista te encuentre a *ti en particular* como para que se vaya por otro desarrollador. Eso es todo lo que estás buscando. La seguridad en open source consiste, casi siempre, en volverte un blanco menos cómodo que la mediana.

El ecosistema no va a arreglar esto por nosotros. Los registros están haciendo trabajo real — el 2FA en PyPI es obligatorio, la provenance de npm está en GA, RubyGems y crates.io están sobre Sigstore — pero la responsabilidad del lado del install la cargamos los que construimos software. O sea, nosotros.

Llevamos años construyendo software sobre una capa de confianza que casi nunca verbalizamos: confianza en mantenedores que no conocemos, en registros que no controlamos, en herramientas que se actualizan solas. Ese contrato siempre fue frágil. Lo que cambió este año es que ahora lo sabemos. Y aun así, no se trata de detenerse — la comunidad de software ya pasó por giros parecidos. De descargar tarballs por FTP a Git con hashes verificables. De credenciales permanentes a OIDC efímero. De servidores frágiles a infraestructura inmutable. Cada vez que la superficie de ataque se expandió, los defaults se endurecieron, las herramientas se afinaron, los postmortems se compartieron. Esta ronda es la siguiente iteración del mismo patrón. Y la misma capacidad de razonamiento que hoy le permite a un modelo encontrar un bug de 28 años en OpenBSD es la que nos está haciendo más productivos de lo que jamás fuimos. No es una contradicción — es el trato. Poder que compone en las dos direcciones.

A seguir construyendo. Con cuidado.

---

## Recursos

- [Notas de release de pnpm 10.16 — `minimumReleaseAge`](https://pnpm.io/blog/releases/10.16)
- [Documentación de Corepack (Node.js)](https://nodejs.org/api/corepack.html)
- [uv (Astral)](https://docs.astral.sh/uv/) — gestor de paquetes y proyectos para Python, con lockfile + hashes nativos
- [pip-tools](https://pip-tools.readthedocs.io/) — compilación de requirements + sync para proyectos pip existentes
- [npm Trusted Publishers](https://docs.npmjs.com/trusted-publishers/) y [docs de provenance](https://docs.npmjs.com/generating-provenance-statements/)
- [Digital attestations en PyPI](https://blog.pypi.org/posts/2024-11-14-pypi-now-supports-digital-attestations/)
- [OpenSSF Scorecard](https://scorecard.dev/)
- [Sonatype State of the Software Supply Chain 2026](https://www.sonatype.com/state-of-the-software-supply-chain/introduction)
- [Spracklen et al., *"We Have a Package for You!"* — alucinación de paquetes en LLMs (USENIX Security 2025)](https://www.usenix.org/system/files/conference/usenixsecurity25/sec25cycle1-prepub-742-spracklen.pdf)
- [Postmortem de TanStack](https://tanstack.com/blog/npm-supply-chain-compromise-postmortem)
- [Postmortem de OpenAI sobre el incidente de TanStack](https://openai.com/index/our-response-to-the-tanstack-npm-supply-chain-attack/)
- [Análisis del compromiso de axios — Socket](https://socket.dev/blog/axios-npm-package-compromised)
- [Análisis de Shai-Hulud — StepSecurity](https://www.stepsecurity.io/blog/ctrl-tinycolor-and-40-npm-packages-compromised)
- [Análisis del incidente AntV — Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2026/05/20/mini-shai-hulud-compromised-antv-npm-packages-enable-ci-cd-credential-theft/)
- [Typosquatting vpmdhaj contra OpenSearch — Microsoft Security Blog](https://www.microsoft.com/en-us/security/blog/2026/05/28/typosquatted-npm-packages-used-steal-cloud-ci-cd-secrets/)
- [Perfil del actor TeamPCP (UNC6780) — Wiz](https://threats.wiz.io/all-actors/teampcp)
- [Campaña TrapDoor (envenenamiento de `.cursorrules` / `CLAUDE.md`) — Socket](https://socket.dev/blog/trapdoor-crypto-stealer-npm-pypi-crates)
- [Análisis de tj-actions/changed-files (CVE-2025-30066) — Wiz](https://www.wiz.io/blog/github-action-tj-actions-changed-files-supply-chain-attack-cve-2025-30066)
