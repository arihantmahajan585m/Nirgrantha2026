import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, CheckCircle2, ExternalLink, Star, Users } from "lucide-react";

const classInfo = {
  classTeacher: "Dr. Priya Nair",
  classTeacherSubject: "Data Structures & Algorithms",
  hod: "Prof. Ramesh Kumar",
  hodDept: "Computer Science & Engineering",
  overallFacultyScore: 91,
};

const teachers = [
  {
    name: "Dr. Priya Nair",
    subject: "Data Structures & Algorithms",
    qualification: "Ph.D. (IIT Bombay)",
    experience: "12 years",
    specialization: "Algorithm Design, Competitive Programming",
    linkedin: "https://linkedin.com",
    background: "Ex-Google SWE, published 8 research papers in ACM",
    engagementScore: 94,
    syllabusCompletion: 98,
    feedbackRating: 4.8,
    feedbackCount: 142,
    isClassTeacher: true,
  },
  {
    name: "Prof. Anand Mehta",
    subject: "Operating Systems",
    qualification: "M.Tech (NIT Trichy)",
    experience: "9 years",
    specialization: "Distributed Systems, Linux Kernel",
    linkedin: "https://linkedin.com",
    background: "Industry experience at TCS & Wipro, open-source contributor",
    engagementScore: 87,
    syllabusCompletion: 92,
    feedbackRating: 4.5,
    feedbackCount: 118,
    isClassTeacher: false,
  },
  {
    name: "Dr. Sunita Rao",
    subject: "Database Management Systems",
    qualification: "Ph.D. (BITS Pilani)",
    experience: "15 years",
    specialization: "Big Data, NoSQL, Data Warehousing",
    linkedin: "https://linkedin.com",
    background: "Consultant for 3 Fortune 500 companies, IEEE member",
    engagementScore: 96,
    syllabusCompletion: 100,
    feedbackRating: 4.9,
    feedbackCount: 167,
    isClassTeacher: false,
  },
  {
    name: "Mr. Vikram Singh",
    subject: "Computer Networks",
    qualification: "M.E. (Anna University)",
    experience: "7 years",
    specialization: "Network Security, Cloud Infrastructure",
    linkedin: "https://linkedin.com",
    background: "Cisco Certified, worked at Airtel Networks",
    engagementScore: 82,
    syllabusCompletion: 88,
    feedbackRating: 4.2,
    feedbackCount: 95,
    isClassTeacher: false,
  },
  {
    name: "Dr. Kavitha Iyer",
    subject: "Software Engineering",
    qualification: "Ph.D. (IIT Madras)",
    experience: "11 years",
    specialization: "Agile, DevOps, Software Architecture",
    linkedin: "https://linkedin.com",
    background: "Ex-Infosys architect, NASSCOM advisory board member",
    engagementScore: 90,
    syllabusCompletion: 95,
    feedbackRating: 4.7,
    feedbackCount: 131,
    isClassTeacher: false,
  },
  {
    name: "Prof. Deepak Joshi",
    subject: "Machine Learning",
    qualification: "M.Tech + MBA (IIM Ahmedabad)",
    experience: "8 years",
    specialization: "Deep Learning, NLP, Computer Vision",
    linkedin: "https://linkedin.com",
    background: "Kaggle Grandmaster, AI startup founder",
    engagementScore: 93,
    syllabusCompletion: 91,
    feedbackRating: 4.8,
    feedbackCount: 155,
    isClassTeacher: false,
  },
];

const classComparison = [
  { division: "Division A", avgScore: 78 },
  { division: "Division B (Your Child)", avgScore: 83 },
  { division: "Division C", avgScore: 75 },
  { division: "Division D", avgScore: 80 },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className="w-3 h-3"
          fill={star <= Math.round(rating) ? "var(--parent-primary)" : "none"}
          style={{ color: "var(--parent-primary)" }}
        />
      ))}
      <span
        className="text-xs ml-1 font-semibold"
        style={{ color: "var(--parent-primary)" }}
      >
        {rating}
      </span>
    </div>
  );
}

function CircleProgress({
  value,
  size = 56,
  stroke = 5,
}: { value: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <title>Chart</title>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--parent-border)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--parent-primary)"
        strokeWidth={stroke}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={size * 0.22}
        fontWeight="700"
        fill="var(--parent-heading)"
      >
        {value}
      </text>
    </svg>
  );
}

