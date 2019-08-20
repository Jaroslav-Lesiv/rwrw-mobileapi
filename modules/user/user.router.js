import { Router } from 'express';

import userController from './user.controller';
import { validation, getRegistrationStep } from '../../utils';
import userValidation from './user.validation';
import { VerifyAuth } from '../../middleware/auth';
import { allowedUserFields } from '../../database/models/userModel';
import { EMPTY_VALIDATION } from '../../constants';
import database from '../../database/mongoose';
import paymentController from '../payments/payment.controller';

const UserRouter = new Router();

// update self account
UserRouter.put('/', VerifyAuth, validation(userValidation.updateSelf), async (req, res, next) => {
	try {
		const user = await userController.updateUser(req.user, req.body);
		res.status(202).json({ user: user });
	} catch (error) {
		next(error);
	}
});

UserRouter.put('/password', VerifyAuth, validation(userValidation.changePassword), async (req, res, next) => {
	try {
		await userController.updatePassword(req.user, req.body);
		res.status(202).json({});
	} catch (error) {
		next(error);
	}
});

// delete self account
UserRouter.delete('/', VerifyAuth, validation(EMPTY_VALIDATION), async (req, res, next) => {
	try {
		await userController.deleteUser(req.user);
		res.status(202).json({});
	} catch (error) {
		next(error);
	}
});

// get self
UserRouter.get('/me', VerifyAuth, validation(EMPTY_VALIDATION), async (req, res, next) => {
	try {
		// get registration step if user not register fully
		const registrationStep = getRegistrationStep(req.user);
		res.status(200).json({ user: req.user, step: registrationStep });
	} catch (error) {
		next(error);
	}
});

// create user subscription
UserRouter.post('/subscription', VerifyAuth, validation(EMPTY_VALIDATION), async (req, res, next) => {
	try {
		const user = await userController.createUserSubscription(req.user);
		const registrationStep = getRegistrationStep(user);
		res.status(202).json({ step: registrationStep, subscription: user.subscription });
	} catch (error) {
		next(error);
	}
});

// create user payment card
UserRouter.post('/payment-card', VerifyAuth, validation(userValidation.createCard), async (req, res, next) => {
	try {
		const card = await userController.createStripePaymentCredentials(req.user, req.body);
		res.status(202).json({ card, step: 'registered' });
	} catch (error) {
		next(error);
	}
});
// update user card
UserRouter.put('/payment-card', VerifyAuth, validation(userValidation.updateCard), async (req, res, next) => {
	try {
		const card = req.body;
		await userController.updateStripePaymentCredentials(req.user, card);
		res.status(202).json({});
	} catch (error) {
		next(error);
	}
});

// create user subscription
UserRouter.put('/active', VerifyAuth, validation(userValidation.updateActive), async (req, res, next) => {
	try {
		await userController.updateActive(req.user, req.body.active);
		res.status(202).json({});
	} catch (error) {
		next(error);
	}
});

// Invoices
UserRouter.get('/invoices', VerifyAuth, validation(userValidation.getInvoices), async (req, res, next) => {
	try {
		const invoices = await userController.getInvoices(req.user, req.query.last);
		res.status(200).json({ invoices });
	} catch (error) {
		next(error);
	}
});

// testing
UserRouter.post('/test', VerifyAuth, validation(EMPTY_VALIDATION), async (req, res, next) => {
	try {
		const user = await database.UserModel.findOne({ _id: req.user._id })
		// await paymentController.subscribeStripe(user)

		await paymentController.getSubscription(user)
		res.status(200).json({ success: true });
	} catch (error) {
		next(error);
	}
});
export default UserRouter;
