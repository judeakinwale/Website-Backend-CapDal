import type { Request, Response, NextFunction } from "express";
import ErrorResponse from "../utils/errorResponse";
import { Error as MongooseErrorNS } from "mongoose";
import { isDevEnv } from "../config/settings";
import { normalizeMongooseError } from "../utils/mongoose.error";

const errorHandler = (
  err: Error | MongooseErrorNS,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let error = new ErrorResponse(err.message, 500, { cause: err });

  // log to console for dev
  if (isDevEnv) console.log(err);

  if (err instanceof MongooseErrorNS) {
    error = normalizeMongooseError(err);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

export default errorHandler;
