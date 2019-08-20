import { Schema } from 'mongoose';
import _ from 'lodash';

const ObjectId = Schema.ObjectId;

const FeedBackSchema = new Schema(
	{
		firstName: { type: String, required: true, maxLength: 25 },
		lastName: { type: String, required: true, maxLength: 25 },
		reason: {
			type: String,
			required: true,
			lowercase: true
		},
		email: {
			type: String,
			required: true,
			lowercase: true
		},
		description: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
);

export default FeedBackSchema;
