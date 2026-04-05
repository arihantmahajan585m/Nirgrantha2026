import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  BookOpen,
  Brain,
  Database,
  Play,
  RotateCcw,
  Shield,
  Square,
  Target,
  TrendingUp,
  Workflow,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  getAcademicControlStore,
  resolveExamStatus,
  subscribeAcademicControl,
} from "../utils/academicUpdates";
import { listSecurityEvents } from "../utils/securityEvents";

interface MLLabPageProps {
  onBack: () => void;
}

// ───────────────────────────────────────────────
// Shared helpers
// ───────────────────────────────────────────────
const TechBadge = ({ label, color }: { label: string; color: string }) => (
  <span
    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold"
    style={{
      background: `${color}22`,
      color,
      border: `1px solid ${color}55`,
    }}
  >
    {label}
  </span>
);

const HowItWorksPanel = ({
  steps,
  techBadges,
  formula,
}: {
  steps: { num: string; title: string; desc: string }[];
  techBadges: { label: string; color: string }[];
  formula?: React.ReactNode;
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = steps[activeStepIndex] ?? steps[0];
  const primaryColor = techBadges[0]?.color ?? "#818cf8";
  const secondaryColor = techBadges[1]?.color ?? "#34d399";
  const accentColor = techBadges[2]?.color ?? "#f472b6";
  const traceBadges =
    techBadges.length > 0
      ? techBadges
      : [
          { label: "Attention", color: "#818cf8" },
          { label: "Reasoning", color: "#34d399" },
          { label: "Output", color: "#f472b6" },
        ];
  const thinkingNodes = [
    {
      id: "input",
      x: 14,
      y: 18,
      label: "Live Input Layer",
      title: steps[0]?.title ?? "Signal Intake",
      detail: steps[0]?.desc ?? "Incoming data enters the model pipeline.",
      color: "#4f46e5",
      stepIndex: 0,
      shape: "rect" as const,
    },
    {
      id: "process",
      x: 42,
      y: 16,
      label: "Feature Processing",
      title: steps[1]?.title ?? "Feature Encoding",
      detail:
        steps[1]?.desc ?? "Signals are normalized into model-ready vectors.",
      color: primaryColor,
      stepIndex: Math.min(1, Math.max(steps.length - 1, 0)),
      shape: "rect" as const,
    },
    {
      id: "activation",
      x: 75,
      y: 20,
      label: "Activation Mapping",
      title: traceBadges[0]?.label ?? "Attention Heatmap",
      detail: "The model highlights which signals deserve focus first.",
      color: "#0ea5e9",
      stepIndex: Math.min(1, Math.max(steps.length - 1, 0)),
      shape: "rect" as const,
    },
    {
      id: "context",
      x: 15,
      y: 55,
      label: "Context Memory",
      title: traceBadges[1]?.label ?? "Context Layer",
      detail: "Stored patterns, history, and live state shape the response.",
      color: secondaryColor,
      stepIndex: 0,
      shape: "rect" as const,
    },
    {
      id: "thinking",
      x: 49,
      y: 49,
      label: "AI Model Thinking Layer",
      title: activeStep?.title ?? "Reasoning Core",
      detail:
        activeStep?.desc ??
        "The active model stage is currently reasoning over the signal.",
      color: accentColor,
      stepIndex: activeStepIndex,
      shape: "circle" as const,
    },
    {
      id: "decision",
      x: 76,
      y: 57,
      label: "Decision Head",
      title: steps[2]?.title ?? "Decision Scoring",
      detail:
        steps[2]?.desc ?? "The model ranks outputs and confidence bands.",
      color: "#8b5cf6",
      stepIndex: Math.min(2, Math.max(steps.length - 1, 0)),
      shape: "rect" as const,
    },
    {
      id: "explain",
      x: 35,
      y: 81,
      label: "Explainability Layer",
      title: steps[3]?.title ?? "Contribution Trace",
      detail:
        steps[3]?.desc ??
        "Feature influence is surfaced through transparent contribution traces.",
      color: "#f43f5e",
      stepIndex: Math.min(3, Math.max(steps.length - 1, 0)),
      shape: "rect" as const,
    },
    {
      id: "visual",
      x: 73,
      y: 82,
      label: "Real-time Visualization",
      title: "Live Dashboard",
      detail: "Predictions, rankings, and monitoring are rendered in real time.",
      color: "#ef4444",
      stepIndex: Math.min(3, Math.max(steps.length - 1, 0)),
      shape: "circle" as const,
    },
  ];
  const dottedPaths = [
    { id: "input-process", d: "M 18 18 C 26 18, 30 16, 37 16", stepIndex: 0 },
    { id: "process-activation", d: "M 47 16 C 58 16, 64 19, 70 20", stepIndex: 1 },
    { id: "process-context", d: "M 40 20 C 34 31, 24 40, 18 51", stepIndex: 1 },
    { id: "context-thinking", d: "M 20 55 C 30 55, 37 52, 44 50", stepIndex: 0 },
    { id: "activation-thinking", d: "M 70 22 C 66 32, 60 40, 54 47", stepIndex: 1 },
    { id: "thinking-decision", d: "M 55 49 C 62 49, 66 54, 71 56", stepIndex: 2 },
    { id: "thinking-explain", d: "M 47 56 C 46 66, 42 73, 37 78", stepIndex: 3 },
    { id: "decision-visual", d: "M 75 62 C 75 69, 74 75, 73 79", stepIndex: 2 },
    { id: "explain-visual", d: "M 41 81 C 52 83, 60 84, 68 82", stepIndex: 3 },
  ];
  const contributionRows = traceBadges.slice(0, 6).map((badge, index) => ({
    ...badge,
    value: Math.max(18, 92 - index * 11 + activeStepIndex * 3),
  }));
  const attentionCells = Array.from({ length: 12 }, (_, index) => {
    const badge = traceBadges[index % traceBadges.length];
    return {
      color: badge?.color ?? primaryColor,
      label: badge?.label ?? `Signal ${index + 1}`,
      strength: 32 + ((index + activeStepIndex * 2) % 5) * 15,
    };
  });
  const liveSummaryLines = [
    `Active stage: ${activeStep?.title ?? "Thinking layer"}`,
    `Dotted route: ${thinkingNodes[0]?.title ?? "Input"} -> ${thinkingNodes[4]?.title ?? "Core"} -> ${thinkingNodes[7]?.title ?? "Dashboard"}`,
    `Explainability: ${thinkingNodes[6]?.title ?? "Contribution trace"}`,
  ];

  useEffect(() => {
    if (steps.length <= 1) return;
    const interval = window.setInterval(() => {
      setActiveStepIndex((current) => (current + 1) % steps.length);
    }, 2600);
    return () => window.clearInterval(interval);
  }, [steps.length]);

  return (
    <div
      className="relative mt-6 overflow-hidden rounded-[28px] p-6 sm:p-7"
      style={{
        background:
          "linear-gradient(180deg, rgba(19,24,61,0.96) 0%, rgba(7,10,28,0.98) 100%)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow:
          "0 24px 60px rgba(2,8,23,0.28), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(129,140,248,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(52,211,153,0.14),transparent_30%),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:auto,auto,28px_28px,28px_28px] opacity-80" />

      <div className="relative z-10">
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em]"
                style={{
                  background: `${primaryColor}18`,
                  color: primaryColor,
                  border: `1px solid ${primaryColor}40`,
                }}
              >
                AI Model Thinking Layer
              </span>
              <span
                className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em]"
                style={{
                  background: `${secondaryColor}18`,
                  color: secondaryColor,
                  border: `1px solid ${secondaryColor}40`,
                }}
              >
                Live Flow Through Dotted Line
              </span>
            </div>
            <h3 className="text-xl font-bold text-white sm:text-2xl">
              How It Works
            </h3>
            <p className="mt-2 text-sm leading-7" style={{ color: "#a8b0d0" }}>
              This thinking layer now reads like a model research board: live
              input enters through dotted paths, activation focus moves into the
              reasoning core, and the output side shows explainability,
              confidence, and visualization together.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Stages", value: String(steps.length) },
              { label: "Tech", value: String(techBadges.length) },
              { label: "Live", value: activeStep?.num ?? "1" },
            ].map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl px-4 py-3 text-center"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <p className="text-lg font-bold text-white">{metric.value}</p>
                <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: "#8f9ac4" }}>
                  {metric.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-4">
            <div className="hidden md:block ai-thinking-canvas">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="ai-thinking-svg"
                aria-hidden="true"
              >
                {dottedPaths.map((path) => (
                  <path
                    key={path.id}
                    d={path.d}
                    className={`ai-thinking-link ${activeStepIndex === path.stepIndex ? "active" : ""}`}
                    style={
                      {
                        "--thinking-link-color":
                          thinkingNodes.find(
                            (node) => node.stepIndex === path.stepIndex,
                          )?.color ?? primaryColor,
                      } as React.CSSProperties
                    }
                  />
                ))}
              </svg>

              {thinkingNodes.map((node) => {
                const isActive =
                  node.id === "thinking" || activeStepIndex === node.stepIndex;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onMouseEnter={() => setActiveStepIndex(node.stepIndex)}
                    onFocus={() => setActiveStepIndex(node.stepIndex)}
                    className={`ai-thinking-node ${node.shape === "circle" ? "ai-thinking-node-circle" : ""} ${node.id === "thinking" ? "ai-thinking-node-core" : ""} ${isActive ? "active" : ""}`}
                    style={
                      {
                        left: `${node.x}%`,
                        top: `${node.y}%`,
                        "--thinking-node-color": node.color,
                      } as React.CSSProperties
                    }
                  >
                    <span className="ai-thinking-node-label">{node.label}</span>
                    <strong className="ai-thinking-node-title">{node.title}</strong>
                    <span className="ai-thinking-node-copy">{node.detail}</span>
                  </button>
                );
              })}

              <div className="ai-thinking-footer">
                {liveSummaryLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </div>
            </div>

            <div className="grid gap-3 md:hidden">
              {thinkingNodes.map((node) => {
                const isActive =
                  node.id === "thinking" || activeStepIndex === node.stepIndex;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setActiveStepIndex(node.stepIndex)}
                    className="rounded-2xl p-4 text-left transition-all"
                    style={{
                      background: isActive
                        ? "linear-gradient(135deg, rgba(129,140,248,0.18), rgba(52,211,153,0.12))"
                        : "rgba(255,255,255,0.05)",
                      border: isActive
                        ? `1px solid ${node.color}80`
                        : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <p
                      className="text-[11px] font-bold uppercase tracking-[0.22em]"
                      style={{ color: node.color }}
                    >
                      {node.label}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {node.title}
                    </p>
                    <p
                      className="mt-2 text-xs leading-6"
                      style={{ color: "#aab4d7" }}
                    >
                      {node.detail}
                    </p>
                  </button>
                );
              })}
            </div>

            <div
              className="rounded-[24px] p-5"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <p
                className="mb-3 text-[11px] font-bold uppercase tracking-[0.24em]"
                style={{ color: "#f8b4ff" }}
              >
                Technology mesh
              </p>
              <div className="flex flex-wrap gap-2">
                {traceBadges.map((badge) => (
                  <TechBadge
                    key={badge.label}
                    label={badge.label}
                    color={badge.color}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div
              className="rounded-[24px] p-5"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: `1px solid ${primaryColor}35`,
              }}
            >
              <p
                className="text-[11px] font-bold uppercase tracking-[0.24em]"
                style={{ color: primaryColor }}
              >
                Active thought
              </p>
              <h4 className="mt-3 text-xl font-bold text-white">
                Step {activeStep?.num}: {activeStep?.title}
              </h4>
              <p
                className="mt-2 text-sm leading-7"
                style={{ color: "#c3cae6" }}
              >
                {activeStep?.desc}
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[
                  { label: "Focus", value: `${78 + activeStepIndex * 4}%` },
                  {
                    label: "Signals",
                    value: `${Math.max(4, traceBadges.length)}`,
                  },
                  { label: "Output", value: activeStep?.num ?? "1" },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-2xl px-3 py-3 text-center"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <p className="text-base font-bold text-white">
                      {metric.value}
                    </p>
                    <p
                      className="text-[10px] uppercase tracking-[0.18em]"
                      style={{ color: "#8f9ac4" }}
                    >
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-[24px] p-5"
              style={{
                background: "rgba(247,249,255,0.95)",
                border: "1px solid rgba(148,163,184,0.28)",
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p
                    className="text-[11px] font-bold uppercase tracking-[0.24em]"
                    style={{ color: "#4f46e5" }}
                  >
                    Explainability dashboard
                  </p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    Feature contribution stack
                  </p>
                </div>
                <div
                  className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em]"
                  style={{
                    background: `${accentColor}18`,
                    color: accentColor,
                    border: `1px solid ${accentColor}33`,
                  }}
                >
                  Live ranking
                </div>
              </div>

              <div className="mt-4 space-y-3">
                {contributionRows.map((row) => (
                  <div key={row.label}>
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <span className="text-xs font-medium text-slate-700">
                        {row.label}
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {row.value}%
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${row.value}%`,
                          background: row.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-[24px] p-5"
              style={{
                background: "rgba(247,249,255,0.95)",
                border: "1px solid rgba(148,163,184,0.28)",
              }}
            >
              <p
                className="text-[11px] font-bold uppercase tracking-[0.24em]"
                style={{ color: "#0f172a" }}
              >
                Attention heat grid
              </p>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {attentionCells.map((cell, index) => (
                  <div
                    key={`${cell.label}-${index}`}
                    title={`${cell.label}: ${cell.strength}%`}
                    className="rounded-2xl p-3"
                    style={{
                      background: `linear-gradient(180deg, ${cell.color}22, ${cell.color}${Math.round(
                        cell.strength * 2.2,
                      )
                        .toString(16)
                        .padStart(2, "0")})`,
                      border: `1px solid ${cell.color}40`,
                    }}
                  >
                    <div
                      className="mx-auto h-9 w-9 rounded-full"
                      style={{
                        background: `radial-gradient(circle, ${cell.color}, transparent 72%)`,
                        boxShadow: `0 0 18px ${cell.color}55`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {formula && (
              <div
                className="rounded-[24px] p-5 font-mono text-sm"
                style={{
                  background: "rgba(0,0,0,0.28)",
                  border: `1px solid ${secondaryColor}35`,
                  color: "#dbe4ff",
                }}
              >
                <p
                  className="mb-3 text-[11px] font-bold uppercase tracking-[0.24em]"
                  style={{ color: secondaryColor }}
                >
                  Core equation
                </p>
                <div className="overflow-x-auto whitespace-nowrap text-center">
                  {formula}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ───────────────────────────────────────────────
// TAB 1: Reinforcement Learning
// ───────────────────────────────────────────────
interface LiveAppSnapshot {
  studentCount: number;
  teacherCount: number;
  academicFeedCount: number;
  attachmentCount: number;
  reportCardCount: number;
  examCount: number;
  securityEventCount: number;
  reviewEventCount: number;
  deliveryCount: number;
  technologyCount: number;
  latestAcademicTitle: string;
  latestAcademicCategory: string;
  latestReportStudent: string;
  latestSecurityAction: string;
  nextExamLabel: string;
}

const LIVE_TECHNOLOGY_MESH = [
  { label: "Reinforcement Learning", color: "#4ade80" },
  { label: "Risk Prediction", color: "#f87171" },
  { label: "Skill Vectors", color: "#818cf8" },
  { label: "Knowledge Retrieval", color: "#fbbf24" },
  { label: "Vector Search", color: "#22d3ee" },
  { label: "Report Synthesis", color: "#c084fc" },
  { label: "Event Streaming", color: "#2dd4bf" },
  { label: "Zero-Trust Security", color: "#f472b6" },
  { label: "Faculty Upload Mesh", color: "#60a5fa" },
  { label: "Student Update Delivery", color: "#34d399" },
  { label: "Cyber Alert Correlation", color: "#fb7185" },
  { label: "TypeScript + React", color: "#93c5fd" },
];

const FLOW_NODE_POSITIONS = [
  { x: "-40%", y: "-18%" },
  { x: "40%", y: "-14%" },
  { x: "34%", y: "24%" },
  { x: "-34%", y: "24%" },
];

const DEFAULT_LIVE_SNAPSHOT: LiveAppSnapshot = {
  studentCount: 0,
  teacherCount: 0,
  academicFeedCount: 0,
  attachmentCount: 0,
  reportCardCount: 0,
  examCount: 0,
  securityEventCount: 0,
  reviewEventCount: 0,
  deliveryCount: 0,
  technologyCount: LIVE_TECHNOLOGY_MESH.length,
  latestAcademicTitle: "Waiting for faculty uploads",
  latestAcademicCategory: "Academic Control Panel",
  latestReportStudent: "Arihant Mahajan",
  latestSecurityAction: "Security stream is idle",
  nextExamLabel: "Exam engine standing by",
};

function readStoredCollectionLength(key: string) {
  if (typeof window === "undefined") {
    return 0;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return 0;
    }

    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.length : 0;
  } catch {
    return 0;
  }
}

function createLiveAppSnapshot(): LiveAppSnapshot {
  const academicStore = getAcademicControlStore();
  const securityEvents = listSecurityEvents();
  const latestAcademic = academicStore.feed[0];
  const latestReport = academicStore.reportCards[0];
  const reviewEvents = securityEvents.filter(
    (event) => event.severity === "REVIEW",
  );
  const attachmentCount = academicStore.feed.reduce(
    (total, item) => total + item.attachments.length,
    0,
  );
  const nextExam =
    [...academicStore.exams]
      .sort(
        (left, right) =>
          new Date(`${left.date}T${left.time || "09:00"}`).getTime() -
          new Date(`${right.date}T${right.time || "09:00"}`).getTime(),
      )
      .find((exam) => resolveExamStatus(exam) !== "Completed") ??
    academicStore.exams[0];

  return {
    studentCount: readStoredCollectionLength("nirgrantha.mock.students"),
    teacherCount: readStoredCollectionLength("nirgrantha.mock.teachers"),
    academicFeedCount: academicStore.feed.length,
    attachmentCount,
    reportCardCount: academicStore.reportCards.length,
    examCount: academicStore.exams.length,
    securityEventCount: securityEvents.length,
    reviewEventCount: reviewEvents.length,
    deliveryCount:
      academicStore.feed.length +
      academicStore.reportCards.length +
      academicStore.exams.length,
    technologyCount: LIVE_TECHNOLOGY_MESH.length,
    latestAcademicTitle:
      latestAcademic?.title ?? DEFAULT_LIVE_SNAPSHOT.latestAcademicTitle,
    latestAcademicCategory:
      latestAcademic?.category ?? DEFAULT_LIVE_SNAPSHOT.latestAcademicCategory,
    latestReportStudent:
      latestReport?.studentName ?? DEFAULT_LIVE_SNAPSHOT.latestReportStudent,
    latestSecurityAction:
      securityEvents[0]?.action ?? DEFAULT_LIVE_SNAPSHOT.latestSecurityAction,
    nextExamLabel: nextExam
      ? `${nextExam.name} | ${nextExam.branch} Sem ${nextExam.semester}`
      : DEFAULT_LIVE_SNAPSHOT.nextExamLabel,
  };
}

function useLiveAppSnapshot() {
  const [snapshot, setSnapshot] = useState<LiveAppSnapshot>(
    DEFAULT_LIVE_SNAPSHOT,
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const refresh = () => {
      setSnapshot(createLiveAppSnapshot());
    };

    refresh();
    const interval = window.setInterval(refresh, 2400);
    const unsubscribeAcademic = subscribeAcademicControl(refresh);
    window.addEventListener("storage", refresh);

    return () => {
      window.clearInterval(interval);
      unsubscribeAcademic();
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return snapshot;
}

function useAcademicControlState() {
  const [store, setStore] = useState(getAcademicControlStore());

  useEffect(() => {
    const refresh = () => {
      setStore(getAcademicControlStore());
    };

    refresh();
    return subscribeAcademicControl(refresh);
  }, []);

  return store;
}

function useSecurityEventState() {
  const [events, setEvents] = useState(listSecurityEvents());

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const refresh = () => {
      setEvents(listSecurityEvents());
    };

    refresh();
    const interval = window.setInterval(refresh, 2400);
    window.addEventListener("storage", refresh);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return events;
}

const LiveFlowPanel = ({ snapshot }: { snapshot: LiveAppSnapshot }) => {
  const [activeStageIndex, setActiveStageIndex] = useState(0);

  const stages = [
    {
      title: "Data Mesh",
      value: `${snapshot.studentCount + snapshot.teacherCount}`,
      detail: "bulk profiles in the live roster",
      helper:
        "Students and teachers imported into the app become the live profile layer.",
      color: "#34d399",
      icon: Database,
    },
    {
      title: "Intelligence Core",
      value: `${snapshot.academicFeedCount}`,
      detail: "published academic signals",
      helper:
        "RL, risk prediction, skill scoring, and analytics feed the decision layer.",
      color: "#818cf8",
      icon: Brain,
    },
    {
      title: "Knowledge Graph",
      value: `${snapshot.attachmentCount}`,
      detail: "uploaded files and artifacts",
      helper:
        "Syllabus, tasks, quizzes, marks, and reports are mapped into student-ready knowledge.",
      color: "#fbbf24",
      icon: BookOpen,
    },
    {
      title: "Trust Shield",
      value: `${snapshot.securityEventCount}`,
      detail: "security events monitored",
      helper:
        "Cybersecurity telemetry and review signals protect the live academic flow.",
      color: "#f472b6",
      icon: Shield,
    },
  ];

  const activeStage = stages[activeStageIndex] ?? stages[0];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStageIndex((current) => (current + 1) % stages.length);
    }, 2600);

    return () => window.clearInterval(interval);
  }, [stages.length]);

  return (
    <div
      className="relative mt-10 overflow-hidden rounded-[32px] p-6 sm:p-8"
      style={{
        background:
          "linear-gradient(180deg, rgba(15,20,58,0.96) 0%, rgba(6,10,26,0.98) 100%)",
        border: "1px solid rgba(255,255,255,0.12)",
        boxShadow:
          "0 30px 80px rgba(2,8,23,0.32), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(52,211,153,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(129,140,248,0.18),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(244,114,182,0.12),transparent_24%),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[length:auto,auto,auto,30px_30px,30px_30px] opacity-90" />

      <div className="relative z-10">
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em]"
                style={{
                  background: "rgba(52,211,153,0.16)",
                  color: "#6ee7b7",
                  border: "1px solid rgba(110,231,183,0.32)",
                }}
              >
                App-connected intelligence
              </span>
              <span
                className="rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em]"
                style={{
                  background: "rgba(129,140,248,0.16)",
                  color: "#c7d2fe",
                  border: "1px solid rgba(199,210,254,0.25)",
                }}
              >
                Real live flow
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              NIRGRANTHA Intelligence Fabric
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7" style={{ color: "#a8b0d0" }}>
              This layer now reads actual app activity: imported student and
              teacher rosters, Academic Control Panel updates, report card
              delivery, exam tracking, and cybersecurity events.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Profiles", String(snapshot.studentCount + snapshot.teacherCount), "#6ee7b7"],
              ["Deliveries", String(snapshot.deliveryCount), "#c4b5fd"],
              ["Review Alerts", String(snapshot.reviewEventCount), "#f9a8d4"],
              ["Technologies", String(snapshot.technologyCount), "#fcd34d"],
            ].map(([label, value, accent]) => (
              <div
                key={label}
                className="rounded-2xl px-4 py-3 text-center"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <p className="text-lg font-bold" style={{ color: accent }}>
                  {value}
                </p>
                <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: "#8f9ac4" }}>
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1.05fr]">
          <div className="grid gap-4 md:grid-cols-2">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = index === activeStageIndex;
              return (
                <button
                  key={stage.title}
                  type="button"
                  onMouseEnter={() => setActiveStageIndex(index)}
                  onFocus={() => setActiveStageIndex(index)}
                  className="rounded-[24px] p-5 text-left transition-all"
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, ${stage.color}22, rgba(15,23,42,0.86))`
                      : "rgba(255,255,255,0.05)",
                    border: isActive
                      ? `1px solid ${stage.color}66`
                      : "1px solid rgba(255,255,255,0.08)",
                    boxShadow: isActive ? `0 0 28px ${stage.color}22` : "none",
                  }}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-2xl"
                      style={{
                        background: `${stage.color}20`,
                        border: `1px solid ${stage.color}38`,
                      }}
                    >
                      <Icon className="h-5 w-5" style={{ color: stage.color }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{stage.title}</p>
                      <p className="text-xs" style={{ color: "#9aa5cb" }}>
                        {stage.detail}
                      </p>
                    </div>
                  </div>
                  <p className="text-3xl font-bold text-white">{stage.value}</p>
                  <p className="mt-3 text-sm leading-6" style={{ color: "#c3cae6" }}>
                    {stage.helper}
                  </p>
                </button>
              );
            })}

            <div
              className="rounded-[24px] p-5 md:col-span-2"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div className="mb-4 flex items-center gap-2">
                <Workflow className="h-4 w-4" style={{ color: "#93c5fd" }} />
                <p className="text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: "#93c5fd" }}>
                  Technology mesh
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {LIVE_TECHNOLOGY_MESH.map((badge) => (
                  <TechBadge
                    key={badge.label}
                    label={badge.label}
                    color={badge.color}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="welcome-holo-scene" style={{ minHeight: 420 }}>
              <div className="welcome-holo-floor" />
              <div className="welcome-holo-beam" />
              <div className="welcome-holo-ring welcome-holo-ring-outer" />
              <div className="welcome-holo-ring welcome-holo-ring-mid" />
              <div className="welcome-holo-ring welcome-holo-ring-inner" />

              {stages.map((stage, index) => {
                const position = FLOW_NODE_POSITIONS[index] ?? FLOW_NODE_POSITIONS[0];
                const isActive = index === activeStageIndex;
                return (
                  <button
                    key={stage.title}
                    type="button"
                    onMouseEnter={() => setActiveStageIndex(index)}
                    onFocus={() => setActiveStageIndex(index)}
                    className={`welcome-holo-node ${isActive ? "active" : ""}`}
                    style={
                      {
                        "--node-x": position.x,
                        "--node-y": position.y,
                        "--node-color": stage.color,
                        animationDelay: `${index * 0.24}s`,
                      } as React.CSSProperties
                    }
                  >
                    <span className="text-base font-bold text-white">
                      {index + 1}
                    </span>
                    <span>{stage.title}</span>
                  </button>
                );
              })}

              <div className="welcome-holo-core">
                <span className="welcome-holo-tag">Live Flow</span>
                <h4>{activeStage.title}</h4>
                <p>{activeStage.detail}</p>
                <div className="welcome-holo-output-grid">
                  <span>{snapshot.latestAcademicCategory}</span>
                  <span>{snapshot.latestReportStudent}</span>
                  <span>{snapshot.reviewEventCount} alerts</span>
                  <span>{snapshot.examCount} exams</span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  label: "Latest Academic Push",
                  value: snapshot.latestAcademicTitle,
                  accent: "#6ee7b7",
                },
                {
                  label: "Next Exam Track",
                  value: snapshot.nextExamLabel,
                  accent: "#c4b5fd",
                },
                {
                  label: "Security Stream",
                  value: snapshot.latestSecurityAction,
                  accent: "#f9a8d4",
                },
              ].map((signal) => (
                <div
                  key={signal.label}
                  className="rounded-2xl p-4"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <p
                    className="text-[11px] font-bold uppercase tracking-[0.22em]"
                    style={{ color: signal.accent }}
                  >
                    {signal.label}
                  </p>
                  <p className="mt-3 text-sm font-medium leading-6 text-white">
                    {signal.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const GRID_SIZE = 5;
const START = 0;
const GOAL = 24;
const OBSTACLES = new Set([6, 8, 12, 16, 18]);
const ACTIONS = 4; // 0=up 1=down 2=left 3=right
const ALPHA = 0.2;
const GAMMA = 0.9;
const EPSILON_START = 0.9;
const MAX_EPISODES = 120;

type QTable = number[][];

function initQ(): QTable {
  return Array.from({ length: GRID_SIZE * GRID_SIZE }, () =>
    new Array(ACTIONS).fill(0),
  );
}

function stateToXY(s: number) {
  return { x: s % GRID_SIZE, y: Math.floor(s / GRID_SIZE) };
}

function move(state: number, action: number): number {
  const { x, y } = stateToXY(state);
  let nx = x;
  let ny = y;
  if (action === 0) ny = Math.max(0, y - 1);
  else if (action === 1) ny = Math.min(GRID_SIZE - 1, y + 1);
  else if (action === 2) nx = Math.max(0, x - 1);
  else nx = Math.min(GRID_SIZE - 1, x + 1);
  return ny * GRID_SIZE + nx;
}

function getReward(state: number): number {
  if (state === GOAL) return 10;
  if (OBSTACLES.has(state)) return -10;
  return -0.5;
}

function runEpisode(
  q: QTable,
  epsilon: number,
): { q: QTable; totalReward: number; path: number[] } {
  let state = START;
  const newQ = q.map((row) => [...row]);
  let totalReward = 0;
  const path = [state];
  for (let step = 0; step < 80; step++) {
    let action: number;
    if (Math.random() < epsilon) {
      action = Math.floor(Math.random() * ACTIONS);
    } else {
      action = newQ[state].indexOf(Math.max(...newQ[state]));
    }
    const next = move(state, action);
    const reward = getReward(next);
    totalReward += reward;
    const maxNextQ = Math.max(...newQ[next]);
    newQ[state][action] +=
      ALPHA * (reward + GAMMA * maxNextQ - newQ[state][action]);
    state = next;
    path.push(state);
    if (state === GOAL || OBSTACLES.has(state)) break;
  }
  return { q: newQ, totalReward, path };
}

function RLTab() {
  const [q, setQ] = useState<QTable>(initQ());
  const [agentPos, setAgentPos] = useState(START);
  const [episode, setEpisode] = useState(0);
  const [rewards, setRewards] = useState<number[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [speed, setSpeed] = useState([3]);
  const trainingRef = useRef(false);
  const episodeRef = useRef(0);
  const qRef = useRef<QTable>(initQ());
  const rewardsRef = useRef<number[]>([]);
  const stepTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    trainingRef.current = false;
    setIsTraining(false);
    setQ(initQ());
    setAgentPos(START);
    setEpisode(0);
    setRewards([]);
    episodeRef.current = 0;
    qRef.current = initQ();
    rewardsRef.current = [];
    if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
  }, []);

  const runNextStep = useCallback(() => {
    if (!trainingRef.current) return;
    const ep = episodeRef.current;
    if (ep >= MAX_EPISODES) {
      setIsTraining(false);
      trainingRef.current = false;
      return;
    }
    const epsilon = Math.max(0.05, EPSILON_START * 0.97 ** ep);
    const { q: newQ, totalReward, path } = runEpisode(qRef.current, epsilon);
    qRef.current = newQ;
    rewardsRef.current = [...rewardsRef.current, totalReward];
    episodeRef.current = ep + 1;
    setQ(newQ.map((r) => [...r]));
    setRewards([...rewardsRef.current]);
    setEpisode(ep + 1);
    // animate path
    path.forEach((pos, idx) => {
      stepTimerRef.current = setTimeout(
        () => {
          setAgentPos(pos);
        },
        idx * (120 / speed[0]),
      );
    });
    const totalDelay = path.length * (120 / speed[0]);
    stepTimerRef.current = setTimeout(runNextStep, totalDelay + 80);
  }, [speed]);

  const startTraining = useCallback(() => {
    if (trainingRef.current) return;
    trainingRef.current = true;
    setIsTraining(true);
    runNextStep();
  }, [runNextStep]);

  const stopTraining = useCallback(() => {
    trainingRef.current = false;
    setIsTraining(false);
    if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (stepTimerRef.current) clearTimeout(stepTimerRef.current);
    };
  }, []);

  // Q-value heatmap: max Q value per cell
  const maxQValues = q.map((row) => Math.max(...row));
  const minQ = Math.min(...maxQValues);
  const maxQ = Math.max(...maxQValues) || 1;

  function qColor(val: number) {
    const t = (val - minQ) / (maxQ - minQ + 0.001);
    if (t < 0.33) {
      const u = t / 0.33;
      return `rgb(${Math.round(20 + u * 30)}, ${Math.round(30 + u * 40)}, ${Math.round(180 - u * 20)})`;
    }
    if (t < 0.66) {
      const u = (t - 0.33) / 0.33;
      return `rgb(${Math.round(50 + u * 150)}, ${Math.round(70 + u * 120)}, ${Math.round(160 - u * 140)})`;
    }
    const u = (t - 0.66) / 0.34;
    return `rgb(${Math.round(200 + u * 55)}, ${Math.round(190 - u * 160)}, ${Math.round(20 - u * 5)})`;
  }

  // Reward chart
  const chartW = 400;
  const chartH = 120;
  const chartPad = 24;
  const innerW = chartW - chartPad * 2;
  const innerH = chartH - chartPad * 2;
  const minR = rewards.length ? Math.min(...rewards) : -20;
  const maxR = rewards.length ? Math.max(...rewards) : 10;
  const rewardPoints = rewards
    .map((r, i) => {
      const px = chartPad + (i / (MAX_EPISODES - 1)) * innerW;
      const py =
        chartPad + innerH - ((r - minR) / (maxR - minR + 0.001)) * innerH;
      return `${px},${py}`;
    })
    .join(" ");

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Grid World */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <h3 className="text-white font-bold mb-1">Grid World Environment</h3>
          <p className="text-xs mb-4" style={{ color: "#9ca3af" }}>
            5×5 grid — Agent learns to reach 🎯 from 🤖
          </p>
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => {
              const isAgent = i === agentPos;
              const isGoal = i === GOAL;
              const isObstacle = OBSTACLES.has(i);
              const isStart = i === START && agentPos !== START;
              const qVal = maxQValues[i];
              const bg = isObstacle
                ? "#7f1d1d"
                : isGoal
                  ? "#14532d"
                  : qColor(qVal);
              return (
                <div
                  key={`cell-${Math.floor(i / GRID_SIZE)}-${i % GRID_SIZE}`}
                  className="aspect-square rounded-lg flex items-center justify-center text-lg font-bold relative"
                  style={{
                    background: bg,
                    border: isAgent
                      ? "3px solid #fbbf24"
                      : isGoal
                        ? "2px solid #4ade80"
                        : "1px solid rgba(255,255,255,0.08)",
                    transition: "background 0.3s ease",
                    boxShadow: isAgent
                      ? "0 0 12px rgba(251,191,36,0.8)"
                      : undefined,
                  }}
                >
                  {isAgent
                    ? "🤖"
                    : isGoal
                      ? "🎯"
                      : isObstacle
                        ? "🚧"
                        : isStart
                          ? "·"
                          : ""}
                  <span
                    className="absolute bottom-0.5 right-1 text-[8px] opacity-70"
                    style={{ color: "rgba(255,255,255,0.7)" }}
                  >
                    {qVal.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div className="flex gap-3 text-xs">
              <span style={{ color: "#86efac" }}>🎯 Goal (+10)</span>
              <span style={{ color: "#fca5a5" }}>🚧 Obstacle (−10)</span>
              <span style={{ color: "#9ca3af" }}>Step: −0.5</span>
            </div>
          </div>
          {/* Q-value legend */}
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs" style={{ color: "#9ca3af" }}>
              Q-value:
            </span>
            <div
              className="flex-1 h-3 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, rgb(20,30,180), rgb(200,120,20), rgb(255,60,15))",
              }}
            />
            <span className="text-xs" style={{ color: "#9ca3af" }}>
              Low → High
            </span>
          </div>
        </div>

        {/* Stats + Chart */}
        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Episode",
                value: `${episode}/${MAX_EPISODES}`,
                color: "#818cf8",
              },
              {
                label: "Reward",
                value: rewards.length
                  ? rewards[rewards.length - 1].toFixed(1)
                  : "—",
                color: "#34d399",
              },
              {
                label: "Epsilon",
                value: episode
                  ? Math.max(0.05, EPSILON_START * 0.97 ** episode).toFixed(2)
                  : EPSILON_START.toFixed(2),
                color: "#fbbf24",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl p-3 text-center"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <p className="text-2xl font-bold" style={{ color: s.color }}>
                  {s.value}
                </p>
                <p className="text-xs mt-1" style={{ color: "#9ca3af" }}>
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Reward chart */}
          <div
            className="rounded-2xl p-4"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <p className="text-sm font-semibold text-white mb-2">
              Reward per Episode
            </p>
            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="w-full"
              role="img"
              aria-label="Reward per episode chart"
            >
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                <line
                  key={t}
                  x1={chartPad}
                  y1={chartPad + innerH * (1 - t)}
                  x2={chartPad + innerW}
                  y2={chartPad + innerH * (1 - t)}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                />
              ))}
              {/* Zero line */}
              {minR < 0 && maxR > 0 && (
                <line
                  x1={chartPad}
                  y1={
                    chartPad + innerH - (-minR / (maxR - minR + 0.001)) * innerH
                  }
                  x2={chartPad + innerW}
                  y2={
                    chartPad + innerH - (-minR / (maxR - minR + 0.001)) * innerH
                  }
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="1"
                  strokeDasharray="4,4"
                />
              )}
              {/* Line */}
              {rewards.length > 1 && (
                <polyline
                  points={rewardPoints}
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              )}
              {/* Area */}
              {rewards.length > 1 && (
                <polyline
                  points={`${chartPad},${chartPad + innerH} ${rewardPoints} ${chartPad + ((rewards.length - 1) / (MAX_EPISODES - 1)) * innerW},${chartPad + innerH}`}
                  fill="rgba(52,211,153,0.1)"
                  stroke="none"
                />
              )}
              {/* Labels */}
              <text
                x={chartPad}
                y={chartPad + innerH + 14}
                fontSize="9"
                fill="#6b7280"
              >
                Ep 0
              </text>
              <text
                x={chartPad + innerW - 20}
                y={chartPad + innerH + 14}
                fontSize="9"
                fill="#6b7280"
              >
                {MAX_EPISODES}
              </text>
            </svg>
            <p
              className="text-xs text-center mt-1"
              style={{ color: "#6b7280" }}
            >
              Episode → Reward trends upward as agent learns
            </p>
          </div>

          {/* Controls */}
          <div
            className="rounded-2xl p-4 space-y-3"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="flex gap-2">
              <Button
                data-ocid="rl.primary_button"
                onClick={isTraining ? stopTraining : startTraining}
                className="flex-1 font-bold"
                style={{
                  background: isTraining
                    ? "#7f1d1d"
                    : "linear-gradient(135deg, #059669, #047857)",
                  color: "white",
                  border: "none",
                }}
              >
                {isTraining ? (
                  <>
                    <Square className="w-4 h-4 mr-1" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-1" />
                    Start Training
                  </>
                )}
              </Button>
              <Button
                data-ocid="rl.secondary_button"
                onClick={reset}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>
            <div>
              <p className="text-xs mb-2" style={{ color: "#9ca3af" }}>
                Speed: {speed[0]}x
              </p>
              <Slider
                data-ocid="rl.toggle"
                value={speed}
                onValueChange={setSpeed}
                min={1}
                max={8}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <HowItWorksPanel
        steps={[
          {
            num: "1",
            title: "Initialize",
            desc: "Agent starts at top-left with random Q-values",
          },
          {
            num: "2",
            title: "Explore / Exploit",
            desc: "ε-greedy policy: random action (explore) or best Q action (exploit)",
          },
          {
            num: "3",
            title: "Receive Reward",
            desc: "+10 goal, −10 obstacle, −0.5 per step to encourage efficiency",
          },
          {
            num: "4",
            title: "Update Q-Table",
            desc: "Bellman equation updates Q-value for current state-action pair",
          },
        ]}
        formula={
          <>
            <span style={{ color: "#a5b4fc" }}>Q(s,a)</span>{" "}
            <span style={{ color: "#e2e8f0" }}>←</span>{" "}
            <span style={{ color: "#a5b4fc" }}>Q(s,a)</span>
            {" + "}
            <span style={{ color: "#34d399" }}>α</span>
            <span style={{ color: "#e2e8f0" }}>[r + </span>
            <span style={{ color: "#fbbf24" }}>γ·max Q(s′,a′)</span>
            <span style={{ color: "#e2e8f0" }}> − </span>
            <span style={{ color: "#a5b4fc" }}>Q(s,a)</span>
            <span style={{ color: "#e2e8f0" }}>]</span>
          </>
        }
        techBadges={[
          { label: "Python", color: "#4ade80" },
          { label: "TensorFlow", color: "#fb923c" },
          { label: "scikit-learn", color: "#60a5fa" },
          { label: "NumPy", color: "#a78bfa" },
          { label: "OpenAI Gym", color: "#f472b6" },
        ]}
      />
    </div>
  );
}

