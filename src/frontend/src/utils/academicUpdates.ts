export type AcademicUpdateCategory =
  | "Upload Syllabus"
  | "Assign Tasks"
  | "Create Quiz"
  | "Set Internal Marks"
  | "Generate Report Cards"
  | "Send Notifications"
  | "Schedule Exams";

export interface AcademicAttachment {
  id: string;
  name: string;
  sizeLabel: string;
  typeLabel: string;
  mimeType: string;
  dataUrl: string | null;
  uploadedAt: string;
}

export interface AcademicFeedItem {
  id: string;
  category: AcademicUpdateCategory;
  title: string;
  summary: string;
  audience: string;
  createdAt: string;
  branch?: string;
  division?: string;
  semester?: string;
  subject?: string;
  targetStudent?: string;
  attachments: AcademicAttachment[];
  chips: string[];
}

export interface StudentMarkRecord {
  id: string;
  studentName: string;
  branch: string;
  division: string;
  semester: string;
  subject: string;
  marks: number;
  outOf: number;
  updatedAt: string;
}

export interface ReportCardRecord {
  id: string;
  studentName: string;
  branch: string;
  semester: string;
  generatedAt: string;
  performanceLabel: string;
  remarks: string;
  totalInternalScore: number;
  attachment: AcademicAttachment;
}

export interface TrackedExamRecord {
  id: string;
  name: string;
  date: string;
  time: string;
  branch: string;
  semester: string;
  venue: string;
  createdAt: string;
}

export interface AcademicControlStore {
  feed: AcademicFeedItem[];
  marks: StudentMarkRecord[];
  reportCards: ReportCardRecord[];
  exams: TrackedExamRecord[];
}

interface SaveSyllabusInput {
  branch: string;
  semester: string;
  subject: string;
  file: File;
}

interface SaveTaskInput {
  title: string;
  dueDate: string;
  branch: string;
  division: string;
  instructions: string;
  attachment?: File | null;
}

interface SaveQuizInput {
  title: string;
  subject: string;
  questionCount: number;
  branch: string;
  semester: string;
  publishDate: string;
  attachment?: File | null;
}

interface SaveMarksInput {
  branch: string;
  division: string;
  semester: string;
  subject: string;
  outOf: number;
  entries: Array<{
    studentName: string;
    marks: number;
  }>;
}

interface SaveReportCardInput {
  studentName: string;
  branch: string;
  semester: string;
  remarks: string;
}

interface SaveNotificationInput {
  target: string;
  message: string;
  attachment?: File | null;
}

interface SaveExamInput {
  name: string;
  date: string;
  time: string;
  branch: string;
  semester: string;
  venue: string;
  attachment?: File | null;
}

const STORAGE_KEY = "nirgrantha.academic.control";
const STORE_EVENT = "nirgrantha:academic-control-updated";

const DEFAULT_EXAMS: TrackedExamRecord[] = [
  {
    id: "seed-ise-1-dsa",
    name: "ISE-I Data Structures",
    date: "2026-02-10",
    time: "10:00",
    branch: "CSE",
    semester: "4",
    venue: "Lab 3",
    createdAt: "2026-02-01T08:00:00.000Z",
  },
  {
    id: "seed-ise-1-algo",
    name: "ISE-I Algorithms",
    date: "2026-02-12",
    time: "10:00",
    branch: "CSE",
    semester: "6",
    venue: "Hall A",
    createdAt: "2026-02-02T09:00:00.000Z",
  },
  {
    id: "seed-ise-2-dbms",
    name: "ISE-II DBMS",
    date: "2026-03-05",
    time: "14:00",
    branch: "IT",
    semester: "6",
    venue: "Seminar Hall",
    createdAt: "2026-02-22T09:30:00.000Z",
  },
  {
    id: "seed-sem-networks",
    name: "Semester Exam - Networks",
    date: "2026-04-20",
    time: "09:00",
    branch: "ECE",
    semester: "6",
    venue: "Block C",
    createdAt: "2026-03-10T11:00:00.000Z",
  },
];

const DEFAULT_STORE: AcademicControlStore = {
  feed: [],
  marks: [],
  reportCards: [],
  exams: DEFAULT_EXAMS,
};

function isBrowser() {
  return typeof window !== "undefined";
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatBytes(size: number) {
  if (!size) {
    return "0 KB";
  }

  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function detectFileTypeLabel(file: File) {
  const name = file.name.split(".").pop()?.toUpperCase();
  return name ?? (file.type || "FILE").toUpperCase();
}

function createAttachment(
  name: string,
  sizeLabel: string,
  typeLabel: string,
  mimeType: string,
  dataUrl: string | null,
) {
  return {
    id: createId("attachment"),
    name,
    sizeLabel,
    typeLabel,
    mimeType,
    dataUrl,
    uploadedAt: new Date().toISOString(),
  } satisfies AcademicAttachment;
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () =>
      reject(new Error(`Unable to read ${file.name} for student preview.`));
    reader.readAsDataURL(file);
  });
}

