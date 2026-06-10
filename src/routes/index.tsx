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
    img: "/images/MTM_for_Pharmacists.png",
  },
  {
    icon: FlaskConical,
    t: "MTM for Pharmaceutical Technologists",
    d: "Strengthen dispensing, screening, and therapy review competencies.",
    tag: "Diploma",
    img: "/images/MTM_for_Pharmaceutical Technologists.png",
  },
  {
    icon: Activity,
    t: "MTM for Pharmaceutical Technicians",
    d: "Build core MTM skills for community and institutional practice.",
    tag: "Certificate",
    img: "/images/MTM_for_Pharmaceutical Technicians.jpg",
  },
  {
    icon: Stethoscope,
    t: "MTM for Clinicians",
    d: "Integrate medication review into multidisciplinary clinical care.",
    tag: "CPD",
    img: "/images/MTM_for_Clinicians.png",
  },
  {
    icon: HeartPulse,
    t: "MTM for Physicians",
    d: "Optimize prescribing, deprescribing, and chronic disease management.",
    tag: "CPD",
    img: "/images/MTM_for_Physicians.png",
  },
  {
    icon: Users,
    t: "MTM for Nurses",
    d: "Lead medication reconciliation, adherence support, and patient education.",
    tag: "CPD",
    img: "/images/MTM_for_Nurses.png",
  },
];

