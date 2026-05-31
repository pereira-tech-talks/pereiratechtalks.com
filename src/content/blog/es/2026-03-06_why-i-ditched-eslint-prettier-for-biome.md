---
title: "Por qué abandoné ESLint + Prettier por Biome"
description: "Tras años persiguiendo upgrades de ESLint y conflictos con Prettier, me pasé a Biome: un config, un binario y menos fricción en cada release."
pubDate: '2026-03-06'
heroImage: '/images/blog/posts/why-i-ditched-eslint-prettier-for-biome/hero.webp'
heroLayout: 'side-by-side'
tags: ["tech", "web-development", "javascript", "astro"]
keywords: ["reemplazar ESLint y Prettier por Biome", "qué es Biome linter formatter", "Biome vs ESLint Prettier comparación", "cómo configurar Biome en proyecto JavaScript", "linter y formatter todo en uno", "migrar de ESLint a Biome", "Biome para proyectos TypeScript Astro"]
---

Actualicé las versiones de ESLint y Prettier, corrí `npm install` y vi cómo se rompía el proyecto. De nuevo. Ya iba por la tercera en pocos meses.

Cada vez que tocaba hacer upgrade de ESLint era el mismo ritual: correr el comando y rezar para que no se rompiera nada. En el mejor de los casos me tocaba refactorizar tipos, ajustar formato y retocar varias partes del código. En el peor — y pasaba seguido — había incompatibilidades con otras librerías que dependían de la versión anterior, y terminaba horas haciendo upgrades en cascada hasta que todo volvía a funcionar. Si alguna vez corriste `apt upgrade` en Ubuntu o Arch y te quedaste mirando la terminal rezando para que no se dañara el grub de arranque otra vez, sabes exactamente de qué sensación hablo.

Ese fue el momento en que empecé a buscar alternativas de verdad.

---

## Los años en que funcionó

