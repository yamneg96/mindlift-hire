import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import multer from "multer";
function resolveUploadRoot() {
    const isServerless = process.env.VERCEL === "1" || process.env.AWS_LAMBDA_FUNCTION_NAME;
    if (isServerless) {
        // In serverless runtimes, only /tmp is writable.
        return path.join(os.tmpdir(), "mindlift-role", "uploads");
    }
    return path.resolve("uploads");
}
function ensureUploadDirs() {
    const preferredRoot = resolveUploadRoot();
    const fallbackRoot = path.join(os.tmpdir(), "mindlift-role", "uploads");
    const createDirs = (root) => {
        const dirs = [
            root,
            path.join(root, "cv"),
            path.join(root, "portfolio"),
            path.join(root, "ml-role-image"),
            path.join(root, "ml-job-image"),
        ];
        for (const dir of dirs) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        }
    };
    try {
        createDirs(preferredRoot);
        return {
            uploadRoot: preferredRoot,
            cvDir: path.join(preferredRoot, "cv"),
            portfolioDir: path.join(preferredRoot, "portfolio"),
            roleImagesDir: path.join(preferredRoot, "ml-role-image"),
        };
    }
    catch {
        createDirs(fallbackRoot);
        return {
            uploadRoot: fallbackRoot,
            cvDir: path.join(fallbackRoot, "cv"),
            portfolioDir: path.join(fallbackRoot, "portfolio"),
            roleImagesDir: path.join(fallbackRoot, "ml-role-image"),
        };
    }
}
const { cvDir, portfolioDir, roleImagesDir } = ensureUploadDirs();
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
function fileFilter(_req, file, cb) {
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
const roleImageStorage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, roleImagesDir);
    },
    filename: (_req, file, cb) => {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
        cb(null, `${Date.now()}-${safeName}`);
    },
});
function roleImageFileFilter(_req, file, cb) {
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
