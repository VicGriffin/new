import { T as TSS_SERVER_FUNCTION, a as createServerFn } from "./server-GTM5TjZt.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-D3fGTqiK.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { e as enumType, o as objectType, s as stringType, a as arrayType } from "../_libs/zod.mjs";
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
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
function createSupabaseAdminClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    const missing = [
      ...!SUPABASE_URL ? ["SUPABASE_URL"] : [],
      ...!SUPABASE_SERVICE_ROLE_KEY ? ["SUPABASE_SERVICE_ROLE_KEY"] : []
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(", ")}. Connect Supabase in Lovable Cloud.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      storage: void 0,
      persistSession: false,
      autoRefreshToken: false
    }
  });
}
let _supabaseAdmin;
const supabaseAdmin = new Proxy({}, {
  get(_, prop, receiver) {
    if (!_supabaseAdmin) _supabaseAdmin = createSupabaseAdminClient();
    return Reflect.get(_supabaseAdmin, prop, receiver);
  }
});
const roleSchema = enumType(["admin", "instructor", "student", "member"]);
async function assertAdmin(userId) {
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
  await assertAdmin(context.userId);
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
  await assertAdmin(context.userId);
  if (data.userId === context.userId) {
    throw new Error("Cannot delete your own account");
  }
  const {
    error
  } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
  if (error) throw error;
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
  await assertAdmin(context.userId);
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
  return {
    ok: true
  };
});
export {
  adminCreateUser_createServerFn_handler,
  adminDeleteUser_createServerFn_handler,
  adminSetUserRoles_createServerFn_handler
};
