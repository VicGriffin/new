import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/site/layout";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ArrowRight, Clock, GraduationCap, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/programs/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `Program — ${params.slug}` }],
    links: [{ rel: "canonical", href: `/programs/${params.slug}` }],
  }),
  component: ProgramDetail,
});

function ProgramDetail() {
  const { slug } = Route.useParams();
  const {
    data: program,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["program", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs")
        .select("*,program_categories(name)")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <PageShell>
        <div className="mx-auto max-w-4xl px-5 py-20 text-center text-muted-foreground">
          Loading program…
        </div>
      </PageShell>
    );
  }

  if (error || !program) {
    return (
      <PageShell>
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <h1 className="text-2xl font-bold text-navy">Program not found</h1>
          <Link to="/programs" className="mt-4 inline-block text-medical hover:underline">
            ← All programs
          </Link>
        </div>
      </PageShell>
    );
  }

  const category = (program as { program_categories?: { name: string } | null }).program_categories;

  return (
    <PageShell>
      <section className="hero-mesh text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-25" aria-hidden />
        <div className="relative mx-auto max-w-4xl px-5 lg:px-8 py-16 lg:py-20">
          <Link
            to="/programs"
            className="inline-flex items-center gap-1.5 text-sm text-white/80 hover:text-white"
          >
            <ArrowLeft className="size-4" /> All programs
          </Link>
          {category?.name && (
            <span className="mt-6 block text-xs font-bold uppercase tracking-[0.2em] text-emerald-brand">
              {category.name}
            </span>
          )}
          <h1 className="mt-2 text-3xl lg:text-5xl font-bold leading-tight">{program.title}</h1>
          {program.summary && (
            <p className="mt-4 text-lg text-white/80 max-w-2xl">{program.summary}</p>
          )}
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/75">
            {program.duration && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4 text-emerald-brand" /> {program.duration}
              </span>
            )}
            {program.level && (
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap className="size-4 text-emerald-brand" /> {program.level}
              </span>
            )}
            {program.certification && (
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-brand" /> {program.certification}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 lg:px-8 py-16">
        {program.description && (
          <div className="prose prose-neutral max-w-none">
            <h2 className="text-xl font-bold text-navy">About this program</h2>
            <p className="mt-3 text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {program.description}
            </p>
          </div>
        )}
        <div className="mt-10 flex flex-wrap gap-4 items-center">
          {program.price_usd != null && program.price_usd > 0 && (
            <span className="text-2xl font-bold text-navy">${program.price_usd} USD</span>
          )}
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 rounded-md bg-medical px-6 py-3 font-semibold text-white hover:bg-medical/90"
          >
            Enroll via portal <ArrowRight className="size-4" />
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 font-semibold text-navy hover:border-medical hover:text-medical"
          >
            Request syllabus
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
