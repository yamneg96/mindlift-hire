import crypto from "node:crypto";
const otpStore = new Map();
function normalizeEmail(email) {
    return email.trim().toLowerCase();
}
function hashOtp(otp) {
    return crypto.createHash("sha256").update(otp).digest("hex");
}
export function generateOtp() {
    const value = crypto.randomInt(0, 1_000_000);
    return String(value).padStart(6, "0");
}
export function setOtp(email, otp, ttlMinutes = 10) {
    const key = normalizeEmail(email);
    const expiresAt = Date.now() + ttlMinutes * 60 * 1000;
    otpStore.set(key, { otpHash: hashOtp(otp), expiresAt });
}
export function verifyOtp(email, otp) {
    const key = normalizeEmail(email);
    const record = otpStore.get(key);
    if (!record) {
        return { ok: false, reason: "missing" };
    }
    if (record.expiresAt < Date.now()) {
        otpStore.delete(key);
        return { ok: false, reason: "expired" };
    }
    if (record.otpHash !== hashOtp(otp)) {
        return { ok: false, reason: "invalid" };
    }
    otpStore.delete(key);
    return { ok: true };
}
