import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/site/layout";
import { useState } from "react";
import { LayoutDashboard, BookOpen, Newspaper, Mail, Users, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — AMTMTI" }] }),
  beforeLoad: async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/auth" });
    const { data: r } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id).eq("role","admin").maybeSingle();
    if (!r) throw redirect({ to: "/portal" });
  },
  component: Admin,
});

type Tab = "overview" | "programs" | "applications" | "contacts" | "news";

function Admin() {
  const [tab, setTab] = useState<Tab>("overview");
  const nav = useNavigate();

  const stats = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [p, a, c, e, n] = await Promise.all([
        supabase.from("programs").select("id",{count:"exact",head:true}),
        supabase.from("membership_applications").select("id",{count:"exact",head:true}),
        supabase.from("contacts").select("id",{count:"exact",head:true}).eq("is_read",false),
        supabase.from("course_enrollments").select("id",{count:"exact",head:true}),
        supabase.from("news").select("id",{count:"exact",head:true}),
      ]);
      return { programs: p.count ?? 0, applications: a.count ?? 0, unread: c.count ?? 0, enrollments: e.count ?? 0, news: n.count ?? 0 };
    },
  });

  const tabs: {k:Tab; label:string; icon:any}[] = [
    {k:"overview",label:"Overview",icon:LayoutDashboard},
    {k:"programs",label:"Programs",icon:BookOpen},
    {k:"applications",label:"Applications",icon:Users},
    {k:"contacts",label:"Messages",icon:Mail},
    {k:"news",label:"News",icon:Newspaper},
  ];

  return (
    <PageShell>
      <section className="hero-mesh text-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-10">
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-brand">Admin Console</div>
          <h1 className="mt-1 text-3xl lg:text-4xl font-bold">Manage AMTMTI</h1>
        </div>
      </section>
      <div className="border-b border-border bg-card sticky top-[72px] z-10">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 flex gap-1 overflow-x-auto">
          {tabs.map(t=>(
            <button key={t.k} onClick={()=>setTab(t.k)} className={`flex items-center gap-2 px-4 py-3.5 text-sm font-semibold border-b-2 transition whitespace-nowrap ${tab===t.k?"border-medical text-medical":"border-transparent text-foreground/60 hover:text-foreground"}`}>
              <t.icon className="size-4"/>{t.label}
            </button>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-10">
        {tab==="overview" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              ["Programs", stats.data?.programs],
              ["Applications", stats.data?.applications],
              ["Unread messages", stats.data?.unread],
              ["Enrollments", stats.data?.enrollments],
              ["News posts", stats.data?.news],
            ].map(([l,v])=>(
              <div key={l as string} className="rounded-xl border border-border bg-card p-5">
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{l}</div>
                <div className="mt-1 text-3xl font-bold text-navy">{v ?? "—"}</div>
              </div>
            ))}
          </div>
        )}
        {tab==="programs" && <ProgramsAdmin/>}
        {tab==="applications" && <ApplicationsAdmin/>}
        {tab==="contacts" && <ContactsAdmin/>}
        {tab==="news" && <NewsAdmin/>}
      </section>
    </PageShell>
  );
}

function ProgramsAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey:["adm-programs"], queryFn: async () => (await supabase.from("programs").select("*,program_categories(name)").order("created_at",{ascending:false})).data ?? [] });
  const [form, setForm] = useState({ title:"", slug:"", summary:"", duration:"", level:"Foundation", certification:"", price_usd:0 });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("programs").insert(form);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Program created"); setForm({ title:"", slug:"", summary:"", duration:"", level:"Foundation", certification:"", price_usd:0 }); qc.invalidateQueries({ queryKey:["adm-programs"] }); },
    onError: (e:any) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("programs").delete().eq("id",id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey:["adm-programs"] }),
  });

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <form className="rounded-xl border border-border bg-card p-5 space-y-3" onSubmit={e=>{e.preventDefault(); create.mutate();}}>
        <h3 className="font-bold text-navy">New program</h3>
        {(["title","slug","summary","duration","certification"] as const).map(k=>(
          <input key={k} placeholder={k} required value={(form as any)[k]} onChange={e=>setForm({...form,[k]:e.target.value})} className="w-full rounded-md border border-input px-3 py-2 text-sm"/>
        ))}
        <select value={form.level} onChange={e=>setForm({...form,level:e.target.value})} className="w-full rounded-md border border-input px-3 py-2 text-sm">
          {["Foundation","Intermediate","Advanced"].map(l=><option key={l}>{l}</option>)}
        </select>
        <input type="number" min={0} placeholder="Price USD" value={form.price_usd} onChange={e=>setForm({...form,price_usd:Number(e.target.value)})} className="w-full rounded-md border border-input px-3 py-2 text-sm"/>
        <button disabled={create.isPending} className="w-full rounded-md bg-medical text-white py-2.5 text-sm font-semibold">Create</button>
      </form>
      <div className="lg:col-span-2 space-y-2">
        {data?.map((p:any)=>(
          <div key={p.id} className="rounded-lg border border-border bg-card p-4 flex items-center gap-3">
            <div className="flex-1">
              <div className="font-semibold text-navy">{p.title}</div>
              <div className="text-xs text-muted-foreground">{p.program_categories?.name} · {p.duration} · {p.level}</div>
            </div>
            <button onClick={()=>del.mutate(p.id)} className="text-destructive p-2 hover:bg-destructive/10 rounded"><Trash2 className="size-4"/></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ApplicationsAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey:["adm-apps"], queryFn: async () => (await supabase.from("membership_applications").select("*").order("created_at",{ascending:false})).data ?? [] });
  const setStatus = useMutation({
    mutationFn: async ({id,status}:{id:string;status:string}) => { const { error } = await supabase.from("membership_applications").update({status}).eq("id",id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey:["adm-apps"] }),
  });
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-soft text-xs uppercase tracking-wider text-muted-foreground">
          <tr><th className="p-3 text-left">Name</th><th className="text-left">Email</th><th className="text-left">Tier</th><th className="text-left">Country</th><th className="text-left">Status</th><th/></tr>
        </thead>
        <tbody>
          {data?.map((a:any)=>(
            <tr key={a.id} className="border-t border-border">
              <td className="p-3">{a.full_name}</td><td>{a.email}</td><td>{a.tier}</td><td>{a.country}</td>
              <td><span className={`text-xs px-2 py-1 rounded ${a.status==="approved"?"bg-emerald-brand/15 text-emerald-brand":"bg-medical/10 text-medical"}`}>{a.status}</span></td>
              <td className="p-3 text-right">
                <button onClick={()=>setStatus.mutate({id:a.id,status:"approved"})} className="text-xs px-2 py-1 rounded border border-border hover:bg-muted">Approve</button>
              </td>
            </tr>
          ))}
          {!data?.length && <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No applications yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function ContactsAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey:["adm-contacts"], queryFn: async () => (await supabase.from("contacts").select("*").order("created_at",{ascending:false})).data ?? [] });
  const markRead = useMutation({
    mutationFn: async (id:string) => { const { error } = await supabase.from("contacts").update({is_read:true}).eq("id",id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey:["adm-contacts"] }),
  });
  return (
    <div className="space-y-3">
      {data?.map((c:any)=>(
        <div key={c.id} className={`rounded-xl border p-5 ${c.is_read?"border-border bg-card":"border-medical/30 bg-medical/5"}`}>
          <div className="flex justify-between gap-3 flex-wrap">
            <div>
              <div className="font-semibold text-navy">{c.subject || "(no subject)"}</div>
              <div className="text-xs text-muted-foreground">{c.name} · {c.email} · {new Date(c.created_at).toLocaleDateString()}</div>
            </div>
            {!c.is_read && <button onClick={()=>markRead.mutate(c.id)} className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded border border-border hover:bg-muted"><CheckCircle2 className="size-3"/>Mark read</button>}
          </div>
          <p className="mt-3 text-sm text-foreground/80 whitespace-pre-wrap">{c.message}</p>
        </div>
      ))}
      {!data?.length && <div className="text-center text-muted-foreground py-12">No messages yet.</div>}
    </div>
  );
}

function NewsAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey:["adm-news"], queryFn: async () => (await supabase.from("news").select("*").order("created_at",{ascending:false})).data ?? [] });
  const [f, setF] = useState({ title:"", slug:"", excerpt:"", body:"" });
  const create = useMutation({
    mutationFn: async () => { const { error } = await supabase.from("news").insert(f); if (error) throw error; },
    onSuccess: () => { toast.success("Published"); setF({title:"",slug:"",excerpt:"",body:""}); qc.invalidateQueries({ queryKey:["adm-news"] }); },
    onError: (e:any) => toast.error(e.message),
  });
  const del = useMutation({
    mutationFn: async (id:string) => { const { error } = await supabase.from("news").delete().eq("id",id); if (error) throw error; },
    onSuccess: () => qc.invalidateQueries({ queryKey:["adm-news"] }),
  });
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <form className="rounded-xl border border-border bg-card p-5 space-y-3" onSubmit={e=>{e.preventDefault(); create.mutate();}}>
        <h3 className="font-bold text-navy">New post</h3>
        <input required placeholder="Title" value={f.title} onChange={e=>setF({...f,title:e.target.value})} className="w-full rounded-md border border-input px-3 py-2 text-sm"/>
        <input required placeholder="slug-unique" value={f.slug} onChange={e=>setF({...f,slug:e.target.value})} className="w-full rounded-md border border-input px-3 py-2 text-sm"/>
        <textarea placeholder="Excerpt" rows={2} value={f.excerpt} onChange={e=>setF({...f,excerpt:e.target.value})} className="w-full rounded-md border border-input px-3 py-2 text-sm"/>
        <textarea placeholder="Body" rows={5} value={f.body} onChange={e=>setF({...f,body:e.target.value})} className="w-full rounded-md border border-input px-3 py-2 text-sm"/>
        <button disabled={create.isPending} className="w-full rounded-md bg-medical text-white py-2.5 text-sm font-semibold">Publish</button>
      </form>
      <div className="lg:col-span-2 space-y-2">
        {data?.map((n:any)=>(
          <div key={n.id} className="rounded-lg border border-border bg-card p-4 flex items-start gap-3">
            <div className="flex-1">
              <div className="font-semibold text-navy">{n.title}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{new Date(n.created_at).toLocaleDateString()}</div>
              {n.excerpt && <div className="text-sm text-foreground/70 mt-2">{n.excerpt}</div>}
            </div>
            <button onClick={()=>del.mutate(n.id)} className="text-destructive p-2 hover:bg-destructive/10 rounded"><Trash2 className="size-4"/></button>
          </div>
        ))}
      </div>
    </div>
  );
}
