import { Button } from "@/components/ui/button";
import {
  BrainCircuit,
  Building2,
  GraduationCap,
  HeartHandshake,
  LogOut,
  Moon,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { type TabId, useTab } from "../App";
import { type UserRole, useAuth } from "../contexts/AuthContext";

interface NavTab {
  id: TabId;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  forRole: UserRole;
}

const tabs: NavTab[] = [
  {
    id: "student-dashboard",
    label: "Student Dashboard",
    shortLabel: "Student",
    icon: GraduationCap,
    forRole: "student",
  },
  {
    id: "faculty-hub",
    label: "Faculty Intelligence Hub",
    shortLabel: "Faculty Hub",
    icon: BrainCircuit,
    forRole: "teacher",
  },
  {
    id: "institute-command",
    label: "Institute Intelligence Command Center",
    shortLabel: "Command",
    icon: Building2,
    forRole: "institute",
  },
  {
    id: "parent-insight-portal",
    label: "Parent Insight Portal",
    shortLabel: "Parents",
    icon: HeartHandshake,
    forRole: "parent",
  },
];

const roleLabels: Record<UserRole, string> = {
  student: "Student",
  teacher: "Teacher",
  institute: "Institute",
  parent: "Parent",
};

// Portal header colors per role
const roleHeaderBg: Record<UserRole, string> = {
  student: "var(--student-header)",
  teacher: "oklch(var(--fhub-header))",
  institute: "var(--iicc-header)",
  parent: "var(--parent-header)",
};

interface NavbarProps {
  onLogout: () => void;
}

export default function Navbar({ onLogout }: NavbarProps) {
  const { activeTab, setActiveTab } = useTab();
  const { theme, setTheme } = useTheme();
  const { currentRole } = useAuth();

  const visibleTabs = tabs.filter((tab) => tab.forRole === currentRole);
  const headerBg = currentRole ? roleHeaderBg[currentRole] : undefined;
  const isColored = !!currentRole;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b shadow-xs"
      style={{
        background: headerBg ?? "oklch(var(--card))",
        borderBottomColor: isColored ? "rgba(255,255,255,0.15)" : undefined,
      }}
    >
      <div className="max-w-[1600px] mx-auto px-3">
        <div className="flex items-center h-[72px] gap-2">
          {/* NIRGRANTHA Logo */}
          <div className="flex-shrink-0 flex items-center gap-2 mr-4">
            <img
              src="/assets/generated/nirgrantha-logo-transparent.dim_400x80.png"
              alt="NIRGRANTHA"
              className="h-10 w-auto"
              style={{ filter: isColored ? "brightness(0) invert(1)" : "none" }}
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = "none";
                const sibling = target.nextElementSibling as HTMLElement;
                if (sibling) sibling.style.display = "flex";
              }}
            />
            <span
              className="hidden items-center gap-1.5 font-display font-bold text-lg"
              style={{ display: "none" }}
            >
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold"
                style={{
                  background: isColored
                    ? "rgba(255,255,255,0.2)"
                    : "linear-gradient(135deg, #10b981, #059669)",
                  color: "white",
                }}
              >
                N
              </span>
              <span
                className="font-bold"
                style={{ color: isColored ? "white" : undefined }}
              >
                NIRGRANTHA
              </span>
            </span>
          </div>

          {/* Nav Tabs */}
          <nav className="flex-1 flex items-end h-full overflow-x-auto scrollbar-none">
            <ul className="flex items-end h-full min-w-max gap-1">
              {visibleTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <li key={tab.id}>
                    <button
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      data-ocid={`nav.${tab.id}.tab`}
                      className="relative flex flex-col items-center justify-end gap-1.5 px-5 pb-3 pt-2 h-[72px] text-sm font-medium whitespace-nowrap transition-all duration-200 group cursor-pointer rounded-t-xl"
                      style={{
                        color: isColored
                          ? isActive
                            ? "white"
                            : "rgba(255,255,255,0.7)"
                          : undefined,
                        fontWeight: isActive ? 600 : 400,
                      }}
                      title={tab.label}
                    >
                      {isActive && (
                        <span
                          className="absolute inset-0 rounded-t-xl"
                          style={{ background: "rgba(255,255,255,0.15)" }}
                        />
                      )}
                      <span className="relative z-10 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                        <Icon className="w-5 h-5" />
                      </span>
                      <span className="relative z-10 text-xs sm:text-sm">
                        {tab.shortLabel}
                      </span>
                      <span
                        className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full transition-all duration-300"
                        style={{
                          background: isActive ? "white" : "transparent",
                          opacity: isActive ? 0.8 : 0,
                        }}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right: Role badge + Theme + Logout */}
          <div className="flex-shrink-0 flex items-center gap-2 ml-2">
            {currentRole && (
              <div
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: "rgba(255,255,255,0.18)", color: "white" }}
              >
                <User className="w-3.5 h-3.5" />
                {roleLabels[currentRole]}
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-xl"
              style={{ color: isColored ? "white" : undefined }}
              aria-label="Toggle theme"
              data-ocid="nav.theme.toggle"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>
            <button
              type="button"
              onClick={onLogout}
              data-ocid="nav.logout.button"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 h-8 cursor-pointer"
              style={{
                background: isColored
                  ? "rgba(255,255,255,0.18)"
                  : "transparent",
                color: isColored ? "white" : undefined,
                border: isColored
                  ? "1px solid rgba(255,255,255,0.3)"
                  : "1px solid oklch(var(--border))",
              }}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
