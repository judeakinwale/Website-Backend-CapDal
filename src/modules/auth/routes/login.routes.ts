import { Router } from "express";
import { loginController as controller } from "../dependencies/auth.dependencies";
import { protect } from "../../../middleware/auth";

const router = Router();

router.route("/login").post(controller.login);
router.route("/logout").post(controller.logout);
router.route("/me").get(protect, controller.me);
router.route("/verify-otp").post(controller.verifyOTP);

export default router;
