import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createSupabaseAdminClient } from "@/integrations/supabase/client.server";

const roleSchema = z.enum(["admin", "instructor", "student", "member"]);
const statusSchema = z.enum(["pending", "approved", "rejected", "suspended"]);

async function assertAdmin(userId: string, supabaseAdmin: ReturnType<typeof createSupabaseAdminClient>) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Forbidden: admin role required");
}

export const adminCreateUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      email: z.string().email(),
      password: z.string().min(8).max(72),
      full_name: z.string().min(1).max(120),
      role: roleSchema.default("student"),
    }),
  )
  .handler(async ({ data, context }) => {
    const supabaseAdmin = createSupabaseAdminClient();
    await assertAdmin(context.userId, supabaseAdmin);
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.full_name },
    });
    if (error) throw error;
    const userId = created.user.id;
    await supabaseAdmin.from("profiles").upsert({
      id: userId,
      full_name: data.full_name,
    });
    await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: userId, role: data.role }, { onConflict: "user_id,role" });
    // record audit log (best-effort)
    try {
      await supabaseAdmin.rpc("insert_audit_log", {
        _actor_id: context.userId,
        _action: "create_user",
        _table_name: "auth.users",
        _row_id: userId,
        _changes: JSON.stringify({ email: data.email, full_name: data.full_name, role: data.role }),
      });
    } catch (e) {
      console.error("Failed to write audit log:", e);
    }
    return { id: userId, email: data.email };
  });

export const adminDeleteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ userId: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = createSupabaseAdminClient();
    await assertAdmin(context.userId, supabaseAdmin);
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw error;
    try {
      await supabaseAdmin.rpc("insert_audit_log", {
        _actor_id: context.userId,
        _action: "delete_user",
        _table_name: "auth.users",
        _row_id: data.userId,
        _changes: null,
      });
    } catch (e) {
      console.error("Failed to write audit log:", e);
    }
    return { ok: true };
  });

export const adminSetUserRoles = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      userId: z.string().uuid(),
      roles: z.array(roleSchema),
    }),
  )
  .handler(async ({ data, context }) => {
    const supabaseAdmin = createSupabaseAdminClient();
    await assertAdmin(context.userId, supabaseAdmin);
    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
    if (data.roles.length) {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .insert(data.roles.map((role) => ({ user_id: data.userId, role })));
      if (error) throw error;
    }
    try {
      await supabaseAdmin.rpc("insert_audit_log", {
        _actor_id: context.userId,
        _action: "set_user_roles",
        _table_name: "user_roles",
        _row_id: data.userId,
        _changes: JSON.stringify({ roles: data.roles }),
      });
    } catch (e) {
      console.error("Failed to write audit log:", e);
    }
    return { ok: true };
  });

export const adminSetUserStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      userId: z.string().uuid(),
      status: statusSchema,
    }),
  )
  .handler(async ({ data, context }) => {
    const supabaseAdmin = createSupabaseAdminClient();
    await assertAdmin(context.userId, supabaseAdmin);

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ status: data.status })
      .eq("id", data.userId);
    if (error) throw error;

    try {
      await supabaseAdmin.rpc("insert_audit_log", {
        _actor_id: context.userId,
        _action: "set_user_status",
        _table_name: "profiles",
        _row_id: data.userId,
        _changes: JSON.stringify({ status: data.status }),
      });
    } catch (e) {
      console.error("Failed to write audit log:", e);
    }

    return { ok: true };
  });
