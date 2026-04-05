import { fileURLToPath, URL } from "url";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import environment from "vite-plugin-environment";

const ii_url =
  process.env.DFX_NETWORK === "local"
    ? `http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:8081/`
    : `https://identity.internetcomputer.org/`;

process.env.II_URL = process.env.II_URL || ii_url;
process.env.STORAGE_GATEWAY_URL =
  process.env.STORAGE_GATEWAY_URL || "https://blob.caffeine.ai";

const FACULTY_SYSTEM = `You are a helpful teaching assistant for college and university faculty (ChatGPT faculty chat inside a campus portal).
Give accurate, practical answers: lesson plans, quizzes, rubrics, feedback analysis, pedagogy, and subject-matter help.
Be concise unless the user asks for detail. Use clear headings and bullet points when helpful.
If the question is ambiguous, ask one short clarifying question at the end.`;

function attachPollinationsProxy(middlewares) {
  middlewares.use((req, res, next) => {
    const path = req.url?.split("?")[0];
    if (path !== "/pollinations-openai" || req.method !== "POST") return next();

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      try {
        const r = await fetch("https://text.pollinations.ai/openai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body,
        });
        const buf = Buffer.from(await r.arrayBuffer());
        res.statusCode = r.status;
        const ct = r.headers.get("content-type") || "application/json";
        res.setHeader("Content-Type", ct);
        res.end(buf);
      } catch (e) {
        res.statusCode = 502;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: String(e) }));
      }
    });
  });
}

function attachOpenAiChatProxy(middlewares, openaiKey, model) {
  middlewares.use((req, res, next) => {
    const path = req.url?.split("?")[0];
    if (path !== "/openai-chat") return next();
    if (req.method !== "POST") return next();

    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", async () => {
      res.setHeader("Content-Type", "application/json");
      try {
        if (!openaiKey) {
          res.statusCode = 503;
          res.end(JSON.stringify({ error: "missing_key" }));
          return;
        }
        const parsed = JSON.parse(body || "{}");
        const userMessages = parsed.messages;
        if (!Array.isArray(userMessages)) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "invalid_messages" }));
          return;
        }
        const r = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openaiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: model || "gpt-4o-mini",
            temperature: 0.7,
            messages: [{ role: "system", content: FACULTY_SYSTEM }, ...userMessages],
          }),
        });
        const data = await r.json();
        if (!r.ok) {
          res.statusCode = r.status;
          res.end(
            JSON.stringify({
              error: data.error?.message || "openai_error",
            }),
          );
          return;
        }
        const text = data.choices?.[0]?.message?.content ?? "";
        res.statusCode = 200;
        res.end(JSON.stringify({ text }));
      } catch (e) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: String(e) }));
      }
    });
  });
}

export default defineConfig(({ mode }) => {
  const envDir = fileURLToPath(new URL(".", import.meta.url));
  const env = loadEnv(mode, envDir, "");
  const openaiKey = (env.OPENAI_API_KEY || "").trim();
  const openaiModel = (env.OPENAI_MODEL || "gpt-4o-mini").trim();

  return {
    logLevel: process.env.VITE_LOG_LEVEL || "info",
    build: {
      emptyOutDir: true,
      sourcemap: false,
      minify: false,
    },
    css: {
      postcss: "./postcss.config.js",
    },
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: "globalThis",
        },
      },
    },
    server: {
      host: true,
      port: 5173,
      strictPort: false,
      proxy: {
        "/api": {
          target: "http://127.0.0.1:4943",
          changeOrigin: true,
        },
      },
    },
    plugins: [
      environment("all", { prefix: "CANISTER_" }),
      environment("all", { prefix: "DFX_" }),
      environment(["II_URL"]),
      environment(["STORAGE_GATEWAY_URL"]),
      react(),
      {
        name: "pollinations-keyless-proxy",
        configureServer(server) {
          attachPollinationsProxy(server.middlewares);
        },
        configurePreviewServer(server) {
          attachPollinationsProxy(server.middlewares);
        },
      },
      {
        name: "openai-faculty-chat-proxy",
        configureServer(server) {
          attachOpenAiChatProxy(server.middlewares, openaiKey, openaiModel);
        },
        configurePreviewServer(server) {
          attachOpenAiChatProxy(server.middlewares, openaiKey, openaiModel);
        },
      },
    ],
    resolve: {
      alias: [
        {
          find: "declarations",
          replacement: fileURLToPath(new URL("../declarations", import.meta.url)),
        },
        {
          find: "@",
          replacement: fileURLToPath(new URL("./src", import.meta.url)),
        },
      ],
      dedupe: ["@dfinity/agent"],
    },
  };
});
