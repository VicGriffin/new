import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { PageShell } from "@/components/site/layout";
import { imageUrl } from "@/lib/utils";
import { getEffectiveRole, getUserStatus } from "@/lib/auth/roles";
import { isEmailAvailable } from "@/lib/api/auth.functions";
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

type AuthMode = "signin" | "signup";

type SignupForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  company: string;
  jobTitle: string;
  country: string;
  termsAccepted: boolean;
  marketingConsent: boolean;
};

const initialSignupForm: SignupForm = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
  phone: "",
  company: "",
  jobTitle: "",
  country: "",
  termsAccepted: false,
  marketingConsent: false,
};

const COUNTRIES = [
  "Kenya",
  "Uganda",
  "Tanzania",
  "Rwanda",
  "Ghana",
  "Nigeria",
  "South Africa",
  "Other",
];

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [signupForm, setSignupForm] = useState<SignupForm>(initialSignupForm);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const signupPasswordScore = useMemo(
    () => getPasswordStrength(signupForm.password),
    [signupForm.password],
  );

  const routeAuthenticatedUser = useCallback(
    async (userId: string) => {
      const [role, status] = await Promise.all([getEffectiveRole(userId), getUserStatus(userId)]);
      if (role === "admin") {
        nav({ to: "/admin", replace: true });
      } else if (status === "approved") {
        nav({ to: "/portal", replace: true });
      }
    },
    [nav],
  );

  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      if (!data.session?.user) return;
      await routeAuthenticatedUser(data.session.user.id);
    }
    checkSession();
  }, [routeAuthenticatedUser]);

  function normalizeAuthError(error: unknown) {
    const message = error instanceof Error ? error.message : "Authentication failed";
    if (/invalid login|invalid.*credentials|email not confirmed/i.test(message)) {
      return "Incorrect email or password. Please check your details and try again.";
    }
    if (/rate limit/i.test(message)) {
      return "Too many auth requests were sent recently. Wait about an hour, then try again.";
    }
    return message;
  }

  function isExistingAccountError(error: unknown) {
    if (!(error instanceof Error)) return false;
    return /already registered|already exists|duplicate|already a user|user already exists/i.test(
      error.message,
    );
  }

  function updateSignupField<K extends keyof SignupForm>(key: K, value: SignupForm[K]) {
    setSignupForm((current) => ({ ...current, [key]: value }));
  }

  function getSignupValidationErrors() {
    const errors: Partial<Record<keyof SignupForm, string>> = {};
    if (!signupForm.firstName.trim()) errors.firstName = "First name is required.";
    if (!signupForm.lastName.trim()) errors.lastName = "Last name is required.";
    if (!isValidEmail(signupForm.email)) errors.email = "Enter a valid email address.";
    if (signupPasswordScore.score < 4) errors.password = "Password must meet all requirements.";
    if (signupForm.password !== signupForm.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }
    if (signupForm.phone && !/^\+?[0-9 ().-]{7,20}$/.test(signupForm.phone.trim())) {
      errors.phone = "Enter a valid phone number.";
    }
    if (!signupForm.termsAccepted) {
      errors.termsAccepted = "You must accept the terms and conditions.";
    }
    return errors;
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    try {
      if (!isValidEmail(loginEmail)) throw new Error("Enter a valid email address.");
      if (!loginPassword) throw new Error("Password is required.");

      if (typeof window !== "undefined") {
        window.localStorage.setItem("amtmti_remember_session", rememberMe ? "true" : "false");
      }

      const { error, data } = await supabase.auth.signInWithPassword({
        email: loginEmail.trim().toLowerCase(),
        password: loginPassword,
      });
      if (error) throw error;
      if (!data?.user) throw new Error("Login failed. Please try again.");

      const [role, status] = await Promise.all([
        getEffectiveRole(data.user.id),
        getUserStatus(data.user.id),
      ]);
      if (role === "admin") {
        toast.success("Welcome back, Administrator");
        nav({ to: "/admin", replace: true });
      } else if (status !== "approved") {
        await supabase.auth.signOut();
        const message =
          status === "pending"
            ? "Your account is pending approval. Please wait for an admin to approve it."
            : status === "rejected"
              ? "Your account has been rejected. Contact support for help."
              : "Your account is not yet approved.";
        setAuthError(message);
        toast.error(message);
      } else {
        toast.success("Signed in successfully.");
        nav({ to: "/portal", replace: true });
      }
    } catch (err: unknown) {
      const message = normalizeAuthError(err);
      setAuthError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
      phone: true,
      termsAccepted: true,
    });

    try {
      const validationErrors = getSignupValidationErrors();
      if (Object.keys(validationErrors).length > 0) {
        throw new Error("Please fix the highlighted fields before creating your account.");
      }

      const email = signupForm.email.trim().toLowerCase();
      const { available } = await isEmailAvailable({ data: { email } });
      if (!available) {
        const message =
          "An account with this email already exists. Please sign in or reset your password.";
        setAuthError(message);
        toast.error(message);
        return;
      }

      const fullName = `${signupForm.firstName.trim()} ${signupForm.lastName.trim()}`.trim();
      const { error } = await supabase.auth.signUp({
        email,
        password: signupForm.password,
        options: {
          emailRedirectTo: `${window.location.origin}/portal`,
          data: {
            full_name: fullName,
            first_name: signupForm.firstName.trim(),
            last_name: signupForm.lastName.trim(),
            phone: signupForm.phone.trim() || null,
            company: signupForm.company.trim() || null,
            job_title: signupForm.jobTitle.trim() || null,
            country: signupForm.country || null,
            marketing_consent: signupForm.marketingConsent,
          },
        },
      });
      if (error) {
        if (isExistingAccountError(error)) {
          const message =
            "An account with this email already exists. Please sign in or reset your password.";
          setAuthError(message);
          toast.error(message);
          return;
        }
        throw error;
      }

      toast.success("Account created. Check your email to confirm, then sign in.");
      setSignupForm(initialSignupForm);
      setTouched({});
      setMode("signin");
    } catch (err: unknown) {
      const message = normalizeAuthError(err);
      setAuthError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setAuthError(null);
    const r = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/portal",
    });
    if (r.error) toast.error(r.error.message ?? "Google sign-in failed");
  }

  const signupErrors = getSignupValidationErrors();

  return (
    <PageShell>
      <section className="min-h-[80vh] grid lg:grid-cols-2">
        <div className="hero-mesh text-white relative hidden lg:flex flex-col justify-between p-12 overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={imageUrl("login_signup_hero1.jfif")}
              alt="AMTMTI portal sign in"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-navy/80" aria-hidden />
          </div>
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
          <div className="w-full max-w-xl rounded-2xl bg-card border border-border p-6 shadow-xl sm:p-8">
            <div className="flex gap-2 mb-6">
              {(["signin", "signup"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => {
                    setAuthError(null);
                    setTouched({});
                    setMode(m);
                  }}
                  className={`flex-1 py-2 rounded-md text-sm font-semibold transition ${mode === m ? "bg-medical text-white" : "bg-muted text-foreground/70"}`}
                >
                  {m === "signin" ? "Sign in" : "Create account"}
                </button>
              ))}
            </div>

            <button
              type="button"
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
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              Microsoft sign-in can be enabled when the provider is configured in Supabase.
            </p>

            <div className="relative my-6 text-center">
              <span className="bg-card px-3 text-xs text-muted-foreground relative z-10">
                or email
              </span>
              <div className="absolute inset-x-0 top-1/2 h-px bg-border -z-0" />
            </div>

            {authError && (
              <div
                className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                role="alert"
              >
                {authError}
              </div>
            )}

            {mode === "signin" ? (
              <form onSubmit={handleLogin} className="space-y-4" noValidate>
                <Input
                  label="Email address"
                  type="email"
                  value={loginEmail}
                  onChange={setLoginEmail}
                  required
                  maxLength={200}
                  autoComplete="email"
                  error={
                    touched.loginEmail && !isValidEmail(loginEmail)
                      ? "Enter a valid email."
                      : undefined
                  }
                  onBlur={() => setTouched((current) => ({ ...current, loginEmail: true }))}
                />
                <PasswordInput
                  label="Password"
                  value={loginPassword}
                  onChange={setLoginPassword}
                  visible={showLoginPassword}
                  onToggleVisible={() => setShowLoginPassword((current) => !current)}
                  autoComplete="current-password"
                  error={
                    touched.loginPassword && !loginPassword ? "Password is required." : undefined
                  }
                  onBlur={() => setTouched((current) => ({ ...current, loginPassword: true }))}
                />

                <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <label className="inline-flex items-center gap-2 text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="size-4 rounded border-input accent-medical"
                    />
                    Remember me
                  </label>
                  <Link to="/forgot-password" className="font-medium text-medical hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <button
                  disabled={loading}
                  className="w-full rounded-md bg-medical text-white py-2.5 font-semibold hover:bg-medical/90 transition disabled:opacity-60"
                >
                  {loading ? "Signing in…" : "Sign in"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4" noValidate>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="First name"
                    value={signupForm.firstName}
                    onChange={(v) => updateSignupField("firstName", v)}
                    required
                    maxLength={80}
                    autoComplete="given-name"
                    error={touched.firstName ? signupErrors.firstName : undefined}
                    onBlur={() => setTouched((current) => ({ ...current, firstName: true }))}
                  />
                  <Input
                    label="Last name"
                    value={signupForm.lastName}
                    onChange={(v) => updateSignupField("lastName", v)}
                    required
                    maxLength={80}
                    autoComplete="family-name"
                    error={touched.lastName ? signupErrors.lastName : undefined}
                    onBlur={() => setTouched((current) => ({ ...current, lastName: true }))}
                  />
                </div>
                <Input
                  label="Email address"
                  type="email"
                  value={signupForm.email}
                  onChange={(v) => updateSignupField("email", v)}
                  required
                  maxLength={200}
                  autoComplete="email"
                  error={touched.email ? signupErrors.email : undefined}
                  onBlur={() => setTouched((current) => ({ ...current, email: true }))}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <PasswordInput
                    label="Password"
                    value={signupForm.password}
                    onChange={(v) => updateSignupField("password", v)}
                    visible={showSignupPassword}
                    onToggleVisible={() => setShowSignupPassword((current) => !current)}
                    autoComplete="new-password"
                    error={touched.password ? signupErrors.password : undefined}
                    onBlur={() => setTouched((current) => ({ ...current, password: true }))}
                  />
                  <PasswordInput
                    label="Confirm password"
                    value={signupForm.confirmPassword}
                    onChange={(v) => updateSignupField("confirmPassword", v)}
                    visible={showSignupConfirmPassword}
                    onToggleVisible={() => setShowSignupConfirmPassword((current) => !current)}
                    autoComplete="new-password"
                    error={touched.confirmPassword ? signupErrors.confirmPassword : undefined}
                    onBlur={() => setTouched((current) => ({ ...current, confirmPassword: true }))}
                  />
                </div>
                <PasswordRequirements
                  password={signupForm.password}
                  strength={signupPasswordScore}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Phone number"
                    type="tel"
                    value={signupForm.phone}
                    onChange={(v) => updateSignupField("phone", v)}
                    maxLength={30}
                    autoComplete="tel"
                    error={touched.phone ? signupErrors.phone : undefined}
                    onBlur={() => setTouched((current) => ({ ...current, phone: true }))}
                  />
                  <SelectInput
                    label="Country"
                    value={signupForm.country}
                    onChange={(v) => updateSignupField("country", v)}
                    options={COUNTRIES}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Company name"
                    value={signupForm.company}
                    onChange={(v) => updateSignupField("company", v)}
                    maxLength={120}
                    autoComplete="organization"
                  />
                  <Input
                    label="Job title"
                    value={signupForm.jobTitle}
                    onChange={(v) => updateSignupField("jobTitle", v)}
                    maxLength={120}
                    autoComplete="organization-title"
                  />
                </div>

                <div className="space-y-3 rounded-lg border border-border bg-muted/30 p-3 text-sm">
                  <label className="flex gap-2">
                    <input
                      type="checkbox"
                      checked={signupForm.termsAccepted}
                      onChange={(e) => updateSignupField("termsAccepted", e.target.checked)}
                      onBlur={() => setTouched((current) => ({ ...current, termsAccepted: true }))}
                      className="mt-0.5 size-4 rounded border-input accent-medical"
                      required
                    />
                    <span>
                      I agree to the AMTMTI terms and conditions and privacy policy.
                      {touched.termsAccepted && signupErrors.termsAccepted && (
                        <span className="mt-1 block text-xs text-destructive">
                          {signupErrors.termsAccepted}
                        </span>
                      )}
                    </span>
                  </label>
                  <label className="flex gap-2 text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={signupForm.marketingConsent}
                      onChange={(e) => updateSignupField("marketingConsent", e.target.checked)}
                      className="mt-0.5 size-4 rounded border-input accent-medical"
                    />
                    Send me AMTMTI updates, resources, and training opportunities.
                  </label>
                </div>

                <button
                  disabled={loading}
                  className="w-full rounded-md bg-medical text-white py-2.5 font-semibold hover:bg-medical/90 transition disabled:opacity-60"
                >
                  {loading ? "Creating account…" : "Create account"}
                </button>
              </form>
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

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
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

function Input({
  label,
  type = "text",
  value,
  onChange,
  required,
  minLength,
  maxLength,
  autoComplete,
  error,
  onBlur,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  autoComplete?: string;
  error?: string;
  onBlur?: () => void;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-navy">
        {label} {required && <span className="text-destructive">*</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        required={required}
        minLength={minLength}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error)}
        className="mt-1.5 w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-medical"
      />
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  visible,
  onToggleVisible,
  autoComplete,
  error,
  onBlur,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  visible: boolean;
  onToggleVisible: () => void;
  autoComplete: string;
  error?: string;
  onBlur?: () => void;
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
          onBlur={onBlur}
          required
          minLength={8}
          maxLength={72}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
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
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function SelectInput({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider text-navy">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-medical"
      >
        <option value="">Select country</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
