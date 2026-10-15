import mongoose from "mongoose";
import { actorSchemaSnippet, baseSchemaSnippet, timestampOptions } from "../../../utils/mongoose.utils";
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
  timestampOptions,
);

directorSchema.index({ name: "text", title: "text", summary: "text" });
directorSchema.index({ updatedAt: -1 });

export const MDirector = mongoose.model<Director>("Director", directorSchema);
