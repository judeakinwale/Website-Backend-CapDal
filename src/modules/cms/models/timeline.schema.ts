import mongoose from "mongoose";
import {
  actorSchemaSnippet,
  baseSchemaSnippet,
  schemaOptions,
} from "../../../utils/mongoose.utils";
import { Timeline } from "../types/timeline";

const timelineSchema = new mongoose.Schema<Timeline>(
  {
    ...baseSchemaSnippet,
    icon: String,
    year: { type: String, required: true },
    content: { type: String, required: true },
    ...actorSchemaSnippet,
  },
  schemaOptions,
);

timelineSchema.index({ title: "text", content: "text", year: "text" });
timelineSchema.index({ updatedAt: -1 });

export const MTimeline = mongoose.model<Timeline>("Timeline", timelineSchema);
