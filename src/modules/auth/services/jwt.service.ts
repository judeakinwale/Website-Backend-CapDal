import type { Request, Response, NextFunction } from "express";
import { BaseUser } from "../../../types/user";
import { JWTPayload, jwtVerify, decodeJwt, SignJWT } from "jose";
import ErrorResponse from "../../../utils/errorResponse";
import { Settings } from "../../../config/settings";

class JWTService {
  constructor() {}

  getToken = (req: Request): string => {
    const bearerToken = req.headers.authorization;
    const isBearerToken = bearerToken?.startsWith("Bearer");
    if (!bearerToken || !isBearerToken)
      throw new ErrorResponse(`[Auth] Invalid token provided`);

    const token = bearerToken?.split(" ")[1];
    if (!token) throw new ErrorResponse(`[Auth] Not authorized`);

    return token;
  };

  decodeToken = decodeJwt<BaseUser>;

  getTokenUser = async (req: Request, verify?: boolean): Promise<BaseUser> => {
    const token = this.getToken(req);
    const user = verify
      ? await this.verifyToken(token)
      : this.decodeToken(token);

    return user;
  };

  // ? exp is a unix timestamp in seconds
  generateToken = async (user: BaseUser): Promise<string> => {
    const secretKey = new TextEncoder().encode(Settings.JWT_SECRET);

    let jwtBuilder = new SignJWT({ ...user })
      .setProtectedHeader({ alg: Settings.JWT_ALGORITHM })
      .setIssuedAt()
      .setExpirationTime(Settings.JWT_EXPIRE);

    if (Settings.JWT_ISSUER)
      jwtBuilder = jwtBuilder.setIssuer(Settings.JWT_ISSUER);

    if (Settings.JWT_AUDIENCE)
      jwtBuilder = jwtBuilder.setAudience(Settings.JWT_AUDIENCE);

    const jwt = await jwtBuilder.sign(secretKey);

    return jwt;
  };

  verifyToken = async (token: string): Promise<BaseUser & JWTPayload> => {
    // const decoded = jwt.verify(token, Settings.JWT_SECRET); // using jsonwebtoken

    const secretKey = new TextEncoder().encode(Settings.JWT_SECRET); // convert string to Uint8Array
    const decoded = await jwtVerify<BaseUser>(token, secretKey);

    return decoded.payload;
  };
}

export default JWTService;
