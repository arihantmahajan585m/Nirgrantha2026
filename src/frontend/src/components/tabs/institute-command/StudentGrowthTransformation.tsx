import { Award, BookOpen, Brain, Target, TrendingUp, Zap } from "lucide-react";

const weakStudents = [
  {
    name: "Santosh Kamble",
    branch: "Mechanical",
    score: 41,
    risk: "critical",
    mentor: "Dr. V.R. Patil",
  },
  {
    name: "Komal Mane",
    branch: "Civil",
    score: 44,
    risk: "critical",
    mentor: "Dr. R.B. Deshmukh",
  },
  {
    name: "Vishal Pawar",
    branch: "E&TC",
    score: 47,
    risk: "high",
    mentor: "Prof. R.B. Shinde",
  },
  {
    name: "Rutuja Borse",
    branch: "Mechanical",
    score: 50,
    risk: "high",
    mentor: "Prof. S.K. Jagtap",
  },
  {
    name: "Omkar Yadav",
    branch: "IT",
    score: 53,
    risk: "medium",
    mentor: "Prof. A.P. More",
  },
  {
    name: "Dipti Chavan",
    branch: "Civil",
    score: 55,
    risk: "medium",
    mentor: "Dr. R.B. Deshmukh",
  },
  {
    name: "Ajinkya Gaikwad",
    branch: "E&TC",
    score: 57,
    risk: "medium",
    mentor: "Prof. R.B. Shinde",
  },
  {
    name: "Sushant Nalawade",
    branch: "CSE",
    score: 59,
    risk: "medium",
    mentor: "Prof. N.B. Shinde",
  },
];

const improvementPlans = [
  {
    student: "Santosh Kamble",
    branch: "Mechanical",
    actions: [
      "Daily 1-hr tutoring by Dr. V.R. Patil",
      "Assigned to Mech peer study group",
      "Weekly HOD check-in (Fridays)",
      "Extended lab practice sessions",
    ],
    progress: 38,
  },
  {
    student: "Komal Mane",
    branch: "Civil",
    actions: [
      "NPTEL Civil Engineering enrollment",
      "Assignment deadline extension (2 weeks)",
      "Counseling session with WIT counselor",
      "Parent-teacher meeting scheduled",
    ],
    progress: 45,
  },
  {
    student: "Vishal Pawar",
    branch: "E&TC",
    actions: [
      "Signals & Systems coaching by Prof. R.B. Shinde",
      "Attendance improvement plan (target 75%+)",
      "NPTEL Electronics & Communication course",
      "Mock test series (2 per week)",
    ],
    progress: 61,
  },
];

const skillData = [
  { skill: "Programming", current: 62, industry: 85 },
  { skill: "Data Analysis", current: 45, industry: 80 },
  { skill: "Communication", current: 70, industry: 88 },
  { skill: "Problem Solving", current: 58, industry: 82 },
  { skill: "Cloud Computing", current: 38, industry: 75 },
  { skill: "AI/ML Basics", current: 32, industry: 70 },
];

const certifications = [
  { name: "Python Programming", count: 284, icon: "🐍" },
  { name: "Java Development", count: 198, icon: "☕" },
  { name: "AWS Cloud", count: 142, icon: "☁️" },
  { name: "AI/ML Fundamentals", count: 118, icon: "🤖" },
  { name: "Data Science", count: 96, icon: "📊" },
  { name: "Cybersecurity", count: 74, icon: "🔒" },
  { name: "Web Development", count: 212, icon: "🌐" },
  { name: "DevOps", count: 58, icon: "⚙️" },
];

const competitiveExams = [
  { exam: "GATE", enrolled: 312, qualified: 48 },
  { exam: "CAT", enrolled: 186, qualified: 22 },
  { exam: "GRE", enrolled: 94, qualified: 38 },
  { exam: "UPSC", enrolled: 68, qualified: 8 },
  { exam: "TOEFL/IELTS", enrolled: 112, qualified: 78 },
];

const mentorships = [
  {
    mentor: "Dr. S.V. Kulkarni",
    dept: "CSE",
    students: 9,
    avgImprovement: "+20%",
  },
  {
    mentor: "Prof. M.K. Desai",
    dept: "CSE",
    students: 7,
    avgImprovement: "+16%",
  },
  {
    mentor: "Dr. V.R. Patil",
    dept: "Mechanical",
    students: 11,
    avgImprovement: "+13%",
  },
  {
    mentor: "Prof. A.P. More",
    dept: "IT",
    students: 8,
    avgImprovement: "+11%",
  },
  {
    mentor: "Dr. Meena Iyer",
    dept: "Civil",
    students: 7,
    avgImprovement: "+15%",
  },
];

