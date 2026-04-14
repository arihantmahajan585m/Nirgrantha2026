interface Env {
  ASSETS: Fetcher;
  DB?: D1Database;
}

interface Student {
  branch: string;
  semester: string;
  name: string;
  email: string;
  rollNumber: string;
  phone: string;
}

interface Teacher {
  subject: string;
  name: string;
  email: string;
  employeeId: string;
  department: string;
}

interface SecurityEvent {
  id: string;
  action: string;
  details: string;
  severity: "SAFE" | "REVIEW";
  source: string;
  timestamp: string;
  device: string;
  network: string;
}

interface SecurityProtection {
  key: string;
  label: string;
  enabled: boolean;
  detail: string;
}

interface BlockedRequestLog {
  id: string;
  path: string;
  reason: string;
  method: string;
  timestamp: string;
}

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

const MAX_API_BODY_BYTES = 5 * 1024 * 1024;
const WRITE_LIMIT_PER_WINDOW = 30;
const WRITE_LIMIT_WINDOW_MS = 60 * 1000;
const WRITE_METHODS = new Set(["POST", "DELETE"]);
const ALLOWED_API_METHODS = new Set(["GET", "POST", "DELETE", "OPTIONS"]);
const ALLOWED_SEC_FETCH_SITES = new Set(["same-origin", "same-site", "none"]);
const SUSPICIOUS_PATH_PATTERNS = [
  /\/\.env/i,
  /\/\.git(?:\/|$)/i,
  /\/wp-admin(?:\/|$)/i,
  /\/wp-login\.php$/i,
  /\/phpmyadmin(?:\/|$)/i,
  /\/adminer(?:\/|$)/i,
  /\/config\.[a-z0-9]+$/i,
  /\/backup(?:\/|$)/i,
];

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: JSON_HEADERS,
  });
}

function badRequest(message: string) {
  return json({ ok: false, error: message }, 400);
}

function dbMissing() {
  return json(
    {
      ok: false,
      error:
        "D1 database is not bound yet. Add a Cloudflare D1 binding named DB to enable shared live storage.",
    },
    503,
  );
}

