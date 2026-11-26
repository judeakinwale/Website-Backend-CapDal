import { Router } from "express";
import { registerController as controller } from "../dependencies/auth.dependencies";
import { protect } from "../../../middleware/auth";

const router = Router();

router.route("/").post(controller.register);
router.route("/forgot-password").post(controller.forgotPassword);
router.route("/reset-password").post(controller.resetPassword);
router
  .route("/request-activation")
  .get(protect, controller.requestActivationOTP);
router
  .route("/verify-activation")
  .post(protect, controller.verifyActivationOTP);

export default router;
