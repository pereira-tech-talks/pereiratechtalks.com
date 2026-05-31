---
type: native
title: "El panorama móvil en 2026"
description: "El mapa que armé antes de escribir código: nueve frameworks móviles, cuatro categorías y por qué Flutter y KMP son los dos caminos que sigo considerando."
pubDate: 2026-04-26
heroImage: "/images/slides/mobile-landscape-2026/hero-es.webp"
draft: false
theme: dark
transition: slide
syntaxHighlight: true
math: false
eventName: "Aprendiendo desarrollo móvil — Deck companion de la serie"
eventDate: 2026-04-26
relatedPost: mobile-development-landscape-2026
---

<!-- ==================== Portada ==================== -->

<!-- .slide: data-background-image="/images/slides/mobile-landscape-2026/hero-es.webp" data-background-size="cover" data-background-position="center" -->

&nbsp;

Note: Abrir con el ángulo personal. Esto no es un reporte comparativo — es el mapa que dibujé para mí antes de aprender desarrollo móvil desde cero como desarrollador backend. Marcar el tono: honesto, en primera persona, sin pose de experto. La imagen de portada va full-bleed — sin texto encima, el diseño habla por sí mismo.

---

<!-- ==================== Sección 01 — La atracción ==================== -->

<!-- .slide: data-background-gradient="linear-gradient(135deg, #152e45 0%, #0f1124 100%)" -->

<div class="slide-section-divider">
  <span class="eyebrow">Acto 1</span>
  <h2>Por qué desarrollo móvil para mí siempre fue "algún día"</h2>
</div>

---

<img src="/images/slides/mobile-landscape-2026/full-stack-not-mobile-es.webp" alt="Infografía: 15+ años considerándome full stack — Backend, Web, Infra, APIs, Base de datos, Cloud, DevOps — pero el desarrollo móvil siempre lo fui dejando para después" width="1024" height="576" class="slide-image-full" />

Note: La imagen ancla la charla en lo personal. 15+ años de carrera completa en todo menos mobile. La barrera al final del camino hacia el celular es el remate visual — la audiencia va a sentir la identificación.

---

## Mi problema con el desarrollo móvil

<img src="/images/slides/mobile-landscape-2026/mobile-dev-problem-es.webp" alt="Diagrama caótico de la configuración de desarrollo móvil: descarga del IDE, instalación del SDK, emuladores, herramientas de compilación, plugins, permisos, certificados y conflictos conectados por cables enredados" width="1024" height="576" class="slide-image-full" />

Note: Dejar que la imagen hable. El caos visual — cables, warnings, pasos interminables — es exactamente lo que siente cualquiera que intenta arrancar en desarrollo móvil por primera vez. No explicar demasiado; la audiencia va a reconocer el dolor.

---

<img src="/images/slides/mobile-landscape-2026/tried-several-times-es.webp" alt="Infografía: Lo intenté varias veces — cuatro intentos de arrancar en desarrollo móvil, cada uno bloqueado por configuración de IDE, SDK, emuladores, plugins, certificados y conflictos de build" width="1024" height="576" class="slide-image-full" />

Note: La imagen cuenta la historia sola. Cuatro intentos, todos bloqueados por logística antes de escribir código útil. Dejar que la audiencia la lea — el reconocimiento es inmediato.

---

## Mi primer proyecto móvil fue en la universidad

<img src="/images/slides/mobile-landscape-2026/84-years-meme.webp" alt="Meme de Rose en Titanic: Han pasado 84 años" width="520" height="291" style="display:block;margin:0 auto;" />

<p style="text-align:center;">Durante una materia de emprendimiento</p>

Note: El meme rompe la tensión. La audiencia se ríe y conecta — todos tienen esa historia de un proyecto universitario que fue su único contacto real con mobile. Pausa corta para la risa, después seguir.

---

<img src="/images/slides/mobile-landscape-2026/business-model-canvas.webp" alt="The Business Model Canvas — plantilla de modelo de negocio con secciones de socios clave, actividades, propuesta de valor, relaciones con clientes, segmentos, canales, estructura de costos y fuentes de ingreso" width="720" height="480" style="display:block;margin:0 auto;" />

Note: El Business Model Canvas como contexto visual — en esa materia de emprendimiento usábamos esta herramienta. La app móvil era parte del proyecto final. No hace falta explicar cada casilla, solo que la audiencia reconozca el canvas.

---

<img src="/images/blog/posts/mobile-development-landscape-2026/eclipse-helios-loading.webp" alt="Pantalla de carga de Eclipse Helios con el plugin ADT, alrededor de 2011" width="1024" height="576" class="slide-image-full" />

Note: La pantalla morada de carga de Eclipse Helios. La audiencia que vivió esa época va a reconocerla al instante. Para los más jóvenes, es evidencia visual de lo áspero que era el tooling.

---

## Eclipse con plugin ADT

<img src="/images/blog/posts/mobile-development-landscape-2026/eclipse-adt-layout-editor.webp" alt="Editor gráfico de layouts de Eclipse ADT mostrando una app Hello World de Android con la paleta de widgets" width="991" height="612" class="slide-image-full" />

---

## Y el emulador

<img src="/images/blog/posts/mobile-development-landscape-2026/eclipse-adt-emulator.webp" alt="Emulador de Android dentro de Eclipse con teclado físico virtual y panel DDMS" width="1024" height="576" class="slide-image-full" />

Note: La tercera imagen de Eclipse. La mitad menor de 30 nunca vio esto y la mayor está haciendo muecas.

---

## Mi computador no corría Eclipse con plugin ADT

<img src="/images/slides/mobile-landscape-2026/low-resources-barrier.webp" alt="Desarrollador frustrado frente a un laptop viejo con Eclipse trabado, íconos de recursos insuficientes y un muro bloqueando el camino hacia el desarrollo móvil" width="1024" height="576" class="slide-image-full" />

