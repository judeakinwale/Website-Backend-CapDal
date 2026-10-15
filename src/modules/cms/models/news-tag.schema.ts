import mongoose from "mongoose";
import { actorSchemaSnippet, baseSchemaSnippet, timestampOptions } from "../../../utils/mongoose.utils";
import { NewsTag } from "../types/news";

const newsTagSchema = new mongoose.Schema<NewsTag>(
  { ...baseSchemaSnippet, ...actorSchemaSnippet },
  timestampOptions,
);

newsTagSchema.index({ title: "text" });
newsTagSchema.index({ updatedAt: -1 });

export const MNewsTag = mongoose.model<NewsTag>("NewsTag", newsTagSchema);
