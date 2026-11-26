import { BaseService } from "../../shared/base.service";
import { BaseUser, InternalUser } from "../../../types/user";
import ErrorResponse from "../../../utils/errorResponse";
import {
  DocInstance,
  ObjectId,
  QueryFilter,
  UpdateQuery,
} from "../../shared/model.repository";
import { genSalt, hash, compare } from "bcryptjs";

class UserService extends BaseService<InternalUser> {
  name: string = "User Service";
  entityName: string = "User";

  private _ensurePasswords = (
    password?: string | string[],
    minLength: number = 5,
  ) => {
    const errMsg = `[${this.name}] Invalid password(s) provided`;
    if (!password || password?.length < 1) throw new ErrorResponse(errMsg);

    const pwd = typeof password === "string" ? [password] : password;
    const exists = pwd.every((p) => Boolean(p) && p.length >= minLength); // ?.trim() - trimming seems dumb
    if (!exists) throw new ErrorResponse(errMsg);
  };

  private _encryptPassword = async (password: string): Promise<string> => {
    this._ensurePasswords(password);

    const encrypted = await hash(password, 10);
    return encrypted;
  };

  matchPassword = async (
    password: string,
    user: InternalUser,
  ): Promise<boolean> => {
    this._ensurePasswords([password, user.password!]);
    const isMatch = await compare(password, user.password!);
    return isMatch;
  };

  create = async (
    payload: InternalUser,
    user?: BaseUser,
  ): Promise<DocInstance<InternalUser>> => {
    payload.password = await this._encryptPassword(payload.password!);

    return super.create(payload, user);
  };

  update = async (
    payload: UpdateQuery<BaseUser>,
    id?: ObjectId | string,
    filter?: QueryFilter<InternalUser>,
    upsert?: boolean,
    user?: BaseUser,
  ): Promise<DocInstance<InternalUser>> => {
    if (payload?.password) {
      // delete payload.password;
      const errMsg = `[${this.name}] Use updatePassword() to update passwords`;
      throw new ErrorResponse(errMsg, 400);
    }

    return super.update(payload, id, filter, upsert, user);
  };

  updatePassword = async (
    payload: UpdateQuery<InternalUser>,
    id?: ObjectId | string,
    filter?: QueryFilter<InternalUser>,
    upsert?: boolean,
    user?: BaseUser,
  ): Promise<DocInstance<InternalUser>> => {
    if (payload.password) {
      const pwdUser = await this.findOne(id, filter);
      const isMatch = await this.matchPassword(payload.password, pwdUser);

      if (!isMatch)
        payload.password = await this._encryptPassword(payload.password);
    }
    return super.updateWithSave(payload, id, filter, upsert, user);
  };
}

export default UserService;
