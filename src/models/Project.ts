import mongoose, { Document, PopulatedDoc, Schema, Types } from 'mongoose';
import Note from './Note';
import Task, { ITask } from './Task';
import { IUser } from './User';

// Defining the ProjectType
export interface IProject extends Document {
	projectName: string;
	clientName: string;
	description: string;
	tasks: PopulatedDoc<ITask & Document>[];
	manager: PopulatedDoc<IUser & Document>;
	team: PopulatedDoc<IUser & Document>[];
}

// Moongoose Schema for Project
const ProjectSchema: Schema = new Schema(
	{
		projectName: {
			type: String,
			required: true,
			trim: true,
		},
		clientName: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			required: true,
			trim: true,
		},
		tasks: [
			{
				type: Types.ObjectId,
				ref: 'Task',
			},
		],
		manager: {
			type: Types.ObjectId,
			ref: 'User',
		},
		team: [
			{
				type: Types.ObjectId,
				ref: 'User',
			},
		],
	},
	{ timestamps: true }
);

ProjectSchema.pre('deleteOne', { document: true }, async function () {
	const projectId = this._id;
	if (!projectId) return;

	// Find all tasks related to the project
	const tasks = await Task.find({ project: projectId });
	for (const task of tasks) {
		// Delete all notes related to the task
		await Note.deleteMany({ task: task.id });
	}
	// Delete all tasks related to the project
	await Task.deleteMany({ project: projectId });
});

const Project = mongoose.model<IProject>('Project', ProjectSchema);
export default Project;
