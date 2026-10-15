import mongoose from "mongoose";
import { actorSchemaSnippet, baseSchemaSnippet, timestampOptions } from "../../../utils/mongoose.utils";
import { SocialLink } from "../types/links";

const socialLinkSchema = new mongoose.Schema<SocialLink>(
  {
    ...baseSchemaSnippet,
    href: { type: String, required: true },
    ...actorSchemaSnippet,
  },
  timestampOptions,
);

socialLinkSchema.index({ title: "text", href: "text" });
socialLinkSchema.index({ updatedAt: -1 });

export const MSocialLink = mongoose.model<SocialLink>("SocialLink", socialLinkSchema);
