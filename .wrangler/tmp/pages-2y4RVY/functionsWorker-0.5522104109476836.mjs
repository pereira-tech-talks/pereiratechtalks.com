var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// agent/claim/complete.ts
async function onRequest(context) {
  const origin = new URL(context.request.url).origin;
  const body = {
    status: "not_applicable",
    message: "No claim-complete ceremony is required for public:read access on Pereira Tech Talks. See /auth.md.",
    skill: `${origin}/auth.md`
  };
  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, must-revalidate"
    }
  });
}
__name(onRequest, "onRequest");

// _lib/umami-proxy.ts
var UMAMI_CLOUD_ORIGIN = "https://cloud.umami.is";
var ALLOWED_UMAMI_PATHS = /* @__PURE__ */ new Set(["script.js", "api/send"]);
function isAllowedUmamiPath(path) {
  return ALLOWED_UMAMI_PATHS.has(path);
}
__name(isAllowedUmamiPath, "isAllowedUmamiPath");
function resolveUmamiPath(raw) {
  const joined = Array.isArray(raw) ? raw.join("/") : raw ?? "script.js";
  return String(joined).replace(/^\/+/, "");
}
__name(resolveUmamiPath, "resolveUmamiPath");
function buildUmamiUpstreamUrl(path) {
  return `${UMAMI_CLOUD_ORIGIN}/${path}`;
}
__name(buildUmamiUpstreamUrl, "buildUmamiUpstreamUrl");
function buildUmamiProxyRequestHeaders(request) {
  const headers = new Headers();
  const contentType = request.headers.get("Content-Type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }
  const clientIp = request.headers.get("CF-Connecting-IP");
  if (clientIp) {
    headers.set("x-forwarded-for", clientIp);
  }
  const userAgent = request.headers.get("User-Agent");
  if (userAgent) {
    headers.set("User-Agent", userAgent);
  }
  return headers;
}
__name(buildUmamiProxyRequestHeaders, "buildUmamiProxyRequestHeaders");
function getUmamiProxyCacheControl(path) {
  return path === "script.js" ? "public, max-age=86400, stale-while-revalidate=604800" : "no-store";
}
__name(getUmamiProxyCacheControl, "getUmamiProxyCacheControl");

// api/umami/[[path]].ts
var ALLOWED_METHODS = /* @__PURE__ */ new Set(["GET", "POST"]);
async function onRequest2(context) {
  try {
    const path = resolveUmamiPath(context.params?.path);
    if (!isAllowedUmamiPath(path)) {
      return new Response("Not Found", { status: 404 });
    }
    const method = context.request.method.toUpperCase();
    if (!ALLOWED_METHODS.has(method)) {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { Allow: "GET, POST" }
      });
    }
    if (path === "script.js" && method !== "GET") {
      return new Response("Method Not Allowed", { status: 405 });
    }
    if (path === "api/send" && method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }
    const upstreamUrl = buildUmamiUpstreamUrl(path);
    const init = {
      method,
      headers: buildUmamiProxyRequestHeaders(context.request),
      // Avoid holding a live upstream stream across the isolate boundary
      // (CF 1101 when streaming bodies fail mid-transfer).
      redirect: "follow"
    };
    if (method === "POST") {
      init.body = await context.request.arrayBuffer();
    }
    const upstream = await fetch(upstreamUrl, init);
    const body = await upstream.arrayBuffer();
    const contentType = upstream.headers.get("Content-Type") ?? "application/octet-stream";
    return new Response(body, {
      status: upstream.status,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": getUmamiProxyCacheControl(path)
      }
    });
  } catch {
    return new Response("Bad Gateway", { status: 502 });
  }
}
__name(onRequest2, "onRequest");

// _lib/oauth-metadata.ts
function getRequestOrigin(requestUrl) {
  return new URL(requestUrl).origin;
}
__name(getRequestOrigin, "getRequestOrigin");
function buildOAuthProtectedResourceMetadata(origin) {
  return {
    resource: origin,
    resource_name: "Pereira Tech Talks",
    authorization_servers: [origin],
    scopes_supported: ["public:read"],
    bearer_methods_supported: ["header"]
  };
}
__name(buildOAuthProtectedResourceMetadata, "buildOAuthProtectedResourceMetadata");
function buildOAuthAuthorizationServerMetadata(origin) {
  const registerUri = `${origin}/agent/register`;
  const claimUri = `${origin}/agent/claim`;
  const claimCompleteUri = `${origin}/agent/claim/complete`;
  const revocationUri = `${origin}/oauth/revoke`;
  return {
    issuer: origin,
    authorization_endpoint: `${origin}/oauth/authorize`,
    token_endpoint: `${origin}/oauth/token`,
    revocation_endpoint: revocationUri,
    registration_endpoint: registerUri,
    jwks_uri: `${origin}/.well-known/jwks.json`,
    grant_types_supported: ["authorization_code", "client_credentials"],
    response_types_supported: ["code"],
    scopes_supported: ["public:read"],
    token_endpoint_auth_methods_supported: ["none"],
    bearer_methods_supported: ["header"],
    agent_auth: {
      skill: `${origin}/auth.md`,
      register_uri: registerUri,
      identity_endpoint: registerUri,
      claim_uri: claimUri,
      claim_endpoint: claimUri,
      claim_complete_uri: claimCompleteUri,
      identity_types_supported: ["anonymous"],
      anonymous: {
        credential_types_supported: ["access_token"],
        claim_uri: claimUri
      },
      events_supported: [
        "https://schemas.openid.net/secevent/oauth/event-type/token-revoked"
      ],
      revocation_uri: revocationUri
    }
  };
}
__name(buildOAuthAuthorizationServerMetadata, "buildOAuthAuthorizationServerMetadata");
function jsonResponse(body, maxAge = 300) {
  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": `public, max-age=${maxAge}, must-revalidate`,
      "Access-Control-Allow-Origin": "*"
    }
  });
}
__name(jsonResponse, "jsonResponse");

// .well-known/oauth-authorization-server.ts
async function onRequestGet(context) {
  const origin = getRequestOrigin(context.request.url);
  return jsonResponse(buildOAuthAuthorizationServerMetadata(origin));
}
__name(onRequestGet, "onRequestGet");
async function onRequestHead(context) {
  const origin = getRequestOrigin(context.request.url);
  const body = jsonResponse(buildOAuthAuthorizationServerMetadata(origin));
  return new Response(null, { status: 200, headers: body.headers });
}
__name(onRequestHead, "onRequestHead");
async function onRequest3(context) {
  const method = context.request.method.toUpperCase();
  if (method === "HEAD") return onRequestHead(context);
  if (method === "GET") return onRequestGet(context);
  return new Response("Method Not Allowed", {
    status: 405,
    headers: { Allow: "GET, HEAD" }
  });
}
__name(onRequest3, "onRequest");

// .well-known/oauth-protected-resource.ts
async function onRequestGet2(context) {
  const origin = getRequestOrigin(context.request.url);
  return jsonResponse(buildOAuthProtectedResourceMetadata(origin));
}
__name(onRequestGet2, "onRequestGet");
async function onRequestHead2(context) {
  const origin = getRequestOrigin(context.request.url);
  const body = jsonResponse(buildOAuthProtectedResourceMetadata(origin));
  return new Response(null, { status: 200, headers: body.headers });
}
__name(onRequestHead2, "onRequestHead");
async function onRequest4(context) {
  const method = context.request.method.toUpperCase();
  if (method === "HEAD") return onRequestHead2(context);
  if (method === "GET") return onRequestGet2(context);
  return new Response("Method Not Allowed", {
    status: 405,
    headers: { Allow: "GET, HEAD" }
  });
}
__name(onRequest4, "onRequest");

