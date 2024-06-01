import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import { corsConfing } from './config/cors';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import projectsRoutes from './routes/projectRoutes';

dotenv.config();
connectDB();

// Create an Express application
const app = express();

// To allow CORS
app.use(cors(corsConfing));

// To log the requests
app.use(morgan('dev'));

// To recognize the incoming Request Object as a JSON Object.
app.use(express.json());

// To use the routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);

export default app;