Note: La primera barrera real: hardware insuficiente. Eclipse + ADT + emulador necesitaban más de lo que el laptop del estudiante podía dar. La barrera no era intelectual — era logística.

---

## Buscando alternativas encontré PhoneGap

<img src="/images/slides/mobile-landscape-2026/phonegap-cordova.webp" alt="PhoneGap y Apache Cordova: HTML5, CSS3 y JavaScript compilando a iOS, Android y Windows" width="1024" height="576" class="slide-image-full" />

Note: PhoneGap / Apache Cordova fue la primera alternativa real. HTML + CSS + JS empaquetado como app nativa. La promesa: escribir una vez, correr en todas las plataformas. Para un estudiante sin recursos, era la salida.

---

## Ahora faltaba la idea

<img src="/images/slides/mobile-landscape-2026/idea-lightbulb.webp" alt="Bombilla encendida representando una idea" width="400" height="400" style="display:block;margin:0 auto;" />

Note: Tenía la herramienta pero no el proyecto. La barrera técnica estaba resuelta — ahora el problema era otro: ¿qué construir?

---

## El equipo

<img src="/images/slides/mobile-landscape-2026/university-team.webp" alt="Equipo del proyecto universitario: Sergio Alexander Florez Galeano (líder y desarrollador), Camilo Fernández Bernal (administración y marketing), Miguel Angel Acevedo Franco (experto en karate y comunicador)" width="1024" height="576" class="slide-image-full" />

Note: El equipo de la materia de emprendimiento. Tres perfiles distintos — un desarrollador, un administrador y un comunicador. La app móvil era el producto del proyecto final.

---

## La sesión de fotos para la app de karate

<img src="/images/slides/mobile-landscape-2026/karate-photos.webp" alt="Galería de fotos de una sesión fotográfica de karate para la app móvil del proyecto universitario" width="850" height="478" style="display:block;margin:0 auto;" />

Note: La idea fue una app de karate. Hicimos una sesión de fotos completa para tener el contenido. El proyecto era real — no un ejercicio académico de mentira.

---

<img src="/images/slides/mobile-landscape-2026/img_2070.webp" alt="Selfie del equipo durante la sesión de fotos de karate" width="520" height="390" style="display:block;margin:0 auto;" />

Note: La selfie del día de la sesión. Dos amigos, un proyecto universitario y una cámara.

---

<div class="slide-grid-2 slide-grid--align-center">
  <div>
    <img src="/images/slides/mobile-landscape-2026/img_1923.webp" alt="Kata de karate — posición de golpe" width="480" height="640" style="display:block;margin:0 auto;" />
  </div>
  <div>
    <img src="/images/slides/mobile-landscape-2026/img_1954.webp" alt="Kata de karate — patada lateral" width="480" height="640" style="display:block;margin:0 auto;" />
  </div>
</div>

---

<div class="slide-grid-2 slide-grid--align-center">
  <div>
    <img src="/images/slides/mobile-landscape-2026/img_2037.webp" alt="Kata de karate — patada alta" width="480" height="640" style="display:block;margin:0 auto;" />
  </div>
  <div>
    <img src="/images/slides/mobile-landscape-2026/img_2049.webp" alt="Kata de karate — posición defensiva" width="480" height="640" style="display:block;margin:0 auto;" />
  </div>
</div>

---

<div class="slide-grid-2 slide-grid--align-center">
  <div>
    <img src="/images/slides/mobile-landscape-2026/img_2045.webp" alt="Kata de karate — posición de guardia" width="480" height="640" style="display:block;margin:0 auto;" />
  </div>
  <div>
    <img src="/images/slides/mobile-landscape-2026/img_2044.webp" alt="Kata de karate — posición de bloqueo" width="480" height="640" style="display:block;margin:0 auto;" />
  </div>
</div>

---

<img src="/images/slides/mobile-landscape-2026/dosensei-logo.webp" alt="DoSensei — logo de la app de karate con karateka en posición de bloqueo" width="900" height="450" style="display:block;margin:0 auto;" />

Note: DoSensei — el nombre de la app. El primer proyecto móvil real, nacido de una materia de emprendimiento.

---

<div class="slide-grid-3">
  <div>
    <img src="/images/slides/mobile-landscape-2026/dosensei-screen1.webp" alt="DoSensei — pantalla principal con secciones de Karate y Defensa Personal" width="380" height="380" style="display:block;margin:0 auto;" />
  </div>
  <div>
    <img src="/images/slides/mobile-landscape-2026/dosensei-screen2.webp" alt="DoSensei — menú de Karate con Historia, Glosario y Guías" width="380" height="380" style="display:block;margin:0 auto;" />
  </div>
  <div>
    <img src="/images/slides/mobile-landscape-2026/dosensei-screen3.webp" alt="DoSensei — guías de karate por cinturón desde blanco hasta negro" width="380" height="700" style="display:block;margin:0 auto;" />
  </div>
</div>

Note: Los screenshots reales de DoSensei. Una app hecha con PhoneGap — HTML, CSS y JS empaquetado como app nativa. Funcionaba, se veía bien para la época, y fue mi primera app móvil en producción.

---

<div class="slide-grid-3">
  <div>
    <img src="/images/slides/mobile-landscape-2026/dosensei-screen4.webp" alt="DoSensei — detalle de técnica Kihon Tettsui-uchi con foto y descripción" width="380" height="620" style="display:block;margin:0 auto;" />
  </div>
  <div>
    <img src="/images/slides/mobile-landscape-2026/dosensei-screen5.webp" alt="DoSensei — detalle de técnica Kihon Oi-zuki con foto y descripción" width="380" height="620" style="display:block;margin:0 auto;" />
  </div>
  <div>
    <img src="/images/slides/mobile-landscape-2026/dosensei-screen6.webp" alt="DoSensei — detalle de técnica Kihon Gedan-barai con foto y descripción" width="380" height="620" style="display:block;margin:0 auto;" />
  </div>
