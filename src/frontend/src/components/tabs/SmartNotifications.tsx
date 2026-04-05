import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import UpcomingExamsTracker from "@/components/tabs/UpcomingExamsTracker";
import {
  type ExamSemesterKey,
  type ScheduledExamEvent,
  examCategories,
  examDates,
  getScheduledExamEvents,
} from "@/data/studentExamTracker";
import {
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  Plus,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

function addDaysFromReference(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  d.setHours(23, 59, 59, 999);
  return d;
}

function examDetailLine(event: ScheduledExamEvent, sem: ExamSemesterKey): string {
  const full = examCategories.find((c) => c.id === event.categoryId)?.fullLabel;
  const monthHint = examDates[sem]?.[event.categoryId];
  const parts = [
    `Sem ${sem}`,
    full ?? event.label,
    monthHint ? `(${monthHint})` : "",
  ].filter(Boolean);
  return parts.join(" · ");
}

/** Same short names as Upcoming Exams: ISE 1, ISE 2, ISE 3, ESE, Practical Exam */
function upcomingExamShortLabel(categoryId: string): string {
  const c = examCategories.find((x) => x.id === categoryId);
  return c?.label ?? categoryId.toUpperCase();
}

const badges = [
  {
    icon: Flame,
    label: "30-Day Streak",
    color: "text-orange-500 bg-orange-100",
    earned: true,
  },
  {
    icon: Trophy,
    label: "Top Performer",
    color: "text-yellow-600 bg-yellow-100",
    earned: true,
  },
  {
    icon: Star,
    label: "Goal Crusher",
    color: "text-purple-600 bg-purple-100",
    earned: true,
  },
  {
    icon: Zap,
    label: "Speed Learner",
    color: "text-blue-600 bg-blue-100",
    earned: true,
  },
  {
    icon: BookOpen,
    label: "Bookworm",
    color: "text-teal bg-teal-light",
    earned: false,
  },
  {
    icon: CheckCircle2,
    label: "Perfect Week",
    color: "text-green-600 bg-green-100",
    earned: false,
  },
];

interface Goal {
  id: number;
  title: string;
  days: number;
  progress: number;
  created: Date;
  targetDate: Date;
}

interface CountdownItem {
  key: string;
  title: string;
  date: Date;
  badge: string;
}

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0)
        return setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

