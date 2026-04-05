export type HackathonTrack = "software" | "hardware";

export interface ConnectedGitHubProfile {
  login: string;
  name: string;
  bio: string;
  avatarUrl?: string;
  publicRepos: number;
  followers: number;
  following: number;
  topLanguages: string[];
  profileUrl: string;
}

export interface ConnectedLeetCodeProfile {
  username: string;
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  ranking: number;
  acceptanceRate: number;
  profileUrl: string;
}

export interface ConnectedLinkedInProfile {
  displayName: string;
  profileUrl: string;
}

export interface ConnectedGoogleClassroomProfile {
  studentEmail: string;
  workspaceUrl: string;
  activeCourses: number;
  weeklyAssignments: number;
  focusAreas: string[];
}

export interface StudentTalentProfileStore {
  studentName: string;
  branch: string;
  year: number;
  semester: number;
  github: ConnectedGitHubProfile | null;
  leetcode: ConnectedLeetCodeProfile | null;
  linkedin: ConnectedLinkedInProfile | null;
  googleClassroom: ConnectedGoogleClassroomProfile | null;
  updatedAt: string | null;
}

export interface GeneratedHackathonProfile {
  name: string;
  branch: string;
  year: number;
  semester: number;
  primaryTrack: HackathonTrack;
  softwareScore: number;
  hardwareScore: number;
  connectedPlatforms: string[];
  skills: string[];
  recommendedDomains: string[];
  recommendedRoles: string[];
  projectCount: number;
  githubUrl: string;
  linkedinUrl: string;
  bio: string;
  readinessSummary: string;
}

const STORAGE_KEY = "nirgrantha.student.talent-profile";
const STORE_EVENT = "nirgrantha:student-talent-profile-updated";

const SOFTWARE_KEYWORDS = [
  "react",
  "javascript",
  "typescript",
  "python",
  "java",
  "node",
  "backend",
  "frontend",
  "web",
  "ml",
  "ai",
  "cloud",
  "docker",
  "aws",
  "sql",
  "data",
  "cybersecurity",
];

const HARDWARE_KEYWORDS = [
  "iot",
  "embedded",
  "arduino",
  "raspberry pi",
  "verilog",
  "vlsi",
  "fpga",
  "pcb",
  "robotics",
  "circuit",
  "electronics",
  "signal",
  "antenna",
  "matlab",
  "simulink",
  "microcontroller",
  "sensor",
  "hardware",
];

const DEFAULT_STORE: StudentTalentProfileStore = {
  studentName: "Arihant Mahajan",
  branch: "CSE",
  year: 3,
  semester: 5,
  github: null,
  leetcode: null,
  linkedin: null,
  googleClassroom: null,
  updatedAt: null,
};

function isBrowser() {
  return typeof window !== "undefined";
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean)));
}

function lowerIncludes(values: string[], keywordSet: string[]) {
  return values.some((value) => {
    const normalized = value.toLowerCase();
    return keywordSet.some((keyword) => normalized.includes(keyword));
  });
}

function buildSkills(store: StudentTalentProfileStore) {
  const githubSkills = store.github?.topLanguages ?? [];
  const leetcodeSkills: string[] = [];
  const classroomSkills = store.googleClassroom?.focusAreas ?? [];

  if (store.leetcode) {
    leetcodeSkills.push("Problem Solving");
    if (store.leetcode.totalSolved >= 150) {
      leetcodeSkills.push("DSA");
    }
    if (store.leetcode.hardSolved >= 10) {
      leetcodeSkills.push("Competitive Coding");
    }
  }

  if (store.linkedin) {
    leetcodeSkills.push("Professional Profile");
  }

  return unique([...githubSkills, ...leetcodeSkills, ...classroomSkills]).slice(
    0,
    10,
  );
}

function calculateSoftwareScore(store: StudentTalentProfileStore, skills: string[]) {
  const github = store.github;
  const leetcode = store.leetcode;

  let score = 18;

  if (github) {
    score += Math.min(25, github.publicRepos * 2);
    score += Math.min(12, github.followers > 0 ? Math.round(github.followers / 4) : 0);
    if (lowerIncludes(github.topLanguages, SOFTWARE_KEYWORDS)) {
      score += 18;
    }
  }

  if (leetcode) {
    score += Math.min(22, Math.round(leetcode.totalSolved / 12));
    score += Math.min(12, leetcode.hardSolved * 2);
    if (leetcode.acceptanceRate >= 55) {
      score += 6;
    }
  }

  if (store.linkedin) {
    score += 8;
  }

  if (store.googleClassroom) {
    score += Math.min(10, store.googleClassroom.activeCourses * 2);
    if (lowerIncludes(skills, ["ai", "web", "cloud", "cybersecurity", "data"])) {
      score += 8;
    }
  }

  return clamp(score, 0, 98);
}

function calculateHardwareScore(store: StudentTalentProfileStore, skills: string[]) {
  const github = store.github;
  const classroom = store.googleClassroom;

  let score = 16;

  if (github) {
    if (lowerIncludes(github.topLanguages, ["c", "c++", "matlab"])) {
      score += 14;
    }
    if (lowerIncludes(github.topLanguages, HARDWARE_KEYWORDS)) {
      score += 18;
    }
  }

  if (classroom) {
    score += Math.min(20, classroom.activeCourses * 4);
    score += Math.min(14, classroom.weeklyAssignments * 2);
    if (lowerIncludes(classroom.focusAreas, HARDWARE_KEYWORDS)) {
      score += 22;
    }
  }

  if (store.leetcode && store.leetcode.totalSolved >= 50) {
    score += 6;
  }

  return clamp(score, 0, 98);
}

