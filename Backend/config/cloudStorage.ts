import fs from "node:fs/promises";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";

export type UploadTarget = "cv" | "portfolio";

let cloudinaryConfigured = false;

function ensureCloudinaryConfigured() {
  if (cloudinaryConfigured) {
    return;
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloud storage enabled but Cloudinary credentials are missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  cloudinaryConfigured = true;
}

export async function uploadToCloudStorage(
  filePath: string,
  target: UploadTarget,
): Promise<string> {
  ensureCloudinaryConfigured();

  const normalizedPath = filePath.replace(/\\/g, "/");
  const baseFolder =
    process.env.CLOUDINARY_FOLDER?.trim() || "mindlift-role/uploads";
  const folder = `${baseFolder}/${target}`;

  const uploadResult = await cloudinary.uploader.upload(normalizedPath, {
    folder,
    resource_type: "raw",
    use_filename: true,
    unique_filename: true,
    overwrite: false,
    filename_override: path.basename(normalizedPath),
  });

  // Remove temporary local file once cloud upload succeeds.
  await fs.unlink(filePath).catch(() => undefined);

  return uploadResult.secure_url;
}