</div>

Note: Las pantallas de detalle de cada técnica — foto real de la sesión + descripción del movimiento. El contenido era nuestro, no de stock. Eso hacía la diferencia.

---

## 🚀 KDoSensei — demo web

<p style="text-align:center;font-size:1.2em;"><a href="https://kdosensei.xergioalex.com/" target="_blank">kdosensei.xergioalex.com</a></p>

Note: La demo web original de la app de karate sigue viva. Es la versión web de lo que era la app híbrida — HTML, CSS y JS puro. La audiencia puede explorarla después de la charla.

---

## ✅ Lo híbrido me gustó

<ul>
  <li>KDoSensei fue funcional — y fue sencillo de construir</li>
  <li>Una web embebida dentro de un contenedor nativo</li>
  <li>Para apps basadas en contenido simple, brillan</li>
  <li>HTML + CSS + JS → el stack que ya conocía</li>
  <li>Sin compilar para cada plataforma por separado</li>
</ul>

Note: Hay que ser honesto — lo híbrido resolvió el problema real. Para una app de contenido como DoSensei, era más que suficiente. La barrera de entrada desapareció.

---

## 🔁 Otros intentos a lo largo de los años

<ul>
  <li><strong>Ionic</strong> — mejor tooling, prototipos más rápidos</li>
  <li><strong>Meteor + Cordova</strong> — reactivo, pero frágil en producción</li>
  <li><strong>React Native</strong> — más cerca de nativo, pero con sus propias fricciones</li>
  <li>Cada intento me muestra los límites del anterior</li>
  <li>Y todos comparten el mismo problema de fondo...</li>
</ul>

Note: No fue un solo intento. Son años probando variantes — cada una mejor que la anterior, pero todas con el mismo techo. El siguiente slide lo hace explícito.

---

## <span style="color:#f59e0b;">⚠</span> Las costuras siempre se notan

<ul>
  <li>Cámara, GPS, sensores, push → el bridge es lento</li>
  <li>Animaciones complejas → se siente como una web</li>
  <li>UX nativa → imposible de replicar en un WebView</li>
  <li>Performance en dispositivos de gama baja → inaceptable</li>
  <li>Las app stores penalizan la experiencia no-nativa</li>
</ul>

Note: Lo híbrido tiene un techo. Y ese techo se siente rápido cuando necesitás algo más que mostrar contenido. Las costuras entre web y nativo son visibles para el usuario.

---

## Y de nuevo me alejé del desarrollo móvil

<img src="/images/slides/mobile-landscape-2026/walked-away-from-mobile.webp" alt="Desarrollador alejándose del teléfono móvil hacia su zona de confort: servidores, terminales, Docker, bases de datos y APIs" width="1024" height="576" class="slide-image-full" />

Note: Momento de honestidad con la audiencia: después de varios intentos frustrados, la decisión fue volver a lo conocido — backend, infra, DevOps. El móvil quedó como "algún día". Muchos en la audiencia van a reconocerse.

---

## Charlas de desarrollo móvil

<table class="slide-table" style="font-size:0.55em;">
  <thead>
    <tr><th>#</th><th>Fecha</th><th>Post / Evento</th><th>Charla móvil</th><th>Speaker</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>2017-07-04</td><td><a href="https://www.pereiratechtalks.org/ionic-angular-blockchain-bitcoin-ethereum-y-solidity-3" target="_blank">Ionic + Angular && Blockchain</a></td><td>Desarrollo móvil con Ionic + Angular</td><td>Julian Patiño</td></tr>
    <tr><td>2</td><td>2017-08-01</td><td><a href="https://www.pereiratechtalks.org/react-native-seguridad-en-npm" target="_blank">React Native && Seguridad en npm</a></td><td>Introducción a React Native</td><td>Carlos Álvaro González</td></tr>
    <tr><td>3</td><td>2019-03-16</td><td><a href="https://www.pereiratechtalks.org/259646321-pereira-girls-day" target="_blank">Pereira Girls Day</a></td><td>Product Flavors en Android</td><td>Zorayda Gutiérrez</td></tr>
    <tr><td>4</td><td>2019-09-07</td><td><a href="https://www.pereiratechtalks.org/264304830-pereira-saturday-tec" target="_blank">Pereira – Saturday Tech Talks</a></td><td>Patrones de arquitectura – Android (MVP/MVVM)</td><td>Zorayda Gutiérrez</td></tr>
    <tr><td>5</td><td>2022-09-29</td><td><a href="https://www.pereiratechtalks.org/288702513-noche-de-accesibilid" target="_blank">Noche de Accesibilidad, diseño y desarrollo iOS</a></td><td>Cómo comenzar en el desarrollo de iOS</td><td>Yennifer Hurtado Arce</td></tr>
  </tbody>
</table>

Note: Charlas de desarrollo móvil que hemos organizado en la comunidad. El tema siempre estuvo presente — pero siempre desde la perspectiva de otros speakers. Ahora es mi turno.

---

<!-- ==================== Sección 02 — El panorama móvil 2026 ==================== -->

<!-- .slide: data-background-gradient="linear-gradient(135deg, #152e45 0%, #0f1124 100%)" -->

<div class="slide-section-divider">
  <span class="eyebrow">Acto 2</span>
  <h2>El panorama móvil en 2026</h2>
</div>

---

## Las cuatro formas que toma el ecosistema

