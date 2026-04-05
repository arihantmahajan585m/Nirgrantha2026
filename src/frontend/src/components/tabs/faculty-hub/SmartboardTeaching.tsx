import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Bot,
  ChevronLeft,
  ChevronRight,
  Circle,
  Clock,
  Download,
  Eraser,
  FileText,
  HelpCircle,
  Layers,
  MessageSquare,
  Mic,
  MicOff,
  Monitor,
  Pen,
  Play,
  Radio,
  Save,
  Shapes,
  Sparkles,
  Square,
  Upload,
  Users,
  Video,
  Wifi,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const branches = ["CSE", "IT", "ECE", "Mechanical", "Civil", "EEE"];
const divisions = ["A", "B", "C", "D"];
const subjectsByBranch: Record<string, string[]> = {
  CSE: [
    "Data Structures",
    "Algorithms",
    "DBMS",
    "Operating Systems",
    "Computer Networks",
  ],
  IT: [
    "Web Technologies",
    "Cloud Computing",
    "Cybersecurity",
    "Mobile App Dev",
  ],
  ECE: [
    "Digital Electronics",
    "Signals & Systems",
    "VLSI Design",
    "Embedded Systems",
  ],
  Mechanical: [
    "Thermodynamics",
    "Fluid Mechanics",
    "Machine Design",
    "CAD/CAM",
  ],
  Civil: [
    "Structural Analysis",
    "Geotechnical Engineering",
    "Surveying",
    "Hydraulics",
  ],
  EEE: [
    "Power Systems",
    "Control Systems",
    "Electric Machines",
    "Power Electronics",
  ],
};

const mockStudents = [
  { name: "Aryan Sharma", status: "Active", attention: 92 },
  { name: "Priya Patel", status: "Raised Hand", attention: 88 },
  { name: "Rohit Kumar", status: "Active", attention: 76 },
  { name: "Sneha Joshi", status: "Active", attention: 95 },
  { name: "Ankit Mehta", status: "Idle", attention: 34 },
  { name: "Divya Nair", status: "Active", attention: 81 },
  { name: "Vikram Singh", status: "Raised Hand", attention: 90 },
  { name: "Meena Reddy", status: "Active", attention: 67 },
  { name: "Rahul Desai", status: "Idle", attention: 22 },
  { name: "Pooja Iyer", status: "Active", attention: 84 },
];

const mockQuestions = [
  {
    student: "Priya Patel",
    question: "Can you explain the time complexity of quicksort again?",
    status: "Pending",
    time: "2 min ago",
  },
  {
    student: "Vikram Singh",
    question: "How does BST differ from AVL tree?",
    status: "Pending",
    time: "5 min ago",
  },
  {
    student: "Sneha Joshi",
    question: "What is the space complexity of merge sort?",
    status: "Answered",
    time: "8 min ago",
  },
  {
    student: "Ankit Mehta",
    question: "Could you share the notes for today's session?",
    status: "Answered",
    time: "12 min ago",
  },
];

const mockRecordings = [
  {
    title: "Data Structures - Trees & BST",
    date: "Mar 18, 2026",
    duration: "52 min",
    size: "486 MB",
  },
  {
    title: "Data Structures - Stacks & Queues",
    date: "Mar 16, 2026",
    duration: "48 min",
    size: "421 MB",
  },
  {
    title: "Data Structures - Linked Lists",
    date: "Mar 14, 2026",
    duration: "55 min",
    size: "510 MB",
  },
  {
    title: "Data Structures - Arrays",
    date: "Mar 12, 2026",
    duration: "45 min",
    size: "398 MB",
  },
];

const aiKeyPoints = [
  "Graph traversal uses BFS and DFS as primary algorithms",
  "BFS uses a queue data structure, DFS uses a stack (or recursion)",
  "Time complexity: O(V+E) for both algorithms",
  "DFS is preferred for topological sorting and cycle detection",
  "BFS guarantees shortest path in unweighted graphs",
];

