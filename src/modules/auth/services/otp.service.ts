import { randomBytes, randomInt } from "node:crypto";
import { BaseUser, InternalUser, User } from "../../../types/user";
import ErrorResponse from "../../../utils/errorResponse";
import UserService from "../../cms/services/user.service";
import { QueryFilter, UpdateQuery } from "../../shared/model.repository";

export type TokenKeys = "loginToken" | "activationToken" | "resetPasswordToken";
export type TokenExpiryKeys =
  | "loginTokenExpiresAt"
  | "activationTokenExpiresAt"
  | "resetPasswordTokenExpiresAt";

export enum TokenMode {
  "alphanumeric" = "alphanumeric",
  "numeric" = "numeric",
}

class OTPService<T extends User = InternalUser> {
  userService: UserService;
  tokenKey: TokenKeys;
  private tokenExpiresAtKey: TokenExpiryKeys;
  private tokenLength: number;
  private expiryMs: number;

  constructor(
    userService: UserService,
    tokenKey: TokenKeys,
    expirySeconds: number = 600, // 5min default
    tokenExpiresAtKey?: TokenExpiryKeys,
    tokenLength: number = 6,
  ) {
    this.userService = userService;
    this.expiryMs = expirySeconds * 1000;
    this.tokenKey = tokenKey;
    this.tokenExpiresAtKey = tokenExpiresAtKey || `${tokenKey}ExpiresAt`;
    this.tokenLength = tokenLength;
  }

  static generateToken = (
    length: number = 6,
    mode: TokenMode = TokenMode.alphanumeric,
  ): string => {
    let token: string;
    switch (mode) {
      case "numeric":
        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length) - 1;
        token = randomInt(min, max).toString().padStart(length, "0");
        break;
      default:
        token = randomBytes(length).toString("base64url"); // "hex"
        break;
    }

    return token;
  };

  // -----
  updatePayloadWithToken = (
    token: string,
    payload: UpdateQuery<T>,
  ): UpdateQuery<T> => {
    payload[this.tokenKey] = token;
    payload[this.tokenExpiresAtKey] = Date.now() + this.expiryMs;
    return payload;
  };

  // ? unused ?
  removeTokenFromPayload = (payload: UpdateQuery<T>): UpdateQuery<T> => {
    payload[this.tokenKey] = undefined;
    payload[this.tokenExpiresAtKey] = undefined;
    return payload;
  };

  getUnsetUpdateQuery = (): UpdateQuery<T> => {
    const filter = {
      $set: { [this.tokenKey]: null, [this.tokenExpiresAtKey]: null },
    };
    return filter as UpdateQuery<T>;
  };
  // -----

  // ? notifications will be handled in it's own service
  requestToken = async (
    id?: string, // userId
    filter?: QueryFilter<T>,
    mode: TokenMode = TokenMode.numeric,
  ): Promise<[string, BaseUser]> => {
    this.userService.ensureIdOrFilter(id, filter as QueryFilter<InternalUser>);

    const token = OTPService.generateToken(this.tokenLength, mode);

    const payload: QueryFilter<T> = {};
    this.updatePayloadWithToken(token, payload);

    const user = await this.userService.update(
      payload,
      id,
      filter as QueryFilter<InternalUser>,
    );

    return [token, user as BaseUser];
  };

  verifyToken = (token: string, user: T): boolean => {
    const isExpired = user[this.tokenExpiresAtKey as string] < Date.now();
    if (isExpired)
      throw new ErrorResponse(
        `[Token Validation] Token expired, request another`,
        400,
      );

    const isMatching = user[this.tokenKey] === token;
    return isMatching;
  };

  invalidateToken = async (
    id: string, // userId
    filter?: QueryFilter<T>,
  ): Promise<boolean> => {
    this.userService.ensureIdOrFilter(id, filter as QueryFilter<InternalUser>);

    // const payload: QueryFilter<T> = {};
    // this.removeTokenFromPayload(payload);

    const payload = this.getUnsetUpdateQuery();

    const user = await this.userService.update(
      payload,
      id,
      filter as QueryFilter<InternalUser>,
    );
    // await user.save();

    return true;
  };
}

export default OTPService;
