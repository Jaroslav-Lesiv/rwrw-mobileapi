import Joi from 'joi';
import { EMPTY_VALIDATION } from '../../constants';

const feedbackValidation = {
	postFeedback: {
		...EMPTY_VALIDATION,
		body: {
			email: Joi.string().email().required(),
			firstName: Joi.string().required(),
			lastName: Joi.string().required(),
			reason: Joi.string().required(),
			description: Joi.string().required()
		}
	}
};

export default feedbackValidation;
