import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FACULTY_HUB_STORAGE_KEY,
  type FacultyGeneratedReport,
  type GitHubStats,
  type GoogleClassroomIntegration,
  type LeetCodeStats,
  type ResearchGatewayProfile,
  type SmartboardIntegration,
  createEmptyGoogleClassroomIntegration,
  createEmptyResearchGatewayProfile,
  createEmptySmartboardIntegration,
  generateFacultyNetworkingReport,
  loadFacultyIntegrationsStore,
  navigateFacultyHub,
  saveFacultyIntegrationsStore,
} from "@/utils/facultyHubStore";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  FileOutput,
  FileText,
  Github,
  Linkedin,
  Loader2,
  Monitor,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function StatusBadge({
  status,
}: { status: "connected" | "disconnected" | "syncing" }) {
  if (status === "connected") {
    return (
      <Badge className="bg-green-100 text-green-700 border-green-200 text-xs flex items-center gap-1">
        <CheckCircle2 className="w-3 h-3" /> Connected
      </Badge>
    );
  }
  if (status === "syncing") {
    return (
      <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs flex items-center gap-1">
        <RefreshCw className="w-3 h-3 animate-spin" /> Syncing
      </Badge>
    );
  }
  return (
    <Badge className="bg-gray-100 text-gray-600 border-gray-200 text-xs flex items-center gap-1">
      <XCircle className="w-3 h-3" /> Disconnected
    </Badge>
  );
}

function Panel({
  title,
  subtitle,
  icon,
  status,
  children,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  status: "connected" | "disconnected" | "syncing";
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-fhub-card rounded-2xl border border-fhub-border shadow-fhub p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-fhub-bg border border-fhub-border flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-fhub-heading text-sm">{title}</h3>
            <p className="text-xs text-fhub-muted leading-tight mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>
      {children}
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-fhub-bg rounded-lg p-2 text-center">
      <p className="text-base font-bold text-fhub-heading">{value}</p>
      <p className="text-[10px] text-fhub-muted">{label}</p>
    </div>
  );
}

