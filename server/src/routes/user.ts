import { Router } from "express";
import { userController } from "../controllers/user";
import { middleware } from "../controllers/middleware";

const router = Router();

router.get(
    "/:userName",
    middleware.verifyToken,
    userController.getUserCurrent
);
router.delete("/delete/:userName", middleware.verifyTokenAndAdmin, userController.deleteUser);
router.put("/update/:userName", middleware.verifyUpdateUser, userController.updateUser)
export default router;
