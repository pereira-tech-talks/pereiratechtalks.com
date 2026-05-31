---
title: "Let's Talk About Flutter"
description: "Why cross-platform development matters and how Flutter's widget model changed my approach to building mobile apps. From React mindset to Dart magic."
pubDate: "2019-07-05"
heroImage: "/images/blog/posts/lets-talk-about-flutter/hero.webp"
heroLayout: "side-by-side"
tags: ["talks", "tech", "mobile", "flutter"]
keywords: ["Flutter introduction Dart", "Flutter vs React Native comparison", "Flutter widget model explained", "cross-platform mobile Flutter", "Flutter 1.0 mobile development", "Dart Flutter beginners", "Flutter Google mobile framework"]
---

Cross-platform mobile development has always been a tricky balance. You want one codebase, native performance, and pixel-perfect control over the UI. For years, that felt like picking two out of three. Then Flutter arrived.

By the time I gave this talk in mid-2019, Flutter had just hit 1.0 in December 2018. The buzz was real. Google was pushing it hard, the community was growing fast, and developers were shipping production apps. I wanted to understand why — and share what I learned.

## The Cross-Platform Problem

When you build mobile apps, you have three paths:

**Native development** — Separate codebases for iOS (Swift) and Android (Kotlin/Java). You get full platform control, native performance, and access to every API. The trade-off? You write everything twice. Different languages, different toolchains, different ecosystems. Bug fixes and features happen twice. Maintaining feature parity is hard.

**Hybrid development** — One codebase using web technologies (HTML, CSS, JavaScript) wrapped in a WebView. Tools like Cordova and Ionic pioneered this. You write once, deploy everywhere. The trade-off? Performance suffers. The UI feels like a webpage, not a native app. Animations lag. Platform-specific patterns are harder to replicate.

**Cross-platform frameworks** — One codebase that compiles to native code or uses a bridge to native components. React Native popularized this. Flutter takes it further.

Flutter is **cross-platform**, but with a key difference: it doesn't use WebViews or native UI components. It uses the **Skia 2D rendering engine** — the same engine that powers Chrome and Android's graphics. Flutter draws every pixel itself. That gives you pixel-perfect consistency across platforms and full control over the look and feel. No compromises, no platform quirks.

## Why Dart?

Flutter uses **Dart** as its programming language. At first, this felt weird. Why not JavaScript? Why not TypeScript? Why a language most people hadn't heard of?

The answer: Dart was designed for exactly this use case. It compiles to native ARM code for mobile (fast execution), compiles to JavaScript for the web (portability), and supports JIT compilation for hot reload during development (instant feedback). It's multi-paradigm — object-oriented, functional, strongly typed — and it feels familiar if you know JavaScript, Java, or C#.

Dart isn't just for mobile. You can build **full-stack applications** with it:

- **Mobile** — Flutter
- **Frontend** — Angular Dart (though this is less common now)
- **Backend** — Server applications using Dart's native HTTP libraries

I was skeptical at first, but Dart grows on you. The syntax is clean, the tooling is solid, and the type system helps catch bugs early without feeling heavy.

## The Widget Model

Flutter's core idea is: **everything is a widget**. Seriously. Everything. The app itself is a widget. The screen is a widget. A button is a widget. The padding around the button is a widget. The text inside the button is a widget. Widgets compose to build UIs.

This is inspired by **React's declarative programming model**. You describe the UI as a function of state. When state changes, the framework rebuilds the affected widgets. You don't imperatively manipulate the DOM or UI elements — you declare what the UI should look like, and Flutter figures out how to render it efficiently.

Here's a simple example:

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
          title: Text('Hello Flutter'),
        ),
        body: Center(
          child: Text(
            'Let\'s keep building.',
            style: TextStyle(fontSize: 24),
          ),
        ),
      ),
    );
  }
}
```

- **`main()`** — Entry point. Every Dart app starts here.
- **`StatelessWidget`** — A widget without mutable state. It receives data and renders. Icons, text, containers, rows, columns — these are stateless.
- **`MaterialApp`** — The root of a Material Design app. It handles routing, theming, and localization.
- **`Scaffold`** — The base structure of a screen: `appBar`, `body`, `bottomNavigationBar`, `floatingActionButton`.
- **`Text`** — A widget that renders text. Simple, composable.

When you need interactivity, you use a **`StatefulWidget`**. It holds mutable state and rebuilds when the state changes. Sliders, checkboxes, forms — anything dynamic is stateful.

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
          child: Text('Increment'),
        ),
      ],
    );
  }
}
```

