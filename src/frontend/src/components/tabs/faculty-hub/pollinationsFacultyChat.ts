/**
 * Keyless faculty chat via Pollinations public text API (no API key for basic use).
 * Docs: https://github.com/pollinations/pollinations/blob/master/APIDOCS.md
 *
 * - localhost / 127.0.0.1: POST /pollinations-openai (Vite dev/preview proxy — avoids CORS).
 * - Other hosts: direct POST https://text.pollinations.ai/openai (requires Pollinations CORS).
 */

import {
  FacultyChatError,
  type FacultyChatTurn,
} from "./openaiFacultyChat";

const POLLINATIONS_URL = "https://text.pollinations.ai/openai";

const SYSTEM_PROMPT = `You are a helpful teaching assistant for college and university faculty (campus portal).
Give accurate, practical answers: lesson plans, quizzes, rubrics, feedback analysis, pedagogy, and subject-matter help.
Be concise unless the user asks for detail. Use clear headings and bullet points when helpful.
If the question is ambiguous, ask one short clarifying question at the end.`;

function pollinationsPostUrl(): string {
  if (typeof window === "undefined") return POLLINATIONS_URL;
  const host = window.location.hostname.toLowerCase();
  if (host === "localhost" || host === "127.0.0.1") {
    return "/pollinations-openai";
  }
  return POLLINATIONS_URL;
}

export async function sendPollinationsFacultyChat(
  messages: FacultyChatTurn[],
): Promise<string> {
  const model =
    (import.meta.env.VITE_POLLINATIONS_MODEL as string | undefined)?.trim() ||
    "openai";

  const payload = {
    model,
    temperature: 0.7,
    max_tokens: 4096,
    stream: false,
    messages: [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
  };

  let res: Response;
  try {
    res = await fetch(pollinationsPostUrl(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    throw new FacultyChatError(
      e instanceof Error
        ? e.message
        : "Network error talking to free AI service. If you opened the built files without a dev server, run `pnpm dev` or use OpenAI mode with a key.",
      "network",
    );
  }

  const raw = await res.text();
  let data: {
    choices?: { message?: { content?: string } }[];
    error?: { message?: string } | string;
  };
  try {
    data = JSON.parse(raw) as typeof data;
  } catch {
    throw new FacultyChatError(
      raw.slice(0, 280) || `Keyless AI returned non-JSON (${res.status})`,
      "parse",
    );
  }

  if (!res.ok) {
    const msg =
      typeof data.error === "object" && data.error?.message
        ? data.error.message
        : typeof data.error === "string"
          ? data.error
          : raw.slice(0, 200);
    throw new FacultyChatError(
      msg || `Keyless AI error (${res.status}). Try again in a minute or switch to OpenAI API mode.`,
      "pollinations",
    );
  }

  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new FacultyChatError(
      "Empty reply from keyless AI. Try a shorter question or switch to OpenAI API mode.",
      "empty",
    );
  }
  return text;
}