async function fileToAttachment(file: File) {
  return createAttachment(
    file.name,
    formatBytes(file.size),
    detectFileTypeLabel(file),
    file.type || "application/octet-stream",
    await readFileAsDataUrl(file),
  );
}

function createHtmlDataUrl(content: string) {
  return `data:text/html;charset=utf-8,${encodeURIComponent(content)}`;
}

function createReportCardPreview(
  studentName: string,
  branch: string,
  semester: string,
  performanceLabel: string,
  totalInternalScore: number,
  remarks: string,
) {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${studentName} Report Card</title>
    <style>
      body { font-family: Segoe UI, Arial, sans-serif; padding: 32px; color: #0f172a; background: #f8fafc; }
      .card { max-width: 720px; margin: 0 auto; background: white; border-radius: 20px; padding: 28px; border: 1px solid #cbd5e1; }
      h1 { margin: 0 0 8px; font-size: 28px; }
      h2 { margin: 0 0 24px; font-size: 16px; color: #475569; }
      .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-bottom: 24px; }
      .stat { background: #ecfeff; border: 1px solid #bae6fd; border-radius: 16px; padding: 16px; }
      .label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; color: #64748b; margin-bottom: 6px; }
      .value { font-size: 18px; font-weight: 700; }
      .remarks { background: #f8fafc; border-radius: 16px; padding: 16px; border: 1px solid #e2e8f0; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>${studentName}</h1>
      <h2>Semester ${semester} report card • ${branch}</h2>
      <div class="grid">
        <div class="stat">
          <div class="label">Performance</div>
          <div class="value">${performanceLabel}</div>
        </div>
        <div class="stat">
          <div class="label">Internal Score</div>
          <div class="value">${totalInternalScore}</div>
        </div>
      </div>
      <div class="remarks">
        <div class="label">Faculty Remarks</div>
        <div>${remarks}</div>
      </div>
    </div>
  </body>
</html>`;

  return createAttachment(
    `${studentName.replaceAll(" ", "_")}_Report_Card_Sem_${semester}.html`,
    "4 KB",
    "HTML",
    "text/html",
    createHtmlDataUrl(html),
  );
}

function normalizeStore(
  store?: Partial<AcademicControlStore> | null,
): AcademicControlStore {
  const normalizeAttachment = (attachment: Partial<AcademicAttachment>) => ({
    id: attachment.id ?? createId("attachment"),
    name: attachment.name ?? "Attachment",
    sizeLabel: attachment.sizeLabel ?? "Unknown size",
    typeLabel: attachment.typeLabel ?? "FILE",
    mimeType: attachment.mimeType ?? "application/octet-stream",
    dataUrl: typeof attachment.dataUrl === "string" ? attachment.dataUrl : null,
    uploadedAt: attachment.uploadedAt ?? new Date().toISOString(),
  });

  return {
    feed: Array.isArray(store?.feed)
      ? store.feed.map((item) => ({
          ...item,
          attachments: Array.isArray(item.attachments)
            ? item.attachments.map(normalizeAttachment)
            : [],
        }))
      : [],
    marks: Array.isArray(store?.marks) ? store.marks : [],
    reportCards: Array.isArray(store?.reportCards)
      ? store.reportCards.map((reportCard) => ({
          ...reportCard,
          attachment: normalizeAttachment(reportCard.attachment),
        }))
      : [],
    exams:
      Array.isArray(store?.exams) && store.exams.length > 0
        ? store.exams
        : DEFAULT_EXAMS,
  };
}

function persistStore(store: AcademicControlStore) {
  if (!isBrowser()) {
    return store;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  window.dispatchEvent(new Event(STORE_EVENT));
  return store;
}

function updateStore(
  updater: (current: AcademicControlStore) => AcademicControlStore,
) {
  const current = getAcademicControlStore();
  return persistStore(updater(current));
}

function createFeedItem(
  input: Omit<AcademicFeedItem, "id" | "createdAt">,
): AcademicFeedItem {
  return {
    id: createId("feed"),
    createdAt: new Date().toISOString(),
    ...input,
  };
}

function getTotalInternalScore(
  marks: StudentMarkRecord[],
  studentName: string,
  branch: string,
  semester: string,
) {
  return marks
    .filter(
      (item) =>
        item.studentName === studentName &&
        item.branch === branch &&
        item.semester === semester,
    )
    .reduce((total, item) => total + item.marks, 0);
}

function getPerformanceLabel(score: number) {
  if (score >= 75) {
    return "Outstanding";
  }
  if (score >= 55) {
    return "Strong";
  }
  if (score >= 35) {
    return "Developing";
  }
  return "Needs support";
}

export function getAcademicControlStore() {
  if (!isBrowser()) {
    return DEFAULT_STORE;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    persistStore(DEFAULT_STORE);
    return DEFAULT_STORE;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AcademicControlStore>;
    const normalized = normalizeStore(parsed);
    if (JSON.stringify(parsed) !== JSON.stringify(normalized)) {
      persistStore(normalized);
    }
    return normalized;
  } catch {
    persistStore(DEFAULT_STORE);
    return DEFAULT_STORE;
  }
}

export function subscribeAcademicControl(listener: () => void) {
  if (!isBrowser()) {
    return () => {};
  }

  const handleChange = () => listener();
  window.addEventListener(STORE_EVENT, handleChange);
  window.addEventListener("storage", handleChange);

  return () => {
    window.removeEventListener(STORE_EVENT, handleChange);
    window.removeEventListener("storage", handleChange);
  };
}

export function resolveExamStatus(exam: TrackedExamRecord) {
  const start = new Date(`${exam.date}T${exam.time || "09:00"}`);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const now = new Date();

  if (Number.isNaN(start.getTime())) {
    return "Upcoming";
  }

  if (now >= end) {
    return "Completed";
  }

  if (now >= start && now < end) {
    return "Ongoing";
  }

  return "Upcoming";
}

export async function saveSyllabus(input: SaveSyllabusInput) {
  const attachment = await fileToAttachment(input.file);
  const audience = `${input.branch} Semester ${input.semester}`;
  const item = createFeedItem({
    category: "Upload Syllabus",
    title: `${input.subject} syllabus uploaded`,
    summary: `${attachment.name} is now available for ${audience}. Students can open the file from the Updates section.`,
    audience,
    branch: input.branch,
    semester: input.semester,
    subject: input.subject,
    attachments: [attachment],
    chips: [input.branch, `Sem ${input.semester}`, input.subject],
  });

  updateStore((current) => ({
    ...current,
    feed: [item, ...current.feed],
  }));

  return item;
}

export async function saveTask(input: SaveTaskInput) {
  const attachments = input.attachment
    ? [await fileToAttachment(input.attachment)]
    : [];
  const item = createFeedItem({
    category: "Assign Tasks",
    title: input.title,
    summary: `Task assigned to ${input.branch} Division ${input.division}. Due date: ${input.dueDate || "Not specified"}. ${input.instructions || "Faculty instructions added in the task notice."}`,
    audience: `${input.branch} Division ${input.division}`,
    branch: input.branch,
    division: input.division,
    attachments,
    chips: [input.branch, `Div ${input.division}`, "Task"],
  });

  updateStore((current) => ({
    ...current,
    feed: [item, ...current.feed],
  }));

  return item;
}

export async function saveQuiz(input: SaveQuizInput) {
  const attachments = input.attachment
    ? [await fileToAttachment(input.attachment)]
    : [];
  const audience = `${input.branch} Semester ${input.semester}`;
  const item = createFeedItem({
    category: "Create Quiz",
    title: input.title,
    summary: `${input.subject} quiz with ${input.questionCount} questions is ready for ${audience}. Publish date: ${input.publishDate || "Immediate release"}.`,
    audience,
    branch: input.branch,
    semester: input.semester,
    subject: input.subject,
    attachments,
    chips: [input.branch, `Sem ${input.semester}`, `${input.questionCount} questions`],
  });

  updateStore((current) => ({
    ...current,
    feed: [item, ...current.feed],
  }));

  return item;
}

export function saveInternalMarks(input: SaveMarksInput) {
  const now = new Date().toISOString();
  const records = input.entries.map((entry) => ({
    id: createId("mark"),
    studentName: entry.studentName,
    branch: input.branch,
    division: input.division,
    semester: input.semester,
    subject: input.subject,
    marks: entry.marks,
    outOf: input.outOf,
    updatedAt: now,
  })) satisfies StudentMarkRecord[];

  const arihantRecord =
    records.find((entry) => entry.studentName === "Arihant Mahajan") ?? null;

  const item = createFeedItem({
    category: "Set Internal Marks",
    title: `${input.subject} internal marks updated`,
    summary: arihantRecord
      ? `Internal marks saved for ${records.length} students. Arihant Mahajan received ${arihantRecord.marks}/${arihantRecord.outOf}.`
      : `Internal marks saved for ${records.length} students in ${input.subject}.`,
    audience: `${input.branch} Division ${input.division}`,
    branch: input.branch,
    division: input.division,
    semester: input.semester,
    subject: input.subject,
    attachments: [],
    chips: [
      input.branch,
      `Div ${input.division}`,
      `Sem ${input.semester}`,
      input.subject,
    ],
  });

  updateStore((current) => ({
    ...current,
    marks: [
      ...records,
      ...current.marks.filter(
        (saved) =>
          !records.some(
            (record) =>
              record.studentName === saved.studentName &&
              record.subject === saved.subject &&
              record.branch === saved.branch &&
              record.division === saved.division &&
              record.semester === saved.semester,
          ),
      ),
    ],
    feed: [item, ...current.feed],
  }));

  return records;
}

export function generateReportCard(input: SaveReportCardInput) {
  const current = getAcademicControlStore();
  const totalInternalScore = getTotalInternalScore(
    current.marks,
    input.studentName,
    input.branch,
    input.semester,
  );
  const performanceLabel = getPerformanceLabel(totalInternalScore);
  const attachment = createReportCardPreview(
    input.studentName,
    input.branch,
    input.semester,
    performanceLabel,
    totalInternalScore,
    input.remarks,
  );
  const reportCard = {
    id: createId("report"),
    studentName: input.studentName,
    branch: input.branch,
    semester: input.semester,
    generatedAt: new Date().toISOString(),
    performanceLabel,
    remarks: input.remarks,
    totalInternalScore,
    attachment,
  } satisfies ReportCardRecord;
  const item = createFeedItem({
    category: "Generate Report Cards",
    title: `${input.studentName} report card generated`,
    summary: `Report card is ready for ${input.studentName}. Internal score total: ${totalInternalScore}. Faculty remark: ${input.remarks}`,
    audience: input.studentName,
    branch: input.branch,
    semester: input.semester,
    targetStudent: input.studentName,
    attachments: [attachment],
    chips: [input.branch, `Sem ${input.semester}`, performanceLabel],
  });

  updateStore((store) => ({
    ...store,
    reportCards: [
      reportCard,
      ...store.reportCards.filter(
        (card) =>
          !(
            card.studentName === input.studentName &&
            card.branch === input.branch &&
            card.semester === input.semester
          ),
      ),
    ],
    feed: [item, ...store.feed],
  }));

  return reportCard;
}

export async function saveNotification(input: SaveNotificationInput) {
  const attachments = input.attachment
    ? [await fileToAttachment(input.attachment)]
    : [];
  const item = createFeedItem({
    category: "Send Notifications",
    title: `Notification for ${input.target}`,
    summary: input.message,
    audience: input.target,
    attachments,
    chips: [input.target, "Notice"],
  });

  updateStore((current) => ({
    ...current,
    feed: [item, ...current.feed],
  }));

  return item;
}

export async function saveScheduledExam(input: SaveExamInput) {
  const exam = {
    id: createId("exam"),
    name: input.name,
    date: input.date,
    time: input.time,
    branch: input.branch,
    semester: input.semester,
    venue: input.venue,
    createdAt: new Date().toISOString(),
  } satisfies TrackedExamRecord;
  const attachments = input.attachment
    ? [await fileToAttachment(input.attachment)]
    : [];
  const item = createFeedItem({
    category: "Schedule Exams",
    title: input.name,
    summary: `${input.name} scheduled for ${input.branch} Semester ${input.semester} on ${input.date} at ${input.time || "09:00"} in ${input.venue}.`,
    audience: `${input.branch} Semester ${input.semester}`,
    branch: input.branch,
    semester: input.semester,
    attachments,
    chips: [input.branch, `Sem ${input.semester}`, resolveExamStatus(exam)],
  });

  updateStore((current) => ({
    ...current,
    exams: [exam, ...current.exams],
    feed: [item, ...current.feed],
  }));

  return exam;
}

export function deleteAcademicFeedItem(itemId: string) {
  const current = getAcademicControlStore();
  const item = current.feed.find((entry) => entry.id === itemId);

  if (!item) {
    return false;
  }

  persistStore({
    ...current,
    feed: current.feed.filter((entry) => entry.id !== itemId),
    marks:
      item.category === "Set Internal Marks"
        ? current.marks.filter(
            (mark) =>
              !(
                mark.branch === item.branch &&
                mark.division === item.division &&
                mark.semester === item.semester &&
                mark.subject === item.subject
              ),
          )
        : current.marks,
    reportCards:
      item.category === "Generate Report Cards"
        ? current.reportCards.filter(
            (reportCard) =>
              !(
                reportCard.studentName === item.targetStudent &&
                reportCard.branch === item.branch &&
                reportCard.semester === item.semester
              ),
          )
        : current.reportCards,
    exams:
      item.category === "Schedule Exams"
        ? current.exams.filter(
            (exam) =>
              !(
                exam.name === item.title &&
                exam.branch === item.branch &&
                exam.semester === item.semester
              ),
          )
        : current.exams,
  });

  return true;
}
