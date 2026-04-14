import type {
  GitHubProfileResult,
  LeetCodeStatsResult,
  Student,
  Teacher,
  TransformationInput,
  TransformationOutput,
  UserProfile,
  backendInterface,
} from "../backend";
import { UserRole } from "../backend";

interface ApiHealth {
  ok: boolean;
  sharedDatabase: boolean;
}

async function requestJson<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const response = await fetch(path, {
    ...options,
    headers: {
      "content-type": "application/json",
      ...(options?.headers ?? {}),
    },
  });
  const data = (await response.json()) as T & { ok?: boolean; error?: string };
  if (!response.ok || data.ok === false) {
    throw new Error(data.error ?? `Request failed: ${response.status}`);
  }
  return data;
}

async function hasSharedDatabase(): Promise<boolean> {
  try {
    const health = await requestJson<ApiHealth>("/api/health");
    return health.ok && health.sharedDatabase;
  } catch {
    return false;
  }
}

function emptyTransformation(input: TransformationInput): TransformationOutput {
  return {
    status: input.response.status,
    body: input.response.body,
    headers: input.response.headers,
  };
}

export async function createCloudflareBackendActor(): Promise<backendInterface | null> {
  if (!(await hasSharedDatabase())) return null;

  return {
    async _initializeAccessControlWithSecret() {},
    async addStudent(student: Student) {
      await requestJson("/api/students", {
        method: "POST",
        body: JSON.stringify({ students: [student] }),
      });
    },
    async addTeacher(teacher: Teacher) {
      await requestJson("/api/teachers", {
        method: "POST",
        body: JSON.stringify({ teachers: [teacher] }),
      });
    },
    async assignCallerUserRole() {},
    async bulkAddStudents(students: Student[]) {
      await requestJson("/api/students", {
        method: "POST",
        body: JSON.stringify({ students }),
      });
    },
    async bulkAddTeachers(teachers: Teacher[]) {
      await requestJson("/api/teachers", {
        method: "POST",
        body: JSON.stringify({ teachers }),
      });
    },
    async fetchGitHubProfile(): Promise<GitHubProfileResult> {
      return {
        __kind__: "error",
        error: "Use the in-app direct GitHub integration flow.",
      };
    },
    async fetchLeetCodeStats(): Promise<LeetCodeStatsResult> {
      return {
        __kind__: "error",
        error: "Use the in-app direct LeetCode integration flow.",
      };
    },
    async getCallerUserProfile(): Promise<UserProfile | null> {
      return null;
    },
    async getCallerUserRole(): Promise<UserRole> {
      return UserRole.admin;
    },
    async getStudent(rollNumber: string): Promise<Student | null> {
      const data = await requestJson<{ students: Student[] }>("/api/students");
      return (
        data.students.find(
          (student) =>
            student.rollNumber.trim().toLowerCase() ===
            rollNumber.trim().toLowerCase(),
        ) ?? null
      );
    },
    async getTeacher(employeeId: string): Promise<Teacher | null> {
      const data = await requestJson<{ teachers: Teacher[] }>("/api/teachers");
      return (
        data.teachers.find(
          (teacher) =>
            teacher.employeeId.trim().toLowerCase() ===
            employeeId.trim().toLowerCase(),
        ) ?? null
      );
    },
    async getUserProfile(): Promise<UserProfile | null> {
      return null;
    },
    async isCallerAdmin(): Promise<boolean> {
      return true;
    },
    async listAllStudents(): Promise<Student[]> {
      const data = await requestJson<{ students: Student[] }>("/api/students");
      return data.students;
    },
    async listAllTeachers(): Promise<Teacher[]> {
      const data = await requestJson<{ teachers: Teacher[] }>("/api/teachers");
      return data.teachers;
    },
    async saveCallerUserProfile() {},
    async transform(input: TransformationInput): Promise<TransformationOutput> {
      return emptyTransformation(input);
    },
  };
}
