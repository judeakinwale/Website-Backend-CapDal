import { DefaultItem } from "./default";

export enum UserRole {
  "Admin" = "Admin",
  "User" = "User",
}

export interface User extends DefaultItem {
  name: string;
  email: string;
  roles: UserRole[];

  imageUrl?: string;
}

// used in jwt token
export interface BaseUser extends User {
  id: string;
}

export interface InternalUser extends User {
  password?: string; // only required for account creation
}
