import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { P as PageShell } from "./layout-DxlPml8Q.mjs";
import { supabase } from "./client-CZ7d5FUj.mjs";
import "../_libs/sonner.mjs";
import { C as Clock, e as MapPin, f as Calendar } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "./router-B9ucVT0q.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function Events() {
  const {
    data: events,
    isLoading,
    error
  } = useQuery({
    queryKey: ["events-public"],
    queryFn: async () => {
      const {
        data,
        error: error2
      } = await supabase.from("events").select("*").eq("is_published", true).gte("starts_at", (/* @__PURE__ */ new Date()).toISOString()).order("starts_at", {
        ascending: true
      });
      if (error2) throw error2;
      return data ?? [];
    }
  });
  const {
    data: past
  } = useQuery({
    queryKey: ["events-past"],
    queryFn: async () => {
      const {
        data,
        error: error2
      } = await supabase.from("events").select("*").eq("is_published", true).lt("starts_at", (/* @__PURE__ */ new Date()).toISOString()).order("starts_at", {
        ascending: false
      }).limit(6);
      if (error2) throw error2;
      return data ?? [];
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "hero-mesh text-white relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid-pattern opacity-25", "aria-hidden": true }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-[0.2em] text-emerald-brand", children: "Events" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-4xl lg:text-6xl font-bold leading-tight max-w-3xl", children: "Conferences, webinars & training" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-lg text-white/80 max-w-2xl", children: "Join AMTMTI events across Africa — from virtual CPD sessions to continental conferences." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-navy", children: "Upcoming events" }),
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-muted-foreground", children: "Loading events…" }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-destructive", children: "Could not load events." }),
      !isLoading && !events?.length && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground", children: "No upcoming events scheduled. Subscribe to our news for announcements." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 space-y-4", children: events?.map((ev) => /* @__PURE__ */ jsxRuntimeExports.jsx(EventCard, { event: ev }, ev.id)) }),
      !!past?.length && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-16 text-2xl font-bold text-navy", children: "Past events" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 space-y-4 opacity-80", children: past.map((ev) => /* @__PURE__ */ jsxRuntimeExports.jsx(EventCard, { event: ev, past: true }, ev.id)) })
      ] })
    ] })
  ] });
}
function EventCard({
  event,
  past
}) {
  const start = new Date(event.starts_at);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-xl border border-border bg-card p-6 flex flex-wrap gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `grid place-items-center w-20 h-20 rounded-xl text-white font-bold ${past ? "bg-muted text-muted-foreground" : "bg-navy"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase", children: start.toLocaleString("default", {
        month: "short"
      }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl", children: start.getDate() })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-[200px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-navy", children: event.title }),
      event.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-foreground/75", children: event.description }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3.5 text-medical" }),
          start.toLocaleString(void 0, {
            dateStyle: "medium",
            timeStyle: "short"
          }),
          event.ends_at && ` – ${new Date(event.ends_at).toLocaleTimeString()}`
        ] }),
        event.location && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "size-3.5 text-medical" }),
          event.location
        ] })
      ] })
    ] }),
    !past && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "self-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-8 text-medical/40" }) })
  ] });
}
export {
  Events as component
};
