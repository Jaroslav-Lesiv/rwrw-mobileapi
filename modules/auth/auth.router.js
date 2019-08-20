import { Router } from 'express';
import ExpressBrute from 'express-brute';
import passport from 'passport';
import authValidation from './auth.validation';
import { authenticateLocal } from '../../middleware/auth';
import { validation, getRegistrationStep } from '../../utils';
import iplocation from 'iplocation';
import authController from './auth.controller';
import { allowedUserFields } from '../../database/models/userModel';
import { EMPTY_VALIDATION } from '../../constants';

const store = new ExpressBrute.MemoryStore(); // stores state locally, don't use this in production
const bruteforce = new ExpressBrute(store);

const AuthRouter = new Router();

AuthRouter.post('/signup', bruteforce.prevent, validation(authValidation.signup), async (req, res, next) => {
	try {
		const city = await iplocation(req.ip, []);
		const user = await authController.signup({
			...req.body,
			city: {
				lat: city.lat,
				lng: city.lon,
				label: city.city,
				type: 'city'
			}
		});
		// generate new token
		const token = user.generateJWT();
		const registrationStep = getRegistrationStep(user);

		res.status(200).json({ success: true, user: user, token, step: registrationStep });
	} catch (error) {
		next(error);
	}
});

AuthRouter.post(
	'/signin',
	bruteforce.prevent,
	// verify fields
	validation(authValidation.signin),
	// authenticate user using passport local strategy
	authenticateLocal,
	(req, res, next) => {
		try {
			const registrationStep = getRegistrationStep(req.user);
			// generate token using user model
			const token = req.user.generateJWT();
			res.status(200).json({ user: req.user, token, step: registrationStep || '/dashboard' });
		} catch (error) {
			next(error);
		}
	}
);
/**
 * @param  {} '/facebook'
 * @param  {} passport.authenticate('facebook'
 * @param  {['email']}} {scope
 */
// authenticate user using passport facebook strategy
AuthRouter.get('/facebook', validation(EMPTY_VALIDATION), passport.authenticate('facebook', { scope: ['email'] }));
/**
 * @param  {} '/facebook/callback'
 * @param  {} passport.authenticate('facebook'
 * @param  {false}} {session
 */
AuthRouter.get(
	'/facebook/callback',
	passport.authenticate('facebook', {
		session: false
	}),
	(req, res, next) => {
		// TODO: inject token to the html page
		const token = req.user.generateJWT();
		const step = getRegistrationStep(req.user);
		res.redirect(`${step || '/auth/signin'}?token=${token}&user=${JSON.stringify(req.user)}`);
	}
);

/**
 * @param  {} '/google'
 * @param  {} passport.authenticate('google'
 * @param  {['https:}} {scope
 */
// authenticate user using passport google strategy
AuthRouter.get(
	'/google',
	validation(EMPTY_VALIDATION),
	passport.authenticate('google', {
		scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']
	})
);
/**
 * @param  {} '/google/callback'
 * @param  {} passport.authenticate('google'
 * @param  {false} {session
 * @param  {'/auth/login'}} failureRedirect
 */
AuthRouter.get(
	'/google/callback',
	passport.authenticate('google', {
		session: false,
		failureRedirect: '/auth/login'
	}),
	(req, res, next) => {
		try {
			console.log(req.user);
			const token = req.user.generateJWT();
			const step = getRegistrationStep(req.user);
			res.redirect(`${step || '/auth/signin'}?token=${token}&user=${JSON.stringify(req.user)}`);
		} catch (error) {
			next(error);
		}
	}
);
/**
 * @param  {salt'} '/verify-email/
 * @param  {} async(req
 * @param  {} res
 * @param  {} next
 * @param  {} =>{try{awaitauthController.verifyEmail(req.params.salt
 * @param  {} ;res.status(202
 * @param  {true}} .json({success
 */
AuthRouter.get('/verify-email/:salt', async (req, res, next) => {
	try {
		await authController.verifyEmail(req.params.salt);
		res.status(202).json({ success: true });
	} catch (error) {
		next(error);
	}
});

AuthRouter.post('/forgot-password', validation(authValidation.forgotPassword), async (req, res, next) => {
	try {
		await authController.sendResetPassword(req.body.email);
		res.status(202).json({ success: true });
	} catch (error) {
		next(error);
	}
});

AuthRouter.post('/reset-password', validation(authValidation.resetPassword), async (req, res, next) => {
	try {
		await authController.resetPassword(req.body.salt, req.body.password);
		res.status(202).json({ success: true });
	} catch (error) {
		next(error);
	}
});

export default AuthRouter;