export default function FacultyTeachingTransparency() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
      {/* Trust Indicator Banner */}
      <div
        className="rounded-2xl p-6 flex flex-wrap items-center gap-6"
        style={{
          background:
            "linear-gradient(135deg, var(--parent-primary) 0%, var(--parent-primary-dark) 100%)",
        }}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-6 h-6 text-white flex-shrink-0" />
            <h2 className="text-lg font-display font-bold text-white">
              Is your child being guided by expert faculty?
            </h2>
          </div>
          <p className="text-white/80 text-sm">
            All 6 faculty members teaching your child have been verified for
            qualifications, experience, and teaching effectiveness.
          </p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">
              {classInfo.overallFacultyScore}%
            </div>
            <div className="text-white/70 text-xs">Faculty Quality Score</div>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
            <Award className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Class Teacher & HOD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          className="rounded-2xl p-5 flex items-center gap-4"
          style={{
            background: "var(--parent-card)",
            border: "2px solid var(--parent-primary)",
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
            style={{ background: "var(--parent-primary)" }}
          >
            {classInfo.classTeacher.charAt(0)}
          </div>
          <div>
            <div
              className="text-xs font-semibold mb-0.5"
              style={{ color: "var(--parent-primary)" }}
            >
              CLASS TEACHER
            </div>
            <div
              className="text-sm font-bold"
              style={{ color: "var(--parent-heading)" }}
            >
              {classInfo.classTeacher}
            </div>
            <div className="text-xs" style={{ color: "var(--parent-muted)" }}>
              {classInfo.classTeacherSubject}
            </div>
          </div>
        </div>
        <div
          className="rounded-2xl p-5 flex items-center gap-4"
          style={{
            background: "var(--parent-card)",
            border: "1px solid var(--parent-border)",
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
            style={{ background: "var(--parent-primary-dark)" }}
          >
            {classInfo.hod.charAt(0)}
          </div>
          <div>
            <div
              className="text-xs font-semibold mb-0.5"
              style={{ color: "var(--parent-muted)" }}
            >
              HEAD OF DEPARTMENT
            </div>
            <div
              className="text-sm font-bold"
              style={{ color: "var(--parent-heading)" }}
            >
              {classInfo.hod}
            </div>
            <div className="text-xs" style={{ color: "var(--parent-muted)" }}>
              {classInfo.hodDept}
            </div>
          </div>
        </div>
      </div>

      {/* Teacher Profile Cards */}
      <section>
        <h2
          className="text-lg font-display font-bold mb-4 flex items-center gap-2"
          style={{ color: "var(--parent-heading)" }}
        >
          <span className="text-xl">👩‍🏫</span> Faculty Teaching Your Child
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {teachers.map((teacher) => (
            <div
              key={teacher.name}
              className="rounded-2xl p-6 transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: "var(--parent-card)",
                border: teacher.isClassTeacher
                  ? "2px solid var(--parent-primary)"
                  : "1px solid var(--parent-border)",
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--parent-primary) 0%, var(--parent-primary-dark) 100%)",
                  }}
                >
                  {teacher.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="text-sm font-bold"
                      style={{ color: "var(--parent-heading)" }}
                    >
                      {teacher.name}
                    </span>
                    {teacher.isClassTeacher && (
                      <Badge
                        variant="outline"
                        className="text-xs"
                        style={{
                          borderColor: "var(--parent-primary)",
                          color: "var(--parent-primary)",
                        }}
                      >
                        Class Teacher
                      </Badge>
                    )}
                  </div>
                  <div
                    className="text-xs font-semibold mt-0.5"
                    style={{ color: "var(--parent-primary)" }}
                  >
                    {teacher.subject}
                  </div>
                  <div
                    className="text-xs mt-0.5"
                    style={{ color: "var(--parent-muted)" }}
                  >
                    {teacher.qualification} · {teacher.experience}
                  </div>
                </div>
                <a
                  href={teacher.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg transition-opacity hover:opacity-80 flex-shrink-0"
                  style={{
                    background: "var(--parent-badge-bg)",
                    color: "var(--parent-primary)",
                  }}
                >
                  <ExternalLink className="w-3 h-3" />
                  LinkedIn
                </a>
              </div>

              <div
                className="text-xs mb-4 p-3 rounded-xl"
                style={{
                  background: "var(--parent-accent-subtle)",
                  color: "var(--parent-heading)",
                }}
              >
                <span className="font-semibold">Specialization:</span>{" "}
                {teacher.specialization}
                <br />
                <span className="font-semibold">Background:</span>{" "}
                {teacher.background}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <CircleProgress
                    value={teacher.engagementScore}
                    size={52}
                    stroke={5}
                  />
                  <div
                    className="text-xs mt-1"
                    style={{ color: "var(--parent-muted)" }}
                  >
                    Engagement
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center">
                  <div
                    className="text-sm font-bold mb-1"
                    style={{ color: "var(--parent-heading)" }}
                  >
                    {teacher.syllabusCompletion}%
                  </div>
                  <Progress
                    value={teacher.syllabusCompletion}
                    className="h-2 w-full"
                  />
                  <div
                    className="text-xs mt-1"
                    style={{ color: "var(--parent-muted)" }}
                  >
                    Syllabus Done
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-1">
                  <StarRating rating={teacher.feedbackRating} />
                  <div
                    className="text-xs"
                    style={{ color: "var(--parent-muted)" }}
                  >
                    {teacher.feedbackCount} reviews
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Class Performance Comparison */}
      <section>
        <h2
          className="text-lg font-display font-bold mb-4 flex items-center gap-2"
          style={{ color: "var(--parent-heading)" }}
        >
          <Users
            className="w-5 h-5"
            style={{ color: "var(--parent-primary)" }}
          />
          Class Performance Comparison
        </h2>
        <div
          className="rounded-2xl p-6"
          style={{
            background: "var(--parent-card)",
            border: "1px solid var(--parent-border)",
          }}
        >
          <div className="space-y-4">
            {classComparison.map((div) => {
              const isYours = div.division.includes("Your Child");
              return (
                <div key={div.division} className="flex items-center gap-4">
                  <div
                    className="w-36 text-xs font-medium flex-shrink-0"
                    style={{
                      color: isYours
                        ? "var(--parent-primary)"
                        : "var(--parent-heading)",
                    }}
                  >
                    {div.division}
                  </div>
                  <div className="flex-1">
                    <div
                      className="h-6 rounded-full overflow-hidden"
                      style={{ background: "var(--parent-accent-subtle)" }}
                    >
                      <div
                        className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-700"
                        style={{
                          width: `${div.avgScore}%`,
                          background: isYours
                            ? "var(--parent-primary)"
                            : "var(--parent-border)",
                        }}
                      >
                        <span className="text-xs font-bold text-white">
                          {div.avgScore}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs mt-4" style={{ color: "var(--parent-muted)" }}>
            Your child's division ranks{" "}
            <strong style={{ color: "var(--parent-primary)" }}>1st</strong>{" "}
            among all divisions this semester.
          </p>
        </div>
      </section>
    </div>
  );
}
