import type { Principal } from "@icp-sdk/core/principal";
import {
  type GitHubProfileResult,
  type LeetCodeStatsResult,
  type Student,
  type Teacher,
  type TransformationInput,
  type TransformationOutput,
  type UserProfile,
  UserRole,
  type backendInterface,
} from "../backend";

const STORAGE_KEYS = {
  students: "nirgrantha.mock.students",
  teachers: "nirgrantha.mock.teachers",
  profiles: "nirgrantha.mock.profiles",
  roles: "nirgrantha.mock.roles",
  callerRole: "nirgrantha.mock.caller-role",
} as const;

type StoredRole = "admin" | "user" | "guest";

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function upsertByKey<T>(
  current: T[],
  incoming: T[],
  getKey: (value: T) => string,
): T[] {
  const next = [...current];

  for (const item of incoming) {
    const normalizedKey = getKey(item).trim().toLowerCase();
    const existingIndex = next.findIndex(
      (entry) => getKey(entry).trim().toLowerCase() === normalizedKey,
    );

    if (existingIndex >= 0) {
      next.splice(existingIndex, 1);
    }

    next.push(item);
  }

  return next;
}

function getStudents(): Student[] {
  return readJSON<Student[]>(STORAGE_KEYS.students, []);
}

function saveStudents(students: Student[]) {
  writeJSON(STORAGE_KEYS.students, students);
}

function getTeachers(): Teacher[] {
  return readJSON<Teacher[]>(STORAGE_KEYS.teachers, []);
}

function saveTeachers(teachers: Teacher[]) {
  writeJSON(STORAGE_KEYS.teachers, teachers);
}

function getProfiles(): Record<string, UserProfile> {
  return readJSON<Record<string, UserProfile>>(STORAGE_KEYS.profiles, {});
}

function saveProfiles(profiles: Record<string, UserProfile>) {
  writeJSON(STORAGE_KEYS.profiles, profiles);
}

function getRoles(): Record<string, StoredRole> {
  return readJSON<Record<string, StoredRole>>(STORAGE_KEYS.roles, {});
}

function saveRoles(roles: Record<string, StoredRole>) {
  writeJSON(STORAGE_KEYS.roles, roles);
}

function serializeRole(role: UserRole): StoredRole {
  if (role === UserRole.admin) return "admin";
  if (role === UserRole.user) return "user";
  return "guest";
}

function deserializeRole(role: StoredRole | undefined): UserRole {
  if (role === "admin") return UserRole.admin;
  if (role === "user") return UserRole.user;
  return UserRole.guest;
}

function getCurrentCallerKey(): string {
  if (typeof window === "undefined") {
    return "anonymous";
  }

  const instituteRole = window.localStorage.getItem("nirgrantha_role");
  return instituteRole ? `role:${instituteRole}` : "anonymous";
}

async function _initializeAccessControlWithSecret(secret: string): Promise<void> {
  if (!secret) return;

  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEYS.callerRole, "admin");
}

async function addStudent(student: Student): Promise<void> {
  const next = upsertByKey(getStudents(), [clone(student)], (value) => value.rollNumber);
  saveStudents(next);
}

async function addTeacher(teacher: Teacher): Promise<void> {
  const next = upsertByKey(getTeachers(), [clone(teacher)], (value) => value.employeeId);
  saveTeachers(next);
}

async function bulkAddStudents(newStudents: Student[]): Promise<void> {
  const next = upsertByKey(
    getStudents(),
    newStudents.map((student) => clone(student)),
    (value) => value.rollNumber,
  );
  saveStudents(next);
}

async function bulkAddTeachers(newTeachers: Teacher[]): Promise<void> {
  const next = upsertByKey(
    getTeachers(),
    newTeachers.map((teacher) => clone(teacher)),
    (value) => value.employeeId,
  );
  saveTeachers(next);
}

async function assignCallerUserRole(
  user: Principal,
  role: UserRole,
): Promise<void> {
  const roles = getRoles();
  roles[user.toString()] = serializeRole(role);
  saveRoles(roles);
}

async function fetchGitHubProfile(
  _username: string,
): Promise<GitHubProfileResult> {
  return {
    __kind__: "error",
    error:
      "Live GitHub proxy is unavailable in local export mode. Use the in-app direct GitHub connect flow instead.",
  };
}

async function fetchLeetCodeStats(
  _username: string,
): Promise<LeetCodeStatsResult> {
  return {
    __kind__: "error",
    error:
      "Live LeetCode proxy is unavailable in local export mode. Use the in-app direct LeetCode connect flow instead.",
  };
}

async function getCallerUserProfile(): Promise<UserProfile | null> {
  const profiles = getProfiles();
  return clone(profiles[getCurrentCallerKey()] ?? null);
}

async function getCallerUserRole(): Promise<UserRole> {
  if (typeof window !== "undefined") {
    const explicitRole = window.localStorage.getItem(STORAGE_KEYS.callerRole);
    if (explicitRole === "admin" || explicitRole === "user" || explicitRole === "guest") {
      return deserializeRole(explicitRole);
    }
  }

  return UserRole.user;
}

async function getStudent(rollNumber: string): Promise<Student | null> {
  const normalized = rollNumber.trim().toLowerCase();
  const student =
    getStudents().find(
      (entry) => entry.rollNumber.trim().toLowerCase() === normalized,
    ) ?? null;
  return clone(student);
}

async function getTeacher(employeeId: string): Promise<Teacher | null> {
  const normalized = employeeId.trim().toLowerCase();
  const teacher =
    getTeachers().find(
      (entry) => entry.employeeId.trim().toLowerCase() === normalized,
    ) ?? null;
  return clone(teacher);
}

async function getUserProfile(user: Principal): Promise<UserProfile | null> {
  const profiles = getProfiles();
  return clone(profiles[user.toString()] ?? null);
}

async function isCallerAdmin(): Promise<boolean> {
  return (await getCallerUserRole()) === UserRole.admin;
}

async function listAllStudents(): Promise<Student[]> {
  return clone(getStudents());
}

async function listAllTeachers(): Promise<Teacher[]> {
  return clone(getTeachers());
}

async function saveCallerUserProfile(profile: UserProfile): Promise<void> {
  const profiles = getProfiles();
  profiles[getCurrentCallerKey()] = clone(profile);
  saveProfiles(profiles);
}

async function transform(
  input: TransformationInput,
): Promise<TransformationOutput> {
  return {
    status: input.response.status,
    body: input.response.body,
    headers: input.response.headers,
  };
}

export const mockBackend: backendInterface = {
  _initializeAccessControlWithSecret,
  addStudent,
  addTeacher,
  assignCallerUserRole,
  bulkAddStudents,
  bulkAddTeachers,
  fetchGitHubProfile,
  fetchLeetCodeStats,
  getCallerUserProfile,
  getCallerUserRole,
  getStudent,
  getTeacher,
  getUserProfile,
  isCallerAdmin,
  listAllStudents,
  listAllTeachers,
  saveCallerUserProfile,
  transform,
};