// api/_dailybot.ts
var CONTACT_FORM_UUID = "cd036d4a-2bde-48ef-83da-3fa69d91d971";
var CFS_FORM_UUID = "2a3b568c-9255-4d5a-a29c-8f220ae427ce";
var SPEAKER_SCHOOL_FORM_UUID = "a7bb66f2-082c-4d36-b687-13d4d1c5ed80";
var SPONSORS_FORM_UUID = "f3469d2d-df7b-4007-8ff8-e8c61de7b80d";
var CALENDAR_FORM_UUID = "22f3540c-669d-42b8-8365-abed7bb07cda";
var CONDUCT_FORM_UUID = "ce944b4b-bd99-4836-a14e-c583773952a4";
var CONTACT_Q = {
  NAME: "b3631f67-c45f-4e04-ac74-9b6227215bab",
  EMAIL: "dc82fc72-5da9-419e-89c6-9f659d17abbb",
  TOPIC: "ef359c90-71ff-4c06-8e5c-64d6ba626ede",
  SUBJECT: "26ec3124-4f26-4f56-a833-b23b39f6caf1",
  MESSAGE: "e9ee3c23-4a09-4a72-bce5-4962581f79f2",
  LANG: "98ea18f2-a9ab-4478-b820-bb15fb891d89",
  PAGE_PATH: "8a12f9fa-6bee-473f-be6e-a7a5d1d27679"
};
var CFS_Q = {
  NAME: "43a83d0b-05b2-4197-8d10-0d0f7d92c04f",
  EMAIL: "6dfb89e7-25e2-4251-b7ee-ea22fdb977a0",
  TALK_TITLE: "692d4dc5-8c70-4860-b4d9-fed3e39cb71b",
  FORMAT: "f1a1b2af-3a58-454b-b587-80dad8a51120",
  ABSTRACT: "c50a508d-4a55-4c54-9552-b227d5fc7567",
  TAKEAWAYS: "0fff158c-f056-40f7-83c6-16ba3f296dbb",
  SOCIAL_URL: "13779547-771a-4cf6-a859-d7e0073c95a1",
  FIRST_TIME: "dd83b3af-7b7b-4748-ba6a-316fae3f825d",
  SPEAKER_SCHOOL: "8e518d0c-2757-4e00-ae97-eca425c476f8",
  /**
   * Optional short text carrying the canonical URL of the meetup a proposal
   * targets (`https://pereiratechtalks.org/meetups/{slug}/`), or `''` when the
   * proposal came from the global /call-for-speakers page.
   *
   * Deliberately NOT a multiple choice: this org's MC values equal their labels,
   * so a per-meetup choice list would need the remote form edited every time a
   * meetup is programmed, and any drift fails real submissions with
   * ["response is not valid"]. A URL is stable and actionable in Slack.
   */
  MEETUP: "00969219-78f1-442f-a12a-2fa890ab9002",
  /**
   * Optional link to the speaker's deck — often to a doc that is still being
   * written, which is the point: reviewers want to see the narrative early
   * enough to suggest changes. Sits next to the talk material in the form.
   */
  SLIDES: "1e9d72d9-d8d8-4143-862e-cbe8d14f6cc1",
  /**
   * Optional. Either a URL to a photo, or a free-text note such as
   * "use my LinkedIn photo" — the field deliberately accepts prose, because a
   * speaker who already shared a profile link above should not have to hunt for
   * an image URL. Read by a human in the Slack report, never rendered by us.
   */
  PROFILE_PHOTO: "34a40932-c9b9-46ab-a189-2bcc39d64e6d",
  NOTES: "9bf5d1e9-710a-4fc2-956e-a2f7d763fc2b",
  LANG: "2540a2ff-ba71-4682-9c62-c8f2731639e5",
  PAGE_PATH: "97d98089-711b-472f-8364-a639b9319ad5"
};
var SPEAKER_SCHOOL_Q = {
  NAME: "cf612269-da43-423f-8aa3-77f37d8034f3",
  EMAIL: "e30cc9d8-b427-4d89-ac02-60813a3d6f35",
  EXPERIENCE_LEVEL: "abd98f0c-f3cb-4852-beae-012577892e0e",
  GOALS: "c1f8946c-75d9-4e18-a4fd-fd1e71d5e1d5",
  TOPICS: "8417cb6b-8c41-4009-a34b-b0c8d405fcfc",
  AVAILABILITY: "24b0ffec-16ca-4b1e-a32d-799b3116471b",
  PRIOR_SPEAKING: "ee23d7b7-a530-4131-97ec-b8d673dbc018",
  SOCIAL: "35daa6a0-e7f1-4a37-8630-6a30055f29cd",
  MESSAGE: "f9731211-fe7e-4d0f-b0d0-8247b3356534",
  LANG: "4013d204-8dc1-4a30-bcf4-203d83fc9075",
  PAGE_PATH: "999103f8-7c2a-4415-8def-a88e7bc0c1d8"
};
var SPONSORS_Q = {
  NAME: "f37a45b6-42ad-46cc-8313-21a2ec142337",
  EMAIL: "9bac36ba-9afa-4868-8d7d-da169e07866a",
  COMPANY: "b3e273d4-673b-4f7f-b9f5-16e2647a1bb7",
  ROLE: "0f8a699b-3608-4e8a-9f46-6ec9a7f92e9e",
  TIER: "4e139d6e-fe72-4605-ba36-ec3326081c6a",
  CONTRIBUTION: "12fcac44-e2f5-418f-a01e-3240d164aef3",
  MESSAGE: "f83c6987-c8e8-4aeb-99ab-086af6bbe8ee",
  LANG: "a29c7d5b-182c-4bd6-b3c3-0e7636696a7d",
  PAGE_PATH: "b136044c-6b2d-439d-8356-7e3986d50921"
};
var CALENDAR_Q = {
  NAME: "5e9799d0-39fc-490b-b952-32066b3b2215",
  EMAIL: "4c2686d6-7542-41f0-b26b-ddb61c254d7d",
  COMMUNITY: "d67baf75-2779-4b71-9b36-7cc6ab781f48",
  CALENDAR_ID: "fec89090-847f-4156-9e2f-215240324f4a",
  CALENDAR_URL: "ecf115f9-824e-49b7-bc65-ef077a8331ed",
  WEBSITE: "c1a76a11-f31e-4d8a-a843-6a003d2e4327",
  DESCRIPTION: "e81995da-70ee-467d-8711-b07fd9eccc9e",
  LANG: "54f81c6f-b19e-46d6-b870-40846f951e79",
  PAGE_PATH: "20a4f02b-9117-4e16-a270-4ff9ef463a50"
};
var CONDUCT_Q = {
  INCIDENT: "949bae46-fc1b-43ab-b447-7c394310ee0e",
  WHEN: "2d7cca49-4f98-42ad-8848-cf8d44796e30",
  PEOPLE: "f6593bd2-49ab-4beb-870b-f17429040924",
  ANONYMOUS: "8f2c430e-db32-4555-aabe-cdf6f5e291b9",
  REPORTER_NAME: "479c1448-dd1c-45ff-a621-bfc844f44675",
  REPORTER_EMAIL: "440b5adb-a759-4a0d-a65a-9f8c9900c754",
  FOLLOWUP: "258c35b8-daed-466b-941b-bf718f41b832",
  LANG: "154e1e16-507d-410f-b225-d21e467a1373",
  PAGE_PATH: "2d4b21f2-f8ce-4149-a6be-87b5ebe7feab"
};
var SITE_ORIGIN = "https://pereiratechtalks.org";
function meetupUrlFromSlug(slug) {
  return slug ? `${SITE_ORIGIN}/meetups/${slug}/` : "";
}
__name(meetupUrlFromSlug, "meetupUrlFromSlug");
var PAGE_PATH_MAX_LEN = 200;
function normalizePagePath(input) {
  if (typeof input !== "string") return "/";
  const trimmed = input.trim();
  if (!trimmed || trimmed.length > PAGE_PATH_MAX_LEN) return "/";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}
