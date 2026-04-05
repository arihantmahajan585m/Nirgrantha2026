import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart3,
  Briefcase,
  Building2,
  Leaf,
  TrendingUp,
} from "lucide-react";

const infrastructureItems = [
  {
    label: "Smartboard Usage",
    value: 94,
    status: "Active",
    note: "All 48 classrooms equipped with interactive smartboards",
  },
  {
    label: "Lab Upgrades",
    value: 88,
    status: "Upgraded",
    note: "AI/ML Lab, IoT Lab, and Cybersecurity Lab upgraded in 2025",
  },
  {
    label: "New Technology",
    value: 92,
    status: "Deployed",
    note: "AR/VR headsets, 3D printers, and Raspberry Pi kits added",
  },
  {
    label: "Software Tools",
    value: 96,
    status: "Licensed",
    note: "MATLAB, AutoCAD, AWS Educate, GitHub Campus Pro",
  },
  {
    label: "Industry Collaboration",
    value: 85,
    status: "Active",
    note: "12 MoUs signed with TCS, Infosys, Google, and Microsoft",
  },
];

const placementData = {
  companiesThisYear: 47,
  avgPackage: "8.4 LPA",
  highestPackage: "42 LPA",
  internshipTieUps: 23,
  workshopsConducted: 18,
  placementRate: 89,
};

const packageTrend = [
  { year: "2021", avg: 5.2 },
  { year: "2022", avg: 6.1 },
  { year: "2023", avg: 7.0 },
  { year: "2024", avg: 7.8 },
  { year: "2025", avg: 8.4 },
];

const visitingCompanies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Infosys",
  "TCS",
  "Wipro",
  "Deloitte",
  "Accenture",
  "Flipkart",
  "Zomato",
];

const topCollegeComparison = [
  { metric: "Syllabus Alignment with Industry", score: 87, benchmark: 82 },
  { metric: "Skill-Based Curriculum", score: 91, benchmark: 85 },
  { metric: "Modernization Score", score: 84, benchmark: 80 },
  { metric: "Innovation Initiatives", score: 79, benchmark: 75 },
];

const campusMetrics = [
  {
    label: "Student Satisfaction Index",
    value: 88,
    icon: "😊",
    color: "oklch(0.52 0.15 145)",
  },
  {
    label: "Faculty Quality Index",
    value: 91,
    icon: "👩‍🏫",
    color: "var(--parent-primary)",
  },
  {
    label: "Campus Safety Score",
    value: 96,
    icon: "🛡️",
    color: "oklch(0.45 0.18 255)",
  },
  {
    label: "Anti-Trap Monitoring",
    value: 100,
    icon: "✅",
    color: "oklch(0.52 0.15 145)",
  },
];

const campusUpdates = [
  {
    date: "Jan 2026",
    update: "New sports complex inaugurated with Olympic-standard facilities",
  },
  {
    date: "Dec 2025",
    update: "Solar panels installed — 40% energy from renewable sources",
  },
  {
    date: "Nov 2025",
    update: "Mental health counseling center expanded with 3 new counselors",
  },
  {
    date: "Oct 2025",
    update: "Campus Wi-Fi upgraded to 10 Gbps fiber backbone",
  },
];

function PackageTrendChart({
  data,
}: { data: { year: string; avg: number }[] }) {
  const max = Math.max(...data.map((d) => d.avg));
  const min = 0;
  const range = max - min;
  const w = 300;
  const h = 80;
  const pad = 12;
  const points = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2);
    const y = h - pad - ((d.avg - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  });
  const polyline = points.join(" ");
  const areaPoints = `${pad},${h - pad} ${polyline} ${w - pad},${h - pad}`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full h-20"
      preserveAspectRatio="none"
    >
      <title>Chart</title>
      <defs>
        <linearGradient id="pkgGrad" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0%"
            stopColor="var(--parent-primary)"
            stopOpacity="0.3"
          />
          <stop
            offset="100%"
            stopColor="var(--parent-primary)"
            stopOpacity="0.02"
          />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill="url(#pkgGrad)" />
      <polyline
        points={polyline}
        fill="none"
        stroke="var(--parent-primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((d, i) => {
        const x = pad + (i / (data.length - 1)) * (w - pad * 2);
        const y = h - pad - ((d.avg - min) / range) * (h - pad * 2);
        return (
          <circle
            // biome-ignore lint/suspicious/noArrayIndexKey: static list
            key={i}
            cx={x}
            cy={y}
            r="3.5"
            fill="var(--parent-primary)"
            stroke="white"
            strokeWidth="1.5"
          />
        );
      })}
    </svg>
  );
}

