import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/site/layout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/reset-password/$token")({
  head: () => ({
    meta: [
      { title: "Reset Password — AMTMTI" },
      { name: "description", content: "Create a new AMTMTI account password." },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const nav = useNavigate();
  const { token } = useParams({ from: "/reset-password/$token" });
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  useEffect(() => {
    let mounted = true;

    async function verifyRecoverySession() {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      if (data.session?.user) {
        setReady(true);
      } else {
        setError(
          "This reset link is invalid or expired. Please request a new password reset link.",
        );
      }
    }

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session?.user) {
        setReady(true);
        setError(null);
      }
    });

    verifyRecoverySession();

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!ready) {
        throw new Error(
          "This reset link is invalid or expired. Please request a new password reset link.",
        );
      }
      if (strength.score < 4) throw new Error("Password must meet all requirements.");
      if (password !== confirmPassword) throw new Error("Passwords do not match.");

      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;

      await supabase.auth.signOut();
      setSuccess(true);
      toast.success("Password updated. Please sign in with your new password.");
      window.history.replaceState({}, document.title, "/reset-password/recovery");
    } catch (err: unknown) {
      const message = normalizeResetError(err);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell>
      <section className="bg-soft px-6 py-16">
        <div className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-medical">
            Secure password reset
          </p>
          <h1 className="mt-3 text-2xl font-bold text-navy">Create a new password</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Reset request: <span className="font-medium">{token}</span>
          </p>

          {error && (
            <div
              className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              role="alert"
            >
              {error}
            </div>
          )}

          {success ? (
            <div className="mt-6 space-y-4">
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                Your password has been updated successfully.
              </div>
              <button
                type="button"
                onClick={() => nav({ to: "/auth", replace: true })}
                className="w-full rounded-md bg-medical py-2.5 font-semibold text-white transition hover:bg-medical/90"
              >
                Sign in
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              <PasswordInput
                label="New password"
                value={password}
                onChange={setPassword}
                visible={showPassword}
                onToggleVisible={() => setShowPassword((current) => !current)}
              />
              <PasswordInput
                label="Confirm password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                visible={showConfirmPassword}
                onToggleVisible={() => setShowConfirmPassword((current) => !current)}
              />
              <PasswordRequirements password={password} strength={strength} />
              <button
                disabled={loading || !ready}
                className="w-full rounded-md bg-medical py-2.5 font-semibold text-white transition hover:bg-medical/90 disabled:opacity-60"
              >
                {loading ? "Updating password…" : "Update password"}
              </button>
            </form>
          )}

          <Link
            to="/forgot-password"
            className="mt-6 block text-center text-xs text-muted-foreground hover:text-medical"
          >
            Request a new reset link
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

function getPasswordStrength(password: string) {
  const checks = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "Uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "Lowercase letter", valid: /[a-z]/.test(password) },
    { label: "Number", valid: /\d/.test(password) },
    { label: "Symbol", valid: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter((check) => check.valid).length;
  const label = score <= 2 ? "Weak" : score <= 4 ? "Good" : "Strong";
  return { checks, score, label };
}

function PasswordRequirements({
  password,
  strength,
}: {
  password: string;
  strength: ReturnType<typeof getPasswordStrength>;
}) {
  const percent = (strength.score / strength.checks.length) * 100;
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <div className="flex items-center justify-between text-xs font-semibold text-navy">
        <span>Password strength</span>
        <span>{password ? strength.label : "Not started"}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
        <div
          className={`h-full rounded-full transition-all ${strength.score <= 2 ? "bg-destructive" : strength.score <= 4 ? "bg-amber-500" : "bg-emerald-brand"}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <ul className="mt-3 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
        {strength.checks.map((check) => (
          <li key={check.label} className={check.valid ? "text-emerald-700" : undefined}>
            {check.valid ? "✓" : "○"} {check.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  visible,
  onToggleVisible,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  visible: boolean;
  onToggleVisible: () => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-navy">
        {label} <span className="text-destructive">*</span>
      </span>
      <div className="relative mt-1.5">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          minLength={8}
          maxLength={72}
          autoComplete="new-password"
          className="w-full rounded-md border border-input bg-background px-4 py-2.5 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-medical"
        />
        <button
          type="button"
          onClick={onToggleVisible}
          className="absolute inset-y-0 right-0 grid w-11 place-items-center text-muted-foreground hover:text-medical"
          aria-label={visible ? `Hide ${label.toLowerCase()}` : `Show ${label.toLowerCase()}`}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </label>
  );
}

function normalizeResetError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unable to update password.";
  if (/expired|invalid|session/i.test(message)) {
    return "This reset link is invalid or expired. Please request a new password reset link.";
  }
  return message;
}
