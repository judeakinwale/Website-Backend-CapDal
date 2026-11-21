import { userService } from "../../cms/dependencies/user.dependencies";
import { PopulateOptions } from "../../shared/model.repository";
import JWTService from "../services/jwt.service";
import OTPService from "../services/otp.service";
import type { TokenKeys, TokenExpiryKeys } from "../services/otp.service";

export const populate: PopulateOptions[] = [
  {
    path: "createdBy",
    populate: { path: "name email" },
  },
];

export const jwtService = new JWTService();

// TODO: import these and uncomment
// export const loginService = new LoginService(userRepo);
// export const loginController = new LoginController(loginService);

// export const registerService = new RegisterService(userRepo);
// export const registerController = new RegisterController(loginService);

export const getOTPService = (
  key: TokenKeys,
  expiresInSecs: number,
  expiresAtKey?: TokenExpiryKeys,
) => new OTPService(userService, key, expiresInSecs, expiresAtKey);
