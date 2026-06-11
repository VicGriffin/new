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
const appCss = "/assets/styles-nhd6hquA.css";
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
const Route$h = createRootRouteWithContext()({
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
  const { queryClient } = Route$h.useRouteContext();
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
const $$splitComponentImporter$g = () => import("./research-B9QcIF65.mjs");
const Route$g = createFileRoute("/research")({
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
  component: lazyRouteComponent($$splitComponentImporter$g, "component")
});
const $$splitComponentImporter$f = () => import("./programs-CiPCKZmq.mjs");
const Route$f = createFileRoute("/programs")({
  validateSearch: (search) => {
    return {
      category: search.category
    };
  },
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
  component: lazyRouteComponent($$splitComponentImporter$f, "component")
});
const $$splitComponentImporter$e = () => import("./privacy-DbDt45kr.mjs");
const Route$e = createFileRoute("/privacy")({
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
  component: lazyRouteComponent($$splitComponentImporter$e, "component")
});
const $$splitComponentImporter$d = () => import("./news-DlBY3N2z.mjs");
const Route$d = createFileRoute("/news")({
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
  component: lazyRouteComponent($$splitComponentImporter$d, "component")
});
const $$splitComponentImporter$c = () => import("./membership-CfEDBzGM.mjs");
const Route$c = createFileRoute("/membership")({
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
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./events-D8529dGr.mjs");
const Route$b = createFileRoute("/events")({
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
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./contact-BIb36bzd.mjs");
const Route$a = createFileRoute("/contact")({
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
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./auth-zz4kQveR.mjs");
const Route$9 = createFileRoute("/auth")({
  head: () => ({
    meta: [{
      title: "Sign In — AMTMTI"
    }, {
      name: "description",
      content: "Sign in or create an AMTMTI account."
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./about-x6TFEn24.mjs");
const Route$8 = createFileRoute("/about")({
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
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const ALL_ROLES = ["admin", "instructor", "student", "member"];
async function getUserRoles(userId) {
  const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (error) throw error;
  return (data ?? []).map((r) => r.role);
}
async function getUserStatus(userId) {
  const { data, error } = await supabase.from("profiles").select("status").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data?.status ?? "approved";
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
function isApprovedStatus(status) {
  return status === "approved";
}
function isPortalRole(role) {
  return role === "student" || role === "member" || role === "instructor";
}
const $$splitComponentImporter$7 = () => import("./route-BFsOu0JM.mjs");
const Route$7 = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const {
      data,
      error
    } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({
      to: "/auth"
    });
    const [role, status] = await Promise.all([getEffectiveRole(data.user.id), getUserStatus(data.user.id)]);
    if (role !== "admin" && status !== "approved") {
      await supabase.auth.signOut();
      throw redirect({
        to: "/auth",
        search: {
          reason: status === "suspended" || status === "rejected" ? "suspended" : "pending"
        }
      });
    }
    return {
      user: data.user,
      role,
      status
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./index-DfHmGYtB.mjs");
const Route$6 = createFileRoute("/")({
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
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./programs._slug-DV7V3mrF.mjs");
const Route$5 = createFileRoute("/programs/$slug")({
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
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./news._slug-_-avbgB8.mjs");
const Route$4 = createFileRoute("/news/$slug")({
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
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./login-BiS_pjcj.mjs");
const Route$3 = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{
      title: "Admin Login — AMTMTI"
    }, {
      name: "robots",
      content: "noindex, nofollow"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./portal-a-rbCr1D.mjs");
const Route$2 = createFileRoute("/_authenticated/portal")({
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
    const {
      data: profile
    } = await supabase.from("profiles").select("status").eq("id", u.user.id).maybeSingle();
    const status = profile?.status ?? "pending";
    if (status !== "approved") {
      throw redirect({
        to: "/auth",
        search: {
          reason: status === "suspended" || status === "rejected" ? status : "pending"
        }
      });
    }
    return {
      user: u.user
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./admin-C3GiBVvY.mjs");
const Route$1 = createFileRoute("/_authenticated/admin")({
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
    const adminOk = await isAdmin(u.user.id);
    if (!adminOk) throw redirect({
      to: "/portal"
    });
    const status = await getUserStatus(u.user.id);
    if (status === "suspended" || status === "rejected") {
      await supabase.auth.signOut();
      throw redirect({
        to: "/auth",
        search: {
          reason: status
        }
      });
    }
    return {
      user: u.user
    };
  },
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./portal.learn._slug-BKadtSJt.mjs");
const Route = createFileRoute("/_authenticated/portal/learn/$slug")({
  head: () => ({
    meta: [{
      title: "Study Course — AMTMTI"
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
    if (!hasValidRole) throw redirect({
      to: "/auth"
    });
    const {
      data: profile
    } = await supabase.from("profiles").select("status").eq("id", u.user.id).maybeSingle();
    const status = profile?.status ?? "pending";
    if (status !== "approved") {
      throw redirect({
        to: "/auth",
        search: {
          reason: status === "suspended" || status === "rejected" ? status : "pending"
        }
      });
    }
    return {
      user: u.user
    };
  },
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const ResearchRoute = Route$g.update({
  id: "/research",
  path: "/research",
  getParentRoute: () => Route$h
});
const ProgramsRoute = Route$f.update({
  id: "/programs",
  path: "/programs",
  getParentRoute: () => Route$h
});
const PrivacyRoute = Route$e.update({
  id: "/privacy",
  path: "/privacy",
  getParentRoute: () => Route$h
});
const NewsRoute = Route$d.update({
  id: "/news",
  path: "/news",
  getParentRoute: () => Route$h
});
const MembershipRoute = Route$c.update({
  id: "/membership",
  path: "/membership",
  getParentRoute: () => Route$h
});
const EventsRoute = Route$b.update({
  id: "/events",
  path: "/events",
  getParentRoute: () => Route$h
});
const ContactRoute = Route$a.update({
  id: "/contact",
  path: "/contact",
  getParentRoute: () => Route$h
});
const AuthRoute = Route$9.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$h
});
const AboutRoute = Route$8.update({
  id: "/about",
  path: "/about",
  getParentRoute: () => Route$h
});
const AuthenticatedRouteRoute = Route$7.update({
  id: "/_authenticated",
  getParentRoute: () => Route$h
});
const IndexRoute = Route$6.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$h
});
const ProgramsSlugRoute = Route$5.update({
  id: "/$slug",
  path: "/$slug",
  getParentRoute: () => ProgramsRoute
});
const NewsSlugRoute = Route$4.update({
  id: "/$slug",
  path: "/$slug",
  getParentRoute: () => NewsRoute
});
const AdminLoginRoute = Route$3.update({
  id: "/admin/login",
  path: "/admin/login",
  getParentRoute: () => Route$h
});
const AuthenticatedPortalRoute = Route$2.update({
  id: "/portal",
  path: "/portal",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedAdminRoute = Route$1.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => AuthenticatedRouteRoute
});
const AuthenticatedPortalLearnSlugRoute = Route.update({
  id: "/learn/$slug",
  path: "/learn/$slug",
  getParentRoute: () => AuthenticatedPortalRoute
});
const AuthenticatedPortalRouteChildren = {
  AuthenticatedPortalLearnSlugRoute
};
const AuthenticatedPortalRouteWithChildren = AuthenticatedPortalRoute._addFileChildren(AuthenticatedPortalRouteChildren);
const AuthenticatedRouteRouteChildren = {
  AuthenticatedAdminRoute,
  AuthenticatedPortalRoute: AuthenticatedPortalRouteWithChildren
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
const routeTree = Route$h._addFileChildren(rootRouteChildren)._addFileTypes();
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
  Route$f as R,
  getUserStatus as a,
  Route$5 as b,
  Route$4 as c,
  isAdminRole as d,
  isApprovedStatus as e,
  isPortalRole as f,
  getEffectiveRole as g,
  isAdmin as i,
  router as r
};
