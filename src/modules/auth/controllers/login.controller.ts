import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../../../middleware/async";
import { LoginService } from "../services/login.service";
import { APIResponse } from "../../shared/base.dto";

export class LoginController {
  constructor(private service: LoginService) {}

  login = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const loginData = await this.service.login(req.body);

      const resp: APIResponse = {
        success: true,
        data: loginData,
      };
      res.status(200).json(resp);
    },
  );

  logout = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const isLoggedOut = await this.service.logout(res);

      const resp: APIResponse = {
        success: true,
        message: "Logout Successful",
      };
      res.status(200).json(resp);
    },
  );

  me = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const user = await this.service.ensureUser(req);

    const resp: APIResponse = {
      success: true,
      data: user,
    };
    res.status(200).json(resp);
  });

  verifyOTP = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const loginData = await this.service.verifyOTP(req.body);

      const resp: APIResponse = {
        success: true,
        data: loginData,
      };
      res.status(200).json(resp);
    },
  );
}
