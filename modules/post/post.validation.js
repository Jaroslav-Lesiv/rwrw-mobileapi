import Joi from 'joi';
import { EMPTY_VALIDATION } from '../../constants';

const postValidation = {
	findAllPosts: {
		...EMPTY_VALIDATION,
		query: {
			user_id: Joi.string(),
			limit: Joi.number()
				.min(1)
				.max(50)
		}
	},
	createPost: {
		...EMPTY_VALIDATION,
		body: {
			title: Joi.string()
				.max(50)
				.required(),
			description: Joi.string()
				.max(500)
				.required(),
			image: Joi.string().optional()
		}
	},
	updatePost: {
		...EMPTY_VALIDATION,
		params: {
			_id: Joi.string().required()
		},
		body: {
			title: Joi.string().max(50),
			description: Joi.string().max(500),
			image: Joi.string()
		}
	},
	deletePost: {
		...EMPTY_VALIDATION,
		params: {
			_id: Joi.string().required()
		}
	},
	getPost: {
		...EMPTY_VALIDATION,
		params: {
			_id: Joi.string().required()
		}
	}
};

export default postValidation;