function useTimer(running: boolean) {
  const [seconds, setSeconds] = useState(0);
  const ref = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } else {
      if (ref.current) clearInterval(ref.current);
      setSeconds(0);
    }
    return () => {
      if (ref.current) clearInterval(ref.current);
    };
  }, [running]);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h > 0 ? `${h}:` : ""}${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// Light theme constants for consistent styling
const CARD_BG = "#ffffff";
const CARD_BORDER = "#c7d2fe";
const INNER_BG = "#f5f3ff";
const HEADING_COLOR = "#1e1b4b";
const LABEL_COLOR = "#6b7280";
const ACCENT_COLOR = "#4338ca";
const ACCENT_LIGHT = "#6366f1";

export default function SmartboardTeaching() {
  const [branch, setBranch] = useState("CSE");
  const [division, setDivision] = useState("A");
  const [subject, setSubject] = useState("Data Structures");
  const [classStarted, setClassStarted] = useState(false);
  const [recording, setRecording] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [aiNotesOn, setAiNotesOn] = useState(true);
  const [whitePage, setWhitePage] = useState(1);
  const [activeTool, setActiveTool] = useState<"pen" | "eraser" | "shapes">(
    "pen",
  );
  const [quizTopic, setQuizTopic] = useState("Graphs");
  const [quizCount, setQuizCount] = useState("5");
  const [questions, setQuestions] = useState(mockQuestions);
  const timer = useTimer(classStarted);

  const handleBranchChange = (val: string) => {
    setBranch(val);
    const subs = subjectsByBranch[val] || [];
    setSubject(subs[0] || "");
  };

  const markAnswered = (idx: number) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === idx ? { ...q, status: "Answered" } : q)),
    );
  };

  const presentCount = 32;
  const totalCount = 38;

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 50%, #ede9ff 100%)",
      }}
    >
      {/* Session Status Bar */}
      <div
        className="sticky top-0 z-30 px-6 py-3 flex items-center justify-between border-b"
        style={{
          background: classStarted
            ? "linear-gradient(135deg, #064e3b, #065f46)"
            : "linear-gradient(135deg, #4338ca 0%, #6366f1 100%)",
          borderColor: "rgba(255,255,255,0.15)",
          transition: "background 0.5s",
        }}
      >
        <div className="flex items-center gap-4">
          <img
            src="/assets/generated/nirgrantha-logo-transparent.dim_400x80.png"
            alt="NIRGRANTHA"
            className="h-5 w-auto mr-2"
            style={{ filter: "brightness(0) invert(1)", opacity: 0.9 }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
          {classStarted ? (
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-green-300 font-bold text-sm tracking-wide">
                ● LIVE SESSION ACTIVE
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-indigo-200" />
              <span className="text-indigo-100 text-sm">No active session</span>
            </div>
          )}
          {classStarted && (
            <div className="hidden sm:flex items-center gap-3 text-sm text-white/90">
              <span className="px-2 py-0.5 rounded bg-white/15">{branch}</span>
              <span className="px-2 py-0.5 rounded bg-white/15">
                Div {division}
              </span>
              <span className="px-2 py-0.5 rounded bg-white/15">{subject}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {classStarted && (
            <div className="flex items-center gap-1.5 text-white/80 text-sm font-mono">
              <Clock className="w-3.5 h-3.5" />
              {timer}
            </div>
          )}
          <Button
            onClick={() => {
              setClassStarted(!classStarted);
              if (classStarted) setRecording(false);
            }}
            data-ocid="smartboard.primary_button"
            className={`h-9 px-5 text-sm font-bold rounded-xl transition-all ${
              classStarted
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "text-white shadow-lg"
            }`}
            style={
              !classStarted
                ? { background: "linear-gradient(135deg, #00c896, #00a8cc)" }
                : {}
            }
          >
            {classStarted ? (
              <>
                <Square className="w-4 h-4 mr-1.5" />
                End Class
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-1.5" />
                Start Live Class
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 py-6 space-y-6">
        {/* Row 1: Control Panel | Whiteboard | Student Monitor */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Live Class Control Panel */}
          <div
            className="lg:col-span-3 rounded-2xl p-5 space-y-4"
            style={{
              background: "linear-gradient(135deg, #f5f3ff 0%, #ede9ff 100%)",
              border: `2px solid ${CARD_BORDER}`,
              boxShadow: "0 4px 16px rgba(99,102,241,0.10)",
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Monitor className="w-4 h-4" style={{ color: "#00c896" }} />
              <h3
                className="font-bold text-sm"
                style={{ color: HEADING_COLOR }}
              >
                Live Class Control
              </h3>
            </div>

            {/* Selectors */}
            <div className="space-y-2">
              <div>
                <Label
                  className="text-xs mb-1 block font-medium"
                  style={{ color: ACCENT_COLOR }}
                >
                  Branch
                </Label>
                <Select value={branch} onValueChange={handleBranchChange}>
                  <SelectTrigger
                    data-ocid="smartboard.select"
                    className="h-8 text-xs"
                    style={{
                      background: CARD_BG,
                      border: `1px solid ${CARD_BORDER}`,
                      color: HEADING_COLOR,
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((b) => (
                      <SelectItem key={b} value={b}>
                        {b}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  className="text-xs mb-1 block font-medium"
                  style={{ color: ACCENT_COLOR }}
                >
                  Division
                </Label>
                <Select value={division} onValueChange={setDivision}>
                  <SelectTrigger
                    className="h-8 text-xs"
                    style={{
                      background: CARD_BG,
                      border: `1px solid ${CARD_BORDER}`,
                      color: HEADING_COLOR,
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {divisions.map((d) => (
                      <SelectItem key={d} value={d}>
                        Division {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  className="text-xs mb-1 block font-medium"
                  style={{ color: ACCENT_COLOR }}
                >
                  Subject
                </Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger
                    className="h-8 text-xs"
                    style={{
                      background: CARD_BG,
                      border: `1px solid ${CARD_BORDER}`,
                      color: HEADING_COLOR,
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(subjectsByBranch[branch] || []).map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Device status */}
            <div
              className="rounded-xl p-3 text-xs space-y-2"
              style={{
                background: CARD_BG,
                border: `1px solid ${CARD_BORDER}`,
              }}
            >
              <div className="flex items-center justify-between">
                <span style={{ color: HEADING_COLOR, fontWeight: 600 }}>
                  SMART Board 7000 Pro
                </span>
                <Badge className="text-[10px] px-1.5 py-0 h-5 bg-green-100 text-green-700 border-green-300">
                  <Wifi className="w-2.5 h-2.5 mr-1" />
                  Connected
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: LABEL_COLOR }}>Resolution</span>
                <span
                  className="font-semibold"
                  style={{ color: HEADING_COLOR }}
                >
                  4K UHD
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span style={{ color: LABEL_COLOR }}>Sync</span>
                <span className="text-green-600 font-semibold">Real-time</span>
              </div>
            </div>

            {/* Mic & Recording toggles */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label
                  className="flex items-center gap-2 text-xs cursor-pointer font-medium"
                  style={{ color: "#374151" }}
                >
                  {micOn ? (
                    <Mic className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <MicOff className="w-3.5 h-3.5 text-red-400" />
                  )}
                  Microphone
                </Label>
                <Switch
                  checked={micOn}
                  onCheckedChange={setMicOn}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>
              <div className="flex items-center justify-between">
                <Label
                  className="flex items-center gap-2 text-xs cursor-pointer font-medium"
                  style={{ color: "#374151" }}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${recording ? "bg-red-500 animate-pulse" : "bg-gray-400"}`}
                  />
                  Record Lecture
                </Label>
                <Switch
                  data-ocid="smartboard.toggle"
                  checked={recording}
                  onCheckedChange={setRecording}
                  className="data-[state=checked]:bg-red-500"
                />
              </div>
            </div>
          </div>

          {/* Real-time Whiteboard */}
          <div
            className="lg:col-span-6 rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: CARD_BG,
              border: `1.5px solid ${CARD_BORDER}`,
              boxShadow: "0 4px 16px rgba(99,102,241,0.08)",
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: CARD_BORDER }}
            >
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4" style={{ color: "#00c896" }} />
                <span
                  className="font-bold text-sm"
                  style={{ color: HEADING_COLOR }}
                >
                  Real-time Whiteboard
                </span>
                {classStarted && (
                  <Badge className="text-[10px] px-1.5 bg-green-100 text-green-700 border-green-300">
                    Sync Active
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1.5">
                {(["pen", "eraser", "shapes"] as const).map((tool) => (
                  <button
                    key={tool}
                    type="button"
                    onClick={() => setActiveTool(tool)}
                    className="p-1.5 rounded-lg transition-colors"
                    style={{
                      background:
                        activeTool === tool ? "#ede9ff" : "transparent",
                      color: activeTool === tool ? ACCENT_COLOR : LABEL_COLOR,
                      border:
                        activeTool === tool
                          ? `1px solid ${CARD_BORDER}`
                          : "1px solid transparent",
                    }}
                  >
                    {tool === "pen" && <Pen className="w-3.5 h-3.5" />}
                    {tool === "eraser" && <Eraser className="w-3.5 h-3.5" />}
                    {tool === "shapes" && <Shapes className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Board area */}
            <div
              className="flex-1 flex items-center justify-center min-h-[260px] relative"
              style={{ background: "#fafbff" }}
            >
              <div className="text-center">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: "#ede9ff" }}
                >
                  <Monitor
                    className="w-8 h-8"
                    style={{ color: ACCENT_COLOR }}
                  />
                </div>
                <p
                  className="text-sm font-semibold"
                  style={{ color: HEADING_COLOR }}
                >
                  {classStarted
                    ? "Whiteboard Sync Active"
                    : "Start class to enable whiteboard"}
                </p>
                <p className="text-xs mt-1" style={{ color: LABEL_COLOR }}>
                  {subject} · {branch} Div {division}
                </p>
              </div>
            </div>

            {/* Page nav + action buttons */}
            <div
              className="flex items-center justify-between px-4 py-2.5 border-t"
              style={{ borderColor: CARD_BORDER }}
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setWhitePage((p) => Math.max(1, p - 1))}
                  className="p-1 rounded hover:bg-indigo-50"
                  style={{ color: ACCENT_COLOR }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs" style={{ color: LABEL_COLOR }}>
                  Page {whitePage} of 3
                </span>
                <button
                  type="button"
                  onClick={() => setWhitePage((p) => Math.min(3, p + 1))}
                  className="p-1 rounded hover:bg-indigo-50"
                  style={{ color: ACCENT_COLOR }}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs gap-1"
                  style={{ borderColor: CARD_BORDER, color: HEADING_COLOR }}
                >
                  <Save className="w-3 h-3" />
                  Save Notes
                </Button>
                <Button
                  size="sm"
                  className="h-7 text-xs gap-1 text-white"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                  }}
                >
                  <Bot className="w-3 h-3" />
                  AI Capture
                </Button>
              </div>
            </div>
          </div>

          {/* Student Participation Monitor */}
          <div
            className="lg:col-span-3 rounded-2xl flex flex-col"
            style={{
              background: CARD_BG,
              border: `1.5px solid ${CARD_BORDER}`,
              boxShadow: "0 4px 16px rgba(99,102,241,0.08)",
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: CARD_BORDER }}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" style={{ color: "#00c896" }} />
                <span
                  className="font-bold text-sm"
                  style={{ color: HEADING_COLOR }}
                >
                  Participation
                </span>
              </div>
              <Badge className="text-[10px] px-1.5 bg-blue-100 text-blue-700 border-blue-300">
                {presentCount}/{totalCount} Present
              </Badge>
            </div>
            <ScrollArea className="flex-1 max-h-[340px]">
              <div className="p-3 space-y-2">
                {mockStudents.map((student) => (
                  <div
                    key={student.name}
                    className="rounded-lg p-2.5"
                    style={{
                      background: INNER_BG,
                      border: `1px solid ${CARD_BORDER}`,
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="text-xs font-semibold"
                        style={{ color: HEADING_COLOR }}
                      >
                        {student.name}
                      </span>
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                        style={{
                          background:
                            student.status === "Active"
                              ? "rgba(0,180,120,0.12)"
                              : student.status === "Raised Hand"
                                ? "rgba(217,119,6,0.12)"
                                : "rgba(220,38,38,0.10)",
                          color:
                            student.status === "Active"
                              ? "#059669"
                              : student.status === "Raised Hand"
                                ? "#d97706"
                                : "#dc2626",
                        }}
                      >
                        {student.status === "Raised Hand"
                          ? "🖐 Hand"
                          : student.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={student.attention}
                        className="h-1.5 flex-1"
                        style={
                          {
                            "--progress-color":
                              student.attention > 70
                                ? "#059669"
                                : student.attention > 40
                                  ? "#d97706"
                                  : "#dc2626",
                          } as React.CSSProperties
                        }
                      />
                      <span
                        className="text-[10px] w-7 text-right font-medium"
                        style={{ color: LABEL_COLOR }}
                      >
                        {student.attention}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Row 2: Notes/Materials | Q&A | AI Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Notes & Lecture Materials */}
          <div
            className="lg:col-span-4 rounded-2xl"
            style={{
              background: CARD_BG,
              border: `1.5px solid ${CARD_BORDER}`,
              boxShadow: "0 4px 16px rgba(99,102,241,0.08)",
            }}
          >
            <div
              className="flex items-center gap-2 px-4 py-3 border-b"
              style={{ borderColor: CARD_BORDER }}
            >
              <BookOpen className="w-4 h-4" style={{ color: "#00c896" }} />
              <span
                className="font-bold text-sm"
                style={{ color: HEADING_COLOR }}
              >
                Notes & Materials
              </span>
            </div>
            <Tabs defaultValue="session" className="p-4">
              <TabsList
                className="grid grid-cols-3 h-8 mb-3"
                style={{
                  background: INNER_BG,
                  border: `1px solid ${CARD_BORDER}`,
                }}
              >
                <TabsTrigger value="session" className="text-xs">
                  Session Notes
                </TabsTrigger>
                <TabsTrigger value="files" className="text-xs">
                  Files
                </TabsTrigger>
                <TabsTrigger value="previous" className="text-xs">
                  Previous
                </TabsTrigger>
              </TabsList>
              <TabsContent value="session">
                <div
                  className="rounded-xl p-3 min-h-[120px] text-xs border border-dashed text-center flex flex-col items-center justify-center gap-2"
                  style={{
                    borderColor: ACCENT_LIGHT,
                    background: INNER_BG,
                    color: LABEL_COLOR,
                  }}
                >
                  <Upload className="w-6 h-6 opacity-50" />
                  <p>Drag & drop files here</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs mt-1"
                    style={{ borderColor: CARD_BORDER, color: HEADING_COLOR }}
                  >
                    Browse Files
                  </Button>
                </div>
                <div className="mt-3 space-y-2">
                  {[
                    "Graph Traversal Notes.pdf",
                    "Lecture Slides Week 8.pptx",
                  ].map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-2 p-2 rounded-lg"
                      style={{
                        background: INNER_BG,
                        border: `1px solid ${CARD_BORDER}`,
                      }}
                    >
                      <FileText
                        className="w-3.5 h-3.5 flex-shrink-0"
                        style={{ color: ACCENT_COLOR }}
                      />
                      <span
                        className="text-xs flex-1 truncate font-medium"
                        style={{ color: HEADING_COLOR }}
                      >
                        {f}
                      </span>
                      <Download
                        className="w-3 h-3 cursor-pointer"
                        style={{ color: ACCENT_LIGHT }}
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="files">
                <div className="space-y-2">
                  {[
                    "DS_Unit3_Trees.pdf",
                    "BFS_DFS_Examples.pptx",
                    "Assignment3.docx",
                  ].map((f) => (
                    <div
                      key={f}
                      className="flex items-center gap-2 p-2 rounded-lg"
                      style={{
                        background: INNER_BG,
                        border: `1px solid ${CARD_BORDER}`,
                      }}
                    >
                      <FileText
                        className="w-3.5 h-3.5 flex-shrink-0"
                        style={{ color: ACCENT_COLOR }}
                      />
                      <span
                        className="text-xs flex-1 truncate font-medium"
                        style={{ color: HEADING_COLOR }}
                      >
                        {f}
                      </span>
                      <Download
                        className="w-3 h-3 cursor-pointer"
                        style={{ color: ACCENT_LIGHT }}
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="previous">
                <div className="space-y-2">
                  {mockRecordings.slice(0, 3).map((r) => (
                    <div
                      key={r.title}
                      className="flex items-center gap-2 p-2 rounded-lg"
                      style={{
                        background: INNER_BG,
                        border: `1px solid ${CARD_BORDER}`,
                      }}
                    >
                      <Video className="w-3.5 h-3.5 flex-shrink-0 text-purple-500" />
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs truncate font-medium"
                          style={{ color: HEADING_COLOR }}
                        >
                          {r.title}
                        </p>
                        <p
                          className="text-[10px]"
                          style={{ color: LABEL_COLOR }}
                        >
                          {r.date} · {r.duration}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Doubt & Q&A Panel */}
          <div
            className="lg:col-span-4 rounded-2xl flex flex-col"
            style={{
              background: CARD_BG,
              border: `1.5px solid ${CARD_BORDER}`,
              boxShadow: "0 4px 16px rgba(99,102,241,0.08)",
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: CARD_BORDER }}
            >
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4" style={{ color: "#00c896" }} />
                <span
                  className="font-bold text-sm"
                  style={{ color: HEADING_COLOR }}
                >
                  Doubt & Q&A
                </span>
              </div>
              <Badge className="text-[10px] bg-amber-100 text-amber-700 border-amber-300">
                {questions.filter((q) => q.status === "Pending").length} Pending
              </Badge>
            </div>
            <ScrollArea className="flex-1 max-h-[280px]">
              <div className="p-3 space-y-2">
                {questions.map((q, i) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: static list
                    key={i}
                    className="rounded-xl p-3"
                    style={{
                      background: q.status === "Pending" ? INNER_BG : "#f0fdf4",
                      border: `1px solid ${q.status === "Pending" ? CARD_BORDER : "#86efac"}`,
                    }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <span
                          className="text-[10px] font-bold"
                          style={{ color: ACCENT_COLOR }}
                        >
                          {q.student}
                        </span>
                        <span
                          className="text-[10px] ml-2"
                          style={{ color: LABEL_COLOR }}
                        >
                          {q.time}
                        </span>
                      </div>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-semibold ${
                          q.status === "Pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {q.status}
                      </span>
                    </div>
                    <p
                      className="text-xs mb-2 font-medium"
                      style={{ color: HEADING_COLOR }}
                    >
                      {q.question}
                    </p>
                    {q.status === "Pending" && (
                      <Button
                        size="sm"
                        onClick={() => markAnswered(i)}
                        className="h-6 text-[10px] px-2 text-white"
                        style={{ background: ACCENT_COLOR }}
                      >
                        Mark Answered
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* AI Auto-Notes & Summary */}
          <div
            className="lg:col-span-4 rounded-2xl"
            style={{
              background: CARD_BG,
              border: `1.5px solid ${CARD_BORDER}`,
              boxShadow: "0 4px 16px rgba(99,102,241,0.08)",
            }}
          >
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: CARD_BORDER }}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span
                  className="font-bold text-sm"
                  style={{ color: HEADING_COLOR }}
                >
                  AI Auto-Notes
                </span>
                <Badge className="text-[10px] px-1.5 bg-purple-100 text-purple-700 border-purple-300">
                  AI
                </Badge>
              </div>
              <Switch
                data-ocid="smartboard.switch"
                checked={aiNotesOn}
                onCheckedChange={setAiNotesOn}
                className="data-[state=checked]:bg-purple-500"
              />
            </div>
            <div className="p-4 space-y-3">
              {aiNotesOn && (
                <div className="flex items-center gap-2 text-xs text-purple-600 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                  AI is summarizing this session...
                </div>
              )}
              <div className="space-y-1.5">
                <p
                  className="text-[10px] font-bold uppercase tracking-wide"
                  style={{ color: ACCENT_COLOR }}
                >
                  Key Points Auto-Generated
                </p>
                {aiKeyPoints.map((point, i) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static list
                  <div key={i} className="flex items-start gap-2">
                    <Circle className="w-1.5 h-1.5 mt-1.5 flex-shrink-0 fill-purple-500 text-purple-500" />
                    <p
                      className="text-xs font-medium"
                      style={{ color: HEADING_COLOR }}
                    >
                      {point}
                    </p>
                  </div>
                ))}
              </div>
              <Button
                className="w-full h-8 text-xs gap-1.5 text-white font-semibold"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #a78bfa)",
                }}
              >
                <Download className="w-3.5 h-3.5" />
                Download Summary
              </Button>
            </div>
          </div>
        </div>

        {/* Row 3: Quiz Generator | Recorded Lectures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quiz Generator */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: CARD_BG,
              border: `1.5px solid ${CARD_BORDER}`,
              boxShadow: "0 4px 16px rgba(99,102,241,0.08)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4 text-amber-500" />
              <h3
                className="font-bold text-sm"
                style={{ color: HEADING_COLOR }}
              >
                Quiz Generator
              </h3>
              <Badge className="text-[10px] px-1.5 bg-amber-100 text-amber-700 border-amber-300">
                AI Powered
              </Badge>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <Label
                  className="text-xs mb-1 block font-medium"
                  style={{ color: ACCENT_COLOR }}
                >
                  Topic
                </Label>
                <Select value={quizTopic} onValueChange={setQuizTopic}>
                  <SelectTrigger
                    className="h-8 text-xs"
                    style={{
                      background: INNER_BG,
                      border: `1px solid ${CARD_BORDER}`,
                      color: HEADING_COLOR,
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Graphs", "Trees", "Sorting", "Hashing", "DP"].map(
                      (t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  className="text-xs mb-1 block font-medium"
                  style={{ color: ACCENT_COLOR }}
                >
                  Questions
                </Label>
                <Select value={quizCount} onValueChange={setQuizCount}>
                  <SelectTrigger
                    className="h-8 text-xs"
                    style={{
                      background: INNER_BG,
                      border: `1px solid ${CARD_BORDER}`,
                      color: HEADING_COLOR,
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["5", "10", "15", "20"].map((n) => (
                      <SelectItem key={n} value={n}>
                        {n} Questions
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label
                  className="text-xs mb-1 block font-medium"
                  style={{ color: ACCENT_COLOR }}
                >
                  Type
                </Label>
                <Select defaultValue="mcq">
                  <SelectTrigger
                    className="h-8 text-xs"
                    style={{
                      background: INNER_BG,
                      border: `1px solid ${CARD_BORDER}`,
                      color: HEADING_COLOR,
                    }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mcq">MCQ</SelectItem>
                    <SelectItem value="short">Short Answer</SelectItem>
                    <SelectItem value="tf">True/False</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              data-ocid="smartboard.secondary_button"
              className="w-full h-9 text-sm gap-2 text-white font-bold"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #f97316)",
              }}
            >
              <Sparkles className="w-4 h-4" />
              Generate with AI
            </Button>
          </div>

          {/* Recorded Lectures Library */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: CARD_BG,
              border: `1.5px solid ${CARD_BORDER}`,
              boxShadow: "0 4px 16px rgba(99,102,241,0.08)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Video className="w-4 h-4 text-purple-500" />
              <h3
                className="font-bold text-sm"
                style={{ color: HEADING_COLOR }}
              >
                Recorded Lectures
              </h3>
              <Badge
                className="text-[10px] px-1.5"
                style={{
                  background: INNER_BG,
                  color: LABEL_COLOR,
                  border: `1px solid ${CARD_BORDER}`,
                }}
              >
                {mockRecordings.length} recordings
              </Badge>
            </div>
            <div className="space-y-2">
              {mockRecordings.map((r) => (
                <div
                  key={r.title}
                  className="flex items-center gap-3 p-2.5 rounded-xl"
                  style={{
                    background: INNER_BG,
                    border: `1px solid ${CARD_BORDER}`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "#ede9ff" }}
                  >
                    <Video className="w-3.5 h-3.5 text-purple-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-xs font-semibold truncate"
                      style={{ color: HEADING_COLOR }}
                    >
                      {r.title}
                    </p>
                    <p className="text-[10px]" style={{ color: LABEL_COLOR }}>
                      {r.date} · {r.duration} · {r.size}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="p-1 rounded hover:bg-indigo-50"
                      style={{ color: ACCENT_COLOR }}
                    >
                      <Play className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      className="p-1 rounded hover:bg-indigo-50"
                      style={{ color: LABEL_COLOR }}
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Row 4: Message/Discussion */}
        <div
          className="rounded-2xl p-5"
          style={{
            background: CARD_BG,
            border: `1.5px solid ${CARD_BORDER}`,
            boxShadow: "0 4px 16px rgba(99,102,241,0.08)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4" style={{ color: "#00c896" }} />
            <span
              className="font-bold text-sm"
              style={{ color: HEADING_COLOR }}
            >
              Live Classroom Announcements
            </span>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Post an announcement to all students..."
              className="flex-1 h-9 px-3 rounded-xl text-sm"
              style={{
                background: INNER_BG,
                border: `1px solid ${CARD_BORDER}`,
                color: HEADING_COLOR,
                outline: "none",
              }}
            />
            <Button
              className="h-9 px-4 text-sm gap-1.5 text-white font-semibold"
              style={{
                background: "linear-gradient(135deg, #4338ca, #6366f1)",
              }}
            >
              <Radio className="w-3.5 h-3.5" />
              Broadcast
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
