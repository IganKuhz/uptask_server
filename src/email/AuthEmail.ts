import { transport } from '../config/nodemailer';

interface IEmail {
	userName: string;
	email: string;
	token: string;
}

export class AuthEmail {
	// Send an email to verify the user's email
	static sendVerificationEmail = async (user: IEmail) => {
		const info = await transport.sendMail({
			from: 'UpTask <uptask_admin@blackhatcode.com>',
			to: user.email,
			subject: 'UpTask Admin: Confirmación de cuenta',
			html: `
          <h2>Hola ${user.userName}</h2>
          <p>Gracias por registrarte en UpTask. Para confirmar tu cuenta, haz clic en el siguiente enlace:</p>
					<a href="${process.env.CLIENT_URL}/auth/confirm">Confirmar cuenta</a>
          
          <p>e ingresa el siguiente código de confirmación:</p>
          <b>${user.token}</b>

          <p>Si no puedes hacer clic en el enlace, copia y pega la siguiente URL en tu navegador:</p>
          <p>${process.env.CLIENT_URL}/auth/confirm</p>

          <p>Si no has solicitado la creación de una cuenta en UpTask, por favor ignora este correo.</p>
				`,
		});
	};

	static sendPasswordResetEmail = async (user: IEmail) => {
		const info = await transport.sendMail({
			from: 'UpTask <uptask_admin@blackhatcode.com>',
			to: user.email,
			subject: 'UpTask Admin: Restablecimiento de contraseña',
			html: `
          <h2>Hola ${user.userName}</h2>
					<p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en UpTask.</p>
					<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
					<a href="${process.env.CLIENT_URL}/auth/new-password">Restablecer contraseña</a>

					<p>e ingresa el siguiente código de restablecimiento:</p>
          <b>${user.token}</b>

					<p>Si no puedes hacer clic en el enlace, copia y pega la siguiente URL en tu navegador:</p>
          <p>${process.env.CLIENT_URL}/auth/new-password</p>

					<p>Si no has solicitado el restablecimiento de tu contraseña, por favor ignora este correo.</p>
				`,
		});
	};
}
