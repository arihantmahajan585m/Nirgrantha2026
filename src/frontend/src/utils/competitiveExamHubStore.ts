export interface CompetitiveExamProfile {
  name: string;
  division: string;
  branch: string;
  year: string;
  preparingFor: string;
  mockTestsWritten: number;
}

export interface CompetitiveStudyGroup {
  id: string;
  name: string;
  exam: string;
  branch: string;
  division: string;
  schedule: string;
  mode: "Offline" | "Online" | "Hybrid";
  members: number;
  capacity: number;
  active: boolean;
  description: string;
  createdBy?: string;
}

export interface CompetitiveExamHubStore {
  profile: CompetitiveExamProfile | null;
  customGroups: CompetitiveStudyGroup[];
  joinedGroupIds: string[];
}

const STORAGE_KEY = "nirgrantha.student.competitive-exam-hub";

export const seededStudyGroups: CompetitiveStudyGroup[] = [
  {
    id: "gate-cse-core",
    name: "GATE CSE Core Batch",
    exam: "GATE",
    branch: "CSE",
    division: "Open to all divisions",
    schedule: "Mon, Wed, Sat - 7:00 PM",
    mode: "Hybrid",
    members: 14,
    capacity: 25,
    active: true,
    description: "Focused on DAA, TOC, DBMS, and weekly mock-test discussion.",
  },
  {
    id: "placements-sde-track",
    name: "Placement SDE Track",
    exam: "Placements",
    branch: "CSE / IT",
    division: "Division A and B",
    schedule: "Tue, Thu - 8:00 PM",
    mode: "Online",
    members: 22,
    capacity: 35,
    active: true,
    description: "Daily DSA practice, resume reviews, and company-specific prep.",
  },
  {
    id: "cat-quant-circle",
    name: "CAT Quant and LR Circle",
    exam: "CAT",
    branch: "All branches",
    division: "Mixed",
    schedule: "Sat, Sun - 5:30 PM",
    mode: "Offline",
    members: 8,
    capacity: 18,
    active: true,
    description: "Mock analysis, speed maths, and sectional practice strategy.",
  },
  {
    id: "gsoc-open-source-lab",
    name: "GSoC Open Source Lab",
    exam: "GSoC",
    branch: "CSE / IT",
    division: "Open to all divisions",
    schedule: "Fri - 6:30 PM",
    mode: "Hybrid",
    members: 6,
    capacity: 15,
    active: false,
    description: "Mentored PR reviews, proposal writing, and repo shortlisting.",
  },
];

const DEFAULT_STORE: CompetitiveExamHubStore = {
  profile: null,
  customGroups: [],
  joinedGroupIds: [],
};

function isBrowser() {
  return typeof window !== "undefined";
}

function normalizeStore(
  raw: Partial<CompetitiveExamHubStore> | null | undefined,
): CompetitiveExamHubStore {
  return {
    profile: raw?.profile ?? null,
    customGroups: raw?.customGroups ?? [],
    joinedGroupIds: raw?.joinedGroupIds ?? [],
  };
}

export function getCompetitiveExamHubStore() {
  if (!isBrowser()) {
    return DEFAULT_STORE;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_STORE;
    }

    return normalizeStore(JSON.parse(raw) as Partial<CompetitiveExamHubStore>);
  } catch {
    return DEFAULT_STORE;
  }
}

export function saveCompetitiveExamHubStore(store: CompetitiveExamHubStore) {
  const normalized = normalizeStore(store);

  if (isBrowser()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  }

  return normalized;
}
