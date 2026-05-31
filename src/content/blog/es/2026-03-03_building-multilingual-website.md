---
title: 'Cómo Construí un Sitio Web Multilingüe con Astro'
description: 'Diseñar un sitio Astro multilingüe desde cero: traducciones tipadas, patrón Page Wrapper y escalar idiomas sin reescribir componentes.'
pubDate: '2026-03-03'
heroImage: '/images/blog/posts/building-multilingual-website/hero.webp'
heroLayout: 'side-by-side'
tags: ['tech', 'web-development']
keywords: ["sitio web multilingüe con Astro", "cómo agregar múltiples idiomas en Astro", "i18n con Astro sin plugins", "sistema de traducciones tipado en TypeScript", "arquitectura multilingüe para sitios estáticos", "inglés y español con Astro", "Page Wrapper pattern Astro i18n"]
series: "building-xergioalex"
seriesOrder: 6
---

Hay un hilo que ha estado presente en cada capítulo de esta serie, mencionado frecuentemente pero nunca con su propia historia: este sitio habla dos idiomas.

Cada página, cada artículo del blog, cada botón, cada enlace de navegación — todo existe tanto en inglés como en español. No como algo que se agregó al final como parche, sino como una decisión arquitectónica de primera clase que moldeó todo el código desde el día uno.

Esta es esa historia.

---

## Por Qué Dos Idiomas

La mayoría de los sitios personales son monolingües. Y honestamente, tiene sentido — construir un sitio personal ya es una inversión significativa de tiempo. ¿Para qué duplicar el trabajo?

Para mí, la respuesta fue inmediata y personal. El inglés es el idioma de la comunidad tech global. Es el idioma de la documentación, el open source, las conferencias, y la audiencia que se interesa por las mismas cosas que me interesan: construir productos, escalar equipos y sacar código a producción. Si iba a escribir sobre estos temas, el inglés no era negociable.

Pero el español es el idioma con el que crecí. Es el idioma de mi familia, mis amigos, y la comunidad tech latinoamericana que ha sido parte de mi carrera desde el principio — desde organizar Pereira Tech Talks hasta construir DailyBot con un equipo distribuido por Colombia y más allá. Cuando pienso para quién estoy construyendo, la respuesta no es solo el mundo angloparlante. También son las personas con las que he compartido escenarios, los desarrolladores que asistieron a mis charlas en español, y los amigos que leerían mi blog si hablara su idioma.

Así que la pregunta nunca fue _si_ soportar ambos idiomas. Fue _cómo_ — y cómo hacerlo sin convertir el código en una pesadilla de mantenimiento.

---

## El Idioma Como Configuración

La base de todo el sistema multilingüe es un solo archivo de TypeScript: `src/lib/i18n.ts`. Son 160 líneas, y contiene toda la configuración de idiomas que el sitio necesita.

Opté por un union type de TypeScript en lugar de un enum:

```typescript
// src/lib/i18n.ts
export type Language = 'en' | 'es';
```

¿Por qué un union? Porque es más liviano, más componible, y extenderlo es un cambio de un solo carácter. Agregar portugués en el futuro es literalmente:

```typescript
export type Language = 'en' | 'es' | 'pt';
```

TypeScript impone esto en tiempo de compilación en todo el código. Cada función que acepta un parámetro `Language` inmediatamente requerirá manejar el nuevo valor. El compilador se convierte en el checklist de migración.

Todos los metadatos de idioma viven en un solo registro:

```typescript
export interface LanguageConfig {
  code: Language;
  name: string;           // Nombre en inglés
  nativeName: string;     // Nombre nativo (para el selector de idiomas)
  dateLocale: string;     // Locale BCP 47 para formato de fechas
  ogLocale: string;       // Locale de OpenGraph para redes sociales
  flag: string;           // Emoji de bandera para la UI
  urlPrefix: string;      // Prefijo de URL
}

export const LANGUAGES: Record<Language, LanguageConfig> = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dateLocale: 'en-US',
    ogLocale: 'en_US',
    flag: '🇬🇧',
    urlPrefix: '',
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    dateLocale: 'es-ES',
    ogLocale: 'es_ES',
    flag: '🇪🇸',
    urlPrefix: '/es',
  },
};
```

Ocho campos por idioma. Formato de fechas, etiquetas de Open Graph, ruteo de URLs, el selector de idiomas — todo viene de este único objeto. No quería constantes dispersas por varios archivos ni strings mágicos escondidos en templates.

