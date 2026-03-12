import { z } from "zod";
export const sendApplicantEmailSchema = z.object({
    recipients: z.array(z.string().email()).min(1),
    body: z.string().min(10),
    subject: z.string().min(3).optional(),
    roleTitle: z.string().optional(),
});
