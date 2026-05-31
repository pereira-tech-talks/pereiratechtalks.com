---
title: "Why I Ditched ESLint + Prettier for Biome"
description: "After years of chasing ESLint upgrades and managing the Prettier conflict dance, I switched to Biome. One config file, one binary, and I haven't looked back."
pubDate: '2026-03-06'
heroImage: '/images/blog/posts/why-i-ditched-eslint-prettier-for-biome/hero.webp'
heroLayout: 'side-by-side'
tags: ["tech", "web-development", "javascript", "astro"]
keywords: ["replace ESLint Prettier with Biome", "Biome linter formatter", "ESLint v9 flat config problems", "Biome vs ESLint performance", "Biome single config file", "migrate ESLint to Biome", "Biome Rust linter JavaScript"]
---

I bumped the ESLint and Prettier versions, ran `npm install`, and watched the project break. Again. Third time in a few months.

Every ESLint upgrade was the same ritual: run the command and pray nothing breaks. Best case, I'd end up refactoring types, adjusting formatting, and touching several parts of the codebase. Worst case — and this happened often — there were incompatibilities with other libraries that depended on the previous version, and I'd spend hours doing cascading upgrades until everything worked again. If you've ever run `apt upgrade` on Ubuntu or Arch and sat there staring at the terminal praying the boot grub doesn't break again, you know exactly the feeling.

That was the moment I started actually looking at alternatives.

---

## The years when it worked

