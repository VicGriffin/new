import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database, TablesUpdate } from "@/integrations/supabase/types";
import { adminCreateResource, adminDeleteResource } from "@/lib/api/resource.functions";
import { toast } from "sonner";
import { inp, RowActions, EmptyState, ActionBtn } from "./shared";

type TableName = keyof Database["public"]["Tables"];

function useCrud<T extends { id: string }>(
  queryKey: string[],
  table: TableName,
  select = "*",
  order: { column: string; ascending?: boolean } = { column: "created_at", ascending: false },
) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from(table)
        .select(select)
        .order(order.column, { ascending: order.ascending ?? false });
      if (error) throw error;
      return (data ?? []) as unknown as T[];
    },
  });
  const create = useMutation({
    mutationFn: async (row: Record<string, unknown>) => {
      const { error } = await supabase.from(table).insert(row as never);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
      toast.success("Created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const update = useMutation({
    mutationFn: async ({ id, ...row }: { id: string } & Record<string, unknown>) => {
      const { error } = await supabase
        .from(table)
        .update(row as never)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
      toast.success("Updated");
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey });
      toast.success("Deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return { data, isLoading, create, update, remove };
}

function parseLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

async function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Unable to read file."));
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// ─── Programs ───────────────────────────────────────────────────────────────
export function ProgramsTab() {
  const { data, isLoading, create, update, remove } = useCrud(
    ["adm-programs"],
    "programs",
    "*,program_categories(name)",
  );
  const [form, setForm] = useState({
    title: "",
    slug: "",
    summary: "",
    description: "",
    duration: "",
    level: "Foundation",
    mode: "Online",
    certification: "",
    price_ksh: 0,
    cover_url: "",
    apply_link: "",
    learning_outcomes: "",
    requirements: "",
    curriculum: "",
    pdf_url: "",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [edit, setEdit] = useState(form);

  return (
    <CrudLayout
      title="New program"
      form={
        <FormFields
          fields={[
            ["title", "text"],
            ["slug", "text"],
            ["summary", "text"],
            ["description", "textarea"],
            ["duration", "text"],
            ["mode", "text"],
            ["certification", "text"],
            ["price_ksh", "number"],
            ["cover_url", "text"],
            ["apply_link", "text"],
            ["learning_outcomes", "textarea"],
            ["requirements", "textarea"],
            ["curriculum", "textarea"],
            ["pdf_url", "text"],
          ]}
          values={editId ? edit : form}
          onChange={(k, v) =>
            editId ? setEdit({ ...edit, [k]: v }) : setForm({ ...form, [k]: v })
          }
        />
      }
      onSubmit={(e) => {
        e.preventDefault();
        const activeForm = (editId ? edit : form) as typeof form;
        let curriculum: unknown = null;
        if (activeForm.curriculum.trim()) {
          try {
            curriculum = JSON.parse(activeForm.curriculum);
          } catch (error) {
            toast.error("Curriculum must be valid JSON.");
            return;
          }
        }

        const payload = {
          ...activeForm,
          cover_url: activeForm.cover_url || null,
          apply_link: activeForm.apply_link || null,
          learning_outcomes: parseLines(activeForm.learning_outcomes),
          requirements: parseLines(activeForm.requirements),
          curriculum,
          pdf_url: activeForm.pdf_url || null,
        };
        if (editId) {
          update.mutate({ id: editId, ...payload });
          setEditId(null);
        } else create.mutate(payload);
      }}
      submitLabel={editId ? "Save changes" : "Create program"}
      list={
        isLoading ? (
          <EmptyState message="Loading…" />
        ) : (
          data?.map((p: Record<string, unknown>) => (
            <ListRow
              key={p.id as string}
              title={p.title as string}
              sub={`${p.duration} · ${p.level}`}
            >
              <ActionBtn
                label={p.is_published ? "Published" : "Draft"}
                onClick={() => update.mutate({ id: p.id as string, is_published: !p.is_published })}
              />
              <RowActions
                onEdit={() => {
                  setEditId(p.id as string);
                  setEdit({
                    title: p.title as string,
                    slug: p.slug as string,
                    summary: (p.summary as string) ?? "",
                    description: (p.description as string) ?? "",
                    duration: (p.duration as string) ?? "",
                    level: (p.level as string) ?? "Foundation",
                    mode: (p.mode as string) ?? "Online",
                    certification: (p.certification as string) ?? "",
                    price_ksh: (p.price_ksh as number) ?? 0,
                    cover_url: (p.cover_url as string) ?? "",
                    apply_link: (p.apply_link as string) ?? "",
                    learning_outcomes: Array.isArray(p.learning_outcomes)
                      ? (p.learning_outcomes as string[]).join("\n")
                      : "",
                    requirements: Array.isArray(p.requirements)
                      ? (p.requirements as string[]).join("\n")
                      : "",
                    curriculum: p.curriculum ? JSON.stringify(p.curriculum, null, 2) : "",
                    pdf_url: (p.pdf_url as string) ?? "",
                  });
                }}
                onDelete={() => remove.mutate(p.id as string)}
              />
            </ListRow>
          ))
        )
      }
    />
  );
}

// ─── News ───────────────────────────────────────────────────────────────────
export function NewsTab() {
  const { data, isLoading, create, update, remove } = useCrud(["adm-news"], "news");
  const [form, setForm] = useState({ title: "", slug: "", excerpt: "", body: "", cover_url: "" });
  const [editId, setEditId] = useState<string | null>(null);
  const [edit, setEdit] = useState(form);

  return (
    <CrudLayout
      title={editId ? "Edit post" : "New post"}
      form={
        <FormFields
          fields={[
            ["title", "text"],
            ["slug", "text"],
            ["excerpt", "textarea"],
            ["cover_url", "text"],
            ["body", "textarea"],
          ]}
          values={editId ? edit : form}
          onChange={(k, v) =>
            editId ? setEdit({ ...edit, [k]: v }) : setForm({ ...form, [k]: v })
          }
        />
      }
      onSubmit={(e) => {
        e.preventDefault();
        if (editId) {
          update.mutate({ id: editId, ...edit });
          setEditId(null);
        } else create.mutate(form);
      }}
      submitLabel={editId ? "Save" : "Publish"}
      list={
        isLoading ? (
          <EmptyState message="Loading…" />
        ) : (
          data?.map((n: Record<string, unknown>) => (
            <ListRow key={n.id as string} title={n.title as string} sub={n.excerpt as string}>
              <RowActions
                onEdit={() => {
                  setEditId(n.id as string);
                  setEdit({
                    title: n.title as string,
                    slug: n.slug as string,
                    excerpt: (n.excerpt as string) ?? "",
                    cover_url: (n.cover_url as string) ?? "",
                    body: (n.body as string) ?? "",
                  });
                }}
                onDelete={() => remove.mutate(n.id as string)}
              />
            </ListRow>
          ))
        )
      }
    />
  );
}

// ─── Events ─────────────────────────────────────────────────────────────────
export function EventsTab() {
  const { data, isLoading, create, update, remove } = useCrud(["adm-events"], "events", "*", {
    column: "starts_at",
  });
  const [form, setForm] = useState({
    title: "",
    description: "",
    cover_url: "",
    location: "",
    starts_at: "",
    ends_at: "",
  });

  return (
    <CrudLayout
      title="New event"
      form={
        <>
          <input
            required
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inp}
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={inp}
            rows={3}
          />
          <input
            placeholder="Cover image URL"
            value={form.cover_url}
            onChange={(e) => setForm({ ...form, cover_url: e.target.value })}
            className={inp}
          />
          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className={inp}
          />
          <input
            required
            type="datetime-local"
            value={form.starts_at}
            onChange={(e) => setForm({ ...form, starts_at: e.target.value })}
            className={inp}
          />
          <input
            type="datetime-local"
            value={form.ends_at}
            onChange={(e) => setForm({ ...form, ends_at: e.target.value })}
            className={inp}
          />
        </>
      }
      onSubmit={(e) => {
        e.preventDefault();
        create.mutate({
          title: form.title,
          description: form.description || null,
          cover_url: form.cover_url || null,
          location: form.location || null,
          starts_at: new Date(form.starts_at).toISOString(),
          ends_at: form.ends_at ? new Date(form.ends_at).toISOString() : null,
        });
        setForm({ title: "", description: "", cover_url: "", location: "", starts_at: "", ends_at: "" });
      }}
      submitLabel="Create event"
      list={
        isLoading ? (
          <EmptyState message="Loading…" />
        ) : (
          data?.map((ev: Record<string, unknown>) => (
            <ListRow
              key={ev.id as string}
              title={ev.title as string}
              sub={new Date(ev.starts_at as string).toLocaleString()}
            >
              <RowActions onDelete={() => remove.mutate(ev.id as string)} />
            </ListRow>
          ))
        )
      }
    />
  );
}

// ─── Research ───────────────────────────────────────────────────────────────
export function ResearchTab() {
  const { data, isLoading, create, update, remove } = useCrud(
    ["adm-research"],
    "research_articles",
    "*",
    { column: "published_date" },
  );
  const [form, setForm] = useState({
    title: "",
    slug: "",
    area: "",
    abstract: "",
    authors: "",
    url: "",
    cover_url: "",
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [edit, setEdit] = useState(form);

  return (
    <CrudLayout
      title={editId ? "Edit article" : "New article"}
      form={
        <FormFields
          fields={[
            ["title", "text"],
            ["slug", "text"],
            ["area", "text"],
            ["authors", "text"],
            ["url", "text"],
            ["cover_url", "text"],
            ["abstract", "textarea"],
          ]}
          values={editId ? edit : form}
          onChange={(k, v) =>
            editId ? setEdit({ ...edit, [k]: v }) : setForm({ ...form, [k]: v })
          }
        />
      }
      onSubmit={(e) => {
        e.preventDefault();
        const payload = {
          ...form,
          area: form.area || null,
          abstract: form.abstract || null,
          authors: form.authors || null,
          url: form.url || null,
          cover_url: form.cover_url || null,
          published_date: new Date().toISOString().slice(0, 10),
        };
        if (editId) {
          update.mutate({ id: editId, ...edit });
          setEditId(null);
        } else create.mutate(payload);
      }}
      submitLabel={editId ? "Save" : "Publish"}
      list={
        isLoading ? (
          <EmptyState message="Loading…" />
        ) : (
          data?.map((a: Record<string, unknown>) => (
            <ListRow key={a.id as string} title={a.title as string} sub={a.area as string}>
              <RowActions
                onEdit={() => {
                  setEditId(a.id as string);
                  setEdit({
                    title: a.title as string,
                    slug: a.slug as string,
                    area: (a.area as string) ?? "",
                    abstract: (a.abstract as string) ?? "",
                    authors: (a.authors as string) ?? "",
                    url: (a.url as string) ?? "",
                    cover_url: (a.cover_url as string) ?? "",
                  });
                }}
                onDelete={() => remove.mutate(a.id as string)}
              />
            </ListRow>
          ))
        )
      }
    />
  );
}

// ─── Resources ──────────────────────────────────────────────────────────────
export function ResourcesTab() {
  const qc = useQueryClient();
  const { data, isLoading } = useCrud([
    "adm-resources",
  ], "resources", "*,programs(title)");
  const { data: programs } = useQuery({
    queryKey: ["adm-programs-list"],
    queryFn: async () =>
      (await supabase.from("programs").select("id,title").order("title")).data ?? [],
  });
  const [form, setForm] = useState({
    title: "",
    program_id: "",
    kind: "document",
    url: "",
    description: "",
    is_public: false,
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  type ResourceCreateInput = {
    title: string;
    program_id: string | null;
    kind: "document" | "video" | "link" | "slides";
    url: string | null;
    description: string | null;
    is_public: boolean;
    file_name?: string;
    content_type?: string;
    file_data?: string;
  };

  const createResource = useMutation({
    mutationFn: async (payload: ResourceCreateInput) => {
      await adminCreateResource({ data: payload });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adm-resources"] });
      toast.success("Created");
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const deleteResource = useMutation({
    mutationFn: async (resourceId: string) => {
      await adminDeleteResource({ data: { resourceId } });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adm-resources"] });
      toast.success("Deleted");
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <CrudLayout
      title="New resource"
      form={
        <>
          <input
            required
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inp}
          />
          <select
            value={form.program_id}
            onChange={(e) => setForm({ ...form, program_id: e.target.value })}
            className={inp}
          >
            <option value="">General</option>
            {programs?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
          <select
            value={form.kind}
            onChange={(e) => {
              setForm({ ...form, kind: e.target.value, url: "" });
              setSelectedFile(null);
            }}
            className={inp}
          >
            {["document", "video", "link", "slides"].map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
          {form.kind === "document" ? (
            <>
              <label className="text-sm text-muted-foreground">Upload document</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                className={inp}
              />
              {selectedFile && (
                <div className="text-sm text-muted-foreground">Selected: {selectedFile.name}</div>
              )}
            </>
          ) : (
            <input
              placeholder="Resource link"
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              className={inp}
            />
          )}
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={inp}
            rows={3}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.is_public}
              onChange={(e) => setForm({ ...form, is_public: e.target.checked })}
            />{" "}
            Public
          </label>
        </>
      }
      onSubmit={async (e) => {
        e.preventDefault();

        if (form.kind === "document" && !selectedFile) {
          toast.error("Please upload a document file.");
          return;
        }

        const payload: ResourceCreateInput = {
          title: form.title,
          program_id: form.program_id || null,
          kind: form.kind as ResourceCreateInput["kind"],
          url: form.kind === "document" ? null : form.url || null,
          description: form.description || null,
          is_public: form.is_public,
        };

        if (form.kind === "document" && selectedFile) {
          payload.file_data = await readFileAsDataUrl(selectedFile);
          payload.file_name = selectedFile.name;
          payload.content_type = selectedFile.type || "application/octet-stream";
        }

        createResource.mutate(payload);
        setForm({
          title: "",
          program_id: "",
          kind: "document",
          url: "",
          description: "",
          is_public: false,
        });
        setSelectedFile(null);
      }}
      submitLabel="Add resource"
      list={
        isLoading ? (
          <EmptyState message="Loading…" />
        ) : (
          data?.map((r: Record<string, unknown>) => (
            <ListRow
              key={r.id as string}
              title={r.title as string}
              sub={`${(r.programs as { title: string } | null)?.title ?? "General"} · ${r.kind}${
                r.kind === "document" ? ` · ${(r.file_name as string) ?? "Uploaded document"}` : ""
              }`}
            >
              <RowActions onDelete={() => deleteResource.mutate(r.id as string)} />
            </ListRow>
          ))
        )
      }
    />
  );
}

// ─── Partners ───────────────────────────────────────────────────────────────
export function PartnersTab() {
  const { data, isLoading, create, update, remove } = useCrud(["adm-partners"], "partners", "*", {
    column: "sort_order",
    ascending: true,
  });
  const [form, setForm] = useState({ name: "", website: "", logo_url: "", sort_order: 0 });
  const [editId, setEditId] = useState<string | null>(null);
  const [edit, setEdit] = useState(form);

  return (
    <CrudLayout
      title={editId ? "Edit partner" : "New partner"}
      form={
        <FormFields
          fields={[
            ["name", "text"],
            ["website", "text"],
            ["logo_url", "text"],
            ["sort_order", "number"],
          ]}
          values={editId ? edit : form}
          onChange={(k, v) =>
            editId ? setEdit({ ...edit, [k]: v }) : setForm({ ...form, [k]: v })
          }
        />
      }
      onSubmit={(e) => {
        e.preventDefault();
        if (editId) {
          update.mutate({ id: editId, ...edit, sort_order: Number(edit.sort_order) });
          setEditId(null);
        } else
          create.mutate({
            ...form,
            sort_order: Number(form.sort_order),
            website: form.website || null,
            logo_url: form.logo_url || null,
          });
      }}
      submitLabel={editId ? "Save" : "Add partner"}
      list={
        isLoading ? (
          <EmptyState message="Loading…" />
        ) : (
          data?.map((p: Record<string, unknown>) => (
            <ListRow key={p.id as string} title={p.name as string} sub={p.website as string}>
              <RowActions
                onEdit={() => {
                  setEditId(p.id as string);
                  setEdit({
                    name: p.name as string,
                    website: (p.website as string) ?? "",
                    logo_url: (p.logo_url as string) ?? "",
                    sort_order: (p.sort_order as number) ?? 0,
                  });
                }}
                onDelete={() => remove.mutate(p.id as string)}
              />
            </ListRow>
          ))
        )
      }
    />
  );
}

// ─── Testimonials ───────────────────────────────────────────────────────────
export function TestimonialsTab() {
  const { data, isLoading, create, update, remove } = useCrud(
    ["adm-testimonials"],
    "testimonials",
    "*",
    { column: "sort_order", ascending: true },
  );
  const [form, setForm] = useState({ quote: "", author_name: "", author_role: "", sort_order: 0 });
  const [editId, setEditId] = useState<string | null>(null);
  const [edit, setEdit] = useState(form);

  return (
    <CrudLayout
      title={editId ? "Edit testimonial" : "New testimonial"}
      form={
        <FormFields
          fields={[
            ["author_name", "text"],
            ["author_role", "text"],
            ["quote", "textarea"],
            ["sort_order", "number"],
          ]}
          values={editId ? edit : form}
          onChange={(k, v) =>
            editId ? setEdit({ ...edit, [k]: v }) : setForm({ ...form, [k]: v })
          }
        />
      }
      onSubmit={(e) => {
        e.preventDefault();
        const payload = {
          ...form,
          sort_order: Number(form.sort_order),
          author_role: form.author_role || null,
        };
        if (editId) {
          update.mutate({ id: editId, ...edit, sort_order: Number(edit.sort_order) });
          setEditId(null);
        } else create.mutate(payload);
      }}
      submitLabel={editId ? "Save" : "Add testimonial"}
      list={
        isLoading ? (
          <EmptyState message="Loading…" />
        ) : (
          data?.map((t: Record<string, unknown>) => (
            <ListRow
              key={t.id as string}
              title={t.author_name as string}
              sub={(t.quote as string)?.slice(0, 80) + "…"}
            >
              <RowActions
                onEdit={() => {
                  setEditId(t.id as string);
                  setEdit({
                    quote: t.quote as string,
                    author_name: t.author_name as string,
                    author_role: (t.author_role as string) ?? "",
                    sort_order: (t.sort_order as number) ?? 0,
                  });
                }}
                onDelete={() => remove.mutate(t.id as string)}
              />
            </ListRow>
          ))
        )
      }
    />
  );
}

// ─── Applications ───────────────────────────────────────────────────────────
export function ApplicationsTab() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["adm-apps"],
    queryFn: async () =>
      (
        await supabase
          .from("membership_applications")
          .select("*")
          .order("created_at", { ascending: false })
      ).data ?? [],
  });
  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("membership_applications")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adm-apps"] }),
  });
  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("membership_applications").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey: ["adm-apps"] });
    },
  });

  return (
    <div className="rounded-xl border border-border bg-card overflow-x-auto">
      <table className="w-full text-sm min-w-[640px]">
        <thead className="bg-soft text-xs uppercase text-muted-foreground">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th>Email</th>
            <th>Tier</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {data?.map((a) => (
            <tr key={a.id} className="border-t border-border">
              <td className="p-3">{a.full_name}</td>
              <td>{a.email}</td>
              <td>{a.tier}</td>
              <td>
                <span className="text-xs px-2 py-1 rounded bg-medical/10">{a.status}</span>
              </td>
              <td className="p-3 text-right space-x-1">
                <ActionBtn
                  label="Approve"
                  variant="success"
                  onClick={() => setStatus.mutate({ id: a.id, status: "approved" })}
                />
                <ActionBtn
                  label="Reject"
                  onClick={() => setStatus.mutate({ id: a.id, status: "rejected" })}
                />
                <ActionBtn label="Delete" variant="danger" onClick={() => del.mutate(a.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Contacts ───────────────────────────────────────────────────────────────
export function ContactsTab() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["adm-contacts"],
    queryFn: async () =>
      (await supabase.from("contacts").select("*").order("created_at", { ascending: false }))
        .data ?? [],
  });
  const [responseId, setResponseId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");

  const update = useMutation({
    mutationFn: async (payload: { id: string } & TablesUpdate<"contacts">) => {
      const { id, ...rest } = payload;
      const { error } = await supabase.from("contacts").update(rest).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["adm-contacts"] });
      toast.success("Updated");
      setResponseId(null);
      setResponseText("");
    },
  });
  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contacts").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adm-contacts"] }),
  });

  return (
    <div className="space-y-3">
      {data?.map((c) => (
        <div
          key={c.id}
          className={`rounded-xl border p-5 ${c.is_archived ? "opacity-60 border-border bg-muted/30" : c.is_read ? "border-border bg-card" : "border-medical/30 bg-medical/5"}`}
        >
          <div className="flex justify-between gap-3 flex-wrap">
            <div>
              <div className="font-semibold text-navy">{c.subject ?? "(no subject)"}</div>
              <div className="text-xs text-muted-foreground">
                {c.name} · {c.email} · {new Date(c.created_at).toLocaleDateString()}
              </div>
            </div>
            <div className="flex flex-wrap gap-1">
              {!c.is_read && (
                <ActionBtn
                  label="Mark read"
                  onClick={() => update.mutate({ id: c.id, is_read: true })}
                />
              )}
              <ActionBtn
                label={c.is_archived ? "Unarchive" : "Archive"}
                onClick={() => update.mutate({ id: c.id, is_archived: !c.is_archived })}
              />
              <ActionBtn
                label="Respond"
                onClick={() => {
                  setResponseId(c.id);
                  setResponseText(c.admin_response ?? "");
                }}
              />
              <ActionBtn label="Delete" variant="danger" onClick={() => del.mutate(c.id)} />
            </div>
          </div>
          <p className="mt-3 text-sm whitespace-pre-wrap">{c.message}</p>
          {c.admin_response && (
            <p className="mt-2 text-sm text-medical border-l-2 border-medical pl-3">
              Response: {c.admin_response}
            </p>
          )}
          {responseId === c.id && (
            <div className="mt-3 flex gap-2">
              <textarea
                className={`${inp} flex-1`}
                rows={2}
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
              />
              <button
                type="button"
                onClick={() =>
                  update.mutate({ id: c.id, admin_response: responseText, is_read: true })
                }
                className="px-3 py-2 rounded bg-medical text-white text-sm font-semibold"
              >
                Save
              </button>
            </div>
          )}
        </div>
      ))}
      {!data?.length && <EmptyState message="No messages." />}
    </div>
  );
}

// ─── Enrollments ──────────────────────────────────────────────────────────────
export function EnrollmentsTab() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["adm-enrollments"],
    queryFn: async () =>
      (
        await supabase
          .from("course_enrollments")
          .select("*, programs(title)")
          .order("enrolled_at", { ascending: false })
      ).data ?? [],
  });
  const update = useMutation({
    mutationFn: async ({
      id,
      progress,
      status,
    }: {
      id: string;
      progress?: number;
      status: string;
    }) => {
      const payload: {
        progress?: number;
        status: string;
        completed_at: string | null;
      } = {
        status,
        completed_at: status === "completed" ? new Date().toISOString() : null,
      };
      if (typeof progress === "number") payload.progress = progress;
      if (status === "completed" && typeof progress !== "number") payload.progress = 100;

      const { error } = await supabase
        .from("course_enrollments")
        .update(payload as { progress?: number; status: string; completed_at: string | null })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adm-enrollments"] }),
  });
  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("course_enrollments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["adm-enrollments"] }),
  });

  return (
    <div className="space-y-2">
      {data?.map((e) => (
        <div
          key={e.id}
          className="rounded-lg border border-border bg-card p-4 flex flex-wrap justify-between gap-3"
        >
          <div>
            <div className="font-semibold text-navy">
              {(e.programs as { title: string } | null)?.title}
            </div>
            <div className="text-xs text-muted-foreground">
              User {e.user_id.slice(0, 8)}… · {e.progress}% · {e.status}
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {e.status !== "approved" && (
              <ActionBtn
                label="Approve"
                variant="success"
                onClick={() => update.mutate({ id: e.id, status: "approved" })}
              />
            )}
            {e.status !== "rejected" && (
              <ActionBtn
                label="Reject"
                variant="danger"
                onClick={() => update.mutate({ id: e.id, status: "rejected" })}
              />
            )}
            <ActionBtn
              label="Complete"
              onClick={() => update.mutate({ id: e.id, progress: 100, status: "completed" })}
              variant="success"
            />
            <ActionBtn label="Delete" variant="danger" onClick={() => del.mutate(e.id)} />
          </div>
        </div>
      ))}
      {!data?.length && <EmptyState message="No enrollments." />}
    </div>
  );
}

