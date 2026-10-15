import mongoose from "mongoose";
import { actorSchemaSnippet, baseSchemaSnippet, timestampOptions } from "../../../utils/mongoose.utils";
import { NavLink, NavLinkContentDisplay } from "../types/links";

const navLinkSchema = new mongoose.Schema<NavLink>(
  {
    ...baseSchemaSnippet,
    href: String,
    description: String,
    subLinks: [mongoose.Schema.Types.Mixed],
    contentDisplay: { type: String, enum: Object.values(NavLinkContentDisplay) },
    ...actorSchemaSnippet,
  },
  timestampOptions,
);

navLinkSchema.index({ title: "text", description: "text" });
navLinkSchema.index({ order: 1, updatedAt: -1 });

export const MNavLink = mongoose.model<NavLink>("NavLink", navLinkSchema);
