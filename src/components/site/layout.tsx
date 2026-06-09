import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";


const nav = [
  { label: "About", to: "/about" },
  { label: "Programs", to: "/programs" },
  { label: "Research", to: "/research" },
  { label: "Membership", to: "/membership" },
  { label: "E-Learning", to: "/portal" },
  { label: "Contact", to: "/contact" },
] as const;

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 select-none group">
      <div className="relative grid place-items-center w-10 h-10 rounded-xl bg-gradient-to-br from-medical to-emerald-brand shadow-lg shadow-medical/25 group-hover:scale-105 transition">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 3v18M3 12h18" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        </svg>
      </div>
      <div className="leading-tight">
        <div className={`font-display font-extrabold tracking-tight text-lg ${light ? "text-white" : "text-navy"}`}>AMTMTI</div>
        <div className={`text-[10px] font-medium uppercase tracking-[0.14em] ${light ? "text-white/70" : "text-muted-foreground"}`}>Africa MTM Training Institute</div>
      </div>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setAuthed(!!data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setAuthed(!!s));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 lg:px-8 h-18 py-3">
        <Logo />
        <nav className="hidden lg:flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-3.5 py-2 text-sm font-medium text-foreground/80 rounded-md hover:text-medical hover:bg-soft transition"
              activeProps={{ className: "text-medical bg-soft" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-2">
          {authed ? (
            <Link to="/portal" className="text-sm font-medium text-foreground/80 hover:text-medical px-3 py-2">My Portal</Link>
          ) : (
            <Link to="/auth" className="text-sm font-medium text-foreground/80 hover:text-medical px-3 py-2">Sign In</Link>
          )}
          <Link to="/membership" className="inline-flex items-center gap-1.5 rounded-md bg-medical px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-medical/90 transition">
            Apply Now
          </Link>
        </div>
        <button onClick={() => setOpen(!open)} className="lg:hidden p-2 text-navy" aria-label="Menu">
          {open ? <X className="size-6"/> : <Menu className="size-6"/>}
        </button>
      </div>
      {open && (
        <div className="lg:hidden border-t border-border bg-background">
          <div className="px-5 py-4 flex flex-col gap-1">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="px-3 py-2.5 rounded-md text-sm font-medium hover:bg-soft">{n.label}</Link>
            ))}
            <Link to="/programs" onClick={() => setOpen(false)} className="mt-2 rounded-md bg-medical px-4 py-3 text-sm font-semibold text-white text-center">Apply Now</Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-navy text-white/90 relative overflow-hidden">
      <div className="absolute inset-0 hero-mesh opacity-60" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8 pt-16 pb-8">
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Logo light />
            <p className="mt-5 text-sm text-white/70 max-w-sm leading-relaxed">
              Scaling Medication Therapy Management education, professional development, certification, and research across Africa.
            </p>
            <div className="mt-6 flex gap-3">
              {["Twitter","LinkedIn","YouTube","Facebook"].map(s => (
                <a key={s} href="#" className="text-xs px-3 py-1.5 rounded-full border border-white/15 hover:border-emerald-brand hover:text-emerald-brand transition">{s}</a>
              ))}
            </div>
          </div>
          {[
            { h: "Learn", links: [["Programs","/programs"],["Research","/research"],["E-Learning","/portal"],["Membership","/membership"]] },
            { h: "Institute", links: [["About","/about"],["Leadership","/about"],["News","/"],["Careers","/contact"]] },
            { h: "Connect", links: [["Contact","/contact"],["Partners","/membership"],["Support","/contact"],["Privacy","/"]] },
          ].map(col => (
            <div key={col.h}>
              <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-brand">{col.h}</h4>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map(([l,to]) => (
                  <li key={l}><Link to={to as string} className="text-white/75 hover:text-white">{l}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-wrap justify-between gap-3 text-xs text-white/60">
          <p>© {new Date().getFullYear()} Africa Medication Therapy Management Training Institute. All rights reserved.</p>
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
