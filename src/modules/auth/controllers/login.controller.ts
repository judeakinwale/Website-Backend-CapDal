import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../../../middleware/async";
import { BaseController } from "../../shared/base.controller";
import { userService } from "../../cms/dependencies/user.dependencies";
import ErrorResponse from "../../../utils/errorResponse";
import { ensureAuthenticatedUser } from "../guards/login.guard";
import { LoginService } from "../services/login.service";

export class LoginController {
  constructor(private service: LoginService) {}

  login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      // request: LoginRequest;
      const user = BaseController.parseUserFromRes(res);
    },
  );

  logout = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      res.locals.user = undefined;
    },
  );

  me = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const resp = await ensureAuthenticatedUser(req, res, next);
    res.status(200).json(resp);
  });
}
