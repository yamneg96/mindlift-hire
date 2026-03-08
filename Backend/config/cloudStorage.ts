import path from "node:path";

export type UploadTarget = "cv" | "portfolio";

export async function uploadToCloudStorage(
  filePath: string,
  target: UploadTarget,
): Promise<string> {
  const normalized = filePath.replace(/\\/g, "/");
  // Placeholder adapter. Replace with Cloudinary/S3 integration when enabled.
  return `/uploads/${target}/${path.basename(normalized)}`;
}
