import { BaseService } from "../../shared/base.service";
import { BaseUser, InternalUser } from "../../../types/user";
import ErrorResponse from "../../../utils/errorResponse";
import { ObjectId, QueryFilter } from "../../shared/model.repository";
import { genSalt, hash, compare } from "bcryptjs";

class UserService extends BaseService<InternalUser> {
  private _ensure_passwords = async (password?: string | string[]) => {
    const errMsg = `[UserService - _ensure_passwords] Invalid password provided`;
    if (!password || password?.length < 1) throw new ErrorResponse(errMsg);

    const pwd = typeof password === "string" ? [password] : password;
    const exists = pwd.every((p) => Boolean(p?.trim()));

    if (!exists) throw new ErrorResponse(errMsg);
  };

  encrypt_password = async (user: InternalUser): Promise<InternalUser> => {
    this._ensure_passwords(user.password!);

    const salt = await genSalt(10);
    const encrypted = await hash(user.password!, salt);
    user.password = encrypted;

    return user;
  };

  match_password = async (
    password: string,
    user: InternalUser,
  ): Promise<Boolean> => {
    this._ensure_passwords([password, user.password!]);
    const isMatch = await compare(password, user.password!);
    return isMatch;
  };

  create = async (
    payload: InternalUser,
    user?: BaseUser,
  ): Promise<InternalUser> => {
    payload = await this.encrypt_password(payload);

    return await super.create(payload, user);
  };

  update = async (
    payload: Partial<InternalUser>,
    id?: ObjectId | string,
    filter?: QueryFilter<InternalUser>,
    upsert?: boolean,
    user?: BaseUser,
  ): Promise<InternalUser> => {
    if (payload.password)
      payload = await this.encrypt_password(payload as InternalUser);

    return await super.update(payload, id, filter, upsert, user);
  };
}

export default UserService;
