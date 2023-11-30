import { Router } from "express";
import { getAllPostUserController } from "../controllers/post";

const router = Router();
router.get('/:user', getAllPostUserController)

export default router;
