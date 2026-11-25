import { User } from "../../../types/user";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface VerifyOTPRequest {
  email: string;
  token: string;
}

export interface LoginResponse extends User {
  token: string;
  refreshToken?: string; // TODO: implement this in login service
  tokenExpiresAt?: number; // Unix timestamp in ms (js timestamp)
}
