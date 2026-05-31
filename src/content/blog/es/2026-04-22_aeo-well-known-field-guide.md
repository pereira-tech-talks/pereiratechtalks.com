---
title: "La Explosión de .well-known: Guía de Campo a los Nuevos Estándares para Agentes"
description: "Guía práctica a la familia .well-known: Link headers RFC 8288, API Catalog 9727, Recurso Protegido 9728, MCP Server Card y WebMCP."
pubDate: "2026-04-22T16:00:00"
heroImage: "/images/blog/posts/aeo-well-known-field-guide/hero.webp"
heroLayout: "side-by-side"
tags: ["tech", "web-development", "ai-agents", "cloudflare", "mcp"]
keywords: ["well-known endpoints", "estándares de agentes 2026", "RFC 8288 Link headers", "RFC 9727 API Catalog", "RFC 9728 OAuth Protected Resource Metadata", "MCP Server Card SEP-1649", "Agent Skills Discovery RFC", "WebMCP browser API"]
series: "aeo-from-invisible-to-cited"
seriesOrder: 6
draft: true
---

Si ya enviaste estos endpoints `.well-known/` en tu sitio, construiste la mayoría de lo que este post explica. No necesitas esta referencia para hacer que tu sitio esté listo para agentes. Pero la vas a querer la próxima vez que un spec cambie — o la próxima vez que te pregunten para qué sirve todo esto en realidad.

Lo que sigue es una guía de campo a la familia `.well-known/` y sus vecinos, en el orden en que los adoptarías en un sitio nuevo. Del más barato al más caro. Cada sección es autocontenida: *qué es / por qué existe / ejemplo mínimo válido / trampas comunes / dónde aprender más.* Salta entre ellas.

## 1. Content Signals en robots.txt

### Qué es

Una directiva de una sola línea que se agrega a `robots.txt` y declara tus preferencias para tres categorías de uso de contenido por IA: entrenamiento, indexación en buscadores, y uso como input para la respuesta de un LLM.

### Por qué existe

`robots.txt` tradicionalmente le decía a los crawlers si podían *traer* el contenido. Content Signals lo extiende a qué pueden *hacer* con lo que traen. Formaliza la diferencia entre "indéxame por favor" y "por favor no me entrenes" — una distinción que `noindex` y allow/disallow no pueden expresar.

### Ejemplo mínimo válido

```text
User-agent: *
Content-Signal: ai-train=no, search=yes, ai-input=yes
```

Las tres señales (`ai-train`, `search`, `ai-input`) deben aparecer. Los valores son `yes` o `no`.

### Trampas comunes

- Poner `Content-Signal:` fuera de un bloque `User-agent:` — invisible para los crawlers.
- Omitir una de las tres señales.
- El separador coma debe tener espacio: `ai-train=no, search=yes`, no `ai-train=no,search=yes`.

### Dónde aprender más

