import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/site/layout";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  GraduationCap,
  ShieldCheck,
  ListChecks,
  Sparkles,
} from "lucide-react";

type ProgramRow = Database["public"]["Tables"]["programs"]["Row"];

type CurriculumModule = {
  module_title: string;
  module_description?: string | null;
  topics?: string[];
};

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
      return data as ProgramRow | null;
    },
  });

  const learningOutcomes = Array.isArray(program?.learning_outcomes)
    ? program.learning_outcomes.filter(Boolean)
    : [];

  const requirements = Array.isArray(program?.requirements)
    ? program.requirements.filter(Boolean)
    : [];

  let curriculumModules: CurriculumModule[] = [];
  if (Array.isArray(program?.curriculum)) {
    curriculumModules = program.curriculum.filter(Boolean) as CurriculumModule[];
  } else if (typeof program?.curriculum === "string") {
    try {
      curriculumModules = JSON.parse(program.curriculum) as CurriculumModule[];
    } catch {
      curriculumModules = [];
    }
  }

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
          <p className="mt-3 text-foreground/80">
            The program you requested is unavailable or the slug is invalid.
          </p>
          <Link to="/programs" className="mt-4 inline-block text-medical hover:underline">
            ← Back to programs
          </Link>
        </div>
      </PageShell>
    );
  }

  const category = (program as { program_categories?: { name: string } | null }).program_categories;
  const heroImage = program.cover_url;
  const applyUrl = program.apply_link ?? "/auth";

  return (
    <PageShell>
      <section className="relative overflow-hidden">
        {heroImage ? (
          <div className="relative h-[360px] sm:h-[420px] w-full overflow-hidden rounded-b-[2rem] bg-slate-100">
            <img
              src={heroImage}
              alt={`${program.title} hero`}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/10 to-transparent" />
          </div>
        ) : (
          <div className="h-[240px] w-full rounded-b-[2rem] bg-slate-100" />
        )}

        <div className="mx-auto max-w-6xl px-5 lg:px-8 py-10 lg:py-16">
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-medical"
          >
            <ArrowLeft className="size-4" /> All programs
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
            <div>
              {category?.name && (
                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700">
                  {category.name}
                </span>
              )}
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
                {program.title}
              </h1>
              {program.summary && (
                <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
                  {program.summary}
                </p>
              )}

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {program.duration && (
                  <div className="rounded-3xl border border-border bg-white p-5 shadow-sm">
                    <div className="text-sm font-semibold text-slate-500">Duration</div>
                    <div className="mt-2 text-lg font-semibold text-navy">{program.duration}</div>
                  </div>
                )}
                {program.mode && (
                  <div className="rounded-3xl border border-border bg-white p-5 shadow-sm">
                    <div className="text-sm font-semibold text-slate-500">Mode of study</div>
                    <div className="mt-2 text-lg font-semibold text-navy">{program.mode}</div>
                  </div>
                )}
                {program.certification && (
                  <div className="rounded-3xl border border-border bg-white p-5 shadow-sm">
                    <div className="text-sm font-semibold text-slate-500">Certification</div>
                    <div className="mt-2 text-lg font-semibold text-navy">{program.certification}</div>
                  </div>
                )}
              </div>

              <div className="mt-10 space-y-12">
                {(program.summary || program.description) && (
                  <section className="rounded-3xl border border-border bg-white p-8 shadow-sm">
                    <h2 className="text-2xl font-bold text-navy">Program overview</h2>
                    <p className="mt-4 text-foreground/80 leading-relaxed whitespace-pre-wrap">
                      {program.description ?? program.summary}
                    </p>
                  </section>
                )}

                {learningOutcomes.length > 0 && (
                  <section className="rounded-3xl border border-border bg-white p-8 shadow-sm">
                    <div className="flex items-center gap-3">
                      <Sparkles className="size-5 text-medical" />
                      <h2 className="text-2xl font-bold text-navy">Learning outcomes</h2>
                    </div>
                    <ul className="mt-6 grid gap-3 text-foreground/80">
                      {learningOutcomes.map((outcome, index) => (
                        <li key={`${outcome}-${index}`} className="list-disc pl-5 leading-relaxed">
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {curriculumModules.length > 0 && (
                  <section className="rounded-3xl border border-border bg-white p-8 shadow-sm">
                    <div className="flex items-center gap-3">
                      <ListChecks className="size-5 text-medical" />
                      <h2 className="text-2xl font-bold text-navy">Curriculum modules</h2>
                    </div>
                    <div className="mt-6 space-y-4">
                      {curriculumModules.map((module, index) => (
                        <details
                          key={`${module.module_title}-${index}`}
                          className="group rounded-3xl border border-border bg-slate-50 p-5 transition hover:border-medical/30"
                        >
                          <summary className="flex cursor-pointer items-center justify-between gap-4 text-lg font-semibold text-navy list-none">
                            <span>{module.module_title}</span>
                            <span className="text-sm text-muted-foreground">Tap to expand</span>
                          </summary>
                          <div className="mt-4 space-y-4 text-foreground/80">
                            {module.module_description && (
                              <p>{module.module_description}</p>
                            )}
                            {Array.isArray(module.topics) && module.topics.length > 0 && (
                              <ul className="grid gap-2 pl-5 text-sm leading-6 list-disc">
                                {module.topics.map((topic, topicIndex) => (
                                  <li key={`${topic}-${topicIndex}`}>{topic}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </details>
                      ))}
                    </div>
                  </section>
                )}

                {requirements.length > 0 && (
                  <section className="rounded-3xl border border-border bg-white p-8 shadow-sm">
                    <h2 className="text-2xl font-bold text-navy">Requirements</h2>
                    <ul className="mt-6 grid gap-3 text-foreground/80 pl-5 list-disc">
                      {requirements.map((requirement, index) => (
                        <li key={`${requirement}-${index}`}>{requirement}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Apply for this program
                </div>
                <div className="mt-6 space-y-4">
                  <Link
                    to={applyUrl}
                    className="block rounded-2xl bg-medical px-5 py-4 text-center text-sm font-semibold text-white transition hover:bg-medical/90"
                  >
                    Apply now
                  </Link>
                  <Link
                    to="/contact"
                    className="block rounded-2xl border border-border px-5 py-4 text-center text-sm font-semibold text-navy transition hover:border-medical hover:text-medical"
                  >
                    Ask a question
                  </Link>
                </div>
              </div>

              {(program.summary || program.description) && (
                <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Program snapshot
                  </h3>
                  <div className="mt-4 space-y-3 text-sm text-foreground/80">
                    {program.duration && (
                      <p>
                        <span className="font-semibold text-slate-900">Duration:</span> {program.duration}
                      </p>
                    )}
                    {program.mode && (
                      <p>
                        <span className="font-semibold text-slate-900">Mode:</span> {program.mode}
                      </p>
                    )}
                    {program.certification && (
                      <p>
                        <span className="font-semibold text-slate-900">Certification:</span> {program.certification}
                      </p>
                    )}
                    {program.price_ksh != null && (
                      <p>
                        <span className="font-semibold text-slate-900">Price:</span> KSH {(program.price_ksh as number).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
