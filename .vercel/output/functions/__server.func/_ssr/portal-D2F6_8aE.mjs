import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { a as useQueryClient, u as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { supabase } from "./client-CZ7d5FUj.mjs";
import { P as PageShell } from "./layout-WOXRQ1YO.mjs";
import { g as getResourceDownloadUrl } from "./resource.functions-BiN06PMx.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { u as LogOut, B as BookOpen, C as Clock, k as CircleCheck, v as Bell, G as GraduationCap, w as User, x as Library, E as ExternalLink } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./router-D6Y-D7l5.mjs";
import "./server-BLoeHK_E.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "./auth-middleware-Y4wvAYDa.mjs";
import "../_libs/zod.mjs";
function Portal() {
  const nav = useNavigate();
  const qc = useQueryClient();
  const [editingProfile, setEditingProfile] = reactExports.useState(false);
  const [profileForm, setProfileForm] = reactExports.useState({
    full_name: "",
    country: "",
    profession: "",
    bio: ""
  });
  const {
    data: user
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => (await supabase.auth.getUser()).data.user
  });
  const {
    data: profile
  } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () => (await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()).data
  });
  const {
    data: roles
  } = useQuery({
    queryKey: ["roles", user?.id],
    enabled: !!user?.id,
    queryFn: async () => (await supabase.from("user_roles").select("role").eq("user_id", user.id)).data ?? []
  });
  const {
    data: programs
  } = useQuery({
    queryKey: ["programs"],
    queryFn: async () => (await supabase.from("programs").select("id,title,slug,summary,duration,level,certification,price_ksh").eq("is_published", true).order("created_at")).data ?? []
  });
  const {
    data: enrollments
  } = useQuery({
    queryKey: ["enrollments", user?.id],
    enabled: !!user?.id,
    queryFn: async () => (await supabase.from("course_enrollments").select("*,programs(title,slug,duration,certification)").eq("user_id", user.id)).data ?? []
  });
  const {
    data: notifications
  } = useQuery({
    queryKey: ["notifications", user?.id],
    enabled: !!user?.id,
    queryFn: async () => (await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", {
      ascending: false
    }).limit(8)).data ?? []
  });
  const enrolledProgramIds = (enrollments ?? []).map((e) => e.program_id);
  const {
    data: resources
  } = useQuery({
    queryKey: ["resources", enrolledProgramIds],
    enabled: enrolledProgramIds.length > 0,
    queryFn: async () => (await supabase.from("resources").select("*,programs(title)").in("program_id", enrolledProgramIds).order("created_at", {
      ascending: false
    })).data ?? []
  });
  const enroll = useMutation({
    mutationFn: async (programId) => {
      const {
        error
      } = await supabase.from("course_enrollments").insert({
        user_id: user.id,
        program_id: programId
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Enrolled — find it under My Programs");
      qc.invalidateQueries({
        queryKey: ["enrollments"]
      });
    },
    onError: (e) => toast.error(e.message ?? "Could not enroll")
  });
  const updateProgress = useMutation({
    mutationFn: async ({
      id,
      progress
    }) => {
      const status = progress >= 100 ? "completed" : "active";
      const completed_at = progress >= 100 ? (/* @__PURE__ */ new Date()).toISOString() : null;
      const {
        error
      } = await supabase.from("course_enrollments").update({
        progress,
        status,
        completed_at
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["enrollments"]
    })
  });
  const markRead = useMutation({
    mutationFn: async (id) => {
      const {
        error
      } = await supabase.from("notifications").update({
        is_read: true
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["notifications"]
    })
  });
  async function openResource(resourceId) {
    const popup = window.open("about:blank", "_blank", "noopener");
    if (!popup) {
      toast.error("Popup blocked. Please allow popups to download resources.");
      return;
    }
    try {
      const {
        downloadUrl
      } = await getResourceDownloadUrl({
        data: {
          resourceId
        }
      });
      popup.location.href = downloadUrl;
    } catch (error) {
      popup.close();
      toast.error(error instanceof Error ? error.message : "Unable to load resource.");
    }
  }
  const saveProfile = useMutation({
    mutationFn: async () => {
      const {
        error
      } = await supabase.from("profiles").update(profileForm).eq("id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profile updated");
      setEditingProfile(false);
      qc.invalidateQueries({
        queryKey: ["profile"]
      });
    },
    onError: (e) => toast.error(e.message)
  });
  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    nav({
      to: "/auth",
      replace: true
    });
  }
  function startEditProfile() {
    setProfileForm({
      full_name: profile?.full_name ?? "",
      country: profile?.country ?? "",
      profession: profile?.profession ?? "",
      bio: profile?.bio ?? ""
    });
    setEditingProfile(true);
  }
  const enrolledIds = new Set((enrollments ?? []).map((e) => e.program_id));
  const completed = (enrollments ?? []).filter((e) => e.status === "completed").length;
  const active = (enrollments ?? []).filter((e) => e.status === "active").length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "hero-mesh text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-5 lg:px-8 py-12 flex flex-wrap items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold uppercase tracking-[0.2em] text-emerald-brand", children: "Welcome back" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-3xl lg:text-4xl font-bold", children: profile?.full_name || user?.email }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-white/70 text-sm", children: [
          profile?.profession || "Student",
          " · ",
          profile?.country || "—"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: signOut, className: "inline-flex items-center gap-1.5 rounded-md bg-white/10 hover:bg-white/15 px-4 py-2.5 text-sm font-semibold border border-white/15", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-4" }),
        "Sign out"
      ] }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-5 lg:px-8 py-10 grid lg:grid-cols-4 gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: BookOpen, label: "Enrolled", value: (enrollments?.length ?? 0).toString() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Clock, label: "In progress", value: active.toString() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: CircleCheck, label: "Completed", value: completed.toString() }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Bell, label: "Notifications", value: (notifications?.filter((n) => !n.is_read).length ?? 0).toString() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-5 lg:px-8 pb-16 grid lg:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-navy", children: "My Programs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 space-y-3", children: [
            !enrollments?.length && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground", children: "No enrollments yet. Browse programs below." }),
            enrollments?.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-navy", children: e.programs?.title }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground mt-0.5", children: [
                    e.programs?.duration,
                    " · ",
                    e.programs?.certification
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${e.status === "completed" ? "bg-emerald-brand/15 text-emerald-brand" : "bg-medical/10 text-medical"}`, children: e.status })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-xs text-muted-foreground mb-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Progress" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    e.progress,
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-gradient-to-r from-medical to-emerald-brand", style: {
                  width: `${e.progress}%`
                } }) })
              ] }),
              e.status !== "completed" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex gap-2", children: [25, 50, 75, 100].map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => updateProgress.mutate({
                id: e.id,
                progress: p
              }), className: "text-xs px-2.5 py-1 rounded border border-border hover:bg-muted", children: [
                "Mark ",
                p,
                "%"
              ] }, p)) })
            ] }, e.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-navy", children: "Browse Programs" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 grid sm:grid-cols-2 gap-4", children: [
            programs?.map((p) => {
              const isEnrolled = enrolledIds.has(p.id);
              return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5 flex flex-col", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 grid place-items-center rounded-lg bg-medical/10 text-medical", children: /* @__PURE__ */ jsxRuntimeExports.jsx(GraduationCap, { className: "size-5" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 font-bold text-navy", children: p.title }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-sm text-foreground/70 flex-1", children: p.summary }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 text-xs text-muted-foreground", children: [
                  p.duration,
                  " · ",
                  p.level,
                  " · KSH ",
                  p.price_ksh?.toLocaleString()
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: isEnrolled || enroll.isPending, onClick: () => enroll.mutate(p.id), className: "mt-4 rounded-md bg-medical text-white px-4 py-2 text-sm font-semibold hover:bg-medical/90 disabled:opacity-60", children: isEnrolled ? "Enrolled" : "Enroll" })
              ] }, p.id);
            }),
            !programs?.length && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground col-span-2", children: "No published programs available yet." })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-navy flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-4" }),
              " Profile"
            ] }),
            !editingProfile && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: startEditProfile, className: "text-xs text-medical hover:underline", children: "Edit" })
          ] }),
          editingProfile ? /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { className: "mt-4 space-y-3", onSubmit: (e) => {
            e.preventDefault();
            saveProfile.mutate();
          }, children: [
            ["full_name", "country", "profession"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: k.replace("_", " "), value: profileForm[k], onChange: (e) => setProfileForm({
              ...profileForm,
              [k]: e.target.value
            }), className: "w-full rounded-md border border-input px-3 py-2 text-sm" }, k)),
            /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { placeholder: "Bio", rows: 3, value: profileForm.bio, onChange: (e) => setProfileForm({
              ...profileForm,
              bio: e.target.value
            }), className: "w-full rounded-md border border-input px-3 py-2 text-sm resize-none" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "submit", disabled: saveProfile.isPending, className: "flex-1 rounded-md bg-medical text-white py-2 text-sm font-semibold", children: "Save" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setEditingProfile(false), className: "flex-1 rounded-md border border-border py-2 text-sm", children: "Cancel" })
            ] })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-4 space-y-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-xs text-muted-foreground", children: "Name" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "font-medium text-navy", children: profile?.full_name || "—" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-xs text-muted-foreground", children: "Profession" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: profile?.profession || "—" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-xs text-muted-foreground", children: "Country" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { children: profile?.country || "—" })
            ] }),
            profile?.bio && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "text-xs text-muted-foreground", children: "Bio" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "text-foreground/75", children: profile.bio })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-navy flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "size-4" }),
            " Notifications"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-3 text-sm", children: [
            !notifications?.length && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-muted-foreground text-xs", children: "You're all caught up." }),
            notifications?.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: `rounded-md p-3 border ${n.is_read ? "bg-muted/40 border-border" : "bg-medical/5 border-medical/20"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-navy text-sm", children: n.title }),
                !n.is_read && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => markRead.mutate(n.id), className: "text-[10px] text-medical hover:underline shrink-0", children: "Mark read" })
              ] }),
              n.body && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground mt-1", children: n.body })
            ] }, n.id))
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-navy flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Library, { className: "size-4" }),
            " Resources"
          ] }),
          !resources?.length ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-2", children: "Enroll in a program to access course materials added by your instructor." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-4 space-y-2 text-sm", children: resources.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-md border border-border p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-medium text-navy", children: r.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              r.programs?.title,
              " · ",
              r.kind
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => openResource(r.id), className: "mt-1 inline-flex items-center gap-1 text-xs text-medical hover:underline", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "size-3" }),
              " Open"
            ] })
          ] }, r.id)) })
        ] })
      ] })
    ] })
  ] });
}
function Stat({
  icon: Icon,
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5 flex items-center gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-lg bg-medical/10 text-medical grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-5" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-navy", children: value }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: label })
    ] })
  ] });
}
export {
  Portal as component
};
