import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  type FacultyGeneratedReport,
  generateFacultyNetworkingReport,
  hasConnectedFacultyIntegrations,
  loadFacultyIntegrationsStore,
  subscribeFacultyIntegrationsStore,
} from "@/utils/facultyHubStore";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Crown,
  Shield,
  Star,
  TrendingUp,
  Trophy,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface FacultyCardData {
  id: number;
  name: string;
  department: string;
  designation: string;
  teachingScore: number;
  contributionIndex: number;
  researchCount: number;
  feedbackRating: number;
  overallScore: number;
  improvements: string[];
  avatar: string;
}

const facultySeed: FacultyCardData[] = [
  { id: 1, name: "Dr. Rajesh Kumar", department: "CSE", designation: "Professor", teachingScore: 94, contributionIndex: 88, researchCount: 12, feedbackRating: 4.8, overallScore: 92, avatar: "RK", improvements: ["Increase industry collaboration", "Mentor more student projects"] },
  { id: 2, name: "Prof. Anita Sharma", department: "IT", designation: "Associate Professor", teachingScore: 89, contributionIndex: 82, researchCount: 8, feedbackRating: 4.6, overallScore: 87, avatar: "AS", improvements: ["Publish more research papers", "Attend national conferences"] },
  { id: 3, name: "Dr. Suresh Nair", department: "ECE", designation: "Professor", teachingScore: 91, contributionIndex: 90, researchCount: 15, feedbackRating: 4.7, overallScore: 91, avatar: "SN", improvements: ["Improve student engagement scores", "Lead more workshops"] },
  { id: 4, name: "Prof. Meena Patel", department: "Mechanical", designation: "Assistant Professor", teachingScore: 78, contributionIndex: 65, researchCount: 4, feedbackRating: 4.2, overallScore: 72, avatar: "MP", improvements: ["Increase research publications", "Improve assignment feedback turnaround", "Participate in FDPs"] },
  { id: 5, name: "Dr. Vikram Joshi", department: "Civil", designation: "Professor", teachingScore: 86, contributionIndex: 79, researchCount: 10, feedbackRating: 4.5, overallScore: 84, avatar: "VJ", improvements: ["Increase hackathon mentorship", "Contribute to curriculum design"] },
  { id: 6, name: "Prof. Kavitha Reddy", department: "EEE", designation: "Associate Professor", teachingScore: 82, contributionIndex: 74, researchCount: 6, feedbackRating: 4.3, overallScore: 79, avatar: "KR", improvements: ["Publish in indexed journals", "Increase student project guidance"] },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((step) => (
        <Star
          key={step}
          className={`w-3.5 h-3.5 ${step <= Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : step - 0.5 <= rating ? "text-yellow-400 fill-yellow-200" : "text-gray-300"}`}
        />
      ))}
      <span className="text-xs font-medium text-fhub-heading ml-1">{rating}</span>
    </div>
  );
}

