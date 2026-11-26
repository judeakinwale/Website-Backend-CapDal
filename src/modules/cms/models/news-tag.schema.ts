import mongoose from "mongoose";
import {
  actorSchemaSnippet,
  baseSchemaSnippet,
  schemaOptions,
} from "../../../utils/mongoose.utils";
import { NewsTag } from "../types/news";

const newsTagSchema = new mongoose.Schema<NewsTag>(
  { ...baseSchemaSnippet, ...actorSchemaSnippet },
  schemaOptions,
);

newsTagSchema.index({ title: "text" });
newsTagSchema.index({ updatedAt: -1 });

export const MNewsTag = mongoose.model<NewsTag>("NewsTag", newsTagSchema);
