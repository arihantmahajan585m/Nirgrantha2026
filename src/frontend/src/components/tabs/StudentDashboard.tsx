import {
  BellRing,
  GraduationCap,
  ShieldAlert,
  ShoppingBag,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";
import AcademicRoadmaps from "./AcademicRoadmaps";
import AntiTrapFeedback from "./AntiTrapFeedback";
import CompetitiveExamHub from "./CompetitiveExamHub";
import SkillBasedTeams from "./SkillBasedTeams";
import SmartNotifications from "./SmartNotifications";
import StudentUpdates from "./StudentUpdates";
import SustainableMarketplace from "./SustainableMarketplace";

type SubSection =
  | "academic"
  | "exam-hub"
  | "goals"
  | "updates"
  | "teams"
  | "marketplace"
  | "feedback";

interface SubNav {
  id: SubSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  glow: string;
}

const subNavItems: SubNav[] = [
  {
    id: "academic",
    label: "Academic Roadmaps",
    icon: GraduationCap,
    gradient: "linear-gradient(135deg, #34d399, #10b981)",
    glow: "0 4px 15px rgba(16,185,129,0.5)",
  },
  {
    id: "teams",
    label: "Skill-Based Teams",
    icon: Users,
    gradient: "linear-gradient(135deg, #60a5fa, #3b82f6)",
    glow: "0 4px 15px rgba(59,130,246,0.5)",
  },
  {
    id: "marketplace",
    label: "Marketplace",
    icon: ShoppingBag,
    gradient: "linear-gradient(135deg, #fb923c, #f97316)",
    glow: "0 4px 15px rgba(249,115,22,0.5)",
  },
  {
    id: "exam-hub",
    label: "Competitive Exam Hub",
    icon: Trophy,
    gradient: "linear-gradient(135deg, #fbbf24, #f59e0b)",
    glow: "0 4px 15px rgba(245,158,11,0.5)",
  },
  {
    id: "goals",
    label: "Goals & Notifications",
    icon: Target,
    gradient: "linear-gradient(135deg, #a78bfa, #8b5cf6)",
    glow: "0 4px 15px rgba(139,92,246,0.5)",
  },
  {
    id: "updates",
    label: "Updates",
    icon: BellRing,
    gradient: "linear-gradient(135deg, #2dd4bf, #14b8a6)",
    glow: "0 4px 15px rgba(20,184,166,0.45)",
  },
  {
    id: "feedback",
    label: "Anti-Trap Feedback",
    icon: ShieldAlert,
    gradient: "linear-gradient(135deg, #f87171, #ef4444)",
    glow: "0 4px 15px rgba(239,68,68,0.5)",
  },
];

const subComponents: Record<SubSection, React.ComponentType> = {
  academic: AcademicRoadmaps,
  "exam-hub": CompetitiveExamHub,
  goals: SmartNotifications,
  updates: StudentUpdates,
  teams: SkillBasedTeams,
  marketplace: SustainableMarketplace,
  feedback: AntiTrapFeedback,
};

export default function StudentDashboard() {
  const [activeSection, setActiveSection] = useState<SubSection>("academic");

  const ActiveSubComponent = subComponents[activeSection];

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #022c22 0%, #064e3b 20%, #065f46 40%, #047857 60%, #059669 80%, #10b981 100%)",
      }}
    >
      {/* Floating ambient orbs */}
      <div
        className="orb animate-float-slow"
        style={{
          width: 450,
          height: 450,
          top: "-10%",
          right: "-8%",
          background: "radial-gradient(circle, #10b981 0%, transparent 70%)",
          opacity: 0.15,
        }}
      />
      <div
        className="orb animate-float-mid"
        style={{
          width: 300,
          height: 300,
          bottom: "5%",
          left: "-5%",
          background: "radial-gradient(circle, #34d399 0%, transparent 70%)",
          opacity: 0.12,
          animationDelay: "2s",
        }}
      />
      <div
        className="orb animate-float-fast"
        style={{
          width: 200,
          height: 200,
          top: "50%",
          right: "5%",
          background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
          opacity: 0.1,
          animationDelay: "1s",
        }}
      />
      {/* Dashboard Header */}
      <div
        className="relative z-10"
        style={{
          background: "var(--student-header)",
          borderBottom: "1px solid var(--student-border)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 py-5">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, var(--student-primary) 0%, var(--student-primary-dark) 100%)",
              }}
            >
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
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
                style={{ color: "var(--student-heading)" }}
              >
                Student Dashboard
              </h1>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--student-muted)" }}
              >
                Smart Learning &amp; Growth Portal · Academic Year 2025–26
              </p>
            </div>
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
              style={{
                background: "var(--student-badge-bg)",
                color: "var(--student-primary)",
              }}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              STUDENT PORTAL
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
                  data-ocid={`student.${item.id}.tab`}
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 text-sm whitespace-nowrap transition-all duration-200 cursor-pointer rounded-full"
                  style={{
                    background: isActive
                      ? item.gradient
                      : "rgba(255,255,255,0.18)",
                    color: "#111827",
                    fontWeight: isActive ? 700 : 600,
                    boxShadow: isActive ? item.glow : "none",
                    transform: isActive ? "scale(1.03)" : "scale(1)",
                    border: isActive
                      ? "2px solid rgba(255,255,255,0.4)"
                      : "2px solid rgba(255,255,255,0.2)",
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content with lighter gradient */}
      <main
        className="flex-1 relative z-10"
        style={{
          background:
            "linear-gradient(160deg, #ecfdf5 0%, #d1fae5 40%, #a7f3d0 80%, #ecfdf5 100%)",
        }}
      >
        <div key={activeSection} className="animate-fade-in-up">
          <ActiveSubComponent />
        </div>
      </main>
    </div>
  );
}
