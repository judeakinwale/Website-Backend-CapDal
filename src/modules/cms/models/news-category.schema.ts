import mongoose from "mongoose";
import { actorSchemaSnippet, baseSchemaSnippet, timestampOptions } from "../../../utils/mongoose.utils";
import { NewsCategory } from "../types/news";

const newsCategorySchema = new mongoose.Schema<NewsCategory>(
  { ...baseSchemaSnippet, ...actorSchemaSnippet },
  timestampOptions,
);

newsCategorySchema.index({ title: "text" });
newsCategorySchema.index({ updatedAt: -1 });

export const MNewsCategory = mongoose.model<NewsCategory>("NewsCategory", newsCategorySchema);