Quiero ser justo. ESLint y Prettier funcionan bien juntos — y siguen funcionando. Los usé en múltiples proyectos — el sitio de [Pereira Tech Talks](https://www.pereiratechtalks.org/), proyectos personales, proyectos de trabajo en [DailyBot](https://www.dailybot.com). Configuración única, olvidarse del tema. Ejecuta al guardar, ejecuta en CI. El código sale con formato consistente. Imports ordenados. Punto y coma donde se espera.

Muchos de mis proyectos todavía los usan — migrar un proyecto existente tiene su costo y no siempre vale la pena. Pero en cada proyecto nuevo, Biome ya es mi primera opción por defecto.

Lo que cambió no fue que las herramientas dejaran de servir. Lo que cambió es que el ecosistema alrededor de ellas se volvió complicado de una manera que hacía que cada actualización se sintiera como una negociación.

En algún momento tenía un setup en VS Code con ESLint y Prettier configurados como formateadores. No me di cuenta del problema hasta que noté que mis archivos parpadeaban al guardar. ESLint ejecutaba, reformateaba el código de una manera. Prettier ejecutaba, lo reformateaba de vuelta. O a veces al revés. El archivo saltaba visiblemente — podías ver cómo la indentación cambiaba y cambiaba de vuelta en menos de un segundo. Pensé que era un bug de mi IDE antes de darme cuenta de que eran dos herramientas con opiniones peleando por el mismo texto.

La solución era `eslint-config-prettier` — un paquete que deshabilita todas las reglas de formato de ESLint que se superponen con Prettier. Un paquete que existe únicamente porque dos herramientas tienen opiniones superpuestas y a una hay que decirle que se calle. Lo instalas, pones `"prettier"` al final del array `extends` de ESLint, configuras VS Code para usar solo Prettier como formateador al guardar. Tres pasos para resolver un problema que no debería existir.

Funcionaba. Pero cargabas ese conocimiento en tu cabeza para siempre — el orden exacto, la entrada exacta de configuración, el ajuste exacto de VS Code. Cambia algo y la pelea volvía a empezar.

---

## La colección de archivos de configuración

Esto es lo que un setup real de ESLint + Prettier + TypeScript requiere en la práctica:

- `.eslintrc.js` (o `.json`, o `.yml`, o `.cjs` — escoge el que prefieras)
- `.prettierrc` (o `.prettierrc.json`, o `.prettierrc.js`)
- `.eslintignore`
- `.prettierignore`
- `eslint-config-prettier` — para deshabilitar las ~100 reglas de formato de ESLint que pelean con Prettier
- `eslint-plugin-prettier` — si quieres que los errores de Prettier aparezcan como errores de ESLint
- `@typescript-eslint/parser` y `@typescript-eslint/eslint-plugin` — para soporte de TypeScript

Ejecuta `npm install` en un proyecto nuevo. Mira cómo más de cien paquetes aterrizan en tu `node_modules`. Solo para linting y formato.

Y luego está el problema del orden de configuración — los overrides de Prettier deben ir al *final* de tu config de ESLint, de lo contrario las reglas de formato pelean entre sí. Equivócate en el orden y vuelves al parpadeo que mencioné antes. He depurado ese problema exacto más veces de las que me gustaría admitir.

---

## La migración a flat config

Con [ESLint v9](https://eslint.org/blog/2024/04/eslint-v9.0.0-released/) llegó "flat config" — un nuevo formato de configuración que reemplazaba el sistema antiguo de `.eslintrc`.

En teoría era más limpio. Un solo archivo `eslint.config.js`, nativo de JavaScript, imports explícitos. En la práctica — el propio equipo de ESLint publicó una retrospectiva sobre el lanzamiento de v9, y esto es lo que escribieron:

> El sentimiento inicial en línea fue mayoritariamente negativo, con usuarios diciendo que [el lanzamiento] 'no estaba listo', 'no funcionaba', o incluso que 'rompió el ecosistema'. Algunos postergaron la actualización mientras otros consideraron cambiar de herramienta.

Eso es del propio [post-mortem del equipo de ESLint](https://eslint.org/blog/2025/05/eslint-v9.0.0-retrospective/). Lo escribieron sobre su propio lanzamiento.

¿Qué salió mal? La nueva sintaxis de flat config era — usando la palabra amable — verbosa. Los plugins de repente necesitaban exponer sus configuraciones de manera diferente, y no todos lo hacían igual. Algunos exportaban un objeto. Algunos un array. Algunos no se habían actualizado, así que necesitabas `FlatCompat` de `@eslint/eslintrc` solo para cargarlos. Los usuarios se topaban con errores de tipo `TypeError: context.getScope is not a function` para plugins que no se habían actualizado.

Las discusiones en GitHub lo decían todo. Una preguntaba [por qué había 7+ formas distintas de usar plugins](https://github.com/eslint/eslint/discussions/20500) con flat config. Otra era [el propio equipo de ESLint pidiendo feedback](https://github.com/eslint/eslint/discussions/18456) sobre la migración — y lo que recibieron no fue bonito. El [issue de tracking del ecosistema](https://github.com/eslint/eslint/issues/18093) mostraba cuántos plugins seguían sin actualizarse meses después.

La respuesta eventual del equipo fue traer `extends` de vuelta. A través de `defineConfig()`. Una función que habían eliminado porque era "innecesaria en flat config". La eliminaron, recibieron retroalimentación de usuarios, y la volvieron a agregar. Esa secuencia dice bastante sobre cómo fue el rollout.

Y luego llegó la siguiente versión mayor. El sistema antiguo de `.eslintrc` — el que todos habían usado durante años — fue eliminado completamente. Sin aviso gradual, sin periodo de gracia. Si no habías migrado todavía, ahora no tenías opción.

Cada proyecto que tocaba tenía alguna versión de este problema. Un plugin que no estaba actualizado. Una configuración compartida que necesitaba ser envuelta manualmente en `FlatCompat`. Horas de depuración, para un resultado que se veía idéntico a lo que tenía antes.

---

## Llega Biome

[Biome](https://biomejs.dev/) empezó como un fork de [Rome](https://github.com/rome/tools) — una herramienta que intentó ser un toolchain unificado para JavaScript, se quedó en silencio por un tiempo, y luego regresó con un enfoque más claro: linting y formato, bien hecho, en una sola herramienta.

Escrito en Rust. Un solo binario. Un archivo de configuración.

Era escéptico. "Otra herramienta de linting" no es un argumento que convence fácilmente después de haber pagado los costos de migración de ESLint. Pero lo que me hizo parar fue la velocidad. La primera vez que corrí Biome en un proyecto grande, pensé que había fallado silenciosamente — terminó tan rápido que no parecía posible que hubiera hecho algo. Pero sí lo hizo. Los [benchmarks](https://github.com/biomejs/biome/blob/main/benchmark/README.md) hablan de diferencias de entre 10x y 50x contra ESLint y Prettier. Tus números van a variar, pero el orden de magnitud es real. La razón de fondo: Biome parsea el código una sola vez y reutiliza el AST para linting y formato. ESLint y Prettier parsean por separado, y luego a veces pelean por el resultado.

Lo probé primero en [pereiratechtalks.org](https://pereiratechtalks.org/) — que yo mismo había montado con ESLint + Prettier. La migración arranca con dos comandos:

```bash
biome migrate eslint
biome migrate prettier
```

Esos dos comandos leen tus configuraciones existentes y generan un `biome.json` equivalente. A partir de ahí, el trabajo es eliminar lo viejo. En el caso de Pereira Tech Talks, borré cuatro archivos de configuración — `.eslintrc.js`, `.prettierrc.js`, `.eslintignore`, `.prettierignore` — y desinstalé los paquetes de ESLint y Prettier. También tuve que actualizar las extensiones de VS Code (fuera ESLint y Prettier, dentro Biome), simplificar el pipeline de CI que antes tenía pasos separados para lint y formato, y ajustar el `CONTRIBUTING.md` donde decía `npm run eslint:fix` y `npm run prettier:fix` por un solo `npm run biome:fix`. El [commit completo](https://github.com/pereira-tech-talks/pereiratechtalks.org/commit/114c473b) está en GitHub si quieres ver exactamente qué cambió.

Tomó alrededor de una hora — principalmente porque quería entender lo que estaba haciendo en lugar de solo ejecutar comandos a ciegas. Me encantó. Cuando arranqué xergioalex.com desde cero, ni me lo pensé — Biome desde el día uno.

Esa limpieza — no quiero exagerarla — se sintió bien de una manera que me sorprendió. No porque las herramientas viejas fueran malas, sino porque la acumulación era visible. La podías ver en el conteo de paquetes, en el listado del directorio raíz, en el tiempo de instalación en CI. Eliminarla se sintió como limpiar un escritorio que había estado acumulando cosas durante años.

---

## Lo que estoy usando en la práctica

Este es el `biome.json` de xergioalex.com, el sitio donde estás leyendo esto:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.5/schema.json",
  "linter": {
    "enabled": true,
    "rules": {
      "suspicious": {
        "noUnknownAtRules": "off",
        "noExplicitAny": "off"
      },
      "complexity": {
        "noBannedTypes": "off"
      },
      "correctness": {
        "noUnusedImports": "off",
        "noUnusedVariables": "off"
      },
      "style": {
        "useImportType": "off",
        "useConst": "off"
      }
    }
  },
  "files": {
    "ignoreUnknown": false,
    "includes": [
      "src/**",
      "!**/.astro",
      "!**/docs",
      "!**/dist",
      "!**/node_modules",
      "!**/public",
      "!**/.github"
    ]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "es5"
    }
  },
  "css": {
    "parser": {
      "tailwindDirectives": true
    }
  }
}
```

Cincuenta líneas. Eso es todo. Lo único que me toca atender de vez en cuando es actualizar la versión del `$schema` cuando sale una nueva release — a veces implica algún ajuste menor en reglas, pero nada que tome más de cinco minutos. Comparado con lo que era un upgrade de ESLint, es casi recreativo.

Sin archivo ignore separado — `includes` lo maneja. Sin configuración de formato separada — está ahí mismo en el mismo archivo. Soporte de CSS incluido, con las directivas de Tailwind configuradas a través del flag `tailwindDirectives: true` del parser.

Los overrides que configuré: `noExplicitAny: "off"` porque tengo algo de código de interoperabilidad con TypeScript donde `any` es realmente el tipo correcto, `noUnusedImports: "off"` y `noUnusedVariables: "off"` porque esas reglas son útiles en CI pero generan ruido durante el desarrollo activo — estás en medio de un refactor, comentas algo, y de repente hay rojo por todas partes. Todo lo demás corre con los defaults de Biome.

Tres scripts de npm:

```json
"biome:check": "biome check",
"biome:fix": "biome check --write",
"biome:fix:unsafe": "biome check --write --unsafe"
```

`biome check` ejecuta el linter y el formatter juntos y reporta las violaciones. `--write` aplica las correcciones seguras automáticamente. `--unsafe` aplica todo, incluyendo transformaciones que podrían cambiar el comportamiento — ese lo uso raramente y con `git diff` abierto.

Un paquete instalado. Un archivo de configuración. Tres comandos. Antes tenía esto:

```json
"eslint:check": "eslint .",
"eslint:fix": "eslint . --fix",
"prettier:check": "prettier --check .",
"prettier:fix": "prettier --write ."
```

Cuatro scripts, dos herramientas, dos configuraciones separadas, dos pasos en CI. Ahora es uno de cada uno.

---

## Lo que no puede hacer

No voy a pretender que Biome reemplaza ESLint función por función. No lo hace.

ESLint lleva más de una década. Su ecosistema tiene miles de reglas construidas por la comunidad. `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`, `eslint-plugin-security`, `eslint-plugin-unicorn` — plugins especializados para cada caso de uso. Biome tiene cientos de reglas integradas — el número sube con cada versión — y un sistema de plugins (GritQL) que todavía está madurando.

El soporte de Astro y Svelte es parcial. Biome maneja el JavaScript y TypeScript dentro de esos archivos, pero no la sintaxis de plantilla — los bloques `<template>` de Svelte, las directivas específicas de Astro. Eso está en el roadmap pero aún no está ahí. Para este sitio, eso es aceptable — el código TypeScript es donde las reglas de lint importantes necesitan ejecutarse.

El linting consciente de tipos — creo que esta es el área donde la cobertura de Biome importa más y es más difícil de cuantificar. Reglas como `noFloatingPromises` funcionan — Biome hace inferencia de tipos por su cuenta, sin ejecutar el compilador de TypeScript, lo cual es un enfoque fundamentalmente diferente a lo que hace typescript-eslint. La cobertura no es del 100%; hay casos extremos que typescript-eslint captura y Biome todavía no. Si esa brecha importa depende de tu proyecto. Para mí, las reglas que realmente uso funcionan, y la diferencia de rendimiento — sin invocar el compilador de TypeScript en el proceso de linting — vale la pena.

HTML, Markdown y SCSS no están soportados todavía.

Honestamente — si tienes un proyecto que depende mucho de reglas específicas de `eslint-plugin-react-hooks`, o de jsx-a11y para enforcement de accesibilidad a nivel de linting, quizás necesitas un setup híbrido por un tiempo. Biome para formato y la mayoría del linting, ESLint para las reglas específicas que necesitas. Es más configuración de la que quiero, pero es mejor que manejar todo el stack de ESLint.

Para este sitio, nada de eso es un problema. Biome cubre todo lo que necesito.

---

## Hacia dónde va

Biome 2.0 llegó con dos adiciones grandes: plugins (escribe reglas de lint personalizadas en GritQL) e inferencia de tipos (reglas de lint que entienden los tipos de TypeScript sin ejecutar `tsc`).

El trabajo de inferencia de tipos fue [patrocinado por Vercel](https://biomejs.dev/blog/vercel-partners-biome-type-inference/). Creo que eso dice algo. Las empresas grandes de infraestructura no patrocinan proyectos de linting por caridad — lo hacen porque las herramientas lentas les cuestan minutos de CI y tiempo de desarrollo, y Biome es significativamente más rápido a escala.

Y no es solo patrocinio. [Next.js desde la versión 15.5](https://nextjs.org/blog/next-15-5) ofrece Biome como opción oficial al crear un proyecto nuevo con `create-next-app` — al mismo nivel que ESLint. Y en [Next.js 16](https://nextjs.org/docs/app/guides/upgrading/version-16) fueron un paso más allá: eliminaron `next lint` por completo. Ya no hay linter integrado. El framework te dice: usa ESLint o Biome directamente, tú decides.

Que el framework de React más usado del mundo le dé ese nivel de protagonismo a Biome dice bastante sobre hacia dónde se está moviendo el ecosistema.

El [roadmap](https://biomejs.dev/blog/roadmap-2026/) incluye mejor soporte para Astro/Svelte/Vue — linting en las secciones de template/markup, no solo en los bloques de script. Reglas de lint cruzadas entre JavaScript y CSS. Mejor integración con editores.

Nada de eso está completamente disponible todavía. Pero la dirección es lo que me importa: menos herramientas haciendo más, con menos configuración que mantener.

---

## Por qué no voy a volver

La decisión no fue solo por la velocidad. La velocidad es real — mi `biome:check` local corre en menos de un segundo, siempre. Pero honestamente, podría vivir con un linter más lento si la configuración fuera estable.

Lo que me quebró de ESLint fue el costo de mantenimiento. Cada versión mayor se sentía como un proyecto de migración. La de flat config me tomó horas. Después eliminaron el formato antiguo por completo, y todos los que seguían ahí tuvieron que migrar, quisieran o no. La danza del conflicto con Prettier — que un paquete exista únicamente para que una herramienta deje de pelear con otra ya te dice todo lo que necesitas saber.

Biome no tiene ese problema. Una configuración. Una herramienta. Cuando actualizo Biome, actualizo la versión del `$schema` en `biome.json` y ejecuto `biome migrate`. Maneja las diferencias de configuración automáticamente.

Sé que las cosas cambian — Biome puede tener su propia migración dolorosa algún día. Espero que la manejen mejor de lo que ESLint manejó la suya. Pero ahora mismo, la superficie de mantenimiento es mucho más pequeña, y quiero mantenerla así.

---

## Recursos

- [Biome.js](https://biomejs.dev/) — Documentación y guía de inicio rápido
- [Post de lanzamiento de Biome v2](https://biomejs.dev/blog/biome-v2/) — Qué llegó en 2.0 (plugins, inferencia de tipos)
- [Migrar de ESLint y Prettier a Biome](https://biomejs.dev/guides/migrate-eslint-prettier/) — Guía de migración oficial
- [Retrospectiva de ESLint sobre flat config](https://eslint.org/blog/2025/05/eslint-v9.0.0-retrospective/) — Vale la pena leerlo si quieres entender qué salió mal
- [Benchmarks de Biome](https://github.com/biomejs/biome/blob/main/benchmark/README.md) — De dónde vienen los números

A seguir construyendo.
