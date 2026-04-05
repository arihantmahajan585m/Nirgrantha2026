import {
  BarChart3,
  Building2,
  GraduationCap,
  Shield,
  ShieldCheck,
  Upload,
  Users,
} from "lucide-react";
import { useState } from "react";
import BulkImportPanel from "./institute-command/BulkImportPanel";
import CampusGovernancePanel from "./institute-command/CampusGovernancePanel";
import CybersecurityCommand from "./institute-command/CybersecurityCommand";
import FacultyStaffOptimization from "./institute-command/FacultyStaffOptimization";
import InfrastructurePlacementControl from "./institute-command/InfrastructurePlacementControl";
import InstitutionalPerformanceAnalytics from "./institute-command/InstitutionalPerformanceAnalytics";
import StudentGrowthTransformation from "./institute-command/StudentGrowthTransformation";

type SubSection =
  | "analytics"
  | "faculty"
  | "students"
  | "infrastructure"
  | "bulkimport"
  | "cybersecurity";

interface SubNav {
  id: SubSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  glow: string;
}

const subNavItems: SubNav[] = [
  {
    id: "analytics",
    label: "Performance Analytics",
    icon: BarChart3,
    gradient: "linear-gradient(135deg, #60a5fa, #2563eb)",
    glow: "0 4px 15px rgba(37,99,235,0.55)",
  },
  {
    id: "faculty",
    label: "Faculty & Staff Optimization",
    icon: Users,
    gradient: "linear-gradient(135deg, #a78bfa, #7c3aed)",
    glow: "0 4px 15px rgba(124,58,237,0.5)",
  },
  {
    id: "students",
    label: "Student Growth Engine",
    icon: GraduationCap,
    gradient: "linear-gradient(135deg, #34d399, #059669)",
    glow: "0 4px 15px rgba(5,150,105,0.5)",
  },
  {
    id: "infrastructure",
    label: "Infra & Placement Control",
    icon: Building2,
    gradient: "linear-gradient(135deg, #fbbf24, #b45309)",
    glow: "0 4px 15px rgba(180,83,9,0.5)",
  },
  {
    id: "bulkimport",
    label: "Bulk Data Import",
    icon: Upload,
    gradient: "linear-gradient(135deg, #fb7185, #e11d48)",
    glow: "0 4px 15px rgba(225,29,72,0.5)",
  },
  {
    id: "cybersecurity",
    label: "Cybersecurity",
    icon: ShieldCheck,
    gradient: "linear-gradient(135deg, #0f172a, #1e40af)",
    glow: "0 4px 15px rgba(30,64,175,0.5)",
  },
];

const subComponents: Record<SubSection, React.ComponentType> = {
  analytics: InstitutionalPerformanceAnalytics,
  faculty: FacultyStaffOptimization,
  students: StudentGrowthTransformation,
  infrastructure: InfrastructurePlacementControl,
  bulkimport: BulkImportPanel,
  cybersecurity: CybersecurityCommand,
};

export default function InstituteCommandCenter() {
  const [activeSection, setActiveSection] = useState<SubSection>("analytics");

  const ActiveSubComponent = subComponents[activeSection];

  return (
    <div
      className="iicc-theme min-h-screen flex flex-col relative overflow-hidden"
      style={{
        background:
          "linear-gradient(160deg, #0c1a3a 0%, #1e3a5f 20%, #1e40af 40%, #2563eb 65%, #3b82f6 85%, #60a5fa 100%)",
      }}
    >
      {/* Floating ambient orbs */}
      <div
        className="orb animate-float-slow"
        style={{
          width: 460,
          height: 460,
          top: "-10%",
          right: "-8%",
          background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
          opacity: 0.18,
        }}
      />
      <div
        className="orb animate-float-mid"
        style={{
          width: 300,
          height: 300,
          bottom: "5%",
          left: "-5%",
          background: "radial-gradient(circle, #6366f1 0%, transparent 70%)",
          opacity: 0.12,
          animationDelay: "3s",
        }}
      />
      <div
        className="orb animate-float-fast"
        style={{
          width: 200,
          height: 200,
          top: "50%",
          right: "5%",
          background: "radial-gradient(circle, #38bdf8 0%, transparent 70%)",
          opacity: 0.1,
          animationDelay: "1.2s",
        }}
      />
      {/* Command Center Header */}
      <div
        style={{
          background: "var(--iicc-header)",
          borderBottom: "1px solid var(--iicc-border)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 py-5">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, var(--iicc-blue) 0%, var(--iicc-blue-dark) 100%)",
              }}
            >
              <Shield className="w-6 h-6 text-white" />
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
                Institute Intelligence Command Center
              </h1>
              <p
                className="text-xs mt-0.5"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                National Smart Education Monitoring Authority · Academic Year
                2025–26
              </p>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <span
                className="px-3 py-1 rounded-full text-xs font-bold border"
                style={{
                  background: "var(--iicc-badge-bg)",
                  color: "var(--iicc-blue)",
                  borderColor: "var(--iicc-blue)",
                }}
              >
                COMMAND ACTIVE
              </span>
              <span
                className="px-3 py-1 rounded-full text-xs font-semibold"
                style={{
                  background: "oklch(0.45 0.15 145 / 0.15)",
                  color: "oklch(0.45 0.15 145)",
                }}
              >
                ● LIVE
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
                  data-ocid={`institute.${item.id}.tab`}
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
            "linear-gradient(160deg, #f0f7ff 0%, #e8f0fe 25%, #dbeafe 50%, #bfdbfe 75%, #dbeafe 100%)",
        }}
      >
        <div key={activeSection} className="animate-fade-in-up">
          <ActiveSubComponent />
        </div>
        <CampusGovernancePanel />
      </main>
    </div>
  );
}
