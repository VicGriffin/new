import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { supabase } from "./client-CLv5cT1Y.mjs";
import { P as PageShell } from "./layout-CnrgjGUY.mjs";
import "../_libs/sonner.mjs";
import { m as Sparkles, A as ArrowRight, a as ShieldCheck, n as Earth, G as GraduationCap, o as HeartPulse, k as Award, B as BookOpen, M as Microscope, p as Pill, q as FlaskConical, r as Activity, b as Stethoscope, U as Users, Q as Quote, s as Star } from "../_libs/lucide-react.mjs";
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
import "./router-BrXL5jN2.mjs";
const stats = [{
  v: "12K+",
  l: "Healthcare professionals trained"
}, {
  v: "26",
  l: "African countries served"
}, {
  v: "120+",
  l: "Accredited courses & modules"
}, {
  v: "45",
  l: "Research publications"
}];
const whyUs = [{
  icon: Award,
  t: "Expert Trainers",
  d: "Faculty drawn from leading universities, ministries of health, and clinical practice across Africa."
}, {
  icon: BookOpen,
  t: "Industry-Relevant Curriculum",
  d: "Built with regulators, payers, and hospital networks to match real-world MTM workflows."
}, {
  icon: Earth,
  t: "Flexible Learning",
  d: "Online, hybrid, and in-person cohorts designed around busy clinical schedules."
}, {
  icon: Microscope,
  t: "Research Driven",
  d: "Every course is informed by our active research division and African evidence base."
}, {
  icon: ShieldCheck,
  t: "Professional Certification",
  d: "Credentials recognized by professional councils, employers, and partner institutions."
}, {
  icon: HeartPulse,
  t: "Africa-Focused Solutions",
  d: "Contextualized for African health systems, disease burden, and supply chains."
}];
const programs = [{
  icon: Pill,
  t: "MTM for Pharmacists",
  d: "Advance clinical decision-making, pharmaceutical care plans, and patient counselling.",
  tag: "Flagship"
}, {
  icon: FlaskConical,
  t: "MTM for Pharmaceutical Technologists",
  d: "Strengthen dispensing, screening, and therapy review competencies.",
  tag: "Diploma"
}, {
  icon: Activity,
  t: "MTM for Pharmaceutical Technicians",
  d: "Build core MTM skills for community and institutional practice.",
  tag: "Certificate"
}, {
  icon: Stethoscope,
  t: "MTM for Clinicians",
  d: "Integrate medication review into multidisciplinary clinical care.",
  tag: "CPD"
}, {
  icon: HeartPulse,
  t: "MTM for Physicians",
  d: "Optimize prescribing, deprescribing, and chronic disease management.",
  tag: "CPD"
}, {
  icon: Users,
  t: "MTM for Nurses",
  d: "Lead medication reconciliation, adherence support, and patient education.",
  tag: "CPD"
}];
const research = [{
  area: "Medication Safety",
  color: "from-blue-700 to-blue-500"
}, {
  area: "Clinical Pharmacy",
  color: "from-emerald-700 to-emerald-500"
}, {
  area: "Pharmaceutical Care",
  color: "from-cyan-700 to-sky-500"
}, {
  area: "Public Health",
  color: "from-teal-700 to-emerald-500"
}, {
  area: "Medication Adherence",
  color: "from-indigo-700 to-blue-500"
}];
const fallbackTestimonials = [{
  q: "AMTMTI's clinical pharmacy program reshaped how our hospital approaches medication reviews. Patient outcomes have measurably improved.",
  n: "Dr. Amina Otieno",
  r: "Chief Pharmacist, Nairobi Referral Hospital"
}, {
  q: "The blended learning model let me earn my MTM diploma without leaving my district pharmacy. The faculty truly understand African practice.",
  n: "Joseph Mwangi",
  r: "Pharmaceutical Technologist, Kisumu"
}, {
  q: "Partnering with AMTMTI's research division gave our adherence trial the methodological rigor and regional reach we needed.",
  n: "Prof. Chinwe Adeyemi",
  r: "University College Hospital, Ibadan"
}];
const fallbackPartners = ["Ministry of Health", "WHO Africa", "KMTC", "UCT Pharmacy", "FIP", "PSK", "PCN", "Africa CDC"];
function Home() {
  const {
    data: dbTestimonials
  } = useQuery({
    queryKey: ["home-testimonials"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("testimonials").select("quote, author_name, author_role").eq("is_published", true).order("sort_order");
      return data ?? [];
    }
  });
  const {
    data: dbPartners
  } = useQuery({
    queryKey: ["home-partners"],
    queryFn: async () => {
      const {
        data
      } = await supabase.from("partners").select("name, website").eq("is_published", true).order("sort_order");
      return data ?? [];
    }
  });
  const testimonials = dbTestimonials?.length ? dbTestimonials.map((t) => ({
    q: t.quote,
    n: t.author_name,
    r: t.author_role ?? ""
  })) : fallbackTestimonials;
  const partners = dbPartners?.length ? dbPartners : fallbackPartners.map((name) => ({
    name
  }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "relative hero-mesh text-white overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid-pattern opacity-30", "aria-hidden": true }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-7xl px-5 lg:px-8 pt-20 pb-28 lg:pt-28 lg:pb-36 grid lg:grid-cols-12 gap-10 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-7", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs font-medium", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "size-3.5 text-emerald-brand" }),
            " Now enrolling — 2026 Cohort"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight", children: [
            "Scaling Medication Therapy Management Training in",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-brand", children: "Africa" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-lg text-white/80 max-w-2xl leading-relaxed", children: "World-class education, professional development, certification, research, and innovation in medication therapy management — built by African experts, for African healthcare systems." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-9 flex flex-wrap gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/programs", className: "inline-flex items-center gap-2 rounded-md bg-emerald-brand px-6 py-3.5 font-semibold text-navy hover:opacity-90 transition shadow-lg shadow-emerald-brand/20", children: [
              "Explore Programs ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/programs", className: "inline-flex items-center gap-2 rounded-md bg-white px-6 py-3.5 font-semibold text-navy hover:bg-white/90 transition", children: "Apply Now" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/membership", className: "inline-flex items-center gap-2 rounded-md glass px-6 py-3.5 font-semibold text-white hover:bg-white/15 transition", children: "Become a Partner" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-white/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4 text-emerald-brand" }),
              " Accredited curriculum"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Earth, { className: "size-4 text-emerald-brand" }),
              " Pan-African faculty"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-4 text-emerald-brand" }),
              " Recognized credentials"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "glass rounded-2xl p-6 shadow-2xl", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-11 rounded-xl bg-emerald-brand/20 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeartPulse, { className: "size-5 text-emerald-brand" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: "Featured Program" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/60", children: "Postgraduate Diploma · Hybrid" })
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 text-xl font-bold", children: "Advanced Medication Therapy Management for Pharmacists" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-white/70 leading-relaxed", children: "12-month accredited program with clinical placements, evidence-based protocols, and a capstone research project." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-5 grid grid-cols-3 gap-3 text-center", children: [["12", "Months"], ["48", "Modules"], ["10", "Credits"]].map(([n, l]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-white/5 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg font-bold text-emerald-brand", children: n }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[10px] uppercase tracking-wider text-white/60", children: l })
            ] }, l)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/programs", className: "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-brand px-4 py-2.5 text-sm font-semibold text-navy", children: [
              "View Program ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-6 -left-6 glass rounded-xl px-4 py-3 hidden md:block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex -space-x-2", children: ["bg-emerald-brand", "bg-medical", "bg-amber-400"].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-7 rounded-full ${c} border-2 border-navy` }, c)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold", children: "1,200+ enrolled" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-white/60", children: "this cohort" })
            ] })
          ] }) })
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative border-t border-white/10 bg-black/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-5 lg:px-8 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-3xl font-bold text-emerald-brand", children: s.v }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-white/70 mt-1", children: s.l })
      ] }, s.l)) }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-28", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-12 gap-12 items-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-[0.18em] text-medical", children: "The Institute" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-3xl lg:text-4xl font-bold text-navy leading-tight", children: "A world-class home for medication therapy management in Africa" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-7", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg text-foreground/75 leading-relaxed", children: "AMTMTI delivers world-class education and skills enhancement training in medication therapy management — including professional development courses, certificates, diplomas, and postgraduate diplomas — designed for pharmacists, clinicians, and the wider African healthcare workforce." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/about", className: "inline-flex items-center gap-2 text-medical font-semibold hover:underline", children: [
            "About the Institute ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/research", className: "inline-flex items-center gap-2 text-medical font-semibold hover:underline", children: [
            "Visit Research Division ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
          ] })
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-soft border-y border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-[0.18em] text-medical", children: "Why AMTMTI" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-3xl lg:text-4xl font-bold text-navy", children: "Built for the realities of African healthcare" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: whyUs.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "group rounded-2xl bg-card p-6 border border-border hover:border-medical/40 hover:shadow-xl hover:shadow-medical/5 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-xl bg-medical/10 grid place-items-center text-medical group-hover:bg-medical group-hover:text-white transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(f.icon, { className: "size-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 text-lg font-bold text-navy", children: f.t }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-foreground/70 leading-relaxed", children: f.d })
      ] }, f.t)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-28", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-end justify-between gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-[0.18em] text-medical", children: "Programs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-3xl lg:text-4xl font-bold text-navy", children: "Six pathways. One mission: safer medication use across Africa." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/programs", className: "inline-flex items-center gap-1.5 text-medical font-semibold hover:underline", children: [
          "All programs ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: programs.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/programs", className: "group relative overflow-hidden rounded-2xl border border-border bg-card p-6 hover:-translate-y-1 hover:shadow-2xl hover:shadow-medical/10 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -right-8 -top-8 size-32 rounded-full bg-gradient-to-br from-medical/10 to-emerald-brand/10 blur-2xl group-hover:scale-150 transition", "aria-hidden": true }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-11 rounded-lg bg-navy text-white grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(p.icon, { className: "size-5" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-brand/15 text-emerald-brand px-2.5 py-1", children: p.tag })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-5 text-lg font-bold text-navy group-hover:text-medical transition", children: p.t }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-foreground/70 leading-relaxed", children: p.d }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-medical", children: [
            "View program ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-3.5" })
          ] })
        ] })
      ] }, p.t)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "bg-navy text-white relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 hero-mesh opacity-70", "aria-hidden": true }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-28", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-12 gap-10 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-[0.18em] text-emerald-brand", children: "Research Division" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-3xl lg:text-4xl font-bold leading-tight", children: "Generating the African evidence base for medication therapy management" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-white/75 leading-relaxed", children: "AMTMTI Research advances pharmaceutical care through rigorous clinical, implementation, and health systems research — and translates findings into curriculum, policy, and practice." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/research", className: "mt-7 inline-flex items-center gap-2 rounded-md bg-emerald-brand px-6 py-3 font-semibold text-navy hover:opacity-90 transition", children: [
            "Explore Research ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-6 grid sm:grid-cols-2 gap-3", children: research.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `relative aspect-[16/10] rounded-xl bg-gradient-to-br ${r.color} p-5 flex flex-col justify-end overflow-hidden`, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-3 right-3 size-8 rounded-full bg-white/15 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Microscope, { className: "size-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold", children: r.area })
        ] }, r.area)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-28", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl bg-gradient-to-br from-soft via-background to-soft border border-border p-8 lg:p-14 relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-20 -right-20 size-72 rounded-full bg-emerald-brand/10 blur-3xl", "aria-hidden": true }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative grid lg:grid-cols-12 gap-10 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-7", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-[0.18em] text-medical", children: "Affiliate Membership" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-3xl lg:text-4xl font-bold text-navy", children: "Join the AMTMTI community" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-foreground/75 leading-relaxed max-w-xl", children: "Connect with peers, access research, earn discounts on training, and shape the future of medication therapy management in Africa." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex flex-wrap gap-2", children: ["Students", "Healthcare Professionals", "Institutions", "Corporate Partners"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full bg-card border border-border px-3.5 py-1.5 text-xs font-medium text-navy", children: t }, t)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/membership", className: "mt-7 inline-flex items-center gap-2 rounded-md bg-medical px-6 py-3 font-semibold text-white hover:bg-medical/90", children: [
            "Apply for Membership ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl bg-navy text-white p-6 shadow-2xl", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs uppercase tracking-wider text-emerald-brand font-bold", children: "Member Benefits" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 space-y-3 text-sm", children: ["Networking with regional MTM leaders", "Access to research & publications", "Professional recognition & badges", "Discounts on AMTMTI training", "Industry updates & policy briefs"].map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "size-1.5 mt-2 rounded-full bg-emerald-brand" }),
            b
          ] }, b)) })
        ] }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-soft border-y border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-[0.18em] text-medical", children: "Voices" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-3 text-3xl lg:text-4xl font-bold text-navy", children: "Trusted by clinicians and institutions across the continent" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 grid lg:grid-cols-3 gap-5", children: testimonials.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("figure", { className: "rounded-2xl bg-card border border-border p-6 flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Quote, { className: "size-7 text-emerald-brand" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("blockquote", { className: "mt-4 text-foreground/85 leading-relaxed flex-1", children: [
          '"',
          t.q,
          '"'
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("figcaption", { className: "mt-6 pt-5 border-t border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-navy text-sm", children: t.n }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground", children: t.r }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 flex gap-0.5", children: [...Array(5)].map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "size-3.5 fill-emerald-brand text-emerald-brand" }, i)) })
        ] })
      ] }, t.n)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-5 lg:px-8 py-16", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-center text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground", children: "Partners & collaborators" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 flex flex-wrap justify-center gap-x-10 gap-y-4", children: partners.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-display text-lg font-bold text-navy/40 hover:text-navy transition", children: typeof p === "string" ? p : p.name }, typeof p === "string" ? p : p.name)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-5 lg:px-8 pb-24", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-3xl hero-mesh text-white p-10 lg:p-16 text-center relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid-pattern opacity-20", "aria-hidden": true }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-3xl mx-auto", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl lg:text-5xl font-bold leading-tight", children: "Train. Certify. Transform care." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-white/80 text-lg", children: "Join thousands of African healthcare professionals advancing medication therapy management." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-8 flex flex-wrap justify-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/programs", className: "inline-flex items-center gap-2 rounded-md bg-emerald-brand px-6 py-3.5 font-semibold text-navy hover:opacity-90", children: [
            "Apply Now ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "inline-flex items-center gap-2 rounded-md glass px-6 py-3.5 font-semibold text-white hover:bg-white/15", children: "Talk to Admissions" })
        ] })
      ] })
    ] }) })
  ] });
}
export {
  Home as component
};
