import path from "node:path";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { connectDB } from "./config/db.js";
import { authRoutes } from "./routes/authRoutes.js";
import { roleRoutes } from "./routes/roleRoutes.js";
import { applicationRoutes } from "./routes/applicationRoutes.js";
import { adminRoutes } from "./routes/adminRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 5000);

const allowedOrigins = (process.env.CLIENT_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)
  .map((origin) => origin.replace(/\/+$/, ""));

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // Non-browser requests (curl, server-to-server) may not send Origin.
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.length === 0 || allowedOrigins.includes("*")) {
        callback(null, true);
        return;
      }

      const normalizedOrigin = origin.replace(/\/+$/, "");
      if (allowedOrigins.includes(normalizedOrigin)) {
        callback(null, true);
        return;
      }

      callback(new Error("CORS: Origin not allowed"));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<title>MindLift Role API</title>
<style>
  :root {
    --background: #f8fafc;
    --foreground: #0f172a;
    --card: #ffffff;
    --primary: #2563eb;
    --muted: #64748b;
    --border: #e2e8f0;
  }

  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-height: 100vh;
    font-family: Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: var(--foreground);
    background:
      radial-gradient(circle at 10% 0%, rgba(37, 99, 235, 0.14), transparent 35%),
      radial-gradient(circle at 85% 15%, rgba(37, 99, 235, 0.1), transparent 40%),
      var(--background);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24px;
  }

  .shell {
    width: min(940px, 100%);
    background: color-mix(in srgb, var(--card) 92%, transparent);
    border: 1px solid var(--border);
    border-radius: 20px;
    box-shadow: 0 16px 45px rgba(15, 23, 42, 0.08);
    overflow: hidden;
    backdrop-filter: blur(8px);
  }

  .topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 16px 24px;
    border-bottom: 1px solid var(--border);
    background: linear-gradient(90deg, rgba(37, 99, 235, 0.1), rgba(37, 99, 235, 0));
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 800;
    letter-spacing: -0.02em;
  }

  .brand-badge {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: var(--primary);
    display: grid;
    place-items: center;
    color: #ffffff;
    font-size: 18px;
  }

  .status-pill {
    font-size: 12px;
    font-weight: 700;
    padding: 6px 10px;
    border-radius: 999px;
    border: 1px solid color-mix(in srgb, var(--primary) 25%, transparent);
    background: color-mix(in srgb, var(--primary) 12%, #ffffff);
    color: var(--primary);
  }

  .content {
    padding: 28px 24px;
  }

  h1 {
    margin: 0;
    font-size: clamp(28px, 4vw, 42px);
    letter-spacing: -0.03em;
  }

  .subtitle {
    margin-top: 10px;
    color: var(--muted);
    font-size: 16px;
    max-width: 680px;
    line-height: 1.7;
  }

  .grid {
    margin-top: 24px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }

  .tile {
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 14px;
    background: color-mix(in srgb, var(--card) 92%, transparent);
  }

  .tile-label {
    margin: 0;
    color: var(--muted);
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .tile-value {
    margin: 8px 0 0;
    font-weight: 700;
    font-size: 16px;
  }

  .tile-value.success {
    color: #0f9d58;
  }

  .actions {
    margin-top: 24px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    padding: 11px 16px;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none;
    transition: all 0.16s ease;
  }

  .btn-primary {
    background: var(--primary);
    color: #ffffff;
    border: 1px solid var(--primary);
  }

  .btn-primary:hover {
    background: #1d4ed8;
    border-color: #1d4ed8;
  }

  .btn-ghost {
    color: var(--foreground);
    border: 1px solid var(--border);
    background: #ffffff;
  }

  .btn-ghost:hover {
    background: #f1f5f9;
  }

  .footer {
    margin-top: 24px;
    border-top: 1px solid var(--border);
    padding-top: 16px;
    color: var(--muted);
    font-size: 13px;
  }

  @media (max-width: 760px) {
    .topbar {
      padding: 14px 16px;
    }

    .content {
      padding: 20px 16px;
    }

    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>

</head>

<body>
<div class="shell">
  <div class="topbar">
    <div class="brand">
      <span class="brand-badge">M</span>
      <span>MindLift Role API</span>
    </div>
    <span class="status-pill">Backend Online</span>
  </div>

  <div class="content">
    <h1>Talent and Role Application Backend</h1>
    <p class="subtitle">
      Secure API services for authentication, role management, and application workflows.
      Built to support the MindLift frontend with consistent structure and performance.
    </p>

    <div class="grid">
      <div class="tile">
        <p class="tile-label">API Status</p>
        <p class="tile-value success">Online</p>
      </div>
      <div class="tile">
        <p class="tile-label">Environment</p>
        <p class="tile-value">${process.env.NODE_ENV || "development"}</p>
      </div>
      <div class="tile">
        <p class="tile-label">Rate Limit</p>
        <p class="tile-value">300 requests / 15 min</p>
      </div>
      <div class="tile">
        <p class="tile-label">API Base</p>
        <p class="tile-value">/api</p>
      </div>
    </div>

    <div class="actions">
      <a href="/api/health" class="btn btn-primary">Check Health</a>
      <a href="/api" class="btn btn-ghost">Open API Base</a>
    </div>

    <div class="footer">
      MindLift Role Backend • Node.js • Express • MongoDB
    </div>
  </div>
</div>

</body>
</html>
`);
});

app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

app.use("/uploads", express.static(path.resolve("uploads")));

app.get("/api", (req, res) => {
  const format = Array.isArray(req.query.format)
    ? req.query.format[0]
    : req.query.format;
  const view = Array.isArray(req.query.view)
    ? req.query.view[0]
    : req.query.view;
  const acceptHeader = req.headers.accept ?? "";

  const forceHtml = format === "html" || view === "html";
  const forceJson = format === "json";
  const isHtmlRequest =
    forceHtml || (!forceJson && acceptHeader.includes("text/html"));

  if (isHtmlRequest) {
    res.status(200).send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MindLift API Index</title>
  <style>
    :root {
      --background: #f8fafc;
      --foreground: #0f172a;
      --card: #ffffff;
      --primary: #2563eb;
      --muted: #64748b;
      --border: #e2e8f0;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-height: 100vh;
      font-family: Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: var(--foreground);
      background:
        radial-gradient(circle at 12% 0%, rgba(37, 99, 235, 0.15), transparent 34%),
        radial-gradient(circle at 88% 18%, rgba(37, 99, 235, 0.1), transparent 42%),
        var(--background);
      display: grid;
      place-items: center;
      padding: 24px;
    }

    .shell {
      width: min(900px, 100%);
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 20px;
      box-shadow: 0 16px 45px rgba(15, 23, 42, 0.08);
      overflow: hidden;
    }

    .top {
      padding: 18px 22px;
      border-bottom: 1px solid var(--border);
      background: linear-gradient(90deg, rgba(37, 99, 235, 0.1), rgba(37, 99, 235, 0));
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
    }

    .brand {
      font-size: 18px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .pill {
      border-radius: 999px;
      font-size: 12px;
      font-weight: 700;
      padding: 6px 10px;
      border: 1px solid rgba(37, 99, 235, 0.28);
      background: rgba(37, 99, 235, 0.1);
      color: var(--primary);
    }

    .content {
      padding: 24px 22px;
    }

    h1 {
      margin: 0;
      font-size: clamp(28px, 4vw, 38px);
      letter-spacing: -0.03em;
    }

    .subtitle {
      margin-top: 10px;
      color: var(--muted);
      line-height: 1.7;
      max-width: 680px;
    }

    .grid {
      margin-top: 22px;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .endpoint {
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 14px;
      background: #ffffff;
    }

    .method {
      display: inline-block;
      border-radius: 999px;
      padding: 4px 8px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      background: rgba(37, 99, 235, 0.1);
      color: var(--primary);
    }

    .path {
      margin: 10px 0 0;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 14px;
      font-weight: 700;
    }

    .note {
      margin: 8px 0 0;
      color: var(--muted);
      font-size: 13px;
      line-height: 1.6;
    }

    .actions {
      margin-top: 22px;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      padding: 10px 14px;
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
      border: 1px solid transparent;
      transition: all 0.16s ease;
    }

    .btn-primary {
      background: var(--primary);
      border-color: var(--primary);
      color: #ffffff;
    }

    .btn-primary:hover {
      background: #1d4ed8;
      border-color: #1d4ed8;
    }

    .btn-outline {
      color: var(--foreground);
      border-color: var(--border);
      background: #ffffff;
    }

    .btn-outline:hover {
      background: #f1f5f9;
    }

    @media (max-width: 760px) {
      .top {
        padding: 16px;
      }

      .content {
        padding: 20px 16px;
      }

      .grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <section class="shell">
    <div class="top">
      <div class="brand">MindLift API Index</div>
      <span class="pill">Version 1</span>
    </div>

    <div class="content">
      <h1>Available API Routes</h1>
      <p class="subtitle">
        This endpoint groups the main resources used by the MindLift frontend.
        Use health checks for uptime and navigate by resource domain below.
      </p>

      <div class="grid">
        <div class="endpoint">
          <span class="method">GET</span>
          <p class="path">/api/health</p>
          <p class="note">Service health status and runtime check.</p>
        </div>
        <div class="endpoint">
          <span class="method">RESOURCE</span>
          <p class="path">/api/auth</p>
          <p class="note">Authentication and account operations.</p>
        </div>
        <div class="endpoint">
          <span class="method">RESOURCE</span>
          <p class="path">/api/roles</p>
          <p class="note">Role listing and role management endpoints.</p>
        </div>
        <div class="endpoint">
          <span class="method">RESOURCE</span>
          <p class="path">/api/applications</p>
          <p class="note">Application submission and retrieval routes.</p>
        </div>
        <div class="endpoint">
          <span class="method">RESOURCE</span>
          <p class="path">/api/admin</p>
          <p class="note">Admin-only analytics and moderation routes.</p>
        </div>
        <div class="endpoint">
          <span class="method">STATIC</span>
          <p class="path">/uploads</p>
          <p class="note">Uploaded file access for documents.</p>
        </div>
      </div>

      <div class="actions">
        <a class="btn btn-primary" href="/api/health">Open Health UI</a>
        <a class="btn btn-outline" href="/">Back to Home</a>
      </div>
    </div>
  </section>
</body>
</html>
`);
    return;
  }

  res.status(200).json({
    success: true,
    name: "MindLift Role API",
    base: "/api",
    resources: [
      "/api/health",
      "/api/auth",
      "/api/roles",
      "/api/applications",
      "/api/admin",
    ],
  });
});

