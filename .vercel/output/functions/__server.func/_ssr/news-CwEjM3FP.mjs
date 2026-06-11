import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { P as PageShell } from "./layout-5uvChYov.mjs";
import { i as imageUrl } from "./utils-BEYWXE59.mjs";
import { supabase } from "./client-CZ7d5FUj.mjs";
import "../_libs/sonner.mjs";
import { N as Newspaper, A as ArrowRight } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "./router-DMvx1MT2.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function NewsList() {
  const {
    data: posts,
    isLoading,
    error
  } = useQuery({
    queryKey: ["news-public"],
    queryFn: async () => {
      const {
        data,
        error: error2
      } = await supabase.from("news").select("id,title,slug,excerpt,cover_url,published_at").eq("is_published", true).order("published_at", {
        ascending: false
      });
      if (error2) throw error2;
      return data ?? [];
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "hero-mesh text-white relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imageUrl("news_hero.png"), alt: "AMTMTI news and events", className: "w-full h-full object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/25 to-navy/95", "aria-hidden": true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid-pattern opacity-25", "aria-hidden": true }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24 grid lg:grid-cols-12 gap-10 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-7", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-[0.2em] text-emerald-brand", children: "News" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-4xl lg:text-6xl font-bold leading-tight max-w-3xl", children: "Updates from AMTMTI" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-lg text-white/80 max-w-2xl", children: "Program launches, research highlights, partnerships, and institute announcements." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden lg:block lg:col-span-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl overflow-hidden border border-white/10 shadow-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imageUrl("news_hero1.png"), alt: "Institutional event imagery", className: "w-full h-full min-h-[420px] object-cover" }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-24", children: [
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-muted-foreground py-12", children: "Loading news…" }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-destructive py-12", children: "Could not load news. Please try again later." }),
      !isLoading && !error && !posts?.length && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground", children: "No news posts yet. Check back soon." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-6", children: posts?.map((post) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg hover:border-medical/30 transition flex flex-col", children: [
        post.cover_url ? /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: post.cover_url, alt: "", className: "h-44 w-full object-cover" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-44 bg-gradient-to-br from-navy to-medical grid place-items-center text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Newspaper, { className: "size-10 opacity-80" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 flex flex-col flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("time", { className: "text-xs text-muted-foreground", children: post.published_at ? new Date(post.published_at).toLocaleDateString() : "Recently" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-lg font-bold text-navy leading-snug", children: post.title }),
          post.excerpt && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-foreground/70 flex-1", children: post.excerpt }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/news/$slug", params: {
            slug: post.slug
          }, className: "mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-medical hover:underline", children: [
            "Read more ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
          ] })
        ] })
      ] }, post.id)) })
    ] })
  ] });
}
export {
  NewsList as component
};
