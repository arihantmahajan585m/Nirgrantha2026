import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getAcademicControlStore,
  resolveExamStatus,
  subscribeAcademicControl,
  type AcademicAttachment,
  type AcademicFeedItem,
} from "@/utils/academicUpdates";
import {
  BellRing,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  HelpCircle,
  Megaphone,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";

const studentName = "Arihant Mahajan";

function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDate(value: string) {
  if (!value) return "TBD";
  const date = new Date(`${value}T00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function AttachmentOpenButton({
  attachment,
  compact = false,
}: {
  attachment: AcademicAttachment;
  compact?: boolean;
}) {
  if (!attachment.dataUrl) {
    return (
      <span className="text-xs text-amber-600">
        Re-upload required to open this file
      </span>
    );
  }

  return (
    <a href={attachment.dataUrl} target="_blank" rel="noreferrer">
      <Button
        type="button"
        variant="outline"
        className={
          compact
            ? "h-8 rounded-xl border-slate-200 px-3 text-xs text-slate-700"
            : "h-9 rounded-xl border-slate-200 px-4 text-sm text-slate-700"
        }
      >
        Open file
      </Button>
    </a>
  );
}

function UpdateItem({ item }: { item: AcademicFeedItem }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge className="border-0 bg-emerald-100 text-emerald-700">
              {item.category}
            </Badge>
            <span className="text-xs text-slate-500">
              {formatDateTime(item.createdAt)}
            </span>
          </div>
          <p className="font-semibold text-slate-900">{item.title}</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            {item.summary}
          </p>
        </div>
        <Megaphone className="h-5 w-5 flex-shrink-0 text-slate-300" />
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge variant="outline" className="rounded-full">
          {item.audience}
        </Badge>
        {item.chips.map((chip) => (
          <Badge key={`${item.id}-${chip}`} variant="outline" className="rounded-full">
            {chip}
          </Badge>
        ))}
      </div>
      {item.attachments.length > 0 && (
        <div className="mt-4 space-y-3">
          {item.attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {attachment.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {attachment.typeLabel} file - {attachment.sizeLabel}
                  </p>
                </div>
                <AttachmentOpenButton attachment={attachment} compact />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function UpdateSection({
  title,
  description,
  items,
  icon: Icon,
}: {
  title: string;
  description: string;
  items: AcademicFeedItem[];
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <Card className="rounded-3xl border-0 shadow-md">
      <CardContent className="p-6">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Icon className="h-5 w-5" />
          </span>
          <div>
            <h3 className="text-base font-semibold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
        </div>
        <div className="space-y-4">
          {items.length > 0 ? (
            items.map((item) => <UpdateItem key={item.id} item={item} />)
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500">
              No live student update has been published here yet.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function StudentUpdates() {
  const [store, setStore] = useState(() => getAcademicControlStore());

  useEffect(() => {
    return subscribeAcademicControl(() => {
      setStore(getAcademicControlStore());
    });
  }, []);

  const visibleFeed = store.feed.filter(
    (item) => !item.targetStudent || item.targetStudent === studentName,
  );
  const marksAndReports = visibleFeed.filter(
    (item) =>
      item.category === "Set Internal Marks" ||
      item.category === "Generate Report Cards",
  );
  const latestReport =
    store.reportCards.find((report) => report.studentName === studentName) ??
    null;
  const studentMarks = store.marks.filter(
    (mark) => mark.studentName === studentName,
  );
  const recentAttachments = visibleFeed.flatMap((item) =>
    item.attachments.map((attachment) => ({
      ...attachment,
      category: item.category,
    })),
  );

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-white/85 shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.16),_transparent_36%),radial-gradient(circle_at_bottom_left,_rgba(59,130,246,0.14),_transparent_30%)]" />
        <div className="relative p-6 md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg">
                  <BellRing className="h-5 w-5" />
                </span>
                <Badge className="border-0 bg-emerald-100 text-emerald-700">
                  Live Updates
                </Badge>
                <Badge className="border-0 bg-blue-100 text-blue-700">
                  Viewing as {studentName}
                </Badge>
              </div>
              <h2 className="text-2xl font-display font-bold text-slate-900">
                Student Updates
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Every syllabus upload, task, quiz, marks push, report card,
                notification, and exam schedule from the Faculty Intelligence Hub
                lands here live.
              </p>
            </div>
            <Button className="rounded-xl bg-emerald-600 text-white hover:bg-emerald-700">
              {visibleFeed.length} Live Records
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <UpdateSection
            title="1. Upload Syllabus"
            description="Faculty-uploaded syllabus files appear here."
            items={visibleFeed.filter((item) => item.category === "Upload Syllabus")}
            icon={Upload}
          />
          <UpdateSection
            title="2. Assign Tasks"
            description="Assignment notices and attachments are delivered here."
            items={visibleFeed.filter((item) => item.category === "Assign Tasks")}
            icon={ClipboardList}
          />
          <UpdateSection
            title="3. Create Quiz"
            description="New quiz releases and quiz files are listed here."
            items={visibleFeed.filter((item) => item.category === "Create Quiz")}
            icon={HelpCircle}
          />
          <UpdateSection
            title="4. Set Internal Marks & Generate Report Cards"
            description="Marks updates and Arihant Mahajan's report card appear together here."
            items={marksAndReports}
            icon={FileText}
          />
          <UpdateSection
            title="5. Send Notifications"
            description="Faculty announcements and notice files appear here."
            items={visibleFeed.filter(
              (item) => item.category === "Send Notifications",
            )}
            icon={BellRing}
          />
          <UpdateSection
            title="6. Schedule Exams"
            description="All newly scheduled exam notices appear here."
            items={visibleFeed.filter((item) => item.category === "Schedule Exams")}
            icon={CalendarDays}
          />

          <Card className="rounded-3xl border-0 shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <BookOpen className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    7. Track ISE & Semester Exams
                  </h3>
                  <p className="text-sm text-slate-500">
                    Live exam tracking from the faculty scheduling panel.
                  </p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="pb-2 pr-4 text-left text-xs font-medium text-slate-500">Exam</th>
                      <th className="pb-2 pr-4 text-left text-xs font-medium text-slate-500">Date</th>
                      <th className="pb-2 pr-4 text-left text-xs font-medium text-slate-500">Time</th>
                      <th className="pb-2 pr-4 text-left text-xs font-medium text-slate-500">Branch</th>
                      <th className="pb-2 pr-4 text-left text-xs font-medium text-slate-500">Sem</th>
                      <th className="pb-2 text-left text-xs font-medium text-slate-500">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {store.exams.map((exam) => (
                      <tr key={exam.id} className="border-b border-slate-100 last:border-0">
                        <td className="py-2.5 pr-4 text-xs font-medium text-slate-900">{exam.name}</td>
                        <td className="py-2.5 pr-4 text-xs text-slate-600">{formatDate(exam.date)}</td>
                        <td className="py-2.5 pr-4 text-xs text-slate-600">{exam.time}</td>
                        <td className="py-2.5 pr-4 text-xs text-slate-600">{exam.branch}</td>
                        <td className="py-2.5 pr-4 text-xs text-slate-600">{exam.semester}</td>
                        <td className="py-2.5">
                          <Badge className="border-0 bg-slate-100 text-slate-700">
                            {resolveExamStatus(exam)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          <Card className="rounded-3xl border-0 shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <h3 className="text-base font-semibold text-slate-900">
                  Arihant Mahajan Personal Inbox
                </h3>
              </div>
              <div className="space-y-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                    Latest report card
                  </p>
                  <p className="mt-2 font-semibold text-slate-900">
                    {latestReport
                      ? `${latestReport.performanceLabel} - ${latestReport.totalInternalScore} internal score`
                      : "No report card generated yet"}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {latestReport?.remarks ??
                      "The faculty-generated report card for Arihant Mahajan will appear here."}
                  </p>
                  {latestReport && (
                    <div className="mt-3">
                      <AttachmentOpenButton attachment={latestReport.attachment} />
                    </div>
                  )}
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
                    Internal marks
                  </p>
                  <div className="mt-3 space-y-2">
                    {studentMarks.length > 0 ? (
                      studentMarks.map((mark) => (
                        <div key={mark.id} className="flex items-center justify-between gap-3 text-sm">
                          <span className="text-slate-700">{mark.subject}</span>
                          <span className="font-semibold text-slate-900">
                            {mark.marks}/{mark.outOf}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-600">
                        No internal marks have been pushed yet.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <h3 className="text-base font-semibold text-slate-900">
                  Uploaded Files
                </h3>
              </div>
              <div className="space-y-3">
                {recentAttachments.length > 0 ? (
                  recentAttachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4"
                    >
                      <div className="mb-1 flex items-center justify-between gap-3">
                        <Badge className="border-0 bg-slate-100 text-slate-700">
                          {attachment.category}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {formatDateTime(attachment.uploadedAt)}
                        </span>
                      </div>
                      <p className="font-medium text-slate-900">{attachment.name}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        {attachment.typeLabel} file - {attachment.sizeLabel}
                      </p>
                      <div className="mt-3">
                        <AttachmentOpenButton attachment={attachment} compact />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-600">
                    No faculty-uploaded files have been published yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