function CountdownTimer({ item }: { item: CountdownItem }) {
  const t = useCountdown(item.date);
  return (
    <Card className="rounded-2xl shadow-card card-hover">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2 gap-2">
          <p className="font-semibold text-sm leading-tight">{item.title}</p>
          <Badge variant="outline" className="text-[10px] flex-shrink-0">
            {item.badge}
          </Badge>
        </div>
        <p className="text-[10px] text-muted-foreground mb-2">
          {item.date.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
        <div className="grid grid-cols-4 gap-1">
          {[
            { v: t.days, l: "Days" },
            { v: t.hours, l: "Hrs" },
            { v: t.minutes, l: "Min" },
            { v: t.seconds, l: "Sec" },
          ].map(({ v, l }) => (
            <div key={l} className="text-center bg-muted rounded-lg py-1.5">
              <p className="font-bold text-base text-teal">
                {String(v).padStart(2, "0")}
              </p>
              <p className="text-[9px] text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function SmartNotifications() {
  const [selectedExamSem, setSelectedExamSem] = useState<ExamSemesterKey>(6);
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDays, setNewGoalDays] = useState("");

  const prevExamSem = useRef<ExamSemesterKey>(selectedExamSem);
  useEffect(() => {
    if (prevExamSem.current === selectedExamSem) return;
    prevExamSem.current = selectedExamSem;
    const ev = getScheduledExamEvents(selectedExamSem);
    if (ev.length === 0) return;
    const d = ev[0].date;
    setCalYear(d.getFullYear());
    setCalMonth(d.getMonth());
  }, [selectedExamSem]);

  const shiftCalendarMonth = (delta: number) => {
    const d = new Date(calYear, calMonth + delta, 1);
    setCalYear(d.getFullYear());
    setCalMonth(d.getMonth());
  };

  const goToLiveToday = () => {
    const n = new Date();
    setCalYear(n.getFullYear());
    setCalMonth(n.getMonth());
  };

  const liveToday = new Date();
  const todayDate = liveToday.getDate();
  const todayMonth = liveToday.getMonth();
  const todayYear = liveToday.getFullYear();

  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDayOfMonth(calYear, calMonth);
  const monthName = new Date(calYear, calMonth, 1).toLocaleString("default", {
    month: "long",
  });

  const examsByDay = useMemo(() => {
    const map = new Map<number, ScheduledExamEvent[]>();
    for (const e of getScheduledExamEvents(selectedExamSem)) {
      if (e.date.getFullYear() === calYear && e.date.getMonth() === calMonth) {
        const dom = e.date.getDate();
        const list = map.get(dom) ?? [];
        list.push(e);
        map.set(dom, list);
      }
    }
    return map;
  }, [calYear, calMonth, selectedExamSem]);

  const examsInViewMonth = useMemo(() => {
    return getScheduledExamEvents(selectedExamSem)
      .filter(
        (e) =>
          e.date.getFullYear() === calYear && e.date.getMonth() === calMonth,
      )
      .sort((a, b) => a.date.getDate() - b.date.getDate());
  }, [calYear, calMonth, selectedExamSem]);

  const goalsByDay = useMemo(() => {
    const map = new Map<number, Goal[]>();
    for (const g of goals) {
      const d = g.targetDate;
      if (d.getFullYear() === calYear && d.getMonth() === calMonth) {
        const dom = d.getDate();
        const list = map.get(dom) ?? [];
        list.push(g);
        map.set(dom, list);
      }
    }
    return map;
  }, [calYear, calMonth, goals]);

  const countdownItems = useMemo((): CountdownItem[] => {
    const sod = startOfDay(new Date());
    const fromGoals: CountdownItem[] = goals
      .filter((g) => startOfDay(g.targetDate).getTime() >= sod.getTime())
      .map((g) => ({
        key: `goal-${g.id}`,
        title: g.title,
        date: g.targetDate,
        badge: "Goal",
      }));

    const fromExams: CountdownItem[] = getScheduledExamEvents(
      selectedExamSem,
    )
      .filter((e) => startOfDay(e.date).getTime() >= sod.getTime())
      .map((e) => ({
        key: `exam-${selectedExamSem}-${e.categoryId}`,
        title: `Sem ${selectedExamSem} · ${e.label}`,
        date: e.date,
        badge: "Exam",
      }));

    return [...fromGoals, ...fromExams].sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );
  }, [goals, selectedExamSem]);

  const addGoal = () => {
    if (!newGoalTitle.trim() || !newGoalDays) return;
    const n = Number.parseInt(newGoalDays, 10);
    if (Number.isNaN(n) || n < 1) return;
    const targetDate = addDaysFromReference(new Date(), n);
    setGoals((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: newGoalTitle.trim(),
        days: n,
        progress: 0,
        created: new Date(),
        targetDate,
      },
    ]);
    setNewGoalTitle("");
    setNewGoalDays("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden">
        <div
          style={{
            background:
              "linear-gradient(135deg, oklch(0.35 0.22 290), oklch(0.45 0.2 280))",
          }}
          className="absolute inset-0"
        />
        <img
          src="/assets/generated/hero-bg.dim_1920x400.png"
          alt=""
          className="w-full h-40 object-cover opacity-20"
        />
        <div className="absolute inset-0 flex items-center px-8">
          <div>
            <h1 className="font-display text-2xl font-bold text-white mb-1">
              Smart Notifications & Goals
            </h1>
            <p className="text-white/80 text-sm">
              Set goals, track countdowns, and align your calendar with semester
              exams
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="rounded-2xl shadow-card lg:col-span-1">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal shrink-0" />
                <span className="leading-tight">
                  {monthName} {calYear}
                </span>
              </CardTitle>
              <div className="flex items-center gap-1 shrink-0 flex-wrap justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="h-8 text-[10px] px-2 rounded-lg"
                  onClick={goToLiveToday}
                >
                  Today
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  onClick={() => shiftCalendarMonth(-1)}
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-lg"
                  onClick={() => shiftCalendarMonth(1)}
                  aria-label="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground font-normal pt-2">
              Days show <strong className="text-foreground">ISE 1, ISE 2, ISE
              3, ESE, Practical Exam</strong> on the scheduled date — same as{" "}
              <strong className="text-foreground">Upcoming Exams</strong> (Sem{" "}
              {selectedExamSem}). Use arrows to move through months. Violet =
              goal due · Teal = today (your device&apos;s live date).
            </p>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                <div
                  key={d}
                  className="text-center text-[10px] font-semibold text-muted-foreground py-1"
                >
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: firstDay }).map((_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static calendar padding
                <div key={`e-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(
                (day) => {
                  const isToday =
                    day === todayDate &&
                    calMonth === todayMonth &&
                    calYear === todayYear;
                  const examsHere = examsByDay.get(day) ?? [];
                  const goalsHere = goalsByDay.get(day) ?? [];
                  const hasExam = examsHere.length > 0;
                  const hasGoalDue = goalsHere.length > 0;
                  const examTitleAttr = examsHere
                    .map((e) => examDetailLine(e, selectedExamSem))
                    .join(" · ");
                  const goalTitleAttr = goalsHere.map((g) => g.title).join(" · ");
                  return (
                    <div
                      key={day}
                      title={[examTitleAttr, goalTitleAttr]
                        .filter(Boolean)
                        .join(" | ")}
                      className={`
                      relative rounded-lg cursor-default transition-colors min-h-[4.5rem] px-0.5 pt-1 pb-1 flex flex-col items-stretch gap-0.5
                      ${isToday ? "bg-teal text-white ring-2 ring-teal/60" : "hover:bg-muted/80"}
                      ${hasExam && !isToday ? "bg-red-50/90 dark:bg-red-950/20" : ""}
                    `}
                    >
                      <span
                        className={`text-center text-xs font-bold shrink-0 ${isToday ? "text-white" : ""}`}
                      >
                        {day}
                      </span>
                      {hasExam && (
                        <div className="flex flex-col gap-0.5 flex-1 min-h-0 justify-center">
                          {examsHere.map((e) => (
                            <span
                              key={e.categoryId}
                              title={examDetailLine(e, selectedExamSem)}
                              className={`text-[9px] leading-tight font-bold text-center line-clamp-2 break-words ${
                                isToday
                                  ? "text-white"
                                  : "text-red-800 dark:text-red-200"
                              }`}
                            >
                              {upcomingExamShortLabel(e.categoryId)}
                            </span>
                          ))}
                        </div>
                      )}
                      {hasGoalDue && (
                        <div className="flex flex-col gap-0.5">
                          {goalsHere.map((g) => (
                            <span
                              key={g.id}
                              className={`text-[8px] leading-[1.15] font-medium text-center line-clamp-2 ${
                                isToday
                                  ? "text-violet-100"
                                  : "text-violet-700 dark:text-violet-300"
                              }`}
                            >
                              {g.title}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                },
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />{" "}
                ISE / ESE / Practical (Sem {selectedExamSem})
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-violet-500 inline-block" />{" "}
                Goal due
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-teal inline-block" />{" "}
                Today
              </span>
            </div>

            <div className="mt-4 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
              <p className="text-[10px] font-bold text-foreground mb-1.5">
                This month · Sem {selectedExamSem} (Upcoming Exams schedule)
              </p>
              {examsInViewMonth.length === 0 ? (
                <p className="text-[10px] text-muted-foreground leading-snug">
                  No ISE / ESE / Practical Exam on this month&apos;s grid. Move
                  ← → to the month shown in Upcoming Exams (e.g. Sem 6: Jan–May
                  2026; Sem 5: Aug–Dec 2025).
                </p>
              ) : (
                <ul className="space-y-1">
                  {examsInViewMonth.map((e) => {
                    const when = examDates[selectedExamSem]?.[e.categoryId];
                    return (
                      <li
                        key={e.categoryId}
                        className="text-[10px] text-foreground leading-snug flex flex-wrap gap-x-1"
                      >
                        <span className="font-semibold tabular-nums">
                          {e.date.getDate()}{" "}
                          {e.date.toLocaleString("default", {
                            month: "short",
                          })}
                        </span>
                        <span className="font-bold text-red-700 dark:text-red-300">
                          {upcomingExamShortLabel(e.categoryId)}
                        </span>
                        {when ? (
                          <span className="text-muted-foreground">
                            · Upcoming Exams: {when}
                          </span>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl shadow-card">
            <CardContent className="p-5">
              <h2 className="font-display font-semibold text-base mb-3 flex items-center gap-2">
                <Target className="w-4 h-4 text-teal" /> Create New Goal
              </h2>
              <p className="text-xs text-muted-foreground mb-3">
                Set a title and number of days until the deadline. Your goal
                appears in Countdown Timers and on the calendar on its due date.
              </p>
              <div className="flex flex-wrap gap-3">
                <Input
                  placeholder="e.g., Finish OS unit in 7 days"
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  className="flex-1 min-w-[200px] rounded-xl"
                  onKeyDown={(e) => e.key === "Enter" && addGoal()}
                  data-ocid="goals.create.title"
                />
                <Input
                  type="number"
                  placeholder="Days"
                  value={newGoalDays}
                  onChange={(e) => setNewGoalDays(e.target.value)}
                  className="w-24 rounded-xl"
                  min={1}
                  data-ocid="goals.create.days"
                />
                <Button
                  onClick={addGoal}
                  className="bg-teal hover:bg-teal/90 text-white rounded-xl flex items-center gap-1.5"
                  data-ocid="goals.create.submit"
                >
                  <Plus className="w-4 h-4" /> Add goal
                </Button>
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="font-display font-semibold text-base mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal" /> Countdown Timers
            </h2>
            <p className="text-xs text-muted-foreground mb-3">
              Active goals and scheduled exams for Semester {selectedExamSem},
              soonest first.
            </p>
            {countdownItems.length === 0 ? (
              <Card className="rounded-2xl shadow-card border-dashed">
                <CardContent className="p-8 text-center text-sm text-muted-foreground">
                  No upcoming deadlines. Add a goal above or switch semester in
                  Upcoming Exams to see exam dates.
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {countdownItems.map((item) => (
                  <CountdownTimer key={item.key} item={item} />
                ))}
              </div>
            )}
          </div>

          <Card className="rounded-2xl shadow-card border border-violet-100">
            <CardContent className="p-5">
              <UpcomingExamsTracker
                selectedSem={selectedExamSem}
                onSemChange={setSelectedExamSem}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Streak + Badges */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-2xl shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Flame className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-base">Streak Tracker</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/30 rounded-xl">
                  <p className="text-3xl font-bold text-orange-500">47</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Current Streak
                  </p>
                </div>
                <div className="text-center p-3 bg-muted rounded-xl">
                  <p className="text-3xl font-bold text-foreground">89</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Best Streak
                  </p>
                </div>
              </div>
              <div className="flex gap-1 mt-3">
                {Array.from({ length: 14 }, (_, i) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: static list
                    key={i}
                    className={`flex-1 h-5 rounded-sm ${i < 11 ? "bg-orange-400" : "bg-muted"}`}
                  />
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 text-center">
                Last 14 days
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-card">
            <CardContent className="p-5">
              <h3 className="font-semibold text-base mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-500" /> Achievements
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {badges.map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <div
                      key={badge.label}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl ${badge.earned ? badge.color : "bg-muted opacity-40"}`}
                    >
                      <Icon
                        className={`w-5 h-5 ${badge.earned ? "" : "text-muted-foreground"}`}
                      />
                      <p className="text-[9px] font-medium text-center leading-tight">
                        {badge.label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
      </div>
    </div>
  );
}
