import { BaseService } from "../../shared/base.service";
import { BaseUser, InternalUser } from "../../../types/user";
import ErrorResponse from "../../../utils/errorResponse";
import {
  ObjectId,
  QueryFilter,
  UpdateQuery,
} from "../../shared/model.repository";
import { genSalt, hash, compare } from "bcryptjs";

class UserService extends BaseService<InternalUser> {
  name: string = "User Service";
  entityName: string = "User";

  private _ensurePasswords = async (password?: string | string[]) => {
    const errMsg = `[UserService - _ensurePasswords] Invalid password provided`;
    if (!password || password?.length < 1) throw new ErrorResponse(errMsg);

    const pwd = typeof password === "string" ? [password] : password;
    const exists = pwd.every((p) => Boolean(p?.trim()));

    if (!exists) throw new ErrorResponse(errMsg);
  };

  encryptPassword = async (user: InternalUser): Promise<InternalUser> => {
    this._ensurePasswords(user.password!);

    const salt = await genSalt(10);
    const encrypted = await hash(user.password!, salt);
    user.password = encrypted;

    return user;
  };

  matchPassword = async (
    password: string,
    user: InternalUser,
  ): Promise<Boolean> => {
    this._ensurePasswords([password, user.password!]);
    const isMatch = await compare(password, user.password!);
    return isMatch;
  };

  create = async (
    payload: InternalUser,
    user?: BaseUser,
  ): Promise<InternalUser> => {
    payload = await this.encryptPassword(payload);

    return await super.create(payload, user);
  };

  update = async (
    payload: UpdateQuery<InternalUser>,
    id?: ObjectId | string,
    filter?: QueryFilter<InternalUser>,
    upsert?: boolean,
    user?: BaseUser,
  ): Promise<InternalUser> => {
    if (payload.password)
      payload = await this.encryptPassword(payload as InternalUser);

    return await super.update(payload, id, filter, upsert, user);
  };
}

export default UserService;