<div class="slide-grid-2" style="max-height:380px;align-content:start;gap:0.4em;font-size:0.7em;margin-top:0.2em;">
  <div class="slide-card" style="padding:0.5em;">
    <span class="slide-card__icon">🔒</span>
    <h3>Nativo</h3>
    <p>Una plataforma, un lenguaje, acceso total al SO. <strong>Máximo control, máximo lock-in.</strong></p>
    <p style="margin-top:0.3em;font-size:0.85em;color:#64748b;">Swift · Kotlin · Jetpack Compose · SwiftUI</p>
  </div>
  <div class="slide-card" style="padding:0.5em;">
    <span class="slide-card__icon">🔀</span>
    <h3>Cross-platform, UI nativa</h3>
    <p>Lógica o UI compartida que compila a nativo. <strong>KMP y Flutter viven acá — filosofías distintas.</strong></p>
    <p style="margin-top:0.3em;font-size:0.85em;color:#64748b;">Flutter · KMP · React Native · .NET MAUI</p>
  </div>
  <div class="slide-card" style="padding:0.5em;">
    <span class="slide-card__icon">📦</span>
    <h3>Híbrido</h3>
    <p>Tecnología web dentro de un shell nativo. <strong>Mínima fricción, techos reales.</strong></p>
    <p style="margin-top:0.3em;font-size:0.85em;color:#64748b;">Ionic · Capacitor · Cordova · Tauri Mobile</p>
  </div>
  <div class="slide-card" style="padding:0.5em;">
    <span class="slide-card__icon">🌐</span>
    <h3>Web / PWA</h3>
    <p>Un sitio que instalas en la pantalla de inicio. <strong>Sin app store. Sin sensación nativa.</strong></p>
    <p style="margin-top:0.3em;font-size:0.85em;color:#64748b;">Service Workers · Web APIs · Workbox · PWABuilder</p>
  </div>
</div>

---

<img src="/images/blog/posts/mobile-development-landscape-2026/categories-es.webp" alt="Diagrama de cuatro torres de arquitectura comparando Nativo, Cross-platform UI nativa, Híbrido y Web/PWA. Cada torre muestra las capas entre el código del desarrollador y el hardware del dispositivo." width="1050" height="657" style="display:block;margin:0 auto;" />

Note: De izquierda a derecha: más capas entre tu código y el dispositivo. Nativo es el camino más directo; PWA, además de capas, está restringido por el sandbox del navegador.

---

<table class="slide-table" style="font-size:0.75em;">
  <thead>
    <tr><th></th><th>Opción</th><th>Lenguaje</th><th>Plataformas</th><th>UI</th></tr>
  </thead>
  <tbody>
    <tr><td><img src="/images/slides/mobile-landscape-2026/logo-android.webp" alt="Android" width="28" height="28" /></td><td>Android nativo</td><td>Kotlin + Compose</td><td>Android</td><td>Nativa</td></tr>
    <tr><td><img src="/images/slides/mobile-landscape-2026/logo-ios.webp" alt="iOS" width="28" height="28" /> <img src="/images/slides/mobile-landscape-2026/logo-swift.webp" alt="Swift" width="28" height="28" /></td><td>iOS nativo</td><td>Swift + SwiftUI</td><td>Apple</td><td>Nativa</td></tr>
    <tr><td><img src="/images/slides/mobile-landscape-2026/logo-kotlin.webp" alt="Kotlin" width="28" height="28" /></td><td>Kotlin Multiplatform</td><td>Kotlin</td><td>Android, iOS, Desktop, Web</td><td>Nativa (o Compose MP)</td></tr>
    <tr><td><img src="/images/slides/mobile-landscape-2026/logo-flutter.webp" alt="Flutter" width="28" height="28" /></td><td>Flutter</td><td>Dart</td><td>Android, iOS, Web, Desktop</td><td>Custom (Impeller)</td></tr>
    <tr><td><img src="/images/slides/mobile-landscape-2026/logo-react-native.webp" alt="React Native" width="28" height="28" /></td><td>React Native</td><td>JS / TS</td><td>Android, iOS, Web, Desktop</td><td>Nativa vía JSI</td></tr>
    <tr><td><img src="/images/slides/mobile-landscape-2026/logo-dotnet-maui.webp" alt=".NET MAUI" width="28" height="28" /></td><td>.NET MAUI</td><td>C#</td><td>Android, iOS, Win, macOS</td><td>Nativa vía .NET</td></tr>
    <tr><td><img src="/images/slides/mobile-landscape-2026/logo-ionic.webp" alt="Ionic" width="28" height="28" /></td><td>Ionic + Capacitor</td><td>HTML / CSS / JS</td><td>Android, iOS, Web, Desktop</td><td>WebView</td></tr>
    <tr><td><img src="/images/slides/mobile-landscape-2026/logo-pwa.webp" alt="PWA" width="28" height="28" /></td><td>PWA</td><td>HTML / CSS / JS</td><td>Web</td><td>Web</td></tr>
  </tbody>
</table>

---

<!-- .slide: class="slide-bg-pattern--grid" -->

## Descartes rápidos

<div class="slide-grid-2">
  <div class="fragment fade-up">
    <h3>Fuera</h3>
    <ul style="font-size:0.75em;list-style:none;padding-left:0;">
      <li style="display:flex;align-items:center;gap:0.3em;margin-bottom:0.3em;"><img src="/images/slides/mobile-landscape-2026/logo-android.webp" alt="" width="22" height="22" /><img src="/images/slides/mobile-landscape-2026/logo-ios.webp" alt="" width="22" height="22" /> <strong>Solo nativo</strong> — quiero llegar a ambas</li>
      <li style="display:flex;align-items:center;gap:0.3em;margin-bottom:0.3em;"><img src="/images/slides/mobile-landscape-2026/logo-ionic.webp" alt="" width="22" height="22" /> <strong>Ionic / Capacitor</strong> — viví esto, choqué el techo</li>
      <li style="display:flex;align-items:center;gap:0.3em;margin-bottom:0.3em;"><img src="/images/slides/mobile-landscape-2026/logo-dotnet-maui.webp" alt="" width="22" height="22" /> <strong>.NET MAUI</strong> — no estoy en el mundo C#</li>
      <li style="display:flex;align-items:center;gap:0.3em;margin-bottom:0.3em;"><img src="/images/slides/mobile-landscape-2026/logo-pwa.webp" alt="" width="22" height="22" /> <strong>PWA</strong> — necesito acceso real al dispositivo</li>
      <li style="display:flex;align-items:center;gap:0.3em;margin-bottom:0.3em;"><img src="/images/slides/mobile-landscape-2026/logo-react-native.webp" alt="" width="22" height="22" /> <strong>React Native</strong> — sólido, pero raíces JS</li>
    </ul>
  </div>
  <div class="fragment fade-up">
    <h3>Quedan</h3>
    <ul style="font-size:0.75em;list-style:none;padding-left:0;">
      <li style="display:flex;align-items:center;gap:0.3em;margin-bottom:0.3em;"><img src="/images/slides/mobile-landscape-2026/logo-flutter.webp" alt="" width="22" height="22" /> <strong>Flutter</strong> — el camino más rápido a un primer resultado</li>
      <li style="display:flex;align-items:center;gap:0.3em;margin-bottom:0.3em;"><img src="/images/slides/mobile-landscape-2026/logo-kotlin.webp" alt="" width="22" height="22" /> <strong>Kotlin Multiplatform</strong> — la apuesta más defendible a largo plazo</li>
    </ul>
  </div>
