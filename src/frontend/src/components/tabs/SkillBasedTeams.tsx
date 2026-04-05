import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Award,
  BarChart3,
  Calendar,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  DollarSign,
  Edit,
  Eye,
  Github,
  Globe,
  GraduationCap,
  IndianRupee,
  MapPin,
  Plus,
  Share2,
  Shield,
  Sparkles,
  Star,
  Trash2,
  Trophy,
  UserPlus,
  Users,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { toast } from "sonner";
import {
  generateHackathonProfile,
  getStudentTalentProfileStore,
  subscribeStudentTalentProfile,
  type GeneratedHackathonProfile,
} from "@/utils/studentTalentProfile";

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────
type StudentType = "software" | "hardware";
type HackathonType = "National" | "International" | "Global" | "College";

interface Student {
  id: number;
  name: string;
  branch: string;
  year: number;
  type: StudentType;
  skills: string[];
  projects: number;
  github: string;
  linkedin: string;
  avatar: string;
  color: string;
  bio: string;
  isMe?: boolean;
  hackathonDomains?: string[];
  softwareScore?: number;
  hardwareScore?: number;
  connectedPlatforms?: string[];
  recommendedRoles?: string[];
  source?: "manual" | "integrations";
}

interface Team {
  id: number;
  name: string;
  goal: string;
  skills: string[];
  members: {
    id: number;
    name: string;
    avatar: string;
    status: "confirmed" | "pending";
  }[];
}

interface Hackathon {
  id: string;
  name: string;
  organizer: string;
  dateRange: string;
  location: string;
  isOnline: boolean;
  type: HackathonType;
  prize: string;
  tags: string[];
  teamSize: string;
  deadline: Date;
  domainOptions: string[];
}

interface RegistrationForm {
  // Step 1
  fullName: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  year: string;
  studentId: string;
  // Step 2
  teamName: string;
  teamSize: string;
  teammates: { name: string; email: string }[];
  isLeader: boolean;
  // Step 3
  projectTitle: string;
  problemStatement: string;
  techStack: string;
  category: string;
  githubRepo: string;
  // Step 4
  agreed: boolean;
}

