import mongoose from "mongoose";
import {
  actorSchemaSnippet,
  baseSchemaSnippet,
  timestampOptions,
} from "../../../utils/mongoose.utils";
import { Certificate } from "../types/certificate";

const certificateSchema = new mongoose.Schema<Certificate>(
  {
    ...baseSchemaSnippet,
    ...actorSchemaSnippet,
  },
  timestampOptions,
);

certificateSchema.index({ value: "text" });
certificateSchema.index({ updatedAt: -1 });

export const MCertificate = mongoose.model<Certificate>(
  "Certificate",
  certificateSchema,
);
