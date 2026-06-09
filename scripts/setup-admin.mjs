/**
 * Unified admin setup — tries all provisioning methods in order.
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const node = process.execPath;
const envFile = join(root, ".env");

function run(script, extraArgs = []) {
  const result = spawnSync(node, ["--env-file", envFile, join(__dirname, script), ...extraArgs], {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  });
  return result.status === 0;
}

const hasServiceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
const hasDbPassword = !!process.env.SUPABASE_DB_PASSWORD;

console.log("[setup:admin] Provisioning admin@amtmti.org …\n");

const softFail = process.argv.includes("--soft");

if (hasServiceRole && run("seed-admin.mjs")) {
  process.exit(0);
}

if (hasDbPassword && run("provision-admin-db.mjs")) {
  process.exit(0);
}

if (run("ensure-dev-admin.mjs")) {
  process.exit(0);
}

console.error("\n[setup:admin] Could not provision admin automatically.\n");
console.error("Add ONE of these to your .env file, then run npm run setup:admin again:\n");
console.error("  Option A — Secret key (Settings → API → Secret key):");
console.error("    SUPABASE_SERVICE_ROLE_KEY=sb_secret_...\n");
console.error("  Option B — Database password (Settings → Database):");
console.error("    SUPABASE_DB_PASSWORD=your-db-password\n");
console.error("Or run supabase/seed_admin_complete.sql manually in the Supabase SQL Editor.");

if (softFail) {
  console.error("\n[setup:admin] Dev server will still start.");
  process.exit(0);
}
process.exit(1);
