import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { P as PageShell } from "./layout-WOXRQ1YO.mjs";
import { i as imageUrl } from "./utils-BEYWXE59.mjs";
import { supabase } from "./client-CZ7d5FUj.mjs";
import "../_libs/sonner.mjs";
import { A as ArrowRight, M as Microscope, E as ExternalLink, F as FileText, U as Users, B as BookOpen } from "../_libs/lucide-react.mjs";
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
const areas = [{
  t: "Medication Safety",
  d: "Adverse drug events, pharmacovigilance, and safety culture in African hospitals."
}, {
  t: "Clinical Pharmacy",
  d: "Service delivery models, clinical pharmacy outcomes, and workforce development."
}, {
  t: "Pharmaceutical Care",
  d: "Patient-centered care plans, MTM service evaluation, and quality indicators."
}, {
  t: "Public Health",
  d: "Antimicrobial stewardship, vaccination uptake, and health systems strengthening."
}, {
  t: "Medication Adherence",
  d: "Behavioral, digital, and community interventions to improve adherence."
}];
function Research() {
  const {
    data: articles,
    isLoading
  } = useQuery({
    queryKey: ["research-public"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("research_articles").select("*").eq("is_published", true).order("published_date", {
        ascending: false
      });
      if (error) throw error;
      return data ?? [];
    }
  });
  const areasWithCount = areas.map((a) => ({
    ...a,
    count: articles?.filter((art) => art.area === a.t).length ?? 0
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "hero-mesh text-white relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imageUrl("medical_adherence.png"), alt: "Medication adherence research", className: "w-full h-full object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/20 to-navy/95", "aria-hidden": true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid-pattern opacity-25", "aria-hidden": true }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-12 gap-10 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-7", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-[0.2em] text-emerald-brand", children: "Research Division" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-4xl lg:text-6xl font-bold leading-tight", children: "African evidence. Global standards. Better medication therapy." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-lg text-white/80 max-w-2xl", children: "AMTMTI Research advances pharmaceutical care through rigorous clinical, implementation, and health systems research — and translates findings into curriculum, policy, and practice." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: "#publications", className: "inline-flex items-center gap-2 rounded-md bg-emerald-brand px-6 py-3 font-semibold text-navy", children: [
              "View publications ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "inline-flex items-center gap-2 rounded-md glass px-6 py-3 font-semibold text-white", children: "Propose a collaboration" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-5 space-y-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl overflow-hidden border border-white/10 shadow-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imageUrl("Pharmaceutical_care.png"), alt: "Pharmaceutical care research", className: "w-full h-full min-h-[420px] object-cover" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-3", children: [[articles?.length ?? 0, "Publications"], ["18", "Active studies"], ["12", "Country partners"], ["7", "Funded grants"]].map(([n, l]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-emerald-brand", children: n }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-white/70 mt-1", children: l })
          ] }, l)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-5 lg:px-8 py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-[0.18em] text-medical", children: "Research areas" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-3xl lg:text-4xl font-bold text-navy", children: "Where we focus" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: areasWithCount.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border p-6 hover:border-medical/40 hover:shadow-lg transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-11 rounded-lg bg-medical/10 text-medical grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Microscope, { className: "size-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 font-bold text-navy text-lg", children: a.t }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-foreground/70", children: a.d }),
        a.count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-xs font-semibold text-medical", children: [
          a.count,
          " publication(s)"
        ] })
      ] }, a.t)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { id: "publications", className: "bg-soft border-y border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-5 lg:px-8 py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-end justify-between gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-[0.18em] text-medical", children: "Publications" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-3xl lg:text-4xl font-bold text-navy", children: "Recent peer-reviewed work" })
      ] }) }),
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-10 text-center text-muted-foreground", children: "Loading publications…" }),
      !isLoading && !articles?.length && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-10 rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground", children: "Publications will appear here once published by our research team." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-10 space-y-3", children: articles?.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "flex gap-5 rounded-xl bg-card border border-border p-5 hover:border-medical/40 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:grid place-items-center w-16 h-16 rounded-lg bg-navy text-white font-bold text-sm", children: p.published_date ? new Date(p.published_date).getFullYear() : "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-navy leading-snug", children: p.title }),
          p.area && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-medical font-semibold", children: p.area }),
          p.abstract && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground line-clamp-2", children: p.abstract }),
          p.authors && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-xs text-muted-foreground", children: p.authors })
        ] }),
        p.url ? /* @__PURE__ */ jsxRuntimeExports.jsxs("a", { href: p.url, target: "_blank", rel: "noopener noreferrer", className: "hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-medical hover:underline self-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-4" }),
          " View"
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "hidden md:inline-flex items-center gap-1.5 text-sm text-muted-foreground self-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "size-4" }),
          " Abstract"
        ] })
      ] }, p.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-5 lg:px-8 py-20 grid lg:grid-cols-2 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-card border border-border p-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-xl bg-emerald-brand/15 text-emerald-brand grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "size-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 text-2xl font-bold text-navy", children: "Research partnerships" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-foreground/75", children: "We collaborate with universities, ministries, and global health agencies across Africa to design, fund, and deliver impactful research." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 flex flex-wrap gap-2", children: ["UCT", "Makerere", "UI Ibadan", "KEMRI", "WHO AFRO", "Africa CDC"].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-soft border border-border px-3 py-1 text-xs font-semibold text-navy", children: p }, p)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-navy text-white p-8 relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 hero-mesh opacity-70", "aria-hidden": true }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-xl bg-emerald-brand/20 text-emerald-brand grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 text-2xl font-bold", children: "Call for collaboration" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-white/75", children: "Are you a researcher, health system, or funder working on medication safety, adherence, or pharmaceutical care? Let's build the next study together." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/contact", className: "mt-6 inline-flex items-center gap-2 rounded-md bg-emerald-brand px-5 py-2.5 text-sm font-semibold text-navy", children: [
            "Get in touch ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
          ] })
        ] })
      ] })
    ] })
  ] });
}
export {
  Research as component
};
