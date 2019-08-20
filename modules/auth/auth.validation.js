import Joi from 'joi';
import { EMPTY_VALIDATION, passwordComplexValidation } from '../../constants';
// set empty query, body, params to strict validation
const authValidation = {
	signin: {
		...EMPTY_VALIDATION,
		body: {
			username: Joi.string().email().required(),
			password: passwordComplexValidation
		}
	},
	forgotPassword: {
		...EMPTY_VALIDATION,
		body: {
			email: Joi.string()
				.email()
				.required()
		}
	},
	resetPassword: {
		...EMPTY_VALIDATION,
		body: {
			salt: Joi.string().required(),
			password: passwordComplexValidation,
			password_confirmation: Joi.string()
				.required()
				.valid(Joi.ref('password'))
		}
	},
	signup: {
		...EMPTY_VALIDATION,
		body: {
			email: Joi.string()
				.email()
				.required(),
			firstName: Joi.string().required(),
			lastName: Joi.string().required(),
			password: passwordComplexValidation,
			password_confirmation: Joi.string()
				.min(8)
				.required()
				.valid(Joi.ref('password')),
			// year_agree: Joi.boolean()
			// 	.valid(true)
			// 	.required(),
			terms_agree: Joi.boolean()
				.valid(true)
				.required()
		}
	}
};

export default authValidation;
