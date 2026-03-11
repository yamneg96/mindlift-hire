import mongoose, { Schema, type InferSchemaType } from "mongoose";

const roleSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    imageUrl: { type: String, default: "" },
    requiredSkills: { type: [String], default: [] },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    maxApplicants: { type: Number, default: 100 },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: false },
    createdByEmail: { type: String, trim: true, lowercase: true },
  },
  { timestamps: true },
);

roleSchema.index({ status: 1, createdAt: -1 });

export type RoleDocument = InferSchemaType<typeof roleSchema>;

export const RoleModel =
  mongoose.models.Role || mongoose.model("Role", roleSchema);
