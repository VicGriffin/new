import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/site/layout";
import { imageUrl } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { Microscope, BookOpen, Users, ArrowRight, FileText, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AMTMTI Research — Evidence for African Pharmaceutical Care" },
      {
        name: "description",
        content: "Publications, research areas, and partnerships at the AMTMTI Research Division.",
      },
      { property: "og:title", content: "AMTMTI Research Division" },
      {
        property: "og:description",
        content: "Advancing pharmaceutical care through African-led research.",
      },
      { property: "og:url", content: "/research" },
    ],
    links: [{ rel: "canonical", href: "/research" }],
  }),
  component: Research,
});

const areas = [
  {
    t: "Medication Safety",
    d: "Adverse drug events, pharmacovigilance, and safety culture in African hospitals.",
  },
  {
    t: "Clinical Pharmacy",
    d: "Service delivery models, clinical pharmacy outcomes, and workforce development.",
  },
  {
    t: "Pharmaceutical Care",
    d: "Patient-centered care plans, MTM service evaluation, and quality indicators.",
  },
  {
    t: "Public Health",
    d: "Antimicrobial stewardship, vaccination uptake, and health systems strengthening.",
  },
  {
    t: "Medication Adherence",
    d: "Behavioral, digital, and community interventions to improve adherence.",
  },
];

function Research() {
  const { data: articles, isLoading } = useQuery({
    queryKey: ["research-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("research_articles")
        .select("*")
        .eq("is_published", true)
        .order("published_date", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  const areasWithCount = areas.map((a) => ({
    ...a,
    count: articles?.filter((art) => art.area === a.t).length ?? 0,
  }));

  const handleViewPDF = async (pdfPath: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please sign in to view research PDFs.");
        return;
      }
      const { data, error } = await supabase.storage
        .from("research_files")
        .createSignedUrl(pdfPath, 120);
      if (error) throw error;
      window.open(data.signedUrl, "_blank");
    } catch (e: any) {
      toast.error(e.message || "Failed to generate PDF view link");
    }
  };

  return (
    <PageShell>
      <section className="hero-mesh text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={imageUrl("medical_adherence.png")}
            alt="Medication adherence research"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/20 to-navy/95" aria-hidden />
        </div>
        <div className="absolute inset-0 grid-pattern opacity-25" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-brand">
              Research Division
            </span>
            <h1 className="mt-4 text-4xl lg:text-6xl font-bold leading-tight">
              African evidence. Global standards. Better medication therapy.
            </h1>
            <p className="mt-6 text-lg text-white/80 max-w-2xl">
              AMTMTI Research advances pharmaceutical care through rigorous clinical,
              implementation, and health systems research — and translates findings into curriculum,
              policy, and practice.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#publications"
                className="inline-flex items-center gap-2 bg-emerald-brand px-6 py-3 font-semibold text-navy"
              >
                View publications <ArrowRight className="size-4" />
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 glass px-6 py-3 font-semibold text-white"
              >
                Propose a collaboration
              </Link>
            </div>
          </div>
          <div className="lg:col-span-5 space-y-5">
            <div className="overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={imageUrl("Pharmaceutical_care.png")}
                alt="Pharmaceutical care research"
                className="w-full h-full min-h-[420px] object-cover"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                [articles?.length ?? 0, "Publications"],
                ["18", "Active studies"],
                ["12", "Country partners"],
                ["7", "Funded grants"],
              ].map(([n, l]) => (
                <div key={l as string} className="glass p-5">
                  <div className="text-3xl font-bold text-emerald-brand">{n}</div>
                  <div className="text-xs text-white/70 mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-medical">
          Research areas
        </span>
        <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-navy">Where we focus</h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {areasWithCount.map((a) => (
            <div
              key={a.t}
              className="bg-card border border-border p-6 hover:border-medical/40 hover:shadow-lg transition"
            >
              <div className="size-11 bg-medical/10 text-medical grid place-items-center">
                <Microscope className="size-5" />
              </div>
              <h3 className="mt-5 font-bold text-navy text-lg">{a.t}</h3>
              <p className="mt-2 text-sm text-foreground/70">{a.d}</p>
              {a.count > 0 && (
                <p className="mt-3 text-xs font-semibold text-medical">{a.count} publication(s)</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section id="publications" className="bg-soft border-y border-border">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-20">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-medical">
                Publications
              </span>
              <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-navy">
                Recent peer-reviewed work
              </h2>
            </div>
          </div>
          {isLoading && (
            <p className="mt-10 text-center text-muted-foreground">Loading publications…</p>
          )}
          {!isLoading && !articles?.length && (
            <p className="mt-10 border border-dashed border-border p-8 text-center text-muted-foreground">
              Publications will appear here once published by our research team.
            </p>
          )}
          <div className="mt-10 space-y-3">
            {articles?.map((p) => (
              <article
                key={p.id}
                className="flex gap-5 bg-card border border-border p-5 hover:border-medical/40 transition"
              >
                <div className="hidden sm:grid place-items-center w-16 h-16 bg-navy text-white font-bold text-sm">
                  {p.published_date ? new Date(p.published_date).getFullYear() : "—"}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-navy leading-snug">{p.title}</h3>
                  {p.area && <p className="mt-1 text-xs text-medical font-semibold">{p.area}</p>}
                  {p.abstract && (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{p.abstract}</p>
                  )}
                  {p.authors && <p className="mt-1 text-xs text-muted-foreground">{p.authors}</p>}
                </div>
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-medical hover:underline self-center"
                  >
                    <ExternalLink className="size-4" /> View
                  </a>
                ) : p.pdf_path ? (
                  <button
                    onClick={() => handleViewPDF(p.pdf_path!)}
                    className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-medical hover:underline self-center border-none bg-transparent cursor-pointer"
                  >
                    <ExternalLink className="size-4" /> View PDF
                  </button>
                ) : (
                  <span className="hidden md:inline-flex items-center gap-1.5 text-sm text-muted-foreground self-center">
                    <FileText className="size-4" /> Abstract
                  </span>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-20 grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border p-8">
          <div className="size-12 bg-emerald-brand/15 text-emerald-brand grid place-items-center">
            <Users className="size-5" />
          </div>
          <h3 className="mt-5 text-2xl font-bold text-navy">Research partnerships</h3>
          <p className="mt-3 text-foreground/75">
            We collaborate with universities, ministries, and global health agencies across Africa
            to design, fund, and deliver impactful research.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["UCT", "Makerere", "UI Ibadan", "KEMRI", "WHO AFRO", "Africa CDC"].map((p) => (
              <span
                key={p}
                className="rounded-full bg-soft border border-border px-3 py-1 text-xs font-semibold text-navy"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-navy text-white p-8 relative overflow-hidden">
          <div className="absolute inset-0 hero-mesh opacity-70" aria-hidden />
          <div className="relative">
            <div className="size-12 bg-emerald-brand/20 text-emerald-brand grid place-items-center">
              <BookOpen className="size-5" />
            </div>
            <h3 className="mt-5 text-2xl font-bold">Call for collaboration</h3>
            <p className="mt-3 text-white/75">
              Are you a researcher, health system, or funder working on medication safety,
              adherence, or pharmaceutical care? Let's build the next study together.
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex items-center gap-2 bg-emerald-brand px-5 py-2.5 text-sm font-semibold text-navy"
            >
              Get in touch <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
