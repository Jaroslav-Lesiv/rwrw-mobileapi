import cron from 'node-cron';
import database from '../database/mongoose';
import paymentController from '../modules/payments/payment.controller';

export const runCron = () => {
	//will run every day at 12:00 AM
	cron.schedule('0 0 0 * * *', async () => {
		const users = database.UserModel.find({});
		users.map(user => {
			// verify user payments
			paymentController.verifyUserSubscription(user);
		});
	});
};
