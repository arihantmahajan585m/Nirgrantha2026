import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertCircle,
  Award,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Code2,
  Star,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

const studentData = {
  name: "Arihant Mahajan",
  branch: "Computer Science & Engineering",
  division: "Division A",
  semester: 5,
  totalSemesters: 8,
  rollNo: "21CSE047",
  attendance: 84,
  assignmentCompletion: 88,
  overallGrade: "A",
  cgpa: 8.4,
};

const subjects = [
  {
    name: "Design & Analysis of Algorithms",
    internal: 38,
    max: 50,
    grade: "A+",
    attendance: 78,
  },
  {
    name: "Database Management Systems",
    internal: 44,
    max: 50,
    grade: "O",
    attendance: 91,
  },
  {
    name: "Theory of Computation",
    internal: 35,
    max: 50,
    grade: "A",
    attendance: 86,
  },
  {
    name: "Microprocessors & Interfacing",
    internal: 40,
    max: 50,
    grade: "A+",
    attendance: 82,
  },
  {
    name: "Software Engineering",
    internal: 42,
    max: 50,
    grade: "A+",
    attendance: 88,
  },
  {
    name: "Open Elective I",
    internal: 36,
    max: 50,
    grade: "A",
    attendance: 80,
  },
];

const skills = [
  { name: "Problem Solving", level: 82 },
  { name: "Communication", level: 74 },
  { name: "Teamwork", level: 88 },
  { name: "Technical Writing", level: 68 },
  { name: "Leadership", level: 71 },
];

const achievements = [
  {
    type: "Hackathon",
    title: "Smart India Hackathon 2025 – WIT Team",
    result: "Institute Finalist",
    icon: "🏆",
    color: "var(--parent-primary)",
  },
  {
    type: "Project",
    title: "NIRGRANTHA – EdTech Platform",
    result: "Founder & Developer",
    icon: "🚀",
    color: "oklch(0.55 0.18 280)",
  },
  {
    type: "Award",
    title: "Best Final Year Project Proposal – CSE Dept.",
    result: "Winner",
    icon: "🥇",
    color: "oklch(0.65 0.18 60)",
  },
  {
    type: "Club",
    title: "WIT Coding Club",
    result: "Core Member",
    icon: "💻",
    color: "oklch(0.52 0.14 185)",
  },
  {
    type: "Event",
    title: "WIT TechFest 2025 – Paper Presentation",
    result: "2nd Place",
    icon: "📄",
    color: "oklch(0.55 0.15 145)",
  },
  {
    type: "Leadership",
    title: "CSE Class Representative (TY-A)",
    result: "Elected",
    icon: "👑",
    color: "oklch(0.60 0.18 30)",
  },
];

const careerData = {
  targetExam: "GATE CSE 2026 / Campus Placements 2026",
  placementReadiness: 78,
  internshipStatus: "In Progress – WIT CSE Dept. Project Internship (2025–26)",
  certifications: [
    "AWS Cloud Practitioner (In Progress)",
    "NPTEL Data Structures",
    "Coursera Python for Everybody",
  ],
  leetcode: { solved: 156, easy: 78, medium: 62, hard: 16 },
  github: { repos: 12, contributions: 347, streak: 22 },
};

const monthlyPerformance = [
  { month: "Aug", score: 72 },
  { month: "Sep", score: 75 },
  { month: "Oct", score: 71 },
  { month: "Nov", score: 79 },
  { month: "Dec", score: 83 },
  { month: "Jan", score: 86 },
];

const strengths = [
  "DBMS & SQL Queries",
  "Python & Web Development",
  "Project Leadership",
  "Competitive Programming (LeetCode)",
];
const weakAreas = [
  "Dynamic Programming (DAA)",
  "Attendance in DAA lectures",
  "Time Management in University Exams",
];

