import mongoose from "mongoose";
import { actorSchemaSnippet, baseSchemaSnippet, timestampOptions } from "../../../utils/mongoose.utils";
import { ProjectCategory } from "../types/project";

const projectCategorySchema = new mongoose.Schema<ProjectCategory>(
  { ...baseSchemaSnippet, ...actorSchemaSnippet },
  timestampOptions,
);

projectCategorySchema.index({ title: "text" });
projectCategorySchema.index({ updatedAt: -1 });

export const MProjectCategory = mongoose.model<ProjectCategory>("ProjectCategory", projectCategorySchema);
