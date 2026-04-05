import { BarChart2, BookOpen, Brain, Compass, Users, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import ParticleCanvas from "./ParticleCanvas";

interface WelcomePageProps {
  onEnter: () => void;
  onMLLab?: () => void;
}

const TITLE_FULL = "Connecting Students, Teachers, Parents & Institutes";

export default function WelcomePage({ onEnter, onMLLab }: WelcomePageProps) {
  const [typedText, setTypedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [btnVisible, setBtnVisible] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setLogoVisible(true), 200);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (!logoVisible) return;
    let i = 0;
    const t = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < TITLE_FULL.length) {
          setTypedText(TITLE_FULL.slice(0, i + 1));
          i++;
        } else {
          setTypingDone(true);
          clearInterval(interval);
        }
      }, 38);
      return () => clearInterval(interval);
    }, 600);
    return () => clearTimeout(t);
  }, [logoVisible]);

  useEffect(() => {
    if (!typingDone) return;
    const t1 = setTimeout(() => setFeaturesVisible(true), 100);
    const t2 = setTimeout(() => setBtnVisible(true), 300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [typingDone]);

  useEffect(() => {
    const btn = btnRef.current;
    if (!btn) return;
    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.25;
      const dy = (e.clientY - cy) * 0.25;
      btn.style.transform = `translate(${dx}px, ${dy}px) scale(1.05)`;
    };
    const onLeave = () => {
      btn.style.transform = "translate(0,0) scale(1)";
    };
    btn.addEventListener("mousemove", onMove);
    btn.addEventListener("mouseleave", onLeave);
    return () => {
      btn.removeEventListener("mousemove", onMove);
      btn.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const handleEnterClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.style.cssText = `
      position:absolute;width:${size}px;height:${size}px;
      left:${e.clientX - rect.left - size / 2}px;
      top:${e.clientY - rect.top - size / 2}px;
      background:rgba(255,255,255,0.35);border-radius:50%;
      transform:scale(0);animation:ripple-expand 0.65s ease-out forwards;
      pointer-events:none;z-index:99;
    `;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
    setTimeout(onEnter, 150);
  };

  return (
    <div
      className="min-h-screen flex flex-col px-4 py-12 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 30% 20%, #1a2756 0%, #0d1535 50%, #080e28 100%)",
      }}
    >
      <ParticleCanvas />

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(0,200,150,0.04) 0%, rgba(99,102,241,0.04) 50%, rgba(14,165,233,0.04) 100%)",
          animation: "gradient-morph 12s ease-in-out infinite alternate",
        }}
      />

      <div
        className="orb animate-float-slow"
        style={{
          width: 440,
          height: 440,
          top: "-12%",
          right: "-8%",
          background:
            "radial-gradient(circle, #00c896 0%, #00a8cc 60%, transparent 100%)",
          opacity: 0.13,
        }}
      />
      <div
        className="orb animate-float-mid"
        style={{
          width: 320,
          height: 320,
          bottom: "5%",
          left: "-5%",
          background:
            "radial-gradient(circle, #6366f1 0%, #8b5cf6 60%, transparent 100%)",
          opacity: 0.15,
          animationDelay: "2s",
        }}
      />
      <div
        className="orb animate-float-fast"
        style={{
          width: 200,
          height: 200,
          top: "42%",
          left: "8%",
          background:
            "radial-gradient(circle, #0ea5e9 0%, #06b6d4 60%, transparent 100%)",
          opacity: 0.1,
          animationDelay: "1.5s",
        }}
      />

      <div
        className="absolute top-[15%] left-[8%] pointer-events-none"
        style={{
          animation: "float-slow 8s ease-in-out infinite",
          animationDelay: "1s",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "2px solid rgba(0,200,150,0.3)",
            animation: "spin-3d 15s linear infinite",
          }}
        />
      </div>
      <div
        className="absolute top-[25%] right-[12%] pointer-events-none"
        style={{
          animation: "float-mid 10s ease-in-out infinite",
          animationDelay: "2.5s",
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            border: "2px solid rgba(99,102,241,0.4)",
            borderRadius: "50%",
            animation: "spin-3d 20s linear infinite reverse",
          }}
        />
      </div>
      <div
        className="absolute bottom-[30%] left-[15%] pointer-events-none"
        style={{ animation: "float-fast 6s ease-in-out infinite" }}
      >
        <div
          style={{
            width: 16,
            height: 16,
            background: "rgba(14,165,233,0.25)",
            transform: "rotate(45deg)",
            animation: "spin-3d 12s linear infinite",
          }}
        />
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {(
          [
            { t: 8, l: 15, d: 0.2, s: 2 },
            { t: 14, l: 72, d: 0.8, s: 1.5 },
            { t: 22, l: 38, d: 1.4, s: 2.5 },
            { t: 5, l: 55, d: 2.1, s: 1 },
            { t: 35, l: 82, d: 0.5, s: 2 },
            { t: 48, l: 12, d: 1.9, s: 1.5 },
            { t: 62, l: 67, d: 0.9, s: 2 },
            { t: 75, l: 28, d: 2.5, s: 1 },
            { t: 88, l: 50, d: 1.1, s: 1.5 },
            { t: 18, l: 90, d: 3.2, s: 2 },
            { t: 55, l: 44, d: 0.7, s: 1.5 },
            { t: 70, l: 88, d: 1.8, s: 2 },
            { t: 30, l: 5, d: 2.8, s: 1 },
            { t: 42, l: 95, d: 0.3, s: 2.5 },
            { t: 80, l: 8, d: 1.6, s: 1.5 },
          ] as Array<{ t: number; l: number; d: number; s: number }>
        ).map((star) => (
          <div
            key={`s-${star.t}-${star.l}`}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              width: `${star.s}px`,
              height: `${star.s}px`,
              top: `${star.t}%`,
              left: `${star.l}%`,
              animationDelay: `${star.d}s`,
              animationDuration: `${2.5 + star.d * 0.4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center max-w-2xl w-full text-center mx-auto">
        <div
          className="flex flex-col items-center gap-3 mb-6"
          style={{
            opacity: logoVisible ? 1 : 0,
            transform: logoVisible
              ? "translateY(0) scale(1)"
              : "translateY(-30px) scale(0.9)",
            transition:
              "opacity 0.7s ease, transform 0.7s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl animate-glow-green"
            style={{
              background: "linear-gradient(135deg, #00c896 0%, #00a8cc 100%)",
              boxShadow:
                "0 0 40px rgba(0,200,150,0.4), 0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            <BookOpen className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-5xl font-bold tracking-tight">
              <span className="text-white">NIR</span>
              <span
                style={{
                  color: "#00e5a0",
                  textShadow: "0 0 20px rgba(0,229,160,0.5)",
                }}
              >
                GRANTHA
              </span>
            </h1>
            <p
              className="text-xs tracking-[0.3em] uppercase mt-1.5"
              style={{ color: "#8899bb" }}
            >
              Educational Platform
            </p>
          </div>
        </div>

        <div
          className="flex items-center gap-3 w-56 mb-8"
          style={{
            opacity: logoVisible ? 1 : 0,
            transition: "opacity 0.5s ease 0.4s",
          }}
        >
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(255,255,255,0.15)" }}
          />
          <div
            className="w-2 h-2 rounded-full animate-glow-green"
            style={{ background: "#00e5a0" }}
          />
          <div
            className="flex-1 h-px"
            style={{ background: "rgba(255,255,255,0.15)" }}
          />
        </div>

        <p
          className="text-sm font-semibold tracking-widest uppercase mb-4"
          style={{
            color: "#4a9eff",
            opacity: logoVisible ? 1 : 0,
            transition: "opacity 0.6s ease 0.5s",
            letterSpacing: "0.25em",
          }}
        >
          The Foundation of Trust
        </p>

        <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-10 min-h-[5rem]">
          <span style={{ color: "#00e5a0" }}>{typedText}</span>
          {!typingDone && (
            <span
              className="inline-block w-0.5 h-8 ml-1 align-middle bg-white"
              style={{ animation: "blink-cursor 1s step-end infinite" }}
            />
          )}
        </h2>

        <div
          className="flex flex-wrap justify-center gap-3 mb-10"
          style={{
            opacity: featuresVisible ? 1 : 0,
            transform: featuresVisible ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          {[
            { icon: Zap, label: "Smart Learning", delay: 0 },
            { icon: Compass, label: "Career Guidance", delay: 80 },
            { icon: BarChart2, label: "Real-time Analytics", delay: 160 },
            { icon: Users, label: "Collaborative Tools", delay: 240 },
          ].map(({ icon: Icon, label, delay }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-white glass-dark cursor-default"
              style={{ transitionDelay: `${delay}ms` }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: "#00e5a0" }} />
              {label}
            </div>
          ))}
        </div>

        <div
          className="flex flex-col sm:flex-row items-center gap-4 mb-6"
          style={{
            opacity: btnVisible ? 1 : 0,
            transform: btnVisible ? "scale(1)" : "scale(0.85)",
            transition:
              "opacity 0.5s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          <button
            ref={btnRef}
            type="button"
            onClick={handleEnterClick}
            data-ocid="welcome.primary_button"
            className="px-16 py-4 rounded-2xl text-lg font-bold text-white shadow-2xl animate-glow-green relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #00c896 0%, #00a8cc 100%)",
            }}
          >
            <span className="relative z-10">Enter Platform</span>
          </button>

          {onMLLab && (
            <button
              type="button"
              onClick={onMLLab}
              data-ocid="welcome.secondary_button"
              className="flex items-center gap-2 px-8 py-4 rounded-2xl text-sm font-bold transition-all"
              style={{
                background: "rgba(99,102,241,0.15)",
                border: "1px solid rgba(99,102,241,0.4)",
                color: "#a5b4fc",
              }}
            >
              <Brain className="w-4 h-4" />
              How AI Works
            </button>
          )}
        </div>
      </div>

      <div className="relative z-10 w-full pt-4 text-xs text-center">
        <p style={{ color: "#556688" }}>
          (c) {new Date().getFullYear()} NIRGRANTHA.
        </p>
        <p style={{ color: "#556688" }}>All rights are reserved.</p>
      </div>
    </div>
  );
}
