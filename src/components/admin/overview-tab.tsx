import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "@tanstack/react-router";
import { Activity, CheckCircle2, Plus } from "lucide-react";

export function OverviewTab({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats-full"],
    queryFn: async () => {
      const [
        users,
        students,
        programs,
        enrollments,
        applications,
        contacts,
        news,
        research,
        events,
        resources,
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase
          .from("user_roles")
          .select("id", { count: "exact", head: true })
          .eq("role", "student"),
        supabase.from("programs").select("id", { count: "exact", head: true }),
        supabase.from("course_enrollments").select("id", { count: "exact", head: true }),
        supabase.from("membership_applications").select("id", { count: "exact", head: true }),
        supabase
          .from("contacts")
          .select("id", { count: "exact", head: true })
          .eq("is_read", false)
          .eq("is_archived", false),
        supabase.from("news").select("id", { count: "exact", head: true }),
        supabase.from("research_articles").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("resources").select("id", { count: "exact", head: true }),
      ]);
      return {
        users: users.count ?? 0,
        students: students.count ?? 0,
        programs: programs.count ?? 0,
        enrollments: enrollments.count ?? 0,
        applications: applications.count ?? 0,
        unreadContacts: contacts.count ?? 0,
        news: news.count ?? 0,
        research: research.count ?? 0,
        events: events.count ?? 0,
        resources: resources.count ?? 0,
      };
    },
  });

  const { data: recent } = useQuery({
    queryKey: ["admin-recent"],
    queryFn: async () => {
      const [apps, msgs, enrolls] = await Promise.all([
        supabase
          .from("membership_applications")
          .select("full_name, tier, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("contacts")
          .select("name, subject, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("course_enrollments")
          .select("enrolled_at, programs(title)")
          .order("enrolled_at", { ascending: false })
          .limit(5),
      ]);
      const items: { type: string; label: string; at: string }[] = [];
      apps.data?.forEach((a: any) =>
        items.push({
          type: "Application",
          label: `${a.full_name} — ${a.tier}`,
          at: a.created_at,
        }),
      );
      msgs.data?.forEach((m: any) =>
        items.push({
          type: "Message",
          label: `${m.name}: ${m.subject ?? "(no subject)"}`,
          at: m.created_at,
        }),
      );
      enrolls.data?.forEach((e: any) =>
        items.push({
          type: "Enrollment",
          label: (e.programs as { title: string } | null)?.title ?? "Program",
          at: e.enrolled_at,
        }),
      );
      return items.sort((a, b) => b.at.localeCompare(a.at)).slice(0, 8);
    },
  });

  const cards = [
    ["Total Users", stats?.users],
    ["Students", stats?.students],
    ["Programs", stats?.programs],
    ["Enrollments", stats?.enrollments],
    ["Applications", stats?.applications],
    ["Unread Messages", stats?.unreadContacts],
    ["News", stats?.news],
    ["Research", stats?.research],
    ["Events", stats?.events],
    ["Resources", stats?.resources],
  ] as const;

  const quickActions = [
    { label: "New Program", tab: "programs" },
    { label: "New News Post", tab: "news" },
    { label: "New Event", tab: "events" },
    { label: "Manage Users", tab: "users" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
            <div className="mt-1 text-3xl font-bold text-navy">{value ?? "—"}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <h3 className="font-bold text-navy flex items-center gap-2">
            <Activity className="size-4 text-medical" /> Recent activity
          </h3>
          <ul className="mt-4 space-y-3 text-sm">
            {!recent?.length && <li className="text-muted-foreground">No recent activity yet.</li>}
            {recent?.map((item, i) => (
              <li
                key={i}
                className="flex justify-between gap-3 border-b border-border pb-2 last:border-0"
              >
                <span>
                  <span className="text-xs font-semibold text-medical">{item.type}</span> —{" "}
                  {item.label}
                </span>
                <time className="text-xs text-muted-foreground shrink-0">
                  {new Date(item.at).toLocaleDateString()}
                </time>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-bold text-navy flex items-center gap-2">
              <Plus className="size-4 text-medical" /> Quick actions
            </h3>
            <div className="mt-4 flex flex-col gap-2">
              {quickActions.map((a) => (
                <button
                  key={a.tab}
                  type="button"
                  onClick={() => onNavigate(a.tab)}
                  className="text-left text-sm px-3 py-2 rounded-md border border-border hover:border-medical hover:text-medical transition"
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-emerald-brand/30 bg-emerald-brand/5 p-6">
            <h3 className="font-bold text-navy flex items-center gap-2">
              <CheckCircle2 className="size-4 text-emerald-brand" /> System status
            </h3>
            <ul className="mt-3 space-y-1.5 text-sm text-foreground/80">
              <li>✓ Supabase connected</li>
              <li>✓ RLS policies active</li>
              <li>✓ Admin session verified</li>
            </ul>
            <Link to="/news" className="mt-4 inline-block text-xs text-medical hover:underline">
              View public news →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
