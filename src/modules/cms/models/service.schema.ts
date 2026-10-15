import mongoose from "mongoose";
import { actorSchemaSnippet, baseSchemaSnippet, timestampOptions } from "../../../utils/mongoose.utils";
import { Service } from "../types/service";

const serviceSchema = new mongoose.Schema<Service>(
  {
    ...baseSchemaSnippet,
    subTitle: String,
    images: [{ title: String, url: { type: String, required: true }, description: String, order: Number }],
    description: String,
    content: { type: String, required: true },
    links: [{ title: String, url: { type: String, required: true }, description: String, order: Number }],
    blurb: String,
    isCore: { type: Boolean, default: false },
    bulletPoints: [{ title: { type: String, required: true }, description: String, icon: String, order: Number }],
    ...actorSchemaSnippet,
  },
  timestampOptions,
);

serviceSchema.index({ title: "text", subTitle: "text", description: "text", content: "text" });
serviceSchema.index({ isCore: 1, updatedAt: -1 });

export const MService = mongoose.model<Service>("Service", serviceSchema);
