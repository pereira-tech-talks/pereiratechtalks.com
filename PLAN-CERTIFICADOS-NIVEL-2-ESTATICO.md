# Plan — Certificados Nivel 2 (estático, sin backend)

Plan de implementación para **Pereira Tech Day 2026** y eventos futuros de Pereira Tech Talks, adaptado al proyecto actual: **Astro estático** (`output: 'static'`), desplegado en GitHub Pages, **sin backend propio**.

**Condición rectora:** todo el ciclo de emisión, almacenamiento y verificación funciona con **archivos estáticos** (JSON, HTML, well-known). No hay API, base de datos ni servidor en runtime.

**Nivel de transparencia objetivo:** **Nivel 2 — Estándar abierto** (`w3c-vc` + `did:web`).

---

## Resumen ejecutivo

| Aspecto | Decisión |
|---|---|
| Stack | Astro 5, sitio estático en `pereiratechtalks.org` |
| Fuente de datos | JSON versionado en el repo (lista de asistentes certificados) |
| Formato de credencial | W3C Verifiable Credential 2.0 (JSON-LD) |
| Identidad del emisor | `did:web:pereiratechtalks.org` |
| Firma | Ed25519 en **build time** (clave privada solo en CI) |
| Verificación | Páginas estáticas + validación criptográfica en el navegador (Web Crypto) |
| PDF | HTML existente + imprimir/guardar PDF en el cliente |
| QR | URL pública de verificación por certificado |
| Revocación | Campo `status` en JSON + redeploy |
| Check-in / inscripción | Fuera del núcleo: Sheets, Luma o lista manual → alimenta el JSON |

---

## Qué significa Nivel 2 en este contexto

El plan original define tres niveles de transparencia. En modo estático, Nivel 2 implica:

```txt
Menos transparente                              Más transparente
──────────────────────────────────────────────────────────────────►

  Nivel 1                    Nivel 2 (objetivo)           Nivel 3
  custom-ed25519             W3C VC + did:web             Merkle on-chain
  JSON firmado simple        JSON-LD estándar             (fase posterior)
```

### Qué ve el verificador en `/pereira-tech-day/certificado/verify/{id}`

```txt
✓ Verifiable Credential válida
  Emisor: did:web:pereiratechtalks.org
  Tipo: EventAttendanceCredential
  Asistente: Ana Pérez
  Evento: Pereira Tech Day 2026 — 22 de agosto de 2026
  Lugar: UTP — Auditorio Jorge Roa Martínez, Pereira
  Verificado: firma Ed25519 del emisor (did:web)
  [Descargar JSON-LD]
```

### Qué NO incluye esta fase

- Anclaje blockchain (Nivel 3)
- Check-in en tiempo real
- Panel de administración web
- Envío automático de email
- Base de datos o API de revocación en runtime

---

## Estado actual del proyecto

### Ya implementado

- Plantilla visual del certificado (`CertificateDocument.astro`)
- Layout dedicado (`CertificateLayout.astro`)
- Estilos (`pereira-tech-day-certificate.css`)
- Tipos base (`src/types/certification.ts`)
- Generación de QR (`qrcode`)
- Preview de certificado y verificación (mock)
- Botón imprimir/guardar PDF (`window.print()`)

### Por implementar

- JSON de registro de certificados (reemplaza mock)
- Rutas dinámicas `[id].astro` y `verify/[id].astro`
- Credenciales W3C VC 2.0 (JSON-LD)
- `/.well-known/did.json` y documento de clave pública
- Scripts de generación y firma en build/CI
- Verificación criptográfica en el cliente
- Descarga del JSON-LD portable por asistente

---

## Arquitectura estática