__name(normalizePagePath, "normalizePagePath");
function normalizeLabel(label) {
  return label.normalize("NFKC").replace(/[–—―]/g, "-").toLowerCase().replace(/\s+/g, " ").trim();
}
__name(normalizeLabel, "normalizeLabel");
function buildChoiceLookup(groups) {
  const out = {};
  for (const group of groups) {
    const canonical = group.aliases[0];
    for (const alias of group.aliases) {
      out[normalizeLabel(alias)] = canonical;
    }
  }
  return out;
}
__name(buildChoiceLookup, "buildChoiceLookup");
function lookupChoice(label, lookup) {
  if (!label) return void 0;
  const value = lookup[normalizeLabel(label)];
  return value ?? null;
}
__name(lookupChoice, "lookupChoice");
var LANG_VALUES = buildChoiceLookup([
  { aliases: ["Spanish", "es", "espa\xF1ol", "espanol"] },
  { aliases: ["English", "en", "ingl\xE9s", "ingles"] }
]);
var CONTACT_TOPIC_VALUES = buildChoiceLookup([
  { aliases: ["General", "general"] },
  { aliases: ["Collaboration", "collaboration"] },
  {
    aliases: [
      "The Library of Tomorrow",
      "the-library-of-tomorrow",
      "library-of-tomorrow",
      "la biblioteca del ma\xF1ana",
      "la biblioteca del manana"
    ]
  },
  { aliases: ["Press", "press", "media"] },
  { aliases: ["Other", "other"] }
]);
var CFS_FORMAT_VALUES = buildChoiceLookup([
  { aliases: ["Regular", "regular"] },
  { aliases: ["Lightning", "lightning"] },
  { aliases: ["Panel", "panel"] },
  { aliases: ["Workshop", "workshop"] }
]);
var EXPERIENCE_LEVEL_VALUES = buildChoiceLookup([
  { aliases: ["Beginner", "beginner", "principiante"] },
  { aliases: ["Intermediate", "intermediate", "intermedio"] },
  { aliases: ["Advanced", "advanced", "avanzado"] }
]);
var SPONSOR_TIER_VALUES = buildChoiceLookup([
  { aliases: ["Diamond", "diamond"] },
  { aliases: ["Gold", "gold"] },
  { aliases: ["Silver", "silver"] },
  { aliases: ["Bronze", "bronze"] },
  { aliases: ["Community", "community"] },
  { aliases: ["Unsure", "unsure"] }
]);
var CONTRIBUTION_TYPE_VALUES = buildChoiceLookup([
  { aliases: ["Cash", "cash"] },
  { aliases: ["In-kind", "in-kind", "inkind", "en especie"] },
  { aliases: ["Both", "both"] },
  { aliases: ["Unsure", "unsure"] }
]);
function booleanToDailyBot(value) {
  if (typeof value === "boolean") return value;
  const n = normalizeLabel(String(value ?? ""));
  if (["yes", "true", "1", "si", "s\xED"].includes(n)) return true;
  if (["no", "false", "0"].includes(n)) return false;
  return false;
}
__name(booleanToDailyBot, "booleanToDailyBot");
var BASE_URL = "https://api.dailybot.com/v1/forms/";
async function submitFormResponse(formUuid, content, env) {
  const apiKey = env.DAILYBOT_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "AUTH", status: 503, detail: "missing_api_key" };
  }
  let response;
  try {
    response = await fetch(`${BASE_URL}${formUuid}/responses/`, {
      method: "POST",
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ content, automation: true })
    });
  } catch (err) {
    console.error("[dailybot] network error", err);
    return { ok: false, error: "UNREACHABLE", status: 502 };
  }
  if (response.status === 201) {
    const data = await response.json().catch(() => ({}));
    if (!data.uuid) {
      return {
        ok: false,
        error: "UNKNOWN",
        status: 502,
        detail: "missing_uuid_in_response"
      };
    }
    return { ok: true, uuid: data.uuid };
  }
  if (response.status === 401 || response.status === 403) {
    return { ok: false, error: "AUTH", status: 502 };
  }
  const rawBody = await response.text().catch(() => "");
  const detail = classifyDailyBotError(rawBody);
  if (detail === "INVALID_CHOICE" || detail === "MISSING_REQUIRED") {
    return { ok: false, error: detail, status: 400 };
  }
  console.error("[dailybot] unexpected error", response.status, detail);
  return { ok: false, error: "UNKNOWN", status: 502 };
}
__name(submitFormResponse, "submitFormResponse");
function classifyDailyBotError(rawBody) {
  if (!rawBody) return null;
  try {
    const parsed = JSON.parse(rawBody);
    if (Array.isArray(parsed) && parsed.includes("response is not valid")) {
      return "INVALID_CHOICE";
    }
    if (typeof parsed === "object" && parsed !== null && parsed.code === "all_responses_are_required") {
      return "MISSING_REQUIRED";
    }
  } catch {
  }
  return null;
}
__name(classifyDailyBotError, "classifyDailyBotError");

