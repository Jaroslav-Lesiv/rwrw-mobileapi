import mongoose from 'mongoose';
import UserSchema from './models/userModel';
import PostSchema from './models/postModel';
import LocationSchema from './models/locationModel';
import ProfileSchema from './models/profileModel.js';
import FeedBackSchema from './models/feedBack';

const connection = mongoose.createConnection(
	`mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
	{
		user: process.env.DB_USER,
		pass: process.env.DB_PASSWORD || null,
		useNewUrlParser: true
	}
);
/**
 * @param  {} 'User'
 * @param  {} UserSchema
 */
const UserModel = connection.model('User', UserSchema);
/**
 * @param  {} 'Profile'
 * @param  {} ProfileSchema
 */
const ProfileModel = connection.model('Profile', ProfileSchema);
/**
 * @param  {} 'Post'
 * @param  {} PostSchema
 */
const PostModel = connection.model('Post', PostSchema);
/**
 * @param  {} 'Location'
 * @param  {} LocationSchema
 */
const LocationModel = connection.model('Location', LocationSchema);

const FeedBackModel = connection.model('FeedBack', FeedBackSchema);


const database = {
	UserModel,
	ProfileModel,
	PostModel,
	LocationModel,
	FeedBackModel
};

export default database;
