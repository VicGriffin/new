import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { PageShell } from "@/components/site/layout";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — AMTMTI" },
      { name: "description", content: "Sign in or create an AMTMTI account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup" | "reset">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav({ to: "/portal" });
    });
  }, [nav]);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "reset") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (error) throw error;
        toast.success("Password reset link sent — check your email.");
        setMode("signin");
      } else if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/portal`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm, then sign in.");
        setMode("signin");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        nav({ to: "/portal" });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      if (message.toLowerCase().includes("rate limit")) {
        toast.error(
          "Too many auth emails sent recently (Supabase limit). Wait about an hour, use Google sign-in, or disable “Confirm email” in Supabase → Authentication → Providers → Email for local dev.",
        );
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    const r = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/portal",
    });
    if (r.error) toast.error(r.error.message ?? "Google sign-in failed");
  }

  return (
    <PageShell>
      <section className="min-h-[80vh] grid lg:grid-cols-2">
        <div className="hero-mesh text-white relative hidden lg:flex flex-col justify-between p-12">
          <div className="absolute inset-0 grid-pattern opacity-25" aria-hidden />
          <div className="relative">
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-brand">
              AMTMTI Portal
            </div>
            <h1 className="mt-4 text-4xl font-bold leading-tight max-w-md">
              Advancing pharmaceutical care across Africa.
            </h1>
            <p className="mt-4 text-white/75 max-w-md">
              Access programs, track progress, and join a continental community of MTM
              practitioners.
            </p>
          </div>
          <ul className="relative space-y-3 text-sm text-white/80">
            {[
              "Accredited certification pathways",
              "Live mentorship from continental experts",
              "Open research and resource library",
            ].map((t) => (
              <li key={t}>— {t}</li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-center p-6 lg:p-12 bg-soft">
          <div className="w-full max-w-md rounded-2xl bg-card border border-border p-8 shadow-xl">
            {mode !== "reset" && (
              <div className="flex gap-2 mb-6">
                {(["signin", "signup"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${mode === m ? "bg-medical text-white" : "bg-muted text-foreground/70"}`}
                  >
                    {m === "signin" ? "Sign in" : "Create account"}
                  </button>
                ))}
              </div>
            )}
            {mode === "reset" && (
              <h2 className="mb-6 text-lg font-bold text-navy">Reset your password</h2>
            )}

            {mode !== "reset" && (
              <button
                onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-3 rounded-md border border-border bg-background py-2.5 text-sm font-semibold hover:bg-muted transition"
              >
                <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
                  <path
                    fill="#FFC107"
                    d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.5 26.8 36.5 24 36.5c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.6l6.2 5.2C41.5 35.2 44 30 44 24c0-1.3-.1-2.3-.4-3.5z"
                  />
                </svg>
                Continue with Google
              </button>
            )}

            {mode !== "reset" && (
              <div className="relative my-6 text-center">
                <span className="bg-card px-3 text-xs text-muted-foreground relative z-10">
                  or email
                </span>
                <div className="absolute inset-x-0 top-1/2 h-px bg-border -z-0" />
              </div>
            )}

            <form onSubmit={handleEmail} className="space-y-4">
              {mode === "signup" && (
                <Input
                  label="Full name"
                  value={fullName}
                  onChange={setFullName}
                  required
                  maxLength={120}
                />
              )}
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={setEmail}
                required
                maxLength={200}
              />
              {mode !== "reset" && (
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  required
                  minLength={8}
                  maxLength={72}
                />
              )}
              <button
                disabled={loading}
                className="w-full rounded-md bg-medical text-white py-2.5 font-semibold hover:bg-medical/90 transition disabled:opacity-60"
              >
                {loading
                  ? "Please wait…"
                  : mode === "signin"
                    ? "Sign in"
                    : mode === "signup"
                      ? "Create account"
                      : "Send reset link"}
              </button>
            </form>

            {mode === "signin" && (
              <button
                type="button"
                onClick={() => setMode("reset")}
                className="mt-3 w-full text-xs text-medical hover:underline"
              >
                Forgot password?
              </button>
            )}
            {mode === "reset" && (
              <button
                type="button"
                onClick={() => setMode("signin")}
                className="mt-3 w-full text-xs text-muted-foreground hover:text-medical"
              >
                ← Back to sign in
              </button>
            )}

            <p className="mt-6 text-xs text-center text-muted-foreground">
              <Link to="/" className="hover:text-medical">
                ← Back to AMTMTI
              </Link>
            </p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Input({
  label,
  type = "text",
  value,
  onChange,
  required,
  minLength,
  maxLength,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-navy">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        className="mt-1.5 w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-medical"
      />
    </label>
  );
}
