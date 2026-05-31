---
title: 'Introducción a GoLang'
description: 'Por qué Go me convenció — mi sesión en Pereira Tech Talks sobre la simplicidad de Go, su concurrencia nativa y cómo resuelve problemas reales con menos ceremonias.'
pubDate: '2018-07-05'
heroImage: '/images/blog/posts/introduction-to-golang/hero.webp'
heroLayout: 'banner'
tags: ["talks", "tech"]
keywords: ["introducción a Go", "qué es Go Golang", "concurrencia con Go", "Go vs otros lenguajes de programación", "Go para desarrolladores backend", "simplicidad del lenguaje Go", "Pereira Tech Talks Golang"]
---

Go es uno de esos lenguajes que no se interpone en tu camino. Cuando preparé esta charla para Pereira Tech Talks, lo que quería transmitir no era solo la sintaxis o las características — era por qué Go se siente diferente. Es un lenguaje que confía en que podés escribir código claro sin abrumarte con opciones.

---

## ¿Qué es Go?

Go es **open source**, **compilado** y **multiplataforma**. Con `go build` generas binarios para distintas arquitecturas sin cambiar código. La sintaxis es tipo C pero con la ergonomía de lenguajes interpretados — menos ceremonias, más productividad.

```go
package main

import "fmt"

func main() {
    fmt.Printf("Hello World")
}
```

Go nació en 2007 de la mano de Robert Griesemer (JVM, V8), Rob Pike (UNIX, UTF-8) y Ken Thompson (B, C, UNIX). Google lo lanzó como open source en 2009; la versión 1.0 llegó en 2012. El equipo no buscaba reemplazar Java o C++, sino crear un lenguaje que les diera las ventajas que necesitaban para sistemas modernos: compilación rápida, concurrencia nativa y despliegue en un solo binario.

---

## ¿Por Qué Go?

- **Fácil de aprender** — El lenguaje es pequeño y consistente.
- **Moderno** — Pensado para sistemas que requieren alto rendimiento y alta concurrencia.
- **Librería estándar** — `net/http`, `database/sql`, `encoding`, `testing`, encriptación — obtienes mucho sin dependencias externas.
- **Quién lo usa** — Canonical, Cloudflare, Uber, Disqus, Digital Ocean, Facebook, Netflix.

Y sí, la mascota Gopher es linda. Eso cuenta.

---

## Lo que cubrí en la charla

Hice demos en vivo desde lo más básico hasta ejemplos prácticos:

### Fundamentos

- Hello World, entrada estándar, declaraciones de variables
- Tipos: `bool`, `string`, `int`, `float`, `byte`, `rune`, `complex`
- Funciones con múltiples retornos
- Loops (`for` es el único, pero muy flexible), condicionales, `switch` con `fallthrough`
- Arrays, maps, structs, métodos e interfaces

### Concurrencia y Más

- **Defer** — Ejecutar código al salir del contexto de una función
- **Panic y errors** — Manejo de errores idiomático
- **Pointers** — Referencias y desreferenciación
- **Goroutines** — Concurrencia ligera con `go`
- **Channels** — Comunicación entre goroutines

### Ejemplos prácticos

- Servidor HTTP con `net/http`
- Cliente HTTP consumiendo una API (JSON)
- Lectura de archivos con `io/ioutil`

### Frameworks y Librerías

- **Frameworks:** Revel, Beego, Martini, Buffalo
- **Librerías:** Testify, Logrus, pkg/errors, cobra, godog
- **Bonus:** Ebiten (juegos 2D), WebAssembly

---

## Recursos

- [Ver slides](https://slides.com/xergioalex/introduction-to-go-lang)
- [Go Basics (GitHub)](https://github.com/xergioalex/goBasics) — Código de la charla
- [Go oficial](https://golang.org/)
- [Rob Pike — Concurrency Is Not Parallelism](https://blog.golang.org/concurrency-is-not-parallelism)
- [Platzi — Go Básico](https://platzi.com/cursos/go-basico/)

---

Go me enseñó que simplicidad y poder no son opuestos. El lenguaje demostró que podés tener alto rendimiento y alta concurrencia sin sacrificar legibilidad. Ese equilibrio es lo que me hace volver a él una y otra vez.

A seguir construyendo.
