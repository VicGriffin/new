import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { getEffectiveRole, getUserStatus } from "@/lib/auth/roles";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });

    const [role, status] = await Promise.all([
      getEffectiveRole(data.user.id),
      getUserStatus(data.user.id),
    ]);

    // Only block rejected or suspended accounts
    if (role !== "admin" && (status === "rejected" || status === "suspended")) {
      await supabase.auth.signOut();
      throw redirect({
        to: "/auth",
        search: {
          reason: status,
        },
      });
    }

    return { user: data.user, role, status };
  },
  component: () => <Outlet />,
});
