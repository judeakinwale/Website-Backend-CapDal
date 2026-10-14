import mongoose from "mongoose";

// export const updateOptions: mongoose.QueryOptions = { new: true, runValidators: true };
// export const upsertOptions: mongoose.QueryOptions = { ...updateOptions, upsert: true };
export const timestampOptions = { timestamps: true };

export const actorSchemaSnippet = {
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
};

export const baseSchemaSnippet = {
  title: { type: String },
  value: { type: String },
  order: { type: String },
  isActive: { type: Boolean, default: true },
};
