import { isProd } from '../utils';

/**
 * @param  {} error
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @param  {false} =>{letbody={success
 * @param  {undefined} message
 * @param  {undefined};letstatus=500;console.log(Object.keys(error} errors
 */
// Handle catching errors
export const exceptionHandler = (error, req, res, next) => {
	// default request body
	let body = {
		success: false,
		message: undefined,
		errors: undefined
	};
	// default status
	let status = 500;
	if (!isProd) {
		// log errors and error keys for development
		console.info(Object.keys(error), error);
	}
	// handle existing error
	if (error) {
		// handle jwt error
		if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
			status = 401;
			body.message = 'Token expired or not provided';
		} else if (error.isJoi) {
			// handle Joi error
			let errors = {};
			const details = error.details;
			for (let detail of details) {
				errors[detail.context.key] = detail.message;
			}
			status = 400;
			body.errors = errors;
		} else if (error.name === 'ValidationError') {
			// handle validation error
			let errors = {};
			for (let [key, val] of Object.entries(error.errors)) {
				errors[key] = val;
			}
			status = 400;
			body.errors = errors;
		} else if (error.status) {
			// handle custom errors, like throw errorCreator(message, status, errors)
			status = error.status;
			body.message = error.message;
			body.errors = error.errors;
		}
	}
	// always send json
	res.status(status).json(body);
};
