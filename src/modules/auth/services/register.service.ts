import mongoose from "mongoose";
import { RegisterRequest, RegisterResponse } from "../dto/register.dto";
import { BaseUser, InternalUser } from "../../../types/user";
import { APIResponse } from "../../shared/base.dto";
import { BaseService } from "../../shared/base.service";
import { updateDocMetadata } from "../../../utils/audit.utils";
import UserRepository from "../../cms/repositories/user.repository";
import { ModelRepository } from "../../shared/model.repository";
import ErrorResponse from "../../../utils/errorResponse";
import { DefaultItem } from "../../../types/default";

export class RegisterService {
  private repo: UserRepository;
  name: string = "Register Service";

  constructor(repo: UserRepository) {
    this.repo = repo;
  }

  register = async (
    payload: InternalUser,
    user?: BaseUser,
  ): Promise<APIResponse> => {
    const userId = user?.id ? BaseService.normalizeId(user?.id) : undefined;
    payload = updateDocMetadata(payload, userId, true);

    const registered = await this.repo.create(payload);
    if (!registered)
      throw new ErrorResponse(`[${this.name}] Error registering user!`, 400);

    // TODO: generate the token and refresh token
    const registerData: RegisterResponse = {
      ...registered,
      token: "",
      tokenExpiresAt: Date.now(),
    };

    const response: APIResponse = {
      success: true,
      data: registerData,
    };
    return response;
  };
}
