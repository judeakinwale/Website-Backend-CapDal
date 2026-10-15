import mongoose from "mongoose";
import { actorSchemaSnippet, baseSchemaSnippet, timestampOptions } from "../../../utils/mongoose.utils";
import { Project } from "../types/project";

const projectSchema = new mongoose.Schema<Project>(
  {
    ...baseSchemaSnippet,
    image: { type: String, required: true },
    description: String,
    category: String,
    blurb: String,
    location: String,
    isFeatured: { type: Boolean, default: false },
    completedAt: Date,
    ...actorSchemaSnippet,
  },
  timestampOptions,
);

projectSchema.index({ title: "text", description: "text", category: "text", location: "text" });
projectSchema.index({ isFeatured: 1, updatedAt: -1 });

export const MProject = mongoose.model<Project>("Project", projectSchema);
