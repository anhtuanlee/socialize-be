import { Router } from 'express';
import { authController } from '../controllers/auth';
import { middleware } from '../middleware/middleware';
import { asyncHandler } from '../middleware/async';
const router = Router();

//Get Profile

router.get('/profile', middleware.verifyToken, asyncHandler(authController.profile));
//Register
router.post('/register', asyncHandler(authController.register));
//Login
router.post('/login', asyncHandler(authController.login));
//Logout
router.post('/logout', middleware.verifyFrefreshToken, asyncHandler(authController.logout));
//Refresh Token
router.post('/refreshToken', middleware.verifyFrefreshToken, asyncHandler(authController.refreshToken));
//Change Password
router.put('/password', middleware.verifyTokenAndAdmin, asyncHandler(authController.changePassword));

export default router;
