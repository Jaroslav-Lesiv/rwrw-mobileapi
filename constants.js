import complexity from 'joi-password-complexity';
export const SERVER_URL = `${process.env.SERVER_DOMAIN}${process.env.SERVER_PORT ? `:${process.env.SERVER_PORT}` : ''}`;
export const GOOGLE_CALLBACK = `${SERVER_URL}/api/v1/auth/google/callback`;
export const FACEBOOK_CALLBACK = `${SERVER_URL}/api/v1/auth/facebook/callback`;
export const EMAIL_CONFIRMATION_URL = `${SERVER_URL}/auth/verify-email`;

export const EMPTY_VALIDATION = {
	body: {},
	params: {},
	query: {}
};

export const APP_ROUTES = [
	'/auth',
	'/auth/login',
	'/auth/signin',
	'/auth/signup',
	'/auth/subscriptions',
	'/auth/payments',
	'/auth/registered',
	'/dashboard',
	'/profile',
	'/account',
	'/posts',
	'/support'
];

export const passwordComplexValidation = new complexity({
	min: 6,
	max: 30,
	numeric: 1,
	required: true
});
