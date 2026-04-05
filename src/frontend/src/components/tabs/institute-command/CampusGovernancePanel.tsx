import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const governanceMetrics = [
  {
    label: "Campus Environment Quality",
    value: 74,
    unit: "/100",
    icon: "🌿",
    color: "oklch(0.52 0.16 160)",
  },
  {
    label: "Student Satisfaction",
    value: 4.1,
    unit: "/5",
    icon: "🎓",
    color: "var(--iicc-blue)",
  },
  {
    label: "Faculty Satisfaction",
    value: 3.8,
    unit: "/5",
    icon: "👨‍🏫",
    color: "oklch(0.55 0.18 280)",
  },
  {
    label: "Anti-Trap Monitoring",
    value: 2,
    unit: " alerts",
    icon: "🛡️",
    color: "oklch(0.60 0.22 25)",
    isAlert: true,
  },
  {
    label: "Marketplace Impact",
    value: 312,
    unit: " txns",
    icon: "🛒",
    color: "oklch(0.60 0.18 50)",
  },
  {
    label: "Sustainability Index",
    value: 68,
    unit: "/100",
    icon: "♻️",
    color: "oklch(0.48 0.16 145)",
  },
];

const monthlyProgress = [
  { month: "Aug", score: 71 },
  { month: "Sep", score: 73 },
  { month: "Oct", score: 72 },
  { month: "Nov", score: 75 },
  { month: "Dec", score: 77 },
  { month: "Jan", score: 79 },
];

const smartCampusScore = 79;

export default function CampusGovernancePanel() {
  const [collapsed, setCollapsed] = useState(false);

  const maxScore = Math.max(...monthlyProgress.map((m) => m.score));
  const minScore = Math.min(...monthlyProgress.map((m) => m.score));
  const range = maxScore - minScore || 1;

  // Build SVG polyline points for the trend line
  const chartW = 300;
  const chartH = 60;
  const points = monthlyProgress
    .map((m, i) => {
      const x = (i / (monthlyProgress.length - 1)) * chartW;
      const y = chartH - ((m.score - minScore + 2) / (range + 4)) * chartH;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div
      className="sticky bottom-0 z-40 border-t"
      style={{
        background: "var(--iicc-header)",
        borderColor: "var(--iicc-border)",
        boxShadow: "0 -4px 24px 0 oklch(0.25 0.08 240 / 0.15)",
      }}
    >
      {/* Toggle Bar */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-6 py-2.5 cursor-pointer transition-colors hover:opacity-80"
        style={{ background: "var(--iicc-blue)", color: "white" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold tracking-wider">
            🌱 CAMPUS ENVIRONMENT & SMART GOVERNANCE LAYER
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-bold"
            style={{ background: "rgba(255,255,255,0.2)" }}
          >
            Smart Campus Score: {smartCampusScore}/100
          </span>
        </div>
        {collapsed ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {/* Panel Content */}
      {!collapsed && (
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Smart Campus Score — Circular Meter */}
            <div className="flex-shrink-0 flex flex-col items-center gap-2">
              <div className="relative w-24 h-24">
                <svg viewBox="0 0 96 96" className="w-full h-full -rotate-90">
                  <title>Chart</title>
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    fill="none"
                    stroke="var(--iicc-border)"
                    strokeWidth="8"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    fill="none"
                    stroke="var(--iicc-blue)"
                    strokeWidth="8"
                    strokeDasharray={`${(2 * Math.PI * 40 * smartCampusScore) / 100} ${2 * Math.PI * 40}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className="text-xl font-bold font-display"
                    style={{ color: "var(--iicc-blue)" }}
                  >
                    {smartCampusScore}
                  </span>
                  <span
                    className="text-[9px] font-semibold"
                    style={{ color: "var(--iicc-muted)" }}
                  >
                    / 100
                  </span>
                </div>
              </div>
              <span
                className="text-xs font-semibold text-center"
                style={{ color: "var(--iicc-heading)" }}
              >
                Smart Campus
                <br />
                Score
              </span>
            </div>

            {/* 6 Governance Metrics */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {governanceMetrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-lg border p-3 text-center"
                  style={{
                    background: "var(--iicc-card)",
                    borderColor: m.isAlert
                      ? "oklch(0.60 0.22 25 / 0.5)"
                      : "var(--iicc-border)",
                  }}
                >
                  <div className="text-lg mb-1">{m.icon}</div>
                  <div
                    className="text-base font-bold font-display"
                    style={{ color: m.color }}
                  >
                    {m.value}
                    <span
                      className="text-xs font-normal"
                      style={{ color: "var(--iicc-muted)" }}
                    >
                      {m.unit}
                    </span>
                  </div>
                  <div
                    className="text-[10px] leading-tight mt-0.5"
                    style={{ color: "var(--iicc-muted)" }}
                  >
                    {m.label}
                  </div>
                  {m.isAlert && m.value > 0 && (
                    <div
                      className="mt-1 text-[9px] font-bold"
                      style={{ color: "oklch(0.50 0.22 25)" }}
                    >
                      ⚠ ACTIVE
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Monthly Improvement Progress */}
            <div className="flex-shrink-0 w-full lg:w-64">
              <div
                className="text-xs font-semibold mb-2"
                style={{ color: "var(--iicc-heading)" }}
              >
                Monthly Improvement Progress
              </div>
              <div
                className="rounded-lg border p-3"
                style={{
                  background: "var(--iicc-card)",
                  borderColor: "var(--iicc-border)",
                }}
              >
                <svg
                  viewBox={`0 0 ${300} ${chartH + 4}`}
                  className="w-full"
                  style={{ height: "60px" }}
                >
                  <title>Chart</title>
                  {/* Grid lines */}
                  {[0, 0.5, 1].map((t) => (
                    <line
                      key={t}
                      x1="0"
                      y1={t * chartH}
                      x2={300}
                      y2={t * chartH}
                      stroke="var(--iicc-border)"
                      strokeWidth="0.5"
                    />
                  ))}
                  {/* Area fill */}
                  <polyline
                    points={`0,${chartH} ${points} ${chartW},${chartH}`}
                    fill="var(--iicc-blue)"
                    fillOpacity="0.1"
                    stroke="none"
                  />
                  {/* Trend line */}
                  <polyline
                    points={points}
                    fill="none"
                    stroke="var(--iicc-blue)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {/* Data points */}
                  {monthlyProgress.map((m, i) => {
                    const x = (i / (monthlyProgress.length - 1)) * chartW;
                    const y =
                      chartH -
                      ((m.score - minScore + 2) / (range + 4)) * chartH;
                    return (
                      <circle
                        key={m.month}
                        cx={x}
                        cy={y}
                        r="3"
                        fill="var(--iicc-blue)"
                      />
                    );
                  })}
                </svg>
                {/* Month labels */}
                <div className="flex justify-between mt-1">
                  {monthlyProgress.map((m) => (
                    <span
                      key={m.month}
                      className="text-[9px]"
                      style={{ color: "var(--iicc-muted)" }}
                    >
                      {m.month}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between mt-1">
                  {monthlyProgress.map((m) => (
                    <span
                      key={m.month}
                      className="text-[9px] font-bold"
                      style={{ color: "var(--iicc-blue)" }}
                    >
                      {m.score}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
