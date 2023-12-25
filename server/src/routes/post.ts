import { Router } from 'express';
import { postController } from '../controllers/post';
import { asyncHandler } from '../middleware/async';
import { middleware } from '../middleware/middleware';

const router = Router();

router.get('/', middleware.verifyToken, asyncHandler(postController.getPost));
router.post('/create', middleware.verifyToken, asyncHandler(postController.createPostController));
router.put('/update/:id', middleware.verifyToken, asyncHandler(postController.updatePostController));
router.delete('/delete/:id', middleware.verifyTokenAndAdmin, postController.deletePostController);

export default router;
