import mongoose, { Schema, type InferSchemaType } from "mongoose";

const adminNoteSchema = new Schema(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    adminId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    note: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

adminNoteSchema.index({ applicationId: 1, createdAt: -1 });

export type AdminNoteDocument = InferSchemaType<typeof adminNoteSchema>;

export const AdminNoteModel =
  mongoose.models.AdminNote || mongoose.model("AdminNote", adminNoteSchema);
