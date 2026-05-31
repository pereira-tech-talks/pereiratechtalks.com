---
type: native
title: "The Mobile Landscape in 2026"
description: "The map I drew before writing code: nine mobile frameworks, four categories, and why Flutter and KMP are the only two paths I'm still considering."
pubDate: 2026-04-26
heroImage: "/images/slides/mobile-landscape-2026/hero-en.webp"
draft: false
theme: dark
transition: slide
syntaxHighlight: true
math: false
eventName: "Learning Mobile Development — Series Companion Deck"
eventDate: 2026-04-26
relatedPost: mobile-development-landscape-2026
---

<!-- ==================== Cover ==================== -->

<!-- .slide: data-background-image="/images/slides/mobile-landscape-2026/hero-en.webp" data-background-size="cover" data-background-position="center" -->

&nbsp;

Note: Open with the personal angle. This isn't a comparison report — it's the map I drew for myself before learning mobile from scratch as a backend developer. Set the tone: honest, first-person, no expert pose. The cover image is full-bleed — no overlay text, the design speaks for itself.

---

<!-- ==================== Section 01 — The pull ==================== -->

<!-- .slide: data-background-gradient="linear-gradient(135deg, #152e45 0%, #0f1124 100%)" -->

<div class="slide-section-divider">
  <span class="eyebrow">Act 1</span>
  <h2>Why mobile was always "someday"</h2>
</div>

---

<img src="/images/slides/mobile-landscape-2026/full-stack-not-mobile-en.webp" alt="Infographic: 15+ years calling myself full stack — Backend, Web, Infra, APIs, Databases, Cloud, DevOps — but mobile development was always left for later" width="1024" height="576" class="slide-image-full" />

Note: The image anchors the talk in the personal. 15+ years of a full career in everything except mobile. The barrier at the end of the path toward the phone is the visual punchline — the audience will feel the identification.

---

## My problem with mobile development

<img src="/images/slides/mobile-landscape-2026/mobile-dev-problem.webp" alt="Chaotic diagram of mobile development setup: IDE, SDK, emulators, certificates, plugins, and build conflicts connected by tangled cables" width="1024" height="576" class="slide-image-full" />

Note: Let the image speak. The visual chaos — cables, warnings, endless steps — is exactly what anyone feels trying to start with mobile for the first time. Don't over-explain; the audience will recognize the pain.

---

<img src="/images/slides/mobile-landscape-2026/tried-several-times-en.webp" alt="Infographic: I tried several times — four attempts at starting mobile development, each blocked by IDE setup, SDK, emulators, plugins, certificates, and build conflicts" width="1024" height="576" class="slide-image-full" />

Note: The image tells the story by itself. Four attempts, all blocked by logistics before writing useful code. Let the audience read it — recognition is immediate.

---

## My first mobile project was in college

<img src="/images/slides/mobile-landscape-2026/84-years-meme-en.webp" alt="Titanic Rose meme: It's been 84 years" width="520" height="291" style="display:block;margin:0 auto;" />

<p style="text-align:center;">During an entrepreneurship course</p>

Note: The meme breaks the tension. The audience laughs and connects — everyone has that story of a college project that was their only real contact with mobile. Short pause for the laugh, then move on.

---

<img src="/images/slides/mobile-landscape-2026/business-model-canvas.webp" alt="The Business Model Canvas — business model template with sections for key partners, activities, value propositions, customer relationships, segments, channels, cost structure and revenue streams" width="720" height="480" style="display:block;margin:0 auto;" />

Note: The Business Model Canvas as visual context — that entrepreneurship course used this tool. The mobile app was part of the final project. No need to explain every box, just let the audience recognize the canvas.

---

<img src="/images/blog/posts/mobile-development-landscape-2026/eclipse-helios-loading.webp" alt="Eclipse Helios IDE loading screen with the ADT plugin, circa 2011" width="1024" height="576" class="slide-image-full" />

Note: The purple Eclipse Helios loading screen. The audience who lived through that era will recognize it instantly. For younger folks, it's visual evidence of how rough the tooling was.

---

## Eclipse with ADT plugin

<img src="/images/blog/posts/mobile-development-landscape-2026/eclipse-adt-layout-editor.webp" alt="Eclipse ADT graphical layout editor showing a Hello World Android app with form widgets palette" width="991" height="612" class="slide-image-full" />

---

## And the emulator

<img src="/images/blog/posts/mobile-development-landscape-2026/eclipse-adt-emulator.webp" alt="Android emulator inside Eclipse with virtual physical keyboard and DDMS panel" width="1024" height="576" class="slide-image-full" />

Note: The third Eclipse image. Most of the audience under 30 has never seen this and the older half is wincing.

---

## My computer couldn't run Eclipse with ADT plugin

<img src="/images/slides/mobile-landscape-2026/low-resources-barrier.webp" alt="Frustrated developer in front of an old laptop with Eclipse stuck, insufficient resources icons and a wall blocking the path to mobile development" width="1024" height="576" class="slide-image-full" />

Note: The first real barrier: insufficient hardware. Eclipse + ADT + emulator needed more than the student's laptop could give. The barrier wasn't intellectual — it was logistical.

---

## Looking for alternatives I found PhoneGap

<img src="/images/slides/mobile-landscape-2026/phonegap-cordova.webp" alt="PhoneGap and Apache Cordova: HTML5, CSS3 and JavaScript compiling to iOS, Android and Windows" width="1024" height="576" class="slide-image-full" />

