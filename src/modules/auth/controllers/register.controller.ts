import type { Request, Response, NextFunction } from "express";
import asyncHandler from "../../../middleware/async";
import { RegisterService } from "../services/register.service";
import { APIResponse } from "../../shared/base.dto";

export class RegisterController {
  constructor(private service: RegisterService) {}

  register = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const registerData = await this.service.register(req.body);

      const resp: APIResponse = {
        success: true,
        data: registerData,
      };
      res.status(200).json(resp);
    },
  );

  forgotPassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const isNotified = await this.service.forgotPassword(req.body);

      const resp: APIResponse = {
        success: true,
        message: "Confirmation notification sent!",
      };
      res.status(200).json(resp);
    },
  );

  resetPassword = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const resetData = await this.service.resetPassword(req.body);

      const resp: APIResponse = {
        success: true,
        data: resetData,
        message: "Password reset Successful",
      };
      res.status(200).json(resp);
    },
  );

  requestActivationOTP = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const requestData = await this.service.requestActivationOTP(req.body);

      const resp: APIResponse = {
        success: true,
        data: requestData,
      };
      res.status(200).json(resp);
    },
  );

  verifyActivationOTP = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const verifyData = await this.service.verifyActivationOTP(req.body);

      const resp: APIResponse = {
        success: true,
        data: verifyData,
      };
      res.status(200).json(resp);
    },
  );
}
