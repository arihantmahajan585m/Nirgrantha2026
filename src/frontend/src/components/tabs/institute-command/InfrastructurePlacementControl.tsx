import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Briefcase, Building2 } from "lucide-react";
import { useState } from "react";

const facilities = [
  {
    name: "Advanced Computing Lab",
    status: "missing",
    priority: "high",
    cost: "₹45L",
  },
  {
    name: "Research & Innovation Center",
    status: "partial",
    priority: "high",
    cost: "₹1.2Cr",
  },
  {
    name: "Smart Classrooms (Remaining 12)",
    status: "missing",
    priority: "medium",
    cost: "₹36L",
  },
  {
    name: "Digital Library System",
    status: "partial",
    priority: "medium",
    cost: "₹18L",
  },
  {
    name: "EV Charging Station",
    status: "missing",
    priority: "low",
    cost: "₹8L",
  },
  {
    name: "Student Innovation Hub",
    status: "missing",
    priority: "high",
    cost: "₹60L",
  },
  {
    name: "Industry Collaboration Suite",
    status: "partial",
    priority: "medium",
    cost: "₹22L",
  },
];

const witLabInfrastructure = [
  { lab: "Computer Labs", wit: 8 },
  { lab: "Electronics Labs", wit: 4 },
  { lab: "Research Labs", wit: 2 },
  { lab: "Fabrication Labs", wit: 1 },
  { lab: "AI/ML Labs", wit: 1 },
];

const labBenchmarkStages = [
  {
    id: "solapur",
    stageLabel: "Stage 1",
    title: "Solapur Surrounding Colleges",
    description:
      "WIT College first compares against nearby Solapur-region colleges. Clear this ring before moving outward.",
    colleges: [
      {
        name: "N. K. Orchid College, Solapur",
        shortLabel: "Orchid",
        color: "oklch(0.75 0.18 80)",
        values: [6, 3, 1, 0, 0],
      },
      {
        name: "A. G. Patil Institute, Solapur",
        shortLabel: "AGPIT",
        color: "oklch(0.62 0.18 250)",
        values: [5, 2, 1, 1, 0],
      },
      {
        name: "Siddheshwar Women's College, Solapur",
        shortLabel: "SWCOE",
        color: "oklch(0.62 0.14 25)",
        values: [4, 2, 1, 0, 0],
      },
    ],
  },
  {
    id: "state-tier-1",
    stageLabel: "Stage 2",
    title: "Maharashtra Tier 1 Colleges",
    description:
      "After winning locally, WIT benchmarks against the strongest state-level engineering campuses.",
    colleges: [
      {
        name: "COEP Technological University, Pune",
        shortLabel: "COEP",
        color: "oklch(0.75 0.18 80)",
        values: [12, 8, 5, 3, 3],
      },
      {
        name: "VJTI, Mumbai",
        shortLabel: "VJTI",
        color: "oklch(0.62 0.18 250)",
        values: [11, 7, 4, 2, 2],
      },
      {
        name: "Walchand College of Engineering, Sangli",
        shortLabel: "WCE",
        color: "oklch(0.62 0.14 25)",
        values: [10, 6, 4, 2, 2],
      },
    ],
  },
  {
    id: "national-tier-1",
    stageLabel: "Stage 3",
    title: "IIIT / NIT / IIT Benchmark",
    description:
      "The national benchmark only unlocks after WIT leads the state Tier 1 comparison.",
    colleges: [
      {
        name: "IIIT Pune",
        shortLabel: "IIIT",
        color: "oklch(0.80 0.12 200)",
        values: [14, 10, 6, 3, 4],
      },
      {
        name: "VNIT Nagpur",
        shortLabel: "NIT",
        color: "oklch(0.75 0.18 80)",
        values: [16, 12, 7, 4, 6],
      },
      {
        name: "IIT Bombay",
        shortLabel: "IIT",
        color: "oklch(0.52 0.16 160)",
        values: [24, 18, 42, 8, 12],
      },
    ],
  },
];

const smartboardUsage = [
  { dept: "CSE", usage: 88, boards: 24 },
  { dept: "IT", usage: 82, boards: 18 },
  { dept: "ECE", usage: 74, boards: 20 },
  { dept: "Mechanical", usage: 62, boards: 16 },
  { dept: "Civil", usage: 58, boards: 14 },
  { dept: "EEE", usage: 70, boards: 12 },
];

const techUpgrades = [
  {
    item: "MATLAB License Renewal",
    status: "approved",
    dept: "ECE",
    cost: "₹4.2L",
  },
  {
    item: "AWS Educate Subscription",
    status: "pending",
    dept: "CSE",
    cost: "₹2.8L",
  },
  {
    item: "AutoCAD 2025 Upgrade",
    status: "delivered",
    dept: "Civil",
    cost: "₹1.6L",
  },
  {
    item: "Robotics Kit (50 units)",
    status: "pending",
    dept: "Mechanical",
    cost: "₹8.5L",
  },
  {
    item: "GPU Cluster for AI Lab",
    status: "approved",
    dept: "CSE",
    cost: "₹28L",
  },
  {
    item: "VR Headsets (20 units)",
    status: "pending",
    dept: "IT",
    cost: "₹6L",
  },
];

const modernizationProgress = [
  { category: "Smart Classrooms", progress: 68 },
  { category: "Lab Upgrades", progress: 45 },
  { category: "Campus Connectivity", progress: 82 },
  { category: "Digital Infrastructure", progress: 74 },
  { category: "Green Campus", progress: 38 },
];