Note: PhoneGap / Apache Cordova was the first real alternative. HTML + CSS + JS packaged as a native app. The promise: write once, run on every platform. For a student with limited resources, it was the way out.

---

## Now I needed an idea

<img src="/images/slides/mobile-landscape-2026/idea-lightbulb.webp" alt="Lit lightbulb representing an idea" width="400" height="400" style="display:block;margin:0 auto;" />

Note: Had the tool but not the project. The technical barrier was solved — now the problem was different: what to build?

---

## The team

<img src="/images/slides/mobile-landscape-2026/university-team.webp" alt="University project team: Sergio Alexander Florez Galeano (leader and developer), Camilo Fernández Bernal (admin and marketing), Miguel Angel Acevedo Franco (karate expert and communicator)" width="1024" height="576" class="slide-image-full" />

Note: The entrepreneurship course team. Three different profiles — a developer, an admin, and a communicator. The mobile app was the final project product.

---

## The photo shoot for the karate app

<img src="/images/slides/mobile-landscape-2026/karate-photos.webp" alt="Photo gallery from a karate photo shoot for the university project mobile app" width="850" height="478" style="display:block;margin:0 auto;" />

Note: The idea was a karate app. We did a full photo shoot to have the content. The project was real — not a fake academic exercise.

---

<img src="/images/slides/mobile-landscape-2026/img_2070.webp" alt="Team selfie during the karate photo shoot" width="520" height="390" style="display:block;margin:0 auto;" />

Note: The selfie from the shoot day. Two friends, a college project, and a camera.

---

<div class="slide-grid-2 slide-grid--align-center">
  <div>
    <img src="/images/slides/mobile-landscape-2026/img_1923.webp" alt="Karate kata — punch stance" width="480" height="640" style="display:block;margin:0 auto;" />
  </div>
  <div>
    <img src="/images/slides/mobile-landscape-2026/img_1954.webp" alt="Karate kata — side kick" width="480" height="640" style="display:block;margin:0 auto;" />
  </div>
</div>

---

<div class="slide-grid-2 slide-grid--align-center">
  <div>
    <img src="/images/slides/mobile-landscape-2026/img_2037.webp" alt="Karate kata — high kick" width="480" height="640" style="display:block;margin:0 auto;" />
  </div>
  <div>
    <img src="/images/slides/mobile-landscape-2026/img_2049.webp" alt="Karate kata — defensive stance" width="480" height="640" style="display:block;margin:0 auto;" />
  </div>
</div>

---

<div class="slide-grid-2 slide-grid--align-center">
  <div>
    <img src="/images/slides/mobile-landscape-2026/img_2045.webp" alt="Karate kata — guard position" width="480" height="640" style="display:block;margin:0 auto;" />
  </div>
  <div>
    <img src="/images/slides/mobile-landscape-2026/img_2044.webp" alt="Karate kata — block position" width="480" height="640" style="display:block;margin:0 auto;" />
  </div>
</div>

---

<img src="/images/slides/mobile-landscape-2026/dosensei-logo.webp" alt="DoSensei — karate app logo with karateka in block stance" width="900" height="450" style="display:block;margin:0 auto;" />

Note: DoSensei — the app's name. The first real mobile project, born from an entrepreneurship course.

---

<div class="slide-grid-3">
  <div>
    <img src="/images/slides/mobile-landscape-2026/dosensei-screen1.webp" alt="DoSensei — main screen with Karate and Self Defense sections" width="380" height="380" style="display:block;margin:0 auto;" />
  </div>
  <div>
    <img src="/images/slides/mobile-landscape-2026/dosensei-screen2.webp" alt="DoSensei — Karate menu with History, Glossary, and Guides" width="380" height="380" style="display:block;margin:0 auto;" />
  </div>
  <div>
    <img src="/images/slides/mobile-landscape-2026/dosensei-screen3.webp" alt="DoSensei — karate guides by belt from white to black" width="380" height="700" style="display:block;margin:0 auto;" />
  </div>
</div>

Note: The actual DoSensei screenshots. An app built with PhoneGap — HTML, CSS, and JS packaged as a native app. It worked, looked decent for the time, and was my first mobile app in production.

---

<div class="slide-grid-3">
  <div>
    <img src="/images/slides/mobile-landscape-2026/dosensei-screen4.webp" alt="DoSensei — Kihon Tettsui-uchi technique detail with photo and description" width="380" height="620" style="display:block;margin:0 auto;" />
  </div>
  <div>
    <img src="/images/slides/mobile-landscape-2026/dosensei-screen5.webp" alt="DoSensei — Kihon Oi-zuki technique detail with photo and description" width="380" height="620" style="display:block;margin:0 auto;" />
  </div>
  <div>
    <img src="/images/slides/mobile-landscape-2026/dosensei-screen6.webp" alt="DoSensei — Kihon Gedan-barai technique detail with photo and description" width="380" height="620" style="display:block;margin:0 auto;" />
  </div>
</div>

Note: The technique detail screens — real photos from the shoot + movement description. The content was ours, not stock. That made the difference.

---

## 🚀 KDoSensei — web demo

<p style="text-align:center;font-size:1.2em;"><a href="https://kdosensei.xergioalex.com/" target="_blank">kdosensei.xergioalex.com</a></p>

Note: The original web demo of the karate app is still live. It's the web version of what was the hybrid app — pure HTML, CSS, and JS. The audience can explore it after the talk.

