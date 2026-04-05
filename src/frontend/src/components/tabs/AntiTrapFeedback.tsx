import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Flag,
  MapPin,
  MessageCircle,
  ShieldAlert,
  ShieldCheck,
  ThumbsUp,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import SafeCityExploration from "./SafeCityExploration";

interface Comment {
  id: number;
  author: string;
  text: string;
  time: string;
}

interface Report {
  id: number;
  title: string;
  company: string;
  description: string;
  status: "verified" | "warning";
  upvotes: number;
  date: string;
  comments: Comment[];
  proofFile?: string;
}

const initialReports: Report[] = [
  {
    id: 1,
    title: "Fake Internship Offer with Upfront Fee",
    company: "TechVision Solutions",
    description:
      'Received an internship offer asking for ₹5,000 "registration fee" before joining. The company website was created just 2 months ago. Multiple students from our college received the same email.',
    status: "warning",
    upvotes: 47,
    date: "Feb 20, 2026",
    comments: [
      {
        id: 1,
        author: "Rahul S.",
        text: "I got the same email! Reported to placement cell.",
        time: "2 days ago",
      },
      {
        id: 2,
        author: "Priya N.",
        text: 'The LinkedIn profile of the "HR" was created last month. Definitely a scam.',
        time: "1 day ago",
      },
    ],
  },
  {
    id: 2,
    title: "Legitimate Company — Verified Offer Letters",
    company: "Infosys Campus Connect",
    description:
      "Infosys campus recruitment process was completely transparent. Offer letters received within 2 weeks, no hidden fees, proper documentation. Highly recommend applying.",
    status: "verified",
    upvotes: 89,
    date: "Feb 15, 2026",
    comments: [
      {
        id: 1,
        author: "Ananya K.",
        text: "Confirmed! I joined through this process. Everything was smooth.",
        time: "5 days ago",
      },
    ],
  },
  {
    id: 3,
    title: "Misleading Job Description — Role Mismatch",
    company: "DataPro Analytics",
    description:
      'Applied for "Data Scientist" role but was asked to do sales calls after joining. The actual work had nothing to do with data science. Multiple colleagues faced the same issue.',
    status: "warning",
    upvotes: 34,
    date: "Feb 10, 2026",
    comments: [
      {
        id: 1,
        author: "Karthik I.",
        text: "Same experience. They use fancy titles to attract candidates.",
        time: "1 week ago",
      },
      {
        id: 2,
        author: "Divya M.",
        text: "Glassdoor reviews confirm this pattern. Avoid!",
        time: "6 days ago",
      },
      {
        id: 3,
        author: "Vikram R.",
        text: "Reported to college placement office. They are blacklisted now.",
        time: "5 days ago",
      },
    ],
  },
  {
    id: 4,
    title: "Genuine Startup — Great Learning Experience",
    company: "BuildFast Technologies",
    description:
      "Small startup but very genuine. Paid internship, real work, good mentorship. Founders are IIT alumni. Highly recommend for those wanting startup experience.",
    status: "verified",
    upvotes: 62,
    date: "Feb 5, 2026",
    comments: [
      {
        id: 1,
        author: "Sneha P.",
        text: "Currently interning here. Can confirm everything mentioned!",
        time: "2 weeks ago",
      },
    ],
  },
];

type InnerTab = "reports" | "safe-city";

const innerTabs: {
  id: InnerTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  glow: string;
}[] = [
  {
    id: "reports",
    label: "Feedback & Scam Alerts",
    icon: ShieldAlert,
    gradient: "linear-gradient(135deg, #f87171, #ef4444)",
    glow: "0 4px 15px rgba(239,68,68,0.4)",
  },
  {
    id: "safe-city",
    label: "Safe City Exploration (Solapur)",
    icon: MapPin,
    gradient: "linear-gradient(135deg, #34d399, #0891b2)",
    glow: "0 4px 15px rgba(8,145,178,0.4)",
  },
];

