import flatten from 'flat';
import _ from 'lodash';
import md5 from 'md5';
import moment from 'moment';
import database from '../../database/mongoose';
import UserErrors from '../../errors/user';
import { createCardView, errorCreator } from '../../utils';
import paymentController from '../payments/payment.controller';
import { getFreeSubscription } from '../../database/models/userModel';

const userController = {
	// Create user account
	/**
	 * @param  {} user
	 * @param  {user.email}} {constexist=awaitdatabase.UserModel.findOne({email
	 */
	async createUser(user) {
		// check if user with the same email exist
		const exist = await database.UserModel.findOne({ email: user.email });
		if (exist) throw { status: 400, message: 'User already exists' };
		// hashing user password
		const pass = user.password || '';
		user.password = md5(pass);
		// return new user
		return await database.UserModel.create(flatten(user));
	},

	// Delete user account
	// PRIVATE
	/**
	 * @param  {} user
	 * @param  {} {if(!user
	 * @param  {} throwerrorCreator(UserErrors.selection
	 * @param  {} 400
	 * @param  {} ;awaitpaymentController.deleteStripeMember(user
	 * @param  {} ;user.delete(
	 * @param  {} ;}
	 */
	async deleteUser(user) {
		if (!user) throw errorCreator(UserErrors.selection, 400);
		await paymentController.deleteStripeMember(user);
		user.delete();
	},

	// Update user account
	// PRIVATE
	/**
	 * @param  {} user
	 * @param  {} userOptions
	 * @param  {} {if(!user||!userOptions||_.isEmpty(userOptions
	 * @param  {} throwerrorCreator(`Pleaseselectvalidparamstoupdateuser`
	 * @param  {user._id}} ;returndatabase.UserModel.findOneAndUpdate({_id
	 * @param  {} flatten({...userOptions}
	 * @param  {true}} {new
	 */
	async updateUser(user, userOptions) {
		if (!user || !userOptions || _.isEmpty(userOptions))
			throw errorCreator(`Please select valid params to update user`);

		return database.UserModel.findOneAndUpdate({ _id: user._id }, flatten({ ...userOptions }), { new: true });
	},

	// find user by params
	/**
	 * @param  {} params
	 * @param  {} {if(!params||!_.isObject(params
	 * @param  {} ||_.isEmpty(params
	 * @param  {} returnnull;constuser=awaitdatabase.UserModel.findOne(flatten(params
	 * @param  {} ;returnuser;}
	 */
	async findUser(params) {
		if (!params || !_.isObject(params) || _.isEmpty(params)) return null;
		const user = await database.UserModel.findOne(flatten(params), {
			password: 0,
			__v: 0,
			updatedAt: 0,
			createdAt: 0
		});
		return user;
	},

	// find and update user
	/**
	 * @param  {} searchParams
	 * @param  {} params
	 * @param  {} {if(!params||!_.isObject(params
	 * @param  {} ||_.isEmpty(params
	 * @param  {} throwerrorCreator(UserErrors.existing
	 * @param  {} ;constuser=awaitdatabase.UserModel.findAndUpdate(searchParams
	 * @param  {} params
	 * @param  {true}} {new
	 */
	async findAndUpdateUser(searchParams, params) {
		if (!params || !_.isObject(params) || _.isEmpty(params)) throw errorCreator(UserErrors.existing);
		const user = await database.UserModel.findAndUpdate(searchParams, params, { new: true });
		return user;
	},

	// USER PROFILE
	// PRIVATE
	/**
	 * @param  {} user
	 * @param  {} profile
	 * @param  {} {const_user=awaitthis.updateUser(user
	 * @param  {} {profile}
	 * @param  {} ;return_user.profile;}
	 */
	async createUserProfile(user, profile) {
		const _user = await this.updateUser(user, { profile });
		return _user.profile;
	},
	// PRIVATE
	/**
	 * @param  {} user
	 * @param  {} profile
	 * @param  {} {const_user=awaitthis.updateUser(user
	 * @param  {} {profile}
	 * @param  {} ;return_user.profile;}
	 */
	async updateUserProfile(user, profile) {
		const _user = await this.updateUser(user, { profile });
		return _user.profile;
	},
	/**
	 * @param  {} userId
	 * @param  {} {if(!userId
	 * @param  {} returnnull;constuser=awaitdatabase.UserModel.findById(userId
	 * @param  {1}} {profile
	 */
	async findUserProfile(userId) {
		if (!userId) return null;
		const user = await database.UserModel.findById(userId, { profile: 1 });
		return user.profile;
	},
	// PRIVATE
	/**
	 * @param  {} user
	 * @param  {} subscriptionId
	 * @param  {} {constsubscription=awaitpaymentController.findSubscriptionById(subscriptionId
	 * @param  {} ;awaitthis.updateUser(user
	 * @param  {subscription}} {subscription
	 */
	async createUserSubscription(user) {
		if (!_.isEmpty(user.subscription)) throw errorCreator('User already have subscription', 400);
		// Check does subscription exist
		// create new subscription for user
		return await this.updateUser(user, { subscription: process.env.STRIPE_SUBSCRIPTION_ID });
	},

	// PRIVATE
	/**
	 * @param  {} user
	 * @param  {} card
	 * @param  {} {if(user.stripe.customerId
	 * @param  {} throwerrorCreator('Useralreadyhavestripecustomeraccount'
	 * @param  {} 400
	 * @param  {} ;conststripeCard=awaitpaymentController.createStripeCardToken(card
	 * @param  {} ;constcustomer=awaitpaymentController.createStripeMember(user
	 * @param  {} stripeCard.id
	 * @param  {} ;constcardView=createCardView(card.number
	 * @param  {} ;awaitthis.updateUser(user
	 * @param  {cardView} {card
	 * @param  {{cardId:stripeCard.card.id} stripe
	 * @param  {customer.id}}} customerId
	 */
	async createStripePaymentCredentials(user, card) {
		if (user.stripe.customerId) {
			return await this.updateStripePaymentCredentials(user, card);
		}
		const stripeCard = await paymentController.createStripeCardToken(card);
		const customer = await paymentController.createStripeMember(user, stripeCard.id);

		const cardView = createCardView(card.number);
		user.card = cardView;
		user.stripe.cardId = stripeCard.card.id;
		user.stripe.customerId = customer.id;
		await user.save();

		await paymentController.subscribeStripe(user);

		return cardView;
	},
	// PRIVATE
	/**
	 * @param  {} user
	 * @param  {} card
	 * @param  {} {conststripeCard=awaitpaymentController.createStripeCardToken(card
	 * @param  {} ;awaitpaymentController.updateStripeMemberCard(user
	 * @param  {} stripeCard.card.id
	 * @param  {} ;awaitthis.updateUser(user
	 * @param  {{cardId:stripeCard.card.id}}} {stripe
	 */
	async updateStripePaymentCredentials(user, card) {
		// create card token for new credentionals
		const stripeCard = await paymentController.createStripeCardToken(card);
		// update stripe member card
		console.log({ stripeCard });
		await paymentController.updateStripeMemberCard(user, stripeCard.card.id);
		// update user stripe card id
		await this.updateUser(user, { stripe: { cardId: stripeCard.card.id } });
	},
	/**
	 * @param  {} user
	 * @param  {} active
	 * @param  {} {returnawaitthis.updateUser(user
	 * @param  {active}} {active
	 */
	async updateActive(user, active) {
		return await this.updateUser(user, { active: active });
	},

	async updatePassword(user, { currentPassword = '', password }) {
		const updated = await database.UserModel.findOneAndUpdate(
			{ _id: user.id, password: md5(currentPassword) },
			{ password: md5(password) }
		);
		if (!updated) throw errorCreator('', 400, { updatingPassword: 'Wrong current password' });
	},

	async getInvoices(user, last) {
		return user.invoices;
	},

	async checkUserSubscription(user) {
		if (user.lastPaymentsDate) {
			console.log(getFreeSubscription(), user.lastPaymentsDate);
			// diff : available range -29 -> 0;
			const diff = moment().diff(moment(user.lastPaymentsDate), 'days');
			console.log({ diff });
			if (diff) {
				console.log('more');
				const subscription = await paymentController.subscribeStripe(user);
				await userController.updateUser(user, { stripe: { subscription: subscription.id } });
			}
		} else {
			user.lastPaymentsDate = getFreeSubscription();
			await user.save();
		}
	},

	async checkUserTrial(user) {
		if (!user.isTrial) return;

		const diff = moment().diff(moment(user.createdAt), 'days');
		console.log({ diff }, user);
		if (diff) {
			user.isTrial = false;
			await user.save();
		}
	}
};

export default userController;
