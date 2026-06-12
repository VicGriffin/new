import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { adminCreateUser, adminDeleteUser, adminSetUserRoles, adminSetUserStatus } from "@/lib/api/admin.functions";
import { ALL_ROLES, type AppRole } from "@/lib/auth/roles";
import { toast } from "sonner";
import { inp, EmptyState } from "./shared";

export function UsersTab() {
  const qc = useQueryClient();
  const [createForm, setCreateForm] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "student" as AppRole,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRoles, setEditRoles] = useState<AppRole[]>([]);

  const { data: users, isLoading } = useQuery({
    queryKey: ["adm-users"],
    queryFn: async () => {
      const [profiles, roles] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at", { ascending: false }),
        supabase.from("user_roles").select("user_id, role"),
      ]);
      if (profiles.error) throw profiles.error;
      if (roles.error) throw roles.error;
      const roleMap = new Map<string, AppRole[]>();
      roles.data?.forEach((r: any) => {
        const list = roleMap.get(r.user_id) ?? [];
        list.push(r.role as AppRole);
        roleMap.set(r.user_id, list);
      });
      return (profiles.data ?? []).map((p: any) => ({
        ...p,
        roles: roleMap.get(p.id) ?? [],
      }));
    },
  });

  const create = useMutation({
    mutationFn: async () => adminCreateUser({ data: createForm }),
    onSuccess: () => {
      toast.success("User created");
      setCreateForm({ email: "", password: "", full_name: "", role: "student" });
      qc.invalidateQueries({ queryKey: ["adm-users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const saveRoles = useMutation({
    mutationFn: async ({ userId, roles }: { userId: string; roles: AppRole[] }) =>
      adminSetUserRoles({ data: { userId, roles } }),
    onSuccess: () => {
      toast.success("Roles updated");
      setEditingId(null);
      qc.invalidateQueries({ queryKey: ["adm-users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateStatus = useMutation({
    mutationFn: async ({ userId, status }: { userId: string; status: string }) => {
      await adminSetUserStatus({ data: { userId, status: status as any } });
    },
    onSuccess: () => {
      toast.success("User approval status updated");
      qc.invalidateQueries({ queryKey: ["adm-users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: async (userId: string) => adminDeleteUser({ data: { userId } }),
    onSuccess: () => {
      toast.success("User deleted");
      qc.invalidateQueries({ queryKey: ["adm-users"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  function toggleRole(role: AppRole) {
    setEditRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
  }

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        {isLoading && <EmptyState message="Loading users…" />}
        {users?.map((u: any) => (
          <div key={u.id} className="border border-border bg-card p-4">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="font-semibold text-navy">{u.full_name ?? "—"}</div>
                  <span
                    className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${
                      u.status === "approved"
                        ? "bg-emerald-brand/15 text-emerald-brand"
                        : u.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {u.status || "pending"}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {u.profession ?? "—"} · {u.country ?? "—"} ·{" "}
                  {new Date(u.created_at).toLocaleDateString()}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {u.roles.map((r: string) => (
                    <span
                      key={r}
                      className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-medical/10 text-medical"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex gap-1.5 items-center">
                {u.status !== "approved" && (
                  <button
                    type="button"
                    onClick={() => updateStatus.mutate({ userId: u.id, status: "approved" })}
                    className="text-xs px-2 py-1 rounded bg-emerald-brand/15 text-emerald-brand hover:bg-emerald-brand/20 font-semibold"
                  >
                    Approve
                  </button>
                )}
                {u.status === "approved" && (
                  <button
                    type="button"
                    onClick={() => updateStatus.mutate({ userId: u.id, status: "suspended" })}
                    className="text-xs px-2 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200 font-semibold"
                  >
                    Suspend
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(u.id);
                    setEditRoles(u.roles);
                  }}
                  className="text-xs px-2 py-1 rounded border border-border hover:bg-muted"
                >
                  Roles
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!confirm("Delete this user permanently?")) return;
                    del.mutate(u.id);
                  }}
                  className="text-xs px-2 py-1 rounded border border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  Delete
                </button>
              </div>
            </div>
            {editingId === u.id && (
              <div className="mt-4 pt-4 border-t border-border space-y-3">
                <div className="flex flex-wrap gap-2">
                  {ALL_ROLES.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => toggleRole(r)}
                      className={`text-xs px-2 py-1 rounded border ${editRoles.includes(r) ? "bg-medical text-white border-medical" : "border-border"}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => saveRoles.mutate({ userId: u.id, roles: editRoles })}
                  className="text-xs px-3 py-1.5 rounded bg-medical text-white font-semibold"
                >
                  Save roles
                </button>
              </div>
            )}
          </div>
        ))}
        {!isLoading && !users?.length && <EmptyState message="No users found." />}
      </div>
    </div>
  );
}