// ───────────────────────────────────────────────
// TAB 2: Dropout Risk Prediction
// ───────────────────────────────────────────────
function RiskGauge({ risk }: { risk: number }) {
  const R = 80;
  const cx = 110;
  const cy = 110;
  const startAngle = 200;
  const totalDeg = 300;
  const riskAngle = startAngle + (risk / 100) * totalDeg;

  function polarToXY(angle: number, r: number) {
    const a = ((angle - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  function describeArc(start: number, end: number, r: number) {
    const s = polarToXY(start, r);
    const e = polarToXY(end, r);
    const large = (end - start) % 360 > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
  }

  const color = risk < 30 ? "#4ade80" : risk < 60 ? "#fbbf24" : "#f87171";
  const needle = polarToXY(riskAngle, 60);

  return (
    <svg
      viewBox="0 0 220 140"
      className="w-full max-w-[240px] mx-auto"
      role="img"
      aria-label="Dropout risk gauge"
    >
      {/* Background track */}
      <path
        d={describeArc(200, 500, R)}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* Green zone */}
      <path
        d={describeArc(200, 300, R)}
        fill="none"
        stroke="rgba(74,222,128,0.25)"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* Amber zone */}
      <path
        d={describeArc(300, 380, R)}
        fill="none"
        stroke="rgba(251,191,36,0.25)"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* Red zone */}
      <path
        d={describeArc(380, 500, R)}
        fill="none"
        stroke="rgba(248,113,113,0.25)"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* Active arc */}
      <path
        d={describeArc(200, riskAngle, R)}
        fill="none"
        stroke={color}
        strokeWidth="14"
        strokeLinecap="round"
        style={{ transition: "all 0.5s ease" }}
      />
      {/* Needle */}
      <line
        x1={cx}
        y1={cy}
        x2={needle.x}
        y2={needle.y}
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        style={{ transition: "all 0.5s ease" }}
      />
      <circle
        cx={cx}
        cy={cy}
        r="5"
        fill={color}
        style={{ transition: "fill 0.5s ease" }}
      />
      {/* Label */}
      <text
        x={cx}
        y={cy - 16}
        textAnchor="middle"
        fontSize="24"
        fontWeight="bold"
        fill={color}
        style={{ transition: "fill 0.5s ease" }}
      >
        {risk.toFixed(0)}%
      </text>
      <text x={cx} y={cy - 3} textAnchor="middle" fontSize="9" fill="#9ca3af">
        Dropout Risk
      </text>
      <text x={24} y={130} fontSize="8" fill="#4ade80">
        LOW
      </text>
      <text x={cx - 12} y={26} fontSize="8" fill="#fbbf24">
        MED
      </text>
      <text x={180} y={130} fontSize="8" fill="#f87171">
        HIGH
      </text>
    </svg>
  );
}

