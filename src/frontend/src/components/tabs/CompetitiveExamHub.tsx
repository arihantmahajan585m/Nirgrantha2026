import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getStudentTalentProfileStore } from "@/utils/studentTalentProfile";
import {
  getCompetitiveExamHubStore,
  saveCompetitiveExamHubStore,
  seededStudyGroups,
  type CompetitiveExamProfile,
  type CompetitiveStudyGroup,
} from "@/utils/competitiveExamHubStore";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  MessageCircle,
  Plus,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

const examOptions = [
  "All",
  "GATE",
  "MPSC",
  "CAT",
  "GRE",
  "Placements",
  "GSoC",
  "Coding",
];

const yearOptions = ["1", "2", "3", "4"];
const divisionOptions = ["A", "B", "C", "D", "Open"];

const peerStudents = [
  {
    id: 1,
    name: "Arihant Mahajan",
    division: "A",
    branch: "CSE",
    year: "3",
    exam: "GATE",
    avatar: "AM",
    score: "AIR ~3200 (Mock)",
    streak: 47,
    topics: ["DAA", "TOC", "DBMS"],
    color: "from-blue-500 to-indigo-600",
  },
  {
    id: 2,
    name: "Priya Sharma",
    division: "B",
    branch: "CSE",
    year: "4",
    exam: "Placements",
    avatar: "PS",
    score: "2 Offers (TCS, Infosys)",
    streak: 62,
    topics: ["DSA", "System Design", "SQL"],
    color: "from-purple-500 to-pink-600",
  },
  {
    id: 3,
    name: "Rohan Patil",
    division: "A",
    branch: "Mechanical",
    year: "2",
    exam: "GATE",
    avatar: "RP",
    score: "AIR 890 (Mock)",
    streak: 31,
    topics: ["Thermodynamics", "FM", "SOM"],
    color: "from-teal-500 to-emerald-600",
  },
  {
    id: 4,
    name: "Sneha Kulkarni",
    division: "C",
    branch: "IT",
    year: "3",
    exam: "CAT",
    avatar: "SK",
    score: "94.5 percentile (Mock)",
    streak: 44,
    topics: ["Quant", "VARC", "DILR"],
    color: "from-orange-500 to-red-500",
  },
  {
    id: 5,
    name: "Amit Desai",
    division: "B",
    branch: "E&TC",
    year: "4",
    exam: "GATE",
    avatar: "AD",
    score: "AIR 540 (Mock)",
    streak: 38,
    topics: ["Signals", "VLSI", "EMT"],
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: 6,
    name: "Rahul More",
    division: "A",
    branch: "CSE",
    year: "4",
    exam: "GSoC",
    avatar: "RM",
    score: "Proposal Submitted",
    streak: 25,
    topics: ["React", "Python", "Open Source"],
    color: "from-rose-500 to-pink-500",
  },
  {
    id: 7,
    name: "Neha Jadhav",
    division: "D",
    branch: "Civil",
    year: "2",
    exam: "MPSC",
    avatar: "NJ",
    score: "Prelims Prep",
    streak: 74,
    topics: ["Polity", "Geography", "Economy"],
    color: "from-amber-500 to-orange-500",
  },
  {
    id: 8,
    name: "Pooja Singh",
    division: "B",
    branch: "IT",
    year: "3",
    exam: "Placements",
    avatar: "PS",
    score: "1 Offer (Persistent)",
    streak: 29,
    topics: ["Java", "Spring Boot", "SQL"],
    color: "from-green-500 to-teal-500",
  },
];

type GroupDraft = {
  name: string;
  schedule: string;
  mode: CompetitiveStudyGroup["mode"];
  description: string;
};

const EMPTY_GROUP_DRAFT: GroupDraft = {
  name: "",
  schedule: "",
  mode: "Hybrid",
  description: "",
};

function buildProfileDraft(
  profile: CompetitiveExamProfile | null,
  defaultName: string,
): CompetitiveExamProfile {
  return (
    profile ?? {
      name: defaultName,
      division: "A",
      branch: "CSE",
      year: "3",
      preparingFor: "GATE",
      mockTestsWritten: 0,
    }
  );
}

function getReadinessLabel(mockTestsWritten: number) {
  if (mockTestsWritten >= 20) {
    return "Mock battle ready";
  }
  if (mockTestsWritten >= 8) {
    return "Consistent practice";
  }
  if (mockTestsWritten >= 1) {
    return "Warm-up phase";
  }
  return "Just getting started";
}

