import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/layout";
import { Pill, FlaskConical, Activity, Stethoscope, HeartPulse, Users, Clock, GraduationCap, ShieldCheck, ArrowRight, Search } from "lucide-react";

export const Route = createFileRoute("/programs")({
  head: () => ({
    meta: [
      { title: "Programs — AMTMTI" },
      { name: "description", content: "Accredited MTM programs for pharmacists, technologists, technicians, clinicians, physicians, and nurses." },
      { property: "og:title", content: "AMTMTI Programs" },
      { property: "og:description", content: "Six accredited MTM pathways across African healthcare professions." },
      { property: "og:url", content: "/programs" },
    ],
    links: [{ rel: "canonical", href: "/programs" }],
  }),
  component: Programs,
});

const programs = [
  {
    icon: Pill, t: "MTM for Pharmacists", level: "Postgraduate Diploma", duration: "12 months", mode: "Hybrid",
    cert: "AMTMTI Postgraduate Diploma in MTM",
    overview: "Advanced training for pharmacists leading clinical MTM services in hospitals, community pharmacies, and outpatient clinics.",
    outcomes: ["Conduct comprehensive medication reviews","Develop pharmaceutical care plans","Lead deprescribing initiatives","Counsel patients on complex regimens","Collaborate in multidisciplinary teams"],
    reqs: ["B.Pharm or equivalent","Active registration with national pharmacy council","Minimum 1 year clinical experience"],
    hue: "from-blue-700 to-cyan-500",
  },
  {
    icon: FlaskConical, t: "MTM for Pharmaceutical Technologists", level: "Diploma", duration: "9 months", mode: "Online + practicum",
    cert: "AMTMTI Diploma in MTM",
    overview: "Strengthen dispensing accuracy, screening, and therapy-review competencies in routine practice.",
    outcomes: ["Screen prescriptions for safety issues","Support medication adherence","Identify drug-related problems","Document interventions"],
    reqs: ["Diploma in Pharmaceutical Technology","Active practice license"],
    hue: "from-emerald-700 to-teal-500",
  },
  {
    icon: Activity, t: "MTM for Pharmaceutical Technicians", level: "Certificate", duration: "6 months", mode: "Online",
    cert: "AMTMTI Certificate in MTM",
    overview: "Core MTM skills for technicians in community and institutional pharmacy practice.",
    outcomes: ["Apply MTM principles in daily practice","Communicate with patients effectively","Support quality medication supply"],
    reqs: ["Certificate in Pharmaceutical Technology","Employer recommendation"],
    hue: "from-cyan-700 to-sky-500",
  },
  {
    icon: Stethoscope, t: "MTM for Clinicians", level: "Professional CPD", duration: "12 weeks", mode: "Online",
    cert: "AMTMTI CPD Certificate",
    overview: "Equip clinical officers and allied clinicians to integrate medication review into patient care.",
    outcomes: ["Recognize drug-related problems","Apply rational prescribing principles","Refer effectively to pharmacy"],
    reqs: ["Clinical Officer / equivalent qualification","Active practice"],
    hue: "from-indigo-700 to-blue-500",
  },
  {
    icon: HeartPulse, t: "MTM for Physicians", level: "Professional CPD", duration: "12 weeks", mode: "Hybrid",
    cert: "AMTMTI CPD Certificate",
    overview: "Optimize prescribing, deprescribing, and chronic disease medication strategies.",
    outcomes: ["Apply evidence-based prescribing","Manage polypharmacy","Lead deprescribing in chronic care"],
    reqs: ["MBChB or equivalent","Active medical council registration"],
    hue: "from-rose-700 to-orange-500",
  },
  {
    icon: Users, t: "MTM for Nurses", level: "Professional CPD", duration: "10 weeks", mode: "Online",
    cert: "AMTMTI CPD Certificate",
    overview: "Lead medication reconciliation, adherence counseling, and patient education at the bedside.",
    outcomes: ["Perform medication reconciliation","Educate patients on regimens","Identify and report adverse events"],
    reqs: ["Diploma/Degree in Nursing","Active nursing council registration"],
    hue: "from-teal-700 to-emerald-500",
  },
];

