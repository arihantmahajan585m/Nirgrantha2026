import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileText,
  GraduationCap,
  Info,
  Loader2,
  RefreshCw,
  Upload,
  Users,
  XCircle,
} from "lucide-react";
import { useCallback, useMemo, useRef, useState } from "react";
import type { Student, Teacher } from "../../../backend";
import {
  useBulkAddStudents,
  useBulkAddTeachers,
} from "../../../hooks/useBulkImport";
import {
  useListAllStudents,
  useListAllTeachers,
} from "../../../hooks/useQueries";
import { recordSecurityEvent } from "../../../utils/securityEvents";
import {
  type ParseResult,
  parseStudentFile,
  parseTeacherFile,
} from "../../../utils/csvParser";
import {
  downloadCSV,
  generateStudentTemplate,
  generateTeacherTemplate,
} from "../../../utils/csvTemplates";

type ImportTab = "students" | "teachers";
const LOCAL_STORAGE_KEYS = {
  students: "nirgrantha.mock.students",
  teachers: "nirgrantha.mock.teachers",
} as const;

interface ImportState<T> {
  parseResult: ParseResult<T> | null;
  fileName: string;
  isDragging: boolean;
}

function summarizeTopGroups(values: string[]) {
  const counts = new Map<string, number>();

  for (const value of values) {
    const normalized = value.trim();
    if (!normalized) continue;
    counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);
}

