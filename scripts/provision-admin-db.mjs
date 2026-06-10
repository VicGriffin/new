/**
 * Provisions admin@amtmti.org by running seed SQL directly against Postgres.
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
  deriveProjectRefFromUrl(SUPABASE_URL) ||
  "ocmdizojulrfpnvgdile";
const DB_PASSWORD = process.env.SUPABASE_DB_PASSWORD;

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

if (!DB_PASSWORD) {
  console.error(
    "[provision-admin-db] Missing SUPABASE_DB_PASSWORD.\n" +
      "  1. Open https://supabase.com/dashboard/project/" +
      PROJECT_REF +
      "/settings/database\n" +
      "  2. Copy the database password (or reset it)\n" +
      "  3. Add to .env: SUPABASE_DB_PASSWORD=your-password\n" +
      "  4. Re-run: npm run setup:admin",
  );
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
    await client.query(sql);
    console.log("[provision-admin-db] Admin provisioned successfully.");
    console.log("  Email   : admin@amtmti.org");
    console.log("  Password: Admin@123456");
    console.log("  Login   : http://localhost:8080/admin/login");
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error("[provision-admin-db] Failed:", err.message ?? err);
  process.exit(1);
});