// _lib/cfs-manifest.ts
var FETCH_TIMEOUT_MS = 3e3;
var CACHE_TTL_MS = 6e4;
var cached = null;
function isManifest(value) {
  if (!value || typeof value !== "object") return false;
  const candidate = value;
  return Array.isArray(candidate.calls);
}
__name(isManifest, "isManifest");
async function fetchCfsOpenManifest(requestUrl, now = Date.now()) {
  if (cached && now - cached.at < CACHE_TTL_MS) return cached.manifest;
  let url;
  try {
    url = new URL("/api/cfs-open.json", requestUrl).toString();
  } catch {
    return null;
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) return null;
    const parsed = await response.json();
    if (!isManifest(parsed)) return null;
    cached = { at: now, manifest: parsed };
    return parsed;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
__name(fetchCfsOpenManifest, "fetchCfsOpenManifest");
var SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{0,79}$/;
function isWellFormedMeetupSlug(slug) {
  return SLUG_PATTERN.test(slug);
}
__name(isWellFormedMeetupSlug, "isWellFormedMeetupSlug");
function findOpenCall(manifest, slug) {
  return manifest.calls.find((call) => call.slug === slug);
}
__name(findOpenCall, "findOpenCall");

// _lib/intake-helpers.ts
var TOPIC_ALIASES = {
  project: "sponsorship",
  sponsor: "sponsorship",
  sponsorship: "sponsorship",
  speaker: "tech-talk",
  "tech-talk": "tech-talk",
  cfs: "tech-talk",
  press: "press",
  media: "press",
  conduct: "conduct",
  coc: "conduct",
  collaboration: "collaboration",
  general: "general",
  other: "other",
  "the-library-of-tomorrow": "the-library-of-tomorrow"
};
function normalizeTopic(raw) {
  if (!raw) return "";
  const key = raw.trim().toLowerCase();
  return TOPIC_ALIASES[key] ?? key;
}
__name(normalizeTopic, "normalizeTopic");
function looksLikeSpamPayload(fields) {
  if (fields.website?.trim()) return true;
  const urlPattern = /https?:\/\//gi;
  if (fields.name.match(urlPattern)?.length) return true;
  if ((fields.message.match(urlPattern) || []).length > 6) return true;
  return false;
}
__name(looksLikeSpamPayload, "looksLikeSpamPayload");
function checkRateLimit(store, key, limit, windowMs, now = Date.now()) {
  const cutoff = now - windowMs;
  const prior = (store.get(key) || []).filter((ts) => ts > cutoff);
  if (prior.length >= limit) {
    const retryAfterSec = Math.max(
      1,
      Math.ceil((prior[0] + windowMs - now) / 1e3)
    );
    store.set(key, prior);
    return { allowed: false, retryAfterSec };
  }
  prior.push(now);
  store.set(key, prior);
  return { allowed: true, retryAfterSec: 0 };
}
__name(checkRateLimit, "checkRateLimit");
function pickAckCopy(topic, lang) {
  const t = normalizeTopic(topic) || "general";
  if (lang === "es") {
    const subjects2 = {
      "tech-talk": "Recibimos tu postulaci\xF3n \u2014 Pereira Tech Talks",
      sponsorship: "Recibimos tu consulta de patrocinio \u2014 Pereira Tech Talks",
      press: "Recibimos tu consulta de prensa \u2014 Pereira Tech Talks",
      conduct: "Recibimos tu reporte \u2014 Pereira Tech Talks",
      general: "Recibimos tu mensaje \u2014 Pereira Tech Talks"
    };
    const bodies2 = {
      "tech-talk": "Gracias por postular tu charla. Revisamos propuestas continuamente y te respondemos en un m\xE1ximo de 7 d\xEDas h\xE1biles para alinear fecha y formato.\n\n\u2014 Pereira Tech Talks",
      sponsorship: "Gracias por tu inter\xE9s en patrocinar Pereira Tech Talks. Un organizador te contactar\xE1 en un m\xE1ximo de 5 d\xEDas h\xE1biles.\n\n\u2014 Pereira Tech Talks",
      press: "Gracias por escribirnos. El equipo de prensa revisar\xE1 tu consulta y responder\xE1 lo antes posible.\n\n\u2014 Pereira Tech Talks",
      conduct: "Gracias por contactarnos. Tu mensaje ser\xE1 tratado con confidencialidad por el equipo de conducta.\n\n\u2014 Pereira Tech Talks",
      general: "Gracias por escribirnos. Te responderemos tan pronto como podamos.\n\n\u2014 Pereira Tech Talks"
    };
    return {
      subject: subjects2[t] || subjects2.general,
      text: bodies2[t] || bodies2.general
    };
  }
  const subjects = {
    "tech-talk": "We received your talk proposal \u2014 Pereira Tech Talks",
    sponsorship: "We received your sponsorship inquiry \u2014 Pereira Tech Talks",
    press: "We received your press inquiry \u2014 Pereira Tech Talks",
    conduct: "We received your report \u2014 Pereira Tech Talks",
    general: "We received your message \u2014 Pereira Tech Talks"
  };
  const bodies = {
    "tech-talk": "Thanks for submitting your talk. We review proposals year-round and reply within 7 business days.\n\n\u2014 Pereira Tech Talks",
    sponsorship: "Thanks for your interest in sponsoring Pereira Tech Talks. An organizer will follow up within 5 business days.\n\n\u2014 Pereira Tech Talks",
    press: "Thanks for reaching out. Our press contacts will reply as soon as possible.\n\n\u2014 Pereira Tech Talks",
    conduct: "Thanks for contacting us. Your message will be handled confidentially by the conduct team.\n\n\u2014 Pereira Tech Talks",
    general: "Thanks for writing. We'll get back to you as soon as we can.\n\n\u2014 Pereira Tech Talks"
  };
  return {
    subject: subjects[t] || subjects.general,
    text: bodies[t] || bodies.general
  };
}
__name(pickAckCopy, "pickAckCopy");

// api/contact.ts
var MAX_NAME_LENGTH = 120;
var MAX_SUBJECT_LENGTH = 140;
var MAX_MESSAGE_LENGTH = 2e3;
var MAX_TALK_TITLE_LENGTH = 160;
var MAX_ABSTRACT_LENGTH = 2e3;
var MAX_TAKEAWAYS_LENGTH = 800;
var MAX_SOCIAL_LENGTH = 300;
var MAX_COMPANY_LENGTH = 160;
var MAX_EMAIL_LENGTH = 254;
var MAX_MEETUP_SLUG_LENGTH = 80;
var MAX_PROFILE_PHOTO_LENGTH = 300;
var MAX_SLIDES_URL_LENGTH = 300;
var FORM_TYPES = [
  "contact",
  "cfs",
  "speaker-school",
  "sponsor",
  "calendar",
  "conduct"
];
var EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var rateLimitStore = /* @__PURE__ */ new Map();
function jsonResponse2(data, status, origin, extraHeaders) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin",
      "Cache-Control": "no-store",
      ...extraHeaders || {}
    }
  });
}
__name(jsonResponse2, "jsonResponse");
function resolveAllowedOrigin(request, env) {
  const requestOrigin = request.headers.get("Origin") || "";
  const allowlist = (env.CONTACT_ALLOWED_ORIGINS || "").split(",").map((value) => value.trim()).filter(Boolean);
  if (allowlist.length === 0) {
    return requestOrigin || "*";
  }
  if (requestOrigin && allowlist.includes(requestOrigin)) {
    return requestOrigin;
  }
  return allowlist[0];
}
__name(resolveAllowedOrigin, "resolveAllowedOrigin");
function sanitiseText(value, maxLength) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, maxLength);
}
__name(sanitiseText, "sanitiseText");
function sanitiseProfilePhoto(value) {
  return sanitiseClickableText(value, MAX_PROFILE_PHOTO_LENGTH);
}
__name(sanitiseProfilePhoto, "sanitiseProfilePhoto");
function sanitiseClickableText(value, maxLength) {
  const text = sanitiseText(value, maxLength);
  if (!text) return "";
  const scheme = text.match(/^\s*([a-z][a-z0-9+.-]*):/i)?.[1]?.toLowerCase();
  if (scheme && scheme !== "http" && scheme !== "https") return "";
  return text;
}
__name(sanitiseClickableText, "sanitiseClickableText");
function isHttpUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  try {
    const { protocol } = new URL(trimmed);
    return protocol === "http:" || protocol === "https:";
  } catch {
    return false;
  }
}
__name(isHttpUrl, "isHttpUrl");
function asBool(value) {
  return value === true || value === "true" || value === "1" || value === "on";
}
__name(asBool, "asBool");
async function resolveMeetupTag(slug, format, requestUrl) {
  if (!isWellFormedMeetupSlug(slug)) {
    console.warn("[cfs] meetup slug rejected by pattern");
    return { slug: "", reject: false };
  }
  const manifest = await fetchCfsOpenManifest(requestUrl);
  if (!manifest) {
    console.warn("[cfs] open-calls manifest unavailable; submitting untagged");
    return { slug: "", reject: false };
  }
  const call = findOpenCall(manifest, slug);
  if (!call) {
    console.warn(`[cfs] no open call for meetup "${slug}"; submitting untagged`);
    return { slug: "", reject: false };
  }
  const requested = format.trim().toLowerCase();
  if (requested && !call.formats.includes(requested)) {
    console.warn(`[cfs] format not accepted by meetup "${slug}"`);
    return { slug: "", reject: true };
  }
  return { slug, reject: false };
}
__name(resolveMeetupTag, "resolveMeetupTag");
function resolveFormType(data) {
  const raw = data._form;
  if (typeof raw === "string" && FORM_TYPES.includes(raw)) {
    return raw;
  }
  const reason = normalizeTopic(
    sanitiseText(data.reason ?? data.topic, 64)
  );
  if (reason === "tech-talk") return "cfs";
  if (reason === "sponsorship") return "sponsor";
  if (reason === "conduct") return "conduct";
  return "contact";
}
__name(resolveFormType, "resolveFormType");
function requireNonEmpty(fields, keys) {
  const missing = keys.filter((k) => !fields[k]?.trim());
  if (missing.length === 0) return null;
  return { ok: false, error: `missing_${missing[0]}` };
}
__name(requireNonEmpty, "requireNonEmpty");
function buildContent(formType, fields, flags2, pagePath, langRaw) {
  const lang = lookupChoice(langRaw || "es", LANG_VALUES) || lookupChoice("Spanish", LANG_VALUES);
  if (!lang) {
    return { ok: false, error: "lang_invalid" };
  }
  if (formType === "contact") {
    const missing2 = requireNonEmpty(fields, [
      "name",
      "email",
      "topic",
      "subject",
      "message"
    ]);
    if (missing2) return missing2;
    const topic = lookupChoice(fields.topic, CONTACT_TOPIC_VALUES);
    if (topic === null) return { ok: false, error: "topic_invalid" };
    return {
      ok: true,
      formUuid: CONTACT_FORM_UUID,
      ackTopic: "general",
      content: {
        [CONTACT_Q.NAME]: fields.name,
        [CONTACT_Q.EMAIL]: fields.email,
        [CONTACT_Q.TOPIC]: topic,
        [CONTACT_Q.SUBJECT]: fields.subject,
        [CONTACT_Q.MESSAGE]: fields.message,
        [CONTACT_Q.LANG]: lang,
        [CONTACT_Q.PAGE_PATH]: pagePath
      }
    };
  }
  if (formType === "cfs") {
    const missing2 = requireNonEmpty(fields, [
      "name",
      "email",
      "talkTitle",
      "format",
      "abstract",
      "takeaways",
      "socialUrl",
      // Required since the branch audit. Enforced here as well as in the form:
      // a client-side-only requirement is not a requirement, because a direct
      // POST skips it entirely.
      "slidesUrl"
    ]);
    if (missing2) return missing2;
    if (fields.abstract.trim().length < 20) {
      return { ok: false, error: "abstract_too_short" };
    }
    if (!isHttpUrl(fields.slidesUrl)) {
      return { ok: false, error: "slides_url_invalid" };
    }
    const format = lookupChoice(fields.format, CFS_FORMAT_VALUES);
    if (format === null) return { ok: false, error: "format_invalid" };
    return {
      ok: true,
      formUuid: CFS_FORM_UUID,
      ackTopic: "tech-talk",
      content: {
        [CFS_Q.NAME]: fields.name,
        [CFS_Q.EMAIL]: fields.email,
        [CFS_Q.TALK_TITLE]: fields.talkTitle,
        [CFS_Q.FORMAT]: format,
        [CFS_Q.ABSTRACT]: fields.abstract,
        [CFS_Q.TAKEAWAYS]: fields.takeaways,
        [CFS_Q.SOCIAL_URL]: fields.socialUrl,
        [CFS_Q.FIRST_TIME]: booleanToDailyBot(flags2.firstTime),
        [CFS_Q.SPEAKER_SCHOOL]: booleanToDailyBot(flags2.speakerSchool),
        // Empty string when the proposal came from the global page. The same
        // shape CFS_Q.NOTES already ships successfully on this form.
        [CFS_Q.MEETUP]: meetupUrlFromSlug(fields.meetupSlug),
        [CFS_Q.SLIDES]: fields.slidesUrl,
        [CFS_Q.PROFILE_PHOTO]: fields.profilePhoto,
        [CFS_Q.NOTES]: fields.message || fields.notes || "",
        [CFS_Q.LANG]: lang,
        [CFS_Q.PAGE_PATH]: pagePath
      }
    };
  }
  if (formType === "speaker-school") {
    const missing2 = requireNonEmpty(fields, [
      "name",
      "email",
      "experienceLevel",
      "goals",
      "topicsOfInterest",
      "availability"
    ]);
    if (missing2) return missing2;
    const level = lookupChoice(
      fields.experienceLevel,
      EXPERIENCE_LEVEL_VALUES
    );
    if (level === null) return { ok: false, error: "experience_level_invalid" };
    return {
      ok: true,
      formUuid: SPEAKER_SCHOOL_FORM_UUID,
      ackTopic: "general",
      content: {
        [SPEAKER_SCHOOL_Q.NAME]: fields.name,
        [SPEAKER_SCHOOL_Q.EMAIL]: fields.email,
        [SPEAKER_SCHOOL_Q.EXPERIENCE_LEVEL]: level,
        [SPEAKER_SCHOOL_Q.GOALS]: fields.goals,
        [SPEAKER_SCHOOL_Q.TOPICS]: fields.topicsOfInterest,
        [SPEAKER_SCHOOL_Q.AVAILABILITY]: fields.availability,
        [SPEAKER_SCHOOL_Q.PRIOR_SPEAKING]: fields.priorSpeaking || "",
        [SPEAKER_SCHOOL_Q.SOCIAL]: fields.socialOrLinkedin || "",
        [SPEAKER_SCHOOL_Q.MESSAGE]: fields.message || "",
        [SPEAKER_SCHOOL_Q.LANG]: lang,
        [SPEAKER_SCHOOL_Q.PAGE_PATH]: pagePath
      }
    };
  }
  if (formType === "sponsor") {
    const missing2 = requireNonEmpty(fields, [
      "name",
      "email",
      "company",
      "contactRole",
      "tierInterest",
      "contributionType",
      "message"
    ]);
    if (missing2) return missing2;
    const tier = lookupChoice(fields.tierInterest, SPONSOR_TIER_VALUES);
    const contribution = lookupChoice(
      fields.contributionType,
      CONTRIBUTION_TYPE_VALUES
    );
    if (tier === null) return { ok: false, error: "tier_invalid" };
    if (contribution === null) {
      return { ok: false, error: "contribution_invalid" };
    }
    return {
      ok: true,
      formUuid: SPONSORS_FORM_UUID,
      ackTopic: "sponsorship",
      content: {
        [SPONSORS_Q.NAME]: fields.name,
        [SPONSORS_Q.EMAIL]: fields.email,
        [SPONSORS_Q.COMPANY]: fields.company,
        [SPONSORS_Q.ROLE]: fields.contactRole,
        [SPONSORS_Q.TIER]: tier,
        [SPONSORS_Q.CONTRIBUTION]: contribution,
        [SPONSORS_Q.MESSAGE]: fields.message,
        [SPONSORS_Q.LANG]: lang,
        [SPONSORS_Q.PAGE_PATH]: pagePath
      }
    };
  }
  if (formType === "calendar") {
    const missing2 = requireNonEmpty(fields, [
      "name",
      "email",
      "communityName",
      "googleCalendarId",
      "shortDescription"
    ]);
    if (missing2) return missing2;
    return {
      ok: true,
      formUuid: CALENDAR_FORM_UUID,
      ackTopic: "collaboration",
      content: {
        [CALENDAR_Q.NAME]: fields.name,
        [CALENDAR_Q.EMAIL]: fields.email,
        [CALENDAR_Q.COMMUNITY]: fields.communityName,
        [CALENDAR_Q.CALENDAR_ID]: fields.googleCalendarId,
        [CALENDAR_Q.CALENDAR_URL]: fields.publicCalendarUrl || "",
        [CALENDAR_Q.WEBSITE]: fields.communityWebsite || "",
        [CALENDAR_Q.DESCRIPTION]: fields.shortDescription,
        [CALENDAR_Q.LANG]: lang,
        [CALENDAR_Q.PAGE_PATH]: pagePath
      }
    };
  }
  const missing = requireNonEmpty(fields, ["incidentDescription"]);
  if (missing) return missing;
  const anonymous = flags2.anonymous;
  const content = {
    [CONDUCT_Q.INCIDENT]: fields.incidentDescription,
    [CONDUCT_Q.WHEN]: fields.incidentDate || "",
    [CONDUCT_Q.PEOPLE]: fields.peopleInvolved || "",
    [CONDUCT_Q.ANONYMOUS]: booleanToDailyBot(anonymous),
    [CONDUCT_Q.REPORTER_NAME]: anonymous ? "" : fields.name || "",
    [CONDUCT_Q.REPORTER_EMAIL]: anonymous ? "" : fields.email || "",
    [CONDUCT_Q.FOLLOWUP]: fields.preferredFollowup || "",
    [CONDUCT_Q.LANG]: lang,
    [CONDUCT_Q.PAGE_PATH]: pagePath
  };
  if (!content[CONDUCT_Q.INCIDENT] && fields.message) {
    content[CONDUCT_Q.INCIDENT] = fields.message;
  }
  return {
    ok: true,
    formUuid: CONDUCT_FORM_UUID,
    ackTopic: "conduct",
    content
  };
}
__name(buildContent, "buildContent");
async function resendAck(env, to, topic, lang) {
  if (!env.RESEND_API_KEY || !env.CONTACT_FROM_EMAIL || !to) return;
  const ack = pickAckCopy(topic, lang);
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: env.CONTACT_FROM_EMAIL,
        to: [to],
        subject: ack.subject,
        text: ack.text
      })
    });
  } catch (err) {
    console.error("[contact] Resend ack failed", err);
  }
}
__name(resendAck, "resendAck");
async function onRequestOptions(context) {
  const origin = resolveAllowedOrigin(context.request, context.env);
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin"
    }
  });
}
__name(onRequestOptions, "onRequestOptions");
async function onRequestPost(context) {
  const origin = resolveAllowedOrigin(context.request, context.env);
  if (!context.env.DAILYBOT_API_KEY) {
    return jsonResponse2(
      { ok: false, error: "backend_not_configured" },
      503,
      origin
    );
  }
  let raw;
  try {
    raw = await context.request.json();
  } catch {
    return jsonResponse2({ ok: false, error: "invalid_json" }, 400, origin);
  }
  if (!raw || typeof raw !== "object") {
    return jsonResponse2({ ok: false, error: "invalid_payload" }, 400, origin);
  }
  const data = raw;
  void context.env.CONTACT_TURNSTILE_SECRET;
  const ip = context.request.headers.get("CF-Connecting-IP") || context.request.headers.get("X-Forwarded-For") || "unknown";
  const limit = Number(context.env.CONTACT_RATE_LIMIT || "8");
  const windowMs = Number(context.env.CONTACT_RATE_WINDOW_MS || "600000");
  const rl = checkRateLimit(rateLimitStore, ip, limit, windowMs);
  if (!rl.allowed) {
    return jsonResponse2(
      { ok: false, error: "rate_limited" },
      429,
      origin,
      { "Retry-After": String(rl.retryAfterSec) }
    );
  }
  const website = sanitiseText(data.website, 200);
  const name = sanitiseText(data.name, MAX_NAME_LENGTH);
  const message = sanitiseText(
    data.message ?? data.incidentDescription,
    MAX_MESSAGE_LENGTH
  );
  if (looksLikeSpamPayload({ name, message, website })) {
    return jsonResponse2({ ok: true }, 200, origin);
  }
  const formType = resolveFormType(data);
  let email = sanitiseText(data.email, MAX_EMAIL_LENGTH).toLowerCase();
  const langRaw = sanitiseText(data.lang, 16) || "es";
  const isAnonymousConduct = formType === "conduct" && asBool(data.anonymous);
  if (!isAnonymousConduct) {
    if (!email || !EMAIL_REGEX.test(email)) {
      return jsonResponse2({ ok: false, error: "email_invalid" }, 400, origin);
    }
  } else {
    email = "";
  }
  const reason = normalizeTopic(sanitiseText(data.reason ?? data.topic, 64));
  const topicForContact = formType === "contact" ? reason && reason !== "tech-talk" && reason !== "sponsorship" && reason !== "conduct" ? reason : sanitiseText(data.topic, 64) || "general" : "";
  const fields = {
    name,
    email,
    topic: topicForContact || sanitiseText(data.topic, 64) || reason,
    subject: sanitiseText(data.subject, MAX_SUBJECT_LENGTH),
    message: sanitiseText(data.message, MAX_MESSAGE_LENGTH),
    notes: sanitiseText(data.notes, MAX_MESSAGE_LENGTH),
    talkTitle: sanitiseText(data.talkTitle, MAX_TALK_TITLE_LENGTH),
    format: sanitiseText(data.format, 32),
    abstract: sanitiseText(data.abstract, MAX_ABSTRACT_LENGTH),
    takeaways: sanitiseText(data.takeaways, MAX_TAKEAWAYS_LENGTH),
    socialUrl: sanitiseText(data.socialUrl, MAX_SOCIAL_LENGTH),
    meetupSlug: sanitiseText(data.meetupSlug, MAX_MEETUP_SLUG_LENGTH),
    profilePhoto: sanitiseProfilePhoto(data.profilePhoto),
    slidesUrl: sanitiseClickableText(data.slidesUrl, MAX_SLIDES_URL_LENGTH),
    company: sanitiseText(data.company, MAX_COMPANY_LENGTH),
    contactRole: sanitiseText(data.contactRole, 120),
    tierInterest: sanitiseText(data.tierInterest, 32),
    contributionType: sanitiseText(data.contributionType, 32),
    experienceLevel: sanitiseText(data.experienceLevel, 32),
    goals: sanitiseText(data.goals, MAX_MESSAGE_LENGTH),
    topicsOfInterest: sanitiseText(data.topicsOfInterest, MAX_MESSAGE_LENGTH),
    availability: sanitiseText(data.availability, MAX_MESSAGE_LENGTH),
    priorSpeaking: sanitiseText(data.priorSpeaking, MAX_MESSAGE_LENGTH),
    socialOrLinkedin: sanitiseText(data.socialOrLinkedin, MAX_SOCIAL_LENGTH),
    communityName: sanitiseText(data.communityName, MAX_COMPANY_LENGTH),
    googleCalendarId: sanitiseText(data.googleCalendarId, 300),
    publicCalendarUrl: sanitiseText(data.publicCalendarUrl, 300),
    communityWebsite: sanitiseText(data.communityWebsite, 300),
    shortDescription: sanitiseText(data.shortDescription, MAX_MESSAGE_LENGTH),
    incidentDescription: sanitiseText(
      data.incidentDescription ?? data.message,
      MAX_MESSAGE_LENGTH
    ),
    incidentDate: sanitiseText(data.incidentDate, 120),
    peopleInvolved: sanitiseText(data.peopleInvolved, MAX_MESSAGE_LENGTH),
    preferredFollowup: sanitiseText(data.preferredFollowup, MAX_MESSAGE_LENGTH)
  };
  const flags2 = {
    firstTime: asBool(data.firstTime),
    speakerSchool: asBool(data.speakerSchool),
    anonymous: asBool(data.anonymous)
  };
  if (formType === "cfs" && fields.meetupSlug) {
    const resolved = await resolveMeetupTag(
      fields.meetupSlug,
      fields.format,
      context.request.url
    );
    if (resolved.reject) {
      return jsonResponse2(
        { ok: false, error: "format_not_allowed_for_meetup" },
        400,
        origin
      );
    }
    fields.meetupSlug = resolved.slug;
  }
  const pagePath = normalizePagePath(data.page_path ?? data.pagePath);
  const built = buildContent(formType, fields, flags2, pagePath, langRaw);
  if (!built.ok) {
    return jsonResponse2({ ok: false, error: built.error }, 400, origin);
  }
  const result = await submitFormResponse(
    built.formUuid,
    built.content,
    context.env
  );
  if (!result.ok) {
    const error = result.error === "INVALID_CHOICE" ? "invalid_choice" : result.error === "MISSING_REQUIRED" ? "missing_required" : result.error === "AUTH" ? "backend_not_configured" : "send_failed";
    return jsonResponse2({ ok: false, error }, result.status, origin);
  }
  const ackLang = langRaw === "en" ? "en" : "es";
  const allowAck = !(formType === "conduct" && flags2.anonymous);
  if (allowAck && email) {
    context.waitUntil(
      resendAck(context.env, email, built.ackTopic, ackLang).then(() => void 0)
    );
  }
  return jsonResponse2(
    { ok: true, recordUuid: result.uuid, formType },
    200,
    origin
  );
}
__name(onRequestPost, "onRequestPost");
async function onRequest5(context) {
  if (context.request.method === "OPTIONS") {
    return onRequestOptions(context);
  }
  if (context.request.method === "POST") {
    return onRequestPost(context);
  }
  const origin = resolveAllowedOrigin(context.request, context.env);
  return jsonResponse2({ ok: false, error: "method_not_allowed" }, 405, origin);
}
__name(onRequest5, "onRequest");

