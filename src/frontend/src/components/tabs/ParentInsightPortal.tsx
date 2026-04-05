import {
  BookOpen,
  Building2,
  HeartHandshake,
  Printer,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useState } from "react";
import FacultyTeachingTransparency from "./parent-insight-portal/FacultyTeachingTransparency";
import InstituteDevelopmentEnvironmentReport from "./parent-insight-portal/InstituteDevelopmentEnvironmentReport";
import MonthlyParentConnectPanel from "./parent-insight-portal/MonthlyParentConnectPanel";
import StudentGrowthActivityReport from "./parent-insight-portal/StudentGrowthActivityReport";

type SubSection =
  | "student-growth"
  | "faculty-transparency"
  | "institute-development";

interface SubNav {
  id: SubSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  glow: string;
}

const subNavItems: SubNav[] = [
  {
    id: "student-growth",
    label: "Student Growth & Activity",
    icon: BookOpen,
    gradient: "linear-gradient(135deg, #7dd3fc, #0284c7)",
    glow: "0 4px 15px rgba(2,132,199,0.55)",
  },
  {
    id: "faculty-transparency",
    label: "Faculty & Teaching",
    icon: Users,
    gradient: "linear-gradient(135deg, #86efac, #16a34a)",
    glow: "0 4px 15px rgba(22,163,74,0.5)",
  },
  {
    id: "institute-development",
    label: "Institute Development",
    icon: Building2,
    gradient: "linear-gradient(135deg, #c4b5fd, #7c3aed)",
    glow: "0 4px 15px rgba(124,58,237,0.5)",
  },
];

const subComponents: Record<SubSection, React.ComponentType> = {
  "student-growth": StudentGrowthActivityReport,
  "faculty-transparency": FacultyTeachingTransparency,
  "institute-development": InstituteDevelopmentEnvironmentReport,
};

export default function ParentInsightPortal() {
  const [activeSection, setActiveSection] =
    useState<SubSection>("student-growth");

  const ActiveSubComponent = subComponents[activeSection];

  return (
    <div
      className="parent-portal-theme min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #082f49 0%, #0c4a6e 20%, #0369a1 40%, #0284c7 65%, #0ea5e9 85%, #38bdf8 100%)",
      }}
    >
      {/* Floating ambient orbs */}
      <div
        className="orb animate-float-slow"
        style={{
          width: 440,
          height: 440,
          top: "-8%",
          right: "-8%",
          background: "radial-gradient(circle, #38bdf8 0%, transparent 70%)",
          opacity: 0.18,
        }}
      />
      <div
        className="orb animate-float-mid"
        style={{
          width: 290,
          height: 290,
          bottom: "5%",
          left: "-5%",
          background: "radial-gradient(circle, #7dd3fc 0%, transparent 70%)",
          opacity: 0.13,
          animationDelay: "2s",
        }}
      />
      <div
        className="orb animate-float-fast"
        style={{
          width: 180,
          height: 180,
          top: "45%",
          right: "8%",
          background: "radial-gradient(circle, #6ee7b7 0%, transparent 70%)",
          opacity: 0.1,
          animationDelay: "1s",
        }}
      />
      {/* Portal Header */}
      <div
        className="no-print"
        style={{
          background: "var(--parent-header)",
          borderBottom: "1px solid var(--parent-border)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 py-5">
          <div className="flex items-center gap-4 flex-wrap">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, var(--parent-primary) 0%, var(--parent-primary-dark) 100%)",
              }}
            >
              <HeartHandshake className="w-6 h-6 text-white" />
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
                style={{ color: "white" }}
              >
                Parent Insight Portal
              </h1>
              <p
                className="text-xs mt-0.5"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                Transparent Smart Education Window · Academic Year 2025–26
              </p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: "var(--parent-badge-bg)",
                  color: "var(--parent-primary)",
                }}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                SECURE PORTAL
              </div>
              <button
                onClick={() => window.print()}
                type="button"
                className="print-btn flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-90 cursor-pointer"
                style={{ background: "var(--parent-primary)", color: "white" }}
                title="Print / Download Monthly Report"
              >
                <Printer className="w-4 h-4" />
                <span className="hidden sm:inline">Print Report</span>
              </button>
            </div>
          </div>
        </div>

        {/* Vibrant Gradient Pill Tab Navigation */}
        <div className="max-w-[1400px] mx-auto px-6 no-print">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-3">
            {subNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  data-ocid={`parent.${item.id}.tab`}
                  type="button"
                  className="flex items-center gap-2 px-4 py-2 text-sm whitespace-nowrap transition-all duration-200 cursor-pointer rounded-full"
                  style={{
                    background: isActive
                      ? item.gradient
                      : "rgba(255,255,255,0.15)",
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
            "linear-gradient(160deg, #f0f9ff 0%, #e0f2fe 25%, #bae6fd 50%, #7dd3fc 75%, #bae6fd 100%)",
        }}
      >
        <div key={activeSection} className="animate-fade-in-up">
          <ActiveSubComponent />
        </div>
        <MonthlyParentConnectPanel />
      </main>
    </div>
  );
}
