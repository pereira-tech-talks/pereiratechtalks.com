---
title: "De trading manual a trading algorítmico"
description: "Cómo pasé de ejecutar manualmente en MetaTrader 4 a migrar scripts, indicadores y expert advisors a MetaTrader 5 para operar con una automatización más avanzada."
pubDate: "2025-02-01"
heroImage: "/images/blog/posts/from-manual-to-algorithmic-trading/hero.webp"
series: "trading-journey"
seriesOrder: 3
heroLayout: "banner"
tags: ["trading", "tech", "personal"]
keywords: ["trading algorítmico desde cero", "de trading manual a automatizado", "MetaTrader 5 vs MetaTrader 4", "migrar scripts de MT4 a MT5", "Expert Advisors MetaTrader 5", "automatización en trading Forex", "cómo empezar con trading algorítmico"]
---

Después de dedicar mucho tiempo al trading manual — leyendo estructura, siguiendo zonas con Market Profile y tomando decisiones de ejecución en tiempo real — me di cuenta de algo muy claro:

Mi proceso era altamente repetitivo.

Y todo proceso repetitivo es un candidato natural para automatización.

Si una regla se puede definir con claridad, una máquina puede ejecutarla con más consistencia que yo en momentos de cansancio, estrés o carga emocional.

---

## El momento en que hizo sentido

Al inicio yo operaba en **MetaTrader 4 (MT4)**.  
Luego descubrí que MT4 tiene su propio lenguaje de programación: **MQL4**.

Ahí se me abrió un camino completamente nuevo.

Dejé de pensar solo como trader y empecé a pensar también como constructor:

- ¿Qué puedo automatizar?
- ¿Qué puedo medir?
- ¿Qué puedo convertir en regla obligatoria?

---

## De MQL4 a MQL5: el siguiente salto

Cuando ya tenía bastante recorrido en MQL4, descubrí que existía **MetaTrader 5 (MT5)** y que su ecosistema para automatización es mucho más completo.

MT5 tiene su propio lenguaje, **MQL5**, que es muy parecido a MQL4, pero más avanzado y con más capacidades para construir robots, lógica de ejecución y herramientas de análisis.

Hoy en día, prácticamente todo el mundo que está metido a fondo en trading algorítmico está construyendo en MT5.

---

## Mi proceso de migración: de MT4 a MT5

La transición no fue empezar desde cero, sino migrar lo que ya venía construyendo:

- Scripts
- Indicadores
- Expert Advisors

He venido pasando esas piezas de MQL4 a MQL5 para mantener la lógica que me funciona, pero con una base más moderna y flexible.

Actualmente opero principalmente en **MQL5**, aunque mantengo compatibilidad entre ambas versiones porque todavía ejecuto parte de mi operativa en MT4 y MT5.

Mi dirección final es clara: quedarme solo con MT5 por ser el entorno más completo para automatización.

---

## Las 3 piezas clave en automatización (MT4 y MT5)

Si quieres automatizar de forma seria, hay tres tipos de herramientas principales (aplican en MT4 y MT5):

### 1) Scripts

Los scripts son programas de ejecución única.

Sirven muy bien para tareas repetitivas como:

- Enviar una o varias órdenes rápidamente
- Revisar condiciones puntuales una sola vez
- Aplicar break-even a órdenes abiertas
- Cerrar órdenes según criterios definidos

Se ejecutan una vez y terminan.

### 2) Indicadores

Los indicadores son herramientas visuales para organizar y leer mejor los datos del mercado.

No están pensados (por defecto) para ejecutar órdenes, sino para mejorar análisis de:

- Estructura
- Momentum
- Volatilidad
- Zonas técnicas relevantes

### 3) Expert Advisors (EAs)

Los Expert Advisors son sistemas persistentes que corren en loop.

Pueden monitorear condiciones y ejecutar lógica de forma continua (24/7 si la infraestructura lo permite), lo cual es ideal para:

- Enforzar reglas
- Controlar riesgo
- Operativas semi-automatizadas o automatizadas

---

## Herramientas que he venido construyendo

En mi proceso he construido varias herramientas para mejorar la calidad de ejecución.

Una de mis favoritas es lo que llamo el **Escudo de Profit**:

- Mueve automáticamente órdenes a break-even bajo condiciones definidas
- Bloquea nuevas entradas si ya alcancé ciertos niveles de riesgo
- Reduce el comportamiento discrecional de "una operación más"

También construí una **calculadora de lotaje/posición** para calcular tamaño de orden con base en:

- Riesgo porcentual de cuenta
- Distancia del stop loss
- Estructura de objetivo

Esto me ayuda a evitar tamaños improvisados y mantener coherencia de riesgo entre operaciones.

---

## Por qué esto importa más que la velocidad

El trading algorítmico muchas veces se vende como "dinero más rápido".

No es mi enfoque.

Para mí, automatizar es sobre todo:

- Disciplina de ejecución
- Consistencia en gestión de riesgo
- Reducción de errores emocionales
- Calidad operativa sostenida en el tiempo

Una máquina no tiene miedo, ni revancha, ni euforia, ni pánico.  
Eso no significa que toda estrategia automatizada gane. Pero sí significa que la ejecución de reglas puede ser más limpia y repetible.

---

## Hacia dónde voy

Mi dirección es clara: seguir evolucionando de una operativa manual/discrecional hacia una operativa más sistematizada y progresivamente más automatizada, con foco principal en MT5.

No lo veo como reemplazar por completo el criterio humano. Lo veo como combinar:

- Juicio estratégico humano
- Consistencia operativa de máquina

Esa combinación es lo que quiero seguir construyendo, cada vez con más peso del lado algorítmico en MQL5.

---

Con esto cierro esta primera trilogía de mi proceso en trading:

1. Camino personal y mentalidad  
2. Market Profile como marco de contexto  
3. Automatización como disciplina e infraestructura de riesgo

Si estás en un camino parecido, mi recomendación principal es simple: primero construye un proceso sólido, luego automatiza lo que realmente sea 100% reglable.
