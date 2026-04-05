import { type ReactNode, useEffect, useRef, useState } from "react";

interface ScrollRevealSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right" | "fade";
}

export default function ScrollRevealSection({
  children,
  className = "",
  delay = 0,
  direction = "up",
}: ScrollRevealSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const transforms = {
    up: "translateY(40px)",
    left: "translateX(-40px)",
    right: "translateX(40px)",
    fade: "translateY(0px)",
  };

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translate(0,0)" : transforms[direction],
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
