---
title: 'Kotlin Multiplatform from zero: sharing code without giving up native'
description: 'An introduction to Kotlin Multiplatform: its history, why it keeps gaining ground, and what makes it different from other ways to build Android and iOS apps.'
draft: true
pubDate: '2026-05-02'
heroLayout: 'side-by-side'
tags: ["tech", "mobile", "kotlin", "flutter"]
keywords: ['Kotlin Multiplatform', 'KMP', 'mobile development', 'Android iOS', 'Compose Multiplatform', 'cross-platform apps']
series: 'learning-mobile-development'
seriesOrder: 2
---

# Kotlin Multiplatform from zero: sharing code without giving up native

This year I decided I was finally going to learn mobile development for real.

I'm not a mobile expert. My world has been backend, web, infrastructure. But in 2026 I committed to changing that, and the first stop was mapping the territory: what are the options today for building apps that run on both Android and iOS? In the previous chapter I walked through that landscape and pointed at two paths that caught my attention — Flutter and Kotlin Multiplatform. Flutter for its community and development speed. KMP for something different: because it doesn't pull you away from native, because it gives you control, because you can start small.

And KMP was the one that hooked me more.

Not because it's the most popular option or the easiest one. But because it proposes something that feels more honest about how mobile development actually works. That's why this chapter is my first real dive into that proposal.

---

For years, mobile development has been stuck in an uncomfortable dilemma.

On one side, there's the native path: build one app for Android and another for iOS, each with its own tools, teams, patterns, and technical decisions. It's the most natural way to make the most of each platform, but it also brings a very familiar consequence — duplicating logic, duplicating bugs, duplicating effort, and more often than not, duplicating frustration.

On the other side, there are the more traditional cross-platform approaches: write a single app for multiple platforms. That idea sounds beautiful in theory. One codebase, one team, one way to build. But in practice it often comes with a hard question: how much of the native experience are you willing to sacrifice?

And right in the middle of that tension, Kotlin Multiplatform shows up.

Not as a magic promise of "write once and forget the rest." Not as another framework trying to replace everything that already exists. And maybe that's exactly why it's becoming so interesting.

Kotlin Multiplatform proposes something more pragmatic: share code where it adds value, without moving away from native development tools and experience.

That sentence captures well why it's worth taking seriously.

## Not just another cross-platform technology

When you hear "cross-platform," it's easy to lump everything together: Flutter, React Native, .NET MAUI, Ionic, webviews, wrappers, frameworks promising infinite productivity.

But Kotlin Multiplatform has a different personality. And the difference isn't surface-level.

Its main idea isn't necessarily that you share 100% of the app. It's that you can share the parts that make sense to share: business logic, models, validations, networking, persistence, domain rules, use cases, data processing, and if you want, part of the UI as well.

But it doesn't force you to abandon the native world.

You can have an Android app with its Android experience. You can have an iOS app with its iOS experience. And in the middle, a shared Kotlin layer that stops you from writing the same logic twice.

That changes the conversation.

Because the real problem in mobile isn't always drawing buttons twice. Often the pain is somewhere else: duplicated business rules, different responses to the same case, bugs fixed on Android but forgotten on iOS, repeated integrations, validation logic that slowly drifts out of sync over time.

Kotlin Multiplatform tries to attack exactly there. It doesn't promise to eliminate all complexity. It promises to help you share better the complexity that shouldn't be duplicated.

## The story starts long before the hype

Kotlin Multiplatform didn't appear out of nowhere.

The story goes back several years, to when JetBrains started thinking about Kotlin not just as a language for the JVM or for Android, but as a language capable of living across multiple platforms.

In 2017, with Kotlin 1.2 Beta, JetBrains introduced multiplatform projects as an experimental feature. The initial idea was to allow part of the code to live in a common module, with each platform providing its own implementations when needed. At the time, the focus was more on sharing code between JVM and JavaScript — but that's where the seed was already planted for what we'd later come to know as Kotlin Multiplatform. [^kotlin12]

The idea was powerful, but still early.

During those first years, KMP sounded interesting to people deep into Kotlin, but it wasn't an obvious choice for mobile teams. There was potential, sure — but also a lot of unanswered questions: tooling, iOS interoperability, memory, libraries, configuration, developer experience.

It was a promise under construction.

## The mobile moment: Kotlin Multiplatform Mobile

The point where the story becomes much more relevant for mobile comes in 2020.

That year JetBrains announced Kotlin Multiplatform Mobile — KMM — in Alpha. The pitch was direct: use the same business logic in both Android and iOS applications. [^kmm-alpha]

That detail matters: the focus wasn't "let's build a universal app that looks the same everywhere." It was more specific — and for many teams, more realistic: let's share the logic that shouldn't be duplicated.

KMM came with an attractive narrative for mobile teams: keep using native development, but share a critical part of the code.

