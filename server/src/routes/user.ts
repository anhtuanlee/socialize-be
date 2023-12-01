import { Router } from 'express';
import { userController } from '../controllers/user';
import { middleware } from '../middleware/middleware';

const router = Router();

//Get user Current
router.get('/:userName', middleware.verifyToken, userController.getUserCurrent);
//Delete User
router.delete('/delete/:userName', middleware.verifyTokenAndAdmin, userController.deleteUser);
//Update Infor User
router.put('/update/:userName', middleware.verifyUpdateUser, userController.updateUser);
export default router;
