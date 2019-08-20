import _ from 'lodash';
import path from 'path';
import fs from 'fs';
import fsExtra from 'fs-extra';

import { errorCreator } from '../utils';
import UploadErrors from '../errors/upload';

const allowedFileTypes = ['png', 'jpg', 'jpeg'];


export const writeFile = (dist, data) => new Promise((res, rej) => {
	fsExtra.outputFile(dist, data, (error) => {
		if (error) {
			rej(error)
		}
		res(dist)
	})
})
/**
 *
 *
 * @param {String} user_id
 * @param {any} file
 * @returns
 */
const uploadFile = async (user_id, file) => {
	try {
		const ext = file.mimetype.split('/').pop();
		if (!allowedFileTypes.includes(ext)) throw errorCreator(UploadErrors.fileType, 400);
		const filename = `${file.md5}.${ext}`;
		const relativePath = path.join('/images', 'users', `${user_id}`, filename);
		console.log(file);
		const filePath = path.join('public', relativePath);
		//
		console.log(filePath, relativePath);

		const ee = await writeFile(filePath, file.data);
		console.log({ee})
		return { path: relativePath };
	} catch (error) {
		return { error: error.message };
	}
};
/**
 * @param  {} req
 * @param  {} res
 * @param  {} next
 * @param  {} =>{if(Object.keys(req.files
 * @param  {} .length==0
 * @param  {} {throwerrorCreator(UploadErrors.existing
 * @param  {} 400
 * @param  {} ;}constuploads=awaitPromise.all(Object.values(req.files
 * @param  {} .map(asyncfile=>{if(Array.isArray(file
 * @param  {} {returnawaitPromise.all(file.map(file=>uploadFile(req.user._id
 * @param  {} file
 * @param  {} ;}else{returnawaituploadFile(req.user._id
 * @param  {} file
 * @param  {} ;}}
 * @param  {} ;constresult=Array.isArray(uploads[0]
 * @param  {} ?_.flatten(uploads
 */

export const UploadImage = async (req, res, next) => {
	if (Object.keys(req.files).length == 0) {
		throw errorCreator(UploadErrors.existing, 400);
	}

	const uploads = await Promise.all(
		Object.values(req.files).map(async file => {
			if (Array.isArray(file)) {
				return await Promise.all(file.map(file => uploadFile(req.user._id, file)));
			} else {
				return await uploadFile(req.user._id, file);
			}
		})
	);

	const result = Array.isArray(uploads[0]) ? _.flatten(uploads) : uploads[0];

	res.status(200).json({ uploads: result });
};

export const UploadImageLimit = (req, res, next) => {
	next(errorCreator('File size limit has been reached', 400));
};
