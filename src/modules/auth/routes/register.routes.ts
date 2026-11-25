import { Router } from "express";
import { registerController as controller } from "../dependencies/auth.dependencies";
import { protect } from "../../../middleware/auth";

const router = Router();

router.route("/").post(controller.register);
// router.route("/logout").post(controller.logout);
// router.route("/me").get(protect, controller.me);
// router.route("/verify-otp").post(controller.verifyOTP);

export default router;
