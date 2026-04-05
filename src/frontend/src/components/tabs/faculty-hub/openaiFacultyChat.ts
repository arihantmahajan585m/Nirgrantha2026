/**
 * Chat completions for the faculty hub (same API family as ChatGPT).
 * - Dev: POST /openai-chat (Vite middleware; use OPENAI_API_KEY in .env — stays server-side).
 * - Optional: VITE_OPENAI_PROXY_URL for your own backend, or VITE_OPENAI_API_KEY for a direct browser call (insecure for production).
 */

export type FacultyChatRole = "user" | "assistant";

export interface FacultyChatTurn {
  role: FacultyChatRole;
  content: string;
}

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

const SYSTEM_PROMPT = `You are a helpful teaching assistant for college and university faculty (ChatGPT faculty chat inside a campus portal).
Give accurate, practical answers: lesson plans, quizzes, rubrics, feedback analysis, pedagogy, and subject-matter help.
Be concise unless the user asks for detail. Use clear headings and bullet points when helpful.
If the question is ambiguous, ask one short clarifying question at the end.`;

export class FacultyChatError extends Error {
  constructor(
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "FacultyChatError";
  }
}

async function parseJsonSafe(res: Response): Promise<{ text?: string; error?: string }> {
  const t = await res.text();
  try {
    return JSON.parse(t) as { text?: string; error?: string };
  } catch {
    return { error: t.slice(0, 200) };
  }
}

async function chatViaBrowserKey(
  messages: FacultyChatTurn[],
  apiKey: string,
  model: string,
): Promise<string> {
  const res = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.7,
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    }),
  });
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
    error?: { message?: string };
  };
  if (!res.ok) {
    throw new FacultyChatError(
      data.error?.message || `OpenAI error (${res.status})`,
      "openai",
    );
  }
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new FacultyChatError("Empty response from model.", "empty");
  return text;
}

export async function sendFacultyChat(messages: FacultyChatTurn[]): Promise<string> {
  const model =
    (import.meta.env.VITE_OPENAI_MODEL as string | undefined)?.trim() || "gpt-4o-mini";
  const browserKey = (import.meta.env.VITE_OPENAI_API_KEY as string | undefined)?.trim();
  const customProxy = (import.meta.env.VITE_OPENAI_PROXY_URL as string | undefined)?.trim();
  const url = customProxy || "/openai-chat";

  let missingKeyFromProxy = false;
  let otherError: FacultyChatError | null = null;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
    const j = await parseJsonSafe(res);
    if (res.ok) {
      if (j.text) return j.text;
      otherError = new FacultyChatError(
        j.error || "Empty response from chat proxy.",
        "proxy",
      );
    } else if (j.error === "missing_key") {
      missingKeyFromProxy = true;
    } else {
      otherError = new FacultyChatError(
        j.error || `Request failed (${res.status})`,
        "http",
      );
    }
  } catch (e) {
    otherError = new FacultyChatError(
      e instanceof Error ? e.message : String(e),
      "network",
    );
  }

  if (browserKey) {
    try {
      return await chatViaBrowserKey(messages, browserKey, model);
    } catch (e) {
      if (missingKeyFromProxy) {
        throw new FacultyChatError(
          `Dev proxy has no OPENAI_API_KEY, and browser key call failed: ${e instanceof Error ? e.message : String(e)}`,
          "openai",
        );
      }
      throw e;
    }
  }

  if (missingKeyFromProxy) {
    throw new FacultyChatError(
      "Add OPENAI_API_KEY to src/frontend/.env (no VITE_ prefix), then restart pnpm dev. Keys: https://platform.openai.com/api-keys — new accounts often receive free API credits; this hub uses model gpt-4o-mini by default.",
      "missing_key",
    );
  }

  if (otherError) throw otherError;
  throw new FacultyChatError("Chat request failed.", "unknown");
}
