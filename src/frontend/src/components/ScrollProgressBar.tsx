import { useEffect, useState } from "react";

export default function ScrollProgressBar({
  color = "#00e5a0",
}: { color?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const height = el.scrollHeight - el.clientHeight;
      setProgress(height > 0 ? (scrollTop / height) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-0.5 pointer-events-none"
      style={{ background: "rgba(0,0,0,0.1)" }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          background: color,
          transition: "width 0.1s ease",
          boxShadow: `0 0 8px ${color}`,
        }}
      />
    </div>
  );
}