---

## ✅ I liked hybrid

<ul>
  <li>KDoSensei was functional — and simple to build</li>
  <li>A web view inside a native container</li>
  <li>For apps based on simple content, they shine</li>
  <li>HTML + CSS + JS → the stack I already knew</li>
  <li>No compiling for each platform separately</li>
</ul>

Note: Let's be honest — hybrid solved the real problem. For a content app like DoSensei, it was more than enough. The entry barrier disappeared.

---

## 🔁 Other attempts over the years

<ul>
  <li><strong>Ionic</strong> — better tooling, faster prototypes</li>
  <li><strong>Meteor + Cordova</strong> — reactive, but fragile in production</li>
  <li><strong>React Native</strong> — closer to native, but with its own friction</li>
  <li>Each attempt shows me the limits of the previous one</li>
  <li>And they all share the same underlying problem...</li>
</ul>

Note: It wasn't a single attempt. It's years of trying variants — each one better than the last, but all with the same ceiling. The next slide makes it explicit.

---

## <span style="color:#f59e0b;">⚠</span> The seams always show

<ul>
  <li>Camera, GPS, sensors, push → the bridge is slow</li>
  <li>Complex animations → it feels like a web page</li>
  <li>Native UX → impossible to replicate in a WebView</li>
  <li>Performance on low-end devices → unacceptable</li>
  <li>App stores penalize non-native experiences</li>
</ul>

Note: Hybrid has a ceiling. And that ceiling hits fast when you need more than displaying content. The seams between web and native are visible to the user.

---

## And once again I walked away from mobile development

<img src="/images/slides/mobile-landscape-2026/walked-away-from-mobile.webp" alt="Developer walking away from a mobile phone toward his comfort zone: servers, terminals, Docker, databases, and APIs" width="1024" height="576" class="slide-image-full" />

Note: Moment of honesty with the audience: after several frustrated attempts, the decision was to go back to what I knew — backend, infra, DevOps. Mobile stayed as "someday." Many in the audience will relate.

---

## Mobile development talks

<table class="slide-table" style="font-size:0.55em;">
  <thead>
    <tr><th>#</th><th>Date</th><th>Post / Event</th><th>Mobile talk</th><th>Speaker</th></tr>
  </thead>
  <tbody>
    <tr><td>1</td><td>2017-07-04</td><td><a href="https://www.pereiratechtalks.org/ionic-angular-blockchain-bitcoin-ethereum-y-solidity-3" target="_blank">Ionic + Angular && Blockchain</a></td><td>Mobile development with Ionic + Angular</td><td>Julian Patiño</td></tr>
    <tr><td>2</td><td>2017-08-01</td><td><a href="https://www.pereiratechtalks.org/react-native-seguridad-en-npm" target="_blank">React Native && npm Security</a></td><td>Introduction to React Native</td><td>Carlos Álvaro González</td></tr>
    <tr><td>3</td><td>2019-03-16</td><td><a href="https://www.pereiratechtalks.org/259646321-pereira-girls-day" target="_blank">Pereira Girls Day</a></td><td>Product Flavors in Android</td><td>Zorayda Gutiérrez</td></tr>
    <tr><td>4</td><td>2019-09-07</td><td><a href="https://www.pereiratechtalks.org/264304830-pereira-saturday-tec" target="_blank">Pereira – Saturday Tech Talks</a></td><td>Architecture patterns – Android (MVP/MVVM)</td><td>Zorayda Gutiérrez</td></tr>
    <tr><td>5</td><td>2022-09-29</td><td><a href="https://www.pereiratechtalks.org/288702513-noche-de-accesibilid" target="_blank">Accessibility, design & iOS development night</a></td><td>How to start in iOS development</td><td>Yennifer Hurtado Arce</td></tr>
  </tbody>
</table>

Note: Mobile development talks we've organized in the community. The topic was always present — but always from other speakers' perspective. Now it's my turn.

---

<!-- ==================== Section 02 — The mobile landscape 2026 ==================== -->

<!-- .slide: data-background-gradient="linear-gradient(135deg, #152e45 0%, #0f1124 100%)" -->

<div class="slide-section-divider">
  <span class="eyebrow">Act 2</span>
  <h2>The Mobile Landscape in 2026</h2>
</div>

---

## The four shapes the ecosystem takes

<div class="slide-grid-2" style="max-height:380px;align-content:start;gap:0.4em;font-size:0.7em;margin-top:0.2em;">
  <div class="slide-card" style="padding:0.5em;">
    <span class="slide-card__icon">🔒</span>
    <h3>Native</h3>
    <p>One platform, one language, full OS access. <strong>Maximum control, maximum lock-in.</strong></p>
    <p style="margin-top:0.3em;font-size:0.85em;color:#64748b;">Swift · Kotlin · Jetpack Compose · SwiftUI</p>
  </div>
  <div class="slide-card" style="padding:0.5em;">
    <span class="slide-card__icon">🔀</span>
    <h3>Cross-platform, native UI</h3>
    <p>Shared logic or UI compiled to native. <strong>KMP and Flutter live here — different philosophies.</strong></p>
    <p style="margin-top:0.3em;font-size:0.85em;color:#64748b;">Flutter · KMP · React Native · .NET MAUI</p>
  </div>
  <div class="slide-card" style="padding:0.5em;">
    <span class="slide-card__icon">📦</span>
    <h3>Hybrid</h3>
    <p>Web tech inside a native shell. <strong>Lowest friction, real ceilings.</strong></p>
    <p style="margin-top:0.3em;font-size:0.85em;color:#64748b;">Ionic · Capacitor · Cordova · Tauri Mobile</p>
  </div>
  <div class="slide-card" style="padding:0.5em;">
    <span class="slide-card__icon">🌐</span>
    <h3>Web / PWA</h3>
    <p>A site you install on the home screen. <strong>No app store. No native feel.</strong></p>
    <p style="margin-top:0.3em;font-size:0.85em;color:#64748b;">Service Workers · Web APIs · Workbox · PWABuilder</p>
  </div>