function MiniLineChart({ data }: { data: { month: string; score: number }[] }) {
  const max = Math.max(...data.map((d) => d.score));
  const min = Math.min(...data.map((d) => d.score));
  const range = max - min || 1;
  const w = 300;
  const h = 80;
  const pad = 10;
  const points = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((d.score - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  });
  const polyline = points.join(" ");
  const areaPoints = `${pad},${h - pad} ${polyline} ${w - pad},${h - pad}`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full h-20"
      preserveAspectRatio="none"
    >
      <title>Chart</title>
      <defs>
        <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor="var(--parent-primary)"
            stopOpacity="0.25"
          />
          <stop
            offset="100%"
            stopColor="var(--parent-primary)"
            stopOpacity="0.02"
          />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#chartGrad)" />
      <polyline
        points={polyline}
        fill="none"
        stroke="var(--parent-primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((d, i) => {
        const x = pad + (i / (data.length - 1)) * (w - pad * 2);
        const y = h - pad - ((d.score - min) / range) * (h - pad * 2);
        return (
          <circle
            // biome-ignore lint/suspicious/noArrayIndexKey: static list
            key={i}
            cx={x}
            cy={y}
            r="3.5"
            fill="var(--parent-primary)"
            stroke="white"
            strokeWidth="1.5"
          />
        );
      })}
    </svg>
  );
}

function CircleProgress({
  value,
  size = 64,
  stroke = 6,
}: { value: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <title>Chart</title>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--parent-border)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--parent-primary)"
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.22}
        fontWeight="700"
        fill="var(--parent-heading)"
      >
        {value}%
      </text>
    </svg>
  );
}

