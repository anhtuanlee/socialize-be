import { Router } from 'express';
import { middleware } from '../middleware/middleware';
import { followController, friendController, userController } from '../controllers/users';
import { asyncHandler } from '../middleware/async';

const router = Router();

router.get('/:user', middleware.verifyToken, asyncHandler(userController.getUserCurrent));
router.put('/:user/update', middleware.verifyTokenAndAdmin, asyncHandler(userController.updateUser));
router.delete('/delete/:user_name', middleware.verifyTokenAndAdmin, asyncHandler(userController.deleteUser));
//Friend
router.post('/friend/add', middleware.verifyToken, asyncHandler(friendController.addFriendRequest));
router.post('/friend/accept', middleware.verifyToken, asyncHandler(friendController.acceptFriendRequest));
router.post('/friend/reject', middleware.verifyToken, asyncHandler(friendController.rejectFriendRequest));
router.post('/friend/delete', middleware.verifyToken, asyncHandler(friendController.deleteFriendRequest));

router.get(
    '/friend/:user_name',
    middleware.verifyToken,
    middleware.verifyToken,
    asyncHandler(friendController.getFriendOfUser)
);
router.get(
    '/friend/invite_request',
    middleware.verifyToken,
    middleware.verifyToken,
    asyncHandler(friendController.getListFriendRequest)
);
// router.post('/friend/mutual', asyncHandler(friendController.getMutualFriend));

router.get('/followers/:user_name', middleware.verifyToken, asyncHandler(followController.getListFollower));
router.get('/following/:user_name', middleware.verifyToken, asyncHandler(followController.getListFollowing));
router.post('/follow', middleware.verifyToken, asyncHandler(followController.followUser));
router.post('/unfollow', middleware.verifyToken, asyncHandler(followController.unFollowUser));
export default router;
