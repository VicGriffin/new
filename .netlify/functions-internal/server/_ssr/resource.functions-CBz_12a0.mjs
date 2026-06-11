import { c as createServerRpc, a as createSupabaseAdminClient } from "./client.server-D_E7oIce.mjs";
import { a as createServerFn } from "./index.mjs";
import { r as requireSupabaseAuth } from "./auth-middleware-DFQT01mP.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType, b as booleanType, e as enumType } from "../_libs/zod.mjs";
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
const RESOURCE_FILE_BUCKET = "resource_files";
async function assertAdmin(userId, supabaseAdmin) {
  const {
    data,
    error
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Forbidden: admin role required");
}
function normalizeFileName(fileName) {
  return fileName.replace(/[^a-zA-Z0-9._-]+/g, "_").replace(/^_+|_+$/g, "").slice(0, 180);
}
function decodeBase64FileData(base64) {
  const payload = base64.includes(";base64,") ? base64.split(",").pop() : base64;
  if (!payload) throw new Error("Invalid file payload");
  return Buffer.from(payload, "base64");
}
async function uploadResourceFile(supabaseAdmin, fileName, contentType, fileData) {
  const safeName = normalizeFileName(fileName);
  const storagePath = `resources/${crypto.randomUUID()}-${safeName}`;
  const fileBytes = decodeBase64FileData(fileData);
  const {
    error
  } = await supabaseAdmin.storage.from(RESOURCE_FILE_BUCKET).upload(storagePath, fileBytes, {
    contentType,
    upsert: false
  });
  if (error) throw error;
  return storagePath;
}
const adminCreateResource_createServerFn_handler = createServerRpc({
  id: "358afa07b7b93837cfced7f848ad027b42a5acb50a738bc5a696c4922696c192",
  name: "adminCreateResource",
  filename: "src/lib/api/resource.functions.ts"
}, (opts) => adminCreateResource.__executeServer(opts));
const adminCreateResource = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator(objectType({
  title: stringType().min(1).max(255),
  program_id: stringType().uuid().nullable().optional(),
  kind: enumType(["document", "video", "link", "slides"]),
  url: stringType().max(1024).nullable().optional(),
  description: stringType().max(2e3).nullable().optional(),
  is_public: booleanType().default(false),
  file_name: stringType().max(255).optional(),
  content_type: stringType().max(255).optional(),
  file_data: stringType().optional()
})).handler(adminCreateResource_createServerFn_handler, async ({
  data,
  context
}) => {
  const supabaseAdmin = createSupabaseAdminClient();
  await assertAdmin(context.userId, supabaseAdmin);
  let storage_path = null;
  if (data.kind === "document") {
    if (!data.file_name || !data.content_type || !data.file_data) {
      throw new Error("Document resources require an uploaded file.");
    }
    storage_path = await uploadResourceFile(supabaseAdmin, data.file_name, data.content_type, data.file_data);
  }
  const {
    data: created,
    error
  } = await supabaseAdmin.from("resources").insert({
    title: data.title,
    program_id: data.program_id || null,
    kind: data.kind,
    url: data.kind === "document" ? null : data.url || null,
    description: data.description || null,
    is_public: data.is_public,
    file_name: data.kind === "document" ? data.file_name : data.file_name ?? null,
    content_type: data.kind === "document" ? data.content_type : data.content_type ?? null,
    storage_path
  }).select().maybeSingle();
  if (error) throw error;
  return created;
});
const adminDeleteResource_createServerFn_handler = createServerRpc({
  id: "aea08ac5bac23704fe5bad8202595fca6858286f99106ef543400e368df6add0",
  name: "adminDeleteResource",
  filename: "src/lib/api/resource.functions.ts"
}, (opts) => adminDeleteResource.__executeServer(opts));
const adminDeleteResource = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator(objectType({
  resourceId: stringType().uuid()
})).handler(adminDeleteResource_createServerFn_handler, async ({
  data,
  context
}) => {
  const supabaseAdmin = createSupabaseAdminClient();
  await assertAdmin(context.userId, supabaseAdmin);
  const {
    data: resource,
    error
  } = await supabaseAdmin.from("resources").select("storage_path").eq("id", data.resourceId).maybeSingle();
  if (error) throw error;
  if (!resource) throw new Error("Resource not found");
  if (resource.storage_path) {
    const {
      error: fileError
    } = await supabaseAdmin.storage.from(RESOURCE_FILE_BUCKET).remove([resource.storage_path]);
    if (fileError) {
      console.error("Failed to delete resource storage file:", fileError);
    }
  }
  const {
    error: deleteError
  } = await supabaseAdmin.from("resources").delete().eq("id", data.resourceId);
  if (deleteError) throw deleteError;
  return {
    ok: true
  };
});
const getResourceDownloadUrl_createServerFn_handler = createServerRpc({
  id: "51b67f6aa325a0d37dc36949792dae163ef345aebd27abd6380cf6e12deb1dcd",
  name: "getResourceDownloadUrl",
  filename: "src/lib/api/resource.functions.ts"
}, (opts) => getResourceDownloadUrl.__executeServer(opts));
const getResourceDownloadUrl = createServerFn({
  method: "POST"
}).middleware([requireSupabaseAuth]).validator(objectType({
  resourceId: stringType().uuid()
})).handler(getResourceDownloadUrl_createServerFn_handler, async ({
  data,
  context
}) => {
  const supabaseAdmin = createSupabaseAdminClient();
  const {
    data: resource,
    error
  } = await supabaseAdmin.from("resources").select("id,kind,program_id,is_public,storage_path,url").eq("id", data.resourceId).maybeSingle();
  if (error) throw error;
  if (!resource) throw new Error("Resource not found");
  const {
    data: adminRole,
    error: roleError
  } = await supabaseAdmin.from("user_roles").select("role").eq("user_id", context.userId).eq("role", "admin").maybeSingle();
  if (roleError) throw roleError;
  const isAdmin = Boolean(adminRole?.role);
  if (!isAdmin && !resource.is_public) {
    if (!resource.program_id) {
      throw new Error("Forbidden: resource access denied");
    }
    const {
      data: enrollment,
      error: enrollmentError
    } = await supabaseAdmin.from("course_enrollments").select("id,status").eq("user_id", context.userId).eq("program_id", resource.program_id).maybeSingle();
    if (enrollmentError) throw enrollmentError;
    if (!enrollment || !["approved", "completed"].includes(enrollment.status)) {
      throw new Error("Forbidden: resource access denied");
    }
  }
  if (resource.storage_path) {
    const {
      data: signed,
      error: signedError
    } = await supabaseAdmin.storage.from(RESOURCE_FILE_BUCKET).createSignedUrl(resource.storage_path, 300);
    if (signedError || !signed?.signedUrl) throw signedError ?? new Error("Failed to generate download URL");
    return {
      downloadUrl: signed.signedUrl
    };
  }
  if (resource.url) {
    return {
      downloadUrl: resource.url
    };
  }
  throw new Error("No downloadable resource available");
});
export {
  adminCreateResource_createServerFn_handler,
  adminDeleteResource_createServerFn_handler,
  getResourceDownloadUrl_createServerFn_handler
};
