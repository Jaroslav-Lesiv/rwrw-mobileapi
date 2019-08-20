import database from '../../database/mongoose';

const locationController = {
	/**
	 * @param  {} params
	 * @param  {} {returnawaitdatabase.LocationModel.find(params
	 */
	async findLocations(params) {
		return await database.LocationModel.find(params);
	},

	async findOneLocation(params) {
		return await database.LocationModel.findOne(params, { _id: 1, lat: 1, lng: 1, label: 1, type: 1 });
	}
};

export default locationController;
