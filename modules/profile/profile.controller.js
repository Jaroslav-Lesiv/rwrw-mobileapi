import _ from 'lodash';
import database from '../../database/mongoose';
import flatten from 'flat';
import { errorCreator } from '../../utils';
import locationController from '../locations/location.controller';

const profileController = {
	/**
	 * @param  {} _id
	 * @param  {_id}} {constprofile=awaitdatabase.ProfileModel.findOne({_id
	 */
	async getProfile(_id) {
		const profile = await database.ProfileModel.findOne({ _id: _id });

		return profile;
	},
	// Create user profile
	async createProfile(user, profile) {
		// throw error if user already have profile
		if (user.profile) throw errorCreator('User already match profile');
		// create new profile

		const city = await locationController.findOneLocation({ _id: profile.city });

		if (!city) throw errorCreator('', 400, { city: 'Select wrong city' });
		const createdProfile = await database.ProfileModel.create(
			flatten({
				...profile,
				city: { _id: city.id, lat: city.lat, lng: city.lng, label: city.label, type: city.type },
				user: user.id
			})
		);
		// save profile._id to user as profile
		user.profile = createdProfile._id;
		await user.save();

		return createdProfile;
	},
	/**
	 * @param  {} user
	 * @param  {} profile
	 * @param  {user.id}} {constupdatedProfile=awaitdatabase.ProfileModel.findOneAndUpdate({user
	 * @param  {} flatten({...profile}
	 * @param  {true}} {new
	 */
	async updateProfile(user, profile) {
		const city = await locationController.findOneLocation({ _id: profile.city });
		if (!city) throw errorCreator('', 400, { city: 'Select wrong city' });
		const updatedProfile = await database.ProfileModel.findOneAndUpdate(
			{ user: user.id },
			flatten({
				...profile,
				city: { _id: city.id, lat: city.lat, lng: city.lng, label: city.label, type: city.type }
			}),
			{
				new: true
			}
		);
		if (!updatedProfile) {
			throw errorCreator('User not match profile');
		}
		return updatedProfile;
	}
};

export default profileController;
