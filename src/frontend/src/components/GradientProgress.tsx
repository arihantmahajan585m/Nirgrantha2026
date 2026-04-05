interface GradientProgressProps {
  value: number;
  className?: string;
  height?: string;
}

/**
 * GradientProgress — replaces shadcn Progress with semantic gradient fills.
 * < 50 → red gradient (low)
 * 50-75 → amber gradient (medium)
 * > 75 → green gradient (high)
 */
export default function GradientProgress({
  value,
  className = "",
  height = "h-2",
}: GradientProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const fillClass =
    clamped < 50
      ? "progress-low"
      : clamped <= 75
        ? "progress-medium"
        : "progress-high";

  return (
    <div
      className={`${height} rounded-full overflow-hidden bg-gray-200 ${className}`}
      role="progressbar"
      tabIndex={-1}
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full ${fillClass} transition-all duration-500`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
