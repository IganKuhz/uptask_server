import type { NextFunction, Request, Response } from 'express';
import Task, { ITask } from '../models/Task';

declare global {
	namespace Express {
		interface Request {
			task?: ITask;
		}
	}
}

export async function validateTask(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { taskId } = req.params;
		const task = await Task.findById(taskId);
		if (!task) {
			const error = new Error('La tarea a la que intentas acceder no existe.');
			return res.status(404).json({ error: error.message });
		}
		req.task = task;
		next();
	} catch (error) {
		res.status(500).json({ error: `Hubo un error: ${error.message}` });
	}
}

export async function validateTaskProject(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (req.task.project.toString() !== req.project._id.toString()) {
		const error = new Error('La tarea no pertenece al proyecto.');
		return res.status(404).json({ error: error.message });
	}
	next();
}

export async function hasAuthorization(
	req: Request,
	res: Response,
	next: NextFunction
) {
	if (req.user.id.toString() !== req.project.manager.toString()) {
		const error = new Error('No tienes permisos para realizar esta acción');
		return res.status(404).json({ error: error.message });
	}
	next();
}
