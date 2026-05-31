---
title: "Cómo responder formularios de Google via postman y ajax"
description: "Conecta un formulario de contacto estático a Google Forms mediante HTTP POST — sin iframe. Guía paso a paso con Postman y jQuery Ajax."
pubDate: "2018-01-11"
heroImage: "/images/blog/posts/google-forms-postman-ajax/hero.webp"
heroLayout: "banner"
tags: ["talks", "tech", "javascript", "web-development"]
keywords: ["conectar formulario Google Forms con JavaScript", "enviar datos a Google Forms con Ajax", "formulario de contacto sin backend", "Google Forms API jQuery", "HTTP POST a Google Forms", "formulario web estático sin servidor", "Postman Google Forms tutorial"]
---

En el desarrollo de web estáticas básicas, como las páginas de aterrizaje (landing pages) o páginas personales, se suele requerir conectar un formulario de contacto, y si no se está haciendo uso de nada más allá de html, css y js, como suele ser el caso de las [páginas de github](https://pages.github.com/), los [formularios de Google](https://www.google.com/forms/about/) son una buena opción para almacenar la información suministrada por los visitantes o usuarios del sitio.

A continuación se describe el proceso para conectar el formulario de contacto de tu sitio web con un formulario de Google sin necesidad de embeber el contenido del mismo mediante un iframe, haciendo uso de una petición HTTP.

## Completar formulario via Postman

Lo primero es ir a [Google Forms](https://www.google.com/forms/about/) y crear un formulario como este:

<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSdnW7ixrovoi7V7sJQihWouPztZL4GoRMAP5SpoVh2UfMhxOQ/viewform?embedded=true" width="100%" height="600" frameborder="0" marginheight="0" marginwidth="0" loading="lazy" title="Formulario de contacto de Google Forms">Cargando…</iframe>

Como paso seguido, abrimos el [formulario](https://docs.google.com/forms/d/e/1FAIpQLSdnW7ixrovoi7V7sJQihWouPztZL4GoRMAP5SpoVh2UfMhxOQ/viewform) e inspeccionamos cada uno de los campos buscando los `name` de cada input, los cuales siguen el formato `entry.{id}`:

<figure>
  <img src="/images/blog/posts/google-forms-postman-ajax/postman-1.webp" alt="Inspeccionando los nombres de los campos del formulario en DevTools" loading="lazy" />
  <figcaption>Usando las DevTools del navegador para localizar los nombres de los inputs <code>entry.*</code> necesarios para enviar el formulario de forma programática.</figcaption>
</figure>

> **Tip:** Otra forma rápida de encontrar todos los IDs es inspeccionar cerca del tag `<form>`, donde encontrarás inputs de tipo `hidden` cuyos `name` comienzan con `entry.`, conteniendo todos los identificadores de los campos del formulario:

<figure>
  <img src="/images/blog/posts/google-forms-postman-ajax/form-hidden-entries.webp" alt="Campos hidden con los entry IDs dentro del tag form" loading="lazy" />
  <figcaption>Los inputs ocultos <code>entry.*</code> cerca del tag <code>&lt;form&gt;</code> — una alternativa rápida a inspeccionar cada campo individualmente.</figcaption>
</figure>

Una vez obtenemos todos los `name`, ya tenemos todo lo necesario para poder completar nuestro formulario enviando una petición HTTP usando [Postman](https://www.getpostman.com/):

1. Cambiar la parte final de la URL del formulario de `viewform` a `formResponse`:

```
https://docs.google.com/forms/d/e/1FAIpQLSdnW7ixrovoi7V7sJQihWouPztZL4GoRMAP5SpoVh2UfMhxOQ/viewform
https://docs.google.com/forms/d/e/1FAIpQLSdnW7ixrovoi7V7sJQihWouPztZL4GoRMAP5SpoVh2UfMhxOQ/formResponse
```

2. Usar `text/xml` como `Content-Type` en los Headers:

<figure>
  <img src="/images/blog/posts/google-forms-postman-ajax/postman-2.webp" alt="Headers de Postman con Content-Type text/xml" loading="lazy" />
  <figcaption>Cabeceras de la petición en Postman — configurando <code>Content-Type: text/xml</code> según lo requiere el endpoint de Google Forms.</figcaption>
</figure>

3. Definir el contenido del body. Para [nuestro formulario](https://docs.google.com/forms/d/e/1FAIpQLSdnW7ixrovoi7V7sJQihWouPztZL4GoRMAP5SpoVh2UfMhxOQ/viewform) en particular, los `name` de cada uno de los inputs de nombre, email, teléfono y mensaje son respectivamente `entry.568194084`, `entry.1303875942`, `entry.807958025` y `entry.703388132`:

<figure>
  <img src="/images/blog/posts/google-forms-postman-ajax/postman-3.webp" alt="Body de Postman con los campos entry del formulario" loading="lazy" />
  <figcaption>Cuerpo de la petición en Postman con los cuatro campos <code>entry.*</code> mapeados a los inputs de nombre, email, teléfono y mensaje del formulario.</figcaption>
</figure>

Si seguiste los pasos anteriores, ya deberías poder enviar respuestas al formulario de Google usando Postman; siéntete libre de usar [mi formulario de ejemplo](https://docs.google.com/forms/d/e/1FAIpQLSdnW7ixrovoi7V7sJQihWouPztZL4GoRMAP5SpoVh2UfMhxOQ/viewform) para hacer pruebas y enviar respuestas, las cuales puedes visualizar en la [siguiente hoja de cálculo](https://docs.google.com/spreadsheets/d/1r0O9A4oRT81jgzIodJRNL_1GA9WYgJsdRxWVjQULv00/edit#gid=1264787793).

## Completar formulario via Ajax

Finalmente es hora de conectar nuestro formulario web via Ajax. Aquí tienes un código muy simple en jQuery:

```javascript
$.ajax({
  url: 'https://docs.google.com/forms/d/e/1FAIpQLSdnW7ixrovoi7V7sJQihWouPztZL4GoRMAP5SpoVh2UfMhxOQ/formResponse',
  type: 'POST',
  crossDomain: true,
  dataType: "xml",
  data: {
    'entry.568194084': 'Value name field',
    'entry.1303875942': 'Value email field',
    'entry.807958025': 'Value phone field',
    'entry.703388132': 'Value message field'
  },
  success: function(jqXHR, textStatus, errorThrown) {
    console.log('Enter on success');
  },
  error: function(jqXHR, textStatus, errorThrown) {
    console.log('Enter on error');
  }
});
```

Como se puede observar, solo fue necesario traducir al formato Ajax de jQuery la petición que ya se tenía en Postman. Aquí tienes un pequeño código funcional de un formulario web conectado al formulario de ejemplo; puedes probarlo directamente desde aquí:

<iframe height="500" style="width: 100%;" scrolling="no" src="https://codepen.io/xergioalex/embed/ZNevvM?default-tab=result&theme-id=dark" frameborder="no" loading="eager" allowtransparency="true" allowfullscreen="true" title="Google Forms - Ajax request">Cargando…</iframe>

Todas las respuestas que se envíen se deberán ver reflejadas en la [hoja de cálculo de respuestas](https://docs.google.com/forms/) anteriormente presentada:

<iframe src="https://docs.google.com/spreadsheets/d/14iddB2KpAgBb7pKbGPQwFfMCcjo2IWV_uFHMCq-0U_4/preview" width="100%" height="400" frameborder="0" loading="eager" title="Hoja de cálculo de respuestas del formulario de Google">Cargando…</iframe>

Como consideración final, cabe mencionar que al usar este método obtendremos una respuesta y mensaje de error como esta: `No 'Access-Control-Allow-Origin' header is present on the requested resource`, la cual normalmente se soluciona en otras aplicaciones dando permisos en el destino a las IPs y dominios desde las cuales queremos enviar las peticiones, pero para el caso de los formularios de Google no encontré algún parámetro de configuración que me permitiera solucionarlo, pero aún así la respuesta se registra exitosamente, por lo cual no deberíamos preocuparnos por este detalle.

Muchas gracias por visitar mi blog y si este contenido te ha parecido útil, no olvides compartirlo, así me ayudas a llegar a más personas increíbles como tú.

**Recursos:** [Repositorio con código en GitHub](https://github.com/xergioalex/googleFormsHttpRequest)
