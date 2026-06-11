import { T as TSS_SERVER_FUNCTION } from "./server-DD4Qinqm.mjs";
import { c as createClient } from "../_libs/supabase__supabase-js.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
function createSupabaseAdminClient(env) {
  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    const missing = [
      ...!SUPABASE_URL ? ["SUPABASE_URL"] : [],
      ...!SUPABASE_SERVICE_ROLE_KEY ? ["SUPABASE_SERVICE_ROLE_KEY"] : []
    ];
    const message = `Missing Supabase environment variable(s): ${missing.join(", ")}. Connect Supabase in Lovable Cloud.`;
    console.error(`[Supabase Admin] ${message}`);
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY && true) {
      console.warn("[Supabase Admin] Production: service role key not set. Admin operations will fail at runtime.");
      return new Proxy({}, {
        get: () => {
          throw new Error(
            `[Supabase Admin] Not configured. SUPABASE_SERVICE_ROLE_KEY is required for admin operations.`
          );
        }
      });
    }
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
export {
  createSupabaseAdminClient as a,
  createServerRpc as c
};
