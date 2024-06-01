import { Router } from 'express';
import { body, param } from 'express-validator';
import { NoteController } from '../controllers/NoteController';
import { ProjectController } from '../controllers/ProjectController';
import { TaskController } from '../controllers/TaskController';
import { TeamController } from '../controllers/TeamController';
import { authenticate } from '../middleware/auth';
import { validateProject } from '../middleware/project';
import { hasAuthorization, validateTask } from '../middleware/task';
import { handleInputErrors } from '../middleware/validation';

const router = Router();

router.use(authenticate);

// Routes for projects
router.post(
	'/',
	body('projectName')
		.isString()
		.notEmpty()
		.withMessage('El nombre del proyecto es requerido.'),
	body('clientName')
		.isString()
		.notEmpty()
		.withMessage('El cliente del proyecto es requerido.'),
	body('description')
		.isString()
		.notEmpty()
		.withMessage('La descripción del proyecto es requerida.'),
	// body('status').isString().withMessage('El estado del proyecto es requerido.'),
	// body('startDate').isDate().withMessage('La fecha de inicio del proyecto es requerida.'),
	// body('endDate').isDate().withMessage('La fecha de finalización del proyecto es requerida.'),
	// body('budget').isNumeric().withMessage('El presupuesto del proyecto es requerido.'),
	// body('team').isArray().withMessage('El equipo del proyecto es requerido.'),
	handleInputErrors,
	ProjectController.createProject
);
router.get('/', ProjectController.getAllProjects);
router.get(
	'/:id',
	param('id').isMongoId().withMessage('El ID del proyecto no es válido.'),
	handleInputErrors,
	ProjectController.getProjectById
);

// Routes for tasks
router.param('projectId', validateProject); // Middleware to validate project exists

router.put(
	'/:projectId',
	param('projectId')
		.isMongoId()
		.withMessage('El ID del proyecto no es válido.'),
	body('projectName')
		.isString()
		.notEmpty()
		.withMessage('El nombre del proyecto es requerido.'),
	body('clientName')
		.isString()
		.notEmpty()
		.withMessage('El cliente del proyecto es requerido.'),
	body('description')
		.isString()
		.notEmpty()
		.withMessage('La descripción del proyecto es requerida.'),
	handleInputErrors,
	hasAuthorization,
	ProjectController.updateProject
);
router.delete(
	'/:projectId',
	param('projectId')
		.isMongoId()
		.withMessage('El ID del proyecto no es válido.'),
	handleInputErrors,
	hasAuthorization,
	ProjectController.deleteProject
);
router.post(
	'/:projectId',
	param('projectId')
		.isMongoId()
		.withMessage('El ID del proyecto no es válido.'),
	handleInputErrors,
	hasAuthorization,
	ProjectController.duplicateProject
);

router.post(
	'/:projectId/tasks',
	hasAuthorization,
	body('taskName')
		.isString()
		.notEmpty()
		.withMessage('El nombre del tarea es requerido.'),
	body('description')
		.isString()
		.notEmpty()
		.withMessage('La descripción del proyecto es requerida.'),
	TaskController.createTask
);
router.get('/:projectId/tasks', validateProject, TaskController.getAllTasks);
// MIDLEWARES
router.param('taskId', validateTask); // Middleware to validate task exists
router.param('taskId', validateProject); // Middleware to validate task belongs to project
router.get(
	'/:projectId/tasks/:taskId',
	param('taskId').isMongoId().withMessage('El ID de la tarea no es válido.'),
	TaskController.getTaskById
);
router.put(
	'/:projectId/tasks/:taskId',
	hasAuthorization,
	param('taskId').isMongoId().withMessage('El ID de la tarea no es válido.'),
	body('taskName')
		.isString()
		.notEmpty()
		.withMessage('El nombre del tarea es requerido.'),
	body('description')
		.isString()
		.notEmpty()
		.withMessage('La descripción del proyecto es requerida.'),
	TaskController.updateTask
);
router.delete(
	'/:projectId/tasks/:taskId',
	hasAuthorization,
	param('taskId').isMongoId().withMessage('El ID de la tarea no es válido.'),
	TaskController.deleteTask
);
router.post(
	'/:projectId/tasks/:taskId/status',
	param('taskId').isMongoId().withMessage('El ID de la tarea no es válido.'),
	body('status').notEmpty().withMessage('El estado de la tarea es requerido.'),
	handleInputErrors,
	TaskController.updateTaskStatus
);
// router.post(
// 	'/:projectId/tasks/:taskId/duplicate',
// 	param('taskId').isMongoId().withMessage('El ID del proyecto no es válido.'),
// 	handleInputErrors,
// 	TaskController.duplicateTask
// );

// Routes for teams
router.post(
	'/:projectId/team/find',
	body('email').isEmail().withMessage('El correo electrónico no es válido.'),
	handleInputErrors,
	TeamController.findTeamMember
);

router.get('/:projectId/team', TeamController.getProjectTeam);

router.post(
	'/:projectId/team',
	body('id').isMongoId().withMessage('El ID del usuario no es válido.'),
	handleInputErrors,
	TeamController.addMemberById
);

router.delete(
	'/:projectId/team/:userId',
	param('userId').isMongoId().withMessage('El ID del usuario no es válido.'),
	handleInputErrors,
	TeamController.removeMemberById
);

// Routes for notes
router.post(
	'/:projectId/tasks/:taskId/notes',
	body('content')
		.isString()
		.notEmpty()
		.withMessage('El contenido de la nota es requerido.'),
	handleInputErrors,
	NoteController.createNote
);

router.get('/:projectId/tasks/:taskId/notes', NoteController.getTaskNotes);

router.delete(
	'/:projectId/tasks/:taskId/notes/:noteId',
	param('noteId').isMongoId().withMessage('El ID de la nota no es válido.'),
	handleInputErrors,
	NoteController.deleteNote
);
export default router;
