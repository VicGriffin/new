import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/layout";
import { GraduationCap, Stethoscope, Building2, Briefcase, Check, ArrowRight } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";


export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title: "Affiliate Membership — AMTMTI" },
      { name: "description", content: "Join AMTMTI as a student, professional, institution, or corporate partner. Networking, research access, training discounts, and recognition." },
      { property: "og:title", content: "AMTMTI Affiliate Membership" },
      { property: "og:description", content: "Become part of Africa's leading MTM community." },
      { property: "og:url", content: "/membership" },
    ],
    links: [{ rel: "canonical", href: "/membership" }],
  }),
  component: Membership,
});

const tiers = [
  { icon: GraduationCap, t: "Students", price: "Free", desc: "Open to pharmacy and health science students.", features: ["Community access","Webinar discounts","Career resources"] },
  { icon: Stethoscope, t: "Healthcare Professionals", price: "$80 / yr", desc: "Pharmacists, clinicians, physicians, nurses.", features: ["Full community access","CPD discounts","Research library","Member badge"], featured: true },
  { icon: Building2, t: "Institutions", price: "$1,200 / yr", desc: "Hospitals, schools, regulators.", features: ["Up to 25 seats","Institutional dashboard","Co-branded training","Annual report"] },
  { icon: Briefcase, t: "Corporate Partners", price: "Custom", desc: "Industry, NGOs, donors.", features: ["Sponsorship visibility","Joint research opportunities","Custom training tracks"] },
];

function Membership() {
  const [tier, setTier] = useState("Healthcare Professionals");
  const [f, setF] = useState({ full_name:"", email:"", country:"", profession:"", message:"" });
  const [sending, setSending] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    const { error } = await supabase.from("membership_applications").insert({ ...f, tier });
    setSending(false);
    if (error) return toast.error(error.message);
    toast.success("Application received — we'll be in touch within 3 business days.");
    setF({ full_name:"", email:"", country:"", profession:"", message:"" });
  }
  return (
    <PageShell>
      <section className="hero-mesh text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-25" aria-hidden/>
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-brand">Affiliate Membership</span>
          <h1 className="mt-4 text-4xl lg:text-6xl font-bold leading-tight max-w-3xl">Join Africa's leading MTM community.</h1>
          <p className="mt-5 text-lg text-white/80 max-w-2xl">Networking, recognition, research access, and training discounts — for individuals and institutions advancing pharmaceutical care.</p>
        </div>
      </section>

      {/* Tiers */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {tiers.map(t=>(
            <div key={t.t} className={`rounded-2xl border p-6 flex flex-col ${t.featured ? "bg-navy text-white border-emerald-brand shadow-2xl shadow-medical/20 lg:-translate-y-3" : "bg-card border-border"}`}>
              <div className={`size-11 rounded-lg grid place-items-center ${t.featured ? "bg-emerald-brand/20 text-emerald-brand" : "bg-medical/10 text-medical"}`}>
                <t.icon className="size-5"/>
              </div>
              {t.featured && <span className="mt-3 text-[10px] font-bold uppercase tracking-wider text-emerald-brand">Most popular</span>}
              <h3 className={`mt-3 text-xl font-bold ${t.featured?"text-white":"text-navy"}`}>{t.t}</h3>
              <p className={`mt-1 text-sm ${t.featured?"text-white/70":"text-foreground/70"}`}>{t.desc}</p>
              <div className={`mt-4 text-2xl font-bold ${t.featured?"text-emerald-brand":"text-navy"}`}>{t.price}</div>
              <ul className={`mt-5 space-y-2 text-sm flex-1 ${t.featured?"text-white/85":"text-foreground/80"}`}>
                {t.features.map(f=>(
                  <li key={f} className="flex gap-2"><Check className="size-4 text-emerald-brand shrink-0 mt-0.5"/>{f}</li>
                ))}
              </ul>
              <button onClick={()=>setTier(t.t)} className={`mt-6 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition ${t.featured?"bg-emerald-brand text-navy hover:opacity-90":"bg-medical text-white hover:bg-medical/90"}`}>
                Choose {t.t.split(" ")[0]} <ArrowRight className="size-4"/>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Application form */}
      <section className="bg-soft border-y border-border">
        <div className="mx-auto max-w-3xl px-5 lg:px-8 py-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-navy text-center">Membership application</h2>
          <p className="mt-3 text-foreground/70 text-center">We'll review and respond within 3 business days.</p>
          <form className="mt-10 rounded-2xl bg-card border border-border p-6 lg:p-8 space-y-5" onSubmit={submit}>
            <div className="grid md:grid-cols-2 gap-5">
              <Field label="Full name" required><input required maxLength={100} className={inp} value={f.full_name} onChange={e=>setF({...f,full_name:e.target.value})}/></Field>
              <Field label="Email" required><input required type="email" maxLength={200} className={inp} value={f.email} onChange={e=>setF({...f,email:e.target.value})}/></Field>
              <Field label="Country" required><input required maxLength={80} className={inp} value={f.country} onChange={e=>setF({...f,country:e.target.value})}/></Field>
              <Field label="Profession" required><input required maxLength={120} className={inp} placeholder="e.g. Pharmacist, Nurse" value={f.profession} onChange={e=>setF({...f,profession:e.target.value})}/></Field>
            </div>
            <Field label="Membership tier" required>
              <select value={tier} onChange={e=>setTier(e.target.value)} className={inp}>
                {tiers.map(t=> <option key={t.t}>{t.t}</option>)}
              </select>
            </Field>
            <Field label="Why are you joining?"><textarea rows={4} maxLength={1000} className={`${inp} resize-none`} value={f.message} onChange={e=>setF({...f,message:e.target.value})}/></Field>
            <button disabled={sending} className="w-full rounded-md bg-medical px-6 py-3.5 font-semibold text-white hover:bg-medical/90 transition disabled:opacity-60">{sending?"Submitting…":"Submit application"}</button>
          </form>
        </div>
      </section>
    </PageShell>
  );
}

const inp = "w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-medical";
function Field({label, required, children}:{label:string; required?:boolean; children:React.ReactNode}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-navy">{label}{required && <span className="text-medical"> *</span>}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