</div>

---

<img src="/images/blog/posts/mobile-development-landscape-2026/categories-en.webp" alt="Diagram of four architecture towers comparing Native, Cross-platform native UI, Hybrid, and Web/PWA. Each tower shows the layers between developer code and device hardware." width="1050" height="657" style="display:block;margin:0 auto;" />

Note: From left to right: more layers between your code and the device. Native is the most direct path; PWA, on top of layers, is constrained by the browser sandbox.

---

<table class="slide-table" style="font-size:0.75em;">
  <thead>
    <tr><th></th><th>Option</th><th>Language</th><th>Platforms</th><th>UI</th></tr>
  </thead>
  <tbody>
    <tr><td><img src="/images/slides/mobile-landscape-2026/logo-android.webp" alt="Android" width="28" height="28" /></td><td>Native Android</td><td>Kotlin + Compose</td><td>Android</td><td>Native</td></tr>
    <tr><td><img src="/images/slides/mobile-landscape-2026/logo-ios.webp" alt="iOS" width="28" height="28" /> <img src="/images/slides/mobile-landscape-2026/logo-swift.webp" alt="Swift" width="28" height="28" /></td><td>Native iOS</td><td>Swift + SwiftUI</td><td>Apple</td><td>Native</td></tr>
    <tr><td><img src="/images/slides/mobile-landscape-2026/logo-kotlin.webp" alt="Kotlin" width="28" height="28" /></td><td>Kotlin Multiplatform</td><td>Kotlin</td><td>Android, iOS, Desktop, Web</td><td>Native (or Compose MP)</td></tr>
    <tr><td><img src="/images/slides/mobile-landscape-2026/logo-flutter.webp" alt="Flutter" width="28" height="28" /></td><td>Flutter</td><td>Dart</td><td>Android, iOS, Web, Desktop</td><td>Custom (Impeller)</td></tr>
    <tr><td><img src="/images/slides/mobile-landscape-2026/logo-react-native.webp" alt="React Native" width="28" height="28" /></td><td>React Native</td><td>JS / TS</td><td>Android, iOS, Web, Desktop</td><td>Native via JSI</td></tr>
    <tr><td><img src="/images/slides/mobile-landscape-2026/logo-dotnet-maui.webp" alt=".NET MAUI" width="28" height="28" /></td><td>.NET MAUI</td><td>C#</td><td>Android, iOS, Win, macOS</td><td>Native via .NET</td></tr>
    <tr><td><img src="/images/slides/mobile-landscape-2026/logo-ionic.webp" alt="Ionic" width="28" height="28" /></td><td>Ionic + Capacitor</td><td>HTML / CSS / JS</td><td>Android, iOS, Web, Desktop</td><td>WebView</td></tr>
    <tr><td><img src="/images/slides/mobile-landscape-2026/logo-pwa.webp" alt="PWA" width="28" height="28" /></td><td>PWA</td><td>HTML / CSS / JS</td><td>Web</td><td>Web</td></tr>
  </tbody>
</table>

---

<!-- .slide: class="slide-bg-pattern--grid" -->

## Quick rule-outs

<div class="slide-grid-2">
  <div class="fragment fade-up">
    <h3>Out</h3>
    <ul style="font-size:0.75em;list-style:none;padding-left:0;">
      <li style="display:flex;align-items:center;gap:0.3em;margin-bottom:0.3em;"><img src="/images/slides/mobile-landscape-2026/logo-android.webp" alt="" width="22" height="22" /><img src="/images/slides/mobile-landscape-2026/logo-ios.webp" alt="" width="22" height="22" /> <strong>Native only</strong> — I want to reach both</li>
      <li style="display:flex;align-items:center;gap:0.3em;margin-bottom:0.3em;"><img src="/images/slides/mobile-landscape-2026/logo-ionic.webp" alt="" width="22" height="22" /> <strong>Ionic / Capacitor</strong> — lived this, hit the ceiling</li>
      <li style="display:flex;align-items:center;gap:0.3em;margin-bottom:0.3em;"><img src="/images/slides/mobile-landscape-2026/logo-dotnet-maui.webp" alt="" width="22" height="22" /> <strong>.NET MAUI</strong> — not in the C# world</li>
      <li style="display:flex;align-items:center;gap:0.3em;margin-bottom:0.3em;"><img src="/images/slides/mobile-landscape-2026/logo-pwa.webp" alt="" width="22" height="22" /> <strong>PWA</strong> — need real device access</li>
      <li style="display:flex;align-items:center;gap:0.3em;margin-bottom:0.3em;"><img src="/images/slides/mobile-landscape-2026/logo-react-native.webp" alt="" width="22" height="22" /> <strong>React Native</strong> — solid, but JS-rooted</li>
    </ul>
  </div>
  <div class="fragment fade-up">
    <h3>Stays</h3>
    <ul style="font-size:0.75em;list-style:none;padding-left:0;">
      <li style="display:flex;align-items:center;gap:0.3em;margin-bottom:0.3em;"><img src="/images/slides/mobile-landscape-2026/logo-flutter.webp" alt="" width="22" height="22" /> <strong>Flutter</strong> — fastest path to a first result</li>
      <li style="display:flex;align-items:center;gap:0.3em;margin-bottom:0.3em;"><img src="/images/slides/mobile-landscape-2026/logo-kotlin.webp" alt="" width="22" height="22" /> <strong>Kotlin Multiplatform</strong> — the more defensible long-term bet</li>
    </ul>
  </div>
