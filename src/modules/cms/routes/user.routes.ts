import { Router } from "express";
import { userController as controller } from "../dependencies/user.dependencies";
import { authorize, protect } from "../../../middleware/auth";
import { UserRole } from "../../../types/user";

const router = Router();

router.route("/").post(controller.create).get(controller.find);
router.route("/:id").get(controller.findOne);
router.route("/:id").patch(controller.update);
router.route("/:id").put(controller.update);
router
  .route("/:id")
  .delete(protect, authorize(UserRole.Admin), controller.delete);

export default router;
