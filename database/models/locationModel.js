import { Schema } from 'mongoose';

const LocationSchema = new Schema(
	{
		lat: { type: String, required: true },
		lng: { type: String, required: true },
		label: { type: String, required: true },
		type: { type: String, required: true }
	},
	{ timestamps: true }
);

export const allowedLocationFields = ['lat', 'lng', 'label', 'type', '_id'];

export default LocationSchema;
