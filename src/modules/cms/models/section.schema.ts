import mongoose from "mongoose";
import { actorSchemaSnippet, baseSchemaSnippet, timestampOptions } from "../../../utils/mongoose.utils";
import { Section, SiteSections } from "../types/section";

const sectionSchema = new mongoose.Schema<Section>(
  {
    ...baseSchemaSnippet,
    section: { type: String, enum: Object.values(SiteSections), required: true },
    subTitle: String,
    content: String,
    blurb: String,
    images: [{ title: String, url: { type: String, required: true }, description: String, order: Number }],
    links: [{ title: String, url: { type: String, required: true }, description: String, order: Number }],
    bulletPoints: [{ title: { type: String, required: true }, description: String, icon: String, order: Number }],
    ...actorSchemaSnippet,
  },
  timestampOptions,
);

sectionSchema.index({ title: "text", section: "text", content: "text" });
sectionSchema.index({ section: 1, updatedAt: -1 });

export const MSection = mongoose.model<Section>("Section", sectionSchema);
