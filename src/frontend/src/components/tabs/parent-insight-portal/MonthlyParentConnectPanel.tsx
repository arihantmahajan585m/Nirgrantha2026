import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Send,
  Star,
  Video,
} from "lucide-react";
import { useMemo, useState } from "react";

interface MeetingSlot {
  id: string;
  label: string;
  fullLabel: string;
  available: boolean;
  startAt: string;
}

const PARENT_CONNECT_SLOT_HOURS = [10, 14, 11, 16, 15];

const agendaTopics = [
  "Semester 5 academic performance review",
  "Attendance and assignment completion status",
  "Career guidance and exam preparation progress",
  "Extracurricular activities and achievements",
  "Areas requiring parental support at home",
  "Upcoming semester schedule and expectations",
];

function formatShortSlot(date: Date) {
  const parts = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);

  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  const hour = parts.find((part) => part.type === "hour")?.value ?? "";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "00";
  const dayPeriod =
    parts.find((part) => part.type === "dayPeriod")?.value ?? "";

  return `${weekday}, ${month} ${day} - ${hour}:${minute} ${dayPeriod}`;
}

function formatLongSlot(date: Date) {
  const parts = new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);

  const weekday = parts.find((part) => part.type === "weekday")?.value ?? "";
  const day = parts.find((part) => part.type === "day")?.value ?? "";
  const month = parts.find((part) => part.type === "month")?.value ?? "";
  const year = parts.find((part) => part.type === "year")?.value ?? "";
  const hour = parts.find((part) => part.type === "hour")?.value ?? "";
  const minute = parts.find((part) => part.type === "minute")?.value ?? "00";
  const dayPeriod =
    parts.find((part) => part.type === "dayPeriod")?.value ?? "";

  return `${weekday}, ${day} ${month} ${year} at ${hour}:${minute} ${dayPeriod}`;
}

function formatWindowDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function generateUpcomingMeetingSlots(baseDate = new Date()): MeetingSlot[] {
  const cursor = new Date(baseDate);
  cursor.setHours(0, 0, 0, 0);

  const slots: MeetingSlot[] = [];
  let slotIndex = 0;

  while (
    slots.length < PARENT_CONNECT_SLOT_HOURS.length &&
    slotIndex < PARENT_CONNECT_SLOT_HOURS.length
  ) {
    cursor.setDate(cursor.getDate() + 1);
    const day = cursor.getDay();

    if (day === 0 || day === 6) {
      continue;
    }

    const slotDate = new Date(cursor);
    slotDate.setHours(PARENT_CONNECT_SLOT_HOURS[slotIndex] ?? 10, 0, 0, 0);

    slots.push({
      id: `slot${slots.length + 1}`,
      label: formatShortSlot(slotDate),
      fullLabel: formatLongSlot(slotDate),
      available: slots.length !== 2,
      startAt: slotDate.toISOString(),
    });

    slotIndex += 1;
  }

  return slots;
}