function Programs() {
  return (
    <PageShell>
      <section className="hero-mesh text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-25" aria-hidden/>
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-brand">Programs</span>
          <h1 className="mt-4 text-4xl lg:text-6xl font-bold leading-tight max-w-3xl">Accredited MTM pathways for every healthcare profession.</h1>
          <p className="mt-5 text-lg text-white/80 max-w-2xl">Choose certificate, diploma, postgraduate, or CPD tracks — built for working professionals across Africa.</p>

          <div className="mt-8 max-w-2xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/60"/>
            <input placeholder="Search programs by profession, level, or topic…" className="w-full rounded-full bg-white/10 backdrop-blur border border-white/20 py-3.5 pl-11 pr-4 text-sm placeholder:text-white/60 outline-none focus:ring-2 focus:ring-emerald-brand"/>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-navy">All programs <span className="text-muted-foreground font-medium">({programs.length})</span></h2>
          <div className="flex flex-wrap gap-2">
            {["All","Certificate","Diploma","Postgraduate","CPD"].map((f,i)=>(
              <button key={f} className={`rounded-full px-4 py-1.5 text-sm border transition ${i===0?"bg-navy text-white border-navy":"border-border text-foreground/75 hover:border-medical hover:text-medical"}`}>{f}</button>
            ))}
          </div>
        </div>

        <div className="mt-10 space-y-6">
          {programs.map(p=>(
            <article key={p.t} className="grid lg:grid-cols-12 gap-6 rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl hover:shadow-medical/5 transition">
              <div className={`relative lg:col-span-3 bg-gradient-to-br ${p.hue} p-8 text-white min-h-[180px]`}>
                <p.icon className="size-10"/>
                <div className="mt-auto pt-12">
                  <p className="text-xs font-bold uppercase tracking-wider opacity-80">{p.level}</p>
                  <p className="mt-1 text-lg font-bold leading-tight">{p.t}</p>
                </div>
              </div>
              <div className="lg:col-span-9 p-6 lg:p-8">
                <div className="flex flex-wrap gap-4 text-xs">
                  <span className="inline-flex items-center gap-1.5 text-foreground/70"><Clock className="size-3.5 text-medical"/> {p.duration}</span>
                  <span className="inline-flex items-center gap-1.5 text-foreground/70"><GraduationCap className="size-3.5 text-medical"/> {p.mode}</span>
                  <span className="inline-flex items-center gap-1.5 text-foreground/70"><ShieldCheck className="size-3.5 text-emerald-brand"/> {p.cert}</span>
                </div>
                <p className="mt-3 text-foreground/80 leading-relaxed">{p.overview}</p>
                <div className="mt-5 grid md:grid-cols-2 gap-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-medical">Learning outcomes</p>
                    <ul className="mt-2 space-y-1.5 text-sm text-foreground/75">
                      {p.outcomes.map(o=> <li key={o} className="flex gap-2"><span className="size-1 mt-2 rounded-full bg-emerald-brand"/>{o}</li>)}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-medical">Requirements</p>
                    <ul className="mt-2 space-y-1.5 text-sm text-foreground/75">
                      {p.reqs.map(o=> <li key={o} className="flex gap-2"><span className="size-1 mt-2 rounded-full bg-emerald-brand"/>{o}</li>)}
                    </ul>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/contact" className="inline-flex items-center gap-2 rounded-md bg-medical px-5 py-2.5 text-sm font-semibold text-white hover:bg-medical/90">Apply now <ArrowRight className="size-4"/></Link>
                  <Link to="/contact" className="inline-flex items-center gap-2 rounded-md border border-border px-5 py-2.5 text-sm font-semibold text-navy hover:border-medical hover:text-medical">Request syllabus</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
