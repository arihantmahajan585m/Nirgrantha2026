import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  AlertTriangle,
  BookOpen,
  CheckCircle,
  ChevronDown,
  UserX,
} from "lucide-react";
import { useState } from "react";

interface Faculty {
  id: number;
  name: string;
  dept: string;
  teachingScore: number;
  contributionIndex: number;
  researchCount: number;
  feedbackRating: number;
  classEngagement: number;
  subjectCompletion: number;
  isWeak: boolean;
  trainingRec: string;
}

const facultyData: Faculty[] = [
  {
    id: 1,
    name: "Dr. S.V. Kulkarni",
    dept: "CSE",
    teachingScore: 95,
    contributionIndex: 93,
    researchCount: 11,
    feedbackRating: 4.9,
    classEngagement: 97,
    subjectCompletion: 99,
    isWeak: false,
    trainingRec: "",
  },
  {
    id: 2,
    name: "Prof. M.K. Desai",
    dept: "CSE",
    teachingScore: 91,
    contributionIndex: 88,
    researchCount: 7,
    feedbackRating: 4.7,
    classEngagement: 93,
    subjectCompletion: 96,
    isWeak: false,
    trainingRec: "",
  },
  {
    id: 3,
    name: "Prof. S.R. Patil",
    dept: "CSE",
    teachingScore: 89,
    contributionIndex: 86,
    researchCount: 6,
    feedbackRating: 4.6,
    classEngagement: 91,
    subjectCompletion: 95,
    isWeak: false,
    trainingRec: "",
  },
  {
    id: 4,
    name: "Dr. A.V. Kulkarni",
    dept: "CSE",
    teachingScore: 87,
    contributionIndex: 84,
    researchCount: 5,
    feedbackRating: 4.5,
    classEngagement: 89,
    subjectCompletion: 93,
    isWeak: false,
    trainingRec: "",
  },
  {
    id: 5,
    name: "Prof. R.S. Jadhav",
    dept: "CSE",
    teachingScore: 85,
    contributionIndex: 81,
    researchCount: 4,
    feedbackRating: 4.4,
    classEngagement: 87,
    subjectCompletion: 92,
    isWeak: false,
    trainingRec: "",
  },
  {
    id: 6,
    name: "Dr. V.R. Patil",
    dept: "Mechanical",
    teachingScore: 88,
    contributionIndex: 85,
    researchCount: 7,
    feedbackRating: 4.6,
    classEngagement: 90,
    subjectCompletion: 94,
    isWeak: false,
    trainingRec: "",
  },
  {
    id: 7,
    name: "Prof. S.K. Jagtap",
    dept: "Mechanical",
    teachingScore: 76,
    contributionIndex: 68,
    researchCount: 2,
    feedbackRating: 4.0,
    classEngagement: 79,
    subjectCompletion: 85,
    isWeak: false,
    trainingRec: "",
  },
  {
    id: 8,
    name: "Prof. N.B. Shinde",
    dept: "CSE",
    teachingScore: 72,
    contributionIndex: 64,
    researchCount: 2,
    feedbackRating: 3.9,
    classEngagement: 75,
    subjectCompletion: 82,
    isWeak: true,
    trainingRec: "Pedagogical skills enhancement workshop",
  },
  {
    id: 9,
    name: "Prof. A.P. More",
    dept: "IT",
    teachingScore: 83,
    contributionIndex: 79,
    researchCount: 3,
    feedbackRating: 4.3,
    classEngagement: 85,
    subjectCompletion: 91,
    isWeak: false,
    trainingRec: "",
  },
  {
    id: 10,
    name: "Dr. R.B. Deshmukh",
    dept: "Civil",
    teachingScore: 65,
    contributionIndex: 58,
    researchCount: 1,
    feedbackRating: 3.6,
    classEngagement: 68,
    subjectCompletion: 76,
    isWeak: true,
    trainingRec: "Research writing & digital teaching tools workshop",
  },
];
const hodData = [
  {
    name: "Dr. Priya Sharma",
    dept: "CSE",
    deptScore: 82,
    facultyRetention: 95,
    studentSatisfaction: 4.6,
    initiatives: 8,
  },
  {
    name: "Prof. Rajesh Kumar",
    dept: "IT",
    deptScore: 79,
    facultyRetention: 92,
    studentSatisfaction: 4.4,
    initiatives: 6,
  },
  {
    name: "Dr. Anita Patel",
    dept: "ECE",
    deptScore: 74,
    facultyRetention: 88,
    studentSatisfaction: 4.2,
    initiatives: 5,
  },
  {
    name: "Prof. Suresh Nair",
    dept: "Mechanical",
    deptScore: 68,
    facultyRetention: 85,
    studentSatisfaction: 4.0,
    initiatives: 4,
  },
];