function withSecurityHeaders(
  response: Response,
  request: Request,
  extraHeaders?: HeadersInit,
) {
  const headers = new Headers(response.headers);
  headers.set("x-content-type-options", "nosniff");
  headers.set("x-frame-options", "DENY");
  headers.set("referrer-policy", "strict-origin-when-cross-origin");
  headers.set(
    "permissions-policy",
    "camera=(), microphone=(), geolocation=(), payment=()",
  );
  headers.set(
    "content-security-policy",
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https:",
      "connect-src 'self' https:",
      "frame-src 'self' blob: data: https:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  );
  headers.set("cross-origin-opener-policy", "same-origin");
  headers.set("x-permitted-cross-domain-policies", "none");
  if (new URL(request.url).protocol === "https:") {
    headers.set(
      "strict-transport-security",
      "max-age=31536000; includeSubDomains; preload",
    );
  }

  if (extraHeaders) {
    const additions = new Headers(extraHeaders);
    additions.forEach((value, key) => headers.set(key, value));
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function getClientIp(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

function getUserAgent(request: Request) {
  return request.headers.get("user-agent") ?? "Unknown client";
}

function createSecurityEvent(
  action: string,
  details: string,
  source: string,
): SecurityEvent {
  return {
    id: crypto.randomUUID(),
    action,
    details,
    severity: "REVIEW",
    source,
    timestamp: new Date().toISOString(),
    device: "Cloudflare edge",
    network: "Protected production traffic",
  };
}

async function ensureSchema(db: D1Database) {
  await db.batch([
    db.prepare(
      `CREATE TABLE IF NOT EXISTS students (
        rollNumber TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        branch TEXT NOT NULL,
        semester TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )`,
    ),
    db.prepare(
      `CREATE TABLE IF NOT EXISTS teachers (
        employeeId TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        department TEXT NOT NULL,
        subject TEXT NOT NULL,
        email TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )`,
    ),
    db.prepare(
      `CREATE TABLE IF NOT EXISTS security_events (
        id TEXT PRIMARY KEY,
        action TEXT NOT NULL,
        details TEXT NOT NULL,
        severity TEXT NOT NULL,
        source TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        device TEXT NOT NULL,
        network TEXT NOT NULL
      )`,
    ),
    db.prepare(
      `CREATE TABLE IF NOT EXISTS blocked_requests (
        id TEXT PRIMARY KEY,
        path TEXT NOT NULL,
        reason TEXT NOT NULL,
        method TEXT NOT NULL,
        ipAddress TEXT NOT NULL,
        userAgent TEXT NOT NULL,
        timestamp TEXT NOT NULL
      )`,
    ),
    db.prepare(
      `CREATE TABLE IF NOT EXISTS api_write_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT NOT NULL,
        method TEXT NOT NULL,
        ipAddress TEXT NOT NULL,
        timestamp TEXT NOT NULL
      )`,
    ),
    db.prepare(
      "CREATE INDEX IF NOT EXISTS idx_security_events_timestamp ON security_events(timestamp DESC)",
    ),
    db.prepare(
      "CREATE INDEX IF NOT EXISTS idx_blocked_requests_timestamp ON blocked_requests(timestamp DESC)",
    ),
    db.prepare(
      "CREATE INDEX IF NOT EXISTS idx_api_write_log_ip_timestamp ON api_write_log(ipAddress, timestamp DESC)",
    ),
  ]);
}

function isStudent(value: unknown): value is Student {
  const record = value as Partial<Student>;
  return Boolean(
    record &&
      record.name &&
      record.rollNumber &&
      record.branch &&
      record.semester &&
      record.email &&
      record.phone,
  );
}

function isTeacher(value: unknown): value is Teacher {
  const record = value as Partial<Teacher>;
  return Boolean(
    record &&
      record.name &&
      record.employeeId &&
      record.department &&
      record.subject &&
      record.email,
  );
}

function isSecurityEvent(value: unknown): value is SecurityEvent {
  const record = value as Partial<SecurityEvent>;
  return Boolean(record && record.id && record.action && record.timestamp);
}

async function recordSecurityEvent(db: D1Database, event: SecurityEvent) {
  await db
    .prepare(
      `INSERT OR REPLACE INTO security_events
       (id, action, details, severity, source, timestamp, device, network)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      event.id,
      event.action,
      event.details,
      event.severity,
      event.source,
      event.timestamp,
      event.device,
      event.network,
    )
    .run();
}

async function recordBlockedRequest(
  db: D1Database,
  request: Request,
  reason: string,
) {
  const timestamp = new Date().toISOString();
  const path = new URL(request.url).pathname;
  const blockedRequestId = crypto.randomUUID();
  await db.batch([
    db
      .prepare(
        `INSERT INTO blocked_requests
         (id, path, reason, method, ipAddress, userAgent, timestamp)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        blockedRequestId,
        path,
        reason,
        request.method,
        getClientIp(request),
        getUserAgent(request),
        timestamp,
      ),
    db
      .prepare(
        `INSERT OR REPLACE INTO security_events
         (id, action, details, severity, source, timestamp, device, network)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        crypto.randomUUID(),
        "Edge protection blocked a request",
        `${reason} on ${path} via ${request.method}`,
        "REVIEW",
        "edge-protection",
        timestamp,
        "Cloudflare edge",
        "Protected production traffic",
      ),
  ]);
}

async function rejectWithLog(
  env: Env,
  request: Request,
  status: number,
  message: string,
) {
  if (env.DB) {
    await ensureSchema(env.DB);
    await recordBlockedRequest(env.DB, request, message);
  }
  return json({ ok: false, error: message }, status);
}

async function blockSuspiciousRequest(request: Request, env: Env) {
  const { pathname } = new URL(request.url);
  const matched = SUSPICIOUS_PATH_PATTERNS.find((pattern) =>
    pattern.test(pathname),
  );
  if (!matched) return null;
  return rejectWithLog(
    env,
    request,
    403,
    `Suspicious path probe blocked: ${pathname}`,
  );
}

async function enforceWriteRateLimit(request: Request, db: D1Database) {
  if (!WRITE_METHODS.has(request.method)) return null;

  const ipAddress = getClientIp(request);
  const timestamp = new Date().toISOString();
  const windowStart = new Date(
    Date.now() - WRITE_LIMIT_WINDOW_MS,
  ).toISOString();
  const { results } = await db
    .prepare(
      `SELECT COUNT(*) AS count
       FROM api_write_log
       WHERE ipAddress = ? AND timestamp >= ?`,
    )
    .bind(ipAddress, windowStart)
    .all<{ count: number }>();

  const recentWrites = Number(results?.[0]?.count ?? 0);
  if (recentWrites >= WRITE_LIMIT_PER_WINDOW) {
    await recordBlockedRequest(
      db,
      request,
      `Write rate limit exceeded for ${ipAddress}`,
    );
    return json(
      {
        ok: false,
        error:
          "Too many write requests in a short time. Slow down and retry in a minute.",
      },
      429,
    );
  }

  await db
    .prepare(
      `INSERT INTO api_write_log (path, method, ipAddress, timestamp)
       VALUES (?, ?, ?, ?)`,
    )
    .bind(new URL(request.url).pathname, request.method, ipAddress, timestamp)
    .run();

  return null;
}

async function rejectUnsafeApiRequest(request: Request, env: Env) {
  if (!ALLOWED_API_METHODS.has(request.method)) {
    return rejectWithLog(
      env,
      request,
      405,
      `HTTP method ${request.method} is not allowed on the protected API`,
    );
  }

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        allow: "GET, POST, DELETE, OPTIONS",
      },
    });
  }

  if (WRITE_METHODS.has(request.method)) {
    const contentLength = Number(request.headers.get("content-length") ?? 0);
    if (contentLength > MAX_API_BODY_BYTES) {
      return rejectWithLog(
        env,
        request,
        413,
        `Blocked oversized API body (${contentLength} bytes)`,
      );
    }

    if (
      request.method === "POST" &&
      !(request.headers.get("content-type") ?? "")
        .toLowerCase()
        .includes("application/json")
    ) {
      return rejectWithLog(
        env,
        request,
        415,
        "Protected API accepts only JSON payloads for write operations",
      );
    }

    const url = new URL(request.url);
    const requestOrigin = request.headers.get("origin");
    if (requestOrigin && requestOrigin !== url.origin) {
      return rejectWithLog(
        env,
        request,
        403,
        `Cross-origin write blocked from ${requestOrigin}`,
      );
    }

    const fetchSite = request.headers.get("sec-fetch-site");
    if (fetchSite && !ALLOWED_SEC_FETCH_SITES.has(fetchSite)) {
      return rejectWithLog(
        env,
        request,
        403,
        `Cross-site write blocked with sec-fetch-site=${fetchSite}`,
      );
    }

    if (env.DB) {
      await ensureSchema(env.DB);
      const rateLimitResponse = await enforceWriteRateLimit(request, env.DB);
      if (rateLimitResponse) return rateLimitResponse;
    }
  }

  return null;
}

async function handleStudents(request: Request, db: D1Database) {
  if (request.method === "GET") {
    const { results } = await db
      .prepare(
        "SELECT branch, semester, name, email, rollNumber, phone FROM students ORDER BY updatedAt DESC",
      )
      .all<Student>();
    return json({ ok: true, students: results ?? [] });
  }

  if (request.method === "POST") {
    const body = (await request.json()) as { students?: unknown[] };
    const students = body.students ?? [];
    if (!Array.isArray(students) || !students.every(isStudent)) {
      return badRequest("Invalid students payload");
    }

    const now = new Date().toISOString();
    const statements = students.map((student) =>
      db
        .prepare(
          `INSERT INTO students (rollNumber, name, branch, semester, email, phone, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?)
           ON CONFLICT(rollNumber) DO UPDATE SET
             name = excluded.name,
             branch = excluded.branch,
             semester = excluded.semester,
             email = excluded.email,
             phone = excluded.phone,
             updatedAt = excluded.updatedAt`,
        )
        .bind(
          student.rollNumber,
          student.name,
          student.branch,
          student.semester,
          student.email,
          student.phone,
          now,
        ),
    );
    if (statements.length > 0) await db.batch(statements);
    await recordSecurityEvent(
      db,
      createSecurityEvent(
        "Student roster updated",
        `${students.length} student record(s) were written to the protected shared database.`,
        "bulk-import",
      ),
    );
    return json({ ok: true, count: students.length });
  }

  if (request.method === "DELETE") {
    await db.prepare("DELETE FROM students").run();
    await recordSecurityEvent(
      db,
      createSecurityEvent(
        "Student roster cleared",
        "The protected student roster table was cleared from the dashboard.",
        "bulk-import",
      ),
    );
    return json({ ok: true });
  }

  return new Response("Method Not Allowed", { status: 405 });
}

async function handleTeachers(request: Request, db: D1Database) {
  if (request.method === "GET") {
    const { results } = await db
      .prepare(
        "SELECT subject, name, email, employeeId, department FROM teachers ORDER BY updatedAt DESC",
      )
      .all<Teacher>();
    return json({ ok: true, teachers: results ?? [] });
  }

  if (request.method === "POST") {
    const body = (await request.json()) as { teachers?: unknown[] };
    const teachers = body.teachers ?? [];
    if (!Array.isArray(teachers) || !teachers.every(isTeacher)) {
      return badRequest("Invalid teachers payload");
    }

    const now = new Date().toISOString();
    const statements = teachers.map((teacher) =>
      db
        .prepare(
          `INSERT INTO teachers (employeeId, name, department, subject, email, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?)
           ON CONFLICT(employeeId) DO UPDATE SET
             name = excluded.name,
             department = excluded.department,
             subject = excluded.subject,
             email = excluded.email,
             updatedAt = excluded.updatedAt`,
        )
        .bind(
          teacher.employeeId,
          teacher.name,
          teacher.department,
          teacher.subject,
          teacher.email,
          now,
        ),
    );
    if (statements.length > 0) await db.batch(statements);
    await recordSecurityEvent(
      db,
      createSecurityEvent(
        "Teacher roster updated",
        `${teachers.length} teacher record(s) were written to the protected shared database.`,
        "bulk-import",
      ),
    );
    return json({ ok: true, count: teachers.length });
  }

  if (request.method === "DELETE") {
    await db.prepare("DELETE FROM teachers").run();
    await recordSecurityEvent(
      db,
      createSecurityEvent(
        "Teacher roster cleared",
        "The protected teacher roster table was cleared from the dashboard.",
        "bulk-import",
      ),
    );
    return json({ ok: true });
  }

  return new Response("Method Not Allowed", { status: 405 });
}

async function handleSecurityEvents(request: Request, db: D1Database) {
  if (request.method === "GET") {
    const { results } = await db
      .prepare(
        `SELECT id, action, details, severity, source, timestamp, device, network
         FROM security_events
         ORDER BY timestamp DESC
         LIMIT 40`,
      )
      .all<SecurityEvent>();
    return json({ ok: true, events: results ?? [] });
  }

  if (request.method === "POST") {
    const body = (await request.json()) as { event?: unknown };
    if (!isSecurityEvent(body.event)) return badRequest("Invalid event payload");
    const event = body.event;
    await recordSecurityEvent(db, {
      ...event,
      severity: event.severity ?? "SAFE",
      source: event.source ?? "app",
      device: event.device ?? "Browser session",
      network: event.network ?? "Secure HTTPS origin",
    });
    return json({ ok: true, event });
  }

  if (request.method === "DELETE") {
    await db.prepare("DELETE FROM security_events").run();
    await db.prepare("DELETE FROM blocked_requests").run();
    return json({ ok: true });
  }

  return new Response("Method Not Allowed", { status: 405 });
}

function buildProtectionStatus(request: Request): SecurityProtection[] {
  const isHttps = new URL(request.url).protocol === "https:";
  return [
    {
      key: "headers",
      label: "Security headers",
      enabled: true,
      detail: "The Worker adds anti-sniffing, frame-blocking, referrer, and permissions hardening headers to every response.",
    },
    {
      key: "csp",
      label: "Content Security Policy",
      enabled: true,
      detail: "Scripts are restricted to the app origin and dangerous object embedding is disabled.",
    },
    {
      key: "hsts",
      label: "Strict HTTPS transport",
      enabled: isHttps,
      detail: isHttps
        ? "HSTS is active on the production domain."
        : "HSTS activates automatically when the app is served over HTTPS.",
    },
    {
      key: "same-origin-writes",
      label: "Same-origin write protection",
      enabled: true,
      detail: "Write operations are blocked when Origin or sec-fetch-site indicate a cross-site request.",
    },
    {
      key: "payload-guard",
      label: "Payload guard",
      enabled: true,
      detail: `API bodies above ${Math.round(MAX_API_BODY_BYTES / (1024 * 1024))} MB are rejected before processing.`,
    },
    {
      key: "rate-limit",
      label: "Write burst rate limiting",
      enabled: true,
      detail: `A single IP is limited to ${WRITE_LIMIT_PER_WINDOW} write requests per ${Math.round(WRITE_LIMIT_WINDOW_MS / 1000)} seconds.`,
    },
    {
      key: "probe-blocking",
      label: "Suspicious path blocking",
      enabled: true,
      detail: "Common exploit probes such as /.env, /.git, wp-admin, and phpMyAdmin paths are blocked at the edge.",
    },
  ];
}

async function handleSecurityStatus(request: Request, env: Env) {
  const protections = buildProtectionStatus(request);
  if (!env.DB) {
    return json({
      ok: true,
      sharedDatabase: false,
      bodySizeLimitBytes: MAX_API_BODY_BYTES,
      writeLimitPerWindow: WRITE_LIMIT_PER_WINDOW,
      writeRateLimitWindowSeconds: Math.round(WRITE_LIMIT_WINDOW_MS / 1000),
      blockedRequests: 0,
      protections,
      recentBlockedRequests: [] as BlockedRequestLog[],
      recentEdgeEvents: [] as SecurityEvent[],
    });
  }

  await ensureSchema(env.DB);
  const blockedRequestResult = await env.DB
    .prepare("SELECT COUNT(*) AS count FROM blocked_requests")
    .all<{ count: number }>();
  const blockedRequests = Number(blockedRequestResult.results?.[0]?.count ?? 0);

  const blockedLogs = await env.DB
    .prepare(
      `SELECT id, path, reason, method, timestamp
       FROM blocked_requests
       ORDER BY timestamp DESC
       LIMIT 10`,
    )
    .all<BlockedRequestLog>();

  const edgeEvents = await env.DB
    .prepare(
      `SELECT id, action, details, severity, source, timestamp, device, network
       FROM security_events
       WHERE source = 'edge-protection' OR source = 'bulk-import'
       ORDER BY timestamp DESC
       LIMIT 10`,
    )
    .all<SecurityEvent>();

  return json({
    ok: true,
    sharedDatabase: true,
    bodySizeLimitBytes: MAX_API_BODY_BYTES,
    writeLimitPerWindow: WRITE_LIMIT_PER_WINDOW,
    writeRateLimitWindowSeconds: Math.round(WRITE_LIMIT_WINDOW_MS / 1000),
    blockedRequests,
    protections,
    recentBlockedRequests: blockedLogs.results ?? [],
    recentEdgeEvents: edgeEvents.results ?? [],
  });
}

async function handleApi(request: Request, env: Env) {
  const url = new URL(request.url);

  if (url.pathname === "/api/health") {
    return json({
      ok: true,
      sharedDatabase: Boolean(env.DB),
      protectedApi: true,
    });
  }

  if (url.pathname === "/api/security-status") {
    return handleSecurityStatus(request, env);
  }

  const unsafeResponse = await rejectUnsafeApiRequest(request, env);
  if (unsafeResponse) return unsafeResponse;

  if (!env.DB) return dbMissing();
  await ensureSchema(env.DB);

  if (url.pathname === "/api/students") return handleStudents(request, env.DB);
  if (url.pathname === "/api/teachers") return handleTeachers(request, env.DB);
  if (url.pathname === "/api/security-events") {
    return handleSecurityEvents(request, env.DB);
  }

  return new Response("Not Found", { status: 404 });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const suspiciousResponse = await blockSuspiciousRequest(request, env);
    if (suspiciousResponse) {
      return withSecurityHeaders(suspiciousResponse, request);
    }

    const url = new URL(request.url);
    try {
      if (url.pathname.startsWith("/api/")) {
        const response = await handleApi(request, env);
        return withSecurityHeaders(response, request);
      }

      const assetResponse = await env.ASSETS.fetch(request);
      return withSecurityHeaders(assetResponse, request);
    } catch (error) {
      return withSecurityHeaders(
        json({ ok: false, error: String(error) }, 500),
        request,
      );
    }
  },
};
