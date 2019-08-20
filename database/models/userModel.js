import { Schema } from 'mongoose';
import md5 from 'md5';
import _ from 'lodash';
import jwt from 'jsonwebtoken';

export const getFreeSubscription = () => {
	const date = new Date();
	return new Date(date.setDate(date.getDate() + Number(process.env.SUBSCRIPTION_PERIOD)));
};

const ObjectId = Schema.ObjectId;
/**
 * @param  {{type:Boolean} {active
 * @param  {false}} default
 * @param  {{type:Boolean} approved
 * @param  {false}} default
 * @param  {{type:String} firstName
 * @param  {true} required
 * @param  {25}} maxLength
 * @param  {{type:String} lastName
 * @param  {true} required
 * @param  {25}} maxLength
 * @param  {{type:String} card
 * @param  {25} maxLength
 * @param  {null}} default
 * @param  {{type:String} email
 * @param  {true} required
 * @param  {true}} lowercase
 * @param  {{type:String}} salt
 * @param  {{type:String} password
 * @param  {true}} required
 * @param  {{type:Schema.Types.Mixed} subscription
 * @param  {{}}} default
 * @param  {{type:String} 'stripe.cardId'
 * @param  {null}} default
 * @param  {{type:String} 'stripe.customerId'
 * @param  {null}} default
 * @param  {{type:String} 'stripe.subscription'
 * @param  {null}} default
 * @param  {{type:ObjectId} profile
 * @param  {'Profile'}}} ref
 * @param  {true}} {timestamps
 */
const UserSchema = new Schema(
	{
		// toggle for user
		active: { type: Boolean, default: false },
		// is approved by admin
		approved: { type: Boolean, default: false },
		// is enabled
		enabled: { Type: Boolean, default: false},

		firstName: { type: String, required: true, maxLength: 25 },
		lastName: { type: String, required: true, maxLength: 25 },
		card: { type: String, maxLength: 25, default: null },
		city: { type: {}, default: {} },
		email: {
			type: String,
			required: true,
			lowercase: true
		},
		salt: {
			type: String
		},
		password: { type: String, required: true },
		resetPasswordSalt: { type: String },
		subscription: { type: Object, default: {} },
		invoices: [],

		'stripe.cardId': { type: String, default: null },
		'stripe.customerId': { type: String, default: null },
		'stripe.subscription': { type: String, default: null },
		profile: { type: ObjectId, ref: 'Profile' },

	},
	{ timestamps: true }
);
/**
 * @param  {} password
 * @param  {} {consthashed_password=md5(password
 */
UserSchema.methods.verifyPassword = function(password) {
	const hashed_password = md5(password);
	return this.password === hashed_password;
};
/**
 * @param  {} password
 * @param  {} {this.password=md5(password
 */
UserSchema.methods.setPassword = function(password) {
	this.password = md5(password);
};
/**
 * @param  {this._id} {returnjwt.sign({userId
 * @param  {this.email}} email
 * @param  {} process.env.SECRET
 * @param  {process.env.TOKEN_LIFE_CYCLE}} {expiresIn
 */
UserSchema.methods.generateJWT = function() {
	return jwt.sign(
		{
			userId: this._id,
			email: this.email
		},
		process.env.SECRET,
		{
			expiresIn: process.env.TOKEN_LIFE_CYCLE
		}
	);
};
/**
 * @param  {string} salt
 * @param  {} {this.salt=salt;this.confirmed=false;this.save(
 */
UserSchema.methods.setConfirmEmailSalt = function(salt) {
	this.salt = salt;
	this.confirmed = false;
	this.save();
};
/**
 * @param  {} user
 * @param  {user.email}} {constself=this;constexist=awaitself.findOne({email
 */
UserSchema.statics.findOneOrCreate = async function(user) {
	const self = this;
	const exist = await self.findOne({ email: user.email });
	if (!exist) {
		return await self.create(user);
	}
	return exist;
};
/**
 * @param  {} {this.confirmed=true;this.salt=null;this.save(
 */
UserSchema.methods.confirmEmail = function() {
	this.confirmed = true;
	this.salt = null;
	this.save();
};

export const allowedUserFields = [
	'subscription',
	'approved',
	'active',
	'_id',
	'profile',
	'email',
	'firstName',
	'payments',
	'lastName'
];

export default UserSchema;
