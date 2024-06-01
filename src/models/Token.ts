import mongoose, { Document, Schema, Types } from 'mongoose';

// Defining the UserType
export interface IToken extends Document {
	token: string;
	userId: Types.ObjectId;
	createdAt: Date;
}

const tokenSchema: Schema = new Schema({
	token: {
		type: String,
		required: true,
	},
	userId: {
		type: Types.ObjectId,
		ref: 'User',
		required: true,
	},
	expiresAt: {
		type: Date,
		default: Date.now(),
		expires: '7d', // This will make the token expire in 7 days
	},
});

const Token = mongoose.model<IToken>('Token', tokenSchema);

export default Token;
