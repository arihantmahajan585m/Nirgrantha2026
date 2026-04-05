import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Student {
    branch: string;
    semester: string;
    name: string;
    email: string;
    rollNumber: string;
    phone: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type GitHubProfileResult = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "error";
    error: string;
};
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Teacher {
    subject: string;
    name: string;
    email: string;
    employeeId: string;
    department: string;
}
export type LeetCodeStatsResult = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "error";
    error: string;
};
export interface UserProfile {
    name: string;
}
export interface http_header {
    value: string;
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addStudent(student: Student): Promise<void>;
    addTeacher(teacher: Teacher): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bulkAddStudents(newStudents: Array<Student>): Promise<void>;
    bulkAddTeachers(newTeachers: Array<Teacher>): Promise<void>;
    fetchGitHubProfile(username: string): Promise<GitHubProfileResult>;
    fetchLeetCodeStats(username: string): Promise<LeetCodeStatsResult>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getStudent(rollNumber: string): Promise<Student | null>;
    getTeacher(employeeId: string): Promise<Teacher | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllStudents(): Promise<Array<Student>>;
    listAllTeachers(): Promise<Array<Teacher>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