function doesGroupMatch(
  profile: CompetitiveExamProfile,
  group: CompetitiveStudyGroup,
) {
  const examMatch = group.exam === profile.preparingFor;
  const branchMatch =
    group.branch.toLowerCase().includes("all") ||
    group.branch.toLowerCase().includes(profile.branch.toLowerCase());
  const divisionMatch =
    group.division.toLowerCase().includes("open") ||
    group.division.toLowerCase().includes("mixed") ||
    group.division.toLowerCase().includes(profile.division.toLowerCase());

  return {
    examMatch,
    branchMatch,
    divisionMatch,
    recommended: examMatch && (branchMatch || divisionMatch),
  };
}

export default function CompetitiveExamHub() {
  const talentProfile = getStudentTalentProfileStore();
  const stored = getCompetitiveExamHubStore();
  const [selectedExam, setSelectedExam] = useState("All");
  const [showCreateProfile, setShowCreateProfile] = useState(!stored.profile);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [profile, setProfile] = useState<CompetitiveExamProfile | null>(
    stored.profile,
  );
  const [profileDraft, setProfileDraft] = useState<CompetitiveExamProfile>(
    buildProfileDraft(stored.profile, talentProfile.studentName),
  );
  const [customGroups, setCustomGroups] = useState<CompetitiveStudyGroup[]>(
    stored.customGroups,
  );
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>(
    stored.joinedGroupIds,
  );
  const [groupDraft, setGroupDraft] = useState<GroupDraft>(EMPTY_GROUP_DRAFT);

  useEffect(() => {
    saveCompetitiveExamHubStore({
      profile,
      customGroups,
      joinedGroupIds,
    });
  }, [profile, customGroups, joinedGroupIds]);

  const filteredStudents =
    selectedExam === "All"
      ? peerStudents
      : peerStudents.filter((student) => student.exam === selectedExam);

  const studyGroups = useMemo(
    () => [...customGroups, ...seededStudyGroups],
    [customGroups],
  );

  const visibleGroups =
    selectedExam === "All"
      ? studyGroups
      : studyGroups.filter((group) => group.exam === selectedExam);

  const recommendedGroups = profile
    ? studyGroups.filter((group) => doesGroupMatch(profile, group).recommended)
    : [];

  function updateProfileDraft<K extends keyof CompetitiveExamProfile>(
    key: K,
    value: CompetitiveExamProfile[K],
  ) {
    setProfileDraft((previous) => ({ ...previous, [key]: value }));
  }

  function handleSaveProfile() {
    const name = profileDraft.name.trim();
    const division = profileDraft.division.trim();
    const branch = profileDraft.branch.trim();
    const year = profileDraft.year.trim();
    const preparingFor = profileDraft.preparingFor.trim();
    const mockTestsWritten = Number(profileDraft.mockTestsWritten);

    if (!name || !division || !branch || !year || !preparingFor) {
      toast.error("Fill all profile details before saving.");
      return;
    }

    if (!Number.isFinite(mockTestsWritten) || mockTestsWritten < 0) {
      toast.error("Enter a valid mock-test count.");
      return;
    }

    const nextProfile = {
      name,
      division,
      branch,
      year,
      preparingFor,
      mockTestsWritten,
    } satisfies CompetitiveExamProfile;

    setProfile(nextProfile);
    setProfileDraft(nextProfile);
    setShowCreateProfile(false);
    toast.success("Competitive exam profile saved.");
  }

  function handleToggleGroup(group: CompetitiveStudyGroup) {
    const isJoined = joinedGroupIds.includes(group.id);

    setJoinedGroupIds((previous) =>
      isJoined
        ? previous.filter((groupId) => groupId !== group.id)
        : [...previous, group.id],
    );

    setCustomGroups((previous) =>
      previous.map((customGroup) =>
        customGroup.id === group.id
          ? {
              ...customGroup,
              members: Math.max(
                1,
                isJoined ? customGroup.members - 1 : customGroup.members + 1,
              ),
            }
          : customGroup,
      ),
    );

    toast.success(
      isJoined
        ? `Left ${group.name}.`
        : `Joined ${group.name}. Group discussions are ready.`,
    );
  }

  function handleCreateGroup() {
    if (!profile) {
      toast.error("Create your exam profile first to start a study group.");
      return;
    }

    if (!groupDraft.name.trim() || !groupDraft.schedule.trim()) {
      toast.error("Add the group name and schedule.");
      return;
    }

    const nextGroup: CompetitiveStudyGroup = {
      id: `custom-${Date.now().toString(36)}`,
      name: groupDraft.name.trim(),
      exam: profile.preparingFor,
      branch: profile.branch,
      division: profile.division,
      schedule: groupDraft.schedule.trim(),
      mode: groupDraft.mode,
      members: 1,
      capacity: 12,
      active: true,
      description:
        groupDraft.description.trim() ||
        `${profile.preparingFor} preparation circle for ${profile.branch} students from Division ${profile.division}.`,
      createdBy: profile.name,
    };

    setCustomGroups((previous) => [nextGroup, ...previous]);
    setJoinedGroupIds((previous) => [...previous, nextGroup.id]);
    setGroupDraft(EMPTY_GROUP_DRAFT);
    setShowCreateGroup(false);
    toast.success(`${nextGroup.name} is live and you have joined it.`);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6">
      <div className="relative overflow-hidden rounded-2xl bg-pattern-lines">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #92400e 0%, #b45309 35%, #d97706 65%, #f59e0b 100%)",
          }}
        />
        <img
          src="/assets/generated/hero-bg.dim_1920x400.png"
          alt=""
          className="h-40 w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 flex items-center justify-between px-8">
          <div>
            <img
              src="/assets/generated/nirgrantha-logo-transparent.dim_400x80.png"
              alt="NIRGRANTHA"
              className="nirgrantha-section-logo mb-1"
              onError={(event) => {
                (event.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            <h1 className="mb-1 font-display text-2xl font-bold text-white">
              Competitive Exam Hub
            </h1>
            <p className="text-sm text-white/80">
              Save your exam profile, track mocks, and join better study groups
            </p>
          </div>
          <Button
            onClick={() => setShowCreateProfile((previous) => !previous)}
            className="flex items-center gap-2 rounded-xl bg-white font-semibold text-indigo-700 shadow-lg hover:bg-white/90"
          >
            <Plus className="h-4 w-4" />
            {profile ? "Edit Exam Profile" : "Create Exam Profile"}
          </Button>
        </div>
      </div>

      {profile && (
        <Card className="overflow-hidden rounded-3xl border-0 shadow-lg shadow-amber-100">
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 px-6 py-5 text-white">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/80">
                  My Competitive Profile
                </p>
                <h2 className="mt-2 text-2xl font-black">{profile.name}</h2>
                <p className="mt-1 text-sm text-white/80">
                  Division {profile.division} | {profile.branch} | Year {profile.year}
                </p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 backdrop-blur-sm">
                <p className="text-[11px] uppercase tracking-[0.25em] text-white/70">
                  Preparing For
                </p>
                <p className="mt-2 text-2xl font-black">{profile.preparingFor}</p>
              </div>
            </div>
          </div>
          <CardContent className="grid gap-4 p-6 md:grid-cols-4">
            <div className="rounded-2xl bg-amber-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                Mock Tests Written
              </p>
              <p className="mt-2 text-3xl font-black text-slate-900">
                {profile.mockTestsWritten}
              </p>
            </div>
            <div className="rounded-2xl bg-emerald-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Readiness
              </p>
              <p className="mt-2 text-lg font-black text-slate-900">
                {getReadinessLabel(profile.mockTestsWritten)}
              </p>
            </div>
            <div className="rounded-2xl bg-sky-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                Recommended Groups
              </p>
              <p className="mt-2 text-3xl font-black text-slate-900">
                {recommendedGroups.length}
              </p>
            </div>
            <div className="rounded-2xl bg-violet-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-700">
                Joined Groups
              </p>
              <p className="mt-2 text-3xl font-black text-slate-900">
                {joinedGroupIds.length}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {showCreateProfile && (
        <Card className="animate-fade-in-up rounded-3xl border-amber-200 shadow-card">
          <CardContent className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                <Target className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Create Your Exam Profile
                </h3>
                <p className="text-sm text-slate-500">
                  Add your identity, target exam, and mock-test count so the hub
                  can match you with the right peers and study circles.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500">
                  Name
                </label>
                <Input
                  value={profileDraft.name}
                  onChange={(event) => updateProfileDraft("name", event.target.value)}
                  placeholder="Your full name"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500">
                  Division
                </label>
                <select
                  value={profileDraft.division}
                  onChange={(event) =>
                    updateProfileDraft("division", event.target.value)
                  }
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
                >
                  {divisionOptions.map((division) => (
                    <option key={division} value={division}>
                      {division}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500">
                  Branch
                </label>
                <Input
                  value={profileDraft.branch}
                  onChange={(event) =>
                    updateProfileDraft("branch", event.target.value)
                  }
                  placeholder="CSE / IT / Mechanical"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500">
                  Year
                </label>
                <select
                  value={profileDraft.year}
                  onChange={(event) => updateProfileDraft("year", event.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      Year {year}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500">
                  Preparing For
                </label>
                <select
                  value={profileDraft.preparingFor}
                  onChange={(event) =>
                    updateProfileDraft("preparingFor", event.target.value)
                  }
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
                >
                  {examOptions.slice(1).map((exam) => (
                    <option key={exam} value={exam}>
                      {exam}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500">
                  Mock Tests Written
                </label>
                <Input
                  type="number"
                  min="0"
                  value={String(profileDraft.mockTestsWritten)}
                  onChange={(event) =>
                    updateProfileDraft(
                      "mockTestsWritten",
                      Number(event.target.value || 0),
                    )
                  }
                  placeholder="0"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <Button
                onClick={handleSaveProfile}
                className="rounded-xl bg-teal text-white hover:bg-teal/90"
              >
                Save Exam Profile
              </Button>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => setShowCreateProfile(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <label
            htmlFor="exam-filter"
            className="text-sm font-medium text-muted-foreground"
          >
            Filter by Exam:
          </label>
          <Select value={selectedExam} onValueChange={setSelectedExam}>
            <SelectTrigger className="w-44 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {examOptions.map((exam) => (
                <SelectItem key={exam} value={exam}>
                  {exam}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="outline" className="text-muted-foreground">
            {filteredStudents.length} students
          </Badge>
        </div>

        <Button
          variant="outline"
          className="rounded-xl border-teal/30 text-teal hover:bg-teal-light"
          onClick={() => {
            if (!profile) {
              toast.error("Create your exam profile first to start a study group.");
              setShowCreateProfile(true);
              return;
            }
            setShowCreateGroup((previous) => !previous);
          }}
        >
          <Users className="mr-2 h-4 w-4" />
          {showCreateGroup ? "Close Group Builder" : "Create Study Group"}
        </Button>
      </div>

      {showCreateGroup && (
        <Card className="rounded-3xl border-teal-200 shadow-card">
          <CardContent className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-2xl bg-teal-100 p-3 text-teal-700">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Create A Better Study Group
                </h3>
                <p className="text-sm text-slate-500">
                  Your group will be auto-tagged for {profile?.preparingFor} and
                  your branch/division so the right students can find it.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500">
                  Group Name
                </label>
                <Input
                  value={groupDraft.name}
                  onChange={(event) =>
                    setGroupDraft((previous) => ({
                      ...previous,
                      name: event.target.value,
                    }))
                  }
                  placeholder="GATE DBMS Revision Circle"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500">
                  Weekly Schedule
                </label>
                <Input
                  value={groupDraft.schedule}
                  onChange={(event) =>
                    setGroupDraft((previous) => ({
                      ...previous,
                      schedule: event.target.value,
                    }))
                  }
                  placeholder="Tue, Thu, Sun - 7:30 PM"
                  className="rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-500">
                  Mode
                </label>
                <select
                  value={groupDraft.mode}
                  onChange={(event) =>
                    setGroupDraft((previous) => ({
                      ...previous,
                      mode: event.target.value as CompetitiveStudyGroup["mode"],
                    }))
                  }
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
                >
                  <option value="Offline">Offline</option>
                  <option value="Online">Online</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="block text-xs font-medium text-slate-500">
                  Focus / Description
                </label>
                <Input
                  value={groupDraft.description}
                  onChange={(event) =>
                    setGroupDraft((previous) => ({
                      ...previous,
                      description: event.target.value,
                    }))
                  }
                  placeholder="Mock-test review, PYQs, and concept revision"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="mt-5 flex gap-3">
              <Button
                onClick={handleCreateGroup}
                className="rounded-xl bg-teal text-white hover:bg-teal/90"
              >
                Launch Study Group
              </Button>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => setShowCreateGroup(false)}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filteredStudents.map((student) => {
          const matchCount = peerStudents.filter(
            (peer) => peer.id !== student.id && peer.exam === student.exam,
          ).length;

          return (
            <Card
              key={student.id}
              className="overflow-hidden rounded-2xl shadow-card card-hover"
            >
              <div className={`h-1.5 bg-gradient-to-r ${student.color}`} />
              <CardContent className="p-5">
                <div className="mb-3 flex items-start justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${student.color} text-sm font-bold text-white`}
                  >
                    {student.avatar}
                  </div>
                  {matchCount > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-light px-2 py-0.5 text-[10px] font-semibold text-teal">
                      <Zap className="h-2.5 w-2.5" />
                      {matchCount} match{matchCount > 1 ? "es" : ""}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold">{student.name}</h3>
                <p className="text-xs text-muted-foreground">
                  Division {student.division} | {student.branch} | Year {student.year}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Badge className="border-0 bg-indigo-100 px-2 py-0.5 text-[10px] text-indigo-700 hover:bg-indigo-100">
                    {student.exam}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">
                    {student.streak}d streak
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">
                  {student.score}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {student.topics.map((topic) => (
                    <span key={topic} className="badge-skill">
                      {topic}
                    </span>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    className="h-8 flex-1 rounded-lg bg-teal text-xs text-white hover:bg-teal/90"
                    onClick={() =>
                      toast.success(`Connected with ${student.name} for ${student.exam} prep.`)
                    }
                  >
                    Connect
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8 rounded-lg flex-shrink-0"
                    onClick={() =>
                      toast.success(`Opened discussion with ${student.name}.`)
                    }
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div>
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold">
              Smarter Study Groups
            </h2>
            <p className="text-sm text-slate-500">
              Groups now use your exam profile to highlight the best-fit circles
              first, and you can join or create them directly.
            </p>
          </div>
          {profile && recommendedGroups.length > 0 && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <strong>{recommendedGroups.length}</strong> recommended group
              {recommendedGroups.length > 1 ? "s" : ""} for {profile.preparingFor}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {visibleGroups.map((group) => {
            const isJoined = joinedGroupIds.includes(group.id);
            const match = profile ? doesGroupMatch(profile, group) : null;

            return (
              <Card
                key={group.id}
                className={`rounded-3xl shadow-card transition-all ${
                  match?.recommended
                    ? "border-emerald-300 shadow-emerald-100"
                    : "border-slate-200"
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-teal to-emerald text-white shadow-sm">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-slate-900">
                            {group.name}
                          </p>
                          <Badge className="border-0 bg-indigo-100 text-indigo-700">
                            {group.exam}
                          </Badge>
                          {match?.recommended && (
                            <Badge className="border-0 bg-emerald-100 text-emerald-700">
                              Recommended
                            </Badge>
                          )}
                          {group.createdBy && (
                            <Badge className="border-0 bg-amber-100 text-amber-700">
                              Created by you
                            </Badge>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                          {group.description}
                        </p>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant={isJoined ? "outline" : "default"}
                      className={`rounded-xl ${
                        isJoined
                          ? "border-emerald-300 text-emerald-700 hover:bg-emerald-50"
                          : "bg-teal text-white hover:bg-teal/90"
                      }`}
                      onClick={() => handleToggleGroup(group)}
                    >
                      {isJoined ? "Joined" : "Join Group"}
                    </Button>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Schedule
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {group.schedule}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Branch / Division
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {group.branch}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {group.division}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                        Members
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-900">
                        {group.members}/{group.capacity}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {group.mode} | {group.active ? "Active" : "Quiet"}
                      </p>
                    </div>
                  </div>

                  {match && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {match.examMatch && (
                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                          Same exam target
                        </span>
                      )}
                      {match.branchMatch && (
                        <span className="rounded-full bg-sky-100 px-3 py-1 text-[11px] font-semibold text-sky-700">
                          Branch match
                        </span>
                      )}
                      {match.divisionMatch && (
                        <span className="rounded-full bg-violet-100 px-3 py-1 text-[11px] font-semibold text-violet-700">
                          Division friendly
                        </span>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      onClick={() =>
                        toast.success(`Opened group discussion for ${group.name}.`)
                      }
                    >
                      <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                      Group Chat
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      onClick={() =>
                        toast.success(`Weekly planner opened for ${group.name}.`)
                      }
                    >
                      <Calendar className="mr-1.5 h-3.5 w-3.5" />
                      View Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card className="rounded-3xl border-amber-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-amber-100 p-3 text-amber-700">
                <Trophy className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Mock-Test Momentum
                </p>
                <p className="text-xs text-slate-500">
                  Based on the profile you saved
                </p>
              </div>
            </div>
            <p className="mt-4 text-3xl font-black text-slate-900">
              {profile?.mockTestsWritten ?? 0}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              mock tests written so far
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-emerald-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Peer Matches
                </p>
                <p className="text-xs text-slate-500">
                  Students targeting the same exam
                </p>
              </div>
            </div>
            <p className="mt-4 text-3xl font-black text-slate-900">
              {profile
                ? peerStudents.filter(
                    (student) => student.exam === profile.preparingFor,
                  ).length
                : 0}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              active peers in the hub
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-violet-200 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-violet-100 p-3 text-violet-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Best Next Step
                </p>
                <p className="text-xs text-slate-500">
                  Suggested from your current profile
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-900">
              {profile
                ? profile.mockTestsWritten < 5
                  ? "Write at least 5 mocks and join one recommended group this week."
                  : "Keep mock analysis strong and lead one study session this week."
                : "Create your profile to unlock guidance and study-group matching."}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
