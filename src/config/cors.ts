import { CorsOptions } from 'cors';

export const corsConfing: CorsOptions = {
	origin: function (origin, callback) {
		const whitelist = [process.env.CLIENT_URL!];

		// Allow API requests if the flag --api is passed
		if (process.argv[2] === '--api') {
			whitelist.push(undefined);
		}

		
		if (whitelist.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('Conexión no permitida por CORS'));
		}
	},
};
