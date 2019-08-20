import { Router } from 'express';
import paymentController from './payment.controller';
import { validation } from '../../utils';
import { EMPTY_VALIDATION } from '../../constants';

const PaymentsRouter = new Router();
/**
 * @param  {} '/subscriptions'
 * @param  {} validation(EMPTY_VALIDATION
 * @param  {} async(req
 * @param  {} res
 * @param  {} next
 * @param  {} =>{try{constsubscriptions=awaitpaymentController.findSubscriptions(
 * @param  {} ;res.status(200
 * @param  {} .json({subscriptions}
 * @param  {} ;}catch(error
 * @param  {} {next(error
 * @param  {} ;}}
 */

PaymentsRouter.get('/subscriptions', validation(EMPTY_VALIDATION), async (req, res, next) => {
	try {
		// find lists of subscriptions
		const subscriptions = await paymentController.findSubscriptions();
		res.status(200).json({ subscriptions });
	} catch (error) {
		next(error);
	}
});

export default PaymentsRouter;