function FeatureBar({
  label,
  pct,
  color,
  delay,
}: { label: string; pct: number; color: string; delay: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 300 + delay);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div className="flex items-center gap-3">
      <p
        className="text-xs text-right w-28 flex-shrink-0"
        style={{ color: "#d1d5db" }}
      >
        {label}
      </p>
      <div
        className="flex-1 rounded-full overflow-hidden h-4"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="h-full rounded-full flex items-center justify-end pr-2 text-xs font-bold text-white"
          style={{
            width: `${width}%`,
            background: color,
            transition: "width 1s ease",
          }}
        >
          {pct}%
        </div>
      </div>
    </div>
  );
}

function ROCCurve({ auc }: { auc: number }) {
  const W = 200;
  const H = 200;
  const PAD = 24;
  const iW = W - PAD * 2;
  const iH = H - PAD * 2;
  // Simulated ROC: starts at (0,0), curves up steeply, ends at (1,1)
  const pts = [
    [0, 0],
    [0.05, 0.25],
    [0.1, 0.5],
    [0.15, 0.68],
    [0.2, 0.78],
    [0.3, 0.87],
    [0.45, 0.92],
    [0.6, 0.96],
    [0.8, 0.98],
    [1, 1],
  ];
  const svgPts = pts
    .map(([x, y]) => `${PAD + x * iW},${PAD + iH - y * iH}`)
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      role="img"
      aria-label="Training metrics chart"
    >
      {/* Grid */}
      {[0.25, 0.5, 0.75].map((t) => (
        <line
          key={t}
          x1={PAD}
          y1={PAD + iH * (1 - t)}
          x2={PAD + iW}
          y2={PAD + iH * (1 - t)}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      ))}
      {/* Diagonal baseline */}
      <line
        x1={PAD}
        y1={PAD + iH}
        x2={PAD + iW}
        y2={PAD}
        stroke="rgba(255,255,255,0.2)"
        strokeWidth="1"
        strokeDasharray="4,4"
      />
      {/* ROC fill */}
      <polyline
        points={`${PAD},${PAD + iH} ${svgPts} ${PAD + iW},${PAD + iH}`}
        fill="rgba(99,102,241,0.15)"
        stroke="none"
      />
      {/* ROC curve */}
      <polyline
        points={svgPts}
        fill="none"
        stroke="#818cf8"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Axes */}
      <line
        x1={PAD}
        y1={PAD}
        x2={PAD}
        y2={PAD + iH}
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
      />
      <line
        x1={PAD}
        y1={PAD + iH}
        x2={PAD + iW}
        y2={PAD + iH}
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1"
      />
      <text
        x={PAD + iW / 2}
        y={H - 4}
        fontSize="8"
        fill="#6b7280"
        textAnchor="middle"
      >
        False Positive Rate
      </text>
      <text
        x="10"
        y={PAD + iH / 2}
        fontSize="8"
        fill="#6b7280"
        textAnchor="middle"
        transform={`rotate(-90, 10, ${PAD + iH / 2})`}
      >
        True Positive Rate
      </text>
      <text
        x={PAD + iW - 8}
        y={PAD + 14}
        fontSize="9"
        fill="#a5b4fc"
        fontWeight="bold"
      >
        AUC={auc}
      </text>
    </svg>
  );
}

