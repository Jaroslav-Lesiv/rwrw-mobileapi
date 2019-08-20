import { Router } from 'express';
import { VerifyAuth } from './middleware/auth';

import AuthRouter from './modules/auth/auth.router';
import UserRouter from './modules/user/user.router';
import PaymentRouter from './modules/payments/payment.router';
import PostRouter from './modules/post/post.router';
import LocationRouter from './modules/locations/location.router';
import { UploadImage } from './middleware/uploadImages';
import ProfileRouter from './modules/profile/profile.router';
import FeedBackRouter from './modules/feedback/feedback.router';
import SourceRouter from './modules/source/source.router';

const router = Router();

router.use('/auth', AuthRouter);
router.use('/user', UserRouter);
router.use('/posts', PostRouter);
router.use('/profile', ProfileRouter);
router.use('/payments', PaymentRouter);
router.use('/locations', LocationRouter);
router.use('/feedback', FeedBackRouter);
router.use('/upload/:slug', VerifyAuth, UploadImage);
router.use('/source', SourceRouter);
router.all('*', (req, res) => {
	res.status(404).json({});
});

export default router;
