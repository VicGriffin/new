import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/site/layout";
import {
  ArrowRight,
  Award,
  Microscope,
  GraduationCap,
  Globe2,
  Users,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Stethoscope,
  FlaskConical,
  HeartPulse,
  Pill,
  Activity,
  Quote,
  Star,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AMTMTI — Africa Medication Therapy Management Training Institute" },
      {
        name: "description",
        content:
          "World-class education, professional development, certification, and research in medication therapy management across Africa.",
      },
      { property: "og:title", content: "AMTMTI — Scaling MTM Training in Africa" },
      {
        property: "og:description",
        content:
          "Accredited programs, research, and affiliate membership for African healthcare professionals.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          name: "Africa Medication Therapy Management Training Institute",
          alternateName: "AMTMTI",
          description:
            "Training, certification, and research in medication therapy management across Africa.",
        }),
      },
    ],
  }),
  component: Home,
});

const stats = [
  { v: "12K+", l: "Healthcare professionals trained" },
  { v: "26", l: "African countries served" },
  { v: "120+", l: "Accredited courses & modules" },
  { v: "45", l: "Research publications" },
];

const whyUs = [
  {
    icon: Award,
    t: "Expert Trainers",
    d: "Faculty drawn from leading universities, ministries of health, and clinical practice across Africa.",
  },
  {
    icon: BookOpen,
    t: "Industry-Relevant Curriculum",
    d: "Built with regulators, payers, and hospital networks to match real-world MTM workflows.",
  },
  {
    icon: Globe2,
    t: "Flexible Learning",
    d: "Online, hybrid, and in-person cohorts designed around busy clinical schedules.",
  },
  {
    icon: Microscope,
    t: "Research Driven",
    d: "Every course is informed by our active research division and African evidence base.",
  },
  {
    icon: ShieldCheck,
    t: "Professional Certification",
    d: "Credentials recognized by professional councils, employers, and partner institutions.",
  },
  {
    icon: HeartPulse,
    t: "Africa-Focused Solutions",
    d: "Contextualized for African health systems, disease burden, and supply chains.",
  },
];

const programs = [
  {
    icon: Pill,
    t: "MTM for Pharmacists",
    d: "Advance clinical decision-making, pharmaceutical care plans, and patient counselling.",
    tag: "Flagship",
    img: "MTM_for_Pharmacists.png",
  },
  {
    icon: FlaskConical,
    t: "MTM for Pharmaceutical Technologists",
    d: "Strengthen dispensing, screening, and therapy review competencies.",
    tag: "Diploma",
    img: "MTM_for_Pharmaceutical Technologists.png",
  },
  {
    icon: Activity,
    t: "MTM for Pharmaceutical Technicians",
    d: "Build core MTM skills for community and institutional practice.",
    tag: "Certificate",
    img: "MTM_for_Pharmaceutical Technicians.jpg",
  },
  {
    icon: Stethoscope,
    t: "MTM for Clinicians",
    d: "Integrate medication review into multidisciplinary clinical care.",
    tag: "CPD",
    img: "MTM_for_Clinicians.png",
  },
  {
    icon: HeartPulse,
    t: "MTM for Physicians",
    d: "Optimize prescribing, deprescribing, and chronic disease management.",
    tag: "CPD",
    img: "MTM_for_Physicians.png",
  },
  {
    icon: Users,
    t: "MTM for Nurses",
    d: "Lead medication reconciliation, adherence support, and patient education.",
    tag: "CPD",
    img: "MTM_for_Nurses.png",
  },
];

// helper to safely reference files in public/images
const imageUrl = (name: string) => `/images/${encodeURIComponent(name)}`;


const research = [
  {
    area: "Medication Safety",
    color: "from-blue-700 to-blue-500",
    img: "medication_safety.png",
  },
  { area: "Clinical Pharmacy", color: "from-emerald-700 to-emerald-500", img: "clinical_pharmacy.png" },
  { area: "Pharmaceutical Care", color: "from-cyan-700 to-sky-500", img: "Pharmaceutical_care.png" },
  { area: "Public Health", color: "from-teal-700 to-emerald-500", img: "Public_health.png" },
  { area: "Medication Adherence", color: "from-indigo-700 to-blue-500", img: "medical_adherence.png" },
];

const fallbackTestimonials = [
  {
    q: "AMTMTI's clinical pharmacy program reshaped how our hospital approaches medication reviews. Patient outcomes have measurably improved.",
    n: "Dr. Amina Otieno",
    r: "Chief Pharmacist, Nairobi Referral Hospital",
  },
  {
    q: "The blended learning model let me earn my MTM diploma without leaving my district pharmacy. The faculty truly understand African practice.",
    n: "Joseph Mwangi",
    r: "Pharmaceutical Technologist, Kisumu",
  },
  {
    q: "Partnering with AMTMTI's research division gave our adherence trial the methodological rigor and regional reach we needed.",
    n: "Prof. Chinwe Adeyemi",
    r: "University College Hospital, Ibadan",
  },
];