function ReportCard({ report }: { report: Report }) {
  const [expanded, setExpanded] = useState(false);
  const [upvoted, setUpvoted] = useState(false);
  const [upvotes, setUpvotes] = useState(report.upvotes);

  const isVerified = report.status === "verified";

  return (
    <Card
      className={`rounded-2xl shadow-card card-hover overflow-hidden border-l-4 ${
        isVerified ? "border-l-emerald-500" : "border-l-orange-500"
      }`}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                  isVerified
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                    : "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400"
                }`}
              >
                {isVerified ? (
                  <ShieldCheck className="w-3 h-3" />
                ) : (
                  <ShieldAlert className="w-3 h-3" />
                )}
                {isVerified ? "Verified" : "Warning"}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                🏢 {report.company}
              </span>
            </div>
            <h3 className="font-semibold text-sm leading-snug">
              {report.title}
            </h3>
          </div>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {report.date}
          </span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
          {report.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setUpvoted(!upvoted);
                setUpvotes((v) => (upvoted ? v - 1 : v + 1));
              }}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                upvoted
                  ? "text-teal"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ThumbsUp
                className={`w-3.5 h-3.5 ${upvoted ? "fill-teal" : ""}`}
              />
              {upvotes} helpful
            </button>
            <button
              type="button"
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              {report.comments.length} comments
              {expanded ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
            </button>
          </div>
          <button
            type="button"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-red-500 transition-colors"
          >
            <Flag className="w-3 h-3" /> Report
          </button>
        </div>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-border space-y-3 animate-fade-in-up">
            {report.comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal to-emerald flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                  {comment.author[0]}
                </div>
                <div className="flex-1 bg-muted rounded-xl px-3 py-2">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-semibold">
                      {comment.author}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {comment.time}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}
            <div className="flex gap-2 mt-2">
              <Input
                placeholder="Add a comment..."
                className="flex-1 h-8 text-xs rounded-xl"
              />
              <Button
                size="sm"
                className="h-8 text-xs rounded-xl bg-teal hover:bg-teal/90 text-white"
              >
                Post
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ReportsDashboard() {
  const [reports, setReports] = useState<Report[]>(initialReports);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
    file: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.company.trim() || !form.description.trim())
      return;

    const newReport: Report = {
      id: Date.now(),
      title: form.title,
      company: form.company,
      description: form.description,
      status: "warning",
      upvotes: 0,
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      comments: [],
      proofFile: form.file || undefined,
    };

    setReports((prev) => [newReport, ...prev]);
    setForm({ title: "", company: "", description: "", file: "" });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden bg-pattern-mesh">
        <div
          style={{
            background:
              "linear-gradient(135deg, #7f1d1d 0%, #991b1b 35%, #b91c1c 65%, #dc2626 100%)",
          }}
          className="absolute inset-0"
        />
        <img
          src="/assets/generated/hero-bg.dim_1920x400.png"
          alt=""
          className="w-full h-40 object-cover opacity-20"
        />
        <div className="absolute inset-0 flex items-center px-8">
          <div>
            <img
              src="/assets/generated/nirgrantha-logo-transparent.dim_400x80.png"
              alt="NIRGRANTHA"
              className="nirgrantha-section-logo mb-1"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <h1 className="font-display text-2xl font-bold text-white mb-1">
              Anti-Trap Feedback
            </h1>
            <p className="text-white/80 text-sm">
              Report scams, verify companies, and protect your peers
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            icon: ShieldAlert,
            label: "Scam Reports",
            value: reports.filter((r) => r.status === "warning").length,
            color: "text-orange-500 bg-orange-100",
          },
          {
            icon: ShieldCheck,
            label: "Verified Companies",
            value: reports.filter((r) => r.status === "verified").length,
            color: "text-emerald-600 bg-emerald-100",
          },
          {
            icon: CheckCircle2,
            label: "Students Protected",
            value: "1,240+",
            color: "text-teal bg-teal-light",
          },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="rounded-2xl shadow-card"
              style={{
                background:
                  "linear-gradient(135deg, #fff1f2 0%, #ffe4e6 50%, #fecdd3 100%)",
                borderLeft: "4px solid #e11d48",
              }}
            >
              <CardContent className="p-4 flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.color}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Submission Form */}
        <div className="lg:col-span-1">
          <Card className="rounded-2xl shadow-card sticky top-24">
            <CardContent className="p-6">
              <h2 className="font-display font-semibold text-base mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                Submit a Report
              </h2>
              {submitted && (
                <div className="mb-4 p-3 rounded-xl bg-emerald-100 text-emerald-700 text-sm flex items-center gap-2 animate-fade-in-up">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  Report submitted successfully!
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="atf-title"
                    className="text-xs font-medium text-muted-foreground mb-1.5 block"
                  >
                    Issue Title *
                  </label>
                  <Input
                    id="atf-title"
                    placeholder="e.g., Fake internship offer"
                    value={form.title}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, title: e.target.value }))
                    }
                    className="rounded-xl"
                    required
                    data-ocid="atf.input"
                  />
                </div>
                <div>
                  <label
                    htmlFor="atf-company"
                    className="text-xs font-medium text-muted-foreground mb-1.5 block"
                  >
                    Company Name *
                  </label>
                  <Input
                    id="atf-company"
                    placeholder="Tag the company"
                    value={form.company}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, company: e.target.value }))
                    }
                    className="rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="atf-description"
                    className="text-xs font-medium text-muted-foreground mb-1.5 block"
                  >
                    Description *
                  </label>
                  <Textarea
                    id="atf-description"
                    placeholder="Describe the issue in detail..."
                    value={form.description}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, description: e.target.value }))
                    }
                    className="rounded-xl resize-none"
                    rows={4}
                    required
                    data-ocid="atf.textarea"
                  />
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Upload Proof
                  </span>
                  <label
                    htmlFor="atf-proof"
                    className="border-2 border-dashed border-border rounded-xl p-4 text-center hover:border-teal/50 transition-colors cursor-pointer block"
                  >
                    <input
                      ref={fileInputRef}
                      id="atf-proof"
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setForm((f) => ({ ...f, file: file.name }));
                        }
                      }}
                    />
                    <Upload className="w-5 h-5 text-muted-foreground mx-auto mb-1.5" />
                    {form.file ? (
                      <p className="text-xs text-green-600 font-medium">
                        ✓ {form.file}
                      </p>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Click to upload screenshot or document
                      </p>
                    )}
                  </label>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold"
                  data-ocid="atf.submit_button"
                >
                  Submit Report
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Report Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-semibold text-lg">
              Community Reports
            </h2>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-orange-600 border-orange-300 bg-orange-50 dark:bg-orange-950/30"
              >
                <ShieldAlert className="w-3 h-3 mr-1" />
                {reports.filter((r) => r.status === "warning").length} Warnings
              </Badge>
              <Badge
                variant="outline"
                className="text-emerald-600 border-emerald-300 bg-emerald-50 dark:bg-emerald-950/30"
              >
                <ShieldCheck className="w-3 h-3 mr-1" />
                {reports.filter((r) => r.status === "verified").length} Verified
              </Badge>
            </div>
          </div>
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AntiTrapFeedback() {
  const [activeTab, setActiveTab] = useState<InnerTab>("reports");

  return (
    <div>
      {/* Inner Tab Bar */}
      <div
        className="sticky top-0 z-20 px-6 py-3"
        style={{
          background:
            "linear-gradient(135deg, rgba(127,29,29,0.95) 0%, rgba(153,27,27,0.95) 50%, rgba(185,28,28,0.95) 100%)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none">
          {innerTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                data-ocid={`atf.${tab.id}.tab`}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-2 text-sm whitespace-nowrap transition-all duration-200 cursor-pointer rounded-full"
                style={{
                  background: isActive
                    ? tab.gradient
                    : "rgba(255,255,255,0.15)",
                  color: "#111827",
                  fontWeight: isActive ? 700 : 600,
                  boxShadow: isActive ? tab.glow : "none",
                  transform: isActive ? "scale(1.03)" : "scale(1)",
                  border: isActive
                    ? "2px solid rgba(255,255,255,0.4)"
                    : "2px solid rgba(255,255,255,0.2)",
                }}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.id === "safe-city" && (
                  <span
                    className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{
                      background: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
                      color: "#15803d",
                    }}
                  >
                    NEW
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div key={activeTab} className="animate-fade-in-up">
        {activeTab === "reports" ? (
          <ReportsDashboard />
        ) : (
          <SafeCityExploration />
        )}
      </div>
    </div>
  );
}
