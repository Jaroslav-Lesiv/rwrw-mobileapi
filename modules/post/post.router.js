import { Router } from 'express';

import postController from './post.controller';
import { VerifyAuth } from '../../middleware/auth';
import postValidation from './post.validation';
import { validation } from '../../utils';

const PostRouter = new Router();

// Get all posts
PostRouter.get('/', validation(postValidation.findAllPosts), async (req, res, next) => {
	try {
		// allowed query placement in validation
		const posts = await postController.findPosts(req.query);
		res.status(200).json({ posts });
	} catch (error) {
		next(error);
	}
});

// Get self posts
PostRouter.get('/my', VerifyAuth, validation(postValidation.findAllPosts), async (req, res, next) => {
	try {
		// allowed query placement in validation
		// get self post were profile is equal to user profile
		const posts = await postController.findPosts({ profile: req.user.profile, ...req.query });
		res.status(200).json({ posts });
	} catch (error) {
		next(error);
	}
});

// Create new post
PostRouter.post('/', VerifyAuth,  async (req, res, next) => {
	try {
		const { title, image, description } = req.body;

		const post = await postController.createPost(req.user, {
			title,
			image,
			description
		});

		res.status(200).json({ post });
	} catch (error) {
		next(error);
	}
});
// Get post by id
PostRouter.get('/:_id', validation(postValidation.getPost), async (req, res, next) => {
	try {
		const post = await postController.getPost(req.params._id);
		res.status(200).json({ post });
	} catch (error) {
		next(error);
	}
});
// Update self post
PostRouter.put('/:_id', VerifyAuth, validation(postValidation.updatePost), async (req, res, next) => {
	try {
		const { title, image, description } = req.body;
		const post = await postController.updatePost(req.user, {
			_id: req.params._id,
			title,
			image,
			description
		});
		res.status(202).json({ post });
	} catch (error) {
		next(error);
	}
});

// Delete self post
PostRouter.delete('/:_id', VerifyAuth, validation(postValidation.deletePost), async (req, res, next) => {
	try {
		await postController.deletePost(req.user, {
			_id: req.params._id
		});
		res.status(202).json({ success: true });
	} catch (error) {
		next(error);
	}
});

export default PostRouter;
