import { createRequire } from "node:module";
import { generateOtpEmail } from "./templates/otpEmailTemplate.js";
import { generateApplicantNotificationEmail } from "./templates/applicantNotificationTemplate.js";
const require = createRequire(import.meta.url);
const nodemailer = require("nodemailer");
function cleanEnv(value) {
    if (!value) {
        return "";
    }
    return value.trim().replace(/^['\"]|['\"]$/g, "");
}
function resolveFromAddress() {
    const raw = cleanEnv(process.env.EMAIL_FROM || process.env.Email_From);
    if (!raw) {
        return "MindLift <no-reply@mindlift.org>";
    }
    // If user provides comma-separated values by mistake, use the first one.
    return raw.split(",")[0].trim();
}
function getTransporter() {
    const host = cleanEnv(process.env.SMTP_HOST);
    const port = Number(cleanEnv(process.env.SMTP_PORT) || 587);
    const user = cleanEnv(process.env.SMTP_USER);
    const pass = cleanEnv(process.env.SMTP_PASS);
    if (!host || !user || !pass) {
        return null;
    }
    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
    });
}
export async function sendAdminOtpEmail(email, otp) {
    const subject = "Your MindLift admin verification code";
    const html = generateOtpEmail(otp);
    const transporter = getTransporter();
    if (!transporter) {
        // eslint-disable-next-line no-console
        console.log(`[email:fallback] OTP for ${email}: ${otp}`);
        return;
    }
    const from = resolveFromAddress();
    await transporter.sendMail({
        from,
        to: email,
        subject,
        html,
    });
}
export async function sendApplicantNotificationEmail(input) {
    const transporter = getTransporter();
    const html = generateApplicantNotificationEmail({
        title: input.title,
        subtitle: input.subtitle,
        message: input.message,
        roleTitle: input.roleTitle,
        actionText: input.actionText,
        actionUrl: input.actionUrl,
    });
    if (!transporter) {
        // eslint-disable-next-line no-console
        console.log(`[email:fallback] Applicant notification to ${input.to}: ${input.subject}`);
        return;
    }
    const from = resolveFromAddress();
    await transporter.sendMail({
        from,
        to: input.to,
        subject: input.subject,
        html,
    });
}