export default function MonthlyParentConnectPanel() {
  const timeSlots = useMemo(() => generateUpcomingMeetingSlots(), []);
  const defaultSlotId =
    timeSlots.find((slot) => slot.available)?.id ?? timeSlots[0]?.id ?? "";
  const schedulingWindowStart = timeSlots[0]?.startAt
    ? formatWindowDate(new Date(timeSlots[0].startAt))
    : "";
  const schedulingWindowEnd = timeSlots.at(-1)?.startAt
    ? formatWindowDate(new Date(timeSlots.at(-1)?.startAt ?? ""))
    : "";

  const [isExpanded, setIsExpanded] = useState(true);
  const [meetingWith, setMeetingWith] = useState<"class-teacher" | "hod">(
    "class-teacher",
  );
  const [selectedSlot, setSelectedSlot] = useState(defaultSlotId);
  const [meetingScheduled, setMeetingScheduled] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [suggestion, setSuggestion] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);

  const selectedMeetingSlot =
    timeSlots.find((slot) => slot.id === selectedSlot) ?? null;
  const nextAvailableSlot = timeSlots.find((slot) => slot.available) ?? null;
  const meetingPartnerLabel =
    meetingWith === "class-teacher"
      ? "Class Teacher (Dr. Priya Nair)"
      : "HOD (Prof. Ramesh Kumar)";

  const handleSchedule = () => {
    if (selectedMeetingSlot?.available) {
      setMeetingScheduled(true);
    }
  };

  const handleFeedbackSubmit = () => {
    if (feedback.trim() || suggestion.trim()) {
      setFeedbackSubmitted(true);
    }
  };

  const handleRatingSubmit = () => {
    if (rating > 0) {
      setRatingSubmitted(true);
    }
  };

  return (
    <div
      className="no-print mt-8"
      style={{ borderTop: "2px solid var(--parent-primary)" }}
    >
      <div
        className="sticky bottom-0 z-10"
        style={{
          background: "var(--parent-connect-bg)",
          borderTop: "1px solid var(--parent-border)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between py-4 cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "var(--parent-primary)" }}
              >
                <Video className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <div
                  className="text-sm font-bold"
                  style={{ color: "var(--parent-heading)" }}
                >
                  Monthly Parent Connect System
                </div>
                <div
                  className="text-xs"
                  style={{ color: "var(--parent-muted)" }}
                >
                  Schedule meetings - submit feedback - rate your experience
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!meetingScheduled && nextAvailableSlot && (
                <span
                  className="text-xs px-2.5 py-1 rounded-full font-semibold animate-pulse"
                  style={{
                    background: "oklch(0.65 0.18 60 / 0.15)",
                    color: "oklch(0.55 0.18 60)",
                  }}
                >
                  Next slot: {nextAvailableSlot.label}
                </span>
              )}
              {isExpanded ? (
                <ChevronDown
                  className="w-5 h-5"
                  style={{ color: "var(--parent-muted)" }}
                />
              ) : (
                <ChevronUp
                  className="w-5 h-5"
                  style={{ color: "var(--parent-muted)" }}
                />
              )}
            </div>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div
          style={{
            background: "var(--parent-connect-bg)",
            borderTop: "1px solid var(--parent-border)",
          }}
        >
          <div className="max-w-[1400px] mx-auto px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div
                className="rounded-2xl p-5"
                style={{
                  background: "var(--parent-card)",
                  border: "1px solid var(--parent-border)",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Calendar
                    className="w-4 h-4"
                    style={{ color: "var(--parent-primary)" }}
                  />
                  <h3
                    className="text-sm font-bold"
                    style={{ color: "var(--parent-heading)" }}
                  >
                    Schedule Virtual Meeting
                  </h3>
                </div>

                {meetingScheduled ? (
                  <div className="text-center py-4">
                    <div className="text-3xl mb-2">OK</div>
                    <div
                      className="text-sm font-bold mb-1"
                      style={{ color: "oklch(0.42 0.15 145)" }}
                    >
                      Meeting Scheduled!
                    </div>
                    <div
                      className="text-xs leading-6"
                      style={{ color: "var(--parent-muted)" }}
                    >
                      {meetingPartnerLabel} meeting booked for{" "}
                      {selectedMeetingSlot?.fullLabel ?? "the selected slot"}.
                    </div>
                    <div
                      className="text-xs mt-2"
                      style={{ color: "var(--parent-muted)" }}
                    >
                      You will receive a confirmation email with the video link
                      and local meeting time.
                    </div>
                    <button
                      type="button"
                      onClick={() => setMeetingScheduled(false)}
                      className="mt-3 text-xs underline cursor-pointer"
                      style={{ color: "var(--parent-primary)" }}
                    >
                      Reschedule
                    </button>
                  </div>
                ) : (
                  <>
                    <div
                      className="mb-4 rounded-xl px-3 py-3"
                      style={{
                        background: "var(--parent-accent-subtle)",
                        border: "1px solid var(--parent-border)",
                      }}
                    >
                      <div
                        className="text-[11px] font-semibold uppercase tracking-[0.16em]"
                        style={{ color: "var(--parent-primary)" }}
                      >
                        Live Scheduling Window
                      </div>
                      <div
                        className="text-xs mt-1"
                        style={{ color: "var(--parent-heading)" }}
                      >
                        {schedulingWindowStart && schedulingWindowEnd
                          ? `${schedulingWindowStart} to ${schedulingWindowEnd}`
                          : "Upcoming dates are being prepared."}
                      </div>
                      {nextAvailableSlot && (
                        <div
                          className="text-xs mt-1"
                          style={{ color: "var(--parent-muted)" }}
                        >
                          Next available slot: {nextAvailableSlot.fullLabel}
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <div
                        className="text-xs font-semibold mb-2"
                        style={{ color: "var(--parent-heading)" }}
                      >
                        Meet with:
                      </div>
                      <RadioGroup
                        value={meetingWith}
                        onValueChange={(value) =>
                          setMeetingWith(value as "class-teacher" | "hod")
                        }
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <RadioGroupItem value="class-teacher" id="ct" />
                          <Label
                            htmlFor="ct"
                            className="text-xs cursor-pointer"
                            style={{ color: "var(--parent-heading)" }}
                          >
                            Class Teacher (Dr. Priya Nair)
                          </Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="hod" id="hod" />
                          <Label
                            htmlFor="hod"
                            className="text-xs cursor-pointer"
                            style={{ color: "var(--parent-heading)" }}
                          >
                            HOD (Prof. Ramesh Kumar) - Optional
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="mb-4">
                      <div
                        className="text-xs font-semibold mb-2"
                        style={{ color: "var(--parent-heading)" }}
                      >
                        Available Time Slots:
                      </div>
                      <RadioGroup
                        value={selectedSlot}
                        onValueChange={setSelectedSlot}
                      >
                        <div className="space-y-2">
                          {timeSlots.map((slot) => (
                            <div
                              key={slot.id}
                              className={`flex items-center gap-2 p-2 rounded-lg ${!slot.available ? "opacity-40" : ""}`}
                              style={{
                                background:
                                  selectedSlot === slot.id
                                    ? "var(--parent-badge-bg)"
                                    : "transparent",
                              }}
                            >
                              <RadioGroupItem
                                value={slot.id}
                                id={slot.id}
                                disabled={!slot.available}
                              />
                              <Label
                                htmlFor={slot.id}
                                className={`text-xs ${slot.available ? "cursor-pointer" : "cursor-not-allowed"}`}
                                style={{ color: "var(--parent-heading)" }}
                              >
                                {slot.label}
                                {!slot.available && (
                                  <span
                                    className="ml-1 text-xs"
                                    style={{ color: "var(--parent-muted)" }}
                                  >
                                    (Booked)
                                  </span>
                                )}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </RadioGroup>
                    </div>

                    <Button
                      onClick={handleSchedule}
                      className="w-full text-sm"
                      disabled={!selectedMeetingSlot?.available}
                      style={{
                        background: "var(--parent-primary)",
                        color: "white",
                      }}
                    >
                      <Video className="w-4 h-4 mr-2" />
                      Confirm Meeting
                    </Button>
                  </>
                )}

                <div
                  className="mt-4 pt-4"
                  style={{ borderTop: "1px solid var(--parent-border)" }}
                >
                  <div
                    className="text-xs font-semibold mb-2"
                    style={{ color: "var(--parent-heading)" }}
                  >
                    Discussion Agenda:
                  </div>
                  <ul className="space-y-1.5">
                    {agendaTopics.map((topic, index) => (
                      <li
                        key={topic}
                        className="flex items-start gap-2 text-xs"
                        style={{ color: "var(--parent-muted)" }}
                      >
                        <span
                          className="flex-shrink-0 font-bold"
                          style={{ color: "var(--parent-primary)" }}
                        >
                          {index + 1}.
                        </span>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div
                className="rounded-2xl p-5"
                style={{
                  background: "var(--parent-card)",
                  border: "1px solid var(--parent-border)",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <MessageSquare
                    className="w-4 h-4"
                    style={{ color: "var(--parent-primary)" }}
                  />
                  <h3
                    className="text-sm font-bold"
                    style={{ color: "var(--parent-heading)" }}
                  >
                    Parent Feedback
                  </h3>
                </div>

                {feedbackSubmitted ? (
                  <div className="text-center py-8">
                    <div className="text-3xl mb-2">OK</div>
                    <div
                      className="text-sm font-bold mb-1"
                      style={{ color: "oklch(0.42 0.15 145)" }}
                    >
                      Thank you for your feedback!
                    </div>
                    <div
                      className="text-xs"
                      style={{ color: "var(--parent-muted)" }}
                    >
                      Your feedback has been shared with the faculty and
                      administration.
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFeedbackSubmitted(false);
                        setFeedback("");
                        setSuggestion("");
                      }}
                      className="mt-3 text-xs underline cursor-pointer"
                      style={{ color: "var(--parent-primary)" }}
                    >
                      Submit another
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mb-4">
                      <Label
                        className="text-xs font-semibold mb-2 block"
                        style={{ color: "var(--parent-heading)" }}
                      >
                        Your Feedback
                      </Label>
                      <Textarea
                        value={feedback}
                        onChange={(event) => setFeedback(event.target.value)}
                        placeholder="Share your observations about your child's progress, teaching quality, or any concerns..."
                        className="text-xs resize-none h-28"
                        style={{ borderColor: "var(--parent-border)" }}
                      />
                    </div>
                    <div className="mb-4">
                      <Label
                        className="text-xs font-semibold mb-2 block"
                        style={{ color: "var(--parent-heading)" }}
                      >
                        Improvement Suggestions
                      </Label>
                      <Textarea
                        value={suggestion}
                        onChange={(event) => setSuggestion(event.target.value)}
                        placeholder="Suggest improvements for teaching methods, facilities, communication, or any other area..."
                        className="text-xs resize-none h-24"
                        style={{ borderColor: "var(--parent-border)" }}
                      />
                    </div>
                    <Button
                      onClick={handleFeedbackSubmit}
                      className="w-full text-sm"
                      disabled={!feedback.trim() && !suggestion.trim()}
                      style={{
                        background: "var(--parent-primary)",
                        color: "white",
                      }}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Submit Feedback
                    </Button>
                  </>
                )}
              </div>

              <div
                className="rounded-2xl p-5"
                style={{
                  background: "var(--parent-card)",
                  border: "1px solid var(--parent-border)",
                }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Star
                    className="w-4 h-4"
                    style={{ color: "var(--parent-primary)" }}
                  />
                  <h3
                    className="text-sm font-bold"
                    style={{ color: "var(--parent-heading)" }}
                  >
                    Parent Satisfaction Rating
                  </h3>
                </div>

                {ratingSubmitted ? (
                  <div className="text-center py-8">
                    <div className="text-3xl mb-2">*</div>
                    <div
                      className="text-sm font-bold mb-1"
                      style={{ color: "oklch(0.42 0.15 145)" }}
                    >
                      Rating Submitted!
                    </div>
                    <div
                      className="text-xs mb-3"
                      style={{ color: "var(--parent-muted)" }}
                    >
                      You rated your experience {rating}/5 stars. Thank you!
                    </div>
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <Star
                          key={score}
                          className="w-6 h-6"
                          fill={
                            score <= rating ? "var(--parent-primary)" : "none"
                          }
                          style={{ color: "var(--parent-primary)" }}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setRatingSubmitted(false);
                        setRating(0);
                      }}
                      className="mt-3 text-xs underline cursor-pointer"
                      style={{ color: "var(--parent-primary)" }}
                    >
                      Change rating
                    </button>
                  </div>
                ) : (
                  <>
                    <p
                      className="text-xs mb-6"
                      style={{ color: "var(--parent-muted)" }}
                    >
                      How satisfied are you with the institute's transparency,
                      communication, and your child's overall development this
                      month?
                    </p>

                    <div className="flex justify-center gap-2 mb-4">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <button
                          type="button"
                          key={score}
                          onClick={() => setRating(score)}
                          onMouseEnter={() => setHoverRating(score)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="transition-transform duration-150 hover:scale-125 cursor-pointer"
                        >
                          <Star
                            className="w-8 h-8"
                            fill={
                              score <= (hoverRating || rating)
                                ? "var(--parent-primary)"
                                : "none"
                            }
                            style={{ color: "var(--parent-primary)" }}
                          />
                        </button>
                      ))}
                    </div>

                    {rating > 0 && (
                      <p
                        className="text-center text-xs mb-4 font-semibold"
                        style={{ color: "var(--parent-primary)" }}
                      >
                        {rating === 1 && "Needs significant improvement"}
                        {rating === 2 && "Below expectations"}
                        {rating === 3 && "Satisfactory"}
                        {rating === 4 && "Good - happy with progress"}
                        {rating === 5 && "Excellent - very satisfied!"}
                      </p>
                    )}

                    <Button
                      onClick={handleRatingSubmit}
                      className="w-full text-sm"
                      disabled={rating === 0}
                      style={{
                        background:
                          rating > 0 ? "var(--parent-primary)" : undefined,
                        color: rating > 0 ? "white" : undefined,
                      }}
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Submit Rating
                    </Button>

                    <div
                      className="mt-6 pt-4"
                      style={{ borderTop: "1px solid var(--parent-border)" }}
                    >
                      <div
                        className="text-xs font-semibold mb-3"
                        style={{ color: "var(--parent-heading)" }}
                      >
                        Overall Parent Satisfaction
                      </div>
                      <div className="space-y-2">
                        {[
                          { label: "Teaching Quality", score: 91 },
                          { label: "Communication", score: 85 },
                          { label: "Transparency", score: 88 },
                          { label: "Child Development", score: 93 },
                        ].map((item) => (
                          <div key={item.label}>
                            <div className="flex justify-between mb-1">
                              <span
                                className="text-xs"
                                style={{ color: "var(--parent-muted)" }}
                              >
                                {item.label}
                              </span>
                              <span
                                className="text-xs font-bold"
                                style={{ color: "var(--parent-primary)" }}
                              >
                                {item.score}%
                              </span>
                            </div>
                            <Progress value={item.score} className="h-1.5" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
