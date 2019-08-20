import Joi from 'joi';
import _ from 'lodash';
import fs from 'fs'
import { EMAIL_CONFIRMATION_URL } from '../constants';
import { resolve } from 'uri-js';

export /**
 *
 *
 * @param {*} data
 * @param {*} schema
 * @returns
 */
const Validator = (data, schema) => {
	return Joi.validate(data, schema, {
		abortEarly: false,
		allowUnknown: false,
		stripUnknown: false
	});
};

export /**
 *
 *
 * @param {*} schema
 */
const validation = schema => async (req, res, next) => {
	try {
		const allowedKeys = Object.keys(schema);
		const data = {};
		for (let key of allowedKeys) {
			data[key] = req[key];
		}
		await Validator(data, schema);
		return next();
	} catch (error) {
		next(error);
	}
};

export /**
 *
 *
 * @param {*} req
 * @returns
 */
const getTokenFromHeader = req => {
	if (
		(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Token') ||
		(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
	) {
		return req.headers.authorization.split(' ')[1];
	}

	return null;
};

export /**
 *
 *
 * @param {string} [message='']
 * @param {number} [status=500]
 * @param {*} errors
 */
const errorCreator = (message = '', status = 500, errors) => ({
	message,
	status,
	errors
});

export /**
 *
 *
 * @param {*} err
 * @returns
 */
const handleStripeError = err => {
	let message = 'Oops. Looks like stripe have some issue';
	switch (err.type) {
		case 'StripeCardError':
			// A declined card error
			message = err.message; // => e.g. "Your card's expiration year is invalid."
			break;
		case 'RateLimitError':
			// Too many requests made to the API too quickly
			break;
		case 'StripeInvalidRequestError':
			// Invalid parameters were supplied to Stripe's API
			break;
		case 'StripeAPIError':
			// An error occurred internally with Stripe's API
			break;
		case 'StripeConnectionError':
			// Some kind of error occurred during the HTTPS communication
			break;
		case 'StripeAuthenticationError':
			// You probably used an incorrect API key
			break;
		default:
			// Handle any other types of unexpected errors
			break;
	}
	return message;
};

export /**
 *
 *
 * @param {*} [fields={}]
 * @param {number} [status=200]
 */
const successCreator = (fields = {}, status = 200) => ({
	status,
	...fields
});

export const getAllowedFields = (data, schema, notAllowed = []) => {
	const allowed = {};
	for (let field of schema) {
		allowed[field] = data[field];
	}
	return allowed;
};

export const createMailGunConfirmMessage = (salt, email, first_name, last_name) => {
	const fullName = `${first_name} ${last_name}`;
	return {
		from: 'RWRD <postmaster@sandbox48201a3a90e341cf9ec1aa9e577670af.mailgun.org>',
		to: `${fullName} <${email}>`,
		subject: `Hello ${fullName}`,
		text: `Congratulations  ${fullName}, you just sent an email with Mailgun! <a href="${EMAIL_CONFIRMATION_URL}/${salt}"  You are truly awesome!`
	};
};

export /**
 *
 *
 * @param {*} data
 * @returns
 */
const isApproved = data => {
	if (!data) return false;
	if (!_.isObject(data)) return Boolean(data);
	console.log({data}, Object.values(data).some(value => {
		if (_.isObject(value)) return isApproved(value);
		return Boolean(value)
	}))
	return Object.values(data).some(value => {
		if (_.isObject(value)) return isApproved(value);
		return Boolean(value)
	});
};

export /**
 *
 *
 * @param {*} user
 * @returns
 */
const getRegistrationStep = user => {
	let step = undefined;
	switch (true) {
		case !isApproved(user.subscription):
			step = '/auth/subscriptions';
			break;

		case !isApproved(user.card):
			step = '/auth/payments';
			break;

		case !isApproved(user.profile):
			step = '/auth/profile';
			break;

		default:
			step = undefined;
			break;
	}
	return step;
};

export /**
 *
 *
 * @param {*} card
 * @returns
 */
const createCardView = card => {
	if (!isNaN(card)) {
		card = card.toString();
	}
	return `XXXX XXXX XXXX ${card.slice(card.length - 4, card.length)}`;
};

export const isProd = process.env.NODE_ENV === 'production';


export const writeFile = (dist, data) => new Promise((res, rej) => {
	fs.writeFile(dist, data, (error) => {
		if (error) {
			rej(error)
		}
		res(dist)
	})
})