const fallbackPartners = [
  "Ministry of Health",
  "WHO Africa",
  "KMTC",
  "UCT Pharmacy",
  "FIP",
  "PSK",
  "PCN",
  "Africa CDC",
];

function Home() {
  const { data: dbTestimonials } = useQuery({
    queryKey: ["home-testimonials"],
    queryFn: async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("quote, author_name, author_role")
        .eq("is_published", true)
        .order("sort_order");
      return data ?? [];
    },
  });
  const { data: dbPartners } = useQuery({
    queryKey: ["home-partners"],
    queryFn: async () => {
      const { data } = await supabase
        .from("partners")
        .select("name, website")
        .eq("is_published", true)
        .order("sort_order");
      return data ?? [];
    },
  });

  const testimonials = dbTestimonials?.length
    ? dbTestimonials.map((t) => ({ q: t.quote, n: t.author_name, r: t.author_role ?? "" }))
    : fallbackTestimonials;
  const partners = dbPartners?.length ? dbPartners : fallbackPartners.map((name) => ({ name }));

  return (
    <PageShell>
      {/* HERO */}
      <section className="relative hero-mesh text-white overflow-hidden">
        {/* background image */}
        <div className="absolute inset-0 -z-10">
          <img
            src={imageUrl("hero-medical-professionals.png")}
            alt="Healthcare professionals"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/50" aria-hidden />
        </div>
        <div className="absolute inset-0 grid-pattern opacity-30" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 pt-24 pb-28 lg:pt-28 lg:pb-36">
          <div className="pointer-events-none absolute right-0 bottom-0 hidden lg:block opacity-40">
            <img
              src={imageUrl("membership_hero.png")}
              alt="Membership highlight"
              className="h-[420px] w-[420px] object-cover rounded-[2rem] border border-white/10 shadow-2xl"
            />
          </div>
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.04] tracking-tight">
                Africa's leading Medication Therapy Management institute for healthcare professionals.
              </h1>
              <p className="mt-6 text-lg text-white/80 max-w-2xl leading-relaxed">
                Practical, accredited MTM education designed for pharmacists, clinicians, and allied
                health teams across the continent.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  to="/programs"
                  className="inline-flex items-center gap-2 rounded-md bg-emerald-brand px-6 py-3.5 font-semibold text-navy hover:opacity-90 transition shadow-lg shadow-emerald-brand/20"
                >
                  Explore Programs <ArrowRight className="size-4" />
                </Link>
                <Link
                  to="/membership"
                  className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3.5 font-semibold text-navy hover:bg-white/90 transition"
                >
                  Join Membership
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-6 py-3.5 font-semibold text-white hover:bg-white/15 transition"
                >
                  Talk to Admissions
                </Link>
              </div>
              <div className="mt-10 grid gap-3 sm:grid-cols-3 text-xs text-white/70">
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-2xl font-bold text-emerald-brand">12K+</p>
                  <p className="mt-1 uppercase tracking-[0.2em]">Professionals trained</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-2xl font-bold text-emerald-brand">26</p>
                  <p className="mt-1 uppercase tracking-[0.2em]">Countries served</p>
                </div>
                <div className="rounded-3xl bg-white/10 p-4">
                  <p className="text-2xl font-bold text-emerald-brand">45+</p>
                  <p className="mt-1 uppercase tracking-[0.2em]">Research publications</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-3xl bg-emerald-brand/20 grid place-items-center">
                    <HeartPulse className="size-5 text-emerald-brand" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-emerald-brand">
                      Featured Program
                    </p>
                    <p className="text-xs text-white/60">Postgraduate Diploma · Hybrid</p>
                  </div>
                </div>
                <h3 className="mt-6 text-2xl font-bold">Advanced MTM for Pharmacists</h3>
                <p className="mt-4 text-sm text-white/70 leading-relaxed">
                  A career-defining, evidence-based program with placements, hands-on skills,
                  and professional certification for pharmacists across Africa.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-3 text-center text-sm">
                  {[
                    ["12", "Months"],
                    ["48", "Modules"],
                    ["10", "Credits"],
                  ].map(([n, l]) => (
                    <div key={l} className="rounded-3xl bg-white/10 p-4">
                      <div className="text-xl font-bold text-emerald-brand">{n}</div>
                      <div className="mt-1 uppercase tracking-[0.18em] text-white/60">{l}</div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/programs"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-emerald-brand px-5 py-3 text-sm font-semibold text-navy"
                >
                  View Program <ArrowRight className="size-4" />
                </Link>
                <div className="mt-5 flex items-center gap-3 rounded-3xl bg-black/20 p-4 text-sm">
                  <div className="flex -space-x-2">
                    {[
                      "bg-emerald-brand",
                      "bg-medical",
                      "bg-amber-400",
                    ].map((c) => (
                      <div key={c} className={`size-8 rounded-full ${c} border-2 border-navy`} />
                    ))}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">1,200+ enrolled</p>
                    <p className="text-xs text-white/60">across current cohort</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="relative mt-12 border-t border-white/10 bg-black/20">
            <div className="mx-auto max-w-7xl px-5 lg:px-8 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((s) => (
                <div key={s.l}>
                  <div className="text-3xl font-bold text-emerald-brand">{s.v}</div>
                  <div className="text-xs text-white/70 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-medical">
              The Institute
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-navy leading-tight">
              A world-class home for medication therapy management in Africa
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="text-lg text-foreground/75 leading-relaxed">
              AMTMTI delivers world-class education and skills enhancement training in medication
              therapy management — including professional development courses, certificates,
              diplomas, and postgraduate diplomas — designed for pharmacists, clinicians, and the
              wider African healthcare workforce.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-medical font-semibold hover:underline"
              >
                About the Institute <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/research"
                className="inline-flex items-center gap-2 text-medical font-semibold hover:underline"
              >
                Visit Research Division <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="bg-soft border-y border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-medical">
              Why AMTMTI
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-navy">
              Built for the realities of African healthcare
            </h2>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyUs.map((f) => (
              <div
                key={f.t}
                className="group rounded-2xl bg-card p-6 border border-border hover:border-medical/40 hover:shadow-xl hover:shadow-medical/5 transition"
              >
                <div className="size-12 rounded-xl bg-medical/10 grid place-items-center text-medical group-hover:bg-medical group-hover:text-white transition">
                  <f.icon className="size-5" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-navy">{f.t}</h3>
                <p className="mt-2 text-sm text-foreground/70 leading-relaxed">{f.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-medical">
              Programs
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-navy">
              Six pathways. One mission: safer medication use across Africa.
            </h2>
          </div>
          <Link
            to="/programs"
            className="inline-flex items-center gap-1.5 text-medical font-semibold hover:underline"
          >
            All programs <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {programs.map((p) => (
            <Link
              to="/programs"
              key={p.t}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 hover:-translate-y-1 hover:shadow-2xl hover:shadow-medical/10 transition"
            >
              <div
                className="absolute -right-8 -top-8 size-32 rounded-full bg-gradient-to-br from-medical/10 to-emerald-brand/10 blur-2xl group-hover:scale-150 transition"
                aria-hidden
              />
              <div className="relative">
                {/* thumbnail */}
                {p.img ? (
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={imageUrl(p.img)}
                      alt={p.t}
                      className="w-full h-40 object-cover object-center transition-transform group-hover:scale-105 rounded-lg"
                    />
                  </div>
                ) : null}
                <div className="flex items-center justify-between mt-4">
                  <div className="size-11 rounded-lg bg-navy text-white grid place-items-center">
                    <p.icon className="size-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-brand/15 text-emerald-brand px-2.5 py-1">
                    {p.tag}
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-bold text-navy group-hover:text-medical transition">
                  {p.t}
                </h3>
                <p className="mt-2 text-sm text-foreground/70 leading-relaxed">{p.d}</p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-medical">
                  View program <ArrowRight className="size-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Research highlight */}
      <section className="bg-navy text-white relative overflow-hidden">
        <div className="absolute inset-0 hero-mesh opacity-70" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-28">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-brand">
                Research Division
              </span>
              <h2 className="mt-3 text-3xl lg:text-4xl font-bold leading-tight">
                Generating the African evidence base for medication therapy management
              </h2>
              <p className="mt-5 text-white/75 leading-relaxed">
                AMTMTI Research advances pharmaceutical care through rigorous clinical,
                implementation, and health systems research — and translates findings into
                curriculum, policy, and practice.
              </p>
              <Link
                to="/research"
                className="mt-7 inline-flex items-center gap-2 rounded-md bg-emerald-brand px-6 py-3 font-semibold text-navy hover:opacity-90 transition"
              >
                Explore Research <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="lg:col-span-6 grid sm:grid-cols-2 gap-3">
              {research.map((r) => (
                <div key={r.area} className="relative aspect-[16/10] rounded-xl overflow-hidden">
                  {r.img ? (
                    <img
                      src={imageUrl(r.img)}
                      alt={r.area}
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${r.color}`} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                  <div className="relative p-5 flex flex-col justify-end h-full">
                    <div className="absolute top-3 right-3 size-8 rounded-full bg-white/15 grid place-items-center">
                      <Microscope className="size-4" />
                    </div>
                    <p className="font-bold text-white drop-shadow">{r.area}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* News & Events - imagery focused */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-medical">News & Events</span>
            <h2 className="mt-2 text-2xl lg:text-3xl font-bold text-navy">Latest institutional updates</h2>
          </div>
          <Link to="/news" className="text-medical font-semibold hover:underline inline-flex items-center gap-2">
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { title: "8 Reasons Your Baby Might Be Coughing", img: "8 Reasons Your Baby Might Be Coughing.jfif" },
            { title: "Institutional briefing", img: "news_hero.png" },
            { title: "Upcoming symposium", img: "news_hero1.png" },
          ].map((n) => (
            <Link key={n.title} to="/news" className="group rounded-2xl overflow-hidden border border-border bg-card">
              <div className="w-full h-44 overflow-hidden">
                <img src={imageUrl(n.img)} alt={n.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-navy">{n.title}</h3>
                <p className="text-xs text-foreground/70 mt-2">Institutional news & events from AMTMTI</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Membership */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-28">
        <div className="rounded-3xl bg-gradient-to-br from-soft via-background to-soft border border-border p-8 lg:p-14 relative overflow-hidden">
          <div
            className="absolute -top-20 -right-20 size-72 rounded-full bg-emerald-brand/10 blur-3xl"
            aria-hidden
          />
          <div className="relative grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-medical">
                Affiliate Membership
              </span>
              <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-navy">
                Join the AMTMTI community
              </h2>
              <p className="mt-4 text-foreground/75 leading-relaxed max-w-xl">
                Connect with peers, access research, earn discounts on training, and shape the
                future of medication therapy management in Africa.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Students", "Healthcare Professionals", "Institutions", "Corporate Partners"].map(
                  (t) => (
                    <span
                      key={t}
                      className="rounded-full bg-card border border-border px-3.5 py-1.5 text-xs font-medium text-navy"
                    >
                      {t}
                    </span>
                  ),
                )}
              </div>
              <Link
                to="/membership"
                className="mt-7 inline-flex items-center gap-2 rounded-md bg-medical px-6 py-3 font-semibold text-white hover:bg-medical/90"
              >
                Apply for Membership <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="lg:col-span-5">
              <div className="overflow-hidden rounded-2xl mb-6">
                <img
                  src={imageUrl("membership_hero.png")}
                  alt="Membership"
                  className="w-full h-56 object-cover object-center rounded-2xl shadow-md"
                />
              </div>
              <div className="rounded-2xl bg-navy text-white p-6 shadow-2xl">
                <p className="text-xs uppercase tracking-wider text-emerald-brand font-bold">
                  Member Benefits
                </p>
                <ul className="mt-4 space-y-3 text-sm">
                  {[
                    "Networking with regional MTM leaders",
                    "Access to research & publications",
                    "Professional recognition & badges",
                    "Discounts on AMTMTI training",
                    "Industry updates & policy briefs",
                  ].map((b) => (
                    <li key={b} className="flex gap-2.5">
                      <span className="size-1.5 mt-2 rounded-full bg-emerald-brand" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-soft border-y border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-medical">
              Voices
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-navy">
              Trusted by clinicians and institutions across the continent
            </h2>
          </div>
          <div className="mt-12 grid lg:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <figure
                key={t.n}
                className="rounded-2xl bg-card border border-border p-6 flex flex-col"
              >
                <Quote className="size-7 text-emerald-brand" />
                <blockquote className="mt-4 text-foreground/85 leading-relaxed flex-1">
                  "{t.q}"
                </blockquote>
                <figcaption className="mt-6 pt-5 border-t border-border">
                  <div className="font-bold text-navy text-sm">{t.n}</div>
                  <div className="text-xs text-muted-foreground">{t.r}</div>
                  <div className="mt-1.5 flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="size-3.5 fill-emerald-brand text-emerald-brand" />
                    ))}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16">
        <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Partners & collaborators
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-x-10 gap-y-4">
          {partners.map((p) => (
            <span
              key={typeof p === "string" ? p : p.name}
              className="font-display text-lg font-bold text-navy/40 hover:text-navy transition"
            >
              {typeof p === "string" ? p : p.name}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 pb-24">
        <div className="rounded-3xl hero-mesh text-white p-10 lg:p-16 text-center relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-20" aria-hidden />
          <div className="relative max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-5xl font-bold leading-tight">
              Train. Certify. Transform care.
            </h2>
            <p className="mt-5 text-white/80 text-lg">
              Join thousands of African healthcare professionals advancing medication therapy
              management.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/programs"
                className="inline-flex items-center gap-2 rounded-md bg-emerald-brand px-6 py-3.5 font-semibold text-navy hover:opacity-90"
              >
                Apply Now <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-md glass px-6 py-3.5 font-semibold text-white hover:bg-white/15"
              >
                Talk to Admissions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
