import mongoose from "mongoose";
import {
  actorSchemaSnippet,
  baseSchemaSnippet,
  timestampOptions,
} from "../../../utils/mongoose.utils";
import { InternalUser, UserRole } from "../../../types/user";

const userSchema = new mongoose.Schema<InternalUser>(
  {
    ...baseSchemaSnippet,
    name: { type: String, required: [true, "Provide a name"] },
    email: {
      type: String,
      required: [true, "Provide an email"],
      lowercase: true,
      trim: true,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Provide a password"],
      select: false,
    },
    roles: {
      type: [String],
      enum: Object.values(UserRole),
      default: [UserRole.User],
    },
    imageUrl: { type: String },
    ...actorSchemaSnippet,
  },
  timestampOptions,
);

userSchema.index({ name: "text", email: "text" });
userSchema.index({ roles: 1, updatedAt: -1 });
userSchema.index({ updatedAt: -1 });

export const MUser = mongoose.model<InternalUser>("User", userSchema);
