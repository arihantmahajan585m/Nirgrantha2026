import { ThemeProvider } from "next-themes";
import { createContext, useContext, useState } from "react";
import MLLabPage from "./components/MLLabPage";
import Navbar from "./components/Navbar";
import RoleLoginPage from "./components/RoleLoginPage";
import RoleSelectionLanding from "./components/RoleSelectionLanding";
import ScrollProgressBar from "./components/ScrollProgressBar";
import WelcomePage from "./components/WelcomePage";
import FacultyIntelligenceHub from "./components/tabs/FacultyIntelligenceHub";
import InstituteCommandCenter from "./components/tabs/InstituteCommandCenter";
import ParentInsightPortal from "./components/tabs/ParentInsightPortal";
import StudentDashboard from "./components/tabs/StudentDashboard";
import { AuthProvider, type UserRole, useAuth } from "./contexts/AuthContext";

export type TabId =
  | "student-dashboard"
  | "faculty-hub"
  | "institute-command"
  | "parent-insight-portal";

interface TabContextType {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

export const TabContext = createContext<TabContextType>({
  activeTab: "student-dashboard",
  setActiveTab: () => {},
});

export const useTab = () => useContext(TabContext);

const roleToTab: Record<UserRole, TabId> = {
  student: "student-dashboard",
  teacher: "faculty-hub",
  institute: "institute-command",
  parent: "parent-insight-portal",
};

const tabComponents: Record<TabId, React.ComponentType> = {
  "student-dashboard": StudentDashboard,
  "faculty-hub": FacultyIntelligenceHub,
  "institute-command": InstituteCommandCenter,
  "parent-insight-portal": ParentInsightPortal,
};

const roleFooterBg: Record<UserRole, string> = {
  student: "var(--student-header)",
  teacher: "oklch(var(--fhub-header))",
  institute: "var(--iicc-header)",
  parent: "var(--parent-header)",
};

const roleProgressColor: Record<UserRole, string> = {
  student: "#00e5a0",
  teacher: "#818cf8",
  institute: "#60a5fa",
  parent: "#38bdf8",
};

type AppView = "welcome" | "landing" | "login" | "dashboard" | "ml-lab";

function AppInner() {
  const { currentRole, login, logout } = useAuth();
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>("student-dashboard");
  const [hasEnteredPlatform, setHasEnteredPlatform] = useState(false);
  const [showMLLab, setShowMLLab] = useState(false);

  let view: AppView = "welcome";
  if (showMLLab) {
    view = "ml-lab";
  } else if (currentRole) {
    view = "dashboard";
  } else if (pendingRole) {
    view = "login";
  } else if (hasEnteredPlatform) {
    view = "landing";
  }

  const handleSelectRole = (role: UserRole) => {
    setPendingRole(role);
  };
  const handleLogin = (role: UserRole) => {
    login(role);
    setActiveTab(roleToTab[role]);
    setPendingRole(null);
  };
  const handleBack = () => {
    setPendingRole(null);
  };
  const handleLogout = () => {
    logout();
    setPendingRole(null);
  };

  if (view === "ml-lab") {
    return (
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <MLLabPage onBack={() => setShowMLLab(false)} />
      </ThemeProvider>
    );
  }

  if (view === "welcome") {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <WelcomePage
          onEnter={() => setHasEnteredPlatform(true)}
          onMLLab={() => setShowMLLab(true)}
        />
      </ThemeProvider>
    );
  }

  if (view === "landing") {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <RoleSelectionLanding
          onSelectRole={handleSelectRole}
          onMLLab={() => setShowMLLab(true)}
        />
      </ThemeProvider>
    );
  }

  if (view === "login" && pendingRole) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <RoleLoginPage
          role={pendingRole}
          onLogin={handleLogin}
          onBack={handleBack}
        />
      </ThemeProvider>
    );
  }

  const tabForRole = currentRole ? roleToTab[currentRole] : activeTab;
  const effectiveTab = tabForRole;
  const ActiveComponent = tabComponents[effectiveTab];
  const footerBg = currentRole ? roleFooterBg[currentRole] : undefined;
  const progressColor = currentRole
    ? roleProgressColor[currentRole]
    : "#00e5a0";

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TabContext.Provider value={{ activeTab: effectiveTab, setActiveTab }}>
        <div className="min-h-screen bg-background text-foreground">
          <ScrollProgressBar color={progressColor} />
          <Navbar onLogout={handleLogout} />
          <main className="pt-[72px]">
            <div key={effectiveTab} className="animate-fade-in-up">
              <ActiveComponent />
            </div>
          </main>
          <footer
            className="border-t mt-0"
            style={{
              background: footerBg ?? "oklch(var(--card))",
              borderTopColor: footerBg ? "rgba(255,255,255,0.15)" : undefined,
            }}
          >
            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-lg">NIRGRANTHA</span>
              </div>
              <p
                className="text-sm text-center"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                © {new Date().getFullYear()} Nirgrantha. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </TabContext.Provider>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
