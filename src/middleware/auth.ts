import type { Request, Response, NextFunction } from "express";
import asyncHandler from "./async";
import { BaseUser, UserRole } from "../types/user";
import ErrorResponse from "../utils/errorResponse";
import { jwtVerify } from "jose";
import { Settings } from "../config/settings";

const getToken = (req: Request): string => {
  const bearerToken = req.headers.authorization;
  const isBearerToken = bearerToken?.startsWith("Bearer");
  if (!bearerToken || !isBearerToken)
    throw new ErrorResponse(`[Auth] Invalid token provided`);

  const token = bearerToken?.split(" ")[1];
  if (!token) throw new ErrorResponse(`[Auth] Not authorized`);

  return token;
};

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = getToken(req);

    // // using jsonwebtoken
    // const decoded = jwt.verify(token, Settings.JWT_SECRET)

    try {
      // convert JWT_SECRET string to Uint8Array
      const secretKey = new TextEncoder().encode(Settings.JWT_SECRET);
      const decoded = await jwtVerify<BaseUser>(token, secretKey);

      res.locals.user = decoded; // for express 5; immutable req
    } catch (error) {
      throw new ErrorResponse(`[Auth] Not authorized`);
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
        `[Auth Middleware] User not found, Ensure the route is protected.`,
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