function buildAvatar(name: string) {
  return name
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function mapIntegratedProfileToStudent(
  profile: GeneratedHackathonProfile,
): Student {
  return {
    id: 999001,
    name: profile.name,
    branch: profile.branch,
    year: profile.year,
    type: profile.primaryTrack,
    skills: profile.skills.length > 0 ? profile.skills : ["Hackathon Ready"],
    projects: profile.projectCount,
    github: profile.githubUrl,
    linkedin: profile.linkedinUrl,
    avatar: buildAvatar(profile.name),
    color:
      profile.primaryTrack === "hardware"
        ? "from-cyan-500 to-blue-600"
        : "from-indigo-500 to-blue-600",
    bio: profile.bio,
    isMe: true,
    hackathonDomains: profile.recommendedDomains,
    softwareScore: profile.softwareScore,
    hardwareScore: profile.hardwareScore,
    connectedPlatforms: profile.connectedPlatforms,
    recommendedRoles: profile.recommendedRoles,
    source: "integrations",
  };
}

// ─────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────
const SEED_STUDENTS: Student[] = [
  {
    id: 1,
    name: "Arjun Mehta",
    branch: "CSE",
    year: 3,
    type: "software",
    skills: ["React", "Node.js", "Python", "ML"],
    projects: 8,
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    avatar: "AM",
    color: "from-blue-500 to-indigo-600",
    bio: "Full-stack dev passionate about AI",
  },
  {
    id: 2,
    name: "Priya Nair",
    branch: "IT",
    year: 4,
    type: "software",
    skills: ["Flutter", "Firebase", "Dart", "UI/UX"],
    projects: 6,
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    avatar: "PN",
    color: "from-purple-500 to-pink-600",
    bio: "Mobile app developer & designer",
  },
  {
    id: 3,
    name: "Rahul Singh",
    branch: "CSE",
    year: 3,
    type: "software",
    skills: ["Java", "Spring Boot", "AWS", "Docker"],
    projects: 11,
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    avatar: "RS",
    color: "from-teal-500 to-emerald-600",
    bio: "Backend engineer & cloud enthusiast",
  },
  {
    id: 4,
    name: "Sneha Patel",
    branch: "IT",
    year: 2,
    type: "software",
    skills: ["Python", "TensorFlow", "Data Science", "SQL"],
    projects: 5,
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    avatar: "SP",
    color: "from-orange-500 to-red-500",
    bio: "Data scientist in the making",
  },
  {
    id: 5,
    name: "Vikram Rao",
    branch: "ECE",
    year: 4,
    type: "hardware",
    skills: ["VLSI", "Verilog", "FPGA", "PCB Design"],
    projects: 7,
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    avatar: "VR",
    color: "from-cyan-500 to-blue-500",
    bio: "VLSI design & embedded systems",
  },
  {
    id: 6,
    name: "Ananya Krishnan",
    branch: "ECE",
    year: 3,
    type: "hardware",
    skills: ["Arduino", "Raspberry Pi", "IoT", "C++"],
    projects: 9,
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    avatar: "AK",
    color: "from-rose-500 to-pink-500",
    bio: "IoT & embedded systems developer",
  },
  {
    id: 7,
    name: "Karthik Iyer",
    branch: "EEE",
    year: 4,
    type: "hardware",
    skills: ["Power Electronics", "MATLAB", "Simulink", "PLC"],
    projects: 4,
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    avatar: "KI",
    color: "from-amber-500 to-orange-500",
    bio: "Power systems & automation engineer",
  },
  {
    id: 8,
    name: "Divya Menon",
    branch: "ECE",
    year: 2,
    type: "hardware",
    skills: ["Signal Processing", "MATLAB", "RF Design", "Antenna"],
    projects: 3,
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    avatar: "DM",
    color: "from-green-500 to-teal-500",
    bio: "RF & communication systems",
  },
];

const HACKATHONS: Hackathon[] = [
  {
    id: "sih-2026",
    name: "Smart India Hackathon 2026",
    organizer: "Ministry of Education, Govt. of India",
    dateRange: "Mar 20–22, 2026",
    location: "Pan India (Offline)",
    isOnline: false,
    type: "National",
    prize: "₹1,00,000",
    tags: ["AI", "IoT", "Web"],
    teamSize: "6 members",
    deadline: new Date("2026-04-10"),
    domainOptions: [
      "Agriculture",
      "Health",
      "Education",
      "Smart Cities",
      "Disaster Management",
      "Cybersecurity",
    ],
  },
  {
    id: "hackmit-2026",
    name: "HackMIT India Edition",
    organizer: "MIT Alumni Association India",
    dateRange: "Apr 5–6, 2026",
    location: "Online",
    isOnline: true,
    type: "International",
    prize: "$5,000",
    tags: ["ML", "Blockchain", "Cloud"],
    teamSize: "2–4 members",
    deadline: new Date("2026-03-28"),
    domainOptions: [
      "Fintech",
      "Healthcare AI",
      "Climate Tech",
      "EdTech",
      "Web3",
    ],
  },
  {
    id: "techfest-2026",
    name: "IIT Bombay Techfest Hackathon",
    organizer: "IIT Bombay",
    dateRange: "Apr 15–16, 2026",
    location: "Mumbai (Offline)",
    isOnline: false,
    type: "National",
    prize: "₹50,000",
    tags: ["Hardware", "Robotics", "AI"],
    teamSize: "3–5 members",
    deadline: new Date("2026-04-05"),
    domainOptions: [
      "Robotics",
      "Embedded Systems",
      "Computer Vision",
      "Autonomous Vehicles",
      "Space Tech",
    ],
  },
  {
    id: "gsc-2026",
    name: "Google Solution Challenge 2026",
    organizer: "Google Developers",
    dateRange: "Submissions by May 1, 2026",
    location: "Online (Global)",
    isOnline: true,
    type: "Global",
    prize: "Mentorship + Cloud Credits + Prizes",
    tags: ["Android", "Firebase", "ML"],
    teamSize: "1–4 members",
    deadline: new Date("2026-04-15"),
    domainOptions: [
      "SDG 1: No Poverty",
      "SDG 3: Good Health",
      "SDG 4: Quality Education",
      "SDG 11: Sustainable Cities",
      "SDG 13: Climate Action",
    ],
  },
  {
    id: "hackwithinfy-2026",
    name: "HackWithInfy 2026",
    organizer: "Infosys Limited",
    dateRange: "Apr 20, 2026",
    location: "Online",
    isOnline: true,
    type: "National",
    prize: "Job Offer + ₹75,000",
    tags: ["Full Stack", "DevOps", "Security"],
    teamSize: "2–3 members",
    deadline: new Date("2026-04-08"),
    domainOptions: [
      "Enterprise Software",
      "Cybersecurity",
      "Cloud & DevOps",
      "Data Analytics",
      "Digital Transformation",
    ],
  },
  {
    id: "cfg-2026",
    name: "Code For Good 2026",
    organizer: "JPMorgan Chase & Co.",
    dateRange: "May 10–11, 2026",
    location: "Bangalore (Offline)",
    isOnline: false,
    type: "National",
    prize: "Internship + ₹30,000",
    tags: ["Social Impact", "Web", "Mobile"],
    teamSize: "4–6 members",
    deadline: new Date("2026-04-20"),
    domainOptions: [
      "Financial Inclusion",
      "Education Access",
      "Healthcare Access",
      "Environment",
      "Community Development",
    ],
  },
];

const TYPE_COLORS: Record<HackathonType, string> = {
  National: "bg-amber-100 text-amber-800 border-amber-300",
  International: "bg-purple-100 text-purple-800 border-purple-300",
  Global: "bg-blue-100 text-blue-800 border-blue-300",
  College: "bg-green-100 text-green-800 border-green-300",
};

const CARD_GRADIENTS = [
  {
    bg: "linear-gradient(135deg,#fef3c7 0%,#fde68a 60%,#fbbf24 100%)",
    border: "#d97706",
  },
  {
    bg: "linear-gradient(135deg,#ede9fe 0%,#ddd6fe 60%,#c4b5fd 100%)",
    border: "#7c3aed",
  },
  {
    bg: "linear-gradient(135deg,#dbeafe 0%,#bfdbfe 60%,#93c5fd 100%)",
    border: "#2563eb",
  },
  {
    bg: "linear-gradient(135deg,#d1fae5 0%,#a7f3d0 60%,#6ee7b7 100%)",
    border: "#059669",
  },
  {
    bg: "linear-gradient(135deg,#fee2e2 0%,#fecaca 60%,#fca5a5 100%)",
    border: "#dc2626",
  },
  {
    bg: "linear-gradient(135deg,#e0f2fe 0%,#bae6fd 60%,#7dd3fc 100%)",
    border: "#0284c7",
  },
];

function getDaysUntil(date: Date): number {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function DeadlineBadge({ deadline }: { deadline: Date }) {
  const days = getDaysUntil(deadline);
  const isPast = days < 0;
  const cls = isPast
    ? "bg-gray-100 text-gray-600 border-gray-300"
    : days < 7
      ? "bg-red-100 text-red-700 border-red-300"
      : days < 14
        ? "bg-amber-100 text-amber-700 border-amber-300"
        : "bg-green-100 text-green-700 border-green-300";
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${cls}`}
    >
      <Clock className="w-2.5 h-2.5" />
      {isPast ? "Closed" : `${days}d left`}
    </span>
  );
}

// ─────────────────────────────────────────────────────────
// Hackathon Registration Modal
// ─────────────────────────────────────────────────────────
function generateRegId(prefix: string): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 4; i++)
    code += chars[Math.floor(Math.random() * chars.length)];
  return `${prefix}-${new Date().getFullYear()}-${code}`;
}

const STEP_LABELS = [
  "Personal Details",
  "Team Details",
  "Project Idea",
  "Review & Submit",
];
const STEP_ICONS = ["👤", "👥", "💡", "✅"];

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-0 mb-6">
      {STEP_LABELS.map((label, i) => (
        <div key={label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i < step
                  ? "bg-green-500 text-white"
                  : i === step
                    ? "bg-indigo-600 text-white ring-2 ring-indigo-300"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {i < step ? "✓" : STEP_ICONS[i]}
            </div>
            <span
              className={`text-[9px] font-semibold mt-1 text-center leading-tight max-w-[52px] ${
                i === step
                  ? "text-indigo-700"
                  : i < step
                    ? "text-green-600"
                    : "text-gray-400"
              }`}
            >
              {label}
            </span>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div
              className={`flex-1 h-0.5 mx-1 mt-[-14px] ${
                i < step ? "bg-green-400" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function HackathonRegistrationModal({
  hackathon,
  open,
  onClose,
  onRegistered,
}: {
  hackathon: Hackathon | null;
  open: boolean;
  onClose: () => void;
  onRegistered: (hackathonId: string) => void;
}) {
  const [step, setStep] = useState(0);
  const [regId, setRegId] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [teammateInput, setTeammateInput] = useState({ name: "", email: "" });

  const [form, setForm] = useState<RegistrationForm>({
    fullName: "Arihant Mahajan",
    email: "arihantmahajan156@gmail.com",
    phone: "",
    college: "Walchand Institute of Technology, Solapur",
    branch: "CSE",
    year: "3",
    studentId: "21CSE047",
    teamName: "",
    teamSize: "",
    teammates: [],
    isLeader: true,
    projectTitle: "",
    problemStatement: "",
    techStack: "",
    category: "",
    githubRepo: "",
    agreed: false,
  });

  function set(field: keyof RegistrationForm, value: unknown) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function hasAnyData() {
    return (
      form.phone !== "" ||
      form.teamName !== "" ||
      form.projectTitle !== "" ||
      form.teammates.length > 0
    );
  }

  function handleClose() {
    if (hasAnyData() && !submitted) {
      if (!confirm("You have unsaved data. Close anyway?")) return;
    }
    resetModal();
    onClose();
  }

  function resetModal() {
    setStep(0);
    setSubmitted(false);
    setRegId("");
    setTeammateInput({ name: "", email: "" });

    setForm({
      fullName: "Arihant Mahajan",
      email: "arihantmahajan156@gmail.com",
      phone: "",
      college: "Walchand Institute of Technology, Solapur",
      branch: "CSE",
      year: "3",
      studentId: "21CSE047",
      teamName: "",
      teamSize: "",
      teammates: [],
      isLeader: true,
      projectTitle: "",
      problemStatement: "",
      techStack: "",
      category: "",
      githubRepo: "",
      agreed: false,
    });
  }

  function validateStep(): boolean {
    if (step === 0) {
      if (
        !form.fullName.trim() ||
        !form.email.trim() ||
        !form.phone.trim() ||
        !form.year ||
        !form.branch
      ) {
        toast.error("Please fill in all required fields.");
        return false;
      }
    }
    if (step === 1) {
      if (!form.teamName.trim() || !form.teamSize) {
        toast.error("Team name and team size are required.");
        return false;
      }
    }
    if (step === 2) {
      if (
        !form.projectTitle.trim() ||
        !form.problemStatement.trim() ||
        !form.category
      ) {
        toast.error(
          "Project title, problem statement and category are required.",
        );
        return false;
      }
    }
    if (step === 3) {
      if (!form.agreed) {
        toast.error("Please confirm that all details are correct.");
        return false;
      }
    }
    return true;
  }

  function handleNext() {
    if (!validateStep()) return;
    if (step === 3) {
      handleSubmit();
    } else {
      setStep((s) => s + 1);
    }
  }

  function handleSubmit() {
    if (!hackathon) return;
    const id = generateRegId(hackathon.id.split("-")[0].toUpperCase());
    setRegId(id);
    setSubmitted(true);
    onRegistered(hackathon.id);
    toast.success(`Successfully registered for ${hackathon.name}!`);
  }

  function addTeammate() {
    if (!teammateInput.name.trim() || !teammateInput.email.trim()) {
      toast.error("Enter teammate name and email.");
      return;
    }
    set("teammates", [...form.teammates, { ...teammateInput }]);
    setTeammateInput({ name: "", email: "" });
  }

  function removeTeammate(idx: number) {
    set(
      "teammates",
      form.teammates.filter((_, i) => i !== idx),
    );
  }

  const techTags = form.techStack
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (!hackathon) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="max-w-2xl max-h-[92vh] overflow-y-auto p-0"
        data-ocid="hackathon.dialog"
      >
        {/* Header */}
        <div
          style={{
            background:
              "linear-gradient(135deg,#1e3a8a 0%,#3730a3 50%,#4f46e5 100%)",
          }}
          className="px-6 py-5 rounded-t-xl"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-indigo-200 text-xs font-semibold uppercase tracking-widest mb-1">
                Hackathon Registration
              </p>
              <h2 className="text-white font-bold text-lg leading-tight">
                {hackathon.name}
              </h2>
              <p className="text-indigo-200 text-xs mt-1">
                {hackathon.organizer} · {hackathon.dateRange}
              </p>
            </div>
            <button
              type="button"
              data-ocid="hackathon.close_button"
              onClick={handleClose}
              className="text-indigo-200 hover:text-white transition-colors mt-0.5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5">
          {submitted ? (
            // ── Success Screen ──
            <div
              data-ocid="hackathon.success_state"
              className="text-center py-6"
              style={{
                background: "linear-gradient(135deg,#f0fdf4,#dcfce7,#bbf7d0)",
                borderRadius: 16,
                border: "2px solid #86efac",
                padding: "2.5rem",
              }}
            >
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle2 className="w-9 h-9 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-green-800 mb-1">
                Registration Submitted!
              </h3>
              <p className="text-green-700 font-semibold text-sm mb-4">
                {hackathon.name}
              </p>
              <div className="bg-white/70 rounded-xl px-5 py-3 inline-block mb-4 border border-green-200">
                <p className="text-xs text-green-600 font-semibold">
                  Registration ID
                </p>
                <p className="text-xl font-bold text-green-800 tracking-widest">
                  {regId}
                </p>
              </div>
              <p className="text-green-700 text-xs">
                You will receive confirmation at{" "}
                <span className="font-semibold">{form.email}</span>
              </p>
              <p className="text-green-600 text-[11px] mt-2">
                Keep your Registration ID for future reference.
              </p>
              <Button
                className="mt-5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold"
                data-ocid="hackathon.close_button"
                onClick={() => {
                  resetModal();
                  onClose();
                }}
              >
                Done
              </Button>
            </div>
          ) : (
            <>
              <StepIndicator step={step} />

              {/* ── Step 1: Personal Details ── */}
              {step === 0 && (
                <div className="space-y-4" data-ocid="hackathon.panel">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">👤</span>
                    <h3 className="font-bold text-gray-900 text-base">
                      Personal Details
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <Label className="text-xs font-semibold text-gray-700">
                        Full Name *
                      </Label>
                      <Input
                        data-ocid="hackathon.input"
                        value={form.fullName}
                        onChange={(e) => set("fullName", e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <Label className="text-xs font-semibold text-gray-700">
                        Student ID *
                      </Label>
                      <Input
                        value={form.studentId}
                        onChange={(e) => set("studentId", e.target.value)}
                        placeholder="21CSE047"
                      />
                    </div>
                    <div className="space-y-1.5 col-span-2">
                      <Label className="text-xs font-semibold text-gray-700">
                        Email *
                      </Label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => set("email", e.target.value)}
                        placeholder="your@email.com"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-gray-700">
                        Phone *
                      </Label>
                      <Input
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        placeholder="+91 9XXXXXXXXX"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-gray-700">
                        College
                      </Label>
                      <Input
                        value={form.college}
                        readOnly
                        className="bg-gray-50 text-gray-500 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-gray-700">
                        Branch *
                      </Label>
                      <Select
                        value={form.branch}
                        onValueChange={(v) => set("branch", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {["CSE", "IT", "ECE", "EEE", "Mech", "Civil"].map(
                            (b) => (
                              <SelectItem key={b} value={b}>
                                {b}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-gray-700">
                        Year *
                      </Label>
                      <Select
                        value={form.year}
                        onValueChange={(v) => set("year", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Year" />
                        </SelectTrigger>
                        <SelectContent>
                          {["1", "2", "3", "4"].map((y) => (
                            <SelectItem key={y} value={y}>
                              Year {y}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 2: Team Details ── */}
              {step === 1 && (
                <div className="space-y-4" data-ocid="hackathon.panel">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">👥</span>
                    <h3 className="font-bold text-gray-900 text-base">
                      Team Details
                    </h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <Label className="text-xs font-semibold text-gray-700">
                        Team Name *
                      </Label>
                      <Input
                        data-ocid="hackathon.input"
                        value={form.teamName}
                        onChange={(e) => set("teamName", e.target.value)}
                        placeholder="e.g. Team Phoenix"
                      />
                    </div>
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                      <Label className="text-xs font-semibold text-gray-700">
                        Team Size *{" "}
                        <span className="text-gray-400 font-normal">
                          (max: {hackathon.teamSize})
                        </span>
                      </Label>
                      <Select
                        value={form.teamSize}
                        onValueChange={(v) => set("teamSize", v)}
                      >
                        <SelectTrigger data-ocid="hackathon.select">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          {["1", "2", "3", "4", "5", "6"].map((n) => (
                            <SelectItem key={n} value={n}>
                              {n} member{n !== "1" ? "s" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Team Leader Toggle */}
                  <div className="flex items-center gap-3 bg-indigo-50 rounded-xl px-4 py-3 border border-indigo-100">
                    <Checkbox
                      data-ocid="hackathon.checkbox"
                      checked={form.isLeader}
                      onCheckedChange={(v) => set("isLeader", !!v)}
                      id="leader-check"
                    />
                    <Label
                      htmlFor="leader-check"
                      className="text-sm font-semibold text-indigo-800 cursor-pointer"
                    >
                      👑 I am the Team Leader
                    </Label>
                  </div>

                  {/* Add Teammates */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-gray-700">
                      Add Teammates
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        className="flex-1"
                        placeholder="Teammate name"
                        value={teammateInput.name}
                        onChange={(e) =>
                          setTeammateInput((p) => ({
                            ...p,
                            name: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => e.key === "Enter" && addTeammate()}
                      />
                      <Input
                        className="flex-1"
                        placeholder="Teammate email"
                        value={teammateInput.email}
                        onChange={(e) =>
                          setTeammateInput((p) => ({
                            ...p,
                            email: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => e.key === "Enter" && addTeammate()}
                      />
                      <Button
                        type="button"
                        size="sm"
                        data-ocid="hackathon.secondary_button"
                        onClick={addTeammate}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    {form.teammates.length > 0 && (
                      <div
                        className="space-y-1.5 mt-2"
                        data-ocid="hackathon.list"
                      >
                        {form.teammates.map((tm, i) => (
                          <div
                            key={`${tm.email}-${i}`}
                            data-ocid={`hackathon.item.${i + 1}`}
                            className="flex items-center justify-between bg-indigo-50 rounded-lg px-3 py-2 border border-indigo-100"
                          >
                            <div>
                              <p className="text-sm font-semibold text-gray-800">
                                {tm.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {tm.email}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeTeammate(i)}
                              className="text-red-400 hover:text-red-600 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── Step 3: Project Idea ── */}
              {step === 2 && (
                <div className="space-y-4" data-ocid="hackathon.panel">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">💡</span>
                    <h3 className="font-bold text-gray-900 text-base">
                      Project Idea
                    </h3>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-700">
                      Project Title *
                    </Label>
                    <Input
                      data-ocid="hackathon.input"
                      value={form.projectTitle}
                      onChange={(e) => set("projectTitle", e.target.value)}
                      placeholder="e.g. AI-Powered Smart Irrigation System"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-700">
                      Problem Statement *
                    </Label>
                    <Textarea
                      data-ocid="hackathon.textarea"
                      value={form.problemStatement}
                      onChange={(e) => set("problemStatement", e.target.value)}
                      placeholder="Describe the problem your project solves..."
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-gray-700">
                      Tech Stack{" "}
                      <span className="text-gray-400">(comma-separated)</span>
                    </Label>
                    <Input
                      value={form.techStack}
                      onChange={(e) => set("techStack", e.target.value)}
                      placeholder="React, Python, TensorFlow, Firebase"
                    />
                    {techTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {techTags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-semibold border border-indigo-200"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-gray-700">
                        Category / Domain *
                      </Label>
                      <Select
                        value={form.category}
                        onValueChange={(v) => set("category", v)}
                      >
                        <SelectTrigger data-ocid="hackathon.select">
                          <SelectValue placeholder="Select domain" />
                        </SelectTrigger>
                        <SelectContent>
                          {hackathon.domainOptions.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-gray-700">
                        GitHub Repo URL{" "}
                        <span className="text-gray-400">(optional)</span>
                      </Label>
                      <Input
                        value={form.githubRepo}
                        onChange={(e) => set("githubRepo", e.target.value)}
                        placeholder="https://github.com/..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 4: Review & Submit ── */}
              {step === 3 && (
                <div className="space-y-4" data-ocid="hackathon.panel">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">✅</span>
                    <h3 className="font-bold text-gray-900 text-base">
                      Review & Submit
                    </h3>
                  </div>

                  {/* Summary Card */}
                  <div
                    className="rounded-xl border-2 border-indigo-200 overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg,#eff6ff,#dbeafe)",
                    }}
                  >
                    <div className="bg-indigo-600 px-4 py-2">
                      <p className="text-white text-xs font-bold uppercase tracking-wider">
                        Registration Summary
                      </p>
                    </div>
                    <div className="p-4 grid grid-cols-2 gap-x-6 gap-y-2 text-xs">
                      <div>
                        <span className="text-gray-500">Name:</span>{" "}
                        <span className="font-semibold text-gray-900">
                          {form.fullName}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">ID:</span>{" "}
                        <span className="font-semibold text-gray-900">
                          {form.studentId}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Email:</span>{" "}
                        <span className="font-semibold text-gray-900 break-all">
                          {form.email}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Phone:</span>{" "}
                        <span className="font-semibold text-gray-900">
                          {form.phone}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Branch:</span>{" "}
                        <span className="font-semibold text-gray-900">
                          {form.branch}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Year:</span>{" "}
                        <span className="font-semibold text-gray-900">
                          {form.year}
                        </span>
                      </div>
                    </div>
                    <div className="border-t border-indigo-100 px-4 py-3 space-y-1 text-xs">
                      <div>
                        <span className="text-gray-500">Team:</span>{" "}
                        <span className="font-semibold text-gray-900">
                          {form.teamName}
                        </span>{" "}
                        ({form.teamSize} members){" "}
                        {form.isLeader && (
                          <span className="text-amber-600 font-bold">
                            👑 Leader
                          </span>
                        )}
                      </div>
                      {form.teammates.length > 0 && (
                        <div>
                          <span className="text-gray-500">Teammates:</span>{" "}
                          {form.teammates.map((t) => t.name).join(", ")}
                        </div>
                      )}
                    </div>
                    <div className="border-t border-indigo-100 px-4 py-3 space-y-1 text-xs">
                      <div>
                        <span className="text-gray-500">Project:</span>{" "}
                        <span className="font-semibold text-gray-900">
                          {form.projectTitle}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Domain:</span>{" "}
                        <span className="font-semibold text-gray-900">
                          {form.category}
                        </span>
                      </div>
                      {techTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {techTags.map((t) => (
                            <span
                              key={t}
                              className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px] font-semibold"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Agreement */}
                  <div className="flex items-start gap-3 bg-amber-50 rounded-xl px-4 py-3 border border-amber-200">
                    <Checkbox
                      data-ocid="hackathon.checkbox"
                      id="agree-check"
                      checked={form.agreed}
                      onCheckedChange={(v) => set("agreed", !!v)}
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor="agree-check"
                      className="text-xs font-semibold text-amber-900 leading-relaxed cursor-pointer"
                    >
                      I confirm all details are correct and our team agrees to
                      the hackathon rules and code of conduct.
                    </Label>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  data-ocid="hackathon.cancel_button"
                  onClick={handleClose}
                  className="text-gray-600"
                >
                  Cancel
                </Button>
                <div className="flex items-center gap-2">
                  {step > 0 && (
                    <Button
                      variant="outline"
                      data-ocid="hackathon.secondary_button"
                      onClick={() => setStep((s) => s - 1)}
                    >
                      ← Back
                    </Button>
                  )}
                  <Button
                    data-ocid={
                      step === 3
                        ? "hackathon.submit_button"
                        : "hackathon.primary_button"
                    }
                    onClick={handleNext}
                    className={`${
                      step === 3
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    } text-white font-bold rounded-xl flex items-center gap-2`}
                  >
                    {step === 3 ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Submit Registration
                      </>
                    ) : (
                      <>
                        Next <ChevronRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────
// Hackathon Card
// ─────────────────────────────────────────────────────────
function HackathonCard({
  hackathon,
  index,
  isRegistered,
  onRegister,
}: {
  hackathon: Hackathon;
  index: number;
  isRegistered: boolean;
  onRegister: (h: Hackathon) => void;
}) {
  const grad = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  return (
    <Card
      className="rounded-2xl shadow-card overflow-hidden"
      style={{ background: grad.bg, borderLeft: `4px solid ${grad.border}` }}
    >
      <div
        className="h-1.5"
        style={{
          background: `linear-gradient(90deg,${grad.border},transparent)`,
        }}
      />
      <CardContent className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-sm text-gray-900 leading-tight">
              {hackathon.name}
            </h3>
            <p className="text-xs text-gray-600 mt-0.5">
              {hackathon.organizer}
            </p>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex-shrink-0 ${TYPE_COLORS[hackathon.type]}`}
          >
            {hackathon.type}
          </span>
        </div>

        {/* Info row */}
        <div className="flex flex-wrap gap-3 mb-3 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {hackathon.dateRange}
          </span>
          <span className="flex items-center gap-1">
            {hackathon.isOnline ? (
              <Globe className="w-3 h-3" />
            ) : (
              <MapPin className="w-3 h-3" />
            )}
            {hackathon.location}
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {hackathon.teamSize}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {hackathon.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-white/60 text-gray-700 rounded-full text-[10px] font-semibold border border-white/80"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-sm font-bold text-gray-900">
                {hackathon.prize}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-500 font-medium">
                Deadline:
              </span>
              <DeadlineBadge deadline={hackathon.deadline} />
            </div>
          </div>

          {isRegistered ? (
            <div className="flex items-center gap-1.5 bg-green-100 border border-green-300 text-green-700 text-xs font-bold px-3 py-2 rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5" /> Registered ✓
            </div>
          ) : (
            <Button
              size="sm"
              data-ocid="hackathon.primary_button"
              onClick={() => onRegister(hackathon)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center gap-1.5 shadow-md"
            >
              <Zap className="w-3.5 h-3.5" /> Register Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────
// Profile Modal
// ─────────────────────────────────────────────────────────
function ProfileModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (s: Student) => void;
}) {
  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const [type, setType] = useState<StudentType>("software");
  const [skillsRaw, setSkillsRaw] = useState("");
  const [bio, setBio] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");

  function handleSubmit() {
    if (!name.trim() || !branch || !year) {
      toast.error("Please fill in Name, Branch and Year.");
      return;
    }
    const skills = skillsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const avatar = name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    const newStudent: Student = {
      id: Date.now(),
      name: name.trim(),
      branch,
      year: Number(year),
      type,
      skills,
      projects: 0,
      github: github
        ? github.startsWith("http")
          ? github
          : `https://github.com/${github}`
        : "https://github.com",
      linkedin: linkedin
        ? linkedin.startsWith("http")
          ? linkedin
          : `https://linkedin.com/in/${linkedin}`
        : "https://linkedin.com",
      avatar,
      color: "from-indigo-500 to-blue-600",
      bio: bio.trim() || "NIRGRANTHA student",
      isMe: true,
    };
    onSave(newStudent);
    toast.success("Profile created! Your card has been added to the grid.");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="max-w-lg max-h-[90vh] overflow-y-auto"
        data-ocid="profile.dialog"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900">
            Create My Profile
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-800">
              Full Name *
            </Label>
            <Input
              data-ocid="profile.input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Arihant Mahajan"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-800">
                Branch *
              </Label>
              <Select value={branch} onValueChange={setBranch}>
                <SelectTrigger data-ocid="profile.select">
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {["CSE", "IT", "ECE", "EEE", "Mech", "Civil"].map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-800">
                Year *
              </Label>
              <Select value={year} onValueChange={setYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  {["1", "2", "3", "4"].map((y) => (
                    <SelectItem key={y} value={y}>
                      Year {y}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-800">Type</Label>
            <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1 w-fit">
              {(["software", "hardware"] as StudentType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  data-ocid="profile.toggle"
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    type === t
                      ? "bg-indigo-600 text-white shadow"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {t === "software" ? "💻 Software" : "🔧 Hardware"}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-800">
              Skills
            </Label>
            <Input
              value={skillsRaw}
              onChange={(e) => setSkillsRaw(e.target.value)}
              placeholder="React, Python, ML (comma-separated)"
            />
            {skillsRaw && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {skillsRaw
                  .split(",")
                  .filter(Boolean)
                  .map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium"
                    >
                      {s.trim()}
                    </span>
                  ))}
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-800">
              Short Bio
            </Label>
            <Textarea
              data-ocid="profile.textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell your teammates about yourself..."
              rows={2}
              className="resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-800">
                GitHub Username
              </Label>
              <Input
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="username"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-800">
                LinkedIn URL
              </Label>
              <Input
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="linkedin.com/in/you"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="profile.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            data-ocid="profile.submit_button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            Create Profile
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────
// Invite Modal
// ─────────────────────────────────────────────────────────
function InviteModal({
  student,
  teams,
  open,
  onClose,
  onInvite,
  onCreateAndInvite,
}: {
  student: Student | null;
  teams: Team[];
  open: boolean;
  onClose: () => void;
  onInvite: (teamId: number, student: Student) => void;
  onCreateAndInvite: (teamName: string, student: Student) => void;
}) {
  const [selectedTeam, setSelectedTeam] = useState("");
  const [newTeamName, setNewTeamName] = useState("");
  const [mode, setMode] = useState<"existing" | "new">("existing");

  function handleSend() {
    if (!student) return;
    if (mode === "existing") {
      if (!selectedTeam) {
        toast.error("Select a team.");
        return;
      }
      onInvite(Number(selectedTeam), student);
    } else {
      if (!newTeamName.trim()) {
        toast.error("Enter a team name.");
        return;
      }
      onCreateAndInvite(newTeamName.trim(), student);
    }
    toast.success(`Invite sent to ${student.name}!`);
    onClose();
    setSelectedTeam("");
    setNewTeamName("");
    setMode("existing");
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm" data-ocid="invite.dialog">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-gray-900">
            Invite {student?.name} to Team
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
            <button
              type="button"
              onClick={() => setMode("existing")}
              data-ocid="invite.toggle"
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${mode === "existing" ? "bg-blue-600 text-white shadow" : "text-gray-600"}`}
            >
              Existing Team
            </button>
            <button
              type="button"
              onClick={() => setMode("new")}
              data-ocid="invite.toggle"
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${mode === "new" ? "bg-blue-600 text-white shadow" : "text-gray-600"}`}
            >
              New Team
            </button>
          </div>
          {mode === "existing" ? (
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-800">
                Select Team
              </Label>
              {teams.length === 0 ? (
                <p className="text-xs text-gray-500 py-2">
                  No teams yet — switch to "New Team" to create one.
                </p>
              ) : (
                <Select value={selectedTeam} onValueChange={setSelectedTeam}>
                  <SelectTrigger data-ocid="invite.select">
                    <SelectValue placeholder="Choose a team" />
                  </SelectTrigger>
                  <SelectContent>
                    {teams.map((t) => (
                      <SelectItem key={t.id} value={String(t.id)}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label className="text-sm font-semibold text-gray-800">
                New Team Name
              </Label>
              <Input
                data-ocid="invite.input"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="e.g. Team Phoenix"
              />
            </div>
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="invite.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            data-ocid="invite.confirm_button"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Send Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────
// Create Team Modal
// ─────────────────────────────────────────────────────────
function CreateTeamModal({
  open,
  onClose,
  onSave,
}: { open: boolean; onClose: () => void; onSave: (t: Team) => void }) {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
  const [skillsRaw, setSkillsRaw] = useState("");

  function handleSubmit() {
    if (!name.trim()) {
      toast.error("Enter a team name.");
      return;
    }
    const skills = skillsRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const team: Team = {
      id: Date.now(),
      name: name.trim(),
      goal: goal.trim() || "General collaboration",
      skills,
      members: [],
    };
    onSave(team);
    toast.success(`Team "${name.trim()}" created!`);
    onClose();
    setName("");
    setGoal("");
    setSkillsRaw("");
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-md" data-ocid="team.dialog">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-gray-900">
            Create New Team
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-800">
              Team Name *
            </Label>
            <Input
              data-ocid="team.input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Team Invincible"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-800">
              Project / Hackathon Goal
            </Label>
            <Textarea
              data-ocid="team.textarea"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="What are you building?"
              rows={2}
              className="resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm font-semibold text-gray-800">
              Required Skills
            </Label>
            <Input
              value={skillsRaw}
              onChange={(e) => setSkillsRaw(e.target.value)}
              placeholder="React, Python, IoT (comma-separated)"
            />
            {skillsRaw && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {skillsRaw
                  .split(",")
                  .filter(Boolean)
                  .map((s) => (
                    <span
                      key={s}
                      className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-semibold"
                    >
                      {s.trim()}
                    </span>
                  ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="team.cancel_button"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            data-ocid="team.submit_button"
            className="bg-blue-700 hover:bg-blue-800 text-white"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Create Team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────
// Manage Team Modal
// ─────────────────────────────────────────────────────────
function ManageTeamModal({
  team,
  open,
  onClose,
  onRemoveMember,
}: {
  team: Team | null;
  open: boolean;
  onClose: () => void;
  onRemoveMember: (teamId: number, memberId: number) => void;
}) {
  if (!team) return null;
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-sm" data-ocid="manage.dialog">
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-gray-900">
            Manage: {team.name}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-2">
          <p className="text-xs text-gray-500 font-medium">Goal: {team.goal}</p>
          {team.members.length === 0 ? (
            <p className="text-sm text-gray-400 py-3 text-center">
              No members yet — send invites from the student grid.
            </p>
          ) : (
            <div className="space-y-2">
              {team.members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-lg px-3 py-2"
                  style={{
                    background: "linear-gradient(135deg,#eff6ff,#dbeafe)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                      {m.avatar}
                    </div>
                    <span className="text-sm font-semibold text-gray-800">
                      {m.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        m.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {m.status === "confirmed" ? "Confirmed" : "Pending"}
                    </span>
                    <button
                      type="button"
                      data-ocid="manage.delete_button"
                      onClick={() => onRemoveMember(team.id, m.id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                      title="Remove member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="manage.close_button"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────────────
// Student Card
// ─────────────────────────────────────────────────────────
function StudentCard({
  student,
  onInvite,
}: { student: Student; onInvite: (s: Student) => void }) {
  return (
    <Card
      className="rounded-2xl shadow-card card-hover overflow-hidden relative"
      style={{
        background:
          "linear-gradient(135deg,#dbeafe 0%,#bfdbfe 60%,#93c5fd 100%)",
        borderLeft: "4px solid #2563eb",
      }}
    >
      {student.isMe && (
        <span className="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10">
          YOU
        </span>
      )}
      <div className={`h-1.5 bg-gradient-to-r ${student.color}`} />
      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div
            className={`w-11 h-11 rounded-xl bg-gradient-to-br ${student.color} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}
          >
            {student.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-gray-900">
              {student.name}
            </h3>
            <p className="text-xs text-gray-600">
              {student.branch} · Year {student.year}
            </p>
          </div>
        </div>
        <p className="text-xs text-gray-600 mb-3 leading-relaxed">
          {student.bio}
        </p>
        <div className="flex flex-wrap gap-1 mb-3">
          {student.skills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-[10px] font-semibold"
            >
              {skill}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <Github className="w-3 h-3" /> {student.projects} projects
          </span>
          <div className="flex items-center gap-2">
            <a
              href={student.github}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-800 transition-colors"
            >
              <SiGithub className="w-3.5 h-3.5" />
            </a>
            <a
              href={student.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              <SiLinkedin className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
        {!student.isMe && (
          <Button
            size="sm"
            data-ocid="student.invite_button"
            onClick={() => onInvite(student)}
            className="w-full h-8 text-xs rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5"
          >
            <UserPlus className="w-3.5 h-3.5" /> Invite to Team
          </Button>
        )}
        {student.isMe && (
          <div className="w-full h-8 text-xs rounded-lg bg-indigo-100 text-indigo-700 font-semibold flex items-center justify-center gap-1">
            ✓ Your Profile
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────
// Organize Hackathon Wizard
// ─────────────────────────────────────────────────────────

const WIT_FACULTY = [
  {
    id: 1,
    name: "Prof. S.R. Patil",
    dept: "CSE",
    expertise: "Algorithms & ML",
  },
  {
    id: 2,
    name: "Prof. M.K. Desai",
    dept: "IT",
    expertise: "Web Technologies",
  },
  {
    id: 3,
    name: "Dr. A.V. Kulkarni",
    dept: "CSE",
    expertise: "AI & Data Science",
  },
  {
    id: 4,
    name: "Prof. R.S. Jadhav",
    dept: "E&TC",
    expertise: "IoT & Embedded",
  },
  { id: 5, name: "Dr. P.B. Shinde", dept: "Mech", expertise: "Robotics & CAD" },
  { id: 6, name: "Prof. N.V. More", dept: "CSE", expertise: "Cybersecurity" },
  {
    id: 7,
    name: "Dr. S.K. Wagh",
    dept: "Civil",
    expertise: "Smart Infrastructure",
  },
  {
    id: 8,
    name: "Prof. A.R. Bhosale",
    dept: "IT",
    expertise: "Cloud & DevOps",
  },
];

const WIT_VENUES = [
  "Main Auditorium",
  "Seminar Hall A",
  "Seminar Hall B",
  "CSE Lab Block",
  "Innovation Hub",
];

const DOMAINS = [
  "AI/ML",
  "Web Dev",
  "Cybersecurity",
  "IoT",
  "Open Innovation",
  "Social Impact",
];

interface OrganizedHackathon {
  id: string;
  name: string;
  domain: string;
  date: string;
  venue: string;
  maxTeams: number;
  registrations: number;
  status: "Draft" | "Live" | "Completed";
  fee: number;
  judgesConfirmed: number;
  judgesTotal: number;
}

const MOCK_ORGANIZED: OrganizedHackathon[] = [
  {
    id: "WIT-HACK-2025-001",
    name: "CodeStorm 2025",
    domain: "Web Dev",
    date: "2025-11-18",
    venue: "Innovation Hub",
    maxTeams: 30,
    registrations: 22,
    status: "Completed",
    fee: 200,
    judgesConfirmed: 3,
    judgesTotal: 3,
  },
  {
    id: "WIT-HACK-2026-002",
    name: "AI Fusion Hackathon",
    domain: "AI/ML",
    date: "2026-03-14",
    venue: "Seminar Hall A",
    maxTeams: 25,
    registrations: 11,
    status: "Live",
    fee: 300,
    judgesConfirmed: 2,
    judgesTotal: 3,
  },
];

function EarningsCalculator({
  fee,
  maxTeams,
}: { fee: number; maxTeams: number }) {
  const [teams, setTeams] = useState(20);
  const gross = fee * teams;
  const platformFee = Math.round(gross * 0.1);
  const net = gross - platformFee;

  return (
    <div
      className="rounded-2xl p-5 border border-emerald-200 space-y-4"
      style={{ background: "linear-gradient(135deg,#ecfdf5,#d1fae5,#a7f3d0)" }}
    >
      <h4 className="font-bold text-emerald-900 flex items-center gap-2">
        <IndianRupee className="w-4 h-4" /> Live Earnings Calculator
      </h4>
      <div className="space-y-2">
        <Label className="text-emerald-800 font-semibold text-xs">
          Estimated teams registering:{" "}
          <span className="text-emerald-600 text-sm font-bold">{teams}</span>
        </Label>
        <input
          type="range"
          min={1}
          max={maxTeams || 50}
          value={teams}
          onChange={(e) => setTeams(Number(e.target.value))}
          className="w-full accent-emerald-500"
        />
        <div className="flex justify-between text-xs text-emerald-700">
          <span>1 team</span>
          <span>{maxTeams || 50} teams</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            label: "Gross Collected",
            value: `₹${gross.toLocaleString("en-IN")}`,
            color: "text-emerald-800",
          },
          {
            label: "Platform Fee (10%)",
            value: `₹${platformFee.toLocaleString("en-IN")}`,
            color: "text-orange-600",
          },
          {
            label: "Your Earnings",
            value: `₹${net.toLocaleString("en-IN")}`,
            color: "text-emerald-700 font-extrabold text-lg",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-white/70 rounded-xl p-3 text-center shadow-sm border border-emerald-100"
          >
            <p className="text-xs text-gray-500 mb-1">{item.label}</p>
            <p className={`font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>
      <p className="text-xs text-emerald-700 italic">
        * Earnings are based on {teams} team(s) × ₹{fee}/team. Actual amounts
        may vary.
      </p>
    </div>
  );
}

function OrganizeWizard({
  onPublish,
  initialName = "",
}: { onPublish: (h: OrganizedHackathon) => void; initialName?: string }) {
  const [step, setStep] = useState(1);
  const TOTAL_STEPS = 4;

  // Step 1
  const [name, setName] = useState(initialName);
  const [domain, setDomain] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [venue, setVenue] = useState("");
  const [maxTeams, setMaxTeams] = useState(20);
  const [problemStatement, setProblemStatement] = useState("");

  // Step 2
  const [invitedJudges, setInvitedJudges] = useState<Set<number>>(new Set());

  // Step 3
  const [fee, setFee] = useState(0);
  const [prize1, setPrize1] = useState("");
  const [prize2, setPrize2] = useState("");
  const [prize3, setPrize3] = useState("");
  const [payMode, setPayMode] = useState<"cash" | "online">("cash");

  // Step 4 published
  const [published, setPublished] = useState(false);
  const [publishedId, setPublishedId] = useState("");

  function canNext() {
    if (step === 1) return name.trim() && domain && date && venue;
    if (step === 2) return invitedJudges.size >= 2;
    if (step === 3) return true;
    return false;
  }

  function toggleJudge(id: number) {
    setInvitedJudges((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handlePublish() {
    const hackId = `WIT-HACK-2026-${String(Math.floor(Math.random() * 900) + 100)}`;
    setPublishedId(hackId);
    setPublished(true);
    const newH: OrganizedHackathon = {
      id: hackId,
      name,
      domain,
      date,
      venue,
      maxTeams,
      registrations: 0,
      status: "Live",
      fee,
      judgesConfirmed: invitedJudges.size,
      judgesTotal: invitedJudges.size,
    };
    onPublish(newH);
    toast.success(`🎉 Hackathon "${name}" is now live!`);
  }

  const stepLabels = [
    "Event Details",
    "Assign Judges",
    "Registration & Prizes",
    "Review & Publish",
  ];

  if (published) {
    return (
      <div
        className="rounded-2xl p-8 border-2 border-emerald-400 text-center space-y-4"
        style={{ background: "linear-gradient(135deg,#ecfdf5,#d1fae5)" }}
        data-ocid="organize.success_state"
      >
        <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-200">
          <CheckCircle2 className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-extrabold text-emerald-900">
          Hackathon Published! 🎉
        </h3>
        <p className="text-emerald-700 font-medium">
          Your hackathon is now live. Students can register using the{" "}
          <strong>Find Hackathons</strong> tab.
        </p>
        <div className="bg-white/80 rounded-xl p-4 inline-block shadow-sm border border-emerald-200">
          <p className="text-xs text-gray-500 mb-1">Unique Hackathon ID</p>
          <p className="text-lg font-mono font-bold text-emerald-800">
            {publishedId}
          </p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="border-emerald-400 text-emerald-700 gap-2"
            onClick={() => {
              navigator.clipboard?.writeText(
                `Join my hackathon: ${publishedId}`,
              );
              toast.success("Share link copied!");
            }}
            data-ocid="organize.secondary_button"
          >
            <Share2 className="w-4 h-4" /> Copy Share Link
          </Button>
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            onClick={() => {
              setPublished(false);
              setStep(1);
              setName("");
              setDomain("");
              setDate("");
              setVenue("");
              setMaxTeams(20);
              setProblemStatement("");
              setInvitedJudges(new Set());
              setFee(0);
              setPrize1("");
              setPrize2("");
              setPrize3("");
              setPayMode("cash");
            }}
            data-ocid="organize.primary_button"
          >
            <Plus className="w-4 h-4" /> Organize Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-ocid="organize.panel">
      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-gray-700">
            Step {step} of {TOTAL_STEPS}:{" "}
            <span className="text-emerald-700">{stepLabels[step - 1]}</span>
          </p>
          <span className="text-xs text-gray-500">
            {Math.round((step / TOTAL_STEPS) * 100)}% complete
          </span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full transition-all duration-500"
            style={{
              width: `${(step / TOTAL_STEPS) * 100}%`,
              background: "linear-gradient(90deg,#10b981,#34d399)",
            }}
          />
        </div>
        <div className="grid grid-cols-4 gap-2">
          {stepLabels.map((label, i) => (
            <div
              key={label}
              className={`text-center text-xs font-semibold py-1 rounded-lg transition-all ${i + 1 === step ? "bg-emerald-500 text-white shadow-md" : i + 1 < step ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-400"}`}
            >
              {i + 1}. {label.split(" ")[0]}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div
          className="rounded-2xl border border-emerald-200 p-6 space-y-5"
          style={{ background: "linear-gradient(135deg,#f0fdf4,#ecfdf5)" }}
          data-ocid="organize.panel"
        >
          <h3 className="font-bold text-emerald-900 text-lg flex items-center gap-2">
            <Calendar className="w-5 h-5" /> Event Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="font-semibold text-gray-700">
                Hackathon Name *
              </Label>
              <Input
                placeholder="e.g. InnoSpark 2026"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-emerald-200 focus:border-emerald-400"
                data-ocid="organize.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-semibold text-gray-700">
                Theme / Domain *
              </Label>
              <Select value={domain} onValueChange={setDomain}>
                <SelectTrigger
                  className="border-emerald-200"
                  data-ocid="organize.select"
                >
                  <SelectValue placeholder="Select domain" />
                </SelectTrigger>
                <SelectContent>
                  {DOMAINS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="font-semibold text-gray-700">Date *</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-emerald-200 focus:border-emerald-400"
                data-ocid="organize.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-semibold text-gray-700">Time</Label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="border-emerald-200 focus:border-emerald-400"
                data-ocid="organize.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-semibold text-gray-700">Venue *</Label>
              <Select value={venue} onValueChange={setVenue}>
                <SelectTrigger
                  className="border-emerald-200"
                  data-ocid="organize.select"
                >
                  <SelectValue placeholder="Select venue" />
                </SelectTrigger>
                <SelectContent>
                  {WIT_VENUES.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="font-semibold text-gray-700">
                Max Teams (5–100)
              </Label>
              <Input
                type="number"
                min={5}
                max={100}
                value={maxTeams}
                onChange={(e) => setMaxTeams(Number(e.target.value))}
                className="border-emerald-200 focus:border-emerald-400"
                data-ocid="organize.input"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="font-semibold text-gray-700">
              Problem Statement
            </Label>
            <Textarea
              placeholder="Describe the challenge participants will solve..."
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              rows={3}
              className="border-emerald-200 focus:border-emerald-400 resize-none"
              data-ocid="organize.textarea"
            />
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div
          className="rounded-2xl border border-emerald-200 p-6 space-y-5"
          style={{ background: "linear-gradient(135deg,#f0fdf4,#ecfdf5)" }}
          data-ocid="organize.panel"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-emerald-900 text-lg flex items-center gap-2">
              <GraduationCap className="w-5 h-5" /> Assign Judges
            </h3>
            <span
              className={`text-sm font-bold px-3 py-1 rounded-full ${invitedJudges.size >= 2 ? "bg-emerald-100 text-emerald-700 border border-emerald-300" : "bg-orange-100 text-orange-700 border border-orange-300"}`}
            >
              {invitedJudges.size} / 2+ selected
            </span>
          </div>
          {invitedJudges.size < 2 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-700 font-medium">
              ⚠️ Please invite at least 2 judges to proceed.
            </div>
          )}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            data-ocid="organize.panel"
          >
            {WIT_FACULTY.map((f) => {
              const invited = invitedJudges.has(f.id);
              return (
                <button
                  type="button"
                  key={f.id}
                  className={`w-full rounded-xl border-2 p-4 flex items-center justify-between gap-3 transition-all cursor-pointer backdrop-blur-sm text-left ${invited ? "border-emerald-400 bg-emerald-50/80 shadow-md shadow-emerald-100" : "border-gray-200 bg-white/80 hover:border-emerald-300 hover:shadow-md"}`}
                  onClick={() => toggleJudge(f.id)}
                  data-ocid="organize.toggle"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${invited ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-600"}`}
                    >
                      {f.name.split(" ").slice(-1)[0][0]}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 text-sm">
                        {f.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {f.dept} · {f.expertise}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`text-xs font-bold px-2.5 py-1 rounded-full border transition-all ${invited ? "bg-emerald-500 text-white border-emerald-500" : "bg-gray-100 text-gray-500 border-gray-200"}`}
                  >
                    {invited ? "✓ Invited" : "Invite"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div
          className="rounded-2xl border border-emerald-200 p-6 space-y-6"
          style={{ background: "linear-gradient(135deg,#f0fdf4,#ecfdf5)" }}
          data-ocid="organize.panel"
        >
          <h3 className="font-bold text-emerald-900 text-lg flex items-center gap-2">
            <IndianRupee className="w-5 h-5" /> Registration & Prizes
          </h3>

          {/* Fee selection */}
          <div className="space-y-3">
            <Label className="font-bold text-gray-700">
              Registration Fee per Team
            </Label>
            <div className="flex flex-wrap gap-3">
              {[0, 100, 200, 300, 500].map((f) => (
                <button
                  type="button"
                  key={f}
                  onClick={() => setFee(f)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${fee === f ? "bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-200" : "bg-white text-gray-700 border-gray-200 hover:border-emerald-300"}`}
                  data-ocid="organize.toggle"
                >
                  {f === 0 ? "Free" : `₹${f}`}
                </button>
              ))}
            </div>
          </div>

          {fee > 0 && <EarningsCalculator fee={fee} maxTeams={maxTeams} />}

          {/* Prizes */}
          <div className="space-y-3">
            <Label className="font-bold text-gray-700 flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" /> Prize Pool (optional)
            </Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: "🥇 1st Place",
                  value: prize1,
                  setter: setPrize1,
                  placeholder: "₹5,000",
                },
                {
                  label: "🥈 2nd Place",
                  value: prize2,
                  setter: setPrize2,
                  placeholder: "₹3,000",
                },
                {
                  label: "🥉 3rd Place",
                  value: prize3,
                  setter: setPrize3,
                  placeholder: "₹1,500",
                },
              ].map((p) => (
                <div key={p.label} className="space-y-1.5">
                  <Label className="text-xs font-semibold text-gray-600">
                    {p.label}
                  </Label>
                  <Input
                    placeholder={p.placeholder}
                    value={p.value}
                    onChange={(e) => p.setter(e.target.value)}
                    className="border-emerald-200"
                    data-ocid="organize.input"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Payment mode */}
          <div className="space-y-2">
            <Label className="font-bold text-gray-700">
              Payment Collection Mode
            </Label>
            <div className="flex gap-3">
              {(["cash", "online"] as const).map((mode) => (
                <button
                  type="button"
                  key={mode}
                  onClick={() => setPayMode(mode)}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-all capitalize ${payMode === mode ? "bg-emerald-500 text-white border-emerald-500 shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"}`}
                  data-ocid="organize.toggle"
                >
                  {mode === "cash"
                    ? "💵 Cash at Venue"
                    : "📱 Online (Razorpay)"}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4 — Review & Publish */}
      {step === 4 && (
        <div
          className="rounded-2xl border border-emerald-200 p-6 space-y-5"
          style={{ background: "linear-gradient(135deg,#f0fdf4,#ecfdf5)" }}
          data-ocid="organize.panel"
        >
          <h3 className="font-bold text-emerald-900 text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" /> Review & Publish
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Hackathon Name", value: name },
              { label: "Domain", value: domain },
              { label: "Date & Time", value: `${date} at ${time}` },
              { label: "Venue", value: venue },
              { label: "Max Teams", value: String(maxTeams) },
              {
                label: "Registration Fee",
                value: fee === 0 ? "Free" : `₹${fee}/team`,
              },
              {
                label: "Judges Invited",
                value: `${invitedJudges.size} faculty members`,
              },
              {
                label: "Payment Mode",
                value:
                  payMode === "cash" ? "Cash at Venue" : "Online (Razorpay)",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/80 rounded-xl p-3 border border-emerald-100 shadow-sm"
              >
                <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                <p className="font-bold text-gray-800 text-sm">
                  {item.value || "—"}
                </p>
              </div>
            ))}
          </div>
          {problemStatement && (
            <div className="bg-white/80 rounded-xl p-3 border border-emerald-100">
              <p className="text-xs text-gray-500 mb-0.5">Problem Statement</p>
              <p className="text-sm text-gray-700">{problemStatement}</p>
            </div>
          )}
          {(prize1 || prize2 || prize3) && (
            <div className="bg-amber-50/80 rounded-xl p-3 border border-amber-200">
              <p className="text-xs font-bold text-amber-700 mb-2">
                🏆 Prize Pool
              </p>
              <div className="flex gap-4 text-sm">
                {prize1 && (
                  <span className="font-bold text-amber-800">🥇 {prize1}</span>
                )}
                {prize2 && (
                  <span className="font-bold text-amber-700">🥈 {prize2}</span>
                )}
                {prize3 && (
                  <span className="font-bold text-amber-600">🥉 {prize3}</span>
                )}
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 pt-2">
            <Button
              className="flex-1 py-3 font-bold text-white text-base shadow-lg shadow-emerald-200 transition-all hover:scale-105"
              style={{
                background: "linear-gradient(135deg,#059669,#10b981,#34d399)",
              }}
              onClick={handlePublish}
              data-ocid="organize.submit_button"
            >
              <Sparkles className="w-4 h-4 mr-2" /> Publish Hackathon 🚀
            </Button>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="border-emerald-300 text-emerald-700 gap-2"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          data-ocid="organize.secondary_button"
        >
          ← Back
        </Button>
        {step < TOTAL_STEPS && (
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 px-6"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canNext()}
            data-ocid="organize.primary_button"
          >
            Next Step →
          </Button>
        )}
      </div>
    </div>
  );
}

function MyOrganizedEvents({
  events,
  onAddEvent,
}: { events: OrganizedHackathon[]; onAddEvent: () => void }) {
  const totalEarnings = events.reduce(
    (sum, e) => sum + e.fee * e.registrations,
    0,
  );
  const platformCut = Math.round(totalEarnings * 0.1);
  const netEarnings = totalEarnings - platformCut;

  const statusColors: Record<OrganizedHackathon["status"], string> = {
    Draft: "bg-gray-100 text-gray-600 border-gray-300",
    Live: "bg-emerald-100 text-emerald-700 border-emerald-300",
    Completed: "bg-blue-100 text-blue-700 border-blue-300",
  };

  return (
    <div className="space-y-5" data-ocid="myevents.panel">
      {/* Earnings Summary */}
      <div
        className="rounded-2xl p-6 border-2 border-emerald-300 shadow-lg shadow-emerald-100"
        style={{
          background: "linear-gradient(135deg,#065f46,#059669,#10b981)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-100 text-sm font-semibold">
              Total Earnings This Semester
            </p>
            <p className="text-white text-3xl font-extrabold mt-1">
              ₹{netEarnings.toLocaleString("en-IN")}
            </p>
            <p className="text-emerald-200 text-xs mt-1">
              After 10% platform fee · {events.length} event(s)
            </p>
          </div>
          <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
            <IndianRupee className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>

      {events.length === 0 ? (
        <div
          className="rounded-2xl border-2 border-dashed border-emerald-200 p-10 text-center"
          data-ocid="myevents.empty_state"
        >
          <Trophy className="w-12 h-12 text-emerald-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">
            No organized hackathons yet.
          </p>
          <Button
            size="sm"
            className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={onAddEvent}
            data-ocid="myevents.primary_button"
          >
            <Plus className="w-4 h-4 mr-1" /> Organize Your First Hackathon
          </Button>
        </div>
      ) : (
        <div className="space-y-4" data-ocid="myevents.list">
          {events.map((event, idx) => (
            <div
              key={event.id}
              className="rounded-2xl border-2 border-emerald-200 p-5 bg-white/90 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all"
              data-ocid={`myevents.item.${idx + 1}`}
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-extrabold text-gray-900 text-base">
                      {event.name}
                    </h4>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${statusColors[event.status]}`}
                    >
                      {event.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {event.domain} · {event.venue} · {event.date}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-emerald-300 text-emerald-700 gap-1.5 text-xs"
                    data-ocid={`myevents.edit_button.${idx + 1}`}
                  >
                    <Edit className="w-3 h-3" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-blue-300 text-blue-700 gap-1.5 text-xs"
                    data-ocid={`myevents.secondary_button.${idx + 1}`}
                  >
                    <Eye className="w-3 h-3" /> View Details
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                {[
                  {
                    label: "Registrations",
                    value: `${event.registrations}/${event.maxTeams}`,
                    icon: <Users className="w-3.5 h-3.5 text-blue-500" />,
                    color: "text-blue-700",
                  },
                  {
                    label: "Earnings",
                    value:
                      event.fee === 0
                        ? "Free Event"
                        : `₹${(event.fee * event.registrations * 0.9).toLocaleString("en-IN")}`,
                    icon: (
                      <IndianRupee className="w-3.5 h-3.5 text-emerald-500" />
                    ),
                    color: "text-emerald-700",
                  },
                  {
                    label: "Judges",
                    value: `${event.judgesConfirmed}/${event.judgesTotal} confirmed`,
                    icon: (
                      <GraduationCap className="w-3.5 h-3.5 text-purple-500" />
                    ),
                    color: "text-purple-700",
                  },
                  {
                    label: "Fee/Team",
                    value: event.fee === 0 ? "Free" : `₹${event.fee}`,
                    icon: <Star className="w-3.5 h-3.5 text-amber-500" />,
                    color: "text-amber-700",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-gray-50 rounded-xl p-3 border border-gray-100"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      {stat.icon}
                      <span className="text-xs text-gray-500">
                        {stat.label}
                      </span>
                    </div>
                    <p className={`font-bold text-sm ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Progress bar for registrations */}
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Registration Progress</span>
                  <span>
                    {Math.round((event.registrations / event.maxTeams) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, (event.registrations / event.maxTeams) * 100)}%`,
                      background: "linear-gradient(90deg,#10b981,#34d399)",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────
export default function SkillBasedTeams() {
  const [mainTab, setMainTab] = useState<"teammates" | "hackathons">(
    "teammates",
  );
  const [activeType, setActiveType] = useState<StudentType>("software");
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<Student[]>(SEED_STUDENTS);
  const [teams, setTeams] = useState<Team[]>([]);
  const [registeredHackathons, setRegisteredHackathons] = useState<Set<string>>(
    new Set(),
  );
  const [regTarget, setRegTarget] = useState<Hackathon | null>(null);
  const [hackathonTab, setHackathonTab] = useState<
    "find" | "organize" | "myevents" | "unstop"
  >("find");
  const [unstopUrl, setUnstopUrl] = useState("");
  const [unstopConnected, setUnstopConnected] = useState(false);
  const [unstopName, setUnstopName] = useState("");
  const [unstopRating, setUnstopRating] = useState("");
  const [unstopCompetitions, setUnstopCompetitions] = useState("");
  const [unstopRank, setUnstopRank] = useState("");
  const [unstopStatsSaved, setUnstopStatsSaved] = useState(false);
  const [unstopStatsForm, setUnstopStatsForm] = useState({
    rating: "",
    competitions: "",
    rank: "",
  });
  const [organizedEvents, setOrganizedEvents] =
    useState<OrganizedHackathon[]>(MOCK_ORGANIZED);

  // HOD Permission for organizing hackathons
  const [hodStatus, setHodStatus] = useState<
    "idle" | "pending" | "approved" | "rejected"
  >("idle");
  const [hodForm, setHodForm] = useState({
    title: "",
    description: "",
    participants: "",
    proposedDate: "",
  });
  const [hodSubmitting, setHodSubmitting] = useState(false);

  // Custom hackathons added by users
  const [customHackathons, setCustomHackathons] = useState<Hackathon[]>([]);
  const [addHackathonOpen, setAddHackathonOpen] = useState(false);
  const [newHack, setNewHack] = useState({
    title: "",
    domain: "",
    date: "",
    mode: "Online" as "Online" | "Offline" | "Hybrid",
    prize: "",
    fee: "",
    description: "",
    link: "",
  });

  // Modal states
  const [profileOpen, setProfileOpen] = useState(false);
  const [createTeamOpen, setCreateTeamOpen] = useState(false);
  const [inviteTarget, setInviteTarget] = useState<Student | null>(null);
  const [manageTarget, setManageTarget] = useState<Team | null>(null);
  const [manageOpen, setManageOpen] = useState(false);
  const [integratedProfile, setIntegratedProfile] =
    useState<GeneratedHackathonProfile | null>(() =>
      generateHackathonProfile(getStudentTalentProfileStore()),
    );

  const myProfile = students.find((s) => s.isMe);

  useEffect(() => {
    const refresh = () => {
      setIntegratedProfile(generateHackathonProfile(getStudentTalentProfileStore()));
    };

    refresh();
    return subscribeStudentTalentProfile(refresh);
  }, []);

  useEffect(() => {
    if (!integratedProfile) {
      return;
    }

    const syncedStudent = mapIntegratedProfileToStudent(integratedProfile);
    setStudents((prev) => [...prev.filter((student) => !student.isMe), syncedStudent]);
    setActiveType(integratedProfile.primaryTrack);
  }, [integratedProfile]);

  const filtered = students.filter((s) => {
    const matchType = s.type === activeType;
    const matchSearch =
      !searchQuery ||
      s.skills.some((sk) =>
        sk.toLowerCase().includes(searchQuery.toLowerCase()),
      ) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  const recommendedHackathons = integratedProfile
    ? [...HACKATHONS, ...customHackathons]
        .filter((hackathon) => {
          const haystack = [
            ...hackathon.tags,
            ...hackathon.domainOptions,
            hackathon.name,
          ]
            .join(" ")
            .toLowerCase();

          return integratedProfile.recommendedDomains.some((domain) =>
            haystack.includes(domain.toLowerCase()),
          );
        })
        .slice(0, 3)
    : [];

  function handleSaveProfile(student: Student) {
    setStudents((prev) => [...prev.filter((s) => !s.isMe), student]);
    setActiveType(student.type);
  }

  function handleCreateTeam(team: Team) {
    setTeams((prev) => [...prev, team]);
  }

  function handleInvite(teamId: number, student: Student) {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? {
              ...t,
              members: t.members.some((m) => m.id === student.id)
                ? t.members
                : [
                    ...t.members,
                    {
                      id: student.id,
                      name: student.name,
                      avatar: student.avatar,
                      status: "pending" as const,
                    },
                  ],
            }
          : t,
      ),
    );
  }

  function handleCreateAndInvite(teamName: string, student: Student) {
    const newTeam: Team = {
      id: Date.now(),
      name: teamName,
      goal: "General collaboration",
      skills: [],
      members: [
        {
          id: student.id,
          name: student.name,
          avatar: student.avatar,
          status: "pending",
        },
      ],
    };
    setTeams((prev) => [...prev, newTeam]);
  }

  function handleRemoveMember(teamId: number, memberId: number) {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? { ...t, members: t.members.filter((m) => m.id !== memberId) }
          : t,
      ),
    );
    toast.success("Member removed from team.");
  }

  function handleDeleteTeam(teamId: number) {
    setTeams((prev) => prev.filter((t) => t.id !== teamId));
    toast.success("Team deleted.");
  }

  function handleRegistered(hackathonId: string) {
    setRegisteredHackathons((prev) => new Set([...prev, hackathonId]));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Modals */}
      <ProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        onSave={handleSaveProfile}
      />
      <CreateTeamModal
        open={createTeamOpen}
        onClose={() => setCreateTeamOpen(false)}
        onSave={handleCreateTeam}
      />
      <InviteModal
        student={inviteTarget}
        teams={teams}
        open={!!inviteTarget}
        onClose={() => setInviteTarget(null)}
        onInvite={handleInvite}
        onCreateAndInvite={handleCreateAndInvite}
      />
      <ManageTeamModal
        team={manageTarget}
        open={manageOpen}
        onClose={() => {
          setManageOpen(false);
          setManageTarget(null);
        }}
        onRemoveMember={handleRemoveMember}
      />
      <HackathonRegistrationModal
        hackathon={regTarget}
        open={!!regTarget}
        onClose={() => setRegTarget(null)}
        onRegistered={(id) => {
          handleRegistered(id);
          setRegTarget(null);
        }}
      />

      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden">
        <div
          style={{
            background:
              "linear-gradient(135deg,#1e3a8a 0%,#1d4ed8 35%,#2563eb 65%,#3b82f6 100%)",
          }}
          className="absolute inset-0"
        />
        <div className="relative px-8 py-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-white mb-1">
              Skill-Based Team Selection
            </h1>
            <p className="text-white/80 text-sm">
              Find teammates · Register for Hackathons · Build together
            </p>
          </div>
          <Button
            data-ocid="header.primary_button"
            onClick={() => setProfileOpen(true)}
            className="bg-white text-indigo-700 hover:bg-indigo-50 font-bold shadow-lg rounded-xl flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            {myProfile ? "Edit Profile" : "Create My Profile"}
          </Button>
        </div>
      </div>

      {/* ── Main Submenu Tabs ── */}
      <div className="flex items-center gap-2 bg-white/60 rounded-2xl p-1.5 border border-gray-100 shadow-sm w-fit">
        <button
          type="button"
          data-ocid="main.tab"
          onClick={() => setMainTab("teammates")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
            mainTab === "teammates"
              ? "text-white shadow-md"
              : "text-gray-600 hover:text-gray-900"
          }`}
          style={
            mainTab === "teammates"
              ? { background: "linear-gradient(135deg,#1d4ed8,#3b82f6)" }
              : {}
          }
        >
          <Users className="w-4 h-4" /> Find Teammates
        </button>
        <button
          type="button"
          data-ocid="main.tab"
          onClick={() => setMainTab("hackathons")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
            mainTab === "hackathons"
              ? "text-white shadow-md"
              : "text-gray-600 hover:text-gray-900"
          }`}
          style={
            mainTab === "hackathons"
              ? { background: "linear-gradient(135deg,#4f46e5,#7c3aed)" }
              : {}
          }
        >
          <Trophy className="w-4 h-4" /> Hackathons
          {registeredHackathons.size > 0 && (
            <span className="ml-1 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {registeredHackathons.size}
            </span>
          )}
        </button>
      </div>

      {/* ── Find Teammates Tab ── */}
      {mainTab === "teammates" && (
        <div className="space-y-8">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
              {(["software", "hardware"] as StudentType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  data-ocid="filter.tab"
                  onClick={() => setActiveType(t)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    activeType === t
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {t === "software"
                    ? "💻 Software Students"
                    : "🔧 Hardware Students"}
                </button>
              ))}
            </div>
            <div className="relative flex-1 max-w-xs">
              <svg
                aria-hidden="true"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                />
              </svg>
              <input
                data-ocid="filter.search_input"
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Search by name or skill..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Badge variant="outline" className="text-gray-500">
              {filtered.length} students found
            </Badge>
            <Button
              data-ocid="controls.primary_button"
              onClick={() => setCreateTeamOpen(true)}
              className="ml-auto bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-xl flex items-center gap-2 font-semibold"
            >
              <Plus className="w-4 h-4" /> Create Team
            </Button>
          </div>

          {integratedProfile && (
            <div
              className="rounded-2xl p-5 border border-indigo-200"
              style={{
                background:
                  "linear-gradient(135deg,#eef2ff 0%,#dbeafe 52%,#e0f2fe 100%)",
              }}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    Live Integration Profile
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Your `Academic Roadmaps` integrations now auto-create this
                    profile for `Skill-Based Teams` and hackathon matching.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {integratedProfile.connectedPlatforms.map((platform) => (
                      <span
                        key={platform}
                        className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl bg-white/75 border border-indigo-100 px-4 py-3">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-indigo-600 font-bold">
                    Primary Track
                  </p>
                  <p className="text-2xl font-black text-gray-900 capitalize mt-1">
                    {integratedProfile.primaryTrack}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {integratedProfile.name}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
                <div className="rounded-xl bg-white/75 border border-indigo-100 p-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-gray-700">Software</span>
                    <span className="font-bold text-indigo-700">
                      {integratedProfile.softwareScore}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-indigo-100 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${integratedProfile.softwareScore}%`,
                        background:
                          "linear-gradient(90deg, #4f46e5, #818cf8)",
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs mt-4 mb-1">
                    <span className="font-semibold text-gray-700">Hardware</span>
                    <span className="font-bold text-cyan-700">
                      {integratedProfile.hardwareScore}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-cyan-100 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${integratedProfile.hardwareScore}%`,
                        background:
                          "linear-gradient(90deg, #0891b2, #67e8f9)",
                      }}
                    />
                  </div>
                </div>

                <div className="rounded-xl bg-white/75 border border-indigo-100 p-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-indigo-600 font-bold">
                    Recommended Domains
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {integratedProfile.recommendedDomains.map((domain) => (
                      <span
                        key={domain}
                        className="px-2 py-1 rounded-full text-[11px] font-semibold bg-indigo-100 text-indigo-800"
                      >
                        {domain}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-white/75 border border-indigo-100 p-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-indigo-600 font-bold">
                    Best Roles
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {integratedProfile.recommendedRoles.map((role) => (
                      <span
                        key={role}
                        className="px-2 py-1 rounded-full text-[11px] font-semibold bg-sky-100 text-sky-800"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Student Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtered.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                onInvite={(s) => setInviteTarget(s)}
              />
            ))}
            {filtered.length === 0 && (
              <div
                className="col-span-full text-center py-12 text-gray-400"
                data-ocid="students.empty_state"
              >
                <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">
                  No students found matching your search.
                </p>
              </div>
            )}
          </div>

          {/* My Teams */}
          {teams.length > 0 && (
            <div>
              <h2 className="font-display font-bold text-xl mb-4 flex items-center gap-2 text-gray-900">
                <Users className="w-5 h-5 text-blue-600" /> My Teams
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {teams.map((team, idx) => (
                  <Card
                    key={team.id}
                    data-ocid={`teams.item.${idx + 1}`}
                    className="rounded-2xl shadow-card overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(135deg,#eff6ff 0%,#dbeafe 60%,#bfdbfe 100%)",
                      borderLeft: "4px solid #1d4ed8",
                    }}
                  >
                    <div className="h-1.5 bg-gradient-to-r from-indigo-600 to-blue-500" />
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-gray-900 text-sm">
                          {team.name}
                        </h3>
                        <button
                          type="button"
                          data-ocid="teams.delete_button"
                          onClick={() => handleDeleteTeam(team.id)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                          title="Delete team"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-600 mb-3 leading-relaxed">
                        {team.goal}
                      </p>
                      {team.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {team.skills.map((s) => (
                            <span
                              key={s}
                              className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-semibold"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 mb-4">
                        {team.members.length === 0 ? (
                          <span className="text-xs text-gray-400">
                            No members yet
                          </span>
                        ) : (
                          team.members.map((m) => (
                            <div
                              key={m.id}
                              title={`${m.name} (${m.status})`}
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold ${
                                m.status === "confirmed"
                                  ? "bg-gradient-to-br from-green-500 to-emerald-600"
                                  : "bg-gradient-to-br from-amber-400 to-orange-500"
                              }`}
                            >
                              {m.avatar}
                            </div>
                          ))
                        )}
                        {team.members.length > 0 && (
                          <span className="text-xs text-gray-500 ml-1">
                            {team.members.length} member
                            {team.members.length > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        data-ocid="teams.edit_button"
                        onClick={() => {
                          setManageTarget(team);
                          setManageOpen(true);
                        }}
                        className="w-full h-8 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
                      >
                        Manage Team
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {teams.length === 0 && (
            <div
              data-ocid="teams.empty_state"
              className="rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/50 p-8 text-center"
            >
              <Users className="w-10 h-10 mx-auto mb-3 text-blue-300" />
              <p className="text-sm font-semibold text-blue-700 mb-1">
                No teams yet
              </p>
              <p className="text-xs text-blue-500 mb-4">
                Create a team or invite students to get started.
              </p>
              <Button
                size="sm"
                data-ocid="teams.primary_button"
                onClick={() => setCreateTeamOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Create First Team
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ── Hackathons Tab ── */}
      {mainTab === "hackathons" && (
        <div className="space-y-6">
          {/* Hackathons Header */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 className="font-display font-bold text-xl text-gray-900 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-emerald-600" /> Hackathons Hub
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Find hackathons, organize your own, and earn from your college
                events
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1.5 rounded-full border border-emerald-200">
                ✓ {registeredHackathons.size} Registered
              </span>
              <span className="bg-purple-100 text-purple-700 font-bold px-3 py-1.5 rounded-full border border-purple-200">
                {organizedEvents.length} Organized
              </span>
            </div>
          </div>

          {integratedProfile && (
            <div
              className="rounded-2xl border p-5"
              style={{
                background:
                  "linear-gradient(135deg,#eef2ff 0%,#ede9fe 48%,#ecfeff 100%)",
                borderColor: "#c7d2fe",
              }}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-violet-600" />
                    Auto-Generated Hackathon Profile
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    This profile is built live from your `Academic Roadmaps`
                    integrations. Your software and hardware signals decide
                    which hackathons, roles, and domains get recommended here.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {integratedProfile.connectedPlatforms.map((platform) => (
                      <span
                        key={platform}
                        className="px-2.5 py-1 rounded-full text-xs font-bold bg-violet-600 text-white"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/80 border border-violet-100 px-4 py-3 min-w-[140px]">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-violet-600 font-bold">
                      Primary Track
                    </p>
                    <p className="text-2xl font-black text-gray-900 capitalize mt-1">
                      {integratedProfile.primaryTrack}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/80 border border-sky-100 px-4 py-3 min-w-[140px]">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-sky-600 font-bold">
                      Skill Signals
                    </p>
                    <p className="text-2xl font-black text-gray-900 mt-1">
                      {integratedProfile.skills.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-5">
                <div className="rounded-xl bg-white/80 border border-violet-100 p-4">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-gray-700">Software Match</span>
                    <span className="font-bold text-indigo-700">
                      {integratedProfile.softwareScore}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-indigo-100 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${integratedProfile.softwareScore}%`,
                        background:
                          "linear-gradient(90deg, #4f46e5, #818cf8)",
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs mt-4 mb-1">
                    <span className="font-semibold text-gray-700">Hardware Match</span>
                    <span className="font-bold text-cyan-700">
                      {integratedProfile.hardwareScore}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-cyan-100 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${integratedProfile.hardwareScore}%`,
                        background:
                          "linear-gradient(90deg, #0891b2, #67e8f9)",
                      }}
                    />
                  </div>
                </div>

                <div className="rounded-xl bg-white/80 border border-violet-100 p-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-violet-600 font-bold">
                    Recommended Domains
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {integratedProfile.recommendedDomains.map((domain) => (
                      <span
                        key={domain}
                        className="px-2 py-1 rounded-full text-[11px] font-semibold bg-violet-100 text-violet-800"
                      >
                        {domain}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-gray-500 mt-3">
                    {integratedProfile.readinessSummary}
                  </p>
                </div>

                <div className="rounded-xl bg-white/80 border border-violet-100 p-4">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-violet-600 font-bold">
                    Best Matching Hackathons
                  </p>
                  <div className="space-y-2 mt-3">
                    {recommendedHackathons.length > 0 ? (
                      recommendedHackathons.map((hackathon) => (
                        <div
                          key={hackathon.id}
                          className="rounded-lg border border-violet-100 bg-violet-50/70 px-3 py-2"
                        >
                          <p className="text-sm font-semibold text-gray-900">
                            {hackathon.name}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-1">
                            {hackathon.organizer} | {hackathon.type}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        Add more integration signals to unlock hackathon matches.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Three Sub-tabs */}
          <div className="flex gap-2 flex-wrap" data-ocid="hackathons.tab">
            {(
              [
                {
                  key: "find",
                  label: "🔍 Find Hackathons",
                  count: HACKATHONS.length,
                },
                {
                  key: "organize",
                  label: "🚀 Organize a Hackathon",
                  count: null,
                },
                {
                  key: "myevents",
                  label: "📋 My Organized Events",
                  count: organizedEvents.length,
                },
                {
                  key: "unstop",
                  label: "🏆 Unstop",
                  count: null,
                },
              ] as const
            ).map((t) => (
              <button
                type="button"
                key={t.key}
                onClick={() => setHackathonTab(t.key)}
                data-ocid={"hackathons.tab"}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${hackathonTab === t.key ? "border-emerald-500 text-white shadow-lg shadow-emerald-200" : "bg-white border-gray-200 text-gray-600 hover:border-emerald-300"}`}
                style={
                  hackathonTab === t.key
                    ? { background: "linear-gradient(135deg,#059669,#10b981)" }
                    : {}
                }
              >
                {t.label}
                {t.count !== null && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${hackathonTab === t.key ? "bg-white/30 text-white" : "bg-emerald-100 text-emerald-700"}`}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Add New Hackathon Modal */}
          {addHackathonOpen && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              style={{ background: "rgba(0,0,0,0.5)" }}
              data-ocid="hackathon.add.modal"
            >
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                      <Plus className="w-5 h-5 text-violet-600" /> Add New
                      Hackathon
                    </h3>
                    <button
                      type="button"
                      data-ocid="hackathon.add.close_button"
                      onClick={() => setAddHackathonOpen(false)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-sm font-semibold text-gray-700">
                        Hackathon Title *
                      </Label>
                      <Input
                        data-ocid="hackathon.add.title.input"
                        placeholder="e.g. CodeStorm 2026"
                        value={newHack.title}
                        onChange={(e) =>
                          setNewHack((h) => ({ ...h, title: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-semibold text-gray-700">
                        Domain *
                      </Label>
                      <select
                        data-ocid="hackathon.add.domain.select"
                        className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                        value={newHack.domain}
                        onChange={(e) =>
                          setNewHack((h) => ({ ...h, domain: e.target.value }))
                        }
                      >
                        <option value="">Select domain</option>
                        {[
                          "Web Dev",
                          "AI/ML",
                          "Cybersecurity",
                          "IoT & Hardware",
                          "Mobile Apps",
                          "Open Innovation",
                        ].map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-semibold text-gray-700">
                        Date *
                      </Label>
                      <Input
                        data-ocid="hackathon.add.date.input"
                        type="date"
                        value={newHack.date}
                        onChange={(e) =>
                          setNewHack((h) => ({ ...h, date: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-semibold text-gray-700">
                        Mode
                      </Label>
                      <select
                        data-ocid="hackathon.add.mode.select"
                        className="w-full border border-gray-200 rounded-lg p-2 text-sm"
                        value={newHack.mode}
                        onChange={(e) =>
                          setNewHack((h) => ({
                            ...h,
                            mode: e.target.value as
                              | "Online"
                              | "Offline"
                              | "Hybrid",
                          }))
                        }
                      >
                        <option>Online</option>
                        <option>Offline</option>
                        <option>Hybrid</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-semibold text-gray-700">
                        Prize Pool
                      </Label>
                      <Input
                        data-ocid="hackathon.add.prize.input"
                        placeholder="e.g. ₹50,000"
                        value={newHack.prize}
                        onChange={(e) =>
                          setNewHack((h) => ({ ...h, prize: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm font-semibold text-gray-700">
                        Registration Fee
                      </Label>
                      <Input
                        data-ocid="hackathon.add.fee.input"
                        placeholder="e.g. Free or ₹200"
                        value={newHack.fee}
                        onChange={(e) =>
                          setNewHack((h) => ({ ...h, fee: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Registration Link
                      </Label>
                      <Input
                        data-ocid="hackathon.add.link.input"
                        placeholder="https://unstop.com/..."
                        value={newHack.link}
                        onChange={(e) =>
                          setNewHack((h) => ({ ...h, link: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <Label className="text-sm font-semibold text-gray-700">
                        Description
                      </Label>
                      <textarea
                        data-ocid="hackathon.add.description.textarea"
                        className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none focus:outline-none focus:border-violet-400"
                        rows={3}
                        placeholder="Briefly describe the hackathon..."
                        value={newHack.description}
                        onChange={(e) =>
                          setNewHack((h) => ({
                            ...h,
                            description: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      data-ocid="hackathon.add.cancel_button"
                      onClick={() => setAddHackathonOpen(false)}
                      className="flex-1 py-2.5 rounded-xl border border-gray-200 font-semibold text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      data-ocid="hackathon.add.submit_button"
                      disabled={
                        !newHack.title || !newHack.domain || !newHack.date
                      }
                      onClick={() => {
                        const newEntry: Hackathon = {
                          id: `custom-${Date.now()}`,
                          name: newHack.title,
                          organizer: "Student Added",
                          dateRange: newHack.date,
                          location:
                            newHack.mode === "Online"
                              ? "Online"
                              : "WIT Solapur",
                          isOnline: newHack.mode === "Online",
                          type: "College",
                          prize: newHack.prize || "TBD",
                          tags: [newHack.domain],
                          teamSize: "2–4",
                          deadline: new Date(newHack.date),
                          domainOptions: [newHack.domain],
                        };
                        setCustomHackathons((prev) => [newEntry, ...prev]);
                        setAddHackathonOpen(false);
                        setNewHack({
                          title: "",
                          domain: "",
                          date: "",
                          mode: "Online",
                          prize: "",
                          fee: "",
                          description: "",
                          link: "",
                        });
                        toast.success("Hackathon added successfully!");
                      }}
                      className="flex-1 py-2.5 rounded-xl font-bold text-white transition-all"
                      style={{
                        background:
                          newHack.title && newHack.domain && newHack.date
                            ? "linear-gradient(135deg,#7c3aed,#6d28d9)"
                            : "#d1d5db",
                      }}
                    >
                      Add Hackathon
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Find Hackathons */}
          {hackathonTab === "find" && (
            <div className="space-y-5">
              {/* Header with Add button */}
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800 text-base">
                  Available Hackathons (
                  {HACKATHONS.length + customHackathons.length})
                </h3>
                <button
                  type="button"
                  data-ocid="hackathons.open_modal_button"
                  onClick={() => setAddHackathonOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-white text-sm shadow-md transition-all hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg,#7c3aed,#6d28d9)",
                  }}
                >
                  <Plus className="w-4 h-4" /> Add New Hackathon
                </button>
              </div>
              <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                data-ocid="hackathons.list"
              >
                {[...HACKATHONS, ...customHackathons].map((h, idx) => (
                  <HackathonCard
                    key={h.id}
                    hackathon={h}
                    index={idx}
                    isRegistered={registeredHackathons.has(h.id)}
                    data-ocid={`hackathons.item.${idx + 1}`}
                    onRegister={(hackathon) => setRegTarget(hackathon)}
                  />
                ))}
              </div>
              <div
                className="rounded-2xl p-5 border border-purple-200"
                style={{
                  background: "linear-gradient(135deg,#f5f3ff,#ede9fe,#ddd6fe)",
                }}
              >
                <h3 className="font-bold text-purple-900 mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4" /> Hackathon Success Tips
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-purple-800">
                  {[
                    {
                      n: "01",
                      title: "Register Early",
                      tip: "Slots fill fast. Register as soon as possible to secure your spot.",
                    },
                    {
                      n: "02",
                      title: "Form Balanced Teams",
                      tip: "Mix frontend, backend, ML, and hardware skills for the best outcome.",
                    },
                    {
                      n: "03",
                      title: "Start with a Clear Idea",
                      tip: "Define the problem statement before the event starts.",
                    },
                  ].map((tip) => (
                    <div key={tip.n} className="flex items-start gap-2">
                      <span className="text-purple-500 font-bold mt-0.5">
                        {tip.n}
                      </span>
                      <p>
                        <strong>{tip.title}</strong> — {tip.tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Organize a Hackathon */}
          {hackathonTab === "organize" && (
            <div className="space-y-5">
              {/* Header banner */}
              <div
                className="rounded-2xl p-5 border border-emerald-200 flex items-center gap-4"
                style={{
                  background: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md shadow-emerald-200 flex-shrink-0">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-emerald-900">
                    Host Your Own College Hackathon
                  </h3>
                  <p className="text-sm text-emerald-700 mt-0.5">
                    HOD approval is required before you can organize an official
                    college hackathon.
                  </p>
                </div>
              </div>

              {/* HOD Permission: IDLE — show request form */}
              {hodStatus === "idle" && (
                <div
                  className="rounded-2xl border border-amber-200 p-6 space-y-5"
                  style={{
                    background: "linear-gradient(135deg,#fffbeb,#fef3c7)",
                  }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-amber-900 text-base">
                        Request HOD Permission
                      </h3>
                      <p className="text-xs text-amber-700">
                        Fill in your hackathon proposal. Your HOD will review
                        and approve it.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-semibold text-gray-700">
                        Hackathon Title *
                      </Label>
                      <Input
                        data-ocid="hackathon.title.input"
                        placeholder="e.g. InnoSpark 2026"
                        value={hodForm.title}
                        onChange={(e) =>
                          setHodForm((f) => ({ ...f, title: e.target.value }))
                        }
                        className="border-amber-200 focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-semibold text-gray-700">
                        Proposed Date *
                      </Label>
                      <Input
                        data-ocid="hackathon.date.input"
                        type="date"
                        value={hodForm.proposedDate}
                        onChange={(e) =>
                          setHodForm((f) => ({
                            ...f,
                            proposedDate: e.target.value,
                          }))
                        }
                        className="border-amber-200 focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="font-semibold text-gray-700">
                        Expected Participants *
                      </Label>
                      <Input
                        data-ocid="hackathon.participants.input"
                        type="number"
                        placeholder="e.g. 100"
                        value={hodForm.participants}
                        onChange={(e) =>
                          setHodForm((f) => ({
                            ...f,
                            participants: e.target.value,
                          }))
                        }
                        className="border-amber-200 focus:border-amber-400"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="font-semibold text-gray-700">
                        Brief Description *
                      </Label>
                      <textarea
                        data-ocid="hackathon.description.textarea"
                        className="w-full border border-amber-200 rounded-lg p-3 text-sm focus:outline-none focus:border-amber-400 resize-none"
                        rows={3}
                        placeholder="Describe your hackathon theme, goals, and why it benefits students..."
                        value={hodForm.description}
                        onChange={(e) =>
                          setHodForm((f) => ({
                            ...f,
                            description: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    data-ocid="hackathon.hod_request.submit_button"
                    disabled={
                      !hodForm.title ||
                      !hodForm.proposedDate ||
                      !hodForm.participants ||
                      !hodForm.description ||
                      hodSubmitting
                    }
                    onClick={() => {
                      setHodSubmitting(true);
                      setTimeout(() => {
                        setHodStatus("pending");
                        setHodSubmitting(false);
                      }, 1200);
                    }}
                    className="w-full py-3 rounded-xl font-bold text-white transition-all"
                    style={{
                      background:
                        hodForm.title &&
                        hodForm.proposedDate &&
                        hodForm.participants &&
                        hodForm.description
                          ? "linear-gradient(135deg,#f59e0b,#d97706)"
                          : "#d1d5db",
                      cursor:
                        hodForm.title &&
                        hodForm.proposedDate &&
                        hodForm.participants &&
                        hodForm.description
                          ? "pointer"
                          : "not-allowed",
                    }}
                  >
                    {hodSubmitting
                      ? "Submitting Request..."
                      : "📨 Submit HOD Permission Request"}
                  </button>
                </div>
              )}

              {/* HOD Permission: PENDING */}
              {hodStatus === "pending" && (
                <div
                  className="rounded-2xl border border-orange-200 p-8 text-center space-y-4"
                  style={{
                    background: "linear-gradient(135deg,#fff7ed,#ffedd5)",
                  }}
                  data-ocid="hackathon.hod_pending.panel"
                >
                  <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mx-auto">
                    <Clock className="w-8 h-8 text-orange-500 animate-pulse" />
                  </div>
                  <h3 className="font-bold text-orange-900 text-lg">
                    Permission Request Sent to HOD
                  </h3>
                  <p className="text-sm text-orange-700">
                    Your request for{" "}
                    <strong>&ldquo;{hodForm.title}&rdquo;</strong> has been
                    submitted to your HOD for review. You will be notified once
                    it is approved or rejected.
                  </p>
                  <div className="rounded-xl border border-orange-200 p-4 text-left space-y-2 bg-white/60">
                    <p className="text-xs font-bold text-orange-800 uppercase tracking-wide">
                      Request Summary
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Title:</span>{" "}
                      {hodForm.title}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Proposed Date:</span>{" "}
                      {hodForm.proposedDate}
                    </p>
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">
                        Expected Participants:
                      </span>{" "}
                      {hodForm.participants}
                    </p>
                  </div>
                  <div
                    className="rounded-xl border border-dashed border-orange-300 p-3 bg-orange-50"
                    data-ocid="hackathon.hod_pending.loading_state"
                  >
                    <p className="text-xs text-orange-600 font-semibold">
                      ⏳ Status: Awaiting HOD Review
                    </p>
                    <p className="text-xs text-orange-500 mt-1">
                      Typical response time: 1–3 working days
                    </p>
                  </div>
                  {/* Demo button for testing the flow */}
                  <button
                    type="button"
                    data-ocid="hackathon.hod_approve.button"
                    onClick={() => setHodStatus("approved")}
                    className="mt-2 px-5 py-2 rounded-lg text-xs font-bold border-2 border-dashed border-emerald-400 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-all"
                  >
                    🧪 Demo: Simulate HOD Approval
                  </button>
                </div>
              )}

              {/* HOD Permission: REJECTED */}
              {hodStatus === "rejected" && (
                <div
                  className="rounded-2xl border border-red-200 p-8 text-center space-y-4"
                  style={{
                    background: "linear-gradient(135deg,#fef2f2,#fee2e2)",
                  }}
                  data-ocid="hackathon.hod_rejected.error_state"
                >
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
                    <XCircle className="w-8 h-8 text-red-500" />
                  </div>
                  <h3 className="font-bold text-red-900 text-lg">
                    Request Rejected
                  </h3>
                  <p className="text-sm text-red-700">
                    Your HOD has reviewed and rejected the request for{" "}
                    <strong>&ldquo;{hodForm.title}&rdquo;</strong>. You can
                    submit a revised proposal.
                  </p>
                  <button
                    type="button"
                    data-ocid="hackathon.hod_resubmit.button"
                    onClick={() => {
                      setHodStatus("idle");
                      setHodForm({
                        title: "",
                        description: "",
                        participants: "",
                        proposedDate: "",
                      });
                    }}
                    className="px-6 py-2.5 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 transition-all"
                  >
                    Submit New Request
                  </button>
                </div>
              )}

              {/* HOD Permission: APPROVED — show full wizard */}
              {hodStatus === "approved" && (
                <div
                  className="space-y-4"
                  data-ocid="hackathon.organize.success_state"
                >
                  <div
                    className="rounded-xl border border-emerald-300 p-4 flex items-center gap-3"
                    style={{
                      background: "linear-gradient(135deg,#d1fae5,#a7f3d0)",
                    }}
                  >
                    <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-emerald-900 text-sm">
                        HOD Approval Granted ✓
                      </p>
                      <p className="text-xs text-emerald-700">
                        Your request for{" "}
                        <strong>&ldquo;{hodForm.title}&rdquo;</strong> has been
                        approved. You can now set up your hackathon below.
                      </p>
                    </div>
                  </div>
                  <OrganizeWizard
                    onPublish={(h) => {
                      setOrganizedEvents((prev) => [h, ...prev]);
                      setHodStatus("idle");
                      setHodForm({
                        title: "",
                        description: "",
                        participants: "",
                        proposedDate: "",
                      });
                    }}
                    initialName={hodForm.title}
                  />
                </div>
              )}
            </div>
          )}

          {/* Tab: My Organized Events */}
          {hackathonTab === "myevents" && (
            <MyOrganizedEvents
              events={organizedEvents}
              onAddEvent={() => setHackathonTab("organize")}
            />
          )}

          {/* Tab: Unstop Integration */}
          {hackathonTab === "unstop" && (
            <div className="space-y-8" data-ocid="unstop.panel">
              {/* Section A: Profile Connection */}
              <div
                className="rounded-2xl border-2 border-emerald-300 overflow-hidden"
                style={{
                  background: "linear-gradient(135deg,#ecfdf5,#d1fae5)",
                }}
              >
                <div
                  className="p-5 border-b border-emerald-200"
                  style={{
                    background: "linear-gradient(135deg,#059669,#10b981)",
                  }}
                >
                  <h3 className="text-white font-bold text-lg">
                    🏆 Connect Your Unstop Profile
                  </h3>
                  <p className="text-emerald-100 text-sm mt-1">
                    Link your Unstop account to showcase your hackathon
                    achievements
                  </p>
                </div>
                <div className="p-5">
                  {!unstopConnected ? (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="text"
                        value={unstopUrl}
                        onChange={(e) => setUnstopUrl(e.target.value)}
                        placeholder="Enter your Unstop profile URL (e.g. unstop.com/u/yourname)"
                        className="flex-1 px-4 py-2.5 rounded-xl border-2 border-emerald-300 focus:border-emerald-500 outline-none text-gray-800 font-medium"
                        data-ocid="unstop.input"
                      />
                      <input
                        type="text"
                        value={unstopName}
                        onChange={(e) => setUnstopName(e.target.value)}
                        placeholder="Display name"
                        className="w-48 px-4 py-2.5 rounded-xl border-2 border-emerald-300 focus:border-emerald-500 outline-none text-gray-800 font-medium"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!unstopUrl.trim()) return;
                          let url = unstopUrl.trim();
                          if (
                            !url.startsWith("http://") &&
                            !url.startsWith("https://")
                          )
                            url = `https://${url}`;
                          setUnstopUrl(url);
                          setUnstopConnected(true);
                        }}
                        className="px-6 py-2.5 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
                        style={{
                          background: "linear-gradient(135deg,#059669,#10b981)",
                        }}
                        data-ocid="unstop.primary_button"
                      >
                        Connect
                      </button>
                    </div>
                  ) : (
                    <div
                      className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl border-2 border-emerald-400"
                      style={{
                        background: "linear-gradient(135deg,#d1fae5,#a7f3d0)",
                      }}
                    >
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                        style={{
                          background: "linear-gradient(135deg,#059669,#10b981)",
                        }}
                      >
                        🏆
                      </div>
                      <div className="flex-1 text-center sm:text-left">
                        <div className="font-bold text-gray-800 text-lg">
                          {unstopName || "Unstop User"}
                        </div>
                        <div className="text-emerald-700 text-sm font-medium truncate max-w-xs">
                          {unstopUrl}
                        </div>
                        <div className="mt-1">
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                            style={{
                              background:
                                "linear-gradient(135deg,#059669,#10b981)",
                            }}
                          >
                            ✓ Connected
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={unstopUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl font-bold text-white text-sm transition-all hover:scale-105"
                          style={{
                            background:
                              "linear-gradient(135deg,#059669,#10b981)",
                          }}
                          data-ocid="unstop.secondary_button"
                        >
                          Open Profile
                        </a>
                        <button
                          type="button"
                          onClick={() => {
                            setUnstopConnected(false);
                            setUnstopUrl("");
                            setUnstopName("");
                          }}
                          className="px-4 py-2 rounded-xl font-bold text-red-600 border-2 border-red-300 bg-white text-sm hover:bg-red-50 transition-all"
                          data-ocid="unstop.delete_button"
                        >
                          Disconnect
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Section B: Public Hackathon Feed */}
              <div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    🌐 Public Hackathons on Unstop
                  </h3>
                  <p className="text-gray-500 text-sm mt-1">
                    Explore open hackathons. Register directly on Unstop.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {[
                    {
                      title: "HackWithInfy 2026",
                      org: "Infosys",
                      prize: "₹5 Lakh",
                      deadline: "15 Apr 2026",
                      tags: ["AI/ML", "Cloud"],
                      team: "2–4",
                    },
                    {
                      title: "Smart India Hackathon 2026",
                      org: "Govt of India",
                      prize: "₹1 Crore",
                      deadline: "30 Mar 2026",
                      tags: ["GovTech", "IoT"],
                      team: "6",
                    },
                    {
                      title: "IIT Bombay Techfest Hack",
                      org: "IIT Bombay",
                      prize: "₹2 Lakh",
                      deadline: "20 Apr 2026",
                      tags: ["Robotics", "ML"],
                      team: "3–5",
                    },
                    {
                      title: "Flipkart Grid 7.0",
                      org: "Flipkart",
                      prize: "₹10 Lakh",
                      deadline: "5 May 2026",
                      tags: ["E-Commerce", "AI"],
                      team: "2–3",
                    },
                    {
                      title: "Code for Good",
                      org: "JPMorgan Chase",
                      prize: "Internship Offer",
                      deadline: "10 Apr 2026",
                      tags: ["FinTech", "WebDev"],
                      team: "3–4",
                    },
                    {
                      title: "WIT HackFest 2026",
                      org: "WIT Solapur",
                      prize: "₹50K",
                      deadline: "1 Apr 2026",
                      tags: ["Open Innovation"],
                      team: "2–5",
                    },
                    {
                      title: "Unstop College Clash",
                      org: "Unstop",
                      prize: "₹25K",
                      deadline: "25 Apr 2026",
                      tags: ["Competitive", "Any"],
                      team: "2",
                    },
                  ].map((h, i) => (
                    <div
                      key={h.title}
                      className="rounded-2xl border-2 border-emerald-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all"
                      style={{
                        background: "linear-gradient(135deg,#f0fdf4,#ecfdf5)",
                      }}
                      data-ocid={`unstop.item.${i + 1}`}
                    >
                      <div
                        className="p-4 border-b border-emerald-100"
                        style={{
                          background: "linear-gradient(135deg,#059669,#10b981)",
                        }}
                      >
                        <div className="font-bold text-white text-base leading-tight">
                          {h.title}
                        </div>
                        <div className="text-emerald-100 text-sm mt-0.5">
                          {h.org}
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span
                            className="px-2.5 py-1 rounded-lg text-xs font-bold"
                            style={{
                              background:
                                "linear-gradient(135deg,#f59e0b,#fbbf24)",
                              color: "#78350f",
                            }}
                          >
                            🏆 {h.prize}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">
                            ⏰ {h.deadline}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {h.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                          👥 Team: {h.team} members
                        </div>
                        <a
                          href="https://unstop.com/hackathons"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full text-center py-2 rounded-xl font-bold text-white text-sm transition-all hover:scale-105 hover:shadow-md"
                          style={{
                            background:
                              "linear-gradient(135deg,#059669,#10b981)",
                          }}
                        >
                          Register on Unstop →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section C: Private Invites */}
              <div className="rounded-2xl border-2 border-sky-300 overflow-hidden">
                <div
                  className="p-5 border-b border-sky-200"
                  style={{
                    background: "linear-gradient(135deg,#0284c7,#38bdf8)",
                  }}
                >
                  <h3 className="text-white font-bold text-lg">
                    🔒 Private Hackathon Invites
                  </h3>
                </div>
                <div
                  className="p-5 space-y-4"
                  style={{
                    background: "linear-gradient(135deg,#f0f9ff,#e0f2fe)",
                  }}
                >
                  <div className="p-3 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-sm font-medium">
                    ℹ️ Private hackathon links are posted by your institute
                    admin. Click to register directly on Unstop.
                  </div>
                  <div className="space-y-3" data-ocid="unstop.list">
                    {[
                      {
                        title: "Inter-College AI Challenge 2026",
                        by: "Admin – WIT Solapur",
                        expiry: "31 Mar 2026",
                        domain: "Artificial Intelligence",
                      },
                      {
                        title: "Maharashtra Tech Hackathon (Private)",
                        by: "Admin – WIT Solapur",
                        expiry: "15 Apr 2026",
                        domain: "Full Stack",
                      },
                      {
                        title: "SPPU Regional Coding Sprint",
                        by: "Admin – WIT Solapur",
                        expiry: "20 Apr 2026",
                        domain: "Competitive Programming",
                      },
                    ].map((inv, i) => (
                      <div
                        key={inv.title}
                        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl border-2 border-sky-200 bg-white hover:shadow-md transition-all"
                        data-ocid={`unstop.item.${i + 4}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl mt-0.5">🔒</span>
                          <div>
                            <div className="font-bold text-gray-800">
                              {inv.title}
                            </div>
                            <div className="text-sky-600 text-sm font-medium">
                              {inv.by}
                            </div>
                            <div className="flex gap-3 mt-1 text-xs text-gray-500">
                              <span>⏰ Expires: {inv.expiry}</span>
                              <span>📂 {inv.domain}</span>
                            </div>
                          </div>
                        </div>
                        <a
                          href="https://unstop.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 px-5 py-2 rounded-xl font-bold text-white text-sm transition-all hover:scale-105 hover:shadow-md"
                          style={{
                            background:
                              "linear-gradient(135deg,#0284c7,#38bdf8)",
                          }}
                        >
                          Join via Unstop →
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section D: Unstop Stats */}
              <div className="rounded-2xl border-2 border-purple-300 overflow-hidden">
                <div
                  className="p-5 border-b border-purple-200"
                  style={{
                    background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                  }}
                >
                  <h3 className="text-white font-bold text-lg">
                    📊 My Unstop Stats
                  </h3>
                  <p className="text-purple-100 text-sm mt-1">
                    Track your competitive profile manually
                  </p>
                </div>
                <div
                  className="p-5 space-y-5"
                  style={{
                    background: "linear-gradient(135deg,#faf5ff,#f3e8ff)",
                  }}
                >
                  {unstopStatsSaved ? (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-3">
                        {unstopRating && (
                          <span
                            className="px-4 py-2 rounded-xl font-bold text-white text-sm"
                            style={{
                              background:
                                "linear-gradient(135deg,#7c3aed,#a855f7)",
                            }}
                          >
                            ⭐ Rating: {unstopRating}
                          </span>
                        )}
                        {unstopCompetitions && (
                          <span
                            className="px-4 py-2 rounded-xl font-bold text-white text-sm"
                            style={{
                              background:
                                "linear-gradient(135deg,#059669,#10b981)",
                            }}
                          >
                            🏆 Competitions: {unstopCompetitions}
                          </span>
                        )}
                        {unstopRank && (
                          <span
                            className="px-4 py-2 rounded-xl font-bold text-white text-sm"
                            style={{
                              background:
                                "linear-gradient(135deg,#f59e0b,#fbbf24)",
                              color: "#78350f",
                            }}
                          >
                            🥇 Best Rank: {unstopRank}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setUnstopStatsSaved(false)}
                        className="px-4 py-2 rounded-xl font-bold text-purple-700 border-2 border-purple-300 bg-white text-sm hover:bg-purple-50 transition-all"
                        data-ocid="unstop.edit_button"
                      >
                        Edit Stats
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label
                            htmlFor="unstop-rating"
                            className="block text-sm font-bold text-gray-700 mb-1"
                          >
                            Unstop Rating
                          </label>
                          <input
                            id="unstop-rating"
                            type="number"
                            value={unstopStatsForm.rating}
                            onChange={(e) =>
                              setUnstopStatsForm((p) => ({
                                ...p,
                                rating: e.target.value,
                              }))
                            }
                            placeholder="e.g. 1850"
                            className="w-full px-4 py-2.5 rounded-xl border-2 border-purple-300 focus:border-purple-500 outline-none text-gray-800 font-medium"
                            data-ocid="unstop.input"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="unstop-comps"
                            className="block text-sm font-bold text-gray-700 mb-1"
                          >
                            Competitions Participated
                          </label>
                          <input
                            id="unstop-comps"
                            type="number"
                            value={unstopStatsForm.competitions}
                            onChange={(e) =>
                              setUnstopStatsForm((p) => ({
                                ...p,
                                competitions: e.target.value,
                              }))
                            }
                            placeholder="e.g. 12"
                            className="w-full px-4 py-2.5 rounded-xl border-2 border-purple-300 focus:border-purple-500 outline-none text-gray-800 font-medium"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="unstop-rank"
                            className="block text-sm font-bold text-gray-700 mb-1"
                          >
                            Best Rank
                          </label>
                          <input
                            id="unstop-rank"
                            type="text"
                            value={unstopStatsForm.rank}
                            onChange={(e) =>
                              setUnstopStatsForm((p) => ({
                                ...p,
                                rank: e.target.value,
                              }))
                            }
                            placeholder="e.g. Top 50"
                            className="w-full px-4 py-2.5 rounded-xl border-2 border-purple-300 focus:border-purple-500 outline-none text-gray-800 font-medium"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setUnstopRating(unstopStatsForm.rating);
                          setUnstopCompetitions(unstopStatsForm.competitions);
                          setUnstopRank(unstopStatsForm.rank);
                          setUnstopStatsSaved(true);
                        }}
                        className="px-6 py-2.5 rounded-xl font-bold text-white transition-all hover:scale-105 hover:shadow-lg"
                        style={{
                          background: "linear-gradient(135deg,#7c3aed,#a855f7)",
                        }}
                        data-ocid="unstop.save_button"
                      >
                        Save Stats
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
