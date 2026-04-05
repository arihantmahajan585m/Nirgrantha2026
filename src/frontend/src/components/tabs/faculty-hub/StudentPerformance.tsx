import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Award, Code2, Download, TrendingUp, User } from "lucide-react";
import { useState } from "react";

interface Student {
  id: number;
  name: string;
  branch: string;
  division: string;
  subject: string;
  attendance: number;
  performance: number;
  assignments: number;
  participation: number;
  achievements: number;
  hackathons: number;
  skillGrowth: number[];
}

const mockStudents: Student[] = [
  {
    id: 1,
    name: "Arihant Mahajan",
    branch: "CSE",
    division: "A",
    subject: "Design & Analysis of Algorithms",
    attendance: 78,
    performance: 82,
    assignments: 88,
    participation: 86,
    achievements: 5,
    hackathons: 2,
    skillGrowth: [58, 64, 70, 74, 78, 82],
  },
  {
    id: 2,
    name: "Priya Sharma",
    branch: "CSE",
    division: "A",
    subject: "Design & Analysis of Algorithms",
    attendance: 90,
    performance: 88,
    assignments: 92,
    participation: 85,
    achievements: 4,
    hackathons: 3,
    skillGrowth: [65, 70, 75, 79, 84, 88],
  },
  {
    id: 3,
    name: "Rahul More",
    branch: "CSE",
    division: "B",
    subject: "Design & Analysis of Algorithms",
    attendance: 82,
    performance: 91,
    assignments: 90,
    participation: 92,
    achievements: 6,
    hackathons: 4,
    skillGrowth: [70, 76, 80, 85, 88, 91],
  },
  {
    id: 4,
    name: "Sneha Kulkarni",
    branch: "IT",
    division: "A",
    subject: "Web Technologies",
    attendance: 94,
    performance: 93,
    assignments: 97,
    participation: 90,
    achievements: 5,
    hackathons: 2,
    skillGrowth: [74, 79, 83, 87, 90, 93],
  },
  {
    id: 5,
    name: "Sushant Nalawade",
    branch: "CSE",
    division: "B",
    subject: "Design & Analysis of Algorithms",
    attendance: 64,
    performance: 57,
    assignments: 62,
    participation: 54,
    achievements: 1,
    hackathons: 0,
    skillGrowth: [38, 42, 46, 50, 54, 57],
  },
  {
    id: 6,
    name: "Amit Desai",
    branch: "E&TC",
    division: "A",
    subject: "Microprocessors & Interfacing",
    attendance: 86,
    performance: 80,
    assignments: 84,
    participation: 76,
    achievements: 3,
    hackathons: 2,
    skillGrowth: [60, 65, 70, 74, 77, 80],
  },
  {
    id: 7,
    name: "Pooja Singh",
    branch: "IT",
    division: "A",
    subject: "Web Technologies",
    attendance: 71,
    performance: 67,
    assignments: 70,
    participation: 64,
    achievements: 2,
    hackathons: 1,
    skillGrowth: [48, 52, 56, 60, 64, 67],
  },
  {
    id: 8,
    name: "Neha Jadhav",
    branch: "CSE",
    division: "A",
    subject: "Software Engineering",
    attendance: 91,
    performance: 87,
    assignments: 93,
    participation: 89,
    achievements: 4,
    hackathons: 3,
    skillGrowth: [64, 69, 73, 77, 82, 87],
  },
];

function MiniSkillGraph({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 32;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} className="overflow-visible">
      <title>Chart</title>
      <polyline
        points={points}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * w;
        const y = h - ((v - min) / range) * h;
        // biome-ignore lint/suspicious/noArrayIndexKey: static list
        return <circle key={i} cx={x} cy={y} r="2.5" fill="#3b82f6" />;
      })}
    </svg>
  );
}

