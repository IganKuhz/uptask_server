import mongoose, { Document, Schema } from 'mongoose';

// const userRoles = {
// 	USER: 'user',
// 	ADMIN: 'admin',
// 	UX_UI: 'ux-ui',
// 	WEB_DESIGNER: 'web-designer',
// 	FRONT_END: 'frontend',
// 	BACK_END: 'backend',
// 	DBA: 'dba',
// 	CLOUD_ARQ: 'cloud-arq',
// 	QUALITY_ASSUR: 'quality-assur',
// } as const;

// export type UserRoles = (typeof userRoles)[keyof typeof userRoles];

// Defining the UserType
export interface IUser extends Document {
	email: string;
	password: string;
	userName: string;
	confirmed: boolean;
	// role: UserRoles;
}

const userSchema: Schema = new Schema({
	email: {
		type: String,
		required: true,
		lowercase: true,
		unique: true,
		trim: true,
	},
	password: {
		type: String,
		requiered: true,
	},
	userName: {
		type: String,
		required: true,
		trim: true,
	},
	confirmed: {
		type: Boolean,
		default: false,
	},
	// role: {
	// 	type: String,
	// 	enum: Object.values(userRoles),
	// 	default: userRoles.USER,
	// },
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
