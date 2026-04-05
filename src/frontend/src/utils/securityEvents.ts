export type SecurityEventSeverity = "SAFE" | "REVIEW";

export interface SecurityEvent {
  id: string;
  action: string;
  details: string;
  severity: SecurityEventSeverity;
  source: string;
  timestamp: string;
  device: string;
  network: string;
}

const SECURITY_EVENTS_KEY = "nirgrantha.security.events";
const MAX_EVENTS = 40;

function isBrowser() {
  return typeof window !== "undefined";
}

function readEvents(): SecurityEvent[] {
  if (!isBrowser()) return [];

  try {
    const raw = window.localStorage.getItem(SECURITY_EVENTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SecurityEvent[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeEvents(events: SecurityEvent[]) {
  if (!isBrowser()) return;
  window.localStorage.setItem(SECURITY_EVENTS_KEY, JSON.stringify(events));
}

function getDeviceLabel(): string {
  if (typeof navigator === "undefined") {
    return "Browser session";
  }

  const ua = navigator.userAgent;
  if (/Windows/i.test(ua)) return "Browser on Windows";
  if (/Android/i.test(ua)) return "Browser on Android";
  if (/iPhone|iPad|iOS/i.test(ua)) return "Browser on iOS";
  if (/Mac OS X|Macintosh/i.test(ua)) return "Browser on macOS";
  return "Browser session";
}

function getNetworkLabel(): string {
  if (!isBrowser()) return "Unknown network";

  const { hostname, protocol } = window.location;
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]"
  ) {
    return "Local development network";
  }

  return protocol === "https:" ? "Secure HTTPS origin" : "Unsecured origin";
}

export function listSecurityEvents(): SecurityEvent[] {
  return readEvents();
}

export function recordSecurityEvent(input: {
  action: string;
  details: string;
  severity?: SecurityEventSeverity;
  source?: string;
}) {
  const event: SecurityEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    action: input.action,
    details: input.details,
    severity: input.severity ?? "SAFE",
    source: input.source ?? "app",
    timestamp: new Date().toISOString(),
    device: getDeviceLabel(),
    network: getNetworkLabel(),
  };

  const next = [event, ...readEvents()].slice(0, MAX_EVENTS);
  writeEvents(next);
  return event;
}

export function formatSecurityEventTime(timestamp: string): string {
  const eventTime = new Date(timestamp).getTime();
  if (Number.isNaN(eventTime)) return "Unknown time";

  const diffMs = Date.now() - eventTime;
  const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}
