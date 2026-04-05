import { ChevronDown } from "lucide-react";
import { useState } from "react";
import {
  type ExamSemesterKey,
  examCategories,
  examDates,
  labSubjects,
  subjectNotesLinks,
  theorySubjects,
} from "@/data/studentExamTracker";

const allowedSems: ExamSemesterKey[] = [5, 6];

type UpcomingExamsTrackerProps = {
  selectedSem?: ExamSemesterKey;
  onSemChange?: (sem: ExamSemesterKey) => void;
};

export default function UpcomingExamsTracker({
  selectedSem: controlledSem,
  onSemChange,
}: UpcomingExamsTrackerProps) {
  const [internalSem, setInternalSem] = useState<ExamSemesterKey>(5);
  const selectedSem = controlledSem ?? internalSem;
  const setSelectedSem = (sem: ExamSemesterKey) => {
    onSemChange?.(sem);
    if (controlledSem === undefined) setInternalSem(sem);
  };
  const [expandedExam, setExpandedExam] = useState<string | null>(null);
  const [expandedSubjects, setExpandedSubjects] = useState<
    Record<string, boolean>
  >({});

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display font-semibold text-base flex items-center gap-2 text-foreground">
          <span className="text-xl">📅</span> Upcoming Exams
        </h2>
        <div className="flex items-center gap-0 rounded-xl overflow-hidden border border-violet-200 bg-violet-50/80">
          {allowedSems.map((sem) => (
            <button
              key={sem}
              type="button"
              onClick={() => {
                setSelectedSem(sem);
                setExpandedExam(null);
                setExpandedSubjects({});
              }}
              className="px-4 py-2 text-xs font-bold transition-colors"
              style={{
                background: selectedSem === sem ? "#7c3aed" : "transparent",
                color: selectedSem === sem ? "white" : "#5b21b6",
              }}
              data-ocid={`goals.exams.sem.${sem}`}
            >
              Semester {sem}
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-muted-foreground -mt-2">
        ISE, ESE, practicals, NPTEL, and ICA milestones — open a category for
        subjects and notes.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {examCategories.map((cat) => {
          const isOpen = expandedExam === cat.id;
          const dateLabel = examDates[selectedSem]?.[cat.id] ?? "TBD";
          const isICA = cat.id === "project" || cat.id === "assignment";
          const subjects =
            cat.type === "theory"
              ? (theorySubjects[selectedSem] ?? [])
              : cat.type === "lab"
                ? (labSubjects[selectedSem] ?? [])
                : cat.type === "all"
                  ? [
                      ...(theorySubjects[selectedSem] ?? []),
                      ...(labSubjects[selectedSem] ?? []),
                    ]
                  : [];
          return (
            <div
              key={cat.id}
              className="rounded-2xl shadow-card overflow-hidden"
              style={{ border: `2px solid ${cat.border}` }}
            >
              <button
                type="button"
                className="w-full text-left"
                data-ocid={`exam_tracker.${cat.id}.toggle`}
                onClick={() => setExpandedExam(isOpen ? null : cat.id)}
              >
                <div
                  className="px-5 py-4 flex items-center gap-3"
                  style={{ background: cat.bg }}
                >
                  <span className="text-2xl flex-shrink-0">{cat.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-bold text-sm"
                      style={{ color: cat.color }}
                    >
                      {cat.label}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {cat.fullLabel}
                    </p>
                    <p
                      className="text-[10px] font-bold mt-1 flex items-center gap-1"
                      style={{ color: cat.color }}
                    >
                      📅 {dateLabel}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {cat.type !== "none" && (
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          background: `${cat.border}22`,
                          color: cat.color,
                        }}
                      >
                        {cat.type === "all"
                          ? (theorySubjects[selectedSem]?.length ?? 0) +
                            (labSubjects[selectedSem]?.length ?? 0)
                          : cat.type === "theory"
                            ? (theorySubjects[selectedSem]?.length ?? 0)
                            : (labSubjects[selectedSem]?.length ?? 0)}{" "}
                        subjects
                      </span>
                    )}
                    <ChevronDown
                      className="w-4 h-4 transition-transform duration-200"
                      style={{
                        color: cat.color,
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    />
                  </div>
                </div>
              </button>

              {isOpen && (
                <div
                  className="px-4 pb-4 pt-2 space-y-3"
                  style={{ background: cat.bg }}
                >
                  {isICA && (
                    <div
                      className="rounded-xl px-4 py-3 border flex items-start gap-2"
                      style={{
                        background: "linear-gradient(135deg,#fefce8,#fef9c3)",
                        borderColor: "#ca8a04",
                      }}
                    >
                      <span className="text-base flex-shrink-0 mt-0.5">
                        📌
                      </span>
                      <div>
                        <p className="text-xs font-bold text-yellow-900">
                          Internal Continuous Assessment (ICA)
                        </p>
                        <p className="text-xs text-yellow-800 mt-0.5 leading-relaxed">
                          Counted as Internal Marks — taken as submission for
                          ICA. Timely submission is mandatory for internal
                          marks.
                        </p>
                      </div>
                    </div>
                  )}

                  {cat.type === "none" ? (
                    <div
                      className="rounded-xl px-4 py-3 border"
                      style={{
                        background: "linear-gradient(135deg,#f0fdfa,#ccfbf1)",
                        borderColor: "#14b8a6",
                      }}
                    >
                      <p className="text-xs font-semibold text-teal-800">
                        🌐 No subjects tracked here
                      </p>
                      <p className="text-xs text-teal-700 mt-1">
                        Link your NPTEL profile in Competitive Exam Hub. Course
                        completions and certificates are managed there.
                      </p>
                    </div>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="w-full text-left"
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedSubjects((prev) => ({
                            ...prev,
                            [cat.id]: !prev[cat.id],
                          }));
                        }}
                      >
                        <div
                          className="rounded-xl px-4 py-3 flex items-center justify-between border-2 transition-all duration-200 hover:shadow-md"
                          style={{
                            background: `${cat.border}18`,
                            borderColor: cat.border,
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">📚</span>
                            <span
                              className="text-sm font-bold"
                              style={{ color: cat.color }}
                            >
                              Subjects
                            </span>
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{
                                background: `${cat.border}30`,
                                color: cat.color,
                              }}
                            >
                              {subjects.length}
                            </span>
                          </div>
                          <ChevronDown
                            className="w-4 h-4 transition-transform duration-200"
                            style={{
                              color: cat.color,
                              transform: expandedSubjects[cat.id]
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                            }}
                          />
                        </div>
                      </button>

                      {expandedSubjects[cat.id] && (
                        <div className="space-y-2 pt-1">
                          {subjects.map((subject, idx) => {
                            const notesUrl = subjectNotesLinks[subject];
                            return (
                              <div
                                key={subject}
                                className="rounded-xl px-4 py-2.5 flex items-center gap-3"
                                style={{
                                  background: "rgba(255,255,255,0.85)",
                                  border: `1px solid ${cat.border}44`,
                                }}
                                data-ocid={`exam_tracker.${cat.id}.item.${idx + 1}`}
                              >
                                <span
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 text-white"
                                  style={{ background: cat.color }}
                                >
                                  {idx + 1}
                                </span>
                                <p className="flex-1 text-xs font-semibold text-gray-800 leading-tight">
                                  {subject}
                                </p>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {notesUrl && (
                                    <a
                                      href={notesUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 hover:opacity-80 transition-opacity"
                                      style={{
                                        background: `${cat.border}22`,
                                        color: cat.color,
                                        border: `1px solid ${cat.border}44`,
                                      }}
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      📝 Notes
                                    </a>
                                  )}
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">
                                    Scheduled
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
