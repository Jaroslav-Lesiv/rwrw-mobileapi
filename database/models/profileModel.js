import { Schema } from 'mongoose';
import _ from 'lodash';

const ObjectId = Schema.ObjectId;

const ProfileSchema = new Schema(
	{
		user: { type: ObjectId, ref: 'User', required: true },
		name: { type: String, maxLength: 50, required: true },
		city: { type: Object, required: true, default: {} },
		logo: { type: String, required: true },
		backgroundImage: { type: String, required: true },
		description: { type: String, maxLength: 200, required: true },
		address: { type: String, required: true, maxLength: 50 },
		postcode: { type: Schema.Types.Mixed, required: true },

		'stamp.total': {
			type: Number,
			default: 3,
			min: 3,
			max: 10
		},
		'stamp.color': { type: String, default: '#2d8c7a' },
		'stamp.backgroundColor': { type: String, default: '#faefa7' },
		'stamp.pattern': { type: String, default: '2' }
	},
	{ timestamps: true }
);

export default ProfileSchema;
