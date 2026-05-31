---
title: "Construyendo sebastianmartinezvanegas.com: el sitio web que le hice a un talentoso poeta colombiano"
description: "Cómo construí con Astro y Svelte el sitio web de Sebastián Martínez Vanegas, joven poeta colombiano ganador del Premio Internacional de Poesía Emilio Prados."
pubDate: "2025-05-04"
heroImage: "/images/blog/posts/building-sebastian-martinez-website/hero.webp"
heroLayout: "side-by-side"
tags: ["portfolio", "tech", "web-development", "astro", "svelte"]
keywords: ["sitio web poeta Astro Svelte portafolio", "Sebastián Martínez Vanegas sitio web", "construir sitio web personal para poeta", "Astro portafolio GitHub Pages", "poeta colombiano Premio Emilio Prados", "sitio web autor moderno modo oscuro", "sebastianmartinezvanegas.com"]
---

Algunos proyectos llegan por una propuesta formal, un correo con requerimientos, una reunión de kick-off. Este llegó de otra manera: mi esposa me dijo que su primo acababa de ganar uno de los premios de poesía más importantes de España, y que no tenía sitio web.

Eso era suficiente.

Sebastián Martínez Vanegas es primo de mi esposa. Nos enteramos en noviembre de 2024 que había ganado el XXV Premio Internacional de Poesía Emilio Prados con su libro *Tener un cuerpo es mala poesía* — seis mil euros de premio, publicación por Pre-Textos y traducción al inglés. [El Espectador](https://www.elespectador.com/el-magazin-cultural/el-colombiano-sebastian-martinez-vanegas-gana-en-espana-el-premio-de-poesia-emilio-prados-noticias-hoy/), [Noticias Caracol](https://www.noticiascaracol.com/entretenimiento/escritor-colombiano-sebastian-martinez-vanegas-gano-el-premio-de-poesia-emilio-prados-rg10) e [Infobae](https://www.infobae.com/america/agencias/2024/11/22/el-colombiano-sebastian-martinez-vanegas-gana-en-espana-el-premio-de-poesia-emilio-prados/) lo cubrieron. Un poeta colombiano de veintiocho años ganando en Málaga. Era una noticia grande. Y no tenía ni una página propia donde mandarle a la gente.

Ahí empezó [sebastianmartinezvanegas.com](https://www.sebastianmartinezvanegas.com/).

---

## Quién es Sebastián

Sebastián nació en Pereira en 1996 y estudió Estudios Literarios en la Pontificia Universidad Javeriana. No es un poeta de las redes sociales ni de los talleres de fin de semana — es alguien que se tomó la escritura en serio desde muy joven y que lleva años publicando en lugares importantes: el Periódico de Poesía de la UNAM, Círculo de Poesía, la revista Poesía de la Universidad de Carabobo.

En 2021 ganó el [Premio de Poesía Joven RNE-Fundación Montemadrid](https://letralia.com/noticias/2024/11/25/sebastian-martinez-vanegas-premio-poesia-emilio-prados-2024/) con *Coordenadas de un plano irrealizable*, publicado también por Pre-Textos. Ese mismo año fue seleccionado como becario de la [Fundación Antonio Gala para Jóvenes Creadores](https://www.elespectador.com/el-magazin-cultural/el-colombiano-sebastian-martinez-vanegas-gana-en-espana-el-premio-de-poesia-emilio-prados-noticias-hoy/) durante 2023-2024, una residencia en Córdoba donde escritores jóvenes de habla hispana se concentran exclusivamente a crear.

Cuando ganó el Emilio Prados en noviembre de 2024, ya tenía una trayectoria sólida. Pero para alguien que no lo conociera desde antes, eso era difícil de ver. No había un solo lugar donde leer quién era, qué había publicado, qué premios había ganado. Solo Instagram y algunas notas de prensa dispersas.

---

## Por qué decidí construirlo

Cuando mi esposa me comentó la noticia del premio de su primo, me pareció buena idea ayudarle a tener mejor visibilidad. Un poeta con ese nivel de reconocimiento necesita presencia web, y hacer páginas web es algo que sé hacer bien.

Un escritor publicado por Pre-Textos — una de las editoriales más respetadas de España — merece más que un perfil de Instagram. Las editoriales, los festivales, los medios, los lectores: todos van a buscar su nombre en Google. Necesitan llegar a algo que lo represente bien. No a un link de bio con tres íconos.

Me reuní con Sebastián y le conté lo que quería hacer. Pero claro, era su sitio — tenía que reflejar su estilo, no el mío. Así que fui a la [galería de temas de Astro](https://astro.build/themes/), busqué plantillas con buena base y buenos estilos, y le envié unas diez opciones que me gustaron.

Lo que me sorprendió fue que mi idea de cómo debía verse la página web de un poeta difería completamente de la visión de Sebastián. Yo pensaba en algo más elaborado, con secciones vistosas y funcionalidades completas. Sebastián quería algo muy minimalista y simple: nada ostentoso, nada de animaciones, nada de secciones llamativas. Me contó cómo le gustaría el look and feel del sitio y fue muy interesante escucharlo. Yo ya había avanzado bastante — le había puesto soporte de dark mode, multi-idioma para tener la web en inglés y español, un blog con páginas de detalle — y terminamos descartando muchas de esas cosas en pro de la simplicidad.

Si entras a [sebastianmartinezvanegas.com](https://www.sebastianmartinezvanegas.com/) vas a encontrar una home sencilla que explica quién es Sebastián sobre un fondo con textura de papel periódico. De hecho, toda la web terminó parecida a un periódico — limpia, tipográfica, sin adornos. Puedes navegar y verlo por ti mismo.

---

## El stack técnico

Usé el mismo stack que ya conozco bien: Astro, Svelte, TailwindCSS, TypeScript y Biome. El mismo que uso en [xergioalex.com](https://xergioalex.com/) y en [sergioykathe.com](https://www.sergioykathe.com/). Desplegado en GitHub Pages con CI/CD vía GitHub Actions.

De las plantillas que le mostré a Sebastián, la que eligió fue [Aria](https://github.com/ccbikai/astro-aria) — una plantilla de Astro limpia, orientada a contenido, con buenas bases de tipografía y estructura. Una base sólida sobre la cual construir sin pelear contra decisiones de diseño que no son las tuyas.

---

## Lo que se construyó

El sitio tiene cuatro secciones principales. La página de **Sobre mí** presenta su biografía completa: quién es, dónde estudió, cuáles son sus intereses literarios, sus premios y reconocimientos. Es lo primero que debería leer alguien que llega al sitio sin saber nada de él — y tiene que ser suficientemente bueno para que esa persona quiera seguir leyendo.

La sección de **Libros** muestra sus publicaciones con portada, descripción y enlace directo a la editorial. *Coordenadas de un plano irrealizable* y *Tener un cuerpo es mala poesía* están ahí, con sus portadas y los datos de Pre-Textos. Es la sección que más le importa a un lector que quiere comprar el libro o a un periodista que necesita los detalles de publicación.

**Entradas** es el espacio para los escritos propios de Sebastián — notas, reflexiones, fragmentos que quiera compartir fuera del formato libro. Es la parte más viva del sitio, la que puede crecer con el tiempo.

Y **Contacto** cierra el sitio de manera funcional: un formulario limpio para que medios, festivales o lectores puedan escribirle directamente.

El diseño es minimalista, con tipografía clara y navegación sticky. Modo oscuro incluido — no como adorno sino porque un sitio literario que se lee de noche necesita tratarle bien los ojos al lector.

---

Que haya quedado bien me da mucha satisfacción. Y que esté ahí, funcionando, cada vez que alguien busca su nombre en Google — eso es lo que hace que valga la pena. A seguir construyendo.

---

## Recursos

- **Sitio web:** [sebastianmartinezvanegas.com](https://www.sebastianmartinezvanegas.com/)
- **Repositorio en GitHub:** [xergioalex/sebastianmartinezvanegas.com](https://github.com/xergioalex/sebastianmartinezvanegas.com)
- **Libro — Tener un cuerpo es mala poesía:** [Pre-Textos](https://pre-textos.com/producto/tener-un-cuerpo-es-mala-poesia/)
- **Anuncio del premio:** [Diputación de Málaga](https://www.malaga.es/cultura/1315/com1_md3_cd-51151/)
- **Cobertura de prensa:** [El Espectador](https://www.elespectador.com/el-magazin-cultural/el-colombiano-sebastian-martinez-vanegas-gana-en-espana-el-premio-de-poesia-emilio-prados-noticias-hoy/) · [Noticias Caracol](https://www.noticiascaracol.com/entretenimiento/escritor-colombiano-sebastian-martinez-vanegas-gano-el-premio-de-poesia-emilio-prados-rg10) · [Infobae](https://www.infobae.com/america/agencias/2024/11/22/el-colombiano-sebastian-martinez-vanegas-gana-en-espana-el-premio-de-poesia-emilio-prados/)