function FileDropZone({
  onFile,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  fileName,
}: {
  onFile: (file: File) => void;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  fileName: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer"
      style={{
        borderColor: isDragging ? "var(--iicc-blue)" : "var(--iicc-border)",
        background: isDragging ? "var(--iicc-blue-subtle)" : "var(--iicc-card)",
      }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFile(file);
          e.target.value = "";
        }}
      />
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: "var(--iicc-blue-subtle)" }}
        >
          <Upload className="w-6 h-6" style={{ color: "var(--iicc-blue)" }} />
        </div>
        {fileName ? (
          <div>
            <p
              className="font-semibold text-sm"
              style={{ color: "var(--iicc-heading)" }}
            >
              <FileText className="inline w-4 h-4 mr-1" />
              {fileName}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--iicc-muted)" }}>
              Click or drag to replace file
            </p>
          </div>
        ) : (
          <div>
            <p
              className="font-semibold text-sm"
              style={{ color: "var(--iicc-heading)" }}
            >
              Drop your CSV file here
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--iicc-muted)" }}>
              or click to browse — accepts .csv files
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function StudentPreviewTable({ result }: { result: ParseResult<Student> }) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: "var(--iicc-border)" }}
    >
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{
          background: "var(--iicc-bg)",
          borderBottom: "1px solid var(--iicc-border)",
        }}
      >
        <span
          className="text-sm font-semibold"
          style={{ color: "var(--iicc-heading)" }}
        >
          Preview — {result.totalRows} rows
        </span>
        <div className="flex items-center gap-2">
          <Badge
            className="text-xs"
            style={{
              background: "oklch(0.45 0.15 145 / 0.15)",
              color: "oklch(0.40 0.15 145)",
              border: "none",
            }}
          >
            ✓ {result.validRows} valid
          </Badge>
          {result.errorRows > 0 && (
            <Badge
              className="text-xs"
              style={{
                background: "oklch(0.60 0.22 25 / 0.15)",
                color: "oklch(0.50 0.22 25)",
                border: "none",
              }}
            >
              ✗ {result.errorRows} errors
            </Badge>
          )}
        </div>
      </div>
      <ScrollArea className="h-72">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ background: "var(--iicc-blue)", color: "white" }}>
              <th className="px-3 py-2 text-left font-semibold">Row</th>
              <th className="px-3 py-2 text-left font-semibold">Status</th>
              <th className="px-3 py-2 text-left font-semibold">Name</th>
              <th className="px-3 py-2 text-left font-semibold">Roll No.</th>
              <th className="px-3 py-2 text-left font-semibold">Branch</th>
              <th className="px-3 py-2 text-left font-semibold">Sem</th>
              <th className="px-3 py-2 text-left font-semibold">Email</th>
              <th className="px-3 py-2 text-left font-semibold">Phone</th>
              <th className="px-3 py-2 text-left font-semibold">Issues</th>
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row, i) => (
              <tr
                // biome-ignore lint/suspicious/noArrayIndexKey: static list
                key={i}
                style={{
                  borderBottom: "1px solid var(--iicc-border)",
                  background: row.isValid
                    ? i % 2 === 0
                      ? "var(--iicc-card)"
                      : "var(--iicc-bg)"
                    : "oklch(0.60 0.22 25 / 0.06)",
                }}
              >
                <td
                  className="px-3 py-2 font-mono"
                  style={{ color: "var(--iicc-muted)" }}
                >
                  {row.rowIndex}
                </td>
                <td className="px-3 py-2">
                  {row.isValid ? (
                    <CheckCircle2
                      className="w-4 h-4"
                      style={{ color: "oklch(0.52 0.16 160)" }}
                    />
                  ) : (
                    <XCircle
                      className="w-4 h-4"
                      style={{ color: "oklch(0.55 0.22 25)" }}
                    />
                  )}
                </td>
                <td
                  className="px-3 py-2 font-medium"
                  style={{ color: "var(--iicc-heading)" }}
                >
                  {row.data.name || "—"}
                </td>
                <td
                  className="px-3 py-2"
                  style={{ color: "var(--iicc-muted)" }}
                >
                  {row.data.rollNumber || "—"}
                </td>
                <td
                  className="px-3 py-2"
                  style={{ color: "var(--iicc-muted)" }}
                >
                  {row.data.branch || "—"}
                </td>
                <td
                  className="px-3 py-2"
                  style={{ color: "var(--iicc-muted)" }}
                >
                  {row.data.semester || "—"}
                </td>
                <td
                  className="px-3 py-2"
                  style={{ color: "var(--iicc-muted)" }}
                >
                  {row.data.email || "—"}
                </td>
                <td
                  className="px-3 py-2"
                  style={{ color: "var(--iicc-muted)" }}
                >
                  {row.data.phone || "—"}
                </td>
                <td className="px-3 py-2">
                  {row.errors.length > 0 && (
                    <span
                      className="text-xs"
                      style={{ color: "oklch(0.55 0.22 25)" }}
                    >
                      {row.errors.join("; ")}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  );
}

function TeacherPreviewTable({ result }: { result: ParseResult<Teacher> }) {
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: "var(--iicc-border)" }}
    >
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{
          background: "var(--iicc-bg)",
          borderBottom: "1px solid var(--iicc-border)",
        }}
      >
        <span
          className="text-sm font-semibold"
          style={{ color: "var(--iicc-heading)" }}
        >
          Preview — {result.totalRows} rows
        </span>
        <div className="flex items-center gap-2">
          <Badge
            className="text-xs"
            style={{
              background: "oklch(0.45 0.15 145 / 0.15)",
              color: "oklch(0.40 0.15 145)",
              border: "none",
            }}
          >
            ✓ {result.validRows} valid
          </Badge>
          {result.errorRows > 0 && (
            <Badge
              className="text-xs"
              style={{
                background: "oklch(0.60 0.22 25 / 0.15)",
                color: "oklch(0.50 0.22 25)",
                border: "none",
              }}
            >
              ✗ {result.errorRows} errors
            </Badge>
          )}
        </div>
      </div>
      <ScrollArea className="h-72">
        <table className="w-full text-xs">
          <thead>
            <tr style={{ background: "var(--iicc-blue)", color: "white" }}>
              <th className="px-3 py-2 text-left font-semibold">Row</th>
              <th className="px-3 py-2 text-left font-semibold">Status</th>
              <th className="px-3 py-2 text-left font-semibold">Name</th>
              <th className="px-3 py-2 text-left font-semibold">Department</th>
              <th className="px-3 py-2 text-left font-semibold">Subject</th>
              <th className="px-3 py-2 text-left font-semibold">Email</th>
              <th className="px-3 py-2 text-left font-semibold">Employee ID</th>
              <th className="px-3 py-2 text-left font-semibold">Issues</th>
            </tr>
          </thead>
          <tbody>
            {result.rows.map((row, i) => (
              <tr
                // biome-ignore lint/suspicious/noArrayIndexKey: static list
                key={i}
                style={{
                  borderBottom: "1px solid var(--iicc-border)",
                  background: row.isValid
                    ? i % 2 === 0
                      ? "var(--iicc-card)"
                      : "var(--iicc-bg)"
                    : "oklch(0.60 0.22 25 / 0.06)",
                }}
              >
                <td
                  className="px-3 py-2 font-mono"
                  style={{ color: "var(--iicc-muted)" }}
                >
                  {row.rowIndex}
                </td>
                <td className="px-3 py-2">
                  {row.isValid ? (
                    <CheckCircle2
                      className="w-4 h-4"
                      style={{ color: "oklch(0.52 0.16 160)" }}
                    />
                  ) : (
                    <XCircle
                      className="w-4 h-4"
                      style={{ color: "oklch(0.55 0.22 25)" }}
                    />
                  )}
                </td>
                <td
                  className="px-3 py-2 font-medium"
                  style={{ color: "var(--iicc-heading)" }}
                >
                  {row.data.name || "—"}
                </td>
                <td
                  className="px-3 py-2"
                  style={{ color: "var(--iicc-muted)" }}
                >
                  {row.data.department || "—"}
                </td>
                <td
                  className="px-3 py-2"
                  style={{ color: "var(--iicc-muted)" }}
                >
                  {row.data.subject || "—"}
                </td>
                <td
                  className="px-3 py-2"
                  style={{ color: "var(--iicc-muted)" }}
                >
                  {row.data.email || "—"}
                </td>
                <td
                  className="px-3 py-2"
                  style={{ color: "var(--iicc-muted)" }}
                >
                  {row.data.employeeId || "—"}
                </td>
                <td className="px-3 py-2">
                  {row.errors.length > 0 && (
                    <span
                      className="text-xs"
                      style={{ color: "oklch(0.55 0.22 25)" }}
                    >
                      {row.errors.join("; ")}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  );
}

function LiveDataCard({
  label,
  value,
  caption,
}: {
  label: string;
  value: string | number;
  caption: string;
}) {
  return (
    <div
      className="rounded-xl border p-4"
      style={{
        background: "var(--iicc-card)",
        borderColor: "var(--iicc-border)",
      }}
    >
      <p className="text-xs font-semibold" style={{ color: "var(--iicc-muted)" }}>
        {label}
      </p>
      <p
        className="text-2xl font-display font-bold mt-1"
        style={{ color: "var(--iicc-heading)" }}
      >
        {value}
      </p>
      <p className="text-xs mt-1" style={{ color: "var(--iicc-muted)" }}>
        {caption}
      </p>
    </div>
  );
}

function StudentRosterSnapshot({ students }: { students: Student[] }) {
  const recentStudents = [...students].reverse().slice(0, 6);
  const branches = summarizeTopGroups(students.map((student) => student.branch));
  const semesters = summarizeTopGroups(
    students.map((student) => student.semester),
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LiveDataCard
          label="Saved Students"
          value={students.length}
          caption="Live student records available to the institute."
        />
        <LiveDataCard
          label="Active Branches"
          value={new Set(students.map((student) => student.branch.trim()).filter(Boolean)).size}
          caption={
            branches.length > 0
              ? `Top branches: ${branches.map(([name, count]) => `${name} (${count})`).join(", ")}`
              : "No branches imported yet."
          }
        />
        <LiveDataCard
          label="Semester Coverage"
          value={new Set(students.map((student) => student.semester.trim()).filter(Boolean)).size}
          caption={
            semesters.length > 0
              ? `Top semesters: ${semesters.map(([name, count]) => `${name} (${count})`).join(", ")}`
              : "No semesters imported yet."
          }
        />
      </div>

      <div
        className="rounded-xl border overflow-hidden"
        style={{
          background: "var(--iicc-card)",
          borderColor: "var(--iicc-border)",
        }}
      >
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{
            background: "var(--iicc-bg)",
            borderBottom: "1px solid var(--iicc-border)",
          }}
        >
          <div>
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--iicc-heading)" }}
            >
              Live Student Roster
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--iicc-muted)" }}>
              The newest saved students appear first after each bulk import.
            </p>
          </div>
          <Badge
            className="text-xs"
            style={{
              background: "var(--iicc-blue-subtle)",
              color: "var(--iicc-blue)",
              border: "none",
            }}
          >
            {students.length} total
          </Badge>
        </div>
        <ScrollArea className="h-64">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: "var(--iicc-blue)", color: "white" }}>
                <th className="px-3 py-2 text-left font-semibold">Name</th>
                <th className="px-3 py-2 text-left font-semibold">Roll No.</th>
                <th className="px-3 py-2 text-left font-semibold">Branch</th>
                <th className="px-3 py-2 text-left font-semibold">Semester</th>
                <th className="px-3 py-2 text-left font-semibold">Email</th>
              </tr>
            </thead>
            <tbody>
              {recentStudents.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-6 text-center"
                    style={{ color: "var(--iicc-muted)" }}
                  >
                    Import a student CSV to start building the live roster.
                  </td>
                </tr>
              ) : (
                recentStudents.map((student, index) => (
                  <tr
                    key={`${student.rollNumber}-${student.email}`}
                    style={{
                      borderBottom: "1px solid var(--iicc-border)",
                      background:
                        index % 2 === 0 ? "var(--iicc-card)" : "var(--iicc-bg)",
                    }}
                  >
                    <td
                      className="px-3 py-2 font-medium"
                      style={{ color: "var(--iicc-heading)" }}
                    >
                      {student.name}
                    </td>
                    <td className="px-3 py-2" style={{ color: "var(--iicc-muted)" }}>
                      {student.rollNumber}
                    </td>
                    <td className="px-3 py-2" style={{ color: "var(--iicc-muted)" }}>
                      {student.branch}
                    </td>
                    <td className="px-3 py-2" style={{ color: "var(--iicc-muted)" }}>
                      {student.semester}
                    </td>
                    <td className="px-3 py-2" style={{ color: "var(--iicc-muted)" }}>
                      {student.email}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </ScrollArea>
      </div>
    </div>
  );
}

function TeacherRosterSnapshot({ teachers }: { teachers: Teacher[] }) {
  const recentTeachers = [...teachers].reverse().slice(0, 6);
  const departments = summarizeTopGroups(
    teachers.map((teacher) => teacher.department),
  );
  const subjects = summarizeTopGroups(teachers.map((teacher) => teacher.subject));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LiveDataCard
          label="Saved Teachers"
          value={teachers.length}
          caption="Live faculty records available to the institute."
        />
        <LiveDataCard
          label="Departments"
          value={
            new Set(
              teachers
                .map((teacher) => teacher.department.trim())
                .filter(Boolean),
            ).size
          }
          caption={
            departments.length > 0
              ? `Top departments: ${departments.map(([name, count]) => `${name} (${count})`).join(", ")}`
              : "No departments imported yet."
          }
        />
        <LiveDataCard
          label="Subject Coverage"
          value={
            new Set(
              teachers.map((teacher) => teacher.subject.trim()).filter(Boolean),
            ).size
          }
          caption={
            subjects.length > 0
              ? `Top subjects: ${subjects.map(([name, count]) => `${name} (${count})`).join(", ")}`
              : "No subjects imported yet."
          }
        />
      </div>

      <div
        className="rounded-xl border overflow-hidden"
        style={{
          background: "var(--iicc-card)",
          borderColor: "var(--iicc-border)",
        }}
      >
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{
            background: "var(--iicc-bg)",
            borderBottom: "1px solid var(--iicc-border)",
          }}
        >
          <div>
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--iicc-heading)" }}
            >
              Live Teacher Directory
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--iicc-muted)" }}>
              Newly imported or updated teachers appear at the top.
            </p>
          </div>
          <Badge
            className="text-xs"
            style={{
              background: "var(--iicc-blue-subtle)",
              color: "var(--iicc-blue)",
              border: "none",
            }}
          >
            {teachers.length} total
          </Badge>
        </div>
        <ScrollArea className="h-64">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: "var(--iicc-blue)", color: "white" }}>
                <th className="px-3 py-2 text-left font-semibold">Name</th>
                <th className="px-3 py-2 text-left font-semibold">Department</th>
                <th className="px-3 py-2 text-left font-semibold">Subject</th>
                <th className="px-3 py-2 text-left font-semibold">Employee ID</th>
                <th className="px-3 py-2 text-left font-semibold">Email</th>
              </tr>
            </thead>
            <tbody>
              {recentTeachers.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-6 text-center"
                    style={{ color: "var(--iicc-muted)" }}
                  >
                    Import a teacher CSV to populate the live faculty directory.
                  </td>
                </tr>
              ) : (
                recentTeachers.map((teacher, index) => (
                  <tr
                    key={`${teacher.employeeId}-${teacher.email}`}
                    style={{
                      borderBottom: "1px solid var(--iicc-border)",
                      background:
                        index % 2 === 0 ? "var(--iicc-card)" : "var(--iicc-bg)",
                    }}
                  >
                    <td
                      className="px-3 py-2 font-medium"
                      style={{ color: "var(--iicc-heading)" }}
                    >
                      {teacher.name}
                    </td>
                    <td className="px-3 py-2" style={{ color: "var(--iicc-muted)" }}>
                      {teacher.department}
                    </td>
                    <td className="px-3 py-2" style={{ color: "var(--iicc-muted)" }}>
                      {teacher.subject}
                    </td>
                    <td className="px-3 py-2" style={{ color: "var(--iicc-muted)" }}>
                      {teacher.employeeId}
                    </td>
                    <td className="px-3 py-2" style={{ color: "var(--iicc-muted)" }}>
                      {teacher.email}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </ScrollArea>
      </div>
    </div>
  );
}

export default function BulkImportPanel() {
  const [activeTab, setActiveTab] = useState<ImportTab>("students");

  // Student import state
  const [studentState, setStudentState] = useState<ImportState<Student>>({
    parseResult: null,
    fileName: "",
    isDragging: false,
  });
  const [studentSuccess, setStudentSuccess] = useState<number | null>(null);
  const [studentError, setStudentError] = useState<string | null>(null);
  const [studentParsing, setStudentParsing] = useState(false);

  // Teacher import state
  const [teacherState, setTeacherState] = useState<ImportState<Teacher>>({
    parseResult: null,
    fileName: "",
    isDragging: false,
  });
  const [teacherSuccess, setTeacherSuccess] = useState<number | null>(null);
  const [teacherError, setTeacherError] = useState<string | null>(null);
  const [teacherParsing, setTeacherParsing] = useState(false);

  const bulkAddStudents = useBulkAddStudents();
  const bulkAddTeachers = useBulkAddTeachers();
  const studentsQuery = useListAllStudents();
  const teachersQuery = useListAllTeachers();
  const savedStudents = studentsQuery.data ?? [];
  const savedTeachers = teachersQuery.data ?? [];

  const existingStudentRolls = useMemo(
    () =>
      new Set(
        savedStudents.map((student) => student.rollNumber.trim().toLowerCase()),
      ),
    [savedStudents],
  );
  const existingTeacherIds = useMemo(
    () =>
      new Set(
        savedTeachers.map((teacher) => teacher.employeeId.trim().toLowerCase()),
      ),
    [savedTeachers],
  );

  const studentImportImpact = useMemo(() => {
    if (!studentState.parseResult) return null;

    let creates = 0;
    let updates = 0;

    for (const row of studentState.parseResult.rows) {
      if (!row.isValid) continue;

      if (existingStudentRolls.has(row.data.rollNumber.trim().toLowerCase())) {
        updates += 1;
      } else {
        creates += 1;
      }
    }

    return { creates, updates };
  }, [existingStudentRolls, studentState.parseResult]);

  const teacherImportImpact = useMemo(() => {
    if (!teacherState.parseResult) return null;

    let creates = 0;
    let updates = 0;

    for (const row of teacherState.parseResult.rows) {
      if (!row.isValid) continue;

      if (existingTeacherIds.has(row.data.employeeId.trim().toLowerCase())) {
        updates += 1;
      } else {
        creates += 1;
      }
    }

    return { creates, updates };
  }, [existingTeacherIds, teacherState.parseResult]);

  const resetStudentImport = useCallback(() => {
    setStudentState({ parseResult: null, fileName: "", isDragging: false });
    setStudentSuccess(null);
    setStudentError(null);
  }, []);

  const resetTeacherImport = useCallback(() => {
    setTeacherState({ parseResult: null, fileName: "", isDragging: false });
    setTeacherSuccess(null);
    setTeacherError(null);
  }, []);

  const refreshStudentData = useCallback(async () => {
    resetStudentImport();
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(LOCAL_STORAGE_KEYS.students);
    }
    recordSecurityEvent({
      action: "Student import data cleared",
      details:
        "Bulk Data Import student records were cleared to prepare for a fresh upload.",
      severity: "SAFE",
      source: "bulk-import",
    });
    await studentsQuery.refetch();
  }, [resetStudentImport, studentsQuery]);

  const refreshTeacherData = useCallback(async () => {
    resetTeacherImport();
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(LOCAL_STORAGE_KEYS.teachers);
    }
    recordSecurityEvent({
      action: "Teacher import data cleared",
      details:
        "Bulk Data Import teacher records were cleared to prepare for a fresh upload.",
      severity: "SAFE",
      source: "bulk-import",
    });
    await teachersQuery.refetch();
  }, [resetTeacherImport, teachersQuery]);

  // Student file handlers
  const handleStudentFile = useCallback(async (file: File) => {
    setStudentSuccess(null);
    setStudentError(null);
    setStudentParsing(true);
    try {
      const result = await parseStudentFile(file);
      setStudentState((prev) => ({
        ...prev,
        parseResult: result,
        fileName: file.name,
      }));
    } catch {
      setStudentError("Failed to parse file. Please ensure it is a valid CSV.");
    } finally {
      setStudentParsing(false);
    }
  }, []);

  const handleStudentDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setStudentState((prev) => ({ ...prev, isDragging: true }));
  }, []);

  const handleStudentDragLeave = useCallback(() => {
    setStudentState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  const handleStudentDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setStudentState((prev) => ({ ...prev, isDragging: false }));
      const file = e.dataTransfer.files?.[0];
      if (file) handleStudentFile(file);
    },
    [handleStudentFile],
  );

  const handleStudentImport = async () => {
    if (!studentState.parseResult) return;
    const parseResult = studentState.parseResult;
    const validStudents = studentState.parseResult.rows
      .filter((r) => r.isValid)
      .map((r) => r.data);
    setStudentError(null);
    try {
      const count = await bulkAddStudents.mutateAsync(validStudents);
      setStudentSuccess(count);
      setStudentState({ parseResult: null, fileName: "", isDragging: false });
      recordSecurityEvent({
        action: "Student import completed",
        details:
          parseResult.errorRows > 0
            ? `${count} student records saved from ${studentState.fileName}; ${parseResult.errorRows} invalid row(s) were skipped.`
            : `${count} student records saved from ${studentState.fileName}.`,
        severity: parseResult.errorRows > 0 ? "REVIEW" : "SAFE",
        source: "bulk-import",
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Import failed. Please try again.";
      setStudentError(msg);
    }
  };

  // Teacher file handlers
  const handleTeacherFile = useCallback(async (file: File) => {
    setTeacherSuccess(null);
    setTeacherError(null);
    setTeacherParsing(true);
    try {
      const result = await parseTeacherFile(file);
      setTeacherState((prev) => ({
        ...prev,
        parseResult: result,
        fileName: file.name,
      }));
    } catch {
      setTeacherError("Failed to parse file. Please ensure it is a valid CSV.");
    } finally {
      setTeacherParsing(false);
    }
  }, []);

  const handleTeacherDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setTeacherState((prev) => ({ ...prev, isDragging: true }));
  }, []);

  const handleTeacherDragLeave = useCallback(() => {
    setTeacherState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  const handleTeacherDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setTeacherState((prev) => ({ ...prev, isDragging: false }));
      const file = e.dataTransfer.files?.[0];
      if (file) handleTeacherFile(file);
    },
    [handleTeacherFile],
  );

  const handleTeacherImport = async () => {
    if (!teacherState.parseResult) return;
    const parseResult = teacherState.parseResult;
    const validTeachers = teacherState.parseResult.rows
      .filter((r) => r.isValid)
      .map((r) => r.data);
    setTeacherError(null);
    try {
      const count = await bulkAddTeachers.mutateAsync(validTeachers);
      setTeacherSuccess(count);
      setTeacherState({ parseResult: null, fileName: "", isDragging: false });
      recordSecurityEvent({
        action: "Teacher import completed",
        details:
          parseResult.errorRows > 0
            ? `${count} teacher records saved from ${teacherState.fileName}; ${parseResult.errorRows} invalid row(s) were skipped.`
            : `${count} teacher records saved from ${teacherState.fileName}.`,
        severity: parseResult.errorRows > 0 ? "REVIEW" : "SAFE",
        source: "bulk-import",
      });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Import failed. Please try again.";
      setTeacherError(msg);
    }
  };

  const tabs: {
    id: ImportTab;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: "students", label: "Student Import", icon: GraduationCap },
    { id: "teachers", label: "Teacher Import", icon: Users },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2
            className="text-lg font-display font-bold"
            style={{ color: "var(--iicc-heading)" }}
          >
            Bulk Data Import
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--iicc-muted)" }}>
            Upload CSV files to import student and teacher records in bulk.
            Download templates to get started.
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium"
          style={{
            background: "var(--iicc-blue-subtle)",
            color: "var(--iicc-blue)",
          }}
        >
          <Info className="w-3.5 h-3.5" />
          Only valid rows are imported
        </div>
      </div>

      {/* Tab Switcher */}
      <div
        className="flex rounded-xl p-1 gap-1 w-fit"
        style={{
          background: "var(--iicc-bg)",
          border: "1px solid var(--iicc-border)",
        }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              type="button"
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer"
              style={{
                background: isActive ? "var(--iicc-blue)" : "transparent",
                color: isActive ? "white" : "var(--iicc-muted)",
              }}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Student Import Tab */}
      {activeTab === "students" && (
        <div className="space-y-5">
          {/* Template Download */}
          <div
            className="flex items-center justify-between rounded-xl p-4 border"
            style={{
              background: "var(--iicc-card)",
              borderColor: "var(--iicc-border)",
            }}
          >
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--iicc-heading)" }}
              >
                Student CSV Template
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--iicc-muted)" }}
              >
                Required columns: name, rollNumber, branch, semester, email,
                phone
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              style={{
                borderColor: "var(--iicc-blue)",
                color: "var(--iicc-blue)",
              }}
              onClick={() =>
                downloadCSV(
                  generateStudentTemplate(),
                  "student_import_template.csv",
                )
              }
            >
              <Download className="w-4 h-4" />
              Download Template
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={refreshStudentData}
              disabled={studentsQuery.isFetching}
            >
              {studentsQuery.isFetching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={resetStudentImport}
            >
              <Upload className="w-4 h-4" />
              Add New Student File
            </Button>
          </div>

          <StudentRosterSnapshot students={savedStudents} />

          {/* Success / Error Alerts */}
          {studentSuccess !== null && (
            <Alert
              style={{
                background: "oklch(0.45 0.15 145 / 0.1)",
                borderColor: "oklch(0.45 0.15 145 / 0.3)",
              }}
            >
              <CheckCircle2
                className="w-4 h-4"
                style={{ color: "oklch(0.45 0.15 145)" }}
              />
              <AlertDescription style={{ color: "oklch(0.35 0.15 145)" }}>
                <strong>Import successful!</strong> {studentSuccess} student
                record{studentSuccess !== 1 ? "s" : ""} have been saved to the
                system.
              </AlertDescription>
            </Alert>
          )}
          {studentError && (
            <Alert variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>{studentError}</AlertDescription>
            </Alert>
          )}

          {/* File Drop Zone */}
          {studentParsing ? (
            <div
              className="rounded-xl border-2 border-dashed p-8 flex items-center justify-center gap-3"
              style={{
                borderColor: "var(--iicc-border)",
                background: "var(--iicc-card)",
              }}
            >
              <Loader2
                className="w-5 h-5 animate-spin"
                style={{ color: "var(--iicc-blue)" }}
              />
              <span className="text-sm" style={{ color: "var(--iicc-muted)" }}>
                Parsing file…
              </span>
            </div>
          ) : (
            <FileDropZone
              onFile={handleStudentFile}
              isDragging={studentState.isDragging}
              onDragOver={handleStudentDragOver}
              onDragLeave={handleStudentDragLeave}
              onDrop={handleStudentDrop}
              fileName={studentState.fileName}
            />
          )}

          {/* Preview Table */}
          {studentState.parseResult && (
            <div className="space-y-4">
              <StudentPreviewTable result={studentState.parseResult} />

              {studentImportImpact && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Alert
                    style={{
                      background: "var(--iicc-card)",
                      borderColor: "var(--iicc-border)",
                    }}
                  >
                    <CheckCircle2
                      className="w-4 h-4"
                      style={{ color: "oklch(0.52 0.16 160)" }}
                    />
                    <AlertDescription
                      style={{ color: "var(--iicc-heading)" }}
                    >
                      <strong>{studentImportImpact.creates}</strong> new student
                      record{studentImportImpact.creates === 1 ? "" : "s"} will
                      be created.
                    </AlertDescription>
                  </Alert>
                  <Alert
                    style={{
                      background: "var(--iicc-card)",
                      borderColor: "var(--iicc-border)",
                    }}
                  >
                    <RefreshCw
                      className="w-4 h-4"
                      style={{ color: "var(--iicc-blue)" }}
                    />
                    <AlertDescription
                      style={{ color: "var(--iicc-heading)" }}
                    >
                      <strong>{studentImportImpact.updates}</strong> existing
                      student record
                      {studentImportImpact.updates === 1 ? "" : "s"} will be
                      updated using roll numbers already in the live roster.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {studentState.parseResult.totalRows === 0 ? (
                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription>
                    No data rows found in the file. Please check the file
                    format.
                  </AlertDescription>
                </Alert>
              ) : studentState.parseResult.validRows === 0 ? (
                <Alert variant="destructive">
                  <XCircle className="w-4 h-4" />
                  <AlertDescription>
                    All rows have validation errors. Please fix the issues and
                    re-upload.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-sm" style={{ color: "var(--iicc-muted)" }}>
                    {studentState.parseResult.errorRows > 0
                      ? `${studentState.parseResult.errorRows} row(s) with errors will be skipped.`
                      : "All rows are valid and ready to import."}
                  </p>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={resetStudentImport}
                    >
                      <RefreshCw className="w-4 h-4" />
                      Clear
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          className="gap-2"
                          style={{
                            background: "var(--iicc-blue)",
                            color: "white",
                          }}
                          disabled={bulkAddStudents.isPending}
                        >
                          {bulkAddStudents.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          Import {studentState.parseResult.validRows} Student
                          {studentState.parseResult.validRows !== 1 ? "s" : ""}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Confirm Student Import
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            You are about to import{" "}
                            <strong>
                              {studentState.parseResult.validRows}
                            </strong>{" "}
                            student record(s) into the system.
                            {studentImportImpact && (
                              <>
                                {" "}
                                <strong>{studentImportImpact.creates}</strong>{" "}
                                will be created and{" "}
                                <strong>{studentImportImpact.updates}</strong>{" "}
                                will update existing records.
                              </>
                            )}
                            {studentState.parseResult.errorRows > 0 && (
                              <>
                                {" "}
                                <strong>
                                  {studentState.parseResult.errorRows}
                                </strong>{" "}
                                row(s) with errors will be skipped.
                              </>
                            )}{" "}
                            Existing records with the same Roll Number will be
                            overwritten. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleStudentImport}
                            style={{
                              background: "var(--iicc-blue)",
                              color: "white",
                            }}
                          >
                            Confirm Import
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Teacher Import Tab */}
      {activeTab === "teachers" && (
        <div className="space-y-5">
          {/* Template Download */}
          <div
            className="flex items-center justify-between rounded-xl p-4 border"
            style={{
              background: "var(--iicc-card)",
              borderColor: "var(--iicc-border)",
            }}
          >
            <div>
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--iicc-heading)" }}
              >
                Teacher CSV Template
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--iicc-muted)" }}
              >
                Required columns: name, department, subject, email, employeeId
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              style={{
                borderColor: "var(--iicc-blue)",
                color: "var(--iicc-blue)",
              }}
              onClick={() =>
                downloadCSV(
                  generateTeacherTemplate(),
                  "teacher_import_template.csv",
                )
              }
            >
              <Download className="w-4 h-4" />
              Download Template
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={refreshTeacherData}
              disabled={teachersQuery.isFetching}
            >
              {teachersQuery.isFetching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={resetTeacherImport}
            >
              <Upload className="w-4 h-4" />
              Add New Teacher File
            </Button>
          </div>

          <TeacherRosterSnapshot teachers={savedTeachers} />

          {/* Success / Error Alerts */}
          {teacherSuccess !== null && (
            <Alert
              style={{
                background: "oklch(0.45 0.15 145 / 0.1)",
                borderColor: "oklch(0.45 0.15 145 / 0.3)",
              }}
            >
              <CheckCircle2
                className="w-4 h-4"
                style={{ color: "oklch(0.45 0.15 145)" }}
              />
              <AlertDescription style={{ color: "oklch(0.35 0.15 145)" }}>
                <strong>Import successful!</strong> {teacherSuccess} teacher
                record{teacherSuccess !== 1 ? "s" : ""} have been saved to the
                system.
              </AlertDescription>
            </Alert>
          )}
          {teacherError && (
            <Alert variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>{teacherError}</AlertDescription>
            </Alert>
          )}

          {/* File Drop Zone */}
          {teacherParsing ? (
            <div
              className="rounded-xl border-2 border-dashed p-8 flex items-center justify-center gap-3"
              style={{
                borderColor: "var(--iicc-border)",
                background: "var(--iicc-card)",
              }}
            >
              <Loader2
                className="w-5 h-5 animate-spin"
                style={{ color: "var(--iicc-blue)" }}
              />
              <span className="text-sm" style={{ color: "var(--iicc-muted)" }}>
                Parsing file…
              </span>
            </div>
          ) : (
            <FileDropZone
              onFile={handleTeacherFile}
              isDragging={teacherState.isDragging}
              onDragOver={handleTeacherDragOver}
              onDragLeave={handleTeacherDragLeave}
              onDrop={handleTeacherDrop}
              fileName={teacherState.fileName}
            />
          )}

          {/* Preview Table */}
          {teacherState.parseResult && (
            <div className="space-y-4">
              <TeacherPreviewTable result={teacherState.parseResult} />

              {teacherImportImpact && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Alert
                    style={{
                      background: "var(--iicc-card)",
                      borderColor: "var(--iicc-border)",
                    }}
                  >
                    <CheckCircle2
                      className="w-4 h-4"
                      style={{ color: "oklch(0.52 0.16 160)" }}
                    />
                    <AlertDescription
                      style={{ color: "var(--iicc-heading)" }}
                    >
                      <strong>{teacherImportImpact.creates}</strong> new teacher
                      record{teacherImportImpact.creates === 1 ? "" : "s"} will
                      be created.
                    </AlertDescription>
                  </Alert>
                  <Alert
                    style={{
                      background: "var(--iicc-card)",
                      borderColor: "var(--iicc-border)",
                    }}
                  >
                    <RefreshCw
                      className="w-4 h-4"
                      style={{ color: "var(--iicc-blue)" }}
                    />
                    <AlertDescription
                      style={{ color: "var(--iicc-heading)" }}
                    >
                      <strong>{teacherImportImpact.updates}</strong> existing
                      teacher record
                      {teacherImportImpact.updates === 1 ? "" : "s"} will be
                      updated using employee IDs already in the live directory.
                    </AlertDescription>
                  </Alert>
                </div>
              )}

              {teacherState.parseResult.totalRows === 0 ? (
                <Alert>
                  <Info className="w-4 h-4" />
                  <AlertDescription>
                    No data rows found in the file. Please check the file
                    format.
                  </AlertDescription>
                </Alert>
              ) : teacherState.parseResult.validRows === 0 ? (
                <Alert variant="destructive">
                  <XCircle className="w-4 h-4" />
                  <AlertDescription>
                    All rows have validation errors. Please fix the issues and
                    re-upload.
                  </AlertDescription>
                </Alert>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-sm" style={{ color: "var(--iicc-muted)" }}>
                    {teacherState.parseResult.errorRows > 0
                      ? `${teacherState.parseResult.errorRows} row(s) with errors will be skipped.`
                      : "All rows are valid and ready to import."}
                  </p>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={resetTeacherImport}
                    >
                      <RefreshCw className="w-4 h-4" />
                      Clear
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="sm"
                          className="gap-2"
                          style={{
                            background: "var(--iicc-blue)",
                            color: "white",
                          }}
                          disabled={bulkAddTeachers.isPending}
                        >
                          {bulkAddTeachers.isPending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          Import {teacherState.parseResult.validRows} Teacher
                          {teacherState.parseResult.validRows !== 1 ? "s" : ""}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Confirm Teacher Import
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            You are about to import{" "}
                            <strong>
                              {teacherState.parseResult.validRows}
                            </strong>{" "}
                            teacher record(s) into the system.
                            {teacherImportImpact && (
                              <>
                                {" "}
                                <strong>{teacherImportImpact.creates}</strong>{" "}
                                will be created and{" "}
                                <strong>{teacherImportImpact.updates}</strong>{" "}
                                will update existing records.
                              </>
                            )}
                            {teacherState.parseResult.errorRows > 0 && (
                              <>
                                {" "}
                                <strong>
                                  {teacherState.parseResult.errorRows}
                                </strong>{" "}
                                row(s) with errors will be skipped.
                              </>
                            )}{" "}
                            Existing records with the same Employee ID will be
                            overwritten. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleTeacherImport}
                            style={{
                              background: "var(--iicc-blue)",
                              color: "white",
                            }}
                          >
                            Confirm Import
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
