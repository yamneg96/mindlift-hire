import crypto from "node:crypto";

type OtpRecord = {
  otpHash: string;
  expiresAt: number;
};

const otpStore = new Map<string, OtpRecord>();

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function hashOtp(otp: string) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export function generateOtp() {
  const value = crypto.randomInt(0, 1_000_000);
  return String(value).padStart(6, "0");
}

export function setOtp(email: string, otp: string, ttlMinutes = 10) {
  const key = normalizeEmail(email);
  const expiresAt = Date.now() + ttlMinutes * 60 * 1000;
  otpStore.set(key, { otpHash: hashOtp(otp), expiresAt });
}

export function verifyOtp(email: string, otp: string) {
  const key = normalizeEmail(email);
  const record = otpStore.get(key);
  if (!record) {
    return { ok: false, reason: "missing" as const };
  }

  if (record.expiresAt < Date.now()) {
    otpStore.delete(key);
    return { ok: false, reason: "expired" as const };
  }

  if (record.otpHash !== hashOtp(otp)) {
    return { ok: false, reason: "invalid" as const };
  }

  otpStore.delete(key);
  return { ok: true as const };
}