function GaugeMeter({ value }: { value: number }) {
  const size = 100;
  const stroke = 10;
  const r = (size - stroke) / 2;
  const circ = Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg
      width={size}
      height={size / 2 + stroke}
      viewBox={`0 0 ${size} ${size / 2 + stroke}`}
    >
      <title>Progress</title>
      <path
        d={`M ${stroke / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${size / 2}`}
        fill="none"
        stroke="var(--parent-border)"
        strokeWidth={stroke}
        strokeLinecap="round"
      />
      <path
        d={`M ${stroke / 2} ${size / 2} A ${r} ${r} 0 0 1 ${size - stroke / 2} ${size / 2}`}
        fill="none"
        stroke="var(--parent-primary)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
      />
      <text
        x="50%"
        y={size / 2 - 2}
        textAnchor="middle"
        dominantBaseline="auto"
        fontSize="18"
        fontWeight="800"
        fill="var(--parent-heading)"
      >
        {value}
      </text>
      <text
        x="50%"
        y={size / 2 + 10}
        textAnchor="middle"
        dominantBaseline="auto"
        fontSize="9"
        fill="var(--parent-muted)"
      >
        / 100
      </text>
    </svg>
  );
}

export default function InstituteDevelopmentEnvironmentReport() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
      {/* Section 1: Infrastructure & Facilities */}
      <section>
        <h2
          className="text-lg font-display font-bold mb-4 flex items-center gap-2"
          style={{ color: "var(--parent-heading)" }}
        >
          <span className="text-xl">🏗</span> Infrastructure & Facilities
        </h2>
        <div
          className="rounded-2xl p-6"
          style={{
            background: "var(--parent-card)",
            border: "1px solid var(--parent-border)",
          }}
        >
          <div className="space-y-5">
            {infrastructureItems.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: "var(--parent-heading)" }}
                    >
                      {item.label}
                    </span>
                    <span
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                      style={{
                        background: "oklch(0.52 0.15 145 / 0.12)",
                        color: "oklch(0.42 0.15 145)",
                      }}
                    >
                      {item.status}
                    </span>
                  </div>
                  <span
                    className="text-xs font-bold"
                    style={{ color: "var(--parent-primary)" }}
                  >
                    {item.value}%
                  </span>
                </div>
                <Progress value={item.value} className="h-2 mb-1.5" />
                <p className="text-xs" style={{ color: "var(--parent-muted)" }}>
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Placement & Industry Exposure */}
      <section>
        <h2
          className="text-lg font-display font-bold mb-4 flex items-center gap-2"
          style={{ color: "var(--parent-heading)" }}
        >
          <span className="text-xl">💼</span> Placement & Industry Exposure
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div
            className="lg:col-span-2 rounded-2xl p-6"
            style={{
              background: "var(--parent-card)",
              border: "1px solid var(--parent-border)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-sm font-bold"
                style={{ color: "var(--parent-heading)" }}
              >
                Average Package Trend (LPA)
              </h3>
              <div
                className="flex items-center gap-1.5 text-xs font-semibold"
                style={{ color: "oklch(0.52 0.15 145)" }}
              >
                <TrendingUp className="w-4 h-4" />
                +61% in 5 years
              </div>
            </div>
            <PackageTrendChart data={packageTrend} />
            <div className="flex justify-between mt-2">
              {packageTrend.map((d) => (
                <span
                  key={d.year}
                  className="text-xs"
                  style={{ color: "var(--parent-muted)" }}
                >
                  {d.year}
                </span>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div
                className="rounded-xl p-3 text-center"
                style={{ background: "var(--parent-accent-subtle)" }}
              >
                <div
                  className="text-lg font-bold"
                  style={{ color: "var(--parent-primary)" }}
                >
                  {placementData.avgPackage}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--parent-muted)" }}
                >
                  Average Package
                </div>
              </div>
              <div
                className="rounded-xl p-3 text-center"
                style={{ background: "var(--parent-accent-subtle)" }}
              >
                <div
                  className="text-lg font-bold"
                  style={{ color: "oklch(0.52 0.15 145)" }}
                >
                  {placementData.highestPackage}
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--parent-muted)" }}
                >
                  Highest Package
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div
              className="rounded-2xl p-5"
              style={{
                background: "var(--parent-card)",
                border: "1px solid var(--parent-border)",
              }}
            >
              <div
                className="text-xs font-semibold mb-3"
                style={{ color: "var(--parent-heading)" }}
              >
                Placement Rate 2025
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="text-3xl font-bold"
                  style={{ color: "var(--parent-primary)" }}
                >
                  {placementData.placementRate}%
                </div>
                <Progress
                  value={placementData.placementRate}
                  className="h-3 flex-1"
                />
              </div>
            </div>
            <div
              className="rounded-2xl p-5"
              style={{
                background: "var(--parent-card)",
                border: "1px solid var(--parent-border)",
              }}
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "var(--parent-primary)" }}
                  >
                    {placementData.companiesThisYear}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--parent-muted)" }}
                  >
                    Companies Visited
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "var(--parent-primary)" }}
                  >
                    {placementData.internshipTieUps}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--parent-muted)" }}
                  >
                    Internship Tie-ups
                  </div>
                </div>
                <div className="text-center">
                  <div
                    className="text-2xl font-bold"
                    style={{ color: "var(--parent-primary)" }}
                  >
                    {placementData.workshopsConducted}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: "var(--parent-muted)" }}
                  >
                    Workshops
                  </div>
                </div>
              </div>
            </div>
            <div
              className="rounded-2xl p-5"
              style={{
                background: "var(--parent-card)",
                border: "1px solid var(--parent-border)",
              }}
            >
              <div
                className="text-xs font-semibold mb-2"
                style={{ color: "var(--parent-heading)" }}
              >
                Top Visiting Companies
              </div>
              <div className="flex flex-wrap gap-1.5">
                {visitingCompanies.map((co) => (
                  <span
                    key={co}
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: "var(--parent-badge-bg)",
                      color: "var(--parent-primary)",
                    }}
                  >
                    {co}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Comparison with Top Colleges */}
      <section>
        <h2
          className="text-lg font-display font-bold mb-4 flex items-center gap-2"
          style={{ color: "var(--parent-heading)" }}
        >
          <span className="text-xl">📊</span> Comparison with Top Colleges
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div
            className="lg:col-span-2 rounded-2xl p-6"
            style={{
              background: "var(--parent-card)",
              border: "1px solid var(--parent-border)",
            }}
          >
            <h3
              className="text-sm font-bold mb-4"
              style={{ color: "var(--parent-heading)" }}
            >
              Performance vs. National Benchmark
            </h3>
            <div className="space-y-5">
              {topCollegeComparison.map((item) => (
                <div key={item.metric}>
                  <div className="flex justify-between mb-1.5">
                    <span
                      className="text-xs font-medium"
                      style={{ color: "var(--parent-heading)" }}
                    >
                      {item.metric}
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "var(--parent-muted)" }}
                    >
                      Benchmark: {item.benchmark}%
                    </span>
                  </div>
                  <div
                    className="relative h-4 rounded-full overflow-hidden"
                    style={{ background: "var(--parent-accent-subtle)" }}
                  >
                    <div
                      className="absolute left-0 top-0 h-full rounded-full"
                      style={{
                        width: `${item.benchmark}%`,
                        background: "var(--parent-border)",
                      }}
                    />
                    <div
                      className="absolute left-0 top-0 h-full rounded-full"
                      style={{
                        width: `${item.score}%`,
                        background: "var(--parent-primary)",
                        opacity: 0.85,
                      }}
                    />
                    <span className="absolute right-2 top-0 h-full flex items-center text-xs font-bold text-white">
                      {item.score}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="rounded-2xl p-6 flex flex-col items-center justify-center"
            style={{
              background: "var(--parent-card)",
              border: "1px solid var(--parent-border)",
            }}
          >
            <h3
              className="text-sm font-bold mb-4"
              style={{ color: "var(--parent-heading)" }}
            >
              Modernization Score
            </h3>
            <GaugeMeter value={84} />
            <p
              className="text-xs text-center mt-3"
              style={{ color: "var(--parent-muted)" }}
            >
              Above national average of 76/100
            </p>
            <div className="mt-4 space-y-2 w-full">
              {[
                "AI-integrated curriculum",
                "Industry-aligned projects",
                "Startup incubation cell",
                "Research publication support",
              ].map((init) => (
                <div
                  key={init}
                  className="flex items-center gap-2 text-xs"
                  style={{ color: "var(--parent-heading)" }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: "var(--parent-primary)" }}
                  />
                  {init}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Campus Environment */}
      <section>
        <h2
          className="text-lg font-display font-bold mb-4 flex items-center gap-2"
          style={{ color: "var(--parent-heading)" }}
        >
          <span className="text-xl">🌱</span> Campus Environment
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-4">
            {campusMetrics.map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl p-5 flex flex-col items-center text-center"
                style={{
                  background: "var(--parent-card)",
                  border: "1px solid var(--parent-border)",
                }}
              >
                <div className="text-2xl mb-2">{metric.icon}</div>
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ color: metric.color }}
                >
                  {metric.value}%
                </div>
                <div
                  className="text-xs font-medium"
                  style={{ color: "var(--parent-heading)" }}
                >
                  {metric.label}
                </div>
                <Progress value={metric.value} className="h-1.5 mt-2 w-full" />
              </div>
            ))}
          </div>

          <div
            className="rounded-2xl p-6"
            style={{
              background: "var(--parent-card)",
              border: "1px solid var(--parent-border)",
            }}
          >
            <h3
              className="text-sm font-bold mb-4 flex items-center gap-2"
              style={{ color: "var(--parent-heading)" }}
            >
              <Leaf
                className="w-4 h-4"
                style={{ color: "oklch(0.52 0.15 145)" }}
              />
              Campus Improvement Timeline
            </h3>
            <div className="space-y-4">
              {campusUpdates.map((update, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static list
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5"
                      style={{ background: "var(--parent-primary)" }}
                    />
                    {i < campusUpdates.length - 1 && (
                      <div
                        className="w-0.5 flex-1 mt-1"
                        style={{ background: "var(--parent-border)" }}
                      />
                    )}
                  </div>
                  <div className="pb-3">
                    <div
                      className="text-xs font-bold mb-0.5"
                      style={{ color: "var(--parent-primary)" }}
                    >
                      {update.date}
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--parent-heading)" }}
                    >
                      {update.update}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div
              className="mt-4 p-3 rounded-xl flex items-center gap-2"
              style={{ background: "oklch(0.52 0.15 145 / 0.1)" }}
            >
              <span className="text-lg">🛡️</span>
              <div>
                <div
                  className="text-xs font-bold"
                  style={{ color: "oklch(0.42 0.15 145)" }}
                >
                  Anti-Trap Safety: ACTIVE
                </div>
                <div
                  className="text-xs"
                  style={{ color: "oklch(0.42 0.15 145)" }}
                >
                  Zero incidents reported this semester. All safety protocols
                  enforced.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
