
import ErrorResponse from "../utils/errorResponse";
import { Error as MongooseErrorNS } from "mongoose";
import { formatObjectAsString } from "./fmt.object";

export const normalizeMongooseError = (err: MongooseErrorNS): ErrorResponse => {
  // they tend to have errors and or reason
  const reason = (err as MongooseErrorNS.CastError)?.reason;
  const baseMsg = `${err.name}: ${reason?.message || reason || err.message}`;

  let message: string;
  let statusCode = 500;
  let errors: any;
  let errorsStr: string;

  switch (err.name) {
    case "CastError":
    case "DocumentNotFoundError":
      message = `Resource not found - ${baseMsg}`;
      statusCode = 404;
      break;

    case "MongooseBulkSaveIncompleteError":
      message = `Error saving documents - ${baseMsg}`;
      statusCode = 400;

    case "ValidationError":
      errors = (err as MongooseErrorNS.ValidationError).errors;
      errorsStr = formatObjectAsString(errors);
      message = `${baseMsg} => ${errorsStr}`;
      statusCode = 400;
      break;

    case "ValidatorError":
      message = `${baseMsg}`;
      statusCode = 400;
      break;

    case "SyncIndexesError":
      errors = (err as MongooseErrorNS.SyncIndexesError).errors;
      errorsStr = formatObjectAsString(errors);
      message = `${baseMsg} => ${errorsStr}`;
      statusCode = 400;
      break;

    case "DivergentArrayError":
    case "ObjectExpectedError":
      message = `Bad Request - ${baseMsg}`;
      statusCode = 400;

    case "MissingSchemaError":
    case "MongooseServerSelectionError":
    case "ObjectParameterError":
      message = `${baseMsg}`;
      statusCode = 500;
      break;

    case "OverwriteModelError":
    case "ParallelSaveError":
    case "ParallelValidateError":
    case "StrictModeError":
    case "StrictPopulateError":
      message = `${baseMsg}`;
      statusCode = 400;
      break;

    case "VersionError":
      message = `${baseMsg}`;
      statusCode = 500;
      break;

    default:
      message ||= "Server Error";
      statusCode = 500;
      break;
  }

  let error = new ErrorResponse(message, statusCode);

  // //Mongoose bad objectid
  // if (err.name === "CastError") {
  //   const message = `Resource not found`;
  //   error = new ErrorResponse(message, 404);
  // }

  // //mongoose duplicate key
  // if (err.code === 11000) {
  //   const message = "Duplcate Field Entered";
  //   error = new ErrorResponse(message, 400);
  // }

  // //Mongoose validation error
  // if (err.name === "ValidationError") {
  //   const message = Object.values(err.errors).map((val) => val.message);
  //   error = new ErrorResponse(message, 400);
  // }

  return error;
};