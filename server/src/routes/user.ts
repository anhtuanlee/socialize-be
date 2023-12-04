import { Router } from 'express';
import { userController } from '../controllers/user';
import { middleware } from '../middleware/middleware';

const router = Router();

router.get('/:user_name', userController.getUserCurrent);
router.put('/update', middleware.verifyTokenAndAdmin, userController.updateUser);
router.delete('/delete/:user_name', middleware.verifyTokenAndAdmin, userController.deleteUser);
//Friend
router.post('/friend/add', userController.addFriendRequest);
router.post('/friend/accept', userController.acceptFriendRequest);
router.post('/friend/reject', userController.rejectFriendRequest);
router.post('/friend/delete', userController.deleteFriendRequest);

router.get('/friend', middleware.verifyToken, userController.getFriendOfUser);
router.get('/friend/invite_request', middleware.verifyToken, userController.getListFriendRequest);
router.get('/friend/follower', middleware.verifyToken, userController.getListFollower);
router.get('/friend/mutual_friend', userController.getMutualFriend);
export default router;
