import mongoose, { SchemaOptions } from "mongoose";

// export const updateOptions: mongoose.QueryOptions = { new: true, runValidators: true };
// export const upsertOptions: mongoose.QueryOptions = { ...updateOptions, upsert: true };

export const timestampOptions: SchemaOptions = { timestamps: true };
export const jsonOptions: SchemaOptions = {
  toJSON: { virtuals: true, getters: true, minimize: false },
  toObject: { virtuals: true, getters: true, minimize: false },
};
export const schemaOptions = { ...timestampOptions, ...jsonOptions };

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
