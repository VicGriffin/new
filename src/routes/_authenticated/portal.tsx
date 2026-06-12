import { createFileRoute, useNavigate, Link, redirect } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/site/layout";
import { PortalSidebar } from "@/components/site/portal-sidebar";
import { getResourceDownloadUrl, adminDeleteResource } from "@/lib/api/resource.functions";
import {
  createEnrollment,
  submitPayment as submitPaymentServer,
  updateProgress,
} from "@/lib/api/enrollment.functions";
import { useMemo, useState } from "react";
import {
  BookOpen,
  GraduationCap,
  Bell,
  LogOut,
  CheckCircle2,
  Clock,
  Library,
  User,
  ExternalLink,
  Lock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
} from "lucide-react";
import { toast } from "sonner";

const browseProgramCategories = [
  {
    key: "mtm",
    label: "MTM courses",
    description: "Explore all Medication Therapy Management pathways.",
    filter: () => true,
  },
  {
    key: "professional-development",
    label: "Professional Development Courses",
    description: "Browse professional CPD courses designed for working clinicians.",
    filter: (program: any) => {
      const level = (program.level ?? "").toLowerCase();
      return level.includes("professional") || level.includes("cpd");
    },
  },
  {
    key: "certificate",
    label: "Certificate courses",
    description: "Find certificate-level MTM training for pharmacy and clinical teams.",
    filter: (program: any) => (program.level ?? "").toLowerCase().includes("certificate"),
  },
  {
    key: "short",
    label: "Short courses",
    description: "Show short-term programs and CPD modules with faster completion.",
    filter: (program: any) => {
      const duration = (program.duration ?? "").toLowerCase();
      const weeks = Number(duration.match(/(\d+)/)?.[1] ?? 0);
      return duration.includes("week") && weeks > 0 && weeks <= 12;
    },
  },
  {
    key: "diploma",
    label: "Diploma courses",
    description: "Browse diploma and postgraduate diploma MTM programs.",
    filter: (program: any) => (program.level ?? "").toLowerCase().includes("diploma"),
  },
];