export default function StudentGrowthActivityReport() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
      {/* Student Identity Card */}
      <div
        className="rounded-2xl p-6 flex flex-wrap items-center gap-6 relative"
        style={{
          background:
            "linear-gradient(135deg, #0c4a6e 0%, #075985 35%, #0369a1 65%, #0284c7 100%)",
        }}
      >
        <img
          src="/assets/generated/nirgrantha-logo-transparent.dim_400x80.png"
          alt="NIRGRANTHA"
          className="absolute top-4 right-6 h-5 w-auto"
          style={{ filter: "brightness(0) invert(1)", opacity: 0.7 }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold text-white">
          {studentData.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-display font-bold text-white">
            {studentData.name}
          </h2>
          <p className="text-white/80 text-sm mt-0.5">
            {studentData.branch} · {studentData.division}
          </p>
          <p className="text-white/70 text-xs mt-0.5">
            Roll No: {studentData.rollNo} · Semester {studentData.semester} of{" "}
            {studentData.totalSemesters}
          </p>
        </div>
        <div className="flex gap-6 flex-wrap">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {studentData.cgpa}
            </div>
            <div className="text-white/70 text-xs">CGPA</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {studentData.attendance}%
            </div>
            <div className="text-white/70 text-xs">Attendance</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {studentData.overallGrade}
            </div>
            <div className="text-white/70 text-xs">Grade</div>
          </div>
        </div>
      </div>

      {/* Section 1: Academic Overview */}
      <section>
        <h2
          className="text-lg font-display font-bold mb-4 flex items-center gap-2"
          style={{ color: "var(--parent-heading)" }}
        >
          <span className="text-xl">🎓</span> Academic Overview
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{
              background:
                "linear-gradient(135deg, #e0f2fe 0%, #bae6fd 60%, #7dd3fc 100%)",
              borderLeft: "4px solid #0284c7",
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-sm font-semibold"
                style={{ color: "#0c4a6e" }}
              >
                Semester Progress
              </span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: "var(--parent-badge-bg)",
                  color: "var(--parent-primary)",
                }}
              >
                Sem {studentData.semester}/{studentData.totalSemesters}
              </span>
            </div>
            <Progress
              value={(studentData.semester / studentData.totalSemesters) * 100}
              className="h-2"
            />
            <p className="text-xs" style={{ color: "var(--parent-muted)" }}>
              {studentData.semester} of {studentData.totalSemesters} semesters
              completed
            </p>
          </div>
          <div
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{
              background:
                "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 60%, #bbf7d0 100%)",
              borderLeft: "4px solid #16a34a",
            }}
          >
            <span
              className="text-sm font-semibold"
              style={{ color: "#14532d" }}
            >
              Attendance
            </span>
            <div className="flex items-center gap-4">
              <CircleProgress value={studentData.attendance} size={64} />
              <div>
                <p className="text-xs" style={{ color: "var(--parent-muted)" }}>
                  Overall attendance
                </p>
                <p
                  className="text-xs mt-1 font-medium"
                  style={{
                    color:
                      studentData.attendance >= 85
                        ? "oklch(0.52 0.15 145)"
                        : "oklch(0.55 0.18 30)",
                  }}
                >
                  {studentData.attendance >= 85
                    ? "✓ Good Standing"
                    : "⚠ Needs Improvement"}
                </p>
              </div>
            </div>
          </div>
          <div
            className="rounded-2xl p-5 flex flex-col gap-3"
            style={{
              background: "var(--parent-card)",
              border: "1px solid var(--parent-border)",
            }}
          >
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--parent-heading)" }}
            >
              Assignment Completion
            </span>
            <div className="flex items-center gap-4">
              <CircleProgress
                value={studentData.assignmentCompletion}
                size={64}
              />
              <div>
                <p className="text-xs" style={{ color: "var(--parent-muted)" }}>
                  Assignments submitted
                </p>
                <p
                  className="text-xs mt-1 font-medium"
                  style={{ color: "oklch(0.52 0.15 145)" }}
                >
                  ✓ Excellent
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Subject-wise Performance */}
        <div
          className="rounded-2xl p-6"
          style={{
            background: "var(--parent-card)",
            border: "1px solid var(--parent-border)",
          }}
        >
          <h3
            className="text-sm font-bold mb-4"
            style={{ color: "var(--parent-heading)" }}
          >
            Subject-wise Performance
          </h3>
          <div className="space-y-3">
            {subjects.map((sub) => (
              <div key={sub.name} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-xs font-medium truncate"
                      style={{ color: "var(--parent-heading)" }}
                    >
                      {sub.name}
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span
                        className="text-xs"
                        style={{ color: "var(--parent-muted)" }}
                      >
                        {sub.internal}/{sub.max}
                      </span>
                      <span
                        className="text-xs font-bold px-1.5 py-0.5 rounded"
                        style={{
                          background: "var(--parent-badge-bg)",
                          color: "var(--parent-primary)",
                        }}
                      >
                        {sub.grade}
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={(sub.internal / sub.max) * 100}
                    className="h-1.5"
                  />
                </div>
                <div
                  className="text-xs w-16 text-right flex-shrink-0"
                  style={{ color: "var(--parent-muted)" }}
                >
                  {sub.attendance}% att.
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Skill Development */}
        <div
          className="rounded-2xl p-6 mt-4"
          style={{
            background: "var(--parent-card)",
            border: "1px solid var(--parent-border)",
          }}
        >
          <h3
            className="text-sm font-bold mb-4"
            style={{ color: "var(--parent-heading)" }}
          >
            Skill Development Progress
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between mb-1.5">
                  <span
                    className="text-xs font-medium"
                    style={{ color: "var(--parent-heading)" }}
                  >
                    {skill.name}
                  </span>
                  <span
                    className="text-xs font-bold"
                    style={{ color: "var(--parent-primary)" }}
                  >
                    {skill.level}%
                  </span>
                </div>
                <Progress value={skill.level} className="h-2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Activities & Achievements */}
      <section>
        <h2
          className="text-lg font-display font-bold mb-4 flex items-center gap-2"
          style={{ color: "var(--parent-heading)" }}
        >
          <span className="text-xl">🏆</span> Activities & Achievements
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((ach) => (
            <div
              key={ach.title}
              className="rounded-2xl p-5 flex items-start gap-4 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: "var(--parent-card)",
                border: "1px solid var(--parent-border)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: "var(--parent-accent-subtle)" }}
              >
                {ach.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="text-xs font-semibold mb-0.5"
                  style={{ color: "var(--parent-muted)" }}
                >
                  {ach.type}
                </div>
                <div
                  className="text-sm font-semibold leading-tight"
                  style={{ color: "var(--parent-heading)" }}
                >
                  {ach.title}
                </div>
                <div className="mt-1.5">
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: "var(--parent-badge-bg)",
                      color: "var(--parent-primary)",
                    }}
                  >
                    {ach.result}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Career & Exam Preparation */}
      <section>
        <h2
          className="text-lg font-display font-bold mb-4 flex items-center gap-2"
          style={{ color: "var(--parent-heading)" }}
        >
          <span className="text-xl">🎯</span> Career & Exam Preparation
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div
            className="rounded-2xl p-6 space-y-4"
            style={{
              background: "var(--parent-card)",
              border: "1px solid var(--parent-border)",
            }}
          >
            <div className="flex items-center gap-3">
              <Target
                className="w-5 h-5 flex-shrink-0"
                style={{ color: "var(--parent-primary)" }}
              />
              <div>
                <div
                  className="text-xs"
                  style={{ color: "var(--parent-muted)" }}
                >
                  Target Competitive Exam
                </div>
                <div
                  className="text-sm font-bold"
                  style={{ color: "var(--parent-heading)" }}
                >
                  {careerData.targetExam}
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span
                  className="text-xs font-semibold"
                  style={{ color: "var(--parent-heading)" }}
                >
                  Placement Readiness Score
                </span>
                <span
                  className="text-xs font-bold"
                  style={{ color: "var(--parent-primary)" }}
                >
                  {careerData.placementReadiness}%
                </span>
              </div>
              <Progress value={careerData.placementReadiness} className="h-3" />
              <p
                className="text-xs mt-1"
                style={{ color: "var(--parent-muted)" }}
              >
                Above average for batch
              </p>
            </div>
            <div className="flex items-start gap-3">
              <Briefcase
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                style={{ color: "var(--parent-primary)" }}
              />
              <div>
                <div
                  className="text-xs"
                  style={{ color: "var(--parent-muted)" }}
                >
                  Internship Status
                </div>
                <div
                  className="text-sm font-semibold"
                  style={{ color: "var(--parent-heading)" }}
                >
                  {careerData.internshipStatus}
                </div>
              </div>
            </div>
            <div>
              <div
                className="text-xs font-semibold mb-2"
                style={{ color: "var(--parent-heading)" }}
              >
                Certifications Completed
              </div>
              <div className="flex flex-wrap gap-2">
                {careerData.certifications.map((cert) => (
                  <span
                    key={cert}
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{
                      background: "var(--parent-badge-bg)",
                      color: "var(--parent-primary)",
                    }}
                  >
                    ✓ {cert}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div
            className="rounded-2xl p-6 space-y-4"
            style={{
              background: "var(--parent-card)",
              border: "1px solid var(--parent-border)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Code2
                className="w-5 h-5"
                style={{ color: "var(--parent-primary)" }}
              />
              <span
                className="text-sm font-bold"
                style={{ color: "var(--parent-heading)" }}
              >
                Coding Progress
              </span>
            </div>
            <div
              className="rounded-xl p-4"
              style={{ background: "var(--parent-accent-subtle)" }}
            >
              <div
                className="text-xs font-semibold mb-3"
                style={{ color: "var(--parent-heading)" }}
              >
                LeetCode Summary
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: "oklch(0.52 0.15 145)" }}
                  >
                    {careerData.leetcode.easy}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--parent-muted)" }}
                  >
                    Easy
                  </div>
                </div>
                <div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: "oklch(0.65 0.18 60)" }}
                  >
                    {careerData.leetcode.medium}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--parent-muted)" }}
                  >
                    Medium
                  </div>
                </div>
                <div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: "oklch(0.55 0.22 25)" }}
                  >
                    {careerData.leetcode.hard}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--parent-muted)" }}
                  >
                    Hard
                  </div>
                </div>
              </div>
              <div className="mt-2 text-center">
                <span
                  className="text-xs font-semibold"
                  style={{ color: "var(--parent-primary)" }}
                >
                  {careerData.leetcode.solved} Total Solved
                </span>
              </div>
            </div>
            <div
              className="rounded-xl p-4"
              style={{ background: "var(--parent-accent-subtle)" }}
            >
              <div
                className="text-xs font-semibold mb-3"
                style={{ color: "var(--parent-heading)" }}
              >
                GitHub Activity
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: "var(--parent-primary)" }}
                  >
                    {careerData.github.repos}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--parent-muted)" }}
                  >
                    Repos
                  </div>
                </div>
                <div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: "var(--parent-primary)" }}
                  >
                    {careerData.github.contributions}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--parent-muted)" }}
                  >
                    Contributions
                  </div>
                </div>
                <div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: "var(--parent-primary)" }}
                  >
                    {careerData.github.streak}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--parent-muted)" }}
                  >
                    Day Streak
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Monthly Performance Summary */}
      <section>
        <h2
          className="text-lg font-display font-bold mb-4 flex items-center gap-2"
          style={{ color: "var(--parent-heading)" }}
        >
          <span className="text-xl">📈</span> Monthly Performance Summary
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Improvement Graph */}
          <div
            className="lg:col-span-2 rounded-2xl p-6"
            style={{
              background: "var(--parent-card)",
              border: "1px solid var(--parent-border)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-sm font-bold"
                style={{ color: "var(--parent-heading)" }}
              >
                Performance Trend (Aug–Jan)
              </h3>
              <div
                className="flex items-center gap-1.5 text-xs font-semibold"
                style={{ color: "oklch(0.52 0.15 145)" }}
              >
                <TrendingUp className="w-4 h-4" />
                +14 pts improvement
              </div>
            </div>
            <MiniLineChart data={monthlyPerformance} />
            <div className="flex justify-between mt-2">
              {monthlyPerformance.map((d) => (
                <span
                  key={d.month}
                  className="text-xs"
                  style={{ color: "var(--parent-muted)" }}
                >
                  {d.month}
                </span>
              ))}
            </div>
          </div>

          {/* Strengths & Weak Areas */}
          <div className="space-y-4">
            <div
              className="rounded-2xl p-5"
              style={{
                background: "var(--parent-card)",
                border: "1px solid var(--parent-border)",
              }}
            >
              <h3
                className="text-sm font-bold mb-3 flex items-center gap-2"
                style={{ color: "var(--parent-heading)" }}
              >
                <CheckCircle2
                  className="w-4 h-4"
                  style={{ color: "oklch(0.52 0.15 145)" }}
                />
                Strength Areas
              </h3>
              <ul className="space-y-2">
                {strengths.map((s) => (
                  <li
                    key={s}
                    className="flex items-center gap-2 text-xs"
                    style={{ color: "var(--parent-heading)" }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "oklch(0.52 0.15 145)" }}
                    />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="rounded-2xl p-5"
              style={{
                background: "var(--parent-card)",
                border: "1px solid var(--parent-border)",
              }}
            >
              <h3
                className="text-sm font-bold mb-3 flex items-center gap-2"
                style={{ color: "var(--parent-heading)" }}
              >
                <AlertCircle
                  className="w-4 h-4"
                  style={{ color: "oklch(0.65 0.18 60)" }}
                />
                Areas to Improve
              </h3>
              <ul className="space-y-2">
                {weakAreas.map((w) => (
                  <li
                    key={w}
                    className="flex items-center gap-2 text-xs"
                    style={{ color: "var(--parent-heading)" }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "oklch(0.65 0.18 60)" }}
                    />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* AI Recommendation */}
        <div
          className="mt-4 rounded-2xl p-6"
          style={{
            background:
              "linear-gradient(135deg, var(--parent-accent-subtle) 0%, var(--parent-badge-bg) 100%)",
            border: "1px solid var(--parent-border)",
          }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: "var(--parent-primary)" }}
            >
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--parent-heading)" }}
                >
                  AI Growth Recommendation
                </span>
                <Badge
                  variant="outline"
                  className="text-xs"
                  style={{
                    borderColor: "var(--parent-primary)",
                    color: "var(--parent-primary)",
                  }}
                >
                  AI Powered
                </Badge>
              </div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--parent-heading)" }}
              >
                Arihant is performing well in DBMS and Software Engineering with
                outstanding scores. To maximize GATE CSE 2026 readiness, focus
                on strengthening Dynamic Programming and Graph Algorithms in
                DAA. Increase LeetCode medium/hard problem practice to 2–3 per
                day. Attendance in DAA lectures needs attention — target 85%+.
                With this trajectory, full GATE preparation from Semester 6 will
                yield strong results.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