</div>

---

## Dos filosofías, un mismo camino

<div class="slide-grid-2">
  <div>
    <h3 style="display:flex;align-items:center;justify-content:center;gap:0.3em;"><img src="/images/slides/mobile-landscape-2026/logo-flutter.webp" alt="" width="32" height="32" /> Flutter</h3>
    <p><em>"Confía en nuestro renderer, escribe una vez."</em></p>
    <ul>
      <li>Dart + motor Impeller</li>
      <li>Misma UI en todas las plataformas — por diseño</li>
      <li>Hot reload, ecosistema maduro</li>
    </ul>
  </div>
  <div>
    <h3 style="display:flex;align-items:center;justify-content:center;gap:0.3em;"><img src="/images/slides/mobile-landscape-2026/logo-kotlin.webp" alt="" width="32" height="32" /> Kotlin Multiplatform</h3>
    <p><em>"Comparte la lógica, mantén la UI nativa."</em></p>
    <ul>
      <li>Capa Kotlin compartida · UI nativa por plataforma</li>
      <li>Jetpack Compose ↔ SwiftUI a cada lado</li>
      <li>Reciente pero estable</li>
    </ul>
  </div>
</div>

---

<img src="/images/slides/mobile-landscape-2026/flutter-vs-kmp-structure-es.webp" alt="Comparativa de estructura de carpetas: Flutter con un solo directorio lib/ vs KMP con shared/, androidApp/ y iosApp/ como tres bloques coordinados" width="980" height="551" style="display:block;margin:0 auto;" />

Note: Esta imagen muestra la diferencia arquitectónica clave. En Flutter todo vive en lib/ — un solo lugar. En KMP tenés tres mundos: shared/ para lógica común, androidApp/ con Jetpack Compose, iosApp/ con SwiftUI. KMP no reemplaza a SwiftUI ni a Compose, vive debajo de ellos.

---

<img src="/images/slides/mobile-landscape-2026/flutter-vs-kmp-architecture-es.webp" alt="Diagrama de arquitectura interna: Flutter con un motor Impeller que dibuja toda la UI vs KMP con UI nativa por plataforma y lógica compartida en Kotlin" width="980" height="551" style="display:block;margin:0 auto;" />

Note: El contraste clave: Flutter pasa todo por su propio motor gráfico (Impeller/Skia) — un motor dibuja todo. KMP deja que cada plataforma dibuje su propia UI nativa y solo comparte la lógica de abajo. Ambos son cross-platform, pero con filosofías opuestas.

---

## Lo mejor de cada uno

<div class="slide-grid-2">
  <div>
    <h3 style="display:flex;align-items:center;justify-content:center;gap:0.3em;"><img src="/images/slides/mobile-landscape-2026/logo-flutter.webp" alt="" width="28" height="28" /> Flutter</h3>
    <ul>
      <li>🚀 Hot reload instantáneo — iteración ultrarrápida</li>
      <li>🎨 Una sola UI para todas las plataformas</li>
      <li>📦 Ecosistema maduro (pub.dev, plugins, comunidad)</li>
      <li>⚡ Motor Impeller — 60fps consistentes</li>
    </ul>
  </div>
  <div>
    <h3 style="display:flex;align-items:center;justify-content:center;gap:0.3em;"><img src="/images/slides/mobile-landscape-2026/logo-kotlin.webp" alt="" width="28" height="28" /> KMP</h3>
    <ul>
      <li>🔧 UI 100% nativa en cada plataforma</li>
      <li>🔄 Lógica compartida, sin comprometer la UX</li>
      <li>🏢 Respaldo de JetBrains + soporte oficial de Google</li>
      <li>📈 Adopción migrable — se integra en apps existentes</li>
    </ul>
  </div>
</div>

<p style="text-align:center;margin-top:0.8em;font-size:0.85em;color:#64748b;"><em>Ambos son apuestas sólidas — pero resuelven problemas distintos.</em></p>

---

## Nada es gratis

<div class="slide-grid-2">
  <div>
    <h3 style="display:flex;align-items:center;justify-content:center;gap:0.3em;"><img src="/images/slides/mobile-landscape-2026/logo-flutter.webp" alt="" width="28" height="28" /> Flutter</h3>
    <ul>
      <li>⚠️ Dart solo existe para Flutter</li>
      <li>⚠️ La UI no termina de pertenecer a ninguna plataforma</li>
      <li>❌ Renderer custom ≠ sensación nativa real</li>
    </ul>
  </div>
  <div>
    <h3 style="display:flex;align-items:center;justify-content:center;gap:0.3em;"><img src="/images/slides/mobile-landscape-2026/logo-kotlin.webp" alt="" width="28" height="28" /> KMP</h3>
    <ul>
      <li>⚠️ Curva de aprendizaje más empinada</li>
      <li>⚠️ Dos capas de UI que mantener (a menos que uses Compose MP)</li>
      <li>❌ Integración con Xcode todavía áspera en los bordes</li>
    </ul>
  </div>
