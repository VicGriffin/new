import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { P as PageShell } from "./layout-5uvChYov.mjs";
import { supabase } from "./client-CZ7d5FUj.mjs";
import { R as Route$4 } from "./router-DMvx1MT2.mjs";
import "../_libs/sonner.mjs";
import { r as ArrowLeft, s as Sparkles, L as ListChecks } from "../_libs/lucide-react.mjs";
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
  const learningOutcomes = Array.isArray(program?.learning_outcomes) ? program.learning_outcomes.filter(Boolean) : [];
  const requirements = Array.isArray(program?.requirements) ? program.requirements.filter(Boolean) : [];
  let curriculumModules = [];
  if (Array.isArray(program?.curriculum)) {
    curriculumModules = program.curriculum.filter(Boolean);
  } else if (typeof program?.curriculum === "string") {
    try {
      curriculumModules = JSON.parse(program.curriculum);
    } catch {
      curriculumModules = [];
    }
  }
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PageShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-4xl px-5 py-20 text-center text-muted-foreground", children: "Loading program…" }) });
  }
  if (error || !program) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PageShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-4xl px-5 py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-navy", children: "Program not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-foreground/80", children: "The program you requested is unavailable or the slug is invalid." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/programs", className: "mt-4 inline-block text-medical hover:underline", children: "← Back to programs" })
    ] }) });
  }
  const category = program.program_categories;
  const heroImage = program.cover_url;
  const applyUrl = program.apply_link ?? "/auth";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PageShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative overflow-hidden", children: [
    heroImage ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-[360px] sm:h-[420px] w-full overflow-hidden rounded-b-[2rem] bg-slate-100", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: heroImage, alt: `${program.title} hero`, className: "h-full w-full object-cover" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[240px] w-full rounded-b-[2rem] bg-slate-100" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-6xl px-5 lg:px-8 py-10 lg:py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/programs", className: "inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-medical", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
        " All programs"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          category?.name && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700", children: category.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-3xl font-bold tracking-tight text-navy sm:text-4xl", children: program.title }),
          program.summary && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 max-w-3xl text-lg leading-8 text-slate-700", children: program.summary }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 grid gap-3 sm:grid-cols-3", children: [
            program.duration && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-white p-5 shadow-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-slate-500", children: "Duration" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-lg font-semibold text-navy", children: program.duration })
            ] }),
            program.mode && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-white p-5 shadow-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-slate-500", children: "Mode of study" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-lg font-semibold text-navy", children: program.mode })
            ] }),
            program.certification && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-white p-5 shadow-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold text-slate-500", children: "Certification" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-lg font-semibold text-navy", children: program.certification })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 space-y-12", children: [
            (program.summary || program.description) && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-3xl border border-border bg-white p-8 shadow-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-navy", children: "Program overview" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-foreground/80 leading-relaxed whitespace-pre-wrap", children: program.description ?? program.summary })
            ] }),
            learningOutcomes.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-3xl border border-border bg-white p-8 shadow-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-5 text-medical" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-navy", children: "Learning outcomes" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-6 grid gap-3 text-foreground/80", children: learningOutcomes.map((outcome, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "list-disc pl-5 leading-relaxed", children: outcome }, `${outcome}-${index}`)) })
            ] }),
            curriculumModules.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-3xl border border-border bg-white p-8 shadow-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ListChecks, { className: "size-5 text-medical" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-navy", children: "Curriculum modules" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 space-y-4", children: curriculumModules.map((module, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "group rounded-3xl border border-border bg-slate-50 p-5 transition hover:border-medical/30", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("summary", { className: "flex cursor-pointer items-center justify-between gap-4 text-lg font-semibold text-navy list-none", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: module.module_title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: "Tap to expand" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-4 text-foreground/80", children: [
                  module.module_description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: module.module_description }),
                  Array.isArray(module.topics) && module.topics.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "grid gap-2 pl-5 text-sm leading-6 list-disc", children: module.topics.map((topic, topicIndex) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: topic }, `${topic}-${topicIndex}`)) })
                ] })
              ] }, `${module.module_title}-${index}`)) })
            ] }),
            requirements.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-3xl border border-border bg-white p-8 shadow-sm", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-navy", children: "Requirements" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-6 grid gap-3 text-foreground/80 pl-5 list-disc", children: requirements.map((requirement, index) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: requirement }, `${requirement}-${index}`)) })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm font-semibold uppercase tracking-[0.2em] text-slate-500", children: "Apply for this program" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: applyUrl, className: "block rounded-2xl bg-medical px-5 py-4 text-center text-sm font-semibold text-white transition hover:bg-medical/90", children: "Apply now" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "block rounded-2xl border border-border px-5 py-4 text-center text-sm font-semibold text-navy transition hover:border-medical hover:text-medical", children: "Ask a question" })
            ] })
          ] }),
          (program.summary || program.description) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl border border-border bg-white p-6 shadow-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold uppercase tracking-[0.2em] text-slate-500", children: "Program snapshot" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3 text-sm text-foreground/80", children: [
              program.duration && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-900", children: "Duration:" }),
                " ",
                program.duration
              ] }),
              program.mode && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-900", children: "Mode:" }),
                " ",
                program.mode
              ] }),
              program.certification && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-900", children: "Certification:" }),
                " ",
                program.certification
              ] }),
              program.price_ksh != null && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-slate-900", children: "Price:" }),
                " KSH ",
                program.price_ksh.toLocaleString()
              ] })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] }) });
}
export {
  ProgramDetail as component
};