`setState()` tells Flutter "this widget's state changed, rebuild it." The framework diffs the old and new widget trees and updates only what changed. Efficient, declarative, and predictable.

## Project Structure

When you create a Flutter project, you get a folder structure like this:

```
flutter_app/
├── android/       # Android-specific config (Gradle, manifests)
├── ios/           # iOS-specific config (Xcode, Info.plist)
├── lib/           # Your Dart code lives here
│   └── main.dart  # Entry point
├── pubspec.yaml   # Project config: dependencies, assets, fonts, images
└── test/          # Unit and widget tests
```

**`pubspec.yaml`** is the heart of the project. It's where you declare dependencies, register assets, configure fonts, and set metadata. Think `package.json` for Dart.

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

## Basic Widgets

Flutter comes with a rich set of built-in widgets:

- **`Text`** — Render text. Supports styling, alignment, overflow.
- **`Container`** — A box with padding, margin, color, borders, and constraints. The Swiss Army knife of layout.
- **`Row`** — Horizontal layout. Children sit side by side.
- **`Column`** — Vertical layout. Children stack top to bottom.
- **`Stack`** — Overlapping layout. Children layer on top of each other.
- **`ListView`** — Scrollable list of widgets.
- **`Image`** — Display images from assets, network, or files.

These primitives compose to build complex UIs. A screen might be a `Scaffold` with a `Column` containing a `Row` of `Container`s, each with an `Image` and `Text`. Everything nests, everything is a widget.

## Why I Like Flutter

After building a few demo apps, I appreciated Flutter for a few reasons:

1. **Hot reload is addictive.** Change code, save, and see the result in under a second. No recompiling, no restarting the app. It's like web development's live reload, but for mobile.

2. **The widget model feels natural.** If you've used React, you'll feel at home. If you haven't, it's a better mental model than imperative UI frameworks.

3. **One codebase, two platforms.** I write Dart once and deploy to iOS and Android. The UI behaves identically. No platform-specific bugs, no divergence.

4. **The documentation is excellent.** Flutter's docs are clear, example-heavy, and well-organized. The community is helpful, and resources are abundant.

5. **Dart isn't scary.** It's approachable, modern, and practical. The learning curve is gentle if you know any C-style language.

## Getting Started

If you want to try Flutter, here's where to start:

**Install the tools:**

- [Flutter SDK](https://flutter.dev/docs/get-started/install) — The core framework
- [Android Studio](https://developer.android.com/studio/?hl=en) — For Android emulators and build tools
- [Visual Studio Code](https://code.visualstudio.com/download) — Lightweight editor with excellent Flutter extensions
- [Xcode](https://developer.apple.com/xcode/) — Required for iOS builds (macOS only)

After installation, run `flutter doctor` to verify your setup. It checks for missing dependencies and configuration issues.

**Try the demos and resources:**

- [My Flutter Demo App](https://github.com/xergioalex/demo_flutter_app) — Simple examples I built for this talk
- [Flutter Documentation](https://flutter.dev/docs) — Start here
- [Platzi Flutter Course](https://platzi.com/clases/flutter/) — Hands-on course in Spanish
- [DartPad](https://dartpad.dev/) — Online Dart playground to experiment without installing anything
- [Flutter Theme Gallery](https://startflutter.com/) — Pre-built themes and templates

---

Flutter isn't perfect. It's younger than React Native, the ecosystem is still growing, and the web and desktop targets are improving but not fully mature yet. But for mobile apps where you want control, performance, and a great developer experience, Flutter delivers.

Cross-platform development used to mean compromise. Flutter makes it feel like a choice worth making.

[View slides](https://slides.com/xergioalex/lets-talk-about-flutter)

Let's keep building.
