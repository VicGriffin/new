import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { P as PageShell } from "./layout-DxlPml8Q.mjs";
import { supabase } from "./client-CZ7d5FUj.mjs";
import { a as Route$3 } from "./router-B9ucVT0q.mjs";
import "../_libs/sonner.mjs";
import { r as ArrowLeft } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function NewsDetail() {
  const {
    slug
  } = Route$3.useParams();
  const {
    data: post,
    isLoading,
    error
  } = useQuery({
    queryKey: ["news", slug],
    queryFn: async () => {
      const {
        data,
        error: error2
      } = await supabase.from("news").select("*").eq("slug", slug).eq("is_published", true).maybeSingle();
      if (error2) throw error2;
      return data;
    }
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PageShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-3xl px-5 py-20 text-center text-muted-foreground", children: "Loading…" }) });
  }
  if (error || !post) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PageShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-3xl px-5 py-20 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold text-navy", children: "Article not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/news", className: "mt-4 inline-block text-medical hover:underline", children: "← Back to news" })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PageShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "mx-auto max-w-3xl px-5 lg:px-8 py-16 lg:py-24", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/news", className: "inline-flex items-center gap-1.5 text-sm text-medical hover:underline", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
      " All news"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("time", { className: "mt-6 block text-sm text-muted-foreground", children: post.published_at ? new Date(post.published_at).toLocaleDateString() : "" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 text-3xl lg:text-5xl font-bold text-navy leading-tight", children: post.title }),
    post.excerpt && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-lg text-foreground/75 leading-relaxed", children: post.excerpt }),
    post.cover_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: post.cover_url, alt: "", className: "mt-8 rounded-2xl w-full object-cover" }),
    post.body && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-8 prose prose-neutral max-w-none text-foreground/85 whitespace-pre-wrap leading-relaxed", children: post.body })
  ] }) });
}
export {
  NewsDetail as component
};