```
┌─────────────────────────────────────────────────────────────────┐
│  Pre-evento / post-evento (manual o Sheets)                     │
│  Lista de asistentes con check-in validado                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Script local: npm run certs:import                             │
│  CSV/Sheets → src/data/certificates/ptd-2026.registry.json      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Script CI/local: npm run certs:sign                            │
│  Genera VC JSON-LD + firma Ed25519 por credencial               │
│  Clave privada: GitHub Secret (nunca en repo ni browser)        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  npm run build (Astro)                                          │
│  getStaticPaths → N páginas HTML (certificado + verify)         │
│  Copia JSON-LD a public/certificates/ptd-2026/{id}.json         │
│  Publica /.well-known/did.json                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  GitHub Pages — pereiratechtalks.org                            │
│  Asistente: URL personal → imprime PDF                          │
│  Verificador: QR → /verify/{id} → validación en browser         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Artefactos estáticos

### 1. Registro maestro (build-time, no público indexado)

`src/data/certificates/ptd-2026.registry.json`

```json
{
  "event": {
    "id": "ptd-2026",
    "name": "Pereira Tech Day 2026",
    "date": "2026-08-22",
    "location": "UTP — Auditorio Jorge Roa Martínez, Pereira"
  },
  "issuer": {
    "name": "Pereira Tech Talks",
    "did": "did:web:pereiratechtalks.org"
  },
  "transparencyLevel": 2,
  "verificationProvider": "w3c-vc",
  "certificates": [
    {
      "id": "cert_ptd2026_000001",
      "status": "valid",
      "subject": { "name": "María Fernanda Gómez" },
      "issuedAt": "2026-08-22T18:00:00Z"
    }
  ]
}
```

> **Privacidad:** este archivo vive en `src/data/` (solo build). Los JSON-LD individuales en `public/` son accesibles solo por URL directa (ID opaco), sin listado público.

### 2. DID del emisor

`public/.well-known/did.json`

```json
{
  "@context": ["https://www.w3.org/ns/did/v1"],
  "id": "did:web:pereiratechtalks.org",
  "verificationMethod": [{
    "id": "did:web:pereiratechtalks.org#key-1",
    "type": "Ed25519VerificationKey2020",
    "controller": "did:web:pereiratechtalks.org",
    "publicKeyMultibase": "z6Mk..."
  }],
  "authentication": ["did:web:pereiratechtalks.org#key-1"],
  "assertionMethod": ["did:web:pereiratechtalks.org#key-1"]
}
```

Resolución `did:web`: `https://pereiratechtalks.org/.well-known/did.json`

### 3. Credencial W3C VC 2.0 por asistente

`public/certificates/ptd-2026/{id}.json`

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://pereiratechtalks.org/schemas/event-attendance/v1"
  ],
  "id": "https://pereiratechtalks.org/certificates/ptd-2026/cert_ptd2026_000001.json",
  "type": ["VerifiableCredential", "EventAttendanceCredential"],
  "issuer": "did:web:pereiratechtalks.org",
  "validFrom": "2026-08-22T18:00:00Z",
  "credentialSubject": {
    "id": "urn:uuid:...",
    "name": "María Fernanda Gómez",
    "attended": {
      "name": "Pereira Tech Day 2026",
      "date": "2026-08-22",
      "location": "UTP — Auditorio Jorge Roa Martínez, Pereira"
    }
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "created": "2026-08-22T18:00:00Z",
    "verificationMethod": "did:web:pereiratechtalks.org#key-1",
    "proofPurpose": "assertionMethod",
    "proofValue": "base64url..."
  }
}
```

### 4. Páginas HTML generadas

| Ruta | Propósito |
|---|---|
| `/pereira-tech-day/certificado/{id}` | Certificado visual + QR + descargar JSON |
| `/pereira-tech-day/certificado/verify/{id}` | Verificación pública |
| `/certificates/ptd-2026/{id}.json` | JSON-LD portable (enlace directo) |

---

## Modelo de datos (TypeScript)

Extender `src/types/certification.ts`:

```typescript
export type TransparencyLevel = 1 | 2 | 3;

export type CertificationRegistry = {
  event: {
    id: string;
    name: string;
    date: string;
    location?: string;
  };
  issuer: {
    name: string;
    did: string;
  };
  transparencyLevel: TransparencyLevel;
  verificationProvider: 'custom-ed25519' | 'w3c-vc';
  certificates: CertificationRecord[];
};

export type CertificationRecord = {
  id: string;
  status: CertificationStatus;
  subject: { name: string };
  issuedAt: string;
  replacedBy?: string;
  revokeReason?: string;
};

export type W3CVerifiableCredential = {
  '@context': string[];
  id: string;
  type: string[];
  issuer: string;
  validFrom: string;
  credentialSubject: Record<string, unknown>;
  proof?: W3CProof;
};

