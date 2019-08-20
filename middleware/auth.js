import { getTokenFromHeader, errorCreator, isApproved } from '../utils';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import _ from 'lodash';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as LocalStrategy } from 'passport-local';
import authController from '../modules/auth/auth.controller';
import userController from '../modules/user/user.controller';
import UserErrors from '../errors/user';
import { GOOGLE_CALLBACK, FACEBOOK_CALLBACK } from '../constants';

/**
 * @param  {} newLocalStrategy(authController.signInLocal
 */
// SignIn by username & password
passport.use(new LocalStrategy(authController.signInLocal));
/**
 * @param  {process.env.FACEBOOK_APP_ID} newFacebookStrategy({clientID
 * @param  {process.env.FACEBOOK_APP_SECRET} clientSecret
 * @param  {GOOGLE_CALLBACK} callbackURL
 * @param  {['id'} profileFields
 * @param  {} 'emails'
 * @param  {} 'name'
 * @param  {} 'photos'
 * @param  {} 'displayName']}
 * @param  {} authController.signInFaceBook
 */
// SignIn using facebook
passport.use(
	new FacebookStrategy(
		{
			clientID: process.env.FACEBOOK_APP_ID,
			clientSecret: process.env.FACEBOOK_APP_SECRET,
			callbackURL: FACEBOOK_CALLBACK,
			profileFields: ['id', 'emails', 'name', 'photos', 'displayName']
		},
		authController.signInFaceBook
	)
);
/**
 * @param  {process.env.GOOGLE_CLIENT_ID} newGoogleStrategy({clientID
 * @param  {process.env.GOOGLE_CLIENT_SECRET} clientSecret
 * @param  {'http:profileFields:['id'} callbackURL
 * @param  {} 'emails'
 * @param  {} 'name'
 * @param  {} 'photos'
 * @param  {} 'displayName']}
 * @param  {} authController.signInGoogle
 */
// Sign in using google OAuth2
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: GOOGLE_CALLBACK,
			profileFields: ['id', 'emails', 'name', 'photos', 'displayName']
		},
		authController.signInGoogle
	)
);

/**
 * @param  {} newLocalStrategy(authController.signInLocal
 */
// SignIn by username & password
passport.use(new LocalStrategy(authController.signInLocal));
/**

/**
 * @param  {} 'local'
 * @param  {false}} {session
 */
// local auth for route
export const authenticateLocal = passport.authenticate('local', {
	session: false
});

//
/**
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @param  {} =>{try{consttoken=getTokenFromHeader(req
 * @param  {} ;const{userId
 * @param  {} email}=jwt.verify(token
 * @param  {} process.env.SECRET
 * @param  {userId}} ;constuser=awaituserController.findUser({_id
 */
// Verify user token
export const VerifyAuth = async (req, res, next) => {
	try {
		const token = getTokenFromHeader(req);
		const { userId } = jwt.verify(token, process.env.SECRET);
		const user = await userController.findUser({ _id: userId });
		if (!user) next(errorCreator(UserErrors.existing, 401));
		req.user = user;
		return next();
	} catch (error) {
		// Call error if token expired or not exist
		next(error);
	}
};
