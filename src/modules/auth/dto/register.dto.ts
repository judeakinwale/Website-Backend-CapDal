import { BaseUser, UserRole } from "../../../types/user";
import { LoginResponse } from "./login.dto";

export interface RegisterRequest extends Omit<BaseUser, "id" | "roles"> {
  password: string;
  confirmPassword?: string;
  roles?: UserRole[];
}

export interface RegisterResponse extends LoginResponse {}
