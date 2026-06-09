import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/site/layout";
import { BookOpen, GraduationCap, Bell, LogOut, CheckCircle2, Clock, Library, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/portal")({
  head: () => ({ meta: [{ title: "E-Learning Portal — AMTMTI" }] }),
  component: Portal,
});

function Portal() {
  const nav = useNavigate();
  const qc = useQueryClient();

  const { data: user } = useQuery({ queryKey: ["user"], queryFn: async () => (await supabase.auth.getUser()).data.user });
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id], enabled: !!user?.id,
    queryFn: async () => (await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle()).data,
  });
  const { data: roles } = useQuery({
    queryKey: ["roles", user?.id], enabled: !!user?.id,
    queryFn: async () => (await supabase.from("user_roles").select("role").eq("user_id", user!.id)).data ?? [],
  });
  const isAdmin = roles?.some(r => r.role === "admin");

  const { data: programs } = useQuery({
    queryKey: ["programs"], queryFn: async () => (await supabase.from("programs").select("id,title,slug,summary,duration,level,certification,price_usd").eq("is_published", true).order("created_at")).data ?? [],
  });
  const { data: enrollments } = useQuery({
    queryKey: ["enrollments", user?.id], enabled: !!user?.id,
    queryFn: async () => (await supabase.from("course_enrollments").select("*,programs(title,slug,duration,certification)").eq("user_id", user!.id)).data ?? [],
  });
  const { data: notifications } = useQuery({
    queryKey: ["notifications", user?.id], enabled: !!user?.id,
    queryFn: async () => (await supabase.from("notifications").select("*").eq("user_id", user!.id).order("created_at",{ascending:false}).limit(8)).data ?? [],
  });

  const enroll = useMutation({
    mutationFn: async (programId: string) => {
      const { error } = await supabase.from("course_enrollments").insert({ user_id: user!.id, program_id: programId });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Enrolled — find it under My Programs"); qc.invalidateQueries({ queryKey: ["enrollments"] }); },
    onError: (e: any) => toast.error(e.message ?? "Could not enroll"),
  });

  const updateProgress = useMutation({
    mutationFn: async ({ id, progress }: { id: string; progress: number }) => {
      const status = progress >= 100 ? "completed" : "active";
      const completed_at = progress >= 100 ? new Date().toISOString() : null;
      const { error } = await supabase.from("course_enrollments").update({ progress, status, completed_at }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["enrollments"] }),
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    nav({ to: "/auth", replace: true });
  }

  const enrolledIds = new Set((enrollments ?? []).map((e: any) => e.program_id));
  const completed = (enrollments ?? []).filter((e: any) => e.status === "completed").length;
  const active = (enrollments ?? []).filter((e: any) => e.status === "active").length;

  return (
    <PageShell>
      <section className="hero-mesh text-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-12 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-brand">Welcome back</div>
            <h1 className="mt-1 text-3xl lg:text-4xl font-bold">{profile?.full_name || user?.email}</h1>
            <p className="mt-1 text-white/70 text-sm">{profile?.profession || "Student"} · {profile?.country || "—"}</p>
          </div>
          <div className="flex gap-2">
            {isAdmin && <Link to="/admin" className="inline-flex items-center gap-1.5 rounded-md bg-emerald-brand text-navy px-4 py-2.5 text-sm font-semibold"><ShieldCheck className="size-4"/>Admin</Link>}
            <button onClick={signOut} className="inline-flex items-center gap-1.5 rounded-md bg-white/10 hover:bg-white/15 px-4 py-2.5 text-sm font-semibold border border-white/15"><LogOut className="size-4"/>Sign out</button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-10 grid lg:grid-cols-4 gap-5">
        <Stat icon={BookOpen} label="Enrolled" value={(enrollments?.length ?? 0).toString()}/>
        <Stat icon={Clock} label="In progress" value={active.toString()}/>
        <Stat icon={CheckCircle2} label="Completed" value={completed.toString()}/>
        <Stat icon={Bell} label="Notifications" value={(notifications?.filter(n=>!n.is_read).length ?? 0).toString()}/>
      </section>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 pb-16 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <h2 className="text-2xl font-bold text-navy">My Programs</h2>
            <div className="mt-5 space-y-3">
              {!enrollments?.length && <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No enrollments yet. Browse programs below.</div>}
              {enrollments?.map((e: any)=>(
                <div key={e.id} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-navy">{e.programs?.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{e.programs?.duration} · {e.programs?.certification}</div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${e.status==="completed"?"bg-emerald-brand/15 text-emerald-brand":"bg-medical/10 text-medical"}`}>{e.status}</span>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1.5"><span>Progress</span><span>{e.progress}%</span></div>
                    <div className="h-2 rounded bg-muted overflow-hidden"><div className="h-full bg-gradient-to-r from-medical to-emerald-brand" style={{width:`${e.progress}%`}}/></div>
                  </div>
                  {e.status!=="completed" && (
                    <div className="mt-4 flex gap-2">
                      {[25,50,75,100].map(p=>(
                        <button key={p} onClick={()=>updateProgress.mutate({ id: e.id, progress: p })} className="text-xs px-2.5 py-1 rounded border border-border hover:bg-muted">Mark {p}%</button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy">Browse Programs</h2>
            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              {programs?.map(p=>{
                const isEnrolled = enrolledIds.has(p.id);
                return (
                  <div key={p.id} className="rounded-xl border border-border bg-card p-5 flex flex-col">
                    <div className="size-10 grid place-items-center rounded-lg bg-medical/10 text-medical"><GraduationCap className="size-5"/></div>
                    <h3 className="mt-3 font-bold text-navy">{p.title}</h3>
                    <p className="mt-1 text-sm text-foreground/70 flex-1">{p.summary}</p>
                    <div className="mt-3 text-xs text-muted-foreground">{p.duration} · {p.level} · ${p.price_usd}</div>
                    <button disabled={isEnrolled || enroll.isPending} onClick={()=>enroll.mutate(p.id)}
                      className="mt-4 rounded-md bg-medical text-white px-4 py-2 text-sm font-semibold hover:bg-medical/90 disabled:opacity-60">
                      {isEnrolled?"Enrolled":"Enroll"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-bold text-navy flex items-center gap-2"><Bell className="size-4"/> Notifications</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {!notifications?.length && <li className="text-muted-foreground text-xs">You're all caught up.</li>}
              {notifications?.map(n=>(
                <li key={n.id} className={`rounded-md p-3 border ${n.is_read?"bg-muted/40 border-border":"bg-medical/5 border-medical/20"}`}>
                  <div className="font-medium text-navy text-sm">{n.title}</div>
                  {n.body && <div className="text-xs text-muted-foreground mt-1">{n.body}</div>}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="font-bold text-navy flex items-center gap-2"><Library className="size-4"/> Resources</h3>
            <p className="text-xs text-muted-foreground mt-2">Member-only resources appear here once your instructor adds them to a program.</p>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}

function Stat({icon:Icon,label,value}:{icon:any;label:string;value:string}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
      <div className="size-12 rounded-lg bg-medical/10 text-medical grid place-items-center"><Icon className="size-5"/></div>
      <div><div className="text-2xl font-bold text-navy">{value}</div><div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div></div>
    </div>
  );
}