function normalizeExternalUrl(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "Not yet";
  try {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch (_error) {
    return value;
  }
}

export default function Integrations() {
  const [stored] = useState(loadFacultyIntegrationsStore);

  const [ghInput, setGhInput] = useState(stored.githubUsername);
  const [ghData, setGhData] = useState<GitHubStats | null>(stored.githubData);
  const [ghLoading, setGhLoading] = useState(false);
  const [ghError, setGhError] = useState("");

  const [lcInput, setLcInput] = useState(stored.leetCodeUsername);
  const [lcData, setLcData] = useState<LeetCodeStats | null>(stored.leetCodeData);
  const [lcLoading, setLcLoading] = useState(false);
  const [lcError, setLcError] = useState("");

  const [liInput, setLiInput] = useState(stored.linkedinUrl);
  const [liSaved, setLiSaved] = useState(Boolean(stored.linkedinUrl));

  const [rgForm, setRgForm] = useState<ResearchGatewayProfile>(
    stored.researchGateway ?? createEmptyResearchGatewayProfile(),
  );
  const [rgProfile, setRgProfile] = useState<ResearchGatewayProfile | null>(
    stored.researchGateway,
  );

  const [gcForm, setGcForm] = useState<GoogleClassroomIntegration>(
    stored.googleClassroom ?? createEmptyGoogleClassroomIntegration(),
  );
  const [gcProfile, setGcProfile] = useState<GoogleClassroomIntegration | null>(
    stored.googleClassroom,
  );

  const [sbForm, setSbForm] = useState<SmartboardIntegration>(
    stored.smartboard ?? createEmptySmartboardIntegration(),
  );
  const [sbProfile, setSbProfile] = useState<SmartboardIntegration | null>(
    stored.smartboard,
  );
  const [sbStatus, setSbStatus] = useState<
    "connected" | "disconnected" | "syncing"
  >(stored.smartboard ? "connected" : "disconnected");

  const [reports, setReports] = useState<FacultyGeneratedReport[]>(stored.reports);

  useEffect(() => {
    saveFacultyIntegrationsStore({
      githubUsername: ghInput.trim(),
      githubData: ghData,
      leetCodeUsername: lcInput.trim(),
      leetCodeData: lcData,
      linkedinUrl: liSaved ? normalizeExternalUrl(liInput) : "",
      researchGateway: rgProfile,
      googleClassroom: gcProfile,
      smartboard: sbProfile,
      reports,
    });
  }, [
    gcProfile,
    ghData,
    ghInput,
    lcData,
    lcInput,
    liInput,
    liSaved,
    reports,
    rgProfile,
    sbProfile,
  ]);

  const activeIntegrations = [
    ghData,
    lcData,
    liSaved ? liInput : null,
    rgProfile,
    gcProfile,
    sbProfile,
  ].filter(Boolean).length;

  const latestReport = reports[0] ?? null;

  const reportPreview = useMemo(
    () =>
      generateFacultyNetworkingReport({
        githubUsername: ghInput.trim(),
        githubData: ghData,
        leetCodeUsername: lcInput.trim(),
        leetCodeData: lcData,
        linkedinUrl: liSaved ? normalizeExternalUrl(liInput) : "",
        researchGateway: rgProfile,
        googleClassroom: gcProfile,
        smartboard: sbProfile,
        reports,
      }),
    [gcProfile, ghData, ghInput, lcData, lcInput, liInput, liSaved, reports, rgProfile, sbProfile],
  );

  const handleGitHubConnect = async () => {
    if (!ghInput.trim()) return;
    setGhLoading(true);
    setGhError("");
    setGhData(null);
    try {
      const username = ghInput.trim();
      const [userRes, reposRes] = await Promise.all([
        fetch(`https://api.github.com/users/${username}`),
        fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=20`,
        ),
      ]);
      if (!userRes.ok) throw new Error("User not found");
      const user = await userRes.json();
      const repos = reposRes.ok ? await reposRes.json() : [];
      const langs = [
        ...new Set(
          repos.map((repo: { language: string | null }) => repo.language).filter(Boolean),
        ),
      ] as string[];
      setGhData({
        login: user.login,
        name: user.name || user.login,
        bio: user.bio || "",
        avatar_url: user.avatar_url,
        public_repos: user.public_repos,
        followers: user.followers,
        following: user.following,
        top_languages: langs.slice(0, 6),
      });
    } catch (_error) {
      setGhError("Could not fetch GitHub profile. Check the username.");
    } finally {
      setGhLoading(false);
    }
  };

  const handleLeetCodeConnect = async () => {
    if (!lcInput.trim()) return;
    setLcLoading(true);
    setLcError("");
    setLcData(null);
    try {
      const username = lcInput.trim();
      let data: Record<string, unknown> | null = null;
      try {
        const primary = await fetch(
          `https://leetcode-stats-api.herokuapp.com/${username}`,
        );
        if (primary.ok) {
          const payload = await primary.json();
          if (payload && payload.status !== "error") data = payload;
        }
      } catch (_error) {
        // fallback below
      }
      if (!data) {
        const fallback = await fetch(
          `https://alfa-leetcode-api.onrender.com/${username}`,
        );
        if (!fallback.ok) throw new Error("User not found");
        const payload = await fallback.json();
        if (!payload || payload.errors) throw new Error("User not found");
        data = {
          ...payload,
          totalSolved: payload.solvedProblem ?? payload.totalSolved,
          easySolved: payload.easySolvedProblem ?? payload.easySolved,
          mediumSolved: payload.mediumSolvedProblem ?? payload.mediumSolved,
          hardSolved: payload.hardSolvedProblem ?? payload.hardSolved,
        };
      }
      const resolvedData = data ?? {};
      setLcData({
        totalSolved: Number(resolvedData.totalSolved ?? 0),
        easySolved: Number(resolvedData.easySolved ?? 0),
        mediumSolved: Number(resolvedData.mediumSolved ?? 0),
        hardSolved: Number(resolvedData.hardSolved ?? 0),
        ranking: Number(resolvedData.ranking ?? 0),
        acceptanceRate: Number(resolvedData.acceptanceRate ?? 0),
      });
    } catch (_error) {
      setLcError("Could not fetch LeetCode stats. Check the username.");
    } finally {
      setLcLoading(false);
    }
  };

  const handleGenerateReport = () => {
    const report = generateFacultyNetworkingReport({
      githubUsername: ghInput.trim(),
      githubData: ghData,
      leetCodeUsername: lcInput.trim(),
      leetCodeData: lcData,
      linkedinUrl: liSaved ? normalizeExternalUrl(liInput) : "",
      researchGateway: rgProfile,
      googleClassroom: gcProfile,
      smartboard: sbProfile,
      reports,
    });
    setReports((current) => [report, ...current].slice(0, 8));
    navigateFacultyHub("networking");
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">
      <div className="space-y-3">
        <div>
          <h2 className="font-display font-bold text-fhub-heading text-xl">
            Connected Integrations
          </h2>
          <p className="text-sm text-fhub-muted mt-1">
            Connect faculty tools here, then generate a live report that flows
            into Faculty Networking.
          </p>
        </div>
        <div className="rounded-2xl border border-cyan-200 bg-gradient-to-r from-cyan-50 via-sky-50 to-violet-50 p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
              Hub Flow
            </p>
            <p className="text-sm font-semibold text-slate-900 mt-1">
              Integrations first, Faculty Networking next
            </p>
          </div>
          <Button
            variant="outline"
            className="rounded-xl border-cyan-200 text-cyan-700 hover:bg-cyan-100"
            onClick={() => navigateFacultyHub("networking")}
          >
            Open Faculty Networking
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <Panel
          title="GitHub"
          subtitle="Live repositories, followers, and language stack"
          icon={<Github className="w-5 h-5 text-gray-800" />}
          status={ghData ? "connected" : "disconnected"}
        >
          {ghData ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <img src={ghData.avatar_url} alt={ghData.login} className="w-9 h-9 rounded-full border" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-fhub-heading truncate">{ghData.name}</p>
                  <p className="text-xs text-fhub-muted truncate">@{ghData.login}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Metric label="Repos" value={ghData.public_repos} />
                <Metric label="Followers" value={ghData.followers} />
                <Metric label="Following" value={ghData.following} />
              </div>
              <div className="flex flex-wrap gap-1">
                {ghData.top_languages.map((language) => (
                  <span key={language} className="px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-medium border border-indigo-100">
                    {language}
                  </span>
                ))}
              </div>
              <Button variant="outline" size="sm" className="w-full text-xs border-fhub-border" onClick={() => { setGhData(null); setGhInput(""); }}>
                Disconnect
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {ghError && <p className="text-xs text-red-500">{ghError}</p>}
              <Label className="text-xs text-fhub-muted">GitHub username</Label>
              <Input placeholder="e.g. arihantmahajan" value={ghInput} onChange={(event) => setGhInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && handleGitHubConnect()} className="h-8 text-xs border-fhub-border bg-fhub-bg text-fhub-heading" />
              <Button onClick={handleGitHubConnect} disabled={ghLoading || !ghInput.trim()} className="w-full text-xs bg-fhub-accent hover:bg-fhub-accent-dark text-white rounded-xl h-8">
                {ghLoading ? <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Fetching...</> : <><Github className="w-3 h-3 mr-1" /> Connect GitHub</>}
              </Button>
            </div>
          )}
        </Panel>

        <Panel
          title="LeetCode"
          subtitle="Problem-solving depth for coding excellence"
          icon={<span className="text-orange-500 font-bold text-sm">LC</span>}
          status={lcData ? "connected" : "disconnected"}
        >
          {lcData ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <Metric label="Solved" value={lcData.totalSolved} />
                <Metric label="Ranking" value={`#${lcData.ranking.toLocaleString()}`} />
              </div>
              <div className="grid grid-cols-3 gap-1">
                <Metric label="Easy" value={lcData.easySolved} />
                <Metric label="Medium" value={lcData.mediumSolved} />
                <Metric label="Hard" value={lcData.hardSolved} />
              </div>
              <p className="text-[10px] text-fhub-muted text-center">
                Acceptance Rate: {lcData.acceptanceRate.toFixed(1)}%
              </p>
              <Button variant="outline" size="sm" className="w-full text-xs border-fhub-border" onClick={() => { setLcData(null); setLcInput(""); }}>
                Disconnect
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {lcError && <p className="text-xs text-red-500">{lcError}</p>}
              <Label className="text-xs text-fhub-muted">LeetCode username</Label>
              <Input placeholder="e.g. arihant_coder" value={lcInput} onChange={(event) => setLcInput(event.target.value)} onKeyDown={(event) => event.key === "Enter" && handleLeetCodeConnect()} className="h-8 text-xs border-fhub-border bg-fhub-bg text-fhub-heading" />
              <Button onClick={handleLeetCodeConnect} disabled={lcLoading || !lcInput.trim()} className="w-full text-xs bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-8">
                {lcLoading ? <><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Fetching...</> : <>Connect LeetCode</>}
              </Button>
            </div>
          )}
        </Panel>

        <Panel
          title="LinkedIn"
          subtitle="Professional visibility for faculty networking"
          icon={<Linkedin className="w-5 h-5 text-blue-600" />}
          status={liSaved ? "connected" : "disconnected"}
        >
          {liSaved ? (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100">
                <p className="text-xs font-medium text-blue-800">Profile linked</p>
                <p className="text-[10px] text-blue-600 truncate mt-1">{liInput}</p>
              </div>
              <Button className="w-full text-xs rounded-xl h-8 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => window.open(liInput, "_blank")}>
                <ExternalLink className="w-3 h-3 mr-1" /> Open Profile
              </Button>
              <Button variant="outline" size="sm" className="w-full text-xs border-fhub-border" onClick={() => { setLiSaved(false); setLiInput(""); }}>
                Unlink
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-xs text-fhub-muted">LinkedIn profile URL</Label>
              <Input placeholder="https://linkedin.com/in/yourname" value={liInput} onChange={(event) => setLiInput(event.target.value)} className="h-8 text-xs border-fhub-border bg-fhub-bg text-fhub-heading" />
              <Button onClick={() => { const normalized = normalizeExternalUrl(liInput); if (normalized) { setLiInput(normalized); setLiSaved(true); } }} disabled={!liInput.trim()} className="w-full text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-8">
                <Linkedin className="w-3 h-3 mr-1" /> Save Profile
              </Button>
            </div>
          )}
        </Panel>

        <Panel
          title="Research Gateway"
          subtitle="Research papers, citations, and academic profile"
          icon={<FileText className="w-5 h-5 text-emerald-600" />}
          status={rgProfile ? "connected" : "disconnected"}
        >
          {rgProfile ? (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                <p className="text-xs font-semibold text-emerald-900">{rgProfile.facultyName}</p>
                <p className="text-[10px] text-emerald-700 mt-1">{rgProfile.institute || "Institute profile connected"}</p>
                <p className="text-[10px] text-emerald-600 truncate mt-1">{rgProfile.profileUrl}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Metric label="Papers" value={rgProfile.papersPublished || "0"} />
                <Metric label="Citations" value={rgProfile.citations || "0"} />
              </div>
              <div className="rounded-lg bg-fhub-bg p-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-fhub-muted">Research Area</p>
                <p className="text-xs text-fhub-heading mt-1">{rgProfile.researchArea || "Add research specialization"}</p>
              </div>
              <Button className="w-full text-xs rounded-xl h-8 bg-emerald-600 hover:bg-emerald-700 text-white" onClick={() => window.open(rgProfile.profileUrl, "_blank")}>
                <ExternalLink className="w-3 h-3 mr-1" /> Open Research Profile
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="w-full text-xs border-fhub-border" onClick={() => { setRgForm(rgProfile); setRgProfile(null); }}>
                  Update Details
                </Button>
                <Button variant="outline" size="sm" className="w-full text-xs border-red-200 text-red-600 hover:bg-red-50" onClick={() => { setRgProfile(null); setRgForm(createEmptyResearchGatewayProfile()); }}>
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Input placeholder="Faculty name" value={rgForm.facultyName} onChange={(event) => setRgForm((current) => ({ ...current, facultyName: event.target.value }))} className="h-8 text-xs border-fhub-border bg-fhub-bg text-fhub-heading" />
              <Input placeholder="Research profile URL" value={rgForm.profileUrl} onChange={(event) => setRgForm((current) => ({ ...current, profileUrl: event.target.value }))} className="h-8 text-xs border-fhub-border bg-fhub-bg text-fhub-heading" />
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Institute" value={rgForm.institute} onChange={(event) => setRgForm((current) => ({ ...current, institute: event.target.value }))} className="h-8 text-xs border-fhub-border bg-fhub-bg text-fhub-heading" />
                <Input placeholder="Research area" value={rgForm.researchArea} onChange={(event) => setRgForm((current) => ({ ...current, researchArea: event.target.value }))} className="h-8 text-xs border-fhub-border bg-fhub-bg text-fhub-heading" />
                <Input placeholder="Papers published" value={rgForm.papersPublished} onChange={(event) => setRgForm((current) => ({ ...current, papersPublished: event.target.value }))} className="h-8 text-xs border-fhub-border bg-fhub-bg text-fhub-heading" />
                <Input placeholder="Citations" value={rgForm.citations} onChange={(event) => setRgForm((current) => ({ ...current, citations: event.target.value }))} className="h-8 text-xs border-fhub-border bg-fhub-bg text-fhub-heading" />
              </div>
              <Button onClick={() => { const normalized = normalizeExternalUrl(rgForm.profileUrl); if (!normalized || !rgForm.facultyName.trim()) return; setRgProfile({ ...rgForm, facultyName: rgForm.facultyName.trim(), profileUrl: normalized, institute: rgForm.institute.trim(), researchArea: rgForm.researchArea.trim(), papersPublished: rgForm.papersPublished.trim(), citations: rgForm.citations.trim() }); }} disabled={!rgForm.facultyName.trim() || !rgForm.profileUrl.trim()} className="w-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-8">
                <FileText className="w-3 h-3 mr-1" /> Save Research Profile
              </Button>
            </div>
          )}
        </Panel>

        <Panel
          title="Google Classroom"
          subtitle="Store classroom email, course name, and assignment counts"
          icon={<FileText className="w-5 h-5 text-green-600" />}
          status={gcProfile ? "connected" : "disconnected"}
        >
          {gcProfile ? (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-green-50 border border-green-100">
                <p className="text-xs font-semibold text-green-900">{gcProfile.classroomName}</p>
                <p className="text-[10px] text-green-700 mt-1">{gcProfile.instituteEmail}</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Metric label="Distributed" value={gcProfile.assignmentsDistributed} />
                <Metric label="Pending Review" value={gcProfile.pendingReview} />
              </div>
              <Button className="w-full text-xs rounded-xl h-8 bg-green-600 hover:bg-green-700 text-white" onClick={() => window.open(`https://accounts.google.com/AccountChooser?Email=${encodeURIComponent(gcProfile.instituteEmail)}&continue=${encodeURIComponent("https://classroom.google.com")}`, "_blank")}>
                <ExternalLink className="w-3 h-3 mr-1" /> Open Classroom
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="w-full text-xs border-fhub-border" onClick={() => { setGcForm(gcProfile); setGcProfile(null); }}>
                  Update Details
                </Button>
                <Button variant="outline" size="sm" className="w-full text-xs border-red-200 text-red-600 hover:bg-red-50" onClick={() => { setGcProfile(null); setGcForm(createEmptyGoogleClassroomIntegration()); }}>
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Input placeholder="Institute email" value={gcForm.instituteEmail} onChange={(event) => setGcForm((current) => ({ ...current, instituteEmail: event.target.value }))} className="h-8 text-xs border-fhub-border bg-fhub-bg text-fhub-heading" />
              <Input placeholder="Classroom name" value={gcForm.classroomName} onChange={(event) => setGcForm((current) => ({ ...current, classroomName: event.target.value }))} className="h-8 text-xs border-fhub-border bg-fhub-bg text-fhub-heading" />
              <div className="grid grid-cols-2 gap-2">
                <Input type="number" min="0" placeholder="Assignments" value={gcForm.assignmentsDistributed} onChange={(event) => setGcForm((current) => ({ ...current, assignmentsDistributed: Number(event.target.value) || 0 }))} className="h-8 text-xs border-fhub-border bg-fhub-bg text-fhub-heading" />
                <Input type="number" min="0" placeholder="Pending review" value={gcForm.pendingReview} onChange={(event) => setGcForm((current) => ({ ...current, pendingReview: Number(event.target.value) || 0 }))} className="h-8 text-xs border-fhub-border bg-fhub-bg text-fhub-heading" />
              </div>
              <Button onClick={() => { if (!gcForm.instituteEmail.trim() || !gcForm.classroomName.trim()) return; setGcProfile({ instituteEmail: gcForm.instituteEmail.trim(), classroomName: gcForm.classroomName.trim(), assignmentsDistributed: Number(gcForm.assignmentsDistributed) || 0, pendingReview: Number(gcForm.pendingReview) || 0 }); }} disabled={!gcForm.instituteEmail.trim() || !gcForm.classroomName.trim()} className="w-full text-xs bg-green-600 hover:bg-green-700 text-white rounded-xl h-8">
                <FileText className="w-3 h-3 mr-1" /> Save Classroom
              </Button>
            </div>
          )}
        </Panel>

        <Panel
          title="Smartboard Sync"
          subtitle="Connect a board and keep a live sync history"
          icon={<Monitor className="w-5 h-5 text-fhub-accent" />}
          status={sbStatus}
        >
          {sbProfile ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-fhub-bg border border-fhub-border">
                <Clock className="w-3.5 h-3.5 text-fhub-muted flex-shrink-0" />
                <span className="text-xs text-fhub-muted">
                  {sbProfile.classroomName} · Last synced {formatDateTime(sbProfile.lastSyncedAt)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Metric label="Total Syncs" value={sbProfile.syncCount} />
                <Metric label="State" value={sbProfile.lastSyncedAt ? "Live" : "Idle"} />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => { setSbStatus("syncing"); window.setTimeout(() => { const next = { ...sbProfile, syncCount: sbProfile.syncCount + 1, lastSyncedAt: new Date().toISOString() }; setSbProfile(next); setSbForm(next); setSbStatus("connected"); }, 1200); }} disabled={sbStatus === "syncing"} variant="outline" className="text-xs rounded-xl border-fhub-border text-fhub-heading hover:bg-fhub-bg">
                  {sbStatus === "syncing" ? <><RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Syncing...</> : <><RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Sync Now</>}
                </Button>
                <Button variant="outline" className="text-xs rounded-xl border-red-200 text-red-600 hover:bg-red-50" onClick={() => { setSbProfile(null); setSbForm(createEmptySmartboardIntegration()); setSbStatus("disconnected"); }}>
                  Disconnect
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Input placeholder="Smartboard / classroom name" value={sbForm.classroomName} onChange={(event) => setSbForm((current) => ({ ...current, classroomName: event.target.value }))} className="h-8 text-xs border-fhub-border bg-fhub-bg text-fhub-heading" />
              <Button onClick={() => { if (!sbForm.classroomName.trim()) return; setSbProfile({ classroomName: sbForm.classroomName.trim(), syncCount: Number(sbForm.syncCount) || 0, lastSyncedAt: sbForm.lastSyncedAt ?? null }); setSbStatus("connected"); }} disabled={!sbForm.classroomName.trim()} className="w-full text-xs bg-fhub-accent hover:bg-fhub-accent-dark text-white rounded-xl h-8">
                <Monitor className="w-3 h-3 mr-1" /> Connect Smartboard
              </Button>
            </div>
          )}
        </Panel>

        <Panel
          title="Report Generator"
          subtitle="Build a faculty networking report from connected tools"
          icon={<FileOutput className="w-5 h-5 text-purple-600" />}
          status={latestReport ? "connected" : "disconnected"}
        >
          <div className="rounded-xl border border-purple-100 bg-purple-50 p-3 space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <Metric label="Overall" value={reportPreview.overallScore} />
              <Metric label="Readiness" value={`${reportPreview.readinessScore}%`} />
              <Metric label="Connected" value={`${activeIntegrations}/6`} />
            </div>
            <p className="text-[10px] text-purple-700">
              Latest generated: {formatDateTime(latestReport?.createdAt)}
            </p>
            {latestReport && (
              <p className="text-[10px] text-purple-700">
                Stored in local app state under `{FACULTY_HUB_STORAGE_KEY}`
              </p>
            )}
          </div>
          <Button onClick={handleGenerateReport} disabled={activeIntegrations === 0} className="w-full text-sm rounded-xl bg-purple-600 hover:bg-purple-700 text-white">
            <FileOutput className="w-3.5 h-3.5 mr-1.5" />
            Generate Report & Open Networking
          </Button>
        </Panel>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Active Integrations", value: activeIntegrations, color: "text-green-600" },
          { label: "Reports Generated", value: reports.length, color: "text-purple-600" },
          { label: "Total Platforms", value: 7, color: "text-fhub-accent" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-fhub-card rounded-2xl border border-fhub-border shadow-fhub p-4 text-center">
            <p className={`text-3xl font-display font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-fhub-muted mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
