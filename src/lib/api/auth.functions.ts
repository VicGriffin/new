import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/integrations/supabase/client.server";

const emailAvailabilityChecks = new Map<string, { count: number; resetAt: number }>();
const EMAIL_CHECK_LIMIT = 10;
const EMAIL_CHECK_WINDOW_MS = 60_000;

function assertRateLimit(key: string) {
  const now = Date.now();
  const current = emailAvailabilityChecks.get(key);
  if (!current || current.resetAt <= now) {
    emailAvailabilityChecks.set(key, { count: 1, resetAt: now + EMAIL_CHECK_WINDOW_MS });
    return;
  }

  if (current.count >= EMAIL_CHECK_LIMIT) {
    throw new Error("Too many email checks. Please wait a minute, then try again.");
  }

  current.count += 1;
}

function getRequestRateLimitKey() {
  const request = getRequest();
  const forwardedFor = request?.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = request?.headers.get("x-real-ip")?.trim();
  return forwardedFor || realIp || "anonymous";
}

export const isEmailAvailable = createServerFn({ method: "POST" })
  .validator(
    z.object({
      email: z.string().trim().toLowerCase().email().max(200),
    }),
  )
  .handler(async ({ data }) => {
    assertRateLimit(getRequestRateLimitKey());

    const supabaseAdmin = createSupabaseAdminClient();
    const authAdmin = (supabaseAdmin.auth as any).admin;
    const emailLower = data.email;
    let page = 1;
    const perPage = 1000;

    while (true) {
      const response = await authAdmin.listUsers({ page, perPage });
      if (response.error) throw response.error;
      const users = response.data?.users ?? [];
      const found = users.find(
        (user: any) => typeof user.email === "string" && user.email.toLowerCase() === emailLower,
      );
      if (found) return { available: false };

      if (!response.data?.nextPage || users.length < perPage) break;
      page = response.data.nextPage;
    }

    return { available: true };
  });
