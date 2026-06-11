import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createSupabaseAdminClient } from "@/integrations/supabase/client.server";

export const isEmailAvailable = createServerFn({ method: "POST" })
  .validator(
    z.object({
      email: z.string().email(),
    }),
  )
  .handler(async ({ data }) => {
    const supabaseAdmin = createSupabaseAdminClient();
    const authAdmin = (supabaseAdmin.auth as any).admin;
    const emailLower = data.email.trim().toLowerCase();
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
