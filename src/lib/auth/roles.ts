import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "instructor" | "student" | "member";

export const ALL_ROLES: AppRole[] = ["admin", "instructor", "student", "member"];

/** Roles that may access the admin dashboard */
export const ADMIN_ROLES: AppRole[] = ["admin"];

export async function getUserRoles(userId: string): Promise<AppRole[]> {
  const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", userId);
  if (error) throw error;
  return (data ?? []).map((r) => r.role as AppRole);
}

export async function hasRole(userId: string, role: AppRole): Promise<boolean> {
  const roles = await getUserRoles(userId);
  return roles.includes(role);
}

export async function isAdmin(userId: string): Promise<boolean> {
  return hasRole(userId, "admin");
}

export type EffectiveAppRole = AppRole | undefined;

export async function getEffectiveRole(userId: string): Promise<EffectiveAppRole> {
  const roles = await getUserRoles(userId);
  if (roles.includes("admin")) return "admin";
  if (roles.includes("student")) return "student";
  if (roles.includes("member")) return "member";
  if (roles.includes("instructor")) return "instructor";
  return undefined;
}

export function isAdminRole(role?: AppRole): boolean {
  return role === "admin";
}

export function isPortalRole(role?: AppRole): boolean {
  return role === "student" || role === "member" || role === "instructor";
}

export async function requireAdmin(userId: string): Promise<void> {
  const ok = await isAdmin(userId);
  if (!ok) throw new Error("Forbidden: admin role required");
}