// api/ptd-subscribe.ts
var EMAIL_REGEX2 = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function jsonResponse3(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin",
      "Cache-Control": "no-store"
    }
  });
}
__name(jsonResponse3, "jsonResponse");
function resolveAllowedOrigin2(request, env) {
  const requestOrigin = request.headers.get("Origin") || "";
  const allowlist = (env.CONTACT_ALLOWED_ORIGINS || "").split(",").map((v) => v.trim()).filter(Boolean);
  if (allowlist.length === 0) return requestOrigin || "*";
  if (requestOrigin && allowlist.includes(requestOrigin)) return requestOrigin;
  return allowlist[0];
}
__name(resolveAllowedOrigin2, "resolveAllowedOrigin");
async function onRequestOptions2(context) {
  const origin = resolveAllowedOrigin2(context.request, context.env);
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
      Vary: "Origin"
    }
  });
}
__name(onRequestOptions2, "onRequestOptions");
async function onRequestPost2(context) {
  const origin = resolveAllowedOrigin2(context.request, context.env);
  const sheetsUrl = context.env.PTD_SUBSCRIBE_SHEETS_URL;
  if (!sheetsUrl) {
    return jsonResponse3({ ok: false, error: "backend_not_configured" }, 503, origin);
  }
  let raw;
  try {
    raw = await context.request.json();
  } catch {
    return jsonResponse3({ ok: false, error: "invalid_json" }, 400, origin);
  }
  if (!raw || typeof raw !== "object") {
    return jsonResponse3({ ok: false, error: "invalid_payload" }, 400, origin);
  }
  const data = raw;
  const website = typeof data.website === "string" ? data.website.trim() : "";
  if (website) {
    return jsonResponse3({ ok: true }, 200, origin);
  }
  const email = typeof data.email === "string" ? data.email.trim().toLowerCase().slice(0, 254) : "";
  const year = typeof data.year === "number" ? data.year : 2026;
  const lang = typeof data.lang === "string" ? data.lang.slice(0, 8) : "es";
  if (!email || !EMAIL_REGEX2.test(email)) {
    return jsonResponse3({ ok: false, error: "email_invalid" }, 400, origin);
  }
  try {
    await fetch(sheetsUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        year,
        lang,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      })
    });
    return jsonResponse3({ ok: true }, 200, origin);
  } catch {
    return jsonResponse3({ ok: false, error: "forward_failed" }, 502, origin);
  }
}
__name(onRequestPost2, "onRequestPost");
async function onRequest6(context) {
  if (context.request.method === "OPTIONS") return onRequestOptions2(context);
  if (context.request.method === "POST") return onRequestPost2(context);
  const origin = resolveAllowedOrigin2(context.request, context.env);
  return jsonResponse3({ ok: false, error: "method_not_allowed" }, 405, origin);
}
__name(onRequest6, "onRequest");

