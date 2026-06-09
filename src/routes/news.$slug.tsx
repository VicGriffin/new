import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PageShell } from "@/components/site/layout";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/news/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `News — ${params.slug}` }],
    links: [{ rel: "canonical", href: `/news/${params.slug}` }],
  }),
  component: NewsDetail,
});

function NewsDetail() {
  const { slug } = Route.useParams();
  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["news", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("news")
        .select("*")
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
        <div className="mx-auto max-w-3xl px-5 py-20 text-center text-muted-foreground">
          Loading…
        </div>
      </PageShell>
    );
  }

  if (error || !post) {
    return (
      <PageShell>
        <div className="mx-auto max-w-3xl px-5 py-20 text-center">
          <h1 className="text-2xl font-bold text-navy">Article not found</h1>
          <Link to="/news" className="mt-4 inline-block text-medical hover:underline">
            ← Back to news
          </Link>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-5 lg:px-8 py-16 lg:py-24">
        <Link
          to="/news"
          className="inline-flex items-center gap-1.5 text-sm text-medical hover:underline"
        >
          <ArrowLeft className="size-4" /> All news
        </Link>
        <time className="mt-6 block text-sm text-muted-foreground">
          {post.published_at ? new Date(post.published_at).toLocaleDateString() : ""}
        </time>
        <h1 className="mt-2 text-3xl lg:text-5xl font-bold text-navy leading-tight">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-4 text-lg text-foreground/75 leading-relaxed">{post.excerpt}</p>
        )}
        {post.cover_url && (
          <img src={post.cover_url} alt="" className="mt-8 rounded-2xl w-full object-cover" />
        )}
        {post.body && (
          <div className="mt-8 prose prose-neutral max-w-none text-foreground/85 whitespace-pre-wrap leading-relaxed">
            {post.body}
          </div>
        )}
      </article>
    </PageShell>
  );
}
