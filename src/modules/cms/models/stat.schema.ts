import mongoose from "mongoose";
import { actorSchemaSnippet, baseSchemaSnippet, timestampOptions } from "../../../utils/mongoose.utils";
import { Stat, StatSection } from "../types/stat";

const statSchema = new mongoose.Schema<Stat>(
  {
    ...baseSchemaSnippet,
    value: { type: String, required: true },
    section: { type: String, enum: Object.values(StatSection) },
    ...actorSchemaSnippet,
  },
  timestampOptions,
);

statSchema.index({ title: "text", value: "text" });
statSchema.index({ section: 1, updatedAt: -1 });

export const MStat = mongoose.model<Stat>("Stat", statSchema);