export type W3CProof = {
  type: string;
  created: string;
  verificationMethod: string;
  proofPurpose: string;
  proofValue: string;
};
```

---

## Flujo de verificación (cliente)

Orden fijo en la página `verify/[id].astro`:

```txt
1. Cargar credencial JSON-LD (embebida en HTML o fetch a /certificates/.../id.json)
2. Comprobar status !== revoked | replaced | invalid
3. Resolver did:web → fetch /.well-known/did.json
4. Extraer clave pública Ed25519 del verificationMethod
5. Canonicalizar payload y verificar proof con Web Crypto API
6. Mostrar resultado normalizado en UI
```

### Resultado normalizado (`VerificationResult`)

```typescript
{
  valid: true,
  status: 'valid',
  reasons: [],
  payload: { /* datos para UI */ },
  provider: 'w3c-vc',
  verifiedAt: '2026-08-22T19:30:00Z'
}
```

La verificación **no depende de un servidor** en runtime: cualquier tercero con el JSON-LD + acceso a `did.json` puede validar offline si implementa el mismo algoritmo de canonicalización.

---

## Scripts npm

| Script | Cuándo | Qué hace |
|---|---|---|
| `certs:import` | Post-evento, local | CSV/Sheets → `registry.json` |
| `certs:sign` | Pre-build, CI | Genera JSON-LD + firma por certificado |
| `certs:revoke` | Corrección | Marca `status: revoked` en registry |
| `build` | CI / local | Astro genera páginas estáticas |

### Entrada del import (CSV mínimo)

```csv
name,certificate_id
María Fernanda Gómez,cert_ptd2026_000001
Ana Pérez,cert_ptd2026_000002
```

El script asigna IDs secuenciales si no vienen en el CSV.

### Secreto en CI

```txt
CERT_SIGNING_PRIVATE_KEY  → GitHub Actions secret (Ed25519, multibase o PEM)
```

La clave pública derivada se escribe en `public/.well-known/did.json` durante el primer setup (commit manual) o regenerada si rota.

---

## Estructura de archivos propuesta

```txt
pereiratechtalks.com/
├── PLAN-CERTIFICADOS-NIVEL-2-ESTATICO.md     ← este documento
├── scripts/
│   ├── certs-import.mjs                      ← CSV → registry
│   ├── certs-sign.mjs                        ← registry → VC JSON-LD firmados
│   └── certs-verify.mjs                      ← utilidad CLI para probar firma
├── public/
│   ├── .well-known/
│   │   └── did.json
│   └── certificates/
│       └── ptd-2026/
│           └── {id}.json                     ← generados en build
├── src/
│   ├── data/certificates/
│   │   └── ptd-2026.registry.json            ← fuente de verdad (git)
│   ├── lib/certificates/
│   │   ├── canonicalize.ts                   ← canonicalización para firma
│   │   ├── did-web.ts                        ← resolver did:web
│   │   ├── sign.ts                           ← firma Ed25519 (Node, build)
│   │   └── verify.ts                         ← verificación (browser + Node)
│   ├── pages/pereira-tech-day/certificado/
│   │   ├── [id].astro                        ← certificado por asistente
│   │   └── verify/
│   │       └── [id].astro                    ← verificación pública
│   ├── components/certificates/
│   │   ├── CertificateDocument.astro         ← existente
│   │   └── VerificationResult.astro          ← UI de resultado
│   └── types/certification.ts                ← extendido
```

---

## Fases de implementación

### Fase 0 — Preparación ⬜

- [ ] Crear `src/data/certificates/ptd-2026.registry.json` con datos de prueba (3–5 entradas)
- [ ] Definir esquema `@context` custom: `public/schemas/event-attendance/v1.jsonld`
- [ ] Generar par de claves Ed25519 (dev); documentar rotación
- [ ] Crear `public/.well-known/did.json` con clave pública de desarrollo

### Fase 1 — Rutas estáticas (sin firma aún) ⬜

- [ ] `[id].astro` con `getStaticPaths` leyendo registry
- [ ] `verify/[id].astro` con lookup por ID
- [ ] Reemplazar `preview.astro` / `verify-preview.astro` o redirigir a rutas reales
- [ ] QR apuntando a URL de producción `/verify/{id}`
- [ ] `robots: noindex` en páginas de certificado individual

### Fase 2 — W3C VC + firma ⬜

- [ ] Implementar `scripts/certs-sign.mjs` (genera JSON-LD + proof)
- [ ] Copiar JSON-LD firmados a `public/certificates/ptd-2026/`
- [ ] Integrar `certs:sign` en pipeline de build (GitHub Actions)
- [ ] Añadir botón "Descargar credencial JSON" en página del certificado

### Fase 3 — Verificación criptográfica en cliente ⬜

- [ ] `src/lib/certificates/verify.ts` con Web Crypto
- [ ] Resolver `did:web` → fetch `/.well-known/did.json`
- [ ] UI de verificación: válido / revocado / firma inválida / no encontrado
- [ ] Script CLI `certs-verify.mjs` para validar lote antes de deploy

### Fase 4 — Operación Pereira Tech Day 2026 ⬜

- [ ] Exportar lista de asistentes con check-in validado
- [ ] `npm run certs:import -- --input asistentes.csv`
- [ ] Revisar registry manualmente
- [ ] `npm run certs:sign` en CI con clave de producción
- [ ] Deploy
- [ ] Enviar URL personalizada a cada asistente (email manual o herramienta externa)

### Fase 5 — Mejoras opcionales ⬜

- [ ] Revocación documentada (`certs:revoke` + redeploy)
- [ ] Re-emisión (`status: replaced` + nuevo ID)
- [ ] Compatibilidad con verificadores VC externos (validar contra `@digitalbazaar/vc`)
- [ ] Nivel 3: anclaje Merkle del lote (script separado, fuera de scope inicial)

---

## Flujo operativo — Pereira Tech Day 2026

```txt
1. Evento (22-ago-2026): check-in con Luma/Sheets/lista manual
2. Post-evento: exportar solo asistentes con asistencia confirmada
3. npm run certs:import → genera registry.json (~300 entradas)
4. Revisión humana del registry (nombres, duplicados)
5. Push a main → CI ejecuta certs:sign + build + deploy
6. Cada asistente recibe:
   https://pereiratechtalks.org/pereira-tech-day/certificado/cert_ptd2026_000042
