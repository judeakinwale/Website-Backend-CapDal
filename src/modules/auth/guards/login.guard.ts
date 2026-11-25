import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../../../middleware/async";
import { loginService } from "../dependencies/auth.dependencies";

export const ensureAuthenticatedUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await loginService.ensureUser(req);
    return user;

    // next(); // ? incase this is used as a middleware later
  },
);
