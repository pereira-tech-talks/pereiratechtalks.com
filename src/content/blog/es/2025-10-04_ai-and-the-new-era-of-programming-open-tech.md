---
title: "IA y la nueva era de la programación en Open Tech Hackathon"
description: "Workshop Vibe Coding e IA en Open Tech Hackathon: Cursor, Codex y Claude Code, mentalidad de director y envíos con IA en DailyBot."
pubDate: "2025-10-04"
heroImage: "/images/blog/posts/ai-and-the-new-era-of-programming-open-tech/hero.webp"
heroLayout: "side-by-side"
tags: ["talks", "tech", "ai"]
keywords: ["Vibe Coding con IA", "Cursor vs Codex vs Claude Code", "IA para hackathon de programación", "nueva era de la programación con IA", "mentalidad de director con IA", "Open Tech Hackathon IA workshop", "cómo usar IA para entregar código más rápido"]
---

Estás en un hackathon. Tienes un fin de semana — tal vez menos — para convertir una idea en algo que funcione. Di este workshop en [Open Tech Hackathon](https://opentechhackathon.com/) porque quería darles a los participantes algo que pudieran usar *ese mismo día*: un mapa de las herramientas de IA que realmente ayudan a entregar, y un modelo mental para usarlas sin perderse en el hype.

La sesión **Vibe Coding e IA** del 4 de octubre apuntaba a una cosa: inspirar y guiar. No teoría. No "el futuro del trabajo." Herramientas concretas y una forma de pensar que les ayudara a construir sus iniciativas más rápido.

---

## Lo que quería dejarles

Tres cosas. Primero: **qué herramientas probar** — Cursor, Codex, Claude Code. Segundo: **cómo pensar en ellas** — no te estás reemplazando, te estás multiplicando. Tercero: **una mentalidad** — describe lo que quieres, deja que el agente itere, tú diriges. Eso es vibe coding. Eso es lo que quería que llevaran a sus proyectos.

---

## Las herramientas: cuándo usar cada una

Recorrí los tres agentes de código que más importan hoy — y más importante, *cuándo* brilla cada uno. Esto no es elegir favoritos. Es entender sus fortalezas y emparejarlas con tu flujo de trabajo.

**Cursor** — IDE centrado en IA construido para prototipado rápido. Describes una funcionalidad en lenguaje natural, sugiere código en múltiples archivos, tú refinas. Perfecto para proyectos greenfield o velocidad de hackathon. Dónde brilla: cuando empiezas desde cero y necesitas moverte rápido. Dónde falla: bases de código legacy profundamente anidadas donde el contexto se vuelve confuso.

**Codex** (impulsa GitHub Copilot) — Sugerencias en línea, autocompletado potenciado. Mantienes el flujo, él llena el boilerplate y los patrones repetitivos. Dónde brilla: escribir tests, implementar funciones directas, traducir lógica de un lenguaje a otro. Dónde falla: decisiones arquitectónicas complejas o refactorizaciones de múltiples pasos.

**Claude Code** — Razonamiento fuerte y contexto largo. Bueno para decisiones de arquitectura, debugging de problemas complicados y explicar código desconocido. Dónde brilla: cuando necesitas entender una base de código grande rápido, refactorizar de forma segura o arquitecturar una nueva funcionalidad. Dónde falla: codificación altamente interactiva donde la velocidad importa más que la profundidad del razonamiento.

He usado los tres en producción en DailyBot. Mi flujo de trabajo: Cursor para funcionalidades nuevas, Copilot para coding del día a día, Claude Code cuando estoy atascado en arquitectura o debuggeando algo raro. Entender cuándo cambiar de herramienta ahorra horas.

---

## El modelo mental: director, no codificador

La slide que quedó: **"Nuevo rol de los desarrolladores: orquestadores y supervisores."** No quería asustarlos. Quería reencuadrar. No escribes menos — decides más. Tú defines la dirección. Tú defines el problema. El agente escribe el primer borrador, ejecuta las pruebas, sugiere correcciones. Tú revisas, corriges y sigues.

En un hackathon, eso significa más iteraciones en menos tiempo. Más ideas probadas. Más prototipos que realmente funcionan. Ya no compites con el equipo que codifica más rápido. Compites con el equipo que toma las mejores decisiones bajo presión.

Así se ve esto en la práctica:

1. **Tú defines el objetivo** — "Construir una funcionalidad de búsqueda que filtre por tags y rango de fechas"
2. **El agente genera el código** — Componentes, rutas API, queries de base de datos
3. **Tú revisas y diriges** — "Esto funciona pero la lógica del filtro de fecha está mal. Arréglalo."
4. **El agente itera** — Reescribe el filtro, ejecuta tests, te muestra el diff
5. **Tú haces merge y sigues** — La funcionalidad está lista en 20 minutos en lugar de 2 horas

Ese efecto multiplicador es real. Pero solo funciona si sabes cómo se ve "bueno". Todavía necesitas entender arquitectura, flujo de datos, casos borde. El agente no puede hacer esa parte por ti.

---

## Tips prácticos desde producción

Terminé con lecciones que había aprendido enviando funcionalidades con IA en DailyBot — cosas que desearía que alguien me hubiera dicho cuando empecé:

**Empieza con el happy path.** Deja que el agente genere la versión directa primero. Iterarás más rápido que intentando describir cada caso borde por adelantado.

**Revisa antes de ejecutar.** El código generado por IA puede verse bien y comportarse mal. Léelo. Entiéndelo. Si no puedes explicar qué hace, no lo envíes.

**Usa tests como barandas.** Escribe un test que falle que describa lo que quieres. Deja que el agente implemente el fix. Si el test pasa, probablemente estés bien. Esto funciona especialmente bien con Copilot y Cursor.

**Mantén el contexto ajustado.** Los agentes de IA funcionan mejor con prompts enfocados. "Arregla el bug de autenticación" es vago. "El token JWT expira muy temprano — aumenta el TTL a 7 días" obtiene mejores resultados.

**Aprende a debuggear errores de IA.** El agente escribirá código que compila pero no hace lo que querías. Debuggear esa brecha — entre lo que pediste y lo que obtuviste — es una nueva habilidad. Practícala.

---

## Recursos para Participantes del Hackathon

Terminé con algunos enlaces para que pudieran empezar de inmediato:

- **Cursor** — [cursor.com](https://cursor.com) — Prueba el Composer para ediciones multi-archivo. Describe una funcionalidad en lenguaje natural, obtén código.
- **GitHub Copilot** — [github.com/features/copilot](https://github.com/features/copilot) — Si usas VS Code o JetBrains, actívalo. Se paga solo en la primera hora.
- **Claude** — [claude.ai](https://claude.ai) — Úsalo para arquitectura, diseño de APIs o debugging. Pega tu error, pide una solución.
- **Slides** — [Ver la presentación completa](https://docs.google.com/presentation/d/1cWPCrsKVjDlc3dquELywXl5QvM1lLdXJLi4ZGbiTp4w/edit) — Todos los conceptos y ejemplos del workshop.

---

## Memorias del Workshop

<figure>
<div class="grid grid-cols-2 gap-4 not-prose">
  <img src="/images/blog/posts/ai-and-the-new-era-of-programming-open-tech/orchestrator-flute.webp" alt="Ilustración de humano orquestando agentes de IA — programador como director" width="600" height="400" class="rounded-xl object-cover w-full aspect-[4/3]" loading="lazy" />
  <img src="/images/blog/posts/ai-and-the-new-era-of-programming-open-tech/orchestrators-slide.webp" alt="Slide: Nuevo rol de los desarrolladores — orquestadores y supervisores" width="600" height="400" class="rounded-xl object-cover w-full aspect-[4/3]" loading="lazy" />
</div>
<figcaption>Dos slides del workshop Vibe Coding e IA — la metáfora del director y la tesis central sobre el nuevo rol del desarrollador.</figcaption>
</figure>

---

[Ver slides](https://docs.google.com/presentation/d/1cWPCrsKVjDlc3dquELywXl5QvM1lLdXJLi4ZGbiTp4w/edit)

Sigamos construyendo.
