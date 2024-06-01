import type { Request, Response } from 'express';
import Task from '../models/Task';

export class TaskController {
	static createTask = async (req: Request, res: Response) => {
		try {
			const task = new Task({ ...req.body, project: req.project._id });
			req.project.tasks.push(task.id);
			await Promise.allSettled([task.save(), req.project.save()]);
			res.send('Tarea creada exitosamente.');
		} catch (error) {
			console.log(error); //TODO: Change this to a proper error handling
		}
	};

	static getAllTasks = async (req: Request, res: Response) => {
		try {
			const tasks = await Task.find({ project: req.project._id }).populate(
				'project'
			);
			res.json(tasks);
		} catch (error) {
			console.log(error); //TODO: Change this to a proper error handling
		}
	};

	static getTaskById = async (req: Request, res: Response) => {
		try {
			const task = await Task.findById(req.task.id)
				.populate({
					path: 'completedBy.user',
					select: 'userName email id',
				})
				.populate({
					path: 'notes',
					populate: {
						path: 'createdBy',
						select: 'userName email id',
					},
				});
			res.json(task);
		} catch (error) {
			console.log(error); //TODO: Change this to a proper error handling
		}
	};

	static updateTask = async (req: Request, res: Response) => {
		try {
			await req.task.updateOne(req.body);
			res.send('Tarea actualizada exitosamente.');
		} catch (error) {
			console.log(error); //TODO: Change this to a proper error handling
		}
	};

	static deleteTask = async (req: Request, res: Response) => {
		try {
			// Remove the task from the project
			req.project.tasks = req.project.tasks.filter(
				task => task.toString() !== req.task.id.toString()
			);
			await Promise.allSettled([req.task.deleteOne(), req.project.save()]);
			res.send('Tarea actualizada exitosamente.');
		} catch (error) {
			console.log(error); //TODO: Change this to a proper error handling
		}
	};

	static updateTaskStatus = async (req: Request, res: Response) => {
		try {
			const { status } = req.body;
			req.task.status = status;

			const statusHistory = {
				user: req.user.id,
				status,
			};

			req.task.completedBy.push(statusHistory);

			await req.task.save();
			res.send('Estado de la tarea actualizado exitosamente.');
		} catch (error) {
			console.log(error); //TODO: Change this to a proper error handling
		}
	};

	// static duplicateTask = async (req: Request, res: Response) => {
	// 	const { taskId } = req.params;
	// 	try {
	// 		const task = await Task.findById(taskId);

	// 		const newTask = new Task({
	// 			...task.toObject(),
	// 			_id: undefined,
	// 			taskName: `${task.taskName} (Copia)`,
	// 		});
	// 		await newTask.save();
	// 		res.send('Tarea duplicada exitosamente.');
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };
}
