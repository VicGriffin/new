import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { supabase } from "./client-CZ7d5FUj.mjs";
import { c as createLovableAuth } from "../_libs/lovable.dev__cloud-auth-js.mjs";
import { P as PageShell } from "./layout-WOXRQ1YO.mjs";
import { i as imageUrl } from "./utils-BEYWXE59.mjs";
import { g as getEffectiveRole } from "./router-D6Y-D7l5.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
const lovableAuth = createLovableAuth();
const lovable = {
  auth: {
    signInWithOAuth: async (provider, opts) => {
      const result = await lovableAuth.signInWithOAuth(provider, {
        redirect_uri: opts?.redirect_uri,
        extraParams: {
          ...opts?.extraParams
        }
      });
      if (result.redirected) {
        return result;
      }
      if (result.error) {
        return result;
      }
      try {
        await supabase.auth.setSession(result.tokens);
      } catch (e) {
        return { error: e instanceof Error ? e : new Error(String(e)) };
      }
      return result;
    }
  }
};
function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = reactExports.useState("signin");
  const [email, setEmail] = reactExports.useState("");
  const [password, setPassword] = reactExports.useState("");
  const [fullName, setFullName] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    async function checkSession() {
      const {
        data
      } = await supabase.auth.getSession();
      if (!data.session?.user) return;
      const role = await getEffectiveRole(data.session.user.id);
      if (role === "admin") {
        nav({
          to: "/admin",
          replace: true
        });
      } else if (role === "student" || role === "member" || role === "instructor") {
        nav({
          to: "/portal",
          replace: true
        });
      }
    }
    checkSession();
  }, [nav]);
  async function handleEmail(e) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "reset") {
        const {
          error
        } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`
        });
        if (error) throw error;
        toast.success("Password reset link sent — check your email.");
        setMode("signin");
      } else if (mode === "signup") {
        const {
          error
        } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/portal`,
            data: {
              full_name: fullName
            }
          }
        });
        if (error) throw error;
        toast.success("Account created. Check your email to confirm, then sign in.");
        setMode("signin");
      } else {
        const {
          error,
          data
        } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) throw error;
        if (data?.user) {
          const role = await getEffectiveRole(data.user.id);
          if (role === "admin") {
            nav({
              to: "/admin",
              replace: true
            });
          } else {
            nav({
              to: "/portal",
              replace: true
            });
          }
        } else {
          nav({
            to: "/portal",
            replace: true
          });
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed";
      if (message.toLowerCase().includes("rate limit")) {
        toast.error("Too many auth emails sent recently (Supabase limit). Wait about an hour, use Google sign-in, or disable “Confirm email” in Supabase → Authentication → Providers → Email for local dev.");
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  }
  async function handleGoogle() {
    const r = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/portal"
    });
    if (r.error) toast.error(r.error.message ?? "Google sign-in failed");
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PageShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "min-h-[80vh] grid lg:grid-cols-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hero-mesh text-white relative hidden lg:flex flex-col justify-between p-12 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imageUrl("login_signup_hero1.jfif"), alt: "AMTMTI portal sign in", className: "w-full h-full object-cover" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-navy/80", "aria-hidden": true })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 grid-pattern opacity-25", "aria-hidden": true }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-bold uppercase tracking-[0.22em] text-emerald-brand", children: "AMTMTI Portal" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-4 text-4xl font-bold leading-tight max-w-md", children: "Advancing pharmaceutical care across Africa." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-4 text-white/75 max-w-md", children: "Access programs, track progress, and join a continental community of MTM practitioners." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "relative space-y-3 text-sm text-white/80", children: ["Accredited certification pathways", "Live mentorship from continental experts", "Open research and resource library"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
        "— ",
        t
      ] }, t)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center p-6 lg:p-12 bg-soft", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md rounded-2xl bg-card border border-border p-8 shadow-xl", children: [
      mode !== "reset" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 mb-6", children: ["signin", "signup"].map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setMode(m), className: `flex-1 py-2 rounded-md text-sm font-semibold transition ${mode === m ? "bg-medical text-white" : "bg-muted text-foreground/70"}`, children: m === "signin" ? "Sign in" : "Create account" }, m)) }),
      mode === "reset" && /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-6 text-lg font-bold text-navy", children: "Reset your password" }),
      mode !== "reset" && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleGoogle, className: "w-full flex items-center justify-center gap-3 rounded-md border border-border bg-background py-2.5 text-sm font-semibold hover:bg-muted transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { width: "18", height: "18", viewBox: "0 0 48 48", "aria-hidden": true, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#FFC107", d: "M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#FF3D00", d: "M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c3 0 5.7 1.1 7.8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.6 8.3 6.3 14.7z" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#4CAF50", d: "M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.5 26.8 36.5 24 36.5c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("path", { fill: "#1976D2", d: "M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.6l6.2 5.2C41.5 35.2 44 30 44 24c0-1.3-.1-2.3-.4-3.5z" })
        ] }),
        "Continue with Google"
      ] }),
      mode !== "reset" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative my-6 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-card px-3 text-xs text-muted-foreground relative z-10", children: "or email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-x-0 top-1/2 h-px bg-border -z-0" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleEmail, className: "space-y-4", children: [
        mode === "signup" && /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Full name", value: fullName, onChange: setFullName, required: true, maxLength: 120 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Email", type: "email", value: email, onChange: setEmail, required: true, maxLength: 200 }),
        mode !== "reset" && /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { label: "Password", type: "password", value: password, onChange: setPassword, required: true, minLength: 8, maxLength: 72 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: loading, className: "w-full rounded-md bg-medical text-white py-2.5 font-semibold hover:bg-medical/90 transition disabled:opacity-60", children: loading ? "Please wait…" : mode === "signin" ? "Sign in" : mode === "signup" ? "Create account" : "Send reset link" })
      ] }),
      mode === "signin" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode("reset"), className: "mt-3 w-full text-xs text-medical hover:underline", children: "Forgot password?" }),
      mode === "reset" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", onClick: () => setMode("signin"), className: "mt-3 w-full text-xs text-muted-foreground hover:text-medical", children: "← Back to sign in" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-6 text-xs text-center text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-medical", children: "← Back to AMTMTI" }) })
    ] }) })
  ] }) });
}
function Input({
  label,
  type = "text",
  value,
  onChange,
  required,
  minLength,
  maxLength
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-navy", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type, value, onChange: (e) => onChange(e.target.value), required, minLength, maxLength, className: "mt-1.5 w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-medical" })
  ] });
}
export {
  AuthPage as component
};
