import mongoose from "mongoose";
import {
  actorSchemaSnippet,
  baseSchemaSnippet,
  schemaOptions,
} from "../../../utils/mongoose.utils";
import { ProjectCategory } from "../types/project";

const projectCategorySchema = new mongoose.Schema<ProjectCategory>(
  { ...baseSchemaSnippet, ...actorSchemaSnippet },
  schemaOptions,
);

projectCategorySchema.index({ title: "text" });
projectCategorySchema.index({ updatedAt: -1 });

export const MProjectCategory = mongoose.model<ProjectCategory>(
  "ProjectCategory",
  projectCategorySchema,
);