app.get("/api/health", (req, res) => {
  const format = Array.isArray(req.query.format)
    ? req.query.format[0]
    : req.query.format;
  const view = Array.isArray(req.query.view)
    ? req.query.view[0]
    : req.query.view;
  const acceptHeader = req.headers.accept ?? "";

  const forceHtml = format === "html" || view === "html";
  const forceJson = format === "json";
  const isHtmlRequest =
    forceHtml || (!forceJson && acceptHeader.includes("text/html"));

  if (isHtmlRequest) {
    res.status(200).send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MindLift API Health</title>
  <style>
    :root {
      --background: #f8fafc;
      --foreground: #0f172a;
      --card: #ffffff;
      --primary: #2563eb;
      --muted: #64748b;
      --border: #e2e8f0;
      --success: #0f9d58;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      min-height: 100vh;
      font-family: Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: var(--foreground);
      background:
        radial-gradient(circle at 15% 0%, rgba(37, 99, 235, 0.16), transparent 36%),
        radial-gradient(circle at 90% 20%, rgba(37, 99, 235, 0.12), transparent 42%),
        var(--background);
      display: grid;
      place-items: center;
      padding: 24px;
    }

    .card {
      width: min(620px, 100%);
      border: 1px solid var(--border);
      border-radius: 20px;
      background: var(--card);
      box-shadow: 0 16px 45px rgba(15, 23, 42, 0.08);
      padding: 26px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border-radius: 999px;
      border: 1px solid color-mix(in srgb, var(--success) 35%, transparent);
      background: color-mix(in srgb, var(--success) 12%, #ffffff);
      color: var(--success);
      font-size: 12px;
      font-weight: 800;
      padding: 6px 12px;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    h1 {
      margin: 14px 0 0;
      font-size: clamp(28px, 4.2vw, 38px);
      letter-spacing: -0.03em;
    }

    .desc {
      margin-top: 10px;
      line-height: 1.7;
      color: var(--muted);
    }

    .status-grid {
      margin-top: 20px;
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }

    .tile {
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 12px;
      background: #ffffff;
    }

    .tile p {
      margin: 0;
    }

    .tile .label {
      font-size: 12px;
      font-weight: 700;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .tile .value {
      margin-top: 7px;
      font-size: 16px;
      font-weight: 700;
    }

    .actions {
      margin-top: 22px;
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      padding: 10px 14px;
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
      border: 1px solid transparent;
      transition: all 0.16s ease;
    }

    .btn-primary {
      background: var(--primary);
      border-color: var(--primary);
      color: #ffffff;
    }

    .btn-primary:hover {
      background: #1d4ed8;
      border-color: #1d4ed8;
    }

    .btn-outline {
      background: #ffffff;
      border-color: var(--border);
      color: var(--foreground);
    }

    .btn-outline:hover {
      background: #f1f5f9;
    }

    @media (max-width: 640px) {
      .card {
        padding: 20px;
      }

      .status-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <section class="card">
    <span class="badge">System Healthy</span>
    <h1>MindLift API Health Check</h1>
    <p class="desc">
      The service is online and ready to handle requests. Use this endpoint for
      uptime checks and deployment verification.
    </p>

    <div class="status-grid">
      <div class="tile">
        <p class="label">Status</p>
        <p class="value">Online</p>
      </div>
      <div class="tile">
        <p class="label">Environment</p>
        <p class="value">${process.env.NODE_ENV || "development"}</p>
      </div>
      <div class="tile">
        <p class="label">Endpoint</p>
        <p class="value">/api/health</p>
      </div>
      <div class="tile">
        <p class="label">Response</p>
        <p class="value">200 OK</p>
      </div>
    </div>

    <div class="actions">
      <a href="/" class="btn btn-primary">Back to Home</a>
      <a href="/api" class="btn btn-outline">Open API Base</a>
    </div>
  </section>
</body>
</html>
`);
    return;
  }

  res.status(200).json({ success: true, message: "MindLift Role API healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);

// Alias routes from the instruction's alternate route overview
app.use("/auth", authRoutes);
app.use("/roles", roleRoutes);
app.use("/applications", applicationRoutes);
app.use("/admin", adminRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

async function bootstrap() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("MONGO_URI is not configured");
  }

  await connectDB(mongoUri);
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`[api] running on http://localhost:${port}`);
  });
}

void bootstrap();
