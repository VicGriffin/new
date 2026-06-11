/**
 * Development admin bootstrap — run once per environment.
 *
 * Usage:
 *   node --env-file=.env scripts/seed-admin.mjs
 *
 * Credentials come from environment variables ONLY (never hardcoded in app code):
 *   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_DISPLAY_NAME
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_DISPLAY_NAME = process.env.ADMIN_DISPLAY_NAME?.trim() || "AMTMTI Administrator";

if (!SUPABASE_URL || !SERVICE_KEY || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL, or ADMIN_PASSWORD. Add them to your environment before running seed:admin.",
  );
  process.exit(1);
}

if (ADMIN_PASSWORD.length < 12) {
  console.error("ADMIN_PASSWORD must be at least 12 characters for production-safe bootstrap.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(email) {
  let page = 1;
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const match = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (match) return match;
    if (data.users.length < 200) return null;
    page += 1;
  }
}

async function ensureAdminRole(userId) {
  const { error } = await supabase
    .from("user_roles")
    .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });
  if (error) throw error;
}

async function ensureProfile(userId) {
  const { error } = await supabase.from("profiles").upsert(
    {
      id: userId,
      full_name: ADMIN_DISPLAY_NAME,
      profession: "Administrator",
      country: "Kenya",
    },
    { onConflict: "id" },
  );
  if (error) throw error;
}

async function main() {
  console.log(`Bootstrapping admin: ${ADMIN_EMAIL}`);

  let user = await findUserByEmail(ADMIN_EMAIL);

  if (user) {
    console.log("Admin user exists — reconciling password and metadata from environment.");
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: ADMIN_DISPLAY_NAME },
    });
    if (error) throw error;
    user = data.user;
  } else {
    console.log("Creating admin user.");
    const { data, error } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: ADMIN_DISPLAY_NAME },
    });
    if (error) throw error;
    user = data.user;
  }

  await ensureProfile(user.id);
  await ensureAdminRole(user.id);

  console.log("Admin bootstrap complete.");
  console.log(`  User ID : ${user.id}`);
  console.log(`  Email   : ${ADMIN_EMAIL}`);
  console.log(`  Role    : admin`);
  console.log(`  Login   : http://localhost:8080/admin/login`);
}

main().catch((err) => {
  console.error("Admin seed failed:", err.message ?? err);
  process.exit(1);
});