const departments = ["All", "CSE", "IT", "ECE", "Mechanical", "Civil", "EEE"];

function ScoreMeter({ value, max = 100 }: { value: number; max?: number }) {
  const pct = (value / max) * 100;
  const color =
    pct >= 80
      ? "oklch(0.52 0.16 160)"
      : pct >= 65
        ? "var(--iicc-blue)"
        : "oklch(0.60 0.22 25)";
  return (
    <div className="flex items-center gap-2">
      <div
        className="flex-1 h-1.5 rounded-full overflow-hidden"
        style={{ background: "var(--iicc-border)" }}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span
        className="text-xs font-bold w-8 text-right"
        style={{ color: "var(--iicc-heading)" }}
      >
        {value}
      </span>
    </div>
  );
}

export default function FacultyStaffOptimization() {
  const [selectedDept, setSelectedDept] = useState("All");
  const [_actionDialog, _setActionDialog] = useState<{
    type: string;
    faculty: string;
  } | null>(null);

  const filtered =
    selectedDept === "All"
      ? facultyData
      : facultyData.filter((f) => f.dept === selectedDept);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-10">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Faculty", value: "84", color: "var(--iicc-blue)" },
          {
            label: "High Performers",
            value: "52",
            color: "oklch(0.52 0.16 160)",
          },
          {
            label: "Needs Training",
            value: "19",
            color: "oklch(0.75 0.18 80)",
          },
          {
            label: "Critical Review",
            value: "13",
            color: "oklch(0.60 0.22 25)",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border p-4 text-center"
            style={{
              background: "var(--iicc-card)",
              borderColor: "var(--iicc-border)",
            }}
          >
            <div
              className="text-3xl font-bold font-display"
              style={{ color: s.color }}
            >
              {s.value}
            </div>
            <div
              className="text-sm mt-1"
              style={{ color: "var(--iicc-muted)" }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Faculty Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-display font-bold"
            style={{ color: "var(--iicc-heading)" }}
          >
            Faculty Performance Grid
          </h2>
          <div className="relative">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="appearance-none rounded-lg border px-4 py-2 pr-8 text-sm font-medium cursor-pointer"
              style={{
                background: "var(--iicc-card)",
                borderColor: "var(--iicc-border)",
                color: "var(--iicc-heading)",
              }}
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <ChevronDown
              className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
              style={{ color: "var(--iicc-muted)" }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((faculty) => (
            <div
              key={faculty.id}
              className="rounded-xl border p-5 transition-all duration-200"
              style={{
                background: "var(--iicc-card)",
                borderColor: faculty.isWeak
                  ? "oklch(0.60 0.22 25 / 0.5)"
                  : "var(--iicc-border)",
                boxShadow: faculty.isWeak
                  ? "0 0 0 1px oklch(0.60 0.22 25 / 0.2)"
                  : "none",
              }}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{
                        background: faculty.isWeak
                          ? "oklch(0.60 0.22 25)"
                          : "var(--iicc-blue)",
                      }}
                    >
                      {faculty.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <div
                        className="font-semibold text-sm"
                        style={{ color: "var(--iicc-heading)" }}
                      >
                        {faculty.name}
                      </div>
                      <div
                        className="text-xs"
                        style={{ color: "var(--iicc-muted)" }}
                      >
                        {faculty.dept}
                      </div>
                    </div>
                  </div>
                </div>
                {faculty.isWeak && (
                  <span
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{
                      background: "oklch(0.60 0.22 25 / 0.15)",
                      color: "oklch(0.50 0.22 25)",
                    }}
                  >
                    <AlertTriangle className="w-3 h-3" /> Weak
                  </span>
                )}
                {!faculty.isWeak && faculty.teachingScore >= 85 && (
                  <span
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{
                      background: "oklch(0.45 0.15 145 / 0.15)",
                      color: "oklch(0.40 0.15 145)",
                    }}
                  >
                    <CheckCircle className="w-3 h-3" /> Top
                  </span>
                )}
              </div>

              {/* Metrics */}
              <div className="space-y-2 mb-4">
                <div>
                  <div
                    className="flex justify-between text-xs mb-1"
                    style={{ color: "var(--iicc-muted)" }}
                  >
                    <span>Teaching Score</span>
                    <span>{faculty.teachingScore}/100</span>
                  </div>
                  <ScoreMeter value={faculty.teachingScore} />
                </div>
                <div>
                  <div
                    className="flex justify-between text-xs mb-1"
                    style={{ color: "var(--iicc-muted)" }}
                  >
                    <span>Contribution Index</span>
                    <span>{faculty.contributionIndex}/100</span>
                  </div>
                  <ScoreMeter value={faculty.contributionIndex} />
                </div>
                <div>
                  <div
                    className="flex justify-between text-xs mb-1"
                    style={{ color: "var(--iicc-muted)" }}
                  >
                    <span>Class Engagement</span>
                    <span>{faculty.classEngagement}%</span>
                  </div>
                  <ScoreMeter value={faculty.classEngagement} />
                </div>
                <div>
                  <div
                    className="flex justify-between text-xs mb-1"
                    style={{ color: "var(--iicc-muted)" }}
                  >
                    <span>Subject Completion</span>
                    <span>{faculty.subjectCompletion}%</span>
                  </div>
                  <ScoreMeter value={faculty.subjectCompletion} />
                </div>
              </div>

              {/* Stats Row */}
              <div
                className="flex items-center gap-3 mb-4 text-xs"
                style={{ color: "var(--iicc-muted)" }}
              >
                <span>📄 {faculty.researchCount} papers</span>
                <span>★ {faculty.feedbackRating} feedback</span>
              </div>

              {/* Training Recommendation */}
              {faculty.trainingRec && (
                <div
                  className="rounded-lg p-3 mb-4 text-xs"
                  style={{
                    background: "oklch(0.75 0.18 80 / 0.08)",
                    border: "1px solid oklch(0.75 0.18 80 / 0.3)",
                    color: "oklch(0.45 0.18 80)",
                  }}
                >
                  <div className="font-semibold mb-1 flex items-center gap-1">
                    <BookOpen className="w-3 h-3" /> Recommended Training:
                  </div>
                  {faculty.trainingRec}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      style={{
                        background: "oklch(0.45 0.15 145 / 0.15)",
                        color: "oklch(0.40 0.15 145)",
                      }}
                    >
                      ✓ Approve
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Approve Faculty</AlertDialogTitle>
                      <AlertDialogDescription>
                        Approve {faculty.name} for the current academic term?
                        This will mark their performance as satisfactory.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Confirm Approval</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                      style={{
                        background: "var(--iicc-blue-subtle)",
                        color: "var(--iicc-blue)",
                      }}
                    >
                      📚 Training
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Assign Training Program
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Assign a training program to {faculty.name}? They will
                        be notified and enrolled in the next available session.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Assign Training</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {faculty.isWeak && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        type="button"
                        className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        style={{
                          background: "oklch(0.60 0.22 25 / 0.15)",
                          color: "oklch(0.50 0.22 25)",
                        }}
                      >
                        <UserX className="w-3 h-3 inline mr-1" />
                        Replace
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Initiate Faculty Replacement
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Initiate the replacement process for {faculty.name}?
                          This will open a requisition for a new faculty member
                          in the {faculty.dept} department.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Initiate Replacement
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOD Leadership Performance */}
      <section>
        <h2
          className="text-lg font-display font-bold mb-4"
          style={{ color: "var(--iicc-heading)" }}
        >
          HOD Leadership Performance
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
                <th className="px-4 py-3 text-left font-semibold">HOD Name</th>
                <th className="px-4 py-3 text-left font-semibold">
                  Department
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  Dept Score
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  Faculty Retention
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  Student Satisfaction
                </th>
                <th className="px-4 py-3 text-left font-semibold">
                  Initiatives
                </th>
              </tr>
            </thead>
            <tbody>
              {hodData.map((hod, i) => (
                <tr
                  key={hod.name}
                  style={{
                    borderBottom: "1px solid var(--iicc-border)",
                    background: i % 2 === 0 ? "transparent" : "var(--iicc-bg)",
                  }}
                >
                  <td
                    className="px-4 py-3 font-medium"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    {hod.name}
                  </td>
                  <td
                    className="px-4 py-3"
                    style={{ color: "var(--iicc-muted)" }}
                  >
                    {hod.dept}
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
                            width: `${hod.deptScore}%`,
                            background: "var(--iicc-blue)",
                          }}
                        />
                      </div>
                      <span
                        className="font-bold text-xs"
                        style={{ color: "var(--iicc-heading)" }}
                      >
                        {hod.deptScore}
                      </span>
                    </div>
                  </td>
                  <td
                    className="px-4 py-3 font-semibold"
                    style={{ color: "oklch(0.52 0.16 160)" }}
                  >
                    {hod.facultyRetention}%
                  </td>
                  <td
                    className="px-4 py-3 font-semibold"
                    style={{ color: "var(--iicc-blue)" }}
                  >
                    ★ {hod.studentSatisfaction}
                  </td>
                  <td
                    className="px-4 py-3 font-semibold"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    {hod.initiatives} active
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
