import { Copy, ExternalLink, MessageCircle, RotateCcw, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  FacultyChatError,
  sendFacultyChat,
  type FacultyChatTurn,
} from "./openaiFacultyChat";
import { sendPollinationsFacultyChat } from "./pollinationsFacultyChat";

type QuickTask = "lesson" | "quiz" | "feedback";
type ChatBackendMode = "keyless" | "openai";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
}

const CHATGPT_GRADIENT =
  "linear-gradient(135deg, #10a37f 0%, #0d8a6a 45%, #1a7f64 100%)";
const ACCENT = "#10a37f";
const CHATGPT_WEB_URL = "https://chat.openai.com/";

const QUICK_TASK_LABELS: Record<QuickTask, string> = {
  lesson: "Generate a lesson plan for: ",
  quiz: "Create a quiz about: ",
  feedback: "Help me interpret student feedback on: ",
};

const WELCOME_MESSAGE_ID = "welcome";

const WELCOME_TEXT = `**Faculty AI — answers inside this page**

**Default: Free AI (no API key)**  
Uses the public **Pollinations** text API (OpenAI-compatible chat). You can ask lesson plans, quizzes, rubrics, and pedagogy questions here with **no OpenAI account**.

**Limits:** Speed and availability depend on Pollinations; if it fails, retry later or switch mode.

**Optional: OpenAI API**  
Use the toggle above the chat for **your own** OpenAI key (\`OPENAI_API_KEY\` in \`src/frontend/.env\`) — often more stable, paid/credits.

**Official ChatGPT website:** use **Open ChatGPT** in the header (opens **chat.openai.com** in a new tab).`;

