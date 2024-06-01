import type { Request, Response } from 'express';
import { AuthEmail } from '../email/AuthEmail';
import Token from '../models/Token';
import User from '../models/User';
import { hashPassword, validatePassword } from '../utils/auth';
import { generateJWToken } from '../utils/jwt';
import { tokenGenerator } from '../utils/token';

export class AuthController {
	// Create a new account
	static createAccount = async (req: Request, res: Response) => {
		try {
			const { password, email } = req.body;

			// Check if the email is already registered
			const userExist = await User.findOne({ email });
			if (userExist) {
				const error = new Error(
					'El correo electrónico ya está registrado. Por favor inicia sesión o restablece tu contraseña.'
				);
				return res.status(409).send({ error: error.message });
			}

			// Create a new user
			const user = new User(req.body);

			// Hash the password
			user.password = await hashPassword(password);

			// Generate a token for email verification
			const token = new Token();
			token.token = tokenGenerator();
			token.userId = user.id;

			// Send the email with the token
			AuthEmail.sendVerificationEmail({
				userName: user.userName,
				email: user.email,
				token: token.token,
			});

			// Save the user if the email is not registered
			await Promise.allSettled([user.save(), token.save()]);
			if (!user) {
				const error = new Error('No se pudo crear la cuenta');
				return res.status(400).send({ error: error.message });
			}
			res.send(
				'Cuenta creada exitosamente, verifica tu correo electrónico para confirmar tu cuenta.'
			);
		} catch (error) {
			res.status(500).json({
				error:
					'No se pudo crear la cuenta, inténtalo nuevamente. Si el problema persiste, contacta al administrador.',
			});
		}
	};

	// Confirm the account
	static confirmAccount = async (req: Request, res: Response) => {
		try {
			const { token } = req.body;

			// Find the token
			const tokenExist = await Token.findOne({ token });
			if (!tokenExist) {
				const error = new Error(
					'El código de confirmación no es válido o ha expirado, solicita uno nuevo.'
				);
				return res.status(401).send({ error: error.message });
			}

			// Find the user and confirm the account
			const user = await User.findById(tokenExist.userId);
			if (!user) {
				const error = new Error('El usuario no existe.');
				return res.status(404).send({ error: error.message });
			}

			// Delete the token
			user.confirmed = true;
			await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
			res.send('Cuenta confirmada exitosamente, ya puedes iniciar sesión.');
		} catch (error) {
			res.status(500).json({
				error:
					'No se pudo confirmar la cuenta, solicita un nuevo código de confirmación. Si el problema persiste, contacta al administrador.',
			});
		}
	};

	// Log in
	static login = async (req: Request, res: Response) => {
		try {
			const { email, password } = req.body;

			// Find the user
			const user = await User.findOne({ email });
			if (!user) {
				const error = new Error(
					'El correo electrónico no está registrado. Por favor crea una cuenta.'
				);
				return res.status(401).send({ error: error.message });
			}

			// Check if the account is confirmed, if not, send a mail with the token
			if (!user.confirmed) {
				// Generate a token for email verification
				const token = new Token();
				token.userId = user.id;
				token.token = tokenGenerator();
				// Save the token if the user exists
				await token.save();

				// Send the email with the token
				AuthEmail.sendVerificationEmail({
					userName: user.userName,
					email: user.email,
					token: token.token,
				});

				const error = new Error(
					'La cuenta no está confirmada, te hemos enviado un correo electrónico con la instrucciones para confirmarla.'
				);
				return res.status(401).send({ error: error.message });
			}

			// Compare the password
			const match = await validatePassword(password, user.password);
			if (!match) {
				const error = new Error(
					'La contraseña es incorrecta. Inténtalo nuevamente.'
				);
				return res.status(401).send({ error: error.message });
			}

			// Generate a JWT token
			const token = generateJWToken({ id: user.id });
			res.send(token);
		} catch (error) {
			res.status(500).json({
				error:
					'Hubo un error al intentar iniciar tu sesión, inténtalo nuevamente. Si el problema persiste, contacta al administrador.',
			});
		}
	};

	// Send a password reset email request
	static requestToken = async (req: Request, res: Response) => {
		try {
			const { email } = req.body;

			// Check if the user exists
			const user = await User.findOne({ email });
			if (!user) {
				const error = new Error(
					'El correo electrónico no está registrado. Por favor crea una cuenta.'
				);
				return res.status(404).send({ error: error.message });
			}

			if (user.confirmed) {
				const error = new Error(
					'Cuenta confirmada exitosamente, ya puedes iniciar sesión.'
				);
				return res.status(403).send({ error: error.message });
			}

			// Generate a token for email verification
			const token = new Token();
			token.token = tokenGenerator();
			token.userId = user.id;

			// Send the email with the token
			AuthEmail.sendVerificationEmail({
				userName: user.userName,
				email: user.email,
				token: token.token,
			});

			// Save the token if the user exists
			await token.save();
			res.send(
				'Código de confirmación enviado exitosamente, verifica tu correo electrónico para confirmar tu cuenta.'
			);
		} catch (error) {
			res.status(500).json({
				error:
					'No se pudo enviar el código de confirmación, inténtalo nuevamente. Si el problema persiste, contacta al administrador.',
			});
		}
	};

