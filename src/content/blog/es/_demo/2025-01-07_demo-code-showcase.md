---
title: 'Programacion Poliglota: Ejemplos de Codigo en Multiples Lenguajes'
description: 'Una muestra de bloques de codigo con resaltado de sintaxis en multiples lenguajes de programacion'
pubDate: '2025-01-07'
heroImage: '/images/blog/shared/blog-placeholder-4.webp'
heroLayout: 'side-by-side'
tags: ['tech', 'demo']
keywords: ['ejemplos de resaltado de sintaxis', 'bloques de código múltiples lenguajes', 'showcase lenguajes de programación', 'formato de código en blog', 'ejemplos de programación políglota']
---

El desarrollo de software moderno frecuentemente involucra trabajar con multiples lenguajes y ecosistemas. Este post muestra el resaltado de sintaxis para una amplia variedad de lenguajes de programacion, util como referencia visual para autores de blogs.

## TypeScript / JavaScript

TypeScript es la columna vertebral del desarrollo web moderno. Aqui tienes una utilidad generica para obtener datos:

```typescript
interface RespuestaApi<T> {
  data: T;
  status: number;
  message: string;
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<RespuestaApi<T>> {
  const baseUrl = import.meta.env.API_URL ?? 'https://api.example.com';
  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Error de API: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Uso
const { data: usuarios } = await fetchApi<Usuario[]>('/usuarios');
```

## Python

Python sobresale en procesamiento de datos y scripting:

```python
from dataclasses import dataclass
from typing import Optional
import asyncio
import httpx


@dataclass
class Config:
    base_url: str
    timeout: float = 30.0
    max_retries: int = 3


async def fetch_con_reintento(
    url: str,
    config: Config,
    intento: int = 1,
) -> dict:
    """Obtener una URL con reintento con retroceso exponencial."""
    async with httpx.AsyncClient(timeout=config.timeout) as client:
        try:
            response = await client.get(url)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            if intento >= config.max_retries:
                raise
            espera = 2 ** intento
            print(f"Reintento {intento}/{config.max_retries} en {espera}s...")
            await asyncio.sleep(espera)
            return await fetch_con_reintento(url, config, intento + 1)
```

## Rust

Rust combina rendimiento con seguridad de memoria:

```rust
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;

type Cache = Arc<RwLock<HashMap<String, ElementoCache>>>;

#[derive(Clone, Debug)]
struct ElementoCache {
    valor: String,
    expira_en: std::time::Instant,
}

impl ElementoCache {
    fn esta_expirado(&self) -> bool {
        std::time::Instant::now() > self.expira_en
    }
}

async fn obtener_o_buscar(cache: &Cache, clave: &str) -> Result<String, Box<dyn std::error::Error>> {
    // Verificar cache primero
    {
        let guard_lectura = cache.read().await;
        if let Some(elemento) = guard_lectura.get(clave) {
            if !elemento.esta_expirado() {
                return Ok(elemento.valor.clone());
            }
        }
    }

    // Buscar y cachear
    let valor = buscar_de_fuente(clave).await?;
    let elemento = ElementoCache {
        valor: valor.clone(),
        expira_en: std::time::Instant::now() + std::time::Duration::from_secs(300),
    };

    let mut guard_escritura = cache.write().await;
    guard_escritura.insert(clave.to_string(), elemento);
    Ok(valor)
}
```

## Go

Go esta disenado para simplicidad y concurrencia:

```go
package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"
)

type Servidor struct {
	router *http.ServeMux
	puerto string
}

type Respuesta struct {
	Estado  string      `json:"estado"`
	Data    interface{} `json:"data,omitempty"`
	Mensaje string      `json:"mensaje,omitempty"`
}

func NuevoServidor(puerto string) *Servidor {
	s := &Servidor{
		router: http.NewServeMux(),
		puerto: puerto,
	}
	s.rutas()
	return s
}

func (s *Servidor) rutas() {
	s.router.HandleFunc("GET /api/health", s.manejarSalud)
	s.router.HandleFunc("GET /api/usuarios/{id}", s.manejarObtenerUsuario)
}

func (s *Servidor) manejarSalud(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(Respuesta{
		Estado:  "ok",
		Mensaje: "El servicio esta saludable",
	})
}

func (s *Servidor) Iniciar(ctx context.Context) error {
	servidor := &http.Server{
		Addr:         ":" + s.puerto,
		Handler:      s.router,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}
	log.Printf("Servidor iniciando en puerto %s", s.puerto)
	return servidor.ListenAndServe()
}
```

## Bash / Shell

Scripts de shell para automatizacion y DevOps:

