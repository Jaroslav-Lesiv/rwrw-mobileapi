import database from '../../database/mongoose';

const feedbackController = {
	async createFeedback(feedback) {
		await database.FeedBackModel.create(feedback);
	}
};

export default feedbackController;
