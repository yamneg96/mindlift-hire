import path from "node:path";
import { createRequire } from "node:module";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import morgan from "morgan";

import { connectDB } from "./config/db.js";
import { roleRoutes } from "./routes/roleRoutes.js";
import { applicationRoutes } from "./routes/applicationRoutes.js";
import { adminRoutes } from "./routes/adminRoutes.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";

const require = createRequire(import.meta.url);
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 5000);

/*
Trust proxy so IP and rate limiter work properly on platforms
like Vercel, Nginx, Cloudflare, etc.
*/
const trustProxySetting = process.env.TRUST_PROXY?.trim();
if (trustProxySetting) {
  app.set("trust proxy", trustProxySetting === "true" ? 1 : trustProxySetting);
} else {
  app.set("trust proxy", 1);
}

/*
Security middleware
*/
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

/*
CORS configuration
*/
app.use(
  cors({
    origin: ["http://localhost:5173", "https://mindlift-hire.vercel.app"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

/*
Handle preflight requests
*/
app.options("*", cors());

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

/*
Landing page UI
*/
app.get("/", (req, res) => {
  res.send(`

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>MindLift Role API</title>

<style>
:root{
--background:#f8fafc;
--foreground:#0f172a;
--card:#ffffff;
--primary:#2563eb;
--muted:#64748b;
--border:#e2e8f0;
}

*{box-sizing:border-box;}

body{
margin:0;
min-height:100vh;
font-family:Inter,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
color:var(--foreground);
background:
radial-gradient(circle at 10% 0%,rgba(37,99,235,0.14),transparent 35%),
radial-gradient(circle at 85% 15%,rgba(37,99,235,0.1),transparent 40%),
var(--background);
display:flex;
justify-content:center;
align-items:center;
padding:24px;
}

.shell{
width:min(940px,100%);
background:color-mix(in srgb,var(--card) 92%,transparent);
border:1px solid var(--border);
border-radius:20px;
box-shadow:0 16px 45px rgba(15,23,42,0.08);
overflow:hidden;
backdrop-filter:blur(8px);
}

.topbar{
display:flex;
justify-content:space-between;
align-items:center;
gap:16px;
padding:16px 24px;
border-bottom:1px solid var(--border);
background:linear-gradient(90deg,rgba(37,99,235,0.1),rgba(37,99,235,0));
}

.brand{
display:flex;
align-items:center;
gap:10px;
font-weight:800;
letter-spacing:-0.02em;
}

.brand-badge{
width:34px;
height:34px;
border-radius:10px;
object-fit:cover;
border:1px solid var(--border);
background:#ffffff;
}

.status-pill{
font-size:12px;
font-weight:700;
padding:6px 10px;
border-radius:999px;
border:1px solid color-mix(in srgb,var(--primary) 25%,transparent);
background:color-mix(in srgb,var(--primary) 12%,#ffffff);
color:var(--primary);
}

.content{padding:28px 24px;}

h1{
margin:0;
font-size:clamp(28px,4vw,42px);
letter-spacing:-0.03em;
}

.subtitle{
margin-top:10px;
color:var(--muted);
font-size:16px;
max-width:680px;
line-height:1.7;
}

.grid{
margin-top:24px;
display:grid;
grid-template-columns:repeat(2,minmax(0,1fr));
gap:14px;
}

.tile{
border:1px solid var(--border);
border-radius:14px;
padding:14px;
background:color-mix(in srgb,var(--card) 92%,transparent);
}

.tile-label{
margin:0;
color:var(--muted);
font-size:12px;
font-weight:700;
text-transform:uppercase;
letter-spacing:0.08em;
}

.tile-value{
margin:8px 0 0;
font-weight:700;
font-size:16px;
}

.tile-value.success{color:#0f9d58;}

.actions{
margin-top:24px;
display:flex;
flex-wrap:wrap;
gap:10px;
}

.btn{
display:inline-flex;
align-items:center;
justify-content:center;
border-radius:12px;
padding:11px 16px;
font-size:14px;
font-weight:700;
text-decoration:none;
transition:all 0.16s ease;
}

.btn-primary{
background:var(--primary);
color:#fff;
border:1px solid var(--primary);
}

.btn-primary:hover{
background:#1d4ed8;
border-color:#1d4ed8;
}

.btn-ghost{
color:var(--foreground);
border:1px solid var(--border);
background:#fff;
}

.btn-ghost:hover{background:#f1f5f9;}

.footer{
margin-top:24px;
border-top:1px solid var(--border);
padding-top:16px;
color:var(--muted);
font-size:13px;
}

@media(max-width:760px){
.topbar{padding:14px 16px;}
.content{padding:20px 16px;}
.grid{grid-template-columns:1fr;}
}
</style>
</head>

<body>

<div class="shell">

<div class="topbar">
<div class="brand">
<img src="/public/MindLift-Logo.jpg" class="brand-badge"/>
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

/*
Rate limit API
*/
app.use(
  "/api",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);

/*
Static files
*/
app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/public", express.static(path.resolve("public")));

/*
Health route
*/
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "MindLift Role API healthy",
  });
});

/*
API routes
*/
app.use("/api/roles", roleRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);

/*
Optional aliases
*/
app.use("/roles", roleRoutes);
app.use("/applications", applicationRoutes);

/*
Error handlers
*/
app.use(notFoundHandler);
app.use(errorHandler);

/*
Bootstrap server
*/
async function bootstrap() {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is not configured");
  }

  await connectDB(mongoUri);

  app.listen(port, () => {
    console.log("[api] running on http://localhost:" + port);
  });
}

void bootstrap();

export default app;
