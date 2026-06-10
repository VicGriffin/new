import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { P as PageShell } from "./layout-CnrgjGUY.mjs";
import { supabase } from "./client-CLv5cT1Y.mjs";
import { R as Route$4 } from "./router-BrXL5jN2.mjs";
import "../_libs/sonner.mjs";
import { t as ArrowLeft, C as Clock, G as GraduationCap, a as ShieldCheck, A as ArrowRight } from "../_libs/lucide-react.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function ProgramDetail() {
  const {
    slug
  } = Route$4.useParams();
  const {
    data: program,
    isLoading,
    error
  } = useQuery({
    queryKey: ["program", slug],
    queryFn: async () => {
      const {
        data,
        error: error2
      } = await supabase.from("programs").select("*,program_categories(name)").eq("slug", slug).eq("is_published", true).maybeSingle();
      if (error2) throw error2;
      return data;
    }
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PageShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-4xl px-5 py-20 text-center text-muted-foreground", children: "Loading program…" }) });
  }
  if (error || !program) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PageShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl px-5 py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-navy", children: "Program not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/programs", className: "mt-4 inline-block text-medical hover:underline", children: "← All programs" })
    ] }) });
  }
  const category = program.program_categories;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "hero-mesh text-white relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid-pattern opacity-25", "aria-hidden": true }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-4xl px-5 lg:px-8 py-16 lg:py-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/programs", className: "inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
          " All programs"
        ] }),
        category?.name && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-6 block text-xs font-bold uppercase tracking-[0.2em] text-emerald-brand", children: category.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 text-3xl lg:text-5xl font-bold leading-tight", children: program.title }),
        program.summary && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-lg text-white/80 max-w-2xl", children: program.summary }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap gap-4 text-sm text-white/75", children: [
          program.duration && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-4 text-emerald-brand" }),
            " ",
            program.duration
          ] }),
          program.level && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-4 text-emerald-brand" }),
            " ",
            program.level
          ] }),
          program.certification && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4 text-emerald-brand" }),
            " ",
            program.certification
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-4xl px-5 lg:px-8 py-16", children: [
      program.description && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prose prose-neutral max-w-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-navy", children: "About this program" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-foreground/80 leading-relaxed whitespace-pre-wrap", children: program.description })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-wrap gap-4 items-center", children: [
        program.price_usd != null && program.price_usd > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-2xl font-bold text-navy", children: [
          "$",
          program.price_usd,
          " USD"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/auth", className: "inline-flex items-center gap-2 rounded-md bg-medical px-6 py-3 font-semibold text-white hover:bg-medical/90", children: [
          "Enroll via portal ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 font-semibold text-navy hover:border-medical hover:text-medical", children: "Request syllabus" })
      ] })
    ] })
  ] });
}
export {
  ProgramDetail as component
};
