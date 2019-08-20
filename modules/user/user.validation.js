import Joi from 'joi';
import { EMPTY_VALIDATION } from '../../constants';

const userValidation = {
	updateSelf: {
		...EMPTY_VALIDATION,
		body: {
			email: Joi.string().email(),
			firstName: Joi.string(),
			lastName: Joi.string()
		}
	},
	changePassword: {
		...EMPTY_VALIDATION,
		body: {
			currentPassword: Joi.string().allow('').required(),
			password: Joi.string().required(),
			password_confirmation: Joi.string()
				.min(8)
				.required()
				.valid(Joi.ref('password'))
		}
	},

	saveStripeToken: {
		...EMPTY_VALIDATION,
		body: {
			stripe_token: Joi.string().required()
		}
	},
	createCard: {
		...EMPTY_VALIDATION,
		body: {
			exp_month: Joi.number()
				.min(0)
				.max(12)
				.required(),
			exp_year: Joi.number()
				.min(2019)
				.max(2040)
				.required(),
			number: Joi.string()
				.min(9)
				.max(20)
				.required(),
			cvc: Joi.string()
				.length(3)
				.required()
		}
	},
	updateCard: {
		...EMPTY_VALIDATION,
		body: {
			exp_month: Joi.number()
				.min(0)
				.max(12)
				.required(),
			exp_year: Joi.number()
				.min(2019)
				.max(2040)
				.required(),
			number: Joi.string()
				.min(9)
				.max(20)
				.required(),
			cvc: Joi.string()
				.length(3)
				.required()
		}
	},
	updateActive: {
		...EMPTY_VALIDATION,
		body: {
			active: Joi.boolean().required()
		}
	},
	getInvoices: {
		...EMPTY_VALIDATION,
		query: {
			last: Joi.string()
		}
	}
};

export default userValidation;
