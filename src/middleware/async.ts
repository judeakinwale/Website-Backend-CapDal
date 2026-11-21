import type { Request, Response, NextFunction } from "express";

const asyncHandler =
  <T = void>(fn: (...args: any) => any) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next) as Promise<T>;

export default asyncHandler;
