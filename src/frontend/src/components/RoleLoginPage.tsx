import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  AlertCircle,
  ArrowLeft,
  BrainCircuit,
  Building2,
  Eye,
  EyeOff,
  GraduationCap,
  HeartHandshake,
  LogIn,
} from "lucide-react";
import { useState } from "react";
import type { UserRole } from "../contexts/AuthContext";

interface RoleConfig {
  label: string;
  fullLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  subtleColor: string;
  borderColor: string;
  bgGradient: string;
  placeholder: { username: string; password: string };
  welcomeText: string;
  features: string[];
}

const roleConfigs: Record<UserRole, RoleConfig> = {
  student: {
    label: "Student",
    fullLabel: "Student Portal",
    icon: GraduationCap,
    accentColor: "oklch(0.48 0.2 165)",
    subtleColor: "oklch(0.92 0.08 165)",
    borderColor: "oklch(0.28 0.12 162)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.18 0.05 165) 0%, oklch(0.22 0.07 180) 100%)",
    placeholder: { username: "Roll No / Username", password: "Enter password" },
    welcomeText: "Access your academic dashboard, exams, goals, and more.",
    features: [
      "Academic Roadmaps",
      "Exam Hub",
      "Career Navigator",
      "Marketplace",
    ],
  },
  teacher: {
    label: "Teacher",
    fullLabel: "Faculty Hub",
    icon: BrainCircuit,
    accentColor: "oklch(0.46 0.22 245)",
    subtleColor: "oklch(0.93 0.06 240)",
    borderColor: "oklch(0.25 0.1 250)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.18 0.04 240) 0%, oklch(0.22 0.06 260) 100%)",
    placeholder: {
      username: "Faculty ID / Username",
      password: "Enter password",
    },
    welcomeText:
      "Manage your classes, AI tools, and student performance insights.",
    features: ["Smart Board", "Class Tracking", "AI Assistant", "Analytics"],
  },
  institute: {
    label: "Institute",
    fullLabel: "Command Center",
    icon: Building2,
    accentColor: "oklch(0.4 0.22 258)",
    subtleColor: "oklch(0.93 0.06 255)",
    borderColor: "oklch(0.24 0.1 250)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.16 0.04 255) 0%, oklch(0.20 0.06 240) 100%)",
    placeholder: {
      username: "Admin ID / Username",
      password: "Enter password",
    },
    welcomeText:
      "Oversee campus governance, infrastructure, and institutional analytics.",
    features: [
      "Analytics Dashboard",
      "User Management",
      "Bulk Import",
      "Reports",
    ],
  },
  parent: {
    label: "Parent",
    fullLabel: "Parent Insight Portal",
    icon: HeartHandshake,
    accentColor: "oklch(0.48 0.18 238)",
    subtleColor: "oklch(0.93 0.06 230)",
    borderColor: "oklch(0.28 0.1 232)",
    bgGradient:
      "linear-gradient(135deg, oklch(0.18 0.04 235) 0%, oklch(0.22 0.06 220) 100%)",
    placeholder: {
      username: "Parent ID / Username",
      password: "Enter password",
    },
    welcomeText:
      "Track your child's progress, attendance, fees, and connect with teachers.",
    features: [
      "Student Growth",
      "Attendance",
      "Faculty Insights",
      "Welfare Alerts",
    ],
  },
};

function getSignInGradient(role: UserRole): string {
  const gradients: Record<UserRole, string> = {
    student:
      "linear-gradient(135deg, oklch(0.48 0.2 165), oklch(0.42 0.21 155))",
    teacher:
      "linear-gradient(135deg, oklch(0.46 0.22 245), oklch(0.38 0.22 255))",
    institute:
      "linear-gradient(135deg, oklch(0.4 0.22 258), oklch(0.32 0.22 250))",
    parent:
      "linear-gradient(135deg, oklch(0.48 0.18 238), oklch(0.38 0.2 230))",
  };
  return gradients[role];
}

function getOrbColor(role: UserRole): string {
  const orbs: Record<UserRole, string> = {
    student: "oklch(0.62 0.22 165)",
    teacher: "oklch(0.55 0.22 255)",
    institute: "oklch(0.5 0.22 250)",
    parent: "oklch(0.6 0.2 228)",
  };
  return orbs[role];
}

function getOrbColor2(role: UserRole): string {
  const orbs: Record<UserRole, string> = {
    student: "oklch(0.7 0.18 185)",
    teacher: "oklch(0.65 0.18 240)",
    institute: "oklch(0.62 0.18 240)",
    parent: "oklch(0.65 0.17 215)",
  };
  return orbs[role];
}

interface RoleLoginPageProps {
  role: UserRole;
  onLogin: (role: UserRole) => void;
  onBack: () => void;
}

