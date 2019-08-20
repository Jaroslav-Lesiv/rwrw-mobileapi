import { Router } from 'express';

import { validation } from '../../utils';
import feedbackValidation from './feedback.validation';
import feedbackController from './feedback.controller';

const FeedBackRouter = new Router();

FeedBackRouter.post('/', validation(feedbackValidation.postFeedback), async (req, res, next) => {
	try {
		await feedbackController.createFeedback(req.body);
		res.status(202).json({});
	} catch (error) {
		next(error);
	}
});

export default FeedBackRouter;
