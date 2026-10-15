import { DefaultItem } from "./default";

export enum UserRole {
  "Admin" = "Admin",
  "User" = "User",
}

export interface LoginPayload {
  email: string;
  password: string;
}

// used in jwt token
export interface BaseUser {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];

  imageUrl?: string;
}

export interface User extends DefaultItem {
  name: string;
  email: string;
  roles: UserRole[];

  imageUrl?: string;
}

export interface InternalUser extends User {
  password?: string; // only required for account creation
}

export interface LoginResponse extends User {
  token: string;
  tokenExpiresAt?: number; // Unix timestamp in seconds
}
