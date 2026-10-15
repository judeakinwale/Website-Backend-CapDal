import mongoose from "mongoose";
import { actorSchemaSnippet, baseSchemaSnippet, timestampOptions } from "../../../utils/mongoose.utils";
import { ContactInfo, ContactInfoType } from "../types/contact";

const contactInfoSchema = new mongoose.Schema<ContactInfo>(
  {
    ...baseSchemaSnippet,
    type: { type: String, enum: Object.values(ContactInfoType), required: true },
    ...actorSchemaSnippet,
  },
  timestampOptions,
);

contactInfoSchema.index({ title: "text", type: "text" });
contactInfoSchema.index({ type: 1, updatedAt: -1 });

export const MContactInfo = mongoose.model<ContactInfo>("ContactInfo", contactInfoSchema);
