import {
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff,
  FileText,
  GraduationCap,
  Info,
  Key,
  Lock,
  Monitor,
  RefreshCw,
  Share2,
  ShieldAlert,
  ShieldCheck,
  Users,
  Wifi,
  X,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useListAllStudents, useListAllTeachers } from "../../../hooks/useQueries";
import {
  fetchSecurityStatus,
  formatSecurityEventTime,
  listSecurityEvents,
  recordSecurityEvent,
  syncSecurityEvents,
  type SecurityStatusSnapshot,
  type SecurityEvent,
} from "../../../utils/securityEvents";

type CyberTab = "overview" | "edge" | "checklist" | "tips" | "sessions";

interface ChecklistItem {
  id: number;
  category: "Account" | "Data" | "Physical" | "Network" | "Device";
  text: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface LiveAlert {
  id: string;
  level: "HIGH" | "MEDIUM" | "LOW";
  title: string;
  desc: string;
  color: string;
  bg: string;
  border: string;
}

const CHECKLIST_STORAGE_KEY = "nirgrantha.cybersecurity.checklist";
const DISMISSED_ALERTS_STORAGE_KEY = "nirgrantha.cybersecurity.dismissed";
const DEFAULT_CHECKED = [1, 3, 8];

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 1, category: "Account", text: "Enable two-factor authentication (2FA) on institute accounts", icon: Key },
  { id: 2, category: "Account", text: "Use a strong password with 12+ characters and mixed symbols", icon: Lock },
  { id: 3, category: "Data", text: "Encrypt sensitive student and teacher files before sharing", icon: FileText },
  { id: 4, category: "Data", text: "Restrict roster exports to institute-approved devices only", icon: ShieldAlert },
  { id: 5, category: "Physical", text: "Lock your screen when leaving a workstation unattended", icon: Monitor },
  { id: 6, category: "Physical", text: "Avoid exposing passwords or notes in classrooms or labs", icon: Eye },
  { id: 7, category: "Network", text: "Avoid public Wi-Fi for institute administration and live classes", icon: Wifi },
  { id: 8, category: "Network", text: "Verify secure portal access before entering credentials", icon: ShieldCheck },
  { id: 9, category: "Device", text: "Keep devices, browsers, and patches fully updated", icon: Monitor },
  { id: 10, category: "Device", text: "Maintain antivirus or endpoint protection on institute systems", icon: ShieldCheck },
];

const CYBER_TIPS = [
  { icon: Key, title: "Protect Institute Logins", desc: "Reserve strong passwords and 2FA for administrative and faculty portals, especially before bulk student or teacher operations.", color: "#7c3aed" },
  { icon: Share2, title: "Share Rosters Safely", desc: 'Verify recipients and keep access on "view only" unless editing is essential. Sensitive imports should not move through personal mail threads.', color: "#0891b2" },
  { icon: FileText, title: "Treat Rosters as Protected Data", desc: "Bulk-imported academic records and staff details should remain encrypted in transit whenever they leave the portal.", color: "#059669" },
  { icon: Monitor, title: "Use a Clean Teaching Profile", desc: "Before screen sharing or handling live institute operations, close personal tabs and keep a dedicated browser profile for academic work.", color: "#ea580c" },
  { icon: Wifi, title: "Know Your Network", desc: "Localhost is fine for development, but production institute sessions should run on secure HTTPS origins and trusted networks.", color: "#dc2626" },
  { icon: Lock, title: "Separate Secrets From Files", desc: "If you export sensitive data, share passwords or access keys through a separate verified channel.", color: "#2563eb" },
];

function readNumbers(key: string, fallback: number[]) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed)
      ? parsed.filter((value): value is number => typeof value === "number")
      : fallback;
  } catch {
    return fallback;
  }
}

function readStrings(key: string) {
  if (typeof window === "undefined") return [] as string[];
  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed)
      ? parsed.filter((value): value is string => typeof value === "string")
      : [];
  } catch {
    return [];
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(key, JSON.stringify(value));
  }
}

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

