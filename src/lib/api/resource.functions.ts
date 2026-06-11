import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createSupabaseAdminClient } from "@/integrations/supabase/client.server";

const RESOURCE_FILE_BUCKET = "resource_files";

async function assertAdmin(userId: string, supabaseAdmin: ReturnType<typeof createSupabaseAdminClient>) {
  const { data, error } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Forbidden: admin role required");
}

function normalizeFileName(fileName: string) {
  return fileName
    .replace(/[^a-zA-Z0-9._-]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 180);
}

function decodeBase64FileData(base64: string) {
  const payload = base64.includes(";base64,") ? base64.split(",").pop() : base64;
  if (!payload) throw new Error("Invalid file payload");
  return Buffer.from(payload, "base64");
}

async function uploadResourceFile(
  supabaseAdmin: ReturnType<typeof createSupabaseAdminClient>,
  fileName: string,
  contentType: string,
  fileData: string,
) {
  const safeName = normalizeFileName(fileName);
  const storagePath = `resources/${crypto.randomUUID()}-${safeName}`;
  const fileBytes = decodeBase64FileData(fileData);

  const { error } = await supabaseAdmin.storage
    .from(RESOURCE_FILE_BUCKET)
    .upload(storagePath, fileBytes, { contentType, upsert: false });

  if (error) throw error;
  return storagePath;
}

export const adminCreateResource = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    z.object({
      title: z.string().min(1).max(255),
      program_id: z.string().uuid().nullable().optional(),
      kind: z.enum(["document", "video", "link", "slides"]),
      url: z.string().max(1024).nullable().optional(),
      description: z.string().max(2000).nullable().optional(),
      is_public: z.boolean().default(false),
      file_name: z.string().max(255).optional(),
      content_type: z.string().max(255).optional(),
      file_data: z.string().optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const supabaseAdmin = createSupabaseAdminClient();
    await assertAdmin(context.userId, supabaseAdmin);

    let storage_path: string | null = null;
    if (data.kind === "document") {
      if (!data.file_name || !data.content_type || !data.file_data) {
        throw new Error("Document resources require an uploaded file.");
      }
      storage_path = await uploadResourceFile(
        supabaseAdmin,
        data.file_name,
        data.content_type,
        data.file_data,
      );
    }

    const { data: created, error } = await supabaseAdmin
      .from("resources")
      .insert({
        title: data.title,
        program_id: data.program_id || null,
        kind: data.kind,
        url: data.kind === "document" ? null : data.url || null,
        description: data.description || null,
        is_public: data.is_public,
        file_name: data.kind === "document" ? data.file_name : data.file_name ?? null,
        content_type: data.kind === "document" ? data.content_type : data.content_type ?? null,
        storage_path,
      })
      .select()
      .maybeSingle();

    if (error) throw error;
    return created;
  });

export const adminDeleteResource = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ resourceId: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = createSupabaseAdminClient();
    await assertAdmin(context.userId, supabaseAdmin);

    const { data: resource, error } = await supabaseAdmin
      .from("resources")
      .select("storage_path")
      .eq("id", data.resourceId)
      .maybeSingle();

    if (error) throw error;
    if (!resource) throw new Error("Resource not found");

    if (resource.storage_path) {
      const { error: fileError } = await supabaseAdmin
        .storage
        .from(RESOURCE_FILE_BUCKET)
        .remove([resource.storage_path]);
      if (fileError) {
        console.error("Failed to delete resource storage file:", fileError);
      }
    }

    const { error: deleteError } = await supabaseAdmin
      .from("resources")
      .delete()
      .eq("id", data.resourceId);

    if (deleteError) throw deleteError;
    return { ok: true };
  });

export const getResourceDownloadUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ resourceId: z.string().uuid() }))
  .handler(async ({ data, context }) => {
    const supabaseAdmin = createSupabaseAdminClient();
    const { data: resource, error } = await supabaseAdmin
      .from("resources")
      .select("id,kind,program_id,is_public,storage_path,url")
      .eq("id", data.resourceId)
      .maybeSingle();

    if (error) throw error;
    if (!resource) throw new Error("Resource not found");

    const { data: adminRole, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId)
      .eq("role", "admin")
      .maybeSingle();

    if (roleError) throw roleError;
    const isAdmin = Boolean(adminRole?.role);

    if (!isAdmin && !resource.is_public) {
      if (!resource.program_id) {
        throw new Error("Forbidden: resource access denied");
      }

      const { data: enrollment, error: enrollmentError } = await supabaseAdmin
        .from("course_enrollments")
        .select("id")
        .eq("user_id", context.userId)
        .eq("program_id", resource.program_id)
        .maybeSingle();

      if (enrollmentError) throw enrollmentError;
      if (!enrollment) throw new Error("Forbidden: resource access denied");
    }

    if (resource.storage_path) {
      const { data: signed, error: signedError } = await supabaseAdmin
        .storage
        .from(RESOURCE_FILE_BUCKET)
        .createSignedUrl(resource.storage_path, 300);
      if (signedError || !signed?.signedUrl) throw signedError ?? new Error("Failed to generate download URL");
      return { downloadUrl: signed.signedUrl };
    }

    if (resource.url) {
      return { downloadUrl: resource.url };
    }

    throw new Error("No downloadable resource available");
  });
