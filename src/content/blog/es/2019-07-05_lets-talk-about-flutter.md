---
title: "Hablemos de Flutter"
description: "Por qué el desarrollo cross-platform importa y cómo el modelo de widgets de Flutter cambió mi enfoque para construir apps móviles. De la mentalidad React a la magia de Dart."
pubDate: "2019-07-05"
heroImage: "/images/blog/posts/lets-talk-about-flutter/hero.webp"
heroLayout: "side-by-side"
tags: ["talks", "tech", "mobile", "flutter"]
keywords: ["introducción a Flutter", "qué es Flutter de Google", "Flutter vs React Native", "desarrollo móvil cross-platform", "widgets en Flutter", "Dart para desarrolladores móviles", "Flutter para apps iOS y Android"]
---

El desarrollo móvil cross-platform siempre ha sido un equilibrio complicado. Querés un solo codebase, rendimiento nativo y control pixel-perfect sobre la UI. Durante años, eso se sintió como elegir dos de tres. Luego llegó Flutter.

Para cuando di esta charla a mediados de 2019, Flutter acababa de llegar a 1.0 en diciembre de 2018. El buzz era real. Google lo estaba empujando fuerte, la comunidad crecía rápido y los desarrolladores estaban lanzando apps en producción. Quise entender por qué — y compartir lo que aprendí.

## El problema del cross-platform

Cuando construís apps móviles, tenés tres caminos:

**Desarrollo nativo** — Codebases separados para iOS (Swift) y Android (Kotlin/Java). Obtenés control total de la plataforma, rendimiento nativo y acceso a cada API. ¿El trade-off? Escribís todo dos veces. Diferentes lenguajes, diferentes toolchains, diferentes ecosistemas. Los bug fixes y features pasan dos veces. Mantener feature parity es difícil.

**Desarrollo híbrido** — Un solo codebase usando tecnologías web (HTML, CSS, JavaScript) envueltas en un WebView. Herramientas como Cordova e Ionic fueron pioneras. Escribís una vez, despliegas en todos lados. ¿El trade-off? El rendimiento sufre. La UI se siente como una página web, no como una app nativa. Las animaciones se retrasan. Los patrones específicos de cada plataforma son más difíciles de replicar.

**Frameworks cross-platform** — Un solo codebase que compila a código nativo o usa un puente a componentes nativos. React Native popularizó esto. Flutter lo lleva más lejos.

Flutter es **cross-platform**, pero con una diferencia clave: no usa WebViews ni componentes nativos de UI. Usa el **motor de renderizado Skia 2D** — el mismo motor que impulsa Chrome y los gráficos de Android. Flutter dibuja cada pixel por sí mismo. Eso te da consistencia pixel-perfect entre plataformas y control total sobre el look and feel. Sin compromisos, sin rarezas de plataforma.

## ¿Por qué Dart?

Flutter usa **Dart** como lenguaje de programación. Al principio, esto se sintió raro. ¿Por qué no JavaScript? ¿Por qué no TypeScript? ¿Por qué un lenguaje que la mayoría de la gente no había escuchado?

La respuesta: Dart fue diseñado exactamente para este caso de uso. Compila a código ARM nativo para móvil (ejecución rápida), compila a JavaScript para la web (portabilidad) y soporta compilación JIT para hot reload durante desarrollo (feedback instantáneo). Es multi-paradigma — orientado a objetos, funcional, fuertemente tipado — y se siente familiar si conocés JavaScript, Java o C#.

Dart no es solo para móvil. Podés construir **aplicaciones full stack** con él:

- **Mobile** — Flutter
- **Frontend** — Angular Dart (aunque esto es menos común ahora)
- **Backend** — Aplicaciones servidor usando las librerías HTTP nativas de Dart

Fui escéptico al principio, pero Dart te gana. La sintaxis es limpia, el tooling es sólido y el sistema de tipos ayuda a detectar bugs temprano sin sentirse pesado.

## El modelo de widgets

La idea central de Flutter es: **todo es un widget**. En serio. Todo. La app misma es un widget. La pantalla es un widget. Un botón es un widget. El padding alrededor del botón es un widget. El texto dentro del botón es un widget. Los widgets se componen para construir UIs.

Esto está inspirado en el **modelo de programación declarativa de React**. Describís la UI como una función del estado. Cuando el estado cambia, el framework reconstruye los widgets afectados. No manipulas imperativamente el DOM o elementos de UI — declaras cómo debería verse la UI y Flutter se encarga de renderizarla eficientemente.

Acá va un ejemplo simple:

```dart
import 'package:flutter/material.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          title: Text('Hola Flutter'),
        ),
        body: Center(
          child: Text(
            'A seguir construyendo.',
            style: TextStyle(fontSize: 24),
          ),
        ),
      ),
    );
  }
}
```

- **`main()`** — Punto de entrada. Toda app Dart empieza acá.
- **`StatelessWidget`** — Un widget sin estado mutable. Recibe datos y renderiza. Iconos, texto, contenedores, filas, columnas — estos son stateless.
- **`MaterialApp`** — La raíz de una app Material Design. Maneja routing, theming y localización.
- **`Scaffold`** — La estructura base de una pantalla: `appBar`, `body`, `bottomNavigationBar`, `floatingActionButton`.
- **`Text`** — Un widget que renderiza texto. Simple, componible.