</div>

---

## Two philosophies, one path

<div class="slide-grid-2">
  <div>
    <h3 style="display:flex;align-items:center;justify-content:center;gap:0.3em;"><img src="/images/slides/mobile-landscape-2026/logo-flutter.webp" alt="" width="32" height="32" /> Flutter</h3>
    <p><em>"Trust our renderer, write once."</em></p>
    <ul>
      <li>Dart + Impeller engine</li>
      <li>Same UI on every platform — by design</li>
      <li>Hot reload, mature ecosystem</li>
    </ul>
  </div>
  <div>
    <h3 style="display:flex;align-items:center;justify-content:center;gap:0.3em;"><img src="/images/slides/mobile-landscape-2026/logo-kotlin.webp" alt="" width="32" height="32" /> Kotlin Multiplatform</h3>
    <p><em>"Share the logic, keep the UI native."</em></p>
    <ul>
      <li>Kotlin shared layer · native UI per platform</li>
      <li>Jetpack Compose ↔ SwiftUI on each side</li>
      <li>Recent but stable</li>
    </ul>
  </div>
</div>

---

<img src="/images/slides/mobile-landscape-2026/flutter-vs-kmp-structure-en.webp" alt="Folder structure comparison: Flutter with a single lib/ directory vs KMP with shared/, androidApp/, and iosApp/ as three coordinated blocks" width="980" height="551" style="display:block;margin:0 auto;" />

Note: This image shows the key architectural difference. In Flutter everything lives in lib/ — one place. In KMP you have three worlds: shared/ for common logic, androidApp/ with Jetpack Compose, iosApp/ with SwiftUI. KMP doesn't replace SwiftUI or Compose, it lives under them.

---

<img src="/images/slides/mobile-landscape-2026/flutter-vs-kmp-architecture-en.webp" alt="Internal architecture diagram: Flutter with Impeller engine drawing all UI vs KMP with native UI per platform and shared Kotlin logic" width="980" height="551" style="display:block;margin:0 auto;" />

Note: The key contrast: Flutter runs everything through its own rendering engine (Impeller/Skia) — one engine draws everything. KMP lets each platform draw its own native UI and only shares the logic underneath. Both are cross-platform, but with opposite philosophies.

---

## The best of each

<div class="slide-grid-2">
  <div>
    <h3 style="display:flex;align-items:center;justify-content:center;gap:0.3em;"><img src="/images/slides/mobile-landscape-2026/logo-flutter.webp" alt="" width="28" height="28" /> Flutter</h3>
    <ul>
      <li>🚀 Instant hot reload — ultra-fast iteration</li>
      <li>🎨 One UI for all platforms</li>
      <li>📦 Mature ecosystem (pub.dev, plugins, community)</li>
      <li>⚡ Impeller engine — consistent 60fps</li>
    </ul>
  </div>
  <div>
    <h3 style="display:flex;align-items:center;justify-content:center;gap:0.3em;"><img src="/images/slides/mobile-landscape-2026/logo-kotlin.webp" alt="" width="28" height="28" /> KMP</h3>
    <ul>
      <li>🔧 100% native UI on each platform</li>
      <li>🔄 Shared logic without compromising UX</li>
      <li>🏢 JetBrains backed + official Google support</li>
      <li>📈 Migratable adoption — integrates into existing apps</li>
    </ul>
  </div>
</div>

<p style="text-align:center;margin-top:0.8em;font-size:0.85em;color:#64748b;"><em>Both are solid bets — but they solve different problems.</em></p>

---

## Nothing is free

<div class="slide-grid-2">
  <div>
    <h3 style="display:flex;align-items:center;justify-content:center;gap:0.3em;"><img src="/images/slides/mobile-landscape-2026/logo-flutter.webp" alt="" width="28" height="28" /> Flutter</h3>
    <ul>
      <li>⚠️ Dart only exists for Flutter</li>
      <li>⚠️ UI doesn't fully belong to either platform</li>
      <li>❌ Custom renderer ≠ true native feel</li>
    </ul>
  </div>
  <div>
    <h3 style="display:flex;align-items:center;justify-content:center;gap:0.3em;"><img src="/images/slides/mobile-landscape-2026/logo-kotlin.webp" alt="" width="28" height="28" /> KMP</h3>
    <ul>
      <li>⚠️ Steeper learning curve</li>
      <li>⚠️ Two UI layers to maintain (unless Compose MP)</li>
      <li>❌ Xcode integration still rough at the edges</li>
    </ul>
  </div>
</div>

<p style="text-align:center;margin-top:0.8em;font-size:0.85em;color:#64748b;"><em>Every path has a toll — the question is which one you're willing to pay.</em></p>

---

