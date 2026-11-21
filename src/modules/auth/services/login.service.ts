import mongoose from "mongoose";
import { LoginRequest, LoginResponse } from "../dto/login.dto";
import { BaseUser } from "../../../types/user";
import { APIResponse } from "../../shared/base.dto";
import { BaseService } from "../../shared/base.service";
import { updateDocMetadata } from "../../../utils/audit.utils";
import UserRepository from "../../cms/repositories/user.repository";
import UserService from "../../cms/services/user.service";
import ErrorResponse from "../../../utils/errorResponse";
import JWTService from "./jwt.service";

export class LoginService {
  //   private repo: ModelRepository<T>;
  name: string = "Login Service";

  constructor(
    // private userRepo: UserRepository,
    private userService: UserService,
    private jwt: JWTService,
  ) {}

  login = async (
    payload: LoginRequest,
  ): Promise<APIResponse<LoginResponse>> => {
    const query = { email: payload.email };
    const { data: user } = await this.userService.findOne(undefined, query);
    if (!user) throw new ErrorResponse(`[${this.name}] User not found!`, 400);

    // const isMatch = await this.userService.match_password(payload.password);
    // if (!isMatch)
    //   throw new ErrorResponse(`[${this.name}] Invalid credentials!`, 400);

    const token = await this.jwt.generateToken(user as BaseUser);
    if (!token)
      throw new ErrorResponse(`[${this.name}] Failed to generate token!`, 400);

    const decoded = this.jwt.decodeToken(token);

    const loginData: LoginResponse = {
      ...user,
      token,
      tokenExpiresAt: decoded.exp ? decoded.exp * 1000 : undefined,
    };

    const response: APIResponse = {
      success: true,
      data: loginData,
    };
    return response;
  };

  logout = async (user?: BaseUser): Promise<APIResponse> => {
    const response: APIResponse = {
      success: true,
      data: "updated",
    };
    return response;
  };
}
