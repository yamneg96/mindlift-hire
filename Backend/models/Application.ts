import mongoose, { Schema, type InferSchemaType } from "mongoose";

const applicationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: false },
    applicantName: { type: String, required: true, trim: true },
    applicantEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    portfolio: { type: String, default: "" },
    skills: { type: [String], default: [] },
    experienceLevel: { type: String, default: "" },
    availability: { type: String, default: "" },
    applicationType: {
      type: String,
      enum: ["role", "job"],
      default: "role",
    },
    roleId: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    cvUrl: { type: String, required: true },
    portfolioUrl: { type: String, default: "" },
    motivationLetter: { type: String, required: true },
    additionalAnswers: {
      experienceLevel: { type: String, default: "" },
      availability: { type: String, default: "" },
      expectedContribution: { type: String, default: "" },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "shortlisted"],
      default: "pending",
    },
    adminNotes: { type: String, default: "" },
    appliedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
    pipelineStage: {
      type: String,
      enum: ["Applied", "Screening", "Interview", "Final Decision"],
      default: "Applied",
    },
  },
  { timestamps: true },
);

applicationSchema.index({ roleId: 1, status: 1, appliedAt: -1 });
applicationSchema.index({ applicantEmail: 1, roleId: 1 });
applicationSchema.index({ applicationType: 1, status: 1, appliedAt: -1 });

export type ApplicationDocument = InferSchemaType<typeof applicationSchema>;

export const ApplicationModel =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);
