import fs from "node:fs/promises";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";
let cloudinaryConfigured = false;
export function isCloudStorageEnabled() {
    return (String(process.env.USE_CLOUD_STORAGE ?? "true").toLowerCase() !== "false");
}
function hasCloudinaryCredentials() {
    return (Boolean(process.env.CLOUDINARY_URL) ||
        (Boolean(process.env.CLOUDINARY_CLOUD_NAME) &&
            Boolean(process.env.CLOUDINARY_API_KEY) &&
            Boolean(process.env.CLOUDINARY_API_SECRET)));
}
function ensureCloudinaryConfigured() {
    if (cloudinaryConfigured) {
        return;
    }
    if (!isCloudStorageEnabled()) {
        throw new Error("Cloud storage is disabled");
    }
    const cloudinaryUrl = process.env.CLOUDINARY_URL?.trim();
    if (cloudinaryUrl) {
        cloudinary.config({
            cloudinary_url: cloudinaryUrl,
            secure: true,
        });
        cloudinaryConfigured = true;
        return;
    }
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!hasCloudinaryCredentials() || !cloudName || !apiKey || !apiSecret) {
        throw new Error("Cloud storage enabled but Cloudinary credentials are missing. Set CLOUDINARY_URL or CLOUDINARY_CLOUD_NAME/CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET.");
    }
    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
    });
    cloudinaryConfigured = true;
}
export async function uploadToCloudStorage(filePath, target) {
    ensureCloudinaryConfigured();
    const normalizedPath = filePath.replace(/\\/g, "/");
    const baseFolder = process.env.CLOUDINARY_FOLDER?.trim() || "mindlift-role/uploads";
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
export async function uploadBufferToCloudStorage(options) {
    ensureCloudinaryConfigured();
    const normalizedFolder = options.folder.replace(/^\/+|\/+$/g, "");
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({
            folder: normalizedFolder,
            resource_type: options.resourceType ?? "auto",
            use_filename: true,
            unique_filename: true,
            overwrite: false,
            filename_override: options.fileName,
        }, (error, result) => {
            if (error || !result?.secure_url) {
                reject(error ?? new Error("Cloud upload failed"));
                return;
            }
            resolve(result.secure_url);
        });
        stream.end(options.file);
    });
}
