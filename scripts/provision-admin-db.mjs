/**
 * Provisions ADMIN_EMAIL by running credential-free seed SQL directly against Postgres.
 * Requires SUPABASE_DB_PASSWORD in .env (from Supabase Dashboard → Settings → Database).
 *
 * Usage: node --env-file=.env scripts/provision-admin-db.mjs
 */
import pg from "pg";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const PROJECT_REF =
  process.env.SUPABASE_PROJECT_ID ||
  process.env.VITE_SUPABASE_PROJECT_ID ||
  deriveProjectRefFromUrl(SUPABASE_URL);
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_DISPLAY_NAME = process.env.ADMIN_DISPLAY_NAME?.trim() || "AMTMTI Administrator";

function deriveProjectRefFromUrl(url) {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    const host = parsed.host;
    const match = host.match(/^([^.]+)\.supabase\.co$/);
    return match?.[1];
  } catch {
    return undefined;
  }
}

if (!PROJECT_REF) {
  console.error(
    "[provision-admin-db] Missing Supabase project ref. Set SUPABASE_URL or SUPABASE_PROJECT_ID.",
  );
  process.exit(1);
}

if (!DB_PASSWORD || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error(
    "[provision-admin-db] Missing SUPABASE_DB_PASSWORD, ADMIN_EMAIL, or ADMIN_PASSWORD.\n" +
      "  1. Open https://supabase.com/dashboard/project/" +
      PROJECT_REF +
      "/settings/database\n" +
      "  2. Copy the database password (or reset it)\n" +
      "  3. Add to .env: SUPABASE_DB_PASSWORD=your-password plus ADMIN_EMAIL and ADMIN_PASSWORD\n" +
      "  4. Re-run: npm run setup:admin",
  );
  process.exit(1);
}

if (ADMIN_PASSWORD.length < 12) {
  console.error("[provision-admin-db] ADMIN_PASSWORD must be at least 12 characters.");
  process.exit(1);
}

const hosts = [
  `db.${PROJECT_REF}.supabase.co`,
  `aws-0-eu-central-1.pooler.supabase.com`,
  `aws-0-us-east-1.pooler.supabase.com`,
  `aws-0-ap-southeast-1.pooler.supabase.com`,
];

const sql = readFileSync(join(__dirname, "../supabase/seed_admin_complete.sql"), "utf8");

async function tryConnect(host) {
  const isPooler = host.includes("pooler");
  const client = new pg.Client({
    host,
    port: isPooler ? 6543 : 5432,
    user: isPooler ? `postgres.${PROJECT_REF}` : "postgres",
    password: DB_PASSWORD,
    database: "postgres",
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 8000,
  });
  await client.connect();
  return client;
}

async function main() {
  console.log("[provision-admin-db] Connecting to Supabase Postgres…");
  let client;
  let lastError;

  for (const host of hosts) {
    try {
      client = await tryConnect(host);
      console.log(`[provision-admin-db] Connected via ${host}`);
      break;
    } catch (err) {
      lastError = err;
    }
  }

  if (!client) {
    throw lastError ?? new Error("Could not connect to Supabase Postgres");
  }

  try {
    await client.query("BEGIN");
    await client.query("SELECT set_config($1, $2, true)", ["app.admin_email", ADMIN_EMAIL]);
    await client.query("SELECT set_config($1, $2, true)", ["app.admin_password", ADMIN_PASSWORD]);
    await client.query("SELECT set_config($1, $2, true)", [
      "app.admin_display_name",
      ADMIN_DISPLAY_NAME,
    ]);
    await client.query(sql);
    await client.query("COMMIT");
    console.log("[provision-admin-db] Admin provisioned successfully.");
    console.log(`  Email   : ${ADMIN_EMAIL}`);
    console.log("  Login   : http://localhost:8080/admin/login");
  } catch (error) {
    await client.query("ROLLBACK").catch(() => undefined);
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("[provision-admin-db] Failed:", err.message ?? err);
  process.exit(1);
});
