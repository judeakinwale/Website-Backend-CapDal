import {
  ForgotPasswordRequest,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  VerifyActivationRequest,
} from "../dto/register.dto";
import { BaseUser, InternalUser, UserRole } from "../../../types/user";
import UserService from "../../cms/services/user.service";
import OTPService from "./otp.service";
import ErrorResponse from "../../../utils/errorResponse";
// import { SendMailOptions } from "nodemailer";
// import { Settings } from "../../../config/settings";
// import { getForgotPasswordTemplate } from "../html/forgotPassword";

export class RegisterService {
  name: string = "Register Service";

  constructor(
    private userService: UserService,
    private resetPwdOtp: OTPService<InternalUser>,
    private activationOtp: OTPService<InternalUser>,
    // private notification: NotificationService,
  ) {}

  private _ensure_confirm_password(payload: {
    password: string;
    confirmPassword?: string;
  }) {
    if (payload.password !== payload.confirmPassword)
      throw new ErrorResponse(
        `[${this.name}] password and password confiramtion don't match`,
        400,
      );
  }

  register = async (
    payload: RegisterRequest,
    user?: BaseUser,
  ): Promise<RegisterResponse> => {
    this._ensure_confirm_password(payload);

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
    const [token, user] = await this.resetPwdOtp.requestToken(undefined, {
      email,
    });

    // TODO: implement notifications
    // // example of email / general notification implementation
    // const mailOptions: SendMailOptions = {
    //   from: Settings.FROM_EMAIL,
    //   to: user.email,
    //   subject: `Password Reset | ${Settings.APP_NAME}`,
    //   html: getForgotPasswordTemplate(token, user),
    //   raw: getForgotPasswordTemplate(token, user),
    // };
    // const options = { mail: mailOptions };
    // await this.notification.send_multiple(options);

    return;
    // ...
  };

  resetPassword = async (payload: ResetPasswordRequest) => {
    this._ensure_confirm_password(payload);
    const { email, token, password } = payload;

    const user = await this.userService.findOne(undefined, { email });
    const isMatch = this.resetPwdOtp.verifyToken(token, user);
    if (!isMatch)
      throw new ErrorResponse(`[${this.name}] Invalid token provided`, 400);

    const _ = await this.resetPwdOtp.invalidateToken(user.id);

    // TODO: look into handling the token invalidation using the updatePasswordPayload
    const updated = await this.userService.updatePassword(
      { password },
      user.id,
    );

    return updated;
    // ...
  };

  requestActivationOTP = async (userId: string) => {
    const [token, user] = await this.activationOtp.requestToken(userId);

    // TODO: implement notifications

    return;
    // ...
  };

  verifyActivationOTP = async (payload: VerifyActivationRequest) => {
    const { email, token } = payload;

    const user = await this.userService.findOne(undefined, { email });
    const isMatch = this.activationOtp.verifyToken(token, user);
    if (!isMatch)
      throw new ErrorResponse(`[${this.name}] Invalid token provided`, 400);

    const [_, updated] = await this.activationOtp.invalidateToken(user.id);

    return updated;
    // ...
  };
}