```bash
#!/usr/bin/env bash
set -euo pipefail

# Script de despliegue con verificacion de salud
ENTORNO_DEPLOY="${1:-staging}"
NOMBRE_APP="mi-servicio"
URL_SALUD="https://${ENTORNO_DEPLOY}.example.com/api/health"

echo "Desplegando ${NOMBRE_APP} en ${ENTORNO_DEPLOY}..."

# Construir y subir imagen Docker
docker build -t "${NOMBRE_APP}:latest" .
docker tag "${NOMBRE_APP}:latest" "registry.example.com/${NOMBRE_APP}:${ENTORNO_DEPLOY}"
docker push "registry.example.com/${NOMBRE_APP}:${ENTORNO_DEPLOY}"

# Esperar verificacion de salud
echo "Esperando que el servicio este saludable..."
for i in $(seq 1 30); do
  if curl -sf "${URL_SALUD}" > /dev/null 2>&1; then
    echo "El servicio esta saludable despues de ${i} segundos"
    exit 0
  fi
  sleep 1
done

echo "ERROR: Verificacion de salud fallo despues de 30 segundos"
exit 1
```

## YAML

Archivos de configuracion y pipelines CI/CD:

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    ports:
      - '${API_PORT:-8080}:8080'
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=redis://cache:6379
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:8080/health']
      interval: 30s
      timeout: 10s
      retries: 3

  db:
    image: postgres:16-alpine
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 5s

  cache:
    image: redis:7-alpine
    command: redis-server --maxmemory 256mb --maxmemory-policy allkeys-lru

volumes:
  pgdata:
```

## JSON

Respuestas de API y configuracion:

```json
{
  "name": "mi-proyecto",
  "version": "2.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro check && astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/svelte": "^6.0.0",
    "svelte": "^5.0.0"
  }
}
```

## HTML / CSS

Fundamentos web:

```html
<article class="blog-post" itemscope itemtype="https://schema.org/BlogPosting">
  <header>
    <h1 itemprop="headline">Titulo del Articulo</h1>
    <time itemprop="datePublished" datetime="2025-01-07">
      7 de enero de 2025
    </time>
  </header>
  <div itemprop="articleBody">
    <p>El contenido va aqui...</p>
  </div>
</article>
```

```css
.blog-post {
  max-width: 65ch;
  margin-inline: auto;
  padding: 2rem;
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.7;
  color: light-dark(#1a1a2e, #e0e0e0);

  & header {
    margin-block-end: 2rem;
    border-bottom: 1px solid light-dark(#e5e7eb, #374151);

    & h1 {
      font-size: clamp(1.5rem, 4vw, 2.5rem);
      text-wrap: balance;
    }
  }
}
```

## SQL

Consultas de base de datos:

```sql
-- Encontrar los autores mas activos en los ultimos 30 dias
WITH posts_recientes AS (
  SELECT
    autor_id,
    COUNT(*) AS cantidad_posts,
    AVG(conteo_palabras) AS promedio_palabras,
    MAX(publicado_en) AS ultima_publicacion
  FROM posts
  WHERE publicado_en >= CURRENT_DATE - INTERVAL '30 days'
    AND estado = 'publicado'
  GROUP BY autor_id
)
SELECT
  u.nombre,
  u.email,
  pr.cantidad_posts,
  ROUND(pr.promedio_palabras) AS promedio_palabras,
  pr.ultima_publicacion
FROM posts_recientes pr
JOIN usuarios u ON u.id = pr.autor_id
ORDER BY pr.cantidad_posts DESC
LIMIT 10;
```

## Formato Diff

Mostrando cambios de codigo:

```diff
- const API_URL = 'http://localhost:3000';
+ const API_URL = import.meta.env.API_URL ?? 'https://api.example.com';

  async function fetchData() {
-   const response = await fetch(API_URL + '/data');
-   return response.json();
+   try {
+     const response = await fetch(`${API_URL}/data`);
+     if (!response.ok) throw new Error(`HTTP ${response.status}`);
+     return response.json();
+   } catch (error) {
+     console.error('Error al obtener datos:', error);
+     return null;
+   }
  }
```

## Referencia de Codigo en Linea

Al escribir contenido tecnico, usa codigo en linea para:

- Nombres de variables: `idUsuario`, `estaAutenticado`
- Rutas de archivos: `src/lib/blog.ts`
- Comandos: `npm run build`
- Expresiones cortas: `array.filter(Boolean)`
- Variables de entorno: `process.env.NODE_ENV`

Esta muestra cubre los lenguajes mas comunes usados en el desarrollo de software moderno. El motor de resaltado de sintaxis maneja la gramatica de cada lenguaje correctamente, haciendo que los bloques de codigo sean faciles de leer y entender.