const research = [
  { area: "Medication Safety", img: "/images/medication_safety.png" },
  { area: "Clinical Pharmacy", img: "/images/clinical_pharmacy.png" },
  { area: "Pharmaceutical Care", img: "/images/Pharmaceutical_care.png" },
  { area: "Public Health", img: "/images/Public_health.png" },
  { area: "Medication Adherence", img: "/images/medical_adherence.png" },
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
        <div className="absolute inset-0 grid-pattern opacity-30" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 pt-20 pb-28 lg:pt-28 lg:pb-36 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            {/* <span className="inline-flex items-center gap-2 rounded-full glass px-3.5 py-1.5 text-xs font-medium">
              <Sparkles className="size-3.5 text-emerald-brand" /> Now enrolling — 2026 Cohort
            </span> */}
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight">
              AFRICA MTM <span className="text-emerald-brand" > TRAINING </span> INSTITUTE{" "} <br />
              <span className="text-emerald-brand">Africa</span>
            </h1>
            <p className="mt-6 text-lg text-white/80 max-w-2xl leading-relaxed">
              World-class education, professional development, certification, research, and
              innovation in medication therapy management — built by African experts, for African
              healthcare systems.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/programs"
                className="inline-flex items-center gap-2 rounded-md bg-emerald-brand px-6 py-3.5 font-semibold text-navy hover:opacity-90 transition shadow-lg shadow-emerald-brand/20"
              >
                Explore Programs <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/programs"
                className="inline-flex items-center gap-2 rounded-md bg-white px-6 py-3.5 font-semibold text-navy hover:bg-white/90 transition"
              >
                Apply Now
              </Link>
              <Link
                to="/membership"
                className="inline-flex items-center gap-2 rounded-md glass px-6 py-3.5 font-semibold text-white hover:bg-white/15 transition"
              >
                Become a Partner
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-xs text-white/60">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-brand" /> Accredited curriculum
              </span>
              <span className="inline-flex items-center gap-2">
                <Globe2 className="size-4 text-emerald-brand" /> Pan-African faculty
              </span>
              <span className="inline-flex items-center gap-2">
                <GraduationCap className="size-4 text-emerald-brand" /> Recognized credentials
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative">
              <div className="relative overflow-hidden rounded-3xl mb-6">
                <img
                  src="/images/hero-medical-professionals.png"
                  alt="Healthcare professionals collaborating on patient care"
                  className="w-full h-72 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/40 to-transparent" />
              </div>
              <div className="glass rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="size-11 rounded-xl bg-emerald-brand/20 grid place-items-center">
                    <HeartPulse className="size-5 text-emerald-brand" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Featured Program</p>
                    <p className="text-xs text-white/60">Postgraduate Diploma · Hybrid</p>
                  </div>
                </div>
                <h3 className="mt-4 text-xl font-bold">
                  Advanced Medication Therapy Management for Pharmacists
                </h3>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">
                  12-month accredited program with clinical placements, evidence-based protocols,
                  and a capstone research project.
                </p>
                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                  {[
                    ["12", "Months"],
                    ["48", "Modules"],
                    ["10", "Credits"],
                  ].map(([n, l]) => (
                    <div key={l} className="rounded-lg bg-white/5 py-3">
                      <div className="text-lg font-bold text-emerald-brand">{n}</div>
                      <div className="text-[10px] uppercase tracking-wider text-white/60">{l}</div>
                    </div>
                  ))}
                </div>
                <Link
                  to="/programs"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-emerald-brand px-4 py-2.5 text-sm font-semibold text-navy"
                >
                  View Program <ArrowRight className="size-4" />
                </Link>
              </div>
              <div className="absolute -bottom-6 -left-6 glass rounded-xl px-4 py-3 hidden md:block">
                <div className="flex items-center gap-2.5">
                  <div className="flex -space-x-2">
                    {["bg-emerald-brand", "bg-medical", "bg-amber-400"].map((c) => (
                      <div key={c} className={`size-7 rounded-full ${c} border-2 border-navy`} />
                    ))}
                  </div>
                  <div className="text-xs">
                    <div className="font-semibold">1,200+ enrolled</div>
                    <div className="text-white/60">this cohort</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="relative border-t border-white/10 bg-black/20">
          <div className="mx-auto max-w-7xl px-5 lg:px-8 py-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.l}>
                <div className="text-3xl font-bold text-emerald-brand">{s.v}</div>
                <div className="text-xs text-white/70 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Overview */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
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
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="lg:col-span-5">
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-medical">
                The Institute
              </span>
              <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-navy leading-tight">
                A world-class home for medication therapy management in Africa
              </h2>
            </div>
            <div className="mt-8 rounded-2xl overflow-hidden shadow-xl">
              <img
                src="/images/about_hero.png"
                alt="AMTMTI institutional building and medical professionals"
                className="w-full h-80 object-cover hover:scale-105 transition duration-300"
              />
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
              className="group relative overflow-hidden rounded-2xl border border-border bg-card hover:-translate-y-1 hover:shadow-2xl hover:shadow-medical/10 transition flex flex-col"
            >
              <div className="relative overflow-hidden h-40 bg-medical/5">
                <img
                  src={p.img}
                  alt={p.t}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="relative p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="size-11 rounded-lg bg-navy text-white grid place-items-center">
                    <p.icon className="size-5" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-brand/15 text-emerald-brand px-2.5 py-1">
                    {p.tag}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-navy group-hover:text-medical transition">
                  {p.t}
                </h3>
                <p className="mt-2 text-sm text-foreground/70 leading-relaxed flex-1">{p.d}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-medical">
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
                <div
                  key={r.area}
                  className="relative aspect-[16/10] rounded-xl overflow-hidden group"
                >
                  <img
                    src={r.img}
                    alt={r.area}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
                  <div className="absolute top-3 right-3 size-8 rounded-full bg-white/20 grid place-items-center hover:bg-white/30 transition">
                    <Microscope className="size-4 text-white" />
                  </div>
                  <p className="absolute bottom-5 left-5 font-bold text-white text-sm">{r.area}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Membership */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-28">
        <div className="rounded-3xl border border-border overflow-hidden relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/images/membership_hero.png"
              alt="AMTMTI membership community"
              className="w-full h-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/70" />
          </div>
          <div className="relative grid lg:grid-cols-12 gap-10 items-center p-8 lg:p-14">
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
                      className="rounded-full bg-white/80 border border-border px-3.5 py-1.5 text-xs font-medium text-navy"
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
