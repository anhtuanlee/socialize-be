import { Router } from "express";
import googleLoginController from "../controllers/auth";
const router = Router();

router.post("/google-login", googleLoginController);

export default router;
