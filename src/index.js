import apiRouter from './router';

export default {
	async fetch(request, env, ctx) {

		return apiRouter.handle(request);

	},
};
