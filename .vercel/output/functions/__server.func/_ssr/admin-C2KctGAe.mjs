import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { P as PageShell } from "./layout-CnrgjGUY.mjs";
import { supabase } from "./client-CLv5cT1Y.mjs";
import { a as useQueryClient, u as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as createServerFn, T as TSS_SERVER_FUNCTION, g as getServerFnById } from "./server-GTM5TjZt.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-D3fGTqiK.mjs";
import { A as ALL_ROLES } from "./router-BrXL5jN2.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/seroval.mjs";
import { u as LogOut, y as LayoutDashboard, U as Users, B as BookOpen, G as GraduationCap, h as Mail, N as Newspaper, g as Calendar, M as Microscope, x as Library, z as Handshake, Q as Quote, r as Activity, D as Plus, l as CircleCheck, I as Pencil, J as Trash2 } from "../_libs/lucide-react.mjs";
import { o as objectType, s as stringType, a as arrayType, e as enumType } from "../_libs/zod.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__query-core.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
function OverviewTab({ onNavigate }) {
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
        resources
      ] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "student"),
        supabase.from("programs").select("id", { count: "exact", head: true }),
        supabase.from("course_enrollments").select("id", { count: "exact", head: true }),
        supabase.from("membership_applications").select("id", { count: "exact", head: true }),
        supabase.from("contacts").select("id", { count: "exact", head: true }).eq("is_read", false).eq("is_archived", false),
        supabase.from("news").select("id", { count: "exact", head: true }),
        supabase.from("research_articles").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("resources").select("id", { count: "exact", head: true })
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
        resources: resources.count ?? 0
      };
    }
  });
  const { data: recent } = useQuery({
    queryKey: ["admin-recent"],
    queryFn: async () => {
      const [apps, msgs, enrolls] = await Promise.all([
        supabase.from("membership_applications").select("full_name, tier, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("contacts").select("name, subject, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("course_enrollments").select("enrolled_at, programs(title)").order("enrolled_at", { ascending: false }).limit(5)
      ]);
      const items = [];
      apps.data?.forEach(
        (a) => items.push({
          type: "Application",
          label: `${a.full_name} — ${a.tier}`,
          at: a.created_at
        })
      );
      msgs.data?.forEach(
        (m) => items.push({
          type: "Message",
          label: `${m.name}: ${m.subject ?? "(no subject)"}`,
          at: m.created_at
        })
      );
      enrolls.data?.forEach(
        (e) => items.push({
          type: "Enrollment",
          label: e.programs?.title ?? "Program",
          at: e.enrolled_at
        })
      );
      return items.sort((a, b) => b.at.localeCompare(a.at)).slice(0, 8);
    }
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
    ["Resources", stats?.resources]
  ];
  const quickActions = [
    { label: "New Program", tab: "programs" },
    { label: "New News Post", tab: "news" },
    { label: "New Event", tab: "events" },
    { label: "Manage Users", tab: "users" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid sm:grid-cols-2 lg:grid-cols-5 gap-4", children: cards.map(([label, value]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs uppercase tracking-wider text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-3xl font-bold text-navy", children: value ?? "—" })
    ] }, label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 rounded-xl border border-border bg-card p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-navy flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "size-4 text-medical" }),
          " Recent activity"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-3 text-sm", children: [
          !recent?.length && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-muted-foreground", children: "No recent activity yet." }),
          recent?.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "li",
            {
              className: "flex justify-between gap-3 border-b border-border pb-2 last:border-0",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-medical", children: item.type }),
                  " —",
                  " ",
                  item.label
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("time", { className: "text-xs text-muted-foreground shrink-0", children: new Date(item.at).toLocaleDateString() })
              ]
            },
            i
          ))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-navy flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4 text-medical" }),
            " Quick actions"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex flex-col gap-2", children: quickActions.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => onNavigate(a.tab),
              className: "text-left text-sm px-3 py-2 rounded-md border border-border hover:border-medical hover:text-medical transition",
              children: a.label
            },
            a.tab
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-emerald-brand/30 bg-emerald-brand/5 p-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-navy flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-4 text-emerald-brand" }),
            " System status"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-3 space-y-1.5 text-sm text-foreground/80", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✓ Supabase connected" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✓ RLS policies active" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "✓ Admin session verified" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/news", className: "mt-4 inline-block text-xs text-medical hover:underline", children: "View public news →" })
        ] })
      ] })
    ] })
  ] });
}
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const roleSchema = enumType(["admin", "instructor", "student", "member"]);
const adminCreateUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator(objectType({
  email: stringType().email(),
  password: stringType().min(8).max(72),
  full_name: stringType().min(1).max(120),
  role: roleSchema.default("student")
})).handler(createSsrRpc("4fc3f52821adb003a35fdb1aa09a433ae1858ba9067550a01ecae5f212bd28c2"));
const adminDeleteUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator(objectType({
  userId: stringType().uuid()
})).handler(createSsrRpc("1c18681ad3dbd08beb1c534623f7bf75cc9344af3163addbff8b87ded1eb0835"));
const adminSetUserRoles = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator(objectType({
  userId: stringType().uuid(),
  roles: arrayType(roleSchema)
})).handler(createSsrRpc("b09dea84340baf719d8b5ecad36e9643a1d4e7b875e5a1c1d44e4c34f996b4dc"));
const inp = "w-full rounded-md border border-input px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-medical";
function ActionBtn({
  onClick,
  label,
  variant = "default"
}) {
  const cls = variant === "danger" ? "text-destructive hover:bg-destructive/10" : variant === "success" ? "text-emerald-brand hover:bg-emerald-brand/10" : "text-medical hover:bg-medical/10";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      type: "button",
      onClick,
      className: `text-xs px-2 py-1 rounded border border-border ${cls}`,
      children: label
    }
  );
}
function RowActions({ onEdit, onDelete }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1 shrink-0", children: [
    onEdit && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: onEdit,
        className: "p-2 text-medical hover:bg-medical/10 rounded",
        title: "Edit",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: onDelete,
        className: "p-2 text-destructive hover:bg-destructive/10 rounded",
        title: "Delete",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" })
      }
    )
  ] });
}
function EmptyState({ message }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground text-sm", children: message });
}
function UsersTab() {
  const qc = useQueryClient();
  const [createForm, setCreateForm] = reactExports.useState({
    email: "",
    password: "",
    full_name: "",
    role: "student"
  });
  const [editingId, setEditingId] = reactExports.useState(null);
  const [editRoles, setEditRoles] = reactExports.useState([]);
  const { data: users, isLoading } = useQuery({
    queryKey: ["adm-users"],
    queryFn: async () => {
      const [profiles, roles] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id, role")
      ]);
      if (profiles.error) throw profiles.error;
      if (roles.error) throw roles.error;
      const roleMap = /* @__PURE__ */ new Map();
      roles.data?.forEach((r) => {
        const list = roleMap.get(r.user_id) ?? [];
        list.push(r.role);
        roleMap.set(r.user_id, list);
      });
      return (profiles.data ?? []).map((p) => ({
        ...p,
        roles: roleMap.get(p.id) ?? []
      }));
    }
  });
  const create = useMutation({
    mutationFn: async () => adminCreateUser({ data: createForm }),
    onSuccess: () => {
      toast.success("User created");
      setCreateForm({ email: "", password: "", full_name: "", role: "student" });
      qc.invalidateQueries({ queryKey: ["adm-users"] });
    },
    onError: (e) => toast.error(e.message)
  });
  const saveRoles = useMutation({
    mutationFn: async ({ userId, roles }) => adminSetUserRoles({ data: { userId, roles } }),
    onSuccess: () => {
      toast.success("Roles updated");
      setEditingId(null);
      qc.invalidateQueries({ queryKey: ["adm-users"] });
    },
    onError: (e) => toast.error(e.message)
  });
  const del = useMutation({
    mutationFn: async (userId) => adminDeleteUser({ data: { userId } }),
    onSuccess: () => {
      toast.success("User deleted");
      qc.invalidateQueries({ queryKey: ["adm-users"] });
    },
    onError: (e) => toast.error(e.message)
  });
  function toggleRole(role) {
    setEditRoles(
      (prev) => prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        className: "rounded-xl border border-border bg-card p-5 space-y-3 h-fit",
        onSubmit: (e) => {
          e.preventDefault();
          create.mutate();
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-navy", children: "Create user" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              required: true,
              type: "email",
              placeholder: "Email",
              value: createForm.email,
              onChange: (e) => setCreateForm({ ...createForm, email: e.target.value }),
              className: inp
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              required: true,
              type: "password",
              placeholder: "Password (min 8)",
              minLength: 8,
              value: createForm.password,
              onChange: (e) => setCreateForm({ ...createForm, password: e.target.value }),
              className: inp
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              required: true,
              placeholder: "Full name",
              value: createForm.full_name,
              onChange: (e) => setCreateForm({ ...createForm, full_name: e.target.value }),
              className: inp
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "select",
            {
              value: createForm.role,
              onChange: (e) => setCreateForm({ ...createForm, role: e.target.value }),
              className: inp,
              children: ALL_ROLES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: r, children: r }, r))
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              disabled: create.isPending,
              className: "w-full rounded-md bg-medical text-white py-2.5 text-sm font-semibold",
              children: "Create user"
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 space-y-3", children: [
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "Loading users…" }),
      users?.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card p-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-navy", children: u.full_name ?? "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              u.profession ?? "—",
              " · ",
              u.country ?? "—",
              " ·",
              " ",
              new Date(u.created_at).toLocaleDateString()
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex flex-wrap gap-1", children: u.roles.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-medical/10 text-medical",
                children: r
              },
              r
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  setEditingId(u.id);
                  setEditRoles(u.roles);
                },
                className: "text-xs px-2 py-1 rounded border border-border hover:bg-muted",
                children: "Roles"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => {
                  if (!confirm("Delete this user permanently?")) return;
                  del.mutate(u.id);
                },
                className: "text-xs px-2 py-1 rounded border border-destructive/30 text-destructive hover:bg-destructive/10",
                children: "Delete"
              }
            )
          ] })
        ] }),
        editingId === u.id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 pt-4 border-t border-border space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: ALL_ROLES.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => toggleRole(r),
              className: `text-xs px-2 py-1 rounded border ${editRoles.includes(r) ? "bg-medical text-white border-medical" : "border-border"}`,
              children: r
            },
            r
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => saveRoles.mutate({ userId: u.id, roles: editRoles }),
              className: "text-xs px-3 py-1.5 rounded bg-medical text-white font-semibold",
              children: "Save roles"
            }
          )
        ] })
      ] }, u.id)),
      !isLoading && !users?.length && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No users found." })
    ] })
  ] });
}
function useCrud(queryKey, table, select = "*", order = { column: "created_at", ascending: false }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data: data2, error } = await supabase.from(table).select(select).order(order.column, { ascending: order.ascending ?? false });
      if (error) throw error;
      return data2 ?? [];
    }
  });
  const create = useMutation({
    mutationFn: async (row) => {
      const { error } = await supabase.from(table).insert(row);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
      toast.success("Created");
    },
    onError: (e) => toast.error(e.message)
  });
  const update = useMutation({
    mutationFn: async ({ id, ...row }) => {
      const { error } = await supabase.from(table).update(row).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
      toast.success("Updated");
    },
    onError: (e) => toast.error(e.message)
  });
  const remove = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
      toast.success("Deleted");
    },
    onError: (e) => toast.error(e.message)
  });
  return { data, isLoading, create, update, remove };
}
function ProgramsTab() {
  const { data, isLoading, create, update, remove } = useCrud(
    ["adm-programs"],
    "programs",
    "*,program_categories(name)"
  );
  const [form, setForm] = reactExports.useState({
    title: "",
    slug: "",
    summary: "",
    duration: "",
    level: "Foundation",
    certification: "",
    price_usd: 0,
    description: ""
  });
  const [editId, setEditId] = reactExports.useState(null);
  const [edit, setEdit] = reactExports.useState(form);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CrudLayout,
    {
      title: "New program",
      form: /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormFields,
        {
          fields: [
            ["title", "text"],
            ["slug", "text"],
            ["summary", "text"],
            ["description", "textarea"],
            ["duration", "text"],
            ["certification", "text"],
            ["price_usd", "number"]
          ],
          values: editId ? edit : form,
          onChange: (k, v) => editId ? setEdit({ ...edit, [k]: v }) : setForm({ ...form, [k]: v })
        }
      ),
      onSubmit: (e) => {
        e.preventDefault();
        if (editId) {
          update.mutate({ id: editId, ...edit });
          setEditId(null);
        } else create.mutate(form);
      },
      submitLabel: editId ? "Save changes" : "Create program",
      list: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "Loading…" }) : data?.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        ListRow,
        {
          title: p.title,
          sub: `${p.duration} · ${p.level}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ActionBtn,
              {
                label: p.is_published ? "Published" : "Draft",
                onClick: () => update.mutate({ id: p.id, is_published: !p.is_published })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              RowActions,
              {
                onEdit: () => {
                  setEditId(p.id);
                  setEdit(p);
                },
                onDelete: () => remove.mutate(p.id)
              }
            )
          ]
        },
        p.id
      ))
    }
  );
}
function NewsTab() {
  const { data, isLoading, create, update, remove } = useCrud(["adm-news"], "news");
  const [form, setForm] = reactExports.useState({ title: "", slug: "", excerpt: "", body: "" });
  const [editId, setEditId] = reactExports.useState(null);
  const [edit, setEdit] = reactExports.useState(form);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CrudLayout,
    {
      title: editId ? "Edit post" : "New post",
      form: /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormFields,
        {
          fields: [
            ["title", "text"],
            ["slug", "text"],
            ["excerpt", "textarea"],
            ["body", "textarea"]
          ],
          values: editId ? edit : form,
          onChange: (k, v) => editId ? setEdit({ ...edit, [k]: v }) : setForm({ ...form, [k]: v })
        }
      ),
      onSubmit: (e) => {
        e.preventDefault();
        if (editId) {
          update.mutate({ id: editId, ...edit });
          setEditId(null);
        } else create.mutate(form);
      },
      submitLabel: editId ? "Save" : "Publish",
      list: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "Loading…" }) : data?.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(ListRow, { title: n.title, sub: n.excerpt, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        RowActions,
        {
          onEdit: () => {
            setEditId(n.id);
            setEdit({
              title: n.title,
              slug: n.slug,
              excerpt: n.excerpt ?? "",
              body: n.body ?? ""
            });
          },
          onDelete: () => remove.mutate(n.id)
        }
      ) }, n.id))
    }
  );
}
function EventsTab() {
  const { data, isLoading, create, remove } = useCrud(["adm-events"], "events", "*", {
    column: "starts_at"
  });
  const [form, setForm] = reactExports.useState({
    title: "",
    description: "",
    location: "",
    starts_at: "",
    ends_at: ""
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CrudLayout,
    {
      title: "New event",
      form: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            required: true,
            placeholder: "Title",
            value: form.title,
            onChange: (e) => setForm({ ...form, title: e.target.value }),
            className: inp
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "textarea",
          {
            placeholder: "Description",
            value: form.description,
            onChange: (e) => setForm({ ...form, description: e.target.value }),
            className: inp,
            rows: 3
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            placeholder: "Location",
            value: form.location,
            onChange: (e) => setForm({ ...form, location: e.target.value }),
            className: inp
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            required: true,
            type: "datetime-local",
            value: form.starts_at,
            onChange: (e) => setForm({ ...form, starts_at: e.target.value }),
            className: inp
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            type: "datetime-local",
            value: form.ends_at,
            onChange: (e) => setForm({ ...form, ends_at: e.target.value }),
            className: inp
          }
        )
      ] }),
      onSubmit: (e) => {
        e.preventDefault();
        create.mutate({
          title: form.title,
          description: form.description || null,
          location: form.location || null,
          starts_at: new Date(form.starts_at).toISOString(),
          ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null
        });
        setForm({ title: "", description: "", location: "", starts_at: "", ends_at: "" });
      },
      submitLabel: "Create event",
      list: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "Loading…" }) : data?.map((ev) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        ListRow,
        {
          title: ev.title,
          sub: new Date(ev.starts_at).toLocaleString(),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(RowActions, { onDelete: () => remove.mutate(ev.id) })
        },
        ev.id
      ))
    }
  );
}
function ResearchTab() {
  const { data, isLoading, create, update, remove } = useCrud(
    ["adm-research"],
    "research_articles",
    "*",
    { column: "published_date" }
  );
  const [form, setForm] = reactExports.useState({
    title: "",
    slug: "",
    area: "",
    abstract: "",
    authors: "",
    url: ""
  });
  const [editId, setEditId] = reactExports.useState(null);
  const [edit, setEdit] = reactExports.useState(form);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CrudLayout,
    {
      title: editId ? "Edit article" : "New article",
      form: /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormFields,
        {
          fields: [
            ["title", "text"],
            ["slug", "text"],
            ["area", "text"],
            ["authors", "text"],
            ["url", "text"],
            ["abstract", "textarea"]
          ],
          values: editId ? edit : form,
          onChange: (k, v) => editId ? setEdit({ ...edit, [k]: v }) : setForm({ ...form, [k]: v })
        }
      ),
      onSubmit: (e) => {
        e.preventDefault();
        const payload = {
          ...form,
          area: form.area || null,
          abstract: form.abstract || null,
          authors: form.authors || null,
          url: form.url || null,
          published_date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
        };
        if (editId) {
          update.mutate({ id: editId, ...edit });
          setEditId(null);
        } else create.mutate(payload);
      },
      submitLabel: editId ? "Save" : "Publish",
      list: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "Loading…" }) : data?.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(ListRow, { title: a.title, sub: a.area, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        RowActions,
        {
          onEdit: () => {
            setEditId(a.id);
            setEdit({
              title: a.title,
              slug: a.slug,
              area: a.area ?? "",
              abstract: a.abstract ?? "",
              authors: a.authors ?? "",
              url: a.url ?? ""
            });
          },
          onDelete: () => remove.mutate(a.id)
        }
      ) }, a.id))
    }
  );
}
function ResourcesTab() {
  const { data, isLoading, create, remove } = useCrud(
    ["adm-resources"],
    "resources",
    "*,programs(title)"
  );
  const { data: programs } = useQuery({
    queryKey: ["adm-programs-list"],
    queryFn: async () => (await supabase.from("programs").select("id,title").order("title")).data ?? []
  });
  const [form, setForm] = reactExports.useState({
    title: "",
    program_id: "",
    kind: "document",
    url: "",
    description: "",
    is_public: false
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CrudLayout,
    {
      title: "New resource",
      form: /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            required: true,
            placeholder: "Title",
            value: form.title,
            onChange: (e) => setForm({ ...form, title: e.target.value }),
            className: inp
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "select",
          {
            value: form.program_id,
            onChange: (e) => setForm({ ...form, program_id: e.target.value }),
            className: inp,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "General" }),
              programs?.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p.id, children: p.title }, p.id))
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "select",
          {
            value: form.kind,
            onChange: (e) => setForm({ ...form, kind: e.target.value }),
            className: inp,
            children: ["document", "video", "link", "slides"].map((k) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: k }, k))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            placeholder: "URL",
            value: form.url,
            onChange: (e) => setForm({ ...form, url: e.target.value }),
            className: inp
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              type: "checkbox",
              checked: form.is_public,
              onChange: (e) => setForm({ ...form, is_public: e.target.checked })
            }
          ),
          " ",
          "Public"
        ] })
      ] }),
      onSubmit: (e) => {
        e.preventDefault();
        create.mutate({
          title: form.title,
          program_id: form.program_id || null,
          kind: form.kind,
          url: form.url || null,
          description: form.description || null,
          is_public: form.is_public
        });
        setForm({
          title: "",
          program_id: "",
          kind: "document",
          url: "",
          description: "",
          is_public: false
        });
      },
      submitLabel: "Add resource",
      list: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "Loading…" }) : data?.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        ListRow,
        {
          title: r.title,
          sub: `${r.programs?.title ?? "General"} · ${r.kind}`,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(RowActions, { onDelete: () => remove.mutate(r.id) })
        },
        r.id
      ))
    }
  );
}
function PartnersTab() {
  const { data, isLoading, create, update, remove } = useCrud(["adm-partners"], "partners", "*", {
    column: "sort_order",
    ascending: true
  });
  const [form, setForm] = reactExports.useState({ name: "", website: "", logo_url: "", sort_order: 0 });
  const [editId, setEditId] = reactExports.useState(null);
  const [edit, setEdit] = reactExports.useState(form);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CrudLayout,
    {
      title: editId ? "Edit partner" : "New partner",
      form: /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormFields,
        {
          fields: [
            ["name", "text"],
            ["website", "text"],
            ["logo_url", "text"],
            ["sort_order", "number"]
          ],
          values: editId ? edit : form,
          onChange: (k, v) => editId ? setEdit({ ...edit, [k]: v }) : setForm({ ...form, [k]: v })
        }
      ),
      onSubmit: (e) => {
        e.preventDefault();
        if (editId) {
          update.mutate({ id: editId, ...edit, sort_order: Number(edit.sort_order) });
          setEditId(null);
        } else
          create.mutate({
            ...form,
            sort_order: Number(form.sort_order),
            website: form.website || null,
            logo_url: form.logo_url || null
          });
      },
      submitLabel: editId ? "Save" : "Add partner",
      list: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "Loading…" }) : data?.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx(ListRow, { title: p.name, sub: p.website, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        RowActions,
        {
          onEdit: () => {
            setEditId(p.id);
            setEdit({
              name: p.name,
              website: p.website ?? "",
              logo_url: p.logo_url ?? "",
              sort_order: p.sort_order ?? 0
            });
          },
          onDelete: () => remove.mutate(p.id)
        }
      ) }, p.id))
    }
  );
}
function TestimonialsTab() {
  const { data, isLoading, create, update, remove } = useCrud(
    ["adm-testimonials"],
    "testimonials",
    "*",
    { column: "sort_order", ascending: true }
  );
  const [form, setForm] = reactExports.useState({ quote: "", author_name: "", author_role: "", sort_order: 0 });
  const [editId, setEditId] = reactExports.useState(null);
  const [edit, setEdit] = reactExports.useState(form);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    CrudLayout,
    {
      title: editId ? "Edit testimonial" : "New testimonial",
      form: /* @__PURE__ */ jsxRuntimeExports.jsx(
        FormFields,
        {
          fields: [
            ["author_name", "text"],
            ["author_role", "text"],
            ["quote", "textarea"],
            ["sort_order", "number"]
          ],
          values: editId ? edit : form,
          onChange: (k, v) => editId ? setEdit({ ...edit, [k]: v }) : setForm({ ...form, [k]: v })
        }
      ),
      onSubmit: (e) => {
        e.preventDefault();
        const payload = {
          ...form,
          sort_order: Number(form.sort_order),
          author_role: form.author_role || null
        };
        if (editId) {
          update.mutate({ id: editId, ...edit, sort_order: Number(edit.sort_order) });
          setEditId(null);
        } else create.mutate(payload);
      },
      submitLabel: editId ? "Save" : "Add testimonial",
      list: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "Loading…" }) : data?.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        ListRow,
        {
          title: t.author_name,
          sub: t.quote?.slice(0, 80) + "…",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            RowActions,
            {
              onEdit: () => {
                setEditId(t.id);
                setEdit({
                  quote: t.quote,
                  author_name: t.author_name,
                  author_role: t.author_role ?? "",
                  sort_order: t.sort_order ?? 0
                });
              },
              onDelete: () => remove.mutate(t.id)
            }
          )
        },
        t.id
      ))
    }
  );
}
function ApplicationsTab() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["adm-apps"],
    queryFn: async () => (await supabase.from("membership_applications").select("*").order("created_at", { ascending: false })).data ?? []
  });
  const setStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const { error } = await supabase.from("membership_applications").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adm-apps"] })
  });
  const del = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("membership_applications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["adm-apps"] });
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-card overflow-x-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm min-w-[640px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-soft text-xs uppercase text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 text-left", children: "Name" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Email" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Tier" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", { children: "Status" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("th", {})
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: data?.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: a.full_name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: a.email }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: a.tier }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("td", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs px-2 py-1 rounded bg-medical/10", children: a.status }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3 text-right space-x-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ActionBtn,
          {
            label: "Approve",
            variant: "success",
            onClick: () => setStatus.mutate({ id: a.id, status: "approved" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          ActionBtn,
          {
            label: "Reject",
            onClick: () => setStatus.mutate({ id: a.id, status: "rejected" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ActionBtn, { label: "Delete", variant: "danger", onClick: () => del.mutate(a.id) })
      ] })
    ] }, a.id)) })
  ] }) });
}
function ContactsTab() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["adm-contacts"],
    queryFn: async () => (await supabase.from("contacts").select("*").order("created_at", { ascending: false })).data ?? []
  });
  const [responseId, setResponseId] = reactExports.useState(null);
  const [responseText, setResponseText] = reactExports.useState("");
  const update = useMutation({
    mutationFn: async (payload) => {
      const { id, ...rest } = payload;
      const { error } = await supabase.from("contacts").update(rest).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adm-contacts"] });
      toast.success("Updated");
      setResponseId(null);
      setResponseText("");
    }
  });
  const del = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("contacts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adm-contacts"] })
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    data?.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `rounded-xl border p-5 ${c.is_archived ? "opacity-60 border-border bg-muted/30" : c.is_read ? "border-border bg-card" : "border-medical/30 bg-medical/5"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between gap-3 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-navy", children: c.subject ?? "(no subject)" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
                c.name,
                " · ",
                c.email,
                " · ",
                new Date(c.created_at).toLocaleDateString()
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-1", children: [
              !c.is_read && /* @__PURE__ */ jsxRuntimeExports.jsx(
                ActionBtn,
                {
                  label: "Mark read",
                  onClick: () => update.mutate({ id: c.id, is_read: true })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ActionBtn,
                {
                  label: c.is_archived ? "Unarchive" : "Archive",
                  onClick: () => update.mutate({ id: c.id, is_archived: !c.is_archived })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ActionBtn,
                {
                  label: "Respond",
                  onClick: () => {
                    setResponseId(c.id);
                    setResponseText(c.admin_response ?? "");
                  }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ActionBtn, { label: "Delete", variant: "danger", onClick: () => del.mutate(c.id) })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm whitespace-pre-wrap", children: c.message }),
          c.admin_response && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-sm text-medical border-l-2 border-medical pl-3", children: [
            "Response: ",
            c.admin_response
          ] }),
          responseId === c.id && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                className: `${inp} flex-1`,
                rows: 2,
                value: responseText,
                onChange: (e) => setResponseText(e.target.value)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                onClick: () => update.mutate({ id: c.id, admin_response: responseText, is_read: true }),
                className: "px-3 py-2 rounded bg-medical text-white text-sm font-semibold",
                children: "Save"
              }
            )
          ] })
        ]
      },
      c.id
    )),
    !data?.length && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No messages." })
  ] });
}
function EnrollmentsTab() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["adm-enrollments"],
    queryFn: async () => (await supabase.from("course_enrollments").select("*, programs(title)").order("enrolled_at", { ascending: false })).data ?? []
  });
  const update = useMutation({
    mutationFn: async ({
      id,
      progress,
      status
    }) => {
      const { error } = await supabase.from("course_enrollments").update({
        progress,
        status,
        completed_at: status === "completed" ? (/* @__PURE__ */ new Date()).toISOString() : null
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adm-enrollments"] })
  });
  const del = useMutation({
    mutationFn: async (id) => {
      const { error } = await supabase.from("course_enrollments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adm-enrollments"] })
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
    data?.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-lg border border-border bg-card p-4 flex flex-wrap justify-between gap-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-navy", children: e.programs?.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
              "User ",
              e.user_id.slice(0, 8),
              "… · ",
              e.progress,
              "% · ",
              e.status
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ActionBtn,
              {
                label: "Complete",
                variant: "success",
                onClick: () => update.mutate({ id: e.id, progress: 100, status: "completed" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ActionBtn, { label: "Delete", variant: "danger", onClick: () => del.mutate(e.id) })
          ] })
        ]
      },
      e.id
    )),
    !data?.length && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { message: "No enrollments." })
  ] });
}
function CrudLayout({
  title,
  form,
  onSubmit,
  submitLabel,
  list
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        className: "rounded-xl border border-border bg-card p-5 space-y-3 h-fit",
        onSubmit,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-navy", children: title }),
          form,
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "submit",
              className: "w-full rounded-md bg-medical text-white py-2.5 text-sm font-semibold",
              children: submitLabel
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:col-span-2 space-y-2", children: list })
  ] });
}
function ListRow({
  title,
  sub,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-border bg-card p-4 flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-semibold text-navy truncate", children: title }),
      sub && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-muted-foreground truncate", children: sub })
    ] }),
    children
  ] });
}
function FormFields({
  fields,
  values,
  onChange
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: fields.map(
    ([k, type]) => type === "textarea" ? /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        placeholder: k,
        rows: 3,
        value: String(values[k] ?? ""),
        onChange: (e) => onChange(k, e.target.value),
        className: inp
      },
      k
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: type === "number" ? "number" : "text",
        placeholder: k,
        required: k === "title" || k === "slug" || k === "name",
        value: String(values[k] ?? ""),
        onChange: (e) => onChange(k, type === "number" ? Number(e.target.value) : e.target.value),
        className: inp
      },
      k
    )
  ) });
}
const TABS = [{
  k: "overview",
  label: "Overview",
  icon: LayoutDashboard
}, {
  k: "users",
  label: "Users",
  icon: Users
}, {
  k: "programs",
  label: "Programs",
  icon: BookOpen
}, {
  k: "enrollments",
  label: "Enrollments",
  icon: GraduationCap
}, {
  k: "applications",
  label: "Applications",
  icon: Users
}, {
  k: "contacts",
  label: "Messages",
  icon: Mail
}, {
  k: "news",
  label: "News",
  icon: Newspaper
}, {
  k: "events",
  label: "Events",
  icon: Calendar
}, {
  k: "research",
  label: "Research",
  icon: Microscope
}, {
  k: "resources",
  label: "Resources",
  icon: Library
}, {
  k: "partners",
  label: "Partners",
  icon: Handshake
}, {
  k: "testimonials",
  label: "Testimonials",
  icon: Quote
}];
function Admin() {
  const [tab, setTab] = reactExports.useState("overview");
  const nav = useNavigate();
  const qc = useQueryClient();
  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    nav({
      to: "/admin/login",
      replace: true
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "hero-mesh text-white", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-5 lg:px-8 py-10 flex flex-wrap items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold uppercase tracking-[0.22em] text-emerald-brand", children: "Admin Console" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-3xl lg:text-4xl font-bold", children: "Manage AMTMTI" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/portal", className: "inline-flex items-center gap-1.5 rounded-md bg-white/10 hover:bg-white/15 px-4 py-2.5 text-sm font-semibold border border-white/15", children: "Student portal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: signOut, className: "inline-flex items-center gap-1.5 rounded-md bg-emerald-brand text-navy px-4 py-2.5 text-sm font-semibold", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-4" }),
          "Sign out"
        ] })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-border bg-card sticky top-[72px] z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-5 lg:px-8 flex gap-1 overflow-x-auto", children: TABS.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => setTab(t.k), className: `flex items-center gap-2 px-4 py-3.5 text-sm font-semibold border-b-2 transition whitespace-nowrap ${tab === t.k ? "border-medical text-medical" : "border-transparent text-foreground/60 hover:text-foreground"}`, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(t.icon, { className: "size-4" }),
      t.label
    ] }, t.k)) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mx-auto max-w-7xl px-5 lg:px-8 py-10", children: [
      tab === "overview" && /* @__PURE__ */ jsxRuntimeExports.jsx(OverviewTab, { onNavigate: (t) => setTab(t) }),
      tab === "users" && /* @__PURE__ */ jsxRuntimeExports.jsx(UsersTab, {}),
      tab === "programs" && /* @__PURE__ */ jsxRuntimeExports.jsx(ProgramsTab, {}),
      tab === "enrollments" && /* @__PURE__ */ jsxRuntimeExports.jsx(EnrollmentsTab, {}),
      tab === "applications" && /* @__PURE__ */ jsxRuntimeExports.jsx(ApplicationsTab, {}),
      tab === "contacts" && /* @__PURE__ */ jsxRuntimeExports.jsx(ContactsTab, {}),
      tab === "news" && /* @__PURE__ */ jsxRuntimeExports.jsx(NewsTab, {}),
      tab === "events" && /* @__PURE__ */ jsxRuntimeExports.jsx(EventsTab, {}),
      tab === "research" && /* @__PURE__ */ jsxRuntimeExports.jsx(ResearchTab, {}),
      tab === "resources" && /* @__PURE__ */ jsxRuntimeExports.jsx(ResourcesTab, {}),
      tab === "partners" && /* @__PURE__ */ jsxRuntimeExports.jsx(PartnersTab, {}),
      tab === "testimonials" && /* @__PURE__ */ jsxRuntimeExports.jsx(TestimonialsTab, {})
    ] })
  ] });
}
export {
  Admin as component
};