La estrategia de prefijos de URL vale la pena mencionarla explícitamente. El idioma por defecto (`en`) tiene un prefijo vacío, lo que significa que las URLs en inglés son limpias: `/about`, `/blog/my-post`, `/contact`. El español tiene `/es` como prefijo: `/es/about`, `/es/blog/my-post`, `/es/contact`. Este es un patrón común para sitios multilingües, y el ruteo basado en archivos de Astro lo hace natural.

El mismo archivo también exporta un puñado de funciones utilitarias que el resto del código usa en todos lados:

```typescript
getUrlPrefix(lang)             // '' o '/es'
getLocalizedUrl(path, lang)    // Combina prefijo + ruta
getAlternateUrls(currentPath)  // Todas las variantes de idioma de una URL
getLangFromUrl(pathname)        // Detecta idioma desde la URL
stripLangPrefix(path)           // Remueve prefijo para obtener la ruta base
getDateLocale(lang)             // 'en-US' o 'es-ES'
getOGLocale(lang)               // 'en_US' o 'es_ES'
```

Cada componente usa estas funciones en lugar de construir URLs o detectar idiomas manualmente. Si la estrategia de URLs cambia, o si se agrega un nuevo idioma, solo este archivo cambia. Todo lo demás se adapta automáticamente.

---

## El Patrón Page Wrapper

Este es el problema con los sitios multilingües que usan ruteo basado en archivos: si tienes 12 páginas y 2 idiomas, necesitas 24 archivos. Con 3 idiomas, 36 archivos. Cada archivo contiene toda la lógica de la página — layout, traducciones, obtención de datos, markup del template. Cambias cómo funciona la página de About, y la actualizas en 2 lugares. O en 3. O en 5. Esto escala mal y se rompe fácilmente.

La solución que construí es lo que llamo el **patrón Page Wrapper**. La idea es simple: separar el ruteo de la lógica.

Los wrappers de ruteo viven en `src/pages/` y son ultra-delgados — tres líneas de código:

```astro
---
// src/pages/about.astro (Inglés)
import AboutPage from '@/components/pages/AboutPage.astro';
---
<AboutPage lang="en" />
```

```astro
---
// src/pages/es/about.astro (Español)
import AboutPage from '@/components/pages/AboutPage.astro';
---
<AboutPage lang="es" />
```

Eso es todo. El único trabajo del wrapper es existir en la ruta URL correcta y pasar el string literal de `lang` al componente compartido.

La lógica real de la página vive en `src/components/pages/AboutPage.astro`, y maneja todo:

```astro
---
// src/components/pages/AboutPage.astro
import MainLayout from '@/layouts/MainLayout.astro';
import type { Language } from '@/lib/i18n';
import { getUrlPrefix } from '@/lib/i18n';
import { getTranslations } from '@/lib/translations';

interface Props {
  lang: Language;
}

const { lang } = Astro.props;
const t = getTranslations(lang);
const prefix = getUrlPrefix(lang);
---

<MainLayout lang={lang} title={t.aboutPage.title} description={t.aboutPage.description}>
  <h1>{t.aboutPage.title}</h1>
  <p>{t.aboutPage.bioText}</p>
  <a href={`${prefix}/cv`}>{t.aboutPage.ctaCv}</a>
</MainLayout>
```

El componente compartido importa el layout, obtiene las traducciones para el idioma actual, construye URLs localizadas y renderiza la página completa. Un archivo, toda la lógica. Los wrappers son simplemente stubs de ruteo.

Tengo 17 componentes de página compartidos y 23 wrappers de ruteo. ¿Agregar portugués? Once archivos nuevos de tres líneas, cero cambios en componentes. Un bug fix ocurre en un archivo. Una nueva funcionalidad aparece en todos los idiomas automáticamente.

---

## El Sistema de Traducciones

Detrás de `getTranslations(lang)` hay un sistema de traducciones estructurado y tipado que cubre cada pieza de texto visible para el usuario en todo el sitio.

La arquitectura son cuatro archivos:

```
src/lib/translations/
├── types.ts     # Interfaz SiteTranslations (480 líneas)
├── en.ts        # Traducciones en inglés (956 líneas)
├── es.ts        # Traducciones en español (967 líneas)
└── index.ts     # Barrel: función getTranslations() (52 líneas)
```

El corazón es `types.ts` — una interfaz de TypeScript de 480 líneas que define la forma completa de todas las traducciones:

```typescript
// src/lib/translations/types.ts (simplificado)
export interface SiteTranslations {
  siteTitle: string;
  siteTitleFull: string;
  siteDescription: string;

  nav: {
    home: string;
    blog: string;
    about: string;
    contact: string;
    // ... 12 claves de navegación
  };

  aboutPage: {
    title: string;
    subtitle: string;
    bioTitle: string;
    bioText: string;
    passions: PagePassion[];
    // ... 12 claves para la página About
  };

  // Strings dinámicos — funciones que aceptan parámetros
  readingTime: (minutes: number) => string;
  seriesChapter: (n: number) => string;
  resultsFound: (count: number) => string;
  pageOf: (current: number, total: number) => string;

  // ... cientos de claves más cubriendo cada página y componente
}
```

Cada archivo de locale (`en.ts`, `es.ts`) implementa esta interfaz. El compilador de TypeScript impone **paridad completa**. Si agrego una clave nueva a `types.ts` y solo la implemento en `en.ts`, el build falla con un error claro diciéndome que a `es.ts` le falta la clave. Ninguna clave se queda sin cubrir. Ninguna página se renderiza con una traducción faltante.

Una decisión de diseño de la que estoy particularmente orgulloso es el uso de **funciones para strings dinámicos**:

```typescript
// en.ts
readingTime: (minutes: number) => `${minutes} min read`,
resultsFound: (count: number) => `${count} results found`,
seriesChapterOf: (current: number, total: number) =>
  `Chapter ${current} of ${total}`,

// es.ts
readingTime: (minutes: number) => `${minutes} min de lectura`,
resultsFound: (count: number) => `${count} resultados encontrados`,
seriesChapterOf: (current: number, total: number) =>
  `Capítulo ${current} de ${total}`,
```

Estos no son template strings con placeholders que necesitan un paso de formateo separado. Son funciones regulares de TypeScript. El compilador verifica los tipos de los parámetros. El autocompletado funciona. No se necesita librería de formateo en runtime. La traducción _es_ el formateador.

El archivo barrel es mínimo:

```typescript
// src/lib/translations/index.ts
const translations: Record<Language, SiteTranslations> = { en, es };

export function getTranslations(lang: Language): SiteTranslations {
  return translations[lang] || translations.en;
}
```

Una función. Acceso tipado completo. Fallback a inglés si pasa algo inesperado. En la práctica, todo el sitio lo usa de la misma manera:

```typescript
const t = getTranslations(lang);
// Luego: t.nav.blog, t.aboutPage.title, t.readingTime(5)
```

El sistema actualmente tiene aproximadamente 960 claves de traducción organizadas en secciones estructuradas: metadatos del sitio, navegación, footer, hero, 11 secciones de la página principal, 10 secciones específicas de páginas (About, CV, DailyBot, Emprendedor, Tech Talks, Portafolio, Trading, Foodie, Hobbies, Contacto), búsqueda, blog, navegación de series, tags, y strings utilitarios.

---

## Contenido del Blog en Dos Idiomas

El blog usa Astro Content Collections con una estrategia de idioma simple pero efectiva: **separación de idiomas basada en directorios**.

```
src/content/blog/
├── en/
│   ├── 2026-01-22_building-xergioalex-website.md
│   ├── 2026-02-26_lighthouse-perfect-scores.mdx
│   ├── 2026-02-28_measuring-what-matters-free-analytics.md
│   ├── 2026-03-01_building-blog-without-backend.md
│   └── ... (57 posts en total)
└── es/
    ├── 2026-01-22_building-xergioalex-website.md
    ├── 2026-02-26_lighthouse-perfect-scores.mdx
    ├── 2026-02-28_measuring-what-matters-free-analytics.md
    ├── 2026-03-01_building-blog-without-backend.md
    └── ... (57 posts, paridad 1:1 con inglés)
```

El loader de Content Collections escanea todos los archivos en ambos directorios y genera IDs que codifican el idioma de manera natural:

```
en/2026-03-01_building-blog-without-backend
es/2026-03-01_building-blog-without-backend
```

Extraer el idioma de un post es una sola función:

```typescript
// src/lib/blog.ts
export function getPostLanguage(postId: string): string {
  const parts = postId.split('/');
  return parts.length > 1 ? parts[0] : 'en';
}
```

Sin consulta a base de datos. Sin detección en runtime. Sin parseo de URLs. El idioma está codificado en la ruta del archivo, y la función simplemente lo lee.

La extracción del slug quita el prefijo de idioma y el prefijo de fecha, así que ambas versiones — inglés y español — comparten el mismo slug limpio de URL:

