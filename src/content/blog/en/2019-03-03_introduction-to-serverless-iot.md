---
title: "Introduction to Serverless with Emphasis on IoT"
description: "My journey into serverless architectures and why they changed how I think about building IoT applications. From meditation apps to smart light bulbs."
pubDate: "2019-03-03"
heroImage: "/images/blog/posts/introduction-to-serverless-iot/hero.webp"
heroLayout: "banner"
tags: ["talks", "tech", "devops", "iot"]
keywords: ["serverless IoT architecture", "AWS Lambda IoT tutorial", "serverless functions explained", "BaaS FaaS serverless comparison", "Alexa skill IoT serverless", "serverless IoT events scaling", "AWS Lambda beginner guide"]
---

I remember the first time I deployed a Lambda function. It felt like magic — write a function, upload it, and suddenly it's running in response to events without me worrying about servers, scaling, or infrastructure. That shift in mindset is what I wanted to share in this talk on serverless architectures with a focus on IoT.

The term **serverless** is both beautiful and misleading. *Server-less* literally means "without a server" — but spoiler: there are still servers 😄. You just don't manage them. Someone else handles the infrastructure while you focus on code and logic. For IoT applications, where devices trigger events constantly and unpredictably, this model makes incredible sense.

<figure>
  <img src="/images/blog/posts/introduction-to-serverless-iot/demo.webp" alt="Talk demos: Bambú, IoT Light Bulb, DailyBot, Twitter Bot" loading="lazy" />
  <figcaption>Four live demos shown at the talk: Bambú meditation skill, a serverless-controlled light bulb, DailyBot, and a Twitter bot.</figcaption>
</figure>

## Backend as a Service vs Functions as a Service

Serverless isn't new, and it's not a single thing. It comes in two main flavors that solve different problems:

**BaaS (Backend as a Service)** has been around for over 10 years. AWS S3, launched in 2006, was one of the first — a simple cloud storage service you could integrate via API without building your own file storage infrastructure. The idea behind BaaS is simple: why build and maintain generic services (databases, authentication, search) when they already exist as reliable, battle-tested components? You connect to them transparently via APIs and move on with your life.

Examples: AWS DynamoDB for NoSQL databases, Auth0 for authentication, Algolia for search, Skygear for backend services. These tools let you avoid reinventing the wheel every time you need a common service.

**FaaS (Functions as a Service)** is the newer kid on the block, born in 2014 with AWS Lambda. This is the next evolution of cloud computing — a fundamentally different way to run and design applications. Instead of deploying a long-running server, you deploy **functions** that execute in response to events: an HTTP request, a database change, a file upload, a user registration. The platform allocates resources dynamically, scales automatically, and charges you only for execution time.

Main players: AWS Lambda, Google Cloud Functions, Azure Functions. Each has its quirks, but the model is the same: event-driven, stateless, ephemeral compute.

## Benefits of Serverless

Why did serverless excite me so much? A few reasons:

- **No server management** — I don't want to SSH into servers at 2 AM to restart a process. I want to write code.
- **Scales automatically** — If one user triggers a function or a million do, the platform handles it. I don't provision capacity.
- **Pay for what you use** — No upfront costs. If the function doesn't run, I don't pay. If it runs a billion times, I pay for those executions. Soft limits, not fixed costs.
- **Event-driven architecture** — HTTP requests, database changes, file modifications, user actions — everything becomes an event. Your code reacts.
- **No hiring or provisioning costs** — No DevOps team just to keep servers alive. You can build and ship faster.

For IoT applications, where devices might send data in bursts or sit idle for hours, this model is perfect. A smart light bulb doesn't need a server running 24/7 waiting for a toggle command. It needs a function that runs when the toggle event happens.

## Drawbacks of Serverless

It's not all sunshine. Serverless has real trade-offs:

- **Vendor lock-in** — You're tightly coupled to your provider's APIs and ecosystem. Migrating from AWS Lambda to Google Cloud Functions isn't trivial.
- **Cold starts** — If a function hasn't run recently, the first execution has latency while the platform spins up the runtime. For real-time applications, this can be noticeable.
- **Vendor restrictions** — Each provider has limits. AWS Lambda, for example, has a minimum billing duration of 1 second and a maximum execution time of 15 minutes (it was 5 minutes back in 2019). If your task takes longer, you're out of luck.
- **No good debugging tools** — Debugging distributed, ephemeral functions is harder than debugging a monolith running locally. The tooling is improving, but it's still a challenge.
- **Cost estimation is tricky** — "Pay for what you use" sounds great until you realize you don't know what you'll use. Estimating costs for unpredictable workloads requires math and monitoring.

These aren't dealbreakers, but they're real. You have to decide if the trade-offs are worth it for your use case.

## When to Use Serverless

Serverless shines in these scenarios:

