import { BookOpen, Building2, GraduationCap, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { UserRole } from "../contexts/AuthContext";

interface RoleSelectionLandingProps {
  onSelectRole: (role: UserRole) => void;
  onMLLab?: () => void;
}

const roles: {
  role: UserRole;
  label: string;
  pillLabel: string;
  sub: string;
  icon: React.ElementType;
  cardGradient: string;
  iconBg: string;
  labelColor: string;
  borderColor: string;
}[] = [
  {
    role: "student",
    label: "Student",
    pillLabel: "Academic Portal",
    sub: "Access academic roadmaps, skill teams, exams & career tools",
    icon: GraduationCap,
    cardGradient:
      "linear-gradient(145deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)",
    iconBg: "linear-gradient(135deg, #059669, #10b981)",
    labelColor: "#065f46",
    borderColor: "rgba(5,150,105,0.25)",
  },
  {
    role: "teacher",
    label: "Faculty",
    pillLabel: "Faculty Hub",
    sub: "Manage classes, AI smart board & student analytics",
    icon: BookOpen,
    cardGradient:
      "linear-gradient(145deg, #ede9fe 0%, #ddd6fe 50%, #c4b5fd 100%)",
    iconBg: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
    labelColor: "#4c1d95",
    borderColor: "rgba(124,58,237,0.25)",
  },
  {
    role: "institute",
    label: "Institute",
    pillLabel: "Command Center",
    sub: "Oversee all departments, users & institutional analytics",
    icon: Building2,
    cardGradient:
      "linear-gradient(145deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)",
    iconBg: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
    labelColor: "#1e3a8a",
    borderColor: "rgba(29,78,216,0.25)",
  },
  {
    role: "parent",
    label: "Parent",
    pillLabel: "Insight Portal",
    sub: "Track your child's progress, attendance & welfare alerts",
    icon: Users,
    cardGradient:
      "linear-gradient(145deg, #cffafe 0%, #a5f3fc 50%, #67e8f9 100%)",
    iconBg: "linear-gradient(135deg, #0891b2, #06b6d4)",
    labelColor: "#164e63",
    borderColor: "rgba(8,145,178,0.25)",
  },
];

export default function RoleSelectionLanding({
  onSelectRole,
}: RoleSelectionLandingProps) {
  const [visible, setVisible] = useState(false);
  const [tiltStyles, setTiltStyles] = useState<
    Record<string, { transform: string }>
  >({});
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    idx: number,
  ) => {
    const card = cardRefs.current[idx];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTiltStyles((prev) => ({
      ...prev,
      [idx]: {
        transform: `perspective(700px) rotateX(${-y * 10}deg) rotateY(${x * 10}deg) scale(1.04)`,
      },
    }));
  };

  const handleMouseLeave = (idx: number) => {
    setTiltStyles((prev) => ({
      ...prev,
      [idx]: {
        transform: "perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)",
      },
    }));
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0d4f4f 0%, #0a3060 30%, #1a1060 60%, #2d1080 80%, #3d0060 100%)",
      }}
    >
      {/* Decorative orbs */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 600,
          height: 600,
          top: "-20%",
          left: "-10%",
          background:
            "radial-gradient(circle, rgba(0,180,160,0.18) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 500,
          height: 500,
          bottom: "-15%",
          right: "-5%",
          background:
            "radial-gradient(circle, rgba(120,40,200,0.22) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: 300,
          height: 300,
          top: "40%",
          left: "50%",
          transform: "translateX(-50%)",
          background:
            "radial-gradient(circle, rgba(30,80,200,0.15) 0%, transparent 70%)",
          filter: "blur(30px)",
        }}
      />

      <div className="relative z-10 max-w-5xl w-full">
        {/* Header */}
        <div
          className="text-center mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(-20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            <span className="text-white">NIR</span>
            <span style={{ color: "#34d399" }}>GRANTHA</span>
          </h1>
          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: "rgba(255,255,255,0.95)" }}
          >
            The Foundation of Trust
          </h2>
          <p
            className="text-sm mb-4"
            style={{ color: "rgba(255,255,255,0.65)" }}
          >
            Empowering Students · Teachers · Institutes · Parents
          </p>
          <div
            className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(8px)",
            }}
          >
            Choose your role to continue
          </div>
        </div>

        {/* Role cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {roles.map(
            (
              {
                role,
                label,
                pillLabel,
                sub,
                icon: Icon,
                cardGradient,
                iconBg,
                labelColor,
                borderColor,
              },
              idx,
            ) => (
              <div
                key={role}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                data-ocid={`landing.${role}.card`}
                className="cursor-pointer rounded-2xl p-6 flex flex-col items-center text-center select-none"
                style={{
                  background: cardGradient,
                  border: `1.5px solid ${borderColor}`,
                  boxShadow:
                    "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.6)",
                  opacity: visible ? 1 : 0,
                  transform: visible
                    ? (tiltStyles[idx]?.transform ?? "scale(1)")
                    : "scale(0.85) translateY(20px)",
                  transition: `opacity 0.5s ease ${idx * 120}ms, transform 0.3s ease`,
                  ...(visible ? (tiltStyles[idx] ?? {}) : {}),
                }}
                onMouseMove={(e) => handleMouseMove(e, idx)}
                onMouseLeave={() => handleMouseLeave(idx)}
                onClick={() => onSelectRole(role)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") onSelectRole(role);
                }}
                // biome-ignore lint/a11y/useSemanticElements: card UX requires div
                tabIndex={0}
                role="button"
              >
                {/* Pill label */}
                <div
                  className="px-3 py-1 rounded-full text-xs font-semibold mb-4"
                  style={{
                    background: "rgba(255,255,255,0.55)",
                    color: labelColor,
                    backdropFilter: "blur(4px)",
                    border: `1px solid ${borderColor}`,
                  }}
                >
                  {pillLabel}
                </div>

                {/* Icon circle */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-lg"
                  style={{
                    background: iconBg,
                    boxShadow: `0 4px 16px ${borderColor}`,
                  }}
                >
                  <Icon className="w-7 h-7 text-white" strokeWidth={2} />
                </div>

                {/* Role name */}
                <h2
                  className="text-lg font-bold mb-1.5"
                  style={{ color: labelColor }}
                >
                  {label}
                </h2>

                {/* Description */}
                <p
                  className="text-xs leading-relaxed mb-4"
                  style={{ color: `${labelColor}cc` }}
                >
                  {sub}
                </p>

                {/* Login link */}
                <div
                  className="mt-auto text-sm font-semibold flex items-center gap-1"
                  style={{ color: labelColor }}
                >
                  Login
                  <span className="text-base">→</span>
                </div>
              </div>
            ),
          )}
        </div>

        <p
          className="text-center text-xs"
          style={{ color: "rgba(255,255,255,0.35)" }}
        >
          Credentials are issued by your institute. Contact your admin if you
          need access.
        </p>
      </div>
    </div>
  );
}
