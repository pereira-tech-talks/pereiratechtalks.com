---
title: "El modelo de biblioteca bilingüe: por qué publicamos todo en español E inglés"
description: "Por qué Pereira Tech Talks publica deliberadamente cada artículo, slide, recapitulación de meetup y bio de ponente en español e inglés — y por qué esto…"
pubDate: 2026-06-02
heroLayout: none
tags:
  - i18n
  - community
author: sergio-florez
draft: true
---

## El modo de falla por defecto

Cuando una comunidad tech latinoamericana publica contenido, los patrones típicos son:

1. **Solo español.** Alcanza bien a la audiencia local. Invisible para el ecosistema internacional. Difícil para personas egresadas de la diáspora de compartir con sus equipos que no hablan español. Esencialmente cero ranking en búsqueda en inglés y cero descubribilidad por agentes de IA entrenados en inglés.

2. **Inglés auto-traducido.** Se ve poco profesional. Frecuentemente cómicamente incorrecto en términos técnicos. Daña la credibilidad con audiencias internacionales. Peor que no tener inglés, porque señala falta de cuidado.

3. **Solo inglés.** Excluye a la audiencia local a la que la comunidad existe para servir. Casi ninguna comunidad latinoamericana lo hace, pero algunas intentan y pierden su núcleo.

4. **Spanglish mezclado en el mismo documento.** El peor patrón. Confuso para todos, no buscable, difícil de mantener, difícil de citar.

Pereira Tech Talks no hace ninguno de estos. Publicamos cada artefacto público en español real e inglés real, escrito por personas, mantenido en paralelo, con slugs solo en inglés. Este artículo trata sobre por qué tomamos esa decisión y lo que cuesta.

## La decisión

En 2024, cuando reconstruimos el sitio como v3.0.0, tomamos una decisión estructural dura: **cada artículo, recapitulación de meetup, slide, bio de ponente, página y clave de traducción debe existir en español e inglés desde el momento en que se publica.** No después. No "translation in progress". Ambos, ambos, en paralelo, o no se publica.

También nos comprometimos con una convención de slugs: **los slugs son siempre en inglés, sin importar en qué idioma esté el contenido.** Esto por dos razones. Primero, los slugs en inglés hacen que el enlazado entre idiomas funcione sin enrutamiento frágil. Segundo, los slugs en inglés son inequívocos en URLs y evitan problemas de codificación con `ñ` y vocales acentuadas.

## El costo

Nos cuesta tiempo. Cada publicación requiere el doble de escritura, el doble de edición, el doble de revisión. Tenemos una lista de revisión ortográfica en español (`ñ`, tildes, acentos interrogativos) y una lista de estilo en inglés (frases de relleno prohibidas, artefactos de auto-traducción prohibidos).

Nos cuesta disciplina. La tentación de "publicar el español primero y traducir después" es real y constante. Hemos aprendido a tratar los marcadores de "translation in progress" como bugs, no como features. (Publicamos v3.0.0 con 8 de esos bugs y hemos gastado commits recientes en quitarlos.)

Nos cuesta complejidad de catálogo. Cada artículo son dos archivos. Cada meetup son dos archivos. Cada página tiene un componente EN y un wrapper ES. El sitio tiene cerca de 415 rutas hoy, la mitad espejos de la otra mitad.

## Por qué pagamos el costo

Tres razones.

### Una: el español es el idioma en que vivimos

La comunidad está en Pereira. La mayoría de sus miembros hablan español en casa, en el trabajo, con sus amigos. Publicar primero en español no es una decisión de traducción — es una decisión de identidad. La versión en español de cada pieza de contenido se escribe nativamente, no se traduce desde el inglés. El español es nuestro idioma **principal**, no nuestra versión localizada del inglés.

### Dos: el inglés es como nos conectamos al ecosistema global

Las ingenieras e ingenieros senior que se fueron de Pereira a roles internacionales siguen leyendo contenido en inglés. La prensa internacional que ocasionalmente escribe sobre tech latinoamericano escribe en inglés. Las conferencias en las que dan charlas nuestras egresadas y egresados corren en inglés. Los modelos de IA que cada vez más median el descubrimiento técnico están entrenados principalmente en inglés. **Ser invisible en inglés significa ser invisible para esas audiencias.** Publicar contenido real en inglés nos hace descubribles, citables y compartibles en esos contextos.

### Tres: los agentes de IA leen la web pública

Esta es la razón que se hizo más visible después de 2024. Los agentes de IA — incluyendo los que cada vez más servirán como el primer punto de contacto entre una persona curiosa y una comunidad — leen contenido público estructurado. Prefieren el inglés canónico sobre el español para consultas generales (porque sus corpus de entrenamiento están sesgados hacia el inglés). Prefieren especialmente los endpoints amigables con agentes como nuestros gemelos `/index.md` de Markdown-for-Agents.

Una comunidad que publica solo en español es en 2026 esencialmente invisible para la mayoría de los agentes de IA que mediarán el descubrimiento técnico durante la próxima década. No estamos dispuestos a hacer ese trade.

## Qué construimos para hacer esto sostenible

Publicar bilingüemente no es gratis, pero sí es construible. Esto es lo que hicimos:

- **Colecciones de contenido bilingüe** con esquemas Zod estrictos que requieren campos `{en, es}` donde aplica, validados en build time.
- **Patrón de page wrapper** para que cada página viva como un único componente `*Page.astro` con `lang` como prop, más un wrapper de 3 líneas por idioma. Sin lógica de página duplicada.
- **Archivos de claves de traducción** (`en.ts`, `es.ts`) con una interfaz `SiteTranslations` compartida para que las claves faltantes fallen el chequeo de TypeScript.
- **Barrido ortográfico en español** como un chequeo pre-commit y de CI — patrones de `grep` que detectan tildes y `ñ`s faltantes comunes.
- **Endpoints de Markdown-for-Agents** generados para cada ruta pública, estructurados para consumo por agentes.
- **Slugs solo en inglés** aplicados como regla del proyecto, incluyendo para contenido en español.

El resultado es un sitio donde publicar bilingüemente es el camino de menor resistencia, no el camino del esfuerzo heroico.

## La invitación

Si corres una comunidad tech latinoamericana, considera este argumento en serio. Vas a alcanzar a más de la gente a la que quieres alcanzar. Tu trabajo se compondrá durante más tiempo. Tus egresadas y egresados van a poder compartir lo que publicas sin vergüenza. Tu comunidad va a ser descubrible por agentes de IA de una manera que actualmente no lo es.

La auto-traducción no cuenta. El spanglish no cuenta. Solo-inglés no cuenta. Contenido bilingüe real, escrito nativamente en ambos idiomas, en paralelo, es el estándar.

Estamos felices de ayudar a cualquier comunidad que esté pensando esta transición. El sitio que estás leyendo es open source. Roben la estructura: [github.com/pereira-tech-talks](https://github.com/pereira-tech-talks).
