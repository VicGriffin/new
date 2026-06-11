import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useParams, L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQueryClient, u as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { supabase } from "./client-CZ7d5FUj.mjs";
import { P as PageShell } from "./layout-CgmDunUZ.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as updateProgress } from "./enrollment.functions-BfPYweoP.mjs";
import "./index.mjs";
import "../_libs/seroval.mjs";
import { j as Award, r as ArrowLeft, B as BookOpen, R as CircleCheckBig, V as Circle, C as Clock, W as CirclePlay, X as BookOpenCheck, Y as ChevronRight } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "./router-W4DiE8xe.mjs";
import "./auth-middleware-DFQT01mP.mjs";
import "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
function StudyWorkspace() {
  const {
    slug
  } = useParams({
    from: "/_authenticated/portal/learn/$slug"
  });
  const qc = useQueryClient();
  const {
    data: user
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => (await supabase.auth.getUser()).data.user
  });
  const {
    data: program,
    isLoading: programLoading
  } = useQuery({
    queryKey: ["program-study", slug],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("programs").select("*").eq("slug", slug).single();
      if (error) throw error;
      return data;
    }
  });
  const {
    data: enrollment,
    isLoading: enrollmentLoading
  } = useQuery({
    queryKey: ["enrollment-study", program?.id, user?.id],
    enabled: !!program?.id && !!user?.id,
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("course_enrollments").select("*").eq("program_id", program.id).eq("user_id", user.id).single();
      if (error) throw error;
      return data;
    }
  });
  const [activeModuleIndex, setActiveModuleIndex] = reactExports.useState(0);
  const [activeTopicIndex, setActiveTopicIndex] = reactExports.useState(0);
  const curriculum = program?.curriculum ? program.curriculum : [];
  const flatTopics = reactExports.useMemo(() => {
    const list = [];
    curriculum.forEach((mod, modIdx) => {
      mod.topics.forEach((topic, topIdx) => {
        list.push({
          moduleIndex: modIdx,
          topicIndex: topIdx,
          title: topic
        });
      });
    });
    return list;
  }, [curriculum]);
  reactExports.useEffect(() => {
    if (enrollment && curriculum.length > 0) {
      const savedModule = enrollment.last_accessed_module;
      const savedTopic = enrollment.last_accessed_topic;
      if (savedModule && savedTopic) {
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
  }, [enrollment, program]);
  const completedTopics = reactExports.useMemo(() => {
    if (!enrollment?.completed_topics) return /* @__PURE__ */ new Set();
    const list = Array.isArray(enrollment.completed_topics) ? enrollment.completed_topics : [];
    return new Set(list.map(String));
  }, [enrollment]);
  const updateProgress$1 = useMutation({
    mutationFn: async ({
      completed,
      lastModule,
      lastTopic
    }) => {
      if (!user?.id || !enrollment?.id) throw new Error("Missing user or enrollment");
      return updateProgress({
        data: {
          enrollmentId: enrollment.id,
          completedTopics: completed,
          lastModule,
          lastTopic
        }
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["enrollment-study"]
      });
    },
    onError: (e) => toast.error(e.message ?? "Could not update progress")
  });
  if (programLoading || enrollmentLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PageShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-96 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground animate-pulse", children: "Loading study workspace…" }) }) });
  }
  const isEnrolled = !!enrollment;
  const isUnlocked = enrollment && (enrollment.status === "active" || enrollment.status === "completed");
  if (!isEnrolled || !isUnlocked) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(PageShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-2xl px-5 py-20 text-center space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Award, { className: "size-16 mx-auto text-medical" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-3xl font-bold text-navy", children: "Course Content Locked" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-foreground/70 leading-relaxed", children: "You must have an active, fully paid enrollment to access this course. Please initiate enrollment and complete your payment on the portal dashboard." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/portal", className: "inline-flex items-center gap-2 rounded-md bg-medical px-6 py-3 font-semibold text-white hover:bg-medical/90 transition", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
        " Return to Dashboard"
      ] })
    ] }) });
  }
  const activeModule = curriculum[activeModuleIndex];
  const activeTopic = activeModule?.topics[activeTopicIndex];
  const isCompleted = completedTopics.has(activeTopic);
  const handleMarkCompleted = () => {
    if (!activeTopic) return;
    const nextCompleted = Array.from(completedTopics);
    if (!completedTopics.has(activeTopic)) {
      nextCompleted.push(activeTopic);
    }
    updateProgress$1.mutate({
      completed: nextCompleted,
      lastModule: activeModule.module_title,
      lastTopic: activeTopic
    });
    const currentFlatIndex = flatTopics.findIndex((t) => t.moduleIndex === activeModuleIndex && t.topicIndex === activeTopicIndex);
    if (currentFlatIndex !== -1 && currentFlatIndex < flatTopics.length - 1) {
      const nextFlat = flatTopics[currentFlatIndex + 1];
      setActiveModuleIndex(nextFlat.moduleIndex);
      setActiveTopicIndex(nextFlat.topicIndex);
      toast.success("Topic completed! Advancing to next section.");
    } else {
      toast.success("Congratulations! You have finished all topics in this course.");
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(PageShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "bg-navy text-white py-6 border-b border-white/10 sticky top-[72px] z-20", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-5 lg:px-8 flex items-center justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/portal", className: "size-9 rounded-full bg-white/10 hover:bg-white/15 grid place-items-center transition", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold uppercase tracking-wider text-emerald-brand", children: "E-Learning Path" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold truncate max-w-md", children: program?.title })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-white/60", children: "Overall Course Progress" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm font-bold text-emerald-brand", children: [
            enrollment?.progress,
            "% Completed"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 bg-white/10 h-2.5 rounded overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full bg-gradient-to-r from-medical to-emerald-brand", style: {
          width: `${enrollment?.progress}%`
        } }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-7xl px-5 lg:px-8 py-8 grid lg:grid-cols-12 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "lg:col-span-4 bg-card border border-border rounded-2xl p-5 h-fit max-h-[80vh] overflow-y-auto space-y-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-bold text-navy flex items-center gap-2 pb-3 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-4 text-medical" }),
          " Course Syllabus"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: curriculum.map((mod, modIdx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-semibold text-xs text-muted-foreground uppercase tracking-wider", children: [
            "Module ",
            modIdx + 1,
            ": ",
            mod.module_title
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1 pl-1", children: mod.topics.map((topic, topIdx) => {
            const isActive = modIdx === activeModuleIndex && topIdx === activeTopicIndex;
            const isTopicDone = completedTopics.has(topic);
            return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => {
              setActiveModuleIndex(modIdx);
              setActiveTopicIndex(topIdx);
            }, className: `w-full text-left text-xs p-2.5 rounded-md flex items-center justify-between gap-3 transition ${isActive ? "bg-medical text-white font-semibold" : "hover:bg-soft text-foreground/80"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: topic }),
              isTopicDone ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: `size-4 ${isActive ? "text-white" : "text-emerald-brand"} shrink-0` }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "size-4 opacity-40 shrink-0" })
            ] }) }, topic);
          }) })
        ] }, mod.module_title)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "lg:col-span-8 bg-card border border-border rounded-2xl p-6 lg:p-8 space-y-6", children: activeTopic ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 border-b border-border pb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-bold uppercase tracking-wider text-medical", children: [
            "Module ",
            activeModuleIndex + 1,
            ": ",
            activeModule?.module_title
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold text-navy", children: activeTopic }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3.5" }),
              " 15 min read"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CirclePlay, { className: "size-3.5" }),
              " Study Materials"
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "prose prose-sm max-w-none text-foreground/80 leading-relaxed space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-navy text-sm", children: "Learning Objective:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "bg-soft p-3.5 rounded-lg border border-medical/15 text-xs text-foreground/90 italic", children: [
            'Gain core competencies regarding the principles of "',
            activeTopic,
            '" as configured in the AMTMTI training curriculum guidelines. Identify primary outcomes and clinical decision parameters.'
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-navy mt-6", children: "1. Overview and Core Concept" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Medication Therapy Management (MTM) requires structured clinical procedures. In this segment, we explore advanced diagnostic and pharmaceutical reconciliation methods. Developing structured care plans ensures drug interaction risks are mitigated before prescribing or dispensing." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-navy mt-6", children: "2. Clinical Case Discussion" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Consider an adult male outpatient diagnosed with complex cardiovascular comorbidities, currently prescribed a polypharmacy regimen consisting of multiple antihypertensives, anticoagulants, and metabolic regulators." }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "list-disc pl-5 space-y-1 text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Assess renal and hepatic clearance margins prior to dosage adjustment." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Incorporate patient compliance tracking tools to record daily dosages accurately." }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "Perform comprehensive drug-disease interaction checks." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-bold text-navy mt-6", children: "3. Strategic Guidelines for MTM Teams" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Healthcare practitioners must collaborate across disciplines to create patient-centric medication review workflows. Standardizing audit and documentation practices ensures safety metrics remain high across the community healthcare network." })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-border pt-6 flex flex-wrap gap-4 items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: isCompleted ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-brand bg-emerald-brand/10 px-3 py-1.5 rounded-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheckBig, { className: "size-4" }),
            " Section Completed"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "Mark this section complete to save your position." }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleMarkCompleted, className: "inline-flex items-center gap-2 rounded-md bg-medical px-6 py-2.5 text-sm font-semibold text-white hover:bg-medical/90 shadow-md transition", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpenCheck, { className: "size-4" }),
            " Mark Completed & Next ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4" })
          ] }) })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center py-20 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(BookOpen, { className: "size-12 mx-auto text-muted-foreground opacity-40 animate-bounce" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Select a topic from the syllabus to start learning." })
      ] }) })
    ] })
  ] });
}
export {
  StudyWorkspace as component
};