7. Asistente abre enlace → imprime PDF
8. Empleador escanea QR → verify → "Verifiable Credential válida"
9. Asistente puede descargar JSON-LD portable para su wallet/CV
```

---

## Seguridad y privacidad

| Tema | Regla |
|---|---|
| Clave privada | Solo en GitHub Secret; usada en `certs:sign`, nunca en browser |
| PII | Nombres en JSON-LD público por URL; IDs opacos; sin índice/listado |
| Revocación | Visible siempre en `/verify/{id}`; requiere redeploy |
| DID | `did:web` atado al dominio `pereiratechtalks.org` |
| Blockchain | No aplica en Nivel 2 |
| Repo | El registry en `src/data/` contiene PII; repo privado o acceso restringido al equipo |

---

## Limitaciones del enfoque estático

| Limitación | Impacto | Mitigación |
|---|---|---|
| Revocación requiere redeploy | No es instantánea | Aceptable para eventos locales; proceso documentado |
| Sin email automático | Envío manual de links | Mailchimp, Brevo, o copiar/pegar post-evento |
| PII en artefactos estáticos | URLs adivinables si ID es secuencial | IDs opacos (`cert_` + random) |
| Confianza en el repo | Quien edita git puede alterar registry | Firma Ed25519 detecta alteración del JSON-LD post-firma |
| Check-in no integrado | Lista manual post-evento | Sheets/Luma export → CSV |
| ~300 páginas HTML | Build más lento | Aceptable; Astro lo maneja bien |

---

## Criterios de elegibilidad (operativos)

| Regla | Default |
|---|---|
| Al menos un check-in validado | Sí |
| Evento finalizado | Sí (emitir post-evento) |
| Solo nombre en certificado | Sí (sin email ni documento) |
| Re-emisión por error de nombre | `status: replaced` + nuevo certificado |

---

## Checklist de componentes

| Componente | Estado |
|---|---|
| Plantilla PDF visual | ✅ Hecho |
| Tipos base TypeScript | ✅ Parcial |
| Registry JSON | ⬜ |
| Rutas `[id]` estáticas | ⬜ |
| W3C VC 2.0 JSON-LD | ⬜ |
| `did:web` + `/.well-known/did.json` | ⬜ |
| Firma Ed25519 (build) | ⬜ |
| Verificación en browser | ⬜ |
| Descarga JSON portable | ⬜ |
| Scripts import/sign/revoke | ⬜ |
| Integración CI | ⬜ |
| Revocación / re-emisión | ⬜ |
| Anclaje Merkle (Nivel 3) | ⬜ Futuro |

---

## Referencias

- [W3C Verifiable Credentials Data Model v2.0](https://www.w3.org/TR/vc-data-model-2.0/)
- [did:web Method Specification](https://w3c-ccg.github.io/did-method-web/)
- [Ed25519Signature2020](https://w3c-ccg.github.io/security-vocab/#Ed25519Signature2020)
- Librerías candidatas: `@digitalbazaar/vc`, `digitalcredentials/vc`, Web Crypto API nativa

---

## Próximo paso inmediato

Implementar **Fase 0 + Fase 1**: registry de prueba, rutas `[id]` y `verify/[id]` reutilizando `CertificateDocument.astro`, sin firma criptográfica todavía. Validar el flujo visual y operativo antes de añadir W3C VC y Ed25519.