<!-- .slide: data-background-gradient="linear-gradient(135deg, #7F52FF 0%, #0f1124 100%)" -->

<div style="text-align:center;">
  <span class="eyebrow" style="color:#c4b5fd;">Act 3</span>
  <p style="font-size:1.4em;color:#c4b5fd;margin-bottom:0.2em;">My choice</p>
  <img src="/images/slides/mobile-landscape-2026/logo-kotlin.webp" alt="Kotlin" width="80" height="80" style="display:block;margin:0.4em auto;" />
  <h2 style="font-size:2.2em;color:#ffffff;margin:0.2em 0;">Kotlin Multiplatform</h2>
  <p style="font-size:1em;color:#e2e8f0;margin-top:0.5em;">True native UI · shared logic · progressive migration<br/>The long game is worth the learning curve.</p>
</div>

Note: This is the moment to declare the bet. KMP is not the easy path — it's the defensible one. Native UI on each platform, shared logic in Kotlin, and the ability to migrate existing apps without rewriting everything.

---

<div class="slide-stat">
  <span class="slide-stat__number">7% → 18%</span>
  <span class="slide-stat__label">KMP adoption growth among developers in a single year</span>
  <p class="slide-stat__context">Source: <a href="https://www.jetbrains.com/lp/devecosystem-2025/" target="_blank">JetBrains Developer Ecosystem Survey 2024–2025</a></p>
</div>

---

## KMP — the long road to here

<ul class="slide-timeline">
  <li><time>2017</time><span>Introduced in Kotlin 1.2 at KotlinConf</span></li>
  <li><time>Nov 2023</time><span>KMP declared stable</span></li>
  <li><time>May 2025</time><span>Compose Multiplatform for iOS goes stable</span></li>
  <li><time>Jan 2026</time><span>Compose MP 1.10.0 released</span></li>
  <li><time>2026</time><span>Google migrating Jetpack libs (Room, DataStore, ViewModel) to KMP</span></li>
</ul>

---

## Who's already using KMP in production?

<table class="slide-table" style="font-size:0.6em;">
  <thead>
    <tr><th>Company</th><th>Code Sharing</th><th>Impact</th></tr>
  </thead>
  <tbody>
    <tr><td><strong>McDonald's</strong></td><td>70%+</td><td>6.5M purchases/month · 69M daily customers · 50+ countries</td></tr>
    <tr><td><strong>Duolingo</strong></td><td>80%</td><td>40M+ weekly active users · simultaneous iOS and Android releases</td></tr>
    <tr><td><strong>Airbnb</strong></td><td>95%</td><td>Release cycle from monthly to weekly in 6 months</td></tr>
    <tr><td><strong>Google Docs</strong></td><td>—</td><td>Google Docs for iOS runs KMP in production</td></tr>
    <tr><td><strong>Netflix</strong></td><td>~50%</td><td>TV/movie production apps · offline-first</td></tr>
    <tr><td><strong>Cash App</strong></td><td>—</td><td>7+ years in production · real financial transactions</td></tr>
    <tr><td><strong>Forbes</strong></td><td>80%+</td><td>Simultaneous feature rollout across platforms</td></tr>
    <tr><td><strong>Philips</strong></td><td>—</td><td>Medical device SDK (HealthSuite)</td></tr>
  </tbody>
</table>

<p style="text-align:center;margin-top:0.5em;font-size:0.55em;color:#64748b;">Sources: <a href="https://kotlinlang.org/case-studies/" target="_blank">Kotlin Case Studies</a> · <a href="https://blog.jetbrains.com/kotlin/2025/12/industry-leaders-on-the-kotlinconf25-stage/" target="_blank">KotlinConf 2025</a> · <a href="https://netflixtechblog.com/netflix-android-and-ios-studio-apps-kotlin-multiplatform-d6d4d8d25d23" target="_blank">Netflix TechBlog</a></p>

Note: This isn't hype — these are companies processing millions of real transactions. McDonald's with 6.5 million purchases per month. Cash App with 7 years in production handling real money. Google using KMP in their own Google Docs. The question is no longer "is it ready?" but "when do we start?"

---

## The community and backing behind Kotlin

<div class="slide-grid-2">
  <div>
    <h3>📊 Numbers</h3>
    <ul style="font-size:0.8em;">
      <li><strong>2.5 million</strong> developers worldwide</li>
      <li><strong>1.65M</strong> repositories on GitHub</li>
      <li><strong>100K+</strong> members on Kotlin Slack</li>
      <li><strong>400+</strong> universities teaching Kotlin</li>
      <li><strong>100+</strong> engineers on the core team (JetBrains + Google)</li>
      <li><strong>350+</strong> independent contributors</li>
    </ul>
  </div>
  <div>
    <h3>🏛️ Kotlin Foundation</h3>
    <ul style="font-size:0.8em;">
      <li><strong>JetBrains</strong> — language creators</li>
      <li><strong>Google</strong> — official Android language</li>
      <li><strong>Meta</strong> — first Gold Member (2025)</li>
      <li><strong>Uber · Block · Gradle</strong></li>
      <li><strong>Touchlab · Kotzilla</strong></li>
      <li>Spring Boot — formal partnership (2025)</li>
    </ul>
  </div>
</div>

<p style="text-align:center;margin-top:0.5em;font-size:0.55em;color:#64748b;">Source: <a href="https://kotlinfoundation.org/" target="_blank">Kotlin Foundation</a> · <a href="https://devnewsletter.com/p/state-of-kotlin-2026" target="_blank">State of Kotlin 2026</a></p>

