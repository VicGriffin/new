import { c as createServerRpc, a as createSupabaseAdminClient } from "./client.server-D_E7oIce.mjs";
import { a as createServerFn } from "./index.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DFQT01mP.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { e as enumType, o as objectType, s as stringType, a as arrayType } from "../_libs/zod.mjs";
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
const roleSchema = enumType(["admin", "instructor", "student", "member"]);
const statusSchema = enumType(["pending", "approved", "rejected", "suspended"]);
async function assertAdmin(userId, supabaseAdmin) {
  const {
    data,
    error
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Forbidden: admin role required");
}
const adminCreateUser_createServerFn_handler = createServerRpc({
  id: "4fc3f52821adb003a35fdb1aa09a433ae1858ba9067550a01ecae5f212bd28c2",
  name: "adminCreateUser",
  filename: "src/lib/api/admin.functions.ts"
}, (opts) => adminCreateUser.__executeServer(opts));
const adminCreateUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator(objectType({
  email: stringType().email(),
  password: stringType().min(8).max(72),
  full_name: stringType().min(1).max(120),
  role: roleSchema.default("student")
})).handler(adminCreateUser_createServerFn_handler, async ({
  data,
  context
}) => {
  const supabaseAdmin = createSupabaseAdminClient();
  await assertAdmin(context.userId, supabaseAdmin);
  const {
    data: created,
    error
  } = await supabaseAdmin.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
    user_metadata: {
      full_name: data.full_name
    }
  });
  if (error) throw error;
  const userId = created.user.id;
  await supabaseAdmin.from("profiles").upsert({
    id: userId,
    full_name: data.full_name
  });
  await supabaseAdmin.from("user_roles").upsert({
    user_id: userId,
    role: data.role
  }, {
    onConflict: "user_id,role"
  });
  try {
    await supabaseAdmin.rpc("insert_audit_log", {
      _actor_id: context.userId,
      _action: "create_user",
      _table_name: "auth.users",
      _row_id: userId,
      _changes: JSON.stringify({
        email: data.email,
        full_name: data.full_name,
        role: data.role
      })
    });
  } catch (e) {
    console.error("Failed to write audit log:", e);
  }
  return {
    id: userId,
    email: data.email
  };
});
const adminDeleteUser_createServerFn_handler = createServerRpc({
  id: "1c18681ad3dbd08beb1c534623f7bf75cc9344af3163addbff8b87ded1eb0835",
  name: "adminDeleteUser",
  filename: "src/lib/api/admin.functions.ts"
}, (opts) => adminDeleteUser.__executeServer(opts));
const adminDeleteUser = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator(objectType({
  userId: stringType().uuid()
})).handler(adminDeleteUser_createServerFn_handler, async ({
  data,
  context
}) => {
  const supabaseAdmin = createSupabaseAdminClient();
  await assertAdmin(context.userId, supabaseAdmin);
  const {
    error
  } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
  if (error) throw error;
  try {
    await supabaseAdmin.rpc("insert_audit_log", {
      _actor_id: context.userId,
      _action: "delete_user",
      _table_name: "auth.users",
      _row_id: data.userId,
      _changes: null
    });
  } catch (e) {
    console.error("Failed to write audit log:", e);
  }
  return {
    ok: true
  };
});
const adminSetUserRoles_createServerFn_handler = createServerRpc({
  id: "b09dea84340baf719d8b5ecad36e9643a1d4e7b875e5a1c1d44e4c34f996b4dc",
  name: "adminSetUserRoles",
  filename: "src/lib/api/admin.functions.ts"
}, (opts) => adminSetUserRoles.__executeServer(opts));
const adminSetUserRoles = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator(objectType({
  userId: stringType().uuid(),
  roles: arrayType(roleSchema)
})).handler(adminSetUserRoles_createServerFn_handler, async ({
  data,
  context
}) => {
  const supabaseAdmin = createSupabaseAdminClient();
  await assertAdmin(context.userId, supabaseAdmin);
  await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
  if (data.roles.length) {
    const {
      error
    } = await supabaseAdmin.from("user_roles").insert(data.roles.map((role) => ({
      user_id: data.userId,
      role
    })));
    if (error) throw error;
  }
  try {
    await supabaseAdmin.rpc("insert_audit_log", {
      _actor_id: context.userId,
      _action: "set_user_roles",
      _table_name: "user_roles",
      _row_id: data.userId,
      _changes: JSON.stringify({
        roles: data.roles
      })
    });
  } catch (e) {
    console.error("Failed to write audit log:", e);
  }
  return {
    ok: true
  };
});
const adminSetUserStatus_createServerFn_handler = createServerRpc({
  id: "4f5aa9f491ad26218a40bfe7686836429b3090c75cd44a37123635c11299c8d6",
  name: "adminSetUserStatus",
  filename: "src/lib/api/admin.functions.ts"
}, (opts) => adminSetUserStatus.__executeServer(opts));
const adminSetUserStatus = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator(objectType({
  userId: stringType().uuid(),
  status: statusSchema
})).handler(adminSetUserStatus_createServerFn_handler, async ({
  data,
  context
}) => {
  const supabaseAdmin = createSupabaseAdminClient();
  await assertAdmin(context.userId, supabaseAdmin);
  const {
    error
  } = await supabaseAdmin.from("profiles").update({
    status: data.status
  }).eq("id", data.userId);
  if (error) throw error;
  try {
    await supabaseAdmin.rpc("insert_audit_log", {
      _actor_id: context.userId,
      _action: "set_user_status",
      _table_name: "profiles",
      _row_id: data.userId,
      _changes: JSON.stringify({
        status: data.status
      })
    });
  } catch (e) {
    console.error("Failed to write audit log:", e);
  }
  return {
    ok: true
  };
});
export {
  adminCreateUser_createServerFn_handler,
  adminDeleteUser_createServerFn_handler,
  adminSetUserRoles_createServerFn_handler,
  adminSetUserStatus_createServerFn_handler
};
