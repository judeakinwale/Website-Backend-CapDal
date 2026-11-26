import mongoose from "mongoose";
import {
  actorSchemaSnippet,
  baseSchemaSnippet,
  schemaOptions,
} from "../../../utils/mongoose.utils";
import { Director } from "../types/director";

const directorSchema = new mongoose.Schema<Director>(
  {
    ...baseSchemaSnippet,
    name: { type: String, required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    summary: String,
    link: String,
    ...actorSchemaSnippet,
  },
  schemaOptions,
);

directorSchema.index({ name: "text", title: "text", summary: "text" });
directorSchema.index({ updatedAt: -1 });

export const MDirector = mongoose.model<Director>("Director", directorSchema);
