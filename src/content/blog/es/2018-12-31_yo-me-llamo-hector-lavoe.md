---
title: "Yo Me Llamo Héctor Lavoe: Creando un Sitio Web Personal para un Artista Salsero"
description: "Sitio para un imitador de Héctor Lavoe en Yo Me Llamo: audio, galería y un arreglo con jPlayer que me costó una tarde por tres píxeles."
pubDate: "2018-12-31"
heroImage: "/images/blog/posts/yo-me-llamo-hector-lavoe/hero.webp"
heroLayout: "banner"
tags: ["portfolio", "web-development", "personal", "design"]
keywords: ["sitio web para artista musical", "reproductor de audio en HTML CSS", "jPlayer reproductor web", "sitio web salsa Héctor Lavoe", "Yo Me Llamo imitadores web", "galería de fotos artista músico", "desarrollo web para músicos"]
---

Yuli me llamó por ahí en 2017. Éramos amigos desde la universidad — de esas amistades que sobreviven la graduación y la distancia y años de apenas hablar, y un día alguien te llama y es como si no hubiera pasado el tiempo.

"¿Le podrías hacer un sitio web a mi esposo?"

Su esposo es músico de salsa. Más exactamente, imita a **Héctor Lavoe** — la leyenda puertorriqueña — y había participado en *[Yo Me Llamo](https://www.caracoltv.com/yo-me-llamo)*, que para los que no son de Colombia es básicamente el programa de televisión de imitación más grande del país. Los concursantes escogen un artista famoso y se convierten en él en tarima. El canto, el look, los gestos. Es un show enorme acá.

Dije que sí antes de que terminara de explicarme qué necesitaba.

---

## El encargo

La idea era simple: quería un sitio bonito donde la gente pudiera escuchar su música, ver fotos de sus presentaciones y conocer su trayectoria. Reproductor de audio, galería, videos, bio, formulario de contacto. Nada del otro mundo por separado, pero quería que se viera bien — no un template genérico con su nombre encima.

---

## La plantilla y el trabajo de adaptación

Arranqué con una plantilla que ya traía un reproductor de audio integrado con **[jPlayer](http://jplayer.org/)**, una librería HTML5 basada en jQuery. Eso me dio una base sólida — no tuve que construir el reproductor desde cero, pero sí tocó adaptarlo bastante para que encajara con lo que queríamos.

El trabajo fuerte fue de personalización. Cambiar el esquema de colores al dorado y negro, ajustar la tipografía, reorganizar las secciones, meter todo el contenido del artista — fotos, videos, biografía, las pistas de audio. La plantilla te da la estructura, pero hacerla sentir como un sitio hecho a medida toma tiempo. Recuerdo pelear con especificidad de CSS para que los controles del reproductor se vieran bien en el contexto del diseño nuevo. En un momento estaba debuggeando un botón de play que aparecía desalineado en Firefox por 3 píxeles. Tres píxeles. Una tarde entera.

Lo del móvil también dio sus dolores de cabeza. Safari en iOS tenía sus propias opiniones sobre cuándo el audio debía hacer autoplay y cuándo no. Tuve que agregar workarounds para que el reproductor inicializara bien en iPhones — de esos que encuentras en la página 3 de un hilo de Stack Overflow de 2015.

---

## El resto del stack

Nada sofisticado: **HTML, CSS, JavaScript, LESS, un poco de PHP** para el formulario de contacto. Sin React. Sin bundler. Editas un archivo, refrescas el navegador, ves si funcionó. Ese tipo de proyecto.

LESS fue la mejor decisión que tomé. El sitio tiene seis secciones — inicio, trayectoria, videos, galería, música y contacto — y sin un preprocesador de CSS la hoja de estilos habría sido inmanejable. Separé todo en módulos: `_gallery.less`, `_player.less`, `_layout.less`, y así. Todo compilado en un solo archivo. Suficientemente limpio.

El PHP era mínimo. Solo el formulario de contacto mandando un correo. Viéndolo ahora, la validación es... digamos optimista. Sin tokens CSRF, sin rate limiting. Funcionó, nadie lo abusó, pero no lo escribiría así hoy.

---

## El diseño

La plantilla ya tenía una base visual oscura que encajaba bien con la onda salsera — fondos negros, acentos dorados, tipografía grande. Tocó ajustar colores, meter las fotos del artista en tarima, el logo de "Yo Me Llamo" en el hero, y cuadrar todo para que se viera profesional. Las primeras versiones estaban demasiado oscuras — parecían un flyer de discoteca. Tuve que agregar más espacio y dejar que las fotos respiraran.

---

## Dónde está ahora

El sitio ya no se mantiene. La carrera del artista tomó otros rumbos, y la web también — el stack se nota viejo. Pero lo dejé corriendo en [yomellamohectorlavoe.xergioalex.com](https://yomellamohectorlavoe.xergioalex.com/) bajo mi dominio. Una cápsula del tiempo.

Mirando hacia atrás, lo que más recuerdo no es el código ni las decisiones de diseño. Es Yuli mandándome las fotos y las pistas de su esposo por WhatsApp, el ir y venir sobre cuál imagen usar para el hero, el "¡quedó increíble!" cuando le mandé la primera versión funcional. Eso no aparece en un git log, pero es la razón por la que el proyecto existió.

Sigamos construyendo.

---

## Recursos

- [Yo Me Llamo Héctor Lavoe — Sitio en vivo](https://yomellamohectorlavoe.xergioalex.com/) — El sitio web tal como está hoy
- [Repositorio en GitHub](https://github.com/xergioalex/yomellamohectorlavoe) — Código fuente
- [jPlayer](http://jplayer.org/) — La librería de audio/video HTML5 usada para el reproductor de música
- [Yo Me Llamo — Caracol TV](https://www.caracoltv.com/yo-me-llamo) — El programa de televisión colombiano
