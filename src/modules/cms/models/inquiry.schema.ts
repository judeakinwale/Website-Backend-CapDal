import mongoose from "mongoose";
import { actorSchemaSnippet, baseSchemaSnippet, timestampOptions } from "../../../utils/mongoose.utils";
import { Inquiry } from "../types/inquiry";

const inquirySchema = new mongoose.Schema<Inquiry>(
  {
    ...baseSchemaSnippet,
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    ...actorSchemaSnippet,
  },
  timestampOptions,
);

inquirySchema.index({ name: "text", email: "text", subject: "text", message: "text" });
inquirySchema.index({ updatedAt: -1 });

export const MInquiry = mongoose.model<Inquiry>("Inquiry", inquirySchema);
