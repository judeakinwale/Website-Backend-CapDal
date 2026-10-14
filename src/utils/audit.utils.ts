import mongoose from "mongoose";
import ErrorResponse from "./errorResponse";
import { DefaultItem } from "../types/default";

export const updateDocMetadata = <T extends DefaultItem>(
  data: T,
  userId?: mongoose.Types.ObjectId,
  isUpdate: boolean = false,
  timestamp: string = new Date().toISOString(),
  defaultActiveState = false,
): T => {
  if (!data)
    throw new ErrorResponse("[updateDocMetadata] Invalid doc provided");

  if (isUpdate) {
    if (userId) data.updatedBy ||= userId;
    data.updatedAt ||= timestamp;
  } else {
    if (userId) data.createdBy ||= userId;
    data.createdAt ||= timestamp;

    data.isActive ||= defaultActiveState;
  }
  return data;
};