For Android, it made a lot of sense. Kotlin was already an official and widely adopted language in the Android ecosystem. For iOS, the challenge was bigger — the Kotlin code had to coexist well with Swift, Xcode, and the expectations of the Apple world.

That kicked off a slow but important maturation phase. KMM wasn't perfect. There was friction. Parts of the ecosystem were still green. But the idea was good enough for many teams to start taking it seriously.

## From experiment to serious option

In 2022, Kotlin Multiplatform Mobile moved to Beta. JetBrains presented it as a way to maintain a shared foundation for networking, storage, analytics, and other logic layers across Android and iOS apps. [^kmm-beta]

That step marked a change in tone. It was no longer "this might be interesting." It was: "this is maturing, there's a clear direction, it's worth taking more seriously." Companies like Netflix, Philips, and Baidu were already testing it in production.

And then came the inflection point.

In November 2023, JetBrains declared Kotlin Multiplatform stable and production-ready. [^kmp-stable]

That moment changed the perception. KMP stopped feeling like an experimental bet and started looking like a real strategy. Around that same time, the name Kotlin Multiplatform also consolidated again — leaving behind the idea that this was exclusively "Kotlin Multiplatform Mobile."

And that makes sense.

Because KMP isn't just mobile. It can target Android, iOS, desktop, web, and server. But mobile remains, probably, the use case that gets the most attention — because it's where the pain of duplicating code across platforms is felt most strongly.

## The big shift: sharing UI is starting to be real too

For a long time, the most sensible way to talk about Kotlin Multiplatform was this:

> Share the logic, keep the native UI.

And that's still a very valid strategy.

In fact, for many teams it's probably still the best way to start. You can keep SwiftUI or UIKit on iOS, Jetpack Compose or native views on Android, and share the business logic in Kotlin.

But the story changed quite a bit with Compose Multiplatform.

Compose Multiplatform is a UI framework built on top of Kotlin Multiplatform. It lets you create shared interfaces using a declarative approach similar to Jetpack Compose on Android. And the big question for a long time was whether it could really be a serious option for iOS.

In May 2025, with version 1.8.0, JetBrains announced that Compose Multiplatform for iOS was stable and production-ready. [^compose-ios-stable] The announcement wasn't just declarative: startup performance showed parity with native apps, and more than 96% of surveyed teams reported no significant performance issues.

That doesn't mean everyone should share 100% of the UI. But it does mean something important: KMP stopped being exclusively a shared-logic story. Now it can also be a shared-UI story — at least for certain products, teams, and use cases.

Today you can think about KMP at three levels:

1. Share only logic.
2. Share logic and architecture.
3. Share logic, architecture, and UI with Compose Multiplatform.

That flexibility is one of its greatest strengths.

## So what makes it special?

What's special about Kotlin Multiplatform isn't simply "reuse code."

What's special is that it doesn't force you into an extreme answer.

It doesn't say: "duplicate everything because native is sacred." And it doesn't say: "abandon native because a single codebase is always better." KMP says something more interesting:

> Share what makes sense to share. Keep native what makes sense to keep native.

That idea is less spectacular in marketing terms, but more powerful in practice.

Because real apps aren't demos. Real apps have technical debt, integrations, edge cases, product decisions, design changes, dependencies, platform-specific APIs, performance concerns, accessibility, analytics, offline behavior, push notifications, permissions, store publishing, and teams with different areas of expertise.

In that context, a solution that doesn't try to erase the differences between platforms — but to coexist better with them — starts to sound very appealing.

## The difference versus Flutter or React Native

This comparison has to be made carefully. It's not about saying one technology is good and the others are bad.

Flutter is excellent if you want to build an app with a shared, consistent UI controlled from a single codebase. React Native has also been a strong option for teams coming from the JavaScript world who want to move fast in mobile.

But Kotlin Multiplatform starts from a different philosophy.

Flutter and React Native answer the question: "How do I build a cross-platform app from a single development experience?" KMP answers a different question: "How do I share code across platforms without moving away from building close to native?"

That difference seems subtle. It isn't. Imagine an Android team that already has two years of business logic written in Kotlin: with KMP they can start sharing that logic with iOS without rewriting a single screen, without changing their CI pipeline, without the iOS team needing to touch Kotlin if they don't want to. With Flutter or React Native, that kind of incremental adoption doesn't exist — or it exists at a much higher cost.

With KMP you can adopt the technology gradually. You can start by sharing a small layer, learn, measure the value, and then decide whether it makes sense to share more.

That incremental approach makes it very interesting for teams with existing apps, teams with Android experience, or products that don't want to give up a polished native experience.

## The current state: no longer a promise, but not magic either

Today Kotlin Multiplatform is in a much more mature stage.

