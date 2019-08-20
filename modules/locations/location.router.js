import { Router } from 'express';

import locationController from './location.controller';
import locationValidation from './location.validation';
import { validation } from '../../utils';

const LocationRouter = new Router();

LocationRouter.get('/', validation(locationValidation.getLocation), async (req, res, next) => {
	try {
		// find location by params
		// allowed params sets in validation
		const locations = await locationController.findLocations(req.query);
		res.status(200).json({ locations: locations });
	} catch (error) {
		next(error);
	}
});

export default LocationRouter;
