import Joi from 'joi';
import { EMPTY_VALIDATION } from '../../constants';

export const JoiUserProfile = {
	name: Joi.string(),
	logo: Joi.string(),
	backgroundImage: Joi.string(),
	description: Joi.string(),
	address: Joi.string(),
	postcode: Joi.alternatives(Joi.string(), Joi.number()),
	// city id
	city: Joi.string(),
	stamp: {
		total: Joi.number()
			.max(10)
			.min(3),
		color: Joi.string(),
		backgroundColor: Joi.string(),
		pattern: Joi.string()
	}
};

const userValidation = {
	getProfile: {
		...EMPTY_VALIDATION,
		params: {
			_id: Joi.string()
		}
	},

	createProfile: {
		...EMPTY_VALIDATION,
		body: {
			name: Joi.string().required(),
			logo: Joi.string().required(),
			backgroundImage: Joi.string().required(),
			description: Joi.string().required(),
			address: Joi.string().required(),
			postcode: Joi.alternatives(Joi.string(), Joi.number()).required(),
			// city id
			city: Joi.string().required(),
			stamp: {
				total: Joi.number()
					.max(10)
					.min(3).required(),
				color: Joi.string().required(),
				backgroundColor: Joi.string().required(),
				pattern: Joi.string().required()
			}
		}
	},

	updateProfile: {
		...EMPTY_VALIDATION,
		params: {
			_id: Joi.string()
		},
		body: JoiUserProfile
	}
};

export default userValidation;