JetBrains presents it as production-ready for its supported platforms. The official page describes KMP as a technology for reusing code across Android, iOS, desktop, web, and server while keeping the benefits of native programming. And it clarifies that Compose Multiplatform is stable for Android, iOS, and desktop, while the web target remains in Beta. [^kmp-overview]

That's important to say honestly.

KMP is no longer a simple experimental promise. But it's not a magic wand either. There's still complexity. There's Gradle. There's configuration. There are architecture decisions. You need to think more carefully about how to structure iOS interoperability.

And maybe that's exactly why I find it so interesting.

Because instead of selling us the fantasy that mobile development can be completely uniform, it acknowledges a more uncomfortable truth: Android and iOS are different, and sometimes that difference matters. The question isn't how to hide that difference. The question is how to avoid duplicating what shouldn't be duplicated.

## Why it's gaining so much ground right now

I think Kotlin Multiplatform is gaining ground for a mix of reasons.

First, because the problem it solves is real. The duplication between Android and iOS keeps being costly, especially as business logic starts to grow.

Second, because Kotlin already has a very strong position in Android. For many teams, KMP doesn't feel like learning a completely new universe — it feels like extending something they already know.

Third, because the technology matured. The jump to stable in 2023 and the arrival of Compose Multiplatform for iOS stable in May 2025 changed the conversation. We're no longer just talking about experiments or demos.

Fourth, because it offers an attractive middle ground. In a world where many tools promise to replace everything, KMP stands out for being more flexible: you can share a little, share a lot, or share almost everything, depending on the context.

And fifth, because it fits with a broader trend in software: we increasingly value architectures that let us move fast without locking ourselves into an overly rigid abstraction.

Kotlin Multiplatform doesn't force you to marry a single way of building. It gives you a strategy.

## How I like to think about it

For me, Kotlin Multiplatform is best understood through this idea:

> It's not about sharing more code. It's about duplicating less pain.

Because that's the point.

Sharing code for the sake of sharing code isn't always a good idea. Sometimes sharing too much can become a burden — a common abstraction that ends up being harder to maintain than two separate implementations. That happens too.

But there are parts of an app where duplication really hurts: business rules, validations, models, use cases, synchronization logic, network clients, storage, calculations, data transformations.

That's where KMP can shine. And if the team, product, and maturity level allow for it, it can also start sharing UI with Compose Multiplatform.

The valuable thing is that you don't have to start there. You can start small. You can share one layer, learn, measure, decide.

That progressive approach is one of the reasons Kotlin Multiplatform feels so concrete for real teams.

## What I want to learn now

Honestly, this is one of those technologies I'd rather learn by building.

I don't want to get stuck in the eternal comparison of "Flutter vs React Native vs Kotlin Multiplatform." That comparison can be useful, but it gets shallow fast. The question that interests me most is a different one:

> What kinds of apps become easier to build when we can share the logic without giving up native?

That question opens up more concrete possibilities. Small apps. Experiments. MVPs. Internal tools. Community apps. Tools that need Android and iOS but don't justify duplicating all the logic from scratch.

KMP doesn't have to start as a big corporate bet. It can also start as a way to learn modern mobile from a broader perspective. And that's exactly what I find exciting about it.

## Closing

Kotlin Multiplatform went from being an experimental idea to becoming a serious strategy for building software across platforms.

Its story isn't that of a technology trying to destroy native. It's almost the opposite: a technology that acknowledges that native matters, but also acknowledges that duplicating everything doesn't always make sense.

That's why I think it's worth learning. Not because it's the universal answer. Not because it's going to replace all the other options. But because it proposes a more mature way of thinking about mobile development: share where it adds value, keep native where it matters, build with more intention.

And if the future of mobile development looks a little like that, I want to understand it.

Let's keep building.

---

## References

[^kotlin12]: JetBrains introduced multiplatform projects as an experimental feature in Kotlin 1.2 Beta in 2017: https://blog.jetbrains.com/kotlin/2017/09/kotlin-1-2-beta-is-out/
[^kmm-alpha]: JetBrains announced Kotlin Multiplatform Mobile Alpha in August 2020: https://blog.jetbrains.com/kotlin/2020/08/kotlin-multiplatform-mobile-goes-alpha/
[^kmm-beta]: JetBrains announced Kotlin Multiplatform Mobile Beta in October 2022: https://blog.jetbrains.com/kotlin/2022/10/kmm-beta/
[^kmp-stable]: JetBrains declared Kotlin Multiplatform stable and production-ready in November 2023: https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-stable/
[^compose-ios-stable]: JetBrains announced Compose Multiplatform 1.8.0 with stable, production-ready iOS support in May 2025: https://blog.jetbrains.com/kotlin/2025/05/compose-multiplatform-1-8-0-released-compose-multiplatform-for-ios-is-stable-and-production-ready/
[^kmp-overview]: Official Kotlin Multiplatform page: https://kotlinlang.org/multiplatform/