const placementReadiness = [
  { range: "80-100%", count: 284, label: "Industry Ready" },
  { range: "60-79%", count: 512, label: "Near Ready" },
  { range: "40-59%", count: 698, label: "In Progress" },
  { range: "0-39%", count: 312, label: "Needs Work" },
];

export default function StudentGrowthTransformation() {
  const totalStudents = placementReadiness.reduce((a, b) => a + b.count, 0);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-10">
      {/* Header KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Students",
            value: "2,847",
            icon: "🎓",
            color: "var(--iicc-blue)",
          },
          {
            label: "Weak Students",
            value: "286",
            icon: "⚠️",
            color: "oklch(0.60 0.22 25)",
          },
          {
            label: "Avg Readiness",
            value: "64%",
            icon: "🎯",
            color: "oklch(0.52 0.16 160)",
          },
          {
            label: "Industry Ready",
            value: "284",
            icon: "🚀",
            color: "oklch(0.55 0.18 280)",
          },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-xl border p-4 text-center"
            style={{
              background: "var(--iicc-card)",
              borderColor: "var(--iicc-border)",
            }}
          >
            <div className="text-2xl mb-1">{k.icon}</div>
            <div
              className="text-2xl font-bold font-display"
              style={{ color: k.color }}
            >
              {k.value}
            </div>
            <div
              className="text-xs mt-1"
              style={{ color: "var(--iicc-muted)" }}
            >
              {k.label}
            </div>
          </div>
        ))}
      </div>

      {/* Weak Students Panel */}
      <section>
        <h2
          className="text-lg font-display font-bold mb-4"
          style={{ color: "var(--iicc-heading)" }}
        >
          Weak Students Across Branches
        </h2>
        <div
          className="rounded-xl border overflow-hidden"
          style={{
            background: "var(--iicc-card)",
            borderColor: "var(--iicc-border)",
          }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--iicc-blue)", color: "white" }}>
                <th className="px-4 py-3 text-left font-semibold">
                  Student Name
                </th>
                <th className="px-4 py-3 text-left font-semibold">Branch</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Current Score
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  Risk Level
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  Assigned Mentor
                </th>
              </tr>
            </thead>
            <tbody>
              {weakStudents.map((s, i) => (
                <tr
                  key={s.name}
                  style={{
                    borderBottom: "1px solid var(--iicc-border)",
                    background: i % 2 === 0 ? "transparent" : "var(--iicc-bg)",
                  }}
                >
                  <td
                    className="px-4 py-3 font-medium"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    {s.name}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{ color: "var(--iicc-muted)" }}
                  >
                    {s.branch}
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
                            width: `${s.score}%`,
                            background: "oklch(0.60 0.22 25)",
                          }}
                        />
                      </div>
                      <span
                        className="font-bold text-xs"
                        style={{ color: "oklch(0.50 0.22 25)" }}
                      >
                        {s.score}/100
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{
                        background:
                          s.risk === "critical"
                            ? "oklch(0.60 0.22 25 / 0.15)"
                            : s.risk === "high"
                              ? "oklch(0.75 0.18 80 / 0.15)"
                              : "oklch(0.55 0.18 280 / 0.15)",
                        color:
                          s.risk === "critical"
                            ? "oklch(0.50 0.22 25)"
                            : s.risk === "high"
                              ? "oklch(0.55 0.18 80)"
                              : "oklch(0.45 0.18 280)",
                      }}
                    >
                      {s.risk === "critical"
                        ? "🔴 CRITICAL"
                        : s.risk === "high"
                          ? "🟠 HIGH"
                          : "🟡 MEDIUM"}
                    </span>
                  </td>
                  <td
                    className="px-4 py-3 text-xs"
                    style={{ color: "var(--iicc-muted)" }}
                  >
                    {s.mentor}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Convert Weak to Strong */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--iicc-blue)" }}
          >
            <Brain className="w-4 h-4 text-white" />
          </div>
          <h2
            className="text-lg font-display font-bold"
            style={{ color: "var(--iicc-heading)" }}
          >
            "Convert Weak to Strong" — AI Improvement Plans
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {improvementPlans.map((plan) => (
            <div
              key={plan.student}
              className="rounded-xl border p-5"
              style={{
                background: "var(--iicc-card)",
                borderColor: "var(--iicc-border)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div
                    className="font-semibold text-sm"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    {plan.student}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--iicc-muted)" }}
                  >
                    {plan.branch}
                  </div>
                </div>
                <span
                  className="px-2 py-0.5 rounded text-xs font-bold"
                  style={{
                    background: "var(--iicc-blue-subtle)",
                    color: "var(--iicc-blue)",
                  }}
                >
                  AI Plan
                </span>
              </div>
              <div className="mb-3">
                <div
                  className="flex justify-between text-xs mb-1"
                  style={{ color: "var(--iicc-muted)" }}
                >
                  <span>Recovery Progress</span>
                  <span>{plan.progress}%</span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: "var(--iicc-border)" }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${plan.progress}%`,
                      background:
                        "linear-gradient(90deg, var(--iicc-blue) 0%, oklch(0.52 0.16 160) 100%)",
                    }}
                  />
                </div>
              </div>
              <ul className="space-y-1.5">
                {plan.actions.map((action) => (
                  <li
                    key={action}
                    className="flex items-start gap-2 text-xs"
                    style={{ color: "var(--iicc-muted)" }}
                  >
                    <span
                      className="mt-0.5 flex-shrink-0"
                      style={{ color: "var(--iicc-blue)" }}
                    >
                      →
                    </span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Skill Gap Analysis + Placement Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2
            className="text-lg font-display font-bold mb-4"
            style={{ color: "var(--iicc-heading)" }}
          >
            Skill Gap Analysis
          </h2>
          <div
            className="rounded-xl border p-5 space-y-4"
            style={{
              background: "var(--iicc-card)",
              borderColor: "var(--iicc-border)",
            }}
          >
            <div
              className="flex items-center gap-4 text-xs mb-2"
              style={{ color: "var(--iicc-muted)" }}
            >
              <span className="flex items-center gap-1">
                <span
                  className="w-3 h-1.5 rounded inline-block"
                  style={{ background: "var(--iicc-blue)" }}
                />{" "}
                Current Level
              </span>
              <span className="flex items-center gap-1">
                <span
                  className="w-3 h-1.5 rounded inline-block"
                  style={{ background: "oklch(0.75 0.18 80)" }}
                />{" "}
                Industry Demand
              </span>
            </div>
            {skillData.map((s) => (
              <div key={s.skill}>
                <div
                  className="flex justify-between text-xs mb-1.5"
                  style={{ color: "var(--iicc-muted)" }}
                >
                  <span
                    className="font-medium"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    {s.skill}
                  </span>
                  <span>Gap: {s.industry - s.current}pts</span>
                </div>
                <div
                  className="relative h-3 rounded-full overflow-hidden"
                  style={{ background: "var(--iicc-border)" }}
                >
                  <div
                    className="absolute inset-y-0 left-0 rounded-full opacity-40"
                    style={{
                      width: `${s.industry}%`,
                      background: "oklch(0.75 0.18 80)",
                    }}
                  />
                  <div
                    className="absolute inset-y-0 left-0 rounded-full"
                    style={{
                      width: `${s.current}%`,
                      background: "var(--iicc-blue)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2
            className="text-lg font-display font-bold mb-4"
            style={{ color: "var(--iicc-heading)" }}
          >
            Placement Readiness Distribution
          </h2>
          <div
            className="rounded-xl border p-5"
            style={{
              background: "var(--iicc-card)",
              borderColor: "var(--iicc-border)",
            }}
          >
            <div className="space-y-4">
              {placementReadiness.map((p, i) => {
                const colors = [
                  "oklch(0.52 0.16 160)",
                  "var(--iicc-blue)",
                  "oklch(0.75 0.18 80)",
                  "oklch(0.60 0.22 25)",
                ];
                return (
                  <div key={p.range}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span
                        className="font-medium"
                        style={{ color: "var(--iicc-heading)" }}
                      >
                        {p.label} ({p.range})
                      </span>
                      <span style={{ color: "var(--iicc-muted)" }}>
                        {p.count} students (
                        {((p.count / totalStudents) * 100).toFixed(0)}%)
                      </span>
                    </div>
                    <div
                      className="h-4 rounded-full overflow-hidden"
                      style={{ background: "var(--iicc-border)" }}
                    >
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(p.count / totalStudents) * 100}%`,
                          background: colors[i],
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Industry Readiness Index */}
            <div
              className="mt-6 pt-4 text-center"
              style={{ borderTop: "1px solid var(--iicc-border)" }}
            >
              <div
                className="text-xs mb-2"
                style={{ color: "var(--iicc-muted)" }}
              >
                Industry Readiness Index
              </div>
              <div className="relative w-32 h-32 mx-auto">
                <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                  <title>Chart</title>
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="var(--iicc-border)"
                    strokeWidth="10"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="var(--iicc-blue)"
                    strokeWidth="10"
                    strokeDasharray={`${2 * Math.PI * 50 * 0.64} ${2 * Math.PI * 50}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className="text-2xl font-bold font-display"
                    style={{ color: "var(--iicc-blue)" }}
                  >
                    64%
                  </span>
                  <span
                    className="text-xs"
                    style={{ color: "var(--iicc-muted)" }}
                  >
                    Overall
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Certifications + Competitive Exams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2
            className="text-lg font-display font-bold mb-4"
            style={{ color: "var(--iicc-heading)" }}
          >
            Certification Tracking
          </h2>
          <div
            className="rounded-xl border p-5 grid grid-cols-2 gap-3"
            style={{
              background: "var(--iicc-card)",
              borderColor: "var(--iicc-border)",
            }}
          >
            {certifications.map((c) => (
              <div
                key={c.name}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: "var(--iicc-bg)" }}
              >
                <span className="text-xl">{c.icon}</span>
                <div>
                  <div
                    className="text-xs font-semibold"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    {c.name}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--iicc-blue)" }}
                  >
                    {c.count} students
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2
            className="text-lg font-display font-bold mb-4"
            style={{ color: "var(--iicc-heading)" }}
          >
            Competitive Exam Preparation
          </h2>
          <div
            className="rounded-xl border overflow-hidden"
            style={{
              background: "var(--iicc-card)",
              borderColor: "var(--iicc-border)",
            }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--iicc-blue)", color: "white" }}>
                  <th className="px-4 py-3 text-left font-semibold">Exam</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Enrolled
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Qualified
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">Rate</th>
                </tr>
              </thead>
              <tbody>
                {competitiveExams.map((e, i) => (
                  <tr
                    key={e.exam}
                    style={{
                      borderBottom: "1px solid var(--iicc-border)",
                      background:
                        i % 2 === 0 ? "transparent" : "var(--iicc-bg)",
                    }}
                  >
                    <td
                      className="px-4 py-3 font-medium"
                      style={{ color: "var(--iicc-heading)" }}
                    >
                      {e.exam}
                    </td>
                    <td
                      className="px-4 py-3"
                      style={{ color: "var(--iicc-muted)" }}
                    >
                      {e.enrolled}
                    </td>
                    <td
                      className="px-4 py-3 font-semibold"
                      style={{ color: "oklch(0.52 0.16 160)" }}
                    >
                      {e.qualified}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="text-xs font-bold"
                        style={{ color: "var(--iicc-blue)" }}
                      >
                        {((e.qualified / e.enrolled) * 100).toFixed(0)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mentorship Allocation */}
          <div
            className="mt-4 rounded-xl border p-4"
            style={{
              background: "var(--iicc-card)",
              borderColor: "var(--iicc-border)",
            }}
          >
            <h3
              className="text-sm font-semibold mb-3"
              style={{ color: "var(--iicc-heading)" }}
            >
              Mentorship Allocation
            </h3>
            <div className="space-y-2">
              {mentorships.map((m) => (
                <div
                  key={m.mentor}
                  className="flex items-center justify-between text-xs"
                >
                  <span style={{ color: "var(--iicc-heading)" }}>
                    {m.mentor}{" "}
                    <span style={{ color: "var(--iicc-muted)" }}>
                      ({m.dept})
                    </span>
                  </span>
                  <div className="flex items-center gap-3">
                    <span style={{ color: "var(--iicc-muted)" }}>
                      {m.students} students
                    </span>
                    <span
                      className="font-bold"
                      style={{ color: "oklch(0.52 0.16 160)" }}
                    >
                      {m.avgImprovement}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Internship Participation */}
      <section>
        <h2
          className="text-lg font-display font-bold mb-4"
          style={{ color: "var(--iicc-heading)" }}
        >
          Internship Participation by Branch
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { branch: "CSE", rate: 72, count: 346 },
            { branch: "IT", rate: 68, count: 245 },
            { branch: "ECE", rate: 54, count: 227 },
            { branch: "Mechanical", rate: 42, count: 160 },
            { branch: "Civil", rate: 38, count: 122 },
            { branch: "EEE", rate: 48, count: 135 },
          ].map((b) => (
            <div
              key={b.branch}
              className="rounded-xl border p-4 text-center"
              style={{
                background: "var(--iicc-card)",
                borderColor: "var(--iicc-border)",
              }}
            >
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                  <title>Chart</title>
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    fill="none"
                    stroke="var(--iicc-border)"
                    strokeWidth="6"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="26"
                    fill="none"
                    stroke="var(--iicc-blue)"
                    strokeWidth="6"
                    strokeDasharray={`${(2 * Math.PI * 26 * b.rate) / 100} ${2 * Math.PI * 26}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-xs font-bold"
                    style={{ color: "var(--iicc-blue)" }}
                  >
                    {b.rate}%
                  </span>
                </div>
              </div>
              <div
                className="text-sm font-semibold"
                style={{ color: "var(--iicc-heading)" }}
              >
                {b.branch}
              </div>
              <div className="text-xs" style={{ color: "var(--iicc-muted)" }}>
                {b.count} students
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
