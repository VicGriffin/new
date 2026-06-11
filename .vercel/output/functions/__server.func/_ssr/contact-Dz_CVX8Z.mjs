import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { P as PageShell } from "./layout-WOXRQ1YO.mjs";
import { i as imageUrl } from "./utils-BEYWXE59.mjs";
import { supabase } from "./client-CZ7d5FUj.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { g as Mail, P as Phone, e as MapPin, h as Send } from "../_libs/lucide-react.mjs";
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
import "./router-D6Y-D7l5.mjs";
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
function Contact() {
  const [sent, setSent] = reactExports.useState(false);
  const [form, setForm] = reactExports.useState({
    name: "",
    email: "",
    subject: "Admissions",
    organization: "",
    message: ""
  });
  const [sending, setSending] = reactExports.useState(false);
  async function onSubmit(e) {
    e.preventDefault();
    setSending(true);
    const {
      error
    } = await supabase.from("contacts").insert({
      name: form.name,
      email: form.email,
      subject: form.subject,
      organization: form.organization || null,
      message: form.message
    });
    setSending(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
    setForm({
      name: "",
      email: "",
      subject: "Admissions",
      organization: "",
      message: ""
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "hero-mesh text-white relative overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imageUrl("contact_hero.jfif"), alt: "Contact AMTMTI", className: "w-full h-full object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/15 to-navy/95", "aria-hidden": true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid-pattern opacity-25", "aria-hidden": true }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold uppercase tracking-[0.2em] text-emerald-brand", children: "Contact" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-4xl lg:text-6xl font-bold leading-tight max-w-3xl", children: "Let's build a healthier Africa together." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-lg text-white/80 max-w-2xl", children: "Admissions, partnerships, research collaboration, media — we'd love to hear from you." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-5 lg:px-8 py-20 grid lg:grid-cols-12 gap-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-5 space-y-5", children: [
        [{
          icon: Mail,
          l: "Opening Hours",
          lines: ["Open 24 hours", "Monday - Sunday"]
        }, {
          icon: Phone,
          l: "Call Us Anytime",
          lines: ["+254 721 421 719", "+254 721 421 719"]
        }, {
          icon: MapPin,
          l: "Our Location",
          lines: ["Thika Superhighway", "Kimbo Ruiru, Kenya."]
        }].map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 rounded-2xl bg-card border border-border p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-11 shrink-0 rounded-lg bg-medical/10 text-medical grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(c.icon, { className: "size-5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-semibold uppercase tracking-wider text-medical", children: c.l }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 font-semibold text-navy space-y-1", children: c.lines.map((line) => /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: line }, line)) })
          ] })
        ] }, c.l)),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl overflow-hidden border border-border bg-card aspect-[4/3]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("iframe", { title: "AMTMTI location", src: "https://www.openstreetmap.org/export/embed.html?bbox=36.7900%2C-1.2780%2C36.8200%2C-1.2600&layer=mapnik", className: "w-full h-full", loading: "lazy" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-7", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "rounded-2xl bg-card border border-border p-6 lg:p-8 space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Name", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, maxLength: 100, className: inp, value: form.name, onChange: (e) => setForm({
            ...form,
            name: e.target.value
          }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { required: true, type: "email", maxLength: 200, className: inp, value: form.email, onChange: (e) => setForm({
            ...form,
            email: e.target.value
          }) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Inquiry type", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { required: true, className: inp, value: form.subject, onChange: (e) => setForm({
            ...form,
            subject: e.target.value
          }), children: ["Admissions", "Partnership", "Research", "Media", "Other"].map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: o }, o)) }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Organization", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { maxLength: 150, className: inp, value: form.organization, onChange: (e) => setForm({
            ...form,
            organization: e.target.value
          }) }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Message", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { required: true, rows: 6, maxLength: 2e3, className: `${inp} resize-none`, value: form.message, onChange: (e) => setForm({
          ...form,
          message: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: sending, className: "inline-flex items-center gap-2 rounded-md bg-medical px-6 py-3.5 font-semibold text-white hover:bg-medical/90 disabled:opacity-60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "size-4" }),
          " ",
          sending ? "Sending…" : "Send message"
        ] }),
        sent && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-emerald-brand font-semibold", children: "Thanks — your message is on its way." })
      ] }) })
    ] })
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
  Contact as component
};
