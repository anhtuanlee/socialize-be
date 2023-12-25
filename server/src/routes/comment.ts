import { Router } from 'express';
import { commentController } from '../controllers/comment';
import { middleware } from '../middleware/middleware';
import { asyncHandler } from '../middleware/async';

const router = Router();

// get comment with type=post|user&id|user_name
router.get('/', middleware.verifyToken, asyncHandler(commentController.getComment));
router.post('/create', middleware.verifyToken, asyncHandler(commentController.createComment));
router.post('/update', middleware.verifyToken, asyncHandler(commentController.updateComment));
router.delete('/delete:id', middleware.verifyToken, commentController.deleteComment);
export default router;
