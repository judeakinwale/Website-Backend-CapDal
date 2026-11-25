import type { Request, Response, NextFunction } from "express";
import {
  LoginRequest,
  LoginResponse,
  VerifyOTPRequest,
} from "../dto/login.dto";
import { BaseUser, InternalUser } from "../../../types/user";
import UserService from "../../cms/services/user.service";
import ErrorResponse from "../../../utils/errorResponse";
import JWTService from "./jwt.service";
import OTPService from "./otp.service";

export class LoginService {
  name: string = "Login Service";
  userService: UserService;
  jwt: JWTService;

  constructor(
    userService: UserService,
    jwt: JWTService,
    private otp: OTPService<InternalUser>,
  ) {
    this.userService = userService;
    this.jwt = jwt;
  }

  ensureUser = async (req: Request) => {
    const tokenUser = await this.jwt.getTokenUser(req, true);
    if (!tokenUser.id) {
      const errMsg = `[${this.name}] Invalid token details; please login again`;
      throw new ErrorResponse(errMsg, 401);
    }

    const user = await this.userService.findOne(tokenUser.id);
    if (!user)
      throw new ErrorResponse(`[${this.name}] Valid User not found!`, 400);

    return user;
  };

  generateLoginResponse = async (user: BaseUser) => {
    const token = await this.jwt.generateToken(user);
    if (!token)
      throw new ErrorResponse(`[${this.name}] Failed to generate token!`, 400);

    const decoded = this.jwt.decodeToken(token);

    const loginData: LoginResponse = {
      ...user,
      token,
      tokenExpiresAt: decoded.exp ? decoded.exp * 1000 : undefined,
    };

    return loginData;
  };

  login = async (payload: LoginRequest): Promise<LoginResponse> => {
    const { email, password } = payload;
    const user = await this.userService.findOne(undefined, { email });
    if (!user) throw new ErrorResponse(`[${this.name}] User not found!`, 400);

    const isMatch = await this.userService.matchPassword(password, user);
    if (!isMatch)
      throw new ErrorResponse(`[${this.name}] Invalid credentials!`, 400);

    // TODO: implement this
    // ? handle 2fa with otp, if user has it configured, providing an early return using
    // return await this.send_otp(user as BaseUser)

    const loginData = await this.generateLoginResponse(user as BaseUser);

    return loginData;
  };

  logout = async (res: Response): Promise<void> => {
    // remove all stored references to the user
    res.locals.user = undefined;

    return;
  };

  // -----
  sendOTP = async (user: BaseUser): Promise<void> => {
    await this.otp.requestToken(user.id);

    return;
  };

  verifyOTP = async (payload: VerifyOTPRequest) => {
    const { email, token } = payload;
    const dbUser = await this.userService.findOne(undefined, { email });
    const user = dbUser as BaseUser;

    const isMatch = this.otp.verifyToken(token, user);
    if (!isMatch)
      throw new ErrorResponse(`[Token Validation] Invalid token provided`, 400);

    await this.otp.invalidateToken(user.id);
    const loginData = await this.generateLoginResponse(user);

    return loginData;
  };
  // ------
}