	static resetPassword = async (req: Request, res: Response) => {
		try {
			const { email } = req.body;

			const user = await User.findOne({ email });
			if (!user) {
				const error = new Error(
					'El correo electrónico no está registrado. Por favor crea una cuenta.'
				);
				return res.status(404).send({ error: error.message });
			}

			// Generate a token for email verification
			const token = new Token();
			token.token = tokenGenerator();
			token.userId = user.id;
			await token.save();

			// Send the email with the token
			AuthEmail.sendPasswordResetEmail({
				userName: user.userName,
				email: user.email,
				token: token.token,
			});

			res.send(
				'Código de restablecimiento enviado exitosamente, verifica tu correo electrónico para restablecer su contraseña.'
			);
		} catch (error) {
			res.status(500).json({
				error:
					'No se pudo enviar el código de restablecimiento, inténtalo nuevamente. Si el problema persiste, contacta al administrador.',
			});
		}
	};

	static confirmResetPassword = async (req: Request, res: Response) => {
		try {
			const { token } = req.body;

			// Find the token
			const tokenExist = await Token.findOne({ token });
			if (!tokenExist) {
				const error = new Error(
					'El código de restablecimiento no es válido o ha expirado, solicita uno nuevo.'
				);
				return res.status(401).send({ error: error.message });
			}

			res.send(
				'Código de restablecimiento válido, ya puedes ingresar una nueva contraseña.'
			);
		} catch (error) {
			res.status(500).json({
				error:
					'No se pudo validar el código de restablecimiento, inténtalo nuevamente. Si el problema persiste, contacta al administrador.',
			});
		}
	};

	static newPassword = async (req: Request, res: Response) => {
		try {
			const { token } = req.params;
			const { password } = req.body;

			// Find the token
			const tokenExist = await Token.findOne({ token });
			if (!tokenExist) {
				const error = new Error(
					'El código de restablecimiento no es válido o ha expirado, solicita uno nuevo.'
				);
				return res.status(401).send({ error: error.message });
			}

			// Find the user
			const user = await User.findById(tokenExist.userId);
			if (!user) {
				const error = new Error('El usuario no existe.');
				return res.status(404).send({ error: error.message });
			}

			// Hash the new password
			user.password = await hashPassword(password);

			// Delete the token and save the user with the new password
			await Promise.allSettled([user.save(), tokenExist.deleteOne()]);
			res.send(
				'Contraseña restablecida exitosamente. Ya puedes inicia sesión con la nueva contraseña.'
			);
		} catch (error) {
			res.status(500).json({
				error:
					'No se pudo restablecer la contraseña, inténtalo nuevamente. Si el problema persiste, contacta al administrador.',
			});
		}
	};

	static getUser = async (req: Request, res: Response) => {
		return res.json(req.user);
	};

	// Profile
	static updateUserProfile = async (req: Request, res: Response) => {
		const { userName, email } = req.body;

		const userExist = await User.findOne({ email });
		if (userExist && userExist.id.toString() !== req.user.id.toString()) {
			const error = new Error(
				'El correo electrónico ya está registrado. Por favor ingresa otro.'
			);
			return res.status(409).send({ error: error.message });
		}

		req.user.userName = userName;
		req.user.email = email;
		try {
			await req.user.save();
			res.send('Perfil actualizado exitosamente.');
		} catch (error) {
			res.status(500).json({
				error:
					'No se pudo actualizar el perfil, inténtalo nuevamente. Si el problema persiste, contacta al administrador.',
			});
		}
	};

	static changePassword = async (req: Request, res: Response) => {
		const { currPassword, password } = req.body;

		const user = await User.findById(req.user.id);

		const isCurrPassword = await validatePassword(currPassword, user.password);

		if (!isCurrPassword) {
			const error = new Error('La contraseña actual es incorrecta.');
			return res.status(401).send({ error: error.message });
		}

		if (isCurrPassword === password) {
			const error = new Error(
				'La nueva contraseña no puede ser igual a la actual.'
			);
			return res.status(401).send({ error: error.message });
		}

		try {
			user.password = await hashPassword(password);
			await user.save();
			res.send('Contraseña actualizada exitosamente.');
		} catch (error) {
			res.status(500).json({
				error:
					'No se pudo cambiar la contraseña, inténtalo nuevamente. Si el problema persiste, contacta al administrador.',
			});
		}
	};

	static checkPassword = async (req: Request, res: Response) => {
		const { password } = req.body;

		const user = await User.findById(req.user.id);

		const isCurrPassword = await validatePassword(password, user.password);

		if (!isCurrPassword) {
			const error = new Error('La contraseña es incorrecta.');
			return res.status(401).send({ error: error.message });
		}
		res.send('La contraseña es correcta.');
	};
}
