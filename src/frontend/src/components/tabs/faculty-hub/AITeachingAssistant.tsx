import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Brain,
  ChevronRight,
  FileText,
  HelpCircle,
  Minus,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

const weakStudents = [
  { name: "Karan Singh", subject: "Cloud Computing", risk: "High", score: 58 },
  {
    name: "Priya Patel",
    subject: "Data Structures",
    risk: "Medium",
    score: 72,
  },
  { name: "Vikram Nair", subject: "VLSI Design", risk: "Medium", score: 68 },
  { name: "Meera Joshi", subject: "DBMS", risk: "Low", score: 76 },
];

const performancePredictions = [
  { name: "Arjun Sharma", predicted: 91, confidence: 88, trend: "up" },
  { name: "Priya Patel", predicted: 74, confidence: 82, trend: "stable" },
  { name: "Rahul Verma", predicted: 94, confidence: 91, trend: "up" },
  { name: "Karan Singh", predicted: 61, confidence: 85, trend: "down" },
  { name: "Sneha Gupta", predicted: 96, confidence: 93, trend: "up" },
];

const mockSummary = `📌 Key Concepts Covered:
• Graphs are non-linear data structures consisting of vertices (nodes) and edges.
• Types: Directed (Digraph) and Undirected graphs.
• Representations: Adjacency Matrix (O(V²) space) and Adjacency List (O(V+E) space).

🔍 Core Algorithms:
• BFS (Breadth-First Search): Uses queue, explores level by level. Time: O(V+E).
• DFS (Depth-First Search): Uses stack/recursion, explores depth-first. Time: O(V+E).

⚡ Applications:
• Shortest path (Dijkstra, Bellman-Ford), Minimum Spanning Tree (Kruskal, Prim), Topological Sort.

📝 Key Takeaway:
Choose adjacency list for sparse graphs and adjacency matrix for dense graphs.`;

const mockQuestions = [
  {
    q: "What is the time complexity of BFS on a graph with V vertices and E edges?",
    type: "MCQ",
  },
  {
    q: "Explain the difference between directed and undirected graphs with examples.",
    type: "Short Answer",
  },
  {
    q: "Implement DFS traversal for the following graph: {A→B, A→C, B→D, C→D}.",
    type: "Coding",
  },
  {
    q: "Which graph representation is more space-efficient for sparse graphs?",
    type: "MCQ",
  },
  {
    q: "Describe Dijkstra's algorithm and its time complexity.",
    type: "Long Answer",
  },
  {
    q: "What is a topological sort? When is it applicable?",
    type: "Short Answer",
  },
  {
    q: "Find the minimum spanning tree of the given weighted graph using Kruskal's algorithm.",
    type: "Problem",
  },
  {
    q: "Differentiate between BFS and DFS in terms of space complexity and use cases.",
    type: "Comparison",
  },
];

function RiskBadge({ risk }: { risk: string }) {
  if (risk === "High")
    return (
      <Badge className="bg-red-100 text-red-700 border-red-200 text-xs">
        {risk}
      </Badge>
    );
  if (risk === "Medium")
    return (
      <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
        {risk}
      </Badge>
    );
  return (
    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200 text-xs">
      {risk}
    </Badge>
  );
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === "up") return <TrendingUp className="w-4 h-4 text-green-500" />;
  if (trend === "down")
    return <TrendingDown className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-gray-400" />;
}

function QuestionTypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    MCQ: "bg-blue-100 text-blue-700 border-blue-200",
    "Short Answer": "bg-green-100 text-green-700 border-green-200",
    Coding: "bg-purple-100 text-purple-700 border-purple-200",
    "Long Answer": "bg-indigo-100 text-indigo-700 border-indigo-200",
    Problem: "bg-orange-100 text-orange-700 border-orange-200",
    Comparison: "bg-teal-100 text-teal-700 border-teal-200",
  };
  return (
    <Badge
      className={`text-[10px] ${colors[type] ?? "bg-gray-100 text-gray-600 border-gray-200"}`}
    >
      {type}
    </Badge>
  );
}

