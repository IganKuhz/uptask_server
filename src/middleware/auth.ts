import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

// To extend the Request object with a User property
declare global {
	namespace Express {
		interface Request {
			user?: IUser;
		}
	}
}

export const authenticate = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const bearer = req.headers.authorization;

	if (!bearer) {
		const error = new Error('Acción no autorizada');
		return res.status(401).json({ error: error.message });
	}

	const token = bearer.split(' ')[1];

	try {
		// This is the part where we decode the token and get the user
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		// If the token is valid, we can get the user from the database
		if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
			// We find the user by the id in the token and select only the id, userName, and email
			const user = await User.findById(decoded.id).select('_id userName email');
			// const user = await User.findById(decoded.id).select(
			// 	'_id userName email role'
			// );

			// If the user is found, we attach it to the request object
			if (user) {
				req.user = user;
				next();
			} else {
				res.status(500).json({ error: `Error al autenticar al usuario` });
			}
		}

		//
	} catch (error) {
		res.status(500).json({ error: `Error al autenticar al usuario` });
	}
};
