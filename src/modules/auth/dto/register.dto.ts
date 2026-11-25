import { BaseUser, UserRole } from "../../../types/user";
import { LoginResponse, VerifyOTPRequest } from "./login.dto";

export interface RegisterRequest extends Omit<BaseUser, "id" | "roles"> {
  password: string;
  confirmPassword?: string;
  roles?: UserRole[];
}

export interface RegisterResponse extends LoginResponse {}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest extends VerifyOTPRequest {}
export interface ResetPasswordResponse extends LoginResponse {}

export interface VerifyActivationRequest extends VerifyOTPRequest {}
export interface VerifyActivationResponse extends BaseUser {}
