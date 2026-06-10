import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/site/layout";
import { imageUrl } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Newspaper } from "lucide-react";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News — AMTMTI" },
      { name: "description", content: "Latest news and announcements from AMTMTI." },
      { property: "og:title", content: "AMTMTI News" },
      { property: "og:url", content: "/news" },
    ],
    links: [{ rel: "canonical", href: "/news" }],
  }),
  component: NewsList,
});

function NewsList() {
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["news-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("id,title,slug,excerpt,cover_url,published_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <PageShell>
      <section className="hero-mesh text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={imageUrl("news_hero.png")}
            alt="AMTMTI news and events"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy/85 via-navy/25 to-navy/95" aria-hidden />
        </div>
        <div className="absolute inset-0 grid-pattern opacity-25" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 py-20 lg:py-24 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-brand">
              News
            </span>
            <h1 className="mt-4 text-4xl lg:text-6xl font-bold leading-tight max-w-3xl">
              Updates from AMTMTI
            </h1>
            <p className="mt-5 text-lg text-white/80 max-w-2xl">
              Program launches, research highlights, partnerships, and institute announcements.
            </p>
          </div>
          <div className="hidden lg:block lg:col-span-5">
            <div className="rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src={imageUrl("news_hero1.png")}
                alt="Institutional event imagery"
                className="w-full h-full min-h-[420px] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-24">
        {isLoading && <div className="text-center text-muted-foreground py-12">Loading news…</div>}
        {error && (
          <div className="text-center text-destructive py-12">
            Could not load news. Please try again later.
          </div>
        )}
        {!isLoading && !error && !posts?.length && (
          <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">
            No news posts yet. Check back soon.
          </div>
        )}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts?.map((post) => (
            <article
              key={post.id}
              className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg hover:border-medical/30 transition flex flex-col"
            >
              {post.cover_url ? (
                <img src={post.cover_url} alt="" className="h-44 w-full object-cover" />
              ) : (
                <div className="h-44 bg-gradient-to-br from-navy to-medical grid place-items-center text-white">
                  <Newspaper className="size-10 opacity-80" />
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                <time className="text-xs text-muted-foreground">
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString()
                    : "Recently"}
                </time>
                <h2 className="mt-2 text-lg font-bold text-navy leading-snug">{post.title}</h2>
                {post.excerpt && (
                  <p className="mt-2 text-sm text-foreground/70 flex-1">{post.excerpt}</p>
                )}
                <Link
                  to="/news/$slug"
                  params={{ slug: post.slug }}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-medical hover:underline"
                >
                  Read more <ArrowRight className="size-4" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