function id() {
  return `m-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function toApiTurns(history: ChatMessage[]): FacultyChatTurn[] {
  return history
    .filter(
      (m) =>
        (m.role === "user" || m.role === "assistant") &&
        m.id !== WELCOME_MESSAGE_ID,
    )
    .map((m) => ({ role: m.role, content: m.text }));
}

export default function AgenticAIHub() {
  const [chatMode, setChatMode] = useState<ChatBackendMode>("keyless");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: WELCOME_MESSAGE_ID,
      role: "assistant",
      text: WELCOME_TEXT,
      timestamp: "Now",
    },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  async function runChat(userText: string) {
    const trimmed = userText.trim();
    if (!trimmed || isSending) return;

    const userMsg: ChatMessage = {
      id: id(),
      role: "user",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const historyAfterUser = [...messages, userMsg];
    setMessages(historyAfterUser);
    setInput("");
    setError(null);
    setIsSending(true);

    try {
      const turns = toApiTurns(historyAfterUser);
      const reply =
        chatMode === "keyless"
          ? await sendPollinationsFacultyChat(turns)
          : await sendFacultyChat(turns);
      const assistantMsg: ChatMessage = {
        id: id(),
        role: "assistant",
        text: reply,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (e) {
      const msg =
        e instanceof FacultyChatError
          ? e.message
          : e instanceof Error
            ? e.message
            : String(e);
      setError(msg);
    } finally {
      setIsSending(false);
    }
  }

  function handleQuickTask(task: QuickTask) {
    const prefix = QUICK_TASK_LABELS[task];
    setInput((prev) => {
      const rest = prev.trim();
      if (!rest) return prefix;
      return `${prefix}${rest}`;
    });
  }

  function clearChat() {
    setMessages([
      {
        id: WELCOME_MESSAGE_ID,
        role: "assistant",
        text: WELCOME_TEXT,
        timestamp: "Now",
      },
    ]);
    setError(null);
  }

  async function copyPromptAndOpenChatGPT() {
    const t = input.trim();
    if (!t) return;
    try {
      await navigator.clipboard.writeText(t);
    } catch {
      /* ignore */
    }
    window.open(CHATGPT_WEB_URL, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="p-4 space-y-4 max-w-4xl mx-auto">
      <div
        className="rounded-2xl p-6 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0d1117 0%, #161b22 50%, #0d1117 100%)",
          border: "1px solid rgba(16,185,129,0.25)",
        }}
      >
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 40%, #10a37f 0%, transparent 45%)",
          }}
        />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(16,185,129,0.2)" }}
            >
              <MessageCircle className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Faculty AI Chat</h2>
              <p className="text-gray-400 text-sm">
                Free in-portal AI (no key) · optional OpenAI API · link to ChatGPT site
              </p>
            </div>
          </div>
          <a
            href={CHATGPT_WEB_URL}
            target="_blank"
            rel="noopener noreferrer"
            data-ocid="ai.chatgpt.open-free"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-transform hover:scale-[1.02] hover:opacity-95"
            style={{ background: CHATGPT_GRADIENT }}
          >
            <ExternalLink className="w-4 h-4" />
            Open ChatGPT (free)
          </a>
        </div>
      </div>

      <div
        className="rounded-2xl p-5 border bg-white shadow-sm"
        style={{ borderColor: `${ACCENT}44` }}
      >
        <h3 className="font-bold text-gray-900 text-sm mb-2">
          How this works
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          <strong>chat.openai.com</strong> is OpenAI’s own site; other apps can’t
          embed that exact free session. Here, <strong>Free AI</strong> uses{" "}
          <strong>Pollinations</strong>’ public chat endpoint so you get replies{" "}
          <strong>without an API key</strong>. For OpenAI’s billing and models
          directly, switch to <strong>OpenAI API</strong> and add a key in{" "}
          <code className="text-gray-800 bg-gray-100 px-1 rounded">.env</code>.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void copyPromptAndOpenChatGPT()}
            disabled={!input.trim()}
            data-ocid="ai.chatgpt.copy-open"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 border-emerald-600 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-45 disabled:cursor-not-allowed"
          >
            <Copy className="w-4 h-4" />
            Copy prompt &amp; open ChatGPT
          </button>
          <span className="text-xs text-gray-500 self-center">
            Type below first — we copy your text, then open{" "}
            <span className="font-mono text-gray-700">chat.openai.com</span> so
            you can paste (Ctrl+V).
          </span>
        </div>
      </div>

      <div
        className="rounded-2xl overflow-hidden shadow-xl border"
        style={{ borderColor: `${ACCENT}33` }}
      >
        <div
          className="px-5 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          style={{ background: CHATGPT_GRADIENT }}
        >
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-white/90 text-xs font-semibold uppercase tracking-wide">
              Mode
            </span>
            <button
              type="button"
              onClick={() => {
                setChatMode("keyless");
                setError(null);
              }}
              data-ocid="ai.mode.keyless"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                chatMode === "keyless"
                  ? "bg-white text-emerald-800 shadow"
                  : "bg-white/15 text-white hover:bg-white/25"
              }`}
            >
              Free AI (no key)
            </button>
            <button
              type="button"
              onClick={() => {
                setChatMode("openai");
                setError(null);
              }}
              data-ocid="ai.mode.openai"
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                chatMode === "openai"
                  ? "bg-white text-emerald-800 shadow"
                  : "bg-white/15 text-white hover:bg-white/25"
              }`}
            >
              OpenAI API
            </button>
          </div>
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            <div className="text-right sm:text-left min-w-0">
              <p className="font-bold text-white text-lg leading-tight">
                {chatMode === "keyless"
                  ? "Pollinations (free)"
                  : "OpenAI (your key)"}
              </p>
              <p className="text-white/85 text-[11px] leading-snug">
                {chatMode === "keyless"
                  ? "No API key · rate limits may apply"
                  : "Needs OPENAI_API_KEY in .env"}
              </p>
            </div>
            <button
              type="button"
              onClick={clearChat}
              data-ocid="ai.clear.button"
              className="p-2 rounded-lg hover:bg-white/20 transition-colors text-white shrink-0"
              title="Clear chat"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div
          className="h-[min(70vh,520px)] overflow-y-auto p-4 space-y-3"
          style={{ background: "#f7f7f8" }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className="max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm"
                style={{
                  background: msg.role === "assistant" ? "white" : CHATGPT_GRADIENT,
                  color: msg.role === "assistant" ? "#1f2937" : "white",
                  border:
                    msg.role === "assistant" ? "1px solid #e5e7eb" : "none",
                  borderBottomLeftRadius: msg.role === "assistant" ? 4 : 16,
                  borderBottomRightRadius: msg.role === "user" ? 4 : 16,
                }}
              >
                {msg.text}
                <p
                  className={`text-[10px] mt-1.5 text-right ${msg.role === "assistant" ? "text-gray-400" : "text-white/60"}`}
                >
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex justify-start">
              <div
                className="rounded-2xl px-4 py-3 flex items-center gap-1 bg-white border border-gray-200 shadow-sm"
              >
                <div
                  className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-emerald-500 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-4 border-t border-gray-200 bg-white space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className="text-[11px] font-semibold text-gray-500 w-full sm:w-auto sm:mr-2">
              Quick start:
            </span>
            {(["lesson", "quiz", "feedback"] as QuickTask[]).map((task) => (
              <button
                type="button"
                key={task}
                onClick={() => handleQuickTask(task)}
                data-ocid={`ai.${task}.button`}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: CHATGPT_GRADIENT }}
              >
                {task === "lesson" && "Lesson plan"}
                {task === "quiz" && "Quiz"}
                {task === "feedback" && "Feedback"}
              </button>
            ))}
            <span className="text-[11px] text-gray-500 self-center">
              Fills the input — add your topic, then Send.
            </span>
          </div>

          {error && (
            <div
              className="text-sm rounded-xl px-3 py-2 border border-red-200 bg-red-50 text-red-800"
              role="alert"
            >
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void runChat(input);
                }
              }}
              data-ocid="ai.chat.input"
              placeholder="e.g. Lesson plan for OS deadlocks (50 min, TY CSE)…"
              disabled={isSending}
              className="flex-1 px-4 py-3 rounded-xl border-2 text-sm font-medium outline-none transition-all disabled:opacity-60"
              style={{
                borderColor: `${ACCENT}40`,
                background: "#f8fafc",
                color: "#111827",
              }}
            />
            <button
              type="button"
              onClick={() => void runChat(input)}
              data-ocid="ai.chat.submit_button"
              disabled={!input.trim() || isSending}
              className="px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all hover:opacity-95 disabled:opacity-50 text-white"
              style={{ background: CHATGPT_GRADIENT }}
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-500 text-center px-2 max-w-2xl mx-auto leading-relaxed">
        Free mode uses{" "}
        <a
          href="https://github.com/pollinations/pollinations/blob/master/APIDOCS.md"
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-700 underline"
        >
          Pollinations
        </a>{" "}
        (third-party). Not affiliated with OpenAI. Official{" "}
        <a
          href={CHATGPT_WEB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-700 underline"
        >
          ChatGPT
        </a>
        . OpenAI API setup:{" "}
        <code className="text-gray-700 bg-gray-100 px-1 rounded">.env.example</code>.
      </p>
    </div>
  );
}