```
EN: /blog/building-blog-without-backend/
ES: /es/blog/building-blog-without-backend/
```

Hay una regla obligatoria: **cada post en `en/` debe tener un post correspondiente en `es/`** con el mismo nombre de archivo, el mismo prefijo de fecha y el mismo slug. El `title`, `description` y cuerpo del contenido se traducen. El `pubDate`, `heroImage`, `tags` y bloques de código se preservan idénticamente.

Los tags son agnósticos al idioma. Tanto los posts en inglés como en español referencian los mismos identificadores de tags (`tech`, `web-development`, `portfolio`). Los nombres para mostrar se localizan a través del sistema de traducciones — `t.tagNames['tech']` devuelve "Tech" en inglés y la traducción apropiada en español. La colección de tags (`src/content/tags/`) es un solo conjunto de archivos compartido entre todos los idiomas.

Este diseño significa que agregar un post siempre es una operación de dos archivos: escribir la versión en inglés, traducirla al español. La estructura garantiza paridad. El build valida el esquema. Los tags funcionan en todos lados sin duplicación.

---

## La Capa de SEO

Nada de esto importa si los motores de búsqueda no pueden distinguir las páginas entre sí. La capa de SEO se encarga de eso automáticamente.

Cada página del sitio genera etiquetas hreflang a través de `BaseHead.astro`:

```astro
{alternateUrls.map((alt) => (
  <link rel="alternate" hreflang={alt.lang} href={alt.href} />
))}
<link rel="alternate" hreflang="x-default" href={defaultHref} />
```

Estas etiquetas le dicen a Google y otros motores de búsqueda: "Esta página existe en inglés en esta URL, y en español en esa otra URL." La etiqueta `x-default` apunta a la versión en inglés como fallback para idiomas no soportados.

Los datos vienen de `getAlternateUrls()`, que quita el prefijo de idioma de la URL actual y la reconstruye para cada idioma soportado:

```typescript
export function getAlternateUrls(currentPath: string): { lang: Language; url: string }[] {
  const basePath = stripLangPrefix(currentPath);
  return getSupportedLanguages().map((lang) => ({
    lang,
    url: getLocalizedUrl(basePath, lang),
  }));
}
```

Las etiquetas de Open Graph también son conscientes del idioma. Cada página establece `og:locale` con el locale del idioma actual y agrega `og:locale:alternate` para cada otro idioma. El sistema de búsqueda usa endpoints estáticos separados por idioma — `/api/posts-en.json` y `/api/posts-es.json` — para que la búsqueda del lado del cliente solo cargue el índice del idioma relevante. Sin desperdiciar ancho de banda en posts que el lector no puede leer.

Todo esto es automático. Agregar un tercer idioma no requiere tocar la capa de SEO en absoluto. Las funciones iteran sobre `getSupportedLanguages()`, que lee del mismo registro `LANGUAGES`. Agregas un idioma ahí, y las etiquetas hreflang, los locales de Open Graph y los endpoints de búsqueda se adaptan.

---

## Por Qué Solo Inglés y Español

Quiero ser explícito sobre esto, porque la arquitectura que acabo de describir podría soportar cinco idiomas, o diez, o veinte. Pero elegí dos. Y los elegí por razones que van más allá de la capacidad técnica.

El inglés y el español son los idiomas en los que hablo, pienso y escribo. No son solo idiomas a los que puedo traducir — son idiomas que puedo _escuchar_. Cuando leo un párrafo en inglés, sé si suena natural o si se lee como si lo hubiera traducido una máquina. Cuando leo un párrafo en español, noto una tilde faltante, una frase extraña, una referencia cultural que no termina de aterrizar.

Esto me importa más que la cobertura.

Conozco la tentación. La inteligencia artificial de hoy puede traducir texto a docenas de idiomas con calidad impresionante. Podría agregar portugués, francés, alemán, japonés, y tener un sitio accesible globalmente para la próxima semana. La arquitectura lo soportaría — al código literalmente no le importa. Un nuevo idioma es una entrada en la configuración, un archivo de traducciones y algunos archivos wrapper. Sin cambios en componentes.

Pero publicar en un idioma que no puedo verificar se siente como ceder el control sobre mi propia voz. Un sitio personal es _personal_. Cada palabra en él me representa. Si alguien lee la versión en portugués y encuentra una frase rara, un desajuste cultural, o una oración que simplemente no suena bien — mi nombre está ahí, y yo no tengo forma de detectarlo.

