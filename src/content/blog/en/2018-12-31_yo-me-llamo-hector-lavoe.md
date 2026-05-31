---
title: "Yo Me Llamo Héctor Lavoe: Building a Personal Website for a Salsa Artist"
description: "Website for a Yo Me Llamo contestant as Héctor Lavoe: audio player, gallery, and a jPlayer Safari fix that took an afternoon over three pixels."
pubDate: "2018-12-31"
heroImage: "/images/blog/posts/yo-me-llamo-hector-lavoe/hero.webp"
heroLayout: "banner"
tags: ["portfolio", "web-development", "personal", "design"]
keywords: ["artist website jPlayer", "salsa musician website HTML CSS", "jPlayer audio player tutorial", "Yo Me Llamo Héctor Lavoe", "musician website LESS PHP", "custom audio player website", "jQuery jPlayer iOS Safari fix"]
---

Yuli called me sometime around 2017. We'd been friends since university — the kind of friendship that survives graduation and distance and years of barely talking, and then one day someone calls and it's like no time has passed at all.

"Could you build a website for my husband?"

Her husband is a salsa musician. Specifically, he impersonates **Héctor Lavoe** — the Puerto Rican legend — and he'd been on *Yo Me Llamo*, which for anyone outside Colombia is basically the biggest talent show in the country. Contestants pick a famous artist and become them on stage. The singing, the look, the mannerisms. It's huge here.

I said yes before she finished explaining what she needed.

---

## The ask

The idea was simple: he wanted a nice-looking site where people could listen to his music, see photos from his performances, and learn about his career. Audio player, gallery, videos, bio, contact form. Nothing crazy on its own, but he wanted it to look good — not a generic template with his name slapped on top.

---

## The template and the customization work

I started with a template that already had an audio player built in using **[jPlayer](http://jplayer.org/)**, a jQuery-based HTML5 library. That gave me a solid base — I didn't have to build the player from scratch, but it still needed a lot of work to fit what we wanted.

The heavy lifting was customization. Changing the color scheme to gold and black, adjusting the typography, reorganizing sections, loading in all the artist's content — photos, videos, biography, the audio tracks. A template gives you the structure, but making it feel like a custom-built site takes time. I remember fighting CSS specificity to get the player controls to look right in the new design. At one point I was debugging a play button that showed up misaligned in Firefox by 3 pixels. Three pixels. A whole afternoon.

Mobile had its headaches too. iOS Safari had its own opinions about when audio should autoplay and when it shouldn't. I had to add workarounds for the player to initialize properly on iPhones — the kind you find on page 3 of a Stack Overflow thread from 2015.

---

## The rest of the stack

Nothing fancy: **HTML, CSS, JavaScript, LESS, a bit of PHP** for the contact form. No React. No bundler. You edit a file, refresh the browser, see if it worked. That kind of project.

LESS was the best decision I made. The site has six sections — home, trayectoria (his career), videos, gallery, music, and contact — and without a CSS preprocessor the stylesheet would've been unmanageable. I split everything into modules: `_gallery.less`, `_player.less`, `_layout.less`, and so on. Compiled into one file. Clean enough.

The PHP was minimal. Just the contact form sending an email. Looking at it now, the validation is... let's say optimistic. No CSRF tokens, no rate limiting. It worked, nobody abused it, but I wouldn't write it that way today.

---

## The design

The template already had a dark visual base that fit the salsa vibe — black backgrounds, gold accents, big typography. I had to adjust colors, add the artist's performance photos, put the "Yo Me Llamo" logo in the hero, and make the whole thing look professional. Early versions were too dark — like a nightclub flyer. I had to add more space and let the photos breathe.
---

## Where it is now

The site isn't maintained anymore. The artist's career moved in other directions, and the web moved too — the stack is showing its age. But I kept it running at [yomellamohectorlavoe.xergioalex.com](https://yomellamohectorlavoe.xergioalex.com/) under my domain. A time capsule.

Looking back, the thing I remember most isn't the code or the design decisions. It's Yuli sending me her husband's photos and tracks over WhatsApp, the back-and-forth about which picture to use for the hero, the "it looks amazing" message when I sent her the first working version. That stuff doesn't show up in a git log, but it's the reason the project existed.

Let's keep building.

---

## Resources

- [Yo Me Llamo Héctor Lavoe — Live site](https://yomellamohectorlavoe.xergioalex.com/) — The website as it stands today
- [GitHub repository](https://github.com/xergioalex/yomellamohectorlavoe) — Source code
- [jPlayer](http://jplayer.org/) — The HTML5 audio/video library used for the music player
- [Yo Me Llamo — Caracol TV](https://www.caracoltv.com/yo-me-llamo) — The Colombian talent show
