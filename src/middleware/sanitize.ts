import type { Request, Response, NextFunction } from "express";
import mongoSanitize from "express-mongo-sanitize";

const sanitize = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) mongoSanitize.sanitize(req.body);
  if (req.params) mongoSanitize.sanitize(req.params);
  if (req.headers) mongoSanitize.sanitize(req.headers);
  if (req.query) mongoSanitize.sanitize(req.query);
  next();
};

export default sanitize;
