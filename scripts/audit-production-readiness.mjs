import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");

function assertNoHardcodedAdminCredentials() {
  const scriptFiles = readdirSync(new URL("scripts", root)).filter((file) => file.endsWith(".mjs"));
  const forbidden = [
    new RegExp("Admin" + "@123456", "i"),
    new RegExp("admin" + "@amtmti\\.org", "i"),
  ];
  for (const file of scriptFiles) {
    const source = read(`scripts/${file}`);
    for (const pattern of forbidden) {
      assert.equal(pattern.test(source), false, `${file} contains a hardcoded admin credential`);
    }
  }
}

function assertVercelReady() {
  assert.equal(existsSync(new URL("vercel.json", root)), true, "vercel.json is required");
  const viteConfig = read("vite.config.ts");
  assert.match(viteConfig, /preset:\s*["']vercel["']/, "Nitro preset must target Vercel");
}

function assertSecurityFixes() {
  const enrollmentFns = read("src/lib/api/enrollment.functions.ts");
  assert.match(
    enrollmentFns,
    /status:\s*["']pending["']/,
    "Submitted payments must not be auto-approved",
  );

  const resourceFns = read("src/lib/api/resource.functions.ts");
  assert.match(
    resourceFns,
    /\["active", "completed"\]\.includes\(enrollment\.status\)/,
    "Resource access must match active enrollment statuses",
  );

  const rootRoute = read("src/routes/__root.tsx");
  assert.match(rootRoute, /unsubscribe\?\.\(\)/, "Auth listener must be cleaned up on unmount");
}

function assertDatabaseHardeningMigration() {
  const migrationDir = new URL("supabase/migrations", root);
  const combined = readdirSync(migrationDir)
    .filter((file) => file.endsWith(".sql"))
    .map((file) => read(join("supabase/migrations", file)))
    .join("\n");
  assert.match(
    combined,
    /profiles ADD COLUMN IF NOT EXISTS status/i,
    "profiles.status migration is required",
  );
  assert.match(
    combined,
    /idx_course_enrollments_user_status/i,
    "Enrollment status index is required",
  );
  assert.match(
    combined,
    /chk_course_enrollments_status/i,
    "Enrollment status constraint is required",
  );
}

assertNoHardcodedAdminCredentials();
assertVercelReady();
assertSecurityFixes();
assertDatabaseHardeningMigration();
console.log("Production readiness static audit passed.");
