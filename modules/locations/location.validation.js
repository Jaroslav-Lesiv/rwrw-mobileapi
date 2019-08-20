import Joi from 'joi';
import { EMPTY_VALIDATION } from '../../constants';

const locationValidation = {
	getLocation: {
		...EMPTY_VALIDATION,
		query: {
			type: Joi.string()
		}
	}
};

export default locationValidation;
