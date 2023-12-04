import { Router } from 'express';
import { authController } from '../controllers/auth';
import { middleware } from '../middleware/middleware';
const router = Router();

//Register
router.post('/register', authController.register);
//Login
router.post('/login', authController.login);
//Logout
router.post('/logout', middleware.verifyFrefreshToken, authController.logout);
//Refresh Token
router.post('/refreshToken', middleware.verifyFrefreshToken, authController.refreshToken);
//Change Password
router.put('/password', middleware.verifyTokenAndAdmin, authController.changePassword);


export default router;
