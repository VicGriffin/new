import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createSupabaseAdminClient } from "@/integrations/supabase/client.server";

async function assertAdmin(
  userId: string,
  supabaseAdmin: ReturnType<typeof createSupabaseAdminClient>,
) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Forbidden: admin role required");
}

const enrollmentStatusSchema = z.enum([
  "pending_payment",
  "payment_approved",
  "active",
  "completed",
  "rejected",
]);

const paymentStatusSchema = z.enum(["pending", "approved", "rejected"]);

export const createEnrollment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ programId: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = createSupabaseAdminClient();
    const existing = await supabaseAdmin
      .from("course_enrollments")
      .select("id,status")
      .eq("user_id", context.userId)
      .eq("program_id", data.programId)
      .maybeSingle();
    if (existing.error) throw existing.error;
    if (existing.data) {
      throw new Error("You are already enrolled in this program.");
    }
    const { data: created, error } = await supabaseAdmin
      .from("course_enrollments")
      .insert({
        user_id: context.userId,
        program_id: data.programId,
        status: "pending_payment",
        progress: 0,
        completed_topics: [],
      })
      .select("id")
      .single();
    if (error) throw error;
    try {
      await supabaseAdmin.rpc("insert_audit_log", {
        _actor_id: context.userId,
        _action: "create_enrollment",
        _table_name: "course_enrollments",
        _row_id: created.id,
        _changes: JSON.stringify({ program_id: data.programId, status: "pending_payment" }),
      });
    } catch {
      // best-effort audit
    }
    return { enrollmentId: created.id };
  });

export const submitPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      enrollmentId: z.string().uuid(),
      amount: z.number().positive(),
      reference: z.string().min(1).max(128),
      method: z.string().min(1).max(64),
    }),
  )
  .handler(async ({ data, context }) => {
    const supabaseAdmin = createSupabaseAdminClient();
    const { data: enrollment, error: enrollErr } = await supabaseAdmin
      .from("course_enrollments")
      .select("id,user_id,status,program_id")
      .eq("id", data.enrollmentId)
      .single();
    if (enrollErr) throw enrollErr;
    if (!enrollment || enrollment.user_id !== context.userId) {
      throw new Error("Forbidden: enrollment not found");
    }
    if (enrollment.status !== "pending_payment") {
      throw new Error("Enrollment is not awaiting payment");
    }
    const { error: payErr } = await supabaseAdmin.from("payments").insert({
      enrollment_id: data.enrollmentId,
      amount: data.amount,
      currency: "KSH",
      status: "pending",
      transaction_reference: data.reference,
      payment_method: data.method,
    });
    if (payErr) throw payErr;
    const { error: updateErr } = await supabaseAdmin
      .from("course_enrollments")
      .update({ status: "payment_approved" })
      .eq("id", data.enrollmentId);
    if (updateErr) throw updateErr;
    try {
      await supabaseAdmin.rpc("insert_audit_log", {
        _actor_id: context.userId,
        _action: "submit_payment",
        _table_name: "payments",
        _row_id: data.enrollmentId,
        _changes: JSON.stringify({
          amount: data.amount,
          reference: data.reference,
          method: data.method,
        }),
      });
    } catch {
      // best-effort audit
    }
    return { ok: true };
  });