function SecurityGauge({ score }: { score: number }) {
  const r = 54;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - score / 100);
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" viewBox="0 0 140 140" aria-label="Security score" role="img">
        <circle cx="70" cy="70" r={r} fill="none" stroke="#e2e8f0" strokeWidth="12" />
        <circle cx="70" cy="70" r={r} fill="none" stroke={color} strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" style={{ transform: "rotate(-90deg)", transformOrigin: "70px 70px", transition: "stroke-dashoffset 1s ease" }} />
        <text x="70" y="65" textAnchor="middle" fontSize="28" fontWeight="bold" fill={color}>{score}</text>
        <text x="70" y="85" textAnchor="middle" fontSize="11" fill="#64748b">Security Score</text>
      </svg>
      <p className="text-sm font-bold mt-1" style={{ color }}>{score >= 80 ? "Hardened" : score >= 60 ? "Watchful" : "At Risk"}</p>
    </div>
  );
}

function PasswordChecker() {
  const [pwd, setPwd] = useState("");
  const [show, setShow] = useState(false);
  const rules = [
    { label: "At least 8 characters", ok: pwd.length >= 8 },
    { label: "At least 12 characters (recommended)", ok: pwd.length >= 12 },
    { label: "Contains uppercase letter", ok: /[A-Z]/.test(pwd) },
    { label: "Contains a number", ok: /[0-9]/.test(pwd) },
    { label: "Contains special symbol", ok: /[^a-zA-Z0-9]/.test(pwd) },
    { label: "Not a common password", ok: pwd.length > 0 && !["password", "123456", "qwerty", "admin"].includes(pwd.toLowerCase()) },
  ];
  const passed = rules.filter((rule) => rule.ok).length;
  const pct = (passed / rules.length) * 100;
  const color = pct >= 85 ? "#22c55e" : pct >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div className="rounded-xl p-5" style={{ background: "white", border: "1px solid #e2e8f0" }}>
      <p className="font-bold text-gray-900 mb-3">Password Strength Checker</p>
      <div className="flex gap-2 mb-4">
        <input type={show ? "text" : "password"} value={pwd} onChange={(event) => setPwd(event.target.value)} placeholder="Type a password to check..." className="flex-1 px-3 py-2 rounded-lg border-2 text-sm outline-none" style={{ borderColor: pwd ? color : "#e2e8f0", color: "#111827" }} />
        <button type="button" onClick={() => setShow((value) => !value)} className="px-3 py-2 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-900 transition-colors">{show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
      </div>
      {pwd && <div className="mb-4"><div className="flex justify-between text-xs font-semibold mb-1"><span style={{ color }}>Strength</span><span className="text-gray-500">{passed}/{rules.length} rules</span></div><div className="h-2 rounded-full bg-gray-100 overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} /></div></div>}
      <div className="space-y-1.5">{rules.map((rule) => <div key={rule.label} className="flex items-center gap-2">{rule.ok ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> : <XCircle className="w-4 h-4 text-gray-300 flex-shrink-0" />}<span className="text-xs" style={{ color: rule.ok ? "#111827" : "#9ca3af", fontWeight: rule.ok ? 600 : 400 }}>{rule.label}</span></div>)}</div>
    </div>
  );
}

export default function CybersecurityCommand() {
  const [activeTab, setActiveTab] = useState<CyberTab>("overview");
  const [checked, setChecked] = useState<number[]>(() => readNumbers(CHECKLIST_STORAGE_KEY, DEFAULT_CHECKED));
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>(() => readStrings(DISMISSED_ALERTS_STORAGE_KEY));
  const [events, setEvents] = useState<SecurityEvent[]>(() => listSecurityEvents());
  const [securityStatus, setSecurityStatus] = useState<SecurityStatusSnapshot | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const { currentRole } = useAuth();
  const students = useListAllStudents().data ?? [];
  const teachers = useListAllTeachers().data ?? [];

  async function refreshLiveSecurity(showSpinner = false) {
    if (showSpinner) setStatusLoading(true);
    try {
      const [syncedEvents, status] = await Promise.all([
        syncSecurityEvents(),
        fetchSecurityStatus(),
      ]);
      setEvents(syncedEvents);
      setSecurityStatus(status);
    } finally {
      if (showSpinner) setStatusLoading(false);
    }
  }

  useEffect(() => writeJSON(CHECKLIST_STORAGE_KEY, checked), [checked]);
  useEffect(() => writeJSON(DISMISSED_ALERTS_STORAGE_KEY, dismissedAlerts), [dismissedAlerts]);
  useEffect(() => {
    let cancelled = false;
    const load = async (showSpinner = false) => {
      if (showSpinner && !cancelled) setStatusLoading(true);
      try {
        const [syncedEvents, status] = await Promise.all([
          syncSecurityEvents(),
          fetchSecurityStatus(),
        ]);
        if (cancelled) return;
        setEvents(syncedEvents);
        setSecurityStatus(status);
      } finally {
        if (showSpinner && !cancelled) setStatusLoading(false);
      }
    };
    void load(true);
    const intervalId = window.setInterval(() => {
      void load(false);
    }, 15000);
    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const sessionKey = `nirgrantha.cyber.session.${currentRole ?? "guest"}`;
    if (window.sessionStorage.getItem(sessionKey)) return;
    const event = recordSecurityEvent({ action: "Institute security session active", details: `Cybersecurity Command opened for the ${currentRole ?? "guest"} role.`, severity: "SAFE", source: "session" });
    setEvents((previous) => [event, ...previous].slice(0, 40));
    window.sessionStorage.setItem(sessionKey, "1");
  }, [currentRole]);

  const totalProtectedRecords = students.length + teachers.length;
  const secureOrigin = useMemo(() => {
    if (typeof window === "undefined") return false;
    const { hostname, protocol } = window.location;
    return protocol === "https:" || hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]";
  }, []);
  const reviewEvents = events.filter((event) => event.severity === "REVIEW");
  const edgeProtectionCount = securityStatus?.protections.filter((protection) => protection.enabled).length ?? 0;
  const blockedEdgeRequests = securityStatus?.blockedRequests ?? 0;
  const alerts: LiveAlert[] = [];
  if (totalProtectedRecords > 0 && !checked.includes(3)) alerts.push({ id: "data-encryption", level: "HIGH", title: "Sensitive records need encryption handling", desc: `${totalProtectedRecords} live student/teacher records are available in the app, but the encryption checklist item is not complete.`, color: "#dc2626", bg: "#fef2f2", border: "#fca5a5" });
  if (teachers.length > 0 && !checked.includes(1)) alerts.push({ id: "mfa-required", level: "MEDIUM", title: "Institute access should be protected with 2FA", desc: `${teachers.length} teacher record(s) are live. Enable 2FA on institute and faculty admin accounts before wider rollout.`, color: "#ea580c", bg: "#fff7ed", border: "#fdba74" });
  if (!secureOrigin) alerts.push({ id: "origin-security", level: "MEDIUM", title: "App is not running on a secure HTTPS origin", desc: "Production institute sessions should be served over HTTPS. Localhost is fine for development, but public deployments should be secured.", color: "#d97706", bg: "#fffbeb", border: "#fcd34d" });
  if (!statusLoading && !securityStatus) alerts.push({ id: "worker-status", level: "MEDIUM", title: "Edge protection status is unavailable", desc: "The frontend could not fetch the Worker security status endpoint. Core UI still works, but live protection telemetry is offline.", color: "#2563eb", bg: "#eff6ff", border: "#93c5fd" });
  if (securityStatus && !securityStatus.sharedDatabase) alerts.push({ id: "shared-db", level: "MEDIUM", title: "Shared D1 security log is offline", desc: "The Worker is protected, but the shared database binding is unavailable, so blocked request telemetry cannot be persisted.", color: "#7c3aed", bg: "#f5f3ff", border: "#c4b5fd" });
  if (reviewEvents.length > 0) alerts.push({ id: "review-events", level: "LOW", title: "Recent review-worthy events detected", desc: `${reviewEvents.length} import or session event(s) need manual review.`, color: "#2563eb", bg: "#eff6ff", border: "#93c5fd" });
  if (blockedEdgeRequests > 0) alerts.push({ id: "blocked-attacks", level: "LOW", title: "Edge shield is actively blocking hostile probes", desc: `${blockedEdgeRequests} suspicious request(s) have already been intercepted at the Cloudflare edge.`, color: "#059669", bg: "#ecfdf5", border: "#86efac" });
  if (alerts.length === 0) alerts.push({ id: "posture-good", level: "LOW", title: "Live posture looks healthy", desc: "No active security gaps were inferred from the current roster, checklist state, or recent session activity.", color: "#059669", bg: "#ecfdf5", border: "#86efac" });
  const visibleAlerts = alerts.filter((alert) => !dismissedAlerts.includes(alert.id));
  const score = Math.max(25, Math.min(100, Math.round((checked.length / CHECKLIST_ITEMS.length) * 55 + (secureOrigin ? 8 : 0) + (checked.includes(1) ? 8 : 0) + (checked.includes(3) ? 8 : 0) + edgeProtectionCount * 3 + (blockedEdgeRequests > 0 ? 4 : 0) - alerts.filter((alert) => alert.level === "HIGH").length * 14 - alerts.filter((alert) => alert.level === "MEDIUM").length * 8 - reviewEvents.length * 2)));

  function toggleCheck(item: ChecklistItem) {
    const alreadyChecked = checked.includes(item.id);
    const next = alreadyChecked ? checked.filter((value) => value !== item.id) : [...checked, item.id];
    setChecked(next);
    const event = recordSecurityEvent({ action: "Cybersecurity checklist updated", details: `${alreadyChecked ? "Marked incomplete" : "Marked complete"}: ${item.text}`, severity: "SAFE", source: "cybersecurity" });
    setEvents((previous) => [event, ...previous].slice(0, 40));
  }

  return (
    <div className="p-4 space-y-4">
      <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f4c75 100%)" }}>
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4"><div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #1d4ed8, #1e40af)" }}><ShieldCheck className="w-7 h-7 text-white" /></div><div><h2 className="text-2xl font-bold text-white">Real Cybersecurity Protection System</h2><p className="text-white/70 text-sm">Cloudflare edge hardening + D1-backed threat logs + live institute protection telemetry</p></div></div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => void refreshLiveSecurity(true)} className="px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-colors" style={{ background: "rgba(255,255,255,0.12)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>
              <RefreshCw className={`w-4 h-4 ${statusLoading ? "animate-spin" : ""}`} />
              Refresh Shield
            </button>
            <div className="text-right"><p className="text-white/60 text-xs">Security Score</p><p className="text-2xl font-bold" style={{ color: score >= 80 ? "#4ade80" : score >= 60 ? "#fbbf24" : "#f87171" }}>{score}%</p></div>
          </div>
        </div>
      </div>

      {visibleAlerts.length > 0 && <div className="space-y-2"><p className="text-xs font-bold text-red-600 uppercase tracking-wider px-1">Active Security Alerts ({visibleAlerts.length})</p>{visibleAlerts.map((alert) => <div key={alert.id} className="rounded-xl px-4 py-3 flex items-start justify-between gap-3" style={{ background: alert.bg, border: `1px solid ${alert.border}` }}><div className="flex items-start gap-3"><AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: alert.color }} /><div><div className="flex items-center gap-2 mb-0.5"><span className="text-xs font-bold px-2 py-0.5 rounded" style={{ background: alert.color, color: "white" }}>{alert.level}</span><p className="font-bold text-sm" style={{ color: alert.color }}>{alert.title}</p></div><p className="text-xs text-gray-700">{alert.desc}</p></div></div><button type="button" onClick={() => setDismissedAlerts((previous) => previous.includes(alert.id) ? previous : [...previous, alert.id])} className="p-1 rounded hover:bg-black/10 transition-colors flex-shrink-0"><X className="w-4 h-4" style={{ color: alert.color }} /></button></div>)}</div>}

      <div className="flex gap-2 flex-wrap">{([{ id: "overview", label: "Security Overview" }, { id: "edge", label: "Edge Shields" }, { id: "checklist", label: "Security Checklist" }, { id: "tips", label: "Cyber Tips" }, { id: "sessions", label: "Session Activity" }] as { id: CyberTab; label: string }[]).map((tab) => <button type="button" key={tab.id} onClick={() => setActiveTab(tab.id)} className="px-4 py-2 rounded-xl text-sm font-bold transition-all" style={{ background: activeTab === tab.id ? "linear-gradient(135deg, #0f172a, #1e40af)" : "rgba(255,255,255,0.9)", color: activeTab === tab.id ? "white" : "#374151", border: activeTab === tab.id ? "none" : "1px solid #e2e8f0" }}>{tab.label}</button>)}</div>

      {activeTab === "overview" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div
              className="rounded-xl p-5 flex flex-col items-center justify-center"
              style={{
                background: "white",
                border: "1px solid #e2e8f0",
                boxShadow: "0 4px 15px rgba(30,64,175,0.1)",
              }}
            >
              <SecurityGauge score={score} />
              <p className="text-xs text-gray-500 mt-2 text-center max-w-xs">
                The score now combines checklist hygiene with real Cloudflare edge
                protections, blocked probe activity, and secure-origin status.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: "Protected Records",
                  value: totalProtectedRecords,
                  color: "#2563eb",
                  bg: "#eff6ff",
                  icon: Info,
                },
                {
                  label: "Edge Shields",
                  value: edgeProtectionCount,
                  color: "#059669",
                  bg: "#ecfdf5",
                  icon: ShieldCheck,
                },
                {
                  label: "Blocked Probes",
                  value: blockedEdgeRequests,
                  color: blockedEdgeRequests > 0 ? "#16a34a" : "#f59e0b",
                  bg: blockedEdgeRequests > 0 ? "#ecfdf5" : "#fffbeb",
                  icon: ShieldAlert,
                },
                {
                  label: "Review Events",
                  value: reviewEvents.length,
                  color:
                    reviewEvents.length > 0 ? "#dc2626" : "#7c3aed",
                  bg: reviewEvents.length > 0 ? "#fef2f2" : "#f5f3ff",
                  icon: AlertTriangle,
                },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-xl p-4"
                    style={{
                      background: stat.bg,
                      border: `1px solid ${stat.color}30`,
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <Icon className="w-4 h-4" style={{ color: stat.color }} />
                      <p
                        className="text-2xl font-bold"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </p>
                    </div>
                    <p className="text-xs font-semibold text-gray-700 mt-2">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4">
            <div
              className="rounded-xl p-5"
              style={{ background: "white", border: "1px solid #e2e8f0" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <p className="font-bold text-gray-900">
                  Live Protection Posture
                </p>
              </div>

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
                  <span>
                    Current role:{" "}
                    <strong className="text-gray-900">
                      {currentRole ?? "guest"}
                    </strong>
                    .
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
                  <span>
                    Origin status:{" "}
                    <strong className="text-gray-900">
                      {secureOrigin
                        ? "trusted for the current environment"
                        : "needs HTTPS hardening"}
                    </strong>
                    .
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
                  <span>
                    Latest activity:{" "}
                    <strong className="text-gray-900">
                      {events[0]?.action ?? "No recorded activity yet"}
                    </strong>
                    .
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
                  <span>
                    Protected API write policy:{" "}
                    <strong className="text-gray-900">
                      {securityStatus
                        ? `${securityStatus.writeLimitPerWindow} writes / ${securityStatus.writeRateLimitWindowSeconds}s with ${formatBytes(securityStatus.bodySizeLimitBytes)} max payload`
                        : "Loading live policy from the Worker"}
                    </strong>
                    .
                  </span>
                </div>

                <div className="rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
                  <p className="font-semibold text-blue-900">
                    Security coverage summary
                  </p>
                  <p className="text-sm text-blue-800 mt-1">
                    {securityStatus
                      ? `${edgeProtectionCount} real edge protections are active, backed by ${securityStatus.sharedDatabase ? "shared D1 threat logs" : "local browser-only telemetry"}.`
                      : "The Worker status endpoint is loading. Once available, this panel will show the real protections enforced before requests reach the app."}
                  </p>
                </div>
              </div>
            </div>

            <PasswordChecker />
          </div>
        </div>
      )}

      {activeTab === "edge" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {(securityStatus?.protections ?? []).map((protection) => (
              <div
                key={protection.key}
                className="rounded-xl p-5"
                style={{
                  background: "white",
                  border: `1px solid ${protection.enabled ? "#86efac" : "#fcd34d"}`,
                  boxShadow: protection.enabled
                    ? "0 4px 14px rgba(34,197,94,0.08)"
                    : "0 4px 14px rgba(245,158,11,0.08)",
                }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: protection.enabled ? "#dcfce7" : "#fef3c7",
                    }}
                  >
                    {protection.enabled ? (
                      <ShieldCheck className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                    )}
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-bold"
                    style={{
                      background: protection.enabled ? "#dcfce7" : "#fef3c7",
                      color: protection.enabled ? "#15803d" : "#b45309",
                    }}
                  >
                    {protection.enabled ? "LIVE" : "PENDING"}
                  </span>
                </div>
                <p className="font-bold text-gray-900">{protection.label}</p>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  {protection.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-4">
            <div
              className="rounded-xl p-5"
              style={{ background: "white", border: "1px solid #e2e8f0" }}
            >
              <p className="font-bold text-gray-900 mb-3">
                Protected API Rules
              </p>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
                  <span>
                    JSON-only write operations for protected endpoints.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
                  <span>
                    Same-origin write guard using Origin and sec-fetch-site.
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
                  <span>
                    Payload cap:{" "}
                    <strong className="text-gray-900">
                      {securityStatus
                        ? formatBytes(securityStatus.bodySizeLimitBytes)
                        : "Loading"}
                    </strong>
                    .
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-4 h-4 mt-0.5 text-green-600" />
                  <span>
                    Burst limit:{" "}
                    <strong className="text-gray-900">
                      {securityStatus
                        ? `${securityStatus.writeLimitPerWindow} writes per ${securityStatus.writeRateLimitWindowSeconds}s`
                        : "Loading"}
                    </strong>
                    .
                  </span>
                </div>
                <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
                  <p className="font-semibold text-emerald-900">
                    What became real
                  </p>
                  <p className="text-sm text-emerald-800 mt-1">
                    These protections run inside the deployed Cloudflare Worker
                    before requests reach the website UI, so the security system
                    is now enforced at the edge, not just displayed in a menu.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="rounded-xl p-5"
              style={{ background: "white", border: "1px solid #e2e8f0" }}
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <p className="font-bold text-gray-900">
                  Recent Blocked Requests
                </p>
                <span className="text-xs font-semibold text-gray-500">
                  Total blocked: {blockedEdgeRequests}
                </span>
              </div>
              <div className="space-y-3">
                {securityStatus?.recentBlockedRequests?.length ? (
                  securityStatus.recentBlockedRequests.map((entry) => (
                    <div
                      key={entry.id}
                      className="rounded-lg border border-red-100 bg-red-50 px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <p className="font-bold text-sm text-red-900">
                            {entry.method} {entry.path}
                          </p>
                        </div>
                        <span className="text-xs text-red-700 font-semibold">
                          {formatSecurityEventTime(entry.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-red-800 mt-2">
                        {entry.reason}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
                    No hostile probes have been recorded yet. That means the
                    edge shields are active and waiting rather than seeing
                    attack traffic right now.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "checklist" && <div className="space-y-3"><div className="flex items-center justify-between px-1"><p className="text-sm font-bold text-gray-700">{checked.length}/{CHECKLIST_ITEMS.length} items completed</p><div className="h-2 w-48 rounded-full bg-gray-200 overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{ width: `${(checked.length / CHECKLIST_ITEMS.length) * 100}%`, background: "linear-gradient(90deg, #22c55e, #16a34a)" }} /></div></div>{(["Account", "Data", "Physical", "Network", "Device"] as const).map((category) => <div key={category}><p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{category} Security</p><div className="space-y-2">{CHECKLIST_ITEMS.filter((item) => item.category === category).map((item) => { const isChecked = checked.includes(item.id); const Icon = item.icon; return <button type="button" key={item.id} onClick={() => toggleCheck(item)} className="w-full flex items-center gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all text-left" style={{ background: isChecked ? "#d1fae5" : "white", border: `1px solid ${isChecked ? "#86efac" : "#e2e8f0"}` }}><div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ background: isChecked ? "#22c55e" : "#e2e8f0" }}>{isChecked && <CheckCircle className="w-4 h-4 text-white" />}</div><div style={{ color: isChecked ? "#16a34a" : "#6b7280" }}><Icon className="w-4 h-4 flex-shrink-0" /></div><p className="text-sm font-semibold" style={{ color: isChecked ? "#15803d" : "#374151", textDecoration: isChecked ? "line-through" : "none" }}>{item.text}</p></button>; })}</div></div>)}</div>}

      {activeTab === "tips" && <div className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{CYBER_TIPS.map((tip) => { const TipIcon = tip.icon; return <div key={tip.title} className="rounded-xl p-5" style={{ background: "white", border: `1px solid ${tip.color}25`, boxShadow: `0 4px 15px ${tip.color}15` }}><div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${tip.color}15` }}><TipIcon className="w-5 h-5" style={{ color: tip.color }} /></div><p className="font-bold text-gray-900 mb-2">{tip.title}</p><p className="text-sm text-gray-600 leading-relaxed">{tip.desc}</p></div>; })}</div><div className="rounded-xl p-5 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0f172a, #1e1b4b, #312e81)", border: "1px solid rgba(255,255,255,0.1)" }}><div className="relative"><div className="flex items-center gap-2 mb-2"><Info className="w-5 h-5 text-white" /><p className="font-bold text-white text-lg">Live institute guidance</p></div><p className="text-white/80 text-sm leading-relaxed max-w-2xl">{totalProtectedRecords > 0 ? `This session currently exposes ${totalProtectedRecords} live student and teacher record(s) to institute workflows. Keep sharing paths encrypted, restrict access to approved users, and review recent import activity regularly.` : "No protected institute records are live yet. Once bulk imports begin, use the checklist and activity feed to keep controls aligned with real usage."}</p><a href="https://www.cert-in.org.in" target="_blank" rel="noreferrer" className="inline-block mt-3 px-4 py-2 rounded-lg text-sm font-bold transition-colors" style={{ background: "rgba(255,255,255,0.15)", color: "white", border: "1px solid rgba(255,255,255,0.3)" }}>Learn More at CERT-In</a></div></div></div>}

      {activeTab === "sessions" && <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #e2e8f0" }}><div className="px-4 py-3" style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)" }}><p className="text-white font-bold text-sm">Recent Session Activity</p></div><div className="divide-y divide-gray-100">{events.length === 0 ? <div className="px-4 py-6 text-sm text-gray-500 bg-white">No security activity has been recorded yet. Bulk imports, blocked probes, and checklist changes will appear here.</div> : events.slice(0, 10).map((event, index) => <div key={event.id} className="px-4 py-3 flex items-center justify-between gap-4" style={{ background: index % 2 === 0 ? "white" : "#f8fafc" }}><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: event.severity === "SAFE" ? "#d1fae5" : "#fef2f2" }}>{event.severity === "SAFE" ? <CheckCircle className="w-4 h-4 text-green-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}</div><div><div className="flex items-center gap-2 flex-wrap"><p className="font-bold text-sm text-gray-900">{event.action}</p><span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide" style={{ background: event.source === "edge-protection" ? "#dbeafe" : event.source === "bulk-import" ? "#dcfce7" : "#f3f4f6", color: event.source === "edge-protection" ? "#1d4ed8" : event.source === "bulk-import" ? "#15803d" : "#4b5563" }}>{event.source.replace(/-/g, " ")}</span></div><p className="text-xs text-gray-500">{event.details}</p></div></div><div className="text-right"><p className="text-xs font-semibold text-gray-700">{event.device}</p><p className="text-xs text-gray-400">{event.network}</p></div><div className="text-right flex-shrink-0"><span className="px-2.5 py-1 rounded-full text-xs font-bold inline-block" style={{ background: event.severity === "SAFE" ? "#d1fae5" : "#fef2f2", color: event.severity === "SAFE" ? "#059669" : "#dc2626" }}>{event.severity}</span><p className="text-xs text-gray-400 mt-1">{formatSecurityEventTime(event.timestamp)}</p></div></div>)}</div></div>}
    </div>
  );
}