const companies = [
  {
    name: "TCS",
    sector: "IT",
    status: "completed",
    engagement: 94,
    offers: 48,
  },
  {
    name: "Infosys",
    sector: "IT",
    status: "completed",
    engagement: 91,
    offers: 36,
  },
  {
    name: "Wipro",
    sector: "IT",
    status: "scheduled",
    engagement: 88,
    offers: 0,
  },
  {
    name: "L&T",
    sector: "Engineering",
    status: "completed",
    engagement: 82,
    offers: 22,
  },
  {
    name: "Bosch",
    sector: "Manufacturing",
    status: "responded",
    engagement: 76,
    offers: 0,
  },
  {
    name: "Amazon",
    sector: "Tech",
    status: "contacted",
    engagement: 68,
    offers: 0,
  },
  {
    name: "Microsoft",
    sector: "Tech",
    status: "contacted",
    engagement: 62,
    offers: 0,
  },
  {
    name: "Siemens",
    sector: "Engineering",
    status: "scheduled",
    engagement: 78,
    offers: 0,
  },
];

const salaryTrends = [
  { year: "2021", avg: 4.8, highest: 18 },
  { year: "2022", avg: 5.2, highest: 24 },
  { year: "2023", avg: 5.8, highest: 32 },
  { year: "2024", avg: 6.2, highest: 42 },
  { year: "2025*", avg: 7.1, highest: 52 },
];

const placementByBranch = [
  { branch: "CSE", placed: 374, total: 480, avgCTC: 8.4 },
  { branch: "IT", placed: 266, total: 360, avgCTC: 7.8 },
  { branch: "ECE", placed: 273, total: 420, avgCTC: 5.6 },
  { branch: "Mechanical", placed: 198, total: 380, avgCTC: 4.8 },
  { branch: "Civil", placed: 154, total: 320, avgCTC: 4.2 },
  { branch: "EEE", placed: 163, total: 280, avgCTC: 5.1 },
];

const recruiterFeedback = [
  {
    company: "TCS",
    rating: 4.2,
    comment: "Good technical skills in CSE. Communication needs improvement.",
  },
  {
    company: "Infosys",
    rating: 4.0,
    comment: "Strong coding aptitude. Soft skills training recommended.",
  },
  {
    company: "L&T",
    rating: 3.8,
    comment:
      "Core engineering knowledge is adequate. More project exposure needed.",
  },
  {
    company: "Wipro",
    rating: 4.1,
    comment: "Enthusiastic candidates. Domain knowledge is satisfactory.",
  },
];

const targetSectors = [
  { sector: "FinTech", companies: "Razorpay, Paytm, CRED", potential: "High" },
  {
    sector: "EV & Automotive",
    companies: "Ola Electric, Tata Motors, Mahindra",
    potential: "High",
  },
  {
    sector: "Healthcare Tech",
    companies: "Practo, PharmEasy, 1mg",
    potential: "Medium",
  },
  {
    sector: "EdTech",
    companies: "BYJU'S, Unacademy, Coursera",
    potential: "Medium",
  },
  {
    sector: "Defense & Aerospace",
    companies: "DRDO, HAL, ISRO",
    potential: "High",
  },
];

const heatmapDepts = ["CSE", "IT", "ECE", "Mech", "Civil", "EEE"];
const heatmapSectors = [
  "IT/Software",
  "Core Engg",
  "Finance",
  "Consulting",
  "Research",
  "Govt/PSU",
];
const heatmapData = [
  [5, 1, 2, 3, 1, 1],
  [4, 1, 2, 2, 1, 1],
  [2, 4, 1, 2, 2, 2],
  [1, 5, 1, 1, 2, 3],
  [1, 4, 1, 1, 2, 4],
  [2, 4, 2, 1, 2, 3],
];

function heatColor(val: number): string {
  const colors = [
    "oklch(0.88 0.02 220)",
    "oklch(0.75 0.10 80 / 0.4)",
    "oklch(0.75 0.14 80 / 0.6)",
    "oklch(0.60 0.16 160 / 0.5)",
    "oklch(0.52 0.16 160 / 0.75)",
    "oklch(0.45 0.16 160)",
  ];
  return colors[Math.min(val, colors.length - 1)];
}

function statusStyle(status: string): { background: string; color: string } {
  switch (status) {
    case "completed":
      return {
        background: "oklch(0.45 0.15 145 / 0.15)",
        color: "oklch(0.40 0.15 145)",
      };
    case "scheduled":
      return {
        background: "var(--iicc-blue-subtle)",
        color: "var(--iicc-blue)",
      };
    case "responded":
      return {
        background: "oklch(0.75 0.18 80 / 0.15)",
        color: "oklch(0.55 0.18 80)",
      };
    default:
      return {
        background: "oklch(0.88 0.02 220)",
        color: "oklch(0.50 0.02 220)",
      };
  }
}

