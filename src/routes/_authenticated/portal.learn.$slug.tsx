import { createFileRoute, Link, redirect, useParams } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PageShell } from "@/components/site/layout";
import { useEffect, useState, useMemo } from "react";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Circle,
  PlayCircle,
  BookOpenCheck,
  ChevronRight,
  Clock,
  Award,
} from "lucide-react";
import { toast } from "sonner";
import { updateProgress as updateProgressServer } from "@/lib/api/enrollment.functions";

export const Route = createFileRoute("/_authenticated/portal/learn/$slug")({
  head: () => ({ meta: [{ title: "Study Course — AMTMTI" }] }),
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
    if (!hasValidRole) throw redirect({ to: "/auth" });
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
  component: StudyWorkspace,
});

interface Topic {
  title: string;
}

interface Module {
  module_title: string;
  module_description: string;
  topics: string[];
}

function StudyWorkspace() {
  const { slug } = useParams({ from: "/_authenticated/portal/learn/$slug" });
  const qc = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: async () => (await supabase.auth.getUser()).data.user,
  });

  // Fetch Program details
  const { data: program, isLoading: programLoading } = useQuery({
    queryKey: ["program-study", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("programs").select("*").eq("slug", slug).single();
      if (error) throw error;
      return data;
    },
  });

  // Fetch Enrollment details
  const { data: enrollment, isLoading: enrollmentLoading } = useQuery({
    queryKey: ["enrollment-study", program?.id, user?.id],
    enabled: !!program?.id && !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("course_enrollments")
        .select("*")
        .eq("program_id", program!.id)
        .eq("user_id", user!.id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  // Active module & topic index state
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [activeTopicIndex, setActiveTopicIndex] = useState<number>(0);

  // Parse curriculum JSON safely
  const curriculum: Module[] = useMemo(
    () => (program?.curriculum ? (program.curriculum as any) : []),
    [program?.curriculum],
  );

  // Flattened list of all topics for progress calculations and next/prev navigations
  const flatTopics = useMemo(() => {
    const list: { moduleIndex: number; topicIndex: number; title: string }[] = [];
    curriculum.forEach((mod, modIdx) => {
      mod.topics.forEach((topic, topIdx) => {
        list.push({ moduleIndex: modIdx, topicIndex: topIdx, title: topic });
      });
    });
    return list;
  }, [curriculum]);

  // Set resume position when enrollment loads
  useEffect(() => {
    if (enrollment && curriculum.length > 0) {
      const savedModule = enrollment.last_accessed_module;
      const savedTopic = enrollment.last_accessed_topic;
      if (savedModule && savedTopic) {
        // Find match in curriculum
        const modIdx = curriculum.findIndex((m) => m.module_title === savedModule);
        if (modIdx !== -1) {
          const topIdx = curriculum[modIdx].topics.findIndex((t) => t === savedTopic);
          if (topIdx !== -1) {
            setActiveModuleIndex(modIdx);
            setActiveTopicIndex(topIdx);
          }
        }
      }
    }
  }, [curriculum, enrollment]);

  // Parse completed topics list
  const completedTopics = useMemo(() => {
    if (!enrollment?.completed_topics) return new Set<string>();
    const list = Array.isArray(enrollment.completed_topics)
      ? (enrollment.completed_topics as unknown as string[])
      : [];
    return new Set<string>(list.map(String));
  }, [enrollment]);

  // Progress update mutation via server function for server-side validation
  const updateProgress = useMutation({
    mutationFn: async ({
      completed,
      lastModule,
      lastTopic,
    }: {
      completed: string[];
      lastModule: string;
      lastTopic: string;
    }) => {
      if (!user?.id || !enrollment?.id) throw new Error("Missing user or enrollment");
      return updateProgressServer({
        data: {
          enrollmentId: enrollment.id,
          completedTopics: completed,
          lastModule,
          lastTopic,
        },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["enrollment-study"] });
    },
    onError: (e: Error) => toast.error(e.message ?? "Could not update progress"),
  });

  if (programLoading || enrollmentLoading) {
    return (
      <PageShell>
        <div className="flex h-96 items-center justify-center">
          <p className="text-sm text-muted-foreground animate-pulse">Loading study workspace…</p>
        </div>
      </PageShell>
    );
  }

  // Guard routing checks
  const isEnrolled = !!enrollment;
  const isUnlocked =
    enrollment && (enrollment.status === "active" || enrollment.status === "completed");

  if (!isEnrolled || !isUnlocked) {
    return (
      <PageShell>
        <div className="mx-auto max-w-2xl px-5 py-20 text-center space-y-6">
          <Award className="size-16 mx-auto text-medical" />
          <h2 className="text-3xl font-bold text-navy">Course Content Locked</h2>
          <p className="text-foreground/70 leading-relaxed">
            You must have an active, fully paid enrollment to access this course. Please initiate
            enrollment and complete your payment on the portal dashboard.
          </p>
          <Link
            to="/portal"
            className="inline-flex items-center gap-2 rounded-md bg-medical px-6 py-3 font-semibold text-white hover:bg-medical/90 transition"
          >
            <ArrowLeft className="size-4" /> Return to Dashboard
          </Link>
        </div>
      </PageShell>
    );
  }

  const activeModule = curriculum[activeModuleIndex];
  const activeTopic = activeModule?.topics[activeTopicIndex];
  const isCompleted = completedTopics.has(activeTopic);

  const handleMarkCompleted = () => {
    if (!activeTopic) return;
    const nextCompleted = Array.from(completedTopics) as string[];
    if (!completedTopics.has(activeTopic)) {
      nextCompleted.push(activeTopic);
    }

    updateProgress.mutate({
      completed: nextCompleted,
      lastModule: activeModule.module_title,
      lastTopic: activeTopic,
    });

    // Auto-advance to next topic if available
    const currentFlatIndex = flatTopics.findIndex(
      (t: any) => t.moduleIndex === activeModuleIndex && t.topicIndex === activeTopicIndex,
    );
    if (currentFlatIndex !== -1 && currentFlatIndex < flatTopics.length - 1) {
      const nextFlat = flatTopics[currentFlatIndex + 1];
      setActiveModuleIndex(nextFlat.moduleIndex);
      setActiveTopicIndex(nextFlat.topicIndex);
      toast.success("Topic completed! Advancing to next section.");
    } else {
      toast.success("Congratulations! You have finished all topics in this course.");
    }
  };

  return (
    <PageShell>
      <section className="bg-navy text-white py-6 border-b border-white/10 sticky top-[72px] z-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              to="/portal"
              className="size-9 rounded-full bg-white/10 hover:bg-white/15 grid place-items-center transition"
            >
              <ArrowLeft className="size-4" />
            </Link>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-brand">
                E-Learning Path
              </p>
              <h1 className="text-xl font-bold truncate max-w-md">{program?.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-white/60">Overall Course Progress</p>
              <p className="text-sm font-bold text-emerald-brand">
                {enrollment?.progress}% Completed
              </p>
            </div>
            <div className="w-24 bg-white/10 h-2.5 rounded overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-medical to-emerald-brand"
                style={{ width: `${enrollment?.progress}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 lg:px-8 py-8 grid lg:grid-cols-12 gap-8">
        {/* Left Sidebar Curriculum Navigation */}
        <aside className="lg:col-span-4 bg-card border border-border rounded-2xl p-5 h-fit max-h-[80vh] overflow-y-auto space-y-5">
          <h3 className="font-bold text-navy flex items-center gap-2 pb-3 border-b border-border">
            <BookOpen className="size-4 text-medical" /> Course Syllabus
          </h3>
          <div className="space-y-4">
            {curriculum.map((mod, modIdx) => (
              <div key={mod.module_title} className="space-y-2">
                <div className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                  Module {modIdx + 1}: {mod.module_title}
                </div>
                <ul className="space-y-1 pl-1">
                  {mod.topics.map((topic, topIdx) => {
                    const isActive = modIdx === activeModuleIndex && topIdx === activeTopicIndex;
                    const isTopicDone = completedTopics.has(topic);
                    return (
                      <li key={topic}>
                        <button
                          onClick={() => {
                            setActiveModuleIndex(modIdx);
                            setActiveTopicIndex(topIdx);
                          }}
                          className={`w-full text-left text-xs p-2.5 rounded-md flex items-center justify-between gap-3 transition ${
                            isActive
                              ? "bg-medical text-white font-semibold"
                              : "hover:bg-soft text-foreground/80"
                          }`}
                        >
                          <span className="truncate">{topic}</span>
                          {isTopicDone ? (
                            <CheckCircle
                              className={`size-4 ${isActive ? "text-white" : "text-emerald-brand"} shrink-0`}
                            />
                          ) : (
                            <Circle className="size-4 opacity-40 shrink-0" />
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Workspace */}
        <main className="lg:col-span-8 bg-card border border-border rounded-2xl p-6 lg:p-8 space-y-6">
          {activeTopic ? (
            <>
              <div className="space-y-2 border-b border-border pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-medical">
                  Module {activeModuleIndex + 1}: {activeModule?.module_title}
                </span>
                <h2 className="text-2xl font-bold text-navy">{activeTopic}</h2>
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="size-3.5" /> 15 min read
                  </span>
                  <span className="flex items-center gap-1.5">
                    <PlayCircle className="size-3.5" /> Study Materials
                  </span>
                </div>
              </div>

              {/* Study reading content simulator */}
              <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed space-y-4">
                <p className="font-semibold text-navy text-sm">Learning Objective:</p>
                <p className="bg-soft p-3.5 rounded-lg border border-medical/15 text-xs text-foreground/90 italic">
                  Gain core competencies regarding the principles of "{activeTopic}" as configured
                  in the AMTMTI training curriculum guidelines. Identify primary outcomes and
                  clinical decision parameters.
                </p>

                <h4 className="font-bold text-navy mt-6">1. Overview and Core Concept</h4>
                <p>
                  Medication Therapy Management (MTM) requires structured clinical procedures. In
                  this segment, we explore advanced diagnostic and pharmaceutical reconciliation
                  methods. Developing structured care plans ensures drug interaction risks are
                  mitigated before prescribing or dispensing.
                </p>

                <h4 className="font-bold text-navy mt-6">2. Clinical Case Discussion</h4>
                <p>
                  Consider an adult male outpatient diagnosed with complex cardiovascular
                  comorbidities, currently prescribed a polypharmacy regimen consisting of multiple
                  antihypertensives, anticoagulants, and metabolic regulators.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Assess renal and hepatic clearance margins prior to dosage adjustment.</li>
                  <li>
                    Incorporate patient compliance tracking tools to record daily dosages
                    accurately.
                  </li>
                  <li>Perform comprehensive drug-disease interaction checks.</li>
                </ul>

                <h4 className="font-bold text-navy mt-6">3. Strategic Guidelines for MTM Teams</h4>
                <p>
                  Healthcare practitioners must collaborate across disciplines to create
                  patient-centric medication review workflows. Standardizing audit and documentation
                  practices ensures safety metrics remain high across the community healthcare
                  network.
                </p>
              </div>

              <div className="border-t border-border pt-6 flex flex-wrap gap-4 items-center justify-between">
                <div>
                  {isCompleted ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-brand bg-emerald-brand/10 px-3 py-1.5 rounded-full">
                      <CheckCircle className="size-4" /> Section Completed
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      Mark this section complete to save your position.
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleMarkCompleted}
                    className="inline-flex items-center gap-2 rounded-md bg-medical px-6 py-2.5 text-sm font-semibold text-white hover:bg-medical/90 shadow-md transition"
                  >
                    <BookOpenCheck className="size-4" /> Mark Completed & Next{" "}
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-20 space-y-4">
              <BookOpen className="size-12 mx-auto text-muted-foreground opacity-40 animate-bounce" />
              <p className="text-sm text-muted-foreground">
                Select a topic from the syllabus to start learning.
              </p>
            </div>
          )}
        </main>
      </div>
    </PageShell>
  );
}

// Helper to calculate flatten array dependencies