Note: Kotlin isn't a one-company project. It has a foundation with Google, Meta, Uber, and Block as members. 2.5 million developers. Spring Boot as an official partnership. This isn't going away tomorrow.

---

## You don't need to be an expert to start <!-- .element: style="font-size:1.3em;" -->

<div class="fragment fade-up" style="text-align:center;margin-top:0.6em;">
  <p style="font-size:1.1em;color:#E51641;">🤖 AI changed the rules of the game</p>
</div>

<div class="fragment fade-up" style="margin-top:0.5em;">
  <ul style="font-size:0.85em;">
    <li>Before: learning a new ecosystem = <strong>months of learning curve</strong></li>
    <li>Now: with <strong>coding agents</strong> + the right direction = exponential progress</li>
    <li>AI doesn't replace your judgment — <strong>it amplifies your speed</strong></li>
  </ul>
</div>

<div class="fragment fade-up" style="text-align:center;margin-top:0.8em;padding:0.6em;background:linear-gradient(135deg,rgba(229,22,65,0.1),rgba(21,46,69,0.15));border-radius:12px;">
  <p style="font-size:1em;margin:0;">🧭 <strong>Research</strong> + 🤖 <strong>AI as copilot</strong> + 🎯 <strong>Clear direction</strong></p>
  <p style="font-size:1.2em;margin-top:0.4em;color:#E51641;"><em>= No more excuses not to start</em></p>
</div>

Note: The closing ties everything together: the barrier to entry from years ago no longer exists in the same way. Coding agents allow someone with backend experience to explore mobile with real speed. You don't need to be an expert — you need direction and the right tools.

---

## 📖 Series: Working with Agents <!-- .element: style="font-size:1.1em;" -->

<img src="/images/blog/series/working-with-agents/hero-en.webp" alt="Working with Agents Series" width="580" height="326" style="display:block;margin:0 auto;border-radius:10px;">

<p style="text-align:center;margin-top:0.4em;font-size:0.7em;">From writing code to orchestrating AI agents — the new role, real workflows, what breaks, judgment, context, and team adoption.</p>

<p style="text-align:center;margin-top:0.3em;font-size:0.85em;"><a href="https://xergioalex.com/blog/series/working-with-agents" target="_blank">xergioalex.com/blog/series/working-with-agents</a></p>

Note: Natural plug for the series. Connects directly with the previous slide about coding agents and AI. The series goes deep into everything that's only briefly mentioned here.

---

<!-- .slide: data-background="#0f1124" -->

<p style="font-size:0.7em;text-transform:uppercase;letter-spacing:0.2em;color:#64748b;margin-bottom:0.2em;">ACT 4</p>

<div style="display:flex;align-items:center;justify-content:center;gap:0.4em;">
  <img src="/images/slides/mobile-landscape-2026/logo-kotlin.webp" alt="Kotlin" width="48" height="48" />
  <h2 style="margin:0;font-size:1.8em;">Demos</h2>
</div>

<img src="/images/slides/mobile-landscape-2026/homers-web-page.gif" alt="Homer's Web Page" width="380" height="238" style="display:block;margin:0.35em auto;border-radius:10px;">

Note: Time to show real code and working apps. Homer's Web Page as a metaphor for the first web attempts we all made.

---

## 1. KMP Starter

<img src="/images/slides/mobile-landscape-2026/demo-kmpstarter.webp" alt="KMP Starter on Android" width="165" height="294" style="display:block;margin:0 auto;border-radius:8px;">

<p style="text-align:center;font-size:0.65em;margin-top:0.2em;color:#374151;">Base template — Android, iOS, Desktop, Web from a single module</p>

<p style="text-align:center;margin-top:0.2em;font-size:0.7em;"><a href="https://github.com/xergioalex/kmpstarter" target="_blank">github.com/xergioalex/kmpstarter</a></p>

Note: Reusable template. All apps that follow were born from this starter with AGENTS.md ready for coding agents.

---

## 2. Flutter Starter

<img src="/images/slides/mobile-landscape-2026/demo-flutterstarter.webp" alt="Flutter Starter on Android" width="165" height="294" style="display:block;margin:0 auto;border-radius:8px;">

<p style="text-align:center;font-size:0.65em;margin-top:0.2em;color:#374151;">Flutter base template — comparing DX side by side with KMP</p>

<p style="text-align:center;margin-top:0.2em;font-size:0.7em;"><a href="https://github.com/xergioalex/flutterstarter" target="_blank">github.com/xergioalex/flutterstarter</a></p>

Note: Same starter concept but in Flutter. Allows comparing DX, structure, and iteration speed between both frameworks.

---

## 3. KMP Todo App

<img src="/images/slides/mobile-landscape-2026/demo-kmptodoapp.webp" alt="KMP Todo App on Android" width="165" height="294" style="display:block;margin:0 auto;border-radius:8px;">

<p style="text-align:center;font-size:0.65em;margin-top:0.2em;color:#374151;">Full CRUD — filters, search, themes, i18n, SQLite</p>

<p style="text-align:center;margin-top:0.2em;font-size:0.7em;"><a href="https://github.com/xergioalex/kmptodoapp" target="_blank">github.com/xergioalex/kmptodoapp</a></p>

Note: Full CRUD with SQLDelight persistence, Material 3, dark mode, and native share per platform. Proves KMP works for real apps.

