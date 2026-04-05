import {
  AlertTriangle,
  Award,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";

const kpiCards = [
  {
    label: "Overall GPA",
    value: "7.6",
    unit: "/10",
    trend: "+0.3",
    up: true,
    icon: Award,
    color: "#2563eb",
    borderColor: "#1d4ed8",
  },
  {
    label: "Attendance Rate",
    value: "82%",
    unit: "",
    trend: "+2%",
    up: true,
    icon: Users,
    color: "#059669",
    borderColor: "#047857",
  },
  {
    label: "Placement Rate",
    value: "78%",
    unit: "",
    trend: "+5%",
    up: true,
    icon: Target,
    color: "#7c3aed",
    borderColor: "#6d28d9",
  },
  {
    label: "Research Output",
    value: "47",
    unit: " papers",
    trend: "+12",
    up: true,
    icon: FlaskConical,
    color: "#d97706",
    borderColor: "#b45309",
  },
  {
    label: "Weak Students",
    value: "312",
    unit: "",
    trend: "-28",
    up: false,
    icon: AlertTriangle,
    color: "#dc2626",
    borderColor: "#b91c1c",
  },
  {
    label: "Dropout Risk",
    value: "8.2%",
    unit: "",
    trend: "-1.1%",
    up: false,
    icon: TrendingDown,
    color: "#9f1239",
    borderColor: "#881337",
  },
];

const branchData = [
  { branch: "CSE", score: 85, students: 520, placed: 82 },
  { branch: "IT", score: 82, students: 380, placed: 78 },
  { branch: "Mechanical", score: 72, students: 460, placed: 58 },
  { branch: "Civil", score: 68, students: 340, placed: 51 },
  { branch: "E&TC", score: 76, students: 400, placed: 64 },
  { branch: "MBA", score: 80, students: 120, placed: 75 },
];

const divisionData = [
  { div: "CSE Div A", score: 86, count: 65 },
  { div: "CSE Div B", score: 84, count: 62 },
  { div: "Mech Div A", score: 74, count: 70 },
  { div: "IT Div A", score: 82, count: 60 },
];

const teacherRanking = [
  {
    rank: 1,
    name: "Dr. S.V. Kulkarni",
    dept: "CSE",
    score: 95,
    research: 11,
    feedback: 4.9,
  },
  {
    rank: 2,
    name: "Prof. M.K. Desai",
    dept: "CSE",
    score: 91,
    research: 7,
    feedback: 4.7,
  },
  {
    rank: 3,
    name: "Dr. V.R. Patil",
    dept: "Mechanical",
    score: 88,
    research: 7,
    feedback: 4.6,
  },
  {
    rank: 4,
    name: "Prof. S.R. Patil",
    dept: "CSE",
    score: 89,
    research: 6,
    feedback: 4.6,
  },
  {
    rank: 5,
    name: "Prof. A.P. More",
    dept: "IT",
    score: 83,
    research: 3,
    feedback: 4.3,
  },
  {
    rank: 6,
    name: "Dr. A.V. Kulkarni",
    dept: "CSE",
    score: 87,
    research: 5,
    feedback: 4.5,
  },
  {
    rank: 7,
    name: "Prof. N.B. Shinde",
    dept: "CSE",
    score: 72,
    research: 2,
    feedback: 3.9,
  },
  {
    rank: 8,
    name: "Prof. S.K. Jagtap",
    dept: "Mechanical",
    score: 76,
    research: 2,
    feedback: 4.0,
  },
];

const weakStudentData = [
  { branch: "CSE", total: 520, weak: 32, risk: "low" },
  { branch: "IT", total: 380, weak: 44, risk: "medium" },
  { branch: "E&TC", total: 400, weak: 62, risk: "medium" },
  { branch: "Mechanical", total: 460, weak: 86, risk: "high" },
  { branch: "Civil", total: 340, weak: 58, risk: "high" },
  { branch: "MBA", total: 120, weak: 12, risk: "low" },
];

const attendanceMonths = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
const attendanceValues = [88, 85, 82, 79, 83, 82];

const comparisonData = [
  { metric: "Average GPA", institute: 7.6, iit: 9.1, nit: 8.4, tier1: 8.0 },
  { metric: "Placement Rate", institute: 78, iit: 98, nit: 92, tier1: 85 },
  {
    metric: "Research Papers/yr",
    institute: 47,
    iit: 420,
    nit: 180,
    tier1: 120,
  },
  {
    metric: "Avg CTC (LPA)",
    institute: 4.2,
    iit: 22.5,
    nit: 14.8,
    tier1: 11.2,
  },
  { metric: "Attendance %", institute: 82, iit: 91, nit: 88, tier1: 86 },
  { metric: "Faculty PhD %", institute: 42, iit: 98, nit: 85, tier1: 72 },
  { metric: "Hackathon Teams", institute: 24, iit: 180, nit: 95, tier1: 68 },
];

const recommendations = [
  {
    priority: "Critical",
    text: "Increase PhD faculty hiring — current 42% vs IIT benchmark 98%. Target 65% in 3 years.",
  },
  {
    priority: "High",
    text: "Launch dedicated placement training for ECE & Mechanical branches — placement gap is 30%+ vs CSE.",
  },
  {
    priority: "High",
    text: "Establish research cell with industry partnerships to boost paper output from 47 to 150+ annually.",
  },
  {
    priority: "Medium",
    text: "Implement mandatory attendance monitoring system — target 88% minimum across all branches.",
  },
  {
    priority: "Medium",
    text: "Create hackathon culture with monthly internal competitions to build competitive exposure.",
  },
  {
    priority: "Low",
    text: "Partner with IIT alumni networks for mentorship programs and placement referrals.",
  },
];

function GapIndicator({
  institute,
  benchmark,
}: { institute: number; benchmark: number }) {
  const gap = ((benchmark - institute) / benchmark) * 100;
  if (gap < 10)
    return (
      <span
        className="px-2 py-0.5 rounded text-xs font-semibold"
        style={{
          background: "oklch(0.45 0.15 145 / 0.15)",
          color: "oklch(0.40 0.15 145)",
        }}
      >
        Competitive
      </span>
    );
  if (gap < 30)
    return (
      <span
        className="px-2 py-0.5 rounded text-xs font-semibold"
        style={{
          background: "oklch(0.75 0.18 80 / 0.15)",
          color: "oklch(0.55 0.18 80)",
        }}
      >
        Moderate Gap
      </span>
    );
  return (
    <span
      className="px-2 py-0.5 rounded text-xs font-semibold"
      style={{
        background: "oklch(0.60 0.22 25 / 0.15)",
        color: "oklch(0.50 0.22 25)",
      }}
    >
      Large Gap
    </span>
  );
}

export default function InstitutionalPerformanceAnalytics() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-10">
      {/* KPI Cards */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <img
            src="/assets/generated/nirgrantha-logo-transparent.dim_400x80.png"
            alt="NIRGRANTHA"
            className="h-6 w-auto"
            style={{
              filter: "invert(1) sepia(1) saturate(5) hue-rotate(175deg)",
              opacity: 0.9,
            }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          <h2
            className="text-lg font-display font-bold"
            style={{ color: "var(--iicc-heading)" }}
          >
            Overall Academic Performance Dashboard
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {kpiCards.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.label}
                className="rounded-xl p-4"
                style={{
                  background: "#ffffff",
                  border: `2px solid ${kpi.borderColor}`,
                  boxShadow: `0 4px 16px ${kpi.color}30, 0 1px 4px rgba(0,0,0,0.08)`,
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{ background: `${kpi.color}18` }}
                  >
                    <Icon className="w-5 h-5" style={{ color: kpi.color }} />
                  </div>
                  <span
                    className={`text-xs font-semibold flex items-center gap-0.5 ${kpi.up ? "text-green-600" : "text-red-500"}`}
                  >
                    {kpi.up ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                    {kpi.trend}
                  </span>
                </div>
                <div
                  className="text-2xl font-bold font-display"
                  style={{ color: kpi.color }}
                >
                  {kpi.value}
                  <span
                    className="text-sm font-normal"
                    style={{ color: "var(--iicc-muted)" }}
                  >
                    {kpi.unit}
                  </span>
                </div>
                <div
                  className="text-xs font-semibold mt-1"
                  style={{ color: "#1e293b" }}
                >
                  {kpi.label}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Branch-wise Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2
            className="text-lg font-display font-bold mb-4"
            style={{ color: "var(--iicc-heading)" }}
          >
            Branch-wise Performance Comparison
          </h2>
          <div
            className="rounded-xl p-5 space-y-3"
            style={{
              background:
                "linear-gradient(135deg, #eff6ff 0%, #dbeafe 60%, #bfdbfe 100%)",
              border: "2px solid #1d4ed8",
              boxShadow: "0 4px 16px rgba(29,78,216,0.15)",
            }}
          >
            {branchData.map((b) => (
              <div key={b.branch}>
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    {b.branch}
                  </span>
                  <div className="flex items-center gap-3">
                    <span
                      className="text-xs"
                      style={{ color: "var(--iicc-muted)" }}
                    >
                      {b.students} students
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: "var(--iicc-blue)" }}
                    >
                      {b.score}/100
                    </span>
                  </div>
                </div>
                <div
                  className="h-2.5 rounded-full overflow-hidden"
                  style={{ background: "var(--iicc-border)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${b.score}%`,
                      background:
                        b.score >= 80
                          ? "oklch(0.52 0.16 160)"
                          : b.score >= 70
                            ? "var(--iicc-blue)"
                            : "oklch(0.60 0.22 25)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Division-wise Performance */}
        <section>
          <h2
            className="text-lg font-display font-bold mb-4"
            style={{ color: "var(--iicc-heading)" }}
          >
            Division-wise Performance
          </h2>
          <div
            className="rounded-xl p-5 space-y-4"
            style={{
              background: "var(--iicc-card)",
              border: "2px solid var(--iicc-border)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
            }}
          >
            {divisionData.map((d) => (
              <div key={d.div} className="flex items-center gap-4">
                <div
                  className="w-24 text-sm font-medium"
                  style={{ color: "var(--iicc-heading)" }}
                >
                  {d.div}
                </div>
                <div
                  className="flex-1 h-3 rounded-full overflow-hidden"
                  style={{ background: "var(--iicc-border)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${d.score}%`,
                      background:
                        "linear-gradient(90deg, var(--iicc-blue) 0%, var(--iicc-silver) 100%)",
                    }}
                  />
                </div>
                <div className="w-16 text-right">
                  <span
                    className="text-sm font-bold"
                    style={{ color: "var(--iicc-blue)" }}
                  >
                    {d.score}%
                  </span>
                </div>
                <div className="text-xs" style={{ color: "var(--iicc-muted)" }}>
                  {d.count} students
                </div>
              </div>
            ))}

            {/* Attendance Trend */}
            <div
              className="mt-6 pt-4"
              style={{ borderTop: "1px solid var(--iicc-border)" }}
            >
              <div
                className="text-sm font-semibold mb-3"
                style={{ color: "var(--iicc-heading)" }}
              >
                Attendance Trend (Monthly %)
              </div>
              <div className="flex items-end gap-2 h-20">
                {attendanceMonths.map((m, i) => (
                  <div
                    key={m}
                    className="flex-1 flex flex-col items-center gap-1"
                  >
                    <div
                      className="w-full rounded-t"
                      style={{
                        height: `${(attendanceValues[i] / 100) * 64}px`,
                        background: "var(--iicc-blue)",
                        opacity: 0.7 + i * 0.05,
                      }}
                    />
                    <span
                      className="text-[10px]"
                      style={{ color: "var(--iicc-muted)" }}
                    >
                      {m}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Teacher Performance Ranking */}
      <section>
        <h2
          className="text-lg font-display font-bold mb-4"
          style={{ color: "var(--iicc-heading)" }}
        >
          Teacher Performance Ranking
        </h2>
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "var(--iicc-card)",
            border: "2px solid var(--iicc-border)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
          }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--iicc-blue)", color: "white" }}>
                <th className="px-4 py-3 text-left font-semibold">Rank</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Faculty Name
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  Department
                </th>
                <th className="px-4 py-3 text-left font-semibold">Score</th>
                <th className="px-4 py-3 text-left font-semibold">Research</th>
                <th className="px-4 py-3 text-left font-semibold">Feedback</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {teacherRanking.map((t, i) => (
                <tr
                  key={t.rank}
                  style={{
                    borderBottom: "1px solid var(--iicc-border)",
                    background: i % 2 === 0 ? "transparent" : "var(--iicc-bg)",
                  }}
                >
                  <td className="px-4 py-3">
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background:
                          t.rank <= 3
                            ? "var(--iicc-blue)"
                            : "var(--iicc-border)",
                        color: t.rank <= 3 ? "white" : "var(--iicc-muted)",
                      }}
                    >
                      {t.rank}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 font-medium"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    {t.name}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{ color: "var(--iicc-muted)" }}
                  >
                    {t.dept}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-16 h-1.5 rounded-full overflow-hidden"
                        style={{ background: "var(--iicc-border)" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${t.score}%`,
                            background:
                              t.score >= 85
                                ? "oklch(0.52 0.16 160)"
                                : t.score >= 75
                                  ? "var(--iicc-blue)"
                                  : "oklch(0.60 0.22 25)",
                          }}
                        />
                      </div>
                      <span
                        className="font-bold text-xs"
                        style={{ color: "var(--iicc-heading)" }}
                      >
                        {t.score}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-4 py-3 font-medium"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    {t.research} papers
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="font-semibold"
                      style={{
                        color:
                          t.feedback >= 4.5
                            ? "oklch(0.52 0.16 160)"
                            : t.feedback >= 4.0
                              ? "var(--iicc-blue)"
                              : "oklch(0.60 0.22 25)",
                      }}
                    >
                      ★ {t.feedback}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-0.5 rounded text-xs font-semibold"
                      style={{
                        background:
                          t.score >= 85
                            ? "oklch(0.45 0.15 145 / 0.15)"
                            : t.score >= 75
                              ? "var(--iicc-blue-subtle)"
                              : "oklch(0.60 0.22 25 / 0.15)",
                        color:
                          t.score >= 85
                            ? "oklch(0.40 0.15 145)"
                            : t.score >= 75
                              ? "var(--iicc-blue)"
                              : "oklch(0.50 0.22 25)",
                      }}
                    >
                      {t.score >= 85
                        ? "Excellent"
                        : t.score >= 75
                          ? "Good"
                          : "Needs Review"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Weak Student Detection + Hackathon + Research */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <h2
            className="text-lg font-display font-bold mb-4"
            style={{ color: "var(--iicc-heading)" }}
          >
            Weak Student Detection & Dropout Risk
          </h2>
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: "var(--iicc-card)",
              border: "2px solid var(--iicc-border)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
            }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--iicc-bg)" }}>
                  <th
                    className="px-4 py-3 text-left font-semibold"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    Branch
                  </th>
                  <th
                    className="px-4 py-3 text-left font-semibold"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    Total
                  </th>
                  <th
                    className="px-4 py-3 text-left font-semibold"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    Weak Students
                  </th>
                  <th
                    className="px-4 py-3 text-left font-semibold"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    % At Risk
                  </th>
                  <th
                    className="px-4 py-3 text-left font-semibold"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    Risk Level
                  </th>
                </tr>
              </thead>
              <tbody>
                {weakStudentData.map((w) => (
                  <tr
                    key={w.branch}
                    style={{ borderBottom: "1px solid var(--iicc-border)" }}
                  >
                    <td
                      className="px-4 py-3 font-medium"
                      style={{ color: "var(--iicc-heading)" }}
                    >
                      {w.branch}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "var(--iicc-muted)" }}
                    >
                      {w.total}
                    </td>
                    <td
                      className="px-4 py-3 font-bold"
                      style={{ color: "var(--iicc-heading)" }}
                    >
                      {w.weak}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "var(--iicc-muted)" }}
                    >
                      {((w.weak / w.total) * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{
                          background:
                            w.risk === "high"
                              ? "oklch(0.60 0.22 25 / 0.15)"
                              : w.risk === "medium"
                                ? "oklch(0.75 0.18 80 / 0.15)"
                                : "oklch(0.45 0.15 145 / 0.15)",
                          color:
                            w.risk === "high"
                              ? "oklch(0.50 0.22 25)"
                              : w.risk === "medium"
                                ? "oklch(0.55 0.18 80)"
                                : "oklch(0.40 0.15 145)",
                        }}
                      >
                        {w.risk === "high"
                          ? "⚠ HIGH"
                          : w.risk === "medium"
                            ? "◆ MEDIUM"
                            : "● LOW"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="space-y-4">
          {/* Hackathon */}
          <section>
            <h2
              className="text-base font-display font-bold mb-3"
              style={{ color: "var(--iicc-heading)" }}
            >
              Hackathon Participation
            </h2>
            <div
              className="rounded-xl p-4 space-y-3"
              style={{
                background: "var(--iicc-card)",
                border: "2px solid #d97706",
                boxShadow: "0 4px 16px rgba(217,119,6,0.15)",
              }}
            >
              {[
                { label: "Teams Registered", value: "24", icon: "🏆" },
                { label: "National Wins", value: "3", icon: "🥇" },
                { label: "Participation Rate", value: "12%", icon: "📊" },
                { label: "Projects Submitted", value: "18", icon: "💡" },
              ].map((h) => (
                <div
                  key={h.label}
                  className="flex items-center justify-between"
                >
                  <span
                    className="text-sm"
                    style={{ color: "var(--iicc-muted)" }}
                  >
                    {h.icon} {h.label}
                  </span>
                  <span
                    className="font-bold text-sm"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    {h.value}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Research */}
          <section>
            <h2
              className="text-base font-display font-bold mb-3"
              style={{ color: "var(--iicc-heading)" }}
            >
              Research Contributions
            </h2>
            <div
              className="rounded-xl p-4 space-y-3"
              style={{
                background: "var(--iicc-card)",
                border: "2px solid #7c3aed",
                boxShadow: "0 4px 16px rgba(124,58,237,0.15)",
              }}
            >
              {[
                { label: "Published Papers", value: "47", icon: "📄" },
                { label: "Patents Filed", value: "4", icon: "🔬" },
                { label: "Conferences", value: "12", icon: "🎤" },
                { label: "Funded Projects", value: "6", icon: "💰" },
              ].map((r) => (
                <div
                  key={r.label}
                  className="flex items-center justify-between"
                >
                  <span
                    className="text-sm"
                    style={{ color: "var(--iicc-muted)" }}
                  >
                    {r.icon} {r.label}
                  </span>
                  <span
                    className="font-bold text-sm"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    {r.value}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Institute vs Top Colleges Comparison */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--iicc-blue)" }}
          >
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <h2
            className="text-lg font-display font-bold"
            style={{ color: "var(--iicc-heading)" }}
          >
            Institute vs. Top Colleges — Gap Analysis
          </h2>
        </div>
        <div
          className="rounded-xl overflow-hidden"
          style={{
            background: "var(--iicc-card)",
            border: "2px solid var(--iicc-border)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
          }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--iicc-blue)", color: "white" }}>
                <th className="px-4 py-3 text-left font-semibold">Metric</th>
                <th className="px-4 py-3 text-center font-semibold">
                  Our Institute
                </th>
                <th className="px-4 py-3 text-center font-semibold">
                  IIT Benchmark
                </th>
                <th className="px-4 py-3 text-center font-semibold">
                  NIT Benchmark
                </th>
                <th className="px-4 py-3 text-center font-semibold">
                  Tier-1 Avg
                </th>
                <th className="px-4 py-3 text-center font-semibold">
                  vs IIT Gap
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, i) => (
                <tr
                  key={row.metric}
                  style={{
                    borderBottom: "1px solid var(--iicc-border)",
                    background: i % 2 === 0 ? "transparent" : "var(--iicc-bg)",
                  }}
                >
                  <td
                    className="px-4 py-3 font-medium"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    {row.metric}
                  </td>
                  <td
                    className="px-4 py-3 text-center font-bold"
                    style={{ color: "var(--iicc-blue)" }}
                  >
                    {row.institute}
                  </td>
                  <td
                    className="px-4 py-3 text-center"
                    style={{ color: "var(--iicc-muted)" }}
                  >
                    {row.iit}
                  </td>
                  <td
                    className="px-4 py-3 text-center"
                    style={{ color: "var(--iicc-muted)" }}
                  >
                    {row.nit}
                  </td>
                  <td
                    className="px-4 py-3 text-center"
                    style={{ color: "var(--iicc-muted)" }}
                  >
                    {row.tier1}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <GapIndicator
                      institute={row.institute}
                      benchmark={row.iit}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Improvement Recommendations */}
      <section>
        <h2
          className="text-lg font-display font-bold mb-4"
          style={{ color: "var(--iicc-heading)" }}
        >
          AI-Powered Improvement Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static list
              key={i}
              className="rounded-xl p-4 flex gap-3"
              style={{
                background: "var(--iicc-card)",
                border: `2px solid ${
                  rec.priority === "Critical"
                    ? "#dc2626"
                    : rec.priority === "High"
                      ? "#d97706"
                      : rec.priority === "Medium"
                        ? "var(--iicc-blue)"
                        : "#059669"
                }`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            >
              <span
                className="px-2 py-0.5 rounded text-xs font-bold h-fit mt-0.5 flex-shrink-0"
                style={{
                  background:
                    rec.priority === "Critical"
                      ? "oklch(0.60 0.22 25 / 0.15)"
                      : rec.priority === "High"
                        ? "oklch(0.75 0.18 80 / 0.15)"
                        : rec.priority === "Medium"
                          ? "var(--iicc-blue-subtle)"
                          : "oklch(0.45 0.15 145 / 0.15)",
                  color:
                    rec.priority === "Critical"
                      ? "oklch(0.50 0.22 25)"
                      : rec.priority === "High"
                        ? "oklch(0.55 0.18 80)"
                        : rec.priority === "Medium"
                          ? "var(--iicc-blue)"
                          : "oklch(0.40 0.15 145)",
                }}
              >
                {rec.priority}
              </span>
              <p className="text-sm" style={{ color: "var(--iicc-muted)" }}>
                {rec.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Placement Statistics */}
      <section>
        <h2
          className="text-lg font-display font-bold mb-4"
          style={{ color: "var(--iicc-heading)" }}
        >
          Placement Statistics
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Total Placed",
              value: "1,428",
              sub: "out of 2,847 eligible",
              color: "#2563eb",
            },
            {
              label: "Average CTC",
              value: "\u20B96.2 LPA",
              sub: "up from \u20B95.8 last year",
              color: "#059669",
            },
            {
              label: "Highest CTC",
              value: "\u20B942 LPA",
              sub: "CSE \u2014 Google",
              color: "#7c3aed",
            },
            {
              label: "Top Recruiters",
              value: "48",
              sub: "companies visited",
              color: "#d97706",
            },
          ].map((p) => (
            <div
              key={p.label}
              className="rounded-xl p-4 text-center"
              style={{
                background: "#ffffff",
                border: `2px solid ${p.color}`,
                boxShadow: `0 4px 16px ${p.color}25`,
              }}
            >
              <div
                className="text-2xl font-bold font-display mb-1"
                style={{ color: p.color }}
              >
                {p.value}
              </div>
              <div
                className="text-sm font-semibold"
                style={{ color: "#1e293b" }}
              >
                {p.label}
              </div>
              <div
                className="text-xs mt-1"
                style={{ color: "var(--iicc-muted)" }}
              >
                {p.sub}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
