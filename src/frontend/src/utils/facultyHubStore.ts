export interface GitHubStats {
  login: string;
  name: string;
  bio: string;
  avatar_url: string;
  public_repos: number;
  followers: number;
  following: number;
  top_languages: string[];
}

export interface LeetCodeStats {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  acceptanceRate: number;
}

export interface ResearchGatewayProfile {
  facultyName: string;
  profileUrl: string;
  institute: string;
  researchArea: string;
  papersPublished: string;
  citations: string;
}

export interface GoogleClassroomIntegration {
  instituteEmail: string;
  classroomName: string;
  assignmentsDistributed: number;
  pendingReview: number;
}

export interface SmartboardIntegration {
  classroomName: string;
  lastSyncedAt: string | null;
  syncCount: number;
}

export interface FacultyGeneratedReport {
  id: string;
  createdAt: string;
  facultyName: string;
  department: string;
  connectedIntegrations: string[];
  reportTitle: string;
  readinessScore: number;
  teachingScore: number;
  contributionIndex: number;
  researchCount: number;
  feedbackRating: number;
  overallScore: number;
  standingLabel: string;
  summary: string;
  strengths: string[];
  improvements: string[];
}

export interface FacultyIntegrationsStore {
  githubUsername: string;
  githubData: GitHubStats | null;
  leetCodeUsername: string;
  leetCodeData: LeetCodeStats | null;
  linkedinUrl: string;
  researchGateway: ResearchGatewayProfile | null;
  googleClassroom: GoogleClassroomIntegration | null;
  smartboard: SmartboardIntegration | null;
  reports: FacultyGeneratedReport[];
}

export type FacultyHubSectionTarget = "integrations" | "networking";

export const FACULTY_HUB_STORAGE_KEY = "nirgrantha.faculty.integrations.v2";
export const FACULTY_HUB_STORE_EVENT = "nirgrantha:faculty-hub-store-updated";
export const FACULTY_HUB_NAVIGATION_EVENT =
  "nirgrantha:faculty-hub-navigation";