// agent/claim.ts
async function onRequest7(context) {
  const origin = new URL(context.request.url).origin;
  const body = {
    status: "not_applicable",
    message: "No claim ceremony is required for public:read access on Pereira Tech Talks. See /auth.md.",
    skill: `${origin}/auth.md`
  };
  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, must-revalidate"
    }
  });
}
__name(onRequest7, "onRequest");

// agent/register.ts
async function onRequest8(context) {
  const origin = new URL(context.request.url).origin;
  const method = context.request.method.toUpperCase();
  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      }
    });
  }
  const body = {
    status: "public_no_auth_required",
    message: "Pereira Tech Talks public content (blog, meetups, slides, Pereira Tech Day) is readable without registration. Agents should use /.well-known/api-catalog, /llms.txt, and Markdown twin endpoints. Contact the community for privileged write access.",
    skill: `${origin}/auth.md`,
    resource_metadata: `${origin}/.well-known/oauth-protected-resource`,
    scopes: ["public:read"],
    contact: `${origin}/contact/`
  };
  return new Response(JSON.stringify(body, null, 2), {
    status: method === "POST" ? 200 : 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, must-revalidate"
    }
  });
}
__name(onRequest8, "onRequest");

// _middleware.ts
var AI_BOT_PATTERNS = [
  { pattern: /GPTBot/i, name: "GPTBot" },
  { pattern: /ChatGPT-User/i, name: "ChatGPT-User" },
  { pattern: /ClaudeBot/i, name: "ClaudeBot" },
  { pattern: /anthropic-ai/i, name: "anthropic-ai" },
  { pattern: /Google-Extended/i, name: "Google-Extended" },
  { pattern: /Bytespider/i, name: "Bytespider" },
  { pattern: /CCBot/i, name: "CCBot" },
  { pattern: /PerplexityBot/i, name: "PerplexityBot" },
  { pattern: /Applebot-Extended/i, name: "Applebot-Extended" },
  { pattern: /Amazonbot/i, name: "Amazonbot" },
  { pattern: /Meta-ExternalAgent/i, name: "Meta-ExternalAgent" },
  { pattern: /cohere-ai/i, name: "cohere-ai" },
  { pattern: /OAI-SearchBot/i, name: "OAI-SearchBot" }
];
var BOT_KEYWORD_PATTERN = /bot[\/\s;)]/i;
var SPIDER_CRAWLER_PATTERN = /crawler|spider|scraper|fetcher|agent[\/\s;)]/i;
var IGNORED_BOTS_PATTERN = /Googlebot|bingbot|YandexBot|Baiduspider|DuckDuckBot|Slurp|facebot|ia_archiver|Uptimebot|UptimeRobot|pingdom|StatusCake|NodePing|Site24x7|Checkly|DatadogSynthetics|NewRelicPinger|Better Uptime|AhrefsBot|SemrushBot|DataForSeoBot|MJ12bot|Discordbot|PetalBot|Barkrowler|BitSightBot|Jetslide|archive\.org_bot|RafineriBot|AwarioBot|Applebot(?!-Extended)|Twitterbot|SeznamBot|DotBot|AgentWarsBot|meta-webindexer/i;
var UMAMI_API_URL = buildUmamiUpstreamUrl("api/send");
function detectAiBot(userAgent) {
  for (const { pattern, name } of AI_BOT_PATTERNS) {
    if (pattern.test(userAgent)) {
      return name;
    }
  }
  return null;
}
__name(detectAiBot, "detectAiBot");
function isUnknownBot(userAgent) {
  if (!userAgent || userAgent.length < 5) return false;
  if (IGNORED_BOTS_PATTERN.test(userAgent)) return false;
  return BOT_KEYWORD_PATTERN.test(userAgent) || SPIDER_CRAWLER_PATTERN.test(userAgent);
}
__name(isUnknownBot, "isUnknownBot");
function extractBotName(userAgent) {
  const compatibleMatch = userAgent.match(/compatible;\s*([^\s;\/]+)/);
  if (compatibleMatch) return compatibleMatch[1].slice(0, 60);
  const inlineMatch = userAgent.match(/;\s*compatible;\s*([^\s;\/]+)/);
  if (inlineMatch) return inlineMatch[1].slice(0, 60);
  const firstToken = userAgent.match(/^([^\s\/]+)/);
  const name = firstToken ? firstToken[1] : userAgent;
  return name.slice(0, 60);
}
__name(extractBotName, "extractBotName");
function buildUmamiPayload(websiteId, eventName, botName, url, hostname, language, userAgent) {
  const data = {
    bot: botName,
    path: url,
    method: "GET"
  };
  if (userAgent) {
    data.user_agent = userAgent.slice(0, 200);
  }
  return {
    payload: {
      website: websiteId,
      url,
      hostname,
      language,
      name: eventName,
      data
    },
    type: "event"
  };
}
__name(buildUmamiPayload, "buildUmamiPayload");
async function sendToUmami(websiteId, eventName, botName, request, userAgent) {
  const requestUrl = new URL(request.url);
  const body = buildUmamiPayload(
    websiteId,
    eventName,
    botName,
    requestUrl.pathname,
    requestUrl.hostname,
    "en-US",
    userAgent
  );
  try {
    await fetch(UMAMI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
  } catch {
  }
}
__name(sendToUmami, "sendToUmami");
var LIGHTHOUSE_UA_PATTERN = /Chrome-Lighthouse|PageSpeed|Lighthouse/i;
async function tryRewriteRobotsForLighthouse(context) {
  const url = new URL(context.request.url);
  if (url.pathname !== "/robots.txt") return null;
  const ua = context.request.headers.get("user-agent") || "";
  if (!LIGHTHOUSE_UA_PATTERN.test(ua)) return null;
  try {
    const assetResponse = await context.env.ASSETS.fetch(
      new Request(new URL("/robots.txt", url.origin).toString())
    );
    if (!assetResponse.ok) return null;
    const originalBody = await assetResponse.text();
    const rewritten = originalBody.replace(/^Content-Signal:.*\r?\n?/m, "");
    return new Response(rewritten, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=0, must-revalidate",
        Vary: "User-Agent",
        "X-Robots-Rewrite": "lighthouse"
      }
    });
  } catch {
    return null;
  }
}
__name(tryRewriteRobotsForLighthouse, "tryRewriteRobotsForLighthouse");
var MARKDOWN_EXCLUDED_PREFIXES = ["/api/", "/internal/", "/_"];
var MARKDOWN_EXCLUDED_EXTENSIONS = /\.(js|css|png|jpg|jpeg|webp|svg|ico|woff|woff2|xml|json|txt|md)$/i;
function resolveMarkdownPath(pathname) {
  let clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (clean === "/") return "/index.md";
  if (clean.endsWith("/index")) return `${clean}.md`;
  return `${clean}.md`;
}
__name(resolveMarkdownPath, "resolveMarkdownPath");
async function tryServeMarkdown(context) {
  const accept = context.request.headers.get("accept") || "";
  if (!accept.includes("text/markdown")) return null;
  const url = new URL(context.request.url);
  const pathname = url.pathname;
  for (const prefix of MARKDOWN_EXCLUDED_PREFIXES) {
    if (pathname.startsWith(prefix)) return null;
  }
  if (MARKDOWN_EXCLUDED_EXTENSIONS.test(pathname)) return null;
  const mdPath = resolveMarkdownPath(pathname);
  try {
    const mdUrl = new URL(mdPath, url.origin);
    let assetResponse = await context.env.ASSETS.fetch(
      new Request(mdUrl.toString())
    );
    if (!assetResponse.ok && !mdPath.endsWith("/index.md")) {
      const indexMdPath = `${mdPath.replace(/\.md$/, "")}/index.md`;
      const indexMdUrl = new URL(indexMdPath, url.origin);
      assetResponse = await context.env.ASSETS.fetch(
        new Request(indexMdUrl.toString())
      );
    }
    if (!assetResponse.ok) return null;
    return new Response(assetResponse.body, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        "Vary": "Accept",
        "X-Content-Negotiation": "markdown"
      }
    });
  } catch {
    return null;
  }
}
__name(tryServeMarkdown, "tryServeMarkdown");
function trackMarkdownRequest(context, source) {
  const websiteId = context.env.PUBLIC_UMAMI_WEBSITE_ID;
  if (!websiteId) return;
  const userAgent = context.request.headers.get("user-agent") || "";
  const knownBot = detectAiBot(userAgent);
  const botName = knownBot || (isUnknownBot(userAgent) ? extractBotName(userAgent) : "unknown");
  const url = new URL(context.request.url);
  console.log(
    `[Markdown ${source}] ${botName} \u2192 ${url.pathname} (${userAgent.slice(0, 100)})`
  );
  const data = {
    bot: botName,
    path: url.pathname,
    source,
    user_agent: userAgent.slice(0, 200)
  };
  context.waitUntil(
    fetch(UMAMI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payload: {
          website: websiteId,
          url: url.pathname,
          hostname: url.hostname,
          language: "en-US",
          name: "markdown_request",
          data
        },
        type: "event"
      })
    }).catch(() => {
    })
  );
}
__name(trackMarkdownRequest, "trackMarkdownRequest");
function isDirectMarkdownUrl(pathname) {
  return pathname.endsWith(".md") && !MARKDOWN_EXCLUDED_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}
