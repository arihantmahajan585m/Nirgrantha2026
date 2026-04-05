/** Sem 5 & 6 exam tracker + notes links (Student portal) */

export const theorySubjects: Record<number, string[]> = {
  5: [
    "Database Engineering",
    "Design and Analysis of Algorithm",
    "Operating Systems",
    "Programme Elective I - machine learning",
    "Indian Knowledge System-II: Vedic Mathematics",
    "Multidisciplinary Minor III - OPERATING SYSTEMS",
    "Open Elective III (MOOC)",
  ],
  6: [
    "Artificial Intelligence",
    "System Software",
    "Software Engineering",
    "Programme Elective II - Reinforcement Learning",
    "Programme Elective III - Natural Language Processing",
    "Multidisciplinary Minor IV - BIG DATA TECHNOLOGIES",
  ],
};

export const labSubjects: Record<number, string[]> = {
  5: [
    "Database Engineering Lab",
    "Design and Analysis of Algorithm Lab",
    "Operating Systems Lab",
    "Programme Elective I Lab ML",
    "Advanced Java Programming",
  ],
  6: [
    "Artificial Intelligence Lab",
    "System Software Lab",
    "Programme Elective II Lab - RL",
    "Full Stack Development",
    "Multidisciplinary Minor IV Lab",
  ],
};

export const subjectNotesLinks: Record<string, string> = {
  "Database Engineering": "https://www.geeksforgeeks.org/dbms/",
  "Design and Analysis of Algorithm":
    "https://www.geeksforgeeks.org/design-and-analysis-of-algorithms/",
  "Operating Systems": "https://www.geeksforgeeks.org/operating-systems/",
  "Programme Elective I - machine learning":
    "https://www.geeksforgeeks.org/machine-learning/",
  "Indian Knowledge System-II: Vedic Mathematics":
    "https://www.vedicmathsindia.org/",
  "Multidisciplinary Minor III - OPERATING SYSTEMS":
    "https://www.geeksforgeeks.org/operating-systems/",
  "Open Elective III (MOOC)": "https://swayam.gov.in/",
  "Database Engineering Lab": "https://www.w3schools.com/sql/",
  "Design and Analysis of Algorithm Lab":
    "https://www.geeksforgeeks.org/data-structures/",
  "Operating Systems Lab": "https://www.tutorialspoint.com/operating_system/",
  "Programme Elective I Lab ML":
    "https://www.geeksforgeeks.org/machine-learning/",
  "Advanced Java Programming": "https://www.javatpoint.com/advanced-java",
  "Artificial Intelligence":
    "https://www.geeksforgeeks.org/artificial-intelligence/",
  "System Software": "https://www.tutorialspoint.com/compiler_design/",
  "Software Engineering": "https://www.geeksforgeeks.org/software-engineering/",
  "Programme Elective II - Reinforcement Learning":
    "https://www.geeksforgeeks.org/reinforcement-learning/",
  "Programme Elective III - Natural Language Processing":
    "https://www.geeksforgeeks.org/natural-language-processing/",
  "Multidisciplinary Minor IV - BIG DATA TECHNOLOGIES":
    "https://www.geeksforgeeks.org/big-data-analytics/",
  "Artificial Intelligence Lab":
    "https://www.geeksforgeeks.org/machine-learning/",
  "System Software Lab":
    "https://www.tutorialspoint.com/compiler_design/index.htm",
  "Programme Elective II Lab - RL":
    "https://www.geeksforgeeks.org/reinforcement-learning/",
  "Full Stack Development": "https://www.geeksforgeeks.org/web-development/",
  "Multidisciplinary Minor IV Lab":
    "https://www.geeksforgeeks.org/big-data-analytics/",
};

export const examDates: Record<number, Record<string, string>> = {
  5: {
    ise1: "August 2025",
    ise2: "September 2025",
    ise3: "October 2025",
    practical: "November 2025",
    ese: "November – December 2025",
    nptel: "Ongoing / Self-paced",
    project: "Counted as Internal Marks (ICA)",
    assignment: "Counted as Internal Marks (ICA)",
  },
  6: {
    ise1: "January 2026",
    ise2: "February 2026",
    ise3: "March 2026",
    practical: "April 2026",
    ese: "April – May 2026",
    nptel: "Ongoing / Self-paced",
    project: "Counted as Internal Marks (ICA)",
    assignment: "Counted as Internal Marks (ICA)",
  },
};