El inglés es el idioma de mi mundo profesional. El español es el idioma de mis raíces. Estas son las audiencias que conozco, las comunidades en las que he construido, y las personas para las que escribo. Dos idiomas, completamente auditados, completamente míos.

La arquitectura no juzga esta decisión. Está lista para tres idiomas, o cinco, o diez, cuando yo esté listo. Pero por ahora, la calidad importa más que la cantidad. Y prefiero tener dos idiomas bien hechos que cinco hechos casi-bien.

---

## Agregando un Nuevo Idioma: La Historia de Escalabilidad

A pesar de elegir dos idiomas, esto es lo que realmente tomaría agregar portugués: actualizar el union type (`'en' | 'es' | 'pt'`), agregar una entrada en `LANGUAGES`, crear un archivo de traducciones (~960 claves), agregar 11 wrappers de tres líneas, crear un directorio de contenido del blog, y agregar un endpoint de búsqueda. Seis pasos, cero cambios en componentes. Todo se adapta porque la frontera del idioma vive en la capa de datos, no en el código.

Eso es lo que hace que esta arquitectura valga el esfuerzo inicial — cada funcionalidad que agrego simplemente funciona en todos los idiomas.

---

## Todo Pasa en Tiempo de Build

Un patrón que quizás hayas notado a lo largo de este capítulo: no hay detección de idioma en runtime. Sin cookies guardando preferencias de idioma. Sin JavaScript cambiando el contenido de la página basándose en el header `Accept-Language` del navegador.

Cada variante de idioma es un archivo HTML estático separado y pre-renderizado. La página de About en inglés es un archivo. La página de About en español es otro archivo. Comparten el mismo código fuente del componente, pero producen HTML estático independiente en tiempo de build.

Esto tiene tres consecuencias:

1. **Cero costo de JavaScript por el idioma.** No hay librería en runtime cargando traducciones, no hay penalización de hidratación, no hay resolución de rutas del lado del cliente. La página carga como HTML estático en el idioma correcto.

2. **SEO perfecto.** Cada variante de idioma tiene su propia URL, su propia etiqueta canonical, y sus propias etiquetas hreflang. Google ve dos páginas distintas, bien estructuradas, vinculadas por metadatos de idioma.

3. **Cargas de página instantáneas.** No hay flash del idioma equivocado. No hay redirect de `/about` a `/es/about` basado en detección. Si visitas `/es/about`, obtienes la página en español. Inmediatamente. Porque fue construida así.

Astro hizo esto natural. Su ruteo basado en archivos produce un archivo HTML por ruta. Sus Content Collections validan todo en tiempo de build. Su arquitectura de islas significa que los componentes de Svelte solo se hidratan cuando necesitan interactividad — la lógica del idioma queda completamente del lado del servidor (que, para un sitio estático, significa "en tiempo de build").

---

## Reflexionando Sobre Este Capítulo

Mirando hacia atrás en esta serie, cada capítulo ha tratado sobre lo mismo: invertir tiempo ahora para que las cosas sean más simples después. La arquitectura con Astro, el trabajo de Lighthouse, el setup de analytics, el sistema de blog — todas fueron inversiones iniciales que siguieron dando frutos a medida que el sitio crecía.

Este capítulo no fue diferente. Construir soporte multilingüe en un sitio personal desde el día uno suena exagerado, y honestamente, algunos días se sentía así. Cada componente tenía que ser consciente del idioma desde el principio. Cada string tenía que pasar por el sistema de traducciones. Cada URL necesitaba una estrategia de prefijos. Cada artículo del blog necesitaba su gemelo en otro idioma. Fue mucho trabajo extra, especialmente al principio cuando solo quería publicar páginas.

Pero hoy el sitio tiene 57 artículos de blog en dos idiomas, 12 tipos de páginas y más de 960 claves de traducción — y ninguno de los componentes sabe ni le importa cuántos idiomas existen. Reciben un parámetro `lang` y hacen lo suyo. Ese intercambio valió la pena.

Elegí inglés y español porque esa es mi gente — las comunidades en las que he construido, las audiencias que realmente conozco. La arquitectura podría manejar más cuando yo esté listo, pero esa es una decisión sobre para quién escribo, no sobre lo que el código puede hacer.

A seguir construyendo.

---

## Recursos

- **[Astro i18n Recipes](https://docs.astro.build/en/recipes/i18n/)** — Documentación oficial de Astro para patrones de internacionalización.
- **[Código fuente de xergioalex.com](https://github.com/xergioalex/xergioalex.com)** — El repositorio completo donde vive todo el código descrito en esta serie.
