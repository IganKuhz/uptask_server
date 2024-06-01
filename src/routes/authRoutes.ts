import { Router } from 'express';
import { body, param } from 'express-validator';
import { AuthController } from '../controllers/AuthController';
import { authenticate } from '../middleware/auth';
import { handleInputErrors } from '../middleware/validation';

const router = Router();

// Routes for authentication
router.post(
	'/create-account',
	body('userName')
		.isString()
		.notEmpty()
		.withMessage('El nombre de usuario es requerido.'),
	body('password')
		.isString()
		.notEmpty()
		.isLength({ min: 8 })
		.withMessage('La contraseña debe tener al menos 8 caracteres.'),
	body('passwordConfirm').custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error('Las contraseñas no coinciden.');
		}
		return true;
	}),
	body('email').isEmail().withMessage('El correo electrónico no es válido.'),
	handleInputErrors,
	AuthController.createAccount
);

router.post(
	'/confirm-account',
	body('token').isString().notEmpty().withMessage('El token es requerido.'),
	handleInputErrors,
	AuthController.confirmAccount
);

router.post(
	'/login',
	body('email').isEmail().withMessage('El correo electrónico no es válido.'),
	body('password').notEmpty().withMessage('La contraseña es requerida.'),
	handleInputErrors,
	AuthController.login
);

router.post(
	'/request-token',
	body('email').isEmail().withMessage('El correo electrónico no es válido.'),
	handleInputErrors,
	AuthController.requestToken
);

router.post(
	'/reset-password',
	body('email').isEmail().withMessage('El correo electrónico no es válido.'),
	handleInputErrors,
	AuthController.resetPassword
);

router.post(
	'/confirm-reset-password',
	body('token')
		.isString()
		.notEmpty()
		.withMessage('El codigo de confirmacion es requerido.'),
	handleInputErrors,
	AuthController.confirmResetPassword
);
router.post(
	'/new-password/:token',
	param('token').isString().notEmpty().withMessage('El token es requerido.'),
	body('password')
		.isString()
		.notEmpty()
		.isLength({ min: 8 })
		.withMessage('La contraseña debe tener al menos 8 caracteres.'),
	body('passwordConfirm').custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error('Las contraseñas ingresadas no coinciden.');
		}
		return true;
	}),
	handleInputErrors,
	AuthController.newPassword
);

router.get('/user', authenticate, AuthController.getUser);

// Profile routes
router.put(
	'/profile',
	authenticate,
	body('userName')
		.isString()
		.notEmpty()
		.withMessage('El nombre de usuario es requerido.'),
	body('email').isEmail().withMessage('El correo electrónico no es válido.'),
	handleInputErrors,
	AuthController.updateUserProfile
);

router.post(
	'/profile/change-password',
	authenticate,
	body('currPassword')
		.isString()
		.notEmpty()
		.withMessage('La contraseña actual es requerida.'),
	body('password')
		.isString()
		.notEmpty()
		.isLength({ min: 8 })
		.withMessage('La nueva contraseña debe tener al menos 8 caracteres.'),
	body('confirmPassword').custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error('Las contraseñas ingresadas no coinciden.');
		}
		return true;
	}),
	handleInputErrors,
	AuthController.changePassword
);

router.post(
	'/check-password',
	authenticate,
	body('password')
		.isString()
		.notEmpty()
		.withMessage('La contraseña es requerida.'),
	handleInputErrors,
	AuthController.checkPassword
);

export default router;
