import { User } from "../../../types/user";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends User {
  token: string;
  refreshToken?: string;
  tokenExpiresAt?: number; // Unix timestamp in seconds
}
