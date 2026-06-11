/**
 * Ensures the development admin account exists and has the admin role.
 * Uses only the anon key (no service role required).
 *
 * 1. Sign in or sign up admin@amtmti.org
 * 2. Call claim_seed_admin() RPC to grant admin role (idempotent)
 *
 * Run automatically before `npm run dev`, or manually:
 *   node --env-file=.env scripts/ensure-dev-admin.mjs
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@amtmti.org").toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123456";
const ADMIN_DISPLAY_NAME = process.env.ADMIN_DISPLAY_NAME || "AMTMTI Administrator";

if (!SUPABASE_URL || !ANON_KEY) {
  console.warn("[ensure-dev-admin] Skipped — missing SUPABASE_URL or anon key (VITE_SUPABASE_ANON_KEY / SUPABASE_ANON_KEY).");
  process.exit(0);
}

const supabase = createClient(SUPABASE_URL, ANON_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function ensureAuthUser() {
  let { data, error } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });

  if (!error && data.session) {
    console.log("[ensure-dev-admin] Admin user signed in.");
    return data.session;
  }

  if (error?.message?.toLowerCase().includes("invalid login")) {
    console.log("[ensure-dev-admin] Creating admin auth user…");
    const signUp = await supabase.auth.signUp({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      options: { data: { full_name: ADMIN_DISPLAY_NAME } },
    });

    if (signUp.error) {
      const msg = signUp.error.message.toLowerCase();
      if (msg.includes("already registered") || msg.includes("already been registered")) {
        throw new Error(
          `Admin email exists but password does not match. Run supabase/seed_admin_complete.sql in the Supabase SQL Editor, or use npm run seed:admin with SUPABASE_SERVICE_ROLE_KEY.`,
        );
      }
      if (msg.includes("weak") || msg.includes("easy to guess")) {
        throw new Error(
          "Supabase rejected the dev password via sign-up. Run supabase/seed_admin_complete.sql once in the Supabase SQL Editor (Dashboard → SQL), then re-run npm run setup:admin.",
        );
      }
      throw signUp.error;
    }

    if (signUp.data.session) {
      console.log("[ensure-dev-admin] Admin user created and signed in.");
      return signUp.data.session;
    }

    // Email confirmation may be required — try sign-in anyway
    const retry = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
    });
    if (retry.error) {
      throw new Error(
        `Admin user created but sign-in failed (${retry.error.message}). Disable email confirmation in Supabase Auth settings for local dev.`,
      );
    }
    console.log("[ensure-dev-admin] Admin user created and signed in.");
    return retry.data.session;
  }

  throw error ?? new Error("Could not sign in as admin");
}

async function ensureAdminRole() {
  const { error } = await supabase.rpc("claim_seed_admin");
  if (error) {
    if (error.message.includes("claim_seed_admin") || error.code === "PGRST202") {
      throw new Error(
        "Database function claim_seed_admin is missing. Run supabase/seed_admin_complete.sql in the Supabase SQL Editor once, then re-run this script.",
      );
    }
    throw error;
  }
  console.log("[ensure-dev-admin] Admin role confirmed.");
}

async function main() {
  console.log(`[ensure-dev-admin] Ensuring admin: ${ADMIN_EMAIL}`);
  await ensureAuthUser();
  await ensureAdminRole();
  await supabase.auth.signOut();
  console.log("[ensure-dev-admin] Done. Sign in at /admin/login");
}

const softFail = process.argv.includes("--soft");

main().catch((err) => {
  console.error("[ensure-dev-admin] Failed:", err.message ?? err);
  if (softFail) {
    console.error(
      "[ensure-dev-admin] Dev server will still start. Fix: run supabase/seed_admin_complete.sql in Supabase SQL Editor, then npm run setup:admin",
    );
    process.exit(0);
  }
  process.exit(1);
});
