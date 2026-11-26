import mongoose from "mongoose";
import {
  actorSchemaSnippet,
  baseSchemaSnippet,
  schemaOptions,
} from "../../../utils/mongoose.utils";
import { NewsCategory } from "../types/news";

const newsCategorySchema = new mongoose.Schema<NewsCategory>(
  { ...baseSchemaSnippet, ...actorSchemaSnippet },
  schemaOptions,
);

newsCategorySchema.index({ title: "text" });
newsCategorySchema.index({ updatedAt: -1 });

export const MNewsCategory = mongoose.model<NewsCategory>(
  "NewsCategory",
  newsCategorySchema,
);
