import {
  BarChart3,
  BookOpen,
  BrainCircuit,
  Cpu,
  Monitor,
  Network,
  Plug,
  Settings,
} from "lucide-react";
import { useEffect, useState } from "react";
import AcademicControl from "./faculty-hub/AcademicControl";
import AgenticAIHub from "./faculty-hub/AgenticAIHub";
import ClassTopicTracking from "./faculty-hub/ClassTopicTracking";
import FacultyNetworking from "./faculty-hub/FacultyNetworking";
import Integrations from "./faculty-hub/Integrations";
import SmartboardTeaching from "./faculty-hub/SmartboardTeaching";
import StudentPerformance from "./faculty-hub/StudentPerformance";
import { subscribeFacultyHubNavigation } from "@/utils/facultyHubStore";

type SubSection =
  | "smartboard"
  | "tracking"
  | "performance"
  | "networking"
  | "integrations"
  | "control"
  | "ai-agents";

interface SubNav {
  id: SubSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  gradient: string;
  glow: string;
}

const subNavItems: SubNav[] = [
  {
    id: "smartboard",
    label: "Smartboard Teaching",
    icon: Monitor,
    gradient: "linear-gradient(135deg, #818cf8, #6366f1)",
    glow: "0 4px 15px rgba(99,102,241,0.55)",
  },
  {
    id: "tracking",
    label: "Class & Topic Tracking",
    icon: BookOpen,
    gradient: "linear-gradient(135deg, #34d399, #059669)",
    glow: "0 4px 15px rgba(5,150,105,0.5)",
  },
  {
    id: "performance",
    label: "Student Performance",
    icon: BarChart3,
    gradient: "linear-gradient(135deg, #fb923c, #ea580c)",
    glow: "0 4px 15px rgba(234,88,12,0.5)",
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: Plug,
    gradient: "linear-gradient(135deg, #22d3ee, #0891b2)",
    glow: "0 4px 15px rgba(8,145,178,0.5)",
  },
  {
    id: "networking",
    label: "Faculty Networking",
    icon: Network,
    gradient: "linear-gradient(135deg, #e879f9, #d946ef)",
    glow: "0 4px 15px rgba(217,70,239,0.5)",
  },
  {
    id: "control",
    label: "Academic Control Panel",
    icon: Settings,
    gradient: "linear-gradient(135deg, #fbbf24, #d97706)",
    glow: "0 4px 15px rgba(217,119,6,0.5)",
  },
  {
    id: "ai-agents",
    label: "ChatGPT (Faculty)",
    icon: Cpu,
    badge: "OpenAI",
    gradient: "linear-gradient(135deg, #10a37f, #0d8a6a)",
    glow: "0 4px 15px rgba(16,185,129,0.45)",
  },
];

const subComponents: Record<SubSection, React.ComponentType> = {
  smartboard: SmartboardTeaching,
  tracking: ClassTopicTracking,
  performance: StudentPerformance,
  networking: FacultyNetworking,
  integrations: Integrations,
  control: AcademicControl,
  "ai-agents": AgenticAIHub,
};

export default function FacultyIntelligenceHub() {
  const [activeSection, setActiveSection] = useState<SubSection>("smartboard");

  useEffect(() => {
    return subscribeFacultyHubNavigation((section) => {
      if (section === "integrations" || section === "networking") {
        setActiveSection(section);
      }
    });
  }, []);

  const ActiveSubComponent = subComponents[activeSection];

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #1e1b4b 0%, #312e81 20%, #3730a3 50%, #4338ca 75%, #6366f1 100%)",
      }}
    >
      {/* Floating ambient orbs */}
      <div
        className="orb animate-float-slow"
        style={{
          width: 480,
          height: 480,
          top: "-12%",
          right: "-10%",
          background: "radial-gradient(circle, #818cf8 0%, transparent 70%)",
          opacity: 0.18,
        }}
      />
      <div
        className="orb animate-float-mid"
        style={{
          width: 320,
          height: 320,
          bottom: "5%",
          left: "-6%",
          background: "radial-gradient(circle, #a855f7 0%, transparent 70%)",
          opacity: 0.14,
          animationDelay: "2.5s",
        }}
      />
      <div
        className="orb animate-float-fast"
        style={{
          width: 220,
          height: 220,
          top: "45%",
          right: "8%",
          background: "radial-gradient(circle, #60a5fa 0%, transparent 70%)",
          opacity: 0.1,
          animationDelay: "1.5s",
        }}
      />
      {/* Hub Header */}
      <div className="bg-fhub-header border-b border-fhub-border">
        <div className="max-w-[1400px] mx-auto px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-fhub-accent flex items-center justify-center shadow-fhub">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <img
                  src="/assets/generated/nirgrantha-logo-transparent.dim_400x80.png"
                  alt="NIRGRANTHA"
                  className="h-7 w-auto"
                  style={{ filter: "brightness(0) invert(1)" }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              </div>
              <h1
                className="text-xl font-display font-bold tracking-tight"
                style={{ color: "white" }}
              >
                Faculty Intelligence Hub
              </h1>
              <p
                className="text-xs mt-0.5"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                National Smart Education Control System · Academic Year 2025–26
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-fhub-badge-bg text-fhub-accent border border-fhub-accent/30">
                LIVE SYSTEM
              </span>
            </div>
          </div>
        </div>

        {/* Vibrant Gradient Pill Tab Navigation */}
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-3">
            {subNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  data-ocid={`faculty.${item.id}.tab`}
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 text-sm whitespace-nowrap transition-all duration-200 cursor-pointer rounded-full"
                  style={{
                    background: isActive
                      ? item.gradient
                      : "rgba(255,255,255,0.12)",
                    color: isActive ? "#111827" : "rgba(255,255,255,1)",
                    fontWeight: isActive ? 700 : 600,
                    boxShadow: isActive ? item.glow : "none",
                    transform: isActive ? "scale(1.03)" : "scale(1)",
                    border: isActive
                      ? "2px solid rgba(255,255,255,0.4)"
                      : "2px solid rgba(255,255,255,0.15)",
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span
                      className="ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold"
                      style={{
                        background: isActive
                          ? "rgba(0,0,0,0.2)"
                          : "rgba(255,255,255,0.3)",
                        color: isActive ? "#111827" : "white",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content with lighter gradient */}
      <main
        className="flex-1"
        style={{
          background:
            "linear-gradient(160deg, #f5f3ff 0%, #ede9fe 25%, #ddd6fe 50%, #c4b5fd 75%, #ede9fe 100%)",
        }}
      >
        <div key={activeSection} className="animate-fade-in-up">
          <ActiveSubComponent />
        </div>
      </main>
    </div>
  );
}
