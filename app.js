import express from 'express';
import './config/config';
import path from 'path';
import fileUpload from 'express-fileupload';
import bodyParser from 'body-parser';
import helmet from 'helmet';
// required import
import database from './database/mongoose';
import passport from 'passport';
import router from './router';
import Ddos from 'ddos';

import cors from 'cors';
import { withLogger } from './middleware/logger';
import { exceptionHandler } from './middleware/errorHandler';
import { APP_ROUTES } from './constants';
import { runCron } from './middleware/cron';

const ddos = new Ddos({
	limit: process.env.DDOS_LIMIT,
	checkinterval: process.env.DDOS_INTERVAL,
	maxexpiry: process.env.DDOS_EXPIRY,
	errormessage: 'Max calls'
});

const app = express();

app.use(helmet());

app.use(
	cors({
		allowMethods: 'GET,POST,PUT,DELETE',
		credentials: true
	})
);

app.use(withLogger);
app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);

app.use(
	fileUpload({
		createParentPath: true,
		parseNested: true,
		abortOnLimit: true
	})
);
app.use(passport.initialize());

app.use(express.static('public'));
// app router
app.use(APP_ROUTES, (req, res, next) => {
	res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// init router
app.use('/api/v1', ddos.express, router);

app.use(exceptionHandler);

export const PORT = process.env.PORT || process.env.SERVER_PORT || 5656;

app.listen(PORT, () => {
	console.info(`Server started at PORT ${PORT}`);
	runCron();
});
