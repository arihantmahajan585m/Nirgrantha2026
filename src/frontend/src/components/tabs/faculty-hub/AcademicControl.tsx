import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteAcademicFeedItem,
  generateReportCard,
  getAcademicControlStore,
  resolveExamStatus,
  saveInternalMarks,
  saveNotification,
  saveQuiz,
  saveScheduledExam,
  saveSyllabus,
  saveTask,
  subscribeAcademicControl,
  type AcademicFeedItem,
} from "@/utils/academicUpdates";
import {
  AlertCircle,
  Bell,
  BookOpen,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  FileText,
  HelpCircle,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useState } from "react";

const branches = ["CSE", "IT", "ECE", "Mechanical", "Civil", "EEE"];
const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
const divisions = ["A", "B", "C"];
const notificationTargets = [
  "All Students",
  "CSE",
  "IT",
  "ECE",
  "Division A",
  "Division B",
  "Division C",
];
const editableStudents = [
  "Arihant Mahajan",
  "Priya Sharma",
  "Rahul More",
  "Sneha Kulkarni",
  "Sushant Nalawade",
];

type FeedbackState = { tone: "success" | "error"; message: string } | null;

function formatDisplayDate(dateValue: string) {
  if (!dateValue) return "Not scheduled";
  const date = new Date(`${dateValue}T00:00`);
  if (Number.isNaN(date.getTime())) return dateValue;
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDisplayDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDisplayTime(value: string) {
  if (!value) return "09:00";
  const date = new Date(`2026-01-01T${value}`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function StatusBadge({ status }: { status: string }) {
  if (status === "Completed") {
    return (
      <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
        <CheckCircle2 className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  }
  if (status === "Ongoing") {
    return (
      <Badge className="bg-blue-100 text-blue-700 border-blue-200 text-xs">
        <Clock className="w-3 h-3 mr-1" />
        {status}
      </Badge>
    );
  }
  return (
    <Badge className="bg-orange-100 text-orange-700 border-orange-200 text-xs">
      <AlertCircle className="w-3 h-3 mr-1" />
      {status}
    </Badge>
  );
}

function FeedbackBanner({ feedback }: { feedback: FeedbackState }) {
  if (!feedback) return null;
  const isSuccess = feedback.tone === "success";
  return (
    <div
      className={`flex items-start gap-2 rounded-xl border px-3 py-2 text-xs ${
        isSuccess
          ? "border-green-200 bg-green-50 text-green-700"
          : "border-red-200 bg-red-50 text-red-600"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
      ) : (
        <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
      )}
      <span>{feedback.message}</span>
    </div>
  );
}

function LatestUpdate({
  item,
  onDelete,
}: {
  item?: AcademicFeedItem;
  onDelete?: (item: AcademicFeedItem) => void;
}) {
  if (!item) {
    return (
      <div className="rounded-xl border border-dashed border-fhub-border bg-fhub-bg/40 px-3 py-3 text-xs text-fhub-muted">
        No live update has been published from this card yet.
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-fhub-border bg-fhub-bg/50 px-3 py-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-fhub-heading">{item.title}</p>
        <span className="text-[11px] text-fhub-muted">
          {formatDisplayDateTime(item.createdAt)}
        </span>
      </div>
      <p className="mt-1 text-xs leading-5 text-fhub-muted">{item.summary}</p>
      {item.attachments.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {item.attachments.map((attachment) => (
            <Badge
              key={attachment.id}
              className="bg-fhub-badge-bg text-fhub-accent border-fhub-accent/20 text-[10px]"
            >
              {attachment.name}
            </Badge>
          ))}
        </div>
      )}
      {onDelete && (
        <Button
          type="button"
          variant="outline"
          onClick={() => onDelete(item)}
          className="mt-3 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete This Item
        </Button>
      )}
    </div>
  );
}

export default function AcademicControl() {
  const [store, setStore] = useState(() => getAcademicControlStore());

  useEffect(() => {
    return subscribeAcademicControl(() => {
      setStore(getAcademicControlStore());
    });
  }, []);

  const [syllabusBranch, setSyllabusBranch] = useState("CSE");
  const [syllabusSemester, setSyllabusSemester] = useState("6");
  const [syllabusSubject, setSyllabusSubject] = useState(
    "Design & Analysis of Algorithms",
  );
  const [syllabusFile, setSyllabusFile] = useState<File | null>(null);
  const [syllabusPickerKey, setSyllabusPickerKey] = useState(0);
  const [syllabusFeedback, setSyllabusFeedback] = useState<FeedbackState>(null);

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskBranch, setTaskBranch] = useState("CSE");
  const [taskDivision, setTaskDivision] = useState("A");
  const [taskInstructions, setTaskInstructions] = useState("");
  const [taskAttachment, setTaskAttachment] = useState<File | null>(null);
  const [taskPickerKey, setTaskPickerKey] = useState(0);
  const [taskFeedback, setTaskFeedback] = useState<FeedbackState>(null);

  const [quizTitle, setQuizTitle] = useState("");
  const [quizSubject, setQuizSubject] = useState("Data Structures");
  const [quizQuestionCount, setQuizQuestionCount] = useState("10");
  const [quizBranch, setQuizBranch] = useState("CSE");
  const [quizSemester, setQuizSemester] = useState("6");
  const [quizPublishDate, setQuizPublishDate] = useState("");
  const [quizAttachment, setQuizAttachment] = useState<File | null>(null);
  const [quizPickerKey, setQuizPickerKey] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<FeedbackState>(null);

  const [marksBranch, setMarksBranch] = useState("CSE");
  const [marksDivision, setMarksDivision] = useState("A");
  const [marksSemester, setMarksSemester] = useState("6");
  const [marksSubject, setMarksSubject] = useState(
    "Design & Analysis of Algorithms",
  );
  const [marksOutOf, setMarksOutOf] = useState("30");
  const [marksEntries, setMarksEntries] = useState(
    editableStudents.map((studentName) => ({
      studentName,
      marks: studentName === "Arihant Mahajan" ? "27" : "",
    })),
  );
  const [marksFeedback, setMarksFeedback] = useState<FeedbackState>(null);

  const [reportStudent, setReportStudent] = useState("Arihant Mahajan");
  const [reportBranch, setReportBranch] = useState("CSE");
  const [reportSemester, setReportSemester] = useState("6");
  const [reportRemarks, setReportRemarks] = useState(
    "Arihant Mahajan is on track with strong internal performance and timely submissions.",
  );
  const [reportFeedback, setReportFeedback] = useState<FeedbackState>(null);

  const [notificationTarget, setNotificationTarget] = useState("All Students");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationAttachment, setNotificationAttachment] =
    useState<File | null>(null);
  const [notificationPickerKey, setNotificationPickerKey] = useState(0);
  const [notificationFeedback, setNotificationFeedback] =
    useState<FeedbackState>(null);

  const [examName, setExamName] = useState("");
  const [examDate, setExamDate] = useState("");
  const [examTime, setExamTime] = useState("");
  const [examBranch, setExamBranch] = useState("CSE");
  const [examSemester, setExamSemester] = useState("6");
  const [examVenue, setExamVenue] = useState("Hall A");
  const [examAttachment, setExamAttachment] = useState<File | null>(null);
  const [examPickerKey, setExamPickerKey] = useState(0);
  const [examFeedback, setExamFeedback] = useState<FeedbackState>(null);
  const [managementFeedback, setManagementFeedback] =
    useState<FeedbackState>(null);

  const latestByCategory = (category: AcademicFeedItem["category"]) =>
    store.feed.find((item) => item.category === category);
  const uploadedFilesCount = store.feed.reduce(
    (total, item) => total + item.attachments.length,
    0,
  );
  const latestMarksForArihant =
    store.marks.find((mark) => mark.studentName === "Arihant Mahajan") ?? null;
  const latestReportForArihant =
    store.reportCards.find((report) => report.studentName === "Arihant Mahajan") ??
    null;

  const handleSyllabusUpload = async () => {
    if (!syllabusSubject.trim()) {
      setSyllabusFeedback({
        tone: "error",
        message: "Add the syllabus subject before uploading.",
      });
      return;
    }
    if (!syllabusFile) {
      setSyllabusFeedback({
        tone: "error",
        message: "Choose the syllabus file first.",
      });
      return;
    }
    try {
      const item = await saveSyllabus({
        branch: syllabusBranch,
        semester: syllabusSemester,
        subject: syllabusSubject.trim(),
        file: syllabusFile,
      });
      setSyllabusFeedback({
        tone: "success",
        message: `${item.attachments[0]?.name ?? "Syllabus"} uploaded for ${item.audience}. Students can now open it in Updates.`,
      });
      setSyllabusFile(null);
      setSyllabusPickerKey((value) => value + 1);
    } catch (error) {
      setSyllabusFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Syllabus upload failed. Try the file again.",
      });
    }
  };

  const handleTaskAssign = async () => {
    if (!taskTitle.trim()) {
      setTaskFeedback({
        tone: "error",
        message: "Enter a task title before publishing.",
      });
      return;
    }
    try {
      const item = await saveTask({
        title: taskTitle.trim(),
        dueDate: taskDueDate,
        branch: taskBranch,
        division: taskDivision,
        instructions: taskInstructions.trim(),
        attachment: taskAttachment,
      });
      setTaskFeedback({
        tone: "success",
        message: `${item.title} is now assigned to ${item.audience}. Students can open the attached file in Updates.`,
      });
      setTaskTitle("");
      setTaskDueDate("");
      setTaskInstructions("");
      setTaskAttachment(null);
      setTaskPickerKey((value) => value + 1);
    } catch (error) {
      setTaskFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Task publication failed. Try again.",
      });
    }
  };

  const handleQuizCreate = async () => {
    if (!quizTitle.trim()) {
      setQuizFeedback({
        tone: "error",
        message: "Enter a quiz title before creating it.",
      });
      return;
    }
    const numericQuestionCount = Number(quizQuestionCount);
    if (!numericQuestionCount || numericQuestionCount < 1) {
      setQuizFeedback({
        tone: "error",
        message: "Quiz question count must be at least 1.",
      });
      return;
    }
    try {
      const item = await saveQuiz({
        title: quizTitle.trim(),
        subject: quizSubject,
        questionCount: numericQuestionCount,
        branch: quizBranch,
        semester: quizSemester,
        publishDate: quizPublishDate,
        attachment: quizAttachment,
      });
      setQuizFeedback({
        tone: "success",
        message: `${item.title} has been created and pushed to the student update stream with an openable file.`,
      });
      setQuizTitle("");
      setQuizQuestionCount("10");
      setQuizPublishDate("");
      setQuizAttachment(null);
      setQuizPickerKey((value) => value + 1);
    } catch (error) {
      setQuizFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Quiz creation failed. Try again.",
      });
    }
  };

  const handleSaveMarks = () => {
    const outOf = Number(marksOutOf);
    if (!outOf || outOf < 1) {
      setMarksFeedback({
        tone: "error",
        message: "Marks total must be greater than zero.",
      });
      return;
    }
    const validEntries = marksEntries
      .map((entry) => ({
        studentName: entry.studentName,
        marks: entry.marks.trim(),
      }))
      .filter((entry) => entry.marks !== "")
      .map((entry) => ({
        studentName: entry.studentName,
        marks: Number(entry.marks),
      }))
      .filter((entry) => !Number.isNaN(entry.marks) && entry.marks >= 0);
    if (validEntries.length === 0) {
      setMarksFeedback({
        tone: "error",
        message: "Enter at least one student's marks before saving.",
      });
      return;
    }
    const records = saveInternalMarks({
      branch: marksBranch,
      division: marksDivision,
      semester: marksSemester,
      subject: marksSubject,
      outOf,
      entries: validEntries,
    });
    const arihantRecord =
      records.find((record) => record.studentName === "Arihant Mahajan") ??
      null;
    setMarksFeedback({
      tone: "success",
      message: arihantRecord
        ? `Marks saved. Arihant Mahajan now has ${arihantRecord.marks}/${arihantRecord.outOf} in ${arihantRecord.subject}.`
        : `${records.length} student marks were saved successfully.`,
    });
  };

  const handleGenerateReportCard = () => {
    const reportCard = generateReportCard({
      studentName: reportStudent,
      branch: reportBranch,
      semester: reportSemester,
      remarks: reportRemarks.trim(),
    });
    setReportFeedback({
      tone: "success",
      message: `${reportCard.studentName}'s report card has been generated and delivered to the Student Updates section.`,
    });
  };

  const handleSendNotification = async () => {
    if (!notificationMessage.trim()) {
      setNotificationFeedback({
        tone: "error",
        message: "Write a message before sending the notification.",
      });
      return;
    }
    try {
      const item = await saveNotification({
        target: notificationTarget,
        message: notificationMessage.trim(),
        attachment: notificationAttachment,
      });
      setNotificationFeedback({
        tone: "success",
        message: `${item.title} has been published for students and can be opened from Updates.`,
      });
      setNotificationMessage("");
      setNotificationAttachment(null);
      setNotificationPickerKey((value) => value + 1);
    } catch (error) {
      setNotificationFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Notification publish failed. Try again.",
      });
    }
  };

  const handleScheduleExam = async () => {
    if (!examName.trim() || !examDate || !examTime || !examVenue.trim()) {
      setExamFeedback({
        tone: "error",
        message: "Enter exam name, date, time, and venue before scheduling.",
      });
      return;
    }
    try {
      const exam = await saveScheduledExam({
        name: examName.trim(),
        date: examDate,
        time: examTime,
        branch: examBranch,
        semester: examSemester,
        venue: examVenue.trim(),
        attachment: examAttachment,
      });
      setExamFeedback({
        tone: "success",
        message: `${exam.name} is scheduled for ${formatDisplayDate(exam.date)} at ${formatDisplayTime(exam.time)}. Students can open the exam notice in Updates.`,
      });
      setExamName("");
      setExamDate("");
      setExamTime("");
      setExamVenue("Hall A");
      setExamAttachment(null);
      setExamPickerKey((value) => value + 1);
    } catch (error) {
      setExamFeedback({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "Exam scheduling failed. Try again.",
      });
    }
  };

  const handleDeletePublishedItem = (item: AcademicFeedItem) => {
    const deleted = deleteAcademicFeedItem(item.id);

    setManagementFeedback(
      deleted
        ? {
            tone: "success",
            message: `${item.title} was deleted from the Academic Control Panel and removed from Student Updates.`,
          }
        : {
            tone: "error",
            message: "That published item could not be deleted.",
          },
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <div className="mb-6">
        <h2 className="font-display font-bold text-fhub-heading text-xl">
          Academic Control Panel
        </h2>
        <p className="text-sm text-fhub-muted mt-1">
          Publish live academic records from faculty and push them directly into
          Student Updates.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-2xl border border-fhub-border bg-white/90 p-4 shadow-fhub">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-fhub-muted">
            Live updates
          </p>
          <p className="mt-2 text-2xl font-bold text-fhub-heading">
            {store.feed.length}
          </p>
          <p className="mt-1 text-xs text-fhub-muted">
            Student-facing updates published from this control panel.
          </p>
        </div>
        <div className="rounded-2xl border border-fhub-border bg-white/90 p-4 shadow-fhub">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-fhub-muted">
            Uploaded files
          </p>
          <p className="mt-2 text-2xl font-bold text-fhub-heading">
            {uploadedFilesCount}
          </p>
          <p className="mt-1 text-xs text-fhub-muted">
            Files already routed into the student Updates section.
          </p>
        </div>
        <div className="rounded-2xl border border-fhub-border bg-white/90 p-4 shadow-fhub">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-fhub-muted">
            Arihant Mahajan
          </p>
          <p className="mt-2 text-2xl font-bold text-fhub-heading">
            {latestReportForArihant?.performanceLabel ?? "Awaiting report"}
          </p>
          <p className="mt-1 text-xs text-fhub-muted">
            Latest internal marks:{" "}
            {latestMarksForArihant
              ? `${latestMarksForArihant.marks}/${latestMarksForArihant.outOf}`
              : "Not published yet"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="bg-white dark:bg-fhub-card rounded-2xl border border-fhub-border shadow-fhub p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-fhub-badge-bg flex items-center justify-center">
              <Upload className="w-4 h-4 text-fhub-accent" />
            </div>
            <h3 className="font-semibold text-fhub-heading text-sm">
              Upload Syllabus
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-fhub-muted mb-1 block">
                Subject
              </Label>
              <Input
                value={syllabusSubject}
                onChange={(event) => setSyllabusSubject(event.target.value)}
                className="border-fhub-border bg-fhub-bg text-fhub-heading text-sm h-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-fhub-muted mb-1 block">
                  Branch
                </Label>
                <Select value={syllabusBranch} onValueChange={setSyllabusBranch}>
                  <SelectTrigger className="border-fhub-border bg-fhub-bg text-fhub-heading text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-fhub-muted mb-1 block">
                  Semester
                </Label>
                <Select
                  value={syllabusSemester}
                  onValueChange={setSyllabusSemester}
                >
                  <SelectTrigger className="border-fhub-border bg-fhub-bg text-fhub-heading text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem key={semester} value={semester}>
                        Semester {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs text-fhub-muted mb-1 block">
                Syllabus File
              </Label>
              <Input
                key={syllabusPickerKey}
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                className="border-fhub-border bg-fhub-bg text-fhub-heading text-xs h-9 cursor-pointer"
                onChange={(event) =>
                  setSyllabusFile(event.target.files?.[0] ?? null)
                }
              />
            </div>
            <FeedbackBanner feedback={syllabusFeedback} />
            <Button
              onClick={handleSyllabusUpload}
              className="w-full bg-fhub-accent hover:bg-fhub-accent-dark text-white text-sm rounded-xl h-9"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload Syllabus
            </Button>
            <LatestUpdate
              item={latestByCategory("Upload Syllabus")}
              onDelete={handleDeletePublishedItem}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-fhub-card rounded-2xl border border-fhub-border shadow-fhub p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-fhub-badge-bg flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-fhub-accent" />
            </div>
            <h3 className="font-semibold text-fhub-heading text-sm">
              Assign Tasks
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-fhub-muted mb-1 block">
                Task Title
              </Label>
              <Input
                placeholder="e.g. Assignment 3 - Graphs"
                value={taskTitle}
                onChange={(event) => setTaskTitle(event.target.value)}
                className="border-fhub-border bg-fhub-bg text-fhub-heading text-sm h-9"
              />
            </div>
            <div>
              <Label className="text-xs text-fhub-muted mb-1 block">
                Due Date
              </Label>
              <Input
                type="date"
                value={taskDueDate}
                onChange={(event) => setTaskDueDate(event.target.value)}
                className="border-fhub-border bg-fhub-bg text-fhub-heading text-sm h-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-fhub-muted mb-1 block">
                  Branch
                </Label>
                <Select value={taskBranch} onValueChange={setTaskBranch}>
                  <SelectTrigger className="border-fhub-border bg-fhub-bg text-fhub-heading text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-fhub-muted mb-1 block">
                  Division
                </Label>
                <Select value={taskDivision} onValueChange={setTaskDivision}>
                  <SelectTrigger className="border-fhub-border bg-fhub-bg text-fhub-heading text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {divisions.map((division) => (
                      <SelectItem key={division} value={division}>
                        Div {division}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs text-fhub-muted mb-1 block">
                Instructions
              </Label>
              <Textarea
                placeholder="Add a short task note for students..."
                value={taskInstructions}
                onChange={(event) => setTaskInstructions(event.target.value)}
                className="border-fhub-border bg-fhub-bg text-fhub-heading text-sm resize-none h-20"
              />
            </div>
            <div>
              <Label className="text-xs text-fhub-muted mb-1 block">
                Attachment
              </Label>
              <Input
                key={taskPickerKey}
                type="file"
                accept=".pdf,.doc,.docx,.zip,.ppt,.pptx"
                className="border-fhub-border bg-fhub-bg text-fhub-heading text-xs h-9 cursor-pointer"
                onChange={(event) =>
                  setTaskAttachment(event.target.files?.[0] ?? null)
                }
              />
            </div>
            <FeedbackBanner feedback={taskFeedback} />
            <Button
              onClick={handleTaskAssign}
              className="w-full bg-fhub-accent hover:bg-fhub-accent-dark text-white text-sm rounded-xl h-9"
            >
              <ClipboardList className="w-3.5 h-3.5 mr-1.5" /> Assign Task
            </Button>
            <LatestUpdate
              item={latestByCategory("Assign Tasks")}
              onDelete={handleDeletePublishedItem}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-fhub-card rounded-2xl border border-fhub-border shadow-fhub p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-fhub-badge-bg flex items-center justify-center">
              <HelpCircle className="w-4 h-4 text-fhub-accent" />
            </div>
            <h3 className="font-semibold text-fhub-heading text-sm">
              Create Quiz
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-fhub-muted mb-1 block">
                Quiz Title
              </Label>
              <Input
                placeholder="e.g. Unit Test 2 - Trees"
                value={quizTitle}
                onChange={(event) => setQuizTitle(event.target.value)}
                className="border-fhub-border bg-fhub-bg text-fhub-heading text-sm h-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-fhub-muted mb-1 block">
                  Subject
                </Label>
                <Select value={quizSubject} onValueChange={setQuizSubject}>
                  <SelectTrigger className="border-fhub-border bg-fhub-bg text-fhub-heading text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Data Structures",
                      "Algorithms",
                      "DBMS",
                      "Networks",
                      "Software Engineering",
                    ].map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-fhub-muted mb-1 block">
                  Questions
                </Label>
                <Input
                  type="number"
                  value={quizQuestionCount}
                  min={1}
                  max={50}
                  onChange={(event) => setQuizQuestionCount(event.target.value)}
                  className="border-fhub-border bg-fhub-bg text-fhub-heading text-sm h-9"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-fhub-muted mb-1 block">
                  Branch
                </Label>
                <Select value={quizBranch} onValueChange={setQuizBranch}>
                  <SelectTrigger className="border-fhub-border bg-fhub-bg text-fhub-heading text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-fhub-muted mb-1 block">
                  Semester
                </Label>
                <Select value={quizSemester} onValueChange={setQuizSemester}>
                  <SelectTrigger className="border-fhub-border bg-fhub-bg text-fhub-heading text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem key={semester} value={semester}>
                        Semester {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs text-fhub-muted mb-1 block">
                Publish Date
              </Label>
              <Input
                type="date"
                value={quizPublishDate}
                onChange={(event) => setQuizPublishDate(event.target.value)}
                className="border-fhub-border bg-fhub-bg text-fhub-heading text-sm h-9"
              />
            </div>
            <div>
              <Label className="text-xs text-fhub-muted mb-1 block">
                Quiz File
              </Label>
              <Input
                key={quizPickerKey}
                type="file"
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                className="border-fhub-border bg-fhub-bg text-fhub-heading text-xs h-9 cursor-pointer"
                onChange={(event) =>
                  setQuizAttachment(event.target.files?.[0] ?? null)
                }
              />
            </div>
            <FeedbackBanner feedback={quizFeedback} />
            <Button
              onClick={handleQuizCreate}
              className="w-full bg-fhub-accent hover:bg-fhub-accent-dark text-white text-sm rounded-xl h-9"
            >
              <HelpCircle className="w-3.5 h-3.5 mr-1.5" /> Create Quiz
            </Button>
            <LatestUpdate
              item={latestByCategory("Create Quiz")}
              onDelete={handleDeletePublishedItem}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-fhub-card rounded-2xl border border-fhub-border shadow-fhub p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-fhub-badge-bg flex items-center justify-center">
              <Star className="w-4 h-4 text-fhub-accent" />
            </div>
            <h3 className="font-semibold text-fhub-heading text-sm">
              Set Internal Marks
            </h3>
          </div>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-fhub-muted mb-1 block">
                  Branch
                </Label>
                <Select value={marksBranch} onValueChange={setMarksBranch}>
                  <SelectTrigger className="border-fhub-border bg-fhub-bg text-fhub-heading text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-fhub-muted mb-1 block">
                  Division
                </Label>
                <Select value={marksDivision} onValueChange={setMarksDivision}>
                  <SelectTrigger className="border-fhub-border bg-fhub-bg text-fhub-heading text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {divisions.map((division) => (
                      <SelectItem key={division} value={division}>
                        Div {division}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-fhub-muted mb-1 block">
                  Semester
                </Label>
                <Select value={marksSemester} onValueChange={setMarksSemester}>
                  <SelectTrigger className="border-fhub-border bg-fhub-bg text-fhub-heading text-xs h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem key={semester} value={semester}>
                        Semester {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-fhub-muted mb-1 block">
                  Out Of
                </Label>
                <Input
                  value={marksOutOf}
                  onChange={(event) => setMarksOutOf(event.target.value)}
                  className="border-fhub-border bg-fhub-bg text-fhub-heading text-xs h-9"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs text-fhub-muted mb-1 block">
                Subject
              </Label>
              <Input
                value={marksSubject}
                onChange={(event) => setMarksSubject(event.target.value)}
                className="border-fhub-border bg-fhub-bg text-fhub-heading text-sm h-9"
              />
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {marksEntries.map((student, index) => (
                <div key={student.studentName} className="flex items-center gap-2">
                  <span className="text-xs text-fhub-heading flex-1 truncate">
                    {student.studentName}
                  </span>
                  <Input
                    type="number"
                    placeholder="0-30"
                    min={0}
                    max={Number(marksOutOf) || 100}
                    value={student.marks}
                    onChange={(event) =>
                      setMarksEntries((current) =>
                        current.map((entry, entryIndex) =>
                          entryIndex === index
                            ? { ...entry, marks: event.target.value }
                            : entry,
                        ),
                      )
                    }
                    className="w-20 border-fhub-border bg-fhub-bg text-fhub-heading text-xs h-8"
                  />
                </div>
              ))}
            </div>
            <FeedbackBanner feedback={marksFeedback} />
            <Button
              onClick={handleSaveMarks}
              className="w-full bg-fhub-accent hover:bg-fhub-accent-dark text-white text-sm rounded-xl h-9"
            >
              <Star className="w-3.5 h-3.5 mr-1.5" /> Save Marks
            </Button>
            <LatestUpdate
              item={latestByCategory("Set Internal Marks")}
              onDelete={handleDeletePublishedItem}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-fhub-card rounded-2xl border border-fhub-border shadow-fhub p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-fhub-badge-bg flex items-center justify-center">
              <FileText className="w-4 h-4 text-fhub-accent" />
            </div>
            <h3 className="font-semibold text-fhub-heading text-sm">
              Generate Report Cards
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-fhub-muted mb-1 block">
                Student
              </Label>
              <Select value={reportStudent} onValueChange={setReportStudent}>
                <SelectTrigger className="border-fhub-border bg-fhub-bg text-fhub-heading text-sm h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {editableStudents.map((student) => (
                    <SelectItem key={student} value={student}>
                      {student}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-fhub-muted mb-1 block">
                  Branch
                </Label>
                <Select value={reportBranch} onValueChange={setReportBranch}>
                  <SelectTrigger className="border-fhub-border bg-fhub-bg text-fhub-heading text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-fhub-muted mb-1 block">
                  Semester
                </Label>
                <Select
                  value={reportSemester}
                  onValueChange={setReportSemester}
                >
                  <SelectTrigger className="border-fhub-border bg-fhub-bg text-fhub-heading text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem key={semester} value={semester}>
                        Semester {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs text-fhub-muted mb-1 block">
                Faculty Remark
              </Label>
              <Textarea
                value={reportRemarks}
                onChange={(event) => setReportRemarks(event.target.value)}
                className="border-fhub-border bg-fhub-bg text-fhub-heading text-sm resize-none h-20"
              />
            </div>
            <FeedbackBanner feedback={reportFeedback} />
            <Button
              onClick={handleGenerateReportCard}
              className="w-full bg-fhub-accent hover:bg-fhub-accent-dark text-white text-sm rounded-xl h-9"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5" /> Generate Report Card
            </Button>
            <div className="rounded-xl border border-fhub-border bg-fhub-bg/50 px-3 py-3">
              <p className="text-xs font-semibold text-fhub-heading">
                Live delivery target
              </p>
              <p className="mt-1 text-xs text-fhub-muted">
                Report cards are pushed into Student Updates. Arihant Mahajan's
                latest report will appear there as soon as you generate it.
              </p>
            </div>
            <LatestUpdate
              item={latestByCategory("Generate Report Cards")}
              onDelete={handleDeletePublishedItem}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-fhub-card rounded-2xl border border-fhub-border shadow-fhub p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-fhub-badge-bg flex items-center justify-center">
              <Bell className="w-4 h-4 text-fhub-accent" />
            </div>
            <h3 className="font-semibold text-fhub-heading text-sm">
              Send Notifications
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-fhub-muted mb-1 block">
                Target Audience
              </Label>
              <Select
                value={notificationTarget}
                onValueChange={setNotificationTarget}
              >
                <SelectTrigger className="border-fhub-border bg-fhub-bg text-fhub-heading text-sm h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {notificationTargets.map((target) => (
                    <SelectItem key={target} value={target}>
                      {target}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-fhub-muted mb-1 block">
                Message
              </Label>
              <Textarea
                placeholder="Type the notice students should receive..."
                value={notificationMessage}
                onChange={(event) => setNotificationMessage(event.target.value)}
                className="border-fhub-border bg-fhub-bg text-fhub-heading text-sm resize-none h-20"
              />
            </div>
            <div>
              <Label className="text-xs text-fhub-muted mb-1 block">
                Attachment
              </Label>
              <Input
                key={notificationPickerKey}
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                className="border-fhub-border bg-fhub-bg text-fhub-heading text-xs h-9 cursor-pointer"
                onChange={(event) =>
                  setNotificationAttachment(event.target.files?.[0] ?? null)
                }
              />
            </div>
            <FeedbackBanner feedback={notificationFeedback} />
            <Button
              onClick={handleSendNotification}
              className="w-full bg-fhub-accent hover:bg-fhub-accent-dark text-white text-sm rounded-xl h-9"
            >
              <Bell className="w-3.5 h-3.5 mr-1.5" /> Send Notification
            </Button>
            <LatestUpdate
              item={latestByCategory("Send Notifications")}
              onDelete={handleDeletePublishedItem}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-fhub-card rounded-2xl border border-fhub-border shadow-fhub p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-fhub-badge-bg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-fhub-accent" />
            </div>
            <h3 className="font-semibold text-fhub-heading text-sm">
              Schedule Exams
            </h3>
          </div>
          <div className="space-y-3">
            <div>
              <Label className="text-xs text-fhub-muted mb-1 block">
                Exam Name
              </Label>
              <Input
                placeholder="e.g. ISE-II Data Structures"
                value={examName}
                onChange={(event) => setExamName(event.target.value)}
                className="border-fhub-border bg-fhub-bg text-fhub-heading text-sm h-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-fhub-muted mb-1 block">
                  Date
                </Label>
                <Input
                  type="date"
                  value={examDate}
                  onChange={(event) => setExamDate(event.target.value)}
                  className="border-fhub-border bg-fhub-bg text-fhub-heading text-xs h-9"
                />
              </div>
              <div>
                <Label className="text-xs text-fhub-muted mb-1 block">
                  Time
                </Label>
                <Input
                  type="time"
                  value={examTime}
                  onChange={(event) => setExamTime(event.target.value)}
                  className="border-fhub-border bg-fhub-bg text-fhub-heading text-xs h-9"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-fhub-muted mb-1 block">
                  Branch
                </Label>
                <Select value={examBranch} onValueChange={setExamBranch}>
                  <SelectTrigger className="border-fhub-border bg-fhub-bg text-fhub-heading text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-fhub-muted mb-1 block">
                  Semester
                </Label>
                <Select value={examSemester} onValueChange={setExamSemester}>
                  <SelectTrigger className="border-fhub-border bg-fhub-bg text-fhub-heading text-sm h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((semester) => (
                      <SelectItem key={semester} value={semester}>
                        Semester {semester}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs text-fhub-muted mb-1 block">
                Venue
              </Label>
              <Input
                value={examVenue}
                onChange={(event) => setExamVenue(event.target.value)}
                className="border-fhub-border bg-fhub-bg text-fhub-heading text-sm h-9"
              />
            </div>
            <div>
              <Label className="text-xs text-fhub-muted mb-1 block">
                Exam Notice
              </Label>
              <Input
                key={examPickerKey}
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                className="border-fhub-border bg-fhub-bg text-fhub-heading text-xs h-9 cursor-pointer"
                onChange={(event) =>
                  setExamAttachment(event.target.files?.[0] ?? null)
                }
              />
            </div>
            <FeedbackBanner feedback={examFeedback} />
            <Button
              onClick={handleScheduleExam}
              className="w-full bg-fhub-accent hover:bg-fhub-accent-dark text-white text-sm rounded-xl h-9"
            >
              <Calendar className="w-3.5 h-3.5 mr-1.5" /> Schedule Exam
            </Button>
            <LatestUpdate
              item={latestByCategory("Schedule Exams")}
              onDelete={handleDeletePublishedItem}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-fhub-card rounded-2xl border border-fhub-border shadow-fhub p-5 md:col-span-2 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-fhub-badge-bg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-fhub-accent" />
            </div>
            <h3 className="font-semibold text-fhub-heading text-sm">
              Track ISE & Semester Exams
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-fhub-border">
                  <th className="text-left text-xs text-fhub-muted font-medium pb-2 pr-4">
                    Exam Name
                  </th>
                  <th className="text-left text-xs text-fhub-muted font-medium pb-2 pr-4">
                    Date
                  </th>
                  <th className="text-left text-xs text-fhub-muted font-medium pb-2 pr-4">
                    Time
                  </th>
                  <th className="text-left text-xs text-fhub-muted font-medium pb-2 pr-4">
                    Branch
                  </th>
                  <th className="text-left text-xs text-fhub-muted font-medium pb-2 pr-4">
                    Semester
                  </th>
                  <th className="text-left text-xs text-fhub-muted font-medium pb-2 pr-4">
                    Venue
                  </th>
                  <th className="text-left text-xs text-fhub-muted font-medium pb-2">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {store.exams.map((exam) => {
                  const status = resolveExamStatus(exam);
                  return (
                    <tr
                      key={exam.id}
                      className="border-b border-fhub-border/50 last:border-0"
                    >
                      <td className="py-2.5 pr-4 text-xs font-medium text-fhub-heading">
                        {exam.name}
                      </td>
                      <td className="py-2.5 pr-4 text-xs text-fhub-muted">
                        {formatDisplayDate(exam.date)}
                      </td>
                      <td className="py-2.5 pr-4 text-xs text-fhub-muted">
                        {formatDisplayTime(exam.time)}
                      </td>
                      <td className="py-2.5 pr-4">
                        <Badge className="bg-fhub-badge-bg text-fhub-accent border-fhub-accent/20 text-[10px]">
                          {exam.branch}
                        </Badge>
                      </td>
                      <td className="py-2.5 pr-4 text-xs text-fhub-muted">
                        Semester {exam.semester}
                      </td>
                      <td className="py-2.5 pr-4 text-xs text-fhub-muted">
                        {exam.venue}
                      </td>
                      <td className="py-2.5">
                        <StatusBadge status={status} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-fhub-border bg-white/90 p-5 shadow-fhub">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-fhub-heading">
              Manage Published Updates
            </h3>
            <p className="mt-1 text-xs text-fhub-muted">
              Delete any uploaded or published academic item from faculty, and
              it will be removed from the student Updates section as well.
            </p>
          </div>
          <Badge className="bg-fhub-badge-bg text-fhub-accent border-fhub-accent/20">
            {store.feed.length} items
          </Badge>
        </div>

        <div className="mt-4">
          <FeedbackBanner feedback={managementFeedback} />
        </div>

        <div className="mt-4 space-y-3">
          {store.feed.length > 0 ? (
            store.feed.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-fhub-border bg-fhub-bg/40 px-4 py-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-white text-fhub-heading border-fhub-border">
                      {item.category}
                    </Badge>
                    <span className="text-xs text-fhub-muted">
                      {formatDisplayDateTime(item.createdAt)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-fhub-heading">
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-fhub-muted">
                    {item.summary}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge className="bg-fhub-badge-bg text-fhub-accent border-fhub-accent/20 text-[10px]">
                      {item.audience}
                    </Badge>
                    {item.attachments.length > 0 && (
                      <Badge className="bg-fhub-badge-bg text-fhub-accent border-fhub-accent/20 text-[10px]">
                        {item.attachments.length} file
                        {item.attachments.length > 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDeletePublishedItem(item)}
                  className="rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                </Button>
              </div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-fhub-border bg-fhub-bg/40 px-4 py-5 text-sm text-fhub-muted">
              Nothing has been published yet, so there is nothing to delete.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