function recommendedDomains(track: HackathonTrack, skills: string[]) {
  if (track === "hardware") {
    const domains = ["IoT & Hardware", "Embedded Systems", "Robotics"];
    if (lowerIncludes(skills, ["ai", "python", "ml"])) {
      domains.push("AIoT");
    }
    if (lowerIncludes(skills, ["signal", "electronics", "circuit"])) {
      domains.push("Smart Devices");
    }
    return unique(domains).slice(0, 5);
  }

  const domains = ["Web Dev", "AI/ML", "Open Innovation"];
  if (lowerIncludes(skills, ["cybersecurity", "security"])) {
    domains.push("Cybersecurity");
  }
  if (lowerIncludes(skills, ["flutter", "android", "ios", "mobile"])) {
    domains.push("Mobile Apps");
  }
  if (lowerIncludes(skills, ["cloud", "aws", "docker"])) {
    domains.push("Cloud & DevOps");
  }
  return unique(domains).slice(0, 5);
}

function recommendedRoles(track: HackathonTrack, skills: string[]) {
  if (track === "hardware") {
    const roles = ["Embedded Engineer", "Prototype Builder", "IoT Integrator"];
    if (lowerIncludes(skills, ["arduino", "sensor", "raspberry pi"])) {
      roles.push("Hardware Systems Lead");
    }
    if (lowerIncludes(skills, ["matlab", "signal"])) {
      roles.push("Signal / Control Analyst");
    }
    return unique(roles).slice(0, 4);
  }

  const roles = ["Full-Stack Builder", "Software Engineer", "Hackathon Pitch Lead"];
  if (lowerIncludes(skills, ["ai", "ml", "python", "data"])) {
    roles.push("AI / ML Engineer");
  }
  if (lowerIncludes(skills, ["cloud", "docker", "aws"])) {
    roles.push("Cloud / Backend Lead");
  }
  return unique(roles).slice(0, 4);
}

function connectedPlatforms(store: StudentTalentProfileStore) {
  const platforms: string[] = [];

  if (store.github) {
    platforms.push("GitHub");
  }
  if (store.leetcode) {
    platforms.push("LeetCode");
  }
  if (store.linkedin) {
    platforms.push("LinkedIn");
  }
  if (store.googleClassroom) {
    platforms.push("Google Classroom");
  }

  return platforms;
}

function normalizeStore(
  raw: Partial<StudentTalentProfileStore> | null | undefined,
): StudentTalentProfileStore {
  return {
    ...DEFAULT_STORE,
    ...raw,
    github: raw?.github ?? null,
    leetcode: raw?.leetcode ?? null,
    linkedin: raw?.linkedin ?? null,
    googleClassroom: raw?.googleClassroom ?? null,
    updatedAt: raw?.updatedAt ?? null,
  };
}

export function getStudentTalentProfileStore() {
  if (!isBrowser()) {
    return DEFAULT_STORE;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_STORE;
    }

    return normalizeStore(JSON.parse(raw) as Partial<StudentTalentProfileStore>);
  } catch {
    return DEFAULT_STORE;
  }
}

export function saveStudentTalentProfileStore(
  nextStore: StudentTalentProfileStore,
) {
  const normalized = normalizeStore({
    ...nextStore,
    updatedAt: new Date().toISOString(),
  });

  if (isBrowser()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    window.dispatchEvent(new CustomEvent(STORE_EVENT));
  }

  return normalized;
}

export function subscribeStudentTalentProfile(listener: () => void) {
  if (!isBrowser()) {
    return () => {};
  }

  const handle = () => listener();
  window.addEventListener(STORE_EVENT, handle);
  window.addEventListener("storage", handle);

  return () => {
    window.removeEventListener(STORE_EVENT, handle);
    window.removeEventListener("storage", handle);
  };
}

export function generateHackathonProfile(store: StudentTalentProfileStore) {
  const platforms = connectedPlatforms(store);
  if (platforms.length === 0) {
    return null;
  }

  const skills = buildSkills(store);
  const softwareScore = calculateSoftwareScore(store, skills);
  const hardwareScore = calculateHardwareScore(store, skills);
  const primaryTrack = softwareScore >= hardwareScore ? "software" : "hardware";
  const domains = recommendedDomains(primaryTrack, skills);
  const roles = recommendedRoles(primaryTrack, skills);
  const githubUrl = store.github?.profileUrl ?? "https://github.com";
  const linkedinUrl = store.linkedin?.profileUrl ?? "https://linkedin.com";
  const projectCount = store.github?.publicRepos ?? 0;
  const readinessSummary =
    primaryTrack === "hardware"
      ? "Hardware-ready profile generated for embedded, IoT, and device-focused hackathons."
      : "Software-ready profile generated for product, web, AI, and coding hackathons.";

  return {
    name: store.studentName,
    branch: store.branch,
    year: store.year,
    semester: store.semester,
    primaryTrack,
    softwareScore,
    hardwareScore,
    connectedPlatforms: platforms,
    skills,
    recommendedDomains: domains,
    recommendedRoles: roles,
    projectCount,
    githubUrl,
    linkedinUrl,
    bio: `${store.studentName} is ready for ${primaryTrack} hackathons with ${platforms.join(", ")} integration${platforms.length > 1 ? "s" : ""} and ${skills.length} detected skill signals.`,
    readinessSummary,
  } satisfies GeneratedHackathonProfile;
}