</div>

<p style="text-align:center;margin-top:0.8em;font-size:0.85em;color:#64748b;"><em>Cada camino cobra peaje — la pregunta es cuál estás dispuesto a pagar.</em></p>

---

<!-- .slide: data-background-gradient="linear-gradient(135deg, #7F52FF 0%, #0f1124 100%)" -->

<div style="text-align:center;">
  <span class="eyebrow" style="color:#c4b5fd;">Acto 3</span>
  <p style="font-size:1.4em;color:#c4b5fd;margin-bottom:0.2em;">Mi elección</p>
  <img src="/images/slides/mobile-landscape-2026/logo-kotlin.webp" alt="Kotlin" width="80" height="80" style="display:block;margin:0.4em auto;" />
  <h2 style="font-size:2.2em;color:#ffffff;margin:0.2em 0;">Kotlin Multiplatform</h2>
  <p style="font-size:1em;color:#e2e8f0;margin-top:0.5em;">UI nativa real · lógica compartida · migración progresiva<br/>El largo plazo vale la curva de aprendizaje.</p>
</div>

Note: Este es el momento de declarar la apuesta. KMP no es el camino fácil — es el camino defendible. UI nativa en cada plataforma, lógica compartida en Kotlin, y la posibilidad de migrar apps existentes sin reescribir todo.

---

<div class="slide-stat">
  <span class="slide-stat__number">7% → 18%</span>
  <span class="slide-stat__label">Crecimiento de adopción de KMP entre desarrolladores en un solo año</span>
  <p class="slide-stat__context">Fuente: <a href="https://www.jetbrains.com/lp/devecosystem-2025/" target="_blank">JetBrains Developer Ecosystem Survey 2024–2025</a></p>
</div>

---

## KMP — el largo camino hasta acá

<ul class="slide-timeline">
  <li><time>2017</time><span>Introducido en Kotlin 1.2 en KotlinConf</span></li>
  <li><time>Nov 2023</time><span>KMP declarado estable</span></li>
  <li><time>May 2025</time><span>Compose Multiplatform para iOS pasa a estable</span></li>
  <li><time>Ene 2026</time><span>Compose MP 1.10.0 liberado</span></li>
  <li><time>2026</time><span>Google migrando librerías Jetpack (Room, DataStore, ViewModel) a KMP</span></li>
</ul>

---

## ¿Quién ya está usando KMP en producción?

<table class="slide-table" style="font-size:0.6em;">
  <thead>
    <tr><th>Empresa</th><th>Code Sharing</th><th>Impacto</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>McDonald's</strong></td><td>70%+</td><td>6.5M compras/mes · 69M clientes diarios · 50+ países</td></tr>
    <tr><td><strong>Duolingo</strong></td><td>80%</td><td>40M+ usuarios activos/semana · releases simultáneos iOS y Android</td></tr>
    <tr><td><strong>Airbnb</strong></td><td>95%</td><td>Ciclo de release de mensual a semanal en 6 meses</td></tr>
    <tr><td><strong>Google Docs</strong></td><td>—</td><td>Google Docs para iOS corre KMP en producción</td></tr>
    <tr><td><strong>Netflix</strong></td><td>~50%</td><td>Apps de producción de TV/cine · offline-first</td></tr>
    <tr><td><strong>Cash App</strong></td><td>—</td><td>7+ años en producción · transacciones financieras reales</td></tr>
    <tr><td><strong>Forbes</strong></td><td>80%+</td><td>Features simultáneos en ambas plataformas</td></tr>
    <tr><td><strong>Philips</strong></td><td>—</td><td>SDK de dispositivos médicos (HealthSuite)</td></tr>
  </tbody>
</table>

<p style="text-align:center;margin-top:0.5em;font-size:0.55em;color:#64748b;">Fuentes: <a href="https://kotlinlang.org/case-studies/" target="_blank">Kotlin Case Studies</a> · <a href="https://blog.jetbrains.com/kotlin/2025/12/industry-leaders-on-the-kotlinconf25-stage/" target="_blank">KotlinConf 2025</a> · <a href="https://netflixtechblog.com/netflix-android-and-ios-studio-apps-kotlin-multiplatform-d6d4d8d25d23" target="_blank">Netflix TechBlog</a></p>

Note: No es hype — son empresas procesando millones de transacciones reales. McDonald's con 6.5 millones de compras al mes. Cash App con 7 años en producción manejando dinero real. Google usando KMP en su propio Google Docs. La pregunta ya no es "¿está listo?" sino "¿cuándo empezamos?"

---

## La comunidad y el respaldo detrás de Kotlin

<div class="slide-grid-2">
  <div>
    <h3>📊 Números</h3>
    <ul style="font-size:0.8em;">
      <li><strong>2.5 millones</strong> de desarrolladores en el mundo</li>
      <li><strong>1.65M</strong> repositorios en GitHub</li>
      <li><strong>100K+</strong> miembros en Kotlin Slack</li>
      <li><strong>400+</strong> universidades enseñando Kotlin</li>
      <li><strong>100+</strong> ingenieros en el core team (JetBrains + Google)</li>
      <li><strong>350+</strong> contribuidores independientes</li>
    </ul>
  </div>
  <div>
    <h3>🏛️ Kotlin Foundation</h3>
    <ul style="font-size:0.8em;">
      <li><strong>JetBrains</strong> — creadores del lenguaje</li>
      <li><strong>Google</strong> — lenguaje oficial de Android</li>
      <li><strong>Meta</strong> — primer Gold Member (2025)</li>
      <li><strong>Uber · Block · Gradle</strong></li>
      <li><strong>Touchlab · Kotzilla</strong></li>
      <li>Spring Boot — partnership formal (2025)</li>
    </ul>
  </div>
