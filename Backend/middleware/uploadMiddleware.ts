import fs from "node:fs";
import path from "node:path";
import multer from "multer";

const uploadRoot = path.resolve("uploads");
const cvDir = path.join(uploadRoot, "cv");
const portfolioDir = path.join(uploadRoot, "portfolio");

for (const dir of [uploadRoot, cvDir, portfolioDir]) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    if (file.fieldname === "cv") {
      cb(null, cvDir);
      return;
    }

    cb(null, portfolioDir);
  },
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

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
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
