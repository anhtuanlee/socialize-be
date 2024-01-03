import { Router } from 'express';
import { postController } from '../controllers/post';
import { asyncHandler } from '../middleware/async';
import { middleware } from '../middleware/middleware';
import multer from 'multer';

const upload = multer();

const router = Router();

router.get('/', middleware.verifyToken, asyncHandler(postController.getPost));
router.post('/create', middleware.uploadz, postController.createPostController);
router.put('/update/:id', middleware.verifyToken, asyncHandler(postController.updatePostController));
router.delete('/delete/:id', middleware.verifyTokenAndAdmin, postController.deletePostController);

export default router;
