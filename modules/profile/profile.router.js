import { Router } from 'express';
import { validation, getRegistrationStep } from '../../utils';
import profileValidation from './profile.validation';
import profileController from './profile.controller';
import { VerifyAuth } from '../../middleware/auth';

const ProfileRouter = new Router();

// public
ProfileRouter.get('/:_id', validation(profileValidation.getProfile), async (req, res, next) => {
	try {
		const profile = await profileController.getProfile(req.params._id);

		res.status(200).json({ profile });
	} catch (error) {
		next(error);
	}
});

ProfileRouter.post('/', VerifyAuth, validation(profileValidation.createProfile), async (req, res, next) => {
	try {
		const profile = await profileController.createProfile(req.user, req.body);
		console.log(profile)
		res.status(200).json({ profile, step: '/dashboard' });
	} catch (error) {
		next(error);
	}
});

ProfileRouter.put('/:_id', VerifyAuth, validation(profileValidation.updateProfile), async (req, res, next) => {
	try {
		const profile = await profileController.updateProfile(req.user, req.body);

		res.status(200).json({ profile });
	} catch (error) {
		next(error);
	}
});

export default ProfileRouter;