function AttendanceChart({ students }: { students: Student[] }) {
  const ranges = [
    {
      label: "90-100%",
      count: students.filter((s) => s.attendance >= 90).length,
      color: "bg-green-500",
    },
    {
      label: "75-89%",
      count: students.filter((s) => s.attendance >= 75 && s.attendance < 90)
        .length,
      color: "bg-blue-500",
    },
    {
      label: "60-74%",
      count: students.filter((s) => s.attendance >= 60 && s.attendance < 75)
        .length,
      color: "bg-orange-400",
    },
    {
      label: "<60%",
      count: students.filter((s) => s.attendance < 60).length,
      color: "bg-red-400",
    },
  ];
  const maxCount = Math.max(...ranges.map((r) => r.count), 1);

  return (
    <div className="flex items-end gap-3 h-24">
      {ranges.map((r) => (
        <div key={r.label} className="flex flex-col items-center gap-1 flex-1">
          <span className="text-xs font-bold text-fhub-heading">{r.count}</span>
          <div
            className={`w-full rounded-t-md ${r.color} transition-all duration-700`}
            style={{
              height: `${(r.count / maxCount) * 64}px`,
              minHeight: r.count > 0 ? "4px" : "0",
            }}
          />
          <span className="text-[10px] text-fhub-muted text-center leading-tight">
            {r.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function StudentPerformance() {
  const [filterBranch, setFilterBranch] = useState("All");
  const [filterDivision, setFilterDivision] = useState("All");
  const [filterSubject, setFilterSubject] = useState("All");
  const [searchStudent, setSearchStudent] = useState("");

  const filtered = mockStudents.filter((s) => {
    if (filterBranch !== "All" && s.branch !== filterBranch) return false;
    if (filterDivision !== "All" && s.division !== filterDivision) return false;
    if (filterSubject !== "All" && s.subject !== filterSubject) return false;
    if (
      searchStudent &&
      !s.name.toLowerCase().includes(searchStudent.toLowerCase())
    )
      return false;
    return true;
  });

  const branches = [
    "All",
    ...Array.from(new Set(mockStudents.map((s) => s.branch))),
  ];
  const divisions = ["All", "A", "B", "C", "D"];
  const subjects = [
    "All",
    ...Array.from(new Set(mockStudents.map((s) => s.subject))),
  ];

  const handleExport = () => {
    const headers = [
      "Name",
      "Branch",
      "Division",
      "Subject",
      "Attendance%",
      "Performance%",
      "Assignments%",
      "Participation%",
      "Achievements",
      "Hackathons",
    ];
    const rows = filtered.map((s) => [
      s.name,
      s.branch,
      s.division,
      s.subject,
      s.attendance,
      s.performance,
      s.assignments,
      s.participation,
      s.achievements,
      s.hackathons,
    ]);
    const csv = [headers, ...rows].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student-performance-report.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const avgAttendance = filtered.length
    ? Math.round(
        filtered.reduce((s, st) => s + st.attendance, 0) / filtered.length,
      )
    : 0;
  const avgPerformance = filtered.length
    ? Math.round(
        filtered.reduce((s, st) => s + st.performance, 0) / filtered.length,
      )
    : 0;

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">
      {/* Filters + Export */}
      <div className="bg-white dark:bg-fhub-card rounded-2xl border border-fhub-border shadow-fhub p-5">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={filterBranch} onValueChange={setFilterBranch}>
            <SelectTrigger className="w-32 border-fhub-border bg-fhub-bg text-fhub-heading text-sm">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              {branches.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterDivision} onValueChange={setFilterDivision}>
            <SelectTrigger className="w-32 border-fhub-border bg-fhub-bg text-fhub-heading text-sm">
              <SelectValue placeholder="Division" />
            </SelectTrigger>
            <SelectContent>
              {divisions.map((d) => (
                <SelectItem key={d} value={d}>
                  {d === "All" ? "All Divs" : `Div ${d}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterSubject} onValueChange={setFilterSubject}>
            <SelectTrigger className="w-44 border-fhub-border bg-fhub-bg text-fhub-heading text-sm">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            placeholder="Search student..."
            value={searchStudent}
            onChange={(e) => setSearchStudent(e.target.value)}
            className="w-44 border-fhub-border bg-fhub-bg text-fhub-heading text-sm"
          />
          <Button
            onClick={handleExport}
            className="ml-auto bg-fhub-accent hover:bg-fhub-accent-dark text-white text-sm rounded-xl"
          >
            <Download className="w-4 h-4 mr-1.5" /> Export Report
          </Button>
        </div>
      </div>

      {/* Aggregate Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-fhub-card rounded-2xl border border-fhub-border shadow-fhub p-6">
          <h3 className="font-display font-semibold text-fhub-heading text-sm mb-1">
            Attendance Distribution
          </h3>
          <p className="text-xs text-fhub-muted mb-4">
            Class average:{" "}
            <span className="font-bold text-fhub-accent">{avgAttendance}%</span>
          </p>
          <AttendanceChart students={filtered} />
        </div>
        <div className="bg-white dark:bg-fhub-card rounded-2xl border border-fhub-border shadow-fhub p-6">
          <h3 className="font-display font-semibold text-fhub-heading text-sm mb-1">
            Performance Overview
          </h3>
          <p className="text-xs text-fhub-muted mb-3">
            Class average:{" "}
            <span className="font-bold text-fhub-accent">
              {avgPerformance}%
            </span>
          </p>
          <div className="space-y-2">
            {[
              { label: "Avg Attendance", value: avgAttendance },
              { label: "Avg Performance", value: avgPerformance },
              {
                label: "Avg Assignments",
                value: filtered.length
                  ? Math.round(
                      filtered.reduce((s, st) => s + st.assignments, 0) /
                        filtered.length,
                    )
                  : 0,
              },
              {
                label: "Avg Participation",
                value: filtered.length
                  ? Math.round(
                      filtered.reduce((s, st) => s + st.participation, 0) /
                        filtered.length,
                    )
                  : 0,
              },
            ].map((m) => (
              <div key={m.label} className="flex items-center gap-3">
                <span className="text-xs text-fhub-muted w-32">{m.label}</span>
                <Progress
                  value={m.value}
                  className="flex-1 h-2 bg-fhub-bg [&>div]:bg-fhub-accent"
                />
                <span className="text-xs font-bold text-fhub-accent w-8 text-right">
                  {m.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((student) => (
          <div
            key={student.id}
            className="bg-white dark:bg-fhub-card rounded-2xl border border-fhub-border shadow-fhub p-5"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-fhub-badge-bg border border-fhub-accent/20 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-fhub-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-fhub-heading text-sm truncate">
                  {student.name}
                </p>
                <p className="text-xs text-fhub-muted">
                  {student.branch} · Div {student.division}
                </p>
                <p className="text-xs text-fhub-muted truncate">
                  {student.subject}
                </p>
              </div>
              <Badge
                className={`text-[10px] flex-shrink-0 ${
                  student.attendance >= 85
                    ? "bg-green-100 text-green-700 border-green-200"
                    : student.attendance >= 75
                      ? "bg-blue-100 text-blue-700 border-blue-200"
                      : "bg-red-100 text-red-700 border-red-200"
                }`}
              >
                {student.attendance}% att.
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { label: "Performance", value: student.performance },
                { label: "Assignments", value: student.assignments },
                { label: "Participation", value: student.participation },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between mb-0.5">
                    <span className="text-[10px] text-fhub-muted">
                      {m.label}
                    </span>
                    <span className="text-[10px] font-bold text-fhub-accent">
                      {m.value}%
                    </span>
                  </div>
                  <Progress
                    value={m.value}
                    className="h-1.5 bg-fhub-bg [&>div]:bg-fhub-accent"
                  />
                </div>
              ))}
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-yellow-500" />
                <span className="text-xs text-fhub-muted">
                  {student.achievements} awards
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Code2 className="w-3.5 h-3.5 text-fhub-muted" />
                <span className="text-xs text-fhub-muted">
                  {student.hackathons} hackathons
                </span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-fhub-accent" />
                <MiniSkillGraph data={student.skillGrowth} />
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-fhub-muted">
            No students match the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}
