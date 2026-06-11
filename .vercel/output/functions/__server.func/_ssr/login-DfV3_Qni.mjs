import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { supabase } from "./client-CZ7d5FUj.mjs";
import { i as imageUrl } from "./utils-BEYWXE59.mjs";
import { i as isAdmin } from "./router-B9ucVT0q.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { a as ShieldCheck, t as LogIn } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
function AdminLogin() {
  const nav = useNavigate();
  const [email, setEmail] = reactExports.useState("admin@amtmti.org");
  const [password, setPassword] = reactExports.useState("");
  const [loading, setLoading] = reactExports.useState(false);
  reactExports.useEffect(() => {
    supabase.auth.getSession().then(async ({
      data
    }) => {
      if (data.session?.user && await isAdmin(data.session.user.id)) {
        nav({
          to: "/admin",
          replace: true
        });
      }
    });
  }, [nav]);
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        data,
        error
      } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) {
        if (error.message.toLowerCase().includes("invalid login")) {
          throw new Error("Admin account not provisioned yet. Add SUPABASE_DB_PASSWORD or SUPABASE_SERVICE_ROLE_KEY to .env, then run: npm run setup:admin");
        }
        throw error;
      }
      if (!data.user) throw new Error("Sign in failed");
      if (!await isAdmin(data.user.id)) {
        await supabase.auth.signOut();
        throw new Error("This account does not have admin access. Run npm run setup:admin to provision the admin role.");
      }
      toast.success("Welcome back, Administrator");
      nav({
        to: "/admin",
        replace: true
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-navy flex items-center justify-center p-6 relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: imageUrl("admin_background.png"), alt: "Admin access", className: "w-full h-full object-cover" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-navy/80", "aria-hidden": true })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 hero-mesh opacity-60", "aria-hidden": true }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-md rounded-2xl bg-card border border-border shadow-2xl p-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-12 rounded-xl bg-medical/10 text-medical grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "size-6" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold text-navy", children: "AMTMTI Admin" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Authorized personnel only" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-navy", children: "Admin email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", required: true, autoComplete: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "mt-1.5 w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-medical" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "block", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-navy", children: "Password" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", required: true, autoComplete: "current-password", value: password, onChange: (e) => setPassword(e.target.value), className: "mt-1.5 w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-medical" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: loading, className: "w-full inline-flex items-center justify-center gap-2 rounded-md bg-medical text-white py-2.5 font-semibold hover:bg-medical/90 disabled:opacity-60", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "size-4" }),
          loading ? "Signing in…" : "Sign in to Admin"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex flex-col gap-2 text-center text-xs text-muted-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-medical", children: "← Back to public site" }) })
    ] })
  ] });
}
export {
  AdminLogin as component
};
