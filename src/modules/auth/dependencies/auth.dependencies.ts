import { MUser } from "../../cms/models/user.schema";
import UserRepository from "../../cms/repositories/user.repository";
import UserService from "../../cms/services/user.service";
import { PopulateOptions } from "../../shared/model.repository";
import { LoginController } from "../controllers/login.controller";
import JWTService from "../services/jwt.service";
import { LoginService } from "../services/login.service";
import OTPService from "../services/otp.service";
import type { TokenKeys, TokenExpiryKeys } from "../services/otp.service";

export const populate: PopulateOptions[] = [
  {
    path: "createdBy",
    populate: { path: "name email" },
  },
];

export const getOTPService = (
  key: TokenKeys,
  expiresInSecs: number,
  expiresAtKey?: TokenExpiryKeys,
) => new OTPService(userService, key, expiresInSecs, expiresAtKey);

export const jwtService = new JWTService();

export const userRepo = new UserRepository(MUser, undefined, populate);
export const userService = new UserService(userRepo);
export const loginOtpService = new OTPService(userService, "loginToken");

// TODO: import these and uncomment
export const loginService = new LoginService(
  userService,
  jwtService,
  loginOtpService,
);
export const loginController = new LoginController(loginService);

// export const registerService = new RegisterService(userRepo);
// export const registerController = new RegisterController(loginService);
