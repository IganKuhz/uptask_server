import colors from 'colors';
import server from './server';

const port = process.env.PORT || 4000;

server.listen(port, () => {
	console.log(colors.cyan.bold('Starting server...'));
	console.log(
		colors.cyan.bold(`Server is running on http://localhost:${port} 🌎`)
	);
	console.log(colors.cyan.bold('Press Ctrl+C to quit.'));
});
