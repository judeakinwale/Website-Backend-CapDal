import { Router } from "express";
import { certificateController as controller } from "../dependencies/certificate.dependencies";
import { authorize, protect } from "../../../middleware/auth";
import { UserRole } from "../../../types/user";

const router = Router();

router.route("/").post(controller.create);
router.route("/").get(controller.find);
router.route("/:id").get(controller.findOne);
router.route("/:id").patch(controller.update);
router.route("/:id").put(controller.update);
router
  .route("/:id")
  .delete(protect, authorize(UserRole.Admin), controller.delete);

export default router;
