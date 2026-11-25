import type { Request, Response, NextFunction } from "express";
import asyncHandler from "./async";
import { BaseUser, UserRole } from "../types/user";
import ErrorResponse from "../utils/errorResponse";
import { jwtService } from "../modules/auth/dependencies/auth.dependencies";

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await jwtService.getTokenUser(req);
      res.locals.user = user;
    } catch (error) {
      throw new ErrorResponse(`[Auth Middleware] Not authorized -> ${error}`);
    }

    next();
  },
);

export const authorize =
  (...roles: UserRole[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const user: BaseUser = res.locals.user;
    if (!user)
      throw new ErrorResponse(
        `[Auth Middleware] User not found, ensure the route is protected.`,
        500,
      );

    const isAuthorized = roles?.every((r) => user.roles.includes(r));
    if (!isAuthorized)
      throw new ErrorResponse(
        `[Auth Middleware] You are not authorized to perform this action.`,
        403,
      );

    next();
  };