function formatDateTime(value: string) {
  try {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch (_error) {
    return value;
  }
}

function toAvatar(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function toIntegratedFaculty(report: FacultyGeneratedReport): FacultyCardData {
  return {
    id: 999,
    name: report.facultyName,
    department: report.department,
    designation: "Live Integrated Faculty Profile",
    teachingScore: report.teachingScore,
    contributionIndex: report.contributionIndex,
    researchCount: report.researchCount,
    feedbackRating: report.feedbackRating,
    overallScore: report.overallScore,
    improvements: report.improvements,
    avatar: toAvatar(report.facultyName) || "CF",
  };
}

export default function FacultyNetworking() {
  const [store, setStore] = useState(loadFacultyIntegrationsStore);
  const [deptFilter, setDeptFilter] = useState("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const leaderboardRef = useRef<HTMLDivElement | null>(null);
  const topRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => subscribeFacultyIntegrationsStore(setStore), []);

  const latestReport = store.reports[0] ?? null;
  const liveReport = useMemo(() => {
    if (!hasConnectedFacultyIntegrations(store)) {
      return null;
    }

    return generateFacultyNetworkingReport(store);
  }, [store]);
  const integratedFaculty = liveReport ? toIntegratedFaculty(liveReport) : null;

  const facultyPool = useMemo(() => {
    return integratedFaculty
      ? [integratedFaculty, ...facultySeed.filter((item) => item.id !== integratedFaculty.id)]
      : facultySeed;
  }, [integratedFaculty]);

  const ranked = useMemo(
    () => [...facultyPool].sort((a, b) => b.overallScore - a.overallScore),
    [facultyPool],
  );

  const departments = useMemo(
    () => ["All", ...new Set(facultyPool.map((item) => item.department))],
    [facultyPool],
  );

  const filtered =
    deptFilter === "All"
      ? facultyPool
      : facultyPool.filter((faculty) => faculty.department === deptFilter);

  const currentRank = integratedFaculty
    ? ranked.findIndex((item) => item.id === integratedFaculty.id) + 1
    : null;

  return (
    <div ref={topRef} className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={deptFilter} onValueChange={setDeptFilter}>
          <SelectTrigger className="w-44 border-fhub-border bg-white dark:bg-fhub-card text-fhub-heading text-sm">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            {departments.map((department) => (
              <SelectItem key={department} value={department}>
                {department === "All" ? "All Departments" : department}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          className="rounded-xl border-fhub-border text-fhub-heading"
          onClick={() =>
            leaderboardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
          }
        >
          <Trophy className="w-4 h-4 mr-2" /> Go To Leaderboard Footer
        </Button>
        <Button className="ml-auto bg-fhub-accent hover:bg-fhub-accent-dark text-white text-sm rounded-xl flex items-center gap-2">
          <Shield className="w-4 h-4" /> HOD Dashboard Access
        </Button>
      </div>

      {liveReport ? (
        <div className="bg-white dark:bg-fhub-card rounded-2xl border border-fhub-border shadow-fhub p-6 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-fhub-accent">
                Live Faculty Position
              </p>
              <h3 className="font-display font-semibold text-fhub-heading text-lg mt-2">
                {liveReport.reportTitle}
              </h3>
              <p className="text-sm text-fhub-muted mt-1">{liveReport.summary}</p>
            </div>
            <div className="bg-fhub-bg rounded-2xl border border-fhub-border px-4 py-3 text-center min-w-[170px]">
              <p className="text-xs text-fhub-muted">Current Standing</p>
              <p className="text-3xl font-display font-bold text-fhub-accent mt-1">
                {currentRank ? `#${currentRank}` : "--"}
              </p>
              <p className="text-xs text-fhub-muted mt-1">{liveReport.standingLabel}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="rounded-xl bg-fhub-bg p-3">
              <p className="text-[10px] text-fhub-muted uppercase tracking-[0.18em]">Overall</p>
              <p className="text-2xl font-display font-bold text-fhub-accent mt-1">{liveReport.overallScore}</p>
            </div>
            <div className="rounded-xl bg-fhub-bg p-3">
              <p className="text-[10px] text-fhub-muted uppercase tracking-[0.18em]">Teaching</p>
              <p className="text-2xl font-display font-bold text-fhub-accent mt-1">{liveReport.teachingScore}</p>
            </div>
            <div className="rounded-xl bg-fhub-bg p-3">
              <p className="text-[10px] text-fhub-muted uppercase tracking-[0.18em]">Contribution</p>
              <p className="text-2xl font-display font-bold text-fhub-accent mt-1">{liveReport.contributionIndex}</p>
            </div>
            <div className="rounded-xl bg-fhub-bg p-3">
              <p className="text-[10px] text-fhub-muted uppercase tracking-[0.18em]">Live Refresh</p>
              <p className="text-xs font-semibold text-fhub-heading mt-2">{formatDateTime(liveReport.createdAt)}</p>
            </div>
          </div>
          {latestReport && (
            <div className="rounded-xl border border-fhub-border bg-fhub-bg p-3">
              <p className="text-xs font-semibold text-fhub-heading">
                Latest saved report snapshot
              </p>
              <p className="text-xs text-fhub-muted mt-1">
                Generated on {formatDateTime(latestReport.createdAt)}
              </p>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {liveReport.connectedIntegrations.map((integration) => (
              <Badge key={integration} className="bg-fhub-badge-bg text-fhub-accent border-fhub-accent/20">
                {integration}
              </Badge>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-fhub-card rounded-2xl border border-dashed border-fhub-border shadow-fhub p-6 text-center">
          <p className="text-sm font-semibold text-fhub-heading">
            No connected faculty profile yet
          </p>
          <p className="text-xs text-fhub-muted mt-2">
            Connect your integrations first. Your live faculty profile and rank
            will appear here automatically.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((faculty) => {
          const rank = ranked.findIndex((item) => item.id === faculty.id) + 1;
          const isExpanded = expandedId === faculty.id;
          const isIntegratedProfile = faculty.id === 999;

          return (
            <div key={faculty.id} className="bg-white dark:bg-fhub-card rounded-2xl border border-fhub-border shadow-fhub overflow-hidden">
              <div className={`p-4 ${isIntegratedProfile ? "bg-gradient-to-r from-cyan-600 to-violet-600" : "bg-gradient-to-r from-fhub-accent to-blue-600"}`}>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center text-white font-bold text-base">
                    {faculty.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">{faculty.name}</p>
                    <p className="text-xs text-blue-100">{faculty.designation}</p>
                    <Badge className="mt-1 bg-white/20 text-white border-white/30 text-[10px]">
                      {faculty.department}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-blue-100">Rank</p>
                    <p className="text-2xl font-display font-bold text-white">#{rank}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-xl bg-fhub-bg">
                    <div className="flex items-center gap-1.5 mb-1">
                      <TrendingUp className="w-3.5 h-3.5 text-fhub-accent" />
                      <span className="text-[10px] text-fhub-muted">Teaching</span>
                    </div>
                    <p className="text-lg font-bold text-fhub-accent">{faculty.teachingScore}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-fhub-bg">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Users className="w-3.5 h-3.5 text-fhub-accent" />
                      <span className="text-[10px] text-fhub-muted">Contribution</span>
                    </div>
                    <p className="text-lg font-bold text-fhub-accent">{faculty.contributionIndex}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-fhub-bg">
                    <div className="flex items-center gap-1.5 mb-1">
                      <BookOpen className="w-3.5 h-3.5 text-fhub-accent" />
                      <span className="text-[10px] text-fhub-muted">Research</span>
                    </div>
                    <p className="text-lg font-bold text-fhub-accent">{faculty.researchCount}</p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-fhub-bg">
                    <span className="text-[10px] text-fhub-muted">Feedback</span>
                    <div className="mt-1">
                      <StarRating rating={faculty.feedbackRating} />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-fhub-muted">Overall Score</span>
                    <span className="text-xs font-bold text-fhub-accent">{faculty.overallScore}/100</span>
                  </div>
                  <div className="h-2 rounded-full bg-fhub-bg overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-fhub-accent to-blue-500" style={{ width: `${faculty.overallScore}%` }} />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : faculty.id)}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-fhub-bg hover:bg-fhub-badge-bg transition-colors cursor-pointer"
                >
                  <span className="text-xs font-medium text-fhub-heading">
                    Suggestions To Improve
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-fhub-muted" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-fhub-muted" />
                  )}
                </button>

                {isExpanded && (
                  <div className="space-y-1.5 animate-fade-in-up">
                    {faculty.improvements.map((item, index) => (
                      <div key={`${faculty.id}-${index}`} className="flex items-start gap-2 p-2 rounded-lg bg-orange-50 border border-orange-100">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 flex-shrink-0" />
                        <span className="text-xs text-orange-700">{item}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div ref={leaderboardRef} className="bg-white dark:bg-fhub-card rounded-2xl border border-fhub-border shadow-fhub p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h3 className="font-display font-semibold text-fhub-heading text-base flex items-center gap-2">
            <Crown className="w-4 h-4 text-yellow-500" />
            Faculty Performance Leaderboard
          </h3>
          <Button
            variant="outline"
            className="rounded-xl border-fhub-border text-fhub-heading"
            onClick={() => topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          >
            Back To Top
          </Button>
        </div>
        <div className="space-y-2">
          {ranked.map((faculty, index) => (
            <div
              key={faculty.id}
              className={`flex items-center gap-4 p-3 rounded-xl ${
                index === 0
                  ? "bg-yellow-50 border border-yellow-200"
                  : index === 1
                    ? "bg-gray-50 border border-gray-200"
                    : index === 2
                      ? "bg-orange-50 border border-orange-200"
                      : "bg-fhub-bg border border-fhub-border"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index === 0 ? "bg-yellow-400 text-white" : index === 1 ? "bg-gray-400 text-white" : index === 2 ? "bg-orange-400 text-white" : "bg-fhub-badge-bg text-fhub-accent"}`}>
                {index + 1}
              </div>
              <div className="w-9 h-9 rounded-full bg-fhub-accent flex items-center justify-center text-white text-xs font-bold">
                {faculty.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-fhub-heading truncate">{faculty.name}</p>
                <p className="text-xs text-fhub-muted">
                  {faculty.department} · {faculty.designation}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-fhub-muted">Overall</p>
                <p className="text-lg font-display font-bold text-fhub-accent">{faculty.overallScore}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
