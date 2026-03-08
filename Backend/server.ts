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

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN ?? true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

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

app.get("/api/health", (_req, res) => {
  res.status(200).json({ success: true, message: "NexusRole API healthy" });
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