export const updateProgress = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      enrollmentId: z.string().uuid(),
      completedTopics: z.array(z.string()),
      lastModule: z.string().min(1),
      lastTopic: z.string().min(1),
    }),
  )
  .handler(async ({ data, context }) => {
    const supabaseAdmin = createSupabaseAdminClient();
    const { data: enrollment, error: enrollErr } = await supabaseAdmin
      .from("course_enrollments")
      .select("id,user_id,status,program_id")
      .eq("id", data.enrollmentId)
      .single();
    if (enrollErr) throw enrollErr;
    if (!enrollment || enrollment.user_id !== context.userId) {
      throw new Error("Forbidden: enrollment not found");
    }
    if (!["active", "completed"].includes(enrollment.status)) {
      throw new Error("Enrollment must be active or completed to track progress");
    }
    const { data: program, error: progErr } = await supabaseAdmin
      .from("programs")
      .select("curriculum")
      .eq("id", enrollment.program_id)
      .single();
    if (progErr) throw progErr;
    const curriculum = (program?.curriculum ?? []) as any[];
    const totalTopics = curriculum.reduce(
      (sum: number, m: { topics?: string[] }) => sum + (m.topics?.length ?? 0),
      0,
    );
    const progressPercent =
      totalTopics > 0
        ? Math.min(100, Math.round((data.completedTopics.length / totalTopics) * 100))
        : 0;
    const isDone = progressPercent >= 100;
    const { error: updateErr } = await supabaseAdmin
      .from("course_enrollments")
      .update({
        completed_topics: data.completedTopics,
        progress: progressPercent,
        status: isDone ? "completed" : "active",
        completed_at: isDone ? new Date().toISOString() : null,
        last_accessed_module: data.lastModule,
        last_accessed_topic: data.lastTopic,
      })
      .eq("id", data.enrollmentId);
    if (updateErr) throw updateErr;
    return { progress: progressPercent, status: isDone ? "completed" : "active" };
  });

export const adminApproveEnrollment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ enrollmentId: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = createSupabaseAdminClient();
    await assertAdmin(context.userId, supabaseAdmin);
    const { error } = await supabaseAdmin
      .from("course_enrollments")
      .update({ status: "active" })
      .eq("id", data.enrollmentId);
    if (error) throw error;
    try {
      await supabaseAdmin.rpc("insert_audit_log", {
        _actor_id: context.userId,
        _action: "admin_approve_enrollment",
        _table_name: "course_enrollments",
        _row_id: data.enrollmentId,
        _changes: JSON.stringify({ status: "active" }),
      });
    } catch {
      // best-effort audit
    }
    return { ok: true };
  });

export const adminRejectEnrollment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ enrollmentId: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = createSupabaseAdminClient();
    await assertAdmin(context.userId, supabaseAdmin);
    const { error } = await supabaseAdmin
      .from("course_enrollments")
      .update({ status: "rejected" })
      .eq("id", data.enrollmentId);
    if (error) throw error;
    try {
      await supabaseAdmin.rpc("insert_audit_log", {
        _actor_id: context.userId,
        _action: "admin_reject_enrollment",
        _table_name: "course_enrollments",
        _row_id: data.enrollmentId,
        _changes: JSON.stringify({ status: "rejected" }),
      });
    } catch {
      // best-effort audit
    }
    return { ok: true };
  });

export const adminCompleteEnrollment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ enrollmentId: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = createSupabaseAdminClient();
    await assertAdmin(context.userId, supabaseAdmin);
    const { error } = await supabaseAdmin
      .from("course_enrollments")
      .update({ status: "completed", progress: 100, completed_at: new Date().toISOString() })
      .eq("id", data.enrollmentId);
    if (error) throw error;
    try {
      await supabaseAdmin.rpc("insert_audit_log", {
        _actor_id: context.userId,
        _action: "admin_complete_enrollment",
        _table_name: "course_enrollments",
        _row_id: data.enrollmentId,
        _changes: JSON.stringify({ status: "completed", progress: 100 }),
      });
    } catch {
      // best-effort audit
    }
    return { ok: true };
  });

export const adminDeleteEnrollment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ enrollmentId: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = createSupabaseAdminClient();
    await assertAdmin(context.userId, supabaseAdmin);
    const { error } = await supabaseAdmin
      .from("course_enrollments")
      .delete()
      .eq("id", data.enrollmentId);
    if (error) throw error;
    try {
      await supabaseAdmin.rpc("insert_audit_log", {
        _actor_id: context.userId,
        _action: "admin_delete_enrollment",
        _table_name: "course_enrollments",
        _row_id: data.enrollmentId,
        _changes: null,
      });
    } catch {
      // best-effort audit
    }
    return { ok: true };
  });
