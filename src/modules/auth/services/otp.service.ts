import { randomBytes, randomInt } from "node:crypto";
import { User } from "../../../types/user";
import { BaseService } from "../../shared/base.service";
import ErrorResponse from "../../../utils/errorResponse";
import UserService from "../../cms/services/user.service";

export type TokenKeys = "activationToken" | "resetPasswordToken";
export type TokenExpiryKeys =
  | "activationTokenExpiresAt"
  | "resetPasswordTokenExpiresAt";

class OTPService<T extends User = User> {
  userService: UserService;
  tokenKey: TokenKeys;
  private tokenExpiresAtKey: TokenExpiryKeys;
  private tokenLength: number;
  private expiryMs: number;

  constructor(
    userService: UserService,
    tokenKey: TokenKeys,
    expirySeconds: number = 600,
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
    mode: "alphanumeric" | "numeric" = "alphanumeric",
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
  updatePayloadWithToken = (token: string, payload: Partial<T>): Partial<T> => {
    payload[this.tokenKey] = token;
    payload[this.tokenExpiresAtKey] = Date.now() + this.expiryMs;
    return payload;
  };

  removeTokenFromPayload = (payload: Partial<T>): Partial<T> => {
    payload[this.tokenKey] = undefined;
    payload[this.tokenExpiresAtKey] = undefined;
    return payload;
  };
  // -----

  requestToken = async (userId: string): Promise<string> => {
    const token = OTPService.generateToken(this.tokenLength, "numeric");

    const payload: Partial<T> = {};
    this.updatePayloadWithToken(token, payload);

    const id = BaseService.normalizeId(userId);
    const _user = await this.userService.update(payload, id);

    return token;
  };

  verifyToken = (token: string, user: T): boolean => {
    const isExpired = user[this.tokenExpiresAtKey] < Date.now();
    if (isExpired)
      throw new ErrorResponse(
        `[Token Validation] Token expired, request another`,
        400,
      );

    const isMatching = user[this.tokenKey] === token;
    return isMatching;
  };

  invalidateToken = async (userId: string): Promise<boolean> => {
    const payload: Partial<T> = {};
    this.removeTokenFromPayload(payload);

    const id = BaseService.normalizeId(userId);
    const _user = await this.userService.update(payload, id);

    return true;
  };
}

export default OTPService;
