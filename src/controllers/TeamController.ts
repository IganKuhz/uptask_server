import type { Request, Response } from 'express';
import Project from '../models/Project';
import User from '../models/User';

export class TeamController {
	static findTeamMember = async (req: Request, res: Response) => {
		const { email } = req.body;
		// Find the user by email
		const user = await User.findOne({ email }).select('userName email id ');
		if (!user) {
			const error = new Error(
				'No se encontró ningun usuario con ese correo electrónico'
			);
			return res.status(404).send({ error: error.message });
		}
		res.json(user);
	};

	static getProjectTeam = async (req: Request, res: Response) => {
		const project = await Project.findById(req.project.id).populate({
			path: 'team',
			select: 'id userName email',
		});
		res.json(project.team);
	};

	static addMemberById = async (req: Request, res: Response) => {
		const { id } = req.body;
		// Find the user by id
		const user = await User.findById(id).select('id');
		if (!user) {
			const error = new Error('No se encontró al usuario');
			return res.status(404).send({ error: error.message });
		}

		// Check if the user is the project manager
		if (req.project.manager.toString() === user.id.toString()) {
			const error = new Error('Tu ya eres el miembro o administrador del proyecto');
			return res.status(403).send({ error: error.message });
		}

		// Check if the user is already in the team
		if (
			req.project.team.some(
				teamMember => teamMember.toString() === user.id.toString()
			)
		) {
			const error = new Error('El usuario ya pertenece al equipo');
			return res.status(409).send({ error: error.message });
		}

		// Save the project
		req.project.team.push(user);
		await req.project.save();
		res.send('Usuario agregado al equipo exitosamente.');
	};

	static removeMemberById = async (req: Request, res: Response) => {
		const { userId } = req.params;

		if (
			!req.project.team.some(
				teamMember => teamMember.toString() === userId.toString()
			)
		) {
			const error = new Error('El usuario no pertenece al equipo');
			return res.status(409).send({ error: error.message });
		}

		// Remove the user from the team
		req.project.team = req.project.team.filter(
			teamMember => teamMember.toString() !== userId.toString()
		);

		//Save the project
		await req.project.save();
		res.send('Usuario eliminado del equipo exitosamente.');
	};
}