</div>

<p style="text-align:center;margin-top:0.5em;font-size:0.55em;color:#64748b;">Fuente: <a href="https://kotlinfoundation.org/" target="_blank">Kotlin Foundation</a> · <a href="https://devnewsletter.com/p/state-of-kotlin-2026" target="_blank">State of Kotlin 2026</a></p>

Note: Kotlin no es un proyecto de un solo actor. Tiene una fundación con Google, Meta, Uber y Block como miembros. 2.5 millones de desarrolladores. Spring Boot como partnership oficial. Esto no desaparece mañana.

---

## No necesitás ser experto para empezar <!-- .element: style="font-size:1.3em;" -->

<div class="fragment fade-up" style="text-align:center;margin-top:0.6em;">
  <p style="font-size:1.1em;color:#E51641;">🤖 La IA cambió las reglas del juego</p>
</div>

<div class="fragment fade-up" style="margin-top:0.5em;">
  <ul style="font-size:0.85em;">
    <li>Antes: aprender un ecosistema nuevo = <strong>meses de curva</strong></li>
    <li>Ahora: con <strong>coding agents</strong> + la dirección correcta = avance exponencial</li>
    <li>La IA no reemplaza tu criterio — <strong>amplifica tu velocidad</strong></li>
  </ul>
</div>

<div class="fragment fade-up" style="text-align:center;margin-top:0.8em;padding:0.6em;background:linear-gradient(135deg,rgba(229,22,65,0.1),rgba(21,46,69,0.15));border-radius:12px;">
  <p style="font-size:1em;margin:0;">🧭 <strong>Investigar</strong> + 🤖 <strong>IA como copiloto</strong> + 🎯 <strong>Dirección clara</strong></p>
  <p style="font-size:1.2em;margin-top:0.4em;color:#E51641;"><em>= Ya no hay excusa para no empezar</em></p>
</div>

Note: El cierre conecta todo: la barrera de entrada que tenía hace años ya no existe de la misma forma. Los coding agents permiten que alguien con experiencia en backend pueda explorar mobile con velocidad real. No necesitás ser experto — necesitás dirección y las herramientas correctas.

---

## 📖 Serie: Trabajando con Agentes <!-- .element: style="font-size:1.1em;" -->

<img src="/images/blog/series/working-with-agents/hero-es.webp" alt="Serie Trabajando con Agentes" width="580" height="326" style="display:block;margin:0 auto;border-radius:10px;">

<p style="text-align:center;margin-top:0.4em;font-size:0.7em;">De escribir código a orquestar agentes de IA — el nuevo rol, flujos reales, qué se rompe, criterio, contexto y adopción en equipos.</p>

<p style="text-align:center;margin-top:0.3em;font-size:0.85em;"><a href="https://xergioalex.com/es/blog/series/working-with-agents" target="_blank">xergioalex.com/es/blog/series/working-with-agents</a></p>

Note: Plug natural de la serie. Conecta directamente con el slide anterior sobre coding agents y IA. La serie profundiza en todo lo que apenas se menciona aquí.

---

<!-- .slide: data-background="#0f1124" -->

<p style="font-size:0.7em;text-transform:uppercase;letter-spacing:0.2em;color:#64748b;margin-bottom:0.2em;">ACTO 4</p>

<div style="display:flex;align-items:center;justify-content:center;gap:0.4em;">
  <img src="/images/slides/mobile-landscape-2026/logo-kotlin.webp" alt="Kotlin" width="48" height="48" />
  <h2 style="margin:0;font-size:1.8em;">Demos</h2>
</div>

<img src="/images/slides/mobile-landscape-2026/homers-web-page.gif" alt="Homer's Web Page" width="380" height="238" style="display:block;margin:0.35em auto;border-radius:10px;">

Note: Momento de mostrar código real y apps funcionando. Homer's Web Page como metáfora de los primeros intentos web que todos hemos hecho.

---

## 1. KMP Starter

<img src="/images/slides/mobile-landscape-2026/demo-kmpstarter.webp" alt="KMP Starter en Android" width="165" height="294" style="display:block;margin:0 auto;border-radius:8px;">

<p style="text-align:center;font-size:0.65em;margin-top:0.2em;color:#374151;">Template base — Android, iOS, Desktop, Web desde un solo módulo</p>

<p style="text-align:center;margin-top:0.2em;font-size:0.7em;"><a href="https://github.com/xergioalex/kmpstarter" target="_blank">github.com/xergioalex/kmpstarter</a></p>

Note: Template reutilizable. Todas las apps que siguen nacieron de este starter con AGENTS.md preparado para coding agents.

---

## 2. Flutter Starter

<img src="/images/slides/mobile-landscape-2026/demo-flutterstarter.webp" alt="Flutter Starter en Android" width="165" height="294" style="display:block;margin:0 auto;border-radius:8px;">

<p style="text-align:center;font-size:0.65em;margin-top:0.2em;color:#374151;">Template base Flutter — comparar DX lado a lado con KMP</p>

<p style="text-align:center;margin-top:0.2em;font-size:0.7em;"><a href="https://github.com/xergioalex/flutterstarter" target="_blank">github.com/xergioalex/flutterstarter</a></p>

Note: Mismo concepto de starter pero en Flutter. Permite comparar DX, estructura, y velocidad de iteración entre ambos frameworks.

---

## 3. KMP Todo App

<img src="/images/slides/mobile-landscape-2026/demo-kmptodoapp.webp" alt="KMP Todo App en Android" width="165" height="294" style="display:block;margin:0 auto;border-radius:8px;">

<p style="text-align:center;font-size:0.65em;margin-top:0.2em;color:#374151;">CRUD completo — filtros, búsqueda, temas, i18n, SQLite</p>

