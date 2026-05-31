---
title: "Librería musical en PHP: mi primera página web"
description: "La historia detrás de mi primer proyecto web — el trabajo final del curso de bases de datos que se convirtió en mi introducción a PHP, SQLite y el desarrollo web."
pubDate: "2015-11-27"
heroImage: "/images/blog/posts/music-library-php-my-first-website/home.gif"
heroLayout: "banner"
tags: ["portfolio", "tech", "personal", "web-development", "university"]
keywords: ["primer proyecto web en PHP", "desarrollo web con PHP y SQLite", "XAMPP para principiantes", "biblioteca musical PHP HTML CSS", "aprender programación web desde cero", "proyecto universitario bases de datos", "introducción al desarrollo web"]
---

Llevo casi 10 años construyendo para la web, pero no empecé así. Hace poco estaba desempolvando archivos de la universidad y encontré la primera página web que desarrollé. Era el proyecto final del curso de bases de datos — y fue ahí donde tuve mi primer encuentro real con el desarrollo web.

Esta es la historia.

---

## La tarea

El enunciado era claro: construir un sistema que aplicara todo lo aprendido en el curso. Definir un modelo de datos relacional, implementarlo y soportar consultas de todo tipo. El lenguaje y la tecnología eran libres.

Después de investigar y sopesar opciones, elegí **PHP, SQLite, HTML y CSS**. Sin JavaScript. Era la primera vez que usaba estas tecnologías juntas y había mucho que digerir — pero al final entregué un producto funcional: una **biblioteca musical** donde podías crear una cuenta, guardar tus canciones favoritas y reproducirlas.

¿Suena simple? Lo es — pero cuando recién empiezas, el alcance de lo que en realidad estás aprendiendo es enorme.

---

## Lo que realmente implicaba

Si estás iniciando en este mundo, esto es todo lo que implicaba desarrollar esa aplicación:

1. **Entender el desarrollo web** — Cómo instalar un servidor (usé [XAMPP](https://www.apachefriends.org/es/index.html) en esa época) y tener claro que unas tecnologías corren en el servidor (PHP, SQLite) y otras en el navegador (HTML, CSS, JavaScript).

2. **Diseñar el modelo de datos** — Definir tablas, relaciones y restricciones en SQLite.

3. **PHP + SQLite** — Aprender a conectar con la base de datos, ejecutar consultas y manejar resultados desde PHP.

4. **CRUD para cada entidad** — Crear, leer, actualizar y eliminar para cada modelo del sistema.

5. **Comunicación cliente–servidor** — Cómo el navegador habla con el servidor y cómo fluyen los datos.

6. **Maquetado y estilos** — Construir interfaces con HTML y CSS.

7. **Manejo de archivos en PHP** — Subir y almacenar los archivos de las canciones de forma organizada en el servidor.

8. **Gestión de sesiones** — Registro de usuarios, login y ciclo de vida de la sesión (crear, destruir).

Esa lista resume la mayor parte del trabajo. Y algo importante: **todo se hizo desde cero**. Sin frameworks, sin librerías para sesiones, manejo de archivos o maquetado. Siempre recomiendo empezar así — como ejercicio académico y de autoaprendizaje, es crucial entender los conceptos antes de apoyarse en abstracciones. Necesitas saber qué hace tu herramienta por debajo cuando eventualmente elijas un stack.

---

## El modelo de datos

Este es el esquema de base de datos que diseñé para la biblioteca musical:

<figure>
  <img src="/images/blog/posts/music-library-php-my-first-website/db-model.webp" alt="Modelo de datos de la biblioteca musical" loading="lazy" />
  <figcaption>Esquema SQLite con seis tablas: usuarios, canciones, artistas, géneros, álbumes y una tabla intermedia para las listas de reproducción.</figcaption>
</figure>

---

## La aplicación en acción

He mantenido el proyecto en GitHub todos estos años. Aquí hay algunos GIFs que muestran cómo se veía y funcionaba la app:

### Página de inicio

<figure>
  <img src="/images/blog/posts/music-library-php-my-first-website/home.gif" alt="Página de inicio de Music Library PHP" loading="lazy" />
  <figcaption>La página de inicio de Music Library — una interfaz sencilla en PHP/HTML con navegación y contenido destacado.</figcaption>
</figure>

### Registro e inicio de sesión

<figure>
  <img src="/images/blog/posts/music-library-php-my-first-website/login-and-list-music.gif" alt="Flujo de registro e inicio de sesión" loading="lazy" />
  <figcaption>Registro, inicio de sesión y la lista personal de canciones del usuario — todo construido desde cero con sesiones de PHP.</figcaption>
</figure>

### Navegación y gestión de canciones

<figure>
  <img src="/images/blog/posts/music-library-php-my-first-website/add-song.gif" alt="Agregar canciones, artistas, géneros y álbumes" loading="lazy" />
  <figcaption>CRUD en acción — agregar canciones nuevas con metadatos de artista, género y álbum almacenados en SQLite.</figcaption>
</figure>

### Búsqueda

<figure>
  <img src="/images/blog/posts/music-library-php-my-first-website/search.gif" alt="Búsqueda de canciones" loading="lazy" />
  <figcaption>El buscador, filtrando canciones por nombre en tiempo real con consultas de PHP y SQLite.</figcaption>
</figure>

---

## Unas palabras honestas

Este fue mi primer proyecto web. No encontrarás código pulido, documentación exhaustiva ni mejores prácticas. Lo que encontrarás es lo mejor que un estudiante de ciencias de la computación trasnochado y agobiado por la carga académica pudo lograr en poco tiempo.

Espero que hayas disfrutado esta breve historia — y que algún día este código le pueda servir a alguien.

---

*"La inteligencia consiste no sólo en el conocimiento, sino también en la destreza de aplicar los conocimientos en la práctica."*  
*— Aristóteles*

---

## Pruébalo tú mismo

Si quieres ejecutar la app localmente, instala PHP (funciona con PHP 7.0 y las extensiones `php7.0-fpm` y `php7.0-sqlite3`) y sigue la configuración del repositorio.

**Repositorio:** [xergioalex/MusicLibraryPHP](https://github.com/xergioalex/MusicLibraryPHP)
