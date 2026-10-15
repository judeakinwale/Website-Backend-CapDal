import { Router } from "express";
import { timelineController as controller } from "../dependencies/timeline.dependencies";
import { authorize, protect } from "../../../middleware/auth";
import { UserRole } from "../../../types/user";

const router = Router();

router.route("/").post(controller.create).get(controller.find);
router.route("/:id").get(controller.findOne).patch(controller.update).put(controller.update);
router.route("/:id").delete(protect, authorize(UserRole.Admin), controller.delete);

export default router;
