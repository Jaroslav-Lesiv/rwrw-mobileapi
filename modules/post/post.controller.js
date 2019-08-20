import flatten from 'flat';
import database from '../../database/mongoose';
import { errorCreator } from '../../utils';
import profileController from '../profile/profile.controller';

const postController = {
	/**
	 * @param  {} _id
	 * @param  {} {constpost=awaitdatabase.PostModel.findOne({_id}
	 * @param  {} ;returnpost}
	 */
	async getPost(_id) {
		// find one existing post
		const post = await database.PostModel.findOne({ _id });
		return post;
	},
	/**
	 * @param  {} params={}
	 * @param  {} {constposts=awaitdatabase.PostModel.find(params
	 * @param  {} ;returnposts;}
	 */
	async findPosts(params = {}) {
		const posts = await database.PostModel.find(params);
		return posts;
	},
	/**
	 * @param  {} user
	 * @param  {} {title
	 * @param  {} image
	 * @param  {} description}
	 * @param  {} {if(!user.profile
	 * @param  {} throwerrorCreator('Needtocreateprofileatfirst'
	 * @param  {} 400
	 * @param  {user.profile} constpost=awaitdatabase.PostModel.create({profile
	 * @param  {} title
	 * @param  {} image
	 * @param  {} description}
	 * @param  {} ;returnpost;}
	 */
	async createPost(user, { title, image, description }) {
		// throw error if user does not create profile and trying to create post
		if (!user.profile) throw errorCreator('Need to create profile at first', 400);

		if (!image) {
			const profile = await profileController.getProfile(user.profile)
			image = profile.backgroundImage
		}

		const post = await database.PostModel.create({
			profile: user.profile,
			title,
			image,
			description
		});

		await database.PostModel.populate(post, { path: 'profile' });

		return post;
	},
	/**
	 * @param  {} user
	 * @param  {} {_id
	 * @param  {} ...post}
	 * @param  {} {constpost=awaitdatabase.PostModel.findOneAndUpdate({_id
	 * @param  {user.profile}} profile
	 * @param  {} flatten(post
	 * @param  {true}} {new
	 */
	async updatePost(user, { _id, ...post }) {
		const updatedPost = await database.PostModel.findOneAndUpdate({ _id, profile: user.profile }, flatten(post), {
			new: true
		});
		// throw error if post not exist or user not have permission to change this post
		if (!updatedPost) throw errorCreator('Post doe`s not exist');
		return updatedPost;
	},
	/**
	 * @param  {} user
	 * @param  {} {_id}
	 * @param  {} {awaitdatabase.PostModel.findOneAndDelete({_id
	 * @param  {user.profile}} profile
	 */
	async deletePost(user, { _id }) {
		await database.PostModel.findOneAndDelete({ _id, profile: user.profile });
	}
};

export default postController;
