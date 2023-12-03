import { Router } from 'express';
import { userController } from '../controllers/user';
import { middleware } from '../middleware/middleware';

const router = Router();

//Get user Current 
router.get('/:user_name', userController.getUserCurrent);
//Delete User
router.post('/add', userController.addFriend);

router.delete('/delete/:user_name', middleware.verifyTokenAndAdmin, userController.deleteUser);
//Update Infor User

export default router;