---

## 4. KMP Tap Duel Game

<div style="display:flex;justify-content:center;gap:0.3em;">
  <img src="/images/slides/mobile-landscape-2026/demo-kmptapduel-1.webp" alt="Tap Duel - start" width="120" height="213" style="border-radius:6px;">
  <img src="/images/slides/mobile-landscape-2026/demo-kmptapduel-2.webp" alt="Tap Duel - playing" width="120" height="213" style="border-radius:6px;">
  <img src="/images/slides/mobile-landscape-2026/demo-kmptapduel-3.webp" alt="Tap Duel - winner" width="120" height="213" style="border-radius:6px;">
</div>

<p style="text-align:center;font-size:0.65em;margin-top:0.2em;color:#374151;">Local 2-player duel — shared UI smooth even in a game</p>

<p style="text-align:center;margin-top:0.2em;font-size:0.7em;"><a href="https://github.com/xergioalex/kmptapduelgame" target="_blank">github.com/xergioalex/kmptapduelgame</a></p>

Note: Pure Kotlin game engine in commonMain with unit tests. Compose Multiplatform handling rapid gesture input across all platforms.

---

## 5. KMP AI Chat

<div style="display:flex;justify-content:center;gap:0.4em;">
  <img src="/images/slides/mobile-landscape-2026/demo-kmpaichat-1.webp" alt="KMP AI Chat - empty" width="148" height="265" style="border-radius:8px;">
  <img src="/images/slides/mobile-landscape-2026/demo-kmpaichat-2.webp" alt="KMP AI Chat - conversation" width="148" height="265" style="border-radius:8px;">
</div>

<p style="text-align:center;font-size:0.65em;margin-top:0.2em;color:#374151;">AI Chat — OpenAI API + Ktor + reactive UI</p>

<p style="text-align:center;margin-top:0.2em;font-size:0.7em;"><a href="https://github.com/xergioalex/kmpaichat" target="_blank">github.com/xergioalex/kmpaichat</a></p>

Note: Demonstrates external API integration, BuildConfig for API keys, and UI state management with StateFlow.

---

## 6. KMP AI Voice Chat

<img src="/images/slides/mobile-landscape-2026/demo-kmpaivoicechat.webp" alt="KMP AI Voice Chat on iOS" width="165" height="294" style="display:block;margin:0 auto;border-radius:8px;">

<p style="text-align:center;font-size:0.65em;margin-top:0.2em;color:#374151;">Text + voice + realtime conversation via WebSocket</p>

<p style="text-align:center;margin-top:0.2em;font-size:0.7em;"><a href="https://github.com/xergioalex/kmpaivoicechat" target="_blank">github.com/xergioalex/kmpaivoicechat</a></p>

Note: expect/actual for native audio (AudioRecord on Android, AVAudioEngine on iOS). WebSocket streaming PCM16 24kHz. The most advanced demo in terms of native integration.

---

## 7. KMP PTT Dynamics

<div style="display:flex;justify-content:center;gap:0.3em;">
  <img src="/images/slides/mobile-landscape-2026/demo-kmppttdynamics-1.webp" alt="PTT Dynamics - profile" width="100" height="178" style="border-radius:6px;">
  <img src="/images/slides/mobile-landscape-2026/demo-kmppttdynamics-2.webp" alt="PTT Dynamics - lobby" width="100" height="178" style="border-radius:6px;">
  <img src="/images/slides/mobile-landscape-2026/demo-kmppttdynamics-3.webp" alt="PTT Dynamics - avatars" width="100" height="178" style="border-radius:6px;">
  <img src="/images/slides/mobile-landscape-2026/demo-kmppttdynamics-4.webp" alt="PTT Dynamics - room" width="100" height="178" style="border-radius:6px;">
</div>

<p style="text-align:center;font-size:0.65em;margin-top:0.2em;color:#374151;">Live meetup dynamics — the app we'll use today</p>

<p style="text-align:center;margin-top:0.2em;font-size:0.7em;"><a href="https://github.com/xergioalex/kmppttdynamics" target="_blank">github.com/xergioalex/kmppttdynamics</a></p>

Note: App with real backend (Firebase/Supabase), multiple simultaneous dynamics, and realtime updates across all connected devices. The one we'll try live.

---

<!-- .slide: data-background="#0f1124" -->

<img src="/images/slides/mobile-landscape-2026/speaker-photo.webp" alt="Sergio Alexander Flórez" width="180" height="180" style="display:block;margin:0 auto;border-radius:50%;border:3px solid #E51641;">

<h2 style="margin-top:0.5em;color:#ffffff;">Thank you!</h2>

<p style="text-align:center;font-size:0.85em;color:#e2e8f0;margin-top:0.3em;">Sergio Alexander Flórez Galeano</p>

<div style="text-align:center;margin-top:0.5em;font-size:0.8em;">
  <p>🌐 <a href="https://xergioalex.com" target="_blank">xergioalex.com</a></p>
  <p>🐦 <a href="https://twitter.com/xergioalex" target="_blank">@xergioalex</a></p>
  <p>💻 <a href="https://github.com/xergioalex" target="_blank">github.com/xergioalex</a></p>
  <p>💼 <a href="https://linkedin.com/in/xergioalex" target="_blank">linkedin.com/in/xergioalex</a></p>
</div>

Note: Closing slide. Thank the audience and share contact channels.

