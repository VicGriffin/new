import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { imageUrl } from "@/lib/utils";
import { isAdmin } from "@/lib/auth/roles";
import { ShieldCheck, LogIn } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [{ title: "Admin Login — AMTMTI" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (data.session?.user && (await isAdmin(data.session.user.id))) {
        nav({ to: "/admin", replace: true });
      }
    });
  }, [nav]);

  function getLoginErrorMessage(error: unknown) {
    const message = error instanceof Error ? error.message : "Login failed";
    if (/invalid login|invalid.*credentials|email not confirmed/i.test(message)) {
      return "Incorrect admin email or password. Please check your details and try again.";
    }
    if (/rate limit/i.test(message)) {
      return "Too many login attempts. Wait about an hour, then try again.";
    }
    return message;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        throw error;
      }
      if (!data.user) throw new Error("Sign in failed");

      if (!(await isAdmin(data.user.id))) {
        await supabase.auth.signOut();
        throw new Error(
          "This account does not have admin access. Run npm run setup:admin to provision the admin role.",
        );
      }

      toast.success("Welcome back, Administrator");
      nav({ to: "/admin", replace: true });
    } catch (err: unknown) {
      toast.error(getLoginErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={imageUrl("admin_background.png")}
          alt="Admin access"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-navy/80" aria-hidden />
      </div>
      <div className="absolute inset-0 hero-mesh opacity-60" aria-hidden />
      <div className="relative w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="size-12 rounded-xl bg-medical/10 text-medical grid place-items-center">
            <ShieldCheck className="size-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-navy">AMTMTI Admin</h1>
            <p className="text-xs text-muted-foreground">Authorized personnel only</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-navy">
              Admin email
            </span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-medical"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-wider text-navy">
              Password
            </span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-medical"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-medical text-white py-2.5 font-semibold hover:bg-medical/90 disabled:opacity-60"
          >
            <LogIn className="size-4" />
            {loading ? "Signing in…" : "Sign in to Admin"}
          </button>
        </form>

        <div className="mt-6 flex flex-col gap-2 text-center text-xs text-muted-foreground">
          <Link to="/" className="hover:text-medical">
            ← Back to public site
          </Link>
        </div>
      </div>
    </div>
  );
}
