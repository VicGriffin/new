import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { S as redirect } from "../_libs/tanstack__router-core.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { T as Toaster } from "../_libs/sonner.mjs";
import { supabase } from "./client-CZ7d5FUj.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const appCss = "/assets/styles-DH1zIJuU.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$g = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AMTMTI — Africa Medication Therapy Management Training Institute" },
      {
        name: "description",
        content: "Accredited education, professional development, certification, and research in medication therapy management across Africa."
      },
      { name: "author", content: "AMTMTI" },
      { property: "og:site_name", content: "AMTMTI" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" }
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$g.useRouteContext();
  const router2 = useRouter();
  reactExports.useEffect(() => {
    let mounted = true;
    import("./client-CZ7d5FUj.mjs").then(({ supabase: supabase2 }) => {
      if (!mounted) return;
      try {
        const { data: sub } = supabase2.auth.onAuthStateChange((event) => {
          if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
          router2.invalidate();
          if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
        });
        return () => sub.subscription.unsubscribe();
      } catch (error) {
        console.error("[Root] Supabase auth state listener failed:", error);
      }
    }).catch((error) => {
      console.error("[Root] Failed to import Supabase client:", error);
    });
    return () => {
      mounted = false;
    };
  }, [router2, queryClient]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { richColors: true, position: "top-right" })
  ] });
}
const $$splitComponentImporter$f = () => import("./research-B66jv7yk.mjs");
const Route$f = createFileRoute("/research")({
  head: () => ({
    meta: [{
      title: "AMTMTI Research — Evidence for African Pharmaceutical Care"
    }, {
      name: "description",
      content: "Publications, research areas, and partnerships at the AMTMTI Research Division."
    }, {
      property: "og:title",
      content: "AMTMTI Research Division"
    }, {
      property: "og:description",
      content: "Advancing pharmaceutical care through African-led research."
    }, {
      property: "og:url",
      content: "/research"
    }],
    links: [{
      rel: "canonical",
      href: "/research"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./programs-DuWJuhEy.mjs");
const Route$e = createFileRoute("/programs")({
  head: () => ({
    meta: [{
      title: "Programs — AMTMTI"
    }, {
      name: "description",
      content: "Accredited MTM programs for pharmacists, technologists, technicians, clinicians, physicians, and nurses."
    }, {
      property: "og:title",
      content: "AMTMTI Programs"
    }, {
      property: "og:description",
      content: "Accredited MTM pathways across African healthcare professions."
    }, {
      property: "og:url",
      content: "/programs"
    }],
    links: [{
      rel: "canonical",
      href: "/programs"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./privacy-Bz3UiLAb.mjs");
const Route$d = createFileRoute("/privacy")({
  head: () => ({
    meta: [{
      title: "Privacy Policy — AMTMTI"
    }, {
      name: "description",
      content: "AMTMTI privacy policy and data handling practices."
    }],
    links: [{
      rel: "canonical",
      href: "/privacy"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./news-W1THZn43.mjs");
const Route$c = createFileRoute("/news")({
  head: () => ({
    meta: [{
      title: "News — AMTMTI"
    }, {
      name: "description",
      content: "Latest news and announcements from AMTMTI."
    }, {
      property: "og:title",
      content: "AMTMTI News"
    }, {
      property: "og:url",
      content: "/news"
    }],
    links: [{
      rel: "canonical",
      href: "/news"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./membership-BJLb2hPp.mjs");
const Route$b = createFileRoute("/membership")({
  head: () => ({
    meta: [{
      title: "Affiliate Membership — AMTMTI"
    }, {
      name: "description",
      content: "Join AMTMTI as a student, professional, institution, or corporate partner. Networking, research access, training discounts, and recognition."
    }, {
      property: "og:title",
      content: "AMTMTI Affiliate Membership"
    }, {
      property: "og:description",
      content: "Become part of Africa's leading MTM community."
    }, {
      property: "og:url",
      content: "/membership"
    }],
    links: [{
      rel: "canonical",
      href: "/membership"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./events-Cj1T0JqO.mjs");
const Route$a = createFileRoute("/events")({
  head: () => ({
    meta: [{
      title: "Events — AMTMTI"
    }, {
      name: "description",
      content: "Upcoming AMTMTI conferences, webinars, and training events."
    }, {
      property: "og:title",
      content: "AMTMTI Events"
    }, {
      property: "og:url",
      content: "/events"
    }],
    links: [{
      rel: "canonical",
      href: "/events"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./contact-KWoXe-pz.mjs");
const Route$9 = createFileRoute("/contact")({
  head: () => ({
    meta: [{
      title: "Contact — AMTMTI"
    }, {
      name: "description",
      content: "Get in touch with the Africa Medication Therapy Management Training Institute."
    }, {
      property: "og:title",
      content: "Contact AMTMTI"
    }, {
      property: "og:description",
      content: "Email, phone, address, and inquiry form."
    }, {
      property: "og:url",
      content: "/contact"
    }],
    links: [{
      rel: "canonical",
      href: "/contact"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./auth-CWpseBWu.mjs");
const Route$8 = createFileRoute("/auth")({
  head: () => ({
    meta: [{
      title: "Sign In — AMTMTI"
    }, {
      name: "description",
      content: "Sign in or create an AMTMTI account."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./about-BfJQKtm3.mjs");
const Route$7 = createFileRoute("/about")({
  head: () => ({
    meta: [{
      title: "About — AMTMTI"
    }, {
      name: "description",
      content: "Mission, vision, leadership, and strategic objectives of the Africa Medication Therapy Management Training Institute."
    }, {
      property: "og:title",
      content: "About AMTMTI"
    }, {
      property: "og:description",
      content: "Who we are and why we exist."
    }, {
      property: "og:url",
      content: "/about"
    }],
    links: [{
      rel: "canonical",
      href: "/about"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./route-BFsOu0JM.mjs");
const Route$6 = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const {
      data,
      error
    } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({
      to: "/auth"
    });
    return {
      user: data.user
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./index-DcYD560t.mjs");
const Route$5 = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "AMTMTI — Africa Medication Therapy Management Training Institute"
    }, {
      name: "description",
      content: "World-class education, professional development, certification, and research in medication therapy management across Africa."
    }, {
      property: "og:title",
      content: "AMTMTI — Scaling MTM Training in Africa"
    }, {
      property: "og:description",
      content: "Accredited programs, research, and affiliate membership for African healthcare professionals."
    }, {
      property: "og:type",
      content: "website"
    }, {
      property: "og:url",
      content: "/"
    }],
    links: [{
      rel: "canonical",
      href: "/"
    }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "EducationalOrganization",
        name: "Africa Medication Therapy Management Training Institute",
        alternateName: "AMTMTI",
        description: "Training, certification, and research in medication therapy management across Africa."
      })
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./programs._slug-DI-7MQcX.mjs");
const Route$4 = createFileRoute("/programs/$slug")({
  head: ({
    params
  }) => ({
    meta: [{
      title: `Program — ${params.slug}`
    }],
    links: [{
      rel: "canonical",
      href: `/programs/${params.slug}`
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./news._slug-BgOuQ7UJ.mjs");
const Route$3 = createFileRoute("/news/$slug")({
  head: ({
    params
  }) => ({
    meta: [{
      title: `News — ${params.slug}`
    }],
    links: [{
      rel: "canonical",
      href: `/news/${params.slug}`
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./login-DfV3_Qni.mjs");
const Route$2 = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{
      title: "Admin Login — AMTMTI"
    }, {
      name: "robots",
      content: "noindex, nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./portal-BVsiaLhE.mjs");
const Route$1 = createFileRoute("/_authenticated/portal")({
  head: () => ({
    meta: [{
      title: "E-Learning Portal — AMTMTI"
    }]
  }),
  beforeLoad: async () => {
    const {
      data: u
    } = await supabase.auth.getUser();
    if (!u.user) throw redirect({
      to: "/auth"
    });
    const {
      data: roles
    } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
    if (roles?.some((r) => r.role === "admin")) {
      throw redirect({
        to: "/admin"
      });
    }
    const validRoles = ["student", "member", "instructor"];
    const hasValidRole = roles?.some((r) => validRoles.includes(r.role));
    if (!hasValidRole) {
      throw redirect({
        to: "/auth"
      });
    }
    return {
      user: u.user
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const ALL_ROLES = ["admin", "instructor", "student", "member"];
async function getUserRoles(userId) {
  const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (error) throw error;
  return (data ?? []).map((r) => r.role);
}
async function hasRole(userId, role) {
  const roles = await getUserRoles(userId);
  return roles.includes(role);
}
async function isAdmin(userId) {
  return hasRole(userId, "admin");
}
async function getEffectiveRole(userId) {
  const roles = await getUserRoles(userId);
  if (roles.includes("admin")) return "admin";
  if (roles.includes("student")) return "student";
  if (roles.includes("member")) return "member";
  if (roles.includes("instructor")) return "instructor";
  return void 0;
}
function isAdminRole(role) {
  return role === "admin";
}
function isPortalRole(role) {
  return role === "student" || role === "member" || role === "instructor";
}
const $$splitComponentImporter = () => import("./admin-wN99jF87.mjs");
const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [{
      title: "Admin Dashboard — AMTMTI"
    }, {
      name: "robots",
      content: "noindex, nofollow"
    }]
  }),
  beforeLoad: async () => {
    const {
      data: u
    } = await supabase.auth.getUser();
    if (!u.user) throw redirect({
      to: "/admin/login"
    });
    if (!await isAdmin(u.user.id)) throw redirect({
      to: "/portal"
    });
    return {
      user: u.user
    };
  },
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const ResearchRoute = Route$f.update({
  id: "/research",
  path: "/research",
  getParentRoute: () => Route$g
});
const ProgramsRoute = Route$e.update({
  id: "/programs",
  path: "/programs",
  getParentRoute: () => Route$g
});
const PrivacyRoute = Route$d.update({
  id: "/privacy",
  path: "/privacy",
  getParentRoute: () => Route$g
});
const NewsRoute = Route$c.update({
  id: "/news",
  path: "/news",
  getParentRoute: () => Route$g
});
const MembershipRoute = Route$b.update({
  id: "/membership",
  path: "/membership",
  getParentRoute: () => Route$g
});
const EventsRoute = Route$a.update({
  id: "/events",
  path: "/events",
  getParentRoute: () => Route$g
});
const ContactRoute = Route$9.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$g
});
const AuthRoute = Route$8.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$g
});
const AboutRoute = Route$7.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$g
});
const AuthenticatedRouteRoute = Route$6.update({
  id: "/_authenticated",
  getParentRoute: () => Route$g
});
const IndexRoute = Route$5.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$g
});
const ProgramsSlugRoute = Route$4.update({
  id: "/$slug",
  path: "/$slug",
  getParentRoute: () => ProgramsRoute
});
const NewsSlugRoute = Route$3.update({
  id: "/$slug",
  path: "/$slug",
  getParentRoute: () => NewsRoute
});
const AdminLoginRoute = Route$2.update({
  id: "/admin/login",
  path: "/admin/login",
  getParentRoute: () => Route$g
});
const AuthenticatedPortalRoute = Route$1.update({
  id: "/portal",
  path: "/portal",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedAdminRoute = Route.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedRouteRouteChildren = {
  AuthenticatedAdminRoute,
  AuthenticatedPortalRoute
};
const AuthenticatedRouteRouteWithChildren = AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren);
const NewsRouteChildren = {
  NewsSlugRoute
};
const NewsRouteWithChildren = NewsRoute._addFileChildren(NewsRouteChildren);
const ProgramsRouteChildren = {
  ProgramsSlugRoute
};
const ProgramsRouteWithChildren = ProgramsRoute._addFileChildren(
  ProgramsRouteChildren
);
const rootRouteChildren = {
  IndexRoute,
  AuthenticatedRouteRoute: AuthenticatedRouteRouteWithChildren,
  AboutRoute,
  AuthRoute,
  ContactRoute,
  EventsRoute,
  MembershipRoute,
  NewsRoute: NewsRouteWithChildren,
  PrivacyRoute,
  ProgramsRoute: ProgramsRouteWithChildren,
  ResearchRoute,
  AdminLoginRoute
};
const routeTree = Route$g._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  ALL_ROLES as A,
  Route$4 as R,
  Route$3 as a,
  isAdminRole as b,
  isPortalRole as c,
  getEffectiveRole as g,
  isAdmin as i,
  router as r
};
