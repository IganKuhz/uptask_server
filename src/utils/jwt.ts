import jwt from 'jsonwebtoken';
import Types from 'mongoose';

type UserPayload = {
	id: Types.ObjectId;
};

export function generateJWToken(payload: UserPayload): string {
	const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
		expiresIn: '3h',
	});
	return token;
}
