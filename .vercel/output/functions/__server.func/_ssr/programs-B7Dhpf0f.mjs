import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { P as PageShell } from "./layout-WOXRQ1YO.mjs";
import { i as imageUrl } from "./utils-BEYWXE59.mjs";
import { supabase } from "./client-CZ7d5FUj.mjs";
import "../_libs/sonner.mjs";
import { S as Search, G as GraduationCap, C as Clock, a as ShieldCheck, A as ArrowRight } from "../_libs/lucide-react.mjs";
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
import "./router-D6Y-D7l5.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const LEVEL_FILTERS = ["All", "Certificate", "Diploma", "Postgraduate", "Professional CPD"];
function Programs() {
  const [search, setSearch] = reactExports.useState("");
  const [levelFilter, setLevelFilter] = reactExports.useState("All");
  const {
    data: programs,
    isLoading,
    error
  } = useQuery({
    queryKey: ["programs-public"],
    queryFn: async () => {
      const {
        data,
        error: error2
      } = await supabase.from("programs").select("id,title,slug,summary,description,duration,level,certification,price_ksh,program_categories(name)").eq("is_published", true).order("created_at");
      if (error2) throw error2;
      return data ?? [];
    }
  });
  const filtered = reactExports.useMemo(() => {
    const q = search.trim().toLowerCase();
    return (programs ?? []).filter((p) => {
      const matchLevel = levelFilter === "All" || (p.level?.toLowerCase().includes(levelFilter.toLowerCase()) ?? false);
      const matchSearch = !q || p.title.toLowerCase().includes(q) || (p.summary?.toLowerCase().includes(q) ?? false) || (p.description?.toLowerCase().includes(q) ?? false) || (p.program_categories?.name?.toLowerCase().includes(q) ?? false);
      return matchLevel && matchSearch;
    });
  }, [programs, search, levelFilter]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "hero-mesh text-white relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid-pattern opacity-25", "aria-hidden": true }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24 grid lg:grid-cols-12 gap-10 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-7", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-[0.2em] text-emerald-brand", children: "Programs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-4xl lg:text-6xl font-bold leading-tight max-w-3xl", children: "Accredited MTM pathways for every healthcare profession." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-lg text-white/80 max-w-2xl", children: "Choose certificate, diploma, postgraduate, or CPD tracks — built for working professionals across Africa." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 max-w-2xl relative", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/60" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Search programs by profession, level, or topic…", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full rounded-full bg-white/10 backdrop-blur border border-white/20 py-3.5 pl-11 pr-4 text-sm placeholder:text-white/60 outline-none focus:ring-2 focus:ring-emerald-brand" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden lg:block lg:col-span-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl overflow-hidden border border-white/10 shadow-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imageUrl("clinical_pharmacy.png"), alt: "Clinical pharmacy training", className: "w-full h-full min-h-[420px] object-cover" }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-2xl font-bold text-navy", children: [
          "All programs",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground font-medium", children: [
            "(",
            filtered.length,
            ")"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: LEVEL_FILTERS.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setLevelFilter(f), className: `rounded-full px-4 py-1.5 text-sm border transition ${levelFilter === f ? "bg-navy text-white border-navy" : "border-border text-foreground/75 hover:border-medical hover:text-medical"}`, children: f }, f)) })
      ] }),
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-10 text-center text-muted-foreground py-12", children: "Loading programs…" }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-10 text-center text-destructive py-12", children: "Could not load programs. Please try again later." }),
      !isLoading && !error && !filtered.length && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-10 rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground", children: "No programs match your search. Try a different filter or keyword." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 space-y-6", children: filtered.map((p) => {
        const category = p.program_categories;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "grid lg:grid-cols-12 gap-6 rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl hover:shadow-medical/5 transition", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative lg:col-span-3 bg-gradient-to-br from-medical to-emerald-brand p-8 text-white min-h-[180px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-10" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-auto pt-12", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-bold uppercase tracking-wider opacity-80", children: p.level ?? "Program" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-lg font-bold leading-tight", children: p.title }),
              category?.name && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs opacity-75", children: category.name })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-9 p-6 lg:p-8", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4 text-xs", children: [
              p.duration && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-foreground/70", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3.5 text-medical" }),
                " ",
                p.duration
              ] }),
              p.level && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-foreground/70", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-3.5 text-medical" }),
                " ",
                p.level
              ] }),
              p.certification && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-foreground/70", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-3.5 text-emerald-brand" }),
                " ",
                p.certification
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-foreground/80 leading-relaxed", children: p.summary ?? p.description }),
            p.price_ksh != null && p.price_ksh > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-sm font-semibold text-navy", children: [
              "KSH ",
              p.price_ksh.toLocaleString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/programs/$slug", params: {
                slug: p.slug
              }, className: "inline-flex items-center gap-2 rounded-md bg-medical px-5 py-2.5 text-sm font-semibold text-white hover:bg-medical/90", children: [
                "View details ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/auth", className: "inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-navy hover:border-medical hover:text-medical", children: "Enroll via portal" })
            ] })
          ] })
        ] }, p.id);
      }) })
    ] })
  ] });
}
export {
  Programs as component
};
