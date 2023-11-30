import { Router } from "express";
import {
    getDataAllUserController,
    seedUserController,
} from "../controllers/user";

const router = Router();

router.get("/all", getDataAllUserController);
router.get("/seed-user", seedUserController);

export default router;