function isBrowser() {
  return typeof window !== "undefined";
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function parseWholeNumber(value: string) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toTitleCaseWords(value: string) {
  return value
    .split(/[\s._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function nameFromLinkedInUrl(url: string) {
  if (!url) return "";

  try {
    const normalized = url.startsWith("http") ? url : `https://${url}`;
    const parsed = new URL(normalized);
    const slug = parsed.pathname
      .split("/")
      .filter(Boolean)
      .pop();
    return slug ? toTitleCaseWords(slug) : "";
  } catch (_error) {
    return "";
  }
}

function nameFromInstituteEmail(email: string) {
  const localPart = email.split("@")[0]?.trim();
  return localPart ? toTitleCaseWords(localPart) : "";
}

function resolveFacultyName(store: FacultyIntegrationsStore) {
  return (
    store.researchGateway?.facultyName.trim() ||
    store.githubData?.name?.trim() ||
    nameFromLinkedInUrl(store.linkedinUrl) ||
    nameFromInstituteEmail(store.googleClassroom?.instituteEmail ?? "") ||
    store.githubData?.login?.trim() ||
    "Connected Faculty Profile"
  );
}

export function hasConnectedFacultyIntegrations(store: FacultyIntegrationsStore) {
  return Boolean(
    store.githubData ||
      store.leetCodeData ||
      store.linkedinUrl ||
      store.researchGateway ||
      store.googleClassroom ||
      store.smartboard,
  );
}

function inferDepartment(
  researchArea: string,
  classroomName: string,
  githubData: GitHubStats | null,
) {
  const content = `${researchArea} ${classroomName} ${githubData?.top_languages.join(" ") ?? ""}`.toLowerCase();

  if (
    content.includes("mechanical") ||
    content.includes("cad") ||
    content.includes("robotics")
  ) {
    return "Mechanical";
  }

  if (
    content.includes("civil") ||
    content.includes("structure") ||
    content.includes("construction")
  ) {
    return "Civil";
  }

  if (
    content.includes("ece") ||
    content.includes("electronics") ||
    content.includes("signal") ||
    content.includes("embedded")
  ) {
    return "ECE";
  }

  if (
    content.includes("eee") ||
    content.includes("electrical") ||
    content.includes("power")
  ) {
    return "EEE";
  }

  if (
    content.includes("ai") ||
    content.includes("machine learning") ||
    content.includes("data") ||
    content.includes("software") ||
    content.includes("computer") ||
    content.includes("python") ||
    content.includes("typescript")
  ) {
    return "CSE";
  }

  return "IT";
}

export function createEmptyResearchGatewayProfile(): ResearchGatewayProfile {
  return {
    facultyName: "",
    profileUrl: "",
    institute: "",
    researchArea: "",
    papersPublished: "",
    citations: "",
  };
}

export function createEmptyGoogleClassroomIntegration(): GoogleClassroomIntegration {
  return {
    instituteEmail: "",
    classroomName: "",
    assignmentsDistributed: 0,
    pendingReview: 0,
  };
}

export function createEmptySmartboardIntegration(): SmartboardIntegration {
  return {
    classroomName: "",
    lastSyncedAt: null,
    syncCount: 0,
  };
}

export function getDefaultFacultyIntegrationsStore(): FacultyIntegrationsStore {
  return {
    githubUsername: "",
    githubData: null,
    leetCodeUsername: "",
    leetCodeData: null,
    linkedinUrl: "",
    researchGateway: null,
    googleClassroom: null,
    smartboard: null,
    reports: [],
  };
}

export function loadFacultyIntegrationsStore(): FacultyIntegrationsStore {
  if (!isBrowser()) {
    return getDefaultFacultyIntegrationsStore();
  }

  try {
    const raw = window.localStorage.getItem(FACULTY_HUB_STORAGE_KEY);
    if (!raw) {
      return getDefaultFacultyIntegrationsStore();
    }

    const parsed = JSON.parse(raw) as Partial<FacultyIntegrationsStore>;
    return {
      ...getDefaultFacultyIntegrationsStore(),
      githubUsername:
        typeof parsed.githubUsername === "string" ? parsed.githubUsername : "",
      githubData: parsed.githubData ?? null,
      leetCodeUsername:
        typeof parsed.leetCodeUsername === "string"
          ? parsed.leetCodeUsername
          : "",
      leetCodeData: parsed.leetCodeData ?? null,
      linkedinUrl:
        typeof parsed.linkedinUrl === "string" ? parsed.linkedinUrl : "",
      researchGateway: parsed.researchGateway ?? null,
      googleClassroom: parsed.googleClassroom ?? null,
      smartboard: parsed.smartboard ?? null,
      reports: Array.isArray(parsed.reports) ? parsed.reports : [],
    };
  } catch (_error) {
    return getDefaultFacultyIntegrationsStore();
  }
}

export function saveFacultyIntegrationsStore(store: FacultyIntegrationsStore) {
  if (!isBrowser()) {
    return store;
  }

  window.localStorage.setItem(FACULTY_HUB_STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(
    new CustomEvent<FacultyIntegrationsStore>(FACULTY_HUB_STORE_EVENT, {
      detail: store,
    }),
  );

  return store;
}

export function subscribeFacultyIntegrationsStore(
  callback: (store: FacultyIntegrationsStore) => void,
) {
  if (!isBrowser()) {
    return () => undefined;
  }

  const onCustomUpdate = (event: Event) => {
    const nextStore = (event as CustomEvent<FacultyIntegrationsStore>).detail;
    callback(nextStore ?? loadFacultyIntegrationsStore());
  };

  const onStorage = (event: StorageEvent) => {
    if (event.key === FACULTY_HUB_STORAGE_KEY) {
      callback(loadFacultyIntegrationsStore());
    }
  };

  window.addEventListener(FACULTY_HUB_STORE_EVENT, onCustomUpdate);
  window.addEventListener("storage", onStorage);

  return () => {
    window.removeEventListener(FACULTY_HUB_STORE_EVENT, onCustomUpdate);
    window.removeEventListener("storage", onStorage);
  };
}

export function navigateFacultyHub(section: FacultyHubSectionTarget) {
  if (!isBrowser()) {
    return;
  }

  window.dispatchEvent(
    new CustomEvent(FACULTY_HUB_NAVIGATION_EVENT, {
      detail: { section },
    }),
  );
}

export function subscribeFacultyHubNavigation(
  callback: (section: FacultyHubSectionTarget) => void,
) {
  if (!isBrowser()) {
    return () => undefined;
  }

  const onNavigate = (event: Event) => {
    const section = (event as CustomEvent<{ section?: FacultyHubSectionTarget }>)
      .detail?.section;
    if (section === "integrations" || section === "networking") {
      callback(section);
    }
  };

  window.addEventListener(FACULTY_HUB_NAVIGATION_EVENT, onNavigate);

  return () => {
    window.removeEventListener(FACULTY_HUB_NAVIGATION_EVENT, onNavigate);
  };
}

export function generateFacultyNetworkingReport(
  store: FacultyIntegrationsStore,
) {
  const connectedIntegrations = [
    store.githubData ? "GitHub" : null,
    store.leetCodeData ? "LeetCode" : null,
    store.linkedinUrl ? "LinkedIn" : null,
    store.researchGateway ? "Research Gateway" : null,
    store.googleClassroom ? "Google Classroom" : null,
    store.smartboard ? "Smartboard Sync" : null,
  ].filter(Boolean) as string[];

  const researchCount = parseWholeNumber(
    store.researchGateway?.papersPublished ?? "0",
  );
  const citationCount = parseWholeNumber(store.researchGateway?.citations ?? "0");
  const assignmentCount = store.googleClassroom?.assignmentsDistributed ?? 0;
  const pendingReview = store.googleClassroom?.pendingReview ?? 0;
  const syncCount = store.smartboard?.syncCount ?? 0;
  const repoCount = store.githubData?.public_repos ?? 0;
  const followerCount = store.githubData?.followers ?? 0;
  const solvedCount = store.leetCodeData?.totalSolved ?? 0;
  const connectedCount = connectedIntegrations.length;

  const teachingScore = clamp(
    Math.round(
      64 +
        connectedCount * 4 +
        Math.min(assignmentCount, 24) * 0.8 +
        Math.min(syncCount, 10) * 2 -
        Math.min(pendingReview, 12) * 0.7,
    ),
    58,
    99,
  );

  const contributionIndex = clamp(
    Math.round(
      58 +
        connectedCount * 4 +
        Math.min(repoCount, 18) +
        Math.min(followerCount, 60) * 0.15 +
        Math.min(solvedCount, 220) * 0.07,
    ),
    54,
    99,
  );

  const researchStrength = clamp(
    Math.round(45 + Math.min(researchCount, 20) * 2 + Math.min(citationCount, 150) * 0.12),
    40,
    99,
  );

  const feedbackRating = Number(
    clamp(
      3.7 +
        connectedCount * 0.12 +
        Math.min(syncCount, 8) * 0.05 +
        Math.min(assignmentCount, 18) * 0.02,
      3.8,
      5,
    ).toFixed(1),
  );

  const overallScore = clamp(
    Math.round(
      teachingScore * 0.35 +
        contributionIndex * 0.3 +
        researchStrength * 0.2 +
        feedbackRating * 20 * 0.15,
    ),
    55,
    99,
  );

  const readinessScore = clamp(
    Math.round((connectedCount / 6) * 100),
    0,
    100,
  );

  const facultyName = resolveFacultyName(store);
  const department = inferDepartment(
    store.researchGateway?.researchArea ?? "",
    store.googleClassroom?.classroomName ?? "",
    store.githubData,
  );

  const strengths = [
    store.githubData
      ? `GitHub profile connected with ${repoCount} repositories`
      : null,
    store.leetCodeData
      ? `LeetCode practice mapped with ${solvedCount} solved problems`
      : null,
    store.googleClassroom
      ? `${assignmentCount} classroom assignments distributed live`
      : null,
    store.smartboard
      ? `${syncCount} smartboard sync cycles recorded`
      : null,
    store.researchGateway
      ? `${researchCount} published papers linked through Research Gateway`
      : null,
    store.linkedinUrl ? "Professional networking profile linked" : null,
  ].filter(Boolean) as string[];

  const improvements = [
    !store.githubData ? "Connect GitHub to reflect code contribution depth" : null,
    !store.leetCodeData ? "Connect LeetCode to include problem-solving rigor" : null,
    !store.linkedinUrl ? "Add LinkedIn for professional visibility tracking" : null,
    !store.researchGateway
      ? "Add Research Gateway profile for research strength and citations"
      : null,
    !store.googleClassroom
      ? "Connect Google Classroom to capture live teaching delivery"
      : null,
    !store.smartboard
      ? "Connect Smartboard Sync to prove classroom activity"
      : null,
  ].filter(Boolean) as string[];

  const standingLabel =
    overallScore >= 92
      ? "Elite Faculty Band"
      : overallScore >= 85
        ? "High Impact Faculty"
        : overallScore >= 76
          ? "Growth Momentum"
          : "Needs Stronger Integration";

  return {
    id: createId("faculty-report"),
    createdAt: new Date().toISOString(),
    facultyName,
    department,
    connectedIntegrations,
    reportTitle: `${facultyName} Integration Report`,
    readinessScore,
    teachingScore,
    contributionIndex,
    researchCount,
    feedbackRating,
    overallScore,
    standingLabel,
    summary: `${facultyName} is currently operating with ${connectedCount}/6 active integrations. The generated performance view combines live teaching signals, classroom delivery, coding presence, and research activity to estimate networking rank.`,
    strengths: strengths.length > 0 ? strengths : ["Start by connecting one faculty integration to generate a stronger profile."],
    improvements:
      improvements.length > 0
        ? improvements
        : ["Maintain the connected integrations and keep syncing updated classroom activity."],
  } satisfies FacultyGeneratedReport;
}
