import {
  ForgotPasswordRequest,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  VerifyActivationRequest,
} from "../dto/register.dto";
import { BaseUser, InternalUser, UserRole } from "../../../types/user";
import UserRepository from "../../cms/repositories/user.repository";
import UserService from "../../cms/services/user.service";
import OTPService from "./otp.service";
import ErrorResponse from "../../../utils/errorResponse";
import { SendMailOptions } from "nodemailer";
import { Settings } from "../../../config/settings";
import { getForgotPasswordTemplate } from "../html/forgotPassword";

export class RegisterService {
  private repo: UserRepository;
  name: string = "Register Service";

  constructor(
    repo: UserRepository,
    private userService: UserService,
    private otp: OTPService<InternalUser>,
    private notification: NotificationService,
  ) {
    this.repo = repo;
  }

  register = async (
    payload: RegisterRequest,
    user?: BaseUser,
  ): Promise<RegisterResponse> => {
    const isPasswordConfirmed = payload.password === payload.confirmPassword;

    const createPayload: InternalUser = {
      ...payload,
      roles: payload.roles || [UserRole.User],
    };

    const registered = await this.userService.create(createPayload, user);

    const registerData: RegisterResponse = {
      ...registered,
      token: "",
      tokenExpiresAt: Date.now(),
    };

    return registerData;
  };

  forgotPassword = async (payload: ForgotPasswordRequest) => {
    const { email } = payload;
    const user = await this.userService.findOne(undefined, { email });
    if (!user) throw new ErrorResponse(`[${this.name}] User not found!`, 400);

    // TODO: implement notifications
    const options: SendMailOptions = {
      from: Settings.FROM_EMAIL,
      to: user.email,
      subject: `Password Reset | ${Settings.APP_NAME}`,
      html: getForgotPasswordTemplate,
    };
    await this.notification.send_multiple();
    // ...
  };

  resetPassword = async (payload: ResetPasswordRequest) => {
    // ...
  };

  requestActivationOTP = async (userId: string, user?: BaseUser) => {
    // ...
  };

  verifyActivationOTP = async (payload: VerifyActivationRequest) => {
    // ...
  };
}
