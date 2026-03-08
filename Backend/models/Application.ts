import mongoose, { Schema, type InferSchemaType } from "mongoose";

const applicationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    roleId: { type: Schema.Types.ObjectId, ref: "Role", required: true },
    cvUrl: { type: String, required: true },
    portfolioUrl: { type: String, default: "" },
    motivationLetter: { type: String, required: true },
    additionalAnswers: {
      experienceLevel: { type: String, required: true },
      availability: { type: String, required: true },
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
applicationSchema.index({ userId: 1, roleId: 1 }, { unique: true });

export type ApplicationDocument = InferSchemaType<typeof applicationSchema>;

export const ApplicationModel =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);
