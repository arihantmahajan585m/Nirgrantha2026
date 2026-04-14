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

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

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

async function handleStudents(request: Request, db: D1Database) {
  await ensureSchema(db);

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
    return json({ ok: true, count: students.length });
  }

  if (request.method === "DELETE") {
    await db.prepare("DELETE FROM students").run();
    return json({ ok: true });
  }

  return new Response("Method Not Allowed", { status: 405 });
}

async function handleTeachers(request: Request, db: D1Database) {
  await ensureSchema(db);

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
    return json({ ok: true, count: teachers.length });
  }

  if (request.method === "DELETE") {
    await db.prepare("DELETE FROM teachers").run();
    return json({ ok: true });
  }

  return new Response("Method Not Allowed", { status: 405 });
}

async function handleSecurityEvents(request: Request, db: D1Database) {
  await ensureSchema(db);

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
        event.severity ?? "SAFE",
        event.source ?? "app",
        event.timestamp,
        event.device ?? "Browser session",
        event.network ?? "Secure HTTPS origin",
      )
      .run();
    return json({ ok: true, event });
  }

  if (request.method === "DELETE") {
    await db.prepare("DELETE FROM security_events").run();
    return json({ ok: true });
  }

  return new Response("Method Not Allowed", { status: 405 });
}

async function handleApi(request: Request, env: Env) {
  const url = new URL(request.url);

  if (url.pathname === "/api/health") {
    return json({ ok: true, sharedDatabase: Boolean(env.DB) });
  }

  if (!env.DB) return dbMissing();

  if (url.pathname === "/api/students") return handleStudents(request, env.DB);
  if (url.pathname === "/api/teachers") return handleTeachers(request, env.DB);
  if (url.pathname === "/api/security-events") {
    return handleSecurityEvents(request, env.DB);
  }

  return new Response("Not Found", { status: 404 });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      try {
        return await handleApi(request, env);
      } catch (error) {
        return json({ ok: false, error: String(error) }, 500);
      }
    }

    return env.ASSETS.fetch(request);
  },
};
