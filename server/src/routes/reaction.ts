import { Router } from 'express';
import { reactionController } from '../controllers/reaction';
import { middleware } from '../middleware/middleware';
import { asyncHandler } from '../middleware/async';

const router = Router();

router.get('/', middleware.verifyToken, asyncHandler(reactionController.getReaction));
//get user_name=user_name | post_id=post_id | comment_id=comment_id

router.post('/create', middleware.verifyToken, asyncHandler(reactionController.createReaction));
router.put('/update', middleware.verifyToken, asyncHandler(reactionController.updateReaction));
router.delete('/delete/:id', middleware.verifyTokenAndAdmin, asyncHandler(reactionController.deleteReaction));
export default router;
