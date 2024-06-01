import type { Request, Response } from 'express';
import Project from '../models/Project';

export class ProjectController {
	// Create a new project
	static createProject = async (req: Request, res: Response) => {
		const project = new Project(req.body);

		// Set the manager of the project
		project.manager = req.user.id;

		// Save the project
		try {
			await project.save();
			// Check if the project was created
			if (!project) {
				const error = new Error('No se pudo crear el proyecto');
				return res.status(400).send({ error: error.message });
			}

			res.send('Proyecto creado exitosamente');
		} catch (error) {
			console.log(error);
		}
	};

	// Get all projects
	static getAllProjects = async (req: Request, res: Response) => {
		try {
			const projects = await Project.find({
				// Find projects where the user is the manager
				$or: [
					{
						manager: { $in: req.user.id },
					},
					{
						team: { $in: req.user.id },
					},
				],
			});
			// Check if the projects exists
			if (!projects) {
				const error = new Error('No se encontraron proyectos disponibles.');
				return res.status(404).send({ error: error.message });
			}

			res.json(projects);
		} catch (error) {
			console.log(error);
		}
	};

	static getProjectById = async (req: Request, res: Response) => {
		const { id } = req.params;
		try {
			const project = await Project.findById(id).populate('tasks');
			// Check if the project exists
			if (!project) {
				const error = new Error(
					'No se encontró ningun el proyecto con el ID proporcionado.'
				);
				return res.status(404).send({ error: error.message });
			}

			// Check if the user is the manager of the project
			if (
				project.manager.toString() !== req.user.id.toString() &&
				!project.team.includes(req.user.id)
			) {
				const error = new Error('No tienes permiso para realizar esta acción.');
				return res.status(403).send({ error: error.message });
			}

			res.json(project);
		} catch (error) {
			console.log(error);
		}
	};

	static updateProject = async (req: Request, res: Response) => {
		try {
			// const project = await Project.findById(id);
			// Check if the project exists
			// if (!project) {
			// 	return res.status(404).send('Proyecto no encontrado.');
			// }
			// Check if the user is the manager of the project
			// if (project.manager.toString() !== req.user.id.toString()) {
			// 	const error = new Error('No tienes permiso para realizar esta acción.');
			// 	return res.status(403).send({ error: error.message });
			// }

			// await project.updateOne(req.body);
			await req.project.updateOne(req.body);
			res.send('Proyecto actualizado exitosamente.');
		} catch (error) {
			console.log(error);
		}
	};

	static deleteProject = async (req: Request, res: Response) => {
		// const { id } = req.params;
		try {
			// const project = await Project.findById(id);
			// Check if the project exists
			// if (!project) {
			// 	const error = new Error(
			// 		'No se encontró ningun el proyecto con el ID proporcionado.'
			// 	);
			// 	return res.status(404).json({ error: error.message });
			// }

			// Check if the user is the manager of the project
			// if (project.manager.toString() !== req.user.id.toString()) {
			// 	const error = new Error('No tienes permiso para realizar esta acción.');
			// 	return res.status(403).send({ error: error.message });
			// }

			// await project.deleteOne();
			await req.project.deleteOne();
			res.send('Proyecto eliminado exitosamente.');
		} catch (error) {
			console.log(error);
		}
	};

	// static deleteAllProjects = async (req: Request, res: Response) => {
	// 	try {
	// 		await Project.deleteMany({});
	// 		res.send('Todos los proyectos han sido eliminados.');
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// };

	static duplicateProject = async (req: Request, res: Response) => {
		// const { projectId } = req.params;
		try {
			// const project = await Project.findById(id);
			// if (!project) {
			// 	const error = new Error(
			// 		'No se encontró ningun el proyecto con el ID proporcionado.'
			// 	);
			// 	return res.status(404).json({ error: error.message });
			// }
			const newProject = new Project({
				...req.project.toObject(),
				_id: undefined,
				projectName: req.project.projectName + ' (Copia)',
			});
			// newProject._id = undefined;
			await newProject.save();
			res.send('Proyecto duplicado exitosamente.');
		} catch (error) {
			console.log(error);
		}
	};
}