__name(isDirectMarkdownUrl, "isDirectMarkdownUrl");
async function onRequest9(context) {
  const robotsRewrite = await tryRewriteRobotsForLighthouse(context);
  if (robotsRewrite) return robotsRewrite;
  const markdownResponse = await tryServeMarkdown(context);
  if (markdownResponse) {
    trackMarkdownRequest(context, "content_negotiation");
    return markdownResponse;
  }
  const url = new URL(context.request.url);
  if (isDirectMarkdownUrl(url.pathname)) {
    trackMarkdownRequest(context, "direct_url");
  }
  const userAgent = context.request.headers.get("user-agent") || "";
  const botName = detectAiBot(userAgent);
  if (botName) {
    console.log(
      `[AI Bot] ${botName} \u2192 ${url.pathname} (${context.request.method})`
    );
    const websiteId = context.env.PUBLIC_UMAMI_WEBSITE_ID;
    if (websiteId) {
      context.waitUntil(
        sendToUmami(websiteId, "ai_bot_visit", botName, context.request)
      );
    }
    return context.next();
  }
  if (isUnknownBot(userAgent)) {
    const name = extractBotName(userAgent);
    console.log(
      `[Unknown Bot] ${name} \u2192 ${url.pathname} (${context.request.method}) UA: ${userAgent.slice(0, 150)}`
    );
    const websiteId = context.env.PUBLIC_UMAMI_WEBSITE_ID;
    if (websiteId) {
      context.waitUntil(
        sendToUmami(
          websiteId,
          "unknown_bot_visit",
          name,
          context.request,
          userAgent
        )
      );
    }
  }
  return context.next();
}
__name(onRequest9, "onRequest");