export const Route = createFileRoute("/_authenticated/portal")({
  head: () => ({ meta: [{ title: "E-Learning Portal — AMTMTI" }] }),
  beforeLoad: async () => {
    const { data: u } = await supabase.auth.getUser();
    if (!u.user) throw redirect({ to: "/auth" });

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", u.user.id);

    if (roles?.some((r: { role: string }) => r.role === "admin")) {
      throw redirect({ to: "/admin" });
    }

    const validRoles = ["student", "member", "instructor"];
    const hasValidRole = roles?.some((r: { role: string }) => validRoles.includes(r.role));

    if (!hasValidRole) {
      throw redirect({ to: "/auth" });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("status")
      .eq("id", u.user.id)
      .maybeSingle();

    const status = profile?.status ?? "pending";
    // Only block rejected or suspended accounts
    if (status === "rejected" || status === "suspended") {
      throw redirect({
        to: "/auth",
        search: { reason: status },
      });
    }

    return { user: u.user };
  },
  component: Portal,
});

function Portal() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem("portal.sidebar.collapsed") === "true";
    } catch (e) {
      return false;
    }
  });
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile drawer open
  const [selectedBrowseCategory, setSelectedBrowseCategory] = useState(() => {
    try {
      return localStorage.getItem("portal.browse.category") || "mtm";
    } catch (e) {
      return "mtm";
    }
  });
  const [selectedMenu, setSelectedMenu] = useState<string>(() => {
    try {
      return localStorage.getItem("portal.menu.selected") || "overview";
    } catch (e) {
      return "overview";
    }
  });
  const nav = useNavigate();
  const qc = useQueryClient();
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    full_name: "",
    country: "",
    profession: "",
    bio: "",
  });

  // Payment mock form state
  const [payingEnrollmentId, setPayingEnrollmentId] = useState<string | null>(null);
  const [paymentRef, setPaymentRef] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("M-Pesa");

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => (await supabase.auth.getUser()).data.user,
  });
  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user?.id,
    queryFn: async () =>
      (await supabase.from("profiles").select("*").eq("id", user!.id).maybeSingle()).data,
  });
  const { data: roles } = useQuery({
    queryKey: ["roles", user?.id],
    enabled: !!user?.id,
    queryFn: async () =>
      (await supabase.from("user_roles").select("role").eq("user_id", user!.id)).data ?? [],
  });

  const { data: programs } = useQuery({
    queryKey: ["programs"],
    queryFn: async () =>
      (
        await supabase
          .from("programs")
          .select("id,title,slug,summary,duration,level,certification,price_ksh")
          .eq("is_published", true)
          .order("created_at")
      ).data ?? [],
  });

  const activeBrowseCategory = browseProgramCategories.find(
    (category) => category.key === selectedBrowseCategory,
  ) ?? browseProgramCategories[0];

  const filteredPrograms = useMemo(
    () => (programs ?? []).filter(activeBrowseCategory.filter),
    [programs, activeBrowseCategory],
  );

  const { data: enrollments } = useQuery({
    queryKey: ["enrollments", user?.id],
    enabled: !!user?.id,
    queryFn: async () =>
      (
        await supabase
          .from("course_enrollments")
          .select("*,programs(title,slug,duration,certification,price_ksh)")
          .eq("user_id", user!.id)
      ).data ?? [],
  });

  const { data: notifications } = useQuery({
    queryKey: ["notifications", user?.id],
    enabled: !!user?.id,
    queryFn: async () =>
      (
        await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user!.id)
          .order("created_at", { ascending: false })
          .limit(8)
      ).data ?? [],
  });

  const enrolledProgramIds = (enrollments ?? []).map((e: { program_id: string }) => e.program_id);
  const { data: resources } = useQuery({
    queryKey: ["resources", enrolledProgramIds],
    enabled: enrolledProgramIds.length > 0,
    queryFn: async () =>
      (
        await supabase
          .from("resources")
          .select("*,programs(title)")
          .in("program_id", enrolledProgramIds)
          .order("created_at", { ascending: false })
      ).data ?? [],
  });

  const enroll = useMutation({
    mutationFn: async (programId: string) => {
      await createEnrollment({ data: { programId } });
    },
    onSuccess: () => {
      toast.success("Enrollment initiated — please complete the payment step.");
      qc.invalidateQueries({ queryKey: ["enrollments"] });
    },
    onError: (e: Error) => toast.error(e.message ?? "Could not enroll"),
  });

  const submitPaymentMut = useMutation({
    mutationFn: async ({
      enrollmentId,
      amount,
      reference,
      method,
    }: {
      enrollmentId: string;
      amount: number;
      reference: string;
      method: string;
    }) => {
      await submitPaymentServer({ data: { enrollmentId, amount, reference, method } });
    },
    onSuccess: () => {
      toast.success("Payment submitted successfully! Pending final admin activation.");
      setPayingEnrollmentId(null);
      setPaymentRef("");
      qc.invalidateQueries({ queryKey: ["enrollments"] });
    },
    onError: (e: Error) => toast.error(e.message ?? "Could not submit payment"),
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  async function openResource(resourceId: string) {
    const popup = window.open("about:blank", "_blank", "noopener");
    if (!popup) {
      toast.error("Popup blocked. Please allow popups to download resources.");
      return;
    }

    try {
      const { downloadUrl } = await getResourceDownloadUrl({ data: { resourceId } });
      popup.location.href = downloadUrl;
    } catch (error) {
      popup.close();
      toast.error(error instanceof Error ? error.message : "Unable to load resource.");
    }
  }

  const saveProfile = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("profiles").update(profileForm).eq("id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profile updated");
      setEditingProfile(false);
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    localStorage.clear();
    await supabase.auth.signOut();
    nav({ to: "/auth", replace: true });
  }

  function startEditProfile() {
    setProfileForm({
      full_name: profile?.full_name ?? "",
      country: profile?.country ?? "",
      profession: profile?.profession ?? "",
      bio: profile?.bio ?? "",
    });
    setEditingProfile(true);
  }

  const enrolledIds = new Set((enrollments ?? []).map((e: { program_id: string }) => e.program_id));
  const completed = (enrollments ?? []).filter(
    (e: { status: string }) => e.status === "completed",
  ).length;
  const active = (enrollments ?? []).filter(
    (e: { status: string }) => e.status === "active",
  ).length;
  const pending = (enrollments ?? []).filter(
    (e: { status: string }) => e.status === "pending_payment" || e.status === "payment_approved" || e.status === "pending"
  ).length;
  const total = enrollments?.length ?? 0;
  const displayName = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "User";

  return (
    <PageShell>

      <div className="flex bg-gray-50 min-h-screen">
        <div className="w-64 flex-shrink-0">
          <PortalSidebar
            user={user || undefined}
            profile={profile || undefined}
            onSignOut={signOut}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => {
              setSidebarCollapsed((s) => {
                const next = !s;
                try {
                  localStorage.setItem("portal.sidebar.collapsed", next ? "true" : "false");
                } catch (e) {}
                return next;
              });
            }}
            open={sidebarOpen}
            onOpen={() => setSidebarOpen(true)}
            onClose={() => setSidebarOpen(false)}
            selected={selectedMenu}
            onSelect={(k) => {
              setSelectedMenu(k);
              try {
                localStorage.setItem("portal.menu.selected", k);
              } catch (e) {}
            }}
          />
        </div>

        <main className="flex-1 overflow-y-auto transition-all">
          {/* Mobile hamburger (visible on small screens) */}
          <div className="lg:hidden fixed top-4 left-4 z-60">
            <button
              aria-label={sidebarOpen ? "Close menu" : "Open menu"}
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen((s) => !s)}
              className="p-2 rounded-md bg-white/90 shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                {sidebarOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          {/* removed hero + active summary section - consolidated into My Programs */}

          <section className="mx-auto max-w-7xl px-5 lg:px-8 pb-16 space-y-10 lg:grid lg:grid-cols-[2.3fr_1fr] lg:items-start lg:gap-8">
            <div className="space-y-8">
              <div className="rounded-3xl border border-border bg-white p-6 shadow-sm">
                <div className="max-w-3xl space-y-3">
                  <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Welcome back</p>
                  <h1 className="text-3xl font-semibold tracking-tight text-navy sm:text-4xl">
                    Welcome back, {displayName} <span className="inline-block">👋</span>
                  </h1>
                  <p className="text-sm text-foreground/80 sm:text-base">
                    Here&apos;s an overview of your learning journey.
                  </p>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="rounded-3xl border border-border bg-slate-50 p-5 transition hover:shadow-md">
                    <p className="text-3xl font-semibold text-navy">{total}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Total Enrollments
                    </p>
                  </div>
                  <div className="rounded-3xl border border-border bg-slate-50 p-5 transition hover:shadow-md">
                    <p className="text-3xl font-semibold text-navy">{active}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      In Progress
                    </p>
                  </div>
                  <div className="rounded-3xl border border-border bg-slate-50 p-5 transition hover:shadow-md">
                    <p className="text-3xl font-semibold text-navy">{completed}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Completed
                    </p>
                  </div>
                  <div className="rounded-3xl border border-border bg-slate-50 p-5 transition hover:shadow-md">
                    <p className="text-3xl font-semibold text-navy">{pending}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      Pending
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold text-navy">My Programs</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Track your active learning and continue right where you left off.
                  </p>
                </div>
                <div className="space-y-4">
                  {!enrollments?.length && (
                    <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                      No enrollments yet. Browse programs below.
                    </div>
                  )}
                  {enrollments?.map((e: any) => {
                    const programPrice = e.programs?.price_ksh ?? 0;
                    const isPendingPayment = e.status === "pending_payment";
                    const isPaymentApproved = e.status === "payment_approved";
                    const isActive = e.status === "active";
                    const isCompleted = e.status === "completed";

                    return (
                      <div key={e.id} className="rounded-3xl border border-border bg-white p-5 shadow-sm space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <div className="font-semibold text-navy">{e.programs?.title}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {e.programs?.duration} · {e.programs?.certification}
                            </div>
                          </div>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
                              isActive
                                ? "bg-emerald-brand/15 text-emerald-brand"
                                : isCompleted
                                  ? "bg-blue-100 text-blue-800"
                                  : isPaymentApproved
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                          >
                            {e.status === "pending_payment"
                              ? "Pending Payment"
                              : e.status === "payment_approved"
                                ? "Payment Approved (Pending Activation)"
                                : e.status === "active"
                                  ? "Active Enrollment"
                                  : e.status}
                          </span>
                        </div>

                        {isPendingPayment && (
                          <div className="p-4 bg-red-50 border border-red-100 rounded-lg space-y-3">
                            <div className="flex gap-2 items-start">
                              <Lock className="size-4 text-red-600 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-semibold text-red-800">Payment Required</p>
                                <p className="text-xs text-red-700">
                                  Course material is locked. Please pay KSH {programPrice.toLocaleString()} to unlock.
                                </p>
                              </div>
                            </div>

                            {payingEnrollmentId === e.id ? (
                              <form
                                onSubmit={(evt) => {
                                  evt.preventDefault();
                                  if (!paymentRef.trim()) {
                                    toast.error("Please enter transaction reference");
                                    return;
                                  }
                                  submitPaymentMut.mutate({
                                    enrollmentId: e.id,
                                    amount: programPrice,
                                    reference: paymentRef,
                                    method: paymentMethod,
                                  });
                                }}
                                className="mt-3 pt-3 border-t border-red-200/50 space-y-2"
                              >
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="text-[10px] uppercase font-bold text-navy">
                                      Method
                                    </label>
                                    <select
                                      value={paymentMethod}
                                      onChange={(evt) => setPaymentMethod(evt.target.value)}
                                      className="w-full mt-1 rounded border border-border bg-background p-1.5 text-xs focus:ring-1 focus:ring-medical outline-none"
                                    >
                                      <option value="M-Pesa">M-Pesa</option>
                                      <option value="Credit Card">Credit Card</option>
                                      <option value="Bank Transfer">Bank Transfer</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="text-[10px] uppercase font-bold text-navy">
                                      Reference
                                    </label>
                                    <input
                                      type="text"
                                      placeholder="e.g. QWB89JK21"
                                      value={paymentRef}
                                      onChange={(evt) => setPaymentRef(evt.target.value)}
                                      className="w-full mt-1 rounded border border-border bg-background p-1.5 text-xs focus:ring-1 focus:ring-medical outline-none"
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-2 pt-2">
                                  <button
                                    type="submit"
                                    disabled={submitPaymentMut.isPending}
                                    className="flex-1 text-xs py-1.5 rounded bg-medical text-white font-semibold hover:bg-medical/90"
                                  >
                                    Submit Payment
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setPayingEnrollmentId(null)}
                                    className="px-3 py-1.5 text-xs rounded border border-border hover:bg-muted"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <button
                                onClick={() => {
                                  setPayingEnrollmentId(e.id);
                                  setPaymentMethod("M-Pesa");
                                  setPaymentRef("");
                                }}
                                className="inline-flex items-center gap-1.5 rounded bg-medical text-white px-4 py-2 text-xs font-semibold hover:bg-medical/90 transition"
                              >
                                <CreditCard className="size-3.5" /> Pay Now
                              </button>
                            )}
                          </div>
                        )}

                        {isPaymentApproved && (
                          <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg">
                            <div className="flex gap-2">
                              <Clock className="size-4 text-amber-700 shrink-0 mt-0.5" />
                              <div>
                                <p className="text-xs font-semibold text-amber-800">
                                  Pending Activation
                                </p>
                                <p className="text-xs text-amber-700">
                                  Your mock payment has been submitted. Course materials will unlock once an administrator approves your enrollment.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {(isActive || isCompleted) && (
                          <div className="space-y-3">
                            <div>
                              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                                <span>Progress</span>
                                <span>{e.progress}%</span>
                              </div>
                              <div className="h-2 rounded bg-muted overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-medical to-emerald-brand"
                                  style={{ width: `${e.progress}%` }}
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Link
                                to="/portal/learn/$slug"
                                params={{ slug: e.programs?.slug }}
                                className="inline-flex items-center gap-1.5 rounded bg-medical text-white px-4 py-2 text-xs font-semibold hover:bg-medical/90"
                              >
                                Study Course <ArrowRight className="size-3.5" />
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-navy">Browse Programs</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Select a category to explore the programs that match your goals.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {browseProgramCategories.map((category) => (
                      <button
                        key={category.key}
                        type="button"
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition border ${
                          selectedBrowseCategory === category.key
                            ? "bg-navy text-white border-navy"
                            : "border-border text-foreground/75 hover:border-medical hover:text-medical"
                        }`}
                        onClick={() => {
                          setSelectedBrowseCategory(category.key);
                          try {
                            localStorage.setItem("portal.browse.category", category.key);
                          } catch (e) {}
                        }}
                      >
                        {category.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-slate-50 p-5">
                  <p className="text-sm font-medium text-navy">{activeBrowseCategory.label}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{activeBrowseCategory.description}</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredPrograms?.map((p: any) => {
                    const isEnrolled = enrolledIds.has(p.id);
                    return (
                      <div
                        key={p.id}
                        className="rounded-3xl border border-border bg-white p-5 shadow-sm flex flex-col"
                      >
                        <div className="size-10 grid place-items-center rounded-lg bg-medical/10 text-medical">
                          <GraduationCap className="size-5" />
                        </div>
                        <h3 className="mt-3 font-bold text-navy">{p.title}</h3>
                        <p className="mt-1 text-sm text-foreground/70 flex-1">{p.summary}</p>
                        <div className="mt-3 text-xs text-muted-foreground">
                          {p.duration} · {p.level} · KSH {(p.price_ksh as number)?.toLocaleString()}
                        </div>
                        <button
                          disabled={isEnrolled || enroll.isPending}
                          onClick={() => enroll.mutate(p.id)}
                          className="mt-4 rounded-md bg-medical text-white px-4 py-2 text-sm font-semibold hover:bg-medical/90 disabled:opacity-60"
                        >
                          {isEnrolled ? "Enrolled" : "Enroll"}
                        </button>
                      </div>
                    );
                  })}
                  {!filteredPrograms?.length && (
                    <p className="text-sm text-muted-foreground col-span-2">
                      No programs match this category yet. Try another category.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <aside className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-navy flex items-center gap-2">
                    <User className="size-4" /> Profile
                  </h3>
                  {!editingProfile && (
                    <button onClick={startEditProfile} className="text-xs text-medical hover:underline">
                      Edit
                    </button>
                  )}
                </div>
                {editingProfile ? (
                  <form
                    className="mt-4 space-y-3"
                    onSubmit={(evt) => {
                      evt.preventDefault();
                      saveProfile.mutate();
                    }}
                  >
                    {(["full_name", "country", "profession"] as const).map((k) => (
                      <input
                        key={k}
                        placeholder={k.replace("_", " ")}
                        value={profileForm[k]}
                        onChange={(evt) => setProfileForm({ ...profileForm, [k]: evt.target.value })}
                        className="w-full rounded-md border border-input px-3 py-2 text-sm"
                      />
                    ))}
                    <textarea
                      placeholder="Bio"
                      rows={3}
                      value={profileForm.bio}
                      onChange={(evt) => setProfileForm({ ...profileForm, bio: evt.target.value })}
                      className="w-full rounded-md border border-input px-3 py-2 text-sm resize-none"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={saveProfile.isPending}
                        className="flex-1 rounded-md bg-medical text-white py-2 text-sm font-semibold"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingProfile(false)}
                        className="flex-1 rounded-md border border-border py-2 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <dl className="mt-4 space-y-2 text-sm">
                    <div>
                      <dt className="text-xs text-muted-foreground">Name</dt>
                      <dd className="font-medium text-navy">{profile?.full_name || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Profession</dt>
                      <dd>{profile?.profession || "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Country</dt>
                      <dd>{profile?.country || "—"}</dd>
                    </div>
                    {profile?.bio && (
                      <div>
                        <dt className="text-xs text-muted-foreground">Bio</dt>
                        <dd className="text-foreground/75">{profile.bio}</dd>
                      </div>
                    )}
                  </dl>
                )}
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-bold text-navy flex items-center gap-2">
                  <Bell className="size-4" /> Notifications
                </h3>
                <ul className="mt-4 space-y-3 text-sm">
                  {!notifications?.length && (
                    <li className="text-muted-foreground text-xs">You're all caught up.</li>
                  )}
                  {notifications?.map((n: any) => (
                    <li
                      key={n.id}
                      className={`rounded-md p-3 border ${n.is_read ? "bg-muted/40 border-border" : "bg-medical/5 border-medical/20"}`}
                    >
                      <div className="flex justify-between gap-2">
                        <div className="font-medium text-navy text-sm">{n.title}</div>
                        {!n.is_read && (
                          <button
                            onClick={() => markRead.mutate(n.id)}
                            className="text-[10px] text-medical hover:underline shrink-0"
                          >
                            Mark read
                          </button>
                        )}
                      </div>
                      {n.body && <div className="text-xs text-muted-foreground mt-1">{n.body}</div>}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-bold text-navy flex items-center gap-2">
                  <Library className="size-4" /> Resources
                </h3>
                {!resources?.length ? (
                  <p className="text-xs text-muted-foreground mt-2">
                    Enroll in a program to access course materials added by your instructor.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-2 text-sm">
                    {resources.map((r: any) => (
                      <li key={r.id} className="rounded-md border border-border p-3">
                        <div className="font-medium text-navy">{r.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {r.programs?.title} · {r.kind}
                        </div>
                        <button
                          type="button"
                          onClick={() => openResource(r.id)}
                          className="mt-1 inline-flex items-center gap-1 text-xs text-medical hover:underline"
                        >
                          <ExternalLink className="size-3" /> Open
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </aside>
          </section>
        </main>
      </div>
    </PageShell>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 flex items-center gap-4">
      <div className="size-12 rounded-lg bg-medical/10 text-medical grid place-items-center">
        <Icon className="size-5" />
      </div>
      <div>
        <div className="text-2xl font-bold text-navy">{value}</div>
        <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}