- [contentsignals.org](https://contentsignals.org/)
- Draft IETF `draft-romm-aipref-contentsignals`

## 2. Link headers de respuesta (RFC 8288)

### Qué es

Headers HTTP `Link:` en respuestas HTML que apuntan a documentos compañeros legibles por máquina. Piénsalos como las tags `<link rel>` de HTML promovidas al header de respuesta, para que los clientes que nunca parsean el HTML puedan encontrar los metadatos del sitio.

### Por qué existe

Los agentes no siempre renderizan la página — a veces hacen `HEAD /` y toman decisiones desde los headers de respuesta solamente. Los Link headers les permiten descubrir tu API catalog, la MCP server card o el índice de skills sin traer el HTML.

### Ejemplo mínimo válido

```text
Link: </.well-known/api-catalog>; rel="api-catalog"
```

Valores de `rel` aceptados por el tablero de Agent Readiness: `api-catalog`, `service-desc`, `service-doc`, `describedby`. Un header es suficiente. Varios están bien.

### Trampas comunes

- Faltan los brackets angulares alrededor de la URL.
- Falta el punto y coma antes de `rel=`.
- Apuntar `rel` a una URL que devuelve 404.
- Solo emitir en `/` y no en subrutas por idioma como `/es/`.

### Dónde aprender más

- [RFC 8288](https://www.rfc-editor.org/rfc/rfc8288) (Web Linking)
- [RFC 9727 §3](https://www.rfc-editor.org/rfc/rfc9727#section-3) (registro del rel `api-catalog`)
- [Registro de Link Relations de IANA](https://www.iana.org/assignments/link-relations/)

## 3. API Catalog (RFC 9727 + Linkset RFC 9264)

### Qué es

Un documento JSON en `/.well-known/api-catalog` que lista tus APIs públicas, cada una con enlaces a descripción legible por máquina (OpenAPI) y documentación humana.

### Por qué existe

Un solo puntero a tu spec OpenAPI no es suficiente — los sitios más grandes tienen varias APIs, cada una con docs distintas. El catálogo usa el formato *linkset* (RFC 9264) para que las herramientas puedan consumir una lista de descripciones de APIs de manera uniforme.

### Ejemplo mínimo válido

```json
{
  "linkset": [
    {
      "anchor": "https://api.example.com/users",
      "links": [
        { "rel": "service-desc", "href": "https://api.example.com/openapi.json" },
        { "rel": "service-doc", "href": "https://api.example.com/docs" }
      ]
    }
  ]
}
```

### Trampas comunes

- **Content-Type equivocado.** Debe ser `application/linkset+json`, *no* `application/json`. Esta falla silenciosa en el tablero.
- Array `linkset` vacío.
- Omitir `service-desc` o `service-doc`.
- Enlazar a un spec OpenAPI que en realidad no has escrito.

### Dónde aprender más

- [RFC 9727](https://www.rfc-editor.org/rfc/rfc9727) (The Linkset API Catalog)
- [RFC 9264](https://www.rfc-editor.org/rfc/rfc9264) (Linksets)
- El Apéndice A del RFC 9727 tiene ejemplos completos trabajados.

## 4. OAuth Authorization Server Metadata (RFC 8414) / OIDC Discovery 1.0

### Qué es

Publicar la configuración de tu servidor de autorización OAuth 2.0 (o provider OpenID Connect) en una ruta well-known para que los clientes puedan descubrir los endpoints programáticamente.

### Por qué existe

Los agentes no pueden estar codificados a mano para saber dónde vive tu endpoint de autorización. RFC 8414 y OIDC Discovery 1.0 les permiten traer un solo JSON y saber exactamente cómo iniciar un flujo de auth.

### Ejemplo mínimo válido

```json
{
  "issuer": "https://your-domain.com",
  "authorization_endpoint": "https://your-domain.com/authorize",
  "token_endpoint": "https://your-domain.com/token",
  "jwks_uri": "https://your-domain.com/.well-known/jwks.json",
  "grant_types_supported": ["authorization_code"],
  "response_types_supported": ["code"]
}
```

Seis campos requeridos. Servido en `/.well-known/openid-configuration` (OIDC) o `/.well-known/oauth-authorization-server` (OAuth 2.0). Las dos rutas son equivalentes convencionalmente para los propósitos del tablero.

### Trampas comunes

- Publicar endpoints que no existen (incluso los stubs deben documentarse como tales — un campo `_comment` cumple con el spec).
- Faltar uno de los seis campos requeridos.
- Servir con el Content-Type equivocado (debe ser `application/json`).
- En un sitio de contenido estático sin OAuth real, la forma honesta sigue siendo seis URLs que parezcan válidas más un `_comment` explicando la situación. Fabricar endpoints funcionales es peor que documentar rutas reservadas.

### Dónde aprender más

- [RFC 8414](https://www.rfc-editor.org/rfc/rfc8414) (OAuth 2.0 Authorization Server Metadata)
- [OpenID Connect Discovery 1.0](http://openid.net/specs/openid-connect-discovery-1_0.html)
- Implementación de referencia en un producto: [Managed OAuth for Access](https://blog.cloudflare.com/managed-oauth-for-access/) de Cloudflare (un stack RFC 7591 + 7636 + 9728 de un-solo-click).

## 5. OAuth Protected Resource Metadata (RFC 9728)

### Qué es

Un documento compañero del metadata del servidor de autorización, declarando qué *recursos* están protegidos y qué servidores de autorización emiten tokens para ellos.

### Por qué existe

El metadata del servidor de autorización responde "¿dónde consigo un token?". El metadata de recurso protegido responde "¿qué puedo hacer con uno aquí?". Los agentes que descubren ambos pueden planear un flujo de auth de extremo a extremo.

### Ejemplo mínimo válido

```json
{
  "resource": "https://your-domain.com",
  "authorization_servers": ["https://your-oauth-provider.com"]
}
```

Dos campos requeridos. Opcionalmente agrega `scopes_supported`, `bearer_methods_supported`, y un header `WWW-Authenticate: resource_metadata` en respuestas 401.

### Trampas comunes

- Listar servidores de autorización que no son alcanzables o no existen.
- En un sitio de contenido sin recursos protegidos, una autoreferencia (`resource = authorization_servers[0] = tu sitio`) es una tautología honesta válida.
- Ruta well-known equivocada (debe ser exactamente `/.well-known/oauth-protected-resource`, sin necesidad de extensión `.json`).

### Dónde aprender más

- [RFC 9728](https://www.rfc-editor.org/rfc/rfc9728) (OAuth 2.0 Protected Resource Metadata)
- Acompañado del post de Managed OAuth for Access citado arriba.

## 6. MCP Server Card (SEP-1649 / SEP-2127)

### Qué es

Un documento JSON en `/.well-known/mcp/server-card.json` que declara tu sitio como una superficie de agente compatible con MCP — diciéndoles a los agentes qué tipo de capacidades soportas y dónde conectar.

### Por qué existe

MCP (Model Context Protocol) se está volviendo rápidamente el lenguaje compartido para que los agentes hablen con herramientas externas. La server card hace que los sitios compatibles con MCP sean descubribles en una ruta conocida, sin configurar a mano cada agente.

### Ejemplo mínimo válido

```json
{
  "serverInfo": {
    "name": "example-server",
    "version": "1.0.0"
  },
  "transport": {
    "endpoint": "/mcp"
  },
  "capabilities": ["tools", "resources"]
}
```

`capabilities` es un array de strings — valores de `tools`, `resources`, `prompts`. Es la lista de categorías, no las definiciones por herramienta.

### Trampas comunes

- Ruta anidada equivocada — debe ser `/.well-known/mcp/server-card.json`, no `/.well-known/mcp.json` (aunque algunos tableros también buscan esta última).
- Array `capabilities` vacío.
- Pensar en `capabilities` como un objeto; el spec quiere un array plano de strings.
- Declarar capacidades que tu sitio en realidad no sirve por MCP.

### Dónde aprender más

- [Model Context Protocol — spec principal](https://modelcontextprotocol.io/)
- [SEP-1649 / PR #2127](https://github.com/modelcontextprotocol/modelcontextprotocol) (propuesta de server card)
- [Arquitectura de referencia Enterprise MCP](https://blog.cloudflare.com/enterprise-mcp/) de Cloudflare muestra cómo las organizaciones cosen varios servidores MCP.

## 7. Agent Skills Discovery (Cloudflare RFC v0.2.0)

### Qué es

Un índice JSON en `/.well-known/agent-skills/index.json` que lista skills ejecutables o legibles por máquina que tu sitio ofrece, cada una apuntando a un SKILL.md (o archivo comprimido) con un digest SHA-256 de los bytes servidos.

### Por qué existe

Las skills son una capa sobre las herramientas. Una *herramienta* es algo que un agente puede llamar. Una *skill* es un procedimiento componible y documentable que el agente puede leer, cachear y seguir. El índice les permite a los agentes descubrir skills en una ruta well-known y verificar su integridad vía digest.

### Ejemplo mínimo válido

```json
{
  "$schema": "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
  "skills": []
}
```

`$schema` es un **identificador opaco** — es la declaración de versión, no una URL resolvible. Un `skills[]` vacío es válido; uno poblado se ve así:

```json
{
  "name": "git-workflow",
  "type": "skill-md",
  "description": "Un workflow de Git reusable para el sitio.",
  "url": "https://example.com/.well-known/agent-skills/git-workflow/SKILL.md",
  "digest": "sha256:abc123..."
}
```

Cada SKILL.md es frontmatter YAML (`name`, `description`) más prosa Markdown.

### Trampas comunes

- Falta el campo `$schema`.
- `name` de skill con mayúsculas o espacios (debe ser minúscula, alfanumérico, guiones, 1–64 chars).
- `digest` sin el prefijo `sha256:`, o calculado sobre bytes locales en vez de los bytes realmente servidos en el `url`. Los dos difieren si tu servidor recomprime o normaliza el contenido.
- Confundir `type: "skill-md"` con `type: "archive"` — los archivos son `.tar.gz` para skills multi-archivo complejas; SKILL.md es para skills de un solo archivo.

### Dónde aprender más

- [Cloudflare Agent Skills Discovery RFC](https://github.com/cloudflare/agent-skills-discovery-rfc) (Apache 2.0)
- [agentskills.io](https://agentskills.io/)

## 8. WebMCP (navegador)

### Qué es

Una API de navegador — `navigator.modelContext.registerTool()` — que le permite a una página web publicar herramientas que un agente corriendo *dentro del navegador mismo* puede llamar. Piénsalo como MCP sobre el contexto de una página en vez de sobre un servidor.

### Por qué existe

Cuando el agente está corriendo dentro del navegador del usuario (una extensión de Chrome, un asistente integrado, una pestaña consciente de WebMCP), tiene acceso completo a la sesión del usuario con tu sitio — cookies, estado OAuth, todo. WebMCP le da a la página una forma de decir "estas son las acciones que expongo", sin exponer esas acciones como APIs públicas.

### Ejemplo mínimo válido

```js
navigator.modelContext.registerTool({
  name: 'search',
  description: 'Search site content',
  inputSchema: {
    type: 'object',
    properties: { q: { type: 'string' } },
    required: ['q'],
  },
  execute: async ({ q }) => { /* ... */ },
}, { signal: abortController.signal });
```

Cuatro propiedades requeridas por herramienta: `name`, `description`, `inputSchema` (JSON Schema válido), `execute` (callback async). Pasa una señal de `AbortController` para que el registro se pueda revocar al desmontar.

### Trampas comunes

- Registrar herramientas en un script diferido que corre después del snapshot del tablero. Usa una directiva de hidratación idle/load que corra a tiempo.
- Falta la señal de `AbortController` — la herramienta queda colgada cuando el componente debió desmontarse.
- Exponer operaciones de escritura (DELETE, POST que muta) sin consentimiento del usuario. Mantén la superficie de herramientas de solo lectura por defecto.
- `inputSchema` que no es JSON Schema válido.

### Dónde aprender más

- [Spec WebMCP](https://webmachinelearning.github.io/webmcp/)
- [Explicación de WebMCP por Chrome](https://developer.chrome.com/blog/webmcp-epp)

## 9. Bonus: HTTP Message Signatures Directory / Web Bot Auth

### Qué es

Un documento `/.well-known/http-message-signatures-directory` que identifica las llaves públicas criptográficas que los agentes usan para firmar sus requests HTTP. Le permite a los sitios verificar "esta request viene realmente del agente de IA que dice ser".

### Por qué existe

La identificación de bots hoy se basa en IP y User-Agent — ambos suplantables. Web Bot Auth propone HTTP Message Signatures para que los agentes puedan *probar* su identidad. El directorio en la ruta well-known es cómo los sitios publican sus firmantes confiables.

### Notas

No es uno de los ocho items que chequea el tablero actual de isitagentready.com (a abril 2026), pero está en el roadmap de la herramienta. El post de Cloudflare ["The age of agents" (Ago 2025)](https://blog.cloudflare.com/signed-agents/) — la era de los agentes — es el origen. Vale la pena implementarlo en la próxima iteración, no requerido hoy.

## Qué implementaría si lo hiciera de nuevo

El orden de arriba es el orden en que lo enviarías en un sitio nuevo:

1. **Tarde uno:** Content Signals en robots.txt + Link headers. Dos archivos, dos líneas cada uno. Te pones en 67 → 100 en los ejes de Descubribilidad + Control de Acceso de Bots.
2. **Fin de semana uno:** Los seis archivos JSON `.well-known/*`. La mayoría están por debajo de 1 KB. El spec OpenAPI toma más tiempo — presupuesta medio día para él.
3. **Fin de semana dos (opcional):** Componente WebMCP bridge. Depende de la superficie de herramientas de tu sitio; mantenlo de solo lectura la primera vez.

No necesitas leer cada RFC de principio a fin. Necesitas leer cada SKILL.md en `isitagentready.com/.well-known/agent-skills/<skill>/SKILL.md` — esos son los ejemplos vinculantes. Copia sus payloads JSON en tus archivos y ajusta las URLs. Los RFCs explican *por qué* existe cada campo; el SKILL.md te dice *qué* poner ahí.

Sigo construyendo.

## Recursos

- [RFC 8288 — Link headers](https://www.rfc-editor.org/rfc/rfc8288)
- [RFC 9264 — Linksets](https://www.rfc-editor.org/rfc/rfc9264)
- [RFC 9727 — API Catalog](https://www.rfc-editor.org/rfc/rfc9727)
- [RFC 8414 — OAuth Authorization Server Metadata](https://www.rfc-editor.org/rfc/rfc8414)
- [OpenID Connect Discovery 1.0](http://openid.net/specs/openid-connect-discovery-1_0.html)
- [RFC 9728 — OAuth Protected Resource Metadata](https://www.rfc-editor.org/rfc/rfc9728)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [MCP Server Card — SEP-1649 / PR #2127](https://github.com/modelcontextprotocol/modelcontextprotocol)
- [Cloudflare Agent Skills Discovery RFC](https://github.com/cloudflare/agent-skills-discovery-rfc)
- [agentskills.io](https://agentskills.io/)
- [Spec WebMCP](https://webmachinelearning.github.io/webmcp/)
- [Content Signals](https://contentsignals.org/)
- [isitagentready.com](https://isitagentready.com/)
