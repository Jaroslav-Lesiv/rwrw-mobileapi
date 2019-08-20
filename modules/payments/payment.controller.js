import stripe from 'stripe';
import { errorCreator, handleStripeError } from '../../utils';
import { subscriptions } from '../../database/collections/subscriptions';
import { handleInvoice, getInvoiceName } from '../../utils/invoices';
import moment from 'moment';

const stripeClient = stripe(process.env.STRIPE_API_KEY);

const paymentController = {
	/**
	 * @param  {} {returnsubscriptions;}
	 */
	async findSubscriptions() {
		return subscriptions;
	},

	/**
	 * @param  {} _id
	 * @param  {} {constsubscription=subscriptions.find(subscription=>subscription.subscriptions_id===_id
	 * @param  {} ;if(!subscription
	 * @param  {} throwerrorCreator('Pleaseselectexistingsubscription'
	 * @param  {} 400
	 * @param  {} ;returnsubscription;}
	 */
	findSubscriptionById(_id) {
		const subscription = subscriptions.find(subscription => subscription.subscriptions_id === _id);
		if (!subscription) throw errorCreator('Please select existing subscription', 400);
		return subscription;
	},
	/**
	 * @param  {} card
	 * @param  {{number:card.number} {try{returnawaitstripeClient.tokens.create({card
	 * @param  {card.exp_month} exp_month
	 * @param  {card.exp_year} exp_year
	 * @param  {card.cvc}}} cvc
	 */
	async createStripeCardToken(card) {
		try {
			// create stripe card token
			// docs [https://stripe.com/docs/api/tokens/create_card]
			return await stripeClient.tokens.create({
				card: {
					number: card.number,
					exp_month: card.exp_month,
					exp_year: card.exp_year,
					cvc: card.cvc
				}
			});
		} catch (error) {
			throw errorCreator(handleStripeError(error), 400);
		}
	},
	/**
	 * @param  {} user
	 * @param  {} cardId
	 * @param  {} {try{returnawaitstripeClient.customers.updateCard(user.stripe.customerId
	 * @param  {} user.stripe.cardId
	 * @param  {`${user.first_name}${user.last_name}`} {name
	 * @param  {cardId}} id
	 */
	async updateStripeMemberCard(user, cardId) {
		try {
			// update stripe card
			// docs [https://stripe.com/docs/api/cards/update]
			return await stripeClient.customers.updateCard(user.stripe.customerId, user.stripe.cardId, {
				name: `${user.first_name} ${user.last_name}`,
				id: cardId
			});
		} catch (error) {
			throw errorCreator(handleStripeError(error), 400);
		}
	},
	/**
	 * @param  {} user
	 * @param  {} cardToken
	 * @param  {`Customerfor${user.email}`} {try{returnawaitstripeClient.customers.create({description
	 * @param  {cardToken}} source
	 */
	async createStripeMember(user, cardToken) {
		try {
			// Create new stripe customer
			// docs [https://stripe.com/docs/api/customers/create]
			return await stripeClient.customers.create({
				description: `Customer for ${user.email}`,
				source: cardToken // obtained with Stripe.js
			});
		} catch (error) {
			throw errorCreator(handleStripeError(error), 400);
		}
	},
	/**
	 * @param  {} user
	 * @param  {} {try{awaitstripeClient.customers.del(user.stripe.customerId
	 * @param  {} ;}catch(error
	 * @param  {} {throwerrorCreator(handleStripeError(error
	 * @param  {} 400
	 * @param  {} ;}}
	 */
	async deleteStripeMember(user) {
		try {
			// delete stripe customers
			// docs [https://stripe.com/docs/api/customers/delete]
			await stripeClient.customers.del(user.stripe.customerId);
		} catch (error) {
			throw errorCreator(handleStripeError(error), 400);
		}
	},
	/**
	 * @param  {} user
	 * @param  {} {try{constsubscription=this.findSubscriptionById(user.subscription.subscriptions_id
	 * @param  {user.payments.stripeToken} ;conststripeSubscription=awaitstripeClient.subscriptions.create({customer
	 * @param  {[{plan:subscription.subscriptions_id}]}} items
	 */
	async subscribeStripe(user) {
		try {
			console.log('SUBSCRIPTION');
			// find subscription in existing
			const subscription = process.env.STRIPE_SUBSCRIPTION_ID;
			console.log({ subscription, user });
			// subscribe user by stripe plan
			const stripeSubscription = await stripeClient.subscriptions.create({
				customer: user.stripe.customerId,
				items: [
					{
						plan: subscription
					}
				]
			});

			const invoiceOptions = {
				amount: stripeSubscription.plan.amount,
				date: moment().format('DD/MM/YY'),
				account: user.stripe.customerId,
				reference: stripeSubscription.id
			};

			const invoice = await handleInvoice(invoiceOptions);

			console.log(invoiceOptions, getInvoiceName(invoice));

			user.stripe.subscription = stripeSubscription.id;
			user.invoices = [{ ...invoiceOptions, name: getInvoiceName(invoice), path: invoice }, ...user.invoices];
			await user.save();

			return stripeSubscription;
		} catch (error) {
			console.log({ error });
			throw errorCreator(handleStripeError(error), 400);
		}
	},
	async getSubscription(user) {
		if (!user.stripe.subscription) throw errorCreator('User doe`s not have subscription');
		try {
			const subscription = await stripeClient.subscriptions.retrieve(user.stripe.subscription);
			return subscription;
		} catch (error) {
			throw errorCreator(handleStripeError(error), 400);
		}
	},

	async verifyUserSubscription(user) {
		try {
			const subscription = await this.getSubscription(user);
			const enabled = subscription.status === 'active';
			user.enabled = enabled;
			await user.save();
			console.log(user.email, ' : ', { enabled });
			return enabled;
		} catch (error) {
			user.enabled = false;
			await user.save();
			console.log('FAILED');
			return false;
		}
	}
};

export default paymentController;
