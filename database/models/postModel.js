import { Schema } from 'mongoose';

const ObjectId = Schema.ObjectId;

const PostSchema = new Schema(
	{
		profile: { type: ObjectId, ref: 'Profile', required: true },
		title: { type: String, maxLength: 50, required: true },
		image: { type: String, required: true },
		description: { type: String, maxLength: 500, required: true }
	},
	{ timestamps: true }
);

/**
 *
 *call populate for posts to get post profile
 */
function populatePost() {
	this.populate('profile');
}
/**
 * @param  {} 'findOne'
 * @param  {} populatePost
 */
PostSchema.pre('findOne', populatePost);
/**
 * @param  {} 'find'
 * @param  {} populatePost
 */
PostSchema.pre('find', populatePost);
/**
 * @param  {} 'save'
 * @param  {} populatePost
 */
PostSchema.post('save', async function () {
	await this.populate()
});

export default PostSchema;
