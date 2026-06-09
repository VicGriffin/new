import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/layout";
import { Target, Eye, HeartHandshake, Award, ArrowRight, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — AMTMTI" },
      { name: "description", content: "Mission, vision, leadership, and strategic objectives of the Africa Medication Therapy Management Training Institute." },
      { property: "og:title", content: "About AMTMTI" },
      { property: "og:description", content: "Who we are and why we exist." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const values = [
  { icon: Award, t: "Excellence", d: "Uncompromising standards in education, research, and practice." },
  { icon: HeartHandshake, t: "Integrity", d: "Ethical, evidence-based, patient-centered care." },
  { icon: Target, t: "Impact", d: "Measurable improvements in medication use across Africa." },
  { icon: Eye, t: "Equity", d: "Access to quality MTM training regardless of geography." },
];

const objectives = [
  "Train 50,000 African healthcare professionals in MTM by 2030",
  "Accredit 30+ partner institutions across the continent",
  "Publish African-led research influencing WHO and national policy",
  "Embed MTM into primary care and chronic disease programs",
  "Build a continent-wide affiliate membership network",
];

const timeline = [
  { y: "2019", t: "Founded", d: "Establishment of AMTMTI by African pharmacy leaders." },
  { y: "2021", t: "First cohort", d: "Launch of the postgraduate MTM diploma." },
  { y: "2023", t: "Research division", d: "AMTMTI Research established with regional partners." },
  { y: "2025", t: "Pan-African", d: "Programs delivered in 26 countries through blended learning." },
  { y: "2026", t: "Today", d: "12,000+ alumni, 120+ courses, growing affiliate network." },
];

const leaders = [
  { n: "Prof. Wanjiru Kamau", r: "Executive Director", b: "Clinical pharmacist, formerly WHO AFRO advisor." },
  { n: "Dr. Samuel Okoro", r: "Dean of Studies", b: "30 years in pharmacy education and curriculum design." },
  { n: "Dr. Fatima El-Hassan", r: "Director of Research", b: "Leads multi-country medication safety trials." },
  { n: "Dr. Brian Mutiso", r: "Director of Membership", b: "Builds AMTMTI's pan-African professional network." },
];

function About() {
  return (
    <PageShell>
      <section className="hero-mesh text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-25" aria-hidden/>
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-28">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-brand">About AMTMTI</span>
          <h1 className="mt-4 text-4xl lg:text-6xl font-bold leading-tight max-w-3xl">An African institute, building African solutions for safer medication use.</h1>
          <p className="mt-6 text-lg text-white/80 max-w-2xl leading-relaxed">
            AMTMTI was founded to close the medication therapy management gap in African health systems — through accredited training, research, and a thriving community of practice.
          </p>
        </div>
      </section>

      {/* Mission/Vision */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 grid lg:grid-cols-2 gap-6">
        {[
          { icon: Target, t: "Our Mission", d: "To advance the practice of medication therapy management in Africa through world-class education, professional development, certification, research, and innovation." },
          { icon: Eye, t: "Our Vision", d: "A continent where every patient receives safe, effective, and appropriate medication therapy — delivered by trained, certified, and continuously learning professionals." },
        ].map(b=>(
          <div key={b.t} className="rounded-2xl bg-card border border-border p-8 lg:p-10">
            <div className="size-12 rounded-xl bg-medical/10 text-medical grid place-items-center"><b.icon className="size-5"/></div>
            <h2 className="mt-5 text-2xl font-bold text-navy">{b.t}</h2>
            <p className="mt-3 text-foreground/75 leading-relaxed">{b.d}</p>
          </div>
        ))}
      </section>

      {/* Values */}
      <section className="bg-soft border-y border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-navy">Our core values</h2>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(v=>(
              <div key={v.t} className="rounded-2xl bg-card border border-border p-6">
                <div className="size-11 rounded-lg bg-emerald-brand/15 text-emerald-brand grid place-items-center"><v.icon className="size-5"/></div>
                <h3 className="mt-4 font-bold text-navy">{v.t}</h3>
                <p className="mt-1.5 text-sm text-foreground/70">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why we exist + objectives */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 grid lg:grid-cols-2 gap-12">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-medical">Why AMTMTI exists</span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-navy">Closing a critical gap in African healthcare</h2>
          <p className="mt-5 text-foreground/75 leading-relaxed">
            Africa carries a growing burden of chronic disease, polypharmacy, and antimicrobial resistance. Yet structured medication therapy management training has historically been scarce. AMTMTI was created by African pharmacy and clinical leaders to change that — with curricula, research, and certification grounded in our health systems.
          </p>
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-medical">Strategic objectives</span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-navy">Our 2030 roadmap</h2>
          <ul className="mt-6 space-y-3">
            {objectives.map(o=>(
              <li key={o} className="flex gap-3 text-foreground/85"><CheckCircle2 className="size-5 text-emerald-brand shrink-0 mt-0.5"/>{o}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Leadership */}
      <section className="bg-soft border-y border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-navy">Leadership</h2>
          <p className="mt-3 text-foreground/70 max-w-2xl">A pan-African team of clinicians, academics, and operators.</p>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {leaders.map(l=>(
              <div key={l.n} className="rounded-2xl bg-card border border-border p-6 text-center">
                <div className="mx-auto size-20 rounded-full bg-gradient-to-br from-medical to-emerald-brand"/>
                <h3 className="mt-4 font-bold text-navy">{l.n}</h3>
                <p className="text-xs font-semibold uppercase tracking-wider text-medical">{l.r}</p>
                <p className="mt-2 text-sm text-foreground/70">{l.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20">
        <h2 className="text-3xl lg:text-4xl font-bold text-navy">Our journey</h2>
        <div className="mt-12 relative">
          <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px bg-border" aria-hidden/>
          <div className="space-y-10">
            {timeline.map((t,i)=>(
              <div key={t.y} className={`relative lg:grid lg:grid-cols-2 lg:gap-12 ${i%2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <div className={`lg:text-${i%2?"left":"right"} pl-12 lg:pl-0 lg:pr-12`}>
                  <div className="text-3xl font-bold text-medical">{t.y}</div>
                  <h3 className="mt-1 font-bold text-navy text-lg">{t.t}</h3>
                  <p className="mt-1 text-sm text-foreground/70">{t.d}</p>
                </div>
                <div className="hidden lg:block"/>
                <div className="absolute left-4 lg:left-1/2 top-2 -translate-x-1/2 size-3 rounded-full bg-emerald-brand ring-4 ring-background"/>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-16 text-center">
          <Link to="/programs" className="inline-flex items-center gap-2 rounded-md bg-medical px-6 py-3.5 font-semibold text-white">Explore programs <ArrowRight className="size-4"/></Link>
        </div>
      </section>
    </PageShell>
  );
}
