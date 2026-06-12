import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/site/layout";
import { imageUrl } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useMemo, useState } from "react";
import {
  Clock,
  GraduationCap,
  ShieldCheck,
  ArrowRight,
  Search,
  GraduationCap as GradIcon,
} from "lucide-react";

interface ProgramsSearch {
  category?: string;
}

export const Route = createFileRoute("/programs")({
  validateSearch: (search: Record<string, unknown>): ProgramsSearch => {
    return {
      category: search.category as string | undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Programs — AMTMTI" },
      {
        name: "description",
        content:
          "Accredited MTM programs for pharmacists, technologists, technicians, clinicians, physicians, and nurses.",
      },
      { property: "og:title", content: "AMTMTI Programs" },
      {
        property: "og:description",
        content: "Accredited MTM pathways across African healthcare professions.",
      },
      { property: "og:url", content: "/programs" },
    ],
    links: [{ rel: "canonical", href: "/programs" }],
  }),
  component: Programs,
});

function Programs() {
  const [search, setSearch] = useState("");
  const { category } = Route.useSearch();
  const navigate = useNavigate({ from: "/programs" });
  const activeCategory = category ?? "All";

  const {
    data: programs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["programs-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("programs")
        .select(
          "id,title,slug,summary,description,duration,level,certification,price_ksh,program_categories(name,slug)",
        )
        .eq("is_published", true)
        .order("created_at");
      if (error) throw error;
      return data ?? [];
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["program-categories-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("program_categories")
        .select("id,name,slug")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (programs ?? []).filter((p: any) => {
      const matchCategory =
        activeCategory === "All" ||
        p.program_categories?.slug === activeCategory;
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.summary?.toLowerCase().includes(q) ?? false) ||
        (p.description?.toLowerCase().includes(q) ?? false) ||
        (p.program_categories?.name?.toLowerCase().includes(q) ?? false);
      return matchCategory && matchSearch;
    });
  }, [programs, search, activeCategory]);

  return (
    <PageShell>
      <section className="hero-mesh text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-25" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-brand">
              Programs
            </span>
            <h1 className="mt-4 text-4xl lg:text-6xl font-bold leading-tight max-w-3xl">
              Accredited MTM pathways for every healthcare profession.
            </h1>
            <p className="mt-5 text-lg text-white/80 max-w-2xl">
              Choose certificate, diploma, postgraduate, or CPD tracks — built for working
              professionals across Africa.
            </p>

            <div className="mt-8 max-w-2xl relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/60" />
              <input
                placeholder="Search programs by profession, level, or topic…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full bg-white/10 backdrop-blur border border-white/20 py-3.5 pl-11 pr-4 text-sm placeholder:text-white/60 outline-none focus:ring-2 focus:ring-emerald-brand"
              />
            </div>
          </div>
          <div className="hidden lg:block lg:col-span-5">
            <div className="overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={imageUrl("clinical_pharmacy.png")}
                alt="Clinical pharmacy training"
                className="w-full h-full min-h-[420px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-24">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-bold text-navy">
            All programs{" "}
            <span className="text-muted-foreground font-medium">({filtered.length})</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate({ search: {} })}
              className={`rounded-full px-4 py-1.5 text-sm border transition ${
                activeCategory === "All"
                  ? "bg-navy text-white border-navy"
                  : "border-border text-foreground/75 hover:border-medical hover:text-medical"
              }`}
            >
              All
            </button>
            {categories?.map((c: any) => (
              <button
                key={c.id}
                onClick={() => navigate({ search: { category: c.slug } })}
                className={`rounded-full px-4 py-1.5 text-sm border transition ${
                  activeCategory === c.slug
                    ? "bg-navy text-white border-navy"
                    : "border-border text-foreground/75 hover:border-medical hover:text-medical"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {isLoading && (
          <p className="mt-10 text-center text-muted-foreground py-12">Loading programs…</p>
        )}
        {error && (
          <p className="mt-10 text-center text-destructive py-12">
            Could not load programs. Please try again later.
          </p>
        )}
        {!isLoading && !error && !filtered.length && (
          <p className="mt-10 border border-dashed border-border p-12 text-center text-muted-foreground">
            No programs match your search. Try a different filter or keyword.
          </p>
        )}

        <div className="mt-10 space-y-6">
          {filtered.map((p: any) => {
            const categoryObj = p.program_categories;
            return (
              <article
                key={p.id}
                className="grid lg:grid-cols-12 gap-6 border border-border bg-card overflow-hidden hover:shadow-xl hover:shadow-medical/5 transition"
              >
                <div className="relative lg:col-span-3 bg-gradient-to-br from-medical to-emerald-brand p-8 text-white min-h-[180px]">
                  <GradIcon className="size-10" />
                  <div className="mt-auto pt-12">
                    <p className="text-xs font-bold uppercase tracking-wider opacity-80">
                      {p.level ?? "Program"}
                    </p>
                    <p className="mt-1 text-lg font-bold leading-tight">{p.title}</p>
                    {categoryObj?.name && <p className="mt-1 text-xs opacity-75">{categoryObj.name}</p>}
                  </div>
                </div>
                <div className="lg:col-span-9 p-6 lg:p-8">
                  <div className="flex flex-wrap gap-4 text-xs">
                    {p.duration && (
                      <span className="inline-flex items-center gap-1.5 text-foreground/70">
                        <Clock className="size-3.5 text-medical" /> {p.duration}
                      </span>
                    )}
                    {p.level && (
                      <span className="inline-flex items-center gap-1.5 text-foreground/70">
                        <GraduationCap className="size-3.5 text-medical" /> {p.level}
                      </span>
                    )}
                    {p.certification && (
                      <span className="inline-flex items-center gap-1.5 text-foreground/70">
                        <ShieldCheck className="size-3.5 text-emerald-brand" /> {p.certification}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-foreground/80 leading-relaxed">
                    {p.summary ?? p.description}
                  </p>
                  {p.price_ksh != null && p.price_ksh > 0 && (
                    <p className="mt-3 text-sm font-semibold text-navy">KSH {p.price_ksh.toLocaleString()}</p>
                  )}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Link
                      to="/programs/$slug"
                      params={{ slug: p.slug }}
                      className="inline-flex items-center gap-2 bg-medical px-5 py-2.5 text-sm font-semibold text-white hover:bg-medical/90"
                    >
                      View details <ArrowRight className="size-4" />
                    </Link>
                    <Link
                      to="/auth"
                      className="inline-flex items-center gap-2 border border-border px-5 py-2.5 text-sm font-semibold text-navy hover:border-medical hover:text-medical"
                    >
                      Enroll via portal
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