I want to be fair. ESLint and Prettier work well together — and they still do. I used them on multiple projects — the [Pereira Tech Talks](https://www.pereiratechtalks.org/) site, personal projects, work projects at [DailyBot](https://www.dailybot.com). Set up once, forget about it. Run on save, run on CI. The code comes out consistently formatted. Imports sorted. Semicolons where expected.

A lot of my projects still use them — migrating an existing project has its cost and it's not always worth it. But for every new project, Biome is my default now.

What changed wasn't that the tools stopped working. What changed is that the ecosystem around them got complicated in a way that made every upgrade feel like a negotiation.

At some point I had a VS Code setup with both ESLint and Prettier configured as formatters. I didn't realize the issue until I noticed my files were flickering on save. ESLint would run, reformat the code one way. Prettier would run, reformat it back. Or sometimes the other direction. The file would visibly jump — you could see the indentation change and change back in under a second. I thought it was my IDE acting up before I realized it was two opinionated tools fighting over the same text.

The fix was `eslint-config-prettier` — a package that disables all the ESLint formatting rules that overlap with Prettier. A package that exists solely because two tools have overlapping opinions and someone has to be told to stop talking. You install it, you put `"prettier"` at the end of your ESLint `extends` array, you configure VS Code to use only Prettier as the formatter on save. Three steps to solve a problem that shouldn't exist.

It worked. But you were carrying that knowledge in your head forever — the exact order, the exact config entry, the exact VS Code setting. Change one thing and the fight started again.

---

## The config file collection

Here's what a real ESLint + Prettier + TypeScript setup actually requires:

- `.eslintrc.js` (or `.json`, or `.yml`, or `.cjs` — pick your flavor)
- `.prettierrc` (or `.prettierrc.json`, or `.prettierrc.js`)
- `.eslintignore`
- `.prettierignore`
- `eslint-config-prettier` — to disable the ~100 ESLint formatting rules that fight with Prettier
- `eslint-plugin-prettier` — if you want Prettier errors to show as ESLint errors
- `@typescript-eslint/parser` and `@typescript-eslint/eslint-plugin` — for TypeScript support

Run `npm install` on a fresh project. Watch over a hundred packages hit your `node_modules`. Just for linting and formatting.

And then there's the configuration order issue — Prettier overrides *must* come last in your ESLint config, otherwise the formatting rules fight. Get it wrong and you're back to the flickering I mentioned. I've debugged that exact problem more times than I'd like to admit.

---

## The flat config migration

With [ESLint v9](https://eslint.org/blog/2024/04/eslint-v9.0.0-released/) came "flat config" — a new configuration format that replaced the old `.eslintrc` system.

In theory it was cleaner. A single `eslint.config.js` file, JavaScript-native, explicit imports. In practice — the ESLint team themselves published a retrospective about the v9 launch, and here's what they wrote:

> Initial online sentiment was largely negative, with users saying [the release] 'wasn't ready', 'didn't work', or even 'broke the ecosystem'. Some postponed upgrading while others considered switching tools altogether.

That's from the [ESLint team's own post-mortem](https://eslint.org/blog/2025/05/eslint-v9.0.0-retrospective/). They wrote that about their own release.

What went wrong? The new flat config syntax was — to use the charitable word — verbose. Plugins suddenly needed to expose their configurations differently, and they didn't all do it the same way. Some exported an object. Some exported an array. Some hadn't updated at all, so you needed `FlatCompat` from `@eslint/eslintrc` just to load them. Users hit a wall of `TypeError: context.getScope is not a function` errors for plugins that hadn't caught up.

The GitHub discussions told the story. One asked [why there were 7+ different ways to use plugins](https://github.com/eslint/eslint/discussions/20500) with flat config. Another was [the ESLint team themselves asking for migration feedback](https://github.com/eslint/eslint/discussions/18456) — and what they got back wasn't pretty. The [ecosystem tracking issue](https://github.com/eslint/eslint/issues/18093) showed how many plugins were still not updated months later.

The team's eventual response was to bring `extends` back. Via `defineConfig()`. A feature they'd removed because it was "unnecessary in flat config." They removed it, got user feedback, then re-added it. That sequence tells you something about how the rollout went.

And then the next major version dropped. The old `eslintrc` system — the one everyone had been using for years — was completely removed. No gradual phase-out, no grace period. If you hadn't migrated yet, now you had to.

Every project I touched had some version of this problem. A plugin that wasn't updated. A shared config that needed manual `FlatCompat` wrapping. Hours of debugging, for an output that looked identical to what I had before.

---

## Enter Biome

[Biome](https://biomejs.dev/) started as a fork of [Rome](https://github.com/rome/tools) — a tool that tried to be a unified JavaScript toolchain, went quiet for a while, then came back with a clearer focus: linting and formatting, done well, in one tool.

Written in Rust. Single binary. One config file.

I was skeptical. "Another linting tool" is not a pitch that lands easily after you've been burned by migration costs. But what stopped me was the speed. The first time I ran Biome on a large project, I thought it had silently failed — it finished so fast it didn't seem possible it had done anything. But it had. The [benchmarks](https://github.com/biomejs/biome/blob/main/benchmark/README.md) show differences of 10x to 50x against ESLint and Prettier. Your numbers will vary, but the order of magnitude is real. The reason underneath: Biome parses the code once and reuses the AST for both linting and formatting. ESLint and Prettier parse independently, then sometimes fight about the result.

I tried it first on [pereiratechtalks.org](https://pereiratechtalks.org/) — which I had originally set up with ESLint + Prettier. The migration starts with two commands:

```bash
biome migrate eslint
biome migrate prettier
```

Those two commands read your existing configs and generate an equivalent `biome.json`. From there, the work is removing the old stuff. In the case of Pereira Tech Talks, I deleted four config files — `.eslintrc.js`, `.prettierrc.js`, `.eslintignore`, `.prettierignore` — and uninstalled the ESLint and Prettier packages. I also had to update the VS Code extensions (out with ESLint and Prettier, in with Biome), simplify the CI pipeline that previously had separate steps for lint and formatting, and update the `CONTRIBUTING.md` where it said `npm run eslint:fix` and `npm run prettier:fix` to a single `npm run biome:fix`. The [full commit](https://github.com/pereira-tech-talks/pereiratechtalks.org/commit/114c473b) is on GitHub if you want to see exactly what changed.

It took about an hour — mostly because I wanted to understand what I was doing rather than just running commands blindly. I loved it. When I started xergioalex.com from scratch, I didn't even think about it — Biome from day one.

That cleanup — I don't want to oversell it — felt good in a way that surprised me. Not because the old tools were bad, but because the accumulation was visible. You could see it in the package count, see it in the root directory listing, see it in the CI install time. Removing it felt like clearing a desk that had been piling up for years.

---

## What I'm actually running

This is the `biome.json` for xergioalex.com, the site you're reading this on:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.4.5/schema.json",
  "linter": {
    "enabled": true,
    "rules": {
      "suspicious": {
        "noUnknownAtRules": "off",
        "noExplicitAny": "off"
      },
      "complexity": {
        "noBannedTypes": "off"
      },
      "correctness": {
        "noUnusedImports": "off",
        "noUnusedVariables": "off"
      },
      "style": {
        "useImportType": "off",
        "useConst": "off"
      }
    }
  },
  "files": {
    "ignoreUnknown": false,
    "includes": [
      "src/**",
      "!**/.astro",
      "!**/docs",
      "!**/dist",
      "!**/node_modules",
      "!**/public",
      "!**/.github"
    ]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "es5"
    }
  },
  "css": {
    "parser": {
      "tailwindDirectives": true
    }
  }
}
```

Fifty lines. That's the whole thing. The only thing I have to deal with occasionally is updating the `$schema` version when a new release drops — sometimes it means a minor rule tweak, but nothing that takes more than five minutes. Compared to an ESLint upgrade, it's almost recreational.

No separate ignore file — `includes` handles it. No separate formatter config — it's right there in the same file. CSS support built in, with Tailwind directives handled via the `tailwindDirectives: true` parser flag.

The overrides I set: `noExplicitAny: "off"` because I have some TypeScript interop code where `any` is actually the right type, `noUnusedImports: "off"` and `noUnusedVariables: "off"` because those rules are useful in CI but noisy during active development — you're mid-refactor, you comment something out, and suddenly there's red everywhere. Everything else runs at the Biome defaults.

Three npm scripts:

```json
"biome:check": "biome check",
"biome:fix": "biome check --write",
"biome:fix:unsafe": "biome check --write --unsafe"
```

`biome check` runs the linter and formatter together and reports violations. `--write` applies safe fixes automatically. `--unsafe` applies everything, including transformations that might change behavior — I use that one rarely and with `git diff` open.

One package installed. One config file. Three commands. Before, I had this:

```json
"eslint:check": "eslint .",
"eslint:fix": "eslint . --fix",
"prettier:check": "prettier --check .",
"prettier:fix": "prettier --write ."
```

Four scripts, two tools, two separate configs, two CI steps. Now it's one of each.

---

## What it can't do

I'm not going to pretend Biome replaces ESLint feature-for-feature. It doesn't.

ESLint has been around for over a decade. Its ecosystem has thousands of community-built rules. `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`, `eslint-plugin-security`, `eslint-plugin-unicorn` — specialized plugins for every use case. Biome has hundreds of rules built in — the number goes up with every release — and a plugin system (GritQL) that's still maturing.

Astro and Svelte support is partial. Biome handles the JavaScript and TypeScript inside those files, but not the template syntax — the `<template>` blocks in Svelte, the Astro-specific directives. That's on the roadmap but not there yet. For this site, that's acceptable — the TypeScript code is where the important lint rules need to run.

Type-aware linting — I think this is the area where Biome's coverage matters most and is hardest to pin down. Rules like `noFloatingPromises` work — Biome does type inference on its own, without running the TypeScript compiler, which is a fundamentally different approach from what typescript-eslint does. The coverage isn't 100%; there are edge cases typescript-eslint catches that Biome doesn't yet. Whether the gap matters depends on your project. For me, the rules I actually rely on work, and the performance difference — no TypeScript compiler invocation in the lint path — is worth the trade.

HTML, Markdown, and SCSS aren't supported yet.

Honestly — if you have a project that relies heavily on `eslint-plugin-react-hooks` specific rules, or on jsx-a11y for accessibility enforcement at the linting level, you might need a hybrid setup for a while. Biome for formatting and most linting, ESLint for the specific rules you need. It's more setup than I want, but it's better than managing the whole ESLint stack.

For this site, none of that is a problem. Biome covers everything I need.

---

## Where it's heading

Biome 2.0 shipped with two big additions: plugins (write custom lint rules in GritQL) and type inference (lint rules that understand TypeScript types without running `tsc`).

The type inference work was [sponsored by Vercel](https://biomejs.dev/blog/vercel-partners-biome-type-inference/). I think that says something. Major infrastructure companies don't sponsor linting projects out of charity — they do it because slow tooling costs them CI minutes and developer time, and Biome is meaningfully faster at scale.

And it's not just sponsorship. [Next.js since version 15.5](https://nextjs.org/blog/next-15-5) offers Biome as an official option when creating a new project with `create-next-app` — on equal footing with ESLint. And in [Next.js 16](https://nextjs.org/docs/app/guides/upgrading/version-16) they went a step further: they removed `next lint` entirely. No more built-in linter. The framework tells you: use ESLint or Biome directly, your call.

The fact that the most popular React framework in the world gives Biome that level of prominence says a lot about where the ecosystem is moving.

The [roadmap](https://biomejs.dev/blog/roadmap-2026/) includes better Astro/Svelte/Vue support — linting in the template/markup sections, not just the script blocks. Cross-language lint rules that work across JS and CSS. Better editor integration.

None of that is fully shipped yet. But the direction is what I care about: fewer tools doing more, with less configuration to maintain.

---

## Why I'm not going back

The decision wasn't only about speed. The speed is real — my local `biome:check` runs in under a second, always. But honestly, I could live with a slower linter if the configuration was stable.

The thing that broke me on ESLint was the maintenance cost. Every major release felt like a migration project. The flat config migration took hours. Then the old config format got removed entirely, and everyone had to move whether they wanted to or not. The Prettier conflict dance — the fact that a package exists solely to make one tool stop fighting with another tells you everything you need to know.

Biome doesn't have that problem. One config. One tool. When I upgrade Biome, I update the `$schema` version in `biome.json` and run `biome migrate`. It handles the config differences automatically.

I'm aware that things change — Biome might have its own painful migration someday. I hope they handle it better than ESLint did. But right now, the maintenance surface is a lot smaller, and I want to keep it that way.

---

## Resources

- [Biome.js](https://biomejs.dev/) — Documentation and quick start
- [Biome v2 release post](https://biomejs.dev/blog/biome-v2/) — What shipped in 2.0 (plugins, type inference)
- [Migrating from ESLint and Prettier to Biome](https://biomejs.dev/guides/migrate-eslint-prettier/) — Official migration guide
- [ESLint flat config retrospective](https://eslint.org/blog/2025/05/eslint-v9.0.0-retrospective/) — Worth reading if you want to understand what went wrong
- [Biome benchmarks](https://github.com/biomejs/biome/blob/main/benchmark/README.md) — Where the numbers come from

Let's keep building.
