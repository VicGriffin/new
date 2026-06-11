import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

function mergeVercelEnv(env: unknown) {
  if (!env || typeof env !== "object") return;
  const rawEnv = env as Record<string, unknown>;
  
  // Map all Supabase-related env vars from Vercel to process.env
  // These are required for both client-side (VITE_*) and server-side access
  const allowedKeys = [
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_ANON_KEY",
    "NODE_ENV",
  ];

  for (const key of allowedKeys) {
    const value = rawEnv[key];
    if (typeof value === "string" && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
  
  // Log warning if critical Supabase env vars are missing in production
  if (process.env.NODE_ENV === "production") {
    const missing = [];
    if (!process.env.VITE_SUPABASE_URL) missing.push("VITE_SUPABASE_URL");
    if (!process.env.VITE_SUPABASE_ANON_KEY) missing.push("VITE_SUPABASE_ANON_KEY");
    if (missing.length > 0) {
      console.error(
        `[SSR] CRITICAL: Missing Supabase environment variables in production: ${missing.join(", ")}. ` +
        `Check your Vercel dashboard → Settings → Environment Variables.`
      );
    }
  }
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!body.includes('"unhandled":true') || !body.includes('"message":"HTTPError"')) {
    return response;
  }

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      mergeVercelEnv(env);
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error("[SSR] Unhandled error during fetch:", error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