export default function RoleLoginPage({
  role,
  onLogin,
  onBack,
}: RoleLoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const config = roleConfigs[role];
  const Icon = config.icon;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter your username and password.");
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(role);
    }, 800);
  };

  const handleQuickEnter = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(role);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Panel - Branding */}
      <div
        className="lg:w-2/5 flex flex-col justify-between p-10 text-white relative overflow-hidden"
        style={{ background: config.bgGradient }}
      >
        {/* Background decoration */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        {/* Glowing orbs */}
        <div
          className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: getOrbColor(role) }}
        />
        <div
          className="absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: getOrbColor2(role) }}
        />

        {/* Top: Logo + Back */}
        <div className="relative z-10">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm mb-10 group"
            data-ocid="login.back.button"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to role selection
          </button>

          <div className="flex items-center gap-4 mb-8">
            <img
              src="/assets/generated/nirgrantha-logo.dim_512x512.png"
              alt="NIRGRANTHA"
              className="h-14 w-14 rounded-xl shadow-lg object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div>
              <p className="text-white/60 text-xs uppercase tracking-widest">
                NIRGRANTHA
              </p>
              <h2 className="text-xl font-bold text-white">
                {config.fullLabel}
              </h2>
            </div>
          </div>

          {/* Role icon */}
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
            style={{ background: "rgba(255,255,255,0.12)" }}
          >
            <Icon className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-3">
            {config.label} Login
          </h1>
          <p className="text-white/65 leading-relaxed text-sm max-w-xs mb-6">
            {config.welcomeText}
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {config.features.map((f) => (
              <span
                key={f}
                className="px-2.5 py-1 rounded-full text-xs font-medium"
                style={{
                  background: "rgba(255,255,255,0.14)",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom: Footer note */}
        <div className="relative z-10">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} NIRGRANTHA. Secure access portal.
          </p>
        </div>
      </div>

      {/* Right Panel - Clean white background */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        {/* Form card */}
        <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Sign in as {config.label}
            </h2>
            <p className="text-gray-600 text-sm">
              Enter your credentials to access the {config.fullLabel}.
            </p>
          </div>

          {/* Credentials notice — only for student, teacher, parent */}
          {role !== "institute" && (
            <div
              className="credential-notice flex items-start gap-3 px-4 py-3 rounded-xl mb-3"
              style={{
                backgroundColor: "oklch(0.97 0.02 27)",
              }}
              data-ocid="login.credential_notice.panel"
            >
              <AlertCircle
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                style={{ color: "oklch(0.52 0.22 27)" }}
              />
              <p
                className="text-xs leading-relaxed font-medium"
                style={{ color: "#1a1a1a", fontWeight: 600 }}
              >
                🔐 Your login credentials are provided by your{" "}
                <strong>Institute</strong>. Contact your college admin if you
                haven't received them.
              </p>
            </div>
          )}

          {/* Parent-specific notice */}
          {role === "parent" && (
            <div
              className="flex items-start gap-3 px-4 py-3 rounded-xl mb-6"
              style={{
                backgroundColor: "oklch(0.95 0.04 230)",
                border: "1px solid oklch(0.82 0.1 230)",
              }}
              data-ocid="login.parent_notice.panel"
            >
              <span className="text-sm mt-0.5 flex-shrink-0">👨‍👧</span>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "#1a1a1a", fontWeight: 600 }}
              >
                Parent login is linked to your{" "}
                <strong>child's student account</strong>. Your credentials were
                issued when your child enrolled. You will see your child's
                academic progress, attendance, and welfare reports.
              </p>
            </div>
          )}

          {error && (
            <div
              className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4 text-sm"
              style={{
                backgroundColor: "oklch(0.97 0.02 27)",
                color: "oklch(0.45 0.22 27)",
              }}
              data-ocid="login.error_state"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-gray-800 font-semibold text-sm"
              >
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder={config.placeholder.username}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-xl border-gray-300 bg-white focus:ring-2 text-gray-900"
                style={{ "--ring": config.accentColor } as React.CSSProperties}
                data-ocid="login.input"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-gray-800 font-semibold text-sm"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={config.placeholder.password}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-xl border-gray-300 bg-white pr-10 text-gray-900"
                  data-ocid="login.input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl py-2.5 font-semibold text-white shadow-lg hover:opacity-90 transition-opacity"
              style={{ background: getSignInGradient(role), border: "none" }}
              disabled={isLoading}
              data-ocid="login.submit_button"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  Sign In
                </span>
              )}
            </Button>
          </form>

          {/* Quick access for demo */}
          <div className="mt-6 pt-5 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-3">
              Demo access (no credentials needed)
            </p>
            <button
              type="button"
              onClick={handleQuickEnter}
              className="w-full py-2 rounded-xl text-sm font-medium transition-all duration-200 border-2"
              style={{
                borderColor: config.accentColor,
                color: config.accentColor,
                background: "#ffffff",
              }}
              data-ocid="login.secondary_button"
            >
              Quick Demo Access →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
