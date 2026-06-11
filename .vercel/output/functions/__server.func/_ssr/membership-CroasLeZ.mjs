import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as PageShell } from "./layout-5uvChYov.mjs";
import { i as imageUrl } from "./utils-BEYWXE59.mjs";
import { supabase } from "./client-CZ7d5FUj.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { G as GraduationCap, b as Stethoscope, c as Building2, d as Check, A as ArrowRight } from "../_libs/lucide-react.mjs";
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
import "./router-DMvx1MT2.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const tiers = [{
  icon: GraduationCap,
  t: "Student",
  price: "Free",
  desc: "Open to pharmacy and health science students.",
  features: ["Community access", "Webinar discounts", "Career resources"]
}, {
  icon: Stethoscope,
  t: "Affiliate",
  price: "KSH 10,400 / yr",
  desc: "Healthcare professionals, pharmacists, clinicians.",
  features: ["Full community access", "CPD discounts", "Research library", "Member badge"],
  featured: true
}, {
  icon: Building2,
  t: "Corporate",
  price: "KSH 156,000 / yr",
  desc: "Hospitals, schools, regulators, NGOs.",
  features: ["Up to 25 seats", "Institutional dashboard", "Co-branded training", "Annual report"]
}];
function Membership() {
  const [tier, setTier] = reactExports.useState("Affiliate");
  const [f, setF] = reactExports.useState({
    full_name: "",
    email: "",
    country: "",
    profession: "",
    message: ""
  });
  const [sending, setSending] = reactExports.useState(false);
  async function submit(e) {
    e.preventDefault();
    setSending(true);
    const {
      error
    } = await supabase.from("membership_applications").insert({
      ...f,
      tier
    });
    setSending(false);
    if (error) return toast.error(error.message);
    toast.success("Application received — we'll be in touch within 3 business days.");
    setF({
      full_name: "",
      email: "",
      country: "",
      profession: "",
      message: ""
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "hero-mesh text-white relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imageUrl("membership_hero.png"), alt: "AMTMTI membership community", className: "w-full h-full object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/20 to-navy/95", "aria-hidden": true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid-pattern opacity-25", "aria-hidden": true }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24 grid lg:grid-cols-12 gap-10 items-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-7", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-[0.2em] text-emerald-brand", children: "Affiliate Membership" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-4xl lg:text-6xl font-bold leading-tight max-w-3xl", children: "Join Africa's leading MTM community." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-lg text-white/80 max-w-2xl", children: "Networking, recognition, research access, and training discounts — for individuals and institutions advancing pharmaceutical care." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden lg:block lg:col-span-5", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-3xl overflow-hidden border border-white/10 shadow-2xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imageUrl("hero-medical-professionals.png"), alt: "Membership community", className: "w-full h-full min-h-[420px] object-cover" }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "mx-auto max-w-7xl px-5 lg:px-8 py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-5", children: tiers.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-2xl border p-6 flex flex-col ${t.featured ? "bg-navy text-white border-emerald-brand shadow-2xl shadow-medical/20 lg:-translate-y-3" : "bg-card border-border"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-11 rounded-lg grid place-items-center ${t.featured ? "bg-emerald-brand/20 text-emerald-brand" : "bg-medical/10 text-medical"}`, children: /* @__PURE__ */ jsxRuntimeExports.jsx(t.icon, { className: "size-5" }) }),
      t.featured && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-3 text-[10px] font-bold uppercase tracking-wider text-emerald-brand", children: "Most popular" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: `mt-3 text-xl font-bold ${t.featured ? "text-white" : "text-navy"}`, children: t.t }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: `mt-1 text-sm ${t.featured ? "text-white/70" : "text-foreground/70"}`, children: t.desc }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `mt-4 text-2xl font-bold ${t.featured ? "text-emerald-brand" : "text-navy"}`, children: t.price }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: `mt-5 space-y-2 text-sm flex-1 ${t.featured ? "text-white/85" : "text-foreground/80"}`, children: t.features.map((f2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "size-4 text-emerald-brand shrink-0 mt-0.5" }),
        f2
      ] }, f2)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setTier(t.t), className: `mt-6 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition ${t.featured ? "bg-emerald-brand text-navy hover:opacity-90" : "bg-medical text-white hover:bg-medical/90"}`, children: [
        "Choose ",
        t.t.split(" ")[0],
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
      ] })
    ] }, t.t)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-soft border-y border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-5 lg:px-8 py-20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl lg:text-4xl font-bold text-navy text-center", children: "Membership application" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-foreground/70 text-center", children: "We'll review and respond within 3 business days." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "mt-10 rounded-2xl bg-card border border-border p-6 lg:p-8 space-y-5", onSubmit: submit, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Full name", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, maxLength: 100, className: inp, value: f.full_name, onChange: (e) => setF({
            ...f,
            full_name: e.target.value
          }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, type: "email", maxLength: 200, className: inp, value: f.email, onChange: (e) => setF({
            ...f,
            email: e.target.value
          }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Country", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, maxLength: 80, className: inp, value: f.country, onChange: (e) => setF({
            ...f,
            country: e.target.value
          }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Profession", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, maxLength: 120, className: inp, placeholder: "e.g. Pharmacist, Nurse", value: f.profession, onChange: (e) => setF({
            ...f,
            profession: e.target.value
          }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Membership tier", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: tier, onChange: (e) => setTier(e.target.value), className: inp, children: tiers.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: t.t }, t.t)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Why are you joining?", children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { rows: 4, maxLength: 1e3, className: `${inp} resize-none`, value: f.message, onChange: (e) => setF({
          ...f,
          message: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: sending, className: "w-full rounded-md bg-medical px-6 py-3.5 font-semibold text-white hover:bg-medical/90 transition disabled:opacity-60", children: sending ? "Submitting…" : "Submit application" })
      ] })
    ] }) })
  ] });
}
const inp = "w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-medical";
function Field({
  label,
  required,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-semibold uppercase tracking-wider text-navy", children: [
      label,
      required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-medical", children: " *" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5", children })
  ] });
}
export {
  Membership as component
};