Cuando necesitas interactividad, usas un **`StatefulWidget`**. Contiene estado mutable y se reconstruye cuando el estado cambia. Sliders, checkboxes, forms — cualquier cosa dinámica es stateful.

```dart
class Counter extends StatefulWidget {
  @override
  _CounterState createState() => _CounterState();
}

class _CounterState extends State<Counter> {
  int count = 0;

  void increment() {
    setState(() {
      count++;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Count: $count'),
        ElevatedButton(
          onPressed: increment,
          child: Text('Incrementar'),
        ),
      ],
    );
  }
}
```

`setState()` le dice a Flutter "el estado de este widget cambió, reconstruilo". El framework compara los árboles de widgets viejos y nuevos y actualiza solo lo que cambió. Eficiente, declarativo y predecible.

## Estructura del proyecto

Cuando creás un proyecto Flutter, obtenés una estructura de carpetas como esta:

```
flutter_app/
├── android/       # Configuración específica de Android (Gradle, manifests)
├── ios/           # Configuración específica de iOS (Xcode, Info.plist)
├── lib/           # Tu código Dart vive acá
│   └── main.dart  # Punto de entrada
├── pubspec.yaml   # Configuración del proyecto: dependencias, assets, fuentes, imágenes
└── test/          # Tests unitarios y de widgets
```

**`pubspec.yaml`** es el corazón del proyecto. Es donde declaras dependencias, registras assets, configuras fuentes y estableces metadata. Pensá en `package.json` para Dart.

```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^0.13.3

flutter:
  assets:
    - images/logo.png
  fonts:
    - family: Roboto
      fonts:
        - asset: fonts/Roboto-Regular.ttf
```

## Widgets básicos

Flutter viene con un conjunto rico de widgets integrados:

- **`Text`** — Renderiza texto. Soporta estilos, alineación, overflow.
- **`Container`** — Una caja con padding, margin, color, bordes y restricciones. La navaja suiza del layout.
- **`Row`** — Layout horizontal. Los hijos se sientan uno al lado del otro.
- **`Column`** — Layout vertical. Los hijos se apilan de arriba a abajo.
- **`Stack`** — Layout superpuesto. Los hijos se apilan uno encima del otro.
- **`ListView`** — Lista scrolleable de widgets.
- **`Image`** — Muestra imágenes de assets, red o archivos.

Estos primitivos se componen para construir UIs complejas. Una pantalla puede ser un `Scaffold` con una `Column` que contiene una `Row` de `Container`s, cada uno con una `Image` y `Text`. Todo se anida, todo es un widget.

## Por qué me gusta Flutter

Después de construir algunas apps demo, aprecié Flutter por varias razones:

1. **El hot reload es adictivo.** Cambiás código, guardás y ves el resultado en menos de un segundo. Sin recompilar, sin reiniciar la app. Es como el live reload del desarrollo web, pero para móvil.

2. **El modelo de widgets se siente natural.** Si usaste React, te vas a sentir en casa. Si no, es un mejor modelo mental que los frameworks de UI imperativos.

3. **Un codebase, dos plataformas.** Escribo Dart una vez y despliego a iOS y Android. La UI se comporta idénticamente. Sin bugs específicos de plataforma, sin divergencia.

4. **La documentación es excelente.** Los docs de Flutter son claros, llenos de ejemplos y bien organizados. La comunidad es útil y los recursos abundantes.

5. **Dart no da miedo.** Es accesible, moderno y práctico. La curva de aprendizaje es suave si conocés cualquier lenguaje estilo C.

## Empezando

Si querés probar Flutter, acá va por dónde empezar:

**Instala las herramientas:**

- [SDK Flutter](https://flutter.dev/docs/get-started/install) — El framework central
- [Android Studio](https://developer.android.com/studio/?hl=es-419) — Para emuladores Android y herramientas de build
- [Visual Studio Code](https://code.visualstudio.com/download) — Editor liviano con excelentes extensiones Flutter
- [Xcode](https://developer.apple.com/xcode/) — Requerido para builds iOS (solo macOS)

Después de la instalación, ejecuta `flutter doctor` para verificar tu configuración. Verifica dependencias faltantes y problemas de configuración.

**Probá los demos y recursos:**

- [Mi Demo App Flutter](https://github.com/xergioalex/demo_flutter_app) — Ejemplos simples que construí para esta charla
- [Documentación Flutter](https://flutter.dev/docs) — Empezá acá
- [Curso Flutter en Platzi](https://platzi.com/clases/flutter/) — Curso hands-on en español
- [DartPad](https://dartpad.dev/) — Playground Dart online para experimentar sin instalar nada
- [Galería de temas Flutter](https://startflutter.com/) — Temas y templates pre-construidos

---

Flutter no es perfecto. Es más joven que React Native, el ecosistema aún está creciendo y los targets web y desktop están mejorando pero no completamente maduros todavía. Pero para apps móviles donde querés control, rendimiento y una gran experiencia de desarrollador, Flutter cumple.

El desarrollo cross-platform solía significar compromiso. Flutter hace que se sienta como una elección que vale la pena hacer.

[Ver slides](https://slides.com/xergioalex/lets-talk-about-flutter)

A seguir construyendo.
