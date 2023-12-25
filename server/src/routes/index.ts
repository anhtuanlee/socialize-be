import { Router } from 'express';
import routerAuth from './auth';
import routerUser from './user';
import routerPost from './post';
import routerComment from './comment';
import routerReaction from './reaction';

const router = Router();

router.use('/auth', routerAuth);
router.use('/users', routerUser);
router.use('/posts', routerPost);
router.use('/comments', routerComment);
router.use('/reactions', routerReaction);

export default router;
