import mongoose from "mongoose";
import {
  actorSchemaSnippet,
  baseSchemaSnippet,
  schemaOptions,
} from "../../../utils/mongoose.utils";
import { SocialLink } from "../types/links";

const socialLinkSchema = new mongoose.Schema<SocialLink>(
  {
    ...baseSchemaSnippet,
    href: { type: String, required: true },
    ...actorSchemaSnippet,
  },
  schemaOptions,
);

socialLinkSchema.index({ title: "text", href: "text" });
socialLinkSchema.index({ updatedAt: -1 });

export const MSocialLink = mongoose.model<SocialLink>(
  "SocialLink",
  socialLinkSchema,
);