export type ExamSemesterKey = 5 | 6;

/** Single-day anchors for calendar + countdowns (aligned with `examDates` months). */
export interface ScheduledExamEvent {
  categoryId: string;
  label: string;
  date: Date;
}

export function getScheduledExamEvents(
  sem: ExamSemesterKey,
): ScheduledExamEvent[] {
  if (sem === 5) {
    return [
      { categoryId: "ise1", label: "ISE 1", date: new Date(2025, 7, 22, 9, 0) },
      { categoryId: "ise2", label: "ISE 2", date: new Date(2025, 8, 19, 9, 0) },
      { categoryId: "ise3", label: "ISE 3", date: new Date(2025, 9, 18, 9, 0) },
      {
        categoryId: "practical",
        label: "Practical Exam",
        date: new Date(2025, 10, 8, 9, 0),
      },
      { categoryId: "ese", label: "ESE", date: new Date(2025, 11, 2, 9, 0) },
    ];
  }
  return [
    { categoryId: "ise1", label: "ISE 1", date: new Date(2026, 0, 24, 9, 0) },
    { categoryId: "ise2", label: "ISE 2", date: new Date(2026, 1, 21, 9, 0) },
    { categoryId: "ise3", label: "ISE 3", date: new Date(2026, 2, 20, 9, 0) },
    {
      categoryId: "practical",
      label: "Practical Exam",
      date: new Date(2026, 3, 12, 9, 0),
    },
    { categoryId: "ese", label: "ESE", date: new Date(2026, 4, 8, 9, 0) },
  ];
}

export const examCategories = [
  {
    id: "ise1",
    label: "ISE 1",
    fullLabel: "Internal Semester Exam 1",
    type: "theory" as const,
    color: "#4f46e5",
    bg: "linear-gradient(135deg,#eef2ff,#e0e7ff)",
    border: "#6366f1",
    icon: "📝",
  },
  {
    id: "ise2",
    label: "ISE 2",
    fullLabel: "Internal Semester Exam 2",
    type: "theory" as const,
    color: "#7c3aed",
    bg: "linear-gradient(135deg,#f5f3ff,#ede9fe)",
    border: "#8b5cf6",
    icon: "📝",
  },
  {
    id: "ise3",
    label: "ISE 3",
    fullLabel: "Internal Semester Exam 3",
    type: "theory" as const,
    color: "#0369a1",
    bg: "linear-gradient(135deg,#f0f9ff,#e0f2fe)",
    border: "#0ea5e9",
    icon: "📝",
  },
  {
    id: "ese",
    label: "ESE",
    fullLabel: "End Semester Exam",
    type: "theory" as const,
    color: "#b45309",
    bg: "linear-gradient(135deg,#fffbeb,#fef3c7)",
    border: "#f59e0b",
    icon: "🎓",
  },
  {
    id: "practical",
    label: "Practical Exam",
    fullLabel: "Practical / Lab Exam",
    type: "lab" as const,
    color: "#d97706",
    bg: "linear-gradient(135deg,#fef9c3,#fde68a)",
    border: "#f59e0b",
    icon: "🔬",
  },
  {
    id: "nptel",
    label: "NPTEL",
    fullLabel: "NPTEL Online Courses",
    type: "none" as const,
    color: "#0d9488",
    bg: "linear-gradient(135deg,#f0fdfa,#ccfbf1)",
    border: "#14b8a6",
    icon: "🌐",
  },
  {
    id: "project",
    label: "Project",
    fullLabel: "Project Submission",
    type: "all" as const,
    color: "#059669",
    bg: "linear-gradient(135deg,#ecfdf5,#d1fae5)",
    border: "#10b981",
    icon: "💡",
  },
  {
    id: "assignment",
    label: "Assignment Submissions",
    fullLabel: "Assignment Submissions",
    type: "all" as const,
    color: "#dc2626",
    bg: "linear-gradient(135deg,#fef2f2,#fee2e2)",
    border: "#ef4444",
    icon: "📋",
  },
];
