import { createFileRoute, redirect, useNavigate, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/layout";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { isAdmin } from "@/lib/auth/roles";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard,
  BookOpen,
  Newspaper,
  Mail,
  Users,
  Microscope,
  Calendar,
  Library,
  Handshake,
  Quote,
  GraduationCap,
  LogOut,
} from "lucide-react";
import { OverviewTab } from "@/components/admin/overview-tab";
import { UsersTab } from "@/components/admin/users-tab";
import {
  ProgramsTab,
  NewsTab,
  EventsTab,
  ResearchTab,
  ResourcesTab,
  PartnersTab,
  TestimonialsTab,
  ApplicationsTab,
  ContactsTab,
  EnrollmentsTab,
} from "@/components/admin/content-tabs";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [{ title: "Admin Dashboard — AMTMTI" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  beforeLoad: async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/admin/login" });
    if (!(await isAdmin(u.user.id))) throw redirect({ to: "/portal" });
    return { user: u.user };
  },
  component: Admin,
});

type Tab =
  | "overview"
  | "users"
  | "programs"
  | "applications"
  | "contacts"
  | "enrollments"
  | "news"
  | "events"
  | "research"
  | "resources"
  | "partners"
  | "testimonials";

const TABS: { k: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { k: "overview", label: "Overview", icon: LayoutDashboard },
  { k: "users", label: "Users", icon: Users },
  { k: "programs", label: "Programs", icon: BookOpen },
  { k: "enrollments", label: "Enrollments", icon: GraduationCap },
  { k: "applications", label: "Applications", icon: Users },
  { k: "contacts", label: "Messages", icon: Mail },
  { k: "news", label: "News", icon: Newspaper },
  { k: "events", label: "Events", icon: Calendar },
  { k: "research", label: "Research", icon: Microscope },
  { k: "resources", label: "Resources", icon: Library },
  { k: "partners", label: "Partners", icon: Handshake },
  { k: "testimonials", label: "Testimonials", icon: Quote },
];

function Admin() {
  const [tab, setTab] = useState<Tab>("overview");
  const nav = useNavigate();
  const qc = useQueryClient();

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    nav({ to: "/admin/login", replace: true });
  }

  return (
    <PageShell>
      <section className="hero-mesh text-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-brand">
              Admin Console
            </div>
            <h1 className="mt-1 text-3xl lg:text-4xl font-bold">Manage AMTMTI</h1>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-brand text-navy px-4 py-2.5 text-sm font-semibold"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        </div>
      </section>

      <div className="border-b border-border bg-card sticky top-[72px] z-10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.k}
              type="button"
              onClick={() => setTab(t.k)}
              className={`flex items-center gap-2 px-4 py-3.5 text-sm font-semibold border-b-2 transition whitespace-nowrap ${tab === t.k ? "border-medical text-medical" : "border-transparent text-foreground/60 hover:text-foreground"}`}
            >
              <t.icon className="size-4" />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-10">
        {tab === "overview" && <OverviewTab onNavigate={(t) => setTab(t as Tab)} />}
        {tab === "users" && <UsersTab />}
        {tab === "programs" && <ProgramsTab />}
        {tab === "enrollments" && <EnrollmentsTab />}
        {tab === "applications" && <ApplicationsTab />}
        {tab === "contacts" && <ContactsTab />}
        {tab === "news" && <NewsTab />}
        {tab === "events" && <EventsTab />}
        {tab === "research" && <ResearchTab />}
        {tab === "resources" && <ResourcesTab />}
        {tab === "partners" && <PartnersTab />}
        {tab === "testimonials" && <TestimonialsTab />}
      </section>
    </PageShell>
  );
}
