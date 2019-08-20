import { Router } from 'express';

import { validation } from '../../utils';
import { EMPTY_VALIDATION } from '../../constants';
import { patterns } from '../../client/src/constants/patterns';

const SourceRouter = new Router();

SourceRouter.get('/patterns', validation(EMPTY_VALIDATION),(req, res, next) => {
	try {
		res.status(200).json({ patterns: patterns });
	} catch (error) {
		next(error);
	}
});

export default SourceRouter;
