import { c as createServerRpc, a as createSupabaseAdminClient } from "./client.server-D_E7oIce.mjs";
import { a as createServerFn } from "./index.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DFQT01mP.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { e as enumType, o as objectType, s as stringType, n as numberType, a as arrayType } from "../_libs/zod.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
async function assertAdmin(userId, supabaseAdmin) {
  const {
    data,
    error
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Forbidden: admin role required");
}
enumType(["pending_payment", "payment_approved", "active", "completed", "rejected"]);
enumType(["pending", "approved", "rejected"]);
const createEnrollment_createServerFn_handler = createServerRpc({
  id: "4cee8d10f01379b0cb57bea35baed1d4467d322cd34b26bafca71d15f76850e9",
  name: "createEnrollment",
  filename: "src/lib/api/enrollment.functions.ts"
}, (opts) => createEnrollment.__executeServer(opts));
const createEnrollment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator(objectType({
  programId: stringType().uuid()
})).handler(createEnrollment_createServerFn_handler, async ({
  data,
  context
}) => {
  const supabaseAdmin = createSupabaseAdminClient();
  const existing = await supabaseAdmin.from("course_enrollments").select("id,status").eq("user_id", context.userId).eq("program_id", data.programId).maybeSingle();
  if (existing.error) throw existing.error;
  if (existing.data) {
    throw new Error("You are already enrolled in this program.");
  }
  const {
    data: created,
    error
  } = await supabaseAdmin.from("course_enrollments").insert({
    user_id: context.userId,
    program_id: data.programId,
    status: "pending_payment",
    progress: 0,
    completed_topics: []
  }).select("id").single();
  if (error) throw error;
  try {
    await supabaseAdmin.rpc("insert_audit_log", {
      _actor_id: context.userId,
      _action: "create_enrollment",
      _table_name: "course_enrollments",
      _row_id: created.id,
      _changes: JSON.stringify({
        program_id: data.programId,
        status: "pending_payment"
      })
    });
  } catch {
  }
  return {
    enrollmentId: created.id
  };
});
const submitPayment_createServerFn_handler = createServerRpc({
  id: "b597591822fb604df0792c0b5591a0600e82e58ffd84f24e7750bb8db23e3007",
  name: "submitPayment",
  filename: "src/lib/api/enrollment.functions.ts"
}, (opts) => submitPayment.__executeServer(opts));
const submitPayment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator(objectType({
  enrollmentId: stringType().uuid(),
  amount: numberType().positive(),
  reference: stringType().min(1).max(128),
  method: stringType().min(1).max(64)
})).handler(submitPayment_createServerFn_handler, async ({
  data,
  context
}) => {
  const supabaseAdmin = createSupabaseAdminClient();
  const {
    data: enrollment,
    error: enrollErr
  } = await supabaseAdmin.from("course_enrollments").select("id,user_id,status,program_id").eq("id", data.enrollmentId).single();
  if (enrollErr) throw enrollErr;
  if (!enrollment || enrollment.user_id !== context.userId) {
    throw new Error("Forbidden: enrollment not found");
  }
  if (enrollment.status !== "pending_payment") {
    throw new Error("Enrollment is not awaiting payment");
  }
  const {
    error: payErr
  } = await supabaseAdmin.from("payments").insert({
    enrollment_id: data.enrollmentId,
    amount: data.amount,
    currency: "KSH",
    status: "approved",
    transaction_reference: data.reference,
    payment_method: data.method
  });
  if (payErr) throw payErr;
  const {
    error: updateErr
  } = await supabaseAdmin.from("course_enrollments").update({
    status: "payment_approved"
  }).eq("id", data.enrollmentId);
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
        method: data.method
      })
    });
  } catch {
  }
  return {
    ok: true
  };
});
const updateProgress_createServerFn_handler = createServerRpc({
  id: "756b70ef45ca15008576333c1061e06638fabe52907b60a490077cd337e73a44",
  name: "updateProgress",
  filename: "src/lib/api/enrollment.functions.ts"
}, (opts) => updateProgress.__executeServer(opts));
const updateProgress = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator(objectType({
  enrollmentId: stringType().uuid(),
  completedTopics: arrayType(stringType()),
  lastModule: stringType().min(1),
  lastTopic: stringType().min(1)
})).handler(updateProgress_createServerFn_handler, async ({
  data,
  context
}) => {
  const supabaseAdmin = createSupabaseAdminClient();
  const {
    data: enrollment,
    error: enrollErr
  } = await supabaseAdmin.from("course_enrollments").select("id,user_id,status,program_id").eq("id", data.enrollmentId).single();
  if (enrollErr) throw enrollErr;
  if (!enrollment || enrollment.user_id !== context.userId) {
    throw new Error("Forbidden: enrollment not found");
  }
  if (!["active", "completed"].includes(enrollment.status)) {
    throw new Error("Enrollment must be active or completed to track progress");
  }
  const {
    data: program,
    error: progErr
  } = await supabaseAdmin.from("programs").select("curriculum").eq("id", enrollment.program_id).single();
  if (progErr) throw progErr;
  const curriculum = program?.curriculum ?? [];
  const totalTopics = curriculum.reduce((sum, m) => sum + (m.topics?.length ?? 0), 0);
  const progressPercent = totalTopics > 0 ? Math.min(100, Math.round(data.completedTopics.length / totalTopics * 100)) : 0;
  const isDone = progressPercent >= 100;
  const {
    error: updateErr
  } = await supabaseAdmin.from("course_enrollments").update({
    completed_topics: data.completedTopics,
    progress: progressPercent,
    status: isDone ? "completed" : "active",
    completed_at: isDone ? (/* @__PURE__ */ new Date()).toISOString() : null,
    last_accessed_module: data.lastModule,
    last_accessed_topic: data.lastTopic
  }).eq("id", data.enrollmentId);
  if (updateErr) throw updateErr;
  return {
    progress: progressPercent,
    status: isDone ? "completed" : "active"
  };
});
const adminApproveEnrollment_createServerFn_handler = createServerRpc({
  id: "7fe60e17dc91a78cb0de49293d1c75f9b01786e4cd570c84f3b62cb6790e88c3",
  name: "adminApproveEnrollment",
  filename: "src/lib/api/enrollment.functions.ts"
}, (opts) => adminApproveEnrollment.__executeServer(opts));
const adminApproveEnrollment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator(objectType({
  enrollmentId: stringType().uuid()
})).handler(adminApproveEnrollment_createServerFn_handler, async ({
  data,
  context
}) => {
  const supabaseAdmin = createSupabaseAdminClient();
  await assertAdmin(context.userId, supabaseAdmin);
  const {
    error
  } = await supabaseAdmin.from("course_enrollments").update({
    status: "active"
  }).eq("id", data.enrollmentId);
  if (error) throw error;
  try {
    await supabaseAdmin.rpc("insert_audit_log", {
      _actor_id: context.userId,
      _action: "admin_approve_enrollment",
      _table_name: "course_enrollments",
      _row_id: data.enrollmentId,
      _changes: JSON.stringify({
        status: "active"
      })
    });
  } catch {
  }
  return {
    ok: true
  };
});
const adminRejectEnrollment_createServerFn_handler = createServerRpc({
  id: "21d9ea8ebece835665a682ef3fa77332d26144ad2410924b813f0273471b72d3",
  name: "adminRejectEnrollment",
  filename: "src/lib/api/enrollment.functions.ts"
}, (opts) => adminRejectEnrollment.__executeServer(opts));
const adminRejectEnrollment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator(objectType({
  enrollmentId: stringType().uuid()
})).handler(adminRejectEnrollment_createServerFn_handler, async ({
  data,
  context
}) => {
  const supabaseAdmin = createSupabaseAdminClient();
  await assertAdmin(context.userId, supabaseAdmin);
  const {
    error
  } = await supabaseAdmin.from("course_enrollments").update({
    status: "rejected"
  }).eq("id", data.enrollmentId);
  if (error) throw error;
  try {
    await supabaseAdmin.rpc("insert_audit_log", {
      _actor_id: context.userId,
      _action: "admin_reject_enrollment",
      _table_name: "course_enrollments",
      _row_id: data.enrollmentId,
      _changes: JSON.stringify({
        status: "rejected"
      })
    });
  } catch {
  }
  return {
    ok: true
  };
});
const adminCompleteEnrollment_createServerFn_handler = createServerRpc({
  id: "6ad3b58c21d953e66e41e3552eddcee7163992c54d762c8200e0554e87000497",
  name: "adminCompleteEnrollment",
  filename: "src/lib/api/enrollment.functions.ts"
}, (opts) => adminCompleteEnrollment.__executeServer(opts));
const adminCompleteEnrollment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator(objectType({
  enrollmentId: stringType().uuid()
})).handler(adminCompleteEnrollment_createServerFn_handler, async ({
  data,
  context
}) => {
  const supabaseAdmin = createSupabaseAdminClient();
  await assertAdmin(context.userId, supabaseAdmin);
  const {
    error
  } = await supabaseAdmin.from("course_enrollments").update({
    status: "completed",
    progress: 100,
    completed_at: (/* @__PURE__ */ new Date()).toISOString()
  }).eq("id", data.enrollmentId);
  if (error) throw error;
  try {
    await supabaseAdmin.rpc("insert_audit_log", {
      _actor_id: context.userId,
      _action: "admin_complete_enrollment",
      _table_name: "course_enrollments",
      _row_id: data.enrollmentId,
      _changes: JSON.stringify({
        status: "completed",
        progress: 100
      })
    });
  } catch {
  }
  return {
    ok: true
  };
});
const adminDeleteEnrollment_createServerFn_handler = createServerRpc({
  id: "96c132fdc9dc350b6b3a041609b90fb7a9ef984fe0aee08c0e737b8eca862fbe",
  name: "adminDeleteEnrollment",
  filename: "src/lib/api/enrollment.functions.ts"
}, (opts) => adminDeleteEnrollment.__executeServer(opts));
const adminDeleteEnrollment = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator(objectType({
  enrollmentId: stringType().uuid()
})).handler(adminDeleteEnrollment_createServerFn_handler, async ({
  data,
  context
}) => {
  const supabaseAdmin = createSupabaseAdminClient();
  await assertAdmin(context.userId, supabaseAdmin);
  const {
    error
  } = await supabaseAdmin.from("course_enrollments").delete().eq("id", data.enrollmentId);
  if (error) throw error;
  try {
    await supabaseAdmin.rpc("insert_audit_log", {
      _actor_id: context.userId,
      _action: "admin_delete_enrollment",
      _table_name: "course_enrollments",
      _row_id: data.enrollmentId,
      _changes: null
    });
  } catch {
  }
  return {
    ok: true
  };
});
export {
  adminApproveEnrollment_createServerFn_handler,
  adminCompleteEnrollment_createServerFn_handler,
  adminDeleteEnrollment_createServerFn_handler,
  adminRejectEnrollment_createServerFn_handler,
  createEnrollment_createServerFn_handler,
  submitPayment_createServerFn_handler,
  updateProgress_createServerFn_handler
};
