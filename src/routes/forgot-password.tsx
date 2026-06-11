import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageShell } from "@/components/site/layout";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Forgot Password — AMTMTI" },
      { name: "description", content: "Request an AMTMTI password reset link." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!isValidEmail(email)) throw new Error("Enter a valid email address.");

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim().toLowerCase(),
        {
          redirectTo: `${window.location.origin}/reset-password/recovery`,
        },
      );
      if (resetError) throw resetError;

      setSubmitted(true);
      toast.success("If an AMTMTI account exists for that email, a reset link has been sent.");
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
            Password recovery
          </p>
          <h1 className="mt-3 text-2xl font-bold text-navy">Forgot your password?</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email address and we will send a secure password reset link if the account
            exists.
          </p>

          {submitted ? (
            <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
              Check your inbox for a reset link. For security, the message is the same even if the
              email is not registered.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
              {error && (
                <div
                  className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                  role="alert"
                >
                  {error}
                </div>
              )}
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wider text-navy">
                  Email address <span className="text-destructive">*</span>
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={200}
                  autoComplete="email"
                  className="mt-1.5 w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-medical"
                />
              </label>
              <button
                disabled={loading}
                className="w-full rounded-md bg-medical py-2.5 font-semibold text-white transition hover:bg-medical/90 disabled:opacity-60"
              >
                {loading ? "Sending reset link…" : "Send reset link"}
              </button>
            </form>
          )}

          <Link
            to="/auth"
            className="mt-6 block text-center text-xs text-muted-foreground hover:text-medical"
          >
            ← Back to sign in
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function normalizeResetError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unable to send reset link.";
  if (/rate limit/i.test(message)) {
    return "Too many reset requests were sent recently. Wait about an hour, then try again.";
  }
  return message;
}
