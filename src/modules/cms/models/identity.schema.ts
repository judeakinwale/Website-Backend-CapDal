import mongoose from "mongoose";
import {
  actorSchemaSnippet,
  baseSchemaSnippet,
  schemaOptions,
} from "../../../utils/mongoose.utils";
import { Identity, IdentityType } from "../types/identity";

const identitySchema = new mongoose.Schema<Identity>(
  {
    ...baseSchemaSnippet,
    type: { type: String, enum: Object.values(IdentityType), required: true },
    icon: String,
    content: { type: String, required: true },
    ...actorSchemaSnippet,
  },
  schemaOptions,
);

identitySchema.index({ title: "text", content: "text" });
identitySchema.index({ updatedAt: -1 });

export const MIdentity = mongoose.model<Identity>("Identity", identitySchema);
