import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Menu, X, ShieldCheck, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  AppRole,
  AppStatus,
  getEffectiveRole,
  getUserStatus,
  isAdminRole,
  isApprovedStatus,
  isPortalRole,
} from "@/lib/auth/roles";

interface NavItem {
  label: string;
  to: string;
  dropdown?: boolean;
}

const nav: readonly NavItem[] = [
  { label: "About", to: "/about" },
  { label: "Programs", to: "/programs", dropdown: true },
  { label: "Research", to: "/research" },
  { label: "News", to: "/news" },
  { label: "E-Learning", to: "/portal" },
  { label: "Contact", to: "/contact" },
];

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center select-none group">
      <div className="w-[140px] sm:w-[200px] md:w-[300px] lg:w-[400px] h-auto flex-shrink-0">
        <img
          src="/images/logo.jpeg"
          alt="AMTMTI logo"
          className="w-full h-auto object-contain"
          loading="lazy"
          aria-label="AMTMTI logo"
        />
      </div>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [role, setRole] = useState<AppRole | undefined>(undefined);
  const [status, setStatus] = useState<AppStatus | undefined>(undefined);
  const [authResolved, setAuthResolved] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  const { data: categories } = useQuery({
    queryKey: ["program-categories-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("program_categories")
        .select("id,name,slug")
        .order("name");
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const programsDropdown =
    categories?.map((c: { name: string; slug: string }) => ({
      label: c.name,
      search: { category: c.slug },
    })) ?? [];

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    async function syncAuth(session: any) {
      if (!session) {
        setRole(undefined);
        setStatus(undefined);
        setHasSession(false);
        setAuthResolved(true);
        return;
      }
      try {
        const [resolvedRole, resolvedStatus] = await Promise.all([
          getEffectiveRole(session.user.id),
          getUserStatus(session.user.id),
        ]);
        setRole(resolvedRole);
        setStatus(resolvedStatus);
        setHasSession(true);
      } catch (error) {
        console.error("[Header] Failed to resolve user role/status:", error);
        setRole(undefined);
        setStatus(undefined);
        setHasSession(false);
      } finally {
        setAuthResolved(true);
      }
    }

    supabase.auth
      .getSession()
      .then(({ data }: any) => {
        syncAuth(data.session);
      })
      .catch((error: any) => {
        console.error("[Header] Supabase getSession failed:", error);
        setRole(undefined);
        setStatus(undefined);
        setHasSession(false);
        setAuthResolved(true);
      });

    try {
      const { data: sub } = supabase.auth.onAuthStateChange((_e: any, s: any) => {
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
  const isGuest = authResolved ? !hasSession || (!showPortalNav && !showAdminNav) : true;
  const visibleNav = showAdminNav ? nav.filter((item) => item.to !== "/portal") : nav;

  if (!authResolved) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="border-b border-border bg-background/90">
        <div className="mx-auto flex flex-col gap-3 px-5 lg:px-8 py-2 text-xs text-foreground/80 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex flex-col gap-1">
              <span className="font-semibold uppercase tracking-[0.18em]">Opening Hours</span>
              <span>Open 24 hours Monday - Sunday</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold uppercase tracking-[0.18em]">Contact</span>
              <span>+254 721 421 719 +254 721 421 719</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-semibold uppercase tracking-[0.18em]">Location</span>
              <span>Thika Superhighway Kimbo Ruiru, Kenya</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isGuest && (
              <>
                <Link
                  to={adminLink}
                  className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:text-medical hover:bg-soft transition"
                >
                  <ShieldCheck className="size-4" />
                  Admin
                </Link>
                <Link
                  to="/auth"
                  className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-foreground/80 hover:text-medical hover:bg-soft transition"
                >
                  Join Now
                </Link>
              </>
            )}
            {!isGuest && showAdminNav && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 rounded-md bg-emerald-brand px-4 py-2.5 text-sm font-semibold text-navy shadow-sm hover:bg-emerald-brand/90 transition"
              >
                <ShieldCheck className="size-4" />
                Admin Dashboard
              </Link>
            )}
            {!isGuest && showPortalNav && (
              <Link
                to="/portal"
                className="text-sm font-medium text-foreground/80 hover:text-medical px-3 py-2 rounded-md hover:bg-soft transition"
              >
                My Portal
              </Link>
            )}
            {!isGuest && !showAdminNav && !showPortalNav && (
              <Link
                to="/auth"
                className="text-sm font-medium text-foreground/80 hover:text-medical px-3 py-2 rounded-md hover:bg-soft transition"
              >
                Join Now
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 lg:px-8 py-3">
        <div className="hidden lg:flex items-center gap-6">
          <Logo />
          <nav className="hidden lg:flex items-center gap-1">
            {visibleNav.map((n) => (
              <div
                key={n.to}
                className="relative group"
                onMouseEnter={() => n.dropdown && setOpenDropdown(n.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  to={n.to}
                  className="px-3.5 py-2 text-sm font-medium text-foreground/80 rounded-md hover:text-medical hover:bg-soft transition flex items-center gap-1"
                  activeProps={{ className: "text-medical bg-soft" }}
                >
                  {n.label}
                  {n.dropdown && <ChevronDown className="size-4" />}
                </Link>
                {n.dropdown && openDropdown === n.label && (
                  <div className="absolute top-full left-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 min-w-56">
                    {programsDropdown.map((item) => (
                      <Link
                        key={item.label}
                        to="/programs"
                        search={item.search}
                        onClick={() => setOpenDropdown(null)}
                        className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-medical hover:bg-soft transition first:rounded-t-md last:rounded-b-md"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
        <div className="hidden lg:flex items-center gap-2">
          <Link
            to="/membership"
            className="inline-flex items-center gap-1.5 rounded-md bg-medical px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-medical/90 transition"
          >
            Apply for Membership
          </Link>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden p-2 text-navy"
          aria-label="Menu"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="px-5 py-4 flex flex-col gap-1">
            {visibleNav.map((n) => (
              <div key={n.to}>
                {n.dropdown ? (
                  <>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === n.label ? null : n.label)}
                      className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium hover:bg-soft flex items-center justify-between"
                    >
                      {n.label}
                      <ChevronDown
                        className={`size-4 transition-transform ${
                          openDropdown === n.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openDropdown === n.label && (
                      <div className="ml-2 bg-soft/50 rounded-md mt-1">
                        {programsDropdown.map((item) => (
                          <Link
                            key={item.label}
                            to="/programs"
                            search={item.search}
                            onClick={() => {
                              setOpenDropdown(null);
                              setOpen(false);
                            }}
                            className="block px-3 py-2 text-sm text-foreground/80 hover:text-medical hover:bg-soft rounded-md transition"
                          >
                            {item.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className="px-3 py-2.5 rounded-md text-sm font-medium hover:bg-soft block"
                  >
                    {n.label}
                  </Link>
                )}
              </div>
            ))}
            {showAdminNav ? (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-md text-sm font-medium hover:bg-soft inline-flex items-center gap-2"
              >
                <ShieldCheck className="size-4" />
                Admin Dashboard
              </Link>
            ) : showPortalNav ? (
              <Link
                to="/portal"
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-md text-sm font-medium hover:bg-soft"
              >
                My Portal
              </Link>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-md text-sm font-medium hover:bg-soft"
              >
                Join Now
              </Link>
            )}
            <Link
              to="/membership"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-md bg-medical px-4 py-3 text-sm font-semibold text-white text-center"
            >
              Apply for Membership
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-navy text-white/90 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <img
          src="/images/footer.png"
          alt="Footer background"
          className="h-full w-full object-cover object-center opacity-20 brightness-110 contrast-110"
        />
        <div className="absolute inset-0 bg-navy/80" />
      </div>
      <div className="absolute inset-0 hero-mesh opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8 pt-16 pb-8">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-sm mb-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-emerald-brand">
                Ready to transform MTM in your organisation?
              </p>
              <h3 className="mt-3 text-2xl font-bold text-white">
                Let's build stronger medication therapy systems together.
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center rounded-full bg-emerald-brand px-5 py-3 text-sm font-semibold text-navy hover:opacity-90 transition"
              >
                Talk to Admissions
              </Link>
              <Link
                to="/membership"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/15 transition"
              >
                Join Membership
              </Link>
            </div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo light />
            <p className="mt-5 text-sm text-white/70 max-w-sm leading-relaxed">
              Scaling Medication Therapy Management education, professional development,
              certification, and research across Africa.
            </p>
            <div className="mt-6 space-y-3 text-sm text-white/70">
              <div>
                Contact:{" "}
                <Link to="/contact" className="text-white hover:text-emerald-brand">
                  contact@amtmti.africa
                </Link>
              </div>
              <div>
                Phone:{" "}
                <a href="tel:+234800000000" className="text-white hover:text-emerald-brand">
                  +234 800 000 000
                </a>
              </div>
              <div>Office: Lagos, Nigeria</div>
            </div>
          </div>
          {[
            {
              h: "Learn",
              links: [
                ["Programs", "/programs"],
                ["Research", "/research"],
                ["E-Learning", "/portal"],
                ["Membership", "/membership"],
              ],
            },
            {
              h: "Institute",
              links: [
                ["About", "/about"],
                ["News", "/news"],
                ["Events", "/events"],
                ["Privacy", "/privacy"],
              ],
            },
            {
              h: "Connect",
              links: [
                ["Contact", "/contact"],
                ["Partners", "/membership"],
                ["Support", "/contact"],
              ],
            },
          ].map((col) => (
            <div key={col.h}>
              <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-brand">
                {col.h}
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map(([l, to]) => (
                  <li key={l}>
                    <Link to={to as string} className="text-white/75 hover:text-white">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap justify-between gap-3 text-xs text-white/60">
          <p>
            © {new Date().getFullYear()} Africa Medication Therapy Management Training Institute.
            All rights reserved.
          </p>
          <p>Accredited education built for African healthcare professionals.</p>
        </div>
      </div>
    </footer>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
