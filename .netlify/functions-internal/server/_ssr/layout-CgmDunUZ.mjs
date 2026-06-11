import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { u as useQuery } from "../_libs/tanstack__react-query.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { supabase } from "./client-CZ7d5FUj.mjs";
import { g as getEffectiveRole, a as getUserStatus, d as isAdminRole, e as isApprovedStatus, f as isPortalRole } from "./router-W4DiE8xe.mjs";
import { a as ShieldCheck, Z as ChevronDown, _ as X, $ as Menu } from "../_libs/lucide-react.mjs";
const nav = [
  { label: "About", to: "/about" },
  { label: "Programs", to: "/programs", dropdown: true },
  { label: "Research", to: "/research" },
  { label: "News", to: "/news" },
  { label: "E-Learning", to: "/portal" },
  { label: "Contact", to: "/contact" }
];
function Logo({ light = false }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "flex items-center select-none group", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-[140px] sm:w-[200px] md:w-[300px] lg:w-[400px] h-auto flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    "img",
    {
      src: "/images/logo.jpeg",
      alt: "AMTMTI logo",
      className: "w-full h-auto object-contain",
      loading: "lazy",
      "aria-label": "AMTMTI logo"
    }
  ) }) });
}
function Header() {
  const [open, setOpen] = reactExports.useState(false);
  const [openDropdown, setOpenDropdown] = reactExports.useState(null);
  const [role, setRole] = reactExports.useState(void 0);
  const [status, setStatus] = reactExports.useState(void 0);
  const [authResolved, setAuthResolved] = reactExports.useState(false);
  const [hasSession, setHasSession] = reactExports.useState(false);
  const { data: categories } = useQuery({
    queryKey: ["program-categories-public"],
    queryFn: async () => {
      const { data, error } = await supabase.from("program_categories").select("id,name,slug").order("name");
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1e3
  });
  const programsDropdown = categories?.map((c) => ({
    label: c.name,
    search: { category: c.slug }
  })) ?? [];
  reactExports.useEffect(() => {
    let unsubscribe;
    async function syncAuth(session) {
      if (!session) {
        setRole(void 0);
        setStatus(void 0);
        setHasSession(false);
        setAuthResolved(true);
        return;
      }
      try {
        const [resolvedRole, resolvedStatus] = await Promise.all([
          getEffectiveRole(session.user.id),
          getUserStatus(session.user.id)
        ]);
        setRole(resolvedRole);
        setStatus(resolvedStatus);
        setHasSession(true);
      } catch (error) {
        console.error("[Header] Failed to resolve user role/status:", error);
        setRole(void 0);
        setStatus(void 0);
        setHasSession(false);
      } finally {
        setAuthResolved(true);
      }
    }
    supabase.auth.getSession().then(({ data }) => {
      syncAuth(data.session);
    }).catch((error) => {
      console.error("[Header] Supabase getSession failed:", error);
      setRole(void 0);
      setStatus(void 0);
      setHasSession(false);
      setAuthResolved(true);
    });
    try {
      const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
        syncAuth(s);
      });
      unsubscribe = () => sub.subscription.unsubscribe();
    } catch (error) {
      console.error("[Header] Supabase auth state listener failed:", error);
    }
    return () => unsubscribe?.();
  }, []);
  const showAdminNav = isAdminRole(role);
  const showPortalNav = isApprovedStatus(status) && isPortalRole(role);
  const adminLink = showAdminNav ? "/admin" : "/admin/login";
  const isGuest = authResolved ? !hasSession || !showPortalNav && !showAdminNav : true;
  const visibleNav = showAdminNav ? nav.filter((item) => item.to !== "/portal") : nav;
  if (!authResolved) {
    return null;
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border bg-background/90", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex flex-col gap-3 px-5 lg:px-8 py-2 text-xs text-foreground/80 lg:flex-row lg:items-center lg:justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold uppercase tracking-[0.18em]", children: "Opening Hours" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Open 24 hours Monday - Sunday" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold uppercase tracking-[0.18em]", children: "Contact" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "+254 721 421 719 +254 721 421 719" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold uppercase tracking-[0.18em]", children: "Location" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Thika Superhighway Kimbo Ruiru, Kenya" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
        isGuest && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: adminLink,
              className: "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:text-medical hover:bg-soft transition",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4" }),
                "Admin"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/auth",
              className: "inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:text-medical hover:bg-soft transition",
              children: "Join Now"
            }
          )
        ] }),
        !isGuest && showAdminNav && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/admin",
            className: "inline-flex items-center gap-1.5 rounded-md bg-emerald-brand px-4 py-2.5 text-sm font-semibold text-navy shadow-sm hover:bg-emerald-brand/90 transition",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4" }),
              "Admin Dashboard"
            ]
          }
        ),
        !isGuest && showPortalNav && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/portal",
            className: "text-sm font-medium text-foreground/80 hover:text-medical px-3 py-2 rounded-md hover:bg-soft transition",
            children: "My Portal"
          }
        ),
        !isGuest && !showAdminNav && !showPortalNav && /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/auth",
            className: "text-sm font-medium text-foreground/80 hover:text-medical px-3 py-2 rounded-md hover:bg-soft transition",
            children: "Join Now"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-7xl items-center justify-between px-5 lg:px-8 py-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:flex items-center gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "hidden lg:flex items-center gap-1", children: visibleNav.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative group",
            onMouseEnter: () => n.dropdown && setOpenDropdown(n.label),
            onMouseLeave: () => setOpenDropdown(null),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  to: n.to,
                  className: "px-3.5 py-2 text-sm font-medium text-foreground/80 rounded-md hover:text-medical hover:bg-soft transition flex items-center gap-1",
                  activeProps: { className: "text-medical bg-soft" },
                  children: [
                    n.label,
                    n.dropdown && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "size-4" })
                  ]
                }
              ),
              n.dropdown && openDropdown === n.label && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-full left-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 min-w-56", children: programsDropdown.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                Link,
                {
                  to: "/programs",
                  search: item.search,
                  onClick: () => setOpenDropdown(null),
                  className: "block px-4 py-2.5 text-sm text-foreground/80 hover:text-medical hover:bg-soft transition first:rounded-t-md last:rounded-b-md",
                  children: item.label
                },
                item.label
              )) })
            ]
          },
          n.to
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden lg:flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/membership",
          className: "inline-flex items-center gap-1.5 rounded-md bg-medical px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-medical/90 transition",
          children: "Apply for Membership"
        }
      ) }),
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
      visibleNav.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: n.dropdown ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: () => setOpenDropdown(openDropdown === n.label ? null : n.label),
            className: "w-full text-left px-3 py-2.5 rounded-md text-sm font-medium hover:bg-soft flex items-center justify-between",
            children: [
              n.label,
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ChevronDown,
                {
                  className: `size-4 transition-transform ${openDropdown === n.label ? "rotate-180" : ""}`
                }
              )
            ]
          }
        ),
        openDropdown === n.label && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-2 bg-soft/50 rounded-md mt-1", children: programsDropdown.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: "/programs",
            search: item.search,
            onClick: () => {
              setOpenDropdown(null);
              setOpen(false);
            },
            className: "block px-3 py-2 text-sm text-foreground/80 hover:text-medical hover:bg-soft rounded-md transition",
            children: item.label
          },
          item.label
        )) })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: n.to,
          onClick: () => setOpen(false),
          className: "px-3 py-2.5 rounded-md text-sm font-medium hover:bg-soft block",
          children: n.label
        }
      ) }, n.to)),
      showAdminNav ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/admin",
          onClick: () => setOpen(false),
          className: "px-3 py-2.5 rounded-md text-sm font-medium hover:bg-soft inline-flex items-center gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-4" }),
            "Admin Dashboard"
          ]
        }
      ) : showPortalNav ? /* @__PURE__ */ jsxRuntimeExports.jsx(
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
          children: "Join Now"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/membership",
          onClick: () => setOpen(false),
          className: "mt-2 rounded-md bg-medical px-4 py-3 text-sm font-semibold text-white text-center",
          children: "Apply for Membership"
        }
      )
    ] }) })
  ] });
}
function Footer() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "bg-navy text-white/90 relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 -z-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: "/images/footer.png",
          alt: "Footer background",
          className: "h-full w-full object-cover object-center opacity-20 brightness-110 contrast-110"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-navy/80" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 hero-mesh opacity-60", "aria-hidden": true }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mx-auto max-w-7xl px-5 lg:px-8 pt-16 pb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm mb-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm uppercase tracking-[0.28em] text-emerald-brand", children: "Ready to transform MTM in your organisation?" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 text-2xl font-bold text-white", children: "Let's build stronger medication therapy systems together." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/contact",
              className: "inline-flex items-center justify-center rounded-full bg-emerald-brand px-5 py-3 text-sm font-semibold text-navy hover:opacity-90 transition",
              children: "Talk to Admissions"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: "/membership",
              className: "inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15 transition",
              children: "Join Membership"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-10 lg:grid-cols-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Logo, { light: true }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-5 text-sm text-white/70 max-w-sm leading-relaxed", children: "Scaling Medication Therapy Management education, professional development, certification, and research across Africa." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 space-y-3 text-sm text-white/70", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              "Contact:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/contact", className: "text-white hover:text-emerald-brand", children: "contact@amtmti.africa" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              "Phone:",
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "tel:+234800000000", className: "text-white hover:text-emerald-brand", children: "+234 800 000 000" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Office: Lagos, Nigeria" })
          ] })
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
              ["News", "/news"],
              ["Events", "/events"],
              ["Privacy", "/privacy"]
            ]
          },
          {
            h: "Connect",
            links: [
              ["Contact", "/contact"],
              ["Partners", "/membership"],
              ["Support", "/contact"]
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
