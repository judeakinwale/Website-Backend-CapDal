import mongoose from "mongoose";
import { actorSchemaSnippet, baseSchemaSnippet, timestampOptions } from "../../../utils/mongoose.utils";
import { News } from "../types/news";

const newsSchema = new mongoose.Schema<News>(
  {
    ...baseSchemaSnippet,
    image: { type: String, required: true },
    body: { type: String, required: true },
    category: String,
    tag: String,
    publishedAt: Date,
    ...actorSchemaSnippet,
  },
  timestampOptions,
);

newsSchema.index({ title: "text", body: "text", category: "text", tag: "text" });
newsSchema.index({ publishedAt: -1, updatedAt: -1 });

export const MNews = mongoose.model<News>("News", newsSchema);