export default function InfrastructurePlacementControl() {
  const [_campaignDialogOpen, _setCampaignDialogOpen] = useState(false);
  const witLabTotal = witLabInfrastructure.reduce(
    (sum, metric) => sum + metric.wit,
    0,
  );
  const benchmarkStages = labBenchmarkStages.map((stage, index) => {
    const competitorTotals = stage.colleges.map((college) =>
      college.values.reduce((sum, value) => sum + value, 0),
    );
    const cleared =
      competitorTotals.length > 0 &&
      witLabTotal >= Math.max(...competitorTotals);
    const unlocked =
      index === 0 ? true : labBenchmarkStages[index - 1]
        ? witLabTotal >=
          Math.max(
            ...labBenchmarkStages[index - 1].colleges.map((college) =>
              college.values.reduce((sum, value) => sum + value, 0),
            ),
          )
        : false;

    return {
      ...stage,
      cleared,
      unlocked,
      competitorTotals,
    };
  });
  const highestUnlockedStageId =
    benchmarkStages.filter((stage) => stage.unlocked).at(-1)?.id ??
    benchmarkStages[0].id;
  const [activeBenchmarkStage, setActiveBenchmarkStage] =
    useState(highestUnlockedStageId);

  const maxSalary = Math.max(...salaryTrends.map((s) => s.highest));
  const currentBenchmarkStage =
    benchmarkStages.find((stage) => stage.id === activeBenchmarkStage) ??
    benchmarkStages[0];
  const currentBenchmarkRows = witLabInfrastructure.map((metric, index) => ({
    lab: metric.lab,
    wit: metric.wit,
    colleges: currentBenchmarkStage.colleges.map((college) => ({
      name: college.name,
      shortLabel: college.shortLabel,
      value: college.values[index],
      color: college.color,
    })),
  }));
  const currentBenchmarkMax = Math.max(
    ...currentBenchmarkRows.flatMap((row) => [
      row.wit,
      ...row.colleges.map((college) => college.value),
    ]),
  );

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-10">
      {/* Header KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Infrastructure Score",
            value: "62/100",
            color: "oklch(0.75 0.18 80)",
          },
          { label: "Placement Rate", value: "68%", color: "var(--iicc-blue)" },
          {
            label: "Companies Visited",
            value: "48",
            color: "oklch(0.52 0.16 160)",
          },
          { label: "Avg CTC", value: "₹6.2L", color: "oklch(0.55 0.18 280)" },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-xl border p-4 text-center"
            style={{
              background: "var(--iicc-card)",
              borderColor: "var(--iicc-border)",
            }}
          >
            <div
              className="text-2xl font-bold font-display"
              style={{ color: k.color }}
            >
              {k.value}
            </div>
            <div
              className="text-xs mt-1"
              style={{ color: "var(--iicc-muted)" }}
            >
              {k.label}
            </div>
          </div>
        ))}
      </div>

      {/* ─── INFRASTRUCTURE SECTION ─── */}
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "var(--iicc-blue)" }}
        >
          <Building2 className="w-4 h-4 text-white" />
        </div>
        <h2
          className="text-xl font-display font-bold"
          style={{ color: "var(--iicc-heading)" }}
        >
          Infrastructure Control
        </h2>
      </div>

      {/* Missing Facilities + Lab Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h3
            className="text-base font-display font-bold mb-4"
            style={{ color: "var(--iicc-heading)" }}
          >
            Missing Facilities Tracker
          </h3>
          <div
            className="rounded-xl border overflow-hidden"
            style={{
              background: "var(--iicc-card)",
              borderColor: "var(--iicc-border)",
            }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--iicc-bg)" }}>
                  <th
                    className="px-4 py-2.5 text-left text-xs font-semibold"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    Facility
                  </th>
                  <th
                    className="px-4 py-2.5 text-left text-xs font-semibold"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    Status
                  </th>
                  <th
                    className="px-4 py-2.5 text-left text-xs font-semibold"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    Priority
                  </th>
                  <th
                    className="px-4 py-2.5 text-left text-xs font-semibold"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    Est. Cost
                  </th>
                </tr>
              </thead>
              <tbody>
                {facilities.map((f, i) => (
                  <tr
                    key={f.name}
                    style={{
                      borderBottom: "1px solid var(--iicc-border)",
                      background:
                        i % 2 === 0 ? "transparent" : "var(--iicc-bg)",
                    }}
                  >
                    <td
                      className="px-4 py-2.5 text-xs font-medium"
                      style={{ color: "var(--iicc-heading)" }}
                    >
                      {f.name}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className="px-1.5 py-0.5 rounded text-xs font-semibold"
                        style={{
                          background:
                            f.status === "missing"
                              ? "oklch(0.60 0.22 25 / 0.15)"
                              : "oklch(0.75 0.18 80 / 0.15)",
                          color:
                            f.status === "missing"
                              ? "oklch(0.50 0.22 25)"
                              : "oklch(0.55 0.18 80)",
                        }}
                      >
                        {f.status === "missing" ? "✗ Missing" : "◑ Partial"}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className="px-1.5 py-0.5 rounded text-xs font-semibold"
                        style={{
                          background:
                            f.priority === "high"
                              ? "oklch(0.60 0.22 25 / 0.12)"
                              : f.priority === "medium"
                                ? "var(--iicc-blue-subtle)"
                                : "oklch(0.45 0.15 145 / 0.12)",
                          color:
                            f.priority === "high"
                              ? "oklch(0.50 0.22 25)"
                              : f.priority === "medium"
                                ? "var(--iicc-blue)"
                                : "oklch(0.40 0.15 145)",
                        }}
                      >
                        {f.priority.toUpperCase()}
                      </span>
                    </td>
                    <td
                      className="px-4 py-2.5 text-xs font-semibold"
                      style={{ color: "var(--iicc-muted)" }}
                    >
                      {f.cost}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3
            className="text-base font-display font-bold mb-4"
            style={{ color: "var(--iicc-heading)" }}
          >
            WIT College Lab Benchmark Roadmap
          </h3>
          <div
            className="rounded-xl border p-5 space-y-5"
            style={{
              background: "var(--iicc-card)",
              borderColor: "var(--iicc-border)",
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {benchmarkStages.map((stage, index) => {
                const isActive = currentBenchmarkStage.id === stage.id;
                const statusLabel = stage.cleared
                  ? "Cleared"
                  : stage.unlocked
                    ? "Live"
                    : "Locked";
                return (
                  <button
                    key={stage.id}
                    type="button"
                    disabled={!stage.unlocked}
                    onClick={() => setActiveBenchmarkStage(stage.id)}
                    className="text-left rounded-xl border p-3 transition-all"
                    style={{
                      background: isActive
                        ? "var(--iicc-blue-subtle)"
                        : "var(--iicc-bg)",
                      borderColor: isActive
                        ? "var(--iicc-blue)"
                        : "var(--iicc-border)",
                      opacity: stage.unlocked ? 1 : 0.55,
                      cursor: stage.unlocked ? "pointer" : "not-allowed",
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="text-xs font-semibold uppercase tracking-[0.18em]"
                        style={{ color: "var(--iicc-muted)" }}
                      >
                        {stage.stageLabel}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-semibold"
                        style={{
                          background: stage.cleared
                            ? "oklch(0.45 0.15 145 / 0.15)"
                            : stage.unlocked
                              ? "var(--iicc-blue-subtle)"
                              : "oklch(0.88 0.02 220)",
                          color: stage.cleared
                            ? "oklch(0.40 0.15 145)"
                            : stage.unlocked
                              ? "var(--iicc-blue)"
                              : "var(--iicc-muted)",
                        }}
                      >
                        {statusLabel}
                      </span>
                    </div>
                    <div
                      className="text-sm font-semibold mt-2"
                      style={{ color: "var(--iicc-heading)" }}
                    >
                      {stage.title}
                    </div>
                    <div
                      className="text-xs mt-1"
                      style={{ color: "var(--iicc-muted)" }}
                    >
                      {index === 0
                        ? "Beat nearby Solapur-region colleges first."
                        : index === 1
                          ? "Unlocked after WIT wins Stage 1."
                          : "Unlocked only after WIT wins Stage 2."}
                    </div>
                  </button>
                );
              })}
            </div>
            <div
              className="rounded-xl border p-4"
              style={{
                background: "var(--iicc-bg)",
                borderColor: "var(--iicc-border)",
              }}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div
                    className="text-xs font-semibold uppercase tracking-[0.18em]"
                    style={{ color: "var(--iicc-blue)" }}
                  >
                    {currentBenchmarkStage.stageLabel}
                  </div>
                  <div
                    className="text-sm font-semibold mt-1"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    {currentBenchmarkStage.title}
                  </div>
                  <div
                    className="text-xs mt-1 max-w-2xl"
                    style={{ color: "var(--iicc-muted)" }}
                  >
                    {currentBenchmarkStage.description}
                  </div>
                </div>
                <div
                  className="rounded-lg px-3 py-2"
                  style={{
                    background: currentBenchmarkStage.cleared
                      ? "oklch(0.45 0.15 145 / 0.15)"
                      : currentBenchmarkStage.unlocked
                        ? "var(--iicc-blue-subtle)"
                        : "oklch(0.88 0.02 220)",
                  }}
                >
                  <div
                    className="text-[10px] uppercase tracking-[0.18em]"
                    style={{ color: "var(--iicc-muted)" }}
                  >
                    Progress Gate
                  </div>
                  <div
                    className="text-xs font-semibold mt-1"
                    style={{
                      color: currentBenchmarkStage.cleared
                        ? "oklch(0.40 0.15 145)"
                        : currentBenchmarkStage.unlocked
                          ? "var(--iicc-blue)"
                          : "var(--iicc-heading)",
                    }}
                  >
                    {currentBenchmarkStage.cleared
                      ? "WIT has cleared this stage."
                      : currentBenchmarkStage.unlocked
                        ? "WIT is currently competing in this stage."
                        : "WIT must clear the previous stage first."}
                  </div>
                </div>
              </div>
            </div>
            <div
              className="flex flex-wrap items-center gap-4 text-xs"
              style={{ color: "var(--iicc-muted)" }}
            >
              <span className="flex items-center gap-1">
                <span
                  className="w-3 h-1.5 rounded inline-block"
                  style={{ background: "var(--iicc-blue)" }}
                />{" "}
                WIT College
              </span>
              {currentBenchmarkStage.colleges.map((college) => (
                <span key={college.shortLabel} className="flex items-center gap-1">
                  <span
                    className="w-3 h-1.5 rounded inline-block"
                    style={{ background: college.color }}
                  />{" "}
                  {college.shortLabel}
                </span>
              ))}
            </div>
            {currentBenchmarkRows.map((row) => (
              <div key={row.lab}>
                <div
                  className="text-xs font-medium mb-1.5"
                  style={{ color: "var(--iicc-heading)" }}
                >
                  {row.lab}
                </div>
                <div className="space-y-1">
                  {[
                    {
                      label: "WIT",
                      val: row.wit,
                      color: "var(--iicc-blue)",
                    },
                    ...row.colleges.map((college) => ({
                      label: college.shortLabel,
                      val: college.value,
                      color: college.color,
                    })),
                  ].map((metricRow) => (
                    <div key={metricRow.label} className="flex items-center gap-2">
                      <span
                        className="w-12 text-xs"
                        style={{ color: "var(--iicc-muted)" }}
                      >
                        {metricRow.label}
                      </span>
                      <div
                        className="flex-1 h-2 rounded-full overflow-hidden"
                        style={{ background: "var(--iicc-border)" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(metricRow.val / currentBenchmarkMax) * 100}%`,
                            background: metricRow.color,
                          }}
                        />
                      </div>
                      <span
                        className="w-6 text-xs font-bold text-right"
                        style={{ color: "var(--iicc-heading)" }}
                      >
                        {metricRow.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div
              className="rounded-lg border px-4 py-3 text-xs"
              style={{
                background: "var(--iicc-bg)",
                borderColor: "var(--iicc-border)",
                color: "var(--iicc-muted)",
              }}
            >
              <strong style={{ color: "var(--iicc-heading)" }}>
                Advancement rule:
              </strong>{" "}
              WIT moves to the next benchmark stage only after leading the
              current stage on total lab readiness.
            </div>
          </div>
        </section>
      </div>

      {/* Smartboard Usage + Tech Upgrades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h3
            className="text-base font-display font-bold mb-4"
            style={{ color: "var(--iicc-heading)" }}
          >
            Smartboard Usage by Department
          </h3>
          <div
            className="rounded-xl border p-5 space-y-3"
            style={{
              background: "var(--iicc-card)",
              borderColor: "var(--iicc-border)",
            }}
          >
            {smartboardUsage.map((s) => (
              <div key={s.dept}>
                <div className="flex justify-between text-xs mb-1">
                  <span
                    className="font-medium"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    {s.dept}{" "}
                    <span style={{ color: "var(--iicc-muted)" }}>
                      ({s.boards} boards)
                    </span>
                  </span>
                  <span
                    className="font-bold"
                    style={{
                      color:
                        s.usage >= 80
                          ? "oklch(0.52 0.16 160)"
                          : s.usage >= 65
                            ? "var(--iicc-blue)"
                            : "oklch(0.60 0.22 25)",
                    }}
                  >
                    {s.usage}%
                  </span>
                </div>
                <div
                  className="h-2.5 rounded-full overflow-hidden"
                  style={{ background: "var(--iicc-border)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${s.usage}%`,
                      background:
                        s.usage >= 80
                          ? "oklch(0.52 0.16 160)"
                          : s.usage >= 65
                            ? "var(--iicc-blue)"
                            : "oklch(0.60 0.22 25)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3
            className="text-base font-display font-bold mb-4"
            style={{ color: "var(--iicc-heading)" }}
          >
            Technology Upgrade Tracker
          </h3>
          <div
            className="rounded-xl border overflow-hidden"
            style={{
              background: "var(--iicc-card)",
              borderColor: "var(--iicc-border)",
            }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--iicc-bg)" }}>
                  <th
                    className="px-3 py-2.5 text-left text-xs font-semibold"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    Item
                  </th>
                  <th
                    className="px-3 py-2.5 text-left text-xs font-semibold"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    Dept
                  </th>
                  <th
                    className="px-3 py-2.5 text-left text-xs font-semibold"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    Cost
                  </th>
                  <th
                    className="px-3 py-2.5 text-left text-xs font-semibold"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {techUpgrades.map((t, i) => (
                  <tr
                    key={t.item}
                    style={{
                      borderBottom: "1px solid var(--iicc-border)",
                      background:
                        i % 2 === 0 ? "transparent" : "var(--iicc-bg)",
                    }}
                  >
                    <td
                      className="px-3 py-2.5 text-xs font-medium"
                      style={{ color: "var(--iicc-heading)" }}
                    >
                      {t.item}
                    </td>
                    <td
                      className="px-3 py-2.5 text-xs"
                      style={{ color: "var(--iicc-muted)" }}
                    >
                      {t.dept}
                    </td>
                    <td
                      className="px-3 py-2.5 text-xs font-semibold"
                      style={{ color: "var(--iicc-muted)" }}
                    >
                      {t.cost}
                    </td>
                    <td className="px-3 py-2.5">
                      <span
                        className="px-1.5 py-0.5 rounded text-xs font-semibold"
                        style={{
                          background:
                            t.status === "delivered"
                              ? "oklch(0.45 0.15 145 / 0.15)"
                              : t.status === "approved"
                                ? "var(--iicc-blue-subtle)"
                                : "oklch(0.75 0.18 80 / 0.15)",
                          color:
                            t.status === "delivered"
                              ? "oklch(0.40 0.15 145)"
                              : t.status === "approved"
                                ? "var(--iicc-blue)"
                                : "oklch(0.55 0.18 80)",
                        }}
                      >
                        {t.status === "delivered"
                          ? "✓ Delivered"
                          : t.status === "approved"
                            ? "● Approved"
                            : "○ Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Campus Modernization Progress */}
      <section>
        <h3
          className="text-base font-display font-bold mb-4"
          style={{ color: "var(--iicc-heading)" }}
        >
          Campus Modernization Progress
        </h3>
        <div
          className="rounded-xl border p-5"
          style={{
            background: "var(--iicc-card)",
            borderColor: "var(--iicc-border)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-sm font-medium"
              style={{ color: "var(--iicc-muted)" }}
            >
              Overall Completion
            </span>
            <span
              className="text-2xl font-bold font-display"
              style={{ color: "var(--iicc-blue)" }}
            >
              61%
            </span>
          </div>
          <div
            className="h-3 rounded-full overflow-hidden mb-6"
            style={{ background: "var(--iicc-border)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: "61%",
                background:
                  "linear-gradient(90deg, var(--iicc-blue) 0%, oklch(0.52 0.16 160) 100%)",
              }}
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {modernizationProgress.map((m) => (
              <div key={m.category} className="text-center">
                <div className="relative w-14 h-14 mx-auto mb-2">
                  <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
                    <title>Chart</title>
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      fill="none"
                      stroke="var(--iicc-border)"
                      strokeWidth="5"
                    />
                    <circle
                      cx="28"
                      cy="28"
                      r="22"
                      fill="none"
                      stroke="var(--iicc-blue)"
                      strokeWidth="5"
                      strokeDasharray={`${(2 * Math.PI * 22 * m.progress) / 100} ${2 * Math.PI * 22}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-xs font-bold"
                      style={{ color: "var(--iicc-blue)" }}
                    >
                      {m.progress}%
                    </span>
                  </div>
                </div>
                <div
                  className="text-xs font-medium"
                  style={{ color: "var(--iicc-heading)" }}
                >
                  {m.category}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PLACEMENT SECTION ─── */}
      <div
        className="flex items-center gap-3 pt-4"
        style={{ borderTop: "2px solid var(--iicc-border)" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: "oklch(0.52 0.16 160)" }}
        >
          <Briefcase className="w-4 h-4 text-white" />
        </div>
        <h2
          className="text-xl font-display font-bold"
          style={{ color: "var(--iicc-heading)" }}
        >
          Placement Control Center
        </h2>
      </div>

      {/* Company Outreach + Engagement Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h3
            className="text-base font-display font-bold mb-4"
            style={{ color: "var(--iicc-heading)" }}
          >
            Company Outreach Tracking
          </h3>
          <div
            className="rounded-xl border overflow-hidden"
            style={{
              background: "var(--iicc-card)",
              borderColor: "var(--iicc-border)",
            }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--iicc-blue)", color: "white" }}>
                  <th className="px-4 py-3 text-left font-semibold">Company</th>
                  <th className="px-4 py-3 text-left font-semibold">Sector</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                  <th className="px-4 py-3 text-left font-semibold">Offers</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c, i) => (
                  <tr
                    key={c.name}
                    style={{
                      borderBottom: "1px solid var(--iicc-border)",
                      background:
                        i % 2 === 0 ? "transparent" : "var(--iicc-bg)",
                    }}
                  >
                    <td
                      className="px-4 py-2.5 font-semibold text-xs"
                      style={{ color: "var(--iicc-heading)" }}
                    >
                      {c.name}
                    </td>
                    <td
                      className="px-4 py-2.5 text-xs"
                      style={{ color: "var(--iicc-muted)" }}
                    >
                      {c.sector}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className="px-2 py-0.5 rounded text-xs font-semibold"
                        style={statusStyle(c.status)}
                      >
                        {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                      </span>
                    </td>
                    <td
                      className="px-4 py-2.5 font-bold text-xs"
                      style={{
                        color:
                          c.offers > 0
                            ? "oklch(0.52 0.16 160)"
                            : "var(--iicc-muted)",
                      }}
                    >
                      {c.offers > 0 ? c.offers : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3
            className="text-base font-display font-bold mb-4"
            style={{ color: "var(--iicc-heading)" }}
          >
            Company Engagement Score Leaderboard
          </h3>
          <div
            className="rounded-xl border p-5 space-y-3"
            style={{
              background: "var(--iicc-card)",
              borderColor: "var(--iicc-border)",
            }}
          >
            {[...companies]
              .sort((a, b) => b.engagement - a.engagement)
              .map((c, i) => (
                <div key={c.name} className="flex items-center gap-3">
                  <span
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{
                      background:
                        i < 3 ? "var(--iicc-blue)" : "var(--iicc-border)",
                      color: i < 3 ? "white" : "var(--iicc-muted)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="w-20 text-xs font-semibold"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    {c.name}
                  </span>
                  <div
                    className="flex-1 h-2 rounded-full overflow-hidden"
                    style={{ background: "var(--iicc-border)" }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${c.engagement}%`,
                        background: "var(--iicc-blue)",
                      }}
                    />
                  </div>
                  <span
                    className="text-xs font-bold w-8 text-right"
                    style={{ color: "var(--iicc-blue)" }}
                  >
                    {c.engagement}
                  </span>
                </div>
              ))}
          </div>
        </section>
      </div>

      {/* Placement Statistics + Salary Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h3
            className="text-base font-display font-bold mb-4"
            style={{ color: "var(--iicc-heading)" }}
          >
            Placement Statistics by Branch
          </h3>
          <div
            className="rounded-xl border overflow-hidden"
            style={{
              background: "var(--iicc-card)",
              borderColor: "var(--iicc-border)",
            }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: "var(--iicc-blue)", color: "white" }}>
                  <th className="px-4 py-3 text-left font-semibold">Branch</th>
                  <th className="px-4 py-3 text-left font-semibold">Placed</th>
                  <th className="px-4 py-3 text-left font-semibold">Rate</th>
                  <th className="px-4 py-3 text-left font-semibold">Avg CTC</th>
                </tr>
              </thead>
              <tbody>
                {placementByBranch.map((p, i) => (
                  <tr
                    key={p.branch}
                    style={{
                      borderBottom: "1px solid var(--iicc-border)",
                      background:
                        i % 2 === 0 ? "transparent" : "var(--iicc-bg)",
                    }}
                  >
                    <td
                      className="px-4 py-2.5 font-medium text-xs"
                      style={{ color: "var(--iicc-heading)" }}
                    >
                      {p.branch}
                    </td>
                    <td
                      className="px-4 py-2.5 font-semibold text-xs"
                      style={{ color: "var(--iicc-heading)" }}
                    >
                      {p.placed}/{p.total}
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-12 h-1.5 rounded-full overflow-hidden"
                          style={{ background: "var(--iicc-border)" }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${(p.placed / p.total) * 100}%`,
                              background: "var(--iicc-blue)",
                            }}
                          />
                        </div>
                        <span
                          className="text-xs font-bold"
                          style={{ color: "var(--iicc-blue)" }}
                        >
                          {((p.placed / p.total) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td
                      className="px-4 py-2.5 font-semibold text-xs"
                      style={{ color: "oklch(0.52 0.16 160)" }}
                    >
                      ₹{p.avgCTC}L
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3
            className="text-base font-display font-bold mb-4"
            style={{ color: "var(--iicc-heading)" }}
          >
            Salary Trend Analytics (Year-on-Year)
          </h3>
          <div
            className="rounded-xl border p-5"
            style={{
              background: "var(--iicc-card)",
              borderColor: "var(--iicc-border)",
            }}
          >
            <div
              className="flex items-center gap-4 text-xs mb-4"
              style={{ color: "var(--iicc-muted)" }}
            >
              <span className="flex items-center gap-1">
                <span
                  className="w-3 h-1.5 rounded inline-block"
                  style={{ background: "var(--iicc-blue)" }}
                />{" "}
                Avg CTC (LPA)
              </span>
              <span className="flex items-center gap-1">
                <span
                  className="w-3 h-1.5 rounded inline-block"
                  style={{ background: "oklch(0.52 0.16 160)" }}
                />{" "}
                Highest CTC (LPA)
              </span>
            </div>
            <div className="flex items-end gap-3 h-36">
              {salaryTrends.map((s) => (
                <div
                  key={s.year}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div className="w-full flex flex-col items-center gap-0.5">
                    <div
                      className="w-full rounded-t-sm"
                      style={{
                        height: `${(s.highest / maxSalary) * 100}px`,
                        background: "oklch(0.52 0.16 160 / 0.3)",
                      }}
                    />
                    <div
                      className="w-full rounded-t-sm -mt-1"
                      style={{
                        height: `${(s.avg / maxSalary) * 100}px`,
                        background: "var(--iicc-blue)",
                      }}
                    />
                  </div>
                  <span
                    className="text-[10px] text-center"
                    style={{ color: "var(--iicc-muted)" }}
                  >
                    {s.year}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {salaryTrends.map((s) => (
                <div key={s.year} className="text-center">
                  <div
                    className="text-xs font-bold"
                    style={{ color: "var(--iicc-blue)" }}
                  >
                    ₹{s.avg}L
                  </div>
                  <div
                    className="text-[10px]"
                    style={{ color: "var(--iicc-muted)" }}
                  >
                    avg
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Recruiter Feedback */}
      <section>
        <h3
          className="text-base font-display font-bold mb-4"
          style={{ color: "var(--iicc-heading)" }}
        >
          Recruiter Feedback System
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recruiterFeedback.map((r) => (
            <div
              key={r.company}
              className="rounded-xl border p-4"
              style={{
                background: "var(--iicc-card)",
                borderColor: "var(--iicc-border)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="font-semibold text-sm"
                  style={{ color: "var(--iicc-heading)" }}
                >
                  {r.company}
                </span>
                <span
                  className="font-bold text-sm"
                  style={{ color: "oklch(0.60 0.18 80)" }}
                >
                  ★ {r.rating}/5
                </span>
              </div>
              <p className="text-xs" style={{ color: "var(--iicc-muted)" }}>
                {r.comment}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bring New Companies Strategy */}
      <section>
        <div
          className="rounded-xl border p-6"
          style={{
            background:
              "linear-gradient(135deg, var(--iicc-blue-subtle) 0%, var(--iicc-card) 100%)",
            borderColor: "var(--iicc-blue)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3
                className="text-base font-display font-bold"
                style={{ color: "var(--iicc-heading)" }}
              >
                🚀 "Bring New Companies" Strategy Panel
              </h3>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--iicc-muted)" }}
              >
                Target high-potential industry sectors for new recruiter
                partnerships
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg text-sm font-bold text-white cursor-pointer transition-opacity hover:opacity-90"
                  style={{ background: "var(--iicc-blue)" }}
                >
                  🎯 Launch Campaign
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Launch Placement Campaign</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will initiate outreach to all identified target
                    companies across the 5 high-potential sectors. Placement
                    cell coordinators will be notified to begin contact.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Launch Campaign</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {targetSectors.map((s) => (
              <div
                key={s.sector}
                className="rounded-lg border p-3"
                style={{
                  background: "var(--iicc-card)",
                  borderColor: "var(--iicc-border)",
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className="font-semibold text-xs"
                    style={{ color: "var(--iicc-heading)" }}
                  >
                    {s.sector}
                  </span>
                  <span
                    className="px-1.5 py-0.5 rounded text-xs font-bold"
                    style={{
                      background:
                        s.potential === "High"
                          ? "oklch(0.45 0.15 145 / 0.15)"
                          : "var(--iicc-blue-subtle)",
                      color:
                        s.potential === "High"
                          ? "oklch(0.40 0.15 145)"
                          : "var(--iicc-blue)",
                    }}
                  >
                    {s.potential}
                  </span>
                </div>
                <p className="text-xs" style={{ color: "var(--iicc-muted)" }}>
                  {s.companies}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Placement Growth Forecasting */}
      <section>
        <h3
          className="text-base font-display font-bold mb-4"
          style={{ color: "var(--iicc-heading)" }}
        >
          Placement Growth Forecasting
        </h3>
        <div
          className="rounded-xl border p-5"
          style={{
            background: "var(--iicc-card)",
            borderColor: "var(--iicc-border)",
          }}
        >
          <div
            className="flex items-center gap-4 text-xs mb-4"
            style={{ color: "var(--iicc-muted)" }}
          >
            <span className="flex items-center gap-1">
              <span
                className="w-3 h-1.5 rounded inline-block"
                style={{ background: "var(--iicc-blue)" }}
              />{" "}
              Actual
            </span>
            <span className="flex items-center gap-1">
              <span
                className="w-3 h-1.5 rounded inline-block border border-dashed"
                style={{
                  background: "oklch(0.52 0.16 160 / 0.4)",
                  borderColor: "oklch(0.52 0.16 160)",
                }}
              />{" "}
              Projected
            </span>
          </div>
          <div className="flex items-end gap-4 h-32">
            {[
              { year: "2022", rate: 58, projected: false },
              { year: "2023", rate: 63, projected: false },
              { year: "2024", rate: 68, projected: false },
              { year: "2025*", rate: 74, projected: true },
              { year: "2026*", rate: 80, projected: true },
              { year: "2027*", rate: 86, projected: true },
            ].map((d) => (
              <div
                key={d.year}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <span
                  className="text-xs font-bold"
                  style={{
                    color: d.projected
                      ? "oklch(0.52 0.16 160)"
                      : "var(--iicc-blue)",
                  }}
                >
                  {d.rate}%
                </span>
                <div
                  className="w-full rounded-t-sm"
                  style={{
                    height: `${(d.rate / 100) * 96}px`,
                    background: d.projected
                      ? "oklch(0.52 0.16 160 / 0.4)"
                      : "var(--iicc-blue)",
                    border: d.projected
                      ? "1px dashed oklch(0.52 0.16 160)"
                      : "none",
                  }}
                />
                <span
                  className="text-[10px]"
                  style={{ color: "var(--iicc-muted)" }}
                >
                  {d.year}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Partnership Heatmap */}
      <section>
        <h3
          className="text-base font-display font-bold mb-4"
          style={{ color: "var(--iicc-heading)" }}
        >
          Industry Partnership Heatmap
        </h3>
        <div
          className="rounded-xl border p-5 overflow-x-auto"
          style={{
            background: "var(--iicc-card)",
            borderColor: "var(--iicc-border)",
          }}
        >
          <div className="min-w-[500px]">
            {/* Header row */}
            <div className="flex gap-2 mb-2 ml-16">
              {heatmapSectors.map((s) => (
                <div
                  key={s}
                  className="flex-1 text-center text-xs font-semibold"
                  style={{ color: "var(--iicc-muted)" }}
                >
                  {s}
                </div>
              ))}
            </div>
            {/* Data rows */}
            {heatmapDepts.map((dept, di) => (
              <div key={dept} className="flex gap-2 mb-2 items-center">
                <div
                  className="w-14 text-xs font-semibold text-right pr-2"
                  style={{ color: "var(--iicc-heading)" }}
                >
                  {dept}
                </div>
                {heatmapSectors.map((_, si) => {
                  const val = heatmapData[di][si];
                  return (
                    <div
                      // biome-ignore lint/suspicious/noArrayIndexKey: static list
                      key={si}
                      className="flex-1 h-10 rounded-lg flex items-center justify-center text-xs font-bold"
                      style={{
                        background: heatColor(val),
                        color: val >= 4 ? "white" : "var(--iicc-heading)",
                      }}
                    >
                      {val === 5
                        ? "●●●"
                        : val === 4
                          ? "●●"
                          : val === 3
                            ? "●"
                            : val === 2
                              ? "◑"
                              : val === 1
                                ? "○"
                                : "—"}
                    </div>
                  );
                })}
              </div>
            ))}
            {/* Legend */}
            <div
              className="flex items-center gap-3 mt-4 text-xs"
              style={{ color: "var(--iicc-muted)" }}
            >
              <span>Intensity:</span>
              {[1, 2, 3, 4, 5].map((v) => (
                <span key={v} className="flex items-center gap-1">
                  <span
                    className="w-4 h-4 rounded inline-block"
                    style={{ background: heatColor(v) }}
                  />
                  {v === 1
                    ? "Weak"
                    : v === 3
                      ? "Moderate"
                      : v === 5
                        ? "Strong"
                        : ""}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Industry Collaboration Tracker */}
      <section>
        <h3
          className="text-base font-display font-bold mb-4"
          style={{ color: "var(--iicc-heading)" }}
        >
          Industry Collaboration Tracker
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: "Active MOUs",
              value: "12",
              icon: "📋",
              color: "var(--iicc-blue)",
            },
            {
              label: "Joint Projects",
              value: "8",
              icon: "🤝",
              color: "oklch(0.52 0.16 160)",
            },
            {
              label: "Industry Mentors",
              value: "34",
              icon: "👨‍💼",
              color: "oklch(0.55 0.18 280)",
            },
            {
              label: "Internship Partners",
              value: "22",
              icon: "🏢",
              color: "oklch(0.60 0.18 50)",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border p-4 text-center"
              style={{
                background: "var(--iicc-card)",
                borderColor: "var(--iicc-border)",
              }}
            >
              <div className="text-2xl mb-1">{item.icon}</div>
              <div
                className="text-2xl font-bold font-display"
                style={{ color: item.color }}
              >
                {item.value}
              </div>
              <div
                className="text-xs mt-1"
                style={{ color: "var(--iicc-muted)" }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