<p style="text-align:center;margin-top:0.2em;font-size:0.7em;"><a href="https://github.com/xergioalex/kmptodoapp" target="_blank">github.com/xergioalex/kmptodoapp</a></p>

Note: CRUD completo con persistencia SQLDelight, Material 3, dark mode, y share nativo por plataforma. Demuestra que KMP sirve para apps reales.

---

## 4. KMP Tap Duel Game

<div style="display:flex;justify-content:center;gap:0.3em;">
  <img src="/images/slides/mobile-landscape-2026/demo-kmptapduel-1.webp" alt="Tap Duel - inicio" width="120" height="213" style="border-radius:6px;">
  <img src="/images/slides/mobile-landscape-2026/demo-kmptapduel-2.webp" alt="Tap Duel - jugando" width="120" height="213" style="border-radius:6px;">
  <img src="/images/slides/mobile-landscape-2026/demo-kmptapduel-3.webp" alt="Tap Duel - ganador" width="120" height="213" style="border-radius:6px;">
</div>

<p style="text-align:center;font-size:0.65em;margin-top:0.2em;color:#374151;">Duelo local 2 jugadores — UI compartida fluida incluso en un juego</p>

<p style="text-align:center;margin-top:0.2em;font-size:0.7em;"><a href="https://github.com/xergioalex/kmptapduelgame" target="_blank">github.com/xergioalex/kmptapduelgame</a></p>

Note: Motor de juego puro Kotlin en commonMain con unit tests. Compose Multiplatform manejando input de gestos rápidos en todas las plataformas.

---

## 5. KMP AI Chat

<div style="display:flex;justify-content:center;gap:0.4em;">
  <img src="/images/slides/mobile-landscape-2026/demo-kmpaichat-1.webp" alt="KMP AI Chat - vacío" width="148" height="265" style="border-radius:8px;">
  <img src="/images/slides/mobile-landscape-2026/demo-kmpaichat-2.webp" alt="KMP AI Chat - conversación" width="148" height="265" style="border-radius:8px;">
</div>

<p style="text-align:center;font-size:0.65em;margin-top:0.2em;color:#374151;">Chat con IA — OpenAI API + Ktor + UI reactiva</p>

<p style="text-align:center;margin-top:0.2em;font-size:0.7em;"><a href="https://github.com/xergioalex/kmpaichat" target="_blank">github.com/xergioalex/kmpaichat</a></p>

Note: Demuestra integración de APIs externas, manejo de BuildConfig para API keys, y estados de UI con StateFlow.

---

## 6. KMP AI Voice Chat

<img src="/images/slides/mobile-landscape-2026/demo-kmpaivoicechat.webp" alt="KMP AI Voice Chat en iOS" width="165" height="294" style="display:block;margin:0 auto;border-radius:8px;">

<p style="text-align:center;font-size:0.65em;margin-top:0.2em;color:#374151;">Texto + voz + conversación en tiempo real vía WebSocket</p>

<p style="text-align:center;margin-top:0.2em;font-size:0.7em;"><a href="https://github.com/xergioalex/kmpaivoicechat" target="_blank">github.com/xergioalex/kmpaivoicechat</a></p>

Note: expect/actual para audio nativo (AudioRecord en Android, AVAudioEngine en iOS). WebSocket streaming PCM16 24kHz. El demo más avanzado a nivel de integración nativa.

---

## 7. KMP PTT Dynamics

<div style="display:flex;justify-content:center;gap:0.3em;">
  <img src="/images/slides/mobile-landscape-2026/demo-kmppttdynamics-1.webp" alt="PTT Dynamics - perfil" width="100" height="178" style="border-radius:6px;">
  <img src="/images/slides/mobile-landscape-2026/demo-kmppttdynamics-2.webp" alt="PTT Dynamics - lobby" width="100" height="178" style="border-radius:6px;">
  <img src="/images/slides/mobile-landscape-2026/demo-kmppttdynamics-3.webp" alt="PTT Dynamics - avatares" width="100" height="178" style="border-radius:6px;">
  <img src="/images/slides/mobile-landscape-2026/demo-kmppttdynamics-4.webp" alt="PTT Dynamics - sala" width="100" height="178" style="border-radius:6px;">
</div>

<p style="text-align:center;font-size:0.65em;margin-top:0.2em;color:#374151;">Dinámicas en vivo para meetups — la app que usaremos hoy</p>

<p style="text-align:center;margin-top:0.2em;font-size:0.7em;"><a href="https://github.com/xergioalex/kmppttdynamics" target="_blank">github.com/xergioalex/kmppttdynamics</a></p>

Note: App con backend real (Firebase/Supabase), múltiples dinámicas simultáneas, y actualización en tiempo real en todos los dispositivos conectados. La que vamos a probar en vivo.

---

<!-- .slide: data-background="#0f1124" -->

<img src="/images/slides/mobile-landscape-2026/speaker-photo.webp" alt="Sergio Alexander Flórez" width="180" height="180" style="display:block;margin:0 auto;border-radius:50%;border:3px solid #E51641;">

<h2 style="margin-top:0.5em;color:#ffffff;">¡Gracias!</h2>

<p style="text-align:center;font-size:0.85em;color:#e2e8f0;margin-top:0.3em;">Sergio Alexander Flórez Galeano</p>

<div style="text-align:center;margin-top:0.5em;font-size:0.8em;">
  <p>🌐 <a href="https://xergioalex.com" target="_blank">xergioalex.com</a></p>
  <p>🐦 <a href="https://twitter.com/xergioalex" target="_blank">@xergioalex</a></p>
  <p>💻 <a href="https://github.com/xergioalex" target="_blank">github.com/xergioalex</a></p>
  <p>💼 <a href="https://linkedin.com/in/xergioalex" target="_blank">linkedin.com/in/xergioalex</a></p>
</div>

Note: Slide de cierre. Agradecer a la audiencia y dejar los canales de contacto.

