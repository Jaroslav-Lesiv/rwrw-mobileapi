import md5 from 'md5';
import mailGun from 'mailgun-js';
import { errorCreator, createMailGunConfirmMessage } from '../../utils';
import userController from '../user/user.controller';
import UserErrors from '../../errors/user';
import sha256 from 'js-sha256';
import paymentController from '../payments/payment.controller';
import database from '../../database/mongoose';
import { SERVER_URL } from '../../constants';

const mailGunClient = mailGun({ apiKey: process.env.MAIL_GUN_API_KEY, domain: process.env.MAIL_GUN_DOMAIN });

const authController = {
	/**
	 * @param  {} email
	 * @param  {} password
	 * @param  {} done
	 * @param  {email}} {try{constuser=awaituserController.findUser({email
	 */
	// Local authentication using username & password
	async signInLocal(email, password, done) {
		console.log({ email })
		try {
			const user = await database.UserModel.findOne({ email, password: md5(password) });
			if (!user) return done(errorCreator(UserErrors.existing));
			return done(null, user);
		} catch (error) {
			return done(error);
		}
	},

	/**
	 *
	 *
	 * @param {null} accessToken
	 * @param {null} refreshToken
	 * @param {*} profile
	 * @param {function} done
	 *
	 * @done (error, user) =>
	 */
	// Authentication using passport facebook
	async signInFaceBook(accessToken, refreshToken, profile, done) {
		try {
			const json = profile._json;
			let user = null;
			const exist = await userController.findUser({ email: json.email });
			if (!exist) {
				user = await userController.createUser({
					email: json.email,
					firstName: json.first_name,
					lastName: json.last_name,
					password: '',
					emailConfirmed: {
						confirmed: true
					}
				});
			} else {
				user = exist;
			}
			done(null, user);
		} catch (error) {
			done(error);
		}
	},

	// Authentication using google OAuth2
	/**
	 *
	 *
	 * @param {string} accessToken
	 * @param {string} refreshToken
	 * @param {object} profile
	 * // done is callback function
	 * @param {function} done
	 *
	 * @done (error, user) =>
	 */
	async signInGoogle(accessToken, refreshToken, profile, done) {
		try {
			const json = profile._json;
			let user = null;
			const exist = await userController.findUser({ email: json.email });
			if (!exist) {
				user = await userController.createUser({
					email: json.email,
					firstName: json.given_name,
					lastName: json.family_name,
					password: '',
					emailConfirmed: {
						confirmed: true
					}
				});
			} else {
				user = exist;
			}
			done(null, user);
		} catch (error) {
			done(error);
		}
	},

	/**
	 *
	 *
	 * // new user object
	 * @param {object} userFields
	 * // return created user model
	 * @returns {object} user
	 */
	async signup(userFields) {
		const user = await userController.createUser(userFields);

		return user;
	},

	/**
	 *
	 *
	 * // user model
	 * @param {object} user
	 */
	async sendEmailConfirmation(user) {
		// email confirmation salt
		const salt = md5(user._id + user.email + Date.now());
		// save salt key and un confirm user email if they was confirmed
		user.setConfirmEmailSalt(salt);
		// send message to user
		await mailGunClient
			.messages()
			.send(createMailGunConfirmMessage(salt, user.email, user.first_name, user.last_name));
	},

	/**
	 *
	 *
	 * @param {string} salt
	 * updated user object
	 * @returns {object: user}
	 */
	async verifyEmail(salt) {
		// find user by salt and clear
		// salt can be used just once
		const user = await userController.findAndUpdateUser({ salt: salt }, { salt: null });
		// if user with current salt does not exist throw error
		if (!user) throw errorCreator(UserErrors.existing, 401);
		// confirm email by user model
		user.confirmEmail();
		// subscribe user after email was confirmed
		// const subscription = await paymentController.subscribeStripe(user);
		// // update stripe subscription
		// return await userController.updateUser(user, { stripe: { subscription: subscription.id } });
	},
	async sendResetPassword(email) {
		const user = await userController.findUser({ email });
		// if user with current salt does not exist throw error
		if (!user) throw errorCreator(UserErrors.existing, 401);

		const salt = sha256(`${user.email}${user.password}${Date.now()}`);
		user.resetPasswordSalt = salt;
		await user.save();
		const fullName = `${user.firstName} ${user.lastName}`;

		const resetLink = `${SERVER_URL}/auth/reset-password?salt=${salt}`;

		await mailGunClient.messages().send({
			from: `RWRD <jaroslav.webdeva@gmail.com>`,
			to: user.email,
			subject: `Hello ${fullName}`,
			text: `Congratulations  ${fullName}, you just sent an email with Mailgun! To  reset password switch by <a href="${resetLink}">RESET PASSWORD</a> You are truly awesome!`
		});
	},
	async resetPassword(salt, password) {
		const user = await userController.findUser({ resetPasswordSalt: salt });
		// if user with current salt does not exist throw error
		if (!user) throw errorCreator(UserErrors.existing, 401);

		const pass = password || '';
		password = md5(pass);
		user.resetPasswordSalt = '';
		user.password = password;
		await user.save();
	}
};

export default authController;
