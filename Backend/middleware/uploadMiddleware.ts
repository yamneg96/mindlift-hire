import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import multer from "multer";

function resolveUploadRoot() {
  const isServerless =
    process.env.VERCEL === "1" || process.env.AWS_LAMBDA_FUNCTION_NAME;

  if (isServerless) {
    // In serverless runtimes, only /tmp is writable.
    return path.join(os.tmpdir(), "mindlift-role", "uploads");
  }

  return path.resolve("uploads");
}

function ensureRoleImageDir() {
  const preferredRoot = resolveUploadRoot();
  const fallbackRoot = path.join(os.tmpdir(), "mindlift-role", "uploads");
  const preferredRoleImagePath = path.join(preferredRoot, "ml-role-image");
  const fallbackRoleImagePath = path.join(fallbackRoot, "ml-role-image");

  try {
    if (!fs.existsSync(preferredRoleImagePath)) {
      fs.mkdirSync(preferredRoleImagePath, { recursive: true });
    }

    return preferredRoleImagePath;
  } catch {
    if (!fs.existsSync(fallbackRoleImagePath)) {
      fs.mkdirSync(fallbackRoleImagePath, { recursive: true });
    }

    return fallbackRoleImagePath;
  }
}

const roleImagesDir = ensureRoleImageDir();
const memoryStorage = multer.memoryStorage();

const allowedMimes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function fileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  if (!allowedMimes.has(file.mimetype)) {
    cb(new Error("Only PDF and DOCX files are allowed"));
    return;
  }

  cb(null, true);
}

export const upload = multer({
  storage: memoryStorage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const roleImageStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, roleImagesDir);
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

function roleImageFileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  if (!file.mimetype.startsWith("image/")) {
    cb(new Error("Only image files are allowed for role preview"));
    return;
  }

  cb(null, true);
}

export const roleImageUpload = multer({
  storage: roleImageStorage,
  fileFilter: roleImageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
