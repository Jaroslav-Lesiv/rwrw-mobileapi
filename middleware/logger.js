import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
/**
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @param  {} =>{if(process.env.NODE_ENV==='production'
 * @param  {} {constaccessLogStream=fs.createWriteStream(path.join(__dirname
 * @param  {} '../logs'
 * @param  {} 'access.log'
 * @param  {'a'}} {flags
 */
export const withLogger = (req, res, next) => {
	if (process.env.NODE_ENV === 'production') {
		// create a write stream (in append mode)
		const accessLogStream = fs.createWriteStream(path.join(__dirname, '../logs', 'access.log'), { flags: 'a' });

		// setup the logger
		morgan('combined', { stream: accessLogStream })(req, res, next);
	} else {
    // log to console
		morgan('dev')(req, res, next);
	}
};