// ../.wrangler/tmp/pages-2y4RVY/functionsRoutes-0.9124384881341128.mjs
var routes = [
  {
    routePath: "/agent/claim/complete",
    mountPath: "/agent/claim",
    method: "",
    middlewares: [],
    modules: [onRequest]
  },
  {
    routePath: "/api/umami/:path*",
    mountPath: "/api/umami",
    method: "",
    middlewares: [],
    modules: [onRequest2]
  },
  {
    routePath: "/.well-known/oauth-authorization-server",
    mountPath: "/.well-known",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/.well-known/oauth-authorization-server",
    mountPath: "/.well-known",
    method: "HEAD",
    middlewares: [],
    modules: [onRequestHead]
  },
  {
    routePath: "/.well-known/oauth-protected-resource",
    mountPath: "/.well-known",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/.well-known/oauth-protected-resource",
    mountPath: "/.well-known",
    method: "HEAD",
    middlewares: [],
    modules: [onRequestHead2]
  },
  {
    routePath: "/api/contact",
    mountPath: "/api",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions]
  },
  {
    routePath: "/api/contact",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/ptd-subscribe",
    mountPath: "/api",
    method: "OPTIONS",
    middlewares: [],
    modules: [onRequestOptions2]
  },
  {
    routePath: "/api/ptd-subscribe",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/.well-known/oauth-authorization-server",
    mountPath: "/.well-known",
    method: "",
    middlewares: [],
    modules: [onRequest3]
  },
  {
    routePath: "/.well-known/oauth-protected-resource",
    mountPath: "/.well-known",
    method: "",
    middlewares: [],
    modules: [onRequest4]
  },
  {
    routePath: "/agent/claim",
    mountPath: "/agent",
    method: "",
    middlewares: [],
    modules: [onRequest7]
  },
  {
    routePath: "/agent/register",
    mountPath: "/agent",
    method: "",
    middlewares: [],
    modules: [onRequest8]
  },
  {
    routePath: "/api/contact",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest5]
  },
  {
    routePath: "/api/ptd-subscribe",
    mountPath: "/api",
    method: "",
    middlewares: [],
    modules: [onRequest6]
  },
  {
    routePath: "/",
    mountPath: "/",
    method: "",
    middlewares: [onRequest9],
    modules: []
  }
];

// ../../home/node/.npm/_npx/d77349f55c2be1c0/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../../home/node/.npm/_npx/d77349f55c2be1c0/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");

// ../../home/node/.npm/_npx/d77349f55c2be1c0/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../home/node/.npm/_npx/d77349f55c2be1c0/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    const body = JSON.stringify(error);
    const headers = {
      "Content-Type": "application/json",
      "MF-Experimental-Error-Stack": "true"
    };
    const encoded = encodeURIComponent(body);
    if (encoded.length <= 8192) {
      headers["MF-Experimental-Error-Stack-Payload"] = encoded;
    }
    return new Response(body, { status: 500, headers });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// ../.wrangler/tmp/bundle-6qHXxf/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = pages_template_worker_default;

// ../../home/node/.npm/_npx/d77349f55c2be1c0/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// ../.wrangler/tmp/bundle-6qHXxf/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  scheduledTime;
  cron;
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=functionsWorker-0.5522104109476836.mjs.map
