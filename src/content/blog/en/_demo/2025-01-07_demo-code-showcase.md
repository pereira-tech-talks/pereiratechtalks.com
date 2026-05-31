---
title: 'Polyglot Programming: Code Examples Across Languages'
description: 'A showcase of syntax-highlighted code blocks in multiple programming languages'
pubDate: '2025-01-07'
heroImage: '/images/blog/shared/blog-placeholder-4.webp'
heroLayout: 'side-by-side'
tags: ['tech', 'demo']
keywords: ['syntax highlighting examples', 'code blocks multiple languages', 'programming language showcase', 'developer blog code formatting', 'polyglot programming examples']
---

Modern software development often involves working across multiple languages and ecosystems. This post showcases syntax highlighting for a wide range of programming languages, useful as a visual reference for blog authors.

## TypeScript / JavaScript

TypeScript is the backbone of modern web development. Here's a generic data fetching utility:

```typescript
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const baseUrl = import.meta.env.API_URL ?? 'https://api.example.com';
  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// Usage
const { data: users } = await fetchApi<User[]>('/users');
```

## Python

Python excels in data processing and scripting:

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


async def fetch_with_retry(
    url: str,
    config: Config,
    attempt: int = 1,
) -> dict:
    """Fetch a URL with exponential backoff retry."""
    async with httpx.AsyncClient(timeout=config.timeout) as client:
        try:
            response = await client.get(url)
            response.raise_for_status()
            return response.json()
        except httpx.HTTPStatusError as e:
            if attempt >= config.max_retries:
                raise
            wait = 2 ** attempt
            print(f"Retry {attempt}/{config.max_retries} in {wait}s...")
            await asyncio.sleep(wait)
            return await fetch_with_retry(url, config, attempt + 1)
```

## Rust

Rust combines performance with memory safety:

```rust
use std::collections::HashMap;
use std::sync::Arc;
use tokio::sync::RwLock;

type Cache = Arc<RwLock<HashMap<String, CachedItem>>>;

#[derive(Clone, Debug)]
struct CachedItem {
    value: String,
    expires_at: std::time::Instant,
}

impl CachedItem {
    fn is_expired(&self) -> bool {
        std::time::Instant::now() > self.expires_at
    }
}

async fn get_or_fetch(cache: &Cache, key: &str) -> Result<String, Box<dyn std::error::Error>> {
    // Check cache first
    {
        let read_guard = cache.read().await;
        if let Some(item) = read_guard.get(key) {
            if !item.is_expired() {
                return Ok(item.value.clone());
            }
        }
    }

    // Fetch and cache
    let value = fetch_from_source(key).await?;
    let item = CachedItem {
        value: value.clone(),
        expires_at: std::time::Instant::now() + std::time::Duration::from_secs(300),
    };

    let mut write_guard = cache.write().await;
    write_guard.insert(key.to_string(), item);
    Ok(value)
}
```

## Go

Go is designed for simplicity and concurrency:

```go
package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"
)

type Server struct {
	router *http.ServeMux
	port   string
}

type Response struct {
	Status  string      `json:"status"`
	Data    interface{} `json:"data,omitempty"`
	Message string      `json:"message,omitempty"`
}

func NewServer(port string) *Server {
	s := &Server{
		router: http.NewServeMux(),
		port:   port,
	}
	s.routes()
	return s
}

func (s *Server) routes() {
	s.router.HandleFunc("GET /api/health", s.handleHealth)
	s.router.HandleFunc("GET /api/users/{id}", s.handleGetUser)
}

func (s *Server) handleHealth(w http.ResponseWriter, r *http.Request) {
	json.NewEncoder(w).Encode(Response{
		Status:  "ok",
		Message: "Service is healthy",
	})
}

func (s *Server) Start(ctx context.Context) error {
	server := &http.Server{
		Addr:         ":" + s.port,
		Handler:      s.router,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 30 * time.Second,
	}
	log.Printf("Server starting on port %s", s.port)
	return server.ListenAndServe()
}
```

## Bash / Shell

Shell scripts for automation and DevOps:

```bash
#!/usr/bin/env bash
set -euo pipefail

# Deploy script with health check
DEPLOY_ENV="${1:-staging}"
APP_NAME="my-service"
HEALTH_URL="https://${DEPLOY_ENV}.example.com/api/health"

echo "Deploying ${APP_NAME} to ${DEPLOY_ENV}..."

# Build and push Docker image
docker build -t "${APP_NAME}:latest" .
docker tag "${APP_NAME}:latest" "registry.example.com/${APP_NAME}:${DEPLOY_ENV}"
docker push "registry.example.com/${APP_NAME}:${DEPLOY_ENV}"

# Wait for health check
echo "Waiting for service to be healthy..."
for i in $(seq 1 30); do
  if curl -sf "${HEALTH_URL}" > /dev/null 2>&1; then
    echo "Service is healthy after ${i} seconds"
    exit 0
  fi
  sleep 1
done

echo "ERROR: Health check failed after 30 seconds"
exit 1
```

## YAML

Configuration files and CI/CD pipelines:

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

API responses and configuration:

```json
{
  "name": "my-project",
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

Web fundamentals:

```html
<article class="blog-post" itemscope itemtype="https://schema.org/BlogPosting">
  <header>
    <h1 itemprop="headline">Article Title</h1>
    <time itemprop="datePublished" datetime="2025-01-07">
      January 7, 2025
    </time>
  </header>
  <div itemprop="articleBody">
    <p>Content goes here...</p>
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

Database queries:

```sql
-- Find the most active authors in the last 30 days
WITH recent_posts AS (
  SELECT
    author_id,
    COUNT(*) AS post_count,
    AVG(word_count) AS avg_words,
    MAX(published_at) AS last_published
  FROM posts
  WHERE published_at >= CURRENT_DATE - INTERVAL '30 days'
    AND status = 'published'
  GROUP BY author_id
)
SELECT
  u.name,
  u.email,
  rp.post_count,
  ROUND(rp.avg_words) AS avg_words,
  rp.last_published
FROM recent_posts rp
JOIN users u ON u.id = rp.author_id
ORDER BY rp.post_count DESC
LIMIT 10;
```

## Diff Format

Showing code changes:

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
+     console.error('Failed to fetch data:', error);
+     return null;
+   }
  }
```

## Inline Code Reference

When writing technical content, use inline code for:

- Variable names: `userId`, `isAuthenticated`
- File paths: `src/lib/blog.ts`
- Commands: `npm run build`
- Short expressions: `array.filter(Boolean)`
- Environment variables: `process.env.NODE_ENV`

This showcase covers the most common languages used in modern software development. The syntax highlighting engine handles each language's grammar correctly, making code blocks easy to read and understand.
