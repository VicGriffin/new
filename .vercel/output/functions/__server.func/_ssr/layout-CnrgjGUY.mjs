import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { supabase } from "./client-CLv5cT1Y.mjs";
import { i as isAdmin } from "./router-BrXL5jN2.mjs";
import { a as ShieldCheck, X, K as Menu } from "../_libs/lucide-react.mjs";
const nav = [
  { label: "About", to: "/about" },
  { label: "Programs", to: "/programs" },
  { label: "Research", to: "/research" },
  { label: "News", to: "/news" },
  { label: "Membership", to: "/membership" },
  { label: "E-Learning", to: "/portal" },
  { label: "Contact", to: "/contact" }
];
function Logo({ light = false }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-2.5 select-none group", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-medical to-emerald-brand shadow-lg shadow-medical/25 group-hover:scale-105 transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", "aria-hidden": true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M12 3v18M3 12h18", stroke: "white", strokeWidth: "3", strokeLinecap: "round" }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "leading-tight", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `font-display font-extrabold tracking-tight text-lg ${light ? "text-white" : "text-navy"}`,
          children: "AMTMTI"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: `text-[10px] font-medium uppercase tracking-[0.14em] ${light ? "text-white/70" : "text-muted-foreground"}`,
          children: "Africa MTM Training Institute"
        }
      )
    ] })
  ] });
}
function Header() {
  const [open, setOpen] = reactExports.useState(false);
  const [authed, setAuthed] = reactExports.useState(false);
  const [admin, setAdmin] = reactExports.useState(false);
  reactExports.useEffect(() => {
    async function syncAuth(session) {
      setAuthed(!!session);
      setAdmin(session ? await isAdmin(session.user.id) : false);
    }
    supabase.auth.getSession().then(({ data }) => syncAuth(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => syncAuth(s));
    return () => sub.subscription.unsubscribe();
  }, []);
  const adminTo = admin ? "/admin" : "/admin/login";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-7xl items-center justify-between px-5 lg:px-8 h-18 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden lg:flex items-center gap-1", children: nav.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: n.to,
          className: "px-3.5 py-2 text-sm font-medium text-foreground/80 rounded-md hover:text-medical hover:bg-soft transition",
          activeProps: { className: "text-medical bg-soft" },
          children: n.label
        },
        n.to
      )) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: adminTo,
            className: "inline-flex items-center gap-1.5 text-sm font-medium text-foreground/80 hover:text-medical px-3 py-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4" }),
              "Admin"
            ]
          }
        ),
        authed ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/portal",
            className: "text-sm font-medium text-foreground/80 hover:text-medical px-3 py-2",
            children: "My Portal"
          }
        ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/auth",
            className: "text-sm font-medium text-foreground/80 hover:text-medical px-3 py-2",
            children: "Sign In"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/membership",
            className: "inline-flex items-center gap-1.5 rounded-md bg-medical px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-medical/90 transition",
            children: "Apply Now"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setOpen(!open),
          className: "lg:hidden p-2 text-navy",
          "aria-label": "Menu",
          children: open ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-6" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "size-6" })
        }
      )
    ] }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:hidden border-t border-border bg-background", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-5 py-4 flex flex-col gap-1", children: [
      nav.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: n.to,
          onClick: () => setOpen(false),
          className: "px-3 py-2.5 rounded-md text-sm font-medium hover:bg-soft",
          children: n.label
        },
        n.to
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: adminTo,
          onClick: () => setOpen(false),
          className: "px-3 py-2.5 rounded-md text-sm font-medium hover:bg-soft inline-flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4" }),
            "Admin"
          ]
        }
      ),
      authed ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/portal",
          onClick: () => setOpen(false),
          className: "px-3 py-2.5 rounded-md text-sm font-medium hover:bg-soft",
          children: "My Portal"
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/auth",
          onClick: () => setOpen(false),
          className: "px-3 py-2.5 rounded-md text-sm font-medium hover:bg-soft",
          children: "Sign In"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/membership",
          onClick: () => setOpen(false),
          className: "mt-2 rounded-md bg-medical px-4 py-3 text-sm font-semibold text-white text-center",
          children: "Apply Now"
        }
      )
    ] }) })
  ] });
}
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "bg-navy text-white/90 relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 hero-mesh opacity-60", "aria-hidden": true }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-7xl px-5 lg:px-8 pt-16 pb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-10 lg:grid-cols-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { light: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-sm text-white/70 max-w-sm leading-relaxed", children: "Scaling Medication Therapy Management education, professional development, certification, and research across Africa." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex gap-3", children: ["Twitter", "LinkedIn", "YouTube", "Facebook"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "a",
            {
              href: "#",
              className: "text-xs px-3 py-1.5 rounded-full border border-white/15 hover:border-emerald-brand hover:text-emerald-brand transition",
              children: s
            },
            s
          )) })
        ] }),
        [
          {
            h: "Learn",
            links: [
              ["Programs", "/programs"],
              ["Research", "/research"],
              ["E-Learning", "/portal"],
              ["Membership", "/membership"]
            ]
          },
          {
            h: "Institute",
            links: [
              ["About", "/about"],
              ["Leadership", "/about"],
              ["News", "/news"],
              ["Events", "/events"],
              ["Careers", "/contact"]
            ]
          },
          {
            h: "Connect",
            links: [
              ["Contact", "/contact"],
              ["Partners", "/membership"],
              ["Support", "/contact"],
              ["Privacy", "/privacy"]
            ]
          }
        ].map((col) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "text-xs font-bold uppercase tracking-[0.18em] text-emerald-brand", children: col.h }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 space-y-2.5 text-sm", children: col.links.map(([l, to]) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to, className: "text-white/75 hover:text-white", children: l }) }, l)) })
        ] }, col.h))
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-12 pt-6 border-t border-white/10 flex flex-wrap justify-between gap-3 text-xs text-white/60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "© ",
          (/* @__PURE__ */ new Date()).getFullYear(),
          " Africa Medication Therapy Management Training Institute. All rights reserved."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Accredited education built for African healthcare professionals." })
      ] })
    ] })
  ] });
}
function PageShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-background text-foreground flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1", children }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  PageShell as P
};