function DropoutTab() {
  const [attendance, setAttendance] = useState([72]);
  const [assignments, setAssignments] = useState([65]);
  const [marks, setMarks] = useState([58]);
  const [participation, setParticipation] = useState([5]);

  const risk = Math.min(
    100,
    Math.max(
      0,
      100 -
        (attendance[0] * 0.35 +
          assignments[0] * 0.22 +
          marks[0] * 0.28 +
          participation[0] * 10 * 0.15),
    ),
  );

  const sliders = [
    {
      label: "Attendance %",
      value: attendance,
      onChange: setAttendance,
      color: "#34d399",
      id: "dropout.toggle",
    },
    {
      label: "Assignment Completion %",
      value: assignments,
      onChange: setAssignments,
      color: "#60a5fa",
      id: "dropout.checkbox",
    },
    {
      label: "Average Marks %",
      value: marks,
      onChange: setMarks,
      color: "#fbbf24",
      id: "dropout.radio",
    },
    {
      label: "Participation (0–10)",
      value: participation,
      onChange: setParticipation,
      color: "#f472b6",
      max: 10,
      id: "dropout.switch",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: sliders + gauge */}
        <div
          className="rounded-2xl p-5 space-y-5"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <h3 className="text-white font-bold">Input Student Features</h3>
          <div className="space-y-5">
            {sliders.map(({ label, value, onChange, color, max, id }) => (
              <div key={label}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm" style={{ color: "#d1d5db" }}>
                    {label}
                  </span>
                  <span className="text-sm font-bold" style={{ color }}>
                    {value[0]}
                    {max === 10 ? "/10" : "%"}
                  </span>
                </div>
                <Slider
                  data-ocid={id}
                  value={value}
                  onValueChange={onChange}
                  min={0}
                  max={max ?? 100}
                  step={max === 10 ? 0.5 : 1}
                  className="w-full"
                />
              </div>
            ))}
          </div>
          <div
            className="rounded-xl p-4 flex flex-col items-center"
            style={{
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <RiskGauge risk={risk} />
            <p
              className="text-sm font-bold mt-1"
              style={{
                color:
                  risk < 30 ? "#4ade80" : risk < 60 ? "#fbbf24" : "#f87171",
              }}
            >
              {risk < 30
                ? "Low Risk — On Track"
                : risk < 60
                  ? "Medium Risk — Needs Attention"
                  : "High Risk — Immediate Intervention"}
            </p>
          </div>
        </div>

        {/* Right: feature importance, confusion matrix, ROC */}
        <div className="space-y-4">
          {/* Feature importance */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <h3 className="text-white font-bold mb-3">Feature Importance</h3>
            <div className="space-y-2.5">
              <FeatureBar
                label="Attendance"
                pct={35}
                color="linear-gradient(90deg,#059669,#34d399)"
                delay={0}
              />
              <FeatureBar
                label="Average Marks"
                pct={28}
                color="linear-gradient(90deg,#d97706,#fbbf24)"
                delay={100}
              />
              <FeatureBar
                label="Assignments"
                pct={22}
                color="linear-gradient(90deg,#2563eb,#60a5fa)"
                delay={200}
              />
              <FeatureBar
                label="Participation"
                pct={15}
                color="linear-gradient(90deg,#db2777,#f472b6)"
                delay={300}
              />
            </div>
          </div>

          {/* Confusion matrix + ROC */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className="rounded-2xl p-4"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <p className="text-xs font-bold text-white mb-2">
                Confusion Matrix
              </p>
              <div className="grid grid-cols-2 gap-1.5 text-center text-xs">
                {[
                  {
                    label: "TP",
                    val: 412,
                    color: "rgba(52,211,153,0.3)",
                    tc: "#4ade80",
                  },
                  {
                    label: "FP",
                    val: 38,
                    color: "rgba(251,191,36,0.2)",
                    tc: "#fbbf24",
                  },
                  {
                    label: "FN",
                    val: 51,
                    color: "rgba(251,191,36,0.2)",
                    tc: "#fbbf24",
                  },
                  {
                    label: "TN",
                    val: 499,
                    color: "rgba(52,211,153,0.3)",
                    tc: "#4ade80",
                  },
                ].map((cell) => (
                  <div
                    key={cell.label}
                    className="rounded-lg py-2 px-1"
                    style={{ background: cell.color }}
                  >
                    <p className="font-bold" style={{ color: cell.tc }}>
                      {cell.val}
                    </p>
                    <p style={{ color: "#9ca3af" }}>{cell.label}</p>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="rounded-2xl p-4"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <p className="text-xs font-bold text-white mb-1">ROC Curve</p>
              <ROCCurve auc={0.91} />
            </div>
          </div>
        </div>
      </div>

      <HowItWorksPanel
        steps={[
          {
            num: "1",
            title: "Collect Training Data",
            desc: "10,000 historical student records with labels (dropped/stayed)",
          },
          {
            num: "2",
            title: "Feature Engineering",
            desc: "Extract attendance, marks, assignments, participation as numeric features",
          },
          {
            num: "3",
            title: "Train Gradient Boosting",
            desc: "XGBoost model learns non-linear patterns; SHAP values explain predictions",
          },
          {
            num: "4",
            title: "Predict & Alert",
            desc: "Model outputs risk % in real-time; alerts trigger at configurable thresholds",
          },
        ]}
        techBadges={[
          { label: "Python", color: "#4ade80" },
          { label: "scikit-learn", color: "#60a5fa" },
          { label: "XGBoost", color: "#fb923c" },
          { label: "pandas", color: "#a78bfa" },
          { label: "SHAP", color: "#f472b6" },
        ]}
      />
    </div>
  );
}

// ───────────────────────────────────────────────
// TAB 3: Skill Gap Analyzer
// ───────────────────────────────────────────────
function RadarChart({
  current,
  required,
  labels,
}: { current: number[]; required: number[]; labels: string[] }) {
  const cx = 120;
  const cy = 120;
  const R = 85;
  const N = labels.length;
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 400);
    return () => clearTimeout(t);
  }, []);

  function angleFor(i: number) {
    return (i / N) * 2 * Math.PI - Math.PI / 2;
  }
  function point(i: number, val: number) {
    const a = angleFor(i);
    const r = (val / 100) * R;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }
  function labelPoint(i: number) {
    const a = angleFor(i);
    const r = R + 18;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  }

  const currentPoly = current
    .map((v, i) => point(i, drawn ? v : 0))
    .map((p) => `${p.x},${p.y}`)
    .join(" ");
  const requiredPoly = required
    .map((v, i) => point(i, drawn ? v : 0))
    .map((p) => `${p.x},${p.y}`)
    .join(" ");

  return (
    <svg
      viewBox="0 0 240 240"
      className="w-full max-w-[280px] mx-auto"
      role="img"
      aria-label="Skill radar chart"
    >
      {/* Rings */}
      {[20, 40, 60, 80, 100].map((v) => (
        <polygon
          key={v}
          points={Array.from({ length: N }, (_, i) => point(i, v))
            .map((p) => `${p.x},${p.y}`)
            .join(" ")}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="1"
        />
      ))}
      {/* Spokes */}
      {Array.from({ length: N }, (_, i) => (
        <line
          key={`axis-${labels[i]}`}
          x1={cx}
          y1={cy}
          x2={point(i, 100).x}
          y2={point(i, 100).y}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="1"
        />
      ))}
      {/* Required polygon */}
      <polygon
        points={requiredPoly}
        fill="rgba(99,102,241,0.15)"
        stroke="#818cf8"
        strokeWidth="2"
        style={{ transition: "all 1.2s ease" }}
      />
      {/* Current polygon */}
      <polygon
        points={currentPoly}
        fill="rgba(52,211,153,0.2)"
        stroke="#34d399"
        strokeWidth="2"
        style={{ transition: "all 1s ease" }}
      />
      {/* Labels */}
      {labels.map((label, i) => {
        const { x, y } = labelPoint(i);
        return (
          <text
            key={label}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="8"
            fill="#d1d5db"
            fontWeight="500"
          >
            {label}
          </text>
        );
      })}
      {/* Legend */}
      <rect x={8} y={8} width={8} height={8} rx={2} fill="#34d399" />
      <text x={20} y={15} fontSize="8" fill="#d1d5db">
        Current
      </text>
      <rect x={8} y={22} width={8} height={8} rx={2} fill="#818cf8" />
      <text x={20} y={29} fontSize="8" fill="#d1d5db">
        GATE Required
      </text>
    </svg>
  );
}

function LossAccuracyChart({ type }: { type: "loss" | "accuracy" }) {
  const EPOCHS = 50;
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      frame += 2;
      setProgress(Math.min(EPOCHS, frame));
      if (frame >= EPOCHS) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const W = 280;
  const H = 100;
  const PAD = 20;
  const iW = W - PAD * 2;
  const iH = H - PAD * 2;

  function lossAt(ep: number) {
    return 2.4 * Math.exp(-0.06 * ep) + 0.25;
  }
  function accAt(ep: number) {
    return 60 + 34 * (1 - Math.exp(-0.1 * ep));
  }

  const points = Array.from({ length: progress + 1 }, (_, i) => {
    const v = type === "loss" ? lossAt(i) : accAt(i);
    const minV = type === "loss" ? 0.25 : 60;
    const maxV = type === "loss" ? 2.4 : 94;
    const px = PAD + (i / (EPOCHS - 1)) * iW;
    const py = PAD + iH - ((v - minV) / (maxV - minV)) * iH;
    return `${px},${py}`;
  }).join(" ");

  const color = type === "loss" ? "#f87171" : "#34d399";
  const label = type === "loss" ? "Training Loss" : "Validation Accuracy";

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <p className="text-xs font-bold mb-2" style={{ color }}>
        {label}
      </p>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        role="img"
        aria-label="Training metrics chart"
      >
        {[0.25, 0.5, 0.75].map((t) => (
          <line
            key={t}
            x1={PAD}
            y1={PAD + iH * (1 - t)}
            x2={PAD + iW}
            y2={PAD + iH * (1 - t)}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="1"
          />
        ))}
        {progress > 1 && (
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        )}
        {progress > 1 && (
          <polyline
            points={`${PAD},${PAD + iH} ${points} ${PAD + (progress / (EPOCHS - 1)) * iW},${PAD + iH}`}
            fill={`${color}18`}
            stroke="none"
          />
        )}
        <text x={PAD} y={PAD + iH + 12} fontSize="8" fill="#6b7280">
          Epoch 0
        </text>
        <text x={PAD + iW - 20} y={PAD + iH + 12} fontSize="8" fill="#6b7280">
          Ep {EPOCHS}
        </text>
        <text
          x={PAD + iW}
          y={PAD + 8}
          fontSize="8"
          fill={color}
          textAnchor="end"
        >
          {type === "loss"
            ? lossAt(progress).toFixed(2)
            : `${accAt(progress).toFixed(1)}%`}
        </text>
      </svg>
    </div>
  );
}

function SkillBar({
  label,
  value,
  color,
  delay,
}: { label: string; value: number; color: string; delay: number }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setW(value), 500 + delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs" style={{ color: "#d1d5db" }}>
          {label}
        </span>
        <span className="text-xs font-bold" style={{ color }}>
          {value}%
        </span>
      </div>
      <div
        className="h-3 rounded-full overflow-hidden"
        style={{ background: "rgba(255,255,255,0.08)" }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${w}%`,
            background: color,
            transition: "width 1s ease",
          }}
        />
      </div>
    </div>
  );
}

function SkillTab() {
  const radarLabels = [
    "Data Structures",
    "Algorithms",
    "System Design",
    "Math / Logic",
    "Domain Know.",
    "Communication",
  ];
  const current = [75, 68, 42, 55, 60, 50];
  const required = [90, 88, 70, 85, 72, 55];

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Radar */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <h3 className="text-white font-bold mb-1">
            Skill Profile vs GATE Requirements
          </h3>
          <p className="text-xs mb-3" style={{ color: "#9ca3af" }}>
            Based on GitHub & LeetCode activity analysis
          </p>
          <RadarChart
            current={current}
            required={required}
            labels={radarLabels}
          />
          <div className="grid grid-cols-2 gap-2 mt-4">
            {radarLabels.map((label, i) => (
              <div
                key={label}
                className="flex items-center justify-between text-xs"
              >
                <span style={{ color: "#d1d5db" }}>{label}</span>
                <span
                  className="font-bold"
                  style={{
                    color: current[i] >= required[i] ? "#4ade80" : "#fbbf24",
                  }}
                >
                  {current[i]} / {required[i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: charts + bars */}
        <div className="space-y-4">
          <LossAccuracyChart type="loss" />
          <LossAccuracyChart type="accuracy" />

          <div
            className="rounded-2xl p-4 space-y-3"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <p className="text-sm font-bold text-white">
              Skill Score Progression
            </p>
            <SkillBar
              label="Data Structures"
              value={75}
              color="#34d399"
              delay={0}
            />
            <SkillBar
              label="Algorithms"
              value={68}
              color="#60a5fa"
              delay={100}
            />
            <SkillBar
              label="System Design"
              value={42}
              color="#fbbf24"
              delay={200}
            />
            <SkillBar
              label="Math / Logic"
              value={55}
              color="#a78bfa"
              delay={300}
            />
            <SkillBar
              label="Domain Knowledge"
              value={60}
              color="#f472b6"
              delay={400}
            />
            <SkillBar
              label="Communication"
              value={50}
              color="#fb923c"
              delay={500}
            />
          </div>
        </div>
      </div>

      <HowItWorksPanel
        steps={[
          {
            num: "1",
            title: "GitHub Feature Extraction",
            desc: "Languages, repositories, commit frequency, stars, contribution graph",
          },
          {
            num: "2",
            title: "LeetCode Feature Extraction",
            desc: "Problems solved by difficulty, topic tags, contest rating, streaks",
          },
          {
            num: "3",
            title: "K-Means Clustering",
            desc: "Groups student profiles into skill archetypes (beginner/intermediate/expert)",
          },
          {
            num: "4",
            title: "Neural Network Scoring",
            desc: "3-layer MLP maps skill cluster + raw features → exam readiness score per exam",
          },
        ]}
        techBadges={[
          { label: "Python", color: "#4ade80" },
          { label: "TensorFlow", color: "#fb923c" },
          { label: "scikit-learn", color: "#60a5fa" },
          { label: "FastAPI", color: "#a78bfa" },
          { label: "NumPy", color: "#f472b6" },
          { label: "GitHub API", color: "#fbbf24" },
        ]}
      />
    </div>
  );
}

// ───────────────────────────────────────────────
// MAIN PAGE
// ───────────────────────────────────────────────
const KnowledgeTab = () => {
  const academicStore = useAcademicControlState();
  const itemsWithFiles = academicStore.feed.filter(
    (item) => item.attachments.length > 0,
  );
  const recentItems = academicStore.feed.slice(0, 5);
  const branches = Array.from(
    new Set(
      academicStore.feed
        .map((item) => item.branch)
        .filter((value): value is string => Boolean(value)),
    ),
  );
  const semesters = Array.from(
    new Set(
      academicStore.feed
        .map((item) => item.semester)
        .filter((value): value is string => Boolean(value)),
    ),
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div
          className="rounded-[28px] p-5 sm:p-6"
          style={{
            background:
              "linear-gradient(180deg, rgba(18,26,61,0.92) 0%, rgba(10,16,38,0.96) 100%)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: "#fbbf24" }}>
                Knowledge Retrieval
              </p>
              <h3 className="mt-2 text-2xl font-bold text-white">
                Academic Knowledge Graph
              </h3>
            </div>
            <div
              className="rounded-2xl px-4 py-3 text-center"
              style={{
                background: "rgba(251,191,36,0.12)",
                border: "1px solid rgba(251,191,36,0.22)",
              }}
            >
              <p className="text-lg font-bold" style={{ color: "#fcd34d" }}>
                {itemsWithFiles.length}
              </p>
              <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: "#cbd5f5" }}>
                File-backed updates
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                label: "Uploaded Assets",
                value: academicStore.feed
                  .reduce((total, item) => total + item.attachments.length, 0)
                  .toString(),
                color: "#60a5fa",
              },
              {
                label: "Student Reports",
                value: academicStore.reportCards.length.toString(),
                color: "#c084fc",
              },
              {
                label: "Exam Routes",
                value: academicStore.exams.length.toString(),
                color: "#34d399",
              },
            ].map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl p-4"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <p
                  className="text-[11px] font-bold uppercase tracking-[0.22em]"
                  style={{ color: metric.color }}
                >
                  {metric.label}
                </p>
                <p className="mt-3 text-2xl font-bold text-white">{metric.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-3">
            {recentItems.length > 0 ? (
              recentItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl p-4"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <TechBadge label={item.category} color="#fbbf24" />
                    {item.branch && <TechBadge label={item.branch} color="#60a5fa" />}
                    {item.semester && (
                      <TechBadge label={`Sem ${item.semester}`} color="#34d399" />
                    )}
                  </div>
                  <p className="mt-3 text-base font-semibold text-white">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm leading-6" style={{ color: "#aeb8da" }}>
                    {item.summary}
                  </p>
                  <p className="mt-2 text-xs" style={{ color: "#8f9ac4" }}>
                    Audience: {item.audience} | Attachments: {item.attachments.length}
                  </p>
                </div>
              ))
            ) : (
              <div
                className="rounded-2xl p-5"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <p className="text-white">No academic uploads yet.</p>
                <p className="mt-2 text-sm leading-6" style={{ color: "#aeb8da" }}>
                  Publish syllabus, tasks, quizzes, marks, or notifications
                  from the Faculty Academic Control Panel and they will appear
                  here as live knowledge sources.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div
            className="rounded-[28px] p-5 sm:p-6"
            style={{
              background:
                "linear-gradient(180deg, rgba(14,22,52,0.94) 0%, rgba(8,12,30,0.96) 100%)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="mb-5 flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{
                  background: "rgba(96,165,250,0.16)",
                  border: "1px solid rgba(96,165,250,0.24)",
                }}
              >
                <Workflow className="h-5 w-5" style={{ color: "#93c5fd" }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Retrieval orchestration
                </p>
                <p className="text-xs" style={{ color: "#93a0c5" }}>
                  {branches.length || 1} branches | {semesters.length || 1} semesters
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                {
                  label: "Normalize uploads",
                  value: `${academicStore.feed.length} sources`,
                  width: Math.min(96, 30 + academicStore.feed.length * 8),
                  color: "#60a5fa",
                },
                {
                  label: "Attach metadata",
                  value: `${branches.length || 1} branches / ${semesters.length || 1} semesters`,
                  width: Math.min(94, 38 + (branches.length + semesters.length) * 7),
                  color: "#34d399",
                },
                {
                  label: "Student delivery",
                  value: `${academicStore.reportCards.length + academicStore.exams.length} live pushes`,
                  width: Math.min(
                    98,
                    36 +
                      (academicStore.reportCards.length + academicStore.exams.length) * 6,
                  ),
                  color: "#c084fc",
                },
              ].map((stage) => (
                <div key={stage.label}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">{stage.label}</p>
                    <p className="text-xs" style={{ color: "#9aa5cb" }}>
                      {stage.value}
                    </p>
                  </div>
                  <div
                    className="h-2 rounded-full"
                    style={{ background: "rgba(255,255,255,0.08)" }}
                  >
                    <div
                      className="h-2 rounded-full transition-all duration-700"
                      style={{
                        width: `${stage.width}%`,
                        background: `linear-gradient(90deg, ${stage.color}, rgba(255,255,255,0.86))`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-[28px] p-5 sm:p-6"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: "#c4b5fd" }}>
              Student-facing surfaces
            </p>
            <div className="mt-4 grid gap-3">
              {[
                "Student Updates receives uploaded files, marks, notifications, and report cards.",
                "Faculty Intelligence Hub remains the publishing source of truth for academic content.",
                "Institute Command Center can reuse the same synchronized academic signal layer.",
              ].map((line) => (
                <div
                  key={line}
                  className="rounded-2xl px-4 py-3"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <p className="text-sm leading-6 text-white">{line}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <HowItWorksPanel
        steps={[
          {
            num: "1",
            title: "Capture Faculty Uploads",
            desc: "Syllabus, tasks, quizzes, notifications, marks, and report cards enter through Academic Control Panel actions.",
          },
          {
            num: "2",
            title: "Structure Metadata",
            desc: "Branch, semester, audience, subject, and student targeting become a retrieval-ready academic graph.",
          },
          {
            num: "3",
            title: "Index Knowledge",
            desc: "Files, summaries, and delivery intents are synchronized so students can see the right content in Updates.",
          },
          {
            num: "4",
            title: "Deliver Live Context",
            desc: "The app opens the right files, shows the right report cards, and keeps new uploads visible in the student experience.",
          },
        ]}
        techBadges={[
          { label: "RAG Retrieval", color: "#fbbf24" },
          { label: "Metadata Filters", color: "#60a5fa" },
          { label: "File Preview", color: "#34d399" },
          { label: "Report Synthesis", color: "#c084fc" },
          { label: "Event Sync", color: "#2dd4bf" },
          { label: "Student Delivery", color: "#f472b6" },
          { label: "React + TypeScript", color: "#93c5fd" },
          { label: "Academic Feed Graph", color: "#fb7185" },
        ]}
      />
    </div>
  );
};

const SecurityTab = () => {
  const academicStore = useAcademicControlState();
  const events = useSecurityEventState();
  const reviewEvents = events.filter((event) => event.severity === "REVIEW");
  const safeEvents = events.filter((event) => event.severity === "SAFE");
  const protectedArtifacts =
    academicStore.feed.reduce((total, item) => total + item.attachments.length, 0) +
    academicStore.reportCards.length;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div
            className="rounded-[28px] p-5 sm:p-6"
            style={{
              background:
                "linear-gradient(180deg, rgba(20,14,45,0.94) 0%, rgba(10,9,24,0.98) 100%)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: "#f472b6" }}>
                  Cybersecurity Intelligence
                </p>
                <h3 className="mt-2 text-2xl font-bold text-white">
                  Security Mesh Monitor
                </h3>
              </div>
              <div
                className="rounded-2xl px-4 py-3 text-center"
                style={{
                  background: "rgba(244,114,182,0.14)",
                  border: "1px solid rgba(244,114,182,0.24)",
                }}
              >
                <p className="text-lg font-bold" style={{ color: "#f9a8d4" }}>
                  {reviewEvents.length}
                </p>
                <p className="text-[11px] uppercase tracking-[0.2em]" style={{ color: "#cbd5f5" }}>
                  Review events
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                {
                  label: "Safe Events",
                  value: safeEvents.length.toString(),
                  color: "#34d399",
                },
                {
                  label: "Protected Files",
                  value: protectedArtifacts.toString(),
                  color: "#60a5fa",
                },
                {
                  label: "Exam Routes",
                  value: academicStore.exams.length.toString(),
                  color: "#c084fc",
                },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl p-4"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <p
                    className="text-[11px] font-bold uppercase tracking-[0.22em]"
                    style={{ color: metric.color }}
                  >
                    {metric.label}
                  </p>
                  <p className="mt-3 text-2xl font-bold text-white">{metric.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              {events.length > 0 ? (
                events.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    className="rounded-2xl p-4"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <TechBadge
                        label={event.severity === "REVIEW" ? "Review" : "Safe"}
                        color={event.severity === "REVIEW" ? "#f472b6" : "#34d399"}
                      />
                      <TechBadge label={event.source} color="#93c5fd" />
                      <TechBadge label={event.device} color="#c084fc" />
                    </div>
                    <p className="mt-3 text-base font-semibold text-white">
                      {event.action}
                    </p>
                    <p className="mt-1 text-sm leading-6" style={{ color: "#aeb8da" }}>
                      {event.details}
                    </p>
                    <p className="mt-2 text-xs" style={{ color: "#8f9ac4" }}>
                      {event.network}
                    </p>
                  </div>
                ))
              ) : (
                <div
                  className="rounded-2xl p-5"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <p className="text-white">No live security events yet.</p>
                  <p className="mt-2 text-sm leading-6" style={{ color: "#aeb8da" }}>
                    As you use the app, uploads, session activity, and trust
                    checks will populate this stream and feed the cybersecurity
                    intelligence layer.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div
            className="rounded-[28px] p-5 sm:p-6"
            style={{
              background:
                "linear-gradient(180deg, rgba(19,19,52,0.94) 0%, rgba(9,10,26,0.96) 100%)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <div className="mb-5 flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{
                  background: "rgba(244,114,182,0.16)",
                  border: "1px solid rgba(244,114,182,0.24)",
                }}
              >
                <Shield className="h-5 w-5" style={{ color: "#f9a8d4" }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  Zero-trust response layers
                </p>
                <p className="text-xs" style={{ color: "#93a0c5" }}>
                  Protection around academic data and live student delivery
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  title: "Session telemetry",
                  detail: "User device, network, and source context are logged into the event stream.",
                },
                {
                  title: "Policy engine",
                  detail: "Review vs safe events define whether an action stays in a trusted path.",
                },
                {
                  title: "Artifact protection",
                  detail: "Uploaded academic files and report cards stay inside the app-controlled preview flow.",
                },
                {
                  title: "Cross-module correlation",
                  detail: "Institute, faculty, and student activity can be correlated inside one security timeline.",
                },
              ].map((layer) => (
                <div
                  key={layer.title}
                  className="rounded-2xl p-4"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <p className="text-sm font-semibold text-white">{layer.title}</p>
                  <p className="mt-2 text-sm leading-6" style={{ color: "#aeb8da" }}>
                    {layer.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-[28px] p-5 sm:p-6"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.24em]" style={{ color: "#93c5fd" }}>
              Protected app surfaces
            </p>
            <div className="mt-4 grid gap-3">
              {[
                `Student Updates: ${academicStore.feed.length} synchronized academic messages`,
                `Report Card Delivery: ${academicStore.reportCards.length} student-specific outputs`,
                `Faculty Publishing Flow: ${academicStore.feed.length} active publish records`,
                `Institute Operations: ${events.length} tracked cybersecurity events`,
              ].map((line) => (
                <div
                  key={line}
                  className="rounded-2xl px-4 py-3"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <p className="text-sm leading-6 text-white">{line}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <HowItWorksPanel
        steps={[
          {
            num: "1",
            title: "Collect Session Telemetry",
            desc: "The app records trusted activity signals like uploads, network context, device labels, and source modules.",
          },
          {
            num: "2",
            title: "Score Security Risk",
            desc: "Each event is classified as SAFE or REVIEW to create an evolving cybersecurity timeline.",
          },
          {
            num: "3",
            title: "Correlate Academic Movement",
            desc: "The security mesh checks how academic files, marks, reports, and exam routes move through the platform.",
          },
          {
            num: "4",
            title: "Protect Delivery Paths",
            desc: "Student-visible updates stay inside the monitored app flow so content remains trusted and reviewable.",
          },
        ]}
        techBadges={[
          { label: "Zero-Trust", color: "#f472b6" },
          { label: "Session Telemetry", color: "#60a5fa" },
          { label: "Policy Engine", color: "#34d399" },
          { label: "Audit Trail", color: "#c084fc" },
          { label: "Alert Correlation", color: "#fb7185" },
          { label: "Protected Preview", color: "#fbbf24" },
          { label: "Event Streaming", color: "#2dd4bf" },
          { label: "Cyber Intelligence", color: "#93c5fd" },
        ]}
      />
    </div>
  );
};

export default function MLLabPage({ onBack }: MLLabPageProps) {
  const snapshot = useLiveAppSnapshot();

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse at 20% 10%, #1a1f4e 0%, #0d1035 50%, #050810 100%)",
      }}
    >
      {/* Decorative orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div
          className="orb animate-float-slow"
          style={{
            width: 500,
            height: 500,
            top: "-15%",
            right: "-10%",
            background:
              "radial-gradient(circle, #4f46e5 0%, #7c3aed 60%, transparent 100%)",
            opacity: 0.08,
          }}
        />
        <div
          className="orb animate-float-mid"
          style={{
            width: 350,
            height: 350,
            bottom: "5%",
            left: "-8%",
            background:
              "radial-gradient(circle, #059669 0%, #047857 60%, transparent 100%)",
            opacity: 0.1,
            animationDelay: "3s",
          }}
        />
      </div>

      {/* Header */}
      <div
        className="sticky top-0 z-40 px-4 sm:px-8 py-4 flex items-center gap-4"
        style={{
          background: "rgba(5,8,16,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <button
          type="button"
          data-ocid="mllab.secondary_button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-colors"
          style={{
            color: "#9ca3af",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
          >
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-white text-sm">NIR</span>
            <span className="font-bold text-sm" style={{ color: "#00e5a0" }}>
              GRANTHA
            </span>
            <span className="ml-2 text-xs" style={{ color: "#6b7280" }}>
              AI/ML Lab
            </span>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Badge
            className="text-xs"
            style={{
              background: "rgba(79,70,229,0.3)",
              color: "#a5b4fc",
              border: "1px solid rgba(165,180,252,0.3)",
            }}
          >
            Interactive
          </Badge>
          <Badge
            className="text-xs"
            style={{
              background: "rgba(5,150,105,0.3)",
              color: "#6ee7b7",
              border: "1px solid rgba(110,231,183,0.3)",
            }}
          >
            Live Simulation
          </Badge>
        </div>
      </div>

      {/* Hero */}
      <div
        className="px-4 sm:px-8 py-12 text-center relative"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="mb-5 flex flex-wrap justify-center gap-3">
            {[
              { icon: Brain, label: "Q-Learning Agent", color: "#34d399" },
              { icon: Target, label: "Dropout Prediction", color: "#f87171" },
              {
                icon: TrendingUp,
                label: "Skill Gap Analysis",
                color: "#818cf8",
              },
              { icon: Workflow, label: "Knowledge Retrieval", color: "#fbbf24" },
              { icon: Shield, label: "Cyber Defense Mesh", color: "#f472b6" },
              { icon: Database, label: "Live Data Fabric", color: "#60a5fa" },
            ].map(({ icon: Icon, label, color }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color,
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </div>
            ))}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            AI / ML{" "}
            <span
              style={{
                color: "#818cf8",
                textShadow: "0 0 30px rgba(129,140,248,0.5)",
              }}
            >
              Model Lab
            </span>
          </h1>
          <p className="text-lg max-w-xl mx-auto" style={{ color: "#9ca3af" }}>
            Live visualizations showing how machine learning, retrieval,
            automation, and cybersecurity power NIRGRANTHA's intelligence layer
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Profiles in Flow",
                value: snapshot.studentCount + snapshot.teacherCount,
                accent: "#6ee7b7",
              },
              {
                label: "Academic Deliveries",
                value: snapshot.deliveryCount,
                accent: "#c4b5fd",
              },
              {
                label: "Review Alerts",
                value: snapshot.reviewEventCount,
                accent: "#f9a8d4",
              },
              {
                label: "Technology Mesh",
                value: snapshot.technologyCount,
                accent: "#fcd34d",
              },
            ].map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl px-4 py-4 text-left"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <p className="text-[11px] uppercase tracking-[0.22em]" style={{ color: "#9aa5cb" }}>
                  {metric.label}
                </p>
                <p className="mt-2 text-2xl font-bold" style={{ color: metric.accent }}>
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 sm:px-8 py-8 max-w-6xl mx-auto">
        <LiveFlowPanel snapshot={snapshot} />
        <Tabs defaultValue="rl" className="w-full">
          <TabsList
            data-ocid="mllab.tab"
            className="mt-8 w-full mb-8 p-1.5 rounded-2xl grid grid-cols-2 lg:grid-cols-5"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <TabsTrigger
              value="rl"
              className="rounded-xl py-3 text-sm font-bold transition-all data-[state=active]:text-white"
              style={{ color: "#9ca3af" }}
            >
              <Brain className="w-4 h-4 mr-1.5 inline" />
              Reinforcement Learning
            </TabsTrigger>
            <TabsTrigger
              value="dropout"
              className="rounded-xl py-3 text-sm font-bold transition-all data-[state=active]:text-white"
              style={{ color: "#9ca3af" }}
            >
              <Target className="w-4 h-4 mr-1.5 inline" />
              Dropout Prediction
            </TabsTrigger>
            <TabsTrigger
              value="skill"
              className="rounded-xl py-3 text-sm font-bold transition-all data-[state=active]:text-white"
              style={{ color: "#9ca3af" }}
            >
              <TrendingUp className="w-4 h-4 mr-1.5 inline" />
              Skill Gap Analyzer
            </TabsTrigger>
            <TabsTrigger
              value="knowledge"
              className="rounded-xl py-3 text-sm font-bold transition-all data-[state=active]:text-white"
              style={{ color: "#9ca3af" }}
            >
              <Workflow className="w-4 h-4 mr-1.5 inline" />
              Knowledge Graph
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="rounded-xl py-3 text-sm font-bold transition-all data-[state=active]:text-white"
              style={{ color: "#9ca3af" }}
            >
              <Shield className="w-4 h-4 mr-1.5 inline" />
              Security Mesh
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rl">
            <RLTab />
          </TabsContent>
          <TabsContent value="dropout">
            <DropoutTab />
          </TabsContent>
          <TabsContent value="skill">
            <SkillTab />
          </TabsContent>
          <TabsContent value="knowledge">
            <KnowledgeTab />
          </TabsContent>
          <TabsContent value="security">
            <SecurityTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
