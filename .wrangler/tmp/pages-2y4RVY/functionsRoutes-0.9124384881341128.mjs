import { onRequest as __agent_claim_complete_ts_onRequest } from "/app/functions/agent/claim/complete.ts"
import { onRequest as __api_umami___path___ts_onRequest } from "/app/functions/api/umami/[[path]].ts"
import { onRequestGet as ___well_known_oauth_authorization_server_ts_onRequestGet } from "/app/functions/.well-known/oauth-authorization-server.ts"
import { onRequestHead as ___well_known_oauth_authorization_server_ts_onRequestHead } from "/app/functions/.well-known/oauth-authorization-server.ts"
import { onRequestGet as ___well_known_oauth_protected_resource_ts_onRequestGet } from "/app/functions/.well-known/oauth-protected-resource.ts"
import { onRequestHead as ___well_known_oauth_protected_resource_ts_onRequestHead } from "/app/functions/.well-known/oauth-protected-resource.ts"
import { onRequestOptions as __api_contact_ts_onRequestOptions } from "/app/functions/api/contact.ts"
import { onRequestPost as __api_contact_ts_onRequestPost } from "/app/functions/api/contact.ts"
import { onRequestOptions as __api_ptd_subscribe_ts_onRequestOptions } from "/app/functions/api/ptd-subscribe.ts"
import { onRequestPost as __api_ptd_subscribe_ts_onRequestPost } from "/app/functions/api/ptd-subscribe.ts"
import { onRequest as ___well_known_oauth_authorization_server_ts_onRequest } from "/app/functions/.well-known/oauth-authorization-server.ts"
import { onRequest as ___well_known_oauth_protected_resource_ts_onRequest } from "/app/functions/.well-known/oauth-protected-resource.ts"
import { onRequest as __agent_claim_ts_onRequest } from "/app/functions/agent/claim.ts"
import { onRequest as __agent_register_ts_onRequest } from "/app/functions/agent/register.ts"
import { onRequest as __api_contact_ts_onRequest } from "/app/functions/api/contact.ts"
import { onRequest as __api_ptd_subscribe_ts_onRequest } from "/app/functions/api/ptd-subscribe.ts"
import { onRequest as ___middleware_ts_onRequest } from "/app/functions/_middleware.ts"

export const routes = [
    {
      routePath: "/agent/claim/complete",
      mountPath: "/agent/claim",
      method: "",
      middlewares: [],
      modules: [__agent_claim_complete_ts_onRequest],
    },
  {
      routePath: "/api/umami/:path*",
      mountPath: "/api/umami",
      method: "",
      middlewares: [],
      modules: [__api_umami___path___ts_onRequest],
    },
  {
      routePath: "/.well-known/oauth-authorization-server",
      mountPath: "/.well-known",
      method: "GET",
      middlewares: [],
      modules: [___well_known_oauth_authorization_server_ts_onRequestGet],
    },
  {
      routePath: "/.well-known/oauth-authorization-server",
      mountPath: "/.well-known",
      method: "HEAD",
      middlewares: [],
      modules: [___well_known_oauth_authorization_server_ts_onRequestHead],
    },
  {
      routePath: "/.well-known/oauth-protected-resource",
      mountPath: "/.well-known",
      method: "GET",
      middlewares: [],
      modules: [___well_known_oauth_protected_resource_ts_onRequestGet],
    },
  {
      routePath: "/.well-known/oauth-protected-resource",
      mountPath: "/.well-known",
      method: "HEAD",
      middlewares: [],
      modules: [___well_known_oauth_protected_resource_ts_onRequestHead],
    },
  {
      routePath: "/api/contact",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_contact_ts_onRequestOptions],
    },
  {
      routePath: "/api/contact",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_contact_ts_onRequestPost],
    },
  {
      routePath: "/api/ptd-subscribe",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_ptd_subscribe_ts_onRequestOptions],
    },
  {
      routePath: "/api/ptd-subscribe",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_ptd_subscribe_ts_onRequestPost],
    },
  {
      routePath: "/.well-known/oauth-authorization-server",
      mountPath: "/.well-known",
      method: "",
      middlewares: [],
      modules: [___well_known_oauth_authorization_server_ts_onRequest],
    },
  {
      routePath: "/.well-known/oauth-protected-resource",
      mountPath: "/.well-known",
      method: "",
      middlewares: [],
      modules: [___well_known_oauth_protected_resource_ts_onRequest],
    },
  {
      routePath: "/agent/claim",
      mountPath: "/agent",
      method: "",
      middlewares: [],
      modules: [__agent_claim_ts_onRequest],
    },
  {
      routePath: "/agent/register",
      mountPath: "/agent",
      method: "",
      middlewares: [],
      modules: [__agent_register_ts_onRequest],
    },
  {
      routePath: "/api/contact",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_contact_ts_onRequest],
    },
  {
      routePath: "/api/ptd-subscribe",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_ptd_subscribe_ts_onRequest],
    },
  {
      routePath: "/",
      mountPath: "/",
      method: "",
      middlewares: [___middleware_ts_onRequest],
      modules: [],
    },
  ]