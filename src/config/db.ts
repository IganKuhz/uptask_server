import mongoose from 'mongoose';

export const connectDB = async () => {
	try {
		const connection = await mongoose.connect(process.env.MONGO_URL!);
		const url = connection.connection.host + ':' + connection.connection.port;
		console.log(`🍃 MongoDB connected: ${url}`.cyan.underline.bold);
	} catch (error) {
		console.log(error.message.red.bold);
		process.exit(1);
	}
};
