import type { Request, Response } from "express";

import { sendApplicantNotificationEmail } from "../services/email/emailService.js";
import { parseBody } from "../utils/validation.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { sendApplicantEmailSchema } from "../zod/adminEmail.js";

export async function sendEmailToApplicants(req: Request, res: Response) {
  const body = parseBody<ReturnType<typeof sendApplicantEmailSchema.parse>>(
    sendApplicantEmailSchema,
    req.body,
  );

  const recipients = [
    ...new Set(body.recipients.map((item) => item.trim().toLowerCase())),
  ];
  if (recipients.length === 0) {
    return sendError(res, "At least one recipient is required", 400);
  }

  const subject = body.subject?.trim() || "MindLift Application Update";

  await Promise.all(
    recipients.map((to) =>
      sendApplicantNotificationEmail({
        to,
        subject,
        title: "Update About Your Application",
        subtitle: "Message from MindLift admin team",
        message: body.body,
        roleTitle: body.roleTitle,
      }),
    ),
  );

  return sendSuccess(
    res,
    { sent: recipients.length, recipients },
    "Email notifications sent",
  );
}
