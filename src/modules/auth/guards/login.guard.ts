import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../../../middleware/async";
import { BaseController } from "../../shared/base.controller";
import { userRepo } from "../../cms/dependencies/user.dependencies";
import ErrorResponse from "../../../utils/errorResponse";
import { BaseService } from "../../shared/base.service";

export const ensureAuthenticatedUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = BaseController.parseUserFromRes(res);
    if (!user?.id) {
      throw new ErrorResponse(
        `[Auth] Invalid user details; please login again`,
        401,
      );
    }

    const dbUser = await userRepo.findById(BaseService.normalizeId(user.id));
    if (!dbUser) {
      throw new ErrorResponse(
        `[Auth] Invalid user; please contact the admin`,
        404,
      );
    }
    return dbUser;

    // next(); // ? incase this is used as a middleware later
  },
);