export default function AITeachingAssistant() {
  const [noteInput, setNoteInput] = useState("");
  const [summary, setSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [quizSubject, setQuizSubject] = useState("Data Structures");
  const [difficulty, setDifficulty] = useState("Medium");
  const [generatedQuestions, setGeneratedQuestions] = useState<
    typeof mockQuestions
  >([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSummarize = () => {
    if (!noteInput.trim()) return;
    setIsSummarizing(true);
    setTimeout(() => {
      setSummary(mockSummary);
      setIsSummarizing(false);
    }, 1500);
  };

  const handleGeneratePaper = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setGeneratedQuestions(mockQuestions);
      setIsGenerating(false);
    }, 1800);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">
      {/* AI Badge Header */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-lg">
              AI Teaching Assistant
            </h2>
            <Badge className="bg-white/20 text-white border-white/30 text-xs">
              AI-Powered
            </Badge>
          </div>
          <p className="text-sm text-blue-100 mt-0.5">
            Intelligent insights, predictions, and automation for smarter
            teaching
          </p>
        </div>
      </div>

      {/* Top Row: Next Topic + Weak Students */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. AI Next Topic Suggestion */}
        <div className="bg-white dark:bg-fhub-card rounded-2xl border border-fhub-border shadow-fhub p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Brain className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="font-display font-semibold text-fhub-heading text-base">
              AI Next Topic Suggestion
            </h3>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 mb-4">
            <p className="text-xs text-blue-500 font-medium mb-1">
              Recommended Next Topic
            </p>
            <p className="text-base font-bold text-fhub-heading">
              Chapter 5: Graphs — BFS & DFS
            </p>
            <p className="text-xs text-fhub-muted mt-1">
              Based on current progress in Data Structures · CSE Div A
            </p>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-xs text-fhub-muted">
              <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
              Prerequisites covered: Arrays, Linked Lists, Trees
            </div>
            <div className="flex items-center gap-2 text-xs text-fhub-muted">
              <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
              Estimated duration: 3 lectures (90 min each)
            </div>
            <div className="flex items-center gap-2 text-xs text-fhub-muted">
              <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" />
              Difficulty: Intermediate
            </div>
          </div>
          <Button className="w-full bg-fhub-accent hover:bg-fhub-accent-dark text-white text-sm rounded-xl">
            <ChevronRight className="w-4 h-4 mr-1.5" /> View Topic Details
          </Button>
        </div>

        {/* 2. Weak Student Detection */}
        <div className="bg-white dark:bg-fhub-card rounded-2xl border border-fhub-border shadow-fhub p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <h3 className="font-display font-semibold text-fhub-heading text-base">
              Weak Student Detection
            </h3>
            <Badge className="ml-auto bg-red-100 text-red-700 border-red-200 text-xs">
              {weakStudents.filter((s) => s.risk === "High").length} High Risk
            </Badge>
          </div>
          <div className="space-y-3">
            {weakStudents.map((student, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: static list
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-fhub-bg border border-fhub-border"
              >
                <div className="w-8 h-8 rounded-full bg-fhub-badge-bg border border-fhub-accent/20 flex items-center justify-center text-xs font-bold text-fhub-accent flex-shrink-0">
                  {student.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-fhub-heading truncate">
                    {student.name}
                  </p>
                  <p className="text-xs text-fhub-muted">{student.subject}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm font-bold text-fhub-accent">
                    {student.score}%
                  </span>
                  <RiskBadge risk={student.risk} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Prediction */}
      <div className="bg-white dark:bg-fhub-card rounded-2xl border border-fhub-border shadow-fhub p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <h3 className="font-display font-semibold text-fhub-heading text-base">
            Performance Prediction
          </h3>
          <Badge className="ml-auto bg-green-100 text-green-700 border-green-200 text-xs">
            End-of-Semester Forecast
          </Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-fhub-border">
                <th className="text-left text-xs text-fhub-muted font-medium pb-2 pr-4">
                  Student
                </th>
                <th className="text-left text-xs text-fhub-muted font-medium pb-2 pr-4">
                  Predicted Score
                </th>
                <th className="text-left text-xs text-fhub-muted font-medium pb-2 pr-4">
                  Confidence
                </th>
                <th className="text-left text-xs text-fhub-muted font-medium pb-2">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody>
              {performancePredictions.map((p, i) => (
                <tr
                  // biome-ignore lint/suspicious/noArrayIndexKey: static list
                  key={i}
                  className="border-b border-fhub-border/50 last:border-0"
                >
                  <td className="py-2.5 pr-4 text-xs font-medium text-fhub-heading">
                    {p.name}
                  </td>
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-2">
                      <Progress
                        value={p.predicted}
                        className="w-24 h-2 bg-fhub-bg [&>div]:bg-fhub-accent"
                      />
                      <span className="text-xs font-bold text-fhub-accent">
                        {p.predicted}%
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className="text-xs text-fhub-muted">
                      {p.confidence}% confidence
                    </span>
                  </td>
                  <td className="py-2.5">
                    <TrendIcon trend={p.trend} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Row: Note Summarizer + Question Paper Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 4. Automated Note Summarization */}
        <div className="bg-white dark:bg-fhub-card rounded-2xl border border-fhub-border shadow-fhub p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
              <FileText className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="font-display font-semibold text-fhub-heading text-base">
              Automated Note Summarization
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-fhub-muted mb-1.5 block">
                Paste your lecture notes below
              </Label>
              <Textarea
                placeholder="Paste lecture notes here... (e.g., 'Today we covered graph data structures. A graph consists of vertices and edges...')"
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                className="border-fhub-border bg-fhub-bg text-fhub-heading text-sm resize-none h-28"
              />
            </div>
            <Button
              onClick={handleSummarize}
              disabled={!noteInput.trim() || isSummarizing}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-xl disabled:opacity-50"
            >
              {isSummarizing ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Summarizing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  Summarize Notes
                </>
              )}
            </Button>
            {summary && (
              <div className="p-4 rounded-xl bg-purple-50 border border-purple-100 animate-fade-in-up">
                <p className="text-xs font-semibold text-purple-700 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> AI Summary
                </p>
                <pre className="text-xs text-fhub-heading whitespace-pre-wrap font-sans leading-relaxed">
                  {summary}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* 5. Question Paper Generator */}
        <div className="bg-white dark:bg-fhub-card rounded-2xl border border-fhub-border shadow-fhub p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="font-display font-semibold text-fhub-heading text-base">
              Question Paper Generator
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-fhub-muted mb-1.5 block">
                Subject
              </Label>
              <Select value={quizSubject} onValueChange={setQuizSubject}>
                <SelectTrigger className="border-fhub-border bg-fhub-bg text-fhub-heading text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "Data Structures",
                    "Algorithms",
                    "DBMS",
                    "Operating Systems",
                    "Computer Networks",
                  ].map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-fhub-muted mb-1.5 block">
                Difficulty Level
              </Label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="border-fhub-border bg-fhub-bg text-fhub-heading text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Easy", "Medium", "Hard", "Mixed"].map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleGeneratePaper}
              disabled={isGenerating}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-xl disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Generating...
                </>
              ) : (
                <>
                  <HelpCircle className="w-4 h-4 mr-1.5" />
                  Generate Paper
                </>
              )}
            </Button>
            {generatedQuestions.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 animate-fade-in-up">
                <p className="text-xs font-semibold text-indigo-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Generated Questions —{" "}
                  {quizSubject} ({difficulty})
                </p>
                {generatedQuestions.map((item, i) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: static list
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-indigo-50 border border-indigo-100"
                  >
                    <span className="text-xs font-bold text-indigo-500 flex-shrink-0 mt-0.5">
                      Q{i + 1}.
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-fhub-heading leading-relaxed">
                        {item.q}
                      </p>
                      <div className="mt-1.5">
                        <QuestionTypeBadge type={item.type} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