- **Short, periodic tasks** — Scheduled jobs, data processing, report generation
- **Long idle periods** — Applications that sit quiet most of the time, then spike with activity
- **Data processing** — ETL pipelines, image resizing, log analysis
- **Web, mobile, or worker apps that respond to user-triggered events** — API backends, webhooks, notifications
- **Stateless apps** — Applications that don't rely on in-memory state between requests
- **Chatbots and voice interfaces** — Event-driven by nature, often idle, then reactive

For IoT, serverless is a natural fit. Devices send data when something happens. A temperature sensor reports every 5 minutes. A motion detector fires when movement is detected. A smart bulb waits for a command. All events. All serverless.

## When Not to Use Serverless

Serverless isn't universal. Avoid it when:

- **You don't want vendor dependency** — If lock-in is a dealbreaker, consider self-hosting (more on that below)
- **You need long-running executions** — AWS Lambda maxes out at 15 minutes. If your task takes hours, you need a different model (batch jobs, ECS, EC2)
- **You have complex, stateful executions** — Serverless functions are ephemeral and stateless. If your app needs persistent state, you'll need external storage (databases, caches) and careful design

## Demo Time

I showed four live demos to illustrate serverless in action:

**[Bambú Meditación](https://appbambu.com/alexa/)** — An Alexa skill for guided meditation powered by AWS Lambda. Users say "Alexa, open Bambú" and Lambda handles the conversation logic, fetches meditation audio, and manages session state. No servers. Just functions responding to voice events.

<figure>
  <img src="/images/blog/posts/introduction-to-serverless-iot/alexa-demo.webp" alt="Bambú Meditación demo with Alexa and AWS Lambda" loading="lazy" />
  <figcaption>Bambú Meditación architecture: an Alexa skill triggering AWS Lambda to serve guided meditation audio on demand.</figcaption>
</figure>

**[IoT Light Bulb](https://github.com/xergioalex/serverless-ligth-bulb)** — A serverless-controlled light bulb using ESP8266, NRF24L01+ wireless modules, and Lambda. The bulb listens for commands sent via an HTTP API. Lambda receives the request, processes it, and sends a signal to the bulb. The entire control flow is event-driven.

<figure>
  <img src="/images/blog/posts/introduction-to-serverless-iot/iot-circuit.webp" alt="IoT demo circuit: ESP8266, NRF24L01+, LEDs on breadboard" loading="lazy" />
  <figcaption>The IoT light bulb hardware: ESP8266 and NRF24L01+ wireless modules wired on a breadboard, controlled via Lambda.</figcaption>
</figure>

<figure>
  <img src="/images/blog/posts/introduction-to-serverless-iot/iot-bulb.webp" alt="Real bulb working — controlled by Lambda" loading="lazy" />
  <figcaption>The actual light bulb lighting up in response to an HTTP call to AWS Lambda — serverless IoT control made physical.</figcaption>
</figure>

**[DailyBot](https://www.dailybot.com/)** — A team assistant bot for Slack and other platforms. DailyBot uses serverless functions to send daily standup reminders, collect responses, and generate reports. All triggered by scheduled events or user messages.

<figure>
  <img src="/images/blog/posts/introduction-to-serverless-iot/dailybot-demo.webp" alt="DailyBot demo diagram with serverless" loading="lazy" />
  <figcaption>DailyBot's serverless architecture — scheduled Lambda functions collecting standup responses and generating team reports.</figcaption>
</figure>

**[Twitter Bot](https://x.com/XergioAleXBot)** — An automated bot that tweets on a schedule using Lambda. A CloudWatch event triggers the function every few hours, the function generates a tweet (or retweets content), and posts via the Twitter API. Simple, cheap, and requires zero infrastructure.

<figure>
  <img src="/images/blog/posts/introduction-to-serverless-iot/twitter-bot-demo.webp" alt="Twitter bot in action — @XergioAleXBot" loading="lazy" />
  <figcaption>@XergioAleXBot on X — an automated posting bot triggered by CloudWatch events, with zero dedicated server infrastructure.</figcaption>
</figure>

These demos showed the same idea from different angles: small, event-driven functions powering real applications without managing servers.

## Where to Start?

If this sounds interesting, here's where to begin:

**Programming languages?** — Most providers support Node.js, Python, Go, Java, C#, and more. Pick what you already know.

**Want to self-host?** — Tools like [OpenFaaS](https://www.openfaas.com/) and [Knative](https://knative.dev/) let you run FaaS on your own infrastructure (Kubernetes, Docker Swarm). You lose some of the "serverless" convenience, but you avoid vendor lock-in.

**Resources I recommend:**

- [Foo Bar](https://www.youtube.com/watch?v=YPc5ulMR6VI) on YouTube — Great serverless content in Spanish
- Udemy course: *Serverless en Español con AWS y Serverless Framework* — Hands-on, practical, in Spanish

---

Serverless changed how I think about building applications. It's not perfect, and it's not for everything, but for IoT, event-driven systems, and applications with unpredictable usage patterns, it's a powerful model. The less time I spend managing infrastructure, the more time I spend solving actual problems.

[View slides](https://slides.com/xergioalex/introduction-to-serverless-with-emphasis-on-iot)

Let's keep building.