// ─── Shared layout helpers ──────────────────────────────────────────────────
function CrudLayout({
  title,
  form,
  onSubmit,
  submitLabel,
  list,
}: {
  title: string;
  form: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel: string;
  list: React.ReactNode;
}) {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <form
        className="rounded-xl border border-border bg-card p-5 space-y-3 h-fit"
        onSubmit={onSubmit}
      >
        <h3 className="font-bold text-navy">{title}</h3>
        {form}
        <button
          type="submit"
          className="w-full rounded-md bg-medical text-white py-2.5 text-sm font-semibold"
        >
          {submitLabel}
        </button>
      </form>
      <div className="lg:col-span-2 space-y-2">{list}</div>
    </div>
  );
}

function ListRow({
  title,
  sub,
  children,
}: {
  title: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-navy truncate">{title}</div>
        {sub && <div className="text-xs text-muted-foreground truncate">{sub}</div>}
      </div>
      {children}
    </div>
  );
}

function FormFields({
  fields,
  values,
  onChange,
}: {
  fields: [string, string][];
  values: Record<string, unknown>;
  onChange: (k: string, v: string | number) => void;
}) {
  return (
    <>
      {fields.map(([k, type]) =>
        type === "textarea" ? (
          <textarea
            key={k}
            placeholder={k}
            rows={3}
            value={String(values[k] ?? "")}
            onChange={(e) => onChange(k, e.target.value)}
            className={inp}
          />
        ) : (
          <input
            key={k}
            type={type === "number" ? "number" : "text"}
            placeholder={k}
            required={k === "title" || k === "slug" || k === "name"}
            value={String(values[k] ?? "")}
            onChange={(e) =>
              onChange(k, type === "number" ? Number(e.target.value) : e.target.value)
            }
            className={inp}
          />
        ),
      )}
    </>
  );
}
